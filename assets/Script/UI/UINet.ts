import PoolManager from "../Manager/PoolManager";
import ItemNet from "./ItemNet";
import { AniID } from "../Data/AniData";
import { EM_PoolType } from "../Data/PoolData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UINet extends cc.Component
{
    public createNet(eAni: AniID, v2Pos: cc.Vec2): void
    {
        let ndNet: cc.Node = PoolManager.instance().createNode(EM_PoolType.ePT_Net);
        this.node.addChild(ndNet);
        ndNet.position = v2Pos;

        let itemNet: ItemNet = ndNet.getComponent(ItemNet);
        itemNet.init(eAni);
    }
}
