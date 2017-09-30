/* Copyright (C) 2017 Giancarlo Trevisan - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the MIT license.
 */
var socket = io.connect(),
  KBL; // Keyboard layout

// http://www.usb.org/developers/hidpage/Hut1_12v2.pdf (Page 53, Table 12)
// https://docs.mbed.com/docs/ble-hid/en/latest/api/md_doc_HID.html
// http://isticktoit.net/?p=1383

socket.on("init", layout => {
  KBL = JSON.parse(layout) || {};
  KBL.state = {
    CapsLock: false,
    NumLock: false,
    ScrollLock: false,
    packet: [0, 0, 0, 0, 0, 0, 0, 0]
  };

  renderKeyboard();

  document.body.addEventListener("touchstart", touchstart);
  document.body.addEventListener("mousedown", touchstart);
  document.body.addEventListener("touchmove", touchmove);
  document.body.addEventListener("touchend", touchend);
  document.body.addEventListener("mouseup", touchend);
  document.body.addEventListener("touchcancel", touchend);
  window.addEventListener("resize", renderKeyboard);
});
socket.on("font", font => {
  stylesheet.cssRules[2].style.fontFamily = font.family || 'inherit';
  stylesheet.cssRules[2].style.fontStyle = font.style || 'inherit';
  stylesheet.cssRules[2].style.fontWeight = font.weight || 'inherit';
});
socket.on("hilite", code => {}); // hilite specific key
socket.on("key", key => {}); // Set specific key

function renderKeyboard() {
  var kb = document.body,
    size = Math.min(kb.offsetWidth / KBL.size.cols, kb.offsetHeight / KBL.size.rows),
    padding = 0.05 * size;

  // Set proportions
  size -= 2 * padding;
  var stylesheet = document.styleSheets[0];
  stylesheet.cssRules[0].style.fontSize = `${Math.round(size / 4.5)}px`;
  stylesheet.cssRules[1].style.width = `${size}px`;
  stylesheet.cssRules[1].style.height = `${size}px`;

  // Draw keyboard
  kb.innerHTML = ""; // Clear keyboard

  var x = Math.round(padding), y = Math.round(padding);

  KBL.keys.forEach((key, i) => {
    x = (key.dx === null || i === 0) ? Math.round(padding) : x + Math.round((size + 2 * padding) * (1 + key.dx || 1));
    y += (key.dx === null && !key.dy) ? Math.round(size + 2 * padding) : Math.round((size + 2 * padding) * (key.dy || 0));

    var el = document.createElement("div");
    if (key.id) el.id = key.id;
    el.className = key.id ? "key" : "placeholder";
    if (key.name) el.setAttribute("data-name", key.name);
    el.setAttribute("data-type", key.type || 1);
    el.style.top = `${y}px`, el.style.left = `${x}px`;

    el.style.width = `${Math.round((size + 2 * padding) * (key.dw || 1) - 2 * padding)}px`;
    x += Math.round((size + 2 * padding) * ((key.dw || 1) - 1));

    el.style.height = `${Math.round((size + 2 * padding) * (key.dh || 1) - 2 * padding)}px`;

    for (var j = 0; j < key.labels.length && j < 4; ++j)
      el.innerHTML += key.name ? `<div class="${key.labels[j].length === 1 ? "char " : ""}c${key.type || 1}${j}">${key.labels[j]}</div>` : key.labels[j];
    kb.appendChild(el);
  });

  KBL.chars = document.querySelectorAll(".char"); // Used to handle character case

  ["ScrollLock", "NumLock", "CapsLock"].forEach(lock => {
    if (document.querySelector(`[data-name="${lock}"]`) && localStorage.getItem(lock) === "true") {
      document.querySelector(`[data-name="${lock}"]`).classList.add("selected");
      KBL.state[lock] = true;
    }
  });
}

function getButton(el) {
  window.getSelection().removeAllRanges();

  while (el && !el.id) 
    el = el.parentElement;
  return el;
}

function asHIDPacket(data) {
  var packet = "";
  data.forEach(number => packet += String.fromCharCode(number));
  return packet;
}

function touchstart(event) {
  event.preventDefault();
  event.stopPropagation();

  var btn = getButton(event.target);
  if (btn && btn.getAttribute("data-name")) {
    var Name = btn.getAttribute("data-name");

    var modifier = ["ControlLeft", "ShiftLeft", "AltLeft", "MetaLeft", "ControlRight", "ShiftRight", "AltRight", "MetaRight"].indexOf(Name);
    if (modifier !== -1)
      KBL.state.packet[0] |= 1 << modifier;

    if (KBL.state.packet.indexOf(parseInt(btn.id), 2) === -1 && KBL.state.packet.indexOf(0, 2) !== -1)
      KBL.state.packet[KBL.state.packet.indexOf(0, 2)] = parseInt(btn.id);

    if (btn.getAttribute("data-type") === "2") {
      var unicode = btn.querySelector(".c20").innerText.charCodeAt(0); // Shift
      if (KBL.state.packet[0] === 0 && btn.querySelector(".c21")) // Nothing
        unicode = btn.querySelector(".c21").innerText.charCodeAt(0);
      if (KBL.state.packet[0] === 64 && btn.querySelector(".c22")) // AltRight
        unicode = btn.querySelector(".c22").innerText.charCodeAt(0);
      if ((KBL.state.packet[0] === 66 || KBL.state.packet[0] === 96) && btn.querySelector(".c23")) // AltRight+Shift
        unicode = btn.querySelector(".c23").innerText.charCodeAt(0);

      // Send HID packets sequence as CTRL+SHIFT+u 0[unicode] or ALTGR+[unicode]
      var digitsId = [39, 30, 31, 32, 33, 34, 35, 36, 37, 38, 4, 5, 6, 7, 8, 9];
      socket.send(asHIDPacket([3, 0, 24, 0, 0, 0, 0, 0]));
      socket.send(asHIDPacket([0, 0, 39, 0, 0, 0, 0, 0]));
      unicode.toString(16).split("").forEach(digit => {
        socket.send(asHIDPacket([0, 0, digitsId[parseInt(digit, 16)], 0, 0, 0, 0, 0]));
      });
      socket.send(asHIDPacket([0, 0, 40, 0, 0, 0, 0, 0]));
      socket.send(asHIDPacket([0, 0, 0, 0, 0, 0, 0, 0]));
    } else if (modifier === -1) {
      // Send HID packet
      socket.send(asHIDPacket(KBL.state.packet));
    }

    if (KBL.state.hasOwnProperty(Name)) 
      KBL.state[Name] = btn.classList.toggle("selected");
    else
      btn.classList.add("selected");
  }

  KBL.chars.forEach(char => char.innerHTML = ((KBL.state.packet[0] & 34) !== 0 || KBL.state["CapsLock"]) ? char.innerHTML.toUpperCase() : char.innerHTML.toLowerCase());
}        

function touchmove(event) {
  event.preventDefault();
  event.stopPropagation();
}

function touchend(event) {
  event.preventDefault();
  event.stopPropagation();

  var btn = getButton(event.target);
  if (btn && btn.getAttribute("data-name")) {
    var Name = btn.getAttribute("data-name");

    var modifier = ["ControlLeft", "ShiftLeft", "AltLeft", "MetaLeft", "ControlRight", "ShiftRight", "AltRight", "MetaRight"].indexOf(Name);
    if (modifier !== -1)
      KBL.state.packet[0] ^= 1 << modifier;

    var i = KBL.state.packet.indexOf(parseInt(btn.id), 2);
    if (i !== -1)
      KBL.state.packet[i] = 0;
    // Send HID packet
    socket.send(asHIDPacket(KBL.state.packet));

    if (!KBL.state.hasOwnProperty(Name))
      btn.classList.remove("selected");
  }

  KBL.chars.forEach(char => char.innerHTML = ((KBL.state.packet[0] & 34) !== 0 || KBL.state["CapsLock"]) ? char.innerHTML.toUpperCase() : char.innerHTML.toLowerCase());
}        

