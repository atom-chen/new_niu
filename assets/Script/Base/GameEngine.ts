import { fireDef } from "./Const";
import { UIManager } from "../Manager/UIManager";
import UIPlayerInfo from "../UI/UIPlayerInfo";
import { EM_UIType } from "../Data/UIData";
import { FireFailureReason, subGameMSG } from "../GameData/SubGameMSG";
import { DE_BUG, GPlayerNum } from "../GameData/Config";
import UIFish from "../UI/UIFish";
import UITable from "../UI/UITable";
import UIBullet from "../UI/UIBullet";
import { DataManager } from "../Manager/DataManager";
import { CannonKindConfig, GameConfig, GameSceneData, SCatchFish, SUserFire } from "../GameData/MsgDefine";
import { AudioManager } from "../Manager/AudioManager";
import { EM_SoundType } from "../Data/SoundData";
import { musicRes } from "../GameData/GameConst";
import { ReductionFishWay } from "../GameData/GameConst";
import GD = require('../GD');
import define = require('../define');
import UISeatHint from "../UI/UISeatHint";
export default class GameEngine {
    private constructor() { };
    private static s_inst: GameEngine = null;
    private m_bindObj = [];
    private receiveSceneMessage = false;

    public static instance(): GameEngine {
        if (GameEngine.s_inst == null) {
            GameEngine.s_inst = new GameEngine();
        }
        return GameEngine.s_inst;
    }
    public init() {
        this.m_bindObj.push(onfire.on(fireDef.onEventUserEnter, this.onEventUserEnter.bind(this)));
        this.m_bindObj.push(onfire.on(fireDef.onEventSceneMessage, this.onEventSceneMessage.bind(this)));
        this.m_bindObj.push(onfire.on(fireDef.onEventGameMessage, this.onEventGameMessage.bind(this)));
        this.m_bindObj.push(onfire.on(fireDef.onLogonSuccess, this.onLogonSuccess.bind(this)));
    }
    public destory(): void {
        for (let i = 0; i < this.m_bindObj.length; i++) {
            onfire.un(this.m_bindObj[i])
        }
    }
    onEventSceneMessage(status, data: GameSceneData) {
        this.receiveSceneMessage = true;
        let bgIndex = data.bgIndex;
        let bgmIndex = data.bgmIndex;
        let fishes = data.fishes;
        let playerScoreInfo = data.playerScoreInfo;
        let reductionFishWay = data.reductionFishWay;

        let bgLayer = UIManager.instance().getWindow(EM_UIType.eUT_Ocean).getComponent(UIOcean);
        bgLayer.setBgIndex(bgIndex);

        let bgm = [musicRes.BGM_1, musicRes.BGM_2, musicRes.BGM_3, musicRes.BGM_4];
        AudioManager.instance().playMusic(bgm[bgmIndex]);

        let fishLayer = UIManager.instance().getWindow(EM_UIType.eUT_Fish).getComponent(UIFish);

        //恢复场面鱼的方式有两种，
        if (reductionFishWay == ReductionFishWay.NormalWay) {
            fishLayer.clearAllFish();

            for (let i = 0; i < fishes.length; ++i) {
                let fishData = fishes[i];
                fishLayer.activeFish(fishData);
            }
        } else if (reductionFishWay == ReductionFishWay.FishArrayWay) {

            let fishArrayKind = data.fishArrayKind;             //鱼阵ID
            let randseek = data.randseek;                       //随机数种子
            fishLayer.clearAllFish();
            fishLayer.startFishArray({ fishArrayKind: fishArrayKind, randseek: randseek, fishData: fishes });
        }

        //更新玩家分数
        let node: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_PlayerInfo);
        let uiPlayerInfo: UIPlayerInfo = node.getComponent(UIPlayerInfo);
        for (let i = 0; i < playerScoreInfo.length; ++i) {
            let scoreInfo = playerScoreInfo[i];
            uiPlayerInfo.setScore(scoreInfo.chairID, scoreInfo.score);
        }

        if (data.isAndroidHelp != null) {
            GD.isAndroidHelp = data.isAndroidHelp;
        }

        fishLayer.doAutoIncrementFish(data.autoIncrementFishInfo);
    }
    onEventGameMessage(subCMD, data) {
        if (!this.receiveSceneMessage && subCMD !== subGameMSG.SUB_S_GAME_CONFIG) return;
        switch (subCMD) {
            case subGameMSG.SUB_S_GAME_CONFIG:
                this.gameConfigDown(data);
                break;
            case subGameMSG.SUB_S_FISH_TRACE:
                this.fishTrace(data);
                break;
            case subGameMSG.SUB_S_SWITCH_SCENE:
                this.switchSence(data);
                break;
            case subGameMSG.SUB_S_FIRE_FAILURE: {
                this.fireErr(data);
                break;
            }
            case subGameMSG.SUB_S_USER_FIRE: {
                this.userFire(data);
                break;
            }
            case subGameMSG.SUB_S_START_FISH_ARRAY:
                this.startFishArray(data);
                break;
            case subGameMSG.SUB_S_END_FISH_ARRAY:
                this.onFishArrayEnd(data);
                break;
            case subGameMSG.SUB_S_CATCH_FISH:
                this.onSubCatchFish(data);
                break;
            case subGameMSG.SUB_S_BULLET_ION_TIMEOUT:
                this.onSubBulletIonTimeout(data);
                break;
            case subGameMSG.SUB_S_CHANGE_MULTIPLE_FAILURE:
                this.changeBulletMultipleFailure(data);
                break;
            case subGameMSG.SUB_S_LOCK_TIMEOUT:
                this.cancelFixScreen();
                break;
            case subGameMSG.SUB_S_SYSTEM_TIP:
                UIManager.instance().buildToast(data);
                break;
            case subGameMSG.SUB_S_SPECIFY_ANDROID_HELP_CHAIR:
                GD.isAndroidHelp = true;
                break;
            case subGameMSG.SUB_S_AUTO_INCREMENT:
                let fishLayer = UIManager.instance().getWindow(EM_UIType.eUT_Fish).getComponent(UIFish);
                fishLayer.doAutoIncrementFish(data);
                break;
            default:
                console.error("有游戏消息未处理- ", subCMD);
                break;
        }

    }
    //魔能炮时间到
    onSubBulletIonTimeout(data): void {
        if (!GD.isReady) {
            return;
        }
        let idChair: number = data["chairID"];
        let uiPlayerInfo: UIPlayerInfo = UIManager.instance().getWindowScript<UIPlayerInfo>(EM_UIType.eUT_PlayerInfo, UIPlayerInfo);
        uiPlayerInfo.endSuperCannon(idChair);
    }
    //todo:换炮失败
    changeBulletMultipleFailure(data) {
        let userItem = GD.clientKernel.getMeUserItem();
        let uiPlayerInfo: UIPlayerInfo = UIManager.instance().getWindowScript<UIPlayerInfo>(EM_UIType.eUT_PlayerInfo, UIPlayerInfo);
        uiPlayerInfo.ctrlUser.setCannonIndex(data.cannonIndex, userItem.bSuperBullet);
        switch (data.reason) {
            case 1:
                UIManager.instance().buildToast("对不起，能量炮期间不能换炮");
                break;
            case 2:
                UIManager.instance().buildToast("对不起， 没有此类型炮");
                break;
        }
    }
    //todo:捕到鱼
    onSubCatchFish(data: SCatchFish) {
        let idChair: number = data["chairID"];
        let bSuperBullet: boolean = data["superBullet"];
        let node: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_PlayerInfo);
        let uiPlayerInfo: UIPlayerInfo = node.getComponent(UIPlayerInfo);
        UIManager.instance().getWindow(EM_UIType.eUT_Fish).getComponent(UIFish).onCatchFish(data);
        //切换魔能炮
        if (bSuperBullet) {
            uiPlayerInfo.startSuperCannon(idChair);
        }
    }
    //todo:当鱼阵结束时
    onFishArrayEnd(data) {
        let bgmIndex = data.bgmIndex;
        let bgm = [musicRes.BGM_1, musicRes.BGM_2, musicRes.BGM_3, musicRes.BGM_4];
        AudioManager.instance().playMusic(bgm[bgmIndex]);
    }
    /**todo:开始鱼阵
     *
     * @param data
     */
    startFishArray(data) {
        GD.isAllowFire = true;
        let fishLayer = UIManager.instance().getWindow(EM_UIType.eUT_Fish).getComponent(UIFish);
        fishLayer.clearAllFish();
        this.allUnlockFish();

        // fishLayer.logFishLen();

        fishLayer.startFishArray(data);
        GD.switingScene = false;
    }
    //todo:解锁所有鱼
    allUnlockFish() {
        let uiPlayerInfo = UIManager.instance().getWindow(EM_UIType.eUT_PlayerInfo).getComponent(UIPlayerInfo);
        uiPlayerInfo.allUnlockFish();

        let uiBullet = UIManager.instance().getWindow(EM_UIType.eUT_Bullet).getComponent(UIBullet);
        uiBullet.allUnlockFish();
    }
    //todo:切换鱼阵
    switchSence(data) {
        GD.isAllowFire = false;
        GD.switingScene = true;
        this.allUnlockFish();
        //切换场景
        let gameSceneLayer = UIManager.instance().getWindow(EM_UIType.eUT_Ocean).getComponent(UIOcean);
        gameSceneLayer.SwitchScene(data);
    }
    //todo:鱼路径
    fishTrace(data) {
        let fishLayer = UIManager.instance().getWindow(EM_UIType.eUT_Fish).getComponent(UIFish);
        for (let i = 0; i < data.length; ++i) {
            fishLayer.activeFish(data[i]);
        }
    }
    //todo:游戏配置
    gameConfigDown(data: GameConfig) {
        GD.fishConfig = data;
        //配置游戏 人数
        GD.isAllowFire = true;
        GD.isReady = true;
        let uiPlayerInfo: UIPlayerInfo = UIManager.instance().getWindowScript<UIPlayerInfo>(EM_UIType.eUT_PlayerInfo, UIPlayerInfo);
        uiPlayerInfo.setDefault(null);
    }
    //todo:用户开火
    userFire(fireData: SUserFire) {
        if (!GD.isReady) {
            return;
        }

        let idChair: number = fireData["chairID"];
        let nCannonIndex: number = fireData["cannonIndex"];

        if (fireData.bulletIDArray == null) {
            return;
        }

        let node: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_PlayerInfo);
        let uiPlayerInfo: UIPlayerInfo = node.getComponent(UIPlayerInfo);

        //其他玩家做开炮表现，自己只要扣钱
        if (idChair != GD.chairID) {
            uiPlayerInfo.fire(fireData);
        }
        else {
            AudioManager.instance().playSound(EM_SoundType.eSound_1);
            for (let i = 0; i < fireData.bulletIDArray.length; ++i) {
                let uiBullet: UIBullet = UIManager.instance().getWindowScript<UIBullet>(EM_UIType.eUT_Bullet, UIBullet);
                //应该给自己的子弹填充相应数值bulletIndex, 减少服务端压力
                uiBullet.setBulletIndexfunction(fireData.bulletIDArray[i], fireData.bulletIndexArray[i], idChair);
                //统计自己打出去多少钱
                GD.payMoney += GD.fishConfig.cannonKindConfigArray[nCannonIndex].multiple;
            }
        }

        let cannonConfig: CannonKindConfig = GD.fishConfig.cannonKindConfigArray[nCannonIndex];
        uiPlayerInfo.modifyScore(idChair, -cannonConfig.multiple * fireData.bulletIDArray.length);
    };
    //todo :开火失败
    fireErr(data) {
        if (!GD.isReady) {
            return;
        }
        let nReason: number = data["reason"];
        let szBulletId: number[] = data["bulletIDArray"];
        let nAllScore = data["allScore"];

        let str: string = "";
        switch (nReason) {
            case FireFailureReason.LessMoney:
                {
                    str = DataManager.instance().str.getString("money_low");
                }
                break;
            case FireFailureReason.TooManyBullets:
                {
                    str = DataManager.instance().str.getString("many_bullets");
                }
                break;
            default:
                {
                    str = DataManager.instance().str.getString("fire_fail");
                }
                break;
        }
        UIManager.instance().buildToast(str);

        //把子弹收回来，把钱加回去
        let idChair: number = GD.chairID;
        let uiBullet: UIBullet = UIManager.instance().getWindowScript<UIBullet>(EM_UIType.eUT_Bullet, UIBullet);
        for (let i = 0; i < szBulletId.length; ++i) {
            let idBullet: number = szBulletId[i];
            uiBullet.deleteBullet(idChair, idBullet);
        }

        let uiPlayerInfo: UIPlayerInfo = UIManager.instance().getWindowScript<UIPlayerInfo>(EM_UIType.eUT_PlayerInfo, UIPlayerInfo);
        uiPlayerInfo.setScore(idChair, nAllScore);
        uiPlayerInfo.unlockFish(idChair);
    }
    public onEventUserEnter(userItem) {

        if (userItem.getChairID() === GD.chairID) {
            userItem.nCannonIndex = 0;//默认的子弹
            if (GD.chairID > 1) {
                console.error("转动视图 -----------");
                GD.isRotation = true;
                this.rotationView();
            }
        }
        userItem.nSeat = userItem.getChairID();
        if (GD.isRotation) {
            userItem.nSeat = (userItem.nSeat + 2) % 4;//视角
        }
        let uiPlayerInfo: UIPlayerInfo = UIManager.instance().getWindowScript<UIPlayerInfo>(EM_UIType.eUT_PlayerInfo, UIPlayerInfo);
        uiPlayerInfo.addPlayer(userItem);
        uiPlayerInfo.setDefault(userItem);
        if (userItem.getChairID() === GD.chairID) {
            uiPlayerInfo.setUserInfo();
            let uiSeatHint = UIManager.instance().getWindowScript<UISeatHint>(EM_UIType.eUT_SeatHint, UISeatHint);
            uiSeatHint.showHint();
        }

    }
    public onLogonSuccess(): void {
        let uiPlayerInfo: UIPlayerInfo = UIManager.instance().getWindowScript<UIPlayerInfo>(EM_UIType.eUT_PlayerInfo, UIPlayerInfo);
        uiPlayerInfo.setUserInfo();
    }
    cancelFixScreen() {
        let fishLayer = UIManager.instance().getWindowScript<UIFish>(EM_UIType.eUT_Fish, UIFish);
        fishLayer.cancelFixScreen();
    }
    sendGameData(subCMD, data) {
        //开火请求
        GD.clientKernel.sendSocketData(define.gameCMD.MDM_GF_GAME, subCMD, data);
    }
    rotationView() {
        let layers: number[] = [
            EM_UIType.eUT_FishTrace,
            EM_UIType.eUT_Fish
        ];

        layers.forEach(element => {
            let node = UIManager.instance().getWindow(element);

            if (node && node.isValid) {
                node.rotation = 180;
            }
        });
    }
    /**
     *晃动屏幕
     */
    shakeScreen(baseValue?, randomValue?) {
        let scene = cc.director.getScene();
        if (null == scene) {
            return;
        }

        let shakeBaseValue = baseValue || 10;
        let shakeRandomValue = randomValue || 30;
        let dt = 0.05;
        let times = 30;
        let shakeAction = null;

        for (let i = 0; i < times; ++i) {
            let action = cc.place(Math.random() > 0.5 ? shakeBaseValue + Math.random() * shakeRandomValue : -shakeBaseValue - Math.random() * shakeRandomValue, Math.random() > 0.5 ? shakeBaseValue + Math.random() * shakeRandomValue : -shakeBaseValue - Math.random() * shakeRandomValue);
            shakeAction = shakeAction ? cc.sequence(cc.delayTime(dt), action, shakeAction) : cc.sequence(cc.delayTime(dt), action);
        }
        shakeAction = cc.sequence(shakeAction, cc.place(0, 0));
        shakeAction.setTag(1234);

        let layers: number[] = [
            EM_UIType.eUT_Ocean,
            EM_UIType.eUT_WaterMark,
            EM_UIType.eUT_FishTrace,
            EM_UIType.eUT_Fish,
            EM_UIType.eUT_Bullet,
            EM_UIType.eUT_Net,
            EM_UIType.eUT_Coin,
            EM_UIType.eUT_Score,
            EM_UIType.eUT_Effect,
            EM_UIType.eUT_Lightning,
            EM_UIType.eUT_CatchFishMulLayer
        ];

        layers.forEach(element => {
            let node = UIManager.instance().getWindow(element);
            if (node && node.isValid) {
                node.stopActionByTag(1234);
                node.runAction(shakeAction.clone());
            }
        });
    }
}