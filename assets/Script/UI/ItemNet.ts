import { AniID } from "../Data/AniData";
import AniManager from "../Manager/AniManager";
import PoolManager from "../Manager/PoolManager";
import { EM_PoolType } from "../Data/PoolData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemNet extends cc.Component
{
    @property(cc.Sprite)
    public m_imgNet: cc.Sprite = null;

    public init(eAni: AniID): void
    {
        let animation = AniManager.instance().buildAnimate(this.m_imgNet.node ,eAni);
        let action: cc.ActionInterval = cc.sequence(
            cc.show(),
            cc.delayTime(animation.getTotleTime()),
            cc.hide(),
            cc.callFunc(this.removeSelf.bind(this))
        );
        this.m_imgNet.node.runAction(action);
    }

    //删除网
    removeSelf() {
        this.node.stopAllActions();
        PoolManager.instance().destroyNode(EM_PoolType.ePT_Net, this.node);
    }
}
