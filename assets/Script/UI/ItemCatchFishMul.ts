
import PoolManager from "../Manager/PoolManager";
import { EM_PoolType } from "../Data/PoolData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemCatchFishMul extends cc.Component {

    @property(cc.Label)
    public label: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {}

    // update (dt) {}

    reuse() {
        this.node.rotation = 0;
        this.node.opacity = 0xff;
    }

    removeSelf() {
        this.node.stopAllActions();
        PoolManager.instance().destroyNode(EM_PoolType.ePT_CatchFishMul, this.node);
    }
}
