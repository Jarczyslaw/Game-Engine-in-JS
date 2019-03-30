define(['commons/primitives', 'commons/vector', 'commons/color', 'commons/collisions'], function (Primitives, Vector, Color, Collisions) {

    class Scene {
        constructor() {
            let hitCircle = new Primitives.Circle();
            hitCircle.radius = 30;
            let hitCirclePosition = new Vector(0, 0);
            let line = new Primitives.Line();
            line.width = 3;
            let lineStart = new Vector(700, 500);
            let lineEnd = new Vector(600, 100);
            let d = new Vector(0, 0); // projection
            let rectangle = new Primitives.Rectangle();
            rectangle.width = 150;
            rectangle.height = 400;
            let rectanglePosition = new Vector(200, 300);
            let c = new Vector(0, 0);
            let circle = new Primitives.Circle();
            circle.radius = 100;
            let circlePosition = new Vector(500, 500);
            let x = new Vector(0, 0);

            this.start = function (gameStatus, camera, input) {
                this.gameWidth = gameStatus.getWidth();
                this.gameHeight = gameStatus.getHeight();
                this.screenWidth = camera.getWidth();
                this.screenHeight = camera.getHeight();
            };

            this.update = function (gameStatus, camera, input, time) {
                let mouse = input.getMouse();
                let mousePosition = mouse.getPosition();
                hitCirclePosition.set(mousePosition.x, mousePosition.y);
                // test with line
                let lineTest = Collisions.circleLineCollision(hitCirclePosition, hitCircle.radius, lineStart, lineEnd);
                if (lineTest.hit)
                    line.color = Color.red();
                else
                    line.color = Color.white();
                d = lineTest.hitPoint;
                // test with rectangle
                let rectangleTest = Collisions.circleRectangleCollision(hitCirclePosition, hitCircle.radius, rectanglePosition, rectangle.width, rectangle.height);
                if (rectangleTest.hit)
                    rectangle.color = Color.red();
                else
                    rectangle.color = Color.white();
                c = rectangleTest.hitPoint;
                // test with circle
                let circleTest = Collisions.circleCircleCollision(hitCirclePosition, hitCircle.radius, circlePosition, circle.radius);
                if (circleTest.hit)
                    circle.color = Color.red();
                else
                    circle.color = Color.white();
                x = circleTest.hitPoint;
            };

            this.render = function (graphics, camera) {
                // reset test circle
                graphics.resetTransformToCamera(camera);
                hitCircle.draw(graphics, hitCirclePosition, 0);
                // draw line
                graphics.resetTransformToCamera(camera);
                line.draw(graphics, lineStart, lineEnd);
                // draw lines projection point
                graphics.resetTransformToCamera(camera);
                graphics.drawing.drawCircle(d.x, d.y, 5, 'green');
                // draw rectangle
                graphics.resetTransformToCamera(camera);
                rectangle.draw(graphics, rectanglePosition, 0);
                // draw rectangles closest point
                graphics.resetTransformToCamera(camera);
                graphics.drawing.drawCircle(c.x, c.y, 5, 'green');
                // draw circle
                graphics.resetTransformToCamera(camera);
                circle.draw(graphics, circlePosition, 0);
                // draw circles hit point
                graphics.resetTransformToCamera(camera);
                graphics.drawing.drawCircle(x.x, x.y, 5, 'green');
            };
        }
    }

    return Scene;
})

