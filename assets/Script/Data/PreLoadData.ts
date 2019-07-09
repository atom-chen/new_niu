import { IData } from "./IData";
import { PreLoad_Plist } from "./SpriteData";
import { ALL_POOL_INFO, PoolConfig } from "./PoolData";
import _ = require('../Base/underscore');
export interface PreLoadRes {
    readonly resType: any;
    readonly resUrls: any[];
}

export class PreLoadData extends IData {

    public init(): void {
    }

    public getSpritePreLoading(): PreLoadRes {
        let urls: string[] = _.values(PreLoad_Plist);
        urls = _.uniq(urls);
        return { resType: cc.SpriteAtlas, resUrls: urls };
    }

    public getPoolPreLoading(): PreLoadRes {
        let urls: PoolConfig[] = [];
        for (let data of ALL_POOL_INFO) {

            if (data.url) {
                urls.push(data);
            }
        }
        urls = _.uniq(urls);
        return { resType: cc.Prefab, resUrls: urls };
    }
}
