//游戏常量定义
var gameConst = {

    //玩家状态
    US_NULL: 0x00, //没有状态
    US_FREE: 0x01, //站立状态
    US_SIT: 0x02, //坐下状态
    US_READY: 0x03, //同意状态
    US_PLAYING: 0x05, //游戏状态
    US_OFFLINE: 0x06, //掉线
    //桌子状态
    GAME_STATUS_FREE: 0, //空闲状态
    GAME_STATUS_PLAY: 100, //游戏状态
    GAME_STATUS_WAIT: 200, //等待状态
    //游戏结束原因
    GER_NORMAL: 0x00, //常规结束
    GER_DISMISS: 0x01, //游戏解散
    GER_USER_LEAVE: 0x02, //用户离开
    GER_NETWORK_ERROR: 0x03, //网络错误
    //游戏模式
    START_MODE_ALL_READY: 0x00, //所有准备
    START_MODE_FULL_READY: 0x01, //满人开始
    START_MODE_HUNDRED: 0x02, //百人游戏

    //请求失败类型
    KICK_TYPE: 0x01, //踢人
};
//框架消息
var gameCMD = {
    //登入命令
    MDM_GR_LOGON: 1, //登入主命令
    //请求
    SUB_GR_LOGON_ACCOUNTS: 1, //帐号登入
    //返回
    SUB_GR_LOGON_SUCCESS: 100, //登录成功
    SUB_GR_LOGON_FAILURE: 101, //登录失败
    //用户命令
    MDM_GR_USER: 2, //用户主命令
    //请求
    SUB_GR_USER_SIT_DOWN: 1, //坐下命令
    SUB_GR_USER_STANDUP: 2, //起立命令
    //返回
    SUB_GR_USER_STATUS: 100, //用户状态
    SUB_GR_USER_ENTER: 101, //用户进入
    SUB_GR_USER_SCORE: 102, //用户分数
    //游戏命令
    MDM_GF_GAME: 3, //游戏主命令
    //框架命令
    MDM_GF_FRAME: 4, //框架主命令
    //用户命令
    SUB_GF_GAME_OPTION: 1, //游戏配置
    SUB_GF_USER_READY: 2, //用户准备
    SUB_GF_USER_DISMISS_REQ: 3, //用户请求解散
    SUB_GF_USER_DISMISS_AGREE: 4, //用户同意解散 
    SUB_GF_USER_CHAT: 5, //聊天


    SUB_GF_GAME_STATUS: 100, //游戏状态
    SUB_GF_GAME_SCENE: 101, //游戏场景
    SUB_GF_ROOM_INFO: 103, //房间信息

    SUB_GF_FORCE_CLOSE: 105, //强制关闭窗口
    SUB_GF_REQUEST_FAILURE: 106, //请求失败

    SUB_GF_TOAST_MSG: 108, //tip消息
    SUB_GF_FISH_NOTICE: 111, //捕鱼消息， 用于 同房间不同桌子之间的类似公告的通知， 放在框架这占个坑， 防止后面框架用于111

    SUB_GF_DO_DISMISS_GAME: 115, //房间已解散消息
    SUB_GF_DISMISS_GAME_FAILED: 116, //房间j解散失败

};
//协调服事件
var corresCMD = {
    ROOM_INFO: "RoomInfo", //房间信息
    USER_SIT_DOWN: "UserSitDown", //用户坐下
    USER_STATUS: "UsersStatus", //用户状态
    USER_LEAVE: "UserLeave", //用户离开
    WRITE_SCORE: "WriteScore", //玩家写分
    OPEN_OK: "OpenOK", //房间开启成功

    /////////////////////////////////////////////////////////////////
    RECORD_ERROR: "RecordError", //可以让大厅把错误的日记记录到数据库中去


    ///////////////控制信息/////////////////////////
    MODIFY_USER_WEIGHT: "ModifyUserWeight", //修改用户权重
    GET_ROOM_CONTROL: "GetRoomControl", //获取房间控制配置
    MODIFY_ROOM_CONTROL: "ModifyRoomControl" //修改房间配置
};

//内部流通的事件
var gameEvent = {
    EVENT_USER_STATUS: "user_status", //玩家状态
    EVENT_USER_SCORE: "user_score", //玩家分数
    EVENT_ANDROID: "event_android" //机器人事件
};



var onfireEventDef ={
    onClock:"onClock",//倒计时时间
    resetSence:"resetSence",//重置场景
    onEventGameMessage:"onEventGameMessage",//游戏消息时间
    onEventSceneMessage:"onEventSceneMessage",//场景消息
    setGameStatus:"setGameStatus",//设置游戏状态
    onUserAddJetton:"onUserAddJetton",//加注
    progress_update:"progress_update",//资源加载进度
    initJetPool:"initJetPool",//初始话加注预制
    onGameStart:"onGameStart",//开始游戏
    bankerQueue:"bankerQueue",//庄家列表
    bankerMoneyChange:"",//庄家更新金币
    onEventSelfEnter:"onEventSelfEnter",//自己进入
    showChipEffect:"showChipEffect",//筹码按钮特效
    selfAddJetton:"selfAddJetton",//点击押注
    starBet:"starBet",//开始下注
    onGameResult:"onGameResult",//下注结束，结果通知
    onGameLock:"onGameLock",//游戏锁定
    userAddMoney:"userAddMoney",//用户金币增加
    userChangeScore:"userChangeScore",//用户成绩变更
    gameRecordQueue:"gameRecordQueue",//展示
    gameRecordQueueAdd:"gameRecordQueueAdd",//增加游戏记录
    showRecordHelp:"showRecordHelp",//游戏记录走势图
};


//押注区域类型
var AreaType = {
    RED:0,
    BLACK:1,
    LUCKY:2,
    COUNT: 3,               //总数
};

var preLoading = {
        prefabDir:"redBlack/prefabs",
        soundDir:"redBlack/sound",
};


//设计分辨率
var V = {
    w: 1334,
    h: 750
};


module.exports.gameConst = gameConst;
module.exports.gameCMD = gameCMD;
module.exports.gameEvent = gameEvent;
module.exports.corresCMD = corresCMD;
module.exports.onfireEventDef=onfireEventDef;
module.exports.AreaType=AreaType;
module.exports.preLoading =preLoading;
module.exports.V =V;
