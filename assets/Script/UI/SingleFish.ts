import { EM_PoolType } from "../Data/PoolData";
import { UIManager } from "../Manager/UIManager";
import { EM_UIType } from "../Data/UIData";
import {FishMoveTag, ItemFish} from "./ItemFish";
import {
    AniType, GFishDieAniDT, GFishDieSound, GFishKindAnimationFN, GOpenShadow, GShadowFac,
    GSoundMap
} from "../GameData/Config";
import {SpriteAction} from "../Base/SpriteAction";
import {DragonBonesManager} from "../Manager/DragonBonesManager";
import {EM_DragonType} from "../Data/DragonBonesData"
import {SkeletonManager} from "../Manager/SkeletonManager";
import {EM_SkeleType} from "../Data/SkeletonData"
import UIFishTrace from "./UIFishTrace";
import ItemFishTrace from "./ItemFishTrace";
import {FishKind} from "../GameData/SubGameMSG";
import {AniID, AniInfo} from "../Data/AniData";
import {AudioManager} from "../Manager/AudioManager";
import {EM_SoundType} from "../Data/SoundData";
const {ccclass, property} = cc._decorator;

@ccclass
export class SingleFish extends ItemFish
{

    onLoad() {

        this._poolType = EM_PoolType.ePT_SingleFish;
    }

    reuse(fishKind: number, fishID: number, fishIndex: number, fishTraceType: number,
        fishPath: cc.Vec2[], delayTime: null, isRedFish?: boolean, specifiedSpeed?: number) {

        this.fishKind = null;
        this.fishID = null;
        this.fishIndex = null;

        this.routeAction = null;                        //  路径动作
        this.fishTraceType = null;
        this.fishPath = null;
        this.valid = true;                              //是否有效
        this.delayTime = 0;
        this.prePos = cc.p();
        this.cacheRect = null;                          //缓存的rect
        this.lastCallGetRectingPos = null;              //最后一次调用 getRect时， 鱼的位置
        this.isRedFish = false;
        this.specifiedSpeed = null;

        this.node.setScale(1);           //会被改变        
        this.node.opacity = 255;
        this.node.setLocalZOrder(0);
        this.node.rotation = 0;

        if (null != this.nodeTrace) {
            console.error('error: fish have node trace already!!');
        }
        else {
            this.nodeTrace = UIManager.instance().getWindowScript(EM_UIType.eUT_FishTrace, UIFishTrace).addFishTrace();
        }
        this.nodeTrace.getComponent(ItemFishTrace).reuse(this.node);

        this.isRedFish = isRedFish;
        this.fishKind = fishKind;
        this.fishID = fishID;
        this.fishIndex = fishIndex;
        this.fishTraceType = fishTraceType;
        this.fishPath = fishPath;
        this.delayTime = delayTime;
        this.specifiedSpeed = specifiedSpeed;
        this.initEx();
        this.prePos = cc.p(0, 0);
    }


    //当心 ， 同一对象会多次调用  initEx
    initEx () {

        if(!this.fishSprite){
            this.fishSprite=this.getFish(this.fishKind,this.node,2,"fish");
        }else {
            this.setFishCompent(this.fishSprite,this.fishKind);
        }
        if(!this.fishSprite) return;
        this.fishSprite.setScale(GFishKindAnimationFN[this.fishKind].liveScale);

        this.fishSprite.color =this.isRedFish?cc.color(255, 0, 0):cc.color(255, 255, 255);
        this.fishSprite.opacity = 255;

        if (GOpenShadow) {
            if(!this.shadowSprite){
                this.shadowSprite=this.getFish(this.fishKind,this.node,1,"shadow");
            }
            else {
                this.setFishCompent(this.shadowSprite,this.fishKind);
            }
            if(!this.shadowSprite) return;
            this.shadowSprite.setScale(GFishKindAnimationFN[this.fishKind].liveScale);

            //設置起始位置
            this.shadowSprite.setPosition(/*GFishKindAnimationFN[this.fishKind].x*/-20,/*GFishKindAnimationFN[this.fishKind].y*/+20);
            this.shadowSprite.color = (cc.color(0, 0, 0));
            this.shadowSprite.opacity = (50);
        }
        if(this.nodeTrace && null !==  this.fishTraceType ){
            this.nodeTrace.position = cc.p(-2000, -2000);
        }else{
            this.nodeTrace.position =cc.Vec2.ZERO;//锁鱼的玩意
        }

        this.runAnimation();

        //如果没有指定路径类型， 则不用计算路径了， 外部会调用runMoveAction， 为其指定路径的
        if (this.fishTraceType != null) {
            this.runMoveAction();

            if (this.delayTime < 0) {
                this.setPastTime(-this.delayTime);
            }
        }
    }



    public buildFishLiveAnimate(node: cc.Node, fishKind: number, num: number, interval: number, occupying: number): SpriteAction
    {
        let spriteAction = node.getComponent(SpriteAction);
        if (null == spriteAction) {
            console.error(`buildAnimate node without SpriteAction fishKind(${fishKind})`);
            spriteAction = node.addComponent(SpriteAction);
        }

        interval = interval || 1 / 10;

        let aniInfo: AniInfo = {
            aniID: AniID.FishKind1_live,
            prefix: `jinchanbuyu-res-fish-fish${fishKind+1}_`,
            num: num,
            sample: 1 / interval,
            occupying: occupying,
            start: 1,
            plist: "Texture/oldRes/fish",
            loopTime: -1,
        }

        spriteAction.init(aniInfo);
        return spriteAction;
    }

}
