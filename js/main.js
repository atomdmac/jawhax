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

var playState = function () {
    var player,
        blocks,
        MAP_WIDTH = map[0].length,
        MAP_HEIGHT = map.length,
        tileMap,
        viewport;
    
    // Constants
    var CELL_SIZE    = 32;
        
    this.setup = function () {
        // Setup map sprites.
        blocks = new jaws.SpriteList();
        
        for (var mapY=0; mapY<MAP_HEIGHT; mapY++) {
            for (var mapX=0; mapX<MAP_WIDTH; mapX++) {
                // Don't draw passable tiles.
                if (map[mapY][mapX]) continue;
                
                blocks.push(
                    new jaws.Sprite({
                        "image": "img/impassable.png",
                        "x"    : mapX * CELL_SIZE,
                        "y"    : mapY * CELL_SIZE
                    })
                );
            }
        }
        
        viewport = new jaws.Viewport({
            "max_x": MAP_WIDTH  * CELL_SIZE,
            "max_y": MAP_HEIGHT * CELL_SIZE
        });
        
        tileMap = new jaws.TileMap({
            "cell_size": [CELL_SIZE, CELL_SIZE],
            "size"     : [MAP_WIDTH, MAP_HEIGHT]
        });
        tileMap.push(blocks);
        
        // Set-up player.
        player = new jaws.Sprite({
            "image": "img/player.png",
            "x"    : 3 * CELL_SIZE,
            "y"    : 3 * CELL_SIZE
        });
        
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
        
    },
    
    this.draw = function () {
        jaws.clear();
        viewport.drawTileMap(tileMap);
        player.draw();
    }
}

// Start the game!
jaws.onload = function () {
    jaws.assets.add(["img/passable.png", "img/impassable.png", "img/player.png"]);
    jaws.start(playState, {
        "width": 10 * 32,
        "height": 10 * 32
    });
}