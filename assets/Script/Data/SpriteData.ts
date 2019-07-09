//todo:贴图,图集文件数据配置
import { IData } from "./IData";

export class SpriteInfo {
    public strPlist: string = null;
    public strName: string = null;
}

export enum EM_SpriteType {

    bg = 0,
    logo,
    // bg1,
    // bg2,
    // bg3,
    // lock_line = 300,//锁鱼图标
    // bullet_1, //普通子弹1
    // bullet_2,
    // bullet_3,
    // bullet_1_2,//魔能子弹1
    // bullet_2_2,
    // bullet_3_2
};
export const PreLoad_Plist = {
    // Bullet: "Texture/bullet/dntgtest_bullet",
    // WaterVave: "Texture/watermark",
    // SwitchSence: "Texture/effect_transition_water0",
    // Net: "Texture/net/net",
    // Coin: "Texture/oldRes/coin",
    // Fish: "Texture/oldRes/fish",
    // Lightning: "Texture/lightning/lightning"
};
export class SpriteData extends IData {
    private m_mapSpriteInfo: { [idSprite: string]: SpriteInfo } = {};

    public init(): void {
        this.addSpriteInfo(EM_SpriteType.bg, null, "table/bg");
        this.addSpriteInfo(EM_SpriteType.logo, null, "table/logo");
        // this.addSpriteInfo(EM_SpriteType.bg2, null, "bg/bg2");
        // this.addSpriteInfo(EM_SpriteType.bg3, null, "bg/bg3");
        // this.addSpriteInfo(EM_SpriteType.bullet_1, "bullet/dntgtest_bullet", "dntgtest_Bullet_1_1");
        // this.addSpriteInfo(EM_SpriteType.bullet_2, "bullet/dntgtest_bullet", "dntgtest_Bullet_2_1");
        // this.addSpriteInfo(EM_SpriteType.bullet_3, "bullet/dntgtest_bullet", "dntgtest_Bullet_3_1");
        // this.addSpriteInfo(EM_SpriteType.bullet_1_2, "bullet/dntgtest_bullet", "dntgtest_Bullet_1_2");
        // this.addSpriteInfo(EM_SpriteType.bullet_2_2, "bullet/dntgtest_bullet", "dntgtest_Bullet_2_2");
        // this.addSpriteInfo(EM_SpriteType.bullet_3_2, "bullet/dntgtest_bullet", "dntgtest_Bullet_3_2");
        // this.addSpriteInfo(EM_SpriteType.lock_line, null, "userOption/dntgtest_battle_ui_lock_line");
    }

    private addSpriteInfo(idSprite: number | string, strPlist: string, strName: string): void {
        let spriteInfo: SpriteInfo = new SpriteInfo();
        spriteInfo.strPlist = strPlist;
        spriteInfo.strName = strName;
        this.m_mapSpriteInfo[idSprite] = spriteInfo;
    }

    public getSpriteInfo(idSprite: number | string): SpriteInfo {
        return this.m_mapSpriteInfo[idSprite];
    }
}


