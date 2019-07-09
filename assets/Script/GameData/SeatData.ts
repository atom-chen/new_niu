import { IData } from "../Data/IData";

export enum EM_SeatAnchor
{
    eSA_None,
    eSA_LeftTop,
    eSA_RightTop,
    eSA_LeftBottom,
    eSA_RightBottom,
}

//座位信息
export class SeatInfo
{
    public eAnchor: EM_SeatAnchor = EM_SeatAnchor.eSA_None;
    public v2Seat: cc.Vec2 = null;
    public v2Weapon: cc.Vec2 = null;
    public v2Wait: cc.Vec2 = null;
    public v2Cost: cc.Vec2 = null;
    public v2Status: cc.Vec2 = null;
    public v2SuperCannon: cc.Vec2 = null;
}

export class SeatData extends IData
{
    private m_szSeatInfo: SeatInfo[] = [];

    public init(): void
    {
        this.addSeatInfo(EM_SeatAnchor.eSA_RightBottom, new cc.Vec2(550, 50), new cc.Vec2(-290, 0), new cc.Vec2(-290, -10), new cc.Vec2(-290, -25), new cc.Vec2(-190, 125), new cc.Vec2(110, 0));
        this.addSeatInfo(EM_SeatAnchor.eSA_LeftBottom, new cc.Vec2(-550, 50), new cc.Vec2(290, 0), new cc.Vec2(290, -10), new cc.Vec2(290, -25), new cc.Vec2(190, 125), new cc.Vec2(-110, 0));
        this.addSeatInfo(EM_SeatAnchor.eSA_LeftTop, new cc.Vec2(-550, 50), new cc.Vec2(290, 0), new cc.Vec2(290, 10), new cc.Vec2(290, 25), new cc.Vec2(190, -125), new cc.Vec2(-110, 0));
        this.addSeatInfo(EM_SeatAnchor.eSA_RightTop, new cc.Vec2(550, 50), new cc.Vec2(-290, 0), new cc.Vec2(-290, 10), new cc.Vec2(-290, 25), new cc.Vec2(-190, -125), new cc.Vec2(110, 0));
    }

    private addSeatInfo(eAnchor: EM_SeatAnchor, v2Seat: cc.Vec2, v2Weapon: cc.Vec2, v2Wait: cc.Vec2, v2Cost: cc.Vec2, v2Status: cc.Vec2, v2SuperCannon: cc.Vec2): void
    {
        let seatInfo: SeatInfo = new SeatInfo();
        seatInfo.eAnchor = eAnchor;
        seatInfo.v2Seat = v2Seat;
        seatInfo.v2Weapon = v2Weapon;
        seatInfo.v2Wait = v2Wait;
        seatInfo.v2Cost = v2Cost;
        seatInfo.v2Status = v2Status;
        seatInfo.v2SuperCannon = v2SuperCannon;
        this.m_szSeatInfo.push(seatInfo);
    }

    public getSeatInfo(nIndex: number): SeatInfo
    {
        return this.m_szSeatInfo[nIndex];
    }
}
