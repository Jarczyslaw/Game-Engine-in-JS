define(function() {

    function Camera(width, height) {

        // point on canvas where drawing begins, 0;0 is top-left canvas's corner
		var pointOfViewX = 0;
		var pointOfViewY = 0;

        // canvas offset made by camera nonzero position
        var pointOfViewOffsetX = 0;
        var pointOfViewOffsetY = 0;

        this.resetPointOfView = function() {
            this.setPointOfView(0, 0);
        }

        this.setPointOfViewToCenter = function() {
            this.setPointOfView(width / 2, height / 2);
		}

        this.setPointOfView = function(positionX, positionY) {
            pointOfViewX = positionX;
            pointOfViewY = positionY;
        }

        this.moveTo = function(positionX, positionY) {
            pointOfViewOffsetX = -positionX;
            pointOfViewOffsetY = -positionY;
        }

        this.checkVisibility = function(positionX, positionY, rectangleSize) {
            var halfSize = rectangleSize / 2;
            var origin = this.getOrigin();
            var positionInCamera = {
                x : origin.x + positionX,
                y : origin.y + positionY
            }
            if (positionInCamera.x + halfSize > 0 && positionInCamera.x - halfSize < width)
                if (positionInCamera.y + halfSize > 0 && positionInCamera.y - halfSize < height)
                    return true;
            return false;
        }

        this.getOrigin = function() {
            // origin is a point where drawing should start
            return {
                x : pointOfViewX + pointOfViewOffsetX,
                y : pointOfViewY + pointOfViewOffsetY
            }
        }

        this.getWidth = function() {
            return width;
        }

        this.getHeight = function() {
            return height;
        }
    }

    return Camera;

}) 