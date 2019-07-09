import { SpriteManager } from "../Manager/SpriteManager";
import { ItemFish } from "./ItemFish";
import { UIManager } from "../Manager/UIManager";
import { EM_UIType } from "../Data/UIData";
import { ttutil } from "../Base/Util";
import {BulletKindConfig, CannonKindConfig} from "../GameData/MsgDefine";
import {CannonLevel} from "../GameData/CannonData";
import {DataManager} from "../Manager/DataManager";
import {GCDFrameInterval, GScaleScreenWidth} from "../GameData/Config";
import {V} from "../GameData/Config";
import UIFish from "./UIFish";
import {BulletKind, FishKind, subGameMSG} from "../GameData/SubGameMSG";
import UIBullet from "./UIBullet";
import UINet from "./UINet";
import define = require('../define');
const {ccclass, property} = cc._decorator;
import GD = require('../GD');;
@ccclass
export default class ItemBullet extends cc.Component
{
    @property(cc.Sprite)
    public m_imgBullet: cc.Sprite = null;

    private m_nSpeed: number = 0;
    private m_v2Speed: cc.Vec2 = cc.Vec2.ZERO;  //速度分量

    public m_idChair: number = 0;
    public get chair(): number { return this.m_idChair; }

    public m_idBullet: number = 0;
    public get bullet(): number { return this.m_idBullet; }

    public m_nBulletIndex: number = -1;

    private m_bAndroid: boolean = false;    //是否是机器人的子弹
    private m_nCannonIndex: number = 0;     //什么炮打出的子弹
    private m_lockFish: ItemFish = null;    //锁定的鱼
    private m_bHit: boolean = false;        //是否打中过鱼，防止一颗子弹碰撞多只鱼
    
    private cacheRect: any = null;             //缓存的rect
    private lastCallGetRectingPos: cc.Vec2;    //最后一次调用 getRect时， 鱼的位置
    private gcdGroupID: number = 0;            //碰撞检测组别， 每帧检测碰撞的组别不一样

    private isSuperBullet = false;// 魔能子弹

    onLoad(){
        V.left = 0;
        V.right = cc.director.getWinSize().width;
    }
    public init(idChair: number, idBullet: number, nBulletIndex: number, bAndroid: boolean, lockFish: ItemFish, angle: number): void
    {
        this.m_idChair = idChair;
        this.m_idBullet = idBullet;
        this.m_nBulletIndex = nBulletIndex;
        this.m_bAndroid = bAndroid;

        let userItem = GD.clientKernel.getTableUserItem(idChair);
        this.m_nCannonIndex =  userItem.nCannonIndex;
        this.isSuperBullet = userItem.bSuperBullet;
        this.m_lockFish = lockFish;
        this.m_bHit = false;

        let gameConfig = GD.fishConfig;
        let cannonConfig: CannonKindConfig = gameConfig.cannonKindConfigArray[userItem.nCannonIndex];
        let cannonLevel: CannonLevel = DataManager.instance().cannon.getCannonLevel(cannonConfig.size,userItem.bSuperBullet?1:0);

        let idSpriteBullet: number = 0;

        let speed = 0;
        if (!userItem.bSuperBullet) {
            speed = GD.fishConfig.bulletKindConfigArray[cannonConfig.size].speed;
            idSpriteBullet = Number(cannonLevel.idSpriteBulletStart);
        }
        else {
            speed = GD.fishConfig.bulletKindConfigArray[cannonConfig.size + BulletKind.BulletKind_ION_1].speed;
            idSpriteBullet = Number(cannonLevel.idSpriteSuperBullet);
        }
        //全面屏近似计算
        this.m_nSpeed =  speed * (1 + (GScaleScreenWidth - 1) * Math.abs(Math.sin(angle / 180 * Math.PI)));
        this.gcdGroupID = Date.now() % GCDFrameInterval;    //碰撞的组别
        this.setRotation(angle);

        SpriteManager.instance().setImageSprite(this.m_imgBullet, idSpriteBullet, (err) => {
            let size: cc.Size = this.m_imgBullet.node.getContentSize();
            this.node.setContentSize(size);
        });
    }

    public setRotation(angle: number): void
    {
        this.node.rotation = angle;
        this.m_v2Speed.x = this.m_nSpeed * Math.sin(angle / 180 * Math.PI);
        this.m_v2Speed.y = this.m_nSpeed * Math.cos(angle / 180 * Math.PI);
    }

    private checkLockFish(): void
    {
        //如果在切换鱼阵时，则把所有锁鱼xx掉
        if (GD.switingScene)
        {
            this.unlockFish();
        }

        if (this.m_lockFish != null)
        {
            //如果鱼死了
            if (!this.m_lockFish.valid)
            {
                this.unlockFish();
                return;
            }

            let v2PosFish: cc.Vec2 = this.m_lockFish.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
            let v2PosBullet: cc.Vec2 = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
            
            let radian: number = Math.atan((v2PosFish.x - v2PosBullet.x) / (v2PosFish.y - v2PosBullet.y));
            let angle: number = radian * 180 / Math.PI;

            if (GD.clientKernel.getTableUserItem(this.m_idChair).nSeat >1)
            {
                angle += 180;
            }
            this.setRotation(angle);
        }
    }

    update(dt)
    {
        this.checkLockFish();
        this.node.x += dt * this.m_v2Speed.x;
        this.node.y += dt * this.m_v2Speed.y;

        let v2PosWorld: cc.Vec2 = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        if (v2PosWorld.x < V.left)
        {
            this.setRotation(-this.node.rotation);
            v2PosWorld.x = V.left;
            this.CollideWall(v2PosWorld);
        }
        else if (v2PosWorld.x > V.right)
        {
            this.setRotation(-this.node.rotation);
            v2PosWorld.x = V.right;
            this.CollideWall(v2PosWorld);
        }
        else if (v2PosWorld.y < 0)
        {
            this.setRotation(-this.node.rotation - 180);
            v2PosWorld.y = 0;
            this.CollideWall(v2PosWorld);
        }
        else if (v2PosWorld.y > V.h)
        {
            this.setRotation(-this.node.rotation - 180);
            v2PosWorld.y = V.h;
            this.CollideWall(v2PosWorld);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        //切换场景时不检测
        if (!GD.switingScene)
        {
            //检测跟鱼的碰撞
            if (cc.director.getTotalFrames() % GCDFrameInterval == this.gcdGroupID)
            {
                this.collisionDetection();
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////
    }

    private CollideWall(v2PosWorld: cc.Vec2)
    {
        this.node.position = this.node.parent.convertToNodeSpaceAR(v2PosWorld);

        //要超出界外了，就不让他锁鱼了
        this.unlockFish();
    }

    //碰撞检测, 效率很低
    private collisionDetection()
    {
        if (this.m_bHit)
        {
            return;
        }

        let fish = UIManager.instance().getWindow(EM_UIType.eUT_Fish).getComponent(UIFish).collisionDetection(this);

        if (fish)
        {
            if (this.m_idChair == GD.chairID)
            {
                fish.onHit();
                this.sendCatchFishMsg(this.m_nBulletIndex, fish);
            }
            else if (this.m_bAndroid && GD.isAndroidHelp)
            {
                this.sendCatchFishMsg(this.m_nBulletIndex, fish);
            }

            //渔网
            let gameConfig = GD.fishConfig;
            let cannonConfig: CannonKindConfig = gameConfig.cannonKindConfigArray[this.m_nCannonIndex];
            let cannonLevel: CannonLevel = DataManager.instance().cannon.getCannonLevel(cannonConfig.size,this.isSuperBullet?1:0);
            let nd: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_Net);
            let uiNet: UINet = nd.getComponent(UINet);
            uiNet.createNet(cannonLevel.eNetAni, this.node.position);

            nd = UIManager.instance().getWindow(EM_UIType.eUT_Bullet);
            let uiBullet: UIBullet = nd.getComponent(UIBullet);
            uiBullet.destroyBullet(this.node);
            this.m_bHit = true;
        }
    }

    private sendCatchFishMsg(nBulletIndex: number, fish: ItemFish)
    {
        if (null == fish || !fish.valid || null == fish.fishID || null == fish.fishIndex || null == this.m_idBullet) {
            console.error('sendCatchFishMsg异常' + JSON.stringify(fish) + this.m_idBullet);
            return;
        }

        //捕鱼请求
        let msg: any = {};
        msg.bulletID = this.m_idBullet;
        if (nBulletIndex != -1)
        {
            msg.bulletIndex = nBulletIndex;
        }
        msg.fishID = fish.fishID;
        msg.fishIndex = fish.fishIndex;
        msg.chairID = this.m_idChair;

        //如果打中的是炸弹
        if (fish.fishKind == FishKind.SmallLocalBomb||fish.fishKind == FishKind.LocalBomb || fish.fishKind == FishKind.SuperBomb
            || fish.fishKind == FishKind.YiJianShuangDiao|| fish.fishKind == FishKind.YiShiSanYu|| fish.fishKind == FishKind.JinYuManTang
            || fish.fishKind == FishKind.LightFish || fish.isRedFish) {
            msg.rangeFish = UIManager.instance().getWindow(EM_UIType.eUT_Fish).getComponent(UIFish).findRangeFishes(fish);
        }

        GD.clientKernel.sendSocketData( define.gameCMD.MDM_GF_GAME, subGameMSG.SUB_C_CATCH_FISH, msg );
    }

    public unlockFish()
    {
        this.m_lockFish = null;
    }

    public getLockFish(): ItemFish
    {
        return this.m_lockFish;
    }

    /**
     * 得到的是真实的世界坐标
     * @returns {{lt, rt, lb, rb}|{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
     */
    public getBulletRect()
    {
        //把rect缓存起来， 因为每帧中， 每个子弹都会调用每条鱼的getFishRect进行碰撞检测一次
        let nowPos = this.node.getPosition();
        if (this.cacheRect == null || this.lastCallGetRectingPos == null || this.lastCallGetRectingPos.x != nowPos.x || this.lastCallGetRectingPos.y != nowPos.y)
        {
            this.lastCallGetRectingPos = nowPos;
            return this.cacheRect = ttutil.getRect(this.node, 0.8);
        }

        return this.cacheRect;
    }
}
