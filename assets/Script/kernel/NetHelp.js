var Connector = require("Connector")


var GD = require("GD")

class NetHelp {
    constructor() {
        this.connector = null
        this.isLogin = false
        this.initialization();
    }
    /**
     * 初始化
     */
    initialization() {
        //初始化网络链接
        this.connector = new Connector();

    }

    isConnect() {
        return this.connector.isConnect
    }
    

   connect() {
        this.connector.connect(GD.serverURI);
    }


    // 断开连接
    disconnect() {
        this.connector.disconnect();
    }

    sendData(event, data) {
        this.connector.emit(event, data);
    }


    sendGameMessage(event, data) {
        data = data||{}
        data.to ="game"
        this.connector.emit("msg", event, data);
    }

    
    sendPlazaMessage(event, data) {
        data = data||{}
        data.to ="plaza"
        this.connector.emit("msg", event, data);
    }
    setLoginStatus(isLogin) {
        this.isLogin = isLogin;
    }

    getLoginStatus() {
        return this.isLogin;
    }

    /**
     * 心跳
     */
    pingServer() {}

    //认证
    auth(username, password) {
        var event = "login"
        var data = { username }
        this.sendData("plaza", { event, data })
    }

};

module.exports = new NetHelp()