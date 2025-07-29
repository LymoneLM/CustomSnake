import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BGFall')
export class BGFall extends Component {
    @property({ type: [Prefab], tooltip: '三种背景预制体' })
    bgPrefabs: Prefab[] = [];
    @property({ tooltip: '每行背景块数量' })
    cols: number = 6;
    @property({ tooltip: '每列背景块数量' })
    rows: number = 10;
    @property({ tooltip: '每个背景块的高度' })
    cellHeight: number = 64;
    @property({ tooltip: '每个背景块的宽度' })
    cellWidth: number = 64;
    @property({ tooltip: '下落速度（像素/秒）' })
    speed: number = 40;

    private grid: Node[][] = [];

    onLoad() {
        this.createGrid();
    }

    createGrid() {
        // 清理旧节点
        this.node.removeAllChildren();
        this.grid = [];
        for (let r = 0; r < this.rows + 1; r++) {
            const row: Node[] = [];
            for (let c = 0; c < this.cols; c++) {
                const prefabIdx = (r + c) % 3;
                const prefab = this.bgPrefabs[prefabIdx];
                const node = instantiate(prefab);
                node.parent = this.node;
                node.setPosition(
                    c * this.cellWidth + this.cellWidth / 2,
                    r * this.cellHeight + this.cellHeight / 2,
                    0
                );
                row.push(node);
            }
            this.grid.push(row);
        }
    }

    update(dt: number) {
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.cols; c++) {
                const node = this.grid[r][c];
                let y = node.position.y - this.speed * dt;
                // 超出底部则重置到顶部
                if (y < -this.cellHeight / 2) {
                    y += (this.rows + 1) * this.cellHeight;
                }
                node.setPosition(node.position.x, y, 0);
            }
        }
    }
} 