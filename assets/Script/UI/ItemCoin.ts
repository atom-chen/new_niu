
import PoolManager from "../Manager/PoolManager";
import AniManager from "../Manager/AniManager";
import { AniID } from "../Data/AniData";
import { SpriteAction } from "../Base/SpriteAction";
import { EM_PoolType } from "../Data/PoolData";
import {GCoinConfig} from "../GameData/Config";
import {SpriteManager} from "../Manager/SpriteManager";
import {SkeletonManager} from "../Manager/SkeletonManager";
import {CoinKind} from "../GameData/SubGameMSG";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemCoin extends cc.Component {

    coinKind: number = null;
    targetPos: cc.Vec2 = null;
    callback: any = null;
    delayTime: number = null;



    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    // start () {}

    // update (dt) {}

    reuse(coinKind, targetPos, pos, delayTime?, callback?) {
        this.coinKind = coinKind;
        this.targetPos = targetPos;
        this.callback = callback;
        this.delayTime = delayTime || 0;
        this.runAnimation();
        this.node.position = pos;
        this.fly();
    }

    fly() {
        let dis = cc.pDistance(this.node.position, this.targetPos);
        let dt = dis / GCoinConfig.flySpeed;
        this.node.setScale(0);

        let action = cc.sequence(
            cc.hide(),
            cc.delayTime(this.delayTime),
            cc.show(),
            cc.scaleTo(0.1, 1),
            cc.delayTime(GCoinConfig.delayTime),
            cc.spawn(cc.moveTo(dt, this.targetPos),cc.scaleTo(dt,0.6)),
            cc.callFunc(this.onFinish.bind(this))
        );

        this.node.runAction(action);
    }

    /**
     * 运行动画
     */
    runAnimation() {
        // //序列帧动画
        // if (1 == this.coinKind) {
        //     AniManager.instance().buildAnimate(this.node, AniID.Coin1);
        // } else if (2 == this.coinKind) {
        //     AniManager.instance().buildAnimate(this.node, AniID.Coin2);
        // } else {
        //     console.error(`Error Coin${this.coinKind} Have no Ani`);
        // }
        //骨骼动画

        if(CoinKind.CoinKind1  == this.coinKind){
            SkeletonManager.instance().playAnimation(this.node,"fish_jinbi_yinse");
        }else if (CoinKind.CoinKind2 == this.coinKind){
            SkeletonManager.instance().playAnimation(this.node,"fish_jinbi_1");
        }else{
            console.error(`Error Coin${this.coinKind} Have no Ani`);
        }
    }

    //当完成时
    onFinish() {
        if (this.callback) {
            this.callback();    
        }
        
        this.removeSelf();
    }

    removeSelf() {
        this.node.stopAllActions();
        // SkeletonManager.instance().clearAnimation(this.node);
        PoolManager.instance().destroyNode(EM_PoolType.ePT_Coin, this.node);
    }
}
