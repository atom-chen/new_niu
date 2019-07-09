import {ItemFish} from "./ItemFish";
import {UIManager} from "../Manager/UIManager";
import {EM_UIType} from "../Data/UIData";
import UIFishTrace from "./UIFishTrace";
import ItemFishTrace from "./ItemFishTrace";
import {SpriteAction} from "../Base/SpriteAction";
import {GFishKindAnimationFN_FRAME} from "../GameData/Config";
import AniManager from "../Manager/AniManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class CombinedBaseFish extends ItemFish {

    //update用父类的没用旧代码 有啥隐患？

    reuse(fishKind: number, subFishKind: number, fishID: number, fishIndex: number,
          fishTraceType: number, fishPath: cc.Vec2[], delayTime: number) {

        this.fishKind = null;
        this.fishID = null;
        this.fishIndex = null;

        this.routeAction = null;                         //  路径动作
        this.fishTraceType = null;
        this.fishPath = null;
        this.valid = true;                                //是否有效
        this.delayTime = 0;
        this.prePos = cc.p();
        this.cacheRect = null;                        //缓存的rect
        this.lastCallGetRectingPos = null;                    //最后一次调用 getRect时， 鱼的位置
        this.subFishKind = null;

        this.node.opacity = 255;
        this.node.setLocalZOrder(0);
        this.node.rotation = 0;
        this.node.setScale(1);           //会被改变
        for (let i = 0; i < this.fishSprite.length; ++i) {
            this.fishSprite[i].setScale(1);
            this.shadowSprite[i].setScale(1);
        }

        if (null != this.nodeTrace) {
            console.error('error: fish have node trace already!!');
        }
        else {
            this.nodeTrace = UIManager.instance().getWindowScript(EM_UIType.eUT_FishTrace, UIFishTrace).addFishTrace();
        }
        this.nodeTrace.getComponent(ItemFishTrace).reuse(this.node);

        this.fishKind = fishKind;
        this.fishID = fishID;
        this.fishIndex = fishIndex;
        this.fishTraceType = fishTraceType;
        this.fishPath = fishPath;
        this.delayTime = delayTime;
        this.subFishKind = subFishKind;
        this.initEx();
        this.prePos = cc.p(0, 0);
    }
    //当心 ， 同一对象会多次调用  initEx
    initEx () {
        if(this.nodeTrace && null !=  this.fishTraceType ){
            this.nodeTrace.position = cc.p(-2000, -2000);
        }
        this.runAnimation();
        if (this.fishTraceType != null) {
            this.runMoveAction();

            if (this.delayTime < 0) {
                this.setPastTime(-this.delayTime);
            }
        }
    }
    //创建游动动画
    createAnimation_frame(node: cc.Node, interval: number): SpriteAction {
        return AniManager.instance().buildFishLiveAnimate(node, this.subFishKind, GFishKindAnimationFN_FRAME[this.subFishKind].norFN, interval, 2);
    }
    //创建死亡动画
    createDieAnimation_frame(node: cc.Node): SpriteAction {
        let dieFN = GFishKindAnimationFN_FRAME[this.subFishKind].dieFN;
        let animation: SpriteAction = null;

        if (dieFN) {
            animation = AniManager.instance().buildFishDieAnimate(node, this.subFishKind, dieFN, 1 / 10, 2);
        } else {
            animation = AniManager.instance().buildFishLiveAnimate(node, this.subFishKind, GFishKindAnimationFN_FRAME[this.subFishKind].norFN, 1 / 40, 2);
            animation.setLoopTime(10);
        }

        return animation;
    }

}
