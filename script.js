var lastTimeout;

let gameWindow = document.querySelector('.game');


function GameObject(htmlElement, right, x = 0, y = 0, speedX = 5, speedY = 0) {
  this.element = htmlElement;
  this.x = x;
  this.y = y;
  this.speedX = speedX;
  this.speedY = speedY;
  this.changeX = (step) => { this.x = this.x + step; }
  this.changeY = (step) => { this.y = this.y + step; }
  this.changePositionX = () => { this.changeX(speedX) };
  this.changePositionY = () => { this.changeY(speedY) };
  this.right = right;
  this.live = true;
}

/* function intersection(GameObject1, GameObject2) {
  if (GameObject1.x)
} */

let jumpStart = true;
let jump = false;

var shootX = 0;
var shootY = 0;
var shootRight = true;
var shootLeft = true;

let shoot = false;

let spiderObj = new GameObject(document.getElementById('spider'), true, 300);

ninjaArr = [];
for (let i = 0; i < 2; i++) {
  let div = document.createElement('div');
  div.className = 'ninja';
  gameWindow.append(div);
  ninjaArr[ninjaArr.length] = new GameObject(div, true, getRandomValue(-2000, -100), getRandomValue(0, 0), getRandomValue(2, 8));
}


var webs = [];
function createWeb(right, x, y) {
  let div = document.createElement('div');
  div.className = 'web-shoot';
  gameWindow.append(div);
  
  if (right) div.style.transform = 'scale(1, 1)';
  else div.style.transform = 'scale(-1, 1)';
  div.style.opacity = 1;

  window.setTimeout(function() {
    div.style.transition = 'opacity 1s linear';
    div.style.opacity = '0';
  }, 3000);
  window.setTimeout(function() {
    webs.shift();
    gameWindow.removeChild(div);
  }, 4000);

  webs[webs.length] = new GameObject(div, right, x, y);
  console.log(webs);
}


window.debounce = function(fun) {
  window.clearTimeout(lastTimeout);
  var args = arguments;
  lastTimeout = window.setTimeout(function() {
    fun(null, args);
  }, DEBOUNCE_INTERVAL);
};


let canShoot = true;


function gameLoop() {

  if (keyPresses.d) {
    spiderObj.changeX(spiderObj.speedX); 
    spiderObj.element.style.transform = 'scale(-1, 1)';
    spiderObj.element.style.animation = 'spider 0.3s infinite linear';
    shootRight = true;
    setTimeout(function() {
      spiderObj.element.style.animation = 'none';
    }, 30)
  }
  else if (keyPresses.a) {
    spiderObj.changeX(-spiderObj.speedX);
    spiderObj.element.style.transform = 'scale(1, 1)';
    spiderObj.element.style.animation = 'spider 0.3s infinite linear';
    shootRight = false;
    setTimeout(function() {
      spiderObj.element.style.animation = 'none';
    }, 30)
  }

  if (keyPresses[' ']) {
    spiderObj.element.style['background-image'] =  "url('img/spider-shoot.svg')";

    if (canShoot) {
      createWeb(shootRight, spiderObj.x, spiderObj.y)
      canShoot = false;
      window.setTimeout(function() {canShoot = true}, 600);
    }
    shoot = true;
    setTimeout(function() {
      if (jump) spiderObj.element.style['background-image'] =  "url('img/spider-jump.svg')";
      else spiderObj.element.style['background-image'] =  "url('img/spider.svg')";
    }, 200)
  }

  for (let web of webs) {
    if (web.right) web.changeX(10);
    else web.changeX(-10);

    if (web.x + 45 > gameWindow.offsetWidth) {
      web.x = gameWindow.offsetWidth - 45;
      web.element.style['background-image'] =  "url('img/web-end.svg')";
    }
    if (web.x + 24 < 0) {
      web.x =- 24;
      web.element.style['background-image'] =  "url('img/web-end.svg')";
    }
    web.element.style.left = web.x + 'px';
    web.element.style.bottom = web.y + 'px';

    for (let ninja of ninjaArr) {
      if (web.x + 20 > ninja.x && web.x - 20 < ninja.x && web.y + 40 > ninja.y && web.y - 40 < ninja.y) {
        ninja.live = false;
        ninja.x = web.x;
      }
    }
    
  }

  if (jumpStart && keyPresses.w) {
    jumpStart = false;
    jump = true;
    spiderObj.element.style['background-image'] =  "url('img/spider-jump.svg')";
    speedY = 15;
  }

  if (jump) {
    spiderObj.element.style.animation = 'none';
    speedY-=0.5;
    spiderObj.y +=speedY;

    if (spiderObj.y <= 0) {
      spiderObj.y = 0;
      jump = false;
      jumpStart = true;
      spiderObj.element.style['background-image'] =  "url('img/spider.svg')";
    }
  }

  if (keyPresses.k && spiderObj.y - 20 > 0) {
    spiderObj.speedX=0;
    if (shootRight) spiderObj.x +=10;
    else spiderObj.x -=10;
    spiderObj.element.style.animation = 'spider-shift 0.3s infinite linear';
    /* window.setTimeout(() => {
      spiderObj.speedX = 5;
      spiderObj.element.style.animation = 'none';
    }, 100); */
  }
  else {
    /* spiderObj.element.style.animation = 'none'; */
    spiderObj.speedX=5;
  }


  
  if (spiderObj.x + 90 >= gameWindow.offsetWidth ) {
    spiderObj.x = gameWindow.offsetWidth  - 90;
  }
  if (spiderObj.x < 0) {
    spiderObj.x = 0;
  }
  spiderObj.element.style.left = spiderObj.x + 'px';
  spiderObj.element.style.bottom = spiderObj.y + 'px';


  for (let ninja of ninjaArr) {
    if (ninja.live) ninja.x+=ninja.speedX;
    else {
      ninja.element.style['background-image'] = "url('img/ninja-dead.svg')";
      ninja.element.style.animation = 'ninja-dead 0.5s 1 linear';
    }
    if (ninja.x > gameWindow.offsetWidth) ninja.x = getRandomValue(-1000, -100);
    ninja.element.style.left = ninja.x + 'px';
    ninja.element.style.bottom = ninja.y + 'px';
  }
  
  
  window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);