var Player = function (playerData) {
    var player = new jaws.Sprite({
                        image: playerData.image,
                        x    : playerData.x,
                        y    : playerData.y
                    });
    
    // TODO: Get this from tilemap somehow...
    var cellsize = {
        x: playerData.cellX || 32,
        y: playerData.cellY || 32
    };
    
    var collisionMap = playerData.collisionMap;
    
    player._tweenObj = null;
    
    player._startMove = function (direction) {
        var delta;
        switch (direction) {
            case "N":
                delta = {
                    x: 0,
                    y: -1
                };
                break;
            case "S":
                delta = {
                    x: 0,
                    y: 1
                };
                break;
            case "NE":
                delta = {
                    x: 1,
                    y: -1
                };
                break;
            case "NW":
                delta = {
                    x: -1,
                    y: -1
                };
                break;
            case "SE":
                delta = {
                    x: 1,
                    y: 1
                };
                break;
            case "SW":
                delta = {
                    x: -1,
                    y: 1
                };
                break;
            case "W":
                delta = {
                    x: -1,
                    y: 0
                };
                break;
            case "E":
                delta = {
                    x: 1,
                    y: 0
                };
                break;
            default:
                return;
        }
        
        var newCoords = {
            x: player.x + (cellsize.x * delta.x),
            y: player.y + (cellsize.y * delta.y)
        };
        
        // If this isn't a valid move (due to a collision), abort.
        // TODO: Check diagonally adjacent cells, too, to make sure diagonal movements doesn't clip map cells.
        if (collisionMap.at(newCoords.x, newCoords.y).length !== 0) {
            return;
        }
        
        player._tweenObj = new FrameTween;
        player._tweenObj.start(this, newCoords.x,
                                     newCoords.y,
                                     30);
    }
    
    player.up = function () {
        player._startMove("N");
    }
    player.down = function () {
        player._startMove("S");
    }
    player.upright = function () {
        player._startMove("NE");
    }
    player.upleft = function () {
        player._startMove("NW");
    }
    player.downright = function () {
        player._startMove("SE");
    }
    player.downleft = function () {
        player._startMove("SW");
    }
    player.right = function () {
        player._startMove("E");
    }
    player.left = function () {
        player._startMove("W");
    }
    
    player.tick = function () {
        // Either play tween Obj or delete it so user can choose a new move.
        if (this._tweenObj && this._tweenObj._tick()) {
            return;
        } else {
            this._tweenObj = null;
        }
        
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
    }
    
    return player;
};