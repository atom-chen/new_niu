import { IData } from "../Data/IData";
import { SpriteData } from "../Data/SpriteData";
import { PreLoadData } from "../Data/PreLoadData";
import { MusicData } from "../Data/MusicData";
import { SoundData } from "../Data/SoundData";
import { DragonBonesData } from "../Data/DragonBonesData";
import { SkeletonData } from "../Data/SkeletonData"
import { AniData } from "../Data/AniData";
import { UIData } from "../Data/UIData";
import { SeatData } from "../GameData/SeatData";
import { CannonData } from "../GameData/CannonData";
import { StringData } from "../Data/StringData";

export class DataManager {
    private constructor() { };
    private static s_inst: DataManager = null;

    private m_szData: IData[] = [];

    private m_uiData: UIData = new UIData();
    private m_stringData: StringData = new StringData();
    private m_spriteData: SpriteData = new SpriteData();
    private m_preLoadData: PreLoadData = new PreLoadData();
    private m_musicData: MusicData = new MusicData();
    private m_soundData: SoundData = new SoundData();
    private m_aniData: AniData = new AniData();
    private m_dragonBonesData: DragonBonesData = new DragonBonesData();
    private m_skeletonData: SkeletonData = new SkeletonData();

    //子游戏特有数据
    private m_seatData: SeatData = new SeatData();
    public get seat(): SeatData { return this.m_seatData; }
    private m_cannonData: CannonData = new CannonData();
    public get cannon(): CannonData { return this.m_cannonData; }

    public get ui(): UIData { return this.m_uiData; }
    public get str(): StringData { return this.m_stringData; }
    public get sprite(): SpriteData { return this.m_spriteData; }
    public get preLoad(): PreLoadData { return this.m_preLoadData; }
    public get music(): MusicData { return this.m_musicData; }
    public get sound(): SoundData { return this.m_soundData; }
    public get dragonBones(): DragonBonesData { return this.m_dragonBonesData; }
    public get skeleton(): SkeletonData { return this.m_skeletonData; }
    public get ani(): AniData { return this.m_aniData; }

    public static instance(): DataManager {
        if (DataManager.s_inst == null) {
            DataManager.s_inst = new DataManager();
        }
        return DataManager.s_inst;
    }

    public init(): void {
        this.m_szData.push(this.ui);
        this.m_szData.push(this.str);
        this.m_szData.push(this.sprite);
        this.m_szData.push(this.preLoad);
        this.m_szData.push(this.music);
        this.m_szData.push(this.sound);
        this.m_szData.push(this.dragonBones);
        this.m_szData.push(this.skeleton);
        this.m_szData.push(this.ani);

        //子游戏特有数据
        this.m_szData.push(this.seat);
        this.m_szData.push(this.cannon);

        this.m_szData.forEach(element => {
            element.init();
        });
    }
}
