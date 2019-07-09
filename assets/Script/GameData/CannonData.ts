import { IData } from "../Data/IData";
import { AniID } from "../Data/AniData";
import {EM_DragonType} from "../Data/DragonBonesData";
import {EM_SpriteType} from "../Data/SpriteData";

/**
 * 炮的定义
 */
export enum CannonKind
{
    CannonKind1 = 1,
    CannonKind2 = 2,
    CannonKind3 = 3,
}

//大炮等级
export class CannonLevel
{
    public idDragonBones: number|string = 0;       //骨骼动画
    public idSpriteBulletStart: number|string = 0; //普通子弹的起始精灵
    public idSpriteSuperBullet: number|string = 0; //魔能炮的子弹
    public eNetAni: AniID = AniID.None;     //渔网动画id
}

export class CannonInfo
{
    public szCannonLevel: CannonLevel[] = [];
}

export type CANNON_INFO_MAP = {[idCannon: number]: CannonInfo};

export class CannonData extends IData
{
    private m_mapCannonInfo: CANNON_INFO_MAP = {};

    public init(): void
    {
        this.addCannonInfo(1, EM_DragonType.eDragon_Cannon1_1, EM_SpriteType.bullet_1, EM_SpriteType.bullet_1, AniID.fishNet1);
        this.addCannonInfo(1, EM_DragonType.eDragon_Cannon1_2, EM_SpriteType.bullet_1, EM_SpriteType.bullet_1_2, AniID.fishNet1);
        this.addCannonInfo(2, EM_DragonType.eDragon_Cannon2_1, EM_SpriteType.bullet_2, EM_SpriteType.bullet_2, AniID.fishNet2);
        this.addCannonInfo(2, EM_DragonType.eDragon_Cannon2_2, EM_SpriteType.bullet_2, EM_SpriteType.bullet_2_2, AniID.fishNet2);
        this.addCannonInfo(3, EM_DragonType.eDragon_Cannon3_1, EM_SpriteType.bullet_3, EM_SpriteType.bullet_3, AniID.fishNet3);
        this.addCannonInfo(3, EM_DragonType.eDragon_Cannon3_2, EM_SpriteType.bullet_3, EM_SpriteType.bullet_3_2, AniID.fishNet3);
    }

    private addCannonInfo(idCannon: number, idDragonBones: EM_DragonType|string, idSpriteBulletStart: number, idSpriteSuperBullet: number, eNetAni: AniID): void
    {
        let cannonLevel: CannonLevel = new CannonLevel();
        cannonLevel.idDragonBones = idDragonBones;
        cannonLevel.idSpriteBulletStart = idSpriteBulletStart;
        cannonLevel.idSpriteSuperBullet = idSpriteSuperBullet;
        cannonLevel.eNetAni = eNetAni;
        
        let cannonInfo: CannonInfo = this.m_mapCannonInfo[idCannon];
        if (cannonInfo == null)
        {
            cannonInfo = new CannonInfo();
            this.m_mapCannonInfo[idCannon] = cannonInfo;
        }
        cannonInfo.szCannonLevel.push(cannonLevel);
    }

    public getCannonLevel(idCannon: number, nLevel: number): CannonLevel
    {
        let cannonInfo: CannonInfo = this.m_mapCannonInfo[idCannon];
        if(null == cannonInfo){
            console.error(`getCannonLevel err idCannon = ${idCannon},nLevel = ${nLevel}`)
        }
        return cannonInfo.szCannonLevel[nLevel];
    }
}
