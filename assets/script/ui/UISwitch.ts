import { _decorator, Component, Node, Label, Sprite, SpriteFrame, Button, EventTouch, tween, UITransform, UIOpacity } from 'cc';
import { GameManager } from '../core/GameManager';
const { ccclass, property } = _decorator;

@ccclass('UISwitch')
export class UISwitch extends Component {
    @property({ type: Node, tooltip: '速度切换按钮' })
    switchBtn: Node = null;
    @property({ type: Label, tooltip: '速度显示标签' })
    speedLabel: Label = null;

    // 三档速度，单位为moveInterval（秒/格）
    private speedLevels = [0.5, 0.3, 0.15];
    private speedNames = ['慢速', '正常', '快速'];
    private currentLevel = 1;
    private labelShowTime = 1.2; // 标签显示时长（秒）
    private labelTimer = 0;

    start() {
        if (this.switchBtn) {
            this.switchBtn.on(Node.EventType.TOUCH_START, this.onBtnDown, this);
            this.switchBtn.on(Node.EventType.TOUCH_END, this.onBtnUp, this);
            this.switchBtn.on(Node.EventType.TOUCH_CANCEL, this.onBtnUp, this);
            this.setBtnOpacity(0); // 初始0透明度
        }
        if (this.speedLabel) {
            this.speedLabel.node.active = false;
        }
    }

    update(deltaTime: number) {
        if (this.speedLabel && this.speedLabel.node.active) {
            this.labelTimer -= deltaTime;
            if (this.labelTimer <= 0) {
                this.speedLabel.node.active = false;
            }
        }
    }

    private onBtnDown() {
        this.setBtnOpacity(255); // 按下时100透明度
        this.switchSpeed();
    }

    private onBtnUp() {
        this.setBtnOpacity(0); // 恢复0透明度
    }

    private setBtnOpacity(opacity: number) {
        if (this.switchBtn) {
            let uiOpacity = this.switchBtn.getComponent(UIOpacity);
            if (!uiOpacity) {
                uiOpacity = this.switchBtn.addComponent(UIOpacity);
            }
            uiOpacity.opacity = opacity;
        }
    }

    private switchSpeed() {
        this.currentLevel = (this.currentLevel + 1) % this.speedLevels.length;
        const interval = this.speedLevels[this.currentLevel];
        GameManager.Instance.moveInterval = interval;
        this.showSpeedLabel();
    }

    private showSpeedLabel() {
        if (this.speedLabel) {
            this.speedLabel.string = this.speedNames[this.currentLevel];
            this.speedLabel.node.active = true;
            this.labelTimer = this.labelShowTime;
        }
    }
}


