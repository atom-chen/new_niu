import PoolManager from "../Manager/PoolManager";
import { EM_PoolType } from "../Data/PoolData";
import ItemCatchFishMul from "./ItemCatchFishMul";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UICatchFishMul extends cc.Component {

    @property(cc.Node)
    public catchFishMulContainer: cc.Node = null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {}
    
    // update (dt) {}

    /**
     * 激活分数
     */
    activeCatchFishMul(multiple, pos) {

        pos.y += 30;
        let catchFishMul = PoolManager.instance().createNode(EM_PoolType.ePT_CatchFishMul);
        this.catchFishMulContainer.addChild(catchFishMul);
        catchFishMul.position = pos;
        catchFishMul.getComponent(ItemCatchFishMul).reuse();
        catchFishMul.setScale(1.5 + Math.min(0.5, multiple / 10));
        catchFishMul.getComponent(cc.Label).string = `/${multiple}`;

        let rotation = 0;
        let moveByY = 50;
        //TODO:看下是否需要旋转
        // if (GD.isRotation) {
        //     rotation = 180;
        //     moveByY = -50;
        // }
        catchFishMul.rotation = rotation;
        catchFishMul.opacity = 0;

        let itemCatchFishMul = catchFishMul.getComponent(ItemCatchFishMul);
        let action = cc.sequence(
            cc.fadeIn(0.1),
            cc.moveBy(0.2, 0, moveByY).easing(cc.easeSineOut()),
            //cc.delayTime(0.5),
            cc.spawn(
                cc.reverseTime(cc.moveBy(0.3, 0, moveByY)),
                cc.sequence(cc.delayTime(1), cc.fadeOut(1))
            ),

            cc.callFunc(itemCatchFishMul.removeSelf.bind(itemCatchFishMul))
        );

        catchFishMul.runAction(action);
    }
}

