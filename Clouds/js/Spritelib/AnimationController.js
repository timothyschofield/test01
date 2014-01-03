/*
    AnimationController
    Author: Tim Schofield
    Date: Feb 2013
*/

//noinspection JSLint
define([], function () {

    function AnimationController() {
        this.animations = [];
    }
    /*
        Puts an Animation on the animation list - so it will get updated but we will not see the animation because it isn't part of the DOM. 
        That happens when it is added to a Sprite
    */
    AnimationController.prototype.addAnimation = function (animation) {
        this.animations.push(animation);
    };
    /*
    */
    AnimationController.prototype.update = function () {
        this.animations.forEach(function(thisAnimation) {
            thisAnimation.update();
        } );
    };
    /*
     */
    AnimationController.prototype.removeAnimation = function (thisAnimation) {
        var thisIndex = this.animations.indexOf(thisAnimation);
        if(thisIndex !== -1) {
            this.animations.splice(thisIndex, 1);
        }
    };

    return AnimationController;
});

