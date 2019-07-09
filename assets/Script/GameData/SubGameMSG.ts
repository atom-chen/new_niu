//子游戏消息


//子游戏消息
var subGameMSG = {

//////////////////////////////////////////////////////////////////////////
// 服务端命令

    SUB_S_GAME_CONFIG: 100,                                 //  游戏配置
    SUB_S_FISH_TRACE: 101,                                  //  鱼路径
    SUB_S_USER_FIRE: 103,                                   //  用户开火
    SUB_S_CATCH_FISH: 104,                                  //  捕获到鱼
    SUB_S_BULLET_ION_TIMEOUT: 105,                         //  离子炮到期了
    SUB_S_LOCK_TIMEOUT: 106,                                //  定屏到期了
    SUB_S_SWITCH_SCENE: 110,                                //  切换鱼阵
    SUB_S_START_FISH_ARRAY: 111,                            //  开始鱼阵
    SUB_S_END_FISH_ARRAY: 112,                              //  结束鱼阵
    SUB_S_REPLY_NOW_INFO: 113,                              //  回复当前界面鱼阵信息
    SUB_S_SPECIFY_ANDROID_HELP_CHAIR: 119,                 //   指定机器人代理人
    SUB_S_SYSTEM_TIP: 120,                                     // 系统提醒
    SUB_S_FIRE_FAILURE: 121,                                 //开火失败
    SUB_S_AUTO_INCREMENT: 123,                               //自动增长的鱼
    SUB_S_REAL_PLAYER_NUM: 126,                                 //真实玩家数量（仅会发给机器人）
    SUB_S_CHANGE_MULTIPLE_FAILURE: 130,                      //换炮失败
//////////////////////////////////////////////////////////////////////////
//子游戏命令
    SUB_C_USER_FIRE: 2,                                       // 用户开火请求
    SUB_C_CATCH_FISH: 3,                                      //捕获到鱼
    SUB_C_CHANGE_MULTIPLE:4,                                  //客户端修改炮台

};

//鱼的路径类别
var FishTraceType = {
    Linear: 0,					//直线方式
    Bezier: 1,					//贝塞尔曲线
    CatmullRom: 2,             //多点曲线
    MultiLine: 3,               //多点直线， 直线间的转角用鱼旋转解决
    Count: 4,
};


//鱼类别
var FishKind = {
    FishKind1: 0,               //小黄鱼
    FishKind2: 1,               //小绿鱼
    FishKind3: 2,              //中黄鱼
    FishKind4: 3,               //鼓鱼眼
    FishKind5: 4,               //难看的鱼
    FishKind6: 5,               //好看的鱼
    FishKind7: 6,                   //肚皮鱼
    FishKind8: 7,                  //蓝鱼
    FishKind9: 8,                   //灯笼
    FishKind10: 9,                  //乌龟
    FishKind11: 10,                 //难看鱼进化
    FishKind12: 11,                 //蝴蝶
    FishKind13: 12,                 //裙子鱼
    FishKind14: 13,                 //尖枪鱼
    FishKind15: 14,                 //魔鬼鱼
    FishKind16: 15,                 //银鲨鱼
    FishKind17: 16,                 //金鲨鱼
    FishKind18: 17,                   //金鲸
    FishKind19: 18,                   //金龙
    FishKind20: 19,                   //双头企鹅
    AutoIncrement: 20,                   //自增长李逵
    FixBomb: 21,                   //定屏炸弹
    LocalBomb: 22,                   //局部炸弹
    SuperBomb: 23,                   //全屏炸弹
    DaSanYuan: 24,                   //大三元
    DaSiXi: 25,                   //大四喜
    FishKing: 26,                   //鱼王
    // FishKind42: 41,                 //蝎子
    // FishKind43: 42,                 //飞马
    // FishKind44: 43,                 //鳄鱼
    // FishKind45: 44,                   //海象

    Count: 27,                  //鱼类数量，
    RedFish: 28,                    // 红鱼, 红鱼只是鱼的一种属性
};


var BulletKind = {
    BulletKind1: 0,
    BulletKind2: 1,
    BulletKind3: 2,
    BulletKind4: 3,
    BulletKind_ION_1: 4,
    BulletKind_ION_2: 5,
    BulletKind_ION_3: 6,
    BulletKind_ION_4: 7
};

/**
 * 金币类型, 代表文件名，
 * @type {{}}
 */
var CoinKind = {
    CoinKind1: 1,
    CoinKind2: 2,
};

/**
 * 中奖转盘类型
 */
var BingoKind = {
    BingoKind1: 0,
    BingoKind2: 1,
    BingoKind3: 2,
    Count: 3,
};

/**
 * 闪电类型
 * @type {{}}
 */
var LightningKind = {
    LightningKind1: 0,
    LightningKind2: 1,
    LightningKind3: 2,
    Count: 3,
};

/**
 * 粒子效果类型
 */
var EffectKind = {
    EffectKind1: 0,
    EffectKind2: 1,
    EffectKind3: 2,
    EffectKind4: 3,
    EffectKind5: 4,
    EffectKind6: 5,
    EffectKind7: 6,
    EffectKind8: 7,
    EffectKind9: 8,
    EffectKind10: 9,
    EffectKind11: 10,
};

/**
 * 鱼阵种类
 * @type {{FishArrayKind1: number, FishArrayKind2: number, FishArrayKind3: number, FishArrayKind4: number, FishArrayKind5: number, FishArrayKind6: number, FishArrayKind7: number, FishArrayKind8: number}}
 */
var FishArrayKind = {
    FishArrayKind1: 0,
    FishArrayKind2: 1,
    FishArrayKind3: 2,
    FishArrayKind4: 3,
    FishArrayKind5: 4,
    FishArrayKind6: 5,
    FishArrayKind7: 6,
    FishArrayKind8: 7,
    FishArrayKind9: 8,
    FishArrayKind10: 9,
    FishArrayKind11: 10,
};


/**
 * 恢复场面鱼的方式
 * @type {{NormalWay: number, FishArrayWay: number}}
 */
var ReductionFishWay = {

    NormalWay: 0,               //普通方式
    FishArrayWay: 1,            //鱼阵方式
};

/**
 * 开火失败原因
 * @type {{LessMoney: number, TooManyBullets: number}}
 */
var FireFailureReason = {
    LessMoney: 0,               //钱太少
    TooManyBullets: 1,          //子弹发射过多
    WrongCannon: 2,          //子弹发射过多
};

//金币倍数
var CoinMulConfig = [];

CoinMulConfig[CoinKind.CoinKind1] = 1;

export {FishTraceType,subGameMSG,FishKind,BulletKind,CoinKind,BingoKind,LightningKind,EffectKind,FishArrayKind,ReductionFishWay,FireFailureReason}