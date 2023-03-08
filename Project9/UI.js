export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
        this.livesImage = document.getElementById('lives');
    }
    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'red';
        context.shadowBlur = 2;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;

        // score
        context.fillText(`Score: ${this.game.score}`,  10, 33);

        // timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        //context.fillText(`Time Survived: ${(this.game.time * 0.001).toFixed(1)}`,  10, 63);
        context.fillText(`Time Left: ${((this.game.maxTime * 0.001) - (this.game.time * 0.001)).toFixed(1)}`,  10, 63);

        // lives
        for (let i = 0; i < this.game.lives; i++) {
            context.drawImage(this.livesImage, (this.game.width-33) - (33*i), 10, 25, 25);
        } 

        // game over message
        if (this.game.gameOver) {
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            // win
            if (this.game.score > 99){
                context.fillText(`Boo-yah!`, this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText(`Good job!`, this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                context.font = this.fontSize * 1.2 + 'px ' + this.fontFamily;
                context.fillText(`Maybe you're just not cut out for the super hero stuff!`, this.game.width * 0.5, this.game.height * 0.5 - 20);
                // context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                // context.fillText(`Hit 'Enter' to try again!`, this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }
        context.restore();
        
    }
}