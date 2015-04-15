var AirportState, JUKEBOX, JukeboxState, Keyboard, SPACE, SearchEngineState, SpaceshipState, TRACK, WebAudioAPI, _Coffee, _Easing, _Math, _THREE,
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
    console.log(eventname);
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

_Coffee = _Coffee || {
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

_Easing = _Easing || {
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

  SceneManager.prototype._setup = function() {
    this._clock = new THREE.Clock();
    this._scenes = [];
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
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
    this._setup = bind(this._setup, this);
    this._eSCIsConnected = bind(this._eSCIsConnected, this);
    MainScene.__super__.constructor.call(this);
  }

  MainScene.prototype.resume = function() {
    MainScene.__super__.resume.call(this);
    this._manager = SPACE.SceneManager;
    this._manager.camera.position.setZ(600);
    SPACE.SC = new SPACE.SoundCloud(SPACE.SC.id, SPACE.SC.redirect_uri);
    this._events();
    if (SPACE.SC.isConnected()) {
      return this._setup();
    }
  };

  MainScene.prototype.pause = function() {};

  MainScene.prototype._events = function() {
    return document.addEventListener(SPACE.SoundCloud.IS_CONNECTED, this._eSCIsConnected);
  };

  MainScene.prototype._eSCIsConnected = function() {
    return this._setup();
  };

  MainScene.prototype._setup = function() {
    var big, req, small;
    window.firstLaunch = true;
    this._jukebox = new SPACE.Jukebox();
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
    this.cover = new SPACE.Cover();
    this.add(this.cover);
    req = new XMLHttpRequest();
    req.open('GET', 'resources/playlist.json', true);
    req.onload = (function(_this) {
      return function(e) {
        _this.playlist = JSON.parse(e.target.response);
        return _this.cover.load(_this.playlist);
      };
    })(this);
    return req.send();
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
      options = _Coffee.merge(defaults, options);
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

SPACE.Jukebox = (function() {
  Jukebox.IS_WAITING = 'jukebox_is_waiting';

  Jukebox.IS_QUEUING = 'jukebox_is_queuing';

  Jukebox.prototype.current = null;

  Jukebox.prototype.playlist = null;

  Jukebox.prototype.SC = null;

  Jukebox.prototype.state = null;

  Jukebox.prototype._nextDelay = 100;

  Jukebox.prototype._nextTimeout = null;

  Jukebox.prototype._refreshDelay = 1000;

  function Jukebox() {
    this._refresh = bind(this._refresh, this);
    this._eTrackIsStopped = bind(this._eTrackIsStopped, this);
    this.playlist = [];
    this.SC = SPACE.SC;
    this.inputType = 'WebAudioAPI';
    this.setState(SPACE.Jukebox.IS_WAITING);
    this._refresh();
    this._events();
  }

  Jukebox.prototype._events = function() {
    return document.addEventListener(SPACE.Track.IS_STOPPED, this._eTrackIsStopped);
  };

  Jukebox.prototype._eTrackIsStopped = function() {
    return this.setState(SPACE.Jukebox.IS_WAITING);
  };

  Jukebox.prototype.setState = function(state) {
    this.state = state;
    switch (this.state) {
      case SPACE.Jukebox.IS_WAITING:
        return HELPER.trigger(SPACE.Jukebox.IS_WAITING, {
          jukebox: this
        });
      case SPACE.Jukebox.IS_QUEUING:
        return HELPER.trigger(SPACE.Jukebox.IS_QUEUING, {
          jukebox: this
        });
    }
  };

  Jukebox.prototype._createTrack = function(data, inputMode) {
    var track;
    if (inputMode == null) {
      inputMode = false;
    }
    track = new SPACE.Track();
    track.inputMode = inputMode;
    track.setData(data);
    return this.playlist.push(track);
  };

  Jukebox.prototype._refresh = function() {
    if (this.playlist.length > 0 && this.state === SPACE.Jukebox.IS_WAITING) {
      this.next();
    }
    return setTimeout(this._refresh, this._refreshDelay);
  };

  Jukebox.prototype.add = function(urlOrInput) {
    if (typeof urlOrInput === 'boolean' && urlOrInput) {
      this._createTrack({}, true);
      return;
    }
    return this.SC.getSoundOrPlaylist(urlOrInput, (function(_this) {
      return function(o) {
        var data, j, len, results1, tracks;
        tracks = null;
        if (o.hasOwnProperty('tracks')) {
          tracks = o.tracks;
        } else {
          tracks = [o];
        }
        results1 = [];
        for (j = 0, len = tracks.length; j < len; j++) {
          data = tracks[j];
          results1.push(_this._createTrack(data, false));
        }
        return results1;
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
    if (this.inputType === 'Microphone') {
      return;
    }
    if (this._nextTimeout) {
      clearTimeout(this._nextTimeout);
    }
    this.setState(SPACE.Jukebox.IS_QUEUING);
    return this._nextTimeout = setTimeout((function(_this) {
      return function() {
        if (_this.current) {
          _this.current.stop();
        }
        if (_this.playlist.length > 0) {
          _this.current = _this.playlist.shift();
          return _this.current.load();
        }
      };
    })(this), this._nextDelay);
  };

  return Jukebox;

})();

SPACE.Track = (function() {
  Track.IS_WAITING = 'track_is_waiting';

  Track.WILL_PLAY = 'track_will_play';

  Track.IS_PLAYING = 'track_is_playing';

  Track.IS_PAUSED = 'track_is_paused';

  Track.IS_STOPPED = 'track_is_stopped';

  Track.APIType = {
    SoundManager2: 'SoundManager2',
    WebAudioAPI: 'WebAudioAPI',
    JSON: 'JSON'
  };

  Track.prototype._SC = null;

  Track.prototype._data = null;

  Track.prototype._APIType = null;

  Track.prototype._API = null;

  Track.prototype.timedata = null;

  Track.prototype.autoplay = true;

  Track.prototype.state = null;

  Track.prototype.loadingprogression = 0;

  Track.prototype.inputMode = false;

  function Track() {
    this._webaudioapi = bind(this._webaudioapi, this);
    this._whileplaying = bind(this._whileplaying, this);
    this._onloadingprogress = bind(this._onloadingprogress, this);
    this._onended = bind(this._onended, this);
    this._onstop = bind(this._onstop, this);
    this._onpause = bind(this._onpause, this);
    this._onplay = bind(this._onplay, this);
    this._onstart = bind(this._onstart, this);
    this._SC = SPACE.SC;
    this._APIType = SPACE.Track.APIType.WebAudioAPI;
    this._resetTimedata();
    this.setState(SPACE.Track.IS_WAITING);
  }

  Track.prototype.setData = function(data) {
    return this._data = data;
  };

  Track.prototype.setState = function(state) {
    this.state = state;
    switch (this.state) {
      case SPACE.Track.IS_WAITING:
        return HELPER.trigger(SPACE.Track.IS_WAITING, {
          track: this
        });
      case SPACE.Track.WILL_PLAY:
        this._resetTimedata();
        return HELPER.trigger(SPACE.Track.WILL_PLAY, {
          track: this
        });
      case SPACE.Track.IS_PLAYING:
        return HELPER.trigger(SPACE.Track.IS_PLAYING, {
          track: this
        });
      case SPACE.Track.IS_PAUSED:
        this._resetTimedata();
        return HELPER.trigger(SPACE.Track.IS_PAUSED, {
          track: this
        });
      case SPACE.Track.IS_STOPPED:
        this._resetTimedata();
        return HELPER.trigger(SPACE.Track.IS_STOPPED, {
          track: this
        });
    }
  };

  Track.prototype.load = function() {
    this.setState(SPACE.Track.WILL_PLAY);
    if (this.inputMode) {
      return this._webaudioapi();
    } else if (this._APIType === 'WebAudioAPI') {
      return this._SC.getSoundUrl('/tracks/' + this._data.id, this._webaudioapi);
    } else {
      return this._soundmanager2();
    }
  };

  Track.prototype.play = function() {
    return this._API.play();
  };

  Track.prototype.pause = function() {
    return this._API.pause();
  };

  Track.prototype.stop = function() {
    return this._API.stop();
  };

  Track.prototype.volume = function(value) {
    return this._API.volume(value);
  };

  Track.prototype.destroy = function() {
    switch (this._APIType) {
      case SPACE.Track.APIType.SoundManager2:
        return this._API.destruct();
      case SPACE.Track.APIType.WebAudioAPI:
        return this._API.destroy();
      default:
        return console.log('something to destroy here');
    }
  };

  Track.prototype._onstart = function(api) {
    this._API = api;
    return window.AudioAPI = api;
  };

  Track.prototype._onplay = function() {
    return this.setState(SPACE.Track.IS_PLAYING);
  };

  Track.prototype._onpause = function() {
    return this.setState(SPACE.Track.IS_PAUSED);
  };

  Track.prototype._onstop = function() {
    return this.setState(SPACE.Track.IS_STOPPED);
  };

  Track.prototype._onended = function() {
    return this.setState(SPACE.Track.IS_STOPPED);
  };

  Track.prototype._onloadingprogress = function(value) {
    return this.loadingprogression = value;
  };

  Track.prototype._whileplaying = function() {
    var analyser, array, i, j, k, l, results1, results2, results3;
    switch (this._APIType) {
      case SPACE.Track.APIType.SoundManager2:
        results1 = [];
        for (i = j = 0; j <= 255; i = ++j) {
          results1.push(this.timedata[i] = Math.max(this.sound.waveformData.left[i], this.sound.waveformData.right[i]));
        }
        return results1;
        break;
      case SPACE.Track.APIType.WebAudioAPI:
        analyser = this._API.analyser;
        if (!analyser.getFloatTimeDomainData) {
          array = new Uint8Array(analyser.fftSize);
          analyser.getByteTimeDomainData(array);
          results2 = [];
          for (i = k = 0; k <= 255; i = ++k) {
            results2.push(this.timedata[i] = (array[i] - 128) / 128);
          }
          return results2;
        } else {
          array = new Float32Array(analyser.fftSize);
          analyser.getFloatTimeDomainData(array);
          results3 = [];
          for (i = l = 0; l <= 255; i = ++l) {
            results3.push(this.timedata[i] = array[i]);
          }
          return results3;
        }
    }
  };

  Track.prototype._webaudioapi = function(url) {
    var firstLaunch;
    if (!window.firstLaunch) {
      firstLaunch = false;
      if (/mobile/gi.test(navigator.userAgent)) {
        this.autoplay = false;
      }
    } else {
      this.autoplay = true;
    }
    this._API = WebAudioAPI;
    this._API.onplay = this._onplay;
    this._API.onended = this._onended;
    this._API.onpause = this._onpause;
    this._API.onstop = this._onstop;
    this._API.onaudioprocess = this._whileplaying;
    this._API.onloadingprogress = this._onloadingprogress;
    if (this.inputMode) {
      this._API.inputMode = true;
      return this._API.streamInput();
    } else {
      this._API.inputMode = false;
      return this._API.setUrl(url, this.autoplay, this._onstart);
    }
  };

  Track.prototype._soundmanager2 = function() {
    return this._SC.streamSound(this._data, {
      onplay: this._onplay,
      onfinish: this._onended,
      onstop: this._onstop,
      whileplaying: this._whileplaying,
      whileloading: (function(_this) {
        return function() {
          return _this._onloadingprogress(_this._API.bytesLoaded / _this._API.bytesTotal);
        };
      })(this)
    }, this._onstart);
  };

  Track.prototype._resetTimedata = function() {
    var i, j, results1;
    this.timedata = Array(256);
    results1 = [];
    for (i = j = 0; j <= 255; i = ++j) {
      results1.push(this.timedata[i] = 0);
    }
    return results1;
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

  WebAudioAPI.prototype.volume = function(volume) {
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

  WebAudioAPI.prototype.destroy = function() {
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
      nbValues: 256,
      mirror: true,
      linewidth: 2
    };
    opts = _Coffee.merge(defaults, opts);
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
    if (this._jukebox.current && this._jukebox.current.state === SPACE.Track.IS_PLAYING) {
      this.setValues(this._jukebox.current.timedata);
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

  Cover.TEXTURES_LOADED = 'cover_textures_loaded';

  Cover.prototype.loadingManager = null;

  Cover.prototype.imageLoader = null;

  Cover.prototype.plane = null;

  Cover.prototype.playlist = null;

  Cover.prototype.texture0 = null;

  Cover.prototype.texture1 = null;

  Cover.prototype.fov = 0;

  Cover.prototype.aspect = 0;

  Cover.prototype.distance = 0;

  Cover.prototype.tFade = 1;

  Cover.prototype.tScale = 1;

  function Cover() {
    this._prepareRTT = bind(this._prepareRTT, this);
    this._textureLoaded = bind(this._textureLoaded, this);
    this._setupPlane = bind(this._setupPlane, this);
    this._eTrackIsLoaded = bind(this._eTrackIsLoaded, this);
    this._eTrackIsPaused = bind(this._eTrackIsPaused, this);
    this._eTrackIsPlaying = bind(this._eTrackIsPlaying, this);
    this._eTransitionEnded = bind(this._eTransitionEnded, this);
    this._eJukeboxWillPlay = bind(this._eJukeboxWillPlay, this);
    Cover.__super__.constructor.apply(this, arguments);
    this._setup();
    this._events();
  }

  Cover.prototype._events = function() {
    document.addEventListener(SPACE.Track.IS_PLAYING.type, this._eTrackIsPlaying);
    document.addEventListener(SPACE.Track.IS_PAUSED.type, this._eTrackIsPaused);
    document.addEventListener(SPACE.Track.WILL_PLAY.type, this._eJukeboxWillPlay);
    return $('#loading, #information span').on('click', function(e) {
      if ($('#loading').hasClass('ready') && window.WebAudioAPI) {
        e.preventDefault();
        window.WebAudioAPI.play();
        return false;
      }
    });
  };

  Cover.prototype._eJukeboxWillPlay = function(e) {
    this.next();
    $('#information h1').addClass('hidden');
    return $('#information h2').addClass('hidden');
  };

  Cover.prototype._eTransitionEnded = function(e) {
    return HELPER.trigger(EVENT.Cover.TRANSITION_ENDED);
  };

  Cover.prototype._eTrackIsPlaying = function(e) {
    $('#information h1').removeClass('hidden');
    $('#information h2').removeClass('hidden');
    return $('#loading').addClass('hidden');
  };

  Cover.prototype._eTrackIsPaused = function(e) {
    $('#loading').removeClass('hidden');
    $('#loading i.icn').removeClass('play');
    return $('#loading i.icn').addClass('pause');
  };

  Cover.prototype._eTrackIsLoaded = function(e) {
    var css, i, j, len, nextTrack, ref, title, track, trackData, user_url, username;
    if (!$('#loading').hasClass('ready')) {
      $('#loading').addClass('ready');
      $('#loading p').html('Tap in the middle<br>to play or pause');
    }
    track = e.object.track;
    title = track.data.title;
    username = track.data.author;
    user_url = track.data.author_url;
    $('#information h1').html(title);
    $('#information h2').html('by <a target="_blank" href="' + user_url + '">' + username + '</a>');
    css = "a { color: " + track.data.color1 + " !important; }\nbody { color: " + track.data.color2 + " !important; }";
    $('.cover-style').html(css);
    nextTrack = this.playlist[0];
    ref = this.playlist;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      trackData = ref[i];
      if (trackData.cover === track.data.cover) {
        if (i + 1 < this.playlist.length) {
          nextTrack = this.playlist[i + 1];
        }
        break;
      }
    }
    this.textureLoader.load('resources/covers/' + track.data.cover, (function(_this) {
      return function(texture) {
        _this.texture0 = texture;
        return _this._textureLoaded();
      };
    })(this));
    this.textureLoader.load('resources/covers/' + nextTrack.cover, (function(_this) {
      return function(texture) {
        _this.texture1 = texture;
        return _this._textureLoaded();
      };
    })(this));
    $('.blurried li div').css({
      height: window.innerHeight
    });
    $('.blurried li div').last().css('background-image', 'url(resources/covers/' + track.data.cover + ')');
    return $('.blurried li div').first().css('background-image', 'url(resources/covers/' + nextTrack.cover + ')');
  };

  Cover.prototype._setup = function() {
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onLoad = this._setupPlane;
    this.imageLoader = new THREE.ImageLoader(this.loadingManager);
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    return this.loader = new THREE.XHRLoader(this.loadingManager);
  };

  Cover.prototype.load = function(playlist) {
    var j, len, track;
    this.playlist = playlist;
    for (j = 0, len = playlist.length; j < len; j++) {
      track = playlist[j];
      this.imageLoader.load('resources/covers/' + track.cover, (function(_this) {
        return function(image) {
          return true;
        };
      })(this));
    }
    this.loader.load('assets/shaders/cover.frag', (function(_this) {
      return function(content) {
        return true;
      };
    })(this));
    this.loader.load('assets/shaders/cover.vert', (function(_this) {
      return function(content) {
        return true;
      };
    })(this));
    return this.loader.load('assets/shaders/gaussian_blur.frag', (function(_this) {
      return function(content) {
        return true;
      };
    })(this));
  };

  Cover.prototype._setupPlane = function() {
    var fragmentShader, material, vertexShader;
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
        texture2: {
          type: 't',
          value: new THREE.Texture()
        },
        texture3: {
          type: 't',
          value: new THREE.Texture()
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2()
        },
        aTime: {
          type: 'f',
          value: 0
        },
        tFade: {
          type: 'f',
          value: 0
        },
        tScale: {
          type: 'f',
          value: 1
        },
        ratio: {
          type: 'v2',
          value: new THREE.Vector2()
        }
      },
      attributes: {
        T1Coords: {
          type: 'v2',
          value: []
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    this.plane.position.z = -1;
    this.add(this.plane);
    HELPER.trigger(SPACE.Cover.TEXTURES_LOADED);
    this.loadingManager.onLoad = this._textureLoaded;
    this.textureLoader.load('resources/covers/' + this.playlist[0].cover, (function(_this) {
      return function(texture) {
        return _this.texture0 = texture;
      };
    })(this));
    return this.textureLoader.load('resources/covers/' + this.playlist[1].cover, (function(_this) {
      return function(texture) {
        return _this.texture1 = texture;
      };
    })(this));
  };

  Cover.prototype._textureLoaded = function(a, b, c) {
    if (this.texture0 && this.texture1) {
      this.setCovers(this.texture0, this.texture1);
      return this.texture0 = this.texture1 = null;
    }
  };

  Cover.prototype.setCovers = function(current, next) {
    this.tFade = 1;
    this.tScale = 0.75;
    this.plane.material.uniforms.tScale.value = this.tScale;
    this.plane.material.uniforms.tFade.value = this.tFade;
    this.plane.material.uniforms.texture0.value = current;
    this.plane.material.uniforms.texture1.value = next;
    this._setSizeFromTextures(current, next);
    return this._otherCompute(current, next);
  };

  Cover.prototype.resize = function() {
    var t0, t1;
    t0 = this.plane.material.uniforms.texture0.value;
    t1 = this.plane.material.uniforms.texture1.value;
    return this._setSizeFromTextures(t0, t1);
  };

  Cover.prototype._setSizeFromTextures = function(texture0, texture1) {
    var aspect, distance, fov, height, manager, ratio, texture0Height, texture0Width, width;
    texture0Width = texture0.image.width;
    texture0Height = texture0.image.height;
    manager = SPACE.SceneManager;
    fov = manager.camera.fov / 180 * Math.PI;
    aspect = texture0Width / texture0Height;
    distance = manager.camera.position.z + 1;
    ratio = Math.max(1, manager.camera.aspect / aspect);
    width = 2 * aspect * Math.tan(fov / 2) * distance * ratio;
    height = 2 * Math.tan(fov / 2) * distance * ratio;
    this.plane.material.uniforms.resolution.value.x = width;
    this.plane.material.uniforms.resolution.value.y = height;
    return this.plane.scale.set(width, height, 1);
  };

  Cover.prototype._otherCompute = function(texture0, texture1) {
    var coords, ratio, texture0Height, texture0Width, texture1Height, texture1Width, v0, v1, v2, v3;
    texture0Width = texture0.image.width;
    texture0Height = texture0.image.height;
    texture1Width = texture1.image.width;
    texture1Height = texture1.image.height;
    texture1Height = (texture1Height * texture0Width) / texture1Width;
    texture1Width = texture0Width;
    ratio = (1.0 - (texture1Height / texture0Height)) * 0.5;
    v0 = new THREE.Vector2(0, 0.0 - ratio);
    v1 = new THREE.Vector2(0, 1.0 + ratio);
    v2 = new THREE.Vector2(1.0, 1.0 + ratio);
    v3 = new THREE.Vector2(1.0, 0.0 - ratio);
    coords = this.plane.material.attributes.T1Coords.value;
    coords[0] = v1;
    coords[1] = v2;
    coords[2] = v0;
    coords[3] = v3;
    this.plane.material.attributes.T1Coords.value = coords;
    this.plane.material.attributes.T1Coords.needsUpdate = true;
    this._prepareRTT();
    this.plane.material.uniforms.texture2.value = this.rt0;
    this.plane.material.uniforms.texture3.value = this.rt1;
    this._renderToTexture(texture0.image.src, this.rt0);
    return this._renderToTexture(texture1.image.src, this.rt1);
  };

  Cover.prototype.next = function() {
    $(this.plane.material.uniforms.tScale).animate({
      value: 0.9
    }, 350);
    $(this.plane.material.uniforms.tFade).animate({
      value: 0.0
    }, 350);
    return setTimeout(this._eTransitionEnded, 350);
  };

  Cover.prototype.update = function(delta) {
    if (this.plane) {
      return this.plane.material.uniforms.aTime.value += delta * 0.001;
    }
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

  Cover.prototype._prepareRTT = function() {
    var height, material, t0, width;
    t0 = this.plane.material.uniforms.texture0.value;
    width = this.plane.material.uniforms.resolution.value.x;
    height = this.plane.material.uniforms.resolution.value.y;
    this.cameraRTT = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.cameraRTT.position.setZ(600);
    this.sceneRTT = new THREE.Scene();
    this.rt0 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat
    });
    this.rt1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat
    });
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

//# sourceMappingURL=data:application/json;base64,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Q0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQyxFQURnQjtFQUFBLENBM1JsQixDQUFBOztlQUFBOztHQUZ3QixLQUFLLENBQUMsTUFucERoQyxDQUFBOztBQUFBLENBKzdEQyxTQUFBLEdBQUE7QUFDQyxNQUFBLHFCQUFBO0FBQUEsRUFBQSxNQUFBLEdBQVMsQ0FBQyxXQUFELENBQVQsQ0FBQTtBQUFBLEVBRUEsS0FBSyxDQUFDLFlBQU4sR0FBeUIsSUFBQSxLQUFLLENBQUMsWUFBTixDQUFBLENBRnpCLENBQUE7QUFHQSxPQUFBLHdDQUFBO3NCQUFBO0FBQ0UsSUFBQSxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQW5CLENBQStCLEtBQS9CLENBQUEsQ0FERjtBQUFBLEdBSEE7U0FNQSxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQW5CLENBQTZCLFdBQTdCLEVBUEQ7QUFBQSxDQUFELENBQUEsQ0FBQSxDQS83REEsQ0FBQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiU1BBQ0UgPSBTUEFDRSB8fCB7fVxuXG5TUEFDRS5FTlYgICAgICAgID0gJ2RldmVsb3BtZW50J1xuXG4jIFBJWEkuSlNcblNQQUNFLkZQUyAgICAgICAgPSAzMFxuU1BBQ0UucGl4ZWxSYXRpbyA9ICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKVxuXG4jIFRIUkVFLkpTXG5TUEFDRS5USFJFRSA9IHt9XG5cbiMgU09VTkRDTE9VRFxuU1BBQ0UuU0MgPSAoLT5cbiAgb2JqZWN0ID0ge31cbiAgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcbiAgICBvYmplY3QuaWQgPSAnZGUwYjg1MzliNGFkMmY2Y2MyM2RmZTFjYzZlMDQzOGQnXG4gIGVsc2VcbiAgICBvYmplY3QuaWQgPSAnODA3ZDI4NTc1YzM4NGU2MmE1OGJlNWMzYTE0NDZlNjgnXG4gIG9iamVjdC5yZWRpcmVjdF91cmkgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gIHJldHVybiBvYmplY3RcbikoKVxuXG5cbiMgTUVUSE9EU1xuU1BBQ0UuTE9HICAgICAgICA9IChsb2csIHN0eWxlcz0nJyktPlxuICB1bmxlc3MgLyhwcm9kfHByb2R1Y3Rpb24pLy50ZXN0KFNQQUNFLkVOVilcbiAgICAgIGRhdGUgICAgID0gbmV3IERhdGUoKVxuICAgICAgdGltZVN0ciAgPSBkYXRlLnRvVGltZVN0cmluZygpXG4gICAgICB0aW1lU3RyICA9IHRpbWVTdHIuc3Vic3RyKDAsIDgpXG4gICAgICBkYXRlU3RyICA9IGRhdGUuZ2V0RGF0ZSgpICsgJy8nXG4gICAgICBkYXRlU3RyICs9IChkYXRlLmdldE1vbnRoKCkrMSkgKyAnLydcbiAgICAgIGRhdGVTdHIgKz0gZGF0ZS5nZXRGdWxsWWVhcigpXG4gICAgICBjb25zb2xlLmxvZyhkYXRlU3RyKycgLSAnK3RpbWVTdHIrJyB8ICcrbG9nLCBzdHlsZXMpXG5cblNQQUNFLlRPRE8gICAgICAgPSAobWVzc2FnZSktPlxuICBTUEFDRS5MT0coJyVjVE9ETyB8ICcgKyBtZXNzYWdlLCAnY29sb3I6ICMwMDg4RkYnKVxuXG5TUEFDRS5BU1NFUlQgICAgID0gKGNvbmRpdGlvbiwgYWN0aW9uKS0+XG4gIGFjdGlvbigpIGlmIGNvbmRpdGlvblxuICByZXR1cm4gY29uZGl0aW9uXG5cblxuSlVLRUJPWCA9XG4gIFRSQUNLX09OX0FERDogbmV3IEV2ZW50KCdqdWtlYm94X3RyYWNrX29uX2FkZCcpXG4gIFRSQUNLX0FEREVEOiAgbmV3IEV2ZW50KCdqdWtlYm94X3RyYWNrX2FkZGVkJylcbiAgT05fUExBWTogICAgICBuZXcgRXZlbnQoJ2p1a2Vib3hfb25fcGxheScpXG4gIE9OX1NUT1A6ICAgICAgbmV3IEV2ZW50KCdqdWtlYm94X29uX3N0b3AnKVxuICBJU19QTEFZSU5HOiAgIG5ldyBFdmVudCgnanVrZWJveF9pc19wbGF5aW5nJylcbiAgSVNfU1RPUFBFRDogICBuZXcgRXZlbnQoJ2p1a2Vib3hfaXNfc3RvcHBlZCcpXG4gIElTX1NFQVJDSElORzogbmV3IEV2ZW50KCdqdWtlYm94X2lzX3NlYXJjaGluZycpXG5PYmplY3QuZnJlZXplKEpVS0VCT1gpXG5cblRSQUNLID1cbiAgSVNfUExBWUlORzogbmV3IEV2ZW50KCd0cmFja19pc19wbGF5aW5nJylcbiAgSVNfUEFVU0VEOiAgbmV3IEV2ZW50KCd0cmFja19pc19wYXVzZWQnKVxuICBJU19TVE9QUEVEOiBuZXcgRXZlbnQoJ3RyYWNrX2lzX3N0b3BwZWQnKVxuT2JqZWN0LmZyZWV6ZShUUkFDSylcblxuXG5LZXlib2FyZCA9XG4gIEVOVEVSOiAgMTNcbiAgVVA6ICAgICAzOFxuICBET1dOOiAgIDQwXG4gIEVTQzogICAgMjdcbiAgREVMRVRFOiA0NlxuXG5TcGFjZXNoaXBTdGF0ZSA9XG4gIElETEU6ICAgICAnaWRsZSdcbiAgTEFVTkNIRUQ6ICdsYXVuY2hlZCdcbiAgSU5fTE9PUDogICdpbl9sb29wJ1xuICBBUlJJVkVEOiAgJ2Fycml2ZWQnXG5cblNlYXJjaEVuZ2luZVN0YXRlID1cbiAgT1BFTkVEOiAnb3BlbmVkJ1xuICBDTE9TRUQ6ICdjbG9zZWQnXG4gIFNFQVJDSDogJ3NlYXJjaCdcbiAgVFJBQ0tfU0VMRUNURUQ6ICd0cmFja19zZWxlY3RlZCdcblxuSnVrZWJveFN0YXRlID1cbiAgSVNfUExBWUlORzogJ2lzX3BsYXlpbmcnXG4gIElTX1NUT1BQRUQ6ICdpc19zdG9wcGVkJ1xuXG5BaXJwb3J0U3RhdGUgPVxuICBJRExFOiAnaWRsZSdcbiAgU0VORElORzogJ3NlbmRpbmcnXG5cbk9iamVjdC5mcmVlemUoS2V5Ym9hcmQpXG5PYmplY3QuZnJlZXplKFNwYWNlc2hpcFN0YXRlKVxuT2JqZWN0LmZyZWV6ZShTZWFyY2hFbmdpbmVTdGF0ZSlcbk9iamVjdC5mcmVlemUoSnVrZWJveFN0YXRlKVxuT2JqZWN0LmZyZWV6ZShBaXJwb3J0U3RhdGUpXG5cblxud2luZG93LkhFTFBFUiA9IHdpbmRvdy5IRUxQRVIgfHxcbiAgZXZlbnRzOiB7fVxuXG4gIHRyaWdnZXI6IChldmVudG5hbWUsIG9iamVjdCktPlxuICAgIGNvbnNvbGUubG9nIGV2ZW50bmFtZVxuICAgIHVubGVzcyBAZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50bmFtZSlcbiAgICAgIEBldmVudHNbZXZlbnRuYW1lXSA9IG5ldyBFdmVudChldmVudG5hbWUpXG5cbiAgICBlID0gQGV2ZW50c1tldmVudG5hbWVdXG4gICAgZS5vYmplY3QgPSBvYmplY3RcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGUpXG5cbiAgcmV0aW5hOiAodmFsdWUpLT5cbiAgICBpZiB0eXBlb2YgdmFsdWUgaXMgJ29iamVjdCdcbiAgICAgIG9iamVjdCA9IHZhbHVlXG4gICAgICBvID0ge31cbiAgICAgIGZvciBrZXkgb2Ygb2JqZWN0XG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV1cbiAgICAgICAgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICAgICAgb1trZXldID0gdmFsdWUgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb1xuICAgICAgcmV0dXJuIEBtZXJnZShvYmplY3QsIG8pXG4gICAgZWxzZSBpZiB0eXBlb2YgdmFsdWUgaXMgJ2FycmF5J1xuICAgICAgYXJyYXkgPSB2YWx1ZVxuICAgICAgYSA9IFtdXG4gICAgICBmb3IgdmFsdWUsIGtleSBpbiBhcnJheVxuICAgICAgICBpZiB0eXBlb2YgdmFsdWUgaXMgJ251bWJlcidcbiAgICAgICAgICBhLnB1c2godmFsdWUgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGEucHVzaCh2YWx1ZSlcbiAgICAgIHJldHVybiBhXG4gICAgZWxzZSBpZiB0eXBlb2YgdmFsdWUgaXMgJ251bWJlcidcbiAgICAgIHJldHVybiB2YWx1ZSAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvXG4gICAgcmV0dXJuIGZhbHNlXG5cblxuX0NvZmZlZSA9IF9Db2ZmZWUgfHwge1xuICAjIEFycmF5XG4gIHNodWZmbGU6IChhcnJheSktPlxuICAgIHRtcFxuICAgIGN1cnIgPSBhcnJheS5sZW5ndGhcbiAgICB3aGlsZSAwICE9IGN1cnJcbiAgICAgIHJhbmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyKVxuICAgICAgY3VyciAtPSAxXG4gICAgICB0bXAgICAgICAgICA9IGFycmF5W2N1cnJdXG4gICAgICBhcnJheVtjdXJyXSA9IGFycmF5W3JhbmRdXG4gICAgICBhcnJheVtyYW5kXSA9IHRtcFxuICAgIHJldHVybiBhcnJheVxuXG4gICMgT2JqZWN0XG4gIG1lcmdlOiAob3B0aW9ucywgb3ZlcnJpZGVzKSAtPlxuICAgIEBleHRlbmQgKEBleHRlbmQge30sIG9wdGlvbnMpLCBvdmVycmlkZXNcblxuICBleHRlbmQ6IChvYmplY3QsIHByb3BlcnRpZXMpIC0+XG4gICAgZm9yIGtleSwgdmFsIG9mIHByb3BlcnRpZXNcbiAgICAgIG9iamVjdFtrZXldID0gdmFsXG4gICAgb2JqZWN0XG59XG5cblxuX01hdGggPSBfTWF0aCB8fCB7XG4gIGFuZ2xlQmV0d2VlblBvaW50czogKGZpcnN0LCBzZWNvbmQpIC0+XG4gICAgaGVpZ2h0ID0gc2Vjb25kLnkgLSBmaXJzdC55XG4gICAgd2lkdGggID0gc2Vjb25kLnggLSBmaXJzdC54XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoaGVpZ2h0LCB3aWR0aClcblxuICBkaXN0YW5jZTogKHBvaW50MSwgcG9pbnQyKSAtPlxuICAgIHggPSBwb2ludDEueCAtIHBvaW50Mi54XG4gICAgeSA9IHBvaW50MS55IC0gcG9pbnQyLnlcbiAgICBkID0geCAqIHggKyB5ICogeVxuICAgIHJldHVybiBNYXRoLnNxcnQoZClcblxuICBjb2xsaXNpb246IChkb3QxLCBkb3QyKS0+XG4gICAgcjEgPSBpZiBkb3QxLnJhZGl1cyB0aGVuIGRvdDEucmFkaXVzIGVsc2UgMFxuICAgIHIyID0gaWYgZG90Mi5yYWRpdXMgdGhlbiBkb3QyLnJhZGl1cyBlbHNlIDBcbiAgICBkaXN0ID0gcjEgKyByMlxuXG4gICAgcmV0dXJuIEBkaXN0YW5jZShkb3QxLnBvc2l0aW9uLCBkb3QyLnBvc2l0aW9uKSA8PSBNYXRoLnNxcnQoZGlzdCAqIGRpc3QpXG5cbiAgbWFwOiAodmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikgLT5cbiAgICByZXR1cm4gbG93MiArIChoaWdoMiAtIGxvdzIpICogKHZhbHVlIC0gbG93MSkgLyAoaGlnaDEgLSBsb3cxKVxuXG4gICMgSGVybWl0ZSBDdXJ2ZVxuICBoZXJtaXRlOiAoeTAsIHkxLCB5MiwgeTMsIG11LCB0ZW5zaW9uLCBiaWFzKS0+XG4gICAgYFxuICAgIHZhciBtMCxtMSxtdTIsbXUzO1xuICAgIHZhciBhMCxhMSxhMixhMztcblxuICAgIG11MiA9IG11ICogbXU7XG4gICAgbXUzID0gbXUyICogbXU7XG4gICAgbTAgID0gKHkxLXkwKSooMStiaWFzKSooMS10ZW5zaW9uKS8yO1xuICAgIG0wICs9ICh5Mi15MSkqKDEtYmlhcykqKDEtdGVuc2lvbikvMjtcbiAgICBtMSAgPSAoeTIteTEpKigxK2JpYXMpKigxLXRlbnNpb24pLzI7XG4gICAgbTEgKz0gKHkzLXkyKSooMS1iaWFzKSooMS10ZW5zaW9uKS8yO1xuICAgIGEwID0gIDIqbXUzIC0gMyptdTIgKyAxO1xuICAgIGExID0gICAgbXUzIC0gMiptdTIgKyBtdTtcbiAgICBhMiA9ICAgIG11MyAtICAgbXUyO1xuICAgIGEzID0gLTIqbXUzICsgMyptdTI7XG4gICAgYFxuICAgIHJldHVybihhMCp5MSthMSptMCthMiptMSthMyp5Milcbn1cblxuXG5fVEhSRUUgPSBfVEhSRUUgfHwge1xuICBIZXJtaXRlQ3VydmU6IChwdHMpLT5cbiAgICBwYXRoID0gbmV3IFRIUkVFLkN1cnZlUGF0aCgpXG4gICAgcGF0aC5hZGQobmV3IFRIUkVFLkhlcm1pdGVCZXppZXJDdXJ2ZTMocHRzWzBdLCBwdHNbMF0sIHB0c1sxXSwgcHRzWzJdKSlcbiAgICBmb3IgaSBpbiBbMC4uKHB0cy5sZW5ndGgtNCldXG4gICAgICBwYXRoLmFkZChuZXcgVEhSRUUuSGVybWl0ZUJlemllckN1cnZlMyhwdHNbaV0sIHB0c1tpKzFdLCBwdHNbaSsyXSwgcHRzW2krM10pKVxuICAgIHBhdGguYWRkKG5ldyBUSFJFRS5IZXJtaXRlQmV6aWVyQ3VydmUzKHB0c1twdHMubGVuZ3RoLTNdLCBwdHNbcHRzLmxlbmd0aC0yXSwgcHRzW3B0cy5sZW5ndGgtMV0sIHB0c1twdHMubGVuZ3RoLTFdKSlcbiAgICByZXR1cm4gcGF0aFxufVxuXG5USFJFRS5DdXJ2ZS5VdGlscy50YW5nZW50SGVybWl0ZUJlemllciA9ICggeTAsIHkxLCB5MiwgeTMsIG11LCB0ZW5zaW9uLCBiaWFzICktPlxuICAgIG11MiA9IG11ICogbXVcbiAgICBtdTMgPSBtdTIgKiBtdVxuXG4gICAgbTAgID0gKHkxLXkwKSooMStiaWFzKSooMS10ZW5zaW9uKS8yXG4gICAgbTAgICs9ICh5Mi15MSkqKDEtYmlhcykqKDEtdGVuc2lvbikvMlxuXG4gICAgbTEgID0gKHkyLXkxKSooMStiaWFzKSooMS10ZW5zaW9uKS8yXG4gICAgbTEgICs9ICh5My15MikqKDEtYmlhcykqKDEtdGVuc2lvbikvMlxuXG4gICAgYTAgID0gIDIqbXUzIC0gMyptdTIgKyAxXG4gICAgYTEgID0gICAgbXUzIC0gMiptdTIgKyBtdVxuICAgIGEyICA9ICAgIG11MyAtICAgbXUyXG4gICAgYTMgID0gLTIqbXUzICsgMyptdTJcblxuICAgIHJldHVybihhMCp5MSthMSptMCthMiptMSthMyp5MilcblxuVEhSRUUuSGVybWl0ZUJlemllckN1cnZlMyA9IFRIUkVFLkN1cnZlLmNyZWF0ZShcbiAgKHYwLCB2MSwgdjIsIHYzKS0+XG4gICAgQHYwID0gdjBcbiAgICBAdjEgPSB2MVxuICAgIEB2MiA9IHYyXG4gICAgQHYzID0gdjNcbiAgICByZXR1cm5cbiAgLCAodCktPlxuICAgIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICB2ZWN0b3IueCA9IFRIUkVFLkN1cnZlLlV0aWxzLnRhbmdlbnRIZXJtaXRlQmV6aWVyKEB2MC54LCBAdjEueCwgQHYyLngsIEB2My54LCB0LCAwLCAwKVxuICAgIHZlY3Rvci55ID0gVEhSRUUuQ3VydmUuVXRpbHMudGFuZ2VudEhlcm1pdGVCZXppZXIoQHYwLnksIEB2MS55LCBAdjIueSwgQHYzLnksIHQsIDAsIDApXG4gICAgdmVjdG9yLnogPSBUSFJFRS5DdXJ2ZS5VdGlscy50YW5nZW50SGVybWl0ZUJlemllcihAdjAueiwgQHYxLnosIEB2Mi56LCBAdjMueiwgdCwgMCwgMClcbiAgICByZXR1cm4gdmVjdG9yXG4pXG5cblRIUkVFLkluTG9vcEN1cnZlID0gVEhSRUUuQ3VydmUuY3JlYXRlKFxuICAodjAsIHN0YXJ0QW5nbGU9MCwgbWF4UmFkaXVzPTEwMCwgbWluUmFkaXVzPTAsIGludmVyc2U9ZmFsc2UsIHVzZUdvbGRlbj1mYWxzZSktPlxuICAgIEB2MCAgICAgICAgID0gdjBcbiAgICBAaW52ZXJzZSAgICA9IGludmVyc2VcbiAgICBAc3RhcnRBbmdsZSA9IHN0YXJ0QW5nbGVcblxuICAgIEBtYXhSYWRpdXMgID0gbWF4UmFkaXVzXG4gICAgQG1pblJhZGl1cyAgPSBtaW5SYWRpdXNcbiAgICBAcmFkaXVzICAgICA9IEBtYXhSYWRpdXMgLSBAbWluUmFkaXVzXG5cbiAgICBAdXNlR29sZGVuICA9IHVzZUdvbGRlblxuXG4gICAgcmV0dXJuXG4gICwgKHQpLT5cbiAgICB0ICAgICA9IDEgLSB0IGlmIEBpbnZlcnNlXG4gICAgaWYgQHVzZUdvbGRlblxuICAgICAgICBwaGkgICA9IChNYXRoLnNxcnQoNSkrMSkvMiAtIDFcbiAgICAgICAgZ29sZGVuX2FuZ2xlID0gcGhpICogTWF0aC5QSSAqIDJcbiAgICAgICAgYW5nbGUgPSBAc3RhcnRBbmdsZSArIChnb2xkZW5fYW5nbGUgKiB0KVxuICAgICAgICBhbmdsZSArPSBNYXRoLlBJICogLTEuMjM1XG4gICAgZWxzZVxuICAgICAgICBhbmdsZSA9IEBzdGFydEFuZ2xlICsgKE1hdGguUEkgKiAyICogdClcblxuICAgIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICB2ZWN0b3IueCA9IEB2MC54ICsgTWF0aC5jb3MoYW5nbGUpICogKEBtaW5SYWRpdXMgKyBAcmFkaXVzICogdClcbiAgICB2ZWN0b3IueSA9IEB2MC55ICsgTWF0aC5zaW4oYW5nbGUpICogKEBtaW5SYWRpdXMgKyBAcmFkaXVzICogdClcbiAgICB2ZWN0b3IueiA9IEB2MC56XG4gICAgcmV0dXJuIHZlY3RvclxuKVxuXG5USFJFRS5MYXVuY2hlZEN1cnZlID0gVEhSRUUuQ3VydmUuY3JlYXRlKFxuICAodjAsIHYxLCBuYkxvb3A9MiktPlxuICAgIEB2MCAgID0gdjBcbiAgICBAdjEgICA9IHYxXG4gICAgQG5iTG9vcCA9IG5iTG9vcFxuICAgIHJldHVyblxuICAsICh0KS0+XG4gICAgYW5nbGUgPSBNYXRoLlBJICogMiAqIHQgKiBAbmJMb29wXG5cbiAgICBkID0gQHYxLnogLSBAdjAuelxuXG4gICAgZGlzdCA9IEB2MS5jbG9uZSgpLnN1YihAdjApXG5cbiAgICB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgdmVjdG9yLnggPSBAdjAueCArIGRpc3QueCAqIHRcbiAgICB2ZWN0b3IueSA9IEB2MC55ICsgZGlzdC55ICogdFxuICAgIHZlY3Rvci56ID0gQHYwLnogKyBkaXN0LnogKiB0XG5cbiAgICB0ID0gTWF0aC5taW4odCwgMSAtIHQpIC8gLjVcblxuICAgIHZlY3Rvci54ICs9IE1hdGguY29zKGFuZ2xlKSAqICg1MCAqIHQpXG4gICAgdmVjdG9yLnkgKz0gTWF0aC5zaW4oYW5nbGUpICogKDUwICogdClcblxuICAgIHJldHVybiB2ZWN0b3JcbilcblxuXG5fRWFzaW5nID0gX0Vhc2luZyB8fCB7XG5cbiAgI1xuICAjICBFYXNpbmcgZnVuY3Rpb24gaW5zcGlyZWQgZnJvbSBBSEVhc2luZ1xuICAjICBodHRwczovL2dpdGh1Yi5jb20vd2FycmVubS9BSEVhc2luZ1xuICAjXG5cbiAgIyMgTW9kZWxlZCBhZnRlciB0aGUgbGluZSB5ID0geFxuICBsaW5lYXI6IChwKS0+XG4gICAgcmV0dXJuIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBhcmFib2xhIHkgPSB4XjJcbiAgUXVhZHJhdGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcFxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGFyYWJvbGEgeSA9IC14XjIgKyAyeFxuICBRdWFkcmF0aWNFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiAtKHAgKiAocCAtIDIpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIHF1YWRyYXRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjIpICAgICAgICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gLSgxLzIpKCgyeC0xKSooMngtMykgLSAxKSA7IFswLjUsIDFdXG4gIFF1YWRyYXRpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDIgKiBwICogcFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoLTIgKiBwICogcCkgKyAoNCAqIHApIC0gMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgY3ViaWMgeSA9IHheM1xuICBDdWJpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBjdWJpYyB5ID0gKHggLSAxKV4zICsgMVxuICBDdWJpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSlcbiAgICByZXR1cm4gZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIGN1YmljXG4gICMgeSA9ICgxLzIpKCgyeCleMykgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKSgoMngtMileMyArIDIpIDsgWzAuNSwgMV1cbiAgQ3ViaWNFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiA0ICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9ICgoMiAqIHApIC0gMilcbiAgICAgIHJldHVybiAwLjUgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHheNFxuICBRdWFydGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHkgPSAxIC0gKHggLSAxKV40XG4gIFF1YXJ0aWNFYXNlT3V0OiAocCktPlxuICAgIGYgPSAocCAtIDEpXG4gICAgcmV0dXJuIGYgKiBmICogZiAqICgxIC0gcCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgcXVhcnRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjQpICAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9IC0oMS8yKSgoMngtMileNCAtIDIpIDsgWzAuNSwgMV1cbiAgUXVhcnRpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDggKiBwICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9IChwIC0gMSlcbiAgICAgIHJldHVybiAtOCAqIGYgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWludGljIHkgPSB4XjVcbiAgUXVpbnRpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwICogcCAqIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1aW50aWMgeSA9ICh4IC0gMSleNSArIDFcbiAgUXVpbnRpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSk7XG4gICAgcmV0dXJuIGYgKiBmICogZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIHF1aW50aWNcbiAgIyB5ID0gKDEvMikoKDJ4KV41KSAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKCgyeC0yKV41ICsgMikgOyBbMC41LCAxXVxuICBRdWludGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMTYgKiBwICogcCAqIHAgKiBwICogcFxuICAgIGVsc2VcbiAgICAgIGYgPSAoKDIgKiBwKSAtIDIpXG4gICAgICByZXR1cm4gIDAuNSAqIGYgKiBmICogZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciBxdWFydGVyLWN5Y2xlIG9mIHNpbmUgd2F2ZVxuICBTaW5lRWFzZUluOiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigocCAtIDEpICogTWF0aC5QSSAqIDIpICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciBxdWFydGVyLWN5Y2xlIG9mIHNpbmUgd2F2ZSAoZGlmZmVyZW50IHBoYXNlKVxuICBTaW5lRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gTWF0aC5zaW4ocCAqIE1hdGguUEkgKiAyKVxuXG4gICMgTW9kZWxlZCBhZnRlciBoYWxmIHNpbmUgd2F2ZVxuICBTaW5lRWFzZUluT3V0OiAocCktPlxuICAgIHJldHVybiAwLjUgKiAoMSAtIE1hdGguY29zKHAgKiBNYXRoLlBJKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgc2hpZnRlZCBxdWFkcmFudCBJViBvZiB1bml0IGNpcmNsZVxuICBDaXJjdWxhckVhc2VJbjogKHApLT5cbiAgICByZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gKHAgKiBwKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgc2hpZnRlZCBxdWFkcmFudCBJSSBvZiB1bml0IGNpcmNsZVxuICBDaXJjdWxhckVhc2VPdXQ6IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc3FydCgoMiAtIHApICogcCk7XG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgY2lyY3VsYXIgZnVuY3Rpb25cbiAgIyB5ID0gKDEvMikoMSAtIHNxcnQoMSAtIDR4XjIpKSAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKShzcXJ0KC0oMnggLSAzKSooMnggLSAxKSkgKyAxKSA7IFswLjUsIDFdXG4gIENpcmN1bGFyRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogKDEgLSBNYXRoLnNxcnQoMSAtIDQgKiAocCAqIHApKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMC41ICogKE1hdGguc3FydCgtKCgyICogcCkgLSAzKSAqICgoMiAqIHApIC0gMSkpICsgMSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGV4cG9uZW50aWFsIGZ1bmN0aW9uIHkgPSAyXigxMCh4IC0gMSkpXG4gIEV4cG9uZW50aWFsRWFzZUluOiAocCktPlxuICAgIHJldHVybiBpZiAocCA9PSAwLjApIHRoZW4gcCBlbHNlIE1hdGgucG93KDIsIDEwICogKHAgLSAxKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGV4cG9uZW50aWFsIGZ1bmN0aW9uIHkgPSAtMl4oLTEweCkgKyAxXG4gIEV4cG9uZW50aWFsRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gaWYgKHAgPT0gMS4wKSB0aGVuIHAgZWxzZSAxIC0gTWF0aC5wb3coMiwgLTEwICogcClcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBleHBvbmVudGlhbFxuICAjIHkgPSAoMS8yKTJeKDEwKDJ4IC0gMSkpICAgICAgICAgOyBbMCwwLjUpXG4gICMgeSA9IC0oMS8yKSoyXigtMTAoMnggLSAxKSkpICsgMSA7IFswLjUsMV1cbiAgRXhwb25lbnRpYWxFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA9PSAwLjAgfHwgcCA9PSAxLjApXG4gICAgICByZXR1cm4gcFxuXG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiBNYXRoLnBvdygyLCAoMjAgKiBwKSAtIDEwKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAtMC41ICogTWF0aC5wb3coMiwgKC0yMCAqIHApICsgMTApICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgZGFtcGVkIHNpbmUgd2F2ZSB5ID0gc2luKDEzcGkvMip4KSpwb3coMiwgMTAgKiAoeCAtIDEpKVxuICBFbGFzdGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigxMyAqIE1hdGguUEkgKiAyICogcCkgKiBNYXRoLnBvdygyLCAxMCAqIChwIC0gMSkpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBkYW1wZWQgc2luZSB3YXZlIHkgPSBzaW4oLTEzcGkvMiooeCArIDEpKSpwb3coMiwgLTEweCkgKyAxXG4gIEVsYXN0aWNFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigtMTMgKiBNYXRoLlBJICogMiAqIChwICsgMSkpICogTWF0aC5wb3coMiwgLTEwICogcCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgZXhwb25lbnRpYWxseS1kYW1wZWQgc2luZSB3YXZlOlxuICAjIHkgPSAoMS8yKSpzaW4oMTNwaS8yKigyKngpKSpwb3coMiwgMTAgKiAoKDIqeCkgLSAxKSkgICAgICA7IFswLDAuNSlcbiAgIyB5ID0gKDEvMikqKHNpbigtMTNwaS8yKigoMngtMSkrMSkpKnBvdygyLC0xMCgyKngtMSkpICsgMikgOyBbMC41LCAxXVxuICBFbGFzdGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogTWF0aC5zaW4oMTMgKiBNYXRoLlBJICogMiAqICgyICogcCkpICogTWF0aC5wb3coMiwgMTAgKiAoKDIgKiBwKSAtIDEpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5zaW4oLTEzICogTWF0aC5QSSAqIDIgKiAoKDIgKiBwIC0gMSkgKyAxKSkgKiBNYXRoLnBvdygyLCAtMTAgKiAoMiAqIHAgLSAxKSkgKyAyKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgb3ZlcnNob290aW5nIGN1YmljIHkgPSB4XjMteCpzaW4oeCpwaSlcbiAgQmFja0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwIC0gcCAqIE1hdGguc2luKHAgKiBNYXRoLlBJKVxuXG4gICMgTW9kZWxlZCBhZnRlciBvdmVyc2hvb3RpbmcgY3ViaWMgeSA9IDEtKCgxLXgpXjMtKDEteCkqc2luKCgxLXgpKnBpKSlcbiAgQmFja0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9ICgxIC0gcClcbiAgICByZXR1cm4gMSAtIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIG92ZXJzaG9vdGluZyBjdWJpYyBmdW5jdGlvbjpcbiAgIyB5ID0gKDEvMikqKCgyeCleMy0oMngpKnNpbigyKngqcGkpKSAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKSooMS0oKDEteCleMy0oMS14KSpzaW4oKDEteCkqcGkpKSsxKSA7IFswLjUsIDFdXG4gIEJhY2tFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIGYgPSAyICogcFxuICAgICAgcmV0dXJuIDAuNSAqIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKVxuICAgIGVsc2VcbiAgICAgIGYgPSAoMSAtICgyKnAgLSAxKSlcbiAgICAgIHJldHVybiAwLjUgKiAoMSAtIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKSkgKyAwLjVcblxuICBCb3VuY2VFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIDEgLSBAQm91bmNlRWFzZU91dCgxIC0gcCk7XG5cbiAgQm91bmNlRWFzZU91dDogKHApLT5cbiAgICBpZihwIDwgNC8xMS4wKVxuICAgICAgcmV0dXJuICgxMjEgKiBwICogcCkvMTYuMFxuICAgIGVsc2UgaWYocCA8IDgvMTEuMClcbiAgICAgIHJldHVybiAoMzYzLzQwLjAgKiBwICogcCkgLSAoOTkvMTAuMCAqIHApICsgMTcvNS4wXG4gICAgZWxzZSBpZihwIDwgOS8xMC4wKVxuICAgICAgcmV0dXJuICg0MzU2LzM2MS4wICogcCAqIHApIC0gKDM1NDQyLzE4MDUuMCAqIHApICsgMTYwNjEvMTgwNS4wXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICg1NC81LjAgKiBwICogcCkgLSAoNTEzLzI1LjAgKiBwKSArIDI2OC8yNS4wXG5cbiAgQm91bmNlRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogQEJvdW5jZUVhc2VJbihwKjIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIDAuNSAqIEBCb3VuY2VFYXNlT3V0KHAgKiAyIC0gMSkgKyAwLjVcblxufVxuXG5cbmNsYXNzIFNQQUNFLlNjZW5lIGV4dGVuZHMgVEhSRUUuU2NlbmVcbiAgX3BhdXNlZDogdHJ1ZVxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyXG5cbiAgICBAdHlwZSAgICAgICAgICAgICA9ICdTY2VuZSdcbiAgICBAZm9nICAgICAgICAgICAgICA9IG51bGxcbiAgICBAb3ZlcnJpZGVNYXRlcmlhbCA9IG51bGxcbiAgICBAYXV0b1VwZGF0ZSAgICAgICA9IHRydWVcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cbiAgICAgIEB1cGRhdGVPYmooY2hpbGQsIGRlbHRhKVxuXG4gIHVwZGF0ZU9iajogKG9iaiwgZGVsdGEpLT5cbiAgICBvYmoudXBkYXRlKGRlbHRhKSBpZiB0eXBlb2Ygb2JqLnVwZGF0ZSA9PSAnZnVuY3Rpb24nXG4gICAgaWYgb2JqLmhhc093blByb3BlcnR5KCdjaGlsZHJlbicpIGFuZCBvYmouY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgICAgZm9yIGNoaWxkIGluIG9iai5jaGlsZHJlblxuICAgICAgICBAdXBkYXRlT2JqKGNoaWxkLCBkZWx0YSlcblxuICByZXNpemU6ID0+XG4gICAgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuICAgICAgQHJlc2l6ZU9iaihjaGlsZClcblxuICByZXNpemVPYmo6IChvYmopLT5cbiAgICBvYmoucmVzaXplKCkgaWYgdHlwZW9mIG9iai5yZXNpemUgPT0gJ2Z1bmN0aW9uJ1xuICAgIGlmIG9iai5oYXNPd25Qcm9wZXJ0eSgnY2hpbGRyZW4nKSBhbmQgb2JqLmNoaWxkcmVuLmxlbmd0aCA+IDBcbiAgICAgIGZvciBjaGlsZCBpbiBvYmouY2hpbGRyZW5cbiAgICAgICAgQHJlc2l6ZU9iaihjaGlsZClcblxuICByZXN1bWU6IC0+XG4gICAgQF9wYXVzZWQgPSBmYWxzZVxuXG4gIHBhdXNlOiAtPlxuICAgIEBfcGF1c2VkID0gdHJ1ZVxuXG4gIGlzUGF1c2VkOiAtPlxuICAgIHJldHVybiBAX3BhdXNlZFxuXG5cbmNsYXNzIFNQQUNFLlNjZW5lTWFuYWdlclxuXG4gIGN1cnJlbnRTY2VuZTogbnVsbFxuICBfc2NlbmVzOiBudWxsXG4gIF9zdGF0czogbnVsbFxuICBfY2xvY2s6IG51bGxcblxuICByZW5kZXJlcjogbnVsbFxuICBjYW1lcmE6ICAgbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBfc2V0dXAoKVxuICAgIEBfZXZlbnRzKClcblxuICAgICMgaWYgKEByZW5kZXJlcikgdGhlbiByZXR1cm4gQFxuXG4gICAgIyBAX2Nsb2NrID0gbmV3IFRIUkVFLkNsb2NrKClcblxuICAgICMgQF9zY2VuZXMgICA9IFtdXG5cbiAgICAjIEBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApXG4gICAgIyAjIEBjYW1lcmEucG9zaXRpb24uc2V0Wig2MDApXG4gICAgIyAjIEBjYW1lcmEucG9zaXRpb24uc2V0WSg1MDApXG4gICAgIyAjIEBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApKVxuXG4gICAgIyBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7YW50aWFsaWFzOiB0cnVlfSlcbiAgICAjICMgQHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4NThiMWZmKSlcbiAgICAjIEByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgIyAjIEByZW5kZXJlci5zaGFkb3dNYXBFbmFibGVkID0gdHJ1ZVxuICAgICMgIyBAcmVuZGVyZXIuc2hhZG93TWFwU29mdCAgICA9IHRydWVcbiAgICAjICMgQHJlbmRlcmVyLnNoYWRvd01hcFR5cGUgICAgPSBUSFJFRS5QQ0ZTaGFkb3dNYXBcbiAgICAjIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJykuYXBwZW5kQ2hpbGQoQHJlbmRlcmVyLmRvbUVsZW1lbnQpXG5cbiAgICAjIEBfc2V0dXBTdGF0cygpIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG5cbiAgICAjIEBfcmVuZGVyKClcbiAgICAjICMgQF91cGRhdGUoKVxuXG4gICAgIyAjIHdpbmRvdy5vbnJlc2l6ZSA9ID0+XG4gICAgIyAjICAgQHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiAgICAjICMgICBAY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0XG4gICAgIyAjICAgQGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcblxuICBfc2V0dXA6IC0+XG4gICAgQF9jbG9jayAgPSBuZXcgVEhSRUUuQ2xvY2soKVxuICAgIEBfc2NlbmVzID0gW11cbiAgICBAY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKVxuICAgIEByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pXG4gICAgQHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpLmFwcGVuZENoaWxkKEByZW5kZXJlci5kb21FbGVtZW50KVxuXG4gICAgQF9zZXR1cFN0YXRzKCkgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcbiAgICBAX3JlbmRlcigpXG5cbiAgX2V2ZW50czogLT5cbiAgICB3aW5kb3cub25yZXNpemUgPSBAX2VPblJlc2l6ZVxuXG4gIF9lT25SZXNpemU6ID0+XG4gICAgQHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiAgICBAY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0XG4gICAgQGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcbiAgICBAY3VycmVudFNjZW5lLnJlc2l6ZSgpIGlmIEBjdXJyZW50U2NlbmVcblxuICBfc2V0dXBTdGF0czogLT5cbiAgICBAX3N0YXRzID0gbmV3IFN0YXRzKClcbiAgICBAX3N0YXRzLnNldE1vZGUoMClcbiAgICBAX3N0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gICAgQF9zdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4J1xuICAgIEBfc3RhdHMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4J1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIEBfc3RhdHMuZG9tRWxlbWVudCApXG5cbiAgX3JlbmRlcjogPT5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKEBfcmVuZGVyKVxuXG4gICAgaWYgIUBjdXJyZW50U2NlbmUgb3IgQGN1cnJlbnRTY2VuZS5pc1BhdXNlZCgpXG4gICAgICAgIHJldHVyblxuXG4gICAgQGN1cnJlbnRTY2VuZS51cGRhdGUoQF9jbG9jay5nZXREZWx0YSgpICogMTAwMClcbiAgICBAcmVuZGVyZXIucmVuZGVyKCBAY3VycmVudFNjZW5lLCBAY2FtZXJhIClcblxuICAgIEBfc3RhdHMudXBkYXRlKCkgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcblxuICBjcmVhdGVTY2VuZTogKGlkZW50aWZpZXIpLT5cbiAgICBpZiBAX3NjZW5lc1tpZGVudGlmaWVyXVxuICAgICAgICByZXR1cm4gQF9zY2VuZXNbaWRlbnRpZmllcl1cblxuICAgIHRyeVxuICAgICAgc2NlbmUgPSBuZXcgKGV2YWwoXCJTUEFDRS5cIitpZGVudGlmaWVyKSkoKVxuICAgICAgQF9zY2VuZXNbaWRlbnRpZmllcl0gPSBzY2VuZVxuICAgIGNhdGNoIGVcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgcmV0dXJuIHNjZW5lXG5cbiAgZ29Ub1NjZW5lOiAoaWRlbnRpZmllciktPlxuICAgIGlmIEBfc2NlbmVzW2lkZW50aWZpZXJdXG4gICAgICAgIEBjdXJyZW50U2NlbmUucGF1c2UoKSBpZiBAY3VycmVudFNjZW5lXG4gICAgICAgIEBjdXJyZW50U2NlbmUgPSBAX3NjZW5lc1tpZGVudGlmaWVyXVxuICAgICAgICBAY3VycmVudFNjZW5lLnJlc3VtZSgpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgYWxlcnQoXCJTY2VuZSAnXCIraWRlbnRpZmllcitcIicgZG9lc24ndCBleGlzdFwiKVxuICAgIHJldHVybiBmYWxzZVxuXG5cbmNsYXNzIFNQQUNFLk1haW5TY2VuZSBleHRlbmRzIFNQQUNFLlNjZW5lXG5cbiAgX21hbmFnZXI6IG51bGxcbiAgX2p1a2Vib3g6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlcigpXG5cbiAgcmVzdW1lOiAtPlxuICAgIHN1cGVyKClcblxuICAgIEBfbWFuYWdlciA9IFNQQUNFLlNjZW5lTWFuYWdlclxuXG4gICAgIyBTZXR1cCByZW5kZXJlclxuICAgIEBfbWFuYWdlci5jYW1lcmEucG9zaXRpb24uc2V0Wig2MDApXG4gICAgIyBAX21hbmFnZXIucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbylcbiAgICAjIEBfbWFuYWdlci5yZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDU4YjFmZikpXG4gICAgIyBAX21hbmFnZXIucmVuZGVyZXIuc2hhZG93TWFwRW5hYmxlZCA9IHRydWVcbiAgICAjIEBfbWFuYWdlci5yZW5kZXJlci5zaGFkb3dNYXBTb2Z0ICAgID0gdHJ1ZVxuICAgICMgQF9tYW5hZ2VyLnJlbmRlcmVyLnNoYWRvd01hcFR5cGUgICAgPSBUSFJFRS5QQ0ZTaGFkb3dNYXBcblxuICAgICMgQ3JlYXRlIGEgU0Mgc2luZ2xldG9uXG4gICAgU1BBQ0UuU0MgPSBuZXcgU1BBQ0UuU291bmRDbG91ZChTUEFDRS5TQy5pZCwgU1BBQ0UuU0MucmVkaXJlY3RfdXJpKVxuXG4gICAgQF9ldmVudHMoKVxuICAgIEBfc2V0dXAoKSBpZiBTUEFDRS5TQy5pc0Nvbm5lY3RlZCgpXG5cbiAgcGF1c2U6IC0+XG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFNQQUNFLlNvdW5kQ2xvdWQuSVNfQ09OTkVDVEVELCBAX2VTQ0lzQ29ubmVjdGVkKVxuXG4gIF9lU0NJc0Nvbm5lY3RlZDogPT5cbiAgICBAX3NldHVwKClcblxuICBfc2V0dXA6ID0+XG4gICAgd2luZG93LmZpcnN0TGF1bmNoID0gdHJ1ZVxuXG4gICAgIyBTZXR1cCBKdWtlYm94XG4gICAgQF9qdWtlYm94ID0gbmV3IFNQQUNFLkp1a2Vib3goKVxuICAgICMgQF9qdWtlYm94LmFkZCgnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9ib24tZW50ZW5kZXVyLW11c2ljL2xhZmllcnRlJylcblxuICAgICMgU2V0dXAgZXF1YWxpemVyc1xuICAgIHNtYWxsID0gbmV3IFNQQUNFLkVxdWFsaXplcih7XG4gICAgICBtaW5MZW5ndGg6IDBcbiAgICAgIG1heExlbmd0aDogMjAwXG4gICAgICByYWRpdXM6IDMwMFxuICAgICAgY29sb3I6IDB4RkZGRkZGXG4gICAgICBhYnNvbHV0ZTogZmFsc2VcbiAgICAgIGxpbmVGb3JjZURvd246IC41XG4gICAgICBsaW5lRm9yY2VVcDogMVxuICAgICAgaW50ZXJwb2xhdGlvblRpbWU6IDI1MFxuICAgIH0pXG4gICAgQGFkZChzbWFsbClcblxuICAgIGJpZyA9IG5ldyBTUEFDRS5FcXVhbGl6ZXIoe1xuICAgICAgbWluTGVuZ3RoOiAwXG4gICAgICBtYXhMZW5ndGg6IDUwXG4gICAgICByYWRpdXM6IDMwMFxuICAgICAgY29sb3I6IDB4RDFEMUQxXG4gICAgICBhYnNvbHV0ZTogZmFsc2VcbiAgICAgIGxpbmVGb3JjZURvd246IC41XG4gICAgICBsaW5lRm9yY2VVcDogMVxuICAgICAgaW50ZXJwb2xhdGlvblRpbWU6IDI1MFxuICAgIH0pXG4gICAgQGFkZChiaWcpXG5cbiAgICAjIFNldHVwIGNvdmVyXG4gICAgQGNvdmVyID0gbmV3IFNQQUNFLkNvdmVyKClcbiAgICBAYWRkKEBjb3ZlcilcblxuICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmVxLm9wZW4oJ0dFVCcsICdyZXNvdXJjZXMvcGxheWxpc3QuanNvbicsIHRydWUpXG4gICAgcmVxLm9ubG9hZCA9IChlKT0+XG4gICAgICBAcGxheWxpc3QgPSBKU09OLnBhcnNlKGUudGFyZ2V0LnJlc3BvbnNlKVxuICAgICAgQGNvdmVyLmxvYWQoQHBsYXlsaXN0KVxuICAgIHJlcS5zZW5kKClcblxuXG5jbGFzcyBTUEFDRS5Tb3VuZENsb3VkXG5cbiAgY2xpZW50X2lkOiAgICBudWxsXG4gIHJlZGlyZWN0X3VyaTogbnVsbFxuICB0b2tlbjogICAgICAgIG51bGxcblxuICBASVNfQ09OTkVDVEVEOiAnc291bmRjbG91ZF9jb25uZWN0ZWQnIygtPiByZXR1cm4gbmV3IEV2ZW50KCdzb3VuZGNsb3VkX2Nvbm5lY3RlZCcpKSgpXG5cbiAgY29uc3RydWN0b3I6IChpZCwgcmVkaXJlY3RfdXJpKS0+XG4gICAgU0MuaW5pdGlhbGl6ZSh7XG4gICAgICBjbGllbnRfaWQ6IGlkXG4gICAgICByZWRpcmVjdF91cmk6IHJlZGlyZWN0X3VyaVxuICAgIH0pXG5cbiAgICBAY2xpZW50X2lkICAgID0gaWRcbiAgICBAcmVkaXJlY3RfdXJpID0gcmVkaXJlY3RfdXJpXG5cbiAgICBpZiBub3QgQGlzQ29ubmVjdGVkKCkgYW5kIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG4gICAgICBkb2N1bWVudC5jb29raWUgPSBcInNvdW5kY2xvdWRfdG9rZW49MS04MDI2OS0xMTQ1NzExNi0wNDAyOWExNGJkZmMyODZcIlxuICAgICAgZG9jdW1lbnQuY29va2llID0gXCJzb3VuZGNsb3VkX2Nvbm5lY3RlZD10cnVlXCJcblxuICBpc0Nvbm5lY3RlZDogLT5cbiAgICBpZiAoZG9jdW1lbnQuY29va2llLnJlcGxhY2UoLyg/Oig/Ol58Lio7XFxzKilzb3VuZGNsb3VkX2Nvbm5lY3RlZFxccypcXD1cXHMqKFteO10qKS4qJCl8Xi4qJC8sIFwiJDFcIikgIT0gXCJ0cnVlXCIpXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW4nKS5jbGFzc0xpc3QuYWRkKCdzaG93JylcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgQF9lQ2xpY2spXG4gICAgZWxzZVxuICAgICAgQHRva2VuID0gZG9jdW1lbnQuY29va2llLnJlcGxhY2UoLyg/Oig/Ol58Lio7XFxzKilzb3VuZGNsb3VkX3Rva2VuXFxzKlxcPVxccyooW147XSopLiokKXxeLiokLywgXCIkMVwiKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICBfZUNsaWNrOiA9PlxuICAgIFNDLmNvbm5lY3QoPT5cbiAgICAgIEB0b2tlbiAgICAgICAgICA9IFNDLmFjY2Vzc1Rva2VuKClcbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IFwic291bmRjbG91ZF90b2tlbj1cIiArIEB0b2tlblxuICAgICAgZG9jdW1lbnQuY29va2llID0gXCJzb3VuZGNsb3VkX2Nvbm5lY3RlZD10cnVlXCJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbicpLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxuICAgICAgSEVMUEVSLnRyaWdnZXIoU1BBQ0UuU291bmRDbG91ZC5JU19DT05ORUNURUQpXG4gICAgKVxuXG4gIHBhdGhPclVybDogKHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgIyBWZXJpZnkgaWYgaXQncyBhbiBJRCBvciBhbiBVUkxcbiAgICBpZiAvXlxcLyhwbGF5bGlzdHN8dHJhY2tzfHVzZXJzKVxcL1swLTldKyQvLnRlc3QocGF0aClcbiAgICAgIHJldHVybiBjYWxsYmFjayhwYXRoKVxuXG4gICAgdW5sZXNzIC9eKGh0dHB8aHR0cHMpLy50ZXN0KHBhdGgpXG4gICAgICByZXR1cm4gY29uc29sZS5sb2cgXCJcXFwiXCIgKyBwYXRoICsgXCJcXFwiIGlzIG5vdCBhbiB1cmwgb3IgYSBwYXRoXCJcblxuICAgIFNDLmdldCgnL3Jlc29sdmUnLCB7IHVybDogcGF0aCB9LCAodHJhY2ssIGVycm9yKT0+XG4gICAgICBpZiAoZXJyb3IpXG4gICAgICAgIGNvbnNvbGUubG9nIGVycm9yLm1lc3NhZ2VcbiAgICAgIGVsc2VcbiAgICAgICAgdXJsID0gWycnLCB0cmFjay5raW5kKydzJywgdHJhY2suaWRdLmpvaW4oJy8nKVxuICAgICAgICBjYWxsYmFjayh1cmwpXG4gICAgKVxuXG4gIHN0cmVhbVNvdW5kOiAob2JqZWN0LCBvcHRpb25zPXt9LCBjYWxsYmFjayktPlxuICAgIGlmIG9iamVjdCBhbmQgb2JqZWN0Lmhhc093blByb3BlcnR5KCdraW5kJylcbiAgICAgIHBhdGggPSBvYmplY3QudXJpLnJlcGxhY2UoJ2h0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tJywgJycpXG5cbiAgICAgIGRlZmF1bHRzID1cbiAgICAgICAgYXV0b1BsYXk6IHRydWVcbiAgICAgICAgdXNlV2F2ZWZvcm1EYXRhOiB0cnVlXG4gICAgICAgIHVzZUhUTUw1YXVkaW86IHRydWVcbiAgICAgICAgcHJlZmVyRmxhc2g6IGZhbHNlXG5cbiAgICAgIG9wdGlvbnMgPSBfQ29mZmVlLm1lcmdlKGRlZmF1bHRzLCBvcHRpb25zKVxuICAgICAgU0Muc3RyZWFtKHBhdGgsIG9wdGlvbnMsIGNhbGxiYWNrKVxuXG4gIGdldFNvdW5kT3JQbGF5bGlzdDogKHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgaWYgdHlwZW9mIHBhdGggPT0gJ29iamVjdCcgYW5kIHBhdGguaGFzT3duUHJvcGVydHkoJ2tpbmQnKVxuICAgICAgY2FsbGJhY2socGF0aClcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICBAcGF0aE9yVXJsKHBhdGgsIChwYXRoKT0+XG4gICAgICBAZ2V0KHBhdGgsIGNhbGxiYWNrKVxuICAgIClcblxuICBnZXQ6IChwYXRoLCBjYWxsYmFjayktPlxuICAgIFNDLmdldChwYXRoLCBjYWxsYmFjaylcblxuICBnZXRTb3VuZFVybDogKHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgQGdldFNvdW5kT3JQbGF5bGlzdChwYXRoLCAoc291bmQpPT5cbiAgICAgIGNhbGxiYWNrKHNvdW5kLnN0cmVhbV91cmwrJz9vYXV0aF90b2tlbj0nK0B0b2tlbilcbiAgICApXG5cbiAgc2VhcmNoOiAoc2VhcmNoLCBwYXRoLCBjYWxsYmFjayktPlxuICAgIGlmIHR5cGVvZiBwYXRoID09ICdmdW5jdGlvbidcbiAgICAgIGNhbGxiYWNrID0gcGF0aFxuICAgICAgcGF0aCAgICAgPSAndHJhY2tzJ1xuXG4gICAgaWYgcGF0aCA9PSAndXNlcnMnXG4gICAgICBAcGF0aE9yVXJsKCdodHRwczovL3NvdW5kY2xvdWQuY29tLycrc2VhcmNoLCAocGF0aCk9PlxuICAgICAgICBwYXRoID0gcGF0aCsnL2Zhdm9yaXRlcz9vYXV0aF90b2tlbj0nK0B0b2tlblxuICAgICAgICBTQy5nZXQocGF0aCwgY2FsbGJhY2spXG4gICAgICApXG4gICAgZWxzZVxuICAgICAgcGF0aCA9ICcvJytwYXRoKyc/b2F1dGhfdG9rZW49JytAdG9rZW4rJyZxPScrc2VhcmNoXG4gICAgICBTQy5nZXQocGF0aCwgY2FsbGJhY2spXG5cblxuY2xhc3MgU1BBQ0UuU2VhcmNoRW5naW5lXG4gIFNDOiBudWxsXG4gIGp1a2Vib3g6IG51bGxcblxuICAjIEhUTUxcbiAgaW5wdXQ6ICAgICAgICAgbnVsbFxuICBsaXN0OiAgICAgICAgICBudWxsXG4gIGxpc3RDb250YWluZXI6IG51bGxcbiAgZWw6ICAgICAgICAgICAgbnVsbFxuICBsaW5lSGVpZ2h0OiAgICAwXG4gIHJlc3VsdHNIZWlnaHQ6IDBcbiAgcmVzdWx0czogICAgICAgbnVsbFxuICBmb2N1c2VkOiAgICAgICBudWxsXG5cbiAgc2Nyb2xsUG9zOiAgICAgMFxuXG4gIEBzdGF0ZTogIG51bGxcblxuXG4gIGNvbnN0cnVjdG9yOiAoanVrZWJveCktPlxuICAgIEBqdWtlYm94ICAgICAgID0ganVrZWJveFxuICAgIEBTQyAgICAgICAgICAgID0gU1BBQ0UuU0NcblxuICAgIEBlbCAgICAgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCcpXG4gICAgQGlucHV0ICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoIGZvcm0gaW5wdXQnKVxuICAgIEBsaXN0ICAgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCAubGlzdCcpXG4gICAgQGxpc3RDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoIHVsJylcblxuICAgIEBzZXRTdGF0ZShTZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRUQpXG4gICAgQF9ldmVudHMoKVxuXG4gIF9ldmVudHM6IC0+XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCBmb3JtJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgQF9lSnVrZWJveElzU2VhcmNoaW5nKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgQF9lS2V5cHJlc3MpXG5cbiAgX2VKdWtlYm94SXNTZWFyY2hpbmc6IChlKT0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgQHNlYXJjaChAaW5wdXQudmFsdWUpIGlmIEBpbnB1dC52YWx1ZS5sZW5ndGggPiAwXG5cbiAgX2VLZXlwcmVzczogKGUpPT5cbiAgICBzd2l0Y2goZS5rZXlDb2RlKVxuICAgICAgd2hlbiBLZXlib2FyZC5FTlRFUlxuICAgICAgICBpZiBAaW5wdXQudmFsdWUubGVuZ3RoID09IDBcbiAgICAgICAgICBpZiBAc3RhdGUgPT0gU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEXG4gICAgICAgICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBzZXRTdGF0ZShTZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRUQpXG4gICAgICAgIGVsc2UgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSCBhbmQgQGZvY3VzZWRcbiAgICAgICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuVFJBQ0tfU0VMRUNURUQpXG4gICAgICAgIGVsc2UgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEXG4gICAgICAgICAgQGFkZCgpXG5cbiAgICAgIHdoZW4gS2V5Ym9hcmQuVVBcbiAgICAgICAgQHVwKCkgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSFxuXG4gICAgICB3aGVuIEtleWJvYXJkLkRPV05cbiAgICAgICAgQGRvd24oKSBpZiBAc3RhdGUgPT0gU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIXG5cbiAgICAgIHdoZW4gS2V5Ym9hcmQuRVNDLCBLZXlib2FyZC5ERUxFVEVcbiAgICAgICAgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSFxuICAgICAgICAgIEBzZXRTdGF0ZShTZWFyY2hFbmdpbmVTdGF0ZS5PUEVORUQpXG4gICAgICAgIGVsc2UgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEXG4gICAgICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBzZXRTdGF0ZShTZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRUQpXG5cbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgc2V0U3RhdGU6IChzdGF0ZSktPlxuICAgIEBzdGF0ZSA9IHN0YXRlXG4gICAgc3dpdGNoIEBzdGF0ZVxuICAgICAgd2hlbiBTZWFyY2hFbmdpbmVTdGF0ZS5PUEVORURcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIEBlbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWFyY2hfb3BlbicpXG5cbiAgICAgICAgQGlucHV0LnZhbHVlICAgID0gJydcbiAgICAgICAgQGlucHV0LmRpc2FibGVkID0gZmFsc2VcbiAgICAgICAgQGlucHV0LmZvY3VzKClcblxuICAgICAgICBAcmVzZXQoKVxuICAgICAgd2hlbiBTZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRURcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICB3aGVuIFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSFxuICAgICAgICBAZWwuY2xhc3NMaXN0LmFkZCgnc2VhcmNoX29wZW4nKVxuXG4gICAgICAgIEBpbnB1dC5kaXNhYmxlZCA9IHRydWVcbiAgICAgICAgQGlucHV0LmJsdXIoKVxuXG4gICAgICAgIEBsaW5lSGVpZ2h0ICAgID0gQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvcignbGknKS5vZmZzZXRIZWlnaHRcbiAgICAgICAgQHJlc3VsdHNIZWlnaHQgPSBAbGluZUhlaWdodCAqIChAbGlzdENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdsaScpLmxlbmd0aC0xKVxuXG4gICAgICAgIEBmb2N1c2VkLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJykgaWYgQGZvY3VzZWRcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2l0ZW1fc2VsZWN0ZWQnKVxuICAgICAgd2hlbiBTZWFyY2hFbmdpbmVTdGF0ZS5UUkFDS19TRUxFQ1RFRFxuICAgICAgICBAZm9jdXNlZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgICAgIEBlbC5jbGFzc0xpc3QuYWRkKCdpdGVtX3NlbGVjdGVkJylcblxuICB1cDogLT5cbiAgICBuZXh0ID0gQHNjcm9sbFBvcyArIEBsaW5lSGVpZ2h0XG4gICAgaWYgbmV4dCA8PSAwXG4gICAgICBAc2Nyb2xsUG9zID0gbmV4dFxuICAgICAgQGZvY3VzKClcblxuICBkb3duOiAtPlxuICAgIG5leHQgPSBAc2Nyb2xsUG9zIC0gQGxpbmVIZWlnaHRcbiAgICBpZiBNYXRoLmFicyhuZXh0KSA8PSBAcmVzdWx0c0hlaWdodFxuICAgICAgQHNjcm9sbFBvcyA9IG5leHRcbiAgICAgIEBmb2N1cygpXG5cbiAgZm9jdXM6ID0+XG4gICAgaWYgQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGggPiAxXG4gICAgICAkKFtAbGlzdENvbnRhaW5lciwgQGlucHV0XSkuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsICcrQHNjcm9sbFBvcysncHgpJylcbiAgICAgIHBvcyA9IChAc2Nyb2xsUG9zKi0xKSAvIChAcmVzdWx0c0hlaWdodCAvIChAbGlzdENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdsaScpLmxlbmd0aC0xKSlcbiAgICAgIHBvcyA9IE1hdGguZmxvb3IocG9zKVxuICAgICAgZWxtID0gQGVsLnF1ZXJ5U2VsZWN0b3IoJ2xpOm50aC1jaGlsZCgnKyhwb3MrMSkrJyknKVxuXG4gICAgICBpZiBlbG0uZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JylcbiAgICAgICAgQGZvY3VzZWQuY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXNlZCcpIGlmIEBmb2N1c2VkXG4gICAgICAgIEBmb2N1c2VkID0gZWxtXG4gICAgICAgIEBmb2N1c2VkLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzZWQnKVxuICAgICAgZWxzZVxuICAgICAgICBAZm9jdXNlZCA9IG51bGxcbiAgICBlbHNlXG4gICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEKVxuICAgICAgIyAkKFtAbGlzdENvbnRhaW5lciwgQGlucHV0XSkuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDApJylcblxuICByZXNldDogLT5cbiAgICBAZm9jdXNlZCAgID0gbnVsbFxuICAgIEBzY3JvbGxQb3MgPSAwXG4gICAgJChbQGxpc3RDb250YWluZXIsIEBpbnB1dF0pLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAnK0BzY3JvbGxQb3MrJ3B4KScpXG4gICAgQGxpc3RDb250YWluZXIuaW5uZXJIVE1MID0gJydcblxuICBhZGQ6IC0+XG4gICAgaW5kZXggPSBAZm9jdXNlZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKVxuICAgIHRyYWNrID0gQHJlc3VsdHNbaW5kZXhdXG4gICAgQGp1a2Vib3guYWRkKHRyYWNrKSBpZiB0cmFja1xuXG4gICAgQGZvY3VzZWQuY2xhc3NMaXN0LmFkZCgnYWRkZWQnKVxuICAgICQoQGZvY3VzZWQpLmNzcyh7XG4gICAgICAndHJhbnNmb3JtJzogJ3NjYWxlKC43NSkgdHJhbnNsYXRlWCgnK3dpbmRvdy5pbm5lcldpZHRoKydweCknXG4gICAgfSlcblxuICAgIHNldFRpbWVvdXQoPT5cbiAgICAgIEBmb2N1c2VkLnJlbW92ZSgpXG4gICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIKVxuICAgICAgQHVwKCkgaWYgQGZvY3VzZWQubmV4dFNpYmxpbmdcbiAgICAgIEBmb2N1cygpXG4gICAgLCA1MDApXG5cbiAgc2VhcmNoOiAodmFsdWUpLT5cbiAgICBwYXRoID0gdmFsdWUuc3BsaXQoL1xccy8pWzBdXG4gICAgaWYgL14odHJhY2t8dHJhY2tzfHBsYXlsaXN0fHBsYXlsaXN0c3xzZXR8c2V0c3x1c2VyfHVzZXJzKSQvLnRlc3QocGF0aClcbiAgICAgIGxhc3RDaGFyID0gcGF0aC5jaGFyQXQocGF0aC5sZW5ndGgtMSlcbiAgICAgIHZhbHVlICAgID0gdmFsdWUucmVwbGFjZShwYXRoKycgJywgJycpXG4gICAgICBwYXRoICAgICArPSAncycgaWYgbGFzdENoYXIgIT0gJ3MnXG4gICAgICBwYXRoICAgICA9ICdwbGF5bGlzdHMnIGlmIC9zZXRzLy50ZXN0KHBhdGgpXG4gICAgZWxzZVxuICAgICAgcGF0aCAgICAgPSAndHJhY2tzJ1xuXG4gICAgc3RyaW5nID0gJycnXG4gICAgICBbXG4gICAgICAgIHtcImtpbmRcIjpcInRyYWNrXCIsXCJpZFwiOjYzMjU2OTA2LFwiY3JlYXRlZF9hdFwiOlwiMjAxMi8xMC8xMyAxMDo0NzoxNiArMDAwMFwiLFwidXNlcl9pZFwiOjc4ODIwNSxcImR1cmF0aW9uXCI6MjM3ODQwLFwiY29tbWVudGFibGVcIjp0cnVlLFwic3RhdGVcIjpcImZpbmlzaGVkXCIsXCJvcmlnaW5hbF9jb250ZW50X3NpemVcIjo5NTQzMTY4LFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMi8yMiAyMTowMToxNyArMDAwMFwiLFwic2hhcmluZ1wiOlwicHVibGljXCIsXCJ0YWdfbGlzdFwiOlwiXCIsXCJwZXJtYWxpbmtcIjpcImphbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwic3RyZWFtYWJsZVwiOnRydWUsXCJlbWJlZGRhYmxlX2J5XCI6XCJhbGxcIixcImRvd25sb2FkYWJsZVwiOnRydWUsXCJwdXJjaGFzZV91cmxcIjpcImh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX2lkXCI6bnVsbCxcInB1cmNoYXNlX3RpdGxlXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiBETFwiLFwiZ2VucmVcIjpcIlBvcGxvY2tpbiBNdXNpY1wiLFwidGl0bGVcIjpcIkphbmV0IEphY2tzb24gLSBJZiAoS2F5dHJhbmFkYSBSZW1peClcIixcImRlc2NyaXB0aW9uXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiwgZm9yIERKcywgd2VsbCwgdGhhdHMgdGhlIHZlcnNpb24gaSB1c2UgZm9yIG15IGRqIHNldHM7IGh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX25hbWVcIjpcIlwiLFwicmVsZWFzZVwiOlwiXCIsXCJ0cmFja190eXBlXCI6XCJyZW1peFwiLFwia2V5X3NpZ25hdHVyZVwiOlwiXCIsXCJpc3JjXCI6XCJcIixcInZpZGVvX3VybFwiOm51bGwsXCJicG1cIjpudWxsLFwicmVsZWFzZV95ZWFyXCI6bnVsbCxcInJlbGVhc2VfbW9udGhcIjpudWxsLFwicmVsZWFzZV9kYXlcIjpudWxsLFwib3JpZ2luYWxfZm9ybWF0XCI6XCJtcDNcIixcImxpY2Vuc2VcIjpcImFsbC1yaWdodHMtcmVzZXJ2ZWRcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2XCIsXCJ1c2VyXCI6e1wiaWRcIjo3ODgyMDUsXCJraW5kXCI6XCJ1c2VyXCIsXCJwZXJtYWxpbmtcIjpcImtheXRyYW5hZGFcIixcInVzZXJuYW1lXCI6XCJLQVlUUkFOQURBXCIsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzExLzA3IDA0OjExOjM2ICswMDAwXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3VzZXJzLzc4ODIwNVwiLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGFcIixcImF2YXRhcl91cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hdmF0YXJzLTAwMDA3NDgwMzY5NC1xaWJ4dDQtbGFyZ2UuanBnXCJ9LFwidXNlcl9wbGF5YmFja19jb3VudFwiOjEsXCJ1c2VyX2Zhdm9yaXRlXCI6dHJ1ZSxcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhL2phbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwiYXJ0d29ya191cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hcnR3b3Jrcy0wMDAwMzIwOTQ1OTctNTZ0czduLWxhcmdlLmpwZ1wiLFwid2F2ZWZvcm1fdXJsXCI6XCJodHRwczovL3cxLnNuZGNkbi5jb20vYXFSR2k0RG1iQ1d6X20ucG5nXCIsXCJzdHJlYW1fdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvc3RyZWFtXCIsXCJkb3dubG9hZF91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9kb3dubG9hZFwiLFwicGxheWJhY2tfY291bnRcIjozMzMxMDMzLFwiZG93bmxvYWRfY291bnRcIjo5NjExMixcImZhdm9yaXRpbmdzX2NvdW50XCI6NjY2NTMsXCJjb21tZW50X2NvdW50XCI6MTU5NCxcImF0dGFjaG1lbnRzX3VyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2F0dGFjaG1lbnRzXCIsXCJwb2xpY3lcIjpcIkFMTE9XXCJ9LFxuICAgICAgICB7XCJraW5kXCI6XCJ0cmFja1wiLFwiaWRcIjo2MzI1NjkwNixcImNyZWF0ZWRfYXRcIjpcIjIwMTIvMTAvMTMgMTA6NDc6MTYgKzAwMDBcIixcInVzZXJfaWRcIjo3ODgyMDUsXCJkdXJhdGlvblwiOjIzNzg0MCxcImNvbW1lbnRhYmxlXCI6dHJ1ZSxcInN0YXRlXCI6XCJmaW5pc2hlZFwiLFwib3JpZ2luYWxfY29udGVudF9zaXplXCI6OTU0MzE2OCxcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTIvMjIgMjE6MDE6MTcgKzAwMDBcIixcInNoYXJpbmdcIjpcInB1YmxpY1wiLFwidGFnX2xpc3RcIjpcIlwiLFwicGVybWFsaW5rXCI6XCJqYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcInN0cmVhbWFibGVcIjp0cnVlLFwiZW1iZWRkYWJsZV9ieVwiOlwiYWxsXCIsXCJkb3dubG9hZGFibGVcIjp0cnVlLFwicHVyY2hhc2VfdXJsXCI6XCJodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9pZFwiOm51bGwsXCJwdXJjaGFzZV90aXRsZVwiOlwiQWx0ZXJuYXRlIFZlcnNpb24gRExcIixcImdlbnJlXCI6XCJQb3Bsb2NraW4gTXVzaWNcIixcInRpdGxlXCI6XCJKYW5ldCBKYWNrc29uIC0gSWYgKEtheXRyYW5hZGEgUmVtaXgpXCIsXCJkZXNjcmlwdGlvblwiOlwiQWx0ZXJuYXRlIFZlcnNpb24sIGZvciBESnMsIHdlbGwsIHRoYXRzIHRoZSB2ZXJzaW9uIGkgdXNlIGZvciBteSBkaiBzZXRzOyBodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9uYW1lXCI6XCJcIixcInJlbGVhc2VcIjpcIlwiLFwidHJhY2tfdHlwZVwiOlwicmVtaXhcIixcImtleV9zaWduYXR1cmVcIjpcIlwiLFwiaXNyY1wiOlwiXCIsXCJ2aWRlb191cmxcIjpudWxsLFwiYnBtXCI6bnVsbCxcInJlbGVhc2VfeWVhclwiOm51bGwsXCJyZWxlYXNlX21vbnRoXCI6bnVsbCxcInJlbGVhc2VfZGF5XCI6bnVsbCxcIm9yaWdpbmFsX2Zvcm1hdFwiOlwibXAzXCIsXCJsaWNlbnNlXCI6XCJhbGwtcmlnaHRzLXJlc2VydmVkXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNlwiLFwidXNlclwiOntcImlkXCI6Nzg4MjA1LFwia2luZFwiOlwidXNlclwiLFwicGVybWFsaW5rXCI6XCJrYXl0cmFuYWRhXCIsXCJ1c2VybmFtZVwiOlwiS0FZVFJBTkFEQVwiLFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMS8wNyAwNDoxMTozNiArMDAwMFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS91c2Vycy83ODgyMDVcIixcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhXCIsXCJhdmF0YXJfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAwNzQ4MDM2OTQtcWlieHQ0LWxhcmdlLmpwZ1wifSxcInVzZXJfcGxheWJhY2tfY291bnRcIjoxLFwidXNlcl9mYXZvcml0ZVwiOnRydWUsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYS9qYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcImFydHdvcmtfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtMDAwMDMyMDk0NTk3LTU2dHM3bi1sYXJnZS5qcGdcIixcIndhdmVmb3JtX3VybFwiOlwiaHR0cHM6Ly93MS5zbmRjZG4uY29tL2FxUkdpNERtYkNXel9tLnBuZ1wiLFwic3RyZWFtX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L3N0cmVhbVwiLFwiZG93bmxvYWRfdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvZG93bmxvYWRcIixcInBsYXliYWNrX2NvdW50XCI6MzMzMTAzMyxcImRvd25sb2FkX2NvdW50XCI6OTYxMTIsXCJmYXZvcml0aW5nc19jb3VudFwiOjY2NjUzLFwiY29tbWVudF9jb3VudFwiOjE1OTQsXCJhdHRhY2htZW50c191cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9hdHRhY2htZW50c1wiLFwicG9saWN5XCI6XCJBTExPV1wifSxcbiAgICAgICAge1wia2luZFwiOlwidHJhY2tcIixcImlkXCI6NjMyNTY5MDYsXCJjcmVhdGVkX2F0XCI6XCIyMDEyLzEwLzEzIDEwOjQ3OjE2ICswMDAwXCIsXCJ1c2VyX2lkXCI6Nzg4MjA1LFwiZHVyYXRpb25cIjoyMzc4NDAsXCJjb21tZW50YWJsZVwiOnRydWUsXCJzdGF0ZVwiOlwiZmluaXNoZWRcIixcIm9yaWdpbmFsX2NvbnRlbnRfc2l6ZVwiOjk1NDMxNjgsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzEyLzIyIDIxOjAxOjE3ICswMDAwXCIsXCJzaGFyaW5nXCI6XCJwdWJsaWNcIixcInRhZ19saXN0XCI6XCJcIixcInBlcm1hbGlua1wiOlwiamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJzdHJlYW1hYmxlXCI6dHJ1ZSxcImVtYmVkZGFibGVfYnlcIjpcImFsbFwiLFwiZG93bmxvYWRhYmxlXCI6dHJ1ZSxcInB1cmNoYXNlX3VybFwiOlwiaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfaWRcIjpudWxsLFwicHVyY2hhc2VfdGl0bGVcIjpcIkFsdGVybmF0ZSBWZXJzaW9uIERMXCIsXCJnZW5yZVwiOlwiUG9wbG9ja2luIE11c2ljXCIsXCJ0aXRsZVwiOlwiSmFuZXQgSmFja3NvbiAtIElmIChLYXl0cmFuYWRhIFJlbWl4KVwiLFwiZGVzY3JpcHRpb25cIjpcIkFsdGVybmF0ZSBWZXJzaW9uLCBmb3IgREpzLCB3ZWxsLCB0aGF0cyB0aGUgdmVyc2lvbiBpIHVzZSBmb3IgbXkgZGogc2V0czsgaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfbmFtZVwiOlwiXCIsXCJyZWxlYXNlXCI6XCJcIixcInRyYWNrX3R5cGVcIjpcInJlbWl4XCIsXCJrZXlfc2lnbmF0dXJlXCI6XCJcIixcImlzcmNcIjpcIlwiLFwidmlkZW9fdXJsXCI6bnVsbCxcImJwbVwiOm51bGwsXCJyZWxlYXNlX3llYXJcIjpudWxsLFwicmVsZWFzZV9tb250aFwiOm51bGwsXCJyZWxlYXNlX2RheVwiOm51bGwsXCJvcmlnaW5hbF9mb3JtYXRcIjpcIm1wM1wiLFwibGljZW5zZVwiOlwiYWxsLXJpZ2h0cy1yZXNlcnZlZFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDZcIixcInVzZXJcIjp7XCJpZFwiOjc4ODIwNSxcImtpbmRcIjpcInVzZXJcIixcInBlcm1hbGlua1wiOlwia2F5dHJhbmFkYVwiLFwidXNlcm5hbWVcIjpcIktBWVRSQU5BREFcIixcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTEvMDcgMDQ6MTE6MzYgKzAwMDBcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdXNlcnMvNzg4MjA1XCIsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYVwiLFwiYXZhdGFyX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2F2YXRhcnMtMDAwMDc0ODAzNjk0LXFpYnh0NC1sYXJnZS5qcGdcIn0sXCJ1c2VyX3BsYXliYWNrX2NvdW50XCI6MSxcInVzZXJfZmF2b3JpdGVcIjp0cnVlLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGEvamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJhcnR3b3JrX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2FydHdvcmtzLTAwMDAzMjA5NDU5Ny01NnRzN24tbGFyZ2UuanBnXCIsXCJ3YXZlZm9ybV91cmxcIjpcImh0dHBzOi8vdzEuc25kY2RuLmNvbS9hcVJHaTREbWJDV3pfbS5wbmdcIixcInN0cmVhbV91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9zdHJlYW1cIixcImRvd25sb2FkX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2Rvd25sb2FkXCIsXCJwbGF5YmFja19jb3VudFwiOjMzMzEwMzMsXCJkb3dubG9hZF9jb3VudFwiOjk2MTEyLFwiZmF2b3JpdGluZ3NfY291bnRcIjo2NjY1MyxcImNvbW1lbnRfY291bnRcIjoxNTk0LFwiYXR0YWNobWVudHNfdXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvYXR0YWNobWVudHNcIixcInBvbGljeVwiOlwiQUxMT1dcIn0sXG4gICAgICAgIHtcImtpbmRcIjpcInRyYWNrXCIsXCJpZFwiOjYzMjU2OTA2LFwiY3JlYXRlZF9hdFwiOlwiMjAxMi8xMC8xMyAxMDo0NzoxNiArMDAwMFwiLFwidXNlcl9pZFwiOjc4ODIwNSxcImR1cmF0aW9uXCI6MjM3ODQwLFwiY29tbWVudGFibGVcIjp0cnVlLFwic3RhdGVcIjpcImZpbmlzaGVkXCIsXCJvcmlnaW5hbF9jb250ZW50X3NpemVcIjo5NTQzMTY4LFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMi8yMiAyMTowMToxNyArMDAwMFwiLFwic2hhcmluZ1wiOlwicHVibGljXCIsXCJ0YWdfbGlzdFwiOlwiXCIsXCJwZXJtYWxpbmtcIjpcImphbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwic3RyZWFtYWJsZVwiOnRydWUsXCJlbWJlZGRhYmxlX2J5XCI6XCJhbGxcIixcImRvd25sb2FkYWJsZVwiOnRydWUsXCJwdXJjaGFzZV91cmxcIjpcImh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX2lkXCI6bnVsbCxcInB1cmNoYXNlX3RpdGxlXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiBETFwiLFwiZ2VucmVcIjpcIlBvcGxvY2tpbiBNdXNpY1wiLFwidGl0bGVcIjpcIkphbmV0IEphY2tzb24gLSBJZiAoS2F5dHJhbmFkYSBSZW1peClcIixcImRlc2NyaXB0aW9uXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiwgZm9yIERKcywgd2VsbCwgdGhhdHMgdGhlIHZlcnNpb24gaSB1c2UgZm9yIG15IGRqIHNldHM7IGh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX25hbWVcIjpcIlwiLFwicmVsZWFzZVwiOlwiXCIsXCJ0cmFja190eXBlXCI6XCJyZW1peFwiLFwia2V5X3NpZ25hdHVyZVwiOlwiXCIsXCJpc3JjXCI6XCJcIixcInZpZGVvX3VybFwiOm51bGwsXCJicG1cIjpudWxsLFwicmVsZWFzZV95ZWFyXCI6bnVsbCxcInJlbGVhc2VfbW9udGhcIjpudWxsLFwicmVsZWFzZV9kYXlcIjpudWxsLFwib3JpZ2luYWxfZm9ybWF0XCI6XCJtcDNcIixcImxpY2Vuc2VcIjpcImFsbC1yaWdodHMtcmVzZXJ2ZWRcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2XCIsXCJ1c2VyXCI6e1wiaWRcIjo3ODgyMDUsXCJraW5kXCI6XCJ1c2VyXCIsXCJwZXJtYWxpbmtcIjpcImtheXRyYW5hZGFcIixcInVzZXJuYW1lXCI6XCJLQVlUUkFOQURBXCIsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzExLzA3IDA0OjExOjM2ICswMDAwXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3VzZXJzLzc4ODIwNVwiLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGFcIixcImF2YXRhcl91cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hdmF0YXJzLTAwMDA3NDgwMzY5NC1xaWJ4dDQtbGFyZ2UuanBnXCJ9LFwidXNlcl9wbGF5YmFja19jb3VudFwiOjEsXCJ1c2VyX2Zhdm9yaXRlXCI6dHJ1ZSxcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhL2phbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwiYXJ0d29ya191cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hcnR3b3Jrcy0wMDAwMzIwOTQ1OTctNTZ0czduLWxhcmdlLmpwZ1wiLFwid2F2ZWZvcm1fdXJsXCI6XCJodHRwczovL3cxLnNuZGNkbi5jb20vYXFSR2k0RG1iQ1d6X20ucG5nXCIsXCJzdHJlYW1fdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvc3RyZWFtXCIsXCJkb3dubG9hZF91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9kb3dubG9hZFwiLFwicGxheWJhY2tfY291bnRcIjozMzMxMDMzLFwiZG93bmxvYWRfY291bnRcIjo5NjExMixcImZhdm9yaXRpbmdzX2NvdW50XCI6NjY2NTMsXCJjb21tZW50X2NvdW50XCI6MTU5NCxcImF0dGFjaG1lbnRzX3VyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2F0dGFjaG1lbnRzXCIsXCJwb2xpY3lcIjpcIkFMTE9XXCJ9XG4gICAgICBdXG4gICAgJycnXG5cbiAgICByZXN1bHRzID0gSlNPTi5wYXJzZShzdHJpbmcpXG5cbiAgICBAaW5wdXQudmFsdWUgPSAnTG9va2luZyBmb3IgXCInK3ZhbHVlKydcIidcbiAgICBAU0Muc2VhcmNoKHZhbHVlLCBwYXRoLCAocmVzdWx0cyk9PlxuICAgICAgY29uc29sZS5sb2cgcmVzdWx0c1xuICAgICAgaWYgcmVzdWx0cy5sZW5ndGggPT0gMFxuICAgICAgICBAaW5wdXQudmFsdWUgPSAnXCInK3ZhbHVlKydcIiBoYXMgbm8gcmVzdWx0J1xuICAgICAgICByZXR1cm5cbiAgICAgIGVsc2VcbiAgICAgICAgQGlucHV0LnZhbHVlID0gJ1Jlc3VsdHMgZm9yIFwiJyt2YWx1ZSsnXCInXG5cbiAgICAgIEByZXN1bHRzICAgICA9IFtdXG4gICAgICBAbGlzdENvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKVxuICAgICAgZm9yIHRyYWNrLCBpIGluIHJlc3VsdHNcbiAgICAgICAgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgICAgIGxpLnNldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcsIGkpXG5cbiAgICAgICAgYXJ0d29ya191cmwgPSB0cmFjay5hcnR3b3JrX3VybFxuICAgICAgICBhcnR3b3JrX3VybCA9ICdpbWFnZXMvbm9fYXJ0d29yay5naWYnIHVubGVzcyBhcnR3b3JrX3VybFxuICAgICAgICBsaS5pbm5lckhUTUwgPSBcIlwiXCJcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGltZyBzcmM9XCIje2FydHdvcmtfdXJsfVwiIGFsdD1cIlwiIG9uZXJyb3I9XCJ0aGlzLnNyYz0naW1hZ2VzL25vX2FydHdvcmsuZ2lmJ1wiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPHA+I3t0cmFjay50aXRsZX08L3A+XG4gICAgICAgICAgICAgIDxwPiN7dHJhY2sudXNlci51c2VybmFtZS50b0xvd2VyQ2FzZSgpfTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBcIlwiXCJcbiAgICAgICAgQHJlc3VsdHMucHVzaCh0cmFjaylcbiAgICAgICAgQGxpc3RDb250YWluZXIuYXBwZW5kQ2hpbGQobGkpXG4gICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIKVxuICAgIClcblxuXG5jbGFzcyBTUEFDRS5KdWtlYm94XG5cbiAgIyBTdGF0ZXNcbiAgQElTX1dBSVRJTkc6ICAgJ2p1a2Vib3hfaXNfd2FpdGluZydcbiAgQElTX1FVRVVJTkc6ICAgJ2p1a2Vib3hfaXNfcXVldWluZydcblxuICAjIFByb3BlcnRpZXNcbiAgY3VycmVudDogICAgICBudWxsXG4gIHBsYXlsaXN0OiAgICAgbnVsbFxuICAjIHNlYXJjaEVuZ2luZTogbnVsbFxuICBTQzogICAgICAgICAgIG51bGxcblxuICBzdGF0ZTogICAgIG51bGxcblxuICBfbmV4dERlbGF5OiAxMDBcbiAgX25leHRUaW1lb3V0OiBudWxsXG4gIF9yZWZyZXNoRGVsYXk6IDEwMDBcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAcGxheWxpc3QgICAgID0gW11cbiAgICAjIEBzZWFyY2hFbmdpbmUgPSBuZXcgU1BBQ0UuU2VhcmNoRW5naW5lKClcbiAgICBAU0MgICAgICAgICAgID0gU1BBQ0UuU0NcblxuICAgIEBpbnB1dFR5cGUgICAgPSAnV2ViQXVkaW9BUEknXG5cbiAgICBAc2V0U3RhdGUoU1BBQ0UuSnVrZWJveC5JU19XQUlUSU5HKVxuICAgIEBfcmVmcmVzaCgpXG4gICAgQF9ldmVudHMoKVxuXG4gIF9ldmVudHM6IC0+XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihTUEFDRS5UcmFjay5JU19TVE9QUEVELCBAX2VUcmFja0lzU3RvcHBlZClcblxuICBfZVRyYWNrSXNTdG9wcGVkOiA9PlxuICAgIEBzZXRTdGF0ZShTUEFDRS5KdWtlYm94LklTX1dBSVRJTkcpXG5cbiAgc2V0U3RhdGU6IChzdGF0ZSktPlxuICAgIEBzdGF0ZSA9IHN0YXRlXG4gICAgc3dpdGNoIEBzdGF0ZVxuICAgICAgd2hlbiBTUEFDRS5KdWtlYm94LklTX1dBSVRJTkdcbiAgICAgICAgSEVMUEVSLnRyaWdnZXIoU1BBQ0UuSnVrZWJveC5JU19XQUlUSU5HLCB7IGp1a2Vib3g6IHRoaXMgfSlcbiAgICAgIHdoZW4gU1BBQ0UuSnVrZWJveC5JU19RVUVVSU5HXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLkp1a2Vib3guSVNfUVVFVUlORywgeyBqdWtlYm94OiB0aGlzIH0pXG5cbiAgX2NyZWF0ZVRyYWNrOiAoZGF0YSwgaW5wdXRNb2RlPWZhbHNlKS0+XG4gICAgdHJhY2sgICAgICAgICAgID0gbmV3IFNQQUNFLlRyYWNrKClcbiAgICB0cmFjay5pbnB1dE1vZGUgPSBpbnB1dE1vZGVcbiAgICB0cmFjay5zZXREYXRhKGRhdGEpXG4gICAgQHBsYXlsaXN0LnB1c2godHJhY2spXG5cbiAgX3JlZnJlc2g6ID0+XG4gICAgaWYgQHBsYXlsaXN0Lmxlbmd0aCA+IDAgYW5kIEBzdGF0ZSA9PSBTUEFDRS5KdWtlYm94LklTX1dBSVRJTkdcbiAgICAgIEBuZXh0KClcblxuICAgIHNldFRpbWVvdXQoQF9yZWZyZXNoLCBAX3JlZnJlc2hEZWxheSlcblxuICBhZGQ6ICh1cmxPcklucHV0KS0+XG4gICAgaWYgdHlwZW9mIHVybE9ySW5wdXQgPT0gJ2Jvb2xlYW4nIGFuZCB1cmxPcklucHV0XG4gICAgICBAX2NyZWF0ZVRyYWNrKHt9LCB0cnVlKSBcbiAgICAgIHJldHVyblxuXG4gICAgQFNDLmdldFNvdW5kT3JQbGF5bGlzdCB1cmxPcklucHV0LCAobyk9PlxuICAgICAgdHJhY2tzID0gbnVsbFxuICAgICAgaWYgby5oYXNPd25Qcm9wZXJ0eSgndHJhY2tzJylcbiAgICAgICAgdHJhY2tzID0gby50cmFja3NcbiAgICAgIGVsc2VcbiAgICAgICAgdHJhY2tzID0gW29dXG5cbiAgICAgIGZvciBkYXRhIGluIHRyYWNrc1xuICAgICAgICBAX2NyZWF0ZVRyYWNrKGRhdGEsIGZhbHNlKVxuXG4gIHJlbW92ZTogKGluZGV4KS0+XG4gICAgcmV0dXJuIGlmIEBpbnB1dFR5cGUgPT0gJ01pY3JvcGhvbmUnXG4gICAgQHBsYXlsaXN0LnNwbGljZShpbmRleCwgMSlcblxuICBtb3ZlOiAoaW5kZXgxLCBpbmRleDIpLT5cbiAgICByZXR1cm4gaWYgQGlucHV0VHlwZSA9PSAnTWljcm9waG9uZSdcblxuICAgIHRtcCAgICAgICAgICAgICAgID0gQHBsYXlsaXN0W2luZGV4MV1cbiAgICBAcGxheWxpc3RbaW5kZXgxXSA9IEBwbGF5bGlzdFtpbmRleDJdXG4gICAgQHBsYXlsaXN0W2luZGV4Ml0gPSB0bXBcblxuICBzZWFyY2g6ICh2YWx1ZSktPlxuICAgIHJldHVybiBpZiBAaW5wdXRUeXBlID09ICdNaWNyb3Bob25lJ1xuICAgIEBzZWFyY2hFbmdpbmUuc2VhcmNoKHZhbHVlKVxuXG4gIG5leHQ6IC0+XG4gICAgcmV0dXJuIGlmIEBpbnB1dFR5cGUgPT0gJ01pY3JvcGhvbmUnXG5cbiAgICBjbGVhclRpbWVvdXQoQF9uZXh0VGltZW91dCkgaWYgQF9uZXh0VGltZW91dCBcblxuICAgIEBzZXRTdGF0ZShTUEFDRS5KdWtlYm94LklTX1FVRVVJTkcpXG4gICAgQF9uZXh0VGltZW91dCA9IHNldFRpbWVvdXQgPT5cbiAgICAgIEBjdXJyZW50LnN0b3AoKSBpZiBAY3VycmVudFxuICAgICAgaWYgQHBsYXlsaXN0Lmxlbmd0aCA+IDBcbiAgICAgICAgQGN1cnJlbnQgPSBAcGxheWxpc3Quc2hpZnQoKVxuICAgICAgICBAY3VycmVudC5sb2FkKClcbiAgICAsIEBfbmV4dERlbGF5XG5cblxuY2xhc3MgU1BBQ0UuVHJhY2tcblxuICAjIFNUQVRFU1xuICBASVNfV0FJVElORzogJ3RyYWNrX2lzX3dhaXRpbmcnXG4gIEBXSUxMX1BMQVk6ICAndHJhY2tfd2lsbF9wbGF5J1xuICBASVNfUExBWUlORzogJ3RyYWNrX2lzX3BsYXlpbmcnXG4gIEBJU19QQVVTRUQ6ICAndHJhY2tfaXNfcGF1c2VkJ1xuICBASVNfU1RPUFBFRDogJ3RyYWNrX2lzX3N0b3BwZWQnXG5cbiAgQEFQSVR5cGU6XG4gICAgU291bmRNYW5hZ2VyMjogJ1NvdW5kTWFuYWdlcjInXG4gICAgV2ViQXVkaW9BUEk6ICAgJ1dlYkF1ZGlvQVBJJ1xuICAgIEpTT046ICAgICAgICAgICdKU09OJ1xuXG4gICMgUHJvcGVydGllc1xuICBfU0M6ICAgICAgbnVsbFxuICBfZGF0YTogICAgbnVsbFxuICBfQVBJVHlwZTogbnVsbFxuICBfQVBJOiAgICAgbnVsbFxuXG4gIHRpbWVkYXRhOiBudWxsXG5cbiAgYXV0b3BsYXk6IHRydWVcbiAgc3RhdGU6ICAgIG51bGxcblxuICBsb2FkaW5ncHJvZ3Jlc3Npb246IDBcbiAgaW5wdXRNb2RlOiAgICAgICAgICBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBfU0MgICAgICA9IFNQQUNFLlNDXG4gICAgQF9BUElUeXBlID0gU1BBQ0UuVHJhY2suQVBJVHlwZS5XZWJBdWRpb0FQSVxuICAgIEBfcmVzZXRUaW1lZGF0YSgpXG4gICAgQHNldFN0YXRlKFNQQUNFLlRyYWNrLklTX1dBSVRJTkcpXG5cbiAgI1xuICAjIFNldHRlcnNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBzZXREYXRhOiAoZGF0YSktPlxuICAgIEBfZGF0YSA9IGRhdGFcblxuICBzZXRTdGF0ZTogKHN0YXRlKS0+XG4gICAgQHN0YXRlID0gc3RhdGVcbiAgICBzd2l0Y2ggQHN0YXRlXG4gICAgICB3aGVuIFNQQUNFLlRyYWNrLklTX1dBSVRJTkdcbiAgICAgICAgSEVMUEVSLnRyaWdnZXIoU1BBQ0UuVHJhY2suSVNfV0FJVElORywgeyB0cmFjazogdGhpcyB9KVxuICAgICAgd2hlbiBTUEFDRS5UcmFjay5XSUxMX1BMQVlcbiAgICAgICAgQF9yZXNldFRpbWVkYXRhKClcbiAgICAgICAgSEVMUEVSLnRyaWdnZXIoU1BBQ0UuVHJhY2suV0lMTF9QTEFZLCB7IHRyYWNrOiB0aGlzIH0pXG4gICAgICB3aGVuIFNQQUNFLlRyYWNrLklTX1BMQVlJTkdcbiAgICAgICAgSEVMUEVSLnRyaWdnZXIoU1BBQ0UuVHJhY2suSVNfUExBWUlORywgeyB0cmFjazogdGhpcyB9KVxuICAgICAgd2hlbiBTUEFDRS5UcmFjay5JU19QQVVTRURcbiAgICAgICAgQF9yZXNldFRpbWVkYXRhKClcbiAgICAgICAgSEVMUEVSLnRyaWdnZXIoU1BBQ0UuVHJhY2suSVNfUEFVU0VELCB7IHRyYWNrOiB0aGlzIH0pXG4gICAgICB3aGVuIFNQQUNFLlRyYWNrLklTX1NUT1BQRURcbiAgICAgICAgQF9yZXNldFRpbWVkYXRhKClcbiAgICAgICAgSEVMUEVSLnRyaWdnZXIoU1BBQ0UuVHJhY2suSVNfU1RPUFBFRCwgeyB0cmFjazogdGhpcyB9KVxuXG4gICNcbiAgIyBQdWJsaWMgbWV0aG9kc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGxvYWQ6IC0+XG4gICAgQHNldFN0YXRlKFNQQUNFLlRyYWNrLldJTExfUExBWSlcblxuICAgIGlmIEBpbnB1dE1vZGVcbiAgICAgIEBfd2ViYXVkaW9hcGkoKVxuICAgIGVsc2UgaWYgQF9BUElUeXBlID09ICdXZWJBdWRpb0FQSSdcbiAgICAgIEBfU0MuZ2V0U291bmRVcmwoJy90cmFja3MvJytAX2RhdGEuaWQsIEBfd2ViYXVkaW9hcGkpXG4gICAgZWxzZVxuICAgICAgQF9zb3VuZG1hbmFnZXIyKClcblxuICBwbGF5OiAtPlxuICAgIEBfQVBJLnBsYXkoKVxuXG4gIHBhdXNlOiAtPlxuICAgIEBfQVBJLnBhdXNlKClcblxuICBzdG9wOiAtPlxuICAgIEBfQVBJLnN0b3AoKVxuXG4gIHZvbHVtZTogKHZhbHVlKS0+XG4gICAgQF9BUEkudm9sdW1lKHZhbHVlKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgc3dpdGNoIEBfQVBJVHlwZVxuICAgICAgd2hlbiBTUEFDRS5UcmFjay5BUElUeXBlLlNvdW5kTWFuYWdlcjJcbiAgICAgICAgQF9BUEkuZGVzdHJ1Y3QoKVxuICAgICAgd2hlbiBTUEFDRS5UcmFjay5BUElUeXBlLldlYkF1ZGlvQVBJXG4gICAgICAgIEBfQVBJLmRlc3Ryb3koKVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZygnc29tZXRoaW5nIHRvIGRlc3Ryb3kgaGVyZScpXG5cbiAgI1xuICAjIFByaXZhdGUgbWV0aG9kc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIF9vbnN0YXJ0OiAoYXBpKT0+XG4gICAgQF9BUEkgICAgICAgICAgID0gYXBpXG4gICAgd2luZG93LkF1ZGlvQVBJID0gYXBpXG5cbiAgX29ucGxheTogPT5cbiAgICBAc2V0U3RhdGUoU1BBQ0UuVHJhY2suSVNfUExBWUlORylcblxuICBfb25wYXVzZTogPT5cbiAgICBAc2V0U3RhdGUoU1BBQ0UuVHJhY2suSVNfUEFVU0VEKVxuXG4gIF9vbnN0b3A6ID0+XG4gICAgQHNldFN0YXRlKFNQQUNFLlRyYWNrLklTX1NUT1BQRUQpXG5cbiAgX29uZW5kZWQ6ID0+XG4gICAgQHNldFN0YXRlKFNQQUNFLlRyYWNrLklTX1NUT1BQRUQpXG5cbiAgX29ubG9hZGluZ3Byb2dyZXNzOiAodmFsdWUpPT5cbiAgICBAbG9hZGluZ3Byb2dyZXNzaW9uID0gdmFsdWVcblxuICBfd2hpbGVwbGF5aW5nOiA9PlxuICAgIHN3aXRjaCBAX0FQSVR5cGVcbiAgICAgIHdoZW4gU1BBQ0UuVHJhY2suQVBJVHlwZS5Tb3VuZE1hbmFnZXIyXG4gICAgICAgIGZvciBpIGluIFswLi4yNTVdXG4gICAgICAgICAgQHRpbWVkYXRhW2ldID0gTWF0aC5tYXgoQHNvdW5kLndhdmVmb3JtRGF0YS5sZWZ0W2ldLCBAc291bmQud2F2ZWZvcm1EYXRhLnJpZ2h0W2ldKVxuICAgICAgXG4gICAgICB3aGVuIFNQQUNFLlRyYWNrLkFQSVR5cGUuV2ViQXVkaW9BUElcbiAgICAgICAgYW5hbHlzZXIgPSBAX0FQSS5hbmFseXNlclxuICAgICAgICB1bmxlc3MgYW5hbHlzZXIuZ2V0RmxvYXRUaW1lRG9tYWluRGF0YVxuICAgICAgICAgIGFycmF5ICAgID0gIG5ldyBVaW50OEFycmF5KGFuYWx5c2VyLmZmdFNpemUpXG4gICAgICAgICAgYW5hbHlzZXIuZ2V0Qnl0ZVRpbWVEb21haW5EYXRhKGFycmF5KVxuICAgICAgICAgIGZvciBpIGluIFswLi4yNTVdXG4gICAgICAgICAgICBAdGltZWRhdGFbaV0gPSAoYXJyYXlbaV0gLSAxMjgpIC8gMTI4XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhcnJheSAgICA9ICBuZXcgRmxvYXQzMkFycmF5KGFuYWx5c2VyLmZmdFNpemUpXG4gICAgICAgICAgYW5hbHlzZXIuZ2V0RmxvYXRUaW1lRG9tYWluRGF0YShhcnJheSlcbiAgICAgICAgICBmb3IgaSBpbiBbMC4uMjU1XVxuICAgICAgICAgICAgQHRpbWVkYXRhW2ldID0gYXJyYXlbaV1cblxuICBfd2ViYXVkaW9hcGk6ICh1cmwpPT5cbiAgICB1bmxlc3Mgd2luZG93LmZpcnN0TGF1bmNoXG4gICAgICBmaXJzdExhdW5jaCA9IGZhbHNlXG4gICAgICBAYXV0b3BsYXkgICA9IGZhbHNlIGlmIC9tb2JpbGUvZ2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KVxuICAgIGVsc2UgXG4gICAgICBAYXV0b3BsYXkgPSB0cnVlICBcblxuICAgIEBfQVBJICAgICAgICAgICAgICAgICAgID0gV2ViQXVkaW9BUElcbiAgICBAX0FQSS5vbnBsYXkgICAgICAgICAgICA9IEBfb25wbGF5XG4gICAgQF9BUEkub25lbmRlZCAgICAgICAgICAgPSBAX29uZW5kZWRcbiAgICBAX0FQSS5vbnBhdXNlICAgICAgICAgICA9IEBfb25wYXVzZVxuICAgIEBfQVBJLm9uc3RvcCAgICAgICAgICAgID0gQF9vbnN0b3BcbiAgICBAX0FQSS5vbmF1ZGlvcHJvY2VzcyAgICA9IEBfd2hpbGVwbGF5aW5nXG4gICAgQF9BUEkub25sb2FkaW5ncHJvZ3Jlc3MgPSBAX29ubG9hZGluZ3Byb2dyZXNzXG4gICAgXG4gICAgaWYgQGlucHV0TW9kZVxuICAgICAgQF9BUEkuaW5wdXRNb2RlID0gdHJ1ZSBcbiAgICAgIEBfQVBJLnN0cmVhbUlucHV0KClcbiAgICBlbHNlXG4gICAgICBAX0FQSS5pbnB1dE1vZGUgPSBmYWxzZSBcbiAgICAgIEBfQVBJLnNldFVybCh1cmwsIEBhdXRvcGxheSwgQF9vbnN0YXJ0KSAgICBcblxuICBfc291bmRtYW5hZ2VyMjogLT5cbiAgICBAX1NDLnN0cmVhbVNvdW5kKEBfZGF0YSwge1xuICAgICAgb25wbGF5ICAgICAgIDogQF9vbnBsYXlcbiAgICAgIG9uZmluaXNoICAgICA6IEBfb25lbmRlZFxuICAgICAgb25zdG9wICAgICAgIDogQF9vbnN0b3BcbiAgICAgIHdoaWxlcGxheWluZyA6IEBfd2hpbGVwbGF5aW5nXG4gICAgICB3aGlsZWxvYWRpbmcgOiA9PlxuICAgICAgICBAX29ubG9hZGluZ3Byb2dyZXNzKEBfQVBJLmJ5dGVzTG9hZGVkIC8gQF9BUEkuYnl0ZXNUb3RhbClcbiAgICB9LCBAX29uc3RhcnQpXG5cbiAgX3Jlc2V0VGltZWRhdGE6IC0+XG4gICAgQHRpbWVkYXRhID0gQXJyYXkoMjU2KVxuICAgIGZvciBpIGluIFswLi4yNTVdXG4gICAgICBAdGltZWRhdGFbaV0gPSAwXG5cblxuY2xhc3MgV2ViQXVkaW9BUElcblxuICAjIFN0YXRlXG4gIEBJU19QTEFZSU5HOiAnd2ViYXVkaW9hcGlfaXNfcGxheWluZydcbiAgQElTX1BBVVNFRDogICd3ZWJhdWRpb2FwaV9pc19wYXVzZWQnXG4gIEBJU19TVE9QUEVEOiAnd2ViYXVkaW9hcGlfaXNfc3RvcHBlZCdcbiAgQElTX0VOREVEOiAgICd3ZWJhdWRpb2FwaV9pc19lbmRlZCdcblxuICAjIFByb3BlcnRpZXNcbiAgaWRlbnRpZmllcjogJ1dlYkF1ZGlvQVBJJ1xuXG4gIGN0eDogICAgICAgbnVsbFxuICBhbmFseXNlcjogIG51bGxcbiAgcHJvY2Vzc29yOiBudWxsXG4gIGJ1ZmZlcjogICAgbnVsbFxuICBzcmM6ICAgICAgIG51bGxcblxuICBzdGFydFRpbWU6IDBcbiAgcG9zaXRpb246ICAwXG4gIGR1cmF0aW9uOiAgMFxuXG4gIHRpbWU6IDBcblxuICBpc0xvYWRlZDogZmFsc2VcblxuICBzdGF0ZTogbnVsbFxuXG4gIF92ZW5kb3JVUkw6IG51bGxcbiAgX2lucHV0TW9kZTogICBmYWxzZVxuXG4gICMjIFNldHVwIFdlYiBBdWRpbyBBUElcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgIyBTZXR1cCBBdWRpb0NvbnRleHRcbiAgICB0cnlcbiAgICAgIGlmICh3aW5kb3cuQXVkaW9Db250ZXh0T2JqZWN0ID09IHVuZGVmaW5lZClcbiAgICAgICAgd2luZG93LkF1ZGlvQ29udGV4dE9iamVjdCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dHx8d2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKVxuICAgIGNhdGNoIGVcbiAgICAgIGlmIChBcHAuZW52ID09ICdkZXZlbG9wbWVudCcpXG4gICAgICAgIGNvbnNvbGUubG9nKFwiSFRNTDUgV2ViIEF1ZGlvIEFQSSBub3Qgc3VwcG9ydGVkLiBTd2l0Y2ggdG8gU291bmRNYW5hZ2VyMi5cIilcblxuICAgIEBjdHggPSBBdWRpb0NvbnRleHRPYmplY3RcbiAgICBAX29sZEJyb3dzZXIoKVxuXG4gICAgIyBTZXR1cCBVc2VyTWVkaWFcbiAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID1cbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgICAgb3IgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSBvciBcbiAgICAgIG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgb3IgbmF2aWdhdG9yLm1zR2V0VXNlck1lZGlhXG4gICAgQF92ZW5kb3JVUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkxcblxuICAgICMgU2V0IGRlZmF1bHQgc3RhdGVcbiAgICBAc2V0U3RhdGUoV2ViQXVkaW9BUEkuSVNfRU5ERUQpXG5cbiAgc2V0VXJsOiAodXJsLCBhdXRvcGxheT1mYWxzZSwgY2FsbGJhY2spLT5cbiAgICBpZiBAaW5wdXRNb2RlXG4gICAgICBhbGVydCgnRGlzYWJsZSBpbnB1dCBtb2RlJylcbiAgICAgIHJldHVyblxuXG4gICAgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpXG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgICAgPSAnYXJyYXlidWZmZXInXG4gICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZVxuICAgIHJlcXVlc3Qub25sb2FkID0gPT5cbiAgICAgIEBjdHguZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIChidWZmZXIpPT5cbiAgICAgICAgQGlzTG9hZGVkID0gdHJ1ZVxuICAgICAgICBAYnVmZmVyID0gYnVmZmVyXG4gICAgICAgIGNhbGxiYWNrKHRoaXMpIGlmIGNhbGxiYWNrXG4gICAgICAgIEBwbGF5KCkgaWYgYXV0b3BsYXlcbiAgICAgICwgQF9vbkVycm9yKVxuICAgIHJlcXVlc3Qub25wcm9ncmVzcyA9IChlKT0+XG4gICAgICBpZiBlLmxlbmd0aENvbXB1dGFibGVcbiAgICAgICAgQG9ubG9hZGluZ3Byb2dyZXNzKGUubG9hZGVkIC8gZS50b3RhbCkgaWYgQG9ubG9hZGluZ3Byb2dyZXNzIFxuICAgIHJlcXVlc3Quc2VuZCgpXG5cbiAgc3RyZWFtSW5wdXQ6IC0+XG4gICAgdW5sZXNzIEBpbnB1dE1vZGVcbiAgICAgIGFsZXJ0KCdFbmFibGUgaW5wdXQgbW9kZScpXG4gICAgICByZXR1cm5cblxuICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoeyB2aWRlbzogZmFsc2UsIGF1ZGlvOiB0cnVlIH0sIChzdHJlYW0pPT5cbiAgICAgIEBpc0xvYWRlZCAgICAgPSB0cnVlXG4gICAgICBAX2xvY2Fsc3RyZWFtID0gc3RyZWFtXG4gICAgICBAcGxheSgpXG4gICAgLCBAX29uRXJyb3IpXG5cbiAgc2V0U3RhdGU6IChzdGF0ZSktPlxuICAgIEBzdGF0ZSA9IHN0YXRlXG5cbiAgX29uRXJyb3I6IChlKS0+XG4gICAgY29uc29sZS5sb2cgJ0VSUk9SJywgZVxuXG4gIHBhdXNlOiAtPlxuICAgIGlmIEBpbnB1dE1vZGVcbiAgICAgIEBzdG9wKClcbiAgICBlbHNlIGlmIEBzcmNcbiAgICAgIEBzcmMuc3RvcCgwKVxuICAgICAgQHNyYyAgICAgICA9IG51bGxcbiAgICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBudWxsXG4gICAgICBAcG9zaXRpb24gID0gQGN0eC5jdXJyZW50VGltZSAtIEBzdGFydFRpbWVcbiAgICAgIEBzZXRTdGF0ZShXZWJBdWRpb0FQSS5JU19QQVVTRUQpXG4gICAgICBAb25wYXVzZSgpIGlmIEBvbnBhdXNlXG5cbiAgcGxheTogKHBvc2l0aW9uKS0+XG4gICAgcmV0dXJuIHVubGVzcyBAaXNMb2FkZWRcbiAgICBpZiBAc3RhdGUgPT0gV2ViQXVkaW9BUEkuSVNfUExBWUlOR1xuICAgICAgQHBhdXNlKClcbiAgICAgIHJldHVyblxuXG4gICAgQF9jb25uZWN0KClcblxuICAgIHVubGVzcyBAaW5wdXRNb2RlXG4gICAgICBAcG9zaXRpb24gID0gaWYgdHlwZW9mIHBvc2l0aW9uID09ICdudW1iZXInIHRoZW4gcG9zaXRpb24gZWxzZSBAcG9zaXRpb24gb3IgMFxuICAgICAgQHN0YXJ0VGltZSA9IEBjdHguY3VycmVudFRpbWUgLSAoQHBvc2l0aW9uIG9yIDApXG4gICAgICBAc3JjLnN0YXJ0KEBjdHguY3VycmVudFRpbWUsIEBwb3NpdGlvbilcblxuICAgIEBzZXRTdGF0ZShXZWJBdWRpb0FQSS5JU19QTEFZSU5HKVxuICAgIEBvbnBsYXkoKSBpZiBAb25wbGF5XG5cbiAgc3RvcDogLT5cbiAgICBpZiBAc3JjXG4gICAgICBpZiBAaW5wdXRNb2RlXG4gICAgICAgIEBzcmMubWVkaWFTdHJlYW0uc3RvcCgpXG4gICAgICAgIEBpc0xvYWRlZCAgICA9IGZhbHNlXG4gICAgICAgIEBsb2NhbHN0cmVhbSA9IG51bGxcbiAgICAgIGVsc2VcbiAgICAgICAgQHNyYy5zdG9wKDApXG4gICAgICBAc3JjICAgICAgID0gbnVsbFxuICAgICAgQHByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IG51bGxcbiAgICAgIEBwb3NpdGlvbiAgPSAwXG4gICAgICBAc3RhcnRUaW1lID0gMFxuICAgICAgQHNldFN0YXRlKFdlYkF1ZGlvQVBJLklTX1NUT1BQRUQpXG4gICAgICBAb25zdG9wKCkgaWYgQG9uc3RvcFxuXG4gIHZvbHVtZTogKHZvbHVtZSktPlxuICAgIHZvbHVtZSA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIHZvbHVtZSkpXG4gICAgQGdhaW5Ob2RlLmdhaW4udmFsdWUgPSB2b2x1bWVcblxuICB1cGRhdGVQb3NpdGlvbjogLT5cbiAgICBpZiBAc3RhdGUgPT0gV2ViQXVkaW9BUEkuSVNfUExBWUlOR1xuICAgICAgQHBvc2l0aW9uID0gQGN0eC5jdXJyZW50VGltZSAtIEBzdGFydFRpbWVcblxuICAgIGlmIEBwb3NpdGlvbiA+IEBidWZmZXIuZHVyYXRpb25cbiAgICAgIEBwb3NpdGlvbiA9IEBidWZmZXIuZHVyYXRpb25cbiAgICAgIEBwYXVzZSgpXG5cbiAgICByZXR1cm4gQHBvc2l0aW9uXG5cbiAgc2VlazogKHRpbWUpLT5cbiAgICBpZiBAc3RhdGUgPT0gV2ViQXVkaW9BUEkuSVNfUExBWUlOR1xuICAgICAgQHBsYXkodGltZSlcbiAgICBlbHNlXG4gICAgICBAcG9zaXRpb24gPSB0aW1lXG5cbiAgZGVzdHJveTogLT5cbiAgICBAc3RvcCgpXG4gICAgQF9kaXNjb25uZWN0KClcbiAgICBAY3R4ID0gbnVsbFxuXG4gIF9jb25uZWN0OiAtPlxuICAgIGlmIEBpbnB1dE1vZGUgYW5kIEBfbG9jYWxzdHJlYW1cbiAgICAgICMgU2V0dXAgYXVkaW8gc291cmNlXG4gICAgICBAc3JjID0gQGN0eC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShAX2xvY2Fsc3RyZWFtKVxuICAgIGVsc2VcbiAgICAgICMgU2V0dXAgYnVmZmVyIHNvdXJjZVxuICAgICAgQHNyYyAgICAgICAgICAgICAgICAgPSBAY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpXG4gICAgICBAc3JjLmJ1ZmZlciAgICAgICAgICA9IEBidWZmZXJcbiAgICAgIEBzcmMub25lbmRlZCAgICAgICAgID0gQF9vbkVuZGVkXG4gICAgICBAZHVyYXRpb24gICAgICAgICAgICA9IEBidWZmZXIuZHVyYXRpb25cblxuICAgICMgU2V0dXAgYW5hbHlzZXJcbiAgICBAYW5hbHlzZXIgPSBAY3R4LmNyZWF0ZUFuYWx5c2VyKClcbiAgICBAYW5hbHlzZXIuc21vb3RoaW5nVGltZUNvbnN0YW50ID0gMC44XG4gICAgQGFuYWx5c2VyLm1pbkRlY2liZWxzICAgICAgICAgICA9IC0xNDBcbiAgICBAYW5hbHlzZXIubWF4RGVjaWJlbHMgICAgICAgICAgID0gMFxuICAgIEBhbmFseXNlci5mZnRTaXplICAgICAgICAgICAgICAgPSA1MTJcblxuICAgICMgU2V0dXAgU2NyaXB0UHJvY2Vzc29yXG4gICAgQHByb2Nlc3NvciA9IEBjdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yKDIwNDgsIDEsIDEpXG5cbiAgICAjIFNldHAgR2Fpbk5vZGVcbiAgICBAZ2Fpbk5vZGUgPSBAY3R4LmNyZWF0ZUdhaW4oKVxuXG4gICAgQHNyYy5jb25uZWN0KEBhbmFseXNlcilcbiAgICBAc3JjLmNvbm5lY3QoQGdhaW5Ob2RlKVxuICAgIEBhbmFseXNlci5jb25uZWN0KEBwcm9jZXNzb3IpXG4gICAgQHByb2Nlc3Nvci5jb25uZWN0KEBjdHguZGVzdGluYXRpb24pXG4gICAgQGdhaW5Ob2RlLmNvbm5lY3QoQGN0eC5kZXN0aW5hdGlvbilcblxuICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBAX29uQXVkaW9Qcm9jZXNzXG4gICAgQHByb2Nlc3Nvci5hcGkgPSBAXG5cbiAgICBAX29sZEJyb3dzZXIoKVxuXG4gIF9kaXNjb25uZWN0OiAtPlxuICAgIEBhbmFseXNlci5kaXNjb25uZWN0KDApICBpZiBAYW5hbHlzZXJcbiAgICBAcHJvY2Vzc29yLmRpc2Nvbm5lY3QoMCkgaWYgQHByb2Nlc3NvclxuICAgIEBnYWluTm9kZS5kaXNjb25uZWN0KDApICBpZiBAZ2Fpbk5vZGVcblxuICBfb25BdWRpb1Byb2Nlc3M6ID0+XG4gICAgQG9uYXVkaW9wcm9jZXNzKCkgaWYgQG9uYXVkaW9wcm9jZXNzXG5cbiAgX29uRW5kZWQ6IChlKT0+XG4gICAgaWYgQHNyYyBhbmQgKEBzdGF0ZSA9PSBXZWJBdWRpb0FQSS5JU19TVE9QUEVEIHx8IEBzdGF0ZSA9PSBXZWJBdWRpb0FQSS5JU19QTEFZSU5HKVxuICAgICAgQHNyYy5kaXNjb25uZWN0KDApXG4gICAgICBAc3JjICAgICAgICAgICAgICAgICAgICAgID0gbnVsbFxuICAgICAgQHByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IG51bGxcbiAgICAgIEBzdGF0ZSA9IFdlYkF1ZGlvQVBJLklTX0VOREVEXG4gICAgICBAb25lbmRlZCgpIGlmIEBvbmVuZGVkXG5cbiAgX29sZEJyb3dzZXI6IC0+XG4gICAgaWYgQGN0eCBhbmQgdHlwZW9mIEBjdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yICE9ICdmdW5jdGlvbidcbiAgICAgIEBjdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yID0gQGN0eC5jcmVhdGVKYXZhU2NyaXB0Tm9kZVxuXG4gICAgaWYgQHNyYyBhbmQgdHlwZW9mIEBzcmMuc3RhcnQgIT0gJ2Z1bmN0aW9uJ1xuICAgICAgQHNyYy5zdGFydCA9IEBzcmMubm90ZU9uXG5cbiAgICBpZiBAc3JjIGFuZCB0eXBlb2YgQHNyYy5zdG9wICE9ICdmdW5jdGlvbidcbiAgICAgIEBzcmMuc3RvcCA9IEBzcmMubm90ZU9mZlxuXG5XZWJBdWRpb0FQSSA9IG5ldyBXZWJBdWRpb0FQSSgpXG5cblxuY2xhc3MgU1BBQ0UuRXF1YWxpemVyIGV4dGVuZHMgVEhSRUUuR3JvdXBcblxuICBjZW50ZXI6ICAgICBudWxsXG5cbiAgX3ZhbHVlczogICAgbnVsbFxuICBfbmV3VmFsdWVzOiBudWxsXG5cbiAgX3RpbWU6ICAgICAgMVxuXG4gIF9qdWtlYm94OiBudWxsXG5cbiAgIyBUSFJFRVxuICBtYXRlcmlhbDogICBudWxsXG4gIGxpbmVzOiAgICAgIG51bGxcblxuICAjIFBhcmFtZXRlcnNcbiAgbWF4TGVuZ3RoOiAgICAgICAgIDBcbiAgbWluTGVuZ3RoOiAgICAgICAgIDBcbiAgcmFkaXVzOiAgICAgICAgICAgIDBcbiAgaW50ZXJwb2xhdGlvblRpbWU6IDBcbiAgY29sb3I6ICAgICAgICAgICAgIDB4RkZGRkZGXG4gIGxpbmVGb3JjZVVwOiAgICAgICAuNVxuICBsaW5lRm9yY2VEb3duOiAgICAgLjVcbiAgbGluZXdpZHRoOiAgICAgICAgIDBcbiAgYWJzb2x1dGU6ICAgICAgICAgIGZhbHNlXG4gIG5iVmFsdWVzOiAgICAgICAgICAwXG4gIG1heE5iVmFsdWVzOiAgICAgICA1MTJcbiAgbWlycm9yOiAgICAgICAgICAgIHRydWVcblxuICBjb25zdHJ1Y3RvcjogKG9wdHM9e30pLT5cbiAgICBzdXBlclxuXG4gICAgIyBTZXQgcGFyYW1ldGVyc1xuICAgIGRlZmF1bHRzID1cbiAgICAgIG1heExlbmd0aDogICAgICAgICAyMDBcbiAgICAgIG1pbkxlbmd0aDogICAgICAgICA1MFxuICAgICAgcmFkaXVzOiAgICAgICAgICAgIDI1MFxuICAgICAgaW50ZXJwb2xhdGlvblRpbWU6IDE1MFxuICAgICAgY29sb3I6ICAgICAgICAgICAgIDB4RkZGRkZGXG4gICAgICBsaW5lRm9yY2VVcDogICAgICAgLjVcbiAgICAgIGxpbmVGb3JjZURvd246ICAgICAuNVxuICAgICAgYWJzb2x1dGU6ICAgICAgICAgIGZhbHNlXG4gICAgICBuYlZhbHVlczogICAgICAgICAgMjU2ICMgTWF4aW11bSA1MTIgdmFsdWVzXG4gICAgICBtaXJyb3I6ICAgICAgICAgICAgdHJ1ZVxuICAgICAgbGluZXdpZHRoOiAgICAgICAgIDJcblxuICAgIG9wdHMgICAgICAgICAgICAgICA9IF9Db2ZmZWUubWVyZ2UoZGVmYXVsdHMsIG9wdHMpXG4gICAgQG1pbkxlbmd0aCAgICAgICAgID0gb3B0cy5taW5MZW5ndGhcbiAgICBAbWF4TGVuZ3RoICAgICAgICAgPSBvcHRzLm1heExlbmd0aFxuICAgIEByYWRpdXMgICAgICAgICAgICA9IG9wdHMucmFkaXVzXG4gICAgQGludGVycG9sYXRpb25UaW1lID0gb3B0cy5pbnRlcnBvbGF0aW9uVGltZVxuICAgIEBjb2xvciAgICAgICAgICAgICA9IG9wdHMuY29sb3JcbiAgICBAbGluZUZvcmNlVXAgICAgICAgPSBvcHRzLmxpbmVGb3JjZVVwXG4gICAgQGxpbmVGb3JjZURvd24gICAgID0gb3B0cy5saW5lRm9yY2VEb3duXG4gICAgQGFic29sdXRlICAgICAgICAgID0gb3B0cy5hYnNvbHV0ZVxuICAgIEBuYlZhbHVlcyAgICAgICAgICA9IG9wdHMubmJWYWx1ZXNcbiAgICBAbWlycm9yICAgICAgICAgICAgPSBvcHRzLm1pcnJvclxuICAgIEBsaW5ld2lkdGggICAgICAgICA9IG9wdHMubGluZXdpZHRoXG5cbiAgICAjIFNldCB2YWx1ZXNcbiAgICBAX2p1a2Vib3ggICA9IFNQQUNFLlNjZW5lTWFuYWdlci5jdXJyZW50U2NlbmUuX2p1a2Vib3hcbiAgICBAY2VudGVyICAgICA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICBAX3ZhbHVlcyAgICA9IEBtdXRlKGZhbHNlKVxuICAgIEBfbmV3VmFsdWVzID0gQG11dGUoZmFsc2UpXG4gICAgQHNldFJhZGl1cyhAcmFkaXVzKVxuICAgIFxuICAgIEBnZW5lcmF0ZSgpXG5cbiAgICBAX2V2ZW50cygpXG4gICAgQHVwZGF0ZVZhbHVlcygpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFRSQUNLLklTX1NUT1BQRUQudHlwZSwgQF9lVHJhY2tJc1N0b3BwZWQpXG5cbiAgX2VUcmFja0lzU3RvcHBlZDogPT5cbiAgICBAbXV0ZSgpXG5cbiAgc2V0UmFkaXVzOiAocmFkaXVzKS0+IFxuICAgIEByYWRpdXMgPSByYWRpdXMgXG4gICAgQHJhZGl1cyA9IHdpbmRvdy5pbm5lcldpZHRoICogMC42IGlmIHdpbmRvdy5pbm5lcldpZHRoIC0gMTAwIDwgcmFkaXVzIFxuXG4gIHNldE5iVmFsdWVzOiAobmJWYWx1ZXMpLT5cbiAgICBAbmJWYWx1ZXMgPSBuYlZhbHVlc1xuICAgIEBtdXRlKClcblxuICBzZXRWYWx1ZXM6ICh2YWx1ZXMpLT5cbiAgICBpZiBAbWlycm9yXG4gICAgICBkYXRhcyAgPSBBcnJheShAbmJWYWx1ZXMpXG4gICAgICBmb3IgaSBpbiBbMC4uKChAbmJWYWx1ZXMqLjUpLTEpXVxuICAgICAgICBkYXRhc1tpXSA9IGRhdGFzW0BuYlZhbHVlcy0xLWldID0gdmFsdWVzW2ldXG4gICAgICB2YWx1ZXMgPSBkYXRhc1xuXG4gICAgbmV3VmFsdWVzID0gQG11dGUoZmFsc2UpXG4gICAgZm9yIHZhbHVlLCBpIGluIHZhbHVlc1xuICAgICAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSkgaWYgQGFic29sdXRlXG4gICAgICBsZW5ndGggPSBAbWluTGVuZ3RoICsgcGFyc2VGbG9hdCh2YWx1ZSkqKEBtYXhMZW5ndGggLSBAbWluTGVuZ3RoKVxuICAgICAgbmV3VmFsdWVzW2ldID0gTWF0aC5tYXgobGVuZ3RoLCAwKVxuICAgIEBfbmV3VmFsdWVzID0gbmV3VmFsdWVzXG4gICAgQHJlc2V0SW50ZXJwb2xhdGlvbigpXG5cbiAgZ2VuZXJhdGU6IC0+XG4gICAgQG11dGUoKVxuXG4gICAgQG1hdGVyaWFsICAgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQGNvbG9yLCBsaW5ld2lkdGg6IEBsaW5ld2lkdGggfSlcbiAgICBAbGluZXMgICAgICA9IFtdXG5cbiAgICBAcmVmcmVzaCgwKVxuICAgIEB1cGRhdGVHZW9tZXRyaWVzKHRydWUpXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cbiAgICBAcmVmcmVzaChkZWx0YSlcblxuICByZWZyZXNoOiAoZGVsdGEpLT5cbiAgICBAX3RpbWUgKz0gZGVsdGFcbiAgICB0ID0gQF90aW1lIC8gQGludGVycG9sYXRpb25UaW1lXG4gICAgcmV0dXJuIGlmIHQgPiAxXG5cbiAgICBmb3IgaSBpbiBbMC4uKEBtYXhOYlZhbHVlcy0xKV1cbiAgICAgIGRpZmYgICAgICAgID0gQF92YWx1ZXNbaV0gLSBAX25ld1ZhbHVlc1tpXVxuICAgICAgQF92YWx1ZXNbaV0gPSBAX3ZhbHVlc1tpXSAtIHQgKiBkaWZmXG4gICAgQHVwZGF0ZUdlb21ldHJpZXMoKVxuXG4gIHVwZGF0ZVZhbHVlczogPT5cbiAgICBpZiBAX2p1a2Vib3guY3VycmVudCBhbmQgQF9qdWtlYm94LmN1cnJlbnQuc3RhdGUgPT0gU1BBQ0UuVHJhY2suSVNfUExBWUlOR1xuICAgICAgQHNldFZhbHVlcyhAX2p1a2Vib3guY3VycmVudC50aW1lZGF0YSlcbiAgICBzZXRUaW1lb3V0KEB1cGRhdGVWYWx1ZXMsIEBpbnRlcnBvbGF0aW9uVGltZSAqIDAuMTUpXG5cbiAgdXBkYXRlR2VvbWV0cmllczogKGNyZWF0ZT1mYWxzZSktPlxuICAgIGZvciBsZW5ndGgsIGkgaW4gQF92YWx1ZXNcbiAgICAgIGFuZ2xlICA9IE1hdGguUEkgKiAyICogaSAvIEBuYlZhbHVlc1xuXG4gICAgICBmcm9tID0gQGNvbXB1dGVQb3NpdGlvbihAY2VudGVyLCBhbmdsZSwgQHJhZGl1cy1sZW5ndGgqQGxpbmVGb3JjZURvd24pXG4gICAgICB0byAgID0gQGNvbXB1dGVQb3NpdGlvbihAY2VudGVyLCBhbmdsZSwgQHJhZGl1cytsZW5ndGgqQGxpbmVGb3JjZVVwKVxuXG4gICAgICBpZiB0eXBlb2YgQGxpbmVzW2ldID09ICd1bmRlZmluZWQnXG4gICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KClcbiAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChmcm9tLCB0bywgZnJvbSlcblxuICAgICAgICBsaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIEBtYXRlcmlhbClcbiAgICAgICAgQGxpbmVzLnB1c2gobGluZSlcbiAgICAgICAgQGFkZChsaW5lKVxuICAgICAgZWxzZVxuICAgICAgICBsaW5lID0gQGxpbmVzW2ldXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNbMF0gPSBmcm9tXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNbMV0gPSB0b1xuICAgICAgICBsaW5lLmdlb21ldHJ5LnZlcnRpY2VzWzJdID0gZnJvbVxuICAgICAgICBsaW5lLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWVcblxuICByYW5kb206IChzZXRWYWx1ZXM9dHJ1ZSk9PlxuICAgIHZhbHVlcyA9IFtdXG4gICAgZm9yIGkgaW4gWzAuLihAbWF4TmJWYWx1ZXMtMSldXG4gICAgICB2YWx1ZXNbaV0gPSBNYXRoLnJhbmRvbSgpXG4gICAgQHNldFZhbHVlcyh2YWx1ZXMpIGlmIHNldFZhbHVlc1xuICAgIHJldHVybiB2YWx1ZXNcblxuICBtdXRlOiAoc2V0VmFsdWVzPXRydWUpLT5cbiAgICB2YWx1ZXMgPSBbXVxuICAgIGZvciBpIGluIFswLi4oQG1heE5iVmFsdWVzLTEpXVxuICAgICAgdmFsdWVzW2ldID0gMFxuICAgIEBzZXRWYWx1ZXModmFsdWVzKSBpZiBzZXRWYWx1ZXNcbiAgICByZXR1cm4gdmFsdWVzXG5cbiAgcmVzZXRJbnRlcnBvbGF0aW9uOiAtPlxuICAgIEBfdGltZSA9IDBcblxuICBjb21wdXRlUG9zaXRpb246IChwb2ludCwgYW5nbGUsIGxlbmd0aCktPlxuICAgIHggPSBwb2ludC54ICsgTWF0aC5zaW4oYW5nbGUpICogbGVuZ3RoXG4gICAgeSA9IHBvaW50LnkgKyBNYXRoLmNvcyhhbmdsZSkgKiBsZW5ndGhcbiAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoeCwgeSwgcG9pbnQueilcblxuICByZW1vdmVMaW5lRnJvbVBhcmVudDogKGluZGV4KS0+XG4gICAgcGFyZW50ID0gQGxpbmVzW2luZGV4XVxuICAgIHBhcmVudC5yZW1vdmUoQGxpbmVzW2luZGV4XSlcblxuICByZXNpemU6IC0+IFxuICAgIEBzZXRSYWRpdXMoQHJhZGl1cykgXG4gICAgICBcblxuXG5jbGFzcyBTUEFDRS5Db3ZlciBleHRlbmRzIFRIUkVFLkdyb3VwXG5cbiAgQFRFWFRVUkVTX0xPQURFRDogJ2NvdmVyX3RleHR1cmVzX2xvYWRlZCdcblxuICBsb2FkaW5nTWFuYWdlcjogbnVsbFxuICBpbWFnZUxvYWRlcjogbnVsbFxuXG4gIHBsYW5lOiBudWxsXG5cbiAgcGxheWxpc3Q6IG51bGxcblxuICB0ZXh0dXJlMDogbnVsbFxuICB0ZXh0dXJlMTogbnVsbFxuXG4gIGZvdjogMFxuICBhc3BlY3Q6IDBcbiAgZGlzdGFuY2U6IDBcblxuICB0RmFkZTogMVxuICB0U2NhbGU6IDFcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlclxuICAgIEBfc2V0dXAoKVxuICAgIEBfZXZlbnRzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoU1BBQ0UuVHJhY2suSVNfUExBWUlORy50eXBlLCBAX2VUcmFja0lzUGxheWluZylcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFNQQUNFLlRyYWNrLklTX1BBVVNFRC50eXBlLCBAX2VUcmFja0lzUGF1c2VkKVxuICAgICMgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihTUEFDRS5UcmFjay5JU19MT0FERUQudHlwZSwgQF9lVHJhY2tJc0xvYWRlZClcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFNQQUNFLlRyYWNrLldJTExfUExBWS50eXBlLCBAX2VKdWtlYm94V2lsbFBsYXkpXG5cbiAgICAkKCcjbG9hZGluZywgI2luZm9ybWF0aW9uIHNwYW4nKS5vbiAnY2xpY2snLCAoZSktPlxuICAgICAgaWYgJCgnI2xvYWRpbmcnKS5oYXNDbGFzcygncmVhZHknKSBhbmQgd2luZG93LldlYkF1ZGlvQVBJXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICB3aW5kb3cuV2ViQXVkaW9BUEkucGxheSgpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gIF9lSnVrZWJveFdpbGxQbGF5OiAoZSk9PlxuICAgIEBuZXh0KClcbiAgICAkKCcjaW5mb3JtYXRpb24gaDEnKS5hZGRDbGFzcygnaGlkZGVuJylcbiAgICAkKCcjaW5mb3JtYXRpb24gaDInKS5hZGRDbGFzcygnaGlkZGVuJylcblxuICBfZVRyYW5zaXRpb25FbmRlZDogKGUpPT5cbiAgICBIRUxQRVIudHJpZ2dlcihFVkVOVC5Db3Zlci5UUkFOU0lUSU9OX0VOREVEKVxuXG4gIF9lVHJhY2tJc1BsYXlpbmc6IChlKT0+XG4gICAgJCgnI2luZm9ybWF0aW9uIGgxJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG4gICAgJCgnI2luZm9ybWF0aW9uIGgyJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG4gICAgJCgnI2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZGVuJylcblxuICBfZVRyYWNrSXNQYXVzZWQ6IChlKT0+XG4gICAgJCgnI2xvYWRpbmcnKS5yZW1vdmVDbGFzcygnaGlkZGVuJylcbiAgICAkKCcjbG9hZGluZyBpLmljbicpLnJlbW92ZUNsYXNzKCdwbGF5JylcbiAgICAkKCcjbG9hZGluZyBpLmljbicpLmFkZENsYXNzKCdwYXVzZScpXG5cbiAgX2VUcmFja0lzTG9hZGVkOiAoZSk9PlxuICAgIHVubGVzcyAkKCcjbG9hZGluZycpLmhhc0NsYXNzKCdyZWFkeScpXG4gICAgICAkKCcjbG9hZGluZycpLmFkZENsYXNzKCdyZWFkeScpXG4gICAgICAkKCcjbG9hZGluZyBwJykuaHRtbCgnVGFwIGluIHRoZSBtaWRkbGU8YnI+dG8gcGxheSBvciBwYXVzZScpXG5cbiAgICB0cmFjayAgICA9IGUub2JqZWN0LnRyYWNrXG4gICAgdGl0bGUgICAgPSB0cmFjay5kYXRhLnRpdGxlXG4gICAgdXNlcm5hbWUgPSB0cmFjay5kYXRhLmF1dGhvclxuICAgIHVzZXJfdXJsID0gdHJhY2suZGF0YS5hdXRob3JfdXJsXG5cbiAgICAkKCcjaW5mb3JtYXRpb24gaDEnKS5odG1sKHRpdGxlKVxuICAgICQoJyNpbmZvcm1hdGlvbiBoMicpLmh0bWwoJ2J5IDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInK3VzZXJfdXJsKydcIj4nK3VzZXJuYW1lKyc8L2E+JylcblxuICAgIGNzcyA9IFwiXCJcIlxuICAgICAgICBhIHsgY29sb3I6IFwiXCJcIit0cmFjay5kYXRhLmNvbG9yMStcIlwiXCIgIWltcG9ydGFudDsgfVxuICAgICAgICBib2R5IHsgY29sb3I6IFwiXCJcIit0cmFjay5kYXRhLmNvbG9yMitcIlwiXCIgIWltcG9ydGFudDsgfVxuICAgIFwiXCJcIlxuICAgICQoJy5jb3Zlci1zdHlsZScpLmh0bWwoY3NzKVxuXG4gICAgbmV4dFRyYWNrID0gQHBsYXlsaXN0WzBdXG4gICAgZm9yIHRyYWNrRGF0YSwgaSBpbiBAcGxheWxpc3RcbiAgICAgIGlmIHRyYWNrRGF0YS5jb3ZlciA9PSB0cmFjay5kYXRhLmNvdmVyXG4gICAgICAgIG5leHRUcmFjayA9IEBwbGF5bGlzdFtpKzFdIGlmIGkrMSA8IEBwbGF5bGlzdC5sZW5ndGhcbiAgICAgICAgYnJlYWtcblxuICAgIEB0ZXh0dXJlTG9hZGVyLmxvYWQgJ3Jlc291cmNlcy9jb3ZlcnMvJyt0cmFjay5kYXRhLmNvdmVyLCAodGV4dHVyZSk9PlxuICAgICAgQHRleHR1cmUwID0gdGV4dHVyZVxuICAgICAgQF90ZXh0dXJlTG9hZGVkKClcbiAgICBAdGV4dHVyZUxvYWRlci5sb2FkICdyZXNvdXJjZXMvY292ZXJzLycrbmV4dFRyYWNrLmNvdmVyLCAodGV4dHVyZSk9PlxuICAgICAgQHRleHR1cmUxID0gdGV4dHVyZVxuICAgICAgQF90ZXh0dXJlTG9hZGVkKClcblxuICAgICQoJy5ibHVycmllZCBsaSBkaXYnKS5jc3MoeyBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCB9KVxuICAgICQoJy5ibHVycmllZCBsaSBkaXYnKS5sYXN0KCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChyZXNvdXJjZXMvY292ZXJzLycrdHJhY2suZGF0YS5jb3ZlcisnKScpXG4gICAgJCgnLmJsdXJyaWVkIGxpIGRpdicpLmZpcnN0KCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChyZXNvdXJjZXMvY292ZXJzLycrbmV4dFRyYWNrLmNvdmVyKycpJylcblxuICBfc2V0dXA6IC0+XG4gICAgQGxvYWRpbmdNYW5hZ2VyICAgICAgICA9IG5ldyBUSFJFRS5Mb2FkaW5nTWFuYWdlcigpXG4gICAgQGxvYWRpbmdNYW5hZ2VyLm9uTG9hZCA9IEBfc2V0dXBQbGFuZVxuICAgIEBpbWFnZUxvYWRlciAgICAgICAgICAgPSBuZXcgVEhSRUUuSW1hZ2VMb2FkZXIoQGxvYWRpbmdNYW5hZ2VyKVxuICAgIEB0ZXh0dXJlTG9hZGVyICAgICAgICAgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcihAbG9hZGluZ01hbmFnZXIpXG4gICAgQGxvYWRlciAgICAgICAgICAgICAgICA9IG5ldyBUSFJFRS5YSFJMb2FkZXIoQGxvYWRpbmdNYW5hZ2VyKVxuXG4gIGxvYWQ6IChwbGF5bGlzdCktPlxuICAgIEBwbGF5bGlzdCA9IHBsYXlsaXN0XG5cbiAgICBmb3IgdHJhY2sgaW4gcGxheWxpc3RcbiAgICAgIEBpbWFnZUxvYWRlci5sb2FkICdyZXNvdXJjZXMvY292ZXJzLycrdHJhY2suY292ZXIsIChpbWFnZSk9PlxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgQGxvYWRlci5sb2FkICdhc3NldHMvc2hhZGVycy9jb3Zlci5mcmFnJywgKGNvbnRlbnQpPT5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgQGxvYWRlci5sb2FkICdhc3NldHMvc2hhZGVycy9jb3Zlci52ZXJ0JywgKGNvbnRlbnQpPT5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgQGxvYWRlci5sb2FkICdhc3NldHMvc2hhZGVycy9nYXVzc2lhbl9ibHVyLmZyYWcnLCAoY29udGVudCk9PlxuICAgICAgcmV0dXJuIHRydWVcblxuICBfc2V0dXBQbGFuZTogPT5cbiAgICB2ZXJ0ZXhTaGFkZXIgICA9IEBsb2FkZXIuY2FjaGUuZmlsZXNbJ2Fzc2V0cy9zaGFkZXJzL2NvdmVyLnZlcnQnXVxuICAgIGZyYWdtZW50U2hhZGVyID0gQGxvYWRlci5jYWNoZS5maWxlc1snYXNzZXRzL3NoYWRlcnMvY292ZXIuZnJhZyddXG5cbiAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TaGFkZXJNYXRlcmlhbChcbiAgICAgIHVuaWZvcm1zOiBcbiAgICAgICAgdGV4dHVyZTA6IHsgdHlwZTogJ3QnLCB2YWx1ZTogbmV3IFRIUkVFLlRleHR1cmUoKSB9XG4gICAgICAgIHRleHR1cmUxOiB7IHR5cGU6ICd0JywgdmFsdWU6IG5ldyBUSFJFRS5UZXh0dXJlKCkgfVxuICAgICAgICB0ZXh0dXJlMjogeyB0eXBlOiAndCcsIHZhbHVlOiBuZXcgVEhSRUUuVGV4dHVyZSgpIH1cbiAgICAgICAgdGV4dHVyZTM6IHsgdHlwZTogJ3QnLCB2YWx1ZTogbmV3IFRIUkVFLlRleHR1cmUoKSB9XG4gICAgICAgIHJlc29sdXRpb246IHsgdHlwZTogJ3YyJywgdmFsdWU6IG5ldyBUSFJFRS5WZWN0b3IyKCkgfVxuICAgICAgICBhVGltZTogeyB0eXBlOiAnZicsIHZhbHVlOiAwIH1cbiAgICAgICAgdEZhZGU6IHsgdHlwZTogJ2YnLCB2YWx1ZTogMCB9XG4gICAgICAgIHRTY2FsZTogeyB0eXBlOiAnZicsIHZhbHVlOiAxIH1cbiAgICAgICAgcmF0aW86IHsgdHlwZTogJ3YyJywgdmFsdWU6IG5ldyBUSFJFRS5WZWN0b3IyKCkgfVxuICAgICAgYXR0cmlidXRlczogXG4gICAgICAgIFQxQ29vcmRzOiB7IHR5cGU6ICd2MicsIHZhbHVlOiBbXSB9XG4gICAgICB2ZXJ0ZXhTaGFkZXI6IHZlcnRleFNoYWRlclxuICAgICAgZnJhZ21lbnRTaGFkZXI6IGZyYWdtZW50U2hhZGVyXG4gICAgKVxuXG4gICAgQHBsYW5lID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMSwgMSksIG1hdGVyaWFsKVxuICAgIEBwbGFuZS5wb3NpdGlvbi56ID0gLTFcbiAgICBAYWRkKEBwbGFuZSlcblxuICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLkNvdmVyLlRFWFRVUkVTX0xPQURFRClcblxuICAgIEBsb2FkaW5nTWFuYWdlci5vbkxvYWQgPSBAX3RleHR1cmVMb2FkZWRcblxuICAgIEB0ZXh0dXJlTG9hZGVyLmxvYWQgJ3Jlc291cmNlcy9jb3ZlcnMvJytAcGxheWxpc3RbMF0uY292ZXIsICh0ZXh0dXJlKT0+XG4gICAgICBAdGV4dHVyZTAgPSB0ZXh0dXJlXG4gICAgQHRleHR1cmVMb2FkZXIubG9hZCAncmVzb3VyY2VzL2NvdmVycy8nK0BwbGF5bGlzdFsxXS5jb3ZlciwgKHRleHR1cmUpPT5cbiAgICAgIEB0ZXh0dXJlMSA9IHRleHR1cmVcblxuICBfdGV4dHVyZUxvYWRlZDogKGEsIGIsIGMpPT5cbiAgICBpZiBAdGV4dHVyZTAgJiYgQHRleHR1cmUxXG4gICAgICBAc2V0Q292ZXJzKEB0ZXh0dXJlMCwgQHRleHR1cmUxKVxuICAgICAgQHRleHR1cmUwID0gQHRleHR1cmUxID0gbnVsbFxuXG4gIHNldENvdmVyczogKGN1cnJlbnQsIG5leHQpLT5cbiAgICBAdEZhZGUgID0gMVxuICAgIEB0U2NhbGUgPSAwLjc1XG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRTY2FsZS52YWx1ZSA9IEB0U2NhbGVcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudEZhZGUudmFsdWUgID0gQHRGYWRlXG5cbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTAudmFsdWUgPSBjdXJyZW50XG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUxLnZhbHVlID0gbmV4dFxuICAgIFxuICAgIEBfc2V0U2l6ZUZyb21UZXh0dXJlcyhjdXJyZW50LCBuZXh0KVxuICAgIEBfb3RoZXJDb21wdXRlKGN1cnJlbnQsIG5leHQpXG5cbiAgcmVzaXplOiAtPlxuICAgIHQwID0gQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUwLnZhbHVlXG4gICAgdDEgPSBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTEudmFsdWVcbiAgICBAX3NldFNpemVGcm9tVGV4dHVyZXModDAsIHQxKVxuXG4gIF9zZXRTaXplRnJvbVRleHR1cmVzOiAodGV4dHVyZTAsIHRleHR1cmUxKS0+XG5cbiAgICAjIFBsYW5lIGZpbGwgYWxsIHRoZSBzY3JlZW5cbiAgICB0ZXh0dXJlMFdpZHRoICA9IHRleHR1cmUwLmltYWdlLndpZHRoXG4gICAgdGV4dHVyZTBIZWlnaHQgPSB0ZXh0dXJlMC5pbWFnZS5oZWlnaHRcblxuICAgIG1hbmFnZXIgID0gU1BBQ0UuU2NlbmVNYW5hZ2VyXG4gICAgZm92ICAgICAgPSBtYW5hZ2VyLmNhbWVyYS5mb3YgLyAxODAgKiBNYXRoLlBJXG4gICAgYXNwZWN0ICAgPSB0ZXh0dXJlMFdpZHRoIC8gdGV4dHVyZTBIZWlnaHRcbiAgICBkaXN0YW5jZSA9IG1hbmFnZXIuY2FtZXJhLnBvc2l0aW9uLnogKyAxO1xuICAgIHJhdGlvICAgID0gTWF0aC5tYXgoMSwgbWFuYWdlci5jYW1lcmEuYXNwZWN0IC8gYXNwZWN0KVxuXG4gICAgd2lkdGggID0gMiAqIGFzcGVjdCAqIE1hdGgudGFuKGZvdiAvIDIpICogZGlzdGFuY2UgKiByYXRpb1xuICAgIGhlaWdodCA9IDIgKiBNYXRoLnRhbihmb3YgLyAyKSAqIGRpc3RhbmNlICogcmF0aW9cblxuICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy5yZXNvbHV0aW9uLnZhbHVlLnggPSB3aWR0aFxuICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy5yZXNvbHV0aW9uLnZhbHVlLnkgPSBoZWlnaHRcbiAgICBAcGxhbmUuc2NhbGUuc2V0KHdpZHRoLCBoZWlnaHQsIDEpXG5cbiAgX290aGVyQ29tcHV0ZTogKHRleHR1cmUwLCB0ZXh0dXJlMSktPlxuICAgICMgU2V0IHRleHR1cmUxIGNvb3JkaW5hdGVzXG4gICAgdGV4dHVyZTBXaWR0aCAgPSB0ZXh0dXJlMC5pbWFnZS53aWR0aFxuICAgIHRleHR1cmUwSGVpZ2h0ID0gdGV4dHVyZTAuaW1hZ2UuaGVpZ2h0XG4gICAgdGV4dHVyZTFXaWR0aCAgPSB0ZXh0dXJlMS5pbWFnZS53aWR0aFxuICAgIHRleHR1cmUxSGVpZ2h0ID0gdGV4dHVyZTEuaW1hZ2UuaGVpZ2h0XG5cbiAgICB0ZXh0dXJlMUhlaWdodCA9ICh0ZXh0dXJlMUhlaWdodCAqIHRleHR1cmUwV2lkdGgpIC8gdGV4dHVyZTFXaWR0aFxuICAgIHRleHR1cmUxV2lkdGggID0gdGV4dHVyZTBXaWR0aFxuXG4gICAgcmF0aW8gPSAoMS4wIC0gKHRleHR1cmUxSGVpZ2h0IC8gdGV4dHVyZTBIZWlnaHQpKSAqIDAuNVxuXG4gICAgdjAgPSBuZXcgVEhSRUUuVmVjdG9yMigwLCAwLjAgLSByYXRpbylcbiAgICB2MSA9IG5ldyBUSFJFRS5WZWN0b3IyKDAsIDEuMCArIHJhdGlvKVxuICAgIHYyID0gbmV3IFRIUkVFLlZlY3RvcjIoMS4wLCAxLjAgKyByYXRpbylcbiAgICB2MyA9IG5ldyBUSFJFRS5WZWN0b3IyKDEuMCwgMC4wIC0gcmF0aW8pXG5cbiAgICBjb29yZHMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IEBwbGFuZS5tYXRlcmlhbC5hdHRyaWJ1dGVzLlQxQ29vcmRzLnZhbHVlXG4gICAgY29vcmRzWzBdICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB2MVxuICAgIGNvb3Jkc1sxXSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdjJcbiAgICBjb29yZHNbMl0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYwXG4gICAgY29vcmRzWzNdICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB2M1xuICAgIEBwbGFuZS5tYXRlcmlhbC5hdHRyaWJ1dGVzLlQxQ29vcmRzLnZhbHVlICAgICAgID0gY29vcmRzXG4gICAgQHBsYW5lLm1hdGVyaWFsLmF0dHJpYnV0ZXMuVDFDb29yZHMubmVlZHNVcGRhdGUgPSB0cnVlXG5cbiAgICAjIFJFTkRFUiBUTyBURVhUVVJFXG4gICAgQF9wcmVwYXJlUlRUKClcblxuICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMi52YWx1ZSA9IEBydDBcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTMudmFsdWUgPSBAcnQxXG5cbiAgICBAX3JlbmRlclRvVGV4dHVyZSh0ZXh0dXJlMC5pbWFnZS5zcmMsIEBydDApXG4gICAgQF9yZW5kZXJUb1RleHR1cmUodGV4dHVyZTEuaW1hZ2Uuc3JjLCBAcnQxKVxuXG4gIG5leHQ6IC0+XG4gICAgJChAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudFNjYWxlKS5hbmltYXRlKHsgdmFsdWU6IDAuOSB9LCAzNTApXG4gICAgJChAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudEZhZGUpLmFuaW1hdGUoeyB2YWx1ZTogMC4wIH0sIDM1MClcbiAgICBzZXRUaW1lb3V0KEBfZVRyYW5zaXRpb25FbmRlZCwgMzUwKVxuXG4gIHVwZGF0ZTogKGRlbHRhKS0+XG4gICAgaWYgQHBsYW5lXG4gICAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMuYVRpbWUudmFsdWUgKz0gZGVsdGEgKiAwLjAwMVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICBjYW1lcmFSVFQ6IG51bGxcbiAgc2NlbmVSVFQ6ICBudWxsXG4gIHJ0MTogICAgICAgIG51bGxcbiAgcnQyOiAgICAgICAgbnVsbFxuXG4gIGNvbXBvc2VyOiAgIG51bGxcbiAgaEJsdXI6ICAgICAgbnVsbFxuICB2Qmx1cjogICAgICBudWxsXG4gIHJlbmRlclBhc3M6IG51bGxcbiAgZWZmZWN0Q29weTogbnVsbFxuXG4gIF9wcmVwYXJlUlRUOiA9PlxuICAgIHQwICAgICA9IEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMC52YWx1ZVxuICAgIHdpZHRoICA9IEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy5yZXNvbHV0aW9uLnZhbHVlLnhcbiAgICBoZWlnaHQgPSBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMucmVzb2x1dGlvbi52YWx1ZS55XG5cbiAgICBAY2FtZXJhUlRUID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKVxuICAgIEBjYW1lcmFSVFQucG9zaXRpb24uc2V0Wig2MDApXG5cbiAgICBAc2NlbmVSVFQgPSBuZXcgVEhSRUUuU2NlbmUoKVxuXG4gICAgQHJ0MCAgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCwgeyBtaW5GaWx0ZXI6IFRIUkVFLkxpbmVhckZpbHRlciwgbWFnRmlsdGVyOiBUSFJFRS5OZWFyZXN0RmlsdGVyLCBmb3JtYXQ6IFRIUkVFLlJHQkZvcm1hdCB9KVxuICAgIEBydDEgID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHsgbWluRmlsdGVyOiBUSFJFRS5MaW5lYXJGaWx0ZXIsIG1hZ0ZpbHRlcjogVEhSRUUuTmVhcmVzdEZpbHRlciwgZm9ybWF0OiBUSFJFRS5SR0JGb3JtYXQgfSlcblxuICAgIEBoQmx1ciAgICAgICAgICAgICAgICAgID0gbmV3IFRIUkVFLlNoYWRlclBhc3MoVEhSRUUuSG9yaXpvbnRhbEJsdXJTaGFkZXIpO1xuICAgIEBoQmx1ci5lbmFibGVkICAgICAgICAgID0gdHJ1ZTtcbiAgICBAaEJsdXIudW5pZm9ybXMuaC52YWx1ZSA9IDEgLyB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgIEB2Qmx1ciAgICAgICAgICAgICAgICAgID0gbmV3IFRIUkVFLlNoYWRlclBhc3MoVEhSRUUuVmVydGljYWxCbHVyU2hhZGVyKTtcbiAgICBAdkJsdXIuZW5hYmxlZCAgICAgICAgICA9IHRydWU7XG4gICAgQHZCbHVyLnVuaWZvcm1zLnYudmFsdWUgPSAxIC8gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgQHJlbmRlclBhc3MgPSBuZXcgVEhSRUUuUmVuZGVyUGFzcyhAc2NlbmVSVFQsIEBjYW1lcmFSVFQpXG5cbiAgICBAZWZmZWN0Q29weSA9IG5ldyBUSFJFRS5TaGFkZXJQYXNzKFRIUkVFLkNvcHlTaGFkZXIpXG5cbiAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpXG5cbiAgICBAcGxhbmVSVFQgICAgICAgICAgICA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KDEuMCwgMS4wKSwgbWF0ZXJpYWwpXG4gICAgQHBsYW5lUlRULnBvc2l0aW9uLnogPSAtMVxuICAgIEBwbGFuZVJUVC5zY2FsZS5zZXQoQHBsYW5lLnNjYWxlLngsIEBwbGFuZS5zY2FsZS55LCAxLjApXG4gICAgQHNjZW5lUlRULmFkZChAcGxhbmVSVFQpXG5cbiAgX3JlbmRlclRvVGV4dHVyZTogKHRleHR1cmVVcmwsIHRhcmdldCktPlxuICAgIEB0ZXh0dXJlTG9hZGVyLmxvYWQgdGV4dHVyZVVybCwgKHRleHR1cmUpPT5cbiAgICAgIEBwbGFuZVJUVC5tYXRlcmlhbC5tYXAgPSB0ZXh0dXJlXG4gICAgICBtYW5hZ2VyICAgICAgICAgICAgICAgID0gU1BBQ0UuU2NlbmVNYW5hZ2VyXG5cbiAgICAgIGRlbGV0ZSBAY29tcG9zZXJcblxuICAgICAgQGNvbXBvc2VyICAgPSBuZXcgVEhSRUUuRWZmZWN0Q29tcG9zZXIobWFuYWdlci5yZW5kZXJlciwgdGFyZ2V0KVxuICAgICAgQGNvbXBvc2VyLmFkZFBhc3MoQHJlbmRlclBhc3MpXG4gICAgICBAY29tcG9zZXIuYWRkUGFzcyhAaEJsdXIpXG4gICAgICBAY29tcG9zZXIuYWRkUGFzcyhAdkJsdXIpXG4gICAgICBAY29tcG9zZXIuYWRkUGFzcyhAZWZmZWN0Q29weSlcbiAgICAgIEBjb21wb3Nlci5yZW5kZXIoMC4wMSlcblxuXG4oLT5cbiAgc2NlbmVzID0gWydNYWluU2NlbmUnXVxuXG4gIFNQQUNFLlNjZW5lTWFuYWdlciA9IG5ldyBTUEFDRS5TY2VuZU1hbmFnZXIoKVxuICBmb3Igc2NlbmUgaW4gc2NlbmVzXG4gICAgU1BBQ0UuU2NlbmVNYW5hZ2VyLmNyZWF0ZVNjZW5lKHNjZW5lKVxuXG4gIFNQQUNFLlNjZW5lTWFuYWdlci5nb1RvU2NlbmUoJ01haW5TY2VuZScpXG4pKClcblxuXG4iXX0=