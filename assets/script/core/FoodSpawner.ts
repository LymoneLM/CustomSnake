import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FoodSpawner')
export class FoodSpawner extends Component {
    @property({ type: Prefab, tooltip: '食物预制体' })
    foodPrefab: Prefab = null;

    private foodNode: Node = null;
    private foodPos: { x: number, y: number } = null;

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
    }

    /**
     * 生成食物，避免与蛇身重叠
     * @param snakeBody 蛇身格子坐标数组
     */
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
            // 没有空位，回收食物节点
            this.despawnFood();
            return;
        }
        // 随机选一个空格
        const idx = Math.floor(Math.random() * freeCells.length);
        this.foodPos = freeCells[idx];
        // 节点池管理（这里只生成一个食物）
        if (!this.foodNode) {
            this.foodNode = instantiate(this.foodPrefab);
            this.foodNode.parent = this.node;
        }
        // 设置位置
        this.foodNode.setPosition(
            (this.foodPos.x - this.gridWidth / 2) * this.cellSize + this.cellSize / 2,
            (this.foodPos.y - this.gridHeight / 2) * this.cellSize + this.cellSize / 2,
            0
        );
        this.foodNode.active = true;
    }

    /**
     * 回收食物节点
     */
    despawnFood() {
        if (this.foodNode) {
            this.foodNode.active = false;
        }
        this.foodPos = null;
    }

    /**
     * 获取当前食物格子坐标
     */
    getFoodPos() {
        // 若未生成食物则返回null，避免报错
        return this.foodPos ? { ...this.foodPos } : null;
    }
}


