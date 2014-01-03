/*

    GrassTile
    Author: Tim Schofield
    Date: 21 Feb 2013

    config
    (for Skeleton and Grass)  tileX, tileY
        (for Agent) tileX, tileY, width, height, code, backgroundAnimationObject
            (for Sprite)    x, y, spriteclass, spriteid, backgroundAnimationObject, scalex, scaley, rotation
                (for Animation) millisecondsPF, animationType, animationDirection
                    (for FilmStrip) bitmapType, startFrame, numFrames, lastFrameCallback, firstFrameCallback
                        (for Frame) src, width, height, xOffset, yOffset, frameclass, frameid
*/

//noinspection JSLint
define(['jquery', 'Agent', 'Animation', 'AppConfig'], function ($, Agent, Animation, AppConfig) {

    function GrassTile(config) {
        
        var defaults = {
            gameClass: '00',
            gameID: '00'
        };

        config = $.extend(defaults, config);

        this.gameID = config.gameID;
        this.gameClass = config.gameClass;

        var animObj = {
            millisecondsPF: 300,
            animationType: "loop",
            animationDirection: "forward",
            bitmapType: "landscape",
            startFrame: 0,
            numFrames: 1,
            lastFrameCallback: undefined,
            firstFrameCallback: undefined,
            width: config.width,
            height: config.height,
            src: AppConfig.IMG_PATH + "grass.png",     
            xOffset: 0,
            yOffset: 0,
            frameclass: "grassclass",
            frameid: "grassid"
        };

        config.backgroundAnimationObject = new Animation(animObj);
       

        Agent.apply(this, arguments);

        this.startBg(); // if the grass is animated this will be required

    } // eo constructor
    GrassTile.prototype = Object.create(Agent.prototype);
    GrassTile.prototype.constructor = GrassTile;

    return GrassTile;

});