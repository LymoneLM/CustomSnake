import { _decorator, Component, Button, Node, tween, Vec3 } from 'cc'; // 增加 Vec3
import { GameManager } from '../core/GameManager';
// 删除 import { UIHistory } from './UIHistory';
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {
    @property({ type: Node, tooltip: '开始菜单节点'})
    startMenu: Node = null;
    @property({ type: Button, tooltip: '开始游戏按钮' })
    startButton: Button = null
    // @property({ type: Node, tooltip: '格子'})
    // sheet: Node = null; // 此属性移交至 GameManager.ts
    @property({ type: Button, tooltip: '历史记录按钮' })
    historyButton: Button = null;
    // 删除 @property({ type: UIHistory, tooltip: '历史记录UI' })
    // 删除 uiHistory: UIHistory = null;

    onLoad() {
        if (this.startButton) {
            this.startButton.node.on('click', this.onStartBtnClick, this);
            // 新增：按下和松开缩放
            this.startButton.node.on(Node.EventType.TOUCH_START, this.onBtnDown, this);
            this.startButton.node.on(Node.EventType.TOUCH_END, this.onBtnUp, this);
            this.startButton.node.on(Node.EventType.TOUCH_CANCEL, this.onBtnUp, this);
        }
        if (this.historyButton) {
            this.historyButton.node.on('click', this.onHistoryBtnClick, this);
            this.historyButton.node.on(Node.EventType.TOUCH_START, this.onHistoryBtnDown, this);
            this.historyButton.node.on(Node.EventType.TOUCH_END, this.onHistoryBtnUp, this);
            this.historyButton.node.on(Node.EventType.TOUCH_CANCEL, this.onHistoryBtnUp, this);
        }
    }

    onBtnDown() {
        // 按下时放大到1.1倍
        tween(this.startButton.node)
            .to(0.05, { scale: new Vec3(1.1, 1.1, 1) })
            .start();
    }

    onBtnUp() {
        // 松开时恢复1倍
        tween(this.startButton.node)
            .to(0.05, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    onHistoryBtnDown() {
        // 按下时放大到1.1倍
        tween(this.historyButton.node)
            .to(0.05, { scale: new Vec3(1.1, 1.1, 1) })
            .start();
    }

    onHistoryBtnUp() {
        // 松开时恢复1倍
        tween(this.historyButton.node)
            .to(0.05, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    showMenuOnly() {
        this.startMenu.active = true;
        // this.sheet.active = false; // 由 GameManager 管理
        // 删除 if (this.uiHistory) this.uiHistory.hide();
    }

    showGameOnly() {
        this.startMenu.active = false;
        // this.sheet.active = true; // 由 GameManager 管理
        // 删除 if (this.uiHistory) this.uiHistory.hide();
    }

    showNone() {
        this.startMenu.active = false;
        // this.sheet.active = false; // 由 GameManager 管理
        // 删除 if (this.uiHistory) this.uiHistory.hide();
    }

    show() {
        this.showMenuOnly();
    }

    hide() {
        this.showNone();
    }

    // 新增：按钮事件只通知GameManager
    onStartBtnClick() {
        GameManager.Instance && GameManager.Instance.onStartButton();
    }
    onHistoryBtnClick() {
        GameManager.Instance && GameManager.Instance.onHistoryButton();
    }
} 