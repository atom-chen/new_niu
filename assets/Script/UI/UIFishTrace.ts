import { EM_PoolType } from "../Data/PoolData";
import PoolManager from "../Manager/PoolManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIFishTrace extends cc.Component {

    @property(cc.Node)
    public fishContainer: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    addFishTrace(): cc.Node {
        let nodeFishTrace = PoolManager.instance().createNode(EM_PoolType.ePT_ItemFishTrace);
        this.fishContainer.addChild(nodeFishTrace);
        return nodeFishTrace;
    }
}
