

//-----------------------------------------------------------------------------------------------------------------------
/************************************************************************/
/* 时间， 圆心， 半径， 起始角度， 顺或逆， 旋转角度， 360度， 则为一个圆，                 */
//如果起始角度为0， 则起点在圆心的正上方，
/************************************************************************/

export function NewFishRotationAt(duration, center, radius, startAngle, clockwise = true, deltaAngle = 360): cc.FiniteTimeAction {
    return cc.spawn(
        cc.delayTime(duration),
        cc.callFunc((target) => {
            let fishRotationAt = target.getComponent(FishRotationAt);
            if (null == fishRotationAt) {
                fishRotationAt = target.addComponent(FishRotationAt);
            }
            fishRotationAt.init(duration, center, radius, startAngle, clockwise, deltaAngle);
        }));
}

const {ccclass, property} = cc._decorator;

@ccclass
export class FishRotationAt extends cc.Component {
    _center: cc.Vec2 = null;        //圆心
    _radius: number = 0;            //半径
    _deltaAngle: number = 0;        //旋转角度
    _clockwise: boolean = false;    //顺时针方向
    _startAngle: number = 0;        //起始角度
    _duration: number = 0;
    _time: number = 0;

    init(duration, center, radius, startAngle, clockwise = true, deltaAngle = 360) {
        this.enabled = true;
        this._duration = duration;
        this._center = center;
        this._radius = radius;
        this._startAngle = startAngle;
        this._clockwise = clockwise;
        this._deltaAngle = deltaAngle;
        this._time = 0;
    }

    update(dt: number) {
        this._time += dt;
        dt = this._time / this._duration;

        if (this.node.active) {
            if (1 >= dt) {
                let radian = (this._startAngle + this._deltaAngle * dt) / 180 * Math.PI;
                let newPos: cc.Vec2 = cc.p();

                if (this._clockwise) {
                    newPos.x = this._radius * Math.sin(radian) + this._center.x;
                    newPos.y = this._radius * Math.cos(radian) + this._center.y;
                } else {
                    radian += Math.PI / 2;
                    newPos.x = this._radius * Math.cos(radian) + this._center.x;
                    newPos.y = this._radius * Math.sin(radian) + this._center.y;
                }

                this.node.setPosition(newPos);
            } else {
                this.enabled = false;
            }
        }
    }
}
