import { sys } from 'cc';

export interface HistoryRecord {
    score: number;
    time: number; // 时间戳
}

export class History {
    private static STORAGE_KEY = 'snake_history';
    private static MAX_RECORDS = 20;

    // 获取历史记录
    static getRecords(): HistoryRecord[] {
        const str = sys.localStorage.getItem(this.STORAGE_KEY);
        if (!str) return [];
        try {
            return JSON.parse(str) as HistoryRecord[];
        } catch {
            return [];
        }
    }

    // 添加一条记录
    static addRecord(record: HistoryRecord) {
        let records = this.getRecords();
        records.unshift(record); // 新纪录放前面
        if (records.length > this.MAX_RECORDS) {
            records = records.slice(0, this.MAX_RECORDS);
        }
        sys.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    }

    // 清空历史记录
    static clear() {
        sys.localStorage.removeItem(this.STORAGE_KEY);
    }
} 