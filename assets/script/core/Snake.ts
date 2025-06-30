import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Snake')
export class Snake extends Component {
    @property({ type: Prefab, tooltip: '蛇节预制体' })
    segmentPrefab: Prefab = null;

    private body: { x: number, y: number }[] = [];
    private segmentNodes: Node[] = [];
    private direction: { x: number, y: number } = { x: 1, y: 0 };

    private cellSize: number;
    private gridWidth: number;
    private gridHeight: number;

    start() {
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        // 从GameManager获取参数
        this.cellSize = GameManager.getCellSize();
        this.gridWidth = GameManager.getGridWidth();
        this.gridHeight = GameManager.getGridHeight();
    }

    /**
     * 重置蛇的状态
     */
    reset() {
        // 初始化蛇身（1节，居中）
        const startX = Math.floor(this.gridWidth / 2);
        const startY = Math.floor(this.gridHeight / 2);
        this.body = [{ x: startX, y: startY }];
        this.direction = { x: 1, y: 0 }; // 初始向右
        this.render();
    }

    update(deltaTime: number) {
        // 这里只做演示：每秒移动一次
        // 实际项目应由GameManager或定时器控制移动
    }

    move() {
        const head = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        };

        // 插入新头，移除尾巴
        this.body.unshift(head);
        this.body.pop();

        // 渲染交给GameManager在合适的时机调用
        // this.render();
    }

    grow() {
        const tail = this.body[this.body.length - 1];
        this.body.push({ x: tail.x, y: tail.y });
        // 渲染交给GameManager在合适的时机调用
        // this.render();
    }

    setDirection(dx: number, dy: number) {
        if (this.body.length > 1) {
            const nextX = this.body[0].x + dx;
            const nextY = this.body[0].y + dy;
            if (nextX === this.body[1].x && nextY === this.body[1].y) {
                return;
            }
        }
        this.direction = { x: dx, y: dy };
    }

    /**
     * 获取蛇身所有格子坐标
     */
    getBody() {
        return this.body;
    }

    /**
     * 获取蛇头格子坐标
     */
    getHeadPosition() {
        return this.body[0];
    }

    /**
     * 检测是否撞到自己身体
     */
    isCollidingWithBody(): boolean {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    render() {
        while (this.segmentNodes.length < this.body.length) {
            const node = instantiate(this.segmentPrefab);
            node.parent = this.node;
            this.segmentNodes.push(node);
        }
        while (this.segmentNodes.length > this.body.length) {
            const node = this.segmentNodes.pop();
            node.destroy();
        }
        for (let i = 0; i < this.body.length; i++) {
            const pos = new Vec3(
                (this.body[i].x - this.gridWidth / 2) * this.cellSize + this.cellSize / 2,
                (this.body[i].y - this.gridHeight / 2) * this.cellSize + this.cellSize / 2,
                0
            );
            this.segmentNodes[i].setPosition(pos);
        }
    }
}


