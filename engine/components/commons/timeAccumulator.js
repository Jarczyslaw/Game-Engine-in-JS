define(function() {

    function TimeAccumulator(tickTime, tickEvent) {
        
        var timeAccu = 0;

        this.add = function(timeDelta) {
            timeAccu += timeDelta;
            if (timeAccu > tickTime) {
                tickEvent();
                timeAccu = 0;
            }
        }

        this.reset = function() {
            timeAccu = 0;
        }
    }

    return TimeAccumulator;
})