import { DataManager } from "./DataManager";
import { SpriteInfo } from "../Data/SpriteData";

export class SpriteManager {
    private constructor() { };
    private static s_inst: SpriteManager = null;
    //预加载图集资源
    private _spriteAtlasCache: { [index: string]: cc.SpriteAtlas } = null;

    public static instance(): SpriteManager {
        if (SpriteManager.s_inst == null) {
            SpriteManager.s_inst = new SpriteManager();
        }
        return SpriteManager.s_inst;
    }

    public setImageSprite(image: cc.Sprite, idSprite: number | string, callBack?): void {
        let spriteInfo: SpriteInfo = DataManager.instance().sprite.getSpriteInfo(idSprite);
        if (spriteInfo == null) {
            return;
        }

        if (!spriteInfo.strPlist) {
            cc.loader.loadRes("Texture/" + spriteInfo.strName, cc.SpriteFrame, function (err, spriteFrame) {
                image.spriteFrame = spriteFrame;
                if (callBack) {
                    callBack(err);
                }
            });
        }
        else {
            if (!this._spriteAtlasCache) {
                console.error("setImageSprite ------------ ", idSprite);
            }
            let cacheAtlas = this._spriteAtlasCache ? this._spriteAtlasCache[spriteInfo.strPlist] : null;
            //预加载过的直接拿缓存
            if (cacheAtlas) {
                image.spriteFrame = cacheAtlas.getSpriteFrame(spriteInfo.strName);
                if (callBack) {
                    callBack(0);
                }
            }
            else {
                cc.loader.loadRes("Texture/" + spriteInfo.strPlist, cc.SpriteAtlas, function (err, atlas) {
                    let spriteFrame: cc.SpriteFrame = atlas.getSpriteFrame(spriteInfo.strName);
                    image.spriteFrame = spriteFrame;
                    if (callBack) {
                        callBack(err);
                    }
                });
            }
        }
    }
    //todo:设置预加载图集
    public PushSpriteAtlasCache(url: string, spriteAtlas: cc.SpriteAtlas) {
        this._spriteAtlasCache[url] = spriteAtlas;
    }

    public getSpriteAtlasFromCache(url: string) {
        return this._spriteAtlasCache[url];
    }
    public init() {
        this._spriteAtlasCache = {};
    }


}
