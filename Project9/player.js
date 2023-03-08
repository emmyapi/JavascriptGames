import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from "./floatingMessages.js";

export class Player {
    constructor(game){
        this.game = game;
        this.width = 100.4;
        this.height = 91.4;
        this.x = 25;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0; // number of frames on the x-axis
        this.fps = 24;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 4;
        this.weight = 1;
        this.vy = 0;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];
        this.currentState = null;
    }
    // restart(){
    //     this.x = 25;
    //     this.y = this.game.height - this.height - this.game.groundMargin;
    //     this.image = document.getElementById('player');
    //     this.frameX = 0;
    //     this.frameY = 0;
    //     this.maxFrame = 0; // number of frames on the x-axis
    //     this.fps = 24;
    //     this.frameInterval = 1000/this.fps;
    //     this.frameTimer = 0;
    //     this.speed = 0;
    //     this.maxSpeed = 4;
    //     this.weight = 1;
    //     this.vy = 0;
    //     this.currentState = this.states[0];
    // }
    update(input, deltaTime){
        this.checkCollision();
        // match state with allowed input
        this.currentState.handleInput(input);

        // horizontal movement
        this.x += this.speed;
        if (input.includes('d') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if (input.includes('a') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed*3;
        else this.speed = 0;

        // horizontal boundaries (remember to always have boundaries after movement)
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movement
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

        // vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;

        // sprite animation
        if (this.frameTimer < this.frameInterval) this.frameTimer += deltaTime
        else {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0;
        }

    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
                //collision detected
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    this.game.score++;
                    this.game.maxTime += 500;
                    this.game.floatingMessages.push(new FloatingMessage(`+1`, enemy.x, enemy.y, 95, 25));
                } else {
                    this.setState(6, 0);
                    this.game.lives--;
                }
            }
        });
    }
}