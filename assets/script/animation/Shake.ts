import {_decorator, Component, math, Node} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Shake')
export class Shake extends Component {
    @property({ tooltip: '摇摆最大角度（度）' })
    maxAngle: number = 5;
    @property({ tooltip: '摇摆速度（周期/秒）' })
    speed: number = 3;
    @property({ type: Node, tooltip: '要旋转的目标节点（可选）' })
    target: Node = null;

    private time: number = 0;
    private _maxAngle: number = 10;
    private _speed: number = 2;
    private _target: Node = null;

    update(dt: number) {
        if (!this._target) return;
        this.time += dt;
        // 使用正弦插值实现丝滑非线性摇摆
        const angle = math.lerp(
            -this._maxAngle,
            this._maxAngle,
            (Math.sin(this.time * this._speed) + 1) / 2
        );
        this._target.setRotationFromEuler(0, 0, angle);
    }

    /**
     * 外部可动态设置摇摆幅度
     */
    setMaxAngle(angle: number) {
        this._maxAngle = angle;
    }

    /**
     * 外部可动态设置摇摆速度
     */
    setSpeed(speed: number) {
        this._speed = speed;
    }

    onLoad() {
        this._maxAngle = this.maxAngle;
        this._speed = this.speed;
        // 优先用用户指定的target，否则自动找父节点，否则用自身
        if (this.target) {
            this._target = this.target;
        } else if (this.node.parent) {
            this._target = this.node.parent;
        } else {
            this._target = this.node;
        }
        // debug
        console.log("Shake target:", this._target.name);
    }
} 