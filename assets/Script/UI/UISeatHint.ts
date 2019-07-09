import { EM_UIType } from "../Data/UIData";
import {UIManager} from "../Manager/UIManager";
import {GScaleScreenWidth} from "../GameData/Config";
import GD = require('../GD');
const {ccclass, property} = cc._decorator;

@ccclass
export default class UISeatHint extends cc.Component
{
    @property(cc.Node)
    public m_ndImgHint: cc.Node = null;
    @property(cc.Node)
    public m_ndAperture: cc.Node = null;

    public showHint(): void
    {
        this.m_ndImgHint.active = true;
        let userItem = GD.clientKernel.getMeUserItem();
        if (userItem.nSeat == 0)
        {
            this.m_ndImgHint.position = cc.p(260 * GScaleScreenWidth, -260);
        }
        else
        {
            this.m_ndImgHint.position = cc.p(-260 * GScaleScreenWidth, -260);
        }
        this.HereAnimal();
    }

    public onBtnMask(): void
    {
        this.m_ndAperture.stopAllActions();
        UIManager.instance().closeWindow(EM_UIType.eUT_SeatHint);
    }

    public HereAnimal()
    {
        this.m_ndAperture.runAction(cc.repeatForever(cc.rotateBy(3, 360)));
    }
}
