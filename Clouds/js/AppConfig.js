/*
*/
//noinspection JSLint
define(['AnimationController', 'PhysicsEngine'], function (AnimationController, PhysicsEngine) {

    AppConfig.IMG_PATH = "img/animations/";

    // all animations are clocked by AnimationController at this rate - which is the maximum
    // They may however skip refreshes (not update their frame) and play at a multiple of this rate
    // i.e. a frame every 60ms, a frame every 90ms, by ignoring updates from the AnimationController
    AppConfig.WORLDREFRESHRATE = 30; // milliseconds
    AppConfig.animationController = new AnimationController();
    AppConfig.physicsEngine = new PhysicsEngine();

    function AppConfig () {
    }

    return AppConfig;

});
