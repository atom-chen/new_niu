"use strict";

/**
 * 音效管理器， 对cc.audioEngine的封装
 */

var AudioMgr = cc.Class({

    ctor: function ctor() {
        this.audioClipMap = {}; //文件夹下的资源
        this.bgm_on = (cc.sys.localStorage.getItem("bgm_on") || "true") == "true";
        this.effect_on = (cc.sys.localStorage.getItem("effect_on") || "true") == "true";
        this.bgm = null;
    },

    onDestroy: function onDestroy() {
        this.releaseAll();
    },
    //背景音乐是否打开
    isBgmOpen: function isBgmOpen() {
        return this.bgm_on || false;
    },
    //音效是否打开
    isEffectOpen: function isEffectOpen() {
        return this.effect_on || false;
    },

    //加载dirName下所有的音频 加载完回调
    loadAudioDir: function loadAudioDir(dirName, callback) {
        var _this = this;

        // 加载 sound 目录下所有 AudioClip，并且获取它们的路径
        cc.loader.loadResDir(dirName, cc.AudioClip, function (err, assets, urls) {
            if (err) {
                console.error("加载错误");
                return;
            }
            for (var i = 0; i < urls.length; ++i) {
                var url = urls[i];
                _this.audioClipMap[url] = assets[i];
            }
            _this.openBgm(_this.bgm_on);
            _this.openEffect(_this.effect_on);
            callback();
        });
    },

    //释放所有AudioMgr加载的音效
    releaseAll: function releaseAll() {
        this.stopAll();
        for (var i = 0; i < this.bindObj.length; i++) {
            onfire.un(this.bindObj[i]);
        }
        for (var i = 0; i < this.audioClipMap.length; i++) {
            var sound = this.audioClipMap[i];
            cc.loader.releaseAsset(sound);
        }
    },

    //停止所有音乐
    stopAll: function stopAll() {
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
    },

    //bgm开关
    openBgm: function openBgm(on) {
        if (on && this.bgm) {
            cc.audioEngine.playMusic(this.bgm, true);
        } else {
            cc.audioEngine.stopMusic();
        }
        this.bgm_on = on;
        cc.sys.localStorage.setItem("bgm_on", on);
    },

    //音效开关
    openEffect: function openEffect(on) {
        if (!on) {
            cc.audioEngine.stopAllEffects(); //停止所有
        }
        this.effect_on = on;
        cc.sys.localStorage.setItem("effect_on", on);
    },

    //播放背景音乐
    //music: cc.AudioClip 或者AudioMgr加载的音效资源路径
    playMusic: function playMusic(music) {
        var clip = null;
        if ("string" === typeof music) {
            //string 路径播放
            if (this.audioClipMap[music]) {
                clip = this.audioClipMap[music];
            } else {
                console.error("你要播放的音乐不存在：", music);
            }
        } else if (music instanceof cc.AudioClip) {
            clip = music;
        }

        if (clip) {
            this.bgm = clip;
        } else {
            console.error("背景音乐错误null");
            return;
        }
        if (!this.isBgmOpen()) return; //背景音乐静音

        return cc.audioEngine.playMusic(this.bgm, true);
    },

    //播放音效 返回effectID
    //effect: cc.AudioClip 或者AudioMgr加载的音效资源路径
    playEffect: function playEffect(effect) {
        var _cc$audioEngine;

        if (!this.isEffectOpen()) return; //音效静音


        var clip = null;
        if ("string" === typeof effect) {
            //string 路径播放
            if (this.audioClipMap[effect]) {
                clip = this.audioClipMap[effect];
            }
        } else if (effect instanceof cc.AudioClip) {
            clip = effect;
        }

        if (!clip) {
            console.error("你要播放的音乐不存在：", effect);
            return;
        }

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return (_cc$audioEngine = cc.audioEngine).playEffect.apply(_cc$audioEngine, [clip].concat(args));
    },

    stopEffect: function stopEffect() {
        var _cc$audioEngine2;

        (_cc$audioEngine2 = cc.audioEngine).stopEffect.apply(_cc$audioEngine2, arguments);
    }

});

module.exports = AudioMgr;
//# sourceMappingURL=AudioMgr.js.map