import { DataManager } from "./DataManager";

type SOUND_RECORD_MAP = { [idSound: number]: number[] };

export class AudioManager {
    private constructor() { };
    private m_musicVolume: number = 1.0;        //背景音乐（0.0 ~ 1.0）
    private m_soundVolume: number = 1.0;        //音效（0.0 ~ 1.0）
    private m_idAudioMusic: number = -1;        //背景音乐id
    private m_szAudioSound: number[] = [];      //音效id数组
    private m_mapSoundRecord: SOUND_RECORD_MAP = {};    //防止同个音效一下播放太多炸了

    private static s_inst: AudioManager = null;
    public static instance(): AudioManager {
        if (AudioManager.s_inst == null) {
            AudioManager.s_inst = new AudioManager();
        }
        return AudioManager.s_inst;
    }

    public init(): void {
        let t = cc.sys.localStorage.getItem("musicVolume");
        if (t != null) {
            this.m_musicVolume = parseFloat(t);
        }

        t = cc.sys.localStorage.getItem("soundVolume");
        if (t != null) {
            this.m_soundVolume = parseFloat(t);
        }

        cc.game.on(cc.game.EVENT_HIDE, this.pauseAll.bind(this));
        cc.game.on(cc.game.EVENT_SHOW, this.resumeAll.bind(this));
    }

    public destory(): void {
        cc.game.off(cc.game.EVENT_HIDE, this.pauseAll.bind(this));
        cc.game.off(cc.game.EVENT_SHOW, this.resumeAll.bind(this));
        cc.audioEngine.stopAll();
        cc.audioEngine.uncacheAll();
    }

    private getUrl(url: string): string {
        return cc.url.raw("resources/Audio/" + url);
    }

    public playMusic(idMusic: number | string): void {
        let strUrl: string = DataManager.instance().music.getMusicUrl(idMusic);
        let strAudioUrl: string = this.getUrl(strUrl);
        if (this.m_idAudioMusic >= 0) {
            cc.audioEngine.stop(this.m_idAudioMusic);
        }
        this.m_idAudioMusic = cc.audioEngine.play(strAudioUrl, true, this.m_musicVolume);
    }

    public playSound(idSound: number | string, bLoop: boolean = false): number {
        //防止爆音
        let curTime = Date.now();
        if (this.m_mapSoundRecord[idSound] == null) {
            this.m_mapSoundRecord[idSound] = [];
            this.m_mapSoundRecord[idSound].push(curTime);
        }
        else {
            let szPlayTime: number[] = this.m_mapSoundRecord[idSound];
            if (szPlayTime.length >= 5 && szPlayTime[0] + 1000 > curTime) {
                return;
            }

            let i = 0;
            for (; i < szPlayTime.length; ++i) {
                if (szPlayTime[i] + 1000 > curTime) {
                    break;
                }
            }

            for (let j = 0; j < i; ++j) {
                szPlayTime.pop();
            }
            szPlayTime.push(curTime);
        }

        let strUrl: string = DataManager.instance().sound.getSoundUrl(idSound);
        let strAudioUrl: string = this.getUrl(strUrl);
        let idAudio = cc.audioEngine.play(strAudioUrl, bLoop, this.m_soundVolume);

        this.m_szAudioSound.push(idAudio);
        cc.audioEngine.setFinishCallback(idAudio, () => {
            for (let i = 0; i < this.m_szAudioSound.length; ++i) {
                if (this.m_szAudioSound[i] == idAudio) {
                    this.m_szAudioSound.splice(i, 1);
                    break;
                }
            }
        })
        return idAudio;
    }

    public setMusicVolume(volume: number): void {
        if (this.m_musicVolume != volume) {
            this.m_musicVolume = volume;
            cc.sys.localStorage.setItem("musicVolume", volume);
            cc.audioEngine.setVolume(this.m_idAudioMusic, volume);
        }
    }

    public getMusicVolume(): number {
        return this.m_musicVolume;
    }

    public setSoundVolume(volume: number): void {
        if (this.m_soundVolume != volume) {
            this.m_soundVolume = volume;
            cc.sys.localStorage.setItem("soundVolume", volume);
            for (let i = 0; i < this.m_szAudioSound.length; ++i) {
                cc.audioEngine.setVolume(this.m_szAudioSound[i], volume);
            }
        }
    }

    public getSoundVolume(): number {
        return this.m_soundVolume;
    }

    public stopAudio(idAudio): void {
        if (idAudio >= 0) {
            cc.audioEngine.stop(idAudio);
        }
    }

    public pauseAll(): void {
        cc.audioEngine.pauseAll();
    }

    public resumeAll(): void {
        cc.audioEngine.resumeAll();
    }
}
