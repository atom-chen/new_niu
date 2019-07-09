import PoolManager from "../Manager/PoolManager";
import { UIManager, ZORDER_top } from "../Manager/UIManager";
import { EM_UIType } from "../Data/UIData";
import { EM_PoolType } from "../Data/PoolData";
import { DataManager } from "../Manager/DataManager";
import UIPlayerInfo from "./UIPlayerInfo";
import {CannonKindConfig, SUserFire} from "../GameData/MsgDefine";
import {FireParam} from "./CtrlPlayer";
import ItemBullet from "./ItemBullet";
import {subGameMSG} from "../GameData/SubGameMSG";
import {GFireRotation} from "../GameData/Config";
import {ItemFish} from "./ItemFish";
import UIFish from "./UIFish";
import GameEngine from "../Base/GameEngine";
import UIUserOption from "./UIUserOption";

import GD = require('../GD');;
const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBullet extends cc.Component
{
    private m_bTouchDown: boolean = false;
    private m_nFireCoolEndTime: number = 0; //开火冷却时间


    start()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) {
            this.m_bTouchDown = true;
            this.checkTouch(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event: cc.Event.EventTouch) {
            this.checkTouch(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
           this.m_bTouchDown = false;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.m_bTouchDown = false;
        }, this);

        this.m_nFireCoolEndTime = Date.now();
    }

    update()
    {
        if (!GD.isReady )
        {
            return;
        }

        if (this.m_bTouchDown ||  GD.autoFire)
        {
            this.checkFire();
        }
        else
        {
            if (GD.lockingFish != null)
            {
                this.checkFire();
            }
        }

        if (Date.now() >= this.m_nFireCoolEndTime + 30000)
        {
            let node: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_Hint);
            if (node == null || !node.active)
            {
                UIManager.instance().openWindow(EM_UIType.eUT_Hint, null, ZORDER_top);
            }
        }
    }

    private checkTouch(event: cc.Event.EventTouch): void
    {
        if (GD.choosingLockFish)
        {
            return;
        }
        if (GD.FishLock != null)
        {
            return;
        }

        let v2PosTouch: cc.Vec2 = event.getLocation();
        this.checkRotation(v2PosTouch);
    }

    private checkRotation(v2PosTarget: cc.Vec2): void
    {
        let node: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_PlayerInfo);
        let uiPlayerInfo: UIPlayerInfo = node.getComponent(UIPlayerInfo);

        let v2PosFire: cc.Vec2 = uiPlayerInfo.ctrlUser.m_ndWeapon.convertToWorldSpaceAR(cc.Vec2.ZERO);
        if (v2PosTarget.y <= v2PosFire.y)
        {
            return;
        }

        let radian: number = Math.atan((v2PosTarget.x - v2PosFire.x) / (v2PosTarget.y - v2PosFire.y));
        let angle: number = radian * 180 / Math.PI;
        uiPlayerInfo.ctrlUser.rotateCannon(angle);
    }

    private checkFire(): void
    {
        if (!GD.isAllowFire)
        {
            return;
        }
        
        if (GD.choosingLockFish)
        {
            return;
        }

        if (Date.now() >= this.m_nFireCoolEndTime)
        {
            this.m_nFireCoolEndTime = Date.now() +GD.fishConfig.fireInterval * 1000/GD.isSpeedMode;
            this.fire();
        }
    }

    public createBullet(idChair: number, idBullet: number, nBulletIndex: number, bAndroid: boolean, fireParam: FireParam, lockFish: ItemFish): void
    {
        let ndBullet: cc.Node = PoolManager.instance().createNode(EM_PoolType.ePT_Bullet);
        this.node.addChild(ndBullet);
        ndBullet.position = this.node.convertToNodeSpaceAR(fireParam.v2PosFire);

        let itemBullet: ItemBullet = ndBullet.getComponent(ItemBullet);
        itemBullet.init(idChair, idBullet, nBulletIndex, bAndroid, lockFish, fireParam.angle);
    }

    public destroyBullet(ndBullet: cc.Node): void
    {
        PoolManager.instance().destroyNode(EM_PoolType.ePT_Bullet, ndBullet);
        this.node.removeChild(ndBullet);
    }

    public deleteBullet(idChair: number, idBullet: number): void
    {
        for (let i = 0; i < this.node.childrenCount; ++i)
        {
            let node: cc.Node = this.node.children[i];
            let itemBullet: ItemBullet = node.getComponent(ItemBullet);
            if (itemBullet.chair == idChair && itemBullet.bullet == idBullet)
            {
                this.destroyBullet(node);
                break;
            }
        }
    }

    private fire(): void
    {
        let node: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_Hint);
        if (node != null)
        {
            UIManager.instance().closeWindow(EM_UIType.eUT_Hint);
        }



        //炮口的旋转和表现
        let uiPlayerInfo: UIPlayerInfo = UIManager.instance().getWindowScript<UIPlayerInfo>(EM_UIType.eUT_PlayerInfo, UIPlayerInfo);
        let fireParam: FireParam = uiPlayerInfo.ctrlUser.fire();
        let userItem = GD.clientKernel.myUserItem;
        let cannonConfig: CannonKindConfig =GD.fishConfig.cannonKindConfigArray[userItem.nCannonIndex];
        //钱不够
        if (userItem.getUserScore() < cannonConfig.multiple)
        {
            let str: string = DataManager.instance().str.getString("money_low");
            UIManager.instance().buildToast(str);
            uiPlayerInfo.unlockFish(GD.chairID);
            let uiUserOption: UIUserOption = UIManager.instance().getWindowScript<UIUserOption>(EM_UIType.eUT_UserOption, UIUserOption);
            uiUserOption.cancelAuto();
            return;
        }


        let idBullet: number = GD.bulletID++;
        this.createBullet(GD.chairID, idBullet, -1, false, fireParam, userItem.FishLock);


        let oldRotation = uiPlayerInfo.ctrlUser.m_ndCannon.rotation;
        let angleArray =[];
        let bulletIDArray = [];
        if (GD.isRageMode) {
            GD.bulletID--;
            for (let  i = 0; i < GFireRotation.length; ++i) {
                 angleArray.push(oldRotation + GFireRotation[i]);
                 bulletIDArray.push(GD.bulletID++);
            }
        }
        else {
             angleArray = [oldRotation];
             bulletIDArray = [idBullet];
        }
        // 开火请求
        GameEngine.instance().sendGameData(subGameMSG.SUB_C_USER_FIRE,{
            isRageMode: GD.isRageMode,
            angleArray:angleArray,
            bulletIDArray: bulletIDArray,
            cannonIndex: userItem.nCannonIndex,
            isSuperBullet: userItem.isSuperCannon,
            lockFishID:userItem.FishLock ? userItem.FishLock.fishID : null,
        });
    }

    public allUnlockFish(): void
    {
        this.node.children.forEach(element => {
            let itemBullet = element.getComponent(ItemBullet);
            itemBullet.unlockFish();
        });
    }

    public unlockFish(fish: ItemFish): void
    {
        this.node.children.forEach(element => {
            let itemBullet = element.getComponent(ItemBullet);

            if (itemBullet.getLockFish() == fish) {
                itemBullet.unlockFish();
            }
        });
    }

    /**
     * 激活子弹
     */
    public activeBullet(data: SUserFire, fireParam: FireParam)
    {
        let lockFish = null;
        if (data.lockFishID != null)
        {
            let fishLayer = UIManager.instance().getWindow(EM_UIType.eUT_Fish).getComponent(UIFish);
            lockFish = fishLayer.getFishByFishID(data.lockFishID);
            console.log("lockFish\t" + lockFish);
        }

        for (let i = 0; i < data.bulletIDArray.length; ++i)
        {
            this.createBullet(data.chairID,
                data.bulletIDArray[i],
                data.bulletIndexArray && data.bulletIndexArray[i],
                data.isAndroid,
                fireParam,
                i == 0 ? lockFish : null);
        }
    }

    setBulletIndexfunction(bulletID, bulletIndex, chairID) {
        let bulletArray = this.node.children;
        for (let i = 0; i < bulletArray.length; ++i) {
            let tempComp = bulletArray[i].getComponent(ItemBullet);
            if (tempComp.m_idBullet == bulletID && tempComp.m_idChair == chairID) {
                tempComp.m_nBulletIndex = bulletIndex;
                break;
            }
        }
    }
}
