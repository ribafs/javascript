 /*
  * Copyright (c) 2010 James Brantly
  *
  * Permission is hereby granted, free of charge, to any person
  * obtaining a copy of this software and associated documentation
  * files (the "Software"), to deal in the Software without
  * restriction, including without limitation the rights to use,
  * copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the
  * Software is furnished to do so, subject to the following
  * conditions:
  *
  * The above copyright notice and this permission notice shall be
  * included in all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  */

(function(globalFunctionEval) {

	var Yabble = function() {
		throw "Synchronous require() is not supported.";
	};

	Yabble.unit = {};

	var _moduleRoot = '',
		_modules,
		_callbacks,
		_fetchFunc,
		_timeoutLength = 20000,
		_mainProgram;

	var isWebWorker = this.importScripts !== undefined;


	var head = !isWebWorker && document.getElementsByTagName('head')[0];

	// Shortcut to native hasOwnProperty
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	// A for..in implementation which uses hasOwnProperty and fixes IE non-enumerable issues
	if ((function() {for (var prop in {hasOwnProperty: true}) { return prop; }})() == 'hasOwnProperty') {
		var forIn = function(obj, func, ctx) {
			for (var prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					func.call(ctx, prop);
				}
			}
		};
	}
	else {
		var ieBadProps = [
	      'isPrototypeOf',
	      'hasOwnProperty',
	      'toLocaleString',
	      'toString',
	      'valueOf'
		];

		var forIn = function(obj, func, ctx) {
			for (var prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					func.call(ctx, prop);
				}
			}

			for (var i = ieBadProps.length; i--;) {
				var prop = ieBadProps[i];
				if (hasOwnProperty.call(obj, prop)) {
					func.call(ctx, prop);
				}
			}
		};
	}

	// Array convenience functions
	var indexOf = function(arr, val) {
		for (var i = arr.length; i--;) {
			if (arr[i] == val) { return i; }
		}
		return -1;
	};

	var removeWhere = function(arr, func) {
		var i = 0;
		while (i < arr.length) {
			if (func.call(null, arr[i], i) === true) {
				arr.splice(i, 1);
			}
			else {
				i++;
			}
		}
	};

	var combinePaths = function(relPath, refPath) {
		var relPathParts = relPath.split('/');
		refPath = refPath || '';
		if (refPath.length && refPath.charAt(refPath.length-1) != '/') {
			refPath += '/';
		}
		var refPathParts = refPath.split('/');
		refPathParts.pop();
		var part;
		while (part = relPathParts.shift()) {
			if (part == '.') { continue; }
			else if (part == '..'
				&& refPathParts.length
				&& refPathParts[refPathParts.length-1] != '..') { refPathParts.pop(); }
			else { refPathParts.push(part); }
		}
		return refPathParts.join('/');
	};

	// Takes a relative path to a module and resolves it according to the reference path
	var resolveModuleId = Yabble.unit.resolveModuleId = function(relModuleId, refPath) {
		if (relModuleId.charAt(0) != '.') {
			return relModuleId;
		}
		else {
			return combinePaths(relModuleId, refPath);
		}
	};

	// Takes a module's ID and resolves a URI according to the module root path
	var resolveModuleUri = function(moduleId) {
		if (moduleId.charAt(0) != '.') {
			return _moduleRoot+moduleId+'.js';
		}
		else {
			return this._resolveModuleId(moduleId, _moduleRoot)+'.js';
		}
	};

	// Returns a module object from the module ID
	var getModule = function(moduleId) {
		if (!hasOwnProperty.call(_modules, moduleId)) {
			return null;
		}
		return _modules[moduleId];
	};

	// Adds a callback which is executed when all deep dependencies are loaded
	var addCallback = function(deps, cb) {
		_callbacks.push([deps.slice(0), cb]);
	};

	// Generic implementation of require.ensure() which takes a reference path to
	// use when resolving relative module IDs
	var ensureImpl = function(deps, cb, refPath) {
		var unreadyModules = [];

		for (var i = deps.length; i--;) {
			var moduleId = resolveModuleId(deps[i], refPath),
				module = getModule(moduleId);

			if (!areDeepDepsDefined(moduleId)) {
				unreadyModules.push(moduleId);
			}
		}

		if (unreadyModules.length) {
			addCallback(unreadyModules, function() {
				cb(createRequireFunc(refPath));
			});
			queueModules(unreadyModules);
		}
		else {
			setTimeout(function() {
				cb(createRequireFunc(refPath));
			}, 0);
		}
	};

	// Creates a require function that is passed into module factory functions
	// and require.ensure() callbacks. It is bound to a reference path for
	// relative require()s
	var createRequireFunc = function(refPath) {
		var require = function(relModuleId) {
			var moduleId = resolveModuleId(relModuleId, refPath),
				module = getModule(moduleId);

			if (!module) {
				throw "Module not loaded";
			}
			else if (module.error) {
				throw "Error loading module";
			}

			if (!module.exports) {
				module.exports = {};
				var moduleDir = moduleId.substring(0, moduleId.lastIndexOf('/')+1),
					injects = module.injects,
					args = [];

				for (var i = 0, n = injects.length; i<n; i++) {
					if (injects[i] == 'require') {
						args.push(createRequireFunc(moduleDir));
					}
					else if (injects[i] == 'exports') {
						args.push(module.exports);
					}
					else if (injects[i] == 'module') {
						args.push(module.module);
					}
				}

				module.factory.apply(null, args);
			}
			return module.exports;
		};

		require.ensure = function(deps, cb) {
			ensureImpl(deps, cb, refPath);
		};

		if (_mainProgram != null) {
			require.main = getModule(_mainProgram).module;
		}

		return require;
	};

	// Begins loading modules asynchronously
	var queueModules = function(moduleIds) {
		for (var i = moduleIds.length; i--;) {
			var moduleId = moduleIds[i],
				module = getModule(moduleId);

			if (module == null) {
				module = _modules[moduleId] = {};
				_fetchFunc(moduleId);
			}
		}
	};

	// Returns true if all deep dependencies are satisfied (in other words,
	// can more or less safely run the module factory function)
	var areDeepDepsDefined = function(moduleId) {
		var visitedModules = {};
		var recurse = function(moduleId) {
			if (visitedModules[moduleId] == true) { return true; }
			visitedModules[moduleId] = true;
			var module = getModule(moduleId);
			if (!module || !module.defined) { return false; }
			else {
				var deps = module.deps || [];
				for (var i = deps.length; i--;) {
					if (!recurse(deps[i])) {
						return false;
					}
				}
				return true;
			}
		};
		return recurse(moduleId);
	};

	// Checks dependency callbacks and fires as necessary
	var fireCallbacks = function() {
		var i = 0;
		while (i<_callbacks.length) {
			var deps = _callbacks[i][0],
				func = _callbacks[i][1],
				n = 0;
			while (n<deps.length) {
				if (areDeepDepsDefined(deps[n])) {
					deps.splice(n, 1);
				}
				else {
					n++;
				}
			}
			if (!deps.length) {
				_callbacks.splice(i, 1);
				if (func != null) {
					setTimeout(func, 0);
				}
			}
			else {
				i++;
			}
		}
	};

	// Load an unwrapped module using XHR and eval()
	var loadModuleByEval = _fetchFunc = function(moduleId) {
		var timeoutHandle;

		var errorFunc = function() {
			var module = getModule(moduleId);
			if (!module.defined) {
				module.defined = module.error = true;
				fireCallbacks();
			}
		};

		var xhr = this.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		var moduleUri = resolveModuleUri(moduleId);
		xhr.open('GET', moduleUri, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				clearTimeout(timeoutHandle);
				if (xhr.status == 200 || xhr.status === 0) {
					var moduleCode = xhr.responseText,
						deps = determineShallowDependencies(moduleCode),
						moduleDir = moduleId.substring(0, moduleId.lastIndexOf('/')+1),
						moduleDefs = {};
					for (var i = deps.length; i--;) {
						deps[i] = resolveModuleId(deps[i], moduleDir);
					}
					try {
						moduleDefs[moduleId] = globalFunctionEval('\r\n' + moduleCode + '\r\n');
					} catch (e) {
						if (e instanceof SyntaxError) {
							var msg = 'Syntax Error: ';
							if (e.lineNumber) {
								msg += 'line ' + (e.lineNumber - 581);
							} else {
								console.log('GameJs tip: use Firefox to see line numbers in Syntax Errors.');
							}
							msg += ' in file ' + moduleUri;
							console.log(msg);
						}
						throw e;
					}

					Yabble.define(moduleDefs, deps);
				}
				else {
					errorFunc();
				}
			}
		};

		timeoutHandle = setTimeout(errorFunc, _timeoutLength);

		xhr.send(null);
	};

	// Used by loadModuleByEval and by the packager. Determines shallow dependencies of
	// a module via static analysis. This can currently break with require.ensure().
	var determineShallowDependencies = Yabble.unit.determineShallowDependencies = function(moduleCode) {
		// TODO: account for comments
		var deps = {}, match, unique = {};

		var requireRegex = /(?:^|[^\w\$_.])require\s*\(\s*("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g;
		while (match = requireRegex.exec(moduleCode)) {
			var module = eval(match[1]);
			if (!hasOwnProperty.call(deps, module)) {
				deps[module] = true;
			}
		}

		var ensureRegex = /(?:^|[^\w\$_.])require.ensure\s*\(\s*(\[("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\s*|,)*\])/g;
		while (match = ensureRegex.exec(moduleCode)) {
			var moduleArray = eval(match[1]);
			for (var i = moduleArray.length; i--;) {
				var module = moduleArray[i];
				delete deps[module];
			}
		}

		var depsArray = [];
		forIn(deps, function(module) {
			depsArray.push(module);
		});

		return depsArray;
	};

	// Load a wrapped module via script tags
	var loadModuleByScript = function(moduleId) {
		var scriptEl = document.createElement('script');
		scriptEl.type = 'text/javascript';
		scriptEl.src = resolveModuleUri(moduleId);

		var useStandard = !!scriptEl.addEventListener,
			timeoutHandle;

		var errorFunc = function() {
			postLoadFunc(false);
		};

		var loadFunc = function() {
			if (useStandard || (scriptEl.readyState == 'complete' || scriptEl.readyState == 'loaded')) {
				postLoadFunc(getModule(moduleId).defined);
			}
		};

		var postLoadFunc = function(loaded) {
			clearTimeout(timeoutHandle);

			if (useStandard) {
				scriptEl.removeEventListener('load', loadFunc, false);
				scriptEl.removeEventListener('error', errorFunc, false);
			}
			else {
				scriptEl.detachEvent('onreadystatechange', loadFunc);
			}

			if (!loaded) {
				var module = getModule(moduleId);
				if (!module.defined) {
					module.defined = module.error = true;
					fireCallbacks();
				}
			}
		};

		if (useStandard) {
			scriptEl.addEventListener('load', loadFunc, false);
			scriptEl.addEventListener('error', errorFunc, false);
		}
		else {
			scriptEl.attachEvent('onreadystatechange', loadFunc);
		}

		timeoutHandle = setTimeout(errorFunc, _timeoutLength);

		head.appendChild(scriptEl);
	};

	var normalizeTransport = function() {
		var transport = {modules: []};
		var standardInjects = ['require', 'exports', 'module'];
		if (typeof arguments[0] == 'object') { // Transport/D
			transport.deps = arguments[1] || [];
			var moduleDefs = arguments[0];
			forIn(moduleDefs, function(moduleId) {
				var module = {
					id: moduleId
				};

				if (typeof moduleDefs[moduleId] == 'function') {
					module.factory = moduleDefs[moduleId];
					module.injects = standardInjects;
				}
				else {
					module.factory = moduleDefs[moduleId].factory;
					module.injects = moduleDefs[moduleId].injects || standardInjects;
				}
				transport.modules.push(module);
			});
		}
		else { // Transport/C
			transport.deps = arguments[1].slice(0);
			removeWhere(transport.deps, function(dep) {
				return indexOf(standardInjects, dep) >= 0;
			});

			transport.modules.push({
				id: arguments[0],
				factory: arguments[2],
				injects: arguments[1]
			});
		}
		return transport;
	};

	// Set the uri which forms the conceptual module namespace root
	Yabble.setModuleRoot = function(path) {
		if (this.window && !(/^http(s?):\/\//.test(path))) {
			var href = window.location.href;
			href = href.substr(0, href.lastIndexOf('/')+1);
			path = combinePaths(path, href);
		}

		if (path.length && path.charAt(path.length-1) != '/') {
			path += '/';
		}

		_moduleRoot = path;
	};
	Yabble.getModuleRoot = function() {
	   return _moduleRoot;
	}
	// Set a timeout period for async module loading
	Yabble.setTimeoutLength = function(milliseconds) {
		_timeoutLength = milliseconds;
	};

	// Use script tags with wrapped code instead of XHR+eval()
	Yabble.useScriptTags = function() {
		_fetchFunc = loadModuleByScript;
	};

	// Define a module per various transport specifications
	Yabble.def = Yabble.define = function() {
		var transport = normalizeTransport.apply(null, arguments);

		var unreadyModules = [],
			definedModules = [];

		var deps = transport.deps;

		for (var i = transport.modules.length; i--;) {
			var moduleDef = transport.modules[i],
				moduleId = moduleDef.id,
				module = getModule(moduleId);

			if (!module) {
				module = _modules[moduleId] = {};
			}
			module.module = {
				id: moduleId,
				uri: resolveModuleUri(moduleId)
			};

			module.defined = true;
			module.deps = deps.slice(0);
			module.injects = moduleDef.injects;
			module.factory = moduleDef.factory;
			definedModules.push(module);
		}

		for (var i = deps.length; i--;) {
			var moduleId = deps[i],
				module = getModule(moduleId);

			if (!module || !areDeepDepsDefined(moduleId)) {
				unreadyModules.push(moduleId);
			}
		}

		if (unreadyModules.length) {
			setTimeout(function() {
				queueModules(unreadyModules);
			}, 0);
		}

		fireCallbacks();
	};

	Yabble.isKnown = function(moduleId) {
		return getModule(moduleId) != null;
	};

	Yabble.isDefined = function(moduleId) {
		var module = getModule(moduleId);
		return !!(module && module.defined);
	};

	// Do an async lazy-load of modules
	Yabble.ensure = function(deps, cb) {
		ensureImpl(deps, cb, '');
	};

	// Start an application via a main program module
	Yabble.run = function(program, cb) {
		program = _mainProgram = resolveModuleId(program, '');
		Yabble.ensure([program], function(require) {
			require(program);
			if (cb != null) { cb(); }
		});
	};

	// Reset internal state. Used mostly for unit tests.
	Yabble.reset = function() {
		_mainProgram = null;
		_modules = {};
		_callbacks = [];

		// Built-in system module
		Yabble.define({
			'system': function(require, exports, module) {}
		});
	};

	Yabble.reset();

	// Export to the require global
	if (isWebWorker) {
		self.require = Yabble;
	} else {
		window.require = Yabble;
	}
})(function(code) {
   with (this.importScripts ? self : window) {
      return (new Function('require', 'exports', 'module', code));
   };
});

/* This file has been generated by yabbler.js */
require.define({
"gamejs": function(require, exports, module) {
var matrix = require('./gamejs/math/matrix');
var objects = require('./gamejs/utils/objects');
var Callback = require('./gamejs/utils/callback').Callback;

/**
 * @fileoverview  `gamejs.ready()` is maybe the most important function as it kickstarts your app:
 *
 *     var gamejs = require('gamejs');
 *     ready(function() {
 *         gamejs.logging.info('I am ready!')
 *     });
 *
 * If you use images or sounds preload all assets with `gamejs.preload(['./files/foo.png'])` before calling `ready()`.
 *
 * Also in this module is the `Rect` class which is generally useful when dealing with Surfaces and simple rectangles (e.g. for collisions).
 */
// preloading stuff
var gamejs = exports;
var RESOURCES = {};
/**
 * @ignore
 */
exports.thread = require('./gamejs/thread');


/**
 * ReadyFn is called once all modules and assets are loaded.
 * @param {Function} callbackFunction the function to be called once gamejs finished loading
 * @name ready
 */
if (gamejs.thread.inWorker === true) {
   exports.ready = function(readyFn) {
      require('./gamejs/thread')._ready();
      gamejs.init();
      readyFn();
   };
} else {
   exports.ready = function(readyFn) {

      var getMixerProgress = null;
      var getImageProgress = null;

      // init time instantly - we need it for preloaders
      gamejs.time.init();

      // 2.
      function _ready() {
         if (!document.body) {
            return window.setTimeout(_ready, 50);
         }
         getImageProgress = gamejs.image.preload(RESOURCES);
         try {
            getMixerProgress = gamejs.audio.preload(RESOURCES);
         } catch (e) {
            gamejs.debug('Error loading audio files ', e);
         }
         window.setTimeout(_readyResources, 50);
      }

      // 3.
      function _readyResources() {
         if (getImageProgress() < 1 || getMixerProgress() < 1) {
            return window.setTimeout(_readyResources, 100);
         }
         gamejs.display.init();
         gamejs.image.init();
         gamejs.audio.init();
         gamejs.event.init();
         gamejs.math.random.init();
         readyFn();
      }

      // 1.
      window.setTimeout(_ready, 13);

      function getLoadProgress() {
         if (getImageProgress) {
            return (0.5 * getImageProgress()) + (0.5 * getMixerProgress());
         }
         return 0.1;
      }

      return getLoadProgress;
   };
}

/**
 * Initialize all gamejs modules. This is automatically called
 * by `gamejs.ready()`.
 * @returns {Object} the properties of this objecte are the moduleIds that failed, they value are the exceptions
 * @ignore
 */
exports.init = function() {
   var errorModules = {};
   ['time', 'display', 'image', 'audio', 'event'].forEach(function(moduleName) {
      try {
         gamejs[moduleName].init();
      } catch (e) {
         errorModules[moduleName] = e.toString();
      }
   });
   return errorModules;
};

var resourceBaseHref = function() {
    return (window.$g && window.$g.resourceBaseHref) || document.location.href;
};

/**
 * Preload resources.
 * @param {Array} resources list of resources paths
 * @name preload
 */
var preload = exports.preload = function(resources) {
   var uri = require('./gamejs/utils/uri');
   var baseHref = resourceBaseHref();
   resources.forEach(function(res) {
      RESOURCES[res] = uri.resolve(baseHref, res);
   }, this);
   return;
};

/**
 * The function passed to `onTick` will continously be called at a
 * frequency determined by the browser (typically between 1 and 60 times per second).
 * @param {Function} callbackFunction the function you want to be called
 * @param {Function} callbackScope optional scope for the function call
 */
exports.onTick = function(fn, scope) {
  /** ignore **/
  exports.time._CALLBACKS.push(new Callback(fn, scope));
};

/**
 * Normalize various ways to specify a Rect into {left, top, width, height} form.
 * @ignore
 *
 */
var normalizeRectArguments = exports.normalizeRectArguments = function () {
   var left = 0;
   var top = 0;
   var width = 0;
   var height = 0;

   if (arguments.length === 2) {
      if (arguments[0] instanceof Array && arguments[1] instanceof Array) {
         left = arguments[0][0];
         top = arguments[0][1];
         width = arguments[1][0];
         height = arguments[1][1];
      } else {
         left = arguments[0];
         top = arguments[1];
      }
   } else if (arguments.length === 1 && arguments[0] instanceof Array) {
      left = arguments[0][0];
      top = arguments[0][1];
      width = arguments[0][2];
      height = arguments[0][3];
   } else if (arguments.length === 1 && arguments[0] instanceof Rect) {
      left = arguments[0].left;
      top = arguments[0].top;
      width = arguments[0].width;
      height = arguments[0].height;
   } else if (arguments.length === 4) {
      left = arguments[0];
      top = arguments[1];
      width = arguments[2];
      height = arguments[3];
   } else {
      throw new Error('not a valid rectangle specification');
   }
   return {left: left || 0, top: top || 0, width: width || 0, height: height || 0};
};


/**
 * Creates a Rect. Rects are used to hold rectangular areas. There are a couple
 * of convinient ways to create Rects with different arguments and defaults.
 *
 * Any function that requires a `gamejs.Rect` argument also accepts any of the
 * constructor value combinations `Rect` accepts.
 *
 * Rects are used a lot. They are good for collision detection, specifying
 * an area on the screen (for blitting) or just to hold an objects position.
 *
 * The Rect object has several virtual attributes which can be used to move and align the Rect:
 *
 *   top, left, bottom, right
 *   topleft, bottomleft, topright, bottomright
 *   center
 *   width, height
 *   w,h
 *
 * All of these attributes can be assigned to.
 * Assigning to width or height changes the dimensions of the rectangle; all other
 * assignments move the rectangle without resizing it. Notice that some attributes
 * are Numbers and others are pairs of Numbers.
 *
 * @example
 * new Rect([left, top]) // width & height default to 0
 * new Rect(left, top) // width & height default to 0
 * new Rect(left, top, width, height)
 * new Rect([left, top], [width, height])
 * new Rect(oldRect) // clone of oldRect is created
 *
 * @property {Number} right
 * @property {Number} bottom
 * @property {Number} center
 * @constructor
 * @param {Array|gamejs.Rect} position Array holding left and top coordinates
 * @param {Array} dimensions Array holding width and height
 */
var Rect = exports.Rect = function() {

   var args = normalizeRectArguments.apply(this, arguments);

   /**
    * Left, X coordinate
    * @type Number
    */
   this.left = args.left;

   /**
    * Top, Y coordinate
    * @type Number
    */
   this.top = args.top;

   /**
    * Width of rectangle
    * @type Number
    */
   this.width = args.width;

   /**
    * Height of rectangle
    * @type Number
    */
   this.height = args.height;

   return this;
};

objects.accessors(Rect.prototype, {
   /**
    * Bottom, Y coordinate
    * @name Rect.prototype.bottom
    * @type Number
    */
   'bottom': {
      get: function() {
         return this.top + this.height;
      },
      set: function(newValue) {
         this.top = newValue - this.height;
         return;
      }
   },
   /**
    * Right, X coordinate
    * @name Rect.prototype.right
    * @type Number
    */
   'right': {
      get: function() {
         return this.left + this.width;
      },
      set: function(newValue) {
         this.left = newValue - this.width;
      }
   },
   /**
    * Center Position. You can assign a rectangle form.
    * @name Rect.prototype.center
    * @type Array
    */
   'center': {
      get: function() {
         return [this.left + (this.width / 2) | 0,
                 this.top + (this.height / 2) | 0
                ];
      },
      set: function() {
         var args = normalizeRectArguments.apply(this, arguments);
         this.left = args.left - (this.width / 2) | 0;
         this.top = args.top - (this.height / 2) | 0;
         return;
      }
   },
   /**
    * Top-left Position. You can assign a rectangle form.
    * @name Rect.prototype.topleft
    * @type Array
    */
   'topleft': {
      get: function() {
         return [this.left, this.top];
      },
      set: function() {
         var args = normalizeRectArguments.apply(this, arguments);
         this.left = args.left;
         this.top = args.top;
         return;
      }
   },
   /**
    * Bottom-left Position. You can assign a rectangle form.
    * @name Rect.prototype.bottomleft
    * @type Array
    */
   'bottomleft': {
      get: function() {
         return [this.left, this.bottom];
      },
      set: function() {
         var args = normalizeRectArguments.apply(this, arguments);
         this.left = args.left;
         this.bottom = args.top;
         return;
      }
   },
   /**
    * Top-right Position. You can assign a rectangle form.
    * @name Rect.prototype.topright
    * @type Array
    */
   'topright': {
      get: function() {
         return [this.right, this.top];
      },
      set: function() {
         var args = normalizeRectArguments.apply(this, arguments);
         this.right = args.left;
         this.top = args.top;
         return;
      }
   },
   /**
    * Bottom-right Position. You can assign a rectangle form.
    * @name Rect.prototype.bottomright
    * @type Array
    */
   'bottomright': {
      get: function() {
         return [this.right, this.bottom];
      },
      set: function() {
         var args = normalizeRectArguments.apply(this, arguments);
         this.right = args.left;
         this.bottom = args.top;
         return;
      }
   },
   /**
    * Position x value, alias for `left`.
    * @name Rect.prototype.y
    * @type Array
    */
   'x': {
      get: function() {
         return this.left;
      },
      set: function(newValue) {
         this.left = newValue;
         return;
      }
   },
   /**
    * Position y value, alias for `top`.
    * @name Rect.prototype.y
    * @type Array
    */
   'y': {
      get: function() {
         return this.top;
      },
      set: function(newValue) {
         this.top = newValue;
         return;
      }
   }
});

/**
 * Move returns a new Rect, which is a version of this Rect
 * moved by the given amounts. Accepts any rectangle form.
 * as argument.
 *
 * @param {Number|gamejs.Rect} x amount to move on x axis
 * @param {Number} y amount to move on y axis
 */
Rect.prototype.move = function() {
   var args = normalizeRectArguments.apply(this, arguments);
   return new Rect(this.left + args.left, this.top + args.top, this.width, this.height);
};

/**
 * Move this Rect in place - not returning a new Rect like `move(x, y)` would.
 *
 * `moveIp(x,y)` or `moveIp([x,y])`
 *
 * @param {Number|gamejs.Rect} x amount to move on x axis
 * @param {Number} y amount to move on y axis
 */
Rect.prototype.moveIp = function() {
   var args = normalizeRectArguments.apply(this, arguments);
   this.left += args.left;
   this.top += args.top;
   return;
};

/**
 * Return the area in which this Rect and argument Rect overlap.
 *
 * @param {gamejs.Rect} Rect to clip this one into
 * @returns {gamejs.Rect} new Rect which is completely inside the argument Rect,
 * zero sized Rect if the two rectangles do not overlap
 */
Rect.prototype.clip = function(rect) {
   if(!this.collideRect(rect)) {
      return new Rect(0,0,0,0);
   }

   var x, y, width, height;

   // Left
   if ((this.left >= rect.left) && (this.left < rect.right)) {
      x = this.left;
   } else if ((rect.left >= this.left) && (rect.left < this.right)) {
      x = rect.left;
   }

   // Right
   if ((this.right > rect.left) && (this.right <= rect.right)) {
      width = this.right - x;
   } else if ((rect.right > this.left) && (rect.right <= this.right)) {
      width = rect.right - x;
   }

   // Top
   if ((this.top >= rect.top) && (this.top < rect.bottom)) {
      y = this.top;
   } else if ((rect.top >= this.top) && (rect.top < this.bottom)) {
      y = rect.top;
   }

   // Bottom
   if ((this.bottom > rect.top) && (this.bottom <= rect.bottom)) {
     height = this.bottom - y;
   } else if ((rect.bottom > this.top) && (rect.bottom <= this.bottom)) {
     height = rect.bottom - y;
   }
   return new Rect(x, y, width, height);
};

/**
 * Join two rectangles
 *
 * @param {gamejs.Rect} union with this rectangle
 * @returns {gamejs.Rect} rectangle containing area of both rectangles
 */
Rect.prototype.union = function(rect) {
   var x, y, width, height;

   x = Math.min(this.left, rect.left);
   y = Math.min(this.top, rect.top);
   width = Math.max(this.right, rect.right) - x;
   height = Math.max(this.bottom, rect.bottom) - y;
   return new Rect(x, y, width, height);
};

/**
 * Grow or shrink the rectangle size
 *
 * @param {Number} amount to change in the width
 * @param {Number} amount to change in the height
 * @returns {gamejs.Rect} inflated rectangle centered on the original rectangle's center
 */
Rect.prototype.inflate = function(x, y) {
    var copy = this.clone();

    copy.inflateIp(x, y);

    return copy;
};

/**
 * Grow or shrink this Rect in place - not returning a new Rect like `inflate(x, y)` would.
 *
 * @param {Number} amount to change in the width
 * @param {Number} amount to change in the height
 */
Rect.prototype.inflateIp = function(x, y) {
    // Use Math.floor here to deal with rounding of negative numbers the
    // way this relies on.
    this.left -= Math.floor(x / 2);
    this.top -= Math.floor(y / 2);
    this.width += x;
    this.height += y;
};

/**
 * Check for collision with a point.
 *
 * `collidePoint(x,y)` or `collidePoint([x,y])` or `collidePoint(new Rect(x,y))`
 *
 * @param {Array|gamejs.Rect} point the x and y coordinates of the point to test for collision
 * @returns {Boolean} true if the point collides with this Rect
 */
Rect.prototype.collidePoint = function() {
   var args = normalizeRectArguments.apply(this, arguments);
   return (this.left <= args.left && args.left <= this.right) &&
       (this.top <= args.top && args.top <= this.bottom);
};

/**
 * Check for collision with a Rect.
 * @param {gamejs.Rect} rect the Rect to test check for collision
 * @returns {Boolean} true if the given Rect collides with this Rect
 */
Rect.prototype.collideRect = function(rect) {
   return !(this.left > rect.right || this.right < rect.left ||
      this.top > rect.bottom || this.bottom < rect.top);
};

/**
 * @param {Array} pointA start point of the line
 * @param {Array} pointB end point of the line
 * @returns true if the line intersects with the rectangle
 * @see http://stackoverflow.com/questions/99353/how-to-test-if-a-line-segment-intersects-an-axis-aligned-rectange-in-2d/293052#293052
 *
 */
Rect.prototype.collideLine = function(p1, p2) {
   var x1 = p1[0];
   var y1 = p1[1];
   var x2 = p2[0];
   var y2 = p2[1];

   function linePosition(point) {
      var x = point[0];
      var y = point[1];
      return (y2 - y1) * x + (x1 - x2) * y + (x2 * y1 - x1 * y2);
   }

   var relPoses = [[this.left, this.top],
                   [this.left, this.bottom],
                   [this.right, this.top],
                   [this.right, this.bottom]
                  ].map(linePosition);

   var noNegative = true;
   var noPositive = true;
   var noZero = true;
   relPoses.forEach(function(relPos) {
      if (relPos > 0) {
         noPositive = false;
      } else if (relPos < 0) {
         noNegative = false;
      } else if (relPos === 0) {
         noZero = false;
      }
   }, this);

   if ( (noNegative || noPositive) && noZero) {
      return false;
   }
   return !((x1 > this.right && x2 > this.right) ||
            (x1 < this.left && x2 < this.left) ||
            (y1 < this.top && y2 < this.top) ||
            (y1 > this.bottom && y2 > this.bottom)
            );
};

/**
 * @returns {String} Like "[x, y][w, h]"
 */
Rect.prototype.toString = function() {
   return ["[", this.left, ",", this.top, "]"," [",this.width, ",", this.height, "]"].join("");
};

/**
 * @returns {gamejs.Rect} A new copy of this rect
 */
Rect.prototype.clone = function() {
   return new Rect(this);
};

/**
 * @ignore
 */
exports.event = require('./gamejs/event');
/**
 * @ignore
 */
exports.font = require('./gamejs/font');
/**
 * @ignore
 */
exports.http = require('./gamejs/http');
/**
 * @ignore
 */
exports.image = require('./gamejs/image');
/**
 * @ignore
 */
exports.audio = require('./gamejs/audio');
/**
 * @ignore
 */
exports.graphics = require('./gamejs/graphics');

/**
 * @ignore
 */
exports.logging = require('./gamejs/logging');

/**
 * @ignore
 */
exports.math = {
   matrix: require('./gamejs/math/matrix'),
   vectors: require('./gamejs/math/vectors'),
   angles: require('./gamejs/math/angles'),
   binaryheap: require('./gamejs/math/binaryheap'),
   random: require('./gamejs/math/random'),
   noise: require('./gamejs/math/noise'),
};

/**
 * @ignore
 */
exports.utils = {
   arrays: require('./gamejs/utils/arrays'),
   objects: require('./gamejs/utils/objects'),
   uri: require('./gamejs/utils/uri'),
   strings: require('./gamejs/utils/strings'),
   xml: require('./gamejs/utils/xml'),
   base64: require('./gamejs/utils/base64')
};
/**
 * @ignore
 */
exports.display = require('./gamejs/display');
/**
 * @ignore
 */
exports.pathfinding = require('./gamejs/pathfinding');


/**
 * @ignore
 */
exports.tiledmap = require('./gamejs/tiledmap');


/**
 * @ignore
 */
exports.time = require('./gamejs/time');

}}, ["gamejs/math/matrix", "gamejs/utils/objects", "gamejs/utils/callback", "gamejs", "gamejs/thread", "gamejs/utils/uri", "gamejs/event", "gamejs/font", "gamejs/http", "gamejs/image", "gamejs/audio", "gamejs/graphics", "gamejs/logging", "gamejs/math/vectors", "gamejs/math/angles", "gamejs/math/binaryheap", "gamejs/math/random", "gamejs/math/noise", "gamejs/utils/arrays", "gamejs/utils/strings", "gamejs/utils/xml", "gamejs/utils/base64", "gamejs/display", "gamejs/pathfinding", "gamejs/tiledmap", "gamejs/time"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/animate": function(require, exports, module) {
var gamejs = require('../gamejs');

/**
 * @fileoverview `Animations` on top of `SpriteSheets`.
 *
 * @example
 * var spriteSheet = new SpriteSheet(sheetSurface, {width: 16, height: 16});
 * var animation = new Animation(spriteSheet, {walk: [0,1,2,3], loop: true});
 * animation.setState('walk');
 * ....
 * animation.update(msDuration)
 * ....
 * display.blit(animation.currentFrame);
 *
 */

/**
 * Turn a Surface into a SpriteSheet. This makes individual images ("tiles") within the
 * larger Surface retrievable with the SpriteSheet's `get(indexPositon)` method.
 *
 * Available option properties are (width and height are required):
 *
 *  * `width` individual tile, number
 *  * `height` of individual tile, number
 *  * `spacing` between two tiles, number
 *  * `margin` at the image border without tiles, number
 *  * `scaleTo` [width,height] scale tiles to this size after loading
 *  *
 *
 * @param {Surface} image containing the individual tiles
 * @param {Object} options describing the tile dimensions, size, spacing, etc. (see above)
 */
var SpriteSheet = exports.SpriteSheet = function(image, opts) {
    /** @ignore **/
    this.width = opts.width;
    /** @ignore **/
    this.height = opts.height;
    /** @ignore **/
    this.spacing = opts.spacing || 0;
    /** @ignore **/
    this.margin = opts.margin || 0;
    /** @ignore **/
    this.image = image;

    /** @ignore **/
    this.surfaceCache = [];

    var imgSize = new gamejs.Rect([0,0],[this.width,this.height]);
    if (opts.scaleTo) {
        imgSize = new gamejs.Rect([0,0], opts.scaleTo);
    }

    // Extract the cells from the spritesheet image.
    for (var i = this.margin; i < this.image.rect.height; i += this.height + this.spacing) {
        for (var j = this.margin; j < this.image.rect.width; j += this.width + this.spacing) {
            var surface = new gamejs.graphics.Surface([this.width, this.height]);
            var rect = new gamejs.Rect(j, i, this.width, this.height);
            //surface._context.imageSmoothingEnabled = false;
            surface.blit(this.image, imgSize, rect);
            this.surfaceCache.push(surface);
        }
    }
    return this;
};

/**
 * Retrieve the tile at given index position. The index position can be calculated as:

 *    index = column + row * rowLength
 *
 * @param {Number} index
 * @returns {Surface} the tile surface
 */
SpriteSheet.prototype.get = function(index) {
        return this.surfaceCache[index];
};

/**
 * An Animation is a gamejs.animate.SpriteSheet with an animation specification which
 * explains what states the animation has and which tiles in the SpriteSheet compose
 * those states.
 *
 * An animation specification might look like this:
 *       var npcAnimationSpec = {
 *           idle: {frames: [0], rate: 5, loop: true},
 *           moveup: {frames: [0,1,2,3,4,5,6,7,8], rate: rate, loop: true},
 *           die: {frames: [18,19,20,21,22,23,24,25,26], rate: rate, loop: true},
 *           ....
 *       };
 *
 *  The keys in the npcAnimationSpec are the animation state names and each object
 * is describing on such state: `frames` are the index positions of the tiles in the
 * SpriteSheet making up that state. `rate` is the frequence per second at which the
 * state should switch from tile to tile of the state and `loop` designates whether
 * the state shold end or loop endlessly.
 *
 * @param {gamejs.animate.SpriteSheet} spriteSheet
 * @param {String} initialState name of the initital state
 * @param {Object} animationSpecification
 *
 */
var Animation = exports.Animation = function(spriteSheet, initial, spec) {
    /** @ignore **/
    this.spec = spec;

    /** The current tile surface of the animation. Draw this to the screen. **/
    this.currentFrame = null;
    /** @ignore **/
    this.currentFrameDuration = 0;
    /** @ignore **/
    this.currentAnimation = null;
    /** @ignore */
    this._isFinished = false;
    /** @ignore **/
    this.spriteSheet = spriteSheet;
    /** @ignore **/
    this.image = spriteSheet.get(0);
    this.start(initial);

};

/** @ignore **/
Animation.prototype.setFrame = function(frame) {
    this.frameIndex = frame;
};

/** @ignore **/
Animation.prototype.start = function(name) {
    this._isFinished = false;
    this.setState(name);
    this.update(0);
    return;
};

/**
 * Set the animation to the given state.
 *
 * @param {String} stateName
 */
Animation.prototype.setState = function(name) {
    if (this.currentAnimation === name) {
        return;
    }

    this.currentAnimation = name;
    this.currentFrame = this.spec[name].frames[0];
    this.frameIndex = 0;
    this.currentFrameDuration = 0;
    this.frameDuration = 1000 / this.spec[name].rate;
};

/**
 * Call this function every tick to update the animation.
 *
 * @param {Number} msDuration since last tick
 * @returns {Boolean} whether animation image has changed during this update
 */
Animation.prototype.update = function(msDuration) {
    if (!this.currentAnimation) {
        throw new Error('No animation started.');
    }

    this.currentFrameDuration += msDuration;
    if (this.currentFrameDuration >= this.frameDuration && this._isFinished === false){
        var frames = this.spec[this.currentAnimation].frames;

        this.currentFrame = frames[this.frameIndex++];
        this.currentFrameDuration = 0;

        var length = this.spec[this.currentAnimation].frames.length - 1;
        if (this.frameIndex > length) {
            if (this.spec[this.currentAnimation].loop) {
                this.frameIndex = 0;
                this.currentFrame = frames[this.frameIndex];
            } else {
                this._isFinished = true;
                this.frameIndex--;
                this.currentFrame = frames[this.frameIndex];
            }
        }
        this.image = this.spriteSheet.get(this.currentFrame);
        return true;
    }

    return false;
};

/**
 * Whether the animation has ended. Looping animations never end.
 */
Animation.prototype.isFinished = function() {
    return this._isFinished;
};

}}, ["gamejs"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/audio": function(require, exports, module) {
var gamejs = require('../gamejs');

/**
 * @fileoverview Playing sounds with the html5 audio tag. Audio files must be preloaded
 * with the usual `gamejs.preload()` function. Ogg, wav and webm supported.
 *
 */

var CACHE = {};

/**
 * need to export preloading status for require
 * @ignore
 */
var _PRELOADING = false;

/**
 * @ignore
 */
var NUM_CHANNELS = 8;

/**
 * Sets the number of available channels for the mixer. The default value is 8.
 */
exports.setNumChannels = function(count) {
   NUM_CHANNELS = parseInt(count, 10) || NUM_CHANNELS;
};

exports.getNumChannels = function() {
   return NUM_CHANNELS;
};

/**
 * put all audios on page in cache
 * if same domain as current page, remove common href-prefix
 * @ignore
 */
exports.init = function() {
   var audios = Array.prototype.slice.call(document.getElementsByTagName("audio"), 0);
   addToCache(audios);
   return;
};

/**
 * Preload the audios into cache
 * @param {String[]} List of audio URIs to load
 * @returns {Function} which returns 0-1 for preload progress
 * @ignore
 */
exports.preload = function(audioUrls, showProgressOrImage) {
   var countTotal = 0;
   var countLoaded = 0;

   function incrementLoaded() {
      countLoaded++;
      if (countLoaded == countTotal) {
         _PRELOADING = false;
      }
   }

   function getProgress() {
      return countTotal > 0 ? countLoaded / countTotal : 1;
   }

   function successHandler() {
      addToCache(this);
      incrementLoaded();
   }
   function errorHandler() {
      incrementLoaded();
      throw new Error('Error loading ' + this.src);
   }

   for (var key in audioUrls) {
      if (key.indexOf('wav') == -1 && key.indexOf('ogg') == -1 && key.indexOf('webm') == -1) {
         continue;
      }
      countTotal++;
      var audio = new Audio();
      audio.addEventListener('canplay', successHandler, true);
      audio.addEventListener('error', errorHandler, true);
      audio.src = audioUrls[key];
      audio.gamejsKey = key;
      audio.load();
   }
   if (countTotal > 0) {
      _PRELOADING = true;
   }
   return getProgress;
};

/**
 * @ignore
 */
exports.isPreloading = function() {
   return _PRELOADING;
};

/**
 * @param {dom.ImgElement} audios the <audio> elements to put into cache
 * @ignore
 */
function addToCache(audios) {
   if (!(audios instanceof Array)) {
      audios = [audios];
   }

   var docLoc = document.location.href;
   audios.forEach(function(audio) {
      CACHE[audio.gamejsKey] = audio;
   });
   return;
}

/**
 * Sounds can be played back.
 * @constructor
 * @param {String|dom.AudioElement} uriOrAudio the uri of <audio> dom element
 *                of the sound
 */
exports.Sound = function Sound(uriOrAudio) {
   var cachedAudio;
   if (typeof uriOrAudio === 'string') {
      cachedAudio = CACHE[uriOrAudio];
   } else {
      cachedAudio = uriOrAudio;
   }
   if (!cachedAudio) {
      // TODO sync audio loading
      throw new Error('Missing "' + uriOrAudio + '", gamejs.preload() all audio files before loading');
   }

   var channels = [];
   var i = NUM_CHANNELS;
   while (i-->0) {
      var audio = new Audio();
      audio.preload = "auto";
      audio.loop = false;
      audio.src = cachedAudio.src;
      channels.push(audio);
   }
   /**
    * start the sound
    * @param {Boolean} loop whether the audio should loop for ever or not
    */
   this.play = function(loop) {
      channels.some(function(audio) {
         if (audio.ended || audio.paused) {
            audio.loop = !!loop;
            audio.play();
            return true;
         }
         return false;
      });
   };

   /**
    * Stop the sound.
    * This will stop the playback of this Sound on any active Channels.
    */
   this.stop = function() {
      channels.forEach(function(audio) {
         audio.stop();
      });
   };

   /**
    * Set volume of this sound
    * @param {Number} value volume from 0 to 1
    */
   this.setVolume = function(value) {
      channels.forEach(function(audio) {
         audio.volume = value;
      });
   };

   /**
    * @returns {Number} the sound's volume from 0 to 1
    */
   this.getVolume = function() {
      return channels[0].volume;
   };

   /**
    * @returns {Number} Duration of this sound in seconds
    */
   this.getLength = function() {
      return channels[0].duration;
   };

   return this;
};

}}, ["gamejs"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/display": function(require, exports, module) {
var Surface = require('./graphics').Surface;

/**
 * @fileoverview Methods to create, access and manipulate the display Surface.
 *
 * You can just grab the canvas element whether it exists in the DOM or not (GameJs
 * will create it if necessary):
 *
 *     var display = gamejs.display.getSurface();
 *
 * If you need to resize the canvas - although it is recommended to style it with CSS - you can
 * call the `setMode()` function, which conviniently returns the new display surface:
 *
 *     newDisplay = gamejs.display.setMode([800, 600]);
 *
 * ### Browser window gets resized
 *
 * When the canvas size is configured with CSS, the display surface might change when
 * the browser window is resized. GameJs will internally deal with this and recreate
 * the the display surface with the new size.
 *
 * You will typically not have to worry about this but if you want to get informed
 * about a display resize, you can register a callback with `gamejs.event.onDisplayResize`.
 *
 *
 * ### Flags
 *
 * For advanced uses you can set a few modes which additionally change how the display
 * behaves with regards to pixel smoothing and whether you want a fullscreen canvas with
 * or withouth the mouse pointer locked inside the window (for endless mouse movement in
 * all directions).
 *
 *
 * `gamejs.display.setMode()` understands three flags:
 *
 *   * gamejs.display.FULLSCREEN
 *   * gamejs.display.DISABLE_SMOOTHING
 *   * gamejs.display.POINTERLOCK (implies FULLSCREEN)
 *
 * For example:
 *      // disable smoothing
 *      gamejs.display.setMode([800, 600], gamejs.display.DISABLE_SMOOTHING);
 *      // disable smoothing and fullscreen
 *      gamejs.display.setMode(
               [800, 600],
               gamejs.display.DISABLE_SMOOTHING | gamejs.display.FULLSCREEN
         );
 *
 * ### Fullscreen mode
 *
 * When `setMode()` is called with the fullscreen flag then the fullscreen mode can be enabled by the
 * player by clicking on the DOM element with id "gjs-fullscreen-toggle". Browser security requires
 * that a user enables fullscreen with a "gesture" (e.g., clicking a button) and we can not enable fullscreen
 * in code.
 *
 * Fullscreen mode can be exited by many keys, e.g., anything window manager related (ALT-TAB) or ESC. A lot
 * of keys will trigger a browser information popup explaining how fullscreen mode can be exited.
 *
 * The following keys are "whitelisted" in fullscreen mode and will not trigger such a browser popup:
 *
 *  * left arrow, right arrow, up arrow, down arrow
 *  * space
 *  * shift, control, alt
 *  * page up, page down
 *  * home, end, tab, meta
 *
 *
 * ### Relevant DOM node ids accessed by this module
 *
 * You can provide your own tags with those ids
 *
 *   * gjs-canvas - the display surface
 *   * gjs-loader - loading bar
 *   * gjs-fullscreen-toggle a clickable element to enable fullscreen
 *   * gjs-canvas-wrapper this wrapper is added when in fullscreen mode
 *
 */

var CANVAS_ID = "gjs-canvas";
var LOADER_ID = "gjs-loader";
var SURFACE = null;

/**
 * Pass this flag to `gamejs.display.setMode(resolution, flags)` to disable
 * pixel smoothing; this is, for example, useful for retro-style, low resolution graphics
 * where you don't want the browser to smooth them when scaling & drawing.
 */
var DISABLE_SMOOTHING = exports.DISABLE_SMOOTHING = 2;
var FULLSCREEN = exports.FULLSCREEN = 4;
var POINTERLOCK = exports.POINTERLOCK = 8;

var _flags = 0;

/**
 * @returns {document.Element} the canvas dom element
 * @ignore
 */
var getCanvas = exports._getCanvas = function() {
   var displayCanvas = document.getElementById(CANVAS_ID);
   if (!displayCanvas) {
      displayCanvas = document.createElement("canvas");
      displayCanvas.setAttribute("id", CANVAS_ID);
      document.body.appendChild(displayCanvas);
   }
   return displayCanvas;
};


var getFullScreenToggle = function() {
   var fullScreenButton = document.getElementById('gjs-fullscreen-toggle');
   if (!fullScreenButton) {
      // before canvas
      fullScreenButton = document.createElement('button');
      fullScreenButton.innerHTML = 'Fullscreen';
      fullScreenButton.id = 'gjs-fullscreen-toggle';
      var canvas = getCanvas();
      canvas.parentNode.insertBefore(fullScreenButton, canvas);
      canvas.parentNode.insertBefore(document.createElement('br'), canvas);

   }
   return fullScreenButton;
};

var fullScreenChange = function(event) {
   var gjsEvent ={
      type: isFullScreen() ? require('./event').DISPLAY_FULLSCREEN_ENABLED :
                        require('./event').DISPLAY_FULLSCREEN_DISABLED

   };
   if (isFullScreen()) {
      if (_flags & POINTERLOCK) {
         enablePointerLock();
      }
   }
   require('./event')._triggerCallbacks(gjsEvent);
};

exports.hasPointerLock = function() {
   return !!(document.pointerLockElement ||
      document.webkitFullscreenElement ||
      document.mozFullscreenElement ||
      document.mozFullScreenElement);
};

function onResize(event) {
   var canvas = getCanvas();
   SURFACE._canvas.width = canvas.clientWidth;
   SURFACE._canvas.height = canvas.clientHeight;
   require('./event')._triggerCallbacks({
      type: require('./event').DISPLAY_RESIZE
   });
}

/**
 * Create the master Canvas plane.
 * @ignore
 */
exports.init = function() {
   // create canvas element if not yet present
   var canvas = getCanvas();
   if (!canvas.getAttribute('tabindex')) {
      // to be focusable, tabindex must be set
      canvas.setAttribute("tabindex", 1);
      canvas.focus();
   }
   // remove loader if any;
   var $loader = document.getElementById(LOADER_ID);
   if ($loader) {
      $loader.style.display = "none";
   }
   var $displaySurface = document.getElementById(CANVAS_ID);
   if ($displaySurface) {
      $displaySurface.style.display = 'block';
   }
   // hook into resize
   window.addEventListener("resize", onResize, false);
   return;
};

var isFullScreen = exports.isFullscreen = function() {
   return (document.fullScreenElement || document.mozFullScreen || document.webkitIsFullScreen || document.webkitDisplayingFullscreen);
};

/**
 * Switches the display window normal browser mode and fullscreen.
 * @ignore
 * @returns {Boolean} true if operation was successfull, false otherwise
 */
var enableFullScreen = function(event) {
   var wrapper = getCanvas();
   wrapper.requestFullScreen = wrapper.requestFullScreen || wrapper.mozRequestFullScreen || wrapper.webkitRequestFullScreen;
   if (!wrapper.requestFullScreen) {
      return false;
   }
   // @xbrowser chrome allows keboard input onl if ask for it (why oh why?)
   if (Element.ALLOW_KEYBOARD_INPUT) {
      wrapper.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
   } else {
      wrapper.requestFullScreen();
   }
   return true;
};

var enablePointerLock = function() {
   var wrapper = getCanvas();
   wrapper.requestPointerLock = wrapper.requestPointerLock || wrapper.mozRequestPointerLock || wrapper.webkitRequestPointerLock;
   if (wrapper.requestPointerLock) {
      wrapper.requestPointerLock();
   }
};

/** @ignore **/
exports._hasFocus = function() {
   return document.activeElement == getCanvas();
};

/**
 * Set the width and height of the Display. Conviniently this will
 * return the actual display Surface - the same as calling [gamejs.display.getSurface()](#getSurface)
 * later on.
 * @param {Array} dimensions [width, height] of the display surface
 * @param {Number} flags gamejs.display.DISABLE_SMOOTHING | gamejs.display.FULLSCREEN | gamejs.display.POINTERLOCK
 */
exports.setMode = function(dimensions, flags) {
   SURFACE = null;
   var canvas = getCanvas();
   canvas.width = canvas.clientWidth = dimensions[0];
   canvas.height = canvas.clientHeight = dimensions[1];

   _flags = _flags || flags;
   // @ xbrowser firefox allows pointerlock only if fullscreen
   if (_flags & POINTERLOCK) {
      _flags = _flags | FULLSCREEN;
   }
   if (_flags & FULLSCREEN) {
      // attach fullscreen toggle checkbox
      var fullScreenToggle = getFullScreenToggle();
      fullScreenToggle.removeEventListener('click', enableFullScreen, false);
      fullScreenToggle.addEventListener('click', enableFullScreen, false);
      // @@ xbrowser
      document.removeEventListener('fullScreenchange',fullScreenChange, false);
      document.removeEventListener('webkitfullscreenchange',fullScreenChange, false);
      document.removeEventListener('mozfullscreenchange',fullScreenChange, false);
      document.addEventListener('fullscreenchange', fullScreenChange, false);
      document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
      document.addEventListener('mozfullscreenchange', fullScreenChange, false);
   }
   return getSurface(dimensions);
};

/**
 * Set the Caption of the Display (document.title)
 * @param {String} title the title of the app
 * @param {gamejs.Image} icon FIXME implement favicon support
 */
exports.setCaption = function(title, icon) {
   document.title = title;
};

/** @ignore **/
exports._isSmoothingEnabled = function() {
   return !(_flags & DISABLE_SMOOTHING);
};

/**
 * The Display (the canvas element) is most likely not in the top left corner
 * of the browser due to CSS styling. To calculate the mouseposition within the
 * canvas we need this offset.
 * @see gamejs/event
 * @ignore
 *
 * @returns {Array} [x, y] offset of the canvas
 */

exports._getCanvasOffset = function() {
   var boundRect = getCanvas().getBoundingClientRect();
   return [boundRect.left, boundRect.top];
};

/**
 * Drawing on the Surface returned by `getSurface()` will draw on the screen.
 * @returns {gamejs.Surface} the display Surface
 */
var getSurface = exports.getSurface = function(dimensions) {
   if (SURFACE === null) {
      var canvas = getCanvas();
      if (dimensions === undefined) {
         dimensions = [canvas.clientWidth, canvas.clientHeight];
      }
      SURFACE = new Surface(dimensions);
      SURFACE._canvas = canvas;
      SURFACE._canvas.width = dimensions[0];
      SURFACE._canvas.height = dimensions[1];
      SURFACE._context = canvas.getContext('2d');
      if (!(_flags & DISABLE_SMOOTHING)) {
         SURFACE._smooth();
      } else {
         SURFACE._noSmooth();
      }
   }
   return SURFACE;
};

}}, ["gamejs/graphics", "gamejs/event"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/event": function(require, exports, module) {
var display = require('./display');
var Callback = require('./utils/callback').Callback;

/**
 * @fileoverview
 * Deal with mouse and keyboard events.
 *
 * You can either handle all events in one callback with `gamejs.event.onEvent()`:
 *
 *     gamejs.onEvent(function(event) {
 *        if (event.type === gamejs.event.MOUSE_UP) {
 *          gamejs.logging.info(event.pos, event.button);
 *        } else if (event.type === gamejs.event.KEY_UP) {
 *          gamejs.logging.info(event.key);
 *        }
 *     });
 *
 * Or recieve more specific callbacks, e.g. only for `KEY\_UP` with  `gamejs.event.onKeyUp()`:
 *
 *     gamejs.onKeyUp(function(event) {
 *          gamejs.logging.info(event.key);
 *     });
 *
 * All events passed to your callback are instances of `gamejs.event.Event` and have a `type` property to help
 * you distinguish between the different events. This `type` property is set to one of those constants:
 *
 *  * gamejs.event.MOUSE\_UP
 *  * gamejs.event.MOUSE\_MOTION
 *  * gamejs.event.MOUSE\_DOWN
 *  * gamejs.event.KEY\_UP
 *  * gamejs.event.KEY\_DOWN
 *  * gamejs.event.DISPLAY\_FULLSCREEN\_ENABLED
 *  * gamejs.event.DISPLAY\_FULLSCREEN\_DISABLED
 *  * gamejs.event.QUIT
 *  * gamejs.event.MOUSE_WHEEL
 *  * gamejs.event.TOUCH\_DOWN
 *  * gamejs.event.TOUCH\_UP
 *  * gamejs.event.TOUCH\_MOTION
 *
 * ### Keyboard constants
 *
 * There are also a lot of keyboard constants for ASCII. Those are all prefixed with `K\_`, e.g. `gamejs.event.K\_a` would be the "a"
 * key and `gamejs.event.K_SPACE` is the spacebar.
 *
 * ## Touch events
 *
 * Touch events do not have a single position but for all `TOUCH\_*` events you get an array of
 * `touches`, which each have their own `pos` attribute and a unique `identifier` for tracking
 * this touch across multiple `TOUCH\_MOTION` events.
 *
 * ## User defined events
 *
 * All user defined events can have the value of `gamejs.event.USEREVENT` or higher.
 * Make sure your custom event ids follow this system.
 *
 * @example
 *     gamejs.onEvent(function(event) {
 *        if (event.type === gamejs.event.MOUSE_UP) {
 *          gamejs.logging.log(event.pos, event.button);
 *        } else if (event.type === gamejs.event.KEY_UP) {
 *          gamejs.logging.log(event.key);
 *        }
 *     });
 *
 */

var _CALLBACKS = [];

/** @ignore **/
var _triggerCallbacks = exports._triggerCallbacks = function() {
  var args = arguments;
  _CALLBACKS.forEach(function(cb) {
    if (cb.type === 'all' || args[0].type === cb.type) {
      cb.callback.apply(cb.scope, args);
    }
  });
};

/*
exports.onQuit(callback)
exports.onVisiblityChange(callback)
*/

/**
 * Pass a callback function to be called when Fullscreen is enabled or disabled.
 * Inspect `event.type` to distinguis between entering and exiting fullscreen.
 *
 * @param {Function} callback to be called
 * @param {Object} scope within which the callback should be called. It's `this` during invocation. (optional)
 */
exports.onFullscreen = function(callback, scope) {
   if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
   }
   _CALLBACKS.push({
      callback: callback,
      scope: scope,
      type: exports.DISPLAY_FULLSCREEN_ENABLED
   });
   _CALLBACKS.push({
      callback: callback,
      scope: scope,
      type: exports.DISPLAY_FULLSCREEN_DISABLED
   });
};

/**
 * The function passsed to `onEvent` will be called whenever
 * any event (mouse, keyboard, etc) was triggered.
 *
 * @param {Function} callback to be called
 * @param {Object} scope within which the callback should be called. It's `this` during invocation. (optional)
 */
exports.onEvent = function(callback, scope) {
   if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
   }
  _CALLBACKS.push({
    callback: callback,
    scope: scope,
    type: 'all'
  });
};


/**
 * @param {Function} callback to be called
 * @param {Object} scope within which the callback should be called. It's `this` during invocation. (optional)
 */
exports.onDisplayResize = function(callback, scope) {
   if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
   };

  _CALLBACKS.push({
    callback: callback,
    scope: scope,
    type: exports.DISPLAY_RESIZE
  });
}

/**
 * @param {Function} callback to be called
 * @param {Object} scope within which the callback should be called. It's `this` during invocation. (optional)
 */
exports.onMouseMotion = function(callback, scope) {
   if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
   }
  _CALLBACKS.push({
    callback: callback,
    scope: scope,
    type: exports.MOUSE_MOTION
  });
};

/**
 * @param {Function} callback to be called
 * @param {Object} scope within which the callback should be called. It's `this` during invocation. (optional)
 */
exports.onMouseUp = function(callback, scope) {
   if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
   }
  _CALLBACKS.push({
    callback: callback,
    scope: scope,
    type: exports.MOUSE_UP
  });
};

/**
 * @param {Function} callback to be called
 * @param {Object} scope within which the callback should be called. It's `this` during invocation. (optional)
 */
exports.onMouseDown = function(callback, scope) {
   if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
   }
  _CALLBACKS.push({
    callback: callback,
    scope: scope,
    type: exports.MOUSE_DOWN
  });
};

/**
 * @param {Function} callback to be called
 * @param {Object} scope within which the callback should be called. It's `this` during invocation. (optional)
 */
exports.onTouchMotion = function(callback, scope) {
   if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
   }
  _CALLBACKS.push({
    callback: callback,
    scope: scope,
    type: exports.TOUCH_MOTION
  });
};

/**
 * @param {Function} callback to be called
 * @param {Object} scope within which the callback should be called. It's `this` during invocation. (optional)
 */
exports.onTouchUp = function(callback, scope) {
   if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
   }
  _CALLBACKS.push({
    callback: callback,
    scope: scope,
    type: exports.TOUCH_UP
  });
};

/**
 * @param {Function} callback to be called
 * @param {Object} scope within which the callback should be called. It's `this` during invocation. (optional)
 */
exports.onTouchDown = function(callback, scope) {
   if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
   }
  _CALLBACKS.push({
    callback: callback,
    scope: scope,
    type: exports.TOUCH_DOWN
  });
};

/**
 * @param {Function} callback to be called
 * @param {Object} scope within which the callback should be called. It's `this` during invocation. (optional)
 */
exports.onKeyDown = function(callback, scope) {
   if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
   }
  _CALLBACKS.push({
    callback: callback,
    scope: scope,
    type: exports.KEY_DOWN
  });
};

/**
 * @param {Function} callback to be called
 * @param {Object} scope within which the callback should be called. It's `this` during invocation. (optional)
 */
exports.onKeyUp = function(callback, scope) {
   if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
   }
  _CALLBACKS.push({
    callback: callback,
    scope: scope,
    type: exports.KEY_UP
  });
};

// key constants
exports.K_UP = 38;
exports.K_DOWN = 40;
exports.K_RIGHT = 39;
exports.K_LEFT = 37;

exports.K_SPACE = 32;
exports.K_BACKSPACE = 8;
exports.K_TAB = 9;
exports.K_ENTER = 13;
exports.K_SHIFT = 16;
exports.K_CTRL = 17;
exports.K_ALT = 18;
exports.K_ESC = 27;

exports.K_0 = 48;
exports.K_1 = 49;
exports.K_2 = 50;
exports.K_3 = 51;
exports.K_4 = 52;
exports.K_5 = 53;
exports.K_6 = 54;
exports.K_7 = 55;
exports.K_8 = 56;
exports.K_9 = 57;
exports.K_a = 65;
exports.K_b = 66;
exports.K_c = 67;
exports.K_d = 68;
exports.K_e = 69;
exports.K_f = 70;
exports.K_g = 71;
exports.K_h = 72;
exports.K_i = 73;
exports.K_j = 74;
exports.K_k = 75;
exports.K_l = 76;
exports.K_m = 77;
exports.K_n = 78;
exports.K_o = 79;
exports.K_p = 80;
exports.K_q = 81;
exports.K_r = 82;
exports.K_s = 83;
exports.K_t = 84;
exports.K_u = 85;
exports.K_v = 86;
exports.K_w = 87;
exports.K_x = 88;
exports.K_y = 89;
exports.K_z = 90;

exports.K_KP1 = 97;
exports.K_KP2 = 98;
exports.K_KP3 = 99;
exports.K_KP4 = 100;
exports.K_KP5 = 101;
exports.K_KP6 = 102;
exports.K_KP7 = 103;
exports.K_KP8 = 104;
exports.K_KP9 = 105;

// event type constants
exports.NOEVENT = 0;
exports.NUMEVENTS = 32000;

exports.DISPLAY_FULLSCREEN_ENABLED = 300;
exports.DISPLAY_FULLSCREEN_DISABLED = 301;
exports.DISPLAY_RESIZE = 302;

exports.QUIT = 0;
exports.KEY_DOWN = 1;
exports.KEY_UP = 2;
exports.MOUSE_MOTION = 3;
exports.MOUSE_UP = 4;
exports.MOUSE_DOWN = 5;
exports.MOUSE_WHEEL = 6;
exports.TOUCH_UP = 7;
exports.TOUCH_DOWN = 8;
exports.TOUCH_MOTION = 9;
exports.USEREVENT = 2000;



/**
 * Properties of the `event` object argument passed to the callbacks.
 * @class
 */

exports.Event = function() {
    /**
     * The type of the event. e.g., gamejs.event.QUIT, KEYDOWN, MOUSEUP.
     */
    this.type = null;
    /**
     * key the keyCode of the key. compare with gamejs.event.K_a, gamejs.event.K_b,...
     */
    this.key = null;
    /**
     * relative movement for a mousemove event
     */
    this.rel = null;
    /**
     * the number of the mousebutton pressed
     */
    this.button = null;
    /**
     * pos the position of the event for mouse events
     */
    this.pos = null;
};

/**
 * @ignore
 */
exports.init = function() {

   var lastPos = [];

   // anonymous functions as event handlers = memory leak, see MDC:elementAddEventListener

   function onMouseDown (ev) {
      var canvasOffset = display._getCanvasOffset();
      _triggerCallbacks({
         'type': exports.MOUSE_DOWN,
         'pos': [ev.clientX - canvasOffset[0], ev.clientY - canvasOffset[1]],
         'button': ev.button,
         'shiftKey': ev.shiftKey,
         'ctrlKey': ev.ctrlKey,
         'metaKey': ev.metaKey
      });
   }

   function onMouseUp (ev) {
      var canvasOffset = display._getCanvasOffset();
      _triggerCallbacks({
         'type':exports.MOUSE_UP,
         'pos': [ev.clientX - canvasOffset[0], ev.clientY - canvasOffset[1]],
         'button': ev.button,
         'shiftKey': ev.shiftKey,
         'ctrlKey': ev.ctrlKey,
         'metaKey': ev.metaKey
      });
   }

   function onKeyDown (ev) {
      var key = ev.keyCode || ev.which;
      _triggerCallbacks({
         'type': exports.KEY_DOWN,
         'key': key,
         'shiftKey': ev.shiftKey,
         'ctrlKey': ev.ctrlKey,
         'metaKey': ev.metaKey
      });

      // if the display has focus, we surpress default action
      // for most keys
      if (display._hasFocus() && (!ev.ctrlKey && !ev.metaKey &&
         ((key >= exports.K_LEFT && key <= exports.K_DOWN) ||
         (key >= exports.K_0    && key <= exports.K_z) ||
         (key >= exports.K_KP1  && key <= exports.K_KP9) ||
         key === exports.K_SPACE ||
         key === exports.K_TAB ||
         key === exports.K_ENTER)) ||
         key === exports.K_ALT ||
         key === exports.K_BACKSPACE) {
        ev.preventDefault();
      }
   }

   function onKeyUp (ev) {
      _triggerCallbacks({
         'type': exports.KEY_UP,
         'key': ev.keyCode,
         'shiftKey': ev.shiftKey,
         'ctrlKey': ev.ctrlKey,
         'metaKey': ev.metaKey
      });
   }

   function onMouseMove (ev) {
      var canvasOffset = display._getCanvasOffset();
      var currentPos = [ev.clientX - canvasOffset[0], ev.clientY - canvasOffset[1]];
      var relativePos = [];
      if (lastPos.length) {
         relativePos = [
            lastPos[0] - currentPos[0],
            lastPos[1] - currentPos[1]
         ];
      }
      _triggerCallbacks({
         'type': exports.MOUSE_MOTION,
         'pos': currentPos,
         'rel': relativePos,
         'buttons': null, // FIXME, fixable?
         'timestamp': ev.timeStamp,
         'movement': [ev.movementX       ||
                      ev.mozMovementX    ||
                      ev.webkitMovementX || 0,
                      ev.movementY       ||
                      ev.mozMovementY    ||
                      ev.webkitMovementY || 0
                      ]
      });
      lastPos = currentPos;
      return;
   }

   function onMouseScroll(ev) {
      var canvasOffset = display._getCanvasOffset();
      var currentPos = [ev.clientX - canvasOffset[0], ev.clientY - canvasOffset[1]];
      _triggerCallbacks({
         type: exports.MOUSE_WHEEL,
         pos: currentPos,
         delta: ev.detail || (- ev.wheelDeltaY / 40)
      });
      return;
   }

   function onBeforeUnload (ev) {
      _triggerCallbacks({
         'type': exports.QUIT
      });
      return;
   };

   // convert a w3c touch event into gamejs event
   function w3cTouchConvert(touchList) {
      var canvasOffset = display._getCanvasOffset();
      var tList = [];
      for (var i = 0; i < touchList.length; i++) {
         var touchEvent = touchList.item(i);
         tList.push({
            identifier: touchEvent.identifier,
            pos: [touchEvent.clientX - canvasOffset[0], touchEvent.clientY - canvasOffset[1]]
         });
      }
      return tList;
   }

   function onTouchDown(ev) {
      var canvasOffset = display._getCanvasOffset();
      var changedTouches = w3cTouchConvert(ev.changedTouches);
      _triggerCallbacks({
         'type': exports.TOUCH_DOWN,
         'touches': changedTouches
      });
   };

   function onTouchUp(ev) {
      var changedTouches = w3cTouchConvert(ev.changedTouches);
      _triggerCallbacks({
         'type': exports.TOUCH_UP,
         'touches': changedTouches,
      });
   }
   function onTouchMotion(ev) {
      var changedTouches = w3cTouchConvert(ev.changedTouches);
      _triggerCallbacks({
         'type': exports.TOUCH_MOTION,
         'touches': changedTouches
      });
      ev.preventDefault();
   }

   // IE does not support addEventListener on document itself
   // FX events don't reach body if mouse outside window or on menubar
   var canvas = display._getCanvas();
   document.addEventListener('mousedown', onMouseDown, false);
   document.addEventListener('mouseup', onMouseUp, false);
   document.addEventListener('keydown', onKeyDown, false);
   document.addEventListener('keyup', onKeyUp, false);
   document.addEventListener('mousemove', onMouseMove, false);
   canvas.addEventListener('mousewheel', onMouseScroll, false);
   // MOZFIX
   // https://developer.mozilla.org/en/Code_snippets/Miscellaneous#Detecting_mouse_wheel_events
   canvas.addEventListener('DOMMouseScroll', onMouseScroll, false);
   canvas.addEventListener('beforeunload', onBeforeUnload, false);
   // touchs
   canvas.addEventListener("touchstart", onTouchDown, false);
   canvas.addEventListener("touchend", onTouchUp, false);
   canvas.addEventListener("touchcancel", onTouchUp, false);
   canvas.addEventListener("touchleave", onTouchUp, false);
   canvas.addEventListener("touchmove", onTouchMotion, false);

};

}}, ["gamejs/display", "gamejs/utils/callback"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/font": function(require, exports, module) {
var Surface = require('./graphics').Surface;
var objects = require('./utils/objects');

/**
 * @fileoverview Methods for creating Font objects which can render text
 * to a Surface.
 *
 * @example
 * var font = new Font('20px monospace');
 * // render text - this returns a surface with the text written on it.
 * var helloSurface = font.render('Hello World')
 */

/**
 * Create a Font to draw on the screen. The Font allows you to
 * `render()` text. Rendering text returns a Surface which
 * in turn can be put on screen.
 *
 * @constructor
 * @property {Number} fontHeight the line height of this Font
 *
 * @param {String} fontSettings a css font definition, e.g., "20px monospace"
 * @param {STring} backgroundColor valid #rgb string, "#ff00cc"
 */
var Font = exports.Font = function(fontSettings, backgroundColor) {
    /**
     * @ignore
     */
   this.sampleSurface = new Surface([10,10]);
   this.sampleSurface.context.font = fontSettings;
   this.sampleSurface.context.textAlign = 'start';
   // http://diveintohtml5.org/canvas.html#text
   this.sampleSurface.context.textBaseline = 'bottom';
   this.backgroundColor = backgroundColor || false;
   return this;
};

/**
 * Returns a Surface with the given text on it.
 * @param {String} text the text to render
 * @param {String} color a valid #RGB String, "#ffcc00"
 * @returns {gamejs.Surface} Surface with the rendered text on it.
 */
Font.prototype.render = function(text, color) {
   var dims = this.size(text);
   var surface = new Surface(dims);
   var ctx = surface.context;
   ctx.save();
   if ( this.backgroundColor ) {
       ctx.fillStyle = this.backgroundColor;
       ctx.fillRect(0, 0, surface.rect.width, surface.rect.height);
   }
   ctx.font = this.sampleSurface.context.font;
   ctx.textBaseline = this.sampleSurface.context.textBaseline;
   ctx.textAlign = this.sampleSurface.context.textAlign;
   ctx.fillStyle = ctx.strokeStyle = color || "#000000";
   ctx.fillText(text, 0, surface.rect.height, surface.rect.width);
   ctx.restore();
   return surface;
};

/**
 * Determine the width and height of the given text if rendered
 * with this Font.
 * @param {String} text the text to measure
 * @returns {Array} the [width, height] of the text if rendered with this Font
 */
Font.prototype.size = function(text) {
   var metrics = this.sampleSurface.context.measureText(text);
   // FIXME measuretext is buggy, make extra wide
   return [metrics.width, this.fontHeight];
};

/**
 * Height of the font in pixels.
 */
objects.accessors(Font.prototype, {
   'fontHeight': {
      get: function() {
         // Returns an approximate line height of the text
         // »This version of the specification does not provide a way to obtain
         // the bounding box dimensions of the text.«
         // see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-measuretext
         return this.sampleSurface.context.measureText('M').width * 1.5;
      }
   }

});

}}, ["gamejs/graphics", "gamejs/utils/objects"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/graphics": function(require, exports, module) {
/**
 * @fileoverview
 * This module holds the important `Surface` class which is the general container for image data.
 *
 *     var surface = new gamejs.graphics.Surface([width, height]);
 *
 * The functions
 * to draw geometric lines like circles, lines, rectangles, etc. are also all in this module:
 *
 *     gamejs.graphics.line(surface, '#ff0000', centerPoint, radius);
 *
 * Each Surface instance has methods to create *a new* rotated, flipped, scaled, etc. instance of itself:
 *
 *     // the original `surface` remains untouched by the
 *     // filp operation. A new Surface instance
 *     // is returned by `flip()`.
 *     var horizontalFlippedSurface = surface.flip(true);
 *
 * If you want to put images (png, jpg) on the screen, also see the `gamejs.image` module and `gamejs.preload()`.
 *
 * There are several ways to specify colors. Whenever the docs says "valid #RGB string"
 * you can pass in any of the following formats: `"#ff00ff"`, `"rgb(255, 0, 255)"` or `"rgba(255, 0, 255, 1)"`.
 *
 * @see gamejs/image
 */
var gamejs = require('../gamejs');
var Rect = gamejs.Rect;
var objects = require('./utils/objects');

/**
 * transform functions
 */
var matrix = require('./math/matrix');
var vectors = require('./math/vectors');

/**
 * A Surface represents a bitmap image with a fixed width and height. The
 * most important feature of a Surface is that they can be `blitted`
 * onto each other.
 *
 * @example
 * new gamejs.graphics.Surface([width, height]);
 * new gamejs.graphics.Surface(width, height);
 * new gamejs.graphics.Surface(rect);
 * @constructor
 *
 * @param {Array} dimensions Array holding width and height
 */
var Surface = exports.Surface = function() {
   var args = gamejs.normalizeRectArguments.apply(this, arguments);
   var width = args.left;
   var height = args.top;
   // unless argument is rect:
   if (arguments.length == 1 && arguments[0] instanceof Rect) {
      width = args.width;
      height = args.height;
   }
   // only for rotatation & scale
   /** @ignore */
   this._matrix = matrix.identity();
   /** @ignore */
    this._canvas = document.createElement("canvas");
    this._canvas.width = width;
    this._canvas.height = height;
    /** @ignore */
    this._blitAlpha = 1.0;

   /** @ignore */
   this._context = this._canvas.getContext('2d');
   // using exports is weird but avoids circular require
   if (gamejs.display._isSmoothingEnabled()) {
      this._smooth();
   } else {
      this._noSmooth();
   }
   return this;
};

/** @ignore */
Surface.prototype._noSmooth = function() {
    // disable image scaling
    // see https://developer.mozilla.org/en/Canvas_tutorial/Using_images#Controlling_image_scaling_behavior
    // and https://github.com/jbuck/processing-js/commit/65de16a8340c694cee471a2db7634733370b941c
    this.context.mozImageSmoothingEnabled = false;
  this.context.webkitImageSmoothingEnabled = false;
   return;
};
/** @ignore */
Surface.prototype._smooth = function() {
  this.context.mozImageSmoothingEnabled = true;
  this.context.webkitImageSmoothingEnabled = true;

};

/**
 * Blits another Surface on this Surface. The destination where to blit to
 * can be given (or it defaults to the top left corner) as well as the
 * Area from the Surface which should be blitted (e.g., for cutting out parts of
 * a Surface).
 *
 * @example
 * // blit flower in top left corner of display
 * displaySurface.blit(flowerSurface);
 *
 * // position flower at 10/10 of display
 * displaySurface.blit(flowerSurface, [10, 10])
 *
 * // ... `dest` can also be a rect whose topleft position is taken:
 * displaySurface.blit(flowerSurface, new gamejs.Rect([10, 10]);
 *
 * // only blit half of the flower onto the display
 * var flowerRect = flowerSurface.rect;
 * flowerRect = new gamejs.Rect([0,0], [flowerRect.width/2, flowerRect.height/2])
 * displaySurface.blit(flowerSurface, [0,0], flowerRect);
 *
 * @param {gamejs.graphics.Surface} src The Surface which will be blitted onto this one
 * @param {gamejs.Rect|Array} dst the Destination x, y position in this Surface.
 *            If a Rect is given, it's top and left values are taken. If this argument
 *            is not supplied the blit happens at [0,0].
 * @param {gamesjs.Rect|Array} area the Area from the passed Surface which
 *            should be blitted onto this Surface.
 * @param {Number} compositionOperation how the source and target surfaces are composited together; one of: source-atop, source-in, source-out, source-over (default), destination-atop, destination-in, destination-out, destination-over, lighter, copy, xor; for an explanation of these values see: http://dev.w3.org/html5/2dcontext/#dom-context-2d-globalcompositeoperation
 * @returns {gamejs.Rect} Rect actually repainted FIXME actually return something?
 */
Surface.prototype.blit = function(src, dest, area, compositeOperation) {

   var rDest, rArea;

   if (dest instanceof Rect) {
      rDest = dest.clone();
      var srcSize = src.getSize();
      if (!rDest.width) {
         rDest.width = srcSize[0];
      }
      if (!rDest.height) {
         rDest.height = srcSize[1];
      }
    } else if (dest && dest instanceof Array && dest.length == 2) {
      rDest = new Rect(dest, src.getSize());
    } else {
      rDest = new Rect([0,0], src.getSize());
    }
   compositeOperation = compositeOperation || 'source-over';

   // area within src to be drawn
   if (area instanceof Rect) {
      rArea = area;
   } else if (area && area instanceof Array && area.length == 2) {
      var size = src.getSize();
      rArea = new Rect(area, [size[0] - area[0], size[1] - area[1]]);
   } else {
      rArea = new Rect([0,0], src.getSize());
   }

   if (isNaN(rDest.left) || isNaN(rDest.top) || isNaN(rDest.width) || isNaN(rDest.height)) {
      throw new Error('[blit] bad parameters, destination is ' + rDest);
   }

   this.context.save();
   this.context.globalCompositeOperation = compositeOperation;
   // first translate, then rotate
   var m = matrix.translate(matrix.identity(), rDest.left, rDest.top);
   m = matrix.multiply(m, src._matrix);
   this.context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
   // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
   this.context.globalAlpha = src._blitAlpha;
   this.context.drawImage(src.canvas, rArea.left, rArea.top, rArea.width, rArea.height, 0, 0, rDest.width, rDest.height);
   this.context.restore();
   return;
};

/**
 * @returns {Number[]} the width and height of the Surface
 */
Surface.prototype.getSize = function() {
   return [this.canvas.width, this.canvas.height];
};

/**
 * Obsolte, only here for compatibility.
 * @deprecated
 * @ignore
 * @returns {gamejs.Rect} a Rect of the size of this Surface
 */
Surface.prototype.getRect = function() {
   return new Rect([0,0], this.getSize());
};

/**
 * Fills the whole Surface with a color. Usefull for erasing a Surface.
 * @param {String} CSS color string, e.g. '#0d120a' or '#0f0' or 'rgba(255, 0, 0, 0.5)'
 * @param {gamejs.Rect} a Rect of the area to fill (defauts to entire surface if not specified)
 */
Surface.prototype.fill = function(color, rect) {
   this.context.save();
   this.context.fillStyle = color || "#000000";
   if (rect === undefined) {
       rect = new Rect(0, 0, this.canvas.width, this.canvas.height);
    }

   this.context.fillRect(rect.left, rect.top, rect.width, rect.height);
   this.context.restore();
   return;
};

/**
 * Clear the surface.
 */
Surface.prototype.clear = function(rect) {
   var size = this.getSize();
   rect = rect || new Rect(0, 0, size[0], size[1]);
   this.context.clearRect(rect.left, rect.top, rect.width, rect.height);
   return;
};

objects.accessors(Surface.prototype, {
   /**
    * @type gamejs.Rect
    */
   'rect': {
      get: function() {
         return this.getRect();
      }
   },
   /**
    * @ignore
    */
   'context': {
      get: function() {
         return this._context;
      }
   },
   'canvas': {
      get: function() {
         return this._canvas;
      }
   }
});

/**
 * @returns {gamejs.graphics.Surface} a clone of this surface
 */
Surface.prototype.clone = function() {
  var newSurface = new Surface(this.getRect());
  newSurface.blit(this);
  return newSurface;
};

/**
 * @returns {Number} current alpha value
 */
Surface.prototype.getAlpha = function() {
   return (1 - this._blitAlpha);
};

/**
 * Set the alpha value for the whole Surface. When blitting the Surface on
 * a destination, the pixels will be drawn slightly transparent.
 * @param {Number} alpha value in range 0.0 - 1.0
 * @returns {Number} current alpha value
 */
Surface.prototype.setAlpha = function(alpha) {
   if (isNaN(alpha) || alpha < 0 || alpha > 1) {
      return;
   }

   this._blitAlpha = (1 - alpha);
   return (1 - this._blitAlpha);
};

/**
 * The data must be represented in left-to-right order, row by row top to bottom,
 * starting with the top left, with each pixel's red, green, blue, and alpha components
 * being given in that order for each pixel.
 * @see http://dev.w3.org/html5/2dcontext/#canvaspixelarray
 * @returns {ImageData} an object holding the pixel image data {data, width, height}
 */
Surface.prototype.getImageData = function() {
   var size = this.getSize();
   return this.context.getImageData(0, 0, size[0], size[1]);
};



// FIXME all draw functions must return a minimal rect containing the drawn shape

/**
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color valid #RGB string, e.g., "#ff0000"
 * @param {Array} startPos [x, y] position of line start
 * @param {Array} endPos [x, y] position of line end
 * @param {Number} width of the line, defaults to 1
 */
exports.line = function(surface, color, startPos, endPos, width) {
   var ctx = surface.context;
   ctx.save();
   ctx.beginPath();
   ctx.strokeStyle = color;
   ctx.lineWidth = width || 1;
   ctx.moveTo(startPos[0], startPos[1]);
   ctx.lineTo(endPos[0], endPos[1]);
   ctx.stroke();
   ctx.restore();
   return;
};

/**
 * Draw connected lines. Use this instead of indiviudal line() calls for
 * better performance
 *
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color a valid #RGB string, "#ff0000"
 * @param {Boolean} closed if true the last and first point are connected
 * @param {Array} pointlist holding array [x,y] arrays of points
 * @param {Number} width width of the lines, defaults to 1
 */
exports.lines = function(surface, color, closed, pointlist, width) {
   closed = closed || false;
   var ctx = surface.context;
   ctx.save();
   ctx.beginPath();
   ctx.strokeStyle = ctx.fillStyle = color;
   ctx.lineWidth = width || 1;
   pointlist.forEach(function(point, idx) {
      if (idx === 0) {
         ctx.moveTo(point[0], point[1]);
      } else {
         ctx.lineTo(point[0], point[1]);
      }
   });
   if (closed) {
      ctx.lineTo(pointlist[0][0], pointlist[0][1]);
   }
   ctx.stroke();
   ctx.restore();
   return;
};

/**
 * Draw a circle on Surface
 *
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color a valid #RGB String, #ff00cc
 * @param {Array} pos [x, y] position of the circle center
 * @param {Number} radius of the circle
 * @param {Number} width width of the circle, if not given or 0 the circle is filled
 */
exports.circle = function(surface, color, pos, radius, width) {
   if (isNaN(radius)) {
      throw new Error('[circle] radius required argument');
   }
   if (!pos || !(pos instanceof Array)) {
      throw new Error('[circle] pos must be given & array' + pos);
   }

   var ctx = surface.context;
   ctx.save();
   ctx.beginPath();
   ctx.strokeStyle = ctx.fillStyle = color;
   ctx.lineWidth = width || 1;
   ctx.arc(pos[0], pos[1], radius, 0, 2*Math.PI, true);
   if (width === undefined || width === 0) {
      ctx.fill();
   } else {
      ctx.stroke();
   }
   ctx.restore();
   return;
};

/**
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color a valid #RGB String, #ff00cc
 * @param {gamejs.Rect} rect the position and dimension attributes of this Rect will be used
 * @param {Number} width the width of line drawing the Rect, if 0 or not given the Rect is filled.
 */
exports.rect = function(surface, color, rect, width) {
   var ctx =surface.context;
   ctx.save();
   ctx.beginPath();
   ctx.strokeStyle = ctx.fillStyle = color;
   if (isNaN(width) || width === 0) {
      ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
   } else {
      ctx.lineWidth = width || 1;
      ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
   }
   ctx.restore();
};

/**
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color a valid #RGB String, #ff00cc
 * @param {Array} pos [x, y] position of the circle center
 * @param {Number} startAngle, both angles in radians
 * @param {Number} stopAngle
 * @param {Number} radius
 * @param {Number} width the width of line, if 0 or not given the arc is filled.
 */
exports.arc= function(surface, color, pos, startAngle, stopAngle, radius, width) {
   var ctx = surface.context;
   ctx.save();
   ctx.beginPath();
   ctx.strokeStyle = ctx.fillStyle = color;
   ctx.arc(pos[0], pos[1],
            radius,
            startAngle, stopAngle,
            false
         );
   if (isNaN(width) || width === 0) {
      ctx.fill();
   } else {
      ctx.lineWidth = width || 1;
      ctx.stroke();
   }
   ctx.restore();
};

/**
 * Draw a polygon on the surface. The pointlist argument are the vertices
 * for the polygon.
 *
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color a valid #RGB String, #ff00cc
 * @param {Array} pointlist array of vertices [x, y] of the polygon
 * @param {Number} width the width of line, if 0 or not given the polygon is filled.
 */
exports.polygon = function(surface, color, pointlist, width) {
   var ctx = surface.context;
   ctx.save();
   ctx.fillStyle = ctx.strokeStyle = color;
   ctx.beginPath();
   pointlist.forEach(function(point, idx) {
      if (idx === 0) {
         ctx.moveTo(point[0], point[1]);
      } else {
         ctx.lineTo(point[0], point[1]);
      }
   });
   ctx.closePath();
   if (isNaN(width) || width === 0) {
      ctx.fill();
   } else {
      ctx.lineWidth = width || 1;
      ctx.stroke();
   }
   ctx.restore();
};

/**
 * Draw a quadratic curve with one control point on the surface.
 * The control point position defines the shape of the quadratic curve.
 *
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color valid #RGB string, e.g., "#ff0000"
 * @param {Array} startPos [x, y] the start position for the quadratic curve
 * @param {Array} endPos [x, y] the end position for the quadratic curve
 * @param {Array} controlPos [x, y] position of the control point
 * @param {Number} width of the quadratic curve, defaults to 1
 */
exports.quadraticCurve = function(surface, color, startPos, endPos, controlPos, width) {
   if (!startPos || !(startPos instanceof Array)) {
      throw new Error('[quadratic_curve] startPos must be defined!');
   }
   if (!endPos || !(endPos instanceof Array)) {
      throw new Error('[quadratic_curve] endPos must be defined!');
   }
   if (!controlPos || !(controlPos instanceof Array)) {
      throw new Error('[quadratic_curve] controlPos must be defined!');
   }

   var ctx = surface.context;
   ctx.save();
   ctx.fillStyle = ctx.strokeStyle = color;
   ctx.lineWidth = width || 1;

   ctx.beginPath();
   ctx.moveTo(startPos[0], startPos[1]);
   ctx.quadraticCurveTo(controlPos[0], controlPos[1], endPos[0], endPos[1]);
   ctx.stroke();

   ctx.restore();
};

/**
 * Draw a bezier curve with two control points on the surface.
 * The control point positions define the shape of the bezier curve.
 *
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color valid #RGB string, e.g., "#ff0000"
 * @param {Array} startPos [x, y] the start position for the bezier curve
 * @param {Array} endPos [x, y] the end position for the bezier curve
 * @param {Array} ct1Pos [x, y] position of the first control point
 * @param {Array} ct2Pos [x, y] position of the second control point
 * @param {Number} width of the bezier curve, defaults to 1
 */
exports.bezierCurve = function(surface, color, startPos, endPos, ct1Pos, ct2Pos, width) {
   if (!startPos || !(startPos instanceof Array)) {
      throw new Error('[bezier_curve] startPos must be defined!');
   }
   if (!endPos || !(endPos instanceof Array)) {
      throw new Error('[bezier_curve] endPos must be defined!');
   }
   if (!ct1Pos || !(ct1Pos instanceof Array)) {
      throw new Error('[bezier_curve] ct1Pos must be defined!');
   }
   if (!ct2Pos || !(ct2Pos instanceof Array)) {
      throw new Error('[bezier_curve] ct2Pos must be defined!');
   }
   var ctx = surface.context;
   ctx.save();
   ctx.fillStyle = ctx.strokeStyle = color;
   ctx.lineWidth = width || 1;

   ctx.beginPath();
   ctx.moveTo(startPos[0], startPos[1]);
   ctx.bezierCurveTo(ct1Pos[0], ct1Pos[1], ct2Pos[0], ct2Pos[1], endPos[0], endPos[1]);
   ctx.stroke();

   ctx.restore();
};

/**
 * Returns a new surface which holds this surface rotate by angle degrees.
 * Unless rotating by 90 degree increments, the image will be padded larger to hold the new size.
 * @param {angel} angle Clockwise angle by which to rotate
 * @returns {Surface} new, rotated surface
 */
Surface.prototype.rotate = function (angle) {
   var origSize = this.getSize();
   var radians = (angle * Math.PI / 180);
   var newSize = origSize;
   // find new bounding box
   if (angle % 360 !== 0) {
      var rect = this.getRect();
      var points = [
         [-rect.width/2, rect.height/2],
         [rect.width/2, rect.height/2],
         [-rect.width/2, -rect.height/2],
         [rect.width/2, -rect.height/2]
      ];
      var rotPoints = points.map(function(p) {
         return vectors.rotate(p, radians);
      });
      var xs = rotPoints.map(function(p) { return p[0]; });
      var ys = rotPoints.map(function(p) { return p[1]; });
      var left = Math.min.apply(Math, xs);
      var right = Math.max.apply(Math, xs);
      var bottom = Math.min.apply(Math, ys);
      var top = Math.max.apply(Math, ys);
      newSize = [right-left, top-bottom];
   }
   var newSurface = new Surface(newSize);
   var oldMatrix = this._matrix;
   this._matrix = matrix.translate(this._matrix, origSize[0]/2, origSize[1]/2);
   this._matrix = matrix.rotate(this._matrix, radians);
   this._matrix = matrix.translate(this._matrix, -origSize[0]/2, -origSize[1]/2);
   var offset = [(newSize[0] - origSize[0]) / 2, (newSize[1] - origSize[1]) / 2];
   newSurface.blit(this, offset);
   this._matrix = oldMatrix;
   return newSurface;
};

/**
 * Returns a new surface holding the scaled surface.
 * @param {Array} dimensions new [width, height] of surface after scaling
 * @returns {Surface} new, scaled surface
 */
Surface.prototype.scale = function(dims) {
   var width = dims[0];
   var height = dims[1];
   if (width <= 0 || height <= 0) {
      throw new Error('[gamejs.transform.scale] Invalid arguments for height and width', [width, height]);
   }
   var oldDims = this.getSize();
   var ws = width / oldDims[0];
   var hs = height / oldDims[1];
   var newSurface = new Surface([width, height]);
   var originalMatrix = this._matrix.slice(0);
   this._matrix = matrix.scale(this._matrix, [ws, hs]);
   newSurface.blit(this);
   this._matrix = originalMatrix;
   return newSurface;
};

/**
 * Flip a Surface either vertically, horizontally or both. This returns
 * a new Surface (i.e: nondestructive).
 * @param {Boolean} flipHorizontal
 * @param {Boolean} flipVertical
 * @returns {Surface} new, flipped surface
 */
Surface.prototype.flip = function(flipHorizontal, flipVertical) {
   var dims = this.getSize();
   var newSurface = new Surface(dims);
   var scaleX = 1;
   var scaleY = 1;
   var xPos = 0;
   var yPos = 0;
   if (flipHorizontal === true) {
      scaleX = -1;
      xPos = -dims[0];
   }
   if (flipVertical === true) {
      scaleY = -1;
      yPos = -dims[1];
   }
   newSurface.context.save();
   newSurface.context.scale(scaleX, scaleY);
   newSurface.context.drawImage(this.canvas, xPos, yPos);
   newSurface.context.restore();
   return newSurface;
};


/**
 * Directly copy values from an array into a Surface.
 *
 * This is faster than blitting the `surface` property on a SurfaceArray
 *
 * The array must be the same dimensions as the Surface and will completely
 * replace all pixel values.
 * @param {gamejs.graphics.Surface} surface
 * @param {gamejs.graphics.Surfacearray.SurfaceArray} surfaceArray
 */
exports.blitArray = function(surface, surfaceArray) {
   surface.context.putImageData(surfaceArray.imageData, 0, 0);
   return;
};

/**
 * Fast pixel access. The SurfaceArray can be constructed with a surface whose values
 * are then used to initialize the pixel array.
 *
 * The surface passed as argument is not modified by the SurfaceArray.
 *
 * If an array is used to construct SurfaceArray, the array must describe
 * the dimensions of the SurfaceArray [width, height].
 *
 * @example
 *
 *   // create array from display surface
 *   var srfArray = new SurfaceArray(display);
 *   // direct pixel access
 *   srfArray.set(50, 100, [255, 0, 0, 100]);
 *   console.log(srfArray.get(30, 50));
 *   // blit modified array back to display surface
 *   blitArray(display, srfArray);
 *
 * @param {gamejs.graphics.Surface|Array} surfaceOrDimensions
 * @see http://dev.w3.org/html5/2dcontext/#pixel-manipulation
 */
var SurfaceArray = exports.SurfaceArray = function(surfaceOrDimensions) {
   var size = null;
   var data = null;
   var imageData = null;

   /**
    * Set rgba value at position x, y.
    *
    * For performance reasons this function has only one signature
    * being Number, Number, Array[4].
    *
    * @param {Number} x x position of pixel
    * @param {Number} y y position of pixel
    * @param {Array} rgba [red, green, blue, alpha] values [255, 255, 255, 255] (alpha, the last argument defaults to 255)
    * @throws Error if x, y out of range
    */
   this.set = function(x, y, rgba) {
      var offset = (x * 4) + (y * size[0] * 4);
      /** faster without
      if (offset + 3 >= data.length || x < 0 || y < 0) {
         throw new Error('x, y out of range', x, y);
      }
      **/
      data[offset] = rgba[0];
      data[offset+1] = rgba[1];
      data[offset+2] = rgba[2];
      data[offset+3] = rgba[3] === undefined ? 255 : rgba[3];
      return;
   };

   /**
    * Get rgba value at position xy,
    * @param {Number} x
    * @param {Number} y
    * @returns {Array} [red, green, blue, alpha]
    */
   this.get = function(x, y) {
      var offset = (x * 4) + (y * size[0] * 4);
      return [
         data[offset],
         data[offset+1],
         data[offset+2],
         data[offset+3]
      ];
   };

   /**
    * a new gamejs.graphics.Surface on every access, representing
    * the current state of the SurfaceArray.
    * @type {gamejs.graphics.Surface}
    */
   // for jsdoc only
   this.surface = null;

   objects.accessors(this, {
      surface: {
         get: function() {
            var s = new gamejs.graphics.Surface(size);
            s.context.putImageData(imageData, 0, 0);
            return s;
         }
      },
      imageData: {
         get: function() {
            return imageData;
         }
      }
   });

   this.getSize = function() {
      return size;
   };

   /**
    * constructor
    */
   if (surfaceOrDimensions instanceof Array) {
      size = surfaceOrDimensions;
      imageData = gamejs.display.getSurface().context.createImageData(size[0], size[1]);
      data = imageData.data;
   } else {
      size = surfaceOrDimensions.getSize();
      imageData = surfaceOrDimensions.getImageData(0, 0, size[0], size[1]);
      data = imageData.data;
   }
   return this;
};

}}, ["gamejs", "gamejs/utils/objects", "gamejs/math/matrix", "gamejs/math/vectors"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/http": function(require, exports, module) {
/**
 * @fileoverview Make synchronous http requests to your game's serverside component.
 *
 * If you configure a ajax base URL you can make http requests to your
 * server using those functions.

 * The most high-level functions are `load()` and `save()` which take
 * and return a JavaScript object, which they will send to / recieve from
 * the server-side in JSON format.
 *
 *
 */

/**
 * Response object returned by http functions `get` and `post`. This
 * class is not instantiable.
 *
 * @param{String} responseText
 * @param {String} responseXML
 * @param {Number} status
 * @param {String} statusText
 */
exports.Response = function() {
   /**
    * @param {String} header
    */
   this.getResponseHeader = function(header)  {
   };
   throw new Error('response class not instantiable');
};

/**
 * Make http request to server-side
 * @param {String} method http method
 * @param {String} url
 * @param {String|Object} data
 * @param {String|Object} type "Accept" header value
 * @return {Response} response
 */
var ajax = exports.ajax = function(method, url, data, type) {
   data = data || null;
   var response = new XMLHttpRequest();
   response.open(method, url, false);
   if (type) {
      response.setRequestHeader("Accept", type);
   }
   if (data instanceof Object) {
      data = JSON.stringify(data);
      response.setRequestHeader('Content-Type', 'application/json');
   }
   response.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
   response.send(data);
   return response;
};

/**
 * Make http GET request to server-side
 * @param {String} url
 */
var get = exports.get = function(url) {
   return ajax('GET', url);
};

/**
 * Make http POST request to server-side
 * @param {String} url
 * @param {String|Object} data
 * @param {String|Object} type "Accept" header value
 * @returns {Response}
 */
var post = exports.post = function(url, data, type) {
   return ajax('POST', url, data, type);
};

function stringify(response) {
   /* jshint ignore:start */
   return eval('(' + response.responseText + ')');
   /* jshint ignore:end */
}

function ajaxBaseHref() {
    return (window.$g && window.$g.ajaxBaseHref) || './';
}

/**
 * Load an object from the server-side.
 * @param {String} url
 * @return {Object} the object loaded from the server
 */
exports.load = function(url) {
   return stringify(get(ajaxBaseHref() + url));
};

/**
 * Send an object to a server-side function.
 * @param {String} url
 * @param {String|Object} data
 * @param {String|Object} type "Accept" header value
 * @returns {Object} the response object
 */
exports.save = function(url, data, type) {
   return stringify(post(ajaxBaseHref() + url, {payload: data}, type));
};

}}, []);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/image": function(require, exports, module) {
var gamejs = require('../gamejs');

/**
 * @fileoverview Load images as Surfaces.
 *
 * Sounds & Images are loaded relative to your game's html page
 * (the html which includes the GameJs code) or relative to the
 * property `window.$g.resourceBaseHref`
 * if it is set.
 *
 *
 */

var CACHE = {};

/**
 * need to export preloading status for require
 * @ignore
 */
var _PRELOADING = false;

/**
 * Load image and return it on a Surface.
 *
 * All images must be preloaded before they can be used.
 * @example

 *     gamejs.preload(["./images/ship.png", "./images/sunflower.png"]);
 *     // ...later...
 *     display.blit(gamejs.image.load('images/ship.png'))
 *
 * @param {String|dom.Image} uriOrImage resource uri for image
 * @returns {gamejs.graphics.Surface} surface with the image on it.
 */
exports.load = function(key) {
   var img;
   if (typeof key === 'string') {
      img = CACHE[key];
      if (!img) {
			throw new Error('Missing "' + key + '", gamejs.preload() all images before trying to load them.');
      }
   } else {
      img = key;
   }
   var canvas = document.createElement('canvas');
   // IEFIX missing html5 feature naturalWidth/Height
   canvas.width = img.naturalWidth || img.width;
   canvas.height = img.naturalHeight || img.height;
   var context = canvas.getContext('2d');
   context.drawImage(img, 0, 0);
   img.getSize = function() { return [img.naturalWidth, img.naturalHeight]; };
   var surface = new gamejs.graphics.Surface(img.getSize());
   // NOTE hack setting protected _canvas directly
   surface._canvas = canvas;
   surface._context = context;
   return surface;
};


/**
 * add all images on the currrent page into cache
 * @ignore
 */
exports.init = function() {
   return;
};

/**
 * preload the given img URIs
 * @returns {Function} which returns 0-1 for preload progress
 * @ignore
 */
exports.preload = function(imgIdents) {

   var countLoaded = 0;
   var countTotal = 0;

   function incrementLoaded() {
      countLoaded++;
      if (countLoaded == countTotal) {
         _PRELOADING = false;
      }
      if (countLoaded % 10 === 0) {
         gamejs.logging.debug('gamejs.image: preloaded  ' + countLoaded + ' of ' + countTotal);
      }
   }

   function getProgress() {
      return countTotal > 0 ? countLoaded / countTotal : 1;
   }

   function successHandler() {
      addToCache(this);
      incrementLoaded();
   }
   function errorHandler() {
      incrementLoaded();
      throw new Error('Error loading ' + this.src);
   }

   var key;
   for (key in imgIdents) {
      var lowerKey = key.toLowerCase();
      if (lowerKey.indexOf('.png') == -1 &&
            lowerKey.indexOf('.jpg') == -1 &&
            lowerKey.indexOf('.jpeg') == -1 &&
            lowerKey.indexOf('.svg') == -1 &&
            lowerKey.indexOf('.gif') == -1) {
         continue;
      }
      var img = new Image();
      img.addEventListener('load', successHandler, true);
      img.addEventListener('error', errorHandler, true);
      img.src = imgIdents[key];
      img.gamejsKey = key;
      countTotal++;
   }
   if (countTotal > 0) {
      _PRELOADING = true;
   }
   return getProgress;
};

/**
 * add the given <img> dom elements into the cache.
 * @private
 */
var addToCache = function(img) {
   CACHE[img.gamejsKey] = img;
   return;
};

}}, ["gamejs"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/logging": function(require, exports, module) {

/**
 * @fileoverview Static methods for logging and setting the log level. All logging functions (`info()`, `debug()`, etc.) take
 * any number of arguments and will print them in one line.
 *
 */

var DEBUG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
var debugLevel = 2;
var gamejs = require('../gamejs');

/**
 * set logLevel as string or number
 *   * 0 = info
 *   * 1 = warn
 *   * 2 = error
 *   * 3 = fatal
 *
 * @example
 * gamejs.setLogLevel(0); // debug
 * gamejs.setLogLevel('error'); // equal to setLogLevel(2)
 */
exports.setLogLevel = function(logLevel) {
   if (typeof logLevel === 'string' && DEBUG_LEVELS.indexOf(logLevel)) {
      debugLevel = DEBUG_LEVELS.indexOf(logLevel);
   } else if (typeof logLevel === 'number') {
      debugLevel = logLevel;
   } else {
      throw new Error('invalid logLevel ', logLevel, ' Must be one of: ', DEBUG_LEVELS);
   }
   return debugLevel;
};

/**
 * Log a msg to the console if console is enable
 * @param {String} message,... the msg to log
 */
var log = exports.log = function() {

   if (gamejs.thread.inWorker === true) {
      gamejs.thread._logMessage.apply(null, arguments);
      return;
   }

   // IEFIX can't call apply on console
   var args = Array.prototype.slice.apply(arguments, [0]);
   args.unshift(Date.now());
   if (window.console !== undefined && console.log.apply) {
      console.log.apply(console, args);
   }
};
/**
 * @param {String} message,... to log
 */
exports.debug = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('debug')) {
      log.apply(this, arguments);
   }
};
/**
 * @param {String} message,... to log
 */
exports.info = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('info')) {
      log.apply(this, arguments);
   }
};
/**
 * @param {String} message,... to log
 */
exports.warn = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('warn')) {
      log.apply(this, arguments);
   }
};
/**
 * @param {String} message,... to log
 */
exports.error = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('error')) {
      log.apply(this, arguments);
   }
};
/**
 * @param {String} message to log
 */
exports.fatal = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('fatal')) {
      log.apply(this, arguments);
   }
};

}}, ["gamejs"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/math/angles": function(require, exports, module) {
/**
 * @fileoverview Degrees and radians.
 *
 */

/**
 *
 * absolute angle to relative angle, in degrees
 * @param {Number} absolute angle in degrees
 * @returns {Number} relative angle in degrees
 */
exports.normaliseDegrees=function(degrees){
    degrees=degrees % 360;
    if(degrees<0) {
        degrees+=360;
    }
    return degrees;
};

/**
 *
 * absolute angle to relative angle, in radians
 * @param {Number} absolute angle in radians
 * @returns {Number} relative angle in radians
 */
exports.normaliseRadians=function(radians){
    radians=radians % (2*Math.PI);
    if(radians<0) {
        radians+=(2*Math.PI);
    }
    return radians;
};

/**
 *
 * convert radians to degrees
 * @param {Number} radians
 * @returns {Number} degrees
 */
exports.degrees=function(radians) {
    return radians*(180/Math.PI);
};

/**
 *
 * convert degrees to radians
 * @param {Number} degrees
 * @returns {Number} radians
 */
exports.radians=function(degrees) {
    return degrees*(Math.PI/180);
};

}}, []);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/math/binaryheap": function(require, exports, module) {
/**
 * @fileoverview Binary Heap implementation from Eloquent JavaScript
 *
 * @see http://eloquentjavascript.net/appendix2.html
 */
var BinaryHeap = exports.BinaryHeap = function(scoreFunction){
   /**
    * @ignore
    */
   this.content = [];
   /**
    * @ignore
    */
   this.scoreFunction = scoreFunction;
   return this;
};

/**
 * Add element to heap.
 * @param {Object} element
 */
BinaryHeap.prototype.push = function(element) {
   this.content.push(element);
   this.sinkDown(this.content.length - 1);
   return;
};

/**
 * Return first element from heap.
 * @param {Object} element
 * @returns {Object} element
 */
BinaryHeap.prototype.pop = function() {
   // Store the first element so we can return it later.
   var result = this.content[0];
   // Get the element at the end of the array.
   var end = this.content.pop();
   // If there are any elements left, put the end element at the
   // start, and let it bubble up.
   if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
   }
   return result;
};

/**
 * Remove the given element from the heap.
 * @param {Object} element
 * @throws {Error} if node not found
 * @returns true if the node was round and removed or fals otherwise
 */
BinaryHeap.prototype.remove = function(node) {
   // To remove a value, we must search through the array to find
   // it.
   var isFound = this.content.some(function(cNode, idx) {
      if (cNode == node) {
         var end = this.content.pop();
         if (idx != this.content.length) {
            this.content[idx] = end;
            if (this.scoreFunction(end) < this.scoreFunction(node)) {
               this.sinkDown(idx);
            } else {
               this.bubbleUp(idx);
            }
         }
         return true;
      }
      return false;
   }, this);
   return isFound;
};

/**
 * Number of elements in heap.
 */
BinaryHeap.prototype.size = function() {
   return this.content.length;
};

/**
 * @ignore
 */
BinaryHeap.prototype.sinkDown = function(idx) {
   // Fetch the element that has to be sunk
   var element = this.content[idx];
   // When at 0, an element can not sink any further.
   while (idx > 0) {
      // Compute the parent element's index, and fetch it.
      var parentIdx = Math.floor((idx + 1) / 2) - 1;
      var parent = this.content[parentIdx];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
         this.content[parentIdx] = element;
         this.content[idx] = parent;
         // Update 'n' to continue at the new position.
         idx = parentIdx;
      // Found a parent that is less, no need to sink any further.
      } else {
         break;
      }
   }
   return;
};

/**
 * @ignore
 */
BinaryHeap.prototype.bubbleUp = function(idx) {
   // Look up the target element and its score.
   var length = this.content.length;
   var element = this.content[idx];
   var elemScore = this.scoreFunction(element);

   while(true) {
      // Compute the indices of the child elements.
      var child2Idx = (idx + 1) * 2;
      var child1Idx= child2Idx - 1;
      // This is used to store the new position of the element,
      // if any.
      var swapIdx = null;
      // If the first child exists (is inside the array)...
      var child1Score;
      if (child1Idx < length) {
         // Look it up and compute its score.
         var child1 = this.content[child1Idx];
         child1Score = this.scoreFunction(child1);
         // If the score is less than our element's, we need to swap.
         if (child1Score < elemScore) {
            swapIdx = child1Idx;
         }
      }
      // Do the same checks for the other child.
      if (child2Idx < length) {
         var child2 = this.content[child2Idx];
         var child2Score = this.scoreFunction(child2);
         if (child2Score < (swapIdx === null ? elemScore : child1Score)) {
            swapIdx = child2Idx;
         }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swapIdx !== null) {
         this.content[idx] = this.content[swapIdx];
         this.content[swapIdx] = element;
         idx = swapIdx;
      // Otherwise, we are done.
      } else {
         break;
      }
   }
   return;
};

}}, []);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/math/matrix": function(require, exports, module) {
/**
 * @fileoverview Matrix manipulation, used by GameJs itself. You
 * probably do not need this unless you manipulate a Context's transformation
 * matrix yourself.
 */

// correct way to do scale, rotate, translate
// *  gamejs.utils.matrix will be used in gamejs.transforms, modifing the surfaces.matrix
// * this matrix must be applied to the context in Surface.draw()

/**
 * @returns {Array} [1, 0, 0, 1, 0, 0]
 */
var identiy = exports.identity = function () {
   return [1, 0, 0, 1, 0, 0];
};

/**
 * @param {Array} matrix
 * @param {Array} matrix
 * @returns {Array} matrix sum
 */
var add = exports.add = function(m1, m2) {
   return [
      m1[0] + m2[0],
      m1[1] + m2[1],
      m1[2] + m2[2],
      m1[3] + m2[3],
      m1[4] + m2[4],
      m1[5] + m2[5],
      m1[6] + m2[6]
   ];
};

/**
 * @param {Array} matrix A
 * @param {Array} matrix B
 * @returns {Array} matrix product
 */
var multiply = exports.multiply = function(m1, m2) {
   return [
      m1[0] * m2[0] + m1[2] * m2[1],
      m1[1] * m2[0] + m1[3] * m2[1],
      m1[0] * m2[2] + m1[2] * m2[3],
      m1[1] * m2[2] + m1[3] * m2[3],
      m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
      m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
   ];
};

/**
 * @param {Array} matrix
 * @param {Number} dx
 * @param {Number} dy
 * @returns {Array} translated matrix
 */
var translate = exports.translate = function(m1, dx, dy) {
   return multiply(m1, [1, 0, 0, 1, dx, dy]);
};

/**
 * @param {Array} matrix
 * @param {Number} angle in radians
 * @returns {Array} rotated matrix
 */
var rotate = exports.rotate = function(m1, angle) {
   // radians
   var sin = Math.sin(angle);
   var cos = Math.cos(angle);
   return multiply(m1, [cos, sin, -sin, cos, 0, 0]);
};

/**
 * @param {Array} matrix
 * @returns {Number} rotation in radians
 */
var rotation = exports.rotation = function(m1) {
      return Math.atan2(m1[1], m1[0]);
};

/**
 * @param {Array} matrix
 * @param {Array} vector [a, b]
 * @returns {Array} scaled matrix
 */
var scale = exports.scale = function(m1, svec) {
   var sx = svec[0];
   var sy = svec[1];
   return multiply(m1, [sx, 0, 0, sy, 0, 0]);
};

}}, []);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/math/noise": function(require, exports, module) {
/**
 * @fileoverview
 * A noise generator comparable to Perlin noise, which is useful
 * for generating procedural content.
 *
 * This implementation provides 2D and 3D noise:
 *
 *    var simplex = new Simplex();
 *    simplex.get(2, 4);
 *    simple.get3d(1, 2, 4);
 *
 * You can optionally
 * pass a seedable pseudo-random number generator to its constructor. This
 * generator object is assumed to have a `random()` method; `Math` is used
 * per default:
 *
 *     var Alea = require('gamejs/math/random').Alea;
 *     var simplex = new Simplex(new Alea());
 *
 * Also see `gamejs/math/random` for a seedable pseudo random number generator
 *
 * @see gamejs/utils/prng
 */

// Ported to JS by by zz85 <https://github.com/zz85> from Stefan
// Gustavson's java implementation
// <http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf>
// Read Stefan's excellent paper for details on how this code works.
//
// Sean McCullough banksean@gmail.com

/**
 * @param {Object} randomNumberGenerator the random number generator to use; most provide `random()` method
 * @usage
 *  var simplex = new gamejs.noise.Simplex();
 *  simplex.get(x, y);
 *  // or for 3d noise
 *  simple.get(x, y, y);
 */

var Simplex = exports.Simplex = function(r) {
  if (r === undefined) {
    r = Math;
  }
  /** @ignore */
  this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
               [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
               [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
  /** @ignore */
  this.p = [];
  var i;
  for (i=0; i<256; i++) {
   this.p[i] = Math.floor(r.random()*256);
  }
  // To remove the need for index wrapping, double the permutation table length
  /** @ignore */
  this.perm = [];
  for(i=0; i<512; i++) {
    this.perm[i]=this.p[i & 255];
  }

  // A lookup table to traverse the simplex around a given point in 4D.
  // Details can be found where this table is used, in the 4D noise method.
  /** @ignore */
  this.simplex = [
    [0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],
    [0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],
    [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
    [1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],
    [1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],
    [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
    [2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],
    [2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]];
};

/** @ignore */
Simplex.prototype.dot = function(g, x, y) {
   return g[0]*x + g[1]*y;
};

/**
 * @param {Number} x
 * @param {Number} y
 * @returns {Number} noise for given position, in range [-1, 1]
 */
Simplex.prototype.get = function(xin, yin) {
  var n0, n1, n2; // Noise contributions from the three corners
  // Skew the input space to determine which simplex cell we're in
  var F2 = 0.5*(Math.sqrt(3.0)-1.0);
  var s = (xin+yin)*F2; // Hairy factor for 2D
  var i = Math.floor(xin+s);
  var j = Math.floor(yin+s);
  var G2 = (3.0-Math.sqrt(3.0))/6.0;
  var t = (i+j)*G2;
  var X0 = i-t; // Unskew the cell origin back to (x,y) space
  var Y0 = j-t;
  var x0 = xin-X0; // The x,y distances from the cell origin
  var y0 = yin-Y0;
  // For the 2D case, the simplex shape is an equilateral triangle.
  // Determine which simplex we are in.
  var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
  if(x0>y0) {i1=1; j1=0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
  else {i1=0; j1=1;} // upper triangle, YX order: (0,0)->(0,1)->(1,1)
  // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
  // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
  // c = (3-sqrt(3))/6
  var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
  var y1 = y0 - j1 + G2;
  var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
  var y2 = y0 - 1.0 + 2.0 * G2;
  // Work out the hashed gradient indices of the three simplex corners
  var ii = i & 255;
  var jj = j & 255;
  var gi0 = this.perm[ii+this.perm[jj]] % 12;
  var gi1 = this.perm[ii+i1+this.perm[jj+j1]] % 12;
  var gi2 = this.perm[ii+1+this.perm[jj+1]] % 12;
  // Calculate the contribution from the three corners
  var t0 = 0.5 - x0*x0-y0*y0;
  if(t0<0) {
    n0 = 0.0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0); // (x,y) of grad3 used for 2D gradient
  }
  var t1 = 0.5 - x1*x1-y1*y1;
  if(t1<0) {
    n1 = 0.0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
  }
  var t2 = 0.5 - x2*x2-y2*y2;
  if(t2<0) {
    n2 = 0.0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
  }
  // Add contributions from each corner to get the final noise value.
  // The result is scaled to return values in the interval [-1,1].
  return 70.0 * (n0 + n1 + n2);
};


/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} y
 * @returns {Number} noise for given position, in range [-1, 1]
 */
Simplex.prototype.get3d = function(xin, yin, zin) {
  var n0, n1, n2, n3; // Noise contributions from the four corners
  // Skew the input space to determine which simplex cell we're in
  var F3 = 1.0/3.0;
  var s = (xin+yin+zin)*F3; // Very nice and simple skew factor for 3D
  var i = Math.floor(xin+s);
  var j = Math.floor(yin+s);
  var k = Math.floor(zin+s);
  var G3 = 1.0/6.0; // Very nice and simple unskew factor, too
  var t = (i+j+k)*G3;
  var X0 = i-t; // Unskew the cell origin back to (x,y,z) space
  var Y0 = j-t;
  var Z0 = k-t;
  var x0 = xin-X0; // The x,y,z distances from the cell origin
  var y0 = yin-Y0;
  var z0 = zin-Z0;
  // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
  // Determine which simplex we are in.
  var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
  var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
  if(x0>=y0) {
    if(y0>=z0)
      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; } // X Y Z order
      else if(x0>=z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; } // X Z Y order
      else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; } // Z X Y order
    }
  else { // x0<y0
    if(y0<z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; } // Z Y X order
    else if(x0<z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; } // Y Z X order
    else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; } // Y X Z order
  }
  // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
  // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
  // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
  // c = 1/6.
  var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
  var y1 = y0 - j1 + G3;
  var z1 = z0 - k1 + G3;
  var x2 = x0 - i2 + 2.0*G3; // Offsets for third corner in (x,y,z) coords
  var y2 = y0 - j2 + 2.0*G3;
  var z2 = z0 - k2 + 2.0*G3;
  var x3 = x0 - 1.0 + 3.0*G3; // Offsets for last corner in (x,y,z) coords
  var y3 = y0 - 1.0 + 3.0*G3;
  var z3 = z0 - 1.0 + 3.0*G3;
  // Work out the hashed gradient indices of the four simplex corners
  var ii = i & 255;
  var jj = j & 255;
  var kk = k & 255;
  var gi0 = this.perm[ii+this.perm[jj+this.perm[kk]]] % 12;
  var gi1 = this.perm[ii+i1+this.perm[jj+j1+this.perm[kk+k1]]] % 12;
  var gi2 = this.perm[ii+i2+this.perm[jj+j2+this.perm[kk+k2]]] % 12;
  var gi3 = this.perm[ii+1+this.perm[jj+1+this.perm[kk+1]]] % 12;
  // Calculate the contribution from the four corners
  var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
  if(t0<0) {
    n0 = 0.0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0);
  }
  var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
  if(t1<0) {
    n1 = 0.0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1);
  }
  var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
  if(t2<0) {
    n2 = 0.0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2);
  }
  var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
  if(t3<0) {
    n3 = 0.0;
  } else {
    t3 *= t3;
    n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3);
  }
  // Add contributions from each corner to get the final noise value.
  // The result is scaled to stay just inside [-1,1]
  return 32.0*(n0 + n1 + n2 + n3);
};

}}, ["gamejs/math/random"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/math/random": function(require, exports, module) {
/**
 * @fileoverview A seedable random-number generator.
 *
 * A generator is initialized by GameJs and can be used with the
 * static functions of this module:
 *
 *    gamejs.random.choose([1,2,4]);
 *    // integet between and including 2 and 5
 *    gamejs.random.integer(2, 5);
 *
 * You can re-initialize this generator with a different seed by
 * calling `gamejs.utils.prng.init(seed)` after which the static
 * functions in this module will use the new seed.
 *
 * @usage
 *  var prng = require('gamejs/math/random');
 *  prng.random(); // 0.6765871671959758
 *  prng.integer(2, 10); // 5
 *  prng.choose([1,2,3,4,5]); // 3
 */
// From http://baagoe.com/en/RandomMusings/javascript/
// Johannes Baagøe <baagoe@baagoe.com>, 2010
// API modified by Simon Oberhammer <simon@nekapuzer.at>, 2012
// discussion of the used algorithms <http://baagoe.org/en/w/index.php/Better_random_numbers_for_javascript>


/** @ignore **/
var Mash = function Mash() {
  var n = 0xefc8249d;
  this.hash = function(data) {
    data = data.toString();
    var i;
    for (i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  this.version = 'Mash 0.9';
  return this;
};

/**
 * A seedable pseudo-random number generator.
 * @param {Number|String} seed the seed for generating the numbers
 *
 * @usage
 *  var prng = require('gamejs/math/random');
 *  var seed = 'gamejs';
 *  var alea = new prng.Alea(seed);
 *  alea.random(); // 0.6765871671959758
 *  alea.random(); // 0.15881546027958393
 *
 *  // generator with the same seed will generate the same sequence
 *  // of numbers:
 *  var aleaTwo = new prng.Alea(seed);
 *  aleaTwo.random(); // 0.6765871671959758
 *  aleaTwo.random(); // 0.15881546027958393
 */
var Alea = exports.Alea = function Alea() {
   var args = Array.prototype.slice.call(arguments);
   var s0 = 0;
   var s1 = 0;
   var s2 = 0;
   var c = 1;
   if (args.length === 0 || !args[0]) {
     args = [Date.now()];
   }
   var mash = new Mash();
   s0 = mash.hash(' ');
   s1 = mash.hash(' ');
   s2 = mash.hash(' ');

   var i;
   for (i = 0; i < args.length; i++) {
     s0 -= mash.hash(args[i]);
     if (s0 < 0) {
       s0 += 1;
     }
     s1 -= mash.hash(args[i]);
     if (s1 < 0) {
       s1 += 1;
     }
     s2 -= mash.hash(args[i]);
     if (s2 < 0) {
       s2 += 1;
     }
   }
   mash = null;

   /**
    * @returns {Number} the next random number as determined by the seed
    */
   this.random = function() {
     var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
     s0 = s1;
     s1 = s2;
     s2 = t - (c = t | 0);
     return s2;
   };
   this.integer = function(min, max) {
     return min + parseInt(this.random() * (max-min+1), 10);
   };
   this.vector = function(min, max) {
      return [this.integer(min[0], max[0]), this.integer(min[1], max[1])];
   };
   this.choose = function(items) {
      return items[this.integer(0, items.length-1)];
   };
   return this;
};

// alea instance per gamejs instance
var alea = null;

/**
 * @param {Number} min
 * @param {Number} max
 * @returns {Number} random integer between min and max
 */
var integer = exports.integer = function(min, max){
    return alea.integer(min, max);
};

/**
 * @param {Array} minVector 2 integers, the minimum vector
 * @param {Array} maxVector 2 integers, the maximum vector
 * @returns {Array} a random vector [min[0]<=x<=max[0], min[1]<=y<=max[1]]
 */
exports.vector = function(min, max){
    return alea.vector(min, max);
};

/**
 * @param {Array} items
 * @returns {Object} random item from items list
 */
exports.choose = function(items){
    return alea.choose(items);
};

/**
 * @returns {Number} next random float between 0 and 1
 */
exports.random = function() {
  return alea.random();
};

/**
 * Re-initialize the per instance random number generator used
 * in the static functions on this module (e.g. vector())
 * @param {Number|String} seed
 */
exports.init = function(seed) {
  alea = new Alea(seed);
};
}}, ["gamejs/math/random"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/math/vectors": function(require, exports, module) {
/**
 * Vector operations.

 */
var angles = require('./angles');

/**
 * @param {Array} origin point [b0, b1]
 * @param {Array} target point [b0, b1]
 * @returns {Number} distance between two points
 */
exports.distance = function(a, b) {
   return len(subtract(a, b));
};

/**
 * subtracts vectors [a0, a1] - [a0, a1]
 * @param {Array} a
 * @param {Array} b
 * @returns {Array} vector
 */
var subtract = exports.subtract = function(a, b) {
   return [a[0] - b[0], a[1] - b[1]];
};

/**
 * adds vectors [a0, a1] - [a0, a1]
 * @param {Array} a vector
 * @param {Array} b vector
 * @returns {Array} vector
 */
var add = exports.add = function(a, b) {
   return [a[0] + b[0], a[1] + b[1]];
};

/**
 * multiply vector with scalar or other vector
 * @param {Array} vector [v0, v1]
 * @param {Number|Array} vector or number
 * @returns {Number|Array} result
 */
var multiply = exports.multiply = function(a, s) {
   if (typeof s === 'number') {
      return [a[0] * s, a[1] * s];
   }

   return [a[0] * s[0], a[1] * s[1]];
};

/**
 * @param {Array} a vector
 * @param {Number} s
 */
exports.divide = function(a, s) {
   if (typeof s === 'number') {
      return [a[0] / s, a[1] / s];
   }
   throw new Error('only divide by scalar supported');
};

/**
 * @param {Array} vector [v0, v1]
 * @returns {Number} length of vector
 */
var len = exports.len = function(v) {
   return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
};

/**
 *
 * normalize vector to unit vector
 * @param {Array} vector [v0, v1]
 * @returns {Array} unit vector [v0, v1]
 */
var unit = exports.unit = function(v) {
   var l = len(v);
   if(l) {
      return [v[0] / l, v[1] / l];
   }
   return [0, 0];
};

/**
 *
 * rotate vector
 * @param {Array} vector [v0, v1]
 * @param {Number} angle to rotate vector by, radians. can be negative
 * @returns {Array} rotated vector [v0, v1]
 */
exports.rotate=function(v, angle){
   angle=angles.normaliseRadians(angle);
   return [v[0]* Math.cos(angle)-v[1]*Math.sin(angle),
           v[0]* Math.sin(angle)+v[1]*Math.cos(angle)];

};

/**
 *
 * calculate vector dot product
 * @param {Array} vector [v0, v1]
 * @param {Array} vector [v0, v1]
 * @returns {Number} dot product of v1 and v2
 */
var dot = exports.dot=function(v1, v2){
   return (v1[0] * v2[0]) + (v1[1] * v2[1]);
};

/**
 *
 * calculate angle between vectors
 * @param {Array} vector [v0, v1]
 * @param {Array} vector [v0, v1]
 * @returns {Number} angle between v1 and v2 in radians
 */
exports.angle=function(v1, v2){
   var perpDot = v1[0] * v2[1] - v1[1] * v2[0];
   return Math.atan2(perpDot, dot(v1,v2));
};

/**
 * @returns {Array} vector with max length as specified.
 */
exports.truncate = function(v, maxLength) {
   if (len(v) > maxLength) {
      return multiply(unit(v), maxLength);
   }
   return v;
};


/**
 * @returns the center of multipled 2d points
 * @param {Array} first point
 * @param {Array} second point
 * @param {Array} ...
 */
exports.centroid = function() {
   var args = Array.prototype.slice.apply(arguments, [0]);
   var c = [0,0];
   args.forEach(function(p) {
      c[0] += parseInt(p[0], 10);
      c[1] += parseInt(p[1], 10);
   });
   var len = args.length;
   return [
      c[0] / len,
      c[1] / len
   ];
};

}}, ["gamejs/math/angles"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/pathfinding": function(require, exports, module) {
/**
 * @fileoverview
 * A* path finding algorithm
 *
 * Use the `findRoute(map, from, to, [timeout])` function to get the linked list
 * leading `from` a point `to` another on the given `map`.
 *
 * The map must implement the interface `gamejs.pathfinding.Map`. This
 * class already holds an example implementation for debugging use.
 *
 * Optionally, the search is cancelled after `timeout` in millseconds.
 *
 * If there is no route `null` is returned.
 *
 * @see http://en.wikipedia.org/wiki/A*_search_algorithm
 * @see http://eloquentjavascript.net/chapter7.html
 */
var BinaryHeap = require('./math/binaryheap').BinaryHeap;

/**
 * helper function for A*
 */
function ReachedList(hashFn) {
   var list = {};

   this.store = function(point, route) {
      list[hashFn(point)] = route;
      return;
   };

   this.find = function(point) {
      return list[hashFn(point)];
   };
   return this;
}


/** A* search function.
 *
 * This function expects a `Map` implementation and the origin and destination
 * points given. If there is a path between the two it will return the optimal
 * path as a linked list. If there is no path it will return null.
 *
 * The linked list is in reverse order: the first item is the destination and
 * the path to the origin follows.
 *
 * @param {Map} map map instance, must follow interface defined in {Map}
 * @param {Array} origin
 * @param {Array} destination
 * @param {Number} timeout milliseconds after which search should be canceled
 * @returns {Object} the linked list leading from `to` to `from` (sic!).
 **/
exports.findRoute = function(map, from, to, timeout) {
   var open = new BinaryHeap(routeScore);
   var hashFn = typeof map.hash === 'function' ? map.hash : defaultHash;
   var reached = new ReachedList(hashFn);

   function routeScore(route) {
      if (route.score === undefined) {
         route.score = map.estimatedDistance(route.point, to) + route.length;
      }
      return route.score;
   }
   function addOpenRoute(route) {
      open.push(route);
      reached.store(route.point, route);
   }

   function processNewPoints(direction) {
      var known = reached.find(direction);
      var newLength = route.length + map.actualDistance(route.point, direction);
      if (!known || known.length > newLength){
         if (known) {
            open.remove(known);
         }
         addOpenRoute({
            point: direction,
            from: route,
            length: newLength
         });
      }
   }
   var startMs = Date.now();
   var route = null;
   addOpenRoute({
      point: from,
      from: null,
      length: 0
   });
   var equalsFn = typeof map.equals === 'function' ? map.equals : defaultEquals;
   while (open.size() > 0 && (!timeout || Date.now() - startMs < timeout)) {
      route = open.pop();
      if (equalsFn(to, route.point)) {
         return route;
      }
      map.adjacent(route.point).forEach(processNewPoints);
   } // end while
   return null;
};

var defaultEquals = function(a, b) {
   return a[0] === b[0] && a[1] === b[1];
};

var defaultHash = function(a) {
   return a[0] + '-' + a[1];
};

/**
 * This is the interface for a Map that can be passed to the `findRoute()`
 * function. `Map` is not instantiable - see the unit tests for an example
 * implementation of Map.
 */
var Map = exports.Map = function() {
   throw new Error('not instantiable, this is an interface');
};

/**
 * @param {Array} origin
 * @returns {Array} list of points accessible from given Point
 */
Map.prototype.adjacent = function(origin) {
};

/**
 * @param {Object} a one of the points ot test for equality
 * @param {Object} b ... the other point
 * @returns Wheter the two points are equal.
 */
Map.prototype.equals = defaultEquals;

/**
 * @param {Object} a point
 * @returns {String} hash for the point
 */
Map.prototype.hash = defaultHash;

/**
 * Estimated lower bound distance between two points.
 * @param {Object} pointA
 * @param {Object} pointB
 * @returns {Number} the estimated distance between two points
 */
Map.prototype.estimatedDistance = function(pointA, pointB) {
   return 1;
};

/**
 * Actual distance between two points.
 * @param {Object} pointA
 * @param {Object} pointB
 * @returns {Number} the actual distance between two points
 */
Map.prototype.actualDistance = function(pointA, pointB) {
   return 1;
};

}}, ["gamejs/math/binaryheap"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/pixelcollision": function(require, exports, module) {
var gamejs = require('../gamejs');
var objects = require('./utils/objects');

/**
 * @fileoverview Image mask. Usefull for pixel perfect collision detection:
 *
 * @example
 * var unitMask = new Maks(unitSurface, collisionThresholdAlphaValue);
 * var spearMask = new Maks(unitSurface, collisionThresholdAlphaValue);
 * var collide = unitMask.overlap(spearMask);
 */


/**
 * Creates an image mask from the given Surface. The alpha of each pixel is checked
 * to see if it is greater than the given threshold. If it is greater then
 * that pixel is set as not colliding.
 *
 * @param {Surface} surface used for image mask
 * @param {Number} threshold 0 to 255. defaults to: 255, fully transparent
 *
 */
var Mask = exports.Mask = function(surface, threshold) {
   /**
    * @ignore
    */
   this._bits = [];

   threshold = (threshold && (255 - threshold)) || 255;
   var imgData = surface.getImageData().data;
   var dims = surface.getSize();
   /**
    * @ignore
    */
   this.width = dims[0];
   /**
    * @ignore
    */
   this.height = dims[1];

   var i,j;
   for (i=0;i<this.width;i++) {
      this._bits[i] = [];
      for (j=0;j<this.height;j++) {
         this._bits[i][j] = false;
      }
   }
   for (i=0;i<imgData.length;i += 4) {
      // y: pixel # / width
      var y = parseInt((i / 4) / dims[0], 10);
      // x: pixel # % width
      var x = parseInt((i / 4) % dims[0], 10);
      var alpha = imgData[i+3];
      if (alpha >= threshold) {
         this.setAt(x, y);
      }
   }
   return;
};

/**
 * @param {gamejs.mask.Mask} otherMask
 * @param {Array} offset [x,y]
 * @returns the overlapping rectangle or null if there is no overlap;
 */
Mask.prototype.overlapRect = function(otherMask, offset) {
   var arect = this.rect;
   var brect = otherMask.rect;
   if (offset) {
      brect.moveIp(offset);
   }
   // bounding box intersect
   if (!brect.collideRect(arect)) {
      return null;
   }
   var xStart = Math.max(arect.left, brect.left);
   var xEnd = Math.min(arect.right, brect.right);

   var yStart = Math.max(arect.top, brect.top);
   var yEnd = Math.min(arect.bottom, brect.bottom);

   return new gamejs.Rect([xStart, yStart], [xEnd - xStart, yEnd - yStart]);
};

/**
 *
 * @returns True if the otherMask overlaps with this map.
 * @param {Mask} otherMask
 * @param {Array} offset
 */
Mask.prototype.overlap = function(otherMask, offset) {
   var overlapRect = this.overlapRect(otherMask, offset);
   if (overlapRect === null) {
      return false;
   }

   var arect = this.rect;
   var brect = otherMask.rect;
   if (offset) {
      brect.moveIp(offset);
   }

   var count = 0;
   var x,y;
   for (y=overlapRect.top; y<=overlapRect.bottom; y++) {
      for (x=overlapRect.left; x<=overlapRect.right; x++) {
         if (this.getAt(x - arect.left, y - arect.top) &&
             otherMask.getAt(x - brect.left, y - brect.top)) {
             return true;
         }
      }
   }
   // NOTE this should not happen because either we bailed out
   // long ago because the rects do not overlap or there is an
   // overlap and we should not have gotten this far.
   // throw new Error("Maks.overlap: overlap detected but could not create mask for it.");
   return false;
};

/**
 * @param {gamejs.mask.Mask} otherMask
 * @param {Array} offset [x,y]
 * @returns the number of overlapping pixels
 */
Mask.prototype.overlapArea = function(otherMask, offset) {
   var overlapRect = this.overlapRect(otherMask, offset);
   if (overlapRect === null) {
      return 0;
   }

   var arect = this.rect;
   var brect = otherMask.rect;
   if (offset) {
      brect.moveIp(offset);
   }

   var count = 0;
   var x,y;
   for (y=overlapRect.top; y<=overlapRect.bottom; y++) {
      for (x=overlapRect.left; x<=overlapRect.right; x++) {
         if (this.getAt(x - arect.left, y - arect.top) &&
             otherMask.getAt(x - brect.left, y - brect.top)) {
             count++;
         }
      }
   }
   return count;
};

/**
 * @param {gamejs.mask.Mask} otherMask
 * @param {Array} offset [x,y]
 * @returns a mask of the overlapping pixels
 */
Mask.prototype.overlapMask = function(otherMask, offset) {
   var overlapRect = this.overlapRect(otherMask, offset);
   if (overlapRect === null) {
      return 0;
   }

   var arect = this.rect;
   var brect = otherMask.rect;
   if (offset) {
      brect.moveIp(offset);
   }

   var mask = new Mask([overlapRect.width, overlapRect.height]);
   var x,y;
   for (y=overlapRect.top; y<=overlapRect.bottom; y++) {
      for (x=overlapRect.left; x<=overlapRect.right; x++) {
         if (this.getAt(x - arect.left, y - arect.top) &&
             otherMask.getAt(x - brect.left, y - brect.top)) {
             mask.setAt(x, y);
         }
      }
   }
   return mask;
};

/**
 * Set bit at position.
 * @param {Number} x
 * @param {Number} y
 */
Mask.prototype.setAt = function(x, y) {
   this._bits[x][y] = true;
};

/**
 * Get bit at position.
 *
 * @param {Number} x
 * @param {Number} y
 */
Mask.prototype.getAt = function(x, y) {
   x = parseInt(x, 10);
   y = parseInt(y, 10);
   if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return false;
   }
   return this._bits[x][y];
};


/**
 * Flip the bits in this map.
 */
Mask.prototype.invert = function() {
   this._bits = this._bits.map(function(row) {
      return row.map(function(b) {
         return !b;
      });
   });
};

/**
 * @returns {Array} the dimensions of the map
 */
Mask.prototype.getSize = function() {
   return [this.width, this.height];
};

objects.accessors(Mask.prototype, {
   /**
    * Rect of this Mask.
    */
   'rect': {
      get: function() {
         return new gamejs.Rect([0, 0], [this.width, this.height]);
      }
   },
   /**
    * @returns {Number} number of set pixels in this mask.
    */
   'length': {
      get: function() {
         var c = 0;
         this._bits.forEach(function(row) {
            row.forEach(function(b) {
               if (b) {
                  c++;
               }
            });
         });
         return c;
      }
   }
});

}}, ["gamejs", "gamejs/utils/objects"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/thread": function(require, exports, module) {
var gamejs = require('../gamejs');
var uri = require('./utils/uri');
var Callback = require('./utils/callback').Callback;

/**
 * ignore
 */
var _EVENTS = exports._EVENTS = {
   RESULT: 1001,
   ALIVE: 1002,
   LOG: 1004
};

/**
 * @fileoverview
 *
 * gamejs.worker makes it more convinient to work with W3C WebWorkers by providing a way to run
 * CommonJs modules inside of them. GameJs also provides the typically `gamejs.ready()` and
 * event loop to facilitate communication between workers and the main application.
 *
 * See the `examples/workers` directory for a running example.
 *
 * Create a worker with the main module "foo-worker" (see below for how the worker's module looks like):
 *
 *     var fooWorker = new Worker('./foo-worker');
 *     // Send a message to your worker.
 *     // The Message doesn't have to be a string but it
 *     // must be `JSON.stringify()`-able
 *     fooWorker.post("foobar");
 *
 * You can also recieve messages from the worker:
 *
 *     // recieve events from the worker
 *     fooWorker.onEvent(function(event) {
 *         if(event.timestamp > ...)
 *      });
 *
 * And this is how the above referenced "foo-worker" module would looke like. As usual, we need a
 * `gamejs.ready()` to get started and within that we bind an event handler:
 *
 *     var gamejs = require('gamejs');
 *     gamejs.ready(function() {
 *         gamejs.event.onEvent(function(event) {
 *              var plaintext = fastCrack(event.password)
 *              ....
 *          });
 *     });
 *
 * Our event worker could do expensive calculations (seperate and not blocking the main game) when
 * recieving an event. Once the result is caculated, it can be sent back to the main application
 * with `gamejs.thread.post()`:
 *
 *     gamejs.thread.post({
 *        info: "important message from worker",
 *        timestamp: 12232435234
 *      });
 *
 * The main application would in turn recieve an event posted like this from `fooWorker.onEvent`, as seen above.
 *
 * This module is useful for expensive algorithms where the result does not have to available instantiously
 * (e.g., path-finding) or for continous logic which can be
 * calculated seperately from the rendering loop, and which only needs to feed back into the model of the rendering every
 * now and then (e.g. physics) The main draw back of the `Worker` model is that
 * you can only communicate with them via text messages (typically JSON.stringify()ed messages).
 */

/**
 * true if this GameJs instance is being executed within a WebWorker
 * @type Boolean
 */
var inWorker = exports.inWorker = (this.importScripts !== undefined);

/**
 * executed in scope of worker
 * @ignore
 */
exports._ready = function() {
   self.onmessage = function(event) {
      gamejs.event._triggerCallbacks(event.data);
   };
   self.postMessage({
     type: _EVENTS.ALIVE
   });
};

/**
 * Send an event back to the main script.
 * @param {Object} data to be sent back to main script
 */
exports.post = function(data) {
  if (inWorker) {
    self.postMessage({
       type: _EVENTS.RESULT,
       data: data
    });
  } else {
    throw new Error('gamejs.postMessage only available in a thread/worker module');
  }
};

/**
 * Send message to main context for logging
 * @ignore
 **/
exports._logMessage = function() {
   var args = [];
   Array.prototype.forEach.call(arguments, function(a) {
     args.push(a);
   });
   self.postMessage({
      type: _EVENTS.LOG,
      arguments: args
   });
};


/**
  * executed in scope of worker before user's main module
  * @ignore
  */
var workerPrefix = function workerPrefix() {
   __scripts.forEach(function(script) {
      try {
         importScripts(script);
      } catch (e) {
         // can't help the worker
      }
   });
};

/**
 * Setup a worker which has `require()` defined
 * @ignore
 **/
var create = function(workerModuleId) {
   var moduleRoot = uri.resolve(document.location.href, window.require.getModuleRoot());
   var initialScripts = [];
   Array.prototype.slice.apply(document.getElementsByTagName('script'), [0]).forEach(function(script) {
      if (script.src) {
         initialScripts.push(script.src);
      }
   });

   var URL = window.URL || window.webkitURL;
   var prefixString = workerPrefix.toString();
   // don't be afraid...
   prefixString = prefixString.substring(prefixString.indexOf("{") + 1, prefixString.lastIndexOf("}"));
   var blob = new Blob([
      'var __scripts = ["' + initialScripts.join('","') + '"];',
      prefixString,
      ';self.require.setModuleRoot("' + moduleRoot + '");',
      'self.require.run("'+ workerModuleId +'");'
   ], {type: 'application\/javascript'});

   var blobURL = URL.createObjectURL(blob);
   return new Worker(blobURL);
};

/**
 * The `Worker` constructor takes only one argument: a module id. This module
 * will be executed inside the newly created Worker. It is effectively the
 * main module of the Worker.
 *
 * Inside a Worker, you can use `require()` to import other scripts or
 * GameJs modules.
 *
 * **Note:** A Worker does not have access to the browser's `document`. So
 * a lot of GameJs modules - everything related to drawing to the canvas -
 * do not work in the Worker.
 *
 * You can use `gamejs.time.*`, `gamejs.utils.*`, `gamejs.event.*` and probably others
 * (as well as any module you write yourself for this purpose, of course).
 *
 * @param {String} moduleId The Worker's main module id. The main module will be executed in the worker
 */
exports.Worker = function(moduleId) {
   // FIXME id should be unchangeable
   /**
    * Unique id of this worker
    * @property {Number}
    */
   var id = this.id = guid(moduleId);
   var worker = create(moduleId);
   var deadQueue = [];
   var alive = false;
   var self  = this;
   var _CALLBACKS = [];
   var _ERROR_CALLBACKS = [];

   function triggerCallbacks(callbacks, event) {
      callbacks.forEach(function(c) {
         c.trigger(event);
      });
   }

   worker.onmessage = function(event) {
      if (event.data.type === _EVENTS.ALIVE) {
         // if worker says he is alive -> send him the event queue so far
         alive = true;
         deadQueue.forEach(function(data) {
            self.post(data);
         });
      } else if (event.data.type === _EVENTS.LOG) {
         gamejs.logging.log.apply(null, [id].concat(event.data.arguments));
      } else {
         triggerCallbacks(_CALLBACKS, event.data.data);
      }
   };
   worker.onerror = function(event) {
      gamejs.logging.error('Error in worker "' + id + '" line ' + event.lineno + ': ', event.message);
      triggerCallbacks(_ERROR_CALLBACKS, {
         data: event.data,
         worker: self,
         event: event
      });
   };

   this.onEvent = function(fn, scope) {
      _CALLBACKS.push(new Callback(fn, scope));
   };

   this.onError = function(fn, scope) {
      _ERROR_CALLBACKS.push(new Callback(fn, scope));
   };

   /**
    * Send a message to the worker
    *
    * @param {Object} data Payload object which gets sent to the Worker
    */
   this.post = function(data) {
      if (alive) {
         worker.postMessage(data);
      } else {
         deadQueue.push(data);
      }
   };
   return this;
};

/**
 * not a real GUID
 * @ignore
 */
function guid(moduleId) {
   var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
   };
   return moduleId + '@' + (S4()+S4());
}
}}, ["gamejs", "gamejs/utils/uri", "gamejs/utils/callback", "gamejs"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/tiledmap": function(require, exports, module) {
var gamejs = require('../gamejs');
var objects = require('./utils/objects');
var xml = require('./utils/xml');
var base64 = require('./utils/base64');
var uri = require('./utils/uri');

/**
 * @fileoverview
 * This is a loader for the general purpose tile map editor "Tiled".
 *
 * This module can load all ".tmx" files even if additionally base64 encoded
 * (can be configured in Tiled).
 *
 * This module loads the whole map definition, including the TileSets with
 * all necessary images. For an example on how to render a map loaded with
 * this module, see `examples/tiledmap`.
 *
 * You will typically create a Map instance with `Map(url)` and deal
 * with the layers, tilesets, etc. through the Map instance
 * instead of loading & creating them yourself.
 *
 * Only orthogonol maps are supported (no isometric maps).
 *
 * @see http://www.mapeditor.org/
 * @see https://github.com/bjorn/tiled/wiki/TMX-Map-Format
 */

/**
 * My code is inspired by:
 *   * https://bitbucket.org/maikg/tiled2cocos/
 *   * https://github.com/obiot/melonJS/
 *
 */

/**
 * A Tiled Map holds all layers defined in the tmx file as well
 * as the necessary tiles to render the map.
 * @param {String} url Relative or absolute URL to the tmx file
 */
var Map = exports.Map = function(url) {

   url = uri.resolve(document.location.href, url);
   var xmlDoc = xml.Document.fromURL(url);
   var mapNode = xmlDoc.element('map');

   /**
    * Width of a single tile in pixels
    * @type Number
    */
   this.tileWidth = mapNode.attribute('tilewidth');
   /**
    * Height of a single tile in pixels
    * @type Number
    */
   this.tileHeight = mapNode.attribute('tileheight');
   /**
    * Width of the map in tiles
    * @type Number
    */
   this.width = mapNode.attribute('width');
   /**
    * Height of the map in tiles
    * @type Number
    */
   this.height = mapNode.attribute('height');

   var orientation = mapNode.attribute('orientation');
   if (orientation !== 'orthogonal') {
      throw new Error('only orthogonol maps supported');
   }

   /**
    * Custom properties of the map
    */
   this.properties = {};
   setProperties(this.properties, mapNode);

   /**
    * All tiles of this map.
    * @type {TileSet}
    */
   this.tiles = new TileSets(mapNode, url);
   this.layers = loadLayers(mapNode);
   return this;
};

/**
 * A Tile. Can not be instantiated. Get a Tile by calling `getTile(gid)`
 * on a `TileSets` instance.
 */
var Tile = exports.Tile = function() {
   /**
    * @type {gamejs.graphics.Surface}
    */
   this.surface = null;
   /**
    * @type {Object}
    */
   this.properties = null;
   throw new Error('Can not be instantiated.');
};

/**
 * A TileSets instance holds all tilesets of a map. This class
 * makes it easy to get the image for a certain tile ID. You usually
 * don't care about in which specific TileSet an image is so this
 * class holds them all and deals with the lookup.
 *
 * You don't usually create a `TileSets` instance yourself, instead
 * it is automatically created and attached to a `Map`.
 */
var TileSets = exports.TileSets = function(mapNode, mapUrl) {
   var tileSets = [];

   /**
    * Retrieve the image for a tile ID (gid).
    *
    * @param {Number} gid global tile id to retrieve
    * @returns {gamejs.graphics.Surface} the Surface for the gid
    */
   this.getSurface = function(gid) {
      var tile = this.getTile(gid);
      return tile && tile.surface || null;
   };

   /**
    * @param {Number} gid global tile id
    * @returns {Object} the custom properties of this tile
    */
   this.getProperties = function(gid) {
      var tile = this.getTile(gid);
      return tile && tile.properties || {};
   };

   /**
    * @param {Number} gid global tile id
    * @returns {Object} the Tile object for this gid
    */
   this.getTile = function(gid) {
      var tile = null;
      tileSets.some(function(tileSet, idx) {
         if (tileSet.firstGid <= gid) {
            tile = tileSet.tiles[gid - tileSet.firstGid];
            return true;
         }
         return false;
      }, this);
      return tile;
   };

   var loadTileSet = function(tileSetNode) {
      var tiles = [];
      var tileWidth = tileSetNode.attribute('tilewidth');
      var tileHeight = tileSetNode.attribute('tileheight');
      var spacing = tileSetNode.attribute('spacing') || 0;
      // broken in tiled?
      var margin = 0;

      var imageNode = tileSetNode.element('image');
      var imageAtlasFile = imageNode.attribute('source');
      var imageUrl = uri.makeRelative(uri.resolve(mapUrl, imageAtlasFile));
      var atlas = gamejs.image.load(imageUrl);
      // FIXME set transparency if imageNode.attribute('trans') is set

      var tileNodes = tileSetNode.elements('tile');
      var dims = atlas.getSize();
      var imgSize = new gamejs.Rect([0,0], [tileWidth, tileHeight]);
      var idx = 0;
      var y = 0;
      while (y + tileHeight <= dims[1]) {
         var x = 0;
         while (x + tileWidth <= dims[0]) {
            var tileImage = new gamejs.graphics.Surface(tileWidth, tileHeight);
            var rect = new gamejs.Rect([x, y], [tileWidth, tileHeight]);
            tileImage.blit(atlas, imgSize, rect);
            var tileProperties = {};
            /* jshint ignore:start */
            // function within loop
            tileNodes.some(function(tileNode) {
               if (tileNode.attribute('id') === idx) {
                  setProperties(tileProperties, tileNode);
                  return true;
               }
            }, this);
            /* jshint ignore:end */
            tiles.push({
               surface: tileImage,
               properties: tileProperties
            });
            x += tileWidth + spacing;
            idx++;
         }
         y += tileHeight + spacing;
      }
      return tiles;
   };

   /**
    *
    * constructor
    **/
   mapNode.elements('tileset').forEach(function(tileSetNode) {
      var firstGid = tileSetNode.attribute('firstgid');
      var externalSource = tileSetNode.attribute('source');
      if (externalSource) {
         var tileSetDocument = xml.Document.fromURL(uri.resolve(mapUrl, externalSource));
         tileSetNode = tileSetDocument.element('tileset');
      }
      tileSets.push({
         tiles: loadTileSet(tileSetNode),
         firstGid: firstGid
      });
   });
   tileSets.reverse();

   return this;
};

/**
 * loadLayers
 */
var H_FLIP = 0x80000000;
var V_FLIP = 0x40000000;
var loadLayers = function(mapNode) {
   var layers = [];

   var getGids = function(layerNode) {
      var dataNode = layerNode.element('data');
      var encoding = dataNode.attribute('encoding');
      var compression = dataNode.attribute('compression');
      var data = "";
      dataNode.children().forEach(function(textNode) {
         data += textNode.value();
      });
      var byteData = [];
      if (encoding === 'base64') {
         if (compression) {
            throw new Error('Compression of map data unsupported');
         }
         byteData = base64.decodeAsArray(data, 4);
      } else if (encoding === 'csv') {
         data.trim().split('\n').forEach(function(row) {
            row.split(',', width).forEach(function(entry) {
               byteData.push(parseInt(entry, 10));
            });
         });
      } else {
         // FIXME individual XML tile elements
         throw new Error('individual tile format not supported');
      }
      return byteData;
   };

   var width = mapNode.attribute('width');
   var height = mapNode.attribute('height');
   mapNode.elements('layer').forEach(function(layerNode) {
      // create empty gid matrix
      var gidMatrix = [];
      var i = height;
      while (i-->0) {
         var j = width;
         gidMatrix[i] = [];
         while (j-->0) {
            gidMatrix[i][j] = 0;
         }
      }

      getGids(layerNode).forEach(function(gid, idx) {
         // FIXME flipX/Y currently ignored
         var flipX = gid & H_FLIP;
         var flipY = gid & V_FLIP;
         // clear flags
         gid &= ~(H_FLIP | V_FLIP);
         gidMatrix[parseInt(idx / width, 10)][parseInt(idx % width, 10)] = gid;
      });
      layers.push({
         gids: gidMatrix,
         opacity: layerNode.attribute('opacity'),
         visible: layerNode.attribute('visible'),
         properties: setProperties({}, layerNode)
      });
   });
   return layers;
};

/**
 * set generic <properties><property name="" value="">... on given object
 */
var setProperties = function(object, node) {
   var props = node.element('properties');
   if (!props) {
      return;
   }
   props.elements('property').forEach(function(propertyNode) {
      var name = propertyNode.attribute('name');
      var value = propertyNode.attribute('value');
      object[name] = value;
   });
   return object;
};


/**
 * FIXME explain viewRect (change it to sroll!) and image, mapImage and how to update, redraw
 */
var MapView = exports.MapView = function(map) {

    this.timeout = 0;

    this.layerViews = map.layers.map(function(layer) {
      return new LayerView(layer, {
         tileWidth: map.tileWidth,
         tileHeight: map.tileHeight,
         width: map.width,
         height: map.height,
         tiles: map.tiles
      });
    });
    this.viewRect = new gamejs.Rect([0,0], [map.width * map.tileWidth, map.height*map.tileWidth]);
    this.image = new gamejs.graphics.Surface([this.viewRect.width, this.viewRect.height]);
    this.mapImage = this.image.clone();
    this.redraw();
    return this;
};

MapView.prototype.redraw = function() {
    this.layerViews.forEach(function(layer) {
        layer.draw(this.mapImage);
    }, this);
};

MapView.prototype.draw = function(display, offset) {
  display.blit(this.mapImage, offset || [0,0], this.viewRect);
};



/**
 * LayerView
 * Renders the layer to a big surface.
 */
var LayerView = exports.LayerView = function(layer, opts) {

   this.draw = function(display) {
      display.blit(this.surface);
   };
   /**
    * constructor
    */
   this.surface = new gamejs.graphics.Surface(opts.width * opts.tileWidth, opts.height * opts.tileHeight);
   this.surface.setAlpha(layer.opacity);

   /**
    * Note how below we look up the "gid" of the tile images in the TileSet from the Map
    * ('opt.tiles') to get the actual Surfaces.
    */
   layer.gids.forEach(function(row, i) {
      row.forEach(function(gid, j) {
         if (gid ===0) {
            return;
         }

         var tileSurface = opts.tiles.getSurface(gid);
         if (tileSurface) {
            this.surface.blit(tileSurface,
               new gamejs.Rect([j * opts.tileWidth, i * opts.tileHeight], [opts.tileWidth, opts.tileHeight])
            );
         } else {
            gamejs.log('no gid ', gid, i, j, 'layer', i);
         }
      }, this);
   }, this);
   return this;
};


}}, ["gamejs", "gamejs/utils/objects", "gamejs/utils/xml", "gamejs/utils/base64", "gamejs/utils/uri"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/time": function(require, exports, module) {
/**
 * @fileoverview
 * Only used by GameJs internally to provide a game loop.
 * @ignore
 */

var Callback = require('./utils/callback').Callback;

var TIMER_LASTCALL = null;
var STARTTIME = null;

/** @ignore **/
var _CALLBACKS = exports._CALLBACKS = [];
// `window` is not accessible in webworker (would lead to TypeError)
// @@ this cross-browser fuckery has to go away ASAP.
var reqAnimationFrame = typeof(window) != 'undefined' ?
                        window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        null : null;

var reqAniFrameRecursive = function() {
   perInterval();
   reqAnimationFrame(reqAniFrameRecursive);
};

var triggerCallbacks = function(msDuration) {
   _CALLBACKS.forEach(function(c) {
      c.trigger(msDuration);
   });
};

/**
 * @ignore
 */
exports.init = function() {
   STARTTIME = Date.now();

   if (reqAnimationFrame) {
      reqAnimationFrame(reqAniFrameRecursive);
   } else {
      setInterval(perInterval, 10);
   }
   return;
};

var perInterval = function() {
   var msNow = Date.now();
   triggerCallbacks(msNow - (TIMER_LASTCALL || msNow));
   TIMER_LASTCALL = msNow;
   return;
};

}}, ["gamejs/utils/callback"]);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/utils/arrays": function(require, exports, module) {
/**
 * @fileoverview Utility functions for working with Obiects
 * @param {Object} item
 * @param {Array} array
 * @param {Object} returns removed item or null
 */

exports.remove = function(item, array) {
   var index = array.indexOf(item);
   if (index !== -1) {
      return array.splice(array.indexOf(item), 1);
   }
   return null;
};

/**
 * Shuffles the array *in place*.
 * @see http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
exports.shuffle = function(array) {
    var len = array.length -1;
    for (var i = len; i > 0; i--) {
        var idx = parseInt(Math.random() * (i + 1), 10);
        var item = array[i];
        array[i] = array[idx];
        array[idx] = item;
    }
    return array;
};

}}, []);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/utils/base64": function(require, exports, module) {
/**
 * @fileoverview
 * Base64 encode / decode
 * @author http://www.webtoolkit.info
 */


var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * Decodes a base64 encoded string to a string.
 */
var decode = exports.decode = function(input) {
   var output = [], chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   while (i < input.length) {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output.push(String.fromCharCode(chr1));

      if (enc3 != 64) {
         output.push(String.fromCharCode(chr2));
      }
      if (enc4 != 64) {
         output.push(String.fromCharCode(chr3));
      }
   }

   output = output.join('');
   return output;
};

/**
 * Decodes a base64 encoded string into a byte array
 * @param {String} input
 * @param {Array} bytes bytes per character, defaults to 1
 */
exports.decodeAsArray = function(input, bytes) {
   bytes = bytes || 1;
   var decoded = decode(input);
   var len = decoded.length / bytes;
   var array = [];
   var i,j;
   for (i=0; i< len; i++) {
      array[i] = 0;
      for (j = bytes - 1; j >=0; --j) {
         array[i] += decoded.charCodeAt((i * bytes) + j) << (j <<3 );
      }
   }
   return array;
}
;
}}, []);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/utils/callback": function(require, exports, module) {
/**
 * @fileoverview
 * Manage a callback with invocation scope. This is used internally by GameJs but might be useful for others.
 */

/**
 * @param {Function} callback
 * @param {Object} scope with which the callback will be triggered
 */
var Callback = exports.Callback = function(fn, scope) {
	this.fn = fn;
	this.fnScope = scope || {};
	return this;
};
/**
 * Any arguments passed to `trigger` will be passed to the callback.
 */
Callback.prototype.trigger = function() {
	this.fn.apply(this.fnScope, arguments);
};
}}, []);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/utils/objects": function(require, exports, module) {
/**
 * @fileoverview Utility functions for working with Objects
 */

/**
 * Put a prototype into the prototype chain of another prototype.
 * @param {Object} subClass
 * @param {Object} superClass
 */
exports.extend = function(subClass, superClass) {
   if (subClass === undefined) {
      throw new Error('unknown subClass');
   }
   if (superClass === undefined) {
      throw new Error('unknown superClass');
   }
   var F;
   /* jshint ignore:start */
   F = new Function();
   /* jshint ignore:start */
   F.prototype = superClass.prototype;
   /* jshint ignore:end */
   subClass.prototype = new F();
   subClass.prototype.constructor = subClass;
   subClass.superClass = superClass.prototype;
   subClass.superConstructor = superClass;
   return;
};

/**
 * Creates a new object as the as the keywise union of the provided objects.
 * Whenever a key exists in a later object that already existed in an earlier
 * object, the according value of the earlier object takes precedence.
 * @param {Object} obj... The objects to merge
 */
exports.merge = function() {
   var result = {};
   var i, property;
      for (i = arguments.length; i > 0; --i) {
         var obj = arguments[i - 1];
         for (property in obj) {
            result[property] = obj[property];
         }
      }
   return result;
};

/**
 * fallback for Object.keys
 * @param {Object} obj
 * @returns {Array} list of own properties
 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
 */
var keys = exports.keys = function(obj) {
   if (Object.keys) {
      return Object.keys(obj);
   }

   var ret=[],p;
   for (p in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, p)) {
         ret.push(p);
      }
   }
   return ret;
};

/**
 * Create object accessors
 * @param {Object} object The object on which to define the property
 * @param {String} name name of the property
 * @param {Function} get
 * @param {Function} set
 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperty
 */
var accessor = exports.accessor = function(object, name, get, set) {
   // ECMA5
   if (Object.defineProperty !== undefined) {
      Object.defineProperty(object, name, {
         get: get,
         set: set
      });
   // non-standard
   } else if (Object.prototype.__defineGetter__ !== undefined) {
      object.__defineGetter__(name, get);
      if (set) {
         object.__defineSetter__(name, set);
      }
   }
	return;
};

/**
 * @param {Object} object The object on which to define or modify properties.
 * @param {Object} props An object whose own enumerable properties constitute descriptors for the properties to be defined or modified.
 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperties
 */
exports.accessors = function(object, props) {
   keys(props).forEach(function(propKey) {
      accessor(object, propKey, props[propKey].get, props[propKey].set);
   });
   return;
};

}}, []);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/utils/strings": function(require, exports, module) {
/**
 * @fileoverview Working with strings
 */

/**
 * Get the longest common segment that two strings
 * have in common, starting at the beginning of the string
 * @param {String} str1 a string
 * @param {String} str2 another string
 * @returns {String} the longest common segment
 */
exports.getCommonPrefix = function getCommonPrefix(str1, str2) {
    if (str1 === null || str2 === null) {
        return null;
    } else if (str1.length > str2.length && str1.indexOf(str2) === 0) {
        return str2;
    } else if (str2.length > str1.length && str2.indexOf(str1) === 0) {
        return str1;
    }
    var length = Math.min(str1.length, str2.length);
    var i;
    for (i = 0; i < length; i++) {
        if (str1[i] != str2[i]) {
            return str1.slice(0, i);
        }
    }
    return str1.slice(0, length);
};
}}, []);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/utils/uri": function(require, exports, module) {
/**
 * @fileoverview Utilies for URI handling.
 *
 */

var URI_REGEX = new RegExp(
    '^' +
    '(?:' +
      '([^:/?#.]+)' +                     // scheme - ignore special characters
                                          // used by other URL parts such as :,
                                          // ?, /, #, and .
    ':)?' +
    '(?://' +
      '(?:([^/?#]*)@)?' +                 // userInfo
      '([\\w\\d\\-\\u0100-\\uffff.%]*)' + // domain - restrict to letters,
                                          // digits, dashes, dots, percent
                                          // escapes, and unicode characters.
      '(?::([0-9]+))?' +                  // port
    ')?' +
    '([^?#]+)?' +                         // path
    '(?:\\?([^#]*))?' +                   // query
    '(?:#(.*))?' +                        // fragment
    '$');

/**
 * Resolve path against URI.
 *
 * @param {String} uri
 * @param {String} path to resolve
 */
var resolve = exports.resolve = function(uri, path) {
   var m = match(uri);
   var n = match(path);
   var host = m[1] + '://' + m[3];
   if (n[1]) {
      return path;
   }
   if (m[4]) {
      host = host + ":" + m[4];
   }
   var absolutePath = m[5];
   if (path.charAt(0) !== '/') {
      var lastSlashIndex = absolutePath.lastIndexOf('/');
      absolutePath = absolutePath.substr(0, lastSlashIndex + 1) + path;
   } else {
      absolutePath = path;
   }
   return host + removeDotSegments(absolutePath);

};

/**
 * Try to match an URI against a regex returning the following
 * capture groups:
 *     $1 = http              scheme
 *     $2 = <undefined>       userInfo -\
 *     $3 = www.ics.uci.edu   domain     | authority
 *     $4 = <undefined>       port     -/
 *     $5 = /pub/ietf/uri/    path
 *     $6 = <undefined>       query without ?
 *     $7 = Related           fragment without #
 *
 * @param {String} uri
 */
var match = exports.match = function(uri) {
   return uri.match(URI_REGEX);
};

/**
 * Make an absolute URI relative to document.location.href
 * @param {String} uri
 * @returns The relative URI or the unchanged URI if it's not
 * possible to make it relative to the path of document.location.href.
 */
var makeRelative = exports.makeRelative = function(uri) {
   var docLocPath = resolve(document.location.href, './');
   if (uri.indexOf(docLocPath) === 0) {
      uri = './' + uri.substring(docLocPath.length);
   }
   return uri;
};

/**
 * Removes dot segments in given path component
 */
var removeDotSegments = function(path) {
   if (path == '..' || path == '.') {
      return '';
   }
   var leadingSlash = path.indexOf('/') > -1;

   var segments = path.split('/');
   var out = [];

   var pos;
   for (pos = 0; pos < segments.length; ) {
      var segment = segments[pos++];

      if (segment == '.') {
         if (leadingSlash && pos == segments.length) {
            out.push('');
         }
      } else if (segment == '..') {
         if (out.length > 1 || out.length !== 1 && out[0] !== '') {
            out.pop();
         }
         if (leadingSlash && pos == segments.length) {
            out.push('');
         }
      } else {
         out.push(segment);
         leadingSlash = true;
      }
   }
   return out.join('/');
};

}}, []);
/* This file has been generated by yabbler.js */
require.define({
"gamejs/utils/xml": function(require, exports, module) {
/**
 * @fileoverview
 *
 * Provides facilities for parsing a xml String.
 *
 * You will typically get a `gamejs.xml.Document` instance
 * by loading the data with one of the two static
 * `Document.fromString(string)` or `Document.fromUrl(url)`.

 * Querying for `elements(name)` or `children()` will return a
 * new `gamejs.xml.Document` matching your result (or null).
 *
 * Use `attributes(name)` and `value()` to get the data stored
 * in the XML Document.
 */

/**
 * XMLParser
 */
var Parser = exports.Parser = function() {

   var xmlDoc = null;
   var parser = new DOMParser();

   this.parseFromString = function(xmlString) {
      xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      return xmlDoc;
   };

   return this;
};

/**
 * Instantiate with the static functions `Document.fromString()` and `fromURL()`.
 */
var Document = exports.Document = function(xmlDocument) {
   if (!xmlDocument || (!xmlDocument instanceof XMLDocument) ) {
      throw new Error('Need a valid xmlDocument.');
   }
   /** @ignore **/
   this._xmlDocument = xmlDocument;
   return this;
};

/**
 * Returns the first element in the current document whose tag-name matches
 * the given 'name'.
 * @returns gamejs.xml.Document
 */
Document.prototype.element = function(name) {
   var elem = this._xmlDocument.getElementsByTagName(name)[0];
   return elem && new Document(elem) || null;
};

/**
 * Returns all elements in the current document whose tag-name matches
 * the given 'name'.
 * @returns an Array of gamejs.xml.Document
 */
Document.prototype.elements = function(name) {
   var elems = this._xmlDocument.getElementsByTagName(name);
   return Array.prototype.slice.apply(elems, [0]).map(function(elem) {
      return new Document(elem);
   });
};

/**
 * Returns the attribute value of this document.
 *
 * @returns String
 */
Document.prototype.attribute = function(name) {
   var attributeValue = this._xmlDocument.getAttribute(name);
   attributeValue = attributeValue ? attributeValue.trim() : null;
   if (attributeValue === null) {
      return null;
   }
   if (attributeValue.toLowerCase() === 'true') {
      return true;
   }
   if (attributeValue.toLowerCase() === 'false') {
      return false;
   }
   var attributeIntValue = parseInt(attributeValue, 10);
   var attributeFloatValue = parseFloat(attributeValue, 10);
   if (!isNaN(attributeIntValue)) {
      if (attributeFloatValue !== attributeIntValue) {
         return attributeFloatValue;
      }
      return attributeIntValue;
   }
   return attributeValue;
};

/**
 * Returns the nodevalue of the current xml document
 * @returns String
 */
Document.prototype.value = function() {
   return this._xmlDocument.nodeValue;
};

/**
 * Returns all children of this xml document
 * @returns Array of gamejs.xml.Document
 */
Document.prototype.children = function() {
   return Array.prototype.slice.apply(this._xmlDocument.childNodes, [0]).map(function(cNode) {
      return new Document(cNode);
   });
};

/**
 * @returns gamejs.xml.Document
 */
Document.fromString = function(xmlString) {
   var parser = new DOMParser();
   var xmlDoc = parser.parseFromString(xmlString, 'text/xml');
   return new Document(xmlDoc);
};

/**
 * @returns gamejs.xml.Document
 */
Document.fromURL = function(url) {
   var response = new XMLHttpRequest();
   response.open('GET', url, false);
   response.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
   response.setRequestHeader('Content-Type', 'text/xml');
   response.overrideMimeType('text/xml');
   response.send();
   return new Document(response.responseXML);
};

}}, []);