import { _decorator, Component, Node, sp, Vec2, Vec3, input, Input, KeyCode, director, instantiate, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {

    @property
    speed: number = 30; // 蛇多少帧移动一次
    move_time: number = 0;
    @property
    len_pixel: number = 1; // 格子像素大小
    @property
    size_x: number = 15; // 横向格子数量
    @property
    size_y: number = 9; // 纵向格子数量

    @property(Prefab)
    snakeHeadPrefab: Prefab= null; // 蛇头预制体
    
    @property(Prefab)
    snakeBodyPrefab: Prefab = null; // 蛇身预制体
    
    @property(Prefab)
    foodPrefab: Prefab = null; // 食物预制体

    private snakeNodes: Node[] = []; // 蛇的所有节点（0是蛇头）
    private foodNode: Node | null = null; // 食物节点
    private direction: Vec2 = new Vec2(1, 0); // 当前移动方向 (right)
    private nextDirection: Vec2 = new Vec2(1, 0); // 下一个移动方向
    private total_seconds: number = 0; // 总时间
    private gameRunning: boolean = true; // 游戏状态

    // 方向常量
    private readonly RIGHT = new Vec2(1, 0);
    private readonly LEFT = new Vec2(-1, 0);
    private readonly UP = new Vec2(0, 1);
    private readonly DOWN = new Vec2(0, -1);

    start() {
        this.move_time = this.speed / 60;
        this.initGame();
    }

    initGame() {
        // 清除现有节点
        this.clearSnake();
        if (this.foodNode) {
            this.foodNode.destroy();
            this.foodNode = null;
        }

        // 初始化蛇（3节身体）
        const startX = Math.floor(this.size_x / 2);
        const startY = Math.floor(this.size_y / 2);
        
        // 创建蛇头
        const headNode = this.createSnakeNode(startX, startY, true);
        this.snakeNodes.push(headNode);
        
        // 创建两节身体
        this.snakeNodes.push(this.createSnakeNode(startX - 1, startY, false));
        this.snakeNodes.push(this.createSnakeNode(startX - 2, startY, false));
        
        // 初始化方向
        this.direction = this.RIGHT.clone();
        this.nextDirection = this.RIGHT.clone();
        
        // 创建食物
        this.spawnFood();
        
        // 设置输入监听
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        
        this.gameRunning = true;
    }

    createSnakeNode(x: number, y: number, isHead: boolean): Node {
        const prefab = isHead ? this.snakeHeadPrefab : this.snakeBodyPrefab;
        if (!prefab) {
            console.error("Missing snake prefab!");
            return new Node();
        }
        
        const node = instantiate(prefab);
        node.setPosition(this.gridToWorld(x, y));
        this.node.addChild(node);
        return node;
    }

    spawnFood() {
        if (!this.foodPrefab) return;
        
        // 随机生成不在蛇身上的位置
        let foodPos: Vec2;
        do {
            foodPos = new Vec2(
                Math.floor(Math.random() * this.size_x),
                Math.floor(Math.random() * this.size_y)
            );
        } while (this.isPositionInSnake(foodPos));
        
        // 创建食物
        this.foodNode = instantiate(this.foodPrefab);
        this.foodNode.setPosition(this.gridToWorld(foodPos.x, foodPos.y));
        this.node.addChild(this.foodNode);
    }

    gridToWorld(x: number, y: number): Vec3 {
        // 将网格坐标转换为世界坐标（棋盘中心为原点）
        return new Vec3(
            (x - this.size_x / 2 + 0.5) * this.len_pixel,
            (y - this.size_y / 2 + 0.5) * this.len_pixel,
            0
        );
    }

    onKeyDown(event: any) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                if (!this.direction.equals(this.DOWN)) 
                    this.nextDirection = this.UP;
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                if (!this.direction.equals(this.UP)) 
                    this.nextDirection = this.DOWN;
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                if (!this.direction.equals(this.RIGHT)) 
                    this.nextDirection = this.LEFT;
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                if (!this.direction.equals(this.LEFT)) 
                    this.nextDirection = this.RIGHT;
                break;
            case KeyCode.KEY_R:
                this.initGame(); // 按R重新开始
                break;
        }
    }

    update(deltaTime: number) {
        if (!this.gameRunning) return;
        
        this.total_seconds += deltaTime;
        while (this.total_seconds >= this.move_time) {
            this.total_seconds -= this.move_time;
            this.move();
        }
    }

    move() {
        // 更新方向
        this.direction = this.nextDirection.clone();
        
        // 计算新头部位置
        const headPos = this.getNodeGridPosition(this.snakeNodes[0]);
        const newHeadPos = new Vec2(
            headPos.x + this.direction.x,
            headPos.y + this.direction.y
        );
        
        // 检查游戏结束条件
        if (this.isGameOver(newHeadPos)) {
            this.gameOver();
            return;
        }
        
        // 创建新头部
        const newHead = this.createSnakeNode(newHeadPos.x, newHeadPos.y, true);
        
        // 检查是否吃到食物
        let growSnake = false;
        if (this.foodNode && this.isSamePosition(
            newHeadPos, 
            this.getNodeGridPosition(this.foodNode)
        )) {
            growSnake = true;
            this.foodNode.destroy();
            this.spawnFood();
        }
        
        // 更新蛇身体
        this.snakeNodes.unshift(newHead); // 添加新头部
        
        if (!growSnake) {
            // 移除尾部
            const tail = this.snakeNodes.pop();
            if (tail) tail.destroy();
        }
    }

    getNodeGridPosition(node: Node): Vec2 {
        const pos = node.position;
        return new Vec2(
            Math.floor((pos.x + this.size_x * this.len_pixel / 2) / this.len_pixel),
            Math.floor((pos.y + this.size_y * this.len_pixel / 2) / this.len_pixel)
        );
    }

    isSamePosition(pos1: Vec2, pos2: Vec2): boolean {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }

    isPositionInSnake(pos: Vec2): boolean {
        return this.snakeNodes.some(node => 
            this.isSamePosition(pos, this.getNodeGridPosition(node))
        );
    }

    isGameOver(pos: Vec2): boolean {
        // 检查是否撞墙
        if (pos.x < 0 || pos.x >= this.size_x || pos.y < 0 || pos.y >= this.size_y) {
            return true;
        }
        
        // 检查是否撞到自己（跳过头部）
        for (let i = 1; i < this.snakeNodes.length; i++) {
            if (this.isSamePosition(pos, this.getNodeGridPosition(this.snakeNodes[i]))) {
                return true;
            }
        }
        
        return false;
    }

    gameOver() {
        console.log("Game Over! Press R to restart");
        this.gameRunning = false;
        // 这里可以添加游戏结束效果
    }

    clearSnake() {
        this.snakeNodes.forEach(node => node.destroy());
        this.snakeNodes = [];
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }
}