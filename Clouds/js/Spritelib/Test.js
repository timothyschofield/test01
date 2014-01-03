/**
 * Created by Timothy on 11/12/13.
 */
define(['jquery', 'EventDispatcher'], function ($, EventDispatcher) {

    function Test(config) {

        var defaults = {
        };

        config = $.extend(defaults, config);

        this.spriteid = config.spriteid;
        this.node = $('<div></div>')
            .attr('id', this.spriteid);



    }

    Test.prototype.CSSAnimationStart = function (animName) {
        console.log("CSSAnimationStart " + animName)

        this.node
            .css("-moz-animation-name", animName)
            .css("-webkit-animation-name", animName)
            .css("-o-animation-name", animName);
    };
    Test.prototype.CSSAnimationPause = function () {

        console.log("CSSAnimationPause " + this.spriteid)
        this.node
            .css("-moz-animation-name", "paused")
            .css("-webkit-animation-name", "paused")
            .css("-o-animation-name", "paused")
    };

    Test.prototype.CSSAnimationContinue = function () {



        this.node
            .css("-moz-animation-name", "running")
            .css("-webkit-animation-name", "running")
            .css("-o-animation-name", "running")
    };


    return Test;
});


