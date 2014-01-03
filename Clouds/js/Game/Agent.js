/*

    Agent
    Author: Tim Schofield
    Date: 22 Feb 2013

    Agent inherits from Sprite.

    config
        (for Agent) tileX, tileY, width, height, code, backgroundAnimationObject
            (for Sprite)    x, y, spriteclass, spriteid, backgroundAnimation (an object), scalex, scaley, rotation
                (for Animation) millisecondsPF, animationType, animationDirection
                    (for FilmStrip) bitmapType, startFrame, numFrames, lastFrameCallback, firstFrameCallback
                        (for Frame) src, width, height, xOffset, yOffset, frameclass, frameid

    The TileGame.map is where the references to the Agents are kept.
*/
//noinspection JSLint
define(['jquery', 'Sprite', 'TrainGameConfig','AppConfig','EventDispatcher'],
                                                function ($, Sprite, TrainGameConfig, AppConfig, EventDispatcher) {

    Agent.STARTMOVE = "startmove";  // sent when an agent starts a move to another tile
    Agent.ENDMOVE = "endmove";      // sent when an agent completes a move to another tile

    function Agent(config) {

        // good practice to collect handles to all listeners here or removeListeners will not work properly
        this.myListeners = [];

        var defaults = {
            tileX: 0,
            tileY: 0,
            width: TrainGameConfig.tileWidth,
            height: TrainGameConfig.tileHeight,
            backgroundAnimation: undefined      // an Object
        };

        config = $.extend(defaults, config);

        config.spriteid = this.gameID;              // for selection childID
        config.spriteclass = this.gameClass;        // for selection childClass
        this.tileX = config.tileX;
        this.tileY = config.tileY;
        this.width = config.width;
        this.height = config.height;


        // Invokes the Sprite constructor as a method of this Agent with the arguments that were passed into this Agent
        Sprite.apply(this, arguments);

        this.moveTo(this.tileX * this.width, this.tileY * this.height);

        this.addSpriteEventListener('click', this.clickHandler);
       // this.addSpriteEventListener('mousedown', this.mousedownHandler);
       // this.addSpriteEventListener('mouseup', this.mouseupHandler);

        this.actionRequestStack = [];

    }   // eo constructor
    // Agent inherits from Sprite
    Agent.prototype = Object.create(Sprite.prototype);
    Agent.prototype.constructor = Agent;
    /*
        For example inherited by Male. Each time Male  registers an event listener, this is called
        It calls the EventDispatcher to addGameEventListener and also pushs the returned handle onto the
        myListeners list. This is so each Agent has a list of its registered listeners.
        When we removeListeners, this list is used.
        I'M NOT SURE ABOUT THIS
     */
    Agent.prototype.addGameEventListener = function (eventType, callback, context) {
        //console.log("adding listeners " + eventType + " " +  callback + " " + context);

        var thisEventHandle = EventDispatcher.prototype.addGameEventListener(eventType, callback, context);
        this.myListeners.push(thisEventHandle);
    };
    /*
     This function relies on the listeners having been pushed on this.myListeners as they are created
     Event handles have the structure
     {eventType: eventTypeX,  callback: callbackX, context: contextX }
     */
    Agent.prototype.removeListeners = function () {
        var self = this; // is forEach worth it?
        this.myListeners.forEach(function(thisEventHandle) {
           // console.log("removing listeners " + thisEventHandle.eventType + " " +  thisEventHandle.callback + " " + thisEventHandle.context);
            self.removeGameEventListener(thisEventHandle.eventType, thisEventHandle.callback, thisEventHandle.context);
        });
    };
    /*
    */              
    Agent.prototype.clickHandler = function (eventData) {
        // var self = eventData.data.thisContext;
        // console.log("agent:" + self.gameClass + " " + self.gameID)
    };
    /*
     */
    //Agent.prototype.mousedownHandler = function (eventData) {
        // var self = eventData.data.thisContext;
        // console.log("agent:" + self.gameClass + " " + self.gameID)
    //};
    /*
     */
   // Agent.prototype.mouseupHandler = function (eventData) {
        // var self = eventData.data.thisContext;
        // console.log("agent:" + self.gameClass + " " + self.gameID)
    //};
    /*
        thisAction {action:X, parameters:[a,b,...]}
    */
    // NOT USED
    Agent.prototype.pushOnActionRequestStack = function (thisAction) {
        if (this.selected) {
            this.actionRequestStack.push(thisAction);
            //this.printStack();
            this.popRequestStack();
        }
    };
    /*
    */
    // NOT USED
    Agent.prototype.popRequestStack = function () {
        var newActionRequest;

        if (!this.locked) {
            if (this.actionRequestStack.length > 0) {
                newActionRequest = this.actionRequestStack.shift();
                //this.printStack();
                this.executeActionFromStack(newActionRequest);
            } else {

                newActionRequest = { action: 'idle', parameters: [] };  // sent idle if there are no pending requests
                //this.executeActionFromStack(newActionRequest);
            }
        } else {
            //console.log('not popped - locked stack');
        }
    };
    /*
    */
    Agent.prototype.gameEdgeCollision = function (newX, newY) {
        return newX < 0 || newY < 0 || newX > TrainGameConfig.width - 1 || newY > TrainGameConfig.height - 1;
    };
    /*
    */
    // NOT USED
    Agent.prototype.lockRequestStack = function () {
        this.locked = true;
    };
    /*
    */
    // NOT USED
    Agent.prototype.unlockAndPopRequestStack = function (eventData) {
        if (eventData) {
            var self = eventData.data.thisContext;
            self.locked = false;
            self.popRequestStack();
        } else {
            this.locked = false;
            this.popRequestStack();
        }
    };
    /*
        Has already been checked against game boundary and illegal tiles
     */
    Agent.prototype.moveToTile = function (newMapX, newMapY) {
        var n;

        var thisLoc = this.trainGame.map[this.tileY][this.tileX];
        var thisLocLen = thisLoc.length;
        for (n = 0; n < thisLocLen; n+=1) {

            if (thisLoc[n] === this) {
                thisLoc.splice(n, 1);
                this.tileX = newMapX;
                this.tileY = newMapY;
                this.trainGame.map[this.tileY][this.tileX].push(this);

                this.dispatchGameEvent(Agent.STARTMOVE);

                break;
            }
        }
    };
    /*
        returns a list of the Agent gameClass s at this Agents location, e.g. ["MA", "GA"]
     */
    Agent.prototype.getGameClassesAtMyLoc = function () {
        return this.trainGame.getSpriteGameClassesAt(this.tileX, this.tileY);
    };
    /*
     A fiddely job removing an Object like Agent. For JS objects to be removed we have all remove all references to them,
     and let housekeeping remove the object itself.
     The TileGame.map is where the references to the Agents are kept.
     thisLoc.splice(agentIndex, 1); splice returns a list of removed elements
     */
    Agent.prototype.removeAgent  = function () {

        // 1. remove Agent from the map
        var thisLoc = this.trainGame.map[this.tileY][this.tileX];
        var agentIndex = thisLoc.indexOf(this);
        if(agentIndex !== -1) {
            thisLoc.splice(agentIndex, 1);
        }

        // 2. Remove listeners from agent - because these contain a reference to the Sprite
        this.removeListeners();

        // 3. remove the DOM reference to the Agent. Agents inherit from Sprite and all DOM references
        // are contained in the Sprite's node property. The node property is a jQuery element so we can use jQuery's remove
        this.node.remove();

        // 4. remove all animations that the Agent's Sprite created
        // We need to do a recursive decent through the Sprite tree
        // and remove the Sprite's background animations, i.e. the Animations from the AnimationController
        //console.log("num animations before " + AppConfig.animationController.animations.length);
        this.removeChildrenRecursively();
        //console.log("num animations after " + AppConfig.animationController.animations.length );

    }; // eo removeAgentAt
    /**************************************************************
        A debug utility functions
     *************************************************************/
    Agent.prototype.printStack = function () {
        var stackStr = "request stack:";
        this.actionRequestStack.forEach(function (thisRequest) { stackStr += thisRequest.action + " " + thisRequest.parameters + " "; });
        console.log(stackStr);
    };
    /*
     */
    Agent.prototype.printObject = function (thisObject) {
        var key;
        for(key in thisObject) {
            if( thisObject.hasOwnProperty(key) ) {
                console.log("key:" + key + " value:" + thisObject[key]);
            }
        }
        console.log("---------------------------");
    };


    return Agent;
});
