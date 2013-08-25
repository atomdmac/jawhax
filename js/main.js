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
    var player  ,
        blocks  ,
        map     = jaws.assets.get("map/test.json"),
        viewport;

    this.setup = function (options) {
        
        console.log("Switching to Play state: ", arguments);
        
        /*viewport = new jaws.Viewport({
            "max_x": map.width  * cellSize,
            "max_y": map.height * cellSize
        });
        window.top.viewport = viewport;
        
        // Set-up player.
        // TODO: Make sure play position is valid (ie. whole cell value, passable, etc).
        player = new Player({
            image    : "img/player.png",
            // TODO: Load player x/y coords from map.
            x        : 64,
            y        : 64,
            cellSize : {
                x: cellSize,
                y: cellSize
            },
            collisionMap: tileMap
        });
        
        jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
        */
        
        var mapData = new TiledMap(map);
        
        console.log("mapData = ", mapData);
        
        // viewport.drawTileMap(tileMap);
        
    },
    
    this.update = function () {
       /*
        *viewport.centerAround(player);
        
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
        */
    },
    
    this.draw = function () {
        jaws.clear();
        // viewport.drawTileMap(tileMap);
        // viewport.draw(player);
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
    jaws.assets.add([
                     /*"img/passable.png",
                     "img/impassable.png",
                     "img/player.png",*/
                     "map/test.json"
                     ]);
    
   // Load all resources and start game.
    jaws.start(playState, {
        "width": 30 * 32,
        "height": 10 * 32
    });
}