/*
 * todo:序列帧动画配置
 */

import { IData } from "./IData";

enum AniID {
    None = 0,
    Coin1 ,       //银币
    Coin2 ,      //金币
    FishKind1_live  ,     //
    water_wave,//水纹
    switch_sence,//切换场景
    fishNet1,
    fishNet2,
    fishNet3,
    fishNet4,

    Lightning1 = 100,      //闪电1
    Lightning2 = 101,      //闪电2
    Lightning3 = 102,      //闪电3
}

interface AniInfo
{
    aniID: AniID;
    prefix: string;         //图集里序列帧动画前缀
    num: number;            //数量
    sample: number;         //动画的帧速率
    occupying: number;      //占位，表示需要几位，如果是零则不处理，1表示帧标号只有一位，2表示两位
                            //fish8_07.png 比如像这样的，前缀一般填fish8， 1到9就需要补一个0， 10以上就不需要补零
    start: number;          //起始位置，默认从1开始
    plist: string;
    loopTime: number;       //循环次数-1表明无限循环
}

const ALL_ANI_INFO: AniInfo[] = [
    {
        aniID: AniID.FishKind1_live,
        prefix: "jinchanbuyu-res-fish-fish1_",
        num: 12,
        sample: 10,
        occupying: 2,
        start: 1,
        plist: "Texture/oldRes/fish",
        loopTime: -1,
    },
    {
        aniID: AniID.water_wave,
        prefix: "res-danaotiangong-watermark-waterAni_",
        num: 16,
        sample: 12,
        occupying: 2,
        start: 1,
        plist: "Texture/watermark",
        loopTime: -1,
    },
    {
        aniID: AniID.switch_sence,
        prefix: "effect_transition_water_",
        num: 15,
        sample: 5,
        occupying: 5,
        start: 0,
        plist: "Texture/effect_transition_water0",
        loopTime: -1,
    },
    {
        aniID: AniID.fishNet1,
        prefix: "res-danaotiangong-net-net10_",
        num: 12,
        sample: 25,
        occupying: 2,
        start: 1,
        plist: "Texture/net/net",
        loopTime: 1,
    },
    {
        aniID: AniID.fishNet2,
        prefix: "res-danaotiangong-net-net20_",
        num: 12,
        sample: 25,
        occupying: 2,
        start: 1,
        plist: "Texture/net/net",
        loopTime: 1,
    },
    {
        aniID: AniID.fishNet3,
        prefix: "res-danaotiangong-net-net30_",
        num: 12,
        sample: 25,
        occupying: 2,
        start: 1,
        plist: "Texture/net/net",
        loopTime: 1,
    },
    {
        aniID: AniID.fishNet4,
        prefix: "res-danaotiangong-net-net40_",
        num: 12,
        sample: 25,
        occupying: 2,
        start: 1,
        plist: "Texture/net/net",
        loopTime: 1,
    },
    {
        aniID: AniID.Coin1,
        prefix: "jinchanbuyu-res-coin-coin1_",
        num: 12,
        sample: 20,
        occupying: 2,
        start: 1,
        plist: "Texture/oldRes/coin",
        loopTime: -1,
    },
    {
        aniID: AniID.Coin2,
        prefix: "jinchanbuyu-res-coin-coin2_",
        num: 12,
        sample: 20,
        occupying: 2,
        start: 1,
        plist: "Texture/oldRes/coin",
        loopTime: -1,
    },
    {
        aniID: AniID.Lightning1,
        prefix: "res-danaotiangong-lightning-lightning1_",
        num: 4,
        sample: 10,
        occupying: 2,
        start: 1,
        plist: "Texture/lightning/lightning",
        loopTime: -1,
    },
    {
        aniID: AniID.Lightning2,
        prefix: "res-danaotiangong-lightning-lightning2_",
        num: 4,
        sample: 10,
        occupying: 2,
        start: 1,
        plist: "Texture/lightning/lightning",
        loopTime: -1,
    },
    {
        aniID: AniID.Lightning3,
        prefix: "res-danaotiangong-lightning-lightning3_",
        num: 5,
        sample: 10,
        occupying: 2,
        start: 1,
        plist: "Texture/lightning/lightning",
        loopTime: -1,
    },
];

class AniData extends IData
{
    private m_mapAni: {[index: number]: AniInfo} = {};

    public init(): void
    {
        for (let data of ALL_ANI_INFO) {
            this.m_mapAni[data.aniID] = data;
        }
    }

    public getAniInfo(idAni: AniID): AniInfo
    {
        return this.m_mapAni[idAni];
    }

}
export {AniID,AniInfo,ALL_ANI_INFO,AniData}