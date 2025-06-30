import { _decorator, Component, systemEvent, SystemEventType, EventKeyboard, KeyCode } from 'cc';
import { Snake } from '../core/Snake';
const { ccclass, property } = _decorator;

@ccclass('InputHandler')
export class InputHandler extends Component {
    @property({ type: Snake, tooltip: '蛇的实例' })
    snake: Snake = null;

    onLoad() {
        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy() {
        systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: EventKeyboard) {
        if (!this.snake) {
            return;
        }

        switch(event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.snake.setDirection(0, 1);
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.snake.setDirection(0, -1);
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.snake.setDirection(-1, 0);
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.snake.setDirection(1, 0);
                break;
        }
    }
} 