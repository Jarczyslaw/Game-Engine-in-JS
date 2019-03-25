define(function() {

    function Color() {

        var r = 255;
        var g = 255;
        var b = 255;
        var a = 255;

        var textForm;

        var getTextForm = function() {
            textForm = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a / 255 + ')'; 
        }
        getTextForm();

        this.toHex = function() {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        this.toText = function() {
            return textForm;
        }

        this.setRGBA = function(colorR, colorG, colorB, colorA) {
            r = colorR;
            g = colorG;
            b = colorB;
            a = colorA;
            getTextForm();
        }

        this.setRGB = function(colorR, colorG, colorB) {
            this.setRGBA(colorR, colorG, colorB, a);
        }

        this.setR = function(colorR) {
            r = colorR;
            getTextForm();
        }

        this.setG = function(colorG) {
            g = colorG;
            getTextForm();
        }

        this.setB = function(colorB) {
            r = colorB;
            getTextForm();
        }

        this.setA = function(colorA) {
            a = colorA;
            getTextForm();
        }

        this.getR = function() {
            return r;
        }

        this.getG = function() {
            return g;
        }

        this.getB = function() {
            return b;
        }

        this.getA = function() {
            return a;
        }
    }

    Color.random = function(randomAlpha = false) {
        var color = new Color();
        var rComp = Math.randomIntInRange(0, 255);
        var gComp = Math.randomIntInRange(0, 255);
        var bComp = Math.randomIntInRange(0, 255);
        if (!randomAlpha)
            color.setRGB(rComp, gComp, bComp);
        else {
            var aComp = Math.randomIntInRange(0, 255);
            color.setRGBA(rComp, gComp, bComp, aComp);
        }
        return color;
    }

    Color.custom = function(r, g, b, a) {
        var c = new Color();
        c.setRGBA(r, g, b, a);
        return c;
    }

    Color.white = function() {
        return new Color();
    }

    Color.black = function() {
        var color = new Color();
        color.setRGB(0, 0, 0);
        return color;
    }

    Color.red = function() {
        var color = new Color();
        color.setRGB(255, 0, 0);
        return color;
    }

    Color.green = function() {
        var color = new Color();
        color.setRGB(0, 255, 0);
        return color;
    }

    Color.blue = function() {
        var color = new Color();
        color.setRGB(0, 0, 255);
        return color;
    }

    return Color;
})
