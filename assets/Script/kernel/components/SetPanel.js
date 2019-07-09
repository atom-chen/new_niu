var GD = require("GD");
cc.Class({
    extends: cc.Component,

    properties: {
        openSpriteFrame: cc.SpriteFrame,
        closeSpriteFrame: cc.SpriteFrame
    },


    onLoad() {
        var content2 = this.node.getChildByName("content");
        content2.setScale(0);
        content2.runAction(cc.sequence(cc.scaleTo(0.25, 1).easing(cc.easeBackInOut()), cc.callFunc(() => {

        })));
        var closeButton = content2.getChildByName("closeButton");
        closeButton.on("click", this.closeButtonPressed.bind(this, content2));

        var musicButton = content2.getChildByName("musicButton");
        var effectButton = content2.getChildByName("effectButton");

        musicButton.on("click", this.musicButtonPressed.bind(this, musicButton));
        effectButton.on("click", this.effectButtonPressed.bind(this, effectButton));
        this.isEffect = (cc.sys.localStorage.getItem("effect_on") || "true") == "true";
        this.isMusic = (cc.sys.localStorage.getItem("bgm_on") || "true") == "true";

        this.setButtonState(effectButton, this.isEffect);
        this.setButtonState(musicButton, this.isMusic);
    },
    closeButtonPressed: function(content) {

        content.runAction(cc.sequence(cc.scaleTo(0.25, 0).easing(cc.easeBackInOut()), cc.callFunc(() => {
            this.node.destroy();
        })));
    },

    setButtonState: function(button, isAble) {
        if (isAble) {
            button.getComponent(cc.Sprite).spriteFrame = this.openSpriteFrame;
        } else
            button.getComponent(cc.Sprite).spriteFrame = this.closeSpriteFrame;
    },

    musicButtonPressed: function(sender) {


        this.isMusic = !this.isMusic;
        onfire.fire("MUSIC_ON_OFF", "bgm", this.isMusic);
        this.setButtonState(sender, this.isMusic);

    },
    effectButtonPressed: function(sender) {
        this.isEffect = !this.isEffect;
        onfire.fire("MUSIC_ON_OFF", "effect", this.isEffect);
        this.setButtonState(sender, this.isEffect);
    },
    start() {

    },

    // update (dt) {},
});