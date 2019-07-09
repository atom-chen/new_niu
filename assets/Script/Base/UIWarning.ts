import { UIManager } from "../Manager/UIManager";
import { EM_UIType } from "../Data/UIData";
import CtrlWarning from "./CtrlWarning";
import PoolManager from "../Manager/PoolManager";
import {EM_PoolType} from "../Data/PoolData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIWarning extends cc.Component
{

    @property(cc.Node)
    public m_ndWarning: cc.Node = null;

    private m_nCounter: number = 0;
    private m_timeLast: number = 0;
    private m_strLast: string = null;

    public showWarning(strWords: string): void
    {
        let timeCur = Date.now();
        if (this.m_timeLast + 1000 > timeCur && this.m_strLast == strWords)
        {
            return;
        }

        this.m_timeLast = timeCur;
        this.m_strLast = strWords;
        let newNode: cc.Node = PoolManager.instance().createNode(EM_PoolType.ePT_CtrlWaring);
        newNode.setPosition(cc.Vec2.ZERO);
        this.m_ndWarning.addChild(newNode);

        let ctrlWarning: CtrlWarning = newNode.getComponent(CtrlWarning);
        ctrlWarning.setWords(strWords);

        ++this.m_nCounter;
        newNode.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.moveTo(0.5, 0, 150),
                cc.callFunc( () => {
                    --this.m_nCounter;
                    this.checkCloseWindow();
                    PoolManager.instance().destroyNode(EM_PoolType.ePT_CtrlWaring,newNode);
                } )
            )
        );
    }

    private checkCloseWindow(): void
    {
        if (this.m_nCounter == 0)
        {
            UIManager.instance().closeWindow(EM_UIType.eUT_Warning);
        }
    }
}
