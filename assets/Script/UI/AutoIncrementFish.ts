import { SingleFish } from "./SingleFish";
import { EM_PoolType } from "../Data/PoolData";
import {FishKind} from "../GameData/SubGameMSG";
import GD = require('../GD');
/**
 * 自增长的鱼
 */

const {ccclass, property} = cc._decorator;

@ccclass
export class AutoIncrementFish extends SingleFish
{
    @property(cc.Label)
    public multipleLabel: cc.Label = null;

    onLoad() {
        this._poolType = EM_PoolType.ePT_AutoIncrementFish;
    }

    setMultipleValue(multipleValue) {
        this.multipleLabel.node.position = cc.p( 0, this.fishSprite.getContentSize().height * 0.5);
        this.multipleLabel.string = multipleValue;
        this.multipleLabel.node.zIndex = 10;//数字被盖住了
    }
    initEx() {
        super.initEx();
        this.multipleLabel.node.position = cc.p( 0, this.fishSprite.getContentSize().height * 0.5);
        this.multipleLabel.string = `${GD.fishConfig.fishKindConfigArray[FishKind.AutoIncrement].minMultiple}`;
        this.multipleLabel.node.zIndex = 10;
    }
}
