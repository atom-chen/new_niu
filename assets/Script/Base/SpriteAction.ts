/*
 * todo:序列帧动画组件
 */
import { AniInfo } from "../Data/AniData";
import BaseAction from "./BaseAction";
import {SpriteManager} from "../Manager/SpriteManager";

const {ccclass, property} = cc._decorator;

export class SpriteAction extends BaseAction
{
    private  frames: cc.SpriteFrame[];//已播放的精灵
    private  frameNames: string[];
    private  index: number;
    private  second: number;
    private  sprite: cc.Sprite;
    private  aniInfo: AniInfo;
    private  loopCount: number;  //已循环次数
    private  loopTime: number;      //总循环次数-1表示无限循环

    init(aniInfo: AniInfo)
    {
        this.show();
        this.aniInfo = aniInfo;
        this.frames = [];
        this.frameNames = [];
        this.sprite = this.node.getComponent(cc.Sprite);
        this.sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        // this.sprite.trim = false;

        if (!this.sprite) {
            console.error(`ERROR:SpriteAction ${aniInfo.aniID} have not cc.Sprite`);
        }

        this.second = 0;
        this.loopCount = 0;
        this.loopTime = aniInfo.loopTime;
        if (this.loopTime == 0) {
            this.loopTime = 1;
            console.error(`ERROR:SpriteAction ${aniInfo.aniID} loopTime=0`);
        }

        for (let i = 0; i < aniInfo.num; ++i)
        {
            let index = (i + aniInfo.start).toString();

            if (aniInfo.occupying != 0)
            {
                let zeorNum = aniInfo.occupying - index.length;
                for (let j = 0; j < zeorNum; ++j) {
                    index = "0" + index;
                }
            }

            this.frames.push(null);
            this.frameNames.push(aniInfo.prefix + index);
        }

        this.sprite.spriteFrame = this.frames[0];
    }

    update(dt:number) {
        if (!this.sprite.isValid) {
            this.hide();
            return;
        }

        this.second += dt;

        let index = Math.floor(this.second * this.aniInfo.sample);
        if (index == this.index) return;
        this.index = index;
        if (index < this.frameNames.length) {
            if (this.frames[index]) {
                this.sprite.spriteFrame = this.frames[index];
            } else {
                let frame = null;
                let spriteAtlas = SpriteManager.instance().getSpriteAtlasFromCache(this.aniInfo.plist);

                if (spriteAtlas) {
                    frame = spriteAtlas.getSpriteFrame(this.frameNames[index]);
                } else {
                    console.error(`no spriteAtlas cache ${this.aniInfo.aniID} at ${this.frameNames[index]}`);
                    frame = cc.loader.getRes(this.aniInfo.plist, cc.SpriteAtlas).getSpriteFrame(this.frameNames[index]);
                }

                if (!frame) {
                    console.error(`ERROR:no sprite frame with ${this.frameNames[index]}`);
                } else {
                    this.frames[index] = frame;
                    this.sprite.spriteFrame = frame;
                }
            }

        } else {
            this.loopCount++;
            this.second = 0;

            if (-1 == this.loopTime || this.loopCount < this.loopTime) {
                if (this.frames[0]) {
                    this.sprite.spriteFrame = this.frames[0];
                }
            } else {
                this.hide();
            }
        }
    }

    //获取运行时间
    getTotleTime(): number {
        if (-1 == this.loopTime) {
            console.error(`ERROR:SpriteAction ${this.aniInfo.aniID} ForEver`);
            return 1;
        } else {
            return this.loopTime * this.aniInfo.num / this.aniInfo.sample;
        }
    }


    public getLoopTime(): number {
        return this.loopTime;
    }
    public setLoopTime(value: number) {
        this.loopTime = value;
    }
}
