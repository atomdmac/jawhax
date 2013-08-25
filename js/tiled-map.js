var TiledMap = function (json) {
    
    var _json = json;
    
    this.getMapSize = function () {
        return {
            width : _json.width - 1,
            height: _json.height - 1
        }
    }
    
    this.getCellSize = function () {
        return {
            width : _json.tilewidth,
            height: _json.tileheight
        }
    }
    
    this.getLayer = function (name) {
        var len = _json.layers.length,
            i   = 0;
        for (i; i<len; i++) {
            if (_json.layers[i].name === name) {
                return _json.layers[i];
            }
        }
        throw("Layer '" + layerName + "' not found.");
    }
    
    this.getTileSet = function (tilegid) {
        var tileSets = _json.tilesets,
            len      = tileSets.length,
            i        = 0,
            // Return FALSE if tile set can't be found.
            returnTileSet = false;
        
        // Since we sorted the tile sets in order of their "firstgid" properties
        // we know that we can stop as soon as we find a "gid" that is larger
        // than the given one.
        for (i; i<len; i++) {
            if (tileSets[i].firstgid < tilegid) {
                returnTileSet = tileSets[i];
            } else {
                break;
            }
        }
        return returnTileSet;
    }
    
    this.getCellProperty = function (x, y, layerName, propertyName) {
        var layer = this.getLayer(layerName);
        var tilegid = layer.data[(x * y) + x],
            tileSet      = this.getTileSet(tilegid),
            tileProps    = tileSet.tileproperties[tilegid - tileSet.firstgid];
        return tileProps[propertyName];
    }
    
    function _parseMap () {
        var layers   = _json.layers,
            len      = layers.length,
            i        = 0,
            curLayer = null;
        
        // Sort tilesets so they're in order of "firstgid".
        _json.tilesets.sort(function (a, b) {
            if (a>b) {
                return -1;
            }
            if (b>a) {
                return 1;
            }
            return 0;
        });
            
        // Load map assets.
        _loadAssets(_json.tilesets);
        
        // Parse map layers.
        for (i; i<len; i++) {
            curLayer = layers[i];
            // TODO: Parse Object layers, too!
            if (curLayer.type === "tilelayer") {
                // _parseTileLayer(curLayer);
            }
        }
    }
    
    function _loadAssets(tileSets) {
        var curTile = null,
            len     = tileSets.length,
            i       = 0,
            imgUrl;
        for (i; i<len; i++) {
            imgUrl = tileSets[i].image;
            imgUrl = imgUrl.substring(3);
            console.log(imgUrl);
            jaws.assets.add(imgUrl);
        }
        jaws.assets.loadAll({
            onload: function () {
                console.log("All map assets loaded!");
            },
            onerror: function () {
                console.log("Error loading map assets.", arguments);
            }
        })
    }
    
    function _parseTileLayer (layer) {
        var data = layer.data,
            len  = data.length,
            sprites  = new jaws.SpriteList(),
            cellSize = this.getCellSize(),
            mapSize  = this.getMapSize(),
            tileMap  = new jaws.TileMap({
                "cell_size": [cellSize.width, cellSize.height],
                "size"     : [mapSize.width,  mapSize.height]
            });
        
        var x=0, y=0, i=0;
        for (i; i<len; i++) {
            if (x > mapSize.width) {
                x=0;
                y++;
            }
            
            var curTileSet = this.getTileSet([data[i]-1]);
            
            // Don't draw passable tiles.
            if (curTileSet.name === "passable") {
                x++;
                continue;
            };
            
            // TODO: Load map assets dynamically.
            /*
            sprites.push(
                new jaws.Sprite({
                    "image": this.getCellProperty(x, y, layer.name, "image"),
                    "x"    : x * mapSize.width,
                    "y"    : y * mapSize.height
                })
            );
            */
            // Advance X coordinate.
            x++;
        }
        
        // Add sprites to jaws.TileMap for this layer.
        tileMap.push(sprites);
        
        // Add reference to jaws.TileMap instance to layer object.
        layer.tileMap = tileMap;
    }
    
    // Initialize our map data!
    _parseMap(json);
};