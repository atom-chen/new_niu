import { IData } from "./IData";

export enum EM_SoundType {
    EFECT_TONGYONG_FISH_BIGIN =0,
    EFECT_TONGYONG_FISH_END =11,
    EFECT_TE_XIAO_BEGIN = 12,
    EFECT_TE_XIAO_ENG = 27,
    eSound_1,
    eWAVE,          //海浪
    EFFECT_COLLECT_COIN,
    EFFECT_DROP_COIN,
    EFFECT_PARTICAL_BIG_BOMB,
    BOMB_ELECTRIC,
    eBtn_Click,//单机
}

type SOUND_MAP = {[idSound: string]: string};

export class SoundData extends IData
{
    private m_mapSound: SOUND_MAP = {};

    public init(): void
    {
        //--- 通用音效
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_BIGIN, "effect/fisha1.mp3");
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_BIGIN + 1, "effect/fisha2.mp3");
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_BIGIN + 2, "effect/fisha3.mp3");
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_BIGIN + 3, "effect/fisha4.mp3");
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_BIGIN + 4, "effect/fisha5.mp3");
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_BIGIN + 5, "effect/fisha7.mp3");
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_BIGIN + 6, "effect/fisha8.mp3");
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_BIGIN + 7, "effect/fisha10.mp3");
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_BIGIN + 8, "effect/fisha11.mp3");
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_BIGIN + 9, "effect/fisha12.mp3");
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_BIGIN + 10, "effect/fisha13.mp3");
        this.addSound(EM_SoundType.EFECT_TONGYONG_FISH_END, "effect/fisha14.mp3");
        //--- 特效音效
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN, "effect/fisha6.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+1, "effect/fisha15.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+2, "effect/fisha9.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+3, "effect/fisha17.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+4, "effect/fisha16.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+5, "effect/fisha18.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+6, "effect/fisha19.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+7, "effect/fisha20.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+8, "effect/fisha21.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+9, "effect/fisha22.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+10, "effect/fisha23.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+11, "effect/fisha24.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+12, "effect/fisha25.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+13, "effect/fisha26.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_BEGIN+14, "effect/fisha27.mp3");
        this.addSound(EM_SoundType.EFECT_TE_XIAO_ENG, "effect/fisha28.mp3");

        this.addSound(EM_SoundType.eSound_1, "fire1.mp3");
        this.addSound(EM_SoundType.eWAVE, "effect/surf.mp3");
        this.addSound(EM_SoundType.EFFECT_COLLECT_COIN, "effect/collect_coin.mp3");
        this.addSound(EM_SoundType.EFFECT_DROP_COIN, "effect/drop_gold.mp3");
        this.addSound(EM_SoundType.EFFECT_PARTICAL_BIG_BOMB, "effect/BigBang.mp3");
        this.addSound(EM_SoundType.BOMB_ELECTRIC, "effect/electric.mp3");
        this.addSound(EM_SoundType.eBtn_Click, "effect/click.mp3");

    }

    private addSound(idSound: number|string, strUrl: string): void
    {
        this.m_mapSound[idSound] = strUrl;
    }

    public getSoundUrl(idSound: number|string): string
    {
        if(!this.m_mapSound[idSound]){
            console.error(`getSoundUrl err ${idSound}`);
        }
        return this.m_mapSound[idSound];
    }
}
