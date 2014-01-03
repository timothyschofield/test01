/**
 * Created by Timothy on 19/11/13.
 */

//noinspection JSLint
define(['jquery', 'Frame'], function ($, Frame) {

    FilmStrip.bitmapType = {};
    FilmStrip.bitmapType.LANDSCAPE = "landscape";
    FilmStrip.bitmapType.PORTRAIT = "portrait";

    function FilmStrip(config) {

        var defaults = {
            bitmapType: FilmStrip.bitmapType.LANDSCAPE,
            firstFrame: 0,
            lastFrame: 0,
            width: 48,
            height: 48,
            firstFrameEndCallback: { },
            lastFrameEndCallback: { }
        };

        config = $.extend(defaults, config);

        this.bitmapType = config.bitmapType;
        this.width = config.width;
        this.height = config.height;

        // The animations will LOOP or PALINDROME between these two frame.
        // Usualy these will be the first and last frames of the animated strip of bitmaps, but it doesnt have to be,
        // The algorithem is in agnostic to how big the animation strip actualy is
        this.firstFrame = config.firstFrame;
        this.lastFrame = config.lastFrame;


        this.numFrames = Math.abs(this.lastFrame - this.firstFrame) + 1;
        this.firstFrameEndCallback = config.firstFrameEndCallback;  // This is an object { context: this, thisFunc: this.firstFrameEnd }
        this.lastFrameEndCallback = config.lastFrameEndCallback;    // This is an object { context: this, thisFunc: this.lastFrameEnd }
        this.deltaX = 0;
        this.deltaY = 0;
        this.currentFrame = this.firstFrame;
        this.filmstripEndReachedFlag = false;       // set to true when the strip reaches the last or first frame

        // The deltas are the pixel distances between frames
        // The width and height of a frame might vary from one film strip to another - for a tile game they tend to be the same
        if (this.bitmapType === FilmStrip.bitmapType.LANDSCAPE) {
            this.deltaX = this.width;
            this.deltaY = 0;
        } else {
            this.deltaX = 0;
            this.deltaY = this.height;
        }

        this.frame = new Frame(config);

        this.currentFrame = this.firstFrame;

    } // eo constructor
    /*
     */
    FilmStrip.prototype.gotoFirstFrame = function () {
        this.currentFrame = this.firstFrame;
        this.filmstripEndReachedFlag = false;
        this.gotoCurrentFrame();
    };
    /*
     */
    FilmStrip.prototype.gotoLastFrame = function () {
        this.currentFrame = this.lastFrame;
        this.filmstripEndReachedFlag = false;
        this.gotoCurrentFrame();
    };
    /*
        note that if numFrames === 1 its a still image and
        lastFrameEndCallback and firstFrameEndCallback are never called
    */
    FilmStrip.prototype.gotoNextFrame = function () {

        if (this.numFrames !== 1) {
            if (this.filmstripEndReachedFlag) {
                this.filmstripEndReachedFlag = false;
                this.lastFrameEndCallback.thisFunc.call(this.lastFrameEndCallback.context);
            } else {

                if (this.currentFrame < this.lastFrame) {
                    this.currentFrame+=1;

                    this.gotoCurrentFrame();
                    if (this.currentFrame === this.lastFrame) {

                        this.filmstripEndReachedFlag = true;    // must give the frame time to display - so can't send callback immediatly
                    }
                }
            }
        }
    };
    FilmStrip.prototype.gotoPreviousFrame = function () {

        if (this.numFrames !== 1) {
            //console.log("gotoPreviousFrame")
            if (this.filmstripEndReachedFlag) {
                this.filmstripEndReachedFlag = false;
                this.firstFrameEndCallback.thisFunc.call(this.firstFrameEndCallback.context);
            } else {

                if (this.currentFrame > this.firstFrame) {
                    this.currentFrame-=1;
                    this.gotoCurrentFrame();
                    if (this.currentFrame === this.firstFrame) {
                        this.filmstripEndReachedFlag = true;    // must give the frame time to display - so can't send callback immediatly
                    }
                }
            }
        }
    };
    /*
     */
    FilmStrip.prototype.gotoCurrentFrame = function () {
        this.frame.setOffsets(-this.deltaX * this.currentFrame, -this.deltaY * this.currentFrame);

    };
    /*
     */
    FilmStrip.prototype.getNode = function () { return this.frame.getNode(); };

    return FilmStrip;
});
