var NetHelp = require("NetHelp")

var GD = require("GD")
var define = require('define');
var GameUserManager = require('GameUserManager');


var gameCMD = define.gameCMD;
var gameConst = define.gameConst;


var ClientKernel = cc.Class({

    properties: {
        gameUserManager: null,
        gameStatus: null,
        myUserItem: null,
        myUserID: null,
        serverReady: false, //服务端是否准备好, 当成功触发onReady后， 就会重置为false， 防止重复触发
        clientReady: false, //客户端是否准备好，当成功触发onReady后， 就会重置为false， 防止重复触发
        tableUserData: null, //桌子信息
        reconnectTime: 0, //已重连次数
        pingTimer: null, //重连timer

    },


    ctor: function() {
        this.gameUserManager = new GameUserManager();
        this.gameUserManager.init(this);
        onfire.on("gamemsg", this.onEventMessage.bind(this))
        onfire.on("onConnect", this.onConnect.bind(this))
        onfire.on("onDisconnect", this.onDisconnect.bind(this))
        onfire.on("LoginByIDResp", this.onLoginByIDResp.bind(this))
        onfire.on("UserStandUp", this.onUserStandUp.bind(this))

    },



    getUserMgr: function() {
        return this.gameUserManager
    },

    getTableUserData: function() {
        return this.tableUserData
    },


    webSocketSend: function(data) {
        var roomID = GD.roomID
        data.roomID = roomID
        NetHelp.sendGameMessage("onClientSocketEvent", data)
    },



    //socket连接
    onConnect: function(data) {
        this.reconnectTime = 0
        this.clearPing()

        if (GD.single) {
            this.webSocketSend({ mainCMD: gameCMD.MDM_GR_LOGON, subCMD: gameCMD.SUB_GR_LOGON_ACCOUNTS })

        } else {
            var userinfo = null
            if (cc.sys.isBrowser) { //浏览器就跳转吧
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                }

                var userID = GetQueryString("userID")
                var token = GetQueryString("token")
                if (!!userID && !!token) {
                    userinfo = { userID, uuid: token }
                }

            } else {
                var userinfoJson = cc.sys.localStorage.getItem('userinfo');
                userinfo = JSON.parse(userinfoJson)
            }

            if (userinfo) {
                console.error("发现登录信息", userinfo)

                NetHelp.sendPlazaMessage("LoginByID", userinfo) //重新登录
            } else {
                console.error("未找到登录信息")
            }
        }

    },

    pingServer: function() {
        var self = this
        if (!this.pingTimer) {
            this.pingTimer = setInterval(() => {
                self.Reconnect()
            }, 4000);
        }
    },

    clearPing: function() {
        this.pingTimer && clearInterval(this.pingTimer);
        this.pingTimer = null
    },


    //掉线 重连
    onDisconnect: function() {
        this.pingServer()
    },

    Reconnect: function() {
        this.reconnectTime++;
        if (this.reconnectTime >= 6) {
            this.clearPing()
            /*            Helper.showTips("你已经断开连接,请重新登录!")
                        Helper.removeWaitLayer()*/
            console.log("你已经断开连接,请重新登录!")
            onfire.fire("ReconnectFailed", "你已经断开连接,请重新登录!")
            //cc.director.loadScene("login");
            return
        }
        //Helper.showWaitLayer(this.reconnectTime + "/5正在重连")
        onfire.fire("Reconnecting", this.reconnectTime)
        console.log(this.reconnectTime + "/5正在重连")
        NetHelp.connect();
    },



    /**
     * 消息事件
     * @param data     * @returns {boolean}
     */
    onEventMessage: function(data) {

        switch (data["mainCMD"]) {

            case gameCMD.MDM_GR_LOGON:
                this.onSocketMainLogon(data["subCMD"], data["data"]);
                break;
            case gameCMD.MDM_GR_USER:
                this.onSocketMainUser(data["subCMD"], data["data"]);
                return true;

            case gameCMD.MDM_GF_GAME:
                this.onSocketMainGame(data["subCMD"], data["data"]);
                return true;

            case gameCMD.MDM_GF_FRAME:
                this.onSocketMainFrame(data["subCMD"], data["data"]);
                return true;
        }
    },

    /**
     * 登录处理函数
     * @param subCMD
     * @param data
     * @returns {boolean}
     */
    onSocketMainLogon: function(subCMD, data) {
        switch (subCMD) {
            //登录成功
            case gameCMD.SUB_GR_LOGON_SUCCESS:
                //登录成功就获取自己
                this.myUserID = data["userID"];
                this.gameConfig = data["gameConfig"];
                this.myUserItem = this.gameUserManager.getUserByUserID(this.myUserID);
                GD.userID = data["userID"];
                GD.chairID = this.myUserItem.chairID
                GD.tableID = this.myUserItem.tableID
                //this.onEventSelfEnter(this.myUserItem);
                //获取游戏信息
                //this.webSocket.send({mainCMD:gameCMD.MDM_GF_FRAME, subCMD:gameCMD.SUB_GF_GAME_OPTION});
                this.serverReady = true;
                this.loginSuccess = true;
                if (this.clientReady) {
                    this.onReady();
                    this.serverReady = false;
                }
                console.log("登录成功", JSON.stringify(data))
                onfire.fire("onLogonSuccess", this.myUserID, data)
                return true;

            default:
                return true;
        }
    },

    logonSubgame: function(data) {
        NetHelp.connect()
    },

    onClientReady: function() {
        this.clientReady = true;
        if (this.serverReady) {
            this.onReady();
            this.clientReady = false;
        }
    },

    onReady: function() {
        this.onEventSelfEnter(this.myUserItem);
        //获取场景游戏信息
        this.webSocketSend({
            mainCMD: gameCMD.MDM_GF_FRAME,
            subCMD: gameCMD.SUB_GF_GAME_OPTION
        });

        //自己先进
        this.onUserItemActive(this.myUserItem);

        var userItem = null;
        for (var i = 0; i < this.gameUserManager.tableUserItem.length; ++i) {
            userItem = this.gameUserManager.tableUserItem[i];
            if (!userItem || userItem == this.myUserItem) continue;
            this.onUserItemActive(userItem);
        }


    },



    getRoomInfo: function() {
        //获取场景游戏信息
        this.webSocketSend({
            mainCMD: gameCMD.MDM_GF_FRAME,
            subCMD: gameCMD.SUB_GF_GAME_OPTION
        });
    },

    chat: function(text) {

        this.webSocketSend({
            mainCMD: gameCMD.MDM_GF_FRAME,
            subCMD: gameCMD.SUB_GF_USER_CHAT,
            data: { text }
        });
    },



    onLoginByIDResp(data) {
        console.log("onLoginByIDResp", JSON.stringify(data));
        if (data.code == 0) {
            var info = data.info
            GD.userID = info.userID;
            GD.nickname = info.nickname;
            GD.gameID = info.gameID;
            GD.score = info.score;
            GD.bankScore = info.bankScore;
            GD.roomID = info.roomID
            GD.uuid = info.uuid
            if (GD.roomID) {
                this.webSocketSend({ mainCMD: gameCMD.MDM_GR_LOGON, subCMD: gameCMD.SUB_GR_LOGON_ACCOUNTS })
                return
            }
        }

        console.log("你不在该游戏中！")
    },

    //解散游戏
    dismissGame: function() {
        NetHelp.sendPlazaMessage("UserStandUp", {})
    },

    onUserStandUp(data) {

        console.log("起立", data);
        cc.sys.localStorage.setItem("hallStart", 1);
        if (cc.sys.isBrowser) { //浏览器就跳转吧
            var href = "../../hall" + "/?userID=" + GD.userID + "&token=" + GD.uuid
            console.log("href:", href)
            window.location.href = href
        } else {
            cc.audioEngine.stopAll();
            cc.sys.garbageCollect()
            cc.game.restart();
        }
    },

    /**
     * 用户命令函数
     * @param subCMD
     * @param data
     * @returns {boolean}
     */
    onSocketMainUser: function(subCMD, data) {
        console.log("onSocketMainUser", subCMD, data)
        switch (subCMD) {
            case gameCMD.SUB_GR_USER_ENTER:
                this.onUserEnter(data);
                return true;
            case gameCMD.SUB_GR_USER_STATUS:
                this.onSubUserStatus(data);
                return true;
            case gameCMD.SUB_GR_USER_SCORE:
                this.onSubUserScore(data);
            default:
                return true;
        }
    },

    /**
     * 游戏命令函数
     * @param subCMD
     * @param data
     */
    onSocketMainGame: function(subCMD, data) {

        console.log("onEventGameMessage", subCMD, data);
        onfire.fire("onEventGameMessage", subCMD, data);
    },

    /**
     * 框架命令函数
     * @param subCMD
     * @param data
     * @returns {boolean}
     */
    onSocketMainFrame: function(subCMD, data) {
        switch (subCMD) {
            case gameCMD.SUB_GF_GAME_SCENE:
                console.log("onEventSceneMessage", this.gameStatus, data);
                onfire.fire("onEventSceneMessage", this.gameStatus, data);
                return true;

            case gameCMD.SUB_GF_GAME_STATUS:
                this.gameStatus = data["gameStatus"];
                return true;

            case gameCMD.SUB_GF_ROOM_INFO:
                if (data.tableUserData) {
                    this.tableUserData = data.tableUserData
                }
                console.log("onGotRoomInfo房间信息：", data)
                onfire.fire("onGotRoomInfo", subCMD, data);
                return true;


            case gameCMD.SUB_GF_USER_CHAT:
                onfire.fire("onNewChatMsg", data);
                return true;

            case gameCMD.SUB_GF_DISMISS_START: //解散开始 
                onfire.fire("onDismissStart", data);
                return true;
            case gameCMD.SUB_GF_DISMISS_AGREE: //用户同意解散 
                onfire.fire("onUserAgreeDismiss", data);
                return true;
            case gameCMD.SUB_GF_DISMISS_END: //结束解散 
                onfire.fire("onDismissEnd", data);
                return true;

            default:
                console.log("onEventFrameMessage", subCMD, data);
                onfire.fire("onEventFrameMessage", subCMD, data);
                return true;
        }
    },

    /**
     * 发送消息
     * @param mainCMD
     * @param subCMD
     * @param data
     */
    sendSocketData: function(mainCMD, subCMD, data) {

        var msg = { data }

        msg.mainCMD = mainCMD;
        msg.subCMD = subCMD;

        this.webSocketSend(msg);
    },

    /**
     * 用户状态
     * @param data 数据
     * @returns {boolean}
     */
    onSubUserStatus: function(data) {
        var userID = data["userID"];
        var tableID = data["tableID"];
        var chairID = data["chairID"];
        var userStatus = data["userStatus"];

        console.log("onSubUserStatus 0", data)
        var userItem = this.gameUserManager.getUserByUserID(userID);
        if (userItem == null) return true;

        if (userStatus <= gameConst.US_FREE) {
            this.gameUserManager.deleteUserItem(userItem);
        } else {
            this.gameUserManager.updateUserItemStatus(userItem, {
                tableID: tableID,
                chairID: chairID,
                userStatus: userStatus
            });
        }

        console.log("UserStatusChanged", data)
        onfire.fire("UserStatusChanged", data);

        return true;
    },
    /**
     * 用户分数变更
     * @param data
     */
    onSubUserScore: function(data) {
        var userID = data["userID"];
        var score = data["score"];

        var userItem = this.gameUserManager.getUserByUserID(userID);
        if (userItem == null) return true;

        this.gameUserManager.updateUserItemScore(userItem, score);
    },

    /**
     * 用户进入
     * @param data
     * @returns {boolean}
     */
    onUserEnter: function(data) {
        var infoArray = data;
        console.log("用户进入 onUserEnter", infoArray)
        //this.gameUserManager.clearAllUserItem(); //进入的时候先清掉所有玩家

        for (var i = 0; i < infoArray.length; ++i) {
            //创建玩家
            console.log(infoArray[i])
            this.gameUserManager.createNewUserItem(infoArray[i]);
        }
    },

    /**
     * 切换视图椅子
     * @param chairID
     */
    switchViewChairID: function(chairID) {

        var chairCount = gameConst.GAME_PLAYER_NUM;
        var viewChairID = Math.floor((chairID + chairCount * 3 / 2 - this.myUserItem.getChairID()) % chairCount);
        return viewChairID;
    },


    /**
     * 获取自己椅子ID
     * @returns {*}
     */
    getMeChairID: function() {
        return this.myUserItem.getChairID();
    },

    /**
     * 获取自己
     * @returns {null}
     */
    getMeUserItem: function() {
        return this.myUserItem;
    },

    /**
     * 获取座位玩家
     * @param chairID
     * @returns {*}
     */
    getTableUserItem: function(chairID) {
        return this.gameUserManager.getTableUserItem(chairID);
    },

    /**
     * 通过UserID获取用户
     * @param userID
     * @returns {*}
     */
    getUserByUserID: function(userID) {

        return this.gameUserManager.getUserByUserID(userID);
    },

    /**
     * 通过游戏ID获取用户
     */
    getUserByGameID: function(gameID) {

        return this.gameUserManager.getUserByGameID(gameID);
    },

    /**
     * 发送准备
     * @returns {boolean}
     */
    sendUserReady: function() {
        this.webSocketSend({
            mainCMD: gameCMD.MDM_GF_FRAME,
            subCMD: gameCMD.SUB_GF_USER_READY
        });
        return true;
    },


    /**
     *用户信息变化处理
     */



    /**
     * 玩家激活
     * @param userItem
     * @returns {boolean}
     */
    onUserItemActive: function(userItem) {

        cc.log("onEventUserEnter", userItem.nickname, userItem.userID);
        onfire.fire("onEventUserEnter", userItem);
    },

    /**
     * 玩家删除
     * @param userItem
     * @returns {boolean}
     */
    onUserItemDelete: function(userItem) {
        if (userItem == null) {
            return false;
        }

        cc.log("onUserItem Delete");
        cc.log("onEventUserLeave", userItem);
        onfire.fire("onEventUserLeave", userItem);
    },

    /**
     * 分数更新
     * @param userItem
     * @param scoreInfo
     * @returns {boolean}
     */
    onUserItemUpdateScore: function(userItem, scoreInfo) {
        if (userItem == null) {
            return false;
        }
        cc.log("onEventUserScore", userItem.nickname, userItem.userID);
        onfire.fire("onEventUserScore", userItem);
    },

    /**
     * 状态更新
     * @param userItem
     * @param statusInfo
     * @returns {boolean}
     */
    onUserItemUpdateStatus: function(userItem, statusInfo) {
        cc.log("onEventUserStatus", userItem.nickname, userItem.userID);
        onfire.fire("onEventUserStatus", userItem);
    },

    /**
     * 自己进入
     * @param userItem
     * @returns {boolean}
     */
    onEventSelfEnter: function(userItem) {

        cc.log("onEventSelfEnter", userItem.nickname, userItem.userID);
        onfire.fire("onEventSelfEnter", userItem);
    },

    /**
     * 获取游戏配置
     * @returns {null}
     */
    getGameConfig: function() {
        return this.gameConfig;
    },



});