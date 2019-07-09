export interface FishObj
{
    fishKind: number;
    fishID: number;
    fishIndex: number;
    fishTraceType: number;
    fishPath: cc.Vec2[];
    delayTime: number;
    isRedFish?: boolean;
}

//鱼路径
export interface FishTrace
{
    arrFish: FishObj[]
}

//用户开火
export interface UserFire
{
    angleArray: number[];
    bulletIDArray: number[];
    bulletIndexArray: number[];
    chairID: number;
    cannonIndex: number;
    lockFishID: number;
    isAndroid: number;
    isSuperBullet: boolean;
}

//房间信息
export interface RoomInfo  {
    gameName: string;
    roomName: string;
    tableID: number;
}

//大炮配置
export interface CannonKindConfig {
    multiple: number;   //cannon cost
    size: number;       //cannon info index
}

//子弹配置
export interface BulletKindConfig {
    bulletKind: number; //cannon info index
    speed: number;
}

//鱼配置
export interface FishKindConfig {
    fishKind: number;
    speed: number;
    minMultiple: number;
    maxMultiple: number;
}

//房间配置
export interface RoomConfig {
    multiple: number;
    freeMode: boolean;
}

//游戏配置
export interface GameConfig {
    cannonKindConfigArray: CannonKindConfig[];   //大炮配置
    bulletKindConfigArray: BulletKindConfig[];    //子弹配置
    prizeMUL: number;
    fishKindConfigArray: FishKindConfig[];          //鱼配置
    localBombRadius: number;
    fireInterval: number;           //开炮至少间隔时间
    upScoreInterval: number;  //上分间隔时间
    defCannonIndex: number;     //默认大炮配置
    maxBulletNum: number;            //最大子弹数量
    elaspedBulletIon: number;       //魔能炮的持续时间
    roomConfig: RoomConfig;          //房间配置模式
    chairCount: number;
    superModeCoolting: number;  //各种模式的冷却时间
    superModeDuration: number; //各种模式的持续时间
    openRageMode: boolean;      //是否开启狂暴模式
    openSpeedMode: boolean;      //是否开启极速模式
}

//用户信息
export interface PlayerScoreInfo {
    chairID: number;
    score: number;
}

//游戏场景
export interface GameSceneData {
    bgIndex: number;
    bgmIndex: number;
    fishes: FishTrace[];
    reductionFishWay: number;
    playerScoreInfo: PlayerScoreInfo[];
    isAndroidHelp: boolean;
    fishGameStatus: number;
    autoIncrementFishInfo: any[];
    fishArrayKind:number;//鱼阵ID
    randseek:number;//随机数种子
}

//捕鱼消息，用于同房间不同桌子之间的类似公告的通知
export interface FishNotice {
    nickname: string;
    chairID: number;
    score: number;
    bulletMultiple: number;
    fishMultiple: number;
    fishName: string;
    gameName: string;
    roomName: string;
    tableID: number;
}

export interface SubFishID {
    fishID: number;
}
//鱼被捕
export interface SCatchFish {
    chairID: number;
    fishID: number;
    fishIndex: number;
    fishScore: number;
    multiple: number;
    superBullet: boolean;
    catchFish?: SubFishID[];
}

export interface SUserFire {
    angleArray: number[];
    bulletIDArray: number[];
    bulletIndexArray: number[];
    chairID: number;
    cannonIndex: number;
    lockFishID: number;
    isAndroid: boolean;
    isSuperBullet: boolean;
}

export interface CCatchRangeFish {
    fishID: number;
    fishIndex: number;
}

export interface CCatchFish {
    bulletID: number;
    bulletIndex: number;
    chairID: number;
    fishID: number;
    fishIndex: number
    rangeFish?: CCatchRangeFish[];
}
