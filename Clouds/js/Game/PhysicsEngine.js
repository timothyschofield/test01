/**
 * Created by Timothy on 17/12/13.
 */

//noinspection JSLint
define(['jquery'], function ($) {

        function PhysicsEngine() {

            this.physicsObjects = [];

            this.leftWorld = 0;
            this.rightWorld = 960;
            this.topWorld = 0;
            this.bottomWorld = 640;

            this.topWorldBounce = 0.5;
            this.bottomWorldBounce = 0.2;
            this.bottomWorldFriction = 0.95;
            this.gravity = 0.0; // 0.02

        } // eo constructor
        /*
         */
        PhysicsEngine.prototype.addObject = function(newObject) {
            this.physicsObjects.push(newObject);
        };
        /*
         */
        PhysicsEngine.prototype.update = function() {
            this.physicsObjects.forEach(function(thisObject) {
                thisObject.update();
            } );
        };

        return PhysicsEngine;
    });


