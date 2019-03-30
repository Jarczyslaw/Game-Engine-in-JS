define(['commons/vector'], function (Vector) {

    class Angular {
        constructor() {
            // assume that moment of inertia = 1
            this.rotation = 0;
            this.velocity = 0;
            this.torque = 0;
            this.torqueImpulse = 0;
            this.drag = 0;
            this.enabled = false;
            let acceleration = 0;

            this.getAcceleration = function () {
                return acceleration;
            };

            this.stop = function () {
                this.velocity = 0;
                this.torque = 0;
                this.torqueImpulse = 0;
            };

            this.reset = function () {
                this.stop();
                this.rotation = 0;
                acceleration = 0;
            };

            this.update = function (timeDelta) {
                if (this.enabled) {
                    let externalTorques = this.torque + this.torqueImpulse;
                    acceleration = (this.velocity * -this.drag) + externalTorques;
                    this.velocity += acceleration * timeDelta;
                    this.rotation += this.velocity * timeDelta;
                    this.torqueImpulse = 0;
                }
            };
        }
    }

    class Linear {
        constructor() {
            // assume that mass = 1
            this.position = Vector.zeros();
            this.velocity = Vector.zeros();
            this.force = Vector.zeros();
            this.impulse = Vector.zeros();
            this.drag = 0;
            this.gravity = Vector.zeros();
            this.enabled = false;
            let acceleration = Vector.zeros();

            this.getAcceleration = function () {
                return acceleration;
            };
            this.stop = function () {
                this.velocity.zero();
                this.force.zero();
                this.impulse.zero();
            };
            this.reset = function () {
                this.stop();
                this.position.zero();
                acceleration.zero();
            };
            this.update = function (timeDelta) {
                if (this.enabled) {
                    let externalForces = this.force.add(this.impulse).add(this.gravity);
                    acceleration = this.velocity.multiply(-this.drag).add(externalForces);
                    this.velocity = this.velocity.add(acceleration.multiply(timeDelta));
                    this.position = this.position.add(this.velocity.multiply(timeDelta));
                    this.impulse.zero();
                }
            };
        }
    }

    return {
        Linear: Linear,
        Angular: Angular
    };
})