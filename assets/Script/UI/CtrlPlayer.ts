import CtrlPlayerBase from "./CtrlPlayerBase";
import {DataManager} from "../Manager/DataManager";
import {EM_SeatAnchor, SeatInfo} from "../GameData/SeatData";
import {CannonKindConfig} from "../GameData/MsgDefine";
import {DragonBonesManager} from "../Manager/DragonBonesManager";
import {CannonLevel} from "../GameData/CannonData";
import {GFishKindAnimationFN, GLockFishConfig, GRotateRadius, GScaleScreenWidth, V} from "../GameData/Config";
import {SpriteManager} from "../Manager/SpriteManager";
import {EM_SpriteType} from "../Data/SpriteData";
import {FishKind} from "../GameData/SubGameMSG";
import PoolManager from "../Manager/PoolManager";
import {EM_PoolType} from "../Data/PoolData";
import {ItemFish} from "./ItemFish";
import GD = require('../GD');


const {ccclass, property} = cc._decorator;

export class FireParam {
    public v2PosFire: cc.Vec2 = null;
    public angle: number = 0;
}

@ccclass
export default class CtrlPlayer extends cc.Component {
    @property(cc.Prefab)
    public m_pUserInfo: cc.Prefab = null;

    @property(cc.Node)
    public m_ndWeapon: cc.Node = null;

    @property(cc.Node)
    public m_ndCannon: cc.Node = null;

    @property(dragonBones.ArmatureDisplay)
    public m_dbCannon: dragonBones.ArmatureDisplay = null;

    @property(cc.Node)
    public m_ndImgFire: cc.Node = null;

    @property(cc.Node)
    public m_ndImgWait: cc.Node = null;

    @property(cc.Node)
    public m_ndCost: cc.Node = null;


    @property(cc.Node)
    public m_ndImgPlayerBg: cc.Node = null;

    @property(cc.Label)
    public m_txtCost: cc.Label = null;

    @property(cc.Node)
    public m_ndStatus: cc.Node = null;

    //魔能炮状态
    @property(cc.Node)
    public m_SuperCannon: cc.Node = null;
    @property(cc.Label)
    public m_txtCountdown: cc.Label = null;

    //锁鱼状态
    @property(cc.Node)
    public m_lockFishBG: cc.Node = null;
    // @property(cc.Sprite)
    // public m_imgFish: cc.Sprite = null;

    @property(cc.Node)
    public m_ndBubble: cc.Node = null;

    private m_ctrlPlayerBase: CtrlPlayerBase = null;

    public get ctrlBase(): CtrlPlayerBase {
        return this.m_ctrlPlayerBase;
    }

    private m_v2PosCannonOrigin: cc.Vec2 = null;
    private m_nEndTime: number = 0;

    private lockFishBGPos: cc.Vec2 = null;
    private lockFishSpriteRotaion: number = 0;

    //魔能炮
    isSuperCannon;              //是否魔能炮


    update(dt)
    {
        if (this.m_txtCountdown.node.active)
        {
            let nNow: number = Date.now();
            let nCountdown = Math.max(0, Math.ceil((this.m_nEndTime - nNow) / 1000));
            this.m_txtCountdown.string = nCountdown.toString();
        }

        if (this.m_lockFishBG.active || this.m_SuperCannon.active)
        {
            this.lockFishSpriteRotaion += GRotateRadius * dt;
            if (this.lockFishSpriteRotaion > Math.PI * 2)
            {
                this.lockFishSpriteRotaion -= Math.PI * 2;
            }

            this.m_ndStatus.position = cc.p(GRotateRadius * Math.cos(this.lockFishSpriteRotaion) + this.lockFishBGPos.x,
                GRotateRadius * Math.sin(this.lockFishSpriteRotaion) + this.lockFishBGPos.y);
        }
    }


    public init(nSeatIndex: number): void {
        CtrlPlayer.setSeatPosition(this.node, nSeatIndex);
        if (nSeatIndex > 1) {
            this.m_ndWeapon.rotation = 180;
        }

        let ndBase: cc.Node = cc.instantiate(this.m_pUserInfo);
        this.node.addChild(ndBase);
        this.m_ctrlPlayerBase = ndBase.getComponent(CtrlPlayerBase);

        let seatInfo: SeatInfo = DataManager.instance().seat.getSeatInfo(nSeatIndex);
        this.m_ndWeapon.position = seatInfo.v2Weapon;
        this.m_ndImgWait.position = seatInfo.v2Wait;
        this.m_ndCost.position = seatInfo.v2Cost;
        this.m_ndStatus.position = seatInfo.v2Status;
        this.m_SuperCannon.position = seatInfo.v2SuperCannon;

        this.lockFishBGPos = this.m_ndStatus.getPosition();
        this.m_SuperCannon.active = false;
        this.m_lockFishBG.active = false;
        this.setWaiting(true);
    }

    public setWaiting(bWaiting: boolean): void {
        this.m_ctrlPlayerBase.node.active = !bWaiting;
        this.m_ndCannon.active = !bWaiting;
        this.m_ndCost.active = !bWaiting;
        this.m_ndImgWait.active = bWaiting;
        this.m_ndBubble.active = !bWaiting;
        this.m_ndStatus.active = !bWaiting;
        this.m_SuperCannon.active = false;
        this.m_lockFishBG.active = false;
    }

    public static setSeatPosition(node: cc.Node, nSeatIndex: number) {
        let seatInfo: SeatInfo = DataManager.instance().seat.getSeatInfo(nSeatIndex);
        let widget: cc.Widget = node.addComponent(cc.Widget);

        switch (seatInfo.eAnchor) {
            case EM_SeatAnchor.eSA_None: {
                node.setPosition(seatInfo.v2Seat);
            }
                break;
            case EM_SeatAnchor.eSA_LeftTop: {
                node.x = (seatInfo.v2Seat.x + seatInfo.v2Weapon.x) * GScaleScreenWidth - seatInfo.v2Weapon.x;
                widget.isAlignTop = true;
                widget.isAbsoluteTop = true;
                widget.top = seatInfo.v2Seat.y;
            }
                break;
            case EM_SeatAnchor.eSA_RightTop: {
                node.x = (seatInfo.v2Seat.x + seatInfo.v2Weapon.x) * GScaleScreenWidth - seatInfo.v2Weapon.x;
                widget.isAlignTop = true;
                widget.isAbsoluteTop = true;
                widget.top = seatInfo.v2Seat.y;
            }
                break;
            case EM_SeatAnchor.eSA_LeftBottom: {
                node.x = (seatInfo.v2Seat.x + seatInfo.v2Weapon.x) * GScaleScreenWidth - seatInfo.v2Weapon.x;
                widget.isAlignBottom = true;
                widget.isAbsoluteBottom = true;
                widget.bottom = seatInfo.v2Seat.y;
            }
                break;
            case EM_SeatAnchor.eSA_RightBottom: {
                node.x = (seatInfo.v2Seat.x + seatInfo.v2Weapon.x) * GScaleScreenWidth - seatInfo.v2Weapon.x;
                widget.isAlignBottom = true;
                widget.isAbsoluteBottom = true;
                widget.bottom = seatInfo.v2Seat.y;
            }
                break;
            default:
                break;
        }
    }

    initInfo(userItem) {
        this.m_ctrlPlayerBase.initInfo(userItem);
        this.m_v2PosCannonOrigin = this.m_ndCannon.position;
        this.m_ndImgPlayerBg.active = true;
        this.setWaiting(false);
    }

    public setDefault(): void {
        let fishConfig = GD.fishConfig;
        if (!fishConfig) return;
        let nCannonIndex: number = fishConfig.defCannonIndex;
        let cannonConfig: CannonKindConfig = fishConfig.cannonKindConfigArray[nCannonIndex];
        this.m_txtCost.string = cannonConfig.multiple.toString();
        this.switchCannon(cannonConfig.size, false);
    }

    public setCannonIndex(nIndex: number, bSuperBullet: boolean): void {
        let cannonConfig: CannonKindConfig = GD.fishConfig.cannonKindConfigArray[nIndex];
        this.m_txtCost.string = cannonConfig.multiple.toString();

        this.switchCannon(cannonConfig.size, bSuperBullet);
    }

    public unlockFish(): void {
        this.m_lockFishBG.active = false;
        this.m_ndBubble.active = false;
    }

    public lockFish(fish: ItemFish): void {
        this.m_lockFishBG.active = true;
        this.initLockFishBG(fish);

        this.m_ndBubble.active = true;
    }

    private switchCannon(idCannon: number, bSuperBullet: boolean) {
        let nLevel: number = bSuperBullet ? 1 : 0;
        this.isSuperCannon = bSuperBullet;
        let cannonLevel: CannonLevel = DataManager.instance().cannon.getCannonLevel(idCannon, nLevel);
        DragonBonesManager.instance().SetDragonBones(this.m_dbCannon, cannonLevel.idDragonBones);
    }

    public rotateCannon(angle: number): void {
        this.m_ndCannon.rotation = angle;
    }

    public fire(): FireParam {
        let angle = this.m_ndCannon.rotation;
        this.m_dbCannon.playAnimation("Animation2", 1);
        let fireParam: FireParam = new FireParam();
        fireParam.v2PosFire = this.m_ndImgFire.convertToWorldSpaceAR(cc.Vec2.ZERO);
        fireParam.angle = angle + this.m_ndWeapon.rotation;
        return fireParam;
    }

    public startSuperCannon(nCannonIndex: number): void {
        this.m_SuperCannon.active = true;
        // this.leftTimeValue = GD.fishConfig.elaspedBulletIon - 3;
        this.m_nEndTime = Date.now() + GD.fishConfig.elaspedBulletIon * 1000;

        let cannonConfig: CannonKindConfig = GD.fishConfig.cannonKindConfigArray[nCannonIndex];
        this.switchCannon(cannonConfig.size, true);
    }
    public endSuperCannon(nCannonIndex: number): void
    {
        this.m_SuperCannon.active = false;

        let cannonConfig: CannonKindConfig = GD.fishConfig.cannonKindConfigArray[nCannonIndex];
        this.switchCannon(cannonConfig.size, false);
    }
    private initLockFishBG(fish: ItemFish): void {
        let len =this.m_lockFishBG.childrenCount;
        while(len--){
            //底下挂了个图没考虑清除
            let fishComp = this.m_lockFishBG.children[len].getComponent(ItemFish);
            if(fishComp){
                fishComp.removeSelf();
            }
        }
        let fishTemp ;
        //记得释放
        switch (fish.fishKind) {
            //自增长的鱼（李逵）
            case FishKind.AutoIncrement:
                fishTemp = PoolManager.instance().createNode(EM_PoolType.ePT_AutoIncrementFish);
                this.m_lockFishBG.addChild(fishTemp);
                fishTemp.getComponent(ItemFish).reuse(fish.fishKind, null, null, null, null ,null,null,null);
                break;
            case FishKind.DaSanYuan:
                fishTemp = PoolManager.instance().createNode(EM_PoolType.ePT_DaSanYuanFish);
                this.m_lockFishBG.addChild(fishTemp);
                fishTemp.getComponent(ItemFish).reuse(fish.fishKind,  fish.subFishKind, null, null, null ,null,null,null);
                break;
            case FishKind.DaSiXi:
                fishTemp = PoolManager.instance().createNode(EM_PoolType.ePT_DaSiXiFish);
                this.m_lockFishBG.addChild(fishTemp);
                fishTemp.getComponent(ItemFish).reuse(fish.fishKind,  fish.subFishKind, null, null, null ,null,null,null);
                break;
            case FishKind.SuperBomb:
                fishTemp = PoolManager.instance().createNode(EM_PoolType.ePT_SuperBombFish);
                this.m_lockFishBG.addChild(fishTemp);
                fishTemp.getComponent(ItemFish).reuse(fish.fishKind,  fish.subFishKind, null, null, null ,null,null,null);
                break;
            //鱼王
            case FishKind.FishKing:
                fishTemp = PoolManager.instance().createNode(EM_PoolType.ePT_FishKingFish);
                this.m_lockFishBG.addChild(fishTemp);
                fishTemp.getComponent(ItemFish).reuse(fish.fishKind,  fish.subFishKind, null, null, null ,null,null,null);
                break;
            default :
                fishTemp = PoolManager.instance().createNode(EM_PoolType.ePT_SingleFish);
                this.m_lockFishBG.addChild(fishTemp);
                fishTemp.getComponent(ItemFish).reuse(fish.fishKind, null, null, null, null ,null,null,null);
                break;
        }
        fishTemp.setScale(GFishKindAnimationFN[fish.fishKind].lockScale);
        fishTemp.setPosition(cc.Vec2.ZERO);
    }

    public checkLockFish(nSeat: number, fish: ItemFish): boolean {
        let v2PosFish = fish.node.convertToWorldSpaceAR(cc.Vec2.ZERO);

        //在屏幕外
        if (v2PosFish.x > V.right || v2PosFish.x < V.left || v2PosFish.y > V.h || v2PosFish.y < 0) {
            return false;
        }

        //角度非法
        let v2PosFire: cc.Vec2 = this.m_ndImgFire.convertToWorldSpaceAR(cc.Vec2.ZERO);
        if (nSeat > 1) {
            if (v2PosFish.y > v2PosFire.y) {
                return false;
            }
        }
        else {
            if (v2PosFish.y < v2PosFire.y) {
                return false;
            }
        }

        let radian: number = Math.atan((v2PosFish.x - v2PosFire.x) / (v2PosFish.y - v2PosFire.y));
        let angle: number = radian * 180 / Math.PI;
        this.rotateCannon(angle);
        return true;
    }
    public updateBubble(idChair: number, fish: ItemFish): void
    {
        if (null == fish)
        {
            this.unlockFish();
            return;
        }

        let v2PosFish: cc.Vec2 = fish.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let v2PosFire: cc.Vec2 = this.m_ndImgFire.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let fDistance: number = cc.pDistance(v2PosFish, v2PosFire);
        let nBubbleCount: number = Math.floor(fDistance / GLockFishConfig.bubbleInterval - 1);

        while (nBubbleCount > this.m_ndBubble.childrenCount)
        {
            let node: cc.Node = new cc.Node;
            let image: cc.Sprite = node.addComponent(cc.Sprite);
            SpriteManager.instance().setImageSprite(image, EM_SpriteType.lock_line);
            this.m_ndBubble.addChild(node);
        }

        let v2Sub: cc.Vec2 = cc.pSub(v2PosFish, v2PosFire);
        for (let i = 0; i < this.m_ndBubble.childrenCount; ++i)
        {
            if (i < nBubbleCount)
            {
                let ratio: number = (i + 1) / (nBubbleCount + 1);
                let v2PosWorld: cc.Vec2 = cc.p(v2PosFire.x + v2Sub.x * ratio, v2PosFire.y + v2Sub.y * ratio);
                let v2PosNode: cc.Vec2 = this.m_ndBubble.convertToNodeSpaceAR(v2PosWorld);

                this.m_ndBubble.children[i].position = v2PosNode;
                this.m_ndBubble.children[i].active = true;
            }
            else
            {
                this.m_ndBubble.children[i].active = false;
            }
        }
    }
}
