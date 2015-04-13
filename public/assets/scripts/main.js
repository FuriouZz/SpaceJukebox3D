var AirportState, JUKEBOX, JukeboxState, Keyboard, SPACE, SearchEngineState, Setup, SpaceshipState, TRACK, WebAudioAPI, _Coffee, _Easing, _Math, _THREE,
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
    var i, j, path, ref1;
    path = new THREE.CurvePath();
    path.add(new THREE.HermiteBezierCurve3(pts[0], pts[0], pts[1], pts[2]));
    for (i = j = 0, ref1 = pts.length - 4; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
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
    var child, j, len, ref1, results1;
    ref1 = this.children;
    results1 = [];
    for (j = 0, len = ref1.length; j < len; j++) {
      child = ref1[j];
      results1.push(this.updateObj(child, delta));
    }
    return results1;
  };

  Scene.prototype.updateObj = function(obj, delta) {
    var child, j, len, ref1, results1;
    if (typeof obj.update === 'function') {
      obj.update(delta);
    }
    if (obj.hasOwnProperty('children') && obj.children.length > 0) {
      ref1 = obj.children;
      results1 = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        child = ref1[j];
        results1.push(this.updateObj(child, delta));
      }
      return results1;
    }
  };

  Scene.prototype.resize = function() {
    var child, j, len, ref1, results1;
    ref1 = this.children;
    results1 = [];
    for (j = 0, len = ref1.length; j < len; j++) {
      child = ref1[j];
      results1.push(this.resizeObj(child));
    }
    return results1;
  };

  Scene.prototype.resizeObj = function(obj) {
    var child, j, len, ref1, results1;
    if (typeof obj.resize === 'function') {
      obj.resize();
    }
    if (obj.hasOwnProperty('children') && obj.children.length > 0) {
      ref1 = obj.children;
      results1 = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        child = ref1[j];
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
    return this.camera.updateProjectionMatrix();
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
    this._manager = SPACE.SceneManager;
    this._manager.camera.position.setZ(600);
    SPACE.SC = new SPACE.SoundCloud(SPACE.SC.id, SPACE.SC.redirect_uri);
    this._events();
    if (SPACE.SC.isConnected()) {
      return this._setup();
    }
  };

  MainScene.prototype.pause = function() {};

  MainScene.prototype.update = function() {};

  MainScene.prototype._events = function() {
    return document.addEventListener(SPACE.SoundCloud.IS_CONNECTED, this._eSCIsConnected);
  };

  MainScene.prototype._eSCIsConnected = function() {
    return this._setup();
  };

  MainScene.prototype._setup = function() {
    var big, small;
    window.firstLaunch = true;
    this._jukebox = new SPACE.Jukebox();
    small = new SPACE.Equalizer({
      minLength: 0,
      maxLength: 200,
      radius: 300,
      color: 0xFFFFFF,
      absolute: false,
      lineForceDown: .5,
      lineForceUp: 1
    });
    this.add(small);
    big = new SPACE.Equalizer({
      minLength: 0,
      maxLength: 50,
      radius: 300,
      color: 0xD1D1D1,
      absolute: false,
      lineForceDown: .5,
      lineForceUp: 1
    });
    return this.add(big);
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

  Jukebox.prototype.searchEngine = null;

  Jukebox.prototype.SC = null;

  Jukebox.prototype.state = null;

  Jukebox.prototype._nextDelay = 0;

  Jukebox.prototype._nextTimeout = null;

  Jukebox.prototype._refreshDelay = 1000;

  function Jukebox() {
    this._refresh = bind(this._refresh, this);
    this._eTrackIsStopped = bind(this._eTrackIsStopped, this);
    this.playlist = [];
    this.searchEngine = new SPACE.SearchEngine();
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
        this.timedata = Array(256);
        return HELPER.trigger(SPACE.Track.WILL_PLAY, {
          track: this
        });
      case SPACE.Track.IS_PLAYING:
        return HELPER.trigger(SPACE.Track.IS_PLAYING, {
          track: this
        });
      case SPACE.Track.IS_PAUSED:
        return HELPER.trigger(SPACE.Track.IS_PAUSED, {
          track: this
        });
      case SPACE.Track.IS_STOPPED:
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

  Equalizer.prototype.material = null;

  Equalizer.prototype.lines = null;

  Equalizer.prototype.maxLength = 0;

  Equalizer.prototype.minLength = 0;

  Equalizer.prototype.radius = 0;

  Equalizer.prototype.interpolationTime = 0;

  Equalizer.prototype.color = 0xFFFFFF;

  Equalizer.prototype.lineForceUp = .5;

  Equalizer.prototype.lineForceDown = .5;

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
      mirror: true
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
    this.center = new THREE.Vector3();
    this._values = this.mute(false);
    this._newValues = this.mute(false);
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

  Equalizer.prototype.setNbValues = function(nbValues) {
    this.nbValues = nbValues;
    return this.mute();
  };

  Equalizer.prototype.setValues = function(values) {
    var datas, i, j, k, len, length, newValues, ref1, value;
    if (this.mirror) {
      datas = Array(this.nbValues);
      for (i = j = 0, ref1 = (this.nbValues * .5) - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
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
      linewidth: 4
    });
    this.lines = [];
    this.update(0);
    return this.updateGeometries(true);
  };

  Equalizer.prototype.update = function(delta) {
    var diff, i, j, ref1, t;
    this._time += delta;
    t = this._time / this.interpolationTime;
    if (t > 1) {
      return;
    }
    for (i = j = 0, ref1 = this.maxNbValues - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
      diff = this._values[i] - this._newValues[i];
      this._values[i] = this._values[i] - t * diff;
    }
    return this.updateGeometries();
  };

  Equalizer.prototype.updateValues = function() {
    if (SPACE.Jukebox.state === JukeboxState.IS_PLAYING && SPACE.Jukebox.waveformData.mono) {
      this.setValues(SPACE.Jukebox.waveformData.mono);
    }
    return setTimeout(this.updateValues, this.interpolationTime * .5);
  };

  Equalizer.prototype.updateGeometries = function(create) {
    var angle, from, geometry, i, j, len, length, line, ref1, results1, to;
    if (create == null) {
      create = false;
    }
    ref1 = this._values;
    results1 = [];
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      length = ref1[i];
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
    var i, j, ref1, values;
    if (setValues == null) {
      setValues = true;
    }
    values = [];
    for (i = j = 0, ref1 = this.maxNbValues - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
      values[i] = Math.random();
    }
    if (setValues) {
      this.setValues(values);
    }
    return values;
  };

  Equalizer.prototype.mute = function(setValues) {
    var i, j, ref1, values;
    if (setValues == null) {
      setValues = true;
    }
    values = [];
    for (i = j = 0, ref1 = this.maxNbValues - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
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

  return Equalizer;

})(THREE.Group);

SPACE.Spaceship = (function(superClass) {
  extend(Spaceship, superClass);

  Spaceship.prototype.time = 0;

  Spaceship.prototype.ship = null;

  Spaceship.prototype.path = null;

  Spaceship.prototype.duration = 0;

  Spaceship.prototype.songDuration = 0;

  Spaceship.prototype.state = null;

  Spaceship.prototype.angle = 0;

  Spaceship.prototype._cached = null;

  Spaceship.IDLE = 'IDLE';

  Spaceship.LAUNCHED = 'LAUNCHED';

  Spaceship.IN_LOOP = 'IN_LOOP';

  Spaceship.ARRIVED = 'ARRIVED';

  function Spaceship(target, radius) {
    Spaceship.__super__.constructor.apply(this, arguments);
    this.target = new THREE.Vector3(target.x, target.y, 5);
    this.radius = radius;
    this.angle = Math.random() * Math.PI * 2;
    this.setState(SpaceshipState.IDLE);
    this.setup();
  }

  Spaceship.prototype.setRadius = function(radius) {
    this.radius = radius;
    return this._cached = this._computePaths();
  };

  Spaceship.prototype.setup = function() {
    var g, matrix, v;
    g = new THREE.Geometry();
    g.vertices.push(new THREE.Vector3(0, -52.5, -10), new THREE.Vector3(-10, -67.5, 10), new THREE.Vector3(-50, -42.5, 10), new THREE.Vector3(0, 67.5, 10), new THREE.Vector3(+50, -42.5, 10), new THREE.Vector3(+10, -67.5, 10));
    g.faces.push(new THREE.Face3(0, 3, 1), new THREE.Face3(1, 2, 3), new THREE.Face3(3, 0, 5), new THREE.Face3(5, 4, 3));
    g.computeFaceNormals();
    matrix = new THREE.Matrix4();
    matrix.makeRotationX(Math.PI * .5);
    g.applyMatrix(matrix);
    matrix.makeRotationZ(Math.PI);
    g.applyMatrix(matrix);
    this.ship = THREE.SceneUtils.createMultiMaterialObject(g, [
      new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
      })
    ]);
    this.ship.castShadow = true;
    this.ship.receiveShadow = true;
    this.ship.scale.set(.15, .15, .15);
    this.add(this.ship);
    this._cached = this._computePaths();
    v = this._cached.launchedPath.getPointAt(0);
    return this.ship.position.set(v.x, v.y, v.z);
  };

  Spaceship.prototype.setState = function(state) {
    var v;
    this.state = state;
    switch (state) {
      case SpaceshipState.IDLE:
        return this.path = null;
      case SpaceshipState.LAUNCHED:
        this._resetTime();
        this.path = this._cached.launchedPath;
        this.duration = 10 * 1000;
        v = this.path.getPoint(0);
        return this.ship.position.set(v.x, v.y, v.z);
      case SpaceshipState.IN_LOOP:
        this._resetTime();
        this.path = this.testnewloop();
        this.duration = 5 * 1000;
        v = this.path.getPoint(0);
        return this.ship.position.set(v.x, v.y, v.z);
      case SpaceshipState.ARRIVED:
        this.path = null;
        return this.parent.remove(this);
      default:
        return this.setState(SpaceshipState.IDLE);
    }
  };

  Spaceship.prototype.update = function(delta) {
    var t;
    if (this.state !== SpaceshipState.IDLE && this.state !== SpaceshipState.ARRIVED) {
      t = Math.min(this.time / this.duration, 1);
      if (t >= 1) {
        this._resetTime();
        if (this.state === SpaceshipState.LAUNCHED) {
          this.setState(SpaceshipState.IN_LOOP);
        } else if (this.state === SpaceshipState.IN_LOOP) {
          this.path = this.testnewloop();
          this.duration = (5 + (Math.random() * 10)) * 1000;
        }
        return;
      }
      if (this.state === SpaceshipState.LAUNCHED) {
        this.time += delta;
        t = _Easing.QuadraticEaseOut(t);
      }
      if (this.state === SpaceshipState.IN_LOOP) {
        this.time += delta;
      }
      if (t) {
        return this._progress(t);
      }
    }
  };

  Spaceship.prototype._resetTime = function() {
    return this.time = 0;
  };

  Spaceship.prototype._progress = function(t) {
    var ahead, scale, v;
    v = this.path.getPointAt(t);
    this.ship.position.set(v.x, v.y, v.z);
    ahead = Math.min(t + 10 / this.path.getLength(), 1);
    v = this.path.getPointAt(ahead).multiplyScalar(1);
    this.ship.lookAt(v);
    if (this.state === SpaceshipState.LAUNCHED) {
      scale = .25 + (1 - t) * .35;
      return this.ship.scale.set(scale, scale, scale);
    }
  };

  Spaceship.prototype._computePaths = function() {
    var angle, curve, curveA, curveB, curvePoint, distance, fromA, i, j, len, mid, path, points, pt, ref, ref1, toA;
    fromA = new THREE.Vector3();
    fromA.x = this.target.x + Math.cos(this.angle) * 500;
    fromA.y = this.target.y + Math.sin(this.angle) * 500;
    fromA.z = 600;
    path = new THREE.InLoopCurve(this.target, this.angle, this.radius);
    path.inverse = true;
    path.useGolden = true;
    mid = path.getPoint(0);
    ref = path.getPoint(.025);
    angle = _Math.angleBetweenPoints(mid, ref) + Math.PI;
    distance = mid.distanceTo(ref);
    curvePoint = new THREE.Vector3();
    curvePoint.x = mid.x + Math.cos(angle) * distance;
    curvePoint.y = mid.y + Math.sin(angle) * distance;
    curvePoint.z = mid.z;
    toA = path.getPoint(0);
    curve = new THREE.LaunchedCurve(fromA, toA);
    points = curve.getPoints(10);
    ref1 = path.getPoints(10);
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      pt = ref1[i];
      if (i > 0) {
        points.push(pt);
      }
    }
    curveA = _THREE.HermiteCurve(points);
    curveB = path;
    return {
      launchedPath: curveA,
      inLoopPath: curveB
    };
  };

  Spaceship.prototype.testnewloop = function() {
    var newloop;
    THREE.NewLoop = THREE.Curve.create(function(v0, radius, startAngle) {
      if (radius == null) {
        radius = 100;
      }
      if (startAngle == null) {
        startAngle = 0;
      }
      this.v0 = v0;
      this.radius = radius;
      this.startAngle = startAngle;
      this.randAngle = Math.random() * Math.PI * 2;
      this.direction = Math.random() > .5 ? true : false;
      this.test = Math.random();
    }, function(t) {
      var angle, vector;
      if (this.direction) {
        t = 1 - t;
      }
      angle = (Math.PI * 2) * t;
      angle += this.startAngle;
      vector = new THREE.Vector3();
      vector.x = this.v0.x + Math.cos(angle) * this.radius;
      vector.y = this.v0.y + Math.cos(angle + this.randAngle) * (this.radius * 2 * this.test);
      vector.z = this.v0.z + Math.sin(angle) * this.radius;
      return vector;
    });
    newloop = new THREE.NewLoop(this.target, 150, Math.PI * -.5);
    return newloop;
  };

  Spaceship.prototype._debugPath = function(path, color) {
    var g, tube;
    if (color == null) {
      color = 0xFF0000;
    }
    g = new THREE.TubeGeometry(path, 200, .5, 10, true);
    tube = THREE.SceneUtils.createMultiMaterialObject(g, [
      new THREE.MeshBasicMaterial({
        color: color,
        opacity: 0.3,
        wireframe: true,
        transparent: true
      }), new THREE.MeshLambertMaterial({
        color: 0xFF88FF,
        side: THREE.DoubleSide
      })
    ]);
    return this.add(tube);
  };

  return Spaceship;

})(THREE.Group);

Setup = (function(superClass) {
  extend(Setup, superClass);

  Setup.prototype.jukebox = null;

  function Setup() {
    Setup.__super__.constructor.apply(this, arguments);
    this.jukebox = SPACE.Jukebox;
  }

  Setup.prototype.onEnter = function(callback) {
    if (callback) {
      callback();
    }
    return this.setup();
  };

  Setup.prototype.onExit = function(callback) {
    if (callback) {
      return callback();
    }
  };

  Setup.prototype.update = function(delta) {};

  Setup.prototype.setup = function() {
    var earth, light;
    earth = new SPACE.DEFAULT.Icosahedron();
    earth.setup();
    this.add(earth);
    light = new THREE.DirectionalLight(0xFFFFFF, 1.8 * .2);
    light.position.set(500, 500, 500);
    this.add(light);
    light = new THREE.DirectionalLight(0xFFFFFF, 1.8 * .6);
    light.position.set(-500, 500, 500);
    this.add(light);
    light = new THREE.DirectionalLight(0xFFFFFF, 1.8 * .2);
    light.position.set(500, -500, 500);
    this.add(light);
    light = new THREE.DirectionalLight(0xFFFFFF, 1.8 * .2);
    light.position.set(-500, -500, 500);
    this.add(light);
    light = new THREE.DirectionalLight(0xFFFFFF, 1.8 * .1);
    light.position.set(500, 500, -500);
    this.add(light);
    light = new THREE.DirectionalLight(0xFFFFFF, 1.8 * .1);
    light.position.set(-500, 500, -500);
    this.add(light);
    light = new THREE.DirectionalLight(0xFFFFFF, 1.8 * .1);
    light.position.set(500, -500, -500);
    this.add(light);
    light = new THREE.DirectionalLight(0xFFFFFF, 1.8 * .1);
    light.position.set(-500, -500, -500);
    return this.add(light);
  };

  return Setup;

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

//# sourceMappingURL=data:application/json;base64,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RnpCLENBQUE7QUFHQSxPQUFBLHdDQUFBO3NCQUFBO0FBQ0UsSUFBQSxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQW5CLENBQStCLEtBQS9CLENBQUEsQ0FERjtBQUFBLEdBSEE7U0FNQSxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQW5CLENBQTZCLFdBQTdCLEVBUEQ7QUFBQSxDQUFELENBQUEsQ0FBQSxDQXBoRUEsQ0FBQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiU1BBQ0UgPSBTUEFDRSB8fCB7fVxuXG5TUEFDRS5FTlYgICAgICAgID0gJ2RldmVsb3BtZW50J1xuXG4jIFBJWEkuSlNcblNQQUNFLkZQUyAgICAgICAgPSAzMFxuU1BBQ0UucGl4ZWxSYXRpbyA9ICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKVxuXG4jIFRIUkVFLkpTXG5TUEFDRS5USFJFRSA9IHt9XG5cbiMgU09VTkRDTE9VRFxuU1BBQ0UuU0MgPSAoLT5cbiAgb2JqZWN0ID0ge31cbiAgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcbiAgICBvYmplY3QuaWQgPSAnZGUwYjg1MzliNGFkMmY2Y2MyM2RmZTFjYzZlMDQzOGQnXG4gIGVsc2VcbiAgICBvYmplY3QuaWQgPSAnODA3ZDI4NTc1YzM4NGU2MmE1OGJlNWMzYTE0NDZlNjgnXG4gIG9iamVjdC5yZWRpcmVjdF91cmkgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gIHJldHVybiBvYmplY3RcbikoKVxuXG5cbiMgTUVUSE9EU1xuU1BBQ0UuTE9HICAgICAgICA9IChsb2csIHN0eWxlcz0nJyktPlxuICB1bmxlc3MgLyhwcm9kfHByb2R1Y3Rpb24pLy50ZXN0KFNQQUNFLkVOVilcbiAgICAgIGRhdGUgICAgID0gbmV3IERhdGUoKVxuICAgICAgdGltZVN0ciAgPSBkYXRlLnRvVGltZVN0cmluZygpXG4gICAgICB0aW1lU3RyICA9IHRpbWVTdHIuc3Vic3RyKDAsIDgpXG4gICAgICBkYXRlU3RyICA9IGRhdGUuZ2V0RGF0ZSgpICsgJy8nXG4gICAgICBkYXRlU3RyICs9IChkYXRlLmdldE1vbnRoKCkrMSkgKyAnLydcbiAgICAgIGRhdGVTdHIgKz0gZGF0ZS5nZXRGdWxsWWVhcigpXG4gICAgICBjb25zb2xlLmxvZyhkYXRlU3RyKycgLSAnK3RpbWVTdHIrJyB8ICcrbG9nLCBzdHlsZXMpXG5cblNQQUNFLlRPRE8gICAgICAgPSAobWVzc2FnZSktPlxuICBTUEFDRS5MT0coJyVjVE9ETyB8ICcgKyBtZXNzYWdlLCAnY29sb3I6ICMwMDg4RkYnKVxuXG5TUEFDRS5BU1NFUlQgICAgID0gKGNvbmRpdGlvbiwgYWN0aW9uKS0+XG4gIGFjdGlvbigpIGlmIGNvbmRpdGlvblxuICByZXR1cm4gY29uZGl0aW9uXG5cblxuSlVLRUJPWCA9XG4gIFRSQUNLX09OX0FERDogbmV3IEV2ZW50KCdqdWtlYm94X3RyYWNrX29uX2FkZCcpXG4gIFRSQUNLX0FEREVEOiAgbmV3IEV2ZW50KCdqdWtlYm94X3RyYWNrX2FkZGVkJylcbiAgT05fUExBWTogICAgICBuZXcgRXZlbnQoJ2p1a2Vib3hfb25fcGxheScpXG4gIE9OX1NUT1A6ICAgICAgbmV3IEV2ZW50KCdqdWtlYm94X29uX3N0b3AnKVxuICBJU19QTEFZSU5HOiAgIG5ldyBFdmVudCgnanVrZWJveF9pc19wbGF5aW5nJylcbiAgSVNfU1RPUFBFRDogICBuZXcgRXZlbnQoJ2p1a2Vib3hfaXNfc3RvcHBlZCcpXG4gIElTX1NFQVJDSElORzogbmV3IEV2ZW50KCdqdWtlYm94X2lzX3NlYXJjaGluZycpXG5PYmplY3QuZnJlZXplKEpVS0VCT1gpXG5cblRSQUNLID1cbiAgSVNfUExBWUlORzogbmV3IEV2ZW50KCd0cmFja19pc19wbGF5aW5nJylcbiAgSVNfUEFVU0VEOiAgbmV3IEV2ZW50KCd0cmFja19pc19wYXVzZWQnKVxuICBJU19TVE9QUEVEOiBuZXcgRXZlbnQoJ3RyYWNrX2lzX3N0b3BwZWQnKVxuT2JqZWN0LmZyZWV6ZShUUkFDSylcblxuXG5LZXlib2FyZCA9XG4gIEVOVEVSOiAgMTNcbiAgVVA6ICAgICAzOFxuICBET1dOOiAgIDQwXG4gIEVTQzogICAgMjdcbiAgREVMRVRFOiA0NlxuXG5TcGFjZXNoaXBTdGF0ZSA9XG4gIElETEU6ICAgICAnaWRsZSdcbiAgTEFVTkNIRUQ6ICdsYXVuY2hlZCdcbiAgSU5fTE9PUDogICdpbl9sb29wJ1xuICBBUlJJVkVEOiAgJ2Fycml2ZWQnXG5cblNlYXJjaEVuZ2luZVN0YXRlID1cbiAgT1BFTkVEOiAnb3BlbmVkJ1xuICBDTE9TRUQ6ICdjbG9zZWQnXG4gIFNFQVJDSDogJ3NlYXJjaCdcbiAgVFJBQ0tfU0VMRUNURUQ6ICd0cmFja19zZWxlY3RlZCdcblxuSnVrZWJveFN0YXRlID1cbiAgSVNfUExBWUlORzogJ2lzX3BsYXlpbmcnXG4gIElTX1NUT1BQRUQ6ICdpc19zdG9wcGVkJ1xuXG5BaXJwb3J0U3RhdGUgPVxuICBJRExFOiAnaWRsZSdcbiAgU0VORElORzogJ3NlbmRpbmcnXG5cbk9iamVjdC5mcmVlemUoS2V5Ym9hcmQpXG5PYmplY3QuZnJlZXplKFNwYWNlc2hpcFN0YXRlKVxuT2JqZWN0LmZyZWV6ZShTZWFyY2hFbmdpbmVTdGF0ZSlcbk9iamVjdC5mcmVlemUoSnVrZWJveFN0YXRlKVxuT2JqZWN0LmZyZWV6ZShBaXJwb3J0U3RhdGUpXG5cblxud2luZG93LkhFTFBFUiA9IHdpbmRvdy5IRUxQRVIgfHxcbiAgZXZlbnRzOiB7fVxuXG4gIHRyaWdnZXI6IChldmVudG5hbWUsIG9iamVjdCktPlxuICAgIGNvbnNvbGUubG9nIGV2ZW50bmFtZVxuICAgIHVubGVzcyBAZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50bmFtZSlcbiAgICAgIEBldmVudHNbZXZlbnRuYW1lXSA9IG5ldyBFdmVudChldmVudG5hbWUpXG5cbiAgICBlID0gQGV2ZW50c1tldmVudG5hbWVdXG4gICAgZS5vYmplY3QgPSBvYmplY3RcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGUpXG5cbiAgcmV0aW5hOiAodmFsdWUpLT5cbiAgICBpZiB0eXBlb2YgdmFsdWUgaXMgJ29iamVjdCdcbiAgICAgIG9iamVjdCA9IHZhbHVlXG4gICAgICBvID0ge31cbiAgICAgIGZvciBrZXkgb2Ygb2JqZWN0XG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV1cbiAgICAgICAgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICAgICAgb1trZXldID0gdmFsdWUgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb1xuICAgICAgcmV0dXJuIEBtZXJnZShvYmplY3QsIG8pXG4gICAgZWxzZSBpZiB0eXBlb2YgdmFsdWUgaXMgJ2FycmF5J1xuICAgICAgYXJyYXkgPSB2YWx1ZVxuICAgICAgYSA9IFtdXG4gICAgICBmb3IgdmFsdWUsIGtleSBpbiBhcnJheVxuICAgICAgICBpZiB0eXBlb2YgdmFsdWUgaXMgJ251bWJlcidcbiAgICAgICAgICBhLnB1c2godmFsdWUgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGEucHVzaCh2YWx1ZSlcbiAgICAgIHJldHVybiBhXG4gICAgZWxzZSBpZiB0eXBlb2YgdmFsdWUgaXMgJ251bWJlcidcbiAgICAgIHJldHVybiB2YWx1ZSAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvXG4gICAgcmV0dXJuIGZhbHNlXG5cblxuX0NvZmZlZSA9IF9Db2ZmZWUgfHwge1xuICAjIEFycmF5XG4gIHNodWZmbGU6IChhcnJheSktPlxuICAgIHRtcFxuICAgIGN1cnIgPSBhcnJheS5sZW5ndGhcbiAgICB3aGlsZSAwICE9IGN1cnJcbiAgICAgIHJhbmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyKVxuICAgICAgY3VyciAtPSAxXG4gICAgICB0bXAgICAgICAgICA9IGFycmF5W2N1cnJdXG4gICAgICBhcnJheVtjdXJyXSA9IGFycmF5W3JhbmRdXG4gICAgICBhcnJheVtyYW5kXSA9IHRtcFxuICAgIHJldHVybiBhcnJheVxuXG4gICMgT2JqZWN0XG4gIG1lcmdlOiAob3B0aW9ucywgb3ZlcnJpZGVzKSAtPlxuICAgIEBleHRlbmQgKEBleHRlbmQge30sIG9wdGlvbnMpLCBvdmVycmlkZXNcblxuICBleHRlbmQ6IChvYmplY3QsIHByb3BlcnRpZXMpIC0+XG4gICAgZm9yIGtleSwgdmFsIG9mIHByb3BlcnRpZXNcbiAgICAgIG9iamVjdFtrZXldID0gdmFsXG4gICAgb2JqZWN0XG59XG5cblxuX01hdGggPSBfTWF0aCB8fCB7XG4gIGFuZ2xlQmV0d2VlblBvaW50czogKGZpcnN0LCBzZWNvbmQpIC0+XG4gICAgaGVpZ2h0ID0gc2Vjb25kLnkgLSBmaXJzdC55XG4gICAgd2lkdGggID0gc2Vjb25kLnggLSBmaXJzdC54XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoaGVpZ2h0LCB3aWR0aClcblxuICBkaXN0YW5jZTogKHBvaW50MSwgcG9pbnQyKSAtPlxuICAgIHggPSBwb2ludDEueCAtIHBvaW50Mi54XG4gICAgeSA9IHBvaW50MS55IC0gcG9pbnQyLnlcbiAgICBkID0geCAqIHggKyB5ICogeVxuICAgIHJldHVybiBNYXRoLnNxcnQoZClcblxuICBjb2xsaXNpb246IChkb3QxLCBkb3QyKS0+XG4gICAgcjEgPSBpZiBkb3QxLnJhZGl1cyB0aGVuIGRvdDEucmFkaXVzIGVsc2UgMFxuICAgIHIyID0gaWYgZG90Mi5yYWRpdXMgdGhlbiBkb3QyLnJhZGl1cyBlbHNlIDBcbiAgICBkaXN0ID0gcjEgKyByMlxuXG4gICAgcmV0dXJuIEBkaXN0YW5jZShkb3QxLnBvc2l0aW9uLCBkb3QyLnBvc2l0aW9uKSA8PSBNYXRoLnNxcnQoZGlzdCAqIGRpc3QpXG5cbiAgbWFwOiAodmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikgLT5cbiAgICByZXR1cm4gbG93MiArIChoaWdoMiAtIGxvdzIpICogKHZhbHVlIC0gbG93MSkgLyAoaGlnaDEgLSBsb3cxKVxuXG4gICMgSGVybWl0ZSBDdXJ2ZVxuICBoZXJtaXRlOiAoeTAsIHkxLCB5MiwgeTMsIG11LCB0ZW5zaW9uLCBiaWFzKS0+XG4gICAgYFxuICAgIHZhciBtMCxtMSxtdTIsbXUzO1xuICAgIHZhciBhMCxhMSxhMixhMztcblxuICAgIG11MiA9IG11ICogbXU7XG4gICAgbXUzID0gbXUyICogbXU7XG4gICAgbTAgID0gKHkxLXkwKSooMStiaWFzKSooMS10ZW5zaW9uKS8yO1xuICAgIG0wICs9ICh5Mi15MSkqKDEtYmlhcykqKDEtdGVuc2lvbikvMjtcbiAgICBtMSAgPSAoeTIteTEpKigxK2JpYXMpKigxLXRlbnNpb24pLzI7XG4gICAgbTEgKz0gKHkzLXkyKSooMS1iaWFzKSooMS10ZW5zaW9uKS8yO1xuICAgIGEwID0gIDIqbXUzIC0gMyptdTIgKyAxO1xuICAgIGExID0gICAgbXUzIC0gMiptdTIgKyBtdTtcbiAgICBhMiA9ICAgIG11MyAtICAgbXUyO1xuICAgIGEzID0gLTIqbXUzICsgMyptdTI7XG4gICAgYFxuICAgIHJldHVybihhMCp5MSthMSptMCthMiptMSthMyp5Milcbn1cblxuXG5fVEhSRUUgPSBfVEhSRUUgfHwge1xuICBIZXJtaXRlQ3VydmU6IChwdHMpLT5cbiAgICBwYXRoID0gbmV3IFRIUkVFLkN1cnZlUGF0aCgpXG4gICAgcGF0aC5hZGQobmV3IFRIUkVFLkhlcm1pdGVCZXppZXJDdXJ2ZTMocHRzWzBdLCBwdHNbMF0sIHB0c1sxXSwgcHRzWzJdKSlcbiAgICBmb3IgaSBpbiBbMC4uKHB0cy5sZW5ndGgtNCldXG4gICAgICBwYXRoLmFkZChuZXcgVEhSRUUuSGVybWl0ZUJlemllckN1cnZlMyhwdHNbaV0sIHB0c1tpKzFdLCBwdHNbaSsyXSwgcHRzW2krM10pKVxuICAgIHBhdGguYWRkKG5ldyBUSFJFRS5IZXJtaXRlQmV6aWVyQ3VydmUzKHB0c1twdHMubGVuZ3RoLTNdLCBwdHNbcHRzLmxlbmd0aC0yXSwgcHRzW3B0cy5sZW5ndGgtMV0sIHB0c1twdHMubGVuZ3RoLTFdKSlcbiAgICByZXR1cm4gcGF0aFxufVxuXG5USFJFRS5DdXJ2ZS5VdGlscy50YW5nZW50SGVybWl0ZUJlemllciA9ICggeTAsIHkxLCB5MiwgeTMsIG11LCB0ZW5zaW9uLCBiaWFzICktPlxuICAgIG11MiA9IG11ICogbXVcbiAgICBtdTMgPSBtdTIgKiBtdVxuXG4gICAgbTAgID0gKHkxLXkwKSooMStiaWFzKSooMS10ZW5zaW9uKS8yXG4gICAgbTAgICs9ICh5Mi15MSkqKDEtYmlhcykqKDEtdGVuc2lvbikvMlxuXG4gICAgbTEgID0gKHkyLXkxKSooMStiaWFzKSooMS10ZW5zaW9uKS8yXG4gICAgbTEgICs9ICh5My15MikqKDEtYmlhcykqKDEtdGVuc2lvbikvMlxuXG4gICAgYTAgID0gIDIqbXUzIC0gMyptdTIgKyAxXG4gICAgYTEgID0gICAgbXUzIC0gMiptdTIgKyBtdVxuICAgIGEyICA9ICAgIG11MyAtICAgbXUyXG4gICAgYTMgID0gLTIqbXUzICsgMyptdTJcblxuICAgIHJldHVybihhMCp5MSthMSptMCthMiptMSthMyp5MilcblxuVEhSRUUuSGVybWl0ZUJlemllckN1cnZlMyA9IFRIUkVFLkN1cnZlLmNyZWF0ZShcbiAgKHYwLCB2MSwgdjIsIHYzKS0+XG4gICAgQHYwID0gdjBcbiAgICBAdjEgPSB2MVxuICAgIEB2MiA9IHYyXG4gICAgQHYzID0gdjNcbiAgICByZXR1cm5cbiAgLCAodCktPlxuICAgIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICB2ZWN0b3IueCA9IFRIUkVFLkN1cnZlLlV0aWxzLnRhbmdlbnRIZXJtaXRlQmV6aWVyKEB2MC54LCBAdjEueCwgQHYyLngsIEB2My54LCB0LCAwLCAwKVxuICAgIHZlY3Rvci55ID0gVEhSRUUuQ3VydmUuVXRpbHMudGFuZ2VudEhlcm1pdGVCZXppZXIoQHYwLnksIEB2MS55LCBAdjIueSwgQHYzLnksIHQsIDAsIDApXG4gICAgdmVjdG9yLnogPSBUSFJFRS5DdXJ2ZS5VdGlscy50YW5nZW50SGVybWl0ZUJlemllcihAdjAueiwgQHYxLnosIEB2Mi56LCBAdjMueiwgdCwgMCwgMClcbiAgICByZXR1cm4gdmVjdG9yXG4pXG5cblRIUkVFLkluTG9vcEN1cnZlID0gVEhSRUUuQ3VydmUuY3JlYXRlKFxuICAodjAsIHN0YXJ0QW5nbGU9MCwgbWF4UmFkaXVzPTEwMCwgbWluUmFkaXVzPTAsIGludmVyc2U9ZmFsc2UsIHVzZUdvbGRlbj1mYWxzZSktPlxuICAgIEB2MCAgICAgICAgID0gdjBcbiAgICBAaW52ZXJzZSAgICA9IGludmVyc2VcbiAgICBAc3RhcnRBbmdsZSA9IHN0YXJ0QW5nbGVcblxuICAgIEBtYXhSYWRpdXMgID0gbWF4UmFkaXVzXG4gICAgQG1pblJhZGl1cyAgPSBtaW5SYWRpdXNcbiAgICBAcmFkaXVzICAgICA9IEBtYXhSYWRpdXMgLSBAbWluUmFkaXVzXG5cbiAgICBAdXNlR29sZGVuICA9IHVzZUdvbGRlblxuXG4gICAgcmV0dXJuXG4gICwgKHQpLT5cbiAgICB0ICAgICA9IDEgLSB0IGlmIEBpbnZlcnNlXG4gICAgaWYgQHVzZUdvbGRlblxuICAgICAgICBwaGkgICA9IChNYXRoLnNxcnQoNSkrMSkvMiAtIDFcbiAgICAgICAgZ29sZGVuX2FuZ2xlID0gcGhpICogTWF0aC5QSSAqIDJcbiAgICAgICAgYW5nbGUgPSBAc3RhcnRBbmdsZSArIChnb2xkZW5fYW5nbGUgKiB0KVxuICAgICAgICBhbmdsZSArPSBNYXRoLlBJICogLTEuMjM1XG4gICAgZWxzZVxuICAgICAgICBhbmdsZSA9IEBzdGFydEFuZ2xlICsgKE1hdGguUEkgKiAyICogdClcblxuICAgIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICB2ZWN0b3IueCA9IEB2MC54ICsgTWF0aC5jb3MoYW5nbGUpICogKEBtaW5SYWRpdXMgKyBAcmFkaXVzICogdClcbiAgICB2ZWN0b3IueSA9IEB2MC55ICsgTWF0aC5zaW4oYW5nbGUpICogKEBtaW5SYWRpdXMgKyBAcmFkaXVzICogdClcbiAgICB2ZWN0b3IueiA9IEB2MC56XG4gICAgcmV0dXJuIHZlY3RvclxuKVxuXG5USFJFRS5MYXVuY2hlZEN1cnZlID0gVEhSRUUuQ3VydmUuY3JlYXRlKFxuICAodjAsIHYxLCBuYkxvb3A9MiktPlxuICAgIEB2MCAgID0gdjBcbiAgICBAdjEgICA9IHYxXG4gICAgQG5iTG9vcCA9IG5iTG9vcFxuICAgIHJldHVyblxuICAsICh0KS0+XG4gICAgYW5nbGUgPSBNYXRoLlBJICogMiAqIHQgKiBAbmJMb29wXG5cbiAgICBkID0gQHYxLnogLSBAdjAuelxuXG4gICAgZGlzdCA9IEB2MS5jbG9uZSgpLnN1YihAdjApXG5cbiAgICB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgdmVjdG9yLnggPSBAdjAueCArIGRpc3QueCAqIHRcbiAgICB2ZWN0b3IueSA9IEB2MC55ICsgZGlzdC55ICogdFxuICAgIHZlY3Rvci56ID0gQHYwLnogKyBkaXN0LnogKiB0XG5cbiAgICB0ID0gTWF0aC5taW4odCwgMSAtIHQpIC8gLjVcblxuICAgIHZlY3Rvci54ICs9IE1hdGguY29zKGFuZ2xlKSAqICg1MCAqIHQpXG4gICAgdmVjdG9yLnkgKz0gTWF0aC5zaW4oYW5nbGUpICogKDUwICogdClcblxuICAgIHJldHVybiB2ZWN0b3JcbilcblxuXG5fRWFzaW5nID0gX0Vhc2luZyB8fCB7XG5cbiAgI1xuICAjICBFYXNpbmcgZnVuY3Rpb24gaW5zcGlyZWQgZnJvbSBBSEVhc2luZ1xuICAjICBodHRwczovL2dpdGh1Yi5jb20vd2FycmVubS9BSEVhc2luZ1xuICAjXG5cbiAgIyMgTW9kZWxlZCBhZnRlciB0aGUgbGluZSB5ID0geFxuICBsaW5lYXI6IChwKS0+XG4gICAgcmV0dXJuIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBhcmFib2xhIHkgPSB4XjJcbiAgUXVhZHJhdGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcFxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGFyYWJvbGEgeSA9IC14XjIgKyAyeFxuICBRdWFkcmF0aWNFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiAtKHAgKiAocCAtIDIpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIHF1YWRyYXRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjIpICAgICAgICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gLSgxLzIpKCgyeC0xKSooMngtMykgLSAxKSA7IFswLjUsIDFdXG4gIFF1YWRyYXRpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDIgKiBwICogcFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoLTIgKiBwICogcCkgKyAoNCAqIHApIC0gMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgY3ViaWMgeSA9IHheM1xuICBDdWJpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBjdWJpYyB5ID0gKHggLSAxKV4zICsgMVxuICBDdWJpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSlcbiAgICByZXR1cm4gZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIGN1YmljXG4gICMgeSA9ICgxLzIpKCgyeCleMykgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKSgoMngtMileMyArIDIpIDsgWzAuNSwgMV1cbiAgQ3ViaWNFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiA0ICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9ICgoMiAqIHApIC0gMilcbiAgICAgIHJldHVybiAwLjUgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHheNFxuICBRdWFydGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHkgPSAxIC0gKHggLSAxKV40XG4gIFF1YXJ0aWNFYXNlT3V0OiAocCktPlxuICAgIGYgPSAocCAtIDEpXG4gICAgcmV0dXJuIGYgKiBmICogZiAqICgxIC0gcCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgcXVhcnRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjQpICAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9IC0oMS8yKSgoMngtMileNCAtIDIpIDsgWzAuNSwgMV1cbiAgUXVhcnRpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDggKiBwICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9IChwIC0gMSlcbiAgICAgIHJldHVybiAtOCAqIGYgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWludGljIHkgPSB4XjVcbiAgUXVpbnRpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwICogcCAqIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1aW50aWMgeSA9ICh4IC0gMSleNSArIDFcbiAgUXVpbnRpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSk7XG4gICAgcmV0dXJuIGYgKiBmICogZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIHF1aW50aWNcbiAgIyB5ID0gKDEvMikoKDJ4KV41KSAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKCgyeC0yKV41ICsgMikgOyBbMC41LCAxXVxuICBRdWludGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMTYgKiBwICogcCAqIHAgKiBwICogcFxuICAgIGVsc2VcbiAgICAgIGYgPSAoKDIgKiBwKSAtIDIpXG4gICAgICByZXR1cm4gIDAuNSAqIGYgKiBmICogZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciBxdWFydGVyLWN5Y2xlIG9mIHNpbmUgd2F2ZVxuICBTaW5lRWFzZUluOiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigocCAtIDEpICogTWF0aC5QSSAqIDIpICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciBxdWFydGVyLWN5Y2xlIG9mIHNpbmUgd2F2ZSAoZGlmZmVyZW50IHBoYXNlKVxuICBTaW5lRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gTWF0aC5zaW4ocCAqIE1hdGguUEkgKiAyKVxuXG4gICMgTW9kZWxlZCBhZnRlciBoYWxmIHNpbmUgd2F2ZVxuICBTaW5lRWFzZUluT3V0OiAocCktPlxuICAgIHJldHVybiAwLjUgKiAoMSAtIE1hdGguY29zKHAgKiBNYXRoLlBJKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgc2hpZnRlZCBxdWFkcmFudCBJViBvZiB1bml0IGNpcmNsZVxuICBDaXJjdWxhckVhc2VJbjogKHApLT5cbiAgICByZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gKHAgKiBwKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgc2hpZnRlZCBxdWFkcmFudCBJSSBvZiB1bml0IGNpcmNsZVxuICBDaXJjdWxhckVhc2VPdXQ6IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc3FydCgoMiAtIHApICogcCk7XG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgY2lyY3VsYXIgZnVuY3Rpb25cbiAgIyB5ID0gKDEvMikoMSAtIHNxcnQoMSAtIDR4XjIpKSAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKShzcXJ0KC0oMnggLSAzKSooMnggLSAxKSkgKyAxKSA7IFswLjUsIDFdXG4gIENpcmN1bGFyRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogKDEgLSBNYXRoLnNxcnQoMSAtIDQgKiAocCAqIHApKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMC41ICogKE1hdGguc3FydCgtKCgyICogcCkgLSAzKSAqICgoMiAqIHApIC0gMSkpICsgMSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGV4cG9uZW50aWFsIGZ1bmN0aW9uIHkgPSAyXigxMCh4IC0gMSkpXG4gIEV4cG9uZW50aWFsRWFzZUluOiAocCktPlxuICAgIHJldHVybiBpZiAocCA9PSAwLjApIHRoZW4gcCBlbHNlIE1hdGgucG93KDIsIDEwICogKHAgLSAxKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGV4cG9uZW50aWFsIGZ1bmN0aW9uIHkgPSAtMl4oLTEweCkgKyAxXG4gIEV4cG9uZW50aWFsRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gaWYgKHAgPT0gMS4wKSB0aGVuIHAgZWxzZSAxIC0gTWF0aC5wb3coMiwgLTEwICogcClcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBleHBvbmVudGlhbFxuICAjIHkgPSAoMS8yKTJeKDEwKDJ4IC0gMSkpICAgICAgICAgOyBbMCwwLjUpXG4gICMgeSA9IC0oMS8yKSoyXigtMTAoMnggLSAxKSkpICsgMSA7IFswLjUsMV1cbiAgRXhwb25lbnRpYWxFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA9PSAwLjAgfHwgcCA9PSAxLjApXG4gICAgICByZXR1cm4gcFxuXG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiBNYXRoLnBvdygyLCAoMjAgKiBwKSAtIDEwKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAtMC41ICogTWF0aC5wb3coMiwgKC0yMCAqIHApICsgMTApICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgZGFtcGVkIHNpbmUgd2F2ZSB5ID0gc2luKDEzcGkvMip4KSpwb3coMiwgMTAgKiAoeCAtIDEpKVxuICBFbGFzdGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigxMyAqIE1hdGguUEkgKiAyICogcCkgKiBNYXRoLnBvdygyLCAxMCAqIChwIC0gMSkpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBkYW1wZWQgc2luZSB3YXZlIHkgPSBzaW4oLTEzcGkvMiooeCArIDEpKSpwb3coMiwgLTEweCkgKyAxXG4gIEVsYXN0aWNFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigtMTMgKiBNYXRoLlBJICogMiAqIChwICsgMSkpICogTWF0aC5wb3coMiwgLTEwICogcCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgZXhwb25lbnRpYWxseS1kYW1wZWQgc2luZSB3YXZlOlxuICAjIHkgPSAoMS8yKSpzaW4oMTNwaS8yKigyKngpKSpwb3coMiwgMTAgKiAoKDIqeCkgLSAxKSkgICAgICA7IFswLDAuNSlcbiAgIyB5ID0gKDEvMikqKHNpbigtMTNwaS8yKigoMngtMSkrMSkpKnBvdygyLC0xMCgyKngtMSkpICsgMikgOyBbMC41LCAxXVxuICBFbGFzdGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogTWF0aC5zaW4oMTMgKiBNYXRoLlBJICogMiAqICgyICogcCkpICogTWF0aC5wb3coMiwgMTAgKiAoKDIgKiBwKSAtIDEpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5zaW4oLTEzICogTWF0aC5QSSAqIDIgKiAoKDIgKiBwIC0gMSkgKyAxKSkgKiBNYXRoLnBvdygyLCAtMTAgKiAoMiAqIHAgLSAxKSkgKyAyKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgb3ZlcnNob290aW5nIGN1YmljIHkgPSB4XjMteCpzaW4oeCpwaSlcbiAgQmFja0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwIC0gcCAqIE1hdGguc2luKHAgKiBNYXRoLlBJKVxuXG4gICMgTW9kZWxlZCBhZnRlciBvdmVyc2hvb3RpbmcgY3ViaWMgeSA9IDEtKCgxLXgpXjMtKDEteCkqc2luKCgxLXgpKnBpKSlcbiAgQmFja0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9ICgxIC0gcClcbiAgICByZXR1cm4gMSAtIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIG92ZXJzaG9vdGluZyBjdWJpYyBmdW5jdGlvbjpcbiAgIyB5ID0gKDEvMikqKCgyeCleMy0oMngpKnNpbigyKngqcGkpKSAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKSooMS0oKDEteCleMy0oMS14KSpzaW4oKDEteCkqcGkpKSsxKSA7IFswLjUsIDFdXG4gIEJhY2tFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIGYgPSAyICogcFxuICAgICAgcmV0dXJuIDAuNSAqIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKVxuICAgIGVsc2VcbiAgICAgIGYgPSAoMSAtICgyKnAgLSAxKSlcbiAgICAgIHJldHVybiAwLjUgKiAoMSAtIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKSkgKyAwLjVcblxuICBCb3VuY2VFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIDEgLSBAQm91bmNlRWFzZU91dCgxIC0gcCk7XG5cbiAgQm91bmNlRWFzZU91dDogKHApLT5cbiAgICBpZihwIDwgNC8xMS4wKVxuICAgICAgcmV0dXJuICgxMjEgKiBwICogcCkvMTYuMFxuICAgIGVsc2UgaWYocCA8IDgvMTEuMClcbiAgICAgIHJldHVybiAoMzYzLzQwLjAgKiBwICogcCkgLSAoOTkvMTAuMCAqIHApICsgMTcvNS4wXG4gICAgZWxzZSBpZihwIDwgOS8xMC4wKVxuICAgICAgcmV0dXJuICg0MzU2LzM2MS4wICogcCAqIHApIC0gKDM1NDQyLzE4MDUuMCAqIHApICsgMTYwNjEvMTgwNS4wXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICg1NC81LjAgKiBwICogcCkgLSAoNTEzLzI1LjAgKiBwKSArIDI2OC8yNS4wXG5cbiAgQm91bmNlRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogQEJvdW5jZUVhc2VJbihwKjIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIDAuNSAqIEBCb3VuY2VFYXNlT3V0KHAgKiAyIC0gMSkgKyAwLjVcblxufVxuXG5cbmNsYXNzIFNQQUNFLlNjZW5lIGV4dGVuZHMgVEhSRUUuU2NlbmVcbiAgX3BhdXNlZDogdHJ1ZVxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyXG5cbiAgICBAdHlwZSAgICAgICAgICAgICA9ICdTY2VuZSdcbiAgICBAZm9nICAgICAgICAgICAgICA9IG51bGxcbiAgICBAb3ZlcnJpZGVNYXRlcmlhbCA9IG51bGxcbiAgICBAYXV0b1VwZGF0ZSAgICAgICA9IHRydWVcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cbiAgICAgIEB1cGRhdGVPYmooY2hpbGQsIGRlbHRhKVxuXG4gIHVwZGF0ZU9iajogKG9iaiwgZGVsdGEpLT5cbiAgICBvYmoudXBkYXRlKGRlbHRhKSBpZiB0eXBlb2Ygb2JqLnVwZGF0ZSA9PSAnZnVuY3Rpb24nXG4gICAgaWYgb2JqLmhhc093blByb3BlcnR5KCdjaGlsZHJlbicpIGFuZCBvYmouY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgICAgZm9yIGNoaWxkIGluIG9iai5jaGlsZHJlblxuICAgICAgICBAdXBkYXRlT2JqKGNoaWxkLCBkZWx0YSlcblxuICByZXNpemU6ID0+XG4gICAgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuICAgICAgQHJlc2l6ZU9iaihjaGlsZClcblxuICByZXNpemVPYmo6IChvYmopLT5cbiAgICBvYmoucmVzaXplKCkgaWYgdHlwZW9mIG9iai5yZXNpemUgPT0gJ2Z1bmN0aW9uJ1xuICAgIGlmIG9iai5oYXNPd25Qcm9wZXJ0eSgnY2hpbGRyZW4nKSBhbmQgb2JqLmNoaWxkcmVuLmxlbmd0aCA+IDBcbiAgICAgIGZvciBjaGlsZCBpbiBvYmouY2hpbGRyZW5cbiAgICAgICAgQHJlc2l6ZU9iaihjaGlsZClcblxuICByZXN1bWU6IC0+XG4gICAgQF9wYXVzZWQgPSBmYWxzZVxuXG4gIHBhdXNlOiAtPlxuICAgIEBfcGF1c2VkID0gdHJ1ZVxuXG4gIGlzUGF1c2VkOiAtPlxuICAgIHJldHVybiBAX3BhdXNlZFxuXG5cbmNsYXNzIFNQQUNFLlNjZW5lTWFuYWdlclxuXG4gIGN1cnJlbnRTY2VuZTogbnVsbFxuICBfc2NlbmVzOiBudWxsXG4gIF9zdGF0czogbnVsbFxuICBfY2xvY2s6IG51bGxcblxuICByZW5kZXJlcjogbnVsbFxuICBjYW1lcmE6ICAgbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBfc2V0dXAoKVxuICAgIEBfZXZlbnRzKClcblxuICAgICMgaWYgKEByZW5kZXJlcikgdGhlbiByZXR1cm4gQFxuXG4gICAgIyBAX2Nsb2NrID0gbmV3IFRIUkVFLkNsb2NrKClcblxuICAgICMgQF9zY2VuZXMgICA9IFtdXG5cbiAgICAjIEBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApXG4gICAgIyAjIEBjYW1lcmEucG9zaXRpb24uc2V0Wig2MDApXG4gICAgIyAjIEBjYW1lcmEucG9zaXRpb24uc2V0WSg1MDApXG4gICAgIyAjIEBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApKVxuXG4gICAgIyBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7YW50aWFsaWFzOiB0cnVlfSlcbiAgICAjICMgQHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4NThiMWZmKSlcbiAgICAjIEByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgIyAjIEByZW5kZXJlci5zaGFkb3dNYXBFbmFibGVkID0gdHJ1ZVxuICAgICMgIyBAcmVuZGVyZXIuc2hhZG93TWFwU29mdCAgICA9IHRydWVcbiAgICAjICMgQHJlbmRlcmVyLnNoYWRvd01hcFR5cGUgICAgPSBUSFJFRS5QQ0ZTaGFkb3dNYXBcbiAgICAjIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJykuYXBwZW5kQ2hpbGQoQHJlbmRlcmVyLmRvbUVsZW1lbnQpXG5cbiAgICAjIEBfc2V0dXBTdGF0cygpIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG5cbiAgICAjIEBfcmVuZGVyKClcbiAgICAjICMgQF91cGRhdGUoKVxuXG4gICAgIyAjIHdpbmRvdy5vbnJlc2l6ZSA9ID0+XG4gICAgIyAjICAgQHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiAgICAjICMgICBAY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0XG4gICAgIyAjICAgQGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcblxuICBfc2V0dXA6IC0+XG4gICAgQF9jbG9jayAgPSBuZXcgVEhSRUUuQ2xvY2soKVxuICAgIEBfc2NlbmVzID0gW11cbiAgICBAY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKVxuICAgIEByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pXG4gICAgQHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpLmFwcGVuZENoaWxkKEByZW5kZXJlci5kb21FbGVtZW50KVxuXG4gICAgQF9zZXR1cFN0YXRzKCkgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcbiAgICBAX3JlbmRlcigpXG5cbiAgX2V2ZW50czogLT5cbiAgICB3aW5kb3cub25yZXNpemUgPSBAX2VPblJlc2l6ZVxuXG4gIF9lT25SZXNpemU6ID0+XG4gICAgQHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiAgICBAY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0XG4gICAgQGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcblxuICBfc2V0dXBTdGF0czogLT5cbiAgICBAX3N0YXRzID0gbmV3IFN0YXRzKClcbiAgICBAX3N0YXRzLnNldE1vZGUoMClcbiAgICBAX3N0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gICAgQF9zdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4J1xuICAgIEBfc3RhdHMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4J1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIEBfc3RhdHMuZG9tRWxlbWVudCApXG5cbiAgX3JlbmRlcjogPT5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKEBfcmVuZGVyKVxuXG4gICAgaWYgIUBjdXJyZW50U2NlbmUgb3IgQGN1cnJlbnRTY2VuZS5pc1BhdXNlZCgpXG4gICAgICAgIHJldHVyblxuXG4gICAgQGN1cnJlbnRTY2VuZS51cGRhdGUoQF9jbG9jay5nZXREZWx0YSgpICogMTAwMClcbiAgICBAcmVuZGVyZXIucmVuZGVyKCBAY3VycmVudFNjZW5lLCBAY2FtZXJhIClcblxuICAgIEBfc3RhdHMudXBkYXRlKCkgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcblxuICBjcmVhdGVTY2VuZTogKGlkZW50aWZpZXIpLT5cbiAgICBpZiBAX3NjZW5lc1tpZGVudGlmaWVyXVxuICAgICAgICByZXR1cm4gQF9zY2VuZXNbaWRlbnRpZmllcl1cblxuICAgIHRyeVxuICAgICAgc2NlbmUgPSBuZXcgKGV2YWwoXCJTUEFDRS5cIitpZGVudGlmaWVyKSkoKVxuICAgICAgQF9zY2VuZXNbaWRlbnRpZmllcl0gPSBzY2VuZVxuICAgIGNhdGNoIGVcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgcmV0dXJuIHNjZW5lXG5cbiAgZ29Ub1NjZW5lOiAoaWRlbnRpZmllciktPlxuICAgIGlmIEBfc2NlbmVzW2lkZW50aWZpZXJdXG4gICAgICAgIEBjdXJyZW50U2NlbmUucGF1c2UoKSBpZiBAY3VycmVudFNjZW5lXG4gICAgICAgIEBjdXJyZW50U2NlbmUgPSBAX3NjZW5lc1tpZGVudGlmaWVyXVxuICAgICAgICBAY3VycmVudFNjZW5lLnJlc3VtZSgpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgYWxlcnQoXCJTY2VuZSAnXCIraWRlbnRpZmllcitcIicgZG9lc24ndCBleGlzdFwiKVxuICAgIHJldHVybiBmYWxzZVxuXG5cbmNsYXNzIFNQQUNFLk1haW5TY2VuZSBleHRlbmRzIFNQQUNFLlNjZW5lXG5cbiAgX21hbmFnZXI6IG51bGxcbiAgX2p1a2Vib3g6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlcigpXG5cbiAgcmVzdW1lOiAtPlxuICAgIEBfbWFuYWdlciA9IFNQQUNFLlNjZW5lTWFuYWdlclxuXG4gICAgIyBTZXR1cCByZW5kZXJlclxuICAgIEBfbWFuYWdlci5jYW1lcmEucG9zaXRpb24uc2V0Wig2MDApXG4gICAgIyBAX21hbmFnZXIucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbylcbiAgICAjIEBfbWFuYWdlci5yZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDU4YjFmZikpXG4gICAgIyBAX21hbmFnZXIucmVuZGVyZXIuc2hhZG93TWFwRW5hYmxlZCA9IHRydWVcbiAgICAjIEBfbWFuYWdlci5yZW5kZXJlci5zaGFkb3dNYXBTb2Z0ICAgID0gdHJ1ZVxuICAgICMgQF9tYW5hZ2VyLnJlbmRlcmVyLnNoYWRvd01hcFR5cGUgICAgPSBUSFJFRS5QQ0ZTaGFkb3dNYXBcblxuICAgICMgQ3JlYXRlIGEgU0Mgc2luZ2xldG9uXG4gICAgU1BBQ0UuU0MgPSBuZXcgU1BBQ0UuU291bmRDbG91ZChTUEFDRS5TQy5pZCwgU1BBQ0UuU0MucmVkaXJlY3RfdXJpKVxuXG4gICAgQF9ldmVudHMoKVxuICAgIEBfc2V0dXAoKSBpZiBTUEFDRS5TQy5pc0Nvbm5lY3RlZCgpXG5cbiAgcGF1c2U6IC0+XG5cbiAgdXBkYXRlOiAtPlxuICAgICMgQF9qdWtlYm94LnVwZGF0ZSgpIGlmIEBfanVrZWJveFxuXG4gIF9ldmVudHM6IC0+XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihTUEFDRS5Tb3VuZENsb3VkLklTX0NPTk5FQ1RFRCwgQF9lU0NJc0Nvbm5lY3RlZClcblxuICBfZVNDSXNDb25uZWN0ZWQ6ID0+XG4gICAgQF9zZXR1cCgpXG5cbiAgX3NldHVwOiA9PlxuICAgIHdpbmRvdy5maXJzdExhdW5jaCA9IHRydWVcblxuICAgIEBfanVrZWJveCA9IG5ldyBTUEFDRS5KdWtlYm94KClcbiAgICAjIEBfanVrZWJveC5hZGQoJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vYm9uLWVudGVuZGV1ci1tdXNpYy9sZXBlcmUnKVxuICAgICMgQF9qdWtlYm94LmFkZCh0cnVlKVxuXG4gICAgc21hbGwgPSBuZXcgU1BBQ0UuRXF1YWxpemVyKHtcbiAgICAgIG1pbkxlbmd0aDogMFxuICAgICAgbWF4TGVuZ3RoOiAyMDBcbiAgICAgIHJhZGl1czogMzAwXG4gICAgICBjb2xvcjogMHhGRkZGRkZcbiAgICAgIGFic29sdXRlOiBmYWxzZVxuICAgICAgbGluZUZvcmNlRG93bjogLjVcbiAgICAgIGxpbmVGb3JjZVVwOiAxXG4gICAgfSlcbiAgICBAYWRkKHNtYWxsKVxuXG4gICAgYmlnID0gbmV3IFNQQUNFLkVxdWFsaXplcih7XG4gICAgICBtaW5MZW5ndGg6IDBcbiAgICAgIG1heExlbmd0aDogNTBcbiAgICAgIHJhZGl1czogMzAwXG4gICAgICBjb2xvcjogMHhEMUQxRDFcbiAgICAgIGFic29sdXRlOiBmYWxzZVxuICAgICAgbGluZUZvcmNlRG93bjogLjVcbiAgICAgIGxpbmVGb3JjZVVwOiAxXG4gICAgfSlcbiAgICBAYWRkKGJpZylcblxuICAjIGVxdWFsaXplcjogbnVsbFxuICAjIGp1a2Vib3g6ICAgbnVsbFxuXG4gICMgbG9hZGluZ01hbmFnZXI6IG51bGxcbiAgIyBsb2FkZXI6ICAgICAgICAgbnVsbFxuXG4gICMgY29uc3RydWN0b3I6IC0+XG4gICMgICBzdXBlclxuXG4gICMgICBAX2V2ZW50cygpXG5cbiAgIyAgICMgQ3JlYXRlIGEgU0Mgc2luZ2xldG9uXG4gICMgICB1bmxlc3MgU1BBQ0UuaGFzT3duUHJvcGVydHkoJ1NDJylcbiAgIyAgICAgU1BBQ0UuU0MgPSBuZXcgU1BBQ0UuU291bmRDbG91ZChTUEFDRS5TT1VORENMT1VELmlkLCBTUEFDRS5TT1VORENMT1VELnJlZGlyZWN0X3VyaSlcbiAgIyAgIEBTQyA9IFNQQUNFLlNDXG5cbiAgIyAgICMgTG9hZGluZyBNYW5hZ2VyXG4gICMgICBAbG9hZGluZ01hbmFnZXIgICAgICAgICAgICA9IG5ldyBUSFJFRS5Mb2FkaW5nTWFuYWdlcigpXG4gICMgICBAbG9hZGluZ01hbmFnZXIub25Qcm9ncmVzcyA9IEBfZW52aXJvbm1lbnRPblByb2dyZXNzXG4gICMgICBAbG9hZGVyICAgICAgICAgICAgICAgICAgICA9IG5ldyBUSFJFRS5YSFJMb2FkZXIoQGxvYWRpbmdNYW5hZ2VyKVxuXG4gICMgICAjIExvYWQgdGhlIGRlZmF1bHQgZW52aXJvbm1lbnRcbiAgIyAgIEBfbG9hZEVudmlyb25tZW50KCdkZWZhdWx0JywgWydFYXJ0aCcsICdJY29zYWhlZHJvbiddLCBAX2Vudmlyb25tZW50TG9hZGVkKVxuICAjICAgIyBAX2xvYWRFbnZpcm9ubWVudCgnZXZvbHV0aW9uJywgWydTcGVlZHdhbGsnXSwgQF9lbnZpcm9ubWVudExvYWRlZClcblxuICAjICAgQHNldHVwKCkgaWYgQFNDLmlzQ29ubmVjdGVkKClcblxuICAjIF9ldmVudHM6IC0+XG4gICMgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFNQQUNFLlNvdW5kQ2xvdWQuSVNfQ09OTkVDVEVELnR5cGUsIEBzZXR1cClcblxuICAjIHNldHVwOiA9PlxuICAjICAgU1BBQ0UuSnVrZWJveCAgICAgICAgID0gbmV3IFNQQUNFLkp1a2Vib3godGhpcylcbiAgIyAgIEBqdWtlYm94ICAgICAgICAgICAgICA9IFNQQUNFLkp1a2Vib3hcbiAgIyAgIEBqdWtlYm94LndoaWxlcGxheWluZyA9IEBfd2hpbGVwbGF5aW5nXG4gICMgICAjIEBqdWtlYm94LnByZWRlZmluZWRQbGF5bGlzdCgpXG4gICMgICAjIEBqdWtlYm94LnNlYXJjaCgna2F5dHJhbmFkYScpXG5cbiAgIyBfbG9hZEVudmlyb25tZW50OiAobmFtZSwgZmlsZXMsIGNhbGxiYWNrKS0+XG4gICMgICBTUEFDRVtuYW1lLnRvVXBwZXJDYXNlKCldID0gU1BBQ0VbbmFtZS50b1VwcGVyQ2FzZSgpXSB8fCB7fVxuICAjICAgQGxvYWRpbmdNYW5hZ2VyLm9uTG9hZCAgICA9IChyKS0+XG4gICMgICAgIGNhbGxiYWNrKG5hbWUpXG5cbiAgIyAgIGZpbGVzLnB1c2goJ1NldHVwJylcbiAgIyAgIGZvciBmaWxlIGluIGZpbGVzXG4gICMgICAgIHJldHVybiBpZiBTUEFDRVtuYW1lLnRvVXBwZXJDYXNlKCldLmhhc093blByb3BlcnR5KGZpbGUpXG4gICMgICAgIEBsb2FkZXIubG9hZCgnc2NyaXB0cy9lbnZpcm9ubWVudHMvJytuYW1lKycvJytmaWxlKycuanMnKVxuXG4gICMgX2Vudmlyb25tZW50T25Qcm9ncmVzczogKGl0ZW0sIGxvYWRlZCwgdG90YWwpPT5cbiAgIyAgIG9iamVjdE5hbWUgPSBpdGVtLnJlcGxhY2UoLyguK1xcL3xcXC5qcykvZywgJycpXG4gICMgICBlbnZOYW1lICAgID0gKGl0ZW0uc3BsaXQoL1xcLy8pWzJdKS50b1VwcGVyQ2FzZSgpXG4gICMgICBvYmplY3QgICAgID0gZXZhbChAbG9hZGVyLmNhY2hlLmZpbGVzW2l0ZW1dKVxuICAjICAgU1BBQ0VbZW52TmFtZV1bb2JqZWN0TmFtZV0gPSBvYmplY3RcblxuICAjIF9lbnZpcm9ubWVudExvYWRlZDogKG5hbWUpPT5cbiAgIyAgIGlmIEBlbnZpcm9ubWVudFxuICAjICAgICBAZW52aXJvbm1lbnQub25FeGl0ID0+XG4gICMgICAgICAgQHJlbW92ZShAZW52aXJvbm1lbnQpXG4gICMgICAgIEBlbnZpcm9ubWVudCA9IG51bGxcbiAgIyAgIEBlbnZpcm9ubWVudCA9IG5ldyBTUEFDRVtuYW1lLnRvVXBwZXJDYXNlKCldLlNldHVwKEBqdWtlYm94KVxuICAjICAgQGFkZChAZW52aXJvbm1lbnQpXG4gICMgICBAZW52aXJvbm1lbnQub25FbnRlciggPT5cbiAgIyAgICAgU1BBQ0UuTE9HICdFbnZpcm9ubWVudCBkaXNwbGF5ZWQnXG4gICMgICApXG5cbiAgIyB1cGRhdGU6IChkZWx0YSktPlxuICAjICAgc3VwZXIoZGVsdGEpXG4gICMgICBAanVrZWJveC51cGRhdGUoZGVsdGEpIGlmIEBqdWtlYm94XG5cblxuY2xhc3MgU1BBQ0UuU291bmRDbG91ZFxuXG4gIGNsaWVudF9pZDogICAgbnVsbFxuICByZWRpcmVjdF91cmk6IG51bGxcbiAgdG9rZW46ICAgICAgICBudWxsXG5cbiAgQElTX0NPTk5FQ1RFRDogJ3NvdW5kY2xvdWRfY29ubmVjdGVkJyMoLT4gcmV0dXJuIG5ldyBFdmVudCgnc291bmRjbG91ZF9jb25uZWN0ZWQnKSkoKVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIHJlZGlyZWN0X3VyaSktPlxuICAgIFNDLmluaXRpYWxpemUoe1xuICAgICAgY2xpZW50X2lkOiBpZFxuICAgICAgcmVkaXJlY3RfdXJpOiByZWRpcmVjdF91cmlcbiAgICB9KVxuXG4gICAgQGNsaWVudF9pZCAgICA9IGlkXG4gICAgQHJlZGlyZWN0X3VyaSA9IHJlZGlyZWN0X3VyaVxuXG4gICAgaWYgbm90IEBpc0Nvbm5lY3RlZCgpIGFuZCBTUEFDRS5FTlYgPT0gJ2RldmVsb3BtZW50J1xuICAgICAgZG9jdW1lbnQuY29va2llID0gXCJzb3VuZGNsb3VkX3Rva2VuPTEtODAyNjktMTE0NTcxMTYtMDQwMjlhMTRiZGZjMjg2XCJcbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IFwic291bmRjbG91ZF9jb25uZWN0ZWQ9dHJ1ZVwiXG5cbiAgaXNDb25uZWN0ZWQ6IC0+XG4gICAgaWYgKGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKC8oPzooPzpefC4qO1xccyopc291bmRjbG91ZF9jb25uZWN0ZWRcXHMqXFw9XFxzKihbXjtdKikuKiQpfF4uKiQvLCBcIiQxXCIpICE9IFwidHJ1ZVwiKVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ2luJykuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIEBfZUNsaWNrKVxuICAgIGVsc2VcbiAgICAgIEB0b2tlbiA9IGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKC8oPzooPzpefC4qO1xccyopc291bmRjbG91ZF90b2tlblxccypcXD1cXHMqKFteO10qKS4qJCl8Xi4qJC8sIFwiJDFcIilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgX2VDbGljazogPT5cbiAgICBTQy5jb25uZWN0KD0+XG4gICAgICBAdG9rZW4gICAgICAgICAgPSBTQy5hY2Nlc3NUb2tlbigpXG4gICAgICBkb2N1bWVudC5jb29raWUgPSBcInNvdW5kY2xvdWRfdG9rZW49XCIgKyBAdG9rZW5cbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IFwic291bmRjbG91ZF9jb25uZWN0ZWQ9dHJ1ZVwiXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW4nKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcbiAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLlNvdW5kQ2xvdWQuSVNfQ09OTkVDVEVEKVxuICAgIClcblxuICBwYXRoT3JVcmw6IChwYXRoLCBjYWxsYmFjayktPlxuICAgICMgVmVyaWZ5IGlmIGl0J3MgYW4gSUQgb3IgYW4gVVJMXG4gICAgaWYgL15cXC8ocGxheWxpc3RzfHRyYWNrc3x1c2VycylcXC9bMC05XSskLy50ZXN0KHBhdGgpXG4gICAgICByZXR1cm4gY2FsbGJhY2socGF0aClcblxuICAgIHVubGVzcyAvXihodHRwfGh0dHBzKS8udGVzdChwYXRoKVxuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nIFwiXFxcIlwiICsgcGF0aCArIFwiXFxcIiBpcyBub3QgYW4gdXJsIG9yIGEgcGF0aFwiXG5cbiAgICBTQy5nZXQoJy9yZXNvbHZlJywgeyB1cmw6IHBhdGggfSwgKHRyYWNrLCBlcnJvcik9PlxuICAgICAgaWYgKGVycm9yKVxuICAgICAgICBjb25zb2xlLmxvZyBlcnJvci5tZXNzYWdlXG4gICAgICBlbHNlXG4gICAgICAgIHVybCA9IFsnJywgdHJhY2sua2luZCsncycsIHRyYWNrLmlkXS5qb2luKCcvJylcbiAgICAgICAgY2FsbGJhY2sodXJsKVxuICAgIClcblxuICBzdHJlYW1Tb3VuZDogKG9iamVjdCwgb3B0aW9ucz17fSwgY2FsbGJhY2spLT5cbiAgICBpZiBvYmplY3QgYW5kIG9iamVjdC5oYXNPd25Qcm9wZXJ0eSgna2luZCcpXG4gICAgICBwYXRoID0gb2JqZWN0LnVyaS5yZXBsYWNlKCdodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbScsICcnKVxuXG4gICAgICBkZWZhdWx0cyA9XG4gICAgICAgIGF1dG9QbGF5OiB0cnVlXG4gICAgICAgIHVzZVdhdmVmb3JtRGF0YTogdHJ1ZVxuICAgICAgICB1c2VIVE1MNWF1ZGlvOiB0cnVlXG4gICAgICAgIHByZWZlckZsYXNoOiBmYWxzZVxuXG4gICAgICBvcHRpb25zID0gX0NvZmZlZS5tZXJnZShkZWZhdWx0cywgb3B0aW9ucylcbiAgICAgIFNDLnN0cmVhbShwYXRoLCBvcHRpb25zLCBjYWxsYmFjaylcblxuICBnZXRTb3VuZE9yUGxheWxpc3Q6IChwYXRoLCBjYWxsYmFjayktPlxuICAgIGlmIHR5cGVvZiBwYXRoID09ICdvYmplY3QnIGFuZCBwYXRoLmhhc093blByb3BlcnR5KCdraW5kJylcbiAgICAgIGNhbGxiYWNrKHBhdGgpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgQHBhdGhPclVybChwYXRoLCAocGF0aCk9PlxuICAgICAgQGdldChwYXRoLCBjYWxsYmFjaylcbiAgICApXG5cbiAgZ2V0OiAocGF0aCwgY2FsbGJhY2spLT5cbiAgICBTQy5nZXQocGF0aCwgY2FsbGJhY2spXG5cbiAgZ2V0U291bmRVcmw6IChwYXRoLCBjYWxsYmFjayktPlxuICAgIEBnZXRTb3VuZE9yUGxheWxpc3QocGF0aCwgKHNvdW5kKT0+XG4gICAgICBjYWxsYmFjayhzb3VuZC5zdHJlYW1fdXJsKyc/b2F1dGhfdG9rZW49JytAdG9rZW4pXG4gICAgKVxuXG4gIHNlYXJjaDogKHNlYXJjaCwgcGF0aCwgY2FsbGJhY2spLT5cbiAgICBpZiB0eXBlb2YgcGF0aCA9PSAnZnVuY3Rpb24nXG4gICAgICBjYWxsYmFjayA9IHBhdGhcbiAgICAgIHBhdGggICAgID0gJ3RyYWNrcydcblxuICAgIGlmIHBhdGggPT0gJ3VzZXJzJ1xuICAgICAgQHBhdGhPclVybCgnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS8nK3NlYXJjaCwgKHBhdGgpPT5cbiAgICAgICAgcGF0aCA9IHBhdGgrJy9mYXZvcml0ZXM/b2F1dGhfdG9rZW49JytAdG9rZW5cbiAgICAgICAgU0MuZ2V0KHBhdGgsIGNhbGxiYWNrKVxuICAgICAgKVxuICAgIGVsc2VcbiAgICAgIHBhdGggPSAnLycrcGF0aCsnP29hdXRoX3Rva2VuPScrQHRva2VuKycmcT0nK3NlYXJjaFxuICAgICAgU0MuZ2V0KHBhdGgsIGNhbGxiYWNrKVxuXG5cbmNsYXNzIFNQQUNFLlNlYXJjaEVuZ2luZVxuICBTQzogbnVsbFxuICBqdWtlYm94OiBudWxsXG5cbiAgIyBIVE1MXG4gIGlucHV0OiAgICAgICAgIG51bGxcbiAgbGlzdDogICAgICAgICAgbnVsbFxuICBsaXN0Q29udGFpbmVyOiBudWxsXG4gIGVsOiAgICAgICAgICAgIG51bGxcbiAgbGluZUhlaWdodDogICAgMFxuICByZXN1bHRzSGVpZ2h0OiAwXG4gIHJlc3VsdHM6ICAgICAgIG51bGxcbiAgZm9jdXNlZDogICAgICAgbnVsbFxuXG4gIHNjcm9sbFBvczogICAgIDBcblxuICBAc3RhdGU6ICBudWxsXG5cblxuICBjb25zdHJ1Y3RvcjogKGp1a2Vib3gpLT5cbiAgICBAanVrZWJveCAgICAgICA9IGp1a2Vib3hcbiAgICBAU0MgICAgICAgICAgICA9IFNQQUNFLlNDXG5cbiAgICBAZWwgICAgICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gnKVxuICAgIEBpbnB1dCAgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCBmb3JtIGlucHV0JylcbiAgICBAbGlzdCAgICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2ggLmxpc3QnKVxuICAgIEBsaXN0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCB1bCcpXG5cbiAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEKVxuICAgIEBfZXZlbnRzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2ggZm9ybScpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIEBfZUp1a2Vib3hJc1NlYXJjaGluZylcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIEBfZUtleXByZXNzKVxuXG4gIF9lSnVrZWJveElzU2VhcmNoaW5nOiAoZSk9PlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEBzZWFyY2goQGlucHV0LnZhbHVlKSBpZiBAaW5wdXQudmFsdWUubGVuZ3RoID4gMFxuXG4gIF9lS2V5cHJlc3M6IChlKT0+XG4gICAgc3dpdGNoKGUua2V5Q29kZSlcbiAgICAgIHdoZW4gS2V5Ym9hcmQuRU5URVJcbiAgICAgICAgaWYgQGlucHV0LnZhbHVlLmxlbmd0aCA9PSAwXG4gICAgICAgICAgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLkNMT1NFRFxuICAgICAgICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLk9QRU5FRClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBTZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0ggYW5kIEBmb2N1c2VkXG4gICAgICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBTZWFyY2hFbmdpbmVTdGF0ZS5UUkFDS19TRUxFQ1RFRFxuICAgICAgICAgIEBhZGQoKVxuXG4gICAgICB3aGVuIEtleWJvYXJkLlVQXG4gICAgICAgIEB1cCgpIGlmIEBzdGF0ZSA9PSBTZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcblxuICAgICAgd2hlbiBLZXlib2FyZC5ET1dOXG4gICAgICAgIEBkb3duKCkgaWYgQHN0YXRlID09IFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSFxuXG4gICAgICB3aGVuIEtleWJvYXJkLkVTQywgS2V5Ym9hcmQuREVMRVRFXG4gICAgICAgIGlmIEBzdGF0ZSA9PSBTZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcbiAgICAgICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBTZWFyY2hFbmdpbmVTdGF0ZS5UUkFDS19TRUxFQ1RFRFxuICAgICAgICAgIEBzZXRTdGF0ZShTZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0gpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAc2V0U3RhdGUoU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEKVxuXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIHN3aXRjaCBAc3RhdGVcbiAgICAgIHdoZW4gU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEXG4gICAgICAgIEBlbC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgICAgICBAZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VhcmNoX29wZW4nKVxuXG4gICAgICAgIEBpbnB1dC52YWx1ZSAgICA9ICcnXG4gICAgICAgIEBpbnB1dC5kaXNhYmxlZCA9IGZhbHNlXG4gICAgICAgIEBpbnB1dC5mb2N1cygpXG5cbiAgICAgICAgQHJlc2V0KClcbiAgICAgIHdoZW4gU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEXG4gICAgICAgIEBlbC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgICAgd2hlbiBTZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5hZGQoJ3NlYXJjaF9vcGVuJylcblxuICAgICAgICBAaW5wdXQuZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgIEBpbnB1dC5ibHVyKClcblxuICAgICAgICBAbGluZUhlaWdodCAgICA9IEBsaXN0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2xpJykub2Zmc2V0SGVpZ2h0XG4gICAgICAgIEByZXN1bHRzSGVpZ2h0ID0gQGxpbmVIZWlnaHQgKiAoQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGgtMSlcblxuICAgICAgICBAZm9jdXNlZC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpIGlmIEBmb2N1c2VkXG4gICAgICAgIEBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpdGVtX3NlbGVjdGVkJylcbiAgICAgIHdoZW4gU2VhcmNoRW5naW5lU3RhdGUuVFJBQ0tfU0VMRUNURURcbiAgICAgICAgQGZvY3VzZWQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgICBAZWwuY2xhc3NMaXN0LmFkZCgnaXRlbV9zZWxlY3RlZCcpXG5cbiAgdXA6IC0+XG4gICAgbmV4dCA9IEBzY3JvbGxQb3MgKyBAbGluZUhlaWdodFxuICAgIGlmIG5leHQgPD0gMFxuICAgICAgQHNjcm9sbFBvcyA9IG5leHRcbiAgICAgIEBmb2N1cygpXG5cbiAgZG93bjogLT5cbiAgICBuZXh0ID0gQHNjcm9sbFBvcyAtIEBsaW5lSGVpZ2h0XG4gICAgaWYgTWF0aC5hYnMobmV4dCkgPD0gQHJlc3VsdHNIZWlnaHRcbiAgICAgIEBzY3JvbGxQb3MgPSBuZXh0XG4gICAgICBAZm9jdXMoKVxuXG4gIGZvY3VzOiA9PlxuICAgIGlmIEBsaXN0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykubGVuZ3RoID4gMVxuICAgICAgJChbQGxpc3RDb250YWluZXIsIEBpbnB1dF0pLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAnK0BzY3JvbGxQb3MrJ3B4KScpXG4gICAgICBwb3MgPSAoQHNjcm9sbFBvcyotMSkgLyAoQHJlc3VsdHNIZWlnaHQgLyAoQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGgtMSkpXG4gICAgICBwb3MgPSBNYXRoLmZsb29yKHBvcylcbiAgICAgIGVsbSA9IEBlbC5xdWVyeVNlbGVjdG9yKCdsaTpudGgtY2hpbGQoJysocG9zKzEpKycpJylcblxuICAgICAgaWYgZWxtLmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpXG4gICAgICAgIEBmb2N1c2VkLmNsYXNzTGlzdC5yZW1vdmUoJ2ZvY3VzZWQnKSBpZiBAZm9jdXNlZFxuICAgICAgICBAZm9jdXNlZCA9IGVsbVxuICAgICAgICBAZm9jdXNlZC5jbGFzc0xpc3QuYWRkKCdmb2N1c2VkJylcbiAgICAgIGVsc2VcbiAgICAgICAgQGZvY3VzZWQgPSBudWxsXG4gICAgZWxzZVxuICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLk9QRU5FRClcbiAgICAgICMgJChbQGxpc3RDb250YWluZXIsIEBpbnB1dF0pLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAwKScpXG5cbiAgcmVzZXQ6IC0+XG4gICAgQGZvY3VzZWQgICA9IG51bGxcbiAgICBAc2Nyb2xsUG9zID0gMFxuICAgICQoW0BsaXN0Q29udGFpbmVyLCBAaW5wdXRdKS5jc3MoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgJytAc2Nyb2xsUG9zKydweCknKVxuICAgIEBsaXN0Q29udGFpbmVyLmlubmVySFRNTCA9ICcnXG5cbiAgYWRkOiAtPlxuICAgIGluZGV4ID0gQGZvY3VzZWQuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JylcbiAgICB0cmFjayA9IEByZXN1bHRzW2luZGV4XVxuICAgIEBqdWtlYm94LmFkZCh0cmFjaykgaWYgdHJhY2tcblxuICAgIEBmb2N1c2VkLmNsYXNzTGlzdC5hZGQoJ2FkZGVkJylcbiAgICAkKEBmb2N1c2VkKS5jc3Moe1xuICAgICAgJ3RyYW5zZm9ybSc6ICdzY2FsZSguNzUpIHRyYW5zbGF0ZVgoJyt3aW5kb3cuaW5uZXJXaWR0aCsncHgpJ1xuICAgIH0pXG5cbiAgICBzZXRUaW1lb3V0KD0+XG4gICAgICBAZm9jdXNlZC5yZW1vdmUoKVxuICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSClcbiAgICAgIEB1cCgpIGlmIEBmb2N1c2VkLm5leHRTaWJsaW5nXG4gICAgICBAZm9jdXMoKVxuICAgICwgNTAwKVxuXG4gIHNlYXJjaDogKHZhbHVlKS0+XG4gICAgcGF0aCA9IHZhbHVlLnNwbGl0KC9cXHMvKVswXVxuICAgIGlmIC9eKHRyYWNrfHRyYWNrc3xwbGF5bGlzdHxwbGF5bGlzdHN8c2V0fHNldHN8dXNlcnx1c2VycykkLy50ZXN0KHBhdGgpXG4gICAgICBsYXN0Q2hhciA9IHBhdGguY2hhckF0KHBhdGgubGVuZ3RoLTEpXG4gICAgICB2YWx1ZSAgICA9IHZhbHVlLnJlcGxhY2UocGF0aCsnICcsICcnKVxuICAgICAgcGF0aCAgICAgKz0gJ3MnIGlmIGxhc3RDaGFyICE9ICdzJ1xuICAgICAgcGF0aCAgICAgPSAncGxheWxpc3RzJyBpZiAvc2V0cy8udGVzdChwYXRoKVxuICAgIGVsc2VcbiAgICAgIHBhdGggICAgID0gJ3RyYWNrcydcblxuICAgIHN0cmluZyA9ICcnJ1xuICAgICAgW1xuICAgICAgICB7XCJraW5kXCI6XCJ0cmFja1wiLFwiaWRcIjo2MzI1NjkwNixcImNyZWF0ZWRfYXRcIjpcIjIwMTIvMTAvMTMgMTA6NDc6MTYgKzAwMDBcIixcInVzZXJfaWRcIjo3ODgyMDUsXCJkdXJhdGlvblwiOjIzNzg0MCxcImNvbW1lbnRhYmxlXCI6dHJ1ZSxcInN0YXRlXCI6XCJmaW5pc2hlZFwiLFwib3JpZ2luYWxfY29udGVudF9zaXplXCI6OTU0MzE2OCxcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTIvMjIgMjE6MDE6MTcgKzAwMDBcIixcInNoYXJpbmdcIjpcInB1YmxpY1wiLFwidGFnX2xpc3RcIjpcIlwiLFwicGVybWFsaW5rXCI6XCJqYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcInN0cmVhbWFibGVcIjp0cnVlLFwiZW1iZWRkYWJsZV9ieVwiOlwiYWxsXCIsXCJkb3dubG9hZGFibGVcIjp0cnVlLFwicHVyY2hhc2VfdXJsXCI6XCJodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9pZFwiOm51bGwsXCJwdXJjaGFzZV90aXRsZVwiOlwiQWx0ZXJuYXRlIFZlcnNpb24gRExcIixcImdlbnJlXCI6XCJQb3Bsb2NraW4gTXVzaWNcIixcInRpdGxlXCI6XCJKYW5ldCBKYWNrc29uIC0gSWYgKEtheXRyYW5hZGEgUmVtaXgpXCIsXCJkZXNjcmlwdGlvblwiOlwiQWx0ZXJuYXRlIFZlcnNpb24sIGZvciBESnMsIHdlbGwsIHRoYXRzIHRoZSB2ZXJzaW9uIGkgdXNlIGZvciBteSBkaiBzZXRzOyBodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9uYW1lXCI6XCJcIixcInJlbGVhc2VcIjpcIlwiLFwidHJhY2tfdHlwZVwiOlwicmVtaXhcIixcImtleV9zaWduYXR1cmVcIjpcIlwiLFwiaXNyY1wiOlwiXCIsXCJ2aWRlb191cmxcIjpudWxsLFwiYnBtXCI6bnVsbCxcInJlbGVhc2VfeWVhclwiOm51bGwsXCJyZWxlYXNlX21vbnRoXCI6bnVsbCxcInJlbGVhc2VfZGF5XCI6bnVsbCxcIm9yaWdpbmFsX2Zvcm1hdFwiOlwibXAzXCIsXCJsaWNlbnNlXCI6XCJhbGwtcmlnaHRzLXJlc2VydmVkXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNlwiLFwidXNlclwiOntcImlkXCI6Nzg4MjA1LFwia2luZFwiOlwidXNlclwiLFwicGVybWFsaW5rXCI6XCJrYXl0cmFuYWRhXCIsXCJ1c2VybmFtZVwiOlwiS0FZVFJBTkFEQVwiLFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMS8wNyAwNDoxMTozNiArMDAwMFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS91c2Vycy83ODgyMDVcIixcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhXCIsXCJhdmF0YXJfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAwNzQ4MDM2OTQtcWlieHQ0LWxhcmdlLmpwZ1wifSxcInVzZXJfcGxheWJhY2tfY291bnRcIjoxLFwidXNlcl9mYXZvcml0ZVwiOnRydWUsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYS9qYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcImFydHdvcmtfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtMDAwMDMyMDk0NTk3LTU2dHM3bi1sYXJnZS5qcGdcIixcIndhdmVmb3JtX3VybFwiOlwiaHR0cHM6Ly93MS5zbmRjZG4uY29tL2FxUkdpNERtYkNXel9tLnBuZ1wiLFwic3RyZWFtX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L3N0cmVhbVwiLFwiZG93bmxvYWRfdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvZG93bmxvYWRcIixcInBsYXliYWNrX2NvdW50XCI6MzMzMTAzMyxcImRvd25sb2FkX2NvdW50XCI6OTYxMTIsXCJmYXZvcml0aW5nc19jb3VudFwiOjY2NjUzLFwiY29tbWVudF9jb3VudFwiOjE1OTQsXCJhdHRhY2htZW50c191cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9hdHRhY2htZW50c1wiLFwicG9saWN5XCI6XCJBTExPV1wifSxcbiAgICAgICAge1wia2luZFwiOlwidHJhY2tcIixcImlkXCI6NjMyNTY5MDYsXCJjcmVhdGVkX2F0XCI6XCIyMDEyLzEwLzEzIDEwOjQ3OjE2ICswMDAwXCIsXCJ1c2VyX2lkXCI6Nzg4MjA1LFwiZHVyYXRpb25cIjoyMzc4NDAsXCJjb21tZW50YWJsZVwiOnRydWUsXCJzdGF0ZVwiOlwiZmluaXNoZWRcIixcIm9yaWdpbmFsX2NvbnRlbnRfc2l6ZVwiOjk1NDMxNjgsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzEyLzIyIDIxOjAxOjE3ICswMDAwXCIsXCJzaGFyaW5nXCI6XCJwdWJsaWNcIixcInRhZ19saXN0XCI6XCJcIixcInBlcm1hbGlua1wiOlwiamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJzdHJlYW1hYmxlXCI6dHJ1ZSxcImVtYmVkZGFibGVfYnlcIjpcImFsbFwiLFwiZG93bmxvYWRhYmxlXCI6dHJ1ZSxcInB1cmNoYXNlX3VybFwiOlwiaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfaWRcIjpudWxsLFwicHVyY2hhc2VfdGl0bGVcIjpcIkFsdGVybmF0ZSBWZXJzaW9uIERMXCIsXCJnZW5yZVwiOlwiUG9wbG9ja2luIE11c2ljXCIsXCJ0aXRsZVwiOlwiSmFuZXQgSmFja3NvbiAtIElmIChLYXl0cmFuYWRhIFJlbWl4KVwiLFwiZGVzY3JpcHRpb25cIjpcIkFsdGVybmF0ZSBWZXJzaW9uLCBmb3IgREpzLCB3ZWxsLCB0aGF0cyB0aGUgdmVyc2lvbiBpIHVzZSBmb3IgbXkgZGogc2V0czsgaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfbmFtZVwiOlwiXCIsXCJyZWxlYXNlXCI6XCJcIixcInRyYWNrX3R5cGVcIjpcInJlbWl4XCIsXCJrZXlfc2lnbmF0dXJlXCI6XCJcIixcImlzcmNcIjpcIlwiLFwidmlkZW9fdXJsXCI6bnVsbCxcImJwbVwiOm51bGwsXCJyZWxlYXNlX3llYXJcIjpudWxsLFwicmVsZWFzZV9tb250aFwiOm51bGwsXCJyZWxlYXNlX2RheVwiOm51bGwsXCJvcmlnaW5hbF9mb3JtYXRcIjpcIm1wM1wiLFwibGljZW5zZVwiOlwiYWxsLXJpZ2h0cy1yZXNlcnZlZFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDZcIixcInVzZXJcIjp7XCJpZFwiOjc4ODIwNSxcImtpbmRcIjpcInVzZXJcIixcInBlcm1hbGlua1wiOlwia2F5dHJhbmFkYVwiLFwidXNlcm5hbWVcIjpcIktBWVRSQU5BREFcIixcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTEvMDcgMDQ6MTE6MzYgKzAwMDBcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdXNlcnMvNzg4MjA1XCIsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYVwiLFwiYXZhdGFyX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2F2YXRhcnMtMDAwMDc0ODAzNjk0LXFpYnh0NC1sYXJnZS5qcGdcIn0sXCJ1c2VyX3BsYXliYWNrX2NvdW50XCI6MSxcInVzZXJfZmF2b3JpdGVcIjp0cnVlLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGEvamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJhcnR3b3JrX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2FydHdvcmtzLTAwMDAzMjA5NDU5Ny01NnRzN24tbGFyZ2UuanBnXCIsXCJ3YXZlZm9ybV91cmxcIjpcImh0dHBzOi8vdzEuc25kY2RuLmNvbS9hcVJHaTREbWJDV3pfbS5wbmdcIixcInN0cmVhbV91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9zdHJlYW1cIixcImRvd25sb2FkX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2Rvd25sb2FkXCIsXCJwbGF5YmFja19jb3VudFwiOjMzMzEwMzMsXCJkb3dubG9hZF9jb3VudFwiOjk2MTEyLFwiZmF2b3JpdGluZ3NfY291bnRcIjo2NjY1MyxcImNvbW1lbnRfY291bnRcIjoxNTk0LFwiYXR0YWNobWVudHNfdXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvYXR0YWNobWVudHNcIixcInBvbGljeVwiOlwiQUxMT1dcIn0sXG4gICAgICAgIHtcImtpbmRcIjpcInRyYWNrXCIsXCJpZFwiOjYzMjU2OTA2LFwiY3JlYXRlZF9hdFwiOlwiMjAxMi8xMC8xMyAxMDo0NzoxNiArMDAwMFwiLFwidXNlcl9pZFwiOjc4ODIwNSxcImR1cmF0aW9uXCI6MjM3ODQwLFwiY29tbWVudGFibGVcIjp0cnVlLFwic3RhdGVcIjpcImZpbmlzaGVkXCIsXCJvcmlnaW5hbF9jb250ZW50X3NpemVcIjo5NTQzMTY4LFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMi8yMiAyMTowMToxNyArMDAwMFwiLFwic2hhcmluZ1wiOlwicHVibGljXCIsXCJ0YWdfbGlzdFwiOlwiXCIsXCJwZXJtYWxpbmtcIjpcImphbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwic3RyZWFtYWJsZVwiOnRydWUsXCJlbWJlZGRhYmxlX2J5XCI6XCJhbGxcIixcImRvd25sb2FkYWJsZVwiOnRydWUsXCJwdXJjaGFzZV91cmxcIjpcImh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX2lkXCI6bnVsbCxcInB1cmNoYXNlX3RpdGxlXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiBETFwiLFwiZ2VucmVcIjpcIlBvcGxvY2tpbiBNdXNpY1wiLFwidGl0bGVcIjpcIkphbmV0IEphY2tzb24gLSBJZiAoS2F5dHJhbmFkYSBSZW1peClcIixcImRlc2NyaXB0aW9uXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiwgZm9yIERKcywgd2VsbCwgdGhhdHMgdGhlIHZlcnNpb24gaSB1c2UgZm9yIG15IGRqIHNldHM7IGh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX25hbWVcIjpcIlwiLFwicmVsZWFzZVwiOlwiXCIsXCJ0cmFja190eXBlXCI6XCJyZW1peFwiLFwia2V5X3NpZ25hdHVyZVwiOlwiXCIsXCJpc3JjXCI6XCJcIixcInZpZGVvX3VybFwiOm51bGwsXCJicG1cIjpudWxsLFwicmVsZWFzZV95ZWFyXCI6bnVsbCxcInJlbGVhc2VfbW9udGhcIjpudWxsLFwicmVsZWFzZV9kYXlcIjpudWxsLFwib3JpZ2luYWxfZm9ybWF0XCI6XCJtcDNcIixcImxpY2Vuc2VcIjpcImFsbC1yaWdodHMtcmVzZXJ2ZWRcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2XCIsXCJ1c2VyXCI6e1wiaWRcIjo3ODgyMDUsXCJraW5kXCI6XCJ1c2VyXCIsXCJwZXJtYWxpbmtcIjpcImtheXRyYW5hZGFcIixcInVzZXJuYW1lXCI6XCJLQVlUUkFOQURBXCIsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzExLzA3IDA0OjExOjM2ICswMDAwXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3VzZXJzLzc4ODIwNVwiLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGFcIixcImF2YXRhcl91cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hdmF0YXJzLTAwMDA3NDgwMzY5NC1xaWJ4dDQtbGFyZ2UuanBnXCJ9LFwidXNlcl9wbGF5YmFja19jb3VudFwiOjEsXCJ1c2VyX2Zhdm9yaXRlXCI6dHJ1ZSxcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhL2phbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwiYXJ0d29ya191cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hcnR3b3Jrcy0wMDAwMzIwOTQ1OTctNTZ0czduLWxhcmdlLmpwZ1wiLFwid2F2ZWZvcm1fdXJsXCI6XCJodHRwczovL3cxLnNuZGNkbi5jb20vYXFSR2k0RG1iQ1d6X20ucG5nXCIsXCJzdHJlYW1fdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvc3RyZWFtXCIsXCJkb3dubG9hZF91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9kb3dubG9hZFwiLFwicGxheWJhY2tfY291bnRcIjozMzMxMDMzLFwiZG93bmxvYWRfY291bnRcIjo5NjExMixcImZhdm9yaXRpbmdzX2NvdW50XCI6NjY2NTMsXCJjb21tZW50X2NvdW50XCI6MTU5NCxcImF0dGFjaG1lbnRzX3VyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2F0dGFjaG1lbnRzXCIsXCJwb2xpY3lcIjpcIkFMTE9XXCJ9LFxuICAgICAgICB7XCJraW5kXCI6XCJ0cmFja1wiLFwiaWRcIjo2MzI1NjkwNixcImNyZWF0ZWRfYXRcIjpcIjIwMTIvMTAvMTMgMTA6NDc6MTYgKzAwMDBcIixcInVzZXJfaWRcIjo3ODgyMDUsXCJkdXJhdGlvblwiOjIzNzg0MCxcImNvbW1lbnRhYmxlXCI6dHJ1ZSxcInN0YXRlXCI6XCJmaW5pc2hlZFwiLFwib3JpZ2luYWxfY29udGVudF9zaXplXCI6OTU0MzE2OCxcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTIvMjIgMjE6MDE6MTcgKzAwMDBcIixcInNoYXJpbmdcIjpcInB1YmxpY1wiLFwidGFnX2xpc3RcIjpcIlwiLFwicGVybWFsaW5rXCI6XCJqYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcInN0cmVhbWFibGVcIjp0cnVlLFwiZW1iZWRkYWJsZV9ieVwiOlwiYWxsXCIsXCJkb3dubG9hZGFibGVcIjp0cnVlLFwicHVyY2hhc2VfdXJsXCI6XCJodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9pZFwiOm51bGwsXCJwdXJjaGFzZV90aXRsZVwiOlwiQWx0ZXJuYXRlIFZlcnNpb24gRExcIixcImdlbnJlXCI6XCJQb3Bsb2NraW4gTXVzaWNcIixcInRpdGxlXCI6XCJKYW5ldCBKYWNrc29uIC0gSWYgKEtheXRyYW5hZGEgUmVtaXgpXCIsXCJkZXNjcmlwdGlvblwiOlwiQWx0ZXJuYXRlIFZlcnNpb24sIGZvciBESnMsIHdlbGwsIHRoYXRzIHRoZSB2ZXJzaW9uIGkgdXNlIGZvciBteSBkaiBzZXRzOyBodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9uYW1lXCI6XCJcIixcInJlbGVhc2VcIjpcIlwiLFwidHJhY2tfdHlwZVwiOlwicmVtaXhcIixcImtleV9zaWduYXR1cmVcIjpcIlwiLFwiaXNyY1wiOlwiXCIsXCJ2aWRlb191cmxcIjpudWxsLFwiYnBtXCI6bnVsbCxcInJlbGVhc2VfeWVhclwiOm51bGwsXCJyZWxlYXNlX21vbnRoXCI6bnVsbCxcInJlbGVhc2VfZGF5XCI6bnVsbCxcIm9yaWdpbmFsX2Zvcm1hdFwiOlwibXAzXCIsXCJsaWNlbnNlXCI6XCJhbGwtcmlnaHRzLXJlc2VydmVkXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNlwiLFwidXNlclwiOntcImlkXCI6Nzg4MjA1LFwia2luZFwiOlwidXNlclwiLFwicGVybWFsaW5rXCI6XCJrYXl0cmFuYWRhXCIsXCJ1c2VybmFtZVwiOlwiS0FZVFJBTkFEQVwiLFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMS8wNyAwNDoxMTozNiArMDAwMFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS91c2Vycy83ODgyMDVcIixcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhXCIsXCJhdmF0YXJfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAwNzQ4MDM2OTQtcWlieHQ0LWxhcmdlLmpwZ1wifSxcInVzZXJfcGxheWJhY2tfY291bnRcIjoxLFwidXNlcl9mYXZvcml0ZVwiOnRydWUsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYS9qYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcImFydHdvcmtfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtMDAwMDMyMDk0NTk3LTU2dHM3bi1sYXJnZS5qcGdcIixcIndhdmVmb3JtX3VybFwiOlwiaHR0cHM6Ly93MS5zbmRjZG4uY29tL2FxUkdpNERtYkNXel9tLnBuZ1wiLFwic3RyZWFtX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L3N0cmVhbVwiLFwiZG93bmxvYWRfdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvZG93bmxvYWRcIixcInBsYXliYWNrX2NvdW50XCI6MzMzMTAzMyxcImRvd25sb2FkX2NvdW50XCI6OTYxMTIsXCJmYXZvcml0aW5nc19jb3VudFwiOjY2NjUzLFwiY29tbWVudF9jb3VudFwiOjE1OTQsXCJhdHRhY2htZW50c191cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9hdHRhY2htZW50c1wiLFwicG9saWN5XCI6XCJBTExPV1wifVxuICAgICAgXVxuICAgICcnJ1xuXG4gICAgcmVzdWx0cyA9IEpTT04ucGFyc2Uoc3RyaW5nKVxuXG4gICAgQGlucHV0LnZhbHVlID0gJ0xvb2tpbmcgZm9yIFwiJyt2YWx1ZSsnXCInXG4gICAgQFNDLnNlYXJjaCh2YWx1ZSwgcGF0aCwgKHJlc3VsdHMpPT5cbiAgICAgIGNvbnNvbGUubG9nIHJlc3VsdHNcbiAgICAgIGlmIHJlc3VsdHMubGVuZ3RoID09IDBcbiAgICAgICAgQGlucHV0LnZhbHVlID0gJ1wiJyt2YWx1ZSsnXCIgaGFzIG5vIHJlc3VsdCdcbiAgICAgICAgcmV0dXJuXG4gICAgICBlbHNlXG4gICAgICAgIEBpbnB1dC52YWx1ZSA9ICdSZXN1bHRzIGZvciBcIicrdmFsdWUrJ1wiJ1xuXG4gICAgICBAcmVzdWx0cyAgICAgPSBbXVxuICAgICAgQGxpc3RDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSlcbiAgICAgIGZvciB0cmFjaywgaSBpbiByZXN1bHRzXG4gICAgICAgIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgICAgICBsaS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBpKVxuXG4gICAgICAgIGFydHdvcmtfdXJsID0gdHJhY2suYXJ0d29ya191cmxcbiAgICAgICAgYXJ0d29ya191cmwgPSAnaW1hZ2VzL25vX2FydHdvcmsuZ2lmJyB1bmxlc3MgYXJ0d29ya191cmxcbiAgICAgICAgbGkuaW5uZXJIVE1MID0gXCJcIlwiXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiI3thcnR3b3JrX3VybH1cIiBhbHQ9XCJcIiBvbmVycm9yPVwidGhpcy5zcmM9J2ltYWdlcy9ub19hcnR3b3JrLmdpZidcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxwPiN7dHJhY2sudGl0bGV9PC9wPlxuICAgICAgICAgICAgICA8cD4je3RyYWNrLnVzZXIudXNlcm5hbWUudG9Mb3dlckNhc2UoKX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgXCJcIlwiXG4gICAgICAgIEByZXN1bHRzLnB1c2godHJhY2spXG4gICAgICAgIEBsaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKGxpKVxuICAgICAgQHNldFN0YXRlKFNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSClcbiAgICApXG5cblxuY2xhc3MgU1BBQ0UuSnVrZWJveFxuXG4gICMgU3RhdGVzXG4gIEBJU19XQUlUSU5HOiAgICdqdWtlYm94X2lzX3dhaXRpbmcnXG4gIEBJU19RVUVVSU5HOiAgICdqdWtlYm94X2lzX3F1ZXVpbmcnXG5cbiAgIyBQcm9wZXJ0aWVzXG4gIGN1cnJlbnQ6ICAgICAgbnVsbFxuICBwbGF5bGlzdDogICAgIG51bGxcbiAgc2VhcmNoRW5naW5lOiBudWxsXG4gIFNDOiAgICAgICAgICAgbnVsbFxuXG4gIHN0YXRlOiAgICAgbnVsbFxuXG4gIF9uZXh0RGVsYXk6IDBcbiAgX25leHRUaW1lb3V0OiBudWxsXG4gIF9yZWZyZXNoRGVsYXk6IDEwMDBcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAcGxheWxpc3QgICAgID0gW11cbiAgICBAc2VhcmNoRW5naW5lID0gbmV3IFNQQUNFLlNlYXJjaEVuZ2luZSgpXG4gICAgQFNDICAgICAgICAgICA9IFNQQUNFLlNDXG5cbiAgICBAaW5wdXRUeXBlICAgID0gJ1dlYkF1ZGlvQVBJJ1xuXG4gICAgQHNldFN0YXRlKFNQQUNFLkp1a2Vib3guSVNfV0FJVElORylcbiAgICBAX3JlZnJlc2goKVxuICAgIEBfZXZlbnRzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoU1BBQ0UuVHJhY2suSVNfU1RPUFBFRCwgQF9lVHJhY2tJc1N0b3BwZWQpXG5cbiAgX2VUcmFja0lzU3RvcHBlZDogPT5cbiAgICBAc2V0U3RhdGUoU1BBQ0UuSnVrZWJveC5JU19XQUlUSU5HKVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIHN3aXRjaCBAc3RhdGVcbiAgICAgIHdoZW4gU1BBQ0UuSnVrZWJveC5JU19XQUlUSU5HXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLkp1a2Vib3guSVNfV0FJVElORywgeyBqdWtlYm94OiB0aGlzIH0pXG4gICAgICB3aGVuIFNQQUNFLkp1a2Vib3guSVNfUVVFVUlOR1xuICAgICAgICBIRUxQRVIudHJpZ2dlcihTUEFDRS5KdWtlYm94LklTX1FVRVVJTkcsIHsganVrZWJveDogdGhpcyB9KVxuXG4gIF9jcmVhdGVUcmFjazogKGRhdGEsIGlucHV0TW9kZT1mYWxzZSktPlxuICAgIHRyYWNrICAgICAgICAgICA9IG5ldyBTUEFDRS5UcmFjaygpXG4gICAgdHJhY2suaW5wdXRNb2RlID0gaW5wdXRNb2RlXG4gICAgdHJhY2suc2V0RGF0YShkYXRhKVxuICAgIEBwbGF5bGlzdC5wdXNoKHRyYWNrKVxuXG4gIF9yZWZyZXNoOiA9PlxuICAgIGlmIEBwbGF5bGlzdC5sZW5ndGggPiAwIGFuZCBAc3RhdGUgPT0gU1BBQ0UuSnVrZWJveC5JU19XQUlUSU5HXG4gICAgICBAbmV4dCgpXG5cbiAgICBzZXRUaW1lb3V0KEBfcmVmcmVzaCwgQF9yZWZyZXNoRGVsYXkpXG5cbiAgYWRkOiAodXJsT3JJbnB1dCktPlxuICAgIGlmIHR5cGVvZiB1cmxPcklucHV0ID09ICdib29sZWFuJyBhbmQgdXJsT3JJbnB1dFxuICAgICAgQF9jcmVhdGVUcmFjayh7fSwgdHJ1ZSkgXG4gICAgICByZXR1cm5cblxuICAgIEBTQy5nZXRTb3VuZE9yUGxheWxpc3QgdXJsT3JJbnB1dCwgKG8pPT5cbiAgICAgIHRyYWNrcyA9IG51bGxcbiAgICAgIGlmIG8uaGFzT3duUHJvcGVydHkoJ3RyYWNrcycpXG4gICAgICAgIHRyYWNrcyA9IG8udHJhY2tzXG4gICAgICBlbHNlXG4gICAgICAgIHRyYWNrcyA9IFtvXVxuXG4gICAgICBmb3IgZGF0YSBpbiB0cmFja3NcbiAgICAgICAgQF9jcmVhdGVUcmFjayhkYXRhLCBmYWxzZSlcblxuICByZW1vdmU6IChpbmRleCktPlxuICAgIHJldHVybiBpZiBAaW5wdXRUeXBlID09ICdNaWNyb3Bob25lJ1xuICAgIEBwbGF5bGlzdC5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgbW92ZTogKGluZGV4MSwgaW5kZXgyKS0+XG4gICAgcmV0dXJuIGlmIEBpbnB1dFR5cGUgPT0gJ01pY3JvcGhvbmUnXG5cbiAgICB0bXAgICAgICAgICAgICAgICA9IEBwbGF5bGlzdFtpbmRleDFdXG4gICAgQHBsYXlsaXN0W2luZGV4MV0gPSBAcGxheWxpc3RbaW5kZXgyXVxuICAgIEBwbGF5bGlzdFtpbmRleDJdID0gdG1wXG5cbiAgc2VhcmNoOiAodmFsdWUpLT5cbiAgICByZXR1cm4gaWYgQGlucHV0VHlwZSA9PSAnTWljcm9waG9uZSdcbiAgICBAc2VhcmNoRW5naW5lLnNlYXJjaCh2YWx1ZSlcblxuICBuZXh0OiAtPlxuICAgIHJldHVybiBpZiBAaW5wdXRUeXBlID09ICdNaWNyb3Bob25lJ1xuXG4gICAgY2xlYXJUaW1lb3V0KEBfbmV4dFRpbWVvdXQpIGlmIEBfbmV4dFRpbWVvdXQgXG5cbiAgICBAc2V0U3RhdGUoU1BBQ0UuSnVrZWJveC5JU19RVUVVSU5HKVxuICAgIEBfbmV4dFRpbWVvdXQgPSBzZXRUaW1lb3V0ID0+XG4gICAgICBAY3VycmVudC5zdG9wKCkgaWYgQGN1cnJlbnRcbiAgICAgIGlmIEBwbGF5bGlzdC5sZW5ndGggPiAwXG4gICAgICAgIEBjdXJyZW50ID0gQHBsYXlsaXN0LnNoaWZ0KClcbiAgICAgICAgQGN1cnJlbnQubG9hZCgpXG4gICAgLCBAX25leHREZWxheVxuXG5cbmNsYXNzIFNQQUNFLlRyYWNrXG5cbiAgIyBTVEFURVNcbiAgQElTX1dBSVRJTkc6ICd0cmFja19pc193YWl0aW5nJ1xuICBAV0lMTF9QTEFZOiAgJ3RyYWNrX3dpbGxfcGxheSdcbiAgQElTX1BMQVlJTkc6ICd0cmFja19pc19wbGF5aW5nJ1xuICBASVNfUEFVU0VEOiAgJ3RyYWNrX2lzX3BhdXNlZCdcbiAgQElTX1NUT1BQRUQ6ICd0cmFja19pc19zdG9wcGVkJ1xuXG4gIEBBUElUeXBlOlxuICAgIFNvdW5kTWFuYWdlcjI6ICdTb3VuZE1hbmFnZXIyJ1xuICAgIFdlYkF1ZGlvQVBJOiAgICdXZWJBdWRpb0FQSSdcbiAgICBKU09OOiAgICAgICAgICAnSlNPTidcblxuICAjIFByb3BlcnRpZXNcbiAgX1NDOiAgICAgIG51bGxcbiAgX2RhdGE6ICAgIG51bGxcbiAgX0FQSVR5cGU6IG51bGxcbiAgX0FQSTogICAgIG51bGxcblxuICB0aW1lZGF0YTogbnVsbFxuXG4gIGF1dG9wbGF5OiB0cnVlXG4gIHN0YXRlOiAgICBudWxsXG5cbiAgbG9hZGluZ3Byb2dyZXNzaW9uOiAwXG4gIGlucHV0TW9kZTogICAgICAgICAgZmFsc2VcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAX1NDICAgICAgPSBTUEFDRS5TQ1xuICAgIEBfQVBJVHlwZSA9IFNQQUNFLlRyYWNrLkFQSVR5cGUuV2ViQXVkaW9BUElcbiAgICBAc2V0U3RhdGUoU1BBQ0UuVHJhY2suSVNfV0FJVElORylcblxuICAjXG4gICMgU2V0dGVyc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIHNldERhdGE6IChkYXRhKS0+XG4gICAgQF9kYXRhID0gZGF0YVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIHN3aXRjaCBAc3RhdGVcbiAgICAgIHdoZW4gU1BBQ0UuVHJhY2suSVNfV0FJVElOR1xuICAgICAgICBIRUxQRVIudHJpZ2dlcihTUEFDRS5UcmFjay5JU19XQUlUSU5HLCB7IHRyYWNrOiB0aGlzIH0pXG4gICAgICB3aGVuIFNQQUNFLlRyYWNrLldJTExfUExBWVxuICAgICAgICBAdGltZWRhdGEgPSBBcnJheSgyNTYpXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLlRyYWNrLldJTExfUExBWSwgeyB0cmFjazogdGhpcyB9KVxuICAgICAgd2hlbiBTUEFDRS5UcmFjay5JU19QTEFZSU5HXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLlRyYWNrLklTX1BMQVlJTkcsIHsgdHJhY2s6IHRoaXMgfSlcbiAgICAgIHdoZW4gU1BBQ0UuVHJhY2suSVNfUEFVU0VEXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLlRyYWNrLklTX1BBVVNFRCwgeyB0cmFjazogdGhpcyB9KVxuICAgICAgd2hlbiBTUEFDRS5UcmFjay5JU19TVE9QUEVEXG4gICAgICAgIEhFTFBFUi50cmlnZ2VyKFNQQUNFLlRyYWNrLklTX1NUT1BQRUQsIHsgdHJhY2s6IHRoaXMgfSlcblxuICAjXG4gICMgUHVibGljIG1ldGhvZHNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBsb2FkOiAtPlxuICAgIEBzZXRTdGF0ZShTUEFDRS5UcmFjay5XSUxMX1BMQVkpXG5cbiAgICBpZiBAaW5wdXRNb2RlXG4gICAgICBAX3dlYmF1ZGlvYXBpKClcbiAgICBlbHNlIGlmIEBfQVBJVHlwZSA9PSAnV2ViQXVkaW9BUEknXG4gICAgICBAX1NDLmdldFNvdW5kVXJsKCcvdHJhY2tzLycrQF9kYXRhLmlkLCBAX3dlYmF1ZGlvYXBpKVxuICAgIGVsc2VcbiAgICAgIEBfc291bmRtYW5hZ2VyMigpXG5cbiAgcGxheTogLT5cbiAgICBAX0FQSS5wbGF5KClcblxuICBwYXVzZTogLT5cbiAgICBAX0FQSS5wYXVzZSgpXG5cbiAgc3RvcDogLT5cbiAgICBAX0FQSS5zdG9wKClcblxuICB2b2x1bWU6ICh2YWx1ZSktPlxuICAgIEBfQVBJLnZvbHVtZSh2YWx1ZSlcblxuICBkZXN0cm95OiAtPlxuICAgIHN3aXRjaCBAX0FQSVR5cGVcbiAgICAgIHdoZW4gU1BBQ0UuVHJhY2suQVBJVHlwZS5Tb3VuZE1hbmFnZXIyXG4gICAgICAgIEBfQVBJLmRlc3RydWN0KClcbiAgICAgIHdoZW4gU1BBQ0UuVHJhY2suQVBJVHlwZS5XZWJBdWRpb0FQSVxuICAgICAgICBAX0FQSS5kZXN0cm95KClcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2coJ3NvbWV0aGluZyB0byBkZXN0cm95IGhlcmUnKVxuXG4gICNcbiAgIyBQcml2YXRlIG1ldGhvZHNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBfb25zdGFydDogKGFwaSk9PlxuICAgIEBfQVBJICAgICAgICAgICA9IGFwaVxuICAgIHdpbmRvdy5BdWRpb0FQSSA9IGFwaVxuXG4gIF9vbnBsYXk6ID0+XG4gICAgQHNldFN0YXRlKFNQQUNFLlRyYWNrLklTX1BMQVlJTkcpXG5cbiAgX29ucGF1c2U6ID0+XG4gICAgQHNldFN0YXRlKFNQQUNFLlRyYWNrLklTX1BBVVNFRClcblxuICBfb25zdG9wOiA9PlxuICAgIEBzZXRTdGF0ZShTUEFDRS5UcmFjay5JU19TVE9QUEVEKVxuXG4gIF9vbmVuZGVkOiA9PlxuICAgIEBzZXRTdGF0ZShTUEFDRS5UcmFjay5JU19TVE9QUEVEKVxuXG4gIF9vbmxvYWRpbmdwcm9ncmVzczogKHZhbHVlKT0+XG4gICAgQGxvYWRpbmdwcm9ncmVzc2lvbiA9IHZhbHVlXG5cbiAgX3doaWxlcGxheWluZzogPT5cbiAgICBzd2l0Y2ggQF9BUElUeXBlXG4gICAgICB3aGVuIFNQQUNFLlRyYWNrLkFQSVR5cGUuU291bmRNYW5hZ2VyMlxuICAgICAgICBmb3IgaSBpbiBbMC4uMjU1XVxuICAgICAgICAgIEB0aW1lZGF0YVtpXSA9IE1hdGgubWF4KEBzb3VuZC53YXZlZm9ybURhdGEubGVmdFtpXSwgQHNvdW5kLndhdmVmb3JtRGF0YS5yaWdodFtpXSlcbiAgICAgIFxuICAgICAgd2hlbiBTUEFDRS5UcmFjay5BUElUeXBlLldlYkF1ZGlvQVBJXG4gICAgICAgIGFuYWx5c2VyID0gQF9BUEkuYW5hbHlzZXJcbiAgICAgICAgdW5sZXNzIGFuYWx5c2VyLmdldEZsb2F0VGltZURvbWFpbkRhdGFcbiAgICAgICAgICBhcnJheSAgICA9ICBuZXcgVWludDhBcnJheShhbmFseXNlci5mZnRTaXplKVxuICAgICAgICAgIGFuYWx5c2VyLmdldEJ5dGVUaW1lRG9tYWluRGF0YShhcnJheSlcbiAgICAgICAgICBmb3IgaSBpbiBbMC4uMjU1XVxuICAgICAgICAgICAgQHRpbWVkYXRhW2ldID0gKGFycmF5W2ldIC0gMTI4KSAvIDEyOFxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXJyYXkgICAgPSAgbmV3IEZsb2F0MzJBcnJheShhbmFseXNlci5mZnRTaXplKVxuICAgICAgICAgIGFuYWx5c2VyLmdldEZsb2F0VGltZURvbWFpbkRhdGEoYXJyYXkpXG4gICAgICAgICAgZm9yIGkgaW4gWzAuLjI1NV1cbiAgICAgICAgICAgIEB0aW1lZGF0YVtpXSA9IGFycmF5W2ldXG5cbiAgX3dlYmF1ZGlvYXBpOiAodXJsKT0+XG4gICAgdW5sZXNzIHdpbmRvdy5maXJzdExhdW5jaFxuICAgICAgZmlyc3RMYXVuY2ggPSBmYWxzZVxuICAgICAgQGF1dG9wbGF5ICAgPSBmYWxzZSBpZiAvbW9iaWxlL2dpLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudClcbiAgICBlbHNlIFxuICAgICAgQGF1dG9wbGF5ID0gdHJ1ZSAgXG5cbiAgICBAX0FQSSAgICAgICAgICAgICAgICAgICA9IFdlYkF1ZGlvQVBJXG4gICAgQF9BUEkub25wbGF5ICAgICAgICAgICAgPSBAX29ucGxheVxuICAgIEBfQVBJLm9uZW5kZWQgICAgICAgICAgID0gQF9vbmVuZGVkXG4gICAgQF9BUEkub25wYXVzZSAgICAgICAgICAgPSBAX29ucGF1c2VcbiAgICBAX0FQSS5vbnN0b3AgICAgICAgICAgICA9IEBfb25zdG9wXG4gICAgQF9BUEkub25hdWRpb3Byb2Nlc3MgICAgPSBAX3doaWxlcGxheWluZ1xuICAgIEBfQVBJLm9ubG9hZGluZ3Byb2dyZXNzID0gQF9vbmxvYWRpbmdwcm9ncmVzc1xuICAgIFxuICAgIGlmIEBpbnB1dE1vZGVcbiAgICAgIEBfQVBJLmlucHV0TW9kZSA9IHRydWUgXG4gICAgICBAX0FQSS5zdHJlYW1JbnB1dCgpXG4gICAgZWxzZVxuICAgICAgQF9BUEkuaW5wdXRNb2RlID0gZmFsc2UgXG4gICAgICBAX0FQSS5zZXRVcmwodXJsLCBAYXV0b3BsYXksIEBfb25zdGFydCkgICAgXG5cbiAgX3NvdW5kbWFuYWdlcjI6IC0+XG4gICAgQF9TQy5zdHJlYW1Tb3VuZChAX2RhdGEsIHtcbiAgICAgIG9ucGxheSAgICAgICA6IEBfb25wbGF5XG4gICAgICBvbmZpbmlzaCAgICAgOiBAX29uZW5kZWRcbiAgICAgIG9uc3RvcCAgICAgICA6IEBfb25zdG9wXG4gICAgICB3aGlsZXBsYXlpbmcgOiBAX3doaWxlcGxheWluZ1xuICAgICAgd2hpbGVsb2FkaW5nIDogPT5cbiAgICAgICAgQF9vbmxvYWRpbmdwcm9ncmVzcyhAX0FQSS5ieXRlc0xvYWRlZCAvIEBfQVBJLmJ5dGVzVG90YWwpXG4gICAgfSwgQF9vbnN0YXJ0KVxuXG5cbmNsYXNzIFdlYkF1ZGlvQVBJXG5cbiAgIyBTdGF0ZVxuICBASVNfUExBWUlORzogJ3dlYmF1ZGlvYXBpX2lzX3BsYXlpbmcnXG4gIEBJU19QQVVTRUQ6ICAnd2ViYXVkaW9hcGlfaXNfcGF1c2VkJ1xuICBASVNfU1RPUFBFRDogJ3dlYmF1ZGlvYXBpX2lzX3N0b3BwZWQnXG4gIEBJU19FTkRFRDogICAnd2ViYXVkaW9hcGlfaXNfZW5kZWQnXG5cbiAgIyBQcm9wZXJ0aWVzXG4gIGlkZW50aWZpZXI6ICdXZWJBdWRpb0FQSSdcblxuICBjdHg6ICAgICAgIG51bGxcbiAgYW5hbHlzZXI6ICBudWxsXG4gIHByb2Nlc3NvcjogbnVsbFxuICBidWZmZXI6ICAgIG51bGxcbiAgc3JjOiAgICAgICBudWxsXG5cbiAgc3RhcnRUaW1lOiAwXG4gIHBvc2l0aW9uOiAgMFxuICBkdXJhdGlvbjogIDBcblxuICB0aW1lOiAwXG5cbiAgaXNMb2FkZWQ6IGZhbHNlXG5cbiAgc3RhdGU6IG51bGxcblxuICBfdmVuZG9yVVJMOiBudWxsXG4gIF9pbnB1dE1vZGU6ICAgZmFsc2VcblxuICAjIyBTZXR1cCBXZWIgQXVkaW8gQVBJXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgICMgU2V0dXAgQXVkaW9Db250ZXh0XG4gICAgdHJ5XG4gICAgICBpZiAod2luZG93LkF1ZGlvQ29udGV4dE9iamVjdCA9PSB1bmRlZmluZWQpXG4gICAgICAgIHdpbmRvdy5BdWRpb0NvbnRleHRPYmplY3QgPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHR8fHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKClcbiAgICBjYXRjaCBlXG4gICAgICBpZiAoQXBwLmVudiA9PSAnZGV2ZWxvcG1lbnQnKVxuICAgICAgICBjb25zb2xlLmxvZyhcIkhUTUw1IFdlYiBBdWRpbyBBUEkgbm90IHN1cHBvcnRlZC4gU3dpdGNoIHRvIFNvdW5kTWFuYWdlcjIuXCIpXG5cbiAgICBAY3R4ID0gQXVkaW9Db250ZXh0T2JqZWN0XG4gICAgQF9vbGRCcm93c2VyKClcblxuICAgICMgU2V0dXAgVXNlck1lZGlhXG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9XG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhICAgIG9yIG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgb3IgXG4gICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIG9yIG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYVxuICAgIEBfdmVuZG9yVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMXG5cbiAgICAjIFNldCBkZWZhdWx0IHN0YXRlXG4gICAgQHNldFN0YXRlKFdlYkF1ZGlvQVBJLklTX0VOREVEKVxuXG4gIHNldFVybDogKHVybCwgYXV0b3BsYXk9ZmFsc2UsIGNhbGxiYWNrKS0+XG4gICAgaWYgQGlucHV0TW9kZVxuICAgICAgYWxlcnQoJ0Rpc2FibGUgaW5wdXQgbW9kZScpXG4gICAgICByZXR1cm5cblxuICAgIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKVxuICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlICAgID0gJ2FycmF5YnVmZmVyJ1xuICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gZmFsc2VcbiAgICByZXF1ZXN0Lm9ubG9hZCA9ID0+XG4gICAgICBAY3R4LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCAoYnVmZmVyKT0+XG4gICAgICAgIEBpc0xvYWRlZCA9IHRydWVcbiAgICAgICAgQGJ1ZmZlciA9IGJ1ZmZlclxuICAgICAgICBjYWxsYmFjayh0aGlzKSBpZiBjYWxsYmFja1xuICAgICAgICBAcGxheSgpIGlmIGF1dG9wbGF5XG4gICAgICAsIEBfb25FcnJvcilcbiAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSAoZSk9PlxuICAgICAgaWYgZS5sZW5ndGhDb21wdXRhYmxlXG4gICAgICAgIEBvbmxvYWRpbmdwcm9ncmVzcyhlLmxvYWRlZCAvIGUudG90YWwpIGlmIEBvbmxvYWRpbmdwcm9ncmVzcyBcbiAgICByZXF1ZXN0LnNlbmQoKVxuXG4gIHN0cmVhbUlucHV0OiAtPlxuICAgIHVubGVzcyBAaW5wdXRNb2RlXG4gICAgICBhbGVydCgnRW5hYmxlIGlucHV0IG1vZGUnKVxuICAgICAgcmV0dXJuXG5cbiAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHsgdmlkZW86IGZhbHNlLCBhdWRpbzogdHJ1ZSB9LCAoc3RyZWFtKT0+XG4gICAgICBAaXNMb2FkZWQgICAgID0gdHJ1ZVxuICAgICAgQF9sb2NhbHN0cmVhbSA9IHN0cmVhbVxuICAgICAgQHBsYXkoKVxuICAgICwgQF9vbkVycm9yKVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuXG4gIF9vbkVycm9yOiAoZSktPlxuICAgIGNvbnNvbGUubG9nICdFUlJPUicsIGVcblxuICBwYXVzZTogLT5cbiAgICBpZiBAaW5wdXRNb2RlXG4gICAgICBAc3RvcCgpXG4gICAgZWxzZSBpZiBAc3JjXG4gICAgICBAc3JjLnN0b3AoMClcbiAgICAgIEBzcmMgICAgICAgPSBudWxsXG4gICAgICBAcHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gbnVsbFxuICAgICAgQHBvc2l0aW9uICA9IEBjdHguY3VycmVudFRpbWUgLSBAc3RhcnRUaW1lXG4gICAgICBAc2V0U3RhdGUoV2ViQXVkaW9BUEkuSVNfUEFVU0VEKVxuICAgICAgQG9ucGF1c2UoKSBpZiBAb25wYXVzZVxuXG4gIHBsYXk6IChwb3NpdGlvbiktPlxuICAgIHJldHVybiB1bmxlc3MgQGlzTG9hZGVkXG4gICAgaWYgQHN0YXRlID09IFdlYkF1ZGlvQVBJLklTX1BMQVlJTkdcbiAgICAgIEBwYXVzZSgpXG4gICAgICByZXR1cm5cblxuICAgIEBfY29ubmVjdCgpXG5cbiAgICB1bmxlc3MgQGlucHV0TW9kZVxuICAgICAgQHBvc2l0aW9uICA9IGlmIHR5cGVvZiBwb3NpdGlvbiA9PSAnbnVtYmVyJyB0aGVuIHBvc2l0aW9uIGVsc2UgQHBvc2l0aW9uIG9yIDBcbiAgICAgIEBzdGFydFRpbWUgPSBAY3R4LmN1cnJlbnRUaW1lIC0gKEBwb3NpdGlvbiBvciAwKVxuICAgICAgQHNyYy5zdGFydChAY3R4LmN1cnJlbnRUaW1lLCBAcG9zaXRpb24pXG5cbiAgICBAc2V0U3RhdGUoV2ViQXVkaW9BUEkuSVNfUExBWUlORylcbiAgICBAb25wbGF5KCkgaWYgQG9ucGxheVxuXG4gIHN0b3A6IC0+XG4gICAgaWYgQHNyY1xuICAgICAgaWYgQGlucHV0TW9kZVxuICAgICAgICBAc3JjLm1lZGlhU3RyZWFtLnN0b3AoKVxuICAgICAgICBAaXNMb2FkZWQgICAgPSBmYWxzZVxuICAgICAgICBAbG9jYWxzdHJlYW0gPSBudWxsXG4gICAgICBlbHNlXG4gICAgICAgIEBzcmMuc3RvcCgwKVxuICAgICAgQHNyYyAgICAgICA9IG51bGxcbiAgICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBudWxsXG4gICAgICBAcG9zaXRpb24gID0gMFxuICAgICAgQHN0YXJ0VGltZSA9IDBcbiAgICAgIEBzZXRTdGF0ZShXZWJBdWRpb0FQSS5JU19TVE9QUEVEKVxuICAgICAgQG9uc3RvcCgpIGlmIEBvbnN0b3BcblxuICB2b2x1bWU6ICh2b2x1bWUpLT5cbiAgICB2b2x1bWUgPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCB2b2x1bWUpKVxuICAgIEBnYWluTm9kZS5nYWluLnZhbHVlID0gdm9sdW1lXG5cbiAgdXBkYXRlUG9zaXRpb246IC0+XG4gICAgaWYgQHN0YXRlID09IFdlYkF1ZGlvQVBJLklTX1BMQVlJTkdcbiAgICAgIEBwb3NpdGlvbiA9IEBjdHguY3VycmVudFRpbWUgLSBAc3RhcnRUaW1lXG5cbiAgICBpZiBAcG9zaXRpb24gPiBAYnVmZmVyLmR1cmF0aW9uXG4gICAgICBAcG9zaXRpb24gPSBAYnVmZmVyLmR1cmF0aW9uXG4gICAgICBAcGF1c2UoKVxuXG4gICAgcmV0dXJuIEBwb3NpdGlvblxuXG4gIHNlZWs6ICh0aW1lKS0+XG4gICAgaWYgQHN0YXRlID09IFdlYkF1ZGlvQVBJLklTX1BMQVlJTkdcbiAgICAgIEBwbGF5KHRpbWUpXG4gICAgZWxzZVxuICAgICAgQHBvc2l0aW9uID0gdGltZVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHN0b3AoKVxuICAgIEBfZGlzY29ubmVjdCgpXG4gICAgQGN0eCA9IG51bGxcblxuICBfY29ubmVjdDogLT5cbiAgICBpZiBAaW5wdXRNb2RlIGFuZCBAX2xvY2Fsc3RyZWFtXG4gICAgICAjIFNldHVwIGF1ZGlvIHNvdXJjZVxuICAgICAgQHNyYyA9IEBjdHguY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2UoQF9sb2NhbHN0cmVhbSlcbiAgICBlbHNlXG4gICAgICAjIFNldHVwIGJ1ZmZlciBzb3VyY2VcbiAgICAgIEBzcmMgICAgICAgICAgICAgICAgID0gQGN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxuICAgICAgQHNyYy5idWZmZXIgICAgICAgICAgPSBAYnVmZmVyXG4gICAgICBAc3JjLm9uZW5kZWQgICAgICAgICA9IEBfb25FbmRlZFxuICAgICAgQGR1cmF0aW9uICAgICAgICAgICAgPSBAYnVmZmVyLmR1cmF0aW9uXG5cbiAgICAjIFNldHVwIGFuYWx5c2VyXG4gICAgQGFuYWx5c2VyID0gQGN0eC5jcmVhdGVBbmFseXNlcigpXG4gICAgQGFuYWx5c2VyLnNtb290aGluZ1RpbWVDb25zdGFudCA9IDAuOFxuICAgIEBhbmFseXNlci5taW5EZWNpYmVscyAgICAgICAgICAgPSAtMTQwXG4gICAgQGFuYWx5c2VyLm1heERlY2liZWxzICAgICAgICAgICA9IDBcbiAgICBAYW5hbHlzZXIuZmZ0U2l6ZSAgICAgICAgICAgICAgID0gNTEyXG5cbiAgICAjIFNldHVwIFNjcmlwdFByb2Nlc3NvclxuICAgIEBwcm9jZXNzb3IgPSBAY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcigyMDQ4LCAxLCAxKVxuXG4gICAgIyBTZXRwIEdhaW5Ob2RlXG4gICAgQGdhaW5Ob2RlID0gQGN0eC5jcmVhdGVHYWluKClcblxuICAgIEBzcmMuY29ubmVjdChAYW5hbHlzZXIpXG4gICAgQHNyYy5jb25uZWN0KEBnYWluTm9kZSlcbiAgICBAYW5hbHlzZXIuY29ubmVjdChAcHJvY2Vzc29yKVxuICAgIEBwcm9jZXNzb3IuY29ubmVjdChAY3R4LmRlc3RpbmF0aW9uKVxuICAgIEBnYWluTm9kZS5jb25uZWN0KEBjdHguZGVzdGluYXRpb24pXG5cbiAgICBAcHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gQF9vbkF1ZGlvUHJvY2Vzc1xuICAgIEBwcm9jZXNzb3IuYXBpID0gQFxuXG4gICAgQF9vbGRCcm93c2VyKClcblxuICBfZGlzY29ubmVjdDogLT5cbiAgICBAYW5hbHlzZXIuZGlzY29ubmVjdCgwKSAgaWYgQGFuYWx5c2VyXG4gICAgQHByb2Nlc3Nvci5kaXNjb25uZWN0KDApIGlmIEBwcm9jZXNzb3JcbiAgICBAZ2Fpbk5vZGUuZGlzY29ubmVjdCgwKSAgaWYgQGdhaW5Ob2RlXG5cbiAgX29uQXVkaW9Qcm9jZXNzOiA9PlxuICAgIEBvbmF1ZGlvcHJvY2VzcygpIGlmIEBvbmF1ZGlvcHJvY2Vzc1xuXG4gIF9vbkVuZGVkOiAoZSk9PlxuICAgIGlmIEBzcmMgYW5kIChAc3RhdGUgPT0gV2ViQXVkaW9BUEkuSVNfU1RPUFBFRCB8fCBAc3RhdGUgPT0gV2ViQXVkaW9BUEkuSVNfUExBWUlORylcbiAgICAgIEBzcmMuZGlzY29ubmVjdCgwKVxuICAgICAgQHNyYyAgICAgICAgICAgICAgICAgICAgICA9IG51bGxcbiAgICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBudWxsXG4gICAgICBAc3RhdGUgPSBXZWJBdWRpb0FQSS5JU19FTkRFRFxuICAgICAgQG9uZW5kZWQoKSBpZiBAb25lbmRlZFxuXG4gIF9vbGRCcm93c2VyOiAtPlxuICAgIGlmIEBjdHggYW5kIHR5cGVvZiBAY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvciAhPSAnZnVuY3Rpb24nXG4gICAgICBAY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvciA9IEBjdHguY3JlYXRlSmF2YVNjcmlwdE5vZGVcblxuICAgIGlmIEBzcmMgYW5kIHR5cGVvZiBAc3JjLnN0YXJ0ICE9ICdmdW5jdGlvbidcbiAgICAgIEBzcmMuc3RhcnQgPSBAc3JjLm5vdGVPblxuXG4gICAgaWYgQHNyYyBhbmQgdHlwZW9mIEBzcmMuc3RvcCAhPSAnZnVuY3Rpb24nXG4gICAgICBAc3JjLnN0b3AgPSBAc3JjLm5vdGVPZmZcblxuV2ViQXVkaW9BUEkgPSBuZXcgV2ViQXVkaW9BUEkoKVxuXG5cbmNsYXNzIFNQQUNFLkVxdWFsaXplciBleHRlbmRzIFRIUkVFLkdyb3VwXG5cbiAgY2VudGVyOiAgICAgbnVsbFxuXG4gIF92YWx1ZXM6ICAgIG51bGxcbiAgX25ld1ZhbHVlczogbnVsbFxuXG4gIF90aW1lOiAgICAgIDFcblxuICAjIFRIUkVFXG4gIG1hdGVyaWFsOiAgIG51bGxcbiAgbGluZXM6ICAgICAgbnVsbFxuXG4gICMgUGFyYW1ldGVyc1xuICBtYXhMZW5ndGg6ICAgICAgICAgMFxuICBtaW5MZW5ndGg6ICAgICAgICAgMFxuICByYWRpdXM6ICAgICAgICAgICAgMFxuICBpbnRlcnBvbGF0aW9uVGltZTogMFxuICBjb2xvcjogICAgICAgICAgICAgMHhGRkZGRkZcbiAgbGluZUZvcmNlVXA6ICAgICAgIC41XG4gIGxpbmVGb3JjZURvd246ICAgICAuNVxuICBhYnNvbHV0ZTogICAgICAgICAgZmFsc2VcbiAgbmJWYWx1ZXM6ICAgICAgICAgIDBcbiAgbWF4TmJWYWx1ZXM6ICAgICAgIDUxMlxuICBtaXJyb3I6ICAgICAgICAgICAgdHJ1ZVxuXG4gIGNvbnN0cnVjdG9yOiAob3B0cz17fSktPlxuICAgIHN1cGVyXG5cbiAgICAjIFNldCBwYXJhbWV0ZXJzXG4gICAgZGVmYXVsdHMgPVxuICAgICAgbWF4TGVuZ3RoOiAgICAgICAgIDIwMFxuICAgICAgbWluTGVuZ3RoOiAgICAgICAgIDUwXG4gICAgICByYWRpdXM6ICAgICAgICAgICAgMjUwXG4gICAgICBpbnRlcnBvbGF0aW9uVGltZTogMTUwXG4gICAgICBjb2xvcjogICAgICAgICAgICAgMHhGRkZGRkZcbiAgICAgIGxpbmVGb3JjZVVwOiAgICAgICAuNVxuICAgICAgbGluZUZvcmNlRG93bjogICAgIC41XG4gICAgICBhYnNvbHV0ZTogICAgICAgICAgZmFsc2VcbiAgICAgIG5iVmFsdWVzOiAgICAgICAgICAyNTYgIyBNYXhpbXVtIDUxMiB2YWx1ZXNcbiAgICAgIG1pcnJvcjogICAgICAgICAgICB0cnVlXG5cbiAgICBvcHRzICAgICAgICAgICAgICAgPSBfQ29mZmVlLm1lcmdlKGRlZmF1bHRzLCBvcHRzKVxuICAgIEBtaW5MZW5ndGggICAgICAgICA9IG9wdHMubWluTGVuZ3RoXG4gICAgQG1heExlbmd0aCAgICAgICAgID0gb3B0cy5tYXhMZW5ndGhcbiAgICBAcmFkaXVzICAgICAgICAgICAgPSBvcHRzLnJhZGl1c1xuICAgIEBpbnRlcnBvbGF0aW9uVGltZSA9IG9wdHMuaW50ZXJwb2xhdGlvblRpbWVcbiAgICBAY29sb3IgICAgICAgICAgICAgPSBvcHRzLmNvbG9yXG4gICAgQGxpbmVGb3JjZVVwICAgICAgID0gb3B0cy5saW5lRm9yY2VVcFxuICAgIEBsaW5lRm9yY2VEb3duICAgICA9IG9wdHMubGluZUZvcmNlRG93blxuICAgIEBhYnNvbHV0ZSAgICAgICAgICA9IG9wdHMuYWJzb2x1dGVcbiAgICBAbmJWYWx1ZXMgICAgICAgICAgPSBvcHRzLm5iVmFsdWVzXG4gICAgQG1pcnJvciAgICAgICAgICAgID0gb3B0cy5taXJyb3JcblxuICAgICMgU2V0IHZhbHVlc1xuICAgIEBjZW50ZXIgICAgID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIEBfdmFsdWVzICAgID0gQG11dGUoZmFsc2UpXG4gICAgQF9uZXdWYWx1ZXMgPSBAbXV0ZShmYWxzZSlcblxuICAgIEBnZW5lcmF0ZSgpXG5cbiAgICBAX2V2ZW50cygpXG4gICAgQHVwZGF0ZVZhbHVlcygpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFRSQUNLLklTX1NUT1BQRUQudHlwZSwgQF9lVHJhY2tJc1N0b3BwZWQpXG5cbiAgX2VUcmFja0lzU3RvcHBlZDogPT5cbiAgICBAbXV0ZSgpXG5cbiAgc2V0TmJWYWx1ZXM6IChuYlZhbHVlcyktPlxuICAgIEBuYlZhbHVlcyA9IG5iVmFsdWVzXG4gICAgQG11dGUoKVxuXG4gIHNldFZhbHVlczogKHZhbHVlcyktPlxuICAgIGlmIEBtaXJyb3JcbiAgICAgIGRhdGFzICA9IEFycmF5KEBuYlZhbHVlcylcbiAgICAgIGZvciBpIGluIFswLi4oKEBuYlZhbHVlcyouNSktMSldXG4gICAgICAgIGRhdGFzW2ldID0gZGF0YXNbQG5iVmFsdWVzLTEtaV0gPSB2YWx1ZXNbaV1cbiAgICAgIHZhbHVlcyA9IGRhdGFzXG5cbiAgICBuZXdWYWx1ZXMgPSBAbXV0ZShmYWxzZSlcbiAgICBmb3IgdmFsdWUsIGkgaW4gdmFsdWVzXG4gICAgICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKSBpZiBAYWJzb2x1dGVcbiAgICAgIGxlbmd0aCA9IEBtaW5MZW5ndGggKyBwYXJzZUZsb2F0KHZhbHVlKSooQG1heExlbmd0aCAtIEBtaW5MZW5ndGgpXG4gICAgICBuZXdWYWx1ZXNbaV0gPSBNYXRoLm1heChsZW5ndGgsIDApXG4gICAgQF9uZXdWYWx1ZXMgPSBuZXdWYWx1ZXNcbiAgICBAcmVzZXRJbnRlcnBvbGF0aW9uKClcblxuICBnZW5lcmF0ZTogLT5cbiAgICBAbXV0ZSgpXG5cbiAgICBAbWF0ZXJpYWwgICA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBAY29sb3IsIGxpbmV3aWR0aDogNCB9KVxuICAgIEBsaW5lcyAgICAgID0gW11cblxuICAgIEB1cGRhdGUoMClcbiAgICBAdXBkYXRlR2VvbWV0cmllcyh0cnVlKVxuXG4gIHVwZGF0ZTogKGRlbHRhKS0+XG4gICAgQF90aW1lICs9IGRlbHRhXG4gICAgdCA9IEBfdGltZSAvIEBpbnRlcnBvbGF0aW9uVGltZVxuICAgIHJldHVybiBpZiB0ID4gMVxuXG4gICAgZm9yIGkgaW4gWzAuLihAbWF4TmJWYWx1ZXMtMSldXG4gICAgICBkaWZmICAgICAgICA9IEBfdmFsdWVzW2ldIC0gQF9uZXdWYWx1ZXNbaV1cbiAgICAgIEBfdmFsdWVzW2ldID0gQF92YWx1ZXNbaV0gLSB0ICogZGlmZlxuXG4gICAgQHVwZGF0ZUdlb21ldHJpZXMoKVxuXG4gIHVwZGF0ZVZhbHVlczogPT5cbiAgICBpZiBTUEFDRS5KdWtlYm94LnN0YXRlID09IEp1a2Vib3hTdGF0ZS5JU19QTEFZSU5HIGFuZCBTUEFDRS5KdWtlYm94LndhdmVmb3JtRGF0YS5tb25vXG4gICAgICBAc2V0VmFsdWVzKFNQQUNFLkp1a2Vib3gud2F2ZWZvcm1EYXRhLm1vbm8pXG4gICAgc2V0VGltZW91dChAdXBkYXRlVmFsdWVzLCBAaW50ZXJwb2xhdGlvblRpbWUgKiAuNSlcblxuICB1cGRhdGVHZW9tZXRyaWVzOiAoY3JlYXRlPWZhbHNlKS0+XG4gICAgZm9yIGxlbmd0aCwgaSBpbiBAX3ZhbHVlc1xuICAgICAgYW5nbGUgID0gTWF0aC5QSSAqIDIgKiBpIC8gQG5iVmFsdWVzXG5cbiAgICAgIGZyb20gPSBAY29tcHV0ZVBvc2l0aW9uKEBjZW50ZXIsIGFuZ2xlLCBAcmFkaXVzLWxlbmd0aCpAbGluZUZvcmNlRG93bilcbiAgICAgIHRvICAgPSBAY29tcHV0ZVBvc2l0aW9uKEBjZW50ZXIsIGFuZ2xlLCBAcmFkaXVzK2xlbmd0aCpAbGluZUZvcmNlVXApXG5cbiAgICAgIGlmIHR5cGVvZiBAbGluZXNbaV0gPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKVxuICAgICAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKGZyb20sIHRvLCBmcm9tKVxuXG4gICAgICAgIGxpbmUgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgQG1hdGVyaWFsKVxuICAgICAgICBAbGluZXMucHVzaChsaW5lKVxuICAgICAgICBAYWRkKGxpbmUpXG4gICAgICBlbHNlXG4gICAgICAgIGxpbmUgPSBAbGluZXNbaV1cbiAgICAgICAgbGluZS5nZW9tZXRyeS52ZXJ0aWNlc1swXSA9IGZyb21cbiAgICAgICAgbGluZS5nZW9tZXRyeS52ZXJ0aWNlc1sxXSA9IHRvXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNbMl0gPSBmcm9tXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZVxuXG4gIHJhbmRvbTogKHNldFZhbHVlcz10cnVlKT0+XG4gICAgdmFsdWVzID0gW11cbiAgICBmb3IgaSBpbiBbMC4uKEBtYXhOYlZhbHVlcy0xKV1cbiAgICAgIHZhbHVlc1tpXSA9IE1hdGgucmFuZG9tKClcbiAgICBAc2V0VmFsdWVzKHZhbHVlcykgaWYgc2V0VmFsdWVzXG4gICAgcmV0dXJuIHZhbHVlc1xuXG4gIG11dGU6IChzZXRWYWx1ZXM9dHJ1ZSktPlxuICAgIHZhbHVlcyA9IFtdXG4gICAgZm9yIGkgaW4gWzAuLihAbWF4TmJWYWx1ZXMtMSldXG4gICAgICB2YWx1ZXNbaV0gPSAwXG4gICAgQHNldFZhbHVlcyh2YWx1ZXMpIGlmIHNldFZhbHVlc1xuICAgIHJldHVybiB2YWx1ZXNcblxuICByZXNldEludGVycG9sYXRpb246IC0+XG4gICAgQF90aW1lID0gMFxuXG4gIGNvbXB1dGVQb3NpdGlvbjogKHBvaW50LCBhbmdsZSwgbGVuZ3RoKS0+XG4gICAgeCA9IHBvaW50LnggKyBNYXRoLnNpbihhbmdsZSkgKiBsZW5ndGhcbiAgICB5ID0gcG9pbnQueSArIE1hdGguY29zKGFuZ2xlKSAqIGxlbmd0aFxuICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMyh4LCB5LCBwb2ludC56KVxuXG4gIHJlbW92ZUxpbmVGcm9tUGFyZW50OiAoaW5kZXgpLT5cbiAgICBwYXJlbnQgPSBAbGluZXNbaW5kZXhdXG4gICAgcGFyZW50LnJlbW92ZShAbGluZXNbaW5kZXhdKVxuXG5cbmNsYXNzIFNQQUNFLlNwYWNlc2hpcCBleHRlbmRzIFRIUkVFLkdyb3VwXG5cbiAgdGltZTogMFxuXG4gIHNoaXA6IG51bGxcbiAgcGF0aDogbnVsbFxuICBkdXJhdGlvbjogMFxuICBzb25nRHVyYXRpb246IDBcblxuICBzdGF0ZTogbnVsbFxuXG4gIGFuZ2xlOiAwXG5cbiAgX2NhY2hlZDogbnVsbFxuXG4gICMgU1RBVEVTXG4gIEBJRExFOiAgICAgJ0lETEUnXG4gIEBMQVVOQ0hFRDogJ0xBVU5DSEVEJ1xuICBASU5fTE9PUDogICdJTl9MT09QJ1xuICBAQVJSSVZFRDogICdBUlJJVkVEJ1xuXG4gIGNvbnN0cnVjdG9yOiAodGFyZ2V0LCByYWRpdXMpLT5cbiAgICBzdXBlclxuXG4gICAgQHRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKHRhcmdldC54LCB0YXJnZXQueSwgNSlcbiAgICBAcmFkaXVzID0gcmFkaXVzXG4gICAgQGFuZ2xlICA9IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMlxuXG4gICAgQHNldFN0YXRlKFNwYWNlc2hpcFN0YXRlLklETEUpXG5cbiAgICBAc2V0dXAoKVxuXG4gIHNldFJhZGl1czogKHJhZGl1cyktPlxuICAgIEByYWRpdXMgPSByYWRpdXNcbiAgICBAX2NhY2hlZCA9IEBfY29tcHV0ZVBhdGhzKClcblxuICBzZXR1cDogLT5cbiAgICBnID0gbmV3IFRIUkVFLkdlb21ldHJ5KClcbiAgICBnLnZlcnRpY2VzLnB1c2goXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMyggIDAsIC01Mi41LCAtMTApXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMygtMTAsIC02Ny41LCAgMTApXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMygtNTAsIC00Mi41LCAgMTApXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMyggIDAsICA2Ny41LCAgMTApXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMygrNTAsIC00Mi41LCAgMTApXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMygrMTAsIC02Ny41LCAgMTApXG4gICAgKVxuICAgIGcuZmFjZXMucHVzaChcbiAgICAgIG5ldyBUSFJFRS5GYWNlMygwLCAzLCAxKSxcbiAgICAgIG5ldyBUSFJFRS5GYWNlMygxLCAyLCAzKSxcbiAgICAgIG5ldyBUSFJFRS5GYWNlMygzLCAwLCA1KSxcbiAgICAgIG5ldyBUSFJFRS5GYWNlMyg1LCA0LCAzKVxuICAgIClcbiAgICBnLmNvbXB1dGVGYWNlTm9ybWFscygpXG4gICAgbWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKVxuICAgIG1hdHJpeC5tYWtlUm90YXRpb25YKE1hdGguUEkqLjUpXG4gICAgZy5hcHBseU1hdHJpeChtYXRyaXgpXG4gICAgbWF0cml4Lm1ha2VSb3RhdGlvblooTWF0aC5QSSlcbiAgICBnLmFwcGx5TWF0cml4KG1hdHJpeClcblxuICAgIEBzaGlwID0gVEhSRUUuU2NlbmVVdGlscy5jcmVhdGVNdWx0aU1hdGVyaWFsT2JqZWN0KGcsIFtcbiAgICAgIG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4RkZGRkZGLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlIH0pXG4gICAgXSlcbiAgICBAc2hpcC5jYXN0U2hhZG93ID0gdHJ1ZVxuICAgIEBzaGlwLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgQHNoaXAuc2NhbGUuc2V0KC4xNSwgLjE1LCAuMTUpXG4gICAgQGFkZChAc2hpcClcblxuICAgIEBfY2FjaGVkID0gQF9jb21wdXRlUGF0aHMoKVxuICAgIHYgPSBAX2NhY2hlZC5sYXVuY2hlZFBhdGguZ2V0UG9pbnRBdCgwKVxuICAgIEBzaGlwLnBvc2l0aW9uLnNldCh2LngsIHYueSwgdi56KVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIHN3aXRjaCBzdGF0ZVxuICAgICAgd2hlbiBTcGFjZXNoaXBTdGF0ZS5JRExFXG4gICAgICAgICMgU1BBQ0UuTE9HKCdJRExFJylcbiAgICAgICAgQHBhdGggPSBudWxsXG4gICAgICB3aGVuIFNwYWNlc2hpcFN0YXRlLkxBVU5DSEVEXG4gICAgICAgICMgU1BBQ0UuTE9HKCdMQVVOQ0hFRCcpXG4gICAgICAgIEBfcmVzZXRUaW1lKClcbiAgICAgICAgQHBhdGggPSBAX2NhY2hlZC5sYXVuY2hlZFBhdGhcbiAgICAgICAgQGR1cmF0aW9uID0gMTAgKiAxMDAwXG5cbiAgICAgICAgdiA9IEBwYXRoLmdldFBvaW50KDApXG4gICAgICAgIEBzaGlwLnBvc2l0aW9uLnNldCh2LngsIHYueSwgdi56KVxuICAgICAgd2hlbiBTcGFjZXNoaXBTdGF0ZS5JTl9MT09QXG4gICAgICAgICMgU1BBQ0UuTE9HKCdJTl9MT09QJylcbiAgICAgICAgQF9yZXNldFRpbWUoKVxuICAgICAgICBAcGF0aCA9IEB0ZXN0bmV3bG9vcCgpICNAX2NhY2hlZC5pbkxvb3BQYXRoXG4gICAgICAgIEBkdXJhdGlvbiA9IDUgKiAxMDAwI0Bzb25nRHVyYXRpb25cblxuICAgICAgICB2ID0gQHBhdGguZ2V0UG9pbnQoMClcbiAgICAgICAgQHNoaXAucG9zaXRpb24uc2V0KHYueCwgdi55LCB2LnopXG5cbiAgICAgICAgIyBAc2hpcFJvdGF0aW9uWiA9IEBzaGlwLnJvdGF0aW9uLnpcbiAgICAgICAgIyAkKEBzaGlwLnJvdGF0aW9uKS5hbmltYXRlKHtcbiAgICAgICAgIyAgIHo6IDBcbiAgICAgICAgIyB9LCB7XG4gICAgICAgICMgICBkdXJhdGlvbjogNTAwXG4gICAgICAgICMgICBwcm9ncmVzczogKG9iamVjdCk9PlxuICAgICAgICAjICAgICBAc2hpcFJvdGF0aW9uWiA9IG9iamVjdC50d2VlbnNbMF0ubm93XG4gICAgICAgICMgfSlcbiAgICAgIHdoZW4gU3BhY2VzaGlwU3RhdGUuQVJSSVZFRFxuICAgICAgICAjIFNQQUNFLkxPRygnQVJSSVZFRCcpXG4gICAgICAgIEBwYXRoID0gbnVsbFxuICAgICAgICBAcGFyZW50LnJlbW92ZShAKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0U3RhdGUoU3BhY2VzaGlwU3RhdGUuSURMRSlcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIGlmIEBzdGF0ZSAhPSBTcGFjZXNoaXBTdGF0ZS5JRExFIGFuZCBAc3RhdGUgIT0gU3BhY2VzaGlwU3RhdGUuQVJSSVZFRFxuXG4gICAgICB0ID0gTWF0aC5taW4oQHRpbWUgLyBAZHVyYXRpb24sIDEpXG5cbiAgICAgIGlmIHQgPj0gMVxuICAgICAgICBAX3Jlc2V0VGltZSgpXG4gICAgICAgIGlmIEBzdGF0ZSA9PSBTcGFjZXNoaXBTdGF0ZS5MQVVOQ0hFRFxuICAgICAgICAgIEBzZXRTdGF0ZShTcGFjZXNoaXBTdGF0ZS5JTl9MT09QKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBTcGFjZXNoaXBTdGF0ZS5JTl9MT09QXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyAnbmV4dCBtb3ZlPydcbiAgICAgICAgICBAcGF0aCA9IEB0ZXN0bmV3bG9vcCgpXG4gICAgICAgICAgQGR1cmF0aW9uID0gKDUgKyAoTWF0aC5yYW5kb20oKSAqIDEwKSkgKiAxMDAwXG4gICAgICAgICAgIyBAc2V0U3RhdGUoU3BhY2VzaGlwU3RhdGUuQVJSSVZFRClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlmIEBzdGF0ZSA9PSBTcGFjZXNoaXBTdGF0ZS5MQVVOQ0hFRFxuICAgICAgICBAdGltZSArPSBkZWx0YVxuICAgICAgICB0ID0gX0Vhc2luZy5RdWFkcmF0aWNFYXNlT3V0KHQpXG5cbiAgICAgICMgVE1QXG4gICAgICBpZiBAc3RhdGUgPT0gU3BhY2VzaGlwU3RhdGUuSU5fTE9PUFxuICAgICAgICBAdGltZSArPSBkZWx0YVxuICAgICAgICAjIGNvbnNvbGUubG9nIEB0aW1lXG5cbiAgICAgIEBfcHJvZ3Jlc3ModCkgaWYgdFxuXG4gIF9yZXNldFRpbWU6IC0+XG4gICAgQHRpbWUgPSAwXG5cbiAgX3Byb2dyZXNzOiAodCktPlxuICAgIHYgPSBAcGF0aC5nZXRQb2ludEF0KHQpXG4gICAgQHNoaXAucG9zaXRpb24uc2V0KHYueCwgdi55LCB2LnopXG5cbiAgICBhaGVhZCA9ICBNYXRoLm1pbih0ICsgMTAgLyBAcGF0aC5nZXRMZW5ndGgoKSwgMSlcbiAgICB2ID0gQHBhdGguZ2V0UG9pbnRBdChhaGVhZCkubXVsdGlwbHlTY2FsYXIoIDEgKVxuICAgIEBzaGlwLmxvb2tBdCh2KVxuXG4gICAgaWYgQHN0YXRlID09IFNwYWNlc2hpcFN0YXRlLkxBVU5DSEVEXG4gICAgICBzY2FsZSA9IC4yNSArICgxIC0gdCkgKiAuMzVcbiAgICAgIEBzaGlwLnNjYWxlLnNldChzY2FsZSwgc2NhbGUsIHNjYWxlKVxuXG4gICAgIyBpZiBAc3RhdGUgPT0gU3BhY2VzaGlwU3RhdGUuSU5fTE9PUFxuICAgICMgICBAc2hpcC5yb3RhdGlvbi5zZXQoQHNoaXAucm90YXRpb24ueCwgQHNoaXAucm90YXRpb24ueSwgQHNoaXBSb3RhdGlvblopXG5cbiAgX2NvbXB1dGVQYXRoczogLT5cbiAgICBmcm9tQSAgICAgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgZnJvbUEueCAgID0gQHRhcmdldC54ICsgTWF0aC5jb3MoQGFuZ2xlKSAqIDUwMFxuICAgIGZyb21BLnkgICA9IEB0YXJnZXQueSArIE1hdGguc2luKEBhbmdsZSkgKiA1MDBcbiAgICBmcm9tQS56ICAgPSA2MDBcblxuICAgIHBhdGggICAgICAgICAgID0gbmV3IFRIUkVFLkluTG9vcEN1cnZlKEB0YXJnZXQsIEBhbmdsZSwgQHJhZGl1cylcbiAgICBwYXRoLmludmVyc2UgICA9IHRydWVcbiAgICBwYXRoLnVzZUdvbGRlbiA9IHRydWVcblxuICAgICMjIENyZWF0ZSBwYXRoIGxhdW5jaGVkXG4gICAgbWlkICAgICAgPSBwYXRoLmdldFBvaW50KDApXG4gICAgcmVmICAgICAgPSBwYXRoLmdldFBvaW50KC4wMjUpXG4gICAgYW5nbGUgICAgPSBfTWF0aC5hbmdsZUJldHdlZW5Qb2ludHMobWlkLCByZWYpICsgTWF0aC5QSVxuICAgIGRpc3RhbmNlID0gbWlkLmRpc3RhbmNlVG8ocmVmKVxuXG4gICAgY3VydmVQb2ludCAgID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIGN1cnZlUG9pbnQueCA9IG1pZC54ICsgTWF0aC5jb3MoYW5nbGUpICogZGlzdGFuY2VcbiAgICBjdXJ2ZVBvaW50LnkgPSBtaWQueSArIE1hdGguc2luKGFuZ2xlKSAqIGRpc3RhbmNlXG4gICAgY3VydmVQb2ludC56ID0gbWlkLnpcblxuICAgIHRvQSAgICA9IHBhdGguZ2V0UG9pbnQoMClcbiAgICBjdXJ2ZSAgPSBuZXcgVEhSRUUuTGF1bmNoZWRDdXJ2ZShmcm9tQSwgdG9BKVxuICAgIHBvaW50cyA9IGN1cnZlLmdldFBvaW50cygxMClcbiAgICAjIHBvaW50cy5wdXNoKHRvQSlcblxuICAgIGZvciBwdCwgaSBpbiBwYXRoLmdldFBvaW50cygxMClcbiAgICAgIHBvaW50cy5wdXNoKHB0KSBpZiBpID4gMFxuXG4gICAgY3VydmVBID0gX1RIUkVFLkhlcm1pdGVDdXJ2ZShwb2ludHMpXG5cbiAgICAjIyBDcmVhdGUgcGF0aCBpbiB0aGUgbG9vcFxuICAgIGN1cnZlQiA9IHBhdGgjX1RIUkVFLkhlcm1pdGVDdXJ2ZShwYXRoLmdldFBvaW50cygxMCkpXG5cbiAgICAjIEBfZGVidWdQYXRoKGN1cnZlQSlcbiAgICAjIEBfZGVidWdQYXRoKGN1cnZlQilcblxuICAgICMgQHRlc3RuZXdsb29wKClcblxuICAgIHJldHVybiB7IGxhdW5jaGVkUGF0aDogY3VydmVBLCBpbkxvb3BQYXRoOiBjdXJ2ZUIgfVxuXG4gIHRlc3RuZXdsb29wOiAtPlxuICAgIFRIUkVFLk5ld0xvb3AgPSBUSFJFRS5DdXJ2ZS5jcmVhdGUoXG4gICAgICAodjAsIHJhZGl1cz0gMTAwLCBzdGFydEFuZ2xlPTApLT5cbiAgICAgICAgQHYwICAgICAgICAgPSB2MFxuICAgICAgICBAcmFkaXVzICAgICA9IHJhZGl1c1xuICAgICAgICBAc3RhcnRBbmdsZSA9IHN0YXJ0QW5nbGVcbiAgICAgICAgQHJhbmRBbmdsZSAgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDJcbiAgICAgICAgQGRpcmVjdGlvbiAgPSBpZiBNYXRoLnJhbmRvbSgpID4gLjUgdGhlbiB0cnVlIGVsc2UgZmFsc2VcbiAgICAgICAgQHRlc3QgICAgICAgPSBNYXRoLnJhbmRvbSgpXG4gICAgICAgIHJldHVyblxuICAgICAgLCAodCktPlxuICAgICAgICB0ICAgICAgPSAxIC0gdCBpZiBAZGlyZWN0aW9uXG4gICAgICAgIGFuZ2xlICA9IChNYXRoLlBJICogMikgKiB0XG4gICAgICAgIGFuZ2xlICArPSBAc3RhcnRBbmdsZVxuXG4gICAgICAgIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICAgICAgdmVjdG9yLnggPSBAdjAueCArIE1hdGguY29zKGFuZ2xlKSAqIEByYWRpdXNcbiAgICAgICAgdmVjdG9yLnkgPSBAdjAueSArIE1hdGguY29zKGFuZ2xlICsgQHJhbmRBbmdsZSkgKiAoQHJhZGl1cyAqIDIgKiBAdGVzdClcbiAgICAgICAgdmVjdG9yLnogPSBAdjAueiArIE1hdGguc2luKGFuZ2xlKSAqIEByYWRpdXNcbiAgICAgICAgcmV0dXJuIHZlY3RvclxuXG4gICAgICAgICMgdCAgICAgPSAxIC0gdCBpZiBAaW52ZXJzZVxuICAgICAgICAjIGlmIEB1c2VHb2xkZW5cbiAgICAgICAgIyAgICAgcGhpICAgPSAoTWF0aC5zcXJ0KDUpKzEpLzIgLSAxXG4gICAgICAgICMgICAgIGdvbGRlbl9hbmdsZSA9IHBoaSAqIE1hdGguUEkgKiAyXG4gICAgICAgICMgICAgIGFuZ2xlID0gQHN0YXJ0QW5nbGUgKyAoZ29sZGVuX2FuZ2xlICogdClcbiAgICAgICAgIyAgICAgYW5nbGUgKz0gTWF0aC5QSSAqIC0xLjIzNVxuICAgICAgICAjIGVsc2VcbiAgICAgICAgIyAgICAgYW5nbGUgPSBAc3RhcnRBbmdsZSArIChNYXRoLlBJICogMiAqIHQpXG5cbiAgICAgICAgIyB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgICAgICMgdmVjdG9yLnggPSBAdjAueCArIE1hdGguY29zKGFuZ2xlKSAqIChAbWluUmFkaXVzICsgQHJhZGl1cyAqIHQpXG4gICAgICAgICMgdmVjdG9yLnkgPSBAdjAueSArIE1hdGguc2luKGFuZ2xlKSAqIChAbWluUmFkaXVzICsgQHJhZGl1cyAqIHQpXG4gICAgICAgICMgdmVjdG9yLnogPSBAdjAuelxuICAgICAgICAjIHJldHVybiB2ZWN0b3JcbiAgICApXG5cbiAgICBuZXdsb29wID0gbmV3IFRIUkVFLk5ld0xvb3AoQHRhcmdldCwgMTUwLCBNYXRoLlBJKi0uNSlcbiAgICByZXR1cm4gbmV3bG9vcFxuICAgICMgQF9kZWJ1Z1BhdGgobmV3bG9vcClcblxuXG4gIF9kZWJ1Z1BhdGg6IChwYXRoLCBjb2xvcj0weEZGMDAwMCktPlxuICAgIGcgICAgPSBuZXcgVEhSRUUuVHViZUdlb21ldHJ5KHBhdGgsIDIwMCwgLjUsIDEwLCB0cnVlKVxuICAgIHR1YmUgPSBUSFJFRS5TY2VuZVV0aWxzLmNyZWF0ZU11bHRpTWF0ZXJpYWxPYmplY3QoIGcsIFtcbiAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgIG9wYWNpdHk6IDAuMyxcbiAgICAgICAgICB3aXJlZnJhbWU6IHRydWUsXG4gICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWVcbiAgICAgIH0pLFxuICAgICAgbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogMHhGRjg4RkYsIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUgfSlcbiAgICBdKVxuICAgIEBhZGQodHViZSlcblxuXG5jbGFzcyBTZXR1cCBleHRlbmRzIFRIUkVFLkdyb3VwXG5cbiAganVrZWJveDogbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyXG4gICAgQGp1a2Vib3ggPSBTUEFDRS5KdWtlYm94XG5cbiAgb25FbnRlcjogKGNhbGxiYWNrKS0+XG4gICAgY2FsbGJhY2soKSBpZiBjYWxsYmFja1xuICAgIEBzZXR1cCgpXG5cbiAgb25FeGl0OiAoY2FsbGJhY2spLT5cbiAgICBjYWxsYmFjaygpIGlmIGNhbGxiYWNrXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cblxuICBzZXR1cDogLT5cbiAgICAjIGVhcnRoID0gbmV3IFNQQUNFLkRFRkFVTFQuRWFydGgoKVxuICAgICMgZWFydGguc2V0dXAoKVxuICAgICMgQGFkZChlYXJ0aClcblxuICAgIGVhcnRoID0gbmV3IFNQQUNFLkRFRkFVTFQuSWNvc2FoZWRyb24oKVxuICAgIGVhcnRoLnNldHVwKClcbiAgICBAYWRkKGVhcnRoKVxuXG4gICAgIyBnID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KClcbiAgICAjIG0gPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweEZGQUEyMiB9KVxuICAgICMgY2lyY2xlID0gbmV3IFRIUkVFLk1lc2goZywgbSlcbiAgICAjIGNpcmNsZS5jYXN0U2hhZG93ID0gdHJ1ZVxuICAgICMgY2lyY2xlLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgIyBAYWRkKGNpcmNsZSlcblxuICAgICMgY2lyY2xlLnVwZGF0ZSA9IC0+XG4gICAgIyAgIEByb3RhdGlvbi54ICs9IC4wMVxuICAgICMgICBAcm90YXRpb24ueSAtPSAuMDFcbiAgICAjICAgQHJvdGF0aW9uLnogKz0gLjAxXG5cbiAgICBsaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCAweEZGRkZGRiwgMS44Ki4yIClcbiAgICBsaWdodC5wb3NpdGlvbi5zZXQoIDUwMCwgNTAwLCA1MDAgKVxuICAgIEBhZGQoIGxpZ2h0IClcblxuICAgIGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoIDB4RkZGRkZGLCAxLjgqLjYgKVxuICAgIGxpZ2h0LnBvc2l0aW9uLnNldCggLTUwMCwgNTAwLCA1MDAgKVxuICAgIEBhZGQoIGxpZ2h0IClcblxuICAgIGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoIDB4RkZGRkZGLCAxLjgqLjIgKVxuICAgIGxpZ2h0LnBvc2l0aW9uLnNldCggNTAwLCAtNTAwLCA1MDAgKVxuICAgIEBhZGQoIGxpZ2h0IClcblxuICAgIGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoIDB4RkZGRkZGLCAxLjgqLjIgKVxuICAgIGxpZ2h0LnBvc2l0aW9uLnNldCggLTUwMCwgLTUwMCwgNTAwIClcbiAgICBAYWRkKCBsaWdodCApXG5cbiAgICBsaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCAweEZGRkZGRiwgMS44Ki4xIClcbiAgICBsaWdodC5wb3NpdGlvbi5zZXQoIDUwMCwgNTAwLCAtNTAwIClcbiAgICBAYWRkKCBsaWdodCApXG5cbiAgICBsaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCAweEZGRkZGRiwgMS44Ki4xIClcbiAgICBsaWdodC5wb3NpdGlvbi5zZXQoIC01MDAsIDUwMCwgLTUwMCApXG4gICAgQGFkZCggbGlnaHQgKVxuXG4gICAgbGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCggMHhGRkZGRkYsIDEuOCouMSApXG4gICAgbGlnaHQucG9zaXRpb24uc2V0KCA1MDAsIC01MDAsIC01MDAgKVxuICAgIEBhZGQoIGxpZ2h0IClcblxuICAgIGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoIDB4RkZGRkZGLCAxLjgqLjEgKVxuICAgIGxpZ2h0LnBvc2l0aW9uLnNldCggLTUwMCwgLTUwMCwgLTUwMCApXG4gICAgQGFkZCggbGlnaHQgKVxuXG4gICAgIyBsaWdodC5jYXN0U2hhZG93ID0gdHJ1ZVxuXG4gICAgIyBsaWdodC5zaGFkb3dDYW1lcmFOZWFyICAgID0gNzAwXG4gICAgIyBsaWdodC5zaGFkb3dDYW1lcmFGYXIgICAgID0gbWFuYWdlci5fY2FtZXJhLmZhclxuICAgICMgbGlnaHQuc2hhZG93Q2FtZXJhRm92ICAgICA9IDUwXG5cbiAgICAjIGxpZ2h0LnNoYWRvd0Nhc2NhZGUgPSB0cnVlXG5cbiAgICAjIGxpZ2h0LnNoYWRvd0JpYXMgICAgICAgICAgPSAwLjAwMDFcbiAgICAjIGxpZ2h0LnNoYWRvd0RhcmtuZXNzICAgICAgPSAwLjVcblxuICAgICMgbGlnaHQuc2hhZG93Q2FtZXJhUmlnaHQgICAgPSAgNVxuICAgICMgbGlnaHQuc2hhZG93Q2FtZXJhTGVmdCAgICAgPSAtNVxuICAgICMgbGlnaHQuc2hhZG93Q2FtZXJhVG9wICAgICAgPSAgNVxuICAgICMgbGlnaHQuc2hhZG93Q2FtZXJhQm90dG9tICAgPSAtNVxuXG4gICAgIyBsaWdodC5zaGFkb3dNYXBXaWR0aCAgICAgID0gMjA0OFxuICAgICMgbGlnaHQuc2hhZG93TWFwSGVpZ2h0ICAgICA9IDIwNDhcblxuXG4gICAgIyBoZWxwZXIgPSBuZXcgVEhSRUUuU3BvdExpZ2h0SGVscGVyKGxpZ2h0LCAxKVxuICAgICMgQGFkZChoZWxwZXIpXG5cbiAgICAjIHNwZWVkID1cbiAgICAjICAgeDogTWF0aC5yYW5kb20oKSAqIDAuMDA1XG4gICAgIyAgIHk6IE1hdGgucmFuZG9tKCkgKiAwLjAwNVxuICAgICMgICB6OiBNYXRoLnJhbmRvbSgpICogMC4wMDVcblxuICAgICMgQGN1YmUudXBkYXRlID0gLT5cbiAgICAjICAgQHJvdGF0aW9uLnggKz0gc3BlZWQueFxuICAgICMgICBAcm90YXRpb24ueSArPSBzcGVlZC55XG4gICAgIyAgIEByb3RhdGlvbi56ICs9IHNwZWVkLnpcblxuXG4jPSByZXF1aXJlIGVudmlyb25tZW50cy9kZWZhdWx0L0NvdmVyLmNvZmZlZVxuKC0+XG4gIHNjZW5lcyA9IFsnTWFpblNjZW5lJ11cblxuICBTUEFDRS5TY2VuZU1hbmFnZXIgPSBuZXcgU1BBQ0UuU2NlbmVNYW5hZ2VyKClcbiAgZm9yIHNjZW5lIGluIHNjZW5lc1xuICAgIFNQQUNFLlNjZW5lTWFuYWdlci5jcmVhdGVTY2VuZShzY2VuZSlcblxuICBTUEFDRS5TY2VuZU1hbmFnZXIuZ29Ub1NjZW5lKCdNYWluU2NlbmUnKVxuKSgpXG5cblxuIl19