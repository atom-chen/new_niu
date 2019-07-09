const {ccclass, property} = cc._decorator;

@ccclass
export default class UIHint extends cc.Component
{
    @property(cc.Label)
    public m_txtTime: cc.Label = null;

    private m_nEndTime: number = 0;

    onEnable()
    {
        this.m_nEndTime = Date.now() + 30000;
        this.m_txtTime.string = "30";
    }

    update()
    {
        let curTime: number = Date.now();
        if (curTime >= this.m_nEndTime)
        {
            //倒计时到时了
            this.doTimeOut();
        }
        else
        {
            let nTime = (this.m_nEndTime - curTime) / 1000;
            this.m_txtTime.string = Math.ceil(nTime).toString();
        }
    }

    private doTimeOut(): void
    {

    }
}
