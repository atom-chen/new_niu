import { EM_UIType } from "../Data/UIData";
import { AudioManager } from "../Manager/AudioManager";
import {UIManager} from "../Manager/UIManager";
import UIPlayerInfo from "./UIPlayerInfo";

import GD = require('../GD');
import {EM_SoundType} from "../Data/SoundData";
const {ccclass, property} = cc._decorator;

@ccclass
export default class UIUserOption extends cc.Component
{
    @property(cc.Node)
    public m_ndImgAutoOn: cc.Node = null;

    @property(cc.Node)
    public m_ndImgAutoOff: cc.Node = null;

    @property(cc.Node)
    public m_ndImgLockOn: cc.Node = null;

    @property(cc.Node)
    public m_ndImgLockOff: cc.Node = null;

    @property(cc.Node)
    public m_ndMask: cc.Node = null;

    @property([cc.Node])
    public m_nZhuanQuan: cc.Node[] = [];

    @property(cc.Node)
    public m_ndImgSpeedOn: cc.Node = null;

    @property(cc.Node)
    public m_ndImgSpeedOff: cc.Node = null;
    onLoad(){
        this.m_nZhuanQuan.forEach((node)=>{
            node.runAction(cc.repeatForever(cc.rotateBy(2, 360)));
        })
    }
    public onBtnAuto(): void
    {
        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);
        UIManager.instance().closeWindow(EM_UIType.eUT_SeatHint);

        let bAutoFire: boolean = GD.autoFire;
        if (bAutoFire)
        {
            GD.autoFire = false;
            this.m_ndImgAutoOn.active = false;
            this.m_ndImgAutoOff.active = true;
        }
        else
        {
            GD.autoFire = true;
            this.m_ndImgAutoOn.active = true;
            this.m_ndImgAutoOff.active = false;
        }
    }

    public onBtnLock(): void
    {
        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);
        UIManager.instance().closeWindow(EM_UIType.eUT_SeatHint);
        
        let idChair: number = GD.chairID;
        let userItem = GD.clientKernel.getTableUserItem(idChair);
        if (userItem.FishLock == null && !this.m_ndMask.active)
        {
            //选择要锁定的鱼
            this.m_ndMask.active = true;
            GD.choosingLockFish = true;
            this.showLock(true);
            this.node.on(cc.Node.EventType.TOUCH_START, this.touchFish, this);
        }
        else
        {
            //取消锁定
            userItem.FishLock = null;
            this.m_ndMask.active = false;
            this.showLock(false);
            this.unlockFish();

            let node: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_PlayerInfo);
            let uiPlayerInfo: UIPlayerInfo = node.getComponent(UIPlayerInfo);
            uiPlayerInfo.ctrlUser.unlockFish();
            GD.choosingLockFish = false;
        }
    }

    private touchFish(event: cc.Event.EventTouch): void
    {
        if (!GD.isReady)
        {
            return;
        }
        UIManager.instance().getWindow(EM_UIType.eUT_Fish).emit('mytouchend', event);       
    }

    public lockFish(): void
    {
        //锁定
        this.m_ndMask.active = false;
        GD.choosingLockFish = false;
        //this.node.off(cc.Node.EventType.TOUCH_START, null);
    }

    public unlockFish(): void
    {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchFish, this);
    }

    public showLock(bOn: boolean): void
    {
        this.m_ndImgLockOn.active = bOn;
        this.m_ndImgLockOff.active = !bOn;
    }

    public cancelAuto(): void
    {
        GD.autoFire = false;
        this.m_ndImgAutoOn.active = false;
        this.m_ndImgAutoOff.active = true;
    }

    public onBtnSpeed(): void
    {
        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);
        UIManager.instance().closeWindow(EM_UIType.eUT_SeatHint);

        if (1 == GD.isSpeedMode)
        {
            GD.isSpeedMode = 2;
            this.m_ndImgSpeedOff.active = false;
            this.m_ndImgSpeedOn.active = true;
        }
        else
        {
            GD.isSpeedMode = 1;
            this.m_ndImgSpeedOff.active = true;
            this.m_ndImgSpeedOn.active = false;
        }
    }
}
