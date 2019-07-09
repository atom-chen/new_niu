import { UIManager } from "../Manager/UIManager";
import { EM_UIType } from "../Data/UIData";
import { AudioManager } from "../Manager/AudioManager";
import UIPlayerInfo from "./UIPlayerInfo";
import GameEngine from "../Base/GameEngine";
import {subGameMSG} from "../GameData/SubGameMSG";
import GD = require('../GD');
import {EM_SoundType} from "../Data/SoundData";

;
const {ccclass, property} = cc._decorator;

@ccclass
export default class CannonButton extends cc.Component
{
    public onBtnAddCost(): void
    {
        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);
        let userItem = GD.clientKernel.getMeUserItem();
        let nCount: number = GD.fishConfig.cannonKindConfigArray.length;
        userItem.nCannonIndex = (userItem.nCannonIndex + 1) % nCount;

        let  uiPlayerInfo: UIPlayerInfo = UIManager.instance().getWindowScript<UIPlayerInfo>(EM_UIType.eUT_PlayerInfo,UIPlayerInfo);
        uiPlayerInfo.ctrlUser.setCannonIndex(userItem.nCannonIndex, userItem.bSuperBullet);
        GameEngine.instance().sendGameData(subGameMSG.SUB_C_CHANGE_MULTIPLE, {cannonIndex:userItem.nCannonIndex});
    }

    public onBtnSubCost(): void
    {
        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);
        let userItem = GD.clientKernel.getMeUserItem();
        let nCount: number = GD.fishConfig.cannonKindConfigArray.length;
        userItem.nCannonIndex = (userItem.nCannonIndex + nCount - 1) % nCount;

        let  uiPlayerInfo: UIPlayerInfo = UIManager.instance().getWindowScript<UIPlayerInfo>(EM_UIType.eUT_PlayerInfo,UIPlayerInfo);
        uiPlayerInfo.ctrlUser.setCannonIndex(userItem.nCannonIndex, userItem.bSuperBullet);
        GameEngine.instance().sendGameData(subGameMSG.SUB_C_CHANGE_MULTIPLE, {cannonIndex:userItem.nCannonIndex});
    }
}
