define(['commons/Vector'], function(Vector) {

    function Angular() {

        // assume moment of inertia = 1
        this.rotation = 0;
        this.velocity = 0;
        this.acceleration = 0;
        this.torque = 0;
        this.torqueImpulse = 0;
        this.drag = 0;

        this.update = function(timeDelta) {
            var externalTorques = this.torque + this.torqueImpulse;
            this.acceleration = (this.velocity * -this.drag) + externalTorques;
            this.velocity += this.acceleration * timeDelta;
            this.rotation += this.velocity * timeDelta;

            this.torqueImpulse = 0;
        }
    }

    function Linear() {

        // assume that mass = 1
        this.position = Vector.zeros();
        this.velocity = Vector.zeros();
        this.acceleration = Vector.zeros();
        this.force = Vector.zeros();
        this.impulse = Vector.zeros();
        this.drag = 0;

        // gravity
        this.gravity = Vector.zeros();

        this.update = function(timeDelta) {
            var externalForces = this.force.add(this.impulse).add(this.gravity);
            this.acceleration = this.velocity.multiply(-this.drag).add(externalForces);
            this.velocity = this.velocity.add(this.acceleration.multiply(timeDelta));
            this.position = this.position.add(this.velocity.multiply(timeDelta));

            this.impulse.zero();
        }
    }

    return {
        Linear : Linear,
        Angular : Angular
    };
})