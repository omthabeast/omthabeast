/* */ 
"format cjs";
(function(process) {
  (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a)
            return a(o, !0);
          if (i)
            return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = {exports: {}};
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++)
      s(r[o]);
    return s;
  })({
    1: [function(require, module, exports) {
      (function(process, global) {
        (function() {
          var define,
              requireModule,
              require,
              requirejs;
          (function() {
            var registry = {},
                seen = {};
            define = function(name, deps, callback) {
              registry[name] = {
                deps: deps,
                callback: callback
              };
            };
            requirejs = require = requireModule = function(name) {
              requirejs._eak_seen = registry;
              if (seen[name]) {
                return seen[name];
              }
              seen[name] = {};
              if (!registry[name]) {
                throw new Error("Could not find module " + name);
              }
              var mod = registry[name],
                  deps = mod.deps,
                  callback = mod.callback,
                  reified = [],
                  exports;
              for (var i = 0,
                  l = deps.length; i < l; i++) {
                if (deps[i] === 'exports') {
                  reified.push(exports = {});
                } else {
                  reified.push(requireModule(resolve(deps[i])));
                }
              }
              var value = callback.apply(this, reified);
              return seen[name] = exports || value;
              function resolve(child) {
                if (child.charAt(0) !== '.') {
                  return child;
                }
                var parts = child.split("/");
                var parentBase = name.split("/").slice(0, -1);
                for (var i = 0,
                    l = parts.length; i < l; i++) {
                  var part = parts[i];
                  if (part === '..') {
                    parentBase.pop();
                  } else if (part === '.') {
                    continue;
                  } else {
                    parentBase.push(part);
                  }
                }
                return parentBase.join("/");
              }
            };
          })();
          define("promise/all", ["./utils", "exports"], function(__dependency1__, __exports__) {
            "use strict";
            var isArray = __dependency1__.isArray;
            var isFunction = __dependency1__.isFunction;
            function all(promises) {
              var Promise = this;
              if (!isArray(promises)) {
                throw new TypeError('You must pass an array to all.');
              }
              return new Promise(function(resolve, reject) {
                var results = [],
                    remaining = promises.length,
                    promise;
                if (remaining === 0) {
                  resolve([]);
                }
                function resolver(index) {
                  return function(value) {
                    resolveAll(index, value);
                  };
                }
                function resolveAll(index, value) {
                  results[index] = value;
                  if (--remaining === 0) {
                    resolve(results);
                  }
                }
                for (var i = 0; i < promises.length; i++) {
                  promise = promises[i];
                  if (promise && isFunction(promise.then)) {
                    promise.then(resolver(i), reject);
                  } else {
                    resolveAll(i, promise);
                  }
                }
              });
            }
            __exports__.all = all;
          });
          define("promise/asap", ["exports"], function(__exports__) {
            "use strict";
            var browserGlobal = (typeof window !== 'undefined') ? window : {};
            var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
            var local = (typeof global !== 'undefined') ? global : (this === undefined ? window : this);
            function useNextTick() {
              return function() {
                process.nextTick(flush);
              };
            }
            function useMutationObserver() {
              var iterations = 0;
              var observer = new BrowserMutationObserver(flush);
              var node = document.createTextNode('');
              observer.observe(node, {characterData: true});
              return function() {
                node.data = (iterations = ++iterations % 2);
              };
            }
            function useSetTimeout() {
              return function() {
                local.setTimeout(flush, 1);
              };
            }
            var queue = [];
            function flush() {
              for (var i = 0; i < queue.length; i++) {
                var tuple = queue[i];
                var callback = tuple[0],
                    arg = tuple[1];
                callback(arg);
              }
              queue = [];
            }
            var scheduleFlush;
            if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
              scheduleFlush = useNextTick();
            } else if (BrowserMutationObserver) {
              scheduleFlush = useMutationObserver();
            } else {
              scheduleFlush = useSetTimeout();
            }
            function asap(callback, arg) {
              var length = queue.push([callback, arg]);
              if (length === 1) {
                scheduleFlush();
              }
            }
            __exports__.asap = asap;
          });
          define("promise/config", ["exports"], function(__exports__) {
            "use strict";
            var config = {instrument: false};
            function configure(name, value) {
              if (arguments.length === 2) {
                config[name] = value;
              } else {
                return config[name];
              }
            }
            __exports__.config = config;
            __exports__.configure = configure;
          });
          define("promise/polyfill", ["./promise", "./utils", "exports"], function(__dependency1__, __dependency2__, __exports__) {
            "use strict";
            var RSVPPromise = __dependency1__.Promise;
            var isFunction = __dependency2__.isFunction;
            function polyfill() {
              var local;
              if (typeof global !== 'undefined') {
                local = global;
              } else if (typeof window !== 'undefined' && window.document) {
                local = window;
              } else {
                local = self;
              }
              var es6PromiseSupport = "Promise" in local && "resolve" in local.Promise && "reject" in local.Promise && "all" in local.Promise && "race" in local.Promise && (function() {
                var resolve;
                new local.Promise(function(r) {
                  resolve = r;
                });
                return isFunction(resolve);
              }());
              if (!es6PromiseSupport) {
                local.Promise = RSVPPromise;
              }
            }
            __exports__.polyfill = polyfill;
          });
          define("promise/promise", ["./config", "./utils", "./all", "./race", "./resolve", "./reject", "./asap", "exports"], function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __exports__) {
            "use strict";
            var config = __dependency1__.config;
            var configure = __dependency1__.configure;
            var objectOrFunction = __dependency2__.objectOrFunction;
            var isFunction = __dependency2__.isFunction;
            var now = __dependency2__.now;
            var all = __dependency3__.all;
            var race = __dependency4__.race;
            var staticResolve = __dependency5__.resolve;
            var staticReject = __dependency6__.reject;
            var asap = __dependency7__.asap;
            var counter = 0;
            config.async = asap;
            function Promise(resolver) {
              if (!isFunction(resolver)) {
                throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
              }
              if (!(this instanceof Promise)) {
                throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
              }
              this._subscribers = [];
              invokeResolver(resolver, this);
            }
            function invokeResolver(resolver, promise) {
              function resolvePromise(value) {
                resolve(promise, value);
              }
              function rejectPromise(reason) {
                reject(promise, reason);
              }
              try {
                resolver(resolvePromise, rejectPromise);
              } catch (e) {
                rejectPromise(e);
              }
            }
            function invokeCallback(settled, promise, callback, detail) {
              var hasCallback = isFunction(callback),
                  value,
                  error,
                  succeeded,
                  failed;
              if (hasCallback) {
                try {
                  value = callback(detail);
                  succeeded = true;
                } catch (e) {
                  failed = true;
                  error = e;
                }
              } else {
                value = detail;
                succeeded = true;
              }
              if (handleThenable(promise, value)) {
                return ;
              } else if (hasCallback && succeeded) {
                resolve(promise, value);
              } else if (failed) {
                reject(promise, error);
              } else if (settled === FULFILLED) {
                resolve(promise, value);
              } else if (settled === REJECTED) {
                reject(promise, value);
              }
            }
            var PENDING = void 0;
            var SEALED = 0;
            var FULFILLED = 1;
            var REJECTED = 2;
            function subscribe(parent, child, onFulfillment, onRejection) {
              var subscribers = parent._subscribers;
              var length = subscribers.length;
              subscribers[length] = child;
              subscribers[length + FULFILLED] = onFulfillment;
              subscribers[length + REJECTED] = onRejection;
            }
            function publish(promise, settled) {
              var child,
                  callback,
                  subscribers = promise._subscribers,
                  detail = promise._detail;
              for (var i = 0; i < subscribers.length; i += 3) {
                child = subscribers[i];
                callback = subscribers[i + settled];
                invokeCallback(settled, child, callback, detail);
              }
              promise._subscribers = null;
            }
            Promise.prototype = {
              constructor: Promise,
              _state: undefined,
              _detail: undefined,
              _subscribers: undefined,
              then: function(onFulfillment, onRejection) {
                var promise = this;
                var thenPromise = new this.constructor(function() {});
                if (this._state) {
                  var callbacks = arguments;
                  config.async(function invokePromiseCallback() {
                    invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
                  });
                } else {
                  subscribe(this, thenPromise, onFulfillment, onRejection);
                }
                return thenPromise;
              },
              'catch': function(onRejection) {
                return this.then(null, onRejection);
              }
            };
            Promise.all = all;
            Promise.race = race;
            Promise.resolve = staticResolve;
            Promise.reject = staticReject;
            function handleThenable(promise, value) {
              var then = null,
                  resolved;
              try {
                if (promise === value) {
                  throw new TypeError("A promises callback cannot return that same promise.");
                }
                if (objectOrFunction(value)) {
                  then = value.then;
                  if (isFunction(then)) {
                    then.call(value, function(val) {
                      if (resolved) {
                        return true;
                      }
                      resolved = true;
                      if (value !== val) {
                        resolve(promise, val);
                      } else {
                        fulfill(promise, val);
                      }
                    }, function(val) {
                      if (resolved) {
                        return true;
                      }
                      resolved = true;
                      reject(promise, val);
                    });
                    return true;
                  }
                }
              } catch (error) {
                if (resolved) {
                  return true;
                }
                reject(promise, error);
                return true;
              }
              return false;
            }
            function resolve(promise, value) {
              if (promise === value) {
                fulfill(promise, value);
              } else if (!handleThenable(promise, value)) {
                fulfill(promise, value);
              }
            }
            function fulfill(promise, value) {
              if (promise._state !== PENDING) {
                return ;
              }
              promise._state = SEALED;
              promise._detail = value;
              config.async(publishFulfillment, promise);
            }
            function reject(promise, reason) {
              if (promise._state !== PENDING) {
                return ;
              }
              promise._state = SEALED;
              promise._detail = reason;
              config.async(publishRejection, promise);
            }
            function publishFulfillment(promise) {
              publish(promise, promise._state = FULFILLED);
            }
            function publishRejection(promise) {
              publish(promise, promise._state = REJECTED);
            }
            __exports__.Promise = Promise;
          });
          define("promise/race", ["./utils", "exports"], function(__dependency1__, __exports__) {
            "use strict";
            var isArray = __dependency1__.isArray;
            function race(promises) {
              var Promise = this;
              if (!isArray(promises)) {
                throw new TypeError('You must pass an array to race.');
              }
              return new Promise(function(resolve, reject) {
                var results = [],
                    promise;
                for (var i = 0; i < promises.length; i++) {
                  promise = promises[i];
                  if (promise && typeof promise.then === 'function') {
                    promise.then(resolve, reject);
                  } else {
                    resolve(promise);
                  }
                }
              });
            }
            __exports__.race = race;
          });
          define("promise/reject", ["exports"], function(__exports__) {
            "use strict";
            function reject(reason) {
              var Promise = this;
              return new Promise(function(resolve, reject) {
                reject(reason);
              });
            }
            __exports__.reject = reject;
          });
          define("promise/resolve", ["exports"], function(__exports__) {
            "use strict";
            function resolve(value) {
              if (value && typeof value === 'object' && value.constructor === this) {
                return value;
              }
              var Promise = this;
              return new Promise(function(resolve) {
                resolve(value);
              });
            }
            __exports__.resolve = resolve;
          });
          define("promise/utils", ["exports"], function(__exports__) {
            "use strict";
            function objectOrFunction(x) {
              return isFunction(x) || (typeof x === "object" && x !== null);
            }
            function isFunction(x) {
              return typeof x === "function";
            }
            function isArray(x) {
              return Object.prototype.toString.call(x) === "[object Array]";
            }
            var now = Date.now || function() {
              return new Date().getTime();
            };
            __exports__.objectOrFunction = objectOrFunction;
            __exports__.isFunction = isFunction;
            __exports__.isArray = isArray;
            __exports__.now = now;
          });
          requireModule('promise/polyfill').polyfill();
        }());
      }).call(this, require("_process"), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {"_process": 2}],
    2: [function(require, module, exports) {
      var process = module.exports = {};
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;
      function cleanUpNextTick() {
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }
      function drainQueue() {
        if (draining) {
          return ;
        }
        var timeout = setTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            currentQueue[queueIndex].run();
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        clearTimeout(timeout);
      }
      process.nextTick = function(fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          setTimeout(drainQueue, 0);
        }
      };
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function() {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = '';
      process.versions = {};
      function noop() {}
      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.binding = function(name) {
        throw new Error('process.binding is not supported');
      };
      process.cwd = function() {
        return '/';
      };
      process.chdir = function(dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function() {
        return 0;
      };
    }, {}],
    3: [function(require, module, exports) {
      'use strict';
      var asap = require("asap");
      module.exports = Promise;
      function Promise(fn) {
        if (typeof this !== 'object')
          throw new TypeError('Promises must be constructed via new');
        if (typeof fn !== 'function')
          throw new TypeError('not a function');
        var state = null;
        var value = null;
        var deferreds = [];
        var self = this;
        this.then = function(onFulfilled, onRejected) {
          return new Promise(function(resolve, reject) {
            handle(new Handler(onFulfilled, onRejected, resolve, reject));
          });
        };
        function handle(deferred) {
          if (state === null) {
            deferreds.push(deferred);
            return ;
          }
          asap(function() {
            var cb = state ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
              (state ? deferred.resolve : deferred.reject)(value);
              return ;
            }
            var ret;
            try {
              ret = cb(value);
            } catch (e) {
              deferred.reject(e);
              return ;
            }
            deferred.resolve(ret);
          });
        }
        function resolve(newValue) {
          try {
            if (newValue === self)
              throw new TypeError('A promise cannot be resolved with itself.');
            if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
              var then = newValue.then;
              if (typeof then === 'function') {
                doResolve(then.bind(newValue), resolve, reject);
                return ;
              }
            }
            state = true;
            value = newValue;
            finale();
          } catch (e) {
            reject(e);
          }
        }
        function reject(newValue) {
          state = false;
          value = newValue;
          finale();
        }
        function finale() {
          for (var i = 0,
              len = deferreds.length; i < len; i++)
            handle(deferreds[i]);
          deferreds = null;
        }
        doResolve(fn, resolve, reject);
      }
      function Handler(onFulfilled, onRejected, resolve, reject) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.resolve = resolve;
        this.reject = reject;
      }
      function doResolve(fn, onFulfilled, onRejected) {
        var done = false;
        try {
          fn(function(value) {
            if (done)
              return ;
            done = true;
            onFulfilled(value);
          }, function(reason) {
            if (done)
              return ;
            done = true;
            onRejected(reason);
          });
        } catch (ex) {
          if (done)
            return ;
          done = true;
          onRejected(ex);
        }
      }
    }, {"asap": 5}],
    4: [function(require, module, exports) {
      'use strict';
      var Promise = require("./core");
      var asap = require("asap");
      module.exports = Promise;
      function ValuePromise(value) {
        this.then = function(onFulfilled) {
          if (typeof onFulfilled !== 'function')
            return this;
          return new Promise(function(resolve, reject) {
            asap(function() {
              try {
                resolve(onFulfilled(value));
              } catch (ex) {
                reject(ex);
              }
            });
          });
        };
      }
      ValuePromise.prototype = Object.create(Promise.prototype);
      var TRUE = new ValuePromise(true);
      var FALSE = new ValuePromise(false);
      var NULL = new ValuePromise(null);
      var UNDEFINED = new ValuePromise(undefined);
      var ZERO = new ValuePromise(0);
      var EMPTYSTRING = new ValuePromise('');
      Promise.resolve = function(value) {
        if (value instanceof Promise)
          return value;
        if (value === null)
          return NULL;
        if (value === undefined)
          return UNDEFINED;
        if (value === true)
          return TRUE;
        if (value === false)
          return FALSE;
        if (value === 0)
          return ZERO;
        if (value === '')
          return EMPTYSTRING;
        if (typeof value === 'object' || typeof value === 'function') {
          try {
            var then = value.then;
            if (typeof then === 'function') {
              return new Promise(then.bind(value));
            }
          } catch (ex) {
            return new Promise(function(resolve, reject) {
              reject(ex);
            });
          }
        }
        return new ValuePromise(value);
      };
      Promise.from = Promise.cast = function(value) {
        var err = new Error('Promise.from and Promise.cast are deprecated, use Promise.resolve instead');
        err.name = 'Warning';
        console.warn(err.stack);
        return Promise.resolve(value);
      };
      Promise.denodeify = function(fn, argumentCount) {
        argumentCount = argumentCount || Infinity;
        return function() {
          var self = this;
          var args = Array.prototype.slice.call(arguments);
          return new Promise(function(resolve, reject) {
            while (args.length && args.length > argumentCount) {
              args.pop();
            }
            args.push(function(err, res) {
              if (err)
                reject(err);
              else
                resolve(res);
            });
            fn.apply(self, args);
          });
        };
      };
      Promise.nodeify = function(fn) {
        return function() {
          var args = Array.prototype.slice.call(arguments);
          var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
          try {
            return fn.apply(this, arguments).nodeify(callback);
          } catch (ex) {
            if (callback === null || typeof callback == 'undefined') {
              return new Promise(function(resolve, reject) {
                reject(ex);
              });
            } else {
              asap(function() {
                callback(ex);
              });
            }
          }
        };
      };
      Promise.all = function() {
        var calledWithArray = arguments.length === 1 && Array.isArray(arguments[0]);
        var args = Array.prototype.slice.call(calledWithArray ? arguments[0] : arguments);
        if (!calledWithArray) {
          var err = new Error('Promise.all should be called with a single array, calling it with multiple arguments is deprecated');
          err.name = 'Warning';
          console.warn(err.stack);
        }
        return new Promise(function(resolve, reject) {
          if (args.length === 0)
            return resolve([]);
          var remaining = args.length;
          function res(i, val) {
            try {
              if (val && (typeof val === 'object' || typeof val === 'function')) {
                var then = val.then;
                if (typeof then === 'function') {
                  then.call(val, function(val) {
                    res(i, val);
                  }, reject);
                  return ;
                }
              }
              args[i] = val;
              if (--remaining === 0) {
                resolve(args);
              }
            } catch (ex) {
              reject(ex);
            }
          }
          for (var i = 0; i < args.length; i++) {
            res(i, args[i]);
          }
        });
      };
      Promise.reject = function(value) {
        return new Promise(function(resolve, reject) {
          reject(value);
        });
      };
      Promise.race = function(values) {
        return new Promise(function(resolve, reject) {
          values.forEach(function(value) {
            Promise.resolve(value).then(resolve, reject);
          });
        });
      };
      Promise.prototype.done = function(onFulfilled, onRejected) {
        var self = arguments.length ? this.then.apply(this, arguments) : this;
        self.then(null, function(err) {
          asap(function() {
            throw err;
          });
        });
      };
      Promise.prototype.nodeify = function(callback) {
        if (typeof callback != 'function')
          return this;
        this.then(function(value) {
          asap(function() {
            callback(null, value);
          });
        }, function(err) {
          asap(function() {
            callback(err);
          });
        });
      };
      Promise.prototype['catch'] = function(onRejected) {
        return this.then(null, onRejected);
      };
    }, {
      "./core.js": 3,
      "asap": 5
    }],
    5: [function(require, module, exports) {
      (function(process) {
        var head = {
          task: void 0,
          next: null
        };
        var tail = head;
        var flushing = false;
        var requestFlush = void 0;
        var isNodeJS = false;
        function flush() {
          while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;
            if (domain) {
              head.domain = void 0;
              domain.enter();
            }
            try {
              task();
            } catch (e) {
              if (isNodeJS) {
                if (domain) {
                  domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                  domain.enter();
                }
                throw e;
              } else {
                setTimeout(function() {
                  throw e;
                }, 0);
              }
            }
            if (domain) {
              domain.exit();
            }
          }
          flushing = false;
        }
        if (typeof process !== "undefined" && process.nextTick) {
          isNodeJS = true;
          requestFlush = function() {
            process.nextTick(flush);
          };
        } else if (typeof setImmediate === "function") {
          if (typeof window !== "undefined") {
            requestFlush = setImmediate.bind(window, flush);
          } else {
            requestFlush = function() {
              setImmediate(flush);
            };
          }
        } else if (typeof MessageChannel !== "undefined") {
          var channel = new MessageChannel();
          channel.port1.onmessage = flush;
          requestFlush = function() {
            channel.port2.postMessage(0);
          };
        } else {
          requestFlush = function() {
            setTimeout(flush, 0);
          };
        }
        function asap(task) {
          tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
          };
          if (!flushing) {
            flushing = true;
            requestFlush();
          }
        }
        ;
        module.exports = asap;
      }).call(this, require("_process"));
    }, {"_process": 2}],
    6: [function(require, module, exports) {
      (function() {
        'use strict';
        var Promise = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined') ? require("promise") : this.Promise;
        var indexedDB = indexedDB || this.indexedDB || this.webkitIndexedDB || this.mozIndexedDB || this.OIndexedDB || this.msIndexedDB;
        if (!indexedDB) {
          return ;
        }
        var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
        var supportsBlobs;
        function _createBlob(parts, properties) {
          parts = parts || [];
          properties = properties || {};
          try {
            return new Blob(parts, properties);
          } catch (e) {
            if (e.name !== 'TypeError') {
              throw e;
            }
            var BlobBuilder = window.BlobBuilder || window.MSBlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder;
            var builder = new BlobBuilder();
            for (var i = 0; i < parts.length; i += 1) {
              builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
          }
        }
        function _binStringToArrayBuffer(bin) {
          var length = bin.length;
          var buf = new ArrayBuffer(length);
          var arr = new Uint8Array(buf);
          for (var i = 0; i < length; i++) {
            arr[i] = bin.charCodeAt(i);
          }
          return buf;
        }
        function _blobAjax(url) {
          return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.withCredentials = true;
            xhr.responseType = 'arraybuffer';
            xhr.onreadystatechange = function() {
              if (xhr.readyState !== 4) {
                return ;
              }
              if (xhr.status === 200) {
                return resolve({
                  response: xhr.response,
                  type: xhr.getResponseHeader('Content-Type')
                });
              }
              reject({
                status: xhr.status,
                response: xhr.response
              });
            };
            xhr.send();
          });
        }
        function _checkBlobSupportWithoutCaching(idb) {
          return new Promise(function(resolve, reject) {
            var blob = _createBlob([''], {type: 'image/png'});
            var txn = idb.transaction([DETECT_BLOB_SUPPORT_STORE], 'readwrite');
            txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');
            txn.oncomplete = function() {
              var blobTxn = idb.transaction([DETECT_BLOB_SUPPORT_STORE], 'readwrite');
              var getBlobReq = blobTxn.objectStore(DETECT_BLOB_SUPPORT_STORE).get('key');
              getBlobReq.onerror = reject;
              getBlobReq.onsuccess = function(e) {
                var storedBlob = e.target.result;
                var url = URL.createObjectURL(storedBlob);
                _blobAjax(url).then(function(res) {
                  resolve(!!(res && res.type === 'image/png'));
                }, function() {
                  resolve(false);
                }).then(function() {
                  URL.revokeObjectURL(url);
                });
              };
            };
          }).catch(function() {
            return false;
          });
        }
        function _checkBlobSupport(idb) {
          if (typeof supportsBlobs === 'boolean') {
            return Promise.resolve(supportsBlobs);
          }
          return _checkBlobSupportWithoutCaching(idb).then(function(value) {
            supportsBlobs = value;
            return supportsBlobs;
          });
        }
        function _encodeBlob(blob) {
          return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = function(e) {
              var base64 = btoa(e.target.result || '');
              resolve({
                __local_forage_encoded_blob: true,
                data: base64,
                type: blob.type
              });
            };
            reader.readAsBinaryString(blob);
          });
        }
        function _decodeBlob(encodedBlob) {
          var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
          return _createBlob([arrayBuff], {type: encodedBlob.type});
        }
        function _isEncodedBlob(value) {
          return value && value.__local_forage_encoded_blob;
        }
        function _initStorage(options) {
          var self = this;
          var dbInfo = {db: null};
          if (options) {
            for (var i in options) {
              dbInfo[i] = options[i];
            }
          }
          return new Promise(function(resolve, reject) {
            var openreq = indexedDB.open(dbInfo.name, dbInfo.version);
            openreq.onerror = function() {
              reject(openreq.error);
            };
            openreq.onupgradeneeded = function(e) {
              openreq.result.createObjectStore(dbInfo.storeName);
              if (e.oldVersion <= 1) {
                openreq.result.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
              }
            };
            openreq.onsuccess = function() {
              dbInfo.db = openreq.result;
              self._dbInfo = dbInfo;
              resolve();
            };
          });
        }
        function getItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            window.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
              var req = store.get(key);
              req.onsuccess = function() {
                var value = req.result;
                if (value === undefined) {
                  value = null;
                }
                if (_isEncodedBlob(value)) {
                  value = _decodeBlob(value);
                }
                resolve(value);
              };
              req.onerror = function() {
                reject(req.error);
              };
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate(iterator, callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
              var req = store.openCursor();
              var iterationNumber = 1;
              req.onsuccess = function() {
                var cursor = req.result;
                if (cursor) {
                  var value = cursor.value;
                  if (_isEncodedBlob(value)) {
                    value = _decodeBlob(value);
                  }
                  var result = iterator(value, cursor.key, iterationNumber++);
                  if (result !== void(0)) {
                    resolve(result);
                  } else {
                    cursor.continue();
                  }
                } else {
                  resolve();
                }
              };
              req.onerror = function() {
                reject(req.error);
              };
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem(key, value, callback) {
          var self = this;
          if (typeof key !== 'string') {
            window.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            var dbInfo;
            self.ready().then(function() {
              dbInfo = self._dbInfo;
              return _checkBlobSupport(dbInfo.db);
            }).then(function(blobSupport) {
              if (!blobSupport && value instanceof Blob) {
                return _encodeBlob(value);
              }
              return value;
            }).then(function(value) {
              var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
              var store = transaction.objectStore(dbInfo.storeName);
              if (value === null) {
                value = undefined;
              }
              var req = store.put(value, key);
              transaction.oncomplete = function() {
                if (value === undefined) {
                  value = null;
                }
                resolve(value);
              };
              transaction.onabort = transaction.onerror = function() {
                var err = req.error ? req.error : req.transaction.error;
                reject(err);
              };
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function removeItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            window.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
              var store = transaction.objectStore(dbInfo.storeName);
              var req = store.delete(key);
              transaction.oncomplete = function() {
                resolve();
              };
              transaction.onerror = function() {
                reject(req.error);
              };
              transaction.onabort = function() {
                var err = req.error ? req.error : req.transaction.error;
                reject(err);
              };
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function clear(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
              var store = transaction.objectStore(dbInfo.storeName);
              var req = store.clear();
              transaction.oncomplete = function() {
                resolve();
              };
              transaction.onabort = transaction.onerror = function() {
                var err = req.error ? req.error : req.transaction.error;
                reject(err);
              };
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
              var req = store.count();
              req.onsuccess = function() {
                resolve(req.result);
              };
              req.onerror = function() {
                reject(req.error);
              };
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key(n, callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            if (n < 0) {
              resolve(null);
              return ;
            }
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
              var advanced = false;
              var req = store.openCursor();
              req.onsuccess = function() {
                var cursor = req.result;
                if (!cursor) {
                  resolve(null);
                  return ;
                }
                if (n === 0) {
                  resolve(cursor.key);
                } else {
                  if (!advanced) {
                    advanced = true;
                    cursor.advance(n);
                  } else {
                    resolve(cursor.key);
                  }
                }
              };
              req.onerror = function() {
                reject(req.error);
              };
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
              var req = store.openCursor();
              var keys = [];
              req.onsuccess = function() {
                var cursor = req.result;
                if (!cursor) {
                  resolve(keys);
                  return ;
                }
                keys.push(cursor.key);
                cursor.continue();
              };
              req.onerror = function() {
                reject(req.error);
              };
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function executeCallback(promise, callback) {
          if (callback) {
            promise.then(function(result) {
              callback(null, result);
            }, function(error) {
              callback(error);
            });
          }
        }
        var asyncStorage = {
          _driver: 'asyncStorage',
          _initStorage: _initStorage,
          iterate: iterate,
          getItem: getItem,
          setItem: setItem,
          removeItem: removeItem,
          clear: clear,
          length: length,
          key: key,
          keys: keys
        };
        if (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined') {
          module.exports = asyncStorage;
        } else if (typeof define === 'function' && define.amd) {
          define('asyncStorage', function() {
            return asyncStorage;
          });
        } else {
          this.asyncStorage = asyncStorage;
        }
      }).call(window);
    }, {"promise": 4}],
    7: [function(require, module, exports) {
      (function() {
        'use strict';
        var Promise = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined') ? require("promise") : this.Promise;
        var globalObject = this;
        var serializer = null;
        var localStorage = null;
        try {
          if (!this.localStorage || !('setItem' in this.localStorage)) {
            return ;
          }
          localStorage = this.localStorage;
        } catch (e) {
          return ;
        }
        var ModuleType = {
          DEFINE: 1,
          EXPORT: 2,
          WINDOW: 3
        };
        var moduleType = ModuleType.WINDOW;
        if (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined') {
          moduleType = ModuleType.EXPORT;
        } else if (typeof define === 'function' && define.amd) {
          moduleType = ModuleType.DEFINE;
        }
        function _initStorage(options) {
          var self = this;
          var dbInfo = {};
          if (options) {
            for (var i in options) {
              dbInfo[i] = options[i];
            }
          }
          dbInfo.keyPrefix = dbInfo.name + '/';
          self._dbInfo = dbInfo;
          var serializerPromise = new Promise(function(resolve) {
            if (moduleType === ModuleType.DEFINE) {
              require(['localforageSerializer'], resolve);
            } else if (moduleType === ModuleType.EXPORT) {
              resolve(require("./../utils/serializer"));
            } else {
              resolve(globalObject.localforageSerializer);
            }
          });
          return serializerPromise.then(function(lib) {
            serializer = lib;
            return Promise.resolve();
          });
        }
        function clear(callback) {
          var self = this;
          var promise = self.ready().then(function() {
            var keyPrefix = self._dbInfo.keyPrefix;
            for (var i = localStorage.length - 1; i >= 0; i--) {
              var key = localStorage.key(i);
              if (key.indexOf(keyPrefix) === 0) {
                localStorage.removeItem(key);
              }
            }
          });
          executeCallback(promise, callback);
          return promise;
        }
        function getItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            window.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = self.ready().then(function() {
            var dbInfo = self._dbInfo;
            var result = localStorage.getItem(dbInfo.keyPrefix + key);
            if (result) {
              result = serializer.deserialize(result);
            }
            return result;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate(iterator, callback) {
          var self = this;
          var promise = self.ready().then(function() {
            var keyPrefix = self._dbInfo.keyPrefix;
            var keyPrefixLength = keyPrefix.length;
            var length = localStorage.length;
            for (var i = 0; i < length; i++) {
              var key = localStorage.key(i);
              var value = localStorage.getItem(key);
              if (value) {
                value = serializer.deserialize(value);
              }
              value = iterator(value, key.substring(keyPrefixLength), i + 1);
              if (value !== void(0)) {
                return value;
              }
            }
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key(n, callback) {
          var self = this;
          var promise = self.ready().then(function() {
            var dbInfo = self._dbInfo;
            var result;
            try {
              result = localStorage.key(n);
            } catch (error) {
              result = null;
            }
            if (result) {
              result = result.substring(dbInfo.keyPrefix.length);
            }
            return result;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys(callback) {
          var self = this;
          var promise = self.ready().then(function() {
            var dbInfo = self._dbInfo;
            var length = localStorage.length;
            var keys = [];
            for (var i = 0; i < length; i++) {
              if (localStorage.key(i).indexOf(dbInfo.keyPrefix) === 0) {
                keys.push(localStorage.key(i).substring(dbInfo.keyPrefix.length));
              }
            }
            return keys;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length(callback) {
          var self = this;
          var promise = self.keys().then(function(keys) {
            return keys.length;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function removeItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            window.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = self.ready().then(function() {
            var dbInfo = self._dbInfo;
            localStorage.removeItem(dbInfo.keyPrefix + key);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem(key, value, callback) {
          var self = this;
          if (typeof key !== 'string') {
            window.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = self.ready().then(function() {
            if (value === undefined) {
              value = null;
            }
            var originalValue = value;
            return new Promise(function(resolve, reject) {
              serializer.serialize(value, function(value, error) {
                if (error) {
                  reject(error);
                } else {
                  try {
                    var dbInfo = self._dbInfo;
                    localStorage.setItem(dbInfo.keyPrefix + key, value);
                    resolve(originalValue);
                  } catch (e) {
                    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                      reject(e);
                    }
                    reject(e);
                  }
                }
              });
            });
          });
          executeCallback(promise, callback);
          return promise;
        }
        function executeCallback(promise, callback) {
          if (callback) {
            promise.then(function(result) {
              callback(null, result);
            }, function(error) {
              callback(error);
            });
          }
        }
        var localStorageWrapper = {
          _driver: 'localStorageWrapper',
          _initStorage: _initStorage,
          iterate: iterate,
          getItem: getItem,
          setItem: setItem,
          removeItem: removeItem,
          clear: clear,
          length: length,
          key: key,
          keys: keys
        };
        if (moduleType === ModuleType.EXPORT) {
          module.exports = localStorageWrapper;
        } else if (moduleType === ModuleType.DEFINE) {
          define('localStorageWrapper', function() {
            return localStorageWrapper;
          });
        } else {
          this.localStorageWrapper = localStorageWrapper;
        }
      }).call(window);
    }, {
      "./../utils/serializer": 10,
      "promise": 4
    }],
    8: [function(require, module, exports) {
      (function() {
        'use strict';
        var Promise = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined') ? require("promise") : this.Promise;
        var globalObject = this;
        var serializer = null;
        var openDatabase = this.openDatabase;
        if (!openDatabase) {
          return ;
        }
        var ModuleType = {
          DEFINE: 1,
          EXPORT: 2,
          WINDOW: 3
        };
        var moduleType = ModuleType.WINDOW;
        if (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined') {
          moduleType = ModuleType.EXPORT;
        } else if (typeof define === 'function' && define.amd) {
          moduleType = ModuleType.DEFINE;
        }
        function _initStorage(options) {
          var self = this;
          var dbInfo = {db: null};
          if (options) {
            for (var i in options) {
              dbInfo[i] = typeof(options[i]) !== 'string' ? options[i].toString() : options[i];
            }
          }
          var serializerPromise = new Promise(function(resolve) {
            if (moduleType === ModuleType.DEFINE) {
              require(['localforageSerializer'], resolve);
            } else if (moduleType === ModuleType.EXPORT) {
              resolve(require("./../utils/serializer"));
            } else {
              resolve(globalObject.localforageSerializer);
            }
          });
          var dbInfoPromise = new Promise(function(resolve, reject) {
            try {
              dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
            } catch (e) {
              return self.setDriver(self.LOCALSTORAGE).then(function() {
                return self._initStorage(options);
              }).then(resolve).catch(reject);
            }
            dbInfo.db.transaction(function(t) {
              t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' (id INTEGER PRIMARY KEY, key unique, value)', [], function() {
                self._dbInfo = dbInfo;
                resolve();
              }, function(t, error) {
                reject(error);
              });
            });
          });
          return serializerPromise.then(function(lib) {
            serializer = lib;
            return dbInfoPromise;
          });
        }
        function getItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            window.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function(t, results) {
                  var result = results.rows.length ? results.rows.item(0).value : null;
                  if (result) {
                    result = serializer.deserialize(result);
                  }
                  resolve(result);
                }, function(t, error) {
                  reject(error);
                });
              });
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate(iterator, callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('SELECT * FROM ' + dbInfo.storeName, [], function(t, results) {
                  var rows = results.rows;
                  var length = rows.length;
                  for (var i = 0; i < length; i++) {
                    var item = rows.item(i);
                    var result = item.value;
                    if (result) {
                      result = serializer.deserialize(result);
                    }
                    result = iterator(result, item.key, i + 1);
                    if (result !== void(0)) {
                      resolve(result);
                      return ;
                    }
                  }
                  resolve();
                }, function(t, error) {
                  reject(error);
                });
              });
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem(key, value, callback) {
          var self = this;
          if (typeof key !== 'string') {
            window.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              if (value === undefined) {
                value = null;
              }
              var originalValue = value;
              serializer.serialize(value, function(value, error) {
                if (error) {
                  reject(error);
                } else {
                  var dbInfo = self._dbInfo;
                  dbInfo.db.transaction(function(t) {
                    t.executeSql('INSERT OR REPLACE INTO ' + dbInfo.storeName + ' (key, value) VALUES (?, ?)', [key, value], function() {
                      resolve(originalValue);
                    }, function(t, error) {
                      reject(error);
                    });
                  }, function(sqlError) {
                    if (sqlError.code === sqlError.QUOTA_ERR) {
                      reject(sqlError);
                    }
                  });
                }
              });
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function removeItem(key, callback) {
          var self = this;
          if (typeof key !== 'string') {
            window.console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
          }
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function() {
                  resolve();
                }, function(t, error) {
                  reject(error);
                });
              });
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function clear(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('DELETE FROM ' + dbInfo.storeName, [], function() {
                  resolve();
                }, function(t, error) {
                  reject(error);
                });
              });
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function(t, results) {
                  var result = results.rows.item(0).c;
                  resolve(result);
                }, function(t, error) {
                  reject(error);
                });
              });
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key(n, callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function(t, results) {
                  var result = results.rows.length ? results.rows.item(0).key : null;
                  resolve(result);
                }, function(t, error) {
                  reject(error);
                });
              });
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys(callback) {
          var self = this;
          var promise = new Promise(function(resolve, reject) {
            self.ready().then(function() {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function(t) {
                t.executeSql('SELECT key FROM ' + dbInfo.storeName, [], function(t, results) {
                  var keys = [];
                  for (var i = 0; i < results.rows.length; i++) {
                    keys.push(results.rows.item(i).key);
                  }
                  resolve(keys);
                }, function(t, error) {
                  reject(error);
                });
              });
            }).catch(reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function executeCallback(promise, callback) {
          if (callback) {
            promise.then(function(result) {
              callback(null, result);
            }, function(error) {
              callback(error);
            });
          }
        }
        var webSQLStorage = {
          _driver: 'webSQLStorage',
          _initStorage: _initStorage,
          iterate: iterate,
          getItem: getItem,
          setItem: setItem,
          removeItem: removeItem,
          clear: clear,
          length: length,
          key: key,
          keys: keys
        };
        if (moduleType === ModuleType.DEFINE) {
          define('webSQLStorage', function() {
            return webSQLStorage;
          });
        } else if (moduleType === ModuleType.EXPORT) {
          module.exports = webSQLStorage;
        } else {
          this.webSQLStorage = webSQLStorage;
        }
      }).call(window);
    }, {
      "./../utils/serializer": 10,
      "promise": 4
    }],
    9: [function(require, module, exports) {
      (function() {
        'use strict';
        var Promise = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined') ? require("promise") : this.Promise;
        var CustomDrivers = {};
        var DriverType = {
          INDEXEDDB: 'asyncStorage',
          LOCALSTORAGE: 'localStorageWrapper',
          WEBSQL: 'webSQLStorage'
        };
        var DefaultDriverOrder = [DriverType.INDEXEDDB, DriverType.WEBSQL, DriverType.LOCALSTORAGE];
        var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'];
        var ModuleType = {
          DEFINE: 1,
          EXPORT: 2,
          WINDOW: 3
        };
        var DefaultConfig = {
          description: '',
          driver: DefaultDriverOrder.slice(),
          name: 'localforage',
          size: 4980736,
          storeName: 'keyvaluepairs',
          version: 1.0
        };
        var moduleType = ModuleType.WINDOW;
        if (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined') {
          moduleType = ModuleType.EXPORT;
        } else if (typeof define === 'function' && define.amd) {
          moduleType = ModuleType.DEFINE;
        }
        var driverSupport = (function(self) {
          var indexedDB = indexedDB || self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB || self.OIndexedDB || self.msIndexedDB;
          var result = {};
          result[DriverType.WEBSQL] = !!self.openDatabase;
          result[DriverType.INDEXEDDB] = !!(function() {
            if (typeof self.openDatabase !== 'undefined' && self.navigator && self.navigator.userAgent && /Safari/.test(self.navigator.userAgent) && !/Chrome/.test(self.navigator.userAgent)) {
              return false;
            }
            try {
              return indexedDB && typeof indexedDB.open === 'function' && typeof self.IDBKeyRange !== 'undefined';
            } catch (e) {
              return false;
            }
          })();
          result[DriverType.LOCALSTORAGE] = !!(function() {
            try {
              return (self.localStorage && ('setItem' in self.localStorage) && (self.localStorage.setItem));
            } catch (e) {
              return false;
            }
          })();
          return result;
        })(this);
        var isArray = Array.isArray || function(arg) {
          return Object.prototype.toString.call(arg) === '[object Array]';
        };
        function callWhenReady(localForageInstance, libraryMethod) {
          localForageInstance[libraryMethod] = function() {
            var _args = arguments;
            return localForageInstance.ready().then(function() {
              return localForageInstance[libraryMethod].apply(localForageInstance, _args);
            });
          };
        }
        function extend() {
          for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            if (arg) {
              for (var key in arg) {
                if (arg.hasOwnProperty(key)) {
                  if (isArray(arg[key])) {
                    arguments[0][key] = arg[key].slice();
                  } else {
                    arguments[0][key] = arg[key];
                  }
                }
              }
            }
          }
          return arguments[0];
        }
        function isLibraryDriver(driverName) {
          for (var driver in DriverType) {
            if (DriverType.hasOwnProperty(driver) && DriverType[driver] === driverName) {
              return true;
            }
          }
          return false;
        }
        var globalObject = this;
        function LocalForage(options) {
          this._config = extend({}, DefaultConfig, options);
          this._driverSet = null;
          this._ready = false;
          this._dbInfo = null;
          for (var i = 0; i < LibraryMethods.length; i++) {
            callWhenReady(this, LibraryMethods[i]);
          }
          this.setDriver(this._config.driver);
        }
        LocalForage.prototype.INDEXEDDB = DriverType.INDEXEDDB;
        LocalForage.prototype.LOCALSTORAGE = DriverType.LOCALSTORAGE;
        LocalForage.prototype.WEBSQL = DriverType.WEBSQL;
        LocalForage.prototype.config = function(options) {
          if (typeof(options) === 'object') {
            if (this._ready) {
              return new Error("Can't call config() after localforage " + 'has been used.');
            }
            for (var i in options) {
              if (i === 'storeName') {
                options[i] = options[i].replace(/\W/g, '_');
              }
              this._config[i] = options[i];
            }
            if ('driver' in options && options.driver) {
              this.setDriver(this._config.driver);
            }
            return true;
          } else if (typeof(options) === 'string') {
            return this._config[options];
          } else {
            return this._config;
          }
        };
        LocalForage.prototype.defineDriver = function(driverObject, callback, errorCallback) {
          var defineDriver = new Promise(function(resolve, reject) {
            try {
              var driverName = driverObject._driver;
              var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');
              var namingError = new Error('Custom driver name already in use: ' + driverObject._driver);
              if (!driverObject._driver) {
                reject(complianceError);
                return ;
              }
              if (isLibraryDriver(driverObject._driver)) {
                reject(namingError);
                return ;
              }
              var customDriverMethods = LibraryMethods.concat('_initStorage');
              for (var i = 0; i < customDriverMethods.length; i++) {
                var customDriverMethod = customDriverMethods[i];
                if (!customDriverMethod || !driverObject[customDriverMethod] || typeof driverObject[customDriverMethod] !== 'function') {
                  reject(complianceError);
                  return ;
                }
              }
              var supportPromise = Promise.resolve(true);
              if ('_support' in driverObject) {
                if (driverObject._support && typeof driverObject._support === 'function') {
                  supportPromise = driverObject._support();
                } else {
                  supportPromise = Promise.resolve(!!driverObject._support);
                }
              }
              supportPromise.then(function(supportResult) {
                driverSupport[driverName] = supportResult;
                CustomDrivers[driverName] = driverObject;
                resolve();
              }, reject);
            } catch (e) {
              reject(e);
            }
          });
          defineDriver.then(callback, errorCallback);
          return defineDriver;
        };
        LocalForage.prototype.driver = function() {
          return this._driver || null;
        };
        LocalForage.prototype.ready = function(callback) {
          var self = this;
          var ready = new Promise(function(resolve, reject) {
            self._driverSet.then(function() {
              if (self._ready === null) {
                self._ready = self._initStorage(self._config);
              }
              self._ready.then(resolve, reject);
            }).catch(reject);
          });
          ready.then(callback, callback);
          return ready;
        };
        LocalForage.prototype.setDriver = function(drivers, callback, errorCallback) {
          var self = this;
          if (typeof drivers === 'string') {
            drivers = [drivers];
          }
          this._driverSet = new Promise(function(resolve, reject) {
            var driverName = self._getFirstSupportedDriver(drivers);
            var error = new Error('No available storage method found.');
            if (!driverName) {
              self._driverSet = Promise.reject(error);
              reject(error);
              return ;
            }
            self._dbInfo = null;
            self._ready = null;
            if (isLibraryDriver(driverName)) {
              var driverPromise = new Promise(function(resolve) {
                if (moduleType === ModuleType.DEFINE) {
                  require([driverName], resolve);
                } else if (moduleType === ModuleType.EXPORT) {
                  switch (driverName) {
                    case self.INDEXEDDB:
                      resolve(require("./drivers/indexeddb"));
                      break;
                    case self.LOCALSTORAGE:
                      resolve(require("./drivers/localstorage"));
                      break;
                    case self.WEBSQL:
                      resolve(require("./drivers/websql"));
                      break;
                  }
                } else {
                  resolve(globalObject[driverName]);
                }
              });
              driverPromise.then(function(driver) {
                self._extend(driver);
                resolve();
              });
            } else if (CustomDrivers[driverName]) {
              self._extend(CustomDrivers[driverName]);
              resolve();
            } else {
              self._driverSet = Promise.reject(error);
              reject(error);
            }
          });
          function setDriverToConfig() {
            self._config.driver = self.driver();
          }
          this._driverSet.then(setDriverToConfig, setDriverToConfig);
          this._driverSet.then(callback, errorCallback);
          return this._driverSet;
        };
        LocalForage.prototype.supports = function(driverName) {
          return !!driverSupport[driverName];
        };
        LocalForage.prototype._extend = function(libraryMethodsAndProperties) {
          extend(this, libraryMethodsAndProperties);
        };
        LocalForage.prototype._getFirstSupportedDriver = function(drivers) {
          if (drivers && isArray(drivers)) {
            for (var i = 0; i < drivers.length; i++) {
              var driver = drivers[i];
              if (this.supports(driver)) {
                return driver;
              }
            }
          }
          return null;
        };
        LocalForage.prototype.createInstance = function(options) {
          return new LocalForage(options);
        };
        var localForage = new LocalForage();
        if (moduleType === ModuleType.DEFINE) {
          define('localforage', function() {
            return localForage;
          });
        } else if (moduleType === ModuleType.EXPORT) {
          module.exports = localForage;
        } else {
          this.localforage = localForage;
        }
      }).call(window);
    }, {
      "./drivers/indexeddb": 6,
      "./drivers/localstorage": 7,
      "./drivers/websql": 8,
      "promise": 4
    }],
    10: [function(require, module, exports) {
      (function() {
        'use strict';
        var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var BLOB_TYPE_PREFIX = '~~local_forage_type~';
        var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;
        var SERIALIZED_MARKER = '__lfsc__:';
        var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;
        var TYPE_ARRAYBUFFER = 'arbf';
        var TYPE_BLOB = 'blob';
        var TYPE_INT8ARRAY = 'si08';
        var TYPE_UINT8ARRAY = 'ui08';
        var TYPE_UINT8CLAMPEDARRAY = 'uic8';
        var TYPE_INT16ARRAY = 'si16';
        var TYPE_INT32ARRAY = 'si32';
        var TYPE_UINT16ARRAY = 'ur16';
        var TYPE_UINT32ARRAY = 'ui32';
        var TYPE_FLOAT32ARRAY = 'fl32';
        var TYPE_FLOAT64ARRAY = 'fl64';
        var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;
        var globalObject = this;
        function _createBlob(parts, properties) {
          parts = parts || [];
          properties = properties || {};
          try {
            return new Blob(parts, properties);
          } catch (err) {
            if (err.name !== 'TypeError') {
              throw err;
            }
            var BlobBuilder = globalObject.BlobBuilder || globalObject.MSBlobBuilder || globalObject.MozBlobBuilder || globalObject.WebKitBlobBuilder;
            var builder = new BlobBuilder();
            for (var i = 0; i < parts.length; i += 1) {
              builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
          }
        }
        function serialize(value, callback) {
          var valueString = '';
          if (value) {
            valueString = value.toString();
          }
          if (value && (value.toString() === '[object ArrayBuffer]' || value.buffer && value.buffer.toString() === '[object ArrayBuffer]')) {
            var buffer;
            var marker = SERIALIZED_MARKER;
            if (value instanceof ArrayBuffer) {
              buffer = value;
              marker += TYPE_ARRAYBUFFER;
            } else {
              buffer = value.buffer;
              if (valueString === '[object Int8Array]') {
                marker += TYPE_INT8ARRAY;
              } else if (valueString === '[object Uint8Array]') {
                marker += TYPE_UINT8ARRAY;
              } else if (valueString === '[object Uint8ClampedArray]') {
                marker += TYPE_UINT8CLAMPEDARRAY;
              } else if (valueString === '[object Int16Array]') {
                marker += TYPE_INT16ARRAY;
              } else if (valueString === '[object Uint16Array]') {
                marker += TYPE_UINT16ARRAY;
              } else if (valueString === '[object Int32Array]') {
                marker += TYPE_INT32ARRAY;
              } else if (valueString === '[object Uint32Array]') {
                marker += TYPE_UINT32ARRAY;
              } else if (valueString === '[object Float32Array]') {
                marker += TYPE_FLOAT32ARRAY;
              } else if (valueString === '[object Float64Array]') {
                marker += TYPE_FLOAT64ARRAY;
              } else {
                callback(new Error('Failed to get type for BinaryArray'));
              }
            }
            callback(marker + bufferToString(buffer));
          } else if (valueString === '[object Blob]') {
            var fileReader = new FileReader();
            fileReader.onload = function() {
              var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);
              callback(SERIALIZED_MARKER + TYPE_BLOB + str);
            };
            fileReader.readAsArrayBuffer(value);
          } else {
            try {
              callback(JSON.stringify(value));
            } catch (e) {
              console.error("Couldn't convert value into a JSON string: ", value);
              callback(null, e);
            }
          }
        }
        function deserialize(value) {
          if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
            return JSON.parse(value);
          }
          var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
          var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
          var blobType;
          if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
            var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
            blobType = matcher[1];
            serializedString = serializedString.substring(matcher[0].length);
          }
          var buffer = stringToBuffer(serializedString);
          switch (type) {
            case TYPE_ARRAYBUFFER:
              return buffer;
            case TYPE_BLOB:
              return _createBlob([buffer], {type: blobType});
            case TYPE_INT8ARRAY:
              return new Int8Array(buffer);
            case TYPE_UINT8ARRAY:
              return new Uint8Array(buffer);
            case TYPE_UINT8CLAMPEDARRAY:
              return new Uint8ClampedArray(buffer);
            case TYPE_INT16ARRAY:
              return new Int16Array(buffer);
            case TYPE_UINT16ARRAY:
              return new Uint16Array(buffer);
            case TYPE_INT32ARRAY:
              return new Int32Array(buffer);
            case TYPE_UINT32ARRAY:
              return new Uint32Array(buffer);
            case TYPE_FLOAT32ARRAY:
              return new Float32Array(buffer);
            case TYPE_FLOAT64ARRAY:
              return new Float64Array(buffer);
            default:
              throw new Error('Unkown type: ' + type);
          }
        }
        function stringToBuffer(serializedString) {
          var bufferLength = serializedString.length * 0.75;
          var len = serializedString.length;
          var i;
          var p = 0;
          var encoded1,
              encoded2,
              encoded3,
              encoded4;
          if (serializedString[serializedString.length - 1] === '=') {
            bufferLength--;
            if (serializedString[serializedString.length - 2] === '=') {
              bufferLength--;
            }
          }
          var buffer = new ArrayBuffer(bufferLength);
          var bytes = new Uint8Array(buffer);
          for (i = 0; i < len; i += 4) {
            encoded1 = BASE_CHARS.indexOf(serializedString[i]);
            encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
            encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
            encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
          }
          return buffer;
        }
        function bufferToString(buffer) {
          var bytes = new Uint8Array(buffer);
          var base64String = '';
          var i;
          for (i = 0; i < bytes.length; i += 3) {
            base64String += BASE_CHARS[bytes[i] >> 2];
            base64String += BASE_CHARS[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            base64String += BASE_CHARS[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
            base64String += BASE_CHARS[bytes[i + 2] & 63];
          }
          if ((bytes.length % 3) === 2) {
            base64String = base64String.substring(0, base64String.length - 1) + '=';
          } else if (bytes.length % 3 === 1) {
            base64String = base64String.substring(0, base64String.length - 2) + '==';
          }
          return base64String;
        }
        var localforageSerializer = {
          serialize: serialize,
          deserialize: deserialize,
          stringToBuffer: stringToBuffer,
          bufferToString: bufferToString
        };
        if (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined') {
          module.exports = localforageSerializer;
        } else if (typeof define === 'function' && define.amd) {
          define('localforageSerializer', function() {
            return localforageSerializer;
          });
        } else {
          this.localforageSerializer = localforageSerializer;
        }
      }).call(window);
    }, {}],
    11: [function(require, module, exports) {
      window.localforage = require("../dist/localforage");
    }, {"./../dist/localforage": 9}]
  }, {}, [1, 6, 7, 8, 9, 10, 11]);
})(require("process"));
