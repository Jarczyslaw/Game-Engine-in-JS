define(['commons/color'], function (Color) {

    function Content() {

        var white = Color.white();

        this.draw = function (graphics, camera) {
            var x = camera.getWidth() / 2;
            var y = camera.getHeight() / 2;

            graphics.drawing.drawCircle(x, y, 100, white.toText());
        }
    }

    return Content;
})