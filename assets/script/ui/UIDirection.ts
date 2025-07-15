import { _decorator, Component, Node, director } from 'cc';
import { Direction } from "../core/GameManager";
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

    private set: Node[] = [];

    onLoad() {
        this.set = [this.key_up, this.key_down, this.key_left, this.key_right];
        director.on("direction", this.onDirectionKeyChanged, this);
    }

    onDestroy () {
        director.off("direction", this.onDirectionKeyChanged, this);
    }

    start() {
        this.set.forEach((c) => {
            if(!c){
                return;
            }
            c.active = false;
        })
    }

    onDirectionKeyChanged(direction: Direction, mode: boolean) {
        if (!this.set[direction]) {
            return;
        }
        this.set[direction].active = mode;
    }
}


