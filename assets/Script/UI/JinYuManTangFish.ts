import CombinedBaseFish from "./CombinedBaseFish";
import {EM_PoolType} from "../Data/PoolData";
import {GOpenShadow} from "../GameData/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class JinYuManTangFish extends CombinedBaseFish {
    onLoad() {
        this._poolType = EM_PoolType.ePT_JinYuManTangFish;
        this.fishSprite =[];
        this.shadowSprite =[];
        this.dishSprite = this.getFish(null,this.node,0);
        for (let i = 0; i < 5; ++i){

            this.fishSprite[i]=this.getFish(null,this.node,2);
            if(!this.fishSprite[i]) return;

            this.fishSprite[i].setScale(1);

            //設置起始位置
            if(i==0) this.fishSprite[i].position = new cc.Vec2(-60,60);
            else if(i==1) this.fishSprite[i].position = new cc.Vec2(60,60);
            else if(i==2) this.fishSprite[i].position = new cc.Vec2(0,0);
            else if(i==3) this.fishSprite[i].position = new cc.Vec2(-60,-60);
            else this.fishSprite[i].position = new cc.Vec2(60,-60);
            this.fishSprite[i].setColor(cc.color(255, 255, 255));
            this.fishSprite[i].setOpacity(255);
            this.fishSprite[i].setRotation(0);

            if (GOpenShadow) {
                this.shadowSprite[i]=this.getFish(null,this.node,1);
                if(!this.shadowSprite[i]) return;

                this.shadowSprite[i].setScale(1);

                //設置起始位置
                if(i==0) this.shadowSprite[i].position = new cc.Vec2(-60,60);
                else if(i==1) this.shadowSprite[i].position = new cc.Vec2(-60,60);
                else if(i==2) this.shadowSprite[i].position = new cc.Vec2(-60,60);
                else if(i==3) this.shadowSprite[i].position = new cc.Vec2(-60,60);
                else this.shadowSprite[i].position = new cc.Vec2(60-20,-60+20);
                this.shadowSprite[i].setColor(cc.color(0, 0, 0));
                this.shadowSprite[i].setOpacity(50);
                this.shadowSprite[i].setRotation(0);
            }
        }
    }

    initEx() {
        this.setFishCompent(this.dishSprite,this.fishKind);
        for (let i = 0; i < 5; ++i){
            this.setFishCompent(this.fishSprite[i],this.subFishKind[i]);
            if (GOpenShadow) {
                this.setFishCompent(this.shadowSprite[i],this.subFishKind[i]);
            }
        }
         super.initEx();
    }
}
