/**
 * Created by Timothy on 17/12/13.
 */

//noinspection JSLint
define(['jquery'], function ($) {


        function PhysicsObject(object, config) {

            this.pE = config.pE;    // the physics engine
            this.t = 1; // to be proper
            this.x = config.x || 0;
            this.y = config.y || 0;
            this.mass = config.mass || 1;

            this.vX = config.vX || 0;
            this.vY = config.vY || 0;
            this.forceX = config.forceX || 0;
            this.forceY = config.forceY || 0;

            this.object = object;

            this.boundaries =  [
                { test: function () { return this.x > this.pE.rightWorld; },
                    response: function() {
                        this.x = this.pE.leftWorld - this.object.width;
                    }
                },

                { test: function () { return this.x < this.pE.leftWorld - this.object.width; },
                    response: function() {
                        this.x = this.pE.rightWorld;
                    }
                },

                { test: function () { return this.y > this.pE.bottomWorld - this.object.height; },
                    response: function() {
                        this.y = this.pE.bottomWorld - this.object.height;
                        this.vX = this.vX * this.pE.bottomWorldFriction;
                        this.vY = -this.vY * this.pE.bottomWorldBounce;
                    }
                },

                { test: function () { return this.y < this.pE.topWorld; },
                    response: function() {
                        this.y = this.pE.topWorld;
                        this.vY = -this.vY * this.pE.topWorldBounce;
                    }
                }
            ];

            } // eo constructor
        /*
         */
        PhysicsObject.prototype.update = function () {

            this.aX = this.forceX/this.mass;
            this.vX = this.vX + this.aX * this.t;
            this.x = this.x + this.vX * this.t;

            this.aY = this.forceY/this.mass + this.pE.gravity;
            this.vY = this.vY + this.aY * this.t;
            this.y = this.y + this.vY * this.t;

            this.testBoundaries();
        };
        /*
         */
        PhysicsObject.prototype.testBoundaries = function () {
            var n;
            var numBoundaries = this.boundaries.length;

            for(n = 0; n < numBoundaries; n+=1) {
                if(this.boundaries[n].test.call(this)) {
                    this.boundaries[n].response.call(this);
                }
            }
        };
        /*
         */
        PhysicsObject.prototype.getAcceleration = function () {
            return { aX: this.aX, aY: this.aY };
        };

        return PhysicsObject;

    });


