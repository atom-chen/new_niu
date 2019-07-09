import { EM_UIType } from "../Data/UIData";
import GD = require('../GD');
import {FishKind} from "../GameData/SubGameMSG";
import {UIManager} from "../Manager/UIManager";
import FIshResultItem from "./FIshResultItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIResult extends cc.Component {

    @property(cc.Node)
    content:cc.Node = null;
    @property(cc.Prefab)
    itemPrefab:cc.Prefab = null;
    @property(cc.Label)
    harvestMoney:cc.Label = null;
    @property(cc.Label)
    Paymoney:cc.Label = null;

    onEnable()
    {
        if(this.content != null)
        {
            this.content.removeAllChildren();
        }
        for (let i = 0; i <= FishKind.FishKing; ++i)
        {
            let num = 0;
            if(GD.catchFishNum[i] != null)
            {
                num = GD.catchFishNum[i];
            }
            let sinfo ="×" + num.toString(); 
            this.newItem(sinfo,i);
        }
        let num = GD.harvestMoney;
        if(num != null)
        {
            this.harvestMoney.string = num;
        }
        num = GD.payMoney;
        if(num != null)
        {
            this.Paymoney.string = num;
        }
    }


    newItem(sInfo,fishKind)
    {
        let item = cc.instantiate(this.itemPrefab);
        let fishItem = item.getComponent(FIshResultItem);
        fishItem.setInfo(fishKind,sInfo);
        this.content.addChild(item);
    }


    onClose()
    {
        UIManager.instance().closeWindow(EM_UIType.eUT_UIResult,true);
    }
    
    onSureBack()
    {
        // GD.clientKernel.
    }

}
