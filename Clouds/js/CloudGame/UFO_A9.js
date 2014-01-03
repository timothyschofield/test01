/**
 * Created by Timothy on 17/12/13.
 * Do NOT move this UFO by applying moveTo or any external transforms - all motions ane done
 * by applying force in the PhysicsEngine
 */

//noinspection JSLint
define(['jquery', 'Layer','AppConfig', 'Sprite', 'Animation', 'SpriteGame', 'Loader', 'PhysicsObject', 'Keys'],
    function ($, Layer, AppConfig, Sprite, Animation, SpriteGame, Loader, PhysicsObject, Keys) {


        function UFO_A9(physicsConfig) {

            this.enginePower = 0.1;     // used to apply force to the ufo's mass
            this.maxAccAngle = 20;      // the ufo tilts when it accelerates
            this.minAccAngle = -20;     // the ufo tilts when it accelerates
            this.currentAccAngle = 0;
            this.accAnglePerAcc = 0.5;  // the angle the ufo changes through per update if accelerating
            this.currentOpacity = 1.0;  // current opacity of the greenGlow engine jet plume

            this.loader = new Loader();
            this.loader.loadImages(AppConfig.IMG_PATH,
                [
                    "UFO_A9_RAF.png",
                    "GreenGlow.png",
                    "left_burn.png",
                    "right_burn.png"
                ]);


            this.container = new Sprite({ spriteid: "ufoA9Container" });
            this.container.width = 144;
            this.container.height = 44;
            //this.container.draggable();
            // need to set the width and height or the rotation will always be about the tlhc
            this.container.setCSS({
                    '-webkit-transform-origin': '50% 50%',
                    '-moz-transform-origin': '50% 50%',
                    '-ms-transform-origin': '50% 50%',
                    width: this.container.width + 'px',
                    height: this.container.height + 'px'
                });
            // call here so that the container is defined
            // need to pass the container in for convex hull collisions with world boundries
            PhysicsObject.call(this, this.container, physicsConfig);

            //////////////////////////////////////
            var greenGlow = {
                width: 150,
                height: 54,
                src: AppConfig.IMG_PATH + "GreenGlow.png"
            };
            this.greenGlowSprite = new Sprite({ spriteid: "greenGlow_id", backgroundAnimationObject: new Animation(greenGlow) });
            this.container.addChildSprites(this.greenGlowSprite);
            this.greenGlowSprite.moveTo(-1, 37);

            //////////////////////////////////////
            var ufoBody = {
                width: 144,
                height: 44,
                src: AppConfig.IMG_PATH + "UFO_A9_RAF.png"
            };
            var ufoBodySprite = new Sprite({ spriteid: "ufo_A9_body", backgroundAnimationObject: new Animation(ufoBody) });
            this.container.addChildSprites(ufoBodySprite);
            //////////////////////////////////////
            var leftburn = {
                width: 63,
                height: 26,
                src: AppConfig.IMG_PATH + "left_burn.png"
            };
            this.leftBurnSprite = new Sprite({ spriteid: "leftburn", backgroundAnimationObject: new Animation(leftburn) });
            this.container.addChildSprites(this.leftBurnSprite);
            this.leftBurnSprite.moveTo(-6, 19);
            /////////////////////////////////////
            var rightburn = {
                width: 63,
                height: 26,
                src: AppConfig.IMG_PATH + "right_burn.png"
            };
            this.rightBurnSprite = new Sprite({ spriteid: "rightburn", backgroundAnimationObject: new Animation(rightburn) });
            this.container.addChildSprites(this.rightBurnSprite);
            this.rightBurnSprite.moveTo(90, 19);



        } // eo constructor
        UFO_A9.prototype = Object.create(PhysicsObject.prototype);
        UFO_A9.prototype.constructor = UFO_A9;
        /*
         */
        UFO_A9.prototype.update = function () {

            var forceX = 0;
            var forceY = 0;

            if(Keys.theseKeysDown.Up) { forceY = forceY - this.enginePower; }
            if(Keys.theseKeysDown.Down) { forceY = forceY + this.enginePower; }
            if(Keys.theseKeysDown.Right) { forceX = forceX + this.enginePower; }
            if(Keys.theseKeysDown.Left) { forceX = forceX - this.enginePower; }

            this.forceX = forceX;
            this.forceY = forceY;

            PhysicsObject.prototype.update.call(this); // calls the ancestor update
            this.container.moveTo(this.x, this.y);

            // doesn't work exactly for even numbers - so don't use them
            // In the case of jiggleStrength = 5: output is -2, -1, 0, 1 or 2
            // In the case of jiggleStrength = 6: output is -3,-2, -1, 0, 1 or 2 (asymetric - bad!)
            // In the case of jiggleStrength = 7: output is -3,-2, -1, 0, 1, 2 or 3
            var jiggleStrength = 3;
            var randomAngle = (Math.floor( (Math.random() * jiggleStrength ) - Math.floor( jiggleStrength/2))) * 0.5;
            this.currentAccAngle+=randomAngle;

            // simple linear angle as function of force with hard cut off
            // accelerating right wards, rotates acw
            if(this.forceX > 0)
            {
                if(this.currentAccAngle < this.maxAccAngle)
                {
                    this.currentAccAngle+=this.accAnglePerAcc;
                }
            }
            else
            {   // no acceleration, so settles back to zero angle
                if(this.forceX === 0)
                {
                  if(this.currentAccAngle > 0)
                  {
                      this.currentAccAngle-=this.accAnglePerAcc;
                  }
                  else
                  {   // will hum! good
                      this.currentAccAngle+=this.accAnglePerAcc;
                  }
                }
                else
                {   // accelerating left wards, rotates cw
                    if(this.forceX < 0) {
                        if(this.currentAccAngle > this.minAccAngle)
                        {
                            this.currentAccAngle-=this.accAnglePerAcc;
                        }
                    }
                }
            }

            this.setEngineOpacity();
            this.container.transform( {rotate: this.currentAccAngle} );
        };
        /*
         */
        UFO_A9.prototype.setEngineOpacity = function () {
            var totalForce = Math.abs(this.forceX) + Math.abs(this.forceY);

            var maxForce = this.enginePower * 2;
            var minOpacity = 0.1;
            var maxOpacity = 1.0;
            var throttleRate = 0.05;
            var targetOpacity = minOpacity + (totalForce/maxForce) * (maxOpacity - minOpacity);

            // inbetween to the target opacitie - good that it oscillates
            if(targetOpacity > this.currentOpacity ) {
                this.currentOpacity  = this.currentOpacity  + throttleRate;
            } else {
                this.currentOpacity  = this.currentOpacity  - throttleRate;
            }

            this.greenGlowSprite.setCSS( {opacity: this.currentOpacity } );
        };



        return UFO_A9;
    });



























