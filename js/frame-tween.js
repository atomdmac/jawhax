var FrameTween = function () {
    
    // Is an an animation currently playing?
    this._isPlaying = false;
    
    // Current element/position/time
    this._current = null;
    
    // Do another iteration of the animation.
    this._tick = function () {
        this._current.frame++;
        
        this._current.curX = this._easeInOutQuad(this._current.frame,
                                                this._current.startX,
                                                this._current.deltaX,
                                                this._current.duration);
        this._current.curY = this._easeInOutQuad(this._current.frame,
                                                this._current.startY,
                                                this._current.deltaY,
                                                this._current.duration);
        
        this._current.element.moveTo(this._current.curX,
                                     this._current.curY);
        
        if(this._current.frame === this._current.duration) {
            this.stop();
            return false;
        } else {
            return true;
        }
    };
    
    this._easeInOutQuad = function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    
    this.isPlaying = function () {
        return _isPlaying;
    },
    
    this.start = function (element, endX, endY, duration) {
        // Animation already in progress
        if(this._isPlaying) return;
        
        this._isPlaying = true;
        
        // No animation is already in progress.
        // TODO: Don't tween if current and end coords are the same.
        if(this._current == null) {
            this._current = {
                "element"    : element,
                "startX"     : element.x,
                "startY"     : element.y,
                "deltaX"     : endX - element.x,
                "deltaY"     : endY - element.y,
                "curX"       : element.x,
                "curY"       : element.y,
                "duration"   : duration,
                "frame"      : 0
            }
        }
    },
    
    this.pause = function () {
        if(this._isPlaying === true && this._current != null) {
            this._isPlaying = false;
        }
    },
    
    this.stop = function () {
        this._current = null;
        this._isPlaying = false;
    }
}