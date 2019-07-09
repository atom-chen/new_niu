
import { EM_UIType } from "../Data/UIData";
import { EM_PoolType } from "../Data/PoolData";
import { AudioManager } from "../Manager/AudioManager";
import {UIManager} from "../Manager/UIManager";
import UIPlayerInfo from "./UIPlayerInfo";
import PoolManager from "../Manager/PoolManager";
import {CoinKind} from "../GameData/SubGameMSG";
import ItemCoin from "./ItemCoin";
import {EM_SoundType} from "../Data/SoundData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UICoin extends cc.Component {

    @property(cc.Node)
    public coinContainer: cc.Node = null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {}
    
    // update (dt) {}

    /**
     *
     * @param pos       鱼的位置
     * @param score     打中的分数
     * @param chairID   椅子ID
     */
    activeCoin(pos, chairID, multiple, callback, isPlaySound?) {

        isPlaySound = isPlaySound == null ? true : isPlaySound;
        
        let node: cc.Node = UIManager.instance().getWindow(EM_UIType.eUT_PlayerInfo);
        let uiPlayerInfo: UIPlayerInfo = node.getComponent(UIPlayerInfo);
        let targetPos: cc.Vec2 = uiPlayerInfo.getScoreWorldPos(chairID);
        targetPos = this.coinContainer.convertToNodeSpaceAR(targetPos);
        
        this.buildCoin(pos, targetPos, chairID, multiple, callback, isPlaySound);
    }

    buildCoin(pos, targetPos, chairID, multiple, callback, isPlaySound) {
        //是否为金币
        let isGold;
        let count = 0;

        if (multiple < 10) {
            isGold = false;
            count = multiple;
        }
        else {
            isGold = true;
            if (multiple < 50) {
                count = (multiple + 4) / 5;
            }
            else {
                count = 10;
            }
        }

        let sum = Math.ceil(count);

        for (let i = 0; i < sum; ++i) {
            let st = cc.p()
            let ed = cc.p();

            st.x = pos.x + (i - count / 2) * 50;
            st.y = pos.y;
            ed.x = targetPos.x;
            ed.y = targetPos.y;

            let coinKind;
            if (isGold) {
                coinKind = CoinKind.CoinKind2;
            }
            else {
                coinKind = CoinKind.CoinKind1;
            }

            let coin = PoolManager.instance().createNode(EM_PoolType.ePT_Coin);
            this.coinContainer.addChild(coin);

            if (i == sum - 1) {
                coin.getComponent(ItemCoin).reuse(coinKind, ed, st, i * 0.05, callback);
            } else {
                coin.getComponent(ItemCoin).reuse(coinKind, ed, st, i * 0.05);
            }
        }

        if (isPlaySound) {
            if (isGold) {
                AudioManager.instance().playSound(EM_SoundType.EFFECT_COLLECT_COIN);
            }
            else {
                AudioManager.instance().playSound(EM_SoundType.EFFECT_DROP_COIN);
            }
        }
    }

    /**
     * 获取金币排列布局
     * @param num
     * @param pos
     */
    getCoinLayout(coins, pos) {

        let sum = coins.coin1 + coins.coin5 + coins.coin10;
        let size = sum / 3 * 30 + 10;
        let layout = [];
        for (let i = 0; i < sum; ++i) {
            layout.push(
                cc.p(
                    pos.x + (Math.random() - 0.5) * size,
                    pos.y + (Math.random() - 0.5) * size
                )
            );
        }
        return layout;
    }

    /**
     * 通过分数， 倍数， 计算显示多少金币
     * @param score
     */
    getCoinType(score, multiple) {
        console.error('UICoin.getCoinType Not Implement');
    }
}
