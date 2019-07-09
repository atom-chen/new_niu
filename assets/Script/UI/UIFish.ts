import PoolManager from "../Manager/PoolManager";
import {EM_PoolType} from "../Data/PoolData";
import {ttutil} from "../Base/Util";
import {DE_BUG, GFishDieAniDT, GScaleScreenWidth, GSupperLockFish, V} from "../GameData/Config"
import {FishKind, LightningKind} from "../GameData/SubGameMSG";
import {CCatchRangeFish, FishObj, SCatchFish} from "../GameData/MsgDefine";
import ItemBullet from "./ItemBullet";
import {NewFishRotationAt} from "../GameData/FishRotationAt";
import {AutoIncrementFish} from "./AutoIncrementFish";
import {UIManager} from "../Manager/UIManager";
import {EM_UIType} from "../Data/UIData";
import UIPlayerInfo from "./UIPlayerInfo";
import GameEngine from "../Base/GameEngine";
import UIScore from "./UIScore";
import UICoin from "./UICoin";
import UIUserOption from "./UIUserOption";
import UIEffect from "./UIEffect";
import UILightning from "./UILightning";
import UICatchFishMul from "./UICatchFishMul";
import ItemFishTrace from "./ItemFishTrace";

const {ccclass, property} = cc._decorator;
import GD = require('../GD');
import {ItemFish} from "./ItemFish";
import CombinedBaseFish from "./CombinedBaseFish";
@ccclass
export default class UIFish extends cc.Component {

    @property(cc.Node)
    public fishContainer: cc.Node = null;

    detectionArray: ItemFish[] = null;       // 需要跟子弹检测的数组
    lastUpdateDetectionArrayTotalFrames: number = 0;           // 上一次更新时的帧数

    onLoad() {
        this.detectionArray = [];
    }

    //更新待碰撞检测数组
    updateDetectionArray() {
        let totalFrames = cc.director.getTotalFrames();
        if (totalFrames == this.lastUpdateDetectionArrayTotalFrames) {
            return;
        }
        this.lastUpdateDetectionArrayTotalFrames = totalFrames;

        this.detectionArray = [];     //清空
        let fishArray = this.fishContainer.children;

        let len = fishArray.length;
        let ex = 0.1;
        //检测是否在这个区域里
        let testRect = {
            lx: -ex * (V.right - V.left),
            ly: -ex * V.h,
            rx: (1 + ex) * (V.right - V.left),
            ry: (1 + ex) * V.h
        };
        for (let i = 0; i < len; ++i) {
            let fish = fishArray[i].getComponent(ItemFish);
            let pos = fish.node.getPosition();
            //显示且在区域内才有必要跟子弹进行碰撞检测
            if (fish.valid && fish.node.active && pos.x > testRect.lx && pos.x < testRect.rx && pos.y > testRect.ly && pos.y < testRect.ry) {
                this.detectionArray.push(fish);
            }
        }

    }

    onEnable() {
        this.node.on('mytouchend', this._onMouseDown, this);
    }

    onDisable() {
        this.node.off('mytouchend', this._onMouseDown, this);
    }

    private _onMouseDown(event: cc.Event.EventCustom) {
        if (!GSupperLockFish){
            return;
        }

        //TODO:待确定判断自己是否落座是否正确
        let idChair = GD.chairID;
        let userItem = GD.clientKernel.getTableUserItem(idChair);
        if (null == userItem)
        {
            return;
        }

        let mousePos: cc.Vec2 = event.detail.getLocation();
        // console.error(`my touch---------- ${JSON.stringify(mousePos)}`);
        // if (GD.isRotation){
        //     console.error(`lock fish must rotation `);
        //     mousePos.x=V.w-mousePos.x*GScaleScreenWidth;
        //     mousePos.y=V.h-mousePos.y*GScaleScreenWidth;
        // }
        let fishArray = this.fishContainer.children;

        // //倒序， 让画在上面的先处理到
        // for (let i = fishArray.length - 1; i >= 0; --i) {
        //     let fish = fishArray[i].getComponent(ItemFish);
        //     let boundingBox=fish.getFishRect();
        //     for(let j=0;j<boundingBox.length;j++) {
        //         //不加个20很难点中 什么鸡儿
        //         // if (cc.pDistance(boundingBox[j].p, mousePos)<= boundingBox[j].r) {
        //         if (cc.pDistance(boundingBox[j].p, mousePos)<= boundingBox[j].r+20) {
        //             fish.onHit();
        //             GD.choosingLockFish = false;
        //             UIManager.instance().getWindow(EM_UIType.eUT_UserOption).getComponent(UIUserOption).lockFish();
        //             UIManager.instance().getWindow(EM_UIType.eUT_PlayerInfo).getComponent(UIPlayerInfo).lockFish(idChair, fish);
        //             return ;
        //         }
        //     }
        // }

        //倒序， 让画在上面的先处理到
        for (let i = fishArray.length - 1; i >= 0; --i) {
            let fish = fishArray[i].getComponent(ItemFish);

            if (ttutil.isPointInRect(fish.getFishRect(), mousePos)) {
                fish.onHit();
                GD.choosingLockFish = false;
                UIManager.instance().getWindow(EM_UIType.eUT_UserOption).getComponent(UIUserOption).lockFish();
                UIManager.instance().getWindow(EM_UIType.eUT_PlayerInfo).getComponent(UIPlayerInfo).lockFish(idChair, fish);
                break;
            }
        }
    }

    activeFish(data): ItemFish {
        //留到下一帧处理 这个有没有必要做一下？鱼太多会出现先碰撞在显示鱼
        return this._dealActiveFish(data);
    }

    /**
     * 激活鱼
     */
    private _dealActiveFish(data, moveAction?) {

        if (data.fishKind > 40) return;
        if (data.fishPath) {
            data.fishPath.forEach(element => {
                element.x *= V.w;
                element.y *= V.h;
            });
        }

        let fish: cc.Node = null;
        switch (data.fishKind) {
            //自增长的鱼（李逵）
            case FishKind.AutoIncrement:
                // console.error('增长鱼-----');
                fish = PoolManager.instance().createNode(EM_PoolType.ePT_AutoIncrementFish);
                this.fishContainer.addChild(fish);
                fish.getComponent(ItemFish).reuse(data.fishKind, data.fishID, data.fishIndex, data.fishTraceType, data.fishPath, data.delayTime);
                break;
            //超级炸弹
            case FishKind.SuperBomb:
                //console.log('生成鱼'+data.fishKind);
                // console.error('一箭双雕-----');
                fish =  PoolManager.instance().createNode(EM_PoolType.ePT_SuperBombFish);
                this.fishContainer.addChild(fish);
                fish.getComponent(ItemFish).reuse(data.fishKind, data.subFishKind, data.fishID, data.fishIndex, data.fishTraceType, data.fishPath, data.delayTime);
                break;
            //大三元
            case FishKind.DaSanYuan:
                // console.error('一石三鱼-----');
                fish =  PoolManager.instance().createNode(EM_PoolType.ePT_DaSanYuanFish);
                this.fishContainer.addChild(fish);
                (fish.getComponent(ItemFish) as CombinedBaseFish).reuse(data.fishKind, data.subFishKind, data.fishID, data.fishIndex, data.fishTraceType, data.fishPath, data.delayTime);
                break;
            //大四喜
            case FishKind.DaSiXi:
                // console.error('金玉满堂-----');
                fish =  PoolManager.instance().createNode(EM_PoolType.ePT_DaSiXiFish);
                this.fishContainer.addChild(fish);
                (fish.getComponent(ItemFish) as CombinedBaseFish).reuse(data.fishKind, data.subFishKind, data.fishID, data.fishIndex, data.fishTraceType, data.fishPath, data.delayTime);
                break;
            case FishKind.FishKing:
                // console.error('鱼王-----');
                fish =  PoolManager.instance().createNode(EM_PoolType.ePT_FishKingFish);
                this.fishContainer.addChild(fish);
                (fish.getComponent(ItemFish) as CombinedBaseFish).reuse(data.fishKind, data.subFishKind, data.fishID, data.fishIndex, data.fishTraceType, data.fishPath, data.delayTime);
                break;
            // case FishKind.LightFish:
            //     // console.error('闪电鱼-----');
            //     fish =  PoolManager.instance().createNode(EM_PoolType.ePT_LightFish);
            //     this.fishContainer.addChild(fish);
            //     fish.getComponent(ItemFish).reuse(data.fishKind, data.subFishKind, data.fishID, data.fishIndex, data.fishTraceType, data.fishPath, data.delayTime);
            //     break;
            default : {
                fish = PoolManager.instance().createNode(EM_PoolType.ePT_SingleFish);
                this.fishContainer.addChild(fish);
                fish.getComponent(ItemFish).reuse(data.fishKind, data.fishID, data.fishIndex, data.fishTraceType, data.fishPath, data.delayTime, data.isRedFish, data.speed);
            }
                break;
        }

        if (moveAction) {
            fish.getComponent(ItemFish).runMoveAction(moveAction);
        }

        return fish.getComponent(ItemFish);
    }



    clearAllFish() {
        let len = this.fishContainer.childrenCount;
        while (len--) {
            this.fishContainer.children[len].getComponent(ItemFish).removeSelf();
        }
    }
    /**
     * 碰撞检测， 检测是否跟子弹碰撞, 返回碰撞的鱼
     * @param bullet
     */
    collisionDetection(bullet: ItemBullet) {

        //内部有做避免重复更新机制， 只有不同帧才会更新
        this.updateDetectionArray();

        let bulletRect = bullet.getBulletRect();
        // let bulletPos = bullet.node.getPosition();
        let bulletPos = bullet.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        bulletPos = this.fishContainer.convertToNodeSpaceAR(bulletPos);
        let len = this.detectionArray.length;
        let cw = bullet.node.getContentSize().width;

        for (let i = 0; i < len; ++i) {

            let fish = this.detectionArray[i];

            //有锁鱼的话， 则要打到指定鱼才能中,,
            if (bullet.getLockFish() != null && bullet.getLockFish() != fish) {
                continue;
            }

            if (!fish.valid || (cc.pDistance(fish.node.getPosition(), bulletPos) > cw + fish.node.getContentSize().width / 2)) {
                continue;
            }

            let fishRect = fish.getFishRect();

            // c++版的  碰撞检测有问题， 先用js版
            if (ttutil.rectCollisionDetection(bulletRect, fishRect)) {
                return fish;
            }
            //console.log("xx")
        }
        // for (let i = 0; i < len; ++i) {
        //
        //
        //     let fish = this.detectionArray[i];
        //
        //     //有锁鱼的话， 则要打到指定鱼才能中,,
        //     if (bullet.getLockFish() != fish && bullet.getLockFish() != null) {
        //         continue;
        //     }
        //
        //     if (!fish.valid) {
        //
        //         continue;
        //     }
        //
        //     let boundingBox=fish.getFishRect();
        //     for(let j=0;j<boundingBox.length;j++){
        //         // if(cc.pDistance(boundingBox[j].p, bulletPos)<=cw + boundingBox[j].r+20)
        //         if(cc.pDistance(boundingBox[j].p, bulletPos)<=cw + boundingBox[j].r)
        //         {
        //             return fish;
        //         }
        //     }
        //
        //     // let fishPos=fish.getPosition();
        //     // let angle=fish.angle*Math.PI/180.0;
        //
        //
        //
        //     // for(let j=0,len1=GFishKindAnimationFN[fish.fishKind].boundingBox.length;j<len1;j++){
        //
        //     //     let x=GFishKindAnimationFN[fish.fishKind].boundingBox[j].x-GFishKindAnimationFN[fish.fishKind].x;
        //     //     let y=GFishKindAnimationFN[fish.fishKind].boundingBox[j].y-GFishKindAnimationFN[fish.fishKind].y;
        //     //     let radius=Math.sqrt(x*x+y*y);
        //     //     let startAngle=Math.atan2(GFishKindAnimationFN[fish.fishKind].boundingBox[j].y,GFishKindAnimationFN[fish.fishKind].boundingBox[j].x)-angle;
        //
        //     //     //获得旋转坐标
        //     //     let fishPosTemp=cc.p(fishPos.x,fishPos.y);
        //     //     fishPosTemp.x+=radius*Math.cos(startAngle);
        //     //     fishPosTemp.y+=radius*Math.sin(startAngle);
        //     //     if(cc.pDistance(fishPosTemp, bulletPos)<=cw + GFishKindAnimationFN[fish.fishKind].boundingBox[j].r+50)
        //     //     {
        //     //         return fish;
        //     //     }
        //
        //     //     //还有防止鱼儿穿透
        //     // }
        //
        // }
        return null;
    }

    /**
     * 查找炸弹旁边的鱼
     */
    findRangeFishes(fish: ItemFish) {
        this.updateDetectionArray();
        let rangeFish: CCatchRangeFish[] = [];

        switch (fish.fishKind) {
            case FishKind.SmallLocalBomb: {
                let killingRadius = GD.fishConfig.smallLocalBombRadius * V.h;
                let localBombPos = fish.node.getPosition();
                if (this.detectionArray) {
                    let len = this.detectionArray.length;
                    for (let i = 0; i < len; ++i) {

                        let tempFish = this.detectionArray[i];
                        if (tempFish != fish) {
                            let fishPos = tempFish.node.getPosition();
                            if (cc.pDistance(fishPos, localBombPos) <= killingRadius) {
                                rangeFish.push({fishID: tempFish.fishID, fishIndex: tempFish.fishIndex});
                            }
                        }
                    }
                }
            }

                break;
            case FishKind.LocalBomb: {
                let killingRadius = GD.fishConfig.localBombRadius * V.h;
                let localBombPos = fish.node.getPosition();

                this.detectionArray.forEach(element => {
                    let tempFish = element.getComponent(ItemFish);

                    if (tempFish.fishID != fish.fishID && tempFish.fishIndex != fish.fishIndex) {
                        let fishPos = tempFish.node.position;
                        if (cc.pDistance(fishPos, localBombPos) <= killingRadius) {
                            rangeFish.push({fishID: tempFish.fishID, fishIndex: tempFish.fishIndex});
                        }
                    }
                });
            }
                break;

            case FishKind.SuperBomb: {
                this.detectionArray.forEach(element => {
                    let tempFish = element.getComponent(ItemFish);

                    if (tempFish.fishID != fish.fishID && tempFish.fishIndex != fish.fishIndex) {
                        rangeFish.push({fishID: tempFish.fishID, fishIndex: tempFish.fishIndex});
                    }
                });
            }
                break;
            /*case FishKind.FishKing: {

                if (this.detectionArray) {
                    let len = this.detectionArray.length;
                    for (let i = 0; i < len; ++i) {

                        let tempFish = this.detectionArray[i];
                        if (fish.subFishKind == tempFish.fishKind) {
                            rangeFish.push({fishID: tempFish.fishID, fishIndex: tempFish.fishIndex});
                        }
                    }
                }
                break;
            }*/

            case FishKind.LightFish: {
                if (this.detectionArray) {
                    let len = this.detectionArray.length;
                    for (let i = 0; i < len; ++i) {
                        let tempFish = this.detectionArray[i];
                        if (fish.fishKind == tempFish.fishKind) {//否是闪电
                            rangeFish.push({fishID: tempFish.fishID, fishIndex: tempFish.fishIndex});
                        }
                    }
                }
                break;
            }
            case FishKind.YiJianShuangDiao:
            case FishKind.YiShiSanYu:
            case FishKind.JinYuManTang:{
                if (this.detectionArray) {
                    let len = this.detectionArray.length;
                    for (let i = 0; i < len; ++i) {
                        let tempFish = this.detectionArray[i];
                        if (fish.subFishKind.indexOf(tempFish.fishKind)>=0) {//是否存在對應的魚兒
                            rangeFish.push({fishID: tempFish.fishID, fishIndex: tempFish.fishIndex});
                        }
                    }
                }
                break;
            }

            default : {
                //如果是红鱼
                if (fish.isRedFish) {
                    this.detectionArray.forEach(element => {
                        let tempFish = element.getComponent(ItemFish);

                        if (tempFish.fishKind == fish.fishKind) {
                            rangeFish.push({fishID: tempFish.fishID, fishIndex: tempFish.fishIndex});
                        }
                    });
                }
            }
                break;
        }

        return rangeFish;
    }

    /**
     * 开始鱼阵
     * @param data
     */
    startFishArray(data) {
        let fishArrayKind = data.fishArrayKind;
        let randseek = data.randseek;
        let fishData = data.fishData;

        //为null， 可能是走普通渠道发鱼下来
        if (fishData == null) {
            return;
        }

        //为null， 可能是走普通渠道发鱼下来
        if (fishData != null) {
            ttutil.srand(randseek);         //设置随机种子
            let funcName = "loadFishArray" + (fishArrayKind);
            if (typeof this[funcName] == "function") {
                this[funcName](fishData);
            }
        }
    }

    /**
     * 载入鱼阵2
     * @param data
     */
    loadFishArray2(fishDataArray) {
        let len = fishDataArray.length;

        for (let i = 0; i < len; ++i) {

            let fishData = fishDataArray[i];

            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });

            //valid: true,
            //    fishKind: fish.fishKind,
            //    fishID: fish.fishID,
            //    fishIndex: fish.fishIndex,
            //    delayTime: (fish.buildTick.getTime() - now.getTime()) / 1000 + fish.delayTime,

            //前两百条是小鱼， 100条从上方游进来， 100条从下方游进来， 在界面中停留一下， 再游出去
            if (i < 200) {
                let x, ys, yd, ye;      //x轴点， 起点， 停留点， 终点
                x = (i % 100) / 100 * V.w;
                let rnd = (ttutil.random() / ttutil.RandMax) * 50;

                //
                if (i < 100) {
                    ys = -65 - rnd;
                    yd = 174 + (ttutil.random() / ttutil.RandMax) * 30 - 15;
                    ye = V.h + 65;
                }
                else {
                    ys = V.h + 65 + rnd;
                    yd = 584 + (ttutil.random() / ttutil.RandMax) * 30 - 15;
                    ye = -65;
                }

                let speed = ((ttutil.random() / ttutil.RandMax) * 2.0 + 2.0) * 30;         //速度在鱼阵中是另外算的
                let dt1 = Math.abs((yd - ys) / speed);
                let dt2 = 2050 / 30;
                let dt3 = Math.abs((ye - yd) / speed);


                let action = cc.sequence(cc.place(x, ys), cc.moveTo(dt1, x, yd), cc.delayTime(dt2), cc.moveTo(dt3, x, ye));
                fish.runMoveAction(action);

            }
            else {
                let st = cc.p(), ed = cc.p();
                if (i % 2) {
                    st.x = -250;
                    ed.x = V.w + 250;
                    st.y = ed.y = 484;
                }
                else {
                    st.x = V.w + 250;
                    ed.x = -250;
                    st.y = ed.y = 284;
                }
                let speed = 3 * 30;         //速度在鱼阵中是另外算的
                let delayTime = (((i - 200) / 2) * 150 + 100) / 30;
                let dt = Math.abs((ed.x - st.x) / speed);
                let action = cc.sequence(cc.delayTime(delayTime), cc.place(st), cc.moveTo(dt, ed));
                fish.runMoveAction(action);
            }

            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime );
            }
        }
    }

    /**
     * 载入鱼阵3
     * @param data
     */
    loadFishArray3(fishDataArray) {

        let len = fishDataArray.length;

        let direction = ttutil.random() % 2 != 0;


        for (let i = 0; i < len; ++i) {

            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });

            let st = cc.p(), ed = cc.p();
            if (i < 30) {
                st.y = V.h / 2;
                ed.y = ttutil.random() % (V.h + 1000) - 500;

                if (direction) {
                    st.x = V.w + 250;
                    ed.x = -250;
                }
                else {
                    st.x = -250;
                    ed.x = V.w + 250;
                }

                let speed = 3 * 30;         //速度在鱼阵中是另外算的
                let delayTime = (i * 50) / 30;
                let dt = cc.pDistance(st, ed) / speed;
                let action = cc.sequence(cc.delayTime(delayTime), cc.place(st), cc.moveTo(dt, ed));
                fish.runMoveAction(action);
            }
            else {
                st.x = ed.x = ttutil.random() % V.w;

                if (i - 30 < 100) {
                    st.y = -65;
                    ed.y = V.h + 65;
                }
                else {
                    st.y = V.h + 65;
                    ed.y = -65;
                }

                let speed = 3 * 30;         //速度在鱼阵中是另外算的
                let delayTime = (ttutil.random() % 1300 + 200) / 30;
                let dt = cc.pDistance(st, ed) / speed;
                let action = cc.sequence(cc.delayTime(delayTime), cc.place(st), cc.moveTo(dt, ed));
                fish.runMoveAction(action);
            }
            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime);
            }
        }
    }

    /**
     * 载入鱼阵4
     * @param data
     */
    loadFishArray4(fishDataArray) {
        let len = fishDataArray.length;


        let radius = (V.h - 180) / 2;
        let speed = 1.5 * 30;//速度在鱼阵中是另外算的

        let center = cc.p(V.w + radius, radius + 80);

        let actions = [];

        //{x: x + radius * Math.sin(i * cellRadian), y: y + radius * Math.cos(i * cellRadian)}
        let st = cc.p(), ed = cc.p();
        let cellRadian = Math.PI * 2 / 59;
        center.x = -radius;
        for (let i = 0; i < 59; ++i) {
            
            st.x = Math.sin(i * cellRadian) * radius + center.x;
            st.y = Math.cos(i * cellRadian) * radius + center.y;

            ed.x = V.w + 2 * radius;
            ed.y = st.y;

            let dt = cc.pDistance(st, ed) / speed;
            let action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
            actions.push(action);
        }

        cellRadian = Math.PI * 2 / 29;
        for (let i = 0; i < 29; ++i) {
            
            st.x = Math.sin(i * cellRadian) * radius * 0.75 + center.x;
            st.y = Math.cos(i * cellRadian) * radius * 0.75 + center.y;

            ed.x = V.w + 2 * radius;
            ed.y = st.y;

            let dt = cc.pDistance(st, ed) / speed;
            let action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
            actions.push(action);
        }

        center.x = V.w + radius;
        cellRadian = Math.PI * 2 / 59;
        for (let i = 0; i < 59; ++i) {
            st.x = Math.sin(i * cellRadian) * radius + center.x;
            st.y = Math.cos(i * cellRadian) * radius + center.y;

            ed.x = -2 * radius;
            ed.y = st.y;

            let dt = cc.pDistance(st, ed) / speed;
            let action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
            actions.push(action);
        }


        cellRadian = Math.PI * 2 / 29;
        for (let i = 0; i < 29; ++i) {
           
            st.x = Math.sin(i * cellRadian) * radius * 0.75 + center.x;
            st.y = Math.cos(i * cellRadian) * radius * 0.75 + center.y;

            ed.x = -2 * radius;
            ed.y = st.y;

            let dt = cc.pDistance(st, ed) / speed;
            let action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
            actions.push(action);
        }

        //中心的大鱼

        st.x = -radius;
        st.y = center.y;
        ed.x = V.w + 2 * radius;
        ed.y = st.y;
        let dt = cc.pDistance(st, ed) / speed;
        let action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
        actions.push(action);

        st.x = center.x;
        st.y = center.y;
        ed.x = -2 * radius;
        ed.y = st.y;
        dt = cc.pDistance(st, ed) / speed;
        action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
        actions.push(action);

       for (let i = 0; i < len; ++i) {
            st.x = center.x;
            st.y = center.y;
            ed.x = -2 * radius;
            ed.y = st.y;
            let dt1 = cc.pDistance(st, ed) / speed;
            let action1 = cc.sequence(cc.place(st), cc.moveTo(dt1, ed));
            actions.push(action1);
        } 
/////////////////////////////////////////////////////////////////////////////////
        for (let i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });
            fish.runMoveAction(actions[i]);
            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime);
            }
        }
    }

    /**
     * 载入鱼阵5
     * @param data
     */
    loadFishArray5(fishDataArray) {

        let len = fishDataArray.length;
        let speed = 3 * 30;//速度在鱼阵中是另外算的
        let st = cc.p(), ed = cc.p();

 

        for (let   i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });

            if (i < 100 + 98 + 99) {

                let x, y;
                while (true) {
                    x = (ttutil.random() / ttutil.RandMax) * 2 - 1;
                    y = (ttutil.random() / ttutil.RandMax) * 2 - 1;
                    if (x * x + y * y <= 1) {
                        break;
                    }
                }
                let radius = 230, r = 2;
                x = radius * x * r;
                y = radius * y;

                let extraX = radius * r + 50;
                st.x = x - extraX;
                ed.x = x + V.w + extraX;
                st.y = ed.y = y + 384;
                if (i >= 100) {
                    st.x -= 950;
                    if (i >= 100 + 98) {
                        st.x -= 950;
                    }
                }
            }
            else {
                st.x = -3400;
                ed.x = V.w + 250;
                st.y = ed.y = 384;
            }

            let dt = cc.pDistance(st, ed) / speed;

            let action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));

            fish.runMoveAction(action);
            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime );
            }
        }
    }

    /**
     * 载入鱼阵6
     * @param data
     */
    loadFishArray6(fishDataArray) {
        let len = fishDataArray.length;

        let a0 = 900, b0 = 300;
        let a1 = 500, b1 = 130;
        let kk = 1;
        let speed = 1.6 * 30;

////////////////////////////////////////////////////////////////////
        let st = cc.p(), ed = cc.p();

        let bigArray = [cc.p(-400 + 100, 0), cc.p(-200 + 100, -120), cc.p(-200 + 100, 120), cc.p(0 + 100, -240), cc.p(100, 240), cc.p(300, 0)];

 

        for (let i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });

            let x, y;
            if (i < 135) {
                while (true) {
                    x = ttutil.random() / ttutil.RandMax * a0;
                    y = ttutil.random() / ttutil.RandMax * b0 * 2 - b0;
                    if (x * x / (a0 * a0) + y * y / (b0 * b0) < 1 && x * x / (a1 * a1) + y * y / (b1 * b1) > 1 && y < kk * x && y > -kk * x)
                        break;
                }
            }
            else {

                x = bigArray[i - 135].x;
                y = bigArray[i - 135].y;
            }

            st.x = x + 1900;
            ed.x = x - 1000;
            st.y = ed.y = y + 384;


            let dt = cc.pDistance(st, ed) / speed;
            let action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
            fish.runMoveAction(action);


            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime );
            }
        }
    }

    /**
     * 载入鱼阵7
     * @param data
     */
    loadFishArray7(fishDataArray ) {

        let len = fishDataArray.length;
        let startAngle = 135;
        let center = cc.p(V.w / 2, V.h / 2);
        let actions = [];
        let oneRingTime = 10;           //转一圈所需要的时间
        let circleNum = 1;
        let lineSpeed = 150;

        let split = [40, 40, 24, 13];
        let radius = [350, 290, 230, 170];

        let delayAngle = 0;                        //
        let stopPos = cc.p();

        for (let i = 0; i < split.length; ++i) {

            delayAngle += 90;
            for (let j = 0; j < split[i]; ++j) {

                let action = cc.sequence(cc.hide(), cc.delayTime(oneRingTime / split[i] * (j)), cc.show(),

                    cc.repeat(NewFishRotationAt(oneRingTime, center, radius[i], startAngle, true, 360), circleNum),
                    NewFishRotationAt(oneRingTime * (1 - (j) / split[i]) + (delayAngle / 360) * oneRingTime, center, radius[i], startAngle, true, delayAngle + 360 * (1 - (j) / split[i]))
                    //cc.delayTime(100)
                );

                //计算最终旋转完后 停下的位置
                let angle = (startAngle + 360 * (1 - (j) / split[i])) + delayAngle;
                let radian = angle / 180 * Math.PI;//转换成弧度

                stopPos = cc.p(radius[i] * Math.sin(radian) + center.x, radius[i] * Math.cos(radian) + center.y);

                let outScreenPos = ttutil.getTargetPoint(Math.PI * 3 - radian, stopPos);

                let dt = cc.pDistance(stopPos, outScreenPos) / lineSpeed + 0.01;
                //console.log(dt + "\t" + JSON.stringify(outScreenPos))
                action = cc.sequence(action, cc.moveTo(dt, outScreenPos));

                actions.push(action);
            }
        }

        //// 金海豚。
        {
            let action = cc.sequence(cc.place(center), cc.rotateTo(0, startAngle - 80), cc.repeat(cc.rotateBy(oneRingTime, 360), circleNum + 2));


            let radian = (startAngle - 80) / 180 * Math.PI;//转换成弧度
            let outScreenPos = ttutil.getTargetPoint(Math.PI * 3 - radian, stopPos);

            let dt = cc.pDistance(stopPos, outScreenPos) / lineSpeed;
            action = cc.sequence(action, cc.moveTo(dt, outScreenPos));
            actions.push(action);
        }
        for (let i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
                //cc.pool.
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });

            fish.runMoveAction(actions[i]);

            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime );
            }
        }
    }

    /**
     * 载入鱼阵8
     * @param data
     */
    loadFishArray8(fishDataArray) {

        let len = fishDataArray.length;
        let actions = [];
        let sectionNum = 6;
        let split = [6, 90, 114, 90];

        let tAngle = Math.PI / 3;//60度
        let center = cc.p(V.w / 2, V.h / 2);
        let speed = 120;
        let delayTime = 5;
        let st = cc.p(V.w / 2, V.h / 2), ed;

        for (let i = 0; i < split.length; ++i) {
            let tt = split[i] / sectionNum;

            for (let j = 0; j < split[i]; ++j) {

                let k = Math.floor(j / tt % sectionNum);
                ed = ttutil.getTargetPoint(tAngle * k + ttutil.random() / ttutil.RandMax * Math.PI / 6, center);

                let dt = cc.pDistance(st, ed) / speed;

                let action = cc.sequence(cc.hide(), cc.delayTime(delayTime * i + ttutil.random() / ttutil.RandMax * Math.min(2.5, split[i] / sectionNum)), cc.place(st), cc.show(), cc.moveTo(dt, ed));

                actions.push(action);
            }
        }

        for (let  i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });

            fish.runMoveAction(actions[i]);

            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime );
            }
        }
    }

    /**
     * 载入鱼阵9
     * @param data
     */
    loadFishArray9(fishDataArray) {

        let len = fishDataArray.length;

        let actions = [];

        let split = [27, 8, 64, 1];
        let fishInitPos = [];
        let speed = 90;

        //蓝斑鱼的起始位置
        fishInitPos[0] = [
            cc.p(100, V.h / 2 - 130),
            cc.p(100, V.h / 2 - 50),
            cc.p(100, V.h / 2 + 50),
            cc.p(100, V.h / 2 + 130),
            cc.p(1130, V.h / 2 + 100),
            cc.p(1130, V.h / 2),
            cc.p(1130, V.h / 2 - 100),
        ];
        for (let i = 0; i < 10; ++i) {
            fishInitPos[0].push(cc.p(180 + i * 105, V.h / 2 - 200));
            fishInitPos[0].push(cc.p(180 + i * 105, V.h / 2 + 200));
        }
        ///////////////////////////////////////////////////////////////////////
        //蓝蝴蝶
        fishInitPos[1] = [
            cc.p(225, V.h / 2),
            cc.p(375, V.h / 2),
            cc.p(300, V.h / 2 - 50),
            cc.p(300, V.h / 2 + 50),
        ];
        for (let i = 0; i < 4; ++i) {
            fishInitPos[1][i + 4] = cc.p(fishInitPos[1][i].x + 600, fishInitPos[1][i].y);
        }
        ///////////////////////////////////////////////////////////////
        //粉红色小鱼

        fishInitPos[2] = [];
        for (let i = 0; i < 16; ++i) {
            fishInitPos[2].push(cc.p(200 + i * 55, V.h / 2 - 250));
            fishInitPos[2].push(cc.p(200 + i * 55, V.h / 2 - 150));
            fishInitPos[2].push(cc.p(200 + i * 55, V.h / 2 + 250));
            fishInitPos[2].push(cc.p(200 + i * 55, V.h / 2 + 150));
        }
        //////////////////////////////////////////////////////////////////////////
        //金莎
        fishInitPos[3] = [cc.p(V.w / 2 - 90, V.h / 2)];
        //////////////////////////////////////////////////////////////////////////


        let dir = ttutil.random() % 2 * 2 - 1;
        for (let i = 0; i < split.length; ++i) {
            for (let j = 0; j < split[i]; ++j) {
              
                let dis = V.w * 2 * dir;
                let dt = Math.abs(dis / speed);
                //console.log(fishInitPos[i][j].x + "\t" + fishInitPos[i][j].y);
                actions.push(cc.sequence(cc.place(fishInitPos[i][j].x + V.w * dir, fishInitPos[i][j].y), cc.moveBy(dt, cc.p(-dis, 0))));
            }
        }

        for (let i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });

            fish.runMoveAction(actions[i]);

            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime);
            }
        }
    }

    /**
     * 载入鱼阵10
     * @param data
     */
    loadFishArray10(fishDataArray) {

        let len = fishDataArray.length;
        let actions = [];

        let split = [2, 5, 50, 2, 2, 1, 40, 3];
        let fishInitPos = [];
        let speed = 90;

        //宝箱
        fishInitPos.push(cc.p(50, V.h / 2 - 50));
        fishInitPos.push(cc.p(150, V.h / 2 - 50));

        //黄鱼
        for (let i = 0; i < 5; ++i) {
            fishInitPos.push(cc.p(270, V.h / 2 + 120 + 30 * i));
        }

        //粉鱼
        for (let i = 0; i < 20; ++i) {
            fishInitPos.push(cc.p(220 + 45 * i, V.h / 2 - 110));
        }
        for (let i = 0; i < 5; ++i) {
            fishInitPos.push(cc.p(220, V.h / 2 - 70 + 40 * i));
            fishInitPos.push(cc.p(1075, V.h / 2 - 70 + 40 * i));
        }
        for (let i = 0; i < 3; ++i) {
            fishInitPos.push(cc.p(270 + 50 * i, V.h / 2 + 90));
            fishInitPos.push(cc.p(1025 - 50 * i, V.h / 2 + 90));
        }

        //斜着
        for (let i = 0; i < 3; ++i) {
            fishInitPos.push(cc.p(420 + 20 * i, V.h / 2 + 90 + 30 * i));
            fishInitPos.push(cc.p(875 - 20 * i, V.h / 2 + 90 + 30 * i));
        }
        for (let i = 0; i < 8; ++i) {
            fishInitPos.push(cc.p(480 + 45 * i, V.h / 2 + 180));
        }
        //////////////////////////////////////////////////////////////////////
        //乌龟
        fishInitPos.push(cc.p(V.w / 2 - 300, V.h / 2));
        fishInitPos.push(cc.p(V.w / 2 + 250, V.h / 2));
        //////////////////////////////////////////////////////////////////////////
        //灯笼
        fishInitPos.push(cc.p(V.w - 180, V.h / 2 - 50));
        fishInitPos.push(cc.p(V.w - 180, V.h / 2 + 50));
        //金沙
        fishInitPos.push(cc.p(V.w / 2 - 50, V.h / 2));

        //绿小鱼
        for (let i = 0; i < 20; ++i) {
            fishInitPos.push(cc.p(V.w / 2 - 320 + (ttutil.random() / ttutil.RandMax) * 100 - 50, V.h / 2 - 200 + (ttutil.random() / ttutil.RandMax) * 100 - 50));
            fishInitPos.push(cc.p(V.w / 2 + 200 + (ttutil.random() / ttutil.RandMax) * 100 - 50, V.h / 2 - 200 + (ttutil.random() / ttutil.RandMax) * 100 - 50));
        }

        //海马
        for (let i = 0; i < 3; ++i) {
            fishInitPos.push(cc.p(V.w / 2 - 160 + 125 * i, V.h / 2 + 100));
        }
        //////////////////////////////////////////////////////////////////////////
        //let dir = ttutil.random() % 2 * 2 - 1;
        let dir = 1;//前后没有对称， 不能直接这样子， 所以， 先算了
        for (let i = 0; i < len; ++i) {

            fishInitPos[i].x -= V.w * dir;
            let dis = V.w * 2 * dir;
            let action = cc.place(fishInitPos[i]);

            actions.push(cc.sequence(action, cc.moveBy(Math.abs(dis / speed), cc.p(dis, 0))));
        }

        for (let i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
                fishInChest: fishData.fishInChest,
            });

            fish.runMoveAction(actions[i]);

            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime );
            }
        }
    }

    /**
     * 载入鱼阵11
     * @param data
     */
    loadFishArray11(fishDataArray) {

        let len = fishDataArray.length;

        let actions = [];
        let fishInitPos = [];
        let speed = 90;
        let radius = V.h / 2;

        //绿色小鱼
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 20; ++j) {

                fishInitPos.push(cc.p(Math.sin((35 + j * 5.5) / 180 * Math.PI) * radius + V.w / 2 + 55 * i + 30, Math.cos((35 + j * 5.5) / 180 * Math.PI) * radius + V.h / 2));

                fishInitPos.push(cc.p(Math.sin((35 + 180 + j * 5.5) / 180 * Math.PI) * radius + V.w / 2 - 55 * i - 30, Math.cos((35 + 180 + j * 5.5) / 180 * Math.PI) * radius + V.h / 2));
            }
        }

        //粉色小鱼, 黄色小鱼
        let offset = 22;
        let dy = 55;
        let dx = 65;
        let allOffsetX = -20;
        for (let k = 0; k < 2; ++k) {
            for (let i = 0; i < 2; ++i) {
                fishInitPos.push(cc.p(V.w / 2 + offset * k + allOffsetX, V.h / 2 + dy * 5 * (1 - i * 2) - offset * k));
            }
            for (let i = 0; i < 7; ++i) {
                fishInitPos.push(cc.p(V.w / 2 - 150 + dx * i + offset * k + allOffsetX, V.h / 2 + dy * 4 - offset * k));
                fishInitPos.push(cc.p(V.w / 2 - 150 + dx * i + offset * k + allOffsetX, V.h / 2 - dy * 4 - offset * k));
            }

            for (let i = 0; i < 9; ++i) {
                fishInitPos.push(cc.p(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 + dy * 3 - offset * k));
                fishInitPos.push(cc.p(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 - dy * 3 - offset * k));
            }
            for (let i = 0; i < 9; ++i) {
                if (i == 4)
                    continue;
                fishInitPos.push(cc.p(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 + dy * 2 - offset * k));
                fishInitPos.push(cc.p(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 - dy * 2 - offset * k));
            }
            for (let i = 0; i < 9; ++i) {
                if (i == 4 || i == 3 || i == 5)
                    continue;
                fishInitPos.push(cc.p(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 + dy - offset * k));
                fishInitPos.push(cc.p(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 - dy - offset * k));
            }
            for (let i = 0; i < 11; ++i) {
                if (i >= 3 && i <= 7) {
                    continue;
                }
                fishInitPos.push(cc.p(V.w / 2 - 300 + dx * i + offset * k + allOffsetX, V.h / 2 - offset * k));
            }
        }

        ///////////////
        //乌龟王子， 灯笼皇后
        fishInitPos.push(cc.p(V.w / 2 + 25, V.h / 2 + 50));
        fishInitPos.push(cc.p(V.w / 2 + 25, V.h / 2 - 50));

        //////////////////////////////////////////////////////////////////////////

        let dir = ttutil.random() % 2 * 2 - 1;

        for (let i = 0; i < len; ++i) {

            fishInitPos[i].x += V.w * dir;
            let dis = -V.w * 2 * dir;
            let action = cc.place(fishInitPos[i]);

            actions.push(cc.sequence(action, cc.moveBy(Math.abs(dis / speed), cc.p(dis, 0))));
        }

        for (let  i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
            });

            fish.runMoveAction(actions[i]);

            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime );
            }
        }
    }

    /**
     * 载入鱼阵12
     * @param data
     */
    loadFishArray12(fishDataArray) {

        let len = fishDataArray.length;
        let radius = (V.h - 240) / 2;
        let speed = 45;
        let center = cc.p(V.w + radius, radius + 120);
        let actions = [];

        let tlen = 100;
        let st = cc.p(), ed = cc.p();
        let dt;
        for (let i = 0; i < tlen; ++i) {
            
            st.x = radius * Math.cos(i / tlen * Math.PI * 2) + center.x;
            st.y = radius * Math.sin(i / tlen * Math.PI * 2) + center.y;
            ed.x = -2 * radius;
            ed.y = st.y;
            dt = cc.pDistance(st, ed) / speed;
            actions.push(cc.sequence(cc.place(st), cc.moveTo(dt, ed)));
        }

        let rotateRadian1 = 45 * Math.PI / 180;
        let rotateRadian2 = 135 * Math.PI / 180;
        let radiusSmall = radius;
        let radiusSmall1 = radius / 3;

        let centerSmall = [cc.p(), cc.p(), cc.p(), cc.p()];

        centerSmall[0].x = center.x + radiusSmall * Math.cos(-rotateRadian2);
        centerSmall[0].y = center.y + radiusSmall * Math.sin(-rotateRadian2);
        centerSmall[1].x = center.x + radiusSmall * Math.cos(-rotateRadian1);
        centerSmall[1].y = center.y + radiusSmall * Math.sin(-rotateRadian1);
        centerSmall[2].x = center.x + radiusSmall * Math.cos(rotateRadian2);
        centerSmall[2].y = center.y + radiusSmall * Math.sin(rotateRadian2);
        centerSmall[3].x = center.x + radiusSmall * Math.cos(rotateRadian1);
        centerSmall[3].y = center.y + radiusSmall * Math.sin(rotateRadian1);


        let ttlen = [17, 17, 30, 30];
        for (let k = 0; k < centerSmall.length; ++k) {
            tlen = ttlen[k];
            for (let i = 0; i < tlen; ++i) {

                st.x = radiusSmall1 * Math.cos(i / tlen * Math.PI * 2) + centerSmall[k].x;
                st.y = radiusSmall1 * Math.sin(i / tlen * Math.PI * 2) + centerSmall[k].y;
                ed.x = -2 * radius;
                ed.y = st.y;
                dt = cc.pDistance(st, ed) / speed;
                actions.push(cc.sequence(cc.place(st), cc.moveTo(dt, ed)));
            }
        }

        tlen = 15;
        for (let i = 0; i < tlen; ++i) {

            st.x = radiusSmall / 2 * Math.cos(i / tlen * Math.PI * 2) + center.x;
            st.y = radiusSmall / 2 * Math.sin(i / tlen * Math.PI * 2) + center.y;
            ed.x = -2 * radius;
            ed.y = st.y;
            dt = cc.pDistance(st, ed) / speed;
            actions.push(cc.sequence(cc.place(st), cc.moveTo(dt, ed)));
        }

        for (let i = 0; i < 4; ++i) {
            
            st.x = centerSmall[i].x;
            st.y = centerSmall[i].y;
            ed.x = -2 * radius;
            ed.y = st.y;

            dt = cc.pDistance(st, ed) / speed;
            actions.push(cc.sequence(cc.place(st), cc.moveTo(dt, ed)));
        }

        st.x = center.x;
        st.y = center.y;
        ed.x = -2 * radius;
        ed.y = st.y;

        dt = cc.pDistance(st, ed) / speed;
        actions.push(cc.sequence(cc.place(st), cc.moveTo(dt, ed)));

        for (let i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
            });

            fish.runMoveAction(actions[i]);


            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime);
            }
        }
    }

    /**
     * 载入鱼阵13
     * @param data
     */
    loadFishArray13(fishDataArray) {

        let len = fishDataArray.length;

        let radius = (V.h - 240) / 2;
        let speed = 45;
        let center = cc.p(V.w + radius, V.h / 2);
        let actions = [];

        let st = cc.p(), ed = cc.p();

        let centerXArray = [-radius, V.w + radius];
        let edXArray = [V.w + 2 * radius, -2 * radius];
        for (let kk = 0; kk < 2; ++kk) {

            //方向
            let dir = kk * 2 - 1;

            center.x = centerXArray[kk];

            let split = [50, 40, 30];
            let radiuses = [radius, radius * 40 / 50, radius * 30 / 50];
            let centers = [center, cc.p(center.x + dir * radius / 5, center.y), cc.p(center.x + dir * radius * 2 / 5, center.y)];
            for (let i = 0; i < split.length; ++i) {
                let tlen = split[i];

                for (let j = 0; j < tlen; ++j) {

                    st.x = radiuses[i] * Math.cos(j / tlen * Math.PI * 2) + centers[i].x;
                    st.y = radiuses[i] * Math.sin(j / tlen * Math.PI * 2) + centers[i].y;

                    ed.x = edXArray[kk];
                    ed.y = st.y;

                    actions.push(cc.sequence(cc.place(st), cc.moveTo(cc.pDistance(st, ed) / speed, ed)));
                }
            }

            let stY = [center.y - radius, center.y + radius, center.y];
            for (let i = 0; i < 3; ++i) {

                st.x = center.x;
                if (i == 2) {
                    st.x += dir * radius * 2 / 5;
                }
                st.y = stY[i];
                ed.x = edXArray[kk];
                ed.y = st.y;
                actions.push(cc.sequence(cc.place(st), cc.moveTo(cc.pDistance(st, ed) / speed, ed)));
            }
        }

        for (let i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
            });

            fish.runMoveAction(actions[i]);

            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime );
            }
        }
    }

    /**
     * 载入鱼阵14
     * @param data
     */
    loadFishArray14(fishDataArray) {

        let len = fishDataArray.length;
        let speed = 90;
        let centers = [cc.p(V.w / 3, V.h / 3), cc.p(V.w / 3 * 2, V.h / 3 * 2), cc.p(V.w / 3, V.h / 3 * 2), cc.p(V.w / 3 * 2, V.h / 3)];

        let actions = [];
        let st = cc.p(), ed = cc.p();
        let delayTime = 3.5;

        for (let i = 0; i < 20; ++i) {

            for (let j = 0; j < 15; ++j) {
                st.x = centers[i % 4].x;
                st.y = centers[i % 4].y;

                ed = ttutil.getTargetPoint(j / 15 * Math.PI * 2, st);

                actions.push(cc.sequence(cc.delayTime(Math.floor(i / 2) * 3.5), cc.place(st), cc.moveTo(cc.pDistance(st, ed) / speed, ed)));
            }
        }

        for (let i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
            });

            fish.runMoveAction(actions[i]);

            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime );
            }
        }
    }

    /**
     * 载入鱼阵15
     * @param data
     */
    loadFishArray15(fishDataArray) {

        let len = fishDataArray.length;
        let radius = (V.h - 200) / 2;
        let rotateSpeed = 1.5 * Math.PI / 180;
        let speed = 150;
        let actions = [];

        let center = [cc.p(), cc.p()];

        center[0].x = V.w - V.w / 4;
        center[0].y = radius + 100;
        center[1].x = V.w / 4;
        center[1].y = radius + 100;

        let radiusArray = [radius, radius - 34.5, radius - 34.5 - 58, radius - 34.5 - 58 - 68, 1];
        let split = [40, 40, 24, 13, 1];

        let oneRingTime = 10;
        let dt = 2;
        let ringNum = 2;
        let type = ttutil.random() % 2;
        for (let i = 0; i < radiusArray.length; ++i) {

            for (let k = 0; k < 2; ++k) {
                let tlen = split[i];
                for (let j = 0; j < tlen; ++j) {
                    /************************************************************************/
                    /* 时间， 圆心， 半径， 起始角度， 顺或逆， 旋转角度， 360度， 则为一个圆，                 */
                    //如果起始角度为0， 则起点在圆心的正上方，
                    /************************************************************************/
                    //static FishRotationAt* create(float duration, const cocos2d::Vec2& center, float radius, float startAngle, bool clockwise = true, float deltaAngle = 360);

                    let fishRotationAt = NewFishRotationAt(oneRingTime * (ringNum + i * 0.2), center[k], radiusArray[i], j / tlen * 360, (k + i) % 2 == 0, 360 * (ringNum + i * 0.2));
                    let radian = (j / tlen + i * 0.2) * 2 * Math.PI + (k + i) % 2 * (Math.PI / 2);
                    let st = cc.p();
                    if ((k + i) % 2 == 0) {
                        st.x = radiusArray[i] * Math.sin(radian) + center[k].x;
                        st.y = radiusArray[i] * Math.cos(radian) + center[k].y;
                    }
                    else {
                        st.x = radiusArray[i] * Math.cos(radian) + center[k].x;
                        st.y = radiusArray[i] * Math.sin(radian) + center[k].y;
                    }

                    if ((k + i) % 2 == 0) {
                        radian = (1 - (j / tlen + i * 0.2 + 0.5)) * 2 * Math.PI;
                        if (type == 1) {
                            radian = Math.PI;
                        }
                        //
                    }
                    else {
                        radian = (j / tlen + i * 0.2) * 2 * Math.PI;
                        if (type == 1) {
                            radian = 0;
                        }
                        //radian = 0;
                    }

                    let ed = ttutil.getTargetPoint(radian, st);

                    let moveto = cc.moveTo(cc.pDistance(st, ed) / speed, ed);
                    actions.push(cc.sequence(fishRotationAt, moveto));
                }
            }
        }

        for (let i = 0; i < len; ++i) {
            let fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this._dealActiveFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
            });

            fish.runMoveAction(actions[i]);

            if (fishData.delayTime < 0) {
                fish.setPastTime(-fishData.delayTime );
            }
        }
    }

    /**
     * 处理自增长的鱼
     * @param data
     * @returns {null}
     */
    doAutoIncrementFish(data) {
        //console.log(JSON.stringify(data))
        for (let i = 0; i < data.length; i++) {
            let autoInc = data[i];
            for (let j = 0; j < this.fishContainer.children.length; j++) {
                let fish = this.fishContainer.children[j].getComponent(ItemFish);
                if (fish.fishID == autoInc.fishID) {
                    (fish  as AutoIncrementFish).setMultipleValue(autoInc.multiple);
                    break;
                }
            }
        }
    }


    getFishByFishID(fishID: number): ItemFish {
        for (let i = 0; i < this.fishContainer.children.length; i++) {
            let fish = this.fishContainer.children[i].getComponent(ItemFish);
            if (fish.fishID == fishID) {
                return fish;
            }
        }
        return null;
    }

    /**
     * todo:捕到鱼
     * @param data
     */
    onCatchFish(data: SCatchFish) {
        let fishID = data.fishID;
        let fish = this.getFishByFishID(fishID);
        if (!fish) {
            console.error("鱼为空" + JSON.stringify(data, null, 4));
            return;
        }

        let multiple = data.multiple;
        let worldPosFish = fish.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let score = data.fishScore;
        let chairID = data.chairID;
        let isSelf = data.chairID == GD.chairID;

        //统计
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (data.chairID == GD.chairID) {
            GD.harvestMoney += data.fishScore;
            GD.catchFishNum[fish.fishKind] = (GD.catchFishNum[fish.fishKind] || 0) + 1;
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        if(DE_BUG){
            let effectLayer = UIManager.instance().getWindow(EM_UIType.eUT_Effect).getComponent(UIEffect);
            effectLayer.activeEffect("bomb", worldPosFish);
            this.onFixScreen();
            // GameEngine.instance().shakeScreen(5, 5);
        }

        //死亡动画播放完后
        let dieAniPlayedCallback = function () {

            if (score > 0) {
                let scoreLayer = UIManager.instance().getWindow(EM_UIType.eUT_Score).getComponent(UIScore);
                scoreLayer.activeScore(score, multiple, worldPosFish, isSelf);
            }

            let coinLayer = UIManager.instance().getWindow(EM_UIType.eUT_Coin).getComponent(UICoin);
            coinLayer.activeCoin(worldPosFish, chairID, multiple, function () {
                let node: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_PlayerInfo);
                let uiPlayerInfo: UIPlayerInfo = node.getComponent(UIPlayerInfo);
                uiPlayerInfo.modifyScore(chairID, score);
            });
        }

        //如果是炸弹类
        if (data.catchFish != null) {
            let catchFishes = data.catchFish;
            let lightningKind = ttutil.random() % LightningKind.Count;
            let len = catchFishes.length;

            for (let i = 0; i < len; ++i) {
                let catchFishData = catchFishes[i];
                let catchFish = this.getFishByFishID(catchFishData.fishID);

                if (catchFish) {
                    catchFish.getComponent(ItemFish).death(null, false, GFishDieAniDT * 2);
                    let worldPosCatchFish = catchFish.node.convertToWorldSpaceAR(cc.Vec2.ZERO);

                    let lightningLayer = UIManager.instance().getWindow(EM_UIType.eUT_Lightning).getComponent(UILightning);
                    lightningLayer.activeLightning({
                        lightningKind: lightningKind,
                        dt: GFishDieAniDT * 2 - 0.2,
                        st: worldPosFish,
                        ed: worldPosCatchFish
                    });

                    //金币
                    let coinLayer = UIManager.instance().getWindow(EM_UIType.eUT_Coin).getComponent(UICoin);
                    coinLayer.activeCoin(worldPosCatchFish, chairID,
                        GD.fishConfig.fishKindConfigArray[catchFish.fishKind].minMultiple / 2, null, false);

                    let catchFishMulLayer = UIManager.instance().getWindow(EM_UIType.eUT_CatchFishMulLayer).getComponent(UICatchFishMul);
                    catchFishMulLayer.activeCatchFishMul(GD.fishConfig.fishKindConfigArray[catchFish.fishKind].maxMultiple,
                        worldPosCatchFish);
                }
                else {
                    console.error("why is not found!");
                }
            }

            fish.death(dieAniPlayedCallback, true, GFishDieAniDT * 2);
            let effectLayer = UIManager.instance().getWindow(EM_UIType.eUT_Effect).getComponent(UIEffect);
            effectLayer.activeEffect("0", worldPosFish);

            if (fish.fishKind == FishKind.LocalBomb || fish.fishKind == FishKind.SuperBomb || fish.isRedFish || fish.fishKind == FishKind.FishKing) {
                effectLayer.activeEffect("bomb", worldPosFish);
                if (fish.isRedFish || fish.fishKind == FishKind.FishKing) {
                    GameEngine.instance().shakeScreen(5, 5);
                } else {
                    GameEngine.instance().shakeScreen();
                }
            }
        }
        //如果是定屏炸弹
        else if (fish.fishKind == FishKind.FixBomb) {
            let effectLayer = UIManager.instance().getWindow(EM_UIType.eUT_Effect).getComponent(UIEffect);
            effectLayer.activeEffect("fixBomb", worldPosFish);
            fish.death(dieAniPlayedCallback);
            this.onFixScreen();
        }
        else {
            if (fish.fishKind >= FishKind.FishKind14) {
                let effectLayer = UIManager.instance().getWindow(EM_UIType.eUT_Effect).getComponent(UIEffect);
                effectLayer.activeEffect("money", worldPosFish);
            }
            fish.death(dieAniPlayedCallback);
        }

        if (multiple > GD.fishConfig.prizeMUL) {
            ttutil.srand(fishID);          //保证各客户端一致
            // GD.mainScene.cannonLayer.cannonArray[chairID].prize.start(ttutil.random() % BingoKind.Count, score);
        }
    }
    /**
     * 随机锁鱼
     */
    getRandomLockFish(oldLockFish: ItemFish) {
        let fishArray = this.fishContainer.children;

        let ex = 0.05;
        if (oldLockFish) {
            let canChoice = false;

            for (let i = 0; i < fishArray.length; ++i) {

                let fish = fishArray[i].getComponent(ItemFish);
                let pos = fishArray[i].getPosition();
                if (canChoice) {
                    if (fish.valid &&
                        (fish.isRedFish || fish.fishKind >= FishKind.FishKind14) &&
                        pos.x > (V.right-V.left) * ex && pos.x < (V.right-V.left) * (1 - ex) && pos.y > V.h * ex && pos.y < V.h * (1 - ex)) {
                        return fish;
                    }
                }

                if (fish == oldLockFish) {
                    canChoice = true;
                }
            }
        }

        for (let i = 0; i < fishArray.length; ++i) {
            let fish = fishArray[i].getComponent(ItemFish);
            let pos = fishArray[i].getPosition();
            if (fish.valid &&
                (fish.isRedFish || fish.fishKind >= FishKind.FishKind14) &&
                pos.x > (V.right-V.left) * ex && pos.x < (V.right-V.left) * (1 - ex) && pos.y > V.h * ex && pos.y < V.h * (1 - ex)) {
                return fish;
            }
        }

        return null;
    }
    //定屏
    onFixScreen() {
        for (let i = 0; i < this.fishContainer.children.length; i++) {
            let element = this.fishContainer.children[i];
            element.pauseAllActions();

            if (!element.getComponent(ItemFish).valid) {
                continue;
            }

            element.getComponent(ItemFish).nodeTrace.getComponent(ItemFishTrace).pauseMove();
        }
    }
    //取消定屏
    cancelFixScreen() {
        for (let i = 0; i < this.fishContainer.children.length; i++) {
            let element = this.fishContainer.children[i];
            element.resumeAllActions();

            if (!element.getComponent(ItemFish).valid) {
                continue;
            }

            element.getComponent(ItemFish).nodeTrace.getComponent(ItemFishTrace).resumeMove();
        }
    }
    logFishLen(){
       console.error("------------- FishLen =  ",this.fishContainer.childrenCount);
    }
}
