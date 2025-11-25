// Ship-skate
const shipSkate = document.querySelector('.ship-skate');
shipSkate.style.opacity = 1;
function moveShipSkate(width, height) {
  if(width > 1200){
    let shipSkateWidth = shipSkate.offsetWidth;
    let shipSkateHeight = shipSkate.offsetHeight;

    let pagePercent = getScrollPercent()/100;

    shipSkate.style.top = ((1-(shipSkateHeight*-0.33))+((scroll*easeOutSine(pagePercent))*0.8))+'px';
    shipSkate.style.right = (1-(shipSkateWidth)+(easeOutQuad(pagePercent)*(width*0.5)))+'px';
  } else {
    shipSkate.style.top = 0;
    shipSkate.style.right = 0;
  }
}

// Scroll and resize events
let scroll = 0;
let ticking = false;
document.addEventListener('scroll', function(e) {
  scroll = window.scrollY;
});

// Animated Stars
var canvas = document.querySelector('.background');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext('2d');

oldW = canvas.width;
oldH = canvas.height;
window.addEventListener('resize', function(e){
  if(oldW-200 > canvas.offsetWidth || oldW+200 < canvas.offsetWidth || oldH-200 > canvas.offsetHeight || oldH+200 < canvas.offsetHeight){
    oldW = canvas.width = canvas.offsetWidth;
    oldH = canvas.height = canvas.offsetHeight;
    makeStars();
  }
});

let starImages = [];

let star = new Image(10, 10); star.src = 'img/star-01.png'; starImages.push(star);
star = new Image(38, 38); star.src = 'img/star-02.png'; starImages.push(star);
star = new Image(22, 27); star.src = 'img/star-03.png'; starImages.push(star);
star = new Image(19, 17); star.src = 'img/star-04.png'; starImages.push(star);
star = new Image(23, 21); star.src = 'img/star-05.png'; starImages.push(star);
star = new Image(12, 15); star.src = 'img/star-06.png'; starImages.push(star);
star = new Image(21, 22); star.src = 'img/star-07.png'; starImages.push(star);
star = new Image(24, 24); star.src = 'img/star-08.png'; starImages.push(star);
star = new Image(24, 31); star.src = 'img/star-09.png'; starImages.push(star);
star = new Image(27, 32); star.src = 'img/star-10.png'; starImages.push(star);
star = new Image(36, 36); star.src = 'img/star-11.png'; starImages.push(star);
star = new Image(14, 16); star.src = 'img/star-12.png'; starImages.push(star);

var stars = [];

function makeStars(){
  stars = [];
  for(let i = 0; i < canvas.height*0.25; i++){
    let img = rand_array(starImages);
    stars.push({ 
      img: img,
      x: rand(0, canvas.width),
      sx: (2*Math.random())+1,
      y: rand(0, canvas.height),
      sy: -0.4+(Math.random()/10),
      rotate: rand(0,360)*Math.PI/180,
      d: Math.sqrt(img.width*img.width+img.height*img.height)/100+(Math.random()/20),
      str: easeInQuad(Math.random()*0.7),
    });
  }
}
makeStars();

var last = 0;
var lastScroll = scroll;
function Draw(now) {
  window.requestAnimationFrame(Draw);

  var tick = now-last;
  last = now;

  moveShipSkate(canvas.width, canvas.height);

  let offset = scroll - lastScroll;
  lastScroll = scroll;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for(let s = 0; s < stars.length; s++){
    stars[s].x += ((tick*stars[s].sx)/300);
    stars[s].y += ((tick*stars[s].sy)/300)-(offset*stars[s].d);

    if(stars[s].x > canvas.width+stars[s].img.width){
      stars[s].x -= canvas.width+(stars[s].img.width*2);
    }
    if(stars[s].x < 0-stars[s].img.width){
      stars[s].x += canvas.width+(stars[s].img.width*2);
    }

    if(stars[s].y > canvas.height+stars[s].img.height){
      stars[s].y -= canvas.height+(stars[s].img.height*2);
    }
    if(stars[s].y < 0-stars[s].img.height){
      stars[s].y += canvas.height+(stars[s].img.height*2);
    }

    let pagePercent = getScrollPercent()/100;
    ctx.globalAlpha = 1-pagePercent+stars[s].str;//(0-stars[s].y/canvas.height);//*;

    ctx.translate(stars[s].x, stars[s].y);
    ctx.rotate(stars[s].rotate);
    ctx.drawImage(stars[s].img, -stars[s].img.width / 2, -stars[s].img.height / 2, stars[s].img.width, stars[s].img.height);
    ctx.rotate(-stars[s].rotate);
    ctx.translate(-stars[s].x, -stars[s].y);
  }
}

function startAnimation(){
  var complete = true;
  for(let s = 0; s < starImages.length; s++){
    if(!starImages[s].complete){
      complete = false;
    }
  }
  
  if(complete){
    window.requestAnimationFrame(Draw);
  } else {
    setTimeout(startAnimation, 10);
  }
}
startAnimation();


// Easing
function easeInQuad(x) {
  return x * x;
}

function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2);
}

function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}

function easeOutQuint(x) {
  return 1 - Math.pow(1 - x, 5);
}

// Utility
function rand(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function rand_array(arr){
  return arr[rand(0, arr.length-1)];
}

function getScrollPercent() {
    var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
}