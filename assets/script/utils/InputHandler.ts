import {_decorator, Component, EventKeyboard, KeyCode, systemEvent, SystemEventType} from 'cc';
import {Direction, GameManager} from "../core/GameManager";

const { ccclass, property } = _decorator;

@ccclass('InputHandler')
export class InputHandler extends Component {
    @property({ type: GameManager, tooltip: '游戏管理器' })
    gm: GameManager = null;

    onLoad() {
        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy() {
        systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: EventKeyboard) {
        if (!this.gm) {
            return;
        }

        switch(event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.gm.updateSnakeDirection(Direction.Up);
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.gm.updateSnakeDirection(Direction.Down);
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.gm.updateSnakeDirection(Direction.Left);
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.gm.updateSnakeDirection(Direction.Right);
                break;
            case KeyCode.ESCAPE:
            case KeyCode.KEY_P:
                this.gm.pauseGame()
        }
    }
} 