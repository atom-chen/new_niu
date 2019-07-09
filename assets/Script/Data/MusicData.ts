import {IData} from "./IData";

export enum EM_MusicType {
    eBgm1,
    eBgm2,
    eBgm3,
    eBgm4,
}

type MUSIC_MAP = { [idMusic: number]: string };

export class MusicData extends IData {
    private m_mapMusic: MUSIC_MAP = {};

    public init(): void {
        this.addMusic(EM_MusicType.eBgm1, "bgm/buyuBgMusic1.mp3");
        this.addMusic(EM_MusicType.eBgm2, "bgm/buyuBgMusic1.mp3");
        this.addMusic(EM_MusicType.eBgm3, "bgm/buyuBgMusic1.mp3");
        this.addMusic(EM_MusicType.eBgm4, "bgm/buyuBgMusic1.mp3");

    }

    private addMusic(idMusic: number | string, strUrl: string): void {
        this.m_mapMusic[idMusic] = strUrl;
    }

    public getMusicUrl(idMusic: number | string): string {
        return this.m_mapMusic[idMusic];
    }
}
