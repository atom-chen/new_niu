import PoolManager from "../Manager/PoolManager";
import AniManager from "../Manager/AniManager";
import {AniID} from "../Data/AniData";
import {ttutil} from "../Base/Util";
import {EM_PoolType} from "../Data/PoolData";
import {SpriteAction} from "../Base/SpriteAction";
import {LightningKind} from "../GameData/SubGameMSG";
import {SpriteManager} from "../Manager/SpriteManager";
import {PreLoad_Plist} from "../Data/SpriteData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemLightning extends cc.Component {

    @property(cc.Sprite)
    public sprite: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setAnchorPoint(0, 0.5);
        this.addComponent(SpriteAction).enabled = false;
    }

    // start () {}

    // update (dt) {}

    reuse(lightningKind: number, dt: number, st: cc.Vec2, ed: cc.Vec2) {

        this.sprite.spriteFrame = SpriteManager.instance().getSpriteAtlasFromCache(PreLoad_Plist.Lightning).getSpriteFrame(`res-danaotiangong-lightning-lightning${lightningKind + 1}_01`);
        this.node.setPosition(st);
        this.getComponent(SpriteAction).enabled = false;
        let aniID = 0;

        switch (lightningKind) {
            case LightningKind.LightningKind1:
                aniID = AniID.Lightning1;
                break;
            case LightningKind.LightningKind2:
                aniID = AniID.Lightning2;
                break;
            case LightningKind.LightningKind3:
                aniID = AniID.Lightning3;
                break;
            default:
                return;
        }

        this.node.opacity = 255;
        this.node.setScale(0);
        this.node.rotation = ttutil.calcRotation(st, ed);

        AniManager.instance().buildAnimate(this.node, aniID);

        let scaleX = cc.pDistance(st, ed) / this.node.getContentSize().width;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.1, scaleX, 0.5),
            cc.delayTime(dt),
            cc.spawn(cc.scaleTo(0.1, 0), cc.fadeOut(0.1)),
            cc.callFunc(this.removeSelf.bind(this))
        ));
    }

    removeSelf() {
        this.node.stopAllActions();
        PoolManager.instance().destroyNode(EM_PoolType.ePT_Lightning, this.node);
    }
}
