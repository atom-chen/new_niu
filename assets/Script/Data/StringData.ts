import { IData } from "./IData";

export class StringData extends IData
{
    private m_mapString: {[key: string]: string} = {};

    public init(): void
    {
        this.m_mapString["money_low"] = "对不起，您钱不够，子弹发射失败。";
        this.m_mapString["many_bullets"] = "对不起，您子弹发射过多，请稍候。";
        this.m_mapString["fire_fail"] = "对不起，您子弹发射失败，请稍候。";
    }

    public getString(strKey: string): string
    {
        return this.m_mapString[strKey];
    }
}
