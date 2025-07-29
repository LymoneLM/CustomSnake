import { _decorator, Component, Label, Node, Button, Sprite, SpriteFrame } from 'cc';
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
    @property({ type: Button, tooltip: '返回首页按钮' })
    homeButton: Button = null;
    @property({ type: Sprite, tooltip: '动态图片' })
    resultSprite: Sprite = null;
    @property({ type: SpriteFrame, tooltip: '分数0-30图片' })
    imgBad: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: '分数31-60图片' })
    imgOk: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: '分数60+图片' })
    imgGood: SpriteFrame = null;
    @property({ type: Label, tooltip: '动态评价标签' })
    resultLabel: Label = null;

    onLoad() {
        if (this.restartButton) {
            this.restartButton.node.on('click', this.onRestartBtnClick, this);
        }
        if (this.homeButton) {
            this.homeButton.node.on('click', this.onHomeBtnClick, this);
        }
    }

    show(score: number) {
        if (this.gameOverRoot) {
            this.gameOverRoot.active = true;
        }
        if (this.finalScoreLabel) {
            this.finalScoreLabel.string = `${score}`;
        }
        // 动态图片和标签
        if (this.resultSprite && this.resultLabel) {
            if (score <= 30) {
                this.resultSprite.spriteFrame = this.imgBad;
                this.resultLabel.string = '你不行呀';
            } else if (score <= 60) {
                this.resultSprite.spriteFrame = this.imgOk;
                this.resultLabel.string = '你行了呀';
            } else {
                this.resultSprite.spriteFrame = this.imgGood;
                this.resultLabel.string = '大人好强！';
            }
        }
    }

    hide() {
        if (this.gameOverRoot) {
            this.gameOverRoot.active = false;
        }
    }

    // 新增：按钮事件只通知GameManager
    onRestartBtnClick() {
        GameManager.Instance?.onRestartButton();
    }
    onHomeBtnClick() {
        GameManager.Instance?.onHomeButton();
    }
} 