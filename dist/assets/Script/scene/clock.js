"use strict";

/**
 * 闹钟类
 */
cc.Class({
    extends: cc.Component,

    properties: {
        //目标文本
        targetLab: cc.Label,
        //是否开启倒计时
        isCountdown: false,
        //是否完成时隐藏
        isFinishHide: true,
        //是否开启声音功能
        isOpenAudio: false,
        //总时间
        time: 20
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //time初始值
        this.initialValue = this.time;
        //闹钟音频组件
        this.alarmClockAudio = null;
        if (this.isOpenAudio) {
            this.alarmClockAudio = this.getComponent(cc.AudioSource);
        }
    },
    start: function start() {},
    onEnable: function onEnable() {
        this.isCountdown = true;
        this.nowTime = 0;
        this.targetLab.string = this.time;
    },
    onDisable: function onDisable() {
        this.time = this.initialValue;

        if (this.isOpenAudio) {
            this.alarmClockAudio.stop();
        }
    },
    update: function update(dt) {
        if (this.isCountdown == true) {
            this.nowTime += dt;
            if (this.nowTime >= 1) {
                this.time -= 1;
                this.nowTime = 0;
                this.targetLab.string = this.time;
            }
            if (this.time <= 0) {
                this.time = 0;
                this.isCountdown == false;
                if (this.isFinishHide == true) {
                    this.node.active = false;
                    console.log(this.node.active);
                }
            };

            //播放音频
            if (this.isOpenAudio) {
                if (this.time == 5 && this.alarmClockAudio.isPlaying == false) {
                    this.alarmClockAudio.play();
                };
            }
        };
    }
});
//# sourceMappingURL=clock.js.map