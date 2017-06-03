var socket = io.connect(), KBL; // Keyboard layout

socket.on("init", layout => {
  KBL = JSON.parse(layout) || {};
  KBL.state = {
    ShiftLeft: false,
    ShiftRight: false,
    ControlLeft: false,
    ControlRight: false,
    AltLeft: false,
    AltRight: false,
    CapsLock: false,
    NumLock: false,
    ScrollLock: false,
    pressedKeys: []
  };

  renderKeyboard();

  document.body.addEventListener("touchstart", touchstart);
  document.body.addEventListener("touchmove", touchmove);
  document.body.addEventListener("touchend", touchend);
  document.body.addEventListener("touchcancel", touchend);
  window.addEventListener("resize", renderKeyboard);
});
socket.on("font", font => {
  stylesheet.cssRules[2].style.fontFamily = font.family || 'inherit';
  stylesheet.cssRules[2].style.fontStyle = font.style || 'inherit';
  stylesheet.cssRules[2].style.fontWeight = font.weight || 'inherit';
});
socket.on("hilite", code => {}); // hilite specific key

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
    if (key.code) el.id = key.code;
    el.className = key.code ? "key" : "placeholder";
    el.style.top = `${y}px`, el.style.left = `${x}px`;

    el.style.width = `${Math.round((size + 2 * padding) * (key.dw || 1) - 2 * padding)}px`;
    x += Math.round((size + 2 * padding) * ((key.dw || 1) - 1));

    el.style.height = `${Math.round((size + 2 * padding) * (key.dh || 1) - 2 * padding)}px`;

    for (var j = 0; j < key.labels.length && j < 4; ++j)
      el.innerHTML += key.code ? `<div class="${key.labels[j].length === 1 ? "char " : ""}c${key.type || 1}${j}">${key.labels[j]}</div>` : key.labels[j];
    kb.appendChild(el);
  });

  KBL.chars = document.querySelectorAll(".char"); // Used to handle character case

  ["ScrollLock", "NumLock", "CapsLock"].forEach(lock => {
    if (document.getElementById(lock) && localStorage.getItem(lock) === "true") {
      document.getElementById(lock).classList.add("selected");
      KBL.state[lock] = true;
    }
  });
}
function getButton(el) {
  window.getSelection().removeAllRanges();

  while (el && !el.id) el = el.parentElement;
  if (el.tagName === "BODY") return null;
  return el;
}
function touchstart(event) {
  event.preventDefault();
  event.stopPropagation();

  var btn = getButton(event.target);
  if (btn && btn.id) {
    if (["ScrollLock", "NumLock", "CapsLock"].indexOf(btn.id) !== -1) {
      KBL.state[btn.id] = btn.classList.toggle("selected");
      localStorage.setItem(btn.id, KBL.state[btn.id]);
    } else {
      if (KBL.onetouch)
        KBL.state.pressedKeys = [btn.id];
      else if (KBL.state.pressedKeys.indexOf(btn.id) === -1)
        KBL.state.pressedKeys.push(btn.id);
      if (KBL.state.hasOwnProperty(btn.id)) KBL.state[btn.id] = true;
      btn.classList.add("selected");
    }
  }

  KBL.chars.forEach(char => char.innerHTML = (KBL.state["ShiftLeft"] || KBL.state["ShiftRight"] || KBL.state["CapsLock"]) ? char.innerHTML.toUpperCase() : char.innerHTML.toLowerCase());
  socket.send(KBL.state);
}
function touchmove(event) {
  event.preventDefault();
  event.stopPropagation();
}
function touchend(event) {
  event.preventDefault();
  event.stopPropagation();

  var btn = getButton(event.target);
  if (btn && ["ScrollLock", "NumLock", "CapsLock"].indexOf(btn.id) === -1) {
    if (KBL.onetouch)
      KBL.state.pressedKeys = [];
    else
      KBL.state.pressedKeys.splice(KBL.state.pressedKeys.indexOf(btn.id), 1);
    if (KBL.state.hasOwnProperty(btn.id)) KBL.state[btn.id] = false;
    btn.classList.remove("selected");
  }

  KBL.chars.forEach(char => char.innerHTML = (KBL.state["ShiftLeft"] || KBL.state["ShiftRight"] || KBL.state["CapsLock"]) ? char.innerHTML.toUpperCase() : char.innerHTML.toLowerCase());
  socket.send(KBL.state);
}
