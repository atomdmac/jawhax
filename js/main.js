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
        terrain = map.layers[0],
        player  = map.layers[1],
        tileMap ,
        viewport;
    
    // Constants
    var CELL_SIZE    = 32;

    this.setup = function (options) {
        
        console.log("Switching to Play state: ", arguments);
        
        // Map.
        var mapH = map.height -1,
            mapW = map.width - 1,
            data = terrain.data,
            len  = data.length;
            
        
        // Setup map sprites.
        blocks = new jaws.SpriteList();
        
        // 
        var x=0 , y=0, i=0;
        for (i; i<len; i++) {
            if (x > mapW) {
                x=0;
                y++;
            }
            
            var curTile = map.tilesets[data[i]-1];
            
            // Don't draw passable tiles.
            if (curTile.name === "passable") {
                x++;
                continue;
            };
            
            console.log("tile index: ", data[i]);
            console.log(x, ", ", y);
            console.log("CurTile: ", curTile);
            
            blocks.push(
                new jaws.Sprite({
                    "image": "img/impassable.png",
                    "x"    : x * CELL_SIZE,
                    "y"    : y * CELL_SIZE
                })
            );
            
            // Advance X coordinate.
            x++;
        }
        
        viewport = new jaws.Viewport({
            "width": 10 * 32,
            "height": 10 * 32,
            "max_x": map.width  * CELL_SIZE,
            "max_y": map.height * CELL_SIZE
        });
        window.top.viewport = viewport;
        
        tileMap = new jaws.TileMap({
            "cell_size": [CELL_SIZE, CELL_SIZE],
            "size"     : [map.width, map.height]
        });
        tileMap.push(blocks);
        
        // Set-up player.
        player = new jaws.Sprite({
            "image": "img/player.png",
            "x"    : 3 * CELL_SIZE,
            "y"    : 3 * CELL_SIZE
        });
        window.top.player = player;
        
        player.validMove = function (x, y) {
            var r = player.rect();
            var nr = new jaws.Rect(r.x, r.y, r.width, r.height);
            nr.move(x, y);
            nr.resize(-1, -1);
            
            var collisions = tileMap.atRect(nr);
            if (collisions.length === 0) {
                return true;
            }
            return false;
        }
        player.up = function () {
            if (player.validMove(0, -CELL_SIZE)) {
                player.moveTo(player.x, player.y - CELL_SIZE);
            }
        }
        player.down = function () {
            if (player.validMove(0, CELL_SIZE)) {
                player.moveTo(player.x, player.y + CELL_SIZE);
               console.log("move to ", player.x, ", ", (player.y + CELL_SIZE));
            }
        }
        player.right = function () {
            if (player.validMove(CELL_SIZE, 0)) {
                player.moveTo(player.x + CELL_SIZE, player.y);
            }
        }
        player.left = function () {
            if (player.validMove(-CELL_SIZE, 0)) {
                player.moveTo(player.x - CELL_SIZE, player.y);
            }
        }
        
        // Controls
        jaws.on_keydown("up",    player.up);
        jaws.on_keydown("down",  player.down);
        jaws.on_keydown("right", player.right);
        jaws.on_keydown("left",  player.left);
        
        jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
        
    },
    
    this.update = function () {
        viewport.centerAround(player);
    },
    
    this.draw = function () {
        jaws.clear();
        // viewport.centerAround(player);
        viewport.drawTileMap(tileMap);
        player.draw();
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
                     "img/passable.png",
                     "img/impassable.png",
                     "img/player.png",
                     "map/test.json"
                     ]);
    
   // Load all resources and start game.
    jaws.start(playState, {
        "width": 10 * 32,
        "height": 10 * 32
    });
    
}