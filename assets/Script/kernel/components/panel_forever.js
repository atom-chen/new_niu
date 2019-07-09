/**
 * 永久节点
 */

cc.Class({
    extends: cc.Component,

    onLoad: function() {
        cc.game.addPersistRootNode(this.node); //永久
    },

});