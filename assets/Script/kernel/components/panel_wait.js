/**
 * 转菊花界面
 */

var Helper = require("Helper");

cc.Class({
    extends: cc.Component,

    onLoad: function() {
        this.node_center = this.node.getChildByName("node_center")
        this.lbl_text = this.node.getChildByName("lbl_text").getComponent(cc.Label);

        this.node.active = false
        console.log("onLoad", this.node.name)

    },



    showPanel: function(show, text) {

        text = text || ""
        this.node.active = show
        this.lbl_text.string = text
        if (show) {
            var actionBy = cc.rotateBy(0.5, 360);
            this.node_center.runAction(cc.repeatForever(cc.sequence(actionBy, actionBy)))
            this.scheduleOnce(function() {
                Helper.showWaitLayer(false) //隐藏
            }, 10);
        } else {
            this.node_center.stopAllActions()
            this.unscheduleAllCallbacks()
        }
    },



});