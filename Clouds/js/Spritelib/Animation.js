/*
     Animation
     Author: Tim Schofield
     Date: Nov 2013

     Animations manage the displaying of a sequence of frames. The Anmations may LOOP,
     or bounce backwards and forwards in a PALINDROME. An Animation may be played a number of times
     or indefinatly. An Animation may be played backward or forward

     A still image is an Animation with one frame.

     We cannot have individual Animations managing their own refreshing because they would
     become be out of sync and we want something akin to double buffering where all Animations
     are updated simultaneously. Animation synchronization is handled by the AnimationController.
     Animations cannot be added to the world directly, they must be inside a Sprite and the Sprite
     is then added to the world.

     LOOP works (infinate)
     BACKWARD and FORWARD
     LOOP works (play a specific number of times including once (1))
     BACKWARD and FORWARD
     PALINDROME works (infinate)
     BACKWARD and FORWARD
     PALINDROME works (play a specific number of times including once (1))
     BACKWARD and FORWARD

     Landscape and Portrait seem to work fine

 */

//noinspection JSLint
define(['jquery', 'AppConfig', 'FilmStrip'], function ($, AppConfig, FilmStrip) {

    Animation.animationType = {};
    Animation.animationType.LOOP = "loop";
    Animation.animationType.PALINDROME = "palindrome";

    Animation.direction = {};
    Animation.direction.FORWARD = "forward";
    Animation.direction.BACKWARD = "backward";

    function Animation(config) {

        var defaults = {
            millisecondsPF: 30,        // milliseconds per frame
            animationType: Animation.animationType.LOOP,
            animationDirection: Animation.direction.FORWARD,
            // The animations will LOOP or PALINDROME between these two frames.
            // Usualy these will be the first and last frames of the animated strip of bitmaps, but it doesnt have to be,
            // The algorithem is agnostic to how big the animation strip actualy is
            // However firstFrame should always be smaller or equal to lastFrame.
            // If you want an animation to play from the lastFrame to the firstFrame set the animationDirection = BACKWARDS.
            firstFrame: 0,
            lastFrame: 0
        };

        config = $.extend(defaults, config);
        this.animationStopCallback = config.animationStopCallback;

        this.millisecondsPF = config.millisecondsPF;
        this.animationType = config.animationType;
        this.animationDirection = config.animationDirection;

        /*
            The WORLDREFRESHRATE is 30ms and is the fastest anything can animate. This is the rate at which the AnimationCntroller
            sends updates to all the Animations. Any animations specified to run faster than WORLDREFRESHRATE, run at WORLDREFRESHRATE.
            Other animation rates are rounded to a multiple of the WORLDREFRESHRATE,
            60ms, 90ms, etc.
            The number of World updates per Animation update
            worldRefreshRatio of 1 = 30ms per frame (update animation every World update)
            worldRefreshRatio of 2 = 60ms per frame (update aniamtion 1 in 2 World update s)
            worldRefreshRatio of 3 = 90ms per frame (update animation 1 in 3 World update s) etc.
        */
        this.worldRefreshRatio = Math.round(this.millisecondsPF / AppConfig.WORLDREFRESHRATE);
        if (this.worldRefreshRatio === 0) {
            this.worldRefreshRatio = 1;
        }

        // currentRefreshCounter is how the skipping of world updates by a given animation is implamented.
        // currentRefreshCounter is counted down to 0, at which point the animation updates and
        // currentRefreshCounter is set back to worldRefreshRatio for the next frame
        this.currentRefreshCounter = this.worldRefreshRatio;

        config.firstFrameEndCallback = { context: this, thisFunc: this.firstFrameEnd };
        config.lastFrameEndCallback = { context: this, thisFunc: this.lastFrameEnd };

        this.filmStrip = new FilmStrip(config);


        this.playing = false;
        this.playNumTimes =  0;      // defualt is 0 (infinite times)
        this.currentIteration = 1;

        // The Animation is added to AnimationController, visible - depending of whether show has been called on the Sprite
        // Not playing.
        // Not displaying the firstFrame - what will be seen is the TLHC of the animation bitmap which is often the same as
        // firstFrame but not nessessarily

         if(config.lastFrame !== config.firstFrame) {
             AppConfig.animationController.addAnimation(this);
         }


    } // eo constructor
    /*
        Removes the Animation from the AnimationController.
        This still leaves the DOM reference. The div is origonly created in Frame
        The DOM reference is handled by using jQuery remove()
     */
    Animation.prototype.removeAnimation = function () {
        this.filmStrip.getNode().remove();
        AppConfig.animationController.removeAnimation(this);
    };
    /*
        playNumTimes: the number of times a loop or palindrome is played before the Animation is stopped.
        The animation will stop on the last frame to be played (this might be firstFrame or lastFrame depending on direction of play).
        If no argument is used (or 0 passed as the argumanet value) then the animation will play indefinatly.
        This algorithem just counts the number of times the animation plays between firstFrame and lastFrame so
        for a PALINDROME to play from frame X to Y and back to X playNumTimes has to be 2 (not 1 as you might expect)
     */
    Animation.prototype.start = function (playNumTimes) {

        this.playNumTimes = playNumTimes || 0;      // defualt is 0 (play indefinatly)
        this.currentIteration = 1;

        this.playing = true;
        this.currentRefreshCounter = this.worldRefreshRatio;

        if (this.animationDirection === Animation.direction.FORWARD) {
            this.filmStrip.gotoFirstFrame();
        } else {
            this.filmStrip.gotoLastFrame();
        }
    };
    /*
        If an Animation is stop() ed in the middle of animating the FilmStrip then
        it will (re) start() from the firstFrame or lastFrame as normal, depending on its inital direction.
     */
    Animation.prototype.stop = function () {
        this.playing = false;
        //console.log("STOPPED ");
    };
    /*
     */
    Animation.prototype.update = function () {

        if (this.playing) {
            if (this.currentRefreshCounter === 0) {
                // we have skipped all the world updates we are going to so its time to update the animation

                if (this.animationDirection === Animation.direction.FORWARD) {
                    this.filmStrip.gotoNextFrame();
                } else {
                    this.filmStrip.gotoPreviousFrame();
                }

                this.currentRefreshCounter = this.worldRefreshRatio;
            } else {
                // no animation update this world update
                this.currentRefreshCounter-=1;
            }

        } // eo playing

    }; // eo update
    /*
     */
    Animation.prototype.firstFrameEnd = function () {
        if(this.playNumTimes !== 0) {
            //console.log("this.currentIteration " + this.currentIteration);
            if(this.currentIteration < this.playNumTimes) {
                this.currentIteration+=1;
            } else {
                this.stop();
                if(this.animationStopCallback) {
                    this.animationStopCallback.thisFunc.call(this.animationStopCallback.context);
                }
                return;
            }
        }

        switch (this.animationType) {

            case Animation.animationType.LOOP:
                this.filmStrip.gotoLastFrame();
                break;

            case Animation.animationType.PALINDROME:
                if (this.animationDirection === Animation.direction.FORWARD) {
                    this.animationDirection = Animation.direction.BACKWARD;
                    this.filmStrip.gotoPreviousFrame();
                } else {
                    this.animationDirection = Animation.direction.FORWARD;
                    this.filmStrip.gotoNextFrame();
                }
                break;

        } // eo switch

    };
    /*
     */
    Animation.prototype.lastFrameEnd = function () {
        //console.log("lastFrameEnd called");

        if(this.playNumTimes !== 0) {
            //console.log("this.currentIteration " + this.currentIteration);
            if(this.currentIteration < this.playNumTimes) {
                this.currentIteration+=1;
            } else {
                this.stop();
                if(this.animationStopCallback) {
                    this.animationStopCallback.thisFunc.call(this.animationStopCallback.context);
                }
                return;
            }
        }

        switch (this.animationType) {

            case Animation.animationType.LOOP:
                this.filmStrip.gotoFirstFrame();
                break;


            case Animation.animationType.PALINDROME:
                if (this.animationDirection === Animation.direction.FORWARD) {
                    this.animationDirection = Animation.direction.BACKWARD;
                    this.filmStrip.gotoPreviousFrame();
                } else {
                    this.animationDirection = NewAnimation.direction.FORWARD;
                    this.filmStrip.gotoNextFrame();
                }
                break;

        } // eo switch

    };

    /*
     */
    Animation.prototype.getNode = function () { return this.filmStrip.getNode(); };
    Animation.prototype.hide = function () { this.filmStrip.getNode().hide(); };
    Animation.prototype.show = function () { this.filmStrip.getNode().show(); };

    return Animation;
});
















