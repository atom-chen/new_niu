
import { EM_PoolType } from "../Data/PoolData";
import CombinedBaseFish from "./CombinedBaseFish";
import {SpriteAction} from "../Base/SpriteAction";
import {GOpenShadow} from "../GameData/Config";
import {SpriteManager} from "../Manager/SpriteManager";
import {PreLoad_Plist} from "../Data/SpriteData";

/**
 * 大三元
 */

const {ccclass, property} = cc._decorator;

@ccclass
export class DaSanYuanFish extends CombinedBaseFish
{
    onLoad() {

        this._poolType = EM_PoolType.ePT_DaSanYuanFish;

        this.fishSprite = [];
        this.shadowSprite = [];
        this.dishSprite  =[];
        let sin60 = Math.sin(Math.PI / 3);

        let radius = 60 / sin60;
        let dishPos = [
            cc.p(-sin60 * radius, -radius / 2),
            cc.p(sin60 * radius, -radius / 2),
            cc.p(0, radius),
        ];

        let atlas: cc.SpriteAtlas = SpriteManager.instance().getSpriteAtlasFromCache(PreLoad_Plist.Fish);
        let dishImg = atlas.getSpriteFrame(`jinchanbuyu-res-fish-dish`);

        for (let i = 0; i < 3; ++i) {
            let dish = this.getFish(null,this.node,0);
            this.dishSprite.push(dish);
            dish.position = dishPos[i];
            let sprite: cc.Sprite = dish.addComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            sprite.spriteFrame = dishImg;
            dish.addComponent(SpriteAction).enabled = false;

            let fish = this.getFish(null,this.node,1);
            fish.position = dishPos[i];
            sprite = fish.addComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            this.fishSprite.push(fish);
            fish.addComponent(SpriteAction).enabled = false;

            if (GOpenShadow) {
                let shadow = this.getFish(null,this.node,-1);
                shadow.position = cc.pAdd(dishPos[i], cc.p(20, -20));
                shadow.color = cc.color(0, 0, 0);
                shadow.opacity = 90;
                sprite = shadow.addComponent(cc.Sprite);
                sprite.sizeMode = cc.Sprite.SizeMode.RAW;
                this.shadowSprite.push(shadow);
                shadow.addComponent(SpriteAction).enabled = false;
            }
        }
    }

    initEx() {
        let size = this.fishSprite[0].getContentSize();
        this.node.setContentSize(size.width * 2, size.height * 2);
        for (let i = 0; i < 3; ++i){
            // this.setFishCompent(this.dishSprite[i],this.fishKind);
            this.setFishCompent(this.fishSprite[i],this.subFishKind);
            if (GOpenShadow) {
                this.setFishCompent(this.shadowSprite[i],this.subFishKind);
            }
        }
        super.initEx();
    }

}
