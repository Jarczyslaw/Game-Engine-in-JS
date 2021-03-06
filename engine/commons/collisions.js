define(['commons/vector'], function (Vector) {

    function Collisions() { }

    Collisions.circleLineCollision = function (circlePosition, circleRadius, lineStart, lineEnd) {
        let d = new Vector(0, 0); // projection
        let hitPoint = new Vector(0, 0);
        let hit = false;
        // get circle center projection on line
        let lineVect = lineEnd.substract(lineStart);
        let circleToStart = circlePosition.substract(lineStart);
        d = lineStart.add(lineVect.multiply(circleToStart.dotProduct(lineVect) / lineVect.dotProduct(lineVect)));
        // check if projection is in the segment of line
        if ((lineStart.x < d.x && d.x < lineEnd.x) ||
            (lineStart.x > d.x && d.x > lineEnd.x) ||
            (lineStart.y < d.y && d.y < lineEnd.y) ||
            (lineStart.y > d.y && d.y > lineEnd.y)) {
            // check if projection is in circle
            let dr = circlePosition.substract(d);
            if (dr.magnitude() < circleRadius) {
                hit = true;
                hitPoint = d;
            }
        }
        // check if line points are inside the circle
        if (circlePosition.substract(lineStart).magnitude() < circleRadius) {
            hit = true;
            hitPoint = lineStart;
        }
        if (circlePosition.substract(lineEnd).magnitude() < circleRadius) {
            hit = true;
            hitPoint = lineEnd;
        }

        return {
            hit: hit,
            hitPoint: hitPoint
        }
    }

    Collisions.circleRectangleCollision = function (circlePosition, circleRadius, rectangleCenter, rectangleWidth, rectangleHeight) {
        let hit = false;
        let c = new Vector(0, 0); // closest point to circle
        let hitPoint = new Vector(0, 0);
        // get rectangle corners
        let halfWidth = rectangleWidth / 2;
        let halfHeight = rectangleHeight / 2;
        let rectangleX1 = rectangleCenter.x - halfWidth;
        let rectangleX2 = rectangleCenter.x + halfWidth;
        let rectangleY1 = rectangleCenter.y - halfHeight;
        let rectangleY2 = rectangleCenter.y + halfHeight;
        // get closest to circle point in rectangle
        let closestX = Math.clamp(circlePosition.x, rectangleX1, rectangleX2);
        let closestY = Math.clamp(circlePosition.y, rectangleY1, rectangleY2);
        c.set(closestX, closestY);
        // check if point is in circle
        if (c.substract(circlePosition).magnitude() < circleRadius) {
            hit = true;
            hitPoint = c;
        }
        return {
            hit: hit,
            hitPoint: hitPoint
        }
    }

    Collisions.circleCircleCollision = function (circle1Position, circle1Radius, circle2Position, circle2Radius) {
        let hit = false;
        let hitPoint = new Vector(0, 0);
        // get distance between circles
        let rr = circle1Position.substract(circle2Position);
        let distance = rr.magnitude();
        if (distance < (circle1Radius + circle2Radius)) { // if distance is lower than sum of radiuses
            hit = true;
            // get collision point
            let v = 0;
            if (distance < circle2Radius)
                v = distance;
            else
                v = circle2Radius;
            hitPoint = circle2Position.add(rr.normalize().multiply(v));
        }

        return {
            hit: hit,
            hitPoint: hitPoint
        }
    }

    Collisions.lineIntersection = function (line1Start, line1End, line2Start, line2End) {
        let det, gamma, lambda;
        det = (line1End.x - line1Start.x) * (line2End.y - line2Start.y) - (line2End.x - line2Start.x) * (line1End.y - line1Start.y);
        if (det === 0) {
            return null;
        } else {
            lambda = ((line2End.y - line2Start.y) * (line2End.x - line1Start.x) + (line2Start.x - line2End.x) * (line2End.y - line1Start.y)) / det;
            gamma = ((line1Start.y - line1End.y) * (line2End.x - line1Start.x) + (line1End.x - line1Start.x) * (line2End.y - line1Start.y)) / det;
            if ((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)) // check if line segments intersect
                return { // return intersection coordinates
                    x: line1Start.x + lambda * (line1End.x - line1Start.x),
                    y: line1Start.y + lambda * (line1End.y - line1Start.y)
                }
            else
                return null;
        }
    };

    return Collisions;
})