var AirportState, JUKEBOX, Jukebox, JukeboxState, Keyboard, Playlist, SPACE, SearchEngineState, SpaceshipState, TRACK, Track, WebAudioAPI, _Math, _THREE,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SPACE = SPACE || {};

SPACE.ENV = 'development';

SPACE.FPS = 30;

SPACE.pixelRatio = window.devicePixelRatio || 1;

SPACE.THREE = {};

SPACE.SC = (function() {
  var object;
  object = {};
  if (SPACE.ENV === 'development') {
    object.id = 'de0b8539b4ad2f6cc23dfe1cc6e0438d';
  } else {
    object.id = '807d28575c384e62a58be5c3a1446e68';
  }
  object.redirect_uri = window.location.origin;
  return object;
})();

SPACE.LOG = function(log, styles) {
  var date, dateStr, timeStr;
  if (styles == null) {
    styles = '';
  }
  if (!/(prod|production)/.test(SPACE.ENV)) {
    date = new Date();
    timeStr = date.toTimeString();
    timeStr = timeStr.substr(0, 8);
    dateStr = date.getDate() + '/';
    dateStr += (date.getMonth() + 1) + '/';
    dateStr += date.getFullYear();
    return console.log(dateStr + ' - ' + timeStr + ' | ' + log, styles);
  }
};

SPACE.TODO = function(message) {
  return SPACE.LOG('%cTODO | ' + message, 'color: #0088FF');
};

SPACE.ASSERT = function(condition, action) {
  if (condition) {
    action();
  }
  return condition;
};

JUKEBOX = {
  TRACK_ON_ADD: new Event('jukebox_track_on_add'),
  TRACK_ADDED: new Event('jukebox_track_added'),
  ON_PLAY: new Event('jukebox_on_play'),
  ON_STOP: new Event('jukebox_on_stop'),
  IS_PLAYING: new Event('jukebox_is_playing'),
  IS_STOPPED: new Event('jukebox_is_stopped'),
  IS_SEARCHING: new Event('jukebox_is_searching')
};

Object.freeze(JUKEBOX);

TRACK = {
  IS_PLAYING: new Event('track_is_playing'),
  IS_PAUSED: new Event('track_is_paused'),
  IS_STOPPED: new Event('track_is_stopped')
};

Object.freeze(TRACK);

Keyboard = {
  ENTER: 13,
  UP: 38,
  DOWN: 40,
  ESC: 27,
  DELETE: 46
};

SpaceshipState = {
  IDLE: 'idle',
  LAUNCHED: 'launched',
  IN_LOOP: 'in_loop',
  ARRIVED: 'arrived'
};

SearchEngineState = {
  OPENED: 'opened',
  CLOSED: 'closed',
  SEARCH: 'search',
  TRACK_SELECTED: 'track_selected'
};

JukeboxState = {
  IS_PLAYING: 'is_playing',
  IS_STOPPED: 'is_stopped'
};

AirportState = {
  IDLE: 'idle',
  SENDING: 'sending'
};

Object.freeze(Keyboard);

Object.freeze(SpaceshipState);

Object.freeze(SearchEngineState);

Object.freeze(JukeboxState);

Object.freeze(AirportState);

window.HELPER = window.HELPER || {
  events: {},
  trigger: function(eventname, object) {
    var e;
    if (!this.events.hasOwnProperty(eventname)) {
      this.events[eventname] = new Event(eventname);
    }
    e = this.events[eventname];
    e.object = object;
    return document.dispatchEvent(e);
  },
  retina: function(value) {
    var a, array, j, key, len, o, object;
    if (typeof value === 'object') {
      object = value;
      o = {};
      for (key in object) {
        value = object[key];
        if (typeof value === 'number') {
          o[key] = value * window.devicePixelRatio;
        }
      }
      return this.merge(object, o);
    } else if (typeof value === 'array') {
      array = value;
      a = [];
      for (key = j = 0, len = array.length; j < len; key = ++j) {
        value = array[key];
        if (typeof value === 'number') {
          a.push(value * window.devicePixelRatio);
        } else {
          a.push(value);
        }
      }
      return a;
    } else if (typeof value === 'number') {
      return value * window.devicePixelRatio;
    }
    return false;
  }
};

HELPER.Coffee = {
  shuffle: function(array) {
    tmp;
    var curr, rand, tmp;
    curr = array.length;
    while (0 !== curr) {
      rand = Math.floor(Math.random() * curr);
      curr -= 1;
      tmp = array[curr];
      array[curr] = array[rand];
      array[rand] = tmp;
    }
    return array;
  },
  merge: function(options, overrides) {
    return this.extend(this.extend({}, options), overrides);
  },
  extend: function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
    return object;
  }
};

_Math = _Math || {
  angleBetweenPoints: function(first, second) {
    var height, width;
    height = second.y - first.y;
    width = second.x - first.x;
    return Math.atan2(height, width);
  },
  distance: function(point1, point2) {
    var d, x, y;
    x = point1.x - point2.x;
    y = point1.y - point2.y;
    d = x * x + y * y;
    return Math.sqrt(d);
  },
  collision: function(dot1, dot2) {
    var dist, r1, r2;
    r1 = dot1.radius ? dot1.radius : 0;
    r2 = dot2.radius ? dot2.radius : 0;
    dist = r1 + r2;
    return this.distance(dot1.position, dot2.position) <= Math.sqrt(dist * dist);
  },
  map: function(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  },
  hermite: function(y0, y1, y2, y3, mu, tension, bias) {
    
    var m0,m1,mu2,mu3;
    var a0,a1,a2,a3;

    mu2 = mu * mu;
    mu3 = mu2 * mu;
    m0  = (y1-y0)*(1+bias)*(1-tension)/2;
    m0 += (y2-y1)*(1-bias)*(1-tension)/2;
    m1  = (y2-y1)*(1+bias)*(1-tension)/2;
    m1 += (y3-y2)*(1-bias)*(1-tension)/2;
    a0 =  2*mu3 - 3*mu2 + 1;
    a1 =    mu3 - 2*mu2 + mu;
    a2 =    mu3 -   mu2;
    a3 = -2*mu3 + 3*mu2;
    ;
    return a0 * y1 + a1 * m0 + a2 * m1 + a3 * y2;
  }
};

_THREE = _THREE || {
  HermiteCurve: function(pts) {
    var i, j, path, ref;
    path = new THREE.CurvePath();
    path.add(new THREE.HermiteBezierCurve3(pts[0], pts[0], pts[1], pts[2]));
    for (i = j = 0, ref = pts.length - 4; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      path.add(new THREE.HermiteBezierCurve3(pts[i], pts[i + 1], pts[i + 2], pts[i + 3]));
    }
    path.add(new THREE.HermiteBezierCurve3(pts[pts.length - 3], pts[pts.length - 2], pts[pts.length - 1], pts[pts.length - 1]));
    return path;
  }
};

THREE.Curve.Utils.tangentHermiteBezier = function(y0, y1, y2, y3, mu, tension, bias) {
  var a0, a1, a2, a3, m0, m1, mu2, mu3;
  mu2 = mu * mu;
  mu3 = mu2 * mu;
  m0 = (y1 - y0) * (1 + bias) * (1 - tension) / 2;
  m0 += (y2 - y1) * (1 - bias) * (1 - tension) / 2;
  m1 = (y2 - y1) * (1 + bias) * (1 - tension) / 2;
  m1 += (y3 - y2) * (1 - bias) * (1 - tension) / 2;
  a0 = 2 * mu3 - 3 * mu2 + 1;
  a1 = mu3 - 2 * mu2 + mu;
  a2 = mu3 - mu2;
  a3 = -2 * mu3 + 3 * mu2;
  return a0 * y1 + a1 * m0 + a2 * m1 + a3 * y2;
};

THREE.HermiteBezierCurve3 = THREE.Curve.create(function(v0, v1, v2, v3) {
  this.v0 = v0;
  this.v1 = v1;
  this.v2 = v2;
  this.v3 = v3;
}, function(t) {
  var vector;
  vector = new THREE.Vector3();
  vector.x = THREE.Curve.Utils.tangentHermiteBezier(this.v0.x, this.v1.x, this.v2.x, this.v3.x, t, 0, 0);
  vector.y = THREE.Curve.Utils.tangentHermiteBezier(this.v0.y, this.v1.y, this.v2.y, this.v3.y, t, 0, 0);
  vector.z = THREE.Curve.Utils.tangentHermiteBezier(this.v0.z, this.v1.z, this.v2.z, this.v3.z, t, 0, 0);
  return vector;
});

THREE.InLoopCurve = THREE.Curve.create(function(v0, startAngle, maxRadius, minRadius, inverse, useGolden) {
  if (startAngle == null) {
    startAngle = 0;
  }
  if (maxRadius == null) {
    maxRadius = 100;
  }
  if (minRadius == null) {
    minRadius = 0;
  }
  if (inverse == null) {
    inverse = false;
  }
  if (useGolden == null) {
    useGolden = false;
  }
  this.v0 = v0;
  this.inverse = inverse;
  this.startAngle = startAngle;
  this.maxRadius = maxRadius;
  this.minRadius = minRadius;
  this.radius = this.maxRadius - this.minRadius;
  this.useGolden = useGolden;
}, function(t) {
  var angle, golden_angle, phi, vector;
  if (this.inverse) {
    t = 1 - t;
  }
  if (this.useGolden) {
    phi = (Math.sqrt(5) + 1) / 2 - 1;
    golden_angle = phi * Math.PI * 2;
    angle = this.startAngle + (golden_angle * t);
    angle += Math.PI * -1.235;
  } else {
    angle = this.startAngle + (Math.PI * 2 * t);
  }
  vector = new THREE.Vector3();
  vector.x = this.v0.x + Math.cos(angle) * (this.minRadius + this.radius * t);
  vector.y = this.v0.y + Math.sin(angle) * (this.minRadius + this.radius * t);
  vector.z = this.v0.z;
  return vector;
});

THREE.LaunchedCurve = THREE.Curve.create(function(v0, v1, nbLoop) {
  if (nbLoop == null) {
    nbLoop = 2;
  }
  this.v0 = v0;
  this.v1 = v1;
  this.nbLoop = nbLoop;
}, function(t) {
  var angle, d, dist, vector;
  angle = Math.PI * 2 * t * this.nbLoop;
  d = this.v1.z - this.v0.z;
  dist = this.v1.clone().sub(this.v0);
  vector = new THREE.Vector3();
  vector.x = this.v0.x + dist.x * t;
  vector.y = this.v0.y + dist.y * t;
  vector.z = this.v0.z + dist.z * t;
  t = Math.min(t, 1 - t) / .5;
  vector.x += Math.cos(angle) * (50 * t);
  vector.y += Math.sin(angle) * (50 * t);
  return vector;
});

HELPER.Easing = {
  linear: function(p) {
    return p;
  },
  QuadraticEaseIn: function(p) {
    return p * p;
  },
  QuadraticEaseOut: function(p) {
    return -(p * (p - 2));
  },
  QuadraticEaseInOut: function(p) {
    if (p < 0.5) {
      return 2 * p * p;
    } else {
      return (-2 * p * p) + (4 * p) - 1;
    }
  },
  CubicEaseIn: function(p) {
    return p * p * p;
  },
  CubicEaseOut: function(p) {
    var f;
    f = p - 1;
    return f * f * f + 1;
  },
  CubicEaseInOut: function(p) {
    var f;
    if (p < 0.5) {
      return 4 * p * p * p;
    } else {
      f = (2 * p) - 2;
      return 0.5 * f * f * f + 1;
    }
  },
  QuarticEaseIn: function(p) {
    return p * p * p * p;
  },
  QuarticEaseOut: function(p) {
    var f;
    f = p - 1;
    return f * f * f * (1 - p) + 1;
  },
  QuarticEaseInOut: function(p) {
    var f;
    if (p < 0.5) {
      return 8 * p * p * p * p;
    } else {
      f = p - 1;
      return -8 * f * f * f * f + 1;
    }
  },
  QuinticEaseIn: function(p) {
    return p * p * p * p * p;
  },
  QuinticEaseOut: function(p) {
    var f;
    f = p - 1;
    return f * f * f * f * f + 1;
  },
  QuinticEaseInOut: function(p) {
    var f;
    if (p < 0.5) {
      return 16 * p * p * p * p * p;
    } else {
      f = (2 * p) - 2;
      return 0.5 * f * f * f * f * f + 1;
    }
  },
  SineEaseIn: function(p) {
    return Math.sin((p - 1) * Math.PI * 2) + 1;
  },
  SineEaseOut: function(p) {
    return Math.sin(p * Math.PI * 2);
  },
  SineEaseInOut: function(p) {
    return 0.5 * (1 - Math.cos(p * Math.PI));
  },
  CircularEaseIn: function(p) {
    return 1 - Math.sqrt(1 - (p * p));
  },
  CircularEaseOut: function(p) {
    return Math.sqrt((2 - p) * p);
  },
  CircularEaseInOut: function(p) {
    if (p < 0.5) {
      return 0.5 * (1 - Math.sqrt(1 - 4 * (p * p)));
    } else {
      return 0.5 * (Math.sqrt(-((2 * p) - 3) * ((2 * p) - 1)) + 1);
    }
  },
  ExponentialEaseIn: function(p) {
    if (p === 0.0) {
      return p;
    } else {
      return Math.pow(2, 10 * (p - 1));
    }
  },
  ExponentialEaseOut: function(p) {
    if (p === 1.0) {
      return p;
    } else {
      return 1 - Math.pow(2, -10 * p);
    }
  },
  ExponentialEaseInOut: function(p) {
    if (p === 0.0 || p === 1.0) {
      return p;
    }
    if (p < 0.5) {
      return 0.5 * Math.pow(2, (20 * p) - 10);
    } else {
      return -0.5 * Math.pow(2, (-20 * p) + 10) + 1;
    }
  },
  ElasticEaseIn: function(p) {
    return Math.sin(13 * Math.PI * 2 * p) * Math.pow(2, 10 * (p - 1));
  },
  ElasticEaseOut: function(p) {
    return Math.sin(-13 * Math.PI * 2 * (p + 1)) * Math.pow(2, -10 * p) + 1;
  },
  ElasticEaseInOut: function(p) {
    if (p < 0.5) {
      return 0.5 * Math.sin(13 * Math.PI * 2 * (2 * p)) * Math.pow(2, 10 * ((2 * p) - 1));
    } else {
      return 0.5 * (Math.sin(-13 * Math.PI * 2 * ((2 * p - 1) + 1)) * Math.pow(2, -10 * (2 * p - 1)) + 2);
    }
  },
  BackEaseIn: function(p) {
    return p * p * p - p * Math.sin(p * Math.PI);
  },
  BackEaseOut: function(p) {
    var f;
    f = 1 - p;
    return 1 - (f * f * f - f * Math.sin(f * Math.PI));
  },
  BackEaseInOut: function(p) {
    var f;
    if (p < 0.5) {
      f = 2 * p;
      return 0.5 * (f * f * f - f * Math.sin(f * Math.PI));
    } else {
      f = 1 - (2 * p - 1);
      return 0.5 * (1 - (f * f * f - f * Math.sin(f * Math.PI))) + 0.5;
    }
  },
  BounceEaseIn: function(p) {
    return 1 - this.BounceEaseOut(1 - p);
  },
  BounceEaseOut: function(p) {
    if (p < 4 / 11.0) {
      return (121 * p * p) / 16.0;
    } else if (p < 8 / 11.0) {
      return (363 / 40.0 * p * p) - (99 / 10.0 * p) + 17 / 5.0;
    } else if (p < 9 / 10.0) {
      return (4356 / 361.0 * p * p) - (35442 / 1805.0 * p) + 16061 / 1805.0;
    } else {
      return (54 / 5.0 * p * p) - (513 / 25.0 * p) + 268 / 25.0;
    }
  },
  BounceEaseInOut: function(p) {
    if (p < 0.5) {
      return 0.5 * this.BounceEaseIn(p * 2);
    } else {
      return 0.5 * this.BounceEaseOut(p * 2 - 1) + 0.5;
    }
  }
};

SPACE.Scene = (function(superClass) {
  extend(Scene, superClass);

  Scene.prototype._paused = true;

  function Scene() {
    this.resize = bind(this.resize, this);
    Scene.__super__.constructor.apply(this, arguments);
    this.type = 'Scene';
    this.fog = null;
    this.overrideMaterial = null;
    this.autoUpdate = true;
  }

  Scene.prototype.update = function(delta) {
    var child, j, len, ref, results1;
    ref = this.children;
    results1 = [];
    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j];
      results1.push(this.updateObj(child, delta));
    }
    return results1;
  };

  Scene.prototype.updateObj = function(obj, delta) {
    var child, j, len, ref, results1;
    if (typeof obj.update === 'function') {
      obj.update(delta);
    }
    if (obj.hasOwnProperty('children') && obj.children.length > 0) {
      ref = obj.children;
      results1 = [];
      for (j = 0, len = ref.length; j < len; j++) {
        child = ref[j];
        results1.push(this.updateObj(child, delta));
      }
      return results1;
    }
  };

  Scene.prototype.resize = function() {
    var child, j, len, ref, results1;
    ref = this.children;
    results1 = [];
    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j];
      results1.push(this.resizeObj(child));
    }
    return results1;
  };

  Scene.prototype.resizeObj = function(obj) {
    var child, j, len, ref, results1;
    if (typeof obj.resize === 'function') {
      obj.resize();
    }
    if (obj.hasOwnProperty('children') && obj.children.length > 0) {
      ref = obj.children;
      results1 = [];
      for (j = 0, len = ref.length; j < len; j++) {
        child = ref[j];
        results1.push(this.resizeObj(child));
      }
      return results1;
    }
  };

  Scene.prototype.resume = function() {
    return this._paused = false;
  };

  Scene.prototype.pause = function() {
    return this._paused = true;
  };

  Scene.prototype.isPaused = function() {
    return this._paused;
  };

  return Scene;

})(THREE.Scene);

SPACE.SceneManager = (function() {
  SceneManager.prototype.currentScene = null;

  SceneManager.prototype._scenes = null;

  SceneManager.prototype._stats = null;

  SceneManager.prototype._clock = null;

  SceneManager.prototype.renderer = null;

  SceneManager.prototype.camera = null;

  function SceneManager() {
    this._render = bind(this._render, this);
    this._eOnResize = bind(this._eOnResize, this);
    this._setup();
    this._events();
  }

  SceneManager.prototype.setPixelRatio = function(pixelRatio) {
    this.renderer.setPixelRatio(pixelRatio);
    return this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  SceneManager.prototype._setup = function() {
    this._clock = new THREE.Clock();
    this._scenes = [];
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('wrapper').appendChild(this.renderer.domElement);
    if (SPACE.ENV === 'development') {
      this._setupStats();
    }
    return this._render();
  };

  SceneManager.prototype._events = function() {
    return window.onresize = this._eOnResize;
  };

  SceneManager.prototype._eOnResize = function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    if (this.currentScene) {
      return this.currentScene.resize();
    }
  };

  SceneManager.prototype._setupStats = function() {
    this._stats = new Stats();
    this._stats.setMode(0);
    this._stats.domElement.style.position = 'absolute';
    this._stats.domElement.style.left = '0px';
    this._stats.domElement.style.top = '0px';
    return document.body.appendChild(this._stats.domElement);
  };

  SceneManager.prototype._render = function() {
    window.requestAnimationFrame(this._render);
    if (!this.currentScene || this.currentScene.isPaused()) {
      return;
    }
    this.currentScene.update(this._clock.getDelta() * 1000);
    this.renderer.render(this.currentScene, this.camera);
    if (SPACE.ENV === 'development') {
      return this._stats.update();
    }
  };

  SceneManager.prototype.createScene = function(identifier) {
    var e, scene;
    if (this._scenes[identifier]) {
      return this._scenes[identifier];
    }
    try {
      scene = new (eval("SPACE." + identifier))();
      this._scenes[identifier] = scene;
    } catch (_error) {
      e = _error;
      return false;
    }
    return scene;
  };

  SceneManager.prototype.goToScene = function(identifier) {
    if (this._scenes[identifier]) {
      if (this.currentScene) {
        this.currentScene.pause();
      }
      this.currentScene = this._scenes[identifier];
      this.currentScene.resume();
      return true;
    }
    alert("Scene '" + identifier + "' doesn't exist");
    return false;
  };

  return SceneManager;

})();

SPACE.MainScene = (function(superClass) {
  extend(MainScene, superClass);

  MainScene.prototype._manager = null;

  MainScene.prototype._jukebox = null;

  function MainScene() {
    this._fillJukebox = bind(this._fillJukebox, this);
    this._setup = bind(this._setup, this);
    this._ePlaylistLoaded = bind(this._ePlaylistLoaded, this);
    this._eSCIsConnected = bind(this._eSCIsConnected, this);
    MainScene.__super__.constructor.call(this);
  }

  MainScene.prototype.resume = function() {
    MainScene.__super__.resume.call(this);
    this._manager = SPACE.SceneManager;
    this._manager.camera.position.setZ(600);
    SPACE.SC = new SPACE.SoundCloud(SPACE.SC.id, SPACE.SC.redirect_uri);
    this._events();
    return this._setup();
  };

  MainScene.prototype.pause = function() {};

  MainScene.prototype._events = function() {
    document.addEventListener(SPACE.SoundCloud.IS_CONNECTED, this._eSCIsConnected);
    return document.addEventListener(SPACE.CoverController.PLAYLIST_LOADED, this._ePlaylistLoaded);
  };

  MainScene.prototype._eSCIsConnected = function() {
    return this._fillJukebox();
  };

  MainScene.prototype._ePlaylistLoaded = function() {
    if (SPACE.SC.isConnected()) {
      return this._fillJukebox();
    }
  };

  MainScene.prototype._setup = function() {
    var big, small;
    window.firstLaunch = true;
    this._jukebox = new Jukebox();
    SPACE.Jukebox = this._jukebox;
    small = new SPACE.Equalizer({
      minLength: 0,
      maxLength: 200,
      radius: 300,
      color: 0xFFFFFF,
      absolute: false,
      lineForceDown: .5,
      lineForceUp: 1,
      interpolationTime: 250
    });
    this.add(small);
    big = new SPACE.Equalizer({
      minLength: 0,
      maxLength: 50,
      radius: 300,
      color: 0xD1D1D1,
      absolute: false,
      lineForceDown: .5,
      lineForceUp: 1,
      interpolationTime: 250
    });
    this.add(big);
    this.cover = new SPACE.CoverController();
    return this.add(this.cover.view);
  };

  MainScene.prototype._fillJukebox = function() {
    var i, j, len, ref, results1, track;
    ref = this.cover.playlist;
    results1 = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      track = ref[i];
      results1.push(this._jukebox.add(track.url));
    }
    return results1;
  };

  return MainScene;

})(SPACE.Scene);

SPACE.SoundCloud = (function() {
  SoundCloud.prototype.client_id = null;

  SoundCloud.prototype.redirect_uri = null;

  SoundCloud.prototype.token = null;

  SoundCloud.IS_CONNECTED = 'soundcloud_connected';

  function SoundCloud(id, redirect_uri) {
    this._eClick = bind(this._eClick, this);
    SC.initialize({
      client_id: id,
      redirect_uri: redirect_uri
    });
    this.client_id = id;
    this.redirect_uri = redirect_uri;
    if (!this.isConnected() && SPACE.ENV === 'development') {
      document.cookie = "soundcloud_token=1-80269-11457116-04029a14bdfc286";
      document.cookie = "soundcloud_connected=true";
    }
  }

  SoundCloud.prototype.isConnected = function() {
    if (document.cookie.replace(/(?:(?:^|.*;\s*)soundcloud_connected\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
      document.querySelector('.login').classList.add('show');
      document.querySelector('.login').addEventListener('click', this._eClick);
    } else {
      this.token = document.cookie.replace(/(?:(?:^|.*;\s*)soundcloud_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      return true;
    }
    return false;
  };

  SoundCloud.prototype._eClick = function() {
    return SC.connect((function(_this) {
      return function() {
        _this.token = SC.accessToken();
        document.cookie = "soundcloud_token=" + _this.token;
        document.cookie = "soundcloud_connected=true";
        document.querySelector('.login').classList.remove('show');
        return HELPER.trigger(SPACE.SoundCloud.IS_CONNECTED);
      };
    })(this));
  };

  SoundCloud.prototype.pathOrUrl = function(path, callback) {
    if (/^\/(playlists|tracks|users)\/[0-9]+$/.test(path)) {
      return callback(path);
    }
    if (!/^(http|https)/.test(path)) {
      return console.log("\"" + path + "\" is not an url or a path");
    }
    return SC.get('/resolve', {
      url: path
    }, (function(_this) {
      return function(track, error) {
        var url;
        if (error) {
          return console.log(error.message);
        } else {
          url = ['', track.kind + 's', track.id].join('/');
          return callback(url);
        }
      };
    })(this));
  };

  SoundCloud.prototype.streamSound = function(object, options, callback) {
    var defaults, path;
    if (options == null) {
      options = {};
    }
    if (object && object.hasOwnProperty('kind')) {
      path = object.uri.replace('https://api.soundcloud.com', '');
      defaults = {
        autoPlay: true,
        useWaveformData: true,
        useHTML5audio: true,
        preferFlash: false
      };
      options = HELPER.Coffee.merge(defaults, options);
      return SC.stream(path, options, callback);
    }
  };

  SoundCloud.prototype.getSoundOrPlaylist = function(path, callback) {
    if (typeof path === 'object' && path.hasOwnProperty('kind')) {
      callback(path);
      return true;
    }
    return this.pathOrUrl(path, (function(_this) {
      return function(path) {
        return _this.get(path, callback);
      };
    })(this));
  };

  SoundCloud.prototype.get = function(path, callback) {
    return SC.get(path, callback);
  };

  SoundCloud.prototype.getSoundUrl = function(path, callback) {
    return this.getSoundOrPlaylist(path, (function(_this) {
      return function(sound) {
        return callback(sound.stream_url + '?oauth_token=' + _this.token);
      };
    })(this));
  };

  SoundCloud.prototype.search = function(search, path, callback) {
    if (typeof path === 'function') {
      callback = path;
      path = 'tracks';
    }
    if (path === 'users') {
      return this.pathOrUrl('https://soundcloud.com/' + search, (function(_this) {
        return function(path) {
          path = path + '/favorites?oauth_token=' + _this.token;
          return SC.get(path, callback);
        };
      })(this));
    } else {
      path = '/' + path + '?oauth_token=' + this.token + '&q=' + search;
      return SC.get(path, callback);
    }
  };

  return SoundCloud;

})();

SPACE.SearchEngine = (function() {
  SearchEngine.prototype.SC = null;

  SearchEngine.prototype.jukebox = null;

  SearchEngine.prototype.input = null;

  SearchEngine.prototype.list = null;

  SearchEngine.prototype.listContainer = null;

  SearchEngine.prototype.el = null;

  SearchEngine.prototype.lineHeight = 0;

  SearchEngine.prototype.resultsHeight = 0;

  SearchEngine.prototype.results = null;

  SearchEngine.prototype.focused = null;

  SearchEngine.prototype.scrollPos = 0;

  SearchEngine.state = null;

  function SearchEngine(jukebox) {
    this.focus = bind(this.focus, this);
    this._eKeypress = bind(this._eKeypress, this);
    this._eJukeboxIsSearching = bind(this._eJukeboxIsSearching, this);
    this.jukebox = jukebox;
    this.SC = SPACE.SC;
    this.el = document.querySelector('.search');
    this.input = document.querySelector('.search form input');
    this.list = document.querySelector('.search .list');
    this.listContainer = document.querySelector('.search ul');
    this.setState(SearchEngineState.CLOSED);
    this._events();
  }

  SearchEngine.prototype._events = function() {
    document.querySelector('.search form').addEventListener('submit', this._eJukeboxIsSearching);
    return document.addEventListener('keyup', this._eKeypress);
  };

  SearchEngine.prototype._eJukeboxIsSearching = function(e) {
    e.preventDefault();
    if (this.input.value.length > 0) {
      return this.search(this.input.value);
    }
  };

  SearchEngine.prototype._eKeypress = function(e) {
    switch (e.keyCode) {
      case Keyboard.ENTER:
        if (this.input.value.length === 0) {
          if (this.state === SearchEngineState.CLOSED) {
            return this.setState(SearchEngineState.OPENED);
          } else {
            return this.setState(SearchEngineState.CLOSED);
          }
        } else if (this.state === SearchEngineState.SEARCH && this.focused) {
          return this.setState(SearchEngineState.TRACK_SELECTED);
        } else if (this.state === SearchEngineState.TRACK_SELECTED) {
          return this.add();
        }
        break;
      case Keyboard.UP:
        if (this.state === SearchEngineState.SEARCH) {
          return this.up();
        }
        break;
      case Keyboard.DOWN:
        if (this.state === SearchEngineState.SEARCH) {
          return this.down();
        }
        break;
      case Keyboard.ESC:
      case Keyboard.DELETE:
        if (this.state === SearchEngineState.SEARCH) {
          return this.setState(SearchEngineState.OPENED);
        } else if (this.state === SearchEngineState.TRACK_SELECTED) {
          return this.setState(SearchEngineState.SEARCH);
        } else {
          return this.setState(SearchEngineState.CLOSED);
        }
        break;
      default:
        return false;
    }
  };

  SearchEngine.prototype.setState = function(state) {
    this.state = state;
    switch (this.state) {
      case SearchEngineState.OPENED:
        this.el.classList.remove('hidden');
        this.el.classList.remove('search_open');
        this.input.value = '';
        this.input.disabled = false;
        this.input.focus();
        return this.reset();
      case SearchEngineState.CLOSED:
        return this.el.classList.add('hidden');
      case SearchEngineState.SEARCH:
        this.el.classList.add('search_open');
        this.input.disabled = true;
        this.input.blur();
        this.lineHeight = this.listContainer.querySelector('li').offsetHeight;
        this.resultsHeight = this.lineHeight * (this.listContainer.querySelectorAll('li').length - 1);
        if (this.focused) {
          this.focused.classList.remove('selected');
        }
        return this.el.classList.remove('item_selected');
      case SearchEngineState.TRACK_SELECTED:
        this.focused.classList.add('selected');
        return this.el.classList.add('item_selected');
    }
  };

  SearchEngine.prototype.up = function() {
    var next;
    next = this.scrollPos + this.lineHeight;
    if (next <= 0) {
      this.scrollPos = next;
      return this.focus();
    }
  };

  SearchEngine.prototype.down = function() {
    var next;
    next = this.scrollPos - this.lineHeight;
    if (Math.abs(next) <= this.resultsHeight) {
      this.scrollPos = next;
      return this.focus();
    }
  };

  SearchEngine.prototype.focus = function() {
    var elm, pos;
    if (this.listContainer.querySelectorAll('li').length > 1) {
      $([this.listContainer, this.input]).css('transform', 'translate(0, ' + this.scrollPos + 'px)');
      pos = (this.scrollPos * -1) / (this.resultsHeight / (this.listContainer.querySelectorAll('li').length - 1));
      pos = Math.floor(pos);
      elm = this.el.querySelector('li:nth-child(' + (pos + 1) + ')');
      if (elm.getAttribute('data-index')) {
        if (this.focused) {
          this.focused.classList.remove('focused');
        }
        this.focused = elm;
        return this.focused.classList.add('focused');
      } else {
        return this.focused = null;
      }
    } else {
      return this.setState(SearchEngineState.OPENED);
    }
  };

  SearchEngine.prototype.reset = function() {
    this.focused = null;
    this.scrollPos = 0;
    $([this.listContainer, this.input]).css('transform', 'translate(0, ' + this.scrollPos + 'px)');
    return this.listContainer.innerHTML = '';
  };

  SearchEngine.prototype.add = function() {
    var index, track;
    index = this.focused.getAttribute('data-index');
    track = this.results[index];
    if (track) {
      this.jukebox.add(track);
    }
    this.focused.classList.add('added');
    $(this.focused).css({
      'transform': 'scale(.75) translateX(' + window.innerWidth + 'px)'
    });
    return setTimeout((function(_this) {
      return function() {
        _this.focused.remove();
        _this.setState(SearchEngineState.SEARCH);
        if (_this.focused.nextSibling) {
          _this.up();
        }
        return _this.focus();
      };
    })(this), 500);
  };

  SearchEngine.prototype.search = function(value) {
    var lastChar, path, results, string;
    path = value.split(/\s/)[0];
    if (/^(track|tracks|playlist|playlists|set|sets|user|users)$/.test(path)) {
      lastChar = path.charAt(path.length - 1);
      value = value.replace(path + ' ', '');
      if (lastChar !== 's') {
        path += 's';
      }
      if (/sets/.test(path)) {
        path = 'playlists';
      }
    } else {
      path = 'tracks';
    }
    string = '[\n  {"kind":"track","id":63256906,"created_at":"2012/10/13 10:47:16 +0000","user_id":788205,"duration":237840,"commentable":true,"state":"finished","original_content_size":9543168,"last_modified":"2014/12/22 21:01:17 +0000","sharing":"public","tag_list":"","permalink":"janet-jackson-if-kaytranada","streamable":true,"embeddable_by":"all","downloadable":true,"purchase_url":"https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_id":null,"purchase_title":"Alternate Version DL","genre":"Poplockin Music","title":"Janet Jackson - If (Kaytranada Remix)","description":"Alternate Version, for DJs, well, thats the version i use for my dj sets; https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_name":"","release":"","track_type":"remix","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/63256906","user":{"id":788205,"kind":"user","permalink":"kaytranada","username":"KAYTRANADA","last_modified":"2014/11/07 04:11:36 +0000","uri":"https://api.soundcloud.com/users/788205","permalink_url":"http://soundcloud.com/kaytranada","avatar_url":"https://i1.sndcdn.com/avatars-000074803694-qibxt4-large.jpg"},"user_playback_count":1,"user_favorite":true,"permalink_url":"http://soundcloud.com/kaytranada/janet-jackson-if-kaytranada","artwork_url":"https://i1.sndcdn.com/artworks-000032094597-56ts7n-large.jpg","waveform_url":"https://w1.sndcdn.com/aqRGi4DmbCWz_m.png","stream_url":"https://api.soundcloud.com/tracks/63256906/stream","download_url":"https://api.soundcloud.com/tracks/63256906/download","playback_count":3331033,"download_count":96112,"favoritings_count":66653,"comment_count":1594,"attachments_uri":"https://api.soundcloud.com/tracks/63256906/attachments","policy":"ALLOW"},\n  {"kind":"track","id":63256906,"created_at":"2012/10/13 10:47:16 +0000","user_id":788205,"duration":237840,"commentable":true,"state":"finished","original_content_size":9543168,"last_modified":"2014/12/22 21:01:17 +0000","sharing":"public","tag_list":"","permalink":"janet-jackson-if-kaytranada","streamable":true,"embeddable_by":"all","downloadable":true,"purchase_url":"https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_id":null,"purchase_title":"Alternate Version DL","genre":"Poplockin Music","title":"Janet Jackson - If (Kaytranada Remix)","description":"Alternate Version, for DJs, well, thats the version i use for my dj sets; https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_name":"","release":"","track_type":"remix","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/63256906","user":{"id":788205,"kind":"user","permalink":"kaytranada","username":"KAYTRANADA","last_modified":"2014/11/07 04:11:36 +0000","uri":"https://api.soundcloud.com/users/788205","permalink_url":"http://soundcloud.com/kaytranada","avatar_url":"https://i1.sndcdn.com/avatars-000074803694-qibxt4-large.jpg"},"user_playback_count":1,"user_favorite":true,"permalink_url":"http://soundcloud.com/kaytranada/janet-jackson-if-kaytranada","artwork_url":"https://i1.sndcdn.com/artworks-000032094597-56ts7n-large.jpg","waveform_url":"https://w1.sndcdn.com/aqRGi4DmbCWz_m.png","stream_url":"https://api.soundcloud.com/tracks/63256906/stream","download_url":"https://api.soundcloud.com/tracks/63256906/download","playback_count":3331033,"download_count":96112,"favoritings_count":66653,"comment_count":1594,"attachments_uri":"https://api.soundcloud.com/tracks/63256906/attachments","policy":"ALLOW"},\n  {"kind":"track","id":63256906,"created_at":"2012/10/13 10:47:16 +0000","user_id":788205,"duration":237840,"commentable":true,"state":"finished","original_content_size":9543168,"last_modified":"2014/12/22 21:01:17 +0000","sharing":"public","tag_list":"","permalink":"janet-jackson-if-kaytranada","streamable":true,"embeddable_by":"all","downloadable":true,"purchase_url":"https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_id":null,"purchase_title":"Alternate Version DL","genre":"Poplockin Music","title":"Janet Jackson - If (Kaytranada Remix)","description":"Alternate Version, for DJs, well, thats the version i use for my dj sets; https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_name":"","release":"","track_type":"remix","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/63256906","user":{"id":788205,"kind":"user","permalink":"kaytranada","username":"KAYTRANADA","last_modified":"2014/11/07 04:11:36 +0000","uri":"https://api.soundcloud.com/users/788205","permalink_url":"http://soundcloud.com/kaytranada","avatar_url":"https://i1.sndcdn.com/avatars-000074803694-qibxt4-large.jpg"},"user_playback_count":1,"user_favorite":true,"permalink_url":"http://soundcloud.com/kaytranada/janet-jackson-if-kaytranada","artwork_url":"https://i1.sndcdn.com/artworks-000032094597-56ts7n-large.jpg","waveform_url":"https://w1.sndcdn.com/aqRGi4DmbCWz_m.png","stream_url":"https://api.soundcloud.com/tracks/63256906/stream","download_url":"https://api.soundcloud.com/tracks/63256906/download","playback_count":3331033,"download_count":96112,"favoritings_count":66653,"comment_count":1594,"attachments_uri":"https://api.soundcloud.com/tracks/63256906/attachments","policy":"ALLOW"},\n  {"kind":"track","id":63256906,"created_at":"2012/10/13 10:47:16 +0000","user_id":788205,"duration":237840,"commentable":true,"state":"finished","original_content_size":9543168,"last_modified":"2014/12/22 21:01:17 +0000","sharing":"public","tag_list":"","permalink":"janet-jackson-if-kaytranada","streamable":true,"embeddable_by":"all","downloadable":true,"purchase_url":"https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_id":null,"purchase_title":"Alternate Version DL","genre":"Poplockin Music","title":"Janet Jackson - If (Kaytranada Remix)","description":"Alternate Version, for DJs, well, thats the version i use for my dj sets; https://www.dropbox.com/s/yua1lj16zs44rzl/Janet%20Jackson%20-%20If%20Kaytranada%20Live%20Set%20Version.mp3","label_name":"","release":"","track_type":"remix","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/63256906","user":{"id":788205,"kind":"user","permalink":"kaytranada","username":"KAYTRANADA","last_modified":"2014/11/07 04:11:36 +0000","uri":"https://api.soundcloud.com/users/788205","permalink_url":"http://soundcloud.com/kaytranada","avatar_url":"https://i1.sndcdn.com/avatars-000074803694-qibxt4-large.jpg"},"user_playback_count":1,"user_favorite":true,"permalink_url":"http://soundcloud.com/kaytranada/janet-jackson-if-kaytranada","artwork_url":"https://i1.sndcdn.com/artworks-000032094597-56ts7n-large.jpg","waveform_url":"https://w1.sndcdn.com/aqRGi4DmbCWz_m.png","stream_url":"https://api.soundcloud.com/tracks/63256906/stream","download_url":"https://api.soundcloud.com/tracks/63256906/download","playback_count":3331033,"download_count":96112,"favoritings_count":66653,"comment_count":1594,"attachments_uri":"https://api.soundcloud.com/tracks/63256906/attachments","policy":"ALLOW"}\n]';
    results = JSON.parse(string);
    this.input.value = 'Looking for "' + value + '"';
    return this.SC.search(value, path, (function(_this) {
      return function(results) {
        var artwork_url, i, j, len, li, track;
        console.log(results);
        if (results.length === 0) {
          _this.input.value = '"' + value + '" has no result';
          return;
        } else {
          _this.input.value = 'Results for "' + value + '"';
        }
        _this.results = [];
        _this.listContainer.appendChild(document.createElement('li'));
        for (i = j = 0, len = results.length; j < len; i = ++j) {
          track = results[i];
          li = document.createElement('li');
          li.setAttribute('data-index', i);
          artwork_url = track.artwork_url;
          if (!artwork_url) {
            artwork_url = 'images/no_artwork.gif';
          }
          li.innerHTML = "<div>\n  <img src=\"" + artwork_url + "\" alt=\"\" onerror=\"this.src='images/no_artwork.gif'\">\n  <div>\n    <p>" + track.title + "</p>\n    <p>" + (track.user.username.toLowerCase()) + "</p>\n  </div>\n</div>";
          _this.results.push(track);
          _this.listContainer.appendChild(li);
        }
        return _this.setState(SearchEngineState.SEARCH);
      };
    })(this));
  };

  return SearchEngine;

})();

Jukebox = (function() {
  Jukebox.IS_WAITING = 'jukebox_is_waiting';

  Jukebox.IS_QUEUING = 'jukebox_is_queuing';

  Jukebox.prototype.current = null;

  Jukebox.prototype.playlist = null;

  Jukebox.prototype.SC = null;

  Jukebox.prototype.state = null;

  Jukebox.prototype._nextDelay = 1750;

  Jukebox.prototype._nextTimeout = null;

  Jukebox.prototype._refreshDelay = 1000;

  Jukebox.prototype._loadingQueue = null;

  Jukebox.prototype._isLoading = false;

  function Jukebox() {
    this._refresh = bind(this._refresh, this);
    this._eTrackIsStopped = bind(this._eTrackIsStopped, this);
    this.playlist = [];
    this._loadingQueue = [];
    this.SC = SPACE.SC;
    this.inputType = 'WebAudioAPI';
    this.setState(Jukebox.IS_WAITING);
    this._refresh();
    this._events();
  }

  Jukebox.prototype._events = function() {
    return document.addEventListener(Track.IS_STOPPED, this._eTrackIsStopped);
  };

  Jukebox.prototype._eTrackIsStopped = function() {
    return this.setState(Jukebox.IS_WAITING);
  };

  Jukebox.prototype.setState = function(state) {
    this.state = state;
    switch (this.state) {
      case Jukebox.IS_WAITING:
        return HELPER.trigger(Jukebox.IS_WAITING, {
          jukebox: this
        });
      case Jukebox.IS_QUEUING:
        return HELPER.trigger(Jukebox.IS_QUEUING, {
          jukebox: this
        });
    }
  };

  Jukebox.prototype._refresh = function() {
    if (this.playlist.length > 0 && this.state === Jukebox.IS_WAITING) {
      this.next();
    }
    return setTimeout(this._refresh, this._refreshDelay);
  };

  Jukebox.prototype.add = function(urlOrInput) {
    this._loadingQueue.push(urlOrInput);
    if (!this.isLoading) {
      return this._load(this._loadingQueue.shift());
    }
  };

  Jukebox.prototype._load = function(url) {
    this.isLoading = true;
    return Track.create(url, (function(_this) {
      return function(tracks, url) {
        _this.playlist = _this.playlist.concat(tracks);
        if (_this._loadingQueue.length > 0) {
          return _this._load(_this._loadingQueue.shift());
        } else {
          return _this.isLoading = false;
        }
      };
    })(this));
  };

  Jukebox.prototype.remove = function(index) {
    if (this.inputType === 'Microphone') {
      return;
    }
    return this.playlist.splice(index, 1);
  };

  Jukebox.prototype.move = function(index1, index2) {
    var tmp;
    if (this.inputType === 'Microphone') {
      return;
    }
    tmp = this.playlist[index1];
    this.playlist[index1] = this.playlist[index2];
    return this.playlist[index2] = tmp;
  };

  Jukebox.prototype.search = function(value) {
    if (this.inputType === 'Microphone') {
      return;
    }
    return this.searchEngine.search(value);
  };

  Jukebox.prototype.next = function() {
    var canPlay;
    if (this.inputType === 'Microphone') {
      return false;
    }
    if (this.current) {
      this.current.stop();
    }
    canPlay = this.playlist.length > 0;
    canPlay = canPlay && this.state === Jukebox.IS_WAITING;
    canPlay = canPlay && !this._nextTimeout;
    if (canPlay) {
      this.current = this.playlist.shift();
      this.setState(Jukebox.IS_QUEUING);
      this._nextTimeout = setTimeout((function(_this) {
        return function() {
          _this.current.stream();
          return _this._nextTimeout = null;
        };
      })(this), this._nextDelay);
      return true;
    }
    return false;
  };

  return Jukebox;

})();

Track = (function() {
  Track.IS_WAITING = 'track_is_waiting';

  Track.WILL_PLAY = 'track_will_play';

  Track.IS_PLAYING = 'track_is_playing';

  Track.IS_PAUSED = 'track_is_paused';

  Track.IS_STOPPED = 'track_is_stopped';

  Track.Source = {
    SoundCloud: 'SoundCloud',
    MP3: 'MP3',
    Input: 'Input'
  };

  Track.API = {
    SoundManager2: 'SoundManager2',
    WebAudioAPI: 'WebAudioAPI',
    JSON: 'JSON'
  };

  Track.create = function(sourceUrl, callback) {
    var isPlaylist, j, len, track, tracks, url, urls;
    tracks = [];
    if (typeof sourceUrl === 'boolean' && sourceUrl === true) {
      track = new Track();
      tracks.push(track);
    } else if (/(\.mp3)/gi.test(sourceUrl)) {
      urls = [sourceUrl];
      isPlaylist = false;
      if (typeof sourceUrl === 'array') {
        urls = sourceUrl;
        isPlaylist = true;
      }
      for (j = 0, len = urls.length; j < len; j++) {
        url = urls[j];
        track = new Track({
          source: Track.Source.MP3,
          url: url,
          is_playlist: isPlaylist,
          source_url: sourceUrl
        });
        tracks.push(track);
      }
    } else if (/(soundcloud)/gi.test(sourceUrl)) {
      SPACE.SC.getSoundOrPlaylist(sourceUrl, (function(_this) {
        return function(o) {
          var data, k, len1, scTracks;
          scTracks = [o];
          isPlaylist = false;
          if (o.hasOwnProperty('tracks')) {
            scTracks = o.tracks;
            isPlaylist = true;
          }
          for (k = 0, len1 = scTracks.length; k < len1; k++) {
            data = scTracks[k];
            track = new Track({
              api: Track.API.SoundManager2,
              source: Track.Source.SoundCloud,
              sc_object: data,
              is_playlist: isPlaylist,
              source_url: sourceUrl,
              title: data.title,
              author_name: data.user.username,
              author_url: data.user.permalink_url,
              cover_url: data.artwork_url,
              url: data.stream_url
            });
            if (isPlaylist) {
              track.mergeData({
                playlist: o
              });
            }
            tracks.push(track);
          }
          return callback(tracks);
        };
      })(this));
      return;
    }
    return callback(tracks);
  };

  Track.prototype.data = null;

  Track.prototype.api = null;

  Track.prototype.autoplay = false;

  Track.prototype.loaded = 0;

  function Track(data) {
    this._whileplaying = bind(this._whileplaying, this);
    this._whileloading = bind(this._whileloading, this);
    this._onended = bind(this._onended, this);
    this._onstop = bind(this._onstop, this);
    this._onpause = bind(this._onpause, this);
    this._onplay = bind(this._onplay, this);
    this._onstart = bind(this._onstart, this);
    this._webaudioapi = bind(this._webaudioapi, this);
    this.data = {
      title: null,
      author_name: null,
      author_url: null,
      cover_url: null,
      url: null,
      is_playlist: false,
      api: Track.API.WebAudioAPI,
      source: Track.Source.Input,
      timedata: []
    };
    this.data = HELPER.Coffee.merge(this.data, data);
    this._muteTimedata();
    this._setState(Track.IS_WAITING);
  }

  Track.prototype.mergeData = function(extra) {
    return this.data = HELPER.Coffee.merge(this.data, extra);
  };

  Track.prototype._setState = function(state) {
    this.state = state;
    switch (this.state) {
      case Track.IS_WAITING:
        return HELPER.trigger(Track.IS_WAITING, {
          track: this
        });
      case Track.WILL_PLAY:
        this._muteTimedata();
        return HELPER.trigger(Track.WILL_PLAY, {
          track: this
        });
      case Track.IS_PLAYING:
        return HELPER.trigger(Track.IS_PLAYING, {
          track: this
        });
      case Track.IS_PAUSED:
        this._muteTimedata();
        return HELPER.trigger(Track.IS_PAUSED, {
          track: this
        });
      case Track.IS_STOPPED:
        this._muteTimedata();
        return HELPER.trigger(Track.IS_STOPPED, {
          track: this
        });
    }
  };

  Track.prototype.getTimedata = function() {
    return this.data.timedata;
  };

  Track.prototype.stream = function() {
    this._setState(Track.WILL_PLAY);
    if (this.data.api === Track.API.SoundManager2) {
      return this._soundmanager2();
    } else {
      return this._webaudioapi();
    }
  };

  Track.prototype.play = function() {
    return this.api.play();
  };

  Track.prototype.pause = function() {
    return this.api.pause();
  };

  Track.prototype.stop = function() {
    return this.api.stop();
  };

  Track.prototype.volume = function(value) {
    if (this.data.api === Track.API.SoundManager2) {
      value *= 100;
    }
    return this.api.setVolume(value);
  };

  Track.prototype.destroy = function() {
    return this.api.destruct();
  };

  Track.prototype._webaudioapi = function() {
    var firstLaunch;
    if (!window.firstLaunch) {
      firstLaunch = false;
      if (/mobile/gi.test(navigator.userAgent)) {
        this.autoplay = false;
      }
    } else {
      this.autoplay = true;
    }
    this.api = WebAudioAPI;
    this.api.onplay = this._onplay;
    this.api.onended = this._onended;
    this.api.onpause = this._onpause;
    this.api.onstop = this._onstop;
    this.api.onaudioprocess = this._whileplaying;
    this.api.onloadingprogress = this._whileloading;
    if (this.data.source === Track.Source.Input) {
      this.api.inputMode = true;
      return this.api.streamInput();
    } else {
      this.api.inputMode = false;
      return this.api.setUrl(this.data.url, this.autoplay, this._onstart);
    }
  };

  Track.prototype._soundmanager2 = function() {
    return SPACE.SC.streamSound(this.data.sc_object, {
      onplay: this._onplay,
      onfinish: this._onended,
      onstop: this._onstop,
      whileplaying: this._whileplaying,
      whileloading: (function(_this) {
        return function() {
          return _this._whileloading(_this.api.bytesLoaded / _this.api.bytesTotal);
        };
      })(this)
    }, this._onstart);
  };

  Track.prototype._muteTimedata = function() {
    var i, j, results1;
    this.data.timedata = Array(256);
    results1 = [];
    for (i = j = 0; j <= 255; i = ++j) {
      results1.push(this.data.timedata[i] = 0);
    }
    return results1;
  };

  Track.prototype._onstart = function(api) {
    this.api = api;
    return window.AudioAPI = api;
  };

  Track.prototype._onplay = function() {
    return this._setState(Track.IS_PLAYING);
  };

  Track.prototype._onpause = function() {
    return this._setState(Track.IS_PAUSED);
  };

  Track.prototype._onstop = function() {
    return this._setState(Track.IS_STOPPED);
  };

  Track.prototype._onended = function() {
    return this._setState(Track.IS_STOPPED);
  };

  Track.prototype._whileloading = function(value) {
    return this.loaded = value;
  };

  Track.prototype._whileplaying = function() {
    var analyser, array, i, j, k, l, timedata;
    timedata = this.data.timedata;
    switch (this.data.api) {
      case Track.API.SoundManager2:
        for (i = j = 0; j <= 255; i = ++j) {
          timedata[i] = Math.max(this.api.waveformData.left[i], this.api.waveformData.right[i]);
        }
        break;
      case Track.API.WebAudioAPI:
        analyser = this.api.analyser;
        if (!analyser.getFloatTimeDomainData) {
          array = new Uint8Array(analyser.fftSize);
          analyser.getByteTimeDomainData(array);
          for (i = k = 0; k <= 255; i = ++k) {
            timedata[i] = (array[i] - 128) / 128;
          }
        } else {
          array = new Float32Array(analyser.fftSize);
          analyser.getFloatTimeDomainData(array);
          for (i = l = 0; l <= 255; i = ++l) {
            timedata[i] = array[i];
          }
        }
    }
    return this.data.timedata = timedata;
  };

  return Track;

})();

WebAudioAPI = (function() {
  WebAudioAPI.IS_PLAYING = 'webaudioapi_is_playing';

  WebAudioAPI.IS_PAUSED = 'webaudioapi_is_paused';

  WebAudioAPI.IS_STOPPED = 'webaudioapi_is_stopped';

  WebAudioAPI.IS_ENDED = 'webaudioapi_is_ended';

  WebAudioAPI.prototype.identifier = 'WebAudioAPI';

  WebAudioAPI.prototype.ctx = null;

  WebAudioAPI.prototype.analyser = null;

  WebAudioAPI.prototype.processor = null;

  WebAudioAPI.prototype.buffer = null;

  WebAudioAPI.prototype.src = null;

  WebAudioAPI.prototype.startTime = 0;

  WebAudioAPI.prototype.position = 0;

  WebAudioAPI.prototype.duration = 0;

  WebAudioAPI.prototype.time = 0;

  WebAudioAPI.prototype.isLoaded = false;

  WebAudioAPI.prototype.state = null;

  WebAudioAPI.prototype._vendorURL = null;

  WebAudioAPI.prototype._inputMode = false;

  function WebAudioAPI() {
    this._onEnded = bind(this._onEnded, this);
    this._onAudioProcess = bind(this._onAudioProcess, this);
    var e;
    try {
      if (window.AudioContextObject === void 0) {
        window.AudioContextObject = new (window.AudioContext || window.webkitAudioContext)();
      }
    } catch (_error) {
      e = _error;
      if (App.env === 'development') {
        console.log("HTML5 Web Audio API not supported. Switch to SoundManager2.");
      }
    }
    this.ctx = AudioContextObject;
    this._oldBrowser();
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    this._vendorURL = window.URL || window.webkitURL;
    this.setState(WebAudioAPI.IS_ENDED);
  }

  WebAudioAPI.prototype.setUrl = function(url, autoplay, callback) {
    var request;
    if (autoplay == null) {
      autoplay = false;
    }
    if (this.inputMode) {
      alert('Disable input mode');
      return;
    }
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.withCredentials = false;
    request.onload = (function(_this) {
      return function() {
        return _this.ctx.decodeAudioData(request.response, function(buffer) {
          _this.isLoaded = true;
          _this.buffer = buffer;
          if (callback) {
            callback(_this);
          }
          if (autoplay) {
            return _this.play();
          }
        }, _this._onError);
      };
    })(this);
    request.onprogress = (function(_this) {
      return function(e) {
        if (e.lengthComputable) {
          if (_this.onloadingprogress) {
            return _this.onloadingprogress(e.loaded / e.total);
          }
        }
      };
    })(this);
    return request.send();
  };

  WebAudioAPI.prototype.streamInput = function() {
    if (!this.inputMode) {
      alert('Enable input mode');
      return;
    }
    return navigator.getUserMedia({
      video: false,
      audio: true
    }, (function(_this) {
      return function(stream) {
        _this.isLoaded = true;
        _this._localstream = stream;
        return _this.play();
      };
    })(this), this._onError);
  };

  WebAudioAPI.prototype.setState = function(state) {
    return this.state = state;
  };

  WebAudioAPI.prototype._onError = function(e) {
    return console.log('ERROR', e);
  };

  WebAudioAPI.prototype.pause = function() {
    if (this.inputMode) {
      return this.stop();
    } else if (this.src) {
      this.src.stop(0);
      this.src = null;
      this.processor.onaudioprocess = null;
      this.position = this.ctx.currentTime - this.startTime;
      this.setState(WebAudioAPI.IS_PAUSED);
      if (this.onpause) {
        return this.onpause();
      }
    }
  };

  WebAudioAPI.prototype.play = function(position) {
    if (!this.isLoaded) {
      return;
    }
    if (this.state === WebAudioAPI.IS_PLAYING) {
      this.pause();
      return;
    }
    this._connect();
    if (!this.inputMode) {
      this.position = typeof position === 'number' ? position : this.position || 0;
      this.startTime = this.ctx.currentTime - (this.position || 0);
      this.src.start(this.ctx.currentTime, this.position);
    }
    this.setState(WebAudioAPI.IS_PLAYING);
    if (this.onplay) {
      return this.onplay();
    }
  };

  WebAudioAPI.prototype.stop = function() {
    if (this.src) {
      if (this.inputMode) {
        this.src.mediaStream.stop();
        this.isLoaded = false;
        this.localstream = null;
      } else {
        this.src.stop(0);
      }
      this.src = null;
      this.processor.onaudioprocess = null;
      this.position = 0;
      this.startTime = 0;
      this.setState(WebAudioAPI.IS_STOPPED);
      if (this.onstop) {
        return this.onstop();
      }
    }
  };

  WebAudioAPI.prototype.setVolume = function(volume) {
    volume = Math.min(1, Math.max(0, volume));
    return this.gainNode.gain.value = volume;
  };

  WebAudioAPI.prototype.updatePosition = function() {
    if (this.state === WebAudioAPI.IS_PLAYING) {
      this.position = this.ctx.currentTime - this.startTime;
    }
    if (this.position > this.buffer.duration) {
      this.position = this.buffer.duration;
      this.pause();
    }
    return this.position;
  };

  WebAudioAPI.prototype.seek = function(time) {
    if (this.state === WebAudioAPI.IS_PLAYING) {
      return this.play(time);
    } else {
      return this.position = time;
    }
  };

  WebAudioAPI.prototype.destruct = function() {
    this.stop();
    this._disconnect();
    return this.ctx = null;
  };

  WebAudioAPI.prototype._connect = function() {
    if (this.inputMode && this._localstream) {
      this.src = this.ctx.createMediaStreamSource(this._localstream);
    } else {
      this.src = this.ctx.createBufferSource();
      this.src.buffer = this.buffer;
      this.src.onended = this._onEnded;
      this.duration = this.buffer.duration;
    }
    this.analyser = this.ctx.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.8;
    this.analyser.minDecibels = -140;
    this.analyser.maxDecibels = 0;
    this.analyser.fftSize = 512;
    this.processor = this.ctx.createScriptProcessor(2048, 1, 1);
    this.gainNode = this.ctx.createGain();
    this.src.connect(this.analyser);
    this.src.connect(this.gainNode);
    this.analyser.connect(this.processor);
    this.processor.connect(this.ctx.destination);
    this.gainNode.connect(this.ctx.destination);
    this.processor.onaudioprocess = this._onAudioProcess;
    this.processor.api = this;
    return this._oldBrowser();
  };

  WebAudioAPI.prototype._disconnect = function() {
    if (this.analyser) {
      this.analyser.disconnect(0);
    }
    if (this.processor) {
      this.processor.disconnect(0);
    }
    if (this.gainNode) {
      return this.gainNode.disconnect(0);
    }
  };

  WebAudioAPI.prototype._onAudioProcess = function() {
    if (this.onaudioprocess) {
      return this.onaudioprocess();
    }
  };

  WebAudioAPI.prototype._onEnded = function(e) {
    if (this.src && (this.state === WebAudioAPI.IS_STOPPED || this.state === WebAudioAPI.IS_PLAYING)) {
      this.src.disconnect(0);
      this.src = null;
      this.processor.onaudioprocess = null;
      this.state = WebAudioAPI.IS_ENDED;
      if (this.onended) {
        return this.onended();
      }
    }
  };

  WebAudioAPI.prototype._oldBrowser = function() {
    if (this.ctx && typeof this.ctx.createScriptProcessor !== 'function') {
      this.ctx.createScriptProcessor = this.ctx.createJavaScriptNode;
    }
    if (this.src && typeof this.src.start !== 'function') {
      this.src.start = this.src.noteOn;
    }
    if (this.src && typeof this.src.stop !== 'function') {
      return this.src.stop = this.src.noteOff;
    }
  };

  return WebAudioAPI;

})();

WebAudioAPI = new WebAudioAPI();

SPACE.Equalizer = (function(superClass) {
  extend(Equalizer, superClass);

  Equalizer.prototype.center = null;

  Equalizer.prototype._values = null;

  Equalizer.prototype._newValues = null;

  Equalizer.prototype._time = 1;

  Equalizer.prototype._jukebox = null;

  Equalizer.prototype.material = null;

  Equalizer.prototype.lines = null;

  Equalizer.prototype.maxLength = 0;

  Equalizer.prototype.minLength = 0;

  Equalizer.prototype.radius = 0;

  Equalizer.prototype.interpolationTime = 0;

  Equalizer.prototype.color = 0xFFFFFF;

  Equalizer.prototype.lineForceUp = .5;

  Equalizer.prototype.lineForceDown = .5;

  Equalizer.prototype.linewidth = 0;

  Equalizer.prototype.absolute = false;

  Equalizer.prototype.nbValues = 0;

  Equalizer.prototype.maxNbValues = 512;

  Equalizer.prototype.mirror = true;

  function Equalizer(opts) {
    var defaults;
    if (opts == null) {
      opts = {};
    }
    this.random = bind(this.random, this);
    this.updateValues = bind(this.updateValues, this);
    this._eTrackIsStopped = bind(this._eTrackIsStopped, this);
    Equalizer.__super__.constructor.apply(this, arguments);
    defaults = {
      maxLength: 200,
      minLength: 50,
      radius: 250,
      interpolationTime: 150,
      color: 0xFFFFFF,
      lineForceUp: .5,
      lineForceDown: .5,
      absolute: false,
      nbValues: 512,
      mirror: true,
      linewidth: 2
    };
    opts = HELPER.Coffee.merge(defaults, opts);
    this.minLength = opts.minLength;
    this.maxLength = opts.maxLength;
    this.radius = opts.radius;
    this.interpolationTime = opts.interpolationTime;
    this.color = opts.color;
    this.lineForceUp = opts.lineForceUp;
    this.lineForceDown = opts.lineForceDown;
    this.absolute = opts.absolute;
    this.nbValues = opts.nbValues;
    this.mirror = opts.mirror;
    this.linewidth = opts.linewidth;
    this._jukebox = SPACE.SceneManager.currentScene._jukebox;
    this.center = new THREE.Vector3();
    this._values = this.mute(false);
    this._newValues = this.mute(false);
    this.setRadius(this.radius);
    this.generate();
    this._events();
    this.updateValues();
  }

  Equalizer.prototype._events = function() {
    return document.addEventListener(TRACK.IS_STOPPED.type, this._eTrackIsStopped);
  };

  Equalizer.prototype._eTrackIsStopped = function() {
    return this.mute();
  };

  Equalizer.prototype.setRadius = function(radius) {
    this.radius = radius;
    if (window.innerWidth - 100 < radius) {
      return this.radius = window.innerWidth * 0.6;
    }
  };

  Equalizer.prototype.setNbValues = function(nbValues) {
    this.nbValues = nbValues;
    return this.mute();
  };

  Equalizer.prototype.setValues = function(values) {
    var datas, i, j, k, len, length, newValues, ref, value;
    if (this.mirror) {
      datas = Array(this.nbValues);
      for (i = j = 0, ref = (this.nbValues * .5) - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        datas[i] = datas[this.nbValues - 1 - i] = values[i];
      }
      values = datas;
    }
    newValues = this.mute(false);
    for (i = k = 0, len = values.length; k < len; i = ++k) {
      value = values[i];
      if (this.absolute) {
        value = Math.abs(value);
      }
      length = this.minLength + parseFloat(value) * (this.maxLength - this.minLength);
      newValues[i] = Math.max(length, 0);
    }
    this._newValues = newValues;
    return this.resetInterpolation();
  };

  Equalizer.prototype.generate = function() {
    this.mute();
    this.material = new THREE.LineBasicMaterial({
      color: this.color,
      linewidth: this.linewidth
    });
    this.lines = [];
    this.refresh(0);
    return this.updateGeometries(true);
  };

  Equalizer.prototype.update = function(delta) {
    return this.refresh(delta);
  };

  Equalizer.prototype.refresh = function(delta) {
    var diff, i, j, ref, t;
    this._time += delta;
    t = this._time / this.interpolationTime;
    if (t > 1) {
      return;
    }
    for (i = j = 0, ref = this.maxNbValues - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      diff = this._values[i] - this._newValues[i];
      this._values[i] = this._values[i] - t * diff;
    }
    return this.updateGeometries();
  };

  Equalizer.prototype.updateValues = function() {
    if (this._jukebox.current && this._jukebox.current.state === Track.IS_PLAYING) {
      this.setValues(this._jukebox.current.getTimedata());
    }
    return setTimeout(this.updateValues, this.interpolationTime * 0.15);
  };

  Equalizer.prototype.updateGeometries = function(create) {
    var angle, from, geometry, i, j, len, length, line, ref, results1, to;
    if (create == null) {
      create = false;
    }
    ref = this._values;
    results1 = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      length = ref[i];
      angle = Math.PI * 2 * i / this.nbValues;
      from = this.computePosition(this.center, angle, this.radius - length * this.lineForceDown);
      to = this.computePosition(this.center, angle, this.radius + length * this.lineForceUp);
      if (typeof this.lines[i] === 'undefined') {
        geometry = new THREE.Geometry();
        geometry.vertices.push(from, to, from);
        line = new THREE.Line(geometry, this.material);
        this.lines.push(line);
        results1.push(this.add(line));
      } else {
        line = this.lines[i];
        line.geometry.vertices[0] = from;
        line.geometry.vertices[1] = to;
        line.geometry.vertices[2] = from;
        results1.push(line.geometry.verticesNeedUpdate = true);
      }
    }
    return results1;
  };

  Equalizer.prototype.random = function(setValues) {
    var i, j, ref, values;
    if (setValues == null) {
      setValues = true;
    }
    values = [];
    for (i = j = 0, ref = this.maxNbValues - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      values[i] = Math.random();
    }
    if (setValues) {
      this.setValues(values);
    }
    return values;
  };

  Equalizer.prototype.mute = function(setValues) {
    var i, j, ref, values;
    if (setValues == null) {
      setValues = true;
    }
    values = [];
    for (i = j = 0, ref = this.maxNbValues - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      values[i] = 0;
    }
    if (setValues) {
      this.setValues(values);
    }
    return values;
  };

  Equalizer.prototype.resetInterpolation = function() {
    return this._time = 0;
  };

  Equalizer.prototype.computePosition = function(point, angle, length) {
    var x, y;
    x = point.x + Math.sin(angle) * length;
    y = point.y + Math.cos(angle) * length;
    return new THREE.Vector3(x, y, point.z);
  };

  Equalizer.prototype.removeLineFromParent = function(index) {
    var parent;
    parent = this.lines[index];
    return parent.remove(this.lines[index]);
  };

  Equalizer.prototype.resize = function() {
    return this.setRadius(this.radius);
  };

  return Equalizer;

})(THREE.Group);

SPACE.Cover = (function(superClass) {
  extend(Cover, superClass);

  Cover.prototype._imagesLoaded = null;

  Cover.prototype.loadingManager = null;

  Cover.prototype.plane = null;

  Cover.prototype.imageData0 = null;

  Cover.prototype.imageData1 = null;

  Cover.prototype.tMove = 1;

  Cover.prototype.tScale = 1;

  function Cover() {
    this._prepareRTT = bind(this._prepareRTT, this);
    this._setupPlane = bind(this._setupPlane, this);
    this._loadShaders = bind(this._loadShaders, this);
    this._eNext = bind(this._eNext, this);
    Cover.__super__.constructor.apply(this, arguments);
  }

  Cover.prototype._events = function() {
    return document.addEventListener(SPACE.CoverController.NEXT, this._eNext);
  };

  Cover.prototype._eNext = function() {
    return this._transition();
  };

  Cover.prototype.setup = function() {
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onLoad = this._setupPlane;
    this.textureLoader = new THREE.TextureLoader();
    this.loader = new THREE.XHRLoader(this.loadingManager);
    this._events();
    return this._loadShaders();
  };

  Cover.prototype._loadShaders = function() {
    this.loader.load('assets/shaders/cover.frag');
    return this.loader.load('assets/shaders/cover.vert');
  };

  Cover.prototype._setupPlane = function() {
    var array0, array1, fragmentShader, i, j, material, vertexShader;
    vertexShader = this.loader.cache.files['assets/shaders/cover.vert'];
    fragmentShader = this.loader.cache.files['assets/shaders/cover.frag'];
    material = new THREE.ShaderMaterial({
      uniforms: {
        texture0: {
          type: 't',
          value: new THREE.Texture()
        },
        texture1: {
          type: 't',
          value: new THREE.Texture()
        },
        blurried0: {
          type: 't',
          value: new THREE.Texture()
        },
        blurried1: {
          type: 't',
          value: new THREE.Texture()
        },
        tMove: {
          type: 'f',
          value: 0
        },
        tScale: {
          type: 'f',
          value: 1
        }
      },
      attributes: {
        T0Coords: {
          type: 'v2',
          value: []
        },
        T1Coords: {
          type: 'v2',
          value: []
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    array0 = material.attributes.T0Coords.value;
    array1 = material.attributes.T1Coords.value;
    for (i = j = 0; j <= 3; i = ++j) {
      array0[i] = new THREE.Vector2();
      array1[i] = new THREE.Vector2();
    }
    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    this.plane.position.z = -1;
    this.add(this.plane);
    this.loadingManager.onLoad = null;
    return this._computePlaneSize();
  };

  Cover.prototype.setCovers = function(imageData0, imageData1) {
    this.texture0 = new THREE.ImageUtils.loadTexture(imageData0.src);
    this.texture0.minFilter = THREE.NearestFilter;
    this.texture0.anisotropy = 1;
    this.plane.material.uniforms.texture0.value = this.texture0;
    this.texture1 = new THREE.ImageUtils.loadTexture(imageData1.src);
    this.texture1.minFilter = THREE.NearestFilter;
    this.texture1.anisotropy = 1;
    this.plane.material.uniforms.texture1.value = this.texture1;
    return this.updateCovers(imageData0, imageData1);
  };

  Cover.prototype.updateCovers = function(imageData0, imageData1) {
    var coords0, texture0, texture1;
    this.imageData0 = imageData0;
    this.imageData1 = imageData1;
    texture0 = this.plane.material.uniforms.texture0.value;
    texture1 = this.plane.material.uniforms.texture1.value;
    coords0 = this._computeCoordinatesFromData(imageData0);
    this._setCoordinatesToTexture(coords0, this.plane.material.attributes.T0Coords);
    this._setCoordinatesToTexture(coords0, this.plane.material.attributes.T1Coords);
    if (texture0.image && texture1.image) {
      texture0.image.src = imageData0.src;
      texture1.image.src = imageData0.src;
    } else {
      texture0.image = imageData0.image;
      texture1.image = imageData0.image;
    }
    return setTimeout((function(_this) {
      return function() {
        var coords1;
        coords1 = _this._computeCoordinatesFromData(imageData1);
        _this._setCoordinatesToTexture(coords1, _this.plane.material.attributes.T1Coords);
        texture1.image.src = imageData1.src;
        _this._resetTransition();
        return _this._renderBlur();
      };
    })(this), 100);
  };

  Cover.prototype.resize = function() {
    this._computePlaneSize();
    return this.updateCovers(this.imageData0, this.imageData1);
  };

  Cover.prototype._computePlaneSize = function() {
    var distance, fov, height, manager, width;
    manager = SPACE.SceneManager;
    fov = manager.camera.fov / 180 * Math.PI;
    distance = manager.camera.position.z + 1;
    width = 2 * manager.camera.aspect * Math.tan(fov / 2) * distance;
    height = 2 * Math.tan(fov / 2) * distance;
    return this.plane.scale.set(width, height, 1);
  };

  Cover.prototype._computeCoordinatesFromData = function(imageData) {
    var aspect, coords, diff, distance, fov, hSize, height, manager, ratio, wSize, width;
    manager = SPACE.SceneManager;
    fov = manager.camera.fov / 180 * Math.PI;
    aspect = imageData.width / imageData.height;
    distance = manager.camera.position.z + 1;
    ratio = Math.max(1, manager.camera.aspect / aspect);
    width = 2 * aspect * Math.tan(fov / 2) * distance * ratio;
    height = 2 * Math.tan(fov / 2) * distance * ratio;
    wSize = this.plane.scale.x;
    hSize = this.plane.scale.y;
    diff = new THREE.Vector2((1.0 - (wSize / width)) * 0.5, (1.0 - (hSize / height)) * 0.5);
    coords = [];
    coords[0] = new THREE.Vector2(0.0 + diff.x, 1.0 - diff.y);
    coords[1] = new THREE.Vector2(1.0 - diff.x, 1.0 - diff.y);
    coords[2] = new THREE.Vector2(0.0 + diff.x, 0.0 + diff.y);
    coords[3] = new THREE.Vector2(1.0 - diff.x, 0.0 + diff.y);
    return coords;
  };

  Cover.prototype._setCoordinatesToTexture = function(coordinates, texturesCoords) {
    var i, j, ref;
    for (i = j = 0, ref = texturesCoords.value.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      texturesCoords.value[i].x = coordinates[i].x;
      texturesCoords.value[i].y = coordinates[i].y;
    }
    return texturesCoords.needsUpdate = true;
  };

  Cover.prototype._transition = function() {
    this._resetTransition();
    return $(this).animate({
      tScale: 0.6
    }, {
      duration: 500,
      easing: 'easeOutExpo',
      progress: function() {
        var value;
        value = this.tScale;
        return this.plane.material.uniforms.tScale.value = value;
      }
    }).animate({
      tMove: 1
    }, {
      duration: 750,
      easing: 'easeOutExpo',
      progress: function() {
        var value;
        value = this.tMove;
        return this.plane.material.uniforms.tMove.value = value;
      }
    }).animate({
      tScale: 1
    }, {
      duration: 500,
      easing: 'easeOutExpo',
      progress: function() {
        var value;
        value = this.tScale;
        return this.plane.material.uniforms.tScale.value = value;
      }
    });
  };

  Cover.prototype._resetTransition = function() {
    this.tScale = 1.0;
    this.tMove = 0.0;
    this.plane.material.uniforms.tScale.value = 1.0;
    return this.plane.material.uniforms.tMove.value = 0.0;
  };

  Cover.prototype.cameraRTT = null;

  Cover.prototype.sceneRTT = null;

  Cover.prototype.rt1 = null;

  Cover.prototype.rt2 = null;

  Cover.prototype.composer = null;

  Cover.prototype.hBlur = null;

  Cover.prototype.vBlur = null;

  Cover.prototype.renderPass = null;

  Cover.prototype.effectCopy = null;

  Cover.prototype._renderBlur = function() {
    var t0, t1;
    t0 = this.plane.material.uniforms.texture0.value;
    t1 = this.plane.material.uniforms.texture1.value;
    this._prepareRTT();
    this.plane.material.uniforms.blurried0.value = this.rt0;
    this.plane.material.uniforms.blurried1.value = this.rt1;
    this._renderToTexture(t0.image.src, this.rt0);
    return this._renderToTexture(t1.image.src, this.rt1);
  };

  Cover.prototype._prepareRTT = function() {
    var height, material, options, t0, width;
    t0 = this.plane.material.uniforms.texture0.value;
    width = this.plane.scale.x;
    height = this.plane.scale.y;
    this.cameraRTT = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.cameraRTT.position.setZ(600);
    this.sceneRTT = new THREE.Scene();
    options = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat
    };
    this.rt0 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, options);
    this.rt1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, options);
    this.hBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    this.hBlur.enabled = true;
    this.hBlur.uniforms.h.value = 1 / window.innerWidth;
    this.vBlur = new THREE.ShaderPass(THREE.VerticalBlurShader);
    this.vBlur.enabled = true;
    this.vBlur.uniforms.v.value = 1 / window.innerHeight;
    this.renderPass = new THREE.RenderPass(this.sceneRTT, this.cameraRTT);
    this.effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    material = new THREE.MeshBasicMaterial();
    this.planeRTT = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.0, 1.0), material);
    this.planeRTT.position.z = -1;
    this.planeRTT.scale.set(this.plane.scale.x, this.plane.scale.y, 1.0);
    return this.sceneRTT.add(this.planeRTT);
  };

  Cover.prototype._renderToTexture = function(textureUrl, target) {
    return this.textureLoader.load(textureUrl, (function(_this) {
      return function(texture) {
        var manager;
        _this.planeRTT.material.map = texture;
        manager = SPACE.SceneManager;
        delete _this.composer;
        _this.composer = new THREE.EffectComposer(manager.renderer, target);
        _this.composer.addPass(_this.renderPass);
        _this.composer.addPass(_this.hBlur);
        _this.composer.addPass(_this.vBlur);
        _this.composer.addPass(_this.effectCopy);
        return _this.composer.render(0.01);
      };
    })(this));
  };

  return Cover;

})(THREE.Group);

SPACE.CoverController = (function() {
  CoverController.PLAYLIST_LOADED = 'cover_playlist_loaded';

  CoverController.TEXTURES_LOADED = 'cover_textures_loaded';

  CoverController.NEXT = 'cover_next';

  CoverController.prototype.playlist = null;

  CoverController.prototype.current = null;

  CoverController.prototype.view = null;

  CoverController.prototype.playlistView = null;

  CoverController.prototype._loadingManager = null;

  CoverController.prototype._imageLoader = null;

  CoverController.prototype._imageData = null;

  function CoverController() {
    this._updateInfo = bind(this._updateInfo, this);
    this._eTrackWillPlay = bind(this._eTrackWillPlay, this);
    this._eJukeboxIsQueuing = bind(this._eJukeboxIsQueuing, this);
    this._eTrackIsWaiting = bind(this._eTrackIsWaiting, this);
    this._onLoad = bind(this._onLoad, this);
    var req;
    req = new XMLHttpRequest();
    req.open('GET', 'resources/playlist.json', true);
    req.onload = (function(_this) {
      return function(e) {
        _this.playlist = JSON.parse(e.target.response);
        return _this._load();
      };
    })(this);
    req.send();
    this._setup();
    this._events();
  }

  CoverController.prototype._setup = function() {
    this._imageData = {};
    this._loadingManager = new THREE.LoadingManager();
    this._loadingManager.onLoad = this._onLoad;
    this._imageLoader = new THREE.ImageLoader(this._loadingManager);
    this._textureLoader = new THREE.TextureLoader();
    this.view = new SPACE.Cover();
    this.view.setup();
    return this.playlistView = new Playlist();
  };

  CoverController.prototype._load = function() {
    var cover, j, len, ref;
    ref = this.playlist;
    for (j = 0, len = ref.length; j < len; j++) {
      cover = ref[j];
      cover.url += '?' + this._guid();
      this._imageLoader.load(cover.cover_url, (function(_this) {
        return function(image) {
          var src;
          src = image.src.replace(window.location.origin + '/', '');
          _this._imageData[src] = {};
          _this._imageData[src].src = src;
          _this._imageData[src].image = image;
          _this._imageData[src].width = image.width;
          _this._imageData[src].height = image.height;
          return true;
        };
      })(this));
    }
    return this.playlistView.setList(this.playlist);
  };

  CoverController.prototype._guid = function() {
    var s4;
    s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };

  CoverController.prototype._events = function() {
    document.addEventListener(Track.IS_WAITING, this._eTrackIsWaiting);
    document.addEventListener(Track.WILL_PLAY, this._eTrackWillPlay);
    return document.addEventListener(Jukebox.IS_QUEUING, this._eJukeboxIsQueuing);
  };

  CoverController.prototype._onLoad = function() {
    var url0, url1;
    HELPER.trigger(SPACE.CoverController.PLAYLIST_LOADED);
    this._loadingManager.onLoad = this._textureLoaded;
    url0 = this.playlist[1].cover_url;
    url1 = this.playlist[0].cover_url;
    return this.view.setCovers(this._imageData[url0], this._imageData[url1]);
  };

  CoverController.prototype._eTrackIsWaiting = function(e) {
    var i, j, len, nextTrack, ref, results1, t, track;
    track = e.object.track;
    ref = this.playlist;
    results1 = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      t = ref[i];
      if (t.url === track.data.source_url) {
        nextTrack = null;
        if (i + 1 < this.playlist.length) {
          nextTrack = this.playlist[i + 1];
        }
        track.mergeData({
          title: t.title,
          cover_url: t.cover_url,
          author_name: t.author_name,
          author_url: t.author_url,
          color1: t.color1,
          color2: t.color2,
          nextTrack: nextTrack
        });
        break;
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };

  CoverController.prototype._eJukeboxIsQueuing = function(e) {
    var c, isPlaylist, sameCover;
    c = e.object.jukebox.current;
    isPlaylist = this.current && this.current.data.is_playlist;
    isPlaylist = isPlaylist && c.data.is_playlist;
    sameCover = false;
    if (isPlaylist) {
      sameCover = c.data.playlist.permalink === this.current.data.playlist.permalink;
    }
    this.current = e.object.jukebox.current;
    if (!sameCover) {
      this.playlistView.setActive(this.current.data.source_url);
      HELPER.trigger(SPACE.CoverController.NEXT);
      return this._hide();
    }
  };

  CoverController.prototype._eTrackWillPlay = function(e) {
    var current, next;
    current = e.object.track.data;
    next = current.nextTrack;
    return this._updateInfo(current, next);
  };

  CoverController.prototype._hide = function() {
    $('#information h1').addClass('hidden');
    return $('#information h2').addClass('hidden');
  };

  CoverController.prototype._updateInfo = function(current, next) {
    var color1, color2, css, title, url0, url1, user_url, username;
    title = current.title;
    username = current.author_name;
    user_url = current.author_url;
    color1 = current.color1;
    color2 = current.color2;
    $('#information h1').html(title);
    $('#information h2').html('by <a target="_blank" href="' + user_url + '">' + username + '</a>');
    css = "a { color: " + color1 + " !important; }\nbody { color: " + color2 + " !important; }";
    $('.cover-style').html(css);
    if (next) {
      url0 = current.cover_url;
      url1 = next.cover_url;
      return this.view.updateCovers(this._imageData[url0], this._imageData[url1]);
    }
  };

  return CoverController;

})();

Playlist = (function() {
  function Playlist() {
    this._events();
  }

  Playlist.prototype._events = function() {
    document.querySelector('#playlist .open').addEventListener('click', this._eOpen);
    return document.querySelector('#playlist .close').addEventListener('click', this._eClose);
  };

  Playlist.prototype._eOpen = function() {
    return $('#playlist').removeClass('hidden');
  };

  Playlist.prototype._eClose = function() {
    return $('#playlist').addClass('hidden');
  };

  Playlist.prototype.setList = function(list) {
    var html, i, item, j, len;
    html = "";
    for (i = j = 0, len = list.length; j < len; i = ++j) {
      item = list[i];
      html += "<li data-url=\"" + item.url + "\">";
      html += "<span class=\"number\">" + (i + 1) + "</span>";
      html += "<span class=\"title\">" + item.title + "</span>";
      html += "<span class=\"duration\"></span>";
      html += "</li>";
    }
    return $('#playlist ul').html(html);
  };

  Playlist.prototype.setActive = function(activeUrl) {
    console.log(activeUrl);
    $('#playlist li').removeClass('active');
    return $('#playlist li[data-url="' + activeUrl + '"]').addClass('active');
  };

  return Playlist;

})();

(function() {
  var j, len, scene, scenes;
  scenes = ['MainScene'];
  SPACE.SceneManager = new SPACE.SceneManager();
  for (j = 0, len = scenes.length; j < len; j++) {
    scene = scenes[j];
    SPACE.SceneManager.createScene(scene);
  }
  return SPACE.SceneManager.goToScene('MainScene');
})();

//# sourceMappingURL=data:application/json;base64,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QVksQ0FBQyxXQUFuQixDQUErQixLQUEvQixDQUFBLENBREY7QUFBQSxHQUhBO1NBTUEsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFuQixDQUE2QixXQUE3QixFQVBEO0FBQUEsQ0FBRCxDQUFBLENBQUEsQ0ExeEVBLENBQUEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIlNQQUNFID0gU1BBQ0UgfHwge31cblxuU1BBQ0UuRU5WICAgICAgICA9ICdkZXZlbG9wbWVudCdcblxuIyBQSVhJLkpTXG5TUEFDRS5GUFMgICAgICAgID0gMzBcblNQQUNFLnBpeGVsUmF0aW8gPSAod2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSlcblxuIyBUSFJFRS5KU1xuU1BBQ0UuVEhSRUUgPSB7fVxuXG4jIFNPVU5EQ0xPVURcblNQQUNFLlNDID0gKC0+XG4gIG9iamVjdCA9IHt9XG4gIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG4gICAgb2JqZWN0LmlkID0gJ2RlMGI4NTM5YjRhZDJmNmNjMjNkZmUxY2M2ZTA0MzhkJ1xuICBlbHNlXG4gICAgb2JqZWN0LmlkID0gJzgwN2QyODU3NWMzODRlNjJhNThiZTVjM2ExNDQ2ZTY4J1xuICBvYmplY3QucmVkaXJlY3RfdXJpID0gd2luZG93LmxvY2F0aW9uLm9yaWdpblxuICByZXR1cm4gb2JqZWN0XG4pKClcblxuXG4jIE1FVEhPRFNcblNQQUNFLkxPRyAgICAgICAgPSAobG9nLCBzdHlsZXM9JycpLT5cbiAgdW5sZXNzIC8ocHJvZHxwcm9kdWN0aW9uKS8udGVzdChTUEFDRS5FTlYpXG4gICAgICBkYXRlICAgICA9IG5ldyBEYXRlKClcbiAgICAgIHRpbWVTdHIgID0gZGF0ZS50b1RpbWVTdHJpbmcoKVxuICAgICAgdGltZVN0ciAgPSB0aW1lU3RyLnN1YnN0cigwLCA4KVxuICAgICAgZGF0ZVN0ciAgPSBkYXRlLmdldERhdGUoKSArICcvJ1xuICAgICAgZGF0ZVN0ciArPSAoZGF0ZS5nZXRNb250aCgpKzEpICsgJy8nXG4gICAgICBkYXRlU3RyICs9IGRhdGUuZ2V0RnVsbFllYXIoKVxuICAgICAgY29uc29sZS5sb2coZGF0ZVN0cisnIC0gJyt0aW1lU3RyKycgfCAnK2xvZywgc3R5bGVzKVxuXG5TUEFDRS5UT0RPICAgICAgID0gKG1lc3NhZ2UpLT5cbiAgU1BBQ0UuTE9HKCclY1RPRE8gfCAnICsgbWVzc2FnZSwgJ2NvbG9yOiAjMDA4OEZGJylcblxuU1BBQ0UuQVNTRVJUICAgICA9IChjb25kaXRpb24sIGFjdGlvbiktPlxuICBhY3Rpb24oKSBpZiBjb25kaXRpb25cbiAgcmV0dXJuIGNvbmRpdGlvblxuXG5cbkpVS0VCT1ggPVxuICBUUkFDS19PTl9BREQ6IG5ldyBFdmVudCgnanVrZWJveF90cmFja19vbl9hZGQnKVxuICBUUkFDS19BRERFRDogIG5ldyBFdmVudCgnanVrZWJveF90cmFja19hZGRlZCcpXG4gIE9OX1BMQVk6ICAgICAgbmV3IEV2ZW50KCdqdWtlYm94X29uX3BsYXknKVxuICBPTl9TVE9QOiAgICAgIG5ldyBFdmVudCgnanVrZWJveF9vbl9zdG9wJylcbiAgSVNfUExBWUlORzogICBuZXcgRXZlbnQoJ2p1a2Vib3hfaXNfcGxheWluZycpXG4gIElTX1NUT1BQRUQ6ICAgbmV3IEV2ZW50KCdqdWtlYm94X2lzX3N0b3BwZWQnKVxuICBJU19TRUFSQ0hJTkc6IG5ldyBFdmVudCgnanVrZWJveF9pc19zZWFyY2hpbmcnKVxuT2JqZWN0LmZyZWV6ZShKVUtFQk9YKVxuXG5UUkFDSyA9XG4gIElTX1BMQVlJTkc6IG5ldyBFdmVudCgndHJhY2tfaXNfcGxheWluZycpXG4gIElTX1BBVVNFRDogIG5ldyBFdmVudCgndHJhY2tfaXNfcGF1c2VkJylcbiAgSVNfU1RPUFBFRDogbmV3IEV2ZW50KCd0cmFja19pc19zdG9wcGVkJylcbk9iamVjdC5mcmVlemUoVFJBQ0spXG5cblxuS2V5Ym9hcmQgPVxuICBFTlRFUjogIDEzXG4gIFVQOiAgICAgMzhcbiAgRE9XTjogICA0MFxuICBFU0M6ICAgIDI3XG4gIERFTEVURTogNDZcblxuU3BhY2VzaGlwU3RhdGUgPVxuICBJRExFOiAgICAgJ2lkbGUnXG4gIExBVU5DSEVEOiAnbGF1bmNoZWQnXG4gIElOX0xPT1A6ICAnaW5fbG9vcCdcbiAgQVJSSVZFRDogICdhcnJpdmVkJ1xuXG5TZWFyY2hFbmdpbmVTdGF0ZSA9XG4gIE9QRU5FRDogJ29wZW5lZCdcbiAgQ0xPU0VEOiAnY2xvc2VkJ1xuICBTRUFSQ0g6ICdzZWFyY2gnXG4gIFRSQUNLX1NFTEVDVEVEOiAndHJhY2tfc2VsZWN0ZWQnXG5cbkp1a2Vib3hTdGF0ZSA9XG4gIElTX1BMQVlJTkc6ICdpc19wbGF5aW5nJ1xuICBJU19TVE9QUEVEOiAnaXNfc3RvcHBlZCdcblxuQWlycG9ydFN0YXRlID1cbiAgSURMRTogJ2lkbGUnXG4gIFNFTkRJTkc6ICdzZW5kaW5nJ1xuXG5PYmplY3QuZnJlZXplKEtleWJvYXJkKVxuT2JqZWN0LmZyZWV6ZShTcGFjZXNoaXBTdGF0ZSlcbk9iamVjdC5mcmVlemUoU2VhcmNoRW5naW5lU3RhdGUpXG5PYmplY3QuZnJlZXplKEp1a2Vib3hTdGF0ZSlcbk9iamVjdC5mcmVlemUoQWlycG9ydFN0YXRlKVxuXG5cbndpbmRvdy5IRUxQRVIgPSB3aW5kb3cuSEVMUEVSIHx8XG4gIGV2ZW50czoge31cblxuICB0cmlnZ2VyOiAoZXZlbnRuYW1lLCBvYmplY3QpLT5cbiAgICAjIGNvbnNvbGUubG9nIGV2ZW50bmFtZVxuICAgIHVubGVzcyBAZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50bmFtZSlcbiAgICAgIEBldmVudHNbZXZlbnRuYW1lXSA9IG5ldyBFdmVudChldmVudG5hbWUpXG5cbiAgICBlID0gQGV2ZW50c1tldmVudG5hbWVdXG4gICAgZS5vYmplY3QgPSBvYmplY3RcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGUpXG5cbiAgcmV0aW5hOiAodmFsdWUpLT5cbiAgICBpZiB0eXBlb2YgdmFsdWUgaXMgJ29iamVjdCdcbiAgICAgIG9iamVjdCA9IHZhbHVlXG4gICAgICBvID0ge31cbiAgICAgIGZvciBrZXkgb2Ygb2JqZWN0XG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV1cbiAgICAgICAgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICAgICAgb1trZXldID0gdmFsdWUgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb1xuICAgICAgcmV0dXJuIEBtZXJnZShvYmplY3QsIG8pXG4gICAgZWxzZSBpZiB0eXBlb2YgdmFsdWUgaXMgJ2FycmF5J1xuICAgICAgYXJyYXkgPSB2YWx1ZVxuICAgICAgYSA9IFtdXG4gICAgICBmb3IgdmFsdWUsIGtleSBpbiBhcnJheVxuICAgICAgICBpZiB0eXBlb2YgdmFsdWUgaXMgJ251bWJlcidcbiAgICAgICAgICBhLnB1c2godmFsdWUgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGEucHVzaCh2YWx1ZSlcbiAgICAgIHJldHVybiBhXG4gICAgZWxzZSBpZiB0eXBlb2YgdmFsdWUgaXMgJ251bWJlcidcbiAgICAgIHJldHVybiB2YWx1ZSAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvXG4gICAgcmV0dXJuIGZhbHNlXG5cblxuSEVMUEVSLkNvZmZlZSA9XG4gICMgQXJyYXlcbiAgc2h1ZmZsZTogKGFycmF5KS0+XG4gICAgdG1wXG4gICAgY3VyciA9IGFycmF5Lmxlbmd0aFxuICAgIHdoaWxlIDAgIT0gY3VyclxuICAgICAgcmFuZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnIpXG4gICAgICBjdXJyIC09IDFcbiAgICAgIHRtcCAgICAgICAgID0gYXJyYXlbY3Vycl1cbiAgICAgIGFycmF5W2N1cnJdID0gYXJyYXlbcmFuZF1cbiAgICAgIGFycmF5W3JhbmRdID0gdG1wXG4gICAgcmV0dXJuIGFycmF5XG5cbiAgIyBPYmplY3RcbiAgbWVyZ2U6IChvcHRpb25zLCBvdmVycmlkZXMpIC0+XG4gICAgQGV4dGVuZCAoQGV4dGVuZCB7fSwgb3B0aW9ucyksIG92ZXJyaWRlc1xuXG4gIGV4dGVuZDogKG9iamVjdCwgcHJvcGVydGllcykgLT5cbiAgICBmb3Iga2V5LCB2YWwgb2YgcHJvcGVydGllc1xuICAgICAgb2JqZWN0W2tleV0gPSB2YWxcbiAgICBvYmplY3RcblxuXG5fTWF0aCA9IF9NYXRoIHx8IHtcbiAgYW5nbGVCZXR3ZWVuUG9pbnRzOiAoZmlyc3QsIHNlY29uZCkgLT5cbiAgICBoZWlnaHQgPSBzZWNvbmQueSAtIGZpcnN0LnlcbiAgICB3aWR0aCAgPSBzZWNvbmQueCAtIGZpcnN0LnhcbiAgICByZXR1cm4gTWF0aC5hdGFuMihoZWlnaHQsIHdpZHRoKVxuXG4gIGRpc3RhbmNlOiAocG9pbnQxLCBwb2ludDIpIC0+XG4gICAgeCA9IHBvaW50MS54IC0gcG9pbnQyLnhcbiAgICB5ID0gcG9pbnQxLnkgLSBwb2ludDIueVxuICAgIGQgPSB4ICogeCArIHkgKiB5XG4gICAgcmV0dXJuIE1hdGguc3FydChkKVxuXG4gIGNvbGxpc2lvbjogKGRvdDEsIGRvdDIpLT5cbiAgICByMSA9IGlmIGRvdDEucmFkaXVzIHRoZW4gZG90MS5yYWRpdXMgZWxzZSAwXG4gICAgcjIgPSBpZiBkb3QyLnJhZGl1cyB0aGVuIGRvdDIucmFkaXVzIGVsc2UgMFxuICAgIGRpc3QgPSByMSArIHIyXG5cbiAgICByZXR1cm4gQGRpc3RhbmNlKGRvdDEucG9zaXRpb24sIGRvdDIucG9zaXRpb24pIDw9IE1hdGguc3FydChkaXN0ICogZGlzdClcblxuICBtYXA6ICh2YWx1ZSwgbG93MSwgaGlnaDEsIGxvdzIsIGhpZ2gyKSAtPlxuICAgIHJldHVybiBsb3cyICsgKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSAvIChoaWdoMSAtIGxvdzEpXG5cbiAgIyBIZXJtaXRlIEN1cnZlXG4gIGhlcm1pdGU6ICh5MCwgeTEsIHkyLCB5MywgbXUsIHRlbnNpb24sIGJpYXMpLT5cbiAgICBgXG4gICAgdmFyIG0wLG0xLG11MixtdTM7XG4gICAgdmFyIGEwLGExLGEyLGEzO1xuXG4gICAgbXUyID0gbXUgKiBtdTtcbiAgICBtdTMgPSBtdTIgKiBtdTtcbiAgICBtMCAgPSAoeTEteTApKigxK2JpYXMpKigxLXRlbnNpb24pLzI7XG4gICAgbTAgKz0gKHkyLXkxKSooMS1iaWFzKSooMS10ZW5zaW9uKS8yO1xuICAgIG0xICA9ICh5Mi15MSkqKDErYmlhcykqKDEtdGVuc2lvbikvMjtcbiAgICBtMSArPSAoeTMteTIpKigxLWJpYXMpKigxLXRlbnNpb24pLzI7XG4gICAgYTAgPSAgMiptdTMgLSAzKm11MiArIDE7XG4gICAgYTEgPSAgICBtdTMgLSAyKm11MiArIG11O1xuICAgIGEyID0gICAgbXUzIC0gICBtdTI7XG4gICAgYTMgPSAtMiptdTMgKyAzKm11MjtcbiAgICBgXG4gICAgcmV0dXJuKGEwKnkxK2ExKm0wK2EyKm0xK2EzKnkyKVxufVxuXG5cbl9USFJFRSA9IF9USFJFRSB8fCB7XG4gIEhlcm1pdGVDdXJ2ZTogKHB0cyktPlxuICAgIHBhdGggPSBuZXcgVEhSRUUuQ3VydmVQYXRoKClcbiAgICBwYXRoLmFkZChuZXcgVEhSRUUuSGVybWl0ZUJlemllckN1cnZlMyhwdHNbMF0sIHB0c1swXSwgcHRzWzFdLCBwdHNbMl0pKVxuICAgIGZvciBpIGluIFswLi4ocHRzLmxlbmd0aC00KV1cbiAgICAgIHBhdGguYWRkKG5ldyBUSFJFRS5IZXJtaXRlQmV6aWVyQ3VydmUzKHB0c1tpXSwgcHRzW2krMV0sIHB0c1tpKzJdLCBwdHNbaSszXSkpXG4gICAgcGF0aC5hZGQobmV3IFRIUkVFLkhlcm1pdGVCZXppZXJDdXJ2ZTMocHRzW3B0cy5sZW5ndGgtM10sIHB0c1twdHMubGVuZ3RoLTJdLCBwdHNbcHRzLmxlbmd0aC0xXSwgcHRzW3B0cy5sZW5ndGgtMV0pKVxuICAgIHJldHVybiBwYXRoXG59XG5cblRIUkVFLkN1cnZlLlV0aWxzLnRhbmdlbnRIZXJtaXRlQmV6aWVyID0gKCB5MCwgeTEsIHkyLCB5MywgbXUsIHRlbnNpb24sIGJpYXMgKS0+XG4gICAgbXUyID0gbXUgKiBtdVxuICAgIG11MyA9IG11MiAqIG11XG5cbiAgICBtMCAgPSAoeTEteTApKigxK2JpYXMpKigxLXRlbnNpb24pLzJcbiAgICBtMCAgKz0gKHkyLXkxKSooMS1iaWFzKSooMS10ZW5zaW9uKS8yXG5cbiAgICBtMSAgPSAoeTIteTEpKigxK2JpYXMpKigxLXRlbnNpb24pLzJcbiAgICBtMSAgKz0gKHkzLXkyKSooMS1iaWFzKSooMS10ZW5zaW9uKS8yXG5cbiAgICBhMCAgPSAgMiptdTMgLSAzKm11MiArIDFcbiAgICBhMSAgPSAgICBtdTMgLSAyKm11MiArIG11XG4gICAgYTIgID0gICAgbXUzIC0gICBtdTJcbiAgICBhMyAgPSAtMiptdTMgKyAzKm11MlxuXG4gICAgcmV0dXJuKGEwKnkxK2ExKm0wK2EyKm0xK2EzKnkyKVxuXG5USFJFRS5IZXJtaXRlQmV6aWVyQ3VydmUzID0gVEhSRUUuQ3VydmUuY3JlYXRlKFxuICAodjAsIHYxLCB2MiwgdjMpLT5cbiAgICBAdjAgPSB2MFxuICAgIEB2MSA9IHYxXG4gICAgQHYyID0gdjJcbiAgICBAdjMgPSB2M1xuICAgIHJldHVyblxuICAsICh0KS0+XG4gICAgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIHZlY3Rvci54ID0gVEhSRUUuQ3VydmUuVXRpbHMudGFuZ2VudEhlcm1pdGVCZXppZXIoQHYwLngsIEB2MS54LCBAdjIueCwgQHYzLngsIHQsIDAsIDApXG4gICAgdmVjdG9yLnkgPSBUSFJFRS5DdXJ2ZS5VdGlscy50YW5nZW50SGVybWl0ZUJlemllcihAdjAueSwgQHYxLnksIEB2Mi55LCBAdjMueSwgdCwgMCwgMClcbiAgICB2ZWN0b3IueiA9IFRIUkVFLkN1cnZlLlV0aWxzLnRhbmdlbnRIZXJtaXRlQmV6aWVyKEB2MC56LCBAdjEueiwgQHYyLnosIEB2My56LCB0LCAwLCAwKVxuICAgIHJldHVybiB2ZWN0b3JcbilcblxuVEhSRUUuSW5Mb29wQ3VydmUgPSBUSFJFRS5DdXJ2ZS5jcmVhdGUoXG4gICh2MCwgc3RhcnRBbmdsZT0wLCBtYXhSYWRpdXM9MTAwLCBtaW5SYWRpdXM9MCwgaW52ZXJzZT1mYWxzZSwgdXNlR29sZGVuPWZhbHNlKS0+XG4gICAgQHYwICAgICAgICAgPSB2MFxuICAgIEBpbnZlcnNlICAgID0gaW52ZXJzZVxuICAgIEBzdGFydEFuZ2xlID0gc3RhcnRBbmdsZVxuXG4gICAgQG1heFJhZGl1cyAgPSBtYXhSYWRpdXNcbiAgICBAbWluUmFkaXVzICA9IG1pblJhZGl1c1xuICAgIEByYWRpdXMgICAgID0gQG1heFJhZGl1cyAtIEBtaW5SYWRpdXNcblxuICAgIEB1c2VHb2xkZW4gID0gdXNlR29sZGVuXG5cbiAgICByZXR1cm5cbiAgLCAodCktPlxuICAgIHQgICAgID0gMSAtIHQgaWYgQGludmVyc2VcbiAgICBpZiBAdXNlR29sZGVuXG4gICAgICAgIHBoaSAgID0gKE1hdGguc3FydCg1KSsxKS8yIC0gMVxuICAgICAgICBnb2xkZW5fYW5nbGUgPSBwaGkgKiBNYXRoLlBJICogMlxuICAgICAgICBhbmdsZSA9IEBzdGFydEFuZ2xlICsgKGdvbGRlbl9hbmdsZSAqIHQpXG4gICAgICAgIGFuZ2xlICs9IE1hdGguUEkgKiAtMS4yMzVcbiAgICBlbHNlXG4gICAgICAgIGFuZ2xlID0gQHN0YXJ0QW5nbGUgKyAoTWF0aC5QSSAqIDIgKiB0KVxuXG4gICAgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIHZlY3Rvci54ID0gQHYwLnggKyBNYXRoLmNvcyhhbmdsZSkgKiAoQG1pblJhZGl1cyArIEByYWRpdXMgKiB0KVxuICAgIHZlY3Rvci55ID0gQHYwLnkgKyBNYXRoLnNpbihhbmdsZSkgKiAoQG1pblJhZGl1cyArIEByYWRpdXMgKiB0KVxuICAgIHZlY3Rvci56ID0gQHYwLnpcbiAgICByZXR1cm4gdmVjdG9yXG4pXG5cblRIUkVFLkxhdW5jaGVkQ3VydmUgPSBUSFJFRS5DdXJ2ZS5jcmVhdGUoXG4gICh2MCwgdjEsIG5iTG9vcD0yKS0+XG4gICAgQHYwICAgPSB2MFxuICAgIEB2MSAgID0gdjFcbiAgICBAbmJMb29wID0gbmJMb29wXG4gICAgcmV0dXJuXG4gICwgKHQpLT5cbiAgICBhbmdsZSA9IE1hdGguUEkgKiAyICogdCAqIEBuYkxvb3BcblxuICAgIGQgPSBAdjEueiAtIEB2MC56XG5cbiAgICBkaXN0ID0gQHYxLmNsb25lKCkuc3ViKEB2MClcblxuICAgIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICB2ZWN0b3IueCA9IEB2MC54ICsgZGlzdC54ICogdFxuICAgIHZlY3Rvci55ID0gQHYwLnkgKyBkaXN0LnkgKiB0XG4gICAgdmVjdG9yLnogPSBAdjAueiArIGRpc3QueiAqIHRcblxuICAgIHQgPSBNYXRoLm1pbih0LCAxIC0gdCkgLyAuNVxuXG4gICAgdmVjdG9yLnggKz0gTWF0aC5jb3MoYW5nbGUpICogKDUwICogdClcbiAgICB2ZWN0b3IueSArPSBNYXRoLnNpbihhbmdsZSkgKiAoNTAgKiB0KVxuXG4gICAgcmV0dXJuIHZlY3RvclxuKVxuXG5cbkhFTFBFUi5FYXNpbmcgPSB7XG5cbiAgI1xuICAjICBFYXNpbmcgZnVuY3Rpb24gaW5zcGlyZWQgZnJvbSBBSEVhc2luZ1xuICAjICBodHRwczovL2dpdGh1Yi5jb20vd2FycmVubS9BSEVhc2luZ1xuICAjXG5cbiAgIyMgTW9kZWxlZCBhZnRlciB0aGUgbGluZSB5ID0geFxuICBsaW5lYXI6IChwKS0+XG4gICAgcmV0dXJuIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBhcmFib2xhIHkgPSB4XjJcbiAgUXVhZHJhdGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcFxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGFyYWJvbGEgeSA9IC14XjIgKyAyeFxuICBRdWFkcmF0aWNFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiAtKHAgKiAocCAtIDIpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIHF1YWRyYXRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjIpICAgICAgICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gLSgxLzIpKCgyeC0xKSooMngtMykgLSAxKSA7IFswLjUsIDFdXG4gIFF1YWRyYXRpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDIgKiBwICogcFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoLTIgKiBwICogcCkgKyAoNCAqIHApIC0gMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgY3ViaWMgeSA9IHheM1xuICBDdWJpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBjdWJpYyB5ID0gKHggLSAxKV4zICsgMVxuICBDdWJpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSlcbiAgICByZXR1cm4gZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIGN1YmljXG4gICMgeSA9ICgxLzIpKCgyeCleMykgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKSgoMngtMileMyArIDIpIDsgWzAuNSwgMV1cbiAgQ3ViaWNFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiA0ICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9ICgoMiAqIHApIC0gMilcbiAgICAgIHJldHVybiAwLjUgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHheNFxuICBRdWFydGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHkgPSAxIC0gKHggLSAxKV40XG4gIFF1YXJ0aWNFYXNlT3V0OiAocCktPlxuICAgIGYgPSAocCAtIDEpXG4gICAgcmV0dXJuIGYgKiBmICogZiAqICgxIC0gcCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgcXVhcnRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjQpICAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9IC0oMS8yKSgoMngtMileNCAtIDIpIDsgWzAuNSwgMV1cbiAgUXVhcnRpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDggKiBwICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9IChwIC0gMSlcbiAgICAgIHJldHVybiAtOCAqIGYgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWludGljIHkgPSB4XjVcbiAgUXVpbnRpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwICogcCAqIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1aW50aWMgeSA9ICh4IC0gMSleNSArIDFcbiAgUXVpbnRpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSk7XG4gICAgcmV0dXJuIGYgKiBmICogZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIHF1aW50aWNcbiAgIyB5ID0gKDEvMikoKDJ4KV41KSAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKCgyeC0yKV41ICsgMikgOyBbMC41LCAxXVxuICBRdWludGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMTYgKiBwICogcCAqIHAgKiBwICogcFxuICAgIGVsc2VcbiAgICAgIGYgPSAoKDIgKiBwKSAtIDIpXG4gICAgICByZXR1cm4gIDAuNSAqIGYgKiBmICogZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciBxdWFydGVyLWN5Y2xlIG9mIHNpbmUgd2F2ZVxuICBTaW5lRWFzZUluOiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigocCAtIDEpICogTWF0aC5QSSAqIDIpICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciBxdWFydGVyLWN5Y2xlIG9mIHNpbmUgd2F2ZSAoZGlmZmVyZW50IHBoYXNlKVxuICBTaW5lRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gTWF0aC5zaW4ocCAqIE1hdGguUEkgKiAyKVxuXG4gICMgTW9kZWxlZCBhZnRlciBoYWxmIHNpbmUgd2F2ZVxuICBTaW5lRWFzZUluT3V0OiAocCktPlxuICAgIHJldHVybiAwLjUgKiAoMSAtIE1hdGguY29zKHAgKiBNYXRoLlBJKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgc2hpZnRlZCBxdWFkcmFudCBJViBvZiB1bml0IGNpcmNsZVxuICBDaXJjdWxhckVhc2VJbjogKHApLT5cbiAgICByZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gKHAgKiBwKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgc2hpZnRlZCBxdWFkcmFudCBJSSBvZiB1bml0IGNpcmNsZVxuICBDaXJjdWxhckVhc2VPdXQ6IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc3FydCgoMiAtIHApICogcCk7XG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgY2lyY3VsYXIgZnVuY3Rpb25cbiAgIyB5ID0gKDEvMikoMSAtIHNxcnQoMSAtIDR4XjIpKSAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKShzcXJ0KC0oMnggLSAzKSooMnggLSAxKSkgKyAxKSA7IFswLjUsIDFdXG4gIENpcmN1bGFyRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogKDEgLSBNYXRoLnNxcnQoMSAtIDQgKiAocCAqIHApKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMC41ICogKE1hdGguc3FydCgtKCgyICogcCkgLSAzKSAqICgoMiAqIHApIC0gMSkpICsgMSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGV4cG9uZW50aWFsIGZ1bmN0aW9uIHkgPSAyXigxMCh4IC0gMSkpXG4gIEV4cG9uZW50aWFsRWFzZUluOiAocCktPlxuICAgIHJldHVybiBpZiAocCA9PSAwLjApIHRoZW4gcCBlbHNlIE1hdGgucG93KDIsIDEwICogKHAgLSAxKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGV4cG9uZW50aWFsIGZ1bmN0aW9uIHkgPSAtMl4oLTEweCkgKyAxXG4gIEV4cG9uZW50aWFsRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gaWYgKHAgPT0gMS4wKSB0aGVuIHAgZWxzZSAxIC0gTWF0aC5wb3coMiwgLTEwICogcClcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBleHBvbmVudGlhbFxuICAjIHkgPSAoMS8yKTJeKDEwKDJ4IC0gMSkpICAgICAgICAgOyBbMCwwLjUpXG4gICMgeSA9IC0oMS8yKSoyXigtMTAoMnggLSAxKSkpICsgMSA7IFswLjUsMV1cbiAgRXhwb25lbnRpYWxFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA9PSAwLjAgfHwgcCA9PSAxLjApXG4gICAgICByZXR1cm4gcFxuXG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiBNYXRoLnBvdygyLCAoMjAgKiBwKSAtIDEwKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAtMC41ICogTWF0aC5wb3coMiwgKC0yMCAqIHApICsgMTApICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgZGFtcGVkIHNpbmUgd2F2ZSB5ID0gc2luKDEzcGkvMip4KSpwb3coMiwgMTAgKiAoeCAtIDEpKVxuICBFbGFzdGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigxMyAqIE1hdGguUEkgKiAyICogcCkgKiBNYXRoLnBvdygyLCAxMCAqIChwIC0gMSkpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBkYW1wZWQgc2luZSB3YXZlIHkgPSBzaW4oLTEzcGkvMiooeCArIDEpKSpwb3coMiwgLTEweCkgKyAxXG4gIEVsYXN0aWNFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigtMTMgKiBNYXRoLlBJICogMiAqIChwICsgMSkpICogTWF0aC5wb3coMiwgLTEwICogcCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgZXhwb25lbnRpYWxseS1kYW1wZWQgc2luZSB3YXZlOlxuICAjIHkgPSAoMS8yKSpzaW4oMTNwaS8yKigyKngpKSpwb3coMiwgMTAgKiAoKDIqeCkgLSAxKSkgICAgICA7IFswLDAuNSlcbiAgIyB5ID0gKDEvMikqKHNpbigtMTNwaS8yKigoMngtMSkrMSkpKnBvdygyLC0xMCgyKngtMSkpICsgMikgOyBbMC41LCAxXVxuICBFbGFzdGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogTWF0aC5zaW4oMTMgKiBNYXRoLlBJICogMiAqICgyICogcCkpICogTWF0aC5wb3coMiwgMTAgKiAoKDIgKiBwKSAtIDEpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5zaW4oLTEzICogTWF0aC5QSSAqIDIgKiAoKDIgKiBwIC0gMSkgKyAxKSkgKiBNYXRoLnBvdygyLCAtMTAgKiAoMiAqIHAgLSAxKSkgKyAyKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgb3ZlcnNob290aW5nIGN1YmljIHkgPSB4XjMteCpzaW4oeCpwaSlcbiAgQmFja0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwIC0gcCAqIE1hdGguc2luKHAgKiBNYXRoLlBJKVxuXG4gICMgTW9kZWxlZCBhZnRlciBvdmVyc2hvb3RpbmcgY3ViaWMgeSA9IDEtKCgxLXgpXjMtKDEteCkqc2luKCgxLXgpKnBpKSlcbiAgQmFja0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9ICgxIC0gcClcbiAgICByZXR1cm4gMSAtIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIG92ZXJzaG9vdGluZyBjdWJpYyBmdW5jdGlvbjpcbiAgIyB5ID0gKDEvMikqKCgyeCleMy0oMngpKnNpbigyKngqcGkpKSAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKSooMS0oKDEteCleMy0oMS14KSpzaW4oKDEteCkqcGkpKSsxKSA7IFswLjUsIDFdXG4gIEJhY2tFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIGYgPSAyICogcFxuICAgICAgcmV0dXJuIDAuNSAqIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKVxuICAgIGVsc2VcbiAgICAgIGYgPSAoMSAtICgyKnAgLSAxKSlcbiAgICAgIHJldHVybiAwLjUgKiAoMSAtIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKSkgKyAwLjVcblxuICBCb3VuY2VFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIDEgLSBAQm91bmNlRWFzZU91dCgxIC0gcCk7XG5cbiAgQm91bmNlRWFzZU91dDogKHApLT5cbiAgICBpZihwIDwgNC8xMS4wKVxuICAgICAgcmV0dXJuICgxMjEgKiBwICogcCkvMTYuMFxuICAgIGVsc2UgaWYocCA8IDgvMTEuMClcbiAgICAgIHJldHVybiAoMzYzLzQwLjAgKiBwICogcCkgLSAoOTkvMTAuMCAqIHApICsgMTcvNS4wXG4gICAgZWxzZSBpZihwIDwgOS8xMC4wKVxuICAgICAgcmV0dXJuICg0MzU2LzM2MS4wICogcCAqIHApIC0gKDM1NDQyLzE4MDUuMCAqIHApICsgMTYwNjEvMTgwNS4wXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICg1NC81LjAgKiBwICogcCkgLSAoNTEzLzI1LjAgKiBwKSArIDI2OC8yNS4wXG5cbiAgQm91bmNlRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogQEJvdW5jZUVhc2VJbihwKjIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIDAuNSAqIEBCb3VuY2VFYXNlT3V0KHAgKiAyIC0gMSkgKyAwLjVcblxufVxuXG5cbmNsYXNzIFNQQUNFLlNjZW5lIGV4dGVuZHMgVEhSRUUuU2NlbmVcbiAgX3BhdXNlZDogdHJ1ZVxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyXG5cbiAgICBAdHlwZSAgICAgICAgICAgICA9ICdTY2VuZSdcbiAgICBAZm9nICAgICAgICAgICAgICA9IG51bGxcbiAgICBAb3ZlcnJpZGVNYXRlcmlhbCA9IG51bGxcbiAgICBAYXV0b1VwZGF0ZSAgICAgICA9IHRydWVcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cbiAgICAgIEB1cGRhdGVPYmooY2hpbGQsIGRlbHRhKVxuXG4gIHVwZGF0ZU9iajogKG9iaiwgZGVsdGEpLT5cbiAgICBvYmoudXBkYXRlKGRlbHRhKSBpZiB0eXBlb2Ygb2JqLnVwZGF0ZSA9PSAnZnVuY3Rpb24nXG4gICAgaWYgb2JqLmhhc093blByb3BlcnR5KCdjaGlsZHJlbicpIGFuZCBvYmouY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgICAgZm9yIGNoaWxkIGluIG9iai5jaGlsZHJlblxuICAgICAgICBAdXBkYXRlT2JqKGNoaWxkLCBkZWx0YSlcblxuICByZXNpemU6ID0+XG4gICAgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuICAgICAgQHJlc2l6ZU9iaihjaGlsZClcblxuICByZXNpemVPYmo6IChvYmopLT5cbiAgICBvYmoucmVzaXplKCkgaWYgdHlwZW9mIG9iai5yZXNpemUgPT0gJ2Z1bmN0aW9uJ1xuICAgIGlmIG9iai5oYXNPd25Qcm9wZXJ0eSgnY2hpbGRyZW4nKSBhbmQgb2JqLmNoaWxkcmVuLmxlbmd0aCA+IDBcbiAgICAgIGZvciBjaGlsZCBpbiBvYmouY2hpbGRyZW5cbiAgICAgICAgQHJlc2l6ZU9iaihjaGlsZClcblxuICByZXN1bWU6IC0+XG4gICAgQF9wYXVzZWQgPSBmYWxzZVxuXG4gIHBhdXNlOiAtPlxuICAgIEBfcGF1c2VkID0gdHJ1ZVxuXG4gIGlzUGF1c2VkOiAtPlxuICAgIHJldHVybiBAX3BhdXNlZFxuXG5cbmNsYXNzIFNQQUNFLlNjZW5lTWFuYWdlclxuXG4gIGN1cnJlbnRTY2VuZTogbnVsbFxuICBfc2NlbmVzOiBudWxsXG4gIF9zdGF0czogbnVsbFxuICBfY2xvY2s6IG51bGxcblxuICByZW5kZXJlcjogbnVsbFxuICBjYW1lcmE6ICAgbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBfc2V0dXAoKVxuICAgIEBfZXZlbnRzKClcblxuICBzZXRQaXhlbFJhdGlvOiAocGl4ZWxSYXRpbyktPlxuICAgIEByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHBpeGVsUmF0aW8pXG4gICAgQHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcblxuICBfc2V0dXA6IC0+XG4gICAgQF9jbG9jayAgPSBuZXcgVEhSRUUuQ2xvY2soKVxuICAgIEBfc2NlbmVzID0gW11cbiAgICBAY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKVxuICAgIEByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlLCBhbHBoYTogZmFsc2UgfSlcbiAgICBAcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJykuYXBwZW5kQ2hpbGQoQHJlbmRlcmVyLmRvbUVsZW1lbnQpXG5cbiAgICBAX3NldHVwU3RhdHMoKSBpZiBTUEFDRS5FTlYgPT0gJ2RldmVsb3BtZW50J1xuICAgIEBfcmVuZGVyKClcblxuICBfZXZlbnRzOiAtPlxuICAgIHdpbmRvdy5vbnJlc2l6ZSA9IEBfZU9uUmVzaXplXG5cbiAgX2VPblJlc2l6ZTogPT5cbiAgICBAcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KVxuICAgIEBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICBAY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuICAgIEBjdXJyZW50U2NlbmUucmVzaXplKCkgaWYgQGN1cnJlbnRTY2VuZVxuXG4gIF9zZXR1cFN0YXRzOiAtPlxuICAgIEBfc3RhdHMgPSBuZXcgU3RhdHMoKVxuICAgIEBfc3RhdHMuc2V0TW9kZSgwKVxuICAgIEBfc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgICBAX3N0YXRzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnXG4gICAgQF9zdGF0cy5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggQF9zdGF0cy5kb21FbGVtZW50IClcblxuICBfcmVuZGVyOiA9PlxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoQF9yZW5kZXIpXG5cbiAgICBpZiAhQGN1cnJlbnRTY2VuZSBvciBAY3VycmVudFNjZW5lLmlzUGF1c2VkKClcbiAgICAgICAgcmV0dXJuXG5cbiAgICBAY3VycmVudFNjZW5lLnVwZGF0ZShAX2Nsb2NrLmdldERlbHRhKCkgKiAxMDAwKVxuICAgIEByZW5kZXJlci5yZW5kZXIoIEBjdXJyZW50U2NlbmUsIEBjYW1lcmEgKVxuXG4gICAgQF9zdGF0cy51cGRhdGUoKSBpZiBTUEFDRS5FTlYgPT0gJ2RldmVsb3BtZW50J1xuXG4gIGNyZWF0ZVNjZW5lOiAoaWRlbnRpZmllciktPlxuICAgIGlmIEBfc2NlbmVzW2lkZW50aWZpZXJdXG4gICAgICAgIHJldHVybiBAX3NjZW5lc1tpZGVudGlmaWVyXVxuXG4gICAgdHJ5XG4gICAgICBzY2VuZSA9IG5ldyAoZXZhbChcIlNQQUNFLlwiK2lkZW50aWZpZXIpKSgpXG4gICAgICBAX3NjZW5lc1tpZGVudGlmaWVyXSA9IHNjZW5lXG4gICAgY2F0Y2ggZVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICByZXR1cm4gc2NlbmVcblxuICBnb1RvU2NlbmU6IChpZGVudGlmaWVyKS0+XG4gICAgaWYgQF9zY2VuZXNbaWRlbnRpZmllcl1cbiAgICAgICAgQGN1cnJlbnRTY2VuZS5wYXVzZSgpIGlmIEBjdXJyZW50U2NlbmVcbiAgICAgICAgQGN1cnJlbnRTY2VuZSA9IEBfc2NlbmVzW2lkZW50aWZpZXJdXG4gICAgICAgIEBjdXJyZW50U2NlbmUucmVzdW1lKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICBhbGVydChcIlNjZW5lICdcIitpZGVudGlmaWVyK1wiJyBkb2Vzbid0IGV4aXN0XCIpXG4gICAgcmV0dXJuIGZhbHNlXG5cblxuY2xhc3MgU1BBQ0UuTWFpblNjZW5lIGV4dGVuZHMgU1BBQ0UuU2NlbmVcblxuICBfbWFuYWdlcjogbnVsbFxuICBfanVrZWJveDogbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyKClcblxuICByZXN1bWU6IC0+XG4gICAgc3VwZXIoKVxuXG4gICAgQF9tYW5hZ2VyID0gU1BBQ0UuU2NlbmVNYW5hZ2VyXG5cbiAgICAjIFNldHVwIHJlbmRlcmVyXG4gICAgQF9tYW5hZ2VyLmNhbWVyYS5wb3NpdGlvbi5zZXRaKDYwMClcbiAgICAjIEBfbWFuYWdlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKVxuXG4gICAgIyBAX21hbmFnZXIucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg1OGIxZmYpKVxuICAgICMgQF9tYW5hZ2VyLnJlbmRlcmVyLnNoYWRvd01hcEVuYWJsZWQgPSB0cnVlXG4gICAgIyBAX21hbmFnZXIucmVuZGVyZXIuc2hhZG93TWFwU29mdCAgICA9IHRydWVcbiAgICAjIEBfbWFuYWdlci5yZW5kZXJlci5zaGFkb3dNYXBUeXBlICAgID0gVEhSRUUuUENGU2hhZG93TWFwXG5cbiAgICAjIENyZWF0ZSBhIFNDIHNpbmdsZXRvblxuICAgIFNQQUNFLlNDID0gbmV3IFNQQUNFLlNvdW5kQ2xvdWQoU1BBQ0UuU0MuaWQsIFNQQUNFLlNDLnJlZGlyZWN0X3VyaSlcblxuICAgIEBfZXZlbnRzKClcbiAgICBAX3NldHVwKClcblxuICBwYXVzZTogLT5cblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoU1BBQ0UuU291bmRDbG91ZC5JU19DT05ORUNURUQsIEBfZVNDSXNDb25uZWN0ZWQpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihTUEFDRS5Db3ZlckNvbnRyb2xsZXIuUExBWUxJU1RfTE9BREVELCBAX2VQbGF5bGlzdExvYWRlZClcblxuICBfZVNDSXNDb25uZWN0ZWQ6ID0+XG4gICAgQF9maWxsSnVrZWJveCgpXG5cbiAgX2VQbGF5bGlzdExvYWRlZDogPT5cbiAgICBAX2ZpbGxKdWtlYm94KCkgaWYgU1BBQ0UuU0MuaXNDb25uZWN0ZWQoKVxuXG4gIF9zZXR1cDogPT5cbiAgICB3aW5kb3cuZmlyc3RMYXVuY2ggPSB0cnVlXG5cbiAgICAjIFNldHVwIEp1a2Vib3hcbiAgICBAX2p1a2Vib3ggPSBuZXcgSnVrZWJveCgpXG4gICAgU1BBQ0UuSnVrZWJveCA9IEBfanVrZWJveFxuICAgICMgQF9qdWtlYm94LmFkZCgncmVzb3VyY2VzL3NvdW5kcy9hbGxfZGF5Lm1wMycsIHRydWUpXG4gICAgIyBAX2p1a2Vib3guYWRkKCdodHRwczovL3NvdW5kY2xvdWQuY29tL2Jvbi1lbnRlbmRldXItbXVzaWMvbGFmaWVydGUnKVxuXG4gICAgIyBTZXR1cCBlcXVhbGl6ZXJzXG4gICAgc21hbGwgPSBuZXcgU1BBQ0UuRXF1YWxpemVyKHtcbiAgICAgIG1pbkxlbmd0aDogMFxuICAgICAgbWF4TGVuZ3RoOiAyMDBcbiAgICAgIHJhZGl1czogMzAwXG4gICAgICBjb2xvcjogMHhGRkZGRkZcbiAgICAgIGFic29sdXRlOiBmYWxzZVxuICAgICAgbGluZUZvcmNlRG93bjogLjVcbiAgICAgIGxpbmVGb3JjZVVwOiAxXG4gICAgICBpbnRlcnBvbGF0aW9uVGltZTogMjUwXG4gICAgfSlcbiAgICBAYWRkKHNtYWxsKVxuXG4gICAgYmlnID0gbmV3IFNQQUNFLkVxdWFsaXplcih7XG4gICAgICBtaW5MZW5ndGg6IDBcbiAgICAgIG1heExlbmd0aDogNTBcbiAgICAgIHJhZGl1czogMzAwXG4gICAgICBjb2xvcjogMHhEMUQxRDFcbiAgICAgIGFic29sdXRlOiBmYWxzZVxuICAgICAgbGluZUZvcmNlRG93bjogLjVcbiAgICAgIGxpbmVGb3JjZVVwOiAxXG4gICAgICBpbnRlcnBvbGF0aW9uVGltZTogMjUwXG4gICAgfSlcbiAgICBAYWRkKGJpZylcblxuICAgICMgU2V0dXAgY292ZXJcbiAgICBAY292ZXIgPSBuZXcgU1BBQ0UuQ292ZXJDb250cm9sbGVyKClcbiAgICBAYWRkKEBjb3Zlci52aWV3KVxuXG4gIF9maWxsSnVrZWJveDogPT5cbiAgICBmb3IgdHJhY2ssIGkgaW4gQGNvdmVyLnBsYXlsaXN0XG4gICAgICBAX2p1a2Vib3guYWRkKHRyYWNrLnVybClcblxuXG5jbGFzcyBTUEFDRS5Tb3VuZENsb3VkXG5cbiAgY2xpZW50X2lkOiAgICBudWxsXG4gIHJlZGlyZWN0X3VyaTogbnVsbFxuICB0b2tlbjogICAgICAgIG51bGxcblxuICBASVNfQ09OTkVDVEVEOiAnc291bmRjbG91ZF9jb25uZWN0ZWQnIygtPiByZXR1cm4gbmV3IEV2ZW50KCdzb3VuZGNsb3VkX2Nvbm5lY3RlZCcpKSgpXG5cbiAgY29uc3RydWN0b3I6IChpZCwgcmVkaXJlY3RfdXJpKS0+XG4gICAgU0MuaW5pdGlhbGl6ZSh7XG4gICAgICBjbGllbnRfaWQ6IGlkXG4gICAgICByZWRpcmVjdF91cmk6IHJlZGlyZWN0X3VyaVxuICAgIH0pXG5cbiAgICBAY2xpZW50X2lkICAgID0gaWRcbiAgICBAcmVkaXJlY3RfdXJpID0gcmVkaXJlY3RfdXJpXG5cbiAgICBpZiBub3QgQGlzQ29ubmVjdGVkKCkgYW5kIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG4gICAgICBkb2N1bWVudC5jb29raWUgPSBcInNvdW5kY2xvdWRfdG9rZW49MS04MDI2OS0xMTQ1NzExNi0wNDAyOWExNGJkZmMyODZcIlxuICAgICAgZG9jdW1lbnQuY29va2llID0gXCJzb3VuZGNsb3VkX2Nvbm5lY3RlZD10cnVlXCJcblxuICBpc0Nvbm5lY3RlZDogLT5cbiAgICBpZiAoZG9jdW1lbnQuY29va2llLnJlcGxhY2UoLyg/Oig/Ol58Lio7XFxzKilzb3VuZGNsb3VkX2Nvbm5lY3RlZFxccypcXD1cXHMqKFteO10qKS4qJCl8Xi4qJC8sIFwiJDFcIikgIT0gXCJ0cnVlXCIpXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW4nKS5jbGFzc0xpc3QuYWRkKCdzaG93JylcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgQF9lQ2xpY2spXG4gICAgZWxzZVxuICAgICAgQHRva2VuID0gZG9jdW1lbnQuY29va2llLnJlcGxhY2UoLyg/Oig/Ol58Lio7XFxzKilzb3VuZGNsb3VkX3Rva2VuXFxzKlxcPVxccyooW147XSopLiokKXxeLiokLywgXCIkMVwiKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICBfZUNsaWNrOiA9PlxuICAgIFNDLmNvbm5lY3QoPT5cbiAgICAgIEB0b2tlbiAgICAgICAgICA9IFNDLmFjY2Vzc1Rva2VuKClcbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IFwic291bmRjbG91ZF90b2tlbj1cIiArIEB0b2tlblxuICAgICAgZG9jdW1lbnQuY29va2llID0gXCJzb3VuZGNsb3VkX2Nvbm5lY3RlZD10cnVlXCJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbicpLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxuICAgICAgSEVMUEVSLnRyaWdnZXIoU1BBQ0UuU291bmRDbG91ZC5JU19DT05ORUNURUQpXG4gICAgKVxuXG4gIHBhdGhPclVybDogKHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgIyBWZXJpZnkgaWYgaXQncyBhbiBJRCBvciBhbiBVUkxcbiAgICBpZiAvXlxcLyhwbGF5bGlzdHN8dHJhY2tzfHVzZXJzKVxcL1swLTldKyQvLnRlc3QocGF0aClcbiAgICAgIHJldHVybiBjYWxsYmFjayhwYXRoKVxuXG4gICAgdW5sZXNzIC9eKGh0dHB8aHR0cHMpLy50ZXN0KHBhdGgpXG4gICAgICByZXR1cm4gY29uc29sZS5sb2cgXCJcXFwiXCIgKyBwYXRoICsgXCJcXFwiIGlzIG5vdCBhbiB1cmwgb3IgYSBwYXRoXCJcblxuICAgIFNDLmdldCgnL3Jlc29sdmUnLCB7IHVybDogcGF0aCB9LCAodHJhY2ssIGVycm9yKT0+XG4gICAgICBpZiAoZXJyb3IpXG4gICAgICAgIGNvbnNvbGUubG9nIGVycm9yLm1lc3NhZ2VcbiAgICAgIGVsc2VcbiAgICAgICAgdXJsID0gWycnLCB0cmFjay5raW5kKydzJywgdHJhY2suaWRdLmpvaW4oJy8nKVxuICAgICAgICBjYWxsYmFjayh1cmwpXG4gICAgKVxuXG4gIHN0cmVhbVNvdW5kOiAob2JqZWN0LCBvcHRpb25zPXt9LCBjYWxsYmFjayktPlxuICAgIGlmIG9iamVjdCBhbmQgb2JqZWN0Lmhhc093blByb3BlcnR5KCdraW5kJylcbiAgICAgIHBhdGggPSBvYmplY3QudXJpLnJlcGxhY2UoJ2h0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tJywgJycpXG5cbiAgICAgIGRlZmF1bHRzID1cbiAgICAgICAgYXV0b1BsYXk6IHRydWVcbiAgICAgICAgdXNlV2F2ZWZvcm1EYXRhOiB0cnVlXG4gICAgICAgIHVzZUhUTUw1YXVkaW86IHRydWVcbiAgICAgICAgcHJlZmVyRmxhc2g6IGZhbHNlXG5cbiAgICAgIG9wdGlvbnMgPSBIRUxQRVIuQ29mZmVlLm1lcmdlKGRlZmF1bHRzLCBvcHRpb25zKVxuICAgICAgU0Muc3RyZWFtKHBhdGgsIG9wdGlvbnMsIGNhbGxiYWNrKVxuXG4gIGdldFNvdW5kT3JQbGF5bGlzdDogKHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgaWYgdHlwZW9mIHBhdGggPT0gJ29iamVjdCcgYW5kIHBhdGguaGFzT3duUHJvcGVydHkoJ2tpbmQnKVxuICAgICAgY2FsbGJhY2socGF0aClcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICBAcGF0aE9yVXJsKHBhdGgsIChwYXRoKT0+XG4gICAgICBAZ2V0KHBhdGgsIGNhbGxiYWNrKVxuICAgIClcblxuICBnZXQ6IChwYXRoLCBjYWxsYmFjayktPlxuICAgIFNDLmdldChwYXRoLCBjYWxsYmFjaylcblxuICBnZXRTb3VuZFVybDogKHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgQGdldFNvdW5kT3JQbGF5bGlzdChwYXRoLCAoc291bmQpPT5cbiAgICAgIGNhbGxiYWNrKHNvdW5kLnN0cmVhbV91cmwrJz9vYXV0aF90b2tlbj0nK0B0b2tlbilcbiAgICApXG5cbiAgc2VhcmNoOiAoc2VhcmNoLCBwYXRoLCBjYWxsYmFjayktPlxuICAgIGlmIHR5cGVvZiBwYXRoID09ICdmdW5jdGlvbidcbiAgICAgIGNhbGxiYWNrID0gcGF0aFxuICAgICAgcGF0aCAgICAgPSAndHJhY2tzJ1xuXG4gICAgaWYgcGF0aCA9PSAndXNlcnMnXG4gICAgICBAcGF0aE9yVXJsKCdodHRwczovL3NvdW5kY2xvdWQuY29tLycrc2VhcmNoLCAocGF0aCk9PlxuICAgICAgICBwYXRoID0gcGF0aCsnL2Zhdm9yaXRlcz9vYXV0aF90b2tlbj0nK0B0b2tlblxuICAgICAgICBTQy5nZXQocGF0aCwgY2FsbGJhY2spXG4gICAgICApXG4gICAgZWxzZVxuICAgICAgcGF0aCA9ICcvJytwYXRoKyc/b2F1dGhfdG9rZW49JytAdG9rZW4rJyZxPScrc2VhcmNoXG4gICAgICBTQy5nZXQocGF0aCwgY2FsbGJhY2spXG5cblxuY2xhc3MgU1BBQ0UuU2VhcmNoRW5naW5lXG4gIFNDOiBudWxsXG4gIGp1a2Vib3g6IG51bGxcblxuICAjIEhUTUxcbiAgaW5wdXQ6ICAgICAgICAgbnVsbFxuICBsaXN0OiAgICAgICAgICBudWxsXG4gIGxpc3RDb250YWluZXI6IG51bGxcbiAgZWw6ICAgICAgICAgICAgbnVsbFxuICBsaW5lSGVpZ2h0OiAgICAwXG4gIHJlc3VsdHNIZWlnaHQ6IDBcbiAgcmVzdWx0czogICAgICAgbnVsbFxuICBmb2N1c2VkOiAgICAgICBudWxsXG5cbiAgc2Nyb2xsUG9zOiAgICAgMFxuXG4gIEBzdGF0ZTogIG51bGxcblxuXG4gIGNvbnN0cnVjdG9yOiAoanVrZWJveCktPlxuICAgIEBqdWtlYm94ICAgICAgID0ganVrZWJveFxuICAgIEBTQyAgICAgICAgICAgID0gU1BBQ0UuU0NcblxuICAgIEBlbCAgICAgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCcpXG4gICAgQGlucHV0ICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoIGZvcm0gaW5wdXQnKVxuICAgIEBsaXN0ICAgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCAubGlzdCcpXG4gICAgQGxpc3RDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoIHVsJylcblxuICAgIEBzZXRTdGF0ZShTZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRUQpXG4gICAgQF9ldmVudHMoKVxuXG4gIF9ldmVudHM6IC0+XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCBmb3JtJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgQF9lSnVrZWJveElzU2VhcmNoaW5nKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgQF9lS2V5cHJlc3MpXG5cbiAgX2VKdWtlYm94SXNTZWFyY2hpbmc6IChlKT0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgQHNlYXJjaChAaW5wdXQudmFsdWUpIGlmIEBpbnB1dC52YWx1ZS5sZW5ndGggPiAwXG5cbiAgX2VLZXlwcmVzczogKGUpPT5cbiAgICBzd2l0Y2goZS5rZXlDb2RlKVxuICAgICAgd2hlbiBLZXlib2FyZC5FTlRFUlxuICAgICAgICBpZiBAaW5wdXQudmFsdWUubGVuZ3RoID09IDBcbiAgICAgICAgICBpZiBAc3RhdGUgPT0gU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEXG4gICAgICAgICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBzZXRTdGF0ZShTZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRUQpXG4gICAgICAgIGVsc2UgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSCBhbmQgQGZvY3VzZWRcbiAgICAgICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuVFJBQ0tfU0VMRUNURUQpXG4gICAgICAgIGVsc2UgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEXG4gICAgICAgICAgQGFkZCgpXG5cbiAgICAgIHdoZW4gS2V5Ym9hcmQuVVBcbiAgICAgICAgQHVwKCkgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSFxuXG4gICAgICB3aGVuIEtleWJvYXJkLkRPV05cbiAgICAgICAgQGRvd24oKSBpZiBAc3RhdGUgPT0gU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIXG5cbiAgICAgIHdoZW4gS2V5Ym9hcmQuRVNDLCBLZXlib2FyZC5ERUxFVEVcbiAgICAgICAgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSFxuICAgICAgICAgIEBzZXRTdGF0ZShTZWFyY2hFbmdpbmVTdGF0ZS5PUEVORUQpXG4gICAgICAgIGVsc2UgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEXG4gICAgICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBzZXRTdGF0ZShTZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRUQpXG5cbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgc2V0U3RhdGU6IChzdGF0ZSktPlxuICAgIEBzdGF0ZSA9IHN0YXRlXG4gICAgc3dpdGNoIEBzdGF0ZVxuICAgICAgd2hlbiBTZWFyY2hFbmdpbmVTdGF0ZS5PUEVORURcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIEBlbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWFyY2hfb3BlbicpXG5cbiAgICAgICAgQGlucHV0LnZhbHVlICAgID0gJydcbiAgICAgICAgQGlucHV0LmRpc2FibGVkID0gZmFsc2VcbiAgICAgICAgQGlucHV0LmZvY3VzKClcblxuICAgICAgICBAcmVzZXQoKVxuICAgICAgd2hlbiBTZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRURcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICB3aGVuIFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSFxuICAgICAgICBAZWwuY2xhc3NMaXN0LmFkZCgnc2VhcmNoX29wZW4nKVxuXG4gICAgICAgIEBpbnB1dC5kaXNhYmxlZCA9IHRydWVcbiAgICAgICAgQGlucHV0LmJsdXIoKVxuXG4gICAgICAgIEBsaW5lSGVpZ2h0ICAgID0gQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvcignbGknKS5vZmZzZXRIZWlnaHRcbiAgICAgICAgQHJlc3VsdHNIZWlnaHQgPSBAbGluZUhlaWdodCAqIChAbGlzdENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdsaScpLmxlbmd0aC0xKVxuXG4gICAgICAgIEBmb2N1c2VkLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJykgaWYgQGZvY3VzZWRcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2l0ZW1fc2VsZWN0ZWQnKVxuICAgICAgd2hlbiBTZWFyY2hFbmdpbmVTdGF0ZS5UUkFDS19TRUxFQ1RFRFxuICAgICAgICBAZm9jdXNlZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgICAgIEBlbC5jbGFzc0xpc3QuYWRkKCdpdGVtX3NlbGVjdGVkJylcblxuICB1cDogLT5cbiAgICBuZXh0ID0gQHNjcm9sbFBvcyArIEBsaW5lSGVpZ2h0XG4gICAgaWYgbmV4dCA8PSAwXG4gICAgICBAc2Nyb2xsUG9zID0gbmV4dFxuICAgICAgQGZvY3VzKClcblxuICBkb3duOiAtPlxuICAgIG5leHQgPSBAc2Nyb2xsUG9zIC0gQGxpbmVIZWlnaHRcbiAgICBpZiBNYXRoLmFicyhuZXh0KSA8PSBAcmVzdWx0c0hlaWdodFxuICAgICAgQHNjcm9sbFBvcyA9IG5leHRcbiAgICAgIEBmb2N1cygpXG5cbiAgZm9jdXM6ID0+XG4gICAgaWYgQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGggPiAxXG4gICAgICAkKFtAbGlzdENvbnRhaW5lciwgQGlucHV0XSkuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsICcrQHNjcm9sbFBvcysncHgpJylcbiAgICAgIHBvcyA9IChAc2Nyb2xsUG9zKi0xKSAvIChAcmVzdWx0c0hlaWdodCAvIChAbGlzdENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdsaScpLmxlbmd0aC0xKSlcbiAgICAgIHBvcyA9IE1hdGguZmxvb3IocG9zKVxuICAgICAgZWxtID0gQGVsLnF1ZXJ5U2VsZWN0b3IoJ2xpOm50aC1jaGlsZCgnKyhwb3MrMSkrJyknKVxuXG4gICAgICBpZiBlbG0uZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JylcbiAgICAgICAgQGZvY3VzZWQuY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXNlZCcpIGlmIEBmb2N1c2VkXG4gICAgICAgIEBmb2N1c2VkID0gZWxtXG4gICAgICAgIEBmb2N1c2VkLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzZWQnKVxuICAgICAgZWxzZVxuICAgICAgICBAZm9jdXNlZCA9IG51bGxcbiAgICBlbHNlXG4gICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEKVxuICAgICAgIyAkKFtAbGlzdENvbnRhaW5lciwgQGlucHV0XSkuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDApJylcblxuICByZXNldDogLT5cbiAgICBAZm9jdXNlZCAgID0gbnVsbFxuICAgIEBzY3JvbGxQb3MgPSAwXG4gICAgJChbQGxpc3RDb250YWluZXIsIEBpbnB1dF0pLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAnK0BzY3JvbGxQb3MrJ3B4KScpXG4gICAgQGxpc3RDb250YWluZXIuaW5uZXJIVE1MID0gJydcblxuICBhZGQ6IC0+XG4gICAgaW5kZXggPSBAZm9jdXNlZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKVxuICAgIHRyYWNrID0gQHJlc3VsdHNbaW5kZXhdXG4gICAgQGp1a2Vib3guYWRkKHRyYWNrKSBpZiB0cmFja1xuXG4gICAgQGZvY3VzZWQuY2xhc3NMaXN0LmFkZCgnYWRkZWQnKVxuICAgICQoQGZvY3VzZWQpLmNzcyh7XG4gICAgICAndHJhbnNmb3JtJzogJ3NjYWxlKC43NSkgdHJhbnNsYXRlWCgnK3dpbmRvdy5pbm5lcldpZHRoKydweCknXG4gICAgfSlcblxuICAgIHNldFRpbWVvdXQoPT5cbiAgICAgIEBmb2N1c2VkLnJlbW92ZSgpXG4gICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIKVxuICAgICAgQHVwKCkgaWYgQGZvY3VzZWQubmV4dFNpYmxpbmdcbiAgICAgIEBmb2N1cygpXG4gICAgLCA1MDApXG5cbiAgc2VhcmNoOiAodmFsdWUpLT5cbiAgICBwYXRoID0gdmFsdWUuc3BsaXQoL1xccy8pWzBdXG4gICAgaWYgL14odHJhY2t8dHJhY2tzfHBsYXlsaXN0fHBsYXlsaXN0c3xzZXR8c2V0c3x1c2VyfHVzZXJzKSQvLnRlc3QocGF0aClcbiAgICAgIGxhc3RDaGFyID0gcGF0aC5jaGFyQXQocGF0aC5sZW5ndGgtMSlcbiAgICAgIHZhbHVlICAgID0gdmFsdWUucmVwbGFjZShwYXRoKycgJywgJycpXG4gICAgICBwYXRoICAgICArPSAncycgaWYgbGFzdENoYXIgIT0gJ3MnXG4gICAgICBwYXRoICAgICA9ICdwbGF5bGlzdHMnIGlmIC9zZXRzLy50ZXN0KHBhdGgpXG4gICAgZWxzZVxuICAgICAgcGF0aCAgICAgPSAndHJhY2tzJ1xuXG4gICAgc3RyaW5nID0gJycnXG4gICAgICBbXG4gICAgICAgIHtcImtpbmRcIjpcInRyYWNrXCIsXCJpZFwiOjYzMjU2OTA2LFwiY3JlYXRlZF9hdFwiOlwiMjAxMi8xMC8xMyAxMDo0NzoxNiArMDAwMFwiLFwidXNlcl9pZFwiOjc4ODIwNSxcImR1cmF0aW9uXCI6MjM3ODQwLFwiY29tbWVudGFibGVcIjp0cnVlLFwic3RhdGVcIjpcImZpbmlzaGVkXCIsXCJvcmlnaW5hbF9jb250ZW50X3NpemVcIjo5NTQzMTY4LFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMi8yMiAyMTowMToxNyArMDAwMFwiLFwic2hhcmluZ1wiOlwicHVibGljXCIsXCJ0YWdfbGlzdFwiOlwiXCIsXCJwZXJtYWxpbmtcIjpcImphbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwic3RyZWFtYWJsZVwiOnRydWUsXCJlbWJlZGRhYmxlX2J5XCI6XCJhbGxcIixcImRvd25sb2FkYWJsZVwiOnRydWUsXCJwdXJjaGFzZV91cmxcIjpcImh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX2lkXCI6bnVsbCxcInB1cmNoYXNlX3RpdGxlXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiBETFwiLFwiZ2VucmVcIjpcIlBvcGxvY2tpbiBNdXNpY1wiLFwidGl0bGVcIjpcIkphbmV0IEphY2tzb24gLSBJZiAoS2F5dHJhbmFkYSBSZW1peClcIixcImRlc2NyaXB0aW9uXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiwgZm9yIERKcywgd2VsbCwgdGhhdHMgdGhlIHZlcnNpb24gaSB1c2UgZm9yIG15IGRqIHNldHM7IGh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX25hbWVcIjpcIlwiLFwicmVsZWFzZVwiOlwiXCIsXCJ0cmFja190eXBlXCI6XCJyZW1peFwiLFwia2V5X3NpZ25hdHVyZVwiOlwiXCIsXCJpc3JjXCI6XCJcIixcInZpZGVvX3VybFwiOm51bGwsXCJicG1cIjpudWxsLFwicmVsZWFzZV95ZWFyXCI6bnVsbCxcInJlbGVhc2VfbW9udGhcIjpudWxsLFwicmVsZWFzZV9kYXlcIjpudWxsLFwib3JpZ2luYWxfZm9ybWF0XCI6XCJtcDNcIixcImxpY2Vuc2VcIjpcImFsbC1yaWdodHMtcmVzZXJ2ZWRcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2XCIsXCJ1c2VyXCI6e1wiaWRcIjo3ODgyMDUsXCJraW5kXCI6XCJ1c2VyXCIsXCJwZXJtYWxpbmtcIjpcImtheXRyYW5hZGFcIixcInVzZXJuYW1lXCI6XCJLQVlUUkFOQURBXCIsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzExLzA3IDA0OjExOjM2ICswMDAwXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3VzZXJzLzc4ODIwNVwiLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGFcIixcImF2YXRhcl91cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hdmF0YXJzLTAwMDA3NDgwMzY5NC1xaWJ4dDQtbGFyZ2UuanBnXCJ9LFwidXNlcl9wbGF5YmFja19jb3VudFwiOjEsXCJ1c2VyX2Zhdm9yaXRlXCI6dHJ1ZSxcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhL2phbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwiYXJ0d29ya191cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hcnR3b3Jrcy0wMDAwMzIwOTQ1OTctNTZ0czduLWxhcmdlLmpwZ1wiLFwid2F2ZWZvcm1fdXJsXCI6XCJodHRwczovL3cxLnNuZGNkbi5jb20vYXFSR2k0RG1iQ1d6X20ucG5nXCIsXCJzdHJlYW1fdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvc3RyZWFtXCIsXCJkb3dubG9hZF91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9kb3dubG9hZFwiLFwicGxheWJhY2tfY291bnRcIjozMzMxMDMzLFwiZG93bmxvYWRfY291bnRcIjo5NjExMixcImZhdm9yaXRpbmdzX2NvdW50XCI6NjY2NTMsXCJjb21tZW50X2NvdW50XCI6MTU5NCxcImF0dGFjaG1lbnRzX3VyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2F0dGFjaG1lbnRzXCIsXCJwb2xpY3lcIjpcIkFMTE9XXCJ9LFxuICAgICAgICB7XCJraW5kXCI6XCJ0cmFja1wiLFwiaWRcIjo2MzI1NjkwNixcImNyZWF0ZWRfYXRcIjpcIjIwMTIvMTAvMTMgMTA6NDc6MTYgKzAwMDBcIixcInVzZXJfaWRcIjo3ODgyMDUsXCJkdXJhdGlvblwiOjIzNzg0MCxcImNvbW1lbnRhYmxlXCI6dHJ1ZSxcInN0YXRlXCI6XCJmaW5pc2hlZFwiLFwib3JpZ2luYWxfY29udGVudF9zaXplXCI6OTU0MzE2OCxcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTIvMjIgMjE6MDE6MTcgKzAwMDBcIixcInNoYXJpbmdcIjpcInB1YmxpY1wiLFwidGFnX2xpc3RcIjpcIlwiLFwicGVybWFsaW5rXCI6XCJqYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcInN0cmVhbWFibGVcIjp0cnVlLFwiZW1iZWRkYWJsZV9ieVwiOlwiYWxsXCIsXCJkb3dubG9hZGFibGVcIjp0cnVlLFwicHVyY2hhc2VfdXJsXCI6XCJodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9pZFwiOm51bGwsXCJwdXJjaGFzZV90aXRsZVwiOlwiQWx0ZXJuYXRlIFZlcnNpb24gRExcIixcImdlbnJlXCI6XCJQb3Bsb2NraW4gTXVzaWNcIixcInRpdGxlXCI6XCJKYW5ldCBKYWNrc29uIC0gSWYgKEtheXRyYW5hZGEgUmVtaXgpXCIsXCJkZXNjcmlwdGlvblwiOlwiQWx0ZXJuYXRlIFZlcnNpb24sIGZvciBESnMsIHdlbGwsIHRoYXRzIHRoZSB2ZXJzaW9uIGkgdXNlIGZvciBteSBkaiBzZXRzOyBodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9uYW1lXCI6XCJcIixcInJlbGVhc2VcIjpcIlwiLFwidHJhY2tfdHlwZVwiOlwicmVtaXhcIixcImtleV9zaWduYXR1cmVcIjpcIlwiLFwiaXNyY1wiOlwiXCIsXCJ2aWRlb191cmxcIjpudWxsLFwiYnBtXCI6bnVsbCxcInJlbGVhc2VfeWVhclwiOm51bGwsXCJyZWxlYXNlX21vbnRoXCI6bnVsbCxcInJlbGVhc2VfZGF5XCI6bnVsbCxcIm9yaWdpbmFsX2Zvcm1hdFwiOlwibXAzXCIsXCJsaWNlbnNlXCI6XCJhbGwtcmlnaHRzLXJlc2VydmVkXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNlwiLFwidXNlclwiOntcImlkXCI6Nzg4MjA1LFwia2luZFwiOlwidXNlclwiLFwicGVybWFsaW5rXCI6XCJrYXl0cmFuYWRhXCIsXCJ1c2VybmFtZVwiOlwiS0FZVFJBTkFEQVwiLFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMS8wNyAwNDoxMTozNiArMDAwMFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS91c2Vycy83ODgyMDVcIixcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhXCIsXCJhdmF0YXJfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAwNzQ4MDM2OTQtcWlieHQ0LWxhcmdlLmpwZ1wifSxcInVzZXJfcGxheWJhY2tfY291bnRcIjoxLFwidXNlcl9mYXZvcml0ZVwiOnRydWUsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYS9qYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcImFydHdvcmtfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtMDAwMDMyMDk0NTk3LTU2dHM3bi1sYXJnZS5qcGdcIixcIndhdmVmb3JtX3VybFwiOlwiaHR0cHM6Ly93MS5zbmRjZG4uY29tL2FxUkdpNERtYkNXel9tLnBuZ1wiLFwic3RyZWFtX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L3N0cmVhbVwiLFwiZG93bmxvYWRfdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvZG93bmxvYWRcIixcInBsYXliYWNrX2NvdW50XCI6MzMzMTAzMyxcImRvd25sb2FkX2NvdW50XCI6OTYxMTIsXCJmYXZvcml0aW5nc19jb3VudFwiOjY2NjUzLFwiY29tbWVudF9jb3VudFwiOjE1OTQsXCJhdHRhY2htZW50c191cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9hdHRhY2htZW50c1wiLFwicG9saWN5XCI6XCJBTExPV1wifSxcbiAgICAgICAge1wia2luZFwiOlwidHJhY2tcIixcImlkXCI6NjMyNTY5MDYsXCJjcmVhdGVkX2F0XCI6XCIyMDEyLzEwLzEzIDEwOjQ3OjE2ICswMDAwXCIsXCJ1c2VyX2lkXCI6Nzg4MjA1LFwiZHVyYXRpb25cIjoyMzc4NDAsXCJjb21tZW50YWJsZVwiOnRydWUsXCJzdGF0ZVwiOlwiZmluaXNoZWRcIixcIm9yaWdpbmFsX2NvbnRlbnRfc2l6ZVwiOjk1NDMxNjgsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzEyLzIyIDIxOjAxOjE3ICswMDAwXCIsXCJzaGFyaW5nXCI6XCJwdWJsaWNcIixcInRhZ19saXN0XCI6XCJcIixcInBlcm1hbGlua1wiOlwiamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJzdHJlYW1hYmxlXCI6dHJ1ZSxcImVtYmVkZGFibGVfYnlcIjpcImFsbFwiLFwiZG93bmxvYWRhYmxlXCI6dHJ1ZSxcInB1cmNoYXNlX3VybFwiOlwiaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfaWRcIjpudWxsLFwicHVyY2hhc2VfdGl0bGVcIjpcIkFsdGVybmF0ZSBWZXJzaW9uIERMXCIsXCJnZW5yZVwiOlwiUG9wbG9ja2luIE11c2ljXCIsXCJ0aXRsZVwiOlwiSmFuZXQgSmFja3NvbiAtIElmIChLYXl0cmFuYWRhIFJlbWl4KVwiLFwiZGVzY3JpcHRpb25cIjpcIkFsdGVybmF0ZSBWZXJzaW9uLCBmb3IgREpzLCB3ZWxsLCB0aGF0cyB0aGUgdmVyc2lvbiBpIHVzZSBmb3IgbXkgZGogc2V0czsgaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfbmFtZVwiOlwiXCIsXCJyZWxlYXNlXCI6XCJcIixcInRyYWNrX3R5cGVcIjpcInJlbWl4XCIsXCJrZXlfc2lnbmF0dXJlXCI6XCJcIixcImlzcmNcIjpcIlwiLFwidmlkZW9fdXJsXCI6bnVsbCxcImJwbVwiOm51bGwsXCJyZWxlYXNlX3llYXJcIjpudWxsLFwicmVsZWFzZV9tb250aFwiOm51bGwsXCJyZWxlYXNlX2RheVwiOm51bGwsXCJvcmlnaW5hbF9mb3JtYXRcIjpcIm1wM1wiLFwibGljZW5zZVwiOlwiYWxsLXJpZ2h0cy1yZXNlcnZlZFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDZcIixcInVzZXJcIjp7XCJpZFwiOjc4ODIwNSxcImtpbmRcIjpcInVzZXJcIixcInBlcm1hbGlua1wiOlwia2F5dHJhbmFkYVwiLFwidXNlcm5hbWVcIjpcIktBWVRSQU5BREFcIixcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTEvMDcgMDQ6MTE6MzYgKzAwMDBcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdXNlcnMvNzg4MjA1XCIsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYVwiLFwiYXZhdGFyX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2F2YXRhcnMtMDAwMDc0ODAzNjk0LXFpYnh0NC1sYXJnZS5qcGdcIn0sXCJ1c2VyX3BsYXliYWNrX2NvdW50XCI6MSxcInVzZXJfZmF2b3JpdGVcIjp0cnVlLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGEvamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJhcnR3b3JrX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2FydHdvcmtzLTAwMDAzMjA5NDU5Ny01NnRzN24tbGFyZ2UuanBnXCIsXCJ3YXZlZm9ybV91cmxcIjpcImh0dHBzOi8vdzEuc25kY2RuLmNvbS9hcVJHaTREbWJDV3pfbS5wbmdcIixcInN0cmVhbV91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9zdHJlYW1cIixcImRvd25sb2FkX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2Rvd25sb2FkXCIsXCJwbGF5YmFja19jb3VudFwiOjMzMzEwMzMsXCJkb3dubG9hZF9jb3VudFwiOjk2MTEyLFwiZmF2b3JpdGluZ3NfY291bnRcIjo2NjY1MyxcImNvbW1lbnRfY291bnRcIjoxNTk0LFwiYXR0YWNobWVudHNfdXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvYXR0YWNobWVudHNcIixcInBvbGljeVwiOlwiQUxMT1dcIn0sXG4gICAgICAgIHtcImtpbmRcIjpcInRyYWNrXCIsXCJpZFwiOjYzMjU2OTA2LFwiY3JlYXRlZF9hdFwiOlwiMjAxMi8xMC8xMyAxMDo0NzoxNiArMDAwMFwiLFwidXNlcl9pZFwiOjc4ODIwNSxcImR1cmF0aW9uXCI6MjM3ODQwLFwiY29tbWVudGFibGVcIjp0cnVlLFwic3RhdGVcIjpcImZpbmlzaGVkXCIsXCJvcmlnaW5hbF9jb250ZW50X3NpemVcIjo5NTQzMTY4LFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMi8yMiAyMTowMToxNyArMDAwMFwiLFwic2hhcmluZ1wiOlwicHVibGljXCIsXCJ0YWdfbGlzdFwiOlwiXCIsXCJwZXJtYWxpbmtcIjpcImphbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwic3RyZWFtYWJsZVwiOnRydWUsXCJlbWJlZGRhYmxlX2J5XCI6XCJhbGxcIixcImRvd25sb2FkYWJsZVwiOnRydWUsXCJwdXJjaGFzZV91cmxcIjpcImh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX2lkXCI6bnVsbCxcInB1cmNoYXNlX3RpdGxlXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiBETFwiLFwiZ2VucmVcIjpcIlBvcGxvY2tpbiBNdXNpY1wiLFwidGl0bGVcIjpcIkphbmV0IEphY2tzb24gLSBJZiAoS2F5dHJhbmFkYSBSZW1peClcIixcImRlc2NyaXB0aW9uXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiwgZm9yIERKcywgd2VsbCwgdGhhdHMgdGhlIHZlcnNpb24gaSB1c2UgZm9yIG15IGRqIHNldHM7IGh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX25hbWVcIjpcIlwiLFwicmVsZWFzZVwiOlwiXCIsXCJ0cmFja190eXBlXCI6XCJyZW1peFwiLFwia2V5X3NpZ25hdHVyZVwiOlwiXCIsXCJpc3JjXCI6XCJcIixcInZpZGVvX3VybFwiOm51bGwsXCJicG1cIjpudWxsLFwicmVsZWFzZV95ZWFyXCI6bnVsbCxcInJlbGVhc2VfbW9udGhcIjpudWxsLFwicmVsZWFzZV9kYXlcIjpudWxsLFwib3JpZ2luYWxfZm9ybWF0XCI6XCJtcDNcIixcImxpY2Vuc2VcIjpcImFsbC1yaWdodHMtcmVzZXJ2ZWRcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2XCIsXCJ1c2VyXCI6e1wiaWRcIjo3ODgyMDUsXCJraW5kXCI6XCJ1c2VyXCIsXCJwZXJtYWxpbmtcIjpcImtheXRyYW5hZGFcIixcInVzZXJuYW1lXCI6XCJLQVlUUkFOQURBXCIsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzExLzA3IDA0OjExOjM2ICswMDAwXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3VzZXJzLzc4ODIwNVwiLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGFcIixcImF2YXRhcl91cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hdmF0YXJzLTAwMDA3NDgwMzY5NC1xaWJ4dDQtbGFyZ2UuanBnXCJ9LFwidXNlcl9wbGF5YmFja19jb3VudFwiOjEsXCJ1c2VyX2Zhdm9yaXRlXCI6dHJ1ZSxcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhL2phbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwiYXJ0d29ya191cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hcnR3b3Jrcy0wMDAwMzIwOTQ1OTctNTZ0czduLWxhcmdlLmpwZ1wiLFwid2F2ZWZvcm1fdXJsXCI6XCJodHRwczovL3cxLnNuZGNkbi5jb20vYXFSR2k0RG1iQ1d6X20ucG5nXCIsXCJzdHJlYW1fdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvc3RyZWFtXCIsXCJkb3dubG9hZF91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9kb3dubG9hZFwiLFwicGxheWJhY2tfY291bnRcIjozMzMxMDMzLFwiZG93bmxvYWRfY291bnRcIjo5NjExMixcImZhdm9yaXRpbmdzX2NvdW50XCI6NjY2NTMsXCJjb21tZW50X2NvdW50XCI6MTU5NCxcImF0dGFjaG1lbnRzX3VyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2F0dGFjaG1lbnRzXCIsXCJwb2xpY3lcIjpcIkFMTE9XXCJ9XG4gICAgICBdXG4gICAgJycnXG5cbiAgICByZXN1bHRzID0gSlNPTi5wYXJzZShzdHJpbmcpXG5cbiAgICBAaW5wdXQudmFsdWUgPSAnTG9va2luZyBmb3IgXCInK3ZhbHVlKydcIidcbiAgICBAU0Muc2VhcmNoKHZhbHVlLCBwYXRoLCAocmVzdWx0cyk9PlxuICAgICAgY29uc29sZS5sb2cgcmVzdWx0c1xuICAgICAgaWYgcmVzdWx0cy5sZW5ndGggPT0gMFxuICAgICAgICBAaW5wdXQudmFsdWUgPSAnXCInK3ZhbHVlKydcIiBoYXMgbm8gcmVzdWx0J1xuICAgICAgICByZXR1cm5cbiAgICAgIGVsc2VcbiAgICAgICAgQGlucHV0LnZhbHVlID0gJ1Jlc3VsdHMgZm9yIFwiJyt2YWx1ZSsnXCInXG5cbiAgICAgIEByZXN1bHRzICAgICA9IFtdXG4gICAgICBAbGlzdENvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKVxuICAgICAgZm9yIHRyYWNrLCBpIGluIHJlc3VsdHNcbiAgICAgICAgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgICAgIGxpLnNldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcsIGkpXG5cbiAgICAgICAgYXJ0d29ya191cmwgPSB0cmFjay5hcnR3b3JrX3VybFxuICAgICAgICBhcnR3b3JrX3VybCA9ICdpbWFnZXMvbm9fYXJ0d29yay5naWYnIHVubGVzcyBhcnR3b3JrX3VybFxuICAgICAgICBsaS5pbm5lckhUTUwgPSBcIlwiXCJcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGltZyBzcmM9XCIje2FydHdvcmtfdXJsfVwiIGFsdD1cIlwiIG9uZXJyb3I9XCJ0aGlzLnNyYz0naW1hZ2VzL25vX2FydHdvcmsuZ2lmJ1wiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPHA+I3t0cmFjay50aXRsZX08L3A+XG4gICAgICAgICAgICAgIDxwPiN7dHJhY2sudXNlci51c2VybmFtZS50b0xvd2VyQ2FzZSgpfTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBcIlwiXCJcbiAgICAgICAgQHJlc3VsdHMucHVzaCh0cmFjaylcbiAgICAgICAgQGxpc3RDb250YWluZXIuYXBwZW5kQ2hpbGQobGkpXG4gICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIKVxuICAgIClcblxuXG5jbGFzcyBKdWtlYm94XG5cbiAgIyBTdGF0ZXNcbiAgQElTX1dBSVRJTkc6ICAgJ2p1a2Vib3hfaXNfd2FpdGluZydcbiAgQElTX1FVRVVJTkc6ICAgJ2p1a2Vib3hfaXNfcXVldWluZydcblxuICAjIFByb3BlcnRpZXNcbiAgY3VycmVudDogICAgICBudWxsXG4gIHBsYXlsaXN0OiAgICAgbnVsbFxuICAjIHNlYXJjaEVuZ2luZTogbnVsbFxuICBTQzogICAgICAgICAgIG51bGxcblxuICBzdGF0ZTogICAgIG51bGxcblxuICBfbmV4dERlbGF5OiAxNzUwXG4gIF9uZXh0VGltZW91dDogbnVsbFxuICBfcmVmcmVzaERlbGF5OiAxMDAwXG5cbiAgX2xvYWRpbmdRdWV1ZTogbnVsbFxuICBfaXNMb2FkaW5nOiBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBwbGF5bGlzdCAgICAgICA9IFtdXG4gICAgQF9sb2FkaW5nUXVldWUgID0gW11cbiAgICAjIEBzZWFyY2hFbmdpbmUgPSBuZXcgU1BBQ0UuU2VhcmNoRW5naW5lKClcbiAgICBAU0MgICAgICAgICAgICAgPSBTUEFDRS5TQ1xuXG4gICAgQGlucHV0VHlwZSAgICA9ICdXZWJBdWRpb0FQSSdcblxuICAgIEBzZXRTdGF0ZShKdWtlYm94LklTX1dBSVRJTkcpXG4gICAgQF9yZWZyZXNoKClcbiAgICBAX2V2ZW50cygpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFRyYWNrLklTX1NUT1BQRUQsIEBfZVRyYWNrSXNTdG9wcGVkKVxuXG4gIF9lVHJhY2tJc1N0b3BwZWQ6ID0+XG4gICAgQHNldFN0YXRlKEp1a2Vib3guSVNfV0FJVElORylcblxuICBzZXRTdGF0ZTogKHN0YXRlKS0+XG4gICAgQHN0YXRlID0gc3RhdGVcbiAgICBzd2l0Y2ggQHN0YXRlXG4gICAgICB3aGVuIEp1a2Vib3guSVNfV0FJVElOR1xuICAgICAgICBIRUxQRVIudHJpZ2dlcihKdWtlYm94LklTX1dBSVRJTkcsIHsganVrZWJveDogdGhpcyB9KVxuICAgICAgd2hlbiBKdWtlYm94LklTX1FVRVVJTkdcbiAgICAgICAgSEVMUEVSLnRyaWdnZXIoSnVrZWJveC5JU19RVUVVSU5HLCB7IGp1a2Vib3g6IHRoaXMgfSlcbiAgICBcbiAgX3JlZnJlc2g6ID0+XG4gICAgaWYgQHBsYXlsaXN0Lmxlbmd0aCA+IDAgYW5kIEBzdGF0ZSA9PSBKdWtlYm94LklTX1dBSVRJTkdcbiAgICAgIEBuZXh0KClcblxuICAgIHNldFRpbWVvdXQoQF9yZWZyZXNoLCBAX3JlZnJlc2hEZWxheSlcblxuICBhZGQ6ICh1cmxPcklucHV0KS0+XG4gICAgQF9sb2FkaW5nUXVldWUucHVzaCh1cmxPcklucHV0KVxuICAgIEBfbG9hZChAX2xvYWRpbmdRdWV1ZS5zaGlmdCgpKSB1bmxlc3MgQGlzTG9hZGluZyBcblxuICBfbG9hZDogKHVybCktPlxuICAgIEBpc0xvYWRpbmcgPSB0cnVlXG4gICAgVHJhY2suY3JlYXRlIHVybCwgKHRyYWNrcywgdXJsKT0+XG4gICAgICBAcGxheWxpc3QgPSBAcGxheWxpc3QuY29uY2F0KHRyYWNrcylcbiAgICAgIGlmIEBfbG9hZGluZ1F1ZXVlLmxlbmd0aCA+IDBcbiAgICAgICAgQF9sb2FkKEBfbG9hZGluZ1F1ZXVlLnNoaWZ0KCkpXG4gICAgICBlbHNlXG4gICAgICAgIEBpc0xvYWRpbmcgPSBmYWxzZVxuXG4gIHJlbW92ZTogKGluZGV4KS0+XG4gICAgcmV0dXJuIGlmIEBpbnB1dFR5cGUgPT0gJ01pY3JvcGhvbmUnXG4gICAgQHBsYXlsaXN0LnNwbGljZShpbmRleCwgMSlcblxuICBtb3ZlOiAoaW5kZXgxLCBpbmRleDIpLT5cbiAgICByZXR1cm4gaWYgQGlucHV0VHlwZSA9PSAnTWljcm9waG9uZSdcblxuICAgIHRtcCAgICAgICAgICAgICAgID0gQHBsYXlsaXN0W2luZGV4MV1cbiAgICBAcGxheWxpc3RbaW5kZXgxXSA9IEBwbGF5bGlzdFtpbmRleDJdXG4gICAgQHBsYXlsaXN0W2luZGV4Ml0gPSB0bXBcblxuICBzZWFyY2g6ICh2YWx1ZSktPlxuICAgIHJldHVybiBpZiBAaW5wdXRUeXBlID09ICdNaWNyb3Bob25lJ1xuICAgIEBzZWFyY2hFbmdpbmUuc2VhcmNoKHZhbHVlKVxuXG4gIG5leHQ6IC0+XG4gICAgcmV0dXJuIGZhbHNlIGlmIEBpbnB1dFR5cGUgPT0gJ01pY3JvcGhvbmUnXG5cbiAgICBAY3VycmVudC5zdG9wKCkgaWYgQGN1cnJlbnRcblxuICAgIGNhblBsYXkgPSBAcGxheWxpc3QubGVuZ3RoID4gMFxuICAgIGNhblBsYXkgPSBjYW5QbGF5IGFuZCBAc3RhdGUgPT0gSnVrZWJveC5JU19XQUlUSU5HXG4gICAgY2FuUGxheSA9IGNhblBsYXkgYW5kIG5vdCBAX25leHRUaW1lb3V0XG5cbiAgICBpZiBjYW5QbGF5XG4gICAgICBAY3VycmVudCA9IEBwbGF5bGlzdC5zaGlmdCgpXG4gICAgICBAc2V0U3RhdGUoSnVrZWJveC5JU19RVUVVSU5HKSAgICBcblxuICAgICAgQF9uZXh0VGltZW91dCA9IHNldFRpbWVvdXQgPT5cbiAgICAgICAgICBAY3VycmVudC5zdHJlYW0oKVxuICAgICAgICAgIEBfbmV4dFRpbWVvdXQgPSBudWxsXG4gICAgICAsIEBfbmV4dERlbGF5XG4gIFxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuXG5jbGFzcyBUcmFja1xuXG4gICMgQ2xhc3MgdmFyaWFibGVzIGFuZCBtZXRob2RzXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIEBJU19XQUlUSU5HOiAndHJhY2tfaXNfd2FpdGluZydcbiAgQFdJTExfUExBWTogICd0cmFja193aWxsX3BsYXknXG4gIEBJU19QTEFZSU5HOiAndHJhY2tfaXNfcGxheWluZydcbiAgQElTX1BBVVNFRDogICd0cmFja19pc19wYXVzZWQnXG4gIEBJU19TVE9QUEVEOiAndHJhY2tfaXNfc3RvcHBlZCdcblxuICBAU291cmNlOlxuICAgIFNvdW5kQ2xvdWQ6ICdTb3VuZENsb3VkJ1xuICAgIE1QMzogICAgICAgICdNUDMnXG4gICAgSW5wdXQ6ICAgICAgJ0lucHV0J1xuXG4gIEBBUEk6XG4gICAgU291bmRNYW5hZ2VyMjogJ1NvdW5kTWFuYWdlcjInXG4gICAgV2ViQXVkaW9BUEk6ICAgJ1dlYkF1ZGlvQVBJJ1xuICAgIEpTT046ICAgICAgICAgICdKU09OJ1xuXG4gIEBjcmVhdGU6IChzb3VyY2VVcmwsIGNhbGxiYWNrKS0+XG4gICAgdHJhY2tzID0gW11cblxuICAgICMgSWYgSW5wdXRcbiAgICBpZiB0eXBlb2Ygc291cmNlVXJsID09ICdib29sZWFuJyBhbmQgc291cmNlVXJsID09IHRydWVcbiAgICAgIHRyYWNrID0gbmV3IFRyYWNrKClcbiAgICAgIHRyYWNrcy5wdXNoKHRyYWNrKVxuXG4gICAgIyBJZiBNUDNcbiAgICBlbHNlIGlmIC8oXFwubXAzKS9naS50ZXN0KHNvdXJjZVVybClcbiAgICAgIHVybHMgICAgICAgPSBbc291cmNlVXJsXVxuICAgICAgaXNQbGF5bGlzdCA9IGZhbHNlXG5cbiAgICAgIGlmIHR5cGVvZiBzb3VyY2VVcmwgPT0gJ2FycmF5JyBcbiAgICAgICAgdXJscyAgICAgICA9IHNvdXJjZVVybFxuICAgICAgICBpc1BsYXlsaXN0ID0gdHJ1ZVxuXG4gICAgICBmb3IgdXJsIGluIHVybHNcbiAgICAgICAgdHJhY2sgPSBuZXcgVHJhY2soe1xuICAgICAgICAgIHNvdXJjZTogVHJhY2suU291cmNlLk1QM1xuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgICAgaXNfcGxheWxpc3Q6IGlzUGxheWxpc3RcbiAgICAgICAgICBzb3VyY2VfdXJsOiAgc291cmNlVXJsXG4gICAgICAgIH0pXG4gICAgICAgIHRyYWNrcy5wdXNoKHRyYWNrKVxuXG4gICAgIyBFbHNlIFNvdW5kQ2xvdWQgbGlua1xuICAgIGVsc2UgaWYgLyhzb3VuZGNsb3VkKS9naS50ZXN0KHNvdXJjZVVybClcbiAgICAgIFNQQUNFLlNDLmdldFNvdW5kT3JQbGF5bGlzdCBzb3VyY2VVcmwsIChvKT0+XG4gICAgICAgIHNjVHJhY2tzICAgPSBbb11cbiAgICAgICAgaXNQbGF5bGlzdCA9IGZhbHNlXG5cbiAgICAgICAgaWYgby5oYXNPd25Qcm9wZXJ0eSgndHJhY2tzJylcbiAgICAgICAgICBzY1RyYWNrcyAgID0gby50cmFja3NcbiAgICAgICAgICBpc1BsYXlsaXN0ID0gdHJ1ZVxuXG4gICAgICAgIGZvciBkYXRhIGluIHNjVHJhY2tzXG4gICAgICAgICAgdHJhY2sgPSBuZXcgVHJhY2soe1xuICAgICAgICAgICAgYXBpOiAgICAgICAgIFRyYWNrLkFQSS5Tb3VuZE1hbmFnZXIyXG4gICAgICAgICAgICBzb3VyY2U6ICAgICAgVHJhY2suU291cmNlLlNvdW5kQ2xvdWRcbiAgICAgICAgICAgIHNjX29iamVjdDogICBkYXRhXG4gICAgICAgICAgICBpc19wbGF5bGlzdDogaXNQbGF5bGlzdFxuICAgICAgICAgICAgc291cmNlX3VybDogIHNvdXJjZVVybFxuXG4gICAgICAgICAgICB0aXRsZTogICAgICAgZGF0YS50aXRsZVxuICAgICAgICAgICAgYXV0aG9yX25hbWU6IGRhdGEudXNlci51c2VybmFtZVxuICAgICAgICAgICAgYXV0aG9yX3VybDogIGRhdGEudXNlci5wZXJtYWxpbmtfdXJsXG4gICAgICAgICAgICBjb3Zlcl91cmw6ICAgZGF0YS5hcnR3b3JrX3VybFxuICAgICAgICAgICAgdXJsOiAgICAgICAgIGRhdGEuc3RyZWFtX3VybFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICB0cmFjay5tZXJnZURhdGEoeyBwbGF5bGlzdDogbyB9KSBpZiBpc1BsYXlsaXN0XG5cbiAgICAgICAgICB0cmFja3MucHVzaCh0cmFjaylcblxuICAgICAgICBjYWxsYmFjayh0cmFja3MpXG4gICAgICByZXR1cm5cblxuICAgIGNhbGxiYWNrKHRyYWNrcylcblxuICAjIEluc3RhbmNlIHZhcmlhYmxlcyBhbmQgbWV0aG9kc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBkYXRhOiAgICAgbnVsbFxuICBhcGk6ICAgICAgbnVsbFxuICBhdXRvcGxheTogZmFsc2VcbiAgbG9hZGVkOiAgIDBcblxuICBjb25zdHJ1Y3RvcjogKGRhdGEpLT5cbiAgICBAZGF0YSA9XG4gICAgICB0aXRsZTogICAgICAgbnVsbFxuICAgICAgYXV0aG9yX25hbWU6IG51bGxcbiAgICAgIGF1dGhvcl91cmw6ICBudWxsXG4gICAgICBjb3Zlcl91cmw6ICAgbnVsbFxuICAgICAgdXJsOiAgICAgICAgIG51bGxcbiAgICAgIGlzX3BsYXlsaXN0OiBmYWxzZVxuICAgICAgYXBpOiAgICAgICAgIFRyYWNrLkFQSS5XZWJBdWRpb0FQSVxuICAgICAgc291cmNlOiAgICAgIFRyYWNrLlNvdXJjZS5JbnB1dFxuICAgICAgdGltZWRhdGE6ICAgIFtdICBcblxuICAgIEBkYXRhID0gSEVMUEVSLkNvZmZlZS5tZXJnZShAZGF0YSwgZGF0YSlcbiAgICBAX211dGVUaW1lZGF0YSgpXG5cbiAgICBAX3NldFN0YXRlKFRyYWNrLklTX1dBSVRJTkcpXG5cbiAgbWVyZ2VEYXRhOiAoZXh0cmEpLT5cbiAgICBAZGF0YSA9IEhFTFBFUi5Db2ZmZWUubWVyZ2UoQGRhdGEsIGV4dHJhKVxuXG4gIF9zZXRTdGF0ZTogKHN0YXRlKS0+XG4gICAgQHN0YXRlID0gc3RhdGVcbiAgICBzd2l0Y2ggQHN0YXRlXG4gICAgICB3aGVuIFRyYWNrLklTX1dBSVRJTkdcbiAgICAgICAgSEVMUEVSLnRyaWdnZXIoVHJhY2suSVNfV0FJVElORywgeyB0cmFjazogdGhpcyB9KVxuICAgICAgd2hlbiBUcmFjay5XSUxMX1BMQVlcbiAgICAgICAgQF9tdXRlVGltZWRhdGEoKVxuICAgICAgICBIRUxQRVIudHJpZ2dlcihUcmFjay5XSUxMX1BMQVksIHsgdHJhY2s6IHRoaXMgfSlcbiAgICAgIHdoZW4gVHJhY2suSVNfUExBWUlOR1xuICAgICAgICBIRUxQRVIudHJpZ2dlcihUcmFjay5JU19QTEFZSU5HLCB7IHRyYWNrOiB0aGlzIH0pXG4gICAgICB3aGVuIFRyYWNrLklTX1BBVVNFRFxuICAgICAgICBAX211dGVUaW1lZGF0YSgpXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFRyYWNrLklTX1BBVVNFRCwgeyB0cmFjazogdGhpcyB9KVxuICAgICAgd2hlbiBUcmFjay5JU19TVE9QUEVEXG4gICAgICAgIEBfbXV0ZVRpbWVkYXRhKClcbiAgICAgICAgSEVMUEVSLnRyaWdnZXIoVHJhY2suSVNfU1RPUFBFRCwgeyB0cmFjazogdGhpcyB9KVxuXG4gICMgUHVibGljIG1ldGhvZHNcbiAgZ2V0VGltZWRhdGE6IC0+XG4gICAgcmV0dXJuIEBkYXRhLnRpbWVkYXRhXG5cbiAgc3RyZWFtOiAtPlxuICAgIEBfc2V0U3RhdGUoVHJhY2suV0lMTF9QTEFZKVxuXG4gICAgaWYgQGRhdGEuYXBpID09IFRyYWNrLkFQSS5Tb3VuZE1hbmFnZXIyXG4gICAgICBAX3NvdW5kbWFuYWdlcjIoKVxuICAgIGVsc2VcbiAgICAgIEBfd2ViYXVkaW9hcGkoKVxuXG4gIHBsYXk6IC0+XG4gICAgQGFwaS5wbGF5KClcblxuICBwYXVzZTogLT5cbiAgICBAYXBpLnBhdXNlKClcblxuICBzdG9wOiAtPlxuICAgIEBhcGkuc3RvcCgpXG5cbiAgdm9sdW1lOiAodmFsdWUpLT5cbiAgICB2YWx1ZSAqPSAxMDAgaWYgQGRhdGEuYXBpID09IFRyYWNrLkFQSS5Tb3VuZE1hbmFnZXIyXG4gICAgQGFwaS5zZXRWb2x1bWUodmFsdWUpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAYXBpLmRlc3RydWN0KClcblxuICAjIFByaXZhdGUgbWV0aG9kc1xuICBfd2ViYXVkaW9hcGk6ID0+XG4gICAgdW5sZXNzIHdpbmRvdy5maXJzdExhdW5jaFxuICAgICAgZmlyc3RMYXVuY2ggPSBmYWxzZVxuICAgICAgQGF1dG9wbGF5ICAgPSBmYWxzZSBpZiAvbW9iaWxlL2dpLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudClcbiAgICBlbHNlIFxuICAgICAgQGF1dG9wbGF5ID0gdHJ1ZSAgXG5cbiAgICBAYXBpICAgICAgICAgICAgICAgICAgID0gV2ViQXVkaW9BUElcbiAgICBAYXBpLm9ucGxheSAgICAgICAgICAgID0gQF9vbnBsYXlcbiAgICBAYXBpLm9uZW5kZWQgICAgICAgICAgID0gQF9vbmVuZGVkXG4gICAgQGFwaS5vbnBhdXNlICAgICAgICAgICA9IEBfb25wYXVzZVxuICAgIEBhcGkub25zdG9wICAgICAgICAgICAgPSBAX29uc3RvcFxuICAgIEBhcGkub25hdWRpb3Byb2Nlc3MgICAgPSBAX3doaWxlcGxheWluZ1xuICAgIEBhcGkub25sb2FkaW5ncHJvZ3Jlc3MgPSBAX3doaWxlbG9hZGluZ1xuICAgIFxuICAgIGlmIEBkYXRhLnNvdXJjZSA9PSBUcmFjay5Tb3VyY2UuSW5wdXRcbiAgICAgIEBhcGkuaW5wdXRNb2RlID0gdHJ1ZSBcbiAgICAgIEBhcGkuc3RyZWFtSW5wdXQoKVxuICAgIGVsc2VcbiAgICAgIEBhcGkuaW5wdXRNb2RlID0gZmFsc2UgXG4gICAgICBAYXBpLnNldFVybChAZGF0YS51cmwsIEBhdXRvcGxheSwgQF9vbnN0YXJ0KSAgICBcblxuICBfc291bmRtYW5hZ2VyMjogLT5cbiAgICBTUEFDRS5TQy5zdHJlYW1Tb3VuZChAZGF0YS5zY19vYmplY3QsIHtcbiAgICAgIG9ucGxheSAgICAgICA6IEBfb25wbGF5XG4gICAgICBvbmZpbmlzaCAgICAgOiBAX29uZW5kZWRcbiAgICAgIG9uc3RvcCAgICAgICA6IEBfb25zdG9wXG4gICAgICB3aGlsZXBsYXlpbmcgOiBAX3doaWxlcGxheWluZ1xuICAgICAgd2hpbGVsb2FkaW5nIDogPT5cbiAgICAgICAgQF93aGlsZWxvYWRpbmcoQGFwaS5ieXRlc0xvYWRlZCAvIEBhcGkuYnl0ZXNUb3RhbClcbiAgICB9LCBAX29uc3RhcnQpXG5cbiAgX211dGVUaW1lZGF0YTogLT5cbiAgICBAZGF0YS50aW1lZGF0YSA9IEFycmF5KDI1NilcbiAgICBmb3IgaSBpbiBbMC4uMjU1XVxuICAgICAgQGRhdGEudGltZWRhdGFbaV0gPSAwXG5cblxuICAjIEFQSSBFdmVudHNcbiAgX29uc3RhcnQ6IChhcGkpPT5cbiAgICBAYXBpICAgICAgICAgICAgPSBhcGlcbiAgICB3aW5kb3cuQXVkaW9BUEkgPSBhcGlcblxuICBfb25wbGF5OiA9PlxuICAgIEBfc2V0U3RhdGUoVHJhY2suSVNfUExBWUlORylcblxuICBfb25wYXVzZTogPT5cbiAgICBAX3NldFN0YXRlKFRyYWNrLklTX1BBVVNFRClcblxuICBfb25zdG9wOiA9PlxuICAgIEBfc2V0U3RhdGUoVHJhY2suSVNfU1RPUFBFRClcblxuICBfb25lbmRlZDogPT5cbiAgICBAX3NldFN0YXRlKFRyYWNrLklTX1NUT1BQRUQpXG5cbiAgX3doaWxlbG9hZGluZzogKHZhbHVlKT0+XG4gICAgQGxvYWRlZCA9IHZhbHVlXG5cbiAgX3doaWxlcGxheWluZzogPT5cbiAgICB0aW1lZGF0YSA9IEBkYXRhLnRpbWVkYXRhXG5cbiAgICBzd2l0Y2ggQGRhdGEuYXBpXG4gICAgICB3aGVuIFRyYWNrLkFQSS5Tb3VuZE1hbmFnZXIyXG4gICAgICAgIGZvciBpIGluIFswLi4yNTVdXG4gICAgICAgICAgdGltZWRhdGFbaV0gPSBNYXRoLm1heChAYXBpLndhdmVmb3JtRGF0YS5sZWZ0W2ldLCBAYXBpLndhdmVmb3JtRGF0YS5yaWdodFtpXSlcbiAgICAgIFxuICAgICAgd2hlbiBUcmFjay5BUEkuV2ViQXVkaW9BUElcbiAgICAgICAgYW5hbHlzZXIgPSBAYXBpLmFuYWx5c2VyXG4gICAgICAgIHVubGVzcyBhbmFseXNlci5nZXRGbG9hdFRpbWVEb21haW5EYXRhXG4gICAgICAgICAgYXJyYXkgICAgPSAgbmV3IFVpbnQ4QXJyYXkoYW5hbHlzZXIuZmZ0U2l6ZSlcbiAgICAgICAgICBhbmFseXNlci5nZXRCeXRlVGltZURvbWFpbkRhdGEoYXJyYXkpXG4gICAgICAgICAgZm9yIGkgaW4gWzAuLjI1NV1cbiAgICAgICAgICAgIHRpbWVkYXRhW2ldID0gKGFycmF5W2ldIC0gMTI4KSAvIDEyOFxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXJyYXkgICAgPSAgbmV3IEZsb2F0MzJBcnJheShhbmFseXNlci5mZnRTaXplKVxuICAgICAgICAgIGFuYWx5c2VyLmdldEZsb2F0VGltZURvbWFpbkRhdGEoYXJyYXkpXG4gICAgICAgICAgZm9yIGkgaW4gWzAuLjI1NV1cbiAgICAgICAgICAgIHRpbWVkYXRhW2ldID0gYXJyYXlbaV1cblxuICAgIEBkYXRhLnRpbWVkYXRhID0gdGltZWRhdGFcblxuXG5jbGFzcyBXZWJBdWRpb0FQSVxuXG4gICMgU3RhdGVcbiAgQElTX1BMQVlJTkc6ICd3ZWJhdWRpb2FwaV9pc19wbGF5aW5nJ1xuICBASVNfUEFVU0VEOiAgJ3dlYmF1ZGlvYXBpX2lzX3BhdXNlZCdcbiAgQElTX1NUT1BQRUQ6ICd3ZWJhdWRpb2FwaV9pc19zdG9wcGVkJ1xuICBASVNfRU5ERUQ6ICAgJ3dlYmF1ZGlvYXBpX2lzX2VuZGVkJ1xuXG4gICMgUHJvcGVydGllc1xuICBpZGVudGlmaWVyOiAnV2ViQXVkaW9BUEknXG5cbiAgY3R4OiAgICAgICBudWxsXG4gIGFuYWx5c2VyOiAgbnVsbFxuICBwcm9jZXNzb3I6IG51bGxcbiAgYnVmZmVyOiAgICBudWxsXG4gIHNyYzogICAgICAgbnVsbFxuXG4gIHN0YXJ0VGltZTogMFxuICBwb3NpdGlvbjogIDBcbiAgZHVyYXRpb246ICAwXG5cbiAgdGltZTogMFxuXG4gIGlzTG9hZGVkOiBmYWxzZVxuXG4gIHN0YXRlOiBudWxsXG5cbiAgX3ZlbmRvclVSTDogbnVsbFxuICBfaW5wdXRNb2RlOiAgIGZhbHNlXG5cbiAgIyMgU2V0dXAgV2ViIEF1ZGlvIEFQSVxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICAjIFNldHVwIEF1ZGlvQ29udGV4dFxuICAgIHRyeVxuICAgICAgaWYgKHdpbmRvdy5BdWRpb0NvbnRleHRPYmplY3QgPT0gdW5kZWZpbmVkKVxuICAgICAgICB3aW5kb3cuQXVkaW9Db250ZXh0T2JqZWN0ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0fHx3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpXG4gICAgY2F0Y2ggZVxuICAgICAgaWYgKEFwcC5lbnYgPT0gJ2RldmVsb3BtZW50JylcbiAgICAgICAgY29uc29sZS5sb2coXCJIVE1MNSBXZWIgQXVkaW8gQVBJIG5vdCBzdXBwb3J0ZWQuIFN3aXRjaCB0byBTb3VuZE1hbmFnZXIyLlwiKVxuXG4gICAgQGN0eCA9IEF1ZGlvQ29udGV4dE9iamVjdFxuICAgIEBfb2xkQnJvd3NlcigpXG5cbiAgICAjIFNldHVwIFVzZXJNZWRpYVxuICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPVxuICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSAgICBvciBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIG9yIFxuICAgICAgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSBvciBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWFcbiAgICBAX3ZlbmRvclVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTFxuXG4gICAgIyBTZXQgZGVmYXVsdCBzdGF0ZVxuICAgIEBzZXRTdGF0ZShXZWJBdWRpb0FQSS5JU19FTkRFRClcblxuICBzZXRVcmw6ICh1cmwsIGF1dG9wbGF5PWZhbHNlLCBjYWxsYmFjayktPlxuICAgIGlmIEBpbnB1dE1vZGVcbiAgICAgIGFsZXJ0KCdEaXNhYmxlIGlucHV0IG1vZGUnKVxuICAgICAgcmV0dXJuXG5cbiAgICByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSlcbiAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSAgICA9ICdhcnJheWJ1ZmZlcidcbiAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9IGZhbHNlXG4gICAgcmVxdWVzdC5vbmxvYWQgPSA9PlxuICAgICAgQGN0eC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgKGJ1ZmZlcik9PlxuICAgICAgICBAaXNMb2FkZWQgPSB0cnVlXG4gICAgICAgIEBidWZmZXIgPSBidWZmZXJcbiAgICAgICAgY2FsbGJhY2sodGhpcykgaWYgY2FsbGJhY2tcbiAgICAgICAgQHBsYXkoKSBpZiBhdXRvcGxheVxuICAgICAgLCBAX29uRXJyb3IpXG4gICAgcmVxdWVzdC5vbnByb2dyZXNzID0gKGUpPT5cbiAgICAgIGlmIGUubGVuZ3RoQ29tcHV0YWJsZVxuICAgICAgICBAb25sb2FkaW5ncHJvZ3Jlc3MoZS5sb2FkZWQgLyBlLnRvdGFsKSBpZiBAb25sb2FkaW5ncHJvZ3Jlc3MgXG4gICAgcmVxdWVzdC5zZW5kKClcblxuICBzdHJlYW1JbnB1dDogLT5cbiAgICB1bmxlc3MgQGlucHV0TW9kZVxuICAgICAgYWxlcnQoJ0VuYWJsZSBpbnB1dCBtb2RlJylcbiAgICAgIHJldHVyblxuXG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSh7IHZpZGVvOiBmYWxzZSwgYXVkaW86IHRydWUgfSwgKHN0cmVhbSk9PlxuICAgICAgQGlzTG9hZGVkICAgICA9IHRydWVcbiAgICAgIEBfbG9jYWxzdHJlYW0gPSBzdHJlYW1cbiAgICAgIEBwbGF5KClcbiAgICAsIEBfb25FcnJvcilcblxuICBzZXRTdGF0ZTogKHN0YXRlKS0+XG4gICAgQHN0YXRlID0gc3RhdGVcblxuICBfb25FcnJvcjogKGUpLT5cbiAgICBjb25zb2xlLmxvZyAnRVJST1InLCBlXG5cbiAgcGF1c2U6IC0+XG4gICAgaWYgQGlucHV0TW9kZVxuICAgICAgQHN0b3AoKVxuICAgIGVsc2UgaWYgQHNyY1xuICAgICAgQHNyYy5zdG9wKDApXG4gICAgICBAc3JjICAgICAgID0gbnVsbFxuICAgICAgQHByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IG51bGxcbiAgICAgIEBwb3NpdGlvbiAgPSBAY3R4LmN1cnJlbnRUaW1lIC0gQHN0YXJ0VGltZVxuICAgICAgQHNldFN0YXRlKFdlYkF1ZGlvQVBJLklTX1BBVVNFRClcbiAgICAgIEBvbnBhdXNlKCkgaWYgQG9ucGF1c2VcblxuICBwbGF5OiAocG9zaXRpb24pLT5cbiAgICByZXR1cm4gdW5sZXNzIEBpc0xvYWRlZFxuICAgIGlmIEBzdGF0ZSA9PSBXZWJBdWRpb0FQSS5JU19QTEFZSU5HXG4gICAgICBAcGF1c2UoKVxuICAgICAgcmV0dXJuXG5cbiAgICBAX2Nvbm5lY3QoKVxuXG4gICAgdW5sZXNzIEBpbnB1dE1vZGVcbiAgICAgIEBwb3NpdGlvbiAgPSBpZiB0eXBlb2YgcG9zaXRpb24gPT0gJ251bWJlcicgdGhlbiBwb3NpdGlvbiBlbHNlIEBwb3NpdGlvbiBvciAwXG4gICAgICBAc3RhcnRUaW1lID0gQGN0eC5jdXJyZW50VGltZSAtIChAcG9zaXRpb24gb3IgMClcbiAgICAgIEBzcmMuc3RhcnQoQGN0eC5jdXJyZW50VGltZSwgQHBvc2l0aW9uKVxuXG4gICAgQHNldFN0YXRlKFdlYkF1ZGlvQVBJLklTX1BMQVlJTkcpXG4gICAgQG9ucGxheSgpIGlmIEBvbnBsYXlcblxuICBzdG9wOiAtPlxuICAgIGlmIEBzcmNcbiAgICAgIGlmIEBpbnB1dE1vZGVcbiAgICAgICAgQHNyYy5tZWRpYVN0cmVhbS5zdG9wKClcbiAgICAgICAgQGlzTG9hZGVkICAgID0gZmFsc2VcbiAgICAgICAgQGxvY2Fsc3RyZWFtID0gbnVsbFxuICAgICAgZWxzZVxuICAgICAgICBAc3JjLnN0b3AoMClcbiAgICAgIEBzcmMgICAgICAgPSBudWxsXG4gICAgICBAcHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gbnVsbFxuICAgICAgQHBvc2l0aW9uICA9IDBcbiAgICAgIEBzdGFydFRpbWUgPSAwXG4gICAgICBAc2V0U3RhdGUoV2ViQXVkaW9BUEkuSVNfU1RPUFBFRClcbiAgICAgIEBvbnN0b3AoKSBpZiBAb25zdG9wXG5cbiAgc2V0Vm9sdW1lOiAodm9sdW1lKS0+XG4gICAgdm9sdW1lID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgdm9sdW1lKSlcbiAgICBAZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IHZvbHVtZVxuXG4gIHVwZGF0ZVBvc2l0aW9uOiAtPlxuICAgIGlmIEBzdGF0ZSA9PSBXZWJBdWRpb0FQSS5JU19QTEFZSU5HXG4gICAgICBAcG9zaXRpb24gPSBAY3R4LmN1cnJlbnRUaW1lIC0gQHN0YXJ0VGltZVxuXG4gICAgaWYgQHBvc2l0aW9uID4gQGJ1ZmZlci5kdXJhdGlvblxuICAgICAgQHBvc2l0aW9uID0gQGJ1ZmZlci5kdXJhdGlvblxuICAgICAgQHBhdXNlKClcblxuICAgIHJldHVybiBAcG9zaXRpb25cblxuICBzZWVrOiAodGltZSktPlxuICAgIGlmIEBzdGF0ZSA9PSBXZWJBdWRpb0FQSS5JU19QTEFZSU5HXG4gICAgICBAcGxheSh0aW1lKVxuICAgIGVsc2VcbiAgICAgIEBwb3NpdGlvbiA9IHRpbWVcblxuICBkZXN0cnVjdDogLT5cbiAgICBAc3RvcCgpXG4gICAgQF9kaXNjb25uZWN0KClcbiAgICBAY3R4ID0gbnVsbFxuXG4gIF9jb25uZWN0OiAtPlxuICAgIGlmIEBpbnB1dE1vZGUgYW5kIEBfbG9jYWxzdHJlYW1cbiAgICAgICMgU2V0dXAgYXVkaW8gc291cmNlXG4gICAgICBAc3JjID0gQGN0eC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShAX2xvY2Fsc3RyZWFtKVxuICAgIGVsc2VcbiAgICAgICMgU2V0dXAgYnVmZmVyIHNvdXJjZVxuICAgICAgQHNyYyAgICAgICAgICAgICAgICAgPSBAY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpXG4gICAgICBAc3JjLmJ1ZmZlciAgICAgICAgICA9IEBidWZmZXJcbiAgICAgIEBzcmMub25lbmRlZCAgICAgICAgID0gQF9vbkVuZGVkXG4gICAgICBAZHVyYXRpb24gICAgICAgICAgICA9IEBidWZmZXIuZHVyYXRpb25cblxuICAgICMgU2V0dXAgYW5hbHlzZXJcbiAgICBAYW5hbHlzZXIgPSBAY3R4LmNyZWF0ZUFuYWx5c2VyKClcbiAgICBAYW5hbHlzZXIuc21vb3RoaW5nVGltZUNvbnN0YW50ID0gMC44XG4gICAgQGFuYWx5c2VyLm1pbkRlY2liZWxzICAgICAgICAgICA9IC0xNDBcbiAgICBAYW5hbHlzZXIubWF4RGVjaWJlbHMgICAgICAgICAgID0gMFxuICAgIEBhbmFseXNlci5mZnRTaXplICAgICAgICAgICAgICAgPSA1MTJcblxuICAgICMgU2V0dXAgU2NyaXB0UHJvY2Vzc29yXG4gICAgQHByb2Nlc3NvciA9IEBjdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yKDIwNDgsIDEsIDEpXG5cbiAgICAjIFNldHAgR2Fpbk5vZGVcbiAgICBAZ2Fpbk5vZGUgPSBAY3R4LmNyZWF0ZUdhaW4oKVxuXG4gICAgQHNyYy5jb25uZWN0KEBhbmFseXNlcilcbiAgICBAc3JjLmNvbm5lY3QoQGdhaW5Ob2RlKVxuICAgIEBhbmFseXNlci5jb25uZWN0KEBwcm9jZXNzb3IpXG4gICAgQHByb2Nlc3Nvci5jb25uZWN0KEBjdHguZGVzdGluYXRpb24pXG4gICAgQGdhaW5Ob2RlLmNvbm5lY3QoQGN0eC5kZXN0aW5hdGlvbilcblxuICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBAX29uQXVkaW9Qcm9jZXNzXG4gICAgQHByb2Nlc3Nvci5hcGkgPSBAXG5cbiAgICBAX29sZEJyb3dzZXIoKVxuXG4gIF9kaXNjb25uZWN0OiAtPlxuICAgIEBhbmFseXNlci5kaXNjb25uZWN0KDApICBpZiBAYW5hbHlzZXJcbiAgICBAcHJvY2Vzc29yLmRpc2Nvbm5lY3QoMCkgaWYgQHByb2Nlc3NvclxuICAgIEBnYWluTm9kZS5kaXNjb25uZWN0KDApICBpZiBAZ2Fpbk5vZGVcblxuICBfb25BdWRpb1Byb2Nlc3M6ID0+XG4gICAgQG9uYXVkaW9wcm9jZXNzKCkgaWYgQG9uYXVkaW9wcm9jZXNzXG5cbiAgX29uRW5kZWQ6IChlKT0+XG4gICAgaWYgQHNyYyBhbmQgKEBzdGF0ZSA9PSBXZWJBdWRpb0FQSS5JU19TVE9QUEVEIHx8IEBzdGF0ZSA9PSBXZWJBdWRpb0FQSS5JU19QTEFZSU5HKVxuICAgICAgQHNyYy5kaXNjb25uZWN0KDApXG4gICAgICBAc3JjICAgICAgICAgICAgICAgICAgICAgID0gbnVsbFxuICAgICAgQHByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IG51bGxcbiAgICAgIEBzdGF0ZSA9IFdlYkF1ZGlvQVBJLklTX0VOREVEXG4gICAgICBAb25lbmRlZCgpIGlmIEBvbmVuZGVkXG5cbiAgX29sZEJyb3dzZXI6IC0+XG4gICAgaWYgQGN0eCBhbmQgdHlwZW9mIEBjdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yICE9ICdmdW5jdGlvbidcbiAgICAgIEBjdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yID0gQGN0eC5jcmVhdGVKYXZhU2NyaXB0Tm9kZVxuXG4gICAgaWYgQHNyYyBhbmQgdHlwZW9mIEBzcmMuc3RhcnQgIT0gJ2Z1bmN0aW9uJ1xuICAgICAgQHNyYy5zdGFydCA9IEBzcmMubm90ZU9uXG5cbiAgICBpZiBAc3JjIGFuZCB0eXBlb2YgQHNyYy5zdG9wICE9ICdmdW5jdGlvbidcbiAgICAgIEBzcmMuc3RvcCA9IEBzcmMubm90ZU9mZlxuXG5XZWJBdWRpb0FQSSA9IG5ldyBXZWJBdWRpb0FQSSgpXG5cblxuY2xhc3MgU1BBQ0UuRXF1YWxpemVyIGV4dGVuZHMgVEhSRUUuR3JvdXBcblxuICBjZW50ZXI6ICAgICBudWxsXG5cbiAgX3ZhbHVlczogICAgbnVsbFxuICBfbmV3VmFsdWVzOiBudWxsXG5cbiAgX3RpbWU6ICAgICAgMVxuXG4gIF9qdWtlYm94OiBudWxsXG5cbiAgIyBUSFJFRVxuICBtYXRlcmlhbDogICBudWxsXG4gIGxpbmVzOiAgICAgIG51bGxcblxuICAjIFBhcmFtZXRlcnNcbiAgbWF4TGVuZ3RoOiAgICAgICAgIDBcbiAgbWluTGVuZ3RoOiAgICAgICAgIDBcbiAgcmFkaXVzOiAgICAgICAgICAgIDBcbiAgaW50ZXJwb2xhdGlvblRpbWU6IDBcbiAgY29sb3I6ICAgICAgICAgICAgIDB4RkZGRkZGXG4gIGxpbmVGb3JjZVVwOiAgICAgICAuNVxuICBsaW5lRm9yY2VEb3duOiAgICAgLjVcbiAgbGluZXdpZHRoOiAgICAgICAgIDBcbiAgYWJzb2x1dGU6ICAgICAgICAgIGZhbHNlXG4gIG5iVmFsdWVzOiAgICAgICAgICAwXG4gIG1heE5iVmFsdWVzOiAgICAgICA1MTJcbiAgbWlycm9yOiAgICAgICAgICAgIHRydWVcblxuICBjb25zdHJ1Y3RvcjogKG9wdHM9e30pLT5cbiAgICBzdXBlclxuXG4gICAgIyBTZXQgcGFyYW1ldGVyc1xuICAgIGRlZmF1bHRzID1cbiAgICAgIG1heExlbmd0aDogICAgICAgICAyMDBcbiAgICAgIG1pbkxlbmd0aDogICAgICAgICA1MFxuICAgICAgcmFkaXVzOiAgICAgICAgICAgIDI1MFxuICAgICAgaW50ZXJwb2xhdGlvblRpbWU6IDE1MFxuICAgICAgY29sb3I6ICAgICAgICAgICAgIDB4RkZGRkZGXG4gICAgICBsaW5lRm9yY2VVcDogICAgICAgLjVcbiAgICAgIGxpbmVGb3JjZURvd246ICAgICAuNVxuICAgICAgYWJzb2x1dGU6ICAgICAgICAgIGZhbHNlXG4gICAgICBuYlZhbHVlczogICAgICAgICAgNTEyICMgTWF4aW11bSA1MTIgdmFsdWVzXG4gICAgICBtaXJyb3I6ICAgICAgICAgICAgdHJ1ZVxuICAgICAgbGluZXdpZHRoOiAgICAgICAgIDJcblxuICAgIG9wdHMgICAgICAgICAgICAgICA9IEhFTFBFUi5Db2ZmZWUubWVyZ2UoZGVmYXVsdHMsIG9wdHMpXG4gICAgQG1pbkxlbmd0aCAgICAgICAgID0gb3B0cy5taW5MZW5ndGhcbiAgICBAbWF4TGVuZ3RoICAgICAgICAgPSBvcHRzLm1heExlbmd0aFxuICAgIEByYWRpdXMgICAgICAgICAgICA9IG9wdHMucmFkaXVzXG4gICAgQGludGVycG9sYXRpb25UaW1lID0gb3B0cy5pbnRlcnBvbGF0aW9uVGltZVxuICAgIEBjb2xvciAgICAgICAgICAgICA9IG9wdHMuY29sb3JcbiAgICBAbGluZUZvcmNlVXAgICAgICAgPSBvcHRzLmxpbmVGb3JjZVVwXG4gICAgQGxpbmVGb3JjZURvd24gICAgID0gb3B0cy5saW5lRm9yY2VEb3duXG4gICAgQGFic29sdXRlICAgICAgICAgID0gb3B0cy5hYnNvbHV0ZVxuICAgIEBuYlZhbHVlcyAgICAgICAgICA9IG9wdHMubmJWYWx1ZXNcbiAgICBAbWlycm9yICAgICAgICAgICAgPSBvcHRzLm1pcnJvclxuICAgIEBsaW5ld2lkdGggICAgICAgICA9IG9wdHMubGluZXdpZHRoXG5cbiAgICAjIFNldCB2YWx1ZXNcbiAgICBAX2p1a2Vib3ggICA9IFNQQUNFLlNjZW5lTWFuYWdlci5jdXJyZW50U2NlbmUuX2p1a2Vib3hcbiAgICBAY2VudGVyICAgICA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICBAX3ZhbHVlcyAgICA9IEBtdXRlKGZhbHNlKVxuICAgIEBfbmV3VmFsdWVzID0gQG11dGUoZmFsc2UpXG4gICAgQHNldFJhZGl1cyhAcmFkaXVzKVxuICAgIFxuICAgIEBnZW5lcmF0ZSgpXG5cbiAgICBAX2V2ZW50cygpXG4gICAgQHVwZGF0ZVZhbHVlcygpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFRSQUNLLklTX1NUT1BQRUQudHlwZSwgQF9lVHJhY2tJc1N0b3BwZWQpXG5cbiAgX2VUcmFja0lzU3RvcHBlZDogPT5cbiAgICBAbXV0ZSgpXG5cbiAgc2V0UmFkaXVzOiAocmFkaXVzKS0+IFxuICAgIEByYWRpdXMgPSByYWRpdXMgXG4gICAgQHJhZGl1cyA9IHdpbmRvdy5pbm5lcldpZHRoICogMC42IGlmIHdpbmRvdy5pbm5lcldpZHRoIC0gMTAwIDwgcmFkaXVzIFxuXG4gIHNldE5iVmFsdWVzOiAobmJWYWx1ZXMpLT5cbiAgICBAbmJWYWx1ZXMgPSBuYlZhbHVlc1xuICAgIEBtdXRlKClcblxuICBzZXRWYWx1ZXM6ICh2YWx1ZXMpLT5cbiAgICBpZiBAbWlycm9yXG4gICAgICBkYXRhcyAgPSBBcnJheShAbmJWYWx1ZXMpXG4gICAgICBmb3IgaSBpbiBbMC4uKChAbmJWYWx1ZXMqLjUpLTEpXVxuICAgICAgICBkYXRhc1tpXSA9IGRhdGFzW0BuYlZhbHVlcy0xLWldID0gdmFsdWVzW2ldXG4gICAgICB2YWx1ZXMgPSBkYXRhc1xuXG4gICAgbmV3VmFsdWVzID0gQG11dGUoZmFsc2UpXG4gICAgZm9yIHZhbHVlLCBpIGluIHZhbHVlc1xuICAgICAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSkgaWYgQGFic29sdXRlXG4gICAgICBsZW5ndGggPSBAbWluTGVuZ3RoICsgcGFyc2VGbG9hdCh2YWx1ZSkqKEBtYXhMZW5ndGggLSBAbWluTGVuZ3RoKVxuICAgICAgbmV3VmFsdWVzW2ldID0gTWF0aC5tYXgobGVuZ3RoLCAwKVxuICAgIEBfbmV3VmFsdWVzID0gbmV3VmFsdWVzXG4gICAgQHJlc2V0SW50ZXJwb2xhdGlvbigpXG5cbiAgZ2VuZXJhdGU6IC0+XG4gICAgQG11dGUoKVxuXG4gICAgQG1hdGVyaWFsICAgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQGNvbG9yLCBsaW5ld2lkdGg6IEBsaW5ld2lkdGggfSlcbiAgICBAbGluZXMgICAgICA9IFtdXG5cbiAgICBAcmVmcmVzaCgwKVxuICAgIEB1cGRhdGVHZW9tZXRyaWVzKHRydWUpXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cbiAgICBAcmVmcmVzaChkZWx0YSlcblxuICByZWZyZXNoOiAoZGVsdGEpLT5cbiAgICBAX3RpbWUgKz0gZGVsdGFcbiAgICB0ID0gQF90aW1lIC8gQGludGVycG9sYXRpb25UaW1lXG4gICAgcmV0dXJuIGlmIHQgPiAxXG5cbiAgICBmb3IgaSBpbiBbMC4uKEBtYXhOYlZhbHVlcy0xKV1cbiAgICAgIGRpZmYgICAgICAgID0gQF92YWx1ZXNbaV0gLSBAX25ld1ZhbHVlc1tpXVxuICAgICAgQF92YWx1ZXNbaV0gPSBAX3ZhbHVlc1tpXSAtIHQgKiBkaWZmXG4gICAgQHVwZGF0ZUdlb21ldHJpZXMoKVxuXG4gIHVwZGF0ZVZhbHVlczogPT5cbiAgICBpZiBAX2p1a2Vib3guY3VycmVudCBhbmQgQF9qdWtlYm94LmN1cnJlbnQuc3RhdGUgPT0gVHJhY2suSVNfUExBWUlOR1xuICAgICAgQHNldFZhbHVlcyhAX2p1a2Vib3guY3VycmVudC5nZXRUaW1lZGF0YSgpKVxuICAgIHNldFRpbWVvdXQoQHVwZGF0ZVZhbHVlcywgQGludGVycG9sYXRpb25UaW1lICogMC4xNSlcblxuICB1cGRhdGVHZW9tZXRyaWVzOiAoY3JlYXRlPWZhbHNlKS0+XG4gICAgZm9yIGxlbmd0aCwgaSBpbiBAX3ZhbHVlc1xuICAgICAgYW5nbGUgID0gTWF0aC5QSSAqIDIgKiBpIC8gQG5iVmFsdWVzXG5cbiAgICAgIGZyb20gPSBAY29tcHV0ZVBvc2l0aW9uKEBjZW50ZXIsIGFuZ2xlLCBAcmFkaXVzLWxlbmd0aCpAbGluZUZvcmNlRG93bilcbiAgICAgIHRvICAgPSBAY29tcHV0ZVBvc2l0aW9uKEBjZW50ZXIsIGFuZ2xlLCBAcmFkaXVzK2xlbmd0aCpAbGluZUZvcmNlVXApXG5cbiAgICAgIGlmIHR5cGVvZiBAbGluZXNbaV0gPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKVxuICAgICAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKGZyb20sIHRvLCBmcm9tKVxuXG4gICAgICAgIGxpbmUgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgQG1hdGVyaWFsKVxuICAgICAgICBAbGluZXMucHVzaChsaW5lKVxuICAgICAgICBAYWRkKGxpbmUpXG4gICAgICBlbHNlXG4gICAgICAgIGxpbmUgPSBAbGluZXNbaV1cbiAgICAgICAgbGluZS5nZW9tZXRyeS52ZXJ0aWNlc1swXSA9IGZyb21cbiAgICAgICAgbGluZS5nZW9tZXRyeS52ZXJ0aWNlc1sxXSA9IHRvXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNbMl0gPSBmcm9tXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZVxuXG4gIHJhbmRvbTogKHNldFZhbHVlcz10cnVlKT0+XG4gICAgdmFsdWVzID0gW11cbiAgICBmb3IgaSBpbiBbMC4uKEBtYXhOYlZhbHVlcy0xKV1cbiAgICAgIHZhbHVlc1tpXSA9IE1hdGgucmFuZG9tKClcbiAgICBAc2V0VmFsdWVzKHZhbHVlcykgaWYgc2V0VmFsdWVzXG4gICAgcmV0dXJuIHZhbHVlc1xuXG4gIG11dGU6IChzZXRWYWx1ZXM9dHJ1ZSktPlxuICAgIHZhbHVlcyA9IFtdXG4gICAgZm9yIGkgaW4gWzAuLihAbWF4TmJWYWx1ZXMtMSldXG4gICAgICB2YWx1ZXNbaV0gPSAwXG4gICAgQHNldFZhbHVlcyh2YWx1ZXMpIGlmIHNldFZhbHVlc1xuICAgIHJldHVybiB2YWx1ZXNcblxuICByZXNldEludGVycG9sYXRpb246IC0+XG4gICAgQF90aW1lID0gMFxuXG4gIGNvbXB1dGVQb3NpdGlvbjogKHBvaW50LCBhbmdsZSwgbGVuZ3RoKS0+XG4gICAgeCA9IHBvaW50LnggKyBNYXRoLnNpbihhbmdsZSkgKiBsZW5ndGhcbiAgICB5ID0gcG9pbnQueSArIE1hdGguY29zKGFuZ2xlKSAqIGxlbmd0aFxuICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMyh4LCB5LCBwb2ludC56KVxuXG4gIHJlbW92ZUxpbmVGcm9tUGFyZW50OiAoaW5kZXgpLT5cbiAgICBwYXJlbnQgPSBAbGluZXNbaW5kZXhdXG4gICAgcGFyZW50LnJlbW92ZShAbGluZXNbaW5kZXhdKVxuXG4gIHJlc2l6ZTogLT4gXG4gICAgQHNldFJhZGl1cyhAcmFkaXVzKSBcbiAgICAgIFxuXG5cbmNsYXNzIFNQQUNFLkNvdmVyIGV4dGVuZHMgVEhSRUUuR3JvdXBcblxuICBfaW1hZ2VzTG9hZGVkOiBudWxsXG5cbiAgbG9hZGluZ01hbmFnZXI6IG51bGxcblxuICBwbGFuZTogbnVsbFxuXG4gIGltYWdlRGF0YTA6IG51bGxcbiAgaW1hZ2VEYXRhMTogbnVsbFxuXG4gIHRNb3ZlOiAxXG4gIHRTY2FsZTogMVxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFNQQUNFLkNvdmVyQ29udHJvbGxlci5ORVhULCBAX2VOZXh0KVxuXG4gIF9lTmV4dDogPT5cbiAgICBAX3RyYW5zaXRpb24oKVxuXG4gICMgX2V2ZW50czogLT5cbiAgIyAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoVHJhY2suSVNfV0FJVElORywgQF9lVHJhY2tJc1dhaXRpbmcpXG4gICMgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFRyYWNrLldJTExfUExBWSwgQF9lVHJhY2tXaWxsUGxheSlcbiAgIyAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoSnVrZWJveC5JU19RVUVVSU5HLCBAX2VKdWtlYm94SXNRdWV1aW5nKVxuXG4gICMgICAkKCcjbG9hZGluZywgI2luZm9ybWF0aW9uIHNwYW4nKS5vbiAnY2xpY2snLCAoZSktPlxuICAjICAgICBpZiAkKCcjbG9hZGluZycpLmhhc0NsYXNzKCdyZWFkeScpIGFuZCB3aW5kb3cuV2ViQXVkaW9BUElcbiAgIyAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgIyAgICAgICB3aW5kb3cuV2ViQXVkaW9BUEkucGxheSgpXG4gICMgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgIyBfZVRyYWNrSXNXYWl0aW5nOiAoZSk9PlxuICAjICAgdHJhY2sgPSBlLm9iamVjdC50cmFja1xuXG4gICMgICBmb3IgdCwgaSBpbiBAcGxheWxpc3RcbiAgIyAgICAgaWYgdC51cmwgPT0gdHJhY2suZGF0YS51cmxcbiAgIyAgICAgICBuZXh0VHJhY2sgPSBudWxsXG4gICMgICAgICAgaWYgaSsxIDwgQHBsYXlsaXN0Lmxlbmd0aFxuICAjICAgICAgICAgbmV4dFRyYWNrID0gQHBsYXlsaXN0W2krMV1cbiAgICAgICAgXG4gICMgICAgICAgdHJhY2subWVyZ2VEYXRhKHtcbiAgIyAgICAgICAgIHRpdGxlOiAgICAgICB0LnRpdGxlXG4gICMgICAgICAgICBjb3Zlcl91cmw6ICAgdC5jb3Zlcl91cmxcbiAgIyAgICAgICAgIGF1dGhvcl9uYW1lOiB0LmF1dGhvcl9uYW1lXG4gICMgICAgICAgICBhdXRob3JfdXJsOiAgdC5hdXRob3JfdXJsXG4gICMgICAgICAgICBjb2xvcjE6ICAgICAgdC5jb2xvcjFcbiAgIyAgICAgICAgIGNvbG9yMjogICAgICB0LmNvbG9yMlxuICAjICAgICAgICAgbmV4dFRyYWNrOiAgIG5leHRUcmFja1xuICAjICAgICAgIH0pXG4gICAgICBcbiAgIyAgICAgICBicmVhaztcblxuICAjIGN1cnJlbnQ6IG51bGxcblxuICAjIF9lSnVrZWJveElzUXVldWluZzogKGUpPT5cbiAgIyAgIGMgPSBlLm9iamVjdC5qdWtlYm94LmN1cnJlbnRcblxuICAjICAgaXNTYW1lID0gZmFsc2VcbiAgIyAgIGlmIGMgYW5kIGMuZGF0YS5wbGF5bGlzdCBhbmQgQGN1cnJlbnQgYW5kIEBjdXJyZW50LmRhdGEucGxheWxpc3RcbiAgIyAgICAgaXNTYW1lID0gYy5kYXRhLnBsYXlsaXN0LnBlcm1hbGluayA9PSBAY3VycmVudC5kYXRhLnBsYXlsaXN0LnBlcm1hbGlua1xuICAjICAgQGN1cnJlbnQgPSBlLm9iamVjdC5qdWtlYm94LmN1cnJlbnRcblxuICAjICAgcmV0dXJuIGlmIGlzU2FtZVxuICAjICAgQF90cmFuc2l0aW9uKClcbiAgIyAgICQoJyNpbmZvcm1hdGlvbiBoMScpLmFkZENsYXNzKCdoaWRkZW4nKVxuICAjICAgJCgnI2luZm9ybWF0aW9uIGgyJykuYWRkQ2xhc3MoJ2hpZGRlbicpXG5cbiAgIyAjIF9lVHJhbnNpdGlvbkVuZGVkOiAoZSk9PlxuICAjICMgICBIRUxQRVIudHJpZ2dlcihFVkVOVC5Db3Zlci5UUkFOU0lUSU9OX0VOREVEKVxuXG4gICMgIyBfZVRyYWNrSXNQbGF5aW5nOiAoZSk9PlxuICAjICMgICAkKCcjaW5mb3JtYXRpb24gaDEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJylcbiAgIyAjICAgJCgnI2luZm9ybWF0aW9uIGgyJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG4gICMgIyAgICQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpXG5cbiAgIyAjIF9lVHJhY2tJc1BhdXNlZDogKGUpPT5cbiAgIyAjICAgJCgnI2xvYWRpbmcnKS5yZW1vdmVDbGFzcygnaGlkZGVuJylcbiAgIyAjICAgJCgnI2xvYWRpbmcgaS5pY24nKS5yZW1vdmVDbGFzcygncGxheScpXG4gICMgIyAgICQoJyNsb2FkaW5nIGkuaWNuJykuYWRkQ2xhc3MoJ3BhdXNlJylcblxuICAjIF9lVHJhY2tXaWxsUGxheTogKGUpPT5cbiAgIyAgIHVubGVzcyAkKCcjbG9hZGluZycpLmhhc0NsYXNzKCdyZWFkeScpXG4gICMgICAgICQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ3JlYWR5JylcbiAgIyAgICAgJCgnI2xvYWRpbmcgcCcpLmh0bWwoJ1RhcCBpbiB0aGUgbWlkZGxlPGJyPnRvIHBsYXkgb3IgcGF1c2UnKVxuXG4gICMgICBjdXJyZW50ID0gZS5vYmplY3QudHJhY2suZGF0YVxuICAjICAgbmV4dCAgICA9IGN1cnJlbnQubmV4dFRyYWNrXG5cbiAgIyAgIHRpdGxlICAgID0gY3VycmVudC50aXRsZVxuICAjICAgdXNlcm5hbWUgPSBjdXJyZW50LmF1dGhvcl9uYW1lXG4gICMgICB1c2VyX3VybCA9IGN1cnJlbnQuYXV0aG9yX3VybFxuICAjICAgY29sb3IxICAgPSBjdXJyZW50LmNvbG9yMVxuICAjICAgY29sb3IyICAgPSBjdXJyZW50LmNvbG9yMlxuXG4gICMgICAkKCcjaW5mb3JtYXRpb24gaDEnKS5odG1sKHRpdGxlKVxuICAjICAgJCgnI2luZm9ybWF0aW9uIGgyJykuaHRtbCgnYnkgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicrdXNlcl91cmwrJ1wiPicrdXNlcm5hbWUrJzwvYT4nKVxuXG4gICMgICBjc3MgPSBcIlwiXCJcbiAgIyAgICAgICBhIHsgY29sb3I6IFwiXCJcIitjb2xvcjErXCJcIlwiICFpbXBvcnRhbnQ7IH1cbiAgIyAgICAgICBib2R5IHsgY29sb3I6IFwiXCJcIitjb2xvcjIrXCJcIlwiICFpbXBvcnRhbnQ7IH1cbiAgIyAgIFwiXCJcIlxuICAjICAgJCgnLmNvdmVyLXN0eWxlJykuaHRtbChjc3MpXG5cbiAgIyAgIHJldHVybiB1bmxlc3MgbmV4dFxuXG4gICMgICBpbWFnZSAgICAgICAgPSBAaW1hZ2VMb2FkZXIuY2FjaGUuZmlsZXNbY3VycmVudC5jb3Zlcl91cmxdXG4gICMgICBpbWFnZS5vbmxvYWQgPSA9PiBcbiAgIyAgICAgQHRleHR1cmUwLmltYWdlID0gaW1hZ2VcbiAgIyAgICAgQHRleHR1cmUwLnJlcGVhdCA9IDEwXG4gICMgICAgIEBfdGV4dHVyZUxvYWRlZCgpXG5cbiAgIyAgIGltYWdlICAgICAgICA9IEBpbWFnZUxvYWRlci5jYWNoZS5maWxlc1tuZXh0LmNvdmVyX3VybF1cbiAgIyAgIGltYWdlLm9ubG9hZCA9ID0+IFxuICAjICAgICBAdGV4dHVyZTEuaW1hZ2UgPSBpbWFnZVxuICAjICAgICBAdGV4dHVyZTEucmVwZWF0ID0gMTBcbiAgIyAgICAgQF90ZXh0dXJlTG9hZGVkKClcblxuICBzZXR1cDogLT5cbiAgICAjIFNldHVwIGxvYWRlcnNcbiAgICBAbG9hZGluZ01hbmFnZXIgICAgICAgID0gbmV3IFRIUkVFLkxvYWRpbmdNYW5hZ2VyKClcbiAgICBAbG9hZGluZ01hbmFnZXIub25Mb2FkID0gQF9zZXR1cFBsYW5lXG4gICAgQHRleHR1cmVMb2FkZXIgICAgICAgICA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKClcbiAgICBAbG9hZGVyICAgICAgICAgICAgICAgID0gbmV3IFRIUkVFLlhIUkxvYWRlcihAbG9hZGluZ01hbmFnZXIpXG4gICAgXG4gICAgIyBJbml0aWFsaXplIGV2ZW50cyBhbmQgbG9hZCBzaGFkZXJzXG4gICAgQF9ldmVudHMoKVxuICAgIEBfbG9hZFNoYWRlcnMoKVxuXG4gIF9sb2FkU2hhZGVyczogPT5cbiAgICBAbG9hZGVyLmxvYWQoJ2Fzc2V0cy9zaGFkZXJzL2NvdmVyLmZyYWcnKVxuICAgIEBsb2FkZXIubG9hZCgnYXNzZXRzL3NoYWRlcnMvY292ZXIudmVydCcpXG5cbiAgX3NldHVwUGxhbmU6ID0+XG4gICAgIyBDcmVhdGUgTWF0ZXJpYWwgc2hhZGVyc1xuICAgIHZlcnRleFNoYWRlciAgID0gQGxvYWRlci5jYWNoZS5maWxlc1snYXNzZXRzL3NoYWRlcnMvY292ZXIudmVydCddXG4gICAgZnJhZ21lbnRTaGFkZXIgPSBAbG9hZGVyLmNhY2hlLmZpbGVzWydhc3NldHMvc2hhZGVycy9jb3Zlci5mcmFnJ11cblxuICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKFxuICAgICAgdW5pZm9ybXM6IFxuICAgICAgICB0ZXh0dXJlMDogICB7IHR5cGU6ICd0JywgdmFsdWU6IG5ldyBUSFJFRS5UZXh0dXJlKCkgfVxuICAgICAgICB0ZXh0dXJlMTogICB7IHR5cGU6ICd0JywgdmFsdWU6IG5ldyBUSFJFRS5UZXh0dXJlKCkgfVxuICAgICAgICBibHVycmllZDA6ICB7IHR5cGU6ICd0JywgdmFsdWU6IG5ldyBUSFJFRS5UZXh0dXJlKCkgfVxuICAgICAgICBibHVycmllZDE6ICB7IHR5cGU6ICd0JywgdmFsdWU6IG5ldyBUSFJFRS5UZXh0dXJlKCkgfVxuICAgICAgICB0TW92ZTogICAgICB7IHR5cGU6ICdmJywgdmFsdWU6IDAgfVxuICAgICAgICB0U2NhbGU6ICAgICB7IHR5cGU6ICdmJywgdmFsdWU6IDEgfVxuICAgICAgYXR0cmlidXRlczogXG4gICAgICAgIFQwQ29vcmRzOiAgIHsgdHlwZTogJ3YyJywgdmFsdWU6IFtdIH1cbiAgICAgICAgVDFDb29yZHM6ICAgeyB0eXBlOiAndjInLCB2YWx1ZTogW10gfVxuICAgICAgdmVydGV4U2hhZGVyOiB2ZXJ0ZXhTaGFkZXJcbiAgICAgIGZyYWdtZW50U2hhZGVyOiBmcmFnbWVudFNoYWRlclxuICAgIClcblxuICAgIGFycmF5MCA9IG1hdGVyaWFsLmF0dHJpYnV0ZXMuVDBDb29yZHMudmFsdWVcbiAgICBhcnJheTEgPSBtYXRlcmlhbC5hdHRyaWJ1dGVzLlQxQ29vcmRzLnZhbHVlXG4gICAgZm9yIGkgaW4gWzAuLjNdXG4gICAgICBhcnJheTBbaV0gPSBuZXcgVEhSRUUuVmVjdG9yMigpXG4gICAgICBhcnJheTFbaV0gPSBuZXcgVEhSRUUuVmVjdG9yMigpXG5cbiAgICBAcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxLCAxKSwgbWF0ZXJpYWwpXG4gICAgQHBsYW5lLnBvc2l0aW9uLnogPSAtMVxuICAgIEBhZGQoQHBsYW5lKVxuXG4gICAgIyBSZW1vdmUgb25Mb2FkIGNhbGxiYWNrIGFuZCBjb21wdXRlIHBsYW5lIHNpemVcbiAgICBAbG9hZGluZ01hbmFnZXIub25Mb2FkID0gbnVsbFxuICAgIEBfY29tcHV0ZVBsYW5lU2l6ZSgpXG5cbiAgc2V0Q292ZXJzOiAoaW1hZ2VEYXRhMCwgaW1hZ2VEYXRhMSktPlxuICAgICMgQ3JlYXRlIHRleHR1cmVzIGZyb20gaW1hZ2UgZGF0YXNcbiAgICBAdGV4dHVyZTAgPSBuZXcgVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZShpbWFnZURhdGEwLnNyYylcbiAgICBAdGV4dHVyZTAubWluRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlclxuICAgIEB0ZXh0dXJlMC5hbmlzb3Ryb3B5ID0gMVxuICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMC52YWx1ZSA9IEB0ZXh0dXJlMFxuXG4gICAgQHRleHR1cmUxID0gbmV3IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoaW1hZ2VEYXRhMS5zcmMpXG4gICAgQHRleHR1cmUxLm1pbkZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXJcbiAgICBAdGV4dHVyZTEuYW5pc290cm9weSA9IDFcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTEudmFsdWUgPSBAdGV4dHVyZTFcblxuICAgICMgVXBkYXRlIHRleHR1cmVzIGltYWdlIGFuZCBjb29yZGluYXRlcyB3aXRoIGltYWdlIGRhdGFcbiAgICBAdXBkYXRlQ292ZXJzKGltYWdlRGF0YTAsIGltYWdlRGF0YTEpXG5cbiAgdXBkYXRlQ292ZXJzOiAoaW1hZ2VEYXRhMCwgaW1hZ2VEYXRhMSktPlxuICAgIEBpbWFnZURhdGEwID0gaW1hZ2VEYXRhMFxuICAgIEBpbWFnZURhdGExID0gaW1hZ2VEYXRhMVxuXG4gICAgdGV4dHVyZTAgPSBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTAudmFsdWVcbiAgICB0ZXh0dXJlMSA9IEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMS52YWx1ZVxuXG4gICAgIyBDb21wdXRlIGltYWdlMCBjb29yZGluYXRlcyBhbmQgc2V0IHRvIGJvdGggdGV4dHVyZXNcbiAgICBjb29yZHMwID0gQF9jb21wdXRlQ29vcmRpbmF0ZXNGcm9tRGF0YShpbWFnZURhdGEwKVxuICAgIEBfc2V0Q29vcmRpbmF0ZXNUb1RleHR1cmUoY29vcmRzMCwgQHBsYW5lLm1hdGVyaWFsLmF0dHJpYnV0ZXMuVDBDb29yZHMpXG4gICAgQF9zZXRDb29yZGluYXRlc1RvVGV4dHVyZShjb29yZHMwLCBAcGxhbmUubWF0ZXJpYWwuYXR0cmlidXRlcy5UMUNvb3JkcylcblxuICAgICMgSSBkb24ndCBrbm93IGV4YWN0bHkgd2h5IGJ1dCB0ZXh0dXJlMC5pbWFnZSBpcyBudWxsIGF0IHN0YXJ0dXBcbiAgICBpZiB0ZXh0dXJlMC5pbWFnZSBhbmQgdGV4dHVyZTEuaW1hZ2VcbiAgICAgIHRleHR1cmUwLmltYWdlLnNyYyA9IGltYWdlRGF0YTAuc3JjXG4gICAgICB0ZXh0dXJlMS5pbWFnZS5zcmMgPSBpbWFnZURhdGEwLnNyY1xuICAgIGVsc2VcbiAgICAgIHRleHR1cmUwLmltYWdlID0gaW1hZ2VEYXRhMC5pbWFnZVxuICAgICAgdGV4dHVyZTEuaW1hZ2UgPSBpbWFnZURhdGEwLmltYWdlXG5cbiAgICAjIFVzZSB0aGlzIGZpeCB0byByZXNldCB0aGUgdHJhbnNpdGlvbiBwb3NpdGlvbnMgYW5kIHRleHR1cmUxIGltYWdlXG4gICAgc2V0VGltZW91dCg9PlxuICAgICAgY29vcmRzMSA9IEBfY29tcHV0ZUNvb3JkaW5hdGVzRnJvbURhdGEoaW1hZ2VEYXRhMSlcbiAgICAgIEBfc2V0Q29vcmRpbmF0ZXNUb1RleHR1cmUoY29vcmRzMSwgQHBsYW5lLm1hdGVyaWFsLmF0dHJpYnV0ZXMuVDFDb29yZHMpXG5cbiAgICAgIHRleHR1cmUxLmltYWdlLnNyYyA9IGltYWdlRGF0YTEuc3JjXG4gICAgICBAX3Jlc2V0VHJhbnNpdGlvbigpXG4gICAgICBAX3JlbmRlckJsdXIoKVxuICAgICwgMTAwKSBcblxuICByZXNpemU6IC0+XG4gICAgQF9jb21wdXRlUGxhbmVTaXplKClcbiAgICBAdXBkYXRlQ292ZXJzKEBpbWFnZURhdGEwLCBAaW1hZ2VEYXRhMSlcblxuICAjIENvbXB1dGUgdGhlIHBsYW5lIHNpemUgdG8gZmlsbCB0aGUgZW50aXJlIHNjcmVlblxuICBfY29tcHV0ZVBsYW5lU2l6ZTogLT5cbiAgICBtYW5hZ2VyICA9IFNQQUNFLlNjZW5lTWFuYWdlclxuICAgIGZvdiAgICAgID0gbWFuYWdlci5jYW1lcmEuZm92IC8gMTgwICogTWF0aC5QSVxuICAgIGRpc3RhbmNlID0gbWFuYWdlci5jYW1lcmEucG9zaXRpb24ueiArIDE7XG5cbiAgICB3aWR0aCAgPSAyICogbWFuYWdlci5jYW1lcmEuYXNwZWN0ICogTWF0aC50YW4oZm92IC8gMikgKiBkaXN0YW5jZVxuICAgIGhlaWdodCA9IDIgKiBNYXRoLnRhbihmb3YgLyAyKSAqIGRpc3RhbmNlXG5cbiAgICBAcGxhbmUuc2NhbGUuc2V0KHdpZHRoLCBoZWlnaHQsIDEpXG5cbiAgIyBDb21wdXRlIHRleHR1cmUgY29vcmRpbmF0ZXMgZnJvbSBpbWFnZSBkYXRhXG4gICMgVGhlIHRleHR1cmUgbXVzdCBmaWxsIHRoZSBlbnRpcmUgcGxhbmUvc2NyZWVuXG4gIF9jb21wdXRlQ29vcmRpbmF0ZXNGcm9tRGF0YTogKGltYWdlRGF0YSktPlxuICAgIG1hbmFnZXIgID0gU1BBQ0UuU2NlbmVNYW5hZ2VyXG4gICAgZm92ICAgICAgPSBtYW5hZ2VyLmNhbWVyYS5mb3YgLyAxODAgKiBNYXRoLlBJXG4gICAgYXNwZWN0ICAgPSBpbWFnZURhdGEud2lkdGggLyBpbWFnZURhdGEuaGVpZ2h0XG4gICAgZGlzdGFuY2UgPSBtYW5hZ2VyLmNhbWVyYS5wb3NpdGlvbi56ICsgMTtcbiAgICByYXRpbyAgICA9IE1hdGgubWF4KDEsIG1hbmFnZXIuY2FtZXJhLmFzcGVjdCAvIGFzcGVjdClcblxuICAgIHdpZHRoICA9IDIgKiBhc3BlY3QgKiBNYXRoLnRhbihmb3YgLyAyKSAqIGRpc3RhbmNlICogcmF0aW9cbiAgICBoZWlnaHQgPSAyICogTWF0aC50YW4oZm92IC8gMikgKiBkaXN0YW5jZSAqIHJhdGlvXG5cbiAgICB3U2l6ZSA9IEBwbGFuZS5zY2FsZS54XG4gICAgaFNpemUgPSBAcGxhbmUuc2NhbGUueVxuXG4gICAgZGlmZiA9IG5ldyBUSFJFRS5WZWN0b3IyKCgxLjAgLSAod1NpemUgLyB3aWR0aCkpICogMC41LCAoMS4wIC0gKGhTaXplIC8gaGVpZ2h0KSkgKiAwLjUpXG5cbiAgICAjIHYwID0gbmV3IFRIUkVFLlZlY3RvcjIoMC4wICsgZGlmZi54LCAwLjAgKyBkaWZmLnkpXG4gICAgIyB2MSA9IG5ldyBUSFJFRS5WZWN0b3IyKDAuMCArIGRpZmYueCwgMS4wIC0gZGlmZi55KVxuICAgICMgdjIgPSBuZXcgVEhSRUUuVmVjdG9yMigxLjAgLSBkaWZmLngsIDEuMCAtIGRpZmYueSlcbiAgICAjIHYzID0gbmV3IFRIUkVFLlZlY3RvcjIoMS4wIC0gZGlmZi54LCAwLjAgKyBkaWZmLnkpXG5cbiAgICBjb29yZHMgICAgICA9IFtdXG4gICAgY29vcmRzWzBdID0gbmV3IFRIUkVFLlZlY3RvcjIoMC4wICsgZGlmZi54LCAxLjAgLSBkaWZmLnkpXG4gICAgY29vcmRzWzFdID0gbmV3IFRIUkVFLlZlY3RvcjIoMS4wIC0gZGlmZi54LCAxLjAgLSBkaWZmLnkpICAgIFxuICAgIGNvb3Jkc1syXSA9IG5ldyBUSFJFRS5WZWN0b3IyKDAuMCArIGRpZmYueCwgMC4wICsgZGlmZi55KSAgICBcbiAgICBjb29yZHNbM10gPSBuZXcgVEhSRUUuVmVjdG9yMigxLjAgLSBkaWZmLngsIDAuMCArIGRpZmYueSlcblxuICAgIHJldHVybiBjb29yZHNcblxuICAjIFNldCBjb29yZGluYXRlcyB2YWx1ZSB0byB0aGUgc2hhZGVyIFxuICBfc2V0Q29vcmRpbmF0ZXNUb1RleHR1cmU6IChjb29yZGluYXRlcywgdGV4dHVyZXNDb29yZHMpLT5cbiAgICBmb3IgaSBpbiBbMC4uKHRleHR1cmVzQ29vcmRzLnZhbHVlLmxlbmd0aC0xKV1cbiAgICAgIHRleHR1cmVzQ29vcmRzLnZhbHVlW2ldLnggPSBjb29yZGluYXRlc1tpXS54XG4gICAgICB0ZXh0dXJlc0Nvb3Jkcy52YWx1ZVtpXS55ID0gY29vcmRpbmF0ZXNbaV0ueVxuICAgIHRleHR1cmVzQ29vcmRzLm5lZWRzVXBkYXRlID0gdHJ1ZSAgICBcblxuICAjIE1ha2UgY292ZXIgdHJhbnNpdGlvblxuICBfdHJhbnNpdGlvbjogLT5cbiAgICBAX3Jlc2V0VHJhbnNpdGlvbigpXG4gICAgJCh0aGlzKS5hbmltYXRlKHsgdFNjYWxlOiAwLjYgfSxcbiAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgIGVhc2luZzogJ2Vhc2VPdXRFeHBvJ1xuICAgICAgcHJvZ3Jlc3M6IC0+XG4gICAgICAgIHZhbHVlID0gQHRTY2FsZVxuICAgICAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudFNjYWxlLnZhbHVlID0gdmFsdWVcbiAgICApLmFuaW1hdGUoeyB0TW92ZTogMSB9LFxuICAgICAgZHVyYXRpb246IDc1MFxuICAgICAgZWFzaW5nOiAnZWFzZU91dEV4cG8nXG4gICAgICBwcm9ncmVzczogLT5cbiAgICAgICAgdmFsdWUgPSBAdE1vdmVcbiAgICAgICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRNb3ZlLnZhbHVlICA9IHZhbHVlXG4gICAgKS5hbmltYXRlKHsgdFNjYWxlOiAxIH0sXG4gICAgICBkdXJhdGlvbjogNTAwXG4gICAgICBlYXNpbmc6ICdlYXNlT3V0RXhwbydcbiAgICAgIHByb2dyZXNzOiAtPlxuICAgICAgICB2YWx1ZSA9IEB0U2NhbGVcbiAgICAgICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRTY2FsZS52YWx1ZSA9IHZhbHVlXG4gICAgKVxuXG4gICMgUmVzZXQgdHJhbnNpdGlvbiB2YWx1ZXNcbiAgX3Jlc2V0VHJhbnNpdGlvbjogLT5cbiAgICBAdFNjYWxlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gMS4wXG4gICAgQHRNb3ZlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IDAuMFxuICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50U2NhbGUudmFsdWUgPSAxLjBcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudE1vdmUudmFsdWUgID0gMC4wXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gIGNhbWVyYVJUVDogbnVsbFxuICBzY2VuZVJUVDogIG51bGxcbiAgcnQxOiAgICAgICAgbnVsbFxuICBydDI6ICAgICAgICBudWxsXG5cbiAgY29tcG9zZXI6ICAgbnVsbFxuICBoQmx1cjogICAgICBudWxsXG4gIHZCbHVyOiAgICAgIG51bGxcbiAgcmVuZGVyUGFzczogbnVsbFxuICBlZmZlY3RDb3B5OiBudWxsXG5cbiAgIyBDcmVhdGUgdGhlIGJsdXJyaWVkIHRleHR1cmUgdGhhbmtzIHRvIFJlbmRlci1Uby1UZXh0dXJlIG1ldGhvZFxuICBfcmVuZGVyQmx1cjogLT5cbiAgICB0MCA9IEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMC52YWx1ZVxuICAgIHQxID0gQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUxLnZhbHVlXG5cbiAgICAjIFJFTkRFUiBUTyBURVhUVVJFXG4gICAgQF9wcmVwYXJlUlRUKClcblxuICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy5ibHVycmllZDAudmFsdWUgPSBAcnQwXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLmJsdXJyaWVkMS52YWx1ZSA9IEBydDFcblxuICAgIEBfcmVuZGVyVG9UZXh0dXJlKHQwLmltYWdlLnNyYywgQHJ0MClcbiAgICBAX3JlbmRlclRvVGV4dHVyZSh0MS5pbWFnZS5zcmMsIEBydDEpXG5cbiAgX3ByZXBhcmVSVFQ6ID0+XG4gICAgdDAgICAgID0gQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUwLnZhbHVlXG4gICAgd2lkdGggID0gQHBsYW5lLnNjYWxlLnhcbiAgICBoZWlnaHQgPSBAcGxhbmUuc2NhbGUueVxuXG4gICAgQGNhbWVyYVJUVCA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMClcbiAgICBAY2FtZXJhUlRULnBvc2l0aW9uLnNldFooNjAwKVxuXG4gICAgQHNjZW5lUlRUID0gbmV3IFRIUkVFLlNjZW5lKClcblxuICAgIG9wdGlvbnMgPSB7IG1pbkZpbHRlcjogVEhSRUUuTGluZWFyRmlsdGVyLCBtYWdGaWx0ZXI6IFRIUkVFLk5lYXJlc3RGaWx0ZXIsIGZvcm1hdDogVEhSRUUuUkdCRm9ybWF0IH1cbiAgICBAcnQwICAgID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIG9wdGlvbnMpXG4gICAgQHJ0MSAgICA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0LCBvcHRpb25zKVxuXG4gICAgQGhCbHVyICAgICAgICAgICAgICAgICAgPSBuZXcgVEhSRUUuU2hhZGVyUGFzcyhUSFJFRS5Ib3Jpem9udGFsQmx1clNoYWRlcik7XG4gICAgQGhCbHVyLmVuYWJsZWQgICAgICAgICAgPSB0cnVlO1xuICAgIEBoQmx1ci51bmlmb3Jtcy5oLnZhbHVlID0gMSAvIHdpbmRvdy5pbm5lcldpZHRoO1xuXG4gICAgQHZCbHVyICAgICAgICAgICAgICAgICAgPSBuZXcgVEhSRUUuU2hhZGVyUGFzcyhUSFJFRS5WZXJ0aWNhbEJsdXJTaGFkZXIpO1xuICAgIEB2Qmx1ci5lbmFibGVkICAgICAgICAgID0gdHJ1ZTtcbiAgICBAdkJsdXIudW5pZm9ybXMudi52YWx1ZSA9IDEgLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICBAcmVuZGVyUGFzcyA9IG5ldyBUSFJFRS5SZW5kZXJQYXNzKEBzY2VuZVJUVCwgQGNhbWVyYVJUVClcblxuICAgIEBlZmZlY3RDb3B5ID0gbmV3IFRIUkVFLlNoYWRlclBhc3MoVEhSRUUuQ29weVNoYWRlcilcblxuICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKClcblxuICAgIEBwbGFuZVJUVCAgICAgICAgICAgID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoMS4wLCAxLjApLCBtYXRlcmlhbClcbiAgICBAcGxhbmVSVFQucG9zaXRpb24ueiA9IC0xXG4gICAgQHBsYW5lUlRULnNjYWxlLnNldChAcGxhbmUuc2NhbGUueCwgQHBsYW5lLnNjYWxlLnksIDEuMClcbiAgICBAc2NlbmVSVFQuYWRkKEBwbGFuZVJUVClcblxuICBfcmVuZGVyVG9UZXh0dXJlOiAodGV4dHVyZVVybCwgdGFyZ2V0KS0+XG4gICAgQHRleHR1cmVMb2FkZXIubG9hZCB0ZXh0dXJlVXJsLCAodGV4dHVyZSk9PlxuICAgICAgQHBsYW5lUlRULm1hdGVyaWFsLm1hcCA9IHRleHR1cmVcbiAgICAgIG1hbmFnZXIgICAgICAgICAgICAgICAgPSBTUEFDRS5TY2VuZU1hbmFnZXJcblxuICAgICAgZGVsZXRlIEBjb21wb3NlclxuXG4gICAgICBAY29tcG9zZXIgPSBuZXcgVEhSRUUuRWZmZWN0Q29tcG9zZXIobWFuYWdlci5yZW5kZXJlciwgdGFyZ2V0KVxuICAgICAgQGNvbXBvc2VyLmFkZFBhc3MoQHJlbmRlclBhc3MpXG4gICAgICBAY29tcG9zZXIuYWRkUGFzcyhAaEJsdXIpXG4gICAgICBAY29tcG9zZXIuYWRkUGFzcyhAdkJsdXIpXG4gICAgICBAY29tcG9zZXIuYWRkUGFzcyhAZWZmZWN0Q29weSlcbiAgICAgIEBjb21wb3Nlci5yZW5kZXIoMC4wMSlcblxuXG5jbGFzcyBTUEFDRS5Db3ZlckNvbnRyb2xsZXJcblxuICBAUExBWUxJU1RfTE9BREVEOiAnY292ZXJfcGxheWxpc3RfbG9hZGVkJ1xuICBAVEVYVFVSRVNfTE9BREVEOiAnY292ZXJfdGV4dHVyZXNfbG9hZGVkJ1xuICBATkVYVDogICAgICAgICAgICAnY292ZXJfbmV4dCdcblxuICBwbGF5bGlzdDogICAgICAgIG51bGxcbiAgY3VycmVudDogICAgICAgICBudWxsXG5cbiAgdmlldzogICAgICAgICAgICBudWxsXG4gIHBsYXlsaXN0VmlldzogICAgbnVsbFxuXG4gIF9sb2FkaW5nTWFuYWdlcjogbnVsbFxuICBfaW1hZ2VMb2FkZXI6ICAgIG51bGxcblxuICBfaW1hZ2VEYXRhOiAgICBudWxsXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXEub3BlbignR0VUJywgJ3Jlc291cmNlcy9wbGF5bGlzdC5qc29uJywgdHJ1ZSlcbiAgICByZXEub25sb2FkID0gKGUpPT5cbiAgICAgIEBwbGF5bGlzdCA9IEpTT04ucGFyc2UoZS50YXJnZXQucmVzcG9uc2UpXG4gICAgICBAX2xvYWQoKVxuICAgIHJlcS5zZW5kKClcblxuICAgIEBfc2V0dXAoKVxuICAgIEBfZXZlbnRzKClcblxuICBfc2V0dXA6IC0+XG4gICAgQF9pbWFnZURhdGEgPSB7fVxuXG4gICAgQF9sb2FkaW5nTWFuYWdlciAgICAgICAgPSBuZXcgVEhSRUUuTG9hZGluZ01hbmFnZXIoKVxuICAgIEBfbG9hZGluZ01hbmFnZXIub25Mb2FkID0gQF9vbkxvYWRcbiAgICBAX2ltYWdlTG9hZGVyICAgICAgICAgICA9IG5ldyBUSFJFRS5JbWFnZUxvYWRlcihAX2xvYWRpbmdNYW5hZ2VyKVxuICAgIEBfdGV4dHVyZUxvYWRlciAgICAgICAgID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKVxuXG4gICAgQHZpZXcgPSBuZXcgU1BBQ0UuQ292ZXIoKVxuICAgIEB2aWV3LnNldHVwKClcblxuICAgIEBwbGF5bGlzdFZpZXcgPSBuZXcgUGxheWxpc3QoKVxuXG4gIF9sb2FkOiAtPlxuICAgIGZvciBjb3ZlciBpbiBAcGxheWxpc3RcbiAgICAgIGNvdmVyLnVybCArPSAnPycgKyBAX2d1aWQoKVxuICAgICAgQF9pbWFnZUxvYWRlci5sb2FkIGNvdmVyLmNvdmVyX3VybCwgKGltYWdlKT0+XG5cbiAgICAgICAgc3JjID0gaW1hZ2Uuc3JjLnJlcGxhY2Uod2luZG93LmxvY2F0aW9uLm9yaWdpbisnLycsICcnKVxuXG4gICAgICAgIEBfaW1hZ2VEYXRhW3NyY10gICAgICAgICAgICAgPSB7fVxuICAgICAgICBAX2ltYWdlRGF0YVtzcmNdLnNyYyAgICAgICAgID0gc3JjIFxuICAgICAgICBAX2ltYWdlRGF0YVtzcmNdLmltYWdlICAgICAgID0gaW1hZ2UgXG4gICAgICAgIEBfaW1hZ2VEYXRhW3NyY10ud2lkdGggICAgICAgPSBpbWFnZS53aWR0aCBcbiAgICAgICAgQF9pbWFnZURhdGFbc3JjXS5oZWlnaHQgICAgICA9IGltYWdlLmhlaWdodCBcblxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgQHBsYXlsaXN0Vmlldy5zZXRMaXN0KEBwbGF5bGlzdClcblxuICBfZ3VpZDogLT5cbiAgICBzNCA9IC0+XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKSBcbiAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoVHJhY2suSVNfV0FJVElORywgICBAX2VUcmFja0lzV2FpdGluZylcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFRyYWNrLldJTExfUExBWSwgICAgQF9lVHJhY2tXaWxsUGxheSlcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEp1a2Vib3guSVNfUVVFVUlORywgQF9lSnVrZWJveElzUXVldWluZylcblxuICBfb25Mb2FkOiA9PlxuICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLkNvdmVyQ29udHJvbGxlci5QTEFZTElTVF9MT0FERUQpXG5cbiAgICBAX2xvYWRpbmdNYW5hZ2VyLm9uTG9hZCA9IEBfdGV4dHVyZUxvYWRlZFxuXG4gICAgIyBAdmlldy5pbWFnZXNMb2FkZWQgPSBAX2ltYWdlTG9hZGVyLmNhY2hlLmZpbGVzXG4gICAgIyBAdmlldy5zZXRDb3ZlcnMoQHBsYXlsaXN0WzFdLmNvdmVyX3VybCwgQHBsYXlsaXN0WzBdLmNvdmVyX3VybClcbiAgICB1cmwwID0gQHBsYXlsaXN0WzFdLmNvdmVyX3VybFxuICAgIHVybDEgPSBAcGxheWxpc3RbMF0uY292ZXJfdXJsXG4gICAgQHZpZXcuc2V0Q292ZXJzKEBfaW1hZ2VEYXRhW3VybDBdLCBAX2ltYWdlRGF0YVt1cmwxXSlcblxuICBfZVRyYWNrSXNXYWl0aW5nOiAoZSk9PlxuICAgIHRyYWNrID0gZS5vYmplY3QudHJhY2tcblxuICAgIGZvciB0LCBpIGluIEBwbGF5bGlzdFxuICAgICAgaWYgdC51cmwgPT0gdHJhY2suZGF0YS5zb3VyY2VfdXJsXG4gICAgICAgIG5leHRUcmFjayA9IG51bGxcbiAgICAgICAgaWYgaSsxIDwgQHBsYXlsaXN0Lmxlbmd0aFxuICAgICAgICAgIG5leHRUcmFjayA9IEBwbGF5bGlzdFtpKzFdXG4gICAgICAgIFxuICAgICAgICB0cmFjay5tZXJnZURhdGEoe1xuICAgICAgICAgIHRpdGxlOiAgICAgICB0LnRpdGxlXG4gICAgICAgICAgY292ZXJfdXJsOiAgIHQuY292ZXJfdXJsXG4gICAgICAgICAgYXV0aG9yX25hbWU6IHQuYXV0aG9yX25hbWVcbiAgICAgICAgICBhdXRob3JfdXJsOiAgdC5hdXRob3JfdXJsXG4gICAgICAgICAgY29sb3IxOiAgICAgIHQuY29sb3IxXG4gICAgICAgICAgY29sb3IyOiAgICAgIHQuY29sb3IyXG4gICAgICAgICAgbmV4dFRyYWNrOiAgIG5leHRUcmFja1xuICAgICAgICB9KVxuXG4gICAgICAgIGJyZWFrO1xuXG4gIF9lSnVrZWJveElzUXVldWluZzogKGUpPT5cbiAgICBjID0gZS5vYmplY3QuanVrZWJveC5jdXJyZW50XG5cbiAgICBpc1BsYXlsaXN0ID0gQGN1cnJlbnQgYW5kIEBjdXJyZW50LmRhdGEuaXNfcGxheWxpc3RcbiAgICBpc1BsYXlsaXN0ID0gaXNQbGF5bGlzdCBhbmQgYy5kYXRhLmlzX3BsYXlsaXN0XG4gICAgXG4gICAgc2FtZUNvdmVyID0gZmFsc2VcbiAgICBpZiBpc1BsYXlsaXN0XG4gICAgICBzYW1lQ292ZXIgPSBjLmRhdGEucGxheWxpc3QucGVybWFsaW5rID09IEBjdXJyZW50LmRhdGEucGxheWxpc3QucGVybWFsaW5rXG4gICAgQGN1cnJlbnQgICAgPSBlLm9iamVjdC5qdWtlYm94LmN1cnJlbnRcblxuICAgIGlmIG5vdCBzYW1lQ292ZXJcbiAgICAgIEBwbGF5bGlzdFZpZXcuc2V0QWN0aXZlKEBjdXJyZW50LmRhdGEuc291cmNlX3VybClcbiAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLkNvdmVyQ29udHJvbGxlci5ORVhUKSBcbiAgICAgIEBfaGlkZSgpXG5cbiAgX2VUcmFja1dpbGxQbGF5OiAoZSk9PlxuICAgIGN1cnJlbnQgID0gZS5vYmplY3QudHJhY2suZGF0YVxuICAgIG5leHQgICAgID0gY3VycmVudC5uZXh0VHJhY2tcbiAgICBAX3VwZGF0ZUluZm8oY3VycmVudCwgbmV4dClcblxuICBfaGlkZTogLT5cbiAgICAkKCcjaW5mb3JtYXRpb24gaDEnKS5hZGRDbGFzcygnaGlkZGVuJylcbiAgICAkKCcjaW5mb3JtYXRpb24gaDInKS5hZGRDbGFzcygnaGlkZGVuJylcblxuICBfdXBkYXRlSW5mbzogKGN1cnJlbnQsIG5leHQpPT5cbiAgICB0aXRsZSAgICA9IGN1cnJlbnQudGl0bGVcbiAgICB1c2VybmFtZSA9IGN1cnJlbnQuYXV0aG9yX25hbWVcbiAgICB1c2VyX3VybCA9IGN1cnJlbnQuYXV0aG9yX3VybFxuICAgIGNvbG9yMSAgID0gY3VycmVudC5jb2xvcjFcbiAgICBjb2xvcjIgICA9IGN1cnJlbnQuY29sb3IyXG5cbiAgICAkKCcjaW5mb3JtYXRpb24gaDEnKS5odG1sKHRpdGxlKVxuICAgICQoJyNpbmZvcm1hdGlvbiBoMicpLmh0bWwoJ2J5IDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInK3VzZXJfdXJsKydcIj4nK3VzZXJuYW1lKyc8L2E+JylcblxuICAgIGNzcyA9IFwiXCJcIlxuICAgICAgICBhIHsgY29sb3I6IFwiXCJcIitjb2xvcjErXCJcIlwiICFpbXBvcnRhbnQ7IH1cbiAgICAgICAgYm9keSB7IGNvbG9yOiBcIlwiXCIrY29sb3IyK1wiXCJcIiAhaW1wb3J0YW50OyB9XG4gICAgXCJcIlwiXG4gICAgJCgnLmNvdmVyLXN0eWxlJykuaHRtbChjc3MpXG5cbiAgICBpZiBuZXh0XG4gICAgICB1cmwwID0gY3VycmVudC5jb3Zlcl91cmxcbiAgICAgIHVybDEgPSBuZXh0LmNvdmVyX3VybFxuICAgICAgQHZpZXcudXBkYXRlQ292ZXJzKEBfaW1hZ2VEYXRhW3VybDBdLCBAX2ltYWdlRGF0YVt1cmwxXSlcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgIyBfY29vcmRpbmF0ZXM6IChpbWFnZURhdGEpLT5cbiAgIyAgIG1hbmFnZXIgID0gU1BBQ0UuU2NlbmVNYW5hZ2VyXG4gICMgICBmb3YgICAgICA9IG1hbmFnZXIuY2FtZXJhLmZvdiAvIDE4MCAqIE1hdGguUElcbiAgIyAgIGFzcGVjdCAgID0gaW1hZ2VEYXRhLndpZHRoIC8gaW1hZ2VEYXRhLmhlaWdodFxuICAjICAgZGlzdGFuY2UgPSBtYW5hZ2VyLmNhbWVyYS5wb3NpdGlvbi56ICsgMTtcbiAgIyAgIHJhdGlvICAgID0gTWF0aC5tYXgoMSwgbWFuYWdlci5jYW1lcmEuYXNwZWN0IC8gYXNwZWN0KVxuXG4gICMgICB3aWR0aCAgPSAyICogYXNwZWN0ICogTWF0aC50YW4oZm92IC8gMikgKiBkaXN0YW5jZSAqIHJhdGlvXG4gICMgICBoZWlnaHQgPSAyICogTWF0aC50YW4oZm92IC8gMikgKiBkaXN0YW5jZSAqIHJhdGlvXG5cbiAgIyAgIHdTaXplID0gQHZpZXcucGxhbmUubWF0ZXJpYWwudW5pZm9ybXMucmVzb2x1dGlvbi52YWx1ZS54XG4gICMgICBoU2l6ZSA9IEB2aWV3LnBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnJlc29sdXRpb24udmFsdWUueVxuXG4gICMgICBkaWZmID0gbmV3IFRIUkVFLlZlY3RvcjIoKDEuMCAtICh3U2l6ZSAvIHdpZHRoKSkgKiAwLjUsICgxLjAgLSAoaFNpemUgLyBoZWlnaHQpKSAqIDAuNSlcblxuICAjICAgIyB2MCA9IG5ldyBUSFJFRS5WZWN0b3IyKDAuMCArIGRpZmYueCwgMC4wICsgZGlmZi55KVxuICAjICAgIyB2MSA9IG5ldyBUSFJFRS5WZWN0b3IyKDAuMCArIGRpZmYueCwgMS4wIC0gZGlmZi55KVxuICAjICAgIyB2MiA9IG5ldyBUSFJFRS5WZWN0b3IyKDEuMCAtIGRpZmYueCwgMS4wIC0gZGlmZi55KVxuICAjICAgIyB2MyA9IG5ldyBUSFJFRS5WZWN0b3IyKDEuMCAtIGRpZmYueCwgMC4wICsgZGlmZi55KVxuXG4gICMgICBjb29yZHMgICAgICA9IFtdXG4gICMgICBjb29yZHNbMF0gPSBuZXcgVEhSRUUuVmVjdG9yMigwLjAgKyBkaWZmLngsIDEuMCAtIGRpZmYueSlcbiAgIyAgIGNvb3Jkc1sxXSA9IG5ldyBUSFJFRS5WZWN0b3IyKDEuMCAtIGRpZmYueCwgMS4wIC0gZGlmZi55KSAgICBcbiAgIyAgIGNvb3Jkc1syXSA9IG5ldyBUSFJFRS5WZWN0b3IyKDAuMCArIGRpZmYueCwgMC4wICsgZGlmZi55KSAgICBcbiAgIyAgIGNvb3Jkc1szXSA9IG5ldyBUSFJFRS5WZWN0b3IyKDEuMCAtIGRpZmYueCwgMC4wICsgZGlmZi55KVxuXG4gICMgICByZXR1cm4gY29vcmRzXG5cblxuY2xhc3MgUGxheWxpc3RcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAX2V2ZW50cygpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWxpc3QgLm9wZW4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIEBfZU9wZW4pXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXlsaXN0IC5jbG9zZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgQF9lQ2xvc2UpXG5cbiAgX2VPcGVuOiAtPlxuICAgICQoJyNwbGF5bGlzdCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxuXG4gIF9lQ2xvc2U6IC0+XG4gICAgJCgnI3BsYXlsaXN0JykuYWRkQ2xhc3MoJ2hpZGRlbicpXG5cbiAgc2V0TGlzdDogKGxpc3QpLT5cbiAgICBodG1sID0gXCJcIlxuICAgIGZvciBpdGVtLCBpIGluIGxpc3RcbiAgICAgIGh0bWwgKz0gXCI8bGkgZGF0YS11cmw9XFxcIlwiK2l0ZW0udXJsK1wiXFxcIj5cIlxuICAgICAgaHRtbCArPSBcIjxzcGFuIGNsYXNzPVxcXCJudW1iZXJcXFwiPlwiKyhpKzEpK1wiPC9zcGFuPlwiXG4gICAgICBodG1sICs9IFwiPHNwYW4gY2xhc3M9XFxcInRpdGxlXFxcIj5cIitpdGVtLnRpdGxlK1wiPC9zcGFuPlwiXG4gICAgICBodG1sICs9IFwiPHNwYW4gY2xhc3M9XFxcImR1cmF0aW9uXFxcIj48L3NwYW4+XCJcbiAgICAgIGh0bWwgKz0gXCI8L2xpPlwiXG4gICAgJCgnI3BsYXlsaXN0IHVsJykuaHRtbChodG1sKVxuXG4gIHNldEFjdGl2ZTogKGFjdGl2ZVVybCktPlxuICAgIGNvbnNvbGUubG9nIGFjdGl2ZVVybFxuICAgICQoJyNwbGF5bGlzdCBsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICQoJyNwbGF5bGlzdCBsaVtkYXRhLXVybD1cIicrYWN0aXZlVXJsKydcIl0nKS5hZGRDbGFzcygnYWN0aXZlJylcblxuXG4oLT5cbiAgc2NlbmVzID0gWydNYWluU2NlbmUnXVxuXG4gIFNQQUNFLlNjZW5lTWFuYWdlciA9IG5ldyBTUEFDRS5TY2VuZU1hbmFnZXIoKVxuICBmb3Igc2NlbmUgaW4gc2NlbmVzXG4gICAgU1BBQ0UuU2NlbmVNYW5hZ2VyLmNyZWF0ZVNjZW5lKHNjZW5lKVxuXG4gIFNQQUNFLlNjZW5lTWFuYWdlci5nb1RvU2NlbmUoJ01haW5TY2VuZScpXG4pKClcblxuXG4iXX0=