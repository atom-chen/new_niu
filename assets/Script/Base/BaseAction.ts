export default class BaseAction extends cc.Component {
    public hide():void{
        this.enabled = false;
    }
    public show():void{
        this.enabled = true;
    }
}