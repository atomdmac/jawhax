var TiledMap = function (json, options) {
    
    var self  = this,
        _json = json,
        // TODO: Expose the assets object so we can do things like set up a player sprite.
        _assets = new jaws.Assets();
        
    this.__defineGetter__("assets", function () {
        return _assets;
    });
    
    this.getMapSize = function () {
        return {
            width : _json.width,
            height: _json.height
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
            if (tileSets[i].firstgid <= tilegid) {
                returnTileSet = tileSets[i];
            } else {
                break;
            }
        }
        return returnTileSet;
    }
    
    this.getCellProperty = function (x, y, layerName, propertyName) {
        var layer = this.getLayer(layerName);
        var tilegid = layer.data[(x * y) + x];
        var    tileSet      = this.getTileSet(tilegid);
        var    tileProps    = tileSet.tileproperties[tilegid - tileSet.firstgid];
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
                _parseTileLayer(curLayer);
            }
            else if (curLayer.type === "objectgroup") {
                _parseObjectLayer(curLayer);
            }
        }
        
        // Alert callback now that loading and parsing has finished.
        if (options && options.onfinish) {
            options.onfinish();
        }
    }
    
    function _loadAssets(tileSets) {
        var curTile = null,
            len     = tileSets.length,
            i       = 0,
            imgUrl;
        for (i; i<len; i++) {
            imgUrl = tileSets[i].image;
            // TODO: Figure out a better way to get a valid path to assets.
            imgUrl = imgUrl.substring(3);
            _assets.add(imgUrl);
        }
        _assets.loadAll({
            onfinish: _onAssetsFinish,
            onload: _onAssetsLoad,
            onerror: _onAssetsError
        })
    }
    
    function _parseTileLayer (layer) {
        var data = layer.data,
            len  = data.length,
            sprites  = new jaws.SpriteList(),
            cellSize = self.getCellSize(),
            mapSize  = self.getMapSize(),
            tileMap  = new jaws.TileMap({
                "cell_size": [cellSize.width, cellSize.height],
                "size"     : [mapSize.width,  mapSize.height]
            });
        
        var x=0, y=0, i=0;
        for (i; i<len; i++) {
            if (x > mapSize.width - 1) {
                x=0;
                y++;
            }
            
            var curTileSet = self.getTileSet([data[i]]);
            
            // Don't draw passable tiles.
            if (curTileSet.name === "passable") {
                x++;
                continue;
            };
            
            // TODO: Figure out a better way to get a valid path to assets.
            var imgSrc  = _assets.get(curTileSet.image.substr(3));
            
            // TODO: Load map assets dynamically.
            sprites.push(
                new jaws.Sprite({
                    "image": imgSrc,
                    "x"    : x * cellSize.width,
                    "y"    : y * cellSize.height
                })
            );
            // Advance X coordinate.
            x++;
        }
        
        console.log("Sprite Length: ", sprites.length);
        
        // Add sprites to jaws.TileMap for this layer.
        tileMap.push(sprites);
        
        // Add reference to jaws.TileMap instance to layer object.
        layer.tileMap = tileMap;
    }
    
    // TODO: Finish _parseObjectLayer
    function _parseObjectLayer(layer) {
        var objects = layer.objects,
            len  = objects.length,
            sprites  = new jaws.SpriteList(),
            cellSize = self.getCellSize(),
            mapSize  = self.getMapSize(),
            tileMap  = new jaws.TileMap({
                "cell_size": [cellSize.width, cellSize.height],
                "size"     : [mapSize.width,  mapSize.height]
            });
    }
    
    function _onAssetsLoad() {
        // TODO: _onAssetsLoad
        console.log("Map asset loaded: ", arguments);
    }
    
    function _onAssetsError() {
        // TODO: _onAssetsError
        console.log("Map asset error: ", arguments);
    }
    
    function _onAssetsFinish() {
        // TODO: _onAssetsFinish
        console.log("Map assets loaded: ", arguments);
        _parseMap(_json);
    }
    
    // Initialize our map data!
    _loadAssets(_json.tilesets);
   //  _parseMap(json);
};