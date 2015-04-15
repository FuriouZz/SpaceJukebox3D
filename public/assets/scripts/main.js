var AirportState, JUKEBOX, JukeboxState, Keyboard, SPACE, SearchEngineState, SpaceshipState, TRACK, WebAudioAPI, _Coffee, _Math, _THREE,
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

  Cover.prototype.tMove = 1;

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
        tMove: {
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
    this._resetTimeline();
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
    this._resetTimeline();
    return $(this).animate({
      tScale: 0.75
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

  Cover.prototype._resetTimeline = function() {
    this.tScale = 1.0;
    this.tMove = 0.0;
    this.plane.material.uniforms.tScale.value = 1.0;
    return this.plane.material.uniforms.tMove.value = 0.0;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsbUlBQUE7RUFBQTs7NkJBQUE7O0FBQUEsS0FBQSxHQUFRLEtBQUEsSUFBUyxFQUFqQixDQUFBOztBQUFBLEtBRUssQ0FBQyxHQUFOLEdBQW1CLGFBRm5CLENBQUE7O0FBQUEsS0FLSyxDQUFDLEdBQU4sR0FBbUIsRUFMbkIsQ0FBQTs7QUFBQSxLQU1LLENBQUMsVUFBTixHQUFvQixNQUFNLENBQUMsZ0JBQVAsSUFBMkIsQ0FOL0MsQ0FBQTs7QUFBQSxLQVNLLENBQUMsS0FBTixHQUFjLEVBVGQsQ0FBQTs7QUFBQSxLQVlLLENBQUMsRUFBTixHQUFXLENBQUMsU0FBQSxHQUFBO0FBQ1YsTUFBQSxNQUFBO0FBQUEsRUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO0FBQ0EsRUFBQSxJQUFHLEtBQUssQ0FBQyxHQUFOLEtBQWEsYUFBaEI7QUFDRSxJQUFBLE1BQU0sQ0FBQyxFQUFQLEdBQVksa0NBQVosQ0FERjtHQUFBLE1BQUE7QUFHRSxJQUFBLE1BQU0sQ0FBQyxFQUFQLEdBQVksa0NBQVosQ0FIRjtHQURBO0FBQUEsRUFLQSxNQUFNLENBQUMsWUFBUCxHQUFzQixNQUFNLENBQUMsUUFBUSxDQUFDLE1BTHRDLENBQUE7QUFNQSxTQUFPLE1BQVAsQ0FQVTtBQUFBLENBQUQsQ0FBQSxDQUFBLENBWlgsQ0FBQTs7QUFBQSxLQXdCSyxDQUFDLEdBQU4sR0FBbUIsU0FBQyxHQUFELEVBQU0sTUFBTixHQUFBO0FBQ2pCLE1BQUEsc0JBQUE7O0lBRHVCLFNBQU87R0FDOUI7QUFBQSxFQUFBLElBQUEsQ0FBQSxtQkFBMEIsQ0FBQyxJQUFwQixDQUF5QixLQUFLLENBQUMsR0FBL0IsQ0FBUDtBQUNJLElBQUEsSUFBQSxHQUFlLElBQUEsSUFBQSxDQUFBLENBQWYsQ0FBQTtBQUFBLElBQ0EsT0FBQSxHQUFXLElBQUksQ0FBQyxZQUFMLENBQUEsQ0FEWCxDQUFBO0FBQUEsSUFFQSxPQUFBLEdBQVcsT0FBTyxDQUFDLE1BQVIsQ0FBZSxDQUFmLEVBQWtCLENBQWxCLENBRlgsQ0FBQTtBQUFBLElBR0EsT0FBQSxHQUFXLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBQSxHQUFpQixHQUg1QixDQUFBO0FBQUEsSUFJQSxPQUFBLElBQVcsQ0FBQyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQUEsR0FBZ0IsQ0FBakIsQ0FBQSxHQUFzQixHQUpqQyxDQUFBO0FBQUEsSUFLQSxPQUFBLElBQVcsSUFBSSxDQUFDLFdBQUwsQ0FBQSxDQUxYLENBQUE7V0FNQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQUEsR0FBUSxLQUFSLEdBQWMsT0FBZCxHQUFzQixLQUF0QixHQUE0QixHQUF4QyxFQUE2QyxNQUE3QyxFQVBKO0dBRGlCO0FBQUEsQ0F4Qm5CLENBQUE7O0FBQUEsS0FrQ0ssQ0FBQyxJQUFOLEdBQW1CLFNBQUMsT0FBRCxHQUFBO1NBQ2pCLEtBQUssQ0FBQyxHQUFOLENBQVUsV0FBQSxHQUFjLE9BQXhCLEVBQWlDLGdCQUFqQyxFQURpQjtBQUFBLENBbENuQixDQUFBOztBQUFBLEtBcUNLLENBQUMsTUFBTixHQUFtQixTQUFDLFNBQUQsRUFBWSxNQUFaLEdBQUE7QUFDakIsRUFBQSxJQUFZLFNBQVo7QUFBQSxJQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUE7R0FBQTtBQUNBLFNBQU8sU0FBUCxDQUZpQjtBQUFBLENBckNuQixDQUFBOztBQUFBLE9BMENBLEdBQ0U7QUFBQSxFQUFBLFlBQUEsRUFBa0IsSUFBQSxLQUFBLENBQU0sc0JBQU4sQ0FBbEI7QUFBQSxFQUNBLFdBQUEsRUFBa0IsSUFBQSxLQUFBLENBQU0scUJBQU4sQ0FEbEI7QUFBQSxFQUVBLE9BQUEsRUFBa0IsSUFBQSxLQUFBLENBQU0saUJBQU4sQ0FGbEI7QUFBQSxFQUdBLE9BQUEsRUFBa0IsSUFBQSxLQUFBLENBQU0saUJBQU4sQ0FIbEI7QUFBQSxFQUlBLFVBQUEsRUFBa0IsSUFBQSxLQUFBLENBQU0sb0JBQU4sQ0FKbEI7QUFBQSxFQUtBLFVBQUEsRUFBa0IsSUFBQSxLQUFBLENBQU0sb0JBQU4sQ0FMbEI7QUFBQSxFQU1BLFlBQUEsRUFBa0IsSUFBQSxLQUFBLENBQU0sc0JBQU4sQ0FObEI7Q0EzQ0YsQ0FBQTs7QUFBQSxNQWtETSxDQUFDLE1BQVAsQ0FBYyxPQUFkLENBbERBLENBQUE7O0FBQUEsS0FvREEsR0FDRTtBQUFBLEVBQUEsVUFBQSxFQUFnQixJQUFBLEtBQUEsQ0FBTSxrQkFBTixDQUFoQjtBQUFBLEVBQ0EsU0FBQSxFQUFnQixJQUFBLEtBQUEsQ0FBTSxpQkFBTixDQURoQjtBQUFBLEVBRUEsVUFBQSxFQUFnQixJQUFBLEtBQUEsQ0FBTSxrQkFBTixDQUZoQjtDQXJERixDQUFBOztBQUFBLE1Bd0RNLENBQUMsTUFBUCxDQUFjLEtBQWQsQ0F4REEsQ0FBQTs7QUFBQSxRQTJEQSxHQUNFO0FBQUEsRUFBQSxLQUFBLEVBQVEsRUFBUjtBQUFBLEVBQ0EsRUFBQSxFQUFRLEVBRFI7QUFBQSxFQUVBLElBQUEsRUFBUSxFQUZSO0FBQUEsRUFHQSxHQUFBLEVBQVEsRUFIUjtBQUFBLEVBSUEsTUFBQSxFQUFRLEVBSlI7Q0E1REYsQ0FBQTs7QUFBQSxjQWtFQSxHQUNFO0FBQUEsRUFBQSxJQUFBLEVBQVUsTUFBVjtBQUFBLEVBQ0EsUUFBQSxFQUFVLFVBRFY7QUFBQSxFQUVBLE9BQUEsRUFBVSxTQUZWO0FBQUEsRUFHQSxPQUFBLEVBQVUsU0FIVjtDQW5FRixDQUFBOztBQUFBLGlCQXdFQSxHQUNFO0FBQUEsRUFBQSxNQUFBLEVBQVEsUUFBUjtBQUFBLEVBQ0EsTUFBQSxFQUFRLFFBRFI7QUFBQSxFQUVBLE1BQUEsRUFBUSxRQUZSO0FBQUEsRUFHQSxjQUFBLEVBQWdCLGdCQUhoQjtDQXpFRixDQUFBOztBQUFBLFlBOEVBLEdBQ0U7QUFBQSxFQUFBLFVBQUEsRUFBWSxZQUFaO0FBQUEsRUFDQSxVQUFBLEVBQVksWUFEWjtDQS9FRixDQUFBOztBQUFBLFlBa0ZBLEdBQ0U7QUFBQSxFQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsRUFDQSxPQUFBLEVBQVMsU0FEVDtDQW5GRixDQUFBOztBQUFBLE1Bc0ZNLENBQUMsTUFBUCxDQUFjLFFBQWQsQ0F0RkEsQ0FBQTs7QUFBQSxNQXVGTSxDQUFDLE1BQVAsQ0FBYyxjQUFkLENBdkZBLENBQUE7O0FBQUEsTUF3Rk0sQ0FBQyxNQUFQLENBQWMsaUJBQWQsQ0F4RkEsQ0FBQTs7QUFBQSxNQXlGTSxDQUFDLE1BQVAsQ0FBYyxZQUFkLENBekZBLENBQUE7O0FBQUEsTUEwRk0sQ0FBQyxNQUFQLENBQWMsWUFBZCxDQTFGQSxDQUFBOztBQUFBLE1BNkZNLENBQUMsTUFBUCxHQUFnQixNQUFNLENBQUMsTUFBUCxJQUNkO0FBQUEsRUFBQSxNQUFBLEVBQVEsRUFBUjtBQUFBLEVBRUEsT0FBQSxFQUFTLFNBQUMsU0FBRCxFQUFZLE1BQVosR0FBQTtBQUNQLFFBQUEsQ0FBQTtBQUFBLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFaLENBQUEsQ0FBQTtBQUNBLElBQUEsSUFBQSxDQUFBLElBQVEsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUF1QixTQUF2QixDQUFQO0FBQ0UsTUFBQSxJQUFDLENBQUEsTUFBTyxDQUFBLFNBQUEsQ0FBUixHQUF5QixJQUFBLEtBQUEsQ0FBTSxTQUFOLENBQXpCLENBREY7S0FEQTtBQUFBLElBSUEsQ0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFPLENBQUEsU0FBQSxDQUpaLENBQUE7QUFBQSxJQUtBLENBQUMsQ0FBQyxNQUFGLEdBQVcsTUFMWCxDQUFBO1dBTUEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsQ0FBdkIsRUFQTztFQUFBLENBRlQ7QUFBQSxFQVdBLE1BQUEsRUFBUSxTQUFDLEtBQUQsR0FBQTtBQUNOLFFBQUEsZ0NBQUE7QUFBQSxJQUFBLElBQUcsTUFBQSxDQUFBLEtBQUEsS0FBZ0IsUUFBbkI7QUFDRSxNQUFBLE1BQUEsR0FBUyxLQUFULENBQUE7QUFBQSxNQUNBLENBQUEsR0FBSSxFQURKLENBQUE7QUFFQSxXQUFBLGFBQUEsR0FBQTtBQUNFLFFBQUEsS0FBQSxHQUFRLE1BQU8sQ0FBQSxHQUFBLENBQWYsQ0FBQTtBQUNBLFFBQUEsSUFBRyxNQUFBLENBQUEsS0FBQSxLQUFnQixRQUFuQjtBQUNFLFVBQUEsQ0FBRSxDQUFBLEdBQUEsQ0FBRixHQUFTLEtBQUEsR0FBUSxNQUFNLENBQUMsZ0JBQXhCLENBREY7U0FGRjtBQUFBLE9BRkE7QUFNQSxhQUFPLElBQUMsQ0FBQSxLQUFELENBQU8sTUFBUCxFQUFlLENBQWYsQ0FBUCxDQVBGO0tBQUEsTUFRSyxJQUFHLE1BQUEsQ0FBQSxLQUFBLEtBQWdCLE9BQW5CO0FBQ0gsTUFBQSxLQUFBLEdBQVEsS0FBUixDQUFBO0FBQUEsTUFDQSxDQUFBLEdBQUksRUFESixDQUFBO0FBRUEsV0FBQSxtREFBQTsyQkFBQTtBQUNFLFFBQUEsSUFBRyxNQUFBLENBQUEsS0FBQSxLQUFnQixRQUFuQjtBQUNFLFVBQUEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFBLEdBQVEsTUFBTSxDQUFDLGdCQUF0QixDQUFBLENBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxDQUFDLENBQUMsSUFBRixDQUFPLEtBQVAsQ0FBQSxDQUhGO1NBREY7QUFBQSxPQUZBO0FBT0EsYUFBTyxDQUFQLENBUkc7S0FBQSxNQVNBLElBQUcsTUFBQSxDQUFBLEtBQUEsS0FBZ0IsUUFBbkI7QUFDSCxhQUFPLEtBQUEsR0FBUSxNQUFNLENBQUMsZ0JBQXRCLENBREc7S0FqQkw7QUFtQkEsV0FBTyxLQUFQLENBcEJNO0VBQUEsQ0FYUjtDQTlGRixDQUFBOztBQUFBLE9BZ0lBLEdBQVUsT0FBQSxJQUFXO0FBQUEsRUFFbkIsT0FBQSxFQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsSUFBQSxHQUFBLENBQUE7QUFBQSxRQUFBLGVBQUE7QUFBQSxJQUNBLElBQUEsR0FBTyxLQUFLLENBQUMsTUFEYixDQUFBO0FBRUEsV0FBTSxDQUFBLEtBQUssSUFBWCxHQUFBO0FBQ0UsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsSUFBM0IsQ0FBUCxDQUFBO0FBQUEsTUFDQSxJQUFBLElBQVEsQ0FEUixDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQWMsS0FBTSxDQUFBLElBQUEsQ0FGcEIsQ0FBQTtBQUFBLE1BR0EsS0FBTSxDQUFBLElBQUEsQ0FBTixHQUFjLEtBQU0sQ0FBQSxJQUFBLENBSHBCLENBQUE7QUFBQSxNQUlBLEtBQU0sQ0FBQSxJQUFBLENBQU4sR0FBYyxHQUpkLENBREY7SUFBQSxDQUZBO0FBUUEsV0FBTyxLQUFQLENBVE87RUFBQSxDQUZVO0FBQUEsRUFjbkIsS0FBQSxFQUFPLFNBQUMsT0FBRCxFQUFVLFNBQVYsR0FBQTtXQUNMLElBQUMsQ0FBQSxNQUFELENBQVMsSUFBQyxDQUFBLE1BQUQsQ0FBUSxFQUFSLEVBQVksT0FBWixDQUFULEVBQStCLFNBQS9CLEVBREs7RUFBQSxDQWRZO0FBQUEsRUFpQm5CLE1BQUEsRUFBUSxTQUFDLE1BQUQsRUFBUyxVQUFULEdBQUE7QUFDTixRQUFBLFFBQUE7QUFBQSxTQUFBLGlCQUFBOzRCQUFBO0FBQ0UsTUFBQSxNQUFPLENBQUEsR0FBQSxDQUFQLEdBQWMsR0FBZCxDQURGO0FBQUEsS0FBQTtXQUVBLE9BSE07RUFBQSxDQWpCVztDQWhJckIsQ0FBQTs7QUFBQSxLQXdKQSxHQUFRLEtBQUEsSUFBUztBQUFBLEVBQ2Ysa0JBQUEsRUFBb0IsU0FBQyxLQUFELEVBQVEsTUFBUixHQUFBO0FBQ2xCLFFBQUEsYUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxDQUFQLEdBQVcsS0FBSyxDQUFDLENBQTFCLENBQUE7QUFBQSxJQUNBLEtBQUEsR0FBUyxNQUFNLENBQUMsQ0FBUCxHQUFXLEtBQUssQ0FBQyxDQUQxQixDQUFBO0FBRUEsV0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQVgsRUFBbUIsS0FBbkIsQ0FBUCxDQUhrQjtFQUFBLENBREw7QUFBQSxFQU1mLFFBQUEsRUFBVSxTQUFDLE1BQUQsRUFBUyxNQUFULEdBQUE7QUFDUixRQUFBLE9BQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxNQUFNLENBQUMsQ0FBUCxHQUFXLE1BQU0sQ0FBQyxDQUF0QixDQUFBO0FBQUEsSUFDQSxDQUFBLEdBQUksTUFBTSxDQUFDLENBQVAsR0FBVyxNQUFNLENBQUMsQ0FEdEIsQ0FBQTtBQUFBLElBRUEsQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBQSxHQUFJLENBRmhCLENBQUE7QUFHQSxXQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBVixDQUFQLENBSlE7RUFBQSxDQU5LO0FBQUEsRUFZZixTQUFBLEVBQVcsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ1QsUUFBQSxZQUFBO0FBQUEsSUFBQSxFQUFBLEdBQVEsSUFBSSxDQUFDLE1BQVIsR0FBb0IsSUFBSSxDQUFDLE1BQXpCLEdBQXFDLENBQTFDLENBQUE7QUFBQSxJQUNBLEVBQUEsR0FBUSxJQUFJLENBQUMsTUFBUixHQUFvQixJQUFJLENBQUMsTUFBekIsR0FBcUMsQ0FEMUMsQ0FBQTtBQUFBLElBRUEsSUFBQSxHQUFPLEVBQUEsR0FBSyxFQUZaLENBQUE7QUFJQSxXQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLFFBQWYsRUFBeUIsSUFBSSxDQUFDLFFBQTlCLENBQUEsSUFBMkMsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFBLEdBQU8sSUFBakIsQ0FBbEQsQ0FMUztFQUFBLENBWkk7QUFBQSxFQW1CZixHQUFBLEVBQUssU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLEtBQWQsRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsR0FBQTtBQUNILFdBQU8sSUFBQSxHQUFPLENBQUMsS0FBQSxHQUFRLElBQVQsQ0FBQSxHQUFpQixDQUFDLEtBQUEsR0FBUSxJQUFULENBQWpCLEdBQWtDLENBQUMsS0FBQSxHQUFRLElBQVQsQ0FBaEQsQ0FERztFQUFBLENBbkJVO0FBQUEsRUF1QmYsT0FBQSxFQUFTLFNBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixFQUFqQixFQUFxQixPQUFyQixFQUE4QixJQUE5QixHQUFBO0FBQ1AsSUFBQTs7Ozs7Ozs7Ozs7Ozs7SUFBQSxDQUFBO0FBZUEsV0FBTyxFQUFBLEdBQUcsRUFBSCxHQUFNLEVBQUEsR0FBRyxFQUFULEdBQVksRUFBQSxHQUFHLEVBQWYsR0FBa0IsRUFBQSxHQUFHLEVBQTVCLENBaEJPO0VBQUEsQ0F2Qk07Q0F4SmpCLENBQUE7O0FBQUEsTUFtTUEsR0FBUyxNQUFBLElBQVU7QUFBQSxFQUNqQixZQUFBLEVBQWMsU0FBQyxHQUFELEdBQUE7QUFDWixRQUFBLGVBQUE7QUFBQSxJQUFBLElBQUEsR0FBVyxJQUFBLEtBQUssQ0FBQyxTQUFOLENBQUEsQ0FBWCxDQUFBO0FBQUEsSUFDQSxJQUFJLENBQUMsR0FBTCxDQUFhLElBQUEsS0FBSyxDQUFDLG1CQUFOLENBQTBCLEdBQUksQ0FBQSxDQUFBLENBQTlCLEVBQWtDLEdBQUksQ0FBQSxDQUFBLENBQXRDLEVBQTBDLEdBQUksQ0FBQSxDQUFBLENBQTlDLEVBQWtELEdBQUksQ0FBQSxDQUFBLENBQXRELENBQWIsQ0FEQSxDQUFBO0FBRUEsU0FBUyx5RkFBVCxHQUFBO0FBQ0UsTUFBQSxJQUFJLENBQUMsR0FBTCxDQUFhLElBQUEsS0FBSyxDQUFDLG1CQUFOLENBQTBCLEdBQUksQ0FBQSxDQUFBLENBQTlCLEVBQWtDLEdBQUksQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUF0QyxFQUE0QyxHQUFJLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBaEQsRUFBc0QsR0FBSSxDQUFBLENBQUEsR0FBRSxDQUFGLENBQTFELENBQWIsQ0FBQSxDQURGO0FBQUEsS0FGQTtBQUFBLElBSUEsSUFBSSxDQUFDLEdBQUwsQ0FBYSxJQUFBLEtBQUssQ0FBQyxtQkFBTixDQUEwQixHQUFJLENBQUEsR0FBRyxDQUFDLE1BQUosR0FBVyxDQUFYLENBQTlCLEVBQTZDLEdBQUksQ0FBQSxHQUFHLENBQUMsTUFBSixHQUFXLENBQVgsQ0FBakQsRUFBZ0UsR0FBSSxDQUFBLEdBQUcsQ0FBQyxNQUFKLEdBQVcsQ0FBWCxDQUFwRSxFQUFtRixHQUFJLENBQUEsR0FBRyxDQUFDLE1BQUosR0FBVyxDQUFYLENBQXZGLENBQWIsQ0FKQSxDQUFBO0FBS0EsV0FBTyxJQUFQLENBTlk7RUFBQSxDQURHO0NBbk1uQixDQUFBOztBQUFBLEtBNk1LLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQkFBbEIsR0FBeUMsU0FBRSxFQUFGLEVBQU0sRUFBTixFQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCLE9BQXRCLEVBQStCLElBQS9CLEdBQUE7QUFDckMsTUFBQSxnQ0FBQTtBQUFBLEVBQUEsR0FBQSxHQUFNLEVBQUEsR0FBSyxFQUFYLENBQUE7QUFBQSxFQUNBLEdBQUEsR0FBTSxHQUFBLEdBQU0sRUFEWixDQUFBO0FBQUEsRUFHQSxFQUFBLEdBQU0sQ0FBQyxFQUFBLEdBQUcsRUFBSixDQUFBLEdBQVEsQ0FBQyxDQUFBLEdBQUUsSUFBSCxDQUFSLEdBQWlCLENBQUMsQ0FBQSxHQUFFLE9BQUgsQ0FBakIsR0FBNkIsQ0FIbkMsQ0FBQTtBQUFBLEVBSUEsRUFBQSxJQUFPLENBQUMsRUFBQSxHQUFHLEVBQUosQ0FBQSxHQUFRLENBQUMsQ0FBQSxHQUFFLElBQUgsQ0FBUixHQUFpQixDQUFDLENBQUEsR0FBRSxPQUFILENBQWpCLEdBQTZCLENBSnBDLENBQUE7QUFBQSxFQU1BLEVBQUEsR0FBTSxDQUFDLEVBQUEsR0FBRyxFQUFKLENBQUEsR0FBUSxDQUFDLENBQUEsR0FBRSxJQUFILENBQVIsR0FBaUIsQ0FBQyxDQUFBLEdBQUUsT0FBSCxDQUFqQixHQUE2QixDQU5uQyxDQUFBO0FBQUEsRUFPQSxFQUFBLElBQU8sQ0FBQyxFQUFBLEdBQUcsRUFBSixDQUFBLEdBQVEsQ0FBQyxDQUFBLEdBQUUsSUFBSCxDQUFSLEdBQWlCLENBQUMsQ0FBQSxHQUFFLE9BQUgsQ0FBakIsR0FBNkIsQ0FQcEMsQ0FBQTtBQUFBLEVBU0EsRUFBQSxHQUFPLENBQUEsR0FBRSxHQUFGLEdBQVEsQ0FBQSxHQUFFLEdBQVYsR0FBZ0IsQ0FUdkIsQ0FBQTtBQUFBLEVBVUEsRUFBQSxHQUFTLEdBQUEsR0FBTSxDQUFBLEdBQUUsR0FBUixHQUFjLEVBVnZCLENBQUE7QUFBQSxFQVdBLEVBQUEsR0FBUyxHQUFBLEdBQVEsR0FYakIsQ0FBQTtBQUFBLEVBWUEsRUFBQSxHQUFNLENBQUEsQ0FBQSxHQUFHLEdBQUgsR0FBUyxDQUFBLEdBQUUsR0FaakIsQ0FBQTtBQWNBLFNBQU8sRUFBQSxHQUFHLEVBQUgsR0FBTSxFQUFBLEdBQUcsRUFBVCxHQUFZLEVBQUEsR0FBRyxFQUFmLEdBQWtCLEVBQUEsR0FBRyxFQUE1QixDQWZxQztBQUFBLENBN016QyxDQUFBOztBQUFBLEtBOE5LLENBQUMsbUJBQU4sR0FBNEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFaLENBQzFCLFNBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixHQUFBO0FBQ0UsRUFBQSxJQUFDLENBQUEsRUFBRCxHQUFNLEVBQU4sQ0FBQTtBQUFBLEVBQ0EsSUFBQyxDQUFBLEVBQUQsR0FBTSxFQUROLENBQUE7QUFBQSxFQUVBLElBQUMsQ0FBQSxFQUFELEdBQU0sRUFGTixDQUFBO0FBQUEsRUFHQSxJQUFDLENBQUEsRUFBRCxHQUFNLEVBSE4sQ0FERjtBQUFBLENBRDBCLEVBT3hCLFNBQUMsQ0FBRCxHQUFBO0FBQ0EsTUFBQSxNQUFBO0FBQUEsRUFBQSxNQUFBLEdBQWEsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFBLENBQWIsQ0FBQTtBQUFBLEVBQ0EsTUFBTSxDQUFDLENBQVAsR0FBVyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQkFBbEIsQ0FBdUMsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUEzQyxFQUE4QyxJQUFDLENBQUEsRUFBRSxDQUFDLENBQWxELEVBQXFELElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBekQsRUFBNEQsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUFoRSxFQUFtRSxDQUFuRSxFQUFzRSxDQUF0RSxFQUF5RSxDQUF6RSxDQURYLENBQUE7QUFBQSxFQUVBLE1BQU0sQ0FBQyxDQUFQLEdBQVcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsb0JBQWxCLENBQXVDLElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBM0MsRUFBOEMsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUFsRCxFQUFxRCxJQUFDLENBQUEsRUFBRSxDQUFDLENBQXpELEVBQTRELElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBaEUsRUFBbUUsQ0FBbkUsRUFBc0UsQ0FBdEUsRUFBeUUsQ0FBekUsQ0FGWCxDQUFBO0FBQUEsRUFHQSxNQUFNLENBQUMsQ0FBUCxHQUFXLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLG9CQUFsQixDQUF1QyxJQUFDLENBQUEsRUFBRSxDQUFDLENBQTNDLEVBQThDLElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBbEQsRUFBcUQsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUF6RCxFQUE0RCxJQUFDLENBQUEsRUFBRSxDQUFDLENBQWhFLEVBQW1FLENBQW5FLEVBQXNFLENBQXRFLEVBQXlFLENBQXpFLENBSFgsQ0FBQTtBQUlBLFNBQU8sTUFBUCxDQUxBO0FBQUEsQ0FQd0IsQ0E5TjVCLENBQUE7O0FBQUEsS0E2T0ssQ0FBQyxXQUFOLEdBQW9CLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBWixDQUNsQixTQUFDLEVBQUQsRUFBSyxVQUFMLEVBQW1CLFNBQW5CLEVBQWtDLFNBQWxDLEVBQStDLE9BQS9DLEVBQThELFNBQTlELEdBQUE7O0lBQUssYUFBVztHQUNkOztJQURpQixZQUFVO0dBQzNCOztJQURnQyxZQUFVO0dBQzFDOztJQUQ2QyxVQUFRO0dBQ3JEOztJQUQ0RCxZQUFVO0dBQ3RFO0FBQUEsRUFBQSxJQUFDLENBQUEsRUFBRCxHQUFjLEVBQWQsQ0FBQTtBQUFBLEVBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBYyxPQURkLENBQUE7QUFBQSxFQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsVUFGZCxDQUFBO0FBQUEsRUFJQSxJQUFDLENBQUEsU0FBRCxHQUFjLFNBSmQsQ0FBQTtBQUFBLEVBS0EsSUFBQyxDQUFBLFNBQUQsR0FBYyxTQUxkLENBQUE7QUFBQSxFQU1BLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsU0FONUIsQ0FBQTtBQUFBLEVBUUEsSUFBQyxDQUFBLFNBQUQsR0FBYyxTQVJkLENBREY7QUFBQSxDQURrQixFQWFoQixTQUFDLENBQUQsR0FBQTtBQUNBLE1BQUEsZ0NBQUE7QUFBQSxFQUFBLElBQWlCLElBQUMsQ0FBQSxPQUFsQjtBQUFBLElBQUEsQ0FBQSxHQUFRLENBQUEsR0FBSSxDQUFaLENBQUE7R0FBQTtBQUNBLEVBQUEsSUFBRyxJQUFDLENBQUEsU0FBSjtBQUNJLElBQUEsR0FBQSxHQUFRLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFWLENBQUEsR0FBYSxDQUFkLENBQUEsR0FBaUIsQ0FBakIsR0FBcUIsQ0FBN0IsQ0FBQTtBQUFBLElBQ0EsWUFBQSxHQUFlLEdBQUEsR0FBTSxJQUFJLENBQUMsRUFBWCxHQUFnQixDQUQvQixDQUFBO0FBQUEsSUFFQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUFDLFlBQUEsR0FBZSxDQUFoQixDQUZ0QixDQUFBO0FBQUEsSUFHQSxLQUFBLElBQVMsSUFBSSxDQUFDLEVBQUwsR0FBVSxDQUFBLEtBSG5CLENBREo7R0FBQSxNQUFBO0FBTUksSUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUFDLElBQUksQ0FBQyxFQUFMLEdBQVUsQ0FBVixHQUFjLENBQWYsQ0FBdEIsQ0FOSjtHQURBO0FBQUEsRUFTQSxNQUFBLEdBQWEsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFBLENBVGIsQ0FBQTtBQUFBLEVBVUEsTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFDLENBQUEsRUFBRSxDQUFDLENBQUosR0FBUSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixDQUFDLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLE1BQUQsR0FBVSxDQUF4QixDQVZyQyxDQUFBO0FBQUEsRUFXQSxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBSixHQUFRLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFBLEdBQWtCLENBQUMsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsTUFBRCxHQUFVLENBQXhCLENBWHJDLENBQUE7QUFBQSxFQVlBLE1BQU0sQ0FBQyxDQUFQLEdBQVcsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQVpmLENBQUE7QUFhQSxTQUFPLE1BQVAsQ0FkQTtBQUFBLENBYmdCLENBN09wQixDQUFBOztBQUFBLEtBMlFLLENBQUMsYUFBTixHQUFzQixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQVosQ0FDcEIsU0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLE1BQVQsR0FBQTs7SUFBUyxTQUFPO0dBQ2Q7QUFBQSxFQUFBLElBQUMsQ0FBQSxFQUFELEdBQVEsRUFBUixDQUFBO0FBQUEsRUFDQSxJQUFDLENBQUEsRUFBRCxHQUFRLEVBRFIsQ0FBQTtBQUFBLEVBRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUZWLENBREY7QUFBQSxDQURvQixFQU1sQixTQUFDLENBQUQsR0FBQTtBQUNBLE1BQUEsc0JBQUE7QUFBQSxFQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsRUFBTCxHQUFVLENBQVYsR0FBYyxDQUFkLEdBQWtCLElBQUMsQ0FBQSxNQUEzQixDQUFBO0FBQUEsRUFFQSxDQUFBLEdBQUksSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUFKLEdBQVEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUZoQixDQUFBO0FBQUEsRUFJQSxJQUFBLEdBQU8sSUFBQyxDQUFBLEVBQUUsQ0FBQyxLQUFKLENBQUEsQ0FBVyxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLEVBQWpCLENBSlAsQ0FBQTtBQUFBLEVBTUEsTUFBQSxHQUFhLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQU5iLENBQUE7QUFBQSxFQU9BLE1BQU0sQ0FBQyxDQUFQLEdBQVcsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUFKLEdBQVEsSUFBSSxDQUFDLENBQUwsR0FBUyxDQVA1QixDQUFBO0FBQUEsRUFRQSxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBSixHQUFRLElBQUksQ0FBQyxDQUFMLEdBQVMsQ0FSNUIsQ0FBQTtBQUFBLEVBU0EsTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFDLENBQUEsRUFBRSxDQUFDLENBQUosR0FBUSxJQUFJLENBQUMsQ0FBTCxHQUFTLENBVDVCLENBQUE7QUFBQSxFQVdBLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFBLEdBQUksQ0FBaEIsQ0FBQSxHQUFxQixFQVh6QixDQUFBO0FBQUEsRUFhQSxNQUFNLENBQUMsQ0FBUCxJQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFBLEdBQWtCLENBQUMsRUFBQSxHQUFLLENBQU4sQ0FiOUIsQ0FBQTtBQUFBLEVBY0EsTUFBTSxDQUFDLENBQVAsSUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixDQUFDLEVBQUEsR0FBSyxDQUFOLENBZDlCLENBQUE7QUFnQkEsU0FBTyxNQUFQLENBakJBO0FBQUEsQ0FOa0IsQ0EzUXRCLENBQUE7O0FBQUEsTUFzU00sQ0FBQyxNQUFQLEdBQWdCO0FBQUEsRUFRZCxNQUFBLEVBQVEsU0FBQyxDQUFELEdBQUE7QUFDTixXQUFPLENBQVAsQ0FETTtFQUFBLENBUk07QUFBQSxFQVlkLGVBQUEsRUFBaUIsU0FBQyxDQUFELEdBQUE7QUFDZixXQUFPLENBQUEsR0FBSSxDQUFYLENBRGU7RUFBQSxDQVpIO0FBQUEsRUFnQmQsZ0JBQUEsRUFBa0IsU0FBQyxDQUFELEdBQUE7QUFDaEIsV0FBTyxDQUFBLENBQUUsQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBTCxDQUFSLENBRGdCO0VBQUEsQ0FoQko7QUFBQSxFQXNCZCxrQkFBQSxFQUFvQixTQUFDLENBQUQsR0FBQTtBQUNsQixJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBZixDQURGO0tBQUEsTUFBQTtBQUdFLGFBQU8sQ0FBQyxDQUFBLENBQUEsR0FBSyxDQUFMLEdBQVMsQ0FBVixDQUFBLEdBQWUsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFmLEdBQXlCLENBQWhDLENBSEY7S0FEa0I7RUFBQSxDQXRCTjtBQUFBLEVBNkJkLFdBQUEsRUFBYSxTQUFDLENBQUQsR0FBQTtBQUNYLFdBQU8sQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFmLENBRFc7RUFBQSxDQTdCQztBQUFBLEVBaUNkLFlBQUEsRUFBYyxTQUFDLENBQUQsR0FBQTtBQUNaLFFBQUEsQ0FBQTtBQUFBLElBQUEsQ0FBQSxHQUFLLENBQUEsR0FBSSxDQUFULENBQUE7QUFDQSxXQUFPLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBUixHQUFZLENBQW5CLENBRlk7RUFBQSxDQWpDQTtBQUFBLEVBd0NkLGNBQUEsRUFBZ0IsU0FBQyxDQUFELEdBQUE7QUFDZCxRQUFBLENBQUE7QUFBQSxJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBUixHQUFZLENBQW5CLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxDQUFBLEdBQUssQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBZixDQUFBO0FBQ0EsYUFBTyxHQUFBLEdBQU0sQ0FBTixHQUFVLENBQVYsR0FBYyxDQUFkLEdBQWtCLENBQXpCLENBSkY7S0FEYztFQUFBLENBeENGO0FBQUEsRUFnRGQsYUFBQSxFQUFlLFNBQUMsQ0FBRCxHQUFBO0FBQ2IsV0FBTyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFuQixDQURhO0VBQUEsQ0FoREQ7QUFBQSxFQW9EZCxjQUFBLEVBQWdCLFNBQUMsQ0FBRCxHQUFBO0FBQ2QsUUFBQSxDQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUssQ0FBQSxHQUFJLENBQVQsQ0FBQTtBQUNBLFdBQU8sQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFSLEdBQVksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFaLEdBQXNCLENBQTdCLENBRmM7RUFBQSxDQXBERjtBQUFBLEVBMkRkLGdCQUFBLEVBQWtCLFNBQUMsQ0FBRCxHQUFBO0FBQ2hCLFFBQUEsQ0FBQTtBQUFBLElBQUEsSUFBRyxDQUFBLEdBQUksR0FBUDtBQUNFLGFBQU8sQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFSLEdBQVksQ0FBWixHQUFnQixDQUF2QixDQURGO0tBQUEsTUFBQTtBQUdFLE1BQUEsQ0FBQSxHQUFLLENBQUEsR0FBSSxDQUFULENBQUE7QUFDQSxhQUFPLENBQUEsQ0FBQSxHQUFLLENBQUwsR0FBUyxDQUFULEdBQWEsQ0FBYixHQUFpQixDQUFqQixHQUFxQixDQUE1QixDQUpGO0tBRGdCO0VBQUEsQ0EzREo7QUFBQSxFQW1FZCxhQUFBLEVBQWUsU0FBQyxDQUFELEdBQUE7QUFDYixXQUFPLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBUixHQUFZLENBQVosR0FBZ0IsQ0FBdkIsQ0FEYTtFQUFBLENBbkVEO0FBQUEsRUF1RWQsY0FBQSxFQUFnQixTQUFDLENBQUQsR0FBQTtBQUNkLFFBQUEsQ0FBQTtBQUFBLElBQUEsQ0FBQSxHQUFLLENBQUEsR0FBSSxDQUFULENBQUE7QUFDQSxXQUFPLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBUixHQUFZLENBQVosR0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBM0IsQ0FGYztFQUFBLENBdkVGO0FBQUEsRUE4RWQsZ0JBQUEsRUFBa0IsU0FBQyxDQUFELEdBQUE7QUFDaEIsUUFBQSxDQUFBO0FBQUEsSUFBQSxJQUFHLENBQUEsR0FBSSxHQUFQO0FBQ0UsYUFBTyxFQUFBLEdBQUssQ0FBTCxHQUFTLENBQVQsR0FBYSxDQUFiLEdBQWlCLENBQWpCLEdBQXFCLENBQTVCLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxDQUFBLEdBQUssQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBZixDQUFBO0FBQ0EsYUFBUSxHQUFBLEdBQU0sQ0FBTixHQUFVLENBQVYsR0FBYyxDQUFkLEdBQWtCLENBQWxCLEdBQXNCLENBQXRCLEdBQTBCLENBQWxDLENBSkY7S0FEZ0I7RUFBQSxDQTlFSjtBQUFBLEVBc0ZkLFVBQUEsRUFBWSxTQUFDLENBQUQsR0FBQTtBQUNWLFdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxJQUFJLENBQUMsRUFBZixHQUFvQixDQUE3QixDQUFBLEdBQWtDLENBQXpDLENBRFU7RUFBQSxDQXRGRTtBQUFBLEVBMEZkLFdBQUEsRUFBYSxTQUFDLENBQUQsR0FBQTtBQUNYLFdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUksSUFBSSxDQUFDLEVBQVQsR0FBYyxDQUF2QixDQUFQLENBRFc7RUFBQSxDQTFGQztBQUFBLEVBOEZkLGFBQUEsRUFBZSxTQUFDLENBQUQsR0FBQTtBQUNiLFdBQU8sR0FBQSxHQUFNLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQSxHQUFJLElBQUksQ0FBQyxFQUFsQixDQUFMLENBQWIsQ0FEYTtFQUFBLENBOUZEO0FBQUEsRUFrR2QsY0FBQSxFQUFnQixTQUFDLENBQUQsR0FBQTtBQUNkLFdBQU8sQ0FBQSxHQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBZCxDQUFYLENBRGM7RUFBQSxDQWxHRjtBQUFBLEVBc0dkLGVBQUEsRUFBaUIsU0FBQyxDQUFELEdBQUE7QUFDZixXQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBcEIsQ0FBUCxDQURlO0VBQUEsQ0F0R0g7QUFBQSxFQTRHZCxpQkFBQSxFQUFtQixTQUFDLENBQUQsR0FBQTtBQUNqQixJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLEdBQUEsR0FBTSxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFsQixDQUFMLENBQWIsQ0FERjtLQUFBLE1BQUE7QUFHRSxhQUFPLEdBQUEsR0FBTSxDQUFDLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBQSxDQUFFLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVgsQ0FBRCxHQUFpQixDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVgsQ0FBM0IsQ0FBQSxHQUE0QyxDQUE3QyxDQUFiLENBSEY7S0FEaUI7RUFBQSxDQTVHTDtBQUFBLEVBbUhkLGlCQUFBLEVBQW1CLFNBQUMsQ0FBRCxHQUFBO0FBQ1YsSUFBQSxJQUFJLENBQUEsS0FBSyxHQUFUO2FBQW1CLEVBQW5CO0tBQUEsTUFBQTthQUEwQixJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxFQUFBLEdBQUssQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFqQixFQUExQjtLQURVO0VBQUEsQ0FuSEw7QUFBQSxFQXVIZCxrQkFBQSxFQUFvQixTQUFDLENBQUQsR0FBQTtBQUNYLElBQUEsSUFBSSxDQUFBLEtBQUssR0FBVDthQUFtQixFQUFuQjtLQUFBLE1BQUE7YUFBMEIsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUEsRUFBQSxHQUFNLENBQWxCLEVBQTlCO0tBRFc7RUFBQSxDQXZITjtBQUFBLEVBNkhkLG9CQUFBLEVBQXNCLFNBQUMsQ0FBRCxHQUFBO0FBQ3BCLElBQUEsSUFBRyxDQUFBLEtBQUssR0FBTCxJQUFZLENBQUEsS0FBSyxHQUFwQjtBQUNFLGFBQU8sQ0FBUCxDQURGO0tBQUE7QUFHQSxJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLEdBQUEsR0FBTSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFDLEVBQUEsR0FBSyxDQUFOLENBQUEsR0FBVyxFQUF2QixDQUFiLENBREY7S0FBQSxNQUFBO0FBR0UsYUFBTyxDQUFBLEdBQUEsR0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFDLENBQUEsRUFBQSxHQUFNLENBQVAsQ0FBQSxHQUFZLEVBQXhCLENBQVAsR0FBcUMsQ0FBNUMsQ0FIRjtLQUpvQjtFQUFBLENBN0hSO0FBQUEsRUF1SWQsYUFBQSxFQUFlLFNBQUMsQ0FBRCxHQUFBO0FBQ2IsV0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQUEsR0FBSyxJQUFJLENBQUMsRUFBVixHQUFlLENBQWYsR0FBbUIsQ0FBNUIsQ0FBQSxHQUFpQyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxFQUFBLEdBQUssQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFqQixDQUF4QyxDQURhO0VBQUEsQ0F2SUQ7QUFBQSxFQTJJZCxjQUFBLEVBQWdCLFNBQUMsQ0FBRCxHQUFBO0FBQ2QsV0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsRUFBQSxHQUFNLElBQUksQ0FBQyxFQUFYLEdBQWdCLENBQWhCLEdBQW9CLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBN0IsQ0FBQSxHQUF3QyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFBLEVBQUEsR0FBTSxDQUFsQixDQUF4QyxHQUErRCxDQUF0RSxDQURjO0VBQUEsQ0EzSUY7QUFBQSxFQWlKZCxnQkFBQSxFQUFrQixTQUFDLENBQUQsR0FBQTtBQUNoQixJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLEdBQUEsR0FBTSxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQUEsR0FBSyxJQUFJLENBQUMsRUFBVixHQUFlLENBQWYsR0FBbUIsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUE1QixDQUFOLEdBQTZDLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLEVBQUEsR0FBSyxDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVgsQ0FBakIsQ0FBcEQsQ0FERjtLQUFBLE1BQUE7QUFHRSxhQUFPLEdBQUEsR0FBTSxDQUFDLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQSxFQUFBLEdBQU0sSUFBSSxDQUFDLEVBQVgsR0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBVCxDQUFBLEdBQWMsQ0FBZixDQUE3QixDQUFBLEdBQWtELElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUEsRUFBQSxHQUFNLENBQUMsQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFULENBQWxCLENBQWxELEdBQW1GLENBQXBGLENBQWIsQ0FIRjtLQURnQjtFQUFBLENBakpKO0FBQUEsRUF3SmQsVUFBQSxFQUFZLFNBQUMsQ0FBRCxHQUFBO0FBQ1YsV0FBTyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUksSUFBSSxDQUFDLEVBQWxCLENBQXZCLENBRFU7RUFBQSxDQXhKRTtBQUFBLEVBNEpkLFdBQUEsRUFBYSxTQUFDLENBQUQsR0FBQTtBQUNYLFFBQUEsQ0FBQTtBQUFBLElBQUEsQ0FBQSxHQUFLLENBQUEsR0FBSSxDQUFULENBQUE7QUFDQSxXQUFPLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBUixHQUFZLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsR0FBSSxJQUFJLENBQUMsRUFBbEIsQ0FBakIsQ0FBWCxDQUZXO0VBQUEsQ0E1SkM7QUFBQSxFQW1LZCxhQUFBLEVBQWUsU0FBQyxDQUFELEdBQUE7QUFDYixRQUFBLENBQUE7QUFBQSxJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxNQUFBLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBUixDQUFBO0FBQ0EsYUFBTyxHQUFBLEdBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUksSUFBSSxDQUFDLEVBQWxCLENBQWpCLENBQWIsQ0FGRjtLQUFBLE1BQUE7QUFJRSxNQUFBLENBQUEsR0FBSyxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUUsQ0FBRixHQUFNLENBQVAsQ0FBVCxDQUFBO0FBQ0EsYUFBTyxHQUFBLEdBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUksSUFBSSxDQUFDLEVBQWxCLENBQWpCLENBQUwsQ0FBTixHQUFzRCxHQUE3RCxDQUxGO0tBRGE7RUFBQSxDQW5LRDtBQUFBLEVBMktkLFlBQUEsRUFBYyxTQUFDLENBQUQsR0FBQTtBQUNaLFdBQU8sQ0FBQSxHQUFJLElBQUMsQ0FBQSxhQUFELENBQWUsQ0FBQSxHQUFJLENBQW5CLENBQVgsQ0FEWTtFQUFBLENBM0tBO0FBQUEsRUE4S2QsYUFBQSxFQUFlLFNBQUMsQ0FBRCxHQUFBO0FBQ2IsSUFBQSxJQUFHLENBQUEsR0FBSSxDQUFBLEdBQUUsSUFBVDtBQUNFLGFBQU8sQ0FBQyxHQUFBLEdBQU0sQ0FBTixHQUFVLENBQVgsQ0FBQSxHQUFjLElBQXJCLENBREY7S0FBQSxNQUVLLElBQUcsQ0FBQSxHQUFJLENBQUEsR0FBRSxJQUFUO0FBQ0gsYUFBTyxDQUFDLEdBQUEsR0FBSSxJQUFKLEdBQVcsQ0FBWCxHQUFlLENBQWhCLENBQUEsR0FBcUIsQ0FBQyxFQUFBLEdBQUcsSUFBSCxHQUFVLENBQVgsQ0FBckIsR0FBcUMsRUFBQSxHQUFHLEdBQS9DLENBREc7S0FBQSxNQUVBLElBQUcsQ0FBQSxHQUFJLENBQUEsR0FBRSxJQUFUO0FBQ0gsYUFBTyxDQUFDLElBQUEsR0FBSyxLQUFMLEdBQWEsQ0FBYixHQUFpQixDQUFsQixDQUFBLEdBQXVCLENBQUMsS0FBQSxHQUFNLE1BQU4sR0FBZSxDQUFoQixDQUF2QixHQUE0QyxLQUFBLEdBQU0sTUFBekQsQ0FERztLQUFBLE1BQUE7QUFHSCxhQUFPLENBQUMsRUFBQSxHQUFHLEdBQUgsR0FBUyxDQUFULEdBQWEsQ0FBZCxDQUFBLEdBQW1CLENBQUMsR0FBQSxHQUFJLElBQUosR0FBVyxDQUFaLENBQW5CLEdBQW9DLEdBQUEsR0FBSSxJQUEvQyxDQUhHO0tBTFE7RUFBQSxDQTlLRDtBQUFBLEVBd0xkLGVBQUEsRUFBaUIsU0FBQyxDQUFELEdBQUE7QUFDZixJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLEdBQUEsR0FBTSxJQUFDLENBQUEsWUFBRCxDQUFjLENBQUEsR0FBRSxDQUFoQixDQUFiLENBREY7S0FBQSxNQUFBO0FBR0UsYUFBTyxHQUFBLEdBQU0sSUFBQyxDQUFBLGFBQUQsQ0FBZSxDQUFBLEdBQUksQ0FBSixHQUFRLENBQXZCLENBQU4sR0FBa0MsR0FBekMsQ0FIRjtLQURlO0VBQUEsQ0F4TEg7Q0F0U2hCLENBQUE7O0FBQUEsS0F1ZVcsQ0FBQztBQUNWLDJCQUFBLENBQUE7O0FBQUEsa0JBQUEsT0FBQSxHQUFTLElBQVQsQ0FBQTs7QUFFYSxFQUFBLGVBQUEsR0FBQTtBQUNYLHlDQUFBLENBQUE7QUFBQSxJQUFBLHdDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsSUFBRCxHQUFvQixPQUZwQixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsR0FBRCxHQUFvQixJQUhwQixDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFKcEIsQ0FBQTtBQUFBLElBS0EsSUFBQyxDQUFBLFVBQUQsR0FBb0IsSUFMcEIsQ0FEVztFQUFBLENBRmI7O0FBQUEsa0JBVUEsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO0FBQ04sUUFBQSw0QkFBQTtBQUFBO0FBQUE7U0FBQSxxQ0FBQTtxQkFBQTtBQUNFLG9CQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsS0FBWCxFQUFrQixLQUFsQixFQUFBLENBREY7QUFBQTtvQkFETTtFQUFBLENBVlIsQ0FBQTs7QUFBQSxrQkFjQSxTQUFBLEdBQVcsU0FBQyxHQUFELEVBQU0sS0FBTixHQUFBO0FBQ1QsUUFBQSw0QkFBQTtBQUFBLElBQUEsSUFBcUIsTUFBQSxDQUFBLEdBQVUsQ0FBQyxNQUFYLEtBQXFCLFVBQTFDO0FBQUEsTUFBQSxHQUFHLENBQUMsTUFBSixDQUFXLEtBQVgsQ0FBQSxDQUFBO0tBQUE7QUFDQSxJQUFBLElBQUcsR0FBRyxDQUFDLGNBQUosQ0FBbUIsVUFBbkIsQ0FBQSxJQUFtQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQWIsR0FBc0IsQ0FBNUQ7QUFDRTtBQUFBO1dBQUEscUNBQUE7dUJBQUE7QUFDRSxzQkFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEtBQVgsRUFBa0IsS0FBbEIsRUFBQSxDQURGO0FBQUE7c0JBREY7S0FGUztFQUFBLENBZFgsQ0FBQTs7QUFBQSxrQkFvQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFFBQUEsNEJBQUE7QUFBQTtBQUFBO1NBQUEscUNBQUE7cUJBQUE7QUFDRSxvQkFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEtBQVgsRUFBQSxDQURGO0FBQUE7b0JBRE07RUFBQSxDQXBCUixDQUFBOztBQUFBLGtCQXdCQSxTQUFBLEdBQVcsU0FBQyxHQUFELEdBQUE7QUFDVCxRQUFBLDRCQUFBO0FBQUEsSUFBQSxJQUFnQixNQUFBLENBQUEsR0FBVSxDQUFDLE1BQVgsS0FBcUIsVUFBckM7QUFBQSxNQUFBLEdBQUcsQ0FBQyxNQUFKLENBQUEsQ0FBQSxDQUFBO0tBQUE7QUFDQSxJQUFBLElBQUcsR0FBRyxDQUFDLGNBQUosQ0FBbUIsVUFBbkIsQ0FBQSxJQUFtQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQWIsR0FBc0IsQ0FBNUQ7QUFDRTtBQUFBO1dBQUEscUNBQUE7dUJBQUE7QUFDRSxzQkFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEtBQVgsRUFBQSxDQURGO0FBQUE7c0JBREY7S0FGUztFQUFBLENBeEJYLENBQUE7O0FBQUEsa0JBOEJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7V0FDTixJQUFDLENBQUEsT0FBRCxHQUFXLE1BREw7RUFBQSxDQTlCUixDQUFBOztBQUFBLGtCQWlDQSxLQUFBLEdBQU8sU0FBQSxHQUFBO1dBQ0wsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUROO0VBQUEsQ0FqQ1AsQ0FBQTs7QUFBQSxrQkFvQ0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFdBQU8sSUFBQyxDQUFBLE9BQVIsQ0FEUTtFQUFBLENBcENWLENBQUE7O2VBQUE7O0dBRHdCLEtBQUssQ0FBQyxNQXZlaEMsQ0FBQTs7QUFBQSxLQWdoQlcsQ0FBQztBQUVWLHlCQUFBLFlBQUEsR0FBYyxJQUFkLENBQUE7O0FBQUEseUJBQ0EsT0FBQSxHQUFTLElBRFQsQ0FBQTs7QUFBQSx5QkFFQSxNQUFBLEdBQVEsSUFGUixDQUFBOztBQUFBLHlCQUdBLE1BQUEsR0FBUSxJQUhSLENBQUE7O0FBQUEseUJBS0EsUUFBQSxHQUFVLElBTFYsQ0FBQTs7QUFBQSx5QkFNQSxNQUFBLEdBQVUsSUFOVixDQUFBOztBQVFhLEVBQUEsc0JBQUEsR0FBQTtBQUNYLDJDQUFBLENBQUE7QUFBQSxpREFBQSxDQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQURBLENBRFc7RUFBQSxDQVJiOztBQUFBLHlCQXlDQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sSUFBQSxJQUFDLENBQUEsTUFBRCxHQUFlLElBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFmLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFEWCxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsS0FBSyxDQUFDLGlCQUFOLENBQXdCLEVBQXhCLEVBQTRCLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLE1BQU0sQ0FBQyxXQUF2RCxFQUFvRSxHQUFwRSxFQUF5RSxJQUF6RSxDQUZkLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsS0FBSyxDQUFDLGFBQU4sQ0FBb0I7QUFBQSxNQUFFLFNBQUEsRUFBVyxJQUFiO0FBQUEsTUFBbUIsS0FBQSxFQUFPLEtBQTFCO0tBQXBCLENBSGhCLENBQUE7QUFBQSxJQUlBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixNQUFNLENBQUMsVUFBekIsRUFBcUMsTUFBTSxDQUFDLFdBQTVDLENBSkEsQ0FBQTtBQUFBLElBS0EsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBa0MsQ0FBQyxXQUFuQyxDQUErQyxJQUFDLENBQUEsUUFBUSxDQUFDLFVBQXpELENBTEEsQ0FBQTtBQU9BLElBQUEsSUFBa0IsS0FBSyxDQUFDLEdBQU4sS0FBYSxhQUEvQjtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFBLENBQUE7S0FQQTtXQVFBLElBQUMsQ0FBQSxPQUFELENBQUEsRUFUTTtFQUFBLENBekNSLENBQUE7O0FBQUEseUJBb0RBLE9BQUEsR0FBUyxTQUFBLEdBQUE7V0FDUCxNQUFNLENBQUMsUUFBUCxHQUFrQixJQUFDLENBQUEsV0FEWjtFQUFBLENBcERULENBQUE7O0FBQUEseUJBdURBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixJQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixNQUFNLENBQUMsVUFBekIsRUFBcUMsTUFBTSxDQUFDLFdBQTVDLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLE1BQU0sQ0FBQyxXQUQ1QyxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQUEsQ0FGQSxDQUFBO0FBR0EsSUFBQSxJQUEwQixJQUFDLENBQUEsWUFBM0I7YUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBQSxFQUFBO0tBSlU7RUFBQSxDQXZEWixDQUFBOztBQUFBLHlCQTZEQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsS0FBQSxDQUFBLENBQWQsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQWdCLENBQWhCLENBREEsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQXpCLEdBQW9DLFVBRnBDLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUF6QixHQUFnQyxLQUhoQyxDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBekIsR0FBK0IsS0FKL0IsQ0FBQTtXQUtBLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEyQixJQUFDLENBQUEsTUFBTSxDQUFDLFVBQW5DLEVBTlc7RUFBQSxDQTdEYixDQUFBOztBQUFBLHlCQXFFQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsSUFBQSxNQUFNLENBQUMscUJBQVAsQ0FBNkIsSUFBQyxDQUFBLE9BQTlCLENBQUEsQ0FBQTtBQUVBLElBQUEsSUFBRyxDQUFBLElBQUUsQ0FBQSxZQUFGLElBQWtCLElBQUMsQ0FBQSxZQUFZLENBQUMsUUFBZCxDQUFBLENBQXJCO0FBQ0ksWUFBQSxDQURKO0tBRkE7QUFBQSxJQUtBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxDQUFxQixJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBQSxDQUFBLEdBQXFCLElBQTFDLENBTEEsQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQWtCLElBQUMsQ0FBQSxZQUFuQixFQUFpQyxJQUFDLENBQUEsTUFBbEMsQ0FOQSxDQUFBO0FBUUEsSUFBQSxJQUFvQixLQUFLLENBQUMsR0FBTixLQUFhLGFBQWpDO2FBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQUEsRUFBQTtLQVRPO0VBQUEsQ0FyRVQsQ0FBQTs7QUFBQSx5QkFnRkEsV0FBQSxHQUFhLFNBQUMsVUFBRCxHQUFBO0FBQ1gsUUFBQSxRQUFBO0FBQUEsSUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFRLENBQUEsVUFBQSxDQUFaO0FBQ0ksYUFBTyxJQUFDLENBQUEsT0FBUSxDQUFBLFVBQUEsQ0FBaEIsQ0FESjtLQUFBO0FBR0E7QUFDRSxNQUFBLEtBQUEsR0FBWSxJQUFBLENBQUMsSUFBQSxDQUFLLFFBQUEsR0FBUyxVQUFkLENBQUQsQ0FBQSxDQUFBLENBQVosQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQVEsQ0FBQSxVQUFBLENBQVQsR0FBdUIsS0FEdkIsQ0FERjtLQUFBLGNBQUE7QUFJRSxNQURJLFVBQ0osQ0FBQTtBQUFBLGFBQU8sS0FBUCxDQUpGO0tBSEE7QUFTQSxXQUFPLEtBQVAsQ0FWVztFQUFBLENBaEZiLENBQUE7O0FBQUEseUJBNEZBLFNBQUEsR0FBVyxTQUFDLFVBQUQsR0FBQTtBQUNULElBQUEsSUFBRyxJQUFDLENBQUEsT0FBUSxDQUFBLFVBQUEsQ0FBWjtBQUNJLE1BQUEsSUFBeUIsSUFBQyxDQUFBLFlBQTFCO0FBQUEsUUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLEtBQWQsQ0FBQSxDQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLE9BQVEsQ0FBQSxVQUFBLENBRHpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxDQUFBLENBRkEsQ0FBQTtBQUdBLGFBQU8sSUFBUCxDQUpKO0tBQUE7QUFBQSxJQUtBLEtBQUEsQ0FBTSxTQUFBLEdBQVUsVUFBVixHQUFxQixpQkFBM0IsQ0FMQSxDQUFBO0FBTUEsV0FBTyxLQUFQLENBUFM7RUFBQSxDQTVGWCxDQUFBOztzQkFBQTs7SUFsaEJGLENBQUE7O0FBQUEsS0F3bkJXLENBQUM7QUFFViwrQkFBQSxDQUFBOztBQUFBLHNCQUFBLFFBQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEsc0JBQ0EsUUFBQSxHQUFVLElBRFYsQ0FBQTs7QUFHYSxFQUFBLG1CQUFBLEdBQUE7QUFDWCx5Q0FBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLElBQUEseUNBQUEsQ0FBQSxDQURXO0VBQUEsQ0FIYjs7QUFBQSxzQkFNQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sSUFBQSxvQ0FBQSxDQUFBLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FBSyxDQUFDLFlBRmxCLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUExQixDQUErQixHQUEvQixDQUxBLENBQUE7QUFBQSxJQWFBLEtBQUssQ0FBQyxFQUFOLEdBQWUsSUFBQSxLQUFLLENBQUMsVUFBTixDQUFpQixLQUFLLENBQUMsRUFBRSxDQUFDLEVBQTFCLEVBQThCLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBdkMsQ0FiZixDQUFBO0FBQUEsSUFlQSxJQUFDLENBQUEsT0FBRCxDQUFBLENBZkEsQ0FBQTtBQWdCQSxJQUFBLElBQWEsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFULENBQUEsQ0FBYjthQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFBQTtLQWpCTTtFQUFBLENBTlIsQ0FBQTs7QUFBQSxzQkF5QkEsS0FBQSxHQUFPLFNBQUEsR0FBQSxDQXpCUCxDQUFBOztBQUFBLHNCQTJCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO1dBQ1AsUUFBUSxDQUFDLGdCQUFULENBQTBCLEtBQUssQ0FBQyxVQUFVLENBQUMsWUFBM0MsRUFBeUQsSUFBQyxDQUFBLGVBQTFELEVBRE87RUFBQSxDQTNCVCxDQUFBOztBQUFBLHNCQThCQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtXQUNmLElBQUMsQ0FBQSxNQUFELENBQUEsRUFEZTtFQUFBLENBOUJqQixDQUFBOztBQUFBLHNCQWlDQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sUUFBQSxlQUFBO0FBQUEsSUFBQSxNQUFNLENBQUMsV0FBUCxHQUFxQixJQUFyQixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FIaEIsQ0FBQTtBQUFBLElBT0EsS0FBQSxHQUFZLElBQUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0I7QUFBQSxNQUMxQixTQUFBLEVBQVcsQ0FEZTtBQUFBLE1BRTFCLFNBQUEsRUFBVyxHQUZlO0FBQUEsTUFHMUIsTUFBQSxFQUFRLEdBSGtCO0FBQUEsTUFJMUIsS0FBQSxFQUFPLFFBSm1CO0FBQUEsTUFLMUIsUUFBQSxFQUFVLEtBTGdCO0FBQUEsTUFNMUIsYUFBQSxFQUFlLEVBTlc7QUFBQSxNQU8xQixXQUFBLEVBQWEsQ0FQYTtBQUFBLE1BUTFCLGlCQUFBLEVBQW1CLEdBUk87S0FBaEIsQ0FQWixDQUFBO0FBQUEsSUFpQkEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxLQUFMLENBakJBLENBQUE7QUFBQSxJQW1CQSxHQUFBLEdBQVUsSUFBQSxLQUFLLENBQUMsU0FBTixDQUFnQjtBQUFBLE1BQ3hCLFNBQUEsRUFBVyxDQURhO0FBQUEsTUFFeEIsU0FBQSxFQUFXLEVBRmE7QUFBQSxNQUd4QixNQUFBLEVBQVEsR0FIZ0I7QUFBQSxNQUl4QixLQUFBLEVBQU8sUUFKaUI7QUFBQSxNQUt4QixRQUFBLEVBQVUsS0FMYztBQUFBLE1BTXhCLGFBQUEsRUFBZSxFQU5TO0FBQUEsTUFPeEIsV0FBQSxFQUFhLENBUFc7QUFBQSxNQVF4QixpQkFBQSxFQUFtQixHQVJLO0tBQWhCLENBbkJWLENBQUE7QUFBQSxJQTZCQSxJQUFDLENBQUEsR0FBRCxDQUFLLEdBQUwsQ0E3QkEsQ0FBQTtBQUFBLElBZ0NBLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFLLENBQUMsS0FBTixDQUFBLENBaENiLENBQUE7QUFBQSxJQWlDQSxJQUFDLENBQUEsR0FBRCxDQUFLLElBQUMsQ0FBQSxLQUFOLENBakNBLENBQUE7QUFBQSxJQW1DQSxHQUFBLEdBQVUsSUFBQSxjQUFBLENBQUEsQ0FuQ1YsQ0FBQTtBQUFBLElBb0NBLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVCxFQUFnQix5QkFBaEIsRUFBMkMsSUFBM0MsQ0FwQ0EsQ0FBQTtBQUFBLElBcUNBLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ1gsUUFBQSxLQUFDLENBQUEsUUFBRCxHQUFZLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFwQixDQUFaLENBQUE7ZUFDQSxLQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxLQUFDLENBQUEsUUFBYixFQUZXO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FyQ2IsQ0FBQTtXQXdDQSxHQUFHLENBQUMsSUFBSixDQUFBLEVBekNNO0VBQUEsQ0FqQ1IsQ0FBQTs7bUJBQUE7O0dBRjRCLEtBQUssQ0FBQyxNQXhuQnBDLENBQUE7O0FBQUEsS0F1c0JXLENBQUM7QUFFVix1QkFBQSxTQUFBLEdBQWMsSUFBZCxDQUFBOztBQUFBLHVCQUNBLFlBQUEsR0FBYyxJQURkLENBQUE7O0FBQUEsdUJBRUEsS0FBQSxHQUFjLElBRmQsQ0FBQTs7QUFBQSxFQUlBLFVBQUMsQ0FBQSxZQUFELEdBQWUsc0JBSmYsQ0FBQTs7QUFNYSxFQUFBLG9CQUFDLEVBQUQsRUFBSyxZQUFMLEdBQUE7QUFDWCwyQ0FBQSxDQUFBO0FBQUEsSUFBQSxFQUFFLENBQUMsVUFBSCxDQUFjO0FBQUEsTUFDWixTQUFBLEVBQVcsRUFEQztBQUFBLE1BRVosWUFBQSxFQUFjLFlBRkY7S0FBZCxDQUFBLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxTQUFELEdBQWdCLEVBTGhCLENBQUE7QUFBQSxJQU1BLElBQUMsQ0FBQSxZQUFELEdBQWdCLFlBTmhCLENBQUE7QUFRQSxJQUFBLElBQUcsQ0FBQSxJQUFLLENBQUEsV0FBRCxDQUFBLENBQUosSUFBdUIsS0FBSyxDQUFDLEdBQU4sS0FBYSxhQUF2QztBQUNFLE1BQUEsUUFBUSxDQUFDLE1BQVQsR0FBa0IsbURBQWxCLENBQUE7QUFBQSxNQUNBLFFBQVEsQ0FBQyxNQUFULEdBQWtCLDJCQURsQixDQURGO0tBVFc7RUFBQSxDQU5iOztBQUFBLHVCQW1CQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsSUFBQSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBaEIsQ0FBd0IsNkRBQXhCLEVBQXVGLElBQXZGLENBQUEsS0FBZ0csTUFBcEc7QUFDRSxNQUFBLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBQWdDLENBQUMsU0FBUyxDQUFDLEdBQTNDLENBQStDLE1BQS9DLENBQUEsQ0FBQTtBQUFBLE1BQ0EsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZ0MsQ0FBQyxnQkFBakMsQ0FBa0QsT0FBbEQsRUFBMkQsSUFBQyxDQUFBLE9BQTVELENBREEsQ0FERjtLQUFBLE1BQUE7QUFJRSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFoQixDQUF3Qix5REFBeEIsRUFBbUYsSUFBbkYsQ0FBVCxDQUFBO0FBQ0EsYUFBTyxJQUFQLENBTEY7S0FBQTtBQU1BLFdBQU8sS0FBUCxDQVBXO0VBQUEsQ0FuQmIsQ0FBQTs7QUFBQSx1QkE0QkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtXQUNQLEVBQUUsQ0FBQyxPQUFILENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUEsR0FBQTtBQUNULFFBQUEsS0FBQyxDQUFBLEtBQUQsR0FBa0IsRUFBRSxDQUFDLFdBQUgsQ0FBQSxDQUFsQixDQUFBO0FBQUEsUUFDQSxRQUFRLENBQUMsTUFBVCxHQUFrQixtQkFBQSxHQUFzQixLQUFDLENBQUEsS0FEekMsQ0FBQTtBQUFBLFFBRUEsUUFBUSxDQUFDLE1BQVQsR0FBa0IsMkJBRmxCLENBQUE7QUFBQSxRQUdBLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBQWdDLENBQUMsU0FBUyxDQUFDLE1BQTNDLENBQWtELE1BQWxELENBSEEsQ0FBQTtlQUlBLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFoQyxFQUxTO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQURPO0VBQUEsQ0E1QlQsQ0FBQTs7QUFBQSx1QkFxQ0EsU0FBQSxHQUFXLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtBQUVULElBQUEsSUFBRyxzQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxJQUE1QyxDQUFIO0FBQ0UsYUFBTyxRQUFBLENBQVMsSUFBVCxDQUFQLENBREY7S0FBQTtBQUdBLElBQUEsSUFBQSxDQUFBLGVBQXNCLENBQUMsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBUDtBQUNFLGFBQU8sT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFBLEdBQU8sSUFBUCxHQUFjLDRCQUExQixDQUFQLENBREY7S0FIQTtXQU1BLEVBQUUsQ0FBQyxHQUFILENBQU8sVUFBUCxFQUFtQjtBQUFBLE1BQUUsR0FBQSxFQUFLLElBQVA7S0FBbkIsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsS0FBRCxFQUFRLEtBQVIsR0FBQTtBQUNoQyxZQUFBLEdBQUE7QUFBQSxRQUFBLElBQUksS0FBSjtpQkFDRSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQUssQ0FBQyxPQUFsQixFQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsR0FBQSxHQUFNLENBQUMsRUFBRCxFQUFLLEtBQUssQ0FBQyxJQUFOLEdBQVcsR0FBaEIsRUFBcUIsS0FBSyxDQUFDLEVBQTNCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsR0FBcEMsQ0FBTixDQUFBO2lCQUNBLFFBQUEsQ0FBUyxHQUFULEVBSkY7U0FEZ0M7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxFQVJTO0VBQUEsQ0FyQ1gsQ0FBQTs7QUFBQSx1QkFxREEsV0FBQSxHQUFhLFNBQUMsTUFBRCxFQUFTLE9BQVQsRUFBcUIsUUFBckIsR0FBQTtBQUNYLFFBQUEsY0FBQTs7TUFEb0IsVUFBUTtLQUM1QjtBQUFBLElBQUEsSUFBRyxNQUFBLElBQVcsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsQ0FBZDtBQUNFLE1BQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBWCxDQUFtQiw0QkFBbkIsRUFBaUQsRUFBakQsQ0FBUCxDQUFBO0FBQUEsTUFFQSxRQUFBLEdBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxJQUFWO0FBQUEsUUFDQSxlQUFBLEVBQWlCLElBRGpCO0FBQUEsUUFFQSxhQUFBLEVBQWUsSUFGZjtBQUFBLFFBR0EsV0FBQSxFQUFhLEtBSGI7T0FIRixDQUFBO0FBQUEsTUFRQSxPQUFBLEdBQVUsT0FBTyxDQUFDLEtBQVIsQ0FBYyxRQUFkLEVBQXdCLE9BQXhCLENBUlYsQ0FBQTthQVNBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVixFQUFnQixPQUFoQixFQUF5QixRQUF6QixFQVZGO0tBRFc7RUFBQSxDQXJEYixDQUFBOztBQUFBLHVCQWtFQSxrQkFBQSxHQUFvQixTQUFDLElBQUQsRUFBTyxRQUFQLEdBQUE7QUFDbEIsSUFBQSxJQUFHLE1BQUEsQ0FBQSxJQUFBLEtBQWUsUUFBZixJQUE0QixJQUFJLENBQUMsY0FBTCxDQUFvQixNQUFwQixDQUEvQjtBQUNFLE1BQUEsUUFBQSxDQUFTLElBQVQsQ0FBQSxDQUFBO0FBQ0EsYUFBTyxJQUFQLENBRkY7S0FBQTtXQUlBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBWCxFQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxJQUFELEdBQUE7ZUFDZixLQUFDLENBQUEsR0FBRCxDQUFLLElBQUwsRUFBVyxRQUFYLEVBRGU7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQixFQUxrQjtFQUFBLENBbEVwQixDQUFBOztBQUFBLHVCQTJFQSxHQUFBLEdBQUssU0FBQyxJQUFELEVBQU8sUUFBUCxHQUFBO1dBQ0gsRUFBRSxDQUFDLEdBQUgsQ0FBTyxJQUFQLEVBQWEsUUFBYixFQURHO0VBQUEsQ0EzRUwsQ0FBQTs7QUFBQSx1QkE4RUEsV0FBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtXQUNYLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFwQixFQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxLQUFELEdBQUE7ZUFDeEIsUUFBQSxDQUFTLEtBQUssQ0FBQyxVQUFOLEdBQWlCLGVBQWpCLEdBQWlDLEtBQUMsQ0FBQSxLQUEzQyxFQUR3QjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLEVBRFc7RUFBQSxDQTlFYixDQUFBOztBQUFBLHVCQW1GQSxNQUFBLEdBQVEsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLFFBQWYsR0FBQTtBQUNOLElBQUEsSUFBRyxNQUFBLENBQUEsSUFBQSxLQUFlLFVBQWxCO0FBQ0UsTUFBQSxRQUFBLEdBQVcsSUFBWCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQVcsUUFEWCxDQURGO0tBQUE7QUFJQSxJQUFBLElBQUcsSUFBQSxLQUFRLE9BQVg7YUFDRSxJQUFDLENBQUEsU0FBRCxDQUFXLHlCQUFBLEdBQTBCLE1BQXJDLEVBQTZDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUMzQyxVQUFBLElBQUEsR0FBTyxJQUFBLEdBQUsseUJBQUwsR0FBK0IsS0FBQyxDQUFBLEtBQXZDLENBQUE7aUJBQ0EsRUFBRSxDQUFDLEdBQUgsQ0FBTyxJQUFQLEVBQWEsUUFBYixFQUYyQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdDLEVBREY7S0FBQSxNQUFBO0FBTUUsTUFBQSxJQUFBLEdBQU8sR0FBQSxHQUFJLElBQUosR0FBUyxlQUFULEdBQXlCLElBQUMsQ0FBQSxLQUExQixHQUFnQyxLQUFoQyxHQUFzQyxNQUE3QyxDQUFBO2FBQ0EsRUFBRSxDQUFDLEdBQUgsQ0FBTyxJQUFQLEVBQWEsUUFBYixFQVBGO0tBTE07RUFBQSxDQW5GUixDQUFBOztvQkFBQTs7SUF6c0JGLENBQUE7O0FBQUEsS0EyeUJXLENBQUM7QUFDVix5QkFBQSxFQUFBLEdBQUksSUFBSixDQUFBOztBQUFBLHlCQUNBLE9BQUEsR0FBUyxJQURULENBQUE7O0FBQUEseUJBSUEsS0FBQSxHQUFlLElBSmYsQ0FBQTs7QUFBQSx5QkFLQSxJQUFBLEdBQWUsSUFMZixDQUFBOztBQUFBLHlCQU1BLGFBQUEsR0FBZSxJQU5mLENBQUE7O0FBQUEseUJBT0EsRUFBQSxHQUFlLElBUGYsQ0FBQTs7QUFBQSx5QkFRQSxVQUFBLEdBQWUsQ0FSZixDQUFBOztBQUFBLHlCQVNBLGFBQUEsR0FBZSxDQVRmLENBQUE7O0FBQUEseUJBVUEsT0FBQSxHQUFlLElBVmYsQ0FBQTs7QUFBQSx5QkFXQSxPQUFBLEdBQWUsSUFYZixDQUFBOztBQUFBLHlCQWFBLFNBQUEsR0FBZSxDQWJmLENBQUE7O0FBQUEsRUFlQSxZQUFDLENBQUEsS0FBRCxHQUFTLElBZlQsQ0FBQTs7QUFrQmEsRUFBQSxzQkFBQyxPQUFELEdBQUE7QUFDWCx1Q0FBQSxDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLHFFQUFBLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxPQUFELEdBQWlCLE9BQWpCLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxFQUFELEdBQWlCLEtBQUssQ0FBQyxFQUR2QixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsRUFBRCxHQUFpQixRQUFRLENBQUMsYUFBVCxDQUF1QixTQUF2QixDQUhqQixDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsS0FBRCxHQUFpQixRQUFRLENBQUMsYUFBVCxDQUF1QixvQkFBdkIsQ0FKakIsQ0FBQTtBQUFBLElBS0EsSUFBQyxDQUFBLElBQUQsR0FBaUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZUFBdkIsQ0FMakIsQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FOakIsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxpQkFBaUIsQ0FBQyxNQUE1QixDQVJBLENBQUE7QUFBQSxJQVNBLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FUQSxDQURXO0VBQUEsQ0FsQmI7O0FBQUEseUJBOEJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxJQUFBLFFBQVEsQ0FBQyxhQUFULENBQXVCLGNBQXZCLENBQXNDLENBQUMsZ0JBQXZDLENBQXdELFFBQXhELEVBQWtFLElBQUMsQ0FBQSxvQkFBbkUsQ0FBQSxDQUFBO1dBQ0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLElBQUMsQ0FBQSxVQUFwQyxFQUZPO0VBQUEsQ0E5QlQsQ0FBQTs7QUFBQSx5QkFrQ0Esb0JBQUEsR0FBc0IsU0FBQyxDQUFELEdBQUE7QUFDcEIsSUFBQSxDQUFDLENBQUMsY0FBRixDQUFBLENBQUEsQ0FBQTtBQUNBLElBQUEsSUFBeUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBYixHQUFzQixDQUEvQzthQUFBLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFmLEVBQUE7S0FGb0I7RUFBQSxDQWxDdEIsQ0FBQTs7QUFBQSx5QkFzQ0EsVUFBQSxHQUFZLFNBQUMsQ0FBRCxHQUFBO0FBQ1YsWUFBTyxDQUFDLENBQUMsT0FBVDtBQUFBLFdBQ08sUUFBUSxDQUFDLEtBRGhCO0FBRUksUUFBQSxJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQWIsS0FBdUIsQ0FBMUI7QUFDRSxVQUFBLElBQUcsSUFBQyxDQUFBLEtBQUQsS0FBVSxpQkFBaUIsQ0FBQyxNQUEvQjttQkFDRSxJQUFDLENBQUEsUUFBRCxDQUFVLGlCQUFpQixDQUFDLE1BQTVCLEVBREY7V0FBQSxNQUFBO21CQUdFLElBQUMsQ0FBQSxRQUFELENBQVUsaUJBQWlCLENBQUMsTUFBNUIsRUFIRjtXQURGO1NBQUEsTUFLSyxJQUFHLElBQUMsQ0FBQSxLQUFELEtBQVUsaUJBQWlCLENBQUMsTUFBNUIsSUFBdUMsSUFBQyxDQUFBLE9BQTNDO2lCQUNILElBQUMsQ0FBQSxRQUFELENBQVUsaUJBQWlCLENBQUMsY0FBNUIsRUFERztTQUFBLE1BRUEsSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLGlCQUFpQixDQUFDLGNBQS9CO2lCQUNILElBQUMsQ0FBQSxHQUFELENBQUEsRUFERztTQVRUO0FBQ087QUFEUCxXQVlPLFFBQVEsQ0FBQyxFQVpoQjtBQWFJLFFBQUEsSUFBUyxJQUFDLENBQUEsS0FBRCxLQUFVLGlCQUFpQixDQUFDLE1BQXJDO2lCQUFBLElBQUMsQ0FBQSxFQUFELENBQUEsRUFBQTtTQWJKO0FBWU87QUFaUCxXQWVPLFFBQVEsQ0FBQyxJQWZoQjtBQWdCSSxRQUFBLElBQVcsSUFBQyxDQUFBLEtBQUQsS0FBVSxpQkFBaUIsQ0FBQyxNQUF2QztpQkFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBQUE7U0FoQko7QUFlTztBQWZQLFdBa0JPLFFBQVEsQ0FBQyxHQWxCaEI7QUFBQSxXQWtCcUIsUUFBUSxDQUFDLE1BbEI5QjtBQW1CSSxRQUFBLElBQUcsSUFBQyxDQUFBLEtBQUQsS0FBVSxpQkFBaUIsQ0FBQyxNQUEvQjtpQkFDRSxJQUFDLENBQUEsUUFBRCxDQUFVLGlCQUFpQixDQUFDLE1BQTVCLEVBREY7U0FBQSxNQUVLLElBQUcsSUFBQyxDQUFBLEtBQUQsS0FBVSxpQkFBaUIsQ0FBQyxjQUEvQjtpQkFDSCxJQUFDLENBQUEsUUFBRCxDQUFVLGlCQUFpQixDQUFDLE1BQTVCLEVBREc7U0FBQSxNQUFBO2lCQUdILElBQUMsQ0FBQSxRQUFELENBQVUsaUJBQWlCLENBQUMsTUFBNUIsRUFIRztTQXJCVDtBQWtCcUI7QUFsQnJCO0FBMkJJLGVBQU8sS0FBUCxDQTNCSjtBQUFBLEtBRFU7RUFBQSxDQXRDWixDQUFBOztBQUFBLHlCQW9FQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixJQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBVCxDQUFBO0FBQ0EsWUFBTyxJQUFDLENBQUEsS0FBUjtBQUFBLFdBQ08saUJBQWlCLENBQUMsTUFEekI7QUFFSSxRQUFBLElBQUMsQ0FBQSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQWQsQ0FBcUIsUUFBckIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFkLENBQXFCLGFBQXJCLENBREEsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLEdBQWtCLEVBSGxCLENBQUE7QUFBQSxRQUlBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUCxHQUFrQixLQUpsQixDQUFBO0FBQUEsUUFLQSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsQ0FBQSxDQUxBLENBQUE7ZUFPQSxJQUFDLENBQUEsS0FBRCxDQUFBLEVBVEo7QUFBQSxXQVVPLGlCQUFpQixDQUFDLE1BVnpCO2VBV0ksSUFBQyxDQUFBLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixRQUFsQixFQVhKO0FBQUEsV0FZTyxpQkFBaUIsQ0FBQyxNQVp6QjtBQWFJLFFBQUEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixhQUFsQixDQUFBLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUCxHQUFrQixJQUZsQixDQUFBO0FBQUEsUUFHQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQUhBLENBQUE7QUFBQSxRQUtBLElBQUMsQ0FBQSxVQUFELEdBQWlCLElBQUMsQ0FBQSxhQUFhLENBQUMsYUFBZixDQUE2QixJQUE3QixDQUFrQyxDQUFDLFlBTHBELENBQUE7QUFBQSxRQU1BLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBQyxJQUFDLENBQUEsYUFBYSxDQUFDLGdCQUFmLENBQWdDLElBQWhDLENBQXFDLENBQUMsTUFBdEMsR0FBNkMsQ0FBOUMsQ0FOL0IsQ0FBQTtBQVFBLFFBQUEsSUFBeUMsSUFBQyxDQUFBLE9BQTFDO0FBQUEsVUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFuQixDQUEwQixVQUExQixDQUFBLENBQUE7U0FSQTtlQVNBLElBQUMsQ0FBQSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQWQsQ0FBcUIsZUFBckIsRUF0Qko7QUFBQSxXQXVCTyxpQkFBaUIsQ0FBQyxjQXZCekI7QUF3QkksUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixVQUF2QixDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFkLENBQWtCLGVBQWxCLEVBekJKO0FBQUEsS0FGUTtFQUFBLENBcEVWLENBQUE7O0FBQUEseUJBaUdBLEVBQUEsR0FBSSxTQUFBLEdBQUE7QUFDRixRQUFBLElBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxVQUFyQixDQUFBO0FBQ0EsSUFBQSxJQUFHLElBQUEsSUFBUSxDQUFYO0FBQ0UsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFELENBQUEsRUFGRjtLQUZFO0VBQUEsQ0FqR0osQ0FBQTs7QUFBQSx5QkF1R0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFFBQUEsSUFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLFVBQXJCLENBQUE7QUFDQSxJQUFBLElBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFULENBQUEsSUFBa0IsSUFBQyxDQUFBLGFBQXRCO0FBQ0UsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFELENBQUEsRUFGRjtLQUZJO0VBQUEsQ0F2R04sQ0FBQTs7QUFBQSx5QkE2R0EsS0FBQSxHQUFPLFNBQUEsR0FBQTtBQUNMLFFBQUEsUUFBQTtBQUFBLElBQUEsSUFBRyxJQUFDLENBQUEsYUFBYSxDQUFDLGdCQUFmLENBQWdDLElBQWhDLENBQXFDLENBQUMsTUFBdEMsR0FBK0MsQ0FBbEQ7QUFDRSxNQUFBLENBQUEsQ0FBRSxDQUFDLElBQUMsQ0FBQSxhQUFGLEVBQWlCLElBQUMsQ0FBQSxLQUFsQixDQUFGLENBQTJCLENBQUMsR0FBNUIsQ0FBZ0MsV0FBaEMsRUFBNkMsZUFBQSxHQUFnQixJQUFDLENBQUEsU0FBakIsR0FBMkIsS0FBeEUsQ0FBQSxDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sQ0FBQyxJQUFDLENBQUEsU0FBRCxHQUFXLENBQUEsQ0FBWixDQUFBLEdBQWtCLENBQUMsSUFBQyxDQUFBLGFBQUQsR0FBaUIsQ0FBQyxJQUFDLENBQUEsYUFBYSxDQUFDLGdCQUFmLENBQWdDLElBQWhDLENBQXFDLENBQUMsTUFBdEMsR0FBNkMsQ0FBOUMsQ0FBbEIsQ0FEeEIsQ0FBQTtBQUFBLE1BRUEsR0FBQSxHQUFNLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxDQUZOLENBQUE7QUFBQSxNQUdBLEdBQUEsR0FBTSxJQUFDLENBQUEsRUFBRSxDQUFDLGFBQUosQ0FBa0IsZUFBQSxHQUFnQixDQUFDLEdBQUEsR0FBSSxDQUFMLENBQWhCLEdBQXdCLEdBQTFDLENBSE4sQ0FBQTtBQUtBLE1BQUEsSUFBRyxHQUFHLENBQUMsWUFBSixDQUFpQixZQUFqQixDQUFIO0FBQ0UsUUFBQSxJQUF3QyxJQUFDLENBQUEsT0FBekM7QUFBQSxVQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQW5CLENBQTBCLFNBQTFCLENBQUEsQ0FBQTtTQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBRFgsQ0FBQTtlQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFNBQXZCLEVBSEY7T0FBQSxNQUFBO2VBS0UsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUxiO09BTkY7S0FBQSxNQUFBO2FBYUUsSUFBQyxDQUFBLFFBQUQsQ0FBVSxpQkFBaUIsQ0FBQyxNQUE1QixFQWJGO0tBREs7RUFBQSxDQTdHUCxDQUFBOztBQUFBLHlCQThIQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsSUFBQSxJQUFDLENBQUEsT0FBRCxHQUFhLElBQWIsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQURiLENBQUE7QUFBQSxJQUVBLENBQUEsQ0FBRSxDQUFDLElBQUMsQ0FBQSxhQUFGLEVBQWlCLElBQUMsQ0FBQSxLQUFsQixDQUFGLENBQTJCLENBQUMsR0FBNUIsQ0FBZ0MsV0FBaEMsRUFBNkMsZUFBQSxHQUFnQixJQUFDLENBQUEsU0FBakIsR0FBMkIsS0FBeEUsQ0FGQSxDQUFBO1dBR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxTQUFmLEdBQTJCLEdBSnRCO0VBQUEsQ0E5SFAsQ0FBQTs7QUFBQSx5QkFvSUEsR0FBQSxHQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsWUFBQTtBQUFBLElBQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixZQUF0QixDQUFSLENBQUE7QUFBQSxJQUNBLEtBQUEsR0FBUSxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FEakIsQ0FBQTtBQUVBLElBQUEsSUFBdUIsS0FBdkI7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLEtBQWIsQ0FBQSxDQUFBO0tBRkE7QUFBQSxJQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLE9BQXZCLENBSkEsQ0FBQTtBQUFBLElBS0EsQ0FBQSxDQUFFLElBQUMsQ0FBQSxPQUFILENBQVcsQ0FBQyxHQUFaLENBQWdCO0FBQUEsTUFDZCxXQUFBLEVBQWEsd0JBQUEsR0FBeUIsTUFBTSxDQUFDLFVBQWhDLEdBQTJDLEtBRDFDO0tBQWhCLENBTEEsQ0FBQTtXQVNBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO0FBQ1QsUUFBQSxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLEtBQUMsQ0FBQSxRQUFELENBQVUsaUJBQWlCLENBQUMsTUFBNUIsQ0FEQSxDQUFBO0FBRUEsUUFBQSxJQUFTLEtBQUMsQ0FBQSxPQUFPLENBQUMsV0FBbEI7QUFBQSxVQUFBLEtBQUMsQ0FBQSxFQUFELENBQUEsQ0FBQSxDQUFBO1NBRkE7ZUFHQSxLQUFDLENBQUEsS0FBRCxDQUFBLEVBSlM7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBS0UsR0FMRixFQVZHO0VBQUEsQ0FwSUwsQ0FBQTs7QUFBQSx5QkFxSkEsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO0FBQ04sUUFBQSwrQkFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBWixDQUFrQixDQUFBLENBQUEsQ0FBekIsQ0FBQTtBQUNBLElBQUEsSUFBRyx5REFBeUQsQ0FBQyxJQUExRCxDQUErRCxJQUEvRCxDQUFIO0FBQ0UsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE1BQUwsQ0FBWSxJQUFJLENBQUMsTUFBTCxHQUFZLENBQXhCLENBQVgsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFXLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBQSxHQUFLLEdBQW5CLEVBQXdCLEVBQXhCLENBRFgsQ0FBQTtBQUVBLE1BQUEsSUFBbUIsUUFBQSxLQUFZLEdBQS9CO0FBQUEsUUFBQSxJQUFBLElBQVksR0FBWixDQUFBO09BRkE7QUFHQSxNQUFBLElBQTBCLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixDQUExQjtBQUFBLFFBQUEsSUFBQSxHQUFXLFdBQVgsQ0FBQTtPQUpGO0tBQUEsTUFBQTtBQU1FLE1BQUEsSUFBQSxHQUFXLFFBQVgsQ0FORjtLQURBO0FBQUEsSUFTQSxNQUFBLEdBQVMsaXNQQVRULENBQUE7QUFBQSxJQWtCQSxPQUFBLEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFYLENBbEJWLENBQUE7QUFBQSxJQW9CQSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsR0FBZSxlQUFBLEdBQWdCLEtBQWhCLEdBQXNCLEdBcEJyQyxDQUFBO1dBcUJBLElBQUMsQ0FBQSxFQUFFLENBQUMsTUFBSixDQUFXLEtBQVgsRUFBa0IsSUFBbEIsRUFBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsT0FBRCxHQUFBO0FBQ3RCLFlBQUEsaUNBQUE7QUFBQSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBWixDQUFBLENBQUE7QUFDQSxRQUFBLElBQUcsT0FBTyxDQUFDLE1BQVIsS0FBa0IsQ0FBckI7QUFDRSxVQUFBLEtBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxHQUFlLEdBQUEsR0FBSSxLQUFKLEdBQVUsaUJBQXpCLENBQUE7QUFDQSxnQkFBQSxDQUZGO1NBQUEsTUFBQTtBQUlFLFVBQUEsS0FBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLEdBQWUsZUFBQSxHQUFnQixLQUFoQixHQUFzQixHQUFyQyxDQUpGO1NBREE7QUFBQSxRQU9BLEtBQUMsQ0FBQSxPQUFELEdBQWUsRUFQZixDQUFBO0FBQUEsUUFRQSxLQUFDLENBQUEsYUFBYSxDQUFDLFdBQWYsQ0FBMkIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBM0IsQ0FSQSxDQUFBO0FBU0EsYUFBQSxpREFBQTs2QkFBQTtBQUNFLFVBQUEsRUFBQSxHQUFLLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBQUwsQ0FBQTtBQUFBLFVBQ0EsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsWUFBaEIsRUFBOEIsQ0FBOUIsQ0FEQSxDQUFBO0FBQUEsVUFHQSxXQUFBLEdBQWMsS0FBSyxDQUFDLFdBSHBCLENBQUE7QUFJQSxVQUFBLElBQUEsQ0FBQSxXQUFBO0FBQUEsWUFBQSxXQUFBLEdBQWMsdUJBQWQsQ0FBQTtXQUpBO0FBQUEsVUFLQSxFQUFFLENBQUMsU0FBSCxHQUFlLHNCQUFBLEdBRUMsV0FGRCxHQUVhLDZFQUZiLEdBSUosS0FBSyxDQUFDLEtBSkYsR0FJUSxlQUpSLEdBS0wsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFwQixDQUFBLENBQUQsQ0FMSyxHQUs4Qix3QkFWN0MsQ0FBQTtBQUFBLFVBY0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsS0FBZCxDQWRBLENBQUE7QUFBQSxVQWVBLEtBQUMsQ0FBQSxhQUFhLENBQUMsV0FBZixDQUEyQixFQUEzQixDQWZBLENBREY7QUFBQSxTQVRBO2VBMEJBLEtBQUMsQ0FBQSxRQUFELENBQVUsaUJBQWlCLENBQUMsTUFBNUIsRUEzQnNCO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsRUF0Qk07RUFBQSxDQXJKUixDQUFBOztzQkFBQTs7SUE1eUJGLENBQUE7O0FBQUEsS0FzL0JXLENBQUM7QUFHVixFQUFBLE9BQUMsQ0FBQSxVQUFELEdBQWUsb0JBQWYsQ0FBQTs7QUFBQSxFQUNBLE9BQUMsQ0FBQSxVQUFELEdBQWUsb0JBRGYsQ0FBQTs7QUFBQSxvQkFJQSxPQUFBLEdBQWMsSUFKZCxDQUFBOztBQUFBLG9CQUtBLFFBQUEsR0FBYyxJQUxkLENBQUE7O0FBQUEsb0JBT0EsRUFBQSxHQUFjLElBUGQsQ0FBQTs7QUFBQSxvQkFTQSxLQUFBLEdBQVcsSUFUWCxDQUFBOztBQUFBLG9CQVdBLFVBQUEsR0FBWSxHQVhaLENBQUE7O0FBQUEsb0JBWUEsWUFBQSxHQUFjLElBWmQsQ0FBQTs7QUFBQSxvQkFhQSxhQUFBLEdBQWUsSUFiZixDQUFBOztBQWVhLEVBQUEsaUJBQUEsR0FBQTtBQUNYLDZDQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsUUFBRCxHQUFnQixFQUFoQixDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsRUFBRCxHQUFnQixLQUFLLENBQUMsRUFGdEIsQ0FBQTtBQUFBLElBSUEsSUFBQyxDQUFBLFNBQUQsR0FBZ0IsYUFKaEIsQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQXhCLENBTkEsQ0FBQTtBQUFBLElBT0EsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQVBBLENBQUE7QUFBQSxJQVFBLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FSQSxDQURXO0VBQUEsQ0FmYjs7QUFBQSxvQkEwQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtXQUNQLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixLQUFLLENBQUMsS0FBSyxDQUFDLFVBQXRDLEVBQWtELElBQUMsQ0FBQSxnQkFBbkQsRUFETztFQUFBLENBMUJULENBQUE7O0FBQUEsb0JBNkJBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtXQUNoQixJQUFDLENBQUEsUUFBRCxDQUFVLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBeEIsRUFEZ0I7RUFBQSxDQTdCbEIsQ0FBQTs7QUFBQSxvQkFnQ0EsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEtBQVQsQ0FBQTtBQUNBLFlBQU8sSUFBQyxDQUFBLEtBQVI7QUFBQSxXQUNPLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFEckI7ZUFFSSxNQUFNLENBQUMsT0FBUCxDQUFlLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBN0IsRUFBeUM7QUFBQSxVQUFFLE9BQUEsRUFBUyxJQUFYO1NBQXpDLEVBRko7QUFBQSxXQUdPLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFIckI7ZUFJSSxNQUFNLENBQUMsT0FBUCxDQUFlLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBN0IsRUFBeUM7QUFBQSxVQUFFLE9BQUEsRUFBUyxJQUFYO1NBQXpDLEVBSko7QUFBQSxLQUZRO0VBQUEsQ0FoQ1YsQ0FBQTs7QUFBQSxvQkF3Q0EsWUFBQSxHQUFjLFNBQUMsSUFBRCxFQUFPLFNBQVAsR0FBQTtBQUNaLFFBQUEsS0FBQTs7TUFEbUIsWUFBVTtLQUM3QjtBQUFBLElBQUEsS0FBQSxHQUFzQixJQUFBLEtBQUssQ0FBQyxLQUFOLENBQUEsQ0FBdEIsQ0FBQTtBQUFBLElBQ0EsS0FBSyxDQUFDLFNBQU4sR0FBa0IsU0FEbEIsQ0FBQTtBQUFBLElBRUEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLENBRkEsQ0FBQTtXQUdBLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLEtBQWYsRUFKWTtFQUFBLENBeENkLENBQUE7O0FBQUEsb0JBOENBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixJQUFBLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLEdBQW1CLENBQW5CLElBQXlCLElBQUMsQ0FBQSxLQUFELEtBQVUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFwRDtBQUNFLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBREY7S0FBQTtXQUdBLFVBQUEsQ0FBVyxJQUFDLENBQUEsUUFBWixFQUFzQixJQUFDLENBQUEsYUFBdkIsRUFKUTtFQUFBLENBOUNWLENBQUE7O0FBQUEsb0JBb0RBLEdBQUEsR0FBSyxTQUFDLFVBQUQsR0FBQTtBQUNILElBQUEsSUFBRyxNQUFBLENBQUEsVUFBQSxLQUFxQixTQUFyQixJQUFtQyxVQUF0QztBQUNFLE1BQUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxFQUFkLEVBQWtCLElBQWxCLENBQUEsQ0FBQTtBQUNBLFlBQUEsQ0FGRjtLQUFBO1dBSUEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxrQkFBSixDQUF1QixVQUF2QixFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxDQUFELEdBQUE7QUFDakMsWUFBQSw4QkFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUNBLFFBQUEsSUFBRyxDQUFDLENBQUMsY0FBRixDQUFpQixRQUFqQixDQUFIO0FBQ0UsVUFBQSxNQUFBLEdBQVMsQ0FBQyxDQUFDLE1BQVgsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLE1BQUEsR0FBUyxDQUFDLENBQUQsQ0FBVCxDQUhGO1NBREE7QUFNQTthQUFBLHdDQUFBOzJCQUFBO0FBQ0Usd0JBQUEsS0FBQyxDQUFBLFlBQUQsQ0FBYyxJQUFkLEVBQW9CLEtBQXBCLEVBQUEsQ0FERjtBQUFBO3dCQVBpQztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLEVBTEc7RUFBQSxDQXBETCxDQUFBOztBQUFBLG9CQW1FQSxNQUFBLEdBQVEsU0FBQyxLQUFELEdBQUE7QUFDTixJQUFBLElBQVUsSUFBQyxDQUFBLFNBQUQsS0FBYyxZQUF4QjtBQUFBLFlBQUEsQ0FBQTtLQUFBO1dBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQWlCLEtBQWpCLEVBQXdCLENBQXhCLEVBRk07RUFBQSxDQW5FUixDQUFBOztBQUFBLG9CQXVFQSxJQUFBLEdBQU0sU0FBQyxNQUFELEVBQVMsTUFBVCxHQUFBO0FBQ0osUUFBQSxHQUFBO0FBQUEsSUFBQSxJQUFVLElBQUMsQ0FBQSxTQUFELEtBQWMsWUFBeEI7QUFBQSxZQUFBLENBQUE7S0FBQTtBQUFBLElBRUEsR0FBQSxHQUFvQixJQUFDLENBQUEsUUFBUyxDQUFBLE1BQUEsQ0FGOUIsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLFFBQVMsQ0FBQSxNQUFBLENBQVYsR0FBb0IsSUFBQyxDQUFBLFFBQVMsQ0FBQSxNQUFBLENBSDlCLENBQUE7V0FJQSxJQUFDLENBQUEsUUFBUyxDQUFBLE1BQUEsQ0FBVixHQUFvQixJQUxoQjtFQUFBLENBdkVOLENBQUE7O0FBQUEsb0JBOEVBLE1BQUEsR0FBUSxTQUFDLEtBQUQsR0FBQTtBQUNOLElBQUEsSUFBVSxJQUFDLENBQUEsU0FBRCxLQUFjLFlBQXhCO0FBQUEsWUFBQSxDQUFBO0tBQUE7V0FDQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsS0FBckIsRUFGTTtFQUFBLENBOUVSLENBQUE7O0FBQUEsb0JBa0ZBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixJQUFBLElBQVUsSUFBQyxDQUFBLFNBQUQsS0FBYyxZQUF4QjtBQUFBLFlBQUEsQ0FBQTtLQUFBO0FBRUEsSUFBQSxJQUErQixJQUFDLENBQUEsWUFBaEM7QUFBQSxNQUFBLFlBQUEsQ0FBYSxJQUFDLENBQUEsWUFBZCxDQUFBLENBQUE7S0FGQTtBQUFBLElBSUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQXhCLENBSkEsQ0FBQTtXQUtBLElBQUMsQ0FBQSxZQUFELEdBQWdCLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO0FBQ3pCLFFBQUEsSUFBbUIsS0FBQyxDQUFBLE9BQXBCO0FBQUEsVUFBQSxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBQSxDQUFBLENBQUE7U0FBQTtBQUNBLFFBQUEsSUFBRyxLQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsR0FBbUIsQ0FBdEI7QUFDRSxVQUFBLEtBQUMsQ0FBQSxPQUFELEdBQVcsS0FBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQUEsQ0FBWCxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFBLEVBRkY7U0FGeUI7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBS2QsSUFBQyxDQUFBLFVBTGEsRUFOWjtFQUFBLENBbEZOLENBQUE7O2lCQUFBOztJQXovQkYsQ0FBQTs7QUFBQSxLQXlsQ1csQ0FBQztBQUdWLEVBQUEsS0FBQyxDQUFBLFVBQUQsR0FBYSxrQkFBYixDQUFBOztBQUFBLEVBQ0EsS0FBQyxDQUFBLFNBQUQsR0FBYSxpQkFEYixDQUFBOztBQUFBLEVBRUEsS0FBQyxDQUFBLFVBQUQsR0FBYSxrQkFGYixDQUFBOztBQUFBLEVBR0EsS0FBQyxDQUFBLFNBQUQsR0FBYSxpQkFIYixDQUFBOztBQUFBLEVBSUEsS0FBQyxDQUFBLFVBQUQsR0FBYSxrQkFKYixDQUFBOztBQUFBLEVBTUEsS0FBQyxDQUFBLE9BQUQsR0FDRTtBQUFBLElBQUEsYUFBQSxFQUFlLGVBQWY7QUFBQSxJQUNBLFdBQUEsRUFBZSxhQURmO0FBQUEsSUFFQSxJQUFBLEVBQWUsTUFGZjtHQVBGLENBQUE7O0FBQUEsa0JBWUEsR0FBQSxHQUFVLElBWlYsQ0FBQTs7QUFBQSxrQkFhQSxLQUFBLEdBQVUsSUFiVixDQUFBOztBQUFBLGtCQWNBLFFBQUEsR0FBVSxJQWRWLENBQUE7O0FBQUEsa0JBZUEsSUFBQSxHQUFVLElBZlYsQ0FBQTs7QUFBQSxrQkFpQkEsUUFBQSxHQUFVLElBakJWLENBQUE7O0FBQUEsa0JBbUJBLFFBQUEsR0FBVSxJQW5CVixDQUFBOztBQUFBLGtCQW9CQSxLQUFBLEdBQVUsSUFwQlYsQ0FBQTs7QUFBQSxrQkFzQkEsa0JBQUEsR0FBb0IsQ0F0QnBCLENBQUE7O0FBQUEsa0JBdUJBLFNBQUEsR0FBb0IsS0F2QnBCLENBQUE7O0FBeUJhLEVBQUEsZUFBQSxHQUFBO0FBQ1gscURBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSxpRUFBQSxDQUFBO0FBQUEsNkNBQUEsQ0FBQTtBQUFBLDJDQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsMkNBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxHQUFELEdBQVksS0FBSyxDQUFDLEVBQWxCLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FEaEMsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUZBLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUF0QixDQUhBLENBRFc7RUFBQSxDQXpCYjs7QUFBQSxrQkFrQ0EsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO1dBQ1AsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQURGO0VBQUEsQ0FsQ1QsQ0FBQTs7QUFBQSxrQkFxQ0EsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEtBQVQsQ0FBQTtBQUNBLFlBQU8sSUFBQyxDQUFBLEtBQVI7QUFBQSxXQUNPLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFEbkI7ZUFFSSxNQUFNLENBQUMsT0FBUCxDQUFlLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBM0IsRUFBdUM7QUFBQSxVQUFFLEtBQUEsRUFBTyxJQUFUO1NBQXZDLEVBRko7QUFBQSxXQUdPLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FIbkI7QUFJSSxRQUFBLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQTNCLEVBQXNDO0FBQUEsVUFBRSxLQUFBLEVBQU8sSUFBVDtTQUF0QyxFQUxKO0FBQUEsV0FNTyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBTm5CO2VBT0ksTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQTNCLEVBQXVDO0FBQUEsVUFBRSxLQUFBLEVBQU8sSUFBVDtTQUF2QyxFQVBKO0FBQUEsV0FRTyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBUm5CO0FBU0ksUUFBQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBQUEsQ0FBQTtlQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUEzQixFQUFzQztBQUFBLFVBQUUsS0FBQSxFQUFPLElBQVQ7U0FBdEMsRUFWSjtBQUFBLFdBV08sS0FBSyxDQUFDLEtBQUssQ0FBQyxVQVhuQjtBQVlJLFFBQUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFBLENBQUE7ZUFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBM0IsRUFBdUM7QUFBQSxVQUFFLEtBQUEsRUFBTyxJQUFUO1NBQXZDLEVBYko7QUFBQSxLQUZRO0VBQUEsQ0FyQ1YsQ0FBQTs7QUFBQSxrQkF5REEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLElBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQXRCLENBQUEsQ0FBQTtBQUVBLElBQUEsSUFBRyxJQUFDLENBQUEsU0FBSjthQUNFLElBQUMsQ0FBQSxZQUFELENBQUEsRUFERjtLQUFBLE1BRUssSUFBRyxJQUFDLENBQUEsUUFBRCxLQUFhLGFBQWhCO2FBQ0gsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUFMLENBQWlCLFVBQUEsR0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLEVBQW5DLEVBQXVDLElBQUMsQ0FBQSxZQUF4QyxFQURHO0tBQUEsTUFBQTthQUdILElBQUMsQ0FBQSxjQUFELENBQUEsRUFIRztLQUxEO0VBQUEsQ0F6RE4sQ0FBQTs7QUFBQSxrQkFtRUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtXQUNKLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFBLEVBREk7RUFBQSxDQW5FTixDQUFBOztBQUFBLGtCQXNFQSxLQUFBLEdBQU8sU0FBQSxHQUFBO1dBQ0wsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUEsRUFESztFQUFBLENBdEVQLENBQUE7O0FBQUEsa0JBeUVBLElBQUEsR0FBTSxTQUFBLEdBQUE7V0FDSixJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQSxFQURJO0VBQUEsQ0F6RU4sQ0FBQTs7QUFBQSxrQkE0RUEsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO1dBQ04sSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsS0FBYixFQURNO0VBQUEsQ0E1RVIsQ0FBQTs7QUFBQSxrQkErRUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFlBQU8sSUFBQyxDQUFBLFFBQVI7QUFBQSxXQUNPLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBRDNCO2VBRUksSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUEsRUFGSjtBQUFBLFdBR08sS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FIM0I7ZUFJSSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQSxFQUpKO0FBQUE7ZUFNSSxPQUFPLENBQUMsR0FBUixDQUFZLDJCQUFaLEVBTko7QUFBQSxLQURPO0VBQUEsQ0EvRVQsQ0FBQTs7QUFBQSxrQkEyRkEsUUFBQSxHQUFVLFNBQUMsR0FBRCxHQUFBO0FBQ1IsSUFBQSxJQUFDLENBQUEsSUFBRCxHQUFrQixHQUFsQixDQUFBO1dBQ0EsTUFBTSxDQUFDLFFBQVAsR0FBa0IsSUFGVjtFQUFBLENBM0ZWLENBQUE7O0FBQUEsa0JBK0ZBLE9BQUEsR0FBUyxTQUFBLEdBQUE7V0FDUCxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBdEIsRUFETztFQUFBLENBL0ZULENBQUE7O0FBQUEsa0JBa0dBLFFBQUEsR0FBVSxTQUFBLEdBQUE7V0FDUixJQUFDLENBQUEsUUFBRCxDQUFVLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBdEIsRUFEUTtFQUFBLENBbEdWLENBQUE7O0FBQUEsa0JBcUdBLE9BQUEsR0FBUyxTQUFBLEdBQUE7V0FDUCxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBdEIsRUFETztFQUFBLENBckdULENBQUE7O0FBQUEsa0JBd0dBLFFBQUEsR0FBVSxTQUFBLEdBQUE7V0FDUixJQUFDLENBQUEsUUFBRCxDQUFVLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBdEIsRUFEUTtFQUFBLENBeEdWLENBQUE7O0FBQUEsa0JBMkdBLGtCQUFBLEdBQW9CLFNBQUMsS0FBRCxHQUFBO1dBQ2xCLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixNQURKO0VBQUEsQ0EzR3BCLENBQUE7O0FBQUEsa0JBOEdBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixRQUFBLHlEQUFBO0FBQUEsWUFBTyxJQUFDLENBQUEsUUFBUjtBQUFBLFdBQ08sS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFEM0I7QUFFSTthQUFTLDRCQUFULEdBQUE7QUFDRSx3QkFBQSxJQUFDLENBQUEsUUFBUyxDQUFBLENBQUEsQ0FBVixHQUFlLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBbEMsRUFBc0MsSUFBQyxDQUFBLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBaEUsRUFBZixDQURGO0FBQUE7d0JBRko7QUFDTztBQURQLFdBS08sS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FMM0I7QUFNSSxRQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQWpCLENBQUE7QUFDQSxRQUFBLElBQUEsQ0FBQSxRQUFlLENBQUMsc0JBQWhCO0FBQ0UsVUFBQSxLQUFBLEdBQWdCLElBQUEsVUFBQSxDQUFXLFFBQVEsQ0FBQyxPQUFwQixDQUFoQixDQUFBO0FBQUEsVUFDQSxRQUFRLENBQUMscUJBQVQsQ0FBK0IsS0FBL0IsQ0FEQSxDQUFBO0FBRUE7ZUFBUyw0QkFBVCxHQUFBO0FBQ0UsMEJBQUEsSUFBQyxDQUFBLFFBQVMsQ0FBQSxDQUFBLENBQVYsR0FBZSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQU4sR0FBVyxHQUFaLENBQUEsR0FBbUIsSUFBbEMsQ0FERjtBQUFBOzBCQUhGO1NBQUEsTUFBQTtBQU1FLFVBQUEsS0FBQSxHQUFnQixJQUFBLFlBQUEsQ0FBYSxRQUFRLENBQUMsT0FBdEIsQ0FBaEIsQ0FBQTtBQUFBLFVBQ0EsUUFBUSxDQUFDLHNCQUFULENBQWdDLEtBQWhDLENBREEsQ0FBQTtBQUVBO2VBQVMsNEJBQVQsR0FBQTtBQUNFLDBCQUFBLElBQUMsQ0FBQSxRQUFTLENBQUEsQ0FBQSxDQUFWLEdBQWUsS0FBTSxDQUFBLENBQUEsRUFBckIsQ0FERjtBQUFBOzBCQVJGO1NBUEo7QUFBQSxLQURhO0VBQUEsQ0E5R2YsQ0FBQTs7QUFBQSxrQkFpSUEsWUFBQSxHQUFjLFNBQUMsR0FBRCxHQUFBO0FBQ1osUUFBQSxXQUFBO0FBQUEsSUFBQSxJQUFBLENBQUEsTUFBYSxDQUFDLFdBQWQ7QUFDRSxNQUFBLFdBQUEsR0FBYyxLQUFkLENBQUE7QUFDQSxNQUFBLElBQXVCLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFNBQVMsQ0FBQyxTQUExQixDQUF2QjtBQUFBLFFBQUEsSUFBQyxDQUFBLFFBQUQsR0FBYyxLQUFkLENBQUE7T0FGRjtLQUFBLE1BQUE7QUFJRSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBWixDQUpGO0tBQUE7QUFBQSxJQU1BLElBQUMsQ0FBQSxJQUFELEdBQTBCLFdBTjFCLENBQUE7QUFBQSxJQU9BLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixHQUEwQixJQUFDLENBQUEsT0FQM0IsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLEdBQTBCLElBQUMsQ0FBQSxRQVIzQixDQUFBO0FBQUEsSUFTQSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sR0FBMEIsSUFBQyxDQUFBLFFBVDNCLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixHQUEwQixJQUFDLENBQUEsT0FWM0IsQ0FBQTtBQUFBLElBV0EsSUFBQyxDQUFBLElBQUksQ0FBQyxjQUFOLEdBQTBCLElBQUMsQ0FBQSxhQVgzQixDQUFBO0FBQUEsSUFZQSxJQUFDLENBQUEsSUFBSSxDQUFDLGlCQUFOLEdBQTBCLElBQUMsQ0FBQSxrQkFaM0IsQ0FBQTtBQWNBLElBQUEsSUFBRyxJQUFDLENBQUEsU0FBSjtBQUNFLE1BQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCLElBQWxCLENBQUE7YUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLFdBQU4sQ0FBQSxFQUZGO0tBQUEsTUFBQTtBQUlFLE1BQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCLEtBQWxCLENBQUE7YUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxHQUFiLEVBQWtCLElBQUMsQ0FBQSxRQUFuQixFQUE2QixJQUFDLENBQUEsUUFBOUIsRUFMRjtLQWZZO0VBQUEsQ0FqSWQsQ0FBQTs7QUFBQSxrQkF1SkEsY0FBQSxHQUFnQixTQUFBLEdBQUE7V0FDZCxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsQ0FBaUIsSUFBQyxDQUFBLEtBQWxCLEVBQXlCO0FBQUEsTUFDdkIsTUFBQSxFQUFlLElBQUMsQ0FBQSxPQURPO0FBQUEsTUFFdkIsUUFBQSxFQUFlLElBQUMsQ0FBQSxRQUZPO0FBQUEsTUFHdkIsTUFBQSxFQUFlLElBQUMsQ0FBQSxPQUhPO0FBQUEsTUFJdkIsWUFBQSxFQUFlLElBQUMsQ0FBQSxhQUpPO0FBQUEsTUFLdkIsWUFBQSxFQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2IsS0FBQyxDQUFBLGtCQUFELENBQW9CLEtBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixHQUFvQixLQUFDLENBQUEsSUFBSSxDQUFDLFVBQTlDLEVBRGE7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxRO0tBQXpCLEVBT0csSUFBQyxDQUFBLFFBUEosRUFEYztFQUFBLENBdkpoQixDQUFBOztBQUFBLGtCQWlLQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLFFBQUEsY0FBQTtBQUFBLElBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFBLENBQU0sR0FBTixDQUFaLENBQUE7QUFDQTtTQUFTLDRCQUFULEdBQUE7QUFDRSxvQkFBQSxJQUFDLENBQUEsUUFBUyxDQUFBLENBQUEsQ0FBVixHQUFlLEVBQWYsQ0FERjtBQUFBO29CQUZjO0VBQUEsQ0FqS2hCLENBQUE7O2VBQUE7O0lBNWxDRixDQUFBOztBQUFBO0FBc3dDRSxFQUFBLFdBQUMsQ0FBQSxVQUFELEdBQWEsd0JBQWIsQ0FBQTs7QUFBQSxFQUNBLFdBQUMsQ0FBQSxTQUFELEdBQWEsdUJBRGIsQ0FBQTs7QUFBQSxFQUVBLFdBQUMsQ0FBQSxVQUFELEdBQWEsd0JBRmIsQ0FBQTs7QUFBQSxFQUdBLFdBQUMsQ0FBQSxRQUFELEdBQWEsc0JBSGIsQ0FBQTs7QUFBQSx3QkFNQSxVQUFBLEdBQVksYUFOWixDQUFBOztBQUFBLHdCQVFBLEdBQUEsR0FBVyxJQVJYLENBQUE7O0FBQUEsd0JBU0EsUUFBQSxHQUFXLElBVFgsQ0FBQTs7QUFBQSx3QkFVQSxTQUFBLEdBQVcsSUFWWCxDQUFBOztBQUFBLHdCQVdBLE1BQUEsR0FBVyxJQVhYLENBQUE7O0FBQUEsd0JBWUEsR0FBQSxHQUFXLElBWlgsQ0FBQTs7QUFBQSx3QkFjQSxTQUFBLEdBQVcsQ0FkWCxDQUFBOztBQUFBLHdCQWVBLFFBQUEsR0FBVyxDQWZYLENBQUE7O0FBQUEsd0JBZ0JBLFFBQUEsR0FBVyxDQWhCWCxDQUFBOztBQUFBLHdCQWtCQSxJQUFBLEdBQU0sQ0FsQk4sQ0FBQTs7QUFBQSx3QkFvQkEsUUFBQSxHQUFVLEtBcEJWLENBQUE7O0FBQUEsd0JBc0JBLEtBQUEsR0FBTyxJQXRCUCxDQUFBOztBQUFBLHdCQXdCQSxVQUFBLEdBQVksSUF4QlosQ0FBQTs7QUFBQSx3QkF5QkEsVUFBQSxHQUFjLEtBekJkLENBQUE7O0FBNEJhLEVBQUEscUJBQUEsR0FBQTtBQUVYLDZDQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsUUFBQSxDQUFBO0FBQUE7QUFDRSxNQUFBLElBQUksTUFBTSxDQUFDLGtCQUFQLEtBQTZCLE1BQWpDO0FBQ0UsUUFBQSxNQUFNLENBQUMsa0JBQVAsR0FBZ0MsSUFBQSxDQUFDLE1BQU0sQ0FBQyxZQUFQLElBQXFCLE1BQU0sQ0FBQyxrQkFBN0IsQ0FBQSxDQUFBLENBQWhDLENBREY7T0FERjtLQUFBLGNBQUE7QUFJRSxNQURJLFVBQ0osQ0FBQTtBQUFBLE1BQUEsSUFBSSxHQUFHLENBQUMsR0FBSixLQUFXLGFBQWY7QUFDRSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksNkRBQVosQ0FBQSxDQURGO09BSkY7S0FBQTtBQUFBLElBT0EsSUFBQyxDQUFBLEdBQUQsR0FBTyxrQkFQUCxDQUFBO0FBQUEsSUFRQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBUkEsQ0FBQTtBQUFBLElBV0EsU0FBUyxDQUFDLFlBQVYsR0FDRSxTQUFTLENBQUMsWUFBVixJQUE2QixTQUFTLENBQUMsa0JBQXZDLElBQ0EsU0FBUyxDQUFDLGVBRFYsSUFDNkIsU0FBUyxDQUFDLGNBYnpDLENBQUE7QUFBQSxJQWNBLElBQUMsQ0FBQSxVQUFELEdBQWMsTUFBTSxDQUFDLEdBQVAsSUFBYyxNQUFNLENBQUMsU0FkbkMsQ0FBQTtBQUFBLElBaUJBLElBQUMsQ0FBQSxRQUFELENBQVUsV0FBVyxDQUFDLFFBQXRCLENBakJBLENBRlc7RUFBQSxDQTVCYjs7QUFBQSx3QkFpREEsTUFBQSxHQUFRLFNBQUMsR0FBRCxFQUFNLFFBQU4sRUFBc0IsUUFBdEIsR0FBQTtBQUNOLFFBQUEsT0FBQTs7TUFEWSxXQUFTO0tBQ3JCO0FBQUEsSUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFKO0FBQ0UsTUFBQSxLQUFBLENBQU0sb0JBQU4sQ0FBQSxDQUFBO0FBQ0EsWUFBQSxDQUZGO0tBQUE7QUFBQSxJQUlBLE9BQUEsR0FBYyxJQUFBLGNBQUEsQ0FBQSxDQUpkLENBQUE7QUFBQSxJQUtBLE9BQU8sQ0FBQyxJQUFSLENBQWEsS0FBYixFQUFvQixHQUFwQixFQUF5QixJQUF6QixDQUxBLENBQUE7QUFBQSxJQU1BLE9BQU8sQ0FBQyxZQUFSLEdBQTBCLGFBTjFCLENBQUE7QUFBQSxJQU9BLE9BQU8sQ0FBQyxlQUFSLEdBQTBCLEtBUDFCLENBQUE7QUFBQSxJQVFBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFBLEdBQUE7ZUFDZixLQUFDLENBQUEsR0FBRyxDQUFDLGVBQUwsQ0FBcUIsT0FBTyxDQUFDLFFBQTdCLEVBQXVDLFNBQUMsTUFBRCxHQUFBO0FBQ3JDLFVBQUEsS0FBQyxDQUFBLFFBQUQsR0FBWSxJQUFaLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxNQUFELEdBQVUsTUFEVixDQUFBO0FBRUEsVUFBQSxJQUFrQixRQUFsQjtBQUFBLFlBQUEsUUFBQSxDQUFTLEtBQVQsQ0FBQSxDQUFBO1dBRkE7QUFHQSxVQUFBLElBQVcsUUFBWDttQkFBQSxLQUFDLENBQUEsSUFBRCxDQUFBLEVBQUE7V0FKcUM7UUFBQSxDQUF2QyxFQUtFLEtBQUMsQ0FBQSxRQUxILEVBRGU7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVJqQixDQUFBO0FBQUEsSUFlQSxPQUFPLENBQUMsVUFBUixHQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxDQUFELEdBQUE7QUFDbkIsUUFBQSxJQUFHLENBQUMsQ0FBQyxnQkFBTDtBQUNFLFVBQUEsSUFBMEMsS0FBQyxDQUFBLGlCQUEzQzttQkFBQSxLQUFDLENBQUEsaUJBQUQsQ0FBbUIsQ0FBQyxDQUFDLE1BQUYsR0FBVyxDQUFDLENBQUMsS0FBaEMsRUFBQTtXQURGO1NBRG1CO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FmckIsQ0FBQTtXQWtCQSxPQUFPLENBQUMsSUFBUixDQUFBLEVBbkJNO0VBQUEsQ0FqRFIsQ0FBQTs7QUFBQSx3QkFzRUEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLElBQUEsSUFBQSxDQUFBLElBQVEsQ0FBQSxTQUFSO0FBQ0UsTUFBQSxLQUFBLENBQU0sbUJBQU4sQ0FBQSxDQUFBO0FBQ0EsWUFBQSxDQUZGO0tBQUE7V0FJQSxTQUFTLENBQUMsWUFBVixDQUF1QjtBQUFBLE1BQUUsS0FBQSxFQUFPLEtBQVQ7QUFBQSxNQUFnQixLQUFBLEVBQU8sSUFBdkI7S0FBdkIsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsTUFBRCxHQUFBO0FBQ3BELFFBQUEsS0FBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBaEIsQ0FBQTtBQUFBLFFBQ0EsS0FBQyxDQUFBLFlBQUQsR0FBZ0IsTUFEaEIsQ0FBQTtlQUVBLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFIb0Q7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0RCxFQUlFLElBQUMsQ0FBQSxRQUpILEVBTFc7RUFBQSxDQXRFYixDQUFBOztBQUFBLHdCQWlGQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7V0FDUixJQUFDLENBQUEsS0FBRCxHQUFTLE1BREQ7RUFBQSxDQWpGVixDQUFBOztBQUFBLHdCQW9GQSxRQUFBLEdBQVUsU0FBQyxDQUFELEdBQUE7V0FDUixPQUFPLENBQUMsR0FBUixDQUFZLE9BQVosRUFBcUIsQ0FBckIsRUFEUTtFQUFBLENBcEZWLENBQUE7O0FBQUEsd0JBdUZBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxJQUFBLElBQUcsSUFBQyxDQUFBLFNBQUo7YUFDRSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBREY7S0FBQSxNQUVLLElBQUcsSUFBQyxDQUFBLEdBQUo7QUFDSCxNQUFBLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFVLENBQVYsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsR0FBRCxHQUFhLElBRGIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxjQUFYLEdBQTRCLElBRjVCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxRQUFELEdBQWEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUFMLEdBQW1CLElBQUMsQ0FBQSxTQUhqQyxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsUUFBRCxDQUFVLFdBQVcsQ0FBQyxTQUF0QixDQUpBLENBQUE7QUFLQSxNQUFBLElBQWMsSUFBQyxDQUFBLE9BQWY7ZUFBQSxJQUFDLENBQUEsT0FBRCxDQUFBLEVBQUE7T0FORztLQUhBO0VBQUEsQ0F2RlAsQ0FBQTs7QUFBQSx3QkFrR0EsSUFBQSxHQUFNLFNBQUMsUUFBRCxHQUFBO0FBQ0osSUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLFFBQWY7QUFBQSxZQUFBLENBQUE7S0FBQTtBQUNBLElBQUEsSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLFdBQVcsQ0FBQyxVQUF6QjtBQUNFLE1BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLENBQUE7QUFDQSxZQUFBLENBRkY7S0FEQTtBQUFBLElBS0EsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUxBLENBQUE7QUFPQSxJQUFBLElBQUEsQ0FBQSxJQUFRLENBQUEsU0FBUjtBQUNFLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsTUFBQSxDQUFBLFFBQUEsS0FBbUIsUUFBdEIsR0FBb0MsUUFBcEMsR0FBa0QsSUFBQyxDQUFBLFFBQUQsSUFBYSxDQUE1RSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxHQUFtQixDQUFDLElBQUMsQ0FBQSxRQUFELElBQWEsQ0FBZCxDQURoQyxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQWhCLEVBQTZCLElBQUMsQ0FBQSxRQUE5QixDQUZBLENBREY7S0FQQTtBQUFBLElBWUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxXQUFXLENBQUMsVUFBdEIsQ0FaQSxDQUFBO0FBYUEsSUFBQSxJQUFhLElBQUMsQ0FBQSxNQUFkO2FBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUFBO0tBZEk7RUFBQSxDQWxHTixDQUFBOztBQUFBLHdCQWtIQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osSUFBQSxJQUFHLElBQUMsQ0FBQSxHQUFKO0FBQ0UsTUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFKO0FBQ0UsUUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFqQixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBZSxLQURmLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFGZixDQURGO09BQUEsTUFBQTtBQUtFLFFBQUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLENBQVUsQ0FBVixDQUFBLENBTEY7T0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLEdBQUQsR0FBYSxJQU5iLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxHQUE0QixJQVA1QixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsUUFBRCxHQUFhLENBUmIsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQVRiLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxRQUFELENBQVUsV0FBVyxDQUFDLFVBQXRCLENBVkEsQ0FBQTtBQVdBLE1BQUEsSUFBYSxJQUFDLENBQUEsTUFBZDtlQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFBQTtPQVpGO0tBREk7RUFBQSxDQWxITixDQUFBOztBQUFBLHdCQWlJQSxNQUFBLEdBQVEsU0FBQyxNQUFELEdBQUE7QUFDTixJQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxNQUFaLENBQVosQ0FBVCxDQUFBO1dBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBZixHQUF1QixPQUZqQjtFQUFBLENBaklSLENBQUE7O0FBQUEsd0JBcUlBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsSUFBQSxJQUFHLElBQUMsQ0FBQSxLQUFELEtBQVUsV0FBVyxDQUFDLFVBQXpCO0FBQ0UsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxHQUFtQixJQUFDLENBQUEsU0FBaEMsQ0FERjtLQUFBO0FBR0EsSUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUF2QjtBQUNFLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQXBCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FEQSxDQURGO0tBSEE7QUFPQSxXQUFPLElBQUMsQ0FBQSxRQUFSLENBUmM7RUFBQSxDQXJJaEIsQ0FBQTs7QUFBQSx3QkErSUEsSUFBQSxHQUFNLFNBQUMsSUFBRCxHQUFBO0FBQ0osSUFBQSxJQUFHLElBQUMsQ0FBQSxLQUFELEtBQVUsV0FBVyxDQUFDLFVBQXpCO2FBQ0UsSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFOLEVBREY7S0FBQSxNQUFBO2FBR0UsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUhkO0tBREk7RUFBQSxDQS9JTixDQUFBOztBQUFBLHdCQXFKQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsSUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQURBLENBQUE7V0FFQSxJQUFDLENBQUEsR0FBRCxHQUFPLEtBSEE7RUFBQSxDQXJKVCxDQUFBOztBQUFBLHdCQTBKQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsSUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFELElBQWUsSUFBQyxDQUFBLFlBQW5CO0FBRUUsTUFBQSxJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxHQUFHLENBQUMsdUJBQUwsQ0FBNkIsSUFBQyxDQUFBLFlBQTlCLENBQVAsQ0FGRjtLQUFBLE1BQUE7QUFLRSxNQUFBLElBQUMsQ0FBQSxHQUFELEdBQXVCLElBQUMsQ0FBQSxHQUFHLENBQUMsa0JBQUwsQ0FBQSxDQUF2QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsR0FBdUIsSUFBQyxDQUFBLE1BRHhCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxHQUF1QixJQUFDLENBQUEsUUFGeEIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFFBQUQsR0FBdUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUgvQixDQUxGO0tBQUE7QUFBQSxJQVdBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLEdBQUcsQ0FBQyxjQUFMLENBQUEsQ0FYWixDQUFBO0FBQUEsSUFZQSxJQUFDLENBQUEsUUFBUSxDQUFDLHFCQUFWLEdBQWtDLEdBWmxDLENBQUE7QUFBQSxJQWFBLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixHQUFrQyxDQUFBLEdBYmxDLENBQUE7QUFBQSxJQWNBLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixHQUFrQyxDQWRsQyxDQUFBO0FBQUEsSUFlQSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsR0FBa0MsR0FmbEMsQ0FBQTtBQUFBLElBa0JBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxxQkFBTCxDQUEyQixJQUEzQixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxDQWxCYixDQUFBO0FBQUEsSUFxQkEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsR0FBRyxDQUFDLFVBQUwsQ0FBQSxDQXJCWixDQUFBO0FBQUEsSUF1QkEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLFFBQWQsQ0F2QkEsQ0FBQTtBQUFBLElBd0JBLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxDQUFhLElBQUMsQ0FBQSxRQUFkLENBeEJBLENBQUE7QUFBQSxJQXlCQSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsSUFBQyxDQUFBLFNBQW5CLENBekJBLENBQUE7QUFBQSxJQTBCQSxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUF4QixDQTFCQSxDQUFBO0FBQUEsSUEyQkEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQWtCLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBdkIsQ0EzQkEsQ0FBQTtBQUFBLElBNkJBLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxHQUE0QixJQUFDLENBQUEsZUE3QjdCLENBQUE7QUFBQSxJQThCQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsR0FBaUIsSUE5QmpCLENBQUE7V0FnQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQWpDUTtFQUFBLENBMUpWLENBQUE7O0FBQUEsd0JBNkxBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxJQUFBLElBQTRCLElBQUMsQ0FBQSxRQUE3QjtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLENBQXFCLENBQXJCLENBQUEsQ0FBQTtLQUFBO0FBQ0EsSUFBQSxJQUE0QixJQUFDLENBQUEsU0FBN0I7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsVUFBWCxDQUFzQixDQUF0QixDQUFBLENBQUE7S0FEQTtBQUVBLElBQUEsSUFBNEIsSUFBQyxDQUFBLFFBQTdCO2FBQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLENBQXFCLENBQXJCLEVBQUE7S0FIVztFQUFBLENBN0xiLENBQUE7O0FBQUEsd0JBa01BLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsSUFBQSxJQUFxQixJQUFDLENBQUEsY0FBdEI7YUFBQSxJQUFDLENBQUEsY0FBRCxDQUFBLEVBQUE7S0FEZTtFQUFBLENBbE1qQixDQUFBOztBQUFBLHdCQXFNQSxRQUFBLEdBQVUsU0FBQyxDQUFELEdBQUE7QUFDUixJQUFBLElBQUcsSUFBQyxDQUFBLEdBQUQsSUFBUyxDQUFDLElBQUMsQ0FBQSxLQUFELEtBQVUsV0FBVyxDQUFDLFVBQXRCLElBQW9DLElBQUMsQ0FBQSxLQUFELEtBQVUsV0FBVyxDQUFDLFVBQTNELENBQVo7QUFDRSxNQUFBLElBQUMsQ0FBQSxHQUFHLENBQUMsVUFBTCxDQUFnQixDQUFoQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxHQUFELEdBQTRCLElBRDVCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxHQUE0QixJQUY1QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLFdBQVcsQ0FBQyxRQUhyQixDQUFBO0FBSUEsTUFBQSxJQUFjLElBQUMsQ0FBQSxPQUFmO2VBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxFQUFBO09BTEY7S0FEUTtFQUFBLENBck1WLENBQUE7O0FBQUEsd0JBNk1BLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxJQUFBLElBQUcsSUFBQyxDQUFBLEdBQUQsSUFBUyxNQUFBLENBQUEsSUFBUSxDQUFBLEdBQUcsQ0FBQyxxQkFBWixLQUFxQyxVQUFqRDtBQUNFLE1BQUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxxQkFBTCxHQUE2QixJQUFDLENBQUEsR0FBRyxDQUFDLG9CQUFsQyxDQURGO0tBQUE7QUFHQSxJQUFBLElBQUcsSUFBQyxDQUFBLEdBQUQsSUFBUyxNQUFBLENBQUEsSUFBUSxDQUFBLEdBQUcsQ0FBQyxLQUFaLEtBQXFCLFVBQWpDO0FBQ0UsTUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsR0FBYSxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQWxCLENBREY7S0FIQTtBQU1BLElBQUEsSUFBRyxJQUFDLENBQUEsR0FBRCxJQUFTLE1BQUEsQ0FBQSxJQUFRLENBQUEsR0FBRyxDQUFDLElBQVosS0FBb0IsVUFBaEM7YUFDRSxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsR0FBWSxJQUFDLENBQUEsR0FBRyxDQUFDLFFBRG5CO0tBUFc7RUFBQSxDQTdNYixDQUFBOztxQkFBQTs7SUF0d0NGLENBQUE7O0FBQUEsV0E2OUNBLEdBQWtCLElBQUEsV0FBQSxDQUFBLENBNzlDbEIsQ0FBQTs7QUFBQSxLQWcrQ1csQ0FBQztBQUVWLCtCQUFBLENBQUE7O0FBQUEsc0JBQUEsTUFBQSxHQUFZLElBQVosQ0FBQTs7QUFBQSxzQkFFQSxPQUFBLEdBQVksSUFGWixDQUFBOztBQUFBLHNCQUdBLFVBQUEsR0FBWSxJQUhaLENBQUE7O0FBQUEsc0JBS0EsS0FBQSxHQUFZLENBTFosQ0FBQTs7QUFBQSxzQkFPQSxRQUFBLEdBQVUsSUFQVixDQUFBOztBQUFBLHNCQVVBLFFBQUEsR0FBWSxJQVZaLENBQUE7O0FBQUEsc0JBV0EsS0FBQSxHQUFZLElBWFosQ0FBQTs7QUFBQSxzQkFjQSxTQUFBLEdBQW1CLENBZG5CLENBQUE7O0FBQUEsc0JBZUEsU0FBQSxHQUFtQixDQWZuQixDQUFBOztBQUFBLHNCQWdCQSxNQUFBLEdBQW1CLENBaEJuQixDQUFBOztBQUFBLHNCQWlCQSxpQkFBQSxHQUFtQixDQWpCbkIsQ0FBQTs7QUFBQSxzQkFrQkEsS0FBQSxHQUFtQixRQWxCbkIsQ0FBQTs7QUFBQSxzQkFtQkEsV0FBQSxHQUFtQixFQW5CbkIsQ0FBQTs7QUFBQSxzQkFvQkEsYUFBQSxHQUFtQixFQXBCbkIsQ0FBQTs7QUFBQSxzQkFxQkEsU0FBQSxHQUFtQixDQXJCbkIsQ0FBQTs7QUFBQSxzQkFzQkEsUUFBQSxHQUFtQixLQXRCbkIsQ0FBQTs7QUFBQSxzQkF1QkEsUUFBQSxHQUFtQixDQXZCbkIsQ0FBQTs7QUFBQSxzQkF3QkEsV0FBQSxHQUFtQixHQXhCbkIsQ0FBQTs7QUFBQSxzQkF5QkEsTUFBQSxHQUFtQixJQXpCbkIsQ0FBQTs7QUEyQmEsRUFBQSxtQkFBQyxJQUFELEdBQUE7QUFDWCxRQUFBLFFBQUE7O01BRFksT0FBSztLQUNqQjtBQUFBLHlDQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEsNkRBQUEsQ0FBQTtBQUFBLElBQUEsNENBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxJQUdBLFFBQUEsR0FDRTtBQUFBLE1BQUEsU0FBQSxFQUFtQixHQUFuQjtBQUFBLE1BQ0EsU0FBQSxFQUFtQixFQURuQjtBQUFBLE1BRUEsTUFBQSxFQUFtQixHQUZuQjtBQUFBLE1BR0EsaUJBQUEsRUFBbUIsR0FIbkI7QUFBQSxNQUlBLEtBQUEsRUFBbUIsUUFKbkI7QUFBQSxNQUtBLFdBQUEsRUFBbUIsRUFMbkI7QUFBQSxNQU1BLGFBQUEsRUFBbUIsRUFObkI7QUFBQSxNQU9BLFFBQUEsRUFBbUIsS0FQbkI7QUFBQSxNQVFBLFFBQUEsRUFBbUIsR0FSbkI7QUFBQSxNQVNBLE1BQUEsRUFBbUIsSUFUbkI7QUFBQSxNQVVBLFNBQUEsRUFBbUIsQ0FWbkI7S0FKRixDQUFBO0FBQUEsSUFnQkEsSUFBQSxHQUFxQixPQUFPLENBQUMsS0FBUixDQUFjLFFBQWQsRUFBd0IsSUFBeEIsQ0FoQnJCLENBQUE7QUFBQSxJQWlCQSxJQUFDLENBQUEsU0FBRCxHQUFxQixJQUFJLENBQUMsU0FqQjFCLENBQUE7QUFBQSxJQWtCQSxJQUFDLENBQUEsU0FBRCxHQUFxQixJQUFJLENBQUMsU0FsQjFCLENBQUE7QUFBQSxJQW1CQSxJQUFDLENBQUEsTUFBRCxHQUFxQixJQUFJLENBQUMsTUFuQjFCLENBQUE7QUFBQSxJQW9CQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLGlCQXBCMUIsQ0FBQTtBQUFBLElBcUJBLElBQUMsQ0FBQSxLQUFELEdBQXFCLElBQUksQ0FBQyxLQXJCMUIsQ0FBQTtBQUFBLElBc0JBLElBQUMsQ0FBQSxXQUFELEdBQXFCLElBQUksQ0FBQyxXQXRCMUIsQ0FBQTtBQUFBLElBdUJBLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUksQ0FBQyxhQXZCMUIsQ0FBQTtBQUFBLElBd0JBLElBQUMsQ0FBQSxRQUFELEdBQXFCLElBQUksQ0FBQyxRQXhCMUIsQ0FBQTtBQUFBLElBeUJBLElBQUMsQ0FBQSxRQUFELEdBQXFCLElBQUksQ0FBQyxRQXpCMUIsQ0FBQTtBQUFBLElBMEJBLElBQUMsQ0FBQSxNQUFELEdBQXFCLElBQUksQ0FBQyxNQTFCMUIsQ0FBQTtBQUFBLElBMkJBLElBQUMsQ0FBQSxTQUFELEdBQXFCLElBQUksQ0FBQyxTQTNCMUIsQ0FBQTtBQUFBLElBOEJBLElBQUMsQ0FBQSxRQUFELEdBQWMsS0FBSyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsUUE5QjlDLENBQUE7QUFBQSxJQStCQSxJQUFDLENBQUEsTUFBRCxHQUFrQixJQUFBLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0EvQmxCLENBQUE7QUFBQSxJQWdDQSxJQUFDLENBQUEsT0FBRCxHQUFjLElBQUMsQ0FBQSxJQUFELENBQU0sS0FBTixDQWhDZCxDQUFBO0FBQUEsSUFpQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsSUFBRCxDQUFNLEtBQU4sQ0FqQ2QsQ0FBQTtBQUFBLElBa0NBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLE1BQVosQ0FsQ0EsQ0FBQTtBQUFBLElBb0NBLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FwQ0EsQ0FBQTtBQUFBLElBc0NBLElBQUMsQ0FBQSxPQUFELENBQUEsQ0F0Q0EsQ0FBQTtBQUFBLElBdUNBLElBQUMsQ0FBQSxZQUFELENBQUEsQ0F2Q0EsQ0FEVztFQUFBLENBM0JiOztBQUFBLHNCQXFFQSxPQUFBLEdBQVMsU0FBQSxHQUFBO1dBQ1AsUUFBUSxDQUFDLGdCQUFULENBQTBCLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBM0MsRUFBaUQsSUFBQyxDQUFBLGdCQUFsRCxFQURPO0VBQUEsQ0FyRVQsQ0FBQTs7QUFBQSxzQkF3RUEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO1dBQ2hCLElBQUMsQ0FBQSxJQUFELENBQUEsRUFEZ0I7RUFBQSxDQXhFbEIsQ0FBQTs7QUFBQSxzQkEyRUEsU0FBQSxHQUFXLFNBQUMsTUFBRCxHQUFBO0FBQ1QsSUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQVYsQ0FBQTtBQUNBLElBQUEsSUFBcUMsTUFBTSxDQUFDLFVBQVAsR0FBb0IsR0FBcEIsR0FBMEIsTUFBL0Q7YUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLElBQTlCO0tBRlM7RUFBQSxDQTNFWCxDQUFBOztBQUFBLHNCQStFQSxXQUFBLEdBQWEsU0FBQyxRQUFELEdBQUE7QUFDWCxJQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksUUFBWixDQUFBO1dBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUZXO0VBQUEsQ0EvRWIsQ0FBQTs7QUFBQSxzQkFtRkEsU0FBQSxHQUFXLFNBQUMsTUFBRCxHQUFBO0FBQ1QsUUFBQSxrREFBQTtBQUFBLElBQUEsSUFBRyxJQUFDLENBQUEsTUFBSjtBQUNFLE1BQUEsS0FBQSxHQUFTLEtBQUEsQ0FBTSxJQUFDLENBQUEsUUFBUCxDQUFULENBQUE7QUFDQSxXQUFTLG1HQUFULEdBQUE7QUFDRSxRQUFBLEtBQU0sQ0FBQSxDQUFBLENBQU4sR0FBVyxLQUFNLENBQUEsSUFBQyxDQUFBLFFBQUQsR0FBVSxDQUFWLEdBQVksQ0FBWixDQUFOLEdBQXVCLE1BQU8sQ0FBQSxDQUFBLENBQXpDLENBREY7QUFBQSxPQURBO0FBQUEsTUFHQSxNQUFBLEdBQVMsS0FIVCxDQURGO0tBQUE7QUFBQSxJQU1BLFNBQUEsR0FBWSxJQUFDLENBQUEsSUFBRCxDQUFNLEtBQU4sQ0FOWixDQUFBO0FBT0EsU0FBQSxnREFBQTt3QkFBQTtBQUNFLE1BQUEsSUFBMkIsSUFBQyxDQUFBLFFBQTVCO0FBQUEsUUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQVIsQ0FBQTtPQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFNBQUQsR0FBYSxVQUFBLENBQVcsS0FBWCxDQUFBLEdBQWtCLENBQUMsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsU0FBZixDQUR4QyxDQUFBO0FBQUEsTUFFQSxTQUFVLENBQUEsQ0FBQSxDQUFWLEdBQWUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFULEVBQWlCLENBQWpCLENBRmYsQ0FERjtBQUFBLEtBUEE7QUFBQSxJQVdBLElBQUMsQ0FBQSxVQUFELEdBQWMsU0FYZCxDQUFBO1dBWUEsSUFBQyxDQUFBLGtCQUFELENBQUEsRUFiUztFQUFBLENBbkZYLENBQUE7O0FBQUEsc0JBa0dBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixJQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsUUFBRCxHQUFrQixJQUFBLEtBQUssQ0FBQyxpQkFBTixDQUF3QjtBQUFBLE1BQUUsS0FBQSxFQUFPLElBQUMsQ0FBQSxLQUFWO0FBQUEsTUFBaUIsU0FBQSxFQUFXLElBQUMsQ0FBQSxTQUE3QjtLQUF4QixDQUZsQixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsS0FBRCxHQUFjLEVBSGQsQ0FBQTtBQUFBLElBS0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFULENBTEEsQ0FBQTtXQU1BLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFsQixFQVBRO0VBQUEsQ0FsR1YsQ0FBQTs7QUFBQSxzQkEyR0EsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO1dBQ04sSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFULEVBRE07RUFBQSxDQTNHUixDQUFBOztBQUFBLHNCQThHQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxRQUFBLGtCQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsS0FBRCxJQUFVLEtBQVYsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxHQUFJLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLGlCQURkLENBQUE7QUFFQSxJQUFBLElBQVUsQ0FBQSxHQUFJLENBQWQ7QUFBQSxZQUFBLENBQUE7S0FGQTtBQUlBLFNBQVMsK0ZBQVQsR0FBQTtBQUNFLE1BQUEsSUFBQSxHQUFjLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQSxDQUFULEdBQWMsSUFBQyxDQUFBLFVBQVcsQ0FBQSxDQUFBLENBQXhDLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQSxDQUFULEdBQWMsSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFBLENBQVQsR0FBYyxDQUFBLEdBQUksSUFEaEMsQ0FERjtBQUFBLEtBSkE7V0FPQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxFQVJPO0VBQUEsQ0E5R1QsQ0FBQTs7QUFBQSxzQkF3SEEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLElBQUEsSUFBRyxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsSUFBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBbEIsS0FBMkIsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFoRTtBQUNFLE1BQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUE3QixDQUFBLENBREY7S0FBQTtXQUVBLFVBQUEsQ0FBVyxJQUFDLENBQUEsWUFBWixFQUEwQixJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBL0MsRUFIWTtFQUFBLENBeEhkLENBQUE7O0FBQUEsc0JBNkhBLGdCQUFBLEdBQWtCLFNBQUMsTUFBRCxHQUFBO0FBQ2hCLFFBQUEsaUVBQUE7O01BRGlCLFNBQU87S0FDeEI7QUFBQTtBQUFBO1NBQUEsNkNBQUE7c0JBQUE7QUFDRSxNQUFBLEtBQUEsR0FBUyxJQUFJLENBQUMsRUFBTCxHQUFVLENBQVYsR0FBYyxDQUFkLEdBQWtCLElBQUMsQ0FBQSxRQUE1QixDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU8sSUFBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBQyxDQUFBLE1BQWxCLEVBQTBCLEtBQTFCLEVBQWlDLElBQUMsQ0FBQSxNQUFELEdBQVEsTUFBQSxHQUFPLElBQUMsQ0FBQSxhQUFqRCxDQUZQLENBQUE7QUFBQSxNQUdBLEVBQUEsR0FBTyxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFDLENBQUEsTUFBbEIsRUFBMEIsS0FBMUIsRUFBaUMsSUFBQyxDQUFBLE1BQUQsR0FBUSxNQUFBLEdBQU8sSUFBQyxDQUFBLFdBQWpELENBSFAsQ0FBQTtBQUtBLE1BQUEsSUFBRyxNQUFBLENBQUEsSUFBUSxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQWQsS0FBb0IsV0FBdkI7QUFDRSxRQUFBLFFBQUEsR0FBZSxJQUFBLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBZixDQUFBO0FBQUEsUUFDQSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLENBQXVCLElBQXZCLEVBQTZCLEVBQTdCLEVBQWlDLElBQWpDLENBREEsQ0FBQTtBQUFBLFFBR0EsSUFBQSxHQUFXLElBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxRQUFYLEVBQXFCLElBQUMsQ0FBQSxRQUF0QixDQUhYLENBQUE7QUFBQSxRQUlBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVosQ0FKQSxDQUFBO0FBQUEsc0JBS0EsSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMLEVBTEEsQ0FERjtPQUFBLE1BQUE7QUFRRSxRQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBZCxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQXZCLEdBQTRCLElBRDVCLENBQUE7QUFBQSxRQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBdkIsR0FBNEIsRUFGNUIsQ0FBQTtBQUFBLFFBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUF2QixHQUE0QixJQUg1QixDQUFBO0FBQUEsc0JBSUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxHQUFtQyxLQUpuQyxDQVJGO09BTkY7QUFBQTtvQkFEZ0I7RUFBQSxDQTdIbEIsQ0FBQTs7QUFBQSxzQkFrSkEsTUFBQSxHQUFRLFNBQUMsU0FBRCxHQUFBO0FBQ04sUUFBQSxpQkFBQTs7TUFETyxZQUFVO0tBQ2pCO0FBQUEsSUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO0FBQ0EsU0FBUywrRkFBVCxHQUFBO0FBQ0UsTUFBQSxNQUFPLENBQUEsQ0FBQSxDQUFQLEdBQVksSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFaLENBREY7QUFBQSxLQURBO0FBR0EsSUFBQSxJQUFzQixTQUF0QjtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLENBQUEsQ0FBQTtLQUhBO0FBSUEsV0FBTyxNQUFQLENBTE07RUFBQSxDQWxKUixDQUFBOztBQUFBLHNCQXlKQSxJQUFBLEdBQU0sU0FBQyxTQUFELEdBQUE7QUFDSixRQUFBLGlCQUFBOztNQURLLFlBQVU7S0FDZjtBQUFBLElBQUEsTUFBQSxHQUFTLEVBQVQsQ0FBQTtBQUNBLFNBQVMsK0ZBQVQsR0FBQTtBQUNFLE1BQUEsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFZLENBQVosQ0FERjtBQUFBLEtBREE7QUFHQSxJQUFBLElBQXNCLFNBQXRCO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsQ0FBQSxDQUFBO0tBSEE7QUFJQSxXQUFPLE1BQVAsQ0FMSTtFQUFBLENBekpOLENBQUE7O0FBQUEsc0JBZ0tBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTtXQUNsQixJQUFDLENBQUEsS0FBRCxHQUFTLEVBRFM7RUFBQSxDQWhLcEIsQ0FBQTs7QUFBQSxzQkFtS0EsZUFBQSxHQUFpQixTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsTUFBZixHQUFBO0FBQ2YsUUFBQSxJQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksS0FBSyxDQUFDLENBQU4sR0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixNQUFoQyxDQUFBO0FBQUEsSUFDQSxDQUFBLEdBQUksS0FBSyxDQUFDLENBQU4sR0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixNQURoQyxDQUFBO0FBRUEsV0FBVyxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixLQUFLLENBQUMsQ0FBMUIsQ0FBWCxDQUhlO0VBQUEsQ0FuS2pCLENBQUE7O0FBQUEsc0JBd0tBLG9CQUFBLEdBQXNCLFNBQUMsS0FBRCxHQUFBO0FBQ3BCLFFBQUEsTUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxLQUFNLENBQUEsS0FBQSxDQUFoQixDQUFBO1dBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxJQUFDLENBQUEsS0FBTSxDQUFBLEtBQUEsQ0FBckIsRUFGb0I7RUFBQSxDQXhLdEIsQ0FBQTs7QUFBQSxzQkE0S0EsTUFBQSxHQUFRLFNBQUEsR0FBQTtXQUNOLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLE1BQVosRUFETTtFQUFBLENBNUtSLENBQUE7O21CQUFBOztHQUY0QixLQUFLLENBQUMsTUFoK0NwQyxDQUFBOztBQUFBLEtBbXBEVyxDQUFDO0FBRVYsMkJBQUEsQ0FBQTs7QUFBQSxFQUFBLEtBQUMsQ0FBQSxlQUFELEdBQWtCLHVCQUFsQixDQUFBOztBQUFBLGtCQUVBLGNBQUEsR0FBZ0IsSUFGaEIsQ0FBQTs7QUFBQSxrQkFHQSxXQUFBLEdBQWEsSUFIYixDQUFBOztBQUFBLGtCQUtBLEtBQUEsR0FBTyxJQUxQLENBQUE7O0FBQUEsa0JBT0EsUUFBQSxHQUFVLElBUFYsQ0FBQTs7QUFBQSxrQkFTQSxRQUFBLEdBQVUsSUFUVixDQUFBOztBQUFBLGtCQVVBLFFBQUEsR0FBVSxJQVZWLENBQUE7O0FBQUEsa0JBWUEsR0FBQSxHQUFLLENBWkwsQ0FBQTs7QUFBQSxrQkFhQSxNQUFBLEdBQVEsQ0FiUixDQUFBOztBQUFBLGtCQWNBLFFBQUEsR0FBVSxDQWRWLENBQUE7O0FBQUEsa0JBZ0JBLEtBQUEsR0FBTyxDQWhCUCxDQUFBOztBQUFBLGtCQWlCQSxNQUFBLEdBQVEsQ0FqQlIsQ0FBQTs7QUFtQmEsRUFBQSxlQUFBLEdBQUE7QUFDWCxtREFBQSxDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLG1EQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSwrREFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLElBQUEsd0NBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsT0FBRCxDQUFBLENBRkEsQ0FEVztFQUFBLENBbkJiOztBQUFBLGtCQXdCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsSUFBQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBakQsRUFBdUQsSUFBQyxDQUFBLGdCQUF4RCxDQUFBLENBQUE7QUFBQSxJQUNBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFoRCxFQUFzRCxJQUFDLENBQUEsZUFBdkQsQ0FEQSxDQUFBO0FBQUEsSUFHQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBaEQsRUFBc0QsSUFBQyxDQUFBLGlCQUF2RCxDQUhBLENBQUE7V0FLQSxDQUFBLENBQUUsNkJBQUYsQ0FBZ0MsQ0FBQyxFQUFqQyxDQUFvQyxPQUFwQyxFQUE2QyxTQUFDLENBQUQsR0FBQTtBQUMzQyxNQUFBLElBQUcsQ0FBQSxDQUFFLFVBQUYsQ0FBYSxDQUFDLFFBQWQsQ0FBdUIsT0FBdkIsQ0FBQSxJQUFvQyxNQUFNLENBQUMsV0FBOUM7QUFDRSxRQUFBLENBQUMsQ0FBQyxjQUFGLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQW5CLENBQUEsQ0FEQSxDQUFBO0FBRUEsZUFBTyxLQUFQLENBSEY7T0FEMkM7SUFBQSxDQUE3QyxFQU5PO0VBQUEsQ0F4QlQsQ0FBQTs7QUFBQSxrQkFvQ0EsaUJBQUEsR0FBbUIsU0FBQyxDQUFELEdBQUE7QUFDakIsSUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxDQUFFLGlCQUFGLENBQW9CLENBQUMsUUFBckIsQ0FBOEIsUUFBOUIsQ0FEQSxDQUFBO1dBRUEsQ0FBQSxDQUFFLGlCQUFGLENBQW9CLENBQUMsUUFBckIsQ0FBOEIsUUFBOUIsRUFIaUI7RUFBQSxDQXBDbkIsQ0FBQTs7QUFBQSxrQkF5Q0EsaUJBQUEsR0FBbUIsU0FBQyxDQUFELEdBQUE7V0FDakIsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUEzQixFQURpQjtFQUFBLENBekNuQixDQUFBOztBQUFBLGtCQTRDQSxnQkFBQSxHQUFrQixTQUFDLENBQUQsR0FBQTtBQUNoQixJQUFBLENBQUEsQ0FBRSxpQkFBRixDQUFvQixDQUFDLFdBQXJCLENBQWlDLFFBQWpDLENBQUEsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxDQUFFLGlCQUFGLENBQW9CLENBQUMsV0FBckIsQ0FBaUMsUUFBakMsQ0FEQSxDQUFBO1dBRUEsQ0FBQSxDQUFFLFVBQUYsQ0FBYSxDQUFDLFFBQWQsQ0FBdUIsUUFBdkIsRUFIZ0I7RUFBQSxDQTVDbEIsQ0FBQTs7QUFBQSxrQkFpREEsZUFBQSxHQUFpQixTQUFDLENBQUQsR0FBQTtBQUNmLElBQUEsQ0FBQSxDQUFFLFVBQUYsQ0FBYSxDQUFDLFdBQWQsQ0FBMEIsUUFBMUIsQ0FBQSxDQUFBO0FBQUEsSUFDQSxDQUFBLENBQUUsZ0JBQUYsQ0FBbUIsQ0FBQyxXQUFwQixDQUFnQyxNQUFoQyxDQURBLENBQUE7V0FFQSxDQUFBLENBQUUsZ0JBQUYsQ0FBbUIsQ0FBQyxRQUFwQixDQUE2QixPQUE3QixFQUhlO0VBQUEsQ0FqRGpCLENBQUE7O0FBQUEsa0JBc0RBLGVBQUEsR0FBaUIsU0FBQyxDQUFELEdBQUE7QUFDZixRQUFBLDJFQUFBO0FBQUEsSUFBQSxJQUFBLENBQUEsQ0FBTyxDQUFFLFVBQUYsQ0FBYSxDQUFDLFFBQWQsQ0FBdUIsT0FBdkIsQ0FBUDtBQUNFLE1BQUEsQ0FBQSxDQUFFLFVBQUYsQ0FBYSxDQUFDLFFBQWQsQ0FBdUIsT0FBdkIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxDQUFBLENBQUUsWUFBRixDQUFlLENBQUMsSUFBaEIsQ0FBcUIsdUNBQXJCLENBREEsQ0FERjtLQUFBO0FBQUEsSUFJQSxLQUFBLEdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUpwQixDQUFBO0FBQUEsSUFLQSxLQUFBLEdBQVcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUx0QixDQUFBO0FBQUEsSUFNQSxRQUFBLEdBQVcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQU50QixDQUFBO0FBQUEsSUFPQSxRQUFBLEdBQVcsS0FBSyxDQUFDLElBQUksQ0FBQyxVQVB0QixDQUFBO0FBQUEsSUFTQSxDQUFBLENBQUUsaUJBQUYsQ0FBb0IsQ0FBQyxJQUFyQixDQUEwQixLQUExQixDQVRBLENBQUE7QUFBQSxJQVVBLENBQUEsQ0FBRSxpQkFBRixDQUFvQixDQUFDLElBQXJCLENBQTBCLDhCQUFBLEdBQStCLFFBQS9CLEdBQXdDLElBQXhDLEdBQTZDLFFBQTdDLEdBQXNELE1BQWhGLENBVkEsQ0FBQTtBQUFBLElBWUEsR0FBQSxHQUFNLGFBQUEsR0FDYSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BRHhCLEdBQytCLGdDQUQvQixHQUVnQixLQUFLLENBQUMsSUFBSSxDQUFDLE1BRjNCLEdBRWtDLGdCQWR4QyxDQUFBO0FBQUEsSUFnQkEsQ0FBQSxDQUFFLGNBQUYsQ0FBaUIsQ0FBQyxJQUFsQixDQUF1QixHQUF2QixDQWhCQSxDQUFBO0FBQUEsSUFrQkEsU0FBQSxHQUFZLElBQUMsQ0FBQSxRQUFTLENBQUEsQ0FBQSxDQWxCdEIsQ0FBQTtBQW1CQTtBQUFBLFNBQUEsNkNBQUE7eUJBQUE7QUFDRSxNQUFBLElBQUcsU0FBUyxDQUFDLEtBQVYsS0FBbUIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFqQztBQUNFLFFBQUEsSUFBOEIsQ0FBQSxHQUFFLENBQUYsR0FBTSxJQUFDLENBQUEsUUFBUSxDQUFDLE1BQTlDO0FBQUEsVUFBQSxTQUFBLEdBQVksSUFBQyxDQUFBLFFBQVMsQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUF0QixDQUFBO1NBQUE7QUFDQSxjQUZGO09BREY7QUFBQSxLQW5CQTtBQUFBLElBd0JBLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixtQkFBQSxHQUFvQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQW5ELEVBQTBELENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLE9BQUQsR0FBQTtBQUN4RCxRQUFBLEtBQUMsQ0FBQSxRQUFELEdBQVksT0FBWixDQUFBO2VBQ0EsS0FBQyxDQUFBLGNBQUQsQ0FBQSxFQUZ3RDtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFELENBeEJBLENBQUE7QUFBQSxJQTJCQSxJQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0IsbUJBQUEsR0FBb0IsU0FBUyxDQUFDLEtBQWxELEVBQXlELENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLE9BQUQsR0FBQTtBQUN2RCxRQUFBLEtBQUMsQ0FBQSxRQUFELEdBQVksT0FBWixDQUFBO2VBQ0EsS0FBQyxDQUFBLGNBQUQsQ0FBQSxFQUZ1RDtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpELENBM0JBLENBQUE7QUFBQSxJQStCQSxDQUFBLENBQUUsa0JBQUYsQ0FBcUIsQ0FBQyxHQUF0QixDQUEwQjtBQUFBLE1BQUUsTUFBQSxFQUFRLE1BQU0sQ0FBQyxXQUFqQjtLQUExQixDQS9CQSxDQUFBO0FBQUEsSUFnQ0EsQ0FBQSxDQUFFLGtCQUFGLENBQXFCLENBQUMsSUFBdEIsQ0FBQSxDQUE0QixDQUFDLEdBQTdCLENBQWlDLGtCQUFqQyxFQUFxRCx1QkFBQSxHQUF3QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQW5DLEdBQXlDLEdBQTlGLENBaENBLENBQUE7V0FpQ0EsQ0FBQSxDQUFFLGtCQUFGLENBQXFCLENBQUMsS0FBdEIsQ0FBQSxDQUE2QixDQUFDLEdBQTlCLENBQWtDLGtCQUFsQyxFQUFzRCx1QkFBQSxHQUF3QixTQUFTLENBQUMsS0FBbEMsR0FBd0MsR0FBOUYsRUFsQ2U7RUFBQSxDQXREakIsQ0FBQTs7QUFBQSxrQkEwRkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLElBQUEsSUFBQyxDQUFBLGNBQUQsR0FBNkIsSUFBQSxLQUFLLENBQUMsY0FBTixDQUFBLENBQTdCLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsTUFBaEIsR0FBeUIsSUFBQyxDQUFBLFdBRDFCLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxXQUFELEdBQTZCLElBQUEsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLGNBQW5CLENBRjdCLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxhQUFELEdBQTZCLElBQUEsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsSUFBQyxDQUFBLGNBQXJCLENBSDdCLENBQUE7V0FJQSxJQUFDLENBQUEsTUFBRCxHQUE2QixJQUFBLEtBQUssQ0FBQyxTQUFOLENBQWdCLElBQUMsQ0FBQSxjQUFqQixFQUx2QjtFQUFBLENBMUZSLENBQUE7O0FBQUEsa0JBaUdBLElBQUEsR0FBTSxTQUFDLFFBQUQsR0FBQTtBQUNKLFFBQUEsYUFBQTtBQUFBLElBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUFaLENBQUE7QUFFQSxTQUFBLDBDQUFBOzBCQUFBO0FBQ0UsTUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsbUJBQUEsR0FBb0IsS0FBSyxDQUFDLEtBQTVDLEVBQW1ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtBQUNqRCxpQkFBTyxJQUFQLENBRGlEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkQsQ0FBQSxDQURGO0FBQUEsS0FGQTtBQUFBLElBTUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsMkJBQWIsRUFBMEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsT0FBRCxHQUFBO0FBQ3hDLGVBQU8sSUFBUCxDQUR3QztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFDLENBTkEsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsMkJBQWIsRUFBMEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsT0FBRCxHQUFBO0FBQ3hDLGVBQU8sSUFBUCxDQUR3QztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFDLENBUkEsQ0FBQTtXQVVBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLG1DQUFiLEVBQWtELENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLE9BQUQsR0FBQTtBQUNoRCxlQUFPLElBQVAsQ0FEZ0Q7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsRCxFQVhJO0VBQUEsQ0FqR04sQ0FBQTs7QUFBQSxrQkErR0EsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLFFBQUEsc0NBQUE7QUFBQSxJQUFBLFlBQUEsR0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBTSxDQUFBLDJCQUFBLENBQXJDLENBQUE7QUFBQSxJQUNBLGNBQUEsR0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBTSxDQUFBLDJCQUFBLENBRHJDLENBQUE7QUFBQSxJQUdBLFFBQUEsR0FBZSxJQUFBLEtBQUssQ0FBQyxjQUFOLENBQ2I7QUFBQSxNQUFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVO0FBQUEsVUFBRSxJQUFBLEVBQU0sR0FBUjtBQUFBLFVBQWEsS0FBQSxFQUFXLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUF4QjtTQUFWO0FBQUEsUUFDQSxRQUFBLEVBQVU7QUFBQSxVQUFFLElBQUEsRUFBTSxHQUFSO0FBQUEsVUFBYSxLQUFBLEVBQVcsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFBLENBQXhCO1NBRFY7QUFBQSxRQUVBLFFBQUEsRUFBVTtBQUFBLFVBQUUsSUFBQSxFQUFNLEdBQVI7QUFBQSxVQUFhLEtBQUEsRUFBVyxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBeEI7U0FGVjtBQUFBLFFBR0EsUUFBQSxFQUFVO0FBQUEsVUFBRSxJQUFBLEVBQU0sR0FBUjtBQUFBLFVBQWEsS0FBQSxFQUFXLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUF4QjtTQUhWO0FBQUEsUUFJQSxVQUFBLEVBQVk7QUFBQSxVQUFFLElBQUEsRUFBTSxJQUFSO0FBQUEsVUFBYyxLQUFBLEVBQVcsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFBLENBQXpCO1NBSlo7QUFBQSxRQUtBLEtBQUEsRUFBTztBQUFBLFVBQUUsSUFBQSxFQUFNLEdBQVI7QUFBQSxVQUFhLEtBQUEsRUFBTyxDQUFwQjtTQUxQO0FBQUEsUUFNQSxLQUFBLEVBQU87QUFBQSxVQUFFLElBQUEsRUFBTSxHQUFSO0FBQUEsVUFBYSxLQUFBLEVBQU8sQ0FBcEI7U0FOUDtBQUFBLFFBT0EsTUFBQSxFQUFRO0FBQUEsVUFBRSxJQUFBLEVBQU0sR0FBUjtBQUFBLFVBQWEsS0FBQSxFQUFPLENBQXBCO1NBUFI7QUFBQSxRQVFBLEtBQUEsRUFBTztBQUFBLFVBQUUsSUFBQSxFQUFNLElBQVI7QUFBQSxVQUFjLEtBQUEsRUFBVyxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBekI7U0FSUDtPQURGO0FBQUEsTUFVQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVTtBQUFBLFVBQUUsSUFBQSxFQUFNLElBQVI7QUFBQSxVQUFjLEtBQUEsRUFBTyxFQUFyQjtTQUFWO09BWEY7QUFBQSxNQVlBLFlBQUEsRUFBYyxZQVpkO0FBQUEsTUFhQSxjQUFBLEVBQWdCLGNBYmhCO0tBRGEsQ0FIZixDQUFBO0FBQUEsSUFvQkEsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLEtBQUssQ0FBQyxJQUFOLENBQWUsSUFBQSxLQUFLLENBQUMsYUFBTixDQUFvQixDQUFwQixFQUF1QixDQUF2QixDQUFmLEVBQTBDLFFBQTFDLENBcEJiLENBQUE7QUFBQSxJQXFCQSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFoQixHQUFvQixDQUFBLENBckJwQixDQUFBO0FBQUEsSUFzQkEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFDLENBQUEsS0FBTixDQXRCQSxDQUFBO0FBQUEsSUF3QkEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQTNCLENBeEJBLENBQUE7QUFBQSxJQTBCQSxJQUFDLENBQUEsY0FBYyxDQUFDLE1BQWhCLEdBQXlCLElBQUMsQ0FBQSxjQTFCMUIsQ0FBQTtBQUFBLElBNEJBLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixtQkFBQSxHQUFvQixJQUFDLENBQUEsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQXJELEVBQTRELENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLE9BQUQsR0FBQTtlQUMxRCxLQUFDLENBQUEsUUFBRCxHQUFZLFFBRDhDO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUQsQ0E1QkEsQ0FBQTtXQThCQSxJQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0IsbUJBQUEsR0FBb0IsSUFBQyxDQUFBLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFyRCxFQUE0RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxPQUFELEdBQUE7ZUFDMUQsS0FBQyxDQUFBLFFBQUQsR0FBWSxRQUQ4QztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVELEVBL0JXO0VBQUEsQ0EvR2IsQ0FBQTs7QUFBQSxrQkFpSkEsY0FBQSxHQUFnQixTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxHQUFBO0FBQ2QsSUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFELElBQWEsSUFBQyxDQUFBLFFBQWpCO0FBQ0UsTUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxRQUFaLEVBQXNCLElBQUMsQ0FBQSxRQUF2QixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxRQUFELEdBQVksS0FGMUI7S0FEYztFQUFBLENBakpoQixDQUFBOztBQUFBLGtCQXNKQSxTQUFBLEdBQVcsU0FBQyxPQUFELEVBQVUsSUFBVixHQUFBO0FBQ1QsSUFBQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFsQyxHQUEwQyxPQUYxQyxDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQWxDLEdBQTBDLElBSDFDLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixPQUF0QixFQUErQixJQUEvQixDQUxBLENBQUE7V0FNQSxJQUFDLENBQUEsYUFBRCxDQUFlLE9BQWYsRUFBd0IsSUFBeEIsRUFQUztFQUFBLENBdEpYLENBQUE7O0FBQUEsa0JBK0pBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixRQUFBLE1BQUE7QUFBQSxJQUFBLEVBQUEsR0FBSyxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQXZDLENBQUE7QUFBQSxJQUNBLEVBQUEsR0FBSyxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBRHZDLENBQUE7V0FFQSxJQUFDLENBQUEsb0JBQUQsQ0FBc0IsRUFBdEIsRUFBMEIsRUFBMUIsRUFITTtFQUFBLENBL0pSLENBQUE7O0FBQUEsa0JBb0tBLG9CQUFBLEdBQXNCLFNBQUMsUUFBRCxFQUFXLFFBQVgsR0FBQTtBQUdwQixRQUFBLG1GQUFBO0FBQUEsSUFBQSxhQUFBLEdBQWlCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBaEMsQ0FBQTtBQUFBLElBQ0EsY0FBQSxHQUFpQixRQUFRLENBQUMsS0FBSyxDQUFDLE1BRGhDLENBQUE7QUFBQSxJQUdBLE9BQUEsR0FBVyxLQUFLLENBQUMsWUFIakIsQ0FBQTtBQUFBLElBSUEsR0FBQSxHQUFXLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBZixHQUFxQixHQUFyQixHQUEyQixJQUFJLENBQUMsRUFKM0MsQ0FBQTtBQUFBLElBS0EsTUFBQSxHQUFXLGFBQUEsR0FBZ0IsY0FMM0IsQ0FBQTtBQUFBLElBTUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQXhCLEdBQTRCLENBTnZDLENBQUE7QUFBQSxJQU9BLEtBQUEsR0FBVyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQWYsR0FBd0IsTUFBcEMsQ0FQWCxDQUFBO0FBQUEsSUFTQSxLQUFBLEdBQVMsQ0FBQSxHQUFJLE1BQUosR0FBYSxJQUFJLENBQUMsR0FBTCxDQUFTLEdBQUEsR0FBTSxDQUFmLENBQWIsR0FBaUMsUUFBakMsR0FBNEMsS0FUckQsQ0FBQTtBQUFBLElBVUEsTUFBQSxHQUFTLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLEdBQUEsR0FBTSxDQUFmLENBQUosR0FBd0IsUUFBeEIsR0FBbUMsS0FWNUMsQ0FBQTtBQUFBLElBWUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBMUMsR0FBOEMsS0FaOUMsQ0FBQTtBQUFBLElBYUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBMUMsR0FBOEMsTUFiOUMsQ0FBQTtXQWNBLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQWIsQ0FBaUIsS0FBakIsRUFBd0IsTUFBeEIsRUFBZ0MsQ0FBaEMsRUFqQm9CO0VBQUEsQ0FwS3RCLENBQUE7O0FBQUEsa0JBdUxBLGFBQUEsR0FBZSxTQUFDLFFBQUQsRUFBVyxRQUFYLEdBQUE7QUFFYixRQUFBLDJGQUFBO0FBQUEsSUFBQSxhQUFBLEdBQWlCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBaEMsQ0FBQTtBQUFBLElBQ0EsY0FBQSxHQUFpQixRQUFRLENBQUMsS0FBSyxDQUFDLE1BRGhDLENBQUE7QUFBQSxJQUVBLGFBQUEsR0FBaUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUZoQyxDQUFBO0FBQUEsSUFHQSxjQUFBLEdBQWlCLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFIaEMsQ0FBQTtBQUFBLElBS0EsY0FBQSxHQUFpQixDQUFDLGNBQUEsR0FBaUIsYUFBbEIsQ0FBQSxHQUFtQyxhQUxwRCxDQUFBO0FBQUEsSUFNQSxhQUFBLEdBQWlCLGFBTmpCLENBQUE7QUFBQSxJQVFBLEtBQUEsR0FBUSxDQUFDLEdBQUEsR0FBTSxDQUFDLGNBQUEsR0FBaUIsY0FBbEIsQ0FBUCxDQUFBLEdBQTRDLEdBUnBELENBQUE7QUFBQSxJQVVBLEVBQUEsR0FBUyxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxFQUFpQixHQUFBLEdBQU0sS0FBdkIsQ0FWVCxDQUFBO0FBQUEsSUFXQSxFQUFBLEdBQVMsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLENBQWQsRUFBaUIsR0FBQSxHQUFNLEtBQXZCLENBWFQsQ0FBQTtBQUFBLElBWUEsRUFBQSxHQUFTLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxHQUFkLEVBQW1CLEdBQUEsR0FBTSxLQUF6QixDQVpULENBQUE7QUFBQSxJQWFBLEVBQUEsR0FBUyxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxFQUFtQixHQUFBLEdBQU0sS0FBekIsQ0FiVCxDQUFBO0FBQUEsSUFlQSxNQUFBLEdBQWtELElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FmdEYsQ0FBQTtBQUFBLElBZ0JBLE1BQU8sQ0FBQSxDQUFBLENBQVAsR0FBa0QsRUFoQmxELENBQUE7QUFBQSxJQWlCQSxNQUFPLENBQUEsQ0FBQSxDQUFQLEdBQWtELEVBakJsRCxDQUFBO0FBQUEsSUFrQkEsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFrRCxFQWxCbEQsQ0FBQTtBQUFBLElBbUJBLE1BQU8sQ0FBQSxDQUFBLENBQVAsR0FBa0QsRUFuQmxELENBQUE7QUFBQSxJQW9CQSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQXBDLEdBQWtELE1BcEJsRCxDQUFBO0FBQUEsSUFxQkEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxXQUFwQyxHQUFrRCxJQXJCbEQsQ0FBQTtBQUFBLElBd0JBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0F4QkEsQ0FBQTtBQUFBLElBMEJBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBbEMsR0FBMEMsSUFBQyxDQUFBLEdBMUIzQyxDQUFBO0FBQUEsSUEyQkEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFsQyxHQUEwQyxJQUFDLENBQUEsR0EzQjNDLENBQUE7QUFBQSxJQTZCQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFqQyxFQUFzQyxJQUFDLENBQUEsR0FBdkMsQ0E3QkEsQ0FBQTtXQThCQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFqQyxFQUFzQyxJQUFDLENBQUEsR0FBdkMsRUFoQ2E7RUFBQSxDQXZMZixDQUFBOztBQUFBLGtCQXlOQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osSUFBQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBQUEsQ0FBQTtXQUNBLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxPQUFSLENBQWdCO0FBQUEsTUFBRSxNQUFBLEVBQVEsSUFBVjtLQUFoQixFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsR0FBVjtBQUFBLE1BQ0EsTUFBQSxFQUFRLGFBRFI7QUFBQSxNQUVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixZQUFBLEtBQUE7QUFBQSxRQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBVCxDQUFBO2VBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQyxHQUF3QyxNQUZoQztNQUFBLENBRlY7S0FERixDQU1DLENBQUMsT0FORixDQU1VO0FBQUEsTUFBRSxLQUFBLEVBQU8sQ0FBVDtLQU5WLEVBT0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxHQUFWO0FBQUEsTUFDQSxNQUFBLEVBQVEsYUFEUjtBQUFBLE1BRUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFlBQUEsS0FBQTtBQUFBLFFBQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxLQUFULENBQUE7ZUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQS9CLEdBQXdDLE1BRmhDO01BQUEsQ0FGVjtLQVBGLENBWUMsQ0FBQyxPQVpGLENBWVU7QUFBQSxNQUFFLE1BQUEsRUFBUSxDQUFWO0tBWlYsRUFhRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEdBQVY7QUFBQSxNQUNBLE1BQUEsRUFBUSxhQURSO0FBQUEsTUFFQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsWUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQVQsQ0FBQTtlQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBaEMsR0FBd0MsTUFGaEM7TUFBQSxDQUZWO0tBYkYsRUFGSTtFQUFBLENBek5OLENBQUE7O0FBQUEsa0JBK09BLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsSUFBQSxJQUFDLENBQUEsTUFBRCxHQUF3QyxHQUF4QyxDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsS0FBRCxHQUF3QyxHQUR4QyxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQWhDLEdBQXdDLEdBRnhDLENBQUE7V0FHQSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQS9CLEdBQXdDLElBSjFCO0VBQUEsQ0EvT2hCLENBQUE7O0FBQUEsa0JBcVBBLE1BQUEsR0FBUSxTQUFDLEtBQUQsR0FBQTtBQUNOLElBQUEsSUFBRyxJQUFDLENBQUEsS0FBSjthQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBL0IsSUFBd0MsS0FBQSxHQUFRLE1BRGxEO0tBRE07RUFBQSxDQXJQUixDQUFBOztBQUFBLGtCQW9RQSxTQUFBLEdBQVcsSUFwUVgsQ0FBQTs7QUFBQSxrQkFxUUEsUUFBQSxHQUFXLElBclFYLENBQUE7O0FBQUEsa0JBc1FBLEdBQUEsR0FBWSxJQXRRWixDQUFBOztBQUFBLGtCQXVRQSxHQUFBLEdBQVksSUF2UVosQ0FBQTs7QUFBQSxrQkF5UUEsUUFBQSxHQUFZLElBelFaLENBQUE7O0FBQUEsa0JBMFFBLEtBQUEsR0FBWSxJQTFRWixDQUFBOztBQUFBLGtCQTJRQSxLQUFBLEdBQVksSUEzUVosQ0FBQTs7QUFBQSxrQkE0UUEsVUFBQSxHQUFZLElBNVFaLENBQUE7O0FBQUEsa0JBNlFBLFVBQUEsR0FBWSxJQTdRWixDQUFBOztBQUFBLGtCQStRQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsUUFBQSwyQkFBQTtBQUFBLElBQUEsRUFBQSxHQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBM0MsQ0FBQTtBQUFBLElBQ0EsS0FBQSxHQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBRG5ELENBQUE7QUFBQSxJQUVBLE1BQUEsR0FBUyxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUZuRCxDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLEtBQUssQ0FBQyxpQkFBTixDQUF3QixFQUF4QixFQUE0QixNQUFNLENBQUMsVUFBUCxHQUFvQixNQUFNLENBQUMsV0FBdkQsRUFBb0UsR0FBcEUsRUFBeUUsSUFBekUsQ0FKakIsQ0FBQTtBQUFBLElBS0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBcEIsQ0FBeUIsR0FBekIsQ0FMQSxDQUFBO0FBQUEsSUFPQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLEtBQUssQ0FBQyxLQUFOLENBQUEsQ0FQaEIsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLEdBQUQsR0FBWSxJQUFBLEtBQUssQ0FBQyxpQkFBTixDQUF3QixNQUFNLENBQUMsVUFBL0IsRUFBMkMsTUFBTSxDQUFDLFdBQWxELEVBQStEO0FBQUEsTUFBRSxTQUFBLEVBQVcsS0FBSyxDQUFDLFlBQW5CO0FBQUEsTUFBaUMsU0FBQSxFQUFXLEtBQUssQ0FBQyxhQUFsRDtBQUFBLE1BQWlFLE1BQUEsRUFBUSxLQUFLLENBQUMsU0FBL0U7S0FBL0QsQ0FUWixDQUFBO0FBQUEsSUFVQSxJQUFDLENBQUEsR0FBRCxHQUFZLElBQUEsS0FBSyxDQUFDLGlCQUFOLENBQXdCLE1BQU0sQ0FBQyxVQUEvQixFQUEyQyxNQUFNLENBQUMsV0FBbEQsRUFBK0Q7QUFBQSxNQUFFLFNBQUEsRUFBVyxLQUFLLENBQUMsWUFBbkI7QUFBQSxNQUFpQyxTQUFBLEVBQVcsS0FBSyxDQUFDLGFBQWxEO0FBQUEsTUFBaUUsTUFBQSxFQUFRLEtBQUssQ0FBQyxTQUEvRTtLQUEvRCxDQVZaLENBQUE7QUFBQSxJQVlBLElBQUMsQ0FBQSxLQUFELEdBQThCLElBQUEsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsS0FBSyxDQUFDLG9CQUF2QixDQVo5QixDQUFBO0FBQUEsSUFhQSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsR0FBMEIsSUFiMUIsQ0FBQTtBQUFBLElBY0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQWxCLEdBQTBCLENBQUEsR0FBSSxNQUFNLENBQUMsVUFkckMsQ0FBQTtBQUFBLElBZ0JBLElBQUMsQ0FBQSxLQUFELEdBQThCLElBQUEsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsS0FBSyxDQUFDLGtCQUF2QixDQWhCOUIsQ0FBQTtBQUFBLElBaUJBLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxHQUEwQixJQWpCMUIsQ0FBQTtBQUFBLElBa0JBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFsQixHQUEwQixDQUFBLEdBQUksTUFBTSxDQUFDLFdBbEJyQyxDQUFBO0FBQUEsSUFvQkEsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxLQUFLLENBQUMsVUFBTixDQUFpQixJQUFDLENBQUEsUUFBbEIsRUFBNEIsSUFBQyxDQUFBLFNBQTdCLENBcEJsQixDQUFBO0FBQUEsSUFzQkEsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxLQUFLLENBQUMsVUFBTixDQUFpQixLQUFLLENBQUMsVUFBdkIsQ0F0QmxCLENBQUE7QUFBQSxJQXdCQSxRQUFBLEdBQWUsSUFBQSxLQUFLLENBQUMsaUJBQU4sQ0FBQSxDQXhCZixDQUFBO0FBQUEsSUEwQkEsSUFBQyxDQUFBLFFBQUQsR0FBMkIsSUFBQSxLQUFLLENBQUMsSUFBTixDQUFlLElBQUEsS0FBSyxDQUFDLG1CQUFOLENBQTBCLEdBQTFCLEVBQStCLEdBQS9CLENBQWYsRUFBb0QsUUFBcEQsQ0ExQjNCLENBQUE7QUFBQSxJQTJCQSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFuQixHQUF1QixDQUFBLENBM0J2QixDQUFBO0FBQUEsSUE0QkEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBaEIsQ0FBb0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBakMsRUFBb0MsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBakQsRUFBb0QsR0FBcEQsQ0E1QkEsQ0FBQTtXQTZCQSxJQUFDLENBQUEsUUFBUSxDQUFDLEdBQVYsQ0FBYyxJQUFDLENBQUEsUUFBZixFQTlCVztFQUFBLENBL1FiLENBQUE7O0FBQUEsa0JBK1NBLGdCQUFBLEdBQWtCLFNBQUMsVUFBRCxFQUFhLE1BQWIsR0FBQTtXQUNoQixJQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0IsVUFBcEIsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsT0FBRCxHQUFBO0FBQzlCLFlBQUEsT0FBQTtBQUFBLFFBQUEsS0FBQyxDQUFBLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBbkIsR0FBeUIsT0FBekIsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxHQUF5QixLQUFLLENBQUMsWUFEL0IsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFBLEtBQVEsQ0FBQSxRQUhSLENBQUE7QUFBQSxRQUtBLEtBQUMsQ0FBQSxRQUFELEdBQWtCLElBQUEsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsT0FBTyxDQUFDLFFBQTdCLEVBQXVDLE1BQXZDLENBTGxCLENBQUE7QUFBQSxRQU1BLEtBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixLQUFDLENBQUEsVUFBbkIsQ0FOQSxDQUFBO0FBQUEsUUFPQSxLQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsS0FBQyxDQUFBLEtBQW5CLENBUEEsQ0FBQTtBQUFBLFFBUUEsS0FBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQWtCLEtBQUMsQ0FBQSxLQUFuQixDQVJBLENBQUE7QUFBQSxRQVNBLEtBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixLQUFDLENBQUEsVUFBbkIsQ0FUQSxDQUFBO2VBVUEsS0FBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQWlCLElBQWpCLEVBWDhCO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEMsRUFEZ0I7RUFBQSxDQS9TbEIsQ0FBQTs7ZUFBQTs7R0FGd0IsS0FBSyxDQUFDLE1BbnBEaEMsQ0FBQTs7QUFBQSxDQW05REMsU0FBQSxHQUFBO0FBQ0MsTUFBQSxxQkFBQTtBQUFBLEVBQUEsTUFBQSxHQUFTLENBQUMsV0FBRCxDQUFULENBQUE7QUFBQSxFQUVBLEtBQUssQ0FBQyxZQUFOLEdBQXlCLElBQUEsS0FBSyxDQUFDLFlBQU4sQ0FBQSxDQUZ6QixDQUFBO0FBR0EsT0FBQSx3Q0FBQTtzQkFBQTtBQUNFLElBQUEsS0FBSyxDQUFDLFlBQVksQ0FBQyxXQUFuQixDQUErQixLQUEvQixDQUFBLENBREY7QUFBQSxHQUhBO1NBTUEsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFuQixDQUE2QixXQUE3QixFQVBEO0FBQUEsQ0FBRCxDQUFBLENBQUEsQ0FuOURBLENBQUEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIlNQQUNFID0gU1BBQ0UgfHwge31cblxuU1BBQ0UuRU5WICAgICAgICA9ICdkZXZlbG9wbWVudCdcblxuIyBQSVhJLkpTXG5TUEFDRS5GUFMgICAgICAgID0gMzBcblNQQUNFLnBpeGVsUmF0aW8gPSAod2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSlcblxuIyBUSFJFRS5KU1xuU1BBQ0UuVEhSRUUgPSB7fVxuXG4jIFNPVU5EQ0xPVURcblNQQUNFLlNDID0gKC0+XG4gIG9iamVjdCA9IHt9XG4gIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG4gICAgb2JqZWN0LmlkID0gJ2RlMGI4NTM5YjRhZDJmNmNjMjNkZmUxY2M2ZTA0MzhkJ1xuICBlbHNlXG4gICAgb2JqZWN0LmlkID0gJzgwN2QyODU3NWMzODRlNjJhNThiZTVjM2ExNDQ2ZTY4J1xuICBvYmplY3QucmVkaXJlY3RfdXJpID0gd2luZG93LmxvY2F0aW9uLm9yaWdpblxuICByZXR1cm4gb2JqZWN0XG4pKClcblxuXG4jIE1FVEhPRFNcblNQQUNFLkxPRyAgICAgICAgPSAobG9nLCBzdHlsZXM9JycpLT5cbiAgdW5sZXNzIC8ocHJvZHxwcm9kdWN0aW9uKS8udGVzdChTUEFDRS5FTlYpXG4gICAgICBkYXRlICAgICA9IG5ldyBEYXRlKClcbiAgICAgIHRpbWVTdHIgID0gZGF0ZS50b1RpbWVTdHJpbmcoKVxuICAgICAgdGltZVN0ciAgPSB0aW1lU3RyLnN1YnN0cigwLCA4KVxuICAgICAgZGF0ZVN0ciAgPSBkYXRlLmdldERhdGUoKSArICcvJ1xuICAgICAgZGF0ZVN0ciArPSAoZGF0ZS5nZXRNb250aCgpKzEpICsgJy8nXG4gICAgICBkYXRlU3RyICs9IGRhdGUuZ2V0RnVsbFllYXIoKVxuICAgICAgY29uc29sZS5sb2coZGF0ZVN0cisnIC0gJyt0aW1lU3RyKycgfCAnK2xvZywgc3R5bGVzKVxuXG5TUEFDRS5UT0RPICAgICAgID0gKG1lc3NhZ2UpLT5cbiAgU1BBQ0UuTE9HKCclY1RPRE8gfCAnICsgbWVzc2FnZSwgJ2NvbG9yOiAjMDA4OEZGJylcblxuU1BBQ0UuQVNTRVJUICAgICA9IChjb25kaXRpb24sIGFjdGlvbiktPlxuICBhY3Rpb24oKSBpZiBjb25kaXRpb25cbiAgcmV0dXJuIGNvbmRpdGlvblxuXG5cbkpVS0VCT1ggPVxuICBUUkFDS19PTl9BREQ6IG5ldyBFdmVudCgnanVrZWJveF90cmFja19vbl9hZGQnKVxuICBUUkFDS19BRERFRDogIG5ldyBFdmVudCgnanVrZWJveF90cmFja19hZGRlZCcpXG4gIE9OX1BMQVk6ICAgICAgbmV3IEV2ZW50KCdqdWtlYm94X29uX3BsYXknKVxuICBPTl9TVE9QOiAgICAgIG5ldyBFdmVudCgnanVrZWJveF9vbl9zdG9wJylcbiAgSVNfUExBWUlORzogICBuZXcgRXZlbnQoJ2p1a2Vib3hfaXNfcGxheWluZycpXG4gIElTX1NUT1BQRUQ6ICAgbmV3IEV2ZW50KCdqdWtlYm94X2lzX3N0b3BwZWQnKVxuICBJU19TRUFSQ0hJTkc6IG5ldyBFdmVudCgnanVrZWJveF9pc19zZWFyY2hpbmcnKVxuT2JqZWN0LmZyZWV6ZShKVUtFQk9YKVxuXG5UUkFDSyA9XG4gIElTX1BMQVlJTkc6IG5ldyBFdmVudCgndHJhY2tfaXNfcGxheWluZycpXG4gIElTX1BBVVNFRDogIG5ldyBFdmVudCgndHJhY2tfaXNfcGF1c2VkJylcbiAgSVNfU1RPUFBFRDogbmV3IEV2ZW50KCd0cmFja19pc19zdG9wcGVkJylcbk9iamVjdC5mcmVlemUoVFJBQ0spXG5cblxuS2V5Ym9hcmQgPVxuICBFTlRFUjogIDEzXG4gIFVQOiAgICAgMzhcbiAgRE9XTjogICA0MFxuICBFU0M6ICAgIDI3XG4gIERFTEVURTogNDZcblxuU3BhY2VzaGlwU3RhdGUgPVxuICBJRExFOiAgICAgJ2lkbGUnXG4gIExBVU5DSEVEOiAnbGF1bmNoZWQnXG4gIElOX0xPT1A6ICAnaW5fbG9vcCdcbiAgQVJSSVZFRDogICdhcnJpdmVkJ1xuXG5TZWFyY2hFbmdpbmVTdGF0ZSA9XG4gIE9QRU5FRDogJ29wZW5lZCdcbiAgQ0xPU0VEOiAnY2xvc2VkJ1xuICBTRUFSQ0g6ICdzZWFyY2gnXG4gIFRSQUNLX1NFTEVDVEVEOiAndHJhY2tfc2VsZWN0ZWQnXG5cbkp1a2Vib3hTdGF0ZSA9XG4gIElTX1BMQVlJTkc6ICdpc19wbGF5aW5nJ1xuICBJU19TVE9QUEVEOiAnaXNfc3RvcHBlZCdcblxuQWlycG9ydFN0YXRlID1cbiAgSURMRTogJ2lkbGUnXG4gIFNFTkRJTkc6ICdzZW5kaW5nJ1xuXG5PYmplY3QuZnJlZXplKEtleWJvYXJkKVxuT2JqZWN0LmZyZWV6ZShTcGFjZXNoaXBTdGF0ZSlcbk9iamVjdC5mcmVlemUoU2VhcmNoRW5naW5lU3RhdGUpXG5PYmplY3QuZnJlZXplKEp1a2Vib3hTdGF0ZSlcbk9iamVjdC5mcmVlemUoQWlycG9ydFN0YXRlKVxuXG5cbndpbmRvdy5IRUxQRVIgPSB3aW5kb3cuSEVMUEVSIHx8XG4gIGV2ZW50czoge31cblxuICB0cmlnZ2VyOiAoZXZlbnRuYW1lLCBvYmplY3QpLT5cbiAgICBjb25zb2xlLmxvZyBldmVudG5hbWVcbiAgICB1bmxlc3MgQGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudG5hbWUpXG4gICAgICBAZXZlbnRzW2V2ZW50bmFtZV0gPSBuZXcgRXZlbnQoZXZlbnRuYW1lKVxuXG4gICAgZSA9IEBldmVudHNbZXZlbnRuYW1lXVxuICAgIGUub2JqZWN0ID0gb2JqZWN0XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChlKVxuXG4gIHJldGluYTogKHZhbHVlKS0+XG4gICAgaWYgdHlwZW9mIHZhbHVlIGlzICdvYmplY3QnXG4gICAgICBvYmplY3QgPSB2YWx1ZVxuICAgICAgbyA9IHt9XG4gICAgICBmb3Iga2V5IG9mIG9iamVjdFxuICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldXG4gICAgICAgIGlmIHR5cGVvZiB2YWx1ZSBpcyAnbnVtYmVyJ1xuICAgICAgICAgIG9ba2V5XSA9IHZhbHVlICogd2luZG93LmRldmljZVBpeGVsUmF0aW9cbiAgICAgIHJldHVybiBAbWVyZ2Uob2JqZWN0LCBvKVxuICAgIGVsc2UgaWYgdHlwZW9mIHZhbHVlIGlzICdhcnJheSdcbiAgICAgIGFycmF5ID0gdmFsdWVcbiAgICAgIGEgPSBbXVxuICAgICAgZm9yIHZhbHVlLCBrZXkgaW4gYXJyYXlcbiAgICAgICAgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICAgICAgYS5wdXNoKHZhbHVlICogd2luZG93LmRldmljZVBpeGVsUmF0aW8pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhLnB1c2godmFsdWUpXG4gICAgICByZXR1cm4gYVxuICAgIGVsc2UgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICByZXR1cm4gdmFsdWUgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb1xuICAgIHJldHVybiBmYWxzZVxuXG5cbl9Db2ZmZWUgPSBfQ29mZmVlIHx8IHtcbiAgIyBBcnJheVxuICBzaHVmZmxlOiAoYXJyYXkpLT5cbiAgICB0bXBcbiAgICBjdXJyID0gYXJyYXkubGVuZ3RoXG4gICAgd2hpbGUgMCAhPSBjdXJyXG4gICAgICByYW5kID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycilcbiAgICAgIGN1cnIgLT0gMVxuICAgICAgdG1wICAgICAgICAgPSBhcnJheVtjdXJyXVxuICAgICAgYXJyYXlbY3Vycl0gPSBhcnJheVtyYW5kXVxuICAgICAgYXJyYXlbcmFuZF0gPSB0bXBcbiAgICByZXR1cm4gYXJyYXlcblxuICAjIE9iamVjdFxuICBtZXJnZTogKG9wdGlvbnMsIG92ZXJyaWRlcykgLT5cbiAgICBAZXh0ZW5kIChAZXh0ZW5kIHt9LCBvcHRpb25zKSwgb3ZlcnJpZGVzXG5cbiAgZXh0ZW5kOiAob2JqZWN0LCBwcm9wZXJ0aWVzKSAtPlxuICAgIGZvciBrZXksIHZhbCBvZiBwcm9wZXJ0aWVzXG4gICAgICBvYmplY3Rba2V5XSA9IHZhbFxuICAgIG9iamVjdFxufVxuXG5cbl9NYXRoID0gX01hdGggfHwge1xuICBhbmdsZUJldHdlZW5Qb2ludHM6IChmaXJzdCwgc2Vjb25kKSAtPlxuICAgIGhlaWdodCA9IHNlY29uZC55IC0gZmlyc3QueVxuICAgIHdpZHRoICA9IHNlY29uZC54IC0gZmlyc3QueFxuICAgIHJldHVybiBNYXRoLmF0YW4yKGhlaWdodCwgd2lkdGgpXG5cbiAgZGlzdGFuY2U6IChwb2ludDEsIHBvaW50MikgLT5cbiAgICB4ID0gcG9pbnQxLnggLSBwb2ludDIueFxuICAgIHkgPSBwb2ludDEueSAtIHBvaW50Mi55XG4gICAgZCA9IHggKiB4ICsgeSAqIHlcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGQpXG5cbiAgY29sbGlzaW9uOiAoZG90MSwgZG90MiktPlxuICAgIHIxID0gaWYgZG90MS5yYWRpdXMgdGhlbiBkb3QxLnJhZGl1cyBlbHNlIDBcbiAgICByMiA9IGlmIGRvdDIucmFkaXVzIHRoZW4gZG90Mi5yYWRpdXMgZWxzZSAwXG4gICAgZGlzdCA9IHIxICsgcjJcblxuICAgIHJldHVybiBAZGlzdGFuY2UoZG90MS5wb3NpdGlvbiwgZG90Mi5wb3NpdGlvbikgPD0gTWF0aC5zcXJ0KGRpc3QgKiBkaXN0KVxuXG4gIG1hcDogKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIC0+XG4gICAgcmV0dXJuIGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSlcblxuICAjIEhlcm1pdGUgQ3VydmVcbiAgaGVybWl0ZTogKHkwLCB5MSwgeTIsIHkzLCBtdSwgdGVuc2lvbiwgYmlhcyktPlxuICAgIGBcbiAgICB2YXIgbTAsbTEsbXUyLG11MztcbiAgICB2YXIgYTAsYTEsYTIsYTM7XG5cbiAgICBtdTIgPSBtdSAqIG11O1xuICAgIG11MyA9IG11MiAqIG11O1xuICAgIG0wICA9ICh5MS15MCkqKDErYmlhcykqKDEtdGVuc2lvbikvMjtcbiAgICBtMCArPSAoeTIteTEpKigxLWJpYXMpKigxLXRlbnNpb24pLzI7XG4gICAgbTEgID0gKHkyLXkxKSooMStiaWFzKSooMS10ZW5zaW9uKS8yO1xuICAgIG0xICs9ICh5My15MikqKDEtYmlhcykqKDEtdGVuc2lvbikvMjtcbiAgICBhMCA9ICAyKm11MyAtIDMqbXUyICsgMTtcbiAgICBhMSA9ICAgIG11MyAtIDIqbXUyICsgbXU7XG4gICAgYTIgPSAgICBtdTMgLSAgIG11MjtcbiAgICBhMyA9IC0yKm11MyArIDMqbXUyO1xuICAgIGBcbiAgICByZXR1cm4oYTAqeTErYTEqbTArYTIqbTErYTMqeTIpXG59XG5cblxuX1RIUkVFID0gX1RIUkVFIHx8IHtcbiAgSGVybWl0ZUN1cnZlOiAocHRzKS0+XG4gICAgcGF0aCA9IG5ldyBUSFJFRS5DdXJ2ZVBhdGgoKVxuICAgIHBhdGguYWRkKG5ldyBUSFJFRS5IZXJtaXRlQmV6aWVyQ3VydmUzKHB0c1swXSwgcHRzWzBdLCBwdHNbMV0sIHB0c1syXSkpXG4gICAgZm9yIGkgaW4gWzAuLihwdHMubGVuZ3RoLTQpXVxuICAgICAgcGF0aC5hZGQobmV3IFRIUkVFLkhlcm1pdGVCZXppZXJDdXJ2ZTMocHRzW2ldLCBwdHNbaSsxXSwgcHRzW2krMl0sIHB0c1tpKzNdKSlcbiAgICBwYXRoLmFkZChuZXcgVEhSRUUuSGVybWl0ZUJlemllckN1cnZlMyhwdHNbcHRzLmxlbmd0aC0zXSwgcHRzW3B0cy5sZW5ndGgtMl0sIHB0c1twdHMubGVuZ3RoLTFdLCBwdHNbcHRzLmxlbmd0aC0xXSkpXG4gICAgcmV0dXJuIHBhdGhcbn1cblxuVEhSRUUuQ3VydmUuVXRpbHMudGFuZ2VudEhlcm1pdGVCZXppZXIgPSAoIHkwLCB5MSwgeTIsIHkzLCBtdSwgdGVuc2lvbiwgYmlhcyApLT5cbiAgICBtdTIgPSBtdSAqIG11XG4gICAgbXUzID0gbXUyICogbXVcblxuICAgIG0wICA9ICh5MS15MCkqKDErYmlhcykqKDEtdGVuc2lvbikvMlxuICAgIG0wICArPSAoeTIteTEpKigxLWJpYXMpKigxLXRlbnNpb24pLzJcblxuICAgIG0xICA9ICh5Mi15MSkqKDErYmlhcykqKDEtdGVuc2lvbikvMlxuICAgIG0xICArPSAoeTMteTIpKigxLWJpYXMpKigxLXRlbnNpb24pLzJcblxuICAgIGEwICA9ICAyKm11MyAtIDMqbXUyICsgMVxuICAgIGExICA9ICAgIG11MyAtIDIqbXUyICsgbXVcbiAgICBhMiAgPSAgICBtdTMgLSAgIG11MlxuICAgIGEzICA9IC0yKm11MyArIDMqbXUyXG5cbiAgICByZXR1cm4oYTAqeTErYTEqbTArYTIqbTErYTMqeTIpXG5cblRIUkVFLkhlcm1pdGVCZXppZXJDdXJ2ZTMgPSBUSFJFRS5DdXJ2ZS5jcmVhdGUoXG4gICh2MCwgdjEsIHYyLCB2MyktPlxuICAgIEB2MCA9IHYwXG4gICAgQHYxID0gdjFcbiAgICBAdjIgPSB2MlxuICAgIEB2MyA9IHYzXG4gICAgcmV0dXJuXG4gICwgKHQpLT5cbiAgICB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgdmVjdG9yLnggPSBUSFJFRS5DdXJ2ZS5VdGlscy50YW5nZW50SGVybWl0ZUJlemllcihAdjAueCwgQHYxLngsIEB2Mi54LCBAdjMueCwgdCwgMCwgMClcbiAgICB2ZWN0b3IueSA9IFRIUkVFLkN1cnZlLlV0aWxzLnRhbmdlbnRIZXJtaXRlQmV6aWVyKEB2MC55LCBAdjEueSwgQHYyLnksIEB2My55LCB0LCAwLCAwKVxuICAgIHZlY3Rvci56ID0gVEhSRUUuQ3VydmUuVXRpbHMudGFuZ2VudEhlcm1pdGVCZXppZXIoQHYwLnosIEB2MS56LCBAdjIueiwgQHYzLnosIHQsIDAsIDApXG4gICAgcmV0dXJuIHZlY3RvclxuKVxuXG5USFJFRS5Jbkxvb3BDdXJ2ZSA9IFRIUkVFLkN1cnZlLmNyZWF0ZShcbiAgKHYwLCBzdGFydEFuZ2xlPTAsIG1heFJhZGl1cz0xMDAsIG1pblJhZGl1cz0wLCBpbnZlcnNlPWZhbHNlLCB1c2VHb2xkZW49ZmFsc2UpLT5cbiAgICBAdjAgICAgICAgICA9IHYwXG4gICAgQGludmVyc2UgICAgPSBpbnZlcnNlXG4gICAgQHN0YXJ0QW5nbGUgPSBzdGFydEFuZ2xlXG5cbiAgICBAbWF4UmFkaXVzICA9IG1heFJhZGl1c1xuICAgIEBtaW5SYWRpdXMgID0gbWluUmFkaXVzXG4gICAgQHJhZGl1cyAgICAgPSBAbWF4UmFkaXVzIC0gQG1pblJhZGl1c1xuXG4gICAgQHVzZUdvbGRlbiAgPSB1c2VHb2xkZW5cblxuICAgIHJldHVyblxuICAsICh0KS0+XG4gICAgdCAgICAgPSAxIC0gdCBpZiBAaW52ZXJzZVxuICAgIGlmIEB1c2VHb2xkZW5cbiAgICAgICAgcGhpICAgPSAoTWF0aC5zcXJ0KDUpKzEpLzIgLSAxXG4gICAgICAgIGdvbGRlbl9hbmdsZSA9IHBoaSAqIE1hdGguUEkgKiAyXG4gICAgICAgIGFuZ2xlID0gQHN0YXJ0QW5nbGUgKyAoZ29sZGVuX2FuZ2xlICogdClcbiAgICAgICAgYW5nbGUgKz0gTWF0aC5QSSAqIC0xLjIzNVxuICAgIGVsc2VcbiAgICAgICAgYW5nbGUgPSBAc3RhcnRBbmdsZSArIChNYXRoLlBJICogMiAqIHQpXG5cbiAgICB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgdmVjdG9yLnggPSBAdjAueCArIE1hdGguY29zKGFuZ2xlKSAqIChAbWluUmFkaXVzICsgQHJhZGl1cyAqIHQpXG4gICAgdmVjdG9yLnkgPSBAdjAueSArIE1hdGguc2luKGFuZ2xlKSAqIChAbWluUmFkaXVzICsgQHJhZGl1cyAqIHQpXG4gICAgdmVjdG9yLnogPSBAdjAuelxuICAgIHJldHVybiB2ZWN0b3JcbilcblxuVEhSRUUuTGF1bmNoZWRDdXJ2ZSA9IFRIUkVFLkN1cnZlLmNyZWF0ZShcbiAgKHYwLCB2MSwgbmJMb29wPTIpLT5cbiAgICBAdjAgICA9IHYwXG4gICAgQHYxICAgPSB2MVxuICAgIEBuYkxvb3AgPSBuYkxvb3BcbiAgICByZXR1cm5cbiAgLCAodCktPlxuICAgIGFuZ2xlID0gTWF0aC5QSSAqIDIgKiB0ICogQG5iTG9vcFxuXG4gICAgZCA9IEB2MS56IC0gQHYwLnpcblxuICAgIGRpc3QgPSBAdjEuY2xvbmUoKS5zdWIoQHYwKVxuXG4gICAgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIHZlY3Rvci54ID0gQHYwLnggKyBkaXN0LnggKiB0XG4gICAgdmVjdG9yLnkgPSBAdjAueSArIGRpc3QueSAqIHRcbiAgICB2ZWN0b3IueiA9IEB2MC56ICsgZGlzdC56ICogdFxuXG4gICAgdCA9IE1hdGgubWluKHQsIDEgLSB0KSAvIC41XG5cbiAgICB2ZWN0b3IueCArPSBNYXRoLmNvcyhhbmdsZSkgKiAoNTAgKiB0KVxuICAgIHZlY3Rvci55ICs9IE1hdGguc2luKGFuZ2xlKSAqICg1MCAqIHQpXG5cbiAgICByZXR1cm4gdmVjdG9yXG4pXG5cblxuSEVMUEVSLkVhc2luZyA9IHtcblxuICAjXG4gICMgIEVhc2luZyBmdW5jdGlvbiBpbnNwaXJlZCBmcm9tIEFIRWFzaW5nXG4gICMgIGh0dHBzOi8vZ2l0aHViLmNvbS93YXJyZW5tL0FIRWFzaW5nXG4gICNcblxuICAjIyBNb2RlbGVkIGFmdGVyIHRoZSBsaW5lIHkgPSB4XG4gIGxpbmVhcjogKHApLT5cbiAgICByZXR1cm4gcFxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGFyYWJvbGEgeSA9IHheMlxuICBRdWFkcmF0aWNFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwYXJhYm9sYSB5ID0gLXheMiArIDJ4XG4gIFF1YWRyYXRpY0Vhc2VPdXQ6IChwKS0+XG4gICAgcmV0dXJuIC0ocCAqIChwIC0gMikpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgcXVhZHJhdGljXG4gICMgeSA9ICgxLzIpKCgyeCleMikgICAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAtKDEvMikoKDJ4LTEpKigyeC0zKSAtIDEpIDsgWzAuNSwgMV1cbiAgUXVhZHJhdGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMiAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICgtMiAqIHAgKiBwKSArICg0ICogcCkgLSAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBjdWJpYyB5ID0geF4zXG4gIEN1YmljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGN1YmljIHkgPSAoeCAtIDEpXjMgKyAxXG4gIEN1YmljRWFzZU91dDogKHApLT5cbiAgICBmID0gKHAgLSAxKVxuICAgIHJldHVybiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgY3ViaWNcbiAgIyB5ID0gKDEvMikoKDJ4KV4zKSAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKCgyeC0yKV4zICsgMikgOyBbMC41LCAxXVxuICBDdWJpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDQgKiBwICogcCAqIHBcbiAgICBlbHNlXG4gICAgICBmID0gKCgyICogcCkgLSAyKVxuICAgICAgcmV0dXJuIDAuNSAqIGYgKiBmICogZiArIDFcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1YXJ0aWMgeF40XG4gIFF1YXJ0aWNFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIHAgKiBwICogcCAqIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1YXJ0aWMgeSA9IDEgLSAoeCAtIDEpXjRcbiAgUXVhcnRpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSlcbiAgICByZXR1cm4gZiAqIGYgKiBmICogKDEgLSBwKSArIDFcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBxdWFydGljXG4gICMgeSA9ICgxLzIpKCgyeCleNCkgICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gLSgxLzIpKCgyeC0yKV40IC0gMikgOyBbMC41LCAxXVxuICBRdWFydGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gOCAqIHAgKiBwICogcCAqIHBcbiAgICBlbHNlXG4gICAgICBmID0gKHAgLSAxKVxuICAgICAgcmV0dXJuIC04ICogZiAqIGYgKiBmICogZiArIDFcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1aW50aWMgeSA9IHheNVxuICBRdWludGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHAgKiBwICogcFxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcXVpbnRpYyB5ID0gKHggLSAxKV41ICsgMVxuICBRdWludGljRWFzZU91dDogKHApLT5cbiAgICBmID0gKHAgLSAxKTtcbiAgICByZXR1cm4gZiAqIGYgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgcXVpbnRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjUpICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gKDEvMikoKDJ4LTIpXjUgKyAyKSA7IFswLjUsIDFdXG4gIFF1aW50aWNFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAxNiAqIHAgKiBwICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9ICgoMiAqIHApIC0gMilcbiAgICAgIHJldHVybiAgMC41ICogZiAqIGYgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHF1YXJ0ZXItY3ljbGUgb2Ygc2luZSB3YXZlXG4gIFNpbmVFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc2luKChwIC0gMSkgKiBNYXRoLlBJICogMikgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHF1YXJ0ZXItY3ljbGUgb2Ygc2luZSB3YXZlIChkaWZmZXJlbnQgcGhhc2UpXG4gIFNpbmVFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbihwICogTWF0aC5QSSAqIDIpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIGhhbGYgc2luZSB3YXZlXG4gIFNpbmVFYXNlSW5PdXQ6IChwKS0+XG4gICAgcmV0dXJuIDAuNSAqICgxIC0gTWF0aC5jb3MocCAqIE1hdGguUEkpKVxuXG4gICMgTW9kZWxlZCBhZnRlciBzaGlmdGVkIHF1YWRyYW50IElWIG9mIHVuaXQgY2lyY2xlXG4gIENpcmN1bGFyRWFzZUluOiAocCktPlxuICAgIHJldHVybiAxIC0gTWF0aC5zcXJ0KDEgLSAocCAqIHApKVxuXG4gICMgTW9kZWxlZCBhZnRlciBzaGlmdGVkIHF1YWRyYW50IElJIG9mIHVuaXQgY2lyY2xlXG4gIENpcmN1bGFyRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KCgyIC0gcCkgKiBwKTtcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBjaXJjdWxhciBmdW5jdGlvblxuICAjIHkgPSAoMS8yKSgxIC0gc3FydCgxIC0gNHheMikpICAgICAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKHNxcnQoLSgyeCAtIDMpKigyeCAtIDEpKSArIDEpIDsgWzAuNSwgMV1cbiAgQ2lyY3VsYXJFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiAoMSAtIE1hdGguc3FydCgxIC0gNCAqIChwICogcCkpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KC0oKDIgKiBwKSAtIDMpICogKCgyICogcCkgLSAxKSkgKyAxKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgZXhwb25lbnRpYWwgZnVuY3Rpb24geSA9IDJeKDEwKHggLSAxKSlcbiAgRXhwb25lbnRpYWxFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIGlmIChwID09IDAuMCkgdGhlbiBwIGVsc2UgTWF0aC5wb3coMiwgMTAgKiAocCAtIDEpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgZXhwb25lbnRpYWwgZnVuY3Rpb24geSA9IC0yXigtMTB4KSArIDFcbiAgRXhwb25lbnRpYWxFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiBpZiAocCA9PSAxLjApIHRoZW4gcCBlbHNlIDEgLSBNYXRoLnBvdygyLCAtMTAgKiBwKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIGV4cG9uZW50aWFsXG4gICMgeSA9ICgxLzIpMl4oMTAoMnggLSAxKSkgICAgICAgICA7IFswLDAuNSlcbiAgIyB5ID0gLSgxLzIpKjJeKC0xMCgyeCAtIDEpKSkgKyAxIDsgWzAuNSwxXVxuICBFeHBvbmVudGlhbEVhc2VJbk91dDogKHApLT5cbiAgICBpZihwID09IDAuMCB8fCBwID09IDEuMClcbiAgICAgIHJldHVybiBwXG5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDAuNSAqIE1hdGgucG93KDIsICgyMCAqIHApIC0gMTApXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIC0wLjUgKiBNYXRoLnBvdygyLCAoLTIwICogcCkgKyAxMCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBkYW1wZWQgc2luZSB3YXZlIHkgPSBzaW4oMTNwaS8yKngpKnBvdygyLCAxMCAqICh4IC0gMSkpXG4gIEVsYXN0aWNFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc2luKDEzICogTWF0aC5QSSAqIDIgKiBwKSAqIE1hdGgucG93KDIsIDEwICogKHAgLSAxKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGRhbXBlZCBzaW5lIHdhdmUgeSA9IHNpbigtMTNwaS8yKih4ICsgMSkpKnBvdygyLCAtMTB4KSArIDFcbiAgRWxhc3RpY0Vhc2VPdXQ6IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc2luKC0xMyAqIE1hdGguUEkgKiAyICogKHAgKyAxKSkgKiBNYXRoLnBvdygyLCAtMTAgKiBwKSArIDFcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBleHBvbmVudGlhbGx5LWRhbXBlZCBzaW5lIHdhdmU6XG4gICMgeSA9ICgxLzIpKnNpbigxM3BpLzIqKDIqeCkpKnBvdygyLCAxMCAqICgoMip4KSAtIDEpKSAgICAgIDsgWzAsMC41KVxuICAjIHkgPSAoMS8yKSooc2luKC0xM3BpLzIqKCgyeC0xKSsxKSkqcG93KDIsLTEwKDIqeC0xKSkgKyAyKSA7IFswLjUsIDFdXG4gIEVsYXN0aWNFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiBNYXRoLnNpbigxMyAqIE1hdGguUEkgKiAyICogKDIgKiBwKSkgKiBNYXRoLnBvdygyLCAxMCAqICgoMiAqIHApIC0gMSkpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnNpbigtMTMgKiBNYXRoLlBJICogMiAqICgoMiAqIHAgLSAxKSArIDEpKSAqIE1hdGgucG93KDIsIC0xMCAqICgyICogcCAtIDEpKSArIDIpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBvdmVyc2hvb3RpbmcgY3ViaWMgeSA9IHheMy14KnNpbih4KnBpKVxuICBCYWNrRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHAgLSBwICogTWF0aC5zaW4ocCAqIE1hdGguUEkpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIG92ZXJzaG9vdGluZyBjdWJpYyB5ID0gMS0oKDEteCleMy0oMS14KSpzaW4oKDEteCkqcGkpKVxuICBCYWNrRWFzZU91dDogKHApLT5cbiAgICBmID0gKDEgLSBwKVxuICAgIHJldHVybiAxIC0gKGYgKiBmICogZiAtIGYgKiBNYXRoLnNpbihmICogTWF0aC5QSSkpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2Ugb3ZlcnNob290aW5nIGN1YmljIGZ1bmN0aW9uOlxuICAjIHkgPSAoMS8yKSooKDJ4KV4zLSgyeCkqc2luKDIqeCpwaSkpICAgICAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKigxLSgoMS14KV4zLSgxLXgpKnNpbigoMS14KSpwaSkpKzEpIDsgWzAuNSwgMV1cbiAgQmFja0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgZiA9IDIgKiBwXG4gICAgICByZXR1cm4gMC41ICogKGYgKiBmICogZiAtIGYgKiBNYXRoLnNpbihmICogTWF0aC5QSSkpXG4gICAgZWxzZVxuICAgICAgZiA9ICgxIC0gKDIqcCAtIDEpKVxuICAgICAgcmV0dXJuIDAuNSAqICgxIC0gKGYgKiBmICogZiAtIGYgKiBNYXRoLnNpbihmICogTWF0aC5QSSkpKSArIDAuNVxuXG4gIEJvdW5jZUVhc2VJbjogKHApLT5cbiAgICByZXR1cm4gMSAtIEBCb3VuY2VFYXNlT3V0KDEgLSBwKTtcblxuICBCb3VuY2VFYXNlT3V0OiAocCktPlxuICAgIGlmKHAgPCA0LzExLjApXG4gICAgICByZXR1cm4gKDEyMSAqIHAgKiBwKS8xNi4wXG4gICAgZWxzZSBpZihwIDwgOC8xMS4wKVxuICAgICAgcmV0dXJuICgzNjMvNDAuMCAqIHAgKiBwKSAtICg5OS8xMC4wICogcCkgKyAxNy81LjBcbiAgICBlbHNlIGlmKHAgPCA5LzEwLjApXG4gICAgICByZXR1cm4gKDQzNTYvMzYxLjAgKiBwICogcCkgLSAoMzU0NDIvMTgwNS4wICogcCkgKyAxNjA2MS8xODA1LjBcbiAgICBlbHNlXG4gICAgICByZXR1cm4gKDU0LzUuMCAqIHAgKiBwKSAtICg1MTMvMjUuMCAqIHApICsgMjY4LzI1LjBcblxuICBCb3VuY2VFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiBAQm91bmNlRWFzZUluKHAqMilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMC41ICogQEJvdW5jZUVhc2VPdXQocCAqIDIgLSAxKSArIDAuNVxuXG59XG5cblxuY2xhc3MgU1BBQ0UuU2NlbmUgZXh0ZW5kcyBUSFJFRS5TY2VuZVxuICBfcGF1c2VkOiB0cnVlXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcblxuICAgIEB0eXBlICAgICAgICAgICAgID0gJ1NjZW5lJ1xuICAgIEBmb2cgICAgICAgICAgICAgID0gbnVsbFxuICAgIEBvdmVycmlkZU1hdGVyaWFsID0gbnVsbFxuICAgIEBhdXRvVXBkYXRlICAgICAgID0gdHJ1ZVxuXG4gIHVwZGF0ZTogKGRlbHRhKS0+XG4gICAgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuICAgICAgQHVwZGF0ZU9iaihjaGlsZCwgZGVsdGEpXG5cbiAgdXBkYXRlT2JqOiAob2JqLCBkZWx0YSktPlxuICAgIG9iai51cGRhdGUoZGVsdGEpIGlmIHR5cGVvZiBvYmoudXBkYXRlID09ICdmdW5jdGlvbidcbiAgICBpZiBvYmouaGFzT3duUHJvcGVydHkoJ2NoaWxkcmVuJykgYW5kIG9iai5jaGlsZHJlbi5sZW5ndGggPiAwXG4gICAgICBmb3IgY2hpbGQgaW4gb2JqLmNoaWxkcmVuXG4gICAgICAgIEB1cGRhdGVPYmooY2hpbGQsIGRlbHRhKVxuXG4gIHJlc2l6ZTogPT5cbiAgICBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG4gICAgICBAcmVzaXplT2JqKGNoaWxkKVxuXG4gIHJlc2l6ZU9iajogKG9iaiktPlxuICAgIG9iai5yZXNpemUoKSBpZiB0eXBlb2Ygb2JqLnJlc2l6ZSA9PSAnZnVuY3Rpb24nXG4gICAgaWYgb2JqLmhhc093blByb3BlcnR5KCdjaGlsZHJlbicpIGFuZCBvYmouY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgICAgZm9yIGNoaWxkIGluIG9iai5jaGlsZHJlblxuICAgICAgICBAcmVzaXplT2JqKGNoaWxkKVxuXG4gIHJlc3VtZTogLT5cbiAgICBAX3BhdXNlZCA9IGZhbHNlXG5cbiAgcGF1c2U6IC0+XG4gICAgQF9wYXVzZWQgPSB0cnVlXG5cbiAgaXNQYXVzZWQ6IC0+XG4gICAgcmV0dXJuIEBfcGF1c2VkXG5cblxuY2xhc3MgU1BBQ0UuU2NlbmVNYW5hZ2VyXG5cbiAgY3VycmVudFNjZW5lOiBudWxsXG4gIF9zY2VuZXM6IG51bGxcbiAgX3N0YXRzOiBudWxsXG4gIF9jbG9jazogbnVsbFxuXG4gIHJlbmRlcmVyOiBudWxsXG4gIGNhbWVyYTogICBudWxsXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQF9zZXR1cCgpXG4gICAgQF9ldmVudHMoKVxuXG4gICAgIyBpZiAoQHJlbmRlcmVyKSB0aGVuIHJldHVybiBAXG5cbiAgICAjIEBfY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKVxuXG4gICAgIyBAX3NjZW5lcyAgID0gW11cblxuICAgICMgQGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMClcbiAgICAjICMgQGNhbWVyYS5wb3NpdGlvbi5zZXRaKDYwMClcbiAgICAjICMgQGNhbWVyYS5wb3NpdGlvbi5zZXRZKDUwMClcbiAgICAjICMgQGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpXG5cbiAgICAjIEByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHthbnRpYWxpYXM6IHRydWV9KVxuICAgICMgIyBAcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg1OGIxZmYpKVxuICAgICMgQHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiAgICAjICMgQHJlbmRlcmVyLnNoYWRvd01hcEVuYWJsZWQgPSB0cnVlXG4gICAgIyAjIEByZW5kZXJlci5zaGFkb3dNYXBTb2Z0ICAgID0gdHJ1ZVxuICAgICMgIyBAcmVuZGVyZXIuc2hhZG93TWFwVHlwZSAgICA9IFRIUkVFLlBDRlNoYWRvd01hcFxuICAgICMgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyYXBwZXInKS5hcHBlbmRDaGlsZChAcmVuZGVyZXIuZG9tRWxlbWVudClcblxuICAgICMgQF9zZXR1cFN0YXRzKCkgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcblxuICAgICMgQF9yZW5kZXIoKVxuICAgICMgIyBAX3VwZGF0ZSgpXG5cbiAgICAjICMgd2luZG93Lm9ucmVzaXplID0gPT5cbiAgICAjICMgICBAcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KVxuICAgICMgIyAgIEBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAjICMgICBAY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuXG4gIF9zZXR1cDogLT5cbiAgICBAX2Nsb2NrICA9IG5ldyBUSFJFRS5DbG9jaygpXG4gICAgQF9zY2VuZXMgPSBbXVxuICAgIEBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApXG4gICAgQHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUsIGFscGhhOiBmYWxzZSB9KVxuICAgIEByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyYXBwZXInKS5hcHBlbmRDaGlsZChAcmVuZGVyZXIuZG9tRWxlbWVudClcblxuICAgIEBfc2V0dXBTdGF0cygpIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG4gICAgQF9yZW5kZXIoKVxuXG4gIF9ldmVudHM6IC0+XG4gICAgd2luZG93Lm9ucmVzaXplID0gQF9lT25SZXNpemVcblxuICBfZU9uUmVzaXplOiA9PlxuICAgIEByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgQGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodFxuICAgIEBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG4gICAgQGN1cnJlbnRTY2VuZS5yZXNpemUoKSBpZiBAY3VycmVudFNjZW5lXG5cbiAgX3NldHVwU3RhdHM6IC0+XG4gICAgQF9zdGF0cyA9IG5ldyBTdGF0cygpXG4gICAgQF9zdGF0cy5zZXRNb2RlKDApXG4gICAgQF9zdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgIEBfc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCdcbiAgICBAX3N0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBAX3N0YXRzLmRvbUVsZW1lbnQgKVxuXG4gIF9yZW5kZXI6ID0+XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShAX3JlbmRlcilcblxuICAgIGlmICFAY3VycmVudFNjZW5lIG9yIEBjdXJyZW50U2NlbmUuaXNQYXVzZWQoKVxuICAgICAgICByZXR1cm5cblxuICAgIEBjdXJyZW50U2NlbmUudXBkYXRlKEBfY2xvY2suZ2V0RGVsdGEoKSAqIDEwMDApXG4gICAgQHJlbmRlcmVyLnJlbmRlciggQGN1cnJlbnRTY2VuZSwgQGNhbWVyYSApXG5cbiAgICBAX3N0YXRzLnVwZGF0ZSgpIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG5cbiAgY3JlYXRlU2NlbmU6IChpZGVudGlmaWVyKS0+XG4gICAgaWYgQF9zY2VuZXNbaWRlbnRpZmllcl1cbiAgICAgICAgcmV0dXJuIEBfc2NlbmVzW2lkZW50aWZpZXJdXG5cbiAgICB0cnlcbiAgICAgIHNjZW5lID0gbmV3IChldmFsKFwiU1BBQ0UuXCIraWRlbnRpZmllcikpKClcbiAgICAgIEBfc2NlbmVzW2lkZW50aWZpZXJdID0gc2NlbmVcbiAgICBjYXRjaCBlXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIHJldHVybiBzY2VuZVxuXG4gIGdvVG9TY2VuZTogKGlkZW50aWZpZXIpLT5cbiAgICBpZiBAX3NjZW5lc1tpZGVudGlmaWVyXVxuICAgICAgICBAY3VycmVudFNjZW5lLnBhdXNlKCkgaWYgQGN1cnJlbnRTY2VuZVxuICAgICAgICBAY3VycmVudFNjZW5lID0gQF9zY2VuZXNbaWRlbnRpZmllcl1cbiAgICAgICAgQGN1cnJlbnRTY2VuZS5yZXN1bWUoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIGFsZXJ0KFwiU2NlbmUgJ1wiK2lkZW50aWZpZXIrXCInIGRvZXNuJ3QgZXhpc3RcIilcbiAgICByZXR1cm4gZmFsc2VcblxuXG5jbGFzcyBTUEFDRS5NYWluU2NlbmUgZXh0ZW5kcyBTUEFDRS5TY2VuZVxuXG4gIF9tYW5hZ2VyOiBudWxsXG4gIF9qdWtlYm94OiBudWxsXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXIoKVxuXG4gIHJlc3VtZTogLT5cbiAgICBzdXBlcigpXG5cbiAgICBAX21hbmFnZXIgPSBTUEFDRS5TY2VuZU1hbmFnZXJcblxuICAgICMgU2V0dXAgcmVuZGVyZXJcbiAgICBAX21hbmFnZXIuY2FtZXJhLnBvc2l0aW9uLnNldFooNjAwKVxuICAgICMgQF9tYW5hZ2VyLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pXG4gICAgIyBAX21hbmFnZXIucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg1OGIxZmYpKVxuICAgICMgQF9tYW5hZ2VyLnJlbmRlcmVyLnNoYWRvd01hcEVuYWJsZWQgPSB0cnVlXG4gICAgIyBAX21hbmFnZXIucmVuZGVyZXIuc2hhZG93TWFwU29mdCAgICA9IHRydWVcbiAgICAjIEBfbWFuYWdlci5yZW5kZXJlci5zaGFkb3dNYXBUeXBlICAgID0gVEhSRUUuUENGU2hhZG93TWFwXG5cbiAgICAjIENyZWF0ZSBhIFNDIHNpbmdsZXRvblxuICAgIFNQQUNFLlNDID0gbmV3IFNQQUNFLlNvdW5kQ2xvdWQoU1BBQ0UuU0MuaWQsIFNQQUNFLlNDLnJlZGlyZWN0X3VyaSlcblxuICAgIEBfZXZlbnRzKClcbiAgICBAX3NldHVwKCkgaWYgU1BBQ0UuU0MuaXNDb25uZWN0ZWQoKVxuXG4gIHBhdXNlOiAtPlxuXG4gIF9ldmVudHM6IC0+XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihTUEFDRS5Tb3VuZENsb3VkLklTX0NPTk5FQ1RFRCwgQF9lU0NJc0Nvbm5lY3RlZClcblxuICBfZVNDSXNDb25uZWN0ZWQ6ID0+XG4gICAgQF9zZXR1cCgpXG5cbiAgX3NldHVwOiA9PlxuICAgIHdpbmRvdy5maXJzdExhdW5jaCA9IHRydWVcblxuICAgICMgU2V0dXAgSnVrZWJveFxuICAgIEBfanVrZWJveCA9IG5ldyBTUEFDRS5KdWtlYm94KClcbiAgICAjIEBfanVrZWJveC5hZGQoJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vYm9uLWVudGVuZGV1ci1tdXNpYy9sYWZpZXJ0ZScpXG5cbiAgICAjIFNldHVwIGVxdWFsaXplcnNcbiAgICBzbWFsbCA9IG5ldyBTUEFDRS5FcXVhbGl6ZXIoe1xuICAgICAgbWluTGVuZ3RoOiAwXG4gICAgICBtYXhMZW5ndGg6IDIwMFxuICAgICAgcmFkaXVzOiAzMDBcbiAgICAgIGNvbG9yOiAweEZGRkZGRlxuICAgICAgYWJzb2x1dGU6IGZhbHNlXG4gICAgICBsaW5lRm9yY2VEb3duOiAuNVxuICAgICAgbGluZUZvcmNlVXA6IDFcbiAgICAgIGludGVycG9sYXRpb25UaW1lOiAyNTBcbiAgICB9KVxuICAgIEBhZGQoc21hbGwpXG5cbiAgICBiaWcgPSBuZXcgU1BBQ0UuRXF1YWxpemVyKHtcbiAgICAgIG1pbkxlbmd0aDogMFxuICAgICAgbWF4TGVuZ3RoOiA1MFxuICAgICAgcmFkaXVzOiAzMDBcbiAgICAgIGNvbG9yOiAweEQxRDFEMVxuICAgICAgYWJzb2x1dGU6IGZhbHNlXG4gICAgICBsaW5lRm9yY2VEb3duOiAuNVxuICAgICAgbGluZUZvcmNlVXA6IDFcbiAgICAgIGludGVycG9sYXRpb25UaW1lOiAyNTBcbiAgICB9KVxuICAgIEBhZGQoYmlnKVxuXG4gICAgIyBTZXR1cCBjb3ZlclxuICAgIEBjb3ZlciA9IG5ldyBTUEFDRS5Db3ZlcigpXG4gICAgQGFkZChAY292ZXIpXG5cbiAgICByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJlcS5vcGVuKCdHRVQnLCAncmVzb3VyY2VzL3BsYXlsaXN0Lmpzb24nLCB0cnVlKVxuICAgIHJlcS5vbmxvYWQgPSAoZSk9PlxuICAgICAgQHBsYXlsaXN0ID0gSlNPTi5wYXJzZShlLnRhcmdldC5yZXNwb25zZSlcbiAgICAgIEBjb3Zlci5sb2FkKEBwbGF5bGlzdClcbiAgICByZXEuc2VuZCgpXG5cblxuY2xhc3MgU1BBQ0UuU291bmRDbG91ZFxuXG4gIGNsaWVudF9pZDogICAgbnVsbFxuICByZWRpcmVjdF91cmk6IG51bGxcbiAgdG9rZW46ICAgICAgICBudWxsXG5cbiAgQElTX0NPTk5FQ1RFRDogJ3NvdW5kY2xvdWRfY29ubmVjdGVkJyMoLT4gcmV0dXJuIG5ldyBFdmVudCgnc291bmRjbG91ZF9jb25uZWN0ZWQnKSkoKVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIHJlZGlyZWN0X3VyaSktPlxuICAgIFNDLmluaXRpYWxpemUoe1xuICAgICAgY2xpZW50X2lkOiBpZFxuICAgICAgcmVkaXJlY3RfdXJpOiByZWRpcmVjdF91cmlcbiAgICB9KVxuXG4gICAgQGNsaWVudF9pZCAgICA9IGlkXG4gICAgQHJlZGlyZWN0X3VyaSA9IHJlZGlyZWN0X3VyaVxuXG4gICAgaWYgbm90IEBpc0Nvbm5lY3RlZCgpIGFuZCBTUEFDRS5FTlYgPT0gJ2RldmVsb3BtZW50J1xuICAgICAgZG9jdW1lbnQuY29va2llID0gXCJzb3VuZGNsb3VkX3Rva2VuPTEtODAyNjktMTE0NTcxMTYtMDQwMjlhMTRiZGZjMjg2XCJcbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IFwic291bmRjbG91ZF9jb25uZWN0ZWQ9dHJ1ZVwiXG5cbiAgaXNDb25uZWN0ZWQ6IC0+XG4gICAgaWYgKGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKC8oPzooPzpefC4qO1xccyopc291bmRjbG91ZF9jb25uZWN0ZWRcXHMqXFw9XFxzKihbXjtdKikuKiQpfF4uKiQvLCBcIiQxXCIpICE9IFwidHJ1ZVwiKVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ2luJykuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIEBfZUNsaWNrKVxuICAgIGVsc2VcbiAgICAgIEB0b2tlbiA9IGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKC8oPzooPzpefC4qO1xccyopc291bmRjbG91ZF90b2tlblxccypcXD1cXHMqKFteO10qKS4qJCl8Xi4qJC8sIFwiJDFcIilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgX2VDbGljazogPT5cbiAgICBTQy5jb25uZWN0KD0+XG4gICAgICBAdG9rZW4gICAgICAgICAgPSBTQy5hY2Nlc3NUb2tlbigpXG4gICAgICBkb2N1bWVudC5jb29raWUgPSBcInNvdW5kY2xvdWRfdG9rZW49XCIgKyBAdG9rZW5cbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IFwic291bmRjbG91ZF9jb25uZWN0ZWQ9dHJ1ZVwiXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW4nKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcbiAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLlNvdW5kQ2xvdWQuSVNfQ09OTkVDVEVEKVxuICAgIClcblxuICBwYXRoT3JVcmw6IChwYXRoLCBjYWxsYmFjayktPlxuICAgICMgVmVyaWZ5IGlmIGl0J3MgYW4gSUQgb3IgYW4gVVJMXG4gICAgaWYgL15cXC8ocGxheWxpc3RzfHRyYWNrc3x1c2VycylcXC9bMC05XSskLy50ZXN0KHBhdGgpXG4gICAgICByZXR1cm4gY2FsbGJhY2socGF0aClcblxuICAgIHVubGVzcyAvXihodHRwfGh0dHBzKS8udGVzdChwYXRoKVxuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nIFwiXFxcIlwiICsgcGF0aCArIFwiXFxcIiBpcyBub3QgYW4gdXJsIG9yIGEgcGF0aFwiXG5cbiAgICBTQy5nZXQoJy9yZXNvbHZlJywgeyB1cmw6IHBhdGggfSwgKHRyYWNrLCBlcnJvcik9PlxuICAgICAgaWYgKGVycm9yKVxuICAgICAgICBjb25zb2xlLmxvZyBlcnJvci5tZXNzYWdlXG4gICAgICBlbHNlXG4gICAgICAgIHVybCA9IFsnJywgdHJhY2sua2luZCsncycsIHRyYWNrLmlkXS5qb2luKCcvJylcbiAgICAgICAgY2FsbGJhY2sodXJsKVxuICAgIClcblxuICBzdHJlYW1Tb3VuZDogKG9iamVjdCwgb3B0aW9ucz17fSwgY2FsbGJhY2spLT5cbiAgICBpZiBvYmplY3QgYW5kIG9iamVjdC5oYXNPd25Qcm9wZXJ0eSgna2luZCcpXG4gICAgICBwYXRoID0gb2JqZWN0LnVyaS5yZXBsYWNlKCdodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbScsICcnKVxuXG4gICAgICBkZWZhdWx0cyA9XG4gICAgICAgIGF1dG9QbGF5OiB0cnVlXG4gICAgICAgIHVzZVdhdmVmb3JtRGF0YTogdHJ1ZVxuICAgICAgICB1c2VIVE1MNWF1ZGlvOiB0cnVlXG4gICAgICAgIHByZWZlckZsYXNoOiBmYWxzZVxuXG4gICAgICBvcHRpb25zID0gX0NvZmZlZS5tZXJnZShkZWZhdWx0cywgb3B0aW9ucylcbiAgICAgIFNDLnN0cmVhbShwYXRoLCBvcHRpb25zLCBjYWxsYmFjaylcblxuICBnZXRTb3VuZE9yUGxheWxpc3Q6IChwYXRoLCBjYWxsYmFjayktPlxuICAgIGlmIHR5cGVvZiBwYXRoID09ICdvYmplY3QnIGFuZCBwYXRoLmhhc093blByb3BlcnR5KCdraW5kJylcbiAgICAgIGNhbGxiYWNrKHBhdGgpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgQHBhdGhPclVybChwYXRoLCAocGF0aCk9PlxuICAgICAgQGdldChwYXRoLCBjYWxsYmFjaylcbiAgICApXG5cbiAgZ2V0OiAocGF0aCwgY2FsbGJhY2spLT5cbiAgICBTQy5nZXQocGF0aCwgY2FsbGJhY2spXG5cbiAgZ2V0U291bmRVcmw6IChwYXRoLCBjYWxsYmFjayktPlxuICAgIEBnZXRTb3VuZE9yUGxheWxpc3QocGF0aCwgKHNvdW5kKT0+XG4gICAgICBjYWxsYmFjayhzb3VuZC5zdHJlYW1fdXJsKyc/b2F1dGhfdG9rZW49JytAdG9rZW4pXG4gICAgKVxuXG4gIHNlYXJjaDogKHNlYXJjaCwgcGF0aCwgY2FsbGJhY2spLT5cbiAgICBpZiB0eXBlb2YgcGF0aCA9PSAnZnVuY3Rpb24nXG4gICAgICBjYWxsYmFjayA9IHBhdGhcbiAgICAgIHBhdGggICAgID0gJ3RyYWNrcydcblxuICAgIGlmIHBhdGggPT0gJ3VzZXJzJ1xuICAgICAgQHBhdGhPclVybCgnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS8nK3NlYXJjaCwgKHBhdGgpPT5cbiAgICAgICAgcGF0aCA9IHBhdGgrJy9mYXZvcml0ZXM/b2F1dGhfdG9rZW49JytAdG9rZW5cbiAgICAgICAgU0MuZ2V0KHBhdGgsIGNhbGxiYWNrKVxuICAgICAgKVxuICAgIGVsc2VcbiAgICAgIHBhdGggPSAnLycrcGF0aCsnP29hdXRoX3Rva2VuPScrQHRva2VuKycmcT0nK3NlYXJjaFxuICAgICAgU0MuZ2V0KHBhdGgsIGNhbGxiYWNrKVxuXG5cbmNsYXNzIFNQQUNFLlNlYXJjaEVuZ2luZVxuICBTQzogbnVsbFxuICBqdWtlYm94OiBudWxsXG5cbiAgIyBIVE1MXG4gIGlucHV0OiAgICAgICAgIG51bGxcbiAgbGlzdDogICAgICAgICAgbnVsbFxuICBsaXN0Q29udGFpbmVyOiBudWxsXG4gIGVsOiAgICAgICAgICAgIG51bGxcbiAgbGluZUhlaWdodDogICAgMFxuICByZXN1bHRzSGVpZ2h0OiAwXG4gIHJlc3VsdHM6ICAgICAgIG51bGxcbiAgZm9jdXNlZDogICAgICAgbnVsbFxuXG4gIHNjcm9sbFBvczogICAgIDBcblxuICBAc3RhdGU6ICBudWxsXG5cblxuICBjb25zdHJ1Y3RvcjogKGp1a2Vib3gpLT5cbiAgICBAanVrZWJveCAgICAgICA9IGp1a2Vib3hcbiAgICBAU0MgICAgICAgICAgICA9IFNQQUNFLlNDXG5cbiAgICBAZWwgICAgICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gnKVxuICAgIEBpbnB1dCAgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCBmb3JtIGlucHV0JylcbiAgICBAbGlzdCAgICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2ggLmxpc3QnKVxuICAgIEBsaXN0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCB1bCcpXG5cbiAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEKVxuICAgIEBfZXZlbnRzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2ggZm9ybScpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIEBfZUp1a2Vib3hJc1NlYXJjaGluZylcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIEBfZUtleXByZXNzKVxuXG4gIF9lSnVrZWJveElzU2VhcmNoaW5nOiAoZSk9PlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEBzZWFyY2goQGlucHV0LnZhbHVlKSBpZiBAaW5wdXQudmFsdWUubGVuZ3RoID4gMFxuXG4gIF9lS2V5cHJlc3M6IChlKT0+XG4gICAgc3dpdGNoKGUua2V5Q29kZSlcbiAgICAgIHdoZW4gS2V5Ym9hcmQuRU5URVJcbiAgICAgICAgaWYgQGlucHV0LnZhbHVlLmxlbmd0aCA9PSAwXG4gICAgICAgICAgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLkNMT1NFRFxuICAgICAgICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLk9QRU5FRClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBTZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0ggYW5kIEBmb2N1c2VkXG4gICAgICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBTZWFyY2hFbmdpbmVTdGF0ZS5UUkFDS19TRUxFQ1RFRFxuICAgICAgICAgIEBhZGQoKVxuXG4gICAgICB3aGVuIEtleWJvYXJkLlVQXG4gICAgICAgIEB1cCgpIGlmIEBzdGF0ZSA9PSBTZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcblxuICAgICAgd2hlbiBLZXlib2FyZC5ET1dOXG4gICAgICAgIEBkb3duKCkgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSFxuXG4gICAgICB3aGVuIEtleWJvYXJkLkVTQywgS2V5Ym9hcmQuREVMRVRFXG4gICAgICAgIGlmIEBzdGF0ZSA9PSBTZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcbiAgICAgICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBTZWFyY2hFbmdpbmVTdGF0ZS5UUkFDS19TRUxFQ1RFRFxuICAgICAgICAgIEBzZXRTdGF0ZShTZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0gpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEKVxuXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIHN3aXRjaCBAc3RhdGVcbiAgICAgIHdoZW4gU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEXG4gICAgICAgIEBlbC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgICAgICBAZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VhcmNoX29wZW4nKVxuXG4gICAgICAgIEBpbnB1dC52YWx1ZSAgICA9ICcnXG4gICAgICAgIEBpbnB1dC5kaXNhYmxlZCA9IGZhbHNlXG4gICAgICAgIEBpbnB1dC5mb2N1cygpXG5cbiAgICAgICAgQHJlc2V0KClcbiAgICAgIHdoZW4gU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEXG4gICAgICAgIEBlbC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgICAgd2hlbiBTZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5hZGQoJ3NlYXJjaF9vcGVuJylcblxuICAgICAgICBAaW5wdXQuZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgIEBpbnB1dC5ibHVyKClcblxuICAgICAgICBAbGluZUhlaWdodCAgICA9IEBsaXN0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2xpJykub2Zmc2V0SGVpZ2h0XG4gICAgICAgIEByZXN1bHRzSGVpZ2h0ID0gQGxpbmVIZWlnaHQgKiAoQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGgtMSlcblxuICAgICAgICBAZm9jdXNlZC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpIGlmIEBmb2N1c2VkXG4gICAgICAgIEBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpdGVtX3NlbGVjdGVkJylcbiAgICAgIHdoZW4gU2VhcmNoRW5naW5lU3RhdGUuVFJBQ0tfU0VMRUNURURcbiAgICAgICAgQGZvY3VzZWQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgICBAZWwuY2xhc3NMaXN0LmFkZCgnaXRlbV9zZWxlY3RlZCcpXG5cbiAgdXA6IC0+XG4gICAgbmV4dCA9IEBzY3JvbGxQb3MgKyBAbGluZUhlaWdodFxuICAgIGlmIG5leHQgPD0gMFxuICAgICAgQHNjcm9sbFBvcyA9IG5leHRcbiAgICAgIEBmb2N1cygpXG5cbiAgZG93bjogLT5cbiAgICBuZXh0ID0gQHNjcm9sbFBvcyAtIEBsaW5lSGVpZ2h0XG4gICAgaWYgTWF0aC5hYnMobmV4dCkgPD0gQHJlc3VsdHNIZWlnaHRcbiAgICAgIEBzY3JvbGxQb3MgPSBuZXh0XG4gICAgICBAZm9jdXMoKVxuXG4gIGZvY3VzOiA9PlxuICAgIGlmIEBsaXN0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykubGVuZ3RoID4gMVxuICAgICAgJChbQGxpc3RDb250YWluZXIsIEBpbnB1dF0pLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAnK0BzY3JvbGxQb3MrJ3B4KScpXG4gICAgICBwb3MgPSAoQHNjcm9sbFBvcyotMSkgLyAoQHJlc3VsdHNIZWlnaHQgLyAoQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGgtMSkpXG4gICAgICBwb3MgPSBNYXRoLmZsb29yKHBvcylcbiAgICAgIGVsbSA9IEBlbC5xdWVyeVNlbGVjdG9yKCdsaTpudGgtY2hpbGQoJysocG9zKzEpKycpJylcblxuICAgICAgaWYgZWxtLmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpXG4gICAgICAgIEBmb2N1c2VkLmNsYXNzTGlzdC5yZW1vdmUoJ2ZvY3VzZWQnKSBpZiBAZm9jdXNlZFxuICAgICAgICBAZm9jdXNlZCA9IGVsbVxuICAgICAgICBAZm9jdXNlZC5jbGFzc0xpc3QuYWRkKCdmb2N1c2VkJylcbiAgICAgIGVsc2VcbiAgICAgICAgQGZvY3VzZWQgPSBudWxsXG4gICAgZWxzZVxuICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLk9QRU5FRClcbiAgICAgICMgJChbQGxpc3RDb250YWluZXIsIEBpbnB1dF0pLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAwKScpXG5cbiAgcmVzZXQ6IC0+XG4gICAgQGZvY3VzZWQgICA9IG51bGxcbiAgICBAc2Nyb2xsUG9zID0gMFxuICAgICQoW0BsaXN0Q29udGFpbmVyLCBAaW5wdXRdKS5jc3MoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgJytAc2Nyb2xsUG9zKydweCknKVxuICAgIEBsaXN0Q29udGFpbmVyLmlubmVySFRNTCA9ICcnXG5cbiAgYWRkOiAtPlxuICAgIGluZGV4ID0gQGZvY3VzZWQuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JylcbiAgICB0cmFjayA9IEByZXN1bHRzW2luZGV4XVxuICAgIEBqdWtlYm94LmFkZCh0cmFjaykgaWYgdHJhY2tcblxuICAgIEBmb2N1c2VkLmNsYXNzTGlzdC5hZGQoJ2FkZGVkJylcbiAgICAkKEBmb2N1c2VkKS5jc3Moe1xuICAgICAgJ3RyYW5zZm9ybSc6ICdzY2FsZSguNzUpIHRyYW5zbGF0ZVgoJyt3aW5kb3cuaW5uZXJXaWR0aCsncHgpJ1xuICAgIH0pXG5cbiAgICBzZXRUaW1lb3V0KD0+XG4gICAgICBAZm9jdXNlZC5yZW1vdmUoKVxuICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSClcbiAgICAgIEB1cCgpIGlmIEBmb2N1c2VkLm5leHRTaWJsaW5nXG4gICAgICBAZm9jdXMoKVxuICAgICwgNTAwKVxuXG4gIHNlYXJjaDogKHZhbHVlKS0+XG4gICAgcGF0aCA9IHZhbHVlLnNwbGl0KC9cXHMvKVswXVxuICAgIGlmIC9eKHRyYWNrfHRyYWNrc3xwbGF5bGlzdHxwbGF5bGlzdHN8c2V0fHNldHN8dXNlcnx1c2VycykkLy50ZXN0KHBhdGgpXG4gICAgICBsYXN0Q2hhciA9IHBhdGguY2hhckF0KHBhdGgubGVuZ3RoLTEpXG4gICAgICB2YWx1ZSAgICA9IHZhbHVlLnJlcGxhY2UocGF0aCsnICcsICcnKVxuICAgICAgcGF0aCAgICAgKz0gJ3MnIGlmIGxhc3RDaGFyICE9ICdzJ1xuICAgICAgcGF0aCAgICAgPSAncGxheWxpc3RzJyBpZiAvc2V0cy8udGVzdChwYXRoKVxuICAgIGVsc2VcbiAgICAgIHBhdGggICAgID0gJ3RyYWNrcydcblxuICAgIHN0cmluZyA9ICcnJ1xuICAgICAgW1xuICAgICAgICB7XCJraW5kXCI6XCJ0cmFja1wiLFwiaWRcIjo2MzI1NjkwNixcImNyZWF0ZWRfYXRcIjpcIjIwMTIvMTAvMTMgMTA6NDc6MTYgKzAwMDBcIixcInVzZXJfaWRcIjo3ODgyMDUsXCJkdXJhdGlvblwiOjIzNzg0MCxcImNvbW1lbnRhYmxlXCI6dHJ1ZSxcInN0YXRlXCI6XCJmaW5pc2hlZFwiLFwib3JpZ2luYWxfY29udGVudF9zaXplXCI6OTU0MzE2OCxcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTIvMjIgMjE6MDE6MTcgKzAwMDBcIixcInNoYXJpbmdcIjpcInB1YmxpY1wiLFwidGFnX2xpc3RcIjpcIlwiLFwicGVybWFsaW5rXCI6XCJqYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcInN0cmVhbWFibGVcIjp0cnVlLFwiZW1iZWRkYWJsZV9ieVwiOlwiYWxsXCIsXCJkb3dubG9hZGFibGVcIjp0cnVlLFwicHVyY2hhc2VfdXJsXCI6XCJodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9pZFwiOm51bGwsXCJwdXJjaGFzZV90aXRsZVwiOlwiQWx0ZXJuYXRlIFZlcnNpb24gRExcIixcImdlbnJlXCI6XCJQb3Bsb2NraW4gTXVzaWNcIixcInRpdGxlXCI6XCJKYW5ldCBKYWNrc29uIC0gSWYgKEtheXRyYW5hZGEgUmVtaXgpXCIsXCJkZXNjcmlwdGlvblwiOlwiQWx0ZXJuYXRlIFZlcnNpb24sIGZvciBESnMsIHdlbGwsIHRoYXRzIHRoZSB2ZXJzaW9uIGkgdXNlIGZvciBteSBkaiBzZXRzOyBodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9uYW1lXCI6XCJcIixcInJlbGVhc2VcIjpcIlwiLFwidHJhY2tfdHlwZVwiOlwicmVtaXhcIixcImtleV9zaWduYXR1cmVcIjpcIlwiLFwiaXNyY1wiOlwiXCIsXCJ2aWRlb191cmxcIjpudWxsLFwiYnBtXCI6bnVsbCxcInJlbGVhc2VfeWVhclwiOm51bGwsXCJyZWxlYXNlX21vbnRoXCI6bnVsbCxcInJlbGVhc2VfZGF5XCI6bnVsbCxcIm9yaWdpbmFsX2Zvcm1hdFwiOlwibXAzXCIsXCJsaWNlbnNlXCI6XCJhbGwtcmlnaHRzLXJlc2VydmVkXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNlwiLFwidXNlclwiOntcImlkXCI6Nzg4MjA1LFwia2luZFwiOlwidXNlclwiLFwicGVybWFsaW5rXCI6XCJrYXl0cmFuYWRhXCIsXCJ1c2VybmFtZVwiOlwiS0FZVFJBTkFEQVwiLFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMS8wNyAwNDoxMTozNiArMDAwMFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS91c2Vycy83ODgyMDVcIixcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhXCIsXCJhdmF0YXJfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAwNzQ4MDM2OTQtcWlieHQ0LWxhcmdlLmpwZ1wifSxcInVzZXJfcGxheWJhY2tfY291bnRcIjoxLFwidXNlcl9mYXZvcml0ZVwiOnRydWUsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYS9qYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcImFydHdvcmtfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtMDAwMDMyMDk0NTk3LTU2dHM3bi1sYXJnZS5qcGdcIixcIndhdmVmb3JtX3VybFwiOlwiaHR0cHM6Ly93MS5zbmRjZG4uY29tL2FxUkdpNERtYkNXel9tLnBuZ1wiLFwic3RyZWFtX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L3N0cmVhbVwiLFwiZG93bmxvYWRfdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvZG93bmxvYWRcIixcInBsYXliYWNrX2NvdW50XCI6MzMzMTAzMyxcImRvd25sb2FkX2NvdW50XCI6OTYxMTIsXCJmYXZvcml0aW5nc19jb3VudFwiOjY2NjUzLFwiY29tbWVudF9jb3VudFwiOjE1OTQsXCJhdHRhY2htZW50c191cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9hdHRhY2htZW50c1wiLFwicG9saWN5XCI6XCJBTExPV1wifSxcbiAgICAgICAge1wia2luZFwiOlwidHJhY2tcIixcImlkXCI6NjMyNTY5MDYsXCJjcmVhdGVkX2F0XCI6XCIyMDEyLzEwLzEzIDEwOjQ3OjE2ICswMDAwXCIsXCJ1c2VyX2lkXCI6Nzg4MjA1LFwiZHVyYXRpb25cIjoyMzc4NDAsXCJjb21tZW50YWJsZVwiOnRydWUsXCJzdGF0ZVwiOlwiZmluaXNoZWRcIixcIm9yaWdpbmFsX2NvbnRlbnRfc2l6ZVwiOjk1NDMxNjgsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzEyLzIyIDIxOjAxOjE3ICswMDAwXCIsXCJzaGFyaW5nXCI6XCJwdWJsaWNcIixcInRhZ19saXN0XCI6XCJcIixcInBlcm1hbGlua1wiOlwiamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJzdHJlYW1hYmxlXCI6dHJ1ZSxcImVtYmVkZGFibGVfYnlcIjpcImFsbFwiLFwiZG93bmxvYWRhYmxlXCI6dHJ1ZSxcInB1cmNoYXNlX3VybFwiOlwiaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfaWRcIjpudWxsLFwicHVyY2hhc2VfdGl0bGVcIjpcIkFsdGVybmF0ZSBWZXJzaW9uIERMXCIsXCJnZW5yZVwiOlwiUG9wbG9ja2luIE11c2ljXCIsXCJ0aXRsZVwiOlwiSmFuZXQgSmFja3NvbiAtIElmIChLYXl0cmFuYWRhIFJlbWl4KVwiLFwiZGVzY3JpcHRpb25cIjpcIkFsdGVybmF0ZSBWZXJzaW9uLCBmb3IgREpzLCB3ZWxsLCB0aGF0cyB0aGUgdmVyc2lvbiBpIHVzZSBmb3IgbXkgZGogc2V0czsgaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfbmFtZVwiOlwiXCIsXCJyZWxlYXNlXCI6XCJcIixcInRyYWNrX3R5cGVcIjpcInJlbWl4XCIsXCJrZXlfc2lnbmF0dXJlXCI6XCJcIixcImlzcmNcIjpcIlwiLFwidmlkZW9fdXJsXCI6bnVsbCxcImJwbVwiOm51bGwsXCJyZWxlYXNlX3llYXJcIjpudWxsLFwicmVsZWFzZV9tb250aFwiOm51bGwsXCJyZWxlYXNlX2RheVwiOm51bGwsXCJvcmlnaW5hbF9mb3JtYXRcIjpcIm1wM1wiLFwibGljZW5zZVwiOlwiYWxsLXJpZ2h0cy1yZXNlcnZlZFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDZcIixcInVzZXJcIjp7XCJpZFwiOjc4ODIwNSxcImtpbmRcIjpcInVzZXJcIixcInBlcm1hbGlua1wiOlwia2F5dHJhbmFkYVwiLFwidXNlcm5hbWVcIjpcIktBWVRSQU5BREFcIixcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTEvMDcgMDQ6MTE6MzYgKzAwMDBcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdXNlcnMvNzg4MjA1XCIsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYVwiLFwiYXZhdGFyX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2F2YXRhcnMtMDAwMDc0ODAzNjk0LXFpYnh0NC1sYXJnZS5qcGdcIn0sXCJ1c2VyX3BsYXliYWNrX2NvdW50XCI6MSxcInVzZXJfZmF2b3JpdGVcIjp0cnVlLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGEvamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJhcnR3b3JrX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2FydHdvcmtzLTAwMDAzMjA5NDU5Ny01NnRzN24tbGFyZ2UuanBnXCIsXCJ3YXZlZm9ybV91cmxcIjpcImh0dHBzOi8vdzEuc25kY2RuLmNvbS9hcVJHaTREbWJDV3pfbS5wbmdcIixcInN0cmVhbV91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9zdHJlYW1cIixcImRvd25sb2FkX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2Rvd25sb2FkXCIsXCJwbGF5YmFja19jb3VudFwiOjMzMzEwMzMsXCJkb3dubG9hZF9jb3VudFwiOjk2MTEyLFwiZmF2b3JpdGluZ3NfY291bnRcIjo2NjY1MyxcImNvbW1lbnRfY291bnRcIjoxNTk0LFwiYXR0YWNobWVudHNfdXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvYXR0YWNobWVudHNcIixcInBvbGljeVwiOlwiQUxMT1dcIn0sXG4gICAgICAgIHtcImtpbmRcIjpcInRyYWNrXCIsXCJpZFwiOjYzMjU2OTA2LFwiY3JlYXRlZF9hdFwiOlwiMjAxMi8xMC8xMyAxMDo0NzoxNiArMDAwMFwiLFwidXNlcl9pZFwiOjc4ODIwNSxcImR1cmF0aW9uXCI6MjM3ODQwLFwiY29tbWVudGFibGVcIjp0cnVlLFwic3RhdGVcIjpcImZpbmlzaGVkXCIsXCJvcmlnaW5hbF9jb250ZW50X3NpemVcIjo5NTQzMTY4LFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMi8yMiAyMTowMToxNyArMDAwMFwiLFwic2hhcmluZ1wiOlwicHVibGljXCIsXCJ0YWdfbGlzdFwiOlwiXCIsXCJwZXJtYWxpbmtcIjpcImphbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwic3RyZWFtYWJsZVwiOnRydWUsXCJlbWJlZGRhYmxlX2J5XCI6XCJhbGxcIixcImRvd25sb2FkYWJsZVwiOnRydWUsXCJwdXJjaGFzZV91cmxcIjpcImh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX2lkXCI6bnVsbCxcInB1cmNoYXNlX3RpdGxlXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiBETFwiLFwiZ2VucmVcIjpcIlBvcGxvY2tpbiBNdXNpY1wiLFwidGl0bGVcIjpcIkphbmV0IEphY2tzb24gLSBJZiAoS2F5dHJhbmFkYSBSZW1peClcIixcImRlc2NyaXB0aW9uXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiwgZm9yIERKcywgd2VsbCwgdGhhdHMgdGhlIHZlcnNpb24gaSB1c2UgZm9yIG15IGRqIHNldHM7IGh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX25hbWVcIjpcIlwiLFwicmVsZWFzZVwiOlwiXCIsXCJ0cmFja190eXBlXCI6XCJyZW1peFwiLFwia2V5X3NpZ25hdHVyZVwiOlwiXCIsXCJpc3JjXCI6XCJcIixcInZpZGVvX3VybFwiOm51bGwsXCJicG1cIjpudWxsLFwicmVsZWFzZV95ZWFyXCI6bnVsbCxcInJlbGVhc2VfbW9udGhcIjpudWxsLFwicmVsZWFzZV9kYXlcIjpudWxsLFwib3JpZ2luYWxfZm9ybWF0XCI6XCJtcDNcIixcImxpY2Vuc2VcIjpcImFsbC1yaWdodHMtcmVzZXJ2ZWRcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2XCIsXCJ1c2VyXCI6e1wiaWRcIjo3ODgyMDUsXCJraW5kXCI6XCJ1c2VyXCIsXCJwZXJtYWxpbmtcIjpcImtheXRyYW5hZGFcIixcInVzZXJuYW1lXCI6XCJLQVlUUkFOQURBXCIsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzExLzA3IDA0OjExOjM2ICswMDAwXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3VzZXJzLzc4ODIwNVwiLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGFcIixcImF2YXRhcl91cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hdmF0YXJzLTAwMDA3NDgwMzY5NC1xaWJ4dDQtbGFyZ2UuanBnXCJ9LFwidXNlcl9wbGF5YmFja19jb3VudFwiOjEsXCJ1c2VyX2Zhdm9yaXRlXCI6dHJ1ZSxcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhL2phbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwiYXJ0d29ya191cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hcnR3b3Jrcy0wMDAwMzIwOTQ1OTctNTZ0czduLWxhcmdlLmpwZ1wiLFwid2F2ZWZvcm1fdXJsXCI6XCJodHRwczovL3cxLnNuZGNkbi5jb20vYXFSR2k0RG1iQ1d6X20ucG5nXCIsXCJzdHJlYW1fdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvc3RyZWFtXCIsXCJkb3dubG9hZF91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9kb3dubG9hZFwiLFwicGxheWJhY2tfY291bnRcIjozMzMxMDMzLFwiZG93bmxvYWRfY291bnRcIjo5NjExMixcImZhdm9yaXRpbmdzX2NvdW50XCI6NjY2NTMsXCJjb21tZW50X2NvdW50XCI6MTU5NCxcImF0dGFjaG1lbnRzX3VyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2F0dGFjaG1lbnRzXCIsXCJwb2xpY3lcIjpcIkFMTE9XXCJ9LFxuICAgICAgICB7XCJraW5kXCI6XCJ0cmFja1wiLFwiaWRcIjo2MzI1NjkwNixcImNyZWF0ZWRfYXRcIjpcIjIwMTIvMTAvMTMgMTA6NDc6MTYgKzAwMDBcIixcInVzZXJfaWRcIjo3ODgyMDUsXCJkdXJhdGlvblwiOjIzNzg0MCxcImNvbW1lbnRhYmxlXCI6dHJ1ZSxcInN0YXRlXCI6XCJmaW5pc2hlZFwiLFwib3JpZ2luYWxfY29udGVudF9zaXplXCI6OTU0MzE2OCxcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTIvMjIgMjE6MDE6MTcgKzAwMDBcIixcInNoYXJpbmdcIjpcInB1YmxpY1wiLFwidGFnX2xpc3RcIjpcIlwiLFwicGVybWFsaW5rXCI6XCJqYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcInN0cmVhbWFibGVcIjp0cnVlLFwiZW1iZWRkYWJsZV9ieVwiOlwiYWxsXCIsXCJkb3dubG9hZGFibGVcIjp0cnVlLFwicHVyY2hhc2VfdXJsXCI6XCJodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9pZFwiOm51bGwsXCJwdXJjaGFzZV90aXRsZVwiOlwiQWx0ZXJuYXRlIFZlcnNpb24gRExcIixcImdlbnJlXCI6XCJQb3Bsb2NraW4gTXVzaWNcIixcInRpdGxlXCI6XCJKYW5ldCBKYWNrc29uIC0gSWYgKEtheXRyYW5hZGEgUmVtaXgpXCIsXCJkZXNjcmlwdGlvblwiOlwiQWx0ZXJuYXRlIFZlcnNpb24sIGZvciBESnMsIHdlbGwsIHRoYXRzIHRoZSB2ZXJzaW9uIGkgdXNlIGZvciBteSBkaiBzZXRzOyBodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9uYW1lXCI6XCJcIixcInJlbGVhc2VcIjpcIlwiLFwidHJhY2tfdHlwZVwiOlwicmVtaXhcIixcImtleV9zaWduYXR1cmVcIjpcIlwiLFwiaXNyY1wiOlwiXCIsXCJ2aWRlb191cmxcIjpudWxsLFwiYnBtXCI6bnVsbCxcInJlbGVhc2VfeWVhclwiOm51bGwsXCJyZWxlYXNlX21vbnRoXCI6bnVsbCxcInJlbGVhc2VfZGF5XCI6bnVsbCxcIm9yaWdpbmFsX2Zvcm1hdFwiOlwibXAzXCIsXCJsaWNlbnNlXCI6XCJhbGwtcmlnaHRzLXJlc2VydmVkXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNlwiLFwidXNlclwiOntcImlkXCI6Nzg4MjA1LFwia2luZFwiOlwidXNlclwiLFwicGVybWFsaW5rXCI6XCJrYXl0cmFuYWRhXCIsXCJ1c2VybmFtZVwiOlwiS0FZVFJBTkFEQVwiLFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMS8wNyAwNDoxMTozNiArMDAwMFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS91c2Vycy83ODgyMDVcIixcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhXCIsXCJhdmF0YXJfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAwNzQ4MDM2OTQtcWlieHQ0LWxhcmdlLmpwZ1wifSxcInVzZXJfcGxheWJhY2tfY291bnRcIjoxLFwidXNlcl9mYXZvcml0ZVwiOnRydWUsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYS9qYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcImFydHdvcmtfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtMDAwMDMyMDk0NTk3LTU2dHM3bi1sYXJnZS5qcGdcIixcIndhdmVmb3JtX3VybFwiOlwiaHR0cHM6Ly93MS5zbmRjZG4uY29tL2FxUkdpNERtYkNXel9tLnBuZ1wiLFwic3RyZWFtX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L3N0cmVhbVwiLFwiZG93bmxvYWRfdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvZG93bmxvYWRcIixcInBsYXliYWNrX2NvdW50XCI6MzMzMTAzMyxcImRvd25sb2FkX2NvdW50XCI6OTYxMTIsXCJmYXZvcml0aW5nc19jb3VudFwiOjY2NjUzLFwiY29tbWVudF9jb3VudFwiOjE1OTQsXCJhdHRhY2htZW50c191cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9hdHRhY2htZW50c1wiLFwicG9saWN5XCI6XCJBTExPV1wifVxuICAgICAgXVxuICAgICcnJ1xuXG4gICAgcmVzdWx0cyA9IEpTT04ucGFyc2Uoc3RyaW5nKVxuXG4gICAgQGlucHV0LnZhbHVlID0gJ0xvb2tpbmcgZm9yIFwiJyt2YWx1ZSsnXCInXG4gICAgQFNDLnNlYXJjaCh2YWx1ZSwgcGF0aCwgKHJlc3VsdHMpPT5cbiAgICAgIGNvbnNvbGUubG9nIHJlc3VsdHNcbiAgICAgIGlmIHJlc3VsdHMubGVuZ3RoID09IDBcbiAgICAgICAgQGlucHV0LnZhbHVlID0gJ1wiJyt2YWx1ZSsnXCIgaGFzIG5vIHJlc3VsdCdcbiAgICAgICAgcmV0dXJuXG4gICAgICBlbHNlXG4gICAgICAgIEBpbnB1dC52YWx1ZSA9ICdSZXN1bHRzIGZvciBcIicrdmFsdWUrJ1wiJ1xuXG4gICAgICBAcmVzdWx0cyAgICAgPSBbXVxuICAgICAgQGxpc3RDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSlcbiAgICAgIGZvciB0cmFjaywgaSBpbiByZXN1bHRzXG4gICAgICAgIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgICAgICBsaS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBpKVxuXG4gICAgICAgIGFydHdvcmtfdXJsID0gdHJhY2suYXJ0d29ya191cmxcbiAgICAgICAgYXJ0d29ya191cmwgPSAnaW1hZ2VzL25vX2FydHdvcmsuZ2lmJyB1bmxlc3MgYXJ0d29ya191cmxcbiAgICAgICAgbGkuaW5uZXJIVE1MID0gXCJcIlwiXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiI3thcnR3b3JrX3VybH1cIiBhbHQ9XCJcIiBvbmVycm9yPVwidGhpcy5zcmM9J2ltYWdlcy9ub19hcnR3b3JrLmdpZidcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxwPiN7dHJhY2sudGl0bGV9PC9wPlxuICAgICAgICAgICAgICA8cD4je3RyYWNrLnVzZXIudXNlcm5hbWUudG9Mb3dlckNhc2UoKX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgXCJcIlwiXG4gICAgICAgIEByZXN1bHRzLnB1c2godHJhY2spXG4gICAgICAgIEBsaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKGxpKVxuICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSClcbiAgICApXG5cblxuY2xhc3MgU1BBQ0UuSnVrZWJveFxuXG4gICMgU3RhdGVzXG4gIEBJU19XQUlUSU5HOiAgICdqdWtlYm94X2lzX3dhaXRpbmcnXG4gIEBJU19RVUVVSU5HOiAgICdqdWtlYm94X2lzX3F1ZXVpbmcnXG5cbiAgIyBQcm9wZXJ0aWVzXG4gIGN1cnJlbnQ6ICAgICAgbnVsbFxuICBwbGF5bGlzdDogICAgIG51bGxcbiAgIyBzZWFyY2hFbmdpbmU6IG51bGxcbiAgU0M6ICAgICAgICAgICBudWxsXG5cbiAgc3RhdGU6ICAgICBudWxsXG5cbiAgX25leHREZWxheTogMTAwXG4gIF9uZXh0VGltZW91dDogbnVsbFxuICBfcmVmcmVzaERlbGF5OiAxMDAwXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHBsYXlsaXN0ICAgICA9IFtdXG4gICAgIyBAc2VhcmNoRW5naW5lID0gbmV3IFNQQUNFLlNlYXJjaEVuZ2luZSgpXG4gICAgQFNDICAgICAgICAgICA9IFNQQUNFLlNDXG5cbiAgICBAaW5wdXRUeXBlICAgID0gJ1dlYkF1ZGlvQVBJJ1xuXG4gICAgQHNldFN0YXRlKFNQQUNFLkp1a2Vib3guSVNfV0FJVElORylcbiAgICBAX3JlZnJlc2goKVxuICAgIEBfZXZlbnRzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoU1BBQ0UuVHJhY2suSVNfU1RPUFBFRCwgQF9lVHJhY2tJc1N0b3BwZWQpXG5cbiAgX2VUcmFja0lzU3RvcHBlZDogPT5cbiAgICBAc2V0U3RhdGUoU1BBQ0UuSnVrZWJveC5JU19XQUlUSU5HKVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIHN3aXRjaCBAc3RhdGVcbiAgICAgIHdoZW4gU1BBQ0UuSnVrZWJveC5JU19XQUlUSU5HXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLkp1a2Vib3guSVNfV0FJVElORywgeyBqdWtlYm94OiB0aGlzIH0pXG4gICAgICB3aGVuIFNQQUNFLkp1a2Vib3guSVNfUVVFVUlOR1xuICAgICAgICBIRUxQRVIudHJpZ2dlcihTUEFDRS5KdWtlYm94LklTX1FVRVVJTkcsIHsganVrZWJveDogdGhpcyB9KVxuXG4gIF9jcmVhdGVUcmFjazogKGRhdGEsIGlucHV0TW9kZT1mYWxzZSktPlxuICAgIHRyYWNrICAgICAgICAgICA9IG5ldyBTUEFDRS5UcmFjaygpXG4gICAgdHJhY2suaW5wdXRNb2RlID0gaW5wdXRNb2RlXG4gICAgdHJhY2suc2V0RGF0YShkYXRhKVxuICAgIEBwbGF5bGlzdC5wdXNoKHRyYWNrKVxuXG4gIF9yZWZyZXNoOiA9PlxuICAgIGlmIEBwbGF5bGlzdC5sZW5ndGggPiAwIGFuZCBAc3RhdGUgPT0gU1BBQ0UuSnVrZWJveC5JU19XQUlUSU5HXG4gICAgICBAbmV4dCgpXG5cbiAgICBzZXRUaW1lb3V0KEBfcmVmcmVzaCwgQF9yZWZyZXNoRGVsYXkpXG5cbiAgYWRkOiAodXJsT3JJbnB1dCktPlxuICAgIGlmIHR5cGVvZiB1cmxPcklucHV0ID09ICdib29sZWFuJyBhbmQgdXJsT3JJbnB1dFxuICAgICAgQF9jcmVhdGVUcmFjayh7fSwgdHJ1ZSkgXG4gICAgICByZXR1cm5cblxuICAgIEBTQy5nZXRTb3VuZE9yUGxheWxpc3QgdXJsT3JJbnB1dCwgKG8pPT5cbiAgICAgIHRyYWNrcyA9IG51bGxcbiAgICAgIGlmIG8uaGFzT3duUHJvcGVydHkoJ3RyYWNrcycpXG4gICAgICAgIHRyYWNrcyA9IG8udHJhY2tzXG4gICAgICBlbHNlXG4gICAgICAgIHRyYWNrcyA9IFtvXVxuXG4gICAgICBmb3IgZGF0YSBpbiB0cmFja3NcbiAgICAgICAgQF9jcmVhdGVUcmFjayhkYXRhLCBmYWxzZSlcblxuICByZW1vdmU6IChpbmRleCktPlxuICAgIHJldHVybiBpZiBAaW5wdXRUeXBlID09ICdNaWNyb3Bob25lJ1xuICAgIEBwbGF5bGlzdC5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgbW92ZTogKGluZGV4MSwgaW5kZXgyKS0+XG4gICAgcmV0dXJuIGlmIEBpbnB1dFR5cGUgPT0gJ01pY3JvcGhvbmUnXG5cbiAgICB0bXAgICAgICAgICAgICAgICA9IEBwbGF5bGlzdFtpbmRleDFdXG4gICAgQHBsYXlsaXN0W2luZGV4MV0gPSBAcGxheWxpc3RbaW5kZXgyXVxuICAgIEBwbGF5bGlzdFtpbmRleDJdID0gdG1wXG5cbiAgc2VhcmNoOiAodmFsdWUpLT5cbiAgICByZXR1cm4gaWYgQGlucHV0VHlwZSA9PSAnTWljcm9waG9uZSdcbiAgICBAc2VhcmNoRW5naW5lLnNlYXJjaCh2YWx1ZSlcblxuICBuZXh0OiAtPlxuICAgIHJldHVybiBpZiBAaW5wdXRUeXBlID09ICdNaWNyb3Bob25lJ1xuXG4gICAgY2xlYXJUaW1lb3V0KEBfbmV4dFRpbWVvdXQpIGlmIEBfbmV4dFRpbWVvdXQgXG5cbiAgICBAc2V0U3RhdGUoU1BBQ0UuSnVrZWJveC5JU19RVUVVSU5HKVxuICAgIEBfbmV4dFRpbWVvdXQgPSBzZXRUaW1lb3V0ID0+XG4gICAgICBAY3VycmVudC5zdG9wKCkgaWYgQGN1cnJlbnRcbiAgICAgIGlmIEBwbGF5bGlzdC5sZW5ndGggPiAwXG4gICAgICAgIEBjdXJyZW50ID0gQHBsYXlsaXN0LnNoaWZ0KClcbiAgICAgICAgQGN1cnJlbnQubG9hZCgpXG4gICAgLCBAX25leHREZWxheVxuXG5cbmNsYXNzIFNQQUNFLlRyYWNrXG5cbiAgIyBTVEFURVNcbiAgQElTX1dBSVRJTkc6ICd0cmFja19pc193YWl0aW5nJ1xuICBAV0lMTF9QTEFZOiAgJ3RyYWNrX3dpbGxfcGxheSdcbiAgQElTX1BMQVlJTkc6ICd0cmFja19pc19wbGF5aW5nJ1xuICBASVNfUEFVU0VEOiAgJ3RyYWNrX2lzX3BhdXNlZCdcbiAgQElTX1NUT1BQRUQ6ICd0cmFja19pc19zdG9wcGVkJ1xuXG4gIEBBUElUeXBlOlxuICAgIFNvdW5kTWFuYWdlcjI6ICdTb3VuZE1hbmFnZXIyJ1xuICAgIFdlYkF1ZGlvQVBJOiAgICdXZWJBdWRpb0FQSSdcbiAgICBKU09OOiAgICAgICAgICAnSlNPTidcblxuICAjIFByb3BlcnRpZXNcbiAgX1NDOiAgICAgIG51bGxcbiAgX2RhdGE6ICAgIG51bGxcbiAgX0FQSVR5cGU6IG51bGxcbiAgX0FQSTogICAgIG51bGxcblxuICB0aW1lZGF0YTogbnVsbFxuXG4gIGF1dG9wbGF5OiB0cnVlXG4gIHN0YXRlOiAgICBudWxsXG5cbiAgbG9hZGluZ3Byb2dyZXNzaW9uOiAwXG4gIGlucHV0TW9kZTogICAgICAgICAgZmFsc2VcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAX1NDICAgICAgPSBTUEFDRS5TQ1xuICAgIEBfQVBJVHlwZSA9IFNQQUNFLlRyYWNrLkFQSVR5cGUuV2ViQXVkaW9BUElcbiAgICBAX3Jlc2V0VGltZWRhdGEoKVxuICAgIEBzZXRTdGF0ZShTUEFDRS5UcmFjay5JU19XQUlUSU5HKVxuXG4gICNcbiAgIyBTZXR0ZXJzXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgc2V0RGF0YTogKGRhdGEpLT5cbiAgICBAX2RhdGEgPSBkYXRhXG5cbiAgc2V0U3RhdGU6IChzdGF0ZSktPlxuICAgIEBzdGF0ZSA9IHN0YXRlXG4gICAgc3dpdGNoIEBzdGF0ZVxuICAgICAgd2hlbiBTUEFDRS5UcmFjay5JU19XQUlUSU5HXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLlRyYWNrLklTX1dBSVRJTkcsIHsgdHJhY2s6IHRoaXMgfSlcbiAgICAgIHdoZW4gU1BBQ0UuVHJhY2suV0lMTF9QTEFZXG4gICAgICAgIEBfcmVzZXRUaW1lZGF0YSgpXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLlRyYWNrLldJTExfUExBWSwgeyB0cmFjazogdGhpcyB9KVxuICAgICAgd2hlbiBTUEFDRS5UcmFjay5JU19QTEFZSU5HXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLlRyYWNrLklTX1BMQVlJTkcsIHsgdHJhY2s6IHRoaXMgfSlcbiAgICAgIHdoZW4gU1BBQ0UuVHJhY2suSVNfUEFVU0VEXG4gICAgICAgIEBfcmVzZXRUaW1lZGF0YSgpXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLlRyYWNrLklTX1BBVVNFRCwgeyB0cmFjazogdGhpcyB9KVxuICAgICAgd2hlbiBTUEFDRS5UcmFjay5JU19TVE9QUEVEXG4gICAgICAgIEBfcmVzZXRUaW1lZGF0YSgpXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLlRyYWNrLklTX1NUT1BQRUQsIHsgdHJhY2s6IHRoaXMgfSlcblxuICAjXG4gICMgUHVibGljIG1ldGhvZHNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBsb2FkOiAtPlxuICAgIEBzZXRTdGF0ZShTUEFDRS5UcmFjay5XSUxMX1BMQVkpXG5cbiAgICBpZiBAaW5wdXRNb2RlXG4gICAgICBAX3dlYmF1ZGlvYXBpKClcbiAgICBlbHNlIGlmIEBfQVBJVHlwZSA9PSAnV2ViQXVkaW9BUEknXG4gICAgICBAX1NDLmdldFNvdW5kVXJsKCcvdHJhY2tzLycrQF9kYXRhLmlkLCBAX3dlYmF1ZGlvYXBpKVxuICAgIGVsc2VcbiAgICAgIEBfc291bmRtYW5hZ2VyMigpXG5cbiAgcGxheTogLT5cbiAgICBAX0FQSS5wbGF5KClcblxuICBwYXVzZTogLT5cbiAgICBAX0FQSS5wYXVzZSgpXG5cbiAgc3RvcDogLT5cbiAgICBAX0FQSS5zdG9wKClcblxuICB2b2x1bWU6ICh2YWx1ZSktPlxuICAgIEBfQVBJLnZvbHVtZSh2YWx1ZSlcblxuICBkZXN0cm95OiAtPlxuICAgIHN3aXRjaCBAX0FQSVR5cGVcbiAgICAgIHdoZW4gU1BBQ0UuVHJhY2suQVBJVHlwZS5Tb3VuZE1hbmFnZXIyXG4gICAgICAgIEBfQVBJLmRlc3RydWN0KClcbiAgICAgIHdoZW4gU1BBQ0UuVHJhY2suQVBJVHlwZS5XZWJBdWRpb0FQSVxuICAgICAgICBAX0FQSS5kZXN0cm95KClcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2coJ3NvbWV0aGluZyB0byBkZXN0cm95IGhlcmUnKVxuXG4gICNcbiAgIyBQcml2YXRlIG1ldGhvZHNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBfb25zdGFydDogKGFwaSk9PlxuICAgIEBfQVBJICAgICAgICAgICA9IGFwaVxuICAgIHdpbmRvdy5BdWRpb0FQSSA9IGFwaVxuXG4gIF9vbnBsYXk6ID0+XG4gICAgQHNldFN0YXRlKFNQQUNFLlRyYWNrLklTX1BMQVlJTkcpXG5cbiAgX29ucGF1c2U6ID0+XG4gICAgQHNldFN0YXRlKFNQQUNFLlRyYWNrLklTX1BBVVNFRClcblxuICBfb25zdG9wOiA9PlxuICAgIEBzZXRTdGF0ZShTUEFDRS5UcmFjay5JU19TVE9QUEVEKVxuXG4gIF9vbmVuZGVkOiA9PlxuICAgIEBzZXRTdGF0ZShTUEFDRS5UcmFjay5JU19TVE9QUEVEKVxuXG4gIF9vbmxvYWRpbmdwcm9ncmVzczogKHZhbHVlKT0+XG4gICAgQGxvYWRpbmdwcm9ncmVzc2lvbiA9IHZhbHVlXG5cbiAgX3doaWxlcGxheWluZzogPT5cbiAgICBzd2l0Y2ggQF9BUElUeXBlXG4gICAgICB3aGVuIFNQQUNFLlRyYWNrLkFQSVR5cGUuU291bmRNYW5hZ2VyMlxuICAgICAgICBmb3IgaSBpbiBbMC4uMjU1XVxuICAgICAgICAgIEB0aW1lZGF0YVtpXSA9IE1hdGgubWF4KEBzb3VuZC53YXZlZm9ybURhdGEubGVmdFtpXSwgQHNvdW5kLndhdmVmb3JtRGF0YS5yaWdodFtpXSlcbiAgICAgIFxuICAgICAgd2hlbiBTUEFDRS5UcmFjay5BUElUeXBlLldlYkF1ZGlvQVBJXG4gICAgICAgIGFuYWx5c2VyID0gQF9BUEkuYW5hbHlzZXJcbiAgICAgICAgdW5sZXNzIGFuYWx5c2VyLmdldEZsb2F0VGltZURvbWFpbkRhdGFcbiAgICAgICAgICBhcnJheSAgICA9ICBuZXcgVWludDhBcnJheShhbmFseXNlci5mZnRTaXplKVxuICAgICAgICAgIGFuYWx5c2VyLmdldEJ5dGVUaW1lRG9tYWluRGF0YShhcnJheSlcbiAgICAgICAgICBmb3IgaSBpbiBbMC4uMjU1XVxuICAgICAgICAgICAgQHRpbWVkYXRhW2ldID0gKGFycmF5W2ldIC0gMTI4KSAvIDEyOFxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXJyYXkgICAgPSAgbmV3IEZsb2F0MzJBcnJheShhbmFseXNlci5mZnRTaXplKVxuICAgICAgICAgIGFuYWx5c2VyLmdldEZsb2F0VGltZURvbWFpbkRhdGEoYXJyYXkpXG4gICAgICAgICAgZm9yIGkgaW4gWzAuLjI1NV1cbiAgICAgICAgICAgIEB0aW1lZGF0YVtpXSA9IGFycmF5W2ldXG5cbiAgX3dlYmF1ZGlvYXBpOiAodXJsKT0+XG4gICAgdW5sZXNzIHdpbmRvdy5maXJzdExhdW5jaFxuICAgICAgZmlyc3RMYXVuY2ggPSBmYWxzZVxuICAgICAgQGF1dG9wbGF5ICAgPSBmYWxzZSBpZiAvbW9iaWxlL2dpLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudClcbiAgICBlbHNlIFxuICAgICAgQGF1dG9wbGF5ID0gdHJ1ZSAgXG5cbiAgICBAX0FQSSAgICAgICAgICAgICAgICAgICA9IFdlYkF1ZGlvQVBJXG4gICAgQF9BUEkub25wbGF5ICAgICAgICAgICAgPSBAX29ucGxheVxuICAgIEBfQVBJLm9uZW5kZWQgICAgICAgICAgID0gQF9vbmVuZGVkXG4gICAgQF9BUEkub25wYXVzZSAgICAgICAgICAgPSBAX29ucGF1c2VcbiAgICBAX0FQSS5vbnN0b3AgICAgICAgICAgICA9IEBfb25zdG9wXG4gICAgQF9BUEkub25hdWRpb3Byb2Nlc3MgICAgPSBAX3doaWxlcGxheWluZ1xuICAgIEBfQVBJLm9ubG9hZGluZ3Byb2dyZXNzID0gQF9vbmxvYWRpbmdwcm9ncmVzc1xuICAgIFxuICAgIGlmIEBpbnB1dE1vZGVcbiAgICAgIEBfQVBJLmlucHV0TW9kZSA9IHRydWUgXG4gICAgICBAX0FQSS5zdHJlYW1JbnB1dCgpXG4gICAgZWxzZVxuICAgICAgQF9BUEkuaW5wdXRNb2RlID0gZmFsc2UgXG4gICAgICBAX0FQSS5zZXRVcmwodXJsLCBAYXV0b3BsYXksIEBfb25zdGFydCkgICAgXG5cbiAgX3NvdW5kbWFuYWdlcjI6IC0+XG4gICAgQF9TQy5zdHJlYW1Tb3VuZChAX2RhdGEsIHtcbiAgICAgIG9ucGxheSAgICAgICA6IEBfb25wbGF5XG4gICAgICBvbmZpbmlzaCAgICAgOiBAX29uZW5kZWRcbiAgICAgIG9uc3RvcCAgICAgICA6IEBfb25zdG9wXG4gICAgICB3aGlsZXBsYXlpbmcgOiBAX3doaWxlcGxheWluZ1xuICAgICAgd2hpbGVsb2FkaW5nIDogPT5cbiAgICAgICAgQF9vbmxvYWRpbmdwcm9ncmVzcyhAX0FQSS5ieXRlc0xvYWRlZCAvIEBfQVBJLmJ5dGVzVG90YWwpXG4gICAgfSwgQF9vbnN0YXJ0KVxuXG4gIF9yZXNldFRpbWVkYXRhOiAtPlxuICAgIEB0aW1lZGF0YSA9IEFycmF5KDI1NilcbiAgICBmb3IgaSBpbiBbMC4uMjU1XVxuICAgICAgQHRpbWVkYXRhW2ldID0gMFxuXG5cbmNsYXNzIFdlYkF1ZGlvQVBJXG5cbiAgIyBTdGF0ZVxuICBASVNfUExBWUlORzogJ3dlYmF1ZGlvYXBpX2lzX3BsYXlpbmcnXG4gIEBJU19QQVVTRUQ6ICAnd2ViYXVkaW9hcGlfaXNfcGF1c2VkJ1xuICBASVNfU1RPUFBFRDogJ3dlYmF1ZGlvYXBpX2lzX3N0b3BwZWQnXG4gIEBJU19FTkRFRDogICAnd2ViYXVkaW9hcGlfaXNfZW5kZWQnXG5cbiAgIyBQcm9wZXJ0aWVzXG4gIGlkZW50aWZpZXI6ICdXZWJBdWRpb0FQSSdcblxuICBjdHg6ICAgICAgIG51bGxcbiAgYW5hbHlzZXI6ICBudWxsXG4gIHByb2Nlc3NvcjogbnVsbFxuICBidWZmZXI6ICAgIG51bGxcbiAgc3JjOiAgICAgICBudWxsXG5cbiAgc3RhcnRUaW1lOiAwXG4gIHBvc2l0aW9uOiAgMFxuICBkdXJhdGlvbjogIDBcblxuICB0aW1lOiAwXG5cbiAgaXNMb2FkZWQ6IGZhbHNlXG5cbiAgc3RhdGU6IG51bGxcblxuICBfdmVuZG9yVVJMOiBudWxsXG4gIF9pbnB1dE1vZGU6ICAgZmFsc2VcblxuICAjIyBTZXR1cCBXZWIgQXVkaW8gQVBJXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgICMgU2V0dXAgQXVkaW9Db250ZXh0XG4gICAgdHJ5XG4gICAgICBpZiAod2luZG93LkF1ZGlvQ29udGV4dE9iamVjdCA9PSB1bmRlZmluZWQpXG4gICAgICAgIHdpbmRvdy5BdWRpb0NvbnRleHRPYmplY3QgPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHR8fHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKClcbiAgICBjYXRjaCBlXG4gICAgICBpZiAoQXBwLmVudiA9PSAnZGV2ZWxvcG1lbnQnKVxuICAgICAgICBjb25zb2xlLmxvZyhcIkhUTUw1IFdlYiBBdWRpbyBBUEkgbm90IHN1cHBvcnRlZC4gU3dpdGNoIHRvIFNvdW5kTWFuYWdlcjIuXCIpXG5cbiAgICBAY3R4ID0gQXVkaW9Db250ZXh0T2JqZWN0XG4gICAgQF9vbGRCcm93c2VyKClcblxuICAgICMgU2V0dXAgVXNlck1lZGlhXG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhICAgIG9yIG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgb3IgXG4gICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIG9yIG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYVxuICAgIEBfdmVuZG9yVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMXG5cbiAgICAjIFNldCBkZWZhdWx0IHN0YXRlXG4gICAgQHNldFN0YXRlKFdlYkF1ZGlvQVBJLklTX0VOREVEKVxuXG4gIHNldFVybDogKHVybCwgYXV0b3BsYXk9ZmFsc2UsIGNhbGxiYWNrKS0+XG4gICAgaWYgQGlucHV0TW9kZVxuICAgICAgYWxlcnQoJ0Rpc2FibGUgaW5wdXQgbW9kZScpXG4gICAgICByZXR1cm5cblxuICAgIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKVxuICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlICAgID0gJ2FycmF5YnVmZmVyJ1xuICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gZmFsc2VcbiAgICByZXF1ZXN0Lm9ubG9hZCA9ID0+XG4gICAgICBAY3R4LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCAoYnVmZmVyKT0+XG4gICAgICAgIEBpc0xvYWRlZCA9IHRydWVcbiAgICAgICAgQGJ1ZmZlciA9IGJ1ZmZlclxuICAgICAgICBjYWxsYmFjayh0aGlzKSBpZiBjYWxsYmFja1xuICAgICAgICBAcGxheSgpIGlmIGF1dG9wbGF5XG4gICAgICAsIEBfb25FcnJvcilcbiAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSAoZSk9PlxuICAgICAgaWYgZS5sZW5ndGhDb21wdXRhYmxlXG4gICAgICAgIEBvbmxvYWRpbmdwcm9ncmVzcyhlLmxvYWRlZCAvIGUudG90YWwpIGlmIEBvbmxvYWRpbmdwcm9ncmVzcyBcbiAgICByZXF1ZXN0LnNlbmQoKVxuXG4gIHN0cmVhbUlucHV0OiAtPlxuICAgIHVubGVzcyBAaW5wdXRNb2RlXG4gICAgICBhbGVydCgnRW5hYmxlIGlucHV0IG1vZGUnKVxuICAgICAgcmV0dXJuXG5cbiAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHsgdmlkZW86IGZhbHNlLCBhdWRpbzogdHJ1ZSB9LCAoc3RyZWFtKT0+XG4gICAgICBAaXNMb2FkZWQgICAgID0gdHJ1ZVxuICAgICAgQF9sb2NhbHN0cmVhbSA9IHN0cmVhbVxuICAgICAgQHBsYXkoKVxuICAgICwgQF9vbkVycm9yKVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuXG4gIF9vbkVycm9yOiAoZSktPlxuICAgIGNvbnNvbGUubG9nICdFUlJPUicsIGVcblxuICBwYXVzZTogLT5cbiAgICBpZiBAaW5wdXRNb2RlXG4gICAgICBAc3RvcCgpXG4gICAgZWxzZSBpZiBAc3JjXG4gICAgICBAc3JjLnN0b3AoMClcbiAgICAgIEBzcmMgICAgICAgPSBudWxsXG4gICAgICBAcHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gbnVsbFxuICAgICAgQHBvc2l0aW9uICA9IEBjdHguY3VycmVudFRpbWUgLSBAc3RhcnRUaW1lXG4gICAgICBAc2V0U3RhdGUoV2ViQXVkaW9BUEkuSVNfUEFVU0VEKVxuICAgICAgQG9ucGF1c2UoKSBpZiBAb25wYXVzZVxuXG4gIHBsYXk6IChwb3NpdGlvbiktPlxuICAgIHJldHVybiB1bmxlc3MgQGlzTG9hZGVkXG4gICAgaWYgQHN0YXRlID09IFdlYkF1ZGlvQVBJLklTX1BMQVlJTkdcbiAgICAgIEBwYXVzZSgpXG4gICAgICByZXR1cm5cblxuICAgIEBfY29ubmVjdCgpXG5cbiAgICB1bmxlc3MgQGlucHV0TW9kZVxuICAgICAgQHBvc2l0aW9uICA9IGlmIHR5cGVvZiBwb3NpdGlvbiA9PSAnbnVtYmVyJyB0aGVuIHBvc2l0aW9uIGVsc2UgQHBvc2l0aW9uIG9yIDBcbiAgICAgIEBzdGFydFRpbWUgPSBAY3R4LmN1cnJlbnRUaW1lIC0gKEBwb3NpdGlvbiBvciAwKVxuICAgICAgQHNyYy5zdGFydChAY3R4LmN1cnJlbnRUaW1lLCBAcG9zaXRpb24pXG5cbiAgICBAc2V0U3RhdGUoV2ViQXVkaW9BUEkuSVNfUExBWUlORylcbiAgICBAb25wbGF5KCkgaWYgQG9ucGxheVxuXG4gIHN0b3A6IC0+XG4gICAgaWYgQHNyY1xuICAgICAgaWYgQGlucHV0TW9kZVxuICAgICAgICBAc3JjLm1lZGlhU3RyZWFtLnN0b3AoKVxuICAgICAgICBAaXNMb2FkZWQgICAgPSBmYWxzZVxuICAgICAgICBAbG9jYWxzdHJlYW0gPSBudWxsXG4gICAgICBlbHNlXG4gICAgICAgIEBzcmMuc3RvcCgwKVxuICAgICAgQHNyYyAgICAgICA9IG51bGxcbiAgICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBudWxsXG4gICAgICBAcG9zaXRpb24gID0gMFxuICAgICAgQHN0YXJ0VGltZSA9IDBcbiAgICAgIEBzZXRTdGF0ZShXZWJBdWRpb0FQSS5JU19TVE9QUEVEKVxuICAgICAgQG9uc3RvcCgpIGlmIEBvbnN0b3BcblxuICB2b2x1bWU6ICh2b2x1bWUpLT5cbiAgICB2b2x1bWUgPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCB2b2x1bWUpKVxuICAgIEBnYWluTm9kZS5nYWluLnZhbHVlID0gdm9sdW1lXG5cbiAgdXBkYXRlUG9zaXRpb246IC0+XG4gICAgaWYgQHN0YXRlID09IFdlYkF1ZGlvQVBJLklTX1BMQVlJTkdcbiAgICAgIEBwb3NpdGlvbiA9IEBjdHguY3VycmVudFRpbWUgLSBAc3RhcnRUaW1lXG5cbiAgICBpZiBAcG9zaXRpb24gPiBAYnVmZmVyLmR1cmF0aW9uXG4gICAgICBAcG9zaXRpb24gPSBAYnVmZmVyLmR1cmF0aW9uXG4gICAgICBAcGF1c2UoKVxuXG4gICAgcmV0dXJuIEBwb3NpdGlvblxuXG4gIHNlZWs6ICh0aW1lKS0+XG4gICAgaWYgQHN0YXRlID09IFdlYkF1ZGlvQVBJLklTX1BMQVlJTkdcbiAgICAgIEBwbGF5KHRpbWUpXG4gICAgZWxzZVxuICAgICAgQHBvc2l0aW9uID0gdGltZVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHN0b3AoKVxuICAgIEBfZGlzY29ubmVjdCgpXG4gICAgQGN0eCA9IG51bGxcblxuICBfY29ubmVjdDogLT5cbiAgICBpZiBAaW5wdXRNb2RlIGFuZCBAX2xvY2Fsc3RyZWFtXG4gICAgICAjIFNldHVwIGF1ZGlvIHNvdXJjZVxuICAgICAgQHNyYyA9IEBjdHguY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2UoQF9sb2NhbHN0cmVhbSlcbiAgICBlbHNlXG4gICAgICAjIFNldHVwIGJ1ZmZlciBzb3VyY2VcbiAgICAgIEBzcmMgICAgICAgICAgICAgICAgID0gQGN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxuICAgICAgQHNyYy5idWZmZXIgICAgICAgICAgPSBAYnVmZmVyXG4gICAgICBAc3JjLm9uZW5kZWQgICAgICAgICA9IEBfb25FbmRlZFxuICAgICAgQGR1cmF0aW9uICAgICAgICAgICAgPSBAYnVmZmVyLmR1cmF0aW9uXG5cbiAgICAjIFNldHVwIGFuYWx5c2VyXG4gICAgQGFuYWx5c2VyID0gQGN0eC5jcmVhdGVBbmFseXNlcigpXG4gICAgQGFuYWx5c2VyLnNtb290aGluZ1RpbWVDb25zdGFudCA9IDAuOFxuICAgIEBhbmFseXNlci5taW5EZWNpYmVscyAgICAgICAgICAgPSAtMTQwXG4gICAgQGFuYWx5c2VyLm1heERlY2liZWxzICAgICAgICAgICA9IDBcbiAgICBAYW5hbHlzZXIuZmZ0U2l6ZSAgICAgICAgICAgICAgID0gNTEyXG5cbiAgICAjIFNldHVwIFNjcmlwdFByb2Nlc3NvclxuICAgIEBwcm9jZXNzb3IgPSBAY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcigyMDQ4LCAxLCAxKVxuXG4gICAgIyBTZXRwIEdhaW5Ob2RlXG4gICAgQGdhaW5Ob2RlID0gQGN0eC5jcmVhdGVHYWluKClcblxuICAgIEBzcmMuY29ubmVjdChAYW5hbHlzZXIpXG4gICAgQHNyYy5jb25uZWN0KEBnYWluTm9kZSlcbiAgICBAYW5hbHlzZXIuY29ubmVjdChAcHJvY2Vzc29yKVxuICAgIEBwcm9jZXNzb3IuY29ubmVjdChAY3R4LmRlc3RpbmF0aW9uKVxuICAgIEBnYWluTm9kZS5jb25uZWN0KEBjdHguZGVzdGluYXRpb24pXG5cbiAgICBAcHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gQF9vbkF1ZGlvUHJvY2Vzc1xuICAgIEBwcm9jZXNzb3IuYXBpID0gQFxuXG4gICAgQF9vbGRCcm93c2VyKClcblxuICBfZGlzY29ubmVjdDogLT5cbiAgICBAYW5hbHlzZXIuZGlzY29ubmVjdCgwKSAgaWYgQGFuYWx5c2VyXG4gICAgQHByb2Nlc3Nvci5kaXNjb25uZWN0KDApIGlmIEBwcm9jZXNzb3JcbiAgICBAZ2Fpbk5vZGUuZGlzY29ubmVjdCgwKSAgaWYgQGdhaW5Ob2RlXG5cbiAgX29uQXVkaW9Qcm9jZXNzOiA9PlxuICAgIEBvbmF1ZGlvcHJvY2VzcygpIGlmIEBvbmF1ZGlvcHJvY2Vzc1xuXG4gIF9vbkVuZGVkOiAoZSk9PlxuICAgIGlmIEBzcmMgYW5kIChAc3RhdGUgPT0gV2ViQXVkaW9BUEkuSVNfU1RPUFBFRCB8fCBAc3RhdGUgPT0gV2ViQXVkaW9BUEkuSVNfUExBWUlORylcbiAgICAgIEBzcmMuZGlzY29ubmVjdCgwKVxuICAgICAgQHNyYyAgICAgICAgICAgICAgICAgICAgICA9IG51bGxcbiAgICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBudWxsXG4gICAgICBAc3RhdGUgPSBXZWJBdWRpb0FQSS5JU19FTkRFRFxuICAgICAgQG9uZW5kZWQoKSBpZiBAb25lbmRlZFxuXG4gIF9vbGRCcm93c2VyOiAtPlxuICAgIGlmIEBjdHggYW5kIHR5cGVvZiBAY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvciAhPSAnZnVuY3Rpb24nXG4gICAgICBAY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvciA9IEBjdHguY3JlYXRlSmF2YVNjcmlwdE5vZGVcblxuICAgIGlmIEBzcmMgYW5kIHR5cGVvZiBAc3JjLnN0YXJ0ICE9ICdmdW5jdGlvbidcbiAgICAgIEBzcmMuc3RhcnQgPSBAc3JjLm5vdGVPblxuXG4gICAgaWYgQHNyYyBhbmQgdHlwZW9mIEBzcmMuc3RvcCAhPSAnZnVuY3Rpb24nXG4gICAgICBAc3JjLnN0b3AgPSBAc3JjLm5vdGVPZmZcblxuV2ViQXVkaW9BUEkgPSBuZXcgV2ViQXVkaW9BUEkoKVxuXG5cbmNsYXNzIFNQQUNFLkVxdWFsaXplciBleHRlbmRzIFRIUkVFLkdyb3VwXG5cbiAgY2VudGVyOiAgICAgbnVsbFxuXG4gIF92YWx1ZXM6ICAgIG51bGxcbiAgX25ld1ZhbHVlczogbnVsbFxuXG4gIF90aW1lOiAgICAgIDFcblxuICBfanVrZWJveDogbnVsbFxuXG4gICMgVEhSRUVcbiAgbWF0ZXJpYWw6ICAgbnVsbFxuICBsaW5lczogICAgICBudWxsXG5cbiAgIyBQYXJhbWV0ZXJzXG4gIG1heExlbmd0aDogICAgICAgICAwXG4gIG1pbkxlbmd0aDogICAgICAgICAwXG4gIHJhZGl1czogICAgICAgICAgICAwXG4gIGludGVycG9sYXRpb25UaW1lOiAwXG4gIGNvbG9yOiAgICAgICAgICAgICAweEZGRkZGRlxuICBsaW5lRm9yY2VVcDogICAgICAgLjVcbiAgbGluZUZvcmNlRG93bjogICAgIC41XG4gIGxpbmV3aWR0aDogICAgICAgICAwXG4gIGFic29sdXRlOiAgICAgICAgICBmYWxzZVxuICBuYlZhbHVlczogICAgICAgICAgMFxuICBtYXhOYlZhbHVlczogICAgICAgNTEyXG4gIG1pcnJvcjogICAgICAgICAgICB0cnVlXG5cbiAgY29uc3RydWN0b3I6IChvcHRzPXt9KS0+XG4gICAgc3VwZXJcblxuICAgICMgU2V0IHBhcmFtZXRlcnNcbiAgICBkZWZhdWx0cyA9XG4gICAgICBtYXhMZW5ndGg6ICAgICAgICAgMjAwXG4gICAgICBtaW5MZW5ndGg6ICAgICAgICAgNTBcbiAgICAgIHJhZGl1czogICAgICAgICAgICAyNTBcbiAgICAgIGludGVycG9sYXRpb25UaW1lOiAxNTBcbiAgICAgIGNvbG9yOiAgICAgICAgICAgICAweEZGRkZGRlxuICAgICAgbGluZUZvcmNlVXA6ICAgICAgIC41XG4gICAgICBsaW5lRm9yY2VEb3duOiAgICAgLjVcbiAgICAgIGFic29sdXRlOiAgICAgICAgICBmYWxzZVxuICAgICAgbmJWYWx1ZXM6ICAgICAgICAgIDI1NiAjIE1heGltdW0gNTEyIHZhbHVlc1xuICAgICAgbWlycm9yOiAgICAgICAgICAgIHRydWVcbiAgICAgIGxpbmV3aWR0aDogICAgICAgICAyXG5cbiAgICBvcHRzICAgICAgICAgICAgICAgPSBfQ29mZmVlLm1lcmdlKGRlZmF1bHRzLCBvcHRzKVxuICAgIEBtaW5MZW5ndGggICAgICAgICA9IG9wdHMubWluTGVuZ3RoXG4gICAgQG1heExlbmd0aCAgICAgICAgID0gb3B0cy5tYXhMZW5ndGhcbiAgICBAcmFkaXVzICAgICAgICAgICAgPSBvcHRzLnJhZGl1c1xuICAgIEBpbnRlcnBvbGF0aW9uVGltZSA9IG9wdHMuaW50ZXJwb2xhdGlvblRpbWVcbiAgICBAY29sb3IgICAgICAgICAgICAgPSBvcHRzLmNvbG9yXG4gICAgQGxpbmVGb3JjZVVwICAgICAgID0gb3B0cy5saW5lRm9yY2VVcFxuICAgIEBsaW5lRm9yY2VEb3duICAgICA9IG9wdHMubGluZUZvcmNlRG93blxuICAgIEBhYnNvbHV0ZSAgICAgICAgICA9IG9wdHMuYWJzb2x1dGVcbiAgICBAbmJWYWx1ZXMgICAgICAgICAgPSBvcHRzLm5iVmFsdWVzXG4gICAgQG1pcnJvciAgICAgICAgICAgID0gb3B0cy5taXJyb3JcbiAgICBAbGluZXdpZHRoICAgICAgICAgPSBvcHRzLmxpbmV3aWR0aFxuXG4gICAgIyBTZXQgdmFsdWVzXG4gICAgQF9qdWtlYm94ICAgPSBTUEFDRS5TY2VuZU1hbmFnZXIuY3VycmVudFNjZW5lLl9qdWtlYm94XG4gICAgQGNlbnRlciAgICAgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgQF92YWx1ZXMgICAgPSBAbXV0ZShmYWxzZSlcbiAgICBAX25ld1ZhbHVlcyA9IEBtdXRlKGZhbHNlKVxuICAgIEBzZXRSYWRpdXMoQHJhZGl1cylcbiAgICBcbiAgICBAZ2VuZXJhdGUoKVxuXG4gICAgQF9ldmVudHMoKVxuICAgIEB1cGRhdGVWYWx1ZXMoKVxuXG4gIF9ldmVudHM6IC0+XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihUUkFDSy5JU19TVE9QUEVELnR5cGUsIEBfZVRyYWNrSXNTdG9wcGVkKVxuXG4gIF9lVHJhY2tJc1N0b3BwZWQ6ID0+XG4gICAgQG11dGUoKVxuXG4gIHNldFJhZGl1czogKHJhZGl1cyktPiBcbiAgICBAcmFkaXVzID0gcmFkaXVzIFxuICAgIEByYWRpdXMgPSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNiBpZiB3aW5kb3cuaW5uZXJXaWR0aCAtIDEwMCA8IHJhZGl1cyBcblxuICBzZXROYlZhbHVlczogKG5iVmFsdWVzKS0+XG4gICAgQG5iVmFsdWVzID0gbmJWYWx1ZXNcbiAgICBAbXV0ZSgpXG5cbiAgc2V0VmFsdWVzOiAodmFsdWVzKS0+XG4gICAgaWYgQG1pcnJvclxuICAgICAgZGF0YXMgID0gQXJyYXkoQG5iVmFsdWVzKVxuICAgICAgZm9yIGkgaW4gWzAuLigoQG5iVmFsdWVzKi41KS0xKV1cbiAgICAgICAgZGF0YXNbaV0gPSBkYXRhc1tAbmJWYWx1ZXMtMS1pXSA9IHZhbHVlc1tpXVxuICAgICAgdmFsdWVzID0gZGF0YXNcblxuICAgIG5ld1ZhbHVlcyA9IEBtdXRlKGZhbHNlKVxuICAgIGZvciB2YWx1ZSwgaSBpbiB2YWx1ZXNcbiAgICAgIHZhbHVlID0gTWF0aC5hYnModmFsdWUpIGlmIEBhYnNvbHV0ZVxuICAgICAgbGVuZ3RoID0gQG1pbkxlbmd0aCArIHBhcnNlRmxvYXQodmFsdWUpKihAbWF4TGVuZ3RoIC0gQG1pbkxlbmd0aClcbiAgICAgIG5ld1ZhbHVlc1tpXSA9IE1hdGgubWF4KGxlbmd0aCwgMClcbiAgICBAX25ld1ZhbHVlcyA9IG5ld1ZhbHVlc1xuICAgIEByZXNldEludGVycG9sYXRpb24oKVxuXG4gIGdlbmVyYXRlOiAtPlxuICAgIEBtdXRlKClcblxuICAgIEBtYXRlcmlhbCAgID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHsgY29sb3I6IEBjb2xvciwgbGluZXdpZHRoOiBAbGluZXdpZHRoIH0pXG4gICAgQGxpbmVzICAgICAgPSBbXVxuXG4gICAgQHJlZnJlc2goMClcbiAgICBAdXBkYXRlR2VvbWV0cmllcyh0cnVlKVxuXG4gIHVwZGF0ZTogKGRlbHRhKS0+XG4gICAgQHJlZnJlc2goZGVsdGEpXG5cbiAgcmVmcmVzaDogKGRlbHRhKS0+XG4gICAgQF90aW1lICs9IGRlbHRhXG4gICAgdCA9IEBfdGltZSAvIEBpbnRlcnBvbGF0aW9uVGltZVxuICAgIHJldHVybiBpZiB0ID4gMVxuXG4gICAgZm9yIGkgaW4gWzAuLihAbWF4TmJWYWx1ZXMtMSldXG4gICAgICBkaWZmICAgICAgICA9IEBfdmFsdWVzW2ldIC0gQF9uZXdWYWx1ZXNbaV1cbiAgICAgIEBfdmFsdWVzW2ldID0gQF92YWx1ZXNbaV0gLSB0ICogZGlmZlxuICAgIEB1cGRhdGVHZW9tZXRyaWVzKClcblxuICB1cGRhdGVWYWx1ZXM6ID0+XG4gICAgaWYgQF9qdWtlYm94LmN1cnJlbnQgYW5kIEBfanVrZWJveC5jdXJyZW50LnN0YXRlID09IFNQQUNFLlRyYWNrLklTX1BMQVlJTkdcbiAgICAgIEBzZXRWYWx1ZXMoQF9qdWtlYm94LmN1cnJlbnQudGltZWRhdGEpXG4gICAgc2V0VGltZW91dChAdXBkYXRlVmFsdWVzLCBAaW50ZXJwb2xhdGlvblRpbWUgKiAwLjE1KVxuXG4gIHVwZGF0ZUdlb21ldHJpZXM6IChjcmVhdGU9ZmFsc2UpLT5cbiAgICBmb3IgbGVuZ3RoLCBpIGluIEBfdmFsdWVzXG4gICAgICBhbmdsZSAgPSBNYXRoLlBJICogMiAqIGkgLyBAbmJWYWx1ZXNcblxuICAgICAgZnJvbSA9IEBjb21wdXRlUG9zaXRpb24oQGNlbnRlciwgYW5nbGUsIEByYWRpdXMtbGVuZ3RoKkBsaW5lRm9yY2VEb3duKVxuICAgICAgdG8gICA9IEBjb21wdXRlUG9zaXRpb24oQGNlbnRlciwgYW5nbGUsIEByYWRpdXMrbGVuZ3RoKkBsaW5lRm9yY2VVcClcblxuICAgICAgaWYgdHlwZW9mIEBsaW5lc1tpXSA9PSAndW5kZWZpbmVkJ1xuICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpXG4gICAgICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2goZnJvbSwgdG8sIGZyb20pXG5cbiAgICAgICAgbGluZSA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBAbWF0ZXJpYWwpXG4gICAgICAgIEBsaW5lcy5wdXNoKGxpbmUpXG4gICAgICAgIEBhZGQobGluZSlcbiAgICAgIGVsc2VcbiAgICAgICAgbGluZSA9IEBsaW5lc1tpXVxuICAgICAgICBsaW5lLmdlb21ldHJ5LnZlcnRpY2VzWzBdID0gZnJvbVxuICAgICAgICBsaW5lLmdlb21ldHJ5LnZlcnRpY2VzWzFdID0gdG9cbiAgICAgICAgbGluZS5nZW9tZXRyeS52ZXJ0aWNlc1syXSA9IGZyb21cbiAgICAgICAgbGluZS5nZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlXG5cbiAgcmFuZG9tOiAoc2V0VmFsdWVzPXRydWUpPT5cbiAgICB2YWx1ZXMgPSBbXVxuICAgIGZvciBpIGluIFswLi4oQG1heE5iVmFsdWVzLTEpXVxuICAgICAgdmFsdWVzW2ldID0gTWF0aC5yYW5kb20oKVxuICAgIEBzZXRWYWx1ZXModmFsdWVzKSBpZiBzZXRWYWx1ZXNcbiAgICByZXR1cm4gdmFsdWVzXG5cbiAgbXV0ZTogKHNldFZhbHVlcz10cnVlKS0+XG4gICAgdmFsdWVzID0gW11cbiAgICBmb3IgaSBpbiBbMC4uKEBtYXhOYlZhbHVlcy0xKV1cbiAgICAgIHZhbHVlc1tpXSA9IDBcbiAgICBAc2V0VmFsdWVzKHZhbHVlcykgaWYgc2V0VmFsdWVzXG4gICAgcmV0dXJuIHZhbHVlc1xuXG4gIHJlc2V0SW50ZXJwb2xhdGlvbjogLT5cbiAgICBAX3RpbWUgPSAwXG5cbiAgY29tcHV0ZVBvc2l0aW9uOiAocG9pbnQsIGFuZ2xlLCBsZW5ndGgpLT5cbiAgICB4ID0gcG9pbnQueCArIE1hdGguc2luKGFuZ2xlKSAqIGxlbmd0aFxuICAgIHkgPSBwb2ludC55ICsgTWF0aC5jb3MoYW5nbGUpICogbGVuZ3RoXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKHgsIHksIHBvaW50LnopXG5cbiAgcmVtb3ZlTGluZUZyb21QYXJlbnQ6IChpbmRleCktPlxuICAgIHBhcmVudCA9IEBsaW5lc1tpbmRleF1cbiAgICBwYXJlbnQucmVtb3ZlKEBsaW5lc1tpbmRleF0pXG5cbiAgcmVzaXplOiAtPiBcbiAgICBAc2V0UmFkaXVzKEByYWRpdXMpIFxuICAgICAgXG5cblxuY2xhc3MgU1BBQ0UuQ292ZXIgZXh0ZW5kcyBUSFJFRS5Hcm91cFxuXG4gIEBURVhUVVJFU19MT0FERUQ6ICdjb3Zlcl90ZXh0dXJlc19sb2FkZWQnXG5cbiAgbG9hZGluZ01hbmFnZXI6IG51bGxcbiAgaW1hZ2VMb2FkZXI6IG51bGxcblxuICBwbGFuZTogbnVsbFxuXG4gIHBsYXlsaXN0OiBudWxsXG5cbiAgdGV4dHVyZTA6IG51bGxcbiAgdGV4dHVyZTE6IG51bGxcblxuICBmb3Y6IDBcbiAgYXNwZWN0OiAwXG4gIGRpc3RhbmNlOiAwXG5cbiAgdE1vdmU6IDFcbiAgdFNjYWxlOiAxXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcbiAgICBAX3NldHVwKClcbiAgICBAX2V2ZW50cygpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFNQQUNFLlRyYWNrLklTX1BMQVlJTkcudHlwZSwgQF9lVHJhY2tJc1BsYXlpbmcpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihTUEFDRS5UcmFjay5JU19QQVVTRUQudHlwZSwgQF9lVHJhY2tJc1BhdXNlZClcbiAgICAjIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoU1BBQ0UuVHJhY2suSVNfTE9BREVELnR5cGUsIEBfZVRyYWNrSXNMb2FkZWQpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihTUEFDRS5UcmFjay5XSUxMX1BMQVkudHlwZSwgQF9lSnVrZWJveFdpbGxQbGF5KVxuXG4gICAgJCgnI2xvYWRpbmcsICNpbmZvcm1hdGlvbiBzcGFuJykub24gJ2NsaWNrJywgKGUpLT5cbiAgICAgIGlmICQoJyNsb2FkaW5nJykuaGFzQ2xhc3MoJ3JlYWR5JykgYW5kIHdpbmRvdy5XZWJBdWRpb0FQSVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgd2luZG93LldlYkF1ZGlvQVBJLnBsYXkoKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICBfZUp1a2Vib3hXaWxsUGxheTogKGUpPT5cbiAgICBAbmV4dCgpXG4gICAgJCgnI2luZm9ybWF0aW9uIGgxJykuYWRkQ2xhc3MoJ2hpZGRlbicpXG4gICAgJCgnI2luZm9ybWF0aW9uIGgyJykuYWRkQ2xhc3MoJ2hpZGRlbicpXG5cbiAgX2VUcmFuc2l0aW9uRW5kZWQ6IChlKT0+XG4gICAgSEVMUEVSLnRyaWdnZXIoRVZFTlQuQ292ZXIuVFJBTlNJVElPTl9FTkRFRClcblxuICBfZVRyYWNrSXNQbGF5aW5nOiAoZSk9PlxuICAgICQoJyNpbmZvcm1hdGlvbiBoMScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxuICAgICQoJyNpbmZvcm1hdGlvbiBoMicpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxuICAgICQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpXG5cbiAgX2VUcmFja0lzUGF1c2VkOiAoZSk9PlxuICAgICQoJyNsb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG4gICAgJCgnI2xvYWRpbmcgaS5pY24nKS5yZW1vdmVDbGFzcygncGxheScpXG4gICAgJCgnI2xvYWRpbmcgaS5pY24nKS5hZGRDbGFzcygncGF1c2UnKVxuXG4gIF9lVHJhY2tJc0xvYWRlZDogKGUpPT5cbiAgICB1bmxlc3MgJCgnI2xvYWRpbmcnKS5oYXNDbGFzcygncmVhZHknKVxuICAgICAgJCgnI2xvYWRpbmcnKS5hZGRDbGFzcygncmVhZHknKVxuICAgICAgJCgnI2xvYWRpbmcgcCcpLmh0bWwoJ1RhcCBpbiB0aGUgbWlkZGxlPGJyPnRvIHBsYXkgb3IgcGF1c2UnKVxuXG4gICAgdHJhY2sgICAgPSBlLm9iamVjdC50cmFja1xuICAgIHRpdGxlICAgID0gdHJhY2suZGF0YS50aXRsZVxuICAgIHVzZXJuYW1lID0gdHJhY2suZGF0YS5hdXRob3JcbiAgICB1c2VyX3VybCA9IHRyYWNrLmRhdGEuYXV0aG9yX3VybFxuXG4gICAgJCgnI2luZm9ybWF0aW9uIGgxJykuaHRtbCh0aXRsZSlcbiAgICAkKCcjaW5mb3JtYXRpb24gaDInKS5odG1sKCdieSA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyt1c2VyX3VybCsnXCI+Jyt1c2VybmFtZSsnPC9hPicpXG5cbiAgICBjc3MgPSBcIlwiXCJcbiAgICAgICAgYSB7IGNvbG9yOiBcIlwiXCIrdHJhY2suZGF0YS5jb2xvcjErXCJcIlwiICFpbXBvcnRhbnQ7IH1cbiAgICAgICAgYm9keSB7IGNvbG9yOiBcIlwiXCIrdHJhY2suZGF0YS5jb2xvcjIrXCJcIlwiICFpbXBvcnRhbnQ7IH1cbiAgICBcIlwiXCJcbiAgICAkKCcuY292ZXItc3R5bGUnKS5odG1sKGNzcylcblxuICAgIG5leHRUcmFjayA9IEBwbGF5bGlzdFswXVxuICAgIGZvciB0cmFja0RhdGEsIGkgaW4gQHBsYXlsaXN0XG4gICAgICBpZiB0cmFja0RhdGEuY292ZXIgPT0gdHJhY2suZGF0YS5jb3ZlclxuICAgICAgICBuZXh0VHJhY2sgPSBAcGxheWxpc3RbaSsxXSBpZiBpKzEgPCBAcGxheWxpc3QubGVuZ3RoXG4gICAgICAgIGJyZWFrXG5cbiAgICBAdGV4dHVyZUxvYWRlci5sb2FkICdyZXNvdXJjZXMvY292ZXJzLycrdHJhY2suZGF0YS5jb3ZlciwgKHRleHR1cmUpPT5cbiAgICAgIEB0ZXh0dXJlMCA9IHRleHR1cmVcbiAgICAgIEBfdGV4dHVyZUxvYWRlZCgpXG4gICAgQHRleHR1cmVMb2FkZXIubG9hZCAncmVzb3VyY2VzL2NvdmVycy8nK25leHRUcmFjay5jb3ZlciwgKHRleHR1cmUpPT5cbiAgICAgIEB0ZXh0dXJlMSA9IHRleHR1cmVcbiAgICAgIEBfdGV4dHVyZUxvYWRlZCgpXG5cbiAgICAkKCcuYmx1cnJpZWQgbGkgZGl2JykuY3NzKHsgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgfSlcbiAgICAkKCcuYmx1cnJpZWQgbGkgZGl2JykubGFzdCgpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwocmVzb3VyY2VzL2NvdmVycy8nK3RyYWNrLmRhdGEuY292ZXIrJyknKVxuICAgICQoJy5ibHVycmllZCBsaSBkaXYnKS5maXJzdCgpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwocmVzb3VyY2VzL2NvdmVycy8nK25leHRUcmFjay5jb3ZlcisnKScpXG5cbiAgX3NldHVwOiAtPlxuICAgIEBsb2FkaW5nTWFuYWdlciAgICAgICAgPSBuZXcgVEhSRUUuTG9hZGluZ01hbmFnZXIoKVxuICAgIEBsb2FkaW5nTWFuYWdlci5vbkxvYWQgPSBAX3NldHVwUGxhbmVcbiAgICBAaW1hZ2VMb2FkZXIgICAgICAgICAgID0gbmV3IFRIUkVFLkltYWdlTG9hZGVyKEBsb2FkaW5nTWFuYWdlcilcbiAgICBAdGV4dHVyZUxvYWRlciAgICAgICAgID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoQGxvYWRpbmdNYW5hZ2VyKVxuICAgIEBsb2FkZXIgICAgICAgICAgICAgICAgPSBuZXcgVEhSRUUuWEhSTG9hZGVyKEBsb2FkaW5nTWFuYWdlcilcblxuICBsb2FkOiAocGxheWxpc3QpLT5cbiAgICBAcGxheWxpc3QgPSBwbGF5bGlzdFxuXG4gICAgZm9yIHRyYWNrIGluIHBsYXlsaXN0XG4gICAgICBAaW1hZ2VMb2FkZXIubG9hZCAncmVzb3VyY2VzL2NvdmVycy8nK3RyYWNrLmNvdmVyLCAoaW1hZ2UpPT5cbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgIEBsb2FkZXIubG9hZCAnYXNzZXRzL3NoYWRlcnMvY292ZXIuZnJhZycsIChjb250ZW50KT0+XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIEBsb2FkZXIubG9hZCAnYXNzZXRzL3NoYWRlcnMvY292ZXIudmVydCcsIChjb250ZW50KT0+XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIEBsb2FkZXIubG9hZCAnYXNzZXRzL3NoYWRlcnMvZ2F1c3NpYW5fYmx1ci5mcmFnJywgKGNvbnRlbnQpPT5cbiAgICAgIHJldHVybiB0cnVlXG5cbiAgX3NldHVwUGxhbmU6ID0+XG4gICAgdmVydGV4U2hhZGVyICAgPSBAbG9hZGVyLmNhY2hlLmZpbGVzWydhc3NldHMvc2hhZGVycy9jb3Zlci52ZXJ0J11cbiAgICBmcmFnbWVudFNoYWRlciA9IEBsb2FkZXIuY2FjaGUuZmlsZXNbJ2Fzc2V0cy9zaGFkZXJzL2NvdmVyLmZyYWcnXVxuXG4gICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoXG4gICAgICB1bmlmb3JtczogXG4gICAgICAgIHRleHR1cmUwOiB7IHR5cGU6ICd0JywgdmFsdWU6IG5ldyBUSFJFRS5UZXh0dXJlKCkgfVxuICAgICAgICB0ZXh0dXJlMTogeyB0eXBlOiAndCcsIHZhbHVlOiBuZXcgVEhSRUUuVGV4dHVyZSgpIH1cbiAgICAgICAgdGV4dHVyZTI6IHsgdHlwZTogJ3QnLCB2YWx1ZTogbmV3IFRIUkVFLlRleHR1cmUoKSB9XG4gICAgICAgIHRleHR1cmUzOiB7IHR5cGU6ICd0JywgdmFsdWU6IG5ldyBUSFJFRS5UZXh0dXJlKCkgfVxuICAgICAgICByZXNvbHV0aW9uOiB7IHR5cGU6ICd2MicsIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMigpIH1cbiAgICAgICAgYVRpbWU6IHsgdHlwZTogJ2YnLCB2YWx1ZTogMCB9XG4gICAgICAgIHRNb3ZlOiB7IHR5cGU6ICdmJywgdmFsdWU6IDAgfVxuICAgICAgICB0U2NhbGU6IHsgdHlwZTogJ2YnLCB2YWx1ZTogMSB9XG4gICAgICAgIHJhdGlvOiB7IHR5cGU6ICd2MicsIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMigpIH1cbiAgICAgIGF0dHJpYnV0ZXM6IFxuICAgICAgICBUMUNvb3JkczogeyB0eXBlOiAndjInLCB2YWx1ZTogW10gfVxuICAgICAgdmVydGV4U2hhZGVyOiB2ZXJ0ZXhTaGFkZXJcbiAgICAgIGZyYWdtZW50U2hhZGVyOiBmcmFnbWVudFNoYWRlclxuICAgIClcblxuICAgIEBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDEsIDEpLCBtYXRlcmlhbClcbiAgICBAcGxhbmUucG9zaXRpb24ueiA9IC0xXG4gICAgQGFkZChAcGxhbmUpXG5cbiAgICBIRUxQRVIudHJpZ2dlcihTUEFDRS5Db3Zlci5URVhUVVJFU19MT0FERUQpXG5cbiAgICBAbG9hZGluZ01hbmFnZXIub25Mb2FkID0gQF90ZXh0dXJlTG9hZGVkXG5cbiAgICBAdGV4dHVyZUxvYWRlci5sb2FkICdyZXNvdXJjZXMvY292ZXJzLycrQHBsYXlsaXN0WzBdLmNvdmVyLCAodGV4dHVyZSk9PlxuICAgICAgQHRleHR1cmUwID0gdGV4dHVyZVxuICAgIEB0ZXh0dXJlTG9hZGVyLmxvYWQgJ3Jlc291cmNlcy9jb3ZlcnMvJytAcGxheWxpc3RbMV0uY292ZXIsICh0ZXh0dXJlKT0+XG4gICAgICBAdGV4dHVyZTEgPSB0ZXh0dXJlXG5cbiAgX3RleHR1cmVMb2FkZWQ6IChhLCBiLCBjKT0+XG4gICAgaWYgQHRleHR1cmUwICYmIEB0ZXh0dXJlMVxuICAgICAgQHNldENvdmVycyhAdGV4dHVyZTAsIEB0ZXh0dXJlMSlcbiAgICAgIEB0ZXh0dXJlMCA9IEB0ZXh0dXJlMSA9IG51bGxcblxuICBzZXRDb3ZlcnM6IChjdXJyZW50LCBuZXh0KS0+XG4gICAgQF9yZXNldFRpbWVsaW5lKClcblxuICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMC52YWx1ZSA9IGN1cnJlbnRcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTEudmFsdWUgPSBuZXh0XG4gICAgXG4gICAgQF9zZXRTaXplRnJvbVRleHR1cmVzKGN1cnJlbnQsIG5leHQpXG4gICAgQF9vdGhlckNvbXB1dGUoY3VycmVudCwgbmV4dClcblxuICByZXNpemU6IC0+XG4gICAgdDAgPSBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTAudmFsdWVcbiAgICB0MSA9IEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMS52YWx1ZVxuICAgIEBfc2V0U2l6ZUZyb21UZXh0dXJlcyh0MCwgdDEpXG5cbiAgX3NldFNpemVGcm9tVGV4dHVyZXM6ICh0ZXh0dXJlMCwgdGV4dHVyZTEpLT5cblxuICAgICMgUGxhbmUgZmlsbCBhbGwgdGhlIHNjcmVlblxuICAgIHRleHR1cmUwV2lkdGggID0gdGV4dHVyZTAuaW1hZ2Uud2lkdGhcbiAgICB0ZXh0dXJlMEhlaWdodCA9IHRleHR1cmUwLmltYWdlLmhlaWdodFxuXG4gICAgbWFuYWdlciAgPSBTUEFDRS5TY2VuZU1hbmFnZXJcbiAgICBmb3YgICAgICA9IG1hbmFnZXIuY2FtZXJhLmZvdiAvIDE4MCAqIE1hdGguUElcbiAgICBhc3BlY3QgICA9IHRleHR1cmUwV2lkdGggLyB0ZXh0dXJlMEhlaWdodFxuICAgIGRpc3RhbmNlID0gbWFuYWdlci5jYW1lcmEucG9zaXRpb24ueiArIDE7XG4gICAgcmF0aW8gICAgPSBNYXRoLm1heCgxLCBtYW5hZ2VyLmNhbWVyYS5hc3BlY3QgLyBhc3BlY3QpXG5cbiAgICB3aWR0aCAgPSAyICogYXNwZWN0ICogTWF0aC50YW4oZm92IC8gMikgKiBkaXN0YW5jZSAqIHJhdGlvXG4gICAgaGVpZ2h0ID0gMiAqIE1hdGgudGFuKGZvdiAvIDIpICogZGlzdGFuY2UgKiByYXRpb1xuXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnJlc29sdXRpb24udmFsdWUueCA9IHdpZHRoXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnJlc29sdXRpb24udmFsdWUueSA9IGhlaWdodFxuICAgIEBwbGFuZS5zY2FsZS5zZXQod2lkdGgsIGhlaWdodCwgMSlcblxuICBfb3RoZXJDb21wdXRlOiAodGV4dHVyZTAsIHRleHR1cmUxKS0+XG4gICAgIyBTZXQgdGV4dHVyZTEgY29vcmRpbmF0ZXNcbiAgICB0ZXh0dXJlMFdpZHRoICA9IHRleHR1cmUwLmltYWdlLndpZHRoXG4gICAgdGV4dHVyZTBIZWlnaHQgPSB0ZXh0dXJlMC5pbWFnZS5oZWlnaHRcbiAgICB0ZXh0dXJlMVdpZHRoICA9IHRleHR1cmUxLmltYWdlLndpZHRoXG4gICAgdGV4dHVyZTFIZWlnaHQgPSB0ZXh0dXJlMS5pbWFnZS5oZWlnaHRcblxuICAgIHRleHR1cmUxSGVpZ2h0ID0gKHRleHR1cmUxSGVpZ2h0ICogdGV4dHVyZTBXaWR0aCkgLyB0ZXh0dXJlMVdpZHRoXG4gICAgdGV4dHVyZTFXaWR0aCAgPSB0ZXh0dXJlMFdpZHRoXG5cbiAgICByYXRpbyA9ICgxLjAgLSAodGV4dHVyZTFIZWlnaHQgLyB0ZXh0dXJlMEhlaWdodCkpICogMC41XG5cbiAgICB2MCA9IG5ldyBUSFJFRS5WZWN0b3IyKDAsIDAuMCAtIHJhdGlvKVxuICAgIHYxID0gbmV3IFRIUkVFLlZlY3RvcjIoMCwgMS4wICsgcmF0aW8pXG4gICAgdjIgPSBuZXcgVEhSRUUuVmVjdG9yMigxLjAsIDEuMCArIHJhdGlvKVxuICAgIHYzID0gbmV3IFRIUkVFLlZlY3RvcjIoMS4wLCAwLjAgLSByYXRpbylcblxuICAgIGNvb3JkcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gQHBsYW5lLm1hdGVyaWFsLmF0dHJpYnV0ZXMuVDFDb29yZHMudmFsdWVcbiAgICBjb29yZHNbMF0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYxXG4gICAgY29vcmRzWzFdICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB2MlxuICAgIGNvb3Jkc1syXSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdjBcbiAgICBjb29yZHNbM10gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYzXG4gICAgQHBsYW5lLm1hdGVyaWFsLmF0dHJpYnV0ZXMuVDFDb29yZHMudmFsdWUgICAgICAgPSBjb29yZHNcbiAgICBAcGxhbmUubWF0ZXJpYWwuYXR0cmlidXRlcy5UMUNvb3Jkcy5uZWVkc1VwZGF0ZSA9IHRydWVcblxuICAgICMgUkVOREVSIFRPIFRFWFRVUkVcbiAgICBAX3ByZXBhcmVSVFQoKVxuXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUyLnZhbHVlID0gQHJ0MFxuICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMy52YWx1ZSA9IEBydDFcblxuICAgIEBfcmVuZGVyVG9UZXh0dXJlKHRleHR1cmUwLmltYWdlLnNyYywgQHJ0MClcbiAgICBAX3JlbmRlclRvVGV4dHVyZSh0ZXh0dXJlMS5pbWFnZS5zcmMsIEBydDEpXG5cbiAgbmV4dDogLT5cbiAgICBAX3Jlc2V0VGltZWxpbmUoKVxuICAgICQodGhpcykuYW5pbWF0ZSh7IHRTY2FsZTogMC43NSB9LFxuICAgICAgZHVyYXRpb246IDUwMFxuICAgICAgZWFzaW5nOiAnZWFzZU91dEV4cG8nXG4gICAgICBwcm9ncmVzczogLT5cbiAgICAgICAgdmFsdWUgPSBAdFNjYWxlXG4gICAgICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50U2NhbGUudmFsdWUgPSB2YWx1ZVxuICAgICkuYW5pbWF0ZSh7IHRNb3ZlOiAxIH0sXG4gICAgICBkdXJhdGlvbjogNzUwXG4gICAgICBlYXNpbmc6ICdlYXNlT3V0RXhwbydcbiAgICAgIHByb2dyZXNzOiAtPlxuICAgICAgICB2YWx1ZSA9IEB0TW92ZVxuICAgICAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudE1vdmUudmFsdWUgID0gdmFsdWVcbiAgICApLmFuaW1hdGUoeyB0U2NhbGU6IDEgfSxcbiAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgIGVhc2luZzogJ2Vhc2VPdXRFeHBvJ1xuICAgICAgcHJvZ3Jlc3M6IC0+XG4gICAgICAgIHZhbHVlID0gQHRTY2FsZVxuICAgICAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudFNjYWxlLnZhbHVlID0gdmFsdWVcbiAgICApXG5cbiAgX3Jlc2V0VGltZWxpbmU6IC0+XG4gICAgQHRTY2FsZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IDEuMFxuICAgIEB0TW92ZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSAwLjBcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudFNjYWxlLnZhbHVlID0gMS4wXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRNb3ZlLnZhbHVlICA9IDAuMFxuXG4gIHVwZGF0ZTogKGRlbHRhKS0+XG4gICAgaWYgQHBsYW5lXG4gICAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMuYVRpbWUudmFsdWUgKz0gZGVsdGEgKiAwLjAwMVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICBjYW1lcmFSVFQ6IG51bGxcbiAgc2NlbmVSVFQ6ICBudWxsXG4gIHJ0MTogICAgICAgIG51bGxcbiAgcnQyOiAgICAgICAgbnVsbFxuXG4gIGNvbXBvc2VyOiAgIG51bGxcbiAgaEJsdXI6ICAgICAgbnVsbFxuICB2Qmx1cjogICAgICBudWxsXG4gIHJlbmRlclBhc3M6IG51bGxcbiAgZWZmZWN0Q29weTogbnVsbFxuXG4gIF9wcmVwYXJlUlRUOiA9PlxuICAgIHQwICAgICA9IEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMC52YWx1ZVxuICAgIHdpZHRoICA9IEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy5yZXNvbHV0aW9uLnZhbHVlLnhcbiAgICBoZWlnaHQgPSBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMucmVzb2x1dGlvbi52YWx1ZS55XG5cbiAgICBAY2FtZXJhUlRUID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKVxuICAgIEBjYW1lcmFSVFQucG9zaXRpb24uc2V0Wig2MDApXG5cbiAgICBAc2NlbmVSVFQgPSBuZXcgVEhSRUUuU2NlbmUoKVxuXG4gICAgQHJ0MCAgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCwgeyBtaW5GaWx0ZXI6IFRIUkVFLkxpbmVhckZpbHRlciwgbWFnRmlsdGVyOiBUSFJFRS5OZWFyZXN0RmlsdGVyLCBmb3JtYXQ6IFRIUkVFLlJHQkZvcm1hdCB9KVxuICAgIEBydDEgID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHsgbWluRmlsdGVyOiBUSFJFRS5MaW5lYXJGaWx0ZXIsIG1hZ0ZpbHRlcjogVEhSRUUuTmVhcmVzdEZpbHRlciwgZm9ybWF0OiBUSFJFRS5SR0JGb3JtYXQgfSlcblxuICAgIEBoQmx1ciAgICAgICAgICAgICAgICAgID0gbmV3IFRIUkVFLlNoYWRlclBhc3MoVEhSRUUuSG9yaXpvbnRhbEJsdXJTaGFkZXIpO1xuICAgIEBoQmx1ci5lbmFibGVkICAgICAgICAgID0gdHJ1ZTtcbiAgICBAaEJsdXIudW5pZm9ybXMuaC52YWx1ZSA9IDEgLyB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgIEB2Qmx1ciAgICAgICAgICAgICAgICAgID0gbmV3IFRIUkVFLlNoYWRlclBhc3MoVEhSRUUuVmVydGljYWxCbHVyU2hhZGVyKTtcbiAgICBAdkJsdXIuZW5hYmxlZCAgICAgICAgICA9IHRydWU7XG4gICAgQHZCbHVyLnVuaWZvcm1zLnYudmFsdWUgPSAxIC8gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgQHJlbmRlclBhc3MgPSBuZXcgVEhSRUUuUmVuZGVyUGFzcyhAc2NlbmVSVFQsIEBjYW1lcmFSVFQpXG5cbiAgICBAZWZmZWN0Q29weSA9IG5ldyBUSFJFRS5TaGFkZXJQYXNzKFRIUkVFLkNvcHlTaGFkZXIpXG5cbiAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpXG5cbiAgICBAcGxhbmVSVFQgICAgICAgICAgICA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KDEuMCwgMS4wKSwgbWF0ZXJpYWwpXG4gICAgQHBsYW5lUlRULnBvc2l0aW9uLnogPSAtMVxuICAgIEBwbGFuZVJUVC5zY2FsZS5zZXQoQHBsYW5lLnNjYWxlLngsIEBwbGFuZS5zY2FsZS55LCAxLjApXG4gICAgQHNjZW5lUlRULmFkZChAcGxhbmVSVFQpXG5cbiAgX3JlbmRlclRvVGV4dHVyZTogKHRleHR1cmVVcmwsIHRhcmdldCktPlxuICAgIEB0ZXh0dXJlTG9hZGVyLmxvYWQgdGV4dHVyZVVybCwgKHRleHR1cmUpPT5cbiAgICAgIEBwbGFuZVJUVC5tYXRlcmlhbC5tYXAgPSB0ZXh0dXJlXG4gICAgICBtYW5hZ2VyICAgICAgICAgICAgICAgID0gU1BBQ0UuU2NlbmVNYW5hZ2VyXG5cbiAgICAgIGRlbGV0ZSBAY29tcG9zZXJcblxuICAgICAgQGNvbXBvc2VyICAgPSBuZXcgVEhSRUUuRWZmZWN0Q29tcG9zZXIobWFuYWdlci5yZW5kZXJlciwgdGFyZ2V0KVxuICAgICAgQGNvbXBvc2VyLmFkZFBhc3MoQHJlbmRlclBhc3MpXG4gICAgICBAY29tcG9zZXIuYWRkUGFzcyhAaEJsdXIpXG4gICAgICBAY29tcG9zZXIuYWRkUGFzcyhAdkJsdXIpXG4gICAgICBAY29tcG9zZXIuYWRkUGFzcyhAZWZmZWN0Q29weSlcbiAgICAgIEBjb21wb3Nlci5yZW5kZXIoMC4wMSlcblxuXG4oLT5cbiAgc2NlbmVzID0gWydNYWluU2NlbmUnXVxuXG4gIFNQQUNFLlNjZW5lTWFuYWdlciA9IG5ldyBTUEFDRS5TY2VuZU1hbmFnZXIoKVxuICBmb3Igc2NlbmUgaW4gc2NlbmVzXG4gICAgU1BBQ0UuU2NlbmVNYW5hZ2VyLmNyZWF0ZVNjZW5lKHNjZW5lKVxuXG4gIFNQQUNFLlNjZW5lTWFuYWdlci5nb1RvU2NlbmUoJ01haW5TY2VuZScpXG4pKClcblxuXG4iXX0=