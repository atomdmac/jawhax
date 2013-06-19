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
        cellSize = map.tilewidth, // Assume square cells.
        tileMap ,
        viewport;

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
            
            blocks.push(
                new jaws.Sprite({
                    "image": "img/impassable.png",
                    "x"    : x * cellSize,
                    "y"    : y * cellSize
                })
            );
            
            // Advance X coordinate.
            x++;
        }
        
        viewport = new jaws.Viewport({
            "max_x": map.width  * cellSize,
            "max_y": map.height * cellSize
        });
        window.top.viewport = viewport;
        
        tileMap = new jaws.TileMap({
            "cell_size": [cellSize, cellSize],
            "size"     : [map.width, map.height]
        });
        tileMap.push(blocks);
        
        // Set-up player.
        player = new jaws.Sprite({
            "image": "img/player.png",
            "x"    : 10 * cellSize,
            "y"    : 10 * cellSize
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
            if (player.validMove(0, -cellSize)) {
                player.moveTo(player.x, player.y - cellSize);
            }
        }
        player.down = function () {
            if (player.validMove(0, cellSize)) {
                player.moveTo(player.x, player.y + cellSize);
            }
        }
        player.upright = function () {
            if (player.validMove(cellSize, -cellSize)) {
                player.move(cellSize, -cellSize);
            }
        }
        player.upleft = function () {
            if (player.validMove(-cellSize, -cellSize)) {
                player.move(-cellSize, -cellSize);
            }
        }
        player.downright = function () {
            if (player.validMove(cellSize, cellSize)) {
                player.move(cellSize, cellSize);
            }
        }
        player.downleft = function () {
            if (player.validMove(-cellSize, cellSize)) {
                player.move(-cellSize, cellSize);
            }
        }
        player.right = function () {
            if (player.validMove(cellSize, 0)) {
                player.moveTo(player.x + cellSize, player.y);
            }
        }
        player.left = function () {
            if (player.validMove(-cellSize, 0)) {
                player.moveTo(player.x - cellSize, player.y);
            }
        }
        
        // Controls
        jaws.on_keydown("k",    player.up);
        jaws.on_keydown("u",    player.upright);
        jaws.on_keydown("y",    player.upleft);
        jaws.on_keydown("j",    player.down);
        jaws.on_keydown("n",    player.downright);
        jaws.on_keydown("b",    player.downleft);
        jaws.on_keydown("l",    player.right);
        jaws.on_keydown("h",    player.left);
        
        jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
        
        viewport.drawTileMap(tileMap);
        
    },
    
    this.update = function () {
        viewport.centerAround(player);
    },
    
    this.draw = function () {
        jaws.clear();
        viewport.drawTileMap(tileMap);
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
    jaws.assets.add([
                     "img/passable.png",
                     "img/impassable.png",
                     "img/player.png",
                     "map/test.json"
                     ]);
    
   // Load all resources and start game.
    jaws.start(playState, {
        "width": 30 * 32,
        "height": 10 * 32
    });
    
}