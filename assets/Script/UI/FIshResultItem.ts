import {SpriteManager} from "../Manager/SpriteManager";
import {PreLoad_Plist} from "../Data/SpriteData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FIshResultItem extends cc.Component {

    @property(cc.Sprite)
    imgFlag: cc.Sprite = null;

    @property(cc.Label)
    lab_info:cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    
    setInfo(index,text)
    {
        this.lab_info.string = text;
        let atlas = SpriteManager.instance().getSpriteAtlasFromCache(PreLoad_Plist.Fish);
        let fishImg = atlas.getSpriteFrame(`jinchanbuyu-res-fish-fish${index + 1}_01`);
        if (null == fishImg) {
            console.error(`not index fishKind ${index}`);
            return;
        }
        let fishContentSize = fishImg.getOriginalSize();
        let fishSize = Math.max(fishContentSize.width, fishContentSize.height);
        let bgSize = this.imgFlag.node.getContentSize().width;
        this.imgFlag.node.setScale(bgSize / fishSize);
        this.imgFlag.spriteFrame = fishImg;
    }
}
