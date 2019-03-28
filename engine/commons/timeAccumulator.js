define(function () {

    class TimeAccumulator {
        constructor() {
            this.enabled = false;
            let timeAccu = 0;
            let timeToTickAccu = 0;
            let tickTime = 0;
            let tickEvent = null;

            this.setTickEvent = function (tick, event) {
                tickTime = tick;
                timeToTickAccu = tickTime;
                tickEvent = event;
            };

            this.disableTickEvent = function () {
                tickEvent = null;
            };

            this.add = function (timeDelta) {
                if (!this.enabled)
                    return;
                timeAccu += timeDelta;
                if (tickEvent != null) {
                    timeToTickAccu -= timeDelta;
                    if (timeToTickAccu <= 0) {
                        tickEvent();
                        timeToTickAccu = tickTime;
                    }
                }
            };

            this.getTime = function () {
                return timeAccu;
            };

            this.reset = function () {
                timeAccu = 0;
                timeToTickAccu = tickTime;
            };
        }
    }

    return TimeAccumulator;
})