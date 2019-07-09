
const {ccclass, property} = cc._decorator;

@ccclass
export default class CtrlPlayerBase extends cc.Component
{
    @property(cc.Label)
    public m_txtName: cc.Label = null;

    @property(cc.Label)
    public m_txtScore: cc.Label = null;

    public initInfo(userItem): void
    {
        this.m_txtName.string = userItem.getNickname();
        this.setScore(userItem.getUserScore());
    }

    public setScore(nScore: number): void
    {
         this.m_txtScore.string = nScore.toString();
    }
}
