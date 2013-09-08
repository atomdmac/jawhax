var map =
[
[0,0,0,0,0,0,0,0,0,0],
[0,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,0,0,0,0],
[0,1,1,1,0,1,1,1,1,0],
[0,1,1,1,1,1,1,1,1,0],
[0,0,0,0,0,0,0,0,0,0]
];

/*
 * Load the map and get everything ready for the Play state.
 */
var loadingState = function () {
    
    var parseMap = function (json) {
        
    }
    
    this.setup = function () {
        console.log("Changing State: loadingState");
        // TODO: Parse the map.
    }
    
    this.update = function () {
        // TODO
    }
    
    this.draw = function () {
        // TODO
    }
}

/*
 * Defines the normal Play state.
 */
var playState = function () {
    var player,
        viewport,
        tiledMap,
        cellSize,
        mapSize,
        terrainLayer;

    this.setup = function (options) {
        
        console.log("Switching to Play state: ", arguments);
        
        tiledMap = options.tiledMap;
        
        cellSize = tiledMap.getCellSize();
        mapSize  = tiledMap.getMapSize();
        terrainLayer = tiledMap.getLayer("terrain");
        
        // Set-up player.
        // TODO: Make sure play position is valid (ie. whole cell value, passable, etc).
        player = new Player({
            image    : tiledMap.assets.get("img/player.png"),
            // TODO: Load player x/y coords from map.
            // TODO: Load player h/w from map.
            x        : 64,
            y        : 64,
            width    : 32,
            height   : 32,
            cellSize : {
                x: 32,
                y: 32
            },
            collisionMap: terrainLayer.tileMap
        });
        
        jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
        
        viewport = new jaws.Viewport({
            "max_x": mapSize.width  * cellSize.width,
            "max_y": mapSize.height * cellSize.height
        });
        window.top.viewport = viewport;
        
        
        
        console.log(terrainLayer.tileMap);
        
    },
    
    this.update = function () {
        viewport.centerAround(player);
        
        if (jaws.pressed("up right", true)) {
            player.upright();
        } else if (jaws.pressed("up left", true)) {
            player.upleft();
        } else if (jaws.pressed("down right", true)) {
            player.downright();
        } else if (jaws.pressed("down left", true)) {
            player.downleft();
        } else if (jaws.pressed("up")) {
            player.up();
        } else if (jaws.pressed("down")) {
            player.down();
        } else if (jaws.pressed("left")) {
            player.left();
        } else if (jaws.pressed("right" )) {
            player.right();
        }
        
        player.tick();
    },
    
    this.draw = function () {
        
        jaws.clear();
        viewport.drawTileMap(terrainLayer.tileMap);
        viewport.draw(player);
    }
}

/*
 * Inventory view
 */
var inventoryState = function () {
    this.setup = function () {
        // TODO
    }
    
    this.update = function() {
        // TODO
    }
    
    this.draw = function () {
        // TODO
    }
}

// Start the game!
jaws.onload = function () {
    jaws.init({width: 30 * 32, height: 10 *32});
    var mapLoader = new jaws.Assets();
    mapLoader.add([
                     "map/test.json"
                     ]);
    
    /*
    mapLoader.loadAll({
        onfinish: function () {
            console.log("map loaded!", jaws.assets.get("map/test.json"));
            var tiledMap = new TiledMap(jaws.assets.get("map/test.json"),
                            {
                                onfinish: function () {
                                    console.log("Map Assets loaded!")
                                    var loop = new jaws.GameLoop(new playState(), {
                                        "width": 30 * 32,
                                        "height": 10 * 32
                                    },
                                    {
                                        tiledMap: tiledMap
                                    });
                                    loop.start();
                                }
                            });
        }
    });
    */
    mapLoader.loadAll({
        onfinish: function () {
            console.log("Map JSON loaded.");
            
            var tiledMap = new TiledMap(mapLoader.get("map/test.json"),
                                {
                                    onfinish: function () {
                                        console.log("Map assets loaded.");
                                        
                                        jaws.start(playState, {}, {tiledMap: tiledMap});
                                    }
                                });
            
        }
    })
}