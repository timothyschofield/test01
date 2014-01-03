/*
    Button
    Author: Tim Schofield
    Date: 23 Feb 2013

    config 
    (for Skeleton and Grass)  tileX, tileY
        (for Agent) tileX, tileY, width, height, gameClass, backgroundAnimationObject
            (for Sprite)    x, y, spriteclass, spriteid, backgroundAnimationObject, scalex, scaley, rotation
                (for Animation) millisecondsPF, animationType, animationDirection
                    (for FilmStrip) bitmapType, startFrame, numFrames, lastFrameCallback, firstFrameCallback
                        (for Frame) src, width, height, xOffset, yOffset, frameclass, frameid
*/

//noinspection JSLint
define(['jquery', 'Agent', 'Animation', 'AppConfig'], function ($, Agent, Animation, AppConfig) {


    Button.CLICK = 'click';
    function Button(config) {

        var defaults = {
            gameClass: '00',
            gameID: '00'
        };

        config = $.extend(defaults, config);
        this.gameID = config.gameID;
        this.gameClass = config.gameClass;

        // For a stationary single bitmap you can get away with just stateing the source
        if(config.gameID === "ID") {
            config.backgroundAnimationObject = new Animation({ src: AppConfig.IMG_PATH + "mine_button.png" });
        } else {
            config.backgroundAnimationObject = new Animation({ src: AppConfig.IMG_PATH + "button.png" });
        }


        Agent.apply(this, arguments);

    } // eo constructor
    Button.prototype = Object.create(Agent.prototype);
    Button.prototype.constructor = Button;
    /*
        Registered in Agent
    */
    Button.prototype.clickHandler = function (eventData) {

        var self = eventData.data.thisContext;
        var request;

        switch (self.gameID) {
            case 'ID': request = "M"; break;
            case '0N': request = "Up"; break;
            case '0S': request = "Down"; break;
            case '0E': request = "Right"; break;
            case '0W': request = "Left"; break;
            default: console.log("In Button - unknown gameID <" + self.gameID + ">");
        }
        // The request is passed as an argument to the event handler registered for Button.CLICK
        // If the event handler is pushOnActionRequestStack then this is the value that is pushed
        // So all Agents registered to listen to Button.CLICK will get this request pushed on their stack
        self.dispatchGameEvent(Button.CLICK, request);  // Button.CLICK is a Game Event
    };

    /*
     */
    Button.prototype.mousedownHandler = function (eventData) {
        var self = eventData.data.thisContext;
        //console.log("mousedown");

    };
    Button.prototype.mouseupHandler = function (eventData) {
        var self = eventData.data.thisContext;
        //console.log("mouseup");

    };




    return Button;

});















