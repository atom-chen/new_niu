"use strict";

/**
 * 全局对象保存
 *
 */
var AudioMgr = require("AudioMgr");

module.exports = {
	//serverURI: "ws://dwc_test.xuankai6.com:8000/client",
	serverURI: "ws://127.0.0.1:1234", //单机模式ip
	single: true, //是否单机模式
	audioMgr: new AudioMgr(),
	nickname: "",
	gameID: 0,
	diamond: 0,
	score: 0,
	clientKernel: null,
	myUserID: 0,
	chairID: 0xFFFF,
	tableID: 0xFFFF,
	coreConfig: {},
	renshu: 0

};
//# sourceMappingURL=GD.js.map