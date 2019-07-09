import { V } from "../GameData/Config";

//工具类
export let ttutil: any = {};

ttutil.encodeURI = function (obj) {
    return Object.keys(obj).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    }).join('&');
};

/**
 * 获取url后的参数
 * @returns {Object}
 */
ttutil.getArgmuent = function () {

    if (typeof location == "undefined") {
        return [];
    }

    var url = location.search; //获取url中"?"符后的字串
    var theRequest = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0].toLowerCase()] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
};

ttutil.clone = function (obj) {
    // Cloning is better if the new object is having the same prototype chain
    // as the copied obj (or otherwise, the cloned object is certainly going to
    // have a different hidden class). Play with C1/C2 of the
    // PerformanceVirtualMachineTests suite to see how this makes an impact
    // under extreme conditions.
    //
    // Object.create(Object.getPrototypeOf(obj)) doesn't work well because the
    // prototype lacks a link to the constructor (Carakan, V8) so the new
    // object wouldn't have the hidden class that's associated with the
    // constructor (also, for whatever reasons, utilizing
    // Object.create(Object.getPrototypeOf(obj)) + Object.defineProperty is even
    // slower than the original in V8). Therefore, we call the constructor, but
    // there is a big caveat - it is possible that the this.init() in the
    // constructor would throw with no argument. It is also possible that a
    // derived class forgets to set "constructor" on the prototype. We ignore
    // these possibities for and the ultimate solution is a standardized
    // Object.clone(<object>).
    var newObj = (obj.constructor) ? new obj.constructor : {};

    // Assuming that the constuctor above initialized all properies on obj, the
    // following keyed assignments won't turn newObj into dictionary mode
    // becasue they're not *appending new properties* but *assigning existing
    // ones* (note that appending indexed properties is another story). See
    // CCClass.js for a link to the devils when the assumption fails.
    for (var key in obj) {
        var copy = obj[key];
        // Beware that typeof null == "object" !
        if (((typeof copy) === "object") && copy && !(copy instanceof cc.Node)) {
            newObj[key] = ttutil.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};
/**
 * 复制
 */
ttutil.cloneObj = function (oldObj) {
    if (typeof(oldObj) != 'object') return oldObj;
    if (oldObj == null) return oldObj;
    var newObj = {};
    for (var i in oldObj)
        newObj[i] = ttutil.cloneObj(oldObj[i]);
    return newObj;
};

/**
 * 扩展对象
 */
ttutil.extendObj = function () {
    var args = arguments;
    if (args.length < 2) return;
    var temp = ttutil.cloneObj(args[0]);
    for (var n = 1; n < args.length; n++) {
        for (var i in args[n]) {
            temp[i] = args[n][i];
        }
    }
    return temp;
};

/**
 * 深度拷贝属性
 * @param dest
 * @param src
 * @returns {*|{}}
 */
ttutil.copyAttr = function (dest, src) {

    for (var attr in src) {

        if (src[attr] instanceof Array) {
            dest[attr] = dest[attr] || [];
            this.copyAttr(dest[attr], src[attr]);
        }
        else if (src[attr] === 'object') {
            dest[attr] = dest[attr] || {};
            this.copyAttr(dest[attr], src[attr]);
        }
        else {
            dest[attr] = src[attr];
        }
    }
};

/**
 *
 对Date的扩展，将 Date 转化为指定格式的String
 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 例子：
 ttutil.formatDate(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 ttutil.formatDate(new Date(),"yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param date
 * @param fmt
 */
ttutil.formatDate = function (date, fmt) {
    fmt = fmt || "yyyy-M-d hh:mm:ss";
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;

};

/**
 * 格式化  妮称， 超过部分用。。。
 */
ttutil.formatNickname = function (nickname) {
    if (nickname.length > 7) {
        nickname = nickname.slice(0, 5) + "...";
    }
    return nickname;
};

/**
 * 返回字符的字节长度（汉字算2个字节）
 * @param {string}
 * @returns {number}
 */
ttutil.getByteLen = function (val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
            len += 2;
        else
            len += 1;
    }
    return len;
};

/**
 * 金额小写转大写
 * @param n
 * @returns {*}
 */
ttutil.convertMoneyToCapitals = function (n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
        return "数据非法";
    var unit = "万千百拾亿千百拾万千百拾元角分", str = "";
    n += "00";
    var p = n.indexOf('.');
    if (p >= 0)
        n = n.substring(0, p) + n.substr(p + 1, 2);
    unit = unit.substr(unit.length - n.length);
    for (var i = 0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
};


/**
 * 删除指定的元素, 有删除到， 返回true, 没有返回false
 * @param array
 * @param element
 * @returns {boolean}
 */
ttutil.arrayRemove = function (array, element) {
    for (var i = 0, len = array.length; i < len; ++i) {
        if (array[i] == element) {
            array.splice(i, 1);
            return true;
        }
    }
    return false;
};

/**
 * 随机数组索引
 * @param array
 * @returns {*}
 */
ttutil.arrayShuffle = function (array) {
    let m = array.length, i;
    while (m) {
        i = (Math.random() * m--) >>> 0;
        [array[m], array[i]] = [array[i], array[m]];
    }
    return array;
};

/**
 * 判断数组是否含有某个元素
 * @param array
 * @param obj
 * @returns {number}
 */
ttutil.arrayContains = function (array, obj) {
    let m = array.length;
    while (m--) {
        if (array[m].toString() === obj.toString()) {
            return m;
        }
    }
    return -1;
};

/**
 * 数组去重
 * @param array
 * @returns {Array}
 */
ttutil.arrayUnique = function (array) {
    let tempArray = [];
    let tempJson = {};
    for (let i = 0; i < array.length; i++) {
        if (!tempJson[array[i]]) {
            tempArray.push(array[i]);
            tempJson[array[i]] = 1;
        }
    }
    return tempArray;
};

/**
 * 判断两个数组是否相等
 * @param array1
 * @param array2
 * @returns {boolean}
 */
ttutil.arrayEquals = function (array1, array2) {
    if (!array1 || !array2) return false;
    if (array1.length !== array2.length) return false;

    for (var i = 0; i < array1.length; i++) {
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            if (!this(array1[i], array2[i])) {
                return false;
            }
        } else if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
};

//判断一个点， 是在线的左边， 还是右边
// 负数左边， 0， 刚好线上， 正数右边
//x1, y1, x2, y2, 表示线
//x, y表示点
ttutil.calcInLineSide = function (x1, y1, x2, y2, x, y) {
    var value = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
    return value
};

/**
 * 判断 点是否在矩形内
 * @param rect {{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
 * @param point cc.Point
 * @returns {boolean}
 */
ttutil.isPointInRect = function (rect, point) {

    return ttutil.calcInLineSide(rect.lt.x, rect.lt.y, rect.rt.x, rect.rt.y, point.x, point.y)
        *
        ttutil.calcInLineSide(rect.lb.x, rect.lb.y, rect.rb.x, rect.rb.y, point.x, point.y) <= 0
        &&
        ttutil.calcInLineSide(rect.lt.x, rect.lt.y, rect.lb.x, rect.lb.y, point.x, point.y)
        *
        ttutil.calcInLineSide(rect.rt.x, rect.rt.y, rect.rb.x, rect.rb.y, point.x, point.y) <= 0;

};

/**
 * 判断两条线段是否相交
 * @param l1p1 线段1点1
 * @param l1p2 线段1点2
 * @param l2p1 线段2点1
 * @param l2p2 线段2点2
 * @returns {boolean}
 */
ttutil.lineCollisionDetection = function (l1p1, l1p2, l2p1, l2p2) {

    return ttutil.calcInLineSide(l1p1.x, l1p1.y, l1p2.x, l1p2.y, l2p1.x, l2p1.y)
        *
        ttutil.calcInLineSide(l1p1.x, l1p1.y, l1p2.x, l1p2.y, l2p2.x, l2p2.y) <= 0
        &&
        ttutil.calcInLineSide(l2p1.x, l2p1.y, l2p2.x, l2p2.y, l1p1.x, l1p1.y)
        *
        ttutil.calcInLineSide(l2p1.x, l2p1.y, l2p2.x, l2p2.y, l1p2.x, l1p2.y) <= 0;
};

/**
 * 判断两个矩形是否碰撞
 * @param rect1 {{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
 * @param rect2 {{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
 * @returns {boolean}
 */
ttutil.rectCollisionDetection = function (rect1, rect2) {

    var ps1 = [rect1.lt, rect1.rt, rect1.rb, rect1.lb, rect1.lt];
    var ps2 = [rect2.lt, rect2.rt, rect2.rb, rect2.lb, rect2.lt];

    //判断是否有一矩形顶点在另一矩形内, 判断一个顶点就好， 主要是防止一个矩形完全在另一个矩形内， 其它相交方式由下面的判断解决（判断矩形边是否跟另一矩形边有相交）

    if (ttutil.isPointInRect(rect1, ps2[0]) || ttutil.isPointInRect(rect2, ps1[0])) {
        return true;
    }

    //for (var i = 0; i < 4; ++i) {
    //    if (ttutil.isPointInRect(rect1, ps2[i])) {
    //        return true;
    //    }
    //}
    //for (var i = 0; i < 4; ++i) {
    //    if (ttutil.isPointInRect(rect2, ps1[i])) {
    //        return true;
    //    }
    //}
    //判断矩形边是否跟另一矩形边有相交

    for (var i = 0; i < 4; ++i) {
        for (var j = 0; j < 4; ++j) {
            if (ttutil.lineCollisionDetection(ps1[i], ps1[i + 1], ps2[j], ps2[j + 1])) {
                return true;
            }
        }
    }

    return false;
};

/**
 * 得到结点的矩形， 支持旋转后的
 * @param node
 * @param percent  百分比， 比如需要缩小些， 就填0.8， 就缩小到原来的0.8， 暂时按中心点缩小（后面改成按锚点）， 各连长为原来的0.8
 * @returns {{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
 */
ttutil.getRect = function(node: cc.Node, pOrCpp, size?: cc.Size) {
    var lt, rt, lb, rb;

    var xScale, yScale;
    if (pOrCpp == null) {
        xScale = yScale = 1;
    } else if (pOrCpp.x == null) {
        xScale = yScale = pOrCpp;
    } else {
        xScale = pOrCpp.x;
        yScale = pOrCpp.y;
    }

    var facX = (1 - xScale) / 2;
    var facY = (1 - yScale) / 2;

    size = size || node.getContentSize();
    lt = node.convertToWorldSpace(cc.p(size.width * facX, size.height * (1 - facY)));
    rt = node.convertToWorldSpace(cc.p(size.width * (1 - facX), size.height * (1 - facY)));
    lb = node.convertToWorldSpace(cc.p(size.width * facX, size.height * facY));
    rb = node.convertToWorldSpace(cc.p(size.width * (1 - facX), size.height * facY));

    return {lt: lt, rt: rt, lb: lb, rb: rb};
};

/**
 * 初始随机种子
 * @type {number}
 */
let randseek = (new Date().getTime()) & 0x7fff;

/**
 * 设置随机种子
 * @param seek
 */
ttutil.srand = function (seek) {
    randseek = seek;
};

ttutil.RandMax = 233280;

/**
 * 产生 0到ttutil.RandMax的伪随机数， 随机质量不如 js自带， 仅用于， 减少网络io， 服务端下发随机种子， 客户端依此产生随机数控制， 保证各客户端一致
 * @returns {number}
 */
ttutil.random = function () {
    //randseek = (((randseek * 214013 + 2531011) >> 16) & 0x7fff);
    randseek = (randseek * 9301 + 49297) % ttutil.RandMax;
    return randseek;
};

ttutil.calcRotation = function (st, ed) {

    var angle = Math.atan2(ed.y - st.y, ed.x - st.x);
    var rotation = -angle * 180.0 / Math.PI;
    return rotation;
};

/**
 * 把角度变换在0到Math.PI*2之间
 * @param angle
 * @returns {*}
 */
ttutil.angleRange = function (angle) {

    var t = Math.PI * 2;

    while (angle < 0) {
        angle += t;
    }

    while (angle > t) {
        angle -= t;
    }
    return angle;
};

/**
 * 通过所在点， 及角度， 计算， 按这个角度出发， 会在哪个点游出屏幕外
 * @param angle
 * @param src
 */
ttutil.getTargetPoint = function (angle, src) {

    var target = cc.p();
    angle = ttutil.angleRange(angle);

    var t = 300;

    if (angle == 0 || angle == Math.PI * 2) {
        target.x = -t;
        target.y = src.y;
    }
    else if (angle == Math.PI / 2) {
        target.x = src.x;
        target.y = -t;
    }
    else if (angle == Math.PI) {

        target.x = V.w + t;
        target.y = src.y;
    }
    else if (angle == Math.PI / 2 * 3) {

        target.x = src.x;
        target.y = V.h + t;
    }
    else if (angle > 0 && angle < Math.PI / 2) {
        target.x = -t;
        target.y = src.y - (src.x + t) * Math.tan(angle);
    }
    else if (angle > Math.PI / 2 && angle < Math.PI) {
        target.x = V.w + t;
        target.y = src.y + (V.w - src.x + t) * Math.tan(angle);

    }
    else if (angle > Math.PI && angle < 3 * Math.PI / 2) {

        target.x = V.w + t;
        target.y = src.y + (V.w - src.x + t) * Math.tan(angle);
    }
    else {
        target.x = -t;
        target.y = src.y - (src.x + t) * Math.tan(angle);
    }

    return target;
};


