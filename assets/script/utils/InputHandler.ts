import { _decorator, Component, EventKeyboard, KeyCode, input, Input, director } from 'cc';
import { Direction, GameManager } from "../core/GameManager";
const { ccclass, property } = _decorator;

@ccclass('InputHandler')
export class InputHandler extends Component {
    @property({ type: GameManager, tooltip: '游戏管理器' })
    gm: GameManager = null;

    private key_count: number[] = [0,0,0,0];

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this)
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        if (!this.gm) {
            return;
        }

        switch(event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.key_count[Direction.Up]++;
                this.gm.updateSnakeDirection(Direction.Up);
                director.emit("direction", Direction.Up, true);
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.key_count[Direction.Down]++;
                this.gm.updateSnakeDirection(Direction.Down);
                director.emit("direction", Direction.Down, true);
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.key_count[Direction.Left]++;
                this.gm.updateSnakeDirection(Direction.Left);
                director.emit("direction", Direction.Left, true);
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.key_count[Direction.Right]++;
                this.gm.updateSnakeDirection(Direction.Right);
                director.emit("direction", Direction.Right, true);
                break;
            case KeyCode.ESCAPE:
            case KeyCode.KEY_P:
                this.gm.pauseGame()
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        if (!this.gm) {
            return;
        }

        switch(event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.key_count[Direction.Up]--;
                if (this.key_count[Direction.Up] <= 0) {
                    director.emit("direction", Direction.Up, false);
                }
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.key_count[Direction.Down]--;
                if (this.key_count[Direction.Down] <= 0) {
                    director.emit("direction", Direction.Down, false);
                }
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.key_count[Direction.Left]--;
                if (this.key_count[Direction.Left] <= 0) {
                    director.emit("direction", Direction.Left, false);
                }
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.key_count[Direction.Right]--;
                if (this.key_count[Direction.Right] <= 0) {
                    director.emit("direction", Direction.Right, false);
                }
                break;
        }
    }
} 