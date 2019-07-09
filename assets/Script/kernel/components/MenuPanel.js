var GD = require("GD")
cc.Class({
    extends: cc.Component,

    properties: {
        settingPrefab: {
            tooltip: "设置界面预制",
            default: null,
            type: cc.Prefab,
        },
    },
    onLoad() {
        var content2 = this.node.getChildByName("content");
        content2.setScale(0);
        content2.runAction(cc.sequence(cc.scaleTo(0.25, 1).easing(cc.easeBackInOut()), cc.callFunc(() => {

        })));
        var closeButton = this.node.getChildByName("background");
        closeButton.on("click", this.closeButtonPressed.bind(this, content2));

        var setButton = content2.getChildByName("setButton");
        setButton.on("click", this.setButtonPressed.bind(this));

        var backButton = content2.getChildByName("backButton");
        backButton.on("click", this.backButtonPressed.bind(this));

    },


    closeButtonPressed: function(content) {
        //GD.musicPlay.play_effect("sound/oxex_click");

        content.runAction(cc.sequence(cc.scaleTo(0.25, 0).easing(cc.easeBackInOut()), cc.callFunc(() => {
            this.node.destroy();
        })));
    },

    setButtonPressed: function() {
        //GD.musicPlay.play_effect("sound/oxex_click");
        if (this.settingPrefab) {
            var panel = new cc.instantiate(this.settingPrefab);
            cc.director.getScene().addChild(panel);
            this.node.destroy();
        }
    },

    backButtonPressed: function() {
        console.debug("返回大厅")
        GD.clientKernel.dismissGame()
    },


    start() {

    },

    // update (dt) {},
});