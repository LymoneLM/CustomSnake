import { _decorator, Component, Node, Label, Button, instantiate, UITransform } from 'cc';
import { History, HistoryRecord } from '../core/History';
import { UIMain } from './UIMain';
import { GameManager } from '../core/GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIHistory')
export class UIHistory extends Component {
    @property({ type: Node, tooltip: '历史记录面板父节点' })
    historyPanel: Node = null;
    @property({ type: Node, tooltip: '历史记录内容父节点' })
    content: Node = null;
    @property({ type: Label, tooltip: '历史记录模板Label' })
    itemTemplate: Label = null;
    @property({ type: Button, tooltip: '关闭按钮' })
    closeBtn: Button = null;
    @property({ type: Number, tooltip: '最大显示条数' })
    maxCount: number = 10;
    @property({ type: Number, tooltip: '每条记录垂直间距' })
    itemSpacing: number = 30;

    onLoad() {
        if (this.closeBtn) {
            this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        }
        if (this.historyPanel) this.historyPanel.active = false;
    }

    show() {
        if (this.historyPanel) this.historyPanel.active = true;
        this.refresh();
    }

    hide() {
        if (this.historyPanel) this.historyPanel.active = false;
    }

    // 新增：关闭按钮事件只通知GameManager
    onCloseBtnClick() {
        GameManager.Instance?.onCloseHistory();
    }

    refresh() {
        if (!this.content || !this.itemTemplate) return;
        // 清空旧内容
        this.content.removeAllChildren();
        let records = History.getRecords();
        if (records.length === 0) {
            const empty = instantiate(this.itemTemplate.node);
            empty.getComponent(Label).string = '暂无历史记录';
            empty.active = true;
            empty.setPosition(0, 0);
            empty.getComponent(Label).horizontalAlign = Label.HorizontalAlign.LEFT;
            this.content.addChild(empty);
            return;
        }
        // 按分数降序排列
        records = records.slice().sort((a, b) => b.score - a.score);
        function pad2(n: number) { return n < 10 ? '0' + n : '' + n; }
        for (let i = 0; i < Math.min(records.length, this.maxCount); i++) {
            const item = instantiate(this.itemTemplate.node);
            item.active = true;
            const rec = records[i];
            const date = new Date(rec.time);
            // 格式化时间 YY-MM-DD HH:MM
            const yy = String(date.getFullYear()).slice(2);
            const mm = pad2(date.getMonth() + 1);
            const dd = pad2(date.getDate());
            const hh = pad2(date.getHours());
            const min = pad2(date.getMinutes());
            const timeStr = `${i + 1}.  ${yy}-${mm}-${dd} ${hh}:${min}   分数: ${rec.score}`;
            const label = item.getComponent(Label);
            label.string = timeStr;
            label.horizontalAlign = Label.HorizontalAlign.LEFT;
            const uiTrans = item.getComponent(UITransform);
            if (uiTrans) uiTrans.anchorX = 0;
            item.setPosition(0, -i * this.itemSpacing);
            this.content.addChild(item);
        }
    }
}


