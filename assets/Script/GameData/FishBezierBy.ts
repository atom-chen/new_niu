
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
class BezierImpl {
    mLength: number;
    A: number;
    B: number;
    C: number;
    m0: number;
    m1: number;
    m2: number;
    m3: number;
    p0: any;
    p1: any;
    p2: any;

    init(p0, p1, p2) {
        var ax = p0.x - 2 * p1.x + p2.x;
        var ay = p0.y - 2 * p1.y + p2.y;
        var bx = 2 * (p1.x - p0.x);
        var by = 2 * (p1.y - p0.y);


        var A = 4 * (ax * ax + ay * ay);
        var B = 4 * (ax * bx + ay * by);
        var C = bx * bx + by * by;

        var t0 = Math.sqrt(C);
        var t1 = 8 * Math.pow(A, 1.5);

        var m0 = (B * B - 4 * A * C) / t1;
        var m1 = 2 * Math.sqrt(A);
        var m2 = m1 / t1;
        var ttt = (B + m1 * t0);
        var m3 = m0 * Math.log(ttt <= 0 ? 0.0000001 : ttt) - B * m2 * t0;

        var f0 = A + B;
        var f1 = A + f0;
        var temp1 = C + f0;
        var f2 = Math.sqrt(temp1 < 0 ? 0 : temp1);
        temp1 = f1 + m1 * f2;
        var f3 = Math.log(temp1 <= 0 ? 0.0000001 : temp1);

        this.mLength = m3 - m0 * f3 + m2 * f1 * f2;
        this.A = A;
        this.B = B;
        this.C = C;
        this.m0 = m0;
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }

    getLength() {
        return this.mLength;
    }
    
    getPoint (t) {
        var ll = this.m3 - t * this.mLength;

        for (var i = 0; i < 7; ++i) {

            var f0 = this.A * t;
            var f1 = this.B + f0;
            var f2 = f1 + f0;
            var temp1 = this.C + t * f1;
            var f3 = Math.sqrt(temp1 < 0 ? 0 : temp1);
            temp1 = f2 + this.m1 * f3;
            var f4 = Math.log(temp1 <= 0 ? 0.0000001 : temp1);
            var f = (ll - this.m0 * f4) / f3 + this.m2 * f2;
            t -= f;
            if (Math.abs(f) < 0.01) {
                break;
            }
        }

        var c = t * t;
        var b = t + t;
        var a = 1 - b + c;
        b -= c + c;

        return {x: (a * this.p0.x + b * this.p1.x + c * this.p2.x), y: (a * this.p0.y + b * this.p1.y + c * this.p2.y)};
    }
}

class Bezier {
    mMap: any[];
    mLength: number;
    bezierImpl: BezierImpl[] = [];

    constructor() {
        for (let index = 0; index < 2; index++) {
            this.bezierImpl.push(new BezierImpl());
        }
    }
    
    init(pointCount, pArray) {
        if (pointCount < 3) {
            throw 1;
        }
    
        var mIndex = 0;
        var p0 = pArray[mIndex++];
    
        var mLength = 0;
    
        var mMap = [];
    
        for (var i = 3; i < pointCount; ++i) {
    
            var p1 = {x: (pArray[mIndex].x + pArray[mIndex + 1].x) / 2, y: (pArray[mIndex].y + pArray[mIndex + 1].y) / 2};
    
            var bezierImpl = this.bezierImpl[0];
            bezierImpl.init(p0, pArray[mIndex], p1);
    
            mMap.push({first: mLength, second: bezierImpl});
            mLength += bezierImpl.getLength();
    
            p0 = p1;
            mIndex++;
        }
    
        var bezierImpl = this.bezierImpl[1];
        bezierImpl.init(p0, pArray[mIndex], pArray[mIndex + 1]);
        mMap.push({first: mLength, second: bezierImpl});
        mLength += bezierImpl.getLength();
        mMap.sort(this.sortCmd);
        this.mMap = mMap;
        this.mLength = mLength;
    }

    sortCmd(a, b) {
        return a.first - b.first;    
    }

    getLength() {
        return this.mLength;    
    }

    getPoint(t) {
        t *= this.mLength;
    
        var it = this.mMap[Math.max(0, this.upperBound(t) - 1)];
    
        t = (t - it.first) / it.second.getLength();
        return it.second.getPoint(t);
    }

    upperBound(findKey) {
        var index;
        for (index = 0; index < this.mMap.length; ++index) {
            if (this.mMap[index].first > findKey) {
                break;
            }
        }
        return index;
    }
}

export function NewFishBezierBy(speed, startPosition, endPosition, controlPoint1, controlPoint2): cc.FiniteTimeAction {
    //先拿直线时间替代，鱼可能会游完了停留几秒
    var duration = cc.pDistance(startPosition, controlPoint1) / speed;
    duration += cc.pDistance(controlPoint1, controlPoint2) / speed;
    duration += cc.pDistance(controlPoint2, endPosition) / speed;

    let action = cc.callFunc((target) => {
        let fishBezierBy = target.getComponent(FishBezierBy);
        if (null == fishBezierBy) {
            fishBezierBy = target.addComponent(FishBezierBy);
        }
        fishBezierBy.init(speed, startPosition, endPosition, controlPoint1, controlPoint2);
    });
    
    return cc.spawn(action, cc.delayTime(duration) );
}

const {ccclass, property} = cc._decorator;

@ccclass
export class FishBezierBy extends cc.Component {

    _startPosition: cc.Vec2 = null;
    _endPosition: cc.Vec2 = null;
    _controlPoint1: cc.Vec2 = null;
    _controlPoint2: cc.Vec2 = null;
    _bezier: Bezier = null;
    _duration: number = 0;
    _time: number = 0;

    init(speed, startPosition, endPosition, controlPoint1, controlPoint2) {
        this.enabled = true;
        this._startPosition = startPosition;
        this._endPosition = endPosition;
        this._controlPoint1 = controlPoint1;
        this._controlPoint2 = controlPoint2;

        if (null == this._bezier) {
            this._bezier = new Bezier();
        }
        this._bezier.init(4, [startPosition, controlPoint1, controlPoint2, endPosition]);
        this._duration = (this.getLength() / speed);
        this._time = 0;
    }

    getLength() {
        return this._bezier.getLength();
    }

    update(dt: number) {
        this._time += dt;
        dt = this._time / this._duration;

        if (this.node.active) {
            if (1 > dt) {
                this.node.setPosition(this._bezier.getPoint(dt));
            } else {
                this.enabled = false;
            }
        }
    }
}
