loadImage = function(src) {
    var img = new Image;
    var newImg = new Image;
    newImg.onload = function() {
        img.src = this.src;
        console.log(src+" loaded");
    }
    newImg.src = src;
    return img;
}

update = function() {
    // timing
    var now = Date.now();
    var dt = now - lastTick;
    lastTick = now;

    // draw animation
    walk.frame = (walk.frame + 1/10) % 2;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(walk, 0 + Math.floor(walk.frame)*24, 0, 24, 24, 0, 0, 24*4, 24*4);

    context.drawImage(ruins, 24*4, 0, ruins.width*4, ruins.height*4);

    // fps counter
    context.fillStyle = "#fff";
    context.fillText(Math.round(1000/dt), canvas.width-20, 10);
}

// set up context
var canvas = document.createElement("canvas");
canvas.width = 640;
canvas.height = 360;
var context = canvas.getContext("2d");
document.body.insertBefore(canvas, document.body.childNodes[0]);
context.imageSmoothingEnabled = false;

// load assets
var walk = loadImage('img/walk.png');
walk.frame = 0;
var ruins = loadImage('img/ruins.png');

// start loop
var interval = setInterval(update, 16);
var lastTick = Date.now();
