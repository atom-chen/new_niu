import { IData } from "./IData";

enum EM_PoolType {
    ePT_None = 0,
    ePT_SingleFish,             //单体鱼
    ePT_SuperBombFish,          //超级炸弹
    ePT_DaSanYuanFish,             //大三元
    ePT_DaSiXiFish,                 //大四喜
    ePT_AutoIncrementFish,      //自增长的鱼（李逵）
    ePT_YjsdFish,               //一箭双雕
    ePT_YiShiSanYuFish,               //一石三鱼
    ePT_JinYuManTangFish,        //金玉满堂
    ePT_FishKingFish,           //鱼王
    ePT_LightFish,           //闪电
    ePT_Bullet,                 //子弹
    ePT_Net,                    //网
    ePT_Coin,                   //金币
    ePT_Score,                  //得分
    ePT_Lightning,              //闪电
    ePT_CatchFishMul,           //分数层
    ePT_ItemFishTrace,          //鱼的游动Item
    ePT_CtrlWaring,          //警告信息
}

interface PoolConfig {
    readonly poolType: EM_PoolType;
    readonly url: string;         //路径
    readonly num: number;         //预生成数量
}

//todo:预制体对象池配置
const ALL_POOL_INFO: PoolConfig[] = [
    // {
    //     poolType: EM_PoolType.ePT_SingleFish,
    //     url: "Pool/SignleFish",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_ItemFishTrace,
    //     url: "Pool/ItemFishTrace",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_Bullet,
    //     url: "Pool/ItemBullet",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_Net,
    //     url: "Pool/ItemNet",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_Score,
    //     url: "Pool/ItemScore",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_Coin,
    //     url: "Pool/ItemCoin",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_Lightning,
    //     url: "Pool/ItemLightning",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_CatchFishMul,
    //     url: "Pool/ItemCatchFishMul",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_AutoIncrementFish,
    //     url: "Pool/AutoIncrementFish",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_YjsdFish,
    //     url: "Pool/YjsdFish",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_YiShiSanYuFish,
    //     url: "Pool/YiShiSanYuFish",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_JinYuManTangFish,
    //     url: "Pool/JinYuManTangFish",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_FishKingFish,
    //     url: "Pool/FishKingFish",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_LightFish,
    //     url: "Pool/LightFish",
    //     num:300
    // },
    // {
    //     poolType: EM_PoolType.ePT_CtrlWaring,
    //     url: "Pool/CtrlWarning",
    //     num:20
    // },
    // {
    //     poolType: EM_PoolType.ePT_SuperBombFish,
    //     url: "Pool/SuperBombFish",
    //     num:20
    // },
    // {
    //     poolType: EM_PoolType.ePT_DaSanYuanFish,
    //     url: "Pool/DaSanYuanFish",
    //     num:20
    // },
    // {
    //     poolType: EM_PoolType.ePT_DaSiXiFish,
    //     url: "Pool/DaSiXiFish",
    //     num:20
    // },
];


class PoolData extends IData {
    private m_mapData: { [index: number]: PoolConfig } = {};

    public init(): void {
        for (let data of ALL_POOL_INFO) {
            this.m_mapData[data.poolType] = data;
        }
    }

    public getPoolConfig(poolType: EM_PoolType): PoolConfig {
        return this.m_mapData[poolType];
    }
}

export { EM_PoolType, PoolData, PoolConfig, ALL_POOL_INFO }