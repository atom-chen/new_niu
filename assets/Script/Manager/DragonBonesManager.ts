import { DataManager } from "./DataManager";
import {DragonBonesInfo, EM_DragonType} from "../Data/DragonBonesData";
import instantiate = cc.instantiate;

export class DragonBonesManager
{
    private  constructor(){};
    private static s_inst: DragonBonesManager = null;

    public init(){

    }
    public static instance() : DragonBonesManager
    {
        if (DragonBonesManager.s_inst == null)
        {
            DragonBonesManager.s_inst = new DragonBonesManager();
        }
        return DragonBonesManager.s_inst;
    }

    public SetDragonBones(db: dragonBones.ArmatureDisplay|cc.Node, idDragonBones: EM_DragonType|string,cb?): void
    {
        let tempComp ;
        if( db  instanceof dragonBones.ArmatureDisplay){
            tempComp = db as dragonBones.ArmatureDisplay;
        }else {
            tempComp = (db as cc.Node).getComponent(dragonBones.ArmatureDisplay);
            if (!tempComp)
            {
                tempComp = (db as cc.Node).addComponent(dragonBones.ArmatureDisplay);
            }

        }
        let dragonBonesInfo: DragonBonesInfo = DataManager.instance().dragonBones.getDragonBonesInfo(idDragonBones);
        tempComp.node.scale = dragonBonesInfo.fScale;
        cc.loader.loadResDir("DragonBones/" + dragonBonesInfo.strFloder, function(err, assets, urls)
        {
            if(err){
                console.error(`SetDragonBones -- ${dragonBonesInfo.strFloder} err = `,err);
                return;
            }
            for (let i in assets)
            {
                if (assets[i] instanceof dragonBones.DragonBonesAsset)
                {
                    if(!assets[i]){
                        console.error("-------- ",db,idDragonBones,assets[i])
                    }
                    tempComp.dragonAsset = assets[i];
                }
                else if (assets[i] instanceof dragonBones.DragonBonesAtlasAsset)
                {
                    tempComp.dragonAtlasAsset  = assets[i];
                }
            }

            tempComp.armatureName = "armatureName";
            if(dragonBonesInfo.strAnimation){
                tempComp.playAnimation(dragonBonesInfo.strAnimation, dragonBonesInfo.nPlayCount);
            }
            if(cb){
                cb(tempComp);
            }
        })
    }
}
