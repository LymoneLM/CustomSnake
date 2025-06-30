import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {
    @property({ type: Label, tooltip: '显示分数的标签' })
    scoreLabel: Label = null;

    /**
     * 更新分数显示
     * @param score 当前分数
     */
    updateScore(score: number) {
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${score}`;
        }
    }
} 