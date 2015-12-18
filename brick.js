(function(window) {

    /**
     * A very rudimentary DOM-based "renderer".
     */
    var BRICK = function(zIndex) {
        var _zIndex = zIndex || 999;

        /**
         * ELEMENT
         * 
         * Base element that defines... elementary properties.
         */
        function Element() {
            var _width, _height;

            this.domElement = document.createElement('div');
            this.domElement.style.overflow = 'hidden';
            this.domElement.style.margin = 0;
            this.domElement.style.padding = 0;

            Object.defineProperties(this, {
                width : {
                    get : function get_width() {
                        return _width;
                    },
                    set : function set_width(width) {
                        _width = width;
                        this.domElement.style.width = _width + 'px';
                        return _width;
                    }
                },
                height : {
                    get : function get_height() {
                        return _height;
                    },
                    set : function set_height(height) {
                        _height = height;
                        this.domElement.style.height = _height + 'px';
                        return _height;
                    }
                }
            });
        }

        /**
         * A shorthand for adding event listeners, just in case.
         * 
         * @param {string} event - Event type to listen for
         * @param {function} callback - Callback function executed by event firing
         */
        Element.prototype.on = function (event, callback) {
            this.domElement.addEventListener(event, callback, false);
        };

        /**
         * CONTEXT
         * 
         * Rendering context, or rather the layer that other elements are
         * appended to.
         */
        function Context() {
            Element.call(this);

            document.body.appendChild(this.domElement);

            this.domElement.setAttribute('id', 'dom-renderer');

            this.width = 0;
            this.height = 0;
        }

        Context.prototype = Object.create(Element.prototype);
        Context.prototype.constructor = Context;

        /**
         * ENTITY
         * 
         * A basic entity. Defines the x and y position in window (from
         * top-left). Defines width, height, and graphic. Defines scale
         * and angle, both of which are implemented through CSS transforms.
         * 
         * @param {number} x - X-position (the ˙left` style property is used)
         * @param {number} y - Y-position (the `top` syle property is used)
         * @param {number} width - Entity width
         * @param {number} height - Entity height
         * @param {string} graphic - A string for the background CSS property (e.g. '#fff', 'rgba(255, 127, 0, 0.5)', 'url(myimage.png)')
         */
        function Entity(root, x, y, width, height, graphic) {
            Element.call(this);

            var _x, _y, _graphic, _scale, _angle;

            var _transformations = ['', ''];

            Object.defineProperties(this, {
                x : {
                    get : function get_x() {
                        return _x;
                    },
                    set : function set_x(x) {
                        _x = x;
                        this.domElement.style.left = _x + 'px';
                        return _x;
                    }
                },
                y : {
                    get : function get_y() {
                        return _y;
                    },
                    set : function set_y(y) {
                        _y = y;
                        this.domElement.style.top = _y + 'px';
                        return _y;
                    }
                },
                graphic : {
                    get : function get_graphic() {
                        return _graphic;
                    },
                    set : function set_graphic(graphic) {
                        _graphic = graphic;
                        this.domElement.style.background = graphic;
                        return _graphic;
                    }
                },
                scale : {
                    get : function get_scale() {
                        return _scale;
                    },
                    set : function set_scale(scale) {
                        _scale = scale;
                        _transformations[0] = 'scale(' + _scale + ')';
                        this.domElement.style.transform = _transformations.join(' ');
                        return _scale;
                    }
                },
                angle : {
                    get : function get_angle() {
                        return _angle;
                    },
                    set : function set_angle(angle) {
                        _angle = angle;
                        _transformations[1] = 'rotate(' + _angle + 'deg)';
                        this.domElement.style.transform = _transformations.join(' ');
                        return _angle;
                    }
                }
            });

            root.appendChild(this.domElement);

            this.domElement.style.position = 'fixed';
            this.domElement.style.zIndex = _zIndex;

            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.graphic = graphic || '#fff';
            this.scale = 1;
            this.angle = 0;

        }

        Entity.prototype = Object.create(Element.prototype);
        Entity.prototype.constructor = Entity;

        /**
         * SPRITE
         * 
         * An Entity that supports sprite sheets for graphics.
         * 
         * @param {number} x - X-position (the ˙left` style property is used)
         * @param {number} y - Y-position (the `top` syle property is used)
         * @param {number} width - Entity width
         * @param {number} height - Entity height
         * @param {string} graphic - A string for the background CSS property (e.g. '#fff', 'rgba(255, 127, 0, 0.5)', 'url(myimage.png)')
         */
        function Sprite(root, x, y, width, height, graphic) {
            Entity.call(this, root, x, y, width, height, graphic);

            var _animations = {},
                _currentAnimation = {},
                _currentFrame = 0,
                _currentFrameIndex = 0,
                _timeAccumulator = 0,
                _previousTime = Date.now(),
                _currentTime = 0;

            _animations = {};
            _currentAnimation = {};
            _timeAccumulator = 0;

            /**
             * Sets (defines) an animation in the animation register.
             * 
             * @param {string} name - Animation name, an identifier
             * @param {number[]} frames - Array of sprite sheet frames to use
             * @param {number} frameRate - Frame rate at which to play animation
             */
            this.setAnimation = function(name, frames, frameRate) {
                _animations[name] = { frames : frames, frameRate : frameRate };
            };

            /**
             * Uses and applies an animation from the register.
             * 
             * @param {string} name - Animation name, an identifier
             */
            this.useAnimation = function(name) {
                _currentAnimation = _animations[name];
                _currentFrameIndex = 0;
                _currentFrame = _currentAnimation.frames[_currentFrameIndex];
                this.domElement.style.backgroundPositionX = _currentFrame * width + 'px';
            };

            /**
             * Runs animation. This is designed for requestAnimationFrame().
             * Call this inside of the function that is requested by it.
             * 
             * Currently, it works by selfishly keeping track of time for
             * itself. This is very, very bad and wasteful. However, the
             * user now isn't required to write his own game loop. I guess
             * that's a plus?
             */
            this.animate = function() {
                _currentTime = Date.now();
                _timeAccumulator += _currentTime - _previousTime;
                _previousTime = _currentTime;
                if (_timeAccumulator >= 1000 / _currentAnimation.frameRate) {
                    _timeAccumulator = 0;
                    _currentFrameIndex++;
                    if (_currentFrameIndex >= _currentAnimation.frames.length) {
                        _currentFrameIndex = 0;
                    }
                    _currentFrame = _currentAnimation.frames[_currentFrameIndex];
                    this.domElement.style.backgroundPositionX = -_currentFrame * width + 'px';
                }
            };
        }

        Sprite.prototype = Object.create(Entity.prototype);
        Sprite.prototype.constructor = Sprite;

        /**
         * We're done setting up. Create a new context and return.
         */

        var _context = new Context();

        return {
            root : _context,
            entity : function (x, y, width, height, graphic) {
                return new Entity(_context.domElement, x, y, width, height, graphic);
            },
            sprite : function (x, y, width, height, graphic) {
                return new Sprite(_context.domElement, x, y, width, height, graphic);
            }
        }
    };
    
    if (typeof define === 'function' && define.amd) {
		define('brick', BRICK);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
		module.exports = BRICK;
    } else {
        window.BRICK = BRICK;
    }

})(window);