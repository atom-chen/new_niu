import { AniID, AniInfo } from "../Data/AniData";
import { DataManager } from "./DataManager";
import { SpriteAction } from "../Base/SpriteAction";

export default class AniManager
{
    private  constructor(){};
    private static s_inst: AniManager = null;
    private _spriteAtlasCache: {[index: string]: cc.SpriteAtlas} = null;

    public static instance() : AniManager
    {
        if (AniManager.s_inst == null)
        {
            AniManager.s_inst = new AniManager();
        }
        return AniManager.s_inst;
    }

    public init()
    {
    }

    public destory()
    {
        AniManager.s_inst = null;
    }


    ////////////////动画
    public buildAnimate(node: cc.Node, idAni: AniID): SpriteAction
    {
        let spriteAction = node.getComponent(SpriteAction);
        if (null == spriteAction) {
            spriteAction = node.addComponent(SpriteAction);    
        }

        let aniInfo: AniInfo = DataManager.instance().ani.getAniInfo(idAni);
        if (null == aniInfo)
        {
            console.error("Error: Not Ani" + idAni);
            return null;
        }

        spriteAction.init(aniInfo);
        return spriteAction;
    }
    public buildFishDieAnimate(node: cc.Node, fishKind: number, num: number, interval: number, occupying: number)
    {
        let spriteAction = node.getComponent(SpriteAction);
        if (null == spriteAction) {
            console.error(`buildAnimate node without SpriteAction fishKind(${fishKind})`);
            spriteAction = node.addComponent(SpriteAction);
        }

        interval = interval || 1 / 10;

        let aniInfo: AniInfo = {
            aniID: AniID.FishKind1_live,
            prefix: `jinchanbuyu-res-fishdie-fish${fishKind+1}_die_`,
            num: num,
            sample: 1 / interval,
            occupying: occupying,
            start: 1,
            plist: "Texture/oldRes/fish",
            loopTime: -1,
        };

        spriteAction.init(aniInfo);
        return spriteAction;
    }

    public buildFishLiveAnimate(node: cc.Node, fishKind: number, num: number, interval: number, occupying: number): SpriteAction
    {
        let spriteAction = node.getComponent(SpriteAction);
        if (null == spriteAction) {
            console.log(`buildAnimate node without SpriteAction fishKind(${fishKind})`);
            spriteAction = node.addComponent(SpriteAction);
        }

        interval = interval || 1 / 10;

        let aniInfo: AniInfo = {
            aniID: AniID.FishKind1_live,
            prefix: `jinchanbuyu-res-fish-fish${fishKind+1}_`,
            num: num,
            sample: 1 / interval,
            occupying: occupying,
            start: 1,
            plist: "Texture/oldRes/fish",
            loopTime: -1,
        };

        spriteAction.init(aniInfo);
        return spriteAction;
    }
}

