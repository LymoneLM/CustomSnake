import { _decorator, Component, Label, Node, Button } from 'cc';
import { GameManager } from '../core/GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIGameOver')
export class UIGameOver extends Component {
    @property({ type: Node, tooltip: '游戏结束界面的根节点' })
    gameOverRoot: Node = null;
    @property({ type: Label, tooltip: '显示最终分数的标签' })
    finalScoreLabel: Label = null;
    @property({ type: Button, tooltip: '重新开始按钮' })
    restartButton: Button = null;

    onLoad() {
        if (this.restartButton) {
            this.restartButton.node.on('click', this.onRestart, this);
        }
    }

    show(score: number) {
        if (this.gameOverRoot) {
            this.gameOverRoot.active = true;
        }
        if (this.finalScoreLabel) {
            this.finalScoreLabel.string = `Score: ${score}`;
        }
    }

    hide() {
        if (this.gameOverRoot) {
            this.gameOverRoot.active = false;
        }
    }

    onRestart() {
        GameManager.Instance.startGame();
        this.hide();
    }
} 