/*
    TrainGame
    Author: Tim Schofield
    Date: 01 March 2013

    Just to do with displaying in layers

*/
//noinspection JSLint
define(['jquery'], function ($) {

    function Layer(id, config) {

        this.id = id;

        this.node = $('<div></div>')
                .attr('class', "layer")
                .attr('id', this.id)
                .css({
                'position': 'absolute'
                });

        if(config) {
            this.node.css(config);
        }
    }
    /*
    */
    Layer.prototype.addSpriteToLayer = function (newSprite) {
        this.node.append(newSprite.getNode());
    };

    return Layer;
});






















