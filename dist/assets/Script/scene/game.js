"use strict";

var subGameMSG = require("SubGameMSG").subGameMSG;
var GD = require("GD");
var define = require("define");
var GameLogic = require("GameLogic");

cc.Class({
    extends: cc.Component,

    properties: {
        //by_009:牌背面
        card_back: cc.Node,

        //by_009:下拉菜单
        downList: cc.Prefab,

        //by_009:桌面上的按钮
        desk_btns: cc.Node,
        //by_009:桌面上的提示文本
        desk_hint_txt: cc.Node,

        //by_009:动画节点
        animNode: cc.Node,

        //by_009:闹钟
        clock: cc.Node,

        //by_009:座位组
        seatGroup: cc.Node,

        //by_009:扑克图集
        pokerAtlas: cc.SpriteAtlas,
        //by_009:牛数图集
        niu_shu_Atlas: cc.SpriteAtlas,

        //by_009:下注节点
        betNode: cc.Node,

        //by_009:筹码图集
        jettonAtlas: cc.SpriteAtlas,

        //by_009:会员等级图集
        memberOrderAtlas: cc.SpriteAtlas,

        //by_009:头像图集
        faceAtlas: cc.SpriteAtlas,

        //by_009:战绩节点
        record: cc.Node

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        this.AudioControl = cc.find("Canvas").getComponent("AudioControl");
        this.AudioControl.playBGM();

        //by_009:给桌面上的按钮注册事件
        for (var i = 0; i < this.desk_btns.childrenCount; i++) {
            this.desk_btns.children[i].on(cc.Node.EventType.TOUCH_END, this.click_btn_event, this);
        }

        //by_009:下注分的按钮注册事件
        var betBtnGroup = cc.find("betBtnGroup", this.betNode);
        for (var i = 0; i < betBtnGroup.childrenCount; i++) {
            betBtnGroup.children[i].on(cc.Node.EventType.TOUCH_END, this.clickBetScore, this);
        }

        this.bindEvent();
        GD.clientKernel.getRoomInfo(); //获取房间信息，加载游戏场景之后需要调用这个 ，用来获取场景信息，游戏状态，恢复场景、重连等等
        GD.chairID = GD.clientKernel.getMeChairID();
        //window.chairID=GD.chairID;

        this.getSeatInfo();
    },
    bindEvent: function bindEvent() {
        this.bindObj = [];
        this.bindObj.push(onfire.on("onGotRoomInfo", this.onGotRoomInfo.bind(this)));
        this.bindObj.push(onfire.on("onEventSceneMessage", this.onEventSceneMessage.bind(this)));
        this.bindObj.push(onfire.on("onEventGameMessage", this.onEventGameMessage.bind(this)));
        this.bindObj.push(onfire.on("onEventUserLeave", this.onEventUserLeave.bind(this)));
        this.bindObj.push(onfire.on("UserStatusChanged", this.UserStatusChanged.bind(this)));
    },
    onDestroy: function onDestroy() {
        for (var i = 0; i < this.bindObj.length; i++) {
            onfire.un(this.bindObj[i]);
        }
    },


    //by_009:显示与隐藏_规则菜单
    showHideRuleMenu: function showHideRuleMenu() {
        if (this.ruleMenu.active == false) {
            this.ruleMenu.active = true;
            this.ruleMenu.getComponent(cc.Animation).play();
        } else {
            this.ruleMenu.active = false;
        }
    },


    //by_009:点击桌面上按钮
    click_btn_event: function click_btn_event(event) {
        console.log(event.currentTarget.name);
        // return;
        switch (event.currentTarget.name) {
            case "btn_rule":
                this.showHideRuleMenu();
                break;
            case "btn_start":
                GD.clientKernel.sendUserReady();
                break;
            case "btn_call_banker":
                GD.clientKernel.sendSocketData(define.gameCMD.MDM_GF_GAME, subGameMSG.C_CALL_BANKER, { banker: true });
                break;
            case "btn_not_call":
                GD.clientKernel.sendSocketData(define.gameCMD.MDM_GF_GAME, subGameMSG.C_CALL_BANKER, { banker: false });
                break;
            case "btn_on_off":
                this.showDownList();
                break;
            case "btn_showdown":
                GD.clientKernel.sendSocketData(define.gameCMD.MDM_GF_GAME, subGameMSG.C_OPEN_CARD, {});
                break;
            default:
                console.log("default");
                break;
        }
    },


    /**
     * 发送子游戏事件
     * @param subCMD
     * @param data
     */
    sendGameData: function sendGameData(subCMD, data) {
        GD.clientKernel.sendSocketData(gameCMD.MDM_GF_GAME, subCMD, data);
    },

    //by_009:获取房间配置
    onGotRoomInfo: function onGotRoomInfo(subCMD, data) {
        console.log("获取房间配置 : ", "subCMD", subCMD, "data", data);
    },


    //by_009:获取座位信息
    getSeatInfo: function getSeatInfo() {
        for (var i = 0; i < 2; i++) {
            var data = GD.clientKernel.getTableUserItem(i);
            console.log("获取座位信息", data);
            if (data != undefined) {
                var seatID = this.getRelativeSeatID(data.chairID, GD.chairID);
                console.log("seatIDseatIDseatID", seatID);
                var seat = this.seatGroup.children[seatID];
                seat.active = true;
                cc.find("userFrame/nickname", seat).getComponent(cc.Label).string = data.nickname;
                cc.find("userFrame/score", seat).getComponent(cc.Label).string = data.score / 10000 + "万";
                cc.find("userFrame/userID", seat).getComponent(cc.Label).string = data.userID;
                cc.find("userFrame/face", seat).getComponent(cc.Sprite).spriteFrame = this.faceAtlas._spriteFrames[data.faceID];
                cc.find("userFrame/memberOrder", seat).getComponent(cc.Sprite).spriteFrame = this.memberOrderAtlas._spriteFrames[data.memberOrder];

                if (seat == 0) {
                    //自己
                    this.AudioControl.sex = data.sex;
                }

                if (data.userStatus == define.gameConst.US_READY) {
                    cc.find("ready_font", seat).active = true;
                }
            }
        }
    },

    //by_009:监听用户进入
    onEventUserEnter: function onEventUserEnter(data) {
        console.log("监听用户进入", data);
        var seatID = this.getRelativeSeatID(data.chairID, GD.chairID);

        var seat = this.seatGroup.children[seatID];
        seat.active = true;
        cc.find("userFrame/nickname", seat).getComponent(cc.Label).string = data.nickname;
        cc.find("userFrame/score", seat).getComponent(cc.Label).string = data.score / 10000 + "万";
        cc.find("userFrame/userID", seat).getComponent(cc.Label).string = data.userID;
        cc.find("userFrame/face", seat).getComponent(cc.Sprite).spriteFrame = this.faceAtlas._spriteFrames[data.faceID];
        cc.find("userFrame/memberOrder", seat).getComponent(cc.Sprite).spriteFrame = this.memberOrderAtlas._spriteFrames[data.memberOrder + ""];
    },

    //by_009:监听用户离开
    onEventUserLeave: function onEventUserLeave(data) {
        console.log("监听用户离开", data);
        var seatID = this.getRelativeSeatID(data.chairID, GD.chairID);
        var seat = this.seatGroup.children[seatID];
        seat.active = false;
    },

    //by_009:玩家状态发生改变
    UserStatusChanged: function UserStatusChanged(data) {
        console.log("玩家状态发生改变", data);
        if (data.userStatus == define.gameConst.US_READY) {
            console.log("准备了");
            //删除筹码
            if (typeof this.jetton != "undefined") {
                this.jetton.destroy();
            }
            //隐藏庄家图标  删除手中扑克 隐藏牌型
            for (var i = 0; i < this.seatGroup.childrenCount; i++) {
                var banker_flag = cc.find("banker_flag", this.seatGroup.children[i]);
                if (banker_flag.active == true) {
                    banker_flag.active = false;
                }
                var cardGroup = cc.find("cardGroup", this.seatGroup.children[i]);
                cardGroup.destroyAllChildren();
                cc.find("niu_shu", this.seatGroup.children[i]).active = false;
            }
            //隐藏下注信息
            this.betNode.active = false;
            cc.find("bet_info/label", this.betNode).getComponent(cc.Label).string = "";

            var seatID = this.getRelativeSeatID(data.chairID, GD.chairID);
            if (seatID == 0) {
                //自己
                cc.find("btn_start", this.desk_btns).active = false;
            } else {
                // this.showCountdown(true,15,GD.chairID);
            }
            var seat = this.seatGroup.children[seatID];
            cc.find("ready_font", seat).active = true;

            //未准备的，显示倒计时
            for (var i = 0; i < this.seatGroup.childrenCount; i++) {
                var seatID = this.getRelativeSeatID(i, GD.chairID);
                var ready_font = cc.find("ready_font", this.seatGroup.children[seatID]);
                if (ready_font.active == false) {
                    this.showCountdown(true, 15, i);
                }
            }
        } else if (data.userStatus == define.gameConst.US_PLAYING) {
            //游戏状态
            var seatID = this.getRelativeSeatID(data.chairID, GD.chairID);
            var seat = this.seatGroup.children[seatID];
            cc.find("ready_font", seat).active = false;
        } else if (data.userStatus == define.gameConst.US_SIT) {
            //坐下状态
            setTimeout(function () {
                cc.find("btn_start", this.desk_btns).active = true;
            }.bind(this), 1500);
        }
    },

    //by_009:监听游戏信息
    onEventGameMessage: function onEventGameMessage(subCMD, data) {

        console.log("监听游戏信息 : ", "subCMD", subCMD, "data", data);

        switch (subCMD) {
            case subGameMSG.S_CALL_BANKER:
                this.onSubCallBanker(data);
                break;
            case subGameMSG.S_GAME_START:
                this.onSubGameStart(data);
                break;
            case subGameMSG.S_ADD_SCORE:
                this.onSubAddScore(data);
                break;
            case subGameMSG.S_SEND_CARD:
                this.onSubSendCard(data);
                break;
            case subGameMSG.S_SINGLE_OPEN_CARD:
                this.onSubSingleOpenCard(data);
                break;
            case subGameMSG.S_ALL_OPEN_CARD:
                this.onSubAllOpenCard(data);
                break;
            case subGameMSG.S_PLAYER_EXIT:
                this.onSubPlayerExit(data);
                break;
            case subGameMSG.S_GAME_END:
                this.onSubGameEnd(data);
                break;
            case subGameMSG.S_DISMISS_GAME:
                this.onSubDismiss(data);
                break;
            default:
                return true;
        }
    },

    //by_009:监听场景信息
    onEventSceneMessage: function onEventSceneMessage(gameStatus, data) {
        // GD.coreConfig = data.coreConfig;

        console.log("监听场景信息 : ", "subCMD", gameStatus, "data", data);
    },

    //by_009:叫庄
    onSubCallBanker: function onSubCallBanker(data) {
        console.log("叫庄", data);
        var btn_qiang = cc.find("btn_call_banker", this.desk_btns);
        var btn_bu_qiang = cc.find("btn_not_call", this.desk_btns);

        //显示倒计时
        this.showCountdown(false);
        this.showCountdown(true, 20, data.caller);

        if (data.firstCall) {
            if (data.caller == GD.chairID) {
                //自己
                btn_qiang.active = true;
                btn_bu_qiang.active = true;
            } else {
                cc.find("wait_callbanker", this.desk_hint_txt).active = true;
            }
        } else {
            var seatID = this.getRelativeSeatID(data.lastCaller, GD.chairID);
            var seat = this.seatGroup.children[seatID];
            cc.find("nocall_font", seat).active = true;
        }

        //上一个玩家不叫，做出处理
        if (data.lastCaller != null) {

            console.log("上一个玩家不叫，做出处理");
            this.AudioControl.playBujiao();

            if (data.caller == GD.chairID) {
                cc.find("wait_callbanker", this.desk_hint_txt).active = false;
                btn_qiang.active = true;
                btn_bu_qiang.active = true;
            } else {
                btn_qiang.active = false;
                btn_bu_qiang.active = false;
                cc.find("wait_callbanker", this.desk_hint_txt).active = true;
            }
        }
    },

    //by_009:游戏开始 下注
    onSubGameStart: function onSubGameStart(data) {
        console.log("游戏开始 下注", data);

        //隐藏不出
        for (var i = 0; i < this.seatGroup.childrenCount; i++) {
            var nocall_font = cc.find("nocall_font", this.seatGroup.children[i]);
            if (nocall_font.active == true) {
                nocall_font.active = false;
            }
        }
        //显示庄家
        var seatID = this.getRelativeSeatID(data.banker, GD.chairID);
        var seat = this.seatGroup.children[seatID];
        cc.find("banker_flag", seat).active = true;
        this.AudioControl.playBanker();
        this.betNode.active = true;
        cc.find("btn_call_banker", this.desk_btns).active = false;
        cc.find("btn_not_call", this.desk_btns).active = false;
        cc.find("wait_callbanker", this.desk_hint_txt).active = false;

        if (data.banker == GD.chairID) {
            //自己
            cc.find("wait_bet", this.desk_hint_txt).active = true;
        } else {
            var betBtnGroup = cc.find("betBtnGroup", this.betNode);
            betBtnGroup.active = true;
            var maxChip = data.maxChip[GD.chairID];
            for (var i = 0; i < betBtnGroup.childrenCount; i++) {
                cc.find("label", betBtnGroup.children[i]).getComponent(cc.Label).string = maxChip;
                maxChip = Math.floor(maxChip / 2);
            }
            cc.find("bet_info/label", this.betNode).getComponent(cc.Label).string = "";
            console.log("最大可下注：", data.maxChip[GD.chairID]);
        }

        //不是庄家的都显示倒计时
        this.showCountdown(false);
        for (var i = 0; i < this.seatGroup.childrenCount; i++) {
            var seatID = this.getRelativeSeatID(i, GD.chairID);
            var banker_flag = cc.find("banker_flag", this.seatGroup.children[seatID]);
            if (banker_flag.active == false) {
                this.showCountdown(true, 20, i);
            }
        }
    },

    //by_009:点击下注分按钮
    clickBetScore: function clickBetScore(event) {
        var score = event.currentTarget.children[0].getComponent(cc.Label).string;
        GD.clientKernel.sendSocketData(define.gameCMD.MDM_GF_GAME, subGameMSG.C_ADD_SCORE, { chipScore: score });
    },


    //by_009:加注
    onSubAddScore: function onSubAddScore(data) {
        console.log("加注", data);

        cc.find("betBtnGroup", this.betNode).active = false;
        cc.find("bet_info/label", this.betNode).getComponent(cc.Label).string = data.chipScore;
        cc.find("wait_bet", this.desk_hint_txt).active = false;

        var seatID = this.getRelativeSeatID(data.chairID, GD.chairID);
        var seat = this.seatGroup.children[seatID];
        this.jetton = this.randomCreateJetton(data.chipScore);
        this.AudioControl.playJetton();
        this.jetton.parent = cc.find("jettonNode", seat);
        this.jetton.setScale(0.1, 0.1);
        var newVec2 = this.seatGroup.parent.convertToWorldSpaceAR(this.seatGroup.position);

        var Vec2 = cc.find("jettonNode", seat).convertToNodeSpaceAR(newVec2);
        var moveTo = cc.moveTo(0.3, Vec2);
        var scaleTo = cc.scaleTo(0.3, 1, 1);
        this.jetton.runAction(cc.spawn(moveTo, scaleTo));
    },

    //by_009:发牌
    onSubSendCard: function onSubSendCard(data) {
        console.log("发牌", data);

        cc.find("wait_bet", this.desk_hint_txt).active = false;

        //显示倒计时
        this.showCountdown(false);
        for (var i = 0; i < 2; i++) {
            this.showCountdown(true, 20, i);
        }

        //播放发牌动画
        var a = 0;
        this.schedule(function () {
            var seatID = this.getRelativeSeatID(a, GD.chairID);
            var seat = this.seatGroup.children[seatID];
            this.cardAction(seat);
            a++;
        }, 0.2, 2 - 1, 0);

        this.cardData = data.cardData; //所有玩家开牌时要用到
        setTimeout(function () {
            //手牌赋值
            for (var i = 0; i < 2; i++) {
                var seatID = this.getRelativeSeatID(i, GD.chairID);
                var seat = this.seatGroup.children[seatID];
                var cardGroup = cc.find("cardGroup", seat);
                for (var j = 0; j < data.cardData[i].length; j++) {
                    var card_front = cc.find("card_front", cardGroup.children[j]);
                    this.setCardValue(card_front, data.cardData[i][j]);
                }
                //写入牌型
                var result = GameLogic.getCardType(data.cardData[i]);
                var type = "niu_" + result.type;
                var niu_shu = cc.find("niu_shu", seat);
                niu_shu.getComponent(cc.Sprite).spriteFrame = this.niu_shu_Atlas._spriteFrames[type];
            }
        }.bind(this), 1300);

        setTimeout(function () {
            var cardGroup = cc.find("cardGroup", this.seatGroup.children[0]);
            for (var index = 0; index < cardGroup.childrenCount; index++) {
                cardGroup.children[index].getComponent(cc.Animation).play();
            }

            cc.find("btn_showdown", this.desk_btns).active = true;
        }.bind(this), 1400);
    },

    //by_009:单个玩家开牌
    onSubSingleOpenCard: function onSubSingleOpenCard(data) {
        console.log("单个玩家开牌", data);
        if (data.chairID == GD.chairID) {
            cc.find("btn_showdown", this.desk_btns).active = false;
        } else {
            // this.separate_card_anim(data.chairID);
        }
    },

    //by_009:所有玩家开牌
    onSubAllOpenCard: function onSubAllOpenCard(data) {
        console.log("所有玩家开牌", data);

        this.showCountdown(false);

        cc.find("btn_showdown", this.desk_btns).active = false;

        for (var i = 0; i < 2; i++) {
            var seatID = this.getRelativeSeatID(i, GD.chairID);
            var seat = this.seatGroup.children[seatID];

            var cardGroup = cc.find("cardGroup", seat);
            var result = GameLogic.getCardType(this.cardData[i]);
            for (var index = 0; index < result.pop.length; index++) {
                if (result.pop[index] == true) {
                    //弹起的牌
                    cardGroup.children[index].y += 20;
                    cardGroup.children[index].children[0].color = new cc.Color(120, 120, 120, 255);
                }
            }
            //牌翻转动画
            for (var j = 0; j < cardGroup.childrenCount; j++) {
                cardGroup.children[j].getComponent(cc.Animation).play();
            }
            var niu_shu = cc.find("niu_shu", seat);
            niu_shu.active = true;
        }
    },

    //by_009:玩家逃跑
    onSubPlayerExit: function onSubPlayerExit(data) {
        console.log("玩家逃跑", data);
    },

    //by_009:游戏结束
    onSubGameEnd: function onSubGameEnd(data) {
        console.log("游戏结束", data);

        //播放win动画
        var winner = null;
        if (data.score[0] > data.score[1]) {
            winner = 0;
        } else {
            winner = 1;
        }
        var seatID = this.getRelativeSeatID(winner, GD.chairID);
        var win = cc.find("win", this.animNode);

        var pokerNode = cc.find("pokerNode", this.seatGroup.children[seatID]);
        var newVec2 = pokerNode.parent.convertToWorldSpaceAR(pokerNode.position);
        var Vec2 = win.parent.convertToNodeSpaceAR(newVec2);
        win.position = Vec2;
        win.active = true;
        win.getComponent(cc.Animation).play();

        setTimeout(function () {
            //播放shu _ ying动画
            var anim = null;
            var effects = null;
            if (winner == GD.chairID) {
                //赢
                this.AudioControl.playWinOrLose(0);

                anim = cc.find("jieSuan_ying", this.animNode);
                setTimeout(function () {
                    cc.find("jieSuan_ying/light", this.animNode).getComponent(cc.Animation).play();
                }.bind(this), 200);
            } else {
                //输
                this.AudioControl.playWinOrLose(1);

                anim = cc.find("jieSuan_shu", this.animNode);
                setTimeout(function () {
                    cc.find("jieSuan_shu/dust", this.animNode).getComponent(sp.Skeleton).setAnimation(0, 'animation', false);
                }.bind(this), 200);
            }
            anim.active = true;
            anim.getComponent(cc.Animation).play();

            //写入值
            var content = cc.find("bg/content", anim);
            for (var i = 1; i < content.childrenCount; i++) {
                //删除原先的
                content.children[i].destroy();
            }
            for (var i = 0; i < 2; i++) {
                //新增现有的
                var player = cc.instantiate(content.children[0]);
                player.parent = content;
                player.active = true;
                cc.find("nickname", player).getComponent(cc.Label).string = data.nickname[i];
                var score = data.score[i];
                if (score >= 0) {
                    score = "+" + score;
                    cc.find("score", player).color = new cc.Color(255, 0, 0, 255);
                } else {
                    score = "-" + score;
                    cc.find("score", player).color = new cc.Color(0, 255, 0, 255);
                }
                cc.find("score", player).getComponent(cc.Label).string = data.score[i];
                var type = data.type[i];
                type = type == "0" ? "无牛" : type == "1" ? "牛一" : type == "2" ? "牛二" : type == "3" ? "牛三" : type == "4" ? "牛四" : type == "5" ? "牛五" : type == "6" ? "牛六" : type == "7" ? "牛七" : type == "8" ? "牛八" : type == "9" ? "牛九" : type == "10" ? "牛牛" : "";
                cc.find("type", player).getComponent(cc.Label).string = type;
            }
            //更新分数
            for (var i = 0; i < 2; i++) {
                var seatID = this.getRelativeSeatID(i, GD.chairID);
                var seatScore = cc.find("userFrame/score", this.seatGroup.children[seatID]);
                var score = seatScore.getComponent(cc.Label).string;
                score = parseInt(score.substr(0, score.length - 1)) * 10000;
                score += data.score[i];
                seatScore.getComponent(cc.Label).string = score / 10000 + "万";
            }

            //更新战绩统计
            var all = cc.find("all/value", this.record);
            var allScore = all.getComponent(cc.Label).string;
            var result = parseInt(allScore) + data.score[GD.chairID];
            all.getComponent(cc.Label).string = result >= 0 ? "+" + result : result;
            var last = cc.find("last/value", this.record);
            var allScore = all.getComponent(cc.Label).string;
            var result = data.score[GD.chairID];
            last.getComponent(cc.Label).string = result >= 0 ? "+" + result : result;
        }.bind(this), 1000);
    },

    //by_009:解散
    onSubDismiss: function onSubDismiss(data) {
        console.log("解散", data);
    },

    //by_009:给牌节点赋入牌值
    setCardValue: function setCardValue(cardNode, cardValue) {
        var color = GameLogic.getCardColor(cardValue);
        var value = GameLogic.getCardValue(cardValue);
        cardNode.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas._spriteFrames["card_" + color + "_" + value];
    },


    //by_009:随机创建筹码
    randomCreateJetton: function randomCreateJetton(numValue) {
        // this.jettonAtlas
        var jettonNode = new cc.Node("jetton");
        // jettonNode.parent=cc.find("Canvas");
        console.log("numValue", numValue);
        var jetton = null;
        do {
            if (numValue >= 10000000) {
                numValue -= 10000000;
                jetton = new cc.Node("jetton");
                jetton.addComponent(cc.Sprite).spriteFrame = this.jettonAtlas._spriteFrames["game-jetton-1000w"];
                jetton.parent = jettonNode;
                jetton.x += parseInt(Math.random() * 150);
                jetton.y -= parseInt(Math.random() * 100);
                continue;
            } else if (numValue >= 5000000) {
                numValue -= 5000000;
                jetton = new cc.Node("jetton");
                jetton.addComponent(cc.Sprite).spriteFrame = this.jettonAtlas._spriteFrames["game-jetton-500w"];
                jetton.parent = jettonNode;
                jetton.x += parseInt(Math.random() * 150);
                jetton.y -= parseInt(Math.random() * 100);
                continue;
            } else if (numValue >= 1000000) {
                numValue -= 1000000;
                jetton = new cc.Node("jetton");
                jetton.addComponent(cc.Sprite).spriteFrame = this.jettonAtlas._spriteFrames["game-jetton-100w"];
                jetton.parent = jettonNode;
                jetton.x -= parseInt(Math.random() * 150);
                jetton.y -= parseInt(Math.random() * 100);
                continue;
            } else if (numValue >= 100000) {
                numValue -= 100000;
                jetton = new cc.Node("jetton");
                jetton.addComponent(cc.Sprite).spriteFrame = this.jettonAtlas._spriteFrames["game-jetton-10w"];
                jetton.parent = jettonNode;
                jetton.x += parseInt(Math.random() * 150);
                jetton.y += parseInt(Math.random() * 100);
                continue;
            } else if (numValue >= 10000) {
                numValue -= 10000;
                jetton = new cc.Node("jetton");
                jetton.addComponent(cc.Sprite).spriteFrame = this.jettonAtlas._spriteFrames["game-jetton-1w"];
                jetton.parent = jettonNode;
                jetton.x -= parseInt(Math.random() * 150);
                jetton.y += parseInt(Math.random() * 100);
                continue;
            } else if (numValue >= 1000) {
                numValue -= 1000;
                jetton = new cc.Node("jetton");
                jetton.addComponent(cc.Sprite).spriteFrame = this.jettonAtlas._spriteFrames["game-jetton-1000"];
                jetton.parent = jettonNode;
                jetton.x -= parseInt(Math.random() * 100);
                jetton.y += parseInt(Math.random() * 100);
                continue;
            } else if (numValue >= 100) {
                numValue -= 100;
                jetton = new cc.Node("jetton");
                jetton.addComponent(cc.Sprite).spriteFrame = this.jettonAtlas._spriteFrames["game-jetton-100"];
                jetton.parent = jettonNode;
                jetton.x += parseInt(Math.random() * 100);
                jetton.y += parseInt(Math.random() * 100);
                continue;
            } else if (numValue >= 10) {
                numValue -= 10;
                jetton = new cc.Node("jetton");
                jetton.addComponent(cc.Sprite).spriteFrame = this.jettonAtlas._spriteFrames["game-jetton-10"];
                jetton.parent = jettonNode;
                jetton.x += parseInt(Math.random() * 100);
                jetton.y += parseInt(Math.random() * 100);
                continue;
            } else if (numValue >= 1) {
                numValue -= 1;
                jetton = new cc.Node("jetton");
                jetton.addComponent(cc.Sprite).spriteFrame = this.jettonAtlas._spriteFrames["game-jetton-1"];
                jetton.parent = jettonNode;
                jetton.x -= parseInt(Math.random() * 100);
                jetton.y += parseInt(Math.random() * 100);
                continue;
            }
        } while (numValue > 0);
        //var jettonNode = [10000,1000]
        var count = jettonNode.childrenCount - 1;
        for (var i = count; i >= 0; i--) {
            jettonNode.children[i].setSiblingIndex(count);
        }
        return jettonNode;
    },


    //by_009:展示倒计时
    showCountdown: function showCountdown() {
        var isShow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
        var chairID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : GD.chairID;

        if (isShow) {
            var seatID = this.getRelativeSeatID(chairID, GD.chairID);
            // var seatID=chairID;
            this.clock.getComponent("clock").time = time;
            this.clock.active = true;
            var timerFrame = cc.find("userFrame/userHeadBG/timerFrame", this.seatGroup.children[seatID]);
            timerFrame.getComponent("TimerFrame").time = time;
            timerFrame.active = true;
        } else {
            this.clock.active = false;
            // var seatID=this.getRelativeSeatID(chairID,GD.chairID);
            // cc.find("userFrame/userHeadBG/timerFrame",this.seatGroup.children[seatID]).active = false;
            for (var i = 0; i < 2; i++) {
                cc.find("userFrame/userHeadBG/timerFrame", this.seatGroup.children[i]).active = false;
            }
        }
    },


    //by_009:发牌动画
    cardAction: function cardAction(seat) {
        var index = 0;
        this.schedule(function () {
            var newVec2 = cc.find("pokerNode", seat).convertToWorldSpaceAR(cc.find("pokerNode", seat).children[index].position);
            var Vec2 = cc.find("Canvas").convertToNodeSpaceAR(newVec2);
            var moveTo = cc.moveTo(0.5, Vec2);

            this.AudioControl.playSendCard();

            var card_back = cc.instantiate(this.card_back);
            // goldArray.push(gold);
            card_back.parent = cc.find("Canvas");
            card_back.active = true;
            var callFunc = cc.callFunc(function () {
                card_back.parent = cc.find("cardGroup", seat);
            });
            card_back.runAction(cc.sequence(moveTo, callFunc));
            index++;
        }, 0.05, 4, 0);
    },


    //by_009:【该座位相对与自己座位的值】
    //算出该座位相对与自己座位的值——传入需查座位id，自己的座位id，座位总数
    getRelativeSeatID: function getRelativeSeatID(chairID, myChairID) {
        var chairCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

        return (chairID + chairCount - myChairID) % chairCount;
        // return (chairID + parseInt(chairCount * 3 / 2) - myChairID) % chairCount;
    },


    //by_009:【显示下拉菜单】
    showDownList: function showDownList() {
        var newNode = cc.instantiate(this.downList);
        cc.find("Canvas").addChild(newNode);
    }
}

// update (dt) {},
);
//# sourceMappingURL=game.js.map