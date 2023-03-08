export class InputHandler {
    constructor(game){
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown', e => {
            // console.log(e.key);
            if ((   e.key === 'w' || 
                    e.key === 'a' ||
                    e.key === 's' ||
                    e.key === 'd' ||
                    e.key === 'Enter'
                ) && this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key);
            } else if (e.key === '0') {
                this.game.debug = !this.game.debug;
            }; 
        });
        window.addEventListener('keyup', e => {
            if (    e.key === 'w' || 
                    e.key === 'a' || 
                    e.key === 's' || 
                    e.key === 'd' ||
                    e.key === 'Enter' ){
                this.keys.splice(this.keys.indexOf(e.key), 1); 
            }
        });
    }
}