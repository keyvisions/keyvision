/* Copyright (C) 2017 Giancarlo Trevisan - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the MIT license.
 */
var socket = io.connect(),
  KBL; // Keyboard layout

socket.on("init", layout => {
  KBL = JSON.parse(layout) || {};
  KBL.state = {
    mode: "CtrlShiftu", // LeftAlt | CtrlShiftu
    K71: false, // Scroll Lock
    K83: false, // Num Lock
    K57: false, // Caps Lock
    modifiers: 0,
    repeatDelay: 700,
    repeatRate: 30,
    delayID: 0,
    repeaterID: 0
  };

  renderKeyboard();

  document.body.addEventListener("touchstart", touchstart);
  document.body.addEventListener("touchmove", touchcancel);
  document.body.addEventListener("touchend", touchend);
  document.body.addEventListener("touchcancel", touchcancel);
  document.body.addEventListener("contextmenu", touchcancel);

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
  kb.innerHTML = "<div id=\"statusbar\"></div>"; // Clear keyboard

  var x = Math.round(padding),
    y = Math.round(padding);

  KBL.keys.forEach((key, i) => {
    x = (key.dx === null || i === 0) ? Math.round(padding) : x + Math.round((size + 2 * padding) * (1 + key.dx || 1));
    y += (key.dx === null && !key.dy) ? Math.round(size + 2 * padding) : Math.round((size + 2 * padding) * (key.dy || 0));

    var el = document.createElement("div");
    if (key.id) el.id = "K" + key.id;
    el.className = key.id ? "key" : "placeholder";
    el.setAttribute("data-type", key.type || 1);
    el.style.top = `${y}px`, el.style.left = `${x}px`;

    el.style.width = `${Math.round((size + 2 * padding) * (key.dw || 1) - 2 * padding)}px`;
    x += Math.round((size + 2 * padding) * ((key.dw || 1) - 1));

    el.style.height = `${Math.round((size + 2 * padding) * (key.dh || 1) - 2 * padding)}px`;

    for (var j = 0; j < key.labels.length && j < 4; ++j)
      el.innerHTML += key.id ? `<div class="${key.labels[j].length === 1 ? "char " : ""}c${key.type || 1}${j}">${key.labels[j]}</div>` : key.labels[j];
    kb.appendChild(el);
  });

  KBL.chars = document.querySelectorAll(".char"); // Used to handle character case

  // Load saved keyboard state
  ["K71", "K83", "K57"].forEach(lock => {
    if (document.getElementById(lock) && localStorage.getItem(lock) === "true") {
      document.getElementById(lock).classList.add("selected");
      KBL.state[lock] = true;
    }
  });

  // Reflect Caps Lock
  if (KBL.state.K57) KBL.chars.forEach(char => char.innerHTML = char.innerHTML.toUpperCase());
}

function getButton(el) {
  window.getSelection().removeAllRanges();

  while (el && !el.id)
    el = el.parentElement;
  return el;
}

function asHIDPacket(modifiers, key, terminate) {
  //document.getElementById("statusbar").innerHTML += "(" + modifiers + ", " + key + ") ";
  return `${String.fromCharCode(modifiers)}\0${String.fromCharCode(key)}\0\0\0\0\0${terminate === true ? "\0\0\0\0\0\0\0\0" : ""}`;
}

// Packet sequence for Ctrl+Shift+u [unicode] combination
function CtrlShiftu(unicode) {
  var packet = asHIDPacket(3, 24, true); // Ctrl+Shift+u

  unicode.toString(16).split("").forEach(digit => {
    packet += asHIDPacket(0, [39, 30, 31, 32, 33, 34, 35, 36, 37, 38, 4, 5, 6, 7, 8, 9][parseInt(digit, 16)], true);
  });
  packet += asHIDPacket(0, 44, true); // Space

  return packet;
}

// Packet sequence for LeftAlt [unicode] combinaton
function LeftAlt(unicode) {
  var packet = asHIDPacket(4, 226) + asHIDPacket(4, 98);

  unicode.toString().split("").forEach(digit => {
    packet += asHIDPacket(4, [98, 89, 90, 91, 92, 93, 94, 95, 96, 97][parseInt(digit)]);
  });
  packet += asHIDPacket(0, 0);

  return packet;
}

function touchstart(event) {
  event.preventDefault();
  event.stopPropagation();

  var btn = getButton(event.target);
  if (btn && btn.id) {
    // LeftControl, LeftShift, LeftAlt, LeftGUI, RightControl, RightShift, RightAlt, RightGUI
    var modifier = ["K224", "K225", "K226", "K227", "K228", "K229", "K230", "K231"].indexOf(btn.id);
    if (modifier !== -1)
      KBL.state.modifiers |= 1 << modifier;

    if (btn.getAttribute("data-type") === "2") {
      // Handle as unicode HID packet
      var unicode = btn.querySelector(".c20").innerText.charCodeAt(0); // Shift

      if (KBL.state.modifiers === 0 && btn.querySelector(".c21")) // Nothing
        unicode = btn.querySelector(".c21").innerText.charCodeAt(0);
      if (KBL.state.modifiers === 64 && btn.querySelector(".c22")) // RightAlt
        unicode = btn.querySelector(".c22").innerText.charCodeAt(0);
      if ((KBL.state.modifiers === 66 || KBL.state.modifiers === 96) && btn.querySelector(".c23")) // RightAlt+Shift

        unicode = btn.querySelector(".c23").innerText.charCodeAt(0);

      var packet;
      if (KBL.state.mode === "LeftAlt")
        packet = LeftAlt(unicode);
      else
        packet = CtrlShiftu(unicode);

      // Unlock CapsLock if active since it interferes with this packet
      if (KBL.state.K57)
        packet = asHIDPacket(0, 57, true) + packet + asHIDPacket(0, 57, true);

      socket.send(packet);

      if (KBL.state.repeaterID !== 0)
        clearInterval(KBL.state.repeaterID);
      KBL.state.delayID = setTimeout(() => {
        KBL.state.repeaterID = setInterval(() => {
          socket.send(packet);
        }, KBL.state.repeatRate);
      }, KBL.state.repeatDelay);

    } else {
      // Handle as regular HID packet
      socket.send(asHIDPacket(KBL.state.modifiers, parseInt(btn.id.substring(1))));
    }

    if (KBL.state.hasOwnProperty(btn.id)) {
      btn.classList.toggle("selected");
      KBL.state[btn.id] = btn.classList.contains("selected");
      localStorage.setItem(btn.id, KBL.state[btn.id]);
    } else
      btn.classList.add("selected");
  }

  // Reflect Shift or Caps Lock
  KBL.chars.forEach(char => char.innerHTML = ((KBL.state.modifiers & 34) !== 0 || KBL.state.K57) ? char.innerHTML.toUpperCase() : char.innerHTML.toLowerCase());
}

function touchcancel(event) {
  event.preventDefault();
  event.stopPropagation();
}

function touchend(event) {
  event.preventDefault();
  event.stopPropagation();

  var btn = getButton(event.target);
  if (btn && btn.id) {
    // LeftControl, LeftShift, LeftAlt, LeftGUI, RightControl, RightShift, RightAlt, RightGUI
    var modifier = ["K224", "K225", "K226", "K227", "K228", "K229", "K230", "K231"].indexOf(btn.id);
    if (modifier !== -1)
      KBL.state.modifiers ^= 1 << modifier;

    if (KBL.state.delayID !== 0)
      clearTimeout(KBL.state.delayID);
    if (KBL.state.repeaterID !== 0) {
      clearInterval(KBL.state.repeaterID);
      KBL.state.repeaterID = 0;
    }

    // Send clear HID packet
    var id = parseInt(btn.id.substring(1));
    if ((KBL.state.mode === "LeftAlt" && KBL.state.modifiers === 4 && id >= 89 && id <= 98) === false) {
      socket.send(asHIDPacket(0, 0));
    }

    if (!KBL.state.hasOwnProperty(btn.id))
      btn.classList.remove("selected");
  }

  // Reflect Shift or Caps Lock
  KBL.chars.forEach(char => char.innerHTML = ((KBL.state.modifiers & 34) !== 0 || KBL.state.K57) ? char.innerHTML.toUpperCase() : char.innerHTML.toLowerCase());
}
