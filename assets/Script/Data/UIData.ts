import { IData } from "./IData";

export enum EM_UIType {
    // eUT_None,
    eUT_Table,          //桌子
    // eUT_UserOption,     //用户操作
    // eUT_PlayerInfo,     //玩家信息
    // eUT_Hint,           //游戏提示
    // eUT_Warning,        //警告
    // eUT_WaterMark,      //水印
    // eUT_FishTrace,      //鱼的轨迹层
    // eUT_Fish,           //鱼层
    // eUT_Bullet,         //子弹层
    // eUT_Net,            //网层
    // eUT_Coin,           //金币层
    // eUT_Score,          //分数层
    // eUT_SwitchScene,    //切换场景过度界面
    // eUT_Lightning,      //闪电层
    // eUT_Notice,         //通知
    // eUT_CatchFishMulLayer,  //分数层
    // eUT_Effect,         //效果层
    // eUT_Setting,        //设置
    // eUT_UIResult,       //结算
    // eUT_SeatHint,       //座位提示
    // NN_Table,     //桌子
}

export enum EM_UI_Area {
    eUA_BgFull,      //背景层
    eUA_SafeArea,    //操作层
    eUA_FrontFull,   //前景层
}

type UI_INFO_MAP = { [id: number]: string };
type UI_AREA_MAP = { [id: number]: EM_UI_Area };

export class UIData extends IData {
    private m_mapUIInfo: UI_INFO_MAP = {};
    private m_mapUIArea: UI_AREA_MAP = {};

    public init(): void {
        this.addUIInfo(EM_UIType.eUT_Table, "UITable", EM_UI_Area.eUA_BgFull);
        // this.addUIInfo(EM_UIType.eUT_WaterMark, "UIWaterMark", EM_UI_Area.eUA_BgFull);
        // this.addUIInfo(EM_UIType.eUT_FishTrace, "UIFishTrace", EM_UI_Area.eUA_SafeArea);

        // this.addUIInfo(EM_UIType.eUT_Fish, "UIFish", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_SwitchScene, "SwitchScene", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_Bullet, "UIBullet", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_Net, "UINet", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_Coin, "UICoin", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_Score, "UIScore", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_Lightning, "UILightning", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_Effect, "UIEffect", EM_UI_Area.eUA_FrontFull);

        // this.addUIInfo(EM_UIType.eUT_UserOption, "UIUserOption", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_PlayerInfo, "UIPlayerInfo", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_Hint, "UIHint", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_Notice, "UINotice", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_CatchFishMulLayer, "UICatchFishMul", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_Warning, "UIWarning", EM_UI_Area.eUA_FrontFull);

        // this.addUIInfo(EM_UIType.eUT_Setting, "UISetting", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_UIResult, "UIResult", EM_UI_Area.eUA_FrontFull);
        // this.addUIInfo(EM_UIType.eUT_SeatHint, "UISeatHint", EM_UI_Area.eUA_FrontFull);
    }

    private addUIInfo(id: number, strName: string, area: number) {
        this.m_mapUIInfo[id] = strName;
        this.m_mapUIArea[id] = area;
    }
    //获取到层
    public getUIInfo(eType: EM_UIType): string {
        return this.m_mapUIInfo[eType];
    }
    //获取到层所属类型
    public getUIArea(eType: EM_UIType): EM_UI_Area {
        let eRtn = this.m_mapUIArea[eType];
        return null == eRtn ? EM_UI_Area.eUA_FrontFull : eRtn;
    }
}
