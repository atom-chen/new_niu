import CombinedBaseFish from "./CombinedBaseFish";
import {EM_PoolType} from "../Data/PoolData";
import {GOpenShadow} from "../GameData/Config";
import {SpriteManager} from "../Manager/SpriteManager";
import {PreLoad_Plist} from "../Data/SpriteData";
import {SpriteAction} from "../Base/SpriteAction";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FishKingFish extends CombinedBaseFish {
    onLoad() {
        this._poolType = EM_PoolType.ePT_FishKingFish;
        this.fishSprite =[];
        this.shadowSprite =[];
        this.dishSprite =[];
        let atlas: cc.SpriteAtlas = SpriteManager.instance().getSpriteAtlasFromCache(PreLoad_Plist.Fish);
        let dishImg = atlas.getSpriteFrame(`jinchanbuyu-res-fish-dish`);
        for (let i = 0; i < 1; ++i){

            let dish = this.getFish(null,this.node,0);
            this.dishSprite.push(dish);
            let sprite: cc.Sprite = dish.addComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            sprite.spriteFrame = dishImg;
            dish.addComponent(SpriteAction).enabled = false;

            let fish = this.getFish(null,this.node,1);
            sprite = fish.addComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            this.fishSprite.push(fish);
            fish.addComponent(SpriteAction).enabled = false;

            if (GOpenShadow) {
                let shadow = this.getFish(null,this.node,-1);
                shadow.position = cc.p(20, -20);
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
        this.setFishCompent(this.fishSprite[0],this.subFishKind);
        if (GOpenShadow) {
            this.setFishCompent(this.shadowSprite[0],this.subFishKind);
        }
         super.initEx();
    }
}
