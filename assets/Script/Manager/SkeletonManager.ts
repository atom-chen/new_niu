import { DataManager } from "./DataManager";
import {EM_SkeleType, SkeletonInfo} from "../Data/SkeletonData";

const {ccclass, property} = cc._decorator;

@ccclass
export class SkeletonManager
{
    private  constructor(){};
    private static s_inst: SkeletonManager = null;
    public init(){

    }
    public static instance() : SkeletonManager
    {
        if (SkeletonManager.s_inst == null)
        {
            SkeletonManager.s_inst = new SkeletonManager();
        }
        return SkeletonManager.s_inst;
    }

    public playAnimation(nodeOrComp: sp.Skeleton|cc.Node, idSkeleton: EM_SkeleType|string,cb?): void
    {
        let tempComp ;
        if( nodeOrComp  instanceof sp.Skeleton){
            tempComp = nodeOrComp as sp.Skeleton;
        }else {
            tempComp = (nodeOrComp as cc.Node).getComponent(sp.Skeleton);
            if (!tempComp)
            {
                tempComp = (nodeOrComp as cc.Node).addComponent(sp.Skeleton);
            }

        }
        let skeletonInfo: SkeletonInfo = DataManager.instance().skeleton.getSkeletonInfo(idSkeleton);
        if(!skeletonInfo){
            console.error("????????? ---- ",skeletonInfo,idSkeleton)
        }
        tempComp.node.scale = skeletonInfo.fScale;
        cc.loader.loadRes("Skeleton/" + skeletonInfo.strPath, sp.SkeletonData, function(err, skeletonData)
        {
            if(err){
                console.error(`playAnimation -- ${skeletonInfo.strPath} err = `,err);
                return;
            }

            tempComp.enabled = true;
            tempComp.skeletonData = skeletonData;
            tempComp.setAnimation(0, skeletonInfo.strName, skeletonInfo.bLoop);

            if(cb){
                cb(tempComp);
            }
            //需要释放？
            // cc.loader.releaseAsset(skeletonData);
        });
    }

    public clearAnimation(node: cc.Node): void
    {
        let skeleton: sp.Skeleton = node.getComponent(sp.Skeleton);
        if (skeleton)
        {
            skeleton.setCompleteListener(null);
            skeleton.enabled = false;
            skeleton.clearTracks();
            node.removeComponent(sp.Skeleton);
            skeleton.destroy();
        }
    }
}
