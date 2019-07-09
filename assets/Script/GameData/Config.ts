/**
 * Created by 黄二杰 on 2015/7/27.
 */
import {FishKind} from "./SubGameMSG";

//设计分辨率
var V = {
    w: 1366,
    h: 768,
    left: 0,    //全面屏适配view的左边
    right: 0,   //全面屏适配view的右边
};
V.width = V.w;
V.height = V.h;


var PING_INTERVAL = 3;       //ping间隔时间为3秒
//滚轮滑动比例
//var GScrollRatio = 120;

//是否启动加分数动画， 易斗蓝鲸不启用
var GAddScoreAni = true;

//游戏自定义事件
var GGameEvent = {
    ON_CLICK_SETTING_BUTTON: "onClickSettingButton",
    ON_CLICK_HELP_BUTTON: "onClickHelpButton",
    ON_CLICK_AUTO_FIRE_BUTTON: "onClickAutoFireButton",
    ON_CLICK_CANCEL_AUTO_FIRE_BUTTON: "onClickCancelAutoFireButton",
    ON_CLICK_CLOSE_GAME_BUTTON: "onClickCloseGameButton",
    ON_CLICK_SETTLEMENT_BUTTON: "onClickSettlementButton",
    ON_AUTO_FIRE_CHANGE: "onAutoFireChange",
    ///////////////////////////////////////////////////////////////////////////
    ON_CLICK_ADD_MUL: "onClickAddMul",                               //点击加炮
    ON_CLICK_SUB_MUL: "onClickSubMul",                               //点击减炮
    /////////////////////////////////////////////////////////////////////////////
    ON_MOBILE_LOCK_FISH: "onMobileLockFish",               //当手机端点击锁鱼按钮
    ON_MOBILE_LOCK_FISH_FINISH: "onMobileLockFishFinish",         //当手机端锁鱼完成
    ON_CLICK_LOCK_FISH: "onLockFish",                               //锁鱼
    ON_CLICK_UNLOCK_FISH: "onUnlockFish",                           //解锁
    ON_IS_LOCK_FISH_CHANGE: "onIsLockFishChange",                   //当是否是锁鱼状态发生改变
    /////////////////////////////////////////////////////////////////////////////////
    // ON_ENTER_RAGE_MODE: "onEnterRageMode",                      //点击狂暴模式
    // ON_EXIT_RAGE_MODE: "onExitRageMode",                    //点击取消狂暴模式
    ON_ENTER_SPEED1_MODE: "onEnterSpeed1Mode",                //点击极速模式
    ON_ENTER_SPEED2_MODE: "onEnterSpeed2Mode",                //点击极速模式
    ON_EXIT_SPEED_MODE: "onExitSpeedMode",                  //点击取消极速模式

    ON_Add_SPEED1_MODE:"onSpeed1Mode",   //点击了加速模式
    ON_Add_SPEED2_MODE:"onSpeed2Mode",   //点击了加速模式
    ON_CANCEL_SPEED_MODE:"onCancelSpeedMode", //移除加速模式
    /////////////////////////////////////////////////////////////////////////////////
};

// 玩家数量
var GPlayerNum = 4;

var GCannonPosArray;

//做成函数， 方便另一个地方调用 。。。
var fixGcannonPosArray = function () {
    GCannonPosArray = [
        {pos: cc.p(V.w * 0.35, V.h - 48), rotation: 180},        //0
        {pos: cc.p(V.w * 0.65, V.h - 48), rotation: 180},    //1
        {pos: cc.p(V.w * 0.65, 48), rotation: 0},  //2
        {pos: cc.p(V.w * 0.35, 48), rotation: 0},          //3
    ];
};
fixGcannonPosArray();

var GFontDef = {
    fontName: "黑体",
    fontSize: 22,
    fillStyle: cc.color(66, 209, 244, 255)
};

var GCoinConfig = {
    maxCoinLevelMul: 100,   //最大金币级别的打中鱼倍数
    stdCoinNum: 5,          //标准金币数量， 如果不足， 则会拆大的金币换成小的金币补上
    delayTime: 0.5,         //逗留时间
    flySpeed: 1500,         //飞行速度
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var AniType={
    FAT_FRAME:1,      //序列帧模式
    FAT_ARMATURE:2,   //CCS1.x模式
    FAT_SKELETON:3,   //ccs2.x模式
};
//鱼帧数
var GFishDieAniDT = 1;//鱼死亡动画播放一秒

//鱼正常动画帧数， 跟死亡动画帧数
var  GFishKindAnimationFN_FRAME = [];
GFishKindAnimationFN_FRAME[FishKind.FishKind1] = {norFN: 12, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind2] = {norFN: 16, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind3] = {norFN: 24, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind4] = {norFN: 24, dieFN: null};
GFishKindAnimationFN_FRAME[FishKind.FishKind5] = {norFN: 24, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind6] = {norFN: 25, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind7] = {norFN: 60, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind8] = {norFN: 20, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind9] = {norFN: 23, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind10] = {norFN: 16, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind11] = {norFN: 24, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind12] = {norFN: 12, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind13] = {norFN: 24, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind14] = {norFN: 20, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind15] = {norFN: 24, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind16] = {norFN: 24, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind17] = {norFN: 24, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind18] = {norFN: 16, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind19] = {norFN: 16, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.FishKind20] = {norFN: 16, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.AutoIncrement] = {norFN: 4, dieFN: null, interval: 1 / 5};
GFishKindAnimationFN_FRAME[FishKind.FixBomb] = {norFN: 6, dieFN: null,};
GFishKindAnimationFN_FRAME[FishKind.LocalBomb] = {norFN: 6, dieFN: null, interval: 1 / 5};
GFishKindAnimationFN_FRAME[FishKind.SuperBomb] = {norFN: 6, dieFN: null, interval: 1 / 5};


//鱼正常动画帧数， 跟死亡动画帧数
var GFishKindAnimationFN = [];
GFishKindAnimationFN[FishKind.FishKind1] = {aniType:AniType.FAT_FRAME,aniName:'xiaolvyu',dieTime:0,x:0,y:0,lockScale:1,liveScale:1.2,dieScale:1.5,
    boundingBox:[{r:22.504470027459,x:1.3961000442505,y:-2.969557762146,d:3.281366885350952,a:-1.131322938958118}]};

GFishKindAnimationFN[FishKind.FishKind2] = {aniType:AniType.FAT_FRAME,aniName:'xiaolvyu2',dieTime:0,x:0,y:0,lockScale:1,liveScale:1.2,dieScale:1.5,
    boundingBox:[{r:21.824445184457,x:6.784423828125,y:2.3541412353516,d:7.181252511617527,a:0.3339926355799608}]};

GFishKindAnimationFN[FishKind.FishKind3] = {aniType:AniType.FAT_FRAME,aniName:'xiaolanyu',dieTime:0,x:0,y:0,lockScale:1,liveScale:1,dieScale:1.5,
    boundingBox:[{r:30.057423114777,x:6.784423828125,y:3.1432800292969,d:7.477206431696733,a:0.43386584953619245}]};

GFishKindAnimationFN[FishKind.FishKind4] = {aniType:AniType.FAT_FRAME,aniName:'buyu8',dieTime:0,x:-10,y:0,lockScale:1,liveScale:1,dieScale:1.5,
    boundingBox:[{r:30,x:-4.6865234375,y:-0.892578125,d:4.770764890399162,a:-2.9533902989528995}]};

GFishKindAnimationFN[FishKind.FishKind5] = {aniType:AniType.FAT_FRAME,aniName:'buyu10',dieTime:0,x:0,y:0,lockScale:1,liveScale:0.9,dieScale:1.5,
    boundingBox:[{r:38.073241710663,x:3.808349609375,y:0.30496215820313,d:3.8205403629804287,a:0.07990674253564209}]};

GFishKindAnimationFN[FishKind.FishKind6] = {aniType:AniType.FAT_FRAME,aniName:'xiaochouyu',dieTime:0,x:0,y:0,lockScale:1,liveScale:0.95,dieScale:1.5,
    boundingBox:[{r:35.65820646286,x:4.689697265625,y:3.664794921875,d:5.95180495838123,a:0.6633312803282603}]};

GFishKindAnimationFN[FishKind.FishKind7] = {aniType:AniType.FAT_FRAME,aniName:'hetun',dieTime:0,x:-10,y:0,lockScale:1,liveScale:1,dieScale:1.5,
    boundingBox:[{r:34.4444,x:-4.2563152313232,y:0.3836498260498,d:4.273570701114223,a:3.051698968701788}]};

GFishKindAnimationFN[FishKind.FishKind8] = {aniType:AniType.FAT_FRAME,aniName:'buyu13',dieTime:0,x:-10,y:0,lockScale:1,liveScale:0.8,dieScale:1.5,
    boundingBox:[{r:35.250182151794,x:2.657958984375,y:-11.396824836731,d:11.702664753027335,a:-1.3416725854575526}]};

GFishKindAnimationFN[FishKind.FishKind9] = {aniType:AniType.FAT_FRAME,aniName:'denglongyu',dieTime:0,x:0,y:0,lockScale:1,liveScale:1,dieScale:1.2,
    boundingBox:[{r:38.836240768433,x:13.198904037476,y:-1.846848487854,d:13.327487277337346,a:-0.13902177613577005}]};

GFishKindAnimationFN[FishKind.FishKind10] = {aniType:AniType.FAT_FRAME,aniName:'xiaohaigui',dieTime:0,x:0,y:0,lockScale:1,liveScale:0.9,dieScale:1.5,
    boundingBox:[{r:52.545166015625,x:0,y:0,d:0,a:0}]};

GFishKindAnimationFN[FishKind.FishKind11] = {aniType:AniType.FAT_FRAME,aniName:'houtouyu',dieTime:0,x:0,y:0,lockScale:1,liveScale:0.9,dieScale:1.2,
    boundingBox:[{r:47.293607398152,x:6.611083984375,y:5.483241558075,d:8.589084318637255,a:0.6924132316594458}]};

GFishKindAnimationFN[FishKind.FishKind12] = {aniType:AniType.FAT_FRAME,aniName:'buyu7',dieTime:0,x:0,y:0,lockScale:1,liveScale:1,dieScale:1.5,
    boundingBox:[{r:56.766833132839,x:5.83203125,y:0.30426025390625,d:5.839962568637205,a:0.05212329102328539}]};

GFishKindAnimationFN[FishKind.FishKind13] = {aniType:AniType.FAT_FRAME,aniName:'buyu12',dieTime:1,x:0,y:0,lockScale:0.8,liveScale:1,dieScale:1.5,
    boundingBox:[{r:35,x:33.564697265625,y:-4.2975463867188,d:33.83870280431941,a:-0.12734482657723162},
        {r:34.2221594172,x:-35.100387573242,y:-3.4619045257568,d:35.27069592079602,a:-3.0432819375952365}]};

GFishKindAnimationFN[FishKind.FishKind14] = {aniType:AniType.FAT_FRAME,aniName:'jianyu',dieTime:1,x:0,y:0,lockScale:0.8,liveScale:1,dieScale:1.5,
    boundingBox:[{r:35.5556,x:53.904727935791,y:-5,d:54.13612189501246,a:-0.09249159079220257},
        {r:32.2222,x:-11.1111,y:-7.22222,d:13.252056630515884,a:-2.565217116653894},
        {r:23.3333,x:-68.8889,y:-5,d:69.07011324161849,a:-3.069139069146412}]};

GFishKindAnimationFN[FishKind.FishKind15] = {aniType:AniType.FAT_FRAME,aniName:'bianfuyu',dieTime:1,x:-15,y:0,lockScale:0.8,liveScale:0.9,dieScale:1.5,
    boundingBox:[{r:81.5703,x:10,y:0,d:10,a:0}]};

GFishKindAnimationFN[FishKind.FishKind16] = {aniType:AniType.FAT_FRAME,aniName:'shajing',dieTime:1,x:-40,y:0,lockScale:0.7,liveScale:1,dieScale:1.5,
    boundingBox:[{r:70,x:27.081298828125,y:-2.6675415039063,d:27.212359763410213,a:-0.09818451213436546},
        {r:45,x:-87.213989257813,y:-1.0928955078125,d:87.22083663238342,a:-3.129062114436628}]};

GFishKindAnimationFN[FishKind.FishKind17] = {aniType:AniType.FAT_FRAME,aniName:'shajinghuangjinban',dieTime:1,x:-40,y:0,lockScale:0.7,liveScale:1,dieScale:1.5,
    boundingBox:[{r:70,x:27.222534179688,y:-3.27197265625,d:27.418464074917274,a:-0.11961971080988992},
        {r:45,x:-87.463500976563,y:0.93951416015625,d:87.46854686076801,a:3.130851281284902}]};

GFishKindAnimationFN[FishKind.FishKind18] = {aniType:AniType.FAT_FRAME,aniName:'shayuhuangjinban',dieTime:1,x:-50,y:0,lockScale:0.5,liveScale:1,dieScale:1,
    boundingBox:[{r:68.3264,x:65.96061706543,y:0.46405029296875,d:65.96224940317529,a:0.0070351469982575035},
        {r:66.6667,x:-68.464782714844,y:-2.8273315429688,d:68.52313679221544,a:-3.100319960439327},
        {r:50,x:-185.07818603516,y:-1.056884765625,d:185.08120366874942,a:-3.135882238438706}]};

GFishKindAnimationFN[FishKind.FishKind19] = {aniType:AniType.FAT_FRAME,aniName:'shuimuhuangjinban',dieTime:1,x:0,y:0,lockScale:0.5,liveScale:1.15,dieScale:1,
    boundingBox:[{r:96.199996471405,x:4.92529296875,y:-0.07012939453125,d:4.925792216486147,a:-0.014237661849807235}]};

GFishKindAnimationFN[FishKind.FishKind20] = {aniType:AniType.FAT_FRAME,aniName:'yinlong',dieTime:1,x:-60,y:0,lockScale:0.5,liveScale:1,dieScale:1.5,
    boundingBox:[{r:65.5556,x:69.110717773438,y:4.831787109375,d:69.27941597494974,a:0.06980013805624255},
        {r:57.996107414865,x:-49.632568359375,y:4.6446533203125,d:49.84941971993177,a:3.0482836435130722},
        {r:47.68940448761,x:-154.31304931641,y:2.1405639648438,d:154.3278950916404,a:3.1277219751597034}]};
GFishKindAnimationFN[FishKind.AutoIncrement] = {aniType:AniType.FAT_FRAME,aniName:'shuimuhuangjinban',dieTime:1,x:0,y:0,lockScale:0.5,liveScale:1.15,dieScale:1,
    boundingBox:[{r:96.199996471405,x:4.92529296875,y:-0.07012939453125,d:4.925792216486147,a:-0.014237661849807235}]};

GFishKindAnimationFN[FishKind.FixBomb] = {aniType:AniType.FAT_FRAME,aniName:'jinlong',dieTime:1,x:-40,y:0,lockScale:0.5,liveScale:1,dieScale:1.5,
    boundingBox:[{r:72.450020688534,x:69.291870117188,y:2.4802856445313,d:69.33624651807826,a:0.03577948110207757},
        {r:54.4444,x:-56.728271484375,y:3.8804321289063,d:56.86083484360744,a:3.0732951950242136},
        {r:41.656980514526,x:-151.51837158203,y:4.9679870605469,d:151.59979492830416,a:3.1088163778736155}]};

GFishKindAnimationFN[FishKind.LocalBomb] = {aniType:AniType.FAT_FRAME,aniName:'longxia',dieTime:1,x:-20,y:0,lockScale:0.8,liveScale:1.15,dieScale:1,
    boundingBox:[{r:101.33328402662,x:-6.2132568359375,y:-0.8765869140625,d:6.27478805436723,a:-3.001434373596973}]};

GFishKindAnimationFN[FishKind.SuperBomb] = {aniType:AniType.FAT_FRAME,aniName:'zhangyuguai',dieTime:1,x:0,y:0,lockScale:0.7,liveScale:1,dieScale:1,
    boundingBox:[{r:122.2222,x:-102.52221679688,y:15.114868164063,d:103.63042109614082,a:2.9952169267135007}]};

GFishKindAnimationFN[FishKind.DaSanYuan] = {aniType:AniType.FAT_FRAME,aniName:'haiyao',dieTime:1,x:-80,y:0,lockScale:0.5,liveScale:1,dieScale:1.2,
    boundingBox:[{r:60,x:-57.907104492188,y:8.9021301269531,d:58.58737638319697,a:2.9890555983755},
        {r:50,x:50.449951171875,y:13.434936523438,d:52.20818989998964,a:0.2602621566292359},
        {r:60.656980514526,x:-177.66247558594,y:11.204162597656,d:178.01541644149654,a:3.0786117426451423}]};

GFishKindAnimationFN[FishKind.DaSiXi] = {aniType:AniType.FAT_FRAME,aniName:'shenxianchuan',dieTime:1,x:0,y:0,lockScale:0.5,liveScale:1,dieScale:1,
    boundingBox:[{r:121.06680481076,x:-14.63330078125,y:-25.658615112305,d:29.538077480363178,a:-2.0890969217433817}]};

GFishKindAnimationFN[FishKind.FishKing] = {aniType:AniType.FAT_FRAME,aniName:'longwang',dieTime:1,x:0,y:0,lockScale:0.4,liveScale:0.85,dieScale:1.5,
    boundingBox:[{r:122.35545,x:-0.364990234375,y:3.0787963867188,d:3.1003556347718977,a:1.6887952471031498}]};



//碰撞检测配置
////type为1时(子弹跟鱼都做为一个点， 判断距离（距离为子弹的宽度与高度的和 /3 + 鱼的宽度与高度的和 /3）), 2(子弹做为一个点， 鱼做为一个矩阵， 判断点是否在矩阵内）， 3（子弹做为矩阵， 鱼也做为矩阵， 精确判断）
//var GFishKindCollisionDetectionConfig = [];
//GFishKindCollisionDetectionConfig[FishKind.FishKind1] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind2] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind3] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind4] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind5] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind6] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind7] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind8] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind9] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind10] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind11] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind12] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind13] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind14] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind15] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind16] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind17] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind18] = {type: 1,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind19] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.FishKind20] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.AutoIncrement] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.FixBomb] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.LocalBomb] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.SuperBomb] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.DaSanYuan] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.DaSiXi] = {type: 2,};
//GFishKindCollisionDetectionConfig[FishKind.FishKing] = {type: 2,};

////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var GPlayerColor = [
    cc.color(114, 198, 243, 255),
    cc.color(36, 89, 173, 255),

    cc.color(110, 232, 133, 255),
    cc.color(156, 92, 187, 255),

    cc.color(199, 122, 35, 255),
    cc.color(255, 80, 80, 255),

    cc.color(173, 36, 129, 255),
    cc.color(158, 119, 57, 255),
];

var GPlayerScoreBackColor = [

    cc.color(0x40, 0x20, 0xff, 0xa0),
    cc.color(0xff, 0x80, 0x00, 0xa0),

    cc.color(0x80, 0xff, 0x00, 0xa0),
    cc.color(0xff, 0x00, 0xff, 0xa0),

    cc.color(0xff, 0xff, 0x00, 0xa0),
    cc.color(0xff, 0x00, 0x00, 0xa0),

    cc.color(0x02, 0x24, 0x59, 0xad),
    cc.color(0xad, 0x24, 0x81, 0xa0),
];

//锁鱼背景及魔能炮卡片的转动角度， 每秒 0.75圈
var GRotateAngle = Math.PI * 1.5;
//锁鱼及魔能炮， 背景的转动半径
var GRotateRadius = 10;


////捕鱼声音配置，当打中对应FishKind的鱼时， 播放配置中的一种声音（以鱼ID为随机种子， 产生随机数， 确定播放哪一种）
/*ar GFishDieSound = [];

GFishDieSound[FishKind.SmallLocalBomb] = ["boom", "superarm"];
GFishDieSound[FishKind.LocalBomb] = ["boom", "superarm"];
GFishDieSound[FishKind.SuperBomb] = ["boom", "superarm"];
GFishDieSound[FishKind.FixBomb] = ["boom", "superarm"];
GFishDieSound[FishKind.FishKing] = ["boom", "superarm"];
GFishDieSound[FishKind.RedFish] = ["boom", "superarm"];              //红鱼音效*/
var GEffectsSound={
    CANNON_SWITCH:"res/danaotiangong/sound/effect/MakeUP.mp3",
    CASTING_NORMAL:"res/danaotiangong/sound/effect/Net0.mp3",
    CASTING_ION:"res/danaotiangong/sound/effect/Net1.mp3",
    CATCH:"res/danaotiangong/sound/effect/Hit0.mp3",
    CATCH1:"res/danaotiangong/sound/effect/Hit1.mp3",
    CATCH2:"res/danaotiangong/sound/effect/Hit2.mp3",
    FIRE:"res/danaotiangong/sound/effect/Fire.mp3",
    IONFIRE:"res/danaotiangong/sound/effect/GunFire1.mp3",
    INSERT:"res/danaotiangong/sound/effect/ChangeScore.mp3",
    AWARD:"res/danaotiangong/sound/effect/award.mp3",
    BIGAWARD:"res/danaotiangong/sound/effect/bigAward.mp3",
    ROTARYTURN:"res/danaotiangong/sound/effect/rotaryturn.mp3",
    BINGO:"res/danaotiangong/sound/effect/CJ.mp3",
    BINGO2:"res/danaotiangong/sound/effect/TNNFDCLNV.mp3",
    WAVE:"res/danaotiangong/sound/effect/surf.mp3",
    BOMB_LASER:"res/danaotiangong/sound/effect/laser.mp3",
    BOMB_ELECTRIC:"res/danaotiangong/sound/effect/electric.mp3",
    EFFECT_PARTICAL_BIG_BOMB:"res/danaotiangong/sound/effect/BigBang.mp3",
    EFFECT_PARTICAL_BIG_FIREWORKS:"res/danaotiangong/sound/effect/Bigfireworks.mp3",
    EFFECT_PARTICAL_FIREWORKS:"res/danaotiangong/sound/effect/fireworks.mp3",
    EFFECT_COLLECT_COIN:"res/danaotiangong/sound/effect/collect_coin.mp3",
    EFFECT_DROP_COIN:"res/danaotiangong/sound/effect/drop_gold.mp3",
    BUTTON_CLICK:"res/danaotiangong/sound/effect/click.mp3"
}

var GSoundMap=[];
GSoundMap[FishKind.FishKind20]=[12,13];
GSoundMap[FishKind.FishKind21]=[12,13];
GSoundMap[FishKind.FishKind22]=[14,15];
GSoundMap[FishKind.FishKind23]=[16];
GSoundMap[FishKind.FishKind25]=[12,13];
GSoundMap[FishKind.FishKind20]=[17];
GSoundMap[FishKind.AutoIncrement]=[18,19,20];
GSoundMap[FishKind.FishKind26]=[21,22,23];
GSoundMap[FishKind.FishKind6]=[27];



var GFishDieSound = [
    //--- 通用音效
    "res/danaotiangong/sound/effect/fisha1.mp3",
    "res/danaotiangong/sound/effect/fisha2.mp3",
    "res/danaotiangong/sound/effect/fisha3.mp3",
    "res/danaotiangong/sound/effect/fisha4.mp3",
    "res/danaotiangong/sound/effect/fisha5.mp3",
    "res/danaotiangong/sound/effect/fisha7.mp3",
    "res/danaotiangong/sound/effect/fisha8.mp3",
    "res/danaotiangong/sound/effect/fisha10.mp3",
    "res/danaotiangong/sound/effect/fisha11.mp3",
    "res/danaotiangong/sound/effect/fisha12.mp3",
    "res/danaotiangong/sound/effect/fisha13.mp3",
    "res/danaotiangong/sound/effect/fisha14.mp3",

    //--- 特效音效
    "res/danaotiangong/sound/effect/fisha6.mp3",
    "res/danaotiangong/sound/effect/fisha15.mp3",
    "res/danaotiangong/sound/effect/fisha9.mp3",
    "res/danaotiangong/sound/effect/fisha17.mp3",
    "res/danaotiangong/sound/effect/fisha16.mp3",
    "res/danaotiangong/sound/effect/fisha18.mp3",
    "res/danaotiangong/sound/effect/fisha19.mp3",
    "res/danaotiangong/sound/effect/fisha20.mp3",
    "res/danaotiangong/sound/effect/fisha21.mp3",
    "res/danaotiangong/sound/effect/fisha22.mp3",
    "res/danaotiangong/sound/effect/fisha23.mp3",
    "res/danaotiangong/sound/effect/fisha24.mp3",
    "res/danaotiangong/sound/effect/fisha25.mp3",
    "res/danaotiangong/sound/effect/fisha26.mp3",
    "res/danaotiangong/sound/effect/fisha27.mp3",
    "res/danaotiangong/sound/effect/fisha28.mp3"
]


//90秒 客户端没动作就要关掉
var GNotActionCloseGameTime = 90;

//流逝60秒后就提示
var GNotActionCloseGameHintTime = 60;
////锁鱼配置
var GLockFishConfig = {
   bubbleInterval: 20,               //泡泡间隔大小
};

var FireSoundInterval = 120;            //120ms

//最大金币柱上限
var GMaxJettonNum = 4;

//最大全服公告消息条数
var GMaxNoticeNum = 2;
//公告消逝时间
var GNoticeDieOut = 5;

//金币柱消逝时间
var GJettonDieOut = 3;

//转盘持续时间
var GPrizeDuration = 3;

//是否支持锁鱼
var GSupperLockFish = true;

//是否显示分数背景框
var GScoreBGColor = true;

//锁鱼泡泡是否颜色不一样
var GLockPaoPaoColor = true;

//发射角度偏移量, 用于狂暴模式,第一个一定要是0
var GFireRotation = [0, -30, 30];

//是否开影子
var GOpenShadow = true;

//影子系数
var GShadowFac = 0.2;

//间隔几帧检测一次
var GCDFrameInterval = 5;
var GScaleScreenWidth =1;//屏幕拉升比例
let DE_BUG =false;
export {
    GCoinConfig,
    GFishDieSound,
    GSoundMap,
    GFireRotation,
    GPlayerNum,
    V,
    GFishKindAnimationFN,
    GOpenShadow,
    GShadowFac,
    GFishDieAniDT,
    AniType,
    GCDFrameInterval,
    GScaleScreenWidth,
    GFishKindAnimationFN_FRAME,
    GSupperLockFish,
    GLockFishConfig,
    GRotateRadius,
    DE_BUG,
}