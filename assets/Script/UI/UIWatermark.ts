import { AniID, AniInfo } from "../Data/AniData";
import AniManager from "../Manager/AniManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIWatermark extends cc.Component {

    @property(cc.Prefab)
    public wmNode: cc.Prefab = null;

    @property(cc.Node)
    public watermarkContainer: cc.Node = null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let size: cc.Size = this.node.getContentSize();
        
        let scale = 1;
        let SIZE = 512 * scale;
        let widthNum = Math.ceil(size.width / SIZE);
        let heightNum = Math.ceil(size.height / SIZE);

        for (let i = 0; i < widthNum; i++) {
            for (let j = 0; j < heightNum; j++) {
                let newNode = cc.instantiate(this.wmNode);
                newNode.setAnchorPoint(0, 0);
                newNode.setScale(scale);
                this.watermarkContainer.addChild(newNode);
                newNode.setPosition(i * SIZE, j * SIZE);
                AniManager.instance().buildAnimate(newNode, AniID.water_wave);
            }
        }

        // this.watermarkContainer.setCascadeColorEnabled(true);
        // this.watermarkContainer.setCascadeOpacityEnabled(true);
        // this.watermarkContainer.color = cc.color(0xaa, 0xaa, 0xaa, 0xff);
    }

    // update (dt) {}
}
