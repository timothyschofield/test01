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
define(['jquery', 'AppConfig', 'NewFilmStrip'], function ($, AppConfig, NewFilmStrip) {

    NewAnimation.animationType = {};
    NewAnimation.animationType.LOOP = "loop";
    NewAnimation.animationType.PALINDROME = "palindrome";

    NewAnimation.direction = {};
    NewAnimation.direction.FORWARD = "forward";
    NewAnimation.direction.BACKWARD = "backward";

    function NewAnimation(config) {

        var defaults = {
            millisecondsPF: 30,        // milliseconds per frame
            animationType: NewAnimation.animationType.LOOP,
            animationDirection: NewAnimation.direction.FORWARD,
            // The animations will LOOP or PALINDROME between these two frames.
            // Usualy these will be the first and last frames of the animated strip of bitmaps, but it doesnt have to be,
            // The algorithem is in agnostic to how big the animation strip actualy is
            // However firstFrame should always be smaller or equal to lastFrame.
            // If you want an animation to play from the lastFrame to the firstFrame set the animationDirection = BACKWARDS.
            firstFrame: 0,
            lastFrame: 0
        };

        config = $.extend(defaults, config);

        this.millisecondsPF = config.millisecondsPF;
        this.animationType = config.animationType;
        this.animationDirection = config.animationDirection;

        /*
            The WORLDREFRESHRATE is 30ms, is the fastest anything can animate. This is the rate at which the AnimationCntroller
            sends updates. Any animations specified to run faster than WORLDREFRESHRATE, runs at WORLDREFRESHRATE.
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

        // currentRefreshCounter is how the skiping of world updates by a given animation is implamented.
        // currentRefreshCounter is counted down to 0, at which point the animation updates and
        // currentRefreshCounter is set back to worldRefreshRatio for the next frame
        this.currentRefreshCounter = this.worldRefreshRatio;

        config.firstFrameEndCallback = { context: this, thisFunc: this.firstFrameEnd };
        config.lastFrameEndCallback = { context: this, thisFunc: this.lastFrameEnd };

        this.filmStrip = new NewFilmStrip(config);


        this.playing = false;
        this.playNumTimes =  0;      // defualt is 0 (infinite times)
        this.currentIteration = 1;

        // The Animation is added to AnimationController, visible - depending of whether show has been called on the Sprite
        // Not playing.
        // Not displaying the firstFrame - what will be seen is the TLHC of the animation bitmap which is often the same as
        // firstFrame but not nessessarily
        AppConfig.animationController.addAnimation(this);

    } // eo constructor
    /*
        playNumTimes: the number of times a loop or palindrome is played before the Animation is stopsped.
        The animation will stop on the last frame to be played (this might be firstFrame or lastFrame depending on direction of play).
        If no argument is used (or 0 passed as the argumanet value) then the animation will play indefinatly.
        This algorithem just counts the number of times the animation plays between firstFrame and lastFrame so
        for a PALINDROME to play from frame X to Y and back to X playNumTimes has to be 2 (not 1 as you might think)
     */
    NewAnimation.prototype.start = function (playNumTimes) {

        this.playNumTimes = playNumTimes || 0;      // defualt is 0 (play indefinatly)
        this.currentIteration = 1;

        this.playing = true;
        this.currentRefreshCounter = this.worldRefreshRatio;

        if (this.animationDirection === NewAnimation.direction.FORWARD) {
            this.filmStrip.gotoFirstFrame();
        } else {
            this.filmStrip.gotoLastFrame();
        }
    };
    /*
        If an Animation is stop() ed in the middle of animating the FilmStrip then
        it will start() from the firstFrame or lastFrame as normal, depending on its inital direction.
     */
    NewAnimation.prototype.stop = function () {
        this.playing = false;
    };
    /*
     */
    NewAnimation.prototype.update = function () {

        if (this.playing) {

            if (this.currentRefreshCounter === 0) {
                // we have skipped all the world updates we are going to so its time to update the animation

                if (this.animationDirection === NewAnimation.direction.FORWARD) {
                    this.filmStrip.gotoNextFrame();
                } else {
                    this.filmStrip.gotoPreviousFrame();
                }

                this.currentRefreshCounter = this.worldRefreshRatio;
            } else {
                // no animation update this refresh
                this.currentRefreshCounter-=1;
            }

        } // eo playing

    }; // eo update
    /*
     */
    NewAnimation.prototype.firstFrameEnd = function () {
        console.log("firstFrameEnd called");

        if(this.playNumTimes !== 0) {
            console.log("this.currentIteration " + this.currentIteration);
            if(this.currentIteration < this.playNumTimes) {
                this.currentIteration+=1;
            } else {
                this.stop();
                console.log("STOPPED");
                return;
            }
        }

        switch (this.animationType) {

            case NewAnimation.animationType.LOOP:
                this.filmStrip.gotoLastFrame();
                break;

            case NewAnimation.animationType.PALINDROME:
                if (this.animationDirection === NewAnimation.direction.FORWARD) {
                    this.animationDirection = NewAnimation.direction.BACKWARD;
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
    NewAnimation.prototype.lastFrameEnd = function () {
        console.log("lastFrameEnd called");

        if(this.playNumTimes !== 0) {
            console.log("this.currentIteration " + this.currentIteration);
            if(this.currentIteration < this.playNumTimes) {
                this.currentIteration+=1;
            } else {
                this.stop();
                console.log("STOPPED");
                return;
            }
        }

        switch (this.animationType) {

            case NewAnimation.animationType.LOOP:
                this.filmStrip.gotoFirstFrame();
                break;


            case NewAnimation.animationType.PALINDROME:
                if (this.animationDirection === NewAnimation.direction.FORWARD) {
                    this.animationDirection = NewAnimation.direction.BACKWARD;
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
    NewAnimation.prototype.getNode = function () { return this.filmStrip.getNode(); };

    return NewAnimation;
});
















