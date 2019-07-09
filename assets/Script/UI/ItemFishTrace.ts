import PoolManager from "../Manager/PoolManager";
import { EM_PoolType } from "../Data/PoolData";
import { FishRotationAt } from "../GameData/FishRotationAt";
import { FishBezierBy } from "../GameData/FishBezierBy";
import { FishMoveTag } from "./ItemFish";
import {GScaleScreenWidth} from "../GameData/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemFishTrace extends cc.Component {

    nodeFish: cc.Node = null;  //表现节点

    // LIFE-CYCLE CALLBACKS:

    update (dt) {
        if (null == this.nodeFish) {
            PoolManager.instance().destroyNode(EM_PoolType.ePT_ItemFishTrace, this.node);
            return;
        }
        this.nodeFish.x = this.node.x*GScaleScreenWidth;
        this.nodeFish.y = this.node.y;
    }

    reuse(nodeFish: cc.Node) {
        this.nodeFish = nodeFish;

        if (this.node.getComponent(FishRotationAt)) {
            this.node.getComponent(FishRotationAt).enabled = false;    
        }
        if (this.node.getComponent(FishBezierBy)) {
            this.node.getComponent(FishBezierBy).enabled = false;   
        }
    }

    stopMove() {
        this.node.stopActionByTag(FishMoveTag);

        if (this.node.getComponent(FishRotationAt)) {
            this.node.getComponent(FishRotationAt).enabled = false;    
        }
        if (this.node.getComponent(FishBezierBy)) {
            this.node.getComponent(FishBezierBy).enabled = false;   
        }
    }

    pauseMove() {
        this.node.pauseAllActions();

        if (this.node.getComponent(FishRotationAt)) {
            this.node.getComponent(FishRotationAt).enabled = false;    
        }
        if (this.node.getComponent(FishBezierBy)) {
            this.node.getComponent(FishBezierBy).enabled = false;   
        }
    }

    resumeMove() {
        this.node.resumeAllActions();

        if (this.node.getComponent(FishRotationAt)) {
            this.node.getComponent(FishRotationAt).enabled = true;    
        }
        if (this.node.getComponent(FishBezierBy)) {
            this.node.getComponent(FishBezierBy).enabled = true;   
        }
    }
}
