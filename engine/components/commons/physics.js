define(['commons/vector'], function(Vector) {

    function Angular() {

        // assume that moment of inertia = 1
        this.rotation = 0;
        this.velocity = 0;
        var acceleration = 0;
        this.torque = 0;
        this.torqueImpulse = 0;
        this.drag = 0;

        this.enabled = false;

        this.getAcceleration = function() {
            return acceleration;
        }

        this.stop = function() {
            this.velocity = 0;
            this.torque = 0;
            this.impulse = 0;
        }

        this.update = function(timeDelta) {
            if (this.enabled) {
                var externalTorques = this.torque + this.torqueImpulse; 
                var acceleration = (this.velocity * -this.drag) + externalTorques;
                this.velocity += acceleration * timeDelta;
                this.rotation += this.velocity * timeDelta;

                this.torqueImpulse = 0;
            }
        }
    }

    function Linear() {

        // assume that mass = 1
        this.position = Vector.zeros();
        this.velocity = Vector.zeros();
        var acceleration = Vector.zeros();
        this.force = Vector.zeros();
        this.impulse = Vector.zeros();
        this.drag = 0;

        // gravity
        this.gravity = Vector.zeros();

        this.enabled = false;

        this.getAcceleration = function() {
            return acceleration;
        }

        this.stop = function() {
            this.velocity.zero();
            this.force.zero();
            this.impulse.zero();
        }

        this.update = function(timeDelta) {
            if (this.enabled) {
                var externalForces = this.force.add(this.impulse).add(this.gravity);
                var acceleration = this.velocity.multiply(-this.drag).add(externalForces);
                this.velocity = this.velocity.add(acceleration.multiply(timeDelta));
                this.position = this.position.add(this.velocity.multiply(timeDelta));

                this.impulse.zero();
            }
        }
    }

    return {
        Linear : Linear,
        Angular : Angular
    };
})