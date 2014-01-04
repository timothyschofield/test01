/* 
    Author: Tim Schofield
    Date: 10 Feb 2013
*/

//noinspection JSLint
require.config({


  paths: {

    jquery: 'lib/jquery/jquery',
    jqueryui: 'lib/jquery/jquery-ui',
    underscore: 'lib/underscore',
    bootstrap: 'lib/dist/js',
    less: 'lib/less/less-min.js',



    Animation: 'Spritelib/Animation',
    AnimationController: 'Spritelib/AnimationController',
    EventDispatcher: 'Spritelib/EventDispatcher',
    FilmStrip: 'Spritelib/FilmStrip',
    Frame: 'Spritelib/Frame',
    Loader: 'Spritelib/Loader',
    Sprite: 'Spritelib/Sprite',

    Game: 'Game/Game',
    Agent: 'Game/Agent',
    Keys: 'Game/Keys',
    Layer: 'Game/Layer',
    PhysicsEngine: 'Game/PhysicsEngine',
    PhysicsObject: 'Game/PhysicsObject',

    TileGame: 'TileGame/TileGame',

    SpriteGame: 'SpriteGame/SpriteGame',

    CloudGame: 'CloudGame/CloudGame',
    Zombies: 'CloudGame/Zombies',
    UFO_A4: 'CloudGame/UFO_A4',
    UFO_A9: 'CloudGame/UFO_A9',
    Prop: 'CloudGame/Prop',

    Button: 'TrainGame/Button',
    GenericTile: 'TrainGame/GenericTile',
    GrassTile: 'TrainGame/GrassTile',
    Male: 'TrainGame/Male',
    Mine: 'TrainGame/Mine',
    Skeleton: 'TrainGame/Skeleton',
    StreetTile: 'TrainGame/StreetTile',
    TrainGameConfig: 'TrainGame/TrainGameConfig',
    TrainGame: 'TrainGame/TrainGame',
    AI: 'TrainGame/AI',
    NavPalette: 'TrainGame/NavPalette'

  }
});

require(['jquery', 'App'], function ($, App) {
    console.log("In main bootstrap");
    
    $(document).ready(function () {
       var app1 = new App("#main", "#testWorld", 1, 1, "#888888");
       app1.init();
    }); 
});

