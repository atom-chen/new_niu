
import PoolManager from "../Manager/PoolManager";
import { EM_PoolType } from "../Data/PoolData";
import ItemLightning from "./ItemLightning";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UILightning extends cc.Component {

    @property(cc.Node)
    public lightningContainer: cc.Node = null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {}
    
    // update (dt) {}

    activeLightning(config) {
        let lightning = PoolManager.instance().createNode(EM_PoolType.ePT_Lightning);
        this.lightningContainer.addChild(lightning);
        lightning.getComponent(ItemLightning).reuse(config.lightningKind, config.dt, config.st, config.ed);
    }
}
