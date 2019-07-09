import { PreLoadRes } from "../Data/PreLoadData";
import { DataManager } from "./DataManager";
import { SpriteManager } from "./SpriteManager";
import PoolManager from "./PoolManager";
import { AudioManager } from "./AudioManager";
import { DragonBonesManager } from "./DragonBonesManager";
import GameEngine from "../Base/GameEngine";
import { SkeletonManager } from "./SkeletonManager";
import GD = require('../GD');
export enum E_LoadSetup {
    E_LoadSetup_Start = 0,

    E_LoadSetup_Sprite,                //图集
    E_LoadSetup_Init,               //初始化接口
    E_LoadSetup_Pool,               //节点池
    E_LoadSetup_End,

}

interface loadResult {
    complete: boolean,
    value: number
}

type LoadFun = (curValue: number) => loadResult;

class LoadEvt {
    loadFun: LoadFun;   //加载回调
    curVaule: number;   //当前进度
    max: number;        //总进度

    constructor(fun, max) {
        this.loadFun = fun;
        this.curVaule = 0;
        this.max = max;
    }
}

//加载模块
class LoadModule {
    _maxPreLoad: number = 0;
    _curPreLoad: number = 0;
    _preRes: PreLoadRes = null;
    _loadNum: number = 0;

    constructor() {
        this._maxPreLoad = 0;
        this._curPreLoad = 0;
        this._preRes = null;
        this._loadNum = 0;
    }

    public LoadResPro(curValue: number) {
        if (0 == curValue && this._preRes && this._loadNum === 0) {
            this._loadNum++;
            this._preRes.resUrls.forEach(element => {
                console.log(`Request Loading ${element}`);
                cc.loader.loadRes(element, this._preRes.resType, this._completeCallback.bind(this, element, element.num ? element.num : 0));
            });
            this._preRes = null;
        }

        return { complete: this._curPreLoad >= this._maxPreLoad, value: this._curPreLoad };
    }

    public _completeCallback(url: any, num: number, error: Error, resource: any) {
        if (error) {
            console.error('Error url [' + error + ']');
            return;
        }
        this._curPreLoad++;
    }
}

//todo:预加载图集
class LoadSpriteModule extends LoadModule {

    constructor() {
        super();

        this._preRes = DataManager.instance().preLoad.getSpritePreLoading();
        this._maxPreLoad = this._preRes.resUrls.length;
        this._curPreLoad = 0;
        LoadManager.instance().registerLoad(E_LoadSetup.E_LoadSetup_Sprite, this.LoadResPro.bind(this), this._maxPreLoad);
    }

    public _completeCallback(url: string, num: number, error: Error, resource: any) {
        if (error) {
            return;
        }

        this._curPreLoad++;
        SpriteManager.instance().PushSpriteAtlasCache(url, resource);
    }
}
//todo:预加载内存池prefab
class LoadPoolModule extends LoadModule {

    constructor() {
        super();

        this._preRes = DataManager.instance().preLoad.getPoolPreLoading();
        this._maxPreLoad = this._preRes.resUrls.length;
        this._curPreLoad = 0;
        LoadManager.instance().registerLoad(E_LoadSetup.E_LoadSetup_Pool, this.LoadResPro.bind(this), this._maxPreLoad);
    }

    public LoadResPro(curValue: number) {
        if (0 == curValue && this._preRes && this._loadNum === 0) {
            this._loadNum++;
            this._preRes.resUrls.forEach(element => {
                console.log(`Request Loading ${element}`);
                cc.loader.loadRes(element.url, this._preRes.resType, this._completeCallback.bind(this, element.poolType, element.num));
            });
            this._preRes = null;
        }

        return { complete: this._curPreLoad >= this._maxPreLoad, value: this._curPreLoad };
    }

    public _completeCallback(type: number, num: number, error: Error, resource: any) {
        if (error) {
            console.error('Error Load Pool Prefab type [' + error + ']');
            return;
        }

        this._curPreLoad++;
        PoolManager.instance().PushPrefabCache(type, num, resource);
    }
}
export default class LoadManager {
    private constructor() { };
    private static s_inst: LoadManager = null;
    private m_mapLoadFuncs: { [nType: number]: LoadEvt } = null;
    private _curLoadPro = 0; //当前加载的进度条数值
    //预加载模块
    private _spiteModule: LoadSpriteModule = null;
    private _poolModule: LoadPoolModule = null;


    public get curLoadPro() {
        return this._curLoadPro;
    }


    public static instance(): LoadManager {
        if (LoadManager.s_inst == null) {
            LoadManager.s_inst = new LoadManager();
        }
        return LoadManager.s_inst;
    }

    public init() {
        this.m_mapLoadFuncs = {};
        this._curLoadPro = 0;
        //预加载图集资源和预制资源
        this._spiteModule = new LoadSpriteModule();
        this._poolModule = new LoadPoolModule();
        this.registerLoad(E_LoadSetup.E_LoadSetup_Init, this._loadInit.bind(this), 1);
        this.registerLoad(E_LoadSetup.E_LoadSetup_End, null, 0);
    }

    public stopLoad() {
        this.m_mapLoadFuncs = {};
        this._curLoadPro = 0;
    }

    public registerLoad(setup: E_LoadSetup, fun: LoadFun, max: number) {

        if (null != this.m_mapLoadFuncs[setup]) {
            console.log(`registerLoad: step=${setup} num=${max}`);
            this.m_mapLoadFuncs[setup].loadFun = fun;
            this.m_mapLoadFuncs[setup].max = max;
            return;
        }

        this.m_mapLoadFuncs[setup] = new LoadEvt(fun, max);

    }


    public loadGame() {
        console.log("===============", this.m_mapLoadFuncs)
        // console.log(this.m_mapLoadFuncs);
        for (let index = 1; index <= E_LoadSetup.E_LoadSetup_End; index++) {
            let element = this.m_mapLoadFuncs[index];
            console.log(`loadGame ${index}-${element}`);
            if (null == element) {
                continue;
            }

            if (element.max <= 0) {
                this.m_mapLoadFuncs[index] = null;
                this._curLoadPro += 100 / (E_LoadSetup.E_LoadSetup_End - 1);
                if (this._curLoadPro === 100) {
                    break;
                }
                else {
                    continue;
                }
            }

            if (index == E_LoadSetup.E_LoadSetup_End) {
                this._curLoadPro = 100;
                break;
            }

            let oldPro = element.curVaule / element.max;//上一刻的百分比
            let { complete: ret, value: curValue } = element.loadFun(element.curVaule);
            element.curVaule = curValue;

            let curPro = element.curVaule / element.max;//此刻的百分比
            let addPro = (curPro - oldPro) * 100 / (E_LoadSetup.E_LoadSetup_End - 1);
            this._curLoadPro += addPro;

            if (ret) {//加载完成
                this.m_mapLoadFuncs[index] = null;
            }

            break;
        }
    }

    private _loadInit(): loadResult {
        DataManager.instance().init();
        SpriteManager.instance().init();
        PoolManager.instance().init();
        AudioManager.instance().init();
        DragonBonesManager.instance().init();
        SkeletonManager.instance().init();
        GameEngine.instance().init();


        GD.isRotation = false;
        GD.isRageMode = false;
        GD.fishConfig = null;
        GD.isAllowFire = false;            //是否允许开火
        GD.lockingFish = null;          //锁鱼
        GD.isAndroidHelp = false;          //是否为机器人帮助者
        GD.autoFire = false;                 //自动开火
        GD.isReady = false;                 //是否准备
        GD.isSpeedMode = 1;               //是否是极速模式
        GD.bulletID = 0;                     //子弹ID
        GD.nowBulletNum = 0;                    //当前场上自己的子弹数
        GD.switingScene = false;             //是否正在切换场景
        GD.noActionTime = 0;                 //没动作时间
        GD.catchFishNum = [];                //以鱼FishKind为下标， 值为捕获数量
        GD.payMoney = 0;                     //付出的钱
        GD.harvestMoney = 0;                 //收获的钱


        return { complete: true, value: 1 };
    }
}
