import { UIManager } from "../Manager/UIManager";
import { EM_UIType } from "../Data/UIData";
import CtrlPlayer, {FireParam} from "./CtrlPlayer";
import {GPlayerNum} from "../GameData/Config";
import {SUserFire} from "../GameData/MsgDefine";
import UIFish from "./UIFish";
import {ItemFish} from "./ItemFish";
import UIBullet from "./UIBullet";
import UIUserOption from "./UIUserOption";
const {ccclass, property} = cc._decorator;
import GD = require('../GD');;
export type CTRL_PLAYER_MAP = {[nSeat: number]: CtrlPlayer};

@ccclass
export default class UIPlayerInfo extends cc.Component
{
    @property(cc.Prefab)
    public m_pbCtrlPlayer: cc.Prefab = null;

    @property(cc.Node)
    public m_ndPlayer: cc.Node = null;

    @property(cc.Prefab)
    public m_pbCannonButton: cc.Prefab = null;

    private m_mapCtrlPlayer: CTRL_PLAYER_MAP = {};

    private m_ctrlUser: CtrlPlayer = null;   //自己的座位
    public get ctrlUser(): CtrlPlayer { return this.m_ctrlUser; }

    onLoad()
    {
        for (let i = 0; i < GPlayerNum; ++i)
        {
            let newNode: cc.Node = cc.instantiate(this.m_pbCtrlPlayer);
            this.m_ndPlayer.addChild(newNode);

            let ctrlPlayer: CtrlPlayer = newNode.getComponent(CtrlPlayer);
            ctrlPlayer.init(i);
            this.m_mapCtrlPlayer[i] = ctrlPlayer;
        }
    }
    update()
    {
        let szUserItem = GD.clientKernel.getUserMgr().tableUserItem;
        for (const key in szUserItem)
        {
            let idChair: number = Number(key);
            let userItem = szUserItem[idChair];
            if (userItem.FishLock == null)
            {
                continue;
            }

            let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];

            //鱼死了
            if (!userItem.FishLock.valid)
            {
                this.randomLockFish(idChair);
            }

            //检测锁鱼合法性
            if (userItem.FishLock && !ctrlPlayer.checkLockFish(userItem.nSeat, userItem.FishLock))
            {
                this.randomLockFish(idChair);
            }

            ctrlPlayer.updateBubble(idChair, userItem.FishLock);
        }
    }
    public addPlayer(userItem): void
    {
        let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];
        ctrlPlayer.initInfo(userItem);
    }

    public setDefault(userItem): void
    {
        //设置所有玩家
        if (!userItem)
        {
            for (const key in this.m_mapCtrlPlayer)
            {
                this.m_mapCtrlPlayer[Number(key)].setDefault();
            }
        }
        else
        {
            let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];
            ctrlPlayer.setDefault();
        }
    }
    public setUserInfo(): void
    {
        let meUserItem = GD.clientKernel.getMeUserItem();
        this.m_ctrlUser = this.m_mapCtrlPlayer[meUserItem.nSeat];
        // console.error("--------------- ",meUserItem.nSeat);
        let ndCannonButton: cc.Node = cc.instantiate(this.m_pbCannonButton);
        this.m_ctrlUser.m_ndWeapon.addChild(ndCannonButton);
        ndCannonButton.position = cc.p(0, -15);
    }

    public setScore(idChair: number, nScore: number): void
    {
        if(idChair >3) return;
        let userItem  = GD.clientKernel.getTableUserItem(idChair);
        if (userItem != null)
        {
            userItem.score = nScore;
            let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];
            ctrlPlayer.ctrlBase.setScore(nScore);
        }
    }
    public modifyScore(idChair: number, nScore: number): void
    {
        if(idChair >3) return;
        let userItem = GD.clientKernel.getTableUserItem(idChair);
        if (userItem != null)
        {
            userItem.score = Math.max(0, userItem.getUserScore() + nScore);
            let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];
            ctrlPlayer.ctrlBase.setScore(userItem.score);
        }
    }

    public setCannonIndex(idChair: number, nCannonIndex: number): void
    {
        let userItem = GD.clientKernel.getTableUserItem(idChair);
        if (userItem != null)
        {
            let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];
            ctrlPlayer.setCannonIndex(nCannonIndex, userItem.bSuperBullet);
        }
    }
    public rotateCannon(idChair: number, angle: number): void
    {
        let userItem = GD.clientKernel.getTableUserItem(idChair);
        if (userItem != null)
        {
            let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];
            ctrlPlayer.rotateCannon(angle);
        }
    }

    public fire(fireData: SUserFire): FireParam
    {
        let userItem = GD.clientKernel.getTableUserItem(fireData.chairID);
        if (null == userItem)
        {
            console.error(`Error: Not Player with Chair${fireData.chairID}`);
            return null;
        }

        let angle = fireData.angleArray[0];
        let nCannonIndex = fireData.cannonIndex;
        let idChair = userItem.getChairID();

        //炮台比较
        userItem.bSuperBullet = fireData.isSuperBullet;
        if (nCannonIndex != userItem.nCannonIndex)
        {
            userItem.nCannonIndex = nCannonIndex;
            this.setCannonIndex(idChair, nCannonIndex);
        }

        this.rotateCannon(idChair, angle);
        let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];

        //锁鱼比较
        let lockFish = userItem.FishLock;
        if (lockFish == null || lockFish.fishID != fireData.lockFishID)
        {
            if (idChair != GD.chairID)
            {
                if (fireData.lockFishID != null)
                {
                    //-2按原来的方案锁鱼,-1随机锁鱼,0不锁鱼
                    switch (fireData.lockFishID)
                    {
                        case -2:
                        {
                            if (userItem.FishLock)
                            {
                                fireData.lockFishID = userItem.FishLock.fishID;
                            }
                            else
                            {
                                fireData.lockFishID = null;
                            }
                        }
                            break;
                        case -1:
                        {
                            this.unlockFish(idChair);
                            this.randomLockFish(idChair);

                            if (userItem.FishLock)
                            {
                                fireData.lockFishID = userItem.FishLock.fishID;
                            }
                            else
                            {
                                fireData.lockFishID = null;
                                this.unlockFish(idChair);
                            }
                        }
                            break;
                        case 0:
                        {
                            this.unlockFish(idChair);
                            fireData.lockFishID = null;
                        }
                            break;
                        default:
                        {
                            let fishLayer = UIManager.instance().getWindow(EM_UIType.eUT_Fish).getComponent(UIFish);
                            let fish = fishLayer.getFishByFishID(fireData.lockFishID);

                            if (fish)
                            {
                                this.lockFish(idChair, fish);
                            }
                            else
                            {
                                this.unlockFish(idChair);
                            }
                        }
                    }
                }
                else
                {
                    this.unlockFish(idChair);
                }

                //检测锁鱼合法性
                if (userItem.FishLock && !ctrlPlayer.checkLockFish(userItem.nSeat, userItem.FishLock))
                {
                    this.randomLockFish(idChair);
                }
            }
        }

        let fireParam: FireParam = ctrlPlayer.fire();

        let uiBullet = UIManager.instance().getWindow(EM_UIType.eUT_Bullet).getComponent(UIBullet);
        uiBullet.activeBullet(fireData, fireParam);

        return fireParam;
    }
    //todo:随机锁鱼
    public randomLockFish(idChair: number): void
    {
        let userItem = GD.clientKernel.getTableUserItem(idChair);
        if (userItem != null)
        {
            let oldLockFish = userItem.FishLock;
            let fishLayer = UIManager.instance().getWindow(EM_UIType.eUT_Fish).getComponent(UIFish);
            let newLockFish = fishLayer.getRandomLockFish(oldLockFish);

            if (newLockFish)
            {
                this.lockFish(idChair, newLockFish);
            }
            else
            {
                this.unlockFish(idChair);
            }
        }
    }
    public lockFish(idChair: number, fish: ItemFish): void
    {
        let userItem = GD.clientKernel.getTableUserItem(idChair);
        if (userItem != null)
        {
            userItem.FishLock = fish;
            let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];
            ctrlPlayer.lockFish(fish);

            if (idChair == GD.chairID)
            {
                let node: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_UserOption);
                let uiUserOption: UIUserOption = node.getComponent(UIUserOption);
                uiUserOption.showLock(true);
            }
        }
    }
    public unlockFish(idChair: number): void
    {
        let userItem = GD.clientKernel.getTableUserItem(idChair);
        if (userItem != null)
        {
            userItem.FishLock = null;
            let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];
            ctrlPlayer.unlockFish();

            if (idChair == GD.chairID)
            {
                let node: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_UserOption);
                let uiUserOption: UIUserOption = node.getComponent(UIUserOption);
                uiUserOption.showLock(false);
                uiUserOption.unlockFish();
            }
        }
    }
    public allUnlockFish(): void
    {
        let szUserItem = GD.clientKernel.getUserMgr().tableUserItem;

        for (const key in szUserItem) {
            this.unlockFish(szUserItem[key].getChairID());
        }
    }
    public startSuperCannon(idChair: number): void
    {
        let userItem = GD.clientKernel.getTableUserItem(idChair);
        if (userItem != null)
        {
            userItem.bSuperBullet = true;
            let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];
            ctrlPlayer.startSuperCannon(userItem.nCannonIndex);
        }
    }
    public getScoreWorldPos(idChair: number): cc.Vec2
    {
        let userItem = GD.clientKernel.getTableUserItem(idChair);
        if (userItem != null)
        {
            let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];
            return ctrlPlayer.ctrlBase.m_txtScore.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        }
        return cc.Vec2.ZERO;
    }


    public unlockFishWithFish(fish: ItemFish): void
    {
        let szUserItem = GD.clientKernel.getUserMgr().tableUserItem;
        for (const key in szUserItem)
        {
            if (szUserItem[key].FishLock == fish)
            {
                this.unlockFish(szUserItem[key].getChairID());
            }
        }
    }

    public endSuperCannon(idChair: number): void
    {
        let userItem = GD.clientKernel.getTableUserItem(idChair);
        if (userItem != null)
        {
            userItem.bSuperBullet = false;
            let ctrlPlayer: CtrlPlayer = this.m_mapCtrlPlayer[userItem.nSeat];
            ctrlPlayer.endSuperCannon(userItem.nCannonIndex);
        }
    }

}
