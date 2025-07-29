import { _decorator, Component, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {

    @property({ type: AudioSource, tooltip: '背景音乐播放器' })
    bgmSource: AudioSource = null;
    @property({ type: AudioSource, tooltip: '音效播放器' })
    sfxSource: AudioSource = null;

    @property({ type: AudioClip, tooltip: '主菜单背景音乐' })
    bgmMenu: AudioClip = null;
    @property({ type: AudioClip, tooltip: '游戏内背景音乐' })
    bgmGame: AudioClip = null;
    
    @property({ type: AudioClip, tooltip: '开始游戏音效' })
    sfxStart: AudioClip = null;
    @property({ type: AudioClip, tooltip: '吃到食物音效' })
    sfxEat: AudioClip = null;
    @property({ type: AudioClip, tooltip: '死亡音效' })
    sfxDie: AudioClip = null;
    @property({ type: AudioClip, tooltip: '按钮点击音效' })
    sfxClick: AudioClip = null;


    playBgm(clip: AudioClip) {
        if (!this.bgmSource || !clip) return;
        // 如果正在播放同一个BGM，则不重新播放
        if (this.bgmSource.playing && this.bgmSource.clip === clip) {
            return;
        }
        this.bgmSource.stop();
        this.bgmSource.clip = clip;
        this.bgmSource.loop = true;
        this.bgmSource.play();
    }

    playBgmMenu() {
        this.playBgm(this.bgmMenu);
    }

    playBgmGame() {
        this.playBgm(this.bgmGame);
    }

    stopBgm() {
        if (this.bgmSource) {
            this.bgmSource.stop();
        }
    }

    playSfx(clip: AudioClip) {
        if (this.sfxSource) {
            this.sfxSource.playOneShot(clip);
        }
    }

    playSfxStart() {
        this.playSfx(this.sfxStart);
    }

    playSfxEat() {
        this.playSfx(this.sfxEat);
    }

    playSfxDie() {
        this.playSfx(this.sfxDie);
    }

    playSfxClick() {
        this.playSfx(this.sfxClick);
    }
}


