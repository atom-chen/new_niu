import { IData } from "./IData";
export enum EM_SkeleType {
}
export class SkeletonInfo
{
    public strPath: string = null;  //路径
    public strName: string = null;  //动画名
    public bLoop: boolean = null;
    public fScale: number = 0;          //缩放比例
}
type SKELETON_INFO_MAP = {[index: string]: SkeletonInfo};

export class SkeletonData extends IData
{
    private m_mapSkeleton: SKELETON_INFO_MAP = {};

    public init(): void
    {
        this.addSkeletonInfo("fish_jinbi_1", "fish_jinbi_1/fish_jinbi_1", "start", false,0.5);
        // this.addSkeletonInfo(" fish_jinbi_yinse",  fish_jinbi_yinse/fish_jinbi_yinse", "start", false,1);
        this.addSkeletonInfo("fish_jinbi_yinse", "fish_jinbi_1/fish_jinbi_1", "start", false,0.5);

        this.addSkeletonInfo("buyu12", "buyu12/buyu12", "idle", true,1);
        this.addSkeletonInfo("jianyu", "jianyu/jianyu", "idle", true,1);
        this.addSkeletonInfo("bianfuyu", "bianfuyu/bianfuyu", "idle", true,0.9);
        this.addSkeletonInfo("shajing", "shajing/shajing", "idle", true,1);
        this.addSkeletonInfo("shajinghuangjinban", "shajinghuangjinban/shajinghuangjinban", "idle", true,1);
        this.addSkeletonInfo("shayuhuangjinban", "shayuhuangjinban/shayuhuangjinban", "idle", true,1);
        this.addSkeletonInfo("shuimuhuangjinban", "shuimuhuangjinban/shuimuhuangjinban", "idle", true,1.15);
        this.addSkeletonInfo("yinlong", "yinlong/yinlong", "idle", true,1);
        this.addSkeletonInfo("jinlong", "jinlong/jinlong", "idle", true,1);
        this.addSkeletonInfo("longxia", "longxia/longxia", "idle", true,1.15);
        this.addSkeletonInfo("zhangyuguai", "zhangyuguai/zhangyuguai", "idle", true,1);
        this.addSkeletonInfo("haiyao", "haiyao/haiyao", "idle", true,1);
        this.addSkeletonInfo("shenxianchuan", "shenxianchuan/shenxianchuan", "idle", true,1);
        this.addSkeletonInfo("longwang", "longwang/longwang", "idle", true,0.85);
        this.addSkeletonInfo("sunwukong", "sunwukong/sunwukong", "idle", true,1.1);
        // this.addSkeletonInfo("dingping", "dingping", "idle", true,0.9);
        this.addSkeletonInfo("dingping", "longwang/longwang", "idle", true,0.9);
        this.addSkeletonInfo("jingubang", "jingubang/jingubang", "idle", true,0.9);
        this.addSkeletonInfo("wudifenghuolun", "wudifenghuolun/wudifenghuolun", "idle", true,0.9);
        this.addSkeletonInfo("foshou", "foshou/foshou", "idle", true,0.75);
        this.addSkeletonInfo("yijianshuangdiao", "yijianshuangdiao/yijianshuangdiao", "idle", true,1);
        this.addSkeletonInfo("yishisanyu", "yishisanyu/yishisanyu", "idle", true,1);
        this.addSkeletonInfo("jinyumantang", "jinyumantang/jinyumantang", "idle", true,0.5);
        this.addSkeletonInfo("danaotiangong", "danaotiangong/danaotiangong", "idle", true,1);



        this.addSkeletonInfo("xiaolvyu", "xiaolvyu/xiaolvyu", 'idle', true,1.2);
        this.addSkeletonInfo("xiaolvyu2", "xiaolvyu2/xiaolvyu2", 'idle', true,1.2);
        this.addSkeletonInfo("xiaolanyu", "xiaolanyu/xiaolanyu", 'idle', true,1);
        this.addSkeletonInfo("buyu8", "buyu8/buyu8", 'idle',true, 1);
        this.addSkeletonInfo("buyu10", "buyu10/buyu10", 'idle', true,0.9);
        this.addSkeletonInfo("xiaochouyu", "xiaochouyu/xiaochouyu", 'idle', true,0.95);
        this.addSkeletonInfo("hetun", "hetun/hetun", 'idle', true,1);
        this.addSkeletonInfo("buyu13", "buyu13/buyu13", 'idle', true,0.8);
        this.addSkeletonInfo("denglongyu", "denglongyu/denglongyu", 'idle', true,1);
        this.addSkeletonInfo("xiaohaigui", "xiaohaigui/xiaohaigui", 'idle',true, 0.9);
        this.addSkeletonInfo("houtouyu", "houtouyu/houtouyu", 'idle', true,0.9);
        this.addSkeletonInfo("buyu7", "buyu7/buyu7", 'idle', true,1);
        this.addSkeletonInfo("shandianmenu", "shandianmenu/shandianmenu", 'idle',true, 0.7);
    }

    private addSkeletonInfo(idSkeleton: EM_SkeleType|string, strPath: string, strName: string, bLoop: boolean,fScale:number = 1): void
    {
        let skeletonInfo: SkeletonInfo = new SkeletonInfo();
        skeletonInfo.strPath = strPath;
        skeletonInfo.strName = strName;
        skeletonInfo.bLoop = bLoop;
        skeletonInfo.fScale = fScale;
        this.m_mapSkeleton[idSkeleton] = skeletonInfo;
    }

    public getSkeletonInfo(idSkeleton: number|string): SkeletonInfo
    {
        return this.m_mapSkeleton[idSkeleton];
    }
}
