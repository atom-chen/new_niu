/**
 * 全局对象保存
 *
 */
module.exports = {
    //serverURI: "ws://dwc_test.xuankai6.com:8000/client",
    serverURI: "ws://127.0.0.1:1234", //单机模式ip
    single:true,//是否单机模式
	nickname: "",
	gameID: 0,
	diamond: 0,
	score: 0,
	clientKernel: null,
	userID: 0,
	chairID: 0xFFFF,
	tableID: 0xFFFF,
	coreConfig: {}
}