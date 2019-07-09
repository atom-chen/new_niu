
import { EM_PoolType } from "../Data/PoolData";
import CombinedBaseFish from "./CombinedBaseFish";
import {SpriteManager} from "../Manager/SpriteManager";
import {PreLoad_Plist} from "../Data/SpriteData";
import {SpriteAction} from "../Base/SpriteAction";
import {GOpenShadow} from "../GameData/Config";

/**
 * 大四喜
 */

const {ccclass, property} = cc._decorator;

@ccclass
export class DaSiXiFish extends CombinedBaseFish
{
    onLoad() {
        this._poolType = EM_PoolType.ePT_DaSiXiFish;
        
        this.fishSprite = [];
        this.shadowSprite = [];
        this.dishSprite  =[];
        let sin45 = Math.sin(Math.PI / 4);
        let radius = 120 * sin45;
        let dishPos = [
            cc.p(-radius, 0),
            cc.p(radius, 0),
            cc.p(0, radius),
            cc.p(0, -radius),
        ];

        let atlas: cc.SpriteAtlas = SpriteManager.instance().getSpriteAtlasFromCache(PreLoad_Plist.Fish);
        let dishImg = atlas.getSpriteFrame(`jinchanbuyu-res-fish-dish`);

        for (let i = 0; i < 4; ++i) {
            let dish = this.getFish(null,this.node,0);
            this.dishSprite.push(dish);
            dish.position = dishPos[i];
            let sprite: cc.Sprite = dish.addComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            sprite.spriteFrame = dishImg;
            dish.addComponent(SpriteAction).enabled = false;

            let fish = this.getFish(null,this.node,1);
            fish.position = dishPos[i];
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
        for (let i = 0; i < 4; ++i){
            // this.setFishCompent(this.dishSprite[i],this.fishKind);
            this.setFishCompent(this.fishSprite[i],this.subFishKind);
            if (GOpenShadow) {
                this.setFishCompent(this.shadowSprite[i],this.subFishKind);
            }
        }
        super.initEx();
    }

}
