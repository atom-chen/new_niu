
const CALCULUS_SECTION: number = 1 / 100;     // 微积分切片

////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * returns a point from the array
 *
 * @param {Array} controlPoints
 * @param {Number} pos
 * @return {Array}
 */
function cc_getControlPointAt(controlPoints, pos) {
    var p = Math.min(controlPoints.length - 1, Math.max(pos, 0));
    return controlPoints[p];
};

/**
 * @function
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} t
 * @return {Number}
 */
function cc_bezierAt(a, b, c, d, t) {
    return (Math.pow(1 - t, 3) * a +
        3 * t * (Math.pow(1 - t, 2)) * b +
        3 * Math.pow(t, 2) * (1 - t) * c +
        Math.pow(t, 3) * d );
};

/**
 * Returns the Cardinal Spline position for a given set of control points, tension and time. <br />
 * CatmullRom Spline formula. <br />
 * s(-ttt + 2tt - t)P1 + s(-ttt + tt)P2 + (2ttt - 3tt + 1)P2 + s(ttt - 2tt + t)P3 + (-2ttt + 3tt)P3 + s(ttt - tt)P4
 *
 * @function
 * @param {cc.Point} p0
 * @param {cc.Point} p1
 * @param {cc.Point} p2
 * @param {cc.Point} p3
 * @param {Number} tension
 * @param {Number} t
 * @param {cc.Point} [out]
 * @return {cc.Point}
 */
function cc_cardinalSplineAt(p0, p1, p2, p3, tension, t, out?) {
    var t2 = t * t;
    var t3 = t2 * t;

    /*
     * Formula: s(-ttt + 2tt - t)P1 + s(-ttt + tt)P2 + (2ttt - 3tt + 1)P2 + s(ttt - 2tt + t)P3 + (-2ttt + 3tt)P3 + s(ttt - tt)P4
     */
    var s = (1 - tension) / 2;

    var b1 = s * ((-t3 + (2 * t2)) - t);                      // s(-t3 + 2 t2 - t)P1
    var b2 = s * (-t3 + t2) + (2 * t3 - 3 * t2 + 1);          // s(-t3 + t2)P2 + (2 t3 - 3 t2 + 1)P2
    var b3 = s * (t3 - 2 * t2 + t) + (-2 * t3 + 3 * t2);      // s(t3 - 2 t2 + t)P3 + (-2 t3 + 3 t2)P3
    var b4 = s * (t3 - t2);                                   // s(t3 - t2)P4

    var x = (p0.x * b1 + p1.x * b2 + p2.x * b3 + p3.x * b4);
    var y = (p0.y * b1 + p1.y * b2 + p2.y * b3 + p3.y * b4);
    if (out !== undefined) {
        out.x = x;
        out.y = y;
    }
    else {
        return cc.p(x, y);
    }
};

//cc.MoveTo.extend = cc.Class.extend;
//cc.BezierTo.extend = cc.Class.extend;
//cc.CatmullRomTo.extend = cc.Class.extend;
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
export const FishMoveTo: any = {};
FishMoveTo.calcLength = function(st, end) {
    return cc.pDistance(st, end);
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
export const FishBezierTo: any = {};
FishBezierTo.calcLength = function(st, c) {
    var update = function (dt) {
        var locConfig = c;
        var xa = 0;
        var xb = locConfig[0].x;
        var xc = locConfig[1].x;
        var xd = locConfig[2].x;

        var ya = 0;
        var yb = locConfig[0].y;
        var yc = locConfig[1].y;
        var yd = locConfig[2].y;

        var x = cc_bezierAt(xa, xb, xc, xd, dt);
        var y = cc_bezierAt(ya, yb, yc, yd, dt);

        return {x: x, y: y};
    };

    let prePos: any = {x: 0, y: 0};
    var sum = 0;
    for (let st = 0; st <= 1; st += CALCULUS_SECTION) {
        let now: any = update(st);
        sum += cc.pDistance(prePos, now);
        prePos = now;
    }

    return sum;
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
export const FishCatmullRomTo: any = {};
FishCatmullRomTo.calcLength = function(st, points) {
    var deltaT = 1 / (points.length - 1);
    var tension = 0.5;

    var update = function (dt) {
        var p, lt;
        var ps = points;

        if (dt === 1) {
            p = ps.length - 1;
            lt = 1;
        } else {
            var locDT = deltaT;
            p = 0 | (dt / locDT);
            lt = (dt - locDT * p) / locDT;
        }

        var newPos = cc_cardinalSplineAt(
            cc_getControlPointAt(ps, p - 1),
            cc_getControlPointAt(ps, p - 0),
            cc_getControlPointAt(ps, p + 1),
            cc_getControlPointAt(ps, p + 2),
            tension, lt);
        return newPos;
    };

    var prePos = st;
    var sum = 0;
    for (let st = 0; st <= 1; st += CALCULUS_SECTION) {
        var now = update(st);
        sum += cc.pDistance(prePos, now);
        prePos = now;
    }

    return sum;
}


