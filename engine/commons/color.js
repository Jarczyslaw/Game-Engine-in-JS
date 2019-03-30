define(function () {

    class Color {
        constructor() {
            let r = 255;
            let g = 255;
            let b = 255;
            let a = 255;
            let textForm;

            let getTextForm = function () {
                textForm = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a / 255 + ')';
            };

            this.toHex = function () {
                return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            };

            this.toText = function () {
                return textForm;
            };

            this.setRGBA = function (colorR, colorG, colorB, colorA) {
                r = colorR;
                g = colorG;
                b = colorB;
                a = colorA;
                getTextForm();
            };

            this.setRGB = function (colorR, colorG, colorB) {
                this.setRGBA(colorR, colorG, colorB, a);
            };

            this.setR = function (colorR) {
                r = colorR;
                getTextForm();
            };

            this.setG = function (colorG) {
                g = colorG;
                getTextForm();
            };

            this.setB = function (colorB) {
                r = colorB;
                getTextForm();
            };

            this.setA = function (colorA) {
                a = colorA;
                getTextForm();
            };

            this.getR = function () {
                return r;
            };

            this.getG = function () {
                return g;
            };

            this.getB = function () {
                return b;
            };

            this.getA = function () {
                return a;
            };

            getTextForm();
        }

        static random(randomAlpha = false) {
            let color = new Color();
            let rComp = Math.randomIntInRange(0, 255);
            let gComp = Math.randomIntInRange(0, 255);
            let bComp = Math.randomIntInRange(0, 255);
            if (!randomAlpha)
                color.setRGB(rComp, gComp, bComp);
            else {
                let aComp = Math.randomIntInRange(0, 255);
                color.setRGBA(rComp, gComp, bComp, aComp);
            }
            return color;
        }

        static custom(r, g, b, a) {
            let c = new Color();
            c.setRGBA(r, g, b, a);
            return c;
        }

        static white() {
            return new Color();
        }

        static black() {
            let color = new Color();
            color.setRGB(0, 0, 0);
            return color;
        }

        static red() {
            let color = new Color();
            color.setRGB(255, 0, 0);
            return color;
        }

        static green() {
            let color = new Color();
            color.setRGB(0, 255, 0);
            return color;
        }

        static blue() {
            let color = new Color();
            color.setRGB(0, 0, 255);
            return color;
        }
    }

    return Color;
})
