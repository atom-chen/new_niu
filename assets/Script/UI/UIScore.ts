import PoolManager from "../Manager/PoolManager";
import { EM_PoolType } from "../Data/PoolData";
import ItemScore from "./ItemScore";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIScore extends cc.Component {

    @property(cc.Node)
    public scoreContainer: cc.Node = null;


    /**
     * 激活分数
     */
    activeScore(score, multiple, pos, isSelf) {

        let scoreLabel = PoolManager.instance().createNode(EM_PoolType.ePT_Score);
        this.scoreContainer.addChild(scoreLabel);
        scoreLabel.position = pos;
        scoreLabel.getComponent(ItemScore).reuse();
        scoreLabel.setScale(0.8 + Math.min(0.5, multiple / 100));

        let nScore = score;
        scoreLabel.getComponent(ItemScore).setScore(nScore, isSelf);

        let rotation = 0;
        let moveByY = 50;
        //TODO:看下是否需要旋转
        // if (GD.isRotation) {
        //     rotation = 180;
        //     moveByY = -50;
        // }
        scoreLabel.rotation = rotation;
        scoreLabel.opacity = 0;

        let itemScore = scoreLabel.getComponent(ItemScore);
        let action = cc.sequence(
            cc.fadeIn(0.1),
            cc.moveBy(0.2, 0, moveByY).easing(cc.easeSineOut()),
            //cc.delayTime(0.5),
            cc.spawn(
                cc.reverseTime(cc.moveBy(0.3, 0, moveByY)),
                cc.sequence(cc.delayTime(1.3), cc.fadeOut(1))
            ),

            cc.callFunc(itemScore.removeSelf.bind(itemScore))
        );

        scoreLabel.runAction(action);
    }
}

