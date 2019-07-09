import { AudioManager } from "../Manager/AudioManager";
import { EM_UIType } from "../Data/UIData";
import {UIManager, ZORDER_top} from "../Manager/UIManager";
import {EM_SoundType} from "../Data/SoundData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UISetting extends cc.Component
{
    @property(cc.Button)
    btn_show:cc.Button = null;
    @property(cc.Button)
    btn_hide:cc.Button = null;
    @property(cc.Node)
    nd_show:cc.Node = null;
    @property(cc.Button)
    btn_musice_on:cc.Button = null;
    @property(cc.Button)
    btn_musice_off:cc.Button = null;
    @property(cc.Button)
    btn_sound_on:cc.Button = null;
    @property(cc.Button)
    btn_sound_off:cc.Button = null;
    @property(cc.Button)
    btn_back:cc.Button = null;

    start () {
        this.btn_show.node.active = true;
        this.btn_hide.node.active = false;
        this.nd_show.active = false;
        let vol:number = AudioManager.instance().getMusicVolume();
        if(vol <= 0)
        {
            this.btn_musice_off.node.active = true;
            this.btn_musice_on.node.active = false;
        }
        else
        {
            this.btn_musice_off.node.active = false;
            this.btn_musice_on.node.active = true;
        }

        vol = AudioManager.instance().getSoundVolume();
        if(vol <= 0)
        {
            this.btn_sound_off.node.active = true;
            this.btn_sound_on.node.active = false;
        }
        else
        {
            this.btn_sound_off.node.active = false;
            this.btn_sound_on.node.active = true;
        }
    }

    onBtnshowClick()
    {


        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);

        this.nd_show.active = true;

        this.btn_show.node.active = false;
        this.btn_hide.node.active = true;
    }

    onBtnHideClick()
    {
        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);
        this.nd_show.active = false;
        this.btn_show.node.active = true;
        this.btn_hide.node.active = false;
    }

    
    onBtnMusicONClick()
    {
        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);
        this.btn_musice_off.node.active = true;
        this.btn_musice_on.node.active = false;
        AudioManager.instance().setMusicVolume(0);
    }

    onBtnMusicOffClick()
    {
        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);
        this.btn_musice_off.node.active = false;
        this.btn_musice_on.node.active = true;
        AudioManager.instance().setMusicVolume(1);
    }

    onBtnSoundsONClick()
    {
        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);
        this.btn_sound_off.node.active = true;
        this.btn_sound_on.node.active = false;      
        AudioManager.instance().setSoundVolume(0);

    }

    onBtnSoundsOffClick()
    {
        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);
        this.btn_sound_off.node.active = false;
        this.btn_sound_on.node.active = true;
        AudioManager.instance().setSoundVolume(1);
    }

    onBtnbackClick()
    {
        AudioManager.instance().playSound(EM_SoundType.eBtn_Click);
        UIManager.instance().openWindow(EM_UIType.eUT_UIResult,null,ZORDER_top);
    }


}
