/*
    Sprite
    Author: Tim Schofield
    Date: Feb 2013

    A Sprite is a container for an Animation. The animation may be undefined.
    A Sprite contains a list of other Sprites - the list may be empty.
    Leaf nodes in the Sprite hierarchy will typically contain Animations.
    Animations animate - show a sequence of (possibly one) bitmaps through time. They do not transform on  the screen.
    Sprite are transformed - moved, rotated, scaled - relative to their parent Sprite's coordinate system.
    The z-index of Sprites depend on the order in which they are added to other Sprites.
    An Animation cannot be added into the world directly, it must be inside a Sprite.

    Animations are added to Sprites and Sprites are added into other Sprites to create a Sprite tree.
    The root node is the World's "rootSprite". Swapping Sprite depth at run time is not possible, although
    work arounds can be crafted using invisible place holder Sprites and turning Sprite visibility on and off.

    The Sprite's spriteid should be unique within its Sprite container
    Children are referred to by spriteid or spriteclass
    e.g.    var x = thisSprite.childID['mychild3']; 
            var y = thisSprite.childClass['thisClass'];
    The background Animation of a Sprite is called 'background'

    config
        (for Sprite)    x, y, spriteclass, spriteid, backgroundAnimation (an object), scalex, scaley, rotation
            (for Animation) millisecondsPF, animationType, animationDirection
                (for FilmStrip) bitmapType, startFrame, numFrames, lastFrameCallback, firstFrameCallback
                    (for Frame) src, width, height, xOffset, yOffset, frameclass, frameid

    Animation is part of Sprite
    Sprite inherits from EventDispatcher
*/
//noinspection JSLint
define(['jquery', 'EventDispatcher'], function ($, EventDispatcher) {

    function Sprite(config) {

        var defaults = {
            spriteid: "spriteid",
            spriteclass: "spriteclass",
            backgroundAnimationObject: undefined,     // an Animation Object
            bgXPos: 0,
            bgYPos: 0
        };

        config = $.extend(defaults, config);

        //this.left = 0;
        //this.top = 0;
        //this.width = 0;
        //this.height = 0;

        this.spriteid = config.spriteid;        // for selection with childID - the id of the containing node
        this.spriteclass = config.spriteclass;  // for selection with childClass - the class of the containing node
        this.bgXPos = config.bgXPos;
        this.bgYPos = config.bgYPos;

        ///////// The Sprite's root container node //////
        this.node = $('<div></div>')
                    .attr('class', this.spriteclass)
                    .attr('id', this.spriteid)
                    .css('position', 'absolute');

        this.childSprites = []; // useful when deleteing children
        this.childID = {};
        this.childClass = {};

        this.background = undefined;
        if (config.backgroundAnimationObject) {
            this.addBackgroundAnimation(config.backgroundAnimationObject);
        }

        // Sprite inherits from EventDispatcher
        // Sprite can dispatch messages and register listeners to messages
        EventDispatcher.apply(this, []);

    } // eo constructor
    Sprite.prototype = Object.create(EventDispatcher.prototype);
    Sprite.prototype.constructor = Sprite;
    /*
        removes the background of the Sprite it's called on and all the
        backgrounds of its child Sprites, and all their chidren's backgrounds etc.
     */
    Sprite.prototype.removeChildrenRecursively = function () {
        var n, numChildren;

        this.removeBackgroundAnimation();

        numChildren = this.childSprites.length;
        for(n = 0; n < numChildren; n+=1) {
            this.childSprites[n].removeChildrenRecursively();
        }
        this.childSprites = [];
        this.childID = {};
        this.childClass = {};
    };
    /*
        Removes the Animation from the AnimationController and its node from  the DOM
     */
    Sprite.prototype.removeBackgroundAnimation = function () {
        if(this.background) {
            this.background.removeAnimation();
            this.background = undefined;
        }
    };
    /*
     */
    Sprite.prototype.startChild = function (spriteid, numTimes) {
        if (this.childID[spriteid]) {
            this.childID[spriteid].startBg(numTimes);
        }
    };
    /*
     */
    Sprite.prototype.showChild = function (spriteid) {
        if (this.childID[spriteid]) {
            this.childID[spriteid].show();  // must startChild() explicitly
        }
    };
    /*
     */
    Sprite.prototype.hideChild = function (spriteid) {
        if (this.childID[spriteid]) {
            this.childID[spriteid].hide();
        }
    };
    /*
        Shows the child with id spriteid and hides all others children.
        If there is no child of that id then nothing happens

        If it is currently showing spriteid then no action should be taken
        This only deals with the first ply, i.e. the immediate children of a sprite
    */
    Sprite.prototype.showChildOnly = function (spriteid) {
        var thisChild;
        if (this.childID[spriteid]) {

            //hide all
            for (thisChild in this.childID) {
                if( this.childID.hasOwnProperty(thisChild) ) {
                    this.childID[thisChild].hide();
                    this.childID[thisChild].stopBg();
                }
            }

            this.childID[spriteid].show();  // must startChild() explicitly
        }
    };
    /*
     */
    Sprite.prototype.hideChild = function (spriteid) {
        if (this.childID[spriteid]) {
                this.childID[spriteid].hide();
                this.childID[spriteid].stopBg();
            }
    };
    /*
        If you are going to have a Sprite background, i.e. the Sprite is not just an invisible container for other Sprites,
        then you should always add the background first. This guarantees it is behind Sprites you add subsequently.
        So either add it in the Sprite constructor or call addBackgroundAnimation before you start using addChildSprites.
    */
    Sprite.prototype.addBackgroundAnimation = function (thisAnimation) {

        if(this.background) {
            this.removeBackgroundAnimation();
        }
        this.background = thisAnimation;
        this.node.append(this.background.getNode().css({ 'left': this.bgXPos + 'px', 'top': this.bgYPos + 'px' }));
    };
    /*
        Adds a Sprite or Sprites to this Sprite as children
        addChildSprites(sprite1, sprite2,...,spriten)
        Past one or more of Sprite Objects
    */
    Sprite.prototype.addChildSprites = function () {
        var n;
        var thisChildSprite;
        var argLen = arguments.length;
        for (n = 0; n < argLen; n+=1) {
            thisChildSprite = arguments[n];

            this.childSprites.push(thisChildSprite);

            // Create a property of that spriteid. Just stomp on anything else that had that spriteid
            // stores the Sprite keyed by its spriteid
            this.childID[thisChildSprite.spriteid] = thisChildSprite;

            // if the class does not already exist then create a list to store Sprites of that class
            if (!this.childClass[thisChildSprite.spriteclass]) {
                this.childClass[thisChildSprite.spriteclass] = [];
            }

            // Add all Sprites of this spriteclass in a list keyed by spriteclass
            this.childClass[thisChildSprite.spriteclass].push(thisChildSprite);

            // Add child Sprite to this Sprite's container node
            this.node.append(thisChildSprite.node);
        }
    };
    /*
        This will be pixel position relative to the coordinate system of its parent Sprite
    */
    Sprite.prototype.moveTo = function (newX, newY) {

        this.left = newX;
        this.top = newY;
        this.node.css({left: this.left, top: this.top});
    };
    /*
     move pixel relative to the Sprite's current location
    */
    Sprite.prototype.moveRel = function (dx, dy) {
        this.left = this.left + dx;
        this.top = this.top + dy;
        this.node.css({left: this.left, top: this.top});
    };
    /*
        Augment Array to deal with the case of moving an entire class where all members of an Array have to be moved
        This will be an absolute position relative to the coordinate system of its parent Sprite
    */
    Array.prototype.moveTo = function (x, y) {
        for (var n = 0; n < this.length; n++) {
            this[n].moveTo(x, y);
        }
    };
    /*
    */
    Array.prototype.moveRel = function (x, y) {
        for (var n = 0; n < this.length; n++) {
            this[n].moveRel(x, y);
        }
    };
    /*
        argument such as: {x:100, y:20, scalex:2, scaley:0.5, rotate:180}
        transforms do not change left and right properties of the css - the dom knows nothing about transforms
        so Sprites maintain their own x and y location.
    */
    Sprite.prototype.transform = function () {

        var transforms = arguments[0];
        var transformString = "";

        for (var thisProperty in transforms) {
            switch (thisProperty) {
                case 'x': transformString += 'translateX(' + transforms[thisProperty] + 'px) '; break;
                case 'y': transformString += 'translateY(' + transforms[thisProperty] + 'px) '; break;
                case 'scalex': transformString += 'scaleX(' + transforms[thisProperty] + ') '; break;
                case 'scaley': transformString += 'scaleY(' + transforms[thisProperty] + ') '; break;
                case 'rotate': transformString += 'rotate(' + transforms[thisProperty] + 'deg) '; break;
                default: console.log('unknown transform ' + thisProperty);
            }
        }
        // console.log(transformString);

        if (transformString) {
            this.node.css("-ms-transform", transformString); 	    // ie9
            this.node.css("-webkit-transform", transformString);    // safari and chrome
            this.node.css("-moz-transform", transformString);       // firefox
            this.node.css("transform", transformString);            // W3C standard
        }
    };
    /*  
        addTransition changes the quality with which a transform - move, scale, rotate, skew -
        is executed over time. Once an addTransition is set it will be in force until removed and all subsequent property
        changes will be subject to that transition.

        property: 'all', 'width', 'height', 'background-color' etc.
        duration: in seconds  e.g. '1.0', '4', '0.25'
        transitionType: 'linear', 'ease-in-out', 'ease', 'ease-in', 'ease-out', 'cubic-bezier(n,n,n,n)'

        Not implemented in Sprite: -moz-transition-delay: 1s;	// delay before the transition starts

        callback:
        There is NO explicit TransitionStart event only a TransitionEnd - see css animations for this
        this.bind('webkitTransitionEnd otransitionend transitionend MSTransitionEnd', function () { console.log("end transition")});
    */
    Sprite.prototype.addTransition = function (property, duration, transitionType, endTransitionCallback) {

        var thisTransition = property + ' ' + duration + 's ' + transitionType;
        // console.log("thisTransition = " + thisTransition)

        // ms: ie9
        // webkit: safari and chrome
        // moz: firefox
        // o: opera
        // plain 'transition' for W3C standard
        this.node
            .css('-moz-transition', thisTransition)
            .css('-webkit-transition', thisTransition)
            .css('-ms-transition', thisTransition)
            .css('transition', thisTransition);

        // callback events: webkitTransitionEnd otransitionend transitionend MSTransitionEnd
        // Firefox and W3C standard both use the same 'animationend' so there is no explicit "moz prefix"
        // The second argument in bind is passed in as the "data" property of the eventData object.
        // The eventData object is passed as the argument to the handler function
        if (endTransitionCallback)
            this.node.bind('webkitTransitionEnd transitionend MSTransitionEnd', { thisContext: this }, endTransitionCallback);

    };
    /*
    */
    Array.prototype.addTransition = function (property, duration, transitionType, callback) {
        for (var n = 0; n < this.length; n++) {
            this[n].addTransition(property, duration, transitionType, callback);
        }
    };
    /*
        eventType: 'click', 'keydown', 'keypress', 'keyup', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseup'
        handler: a function to invoke e.g. function () { console.log("hi")};

        Note: bind is attatched to this.node - i.e. a div - not the Sprite
        The second argument in bind is passed in as the "data" property of the eventData object.
        The eventData object is passed as the argument to the handler function
    */
    Sprite.prototype.addSpriteEventListener = function (eventType, handler) {
        this.node.bind(eventType, { thisContext: this }, handler);
    };
    /*
    */
    Array.prototype.addSpriteEventListener = function (eventType, handler) {
        for (var n = 0; n < this.length; n++) {
            this[n].addSpriteEventListener(eventType, handler);
        }
    };
    /*
    */
    Sprite.prototype.getNode = function () { return this.node; };

    // hide or show the whole of the container, i.e. the background animation AND all children
    Sprite.prototype.show = function () { this.node.show(); };
    Sprite.prototype.hide = function () { this.node.hide(); };
    // just the background - not the children
    Sprite.prototype.hideBg = function () { if (this.background) this.background.hide(); };
    Sprite.prototype.showBg = function () { if (this.background) this.background.show(); };
    // need a deepStop - deepPlay probobly not use fully

    Sprite.prototype.stopBg = function () { if (this.background) this.background.stop(); };
    Sprite.prototype.startBg = function (numTimes) { if (this.background) this.background.start(numTimes); };
    /*
     */
    Sprite.prototype.setCSS = function (CSS) {
        this.node.css(CSS);
    };
    /*
     */
    Sprite.prototype.getCSS = function (property) {
        return this.node.css(property);
    };
    /*
     */
    Sprite.prototype.setBackgroundCSS = function (CSS) {
        this.background.getNode().css(CSS);
    };
    /*
     */
    Sprite.prototype.setChildCSS = function (thisID, CSS) {
        if( this.childID.hasOwnProperty(thisID) ) {
            this.childID[thisID].setBackgroundCSS(CSS);
        }
    };

    /******************
     Animation-related CSS properties and at-rules: animation, animation-delay, animation-direction,
     animation-duration, animation-fill-mode, animation-iteration-count, animation-name, animation-play-state,
     animation-timing-function, @keyframes
    ******************/
    /*
        animaties the container of the Sprite
        There must be a css class with the smae id as this Sprites spriteid
     */
    Sprite.prototype.CSSAnimationStart = function (keyframesName) {
        //console.log("CSSAnimationStart " + keyframesName)

        this.node
            .css("-moz-animation-name", keyframesName)
            .css("-webkit-animation-name", keyframesName)
            .css("-ms-animation-name", keyframesName)
    };
    /*
        Animates the background of the Sprite
     */
    Sprite.prototype.CSSAnimationStartBackground = function (keyframesName) {
        //console.log("CSSAnimationStart " + keyframesName)

        var xxx = this.background.getNode();
        xxx.css("-moz-animation-name", keyframesName)
            .css("-webkit-animation-name", keyframesName)
            .css("-ms-animation-name", keyframesName)
    };

    Sprite.prototype.CSSAnimationStartChild = function (thisID, keyframesName) {
        if( this.childID.hasOwnProperty(thisID) ) {
            this.childID[thisID].CSSAnimationStart(keyframesName);
        }
    };
    // dosnt seem to work on sprites
    Sprite.prototype.CSSAnimationPause = function () {
        this.node
            .css("-moz-animation-name", "paused")
            .css("-webkit-animation-name", "paused")
            .css("-ms-animation-name", "paused")
    };
// dosnt seem to work on sprites
    Sprite.prototype.CSSAnimationContinue = function () {
        this.node
            .css("-moz-animation-name", "running")
            .css("-webkit-animation-name", "running")
            .css("-ms-animation-name", "running")
    };



    return Sprite;
});









