import PoolManager from "../Manager/PoolManager";
import { ttutil } from "../Base/Util";
import { EM_UIType } from "../Data/UIData";
import { EM_PoolType } from "../Data/PoolData";
import { AudioManager } from "../Manager/AudioManager";
import {FishKind, FishTraceType} from "../GameData/SubGameMSG"
import GameEngine from "../Base/GameEngine";
import {UIManager} from "../Manager/UIManager";
import {FishCatmullRomTo, FishMoveTo} from "../GameData/FishAction";
import {NewFishBezierBy} from "../GameData/FishBezierBy";
import BaseAction from "../Base/BaseAction";
import UIPlayerInfo from "./UIPlayerInfo";
import AniManager from "../Manager/AniManager";
import {SpriteAction} from "../Base/SpriteAction";
import {
    AniType, GFishDieAniDT, GFishKindAnimationFN, GFishKindAnimationFN_FRAME, GOpenShadow,
    GSoundMap
} from "../GameData/Config";
import UIBullet from "./UIBullet";
import {EM_SoundType} from "../Data/SoundData";
import ItemFishTrace from "./ItemFishTrace";
import {SkeletonManager} from "../Manager/SkeletonManager";
import {DragonBonesManager} from "../Manager/DragonBonesManager";
import GD = require('../GD');
import {SpriteManager} from "../Manager/SpriteManager";
import {PreLoad_Plist} from "../Data/SpriteData";

export const FishAnimationTag: number = 123;         //游动动画的tag
export const FishMoveTag: number = 124;              //行走动画的tag

const {ccclass, property} = cc._decorator;
@ccclass
export class ItemFish extends cc.Component {
    nodeTrace: cc.Node = null;  //移动映射节点
    shadowSprite = null;             //影子精灵
    fishSprite = null;                //鱼本身的精灵
    dishSprite = null;                  //组合鱼鱼本身显示
    subFishKind = null;                  //组合鱼他的儿子
    fishKind: number = null;
    fishID: number = null;
    fishIndex: number = null;
    specifiedSpeed: number = null;                  //指定的速度， 不按默认的配置来
    routeAction: number = null;                     //路径动作
    fishTraceType: number = null;
    fishPath: cc.Vec2[] = [];
    valid: boolean = true;                          //是否有效
    isRedFish: boolean = false;
    delayTime: number = 0;
    prePos: cc.Vec2 = null;
    cacheRect: any = null;                          //缓存的rect
    lastCallGetRectingPos: cc.Vec2;                 //最后一次调用 getRect时， 鱼的位置


    lastAngle =null;
    angle = 0;
    boundingBox =null;
    _poolType: EM_PoolType = EM_PoolType.ePT_None;

    update(dt: number) {
        let newPos: cc.Vec2 = this.node.getPosition();
        
        if (null == this.prePos) {
            this.prePos = newPos;
        }

        if (newPos.x != this.prePos.x || newPos.y != this.prePos.y) {
            let t =  ttutil.calcRotation(this.prePos, newPos);
            this.node.rotation = t;
            this.angle =t;
            this.prePos = newPos;
        }
    }
    //定义了类型，组合鱼的继承会报错
    reuse(fishKind, fishID, fishIndex, fishTraceType,
          fishPath, delayTime, isRedFish?, specifiedSpeed?)
    {

    }
    onHit() {
        if (this.isRedFish) {
            return;
        }

        let self = this;
        this.node.runAction(
            cc.sequence(
                cc.callFunc(function(){
                    if (self.fishSprite instanceof Array) {

                        for (let i = 0; i < self.fishSprite.length; ++i) {
                            self.fishSprite[i].setColor(cc.color(255, 0, 0));
                            self.dishSprite&&self.dishSprite[i].setColor(cc.color(255, 0, 0));
                        }
                    }
                    else{
                        self.fishSprite.setColor(cc.color(255, 0, 0));
                        self.dishSprite&&self.dishSprite.setColor(cc.color(255, 0, 0));
                    }
                }),
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    if (self.fishSprite instanceof Array) {

                        for (let i = 0; i < self.fishSprite.length; ++i) {
                            self.fishSprite[i].setColor(cc.color(255,255, 255));
                            self.dishSprite&&self.dishSprite[i].setColor(cc.color(255, 255, 255));
                        }
                    }
                    else{
                        self.fishSprite.setColor(cc.color(255, 255, 255));
                        self.dishSprite&&self.dishSprite.setColor(cc.color(255, 255, 255));
                    }
                })
            )
        )
    }
    //创建游动动画
    createAnimation_frame(node: cc.Node, interval?: number): SpriteAction {
        return AniManager.instance().buildFishLiveAnimate(node, this.fishKind, GFishKindAnimationFN_FRAME[this.fishKind].norFN, interval, 2);
    }

    //创建死亡动画
    createDieAnimation_frame(node: cc.Node): SpriteAction {
        let dieFN = GFishKindAnimationFN[this.fishKind].dieFN;
        let animation: SpriteAction = null;

        if (dieFN) {
            animation = AniManager.instance().buildFishDieAnimate(node, this.fishKind, dieFN, 1 / 10, 2);
        } else {
            animation = AniManager.instance().buildFishLiveAnimate(node, this.fishKind, GFishKindAnimationFN_FRAME[this.fishKind].norFN, 1 / 40, 2);
            animation.setLoopTime(10);
        }

        return animation;
    }
    //执行行走动作
    runMoveAction(moveAction?) {
        if (moveAction == null) {
            moveAction = this.createMoveAction();
        }

        moveAction = cc.sequence(cc.place(-2000, -2000), moveAction, cc.callFunc(this.onMoveFinish.bind(this)));
        moveAction.setTag(FishMoveTag);
        this.nodeTrace.stopActionByTag(FishMoveTag);
        this.nodeTrace.runAction(moveAction);
    }

    //创建行走动作
    createMoveAction() {
        let fishConfig = GD.fishConfig;
        if(!fishConfig) {
            console.error("游戏配置还未下来？？？？");
            return;
        }
        let action = null;
        let self = this;
        let speed = this.specifiedSpeed || fishConfig.fishKindConfigArray[this.fishKind].speed;

        switch (this.fishTraceType) {
            case FishTraceType.Linear:
            {
                let dis = FishMoveTo.calcLength(this.fishPath[0], this.fishPath[1]);
                let dt = dis / speed;
                let fishAction = cc.moveTo(dt, this.fishPath[1]);
                action = cc.sequence(cc.place(this.fishPath[0]), fishAction);
            }
            break;

            case FishTraceType.Bezier:
            {
                let fishBezierBy = NewFishBezierBy(speed, this.fishPath[0], this.fishPath[3], this.fishPath[1], this.fishPath[2]);
                action = cc.sequence(cc.place(this.fishPath[0]), fishBezierBy);
            }
            break;

            case FishTraceType.CatmullRom:
            {
                let dis = FishCatmullRomTo.calcLength(this.fishPath[0], this.fishPath);
                let dt = dis / speed;
                let action1 = cc.place(this.fishPath[0]);
                let action2 = cc.catmullRomTo(dt, this.fishPath);
                action = cc.sequence(action1, action2);
            }
            break;

            case FishTraceType.MultiLine:
            {
                action = cc.place(this.fishPath[0]);
                let preRotate = 0;
                for (let i = 1; i < this.fishPath.length; ++i) {
                    let rotate = ttutil.calcRotation(this.fishPath[i - 1], this.fishPath[i]);

                    let dt = cc.pDistance(this.fishPath[i - 1], this.fishPath[i]) / speed;

                    let rotateDt = Math.abs((rotate - preRotate) / 360);
                    action = cc.sequence(action, cc.spawn(cc.delayTime(rotateDt), cc.callFunc(function () {

                        self.node.runAction( cc.rotateTo(rotateDt, rotate) );

                    })), cc.moveTo(dt, this.fishPath[i]).easing(cc.easeSineOut()));
                    preRotate = rotate;
                }
            }
            break;

            default :
                console.log("default fish ..未标明鱼路径鱼");
                action = cc.delayTime(0);
                break;
        }

        if (this.delayTime > 0) {
            action = cc.sequence(cc.delayTime(this.delayTime), action);
        }

        return action;
    }

    /**
     * 得到的是真实的世界坐标
     * @returns {{lt, rt, lb, rb}|{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
     */
    getFishRect() {
        if(GFishKindAnimationFN[this.fishKind].aniType === AniType.FAT_FRAME){
            //把rect缓存起来， 因为每帧中， 每个子弹都会调用每条鱼的getFishRect进行碰撞检测一次
            let nowPos = this.node.getPosition();
            if (this.cacheRect == null || this.lastCallGetRectingPos == null || this.lastCallGetRectingPos.x != nowPos.x || this.lastCallGetRectingPos.y != nowPos.y) {
                this.lastCallGetRectingPos = nowPos;
                return this.cacheRect = ttutil.getRect(this.node, 1);
            }

            return this.cacheRect;
        }

        //把rect缓存起来， 因为每帧中， 每个子弹都会调用每条鱼的getFishRect进行碰撞检测一次
        let nowPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);

        if (this.lastCallGetRectingPos == null || this.lastCallGetRectingPos.x != nowPos.x || this.lastCallGetRectingPos.y != nowPos.y
            ||this.lastAngle!=this.angle||this.boundingBox==null) {
            this.lastCallGetRectingPos = nowPos;
            this.lastAngle=this.angle;


            let angle=this.angle*Math.PI/180.0;
            if(this.boundingBox==null){
                this.boundingBox=[];
                for(let i=0,len=GFishKindAnimationFN[this.fishKind].boundingBox.length;i<len;i++){
                    let boundingBox={};
                    boundingBox.r=GFishKindAnimationFN[this.fishKind].boundingBox[i].r;
                    boundingBox.d=GFishKindAnimationFN[this.fishKind].boundingBox[i].d;
                    boundingBox.a=GFishKindAnimationFN[this.fishKind].boundingBox[i].a;
                    boundingBox.p=cc.p(0,0);
                    this.boundingBox.push(boundingBox);
                }
            }

            for(let i=0,len=this.boundingBox.length;i<len;i++){

                let angleTemp=this.boundingBox[i].a-angle;

                this.boundingBox[i].p.x=nowPos.x+this.boundingBox[i].d*Math.cos(angleTemp);
                this.boundingBox[i].p.y=nowPos.y+this.boundingBox[i].d*Math.sin(angleTemp);

            }


        }

        return this.boundingBox;
    }

    //当鱼要删除自身调用此函数
    removeSelf() {

        this.valid = false;
        //通知cannonLyaer, 我死了有锁定我的， 要释放
        let uiPlayerInfo = UIManager.instance().getWindowScript<UIPlayerInfo>(EM_UIType.eUT_PlayerInfo,UIPlayerInfo );
         uiPlayerInfo.unlockFishWithFish(this);

        // 通知buletLayer, 我死了， 有锁定我的， 要释放
        let uiBullet = UIManager.instance().getWindow(EM_UIType.eUT_Bullet).getComponent(UIBullet);
        uiBullet.unlockFish(this);

        if (null == this.nodeTrace) {
            console.error('Error: fish removeSelf with no trace node');
        }
        else {
            PoolManager.instance().destroyNode(EM_PoolType.ePT_ItemFishTrace, this.nodeTrace);
            this.nodeTrace.stopAllActions();
            this.nodeTrace = null;
        }
        this.node.stopAllActions();
        this.node.children.forEach(element => {
            element.stopAllActions();
            switch (GFishKindAnimationFN[this.fishKind].aniType) {
                case  AniType.FAT_ARMATURE:
                    let draBonAction = element.getComponent(dragonBones.ArmatureDisplay);
                    if (draBonAction) {
                        draBonAction.enabled =false;
                       // element.removeComponent(draBonAction);
                    }
                    break;
                case  AniType.FAT_SKELETON:
                    let skenAction = element.getComponent(sp.Skeleton);
                    if (skenAction) {
                        skenAction.clearTracks();
                        skenAction.enabled =false;
                        // element.removeComponent(skenAction);
                    }
                    break;
                case AniType.FAT_FRAME:
                    let baseAction = element.getComponent(SpriteAction);
                    if (baseAction) {
                        baseAction.enabled =false;
                       // element.removeComponent(baseAction);
                    }
                    // let sprite = element.getComponent(cc.Sprite);
                    // if (sprite) {
                    //     sprite.enabled =false;
                    //     //element.removeComponent(sprite);
                    // }
                    break;
            }
        });


        if (this._poolType == EM_PoolType.ePT_None) {
            console.error('Error: Fish removeSelf');
            PoolManager.instance().destroyNode(EM_PoolType.ePT_SingleFish, this.node);
        } else {
            PoolManager.instance().destroyNode(this._poolType, this.node);
        }        
    }

    onMoveFinish() {
        this.node.runAction(cc.sequence(cc.fadeOut(0.1), cc.callFunc(this.removeSelf.bind(this))));
    }
    /**
     * 设置已经过去的时间
     * @param pastTime
     */
    setPastTime(pastTime: number) {
        let self = this;
        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
            let moveAction = self.node.getComponent(ItemFish).nodeTrace.getActionByTag(FishMoveTag);

            if (moveAction) {
                if (moveAction.setElapsed) {
                    moveAction.setElapsed(moveAction.getElapsed() + pastTime + 0.1);
                } else {
                    moveAction._elapsed += pastTime + 0.1;
                }
            }
        })));
    }

    //创建死亡动画
    createDieAnimation(node: cc.Node): SpriteAction|boolean {
        if(GFishKindAnimationFN[this.fishKind].aniType === AniType.FAT_ARMATURE){
            let tempDisPlay =  node.getComponent(dragonBones.ArmatureDisplay);
            if(tempDisPlay){
                tempDisPlay.playAnimation('end', 0);
            }
            return true;
        }
        if(GFishKindAnimationFN[this.fishKind].aniType === AniType.FAT_SKELETON){
            let tempSkeleton =  node.getComponent(sp.Skeleton);
            if(tempSkeleton){
                tempSkeleton.setAnimation(0,'end', true);
            }
            return true;
        }


        return this.createDieAnimation_frame(node);
    }

    /**
     *
     * @param data
     * @param finishCallback 动画播放完后的回调函数
     */
    death(finishCallback?, isPlaySound?: boolean, fishDieAniDt?: number) {
        isPlaySound = isPlaySound == null ? true : isPlaySound;
        finishCallback = finishCallback || function () {
        };
        ///////////////////////////////////////////////////////////////////////////////
        //做死亡标志， 还有死亡动画
        this.valid = false;
        fishDieAniDt = fishDieAniDt || GFishDieAniDT;

        // this.fishSprite.getComponent(SpriteAction).enabled = false;
        // if (GOpenShadow) {
        //     this.shadowSprite.getComponent(SpriteAction).enabled = false;
        // }

        let delayTime = 0;
        if (this.fishSprite instanceof Array) {
            for (let i = 0; i < this.fishSprite.length; ++i) {
                this.createDieAnimation(this.fishSprite[i]);
                this.createDieAnimation(this.shadowSprite[i]);
            }
        } else {
            this.createDieAnimation(this.fishSprite);
            if (GOpenShadow) {
                this.createDieAnimation(this.shadowSprite);
            }
        }


        delayTime = fishDieAniDt;
        // if (fishDieAni) {
        //     if (GOpenShadow) {
        //         this.createDieAnimation(this.shadowSprite);
        //     }
        //     delayTime = fishDieAniDt;
        // } else {
        //     delayTime = 0;
        // }

        if (this.nodeTrace) {
            this.nodeTrace.getComponent(ItemFishTrace).stopMove();
        }

        this.node.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.callFunc(finishCallback),
            cc.fadeOut(0.1),
            cc.callFunc(this.removeSelf.bind(this))
        ));
        this.node.setScale(1.2);

        ////////////////////////////////////////////////////////////////////////////
        //播放死亡音效
        if (isPlaySound) {
            this.playDieSound();
        }
    }

    playDieSound() {
        if(this.fishKind==FishKind.FixBomb
            ||this.fishKind==FishKind.SmallLocalBomb
            ||this.fishKind==FishKind.LocalBomb
            ||this.fishKind==FishKind.SuperBomb
            ||this.fishKind==FishKind.RedFish
        ){
            AudioManager.instance().playSound(EM_SoundType.EFFECT_PARTICAL_BIG_BOMB);
            // SoundEngine.playEffect(GEffectsSound.EFFECT_PARTICAL_BIG_BOMB);
        }
        else if(this.fishKind==FishKind.LightFish
            ||this.fishKind==FishKind.YiJianShuangDiao
            ||this.fishKind==FishKind.YiShiSanYu
            ||this.fishKind==FishKind.JinYuManTang){
            AudioManager.instance().playSound(EM_SoundType.BOMB_ELECTRIC);
            // SoundEngine.playEffect(GEffectsSound.BOMB_ELECTRIC);
        }
        else{
            let fishSound=GSoundMap[this.fishKind];
            if(!fishSound) fishSound=Math.floor(Math.random()*12);

            AudioManager.instance().playSound(fishSound);
            // SoundEngine.playEffect(fishSound);
        }
    }
    getFish(fishKind, parent, zIndex,name?) {
        let fishSprite = new cc.Node(name);
        parent.addChild(fishSprite, zIndex);

        if(null !== fishKind){
            this.setFishCompent(fishSprite,fishKind);
        }
        return fishSprite;

    }
    setFishCompent(fishSprite,fishKind,cb?){
        if(null == GFishKindAnimationFN[fishKind]){
            console.error(`setFishCompent err ${fishKind}`);
        }
        if (GFishKindAnimationFN[fishKind].aniType == AniType.FAT_FRAME) {
            let sprite: cc.Sprite =fishSprite.getComponent(cc.Sprite)
            if(!sprite){
                sprite= fishSprite.addComponent(cc.Sprite);
            }

            let atlas: cc.SpriteAtlas = SpriteManager.instance().getSpriteAtlasFromCache(PreLoad_Plist.Fish);
            let srpiteFrame = atlas.getSpriteFrame(`jinchanbuyu-res-fish-fish${fishKind + 1}_01`);

            fishSprite.getComponent(cc.Sprite).spriteFrame = srpiteFrame;
            let size =  fishSprite.getContentSize();
            this.node.setContentSize(size);

            sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            let atlas: cc.SpriteAtlas = SpriteManager.instance().getSpriteAtlasFromCache(PreLoad_Plist.Fish);
            sprite.spriteFrame = atlas.getSpriteFrame(`jinchanbuyu-res-fish-fish${this.fishKind + 1}_01`);
            let size = fishSprite.getContentSize();
            this.node.setContentSize(size);
            let spriteAction =fishSprite.getComponent(SpriteAction);
            if(!spriteAction){
                spriteAction= fishSprite.addComponent(SpriteAction);
            }
            spriteAction.enabled = false;
            //设置SpriteFrame ...
        }
        else if (GFishKindAnimationFN[fishKind].aniType == AniType.FAT_ARMATURE) {
            let tempDisPlay =fishSprite.getComponent(dragonBones.ArmatureDisplay);
            if(!tempDisPlay){
                tempDisPlay =  fishSprite.addComponent(dragonBones.ArmatureDisplay);
            }
            tempDisPlay.enabled = false;
            DragonBonesManager.instance().SetDragonBones(tempDisPlay,GFishKindAnimationFN[fishKind].aniName)

        }
        else if (GFishKindAnimationFN[fishKind].aniType == AniType.FAT_SKELETON) {
            let tempDisPlay =  fishSprite.getComponent(sp.Skeleton);
            if(!tempDisPlay){
                tempDisPlay =  fishSprite.addComponent(sp.Skeleton);
            }
            tempDisPlay.enabled = false;
            tempDisPlay.premultipliedAlpha = false;
            SkeletonManager.instance().playAnimation(tempDisPlay,GFishKindAnimationFN[fishKind].aniName);
        }
    }


    //执行游动动画
    runAnimation() {
        if (GFishKindAnimationFN[this.fishKind].aniType == AniType.FAT_ARMATURE) {
            let nodeLen = this.node.childrenCount;
            while(nodeLen--){
                this.node.children[nodeLen].getComponent(dragonBones.ArmatureDisplay).enabled = true;
            }
        }
        else if (GFishKindAnimationFN[this.fishKind].aniType == AniType.FAT_SKELETON) {
            let nodeLen = this.node.childrenCount;
            while(nodeLen--){
                let tempComp = this.node.children[nodeLen].getComponent(sp.Skeleton);
                if(!tempComp){
                    console.error("------------ ",this.node.children[nodeLen])
                }
                this.node.children[nodeLen].getComponent(sp.Skeleton).enabled = true;
            }
        } else {
            let interval = null;
            if(GFishKindAnimationFN_FRAME[this.fishKind]){
                interval = GFishKindAnimationFN_FRAME[this.fishKind].interval;
            }
            if (this.fishSprite instanceof Array) {
                for (let i = 0; i < this.fishSprite.length; ++i) {
                    let action = cc.repeatForever(cc.rotateBy(5, 360));
                    action.setTag(FishAnimationTag);
                    this.dishSprite[i].stopActionByTag(FishAnimationTag);
                    this.dishSprite[i].runAction(action);
                    this.createAnimation_frame(this.fishSprite[i], interval);
                    this.fishSprite[i].getComponent(SpriteAction).enabled = true;
                    if (GOpenShadow) {
                        this.createAnimation_frame(this.shadowSprite[i], interval);
                        this.shadowSprite[i].getComponent(SpriteAction).enabled = true;
                    }
                }
            } else {
                this.createAnimation_frame(this.fishSprite, interval);
                this.fishSprite.getComponent(SpriteAction).enabled = true;
                if (GOpenShadow) {
                   this.createAnimation_frame(this.shadowSprite, interval);
                    this.shadowSprite.getComponent(SpriteAction).enabled = true;
                }
            }

        }
    }
}

