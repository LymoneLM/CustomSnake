import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Snake')
export class Snake extends Component {
    @property({ type: Prefab, tooltip: '蛇头预制体' })
    headPrefab: Prefab = null;
    @property({ type: Prefab, tooltip: '蛇身体预制体' })
    segmentPrefab: Prefab = null;

    private body: { x: number, y: number }[] = [];
    private segmentNodes: Node[] = [];
    private direction: { x: number, y: number } = { x: 1, y: 0 };

    private cellSize: number = null;
    private gridWidth: number = null;
    private gridHeight: number = null;

    /**
     * 初始化格子参数
     */
    init(cellSize: number, gridWidth: number, gridHeight: number) {
        this.cellSize = cellSize;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        // 设置蛇头和蛇节预制体大小
        [this.headPrefab, this.segmentPrefab].forEach(prefab => {
            if (prefab && prefab.data && (prefab.data.width > cellSize || prefab.data.height > cellSize)) {
                const scale = Math.min(cellSize / prefab.data.width, cellSize / prefab.data.height);
                prefab.data.setScale(scale, scale, 1);
            }
        });
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

    /**
     * 蛇体向前移动一格
     */
    move() {
        const head = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        };
        // 插入新头，移除尾巴
        this.body.unshift(head);
        this.body.pop();
    }

    /**
     * 蛇体生长（一格）
     */
    grow() {
        const len = this.body.length;
        const tail = this.body[len - 1];
        let newX = tail.x, newY = tail.y;
        if (len === 1) {
            // 只有一节时，反方向生长
            newX -= this.direction.x;
            newY -= this.direction.y;
        }
        this.body.push({ x: newX, y: newY });
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

    /**
     * 渲染蛇体
     */
    render() {
        // 节点池管理
        while (this.segmentNodes.length < this.body.length) {
            let prefab = this.segmentPrefab;
            if (this.segmentNodes.length === 0 && this.headPrefab) {
                prefab = this.headPrefab;
            }
            const node = instantiate(prefab);
            node.parent = this.node;
            this.segmentNodes.push(node);
        }
        while (this.segmentNodes.length > this.body.length) {
            const node = this.segmentNodes.pop();
            node.destroy();
        }
        for (let i = 0; i < this.body.length; i++) {
            const pos = new Vec3(
                this.body[i].x * this.cellSize + this.cellSize / 2,
                this.body[i].y * this.cellSize + this.cellSize / 2,
                0
            );
            this.segmentNodes[i].setPosition(pos);
        }
    }
}


