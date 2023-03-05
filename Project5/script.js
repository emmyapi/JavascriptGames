const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;


let score = 0;
let health = 8;
let gameOver = false;
let lastFrame = 0;
ctx.font = '20px Impact';

// Used to track the time in every loop
let timeToNextRaven = 0;
// Goal is 500ms
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];

// A class instantiates an object into the world
// If called twice, we get two objects
// Due to the randomness, these two objects can have different specifications
class Raven{
    // Constructor contains properties of object we want to render
    constructor(){
        // Size of object
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        // Starting position of object
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        // Speed of object
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = "raven.png";
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = this.directionX * this.sizeModifier * 17;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        this.hasTrail = Math.random() > 0.75;
    }
    // Update allows the object to do something with its properties over time
    // Here we let it use its speed property to move
    update(deltaTime){
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.hasTrail){
            if (this.x < 0 - this.width){
                this.markedForDeletion = true;
                health = health - 3;
            };
        } else {
            if (this.x < 0 - this.width){
                this.markedForDeletion = true;
                health = health - 1;
            };
        };
        
        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval){
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
            if (this.hasTrail) {
                for (let i = 0; i < 5; i++){
                    particles.push(new Particle(this.x, this.y, this.width, this.color));
                }
            }
        };
        if (health < 1) gameOver = true;
    };

    // Draws the object on the canvas
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let explosions = [];
class Explosion {
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'explodemini.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 100;
        this.markedForDeletion = false;
    }
    update(deltatime){
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size*0.25, this.size, this.size);
    }
}

let particles = [];
class Particle {
    constructor(x, y, size, color){
        this.size = size;
        this.x = x + this.size*0.9 + Math.random() * 50 - 25;
        this.y = y + this.size*0.33 + Math.random() * 50 - 25;
        this.radius = Math.random() * this.size/20;
        this.maxRadius = Math.random() * 20 + 25;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }
    update(){
        this.x += this.speedX;
        this.radius += 0.3;
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }
    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - (this.radius/this.maxRadius);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}


function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 20, 40);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 21, 41);
}
function drawHealth(){
    ctx.fillStyle = 'black';
    ctx.fillText('Health: ' + health, 130, 40);
    ctx.fillStyle = 'white';
    ctx.fillText('Health: ' + health, 131, 41);
}

function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.font = '40px Impact'
    ctx.fillText('GAME OVER! Your score is ' + score, canvas.width*0.5, canvas.height*0.4);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = '40px Impact'
    ctx.fillText('GAME OVER! Your score is ' + score, (canvas.width*0.5)+1, (canvas.height*0.4)+1);
}


window.addEventListener('click', function(e){
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    const pc = detectPixelColor.data;
    ravens.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]){
            // detect collision by color
            object.markedForDeletion = true;
            if (object.hasTrail){
                score = score + 3;
            } else score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
            console.log(explosions);
        }
    });
})


// Animation loop
function animate(timestamp){
    // Clears canvas on every frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    if (timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function(a,b){
            return a.width - b.width;
        });
    };

    drawScore();
    drawHealth();

    // array literal syntax
    // it creates a new array on the fly (not saved I think)
    // ... is called a spread operator
    // We could call these two methods on the ravens array directly, but doing it like this we can spread all our classes into this array it just requires that all classes have update and draw methods
    [...particles, ...ravens, ...explosions].forEach(object => object.update(deltaTime));
    [...particles, ...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    
    if (health < 1) lastFrame--;

    // Calls itself thus making it a recursive function
    if (lastFrame > -2) requestAnimationFrame(animate);
    else drawGameOver();
}

// Begins the animation loop
animate(0);