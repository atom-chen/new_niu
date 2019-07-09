import {V} from "../GameData/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIEffect extends cc.Component {
 
    @property(cc.Node)
    public snow: cc.Node = null;

    @property(cc.Node)
    public fix: cc.Node = null;

    @property(cc.Node)
    public effect0: cc.Node = null;

    @property(cc.Node)
    public bomb: cc.Node = null;

    @property(cc.Node)
    public money: cc.Node = null;
    @property(cc.Node)
    public fire: cc.Node = null;

    @property(cc.Node)
    public container: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {}
    
    // update (dt) {}

    activeEffect(effectType: string, pos: cc.Vec2) {

        if (effectType == "fixBomb") {
            let snow = cc.instantiate(this.snow);
            this.container.addChild(snow);
            snow.active = true;
            snow.setPosition((V.right - V.left) / 2, V.h + 50);
            let particleSystem = snow.getComponent(cc.ParticleSystem);
            particleSystem.resetSystem();
            particleSystem.autoRemoveOnFinish = true;

            let fix = cc.instantiate(this.fix);
            this.container.addChild(fix);
            fix.active = true;
            fix.setPosition(pos);
            particleSystem = fix.getComponent(cc.ParticleSystem);
            particleSystem.resetSystem();
            particleSystem.autoRemoveOnFinish = true;

            //TODO:是否需要旋转
            // if (GD.isRotation) {
            //     snow.p(V.w / 2, -50);
            //     fix.setRotation(180);
            //     snow.setRotation(180);
            // }
        } else if (effectType == "0") {
            let effect0 = cc.instantiate(this.effect0);
            this.container.addChild(effect0);
            effect0.active = true;
            effect0.setPosition(pos);
            let particleSystem = effect0.getComponent(cc.ParticleSystem);
            particleSystem.resetSystem();
            particleSystem.autoRemoveOnFinish = true;
        } else if (effectType == "bomb") {
            let bomb = cc.instantiate(this.bomb);
            this.container.addChild(bomb);
            bomb.active = true;
            bomb.setPosition(pos);
            let particleSystem = bomb.getComponent(cc.ParticleSystem);
            particleSystem.resetSystem();
            particleSystem.autoRemoveOnFinish = true;
        } else if (effectType == "money") {
            let money = cc.instantiate(this.money);
            this.container.addChild(money);
            money.active = true;
            money.setPosition(pos);
            let particleSystem = money.getComponent(cc.ParticleSystem);
            particleSystem.resetSystem();
            particleSystem.autoRemoveOnFinish = true;

            let fire = cc.instantiate(this.fire);
            this.container.addChild(fire);
            fire.active = true;
            fire.setPosition(pos);
            particleSystem = fire.getComponent(cc.ParticleSystem);
            particleSystem.resetSystem();
            particleSystem.autoRemoveOnFinish = true;            
        }
        else {
            console.error(`No Effect with ${effectType}`);
        }
    }
}
