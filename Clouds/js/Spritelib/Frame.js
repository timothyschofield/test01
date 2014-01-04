
/*
    Frame
    Author: Tim Schofield
    Date: Nov 2013

    Frame displays a rectangular part of a src (background) image.
    The origin is the TLHC of the image. Think of the image moving "behind" a stationary window created by the div 'node'.
    -ve yOffset moves the image up relative to the window
    -ve xOffset moves the image left relative to the window

     The first frame in a FilmStrip is frame 0.
     For a portrait strip frame 0 is at the top of the strip and frame n is at the bottom.
     For a landscape strip, frame 0 is at the left and frame n is to the right.

    So offsets here tend to be -ve or zero.

    config
    (for Frame) src, width, height, xOffset, yOffset, frameclass, frameid

    Frame is part of FilmStrip

 */
//noinspection JSLint
define(['jquery','AppConfig'], function ($, AppConfig) {

    function Frame(config) {

        var defaults = {
            src: AppConfig.IMG_PATH + "src_not_found.png",
            width: 48,
            height: 48,
            xOffset: 0,
            yOffset: 0,
            class: "frameclass",
            id: "frameid"
        };

        config = $.extend(defaults, config);

        this.node = $('<div></div>').attr('class', config.class).attr('id', config.id)
            .css({
                'background-repeat': 'no-repeat', 'position': 'absolute', 'width': config.width, 'height': config.height, 'background-size': 'contain',
                'background-position': config.xOffset + 'px ' + config.yOffset + 'px',
                'background': "url('" + config.src + "')"
            });


    }   // eo constructor
    /*
        xOffset, yOffset pixel offsets
     */
    Frame.prototype.setOffsets = function (xOffset, yOffset) {
        //console.log("xOffset = " + xOffset/48);
        this.node.css({ 'background-position': xOffset + 'px ' + yOffset + 'px' });
    };
    Frame.prototype.show = function () { this.node.show(); };
    Frame.prototype.hide = function () { this.node.hide(); };
    Frame.prototype.getNode = function () { return this.node; };

    return Frame;
});
