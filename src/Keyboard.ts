export class Keyboard {
    value : String;
    isDown : boolean;
    isUp : boolean;
    press : Function;
    release : Function;
    downListener : any;
    upListener : any;

    constructor(key : string, pressFunc : Function, releaseFunc : Function){
        this.value = key;
        this.isDown = false;
        this.isUp = true;
        this.press = pressFunc;
        this.release = releaseFunc;

        //Attach event listeners
        this.downListener = this.downHandler.bind(this);
        this.upListener = this.upHandler.bind(this);

        window.addEventListener("keydown", this.downListener, false);
        window.addEventListener("keyup", this.upListener, false);

        console.log(this);
        
    }

    downHandler(event: KeyboardEvent) {
        if (event.key === this.value) {
            if (this.isUp && this.press) {
                this.press();
            }
            this.isDown = true;
            this.isUp = false;
            event.preventDefault();
        }
    };

    upHandler(event: KeyboardEvent) {
        if (event.key === this.value) {
            if (this.isDown && this.release) {
                this.release();
            }
            this.isDown = false;
            this.isUp = true;
            event.preventDefault();
        }
    };

    unsubscribe(){
        window.removeEventListener("keydown", this.downListener);
        window.removeEventListener("keyup", this.upListener);
    };
}