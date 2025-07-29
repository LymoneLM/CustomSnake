import { _decorator, Component, Node } from 'cc';
import { Snake } from './Snake';
import { FoodSpawner } from './FoodSpawner';
import { UIMain } from '../ui/UIMain';
import { UIGameOver } from '../ui/UIGameOver';
import { director } from 'cc';
import { History } from './History';
import { UIHistory } from '../ui/UIHistory';
import { SoundManager } from './SoundManager'; // 引入 SoundManager
const { ccclass, property } = _decorator;

enum GameState {
    Ready,
    Playing,
    Paused,
    GameOver,
}

export enum Direction {
    Up ,
    Down,
    Left,
    Right,
}

@ccclass('GameManager')
export class GameManager extends Component {
    // 管理器单例，仅用于
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
    @property({ type: SoundManager, tooltip: '音效管理器' })
    soundManager: SoundManager = null;


    @property({ type: UIMain, tooltip: '主UI界面' })
    uiMain: UIMain = null;
    @property({ type: UIGameOver, tooltip: '游戏结束界面' })
    uiGameOver: UIGameOver = null;
    @property({ type: UIHistory, tooltip: '历史记录UI' })
    uiHistory: UIHistory = null;
    @property({ type: Node, tooltip: '游戏内容/格子'})
    sheet: Node = null;

    @property({ type: Number, tooltip: '蛇移动速度（秒/格）' })
    moveInterval: number = 0.3;

    private gameState: GameState = GameState.Ready;
    private moveTimer: number = 0;
    private score: number = 0;

    onLoad() {
        GameManager.Instance = this;
    }

    start() {
        this.showMainMenu();
        this.snake.init(this.cellSize, this.gridWidth, this.gridHeight);
        this.foodSpawner.init(this.cellSize, this.gridWidth, this.gridHeight, this.moveInterval);
        director.on('food-timeout', this.onFoodTimeout, this);
    }

    onDestroy() {
        director.off('food-timeout', this.onFoodTimeout, this);
    }

    onFoodTimeout() {
        if (this.gameState === GameState.Playing) {
            this.foodSpawner.spawnFood(this.snake.getBody());
        }
    }

    showMainMenu() {
        this.gameState = GameState.Ready;
        this.uiMain?.show();
        this.uiGameOver?.hide();
        this.uiHistory?.hide();
        if (this.sheet) this.sheet.active = false;
        this.soundManager?.playBgmMenu(); // 播放主菜单BGM
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
        this.uiMain?.hide();
        this.uiGameOver?.hide();
        if (this.sheet) this.sheet.active = true;
        this.snake.reset();
        this.foodSpawner.spawnFood(this.snake.getBody());
        this.soundManager?.playBgmGame(); // 播放游戏BGM
        this.soundManager?.playSfxStart(); // 播放开始音效
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

    updateSnakeDirection(direction: Direction) {
        if(!this.snake||this.gameState !== GameState.Playing){
            return;
        }
        switch (direction) {
            case Direction.Up:
                this.snake.setDirection(0, 1);
                break;
            case Direction.Down:
                this.snake.setDirection(0, -1);
                break;
            case Direction.Left:
                this.snake.setDirection(-1, 0);
                break;
            case Direction.Right:
                this.snake.setDirection(1, 0);
                break;
        }
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

    pauseGame() {
        if (this.gameState === GameState.Playing) {
            this.gameState = GameState.Paused;
        } else if (this.gameState === GameState.Paused) {
            this.gameState = GameState.Playing;
        }
    }

    onEatFood() {
        const foodScore = this.foodSpawner.getFoodScore();
        this.score += foodScore;
        this.snake.grow();
        this.foodSpawner.spawnFood(this.snake.getBody());
        this.soundManager?.playSfxEat(); // 播放吃食物音效
    }

    onGameOver() {
        this.gameState = GameState.GameOver;
        // 写入历史记录
        History.addRecord({ score: this.score, time: Date.now() });
        this.uiGameOver?.show(this.score);
        // this.uiMain?.show(); // 不自动回主菜单
        if (this.sheet) this.sheet.active = false;
        console.log('Game Over! Score:', this.score);
        this.soundManager?.stopBgm(); // 停止BGM
        this.soundManager?.playSfxDie(); // 播放死亡音效
    }

    // 新增：UI事件统一调度
    onStartButton() {
        this.soundManager?.playSfxClick(); // 播放点击音效
        this.startGame();
    }
    onHistoryButton() {
        this.soundManager?.playSfxClick(); // 播放点击音效
        this.uiMain?.hide();
        // 这里假设UIHistory由GameManager持有，需加property
        if (this.uiHistory) {
            this.uiHistory.show();
        }
        if (this.sheet) this.sheet.active = false;
    }
    // 新增：UIGameOver事件统一调度
    onRestartButton() {
        this.soundManager?.playSfxClick(); // 播放点击音效
        this.startGame();
        this.uiGameOver.hide();
    }
    onHomeButton() {
        this.soundManager?.playSfxClick(); // 播放点击音效
        this.showMainMenu();
    }
    // 新增：UIHistory关闭事件统一调度
    onCloseHistory() {
        this.soundManager?.playSfxClick(); // 播放点击音效
        this.showMainMenu();
    }
}


