/**
 * 提示
 */

var Helper = require("Helper");

cc.Class({
    extends: cc.Component,

    onLoad: function() {

        this.item = this.node.getChildByName("item")
        this.node_array = this.node.getChildByName("node_array")
        //this.lbl_text = this.item.getChildByName("lbl_text").getComponent(cc.Label);
        this.node.active = false
        console.log("onLoad", this.node.name)

    },

    showText: function(text) {
        this.node.active = true
        this.node.opacity = 255
        //this.lbl_text.string = text
        var self = this
        var newItem = cc.instantiate(this.item);
        this.node_array.addChild(newItem)
        newItem.active = true

        if (this.node_array.children.length >6) { //最多不超过6个
            this.node_array.removeChild(this.node_array.children[0]);
        }

        var lbl_text = newItem.getChildByName("lbl_text").getComponent(cc.Label);
        lbl_text.string = text

        newItem.runAction(cc.sequence(cc.delayTime(2),
            //cc.fadeOut(1),
            cc.callFunc(function() {
                newItem.destroy()
            })))


        this.node.stopAllActions()
        this.node.runAction(cc.sequence(cc.delayTime(3.5),
            cc.callFunc(function() {
                self.node.active = false
            })))

    },



});