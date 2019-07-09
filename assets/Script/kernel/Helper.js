var GD = require("GD");

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

var Helper = {};


/**
 * 微信登录的回调，一个参数是openid
 * @type (openid)=>{}
 */
Helper.wxLoginCallBack = null;

/**
 * 微信分享的回调
 * @type  (errCode)=>{}
 */
Helper.wxShareCallBack = null;


 function formatStr (num, sep, chars) {
    var num = (num || 0).toString(),
        result = '';
    while (num.length > chars) {
        result = sep + num.slice(-chars) + result;
        num = num.slice(0, num.length - chars);
    }
    if (num) {
        result = num + result;
    }
    return result;
}

//一个数字字符串，从右到左每隔3位加入一个逗号(1234567890 --> 1,234,567,890)
Helper.toThousands = function (src) {
    return formatStr(src, ",", 3)
}
//转换为万字
Helper.to10Thousands = function (src) {
    return formatStr(src, " ", 4)
}

//数字转x.x(万)
Helper.toWan = function (src) {
    return Math.floor(src / 1000) / 10
}


Helper.md5 = function (src) {
    return SparkMD5.hash(src).toUpperCase(); // hex hash
}


/**
 * 金额小写转大写
 * @param n
 * @returns {*}
 */
Helper.convertMoneyToCapitals = function (n) {
    if (n == 0) {
        return "零"
    }
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
        return "数据非法";
    var unit = "万千百拾亿千百拾万千百拾元",
        str = "";
    n += ""
    var p = n.indexOf('.');
    if (p >= 0)
        return "数据非法";
    unit = unit.substr(unit.length - n.length);
    for (var i = 0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "");
};


Helper.getGUid = function () {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


//创建预设
Helper.createNode = function (prefab_name, cb) {

    cc.loader.loadRes(prefab_name, function (err, prefab) {
        var newNode = cc.instantiate(prefab);
        cb(newNode)
    })
}


//弹框
/**
 * @style     (0,null)= 确定  1=确认 + 取消
 * @cb   点了确定之后回调，
 */
Helper.MessageBox = function (text, style, cb) {

    cc.loader.loadRes("panel/panel_message_box", function (err, prefab) {
        var newNode = cc.instantiate(prefab);
        cc.find("Canvas").addChild(newNode);
        var script = newNode.getComponent("panel_message_box")
        script.messageBox(text, style, cb);
    })
}

/**
 * 屏幕旋转
 * @isPortrait 是否竖屏
 */
Helper.JsBridge = function (isPortrait, callback) {
    var frameSize = cc.view.getFrameSize();
    if (Helper.isOrientationP() === isPortrait) {
        console.log("屏幕方向正确，不需要改变")
        callback && callback();
        return;
    }

    if (cc.sys.isBrowser) {
        cc.view.setFrameSize(frameSize.height, frameSize.width);

        if (isPortrait)
            cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        else
            cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);

        callback && callback();
        return;
    }

    let num = isPortrait === true ? 2 : 1;

    console.log("开始调整屏幕方向");
    if (cc.sys.os === cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setOrientation", "(I)V", num);
    }
    else if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("AppController", "changeOrientation:", isPortrait);
    }

    setTimeout(function () {
        console.log("回调");
        callback && callback();
    }, 100);

};



/**
 * 获取原生的版本,检测大版本更新
 * @returns {*}
 */
Helper.getGameVersion = function () {
    if (!cc.sys.isNative) return;

    let version;
    if (cc.sys.os === cc.sys.OS_ANDROID) {
        version = jsb.reflection.callStaticMethod("cn/dapenggame/lxsss/SDKManager", "getGameVersion", "()Ljava/lang/String;");
    }
    else if (cc.sys.os === cc.sys.OS_IOS) {
        version = jsb.reflection.callStaticMethod("PlatformSystem", "getIOSGameVersion");
    }

    console.log("version==" + version);

    return version;
};

/**
 * 添加子节点按钮的触摸事件
 * @param node 父节点
 * @param cb 回调
 * @param obj 绑定的调用对象
 */
Helper.addBtnOnClick = function (node, cb, obj) {
    if (!node) return;
    let child = node.getComponentsInChildren(cc.Button);
    for (let i in child) {
        let childBtn = child[i].node;
        childBtn.on(cc.Node.EventType.TOUCH_END, cb, obj);
    }
};

Helper.destroyOnFire = function (bindArray) {
    for (var i = 0; i < bindArray.length; i++) {
        onfire.un(bindArray[i]);
    }
};


/**
 * 加载微信头像
 * @param node 头像节点
 * @param url 头像URL
 */
Helper.loadWxHead = function (node, url) {
    if (!node) return;

    let loadHeadImg = node.getComponent("LoadHeadImg");
    if (!loadHeadImg) {
        loadHeadImg = node.addComponent("LoadHeadImg");
    }

    loadHeadImg.loadUrlHead(url);  
};

/**
 * 显示提示
 * @param tips
 * @param type
 * @param cb
 * @constructor
 */
Helper.showTips = function (tips, type, cb) {
    var scene = cc.director.getScene();
    var tipNode = scene.getChildByName("node_forever")



    cc.loader.loadRes("panel/panel_text_tips", (err, prefab) => {
        let tipsPanel = cc.instantiate(prefab);
        let canvas = cc.find("Canvas");
        canvas.addChild(tipsPanel);
        tipsPanel.setSiblingIndex(canvas.childrenCount - 1);
        let tipsViewer = tipsPanel.getComponent("panel_text_tips");
        tipsViewer.showTips(tips, cb);
    });
};

/**
 * 获取相对我的座位
 * @param seatIndex 当前位置
 * @returns {number} 相对位置
 */
Helper.getLocalSeatIndex = function (seatIndex) {
    return (seatIndex + Helper.GAME_PLAYER_NUM - GD.clientKernel.myUserItem.getChairID()) % Helper.GAME_PLAYER_NUM;
};



/**
 * 加载界面到根节点
 * @param fullName 包含目录的全名
 * @param newPanel 新节点node对象
 */
Helper.loadPanel = function (fullName) {
    cc.loader.loadRes(fullName, (err, prefab) => {
        if (err) {
            Helper.showTips(err.message);
            return;
        }

        let newPanel = cc.instantiate(prefab);
        let can = cc.find("Canvas");
        can.addChild(newPanel);
    });
};

/**
 * 格式化时间
 * @param ts 服务器发过来的时间
 * @returns {*} 输出显示时间字符串
 */
Helper.getTimeStrForTS = function (ts) {
    let timeDate = new Date(ts);
    let timeStr = timeDate.format("yyyy-MM-dd hh:mm:ss");

    // timeStr = timeStr.replace("T", " ");
    let index = timeStr.indexOf('.');
    if (index > 0) timeStr = timeStr.substring(index, 0);

    return timeStr;
};

/**
 * 斗地主的房间信息拼接字符串
 * @param tableUserData
 * @returns {string}
 */
Helper.getDdzRoomStr = function (tableUserData) {
    // let tableUserData = data.tableInfo.tableUserData;
    if (!tableUserData) return "";

    let tipsText = "";
    let isLoy = tableUserData.gameType === Helper.LOY_DDZ;
    if (!isLoy) {

        tipsText = "常规斗地主\n";
        tipsText += "房间号：" + tableUserData.gameID;
        tipsText += "\n";
        tipsText += tableUserData.addMul === 1 ? "加倍" : "不加倍";
        tipsText += "局数：" + tableUserData.roundNum;
        tipsText += "\n";
        tipsText += "封顶：" + tableUserData.maxMul + "分";
    }
    else {
        tipsText = "欢乐斗地主\n";
        tipsText += "房间号：" + tableUserData.gameID;
        tipsText += "\n";
        tipsText += tableUserData.showCard === 1 ? "明牌" : "不明牌";
        tipsText += "  局数：" + tableUserData.roundNum;
        tipsText += "\n";
        tipsText += "封顶：" + tableUserData.maxMul + "分";
    }

    return tipsText;
};


/**
 * 播放音效
 * @param music
 */
Helper.playMusic = function(music, loop) {
    if (GD.musicEngine) {
        return GD.musicEngine.playEffect(music, loop);
    }
};
/**
 * 显示加载界面
 * @param music
 */
Helper.showWaitLayer = function(show, text) {
    var panel_wait = cc.find("panel_forever/panel_wait")
    panel_wait.getComponent("panel_wait").showPanel(show || false, text)

};


/**
 * 显示提示
 */
Helper.showTips = function(text) {
    var panel_tips = cc.find("panel_forever/panel_tips")
    panel_tips.getComponent("panel_tips").showText(text)

};

//node 节点显示 atlas中的spriteName图片
Helper.showSpriteFrame = function(node, atlas, spriteName) {
    var frame = atlas.getSpriteFrame(spriteName);
    var sprite = node.getComponent(cc.Sprite)
    if (sprite && frame) {
        sprite.spriteFrame = frame
    } else {
        cc.error("showSpriteFrame 错误:" + spriteName)
    }
};

//获取字节长度，中文两个字节，英文一个字节
Helper.getStrInBytes = function (str) {

    var bytesCount = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
        {
            bytesCount += 1;
        } else {
            bytesCount += 2;
        }
    }
    return bytesCount
}

Helper.GAME_MAX_SCORE = 3;
Helper.GAME_PLAYER_NUM = 3;

Helper.NORMAL_DDZ = 1;
Helper.LOY_DDZ = 2;

Helper.MUSIC_ON_OFF_KEY = "MUSIC_ON_OFF";
Helper.EFFECT_ON_OFF_KEY = "EFFECT_ON_OFF";


Helper.VERSION = "1.0.19";

module.exports = Helper;