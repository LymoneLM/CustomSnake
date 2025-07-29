import { _decorator, Component, Node, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Jump')
export class Jump extends Component {
    @property({ tooltip: '跳动最大高度（像素）' })
    maxHeight: number = 10;
    @property({ tooltip: '跳动速度（周期/秒）' })
    speed: number = 2;

    private time: number = 0;
    private _maxHeight: number = 10;
    private _speed: number = 2;
    private baseY: number = 0;

    onLoad() {
        this._maxHeight = this.maxHeight;
        this._speed = this.speed;
        this.baseY = this.node.position.y;
    }

    update(dt: number) {
        this.time += dt;
        // 使用正弦插值实现丝滑非线性跳动
        const offset = math.lerp(
            0,
            this._maxHeight,
            (Math.sin(this.time * this._speed) + 1) / 2
        );
        this.node.setPosition(this.node.position.x, this.baseY + offset, this.node.position.z);
    }

    /**
     * 外部可动态设置跳动幅度
     */
    setMaxHeight(h: number) {
        this._maxHeight = h;
    }

    /**
     * 外部可动态设置跳动速度
     */
    setSpeed(speed: number) {
        this._speed = speed;
    }
} 