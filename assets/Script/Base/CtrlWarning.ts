const {ccclass, property} = cc._decorator;

@ccclass
export default class CtrlWarning extends cc.Component
{
    @property(cc.Label)
    public m_txtWords: cc.Label = null;
    @property(cc.Node)
    public m_bg:cc.Node = null;
    public setWords(strWords: string): void
    {
        this.m_txtWords.string = strWords;
        let width = this.m_txtWords.node.getContentSize().width;
        this.m_bg.setContentSize(cc.size(width+140,50));
    }
}
