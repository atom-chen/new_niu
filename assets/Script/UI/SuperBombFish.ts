import { EM_PoolType } from "../Data/PoolData";
import {SingleFish} from "./SingleFish";
import {SpriteAction} from "../Base/SpriteAction";
import {FishKind} from "../GameData/SubGameMSG";

/**
 * 全屏炸弹
 */

const {ccclass, property} = cc._decorator;

@ccclass
export class SuperBombFish extends SingleFish
{
    onLoad() {
        super.onLoad();
        this._poolType = EM_PoolType.ePT_SuperBombFish;
    }
    
    //创建游动动画
    createAnimation(node: cc.Node, interval): SpriteAction {
        // showDebugTip('SuperBombFish createAnimation');
        return super.createAnimation_frame(node, interval,FishKind.SuperBomb)
        // var action = cc.rotateBy(5, 360);
        // action = cc.repeatForever(action);
        // action.setTag(FishAnimationTag);
        // return action;
    }
    
    //创建死亡动画
    createDieAnimation(): SpriteAction {
        // showDebugTip('SuperBombFish createDieAnimation');
        return null;
    }
}
