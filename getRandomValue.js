(function() {
  window.getRandomValue = function(a, b) {
    return a + Math.floor(Math.random() * (b - a))
  }
})();