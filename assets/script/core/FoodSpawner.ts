import { _decorator, Component, Node, Prefab, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FoodSpawner')
export class FoodSpawner extends Component {
    @property({ type: Prefab, tooltip: '食物预制体x1' })
    foodPrefab_1: Prefab = null;
    @property({ type: Prefab, tooltip: '食物预制体x5' })
    foodPrefab_5: Prefab = null;
    @property({ type: Prefab, tooltip: '食物预制体x10' })
    foodPrefab_10: Prefab = null;
    @property({ tooltip: '每帧消失检测' })
    checkInterval: number = 0.1;

    private foodNode: Node = null;
    private foodPos: { x: number, y: number } = null;
    private foodScore: number = 1;
    private cellSize: number = null;
    private gridWidth: number = null;
    private gridHeight: number = null;
    private foodTimer: number = 0;
    private foodTimeout: number = 0;
    private checkTimer: number = 0;

    init(cellSize: number, gridWidth: number, gridHeight: number, moveInterval?: number) {
        this.cellSize = cellSize;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        [this.foodPrefab_1, this.foodPrefab_5, this.foodPrefab_10].forEach(prefab => {
            if (prefab && prefab.data) {
                if (prefab.data.width > cellSize || prefab.data.height > cellSize) {
                    const scale = Math.min(cellSize / prefab.data.width, cellSize / prefab.data.height);
                    prefab.data.setScale(scale, scale, 1);
                }
            }
        });
    }

    spawnFood(snakeBody: { x: number, y: number }[]) {
        // 计算所有空闲格子
        const occupied = new Set(snakeBody.map(seg => seg.x + ',' + seg.y));
        const freeCells: { x: number, y: number }[] = [];
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                if (!occupied.has(x + ',' + y)) {
                    freeCells.push({ x, y });
                }
            }
        }
        if (freeCells.length === 0) {
            this.despawnFood();
            return;
        }
        const idx = Math.floor(Math.random() * freeCells.length);
        this.foodPos = freeCells[idx];
        const rand = Math.random();
        let prefab: Prefab;
        if (rand < 0.6) {
            prefab = this.foodPrefab_1;
            this.foodScore = 1;
        } else if (rand < 0.9) {
            prefab = this.foodPrefab_5;
            this.foodScore = 5;
        } else {
            prefab = this.foodPrefab_10;
            this.foodScore = 10;
        }
        if (!this.foodNode || !this.foodNode.isValid || this.foodNode.name !== prefab.name) {
            if (this.foodNode) this.foodNode.destroy();
            this.foodNode = instantiate(prefab);
            this.foodNode.parent = this.node;
        }
        this.foodNode.setPosition(
            this.foodPos.x * this.cellSize + this.cellSize / 2,
            this.foodPos.y * this.cellSize + this.cellSize / 2,
            0
        );
        this.foodNode.active = true;
        // 计算限时
        this.resetFoodTimer(snakeBody);
    }

    resetFoodTimer(snakeBody: { x: number, y: number }[]) {
        if (!snakeBody || snakeBody.length === 0) {
            this.foodTimeout = 10; // fallback
            this.foodTimer = 0;
            return;
        }
        const head = snakeBody[0];
        const dist = Math.max(Math.abs(head.x - this.foodPos.x), Math.abs(head.y - this.foodPos.y)); // 切比雪夫距离
        if (this.foodScore === 10) {
            this.foodTimeout = 2 * dist;
        } else if (this.foodScore === 5) {
            this.foodTimeout = 5 * dist;
        } else {
            this.foodTimeout = 10 * dist;
        }
        this.foodTimer = 0;
    }

    update(dt: number) {
        if (!this.foodNode || !this.foodNode.active) return;
        this.foodTimer += dt;
        this.checkTimer += dt;
        if (this.checkTimer >= this.checkInterval) {
            this.checkTimer = 0;
            if (this.foodTimeout > 0 && this.foodTimer >= this.foodTimeout) {
                this.despawnFood();
                director.emit('food-timeout');
            }
        }
    }

    despawnFood() {
        if (this.foodNode) {
            this.foodNode.active = false;
        }
        this.foodPos = null;
        this.foodTimer = 0;
        this.foodTimeout = 0;
    }

    getFoodPos() {
        return this.foodPos ? { ...this.foodPos } : null;
    }

    getFoodScore() {
        return this.foodScore;
    }

    isNeedRespawn() {
        return !this.foodNode || !this.foodNode.active;
    }
}


