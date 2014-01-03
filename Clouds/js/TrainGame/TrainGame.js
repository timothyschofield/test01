/*
    TrainGame
    Author: Tim Schofield
    Date: 20 Feb 2013

    TrainGame inherits from TileGame
*/
//noinspection JSLint
define([
    'jquery', 'TileGame', 'Layer', 'GrassTile', 'StreetTile', 'Skeleton',
    'Male', 'GenericTile', 'Button', 'TrainGameConfig','Mine', 'AppConfig', 'Loader', 'NavPalette'],
       function (
           $, TileGame, Layer, GrassTile, StreetTile, Skeleton,
           Male, GenericTile, Button, TrainGameConfig, Mine, AppConfig, Loader, NavPalette) {

function TrainGame(worldRoot) {

    this.loader = new Loader();
    this.loader.loadImages(AppConfig.IMG_PATH,
        [
            "male_n.png",
            "male_s.png",
            "male_w.png",
            "male_e.png",
            "male_idle.png",
            "skeleton_n.png",
            "skeleton_s.png",
            "skeleton_e.png",
            "skeleton_w.png",
            "skeleton_idle.png",
            "mine.png",
            "PortraitTestStrip.png",
            "LandscapeTestStrip.png",
            "ExplosionStrip.png"]);

    this.listOfMales = [];


    var navConfig = {
        id: 'navPalette'
    };
    this.navPalette = new NavPalette(navConfig);

    TileGame.apply(this, arguments); //  TrainGame inherits from TileGame

    // initialTileMap is used to describe the initial positions of the stationary Tiles.
    // This map is not used once the game is running.
    // Each location has a Tile.gameClass
    // GA#00 - class GA (grass), id 00, or class ST of street
    this.initialTiletMap =
    [
        ['GA#00', 'GA#00', 'GA#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00'],
        ['GA#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00'],
        ['GA#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00'],
        ['GA#00', 'GA#00', 'GA#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'GA#00'],
        ['GA#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00'],
        ['GA#00', 'GA#00', 'GA#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'GA#00', 'GA#00'],
        ['GA#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'ST#00', 'GA#00', 'GA#00'],
        ['GA#00', 'GA#00', 'GA#00', 'ST#00', 'ST#00', 'ST#00', 'ST#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00'],
        ['GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00'],
        ['GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00', 'GA#00']
      ];

        // initialAgentMap is used to describe the initial positions of the Agents which move over the Tiles.
        // This map is not used once the game is running.
        // Locations with Agents have an Agent.gameClass
        // RO#00 - class Roof (grass), id 00, HO = house
        // The id part can be used if need be to differentiate between different types of a class e.g. the buttons
        // BU Class but id 0N for north, 0E for east etc. - their function being different


    this.initialAgentMap =
        [
            ['00#00', '00#00', '00#00', 'MA#00', '00#00', '00#00', '00#00', 'RO#01', 'RO#02', 'RO#03', 'SK#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00'],
            ['00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', 'RO#00', 'RO#00', 'RO#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00'],
            ['00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', 'HO#00', 'HO#00', 'HO#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00'],
            ['00#00', '00#00', '00#00', '00#00', '00#00', 'RO#00', 'MA#00', 'RO#00', 'RO#00', 'RO#00', 'SK#00', '00#00', '00#00', '00#00', 'MA#00', '00#00', '00#00', '00#00', '00#00', '00#00'],
            ['00#00', '00#00', '00#00', '00#00', '00#00', 'HO#00', '00#00', 'HO#00', 'HO#00', 'HO#00', 'HO#01', 'HO#02', 'HO#03', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00'],
            ['00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', 'RO#03', 'RO#03', 'RO#02', 'RO#01', 'RO#03', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00'],
            ['00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', 'RO#03', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00'],
            ['00#00', '00#00', '00#00', 'SK#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00'],
            ['00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00'],
            ['00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00', '00#00']
        ];



        // map is a 2D list of lists. The things on the inner lists (at each location) are pointers to Agent instances like instances of Males or instances of Grass.
        // This map maintains the state of the game and is used during the running of the game. Each location in the game is represented by a list.
        // The first item in each list - this.map[y][x][0] - is a Tile - described by the initialTileMap. These never move but can respond to their environment.
        // A start of day any other item at a location in the map will be Agents created according to the initialAgentMap.
        // As the game progresses, Agents will move around the map. Any number of Agents can occupy a single map location - hence the list for each location.
        this.map =
         [
            [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
        ];


        // the first layer is the farthest back
        this.backgroundLayer = this.addLayer(new Layer("background"));
        this.houseLayer = this.addLayer(new Layer("houses"));
        this.mineLayer = this.addLayer(new Layer("mine"));
        this.skeletonLayer = this.addLayer(new Layer("skeletons"));
        this.maleLayer = this.addLayer(new Layer("males"));
        this.roofLayer = this.addLayer(new Layer("roofs"));
        this.buttonLayer = this.addLayer(new Layer("buttons"));

        this.init();

    } // eo constructor TrainGame

    /*
    TrainGame inherits from TileGame
    */
    TrainGame.prototype = Object.create(TileGame.prototype);
    TrainGame.prototype.constructor = TrainGame;
    /*
    */
    TrainGame.prototype.init = function () {



        for (var n = 0; n < TrainGameConfig.height; n++) {
            for (var m = 0; m < TrainGameConfig.width; m++) {

                var thisItemList = this.initialTiletMap[n][m].split("#");
                var thisGameClass = thisItemList[0];
                var thisGameID = thisItemList[1];
                var thisItemInit = {
                    trainGame: this,
                    type: "Tile",
                    tileX: m,
                    tileY: n,
                    width: TrainGameConfig.tileWidth,
                    height: TrainGameConfig.tileHeight,
                    gameClass: thisGameClass,
                    gameID: thisGameID + "_" + m + "_" + n
                };

                var thisNewAgent = null;

                switch (thisGameClass) {
                    case 'GA': thisNewAgent = new GrassTile(thisItemInit); break;
                    case 'ST': thisNewAgent = new StreetTile(thisItemInit); break;

                    case 'TR':
                        thisItemInit.src = "Track" + thisGameID + ".png";
                        console.log("this track = " + thisItemInit.src);
                        thisNewAgent = new GenericTile(thisItemInit);
                        break;

                    default: console.log("unknown Tile gameClass " + thisGameClass);

                } // eo switch

                if (thisNewAgent) {
                    this.map[n][m].push(thisNewAgent);
                    this.backgroundLayer.addSpriteToLayer(thisNewAgent);
                }
            }
        }


        for (var n = 0; n < TrainGameConfig.height; n++) {
            for (var m = 0; m < TrainGameConfig.width; m++) {

                var thisItemList = this.initialAgentMap[n][m].split("#");
                var thisGameClass = thisItemList[0];
                var thisGameID = thisItemList[1];

                var thisItemInit = {
                    trainGame: this,
                    type: "Tile",
                    tileX: m,
                    tileY: n,
                    width: TrainGameConfig.tileWidth,
                    height: TrainGameConfig.tileHeight,
                    gameClass: thisGameClass,
                    gameID: thisGameID
                };

                var thisNewAgent = null;
                switch (thisGameClass) {
                    case '00': break;
                    case 'SK':
                        thisItemInit.gameID += "_" + m + "_" + n;
                        thisNewAgent = new Skeleton(thisItemInit);
                        this.skeletonLayer.addSpriteToLayer(thisNewAgent);
                        break;
                    case 'BU': thisNewAgent = new Button(thisItemInit);
                        this.buttonLayer.addSpriteToLayer(thisNewAgent);
                        break;
                    case 'MA':
                        thisItemInit.gameID += "_" + m + "_" + n;
                        thisNewAgent = new Male(thisItemInit);
                        this.listOfMales.push(thisNewAgent); // <<<<<<<<<<<<
                        this.maleLayer.addSpriteToLayer(thisNewAgent);
                        break;

                    case 'HO':
                        switch (thisGameID) {
                            case '00': thisItemInit.src = "domeHouse.png"; break;
                            case '01': thisItemInit.src = "bigHouse1.png"; break;       // same graphic as HO but added to the RO layer which Agents walk behind
                            case '02': thisItemInit.src = "bigHouse2.png"; break;
                            case '03': thisItemInit.src = "bigHouse3.png"; break;
                        }

                        thisItemInit.bgYPos = 24;   // The half drop for the houses
                        thisNewAgent = new GenericTile(thisItemInit);
                        this.houseLayer.addSpriteToLayer(thisNewAgent);
                        break;

                    case 'RO':
                        switch (thisGameID) {
                            case '00': thisItemInit.src = "domeRoof.png"; break;
                            case '01': thisItemInit.src = "bigHouse1.png"; break;       // same graphic as HO but added to the RO layer which Agents walk behind
                            case '02': thisItemInit.src = "bigHouse2.png"; break;
                            case '03': thisItemInit.src = "bigHouse3.png"; break;
                        }


                        thisItemInit.bgYPos = 24;    // The half drop for the roofs
                        thisNewAgent = new GenericTile(thisItemInit);
                        this.roofLayer.addSpriteToLayer(thisNewAgent);
                        break;


                    default: console.log("unknown Agent gameClass " + thisGameClass);
                } // eo switch

                if (thisNewAgent) {
                    this.map[n][m].push(thisNewAgent);
                    //TileGame.agentController.addAgent(thisNewAgent);   // not used
                }
            }
        }
    }; // eo init
    /*
        Used for adding at run time
    */
    TrainGame.prototype.addAgent = function (itemInit) {

        switch (itemInit.gameClass) {

            // a mine
            case 'MI':
                var thisNewAgent = new Mine(itemInit);
                this.mineLayer.addSpriteToLayer(thisNewAgent);
                break;

            default: console.log("unknown Agent gameClass " + itemInit.gameClass);

        }

        if (thisNewAgent) {
            this.map[itemInit.tileY][itemInit.tileX].push(thisNewAgent);
        }
    }; // eo addAgent

    return TrainGame;

});