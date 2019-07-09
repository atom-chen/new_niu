import PoolManager from "../Manager/PoolManager";
import { EM_PoolType } from "../Data/PoolData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemScore extends cc.Component {

    @property(cc.Node)
    public nodeGold: cc.Node = null;
    
    @property(cc.Node)
    public nodeSilver: cc.Node = null;

    reuse() {
        this.node.rotation = 0;
        this.node.opacity = 0xff;

        this.nodeGold.active = false;
        this.nodeSilver.active = false;
    }

    removeSelf() {
        this.node.stopAllActions();
        PoolManager.instance().destroyNode(EM_PoolType.ePT_Score, this.node);
    }

    setScore(score: string, isSelf: boolean) {
        if (isSelf) {
            this.nodeGold.active = true;
            this.nodeGold.getChildByName("num").getComponent(cc.Label).string = score;
            this.nodeSilver.active = false;            
        } else {
            this.nodeSilver.active = true;
            this.nodeSilver.getChildByName("num").getComponent(cc.Label).string = score;
            this.nodeGold.active = false; 
        }
    }
}
