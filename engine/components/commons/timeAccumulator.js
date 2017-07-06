define(function() {

    function TimeAccumulator() {
        
        var timeAccu = 0;
        var timeToTickAccu = 0;

        var tickTime = 0;
        var tickEvent = null;

        this.setTickEvent = function(tick, event) {
            tickTime = tick;
            timeToTickAccu = tickTime;
            tickEvent = event;
        }

        this.disableTickEvent = function() {
            tickEvent = null;
        }

        this.add = function(timeDelta) {
            timeAccu += timeDelta;
            if (tickEvent != null) {
                timeToTickAccu -= timeDelta;
                if (timeToTickAccu <= 0) {
                    tickEvent();
                    timeToTickAccu = tickTime;
                }
            }
        }

        this.getTime = function() {
            return timeAccu;
        }

        this.reset = function() {
            timeAccu = 0;
            timeToTickAccu = tickTime;
        }
    }

    return TimeAccumulator;
})