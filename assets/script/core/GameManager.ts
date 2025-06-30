import { _decorator, Component } from 'cc';
import { Snake } from './Snake';
import { FoodSpawner } from './FoodSpawner';
import { UIMain } from '../ui/UIMain';
import { UIGameOver } from '../ui/UIGameOver';
const { ccclass, property } = _decorator;

enum GameState {
    Ready,
    Playing,
    Paused,
    GameOver,
}

@ccclass('GameManager')
export class GameManager extends Component {
    public static Instance: GameManager = null;

    @property({ type: Number, tooltip: '每个格子的像素大小' })
    cellSize: number = 32;
    @property({ type: Number, tooltip: '横向格子数' })
    gridWidth: number = 20;
    @property({ type: Number, tooltip: '纵向格子数' })
    gridHeight: number = 20;


    @property({ type: Snake, tooltip: '蛇的实例' })
    snake: Snake = null;
    @property({ type: FoodSpawner, tooltip: '食物生成器实例' })
    foodSpawner: FoodSpawner = null;


    @property({ type: UIMain, tooltip: '主UI界面' })
    uiMain: UIMain = null;
    @property({ type: UIGameOver, tooltip: '游戏结束界面' })
    uiGameOver: UIGameOver = null;

    @property({ type: Number, tooltip: '蛇移动速度（秒/格）' })
    moveInterval: number = 0.3;

    private gameState: GameState = GameState.Ready;
    private moveTimer: number = 0;
    private score: number = 0;

    onLoad() {
        GameManager.Instance = this;
    }

    start() {
        this.startGame();
    }

    update(deltaTime: number) {
        if (this.gameState !== GameState.Playing) {
            return;
        }

        this.moveTimer += deltaTime;
        if (this.moveTimer >= this.moveInterval) {
            this.moveTimer = 0;
            this.onSnakeMove();
        }
    }

    startGame() {
        this.gameState = GameState.Playing;
        this.score = 0;
        this.uiMain?.updateScore(this.score);
        this.uiGameOver?.hide();
        this.snake.init();
        this.snake.reset();
        if (this.foodSpawner) {
            this.foodSpawner.cellSize = this.cellSize;
            this.foodSpawner.gridWidth = this.gridWidth;
            this.foodSpawner.gridHeight = this.gridHeight;
        }
        this.foodSpawner.spawnFood(this.snake.getBody());
    }

    onSnakeMove() {
        this.snake.move();

        if (this.checkCollision()) {
            this.onGameOver();
            return;
        }

        if (this.checkFood()) {
            this.onEatFood();
        }

        this.snake.render();
    }

    checkCollision(): boolean {
        const headPos = this.snake.getHeadPosition();
        // 墙壁检测
        if (
            headPos.x < 0 || headPos.x >= this.gridWidth ||
            headPos.y < 0 || headPos.y >= this.gridHeight
        ) {
            return true;
        }
        // 自身碰撞检测
        return  this.snake.isCollidingWithBody()
    }

    checkFood(): boolean {
        const headPos = this.snake.getHeadPosition();
        const foodPos = this.foodSpawner.getFoodPos();
        return foodPos && headPos.x === foodPos.x && headPos.y === foodPos.y;
    }

    onEatFood() {
        this.score++;
        this.uiMain?.updateScore(this.score);
        this.snake.grow();
        this.foodSpawner.spawnFood(this.snake.getBody());
    }

    onGameOver() {
        this.gameState = GameState.GameOver;
        this.uiGameOver?.show(this.score);
        console.log('Game Over! Score:', this.score);
    }

    public static getCellSize() {
        return GameManager.Instance.cellSize;
    }
    public static getGridWidth() {
        return GameManager.Instance.gridWidth;
    }
    public static getGridHeight() {
        return GameManager.Instance.gridHeight;
    }
}


