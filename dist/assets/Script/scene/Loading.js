"use strict";

var GD = require("GD");
var ClientKernel = require("ClientKernel");

cc.Class({
    extends: cc.Component,

    properties: {
        bar: {
            default: null,
            type: cc.ProgressBar
        },
        label: {
            default: null,
            type: cc.Label
        }

    },

    onLoad: function onLoad() {
        this.init();
        this.bindObj = [];
        this.bindObj.push(onfire.on("onLogonSuccess", this.onLogonSuccess.bind(this)));
    },
    onDestroy: function onDestroy() {
        for (var i = 0; i < this.bindObj.length; i++) {
            onfire.un(this.bindObj[i]);
        }
    },
    init: function init() {
        this.bar.progress = 0;
        this.label.string = "";
        if (!GD.clientKernel) {
            GD.clientKernel = new ClientKernel();
        }
        GD.clientKernel.logonSubgame(); //登录子游戏  登录成功会进 onLogonSuccess
    },


    //登录成功
    onLogonSuccess: function onLogonSuccess() {
        var _this = this;

        //先加载音效
        GD.audioMgr.loadAudioDir("sound", function () {
            GD.audioMgr.playMusic("sound/bg_music"); //开始播背景音乐
            _this.loadGame();
        });
    },
    loadGame: function loadGame() {
        var self = this;
        cc.loader.onProgress = function (completedCount, totalCount, item) {
            var progress = 1;
            if (totalCount != 0) {
                progress = (completedCount / totalCount).toFixed(2);
            }
            //这里显示loading进度
            self.bar.progress = progress;
            self.label.string = (progress * 100).toFixed() + "%";
        };

        //预加载场景
        cc.director.preloadScene("game", function () {
            self.scheduleOnce(function () {
                cc.loader.onProgress = null;
                cc.director.loadScene("game");
            }, 0.3);
        });
    }
});
//# sourceMappingURL=Loading.js.map