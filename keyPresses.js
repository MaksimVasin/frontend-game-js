(function() {
  window.keyPresses = {};
  window.addEventListener('keydown', keyDownListener, false);
  function keyDownListener(evt) {
    keyPresses[evt.key] = true;
  };
  window.addEventListener('keyup', keyUpListener, false);
  function keyUpListener(evt) {
    keyPresses[evt.key] = false;
  }
})();

