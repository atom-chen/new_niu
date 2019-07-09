import CombinedBaseFish from "./CombinedBaseFish";
import {EM_PoolType} from "../Data/PoolData";
import {GOpenShadow} from "../GameData/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LightFish extends CombinedBaseFish {
    onLoad() {
        this._poolType = EM_PoolType.ePT_LightFish;
        this.fishSprite =[];
        this.shadowSprite =[];
        this.dishSprite = this.getFish(null,this.node,0);
        for (let i = 0; i < 1; ++i){

            this.fishSprite[i]=this.getFish(null,this.node,2);
            if(!this.fishSprite[i]) return;

            this.fishSprite[i].setScale(1);

            this.fishSprite[0].setColor(cc.color(255, 255, 255));
            this.fishSprite[0].setOpacity(255);
            this.fishSprite[0].setRotation(0);

            if (GOpenShadow) {
                this.shadowSprite[i]=this.getFish(null,this.node,1);
                if(!this.shadowSprite[i]) return;

                this.shadowSprite[i].setScale(1);


                //設置起始位置
                // var size = this.size();
                this.shadowSprite[0].position = new cc.Vec2(-20,+20);
                this.shadowSprite[0].setColor(cc.color(0, 0, 0));
                this.shadowSprite[0].setOpacity(50);
                this.shadowSprite[0].setRotation(0);
            }
        }
    }

    initEx() {
        this.setFishCompent(this.dishSprite,this.fishKind);
        this.setFishCompent(this.fishSprite[0],this.subFishKind);
        if (GOpenShadow) {
            this.setFishCompent(this.shadowSprite[0],this.subFishKind);
        }
         super.initEx();
    }
}
