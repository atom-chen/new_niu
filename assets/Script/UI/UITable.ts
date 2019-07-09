import { SpriteManager } from "../Manager/SpriteManager";
import { EM_SpriteType } from "../Data/SpriteData";
import { UIManager } from "../Manager/UIManager";
import { EM_UIType } from "../Data/UIData";
import { AudioManager } from "../Manager/AudioManager";
import UISwitchScene from "./UISwitchScene";
import UIFish from "./UIFish";
import { GScaleScreenWidth, V } from "../GameData/Config";
import GD = require('../GD');
const { ccclass, property } = cc._decorator;

@ccclass
export default class UITable extends cc.Component {
    @property({
        type: cc.Sprite,
        tooltip: "背景层图片精灵"
    })
    public imgBg: cc.Sprite = null;
    @property({
        type: cc.Sprite,
        tooltip: "桌面中的logo"
    })
    public imgLogo: cc.Sprite = null;
    bgIdex: number = 0;
    bgmIdex: number = 0;
    switchNode: cc.Node = null;

    private m_nReqCounter: number = 0;
    private m_nCounter: number = 15;

    onLoad() {
        V.left = 0;
        V.right = cc.director.getWinSize().width;
        console.error(`left=${V.left} right=${V.right}`);
        let size = cc.director.getWinSize();
        GScaleScreenWidth = (size.width / size.height) / (V.w / V.h);
    }

    start() {
        SpriteManager.instance().setImageSprite(this.imgBg, EM_SpriteType.bg);
        SpriteManager.instance().setImageSprite(this.imgLogo, EM_SpriteType.logo);
        this.openWindow();
    }
    private openWindow(): void {
        // this.requestOpenWindow(EM_UIType.eUT_WaterMark, 1);
        // this.requestOpenWindow(EM_UIType.eUT_FishTrace, 2);
        // this.requestOpenWindow(EM_UIType.eUT_Fish, 2);
        // this.requestOpenWindow(EM_UIType.eUT_SwitchScene, 3);
        // this.requestOpenWindow(EM_UIType.eUT_Bullet, 4);
        // this.requestOpenWindow(EM_UIType.eUT_Net, 5);
        // this.requestOpenWindow(EM_UIType.eUT_SeatHint, 5);
        // this.requestOpenWindow(EM_UIType.eUT_UserOption, 6);
        // this.requestOpenWindow(EM_UIType.eUT_PlayerInfo, 7);
        // this.requestOpenWindow(EM_UIType.eUT_Coin, 8);
        // this.requestOpenWindow(EM_UIType.eUT_Score, 9);
        // this.requestOpenWindow(EM_UIType.eUT_Lightning, 10);
        // this.requestOpenWindow(EM_UIType.eUT_CatchFishMulLayer, 11);
        // this.requestOpenWindow(EM_UIType.eUT_Effect, 12);
        // this.requestOpenWindow(EM_UIType.eUT_Setting, 13);
    }

    private requestOpenWindow(id: number, order: number) {
        UIManager.instance().openWindow(id, (node) => { this.openWindowCallBack(node) }, order);
    }

    public openWindowCallBack(node: cc.Node): void {
        ++this.m_nReqCounter;
        if (this.m_nCounter == this.m_nReqCounter) {
            GD.clientKernel.onClientReady();
        }
    }
    public SwitchScene(data) {
        this.bgIdex = data.bgIndex;
        this.bgmIdex = data.bgmIndex;
        if (!this.switchNode) {
            this.switchNode = UIManager.instance().getWindow(EM_UIType.eUT_SwitchScene);
        }
        this.switchNode.active = true;
        let uiSw: UISwitchScene = this.switchNode.getComponent(UISwitchScene);
        uiSw.setSprite(data.bgIndex);
        uiSw.startToSwitch(data, this.onSwitchSceneEnd.bind(this));
    }

    public onSwitchSceneEnd() {
        SpriteManager.instance().setImageSprite(this.imgBg, this.bgIdex);
        //切換背景音樂
        // AudioManager.instance().playMusic(this.bgmIdex);

        // this.switchNode.active = false;
        if (GD.switingScene) {
            //清除所有的鱼
            let uiFish = UIManager.instance().getWindow(EM_UIType.eUT_Fish).getComponent(UIFish);
            uiFish.clearAllFish();
        }
    }
    public setBgIndex(bgIndex) {
        this.bgIdex = bgIndex;
        SpriteManager.instance().setImageSprite(this.imgBG, this.bgIdex);
    }
}
