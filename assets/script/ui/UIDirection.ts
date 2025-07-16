import { _decorator, Component, Node, director, UIOpacity } from 'cc';
import { Direction, GameManager } from "../core/GameManager";
const { ccclass, property } = _decorator;

@ccclass('UIDirection')
export class UIDirection extends Component {
    @property({ type: Node, tooltip: '上键'})
    key_up: Node = null;
    @property({ type: Node, tooltip: '下键'})
    key_down: Node = null;
    @property({ type: Node, tooltip: '左键'})
    key_left: Node = null;
    @property({ type: Node, tooltip: '右键'})
    key_right: Node = null;
    @property({ type: GameManager, tooltip: '游戏管理器' })
    gm: GameManager = null;

    private set: Node[] = [];
    private defaultOpacity: number = 0;
    private activeOpacity: number = 255;

    private setOpacity(node: Node, value: number) {
        let uiOpacity = node.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = node.addComponent(UIOpacity);
        }
        uiOpacity.opacity = value;
    }

    onLoad() {
        this.set = [this.key_up, this.key_down, this.key_left, this.key_right];
        director.on("direction", this.onDirectionKeyChanged, this);

        // 绑定UI按钮点击事件
        this.set.forEach((btn, dir) => {
            if (btn) {
                btn.active = true;
                this.setOpacity(btn, this.defaultOpacity);
                btn.on(Node.EventType.TOUCH_START, () => {
                    this.setOpacity(btn, this.activeOpacity);
                    director.emit("direction", dir, true);
                    if (this.gm) {
                        this.gm.updateSnakeDirection(dir);
                    }
                }, this);
                btn.on(Node.EventType.TOUCH_END, () => {
                    this.setOpacity(btn, this.defaultOpacity);
                    director.emit("direction", dir, false);
                }, this);
                btn.on(Node.EventType.TOUCH_CANCEL, () => {
                    this.setOpacity(btn, this.defaultOpacity);
                    director.emit("direction", dir, false);
                }, this);
            }
        });
    }

    onDestroy () {
        director.off("direction", this.onDirectionKeyChanged, this);
    }

    onDirectionKeyChanged(direction: Direction, mode: boolean) {
        if (!this.set[direction]) {
            return;
        }
        this.setOpacity(this.set[direction], mode ? this.activeOpacity : this.defaultOpacity);
    }
}


