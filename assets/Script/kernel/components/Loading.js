import LoadManager from "../../Manager/LoadManager";
import { EM_UIType } from "../../Data/UIData";
import { UIManager } from "../../Manager/UIManager";

var GD = require("GD");
var ClientKernel = require("ClientKernel");

cc.Class({
    extends: cc.Component,

    properties: {
        bar: {
            default: null,
            type: cc.ProgressBar,
        },
        label: {
            default: null,
            type: cc.Label,
        },

    },

    onLoad() {
        this.init();
        this.bindObj = [];
        // this.bindObj.push(onfire.on("onLogonSuccess", this.onLogonSuccess.bind(this)));
        this.bindObj.push(onfire.on("onLogonSuccess", this.onLogonSuccessNew.bind(this)));
        LoadManager.instance().init();
    },

    onDestroy() {
        for (var i = 0; i < this.bindObj.length; i++) {
            onfire.un(this.bindObj[i])
        }

    },


    init() {
        this.bar.progress = 0;
        this.label.string = "";

        if (!GD.clientKernel) {
            GD.clientKernel = new ClientKernel();
        }
        GD.clientKernel.logonSubgame() //登录子游戏  登录成功会进 onLogonSuccess

    },


    //登录成功
    onLogonSuccess() {
        let self = this;
        cc.loader.onProgress = function (completedCount, totalCount, item) {
            var progress = 1;
            if (totalCount !== 0) {
                progress = (completedCount / totalCount).toFixed(2);
            }
            //这里显示loading进度
            self.bar.progress = progress;
            self.label.string = progress * 100 + "%"
        };

        //预加载场景
        cc.director.preloadScene("game", function () {
            self.scheduleOnce(() => {
                cc.loader.onProgress = null;
                cc.director.loadScene("game");
            }, 0.5);

        });
    },
    onLogonSuccessNew() {
        console.error('连接成功---');
        this.bLoading = true;
    },
    update(dt) {
        if (!this.bLoading) {
            return;
        }
        LoadManager.instance().loadGame();
        let pro = LoadManager.instance().curLoadPro;
        this.bar.progress = pro;
        this.label.string = pro + "%";
        if (pro >= 100) {
            this.bLoading = false;
            //预加载场景
            cc.director.preloadScene("game", () => {
                this.scheduleOnce(() => {
                    cc.loader.onProgress = null;
                    cc.director.loadScene("game", () => {
                        UIManager.instance().initRootCanvas();
                        UIManager.instance().openWindow(EM_UIType.eUT_Table);
                    });
                }, 0.5);
            });
        }
    },

});