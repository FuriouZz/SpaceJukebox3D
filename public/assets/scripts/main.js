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
    IS_SEARCHING: new Event('jukebox_is_searching'),
    WILL_PLAY: new Event('jukebox_will_play')
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
    TEXTURES_LOADED: new Event('cover_textures_loaded'),
    TRANSITION_ENDED: new Event('cover_transition_ended')
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
      lineForceUp: 1,
      interpolationTime: 150
    });
    this.group.add(this.eqlzr);
    this.equalizer = new SPACE.Equalizer({
      minLength: 0,
      maxLength: 50,
      radius: 300,
      color: 0xD1D1D1,
      absolute: false,
      lineForceDown: .5,
      lineForceUp: 1,
      interpolationTime: 150
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
    HELPER.trigger(EVENT.Jukebox.WILL_PLAY);
    return setTimeout((function(_this) {
      return function() {
        if (_this.playlist.length > 0) {
          return _this.setState(ENUM.JukeboxState.TRACK_STOPPED);
        } else {
          return _this.setState(ENUM.JukeboxState.IS_STOPPED);
        }
      };
    })(this), 1750);
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
    var data, i, j, len, ref1;
    ref1 = this.waveformData.mono;
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      data = ref1[i];
      data = 0;
      this.datas[i] = 0;
    }
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
      this.src1.stop(0);
      this.src1 = null;
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
    this.src1.start(this.ctx.currentTime, this.position);
    setTimeout((function(_this) {
      return function() {
        return _this.src.start(_this.ctx.currentTime - 0.15 * 0.5, _this.position);
      };
    })(this), 150);
    this.isPlaying = true;
    if (this.onplay) {
      return this.onplay();
    }
  };

  WebAudioAPI.prototype.stop = function() {
    if (this.src && this.src1) {
      this.src.stop();
      this.src.disconnect(0);
      this.src = null;
      this.src1.stop();
      this.src1.disconnect(0);
      this.src1 = null;
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
    this.analyser.connect(this.processor);
    this.processor.connect(this.ctx.destination);
    this.processor.onaudioprocess = this._onAudioProcess;
    this.processor.api = this;
    this._oldBrowser();
    this.volume(0);
    this.src1 = this.ctx.createBufferSource();
    this.src1.buffer = this.buffer;
    this.src1.connect(this.gainNode);
    return this.gainNode.connect(this.ctx.destination);
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
    this.src1.disconnect(0);
    this.src = null;
    this.src1 = null;
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

  Cover.prototype.tFade = 1;

  Cover.prototype.tScale = 1;

  function Cover() {
    this._textureLoaded = bind(this._textureLoaded, this);
    this._setupPlane = bind(this._setupPlane, this);
    this._eTrackIsPlaying = bind(this._eTrackIsPlaying, this);
    this._eTransitionEnded = bind(this._eTransitionEnded, this);
    this._eJukeboxWillPlay = bind(this._eJukeboxWillPlay, this);
    Cover.__super__.constructor.apply(this, arguments);
    this._setup();
    this._events();
  }

  Cover.prototype._events = function() {
    document.addEventListener(EVENT.Track.IS_PLAYING.type, this._eTrackIsPlaying);
    return document.addEventListener(EVENT.Jukebox.WILL_PLAY.type, this._eJukeboxWillPlay);
  };

  Cover.prototype._eJukeboxWillPlay = function(e) {
    return this.next();
  };

  Cover.prototype._eTransitionEnded = function(e) {
    return HELPER.trigger(EVENT.Cover.TRANSITION_ENDED);
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
        tFade: {
          type: 'f',
          value: 0
        },
        tScale: {
          type: 'f',
          value: 1
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
    this.tFade = 1;
    this.tScale = 1;
    this.plane.material.uniforms.tScale.value = this.tScale;
    this.plane.material.uniforms.tFade.value = this.tFade;
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

  return Cover;

})(THREE.Group);

manager = new SPACE.SceneManager();

manager.createScene('main', SPACE.MainScene);

manager.goToScene('main');

//# sourceMappingURL=data:application/json;base64,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QUUsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQTNCLENBQWlDLENBQUMsT0FBbEMsQ0FBMEM7QUFBQSxNQUFFLEtBQUEsRUFBTyxHQUFUO0tBQTFDLEVBQTBELEdBQTFELENBREEsQ0FBQTtXQUVBLFVBQUEsQ0FBVyxJQUFDLENBQUEsaUJBQVosRUFBK0IsR0FBL0IsRUFISTtFQUFBLENBclFOLENBQUE7O0FBQUEsa0JBMFFBLE1BQUEsR0FBUSxTQUFDLEtBQUQsR0FBQTtBQUNOLElBQUEsSUFBRyxJQUFDLENBQUEsS0FBSjthQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBL0IsSUFBd0MsS0FBQSxHQUFRLE1BRGxEO0tBRE07RUFBQSxDQTFRUixDQUFBOztlQUFBOztHQUZnQyxLQUFLLENBQUMsTUF2NER4QyxDQUFBOztBQUFBLE9BOHBFQSxHQUFjLElBQUEsS0FBSyxDQUFDLFlBQU4sQ0FBQSxDQTlwRWQsQ0FBQTs7QUFBQSxPQStwRU8sQ0FBQyxXQUFSLENBQW9CLE1BQXBCLEVBQTRCLEtBQUssQ0FBQyxTQUFsQyxDQS9wRUEsQ0FBQTs7QUFBQSxPQWdxRU8sQ0FBQyxTQUFSLENBQWtCLE1BQWxCLENBaHFFQSxDQUFBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cuU1BBQ0UgPSB3aW5kb3cuU1BBQ0UgfHwge31cblxuU1BBQ0UuRU5WID0gJ2RldmVsb3BtZW50J1xuXG4jIFBJWEkuSlNcblNQQUNFLkZQUyAgICAgICAgPSAzMFxuU1BBQ0UucGl4ZWxSYXRpbyA9ICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKVxuXG4jIFRIUkVFLkpTXG5TUEFDRS5USFJFRSA9IHt9XG5cbiMgU09VTkRDTE9VRFxuU1BBQ0UuU09VTkRDTE9VRCA9ICgtPlxuICBvYmplY3QgPSB7fVxuICBpZiBTUEFDRS5FTlYgPT0gJ2RldmVsb3BtZW50J1xuICAgIG9iamVjdC5pZCA9ICdkZTBiODUzOWI0YWQyZjZjYzIzZGZlMWNjNmUwNDM4ZCdcbiAgZWxzZVxuICAgIG9iamVjdC5pZCA9ICc4MDdkMjg1NzVjMzg0ZTYyYTU4YmU1YzNhMTQ0NmU2OCdcbiAgb2JqZWN0LnJlZGlyZWN0X3VyaSA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW5cbiAgcmV0dXJuIG9iamVjdFxuKSgpXG5cblxuIyBNRVRIT0RTXG5TUEFDRS5MT0cgICAgICAgID0gKGxvZywgc3R5bGVzPScnKS0+XG4gIHVubGVzcyAvKHByb2R8cHJvZHVjdGlvbikvLnRlc3QoU1BBQ0UuRU5WKVxuICAgICAgZGF0ZSAgICAgPSBuZXcgRGF0ZSgpXG4gICAgICB0aW1lU3RyICA9IGRhdGUudG9UaW1lU3RyaW5nKClcbiAgICAgIHRpbWVTdHIgID0gdGltZVN0ci5zdWJzdHIoMCwgOClcbiAgICAgIGRhdGVTdHIgID0gZGF0ZS5nZXREYXRlKCkgKyAnLydcbiAgICAgIGRhdGVTdHIgKz0gKGRhdGUuZ2V0TW9udGgoKSsxKSArICcvJ1xuICAgICAgZGF0ZVN0ciArPSBkYXRlLmdldEZ1bGxZZWFyKClcbiAgICAgIGNvbnNvbGUubG9nKGRhdGVTdHIrJyAtICcrdGltZVN0cisnIHwgJytsb2csIHN0eWxlcylcblxuU1BBQ0UuVE9ETyAgICAgICA9IChtZXNzYWdlKS0+XG4gIFNQQUNFLkxPRygnJWNUT0RPIHwgJyArIG1lc3NhZ2UsICdjb2xvcjogIzAwODhGRicpXG5cbiMgRU5WSVJPTk1FTlRTXG5TUEFDRS5ERUZBVUxUID0ge31cblxuXG53aW5kb3cuRVZFTlQgPVxuICBKdWtlYm94OlxuICAgIFRSQUNLX09OX0FERDogICAgICAgbmV3IEV2ZW50KCdqdWtlYm94X3RyYWNrX29uX2FkZCcpXG4gICAgVFJBQ0tfT05fQUREX0VSUk9SOiBuZXcgRXZlbnQoJ2p1a2Vib3hfdHJhY2tfb25fYWRkX2Vycm9yJylcbiAgICBUUkFDS19BRERFRDogICAgICAgIG5ldyBFdmVudCgnanVrZWJveF90cmFja19hZGRlZCcpXG4gICAgT05fUExBWTogICAgICAgICAgICBuZXcgRXZlbnQoJ2p1a2Vib3hfb25fcGxheScpXG4gICAgT05fU1RPUDogICAgICAgICAgICBuZXcgRXZlbnQoJ2p1a2Vib3hfb25fc3RvcCcpXG4gICAgSVNfUExBWUlORzogICAgICAgICBuZXcgRXZlbnQoJ2p1a2Vib3hfaXNfcGxheWluZycpXG4gICAgSVNfU1RPUFBFRDogICAgICAgICBuZXcgRXZlbnQoJ2p1a2Vib3hfaXNfc3RvcHBlZCcpXG4gICAgSVNfU0VBUkNISU5HOiAgICAgICBuZXcgRXZlbnQoJ2p1a2Vib3hfaXNfc2VhcmNoaW5nJylcbiAgICBXSUxMX1BMQVk6ICAgICAgICAgIG5ldyBFdmVudCgnanVrZWJveF93aWxsX3BsYXknKVxuICBUcmFjazpcbiAgICBJU19QTEFZSU5HOiBuZXcgRXZlbnQoJ3RyYWNrX2lzX3BsYXlpbmcnKVxuICAgIElTX1BBVVNFRDogIG5ldyBFdmVudCgndHJhY2tfaXNfcGF1c2VkJylcbiAgICBJU19TVE9QUEVEOiBuZXcgRXZlbnQoJ3RyYWNrX2lzX3N0b3BwZWQnKVxuICBTb3VuZENsb3VkOlxuICAgIElTX0NPTk5FQ1RFRDogbmV3IEV2ZW50KCdzb3VuZGNsb3VkX2Nvbm5lY3RlZCcpXG4gIENvdmVyOlxuICAgIFRFWFRVUkVTX0xPQURFRDogIG5ldyBFdmVudCgnY292ZXJfdGV4dHVyZXNfbG9hZGVkJylcbiAgICBUUkFOU0lUSU9OX0VOREVEOiBuZXcgRXZlbnQoJ2NvdmVyX3RyYW5zaXRpb25fZW5kZWQnKVxuT2JqZWN0LmZyZWV6ZShFVkVOVClcblxuXG53aW5kb3cuRU5VTSA9XG4gIEtleWJvYXJkOlxuICAgIEVOVEVSOiAxM1xuICAgIFVQOiAzOFxuICAgIERPV046IDQwXG4gICAgRVNDOiAyN1xuICAgIERFTEVURTogNDZcbiAgU3BhY2VzaGlwU3RhdGU6XG4gICAgSURMRTogJ3NwYWNlc2hpcHN0YXRlX2lkbGUnXG4gICAgTEFVTkNIRUQ6ICdzcGFjZXNoaXBzdGF0ZV9sYXVuY2hlZCdcbiAgICBJTl9MT09QOiAnc3BhY2VzaGlwc3RhdGVfaW5sb29wJ1xuICAgIEFSUklWRUQ6ICdzcGFjZXNoaXBzdGF0ZV9hcnJpdmVkJ1xuICBTZWFyY2hFbmdpbmVTdGF0ZTpcbiAgICBPUEVORUQ6ICdzZWFyY2hlbmdpbmVzdGF0ZV9vcGVuZWQnXG4gICAgQ0xPU0VEOiAnc2VhcmNoZW5naW5lc3RhdGVfY2xvc2VkJ1xuICAgIFNFQVJDSDogJ3NlYXJjaGVuZ2luZXN0YXRlX3NlYXJjaCdcbiAgICBUUkFDS19TRUxFQ1RFRDogJ3NlYXJjaGVuZ2luZXN0YXRlX3RyYWNrc2VsZWN0ZWQnXG4gIEp1a2Vib3hTdGF0ZTpcbiAgICBJU19QTEFZSU5HOiAnanVrZWJveHN0YXRlX2lzcGxheWluZydcbiAgICBJU19TVE9QUEVEOiAnanVrZWJveHN0YXRlX2lzc3RvcHBlZCdcbiAgICBUUkFDS19TVE9QUEVEOiAnanVrZWJveHN0YXRlX3RyYWNrc3RvcHBlZCdcbiAgQWlycG9ydFN0YXRlOlxuICAgIElETEU6ICdhaXJwb3J0c3RhdGVfaWRsZSdcbiAgICBTRU5ESU5HOiAnYWlycG9ydHN0YXRlX3NlbmRpbmcnXG5PYmplY3QuZnJlZXplKEVOVU0pXG5cblxud2luZG93LkhFTFBFUiA9IHdpbmRvdy5IRUxQRVIgfHxcbiAgdHJpZ2dlcjogKGUsIG9iamVjdCktPlxuICAgIGUub2JqZWN0ID0gb2JqZWN0XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChlKVxuXG4gIHJldGluYTogKHZhbHVlKS0+XG4gICAgaWYgdHlwZW9mIHZhbHVlIGlzICdvYmplY3QnXG4gICAgICBvYmplY3QgPSB2YWx1ZVxuICAgICAgbyA9IHt9XG4gICAgICBmb3Iga2V5IG9mIG9iamVjdFxuICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldXG4gICAgICAgIGlmIHR5cGVvZiB2YWx1ZSBpcyAnbnVtYmVyJ1xuICAgICAgICAgIG9ba2V5XSA9IHZhbHVlICogd2luZG93LmRldmljZVBpeGVsUmF0aW9cbiAgICAgIHJldHVybiBAbWVyZ2Uob2JqZWN0LCBvKVxuICAgIGVsc2UgaWYgdHlwZW9mIHZhbHVlIGlzICdhcnJheSdcbiAgICAgIGFycmF5ID0gdmFsdWVcbiAgICAgIGEgPSBbXVxuICAgICAgZm9yIHZhbHVlLCBrZXkgaW4gYXJyYXlcbiAgICAgICAgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICAgICAgYS5wdXNoKHZhbHVlICogd2luZG93LmRldmljZVBpeGVsUmF0aW8pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhLnB1c2godmFsdWUpXG4gICAgICByZXR1cm4gYVxuICAgIGVsc2UgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICByZXR1cm4gdmFsdWUgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb1xuICAgIHJldHVybiBmYWxzZVxuXG5cbkhFTFBFUi5Db2ZmZWUgPVxuICAjIEFycmF5XG4gIHNodWZmbGU6IChhcnJheSktPlxuICAgIHRtcFxuICAgIGN1cnIgPSBhcnJheS5sZW5ndGhcbiAgICB3aGlsZSAwICE9IGN1cnJcbiAgICAgIHJhbmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyKVxuICAgICAgY3VyciAtPSAxXG4gICAgICB0bXAgICAgICAgICA9IGFycmF5W2N1cnJdXG4gICAgICBhcnJheVtjdXJyXSA9IGFycmF5W3JhbmRdXG4gICAgICBhcnJheVtyYW5kXSA9IHRtcFxuICAgIHJldHVybiBhcnJheVxuXG4gICMgT2JqZWN0XG4gIG1lcmdlOiAob3B0aW9ucywgb3ZlcnJpZGVzKSAtPlxuICAgIEBleHRlbmQgKEBleHRlbmQge30sIG9wdGlvbnMpLCBvdmVycmlkZXNcblxuICBleHRlbmQ6IChvYmplY3QsIHByb3BlcnRpZXMpIC0+XG4gICAgZm9yIGtleSwgdmFsIG9mIHByb3BlcnRpZXNcbiAgICAgIG9iamVjdFtrZXldID0gdmFsXG4gICAgb2JqZWN0XG5cblxuSEVMUEVSLk1hdGggPVxuICBhbmdsZUJldHdlZW5Qb2ludHM6IChmaXJzdCwgc2Vjb25kKSAtPlxuICAgIGhlaWdodCA9IHNlY29uZC55IC0gZmlyc3QueVxuICAgIHdpZHRoICA9IHNlY29uZC54IC0gZmlyc3QueFxuICAgIHJldHVybiBNYXRoLmF0YW4yKGhlaWdodCwgd2lkdGgpXG5cbiAgZGlzdGFuY2U6IChwb2ludDEsIHBvaW50MikgLT5cbiAgICB4ID0gcG9pbnQxLnggLSBwb2ludDIueFxuICAgIHkgPSBwb2ludDEueSAtIHBvaW50Mi55XG4gICAgZCA9IHggKiB4ICsgeSAqIHlcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGQpXG5cbiAgY29sbGlzaW9uOiAoZG90MSwgZG90MiktPlxuICAgIHIxID0gaWYgZG90MS5yYWRpdXMgdGhlbiBkb3QxLnJhZGl1cyBlbHNlIDBcbiAgICByMiA9IGlmIGRvdDIucmFkaXVzIHRoZW4gZG90Mi5yYWRpdXMgZWxzZSAwXG4gICAgZGlzdCA9IHIxICsgcjJcblxuICAgIHJldHVybiBAZGlzdGFuY2UoZG90MS5wb3NpdGlvbiwgZG90Mi5wb3NpdGlvbikgPD0gTWF0aC5zcXJ0KGRpc3QgKiBkaXN0KVxuXG4gIG1hcDogKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIC0+XG4gICAgcmV0dXJuIGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSlcblxuICAjIEhlcm1pdGUgQ3VydmVcbiAgaGVybWl0ZTogKHkwLCB5MSwgeTIsIHkzLCBtdSwgdGVuc2lvbiwgYmlhcyktPlxuICAgIGBcbiAgICB2YXIgbTAsbTEsbXUyLG11MztcbiAgICB2YXIgYTAsYTEsYTIsYTM7XG5cbiAgICBtdTIgPSBtdSAqIG11O1xuICAgIG11MyA9IG11MiAqIG11O1xuICAgIG0wICA9ICh5MS15MCkqKDErYmlhcykqKDEtdGVuc2lvbikvMjtcbiAgICBtMCArPSAoeTIteTEpKigxLWJpYXMpKigxLXRlbnNpb24pLzI7XG4gICAgbTEgID0gKHkyLXkxKSooMStiaWFzKSooMS10ZW5zaW9uKS8yO1xuICAgIG0xICs9ICh5My15MikqKDEtYmlhcykqKDEtdGVuc2lvbikvMjtcbiAgICBhMCA9ICAyKm11MyAtIDMqbXUyICsgMTtcbiAgICBhMSA9ICAgIG11MyAtIDIqbXUyICsgbXU7XG4gICAgYTIgPSAgICBtdTMgLSAgIG11MjtcbiAgICBhMyA9IC0yKm11MyArIDMqbXUyO1xuICAgIGBcbiAgICByZXR1cm4oYTAqeTErYTEqbTArYTIqbTErYTMqeTIpXG5cblxuSEVMUEVSLlRIUkVFID1cbiAgSGVybWl0ZUN1cnZlOiAocHRzKS0+XG4gICAgcGF0aCA9IG5ldyBUSFJFRS5DdXJ2ZVBhdGgoKVxuICAgIHBhdGguYWRkKG5ldyBUSFJFRS5IZXJtaXRlQmV6aWVyQ3VydmUzKHB0c1swXSwgcHRzWzBdLCBwdHNbMV0sIHB0c1syXSkpXG4gICAgZm9yIGkgaW4gWzAuLihwdHMubGVuZ3RoLTQpXVxuICAgICAgcGF0aC5hZGQobmV3IFRIUkVFLkhlcm1pdGVCZXppZXJDdXJ2ZTMocHRzW2ldLCBwdHNbaSsxXSwgcHRzW2krMl0sIHB0c1tpKzNdKSlcbiAgICBwYXRoLmFkZChuZXcgVEhSRUUuSGVybWl0ZUJlemllckN1cnZlMyhwdHNbcHRzLmxlbmd0aC0zXSwgcHRzW3B0cy5sZW5ndGgtMl0sIHB0c1twdHMubGVuZ3RoLTFdLCBwdHNbcHRzLmxlbmd0aC0xXSkpXG4gICAgcmV0dXJuIHBhdGhcblxuVEhSRUUuQ3VydmUuVXRpbHMudGFuZ2VudEhlcm1pdGVCZXppZXIgPSAoIHkwLCB5MSwgeTIsIHkzLCBtdSwgdGVuc2lvbiwgYmlhcyApLT5cbiAgICBtdTIgPSBtdSAqIG11XG4gICAgbXUzID0gbXUyICogbXVcblxuICAgIG0wICA9ICh5MS15MCkqKDErYmlhcykqKDEtdGVuc2lvbikvMlxuICAgIG0wICArPSAoeTIteTEpKigxLWJpYXMpKigxLXRlbnNpb24pLzJcblxuICAgIG0xICA9ICh5Mi15MSkqKDErYmlhcykqKDEtdGVuc2lvbikvMlxuICAgIG0xICArPSAoeTMteTIpKigxLWJpYXMpKigxLXRlbnNpb24pLzJcblxuICAgIGEwICA9ICAyKm11MyAtIDMqbXUyICsgMVxuICAgIGExICA9ICAgIG11MyAtIDIqbXUyICsgbXVcbiAgICBhMiAgPSAgICBtdTMgLSAgIG11MlxuICAgIGEzICA9IC0yKm11MyArIDMqbXUyXG5cbiAgICByZXR1cm4oYTAqeTErYTEqbTArYTIqbTErYTMqeTIpXG5cblRIUkVFLkhlcm1pdGVCZXppZXJDdXJ2ZTMgPSBUSFJFRS5DdXJ2ZS5jcmVhdGUoXG4gICh2MCwgdjEsIHYyLCB2MyktPlxuICAgIEB2MCA9IHYwXG4gICAgQHYxID0gdjFcbiAgICBAdjIgPSB2MlxuICAgIEB2MyA9IHYzXG4gICAgcmV0dXJuXG4gICwgKHQpLT5cbiAgICB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgdmVjdG9yLnggPSBUSFJFRS5DdXJ2ZS5VdGlscy50YW5nZW50SGVybWl0ZUJlemllcihAdjAueCwgQHYxLngsIEB2Mi54LCBAdjMueCwgdCwgMCwgMClcbiAgICB2ZWN0b3IueSA9IFRIUkVFLkN1cnZlLlV0aWxzLnRhbmdlbnRIZXJtaXRlQmV6aWVyKEB2MC55LCBAdjEueSwgQHYyLnksIEB2My55LCB0LCAwLCAwKVxuICAgIHZlY3Rvci56ID0gVEhSRUUuQ3VydmUuVXRpbHMudGFuZ2VudEhlcm1pdGVCZXppZXIoQHYwLnosIEB2MS56LCBAdjIueiwgQHYzLnosIHQsIDAsIDApXG4gICAgcmV0dXJuIHZlY3RvclxuKVxuXG5USFJFRS5Jbkxvb3BDdXJ2ZSA9IFRIUkVFLkN1cnZlLmNyZWF0ZShcbiAgKHYwLCBzdGFydEFuZ2xlPTAsIG1heFJhZGl1cz0xMDAsIG1pblJhZGl1cz0wLCBpbnZlcnNlPWZhbHNlLCB1c2VHb2xkZW49ZmFsc2UpLT5cbiAgICBAdjAgICAgICAgICA9IHYwXG4gICAgQGludmVyc2UgICAgPSBpbnZlcnNlXG4gICAgQHN0YXJ0QW5nbGUgPSBzdGFydEFuZ2xlXG5cbiAgICBAbWF4UmFkaXVzICA9IG1heFJhZGl1c1xuICAgIEBtaW5SYWRpdXMgID0gbWluUmFkaXVzXG4gICAgQHJhZGl1cyAgICAgPSBAbWF4UmFkaXVzIC0gQG1pblJhZGl1c1xuXG4gICAgQHVzZUdvbGRlbiAgPSB1c2VHb2xkZW5cblxuICAgIHJldHVyblxuICAsICh0KS0+XG4gICAgdCAgICAgPSAxIC0gdCBpZiBAaW52ZXJzZVxuICAgIGlmIEB1c2VHb2xkZW5cbiAgICAgICAgcGhpICAgPSAoTWF0aC5zcXJ0KDUpKzEpLzIgLSAxXG4gICAgICAgIGdvbGRlbl9hbmdsZSA9IHBoaSAqIE1hdGguUEkgKiAyXG4gICAgICAgIGFuZ2xlID0gQHN0YXJ0QW5nbGUgKyAoZ29sZGVuX2FuZ2xlICogdClcbiAgICAgICAgYW5nbGUgKz0gTWF0aC5QSSAqIC0xLjIzNVxuICAgIGVsc2VcbiAgICAgICAgYW5nbGUgPSBAc3RhcnRBbmdsZSArIChNYXRoLlBJICogMiAqIHQpXG5cbiAgICB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgdmVjdG9yLnggPSBAdjAueCArIE1hdGguY29zKGFuZ2xlKSAqIChAbWluUmFkaXVzICsgQHJhZGl1cyAqIHQpXG4gICAgdmVjdG9yLnkgPSBAdjAueSArIE1hdGguc2luKGFuZ2xlKSAqIChAbWluUmFkaXVzICsgQHJhZGl1cyAqIHQpXG4gICAgdmVjdG9yLnogPSBAdjAuelxuICAgIHJldHVybiB2ZWN0b3JcbilcblxuVEhSRUUuTGF1bmNoZWRDdXJ2ZSA9IFRIUkVFLkN1cnZlLmNyZWF0ZShcbiAgKHYwLCB2MSwgbmJMb29wPTIpLT5cbiAgICBAdjAgICA9IHYwXG4gICAgQHYxICAgPSB2MVxuICAgIEBuYkxvb3AgPSBuYkxvb3BcbiAgICByZXR1cm5cbiAgLCAodCktPlxuICAgIGFuZ2xlID0gTWF0aC5QSSAqIDIgKiB0ICogQG5iTG9vcFxuXG4gICAgZCA9IEB2MS56IC0gQHYwLnpcblxuICAgIGRpc3QgPSBAdjEuY2xvbmUoKS5zdWIoQHYwKVxuXG4gICAgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIHZlY3Rvci54ID0gQHYwLnggKyBkaXN0LnggKiB0XG4gICAgdmVjdG9yLnkgPSBAdjAueSArIGRpc3QueSAqIHRcbiAgICB2ZWN0b3IueiA9IEB2MC56ICsgZGlzdC56ICogdFxuXG4gICAgdCA9IE1hdGgubWluKHQsIDEgLSB0KSAvIC41XG5cbiAgICB2ZWN0b3IueCArPSBNYXRoLmNvcyhhbmdsZSkgKiAoNTAgKiB0KVxuICAgIHZlY3Rvci55ICs9IE1hdGguc2luKGFuZ2xlKSAqICg1MCAqIHQpXG5cbiAgICByZXR1cm4gdmVjdG9yXG4pXG5cblxuSEVMUEVSLkVhc2luZyA9XG5cbiAgI1xuICAjICBFYXNpbmcgZnVuY3Rpb24gaW5zcGlyZWQgZnJvbSBBSEVhc2luZ1xuICAjICBodHRwczovL2dpdGh1Yi5jb20vd2FycmVubS9BSEVhc2luZ1xuICAjXG5cbiAgIyMgTW9kZWxlZCBhZnRlciB0aGUgbGluZSB5ID0geFxuICBsaW5lYXI6IChwKS0+XG4gICAgcmV0dXJuIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBhcmFib2xhIHkgPSB4XjJcbiAgUXVhZHJhdGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcFxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGFyYWJvbGEgeSA9IC14XjIgKyAyeFxuICBRdWFkcmF0aWNFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiAtKHAgKiAocCAtIDIpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIHF1YWRyYXRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjIpICAgICAgICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gLSgxLzIpKCgyeC0xKSooMngtMykgLSAxKSA7IFswLjUsIDFdXG4gIFF1YWRyYXRpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDIgKiBwICogcFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoLTIgKiBwICogcCkgKyAoNCAqIHApIC0gMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgY3ViaWMgeSA9IHheM1xuICBDdWJpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBjdWJpYyB5ID0gKHggLSAxKV4zICsgMVxuICBDdWJpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSlcbiAgICByZXR1cm4gZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIGN1YmljXG4gICMgeSA9ICgxLzIpKCgyeCleMykgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKSgoMngtMileMyArIDIpIDsgWzAuNSwgMV1cbiAgQ3ViaWNFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiA0ICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9ICgoMiAqIHApIC0gMilcbiAgICAgIHJldHVybiAwLjUgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHheNFxuICBRdWFydGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHkgPSAxIC0gKHggLSAxKV40XG4gIFF1YXJ0aWNFYXNlT3V0OiAocCktPlxuICAgIGYgPSAocCAtIDEpXG4gICAgcmV0dXJuIGYgKiBmICogZiAqICgxIC0gcCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgcXVhcnRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjQpICAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9IC0oMS8yKSgoMngtMileNCAtIDIpIDsgWzAuNSwgMV1cbiAgUXVhcnRpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDggKiBwICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9IChwIC0gMSlcbiAgICAgIHJldHVybiAtOCAqIGYgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWludGljIHkgPSB4XjVcbiAgUXVpbnRpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwICogcCAqIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1aW50aWMgeSA9ICh4IC0gMSleNSArIDFcbiAgUXVpbnRpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSk7XG4gICAgcmV0dXJuIGYgKiBmICogZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIHF1aW50aWNcbiAgIyB5ID0gKDEvMikoKDJ4KV41KSAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKCgyeC0yKV41ICsgMikgOyBbMC41LCAxXVxuICBRdWludGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMTYgKiBwICogcCAqIHAgKiBwICogcFxuICAgIGVsc2VcbiAgICAgIGYgPSAoKDIgKiBwKSAtIDIpXG4gICAgICByZXR1cm4gIDAuNSAqIGYgKiBmICogZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciBxdWFydGVyLWN5Y2xlIG9mIHNpbmUgd2F2ZVxuICBTaW5lRWFzZUluOiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigocCAtIDEpICogTWF0aC5QSSAqIDIpICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciBxdWFydGVyLWN5Y2xlIG9mIHNpbmUgd2F2ZSAoZGlmZmVyZW50IHBoYXNlKVxuICBTaW5lRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gTWF0aC5zaW4ocCAqIE1hdGguUEkgKiAyKVxuXG4gICMgTW9kZWxlZCBhZnRlciBoYWxmIHNpbmUgd2F2ZVxuICBTaW5lRWFzZUluT3V0OiAocCktPlxuICAgIHJldHVybiAwLjUgKiAoMSAtIE1hdGguY29zKHAgKiBNYXRoLlBJKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgc2hpZnRlZCBxdWFkcmFudCBJViBvZiB1bml0IGNpcmNsZVxuICBDaXJjdWxhckVhc2VJbjogKHApLT5cbiAgICByZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gKHAgKiBwKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgc2hpZnRlZCBxdWFkcmFudCBJSSBvZiB1bml0IGNpcmNsZVxuICBDaXJjdWxhckVhc2VPdXQ6IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc3FydCgoMiAtIHApICogcCk7XG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgY2lyY3VsYXIgZnVuY3Rpb25cbiAgIyB5ID0gKDEvMikoMSAtIHNxcnQoMSAtIDR4XjIpKSAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKShzcXJ0KC0oMnggLSAzKSooMnggLSAxKSkgKyAxKSA7IFswLjUsIDFdXG4gIENpcmN1bGFyRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogKDEgLSBNYXRoLnNxcnQoMSAtIDQgKiAocCAqIHApKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMC41ICogKE1hdGguc3FydCgtKCgyICogcCkgLSAzKSAqICgoMiAqIHApIC0gMSkpICsgMSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGV4cG9uZW50aWFsIGZ1bmN0aW9uIHkgPSAyXigxMCh4IC0gMSkpXG4gIEV4cG9uZW50aWFsRWFzZUluOiAocCktPlxuICAgIHJldHVybiBpZiAocCA9PSAwLjApIHRoZW4gcCBlbHNlIE1hdGgucG93KDIsIDEwICogKHAgLSAxKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGV4cG9uZW50aWFsIGZ1bmN0aW9uIHkgPSAtMl4oLTEweCkgKyAxXG4gIEV4cG9uZW50aWFsRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gaWYgKHAgPT0gMS4wKSB0aGVuIHAgZWxzZSAxIC0gTWF0aC5wb3coMiwgLTEwICogcClcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBleHBvbmVudGlhbFxuICAjIHkgPSAoMS8yKTJeKDEwKDJ4IC0gMSkpICAgICAgICAgOyBbMCwwLjUpXG4gICMgeSA9IC0oMS8yKSoyXigtMTAoMnggLSAxKSkpICsgMSA7IFswLjUsMV1cbiAgRXhwb25lbnRpYWxFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA9PSAwLjAgfHwgcCA9PSAxLjApXG4gICAgICByZXR1cm4gcFxuXG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiBNYXRoLnBvdygyLCAoMjAgKiBwKSAtIDEwKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAtMC41ICogTWF0aC5wb3coMiwgKC0yMCAqIHApICsgMTApICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgZGFtcGVkIHNpbmUgd2F2ZSB5ID0gc2luKDEzcGkvMip4KSpwb3coMiwgMTAgKiAoeCAtIDEpKVxuICBFbGFzdGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigxMyAqIE1hdGguUEkgKiAyICogcCkgKiBNYXRoLnBvdygyLCAxMCAqIChwIC0gMSkpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBkYW1wZWQgc2luZSB3YXZlIHkgPSBzaW4oLTEzcGkvMiooeCArIDEpKSpwb3coMiwgLTEweCkgKyAxXG4gIEVsYXN0aWNFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbigtMTMgKiBNYXRoLlBJICogMiAqIChwICsgMSkpICogTWF0aC5wb3coMiwgLTEwICogcCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgZXhwb25lbnRpYWxseS1kYW1wZWQgc2luZSB3YXZlOlxuICAjIHkgPSAoMS8yKSpzaW4oMTNwaS8yKigyKngpKSpwb3coMiwgMTAgKiAoKDIqeCkgLSAxKSkgICAgICA7IFswLDAuNSlcbiAgIyB5ID0gKDEvMikqKHNpbigtMTNwaS8yKigoMngtMSkrMSkpKnBvdygyLC0xMCgyKngtMSkpICsgMikgOyBbMC41LCAxXVxuICBFbGFzdGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogTWF0aC5zaW4oMTMgKiBNYXRoLlBJICogMiAqICgyICogcCkpICogTWF0aC5wb3coMiwgMTAgKiAoKDIgKiBwKSAtIDEpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5zaW4oLTEzICogTWF0aC5QSSAqIDIgKiAoKDIgKiBwIC0gMSkgKyAxKSkgKiBNYXRoLnBvdygyLCAtMTAgKiAoMiAqIHAgLSAxKSkgKyAyKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgb3ZlcnNob290aW5nIGN1YmljIHkgPSB4XjMteCpzaW4oeCpwaSlcbiAgQmFja0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwIC0gcCAqIE1hdGguc2luKHAgKiBNYXRoLlBJKVxuXG4gICMgTW9kZWxlZCBhZnRlciBvdmVyc2hvb3RpbmcgY3ViaWMgeSA9IDEtKCgxLXgpXjMtKDEteCkqc2luKCgxLXgpKnBpKSlcbiAgQmFja0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9ICgxIC0gcClcbiAgICByZXR1cm4gMSAtIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIG92ZXJzaG9vdGluZyBjdWJpYyBmdW5jdGlvbjpcbiAgIyB5ID0gKDEvMikqKCgyeCleMy0oMngpKnNpbigyKngqcGkpKSAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKSooMS0oKDEteCleMy0oMS14KSpzaW4oKDEteCkqcGkpKSsxKSA7IFswLjUsIDFdXG4gIEJhY2tFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIGYgPSAyICogcFxuICAgICAgcmV0dXJuIDAuNSAqIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKVxuICAgIGVsc2VcbiAgICAgIGYgPSAoMSAtICgyKnAgLSAxKSlcbiAgICAgIHJldHVybiAwLjUgKiAoMSAtIChmICogZiAqIGYgLSBmICogTWF0aC5zaW4oZiAqIE1hdGguUEkpKSkgKyAwLjVcblxuICBCb3VuY2VFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIDEgLSBAQm91bmNlRWFzZU91dCgxIC0gcCk7XG5cbiAgQm91bmNlRWFzZU91dDogKHApLT5cbiAgICBpZihwIDwgNC8xMS4wKVxuICAgICAgcmV0dXJuICgxMjEgKiBwICogcCkvMTYuMFxuICAgIGVsc2UgaWYocCA8IDgvMTEuMClcbiAgICAgIHJldHVybiAoMzYzLzQwLjAgKiBwICogcCkgLSAoOTkvMTAuMCAqIHApICsgMTcvNS4wXG4gICAgZWxzZSBpZihwIDwgOS8xMC4wKVxuICAgICAgcmV0dXJuICg0MzU2LzM2MS4wICogcCAqIHApIC0gKDM1NDQyLzE4MDUuMCAqIHApICsgMTYwNjEvMTgwNS4wXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICg1NC81LjAgKiBwICogcCkgLSAoNTEzLzI1LjAgKiBwKSArIDI2OC8yNS4wXG5cbiAgQm91bmNlRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogQEJvdW5jZUVhc2VJbihwKjIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIDAuNSAqIEBCb3VuY2VFYXNlT3V0KHAgKiAyIC0gMSkgKyAwLjVcblxuXG5jbGFzcyBTUEFDRS5TY2VuZSBleHRlbmRzIFRIUkVFLlNjZW5lXG4gICMgcGF1c2VkOiBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyXG5cbiAgICBAdHlwZSAgICAgICAgICAgICA9ICdTY2VuZSdcbiAgICBAZm9nICAgICAgICAgICAgICA9IG51bGxcbiAgICBAb3ZlcnJpZGVNYXRlcmlhbCA9IG51bGxcbiAgICBAYXV0b1VwZGF0ZSAgICAgICA9IHRydWVcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cbiAgICAgIEB1cGRhdGVPYmooY2hpbGQsIGRlbHRhKVxuXG4gIHVwZGF0ZU9iajogKG9iaiwgZGVsdGEpLT5cbiAgICBvYmoudXBkYXRlKGRlbHRhKSBpZiB0eXBlb2Ygb2JqLnVwZGF0ZSA9PSAnZnVuY3Rpb24nXG4gICAgaWYgb2JqLmhhc093blByb3BlcnR5KCdjaGlsZHJlbicpIGFuZCBvYmouY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgICAgZm9yIGNoaWxkIGluIG9iai5jaGlsZHJlblxuICAgICAgICBAdXBkYXRlT2JqKGNoaWxkLCBkZWx0YSlcblxuICByZXNpemU6ID0+XG4gICAgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuICAgICAgQHJlc2l6ZU9iaihjaGlsZClcblxuICByZXNpemVPYmo6IChvYmopLT5cbiAgICBvYmoucmVzaXplKCkgaWYgdHlwZW9mIG9iai5yZXNpemUgPT0gJ2Z1bmN0aW9uJ1xuICAgIGlmIG9iai5oYXNPd25Qcm9wZXJ0eSgnY2hpbGRyZW4nKSBhbmQgb2JqLmNoaWxkcmVuLmxlbmd0aCA+IDBcbiAgICAgIGZvciBjaGlsZCBpbiBvYmouY2hpbGRyZW5cbiAgICAgICAgQHJlc2l6ZU9iaihjaGlsZClcblxuICByZXN1bWU6IC0+XG4gICAgQHBhdXNlZCA9IGZhbHNlXG5cbiAgcGF1c2U6IC0+XG4gICAgQHBhdXNlZCA9IHRydWVcblxuICBpc1BhdXNlZDogLT5cbiAgICByZXR1cm4gQHBhdXNlZFxuXG5cbmNsYXNzIFNQQUNFLlNjZW5lTWFuYWdlclxuXG4gIGN1cnJlbnRTY2VuZTogbnVsbFxuICBfc2NlbmVzOiBudWxsXG4gIF9zdGF0czogbnVsbFxuICBfY2xvY2s6IG51bGxcbiAgX3RpY2s6IDBcblxuICByZW5kZXJlcjogbnVsbFxuICBjYW1lcmE6ICAgbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAod2lkdGgsIGhlaWdodCktPlxuICAgIGlmIChAcmVuZGVyZXIpIHRoZW4gcmV0dXJuIEBcblxuICAgIEBfY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKVxuXG4gICAgQF9zY2VuZXMgICA9IFtdXG5cbiAgICBAY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKVxuICAgIEBjYW1lcmEucG9zaXRpb24uc2V0Wig2MDApXG4gICAgIyBAY2FtZXJhLnBvc2l0aW9uLnNldFkoNTAwKVxuICAgICMgQGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpXG5cbiAgICBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7YW50aWFsaWFzOiB0cnVlLCBhbHBoYTogZmFsc2V9KVxuICAgICMgQHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pXG4gICAgIyBAcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg1OGIxZmYpKVxuICAgIEByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgIyBAcmVuZGVyZXIuc2hhZG93TWFwRW5hYmxlZCA9IHRydWVcbiAgICAjIEByZW5kZXJlci5zaGFkb3dNYXBTb2Z0ICAgID0gdHJ1ZVxuICAgICMgQHJlbmRlcmVyLnNoYWRvd01hcFR5cGUgICAgPSBUSFJFRS5QQ0ZTaGFkb3dNYXBcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpLmFwcGVuZENoaWxkKEByZW5kZXJlci5kb21FbGVtZW50KVxuXG4gICAgQF9zZXR1cFN0YXRzKCkgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcblxuICAgIEBfcmVuZGVyKClcbiAgICBAX3VwZGF0ZSgpXG5cbiAgICB3aW5kb3cub25yZXNpemUgPSA9PlxuICAgICAgQHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiAgICAgIEBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgIEBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG5cbiAgX3NldHVwU3RhdHM6IC0+XG4gICAgQF9zdGF0cyA9IG5ldyBTdGF0cygpXG4gICAgQF9zdGF0cy5zZXRNb2RlKDApXG4gICAgQF9zdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgIEBfc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCdcbiAgICBAX3N0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBAX3N0YXRzLmRvbUVsZW1lbnQgKVxuXG4gIF9yZW5kZXI6ID0+XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShAX3JlbmRlcilcblxuICAgIGlmICFAY3VycmVudFNjZW5lIG9yIEBjdXJyZW50U2NlbmUuaXNQYXVzZWQoKVxuICAgICAgICByZXR1cm5cblxuICAgICMgYyA9IERhdGUubm93KClcbiAgICBAY3VycmVudFNjZW5lLnVwZGF0ZShAX2Nsb2NrLmdldERlbHRhKCkgKiAxMDAwKVxuICAgICMgQGN1cnJlbnRTY2VuZS51cGRhdGUoYyAtIEBfdGljayk7XG4gICAgIyBAX3RpY2sgPSBjXG5cbiAgICBAcmVuZGVyZXIucmVuZGVyKCBAY3VycmVudFNjZW5lLCBAY2FtZXJhIClcblxuICAgIEBfc3RhdHMudXBkYXRlKCkgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcblxuICBfdXBkYXRlOiA9PlxuICAgICMgc2V0VGltZW91dChAX3VwZGF0ZSwgMTAwMCAvIFNQQUNFLkZQUylcblxuICAgICMgaWYgIUBjdXJyZW50U2NlbmUgb3IgQGN1cnJlbnRTY2VuZS5pc1BhdXNlZCgpXG4gICAgIyAgICAgcmV0dXJuXG5cbiAgICAjIGMgPSBEYXRlLm5vdygpXG4gICAgIyAjIEBjdXJyZW50U2NlbmUudXBkYXRlKEBfY2xvY2suZ2V0RGVsdGEoKSlcbiAgICAjIEBjdXJyZW50U2NlbmUudXBkYXRlKGMgLSBAX3RpY2spO1xuICAgICMgY29uc29sZS5sb2cgYyAtIEBfdGlja1xuICAgICMgQF90aWNrID0gY1xuXG4gIGNyZWF0ZVNjZW5lOiAoaWRlbnRpZmllciwgYVNjZW5lLCBpbnRlcmFjdGl2ZSktPlxuICAgIGlmIEBfc2NlbmVzW2lkZW50aWZpZXJdXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgIHNjZW5lID0gbmV3IGFTY2VuZSgpXG4gICAgQF9zY2VuZXNbaWRlbnRpZmllcl0gPSBzY2VuZVxuXG4gICAgcmV0dXJuIHNjZW5lXG5cbiAgZ29Ub1NjZW5lOiAoaWRlbnRpZmllciktPlxuICAgICQod2luZG93KS5vZmYoJ3Jlc2l6ZScsIEBjdXJyZW50U2NlbmUucmVzaXplKSBpZiBAY3VycmVudFNjZW5lXG4gICAgaWYgQF9zY2VuZXNbaWRlbnRpZmllcl1cbiAgICAgICAgQGN1cnJlbnRTY2VuZS5wYXVzZSgpIGlmIEBjdXJyZW50U2NlbmVcbiAgICAgICAgQGN1cnJlbnRTY2VuZSA9IEBfc2NlbmVzW2lkZW50aWZpZXJdXG4gICAgICAgIEBjdXJyZW50U2NlbmUucmVzdW1lKClcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBAY3VycmVudFNjZW5lLnJlc2l6ZSlcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgIHJldHVybiBmYWxzZVxuXG5cbmNsYXNzIFNQQUNFLk1haW5TY2VuZSBleHRlbmRzIFNQQUNFLlNjZW5lXG5cbiAgZXF1YWxpemVyOiBudWxsXG4gIGp1a2Vib3g6ICAgbnVsbFxuXG4gIGxvYWRpbmdNYW5hZ2VyOiBudWxsXG4gIGxvYWRlcjogICAgICAgICBudWxsXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcblxuICAgIEBfZXZlbnRzKClcbiAgICBAc2V0dXAoKVxuXG4gICAgIyAjIENyZWF0ZSBhIFNDIHNpbmdsZXRvblxuICAgICMgdW5sZXNzIFNQQUNFLmhhc093blByb3BlcnR5KCdTQycpXG4gICAgIyAgIFNQQUNFLlNDID0gbmV3IFNQQUNFLlNvdW5kQ2xvdWQoU1BBQ0UuU09VTkRDTE9VRC5pZCwgU1BBQ0UuU09VTkRDTE9VRC5yZWRpcmVjdF91cmkpXG4gICAgIyBAU0MgPSBTUEFDRS5TQ1xuXG4gICAgIyBAc2V0dXAoKSBpZiBAU0MuaXNDb25uZWN0ZWQoKVxuXG4gICAgQGVudiA9IG5ldyBTUEFDRS5ERUZBVUxULlNldHVwKClcbiAgICBAZW52Lm9uRW50ZXIoKVxuICAgIEBhZGQoQGVudilcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU291bmRDbG91ZC5JU19DT05ORUNURUQudHlwZSwgQHNldHVwKVxuXG4gIHNldHVwOiA9PlxuICAgIFNQQUNFLkp1a2Vib3ggICAgICAgICA9IG5ldyBTUEFDRS5KdWtlYm94KHRoaXMpXG4gICAgQGp1a2Vib3ggICAgICAgICAgICAgID0gU1BBQ0UuSnVrZWJveFxuICAgIEBqdWtlYm94LndoaWxlcGxheWluZyA9IEBfd2hpbGVwbGF5aW5nXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cbiAgICBzdXBlcihkZWx0YSlcbiAgICBAanVrZWJveC51cGRhdGUoZGVsdGEpIGlmIEBqdWtlYm94XG5cblxuY2xhc3MgU1BBQ0UuU291bmRDbG91ZFxuXG4gIGNsaWVudF9pZDogICAgbnVsbFxuICByZWRpcmVjdF91cmk6IG51bGxcbiAgdG9rZW46ICAgICAgICBudWxsXG5cbiAgY29uc3RydWN0b3I6IChpZCwgcmVkaXJlY3RfdXJpKS0+XG4gICAgU0MuaW5pdGlhbGl6ZSh7XG4gICAgICBjbGllbnRfaWQ6IGlkXG4gICAgICByZWRpcmVjdF91cmk6IHJlZGlyZWN0X3VyaVxuICAgIH0pXG5cbiAgICBAY2xpZW50X2lkICAgID0gaWRcbiAgICBAcmVkaXJlY3RfdXJpID0gcmVkaXJlY3RfdXJpXG5cbiAgICAjIHNvdW5kTWFuYWdlci5zZXR1cCh7XG4gICAgIyAgIHVybDpcbiAgICAjICAgYXV0b1BsYXk6IHRydWVcbiAgICAjICAgdXNlV2F2ZWZvcm1EYXRhOiB0cnVlXG4gICAgIyAgIHVzZUhUTUw1YXVkaW86IHRydWVcbiAgICAjICAgcHJlZmVyRmxhc2g6IGZhbHNlXG4gICAgIyAgIGZsYXNoOU9wdGlvbnM6XG4gICAgIyAgICAgdXNlV2F2ZWZvcm1EYXRhOiB0cnVlXG4gICAgIyB9KVxuXG4gIGlzQ29ubmVjdGVkOiAtPlxuICAgIGlmIChkb2N1bWVudC5jb29raWUucmVwbGFjZSgvKD86KD86XnwuKjtcXHMqKXNvdW5kY2xvdWRfY29ubmVjdGVkXFxzKlxcPVxccyooW147XSopLiokKXxeLiokLywgXCIkMVwiKSAhPSBcInRydWVcIilcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbicpLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ2luJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBAX2VDbGljaylcbiAgICBlbHNlXG4gICAgICBAdG9rZW4gPSBkb2N1bWVudC5jb29raWUucmVwbGFjZSgvKD86KD86XnwuKjtcXHMqKXNvdW5kY2xvdWRfdG9rZW5cXHMqXFw9XFxzKihbXjtdKikuKiQpfF4uKiQvLCBcIiQxXCIpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIF9lQ2xpY2s6ID0+XG4gICAgU0MuY29ubmVjdCg9PlxuICAgICAgQHRva2VuICAgICAgICAgID0gU0MuYWNjZXNzVG9rZW4oKVxuICAgICAgZG9jdW1lbnQuY29va2llID0gXCJzb3VuZGNsb3VkX3Rva2VuPVwiICsgQHRva2VuXG4gICAgICBkb2N1bWVudC5jb29raWUgPSBcInNvdW5kY2xvdWRfY29ubmVjdGVkPXRydWVcIlxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ2luJykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gICAgICBIRUxQRVIudHJpZ2dlcihFVkVOVC5Tb3VuZENsb3VkLklTX0NPTk5FQ1RFRClcbiAgICApXG5cbiAgcGF0aE9yVXJsOiAocGF0aCwgY2FsbGJhY2spLT5cbiAgICAjIFZlcmlmeSBpZiBpdCdzIGFuIElEIG9yIGFuIFVSTFxuICAgIGlmIC9eXFwvKHBsYXlsaXN0c3x0cmFja3N8dXNlcnMpXFwvWzAtOV0rJC8udGVzdChwYXRoKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKHBhdGgpXG5cbiAgICB1bmxlc3MgL14oaHR0cHxodHRwcykvLnRlc3QocGF0aClcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyBcIlxcXCJcIiArIHBhdGggKyBcIlxcXCIgaXMgbm90IGFuIHVybCBvciBhIHBhdGhcIlxuXG4gICAgU0MuZ2V0KCcvcmVzb2x2ZScsIHsgdXJsOiBwYXRoIH0sICh0cmFjaywgZXJyb3IpPT5cbiAgICAgIGlmIChlcnJvcilcbiAgICAgICAgY29uc29sZS5sb2cgZXJyb3IubWVzc2FnZVxuICAgICAgICBjYWxsYmFjayhlcnJvci5tZXNzYWdlLCBlcnJvcilcbiAgICAgIGVsc2VcbiAgICAgICAgdXJsID0gWycnLCB0cmFjay5raW5kKydzJywgdHJhY2suaWRdLmpvaW4oJy8nKVxuICAgICAgICBjYWxsYmFjayh1cmwpXG4gICAgKVxuXG4gIHN0cmVhbVNvdW5kOiAob2JqZWN0LCBvcHRpb25zPXt9LCBjYWxsYmFjayktPlxuICAgIGlmIG9iamVjdCBhbmQgb2JqZWN0Lmhhc093blByb3BlcnR5KCdraW5kJylcbiAgICAgIHBhdGggPSBvYmplY3QudXJpLnJlcGxhY2UoJ2h0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tJywgJycpXG5cbiAgICAgIGRlZmF1bHRzID1cbiAgICAgICAgYXV0b1BsYXk6IHRydWVcbiAgICAgICAgdXNlV2F2ZWZvcm1EYXRhOiB0cnVlXG4gICAgICAgIHVzZUhUTUw1YXVkaW86IHRydWVcbiAgICAgICAgcHJlZmVyRmxhc2g6IGZhbHNlXG5cbiAgICAgIG9wdGlvbnMgPSBfQ29mZmVlLm1lcmdlKGRlZmF1bHRzLCBvcHRpb25zKVxuICAgICAgU0Muc3RyZWFtKHBhdGgsIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgICAgIyBzb3VuZE1hbmFnZXIuZmxhc2g5T3B0aW9ucy51c2VXYXZlZm9ybURhdGEgPSB0cnVlXG5cbiAgICAgICMgQGdldFNvdW5kVXJsKHBhdGgsICh1cmwpLT5cbiAgICAgICMgICBvcHRpb25zLnVybCA9IHVybFxuICAgICAgIyAgIHNvdW5kID0gc291bmRNYW5hZ2VyLmNyZWF0ZVNvdW5kKG9wdGlvbnMpXG4gICAgICAjICAgY2FsbGJhY2soc291bmQpXG4gICAgICAjIClcblxuICBnZXRTb3VuZE9yUGxheWxpc3Q6IChwYXRoLCBjYWxsYmFjayktPlxuICAgIGlmIHR5cGVvZiBwYXRoID09ICdvYmplY3QnIGFuZCBwYXRoLmhhc093blByb3BlcnR5KCdraW5kJylcbiAgICAgIGNhbGxiYWNrKHBhdGgpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgQHBhdGhPclVybChwYXRoLCAocGF0aCwgZXJyb3IpPT5cbiAgICAgIGlmIGVycm9yXG4gICAgICAgIGNhbGxiYWNrKHBhdGgsIGVycm9yKVxuICAgICAgICByZXR1cm5cbiAgICAgIEBnZXQocGF0aCwgY2FsbGJhY2spXG4gICAgKVxuXG4gIGdldDogKHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgU0MuZ2V0KHBhdGgsIGNhbGxiYWNrKVxuXG4gIGdldFNvdW5kVXJsOiAocGF0aCwgY2FsbGJhY2spLT5cbiAgICBAZ2V0U291bmRPclBsYXlsaXN0KHBhdGgsIChzb3VuZCk9PlxuICAgICAgY2FsbGJhY2soc291bmQuc3RyZWFtX3VybCsnP29hdXRoX3Rva2VuPScrQHRva2VuKVxuICAgIClcblxuICBzZWFyY2g6IChzZWFyY2gsIHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgaWYgdHlwZW9mIHBhdGggPT0gJ2Z1bmN0aW9uJ1xuICAgICAgY2FsbGJhY2sgPSBwYXRoXG4gICAgICBwYXRoICAgICA9ICd0cmFja3MnXG5cbiAgICBpZiBwYXRoID09ICd1c2VycydcbiAgICAgIEBwYXRoT3JVcmwoJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vJytzZWFyY2gsIChwYXRoLCBlcnJvcik9PlxuICAgICAgICBpZiBlcnJvclxuICAgICAgICAgIGNhbGxiYWNrKHBhdGgsIGVycm9yKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHBhdGggPSBwYXRoKycvZmF2b3JpdGVzP29hdXRoX3Rva2VuPScrQHRva2VuXG4gICAgICAgIFNDLmdldChwYXRoLCBjYWxsYmFjaylcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBwYXRoID0gJy8nK3BhdGgrJz9vYXV0aF90b2tlbj0nK0B0b2tlbisnJnE9JytzZWFyY2hcbiAgICAgIFNDLmdldChwYXRoLCBjYWxsYmFjaylcblxuXG5jbGFzcyBTUEFDRS5TZWFyY2hFbmdpbmVcbiAgU0M6IG51bGxcbiAganVrZWJveDogbnVsbFxuXG4gICMgSFRNTFxuICBpbnB1dDogICAgICAgICBudWxsXG4gIGxpc3Q6ICAgICAgICAgIG51bGxcbiAgbGlzdENvbnRhaW5lcjogbnVsbFxuICBlbDogICAgICAgICAgICBudWxsXG4gIGxpbmVIZWlnaHQ6ICAgIDBcbiAgcmVzdWx0c0hlaWdodDogMFxuICByZXN1bHRzOiAgICAgICBudWxsXG4gIGZvY3VzZWQ6ICAgICAgIG51bGxcblxuICBzY3JvbGxQb3M6ICAgICAwXG5cbiAgQHN0YXRlOiAgbnVsbFxuXG5cbiAgY29uc3RydWN0b3I6IChqdWtlYm94KS0+XG4gICAgQGp1a2Vib3ggICAgICAgPSBqdWtlYm94XG4gICAgQFNDICAgICAgICAgICAgPSBTUEFDRS5TQ1xuXG4gICAgQGVsICAgICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoJylcbiAgICBAaW5wdXQgICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2ggZm9ybSBpbnB1dCcpXG4gICAgQGxpc3QgICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoIC5saXN0JylcbiAgICBAbGlzdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2ggdWwnKVxuXG4gICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEKVxuICAgIEBfZXZlbnRzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2ggZm9ybScpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIEBfZUp1a2Vib3hJc1NlYXJjaGluZylcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIEBfZUtleXByZXNzKVxuXG4gIF9lSnVrZWJveElzU2VhcmNoaW5nOiAoZSk9PlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEBzZWFyY2goQGlucHV0LnZhbHVlKSBpZiBAaW5wdXQudmFsdWUubGVuZ3RoID4gMFxuXG4gIF9lS2V5cHJlc3M6IChlKT0+XG4gICAgc3dpdGNoKGUua2V5Q29kZSlcbiAgICAgIHdoZW4gRU5VTS5LZXlib2FyZC5FTlRFUlxuICAgICAgICBpZiBAaW5wdXQudmFsdWUubGVuZ3RoID09IDBcbiAgICAgICAgICBpZiBAc3RhdGUgPT0gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRURcbiAgICAgICAgICAgIEBzZXRTdGF0ZShFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLk9QRU5FRClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc2V0U3RhdGUoRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRUQpXG4gICAgICAgIGVsc2UgaWYgQHN0YXRlID09IEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIIGFuZCBAZm9jdXNlZFxuICAgICAgICAgIEBzZXRTdGF0ZShFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEXG4gICAgICAgICAgQGFkZCgpXG5cbiAgICAgIHdoZW4gRU5VTS5LZXlib2FyZC5VUFxuICAgICAgICBAdXAoKSBpZiBAc3RhdGUgPT0gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcblxuICAgICAgd2hlbiBFTlVNLktleWJvYXJkLkRPV05cbiAgICAgICAgQGRvd24oKSBpZiBAc3RhdGUgPT0gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcblxuICAgICAgd2hlbiBFTlVNLktleWJvYXJkLkVTQywgRU5VTS5LZXlib2FyZC5ERUxFVEVcbiAgICAgICAgaWYgQHN0YXRlID09IEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIXG4gICAgICAgICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEXG4gICAgICAgICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEKVxuXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIHN3aXRjaCBAc3RhdGVcbiAgICAgIHdoZW4gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5PUEVORURcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIEBlbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWFyY2hfb3BlbicpXG5cbiAgICAgICAgQGlucHV0LnZhbHVlICAgID0gJydcbiAgICAgICAgQGlucHV0LmRpc2FibGVkID0gZmFsc2VcbiAgICAgICAgQGlucHV0LmZvY3VzKClcblxuICAgICAgICBAcmVzZXQoKVxuICAgICAgd2hlbiBFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLkNMT1NFRFxuICAgICAgICBAZWwuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICAgIHdoZW4gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5hZGQoJ3NlYXJjaF9vcGVuJylcblxuICAgICAgICBAaW5wdXQuZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgIEBpbnB1dC5ibHVyKClcblxuICAgICAgICBAbGluZUhlaWdodCAgICA9IEBsaXN0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2xpJykub2Zmc2V0SGVpZ2h0XG4gICAgICAgIEByZXN1bHRzSGVpZ2h0ID0gQGxpbmVIZWlnaHQgKiAoQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGgtMSlcblxuICAgICAgICBAZm9jdXNlZC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpIGlmIEBmb2N1c2VkXG4gICAgICAgIEBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpdGVtX3NlbGVjdGVkJylcbiAgICAgIHdoZW4gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5UUkFDS19TRUxFQ1RFRFxuICAgICAgICBAZm9jdXNlZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgICAgIEBlbC5jbGFzc0xpc3QuYWRkKCdpdGVtX3NlbGVjdGVkJylcblxuICB1cDogLT5cbiAgICBuZXh0ID0gQHNjcm9sbFBvcyArIEBsaW5lSGVpZ2h0XG4gICAgaWYgbmV4dCA8PSAwXG4gICAgICBAc2Nyb2xsUG9zID0gbmV4dFxuICAgICAgQGZvY3VzKClcblxuICBkb3duOiAtPlxuICAgIG5leHQgPSBAc2Nyb2xsUG9zIC0gQGxpbmVIZWlnaHRcbiAgICBpZiBNYXRoLmFicyhuZXh0KSA8PSBAcmVzdWx0c0hlaWdodFxuICAgICAgQHNjcm9sbFBvcyA9IG5leHRcbiAgICAgIEBmb2N1cygpXG5cbiAgZm9jdXM6ID0+XG4gICAgaWYgQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGggPiAxXG4gICAgICAkKFtAbGlzdENvbnRhaW5lciwgQGlucHV0XSkuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsICcrQHNjcm9sbFBvcysncHgpJylcbiAgICAgIHBvcyA9IChAc2Nyb2xsUG9zKi0xKSAvIChAcmVzdWx0c0hlaWdodCAvIChAbGlzdENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdsaScpLmxlbmd0aC0xKSlcbiAgICAgIHBvcyA9IE1hdGguZmxvb3IocG9zKVxuICAgICAgZWxtID0gQGVsLnF1ZXJ5U2VsZWN0b3IoJ2xpOm50aC1jaGlsZCgnKyhwb3MrMSkrJyknKVxuXG4gICAgICBpZiBlbG0uZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JylcbiAgICAgICAgQGZvY3VzZWQuY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXNlZCcpIGlmIEBmb2N1c2VkXG4gICAgICAgIEBmb2N1c2VkID0gZWxtXG4gICAgICAgIEBmb2N1c2VkLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzZWQnKVxuICAgICAgZWxzZVxuICAgICAgICBAZm9jdXNlZCA9IG51bGxcbiAgICBlbHNlXG4gICAgICBAc2V0U3RhdGUoRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5PUEVORUQpXG4gICAgICAjICQoW0BsaXN0Q29udGFpbmVyLCBAaW5wdXRdKS5jc3MoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKVxuXG4gIHJlc2V0OiAtPlxuICAgIEBmb2N1c2VkICAgPSBudWxsXG4gICAgQHNjcm9sbFBvcyA9IDBcbiAgICAkKFtAbGlzdENvbnRhaW5lciwgQGlucHV0XSkuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsICcrQHNjcm9sbFBvcysncHgpJylcbiAgICBAbGlzdENvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuXG4gIGFkZDogLT5cbiAgICBpbmRleCA9IEBmb2N1c2VkLmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpXG4gICAgdHJhY2sgPSBAcmVzdWx0c1tpbmRleF1cbiAgICBAanVrZWJveC5hZGQodHJhY2spIGlmIHRyYWNrXG5cbiAgICBAZm9jdXNlZC5jbGFzc0xpc3QuYWRkKCdhZGRlZCcpXG4gICAgJChAZm9jdXNlZCkuY3NzKHtcbiAgICAgICd0cmFuc2Zvcm0nOiAnc2NhbGUoLjc1KSB0cmFuc2xhdGVYKCcrd2luZG93LmlubmVyV2lkdGgrJ3B4KSdcbiAgICB9KVxuXG4gICAgc2V0VGltZW91dCg9PlxuICAgICAgQGZvY3VzZWQucmVtb3ZlKClcbiAgICAgIEBzZXRTdGF0ZShFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSClcbiAgICAgIEB1cCgpIGlmIEBmb2N1c2VkLm5leHRTaWJsaW5nXG4gICAgICBAZm9jdXMoKVxuICAgICwgNTAwKVxuXG4gIHNlYXJjaDogKHZhbHVlKS0+XG4gICAgcGF0aCA9IHZhbHVlLnNwbGl0KC9cXHMvKVswXVxuICAgIGlmIC9eKHRyYWNrfHRyYWNrc3xwbGF5bGlzdHxwbGF5bGlzdHN8c2V0fHNldHN8dXNlcnx1c2VycykkLy50ZXN0KHBhdGgpXG4gICAgICBsYXN0Q2hhciA9IHBhdGguY2hhckF0KHBhdGgubGVuZ3RoLTEpXG4gICAgICB2YWx1ZSAgICA9IHZhbHVlLnJlcGxhY2UocGF0aCsnICcsICcnKVxuICAgICAgcGF0aCAgICAgKz0gJ3MnIGlmIGxhc3RDaGFyICE9ICdzJ1xuICAgICAgcGF0aCAgICAgPSAncGxheWxpc3RzJyBpZiAvc2V0cy8udGVzdChwYXRoKVxuICAgIGVsc2VcbiAgICAgIHBhdGggICAgID0gJ3RyYWNrcydcblxuICAgIHN0cmluZyA9ICcnJ1xuICAgICAgW1xuICAgICAgICB7XCJraW5kXCI6XCJ0cmFja1wiLFwiaWRcIjo2MzI1NjkwNixcImNyZWF0ZWRfYXRcIjpcIjIwMTIvMTAvMTMgMTA6NDc6MTYgKzAwMDBcIixcInVzZXJfaWRcIjo3ODgyMDUsXCJkdXJhdGlvblwiOjIzNzg0MCxcImNvbW1lbnRhYmxlXCI6dHJ1ZSxcInN0YXRlXCI6XCJmaW5pc2hlZFwiLFwib3JpZ2luYWxfY29udGVudF9zaXplXCI6OTU0MzE2OCxcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTIvMjIgMjE6MDE6MTcgKzAwMDBcIixcInNoYXJpbmdcIjpcInB1YmxpY1wiLFwidGFnX2xpc3RcIjpcIlwiLFwicGVybWFsaW5rXCI6XCJqYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcInN0cmVhbWFibGVcIjp0cnVlLFwiZW1iZWRkYWJsZV9ieVwiOlwiYWxsXCIsXCJkb3dubG9hZGFibGVcIjp0cnVlLFwicHVyY2hhc2VfdXJsXCI6XCJodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9pZFwiOm51bGwsXCJwdXJjaGFzZV90aXRsZVwiOlwiQWx0ZXJuYXRlIFZlcnNpb24gRExcIixcImdlbnJlXCI6XCJQb3Bsb2NraW4gTXVzaWNcIixcInRpdGxlXCI6XCJKYW5ldCBKYWNrc29uIC0gSWYgKEtheXRyYW5hZGEgUmVtaXgpXCIsXCJkZXNjcmlwdGlvblwiOlwiQWx0ZXJuYXRlIFZlcnNpb24sIGZvciBESnMsIHdlbGwsIHRoYXRzIHRoZSB2ZXJzaW9uIGkgdXNlIGZvciBteSBkaiBzZXRzOyBodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9uYW1lXCI6XCJcIixcInJlbGVhc2VcIjpcIlwiLFwidHJhY2tfdHlwZVwiOlwicmVtaXhcIixcImtleV9zaWduYXR1cmVcIjpcIlwiLFwiaXNyY1wiOlwiXCIsXCJ2aWRlb191cmxcIjpudWxsLFwiYnBtXCI6bnVsbCxcInJlbGVhc2VfeWVhclwiOm51bGwsXCJyZWxlYXNlX21vbnRoXCI6bnVsbCxcInJlbGVhc2VfZGF5XCI6bnVsbCxcIm9yaWdpbmFsX2Zvcm1hdFwiOlwibXAzXCIsXCJsaWNlbnNlXCI6XCJhbGwtcmlnaHRzLXJlc2VydmVkXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNlwiLFwidXNlclwiOntcImlkXCI6Nzg4MjA1LFwia2luZFwiOlwidXNlclwiLFwicGVybWFsaW5rXCI6XCJrYXl0cmFuYWRhXCIsXCJ1c2VybmFtZVwiOlwiS0FZVFJBTkFEQVwiLFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMS8wNyAwNDoxMTozNiArMDAwMFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS91c2Vycy83ODgyMDVcIixcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhXCIsXCJhdmF0YXJfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAwNzQ4MDM2OTQtcWlieHQ0LWxhcmdlLmpwZ1wifSxcInVzZXJfcGxheWJhY2tfY291bnRcIjoxLFwidXNlcl9mYXZvcml0ZVwiOnRydWUsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYS9qYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcImFydHdvcmtfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtMDAwMDMyMDk0NTk3LTU2dHM3bi1sYXJnZS5qcGdcIixcIndhdmVmb3JtX3VybFwiOlwiaHR0cHM6Ly93MS5zbmRjZG4uY29tL2FxUkdpNERtYkNXel9tLnBuZ1wiLFwic3RyZWFtX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L3N0cmVhbVwiLFwiZG93bmxvYWRfdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvZG93bmxvYWRcIixcInBsYXliYWNrX2NvdW50XCI6MzMzMTAzMyxcImRvd25sb2FkX2NvdW50XCI6OTYxMTIsXCJmYXZvcml0aW5nc19jb3VudFwiOjY2NjUzLFwiY29tbWVudF9jb3VudFwiOjE1OTQsXCJhdHRhY2htZW50c191cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9hdHRhY2htZW50c1wiLFwicG9saWN5XCI6XCJBTExPV1wifSxcbiAgICAgICAge1wia2luZFwiOlwidHJhY2tcIixcImlkXCI6NjMyNTY5MDYsXCJjcmVhdGVkX2F0XCI6XCIyMDEyLzEwLzEzIDEwOjQ3OjE2ICswMDAwXCIsXCJ1c2VyX2lkXCI6Nzg4MjA1LFwiZHVyYXRpb25cIjoyMzc4NDAsXCJjb21tZW50YWJsZVwiOnRydWUsXCJzdGF0ZVwiOlwiZmluaXNoZWRcIixcIm9yaWdpbmFsX2NvbnRlbnRfc2l6ZVwiOjk1NDMxNjgsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzEyLzIyIDIxOjAxOjE3ICswMDAwXCIsXCJzaGFyaW5nXCI6XCJwdWJsaWNcIixcInRhZ19saXN0XCI6XCJcIixcInBlcm1hbGlua1wiOlwiamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJzdHJlYW1hYmxlXCI6dHJ1ZSxcImVtYmVkZGFibGVfYnlcIjpcImFsbFwiLFwiZG93bmxvYWRhYmxlXCI6dHJ1ZSxcInB1cmNoYXNlX3VybFwiOlwiaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfaWRcIjpudWxsLFwicHVyY2hhc2VfdGl0bGVcIjpcIkFsdGVybmF0ZSBWZXJzaW9uIERMXCIsXCJnZW5yZVwiOlwiUG9wbG9ja2luIE11c2ljXCIsXCJ0aXRsZVwiOlwiSmFuZXQgSmFja3NvbiAtIElmIChLYXl0cmFuYWRhIFJlbWl4KVwiLFwiZGVzY3JpcHRpb25cIjpcIkFsdGVybmF0ZSBWZXJzaW9uLCBmb3IgREpzLCB3ZWxsLCB0aGF0cyB0aGUgdmVyc2lvbiBpIHVzZSBmb3IgbXkgZGogc2V0czsgaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfbmFtZVwiOlwiXCIsXCJyZWxlYXNlXCI6XCJcIixcInRyYWNrX3R5cGVcIjpcInJlbWl4XCIsXCJrZXlfc2lnbmF0dXJlXCI6XCJcIixcImlzcmNcIjpcIlwiLFwidmlkZW9fdXJsXCI6bnVsbCxcImJwbVwiOm51bGwsXCJyZWxlYXNlX3llYXJcIjpudWxsLFwicmVsZWFzZV9tb250aFwiOm51bGwsXCJyZWxlYXNlX2RheVwiOm51bGwsXCJvcmlnaW5hbF9mb3JtYXRcIjpcIm1wM1wiLFwibGljZW5zZVwiOlwiYWxsLXJpZ2h0cy1yZXNlcnZlZFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDZcIixcInVzZXJcIjp7XCJpZFwiOjc4ODIwNSxcImtpbmRcIjpcInVzZXJcIixcInBlcm1hbGlua1wiOlwia2F5dHJhbmFkYVwiLFwidXNlcm5hbWVcIjpcIktBWVRSQU5BREFcIixcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTEvMDcgMDQ6MTE6MzYgKzAwMDBcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdXNlcnMvNzg4MjA1XCIsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYVwiLFwiYXZhdGFyX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2F2YXRhcnMtMDAwMDc0ODAzNjk0LXFpYnh0NC1sYXJnZS5qcGdcIn0sXCJ1c2VyX3BsYXliYWNrX2NvdW50XCI6MSxcInVzZXJfZmF2b3JpdGVcIjp0cnVlLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGEvamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJhcnR3b3JrX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2FydHdvcmtzLTAwMDAzMjA5NDU5Ny01NnRzN24tbGFyZ2UuanBnXCIsXCJ3YXZlZm9ybV91cmxcIjpcImh0dHBzOi8vdzEuc25kY2RuLmNvbS9hcVJHaTREbWJDV3pfbS5wbmdcIixcInN0cmVhbV91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9zdHJlYW1cIixcImRvd25sb2FkX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2Rvd25sb2FkXCIsXCJwbGF5YmFja19jb3VudFwiOjMzMzEwMzMsXCJkb3dubG9hZF9jb3VudFwiOjk2MTEyLFwiZmF2b3JpdGluZ3NfY291bnRcIjo2NjY1MyxcImNvbW1lbnRfY291bnRcIjoxNTk0LFwiYXR0YWNobWVudHNfdXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvYXR0YWNobWVudHNcIixcInBvbGljeVwiOlwiQUxMT1dcIn0sXG4gICAgICAgIHtcImtpbmRcIjpcInRyYWNrXCIsXCJpZFwiOjYzMjU2OTA2LFwiY3JlYXRlZF9hdFwiOlwiMjAxMi8xMC8xMyAxMDo0NzoxNiArMDAwMFwiLFwidXNlcl9pZFwiOjc4ODIwNSxcImR1cmF0aW9uXCI6MjM3ODQwLFwiY29tbWVudGFibGVcIjp0cnVlLFwic3RhdGVcIjpcImZpbmlzaGVkXCIsXCJvcmlnaW5hbF9jb250ZW50X3NpemVcIjo5NTQzMTY4LFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMi8yMiAyMTowMToxNyArMDAwMFwiLFwic2hhcmluZ1wiOlwicHVibGljXCIsXCJ0YWdfbGlzdFwiOlwiXCIsXCJwZXJtYWxpbmtcIjpcImphbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwic3RyZWFtYWJsZVwiOnRydWUsXCJlbWJlZGRhYmxlX2J5XCI6XCJhbGxcIixcImRvd25sb2FkYWJsZVwiOnRydWUsXCJwdXJjaGFzZV91cmxcIjpcImh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX2lkXCI6bnVsbCxcInB1cmNoYXNlX3RpdGxlXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiBETFwiLFwiZ2VucmVcIjpcIlBvcGxvY2tpbiBNdXNpY1wiLFwidGl0bGVcIjpcIkphbmV0IEphY2tzb24gLSBJZiAoS2F5dHJhbmFkYSBSZW1peClcIixcImRlc2NyaXB0aW9uXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiwgZm9yIERKcywgd2VsbCwgdGhhdHMgdGhlIHZlcnNpb24gaSB1c2UgZm9yIG15IGRqIHNldHM7IGh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX25hbWVcIjpcIlwiLFwicmVsZWFzZVwiOlwiXCIsXCJ0cmFja190eXBlXCI6XCJyZW1peFwiLFwia2V5X3NpZ25hdHVyZVwiOlwiXCIsXCJpc3JjXCI6XCJcIixcInZpZGVvX3VybFwiOm51bGwsXCJicG1cIjpudWxsLFwicmVsZWFzZV95ZWFyXCI6bnVsbCxcInJlbGVhc2VfbW9udGhcIjpudWxsLFwicmVsZWFzZV9kYXlcIjpudWxsLFwib3JpZ2luYWxfZm9ybWF0XCI6XCJtcDNcIixcImxpY2Vuc2VcIjpcImFsbC1yaWdodHMtcmVzZXJ2ZWRcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2XCIsXCJ1c2VyXCI6e1wiaWRcIjo3ODgyMDUsXCJraW5kXCI6XCJ1c2VyXCIsXCJwZXJtYWxpbmtcIjpcImtheXRyYW5hZGFcIixcInVzZXJuYW1lXCI6XCJLQVlUUkFOQURBXCIsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzExLzA3IDA0OjExOjM2ICswMDAwXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3VzZXJzLzc4ODIwNVwiLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGFcIixcImF2YXRhcl91cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hdmF0YXJzLTAwMDA3NDgwMzY5NC1xaWJ4dDQtbGFyZ2UuanBnXCJ9LFwidXNlcl9wbGF5YmFja19jb3VudFwiOjEsXCJ1c2VyX2Zhdm9yaXRlXCI6dHJ1ZSxcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhL2phbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwiYXJ0d29ya191cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hcnR3b3Jrcy0wMDAwMzIwOTQ1OTctNTZ0czduLWxhcmdlLmpwZ1wiLFwid2F2ZWZvcm1fdXJsXCI6XCJodHRwczovL3cxLnNuZGNkbi5jb20vYXFSR2k0RG1iQ1d6X20ucG5nXCIsXCJzdHJlYW1fdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvc3RyZWFtXCIsXCJkb3dubG9hZF91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9kb3dubG9hZFwiLFwicGxheWJhY2tfY291bnRcIjozMzMxMDMzLFwiZG93bmxvYWRfY291bnRcIjo5NjExMixcImZhdm9yaXRpbmdzX2NvdW50XCI6NjY2NTMsXCJjb21tZW50X2NvdW50XCI6MTU5NCxcImF0dGFjaG1lbnRzX3VyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2F0dGFjaG1lbnRzXCIsXCJwb2xpY3lcIjpcIkFMTE9XXCJ9LFxuICAgICAgICB7XCJraW5kXCI6XCJ0cmFja1wiLFwiaWRcIjo2MzI1NjkwNixcImNyZWF0ZWRfYXRcIjpcIjIwMTIvMTAvMTMgMTA6NDc6MTYgKzAwMDBcIixcInVzZXJfaWRcIjo3ODgyMDUsXCJkdXJhdGlvblwiOjIzNzg0MCxcImNvbW1lbnRhYmxlXCI6dHJ1ZSxcInN0YXRlXCI6XCJmaW5pc2hlZFwiLFwib3JpZ2luYWxfY29udGVudF9zaXplXCI6OTU0MzE2OCxcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTIvMjIgMjE6MDE6MTcgKzAwMDBcIixcInNoYXJpbmdcIjpcInB1YmxpY1wiLFwidGFnX2xpc3RcIjpcIlwiLFwicGVybWFsaW5rXCI6XCJqYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcInN0cmVhbWFibGVcIjp0cnVlLFwiZW1iZWRkYWJsZV9ieVwiOlwiYWxsXCIsXCJkb3dubG9hZGFibGVcIjp0cnVlLFwicHVyY2hhc2VfdXJsXCI6XCJodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9pZFwiOm51bGwsXCJwdXJjaGFzZV90aXRsZVwiOlwiQWx0ZXJuYXRlIFZlcnNpb24gRExcIixcImdlbnJlXCI6XCJQb3Bsb2NraW4gTXVzaWNcIixcInRpdGxlXCI6XCJKYW5ldCBKYWNrc29uIC0gSWYgKEtheXRyYW5hZGEgUmVtaXgpXCIsXCJkZXNjcmlwdGlvblwiOlwiQWx0ZXJuYXRlIFZlcnNpb24sIGZvciBESnMsIHdlbGwsIHRoYXRzIHRoZSB2ZXJzaW9uIGkgdXNlIGZvciBteSBkaiBzZXRzOyBodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9uYW1lXCI6XCJcIixcInJlbGVhc2VcIjpcIlwiLFwidHJhY2tfdHlwZVwiOlwicmVtaXhcIixcImtleV9zaWduYXR1cmVcIjpcIlwiLFwiaXNyY1wiOlwiXCIsXCJ2aWRlb191cmxcIjpudWxsLFwiYnBtXCI6bnVsbCxcInJlbGVhc2VfeWVhclwiOm51bGwsXCJyZWxlYXNlX21vbnRoXCI6bnVsbCxcInJlbGVhc2VfZGF5XCI6bnVsbCxcIm9yaWdpbmFsX2Zvcm1hdFwiOlwibXAzXCIsXCJsaWNlbnNlXCI6XCJhbGwtcmlnaHRzLXJlc2VydmVkXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNlwiLFwidXNlclwiOntcImlkXCI6Nzg4MjA1LFwia2luZFwiOlwidXNlclwiLFwicGVybWFsaW5rXCI6XCJrYXl0cmFuYWRhXCIsXCJ1c2VybmFtZVwiOlwiS0FZVFJBTkFEQVwiLFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMS8wNyAwNDoxMTozNiArMDAwMFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS91c2Vycy83ODgyMDVcIixcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhXCIsXCJhdmF0YXJfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAwNzQ4MDM2OTQtcWlieHQ0LWxhcmdlLmpwZ1wifSxcInVzZXJfcGxheWJhY2tfY291bnRcIjoxLFwidXNlcl9mYXZvcml0ZVwiOnRydWUsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYS9qYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcImFydHdvcmtfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtMDAwMDMyMDk0NTk3LTU2dHM3bi1sYXJnZS5qcGdcIixcIndhdmVmb3JtX3VybFwiOlwiaHR0cHM6Ly93MS5zbmRjZG4uY29tL2FxUkdpNERtYkNXel9tLnBuZ1wiLFwic3RyZWFtX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L3N0cmVhbVwiLFwiZG93bmxvYWRfdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvZG93bmxvYWRcIixcInBsYXliYWNrX2NvdW50XCI6MzMzMTAzMyxcImRvd25sb2FkX2NvdW50XCI6OTYxMTIsXCJmYXZvcml0aW5nc19jb3VudFwiOjY2NjUzLFwiY29tbWVudF9jb3VudFwiOjE1OTQsXCJhdHRhY2htZW50c191cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9hdHRhY2htZW50c1wiLFwicG9saWN5XCI6XCJBTExPV1wifVxuICAgICAgXVxuICAgICcnJ1xuXG4gICAgcmVzdWx0cyA9IEpTT04ucGFyc2Uoc3RyaW5nKVxuXG4gICAgQGlucHV0LnZhbHVlID0gJ0xvb2tpbmcgZm9yIFwiJyt2YWx1ZSsnXCInXG4gICAgQFNDLnNlYXJjaCh2YWx1ZSwgcGF0aCwgKHJlc3VsdHMpPT5cbiAgICAgIGNvbnNvbGUubG9nIHJlc3VsdHNcbiAgICAgIGlmIHJlc3VsdHMubGVuZ3RoID09IDBcbiAgICAgICAgQGlucHV0LnZhbHVlID0gJ1wiJyt2YWx1ZSsnXCIgaGFzIG5vIHJlc3VsdCdcbiAgICAgICAgcmV0dXJuXG4gICAgICBlbHNlXG4gICAgICAgIEBpbnB1dC52YWx1ZSA9ICdSZXN1bHRzIGZvciBcIicrdmFsdWUrJ1wiJ1xuXG4gICAgICBAcmVzdWx0cyAgICAgPSBbXVxuICAgICAgQGxpc3RDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSlcbiAgICAgIGZvciB0cmFjaywgaSBpbiByZXN1bHRzXG4gICAgICAgIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgICAgICBsaS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBpKVxuXG4gICAgICAgIGFydHdvcmtfdXJsID0gdHJhY2suYXJ0d29ya191cmxcbiAgICAgICAgYXJ0d29ya191cmwgPSAnaW1hZ2VzL25vX2FydHdvcmsuZ2lmJyB1bmxlc3MgYXJ0d29ya191cmxcbiAgICAgICAgbGkuaW5uZXJIVE1MID0gXCJcIlwiXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiI3thcnR3b3JrX3VybH1cIiBhbHQ9XCJcIiBvbmVycm9yPVwidGhpcy5zcmM9J2ltYWdlcy9ub19hcnR3b3JrLmdpZidcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxwPiN7dHJhY2sudGl0bGV9PC9wPlxuICAgICAgICAgICAgICA8cD4je3RyYWNrLnVzZXIudXNlcm5hbWUudG9Mb3dlckNhc2UoKX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgXCJcIlwiXG4gICAgICAgIEByZXN1bHRzLnB1c2godHJhY2spXG4gICAgICAgIEBsaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKGxpKVxuICAgICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIKVxuICAgIClcblxuXG5jbGFzcyBTUEFDRS5KdWtlYm94XG5cbiAgIyMgRGF0YSBvYmplY3RzXG4gIFNDOiAgICAgICAgICAgbnVsbFxuICBjdXJyZW50OiAgICAgIG51bGxcbiAgYWlycG9ydDogICAgICBudWxsXG4gIHBsYXlsaXN0OiAgICAgbnVsbFxuICBzZWFyY2hFbmdpbmU6IG51bGxcbiAgd2F2ZWZvcm1EYXRhOiBudWxsXG5cbiAgIyMgVEhSRUVKUyBPYmplY3RzXG4gIHNjZW5lOiAgICAgICBudWxsXG4gIGVxdWFsaXplcjogICBudWxsXG4gIGdyb3VwOiAgICAgICBudWxsXG5cbiAgIyMgU1RBVEVTXG4gIHN0YXRlOiAgICAgICAgbnVsbFxuICBhaXJwb3J0U3RhdGU6IG51bGxcblxuICAjIyBPVEhFUlNcbiAgZGVsYXk6IDIwMDBcbiAgdGltZTogMFxuXG4gIGNvbnN0cnVjdG9yOiAoc2NlbmUpLT5cbiAgICBAc2NlbmUgPSBzY2VuZVxuICAgIEBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpXG4gICAgQHNjZW5lLmFkZChAZ3JvdXApXG5cbiAgICBAd2F2ZWZvcm1EYXRhID1cbiAgICAgIG1vbm86IG51bGxcbiAgICAgIHN0ZXJlbzogbnVsbFxuICAgIEBzZXRBaXJwb3J0U3RhdGUoRU5VTS5BaXJwb3J0U3RhdGUuSURMRSlcblxuICAgICMgSW5pdGlhbGl6ZSB0aGUgZXF1YWxpemVyXG4gICAgQGVxbHpyID0gbmV3IFNQQUNFLkVxdWFsaXplcih7XG4gICAgICBtaW5MZW5ndGg6IDBcbiAgICAgIG1heExlbmd0aDogMjAwXG4gICAgICByYWRpdXM6IDMwMFxuICAgICAgY29sb3I6IDB4RkZGRkZGXG4gICAgICBhYnNvbHV0ZTogZmFsc2VcbiAgICAgIGxpbmVGb3JjZURvd246IC41XG4gICAgICBsaW5lRm9yY2VVcDogMVxuICAgICAgaW50ZXJwb2xhdGlvblRpbWU6IDE1MFxuICAgIH0pXG4gICAgQGdyb3VwLmFkZChAZXFsenIpXG5cbiAgICBAZXF1YWxpemVyID0gbmV3IFNQQUNFLkVxdWFsaXplcih7XG4gICAgICBtaW5MZW5ndGg6IDBcbiAgICAgIG1heExlbmd0aDogNTBcbiAgICAgIHJhZGl1czogMzAwXG4gICAgICBjb2xvcjogMHhEMUQxRDFcbiAgICAgIGFic29sdXRlOiBmYWxzZVxuICAgICAgbGluZUZvcmNlRG93bjogLjVcbiAgICAgIGxpbmVGb3JjZVVwOiAxXG4gICAgICBpbnRlcnBvbGF0aW9uVGltZTogMTUwXG4gICAgfSlcbiAgICBAZ3JvdXAuYWRkKEBlcXVhbGl6ZXIpXG5cbiAgICBAU0MgICAgICAgICAgID0gU1BBQ0UuU0NcbiAgICBAYWlycG9ydCAgICAgID0gW11cbiAgICBAcGxheWxpc3QgICAgID0gW11cblxuICAgIEBfZXZlbnRzKClcbiAgICBAc2V0U3RhdGUoRU5VTS5KdWtlYm94U3RhdGUuSVNfU1RPUFBFRClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVHJhY2suSVNfUExBWUlORy50eXBlLCBAX2VUcmFja0lzUGxheWluZylcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX1NUT1BQRUQudHlwZSwgQF9lVHJhY2tJc1N0b3BwZWQpXG4gICAgIyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNvdmVyLlRSQU5TSVRJT05fRU5ERUQudHlwZSwgQF9lVHJhbnNpdGlvbkVuZGVkKVxuXG4gIF9lVHJhY2tJc1BsYXlpbmc6IChlKT0+XG4gICAgQHNldFN0YXRlKEVOVU0uSnVrZWJveFN0YXRlLklTX1BMQVlJTkcpXG5cbiAgX2VUcmFja0lzU3RvcHBlZDogKGUpPT5cbiAgICBIRUxQRVIudHJpZ2dlcihFVkVOVC5KdWtlYm94LldJTExfUExBWSlcbiAgICBzZXRUaW1lb3V0KD0+XG4gICAgICBpZiBAcGxheWxpc3QubGVuZ3RoID4gMFxuICAgICAgICBAc2V0U3RhdGUoRU5VTS5KdWtlYm94U3RhdGUuVFJBQ0tfU1RPUFBFRClcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldFN0YXRlKEVOVU0uSnVrZWJveFN0YXRlLklTX1NUT1BQRUQpXG4gICAgLCAxNzUwKVxuXG4gICMgX2VUcmFuc2l0aW9uRW5kZWQ6IChlKT0+XG4gICMgICBpZiBAcGxheWxpc3QubGVuZ3RoID4gMCAmJiBAdGltZSA+IEBkZWxheVxuICAjICAgICBAbmV4dCgpIGlmIEBjdXJyZW50ID09IG51bGxcblxuICBfY3JlYXRlVHJhY2s6IChkYXRhKS0+XG4gICAgIyBzcGFjZXNoaXAgICAgICAgPSBuZXcgU1BBQ0UuU3BhY2VzaGlwKEBlcXVhbGl6ZXIuY2VudGVyLCBAZXF1YWxpemVyLnJhZGl1cylcbiAgICB0cmFjayAgICAgICAgICAgPSBuZXcgU1BBQ0UuVHJhY2soZGF0YSlcbiAgICAjIHRyYWNrLnNwYWNlc2hpcCA9IHNwYWNlc2hpcFxuICAgIHRyYWNrLnBlbmRpbmdEdXJhdGlvbiA9IEBfY2FsY1BlbmRpbmcoQHBsYXlsaXN0Lmxlbmd0aC0xKVxuXG4gICAgIyBAZ3JvdXAuYWRkKHNwYWNlc2hpcClcblxuICAgIEBwbGF5bGlzdC5wdXNoKHRyYWNrKVxuICAgICMgQGFpcnBvcnQucHVzaChzcGFjZXNoaXApXG5cbiAgICBIRUxQRVIudHJpZ2dlcihFVkVOVC5KdWtlYm94LlRSQUNLX0FEREVELCB7IHRyYWNrOiB0cmFjayB9KVxuICAgIFNQQUNFLkxPRygnU291bmQgYWRkZWQ6ICcgKyB0cmFjay5kYXRhLnRpdGxlKVxuXG4gIF9jYWxjUGVuZGluZzogKHBvc2l0aW9uKS0+XG4gICAgZHVyYXRpb24gPSAwXG4gICAgZm9yIHRyYWNrLCBpIGluIEBwbGF5bGlzdFxuICAgICAgZHVyYXRpb24gKz0gdHJhY2suZGF0YS5kdXJhdGlvblxuICAgICAgYnJlYWsgaWYgaSA9PSBwb3NpdGlvblxuICAgIHJldHVybiBkdXJhdGlvblxuXG4gIHByZWRlZmluZWRQbGF5bGlzdDogLT5cbiAgICBsaXN0ID0gW1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9jaG9uY2gtMi9jb3VydGUtZGFuc2UtbWFjYWJyZSdcbiAgICAgICMgJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vY2hvbmNoLTIvbW91YWlzJ1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9jaG9uY2gtMi9jYWNhY28tMidcbiAgICAgICMgJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vY2hvbmNoLTIvZHVvZGVudW0nXG4gICAgICAjICdodHRwczovL3NvdW5kY2xvdWQuY29tL2Nob25jaC0yL2xpdHRsZS1ncmVlbi1tb25rZXknXG4gICAgICAjICdodHRwczovL3NvdW5kY2xvdWQuY29tL2h1aHdoYXRhbmR3aGVyZS9zZXRzL3N1cHJlbWUtbGF6aW5lc3MtdGhlLWNlbGVzdGljcydcbiAgICAgICMgJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vdGFrdWdvdGJlYXRzL3NldHMvMjUtbmlnaHRzLWZvci1udWphYmVzJ1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS90b21taXNjaC9zZXRzL3RvbS1taXNjaC1zb3VsZWN0aW9uLXdoaXRlJ1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9wcm9mZXNzb3JrbGlxL3NldHMvdHJhY2ttYW5pYS12YWxsZXktb3N0J1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9wcm9mZXNzb3JrbGlxL3NldHMvdHJhY2ttYW5pYS1zdGFkaXVtLW9zdCdcbiAgICBdXG5cbiAgICBsaXN0ID0gX0NvZmZlZS5zaHVmZmxlKGxpc3QpXG4gICAgZm9yIHVybCwgaSBpbiBsaXN0XG4gICAgICBAYWRkKGxpc3RbaV0pXG5cbiAgICAjIHNldFRpbWVvdXQoPT5cbiAgICAjICAgQGFkZCgnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9jaG9uY2gtMi9jYWNhY28tMicpXG4gICAgIyAsIDUwMDApXG5cbiAgc2V0U3RhdGU6IChzdGF0ZSktPlxuICAgIEBzdGF0ZSA9IHN0YXRlXG4gICAgc3dpdGNoKHN0YXRlKVxuICAgICAgd2hlbiBFTlVNLkp1a2Vib3hTdGF0ZS5JU19QTEFZSU5HXG4gICAgICAgIEBjdXJyZW50LndoaWxlcGxheWluZ0NhbGxiYWNrID0gQF93aGlsZXBsYXlpbmdcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgQGN1cnJlbnRcbiAgICAgICAgICBAY3VycmVudC5kZXN0cnVjdCgpXG4gICAgICAgIEBjdXJyZW50ID0gbnVsbFxuXG4gICAgICAgIGlmIEBzdGF0ZSA9PSBFTlVNLkp1a2Vib3hTdGF0ZS5JU19TVE9QUEVEXG4gICAgICAgICAgSEVMUEVSLnRyaWdnZXIoRVZFTlQuSnVrZWJveC5JU19TVE9QUEVEKVxuXG4gIHNldEFpcnBvcnRTdGF0ZTogKHN0YXRlKT0+XG4gICAgQGFpcnBvcnRTdGF0ZSA9IHN0YXRlXG4gICAgc3dpdGNoKHN0YXRlKVxuICAgICAgd2hlbiBFTlVNLkFpcnBvcnRTdGF0ZS5JRExFXG4gICAgICAgIFNQQUNFLkxPRygnV2FpdGluZyBmb3IgbmV3IHNwYWNlc2hpcCcpXG4gICAgICB3aGVuIEVOVU0uQWlycG9ydFN0YXRlLlNFTkRJTkdcbiAgICAgICAgc3BhY2VzaGlwID0gQGFpcnBvcnQuc2hpZnQoKVxuICAgICAgICBzcGFjZXNoaXAuc2V0U3RhdGUoU3BhY2VzaGlwU3RhdGUuTEFVTkNIRUQpXG4gICAgICAgIHNldFRpbWVvdXQoQHNldEFpcnBvcnRTdGF0ZSwgNjAgKiAxMDAwKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0QWlycG9ydFN0YXRlKEVOVU0uQWlycG9ydFN0YXRlLklETEUpXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cbiAgICBpZiBAY3VycmVudCA9PSBudWxsXG4gICAgICBAdGltZSArPSBkZWx0YVxuICAgIGVsc2VcbiAgICAgIEB0aW1lID0gMFxuICAgICMgZm9yIHRyYWNrLCBpIGluIEBwbGF5bGlzdFxuICAgICMgICB0cmFjay51cGRhdGUoZGVsdGEpXG4gICAgIyBAY3VycmVudC51cGRhdGUoZGVsdGEpIGlmIEBjdXJyZW50XG5cbiAgICBpZiBAcGxheWxpc3QubGVuZ3RoID4gMCAmJiBAdGltZSA+IEBkZWxheSMgJiYgQHN0YXRlID09IEVOVU0uSnVrZWJveFN0YXRlLklTX1NUT1BQRURcbiAgICAgIEBuZXh0KCkgaWYgQGN1cnJlbnQgPT0gbnVsbFxuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgSnVrZWJveCBwbGF5ZXIgbWV0aG9kcyAjXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGxpc3Q6IC0+XG4gICAgbGlzdCA9IFtdXG4gICAgZm9yIHRyYWNrIGluIEBwbGF5bGlzdFxuICAgICAgbGlzdC5wdXNoKHt0aXRsZTogdHJhY2suZGF0YS50aXRsZSwgcGVuZGluZ0R1cmF0aW9uOiB0cmFjay5wZW5kaW5nRHVyYXRpb259KVxuICAgIHJldHVybiBsaXN0XG5cbiAgYWRkOiAoc291bmRPclBsYXlsaXN0KS0+XG4gICAgQF9jcmVhdGVUcmFjayhzb3VuZE9yUGxheWxpc3QpXG4gICAgIyBAU0MuZ2V0U291bmRPclBsYXlsaXN0IHNvdW5kT3JQbGF5bGlzdCwgKG8sIGVycik9PlxuICAgICMgICBpZiBlcnJcbiAgICAjICAgICBfSC50cmlnZ2VyKFRSQUNLX09OX0FERF9FUlJPUiwge29iamVjdDogbywgZXJyb3I6IGVycn0pXG4gICAgIyAgICAgcmV0dXJuXG5cbiAgICAjICAgdHJhY2tzID0gbnVsbFxuICAgICMgICBpZiBvLmhhc093blByb3BlcnR5KCd0cmFja3MnKVxuICAgICMgICAgIHRyYWNrcyA9IF9Db2ZmZWUuc2h1ZmZsZShvLnRyYWNrcylcbiAgICAjICAgZWxzZVxuICAgICMgICAgIHRyYWNrcyA9IFtdXG4gICAgIyAgICAgdHJhY2tzLnB1c2gobylcblxuICAgICMgICBmb3IgZGF0YSBpbiB0cmFja3NcbiAgICAjICAgICBAX2NyZWF0ZVRyYWNrKGRhdGEpXG5cbiAgbmV4dDogKHRyYWNrKS0+XG4gICAgQGN1cnJlbnQuc3RvcCgpIGlmIEBjdXJyZW50XG4gICAgaWYgQHBsYXlsaXN0Lmxlbmd0aCA+IDBcbiAgICAgIEBjdXJyZW50ID0gQHBsYXlsaXN0LnNoaWZ0KClcbiAgICAgICMgQGN1cnJlbnQucmVtb3ZlU3BhY2VzaGlwKClcbiAgICAgIEBjdXJyZW50LnN0cmVhbSgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIF93aGlsZXBsYXlpbmc6ID0+XG4gICAgIyBjb25zb2xlLmxvZyAneW91cGknLCBAY3VycmVudC5zb3VuZFxuICAgIEB3YXZlZm9ybURhdGEgPSBAY3VycmVudC53YXZlZm9ybURhdGEgaWYgQGN1cnJlbnQjIGFuZCBAY3VycmVudC5zb3VuZFxuXG5cbmNsYXNzIFNQQUNFLlRyYWNrXG5cbiAgZGF0YTogICAgICAgICAgICAgICAgIG51bGxcbiAgc3BhY2VzaGlwOiAgICAgICAgICAgIG51bGxcbiAgc291bmQ6ICAgICAgICAgICAgICAgIG51bGxcblxuICB0aW1lOiAgICAgICAgICAgICAgICAgMFxuICBwZW5kaW5nRHVyYXRpb246ICAgICAgMFxuXG4gIGlzUGxheWluZzogICAgICAgICAgICBmYWxzZVxuICB3aGlsZXBsYXlpbmdDYWxsYmFjazogbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAoZGF0YSktPlxuICAgIEBkYXRhID0gZGF0YVxuICAgIEBTQyAgID0gU1BBQ0UuU0NcbiAgICBAX2V2ZW50cygpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX1BMQVlJTkcudHlwZSwgQF9lVHJhY2tJc1BsYXlpbmcpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5UcmFjay5JU19TVE9QUEVELnR5cGUsIEBfZVRyYWNrSXNTdG9wcGVkKVxuXG4gIF9lVHJhY2tJc1BsYXlpbmc6ID0+XG4gICAgQGlzUGxheWluZyA9IHRydWVcblxuICBfZVRyYWNrSXNTdG9wcGVkOiA9PlxuICAgIEBpc1BsYXlpbmcgPSBmYWxzZVxuXG4gIHN0cmVhbTogLT5cbiAgICB1cmwgID0gJ3Jlc291cmNlcy9zb3VuZHMvJytAZGF0YS51cmxcblxuICAgIHdpbmRvdy5XZWJBdWRpb0FQSSA9IHdpbmRvdy5XZWJBdWRpb0FQSSB8fCBuZXcgU1BBQ0UuV2ViQXVkaW9BUEkoKVxuXG4gICAgQGFwaSA9IFdlYkF1ZGlvQVBJXG4gICAgQGFwaS5vbnBsYXkgICAgICAgICA9IEBfb25wbGF5XG4gICAgQGFwaS5vbmF1ZGlvcHJvY2VzcyA9IEBfd2hpbGVwbGF5aW5nXG4gICAgQGFwaS5vbmVuZGVkICAgICAgICA9IEBfb25maW5pc2hcbiAgICBAYXBpLnNldFVybCh1cmwpXG5cbiAgcGxheTogLT5cbiAgICBAYXBpLnBsYXkoKVxuXG4gIHBhdXNlOiAtPlxuICAgIEBhcGkucGF1c2UoKVxuXG4gIHN0b3A6IC0+XG4gICAgQGFwaS5zdG9wKClcbiAgICBAX29uZmluaXNoKClcblxuICBkZXN0cnVjdDogLT5cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX1BMQVlJTkcudHlwZSwgQF9lVHJhY2tJc1BsYXlpbmcpXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFVkVOVC5UcmFjay5JU19TVE9QUEVELnR5cGUsIEBfZVRyYWNrSXNTdG9wcGVkKVxuICAgIEBhcGkuZGVzdHJveSgpXG5cbiAgX3N0YXJ0aW5nOiAoc291bmQpPT5cbiAgICBAc291bmQgPSBzb3VuZFxuICAgIFNQQUNFLkxPRygnTmV4dDogJyArIEBkYXRhLnRpdGxlKVxuXG4gIF9vbnBsYXk6ID0+XG4gICAgSEVMUEVSLnRyaWdnZXIoRVZFTlQuVHJhY2suSVNfUExBWUlORywgeyB0cmFjazogdGhpcyB9KVxuXG4gIF9vbmZpbmlzaDogPT5cbiAgICBmb3IgZGF0YSwgaSBpbiBAd2F2ZWZvcm1EYXRhLm1vbm9cbiAgICAgIGRhdGEgICAgICA9IDBcbiAgICAgIEBkYXRhc1tpXSA9IDBcblxuICAgIEhFTFBFUi50cmlnZ2VyKEVWRU5ULlRyYWNrLklTX1NUT1BQRUQsIHsgdHJhY2s6IHRoaXMgfSlcbiAgICBAYXBpLnN0b3AoKVxuXG4gIGRhdGFzOiBBcnJheSgyNTYpXG4gIF93aGlsZXBsYXlpbmc6IChlKT0+XG4gICAgYW5hbHlzZXIgPSBAYXBpLmFuYWx5c2VyXG4gICAgYXJyYXkgICAgPSAgbmV3IEZsb2F0MzJBcnJheShhbmFseXNlci5mZnRTaXplKVxuICAgIGFuYWx5c2VyLmdldEZsb2F0VGltZURvbWFpbkRhdGEoYXJyYXkpXG5cbiAgICBmb3IgaSBpbiBbMC4uMjU1XVxuICAgICAgQGRhdGFzW2ldID0gYXJyYXlbaV1cblxuICAgIEB3YXZlZm9ybURhdGEgPVxuICAgICAgbW9ubzogQGRhdGFzXG5cbiAgICBAd2hpbGVwbGF5aW5nQ2FsbGJhY2soKSBpZiBAd2hpbGVwbGF5aW5nQ2FsbGJhY2tcblxuXG5jbGFzcyBTUEFDRS5XZWJBdWRpb0FQSVxuXG4gIGlkZW50aWZpZXI6ICdXZWJBdWRpb0FQSSdcblxuICBjdHg6ICAgICAgIG51bGxcbiAgYW5hbHlzZXI6ICBudWxsXG4gIHByb2Nlc3NvcjogbnVsbFxuICBidWZmZXI6ICAgIG51bGxcbiAgc3JjOiAgICAgICBudWxsXG5cbiAgc3RhcnRUaW1lOiAwXG4gIHBvc2l0aW9uOiAgMFxuICBkdXJhdGlvbjogIDBcblxuICB0aW1lOiAwXG5cbiAgaXNMb2FkZWQ6IGZhbHNlXG5cbiAgIyMgU2V0dXAgV2ViIEF1ZGlvIEFQSVxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICB0cnlcbiAgICAgIGlmICh3aW5kb3cuQXVkaW9Db250ZXh0T2JqZWN0ID09IHVuZGVmaW5lZClcbiAgICAgICAgd2luZG93LkF1ZGlvQ29udGV4dE9iamVjdCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dHx8d2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKVxuICAgIGNhdGNoIGVcbiAgICAgIGlmIChBcHAuZW52ID09ICdkZXZlbG9wbWVudCcpXG4gICAgICAgIGNvbnNvbGUubG9nKFwiSFRNTDUgV2ViIEF1ZGlvIEFQSSBub3Qgc3VwcG9ydGVkLiBTd2l0Y2ggdG8gU291bmRNYW5hZ2VyMi5cIilcblxuICBzZXRVcmw6ICh1cmwpLT5cbiAgICBAY3R4ID0gQXVkaW9Db250ZXh0T2JqZWN0XG4gICAgQF9vbGRCcm93c2VyKClcblxuICAgIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKVxuICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJ1xuICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgIHJlcXVlc3Qub25sb2FkID0gPT5cbiAgICAgIEBjdHguZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIChidWZmZXIpPT5cbiAgICAgICAgQGlzTG9hZGVkID0gdHJ1ZVxuICAgICAgICBAYnVmZmVyID0gYnVmZmVyXG4gICAgICAgIEBwbGF5KClcbiAgICAgICwgQF9vbkVycm9yKVxuICAgIHJlcXVlc3Quc2VuZCgpXG5cbiAgX29uRXJyb3I6IC0+XG4gICAgY29uc29sZS5sb2cgJ0VSUk9SJ1xuXG4gIHBhdXNlOiAtPlxuICAgIGlmIEBzcmNcbiAgICAgIEBzcmMuc3RvcCgwKVxuICAgICAgQHNyYyAgICAgICA9IG51bGxcbiAgICAgIEBzcmMxLnN0b3AoMClcbiAgICAgIEBzcmMxICAgICAgPSBudWxsXG4gICAgICBAcHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gbnVsbFxuICAgICAgQHBvc2l0aW9uICA9IEBjdHguY3VycmVudFRpbWUgLSBAc3RhcnRUaW1lXG4gICAgICBAaXNQbGF5aW5nID0gZmFsc2VcblxuICBwbGF5OiAocG9zaXRpb24pLT5cbiAgICByZXR1cm4gdW5sZXNzIEBpc0xvYWRlZFxuICAgIEBfY29ubmVjdCgpXG4gICAgQHBvc2l0aW9uICA9IGlmIHR5cGVvZiBwb3NpdGlvbiA9PSAnbnVtYmVyJyB0aGVuIHBvc2l0aW9uIGVsc2UgQHBvc2l0aW9uIG9yIDBcbiAgICBAc3RhcnRUaW1lID0gQGN0eC5jdXJyZW50VGltZSAtIChAcG9zaXRpb24gb3IgMClcblxuICAgIEBzcmMxLnN0YXJ0KEBjdHguY3VycmVudFRpbWUsIEBwb3NpdGlvbilcblxuICAgIHNldFRpbWVvdXQoPT5cbiAgICAgICAgQHNyYy5zdGFydChAY3R4LmN1cnJlbnRUaW1lIC0gMC4xNSAqIDAuNSwgQHBvc2l0aW9uKVxuICAgICwgMTUwKVxuXG4gICAgQGlzUGxheWluZyA9IHRydWVcbiAgICBAb25wbGF5KCkgaWYgQG9ucGxheVxuXG4gIHN0b3A6IC0+XG4gICAgaWYgQHNyYyBhbmQgQHNyYzFcbiAgICAgIEBzcmMuc3RvcCgpXG4gICAgICBAc3JjLmRpc2Nvbm5lY3QoMClcbiAgICAgIEBzcmMgICAgICAgPSBudWxsXG4gICAgICBAc3JjMS5zdG9wKClcbiAgICAgIEBzcmMxLmRpc2Nvbm5lY3QoMClcbiAgICAgIEBzcmMxICAgICAgPSBudWxsXG4gICAgICBAcHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gbnVsbFxuICAgICAgQGlzUGxheWluZyA9IGZhbHNlXG4gICAgICBAcG9zaXRpb24gID0gMFxuICAgICAgQHN0YXJ0VGltZSA9IDBcblxuICB2b2x1bWU6ICh2b2x1bWUpLT5cbiAgICB2b2x1bWUgPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCB2b2x1bWUpKVxuICAgIEBnYWluTm9kZS5nYWluLnZhbHVlID0gdm9sdW1lXG5cbiAgdXBkYXRlUG9zaXRpb246IC0+XG4gICAgaWYgQGlzUGxheWluZ1xuICAgICAgQHBvc2l0aW9uID0gQGN0eC5jdXJyZW50VGltZSAtIEBzdGFydFRpbWVcblxuICAgIGlmIEBwb3NpdGlvbiA+IEBidWZmZXIuZHVyYXRpb25cbiAgICAgIEBwb3NpdGlvbiA9IEBidWZmZXIuZHVyYXRpb25cbiAgICAgIEBwYXVzZSgpXG5cbiAgICByZXR1cm4gQHBvc2l0aW9uXG5cbiAgc2VlazogKHRpbWUpLT5cbiAgICBpZiBAaXNQbGF5aW5nXG4gICAgICBAcGxheSh0aW1lKVxuICAgIGVsc2VcbiAgICAgIEBwb3NpdGlvbiA9IHRpbWVcblxuICBkZXN0cm95OiAtPlxuICAgIEBzdG9wKClcbiAgICBAX2Rpc2Nvbm5lY3QoKVxuICAgIEBjdHggPSBudWxsXG5cbiAgX2Nvbm5lY3Q6IC0+XG4gICAgQHBhdXNlKCkgaWYgQGlzUGxheWluZ1xuXG4gICAgIyBTZXR1cCBidWZmZXIgc291cmNlXG4gICAgQHNyYyAgICAgICAgICAgICAgICAgPSBAY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpXG4gICAgQHNyYy5idWZmZXIgICAgICAgICAgPSBAYnVmZmVyXG4gICAgQHNyYy5vbmVuZGVkICAgICAgICAgPSBAX29uRW5kZWRcbiAgICBAZHVyYXRpb24gICAgICAgICAgICA9IEBidWZmZXIuZHVyYXRpb25cblxuICAgICMgU2V0dXAgYW5hbHlzZXJcbiAgICBAYW5hbHlzZXIgPSBAY3R4LmNyZWF0ZUFuYWx5c2VyKClcbiAgICBAYW5hbHlzZXIuc21vb3RoaW5nVGltZUNvbnN0YW50ID0gLjNcbiAgICBAYW5hbHlzZXIuZmZ0U2l6ZSA9IDUxMlxuXG4gICAgIyBTZXR1cCBTY3JpcHRQcm9jZXNzb3JcbiAgICBAcHJvY2Vzc29yID0gQGN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoMjA0OCwgMSwgMSlcblxuICAgICMgU2V0cCBHYWluTm9kZVxuICAgIEBnYWluTm9kZSA9IEBjdHguY3JlYXRlR2FpbigpXG5cbiAgICBAc3JjLmNvbm5lY3QoQGFuYWx5c2VyKVxuICAgICMgQHNyYy5jb25uZWN0KEBnYWluTm9kZSlcbiAgICBAYW5hbHlzZXIuY29ubmVjdChAcHJvY2Vzc29yKVxuICAgIEBwcm9jZXNzb3IuY29ubmVjdChAY3R4LmRlc3RpbmF0aW9uKVxuICAgICMgQGdhaW5Ob2RlLmNvbm5lY3QoQGN0eC5kZXN0aW5hdGlvbilcblxuICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBAX29uQXVkaW9Qcm9jZXNzXG4gICAgQHByb2Nlc3Nvci5hcGkgPSBAXG5cbiAgICBAX29sZEJyb3dzZXIoKVxuICAgIEB2b2x1bWUoMClcblxuICAgICMgVEVTVFxuICAgIEBzcmMxICAgICAgICA9IEBjdHguY3JlYXRlQnVmZmVyU291cmNlKClcbiAgICBAc3JjMS5idWZmZXIgPSBAYnVmZmVyXG4gICAgQHNyYzEuY29ubmVjdChAZ2Fpbk5vZGUpXG4gICAgQGdhaW5Ob2RlLmNvbm5lY3QoQGN0eC5kZXN0aW5hdGlvbilcblxuICBfZGlzY29ubmVjdDogLT5cbiAgICBAYW5hbHlzZXIuZGlzY29ubmVjdCgwKSAgaWYgQGFuYWx5c2VyXG4gICAgQHByb2Nlc3Nvci5kaXNjb25uZWN0KDApIGlmIEBwcm9jZXNzb3JcblxuICBfb25BdWRpb1Byb2Nlc3M6ID0+XG4gICAgQG9uYXVkaW9wcm9jZXNzKCkgaWYgQG9uYXVkaW9wcm9jZXNzXG5cbiAgX29uRW5kZWQ6ID0+XG4gICAgQHNyYy5kaXNjb25uZWN0KDApXG4gICAgQHNyYzEuZGlzY29ubmVjdCgwKVxuICAgIEBzcmMgICAgICAgICAgICAgICAgICAgICAgPSBudWxsXG4gICAgQHNyYzEgICAgICAgICAgICAgICAgICAgICA9IG51bGxcbiAgICBAcHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gbnVsbFxuICAgIEBpc1BsYXlpbmcgICAgICAgICAgICAgICAgPSBmYWxzZVxuICAgIEBvbmVuZGVkKCkgaWYgQG9uZW5kZWRcblxuICBfb2xkQnJvd3NlcjogLT5cbiAgICBpZiBAY3R4IGFuZCB0eXBlb2YgQGN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IgIT0gJ2Z1bmN0aW9uJ1xuICAgICAgQGN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IgPSBAY3R4LmNyZWF0ZUphdmFTY3JpcHROb2RlXG5cbiAgICBpZiBAc3JjIGFuZCB0eXBlb2YgQHNyYy5zdGFydCAhPSAnZnVuY3Rpb24nXG4gICAgICBAc3JjLnN0YXJ0ID0gQHNyYy5ub3RlT25cblxuICAgIGlmIEBzcmMgYW5kIHR5cGVvZiBAc3JjLnN0b3AgIT0gJ2Z1bmN0aW9uJ1xuICAgICAgQHNyYy5zdG9wID0gQHNyYy5ub3RlT2ZmXG5cblxuY2xhc3MgU1BBQ0UuRXF1YWxpemVyIGV4dGVuZHMgVEhSRUUuR3JvdXBcblxuICBjZW50ZXI6ICAgICBudWxsXG5cbiAgX3ZhbHVlczogICAgbnVsbFxuICBfbmV3VmFsdWVzOiBudWxsXG5cbiAgX3RpbWU6ICAgICAgMVxuXG4gICMgVEhSRUVcbiAgbWF0ZXJpYWw6ICAgbnVsbFxuICBsaW5lczogICAgICBudWxsXG5cbiAgIyBQYXJhbWV0ZXJzXG4gIG1heExlbmd0aDogICAgICAgICAwXG4gIG1pbkxlbmd0aDogICAgICAgICAwXG4gIHJhZGl1czogICAgICAgICAgICAwXG4gIGludGVycG9sYXRpb25UaW1lOiAwXG4gIGNvbG9yOiAgICAgICAgICAgICAweEZGRkZGRlxuICBsaW5lRm9yY2VVcDogICAgICAgLjVcbiAgbGluZUZvcmNlRG93bjogICAgIC41XG4gIGxpbmV3aWR0aDogICAgICAgICAwXG4gIGFic29sdXRlOiAgICAgICAgICBmYWxzZVxuICBuYlZhbHVlczogICAgICAgICAgMFxuICBtYXhOYlZhbHVlczogICAgICAgNTEyXG4gIG1pcnJvcjogICAgICAgICAgICB0cnVlXG5cbiAgY29uc3RydWN0b3I6IChvcHRzPXt9KS0+XG4gICAgc3VwZXJcblxuICAgICMgU2V0IHBhcmFtZXRlcnNcbiAgICBkZWZhdWx0cyA9XG4gICAgICBtYXhMZW5ndGg6ICAgICAgICAgMjAwXG4gICAgICBtaW5MZW5ndGg6ICAgICAgICAgNTBcbiAgICAgIHJhZGl1czogICAgICAgICAgICAyNTBcbiAgICAgIGludGVycG9sYXRpb25UaW1lOiAxNTBcbiAgICAgIGNvbG9yOiAgICAgICAgICAgICAweEZGRkZGRlxuICAgICAgbGluZUZvcmNlVXA6ICAgICAgIC41XG4gICAgICBsaW5lRm9yY2VEb3duOiAgICAgLjVcbiAgICAgIGFic29sdXRlOiAgICAgICAgICBmYWxzZVxuICAgICAgbmJWYWx1ZXM6ICAgICAgICAgIDI1NiAjIE1heGltdW0gNTEyIHZhbHVlc1xuICAgICAgbWlycm9yOiAgICAgICAgICAgIHRydWVcbiAgICAgIGxpbmV3aWR0aDogICAgICAgICAyXG5cbiAgICBvcHRzICAgICAgICAgICAgICAgPSBIRUxQRVIuQ29mZmVlLm1lcmdlKGRlZmF1bHRzLCBvcHRzKVxuICAgIEBtaW5MZW5ndGggICAgICAgICA9IG9wdHMubWluTGVuZ3RoXG4gICAgQG1heExlbmd0aCAgICAgICAgID0gb3B0cy5tYXhMZW5ndGhcbiAgICBAcmFkaXVzICAgICAgICAgICAgPSBvcHRzLnJhZGl1c1xuICAgIEBpbnRlcnBvbGF0aW9uVGltZSA9IG9wdHMuaW50ZXJwb2xhdGlvblRpbWVcbiAgICBAY29sb3IgICAgICAgICAgICAgPSBvcHRzLmNvbG9yXG4gICAgQGxpbmVGb3JjZVVwICAgICAgID0gb3B0cy5saW5lRm9yY2VVcFxuICAgIEBsaW5lRm9yY2VEb3duICAgICA9IG9wdHMubGluZUZvcmNlRG93blxuICAgIEBhYnNvbHV0ZSAgICAgICAgICA9IG9wdHMuYWJzb2x1dGVcbiAgICBAbmJWYWx1ZXMgICAgICAgICAgPSBvcHRzLm5iVmFsdWVzXG4gICAgQG1pcnJvciAgICAgICAgICAgID0gb3B0cy5taXJyb3JcbiAgICBAbGluZXdpZHRoICAgICAgICAgPSBvcHRzLmxpbmV3aWR0aFxuXG4gICAgIyBTZXQgdmFsdWVzXG4gICAgQGNlbnRlciAgICAgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgQF92YWx1ZXMgICAgPSBAbXV0ZShmYWxzZSlcbiAgICBAX25ld1ZhbHVlcyA9IEBtdXRlKGZhbHNlKVxuXG4gICAgQGdlbmVyYXRlKClcblxuICAgIEBfZXZlbnRzKClcbiAgICBAdXBkYXRlVmFsdWVzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVHJhY2suSVNfU1RPUFBFRC50eXBlLCBAX2VUcmFja0lzU3RvcHBlZClcblxuICBfZVRyYWNrSXNTdG9wcGVkOiA9PlxuICAgIEBtdXRlKClcblxuICBzZXROYlZhbHVlczogKG5iVmFsdWVzKS0+XG4gICAgQG5iVmFsdWVzID0gbmJWYWx1ZXNcbiAgICBAbXV0ZSgpXG5cbiAgc2V0VmFsdWVzOiAodmFsdWVzKS0+XG4gICAgaWYgQG1pcnJvclxuICAgICAgZGF0YXMgID0gQXJyYXkoQG5iVmFsdWVzKVxuICAgICAgZm9yIGkgaW4gWzAuLigoQG5iVmFsdWVzKi41KS0xKV1cbiAgICAgICAgZGF0YXNbaV0gPSBkYXRhc1tAbmJWYWx1ZXMtMS1pXSA9IHZhbHVlc1tpXVxuICAgICAgdmFsdWVzID0gZGF0YXNcblxuICAgIG5ld1ZhbHVlcyA9IEBtdXRlKGZhbHNlKVxuICAgIGZvciB2YWx1ZSwgaSBpbiB2YWx1ZXNcbiAgICAgIHZhbHVlID0gTWF0aC5hYnModmFsdWUpIGlmIEBhYnNvbHV0ZVxuICAgICAgdmFsdWUgPSAwIGlmIHR5cGVvZiB2YWx1ZSA9PSAndW5kZWZpbmVkJ1xuXG4gICAgICBsZW5ndGggPSBAbWluTGVuZ3RoICsgcGFyc2VGbG9hdCh2YWx1ZSkqKEBtYXhMZW5ndGggLSBAbWluTGVuZ3RoKVxuICAgICAgbmV3VmFsdWVzW2ldID0gTWF0aC5tYXgobGVuZ3RoLCAwKVxuICAgIEBfbmV3VmFsdWVzID0gbmV3VmFsdWVzXG4gICAgQHJlc2V0SW50ZXJwb2xhdGlvbigpXG5cbiAgZ2VuZXJhdGU6IC0+XG4gICAgQG11dGUoKVxuXG4gICAgQG1hdGVyaWFsICAgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQGNvbG9yLCBsaW5ld2lkdGg6IEBsaW5ld2lkdGggfSlcbiAgICBAbGluZXMgICAgICA9IFtdXG5cbiAgICBAdXBkYXRlKDApXG4gICAgQHVwZGF0ZUdlb21ldHJpZXModHJ1ZSlcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIEBfdGltZSArPSBkZWx0YVxuICAgIHQgPSBAX3RpbWUgLyBAaW50ZXJwb2xhdGlvblRpbWVcbiAgICByZXR1cm4gaWYgdCA+IDFcblxuICAgIGZvciBpIGluIFswLi4oQG1heE5iVmFsdWVzLTEpXVxuICAgICAgZGlmZiAgICAgICAgPSBAX3ZhbHVlc1tpXSAtIEBfbmV3VmFsdWVzW2ldXG4gICAgICBAX3ZhbHVlc1tpXSA9IEBfdmFsdWVzW2ldIC0gdCAqIGRpZmZcbiAgICBAdXBkYXRlR2VvbWV0cmllcygpXG5cbiAgdXBkYXRlVmFsdWVzOiA9PlxuICAgIGlmIFNQQUNFLkp1a2Vib3guc3RhdGUgPT0gRU5VTS5KdWtlYm94U3RhdGUuSVNfUExBWUlORyBhbmQgU1BBQ0UuSnVrZWJveC53YXZlZm9ybURhdGEubW9ub1xuICAgICAgQHNldFZhbHVlcyhTUEFDRS5KdWtlYm94LndhdmVmb3JtRGF0YS5tb25vKVxuICAgIHNldFRpbWVvdXQoQHVwZGF0ZVZhbHVlcywgQGludGVycG9sYXRpb25UaW1lICogLjUpXG5cbiAgdXBkYXRlR2VvbWV0cmllczogKGNyZWF0ZT1mYWxzZSktPlxuICAgIGZvciBsZW5ndGgsIGkgaW4gQF92YWx1ZXNcbiAgICAgIGFuZ2xlICA9IE1hdGguUEkgKiAyICogaSAvIEBuYlZhbHVlc1xuXG4gICAgICBmcm9tID0gQGNvbXB1dGVQb3NpdGlvbihAY2VudGVyLCBhbmdsZSwgQHJhZGl1cy1sZW5ndGgqQGxpbmVGb3JjZURvd24pXG4gICAgICB0byAgID0gQGNvbXB1dGVQb3NpdGlvbihAY2VudGVyLCBhbmdsZSwgQHJhZGl1cytsZW5ndGgqQGxpbmVGb3JjZVVwKVxuXG4gICAgICBpZiB0eXBlb2YgQGxpbmVzW2ldID09ICd1bmRlZmluZWQnXG4gICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KClcbiAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChmcm9tLCB0bywgZnJvbSlcblxuICAgICAgICBsaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIEBtYXRlcmlhbClcbiAgICAgICAgQGxpbmVzLnB1c2gobGluZSlcbiAgICAgICAgQGFkZChsaW5lKVxuICAgICAgZWxzZVxuICAgICAgICBsaW5lID0gQGxpbmVzW2ldXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNbMF0gPSBmcm9tXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNbMV0gPSB0b1xuICAgICAgICBsaW5lLmdlb21ldHJ5LnZlcnRpY2VzWzJdID0gZnJvbVxuICAgICAgICBsaW5lLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWVcblxuICByYW5kb206IChzZXRWYWx1ZXM9dHJ1ZSk9PlxuICAgIHZhbHVlcyA9IFtdXG4gICAgZm9yIGkgaW4gWzAuLihAbWF4TmJWYWx1ZXMtMSldXG4gICAgICB2YWx1ZXNbaV0gPSBNYXRoLnJhbmRvbSgpXG4gICAgQHNldFZhbHVlcyh2YWx1ZXMpIGlmIHNldFZhbHVlc1xuICAgIHJldHVybiB2YWx1ZXNcblxuICBtdXRlOiAoc2V0VmFsdWVzPXRydWUpLT5cbiAgICB2YWx1ZXMgPSBbXVxuICAgIGZvciBpIGluIFswLi4oQG1heE5iVmFsdWVzLTEpXVxuICAgICAgdmFsdWVzW2ldID0gMFxuICAgIEBzZXRWYWx1ZXModmFsdWVzKSBpZiBzZXRWYWx1ZXNcbiAgICByZXR1cm4gdmFsdWVzXG5cbiAgcmVzZXRJbnRlcnBvbGF0aW9uOiAtPlxuICAgIEBfdGltZSA9IDBcblxuICBjb21wdXRlUG9zaXRpb246IChwb2ludCwgYW5nbGUsIGxlbmd0aCktPlxuICAgIHggPSBwb2ludC54ICsgTWF0aC5zaW4oYW5nbGUpICogbGVuZ3RoXG4gICAgeSA9IHBvaW50LnkgKyBNYXRoLmNvcyhhbmdsZSkgKiBsZW5ndGhcbiAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoeCwgeSwgcG9pbnQueilcblxuICByZW1vdmVMaW5lRnJvbVBhcmVudDogKGluZGV4KS0+XG4gICAgcGFyZW50ID0gQGxpbmVzW2luZGV4XVxuICAgIHBhcmVudC5yZW1vdmUoQGxpbmVzW2luZGV4XSlcblxuXG5jbGFzcyBTUEFDRS5TcGFjZXNoaXAgZXh0ZW5kcyBUSFJFRS5Hcm91cFxuXG4gIHRpbWU6IDBcblxuICBzaGlwOiBudWxsXG4gIHBhdGg6IG51bGxcbiAgZHVyYXRpb246IDBcbiAgc29uZ0R1cmF0aW9uOiAwXG5cbiAgc3RhdGU6IG51bGxcblxuICBhbmdsZTogMFxuXG4gIF9jYWNoZWQ6IG51bGxcblxuICAjIFNUQVRFU1xuICBASURMRTogICAgICdJRExFJ1xuICBATEFVTkNIRUQ6ICdMQVVOQ0hFRCdcbiAgQElOX0xPT1A6ICAnSU5fTE9PUCdcbiAgQEFSUklWRUQ6ICAnQVJSSVZFRCdcblxuICBjb25zdHJ1Y3RvcjogKHRhcmdldCwgcmFkaXVzKS0+XG4gICAgc3VwZXJcblxuICAgIEB0YXJnZXQgPSBuZXcgVEhSRUUuVmVjdG9yMyh0YXJnZXQueCwgdGFyZ2V0LnksIDUpXG4gICAgQHJhZGl1cyA9IHJhZGl1c1xuICAgIEBhbmdsZSAgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDJcblxuICAgIEBzZXRTdGF0ZShTcGFjZXNoaXBTdGF0ZS5JRExFKVxuXG4gICAgQHNldHVwKClcblxuICBzZXRSYWRpdXM6IChyYWRpdXMpLT5cbiAgICBAcmFkaXVzID0gcmFkaXVzXG4gICAgQF9jYWNoZWQgPSBAX2NvbXB1dGVQYXRocygpXG5cbiAgc2V0dXA6IC0+XG4gICAgZyA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpXG4gICAgZy52ZXJ0aWNlcy5wdXNoKFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoICAwLCAtNTIuNSwgLTEwKVxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLTEwLCAtNjcuNSwgIDEwKVxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLTUwLCAtNDIuNSwgIDEwKVxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoICAwLCAgNjcuNSwgIDEwKVxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoKzUwLCAtNDIuNSwgIDEwKVxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoKzEwLCAtNjcuNSwgIDEwKVxuICAgIClcbiAgICBnLmZhY2VzLnB1c2goXG4gICAgICBuZXcgVEhSRUUuRmFjZTMoMCwgMywgMSksXG4gICAgICBuZXcgVEhSRUUuRmFjZTMoMSwgMiwgMyksXG4gICAgICBuZXcgVEhSRUUuRmFjZTMoMywgMCwgNSksXG4gICAgICBuZXcgVEhSRUUuRmFjZTMoNSwgNCwgMylcbiAgICApXG4gICAgZy5jb21wdXRlRmFjZU5vcm1hbHMoKVxuICAgIG1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KClcbiAgICBtYXRyaXgubWFrZVJvdGF0aW9uWChNYXRoLlBJKi41KVxuICAgIGcuYXBwbHlNYXRyaXgobWF0cml4KVxuICAgIG1hdHJpeC5tYWtlUm90YXRpb25aKE1hdGguUEkpXG4gICAgZy5hcHBseU1hdHJpeChtYXRyaXgpXG5cbiAgICBAc2hpcCA9IFRIUkVFLlNjZW5lVXRpbHMuY3JlYXRlTXVsdGlNYXRlcmlhbE9iamVjdChnLCBbXG4gICAgICBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweEZGRkZGRiwgc2lkZTogVEhSRUUuRG91YmxlU2lkZSB9KVxuICAgIF0pXG4gICAgQHNoaXAuY2FzdFNoYWRvdyA9IHRydWVcbiAgICBAc2hpcC5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgIEBzaGlwLnNjYWxlLnNldCguMTUsIC4xNSwgLjE1KVxuICAgIEBhZGQoQHNoaXApXG5cbiAgICBAX2NhY2hlZCA9IEBfY29tcHV0ZVBhdGhzKClcbiAgICB2ID0gQF9jYWNoZWQubGF1bmNoZWRQYXRoLmdldFBvaW50QXQoMClcbiAgICBAc2hpcC5wb3NpdGlvbi5zZXQodi54LCB2LnksIHYueilcblxuICBzZXRTdGF0ZTogKHN0YXRlKS0+XG4gICAgQHN0YXRlID0gc3RhdGVcbiAgICBzd2l0Y2ggc3RhdGVcbiAgICAgIHdoZW4gU3BhY2VzaGlwU3RhdGUuSURMRVxuICAgICAgICAjIFNQQUNFLkxPRygnSURMRScpXG4gICAgICAgIEBwYXRoID0gbnVsbFxuICAgICAgd2hlbiBTcGFjZXNoaXBTdGF0ZS5MQVVOQ0hFRFxuICAgICAgICAjIFNQQUNFLkxPRygnTEFVTkNIRUQnKVxuICAgICAgICBAX3Jlc2V0VGltZSgpXG4gICAgICAgIEBwYXRoID0gQF9jYWNoZWQubGF1bmNoZWRQYXRoXG4gICAgICAgIEBkdXJhdGlvbiA9IDEwICogMTAwMFxuXG4gICAgICAgIHYgPSBAcGF0aC5nZXRQb2ludCgwKVxuICAgICAgICBAc2hpcC5wb3NpdGlvbi5zZXQodi54LCB2LnksIHYueilcbiAgICAgIHdoZW4gU3BhY2VzaGlwU3RhdGUuSU5fTE9PUFxuICAgICAgICAjIFNQQUNFLkxPRygnSU5fTE9PUCcpXG4gICAgICAgIEBfcmVzZXRUaW1lKClcbiAgICAgICAgQHBhdGggPSBAdGVzdG5ld2xvb3AoKSAjQF9jYWNoZWQuaW5Mb29wUGF0aFxuICAgICAgICBAZHVyYXRpb24gPSA1ICogMTAwMCNAc29uZ0R1cmF0aW9uXG5cbiAgICAgICAgdiA9IEBwYXRoLmdldFBvaW50KDApXG4gICAgICAgIEBzaGlwLnBvc2l0aW9uLnNldCh2LngsIHYueSwgdi56KVxuXG4gICAgICAgICMgQHNoaXBSb3RhdGlvblogPSBAc2hpcC5yb3RhdGlvbi56XG4gICAgICAgICMgJChAc2hpcC5yb3RhdGlvbikuYW5pbWF0ZSh7XG4gICAgICAgICMgICB6OiAwXG4gICAgICAgICMgfSwge1xuICAgICAgICAjICAgZHVyYXRpb246IDUwMFxuICAgICAgICAjICAgcHJvZ3Jlc3M6IChvYmplY3QpPT5cbiAgICAgICAgIyAgICAgQHNoaXBSb3RhdGlvblogPSBvYmplY3QudHdlZW5zWzBdLm5vd1xuICAgICAgICAjIH0pXG4gICAgICB3aGVuIFNwYWNlc2hpcFN0YXRlLkFSUklWRURcbiAgICAgICAgIyBTUEFDRS5MT0coJ0FSUklWRUQnKVxuICAgICAgICBAcGF0aCA9IG51bGxcbiAgICAgICAgQHBhcmVudC5yZW1vdmUoQClcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldFN0YXRlKFNwYWNlc2hpcFN0YXRlLklETEUpXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cbiAgICBpZiBAc3RhdGUgIT0gU3BhY2VzaGlwU3RhdGUuSURMRSBhbmQgQHN0YXRlICE9IFNwYWNlc2hpcFN0YXRlLkFSUklWRURcblxuICAgICAgdCA9IE1hdGgubWluKEB0aW1lIC8gQGR1cmF0aW9uLCAxKVxuXG4gICAgICBpZiB0ID49IDFcbiAgICAgICAgQF9yZXNldFRpbWUoKVxuICAgICAgICBpZiBAc3RhdGUgPT0gU3BhY2VzaGlwU3RhdGUuTEFVTkNIRURcbiAgICAgICAgICBAc2V0U3RhdGUoU3BhY2VzaGlwU3RhdGUuSU5fTE9PUClcbiAgICAgICAgZWxzZSBpZiBAc3RhdGUgPT0gU3BhY2VzaGlwU3RhdGUuSU5fTE9PUFxuICAgICAgICAgICMgY29uc29sZS5sb2cgJ25leHQgbW92ZT8nXG4gICAgICAgICAgQHBhdGggPSBAdGVzdG5ld2xvb3AoKVxuICAgICAgICAgIEBkdXJhdGlvbiA9ICg1ICsgKE1hdGgucmFuZG9tKCkgKiAxMCkpICogMTAwMFxuICAgICAgICAgICMgQHNldFN0YXRlKFNwYWNlc2hpcFN0YXRlLkFSUklWRUQpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBpZiBAc3RhdGUgPT0gU3BhY2VzaGlwU3RhdGUuTEFVTkNIRURcbiAgICAgICAgQHRpbWUgKz0gZGVsdGFcbiAgICAgICAgdCA9IF9FYXNpbmcuUXVhZHJhdGljRWFzZU91dCh0KVxuXG4gICAgICAjIFRNUFxuICAgICAgaWYgQHN0YXRlID09IFNwYWNlc2hpcFN0YXRlLklOX0xPT1BcbiAgICAgICAgQHRpbWUgKz0gZGVsdGFcbiAgICAgICAgIyBjb25zb2xlLmxvZyBAdGltZVxuXG4gICAgICBAX3Byb2dyZXNzKHQpIGlmIHRcblxuICBfcmVzZXRUaW1lOiAtPlxuICAgIEB0aW1lID0gMFxuXG4gIF9wcm9ncmVzczogKHQpLT5cbiAgICB2ID0gQHBhdGguZ2V0UG9pbnRBdCh0KVxuICAgIEBzaGlwLnBvc2l0aW9uLnNldCh2LngsIHYueSwgdi56KVxuXG4gICAgYWhlYWQgPSAgTWF0aC5taW4odCArIDEwIC8gQHBhdGguZ2V0TGVuZ3RoKCksIDEpXG4gICAgdiA9IEBwYXRoLmdldFBvaW50QXQoYWhlYWQpLm11bHRpcGx5U2NhbGFyKCAxIClcbiAgICBAc2hpcC5sb29rQXQodilcblxuICAgIGlmIEBzdGF0ZSA9PSBTcGFjZXNoaXBTdGF0ZS5MQVVOQ0hFRFxuICAgICAgc2NhbGUgPSAuMjUgKyAoMSAtIHQpICogLjM1XG4gICAgICBAc2hpcC5zY2FsZS5zZXQoc2NhbGUsIHNjYWxlLCBzY2FsZSlcblxuICAgICMgaWYgQHN0YXRlID09IFNwYWNlc2hpcFN0YXRlLklOX0xPT1BcbiAgICAjICAgQHNoaXAucm90YXRpb24uc2V0KEBzaGlwLnJvdGF0aW9uLngsIEBzaGlwLnJvdGF0aW9uLnksIEBzaGlwUm90YXRpb25aKVxuXG4gIF9jb21wdXRlUGF0aHM6IC0+XG4gICAgZnJvbUEgICAgID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIGZyb21BLnggICA9IEB0YXJnZXQueCArIE1hdGguY29zKEBhbmdsZSkgKiA1MDBcbiAgICBmcm9tQS55ICAgPSBAdGFyZ2V0LnkgKyBNYXRoLnNpbihAYW5nbGUpICogNTAwXG4gICAgZnJvbUEueiAgID0gNjAwXG5cbiAgICBwYXRoICAgICAgICAgICA9IG5ldyBUSFJFRS5Jbkxvb3BDdXJ2ZShAdGFyZ2V0LCBAYW5nbGUsIEByYWRpdXMpXG4gICAgcGF0aC5pbnZlcnNlICAgPSB0cnVlXG4gICAgcGF0aC51c2VHb2xkZW4gPSB0cnVlXG5cbiAgICAjIyBDcmVhdGUgcGF0aCBsYXVuY2hlZFxuICAgIG1pZCAgICAgID0gcGF0aC5nZXRQb2ludCgwKVxuICAgIHJlZiAgICAgID0gcGF0aC5nZXRQb2ludCguMDI1KVxuICAgIGFuZ2xlICAgID0gX01hdGguYW5nbGVCZXR3ZWVuUG9pbnRzKG1pZCwgcmVmKSArIE1hdGguUElcbiAgICBkaXN0YW5jZSA9IG1pZC5kaXN0YW5jZVRvKHJlZilcblxuICAgIGN1cnZlUG9pbnQgICA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICBjdXJ2ZVBvaW50LnggPSBtaWQueCArIE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlXG4gICAgY3VydmVQb2ludC55ID0gbWlkLnkgKyBNYXRoLnNpbihhbmdsZSkgKiBkaXN0YW5jZVxuICAgIGN1cnZlUG9pbnQueiA9IG1pZC56XG5cbiAgICB0b0EgICAgPSBwYXRoLmdldFBvaW50KDApXG4gICAgY3VydmUgID0gbmV3IFRIUkVFLkxhdW5jaGVkQ3VydmUoZnJvbUEsIHRvQSlcbiAgICBwb2ludHMgPSBjdXJ2ZS5nZXRQb2ludHMoMTApXG4gICAgIyBwb2ludHMucHVzaCh0b0EpXG5cbiAgICBmb3IgcHQsIGkgaW4gcGF0aC5nZXRQb2ludHMoMTApXG4gICAgICBwb2ludHMucHVzaChwdCkgaWYgaSA+IDBcblxuICAgIGN1cnZlQSA9IF9USFJFRS5IZXJtaXRlQ3VydmUocG9pbnRzKVxuXG4gICAgIyMgQ3JlYXRlIHBhdGggaW4gdGhlIGxvb3BcbiAgICBjdXJ2ZUIgPSBwYXRoI19USFJFRS5IZXJtaXRlQ3VydmUocGF0aC5nZXRQb2ludHMoMTApKVxuXG4gICAgIyBAX2RlYnVnUGF0aChjdXJ2ZUEpXG4gICAgIyBAX2RlYnVnUGF0aChjdXJ2ZUIpXG5cbiAgICAjIEB0ZXN0bmV3bG9vcCgpXG5cbiAgICByZXR1cm4geyBsYXVuY2hlZFBhdGg6IGN1cnZlQSwgaW5Mb29wUGF0aDogY3VydmVCIH1cblxuICB0ZXN0bmV3bG9vcDogLT5cbiAgICBUSFJFRS5OZXdMb29wID0gVEhSRUUuQ3VydmUuY3JlYXRlKFxuICAgICAgKHYwLCByYWRpdXM9IDEwMCwgc3RhcnRBbmdsZT0wKS0+XG4gICAgICAgIEB2MCAgICAgICAgID0gdjBcbiAgICAgICAgQHJhZGl1cyAgICAgPSByYWRpdXNcbiAgICAgICAgQHN0YXJ0QW5nbGUgPSBzdGFydEFuZ2xlXG4gICAgICAgIEByYW5kQW5nbGUgID0gTWF0aC5yYW5kb20oKSAqIE1hdGguUEkgKiAyXG4gICAgICAgIEBkaXJlY3Rpb24gID0gaWYgTWF0aC5yYW5kb20oKSA+IC41IHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG4gICAgICAgIEB0ZXN0ICAgICAgID0gTWF0aC5yYW5kb20oKVxuICAgICAgICByZXR1cm5cbiAgICAgICwgKHQpLT5cbiAgICAgICAgdCAgICAgID0gMSAtIHQgaWYgQGRpcmVjdGlvblxuICAgICAgICBhbmdsZSAgPSAoTWF0aC5QSSAqIDIpICogdFxuICAgICAgICBhbmdsZSAgKz0gQHN0YXJ0QW5nbGVcblxuICAgICAgICB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgICAgIHZlY3Rvci54ID0gQHYwLnggKyBNYXRoLmNvcyhhbmdsZSkgKiBAcmFkaXVzXG4gICAgICAgIHZlY3Rvci55ID0gQHYwLnkgKyBNYXRoLmNvcyhhbmdsZSArIEByYW5kQW5nbGUpICogKEByYWRpdXMgKiAyICogQHRlc3QpXG4gICAgICAgIHZlY3Rvci56ID0gQHYwLnogKyBNYXRoLnNpbihhbmdsZSkgKiBAcmFkaXVzXG4gICAgICAgIHJldHVybiB2ZWN0b3JcblxuICAgICAgICAjIHQgICAgID0gMSAtIHQgaWYgQGludmVyc2VcbiAgICAgICAgIyBpZiBAdXNlR29sZGVuXG4gICAgICAgICMgICAgIHBoaSAgID0gKE1hdGguc3FydCg1KSsxKS8yIC0gMVxuICAgICAgICAjICAgICBnb2xkZW5fYW5nbGUgPSBwaGkgKiBNYXRoLlBJICogMlxuICAgICAgICAjICAgICBhbmdsZSA9IEBzdGFydEFuZ2xlICsgKGdvbGRlbl9hbmdsZSAqIHQpXG4gICAgICAgICMgICAgIGFuZ2xlICs9IE1hdGguUEkgKiAtMS4yMzVcbiAgICAgICAgIyBlbHNlXG4gICAgICAgICMgICAgIGFuZ2xlID0gQHN0YXJ0QW5nbGUgKyAoTWF0aC5QSSAqIDIgKiB0KVxuXG4gICAgICAgICMgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgICAgICAjIHZlY3Rvci54ID0gQHYwLnggKyBNYXRoLmNvcyhhbmdsZSkgKiAoQG1pblJhZGl1cyArIEByYWRpdXMgKiB0KVxuICAgICAgICAjIHZlY3Rvci55ID0gQHYwLnkgKyBNYXRoLnNpbihhbmdsZSkgKiAoQG1pblJhZGl1cyArIEByYWRpdXMgKiB0KVxuICAgICAgICAjIHZlY3Rvci56ID0gQHYwLnpcbiAgICAgICAgIyByZXR1cm4gdmVjdG9yXG4gICAgKVxuXG4gICAgbmV3bG9vcCA9IG5ldyBUSFJFRS5OZXdMb29wKEB0YXJnZXQsIDE1MCwgTWF0aC5QSSotLjUpXG4gICAgcmV0dXJuIG5ld2xvb3BcbiAgICAjIEBfZGVidWdQYXRoKG5ld2xvb3ApXG5cblxuICBfZGVidWdQYXRoOiAocGF0aCwgY29sb3I9MHhGRjAwMDApLT5cbiAgICBnICAgID0gbmV3IFRIUkVFLlR1YmVHZW9tZXRyeShwYXRoLCAyMDAsIC41LCAxMCwgdHJ1ZSlcbiAgICB0dWJlID0gVEhSRUUuU2NlbmVVdGlscy5jcmVhdGVNdWx0aU1hdGVyaWFsT2JqZWN0KCBnLCBbXG4gICAgICBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgICBvcGFjaXR5OiAwLjMsXG4gICAgICAgICAgd2lyZWZyYW1lOiB0cnVlLFxuICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlXG4gICAgICB9KSxcbiAgICAgIG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4RkY4OEZGLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlIH0pXG4gICAgXSlcbiAgICBAYWRkKHR1YmUpXG5cblxuY2xhc3MgU1BBQ0UuREVGQVVMVC5TZXR1cCBleHRlbmRzIFRIUkVFLkdyb3VwXG5cbiAganVrZWJveDogbnVsbFxuICBwbGF5bGlzdDogbnVsbFxuICBjdXJyZW50OiBudWxsXG4gIGNvdmVyOiBudWxsXG5cbiAgb25hZGQ6IGZhbHNlXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcbiAgICBAanVrZWJveCA9IFNQQUNFLkp1a2Vib3hcblxuICBvbkVudGVyOiAoY2FsbGJhY2spLT5cbiAgICBjYWxsYmFjaygpIGlmIGNhbGxiYWNrXG4gICAgQHNldHVwKClcblxuICBvbkV4aXQ6IChjYWxsYmFjayktPlxuICAgIGNhbGxiYWNrKCkgaWYgY2FsbGJhY2tcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSnVrZWJveC5JU19TVE9QUEVELnR5cGUsIEBfZUp1a2Vib3hJc1N0b3BwZWQpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5Db3Zlci5URVhUVVJFU19MT0FERUQudHlwZSwgQF9lQ292ZXJUZXh0dXJlc0xvYWRlZClcblxuICBfZUp1a2Vib3hJc1N0b3BwZWQ6IChlKT0+XG4gICAgQF9sYXVuY2goKVxuXG4gIF9lQ292ZXJUZXh0dXJlc0xvYWRlZDogKGUpPT5cbiAgICBAX2xhdW5jaCgpXG5cbiAgX2xhdW5jaDogLT5cbiAgICBmb3IgdHJhY2sgaW4gQHBsYXlsaXN0XG4gICAgICBAanVrZWJveC5hZGQodHJhY2spXG5cbiAgc2V0dXA6IC0+XG4gICAgQGZldGNoVHJhY2tzKClcbiAgICBAY292ZXIgPSBuZXcgU1BBQ0UuREVGQVVMVC5Db3ZlcigpXG4gICAgQGFkZChAY292ZXIpXG4gICAgQF9ldmVudHMoKVxuXG4gIGZldGNoVHJhY2tzOiAtPlxuICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmVxLm9wZW4oJ0dFVCcsICdyZXNvdXJjZXMvcGxheWxpc3QuanNvbicsIHRydWUpXG4gICAgcmVxLm9ubG9hZCA9IChlKT0+XG4gICAgICBAcGxheWxpc3QgPSBKU09OLnBhcnNlKGUudGFyZ2V0LnJlc3BvbnNlKVxuXG4gICAgICBAY292ZXIubG9hZChAcGxheWxpc3QpXG5cblxuXG4gICAgICAjIGZvciB0cmFjayBpbiBAcGxheWxpc3RcbiAgICAgICMgICBAanVrZWJveC5hZGQodHJhY2spXG5cblxuXG5cbiAgICAgICAgIyAkKCcjY292ZXIgdWwnKS5hcHBlbmQoJzxsaT48L2xpPicpXG4gICAgICAgICMgJCgnI2NvdmVyIHVsIGxpJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChyZXNvdXJjZXMvY292ZXJzLycrdHJhY2suY292ZXIrJyknKVxuICAgICAgIyAkKCcjY292ZXIgdWwgbGk6Zmlyc3QtY2hpbGQnKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICByZXEuc2VuZChudWxsKVxuXG4gICMgbmV4dDogLT5cbiAgIyAgIGlmIEBwbGF5bGlzdC5sZW5ndGggPiAwXG4gICMgICAgIEBjdXJyZW50ID0gQHBsYXlsaXN0LnNoaWZ0KClcbiAgIyAgIEBqdWtlYm94LmFkZChAY3VycmVudClcbiAgIyAgIEByZWZyZXNoQ292ZXIoKVxuICAjICAgQG9uYWRkID0gdHJ1ZVxuXG4gICMgdXBkYXRlOiAoZGVsdGEpLT5cbiAgIyAgIGlmIEBwbGF5bGlzdCBhbmQgQHBsYXlsaXN0Lmxlbmd0aCBhbmQgQGp1a2Vib3guc3RhdGUgPT0gSnVrZWJveFN0YXRlLklTX1NUT1BQRUQgYW5kIG5vdCBAb25hZGRcbiAgIyAgICAgQG5leHQoKVxuICAjICAgZWxzZSBpZiBAanVrZWJveC5zdGF0ZSA9PSBKdWtlYm94U3RhdGUuSVNfUExBWUlORyBhbmQgQG9uYWRkXG4gICMgICAgIEBvbmFkZCA9IGZhbHNlXG5cblxuY2xhc3MgU1BBQ0UuREVGQVVMVC5Db3ZlciBleHRlbmRzIFRIUkVFLkdyb3VwXG5cbiAgbG9hZGluZ01hbmFnZXI6IG51bGxcbiAgaW1hZ2VMb2FkZXI6IG51bGxcblxuICBwbGFuZTogbnVsbFxuXG4gIHBsYXlsaXN0OiBudWxsXG5cbiAgdGV4dHVyZTA6IG51bGxcbiAgdGV4dHVyZTE6IG51bGxcblxuICBmb3Y6IDBcbiAgYXNwZWN0OiAwXG4gIGRpc3RhbmNlOiAwXG5cbiAgdEZhZGU6IDFcbiAgdFNjYWxlOiAxXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcbiAgICBAX3NldHVwKClcbiAgICBAX2V2ZW50cygpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX1BMQVlJTkcudHlwZSwgQF9lVHJhY2tJc1BsYXlpbmcpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5KdWtlYm94LldJTExfUExBWS50eXBlLCBAX2VKdWtlYm94V2lsbFBsYXkpXG5cbiAgX2VKdWtlYm94V2lsbFBsYXk6IChlKT0+XG4gICAgQG5leHQoKVxuXG4gIF9lVHJhbnNpdGlvbkVuZGVkOiAoZSk9PlxuICAgIEhFTFBFUi50cmlnZ2VyKEVWRU5ULkNvdmVyLlRSQU5TSVRJT05fRU5ERUQpXG5cbiAgX2VUcmFja0lzUGxheWluZzogKGUpPT5cbiAgICB0cmFjayAgICA9IGUub2JqZWN0LnRyYWNrXG4gICAgdGl0bGUgICAgPSB0cmFjay5kYXRhLnRpdGxlXG4gICAgdXNlcm5hbWUgPSB0cmFjay5kYXRhLmF1dGhvclxuICAgIHVzZXJfdXJsID0gdHJhY2suZGF0YS5hdXRob3JfdXJsXG5cbiAgICAkKCcjaW5mb3JtYXRpb24gaDEnKS5odG1sKHRpdGxlKVxuICAgICQoJyNpbmZvcm1hdGlvbiBoMicpLmh0bWwoJ2J5IDxhIGhyZWY9XCInK3VzZXJfdXJsKydcIj4nK3VzZXJuYW1lKyc8L2E+JylcblxuICAgIGNzcyA9IFwiXCJcIlxuICAgICAgICBhIHsgY29sb3I6IFwiXCJcIit0cmFjay5kYXRhLmNvbG9yMStcIlwiXCIgIWltcG9ydGFudDsgfVxuICAgICAgICBib2R5IHsgY29sb3I6IFwiXCJcIit0cmFjay5kYXRhLmNvbG9yMitcIlwiXCIgIWltcG9ydGFudDsgfVxuICAgIFwiXCJcIlxuICAgICQoJy5jb3Zlci1zdHlsZScpLmh0bWwoY3NzKVxuXG4gICAgbmV4dFRyYWNrID0gQHBsYXlsaXN0WzBdXG4gICAgZm9yIHRyYWNrRGF0YSwgaSBpbiBAcGxheWxpc3RcbiAgICAgIGlmIHRyYWNrRGF0YS5jb3ZlciA9PSB0cmFjay5kYXRhLmNvdmVyXG4gICAgICAgIG5leHRUcmFjayA9IEBwbGF5bGlzdFtpKzFdIGlmIGkrMSA8IEBwbGF5bGlzdC5sZW5ndGhcbiAgICAgICAgYnJlYWtcblxuICAgIEB0ZXh0dXJlTG9hZGVyLmxvYWQgJ3Jlc291cmNlcy9jb3ZlcnMvJyt0cmFjay5kYXRhLmNvdmVyLCAodGV4dHVyZSk9PlxuICAgICAgQHRleHR1cmUwID0gdGV4dHVyZVxuICAgICAgQF90ZXh0dXJlTG9hZGVkKClcbiAgICBAdGV4dHVyZUxvYWRlci5sb2FkICdyZXNvdXJjZXMvY292ZXJzLycrbmV4dFRyYWNrLmNvdmVyLCAodGV4dHVyZSk9PlxuICAgICAgQHRleHR1cmUxID0gdGV4dHVyZVxuICAgICAgQF90ZXh0dXJlTG9hZGVkKClcblxuICAgICQoJy5ibHVycmllZCBsaSBkaXYnKS5jc3MoeyBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCB9KVxuICAgICQoJy5ibHVycmllZCBsaSBkaXYnKS5sYXN0KCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChyZXNvdXJjZXMvY292ZXJzLycrdHJhY2suZGF0YS5jb3ZlcisnKScpXG4gICAgJCgnLmJsdXJyaWVkIGxpIGRpdicpLmZpcnN0KCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChyZXNvdXJjZXMvY292ZXJzLycrbmV4dFRyYWNrLmNvdmVyKycpJylcbiAgICAjIEBzZXRDb3ZlcnModHJhY2suZGF0YSwgbmV4dFRyYWNrKVxuXG4gIF9zZXR1cDogLT5cbiAgICBAbG9hZGluZ01hbmFnZXIgICAgICAgID0gbmV3IFRIUkVFLkxvYWRpbmdNYW5hZ2VyKClcbiAgICBAbG9hZGluZ01hbmFnZXIub25Mb2FkID0gQF9zZXR1cFBsYW5lXG4gICAgQGltYWdlTG9hZGVyICAgICAgICAgICA9IG5ldyBUSFJFRS5JbWFnZUxvYWRlcihAbG9hZGluZ01hbmFnZXIpXG4gICAgQHRleHR1cmVMb2FkZXIgICAgICAgICA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKEBsb2FkaW5nTWFuYWdlcilcbiAgICBAbG9hZGVyICAgICAgICAgICAgICAgID0gbmV3IFRIUkVFLlhIUkxvYWRlcihAbG9hZGluZ01hbmFnZXIpXG5cbiAgbG9hZDogKHBsYXlsaXN0KS0+XG4gICAgQHBsYXlsaXN0ID0gcGxheWxpc3RcblxuICAgIGZvciB0cmFjayBpbiBwbGF5bGlzdFxuICAgICAgQGltYWdlTG9hZGVyLmxvYWQgJ3Jlc291cmNlcy9jb3ZlcnMvJyt0cmFjay5jb3ZlciwgKGltYWdlKT0+XG4gICAgICAgIHJldHVybiB0cnVlXG5cbiAgICBAbG9hZGVyLmxvYWQgJ2Fzc2V0cy9zaGFkZXJzL2NvdmVyLmZyYWcnLCAoY29udGVudCk9PlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBAbG9hZGVyLmxvYWQgJ2Fzc2V0cy9zaGFkZXJzL2NvdmVyLnZlcnQnLCAoY29udGVudCk9PlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBAbG9hZGVyLmxvYWQgJ2Fzc2V0cy9zaGFkZXJzL2dhdXNzaWFuX2JsdXIuZnJhZycsIChjb250ZW50KT0+XG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gIF9zZXR1cFBsYW5lOiA9PlxuICAgIHZlcnRleFNoYWRlciAgID0gQGxvYWRlci5jYWNoZS5maWxlc1snYXNzZXRzL3NoYWRlcnMvY292ZXIudmVydCddXG4gICAgZnJhZ21lbnRTaGFkZXIgPSBAbG9hZGVyLmNhY2hlLmZpbGVzWydhc3NldHMvc2hhZGVycy9jb3Zlci5mcmFnJ11cblxuICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKFxuICAgICAgdW5pZm9ybXM6XG4gICAgICAgIHRleHR1cmUwOiB7IHR5cGU6ICd0JywgdmFsdWU6IFtdIH1cbiAgICAgICAgdGV4dHVyZTE6IHsgdHlwZTogJ3QnLCB2YWx1ZTogW10gfVxuICAgICAgICByZXNvbHV0aW9uOiB7IHR5cGU6ICd2MicsIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMigpIH1cbiAgICAgICAgYVRpbWU6IHsgdHlwZTogJ2YnLCB2YWx1ZTogMCB9XG4gICAgICAgIHRGYWRlOiB7IHR5cGU6ICdmJywgdmFsdWU6IDAgfVxuICAgICAgICB0U2NhbGU6IHsgdHlwZTogJ2YnLCB2YWx1ZTogMSB9XG4gICAgICB2ZXJ0ZXhTaGFkZXI6IHZlcnRleFNoYWRlclxuICAgICAgZnJhZ21lbnRTaGFkZXI6IGZyYWdtZW50U2hhZGVyXG4gICAgKVxuXG5cbiAgICBAcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgxLCAxKSwgbWF0ZXJpYWwpXG4gICAgQHBsYW5lLnBvc2l0aW9uLnogPSAtMVxuICAgIEBhZGQoQHBsYW5lKVxuXG4gICAgSEVMUEVSLnRyaWdnZXIoRVZFTlQuQ292ZXIuVEVYVFVSRVNfTE9BREVEKVxuXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUwLnZhbHVlICA9IG5ldyBUSFJFRS5UZXh0dXJlKClcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTEudmFsdWUgPSBuZXcgVEhSRUUuVGV4dHVyZSgpXG5cbiAgICBAbG9hZGluZ01hbmFnZXIub25Mb2FkID0gQF90ZXh0dXJlTG9hZGVkXG5cbiAgX3RleHR1cmVMb2FkZWQ6IChhLCBiLCBjKT0+XG4gICAgaWYgQHRleHR1cmUwICYmIEB0ZXh0dXJlMVxuICAgICAgQHNldENvdmVycyhAdGV4dHVyZTAsIEB0ZXh0dXJlMSlcbiAgICAgIEB0ZXh0dXJlMCA9IEB0ZXh0dXJlMSA9IG51bGxcblxuICBzZXRDb3ZlcnM6IChjdXJyZW50LCBuZXh0KS0+XG4gICAgQHRGYWRlICA9IDFcbiAgICBAdFNjYWxlID0gMVxuICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50U2NhbGUudmFsdWUgPSBAdFNjYWxlXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRGYWRlLnZhbHVlICA9IEB0RmFkZVxuXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUwLnZhbHVlICA9IGN1cnJlbnRcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTEudmFsdWUgPSBuZXh0XG5cbiAgICB0ZXh0dXJlV2lkdGggID0gY3VycmVudC5pbWFnZS53aWR0aFxuICAgIHRleHR1cmVIZWlnaHQgPSBjdXJyZW50LmltYWdlLmhlaWdodFxuXG4gICAgQGZvdiAgICAgID0gbWFuYWdlci5jYW1lcmEuZm92IC8gMTgwICogTWF0aC5QSVxuICAgIEBhc3BlY3QgICA9IHRleHR1cmVXaWR0aCAvIHRleHR1cmVIZWlnaHRcbiAgICBAZGlzdGFuY2UgPSBtYW5hZ2VyLmNhbWVyYS5wb3NpdGlvbi56ICsgMTtcbiAgICByYXRpbyAgICAgPSBNYXRoLm1heCgxLCBtYW5hZ2VyLmNhbWVyYS5hc3BlY3QgLyBAYXNwZWN0KVxuXG4gICAgd2lkdGggID0gMiAqIEBhc3BlY3QgKiBNYXRoLnRhbihAZm92IC8gMikgKiBAZGlzdGFuY2UgKiByYXRpb1xuICAgIGhlaWdodCA9IDIgKiBNYXRoLnRhbihAZm92IC8gMikgKiBAZGlzdGFuY2UgKiByYXRpb1xuXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnJlc29sdXRpb24udmFsdWUueCA9IHdpZHRoXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnJlc29sdXRpb24udmFsdWUueSA9IGhlaWdodFxuICAgIEBwbGFuZS5zY2FsZS5zZXQod2lkdGgsIGhlaWdodCwgMSlcblxuICAjICAgQHRlc3QoY3VycmVudClcblxuICAjIHRlc3Q6IChjdXJyZW50KS0+XG4gICMgICBpbWFnZVdpZHRoICA9IGN1cnJlbnQuaW1hZ2Uud2lkdGhcbiAgIyAgIGltYWdlSGVpZ2h0ID0gY3VycmVudC5pbWFnZS5oZWlnaHRcblxuICAjICAgIyBJbml0aWFsaXplIHJlbmRlcmVyXG4gICMgICB1bmxlc3MgQGNhbWVyYVJUVCBhbmQgQHNjZW5lUlRUIGFuZCBAcnRUZXh0dXJlIyBhbmQgQGNhbWVyYVJUVDEgYW5kIEBzY2VuZVJUVDEgYW5kIEBydFRleHR1cmUxXG4gICMgICAgIEBjYW1lcmFSVFQgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApXG4gICMgICAgICMgQGNhbWVyYVJUVCA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEoIGltYWdlV2lkdGggLyAtIDIsIGltYWdlV2lkdGggLyAyLCBpbWFnZUhlaWdodCAvIDIsIGltYWdlSGVpZ2h0IC8gLSAyLCAtMTAwMDAsIDEwMDAwIClcbiAgIyAgICAgQGNhbWVyYVJUVC5wb3NpdGlvbi5zZXRaKDYwMClcbiAgIyAgICAgIyBAY2FtZXJhUlRUMSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMClcbiAgIyAgICAgIyBAY2FtZXJhUlRUMSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEoIGltYWdlV2lkdGggLyAtIDIsIGltYWdlV2lkdGggLyAyLCBpbWFnZUhlaWdodCAvIDIsIGltYWdlSGVpZ2h0IC8gLSAyLCAtMTAwMDAsIDEwMDAwIClcbiAgIyAgICAgIyBAY2FtZXJhUlRUMS5wb3NpdGlvbi5zZXRaKDYwMClcblxuICAjICAgICBAc2NlbmVSVFQgPSBuZXcgVEhSRUUuU2NlbmUoKVxuICAjICAgICAjIEBzY2VuZVJUVDEgPSBuZXcgVEhSRUUuU2NlbmUoKVxuXG4gICMgICAgIEBydFRleHR1cmUgID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHsgbWluRmlsdGVyOiBUSFJFRS5MaW5lYXJGaWx0ZXIsIG1hZ0ZpbHRlcjogVEhSRUUuTmVhcmVzdEZpbHRlciwgZm9ybWF0OiBUSFJFRS5SR0JGb3JtYXQgfSlcbiAgIyAgICAgIyBAcnRUZXh0dXJlMSA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldCh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0LCB7IG1pbkZpbHRlcjogVEhSRUUuTGluZWFyRmlsdGVyLCBtYWdGaWx0ZXI6IFRIUkVFLk5lYXJlc3RGaWx0ZXIsIGZvcm1hdDogVEhSRUUuUkdCRm9ybWF0IH0pXG5cblxuICAjICAgICBAaEJsdXIgPSBuZXcgVEhSRUUuU2hhZGVyUGFzcyhUSFJFRS5Ib3Jpem9udGFsQmx1clNoYWRlcik7XG4gICMgICAgIEBoQmx1ci5lbmFibGVkID0gdHJ1ZTtcbiAgIyAgICAgQGhCbHVyLnVuaWZvcm1zLmgudmFsdWUgPSAxIC8gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICMgICAgIEB2Qmx1ciA9IG5ldyBUSFJFRS5TaGFkZXJQYXNzKFRIUkVFLlZlcnRpY2FsQmx1clNoYWRlcik7XG4gICMgICAgIEB2Qmx1ci5lbmFibGVkID0gdHJ1ZTtcbiAgIyAgICAgQHZCbHVyLnVuaWZvcm1zLnYudmFsdWUgPSAxIC8gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgIyAgICAgQHJlbmRlclBhc3MgPSBuZXcgVEhSRUUuUmVuZGVyUGFzcyhAc2NlbmVSVFQsIEBjYW1lcmFSVFQpXG5cbiAgIyAgICAgQGVmZmVjdENvcHkgPSBuZXcgVEhSRUUuU2hhZGVyUGFzcyhUSFJFRS5Db3B5U2hhZGVyKVxuXG4gICMgICAgIEBjb21wb3NlciAgID0gbmV3IFRIUkVFLkVmZmVjdENvbXBvc2VyKG1hbmFnZXIucmVuZGVyZXIpXG4gICMgICAgIEBjb21wb3Nlci5hZGRQYXNzKEByZW5kZXJQYXNzKVxuICAjICAgICBAY29tcG9zZXIuYWRkUGFzcyhAaEJsdXIpXG4gICMgICAgIEBjb21wb3Nlci5hZGRQYXNzKEB2Qmx1cilcbiAgIyAgICAgQGNvbXBvc2VyLmFkZFBhc3MoQGVmZmVjdENvcHkpXG5cbiAgIyAgICAgY29uc29sZS5sb2cgQGNvbXBvc2VyXG5cbiAgIyAgIHZlcnRleFNoYWRlciAgID0gQGxvYWRlci5jYWNoZS5maWxlc1snYXNzZXRzL3NoYWRlcnMvY292ZXIudmVydCddXG4gICMgICBmcmFnbWVudFNoYWRlciA9IEBsb2FkZXIuY2FjaGUuZmlsZXNbJ2Fzc2V0cy9zaGFkZXJzL2dhdXNzaWFuX2JsdXIuZnJhZyddXG5cbiAgIyAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKFxuICAjICAgICB1bmlmb3JtczpcbiAgIyAgICAgICB1X3JhZGl1czogeyB0eXBlOiAnZicsIHZhbHVlOiAxMC4wIH1cbiAgIyAgICAgICB1X3RleHR1cmUwOiB7IHR5cGU6ICd0JywgdmFsdWU6IFtdIH1cbiAgIyAgICAgICB1X2RpcmVjdGlvbjogeyB0eXBlOiAndjInLCB2YWx1ZTogbmV3IFRIUkVFLlZlY3RvcjIoKSB9XG4gICMgICAgICAgdV9yZXNvbHV0aW9uOiB7IHR5cGU6ICd2MicsIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMigpIH1cbiAgIyAgICAgdmVydGV4U2hhZGVyOiB2ZXJ0ZXhTaGFkZXJcbiAgIyAgICAgZnJhZ21lbnRTaGFkZXI6IGZyYWdtZW50U2hhZGVyXG4gICMgICApXG5cbiAgIyAgICMgbWF0ZXJpYWwxID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKFxuICAjICAgIyAgIHVuaWZvcm1zOlxuICAjICAgIyAgICAgdV9yYWRpdXM6IHsgdHlwZTogJ2YnLCB2YWx1ZTogMTAuMCB9XG4gICMgICAjICAgICB1X3RleHR1cmUwOiB7IHR5cGU6ICd0JywgdmFsdWU6IFtdIH1cbiAgIyAgICMgICAgIHVfZGlyZWN0aW9uOiB7IHR5cGU6ICd2MicsIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMigpIH1cbiAgIyAgICMgICAgIHVfcmVzb2x1dGlvbjogeyB0eXBlOiAndjInLCB2YWx1ZTogbmV3IFRIUkVFLlZlY3RvcjIoKSB9XG4gICMgICAjICAgdmVydGV4U2hhZGVyOiB2ZXJ0ZXhTaGFkZXJcbiAgIyAgICMgICBmcmFnbWVudFNoYWRlcjogZnJhZ21lbnRTaGFkZXJcbiAgIyAgICMgKVxuXG4gICMgICBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KDEuMCwgMS4wKSwgbWF0ZXJpYWwpXG4gICMgICBwbGFuZS5wb3NpdGlvbi56ID0gLTFcbiAgIyAgIHBsYW5lLnNjYWxlLnNldChAcGxhbmUuc2NhbGUueCwgQHBsYW5lLnNjYWxlLnksIDEuMClcbiAgIyAgIEBzY2VuZVJUVC5hZGQocGxhbmUpXG5cbiAgIyAgICMgcGxhbmUxID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoMS4wLCAxLjApLCBtYXRlcmlhbDEpXG4gICMgICAjIHBsYW5lMS5wb3NpdGlvbi56ID0gLTFcbiAgIyAgICMgcGxhbmUxLnNjYWxlLnNldChAcGxhbmUuc2NhbGUueCwgQHBsYW5lLnNjYWxlLnksIDEuMClcbiAgIyAgICMgQHNjZW5lUlRUMS5hZGQocGxhbmUxKVxuXG4gICMgICBAdGV4dHVyZUxvYWRlci5sb2FkICdyZXNvdXJjZXMvY292ZXJzL2FsbF9kYXkuanBnJywgKHRleHR1cmUpPT5cbiAgIyAgICAgcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudV90ZXh0dXJlMC52YWx1ZSAgID0gdGV4dHVyZVxuICAjICAgICBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy51X2RpcmVjdGlvbi52YWx1ZSAgPSBuZXcgVEhSRUUuVmVjdG9yMigwLCAxKVxuICAjICAgICBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy51X3Jlc29sdXRpb24udmFsdWUgPSBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMucmVzb2x1dGlvbi52YWx1ZVxuXG4gICMgICAgICMgcGxhbmUxLm1hdGVyaWFsLnVuaWZvcm1zLnVfdGV4dHVyZTAudmFsdWUgICA9IEBydFRleHR1cmVcbiAgIyAgICAgIyBwbGFuZTEubWF0ZXJpYWwudW5pZm9ybXMudV9kaXJlY3Rpb24udmFsdWUgID0gbmV3IFRIUkVFLlZlY3RvcjIoMSwgMClcbiAgIyAgICAgIyBwbGFuZTEubWF0ZXJpYWwudW5pZm9ybXMudV9yZXNvbHV0aW9uLnZhbHVlID0gQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnJlc29sdXRpb24udmFsdWVcblxuICAjICAgICAjIHAgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgxLCAxKSwgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweGZmZmZmZiwgbWFwOiBAcnRUZXh0dXJlMSB9ICkpXG4gICMgICAgICMgcC5wb3NpdGlvbi56ID0gMFxuICAjICAgICAjIHAuc2NhbGUuc2V0KEBwbGFuZS5zY2FsZS54LCBAcGxhbmUuc2NhbGUueSwgMS4wKVxuICAjICAgICAjIEBhZGQocClcbiAgIyAgICAgIyBjb25zb2xlLmxvZyBwLm1hdGVyaWFsXG5cbiAgIyAgICAgc2V0VGltZW91dCg9PlxuICAjICAgICAgICMgQGFkZChwbGFuZTEpXG4gICMgICAgICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUwLnZhbHVlID0gQHJ0VGV4dHVyZVxuICAjICAgICAsIDMwMDApXG5cblxuICAjICAgIyBAcmVuZGVyZXJSVFQucmVuZGVyKEBzY2VuZVJUVCwgQGNhbWVyYVJUVCwgQHJ0VGV4dHVyZSlcblxuICAjICAgIyBjb25zb2xlLmxvZyBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTAudmFsdWVcbiAgIyAgICMgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUwLnZhbHVlID0gbmV3IFRIUkVFLlRleHR1cmUoQHJ0VGV4dHVyZS5pbWFnZSwgQHJ0VGV4dHVyZS5tYXBwaW5nKVxuICAjICAgIyBjb25zb2xlLmxvZyBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTAudmFsdWVcblxuICAjICAgIyBzZXRUaW1lb3V0KD0+XG4gICMgICAjICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUwLnZhbHVlLl9fd2ViZ2xUZXh0dXJlID0gcnRUZXh0dXJlLl9fd2ViZ2xUZXh0dXJlXG4gICMgICAjICAgIyBjb25zb2xlLmxvZyBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTAudmFsdWVcbiAgIyAgICMgICAjIGNvbnNvbGUubG9nIHJ0VGV4dHVyZVxuICAjICAgIyAgIHBsYW5lLnBvc2l0aW9uLnogPSAtMTAwXG4gICMgICAjICwgNTAwMClcblxuICByZXNpemU6IC0+XG4gICAgdGV4dHVyZTAgICAgICA9IEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMFxuICAgIHRleHR1cmVXaWR0aCAgPSB0ZXh0dXJlMC5pbWFnZS53aWR0aFxuICAgIHRleHR1cmVIZWlnaHQgPSB0ZXh0dXJlMC5pbWFnZS5oZWlnaHRcblxuICAgIHJhdGlvICA9IE1hdGgubWF4KDEsIG1hbmFnZXIuY2FtZXJhLmFzcGVjdCAvIEBhc3BlY3QpXG5cbiAgICBAcGxhbmUuc2NhbGUuc2V0KDIgKiBAYXNwZWN0ICogTWF0aC50YW4oQGZvdiAvIDIpICogQGRpc3RhbmNlICogcmF0aW8sIDIgKiBNYXRoLnRhbihAZm92IC8gMikgKiBAZGlzdGFuY2UgKiByYXRpbywgMSlcblxuICBuZXh0OiAtPlxuICAgICQoQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRTY2FsZSkuYW5pbWF0ZSh7IHZhbHVlOiAwLjkgfSwgMzUwKVxuICAgICQoQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRGYWRlKS5hbmltYXRlKHsgdmFsdWU6IDAuMCB9LCAzNTApXG4gICAgc2V0VGltZW91dChAX2VUcmFuc2l0aW9uRW5kZWQsIDM1MClcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIGlmIEBwbGFuZVxuICAgICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLmFUaW1lLnZhbHVlICs9IGRlbHRhICogMC4wMDFcblxuICAgICMgaWYgQGNhbWVyYVJUVCBhbmQgQHNjZW5lUlRUIGFuZCBAcnRUZXh0dXJlIyBhbmQgQGNhbWVyYVJUVDEgYW5kIEBzY2VuZVJUVDEgYW5kIEBydFRleHR1cmUxXG4gICAgIyAgIEBjb21wb3Nlci5yZW5kZXIoMC4wMSlcbiAgICAgICMgbWFuYWdlci5yZW5kZXJlci5yZW5kZXIoQHNjZW5lUlRULCBAY2FtZXJhUlRULCBAcnRUZXh0dXJlKVxuICAgICAgI21hbmFnZXIucmVuZGVyZXIucmVuZGVyKEBzY2VuZVJUVDEsIEBjYW1lcmFSVFQxLCBAcnRUZXh0dXJlMSlcblxuXG5cbm1hbmFnZXIgPSBuZXcgU1BBQ0UuU2NlbmVNYW5hZ2VyKClcbm1hbmFnZXIuY3JlYXRlU2NlbmUoJ21haW4nLCBTUEFDRS5NYWluU2NlbmUpXG5tYW5hZ2VyLmdvVG9TY2VuZSgnbWFpbicpXG5cblxuIyBzY2VuZSA9IHNjZW5lUlRUID0gc2NlbmVTY3JlZW4gPSByZW5kZXJlciA9IHJlbmRlcmVyUlRUID0gcmVuZGVyZXJTY3JlZW4gPSBjYW1lcmEgPSBjYW1lcmFSVFQgPSBjYW1lcmFTY3JlZW4gPSBudWxsXG5cbiMgc2NlbmVSVFQgICAgPSBuZXcgVEhSRUUuU2NlbmUoKVxuIyBzY2VuZVNjcmVlbiA9IG5ldyBUSFJFRS5TY2VuZSgpXG4jIHNjZW5lICAgICAgID0gbmV3IFRIUkVFLlNjZW5lKClcblxuIyByZW5kZXJlclJUVCAgICA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKClcbiMgcmVuZGVyZXJTY3JlZW4gPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpXG4jIHJlbmRlcmVyICAgICAgID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKVxuXG4jICAgICBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7YW50aWFsaWFzOiB0cnVlLCBhbHBoYTogZmFsc2V9KVxuIyAgICAgIyBAcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbylcbiMgICAgICMgQHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4NThiMWZmKSlcbiMgICAgIEByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4jICAgICAjIEByZW5kZXJlci5zaGFkb3dNYXBFbmFibGVkID0gdHJ1ZVxuIyAgICAgIyBAcmVuZGVyZXIuc2hhZG93TWFwU29mdCAgICA9IHRydWVcbiMgICAgICMgQHJlbmRlcmVyLnNoYWRvd01hcFR5cGUgICAgPSBUSFJFRS5QQ0ZTaGFkb3dNYXBcbiMgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJykuYXBwZW5kQ2hpbGQoQHJlbmRlcmVyLmRvbUVsZW1lbnQpXG4iXX0=