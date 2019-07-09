import { IData } from "./IData";

export enum EM_DragonType {
    eDragon_Cannon1_1,
    eDragon_Cannon1_2,
    eDragon_Cannon2_1,
    eDragon_Cannon2_2,
    eDragon_Cannon3_1,
    eDragon_Cannon3_2,
}
export class DragonBonesInfo
{
    public strFloder: string = null;    //骨骼动画文件夹
    public strAnimation: string = null; //初始动画
    public  nPlayCount = 1;              // 0无限播放
    public fScale: number = 0;          //缩放比例
}

type DRAGON_BONES_INFO_MAP = {[idDragonBones: string]: DragonBonesInfo};

export class DragonBonesData extends IData
{
    private m_mapDragonBonesInfo: DRAGON_BONES_INFO_MAP = {};

    public init(): void
    {
        this.addDragonBonesInfo(EM_DragonType.eDragon_Cannon1_1, "Cannon1_1", 'Animation2', 1,1);
        this.addDragonBonesInfo(EM_DragonType.eDragon_Cannon1_2, "Cannon1_2", 'Animation2', 1,1);
        this.addDragonBonesInfo(EM_DragonType.eDragon_Cannon2_1, "Cannon2_1", 'Animation2', 1,1);
        this.addDragonBonesInfo(EM_DragonType.eDragon_Cannon2_2, "Cannon2_2", 'Animation2', 1,1);
        this.addDragonBonesInfo(EM_DragonType.eDragon_Cannon3_1, "Cannon3_1", 'Animation2', 1,1);
        this.addDragonBonesInfo(EM_DragonType.eDragon_Cannon3_2, "Cannon3_2", 'Animation2', 1,1);

        this.addDragonBonesInfo("xiaolvyu", "xiaolvyu", 'idle', 1.2);
        this.addDragonBonesInfo("xiaolvyu2", "xiaolvyu2", 'idle', 1.2);
        this.addDragonBonesInfo("xiaolanyu", "xiaolanyu", 'idle', 1);
        this.addDragonBonesInfo("buyu8", "buyu8", 'idle', 1);
        this.addDragonBonesInfo("buyu10", "buyu10", 'idle', 0.9);
        this.addDragonBonesInfo("xiaochouyu", "xiaochouyu", 'idle', 0.95);
        this.addDragonBonesInfo("hetun", "hetun", 'idle', 1);
        this.addDragonBonesInfo("buyu13", "buyu13", 'idle', 0.8);
        this.addDragonBonesInfo("denglongyu", "denglongyu", 'idle', 1);
        this.addDragonBonesInfo("xiaohaigui", "xiaohaigui", 'idle', 0.9);
        this.addDragonBonesInfo("houtouyu", "houtouyu", 'idle', 0.9);
        this.addDragonBonesInfo("buyu7", "buyu7", 'idle', 1);
        this.addDragonBonesInfo("shandianmenu", "shandianmenu", 'idle', 0.7);
    }
    private addDragonBonesInfo(idDragonBones: EM_DragonType|string, strFloder: string, strAnimation: string, fScale: number,nPlayCount:number =0) :void
    {
        let dragonBonesInfo: DragonBonesInfo = new DragonBonesInfo();
        dragonBonesInfo.strFloder = strFloder;
        dragonBonesInfo.strAnimation = strAnimation;
        dragonBonesInfo.fScale = fScale;
        dragonBonesInfo.nPlayCount = nPlayCount;

        this.m_mapDragonBonesInfo[idDragonBones] = dragonBonesInfo;
    }

    public getDragonBonesInfo(idDragonBones: number|string): DragonBonesInfo
    {
        if(null == this.m_mapDragonBonesInfo[idDragonBones]){
            console.error(`getDragonBonesInfo err ---------- ${idDragonBones}`)
        }
        return this.m_mapDragonBonesInfo[idDragonBones];
    }
}
