var manager,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

window.SPACE = window.SPACE || {};

SPACE.ENV = 'development';

SPACE.FPS = 30;

SPACE.pixelRatio = window.devicePixelRatio || 1;

SPACE.THREE = {};

SPACE.SOUNDCLOUD = (function() {
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

SPACE.DEFAULT = {};

window.EVENT = {
  Jukebox: {
    TRACK_ON_ADD: new Event('jukebox_track_on_add'),
    TRACK_ON_ADD_ERROR: new Event('jukebox_track_on_add_error'),
    TRACK_ADDED: new Event('jukebox_track_added'),
    ON_PLAY: new Event('jukebox_on_play'),
    ON_STOP: new Event('jukebox_on_stop'),
    IS_PLAYING: new Event('jukebox_is_playing'),
    IS_STOPPED: new Event('jukebox_is_stopped'),
    IS_SEARCHING: new Event('jukebox_is_searching')
  },
  Track: {
    IS_PLAYING: new Event('track_is_playing'),
    IS_PAUSED: new Event('track_is_paused'),
    IS_STOPPED: new Event('track_is_stopped')
  },
  SoundCloud: {
    IS_CONNECTED: new Event('soundcloud_connected')
  },
  Cover: {
    TEXTURES_LOADED: new Event('cover_textures_loaded')
  }
};

Object.freeze(EVENT);

window.ENUM = {
  Keyboard: {
    ENTER: 13,
    UP: 38,
    DOWN: 40,
    ESC: 27,
    DELETE: 46
  },
  SpaceshipState: {
    IDLE: 'spaceshipstate_idle',
    LAUNCHED: 'spaceshipstate_launched',
    IN_LOOP: 'spaceshipstate_inloop',
    ARRIVED: 'spaceshipstate_arrived'
  },
  SearchEngineState: {
    OPENED: 'searchenginestate_opened',
    CLOSED: 'searchenginestate_closed',
    SEARCH: 'searchenginestate_search',
    TRACK_SELECTED: 'searchenginestate_trackselected'
  },
  JukeboxState: {
    IS_PLAYING: 'jukeboxstate_isplaying',
    IS_STOPPED: 'jukeboxstate_isstopped',
    TRACK_STOPPED: 'jukeboxstate_trackstopped'
  },
  AirportState: {
    IDLE: 'airportstate_idle',
    SENDING: 'airportstate_sending'
  }
};

Object.freeze(ENUM);

window.HELPER = window.HELPER || {
  trigger: function(e, object) {
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

HELPER.Math = {
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

HELPER.THREE = {
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
    return this.paused = false;
  };

  Scene.prototype.pause = function() {
    return this.paused = true;
  };

  Scene.prototype.isPaused = function() {
    return this.paused;
  };

  return Scene;

})(THREE.Scene);

SPACE.SceneManager = (function() {
  SceneManager.prototype.currentScene = null;

  SceneManager.prototype._scenes = null;

  SceneManager.prototype._stats = null;

  SceneManager.prototype._clock = null;

  SceneManager.prototype._tick = 0;

  SceneManager.prototype.renderer = null;

  SceneManager.prototype.camera = null;

  function SceneManager(width, height) {
    this._update = bind(this._update, this);
    this._render = bind(this._render, this);
    if (this.renderer) {
      return this;
    }
    this._clock = new THREE.Clock();
    this._scenes = [];
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.setZ(600);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('wrapper').appendChild(this.renderer.domElement);
    if (SPACE.ENV === 'development') {
      this._setupStats();
    }
    this._render();
    this._update();
    window.onresize = (function(_this) {
      return function() {
        _this.renderer.setSize(window.innerWidth, window.innerHeight);
        _this.camera.aspect = window.innerWidth / window.innerHeight;
        return _this.camera.updateProjectionMatrix();
      };
    })(this);
  }

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

  SceneManager.prototype._update = function() {};

  SceneManager.prototype.createScene = function(identifier, aScene, interactive) {
    var scene;
    if (this._scenes[identifier]) {
      return void 0;
    }
    scene = new aScene();
    this._scenes[identifier] = scene;
    return scene;
  };

  SceneManager.prototype.goToScene = function(identifier) {
    if (this.currentScene) {
      $(window).off('resize', this.currentScene.resize);
    }
    if (this._scenes[identifier]) {
      if (this.currentScene) {
        this.currentScene.pause();
      }
      this.currentScene = this._scenes[identifier];
      this.currentScene.resume();
      $(window).on('resize', this.currentScene.resize);
      return true;
    }
    return false;
  };

  return SceneManager;

})();

SPACE.MainScene = (function(superClass) {
  extend(MainScene, superClass);

  MainScene.prototype.equalizer = null;

  MainScene.prototype.jukebox = null;

  MainScene.prototype.loadingManager = null;

  MainScene.prototype.loader = null;

  function MainScene() {
    this.setup = bind(this.setup, this);
    MainScene.__super__.constructor.apply(this, arguments);
    this._events();
    this.setup();
    this.env = new SPACE.DEFAULT.Setup();
    this.env.onEnter();
    this.add(this.env);
  }

  MainScene.prototype._events = function() {
    return document.addEventListener(EVENT.SoundCloud.IS_CONNECTED.type, this.setup);
  };

  MainScene.prototype.setup = function() {
    SPACE.Jukebox = new SPACE.Jukebox(this);
    this.jukebox = SPACE.Jukebox;
    return this.jukebox.whileplaying = this._whileplaying;
  };

  MainScene.prototype.update = function(delta) {
    MainScene.__super__.update.call(this, delta);
    if (this.jukebox) {
      return this.jukebox.update(delta);
    }
  };

  return MainScene;

})(SPACE.Scene);

SPACE.SoundCloud = (function() {
  SoundCloud.prototype.client_id = null;

  SoundCloud.prototype.redirect_uri = null;

  SoundCloud.prototype.token = null;

  function SoundCloud(id, redirect_uri) {
    this._eClick = bind(this._eClick, this);
    SC.initialize({
      client_id: id,
      redirect_uri: redirect_uri
    });
    this.client_id = id;
    this.redirect_uri = redirect_uri;
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
        return HELPER.trigger(EVENT.SoundCloud.IS_CONNECTED);
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
          console.log(error.message);
          return callback(error.message, error);
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
      return function(path, error) {
        if (error) {
          callback(path, error);
          return;
        }
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
        return function(path, error) {
          if (error) {
            callback(path, error);
            return;
          }
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
    this.setState(ENUM.SearchEngineState.CLOSED);
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
      case ENUM.Keyboard.ENTER:
        if (this.input.value.length === 0) {
          if (this.state === ENUM.SearchEngineState.CLOSED) {
            return this.setState(ENUM.SearchEngineState.OPENED);
          } else {
            return this.setState(ENUM.SearchEngineState.CLOSED);
          }
        } else if (this.state === ENUM.SearchEngineState.SEARCH && this.focused) {
          return this.setState(ENUM.SearchEngineState.TRACK_SELECTED);
        } else if (this.state === ENUM.SearchEngineState.TRACK_SELECTED) {
          return this.add();
        }
        break;
      case ENUM.Keyboard.UP:
        if (this.state === ENUM.SearchEngineState.SEARCH) {
          return this.up();
        }
        break;
      case ENUM.Keyboard.DOWN:
        if (this.state === ENUM.SearchEngineState.SEARCH) {
          return this.down();
        }
        break;
      case ENUM.Keyboard.ESC:
      case ENUM.Keyboard.DELETE:
        if (this.state === ENUM.SearchEngineState.SEARCH) {
          return this.setState(ENUM.SearchEngineState.OPENED);
        } else if (this.state === ENUM.SearchEngineState.TRACK_SELECTED) {
          return this.setState(ENUM.SearchEngineState.SEARCH);
        } else {
          return this.setState(ENUM.SearchEngineState.CLOSED);
        }
        break;
      default:
        return false;
    }
  };

  SearchEngine.prototype.setState = function(state) {
    this.state = state;
    switch (this.state) {
      case ENUM.SearchEngineState.OPENED:
        this.el.classList.remove('hidden');
        this.el.classList.remove('search_open');
        this.input.value = '';
        this.input.disabled = false;
        this.input.focus();
        return this.reset();
      case ENUM.SearchEngineState.CLOSED:
        return this.el.classList.add('hidden');
      case ENUM.SearchEngineState.SEARCH:
        this.el.classList.add('search_open');
        this.input.disabled = true;
        this.input.blur();
        this.lineHeight = this.listContainer.querySelector('li').offsetHeight;
        this.resultsHeight = this.lineHeight * (this.listContainer.querySelectorAll('li').length - 1);
        if (this.focused) {
          this.focused.classList.remove('selected');
        }
        return this.el.classList.remove('item_selected');
      case ENUM.SearchEngineState.TRACK_SELECTED:
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
      return this.setState(ENUM.SearchEngineState.OPENED);
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
        _this.setState(ENUM.SearchEngineState.SEARCH);
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
        return _this.setState(ENUM.SearchEngineState.SEARCH);
      };
    })(this));
  };

  return SearchEngine;

})();

SPACE.Jukebox = (function() {
  Jukebox.prototype.SC = null;

  Jukebox.prototype.current = null;

  Jukebox.prototype.airport = null;

  Jukebox.prototype.playlist = null;

  Jukebox.prototype.searchEngine = null;

  Jukebox.prototype.waveformData = null;

  Jukebox.prototype.scene = null;

  Jukebox.prototype.equalizer = null;

  Jukebox.prototype.group = null;

  Jukebox.prototype.state = null;

  Jukebox.prototype.airportState = null;

  Jukebox.prototype.delay = 2000;

  Jukebox.prototype.time = 0;

  function Jukebox(scene) {
    this._whileplaying = bind(this._whileplaying, this);
    this.setAirportState = bind(this.setAirportState, this);
    this._eTrackIsStopped = bind(this._eTrackIsStopped, this);
    this._eTrackIsPlaying = bind(this._eTrackIsPlaying, this);
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.waveformData = {
      mono: null,
      stereo: null
    };
    this.setAirportState(ENUM.AirportState.IDLE);
    this.eqlzr = new SPACE.Equalizer({
      minLength: 0,
      maxLength: 200,
      radius: 300,
      color: 0xFFFFFF,
      absolute: false,
      lineForceDown: .5,
      lineForceUp: 1
    });
    this.group.add(this.eqlzr);
    this.equalizer = new SPACE.Equalizer({
      minLength: 0,
      maxLength: 50,
      radius: 300,
      color: 0xD1D1D1,
      absolute: false,
      lineForceDown: .5,
      lineForceUp: 1
    });
    this.group.add(this.equalizer);
    this.SC = SPACE.SC;
    this.airport = [];
    this.playlist = [];
    this._events();
    this.setState(ENUM.JukeboxState.IS_STOPPED);
  }

  Jukebox.prototype._events = function() {
    document.addEventListener(EVENT.Track.IS_PLAYING.type, this._eTrackIsPlaying);
    return document.addEventListener(EVENT.Track.IS_STOPPED.type, this._eTrackIsStopped);
  };

  Jukebox.prototype._eTrackIsPlaying = function(e) {
    return this.setState(ENUM.JukeboxState.IS_PLAYING);
  };

  Jukebox.prototype._eTrackIsStopped = function(e) {
    if (this.playlist.length > 0) {
      return this.setState(ENUM.JukeboxState.TRACK_STOPPED);
    } else {
      return this.setState(ENUM.JukeboxState.IS_STOPPED);
    }
  };

  Jukebox.prototype._createTrack = function(data) {
    var track;
    track = new SPACE.Track(data);
    track.pendingDuration = this._calcPending(this.playlist.length - 1);
    this.playlist.push(track);
    HELPER.trigger(EVENT.Jukebox.TRACK_ADDED, {
      track: track
    });
    return SPACE.LOG('Sound added: ' + track.data.title);
  };

  Jukebox.prototype._calcPending = function(position) {
    var duration, i, j, len, ref1, track;
    duration = 0;
    ref1 = this.playlist;
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      track = ref1[i];
      duration += track.data.duration;
      if (i === position) {
        break;
      }
    }
    return duration;
  };

  Jukebox.prototype.predefinedPlaylist = function() {
    var i, j, len, list, results1, url;
    list = [];
    list = _Coffee.shuffle(list);
    results1 = [];
    for (i = j = 0, len = list.length; j < len; i = ++j) {
      url = list[i];
      results1.push(this.add(list[i]));
    }
    return results1;
  };

  Jukebox.prototype.setState = function(state) {
    this.state = state;
    switch (state) {
      case ENUM.JukeboxState.IS_PLAYING:
        return this.current.whileplayingCallback = this._whileplaying;
      default:
        if (this.current) {
          this.current.destruct();
        }
        this.current = null;
        if (this.state === ENUM.JukeboxState.IS_STOPPED) {
          console.log('STOPPED');
          return HELPER.trigger(EVENT.Jukebox.IS_STOPPED);
        }
    }
  };

  Jukebox.prototype.setAirportState = function(state) {
    var spaceship;
    this.airportState = state;
    switch (state) {
      case ENUM.AirportState.IDLE:
        return SPACE.LOG('Waiting for new spaceship');
      case ENUM.AirportState.SENDING:
        spaceship = this.airport.shift();
        spaceship.setState(SpaceshipState.LAUNCHED);
        return setTimeout(this.setAirportState, 60 * 1000);
      default:
        return this.setAirportState(ENUM.AirportState.IDLE);
    }
  };

  Jukebox.prototype.update = function(delta) {
    if (this.current === null) {
      this.time += delta;
    } else {
      this.time = 0;
    }
    if (this.playlist.length > 0 && this.time > this.delay) {
      if (this.current === null) {
        return this.next();
      }
    }
  };

  Jukebox.prototype.list = function() {
    var j, len, list, ref1, track;
    list = [];
    ref1 = this.playlist;
    for (j = 0, len = ref1.length; j < len; j++) {
      track = ref1[j];
      list.push({
        title: track.data.title,
        pendingDuration: track.pendingDuration
      });
    }
    return list;
  };

  Jukebox.prototype.add = function(soundOrPlaylist) {
    return this._createTrack(soundOrPlaylist);
  };

  Jukebox.prototype.next = function(track) {
    if (this.current) {
      this.current.stop();
    }
    if (this.playlist.length > 0) {
      this.current = this.playlist.shift();
      this.current.stream();
      return true;
    }
    return false;
  };

  Jukebox.prototype._whileplaying = function() {
    if (this.current) {
      return this.waveformData = this.current.waveformData;
    }
  };

  return Jukebox;

})();

SPACE.Track = (function() {
  Track.prototype.data = null;

  Track.prototype.spaceship = null;

  Track.prototype.sound = null;

  Track.prototype.time = 0;

  Track.prototype.pendingDuration = 0;

  Track.prototype.isPlaying = false;

  Track.prototype.whileplayingCallback = null;

  function Track(data) {
    this._whileplaying = bind(this._whileplaying, this);
    this._onfinish = bind(this._onfinish, this);
    this._onplay = bind(this._onplay, this);
    this._starting = bind(this._starting, this);
    this._eTrackIsStopped = bind(this._eTrackIsStopped, this);
    this._eTrackIsPlaying = bind(this._eTrackIsPlaying, this);
    this.data = data;
    this.SC = SPACE.SC;
    this._events();
  }

  Track.prototype._events = function() {
    document.addEventListener(EVENT.Track.IS_PLAYING.type, this._eTrackIsPlaying);
    return document.addEventListener(EVENT.Track.IS_STOPPED.type, this._eTrackIsStopped);
  };

  Track.prototype._eTrackIsPlaying = function() {
    return this.isPlaying = true;
  };

  Track.prototype._eTrackIsStopped = function() {
    return this.isPlaying = false;
  };

  Track.prototype.stream = function() {
    var url;
    url = 'resources/sounds/' + this.data.url;
    window.WebAudioAPI = window.WebAudioAPI || new SPACE.WebAudioAPI();
    this.api = WebAudioAPI;
    this.api.onplay = this._onplay;
    this.api.onaudioprocess = this._whileplaying;
    this.api.onended = this._onfinish;
    return this.api.setUrl(url);
  };

  Track.prototype.play = function() {
    return this.api.play();
  };

  Track.prototype.pause = function() {
    return this.api.pause();
  };

  Track.prototype.stop = function() {
    this.api.stop();
    return this._onfinish();
  };

  Track.prototype.destruct = function() {
    document.removeEventListener(EVENT.Track.IS_PLAYING.type, this._eTrackIsPlaying);
    document.removeEventListener(EVENT.Track.IS_STOPPED.type, this._eTrackIsStopped);
    return this.api.destroy();
  };

  Track.prototype._starting = function(sound) {
    this.sound = sound;
    return SPACE.LOG('Next: ' + this.data.title);
  };

  Track.prototype._onplay = function() {
    return HELPER.trigger(EVENT.Track.IS_PLAYING, {
      track: this
    });
  };

  Track.prototype._onfinish = function() {
    HELPER.trigger(EVENT.Track.IS_STOPPED, {
      track: this
    });
    return this.api.stop();
  };

  Track.prototype.datas = Array(256);

  Track.prototype._whileplaying = function(e) {
    var analyser, array, i, j;
    analyser = this.api.analyser;
    array = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(array);
    for (i = j = 0; j <= 255; i = ++j) {
      this.datas[i] = array[i];
    }
    this.waveformData = {
      mono: this.datas
    };
    if (this.whileplayingCallback) {
      return this.whileplayingCallback();
    }
  };

  return Track;

})();

SPACE.WebAudioAPI = (function() {
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
  }

  WebAudioAPI.prototype.setUrl = function(url) {
    var request;
    this.ctx = AudioContextObject;
    this._oldBrowser();
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.withCredentials = true;
    request.onload = (function(_this) {
      return function() {
        return _this.ctx.decodeAudioData(request.response, function(buffer) {
          _this.isLoaded = true;
          _this.buffer = buffer;
          return _this.play();
        }, _this._onError);
      };
    })(this);
    return request.send();
  };

  WebAudioAPI.prototype._onError = function() {
    return console.log('ERROR');
  };

  WebAudioAPI.prototype.pause = function() {
    if (this.src) {
      this.src.stop(0);
      this.src = null;
      this.processor.onaudioprocess = null;
      this.position = this.ctx.currentTime - this.startTime;
      return this.isPlaying = false;
    }
  };

  WebAudioAPI.prototype.play = function(position) {
    if (!this.isLoaded) {
      return;
    }
    this._connect();
    this.position = typeof position === 'number' ? position : this.position || 0;
    this.startTime = this.ctx.currentTime - (this.position || 0);
    this.src.start(this.ctx.currentTime, this.position);
    this.isPlaying = true;
    if (this.onplay) {
      return this.onplay();
    }
  };

  WebAudioAPI.prototype.stop = function() {
    if (this.src) {
      this.src.stop();
      this.src.disconnect(0);
      this.src = null;
      this.processor.onaudioprocess = null;
      this.isPlaying = false;
      this.position = 0;
      return this.startTime = 0;
    }
  };

  WebAudioAPI.prototype.volume = function(volume) {
    volume = Math.min(1, Math.max(0, volume));
    return this.gainNode.gain.value = volume;
  };

  WebAudioAPI.prototype.updatePosition = function() {
    if (this.isPlaying) {
      this.position = this.ctx.currentTime - this.startTime;
    }
    if (this.position > this.buffer.duration) {
      this.position = this.buffer.duration;
      this.pause();
    }
    return this.position;
  };

  WebAudioAPI.prototype.seek = function(time) {
    if (this.isPlaying) {
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
    if (this.isPlaying) {
      this.pause();
    }
    this.src = this.ctx.createBufferSource();
    this.src.buffer = this.buffer;
    this.src.onended = this._onEnded;
    this.duration = this.buffer.duration;
    this.analyser = this.ctx.createAnalyser();
    this.analyser.smoothingTimeConstant = .3;
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
    this._oldBrowser();
    return this.volume(0);
  };

  WebAudioAPI.prototype._disconnect = function() {
    if (this.analyser) {
      this.analyser.disconnect(0);
    }
    if (this.processor) {
      return this.processor.disconnect(0);
    }
  };

  WebAudioAPI.prototype._onAudioProcess = function() {
    if (this.onaudioprocess) {
      return this.onaudioprocess();
    }
  };

  WebAudioAPI.prototype._onEnded = function() {
    this.src.disconnect(0);
    this.src = null;
    this.processor.onaudioprocess = null;
    this.isPlaying = false;
    if (this.onended) {
      return this.onended();
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
    this.center = new THREE.Vector3();
    this._values = this.mute(false);
    this._newValues = this.mute(false);
    this.generate();
    this._events();
    this.updateValues();
  }

  Equalizer.prototype._events = function() {
    return document.addEventListener(EVENT.Track.IS_STOPPED.type, this._eTrackIsStopped);
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
      if (typeof value === 'undefined') {
        value = 0;
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
    if (SPACE.Jukebox.state === ENUM.JukeboxState.IS_PLAYING && SPACE.Jukebox.waveformData.mono) {
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

SPACE.DEFAULT.Setup = (function(superClass) {
  extend(Setup, superClass);

  Setup.prototype.jukebox = null;

  Setup.prototype.playlist = null;

  Setup.prototype.current = null;

  Setup.prototype.cover = null;

  Setup.prototype.onadd = false;

  function Setup() {
    this._eCoverTexturesLoaded = bind(this._eCoverTexturesLoaded, this);
    this._eJukeboxIsStopped = bind(this._eJukeboxIsStopped, this);
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

  Setup.prototype._events = function() {
    document.addEventListener(EVENT.Jukebox.IS_STOPPED.type, this._eJukeboxIsStopped);
    return document.addEventListener(EVENT.Cover.TEXTURES_LOADED.type, this._eCoverTexturesLoaded);
  };

  Setup.prototype._eJukeboxIsStopped = function(e) {
    return this._launch();
  };

  Setup.prototype._eCoverTexturesLoaded = function(e) {
    return this._launch();
  };

  Setup.prototype._launch = function() {
    var j, len, ref1, results1, track;
    ref1 = this.playlist;
    results1 = [];
    for (j = 0, len = ref1.length; j < len; j++) {
      track = ref1[j];
      results1.push(this.jukebox.add(track));
    }
    return results1;
  };

  Setup.prototype.setup = function() {
    this.fetchTracks();
    this.cover = new SPACE.DEFAULT.Cover();
    this.add(this.cover);
    return this._events();
  };

  Setup.prototype.fetchTracks = function() {
    var req;
    req = new XMLHttpRequest();
    req.open('GET', 'resources/playlist.json', true);
    req.onload = (function(_this) {
      return function(e) {
        _this.playlist = JSON.parse(e.target.response);
        return _this.cover.load(_this.playlist);
      };
    })(this);
    return req.send(null);
  };

  return Setup;

})(THREE.Group);

SPACE.DEFAULT.Cover = (function(superClass) {
  extend(Cover, superClass);

  Cover.prototype.loadingManager = null;

  Cover.prototype.imageLoader = null;

  Cover.prototype.plane = null;

  Cover.prototype.playlist = null;

  Cover.prototype.texture0 = null;

  Cover.prototype.texture1 = null;

  Cover.prototype.fov = 0;

  Cover.prototype.aspect = 0;

  Cover.prototype.distance = 0;

  function Cover() {
    this._textureLoaded = bind(this._textureLoaded, this);
    this._setupPlane = bind(this._setupPlane, this);
    this._eTrackIsPlaying = bind(this._eTrackIsPlaying, this);
    Cover.__super__.constructor.apply(this, arguments);
    this._setup();
    this._events();
  }

  Cover.prototype._events = function() {
    return document.addEventListener(EVENT.Track.IS_PLAYING.type, this._eTrackIsPlaying);
  };

  Cover.prototype._eTrackIsPlaying = function(e) {
    var css, i, j, len, nextTrack, ref1, title, track, trackData, user_url, username;
    track = e.object.track;
    title = track.data.title;
    username = track.data.author;
    user_url = track.data.author_url;
    $('#information h1').html(title);
    $('#information h2').html('by <a href="' + user_url + '">' + username + '</a>');
    css = "a { color: " + track.data.color1 + " !important; }\nbody { color: " + track.data.color2 + " !important; }";
    $('.cover-style').html(css);
    nextTrack = this.playlist[0];
    ref1 = this.playlist;
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      trackData = ref1[i];
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
    return this.textureLoader.load('resources/covers/' + nextTrack.cover, (function(_this) {
      return function(texture) {
        _this.texture1 = texture;
        return _this._textureLoaded();
      };
    })(this));
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
    return this.loader.load('assets/shaders/cover.vert', (function(_this) {
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
          value: []
        },
        texture1: {
          type: 't',
          value: []
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
          value: 0
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), material);
    this.plane.position.z = -1;
    this.add(this.plane);
    HELPER.trigger(EVENT.Cover.TEXTURES_LOADED);
    this.plane.material.uniforms.texture0.value = new THREE.Texture();
    this.plane.material.uniforms.texture1.value = new THREE.Texture();
    return this.loadingManager.onLoad = this._textureLoaded;
  };

  Cover.prototype._textureLoaded = function(a, b, c) {
    if (this.texture0 && this.texture1) {
      this.setCovers(this.texture0, this.texture1);
      return this.texture0 = this.texture1 = null;
    }
  };

  Cover.prototype.setCovers = function(current, next) {
    var height, ratio, textureHeight, textureWidth, width;
    this.plane.material.uniforms.texture0.value = current;
    this.plane.material.uniforms.texture1.value = next;
    textureWidth = current.image.width;
    textureHeight = current.image.height;
    this.fov = manager.camera.fov / 180 * Math.PI;
    this.aspect = textureWidth / textureHeight;
    this.distance = manager.camera.position.z + 1;
    ratio = Math.max(1, manager.camera.aspect / this.aspect);
    width = 2 * this.aspect * Math.tan(this.fov / 2) * this.distance * ratio;
    height = 2 * Math.tan(this.fov / 2) * this.distance * ratio;
    this.plane.material.uniforms.resolution.value.x = width;
    this.plane.material.uniforms.resolution.value.y = height;
    return this.plane.scale.set(width, height, 1);
  };

  Cover.prototype.resize = function() {
    var ratio, texture0, textureHeight, textureWidth;
    texture0 = this.plane.material.uniforms.texture0;
    textureWidth = texture0.image.width;
    textureHeight = texture0.image.height;
    ratio = Math.max(1, manager.camera.aspect / this.aspect);
    return this.plane.scale.set(2 * this.aspect * Math.tan(this.fov / 2) * this.distance * ratio, 2 * Math.tan(this.fov / 2) * this.distance * ratio, 1);
  };

  Cover.prototype.tMove = 0;

  Cover.prototype.tScale = 0;

  Cover.prototype.next = function() {
    return $(this).animate({
      tScale: 1
    }, {
      duration: 500,
      progress: (function(_this) {
        return function() {
          return _this.plane.material.uniforms.tScale.value = HELPER.Easing.ExponentialEaseOut(_this.tScale);
        };
      })(this)
    }).animate({
      tMove: 1
    }, {
      duration: 750,
      progress: (function(_this) {
        return function() {
          return _this.plane.material.uniforms.tMove.value = HELPER.Easing.ExponentialEaseOut(_this.tMove);
        };
      })(this)
    }).animate({
      tScale: 0
    }, {
      duration: 500,
      progress: (function(_this) {
        return function() {
          return _this.plane.material.uniforms.tScale.value = HELPER.Easing.ExponentialEaseOut(_this.tScale);
        };
      })(this)
    });
  };

  Cover.prototype.update = function(delta) {
    if (this.plane) {
      return this.plane.material.uniforms.aTime.value += delta * 0.001;
    }
  };

  return Cover;

})(THREE.Group);

manager = new SPACE.SceneManager();

manager.createScene('main', SPACE.MainScene);

manager.goToScene('main');

//# sourceMappingURL=data:application/json;base64,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QUFRLENBQVY7S0FSVixFQVNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsR0FBVjtBQUFBLE1BQ0EsUUFBQSxFQUFVLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ1IsS0FBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQyxHQUF3QyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFkLENBQWlDLEtBQUMsQ0FBQSxNQUFsQyxFQURoQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFY7S0FURixFQURJO0VBQUEsQ0FySU4sQ0FBQTs7QUFBQSxrQkFvSkEsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO0FBQ04sSUFBQSxJQUFHLElBQUMsQ0FBQSxLQUFKO2FBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUEvQixJQUF3QyxLQUFBLEdBQVEsTUFEbEQ7S0FETTtFQUFBLENBcEpSLENBQUE7O2VBQUE7O0dBRmdDLEtBQUssQ0FBQyxNQXIyRHhDLENBQUE7O0FBQUEsT0FpZ0VBLEdBQWMsSUFBQSxLQUFLLENBQUMsWUFBTixDQUFBLENBamdFZCxDQUFBOztBQUFBLE9Ba2dFTyxDQUFDLFdBQVIsQ0FBb0IsTUFBcEIsRUFBNEIsS0FBSyxDQUFDLFNBQWxDLENBbGdFQSxDQUFBOztBQUFBLE9BbWdFTyxDQUFDLFNBQVIsQ0FBa0IsTUFBbEIsQ0FuZ0VBLENBQUEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIndpbmRvdy5TUEFDRSA9IHdpbmRvdy5TUEFDRSB8fCB7fVxuXG5TUEFDRS5FTlYgPSAnZGV2ZWxvcG1lbnQnXG5cbiMgUElYSS5KU1xuU1BBQ0UuRlBTICAgICAgICA9IDMwXG5TUEFDRS5waXhlbFJhdGlvID0gKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpXG5cbiMgVEhSRUUuSlNcblNQQUNFLlRIUkVFID0ge31cblxuIyBTT1VORENMT1VEXG5TUEFDRS5TT1VORENMT1VEID0gKC0+XG4gIG9iamVjdCA9IHt9XG4gIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG4gICAgb2JqZWN0LmlkID0gJ2RlMGI4NTM5YjRhZDJmNmNjMjNkZmUxY2M2ZTA0MzhkJ1xuICBlbHNlXG4gICAgb2JqZWN0LmlkID0gJzgwN2QyODU3NWMzODRlNjJhNThiZTVjM2ExNDQ2ZTY4J1xuICBvYmplY3QucmVkaXJlY3RfdXJpID0gd2luZG93LmxvY2F0aW9uLm9yaWdpblxuICByZXR1cm4gb2JqZWN0XG4pKClcblxuXG4jIE1FVEhPRFNcblNQQUNFLkxPRyAgICAgICAgPSAobG9nLCBzdHlsZXM9JycpLT5cbiAgdW5sZXNzIC8ocHJvZHxwcm9kdWN0aW9uKS8udGVzdChTUEFDRS5FTlYpXG4gICAgICBkYXRlICAgICA9IG5ldyBEYXRlKClcbiAgICAgIHRpbWVTdHIgID0gZGF0ZS50b1RpbWVTdHJpbmcoKVxuICAgICAgdGltZVN0ciAgPSB0aW1lU3RyLnN1YnN0cigwLCA4KVxuICAgICAgZGF0ZVN0ciAgPSBkYXRlLmdldERhdGUoKSArICcvJ1xuICAgICAgZGF0ZVN0ciArPSAoZGF0ZS5nZXRNb250aCgpKzEpICsgJy8nXG4gICAgICBkYXRlU3RyICs9IGRhdGUuZ2V0RnVsbFllYXIoKVxuICAgICAgY29uc29sZS5sb2coZGF0ZVN0cisnIC0gJyt0aW1lU3RyKycgfCAnK2xvZywgc3R5bGVzKVxuXG5TUEFDRS5UT0RPICAgICAgID0gKG1lc3NhZ2UpLT5cbiAgU1BBQ0UuTE9HKCclY1RPRE8gfCAnICsgbWVzc2FnZSwgJ2NvbG9yOiAjMDA4OEZGJylcblxuIyBFTlZJUk9OTUVOVFNcblNQQUNFLkRFRkFVTFQgPSB7fVxuXG5cbndpbmRvdy5FVkVOVCA9XG4gIEp1a2Vib3g6XG4gICAgVFJBQ0tfT05fQUREOiAgICAgICBuZXcgRXZlbnQoJ2p1a2Vib3hfdHJhY2tfb25fYWRkJylcbiAgICBUUkFDS19PTl9BRERfRVJST1I6IG5ldyBFdmVudCgnanVrZWJveF90cmFja19vbl9hZGRfZXJyb3InKVxuICAgIFRSQUNLX0FEREVEOiAgICAgICAgbmV3IEV2ZW50KCdqdWtlYm94X3RyYWNrX2FkZGVkJylcbiAgICBPTl9QTEFZOiAgICAgICAgICAgIG5ldyBFdmVudCgnanVrZWJveF9vbl9wbGF5JylcbiAgICBPTl9TVE9QOiAgICAgICAgICAgIG5ldyBFdmVudCgnanVrZWJveF9vbl9zdG9wJylcbiAgICBJU19QTEFZSU5HOiAgICAgICAgIG5ldyBFdmVudCgnanVrZWJveF9pc19wbGF5aW5nJylcbiAgICBJU19TVE9QUEVEOiAgICAgICAgIG5ldyBFdmVudCgnanVrZWJveF9pc19zdG9wcGVkJylcbiAgICBJU19TRUFSQ0hJTkc6ICAgICAgIG5ldyBFdmVudCgnanVrZWJveF9pc19zZWFyY2hpbmcnKVxuICBUcmFjazpcbiAgICBJU19QTEFZSU5HOiBuZXcgRXZlbnQoJ3RyYWNrX2lzX3BsYXlpbmcnKVxuICAgIElTX1BBVVNFRDogIG5ldyBFdmVudCgndHJhY2tfaXNfcGF1c2VkJylcbiAgICBJU19TVE9QUEVEOiBuZXcgRXZlbnQoJ3RyYWNrX2lzX3N0b3BwZWQnKVxuICBTb3VuZENsb3VkOlxuICAgIElTX0NPTk5FQ1RFRDogbmV3IEV2ZW50KCdzb3VuZGNsb3VkX2Nvbm5lY3RlZCcpXG4gIENvdmVyOlxuICAgIFRFWFRVUkVTX0xPQURFRDogbmV3IEV2ZW50KCdjb3Zlcl90ZXh0dXJlc19sb2FkZWQnKVxuT2JqZWN0LmZyZWV6ZShFVkVOVClcblxuXG53aW5kb3cuRU5VTSA9XG4gIEtleWJvYXJkOlxuICAgIEVOVEVSOiAxM1xuICAgIFVQOiAzOFxuICAgIERPV046IDQwXG4gICAgRVNDOiAyN1xuICAgIERFTEVURTogNDZcbiAgU3BhY2VzaGlwU3RhdGU6XG4gICAgSURMRTogJ3NwYWNlc2hpcHN0YXRlX2lkbGUnXG4gICAgTEFVTkNIRUQ6ICdzcGFjZXNoaXBzdGF0ZV9sYXVuY2hlZCdcbiAgICBJTl9MT09QOiAnc3BhY2VzaGlwc3RhdGVfaW5sb29wJ1xuICAgIEFSUklWRUQ6ICdzcGFjZXNoaXBzdGF0ZV9hcnJpdmVkJ1xuICBTZWFyY2hFbmdpbmVTdGF0ZTpcbiAgICBPUEVORUQ6ICdzZWFyY2hlbmdpbmVzdGF0ZV9vcGVuZWQnXG4gICAgQ0xPU0VEOiAnc2VhcmNoZW5naW5lc3RhdGVfY2xvc2VkJ1xuICAgIFNFQVJDSDogJ3NlYXJjaGVuZ2luZXN0YXRlX3NlYXJjaCdcbiAgICBUUkFDS19TRUxFQ1RFRDogJ3NlYXJjaGVuZ2luZXN0YXRlX3RyYWNrc2VsZWN0ZWQnXG4gIEp1a2Vib3hTdGF0ZTpcbiAgICBJU19QTEFZSU5HOiAnanVrZWJveHN0YXRlX2lzcGxheWluZydcbiAgICBJU19TVE9QUEVEOiAnanVrZWJveHN0YXRlX2lzc3RvcHBlZCdcbiAgICBUUkFDS19TVE9QUEVEOiAnanVrZWJveHN0YXRlX3RyYWNrc3RvcHBlZCdcbiAgQWlycG9ydFN0YXRlOlxuICAgIElETEU6ICdhaXJwb3J0c3RhdGVfaWRsZSdcbiAgICBTRU5ESU5HOiAnYWlycG9ydHN0YXRlX3NlbmRpbmcnXG5PYmplY3QuZnJlZXplKEVOVU0pXG5cblxud2luZG93LkhFTFBFUiA9IHdpbmRvdy5IRUxQRVIgfHxcbiAgdHJpZ2dlcjogKGUsIG9iamVjdCktPlxuICAgIGUub2JqZWN0ID0gb2JqZWN0XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChlKVxuXG4gIHJldGluYTogKHZhbHVlKS0+XG4gICAgaWYgdHlwZW9mIHZhbHVlIGlzICdvYmplY3QnXG4gICAgICBvYmplY3QgPSB2YWx1ZVxuICAgICAgbyA9IHt9XG4gICAgICBmb3Iga2V5IG9mIG9iamVjdFxuICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldXG4gICAgICAgIGlmIHR5cGVvZiB2YWx1ZSBpcyAnbnVtYmVyJ1xuICAgICAgICAgIG9ba2V5XSA9IHZhbHVlICogd2luZG93LmRldmljZVBpeGVsUmF0aW9cbiAgICAgIHJldHVybiBAbWVyZ2Uob2JqZWN0LCBvKVxuICAgIGVsc2UgaWYgdHlwZW9mIHZhbHVlIGlzICdhcnJheSdcbiAgICAgIGFycmF5ID0gdmFsdWVcbiAgICAgIGEgPSBbXVxuICAgICAgZm9yIHZhbHVlLCBrZXkgaW4gYXJyYXlcbiAgICAgICAgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICAgICAgYS5wdXNoKHZhbHVlICogd2luZG93LmRldmljZVBpeGVsUmF0aW8pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhLnB1c2godmFsdWUpXG4gICAgICByZXR1cm4gYVxuICAgIGVsc2UgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICByZXR1cm4gdmFsdWUgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb1xuICAgIHJldHVybiBmYWxzZVxuXG5cbkhFTFBFUi5Db2ZmZWUgPVxuICAjIEFycmF5XG4gIHNodWZmbGU6IChhcnJheSktPlxuICAgIHRtcFxuICAgIGN1cnIgPSBhcnJheS5sZW5ndGhcbiAgICB3aGlsZSAwICE9IGN1cnJcbiAgICAgIHJhbmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyKVxuICAgICAgY3VyciAtPSAxXG4gICAgICB0bXAgICAgICAgICA9IGFycmF5W2N1cnJdXG4gICAgICBhcnJheVtjdXJyXSA9IGFycmF5W3JhbmRdXG4gICAgICBhcnJheVtyYW5kXSA9IHRtcFxuICAgIHJldHVybiBhcnJheVxuXG4gICMgT2JqZWN0XG4gIG1lcmdlOiAob3B0aW9ucywgb3ZlcnJpZGVzKSAtPlxuICAgIEBleHRlbmQgKEBleHRlbmQge30sIG9wdGlvbnMpLCBvdmVycmlkZXNcblxuICBleHRlbmQ6IChvYmplY3QsIHByb3BlcnRpZXMpIC0+XG4gICAgZm9yIGtleSwgdmFsIG9mIHByb3BlcnRpZXNcbiAgICAgIG9iamVjdFtrZXldID0gdmFsXG4gICAgb2JqZWN0XG5cblxuSEVMUEVSLk1hdGggPVxuICBhbmdsZUJldHdlZW5Qb2ludHM6IChmaXJzdCwgc2Vjb25kKSAtPlxuICAgIGhlaWdodCA9IHNlY29uZC55IC0gZmlyc3QueVxuICAgIHdpZHRoICA9IHNlY29uZC54IC0gZmlyc3QueFxuICAgIHJldHVybiBNYXRoLmF0YW4yKGhlaWdodCwgd2lkdGgpXG5cbiAgZGlzdGFuY2U6IChwb2ludDEsIHBvaW50MikgLT5cbiAgICB4ID0gcG9pbnQxLnggLSBwb2ludDIueFxuICAgIHkgPSBwb2ludDEueSAtIHBvaW50Mi55XG4gICAgZCA9IHggKiB4ICsgeSAqIHlcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGQpXG5cbiAgY29sbGlzaW9uOiAoZG90MSwgZG90MiktPlxuICAgIHIxID0gaWYgZG90MS5yYWRpdXMgdGhlbiBkb3QxLnJhZGl1cyBlbHNlIDBcbiAgICByMiA9IGlmIGRvdDIucmFkaXVzIHRoZW4gZG90Mi5yYWRpdXMgZWxzZSAwXG4gICAgZGlzdCA9IHIxICsgcjJcblxuICAgIHJldHVybiBAZGlzdGFuY2UoZG90MS5wb3NpdGlvbiwgZG90Mi5wb3NpdGlvbikgPD0gTWF0aC5zcXJ0KGRpc3QgKiBkaXN0KVxuXG4gIG1hcDogKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIC0+XG4gICAgcmV0dXJuIGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSlcblxuICAjIEhlcm1pdGUgQ3VydmVcbiAgaGVybWl0ZTogKHkwLCB5MSwgeTIsIHkzLCBtdSwgdGVuc2lvbiwgYmlhcyktPlxuICAgIGBcbiAgICB2YXIgbTAsbTEsbXUyLG11MztcbiAgICB2YXIgYTAsYTEsYTIsYTM7XG5cbiAgICBtdTIgPSBtdSAqIG11O1xuICAgIG11MyA9IG11MiAqIG11O1xuICAgIG0wICA9ICh5MS15MCkqKDErYmlhcykqKDEtdGVuc2lvbikvMjtcbiAgICBtMCArPSAoeTIteTEpKigxLWJpYXMpKigxLXRlbnNpb24pLzI7XG4gICAgbTEgID0gKHkyLXkxKSooMStiaWFzKSooMS10ZW5zaW9uKS8yO1xuICAgIG0xICs9ICh5My15MikqKDEtYmlhcykqKDEtdGVuc2lvbikvMjtcbiAgICBhMCA9ICAyKm11MyAtIDMqbXUyICsgMTtcbiAgICBhMSA9ICAgIG11MyAtIDIqbXUyICsgbXU7XG4gICAgYTIgPSAgICBtdTMgLSAgIG11MjtcbiAgICBhMyA9IC0yKm11MyArIDMqbXUyO1xuICAgIGBcbiAgICByZXR1cm4oYTAqeTErYTEqbTArYTIqbTErYTMqeTIpXG5cblxuSEVMUEVSLlRIUkVFID1cbiAgSGVybWl0ZUN1cnZlOiAocHRzKS0+XG4gICAgcGF0aCA9IG5ldyBUSFJFRS5DdXJ2ZVBhdGgoKVxuICAgIHBhdGguYWRkKG5ldyBUSFJFRS5IZXJtaXRlQmV6aWVyQ3VydmUzKHB0c1swXSwgcHRzWzBdLCBwdHNbMV0sIHB0c1syXSkpXG4gICAgZm9yIGkgaW4gWzAuLihwdHMubGVuZ3RoLTQpXVxuICAgICAgcGF0aC5hZGQobmV3IFRIUkVFLkhlcm1pdGVCZXppZXJDdXJ2ZTMocHRzW2ldLCBwdHNbaSsxXSwgcHRzW2krMl0sIHB0c1tpKzNdKSlcbiAgICBwYXRoLmFkZChuZXcgVEhSRUUuSGVybWl0ZUJlemllckN1cnZlMyhwdHNbcHRzLmxlbmd0aC0zXSwgcHRzW3B0cy5sZW5ndGgtMl0sIHB0c1twdHMubGVuZ3RoLTFdLCBwdHNbcHRzLmxlbmd0aC0xXSkpXG4gICAgcmV0dXJuIHBhdGhcblxuVEhSRUUuQ3VydmUuVXRpbHMudGFuZ2VudEhlcm1pdGVCZXppZXIgPSAoIHkwLCB5MSwgeTIsIHkzLCBtdSwgdGVuc2lvbiwgYmlhcyApLT5cbiAgICBtdTIgPSBtdSAqIG11XG4gICAgbXUzID0gbXUyICogbXVcblxuICAgIG0wICA9ICh5MS15MCkqKDErYmlhcykqKDEtdGVuc2lvbikvMlxuICAgIG0wICArPSAoeTIteTEpKigxLWJpYXMpKigxLXRlbnNpb24pLzJcblxuICAgIG0xICA9ICh5Mi15MSkqKDErYmlhcykqKDEtdGVuc2lvbikvMlxuICAgIG0xICArPSAoeTMteTIpKigxLWJpYXMpKigxLXRlbnNpb24pLzJcblxuICAgIGEwICA9ICAyKm11MyAtIDMqbXUyICsgMVxuICAgIGExICA9ICAgIG11MyAtIDIqbXUyICsgbXVcbiAgICBhMiAgPSAgICBtdTMgLSAgIG11MlxuICAgIGEzICA9IC0yKm11MyArIDMqbXUyXG5cbiAgICByZXR1cm4oYTAqeTErYTEqbTArYTIqbTErYTMqeTIpXG5cblRIUkVFLkhlcm1pdGVCZXppZXJDdXJ2ZTMgPSBUSFJFRS5DdXJ2ZS5jcmVhdGUoXG4gICh2MCwgdjEsIHYyLCB2MyktPlxuICAgIEB2MCA9IHYwXG4gICAgQHYxID0gdjFcbiAgICBAdjIgPSB2MlxuICAgIEB2MyA9IHYzXG4gICAgcmV0dXJuXG4gICwgKHQpLT5cbiAgICB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgdmVjdG9yLnggPSBUSFJFRS5DdXJ2ZS5VdGlscy50YW5nZW50SGVybWl0ZUJlemllcihAdjAueCwgQHYxLngsIEB2Mi54LCBAdjMueCwgdCwgMCwgMClcbiAgICB2ZWN0b3IueSA9IFRIUkVFLkN1cnZlLlV0aWxzLnRhbmdlbnRIZXJtaXRlQmV6aWVyKEB2MC55LCBAdjEueSwgQHYyLnksIEB2My55LCB0LCAwLCAwKVxuICAgIHZlY3Rvci56ID0gVEhSRUUuQ3VydmUuVXRpbHMudGFuZ2VudEhlcm1pdGVCZXppZXIoQHYwLnosIEB2MS56LCBAdjIueiwgQHYzLnosIHQsIDAsIDApXG4gICAgcmV0dXJuIHZlY3RvclxuKVxuXG5USFJFRS5Jbkxvb3BDdXJ2ZSA9IFRIUkVFLkN1cnZlLmNyZWF0ZShcbiAgKHYwLCBzdGFydEFuZ2xlPTAsIG1heFJhZGl1cz0xMDAsIG1pblJhZGl1cz0wLCBpbnZlcnNlPWZhbHNlLCB1c2VHb2xkZW49ZmFsc2UpLT5cbiAgICBAdjAgICAgICAgICA9IHYwXG4gICAgQGludmVyc2UgICAgPSBpbnZlcnNlXG4gICAgQHN0YXJ0QW5nbGUgPSBzdGFydEFuZ2xlXG5cbiAgICBAbWF4UmFkaXVzICA9IG1heFJhZGl1c1xuICAgIEBtaW5SYWRpdXMgID0gbWluUmFkaXVzXG4gICAgQHJhZGl1cyAgICAgPSBAbWF4UmFkaXVzIC0gQG1pblJhZGl1c1xuXG4gICAgQHVzZUdvbGRlbiAgPSB1c2VHb2xkZW5cblxuICAgIHJldHVyblxuICAsICh0KS0+XG4gICAgdCAgICAgPSAxIC0gdCBpZiBAaW52ZXJzZVxuICAgIGlmIEB1c2VHb2xkZW5cbiAgICAgICAgcGhpICAgPSAoTWF0aC5zcXJ0KDUpKzEpLzIgLSAxXG4gICAgICAgIGdvbGRlbl9hbmdsZSA9IHBoaSAqIE1hdGguUEkgKiAyXG4gICAgICAgIGFuZ2xlID0gQHN0YXJ0QW5nbGUgKyAoZ29sZGVuX2FuZ2xlICogdClcbiAgICAgICAgYW5nbGUgKz0gTWF0aC5QSSAqIC0xLjIzNVxuICAgIGVsc2VcbiAgICAgICAgYW5nbGUgPSBAc3RhcnRBbmdsZSArIChNYXRoLlBJICogMiAqIHQpXG5cbiAgICB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgdmVjdG9yLnggPSBAdjAueCArIE1hdGguY29zKGFuZ2xlKSAqIChAbWluUmFkaXVzICsgQHJhZGl1cyAqIHQpXG4gICAgdmVjdG9yLnkgPSBAdjAueSArIE1hdGguc2luKGFuZ2xlKSAqIChAbWluUmFkaXVzICsgQHJhZGl1cyAqIHQpXG4gICAgdmVjdG9yLnogPSBAdjAuelxuICAgIHJldHVybiB2ZWN0b3JcbilcblxuVEhSRUUuTGF1bmNoZWRDdXJ2ZSA9IFRIUkVFLkN1cnZlLmNyZWF0ZShcbiAgKHYwLCB2MSwgbmJMb29wPTIpLT5cbiAgICBAdjAgICA9IHYwXG4gICAgQHYxICAgPSB2MVxuICAgIEBuYkxvb3AgPSBuYkxvb3BcbiAgICByZXR1cm5cbiAgLCAodCktPlxuICAgIGFuZ2xlID0gTWF0aC5QSSAqIDIgKiB0ICogQG5iTG9vcFxuXG4gICAgZCA9IEB2MS56IC0gQHYwLnpcblxuICAgIGRpc3QgPSBAdjEuY2xvbmUoKS5zdWIoQHYwKVxuXG4gICAgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIHZlY3Rvci54ID0gQHYwLnggKyBkaXN0LnggKiB0XG4gICAgdmVjdG9yLnkgPSBAdjAueSArIGRpc3QueSAqIHRcbiAgICB2ZWN0b3IueiA9IEB2MC56ICsgZGlzdC56ICogdFxuXG4gICAgdCA9IE1hdGgubWluKHQsIDEgLSB0KSAvIC41XG5cbiAgICB2ZWN0b3IueCArPSBNYXRoLmNvcyhhbmdsZSkgKiAoNTAgKiB0KVxuICAgIHZlY3Rvci55ICs9IE1hdGguc2luKGFuZ2xlKSAqICg1MCAqIHQpXG5cbiAgICByZXR1cm4gdmVjdG9yXG4pXG5cblxuSEVMUEVSLkVhc2luZyA9XG5cbiAgI1xuICAjICBFYXNpbmcgZnVuY3Rpb24gaW5zcGlyZWQgZnJvbSBBSEVhc2luZ1xuICAjICBodHRwczovL2dpdGh1Yi5jb20vd2FycmVubS9BSEVhc2luZ1xuICAjXG5cbiAgIyMgTW9kZWxlZCBhZnRlciB0aGUgbGluZSB5ID0geFxuICBsaW5lYXI6IChwKS0+XG4gICAgcmV0dXJuIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBhcmFib2xhIHkgPSB4XjJcbiAgUXVhZHJhdGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcFxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGFyYWJvbGEgeSA9IC14XjIgKyAyeFxuICBRdWFkcmF0aWNFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiAtKHAgKiAocCAtIDIpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIHF1YWRyYXRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjIpICAgICAgICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gLSgxLzIpKCgyeC0xKSooMngtMykgLSAxKSA7IFswLjUsIDFdXG4gIFF1YWRyYXRpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDIgKiBwICogcFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoLTIgKiBwICogcCkgKyAoNCAqIHApIC0gMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgY3ViaWMgeSA9IHheM1xuICBDdWJpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBjdWJpYyB5ID0gKHggLSAxKV4zICsgMVxuICBDdWJpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSlcbiAgICByZXR1cm4gZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIGN1YmljXG4gICMgeSA9ICgxLzIpKCgyeCleMykgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKSgoMngtMileMyArIDIpIDsgWzAuNSwgMV1cbiAgQ3ViaWNFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiA0ICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9ICgoMiAqIHApIC0gMilcbiAgICAgIHJldHVybiAwLjUgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHheNFxuICBRdWFydGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHkgPSAxIC0gKHggLSAxKV40XG4gIFF1YXJ0aWNFYXNlT3V0OiAocCktPlxuICAgIGYgPSAocCAtIDEpXG4gICAgcmV0dXJuIGYgKiBmICogZiAqICgxIC0gcCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgcXVhcnRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjQpICAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9IC0oMS8yKSgoMngtMileNCAtIDIpIDsgWzAuNSwgMV1cbiAgUXVhcnRpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDggKiBwICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9IChwIC0gMSlcbiAgICAgIHJldHVybiAtOCAqIGYgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWludGljIHkgPSB4XjVcbiAgUXVpbnRpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwICogcCAqIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1aW50aWMgeSA9ICh4IC0gMSleNSArIDFcbiAgUXVpbnRpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSk7XG4gICAgcmV0dXJuIGYgKiBmICogZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIHF1aW50aWNcbiAgIyB5ID0gKDEvMikoKDJ4KV41KSAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKCgyeC0yKV41ICsgMikgOyBbMC41LCAxXVxuICBRdWludGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMTYgKiBwICogcCAqIHAgKiBwICogcFxuICAgIGVsc2VcbiAgICAgIGYgPSAoKDIgKiBwKSAtIDIpXG4gICAgICByZXR1cm4gIDAuNSAqIGYgKiBmICogZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciBxdWFydGVyLWN5Y2xlIG9mIHNpbmUgd2F2ZVxuICBTaW5lRWFzZUluOiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigocCAtIDEpICogTWF0aC5QSSAqIDIpICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciBxdWFydGVyLWN5Y2xlIG9mIHNpbmUgd2F2ZSAoZGlmZmVyZW50IHBoYXNlKVxuICBTaW5lRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gTWF0aC5zaW4ocCAqIE1hdGguUEkgKiAyKVxuXG4gICMgTW9kZWxlZCBhZnRlciBoYWxmIHNpbmUgd2F2ZVxuICBTaW5lRWFzZUluT3V0OiAocCktPlxuICAgIHJldHVybiAwLjUgKiAoMSAtIE1hdGguY29zKHAgKiBNYXRoLlBJKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgc2hpZnRlZCBxdWFkcmFudCBJViBvZiB1bml0IGNpcmNsZVxuICBDaXJjdWxhckVhc2VJbjogKHApLT5cbiAgICByZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gKHAgKiBwKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgc2hpZnRlZCBxdWFkcmFudCBJSSBvZiB1bml0IGNpcmNsZVxuICBDaXJjdWxhckVhc2VPdXQ6IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc3FydCgoMiAtIHApICogcCk7XG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgY2lyY3VsYXIgZnVuY3Rpb25cbiAgIyB5ID0gKDEvMikoMSAtIHNxcnQoMSAtIDR4XjIpKSAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKShzcXJ0KC0oMnggLSAzKSooMnggLSAxKSkgKyAxKSA7IFswLjUsIDFdXG4gIENpcmN1bGFyRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogKDEgLSBNYXRoLnNxcnQoMSAtIDQgKiAocCAqIHApKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMC41ICogKE1hdGguc3FydCgtKCgyICogcCkgLSAzKSAqICgoMiAqIHApIC0gMSkpICsgMSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGV4cG9uZW50aWFsIGZ1bmN0aW9uIHkgPSAyXigxMCh4IC0gMSkpXG4gIEV4cG9uZW50aWFsRWFzZUluOiAocCktPlxuICAgIHJldHVybiBpZiAocCA9PSAwLjApIHRoZW4gcCBlbHNlIE1hdGgucG93KDIsIDEwICogKHAgLSAxKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGV4cG9uZW50aWFsIGZ1bmN0aW9uIHkgPSAtMl4oLTEweCkgKyAxXG4gIEV4cG9uZW50aWFsRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gaWYgKHAgPT0gMS4wKSB0aGVuIHAgZWxzZSAxIC0gTWF0aC5wb3coMiwgLTEwICogcClcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBleHBvbmVudGlhbFxuICAjIHkgPSAoMS8yKTJeKDEwKDJ4IC0gMSkpICAgICAgICAgOyBbMCwwLjUpXG4gICMgeSA9IC0oMS8yKSoyXigtMTAoMnggLSAxKSkpICsgMSA7IFswLjUsMV1cbiAgRXhwb25lbnRpYWxFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA9PSAwLjAgfHwgcCA9PSAxLjApXG4gICAgICByZXR1cm4gcFxuXG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiBNYXRoLnBvdygyLCAoMjAgKiBwKSAtIDEwKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAtMC41ICogTWF0aC5wb3coMiwgKC0yMCAqIHApICsgMTApICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgZGFtcGVkIHNpbmUgd2F2ZSB5ID0gc2luKDEzcGkvMip4KSpwb3coMiwgMTAgKiAoeCAtIDEpKVxuICBFbGFzdGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigxMyAqIE1hdGguUEkgKiAyICogcCkgKiBNYXRoLnBvdygyLCAxMCAqIChwIC0gMSkpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBkYW1wZWQgc2luZSB3YXZlIHkgPSBzaW4oLTEzcGkvMiooeCArIDEpKSpwb3coMiwgLTEweCkgKyAxXG4gIEVsYXN0aWNFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigtMTMgKiBNYXRoLlBJICogMiAqIChwICsgMSkpICogTWF0aC5wb3coMiwgLTEwICogcCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgZXhwb25lbnRpYWxseS1kYW1wZWQgc2luZSB3YXZlOlxuICAjIHkgPSAoMS8yKSpzaW4oMTNwaS8yKigyKngpKSpwb3coMiwgMTAgKiAoKDIqeCkgLSAxKSkgICAgICA7IFswLDAuNSlcbiAgIyB5ID0gKDEvMikqKHNpbigtMTNwaS8yKigoMngtMSkrMSkpKnBvdygyLC0xMCgyKngtMSkpICsgMikgOyBbMC41LCAxXVxuICBFbGFzdGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogTWF0aC5zaW4oMTMgKiBNYXRoLlBJICogMiAqICgyICogcCkpICogTWF0aC5wb3coMiwgMTAgKiAoKDIgKiBwKSAtIDEpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5zaW4oLTEzICogTWF0aC5QSSAqIDIgKiAoKDIgKiBwIC0gMSkgKyAxKSkgKiBNYXRoLnBvdygyLCAtMTAgKiAoMiAqIHAgLSAxKSkgKyAyKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgb3ZlcnNob290aW5nIGN1YmljIHkgPSB4XjMteCpzaW4oeCpwaSlcbiAgQmFja0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwIC0gcCAqIE1hdGguc2luKHAgKiBNYXRoLlBJKVxuXG4gICMgTW9kZWxlZCBhZnRlciBvdmVyc2hvb3RpbmcgY3ViaWMgeSA9IDEtKCgxLXgpXjMtKDEteCkqc2luKCgxLXgpKnBpKSlcbiAgQmFja0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9ICgxIC0gcClcbiAgICByZXR1cm4gMSAtIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIG92ZXJzaG9vdGluZyBjdWJpYyBmdW5jdGlvbjpcbiAgIyB5ID0gKDEvMikqKCgyeCleMy0oMngpKnNpbigyKngqcGkpKSAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKSooMS0oKDEteCleMy0oMS14KSpzaW4oKDEteCkqcGkpKSsxKSA7IFswLjUsIDFdXG4gIEJhY2tFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIGYgPSAyICogcFxuICAgICAgcmV0dXJuIDAuNSAqIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKVxuICAgIGVsc2VcbiAgICAgIGYgPSAoMSAtICgyKnAgLSAxKSlcbiAgICAgIHJldHVybiAwLjUgKiAoMSAtIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKSkgKyAwLjVcblxuICBCb3VuY2VFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIDEgLSBAQm91bmNlRWFzZU91dCgxIC0gcCk7XG5cbiAgQm91bmNlRWFzZU91dDogKHApLT5cbiAgICBpZihwIDwgNC8xMS4wKVxuICAgICAgcmV0dXJuICgxMjEgKiBwICogcCkvMTYuMFxuICAgIGVsc2UgaWYocCA8IDgvMTEuMClcbiAgICAgIHJldHVybiAoMzYzLzQwLjAgKiBwICogcCkgLSAoOTkvMTAuMCAqIHApICsgMTcvNS4wXG4gICAgZWxzZSBpZihwIDwgOS8xMC4wKVxuICAgICAgcmV0dXJuICg0MzU2LzM2MS4wICogcCAqIHApIC0gKDM1NDQyLzE4MDUuMCAqIHApICsgMTYwNjEvMTgwNS4wXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICg1NC81LjAgKiBwICogcCkgLSAoNTEzLzI1LjAgKiBwKSArIDI2OC8yNS4wXG5cbiAgQm91bmNlRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogQEJvdW5jZUVhc2VJbihwKjIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIDAuNSAqIEBCb3VuY2VFYXNlT3V0KHAgKiAyIC0gMSkgKyAwLjVcblxuXG5jbGFzcyBTUEFDRS5TY2VuZSBleHRlbmRzIFRIUkVFLlNjZW5lXG4gICMgcGF1c2VkOiBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyXG5cbiAgICBAdHlwZSAgICAgICAgICAgICA9ICdTY2VuZSdcbiAgICBAZm9nICAgICAgICAgICAgICA9IG51bGxcbiAgICBAb3ZlcnJpZGVNYXRlcmlhbCA9IG51bGxcbiAgICBAYXV0b1VwZGF0ZSAgICAgICA9IHRydWVcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cbiAgICAgIEB1cGRhdGVPYmooY2hpbGQsIGRlbHRhKVxuXG4gIHVwZGF0ZU9iajogKG9iaiwgZGVsdGEpLT5cbiAgICBvYmoudXBkYXRlKGRlbHRhKSBpZiB0eXBlb2Ygb2JqLnVwZGF0ZSA9PSAnZnVuY3Rpb24nXG4gICAgaWYgb2JqLmhhc093blByb3BlcnR5KCdjaGlsZHJlbicpIGFuZCBvYmouY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgICAgZm9yIGNoaWxkIGluIG9iai5jaGlsZHJlblxuICAgICAgICBAdXBkYXRlT2JqKGNoaWxkLCBkZWx0YSlcblxuICByZXNpemU6ID0+XG4gICAgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuICAgICAgQHJlc2l6ZU9iaihjaGlsZClcblxuICByZXNpemVPYmo6IChvYmopLT5cbiAgICBvYmoucmVzaXplKCkgaWYgdHlwZW9mIG9iai5yZXNpemUgPT0gJ2Z1bmN0aW9uJ1xuICAgIGlmIG9iai5oYXNPd25Qcm9wZXJ0eSgnY2hpbGRyZW4nKSBhbmQgb2JqLmNoaWxkcmVuLmxlbmd0aCA+IDBcbiAgICAgIGZvciBjaGlsZCBpbiBvYmouY2hpbGRyZW5cbiAgICAgICAgQHJlc2l6ZU9iaihjaGlsZClcblxuICByZXN1bWU6IC0+XG4gICAgQHBhdXNlZCA9IGZhbHNlXG5cbiAgcGF1c2U6IC0+XG4gICAgQHBhdXNlZCA9IHRydWVcblxuICBpc1BhdXNlZDogLT5cbiAgICByZXR1cm4gQHBhdXNlZFxuXG5cbmNsYXNzIFNQQUNFLlNjZW5lTWFuYWdlclxuXG4gIGN1cnJlbnRTY2VuZTogbnVsbFxuICBfc2NlbmVzOiBudWxsXG4gIF9zdGF0czogbnVsbFxuICBfY2xvY2s6IG51bGxcbiAgX3RpY2s6IDBcblxuICByZW5kZXJlcjogbnVsbFxuICBjYW1lcmE6ICAgbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAod2lkdGgsIGhlaWdodCktPlxuICAgIGlmIChAcmVuZGVyZXIpIHRoZW4gcmV0dXJuIEBcblxuICAgIEBfY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKVxuXG4gICAgQF9zY2VuZXMgICA9IFtdXG5cbiAgICBAY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKVxuICAgIEBjYW1lcmEucG9zaXRpb24uc2V0Wig2MDApXG4gICAgIyBAY2FtZXJhLnBvc2l0aW9uLnNldFkoNTAwKVxuICAgICMgQGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpXG5cbiAgICBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7YW50aWFsaWFzOiB0cnVlLCBhbHBoYTogZmFsc2V9KVxuICAgICMgQHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4NThiMWZmKSlcbiAgICBAcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KVxuICAgICMgQHJlbmRlcmVyLnNoYWRvd01hcEVuYWJsZWQgPSB0cnVlXG4gICAgIyBAcmVuZGVyZXIuc2hhZG93TWFwU29mdCAgICA9IHRydWVcbiAgICAjIEByZW5kZXJlci5zaGFkb3dNYXBUeXBlICAgID0gVEhSRUUuUENGU2hhZG93TWFwXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyYXBwZXInKS5hcHBlbmRDaGlsZChAcmVuZGVyZXIuZG9tRWxlbWVudClcblxuICAgIEBfc2V0dXBTdGF0cygpIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG5cbiAgICBAX3JlbmRlcigpXG4gICAgQF91cGRhdGUoKVxuXG4gICAgd2luZG93Lm9ucmVzaXplID0gPT5cbiAgICAgIEByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgICBAY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0XG4gICAgICBAY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuXG4gIF9zZXR1cFN0YXRzOiAtPlxuICAgIEBfc3RhdHMgPSBuZXcgU3RhdHMoKVxuICAgIEBfc3RhdHMuc2V0TW9kZSgwKVxuICAgIEBfc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgICBAX3N0YXRzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnXG4gICAgQF9zdGF0cy5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggQF9zdGF0cy5kb21FbGVtZW50IClcblxuICBfcmVuZGVyOiA9PlxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoQF9yZW5kZXIpXG5cbiAgICBpZiAhQGN1cnJlbnRTY2VuZSBvciBAY3VycmVudFNjZW5lLmlzUGF1c2VkKClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAjIGMgPSBEYXRlLm5vdygpXG4gICAgQGN1cnJlbnRTY2VuZS51cGRhdGUoQF9jbG9jay5nZXREZWx0YSgpICogMTAwMClcbiAgICAjIEBjdXJyZW50U2NlbmUudXBkYXRlKGMgLSBAX3RpY2spO1xuICAgICMgQF90aWNrID0gY1xuXG4gICAgQHJlbmRlcmVyLnJlbmRlciggQGN1cnJlbnRTY2VuZSwgQGNhbWVyYSApXG5cbiAgICBAX3N0YXRzLnVwZGF0ZSgpIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG5cbiAgX3VwZGF0ZTogPT5cbiAgICAjIHNldFRpbWVvdXQoQF91cGRhdGUsIDEwMDAgLyBTUEFDRS5GUFMpXG5cbiAgICAjIGlmICFAY3VycmVudFNjZW5lIG9yIEBjdXJyZW50U2NlbmUuaXNQYXVzZWQoKVxuICAgICMgICAgIHJldHVyblxuXG4gICAgIyBjID0gRGF0ZS5ub3coKVxuICAgICMgIyBAY3VycmVudFNjZW5lLnVwZGF0ZShAX2Nsb2NrLmdldERlbHRhKCkpXG4gICAgIyBAY3VycmVudFNjZW5lLnVwZGF0ZShjIC0gQF90aWNrKTtcbiAgICAjIGNvbnNvbGUubG9nIGMgLSBAX3RpY2tcbiAgICAjIEBfdGljayA9IGNcblxuICBjcmVhdGVTY2VuZTogKGlkZW50aWZpZXIsIGFTY2VuZSwgaW50ZXJhY3RpdmUpLT5cbiAgICBpZiBAX3NjZW5lc1tpZGVudGlmaWVyXVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICBzY2VuZSA9IG5ldyBhU2NlbmUoKVxuICAgIEBfc2NlbmVzW2lkZW50aWZpZXJdID0gc2NlbmVcblxuICAgIHJldHVybiBzY2VuZVxuXG4gIGdvVG9TY2VuZTogKGlkZW50aWZpZXIpLT5cbiAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUnLCBAY3VycmVudFNjZW5lLnJlc2l6ZSkgaWYgQGN1cnJlbnRTY2VuZVxuICAgIGlmIEBfc2NlbmVzW2lkZW50aWZpZXJdXG4gICAgICAgIEBjdXJyZW50U2NlbmUucGF1c2UoKSBpZiBAY3VycmVudFNjZW5lXG4gICAgICAgIEBjdXJyZW50U2NlbmUgPSBAX3NjZW5lc1tpZGVudGlmaWVyXVxuICAgICAgICBAY3VycmVudFNjZW5lLnJlc3VtZSgpXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgQGN1cnJlbnRTY2VuZS5yZXNpemUpXG4gICAgICAgIHJldHVybiB0cnVlXG5cbiAgICByZXR1cm4gZmFsc2VcblxuXG5jbGFzcyBTUEFDRS5NYWluU2NlbmUgZXh0ZW5kcyBTUEFDRS5TY2VuZVxuXG4gIGVxdWFsaXplcjogbnVsbFxuICBqdWtlYm94OiAgIG51bGxcblxuICBsb2FkaW5nTWFuYWdlcjogbnVsbFxuICBsb2FkZXI6ICAgICAgICAgbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyXG5cbiAgICBAX2V2ZW50cygpXG4gICAgQHNldHVwKClcblxuICAgICMgIyBDcmVhdGUgYSBTQyBzaW5nbGV0b25cbiAgICAjIHVubGVzcyBTUEFDRS5oYXNPd25Qcm9wZXJ0eSgnU0MnKVxuICAgICMgICBTUEFDRS5TQyA9IG5ldyBTUEFDRS5Tb3VuZENsb3VkKFNQQUNFLlNPVU5EQ0xPVUQuaWQsIFNQQUNFLlNPVU5EQ0xPVUQucmVkaXJlY3RfdXJpKVxuICAgICMgQFNDID0gU1BBQ0UuU0NcblxuICAgICMgQHNldHVwKCkgaWYgQFNDLmlzQ29ubmVjdGVkKClcblxuICAgIEBlbnYgPSBuZXcgU1BBQ0UuREVGQVVMVC5TZXR1cCgpXG4gICAgQGVudi5vbkVudGVyKClcbiAgICBAYWRkKEBlbnYpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNvdW5kQ2xvdWQuSVNfQ09OTkVDVEVELnR5cGUsIEBzZXR1cClcblxuICBzZXR1cDogPT5cbiAgICBTUEFDRS5KdWtlYm94ICAgICAgICAgPSBuZXcgU1BBQ0UuSnVrZWJveCh0aGlzKVxuICAgIEBqdWtlYm94ICAgICAgICAgICAgICA9IFNQQUNFLkp1a2Vib3hcbiAgICBAanVrZWJveC53aGlsZXBsYXlpbmcgPSBAX3doaWxlcGxheWluZ1xuXG4gIHVwZGF0ZTogKGRlbHRhKS0+XG4gICAgc3VwZXIoZGVsdGEpXG4gICAgQGp1a2Vib3gudXBkYXRlKGRlbHRhKSBpZiBAanVrZWJveFxuXG5cbmNsYXNzIFNQQUNFLlNvdW5kQ2xvdWRcblxuICBjbGllbnRfaWQ6ICAgIG51bGxcbiAgcmVkaXJlY3RfdXJpOiBudWxsXG4gIHRva2VuOiAgICAgICAgbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIHJlZGlyZWN0X3VyaSktPlxuICAgIFNDLmluaXRpYWxpemUoe1xuICAgICAgY2xpZW50X2lkOiBpZFxuICAgICAgcmVkaXJlY3RfdXJpOiByZWRpcmVjdF91cmlcbiAgICB9KVxuXG4gICAgQGNsaWVudF9pZCAgICA9IGlkXG4gICAgQHJlZGlyZWN0X3VyaSA9IHJlZGlyZWN0X3VyaVxuXG4gICAgIyBzb3VuZE1hbmFnZXIuc2V0dXAoe1xuICAgICMgICB1cmw6XG4gICAgIyAgIGF1dG9QbGF5OiB0cnVlXG4gICAgIyAgIHVzZVdhdmVmb3JtRGF0YTogdHJ1ZVxuICAgICMgICB1c2VIVE1MNWF1ZGlvOiB0cnVlXG4gICAgIyAgIHByZWZlckZsYXNoOiBmYWxzZVxuICAgICMgICBmbGFzaDlPcHRpb25zOlxuICAgICMgICAgIHVzZVdhdmVmb3JtRGF0YTogdHJ1ZVxuICAgICMgfSlcblxuICBpc0Nvbm5lY3RlZDogLT5cbiAgICBpZiAoZG9jdW1lbnQuY29va2llLnJlcGxhY2UoLyg/Oig/Ol58Lio7XFxzKilzb3VuZGNsb3VkX2Nvbm5lY3RlZFxccypcXD1cXHMqKFteO10qKS4qJCl8Xi4qJC8sIFwiJDFcIikgIT0gXCJ0cnVlXCIpXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW4nKS5jbGFzc0xpc3QuYWRkKCdzaG93JylcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgQF9lQ2xpY2spXG4gICAgZWxzZVxuICAgICAgQHRva2VuID0gZG9jdW1lbnQuY29va2llLnJlcGxhY2UoLyg/Oig/Ol58Lio7XFxzKilzb3VuZGNsb3VkX3Rva2VuXFxzKlxcPVxccyooW147XSopLiokKXxeLiokLywgXCIkMVwiKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICBfZUNsaWNrOiA9PlxuICAgIFNDLmNvbm5lY3QoPT5cbiAgICAgIEB0b2tlbiAgICAgICAgICA9IFNDLmFjY2Vzc1Rva2VuKClcbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IFwic291bmRjbG91ZF90b2tlbj1cIiArIEB0b2tlblxuICAgICAgZG9jdW1lbnQuY29va2llID0gXCJzb3VuZGNsb3VkX2Nvbm5lY3RlZD10cnVlXCJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbicpLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxuICAgICAgSEVMUEVSLnRyaWdnZXIoRVZFTlQuU291bmRDbG91ZC5JU19DT05ORUNURUQpXG4gICAgKVxuXG4gIHBhdGhPclVybDogKHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgIyBWZXJpZnkgaWYgaXQncyBhbiBJRCBvciBhbiBVUkxcbiAgICBpZiAvXlxcLyhwbGF5bGlzdHN8dHJhY2tzfHVzZXJzKVxcL1swLTldKyQvLnRlc3QocGF0aClcbiAgICAgIHJldHVybiBjYWxsYmFjayhwYXRoKVxuXG4gICAgdW5sZXNzIC9eKGh0dHB8aHR0cHMpLy50ZXN0KHBhdGgpXG4gICAgICByZXR1cm4gY29uc29sZS5sb2cgXCJcXFwiXCIgKyBwYXRoICsgXCJcXFwiIGlzIG5vdCBhbiB1cmwgb3IgYSBwYXRoXCJcblxuICAgIFNDLmdldCgnL3Jlc29sdmUnLCB7IHVybDogcGF0aCB9LCAodHJhY2ssIGVycm9yKT0+XG4gICAgICBpZiAoZXJyb3IpXG4gICAgICAgIGNvbnNvbGUubG9nIGVycm9yLm1lc3NhZ2VcbiAgICAgICAgY2FsbGJhY2soZXJyb3IubWVzc2FnZSwgZXJyb3IpXG4gICAgICBlbHNlXG4gICAgICAgIHVybCA9IFsnJywgdHJhY2sua2luZCsncycsIHRyYWNrLmlkXS5qb2luKCcvJylcbiAgICAgICAgY2FsbGJhY2sodXJsKVxuICAgIClcblxuICBzdHJlYW1Tb3VuZDogKG9iamVjdCwgb3B0aW9ucz17fSwgY2FsbGJhY2spLT5cbiAgICBpZiBvYmplY3QgYW5kIG9iamVjdC5oYXNPd25Qcm9wZXJ0eSgna2luZCcpXG4gICAgICBwYXRoID0gb2JqZWN0LnVyaS5yZXBsYWNlKCdodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbScsICcnKVxuXG4gICAgICBkZWZhdWx0cyA9XG4gICAgICAgIGF1dG9QbGF5OiB0cnVlXG4gICAgICAgIHVzZVdhdmVmb3JtRGF0YTogdHJ1ZVxuICAgICAgICB1c2VIVE1MNWF1ZGlvOiB0cnVlXG4gICAgICAgIHByZWZlckZsYXNoOiBmYWxzZVxuXG4gICAgICBvcHRpb25zID0gX0NvZmZlZS5tZXJnZShkZWZhdWx0cywgb3B0aW9ucylcbiAgICAgIFNDLnN0cmVhbShwYXRoLCBvcHRpb25zLCBjYWxsYmFjaylcbiAgICAgICMgc291bmRNYW5hZ2VyLmZsYXNoOU9wdGlvbnMudXNlV2F2ZWZvcm1EYXRhID0gdHJ1ZVxuXG4gICAgICAjIEBnZXRTb3VuZFVybChwYXRoLCAodXJsKS0+XG4gICAgICAjICAgb3B0aW9ucy51cmwgPSB1cmxcbiAgICAgICMgICBzb3VuZCA9IHNvdW5kTWFuYWdlci5jcmVhdGVTb3VuZChvcHRpb25zKVxuICAgICAgIyAgIGNhbGxiYWNrKHNvdW5kKVxuICAgICAgIyApXG5cbiAgZ2V0U291bmRPclBsYXlsaXN0OiAocGF0aCwgY2FsbGJhY2spLT5cbiAgICBpZiB0eXBlb2YgcGF0aCA9PSAnb2JqZWN0JyBhbmQgcGF0aC5oYXNPd25Qcm9wZXJ0eSgna2luZCcpXG4gICAgICBjYWxsYmFjayhwYXRoKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIEBwYXRoT3JVcmwocGF0aCwgKHBhdGgsIGVycm9yKT0+XG4gICAgICBpZiBlcnJvclxuICAgICAgICBjYWxsYmFjayhwYXRoLCBlcnJvcilcbiAgICAgICAgcmV0dXJuXG4gICAgICBAZ2V0KHBhdGgsIGNhbGxiYWNrKVxuICAgIClcblxuICBnZXQ6IChwYXRoLCBjYWxsYmFjayktPlxuICAgIFNDLmdldChwYXRoLCBjYWxsYmFjaylcblxuICBnZXRTb3VuZFVybDogKHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgQGdldFNvdW5kT3JQbGF5bGlzdChwYXRoLCAoc291bmQpPT5cbiAgICAgIGNhbGxiYWNrKHNvdW5kLnN0cmVhbV91cmwrJz9vYXV0aF90b2tlbj0nK0B0b2tlbilcbiAgICApXG5cbiAgc2VhcmNoOiAoc2VhcmNoLCBwYXRoLCBjYWxsYmFjayktPlxuICAgIGlmIHR5cGVvZiBwYXRoID09ICdmdW5jdGlvbidcbiAgICAgIGNhbGxiYWNrID0gcGF0aFxuICAgICAgcGF0aCAgICAgPSAndHJhY2tzJ1xuXG4gICAgaWYgcGF0aCA9PSAndXNlcnMnXG4gICAgICBAcGF0aE9yVXJsKCdodHRwczovL3NvdW5kY2xvdWQuY29tLycrc2VhcmNoLCAocGF0aCwgZXJyb3IpPT5cbiAgICAgICAgaWYgZXJyb3JcbiAgICAgICAgICBjYWxsYmFjayhwYXRoLCBlcnJvcilcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICBwYXRoID0gcGF0aCsnL2Zhdm9yaXRlcz9vYXV0aF90b2tlbj0nK0B0b2tlblxuICAgICAgICBTQy5nZXQocGF0aCwgY2FsbGJhY2spXG4gICAgICApXG4gICAgZWxzZVxuICAgICAgcGF0aCA9ICcvJytwYXRoKyc/b2F1dGhfdG9rZW49JytAdG9rZW4rJyZxPScrc2VhcmNoXG4gICAgICBTQy5nZXQocGF0aCwgY2FsbGJhY2spXG5cblxuY2xhc3MgU1BBQ0UuU2VhcmNoRW5naW5lXG4gIFNDOiBudWxsXG4gIGp1a2Vib3g6IG51bGxcblxuICAjIEhUTUxcbiAgaW5wdXQ6ICAgICAgICAgbnVsbFxuICBsaXN0OiAgICAgICAgICBudWxsXG4gIGxpc3RDb250YWluZXI6IG51bGxcbiAgZWw6ICAgICAgICAgICAgbnVsbFxuICBsaW5lSGVpZ2h0OiAgICAwXG4gIHJlc3VsdHNIZWlnaHQ6IDBcbiAgcmVzdWx0czogICAgICAgbnVsbFxuICBmb2N1c2VkOiAgICAgICBudWxsXG5cbiAgc2Nyb2xsUG9zOiAgICAgMFxuXG4gIEBzdGF0ZTogIG51bGxcblxuXG4gIGNvbnN0cnVjdG9yOiAoanVrZWJveCktPlxuICAgIEBqdWtlYm94ICAgICAgID0ganVrZWJveFxuICAgIEBTQyAgICAgICAgICAgID0gU1BBQ0UuU0NcblxuICAgIEBlbCAgICAgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCcpXG4gICAgQGlucHV0ICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoIGZvcm0gaW5wdXQnKVxuICAgIEBsaXN0ICAgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCAubGlzdCcpXG4gICAgQGxpc3RDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoIHVsJylcblxuICAgIEBzZXRTdGF0ZShFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLkNMT1NFRClcbiAgICBAX2V2ZW50cygpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoIGZvcm0nKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBAX2VKdWtlYm94SXNTZWFyY2hpbmcpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBAX2VLZXlwcmVzcylcblxuICBfZUp1a2Vib3hJc1NlYXJjaGluZzogKGUpPT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBAc2VhcmNoKEBpbnB1dC52YWx1ZSkgaWYgQGlucHV0LnZhbHVlLmxlbmd0aCA+IDBcblxuICBfZUtleXByZXNzOiAoZSk9PlxuICAgIHN3aXRjaChlLmtleUNvZGUpXG4gICAgICB3aGVuIEVOVU0uS2V5Ym9hcmQuRU5URVJcbiAgICAgICAgaWYgQGlucHV0LnZhbHVlLmxlbmd0aCA9PSAwXG4gICAgICAgICAgaWYgQHN0YXRlID09IEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEXG4gICAgICAgICAgICBAc2V0U3RhdGUoRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5PUEVORUQpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSCBhbmQgQGZvY3VzZWRcbiAgICAgICAgICBAc2V0U3RhdGUoRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5UUkFDS19TRUxFQ1RFRClcbiAgICAgICAgZWxzZSBpZiBAc3RhdGUgPT0gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5UUkFDS19TRUxFQ1RFRFxuICAgICAgICAgIEBhZGQoKVxuXG4gICAgICB3aGVuIEVOVU0uS2V5Ym9hcmQuVVBcbiAgICAgICAgQHVwKCkgaWYgQHN0YXRlID09IEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIXG5cbiAgICAgIHdoZW4gRU5VTS5LZXlib2FyZC5ET1dOXG4gICAgICAgIEBkb3duKCkgaWYgQHN0YXRlID09IEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIXG5cbiAgICAgIHdoZW4gRU5VTS5LZXlib2FyZC5FU0MsIEVOVU0uS2V5Ym9hcmQuREVMRVRFXG4gICAgICAgIGlmIEBzdGF0ZSA9PSBFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSFxuICAgICAgICAgIEBzZXRTdGF0ZShFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLk9QRU5FRClcbiAgICAgICAgZWxzZSBpZiBAc3RhdGUgPT0gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5UUkFDS19TRUxFQ1RFRFxuICAgICAgICAgIEBzZXRTdGF0ZShFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBzZXRTdGF0ZShFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLkNMT1NFRClcblxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICBzZXRTdGF0ZTogKHN0YXRlKS0+XG4gICAgQHN0YXRlID0gc3RhdGVcbiAgICBzd2l0Y2ggQHN0YXRlXG4gICAgICB3aGVuIEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEXG4gICAgICAgIEBlbC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgICAgICBAZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VhcmNoX29wZW4nKVxuXG4gICAgICAgIEBpbnB1dC52YWx1ZSAgICA9ICcnXG4gICAgICAgIEBpbnB1dC5kaXNhYmxlZCA9IGZhbHNlXG4gICAgICAgIEBpbnB1dC5mb2N1cygpXG5cbiAgICAgICAgQHJlc2V0KClcbiAgICAgIHdoZW4gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRURcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICB3aGVuIEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIXG4gICAgICAgIEBlbC5jbGFzc0xpc3QuYWRkKCdzZWFyY2hfb3BlbicpXG5cbiAgICAgICAgQGlucHV0LmRpc2FibGVkID0gdHJ1ZVxuICAgICAgICBAaW5wdXQuYmx1cigpXG5cbiAgICAgICAgQGxpbmVIZWlnaHQgICAgPSBAbGlzdENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdsaScpLm9mZnNldEhlaWdodFxuICAgICAgICBAcmVzdWx0c0hlaWdodCA9IEBsaW5lSGVpZ2h0ICogKEBsaXN0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykubGVuZ3RoLTEpXG5cbiAgICAgICAgQGZvY3VzZWQuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKSBpZiBAZm9jdXNlZFxuICAgICAgICBAZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXRlbV9zZWxlY3RlZCcpXG4gICAgICB3aGVuIEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuVFJBQ0tfU0VMRUNURURcbiAgICAgICAgQGZvY3VzZWQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgICBAZWwuY2xhc3NMaXN0LmFkZCgnaXRlbV9zZWxlY3RlZCcpXG5cbiAgdXA6IC0+XG4gICAgbmV4dCA9IEBzY3JvbGxQb3MgKyBAbGluZUhlaWdodFxuICAgIGlmIG5leHQgPD0gMFxuICAgICAgQHNjcm9sbFBvcyA9IG5leHRcbiAgICAgIEBmb2N1cygpXG5cbiAgZG93bjogLT5cbiAgICBuZXh0ID0gQHNjcm9sbFBvcyAtIEBsaW5lSGVpZ2h0XG4gICAgaWYgTWF0aC5hYnMobmV4dCkgPD0gQHJlc3VsdHNIZWlnaHRcbiAgICAgIEBzY3JvbGxQb3MgPSBuZXh0XG4gICAgICBAZm9jdXMoKVxuXG4gIGZvY3VzOiA9PlxuICAgIGlmIEBsaXN0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykubGVuZ3RoID4gMVxuICAgICAgJChbQGxpc3RDb250YWluZXIsIEBpbnB1dF0pLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAnK0BzY3JvbGxQb3MrJ3B4KScpXG4gICAgICBwb3MgPSAoQHNjcm9sbFBvcyotMSkgLyAoQHJlc3VsdHNIZWlnaHQgLyAoQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGgtMSkpXG4gICAgICBwb3MgPSBNYXRoLmZsb29yKHBvcylcbiAgICAgIGVsbSA9IEBlbC5xdWVyeVNlbGVjdG9yKCdsaTpudGgtY2hpbGQoJysocG9zKzEpKycpJylcblxuICAgICAgaWYgZWxtLmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpXG4gICAgICAgIEBmb2N1c2VkLmNsYXNzTGlzdC5yZW1vdmUoJ2ZvY3VzZWQnKSBpZiBAZm9jdXNlZFxuICAgICAgICBAZm9jdXNlZCA9IGVsbVxuICAgICAgICBAZm9jdXNlZC5jbGFzc0xpc3QuYWRkKCdmb2N1c2VkJylcbiAgICAgIGVsc2VcbiAgICAgICAgQGZvY3VzZWQgPSBudWxsXG4gICAgZWxzZVxuICAgICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEKVxuICAgICAgIyAkKFtAbGlzdENvbnRhaW5lciwgQGlucHV0XSkuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDApJylcblxuICByZXNldDogLT5cbiAgICBAZm9jdXNlZCAgID0gbnVsbFxuICAgIEBzY3JvbGxQb3MgPSAwXG4gICAgJChbQGxpc3RDb250YWluZXIsIEBpbnB1dF0pLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAnK0BzY3JvbGxQb3MrJ3B4KScpXG4gICAgQGxpc3RDb250YWluZXIuaW5uZXJIVE1MID0gJydcblxuICBhZGQ6IC0+XG4gICAgaW5kZXggPSBAZm9jdXNlZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKVxuICAgIHRyYWNrID0gQHJlc3VsdHNbaW5kZXhdXG4gICAgQGp1a2Vib3guYWRkKHRyYWNrKSBpZiB0cmFja1xuXG4gICAgQGZvY3VzZWQuY2xhc3NMaXN0LmFkZCgnYWRkZWQnKVxuICAgICQoQGZvY3VzZWQpLmNzcyh7XG4gICAgICAndHJhbnNmb3JtJzogJ3NjYWxlKC43NSkgdHJhbnNsYXRlWCgnK3dpbmRvdy5pbm5lcldpZHRoKydweCknXG4gICAgfSlcblxuICAgIHNldFRpbWVvdXQoPT5cbiAgICAgIEBmb2N1c2VkLnJlbW92ZSgpXG4gICAgICBAc2V0U3RhdGUoRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0gpXG4gICAgICBAdXAoKSBpZiBAZm9jdXNlZC5uZXh0U2libGluZ1xuICAgICAgQGZvY3VzKClcbiAgICAsIDUwMClcblxuICBzZWFyY2g6ICh2YWx1ZSktPlxuICAgIHBhdGggPSB2YWx1ZS5zcGxpdCgvXFxzLylbMF1cbiAgICBpZiAvXih0cmFja3x0cmFja3N8cGxheWxpc3R8cGxheWxpc3RzfHNldHxzZXRzfHVzZXJ8dXNlcnMpJC8udGVzdChwYXRoKVxuICAgICAgbGFzdENoYXIgPSBwYXRoLmNoYXJBdChwYXRoLmxlbmd0aC0xKVxuICAgICAgdmFsdWUgICAgPSB2YWx1ZS5yZXBsYWNlKHBhdGgrJyAnLCAnJylcbiAgICAgIHBhdGggICAgICs9ICdzJyBpZiBsYXN0Q2hhciAhPSAncydcbiAgICAgIHBhdGggICAgID0gJ3BsYXlsaXN0cycgaWYgL3NldHMvLnRlc3QocGF0aClcbiAgICBlbHNlXG4gICAgICBwYXRoICAgICA9ICd0cmFja3MnXG5cbiAgICBzdHJpbmcgPSAnJydcbiAgICAgIFtcbiAgICAgICAge1wia2luZFwiOlwidHJhY2tcIixcImlkXCI6NjMyNTY5MDYsXCJjcmVhdGVkX2F0XCI6XCIyMDEyLzEwLzEzIDEwOjQ3OjE2ICswMDAwXCIsXCJ1c2VyX2lkXCI6Nzg4MjA1LFwiZHVyYXRpb25cIjoyMzc4NDAsXCJjb21tZW50YWJsZVwiOnRydWUsXCJzdGF0ZVwiOlwiZmluaXNoZWRcIixcIm9yaWdpbmFsX2NvbnRlbnRfc2l6ZVwiOjk1NDMxNjgsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzEyLzIyIDIxOjAxOjE3ICswMDAwXCIsXCJzaGFyaW5nXCI6XCJwdWJsaWNcIixcInRhZ19saXN0XCI6XCJcIixcInBlcm1hbGlua1wiOlwiamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJzdHJlYW1hYmxlXCI6dHJ1ZSxcImVtYmVkZGFibGVfYnlcIjpcImFsbFwiLFwiZG93bmxvYWRhYmxlXCI6dHJ1ZSxcInB1cmNoYXNlX3VybFwiOlwiaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfaWRcIjpudWxsLFwicHVyY2hhc2VfdGl0bGVcIjpcIkFsdGVybmF0ZSBWZXJzaW9uIERMXCIsXCJnZW5yZVwiOlwiUG9wbG9ja2luIE11c2ljXCIsXCJ0aXRsZVwiOlwiSmFuZXQgSmFja3NvbiAtIElmIChLYXl0cmFuYWRhIFJlbWl4KVwiLFwiZGVzY3JpcHRpb25cIjpcIkFsdGVybmF0ZSBWZXJzaW9uLCBmb3IgREpzLCB3ZWxsLCB0aGF0cyB0aGUgdmVyc2lvbiBpIHVzZSBmb3IgbXkgZGogc2V0czsgaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfbmFtZVwiOlwiXCIsXCJyZWxlYXNlXCI6XCJcIixcInRyYWNrX3R5cGVcIjpcInJlbWl4XCIsXCJrZXlfc2lnbmF0dXJlXCI6XCJcIixcImlzcmNcIjpcIlwiLFwidmlkZW9fdXJsXCI6bnVsbCxcImJwbVwiOm51bGwsXCJyZWxlYXNlX3llYXJcIjpudWxsLFwicmVsZWFzZV9tb250aFwiOm51bGwsXCJyZWxlYXNlX2RheVwiOm51bGwsXCJvcmlnaW5hbF9mb3JtYXRcIjpcIm1wM1wiLFwibGljZW5zZVwiOlwiYWxsLXJpZ2h0cy1yZXNlcnZlZFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDZcIixcInVzZXJcIjp7XCJpZFwiOjc4ODIwNSxcImtpbmRcIjpcInVzZXJcIixcInBlcm1hbGlua1wiOlwia2F5dHJhbmFkYVwiLFwidXNlcm5hbWVcIjpcIktBWVRSQU5BREFcIixcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTEvMDcgMDQ6MTE6MzYgKzAwMDBcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdXNlcnMvNzg4MjA1XCIsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYVwiLFwiYXZhdGFyX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2F2YXRhcnMtMDAwMDc0ODAzNjk0LXFpYnh0NC1sYXJnZS5qcGdcIn0sXCJ1c2VyX3BsYXliYWNrX2NvdW50XCI6MSxcInVzZXJfZmF2b3JpdGVcIjp0cnVlLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGEvamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJhcnR3b3JrX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2FydHdvcmtzLTAwMDAzMjA5NDU5Ny01NnRzN24tbGFyZ2UuanBnXCIsXCJ3YXZlZm9ybV91cmxcIjpcImh0dHBzOi8vdzEuc25kY2RuLmNvbS9hcVJHaTREbWJDV3pfbS5wbmdcIixcInN0cmVhbV91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9zdHJlYW1cIixcImRvd25sb2FkX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2Rvd25sb2FkXCIsXCJwbGF5YmFja19jb3VudFwiOjMzMzEwMzMsXCJkb3dubG9hZF9jb3VudFwiOjk2MTEyLFwiZmF2b3JpdGluZ3NfY291bnRcIjo2NjY1MyxcImNvbW1lbnRfY291bnRcIjoxNTk0LFwiYXR0YWNobWVudHNfdXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvYXR0YWNobWVudHNcIixcInBvbGljeVwiOlwiQUxMT1dcIn0sXG4gICAgICAgIHtcImtpbmRcIjpcInRyYWNrXCIsXCJpZFwiOjYzMjU2OTA2LFwiY3JlYXRlZF9hdFwiOlwiMjAxMi8xMC8xMyAxMDo0NzoxNiArMDAwMFwiLFwidXNlcl9pZFwiOjc4ODIwNSxcImR1cmF0aW9uXCI6MjM3ODQwLFwiY29tbWVudGFibGVcIjp0cnVlLFwic3RhdGVcIjpcImZpbmlzaGVkXCIsXCJvcmlnaW5hbF9jb250ZW50X3NpemVcIjo5NTQzMTY4LFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMi8yMiAyMTowMToxNyArMDAwMFwiLFwic2hhcmluZ1wiOlwicHVibGljXCIsXCJ0YWdfbGlzdFwiOlwiXCIsXCJwZXJtYWxpbmtcIjpcImphbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwic3RyZWFtYWJsZVwiOnRydWUsXCJlbWJlZGRhYmxlX2J5XCI6XCJhbGxcIixcImRvd25sb2FkYWJsZVwiOnRydWUsXCJwdXJjaGFzZV91cmxcIjpcImh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX2lkXCI6bnVsbCxcInB1cmNoYXNlX3RpdGxlXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiBETFwiLFwiZ2VucmVcIjpcIlBvcGxvY2tpbiBNdXNpY1wiLFwidGl0bGVcIjpcIkphbmV0IEphY2tzb24gLSBJZiAoS2F5dHJhbmFkYSBSZW1peClcIixcImRlc2NyaXB0aW9uXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiwgZm9yIERKcywgd2VsbCwgdGhhdHMgdGhlIHZlcnNpb24gaSB1c2UgZm9yIG15IGRqIHNldHM7IGh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX25hbWVcIjpcIlwiLFwicmVsZWFzZVwiOlwiXCIsXCJ0cmFja190eXBlXCI6XCJyZW1peFwiLFwia2V5X3NpZ25hdHVyZVwiOlwiXCIsXCJpc3JjXCI6XCJcIixcInZpZGVvX3VybFwiOm51bGwsXCJicG1cIjpudWxsLFwicmVsZWFzZV95ZWFyXCI6bnVsbCxcInJlbGVhc2VfbW9udGhcIjpudWxsLFwicmVsZWFzZV9kYXlcIjpudWxsLFwib3JpZ2luYWxfZm9ybWF0XCI6XCJtcDNcIixcImxpY2Vuc2VcIjpcImFsbC1yaWdodHMtcmVzZXJ2ZWRcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2XCIsXCJ1c2VyXCI6e1wiaWRcIjo3ODgyMDUsXCJraW5kXCI6XCJ1c2VyXCIsXCJwZXJtYWxpbmtcIjpcImtheXRyYW5hZGFcIixcInVzZXJuYW1lXCI6XCJLQVlUUkFOQURBXCIsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzExLzA3IDA0OjExOjM2ICswMDAwXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3VzZXJzLzc4ODIwNVwiLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGFcIixcImF2YXRhcl91cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hdmF0YXJzLTAwMDA3NDgwMzY5NC1xaWJ4dDQtbGFyZ2UuanBnXCJ9LFwidXNlcl9wbGF5YmFja19jb3VudFwiOjEsXCJ1c2VyX2Zhdm9yaXRlXCI6dHJ1ZSxcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhL2phbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwiYXJ0d29ya191cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hcnR3b3Jrcy0wMDAwMzIwOTQ1OTctNTZ0czduLWxhcmdlLmpwZ1wiLFwid2F2ZWZvcm1fdXJsXCI6XCJodHRwczovL3cxLnNuZGNkbi5jb20vYXFSR2k0RG1iQ1d6X20ucG5nXCIsXCJzdHJlYW1fdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvc3RyZWFtXCIsXCJkb3dubG9hZF91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9kb3dubG9hZFwiLFwicGxheWJhY2tfY291bnRcIjozMzMxMDMzLFwiZG93bmxvYWRfY291bnRcIjo5NjExMixcImZhdm9yaXRpbmdzX2NvdW50XCI6NjY2NTMsXCJjb21tZW50X2NvdW50XCI6MTU5NCxcImF0dGFjaG1lbnRzX3VyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2F0dGFjaG1lbnRzXCIsXCJwb2xpY3lcIjpcIkFMTE9XXCJ9LFxuICAgICAgICB7XCJraW5kXCI6XCJ0cmFja1wiLFwiaWRcIjo2MzI1NjkwNixcImNyZWF0ZWRfYXRcIjpcIjIwMTIvMTAvMTMgMTA6NDc6MTYgKzAwMDBcIixcInVzZXJfaWRcIjo3ODgyMDUsXCJkdXJhdGlvblwiOjIzNzg0MCxcImNvbW1lbnRhYmxlXCI6dHJ1ZSxcInN0YXRlXCI6XCJmaW5pc2hlZFwiLFwib3JpZ2luYWxfY29udGVudF9zaXplXCI6OTU0MzE2OCxcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTIvMjIgMjE6MDE6MTcgKzAwMDBcIixcInNoYXJpbmdcIjpcInB1YmxpY1wiLFwidGFnX2xpc3RcIjpcIlwiLFwicGVybWFsaW5rXCI6XCJqYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcInN0cmVhbWFibGVcIjp0cnVlLFwiZW1iZWRkYWJsZV9ieVwiOlwiYWxsXCIsXCJkb3dubG9hZGFibGVcIjp0cnVlLFwicHVyY2hhc2VfdXJsXCI6XCJodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9pZFwiOm51bGwsXCJwdXJjaGFzZV90aXRsZVwiOlwiQWx0ZXJuYXRlIFZlcnNpb24gRExcIixcImdlbnJlXCI6XCJQb3Bsb2NraW4gTXVzaWNcIixcInRpdGxlXCI6XCJKYW5ldCBKYWNrc29uIC0gSWYgKEtheXRyYW5hZGEgUmVtaXgpXCIsXCJkZXNjcmlwdGlvblwiOlwiQWx0ZXJuYXRlIFZlcnNpb24sIGZvciBESnMsIHdlbGwsIHRoYXRzIHRoZSB2ZXJzaW9uIGkgdXNlIGZvciBteSBkaiBzZXRzOyBodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9uYW1lXCI6XCJcIixcInJlbGVhc2VcIjpcIlwiLFwidHJhY2tfdHlwZVwiOlwicmVtaXhcIixcImtleV9zaWduYXR1cmVcIjpcIlwiLFwiaXNyY1wiOlwiXCIsXCJ2aWRlb191cmxcIjpudWxsLFwiYnBtXCI6bnVsbCxcInJlbGVhc2VfeWVhclwiOm51bGwsXCJyZWxlYXNlX21vbnRoXCI6bnVsbCxcInJlbGVhc2VfZGF5XCI6bnVsbCxcIm9yaWdpbmFsX2Zvcm1hdFwiOlwibXAzXCIsXCJsaWNlbnNlXCI6XCJhbGwtcmlnaHRzLXJlc2VydmVkXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNlwiLFwidXNlclwiOntcImlkXCI6Nzg4MjA1LFwia2luZFwiOlwidXNlclwiLFwicGVybWFsaW5rXCI6XCJrYXl0cmFuYWRhXCIsXCJ1c2VybmFtZVwiOlwiS0FZVFJBTkFEQVwiLFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMS8wNyAwNDoxMTozNiArMDAwMFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS91c2Vycy83ODgyMDVcIixcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhXCIsXCJhdmF0YXJfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAwNzQ4MDM2OTQtcWlieHQ0LWxhcmdlLmpwZ1wifSxcInVzZXJfcGxheWJhY2tfY291bnRcIjoxLFwidXNlcl9mYXZvcml0ZVwiOnRydWUsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYS9qYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcImFydHdvcmtfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtMDAwMDMyMDk0NTk3LTU2dHM3bi1sYXJnZS5qcGdcIixcIndhdmVmb3JtX3VybFwiOlwiaHR0cHM6Ly93MS5zbmRjZG4uY29tL2FxUkdpNERtYkNXel9tLnBuZ1wiLFwic3RyZWFtX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L3N0cmVhbVwiLFwiZG93bmxvYWRfdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvZG93bmxvYWRcIixcInBsYXliYWNrX2NvdW50XCI6MzMzMTAzMyxcImRvd25sb2FkX2NvdW50XCI6OTYxMTIsXCJmYXZvcml0aW5nc19jb3VudFwiOjY2NjUzLFwiY29tbWVudF9jb3VudFwiOjE1OTQsXCJhdHRhY2htZW50c191cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9hdHRhY2htZW50c1wiLFwicG9saWN5XCI6XCJBTExPV1wifSxcbiAgICAgICAge1wia2luZFwiOlwidHJhY2tcIixcImlkXCI6NjMyNTY5MDYsXCJjcmVhdGVkX2F0XCI6XCIyMDEyLzEwLzEzIDEwOjQ3OjE2ICswMDAwXCIsXCJ1c2VyX2lkXCI6Nzg4MjA1LFwiZHVyYXRpb25cIjoyMzc4NDAsXCJjb21tZW50YWJsZVwiOnRydWUsXCJzdGF0ZVwiOlwiZmluaXNoZWRcIixcIm9yaWdpbmFsX2NvbnRlbnRfc2l6ZVwiOjk1NDMxNjgsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzEyLzIyIDIxOjAxOjE3ICswMDAwXCIsXCJzaGFyaW5nXCI6XCJwdWJsaWNcIixcInRhZ19saXN0XCI6XCJcIixcInBlcm1hbGlua1wiOlwiamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJzdHJlYW1hYmxlXCI6dHJ1ZSxcImVtYmVkZGFibGVfYnlcIjpcImFsbFwiLFwiZG93bmxvYWRhYmxlXCI6dHJ1ZSxcInB1cmNoYXNlX3VybFwiOlwiaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfaWRcIjpudWxsLFwicHVyY2hhc2VfdGl0bGVcIjpcIkFsdGVybmF0ZSBWZXJzaW9uIERMXCIsXCJnZW5yZVwiOlwiUG9wbG9ja2luIE11c2ljXCIsXCJ0aXRsZVwiOlwiSmFuZXQgSmFja3NvbiAtIElmIChLYXl0cmFuYWRhIFJlbWl4KVwiLFwiZGVzY3JpcHRpb25cIjpcIkFsdGVybmF0ZSBWZXJzaW9uLCBmb3IgREpzLCB3ZWxsLCB0aGF0cyB0aGUgdmVyc2lvbiBpIHVzZSBmb3IgbXkgZGogc2V0czsgaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfbmFtZVwiOlwiXCIsXCJyZWxlYXNlXCI6XCJcIixcInRyYWNrX3R5cGVcIjpcInJlbWl4XCIsXCJrZXlfc2lnbmF0dXJlXCI6XCJcIixcImlzcmNcIjpcIlwiLFwidmlkZW9fdXJsXCI6bnVsbCxcImJwbVwiOm51bGwsXCJyZWxlYXNlX3llYXJcIjpudWxsLFwicmVsZWFzZV9tb250aFwiOm51bGwsXCJyZWxlYXNlX2RheVwiOm51bGwsXCJvcmlnaW5hbF9mb3JtYXRcIjpcIm1wM1wiLFwibGljZW5zZVwiOlwiYWxsLXJpZ2h0cy1yZXNlcnZlZFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDZcIixcInVzZXJcIjp7XCJpZFwiOjc4ODIwNSxcImtpbmRcIjpcInVzZXJcIixcInBlcm1hbGlua1wiOlwia2F5dHJhbmFkYVwiLFwidXNlcm5hbWVcIjpcIktBWVRSQU5BREFcIixcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTEvMDcgMDQ6MTE6MzYgKzAwMDBcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdXNlcnMvNzg4MjA1XCIsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYVwiLFwiYXZhdGFyX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2F2YXRhcnMtMDAwMDc0ODAzNjk0LXFpYnh0NC1sYXJnZS5qcGdcIn0sXCJ1c2VyX3BsYXliYWNrX2NvdW50XCI6MSxcInVzZXJfZmF2b3JpdGVcIjp0cnVlLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGEvamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJhcnR3b3JrX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2FydHdvcmtzLTAwMDAzMjA5NDU5Ny01NnRzN24tbGFyZ2UuanBnXCIsXCJ3YXZlZm9ybV91cmxcIjpcImh0dHBzOi8vdzEuc25kY2RuLmNvbS9hcVJHaTREbWJDV3pfbS5wbmdcIixcInN0cmVhbV91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9zdHJlYW1cIixcImRvd25sb2FkX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2Rvd25sb2FkXCIsXCJwbGF5YmFja19jb3VudFwiOjMzMzEwMzMsXCJkb3dubG9hZF9jb3VudFwiOjk2MTEyLFwiZmF2b3JpdGluZ3NfY291bnRcIjo2NjY1MyxcImNvbW1lbnRfY291bnRcIjoxNTk0LFwiYXR0YWNobWVudHNfdXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvYXR0YWNobWVudHNcIixcInBvbGljeVwiOlwiQUxMT1dcIn1cbiAgICAgIF1cbiAgICAnJydcblxuICAgIHJlc3VsdHMgPSBKU09OLnBhcnNlKHN0cmluZylcblxuICAgIEBpbnB1dC52YWx1ZSA9ICdMb29raW5nIGZvciBcIicrdmFsdWUrJ1wiJ1xuICAgIEBTQy5zZWFyY2godmFsdWUsIHBhdGgsIChyZXN1bHRzKT0+XG4gICAgICBjb25zb2xlLmxvZyByZXN1bHRzXG4gICAgICBpZiByZXN1bHRzLmxlbmd0aCA9PSAwXG4gICAgICAgIEBpbnB1dC52YWx1ZSA9ICdcIicrdmFsdWUrJ1wiIGhhcyBubyByZXN1bHQnXG4gICAgICAgIHJldHVyblxuICAgICAgZWxzZVxuICAgICAgICBAaW5wdXQudmFsdWUgPSAnUmVzdWx0cyBmb3IgXCInK3ZhbHVlKydcIidcblxuICAgICAgQHJlc3VsdHMgICAgID0gW11cbiAgICAgIEBsaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpXG4gICAgICBmb3IgdHJhY2ssIGkgaW4gcmVzdWx0c1xuICAgICAgICBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICAgICAgbGkuc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JywgaSlcblxuICAgICAgICBhcnR3b3JrX3VybCA9IHRyYWNrLmFydHdvcmtfdXJsXG4gICAgICAgIGFydHdvcmtfdXJsID0gJ2ltYWdlcy9ub19hcnR3b3JrLmdpZicgdW5sZXNzIGFydHdvcmtfdXJsXG4gICAgICAgIGxpLmlubmVySFRNTCA9IFwiXCJcIlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aW1nIHNyYz1cIiN7YXJ0d29ya191cmx9XCIgYWx0PVwiXCIgb25lcnJvcj1cInRoaXMuc3JjPSdpbWFnZXMvbm9fYXJ0d29yay5naWYnXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8cD4je3RyYWNrLnRpdGxlfTwvcD5cbiAgICAgICAgICAgICAgPHA+I3t0cmFjay51c2VyLnVzZXJuYW1lLnRvTG93ZXJDYXNlKCl9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIFwiXCJcIlxuICAgICAgICBAcmVzdWx0cy5wdXNoKHRyYWNrKVxuICAgICAgICBAbGlzdENvbnRhaW5lci5hcHBlbmRDaGlsZChsaSlcbiAgICAgIEBzZXRTdGF0ZShFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSClcbiAgICApXG5cblxuY2xhc3MgU1BBQ0UuSnVrZWJveFxuXG4gICMjIERhdGEgb2JqZWN0c1xuICBTQzogICAgICAgICAgIG51bGxcbiAgY3VycmVudDogICAgICBudWxsXG4gIGFpcnBvcnQ6ICAgICAgbnVsbFxuICBwbGF5bGlzdDogICAgIG51bGxcbiAgc2VhcmNoRW5naW5lOiBudWxsXG4gIHdhdmVmb3JtRGF0YTogbnVsbFxuXG4gICMjIFRIUkVFSlMgT2JqZWN0c1xuICBzY2VuZTogICAgICAgbnVsbFxuICBlcXVhbGl6ZXI6ICAgbnVsbFxuICBncm91cDogICAgICAgbnVsbFxuXG4gICMjIFNUQVRFU1xuICBzdGF0ZTogICAgICAgIG51bGxcbiAgYWlycG9ydFN0YXRlOiBudWxsXG5cbiAgIyMgT1RIRVJTXG4gIGRlbGF5OiAyMDAwXG4gIHRpbWU6IDBcblxuICBjb25zdHJ1Y3RvcjogKHNjZW5lKS0+XG4gICAgQHNjZW5lID0gc2NlbmVcbiAgICBAZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKVxuICAgIEBzY2VuZS5hZGQoQGdyb3VwKVxuXG4gICAgQHdhdmVmb3JtRGF0YSA9XG4gICAgICBtb25vOiBudWxsXG4gICAgICBzdGVyZW86IG51bGxcbiAgICBAc2V0QWlycG9ydFN0YXRlKEVOVU0uQWlycG9ydFN0YXRlLklETEUpXG5cbiAgICAjIEluaXRpYWxpemUgdGhlIGVxdWFsaXplclxuICAgIEBlcWx6ciA9IG5ldyBTUEFDRS5FcXVhbGl6ZXIoe1xuICAgICAgbWluTGVuZ3RoOiAwXG4gICAgICBtYXhMZW5ndGg6IDIwMFxuICAgICAgcmFkaXVzOiAzMDBcbiAgICAgIGNvbG9yOiAweEZGRkZGRlxuICAgICAgYWJzb2x1dGU6IGZhbHNlXG4gICAgICBsaW5lRm9yY2VEb3duOiAuNVxuICAgICAgbGluZUZvcmNlVXA6IDFcbiAgICB9KVxuICAgIEBncm91cC5hZGQoQGVxbHpyKVxuXG4gICAgQGVxdWFsaXplciA9IG5ldyBTUEFDRS5FcXVhbGl6ZXIoe1xuICAgICAgbWluTGVuZ3RoOiAwXG4gICAgICBtYXhMZW5ndGg6IDUwXG4gICAgICByYWRpdXM6IDMwMFxuICAgICAgY29sb3I6IDB4RDFEMUQxXG4gICAgICBhYnNvbHV0ZTogZmFsc2VcbiAgICAgIGxpbmVGb3JjZURvd246IC41XG4gICAgICBsaW5lRm9yY2VVcDogMVxuICAgIH0pXG4gICAgQGdyb3VwLmFkZChAZXF1YWxpemVyKVxuXG4gICAgQFNDICAgICAgICAgICA9IFNQQUNFLlNDXG4gICAgQGFpcnBvcnQgICAgICA9IFtdXG4gICAgQHBsYXlsaXN0ICAgICA9IFtdXG5cbiAgICBAX2V2ZW50cygpXG4gICAgQHNldFN0YXRlKEVOVU0uSnVrZWJveFN0YXRlLklTX1NUT1BQRUQpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX1BMQVlJTkcudHlwZSwgQF9lVHJhY2tJc1BsYXlpbmcpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5UcmFjay5JU19TVE9QUEVELnR5cGUsIEBfZVRyYWNrSXNTdG9wcGVkKVxuXG4gIF9lVHJhY2tJc1BsYXlpbmc6IChlKT0+XG4gICAgQHNldFN0YXRlKEVOVU0uSnVrZWJveFN0YXRlLklTX1BMQVlJTkcpXG5cbiAgX2VUcmFja0lzU3RvcHBlZDogKGUpPT5cbiAgICBpZiBAcGxheWxpc3QubGVuZ3RoID4gMFxuICAgICAgQHNldFN0YXRlKEVOVU0uSnVrZWJveFN0YXRlLlRSQUNLX1NUT1BQRUQpXG4gICAgZWxzZVxuICAgICAgQHNldFN0YXRlKEVOVU0uSnVrZWJveFN0YXRlLklTX1NUT1BQRUQpXG5cbiAgX2NyZWF0ZVRyYWNrOiAoZGF0YSktPlxuICAgICMgc3BhY2VzaGlwICAgICAgID0gbmV3IFNQQUNFLlNwYWNlc2hpcChAZXF1YWxpemVyLmNlbnRlciwgQGVxdWFsaXplci5yYWRpdXMpXG4gICAgdHJhY2sgICAgICAgICAgID0gbmV3IFNQQUNFLlRyYWNrKGRhdGEpXG4gICAgIyB0cmFjay5zcGFjZXNoaXAgPSBzcGFjZXNoaXBcbiAgICB0cmFjay5wZW5kaW5nRHVyYXRpb24gPSBAX2NhbGNQZW5kaW5nKEBwbGF5bGlzdC5sZW5ndGgtMSlcblxuICAgICMgQGdyb3VwLmFkZChzcGFjZXNoaXApXG5cbiAgICBAcGxheWxpc3QucHVzaCh0cmFjaylcbiAgICAjIEBhaXJwb3J0LnB1c2goc3BhY2VzaGlwKVxuXG4gICAgSEVMUEVSLnRyaWdnZXIoRVZFTlQuSnVrZWJveC5UUkFDS19BRERFRCwgeyB0cmFjazogdHJhY2sgfSlcbiAgICBTUEFDRS5MT0coJ1NvdW5kIGFkZGVkOiAnICsgdHJhY2suZGF0YS50aXRsZSlcblxuICBfY2FsY1BlbmRpbmc6IChwb3NpdGlvbiktPlxuICAgIGR1cmF0aW9uID0gMFxuICAgIGZvciB0cmFjaywgaSBpbiBAcGxheWxpc3RcbiAgICAgIGR1cmF0aW9uICs9IHRyYWNrLmRhdGEuZHVyYXRpb25cbiAgICAgIGJyZWFrIGlmIGkgPT0gcG9zaXRpb25cbiAgICByZXR1cm4gZHVyYXRpb25cblxuICBwcmVkZWZpbmVkUGxheWxpc3Q6IC0+XG4gICAgbGlzdCA9IFtcbiAgICAgICMgJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vY2hvbmNoLTIvY291cnRlLWRhbnNlLW1hY2FicmUnXG4gICAgICAjICdodHRwczovL3NvdW5kY2xvdWQuY29tL2Nob25jaC0yL21vdWFpcydcbiAgICAgICMgJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vY2hvbmNoLTIvY2FjYWNvLTInXG4gICAgICAjICdodHRwczovL3NvdW5kY2xvdWQuY29tL2Nob25jaC0yL2R1b2RlbnVtJ1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9jaG9uY2gtMi9saXR0bGUtZ3JlZW4tbW9ua2V5J1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9odWh3aGF0YW5kd2hlcmUvc2V0cy9zdXByZW1lLWxhemluZXNzLXRoZS1jZWxlc3RpY3MnXG4gICAgICAjICdodHRwczovL3NvdW5kY2xvdWQuY29tL3Rha3Vnb3RiZWF0cy9zZXRzLzI1LW5pZ2h0cy1mb3ItbnVqYWJlcydcbiAgICAgICMgJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vdG9tbWlzY2gvc2V0cy90b20tbWlzY2gtc291bGVjdGlvbi13aGl0ZSdcbiAgICAgICMgJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vcHJvZmVzc29ya2xpcS9zZXRzL3RyYWNrbWFuaWEtdmFsbGV5LW9zdCdcbiAgICAgICMgJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vcHJvZmVzc29ya2xpcS9zZXRzL3RyYWNrbWFuaWEtc3RhZGl1bS1vc3QnXG4gICAgXVxuXG4gICAgbGlzdCA9IF9Db2ZmZWUuc2h1ZmZsZShsaXN0KVxuICAgIGZvciB1cmwsIGkgaW4gbGlzdFxuICAgICAgQGFkZChsaXN0W2ldKVxuXG4gICAgIyBzZXRUaW1lb3V0KD0+XG4gICAgIyAgIEBhZGQoJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vY2hvbmNoLTIvY2FjYWNvLTInKVxuICAgICMgLCA1MDAwKVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIHN3aXRjaChzdGF0ZSlcbiAgICAgIHdoZW4gRU5VTS5KdWtlYm94U3RhdGUuSVNfUExBWUlOR1xuICAgICAgICBAY3VycmVudC53aGlsZXBsYXlpbmdDYWxsYmFjayA9IEBfd2hpbGVwbGF5aW5nXG4gICAgICBlbHNlXG4gICAgICAgIGlmIEBjdXJyZW50XG4gICAgICAgICAgQGN1cnJlbnQuZGVzdHJ1Y3QoKVxuICAgICAgICBAY3VycmVudCA9IG51bGxcblxuICAgICAgICBpZiBAc3RhdGUgPT0gRU5VTS5KdWtlYm94U3RhdGUuSVNfU1RPUFBFRFxuICAgICAgICAgIGNvbnNvbGUubG9nICdTVE9QUEVEJ1xuICAgICAgICAgIEhFTFBFUi50cmlnZ2VyKEVWRU5ULkp1a2Vib3guSVNfU1RPUFBFRClcblxuICBzZXRBaXJwb3J0U3RhdGU6IChzdGF0ZSk9PlxuICAgIEBhaXJwb3J0U3RhdGUgPSBzdGF0ZVxuICAgIHN3aXRjaChzdGF0ZSlcbiAgICAgIHdoZW4gRU5VTS5BaXJwb3J0U3RhdGUuSURMRVxuICAgICAgICBTUEFDRS5MT0coJ1dhaXRpbmcgZm9yIG5ldyBzcGFjZXNoaXAnKVxuICAgICAgd2hlbiBFTlVNLkFpcnBvcnRTdGF0ZS5TRU5ESU5HXG4gICAgICAgIHNwYWNlc2hpcCA9IEBhaXJwb3J0LnNoaWZ0KClcbiAgICAgICAgc3BhY2VzaGlwLnNldFN0YXRlKFNwYWNlc2hpcFN0YXRlLkxBVU5DSEVEKVxuICAgICAgICBzZXRUaW1lb3V0KEBzZXRBaXJwb3J0U3RhdGUsIDYwICogMTAwMClcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldEFpcnBvcnRTdGF0ZShFTlVNLkFpcnBvcnRTdGF0ZS5JRExFKVxuXG4gIHVwZGF0ZTogKGRlbHRhKS0+XG4gICAgaWYgQGN1cnJlbnQgPT0gbnVsbFxuICAgICAgQHRpbWUgKz0gZGVsdGFcbiAgICBlbHNlXG4gICAgICBAdGltZSA9IDBcbiAgICAjIGZvciB0cmFjaywgaSBpbiBAcGxheWxpc3RcbiAgICAjICAgdHJhY2sudXBkYXRlKGRlbHRhKVxuICAgICMgQGN1cnJlbnQudXBkYXRlKGRlbHRhKSBpZiBAY3VycmVudFxuXG4gICAgaWYgQHBsYXlsaXN0Lmxlbmd0aCA+IDAgJiYgQHRpbWUgPiBAZGVsYXlcbiAgICAgIEBuZXh0KCkgaWYgQGN1cnJlbnQgPT0gbnVsbFxuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgSnVrZWJveCBwbGF5ZXIgbWV0aG9kcyAjXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGxpc3Q6IC0+XG4gICAgbGlzdCA9IFtdXG4gICAgZm9yIHRyYWNrIGluIEBwbGF5bGlzdFxuICAgICAgbGlzdC5wdXNoKHt0aXRsZTogdHJhY2suZGF0YS50aXRsZSwgcGVuZGluZ0R1cmF0aW9uOiB0cmFjay5wZW5kaW5nRHVyYXRpb259KVxuICAgIHJldHVybiBsaXN0XG5cbiAgYWRkOiAoc291bmRPclBsYXlsaXN0KS0+XG4gICAgQF9jcmVhdGVUcmFjayhzb3VuZE9yUGxheWxpc3QpXG4gICAgIyBAU0MuZ2V0U291bmRPclBsYXlsaXN0IHNvdW5kT3JQbGF5bGlzdCwgKG8sIGVycik9PlxuICAgICMgICBpZiBlcnJcbiAgICAjICAgICBfSC50cmlnZ2VyKFRSQUNLX09OX0FERF9FUlJPUiwge29iamVjdDogbywgZXJyb3I6IGVycn0pXG4gICAgIyAgICAgcmV0dXJuXG5cbiAgICAjICAgdHJhY2tzID0gbnVsbFxuICAgICMgICBpZiBvLmhhc093blByb3BlcnR5KCd0cmFja3MnKVxuICAgICMgICAgIHRyYWNrcyA9IF9Db2ZmZWUuc2h1ZmZsZShvLnRyYWNrcylcbiAgICAjICAgZWxzZVxuICAgICMgICAgIHRyYWNrcyA9IFtdXG4gICAgIyAgICAgdHJhY2tzLnB1c2gobylcblxuICAgICMgICBmb3IgZGF0YSBpbiB0cmFja3NcbiAgICAjICAgICBAX2NyZWF0ZVRyYWNrKGRhdGEpXG5cbiAgbmV4dDogKHRyYWNrKS0+XG4gICAgQGN1cnJlbnQuc3RvcCgpIGlmIEBjdXJyZW50XG4gICAgaWYgQHBsYXlsaXN0Lmxlbmd0aCA+IDBcbiAgICAgIEBjdXJyZW50ID0gQHBsYXlsaXN0LnNoaWZ0KClcbiAgICAgICMgQGN1cnJlbnQucmVtb3ZlU3BhY2VzaGlwKClcbiAgICAgIEBjdXJyZW50LnN0cmVhbSgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIF93aGlsZXBsYXlpbmc6ID0+XG4gICAgIyBjb25zb2xlLmxvZyAneW91cGknLCBAY3VycmVudC5zb3VuZFxuICAgIEB3YXZlZm9ybURhdGEgPSBAY3VycmVudC53YXZlZm9ybURhdGEgaWYgQGN1cnJlbnQjIGFuZCBAY3VycmVudC5zb3VuZFxuXG5cbmNsYXNzIFNQQUNFLlRyYWNrXG5cbiAgZGF0YTogICAgICAgICAgICAgICAgIG51bGxcbiAgc3BhY2VzaGlwOiAgICAgICAgICAgIG51bGxcbiAgc291bmQ6ICAgICAgICAgICAgICAgIG51bGxcblxuICB0aW1lOiAgICAgICAgICAgICAgICAgMFxuICBwZW5kaW5nRHVyYXRpb246ICAgICAgMFxuXG4gIGlzUGxheWluZzogICAgICAgICAgICBmYWxzZVxuICB3aGlsZXBsYXlpbmdDYWxsYmFjazogbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAoZGF0YSktPlxuICAgIEBkYXRhID0gZGF0YVxuICAgIEBTQyAgID0gU1BBQ0UuU0NcbiAgICBAX2V2ZW50cygpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX1BMQVlJTkcudHlwZSwgQF9lVHJhY2tJc1BsYXlpbmcpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5UcmFjay5JU19TVE9QUEVELnR5cGUsIEBfZVRyYWNrSXNTdG9wcGVkKVxuXG4gIF9lVHJhY2tJc1BsYXlpbmc6ID0+XG4gICAgQGlzUGxheWluZyA9IHRydWVcblxuICBfZVRyYWNrSXNTdG9wcGVkOiA9PlxuICAgIEBpc1BsYXlpbmcgPSBmYWxzZVxuXG4gIHN0cmVhbTogLT5cbiAgICB1cmwgID0gJ3Jlc291cmNlcy9zb3VuZHMvJytAZGF0YS51cmxcblxuICAgIHdpbmRvdy5XZWJBdWRpb0FQSSA9IHdpbmRvdy5XZWJBdWRpb0FQSSB8fCBuZXcgU1BBQ0UuV2ViQXVkaW9BUEkoKVxuXG4gICAgQGFwaSA9IFdlYkF1ZGlvQVBJXG4gICAgQGFwaS5vbnBsYXkgICAgICAgICA9IEBfb25wbGF5XG4gICAgQGFwaS5vbmF1ZGlvcHJvY2VzcyA9IEBfd2hpbGVwbGF5aW5nXG4gICAgQGFwaS5vbmVuZGVkICAgICAgICA9IEBfb25maW5pc2hcbiAgICBAYXBpLnNldFVybCh1cmwpXG5cbiAgcGxheTogLT5cbiAgICBAYXBpLnBsYXkoKVxuXG4gIHBhdXNlOiAtPlxuICAgIEBhcGkucGF1c2UoKVxuXG4gIHN0b3A6IC0+XG4gICAgQGFwaS5zdG9wKClcbiAgICBAX29uZmluaXNoKClcblxuICBkZXN0cnVjdDogLT5cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX1BMQVlJTkcudHlwZSwgQF9lVHJhY2tJc1BsYXlpbmcpXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFVkVOVC5UcmFjay5JU19TVE9QUEVELnR5cGUsIEBfZVRyYWNrSXNTdG9wcGVkKVxuICAgIEBhcGkuZGVzdHJveSgpXG5cbiAgX3N0YXJ0aW5nOiAoc291bmQpPT5cbiAgICBAc291bmQgPSBzb3VuZFxuICAgIFNQQUNFLkxPRygnTmV4dDogJyArIEBkYXRhLnRpdGxlKVxuXG4gIF9vbnBsYXk6ID0+XG4gICAgSEVMUEVSLnRyaWdnZXIoRVZFTlQuVHJhY2suSVNfUExBWUlORywgeyB0cmFjazogdGhpcyB9KVxuXG4gIF9vbmZpbmlzaDogPT5cbiAgICBIRUxQRVIudHJpZ2dlcihFVkVOVC5UcmFjay5JU19TVE9QUEVELCB7IHRyYWNrOiB0aGlzIH0pXG4gICAgQGFwaS5zdG9wKClcblxuICBkYXRhczogQXJyYXkoMjU2KVxuICBfd2hpbGVwbGF5aW5nOiAoZSk9PlxuICAgIGFuYWx5c2VyID0gQGFwaS5hbmFseXNlclxuICAgIGFycmF5ICAgID0gIG5ldyBGbG9hdDMyQXJyYXkoYW5hbHlzZXIuZmZ0U2l6ZSlcbiAgICBhbmFseXNlci5nZXRGbG9hdFRpbWVEb21haW5EYXRhKGFycmF5KVxuXG4gICAgZm9yIGkgaW4gWzAuLjI1NV1cbiAgICAgIEBkYXRhc1tpXSA9IGFycmF5W2ldXG5cbiAgICBAd2F2ZWZvcm1EYXRhID1cbiAgICAgIG1vbm86IEBkYXRhc1xuXG4gICAgQHdoaWxlcGxheWluZ0NhbGxiYWNrKCkgaWYgQHdoaWxlcGxheWluZ0NhbGxiYWNrXG5cblxuY2xhc3MgU1BBQ0UuV2ViQXVkaW9BUElcblxuICBpZGVudGlmaWVyOiAnV2ViQXVkaW9BUEknXG5cbiAgY3R4OiAgICAgICBudWxsXG4gIGFuYWx5c2VyOiAgbnVsbFxuICBwcm9jZXNzb3I6IG51bGxcbiAgYnVmZmVyOiAgICBudWxsXG4gIHNyYzogICAgICAgbnVsbFxuXG4gIHN0YXJ0VGltZTogMFxuICBwb3NpdGlvbjogIDBcbiAgZHVyYXRpb246ICAwXG5cbiAgdGltZTogMFxuXG4gIGlzTG9hZGVkOiBmYWxzZVxuXG4gICMjIFNldHVwIFdlYiBBdWRpbyBBUElcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgdHJ5XG4gICAgICBpZiAod2luZG93LkF1ZGlvQ29udGV4dE9iamVjdCA9PSB1bmRlZmluZWQpXG4gICAgICAgIHdpbmRvdy5BdWRpb0NvbnRleHRPYmplY3QgPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHR8fHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKClcbiAgICBjYXRjaCBlXG4gICAgICBpZiAoQXBwLmVudiA9PSAnZGV2ZWxvcG1lbnQnKVxuICAgICAgICBjb25zb2xlLmxvZyhcIkhUTUw1IFdlYiBBdWRpbyBBUEkgbm90IHN1cHBvcnRlZC4gU3dpdGNoIHRvIFNvdW5kTWFuYWdlcjIuXCIpXG5cbiAgc2V0VXJsOiAodXJsKS0+XG4gICAgQGN0eCA9IEF1ZGlvQ29udGV4dE9iamVjdFxuICAgIEBfb2xkQnJvd3NlcigpXG5cbiAgICByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSlcbiAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcidcbiAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICByZXF1ZXN0Lm9ubG9hZCA9ID0+XG4gICAgICBAY3R4LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCAoYnVmZmVyKT0+XG4gICAgICAgIEBpc0xvYWRlZCA9IHRydWVcbiAgICAgICAgQGJ1ZmZlciA9IGJ1ZmZlclxuICAgICAgICBAcGxheSgpXG4gICAgICAsIEBfb25FcnJvcilcbiAgICByZXF1ZXN0LnNlbmQoKVxuXG4gIF9vbkVycm9yOiAtPlxuICAgIGNvbnNvbGUubG9nICdFUlJPUidcblxuICBwYXVzZTogLT5cbiAgICBpZiBAc3JjXG4gICAgICBAc3JjLnN0b3AoMClcbiAgICAgIEBzcmMgICAgICAgPSBudWxsXG4gICAgICBAcHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gbnVsbFxuICAgICAgQHBvc2l0aW9uICA9IEBjdHguY3VycmVudFRpbWUgLSBAc3RhcnRUaW1lXG4gICAgICBAaXNQbGF5aW5nID0gZmFsc2VcblxuICBwbGF5OiAocG9zaXRpb24pLT5cbiAgICByZXR1cm4gdW5sZXNzIEBpc0xvYWRlZFxuICAgIEBfY29ubmVjdCgpXG4gICAgQHBvc2l0aW9uICA9IGlmIHR5cGVvZiBwb3NpdGlvbiA9PSAnbnVtYmVyJyB0aGVuIHBvc2l0aW9uIGVsc2UgQHBvc2l0aW9uIG9yIDBcbiAgICBAc3RhcnRUaW1lID0gQGN0eC5jdXJyZW50VGltZSAtIChAcG9zaXRpb24gb3IgMClcbiAgICBAc3JjLnN0YXJ0KEBjdHguY3VycmVudFRpbWUsIEBwb3NpdGlvbilcbiAgICBAaXNQbGF5aW5nID0gdHJ1ZVxuICAgIEBvbnBsYXkoKSBpZiBAb25wbGF5XG5cbiAgc3RvcDogLT5cbiAgICBpZiBAc3JjXG4gICAgICBAc3JjLnN0b3AoKVxuICAgICAgQHNyYy5kaXNjb25uZWN0KDApXG4gICAgICBAc3JjICAgICAgID0gbnVsbFxuICAgICAgQHByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IG51bGxcbiAgICAgIEBpc1BsYXlpbmcgPSBmYWxzZVxuICAgICAgQHBvc2l0aW9uICA9IDBcbiAgICAgIEBzdGFydFRpbWUgPSAwXG5cbiAgdm9sdW1lOiAodm9sdW1lKS0+XG4gICAgdm9sdW1lID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgdm9sdW1lKSlcbiAgICBAZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IHZvbHVtZVxuXG4gIHVwZGF0ZVBvc2l0aW9uOiAtPlxuICAgIGlmIEBpc1BsYXlpbmdcbiAgICAgIEBwb3NpdGlvbiA9IEBjdHguY3VycmVudFRpbWUgLSBAc3RhcnRUaW1lXG5cbiAgICBpZiBAcG9zaXRpb24gPiBAYnVmZmVyLmR1cmF0aW9uXG4gICAgICBAcG9zaXRpb24gPSBAYnVmZmVyLmR1cmF0aW9uXG4gICAgICBAcGF1c2UoKVxuXG4gICAgcmV0dXJuIEBwb3NpdGlvblxuXG4gIHNlZWs6ICh0aW1lKS0+XG4gICAgaWYgQGlzUGxheWluZ1xuICAgICAgQHBsYXkodGltZSlcbiAgICBlbHNlXG4gICAgICBAcG9zaXRpb24gPSB0aW1lXG5cbiAgZGVzdHJveTogLT5cbiAgICBAc3RvcCgpXG4gICAgQF9kaXNjb25uZWN0KClcbiAgICBAY3R4ID0gbnVsbFxuXG4gIF9jb25uZWN0OiAtPlxuICAgIEBwYXVzZSgpIGlmIEBpc1BsYXlpbmdcblxuICAgICMgU2V0dXAgYnVmZmVyIHNvdXJjZVxuICAgIEBzcmMgICAgICAgICAgICAgICAgID0gQGN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxuICAgIEBzcmMuYnVmZmVyICAgICAgICAgID0gQGJ1ZmZlclxuICAgIEBzcmMub25lbmRlZCAgICAgICAgID0gQF9vbkVuZGVkXG4gICAgQGR1cmF0aW9uICAgICAgICAgICAgPSBAYnVmZmVyLmR1cmF0aW9uXG5cbiAgICAjIFNldHVwIGFuYWx5c2VyXG4gICAgQGFuYWx5c2VyID0gQGN0eC5jcmVhdGVBbmFseXNlcigpXG4gICAgQGFuYWx5c2VyLnNtb290aGluZ1RpbWVDb25zdGFudCA9IC4zXG4gICAgQGFuYWx5c2VyLmZmdFNpemUgPSA1MTJcblxuICAgICMgU2V0dXAgU2NyaXB0UHJvY2Vzc29yXG4gICAgQHByb2Nlc3NvciA9IEBjdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yKDIwNDgsIDEsIDEpXG5cbiAgICAjIFNldHAgR2Fpbk5vZGVcbiAgICBAZ2Fpbk5vZGUgPSBAY3R4LmNyZWF0ZUdhaW4oKVxuXG4gICAgQHNyYy5jb25uZWN0KEBhbmFseXNlcilcbiAgICBAc3JjLmNvbm5lY3QoQGdhaW5Ob2RlKVxuICAgIEBhbmFseXNlci5jb25uZWN0KEBwcm9jZXNzb3IpXG4gICAgQHByb2Nlc3Nvci5jb25uZWN0KEBjdHguZGVzdGluYXRpb24pXG4gICAgQGdhaW5Ob2RlLmNvbm5lY3QoQGN0eC5kZXN0aW5hdGlvbilcblxuICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBAX29uQXVkaW9Qcm9jZXNzXG4gICAgQHByb2Nlc3Nvci5hcGkgPSBAXG5cbiAgICBAX29sZEJyb3dzZXIoKVxuICAgIEB2b2x1bWUoMClcblxuICBfZGlzY29ubmVjdDogLT5cbiAgICBAYW5hbHlzZXIuZGlzY29ubmVjdCgwKSAgaWYgQGFuYWx5c2VyXG4gICAgQHByb2Nlc3Nvci5kaXNjb25uZWN0KDApIGlmIEBwcm9jZXNzb3JcblxuICBfb25BdWRpb1Byb2Nlc3M6ID0+XG4gICAgQG9uYXVkaW9wcm9jZXNzKCkgaWYgQG9uYXVkaW9wcm9jZXNzXG5cbiAgX29uRW5kZWQ6ID0+XG4gICAgQHNyYy5kaXNjb25uZWN0KDApXG4gICAgQHNyYyAgICAgICAgICAgICAgICAgICAgICA9IG51bGxcbiAgICBAcHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gbnVsbFxuICAgIEBpc1BsYXlpbmcgICAgICAgICAgICAgICAgPSBmYWxzZVxuICAgIEBvbmVuZGVkKCkgaWYgQG9uZW5kZWRcblxuICBfb2xkQnJvd3NlcjogLT5cbiAgICBpZiBAY3R4IGFuZCB0eXBlb2YgQGN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IgIT0gJ2Z1bmN0aW9uJ1xuICAgICAgQGN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IgPSBAY3R4LmNyZWF0ZUphdmFTY3JpcHROb2RlXG5cbiAgICBpZiBAc3JjIGFuZCB0eXBlb2YgQHNyYy5zdGFydCAhPSAnZnVuY3Rpb24nXG4gICAgICBAc3JjLnN0YXJ0ID0gQHNyYy5ub3RlT25cblxuICAgIGlmIEBzcmMgYW5kIHR5cGVvZiBAc3JjLnN0b3AgIT0gJ2Z1bmN0aW9uJ1xuICAgICAgQHNyYy5zdG9wID0gQHNyYy5ub3RlT2ZmXG5cblxuY2xhc3MgU1BBQ0UuRXF1YWxpemVyIGV4dGVuZHMgVEhSRUUuR3JvdXBcblxuICBjZW50ZXI6ICAgICBudWxsXG5cbiAgX3ZhbHVlczogICAgbnVsbFxuICBfbmV3VmFsdWVzOiBudWxsXG5cbiAgX3RpbWU6ICAgICAgMVxuXG4gICMgVEhSRUVcbiAgbWF0ZXJpYWw6ICAgbnVsbFxuICBsaW5lczogICAgICBudWxsXG5cbiAgIyBQYXJhbWV0ZXJzXG4gIG1heExlbmd0aDogICAgICAgICAwXG4gIG1pbkxlbmd0aDogICAgICAgICAwXG4gIHJhZGl1czogICAgICAgICAgICAwXG4gIGludGVycG9sYXRpb25UaW1lOiAwXG4gIGNvbG9yOiAgICAgICAgICAgICAweEZGRkZGRlxuICBsaW5lRm9yY2VVcDogICAgICAgLjVcbiAgbGluZUZvcmNlRG93bjogICAgIC41XG4gIGxpbmV3aWR0aDogICAgICAgICAwXG4gIGFic29sdXRlOiAgICAgICAgICBmYWxzZVxuICBuYlZhbHVlczogICAgICAgICAgMFxuICBtYXhOYlZhbHVlczogICAgICAgNTEyXG4gIG1pcnJvcjogICAgICAgICAgICB0cnVlXG5cbiAgY29uc3RydWN0b3I6IChvcHRzPXt9KS0+XG4gICAgc3VwZXJcblxuICAgICMgU2V0IHBhcmFtZXRlcnNcbiAgICBkZWZhdWx0cyA9XG4gICAgICBtYXhMZW5ndGg6ICAgICAgICAgMjAwXG4gICAgICBtaW5MZW5ndGg6ICAgICAgICAgNTBcbiAgICAgIHJhZGl1czogICAgICAgICAgICAyNTBcbiAgICAgIGludGVycG9sYXRpb25UaW1lOiAxNTBcbiAgICAgIGNvbG9yOiAgICAgICAgICAgICAweEZGRkZGRlxuICAgICAgbGluZUZvcmNlVXA6ICAgICAgIC41XG4gICAgICBsaW5lRm9yY2VEb3duOiAgICAgLjVcbiAgICAgIGFic29sdXRlOiAgICAgICAgICBmYWxzZVxuICAgICAgbmJWYWx1ZXM6ICAgICAgICAgIDI1NiAjIE1heGltdW0gNTEyIHZhbHVlc1xuICAgICAgbWlycm9yOiAgICAgICAgICAgIHRydWVcbiAgICAgIGxpbmV3aWR0aDogICAgICAgICAyXG5cbiAgICBvcHRzICAgICAgICAgICAgICAgPSBIRUxQRVIuQ29mZmVlLm1lcmdlKGRlZmF1bHRzLCBvcHRzKVxuICAgIEBtaW5MZW5ndGggICAgICAgICA9IG9wdHMubWluTGVuZ3RoXG4gICAgQG1heExlbmd0aCAgICAgICAgID0gb3B0cy5tYXhMZW5ndGhcbiAgICBAcmFkaXVzICAgICAgICAgICAgPSBvcHRzLnJhZGl1c1xuICAgIEBpbnRlcnBvbGF0aW9uVGltZSA9IG9wdHMuaW50ZXJwb2xhdGlvblRpbWVcbiAgICBAY29sb3IgICAgICAgICAgICAgPSBvcHRzLmNvbG9yXG4gICAgQGxpbmVGb3JjZVVwICAgICAgID0gb3B0cy5saW5lRm9yY2VVcFxuICAgIEBsaW5lRm9yY2VEb3duICAgICA9IG9wdHMubGluZUZvcmNlRG93blxuICAgIEBhYnNvbHV0ZSAgICAgICAgICA9IG9wdHMuYWJzb2x1dGVcbiAgICBAbmJWYWx1ZXMgICAgICAgICAgPSBvcHRzLm5iVmFsdWVzXG4gICAgQG1pcnJvciAgICAgICAgICAgID0gb3B0cy5taXJyb3JcbiAgICBAbGluZXdpZHRoICAgICAgICAgPSBvcHRzLmxpbmV3aWR0aFxuXG4gICAgIyBTZXQgdmFsdWVzXG4gICAgQGNlbnRlciAgICAgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgQF92YWx1ZXMgICAgPSBAbXV0ZShmYWxzZSlcbiAgICBAX25ld1ZhbHVlcyA9IEBtdXRlKGZhbHNlKVxuXG4gICAgQGdlbmVyYXRlKClcblxuICAgIEBfZXZlbnRzKClcbiAgICBAdXBkYXRlVmFsdWVzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVHJhY2suSVNfU1RPUFBFRC50eXBlLCBAX2VUcmFja0lzU3RvcHBlZClcblxuICBfZVRyYWNrSXNTdG9wcGVkOiA9PlxuICAgIEBtdXRlKClcblxuICBzZXROYlZhbHVlczogKG5iVmFsdWVzKS0+XG4gICAgQG5iVmFsdWVzID0gbmJWYWx1ZXNcbiAgICBAbXV0ZSgpXG5cbiAgc2V0VmFsdWVzOiAodmFsdWVzKS0+XG4gICAgaWYgQG1pcnJvclxuICAgICAgZGF0YXMgID0gQXJyYXkoQG5iVmFsdWVzKVxuICAgICAgZm9yIGkgaW4gWzAuLigoQG5iVmFsdWVzKi41KS0xKV1cbiAgICAgICAgZGF0YXNbaV0gPSBkYXRhc1tAbmJWYWx1ZXMtMS1pXSA9IHZhbHVlc1tpXVxuICAgICAgdmFsdWVzID0gZGF0YXNcblxuICAgIG5ld1ZhbHVlcyA9IEBtdXRlKGZhbHNlKVxuICAgIGZvciB2YWx1ZSwgaSBpbiB2YWx1ZXNcbiAgICAgIHZhbHVlID0gTWF0aC5hYnModmFsdWUpIGlmIEBhYnNvbHV0ZVxuICAgICAgdmFsdWUgPSAwIGlmIHR5cGVvZiB2YWx1ZSA9PSAndW5kZWZpbmVkJ1xuXG4gICAgICBsZW5ndGggPSBAbWluTGVuZ3RoICsgcGFyc2VGbG9hdCh2YWx1ZSkqKEBtYXhMZW5ndGggLSBAbWluTGVuZ3RoKVxuICAgICAgbmV3VmFsdWVzW2ldID0gTWF0aC5tYXgobGVuZ3RoLCAwKVxuICAgIEBfbmV3VmFsdWVzID0gbmV3VmFsdWVzXG4gICAgQHJlc2V0SW50ZXJwb2xhdGlvbigpXG5cbiAgZ2VuZXJhdGU6IC0+XG4gICAgQG11dGUoKVxuXG4gICAgQG1hdGVyaWFsICAgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQGNvbG9yLCBsaW5ld2lkdGg6IEBsaW5ld2lkdGggfSlcbiAgICBAbGluZXMgICAgICA9IFtdXG5cbiAgICBAdXBkYXRlKDApXG4gICAgQHVwZGF0ZUdlb21ldHJpZXModHJ1ZSlcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIEBfdGltZSArPSBkZWx0YVxuICAgIHQgPSBAX3RpbWUgLyBAaW50ZXJwb2xhdGlvblRpbWVcbiAgICByZXR1cm4gaWYgdCA+IDFcblxuICAgIGZvciBpIGluIFswLi4oQG1heE5iVmFsdWVzLTEpXVxuICAgICAgZGlmZiAgICAgICAgPSBAX3ZhbHVlc1tpXSAtIEBfbmV3VmFsdWVzW2ldXG4gICAgICBAX3ZhbHVlc1tpXSA9IEBfdmFsdWVzW2ldIC0gdCAqIGRpZmZcbiAgICBAdXBkYXRlR2VvbWV0cmllcygpXG5cbiAgdXBkYXRlVmFsdWVzOiA9PlxuICAgIGlmIFNQQUNFLkp1a2Vib3guc3RhdGUgPT0gRU5VTS5KdWtlYm94U3RhdGUuSVNfUExBWUlORyBhbmQgU1BBQ0UuSnVrZWJveC53YXZlZm9ybURhdGEubW9ub1xuICAgICAgQHNldFZhbHVlcyhTUEFDRS5KdWtlYm94LndhdmVmb3JtRGF0YS5tb25vKVxuICAgICAgIyBAbXV0ZSgpXG4gICAgc2V0VGltZW91dChAdXBkYXRlVmFsdWVzLCBAaW50ZXJwb2xhdGlvblRpbWUgKiAuNSlcblxuICB1cGRhdGVHZW9tZXRyaWVzOiAoY3JlYXRlPWZhbHNlKS0+XG4gICAgZm9yIGxlbmd0aCwgaSBpbiBAX3ZhbHVlc1xuICAgICAgYW5nbGUgID0gTWF0aC5QSSAqIDIgKiBpIC8gQG5iVmFsdWVzXG5cbiAgICAgIGZyb20gPSBAY29tcHV0ZVBvc2l0aW9uKEBjZW50ZXIsIGFuZ2xlLCBAcmFkaXVzLWxlbmd0aCpAbGluZUZvcmNlRG93bilcbiAgICAgIHRvICAgPSBAY29tcHV0ZVBvc2l0aW9uKEBjZW50ZXIsIGFuZ2xlLCBAcmFkaXVzK2xlbmd0aCpAbGluZUZvcmNlVXApXG5cbiAgICAgIGlmIHR5cGVvZiBAbGluZXNbaV0gPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKVxuICAgICAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKGZyb20sIHRvLCBmcm9tKVxuXG4gICAgICAgIGxpbmUgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgQG1hdGVyaWFsKVxuICAgICAgICBAbGluZXMucHVzaChsaW5lKVxuICAgICAgICBAYWRkKGxpbmUpXG4gICAgICBlbHNlXG4gICAgICAgIGxpbmUgPSBAbGluZXNbaV1cbiAgICAgICAgbGluZS5nZW9tZXRyeS52ZXJ0aWNlc1swXSA9IGZyb21cbiAgICAgICAgbGluZS5nZW9tZXRyeS52ZXJ0aWNlc1sxXSA9IHRvXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNbMl0gPSBmcm9tXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZVxuXG4gIHJhbmRvbTogKHNldFZhbHVlcz10cnVlKT0+XG4gICAgdmFsdWVzID0gW11cbiAgICBmb3IgaSBpbiBbMC4uKEBtYXhOYlZhbHVlcy0xKV1cbiAgICAgIHZhbHVlc1tpXSA9IE1hdGgucmFuZG9tKClcbiAgICBAc2V0VmFsdWVzKHZhbHVlcykgaWYgc2V0VmFsdWVzXG4gICAgcmV0dXJuIHZhbHVlc1xuXG4gIG11dGU6IChzZXRWYWx1ZXM9dHJ1ZSktPlxuICAgIHZhbHVlcyA9IFtdXG4gICAgZm9yIGkgaW4gWzAuLihAbWF4TmJWYWx1ZXMtMSldXG4gICAgICB2YWx1ZXNbaV0gPSAwXG4gICAgQHNldFZhbHVlcyh2YWx1ZXMpIGlmIHNldFZhbHVlc1xuICAgIHJldHVybiB2YWx1ZXNcblxuICByZXNldEludGVycG9sYXRpb246IC0+XG4gICAgQF90aW1lID0gMFxuXG4gIGNvbXB1dGVQb3NpdGlvbjogKHBvaW50LCBhbmdsZSwgbGVuZ3RoKS0+XG4gICAgeCA9IHBvaW50LnggKyBNYXRoLnNpbihhbmdsZSkgKiBsZW5ndGhcbiAgICB5ID0gcG9pbnQueSArIE1hdGguY29zKGFuZ2xlKSAqIGxlbmd0aFxuICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMyh4LCB5LCBwb2ludC56KVxuXG4gIHJlbW92ZUxpbmVGcm9tUGFyZW50OiAoaW5kZXgpLT5cbiAgICBwYXJlbnQgPSBAbGluZXNbaW5kZXhdXG4gICAgcGFyZW50LnJlbW92ZShAbGluZXNbaW5kZXhdKVxuXG5cbmNsYXNzIFNQQUNFLlNwYWNlc2hpcCBleHRlbmRzIFRIUkVFLkdyb3VwXG5cbiAgdGltZTogMFxuXG4gIHNoaXA6IG51bGxcbiAgcGF0aDogbnVsbFxuICBkdXJhdGlvbjogMFxuICBzb25nRHVyYXRpb246IDBcblxuICBzdGF0ZTogbnVsbFxuXG4gIGFuZ2xlOiAwXG5cbiAgX2NhY2hlZDogbnVsbFxuXG4gICMgU1RBVEVTXG4gIEBJRExFOiAgICAgJ0lETEUnXG4gIEBMQVVOQ0hFRDogJ0xBVU5DSEVEJ1xuICBASU5fTE9PUDogICdJTl9MT09QJ1xuICBAQVJSSVZFRDogICdBUlJJVkVEJ1xuXG4gIGNvbnN0cnVjdG9yOiAodGFyZ2V0LCByYWRpdXMpLT5cbiAgICBzdXBlclxuXG4gICAgQHRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKHRhcmdldC54LCB0YXJnZXQueSwgNSlcbiAgICBAcmFkaXVzID0gcmFkaXVzXG4gICAgQGFuZ2xlICA9IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMlxuXG4gICAgQHNldFN0YXRlKFNwYWNlc2hpcFN0YXRlLklETEUpXG5cbiAgICBAc2V0dXAoKVxuXG4gIHNldFJhZGl1czogKHJhZGl1cyktPlxuICAgIEByYWRpdXMgPSByYWRpdXNcbiAgICBAX2NhY2hlZCA9IEBfY29tcHV0ZVBhdGhzKClcblxuICBzZXR1cDogLT5cbiAgICBnID0gbmV3IFRIUkVFLkdlb21ldHJ5KClcbiAgICBnLnZlcnRpY2VzLnB1c2goXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMyggIDAsIC01Mi41LCAtMTApXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMygtMTAsIC02Ny41LCAgMTApXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMygtNTAsIC00Mi41LCAgMTApXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMyggIDAsICA2Ny41LCAgMTApXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMygrNTAsIC00Mi41LCAgMTApXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMygrMTAsIC02Ny41LCAgMTApXG4gICAgKVxuICAgIGcuZmFjZXMucHVzaChcbiAgICAgIG5ldyBUSFJFRS5GYWNlMygwLCAzLCAxKSxcbiAgICAgIG5ldyBUSFJFRS5GYWNlMygxLCAyLCAzKSxcbiAgICAgIG5ldyBUSFJFRS5GYWNlMygzLCAwLCA1KSxcbiAgICAgIG5ldyBUSFJFRS5GYWNlMyg1LCA0LCAzKVxuICAgIClcbiAgICBnLmNvbXB1dGVGYWNlTm9ybWFscygpXG4gICAgbWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKVxuICAgIG1hdHJpeC5tYWtlUm90YXRpb25YKE1hdGguUEkqLjUpXG4gICAgZy5hcHBseU1hdHJpeChtYXRyaXgpXG4gICAgbWF0cml4Lm1ha2VSb3RhdGlvblooTWF0aC5QSSlcbiAgICBnLmFwcGx5TWF0cml4KG1hdHJpeClcblxuICAgIEBzaGlwID0gVEhSRUUuU2NlbmVVdGlscy5jcmVhdGVNdWx0aU1hdGVyaWFsT2JqZWN0KGcsIFtcbiAgICAgIG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4RkZGRkZGLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlIH0pXG4gICAgXSlcbiAgICBAc2hpcC5jYXN0U2hhZG93ID0gdHJ1ZVxuICAgIEBzaGlwLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgQHNoaXAuc2NhbGUuc2V0KC4xNSwgLjE1LCAuMTUpXG4gICAgQGFkZChAc2hpcClcblxuICAgIEBfY2FjaGVkID0gQF9jb21wdXRlUGF0aHMoKVxuICAgIHYgPSBAX2NhY2hlZC5sYXVuY2hlZFBhdGguZ2V0UG9pbnRBdCgwKVxuICAgIEBzaGlwLnBvc2l0aW9uLnNldCh2LngsIHYueSwgdi56KVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIHN3aXRjaCBzdGF0ZVxuICAgICAgd2hlbiBTcGFjZXNoaXBTdGF0ZS5JRExFXG4gICAgICAgICMgU1BBQ0UuTE9HKCdJRExFJylcbiAgICAgICAgQHBhdGggPSBudWxsXG4gICAgICB3aGVuIFNwYWNlc2hpcFN0YXRlLkxBVU5DSEVEXG4gICAgICAgICMgU1BBQ0UuTE9HKCdMQVVOQ0hFRCcpXG4gICAgICAgIEBfcmVzZXRUaW1lKClcbiAgICAgICAgQHBhdGggPSBAX2NhY2hlZC5sYXVuY2hlZFBhdGhcbiAgICAgICAgQGR1cmF0aW9uID0gMTAgKiAxMDAwXG5cbiAgICAgICAgdiA9IEBwYXRoLmdldFBvaW50KDApXG4gICAgICAgIEBzaGlwLnBvc2l0aW9uLnNldCh2LngsIHYueSwgdi56KVxuICAgICAgd2hlbiBTcGFjZXNoaXBTdGF0ZS5JTl9MT09QXG4gICAgICAgICMgU1BBQ0UuTE9HKCdJTl9MT09QJylcbiAgICAgICAgQF9yZXNldFRpbWUoKVxuICAgICAgICBAcGF0aCA9IEB0ZXN0bmV3bG9vcCgpICNAX2NhY2hlZC5pbkxvb3BQYXRoXG4gICAgICAgIEBkdXJhdGlvbiA9IDUgKiAxMDAwI0Bzb25nRHVyYXRpb25cblxuICAgICAgICB2ID0gQHBhdGguZ2V0UG9pbnQoMClcbiAgICAgICAgQHNoaXAucG9zaXRpb24uc2V0KHYueCwgdi55LCB2LnopXG5cbiAgICAgICAgIyBAc2hpcFJvdGF0aW9uWiA9IEBzaGlwLnJvdGF0aW9uLnpcbiAgICAgICAgIyAkKEBzaGlwLnJvdGF0aW9uKS5hbmltYXRlKHtcbiAgICAgICAgIyAgIHo6IDBcbiAgICAgICAgIyB9LCB7XG4gICAgICAgICMgICBkdXJhdGlvbjogNTAwXG4gICAgICAgICMgICBwcm9ncmVzczogKG9iamVjdCk9PlxuICAgICAgICAjICAgICBAc2hpcFJvdGF0aW9uWiA9IG9iamVjdC50d2VlbnNbMF0ubm93XG4gICAgICAgICMgfSlcbiAgICAgIHdoZW4gU3BhY2VzaGlwU3RhdGUuQVJSSVZFRFxuICAgICAgICAjIFNQQUNFLkxPRygnQVJSSVZFRCcpXG4gICAgICAgIEBwYXRoID0gbnVsbFxuICAgICAgICBAcGFyZW50LnJlbW92ZShAKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0U3RhdGUoU3BhY2VzaGlwU3RhdGUuSURMRSlcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIGlmIEBzdGF0ZSAhPSBTcGFjZXNoaXBTdGF0ZS5JRExFIGFuZCBAc3RhdGUgIT0gU3BhY2VzaGlwU3RhdGUuQVJSSVZFRFxuXG4gICAgICB0ID0gTWF0aC5taW4oQHRpbWUgLyBAZHVyYXRpb24sIDEpXG5cbiAgICAgIGlmIHQgPj0gMVxuICAgICAgICBAX3Jlc2V0VGltZSgpXG4gICAgICAgIGlmIEBzdGF0ZSA9PSBTcGFjZXNoaXBTdGF0ZS5MQVVOQ0hFRFxuICAgICAgICAgIEBzZXRTdGF0ZShTcGFjZXNoaXBTdGF0ZS5JTl9MT09QKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBTcGFjZXNoaXBTdGF0ZS5JTl9MT09QXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyAnbmV4dCBtb3ZlPydcbiAgICAgICAgICBAcGF0aCA9IEB0ZXN0bmV3bG9vcCgpXG4gICAgICAgICAgQGR1cmF0aW9uID0gKDUgKyAoTWF0aC5yYW5kb20oKSAqIDEwKSkgKiAxMDAwXG4gICAgICAgICAgIyBAc2V0U3RhdGUoU3BhY2VzaGlwU3RhdGUuQVJSSVZFRClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlmIEBzdGF0ZSA9PSBTcGFjZXNoaXBTdGF0ZS5MQVVOQ0hFRFxuICAgICAgICBAdGltZSArPSBkZWx0YVxuICAgICAgICB0ID0gX0Vhc2luZy5RdWFkcmF0aWNFYXNlT3V0KHQpXG5cbiAgICAgICMgVE1QXG4gICAgICBpZiBAc3RhdGUgPT0gU3BhY2VzaGlwU3RhdGUuSU5fTE9PUFxuICAgICAgICBAdGltZSArPSBkZWx0YVxuICAgICAgICAjIGNvbnNvbGUubG9nIEB0aW1lXG5cbiAgICAgIEBfcHJvZ3Jlc3ModCkgaWYgdFxuXG4gIF9yZXNldFRpbWU6IC0+XG4gICAgQHRpbWUgPSAwXG5cbiAgX3Byb2dyZXNzOiAodCktPlxuICAgIHYgPSBAcGF0aC5nZXRQb2ludEF0KHQpXG4gICAgQHNoaXAucG9zaXRpb24uc2V0KHYueCwgdi55LCB2LnopXG5cbiAgICBhaGVhZCA9ICBNYXRoLm1pbih0ICsgMTAgLyBAcGF0aC5nZXRMZW5ndGgoKSwgMSlcbiAgICB2ID0gQHBhdGguZ2V0UG9pbnRBdChhaGVhZCkubXVsdGlwbHlTY2FsYXIoIDEgKVxuICAgIEBzaGlwLmxvb2tBdCh2KVxuXG4gICAgaWYgQHN0YXRlID09IFNwYWNlc2hpcFN0YXRlLkxBVU5DSEVEXG4gICAgICBzY2FsZSA9IC4yNSArICgxIC0gdCkgKiAuMzVcbiAgICAgIEBzaGlwLnNjYWxlLnNldChzY2FsZSwgc2NhbGUsIHNjYWxlKVxuXG4gICAgIyBpZiBAc3RhdGUgPT0gU3BhY2VzaGlwU3RhdGUuSU5fTE9PUFxuICAgICMgICBAc2hpcC5yb3RhdGlvbi5zZXQoQHNoaXAucm90YXRpb24ueCwgQHNoaXAucm90YXRpb24ueSwgQHNoaXBSb3RhdGlvblopXG5cbiAgX2NvbXB1dGVQYXRoczogLT5cbiAgICBmcm9tQSAgICAgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgZnJvbUEueCAgID0gQHRhcmdldC54ICsgTWF0aC5jb3MoQGFuZ2xlKSAqIDUwMFxuICAgIGZyb21BLnkgICA9IEB0YXJnZXQueSArIE1hdGguc2luKEBhbmdsZSkgKiA1MDBcbiAgICBmcm9tQS56ICAgPSA2MDBcblxuICAgIHBhdGggICAgICAgICAgID0gbmV3IFRIUkVFLkluTG9vcEN1cnZlKEB0YXJnZXQsIEBhbmdsZSwgQHJhZGl1cylcbiAgICBwYXRoLmludmVyc2UgICA9IHRydWVcbiAgICBwYXRoLnVzZUdvbGRlbiA9IHRydWVcblxuICAgICMjIENyZWF0ZSBwYXRoIGxhdW5jaGVkXG4gICAgbWlkICAgICAgPSBwYXRoLmdldFBvaW50KDApXG4gICAgcmVmICAgICAgPSBwYXRoLmdldFBvaW50KC4wMjUpXG4gICAgYW5nbGUgICAgPSBfTWF0aC5hbmdsZUJldHdlZW5Qb2ludHMobWlkLCByZWYpICsgTWF0aC5QSVxuICAgIGRpc3RhbmNlID0gbWlkLmRpc3RhbmNlVG8ocmVmKVxuXG4gICAgY3VydmVQb2ludCAgID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIGN1cnZlUG9pbnQueCA9IG1pZC54ICsgTWF0aC5jb3MoYW5nbGUpICogZGlzdGFuY2VcbiAgICBjdXJ2ZVBvaW50LnkgPSBtaWQueSArIE1hdGguc2luKGFuZ2xlKSAqIGRpc3RhbmNlXG4gICAgY3VydmVQb2ludC56ID0gbWlkLnpcblxuICAgIHRvQSAgICA9IHBhdGguZ2V0UG9pbnQoMClcbiAgICBjdXJ2ZSAgPSBuZXcgVEhSRUUuTGF1bmNoZWRDdXJ2ZShmcm9tQSwgdG9BKVxuICAgIHBvaW50cyA9IGN1cnZlLmdldFBvaW50cygxMClcbiAgICAjIHBvaW50cy5wdXNoKHRvQSlcblxuICAgIGZvciBwdCwgaSBpbiBwYXRoLmdldFBvaW50cygxMClcbiAgICAgIHBvaW50cy5wdXNoKHB0KSBpZiBpID4gMFxuXG4gICAgY3VydmVBID0gX1RIUkVFLkhlcm1pdGVDdXJ2ZShwb2ludHMpXG5cbiAgICAjIyBDcmVhdGUgcGF0aCBpbiB0aGUgbG9vcFxuICAgIGN1cnZlQiA9IHBhdGgjX1RIUkVFLkhlcm1pdGVDdXJ2ZShwYXRoLmdldFBvaW50cygxMCkpXG5cbiAgICAjIEBfZGVidWdQYXRoKGN1cnZlQSlcbiAgICAjIEBfZGVidWdQYXRoKGN1cnZlQilcblxuICAgICMgQHRlc3RuZXdsb29wKClcblxuICAgIHJldHVybiB7IGxhdW5jaGVkUGF0aDogY3VydmVBLCBpbkxvb3BQYXRoOiBjdXJ2ZUIgfVxuXG4gIHRlc3RuZXdsb29wOiAtPlxuICAgIFRIUkVFLk5ld0xvb3AgPSBUSFJFRS5DdXJ2ZS5jcmVhdGUoXG4gICAgICAodjAsIHJhZGl1cz0gMTAwLCBzdGFydEFuZ2xlPTApLT5cbiAgICAgICAgQHYwICAgICAgICAgPSB2MFxuICAgICAgICBAcmFkaXVzICAgICA9IHJhZGl1c1xuICAgICAgICBAc3RhcnRBbmdsZSA9IHN0YXJ0QW5nbGVcbiAgICAgICAgQHJhbmRBbmdsZSAgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDJcbiAgICAgICAgQGRpcmVjdGlvbiAgPSBpZiBNYXRoLnJhbmRvbSgpID4gLjUgdGhlbiB0cnVlIGVsc2UgZmFsc2VcbiAgICAgICAgQHRlc3QgICAgICAgPSBNYXRoLnJhbmRvbSgpXG4gICAgICAgIHJldHVyblxuICAgICAgLCAodCktPlxuICAgICAgICB0ICAgICAgPSAxIC0gdCBpZiBAZGlyZWN0aW9uXG4gICAgICAgIGFuZ2xlICA9IChNYXRoLlBJICogMikgKiB0XG4gICAgICAgIGFuZ2xlICArPSBAc3RhcnRBbmdsZVxuXG4gICAgICAgIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICAgICAgdmVjdG9yLnggPSBAdjAueCArIE1hdGguY29zKGFuZ2xlKSAqIEByYWRpdXNcbiAgICAgICAgdmVjdG9yLnkgPSBAdjAueSArIE1hdGguY29zKGFuZ2xlICsgQHJhbmRBbmdsZSkgKiAoQHJhZGl1cyAqIDIgKiBAdGVzdClcbiAgICAgICAgdmVjdG9yLnogPSBAdjAueiArIE1hdGguc2luKGFuZ2xlKSAqIEByYWRpdXNcbiAgICAgICAgcmV0dXJuIHZlY3RvclxuXG4gICAgICAgICMgdCAgICAgPSAxIC0gdCBpZiBAaW52ZXJzZVxuICAgICAgICAjIGlmIEB1c2VHb2xkZW5cbiAgICAgICAgIyAgICAgcGhpICAgPSAoTWF0aC5zcXJ0KDUpKzEpLzIgLSAxXG4gICAgICAgICMgICAgIGdvbGRlbl9hbmdsZSA9IHBoaSAqIE1hdGguUEkgKiAyXG4gICAgICAgICMgICAgIGFuZ2xlID0gQHN0YXJ0QW5nbGUgKyAoZ29sZGVuX2FuZ2xlICogdClcbiAgICAgICAgIyAgICAgYW5nbGUgKz0gTWF0aC5QSSAqIC0xLjIzNVxuICAgICAgICAjIGVsc2VcbiAgICAgICAgIyAgICAgYW5nbGUgPSBAc3RhcnRBbmdsZSArIChNYXRoLlBJICogMiAqIHQpXG5cbiAgICAgICAgIyB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgICAgICMgdmVjdG9yLnggPSBAdjAueCArIE1hdGguY29zKGFuZ2xlKSAqIChAbWluUmFkaXVzICsgQHJhZGl1cyAqIHQpXG4gICAgICAgICMgdmVjdG9yLnkgPSBAdjAueSArIE1hdGguc2luKGFuZ2xlKSAqIChAbWluUmFkaXVzICsgQHJhZGl1cyAqIHQpXG4gICAgICAgICMgdmVjdG9yLnogPSBAdjAuelxuICAgICAgICAjIHJldHVybiB2ZWN0b3JcbiAgICApXG5cbiAgICBuZXdsb29wID0gbmV3IFRIUkVFLk5ld0xvb3AoQHRhcmdldCwgMTUwLCBNYXRoLlBJKi0uNSlcbiAgICByZXR1cm4gbmV3bG9vcFxuICAgICMgQF9kZWJ1Z1BhdGgobmV3bG9vcClcblxuXG4gIF9kZWJ1Z1BhdGg6IChwYXRoLCBjb2xvcj0weEZGMDAwMCktPlxuICAgIGcgICAgPSBuZXcgVEhSRUUuVHViZUdlb21ldHJ5KHBhdGgsIDIwMCwgLjUsIDEwLCB0cnVlKVxuICAgIHR1YmUgPSBUSFJFRS5TY2VuZVV0aWxzLmNyZWF0ZU11bHRpTWF0ZXJpYWxPYmplY3QoIGcsIFtcbiAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgIG9wYWNpdHk6IDAuMyxcbiAgICAgICAgICB3aXJlZnJhbWU6IHRydWUsXG4gICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWVcbiAgICAgIH0pLFxuICAgICAgbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogMHhGRjg4RkYsIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUgfSlcbiAgICBdKVxuICAgIEBhZGQodHViZSlcblxuXG5jbGFzcyBTUEFDRS5ERUZBVUxULlNldHVwIGV4dGVuZHMgVEhSRUUuR3JvdXBcblxuICBqdWtlYm94OiBudWxsXG4gIHBsYXlsaXN0OiBudWxsXG4gIGN1cnJlbnQ6IG51bGxcbiAgY292ZXI6IG51bGxcblxuICBvbmFkZDogZmFsc2VcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlclxuICAgIEBqdWtlYm94ID0gU1BBQ0UuSnVrZWJveFxuXG4gIG9uRW50ZXI6IChjYWxsYmFjayktPlxuICAgIGNhbGxiYWNrKCkgaWYgY2FsbGJhY2tcbiAgICBAc2V0dXAoKVxuXG4gIG9uRXhpdDogKGNhbGxiYWNrKS0+XG4gICAgY2FsbGJhY2soKSBpZiBjYWxsYmFja1xuXG4gIF9ldmVudHM6IC0+XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5KdWtlYm94LklTX1NUT1BQRUQudHlwZSwgQF9lSnVrZWJveElzU3RvcHBlZClcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNvdmVyLlRFWFRVUkVTX0xPQURFRC50eXBlLCBAX2VDb3ZlclRleHR1cmVzTG9hZGVkKVxuXG4gIF9lSnVrZWJveElzU3RvcHBlZDogKGUpPT5cbiAgICBAX2xhdW5jaCgpXG5cbiAgX2VDb3ZlclRleHR1cmVzTG9hZGVkOiAoZSk9PlxuICAgIEBfbGF1bmNoKClcblxuICBfbGF1bmNoOiAtPlxuICAgIGZvciB0cmFjayBpbiBAcGxheWxpc3RcbiAgICAgIEBqdWtlYm94LmFkZCh0cmFjaylcblxuICBzZXR1cDogLT5cbiAgICBAZmV0Y2hUcmFja3MoKVxuICAgIEBjb3ZlciA9IG5ldyBTUEFDRS5ERUZBVUxULkNvdmVyKClcbiAgICBAYWRkKEBjb3ZlcilcbiAgICBAX2V2ZW50cygpXG5cbiAgZmV0Y2hUcmFja3M6IC0+XG4gICAgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXEub3BlbignR0VUJywgJ3Jlc291cmNlcy9wbGF5bGlzdC5qc29uJywgdHJ1ZSlcbiAgICByZXEub25sb2FkID0gKGUpPT5cbiAgICAgIEBwbGF5bGlzdCA9IEpTT04ucGFyc2UoZS50YXJnZXQucmVzcG9uc2UpXG5cbiAgICAgIEBjb3Zlci5sb2FkKEBwbGF5bGlzdClcblxuXG5cbiAgICAgICMgZm9yIHRyYWNrIGluIEBwbGF5bGlzdFxuICAgICAgIyAgIEBqdWtlYm94LmFkZCh0cmFjaylcblxuXG5cblxuICAgICAgICAjICQoJyNjb3ZlciB1bCcpLmFwcGVuZCgnPGxpPjwvbGk+JylcbiAgICAgICAgIyAkKCcjY292ZXIgdWwgbGknKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKHJlc291cmNlcy9jb3ZlcnMvJyt0cmFjay5jb3ZlcisnKScpXG4gICAgICAjICQoJyNjb3ZlciB1bCBsaTpmaXJzdC1jaGlsZCcpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIHJlcS5zZW5kKG51bGwpXG5cbiAgIyBuZXh0OiAtPlxuICAjICAgaWYgQHBsYXlsaXN0Lmxlbmd0aCA+IDBcbiAgIyAgICAgQGN1cnJlbnQgPSBAcGxheWxpc3Quc2hpZnQoKVxuICAjICAgQGp1a2Vib3guYWRkKEBjdXJyZW50KVxuICAjICAgQHJlZnJlc2hDb3ZlcigpXG4gICMgICBAb25hZGQgPSB0cnVlXG5cbiAgIyB1cGRhdGU6IChkZWx0YSktPlxuICAjICAgaWYgQHBsYXlsaXN0IGFuZCBAcGxheWxpc3QubGVuZ3RoIGFuZCBAanVrZWJveC5zdGF0ZSA9PSBKdWtlYm94U3RhdGUuSVNfU1RPUFBFRCBhbmQgbm90IEBvbmFkZFxuICAjICAgICBAbmV4dCgpXG4gICMgICBlbHNlIGlmIEBqdWtlYm94LnN0YXRlID09IEp1a2Vib3hTdGF0ZS5JU19QTEFZSU5HIGFuZCBAb25hZGRcbiAgIyAgICAgQG9uYWRkID0gZmFsc2VcblxuXG5jbGFzcyBTUEFDRS5ERUZBVUxULkNvdmVyIGV4dGVuZHMgVEhSRUUuR3JvdXBcblxuICBsb2FkaW5nTWFuYWdlcjogbnVsbFxuICBpbWFnZUxvYWRlcjogbnVsbFxuXG4gIHBsYW5lOiBudWxsXG5cbiAgcGxheWxpc3Q6IG51bGxcblxuICB0ZXh0dXJlMDogbnVsbFxuICB0ZXh0dXJlMTogbnVsbFxuXG4gIGZvdjogMFxuICBhc3BlY3Q6IDBcbiAgZGlzdGFuY2U6IDBcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlclxuICAgIEBfc2V0dXAoKVxuICAgIEBfZXZlbnRzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVHJhY2suSVNfUExBWUlORy50eXBlLCBAX2VUcmFja0lzUGxheWluZylcblxuICBfZVRyYWNrSXNQbGF5aW5nOiAoZSk9PlxuICAgIHRyYWNrICAgID0gZS5vYmplY3QudHJhY2tcbiAgICB0aXRsZSAgICA9IHRyYWNrLmRhdGEudGl0bGVcbiAgICB1c2VybmFtZSA9IHRyYWNrLmRhdGEuYXV0aG9yXG4gICAgdXNlcl91cmwgPSB0cmFjay5kYXRhLmF1dGhvcl91cmxcblxuICAgICQoJyNpbmZvcm1hdGlvbiBoMScpLmh0bWwodGl0bGUpXG4gICAgJCgnI2luZm9ybWF0aW9uIGgyJykuaHRtbCgnYnkgPGEgaHJlZj1cIicrdXNlcl91cmwrJ1wiPicrdXNlcm5hbWUrJzwvYT4nKVxuXG4gICAgY3NzID0gXCJcIlwiXG4gICAgICAgIGEgeyBjb2xvcjogXCJcIlwiK3RyYWNrLmRhdGEuY29sb3IxK1wiXCJcIiAhaW1wb3J0YW50OyB9XG4gICAgICAgIGJvZHkgeyBjb2xvcjogXCJcIlwiK3RyYWNrLmRhdGEuY29sb3IyK1wiXCJcIiAhaW1wb3J0YW50OyB9XG4gICAgXCJcIlwiXG4gICAgJCgnLmNvdmVyLXN0eWxlJykuaHRtbChjc3MpXG5cbiAgICBuZXh0VHJhY2sgPSBAcGxheWxpc3RbMF1cbiAgICBmb3IgdHJhY2tEYXRhLCBpIGluIEBwbGF5bGlzdFxuICAgICAgaWYgdHJhY2tEYXRhLmNvdmVyID09IHRyYWNrLmRhdGEuY292ZXJcbiAgICAgICAgbmV4dFRyYWNrID0gQHBsYXlsaXN0W2krMV0gaWYgaSsxIDwgQHBsYXlsaXN0Lmxlbmd0aFxuICAgICAgICBicmVha1xuXG4gICAgQHRleHR1cmVMb2FkZXIubG9hZCAncmVzb3VyY2VzL2NvdmVycy8nK3RyYWNrLmRhdGEuY292ZXIsICh0ZXh0dXJlKT0+XG4gICAgICBAdGV4dHVyZTAgPSB0ZXh0dXJlXG4gICAgICBAX3RleHR1cmVMb2FkZWQoKVxuICAgIEB0ZXh0dXJlTG9hZGVyLmxvYWQgJ3Jlc291cmNlcy9jb3ZlcnMvJytuZXh0VHJhY2suY292ZXIsICh0ZXh0dXJlKT0+XG4gICAgICBAdGV4dHVyZTEgPSB0ZXh0dXJlXG4gICAgICBAX3RleHR1cmVMb2FkZWQoKVxuXG4gICAgIyBAc2V0Q292ZXJzKHRyYWNrLmRhdGEsIG5leHRUcmFjaylcblxuICBfc2V0dXA6IC0+XG4gICAgQGxvYWRpbmdNYW5hZ2VyICAgICAgICA9IG5ldyBUSFJFRS5Mb2FkaW5nTWFuYWdlcigpXG4gICAgQGxvYWRpbmdNYW5hZ2VyLm9uTG9hZCA9IEBfc2V0dXBQbGFuZVxuICAgIEBpbWFnZUxvYWRlciAgICAgICAgICAgPSBuZXcgVEhSRUUuSW1hZ2VMb2FkZXIoQGxvYWRpbmdNYW5hZ2VyKVxuICAgIEB0ZXh0dXJlTG9hZGVyICAgICAgICAgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcihAbG9hZGluZ01hbmFnZXIpXG4gICAgQGxvYWRlciAgICAgICAgICAgICAgICA9IG5ldyBUSFJFRS5YSFJMb2FkZXIoQGxvYWRpbmdNYW5hZ2VyKVxuXG4gIGxvYWQ6IChwbGF5bGlzdCktPlxuICAgIEBwbGF5bGlzdCA9IHBsYXlsaXN0XG5cbiAgICBmb3IgdHJhY2sgaW4gcGxheWxpc3RcbiAgICAgIEBpbWFnZUxvYWRlci5sb2FkICdyZXNvdXJjZXMvY292ZXJzLycrdHJhY2suY292ZXIsIChpbWFnZSk9PlxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgQGxvYWRlci5sb2FkICdhc3NldHMvc2hhZGVycy9jb3Zlci5mcmFnJywgKGNvbnRlbnQpPT5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgQGxvYWRlci5sb2FkICdhc3NldHMvc2hhZGVycy9jb3Zlci52ZXJ0JywgKGNvbnRlbnQpPT5cbiAgICAgIHJldHVybiB0cnVlXG5cbiAgX3NldHVwUGxhbmU6ID0+XG4gICAgdmVydGV4U2hhZGVyICAgPSBAbG9hZGVyLmNhY2hlLmZpbGVzWydhc3NldHMvc2hhZGVycy9jb3Zlci52ZXJ0J11cbiAgICBmcmFnbWVudFNoYWRlciA9IEBsb2FkZXIuY2FjaGUuZmlsZXNbJ2Fzc2V0cy9zaGFkZXJzL2NvdmVyLmZyYWcnXVxuXG4gICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoXG4gICAgICB1bmlmb3JtczpcbiAgICAgICAgdGV4dHVyZTA6IHsgdHlwZTogJ3QnLCB2YWx1ZTogW10gfVxuICAgICAgICB0ZXh0dXJlMTogeyB0eXBlOiAndCcsIHZhbHVlOiBbXSB9XG4gICAgICAgIHJlc29sdXRpb246IHsgdHlwZTogJ3YyJywgdmFsdWU6IG5ldyBUSFJFRS5WZWN0b3IyKCkgfVxuICAgICAgICBhVGltZTogeyB0eXBlOiAnZicsIHZhbHVlOiAwIH1cbiAgICAgICAgdE1vdmU6IHsgdHlwZTogJ2YnLCB2YWx1ZTogMCB9XG4gICAgICAgIHRTY2FsZTogeyB0eXBlOiAnZicsIHZhbHVlOiAwIH1cbiAgICAgIHZlcnRleFNoYWRlcjogdmVydGV4U2hhZGVyXG4gICAgICBmcmFnbWVudFNoYWRlcjogZnJhZ21lbnRTaGFkZXJcbiAgICApXG5cbiAgICBAcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgxLCAxKSwgbWF0ZXJpYWwpXG4gICAgQHBsYW5lLnBvc2l0aW9uLnogPSAtMVxuICAgIEBhZGQoQHBsYW5lKVxuXG4gICAgSEVMUEVSLnRyaWdnZXIoRVZFTlQuQ292ZXIuVEVYVFVSRVNfTE9BREVEKVxuXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUwLnZhbHVlICA9IG5ldyBUSFJFRS5UZXh0dXJlKClcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTEudmFsdWUgPSBuZXcgVEhSRUUuVGV4dHVyZSgpXG5cbiAgICBAbG9hZGluZ01hbmFnZXIub25Mb2FkID0gQF90ZXh0dXJlTG9hZGVkXG5cbiAgX3RleHR1cmVMb2FkZWQ6IChhLCBiLCBjKT0+XG4gICAgaWYgQHRleHR1cmUwICYmIEB0ZXh0dXJlMVxuICAgICAgQHNldENvdmVycyhAdGV4dHVyZTAsIEB0ZXh0dXJlMSlcbiAgICAgIEB0ZXh0dXJlMCA9IEB0ZXh0dXJlMSA9IG51bGxcblxuICBzZXRDb3ZlcnM6IChjdXJyZW50LCBuZXh0KS0+XG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUwLnZhbHVlICA9IGN1cnJlbnRcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTEudmFsdWUgPSBuZXh0XG5cbiAgICB0ZXh0dXJlV2lkdGggID0gY3VycmVudC5pbWFnZS53aWR0aFxuICAgIHRleHR1cmVIZWlnaHQgPSBjdXJyZW50LmltYWdlLmhlaWdodFxuXG4gICAgQGZvdiAgICAgID0gbWFuYWdlci5jYW1lcmEuZm92IC8gMTgwICogTWF0aC5QSVxuICAgIEBhc3BlY3QgICA9IHRleHR1cmVXaWR0aCAvIHRleHR1cmVIZWlnaHRcbiAgICBAZGlzdGFuY2UgPSBtYW5hZ2VyLmNhbWVyYS5wb3NpdGlvbi56ICsgMTtcbiAgICByYXRpbyAgICAgPSBNYXRoLm1heCgxLCBtYW5hZ2VyLmNhbWVyYS5hc3BlY3QgLyBAYXNwZWN0KVxuXG4gICAgd2lkdGggID0gMiAqIEBhc3BlY3QgKiBNYXRoLnRhbihAZm92IC8gMikgKiBAZGlzdGFuY2UgKiByYXRpb1xuICAgIGhlaWdodCA9IDIgKiBNYXRoLnRhbihAZm92IC8gMikgKiBAZGlzdGFuY2UgKiByYXRpb1xuXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnJlc29sdXRpb24udmFsdWUueCA9IHdpZHRoXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnJlc29sdXRpb24udmFsdWUueSA9IGhlaWdodFxuICAgIEBwbGFuZS5zY2FsZS5zZXQod2lkdGgsIGhlaWdodCwgMSlcblxuICByZXNpemU6IC0+XG4gICAgdGV4dHVyZTAgICAgICA9IEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMFxuICAgIHRleHR1cmVXaWR0aCAgPSB0ZXh0dXJlMC5pbWFnZS53aWR0aFxuICAgIHRleHR1cmVIZWlnaHQgPSB0ZXh0dXJlMC5pbWFnZS5oZWlnaHRcblxuICAgIHJhdGlvICA9IE1hdGgubWF4KDEsIG1hbmFnZXIuY2FtZXJhLmFzcGVjdCAvIEBhc3BlY3QpXG5cbiAgICBAcGxhbmUuc2NhbGUuc2V0KDIgKiBAYXNwZWN0ICogTWF0aC50YW4oQGZvdiAvIDIpICogQGRpc3RhbmNlICogcmF0aW8sIDIgKiBNYXRoLnRhbihAZm92IC8gMikgKiBAZGlzdGFuY2UgKiByYXRpbywgMSlcblxuICB0TW92ZTogMFxuICB0U2NhbGU6IDBcbiAgbmV4dDogLT5cbiAgICAkKHRoaXMpLmFuaW1hdGUoeyB0U2NhbGU6IDEgfSxcbiAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgIHByb2dyZXNzOiA9PlxuICAgICAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudFNjYWxlLnZhbHVlID0gSEVMUEVSLkVhc2luZy5FeHBvbmVudGlhbEVhc2VPdXQoQHRTY2FsZSlcbiAgICApLmFuaW1hdGUoeyB0TW92ZTogMSB9LFxuICAgICAgZHVyYXRpb246IDc1MFxuICAgICAgcHJvZ3Jlc3M6ID0+XG4gICAgICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50TW92ZS52YWx1ZSA9IEhFTFBFUi5FYXNpbmcuRXhwb25lbnRpYWxFYXNlT3V0KEB0TW92ZSlcbiAgICApLmFuaW1hdGUoeyB0U2NhbGU6IDAgfSxcbiAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgIHByb2dyZXNzOiA9PlxuICAgICAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudFNjYWxlLnZhbHVlID0gSEVMUEVSLkVhc2luZy5FeHBvbmVudGlhbEVhc2VPdXQoQHRTY2FsZSlcbiAgICApXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cbiAgICBpZiBAcGxhbmVcbiAgICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy5hVGltZS52YWx1ZSArPSBkZWx0YSAqIDAuMDAxXG5cblxuXG5tYW5hZ2VyID0gbmV3IFNQQUNFLlNjZW5lTWFuYWdlcigpXG5tYW5hZ2VyLmNyZWF0ZVNjZW5lKCdtYWluJywgU1BBQ0UuTWFpblNjZW5lKVxubWFuYWdlci5nb1RvU2NlbmUoJ21haW4nKVxuIl19