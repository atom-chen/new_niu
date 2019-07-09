import {V} from "../GameData/Config";
import AniManager from "../Manager/AniManager";
import { AniID } from "../Data/AniData";
import { AudioManager } from "../Manager/AudioManager";
import { SpriteManager } from "../Manager/SpriteManager";
import { UIManager } from "../Manager/UIManager";
import { EM_UIType } from "../Data/UIData";
import { SpriteAction } from "../Base/SpriteAction";
import {EM_SoundType} from "../Data/SoundData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UISwitchScene extends cc.Component {

    @property(cc.Node)
    public Mask: cc.Node = null;

    @property(cc.Sprite)
    public baseSprite: cc.Sprite = null;
    @property(cc.Node)
    public animalNode:cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    baseSprteNodePosX = 0;
    start () {
        this.baseSprteNodePosX =  this.baseSprite.node.getPositionX();
    }

    setSprite(bgIndex:number)
    {
        SpriteManager.instance().setImageSprite(this.baseSprite,  bgIndex);
      //  this.baseSprite.spriteFrame = sp.spriteFrame;
    }

    startToSwitch(data,cb?:()=>void )
    {
        let winSize = cc.director.getWinSize();
        //执行海浪动画
        if(this.animalNode.getComponent(cc.Sprite) == null)
        {
            this.animalNode.addComponent(cc.Sprite);
        }
        AniManager.instance().buildAnimate(this.animalNode, AniID.switch_sence);
        // 播放海浪的声音
        AudioManager.instance().playSound(EM_SoundType.eWAVE);

        this.Mask.setPositionX(winSize.width);
        this.baseSprite.node.setPositionX(this.baseSprteNodePosX-winSize.width);

        let dt:number = 7;

        this.Mask.runAction(cc.moveBy(dt*0.9,cc.p(-winSize.width,0)));
        this.baseSprite.node.runAction(cc.moveBy(dt*0.9,cc.p(winSize.width,0)));
        let self = this;
        let _action = cc.sequence(cc.place(winSize.width * 1.1 / 2, 0), cc.moveTo(dt * 1.1, -winSize.width * 1.3 / 2, 0), cc.callFunc(function () {

            self.animalNode.stopAllActions();
            //  self.animalNode.getComponent(cc.Sprite).destroy();

            //里面直接易主了
            // GD.mainScene.bgLayer.switchBG(self.bgSprite);
            //self.bgSprite.removeFromParent();
            //  self.bgSprite = null;
            self.Mask.setPositionX(winSize.width);
            self.baseSprite.node.setPositionX(self.baseSprteNodePosX - winSize.width);
            //更换背景音乐
            if (cb != null) {
                cb();
            }
        })
        );

        this.animalNode.runAction(_action);
    }


    // update (dt) {}
}
