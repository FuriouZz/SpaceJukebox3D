var manager,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

window.SPACE = window.SPACE || {};

SPACE.ENV = '';

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
    IS_LOADED: new Event('track_is_loaded'),
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
  },
  AudioState: {
    IS_LOADING: 'audio_is_loading',
    IS_PLAYING: 'audio_is_playing',
    IS_PAUSED: 'audio_is_paused',
    IS_ENDED: 'audio_is_ended'
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
    this.renderer.setPixelRatio(window.devicePixelRatio);
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
      interpolationTime: 250
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
      interpolationTime: 250
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

  Track.prototype.timedata = null;

  function Track(data) {
    this._whileplaying = bind(this._whileplaying, this);
    this._onfinish = bind(this._onfinish, this);
    this._onpause = bind(this._onpause, this);
    this._onplay = bind(this._onplay, this);
    this._starting = bind(this._starting, this);
    this._onload = bind(this._onload, this);
    this._eTrackIsStopped = bind(this._eTrackIsStopped, this);
    this._eTrackIsPlaying = bind(this._eTrackIsPlaying, this);
    this.data = data;
    this.SC = SPACE.SC;
    this.timedata = Array(256);
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
    var autoplay, url;
    url = 'resources/sounds/' + this.data.url;
    autoplay = true;
    if (!window.WebAudioAPI) {
      window.WebAudioAPI = window.WebAudioAPI || new SPACE.WebAudioAPI();
      autoplay = false;
    }
    this.api = WebAudioAPI;
    this.api.onplay = this._onplay;
    this.api.onpause = this._onpause;
    this.api.onaudioprocess = this._whileplaying;
    this.api.onended = this._onfinish;
    return this.api.setUrl(url, autoplay, this._onload);
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

  Track.prototype._onload = function() {
    return HELPER.trigger(EVENT.Track.IS_LOADED, {
      track: this
    });
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

  Track.prototype._onpause = function() {
    return HELPER.trigger(EVENT.Track.IS_PAUSED, {
      track: this
    });
  };

  Track.prototype._onfinish = function() {
    HELPER.trigger(EVENT.Track.IS_STOPPED, {
      track: this
    });
    this.api.stop();
    return this._reset();
  };

  Track.prototype._whileplaying = function(e) {
    var analyser, array, i, j, k;
    analyser = this.api.analyser;
    if (!analyser.getFloatTimeDomainData) {
      array = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(array);
      for (i = j = 0; j <= 255; i = ++j) {
        this.timedata[i] = (array[i] - 128) / 128;
      }
    } else {
      array = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(array);
      for (i = k = 0; k <= 255; i = ++k) {
        this.timedata[i] = array[i];
      }
    }
    this.waveformData = {
      mono: this.timedata
    };
    if (this.whileplayingCallback) {
      return this.whileplayingCallback();
    }
  };

  Track.prototype._reset = function() {
    var data, i, j, len, ref1, results1;
    ref1 = this.waveformData.mono;
    results1 = [];
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      data = ref1[i];
      results1.push(data = this.timedata[i] = 0);
    }
    return results1;
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

  WebAudioAPI.prototype.isPlaying = false;

  WebAudioAPI.prototype.isPaused = true;

  WebAudioAPI.prototype.state = null;

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
    this.setState(ENUM.AudioState.IS_ENDED);
  }

  WebAudioAPI.prototype.setUrl = function(url, autoplay, callback) {
    var request;
    if (autoplay == null) {
      autoplay = false;
    }
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
          if (autoplay) {
            _this.play();
          }
          if (callback) {
            return callback();
          }
        }, _this._onError);
      };
    })(this);
    return request.send();
  };

  WebAudioAPI.prototype.setState = function(state) {
    return this.state = state;
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
      this.setState(ENUM.AudioState.IS_PAUSED);
      if (this.onpause) {
        return this.onpause();
      }
    }
  };

  WebAudioAPI.prototype.play = function(position) {
    if (!this.isLoaded) {
      return;
    }
    if (this.state === ENUM.AudioState.IS_PLAYING) {
      this.pause();
      return;
    }
    this._connect();
    this.position = typeof position === 'number' ? position : this.position || 0;
    this.startTime = this.ctx.currentTime - (this.position || 0);
    this.src.start(this.ctx.currentTime, this.position);
    this.setState(ENUM.AudioState.IS_PLAYING);
    if (this.onplay) {
      return this.onplay();
    }
  };

  WebAudioAPI.prototype.stop = function() {
    if (this.src) {
      this.src.stop(0);
      this.src = null;
      this.processor.onaudioprocess = null;
      this.position = 0;
      this.startTime = 0;
      return this.setState(ENUM.AudioState.IS_STOPPED);
    }
  };

  WebAudioAPI.prototype.volume = function(volume) {
    volume = Math.min(1, Math.max(0, volume));
    return this.gainNode.gain.value = volume;
  };

  WebAudioAPI.prototype.updatePosition = function() {
    if (this.state === ENUM.AudioState.IS_PLAYING) {
      this.position = this.ctx.currentTime - this.startTime;
    }
    if (this.position > this.buffer.duration) {
      this.position = this.buffer.duration;
      this.pause();
    }
    return this.position;
  };

  WebAudioAPI.prototype.seek = function(time) {
    if (this.state === ENUM.AudioState.IS_PLAYING) {
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
    this.src = this.ctx.createBufferSource();
    this.src.buffer = this.buffer;
    this.src.onended = this._onEnded;
    this.duration = this.buffer.duration;
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
      return this.processor.disconnect(0);
    }
  };

  WebAudioAPI.prototype._onAudioProcess = function() {
    if (this.onaudioprocess) {
      return this.onaudioprocess();
    }
  };

  WebAudioAPI.prototype._onEnded = function(e) {
    if (this.src && (this.state === ENUM.AudioState.IS_STOPPED || this.state === ENUM.AudioState.IS_PLAYING)) {
      this.src.disconnect(0);
      this.src = null;
      this.processor.onaudioprocess = null;
      this.state = ENUM.AudioState.IS_ENDED;
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
    this.setRadius(this.radius);
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
    this.refresh(0);
    return this.updateGeometries(true);
  };

  Equalizer.prototype.update = function(delta) {
    return this.refresh(delta);
  };

  Equalizer.prototype.refresh = function(delta) {
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
    return setTimeout(this.updateValues, this.interpolationTime * 0.25);
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

  Equalizer.prototype.resize = function() {
    return this.setRadius(this.radius);
  };

  Equalizer.prototype.setRadius = function(radius) {
    this.radius = radius;
    if (window.innerWidth - 100 < radius) {
      return this.radius = window.innerWidth * 0.6;
    }
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
    document.addEventListener(EVENT.Track.IS_PLAYING.type, this._eTrackIsPlaying);
    document.addEventListener(EVENT.Track.IS_PAUSED.type, this._eTrackIsPaused);
    document.addEventListener(EVENT.Track.IS_LOADED.type, this._eTrackIsLoaded);
    document.addEventListener(EVENT.Jukebox.WILL_PLAY.type, this._eJukeboxWillPlay);
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
    var css, i, j, len, nextTrack, ref1, title, track, trackData, user_url, username;
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
    texture0 = this.plane.material.uniforms.texture0.value;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsT0FBQTtFQUFBOzs2QkFBQTs7QUFBQSxNQUFNLENBQUMsS0FBUCxHQUFlLE1BQU0sQ0FBQyxLQUFQLElBQWdCLEVBQS9CLENBQUE7O0FBQUEsS0FFSyxDQUFDLEdBQU4sR0FBWSxFQUZaLENBQUE7O0FBQUEsS0FLSyxDQUFDLEdBQU4sR0FBbUIsRUFMbkIsQ0FBQTs7QUFBQSxLQU1LLENBQUMsVUFBTixHQUFvQixNQUFNLENBQUMsZ0JBQVAsSUFBMkIsQ0FOL0MsQ0FBQTs7QUFBQSxLQVNLLENBQUMsS0FBTixHQUFjLEVBVGQsQ0FBQTs7QUFBQSxLQVlLLENBQUMsVUFBTixHQUFtQixDQUFDLFNBQUEsR0FBQTtBQUNsQixNQUFBLE1BQUE7QUFBQSxFQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFDQSxFQUFBLElBQUcsS0FBSyxDQUFDLEdBQU4sS0FBYSxhQUFoQjtBQUNFLElBQUEsTUFBTSxDQUFDLEVBQVAsR0FBWSxrQ0FBWixDQURGO0dBQUEsTUFBQTtBQUdFLElBQUEsTUFBTSxDQUFDLEVBQVAsR0FBWSxrQ0FBWixDQUhGO0dBREE7QUFBQSxFQUtBLE1BQU0sQ0FBQyxZQUFQLEdBQXNCLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFMdEMsQ0FBQTtBQU1BLFNBQU8sTUFBUCxDQVBrQjtBQUFBLENBQUQsQ0FBQSxDQUFBLENBWm5CLENBQUE7O0FBQUEsS0F3QkssQ0FBQyxHQUFOLEdBQW1CLFNBQUMsR0FBRCxFQUFNLE1BQU4sR0FBQTtBQUNqQixNQUFBLHNCQUFBOztJQUR1QixTQUFPO0dBQzlCO0FBQUEsRUFBQSxJQUFBLENBQUEsbUJBQTBCLENBQUMsSUFBcEIsQ0FBeUIsS0FBSyxDQUFDLEdBQS9CLENBQVA7QUFDSSxJQUFBLElBQUEsR0FBZSxJQUFBLElBQUEsQ0FBQSxDQUFmLENBQUE7QUFBQSxJQUNBLE9BQUEsR0FBVyxJQUFJLENBQUMsWUFBTCxDQUFBLENBRFgsQ0FBQTtBQUFBLElBRUEsT0FBQSxHQUFXLE9BQU8sQ0FBQyxNQUFSLENBQWUsQ0FBZixFQUFrQixDQUFsQixDQUZYLENBQUE7QUFBQSxJQUdBLE9BQUEsR0FBVyxJQUFJLENBQUMsT0FBTCxDQUFBLENBQUEsR0FBaUIsR0FINUIsQ0FBQTtBQUFBLElBSUEsT0FBQSxJQUFXLENBQUMsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFBLEdBQWdCLENBQWpCLENBQUEsR0FBc0IsR0FKakMsQ0FBQTtBQUFBLElBS0EsT0FBQSxJQUFXLElBQUksQ0FBQyxXQUFMLENBQUEsQ0FMWCxDQUFBO1dBTUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFBLEdBQVEsS0FBUixHQUFjLE9BQWQsR0FBc0IsS0FBdEIsR0FBNEIsR0FBeEMsRUFBNkMsTUFBN0MsRUFQSjtHQURpQjtBQUFBLENBeEJuQixDQUFBOztBQUFBLEtBa0NLLENBQUMsSUFBTixHQUFtQixTQUFDLE9BQUQsR0FBQTtTQUNqQixLQUFLLENBQUMsR0FBTixDQUFVLFdBQUEsR0FBYyxPQUF4QixFQUFpQyxnQkFBakMsRUFEaUI7QUFBQSxDQWxDbkIsQ0FBQTs7QUFBQSxLQXNDSyxDQUFDLE9BQU4sR0FBZ0IsRUF0Q2hCLENBQUE7O0FBQUEsTUF5Q00sQ0FBQyxLQUFQLEdBQ0U7QUFBQSxFQUFBLE9BQUEsRUFDRTtBQUFBLElBQUEsWUFBQSxFQUF3QixJQUFBLEtBQUEsQ0FBTSxzQkFBTixDQUF4QjtBQUFBLElBQ0Esa0JBQUEsRUFBd0IsSUFBQSxLQUFBLENBQU0sNEJBQU4sQ0FEeEI7QUFBQSxJQUVBLFdBQUEsRUFBd0IsSUFBQSxLQUFBLENBQU0scUJBQU4sQ0FGeEI7QUFBQSxJQUdBLE9BQUEsRUFBd0IsSUFBQSxLQUFBLENBQU0saUJBQU4sQ0FIeEI7QUFBQSxJQUlBLE9BQUEsRUFBd0IsSUFBQSxLQUFBLENBQU0saUJBQU4sQ0FKeEI7QUFBQSxJQUtBLFVBQUEsRUFBd0IsSUFBQSxLQUFBLENBQU0sb0JBQU4sQ0FMeEI7QUFBQSxJQU1BLFVBQUEsRUFBd0IsSUFBQSxLQUFBLENBQU0sb0JBQU4sQ0FOeEI7QUFBQSxJQU9BLFlBQUEsRUFBd0IsSUFBQSxLQUFBLENBQU0sc0JBQU4sQ0FQeEI7QUFBQSxJQVFBLFNBQUEsRUFBd0IsSUFBQSxLQUFBLENBQU0sbUJBQU4sQ0FSeEI7R0FERjtBQUFBLEVBVUEsS0FBQSxFQUNFO0FBQUEsSUFBQSxTQUFBLEVBQWUsSUFBQSxLQUFBLENBQU0saUJBQU4sQ0FBZjtBQUFBLElBQ0EsVUFBQSxFQUFnQixJQUFBLEtBQUEsQ0FBTSxrQkFBTixDQURoQjtBQUFBLElBRUEsU0FBQSxFQUFnQixJQUFBLEtBQUEsQ0FBTSxpQkFBTixDQUZoQjtBQUFBLElBR0EsVUFBQSxFQUFnQixJQUFBLEtBQUEsQ0FBTSxrQkFBTixDQUhoQjtHQVhGO0FBQUEsRUFlQSxVQUFBLEVBQ0U7QUFBQSxJQUFBLFlBQUEsRUFBa0IsSUFBQSxLQUFBLENBQU0sc0JBQU4sQ0FBbEI7R0FoQkY7QUFBQSxFQWlCQSxLQUFBLEVBQ0U7QUFBQSxJQUFBLGVBQUEsRUFBc0IsSUFBQSxLQUFBLENBQU0sdUJBQU4sQ0FBdEI7QUFBQSxJQUNBLGdCQUFBLEVBQXNCLElBQUEsS0FBQSxDQUFNLHdCQUFOLENBRHRCO0dBbEJGO0NBMUNGLENBQUE7O0FBQUEsTUE4RE0sQ0FBQyxNQUFQLENBQWMsS0FBZCxDQTlEQSxDQUFBOztBQUFBLE1BaUVNLENBQUMsSUFBUCxHQUNFO0FBQUEsRUFBQSxRQUFBLEVBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsSUFDQSxFQUFBLEVBQUksRUFESjtBQUFBLElBRUEsSUFBQSxFQUFNLEVBRk47QUFBQSxJQUdBLEdBQUEsRUFBSyxFQUhMO0FBQUEsSUFJQSxNQUFBLEVBQVEsRUFKUjtHQURGO0FBQUEsRUFNQSxjQUFBLEVBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxxQkFBTjtBQUFBLElBQ0EsUUFBQSxFQUFVLHlCQURWO0FBQUEsSUFFQSxPQUFBLEVBQVMsdUJBRlQ7QUFBQSxJQUdBLE9BQUEsRUFBUyx3QkFIVDtHQVBGO0FBQUEsRUFXQSxpQkFBQSxFQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsMEJBQVI7QUFBQSxJQUNBLE1BQUEsRUFBUSwwQkFEUjtBQUFBLElBRUEsTUFBQSxFQUFRLDBCQUZSO0FBQUEsSUFHQSxjQUFBLEVBQWdCLGlDQUhoQjtHQVpGO0FBQUEsRUFnQkEsWUFBQSxFQUNFO0FBQUEsSUFBQSxVQUFBLEVBQVksd0JBQVo7QUFBQSxJQUNBLFVBQUEsRUFBWSx3QkFEWjtBQUFBLElBRUEsYUFBQSxFQUFlLDJCQUZmO0dBakJGO0FBQUEsRUFvQkEsWUFBQSxFQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0sbUJBQU47QUFBQSxJQUNBLE9BQUEsRUFBUyxzQkFEVDtHQXJCRjtBQUFBLEVBdUJBLFVBQUEsRUFDRTtBQUFBLElBQUEsVUFBQSxFQUFZLGtCQUFaO0FBQUEsSUFDQSxVQUFBLEVBQVksa0JBRFo7QUFBQSxJQUVBLFNBQUEsRUFBVyxpQkFGWDtBQUFBLElBR0EsUUFBQSxFQUFVLGdCQUhWO0dBeEJGO0NBbEVGLENBQUE7O0FBQUEsTUE4Rk0sQ0FBQyxNQUFQLENBQWMsSUFBZCxDQTlGQSxDQUFBOztBQUFBLE1BaUdNLENBQUMsTUFBUCxHQUFnQixNQUFNLENBQUMsTUFBUCxJQUNkO0FBQUEsRUFBQSxPQUFBLEVBQVMsU0FBQyxDQUFELEVBQUksTUFBSixHQUFBO0FBQ1AsSUFBQSxDQUFDLENBQUMsTUFBRixHQUFXLE1BQVgsQ0FBQTtXQUNBLFFBQVEsQ0FBQyxhQUFULENBQXVCLENBQXZCLEVBRk87RUFBQSxDQUFUO0FBQUEsRUFJQSxNQUFBLEVBQVEsU0FBQyxLQUFELEdBQUE7QUFDTixRQUFBLGdDQUFBO0FBQUEsSUFBQSxJQUFHLE1BQUEsQ0FBQSxLQUFBLEtBQWdCLFFBQW5CO0FBQ0UsTUFBQSxNQUFBLEdBQVMsS0FBVCxDQUFBO0FBQUEsTUFDQSxDQUFBLEdBQUksRUFESixDQUFBO0FBRUEsV0FBQSxhQUFBLEdBQUE7QUFDRSxRQUFBLEtBQUEsR0FBUSxNQUFPLENBQUEsR0FBQSxDQUFmLENBQUE7QUFDQSxRQUFBLElBQUcsTUFBQSxDQUFBLEtBQUEsS0FBZ0IsUUFBbkI7QUFDRSxVQUFBLENBQUUsQ0FBQSxHQUFBLENBQUYsR0FBUyxLQUFBLEdBQVEsTUFBTSxDQUFDLGdCQUF4QixDQURGO1NBRkY7QUFBQSxPQUZBO0FBTUEsYUFBTyxJQUFDLENBQUEsS0FBRCxDQUFPLE1BQVAsRUFBZSxDQUFmLENBQVAsQ0FQRjtLQUFBLE1BUUssSUFBRyxNQUFBLENBQUEsS0FBQSxLQUFnQixPQUFuQjtBQUNILE1BQUEsS0FBQSxHQUFRLEtBQVIsQ0FBQTtBQUFBLE1BQ0EsQ0FBQSxHQUFJLEVBREosQ0FBQTtBQUVBLFdBQUEsbURBQUE7MkJBQUE7QUFDRSxRQUFBLElBQUcsTUFBQSxDQUFBLEtBQUEsS0FBZ0IsUUFBbkI7QUFDRSxVQUFBLENBQUMsQ0FBQyxJQUFGLENBQU8sS0FBQSxHQUFRLE1BQU0sQ0FBQyxnQkFBdEIsQ0FBQSxDQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFQLENBQUEsQ0FIRjtTQURGO0FBQUEsT0FGQTtBQU9BLGFBQU8sQ0FBUCxDQVJHO0tBQUEsTUFTQSxJQUFHLE1BQUEsQ0FBQSxLQUFBLEtBQWdCLFFBQW5CO0FBQ0gsYUFBTyxLQUFBLEdBQVEsTUFBTSxDQUFDLGdCQUF0QixDQURHO0tBakJMO0FBbUJBLFdBQU8sS0FBUCxDQXBCTTtFQUFBLENBSlI7Q0FsR0YsQ0FBQTs7QUFBQSxNQTZITSxDQUFDLE1BQVAsR0FFRTtBQUFBLEVBQUEsT0FBQSxFQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsSUFBQSxHQUFBLENBQUE7QUFBQSxRQUFBLGVBQUE7QUFBQSxJQUNBLElBQUEsR0FBTyxLQUFLLENBQUMsTUFEYixDQUFBO0FBRUEsV0FBTSxDQUFBLEtBQUssSUFBWCxHQUFBO0FBQ0UsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsSUFBM0IsQ0FBUCxDQUFBO0FBQUEsTUFDQSxJQUFBLElBQVEsQ0FEUixDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQWMsS0FBTSxDQUFBLElBQUEsQ0FGcEIsQ0FBQTtBQUFBLE1BR0EsS0FBTSxDQUFBLElBQUEsQ0FBTixHQUFjLEtBQU0sQ0FBQSxJQUFBLENBSHBCLENBQUE7QUFBQSxNQUlBLEtBQU0sQ0FBQSxJQUFBLENBQU4sR0FBYyxHQUpkLENBREY7SUFBQSxDQUZBO0FBUUEsV0FBTyxLQUFQLENBVE87RUFBQSxDQUFUO0FBQUEsRUFZQSxLQUFBLEVBQU8sU0FBQyxPQUFELEVBQVUsU0FBVixHQUFBO1dBQ0wsSUFBQyxDQUFBLE1BQUQsQ0FBUyxJQUFDLENBQUEsTUFBRCxDQUFRLEVBQVIsRUFBWSxPQUFaLENBQVQsRUFBK0IsU0FBL0IsRUFESztFQUFBLENBWlA7QUFBQSxFQWVBLE1BQUEsRUFBUSxTQUFDLE1BQUQsRUFBUyxVQUFULEdBQUE7QUFDTixRQUFBLFFBQUE7QUFBQSxTQUFBLGlCQUFBOzRCQUFBO0FBQ0UsTUFBQSxNQUFPLENBQUEsR0FBQSxDQUFQLEdBQWMsR0FBZCxDQURGO0FBQUEsS0FBQTtXQUVBLE9BSE07RUFBQSxDQWZSO0NBL0hGLENBQUE7O0FBQUEsTUFvSk0sQ0FBQyxJQUFQLEdBQ0U7QUFBQSxFQUFBLGtCQUFBLEVBQW9CLFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUNsQixRQUFBLGFBQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxNQUFNLENBQUMsQ0FBUCxHQUFXLEtBQUssQ0FBQyxDQUExQixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVMsTUFBTSxDQUFDLENBQVAsR0FBVyxLQUFLLENBQUMsQ0FEMUIsQ0FBQTtBQUVBLFdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFYLEVBQW1CLEtBQW5CLENBQVAsQ0FIa0I7RUFBQSxDQUFwQjtBQUFBLEVBS0EsUUFBQSxFQUFVLFNBQUMsTUFBRCxFQUFTLE1BQVQsR0FBQTtBQUNSLFFBQUEsT0FBQTtBQUFBLElBQUEsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxDQUFQLEdBQVcsTUFBTSxDQUFDLENBQXRCLENBQUE7QUFBQSxJQUNBLENBQUEsR0FBSSxNQUFNLENBQUMsQ0FBUCxHQUFXLE1BQU0sQ0FBQyxDQUR0QixDQUFBO0FBQUEsSUFFQSxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFBLEdBQUksQ0FGaEIsQ0FBQTtBQUdBLFdBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFWLENBQVAsQ0FKUTtFQUFBLENBTFY7QUFBQSxFQVdBLFNBQUEsRUFBVyxTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDVCxRQUFBLFlBQUE7QUFBQSxJQUFBLEVBQUEsR0FBUSxJQUFJLENBQUMsTUFBUixHQUFvQixJQUFJLENBQUMsTUFBekIsR0FBcUMsQ0FBMUMsQ0FBQTtBQUFBLElBQ0EsRUFBQSxHQUFRLElBQUksQ0FBQyxNQUFSLEdBQW9CLElBQUksQ0FBQyxNQUF6QixHQUFxQyxDQUQxQyxDQUFBO0FBQUEsSUFFQSxJQUFBLEdBQU8sRUFBQSxHQUFLLEVBRlosQ0FBQTtBQUlBLFdBQU8sSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFJLENBQUMsUUFBZixFQUF5QixJQUFJLENBQUMsUUFBOUIsQ0FBQSxJQUEyQyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUEsR0FBTyxJQUFqQixDQUFsRCxDQUxTO0VBQUEsQ0FYWDtBQUFBLEVBa0JBLEdBQUEsRUFBSyxTQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsS0FBZCxFQUFxQixJQUFyQixFQUEyQixLQUEzQixHQUFBO0FBQ0gsV0FBTyxJQUFBLEdBQU8sQ0FBQyxLQUFBLEdBQVEsSUFBVCxDQUFBLEdBQWlCLENBQUMsS0FBQSxHQUFRLElBQVQsQ0FBakIsR0FBa0MsQ0FBQyxLQUFBLEdBQVEsSUFBVCxDQUFoRCxDQURHO0VBQUEsQ0FsQkw7QUFBQSxFQXNCQSxPQUFBLEVBQVMsU0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLEVBQWpCLEVBQXFCLE9BQXJCLEVBQThCLElBQTlCLEdBQUE7QUFDUCxJQUFBOzs7Ozs7Ozs7Ozs7OztJQUFBLENBQUE7QUFlQSxXQUFPLEVBQUEsR0FBRyxFQUFILEdBQU0sRUFBQSxHQUFHLEVBQVQsR0FBWSxFQUFBLEdBQUcsRUFBZixHQUFrQixFQUFBLEdBQUcsRUFBNUIsQ0FoQk87RUFBQSxDQXRCVDtDQXJKRixDQUFBOztBQUFBLE1BOExNLENBQUMsS0FBUCxHQUNFO0FBQUEsRUFBQSxZQUFBLEVBQWMsU0FBQyxHQUFELEdBQUE7QUFDWixRQUFBLGdCQUFBO0FBQUEsSUFBQSxJQUFBLEdBQVcsSUFBQSxLQUFLLENBQUMsU0FBTixDQUFBLENBQVgsQ0FBQTtBQUFBLElBQ0EsSUFBSSxDQUFDLEdBQUwsQ0FBYSxJQUFBLEtBQUssQ0FBQyxtQkFBTixDQUEwQixHQUFJLENBQUEsQ0FBQSxDQUE5QixFQUFrQyxHQUFJLENBQUEsQ0FBQSxDQUF0QyxFQUEwQyxHQUFJLENBQUEsQ0FBQSxDQUE5QyxFQUFrRCxHQUFJLENBQUEsQ0FBQSxDQUF0RCxDQUFiLENBREEsQ0FBQTtBQUVBLFNBQVMsOEZBQVQsR0FBQTtBQUNFLE1BQUEsSUFBSSxDQUFDLEdBQUwsQ0FBYSxJQUFBLEtBQUssQ0FBQyxtQkFBTixDQUEwQixHQUFJLENBQUEsQ0FBQSxDQUE5QixFQUFrQyxHQUFJLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBdEMsRUFBNEMsR0FBSSxDQUFBLENBQUEsR0FBRSxDQUFGLENBQWhELEVBQXNELEdBQUksQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUExRCxDQUFiLENBQUEsQ0FERjtBQUFBLEtBRkE7QUFBQSxJQUlBLElBQUksQ0FBQyxHQUFMLENBQWEsSUFBQSxLQUFLLENBQUMsbUJBQU4sQ0FBMEIsR0FBSSxDQUFBLEdBQUcsQ0FBQyxNQUFKLEdBQVcsQ0FBWCxDQUE5QixFQUE2QyxHQUFJLENBQUEsR0FBRyxDQUFDLE1BQUosR0FBVyxDQUFYLENBQWpELEVBQWdFLEdBQUksQ0FBQSxHQUFHLENBQUMsTUFBSixHQUFXLENBQVgsQ0FBcEUsRUFBbUYsR0FBSSxDQUFBLEdBQUcsQ0FBQyxNQUFKLEdBQVcsQ0FBWCxDQUF2RixDQUFiLENBSkEsQ0FBQTtBQUtBLFdBQU8sSUFBUCxDQU5ZO0VBQUEsQ0FBZDtDQS9MRixDQUFBOztBQUFBLEtBdU1LLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQkFBbEIsR0FBeUMsU0FBRSxFQUFGLEVBQU0sRUFBTixFQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCLE9BQXRCLEVBQStCLElBQS9CLEdBQUE7QUFDckMsTUFBQSxnQ0FBQTtBQUFBLEVBQUEsR0FBQSxHQUFNLEVBQUEsR0FBSyxFQUFYLENBQUE7QUFBQSxFQUNBLEdBQUEsR0FBTSxHQUFBLEdBQU0sRUFEWixDQUFBO0FBQUEsRUFHQSxFQUFBLEdBQU0sQ0FBQyxFQUFBLEdBQUcsRUFBSixDQUFBLEdBQVEsQ0FBQyxDQUFBLEdBQUUsSUFBSCxDQUFSLEdBQWlCLENBQUMsQ0FBQSxHQUFFLE9BQUgsQ0FBakIsR0FBNkIsQ0FIbkMsQ0FBQTtBQUFBLEVBSUEsRUFBQSxJQUFPLENBQUMsRUFBQSxHQUFHLEVBQUosQ0FBQSxHQUFRLENBQUMsQ0FBQSxHQUFFLElBQUgsQ0FBUixHQUFpQixDQUFDLENBQUEsR0FBRSxPQUFILENBQWpCLEdBQTZCLENBSnBDLENBQUE7QUFBQSxFQU1BLEVBQUEsR0FBTSxDQUFDLEVBQUEsR0FBRyxFQUFKLENBQUEsR0FBUSxDQUFDLENBQUEsR0FBRSxJQUFILENBQVIsR0FBaUIsQ0FBQyxDQUFBLEdBQUUsT0FBSCxDQUFqQixHQUE2QixDQU5uQyxDQUFBO0FBQUEsRUFPQSxFQUFBLElBQU8sQ0FBQyxFQUFBLEdBQUcsRUFBSixDQUFBLEdBQVEsQ0FBQyxDQUFBLEdBQUUsSUFBSCxDQUFSLEdBQWlCLENBQUMsQ0FBQSxHQUFFLE9BQUgsQ0FBakIsR0FBNkIsQ0FQcEMsQ0FBQTtBQUFBLEVBU0EsRUFBQSxHQUFPLENBQUEsR0FBRSxHQUFGLEdBQVEsQ0FBQSxHQUFFLEdBQVYsR0FBZ0IsQ0FUdkIsQ0FBQTtBQUFBLEVBVUEsRUFBQSxHQUFTLEdBQUEsR0FBTSxDQUFBLEdBQUUsR0FBUixHQUFjLEVBVnZCLENBQUE7QUFBQSxFQVdBLEVBQUEsR0FBUyxHQUFBLEdBQVEsR0FYakIsQ0FBQTtBQUFBLEVBWUEsRUFBQSxHQUFNLENBQUEsQ0FBQSxHQUFHLEdBQUgsR0FBUyxDQUFBLEdBQUUsR0FaakIsQ0FBQTtBQWNBLFNBQU8sRUFBQSxHQUFHLEVBQUgsR0FBTSxFQUFBLEdBQUcsRUFBVCxHQUFZLEVBQUEsR0FBRyxFQUFmLEdBQWtCLEVBQUEsR0FBRyxFQUE1QixDQWZxQztBQUFBLENBdk16QyxDQUFBOztBQUFBLEtBd05LLENBQUMsbUJBQU4sR0FBNEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFaLENBQzFCLFNBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixHQUFBO0FBQ0UsRUFBQSxJQUFDLENBQUEsRUFBRCxHQUFNLEVBQU4sQ0FBQTtBQUFBLEVBQ0EsSUFBQyxDQUFBLEVBQUQsR0FBTSxFQUROLENBQUE7QUFBQSxFQUVBLElBQUMsQ0FBQSxFQUFELEdBQU0sRUFGTixDQUFBO0FBQUEsRUFHQSxJQUFDLENBQUEsRUFBRCxHQUFNLEVBSE4sQ0FERjtBQUFBLENBRDBCLEVBT3hCLFNBQUMsQ0FBRCxHQUFBO0FBQ0EsTUFBQSxNQUFBO0FBQUEsRUFBQSxNQUFBLEdBQWEsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFBLENBQWIsQ0FBQTtBQUFBLEVBQ0EsTUFBTSxDQUFDLENBQVAsR0FBVyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQkFBbEIsQ0FBdUMsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUEzQyxFQUE4QyxJQUFDLENBQUEsRUFBRSxDQUFDLENBQWxELEVBQXFELElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBekQsRUFBNEQsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUFoRSxFQUFtRSxDQUFuRSxFQUFzRSxDQUF0RSxFQUF5RSxDQUF6RSxDQURYLENBQUE7QUFBQSxFQUVBLE1BQU0sQ0FBQyxDQUFQLEdBQVcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsb0JBQWxCLENBQXVDLElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBM0MsRUFBOEMsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUFsRCxFQUFxRCxJQUFDLENBQUEsRUFBRSxDQUFDLENBQXpELEVBQTRELElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBaEUsRUFBbUUsQ0FBbkUsRUFBc0UsQ0FBdEUsRUFBeUUsQ0FBekUsQ0FGWCxDQUFBO0FBQUEsRUFHQSxNQUFNLENBQUMsQ0FBUCxHQUFXLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLG9CQUFsQixDQUF1QyxJQUFDLENBQUEsRUFBRSxDQUFDLENBQTNDLEVBQThDLElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBbEQsRUFBcUQsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUF6RCxFQUE0RCxJQUFDLENBQUEsRUFBRSxDQUFDLENBQWhFLEVBQW1FLENBQW5FLEVBQXNFLENBQXRFLEVBQXlFLENBQXpFLENBSFgsQ0FBQTtBQUlBLFNBQU8sTUFBUCxDQUxBO0FBQUEsQ0FQd0IsQ0F4TjVCLENBQUE7O0FBQUEsS0F1T0ssQ0FBQyxXQUFOLEdBQW9CLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBWixDQUNsQixTQUFDLEVBQUQsRUFBSyxVQUFMLEVBQW1CLFNBQW5CLEVBQWtDLFNBQWxDLEVBQStDLE9BQS9DLEVBQThELFNBQTlELEdBQUE7O0lBQUssYUFBVztHQUNkOztJQURpQixZQUFVO0dBQzNCOztJQURnQyxZQUFVO0dBQzFDOztJQUQ2QyxVQUFRO0dBQ3JEOztJQUQ0RCxZQUFVO0dBQ3RFO0FBQUEsRUFBQSxJQUFDLENBQUEsRUFBRCxHQUFjLEVBQWQsQ0FBQTtBQUFBLEVBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBYyxPQURkLENBQUE7QUFBQSxFQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsVUFGZCxDQUFBO0FBQUEsRUFJQSxJQUFDLENBQUEsU0FBRCxHQUFjLFNBSmQsQ0FBQTtBQUFBLEVBS0EsSUFBQyxDQUFBLFNBQUQsR0FBYyxTQUxkLENBQUE7QUFBQSxFQU1BLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsU0FONUIsQ0FBQTtBQUFBLEVBUUEsSUFBQyxDQUFBLFNBQUQsR0FBYyxTQVJkLENBREY7QUFBQSxDQURrQixFQWFoQixTQUFDLENBQUQsR0FBQTtBQUNBLE1BQUEsZ0NBQUE7QUFBQSxFQUFBLElBQWlCLElBQUMsQ0FBQSxPQUFsQjtBQUFBLElBQUEsQ0FBQSxHQUFRLENBQUEsR0FBSSxDQUFaLENBQUE7R0FBQTtBQUNBLEVBQUEsSUFBRyxJQUFDLENBQUEsU0FBSjtBQUNJLElBQUEsR0FBQSxHQUFRLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFWLENBQUEsR0FBYSxDQUFkLENBQUEsR0FBaUIsQ0FBakIsR0FBcUIsQ0FBN0IsQ0FBQTtBQUFBLElBQ0EsWUFBQSxHQUFlLEdBQUEsR0FBTSxJQUFJLENBQUMsRUFBWCxHQUFnQixDQUQvQixDQUFBO0FBQUEsSUFFQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUFDLFlBQUEsR0FBZSxDQUFoQixDQUZ0QixDQUFBO0FBQUEsSUFHQSxLQUFBLElBQVMsSUFBSSxDQUFDLEVBQUwsR0FBVSxDQUFBLEtBSG5CLENBREo7R0FBQSxNQUFBO0FBTUksSUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUFDLElBQUksQ0FBQyxFQUFMLEdBQVUsQ0FBVixHQUFjLENBQWYsQ0FBdEIsQ0FOSjtHQURBO0FBQUEsRUFTQSxNQUFBLEdBQWEsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFBLENBVGIsQ0FBQTtBQUFBLEVBVUEsTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFDLENBQUEsRUFBRSxDQUFDLENBQUosR0FBUSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixDQUFDLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLE1BQUQsR0FBVSxDQUF4QixDQVZyQyxDQUFBO0FBQUEsRUFXQSxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBSixHQUFRLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFBLEdBQWtCLENBQUMsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsTUFBRCxHQUFVLENBQXhCLENBWHJDLENBQUE7QUFBQSxFQVlBLE1BQU0sQ0FBQyxDQUFQLEdBQVcsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQVpmLENBQUE7QUFhQSxTQUFPLE1BQVAsQ0FkQTtBQUFBLENBYmdCLENBdk9wQixDQUFBOztBQUFBLEtBcVFLLENBQUMsYUFBTixHQUFzQixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQVosQ0FDcEIsU0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLE1BQVQsR0FBQTs7SUFBUyxTQUFPO0dBQ2Q7QUFBQSxFQUFBLElBQUMsQ0FBQSxFQUFELEdBQVEsRUFBUixDQUFBO0FBQUEsRUFDQSxJQUFDLENBQUEsRUFBRCxHQUFRLEVBRFIsQ0FBQTtBQUFBLEVBRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUZWLENBREY7QUFBQSxDQURvQixFQU1sQixTQUFDLENBQUQsR0FBQTtBQUNBLE1BQUEsc0JBQUE7QUFBQSxFQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsRUFBTCxHQUFVLENBQVYsR0FBYyxDQUFkLEdBQWtCLElBQUMsQ0FBQSxNQUEzQixDQUFBO0FBQUEsRUFFQSxDQUFBLEdBQUksSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUFKLEdBQVEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUZoQixDQUFBO0FBQUEsRUFJQSxJQUFBLEdBQU8sSUFBQyxDQUFBLEVBQUUsQ0FBQyxLQUFKLENBQUEsQ0FBVyxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLEVBQWpCLENBSlAsQ0FBQTtBQUFBLEVBTUEsTUFBQSxHQUFhLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQU5iLENBQUE7QUFBQSxFQU9BLE1BQU0sQ0FBQyxDQUFQLEdBQVcsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUFKLEdBQVEsSUFBSSxDQUFDLENBQUwsR0FBUyxDQVA1QixDQUFBO0FBQUEsRUFRQSxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBSixHQUFRLElBQUksQ0FBQyxDQUFMLEdBQVMsQ0FSNUIsQ0FBQTtBQUFBLEVBU0EsTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFDLENBQUEsRUFBRSxDQUFDLENBQUosR0FBUSxJQUFJLENBQUMsQ0FBTCxHQUFTLENBVDVCLENBQUE7QUFBQSxFQVdBLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFBLEdBQUksQ0FBaEIsQ0FBQSxHQUFxQixFQVh6QixDQUFBO0FBQUEsRUFhQSxNQUFNLENBQUMsQ0FBUCxJQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFBLEdBQWtCLENBQUMsRUFBQSxHQUFLLENBQU4sQ0FiOUIsQ0FBQTtBQUFBLEVBY0EsTUFBTSxDQUFDLENBQVAsSUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixDQUFDLEVBQUEsR0FBSyxDQUFOLENBZDlCLENBQUE7QUFnQkEsU0FBTyxNQUFQLENBakJBO0FBQUEsQ0FOa0IsQ0FyUXRCLENBQUE7O0FBQUEsTUFnU00sQ0FBQyxNQUFQLEdBUUU7QUFBQSxFQUFBLE1BQUEsRUFBUSxTQUFDLENBQUQsR0FBQTtBQUNOLFdBQU8sQ0FBUCxDQURNO0VBQUEsQ0FBUjtBQUFBLEVBSUEsZUFBQSxFQUFpQixTQUFDLENBQUQsR0FBQTtBQUNmLFdBQU8sQ0FBQSxHQUFJLENBQVgsQ0FEZTtFQUFBLENBSmpCO0FBQUEsRUFRQSxnQkFBQSxFQUFrQixTQUFDLENBQUQsR0FBQTtBQUNoQixXQUFPLENBQUEsQ0FBRSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFMLENBQVIsQ0FEZ0I7RUFBQSxDQVJsQjtBQUFBLEVBY0Esa0JBQUEsRUFBb0IsU0FBQyxDQUFELEdBQUE7QUFDbEIsSUFBQSxJQUFHLENBQUEsR0FBSSxHQUFQO0FBQ0UsYUFBTyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQWYsQ0FERjtLQUFBLE1BQUE7QUFHRSxhQUFPLENBQUMsQ0FBQSxDQUFBLEdBQUssQ0FBTCxHQUFTLENBQVYsQ0FBQSxHQUFlLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBZixHQUF5QixDQUFoQyxDQUhGO0tBRGtCO0VBQUEsQ0FkcEI7QUFBQSxFQXFCQSxXQUFBLEVBQWEsU0FBQyxDQUFELEdBQUE7QUFDWCxXQUFPLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBZixDQURXO0VBQUEsQ0FyQmI7QUFBQSxFQXlCQSxZQUFBLEVBQWMsU0FBQyxDQUFELEdBQUE7QUFDWixRQUFBLENBQUE7QUFBQSxJQUFBLENBQUEsR0FBSyxDQUFBLEdBQUksQ0FBVCxDQUFBO0FBQ0EsV0FBTyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFuQixDQUZZO0VBQUEsQ0F6QmQ7QUFBQSxFQWdDQSxjQUFBLEVBQWdCLFNBQUMsQ0FBRCxHQUFBO0FBQ2QsUUFBQSxDQUFBO0FBQUEsSUFBQSxJQUFHLENBQUEsR0FBSSxHQUFQO0FBQ0UsYUFBTyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFuQixDQURGO0tBQUEsTUFBQTtBQUdFLE1BQUEsQ0FBQSxHQUFLLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQWYsQ0FBQTtBQUNBLGFBQU8sR0FBQSxHQUFNLENBQU4sR0FBVSxDQUFWLEdBQWMsQ0FBZCxHQUFrQixDQUF6QixDQUpGO0tBRGM7RUFBQSxDQWhDaEI7QUFBQSxFQXdDQSxhQUFBLEVBQWUsU0FBQyxDQUFELEdBQUE7QUFDYixXQUFPLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBUixHQUFZLENBQW5CLENBRGE7RUFBQSxDQXhDZjtBQUFBLEVBNENBLGNBQUEsRUFBZ0IsU0FBQyxDQUFELEdBQUE7QUFDZCxRQUFBLENBQUE7QUFBQSxJQUFBLENBQUEsR0FBSyxDQUFBLEdBQUksQ0FBVCxDQUFBO0FBQ0EsV0FBTyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQVosR0FBc0IsQ0FBN0IsQ0FGYztFQUFBLENBNUNoQjtBQUFBLEVBbURBLGdCQUFBLEVBQWtCLFNBQUMsQ0FBRCxHQUFBO0FBQ2hCLFFBQUEsQ0FBQTtBQUFBLElBQUEsSUFBRyxDQUFBLEdBQUksR0FBUDtBQUNFLGFBQU8sQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFSLEdBQVksQ0FBWixHQUFnQixDQUF2QixDQURGO0tBQUEsTUFBQTtBQUdFLE1BQUEsQ0FBQSxHQUFLLENBQUEsR0FBSSxDQUFULENBQUE7QUFDQSxhQUFPLENBQUEsQ0FBQSxHQUFLLENBQUwsR0FBUyxDQUFULEdBQWEsQ0FBYixHQUFpQixDQUFqQixHQUFxQixDQUE1QixDQUpGO0tBRGdCO0VBQUEsQ0FuRGxCO0FBQUEsRUEyREEsYUFBQSxFQUFlLFNBQUMsQ0FBRCxHQUFBO0FBQ2IsV0FBTyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFaLEdBQWdCLENBQXZCLENBRGE7RUFBQSxDQTNEZjtBQUFBLEVBK0RBLGNBQUEsRUFBZ0IsU0FBQyxDQUFELEdBQUE7QUFDZCxRQUFBLENBQUE7QUFBQSxJQUFBLENBQUEsR0FBSyxDQUFBLEdBQUksQ0FBVCxDQUFBO0FBQ0EsV0FBTyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFaLEdBQWdCLENBQWhCLEdBQW9CLENBQTNCLENBRmM7RUFBQSxDQS9EaEI7QUFBQSxFQXNFQSxnQkFBQSxFQUFrQixTQUFDLENBQUQsR0FBQTtBQUNoQixRQUFBLENBQUE7QUFBQSxJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLEVBQUEsR0FBSyxDQUFMLEdBQVMsQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBakIsR0FBcUIsQ0FBNUIsQ0FERjtLQUFBLE1BQUE7QUFHRSxNQUFBLENBQUEsR0FBSyxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxDQUFmLENBQUE7QUFDQSxhQUFRLEdBQUEsR0FBTSxDQUFOLEdBQVUsQ0FBVixHQUFjLENBQWQsR0FBa0IsQ0FBbEIsR0FBc0IsQ0FBdEIsR0FBMEIsQ0FBbEMsQ0FKRjtLQURnQjtFQUFBLENBdEVsQjtBQUFBLEVBOEVBLFVBQUEsRUFBWSxTQUFDLENBQUQsR0FBQTtBQUNWLFdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxJQUFJLENBQUMsRUFBZixHQUFvQixDQUE3QixDQUFBLEdBQWtDLENBQXpDLENBRFU7RUFBQSxDQTlFWjtBQUFBLEVBa0ZBLFdBQUEsRUFBYSxTQUFDLENBQUQsR0FBQTtBQUNYLFdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUksSUFBSSxDQUFDLEVBQVQsR0FBYyxDQUF2QixDQUFQLENBRFc7RUFBQSxDQWxGYjtBQUFBLEVBc0ZBLGFBQUEsRUFBZSxTQUFDLENBQUQsR0FBQTtBQUNiLFdBQU8sR0FBQSxHQUFNLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQSxHQUFJLElBQUksQ0FBQyxFQUFsQixDQUFMLENBQWIsQ0FEYTtFQUFBLENBdEZmO0FBQUEsRUEwRkEsY0FBQSxFQUFnQixTQUFDLENBQUQsR0FBQTtBQUNkLFdBQU8sQ0FBQSxHQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBZCxDQUFYLENBRGM7RUFBQSxDQTFGaEI7QUFBQSxFQThGQSxlQUFBLEVBQWlCLFNBQUMsQ0FBRCxHQUFBO0FBQ2YsV0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQXBCLENBQVAsQ0FEZTtFQUFBLENBOUZqQjtBQUFBLEVBb0dBLGlCQUFBLEVBQW1CLFNBQUMsQ0FBRCxHQUFBO0FBQ2pCLElBQUEsSUFBRyxDQUFBLEdBQUksR0FBUDtBQUNFLGFBQU8sR0FBQSxHQUFNLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQWxCLENBQUwsQ0FBYixDQURGO0tBQUEsTUFBQTtBQUdFLGFBQU8sR0FBQSxHQUFNLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFBLENBQUUsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBWCxDQUFELEdBQWlCLENBQUMsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBWCxDQUEzQixDQUFBLEdBQTRDLENBQTdDLENBQWIsQ0FIRjtLQURpQjtFQUFBLENBcEduQjtBQUFBLEVBMkdBLGlCQUFBLEVBQW1CLFNBQUMsQ0FBRCxHQUFBO0FBQ1YsSUFBQSxJQUFJLENBQUEsS0FBSyxHQUFUO2FBQW1CLEVBQW5CO0tBQUEsTUFBQTthQUEwQixJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxFQUFBLEdBQUssQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFqQixFQUExQjtLQURVO0VBQUEsQ0EzR25CO0FBQUEsRUErR0Esa0JBQUEsRUFBb0IsU0FBQyxDQUFELEdBQUE7QUFDWCxJQUFBLElBQUksQ0FBQSxLQUFLLEdBQVQ7YUFBbUIsRUFBbkI7S0FBQSxNQUFBO2FBQTBCLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFBLEVBQUEsR0FBTSxDQUFsQixFQUE5QjtLQURXO0VBQUEsQ0EvR3BCO0FBQUEsRUFxSEEsb0JBQUEsRUFBc0IsU0FBQyxDQUFELEdBQUE7QUFDcEIsSUFBQSxJQUFHLENBQUEsS0FBSyxHQUFMLElBQVksQ0FBQSxLQUFLLEdBQXBCO0FBQ0UsYUFBTyxDQUFQLENBREY7S0FBQTtBQUdBLElBQUEsSUFBRyxDQUFBLEdBQUksR0FBUDtBQUNFLGFBQU8sR0FBQSxHQUFNLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUMsRUFBQSxHQUFLLENBQU4sQ0FBQSxHQUFXLEVBQXZCLENBQWIsQ0FERjtLQUFBLE1BQUE7QUFHRSxhQUFPLENBQUEsR0FBQSxHQUFPLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUMsQ0FBQSxFQUFBLEdBQU0sQ0FBUCxDQUFBLEdBQVksRUFBeEIsQ0FBUCxHQUFxQyxDQUE1QyxDQUhGO0tBSm9CO0VBQUEsQ0FySHRCO0FBQUEsRUErSEEsYUFBQSxFQUFlLFNBQUMsQ0FBRCxHQUFBO0FBQ2IsV0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQUEsR0FBSyxJQUFJLENBQUMsRUFBVixHQUFlLENBQWYsR0FBbUIsQ0FBNUIsQ0FBQSxHQUFpQyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxFQUFBLEdBQUssQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFqQixDQUF4QyxDQURhO0VBQUEsQ0EvSGY7QUFBQSxFQW1JQSxjQUFBLEVBQWdCLFNBQUMsQ0FBRCxHQUFBO0FBQ2QsV0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsRUFBQSxHQUFNLElBQUksQ0FBQyxFQUFYLEdBQWdCLENBQWhCLEdBQW9CLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBN0IsQ0FBQSxHQUF3QyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFBLEVBQUEsR0FBTSxDQUFsQixDQUF4QyxHQUErRCxDQUF0RSxDQURjO0VBQUEsQ0FuSWhCO0FBQUEsRUF5SUEsZ0JBQUEsRUFBa0IsU0FBQyxDQUFELEdBQUE7QUFDaEIsSUFBQSxJQUFHLENBQUEsR0FBSSxHQUFQO0FBQ0UsYUFBTyxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFBLEdBQUssSUFBSSxDQUFDLEVBQVYsR0FBZSxDQUFmLEdBQW1CLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBNUIsQ0FBTixHQUE2QyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxFQUFBLEdBQUssQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxDQUFYLENBQWpCLENBQXBELENBREY7S0FBQSxNQUFBO0FBR0UsYUFBTyxHQUFBLEdBQU0sQ0FBQyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsRUFBQSxHQUFNLElBQUksQ0FBQyxFQUFYLEdBQWdCLENBQWhCLEdBQW9CLENBQUMsQ0FBQyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVQsQ0FBQSxHQUFjLENBQWYsQ0FBN0IsQ0FBQSxHQUFrRCxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFBLEVBQUEsR0FBTSxDQUFDLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBVCxDQUFsQixDQUFsRCxHQUFtRixDQUFwRixDQUFiLENBSEY7S0FEZ0I7RUFBQSxDQXpJbEI7QUFBQSxFQWdKQSxVQUFBLEVBQVksU0FBQyxDQUFELEdBQUE7QUFDVixXQUFPLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBUixHQUFZLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsR0FBSSxJQUFJLENBQUMsRUFBbEIsQ0FBdkIsQ0FEVTtFQUFBLENBaEpaO0FBQUEsRUFvSkEsV0FBQSxFQUFhLFNBQUMsQ0FBRCxHQUFBO0FBQ1gsUUFBQSxDQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUssQ0FBQSxHQUFJLENBQVQsQ0FBQTtBQUNBLFdBQU8sQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFSLEdBQVksQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQSxHQUFJLElBQUksQ0FBQyxFQUFsQixDQUFqQixDQUFYLENBRlc7RUFBQSxDQXBKYjtBQUFBLEVBMkpBLGFBQUEsRUFBZSxTQUFDLENBQUQsR0FBQTtBQUNiLFFBQUEsQ0FBQTtBQUFBLElBQUEsSUFBRyxDQUFBLEdBQUksR0FBUDtBQUNFLE1BQUEsQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUFSLENBQUE7QUFDQSxhQUFPLEdBQUEsR0FBTSxDQUFDLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBUixHQUFZLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsR0FBSSxJQUFJLENBQUMsRUFBbEIsQ0FBakIsQ0FBYixDQUZGO0tBQUEsTUFBQTtBQUlFLE1BQUEsQ0FBQSxHQUFLLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBRSxDQUFGLEdBQU0sQ0FBUCxDQUFULENBQUE7QUFDQSxhQUFPLEdBQUEsR0FBTSxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBUixHQUFZLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsR0FBSSxJQUFJLENBQUMsRUFBbEIsQ0FBakIsQ0FBTCxDQUFOLEdBQXNELEdBQTdELENBTEY7S0FEYTtFQUFBLENBM0pmO0FBQUEsRUFtS0EsWUFBQSxFQUFjLFNBQUMsQ0FBRCxHQUFBO0FBQ1osV0FBTyxDQUFBLEdBQUksSUFBQyxDQUFBLGFBQUQsQ0FBZSxDQUFBLEdBQUksQ0FBbkIsQ0FBWCxDQURZO0VBQUEsQ0FuS2Q7QUFBQSxFQXNLQSxhQUFBLEVBQWUsU0FBQyxDQUFELEdBQUE7QUFDYixJQUFBLElBQUcsQ0FBQSxHQUFJLENBQUEsR0FBRSxJQUFUO0FBQ0UsYUFBTyxDQUFDLEdBQUEsR0FBTSxDQUFOLEdBQVUsQ0FBWCxDQUFBLEdBQWMsSUFBckIsQ0FERjtLQUFBLE1BRUssSUFBRyxDQUFBLEdBQUksQ0FBQSxHQUFFLElBQVQ7QUFDSCxhQUFPLENBQUMsR0FBQSxHQUFJLElBQUosR0FBVyxDQUFYLEdBQWUsQ0FBaEIsQ0FBQSxHQUFxQixDQUFDLEVBQUEsR0FBRyxJQUFILEdBQVUsQ0FBWCxDQUFyQixHQUFxQyxFQUFBLEdBQUcsR0FBL0MsQ0FERztLQUFBLE1BRUEsSUFBRyxDQUFBLEdBQUksQ0FBQSxHQUFFLElBQVQ7QUFDSCxhQUFPLENBQUMsSUFBQSxHQUFLLEtBQUwsR0FBYSxDQUFiLEdBQWlCLENBQWxCLENBQUEsR0FBdUIsQ0FBQyxLQUFBLEdBQU0sTUFBTixHQUFlLENBQWhCLENBQXZCLEdBQTRDLEtBQUEsR0FBTSxNQUF6RCxDQURHO0tBQUEsTUFBQTtBQUdILGFBQU8sQ0FBQyxFQUFBLEdBQUcsR0FBSCxHQUFTLENBQVQsR0FBYSxDQUFkLENBQUEsR0FBbUIsQ0FBQyxHQUFBLEdBQUksSUFBSixHQUFXLENBQVosQ0FBbkIsR0FBb0MsR0FBQSxHQUFJLElBQS9DLENBSEc7S0FMUTtFQUFBLENBdEtmO0FBQUEsRUFnTEEsZUFBQSxFQUFpQixTQUFDLENBQUQsR0FBQTtBQUNmLElBQUEsSUFBRyxDQUFBLEdBQUksR0FBUDtBQUNFLGFBQU8sR0FBQSxHQUFNLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBQSxHQUFFLENBQWhCLENBQWIsQ0FERjtLQUFBLE1BQUE7QUFHRSxhQUFPLEdBQUEsR0FBTSxJQUFDLENBQUEsYUFBRCxDQUFlLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBdkIsQ0FBTixHQUFrQyxHQUF6QyxDQUhGO0tBRGU7RUFBQSxDQWhMakI7Q0F4U0YsQ0FBQTs7QUFBQSxLQStkVyxDQUFDO0FBR1YsMkJBQUEsQ0FBQTs7QUFBYSxFQUFBLGVBQUEsR0FBQTtBQUNYLHlDQUFBLENBQUE7QUFBQSxJQUFBLHdDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsSUFBRCxHQUFvQixPQUZwQixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsR0FBRCxHQUFvQixJQUhwQixDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFKcEIsQ0FBQTtBQUFBLElBS0EsSUFBQyxDQUFBLFVBQUQsR0FBb0IsSUFMcEIsQ0FEVztFQUFBLENBQWI7O0FBQUEsa0JBUUEsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO0FBQ04sUUFBQSw2QkFBQTtBQUFBO0FBQUE7U0FBQSxzQ0FBQTtzQkFBQTtBQUNFLG9CQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsS0FBWCxFQUFrQixLQUFsQixFQUFBLENBREY7QUFBQTtvQkFETTtFQUFBLENBUlIsQ0FBQTs7QUFBQSxrQkFZQSxTQUFBLEdBQVcsU0FBQyxHQUFELEVBQU0sS0FBTixHQUFBO0FBQ1QsUUFBQSw2QkFBQTtBQUFBLElBQUEsSUFBcUIsTUFBQSxDQUFBLEdBQVUsQ0FBQyxNQUFYLEtBQXFCLFVBQTFDO0FBQUEsTUFBQSxHQUFHLENBQUMsTUFBSixDQUFXLEtBQVgsQ0FBQSxDQUFBO0tBQUE7QUFDQSxJQUFBLElBQUcsR0FBRyxDQUFDLGNBQUosQ0FBbUIsVUFBbkIsQ0FBQSxJQUFtQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQWIsR0FBc0IsQ0FBNUQ7QUFDRTtBQUFBO1dBQUEsc0NBQUE7d0JBQUE7QUFDRSxzQkFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEtBQVgsRUFBa0IsS0FBbEIsRUFBQSxDQURGO0FBQUE7c0JBREY7S0FGUztFQUFBLENBWlgsQ0FBQTs7QUFBQSxrQkFrQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFFBQUEsNkJBQUE7QUFBQTtBQUFBO1NBQUEsc0NBQUE7c0JBQUE7QUFDRSxvQkFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEtBQVgsRUFBQSxDQURGO0FBQUE7b0JBRE07RUFBQSxDQWxCUixDQUFBOztBQUFBLGtCQXNCQSxTQUFBLEdBQVcsU0FBQyxHQUFELEdBQUE7QUFDVCxRQUFBLDZCQUFBO0FBQUEsSUFBQSxJQUFnQixNQUFBLENBQUEsR0FBVSxDQUFDLE1BQVgsS0FBcUIsVUFBckM7QUFBQSxNQUFBLEdBQUcsQ0FBQyxNQUFKLENBQUEsQ0FBQSxDQUFBO0tBQUE7QUFDQSxJQUFBLElBQUcsR0FBRyxDQUFDLGNBQUosQ0FBbUIsVUFBbkIsQ0FBQSxJQUFtQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQWIsR0FBc0IsQ0FBNUQ7QUFDRTtBQUFBO1dBQUEsc0NBQUE7d0JBQUE7QUFDRSxzQkFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEtBQVgsRUFBQSxDQURGO0FBQUE7c0JBREY7S0FGUztFQUFBLENBdEJYLENBQUE7O0FBQUEsa0JBNEJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7V0FDTixJQUFDLENBQUEsTUFBRCxHQUFVLE1BREo7RUFBQSxDQTVCUixDQUFBOztBQUFBLGtCQStCQSxLQUFBLEdBQU8sU0FBQSxHQUFBO1dBQ0wsSUFBQyxDQUFBLE1BQUQsR0FBVSxLQURMO0VBQUEsQ0EvQlAsQ0FBQTs7QUFBQSxrQkFrQ0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFdBQU8sSUFBQyxDQUFBLE1BQVIsQ0FEUTtFQUFBLENBbENWLENBQUE7O2VBQUE7O0dBSHdCLEtBQUssQ0FBQyxNQS9kaEMsQ0FBQTs7QUFBQSxLQXdnQlcsQ0FBQztBQUVWLHlCQUFBLFlBQUEsR0FBYyxJQUFkLENBQUE7O0FBQUEseUJBQ0EsT0FBQSxHQUFTLElBRFQsQ0FBQTs7QUFBQSx5QkFFQSxNQUFBLEdBQVEsSUFGUixDQUFBOztBQUFBLHlCQUdBLE1BQUEsR0FBUSxJQUhSLENBQUE7O0FBQUEseUJBSUEsS0FBQSxHQUFPLENBSlAsQ0FBQTs7QUFBQSx5QkFNQSxRQUFBLEdBQVUsSUFOVixDQUFBOztBQUFBLHlCQU9BLE1BQUEsR0FBVSxJQVBWLENBQUE7O0FBU2EsRUFBQSxzQkFBQyxLQUFELEVBQVEsTUFBUixHQUFBO0FBQ1gsMkNBQUEsQ0FBQTtBQUFBLDJDQUFBLENBQUE7QUFBQSxJQUFBLElBQUksSUFBQyxDQUFBLFFBQUw7QUFBb0IsYUFBTyxJQUFQLENBQXBCO0tBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxLQUFLLENBQUMsS0FBTixDQUFBLENBRmQsQ0FBQTtBQUFBLElBSUEsSUFBQyxDQUFBLE9BQUQsR0FBYSxFQUpiLENBQUE7QUFBQSxJQU1BLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxLQUFLLENBQUMsaUJBQU4sQ0FBd0IsRUFBeEIsRUFBNEIsTUFBTSxDQUFDLFVBQVAsR0FBb0IsTUFBTSxDQUFDLFdBQXZELEVBQW9FLEdBQXBFLEVBQXlFLElBQXpFLENBTmQsQ0FBQTtBQUFBLElBT0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBakIsQ0FBc0IsR0FBdEIsQ0FQQSxDQUFBO0FBQUEsSUFXQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLEtBQUssQ0FBQyxhQUFOLENBQW9CO0FBQUEsTUFBQyxTQUFBLEVBQVcsSUFBWjtBQUFBLE1BQWtCLEtBQUEsRUFBTyxLQUF6QjtLQUFwQixDQVhoQixDQUFBO0FBQUEsSUFZQSxJQUFDLENBQUEsUUFBUSxDQUFDLGFBQVYsQ0FBd0IsTUFBTSxDQUFDLGdCQUEvQixDQVpBLENBQUE7QUFBQSxJQWNBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixNQUFNLENBQUMsVUFBekIsRUFBcUMsTUFBTSxDQUFDLFdBQTVDLENBZEEsQ0FBQTtBQUFBLElBa0JBLFFBQVEsQ0FBQyxjQUFULENBQXdCLFNBQXhCLENBQWtDLENBQUMsV0FBbkMsQ0FBK0MsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUF6RCxDQWxCQSxDQUFBO0FBb0JBLElBQUEsSUFBa0IsS0FBSyxDQUFDLEdBQU4sS0FBYSxhQUEvQjtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFBLENBQUE7S0FwQkE7QUFBQSxJQXNCQSxJQUFDLENBQUEsT0FBRCxDQUFBLENBdEJBLENBQUE7QUFBQSxJQXVCQSxJQUFDLENBQUEsT0FBRCxDQUFBLENBdkJBLENBQUE7QUFBQSxJQXlCQSxNQUFNLENBQUMsUUFBUCxHQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO0FBQ2hCLFFBQUEsS0FBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQWtCLE1BQU0sQ0FBQyxVQUF6QixFQUFxQyxNQUFNLENBQUMsV0FBNUMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxLQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsTUFBTSxDQUFDLFVBQVAsR0FBb0IsTUFBTSxDQUFDLFdBRDVDLENBQUE7ZUFFQSxLQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQUEsRUFIZ0I7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXpCbEIsQ0FEVztFQUFBLENBVGI7O0FBQUEseUJBd0NBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxJQUFBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxLQUFBLENBQUEsQ0FBZCxDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsQ0FBaEIsQ0FEQSxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBekIsR0FBb0MsVUFGcEMsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQXpCLEdBQWdDLEtBSGhDLENBQUE7QUFBQSxJQUlBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUF6QixHQUErQixLQUovQixDQUFBO1dBS0EsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFkLENBQTJCLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBbkMsRUFOVztFQUFBLENBeENiLENBQUE7O0FBQUEseUJBZ0RBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxJQUFBLE1BQU0sQ0FBQyxxQkFBUCxDQUE2QixJQUFDLENBQUEsT0FBOUIsQ0FBQSxDQUFBO0FBRUEsSUFBQSxJQUFHLENBQUEsSUFBRSxDQUFBLFlBQUYsSUFBa0IsSUFBQyxDQUFBLFlBQVksQ0FBQyxRQUFkLENBQUEsQ0FBckI7QUFDSSxZQUFBLENBREo7S0FGQTtBQUFBLElBTUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLENBQXFCLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFBLENBQUEsR0FBcUIsSUFBMUMsQ0FOQSxDQUFBO0FBQUEsSUFVQSxJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBa0IsSUFBQyxDQUFBLFlBQW5CLEVBQWlDLElBQUMsQ0FBQSxNQUFsQyxDQVZBLENBQUE7QUFZQSxJQUFBLElBQW9CLEtBQUssQ0FBQyxHQUFOLEtBQWEsYUFBakM7YUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBQSxFQUFBO0tBYk87RUFBQSxDQWhEVCxDQUFBOztBQUFBLHlCQStEQSxPQUFBLEdBQVMsU0FBQSxHQUFBLENBL0RULENBQUE7O0FBQUEseUJBMkVBLFdBQUEsR0FBYSxTQUFDLFVBQUQsRUFBYSxNQUFiLEVBQXFCLFdBQXJCLEdBQUE7QUFDWCxRQUFBLEtBQUE7QUFBQSxJQUFBLElBQUcsSUFBQyxDQUFBLE9BQVEsQ0FBQSxVQUFBLENBQVo7QUFDSSxhQUFPLE1BQVAsQ0FESjtLQUFBO0FBQUEsSUFHQSxLQUFBLEdBQVksSUFBQSxNQUFBLENBQUEsQ0FIWixDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsT0FBUSxDQUFBLFVBQUEsQ0FBVCxHQUF1QixLQUp2QixDQUFBO0FBTUEsV0FBTyxLQUFQLENBUFc7RUFBQSxDQTNFYixDQUFBOztBQUFBLHlCQW9GQSxTQUFBLEdBQVcsU0FBQyxVQUFELEdBQUE7QUFDVCxJQUFBLElBQWlELElBQUMsQ0FBQSxZQUFsRDtBQUFBLE1BQUEsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLEdBQVYsQ0FBYyxRQUFkLEVBQXdCLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBdEMsQ0FBQSxDQUFBO0tBQUE7QUFDQSxJQUFBLElBQUcsSUFBQyxDQUFBLE9BQVEsQ0FBQSxVQUFBLENBQVo7QUFDSSxNQUFBLElBQXlCLElBQUMsQ0FBQSxZQUExQjtBQUFBLFFBQUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxLQUFkLENBQUEsQ0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUMsQ0FBQSxPQUFRLENBQUEsVUFBQSxDQUR6QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxFQUFWLENBQWEsUUFBYixFQUF1QixJQUFDLENBQUEsWUFBWSxDQUFDLE1BQXJDLENBSEEsQ0FBQTtBQUlBLGFBQU8sSUFBUCxDQUxKO0tBREE7QUFRQSxXQUFPLEtBQVAsQ0FUUztFQUFBLENBcEZYLENBQUE7O3NCQUFBOztJQTFnQkYsQ0FBQTs7QUFBQSxLQTBtQlcsQ0FBQztBQUVWLCtCQUFBLENBQUE7O0FBQUEsc0JBQUEsU0FBQSxHQUFXLElBQVgsQ0FBQTs7QUFBQSxzQkFDQSxPQUFBLEdBQVcsSUFEWCxDQUFBOztBQUFBLHNCQUdBLGNBQUEsR0FBZ0IsSUFIaEIsQ0FBQTs7QUFBQSxzQkFJQSxNQUFBLEdBQWdCLElBSmhCLENBQUE7O0FBTWEsRUFBQSxtQkFBQSxHQUFBO0FBQ1gsdUNBQUEsQ0FBQTtBQUFBLElBQUEsNENBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FGQSxDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsS0FBRCxDQUFBLENBSEEsQ0FBQTtBQUFBLElBWUEsSUFBQyxDQUFBLEdBQUQsR0FBVyxJQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBZCxDQUFBLENBWlgsQ0FBQTtBQUFBLElBYUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQUEsQ0FiQSxDQUFBO0FBQUEsSUFjQSxJQUFDLENBQUEsR0FBRCxDQUFLLElBQUMsQ0FBQSxHQUFOLENBZEEsQ0FEVztFQUFBLENBTmI7O0FBQUEsc0JBdUJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7V0FDUCxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBeEQsRUFBOEQsSUFBQyxDQUFBLEtBQS9ELEVBRE87RUFBQSxDQXZCVCxDQUFBOztBQUFBLHNCQTBCQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsSUFBQSxLQUFLLENBQUMsT0FBTixHQUE0QixJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBZCxDQUE1QixDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsT0FBRCxHQUF3QixLQUFLLENBQUMsT0FEOUIsQ0FBQTtXQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxHQUF3QixJQUFDLENBQUEsY0FIcEI7RUFBQSxDQTFCUCxDQUFBOztBQUFBLHNCQStCQSxNQUFBLEdBQVEsU0FBQyxLQUFELEdBQUE7QUFDTixJQUFBLHNDQUFNLEtBQU4sQ0FBQSxDQUFBO0FBQ0EsSUFBQSxJQUEwQixJQUFDLENBQUEsT0FBM0I7YUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsS0FBaEIsRUFBQTtLQUZNO0VBQUEsQ0EvQlIsQ0FBQTs7bUJBQUE7O0dBRjRCLEtBQUssQ0FBQyxNQTFtQnBDLENBQUE7O0FBQUEsS0FncEJXLENBQUM7QUFFVix1QkFBQSxTQUFBLEdBQWMsSUFBZCxDQUFBOztBQUFBLHVCQUNBLFlBQUEsR0FBYyxJQURkLENBQUE7O0FBQUEsdUJBRUEsS0FBQSxHQUFjLElBRmQsQ0FBQTs7QUFJYSxFQUFBLG9CQUFDLEVBQUQsRUFBSyxZQUFMLEdBQUE7QUFDWCwyQ0FBQSxDQUFBO0FBQUEsSUFBQSxFQUFFLENBQUMsVUFBSCxDQUFjO0FBQUEsTUFDWixTQUFBLEVBQVcsRUFEQztBQUFBLE1BRVosWUFBQSxFQUFjLFlBRkY7S0FBZCxDQUFBLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxTQUFELEdBQWdCLEVBTGhCLENBQUE7QUFBQSxJQU1BLElBQUMsQ0FBQSxZQUFELEdBQWdCLFlBTmhCLENBRFc7RUFBQSxDQUpiOztBQUFBLHVCQXVCQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsSUFBQSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBaEIsQ0FBd0IsNkRBQXhCLEVBQXVGLElBQXZGLENBQUEsS0FBZ0csTUFBcEc7QUFDRSxNQUFBLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBQWdDLENBQUMsU0FBUyxDQUFDLEdBQTNDLENBQStDLE1BQS9DLENBQUEsQ0FBQTtBQUFBLE1BQ0EsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZ0MsQ0FBQyxnQkFBakMsQ0FBa0QsT0FBbEQsRUFBMkQsSUFBQyxDQUFBLE9BQTVELENBREEsQ0FERjtLQUFBLE1BQUE7QUFJRSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFoQixDQUF3Qix5REFBeEIsRUFBbUYsSUFBbkYsQ0FBVCxDQUFBO0FBQ0EsYUFBTyxJQUFQLENBTEY7S0FBQTtBQU1BLFdBQU8sS0FBUCxDQVBXO0VBQUEsQ0F2QmIsQ0FBQTs7QUFBQSx1QkFnQ0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtXQUNQLEVBQUUsQ0FBQyxPQUFILENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUEsR0FBQTtBQUNULFFBQUEsS0FBQyxDQUFBLEtBQUQsR0FBa0IsRUFBRSxDQUFDLFdBQUgsQ0FBQSxDQUFsQixDQUFBO0FBQUEsUUFDQSxRQUFRLENBQUMsTUFBVCxHQUFrQixtQkFBQSxHQUFzQixLQUFDLENBQUEsS0FEekMsQ0FBQTtBQUFBLFFBRUEsUUFBUSxDQUFDLE1BQVQsR0FBa0IsMkJBRmxCLENBQUE7QUFBQSxRQUdBLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBQWdDLENBQUMsU0FBUyxDQUFDLE1BQTNDLENBQWtELE1BQWxELENBSEEsQ0FBQTtlQUlBLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFoQyxFQUxTO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQURPO0VBQUEsQ0FoQ1QsQ0FBQTs7QUFBQSx1QkF5Q0EsU0FBQSxHQUFXLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtBQUVULElBQUEsSUFBRyxzQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxJQUE1QyxDQUFIO0FBQ0UsYUFBTyxRQUFBLENBQVMsSUFBVCxDQUFQLENBREY7S0FBQTtBQUdBLElBQUEsSUFBQSxDQUFBLGVBQXNCLENBQUMsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBUDtBQUNFLGFBQU8sT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFBLEdBQU8sSUFBUCxHQUFjLDRCQUExQixDQUFQLENBREY7S0FIQTtXQU1BLEVBQUUsQ0FBQyxHQUFILENBQU8sVUFBUCxFQUFtQjtBQUFBLE1BQUUsR0FBQSxFQUFLLElBQVA7S0FBbkIsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsS0FBRCxFQUFRLEtBQVIsR0FBQTtBQUNoQyxZQUFBLEdBQUE7QUFBQSxRQUFBLElBQUksS0FBSjtBQUNFLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFLLENBQUMsT0FBbEIsQ0FBQSxDQUFBO2lCQUNBLFFBQUEsQ0FBUyxLQUFLLENBQUMsT0FBZixFQUF3QixLQUF4QixFQUZGO1NBQUEsTUFBQTtBQUlFLFVBQUEsR0FBQSxHQUFNLENBQUMsRUFBRCxFQUFLLEtBQUssQ0FBQyxJQUFOLEdBQVcsR0FBaEIsRUFBcUIsS0FBSyxDQUFDLEVBQTNCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsR0FBcEMsQ0FBTixDQUFBO2lCQUNBLFFBQUEsQ0FBUyxHQUFULEVBTEY7U0FEZ0M7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxFQVJTO0VBQUEsQ0F6Q1gsQ0FBQTs7QUFBQSx1QkEwREEsV0FBQSxHQUFhLFNBQUMsTUFBRCxFQUFTLE9BQVQsRUFBcUIsUUFBckIsR0FBQTtBQUNYLFFBQUEsY0FBQTs7TUFEb0IsVUFBUTtLQUM1QjtBQUFBLElBQUEsSUFBRyxNQUFBLElBQVcsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsQ0FBZDtBQUNFLE1BQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBWCxDQUFtQiw0QkFBbkIsRUFBaUQsRUFBakQsQ0FBUCxDQUFBO0FBQUEsTUFFQSxRQUFBLEdBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxJQUFWO0FBQUEsUUFDQSxlQUFBLEVBQWlCLElBRGpCO0FBQUEsUUFFQSxhQUFBLEVBQWUsSUFGZjtBQUFBLFFBR0EsV0FBQSxFQUFhLEtBSGI7T0FIRixDQUFBO0FBQUEsTUFRQSxPQUFBLEdBQVUsT0FBTyxDQUFDLEtBQVIsQ0FBYyxRQUFkLEVBQXdCLE9BQXhCLENBUlYsQ0FBQTthQVNBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVixFQUFnQixPQUFoQixFQUF5QixRQUF6QixFQVZGO0tBRFc7RUFBQSxDQTFEYixDQUFBOztBQUFBLHVCQThFQSxrQkFBQSxHQUFvQixTQUFDLElBQUQsRUFBTyxRQUFQLEdBQUE7QUFDbEIsSUFBQSxJQUFHLE1BQUEsQ0FBQSxJQUFBLEtBQWUsUUFBZixJQUE0QixJQUFJLENBQUMsY0FBTCxDQUFvQixNQUFwQixDQUEvQjtBQUNFLE1BQUEsUUFBQSxDQUFTLElBQVQsQ0FBQSxDQUFBO0FBQ0EsYUFBTyxJQUFQLENBRkY7S0FBQTtXQUlBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBWCxFQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxJQUFELEVBQU8sS0FBUCxHQUFBO0FBQ2YsUUFBQSxJQUFHLEtBQUg7QUFDRSxVQUFBLFFBQUEsQ0FBUyxJQUFULEVBQWUsS0FBZixDQUFBLENBQUE7QUFDQSxnQkFBQSxDQUZGO1NBQUE7ZUFHQSxLQUFDLENBQUEsR0FBRCxDQUFLLElBQUwsRUFBVyxRQUFYLEVBSmU7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQixFQUxrQjtFQUFBLENBOUVwQixDQUFBOztBQUFBLHVCQTBGQSxHQUFBLEdBQUssU0FBQyxJQUFELEVBQU8sUUFBUCxHQUFBO1dBQ0gsRUFBRSxDQUFDLEdBQUgsQ0FBTyxJQUFQLEVBQWEsUUFBYixFQURHO0VBQUEsQ0ExRkwsQ0FBQTs7QUFBQSx1QkE2RkEsV0FBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtXQUNYLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFwQixFQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxLQUFELEdBQUE7ZUFDeEIsUUFBQSxDQUFTLEtBQUssQ0FBQyxVQUFOLEdBQWlCLGVBQWpCLEdBQWlDLEtBQUMsQ0FBQSxLQUEzQyxFQUR3QjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLEVBRFc7RUFBQSxDQTdGYixDQUFBOztBQUFBLHVCQWtHQSxNQUFBLEdBQVEsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLFFBQWYsR0FBQTtBQUNOLElBQUEsSUFBRyxNQUFBLENBQUEsSUFBQSxLQUFlLFVBQWxCO0FBQ0UsTUFBQSxRQUFBLEdBQVcsSUFBWCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQVcsUUFEWCxDQURGO0tBQUE7QUFJQSxJQUFBLElBQUcsSUFBQSxLQUFRLE9BQVg7YUFDRSxJQUFDLENBQUEsU0FBRCxDQUFXLHlCQUFBLEdBQTBCLE1BQXJDLEVBQTZDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7QUFDM0MsVUFBQSxJQUFHLEtBQUg7QUFDRSxZQUFBLFFBQUEsQ0FBUyxJQUFULEVBQWUsS0FBZixDQUFBLENBQUE7QUFDQSxrQkFBQSxDQUZGO1dBQUE7QUFBQSxVQUlBLElBQUEsR0FBTyxJQUFBLEdBQUsseUJBQUwsR0FBK0IsS0FBQyxDQUFBLEtBSnZDLENBQUE7aUJBS0EsRUFBRSxDQUFDLEdBQUgsQ0FBTyxJQUFQLEVBQWEsUUFBYixFQU4yQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdDLEVBREY7S0FBQSxNQUFBO0FBVUUsTUFBQSxJQUFBLEdBQU8sR0FBQSxHQUFJLElBQUosR0FBUyxlQUFULEdBQXlCLElBQUMsQ0FBQSxLQUExQixHQUFnQyxLQUFoQyxHQUFzQyxNQUE3QyxDQUFBO2FBQ0EsRUFBRSxDQUFDLEdBQUgsQ0FBTyxJQUFQLEVBQWEsUUFBYixFQVhGO0tBTE07RUFBQSxDQWxHUixDQUFBOztvQkFBQTs7SUFscEJGLENBQUE7O0FBQUEsS0F1d0JXLENBQUM7QUFDVix5QkFBQSxFQUFBLEdBQUksSUFBSixDQUFBOztBQUFBLHlCQUNBLE9BQUEsR0FBUyxJQURULENBQUE7O0FBQUEseUJBSUEsS0FBQSxHQUFlLElBSmYsQ0FBQTs7QUFBQSx5QkFLQSxJQUFBLEdBQWUsSUFMZixDQUFBOztBQUFBLHlCQU1BLGFBQUEsR0FBZSxJQU5mLENBQUE7O0FBQUEseUJBT0EsRUFBQSxHQUFlLElBUGYsQ0FBQTs7QUFBQSx5QkFRQSxVQUFBLEdBQWUsQ0FSZixDQUFBOztBQUFBLHlCQVNBLGFBQUEsR0FBZSxDQVRmLENBQUE7O0FBQUEseUJBVUEsT0FBQSxHQUFlLElBVmYsQ0FBQTs7QUFBQSx5QkFXQSxPQUFBLEdBQWUsSUFYZixDQUFBOztBQUFBLHlCQWFBLFNBQUEsR0FBZSxDQWJmLENBQUE7O0FBQUEsRUFlQSxZQUFDLENBQUEsS0FBRCxHQUFTLElBZlQsQ0FBQTs7QUFrQmEsRUFBQSxzQkFBQyxPQUFELEdBQUE7QUFDWCx1Q0FBQSxDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLHFFQUFBLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxPQUFELEdBQWlCLE9BQWpCLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxFQUFELEdBQWlCLEtBQUssQ0FBQyxFQUR2QixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsRUFBRCxHQUFpQixRQUFRLENBQUMsYUFBVCxDQUF1QixTQUF2QixDQUhqQixDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsS0FBRCxHQUFpQixRQUFRLENBQUMsYUFBVCxDQUF1QixvQkFBdkIsQ0FKakIsQ0FBQTtBQUFBLElBS0EsSUFBQyxDQUFBLElBQUQsR0FBaUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZUFBdkIsQ0FMakIsQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FOakIsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBakMsQ0FSQSxDQUFBO0FBQUEsSUFTQSxJQUFDLENBQUEsT0FBRCxDQUFBLENBVEEsQ0FEVztFQUFBLENBbEJiOztBQUFBLHlCQThCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsSUFBQSxRQUFRLENBQUMsYUFBVCxDQUF1QixjQUF2QixDQUFzQyxDQUFDLGdCQUF2QyxDQUF3RCxRQUF4RCxFQUFrRSxJQUFDLENBQUEsb0JBQW5FLENBQUEsQ0FBQTtXQUNBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxJQUFDLENBQUEsVUFBcEMsRUFGTztFQUFBLENBOUJULENBQUE7O0FBQUEseUJBa0NBLG9CQUFBLEdBQXNCLFNBQUMsQ0FBRCxHQUFBO0FBQ3BCLElBQUEsQ0FBQyxDQUFDLGNBQUYsQ0FBQSxDQUFBLENBQUE7QUFDQSxJQUFBLElBQXlCLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQWIsR0FBc0IsQ0FBL0M7YUFBQSxJQUFDLENBQUEsTUFBRCxDQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBZixFQUFBO0tBRm9CO0VBQUEsQ0FsQ3RCLENBQUE7O0FBQUEseUJBc0NBLFVBQUEsR0FBWSxTQUFDLENBQUQsR0FBQTtBQUNWLFlBQU8sQ0FBQyxDQUFDLE9BQVQ7QUFBQSxXQUNPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FEckI7QUFFSSxRQUFBLElBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBYixLQUF1QixDQUExQjtBQUNFLFVBQUEsSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFwQzttQkFDRSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFqQyxFQURGO1dBQUEsTUFBQTttQkFHRSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFqQyxFQUhGO1dBREY7U0FBQSxNQUtLLElBQUcsSUFBQyxDQUFBLEtBQUQsS0FBVSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBakMsSUFBNEMsSUFBQyxDQUFBLE9BQWhEO2lCQUNILElBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWpDLEVBREc7U0FBQSxNQUVBLElBQUcsSUFBQyxDQUFBLEtBQUQsS0FBVSxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBcEM7aUJBQ0gsSUFBQyxDQUFBLEdBQUQsQ0FBQSxFQURHO1NBVFQ7QUFDTztBQURQLFdBWU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQVpyQjtBQWFJLFFBQUEsSUFBUyxJQUFDLENBQUEsS0FBRCxLQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUExQztpQkFBQSxJQUFDLENBQUEsRUFBRCxDQUFBLEVBQUE7U0FiSjtBQVlPO0FBWlAsV0FlTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBZnJCO0FBZ0JJLFFBQUEsSUFBVyxJQUFDLENBQUEsS0FBRCxLQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUE1QztpQkFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBQUE7U0FoQko7QUFlTztBQWZQLFdBa0JPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FsQnJCO0FBQUEsV0FrQjBCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFsQnhDO0FBbUJJLFFBQUEsSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFwQztpQkFDRSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFqQyxFQURGO1NBQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSxLQUFELEtBQVUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQXBDO2lCQUNILElBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQWpDLEVBREc7U0FBQSxNQUFBO2lCQUdILElBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQWpDLEVBSEc7U0FyQlQ7QUFrQjBCO0FBbEIxQjtBQTJCSSxlQUFPLEtBQVAsQ0EzQko7QUFBQSxLQURVO0VBQUEsQ0F0Q1osQ0FBQTs7QUFBQSx5QkFvRUEsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEtBQVQsQ0FBQTtBQUNBLFlBQU8sSUFBQyxDQUFBLEtBQVI7QUFBQSxXQUNPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUQ5QjtBQUVJLFFBQUEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBZCxDQUFxQixRQUFyQixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQWQsQ0FBcUIsYUFBckIsQ0FEQSxDQUFBO0FBQUEsUUFHQSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsR0FBa0IsRUFIbEIsQ0FBQTtBQUFBLFFBSUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLEdBQWtCLEtBSmxCLENBQUE7QUFBQSxRQUtBLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxDQUFBLENBTEEsQ0FBQTtlQU9BLElBQUMsQ0FBQSxLQUFELENBQUEsRUFUSjtBQUFBLFdBVU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BVjlCO2VBV0ksSUFBQyxDQUFBLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixRQUFsQixFQVhKO0FBQUEsV0FZTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFaOUI7QUFhSSxRQUFBLElBQUMsQ0FBQSxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQWQsQ0FBa0IsYUFBbEIsQ0FBQSxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsR0FBa0IsSUFGbEIsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsQ0FIQSxDQUFBO0FBQUEsUUFLQSxJQUFDLENBQUEsVUFBRCxHQUFpQixJQUFDLENBQUEsYUFBYSxDQUFDLGFBQWYsQ0FBNkIsSUFBN0IsQ0FBa0MsQ0FBQyxZQUxwRCxDQUFBO0FBQUEsUUFNQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFDLENBQUEsVUFBRCxHQUFjLENBQUMsSUFBQyxDQUFBLGFBQWEsQ0FBQyxnQkFBZixDQUFnQyxJQUFoQyxDQUFxQyxDQUFDLE1BQXRDLEdBQTZDLENBQTlDLENBTi9CLENBQUE7QUFRQSxRQUFBLElBQXlDLElBQUMsQ0FBQSxPQUExQztBQUFBLFVBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBbkIsQ0FBMEIsVUFBMUIsQ0FBQSxDQUFBO1NBUkE7ZUFTQSxJQUFDLENBQUEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFkLENBQXFCLGVBQXJCLEVBdEJKO0FBQUEsV0F1Qk8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBdkI5QjtBQXdCSSxRQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFVBQXZCLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQWQsQ0FBa0IsZUFBbEIsRUF6Qko7QUFBQSxLQUZRO0VBQUEsQ0FwRVYsQ0FBQTs7QUFBQSx5QkFpR0EsRUFBQSxHQUFJLFNBQUEsR0FBQTtBQUNGLFFBQUEsSUFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLFVBQXJCLENBQUE7QUFDQSxJQUFBLElBQUcsSUFBQSxJQUFRLENBQVg7QUFDRSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBYixDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQUZGO0tBRkU7RUFBQSxDQWpHSixDQUFBOztBQUFBLHlCQXVHQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osUUFBQSxJQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsVUFBckIsQ0FBQTtBQUNBLElBQUEsSUFBRyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQVQsQ0FBQSxJQUFrQixJQUFDLENBQUEsYUFBdEI7QUFDRSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBYixDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQUZGO0tBRkk7RUFBQSxDQXZHTixDQUFBOztBQUFBLHlCQTZHQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsUUFBQSxRQUFBO0FBQUEsSUFBQSxJQUFHLElBQUMsQ0FBQSxhQUFhLENBQUMsZ0JBQWYsQ0FBZ0MsSUFBaEMsQ0FBcUMsQ0FBQyxNQUF0QyxHQUErQyxDQUFsRDtBQUNFLE1BQUEsQ0FBQSxDQUFFLENBQUMsSUFBQyxDQUFBLGFBQUYsRUFBaUIsSUFBQyxDQUFBLEtBQWxCLENBQUYsQ0FBMkIsQ0FBQyxHQUE1QixDQUFnQyxXQUFoQyxFQUE2QyxlQUFBLEdBQWdCLElBQUMsQ0FBQSxTQUFqQixHQUEyQixLQUF4RSxDQUFBLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxDQUFDLElBQUMsQ0FBQSxTQUFELEdBQVcsQ0FBQSxDQUFaLENBQUEsR0FBa0IsQ0FBQyxJQUFDLENBQUEsYUFBRCxHQUFpQixDQUFDLElBQUMsQ0FBQSxhQUFhLENBQUMsZ0JBQWYsQ0FBZ0MsSUFBaEMsQ0FBcUMsQ0FBQyxNQUF0QyxHQUE2QyxDQUE5QyxDQUFsQixDQUR4QixDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBRk4sQ0FBQTtBQUFBLE1BR0EsR0FBQSxHQUFNLElBQUMsQ0FBQSxFQUFFLENBQUMsYUFBSixDQUFrQixlQUFBLEdBQWdCLENBQUMsR0FBQSxHQUFJLENBQUwsQ0FBaEIsR0FBd0IsR0FBMUMsQ0FITixDQUFBO0FBS0EsTUFBQSxJQUFHLEdBQUcsQ0FBQyxZQUFKLENBQWlCLFlBQWpCLENBQUg7QUFDRSxRQUFBLElBQXdDLElBQUMsQ0FBQSxPQUF6QztBQUFBLFVBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBbkIsQ0FBMEIsU0FBMUIsQ0FBQSxDQUFBO1NBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FEWCxDQUFBO2VBRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsU0FBdkIsRUFIRjtPQUFBLE1BQUE7ZUFLRSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBTGI7T0FORjtLQUFBLE1BQUE7YUFhRSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFqQyxFQWJGO0tBREs7RUFBQSxDQTdHUCxDQUFBOztBQUFBLHlCQThIQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsSUFBQSxJQUFDLENBQUEsT0FBRCxHQUFhLElBQWIsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQURiLENBQUE7QUFBQSxJQUVBLENBQUEsQ0FBRSxDQUFDLElBQUMsQ0FBQSxhQUFGLEVBQWlCLElBQUMsQ0FBQSxLQUFsQixDQUFGLENBQTJCLENBQUMsR0FBNUIsQ0FBZ0MsV0FBaEMsRUFBNkMsZUFBQSxHQUFnQixJQUFDLENBQUEsU0FBakIsR0FBMkIsS0FBeEUsQ0FGQSxDQUFBO1dBR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxTQUFmLEdBQTJCLEdBSnRCO0VBQUEsQ0E5SFAsQ0FBQTs7QUFBQSx5QkFvSUEsR0FBQSxHQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsWUFBQTtBQUFBLElBQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixZQUF0QixDQUFSLENBQUE7QUFBQSxJQUNBLEtBQUEsR0FBUSxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FEakIsQ0FBQTtBQUVBLElBQUEsSUFBdUIsS0FBdkI7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLEtBQWIsQ0FBQSxDQUFBO0tBRkE7QUFBQSxJQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLE9BQXZCLENBSkEsQ0FBQTtBQUFBLElBS0EsQ0FBQSxDQUFFLElBQUMsQ0FBQSxPQUFILENBQVcsQ0FBQyxHQUFaLENBQWdCO0FBQUEsTUFDZCxXQUFBLEVBQWEsd0JBQUEsR0FBeUIsTUFBTSxDQUFDLFVBQWhDLEdBQTJDLEtBRDFDO0tBQWhCLENBTEEsQ0FBQTtXQVNBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO0FBQ1QsUUFBQSxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQWpDLENBREEsQ0FBQTtBQUVBLFFBQUEsSUFBUyxLQUFDLENBQUEsT0FBTyxDQUFDLFdBQWxCO0FBQUEsVUFBQSxLQUFDLENBQUEsRUFBRCxDQUFBLENBQUEsQ0FBQTtTQUZBO2VBR0EsS0FBQyxDQUFBLEtBQUQsQ0FBQSxFQUpTO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUtFLEdBTEYsRUFWRztFQUFBLENBcElMLENBQUE7O0FBQUEseUJBcUpBLE1BQUEsR0FBUSxTQUFDLEtBQUQsR0FBQTtBQUNOLFFBQUEsK0JBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxLQUFLLENBQUMsS0FBTixDQUFZLElBQVosQ0FBa0IsQ0FBQSxDQUFBLENBQXpCLENBQUE7QUFDQSxJQUFBLElBQUcseURBQXlELENBQUMsSUFBMUQsQ0FBK0QsSUFBL0QsQ0FBSDtBQUNFLE1BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxNQUFMLENBQVksSUFBSSxDQUFDLE1BQUwsR0FBWSxDQUF4QixDQUFYLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBVyxLQUFLLENBQUMsT0FBTixDQUFjLElBQUEsR0FBSyxHQUFuQixFQUF3QixFQUF4QixDQURYLENBQUE7QUFFQSxNQUFBLElBQW1CLFFBQUEsS0FBWSxHQUEvQjtBQUFBLFFBQUEsSUFBQSxJQUFZLEdBQVosQ0FBQTtPQUZBO0FBR0EsTUFBQSxJQUEwQixNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBMUI7QUFBQSxRQUFBLElBQUEsR0FBVyxXQUFYLENBQUE7T0FKRjtLQUFBLE1BQUE7QUFNRSxNQUFBLElBQUEsR0FBVyxRQUFYLENBTkY7S0FEQTtBQUFBLElBU0EsTUFBQSxHQUFTLGlzUEFUVCxDQUFBO0FBQUEsSUFrQkEsT0FBQSxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsTUFBWCxDQWxCVixDQUFBO0FBQUEsSUFvQkEsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLEdBQWUsZUFBQSxHQUFnQixLQUFoQixHQUFzQixHQXBCckMsQ0FBQTtXQXFCQSxJQUFDLENBQUEsRUFBRSxDQUFDLE1BQUosQ0FBVyxLQUFYLEVBQWtCLElBQWxCLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLE9BQUQsR0FBQTtBQUN0QixZQUFBLGlDQUFBO0FBQUEsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVosQ0FBQSxDQUFBO0FBQ0EsUUFBQSxJQUFHLE9BQU8sQ0FBQyxNQUFSLEtBQWtCLENBQXJCO0FBQ0UsVUFBQSxLQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsR0FBZSxHQUFBLEdBQUksS0FBSixHQUFVLGlCQUF6QixDQUFBO0FBQ0EsZ0JBQUEsQ0FGRjtTQUFBLE1BQUE7QUFJRSxVQUFBLEtBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxHQUFlLGVBQUEsR0FBZ0IsS0FBaEIsR0FBc0IsR0FBckMsQ0FKRjtTQURBO0FBQUEsUUFPQSxLQUFDLENBQUEsT0FBRCxHQUFlLEVBUGYsQ0FBQTtBQUFBLFFBUUEsS0FBQyxDQUFBLGFBQWEsQ0FBQyxXQUFmLENBQTJCLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBQTNCLENBUkEsQ0FBQTtBQVNBLGFBQUEsaURBQUE7NkJBQUE7QUFDRSxVQUFBLEVBQUEsR0FBSyxRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QixDQUFMLENBQUE7QUFBQSxVQUNBLEVBQUUsQ0FBQyxZQUFILENBQWdCLFlBQWhCLEVBQThCLENBQTlCLENBREEsQ0FBQTtBQUFBLFVBR0EsV0FBQSxHQUFjLEtBQUssQ0FBQyxXQUhwQixDQUFBO0FBSUEsVUFBQSxJQUFBLENBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLHVCQUFkLENBQUE7V0FKQTtBQUFBLFVBS0EsRUFBRSxDQUFDLFNBQUgsR0FBZSxzQkFBQSxHQUVDLFdBRkQsR0FFYSw2RUFGYixHQUlKLEtBQUssQ0FBQyxLQUpGLEdBSVEsZUFKUixHQUtMLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBcEIsQ0FBQSxDQUFELENBTEssR0FLOEIsd0JBVjdDLENBQUE7QUFBQSxVQWNBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLEtBQWQsQ0FkQSxDQUFBO0FBQUEsVUFlQSxLQUFDLENBQUEsYUFBYSxDQUFDLFdBQWYsQ0FBMkIsRUFBM0IsQ0FmQSxDQURGO0FBQUEsU0FUQTtlQTBCQSxLQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFqQyxFQTNCc0I7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixFQXRCTTtFQUFBLENBckpSLENBQUE7O3NCQUFBOztJQXh3QkYsQ0FBQTs7QUFBQSxLQWs5QlcsQ0FBQztBQUdWLG9CQUFBLEVBQUEsR0FBYyxJQUFkLENBQUE7O0FBQUEsb0JBQ0EsT0FBQSxHQUFjLElBRGQsQ0FBQTs7QUFBQSxvQkFFQSxPQUFBLEdBQWMsSUFGZCxDQUFBOztBQUFBLG9CQUdBLFFBQUEsR0FBYyxJQUhkLENBQUE7O0FBQUEsb0JBSUEsWUFBQSxHQUFjLElBSmQsQ0FBQTs7QUFBQSxvQkFLQSxZQUFBLEdBQWMsSUFMZCxDQUFBOztBQUFBLG9CQVFBLEtBQUEsR0FBYSxJQVJiLENBQUE7O0FBQUEsb0JBU0EsU0FBQSxHQUFhLElBVGIsQ0FBQTs7QUFBQSxvQkFVQSxLQUFBLEdBQWEsSUFWYixDQUFBOztBQUFBLG9CQWFBLEtBQUEsR0FBYyxJQWJkLENBQUE7O0FBQUEsb0JBY0EsWUFBQSxHQUFjLElBZGQsQ0FBQTs7QUFBQSxvQkFpQkEsS0FBQSxHQUFPLElBakJQLENBQUE7O0FBQUEsb0JBa0JBLElBQUEsR0FBTSxDQWxCTixDQUFBOztBQW9CYSxFQUFBLGlCQUFDLEtBQUQsR0FBQTtBQUNYLHVEQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsNkRBQUEsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBVCxDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQURiLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLElBQUMsQ0FBQSxLQUFaLENBRkEsQ0FBQTtBQUFBLElBSUEsSUFBQyxDQUFBLFlBQUQsR0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLElBQU47QUFBQSxNQUNBLE1BQUEsRUFBUSxJQURSO0tBTEYsQ0FBQTtBQUFBLElBT0EsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFuQyxDQVBBLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFLLENBQUMsU0FBTixDQUFnQjtBQUFBLE1BQzNCLFNBQUEsRUFBVyxDQURnQjtBQUFBLE1BRTNCLFNBQUEsRUFBVyxHQUZnQjtBQUFBLE1BRzNCLE1BQUEsRUFBUSxHQUhtQjtBQUFBLE1BSTNCLEtBQUEsRUFBTyxRQUpvQjtBQUFBLE1BSzNCLFFBQUEsRUFBVSxLQUxpQjtBQUFBLE1BTTNCLGFBQUEsRUFBZSxFQU5ZO0FBQUEsTUFPM0IsV0FBQSxFQUFhLENBUGM7QUFBQSxNQVEzQixpQkFBQSxFQUFtQixHQVJRO0tBQWhCLENBVmIsQ0FBQTtBQUFBLElBb0JBLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLElBQUMsQ0FBQSxLQUFaLENBcEJBLENBQUE7QUFBQSxJQXNCQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLEtBQUssQ0FBQyxTQUFOLENBQWdCO0FBQUEsTUFDL0IsU0FBQSxFQUFXLENBRG9CO0FBQUEsTUFFL0IsU0FBQSxFQUFXLEVBRm9CO0FBQUEsTUFHL0IsTUFBQSxFQUFRLEdBSHVCO0FBQUEsTUFJL0IsS0FBQSxFQUFPLFFBSndCO0FBQUEsTUFLL0IsUUFBQSxFQUFVLEtBTHFCO0FBQUEsTUFNL0IsYUFBQSxFQUFlLEVBTmdCO0FBQUEsTUFPL0IsV0FBQSxFQUFhLENBUGtCO0FBQUEsTUFRL0IsaUJBQUEsRUFBbUIsR0FSWTtLQUFoQixDQXRCakIsQ0FBQTtBQUFBLElBZ0NBLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLElBQUMsQ0FBQSxTQUFaLENBaENBLENBQUE7QUFBQSxJQWtDQSxJQUFDLENBQUEsRUFBRCxHQUFnQixLQUFLLENBQUMsRUFsQ3RCLENBQUE7QUFBQSxJQW1DQSxJQUFDLENBQUEsT0FBRCxHQUFnQixFQW5DaEIsQ0FBQTtBQUFBLElBb0NBLElBQUMsQ0FBQSxRQUFELEdBQWdCLEVBcENoQixDQUFBO0FBQUEsSUFzQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQXRDQSxDQUFBO0FBQUEsSUF1Q0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQTVCLENBdkNBLENBRFc7RUFBQSxDQXBCYjs7QUFBQSxvQkE4REEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLElBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQWpELEVBQXVELElBQUMsQ0FBQSxnQkFBeEQsQ0FBQSxDQUFBO1dBQ0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQWpELEVBQXVELElBQUMsQ0FBQSxnQkFBeEQsRUFGTztFQUFBLENBOURULENBQUE7O0FBQUEsb0JBbUVBLGdCQUFBLEdBQWtCLFNBQUMsQ0FBRCxHQUFBO1dBQ2hCLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUE1QixFQURnQjtFQUFBLENBbkVsQixDQUFBOztBQUFBLG9CQXNFQSxnQkFBQSxHQUFrQixTQUFDLENBQUQsR0FBQTtBQUNoQixJQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUE3QixDQUFBLENBQUE7QUFFQSxJQUFBLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLEdBQW1CLENBQXRCO2FBQ0UsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQTVCLEVBREY7S0FBQSxNQUFBO2FBR0UsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQTVCLEVBSEY7S0FIZ0I7RUFBQSxDQXRFbEIsQ0FBQTs7QUFBQSxvQkFtRkEsWUFBQSxHQUFjLFNBQUMsSUFBRCxHQUFBO0FBRVosUUFBQSxLQUFBO0FBQUEsSUFBQSxLQUFBLEdBQXNCLElBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxJQUFaLENBQXRCLENBQUE7QUFBQSxJQUVBLEtBQUssQ0FBQyxlQUFOLEdBQXdCLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLEdBQWlCLENBQS9CLENBRnhCLENBQUE7QUFBQSxJQU1BLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLEtBQWYsQ0FOQSxDQUFBO0FBQUEsSUFTQSxNQUFNLENBQUMsT0FBUCxDQUFlLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBN0IsRUFBMEM7QUFBQSxNQUFFLEtBQUEsRUFBTyxLQUFUO0tBQTFDLENBVEEsQ0FBQTtXQVVBLEtBQUssQ0FBQyxHQUFOLENBQVUsZUFBQSxHQUFrQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQXZDLEVBWlk7RUFBQSxDQW5GZCxDQUFBOztBQUFBLG9CQWlHQSxZQUFBLEdBQWMsU0FBQyxRQUFELEdBQUE7QUFDWixRQUFBLGdDQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsQ0FBWCxDQUFBO0FBQ0E7QUFBQSxTQUFBLDhDQUFBO3NCQUFBO0FBQ0UsTUFBQSxRQUFBLElBQVksS0FBSyxDQUFDLElBQUksQ0FBQyxRQUF2QixDQUFBO0FBQ0EsTUFBQSxJQUFTLENBQUEsS0FBSyxRQUFkO0FBQUEsY0FBQTtPQUZGO0FBQUEsS0FEQTtBQUlBLFdBQU8sUUFBUCxDQUxZO0VBQUEsQ0FqR2QsQ0FBQTs7QUFBQSxvQkF3R0Esa0JBQUEsR0FBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsOEJBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxFQUFQLENBQUE7QUFBQSxJQWFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFnQixJQUFoQixDQWJQLENBQUE7QUFjQTtTQUFBLDhDQUFBO29CQUFBO0FBQ0Usb0JBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFLLENBQUEsQ0FBQSxDQUFWLEVBQUEsQ0FERjtBQUFBO29CQWZrQjtFQUFBLENBeEdwQixDQUFBOztBQUFBLG9CQThIQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixJQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBVCxDQUFBO0FBQ0EsWUFBTyxLQUFQO0FBQUEsV0FDTyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBRHpCO2VBRUksSUFBQyxDQUFBLE9BQU8sQ0FBQyxvQkFBVCxHQUFnQyxJQUFDLENBQUEsY0FGckM7QUFBQTtBQUlJLFFBQUEsSUFBRyxJQUFDLENBQUEsT0FBSjtBQUNFLFVBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxRQUFULENBQUEsQ0FBQSxDQURGO1NBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFGWCxDQUFBO0FBSUEsUUFBQSxJQUFHLElBQUMsQ0FBQSxLQUFELEtBQVUsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUEvQjtpQkFDRSxNQUFNLENBQUMsT0FBUCxDQUFlLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBN0IsRUFERjtTQVJKO0FBQUEsS0FGUTtFQUFBLENBOUhWLENBQUE7O0FBQUEsb0JBMklBLGVBQUEsR0FBaUIsU0FBQyxLQUFELEdBQUE7QUFDZixRQUFBLFNBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLEtBQWhCLENBQUE7QUFDQSxZQUFPLEtBQVA7QUFBQSxXQUNPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFEekI7ZUFFSSxLQUFLLENBQUMsR0FBTixDQUFVLDJCQUFWLEVBRko7QUFBQSxXQUdPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FIekI7QUFJSSxRQUFBLFNBQUEsR0FBWSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQVQsQ0FBQSxDQUFaLENBQUE7QUFBQSxRQUNBLFNBQVMsQ0FBQyxRQUFWLENBQW1CLGNBQWMsQ0FBQyxRQUFsQyxDQURBLENBQUE7ZUFFQSxVQUFBLENBQVcsSUFBQyxDQUFBLGVBQVosRUFBNkIsRUFBQSxHQUFLLElBQWxDLEVBTko7QUFBQTtlQVFJLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBbkMsRUFSSjtBQUFBLEtBRmU7RUFBQSxDQTNJakIsQ0FBQTs7QUFBQSxvQkF1SkEsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO0FBQ04sSUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFELEtBQVksSUFBZjtBQUNFLE1BQUEsSUFBQyxDQUFBLElBQUQsSUFBUyxLQUFULENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLENBQVIsQ0FIRjtLQUFBO0FBUUEsSUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixHQUFtQixDQUFuQixJQUF3QixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxLQUFwQztBQUNFLE1BQUEsSUFBVyxJQUFDLENBQUEsT0FBRCxLQUFZLElBQXZCO2VBQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUFBO09BREY7S0FUTTtFQUFBLENBdkpSLENBQUE7O0FBQUEsb0JBc0tBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixRQUFBLHlCQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sRUFBUCxDQUFBO0FBQ0E7QUFBQSxTQUFBLHNDQUFBO3NCQUFBO0FBQ0UsTUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVO0FBQUEsUUFBQyxLQUFBLEVBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFuQjtBQUFBLFFBQTBCLGVBQUEsRUFBaUIsS0FBSyxDQUFDLGVBQWpEO09BQVYsQ0FBQSxDQURGO0FBQUEsS0FEQTtBQUdBLFdBQU8sSUFBUCxDQUpJO0VBQUEsQ0F0S04sQ0FBQTs7QUFBQSxvQkE0S0EsR0FBQSxHQUFLLFNBQUMsZUFBRCxHQUFBO1dBQ0gsSUFBQyxDQUFBLFlBQUQsQ0FBYyxlQUFkLEVBREc7RUFBQSxDQTVLTCxDQUFBOztBQUFBLG9CQTZMQSxJQUFBLEdBQU0sU0FBQyxLQUFELEdBQUE7QUFDSixJQUFBLElBQW1CLElBQUMsQ0FBQSxPQUFwQjtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQUEsQ0FBQSxDQUFBO0tBQUE7QUFDQSxJQUFBLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLEdBQW1CLENBQXRCO0FBQ0UsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FBVixDQUFBLENBQVgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUEsQ0FGQSxDQUFBO0FBR0EsYUFBTyxJQUFQLENBSkY7S0FEQTtBQU1BLFdBQU8sS0FBUCxDQVBJO0VBQUEsQ0E3TE4sQ0FBQTs7QUFBQSxvQkFzTUEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUViLElBQUEsSUFBeUMsSUFBQyxDQUFBLE9BQTFDO2FBQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUF6QjtLQUZhO0VBQUEsQ0F0TWYsQ0FBQTs7aUJBQUE7O0lBcjlCRixDQUFBOztBQUFBLEtBZ3FDVyxDQUFDO0FBRVYsa0JBQUEsSUFBQSxHQUFzQixJQUF0QixDQUFBOztBQUFBLGtCQUNBLFNBQUEsR0FBc0IsSUFEdEIsQ0FBQTs7QUFBQSxrQkFFQSxLQUFBLEdBQXNCLElBRnRCLENBQUE7O0FBQUEsa0JBSUEsSUFBQSxHQUFzQixDQUp0QixDQUFBOztBQUFBLGtCQUtBLGVBQUEsR0FBc0IsQ0FMdEIsQ0FBQTs7QUFBQSxrQkFPQSxTQUFBLEdBQXNCLEtBUHRCLENBQUE7O0FBQUEsa0JBUUEsb0JBQUEsR0FBc0IsSUFSdEIsQ0FBQTs7QUFBQSxrQkFVQSxRQUFBLEdBQVUsSUFWVixDQUFBOztBQVlhLEVBQUEsZUFBQyxJQUFELEdBQUE7QUFDWCx1REFBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSwyQ0FBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLDJDQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEsNkRBQUEsQ0FBQTtBQUFBLElBQUEsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFaLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxFQUFELEdBQVksS0FBSyxDQUFDLEVBRGxCLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FBQSxDQUFNLEdBQU4sQ0FGWixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsT0FBRCxDQUFBLENBSEEsQ0FEVztFQUFBLENBWmI7O0FBQUEsa0JBa0JBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxJQUFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFqRCxFQUF1RCxJQUFDLENBQUEsZ0JBQXhELENBQUEsQ0FBQTtXQUNBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFqRCxFQUF1RCxJQUFDLENBQUEsZ0JBQXhELEVBRk87RUFBQSxDQWxCVCxDQUFBOztBQUFBLGtCQXNCQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7V0FDaEIsSUFBQyxDQUFBLFNBQUQsR0FBYSxLQURHO0VBQUEsQ0F0QmxCLENBQUE7O0FBQUEsa0JBeUJBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtXQUNoQixJQUFDLENBQUEsU0FBRCxHQUFhLE1BREc7RUFBQSxDQXpCbEIsQ0FBQTs7QUFBQSxrQkE0QkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFFBQUEsYUFBQTtBQUFBLElBQUEsR0FBQSxHQUFPLG1CQUFBLEdBQW9CLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBakMsQ0FBQTtBQUFBLElBRUEsUUFBQSxHQUFXLElBRlgsQ0FBQTtBQUdBLElBQUEsSUFBQSxDQUFBLE1BQWEsQ0FBQyxXQUFkO0FBQ0UsTUFBQSxNQUFNLENBQUMsV0FBUCxHQUFxQixNQUFNLENBQUMsV0FBUCxJQUEwQixJQUFBLEtBQUssQ0FBQyxXQUFOLENBQUEsQ0FBL0MsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLEtBRFgsQ0FERjtLQUhBO0FBQUEsSUFPQSxJQUFDLENBQUEsR0FBRCxHQUFPLFdBUFAsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLEdBQXNCLElBQUMsQ0FBQSxPQVJ2QixDQUFBO0FBQUEsSUFTQSxJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsR0FBc0IsSUFBQyxDQUFBLFFBVHZCLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxHQUFHLENBQUMsY0FBTCxHQUFzQixJQUFDLENBQUEsYUFWdkIsQ0FBQTtBQUFBLElBV0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLEdBQXNCLElBQUMsQ0FBQSxTQVh2QixDQUFBO1dBWUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLENBQVksR0FBWixFQUFpQixRQUFqQixFQUEyQixJQUFDLENBQUEsT0FBNUIsRUFiTTtFQUFBLENBNUJSLENBQUE7O0FBQUEsa0JBMkNBLElBQUEsR0FBTSxTQUFBLEdBQUE7V0FDSixJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBQSxFQURJO0VBQUEsQ0EzQ04sQ0FBQTs7QUFBQSxrQkE4Q0EsS0FBQSxHQUFPLFNBQUEsR0FBQTtXQUNMLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBTCxDQUFBLEVBREs7RUFBQSxDQTlDUCxDQUFBOztBQUFBLGtCQWlEQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osSUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBQSxDQUFBLENBQUE7V0FDQSxJQUFDLENBQUEsU0FBRCxDQUFBLEVBRkk7RUFBQSxDQWpETixDQUFBOztBQUFBLGtCQXFEQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsSUFBQSxRQUFRLENBQUMsbUJBQVQsQ0FBNkIsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBcEQsRUFBMEQsSUFBQyxDQUFBLGdCQUEzRCxDQUFBLENBQUE7QUFBQSxJQUNBLFFBQVEsQ0FBQyxtQkFBVCxDQUE2QixLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFwRCxFQUEwRCxJQUFDLENBQUEsZ0JBQTNELENBREEsQ0FBQTtXQUVBLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxDQUFBLEVBSFE7RUFBQSxDQXJEVixDQUFBOztBQUFBLGtCQTBEQSxPQUFBLEdBQVMsU0FBQSxHQUFBO1dBQ1AsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQTNCLEVBQXNDO0FBQUEsTUFBRSxLQUFBLEVBQU8sSUFBVDtLQUF0QyxFQURPO0VBQUEsQ0ExRFQsQ0FBQTs7QUFBQSxrQkE2REEsU0FBQSxHQUFXLFNBQUMsS0FBRCxHQUFBO0FBQ1QsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEtBQVQsQ0FBQTtXQUNBLEtBQUssQ0FBQyxHQUFOLENBQVUsUUFBQSxHQUFXLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBM0IsRUFGUztFQUFBLENBN0RYLENBQUE7O0FBQUEsa0JBaUVBLE9BQUEsR0FBUyxTQUFBLEdBQUE7V0FDUCxNQUFNLENBQUMsT0FBUCxDQUFlLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBM0IsRUFBdUM7QUFBQSxNQUFFLEtBQUEsRUFBTyxJQUFUO0tBQXZDLEVBRE87RUFBQSxDQWpFVCxDQUFBOztBQUFBLGtCQW9FQSxRQUFBLEdBQVUsU0FBQSxHQUFBO1dBQ1IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQTNCLEVBQXNDO0FBQUEsTUFBRSxLQUFBLEVBQU8sSUFBVDtLQUF0QyxFQURRO0VBQUEsQ0FwRVYsQ0FBQTs7QUFBQSxrQkF1RUEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULElBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQTNCLEVBQXVDO0FBQUEsTUFBRSxLQUFBLEVBQU8sSUFBVDtLQUF2QyxDQUFBLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFBLENBREEsQ0FBQTtXQUVBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFIUztFQUFBLENBdkVYLENBQUE7O0FBQUEsa0JBNEVBLGFBQUEsR0FBZSxTQUFDLENBQUQsR0FBQTtBQUNiLFFBQUEsd0JBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsR0FBRyxDQUFDLFFBQWhCLENBQUE7QUFFQSxJQUFBLElBQUEsQ0FBQSxRQUFlLENBQUMsc0JBQWhCO0FBQ0UsTUFBQSxLQUFBLEdBQWdCLElBQUEsVUFBQSxDQUFXLFFBQVEsQ0FBQyxPQUFwQixDQUFoQixDQUFBO0FBQUEsTUFDQSxRQUFRLENBQUMscUJBQVQsQ0FBK0IsS0FBL0IsQ0FEQSxDQUFBO0FBRUEsV0FBUyw0QkFBVCxHQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsUUFBUyxDQUFBLENBQUEsQ0FBVixHQUFlLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBTixHQUFXLEdBQVosQ0FBQSxHQUFtQixHQUFsQyxDQURGO0FBQUEsT0FIRjtLQUFBLE1BQUE7QUFNRSxNQUFBLEtBQUEsR0FBZ0IsSUFBQSxZQUFBLENBQWEsUUFBUSxDQUFDLE9BQXRCLENBQWhCLENBQUE7QUFBQSxNQUNBLFFBQVEsQ0FBQyxzQkFBVCxDQUFnQyxLQUFoQyxDQURBLENBQUE7QUFFQSxXQUFTLDRCQUFULEdBQUE7QUFDRSxRQUFBLElBQUMsQ0FBQSxRQUFTLENBQUEsQ0FBQSxDQUFWLEdBQWUsS0FBTSxDQUFBLENBQUEsQ0FBckIsQ0FERjtBQUFBLE9BUkY7S0FGQTtBQUFBLElBYUEsSUFBQyxDQUFBLFlBQUQsR0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxRQUFQO0tBZEYsQ0FBQTtBQWdCQSxJQUFBLElBQTJCLElBQUMsQ0FBQSxvQkFBNUI7YUFBQSxJQUFDLENBQUEsb0JBQUQsQ0FBQSxFQUFBO0tBakJhO0VBQUEsQ0E1RWYsQ0FBQTs7QUFBQSxrQkErRkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFFBQUEsK0JBQUE7QUFBQTtBQUFBO1NBQUEsOENBQUE7cUJBQUE7QUFDRSxvQkFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFFBQVMsQ0FBQSxDQUFBLENBQVYsR0FBZSxFQUF0QixDQURGO0FBQUE7b0JBRE07RUFBQSxDQS9GUixDQUFBOztlQUFBOztJQWxxQ0YsQ0FBQTs7QUFBQSxLQXV3Q1csQ0FBQztBQUVWLHdCQUFBLFVBQUEsR0FBWSxhQUFaLENBQUE7O0FBQUEsd0JBRUEsR0FBQSxHQUFXLElBRlgsQ0FBQTs7QUFBQSx3QkFHQSxRQUFBLEdBQVcsSUFIWCxDQUFBOztBQUFBLHdCQUlBLFNBQUEsR0FBVyxJQUpYLENBQUE7O0FBQUEsd0JBS0EsTUFBQSxHQUFXLElBTFgsQ0FBQTs7QUFBQSx3QkFNQSxHQUFBLEdBQVcsSUFOWCxDQUFBOztBQUFBLHdCQVFBLFNBQUEsR0FBVyxDQVJYLENBQUE7O0FBQUEsd0JBU0EsUUFBQSxHQUFXLENBVFgsQ0FBQTs7QUFBQSx3QkFVQSxRQUFBLEdBQVcsQ0FWWCxDQUFBOztBQUFBLHdCQVlBLElBQUEsR0FBTSxDQVpOLENBQUE7O0FBQUEsd0JBY0EsUUFBQSxHQUFVLEtBZFYsQ0FBQTs7QUFBQSx3QkFlQSxTQUFBLEdBQVcsS0FmWCxDQUFBOztBQUFBLHdCQWdCQSxRQUFBLEdBQVUsSUFoQlYsQ0FBQTs7QUFBQSx3QkFrQkEsS0FBQSxHQUFPLElBbEJQLENBQUE7O0FBcUJhLEVBQUEscUJBQUEsR0FBQTtBQUNYLDZDQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsUUFBQSxDQUFBO0FBQUE7QUFDRSxNQUFBLElBQUksTUFBTSxDQUFDLGtCQUFQLEtBQTZCLE1BQWpDO0FBQ0UsUUFBQSxNQUFNLENBQUMsa0JBQVAsR0FBZ0MsSUFBQSxDQUFDLE1BQU0sQ0FBQyxZQUFQLElBQXFCLE1BQU0sQ0FBQyxrQkFBN0IsQ0FBQSxDQUFBLENBQWhDLENBREY7T0FERjtLQUFBLGNBQUE7QUFJRSxNQURJLFVBQ0osQ0FBQTtBQUFBLE1BQUEsSUFBSSxHQUFHLENBQUMsR0FBSixLQUFXLGFBQWY7QUFDRSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksNkRBQVosQ0FBQSxDQURGO09BSkY7S0FBQTtBQUFBLElBT0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQTFCLENBUEEsQ0FEVztFQUFBLENBckJiOztBQUFBLHdCQStCQSxNQUFBLEdBQVEsU0FBQyxHQUFELEVBQU0sUUFBTixFQUFzQixRQUF0QixHQUFBO0FBQ04sUUFBQSxPQUFBOztNQURZLFdBQVM7S0FDckI7QUFBQSxJQUFBLElBQUMsQ0FBQSxHQUFELEdBQU8sa0JBQVAsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxJQUdBLE9BQUEsR0FBYyxJQUFBLGNBQUEsQ0FBQSxDQUhkLENBQUE7QUFBQSxJQUlBLE9BQU8sQ0FBQyxJQUFSLENBQWEsS0FBYixFQUFvQixHQUFwQixFQUF5QixJQUF6QixDQUpBLENBQUE7QUFBQSxJQUtBLE9BQU8sQ0FBQyxZQUFSLEdBQXVCLGFBTHZCLENBQUE7QUFBQSxJQU1BLE9BQU8sQ0FBQyxlQUFSLEdBQTBCLElBTjFCLENBQUE7QUFBQSxJQU9BLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFBLEdBQUE7ZUFDZixLQUFDLENBQUEsR0FBRyxDQUFDLGVBQUwsQ0FBcUIsT0FBTyxDQUFDLFFBQTdCLEVBQXVDLFNBQUMsTUFBRCxHQUFBO0FBQ3JDLFVBQUEsS0FBQyxDQUFBLFFBQUQsR0FBWSxJQUFaLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxNQUFELEdBQVUsTUFEVixDQUFBO0FBRUEsVUFBQSxJQUFXLFFBQVg7QUFBQSxZQUFBLEtBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBO1dBRkE7QUFHQSxVQUFBLElBQWMsUUFBZDttQkFBQSxRQUFBLENBQUEsRUFBQTtXQUpxQztRQUFBLENBQXZDLEVBS0UsS0FBQyxDQUFBLFFBTEgsRUFEZTtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUGpCLENBQUE7V0FjQSxPQUFPLENBQUMsSUFBUixDQUFBLEVBZk07RUFBQSxDQS9CUixDQUFBOztBQUFBLHdCQWdEQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7V0FDUixJQUFDLENBQUEsS0FBRCxHQUFTLE1BREQ7RUFBQSxDQWhEVixDQUFBOztBQUFBLHdCQW1EQSxRQUFBLEdBQVUsU0FBQSxHQUFBO1dBQ1IsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaLEVBRFE7RUFBQSxDQW5EVixDQUFBOztBQUFBLHdCQXNEQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsSUFBQSxJQUFHLElBQUMsQ0FBQSxHQUFKO0FBQ0UsTUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBVSxDQUFWLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEdBQUQsR0FBYSxJQURiLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxHQUE0QixJQUY1QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsUUFBRCxHQUFhLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxHQUFtQixJQUFDLENBQUEsU0FIakMsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQTFCLENBSkEsQ0FBQTtBQUtBLE1BQUEsSUFBYyxJQUFDLENBQUEsT0FBZjtlQUFBLElBQUMsQ0FBQSxPQUFELENBQUEsRUFBQTtPQU5GO0tBREs7RUFBQSxDQXREUCxDQUFBOztBQUFBLHdCQStEQSxJQUFBLEdBQU0sU0FBQyxRQUFELEdBQUE7QUFDSixJQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsUUFBZjtBQUFBLFlBQUEsQ0FBQTtLQUFBO0FBQ0EsSUFBQSxJQUFHLElBQUMsQ0FBQSxLQUFELEtBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUE3QjtBQUNFLE1BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLENBQUE7QUFDQSxZQUFBLENBRkY7S0FEQTtBQUFBLElBS0EsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUxBLENBQUE7QUFBQSxJQU1BLElBQUMsQ0FBQSxRQUFELEdBQWdCLE1BQUEsQ0FBQSxRQUFBLEtBQW1CLFFBQXRCLEdBQW9DLFFBQXBDLEdBQWtELElBQUMsQ0FBQSxRQUFELElBQWEsQ0FONUUsQ0FBQTtBQUFBLElBT0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsR0FBbUIsQ0FBQyxJQUFDLENBQUEsUUFBRCxJQUFhLENBQWQsQ0FQaEMsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUFoQixFQUE2QixJQUFDLENBQUEsUUFBOUIsQ0FUQSxDQUFBO0FBQUEsSUFXQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBMUIsQ0FYQSxDQUFBO0FBWUEsSUFBQSxJQUFhLElBQUMsQ0FBQSxNQUFkO2FBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUFBO0tBYkk7RUFBQSxDQS9ETixDQUFBOztBQUFBLHdCQThFQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osSUFBQSxJQUFHLElBQUMsQ0FBQSxHQUFKO0FBQ0UsTUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBVSxDQUFWLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEdBQUQsR0FBYSxJQURiLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxHQUE0QixJQUY1QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsUUFBRCxHQUFhLENBSGIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUpiLENBQUE7YUFLQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBMUIsRUFORjtLQURJO0VBQUEsQ0E5RU4sQ0FBQTs7QUFBQSx3QkF1RkEsTUFBQSxHQUFRLFNBQUMsTUFBRCxHQUFBO0FBQ04sSUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksTUFBWixDQUFaLENBQVQsQ0FBQTtXQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQWYsR0FBdUIsT0FGakI7RUFBQSxDQXZGUixDQUFBOztBQUFBLHdCQTJGQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLElBQUEsSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBN0I7QUFDRSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUFMLEdBQW1CLElBQUMsQ0FBQSxTQUFoQyxDQURGO0tBQUE7QUFHQSxJQUFBLElBQUcsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQXZCO0FBQ0UsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBcEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQURBLENBREY7S0FIQTtBQU9BLFdBQU8sSUFBQyxDQUFBLFFBQVIsQ0FSYztFQUFBLENBM0ZoQixDQUFBOztBQUFBLHdCQXFHQSxJQUFBLEdBQU0sU0FBQyxJQUFELEdBQUE7QUFDSixJQUFBLElBQUcsSUFBQyxDQUFBLEtBQUQsS0FBVSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQTdCO2FBQ0UsSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFOLEVBREY7S0FBQSxNQUFBO2FBR0UsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUhkO0tBREk7RUFBQSxDQXJHTixDQUFBOztBQUFBLHdCQTJHQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsSUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQURBLENBQUE7V0FFQSxJQUFDLENBQUEsR0FBRCxHQUFPLEtBSEE7RUFBQSxDQTNHVCxDQUFBOztBQUFBLHdCQWdIQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBRVIsSUFBQSxJQUFDLENBQUEsR0FBRCxHQUF1QixJQUFDLENBQUEsR0FBRyxDQUFDLGtCQUFMLENBQUEsQ0FBdkIsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLEdBQXVCLElBQUMsQ0FBQSxNQUR4QixDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsR0FBdUIsSUFBQyxDQUFBLFFBRnhCLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxRQUFELEdBQXVCLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFIL0IsQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsR0FBRyxDQUFDLGNBQUwsQ0FBQSxDQU5aLENBQUE7QUFBQSxJQU9BLElBQUMsQ0FBQSxRQUFRLENBQUMscUJBQVYsR0FBa0MsR0FQbEMsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLEdBQWtDLENBQUEsR0FSbEMsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLEdBQWtDLENBVGxDLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixHQUFrQyxHQVZsQyxDQUFBO0FBQUEsSUFhQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxHQUFHLENBQUMscUJBQUwsQ0FBMkIsSUFBM0IsRUFBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsQ0FiYixDQUFBO0FBQUEsSUFnQkEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsR0FBRyxDQUFDLFVBQUwsQ0FBQSxDQWhCWixDQUFBO0FBQUEsSUFrQkEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLFFBQWQsQ0FsQkEsQ0FBQTtBQUFBLElBbUJBLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxDQUFhLElBQUMsQ0FBQSxRQUFkLENBbkJBLENBQUE7QUFBQSxJQW9CQSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsSUFBQyxDQUFBLFNBQW5CLENBcEJBLENBQUE7QUFBQSxJQXFCQSxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUF4QixDQXJCQSxDQUFBO0FBQUEsSUFzQkEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQWtCLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBdkIsQ0F0QkEsQ0FBQTtBQUFBLElBd0JBLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxHQUE0QixJQUFDLENBQUEsZUF4QjdCLENBQUE7QUFBQSxJQXlCQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsR0FBaUIsSUF6QmpCLENBQUE7V0EyQkEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQTdCUTtFQUFBLENBaEhWLENBQUE7O0FBQUEsd0JBK0lBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxJQUFBLElBQTRCLElBQUMsQ0FBQSxRQUE3QjtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLENBQXFCLENBQXJCLENBQUEsQ0FBQTtLQUFBO0FBQ0EsSUFBQSxJQUE0QixJQUFDLENBQUEsU0FBN0I7YUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLFVBQVgsQ0FBc0IsQ0FBdEIsRUFBQTtLQUZXO0VBQUEsQ0EvSWIsQ0FBQTs7QUFBQSx3QkFtSkEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixJQUFBLElBQXFCLElBQUMsQ0FBQSxjQUF0QjthQUFBLElBQUMsQ0FBQSxjQUFELENBQUEsRUFBQTtLQURlO0VBQUEsQ0FuSmpCLENBQUE7O0FBQUEsd0JBc0pBLFFBQUEsR0FBVSxTQUFDLENBQUQsR0FBQTtBQUNSLElBQUEsSUFBRyxJQUFDLENBQUEsR0FBRCxJQUFTLENBQUMsSUFBQyxDQUFBLEtBQUQsS0FBVSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQTFCLElBQXdDLElBQUMsQ0FBQSxLQUFELEtBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFuRSxDQUFaO0FBQ0UsTUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsR0FBRCxHQUE0QixJQUQ1QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLGNBQVgsR0FBNEIsSUFGNUIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBSHpCLENBQUE7QUFJQSxNQUFBLElBQWMsSUFBQyxDQUFBLE9BQWY7ZUFBQSxJQUFDLENBQUEsT0FBRCxDQUFBLEVBQUE7T0FMRjtLQURRO0VBQUEsQ0F0SlYsQ0FBQTs7QUFBQSx3QkE4SkEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLElBQUEsSUFBRyxJQUFDLENBQUEsR0FBRCxJQUFTLE1BQUEsQ0FBQSxJQUFRLENBQUEsR0FBRyxDQUFDLHFCQUFaLEtBQXFDLFVBQWpEO0FBQ0UsTUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLHFCQUFMLEdBQTZCLElBQUMsQ0FBQSxHQUFHLENBQUMsb0JBQWxDLENBREY7S0FBQTtBQUdBLElBQUEsSUFBRyxJQUFDLENBQUEsR0FBRCxJQUFTLE1BQUEsQ0FBQSxJQUFRLENBQUEsR0FBRyxDQUFDLEtBQVosS0FBcUIsVUFBakM7QUFDRSxNQUFBLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBTCxHQUFhLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBbEIsQ0FERjtLQUhBO0FBTUEsSUFBQSxJQUFHLElBQUMsQ0FBQSxHQUFELElBQVMsTUFBQSxDQUFBLElBQVEsQ0FBQSxHQUFHLENBQUMsSUFBWixLQUFvQixVQUFoQzthQUNFLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxHQUFZLElBQUMsQ0FBQSxHQUFHLENBQUMsUUFEbkI7S0FQVztFQUFBLENBOUpiLENBQUE7O3FCQUFBOztJQXp3Q0YsQ0FBQTs7QUFBQSxLQWs3Q1csQ0FBQztBQUVWLCtCQUFBLENBQUE7O0FBQUEsc0JBQUEsTUFBQSxHQUFZLElBQVosQ0FBQTs7QUFBQSxzQkFFQSxPQUFBLEdBQVksSUFGWixDQUFBOztBQUFBLHNCQUdBLFVBQUEsR0FBWSxJQUhaLENBQUE7O0FBQUEsc0JBS0EsS0FBQSxHQUFZLENBTFosQ0FBQTs7QUFBQSxzQkFRQSxRQUFBLEdBQVksSUFSWixDQUFBOztBQUFBLHNCQVNBLEtBQUEsR0FBWSxJQVRaLENBQUE7O0FBQUEsc0JBWUEsU0FBQSxHQUFtQixDQVpuQixDQUFBOztBQUFBLHNCQWFBLFNBQUEsR0FBbUIsQ0FibkIsQ0FBQTs7QUFBQSxzQkFjQSxNQUFBLEdBQW1CLENBZG5CLENBQUE7O0FBQUEsc0JBZUEsaUJBQUEsR0FBbUIsQ0FmbkIsQ0FBQTs7QUFBQSxzQkFnQkEsS0FBQSxHQUFtQixRQWhCbkIsQ0FBQTs7QUFBQSxzQkFpQkEsV0FBQSxHQUFtQixFQWpCbkIsQ0FBQTs7QUFBQSxzQkFrQkEsYUFBQSxHQUFtQixFQWxCbkIsQ0FBQTs7QUFBQSxzQkFtQkEsU0FBQSxHQUFtQixDQW5CbkIsQ0FBQTs7QUFBQSxzQkFvQkEsUUFBQSxHQUFtQixLQXBCbkIsQ0FBQTs7QUFBQSxzQkFxQkEsUUFBQSxHQUFtQixDQXJCbkIsQ0FBQTs7QUFBQSxzQkFzQkEsV0FBQSxHQUFtQixHQXRCbkIsQ0FBQTs7QUFBQSxzQkF1QkEsTUFBQSxHQUFtQixJQXZCbkIsQ0FBQTs7QUF5QmEsRUFBQSxtQkFBQyxJQUFELEdBQUE7QUFDWCxRQUFBLFFBQUE7O01BRFksT0FBSztLQUNqQjtBQUFBLHlDQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEsNkRBQUEsQ0FBQTtBQUFBLElBQUEsNENBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxJQUdBLFFBQUEsR0FDRTtBQUFBLE1BQUEsU0FBQSxFQUFtQixHQUFuQjtBQUFBLE1BQ0EsU0FBQSxFQUFtQixFQURuQjtBQUFBLE1BRUEsTUFBQSxFQUFtQixHQUZuQjtBQUFBLE1BR0EsaUJBQUEsRUFBbUIsR0FIbkI7QUFBQSxNQUlBLEtBQUEsRUFBbUIsUUFKbkI7QUFBQSxNQUtBLFdBQUEsRUFBbUIsRUFMbkI7QUFBQSxNQU1BLGFBQUEsRUFBbUIsRUFObkI7QUFBQSxNQU9BLFFBQUEsRUFBbUIsS0FQbkI7QUFBQSxNQVFBLFFBQUEsRUFBbUIsR0FSbkI7QUFBQSxNQVNBLE1BQUEsRUFBbUIsSUFUbkI7QUFBQSxNQVVBLFNBQUEsRUFBbUIsQ0FWbkI7S0FKRixDQUFBO0FBQUEsSUFnQkEsSUFBQSxHQUFxQixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQWQsQ0FBb0IsUUFBcEIsRUFBOEIsSUFBOUIsQ0FoQnJCLENBQUE7QUFBQSxJQWlCQSxJQUFDLENBQUEsU0FBRCxHQUFxQixJQUFJLENBQUMsU0FqQjFCLENBQUE7QUFBQSxJQWtCQSxJQUFDLENBQUEsU0FBRCxHQUFxQixJQUFJLENBQUMsU0FsQjFCLENBQUE7QUFBQSxJQW1CQSxJQUFDLENBQUEsTUFBRCxHQUFxQixJQUFJLENBQUMsTUFuQjFCLENBQUE7QUFBQSxJQW9CQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLGlCQXBCMUIsQ0FBQTtBQUFBLElBcUJBLElBQUMsQ0FBQSxLQUFELEdBQXFCLElBQUksQ0FBQyxLQXJCMUIsQ0FBQTtBQUFBLElBc0JBLElBQUMsQ0FBQSxXQUFELEdBQXFCLElBQUksQ0FBQyxXQXRCMUIsQ0FBQTtBQUFBLElBdUJBLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUksQ0FBQyxhQXZCMUIsQ0FBQTtBQUFBLElBd0JBLElBQUMsQ0FBQSxRQUFELEdBQXFCLElBQUksQ0FBQyxRQXhCMUIsQ0FBQTtBQUFBLElBeUJBLElBQUMsQ0FBQSxRQUFELEdBQXFCLElBQUksQ0FBQyxRQXpCMUIsQ0FBQTtBQUFBLElBMEJBLElBQUMsQ0FBQSxNQUFELEdBQXFCLElBQUksQ0FBQyxNQTFCMUIsQ0FBQTtBQUFBLElBMkJBLElBQUMsQ0FBQSxTQUFELEdBQXFCLElBQUksQ0FBQyxTQTNCMUIsQ0FBQTtBQUFBLElBOEJBLElBQUMsQ0FBQSxNQUFELEdBQWtCLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQTlCbEIsQ0FBQTtBQUFBLElBK0JBLElBQUMsQ0FBQSxPQUFELEdBQWMsSUFBQyxDQUFBLElBQUQsQ0FBTSxLQUFOLENBL0JkLENBQUE7QUFBQSxJQWdDQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxJQUFELENBQU0sS0FBTixDQWhDZCxDQUFBO0FBQUEsSUFrQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsTUFBWixDQWxDQSxDQUFBO0FBQUEsSUFvQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQXBDQSxDQUFBO0FBQUEsSUFzQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQXRDQSxDQUFBO0FBQUEsSUF1Q0EsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQXZDQSxDQURXO0VBQUEsQ0F6QmI7O0FBQUEsc0JBbUVBLE9BQUEsR0FBUyxTQUFBLEdBQUE7V0FDUCxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBakQsRUFBdUQsSUFBQyxDQUFBLGdCQUF4RCxFQURPO0VBQUEsQ0FuRVQsQ0FBQTs7QUFBQSxzQkFzRUEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO1dBQ2hCLElBQUMsQ0FBQSxJQUFELENBQUEsRUFEZ0I7RUFBQSxDQXRFbEIsQ0FBQTs7QUFBQSxzQkF5RUEsV0FBQSxHQUFhLFNBQUMsUUFBRCxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBQVosQ0FBQTtXQUNBLElBQUMsQ0FBQSxJQUFELENBQUEsRUFGVztFQUFBLENBekViLENBQUE7O0FBQUEsc0JBNkVBLFNBQUEsR0FBVyxTQUFDLE1BQUQsR0FBQTtBQUNULFFBQUEsbURBQUE7QUFBQSxJQUFBLElBQUcsSUFBQyxDQUFBLE1BQUo7QUFDRSxNQUFBLEtBQUEsR0FBUyxLQUFBLENBQU0sSUFBQyxDQUFBLFFBQVAsQ0FBVCxDQUFBO0FBQ0EsV0FBUyx3R0FBVCxHQUFBO0FBQ0UsUUFBQSxLQUFNLENBQUEsQ0FBQSxDQUFOLEdBQVcsS0FBTSxDQUFBLElBQUMsQ0FBQSxRQUFELEdBQVUsQ0FBVixHQUFZLENBQVosQ0FBTixHQUF1QixNQUFPLENBQUEsQ0FBQSxDQUF6QyxDQURGO0FBQUEsT0FEQTtBQUFBLE1BR0EsTUFBQSxHQUFTLEtBSFQsQ0FERjtLQUFBO0FBQUEsSUFNQSxTQUFBLEdBQVksSUFBQyxDQUFBLElBQUQsQ0FBTSxLQUFOLENBTlosQ0FBQTtBQU9BLFNBQUEsZ0RBQUE7d0JBQUE7QUFDRSxNQUFBLElBQTJCLElBQUMsQ0FBQSxRQUE1QjtBQUFBLFFBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFSLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBYSxNQUFBLENBQUEsS0FBQSxLQUFnQixXQUE3QjtBQUFBLFFBQUEsS0FBQSxHQUFRLENBQVIsQ0FBQTtPQURBO0FBQUEsTUFHQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFNBQUQsR0FBYSxVQUFBLENBQVcsS0FBWCxDQUFBLEdBQWtCLENBQUMsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsU0FBZixDQUh4QyxDQUFBO0FBQUEsTUFJQSxTQUFVLENBQUEsQ0FBQSxDQUFWLEdBQWUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFULEVBQWlCLENBQWpCLENBSmYsQ0FERjtBQUFBLEtBUEE7QUFBQSxJQWFBLElBQUMsQ0FBQSxVQUFELEdBQWMsU0FiZCxDQUFBO1dBY0EsSUFBQyxDQUFBLGtCQUFELENBQUEsRUFmUztFQUFBLENBN0VYLENBQUE7O0FBQUEsc0JBOEZBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixJQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsUUFBRCxHQUFrQixJQUFBLEtBQUssQ0FBQyxpQkFBTixDQUF3QjtBQUFBLE1BQUUsS0FBQSxFQUFPLElBQUMsQ0FBQSxLQUFWO0FBQUEsTUFBaUIsU0FBQSxFQUFXLElBQUMsQ0FBQSxTQUE3QjtLQUF4QixDQUZsQixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsS0FBRCxHQUFjLEVBSGQsQ0FBQTtBQUFBLElBS0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFULENBTEEsQ0FBQTtXQU1BLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFsQixFQVBRO0VBQUEsQ0E5RlYsQ0FBQTs7QUFBQSxzQkF1R0EsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO1dBQ04sSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFULEVBRE07RUFBQSxDQXZHUixDQUFBOztBQUFBLHNCQTBHQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxRQUFBLG1CQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsS0FBRCxJQUFVLEtBQVYsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxHQUFJLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLGlCQURkLENBQUE7QUFFQSxJQUFBLElBQVUsQ0FBQSxHQUFJLENBQWQ7QUFBQSxZQUFBLENBQUE7S0FGQTtBQUlBLFNBQVMsb0dBQVQsR0FBQTtBQUNFLE1BQUEsSUFBQSxHQUFjLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQSxDQUFULEdBQWMsSUFBQyxDQUFBLFVBQVcsQ0FBQSxDQUFBLENBQXhDLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQSxDQUFULEdBQWMsSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFBLENBQVQsR0FBYyxDQUFBLEdBQUksSUFEaEMsQ0FERjtBQUFBLEtBSkE7V0FPQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxFQVJPO0VBQUEsQ0ExR1QsQ0FBQTs7QUFBQSxzQkFvSEEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLElBQUEsSUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQWQsS0FBdUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUF6QyxJQUF3RCxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUF0RjtBQUNFLE1BQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUF0QyxDQUFBLENBREY7S0FBQTtXQUVBLFVBQUEsQ0FBVyxJQUFDLENBQUEsWUFBWixFQUEwQixJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBL0MsRUFIWTtFQUFBLENBcEhkLENBQUE7O0FBQUEsc0JBeUhBLGdCQUFBLEdBQWtCLFNBQUMsTUFBRCxHQUFBO0FBQ2hCLFFBQUEsa0VBQUE7O01BRGlCLFNBQU87S0FDeEI7QUFBQTtBQUFBO1NBQUEsOENBQUE7dUJBQUE7QUFDRSxNQUFBLEtBQUEsR0FBUyxJQUFJLENBQUMsRUFBTCxHQUFVLENBQVYsR0FBYyxDQUFkLEdBQWtCLElBQUMsQ0FBQSxRQUE1QixDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU8sSUFBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBQyxDQUFBLE1BQWxCLEVBQTBCLEtBQTFCLEVBQWlDLElBQUMsQ0FBQSxNQUFELEdBQVEsTUFBQSxHQUFPLElBQUMsQ0FBQSxhQUFqRCxDQUZQLENBQUE7QUFBQSxNQUdBLEVBQUEsR0FBTyxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFDLENBQUEsTUFBbEIsRUFBMEIsS0FBMUIsRUFBaUMsSUFBQyxDQUFBLE1BQUQsR0FBUSxNQUFBLEdBQU8sSUFBQyxDQUFBLFdBQWpELENBSFAsQ0FBQTtBQUtBLE1BQUEsSUFBRyxNQUFBLENBQUEsSUFBUSxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQWQsS0FBb0IsV0FBdkI7QUFDRSxRQUFBLFFBQUEsR0FBZSxJQUFBLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBZixDQUFBO0FBQUEsUUFDQSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLENBQXVCLElBQXZCLEVBQTZCLEVBQTdCLEVBQWlDLElBQWpDLENBREEsQ0FBQTtBQUFBLFFBR0EsSUFBQSxHQUFXLElBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxRQUFYLEVBQXFCLElBQUMsQ0FBQSxRQUF0QixDQUhYLENBQUE7QUFBQSxRQUlBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVosQ0FKQSxDQUFBO0FBQUEsc0JBS0EsSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMLEVBTEEsQ0FERjtPQUFBLE1BQUE7QUFRRSxRQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBZCxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQXZCLEdBQTRCLElBRDVCLENBQUE7QUFBQSxRQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBdkIsR0FBNEIsRUFGNUIsQ0FBQTtBQUFBLFFBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUF2QixHQUE0QixJQUg1QixDQUFBO0FBQUEsc0JBSUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxHQUFtQyxLQUpuQyxDQVJGO09BTkY7QUFBQTtvQkFEZ0I7RUFBQSxDQXpIbEIsQ0FBQTs7QUFBQSxzQkE4SUEsTUFBQSxHQUFRLFNBQUMsU0FBRCxHQUFBO0FBQ04sUUFBQSxrQkFBQTs7TUFETyxZQUFVO0tBQ2pCO0FBQUEsSUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO0FBQ0EsU0FBUyxvR0FBVCxHQUFBO0FBQ0UsTUFBQSxNQUFPLENBQUEsQ0FBQSxDQUFQLEdBQVksSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFaLENBREY7QUFBQSxLQURBO0FBR0EsSUFBQSxJQUFzQixTQUF0QjtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLENBQUEsQ0FBQTtLQUhBO0FBSUEsV0FBTyxNQUFQLENBTE07RUFBQSxDQTlJUixDQUFBOztBQUFBLHNCQXFKQSxJQUFBLEdBQU0sU0FBQyxTQUFELEdBQUE7QUFDSixRQUFBLGtCQUFBOztNQURLLFlBQVU7S0FDZjtBQUFBLElBQUEsTUFBQSxHQUFTLEVBQVQsQ0FBQTtBQUNBLFNBQVMsb0dBQVQsR0FBQTtBQUNFLE1BQUEsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFZLENBQVosQ0FERjtBQUFBLEtBREE7QUFHQSxJQUFBLElBQXNCLFNBQXRCO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsQ0FBQSxDQUFBO0tBSEE7QUFJQSxXQUFPLE1BQVAsQ0FMSTtFQUFBLENBckpOLENBQUE7O0FBQUEsc0JBNEpBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTtXQUNsQixJQUFDLENBQUEsS0FBRCxHQUFTLEVBRFM7RUFBQSxDQTVKcEIsQ0FBQTs7QUFBQSxzQkErSkEsZUFBQSxHQUFpQixTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsTUFBZixHQUFBO0FBQ2YsUUFBQSxJQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksS0FBSyxDQUFDLENBQU4sR0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixNQUFoQyxDQUFBO0FBQUEsSUFDQSxDQUFBLEdBQUksS0FBSyxDQUFDLENBQU4sR0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixNQURoQyxDQUFBO0FBRUEsV0FBVyxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixLQUFLLENBQUMsQ0FBMUIsQ0FBWCxDQUhlO0VBQUEsQ0EvSmpCLENBQUE7O0FBQUEsc0JBb0tBLG9CQUFBLEdBQXNCLFNBQUMsS0FBRCxHQUFBO0FBQ3BCLFFBQUEsTUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxLQUFNLENBQUEsS0FBQSxDQUFoQixDQUFBO1dBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxJQUFDLENBQUEsS0FBTSxDQUFBLEtBQUEsQ0FBckIsRUFGb0I7RUFBQSxDQXBLdEIsQ0FBQTs7QUFBQSxzQkF3S0EsTUFBQSxHQUFRLFNBQUEsR0FBQTtXQUNOLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLE1BQVosRUFETTtFQUFBLENBeEtSLENBQUE7O0FBQUEsc0JBMktBLFNBQUEsR0FBVyxTQUFDLE1BQUQsR0FBQTtBQUNULElBQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFWLENBQUE7QUFDQSxJQUFBLElBQXFDLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLEdBQXBCLEdBQTBCLE1BQS9EO2FBQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFNLENBQUMsVUFBUCxHQUFvQixJQUE5QjtLQUZTO0VBQUEsQ0EzS1gsQ0FBQTs7bUJBQUE7O0dBRjRCLEtBQUssQ0FBQyxNQWw3Q3BDLENBQUE7O0FBQUEsS0FvbURXLENBQUM7QUFFViwrQkFBQSxDQUFBOztBQUFBLHNCQUFBLElBQUEsR0FBTSxDQUFOLENBQUE7O0FBQUEsc0JBRUEsSUFBQSxHQUFNLElBRk4sQ0FBQTs7QUFBQSxzQkFHQSxJQUFBLEdBQU0sSUFITixDQUFBOztBQUFBLHNCQUlBLFFBQUEsR0FBVSxDQUpWLENBQUE7O0FBQUEsc0JBS0EsWUFBQSxHQUFjLENBTGQsQ0FBQTs7QUFBQSxzQkFPQSxLQUFBLEdBQU8sSUFQUCxDQUFBOztBQUFBLHNCQVNBLEtBQUEsR0FBTyxDQVRQLENBQUE7O0FBQUEsc0JBV0EsT0FBQSxHQUFTLElBWFQsQ0FBQTs7QUFBQSxFQWNBLFNBQUMsQ0FBQSxJQUFELEdBQVcsTUFkWCxDQUFBOztBQUFBLEVBZUEsU0FBQyxDQUFBLFFBQUQsR0FBVyxVQWZYLENBQUE7O0FBQUEsRUFnQkEsU0FBQyxDQUFBLE9BQUQsR0FBVyxTQWhCWCxDQUFBOztBQUFBLEVBaUJBLFNBQUMsQ0FBQSxPQUFELEdBQVcsU0FqQlgsQ0FBQTs7QUFtQmEsRUFBQSxtQkFBQyxNQUFELEVBQVMsTUFBVCxHQUFBO0FBQ1gsSUFBQSw0Q0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBTSxDQUFDLENBQXJCLEVBQXdCLE1BQU0sQ0FBQyxDQUEvQixFQUFrQyxDQUFsQyxDQUZkLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFIVixDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsS0FBRCxHQUFVLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixJQUFJLENBQUMsRUFBckIsR0FBMEIsQ0FKcEMsQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxjQUFjLENBQUMsSUFBekIsQ0FOQSxDQUFBO0FBQUEsSUFRQSxJQUFDLENBQUEsS0FBRCxDQUFBLENBUkEsQ0FEVztFQUFBLENBbkJiOztBQUFBLHNCQThCQSxTQUFBLEdBQVcsU0FBQyxNQUFELEdBQUE7QUFDVCxJQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBVixDQUFBO1dBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsYUFBRCxDQUFBLEVBRkY7RUFBQSxDQTlCWCxDQUFBOztBQUFBLHNCQWtDQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsUUFBQSxZQUFBO0FBQUEsSUFBQSxDQUFBLEdBQVEsSUFBQSxLQUFLLENBQUMsUUFBTixDQUFBLENBQVIsQ0FBQTtBQUFBLElBQ0EsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFYLENBQ00sSUFBQSxLQUFLLENBQUMsT0FBTixDQUFnQixDQUFoQixFQUFtQixDQUFBLElBQW5CLEVBQTBCLENBQUEsRUFBMUIsQ0FETixFQUVNLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFBLEVBQWQsRUFBbUIsQ0FBQSxJQUFuQixFQUEyQixFQUEzQixDQUZOLEVBR00sSUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLENBQUEsRUFBZCxFQUFtQixDQUFBLElBQW5CLEVBQTJCLEVBQTNCLENBSE4sRUFJTSxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWdCLENBQWhCLEVBQW9CLElBQXBCLEVBQTJCLEVBQTNCLENBSk4sRUFLTSxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBQSxFQUFkLEVBQW1CLENBQUEsSUFBbkIsRUFBMkIsRUFBM0IsQ0FMTixFQU1NLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFBLEVBQWQsRUFBbUIsQ0FBQSxJQUFuQixFQUEyQixFQUEzQixDQU5OLENBREEsQ0FBQTtBQUFBLElBU0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFSLENBQ00sSUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLENBQVosRUFBZSxDQUFmLEVBQWtCLENBQWxCLENBRE4sRUFFTSxJQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksQ0FBWixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FGTixFQUdNLElBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQixDQUFsQixDQUhOLEVBSU0sSUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLENBQVosRUFBZSxDQUFmLEVBQWtCLENBQWxCLENBSk4sQ0FUQSxDQUFBO0FBQUEsSUFlQSxDQUFDLENBQUMsa0JBQUYsQ0FBQSxDQWZBLENBQUE7QUFBQSxJQWdCQSxNQUFBLEdBQWEsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFBLENBaEJiLENBQUE7QUFBQSxJQWlCQSxNQUFNLENBQUMsYUFBUCxDQUFxQixJQUFJLENBQUMsRUFBTCxHQUFRLEVBQTdCLENBakJBLENBQUE7QUFBQSxJQWtCQSxDQUFDLENBQUMsV0FBRixDQUFjLE1BQWQsQ0FsQkEsQ0FBQTtBQUFBLElBbUJBLE1BQU0sQ0FBQyxhQUFQLENBQXFCLElBQUksQ0FBQyxFQUExQixDQW5CQSxDQUFBO0FBQUEsSUFvQkEsQ0FBQyxDQUFDLFdBQUYsQ0FBYyxNQUFkLENBcEJBLENBQUE7QUFBQSxJQXNCQSxJQUFDLENBQUEsSUFBRCxHQUFRLEtBQUssQ0FBQyxVQUFVLENBQUMseUJBQWpCLENBQTJDLENBQTNDLEVBQThDO01BQ2hELElBQUEsS0FBSyxDQUFDLG1CQUFOLENBQTBCO0FBQUEsUUFBRSxLQUFBLEVBQU8sUUFBVDtBQUFBLFFBQW1CLElBQUEsRUFBTSxLQUFLLENBQUMsVUFBL0I7T0FBMUIsQ0FEZ0Q7S0FBOUMsQ0F0QlIsQ0FBQTtBQUFBLElBeUJBLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixHQUFtQixJQXpCbkIsQ0FBQTtBQUFBLElBMEJBLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBTixHQUFzQixJQTFCdEIsQ0FBQTtBQUFBLElBMkJBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsQ0EzQkEsQ0FBQTtBQUFBLElBNEJBLElBQUMsQ0FBQSxHQUFELENBQUssSUFBQyxDQUFBLElBQU4sQ0E1QkEsQ0FBQTtBQUFBLElBOEJBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQTlCWCxDQUFBO0FBQUEsSUErQkEsQ0FBQSxHQUFJLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQXRCLENBQWlDLENBQWpDLENBL0JKLENBQUE7V0FnQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZixDQUFtQixDQUFDLENBQUMsQ0FBckIsRUFBd0IsQ0FBQyxDQUFDLENBQTFCLEVBQTZCLENBQUMsQ0FBQyxDQUEvQixFQWpDSztFQUFBLENBbENQLENBQUE7O0FBQUEsc0JBcUVBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFFBQUEsQ0FBQTtBQUFBLElBQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFULENBQUE7QUFDQSxZQUFPLEtBQVA7QUFBQSxXQUNPLGNBQWMsQ0FBQyxJQUR0QjtlQUdJLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FIWjtBQUFBLFdBSU8sY0FBYyxDQUFDLFFBSnRCO0FBTUksUUFBQSxJQUFDLENBQUEsVUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBRGpCLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksRUFBQSxHQUFLLElBRmpCLENBQUE7QUFBQSxRQUlBLENBQUEsR0FBSSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBZSxDQUFmLENBSkosQ0FBQTtlQUtBLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWYsQ0FBbUIsQ0FBQyxDQUFDLENBQXJCLEVBQXdCLENBQUMsQ0FBQyxDQUExQixFQUE2QixDQUFDLENBQUMsQ0FBL0IsRUFYSjtBQUFBLFdBWU8sY0FBYyxDQUFDLE9BWnRCO0FBY0ksUUFBQSxJQUFDLENBQUEsVUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsV0FBRCxDQUFBLENBRFIsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFBLEdBQUksSUFGaEIsQ0FBQTtBQUFBLFFBSUEsQ0FBQSxHQUFJLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFlLENBQWYsQ0FKSixDQUFBO2VBS0EsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZixDQUFtQixDQUFDLENBQUMsQ0FBckIsRUFBd0IsQ0FBQyxDQUFDLENBQTFCLEVBQTZCLENBQUMsQ0FBQyxDQUEvQixFQW5CSjtBQUFBLFdBNkJPLGNBQWMsQ0FBQyxPQTdCdEI7QUErQkksUUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQVIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFlLElBQWYsRUFoQ0o7QUFBQTtlQWtDSSxJQUFDLENBQUEsUUFBRCxDQUFVLGNBQWMsQ0FBQyxJQUF6QixFQWxDSjtBQUFBLEtBRlE7RUFBQSxDQXJFVixDQUFBOztBQUFBLHNCQTJHQSxNQUFBLEdBQVEsU0FBQyxLQUFELEdBQUE7QUFDTixRQUFBLENBQUE7QUFBQSxJQUFBLElBQUcsSUFBQyxDQUFBLEtBQUQsS0FBVSxjQUFjLENBQUMsSUFBekIsSUFBa0MsSUFBQyxDQUFBLEtBQUQsS0FBVSxjQUFjLENBQUMsT0FBOUQ7QUFFRSxNQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLFFBQWxCLEVBQTRCLENBQTVCLENBQUosQ0FBQTtBQUVBLE1BQUEsSUFBRyxDQUFBLElBQUssQ0FBUjtBQUNFLFFBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFBLENBQUE7QUFDQSxRQUFBLElBQUcsSUFBQyxDQUFBLEtBQUQsS0FBVSxjQUFjLENBQUMsUUFBNUI7QUFDRSxVQUFBLElBQUMsQ0FBQSxRQUFELENBQVUsY0FBYyxDQUFDLE9BQXpCLENBQUEsQ0FERjtTQUFBLE1BRUssSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLGNBQWMsQ0FBQyxPQUE1QjtBQUVILFVBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsV0FBRCxDQUFBLENBQVIsQ0FBQTtBQUFBLFVBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFDLENBQUEsR0FBSSxDQUFDLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixFQUFqQixDQUFMLENBQUEsR0FBNkIsSUFEekMsQ0FGRztTQUhMO0FBUUEsY0FBQSxDQVRGO09BRkE7QUFhQSxNQUFBLElBQUcsSUFBQyxDQUFBLEtBQUQsS0FBVSxjQUFjLENBQUMsUUFBNUI7QUFDRSxRQUFBLElBQUMsQ0FBQSxJQUFELElBQVMsS0FBVCxDQUFBO0FBQUEsUUFDQSxDQUFBLEdBQUksT0FBTyxDQUFDLGdCQUFSLENBQXlCLENBQXpCLENBREosQ0FERjtPQWJBO0FBa0JBLE1BQUEsSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLGNBQWMsQ0FBQyxPQUE1QjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsSUFBUyxLQUFULENBREY7T0FsQkE7QUFzQkEsTUFBQSxJQUFpQixDQUFqQjtlQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWCxFQUFBO09BeEJGO0tBRE07RUFBQSxDQTNHUixDQUFBOztBQUFBLHNCQXNJQSxVQUFBLEdBQVksU0FBQSxHQUFBO1dBQ1YsSUFBQyxDQUFBLElBQUQsR0FBUSxFQURFO0VBQUEsQ0F0SVosQ0FBQTs7QUFBQSxzQkF5SUEsU0FBQSxHQUFXLFNBQUMsQ0FBRCxHQUFBO0FBQ1QsUUFBQSxlQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQWlCLENBQWpCLENBQUosQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZixDQUFtQixDQUFDLENBQUMsQ0FBckIsRUFBd0IsQ0FBQyxDQUFDLENBQTFCLEVBQTZCLENBQUMsQ0FBQyxDQUEvQixDQURBLENBQUE7QUFBQSxJQUdBLEtBQUEsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsR0FBSSxFQUFBLEdBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUEsQ0FBbEIsRUFBcUMsQ0FBckMsQ0FIVCxDQUFBO0FBQUEsSUFJQSxDQUFBLEdBQUksSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQWlCLEtBQWpCLENBQXVCLENBQUMsY0FBeEIsQ0FBd0MsQ0FBeEMsQ0FKSixDQUFBO0FBQUEsSUFLQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxDQUFiLENBTEEsQ0FBQTtBQU9BLElBQUEsSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLGNBQWMsQ0FBQyxRQUE1QjtBQUNFLE1BQUEsS0FBQSxHQUFRLEdBQUEsR0FBTSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxHQUF4QixDQUFBO2FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBWixDQUFnQixLQUFoQixFQUF1QixLQUF2QixFQUE4QixLQUE5QixFQUZGO0tBUlM7RUFBQSxDQXpJWCxDQUFBOztBQUFBLHNCQXdKQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsUUFBQSwyR0FBQTtBQUFBLElBQUEsS0FBQSxHQUFnQixJQUFBLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBaEIsQ0FBQTtBQUFBLElBQ0EsS0FBSyxDQUFDLENBQU4sR0FBWSxJQUFDLENBQUEsTUFBTSxDQUFDLENBQVIsR0FBWSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxLQUFWLENBQUEsR0FBbUIsR0FEM0MsQ0FBQTtBQUFBLElBRUEsS0FBSyxDQUFDLENBQU4sR0FBWSxJQUFDLENBQUEsTUFBTSxDQUFDLENBQVIsR0FBWSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxLQUFWLENBQUEsR0FBbUIsR0FGM0MsQ0FBQTtBQUFBLElBR0EsS0FBSyxDQUFDLENBQU4sR0FBWSxHQUhaLENBQUE7QUFBQSxJQUtBLElBQUEsR0FBcUIsSUFBQSxLQUFLLENBQUMsV0FBTixDQUFrQixJQUFDLENBQUEsTUFBbkIsRUFBMkIsSUFBQyxDQUFBLEtBQTVCLEVBQW1DLElBQUMsQ0FBQSxNQUFwQyxDQUxyQixDQUFBO0FBQUEsSUFNQSxJQUFJLENBQUMsT0FBTCxHQUFpQixJQU5qQixDQUFBO0FBQUEsSUFPQSxJQUFJLENBQUMsU0FBTCxHQUFpQixJQVBqQixDQUFBO0FBQUEsSUFVQSxHQUFBLEdBQVcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxDQUFkLENBVlgsQ0FBQTtBQUFBLElBV0EsR0FBQSxHQUFXLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZCxDQVhYLENBQUE7QUFBQSxJQVlBLEtBQUEsR0FBVyxLQUFLLENBQUMsa0JBQU4sQ0FBeUIsR0FBekIsRUFBOEIsR0FBOUIsQ0FBQSxHQUFxQyxJQUFJLENBQUMsRUFackQsQ0FBQTtBQUFBLElBYUEsUUFBQSxHQUFXLEdBQUcsQ0FBQyxVQUFKLENBQWUsR0FBZixDQWJYLENBQUE7QUFBQSxJQWVBLFVBQUEsR0FBbUIsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFBLENBZm5CLENBQUE7QUFBQSxJQWdCQSxVQUFVLENBQUMsQ0FBWCxHQUFlLEdBQUcsQ0FBQyxDQUFKLEdBQVEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQUEsR0FBa0IsUUFoQnpDLENBQUE7QUFBQSxJQWlCQSxVQUFVLENBQUMsQ0FBWCxHQUFlLEdBQUcsQ0FBQyxDQUFKLEdBQVEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQUEsR0FBa0IsUUFqQnpDLENBQUE7QUFBQSxJQWtCQSxVQUFVLENBQUMsQ0FBWCxHQUFlLEdBQUcsQ0FBQyxDQWxCbkIsQ0FBQTtBQUFBLElBb0JBLEdBQUEsR0FBUyxJQUFJLENBQUMsUUFBTCxDQUFjLENBQWQsQ0FwQlQsQ0FBQTtBQUFBLElBcUJBLEtBQUEsR0FBYSxJQUFBLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCLEVBQTJCLEdBQTNCLENBckJiLENBQUE7QUFBQSxJQXNCQSxNQUFBLEdBQVMsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsRUFBaEIsQ0F0QlQsQ0FBQTtBQXlCQTtBQUFBLFNBQUEsOENBQUE7bUJBQUE7QUFDRSxNQUFBLElBQW1CLENBQUEsR0FBSSxDQUF2QjtBQUFBLFFBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxFQUFaLENBQUEsQ0FBQTtPQURGO0FBQUEsS0F6QkE7QUFBQSxJQTRCQSxNQUFBLEdBQVMsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsTUFBcEIsQ0E1QlQsQ0FBQTtBQUFBLElBK0JBLE1BQUEsR0FBUyxJQS9CVCxDQUFBO0FBc0NBLFdBQU87QUFBQSxNQUFFLFlBQUEsRUFBYyxNQUFoQjtBQUFBLE1BQXdCLFVBQUEsRUFBWSxNQUFwQztLQUFQLENBdkNhO0VBQUEsQ0F4SmYsQ0FBQTs7QUFBQSxzQkFpTUEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLFFBQUEsT0FBQTtBQUFBLElBQUEsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFaLENBQ2QsU0FBQyxFQUFELEVBQUssTUFBTCxFQUFrQixVQUFsQixHQUFBOztRQUFLLFNBQVE7T0FDWDs7UUFEZ0IsYUFBVztPQUMzQjtBQUFBLE1BQUEsSUFBQyxDQUFBLEVBQUQsR0FBYyxFQUFkLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQWMsTUFEZCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjLFVBRmQsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQUQsR0FBYyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsSUFBSSxDQUFDLEVBQXJCLEdBQTBCLENBSHhDLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixFQUFuQixHQUEyQixJQUEzQixHQUFxQyxLQUpuRCxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsSUFBRCxHQUFjLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FMZCxDQURGO0lBQUEsQ0FEYyxFQVNaLFNBQUMsQ0FBRCxHQUFBO0FBQ0EsVUFBQSxhQUFBO0FBQUEsTUFBQSxJQUFrQixJQUFDLENBQUEsU0FBbkI7QUFBQSxRQUFBLENBQUEsR0FBUyxDQUFBLEdBQUksQ0FBYixDQUFBO09BQUE7QUFBQSxNQUNBLEtBQUEsR0FBUyxDQUFDLElBQUksQ0FBQyxFQUFMLEdBQVUsQ0FBWCxDQUFBLEdBQWdCLENBRHpCLENBQUE7QUFBQSxNQUVBLEtBQUEsSUFBVSxJQUFDLENBQUEsVUFGWCxDQUFBO0FBQUEsTUFJQSxNQUFBLEdBQWEsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFBLENBSmIsQ0FBQTtBQUFBLE1BS0EsTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFDLENBQUEsRUFBRSxDQUFDLENBQUosR0FBUSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixJQUFDLENBQUEsTUFMdEMsQ0FBQTtBQUFBLE1BTUEsTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFDLENBQUEsRUFBRSxDQUFDLENBQUosR0FBUSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQUEsR0FBUSxJQUFDLENBQUEsU0FBbEIsQ0FBQSxHQUErQixDQUFDLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBVixHQUFjLElBQUMsQ0FBQSxJQUFoQixDQU5sRCxDQUFBO0FBQUEsTUFPQSxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBSixHQUFRLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFBLEdBQWtCLElBQUMsQ0FBQSxNQVB0QyxDQUFBO0FBUUEsYUFBTyxNQUFQLENBVEE7SUFBQSxDQVRZLENBQWhCLENBQUE7QUFBQSxJQW9DQSxPQUFBLEdBQWMsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLElBQUMsQ0FBQSxNQUFmLEVBQXVCLEdBQXZCLEVBQTRCLElBQUksQ0FBQyxFQUFMLEdBQVEsQ0FBQSxFQUFwQyxDQXBDZCxDQUFBO0FBcUNBLFdBQU8sT0FBUCxDQXRDVztFQUFBLENBak1iLENBQUE7O0FBQUEsc0JBMk9BLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7QUFDVixRQUFBLE9BQUE7O01BRGlCLFFBQU07S0FDdkI7QUFBQSxJQUFBLENBQUEsR0FBVyxJQUFBLEtBQUssQ0FBQyxZQUFOLENBQW1CLElBQW5CLEVBQXlCLEdBQXpCLEVBQThCLEVBQTlCLEVBQWtDLEVBQWxDLEVBQXNDLElBQXRDLENBQVgsQ0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMseUJBQWpCLENBQTRDLENBQTVDLEVBQStDO01BQ2hELElBQUEsS0FBSyxDQUFDLGlCQUFOLENBQXdCO0FBQUEsUUFDeEIsS0FBQSxFQUFPLEtBRGlCO0FBQUEsUUFFeEIsT0FBQSxFQUFTLEdBRmU7QUFBQSxRQUd4QixTQUFBLEVBQVcsSUFIYTtBQUFBLFFBSXhCLFdBQUEsRUFBYSxJQUpXO09BQXhCLENBRGdELEVBT2hELElBQUEsS0FBSyxDQUFDLG1CQUFOLENBQTBCO0FBQUEsUUFBRSxLQUFBLEVBQU8sUUFBVDtBQUFBLFFBQW1CLElBQUEsRUFBTSxLQUFLLENBQUMsVUFBL0I7T0FBMUIsQ0FQZ0Q7S0FBL0MsQ0FEUCxDQUFBO1dBVUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMLEVBWFU7RUFBQSxDQTNPWixDQUFBOzttQkFBQTs7R0FGNEIsS0FBSyxDQUFDLE1BcG1EcEMsQ0FBQTs7QUFBQSxLQSsxRFcsQ0FBQyxPQUFPLENBQUM7QUFFbEIsMkJBQUEsQ0FBQTs7QUFBQSxrQkFBQSxPQUFBLEdBQVMsSUFBVCxDQUFBOztBQUFBLGtCQUNBLFFBQUEsR0FBVSxJQURWLENBQUE7O0FBQUEsa0JBRUEsT0FBQSxHQUFTLElBRlQsQ0FBQTs7QUFBQSxrQkFHQSxLQUFBLEdBQU8sSUFIUCxDQUFBOztBQUFBLGtCQUtBLEtBQUEsR0FBTyxLQUxQLENBQUE7O0FBT2EsRUFBQSxlQUFBLEdBQUE7QUFDWCx1RUFBQSxDQUFBO0FBQUEsaUVBQUEsQ0FBQTtBQUFBLElBQUEsd0NBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FBSyxDQUFDLE9BRGpCLENBRFc7RUFBQSxDQVBiOztBQUFBLGtCQVdBLE9BQUEsR0FBUyxTQUFDLFFBQUQsR0FBQTtBQUNQLElBQUEsSUFBYyxRQUFkO0FBQUEsTUFBQSxRQUFBLENBQUEsQ0FBQSxDQUFBO0tBQUE7V0FDQSxJQUFDLENBQUEsS0FBRCxDQUFBLEVBRk87RUFBQSxDQVhULENBQUE7O0FBQUEsa0JBZUEsTUFBQSxHQUFRLFNBQUMsUUFBRCxHQUFBO0FBQ04sSUFBQSxJQUFjLFFBQWQ7YUFBQSxRQUFBLENBQUEsRUFBQTtLQURNO0VBQUEsQ0FmUixDQUFBOztBQUFBLGtCQWtCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsSUFBQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBbkQsRUFBeUQsSUFBQyxDQUFBLGtCQUExRCxDQUFBLENBQUE7V0FDQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBdEQsRUFBNEQsSUFBQyxDQUFBLHFCQUE3RCxFQUZPO0VBQUEsQ0FsQlQsQ0FBQTs7QUFBQSxrQkFzQkEsa0JBQUEsR0FBb0IsU0FBQyxDQUFELEdBQUE7V0FDbEIsSUFBQyxDQUFBLE9BQUQsQ0FBQSxFQURrQjtFQUFBLENBdEJwQixDQUFBOztBQUFBLGtCQXlCQSxxQkFBQSxHQUF1QixTQUFDLENBQUQsR0FBQTtXQUNyQixJQUFDLENBQUEsT0FBRCxDQUFBLEVBRHFCO0VBQUEsQ0F6QnZCLENBQUE7O0FBQUEsa0JBNEJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxRQUFBLDZCQUFBO0FBQUE7QUFBQTtTQUFBLHNDQUFBO3NCQUFBO0FBQ0Usb0JBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFULENBQWEsS0FBYixFQUFBLENBREY7QUFBQTtvQkFETztFQUFBLENBNUJULENBQUE7O0FBQUEsa0JBZ0NBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxJQUFBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFkLENBQUEsQ0FEYixDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsR0FBRCxDQUFLLElBQUMsQ0FBQSxLQUFOLENBRkEsQ0FBQTtXQUdBLElBQUMsQ0FBQSxPQUFELENBQUEsRUFKSztFQUFBLENBaENQLENBQUE7O0FBQUEsa0JBc0NBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBVSxJQUFBLGNBQUEsQ0FBQSxDQUFWLENBQUE7QUFBQSxJQUNBLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVCxFQUFnQix5QkFBaEIsRUFBMkMsSUFBM0MsQ0FEQSxDQUFBO0FBQUEsSUFFQSxHQUFHLENBQUMsTUFBSixHQUFhLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLENBQUQsR0FBQTtBQUNYLFFBQUEsS0FBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBcEIsQ0FBWixDQUFBO2VBRUEsS0FBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksS0FBQyxDQUFBLFFBQWIsRUFIVztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRmIsQ0FBQTtXQWtCQSxHQUFHLENBQUMsSUFBSixDQUFTLElBQVQsRUFuQlc7RUFBQSxDQXRDYixDQUFBOztlQUFBOztHQUZnQyxLQUFLLENBQUMsTUEvMUR4QyxDQUFBOztBQUFBLEtBMDZEVyxDQUFDLE9BQU8sQ0FBQztBQUVsQiwyQkFBQSxDQUFBOztBQUFBLGtCQUFBLGNBQUEsR0FBZ0IsSUFBaEIsQ0FBQTs7QUFBQSxrQkFDQSxXQUFBLEdBQWEsSUFEYixDQUFBOztBQUFBLGtCQUdBLEtBQUEsR0FBTyxJQUhQLENBQUE7O0FBQUEsa0JBS0EsUUFBQSxHQUFVLElBTFYsQ0FBQTs7QUFBQSxrQkFPQSxRQUFBLEdBQVUsSUFQVixDQUFBOztBQUFBLGtCQVFBLFFBQUEsR0FBVSxJQVJWLENBQUE7O0FBQUEsa0JBVUEsR0FBQSxHQUFLLENBVkwsQ0FBQTs7QUFBQSxrQkFXQSxNQUFBLEdBQVEsQ0FYUixDQUFBOztBQUFBLGtCQVlBLFFBQUEsR0FBVSxDQVpWLENBQUE7O0FBQUEsa0JBY0EsS0FBQSxHQUFPLENBZFAsQ0FBQTs7QUFBQSxrQkFlQSxNQUFBLEdBQVEsQ0FmUixDQUFBOztBQWlCYSxFQUFBLGVBQUEsR0FBQTtBQUNYLHlEQUFBLENBQUE7QUFBQSxtREFBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLDJEQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSxJQUFBLHdDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUZBLENBRFc7RUFBQSxDQWpCYjs7QUFBQSxrQkFzQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLElBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQWpELEVBQXVELElBQUMsQ0FBQSxnQkFBeEQsQ0FBQSxDQUFBO0FBQUEsSUFDQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBaEQsRUFBc0QsSUFBQyxDQUFBLGVBQXZELENBREEsQ0FBQTtBQUFBLElBRUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQWhELEVBQXNELElBQUMsQ0FBQSxlQUF2RCxDQUZBLENBQUE7QUFBQSxJQUdBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFsRCxFQUF3RCxJQUFDLENBQUEsaUJBQXpELENBSEEsQ0FBQTtXQUtBLENBQUEsQ0FBRSw2QkFBRixDQUFnQyxDQUFDLEVBQWpDLENBQW9DLE9BQXBDLEVBQTZDLFNBQUMsQ0FBRCxHQUFBO0FBQzNDLE1BQUEsSUFBRyxDQUFBLENBQUUsVUFBRixDQUFhLENBQUMsUUFBZCxDQUF1QixPQUF2QixDQUFBLElBQW9DLE1BQU0sQ0FBQyxXQUE5QztBQUNFLFFBQUEsQ0FBQyxDQUFDLGNBQUYsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBbkIsQ0FBQSxDQURBLENBQUE7QUFFQSxlQUFPLEtBQVAsQ0FIRjtPQUQyQztJQUFBLENBQTdDLEVBTk87RUFBQSxDQXRCVCxDQUFBOztBQUFBLGtCQWtDQSxpQkFBQSxHQUFtQixTQUFDLENBQUQsR0FBQTtBQUNqQixJQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsSUFDQSxDQUFBLENBQUUsaUJBQUYsQ0FBb0IsQ0FBQyxRQUFyQixDQUE4QixRQUE5QixDQURBLENBQUE7V0FFQSxDQUFBLENBQUUsaUJBQUYsQ0FBb0IsQ0FBQyxRQUFyQixDQUE4QixRQUE5QixFQUhpQjtFQUFBLENBbENuQixDQUFBOztBQUFBLGtCQXVDQSxpQkFBQSxHQUFtQixTQUFDLENBQUQsR0FBQTtXQUNqQixNQUFNLENBQUMsT0FBUCxDQUFlLEtBQUssQ0FBQyxLQUFLLENBQUMsZ0JBQTNCLEVBRGlCO0VBQUEsQ0F2Q25CLENBQUE7O0FBQUEsa0JBMENBLGdCQUFBLEdBQWtCLFNBQUMsQ0FBRCxHQUFBO0FBQ2hCLElBQUEsQ0FBQSxDQUFFLGlCQUFGLENBQW9CLENBQUMsV0FBckIsQ0FBaUMsUUFBakMsQ0FBQSxDQUFBO0FBQUEsSUFDQSxDQUFBLENBQUUsaUJBQUYsQ0FBb0IsQ0FBQyxXQUFyQixDQUFpQyxRQUFqQyxDQURBLENBQUE7V0FFQSxDQUFBLENBQUUsVUFBRixDQUFhLENBQUMsUUFBZCxDQUF1QixRQUF2QixFQUhnQjtFQUFBLENBMUNsQixDQUFBOztBQUFBLGtCQStDQSxlQUFBLEdBQWlCLFNBQUMsQ0FBRCxHQUFBO0FBQ2YsSUFBQSxDQUFBLENBQUUsVUFBRixDQUFhLENBQUMsV0FBZCxDQUEwQixRQUExQixDQUFBLENBQUE7QUFBQSxJQUNBLENBQUEsQ0FBRSxnQkFBRixDQUFtQixDQUFDLFdBQXBCLENBQWdDLE1BQWhDLENBREEsQ0FBQTtXQUVBLENBQUEsQ0FBRSxnQkFBRixDQUFtQixDQUFDLFFBQXBCLENBQTZCLE9BQTdCLEVBSGU7RUFBQSxDQS9DakIsQ0FBQTs7QUFBQSxrQkFvREEsZUFBQSxHQUFpQixTQUFDLENBQUQsR0FBQTtBQUNmLFFBQUEsNEVBQUE7QUFBQSxJQUFBLElBQUEsQ0FBQSxDQUFPLENBQUUsVUFBRixDQUFhLENBQUMsUUFBZCxDQUF1QixPQUF2QixDQUFQO0FBQ0UsTUFBQSxDQUFBLENBQUUsVUFBRixDQUFhLENBQUMsUUFBZCxDQUF1QixPQUF2QixDQUFBLENBQUE7QUFBQSxNQUNBLENBQUEsQ0FBRSxZQUFGLENBQWUsQ0FBQyxJQUFoQixDQUFxQix1Q0FBckIsQ0FEQSxDQURGO0tBQUE7QUFBQSxJQUlBLEtBQUEsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBSnBCLENBQUE7QUFBQSxJQUtBLEtBQUEsR0FBVyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBTHRCLENBQUE7QUFBQSxJQU1BLFFBQUEsR0FBVyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BTnRCLENBQUE7QUFBQSxJQU9BLFFBQUEsR0FBVyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBUHRCLENBQUE7QUFBQSxJQVNBLENBQUEsQ0FBRSxpQkFBRixDQUFvQixDQUFDLElBQXJCLENBQTBCLEtBQTFCLENBVEEsQ0FBQTtBQUFBLElBVUEsQ0FBQSxDQUFFLGlCQUFGLENBQW9CLENBQUMsSUFBckIsQ0FBMEIsOEJBQUEsR0FBK0IsUUFBL0IsR0FBd0MsSUFBeEMsR0FBNkMsUUFBN0MsR0FBc0QsTUFBaEYsQ0FWQSxDQUFBO0FBQUEsSUFZQSxHQUFBLEdBQU0sYUFBQSxHQUNhLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFEeEIsR0FDK0IsZ0NBRC9CLEdBRWdCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFGM0IsR0FFa0MsZ0JBZHhDLENBQUE7QUFBQSxJQWdCQSxDQUFBLENBQUUsY0FBRixDQUFpQixDQUFDLElBQWxCLENBQXVCLEdBQXZCLENBaEJBLENBQUE7QUFBQSxJQWtCQSxTQUFBLEdBQVksSUFBQyxDQUFBLFFBQVMsQ0FBQSxDQUFBLENBbEJ0QixDQUFBO0FBbUJBO0FBQUEsU0FBQSw4Q0FBQTswQkFBQTtBQUNFLE1BQUEsSUFBRyxTQUFTLENBQUMsS0FBVixLQUFtQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQWpDO0FBQ0UsUUFBQSxJQUE4QixDQUFBLEdBQUUsQ0FBRixHQUFNLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBOUM7QUFBQSxVQUFBLFNBQUEsR0FBWSxJQUFDLENBQUEsUUFBUyxDQUFBLENBQUEsR0FBRSxDQUFGLENBQXRCLENBQUE7U0FBQTtBQUNBLGNBRkY7T0FERjtBQUFBLEtBbkJBO0FBQUEsSUF3QkEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQW9CLG1CQUFBLEdBQW9CLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBbkQsRUFBMEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsT0FBRCxHQUFBO0FBQ3hELFFBQUEsS0FBQyxDQUFBLFFBQUQsR0FBWSxPQUFaLENBQUE7ZUFDQSxLQUFDLENBQUEsY0FBRCxDQUFBLEVBRndEO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUQsQ0F4QkEsQ0FBQTtBQUFBLElBMkJBLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixtQkFBQSxHQUFvQixTQUFTLENBQUMsS0FBbEQsRUFBeUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsT0FBRCxHQUFBO0FBQ3ZELFFBQUEsS0FBQyxDQUFBLFFBQUQsR0FBWSxPQUFaLENBQUE7ZUFDQSxLQUFDLENBQUEsY0FBRCxDQUFBLEVBRnVEO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekQsQ0EzQkEsQ0FBQTtBQUFBLElBK0JBLENBQUEsQ0FBRSxrQkFBRixDQUFxQixDQUFDLEdBQXRCLENBQTBCO0FBQUEsTUFBRSxNQUFBLEVBQVEsTUFBTSxDQUFDLFdBQWpCO0tBQTFCLENBL0JBLENBQUE7QUFBQSxJQWdDQSxDQUFBLENBQUUsa0JBQUYsQ0FBcUIsQ0FBQyxJQUF0QixDQUFBLENBQTRCLENBQUMsR0FBN0IsQ0FBaUMsa0JBQWpDLEVBQXFELHVCQUFBLEdBQXdCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBbkMsR0FBeUMsR0FBOUYsQ0FoQ0EsQ0FBQTtXQWlDQSxDQUFBLENBQUUsa0JBQUYsQ0FBcUIsQ0FBQyxLQUF0QixDQUFBLENBQTZCLENBQUMsR0FBOUIsQ0FBa0Msa0JBQWxDLEVBQXNELHVCQUFBLEdBQXdCLFNBQVMsQ0FBQyxLQUFsQyxHQUF3QyxHQUE5RixFQWxDZTtFQUFBLENBcERqQixDQUFBOztBQUFBLGtCQXdGQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sSUFBQSxJQUFDLENBQUEsY0FBRCxHQUE2QixJQUFBLEtBQUssQ0FBQyxjQUFOLENBQUEsQ0FBN0IsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxNQUFoQixHQUF5QixJQUFDLENBQUEsV0FEMUIsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLFdBQUQsR0FBNkIsSUFBQSxLQUFLLENBQUMsV0FBTixDQUFrQixJQUFDLENBQUEsY0FBbkIsQ0FGN0IsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLGFBQUQsR0FBNkIsSUFBQSxLQUFLLENBQUMsYUFBTixDQUFvQixJQUFDLENBQUEsY0FBckIsQ0FIN0IsQ0FBQTtXQUlBLElBQUMsQ0FBQSxNQUFELEdBQTZCLElBQUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLGNBQWpCLEVBTHZCO0VBQUEsQ0F4RlIsQ0FBQTs7QUFBQSxrQkErRkEsSUFBQSxHQUFNLFNBQUMsUUFBRCxHQUFBO0FBQ0osUUFBQSxhQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBQVosQ0FBQTtBQUVBLFNBQUEsMENBQUE7MEJBQUE7QUFDRSxNQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixtQkFBQSxHQUFvQixLQUFLLENBQUMsS0FBNUMsRUFBbUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ2pELGlCQUFPLElBQVAsQ0FEaUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuRCxDQUFBLENBREY7QUFBQSxLQUZBO0FBQUEsSUFNQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSwyQkFBYixFQUEwQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxPQUFELEdBQUE7QUFDeEMsZUFBTyxJQUFQLENBRHdDO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUMsQ0FOQSxDQUFBO0FBQUEsSUFRQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSwyQkFBYixFQUEwQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxPQUFELEdBQUE7QUFDeEMsZUFBTyxJQUFQLENBRHdDO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUMsQ0FSQSxDQUFBO1dBVUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsbUNBQWIsRUFBa0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsT0FBRCxHQUFBO0FBQ2hELGVBQU8sSUFBUCxDQURnRDtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxELEVBWEk7RUFBQSxDQS9GTixDQUFBOztBQUFBLGtCQTZHQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsUUFBQSxzQ0FBQTtBQUFBLElBQUEsWUFBQSxHQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFNLENBQUEsMkJBQUEsQ0FBckMsQ0FBQTtBQUFBLElBQ0EsY0FBQSxHQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFNLENBQUEsMkJBQUEsQ0FEckMsQ0FBQTtBQUFBLElBR0EsUUFBQSxHQUFlLElBQUEsS0FBSyxDQUFDLGNBQU4sQ0FDYjtBQUFBLE1BQUEsUUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVU7QUFBQSxVQUFFLElBQUEsRUFBTSxHQUFSO0FBQUEsVUFBYSxLQUFBLEVBQU8sRUFBcEI7U0FBVjtBQUFBLFFBQ0EsUUFBQSxFQUFVO0FBQUEsVUFBRSxJQUFBLEVBQU0sR0FBUjtBQUFBLFVBQWEsS0FBQSxFQUFPLEVBQXBCO1NBRFY7QUFBQSxRQUVBLFVBQUEsRUFBWTtBQUFBLFVBQUUsSUFBQSxFQUFNLElBQVI7QUFBQSxVQUFjLEtBQUEsRUFBVyxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBekI7U0FGWjtBQUFBLFFBR0EsS0FBQSxFQUFPO0FBQUEsVUFBRSxJQUFBLEVBQU0sR0FBUjtBQUFBLFVBQWEsS0FBQSxFQUFPLENBQXBCO1NBSFA7QUFBQSxRQUlBLEtBQUEsRUFBTztBQUFBLFVBQUUsSUFBQSxFQUFNLEdBQVI7QUFBQSxVQUFhLEtBQUEsRUFBTyxDQUFwQjtTQUpQO0FBQUEsUUFLQSxNQUFBLEVBQVE7QUFBQSxVQUFFLElBQUEsRUFBTSxHQUFSO0FBQUEsVUFBYSxLQUFBLEVBQU8sQ0FBcEI7U0FMUjtPQURGO0FBQUEsTUFPQSxZQUFBLEVBQWMsWUFQZDtBQUFBLE1BUUEsY0FBQSxFQUFnQixjQVJoQjtLQURhLENBSGYsQ0FBQTtBQUFBLElBZ0JBLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFLLENBQUMsSUFBTixDQUFlLElBQUEsS0FBSyxDQUFDLG1CQUFOLENBQTBCLENBQTFCLEVBQTZCLENBQTdCLENBQWYsRUFBZ0QsUUFBaEQsQ0FoQmIsQ0FBQTtBQUFBLElBaUJBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQWhCLEdBQW9CLENBQUEsQ0FqQnBCLENBQUE7QUFBQSxJQWtCQSxJQUFDLENBQUEsR0FBRCxDQUFLLElBQUMsQ0FBQSxLQUFOLENBbEJBLENBQUE7QUFBQSxJQW9CQSxNQUFNLENBQUMsT0FBUCxDQUFlLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBM0IsQ0FwQkEsQ0FBQTtBQUFBLElBc0JBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBbEMsR0FBK0MsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFBLENBdEIvQyxDQUFBO0FBQUEsSUF1QkEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFsQyxHQUE4QyxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0F2QjlDLENBQUE7V0F5QkEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxNQUFoQixHQUF5QixJQUFDLENBQUEsZUExQmY7RUFBQSxDQTdHYixDQUFBOztBQUFBLGtCQXlJQSxjQUFBLEdBQWdCLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEdBQUE7QUFDZCxJQUFBLElBQUcsSUFBQyxDQUFBLFFBQUQsSUFBYSxJQUFDLENBQUEsUUFBakI7QUFDRSxNQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLFFBQVosRUFBc0IsSUFBQyxDQUFBLFFBQXZCLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUYxQjtLQURjO0VBQUEsQ0F6SWhCLENBQUE7O0FBQUEsa0JBOElBLFNBQUEsR0FBVyxTQUFDLE9BQUQsRUFBVSxJQUFWLEdBQUE7QUFDVCxRQUFBLGlEQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFVLENBQVYsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxDQURWLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBaEMsR0FBd0MsSUFBQyxDQUFBLE1BRnpDLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBL0IsR0FBd0MsSUFBQyxDQUFBLEtBSHpDLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBbEMsR0FBMkMsT0FMM0MsQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFsQyxHQUEwQyxJQU4xQyxDQUFBO0FBQUEsSUFRQSxZQUFBLEdBQWdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FSOUIsQ0FBQTtBQUFBLElBU0EsYUFBQSxHQUFnQixPQUFPLENBQUMsS0FBSyxDQUFDLE1BVDlCLENBQUE7QUFBQSxJQVdBLElBQUMsQ0FBQSxHQUFELEdBQVksT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFmLEdBQXFCLEdBQXJCLEdBQTJCLElBQUksQ0FBQyxFQVg1QyxDQUFBO0FBQUEsSUFZQSxJQUFDLENBQUEsTUFBRCxHQUFZLFlBQUEsR0FBZSxhQVozQixDQUFBO0FBQUEsSUFhQSxJQUFDLENBQUEsUUFBRCxHQUFZLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQXhCLEdBQTRCLENBYnhDLENBQUE7QUFBQSxJQWNBLEtBQUEsR0FBWSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQWYsR0FBd0IsSUFBQyxDQUFBLE1BQXJDLENBZFosQ0FBQTtBQUFBLElBZ0JBLEtBQUEsR0FBUyxDQUFBLEdBQUksSUFBQyxDQUFBLE1BQUwsR0FBYyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxHQUFELEdBQU8sQ0FBaEIsQ0FBZCxHQUFtQyxJQUFDLENBQUEsUUFBcEMsR0FBK0MsS0FoQnhELENBQUE7QUFBQSxJQWlCQSxNQUFBLEdBQVMsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLEdBQUQsR0FBTyxDQUFoQixDQUFKLEdBQXlCLElBQUMsQ0FBQSxRQUExQixHQUFxQyxLQWpCOUMsQ0FBQTtBQUFBLElBbUJBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQTFDLEdBQThDLEtBbkI5QyxDQUFBO0FBQUEsSUFvQkEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBMUMsR0FBOEMsTUFwQjlDLENBQUE7V0FxQkEsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBYixDQUFpQixLQUFqQixFQUF3QixNQUF4QixFQUFnQyxDQUFoQyxFQXRCUztFQUFBLENBOUlYLENBQUE7O0FBQUEsa0JBc0tBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixRQUFBLDRDQUFBO0FBQUEsSUFBQSxRQUFBLEdBQWdCLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBbEQsQ0FBQTtBQUFBLElBQ0EsWUFBQSxHQUFnQixRQUFRLENBQUMsS0FBSyxDQUFDLEtBRC9CLENBQUE7QUFBQSxJQUVBLGFBQUEsR0FBZ0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUYvQixDQUFBO0FBQUEsSUFJQSxLQUFBLEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFmLEdBQXdCLElBQUMsQ0FBQSxNQUFyQyxDQUpULENBQUE7V0FNQSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFiLENBQWlCLENBQUEsR0FBSSxJQUFDLENBQUEsTUFBTCxHQUFjLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLEdBQUQsR0FBTyxDQUFoQixDQUFkLEdBQW1DLElBQUMsQ0FBQSxRQUFwQyxHQUErQyxLQUFoRSxFQUF1RSxDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFDLENBQUEsR0FBRCxHQUFPLENBQWhCLENBQUosR0FBeUIsSUFBQyxDQUFBLFFBQTFCLEdBQXFDLEtBQTVHLEVBQW1ILENBQW5ILEVBUE07RUFBQSxDQXRLUixDQUFBOztBQUFBLGtCQStLQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osSUFBQSxDQUFBLENBQUUsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQTNCLENBQWtDLENBQUMsT0FBbkMsQ0FBMkM7QUFBQSxNQUFFLEtBQUEsRUFBTyxHQUFUO0tBQTNDLEVBQTJELEdBQTNELENBQUEsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxDQUFFLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUEzQixDQUFpQyxDQUFDLE9BQWxDLENBQTBDO0FBQUEsTUFBRSxLQUFBLEVBQU8sR0FBVDtLQUExQyxFQUEwRCxHQUExRCxDQURBLENBQUE7V0FFQSxVQUFBLENBQVcsSUFBQyxDQUFBLGlCQUFaLEVBQStCLEdBQS9CLEVBSEk7RUFBQSxDQS9LTixDQUFBOztBQUFBLGtCQW9MQSxNQUFBLEdBQVEsU0FBQyxLQUFELEdBQUE7QUFDTixJQUFBLElBQUcsSUFBQyxDQUFBLEtBQUo7YUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQS9CLElBQXdDLEtBQUEsR0FBUSxNQURsRDtLQURNO0VBQUEsQ0FwTFIsQ0FBQTs7ZUFBQTs7R0FGZ0MsS0FBSyxDQUFDLE1BMTZEeEMsQ0FBQTs7QUFBQSxPQXNtRUEsR0FBYyxJQUFBLEtBQUssQ0FBQyxZQUFOLENBQUEsQ0F0bUVkLENBQUE7O0FBQUEsT0F1bUVPLENBQUMsV0FBUixDQUFvQixNQUFwQixFQUE0QixLQUFLLENBQUMsU0FBbEMsQ0F2bUVBLENBQUE7O0FBQUEsT0F3bUVPLENBQUMsU0FBUixDQUFrQixNQUFsQixDQXhtRUEsQ0FBQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsid2luZG93LlNQQUNFID0gd2luZG93LlNQQUNFIHx8IHt9XG5cblNQQUNFLkVOViA9ICcnXG5cbiMgUElYSS5KU1xuU1BBQ0UuRlBTICAgICAgICA9IDMwXG5TUEFDRS5waXhlbFJhdGlvID0gKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpXG5cbiMgVEhSRUUuSlNcblNQQUNFLlRIUkVFID0ge31cblxuIyBTT1VORENMT1VEXG5TUEFDRS5TT1VORENMT1VEID0gKC0+XG4gIG9iamVjdCA9IHt9XG4gIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG4gICAgb2JqZWN0LmlkID0gJ2RlMGI4NTM5YjRhZDJmNmNjMjNkZmUxY2M2ZTA0MzhkJ1xuICBlbHNlXG4gICAgb2JqZWN0LmlkID0gJzgwN2QyODU3NWMzODRlNjJhNThiZTVjM2ExNDQ2ZTY4J1xuICBvYmplY3QucmVkaXJlY3RfdXJpID0gd2luZG93LmxvY2F0aW9uLm9yaWdpblxuICByZXR1cm4gb2JqZWN0XG4pKClcblxuXG4jIE1FVEhPRFNcblNQQUNFLkxPRyAgICAgICAgPSAobG9nLCBzdHlsZXM9JycpLT5cbiAgdW5sZXNzIC8ocHJvZHxwcm9kdWN0aW9uKS8udGVzdChTUEFDRS5FTlYpXG4gICAgICBkYXRlICAgICA9IG5ldyBEYXRlKClcbiAgICAgIHRpbWVTdHIgID0gZGF0ZS50b1RpbWVTdHJpbmcoKVxuICAgICAgdGltZVN0ciAgPSB0aW1lU3RyLnN1YnN0cigwLCA4KVxuICAgICAgZGF0ZVN0ciAgPSBkYXRlLmdldERhdGUoKSArICcvJ1xuICAgICAgZGF0ZVN0ciArPSAoZGF0ZS5nZXRNb250aCgpKzEpICsgJy8nXG4gICAgICBkYXRlU3RyICs9IGRhdGUuZ2V0RnVsbFllYXIoKVxuICAgICAgY29uc29sZS5sb2coZGF0ZVN0cisnIC0gJyt0aW1lU3RyKycgfCAnK2xvZywgc3R5bGVzKVxuXG5TUEFDRS5UT0RPICAgICAgID0gKG1lc3NhZ2UpLT5cbiAgU1BBQ0UuTE9HKCclY1RPRE8gfCAnICsgbWVzc2FnZSwgJ2NvbG9yOiAjMDA4OEZGJylcblxuIyBFTlZJUk9OTUVOVFNcblNQQUNFLkRFRkFVTFQgPSB7fVxuXG5cbndpbmRvdy5FVkVOVCA9XG4gIEp1a2Vib3g6XG4gICAgVFJBQ0tfT05fQUREOiAgICAgICBuZXcgRXZlbnQoJ2p1a2Vib3hfdHJhY2tfb25fYWRkJylcbiAgICBUUkFDS19PTl9BRERfRVJST1I6IG5ldyBFdmVudCgnanVrZWJveF90cmFja19vbl9hZGRfZXJyb3InKVxuICAgIFRSQUNLX0FEREVEOiAgICAgICAgbmV3IEV2ZW50KCdqdWtlYm94X3RyYWNrX2FkZGVkJylcbiAgICBPTl9QTEFZOiAgICAgICAgICAgIG5ldyBFdmVudCgnanVrZWJveF9vbl9wbGF5JylcbiAgICBPTl9TVE9QOiAgICAgICAgICAgIG5ldyBFdmVudCgnanVrZWJveF9vbl9zdG9wJylcbiAgICBJU19QTEFZSU5HOiAgICAgICAgIG5ldyBFdmVudCgnanVrZWJveF9pc19wbGF5aW5nJylcbiAgICBJU19TVE9QUEVEOiAgICAgICAgIG5ldyBFdmVudCgnanVrZWJveF9pc19zdG9wcGVkJylcbiAgICBJU19TRUFSQ0hJTkc6ICAgICAgIG5ldyBFdmVudCgnanVrZWJveF9pc19zZWFyY2hpbmcnKVxuICAgIFdJTExfUExBWTogICAgICAgICAgbmV3IEV2ZW50KCdqdWtlYm94X3dpbGxfcGxheScpXG4gIFRyYWNrOlxuICAgIElTX0xPQURFRDogbmV3IEV2ZW50KCd0cmFja19pc19sb2FkZWQnKVxuICAgIElTX1BMQVlJTkc6IG5ldyBFdmVudCgndHJhY2tfaXNfcGxheWluZycpXG4gICAgSVNfUEFVU0VEOiAgbmV3IEV2ZW50KCd0cmFja19pc19wYXVzZWQnKVxuICAgIElTX1NUT1BQRUQ6IG5ldyBFdmVudCgndHJhY2tfaXNfc3RvcHBlZCcpXG4gIFNvdW5kQ2xvdWQ6XG4gICAgSVNfQ09OTkVDVEVEOiBuZXcgRXZlbnQoJ3NvdW5kY2xvdWRfY29ubmVjdGVkJylcbiAgQ292ZXI6XG4gICAgVEVYVFVSRVNfTE9BREVEOiAgbmV3IEV2ZW50KCdjb3Zlcl90ZXh0dXJlc19sb2FkZWQnKVxuICAgIFRSQU5TSVRJT05fRU5ERUQ6IG5ldyBFdmVudCgnY292ZXJfdHJhbnNpdGlvbl9lbmRlZCcpXG5PYmplY3QuZnJlZXplKEVWRU5UKVxuXG5cbndpbmRvdy5FTlVNID1cbiAgS2V5Ym9hcmQ6XG4gICAgRU5URVI6IDEzXG4gICAgVVA6IDM4XG4gICAgRE9XTjogNDBcbiAgICBFU0M6IDI3XG4gICAgREVMRVRFOiA0NlxuICBTcGFjZXNoaXBTdGF0ZTpcbiAgICBJRExFOiAnc3BhY2VzaGlwc3RhdGVfaWRsZSdcbiAgICBMQVVOQ0hFRDogJ3NwYWNlc2hpcHN0YXRlX2xhdW5jaGVkJ1xuICAgIElOX0xPT1A6ICdzcGFjZXNoaXBzdGF0ZV9pbmxvb3AnXG4gICAgQVJSSVZFRDogJ3NwYWNlc2hpcHN0YXRlX2Fycml2ZWQnXG4gIFNlYXJjaEVuZ2luZVN0YXRlOlxuICAgIE9QRU5FRDogJ3NlYXJjaGVuZ2luZXN0YXRlX29wZW5lZCdcbiAgICBDTE9TRUQ6ICdzZWFyY2hlbmdpbmVzdGF0ZV9jbG9zZWQnXG4gICAgU0VBUkNIOiAnc2VhcmNoZW5naW5lc3RhdGVfc2VhcmNoJ1xuICAgIFRSQUNLX1NFTEVDVEVEOiAnc2VhcmNoZW5naW5lc3RhdGVfdHJhY2tzZWxlY3RlZCdcbiAgSnVrZWJveFN0YXRlOlxuICAgIElTX1BMQVlJTkc6ICdqdWtlYm94c3RhdGVfaXNwbGF5aW5nJ1xuICAgIElTX1NUT1BQRUQ6ICdqdWtlYm94c3RhdGVfaXNzdG9wcGVkJ1xuICAgIFRSQUNLX1NUT1BQRUQ6ICdqdWtlYm94c3RhdGVfdHJhY2tzdG9wcGVkJ1xuICBBaXJwb3J0U3RhdGU6XG4gICAgSURMRTogJ2FpcnBvcnRzdGF0ZV9pZGxlJ1xuICAgIFNFTkRJTkc6ICdhaXJwb3J0c3RhdGVfc2VuZGluZydcbiAgQXVkaW9TdGF0ZTpcbiAgICBJU19MT0FESU5HOiAnYXVkaW9faXNfbG9hZGluZydcbiAgICBJU19QTEFZSU5HOiAnYXVkaW9faXNfcGxheWluZydcbiAgICBJU19QQVVTRUQ6ICdhdWRpb19pc19wYXVzZWQnXG4gICAgSVNfRU5ERUQ6ICdhdWRpb19pc19lbmRlZCdcbk9iamVjdC5mcmVlemUoRU5VTSlcblxuXG53aW5kb3cuSEVMUEVSID0gd2luZG93LkhFTFBFUiB8fFxuICB0cmlnZ2VyOiAoZSwgb2JqZWN0KS0+XG4gICAgZS5vYmplY3QgPSBvYmplY3RcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGUpXG5cbiAgcmV0aW5hOiAodmFsdWUpLT5cbiAgICBpZiB0eXBlb2YgdmFsdWUgaXMgJ29iamVjdCdcbiAgICAgIG9iamVjdCA9IHZhbHVlXG4gICAgICBvID0ge31cbiAgICAgIGZvciBrZXkgb2Ygb2JqZWN0XG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV1cbiAgICAgICAgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICAgICAgb1trZXldID0gdmFsdWUgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb1xuICAgICAgcmV0dXJuIEBtZXJnZShvYmplY3QsIG8pXG4gICAgZWxzZSBpZiB0eXBlb2YgdmFsdWUgaXMgJ2FycmF5J1xuICAgICAgYXJyYXkgPSB2YWx1ZVxuICAgICAgYSA9IFtdXG4gICAgICBmb3IgdmFsdWUsIGtleSBpbiBhcnJheVxuICAgICAgICBpZiB0eXBlb2YgdmFsdWUgaXMgJ251bWJlcidcbiAgICAgICAgICBhLnB1c2godmFsdWUgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGEucHVzaCh2YWx1ZSlcbiAgICAgIHJldHVybiBhXG4gICAgZWxzZSBpZiB0eXBlb2YgdmFsdWUgaXMgJ251bWJlcidcbiAgICAgIHJldHVybiB2YWx1ZSAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvXG4gICAgcmV0dXJuIGZhbHNlXG5cblxuSEVMUEVSLkNvZmZlZSA9XG4gICMgQXJyYXlcbiAgc2h1ZmZsZTogKGFycmF5KS0+XG4gICAgdG1wXG4gICAgY3VyciA9IGFycmF5Lmxlbmd0aFxuICAgIHdoaWxlIDAgIT0gY3VyclxuICAgICAgcmFuZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnIpXG4gICAgICBjdXJyIC09IDFcbiAgICAgIHRtcCAgICAgICAgID0gYXJyYXlbY3Vycl1cbiAgICAgIGFycmF5W2N1cnJdID0gYXJyYXlbcmFuZF1cbiAgICAgIGFycmF5W3JhbmRdID0gdG1wXG4gICAgcmV0dXJuIGFycmF5XG5cbiAgIyBPYmplY3RcbiAgbWVyZ2U6IChvcHRpb25zLCBvdmVycmlkZXMpIC0+XG4gICAgQGV4dGVuZCAoQGV4dGVuZCB7fSwgb3B0aW9ucyksIG92ZXJyaWRlc1xuXG4gIGV4dGVuZDogKG9iamVjdCwgcHJvcGVydGllcykgLT5cbiAgICBmb3Iga2V5LCB2YWwgb2YgcHJvcGVydGllc1xuICAgICAgb2JqZWN0W2tleV0gPSB2YWxcbiAgICBvYmplY3RcblxuXG5IRUxQRVIuTWF0aCA9XG4gIGFuZ2xlQmV0d2VlblBvaW50czogKGZpcnN0LCBzZWNvbmQpIC0+XG4gICAgaGVpZ2h0ID0gc2Vjb25kLnkgLSBmaXJzdC55XG4gICAgd2lkdGggID0gc2Vjb25kLnggLSBmaXJzdC54XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoaGVpZ2h0LCB3aWR0aClcblxuICBkaXN0YW5jZTogKHBvaW50MSwgcG9pbnQyKSAtPlxuICAgIHggPSBwb2ludDEueCAtIHBvaW50Mi54XG4gICAgeSA9IHBvaW50MS55IC0gcG9pbnQyLnlcbiAgICBkID0geCAqIHggKyB5ICogeVxuICAgIHJldHVybiBNYXRoLnNxcnQoZClcblxuICBjb2xsaXNpb246IChkb3QxLCBkb3QyKS0+XG4gICAgcjEgPSBpZiBkb3QxLnJhZGl1cyB0aGVuIGRvdDEucmFkaXVzIGVsc2UgMFxuICAgIHIyID0gaWYgZG90Mi5yYWRpdXMgdGhlbiBkb3QyLnJhZGl1cyBlbHNlIDBcbiAgICBkaXN0ID0gcjEgKyByMlxuXG4gICAgcmV0dXJuIEBkaXN0YW5jZShkb3QxLnBvc2l0aW9uLCBkb3QyLnBvc2l0aW9uKSA8PSBNYXRoLnNxcnQoZGlzdCAqIGRpc3QpXG5cbiAgbWFwOiAodmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikgLT5cbiAgICByZXR1cm4gbG93MiArIChoaWdoMiAtIGxvdzIpICogKHZhbHVlIC0gbG93MSkgLyAoaGlnaDEgLSBsb3cxKVxuXG4gICMgSGVybWl0ZSBDdXJ2ZVxuICBoZXJtaXRlOiAoeTAsIHkxLCB5MiwgeTMsIG11LCB0ZW5zaW9uLCBiaWFzKS0+XG4gICAgYFxuICAgIHZhciBtMCxtMSxtdTIsbXUzO1xuICAgIHZhciBhMCxhMSxhMixhMztcblxuICAgIG11MiA9IG11ICogbXU7XG4gICAgbXUzID0gbXUyICogbXU7XG4gICAgbTAgID0gKHkxLXkwKSooMStiaWFzKSooMS10ZW5zaW9uKS8yO1xuICAgIG0wICs9ICh5Mi15MSkqKDEtYmlhcykqKDEtdGVuc2lvbikvMjtcbiAgICBtMSAgPSAoeTIteTEpKigxK2JpYXMpKigxLXRlbnNpb24pLzI7XG4gICAgbTEgKz0gKHkzLXkyKSooMS1iaWFzKSooMS10ZW5zaW9uKS8yO1xuICAgIGEwID0gIDIqbXUzIC0gMyptdTIgKyAxO1xuICAgIGExID0gICAgbXUzIC0gMiptdTIgKyBtdTtcbiAgICBhMiA9ICAgIG11MyAtICAgbXUyO1xuICAgIGEzID0gLTIqbXUzICsgMyptdTI7XG4gICAgYFxuICAgIHJldHVybihhMCp5MSthMSptMCthMiptMSthMyp5MilcblxuXG5IRUxQRVIuVEhSRUUgPVxuICBIZXJtaXRlQ3VydmU6IChwdHMpLT5cbiAgICBwYXRoID0gbmV3IFRIUkVFLkN1cnZlUGF0aCgpXG4gICAgcGF0aC5hZGQobmV3IFRIUkVFLkhlcm1pdGVCZXppZXJDdXJ2ZTMocHRzWzBdLCBwdHNbMF0sIHB0c1sxXSwgcHRzWzJdKSlcbiAgICBmb3IgaSBpbiBbMC4uKHB0cy5sZW5ndGgtNCldXG4gICAgICBwYXRoLmFkZChuZXcgVEhSRUUuSGVybWl0ZUJlemllckN1cnZlMyhwdHNbaV0sIHB0c1tpKzFdLCBwdHNbaSsyXSwgcHRzW2krM10pKVxuICAgIHBhdGguYWRkKG5ldyBUSFJFRS5IZXJtaXRlQmV6aWVyQ3VydmUzKHB0c1twdHMubGVuZ3RoLTNdLCBwdHNbcHRzLmxlbmd0aC0yXSwgcHRzW3B0cy5sZW5ndGgtMV0sIHB0c1twdHMubGVuZ3RoLTFdKSlcbiAgICByZXR1cm4gcGF0aFxuXG5USFJFRS5DdXJ2ZS5VdGlscy50YW5nZW50SGVybWl0ZUJlemllciA9ICggeTAsIHkxLCB5MiwgeTMsIG11LCB0ZW5zaW9uLCBiaWFzICktPlxuICAgIG11MiA9IG11ICogbXVcbiAgICBtdTMgPSBtdTIgKiBtdVxuXG4gICAgbTAgID0gKHkxLXkwKSooMStiaWFzKSooMS10ZW5zaW9uKS8yXG4gICAgbTAgICs9ICh5Mi15MSkqKDEtYmlhcykqKDEtdGVuc2lvbikvMlxuXG4gICAgbTEgID0gKHkyLXkxKSooMStiaWFzKSooMS10ZW5zaW9uKS8yXG4gICAgbTEgICs9ICh5My15MikqKDEtYmlhcykqKDEtdGVuc2lvbikvMlxuXG4gICAgYTAgID0gIDIqbXUzIC0gMyptdTIgKyAxXG4gICAgYTEgID0gICAgbXUzIC0gMiptdTIgKyBtdVxuICAgIGEyICA9ICAgIG11MyAtICAgbXUyXG4gICAgYTMgID0gLTIqbXUzICsgMyptdTJcblxuICAgIHJldHVybihhMCp5MSthMSptMCthMiptMSthMyp5MilcblxuVEhSRUUuSGVybWl0ZUJlemllckN1cnZlMyA9IFRIUkVFLkN1cnZlLmNyZWF0ZShcbiAgKHYwLCB2MSwgdjIsIHYzKS0+XG4gICAgQHYwID0gdjBcbiAgICBAdjEgPSB2MVxuICAgIEB2MiA9IHYyXG4gICAgQHYzID0gdjNcbiAgICByZXR1cm5cbiAgLCAodCktPlxuICAgIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICB2ZWN0b3IueCA9IFRIUkVFLkN1cnZlLlV0aWxzLnRhbmdlbnRIZXJtaXRlQmV6aWVyKEB2MC54LCBAdjEueCwgQHYyLngsIEB2My54LCB0LCAwLCAwKVxuICAgIHZlY3Rvci55ID0gVEhSRUUuQ3VydmUuVXRpbHMudGFuZ2VudEhlcm1pdGVCZXppZXIoQHYwLnksIEB2MS55LCBAdjIueSwgQHYzLnksIHQsIDAsIDApXG4gICAgdmVjdG9yLnogPSBUSFJFRS5DdXJ2ZS5VdGlscy50YW5nZW50SGVybWl0ZUJlemllcihAdjAueiwgQHYxLnosIEB2Mi56LCBAdjMueiwgdCwgMCwgMClcbiAgICByZXR1cm4gdmVjdG9yXG4pXG5cblRIUkVFLkluTG9vcEN1cnZlID0gVEhSRUUuQ3VydmUuY3JlYXRlKFxuICAodjAsIHN0YXJ0QW5nbGU9MCwgbWF4UmFkaXVzPTEwMCwgbWluUmFkaXVzPTAsIGludmVyc2U9ZmFsc2UsIHVzZUdvbGRlbj1mYWxzZSktPlxuICAgIEB2MCAgICAgICAgID0gdjBcbiAgICBAaW52ZXJzZSAgICA9IGludmVyc2VcbiAgICBAc3RhcnRBbmdsZSA9IHN0YXJ0QW5nbGVcblxuICAgIEBtYXhSYWRpdXMgID0gbWF4UmFkaXVzXG4gICAgQG1pblJhZGl1cyAgPSBtaW5SYWRpdXNcbiAgICBAcmFkaXVzICAgICA9IEBtYXhSYWRpdXMgLSBAbWluUmFkaXVzXG5cbiAgICBAdXNlR29sZGVuICA9IHVzZUdvbGRlblxuXG4gICAgcmV0dXJuXG4gICwgKHQpLT5cbiAgICB0ICAgICA9IDEgLSB0IGlmIEBpbnZlcnNlXG4gICAgaWYgQHVzZUdvbGRlblxuICAgICAgICBwaGkgICA9IChNYXRoLnNxcnQoNSkrMSkvMiAtIDFcbiAgICAgICAgZ29sZGVuX2FuZ2xlID0gcGhpICogTWF0aC5QSSAqIDJcbiAgICAgICAgYW5nbGUgPSBAc3RhcnRBbmdsZSArIChnb2xkZW5fYW5nbGUgKiB0KVxuICAgICAgICBhbmdsZSArPSBNYXRoLlBJICogLTEuMjM1XG4gICAgZWxzZVxuICAgICAgICBhbmdsZSA9IEBzdGFydEFuZ2xlICsgKE1hdGguUEkgKiAyICogdClcblxuICAgIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICB2ZWN0b3IueCA9IEB2MC54ICsgTWF0aC5jb3MoYW5nbGUpICogKEBtaW5SYWRpdXMgKyBAcmFkaXVzICogdClcbiAgICB2ZWN0b3IueSA9IEB2MC55ICsgTWF0aC5zaW4oYW5nbGUpICogKEBtaW5SYWRpdXMgKyBAcmFkaXVzICogdClcbiAgICB2ZWN0b3IueiA9IEB2MC56XG4gICAgcmV0dXJuIHZlY3RvclxuKVxuXG5USFJFRS5MYXVuY2hlZEN1cnZlID0gVEhSRUUuQ3VydmUuY3JlYXRlKFxuICAodjAsIHYxLCBuYkxvb3A9MiktPlxuICAgIEB2MCAgID0gdjBcbiAgICBAdjEgICA9IHYxXG4gICAgQG5iTG9vcCA9IG5iTG9vcFxuICAgIHJldHVyblxuICAsICh0KS0+XG4gICAgYW5nbGUgPSBNYXRoLlBJICogMiAqIHQgKiBAbmJMb29wXG5cbiAgICBkID0gQHYxLnogLSBAdjAuelxuXG4gICAgZGlzdCA9IEB2MS5jbG9uZSgpLnN1YihAdjApXG5cbiAgICB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgdmVjdG9yLnggPSBAdjAueCArIGRpc3QueCAqIHRcbiAgICB2ZWN0b3IueSA9IEB2MC55ICsgZGlzdC55ICogdFxuICAgIHZlY3Rvci56ID0gQHYwLnogKyBkaXN0LnogKiB0XG5cbiAgICB0ID0gTWF0aC5taW4odCwgMSAtIHQpIC8gLjVcblxuICAgIHZlY3Rvci54ICs9IE1hdGguY29zKGFuZ2xlKSAqICg1MCAqIHQpXG4gICAgdmVjdG9yLnkgKz0gTWF0aC5zaW4oYW5nbGUpICogKDUwICogdClcblxuICAgIHJldHVybiB2ZWN0b3JcbilcblxuXG5IRUxQRVIuRWFzaW5nID1cblxuICAjXG4gICMgIEVhc2luZyBmdW5jdGlvbiBpbnNwaXJlZCBmcm9tIEFIRWFzaW5nXG4gICMgIGh0dHBzOi8vZ2l0aHViLmNvbS93YXJyZW5tL0FIRWFzaW5nXG4gICNcblxuICAjIyBNb2RlbGVkIGFmdGVyIHRoZSBsaW5lIHkgPSB4XG4gIGxpbmVhcjogKHApLT5cbiAgICByZXR1cm4gcFxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGFyYWJvbGEgeSA9IHheMlxuICBRdWFkcmF0aWNFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwYXJhYm9sYSB5ID0gLXheMiArIDJ4XG4gIFF1YWRyYXRpY0Vhc2VPdXQ6IChwKS0+XG4gICAgcmV0dXJuIC0ocCAqIChwIC0gMikpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgcXVhZHJhdGljXG4gICMgeSA9ICgxLzIpKCgyeCleMikgICAgICAgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAtKDEvMikoKDJ4LTEpKigyeC0zKSAtIDEpIDsgWzAuNSwgMV1cbiAgUXVhZHJhdGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMiAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICgtMiAqIHAgKiBwKSArICg0ICogcCkgLSAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBjdWJpYyB5ID0geF4zXG4gIEN1YmljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGN1YmljIHkgPSAoeCAtIDEpXjMgKyAxXG4gIEN1YmljRWFzZU91dDogKHApLT5cbiAgICBmID0gKHAgLSAxKVxuICAgIHJldHVybiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgY3ViaWNcbiAgIyB5ID0gKDEvMikoKDJ4KV4zKSAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKCgyeC0yKV4zICsgMikgOyBbMC41LCAxXVxuICBDdWJpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDQgKiBwICogcCAqIHBcbiAgICBlbHNlXG4gICAgICBmID0gKCgyICogcCkgLSAyKVxuICAgICAgcmV0dXJuIDAuNSAqIGYgKiBmICogZiArIDFcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1YXJ0aWMgeF40XG4gIFF1YXJ0aWNFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIHAgKiBwICogcCAqIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1YXJ0aWMgeSA9IDEgLSAoeCAtIDEpXjRcbiAgUXVhcnRpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSlcbiAgICByZXR1cm4gZiAqIGYgKiBmICogKDEgLSBwKSArIDFcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBxdWFydGljXG4gICMgeSA9ICgxLzIpKCgyeCleNCkgICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gLSgxLzIpKCgyeC0yKV40IC0gMikgOyBbMC41LCAxXVxuICBRdWFydGljRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gOCAqIHAgKiBwICogcCAqIHBcbiAgICBlbHNlXG4gICAgICBmID0gKHAgLSAxKVxuICAgICAgcmV0dXJuIC04ICogZiAqIGYgKiBmICogZiArIDFcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1aW50aWMgeSA9IHheNVxuICBRdWludGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHAgKiBwICogcFxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcXVpbnRpYyB5ID0gKHggLSAxKV41ICsgMVxuICBRdWludGljRWFzZU91dDogKHApLT5cbiAgICBmID0gKHAgLSAxKTtcbiAgICByZXR1cm4gZiAqIGYgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgcXVpbnRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjUpICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gKDEvMikoKDJ4LTIpXjUgKyAyKSA7IFswLjUsIDFdXG4gIFF1aW50aWNFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAxNiAqIHAgKiBwICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9ICgoMiAqIHApIC0gMilcbiAgICAgIHJldHVybiAgMC41ICogZiAqIGYgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHF1YXJ0ZXItY3ljbGUgb2Ygc2luZSB3YXZlXG4gIFNpbmVFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc2luKChwIC0gMSkgKiBNYXRoLlBJICogMikgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHF1YXJ0ZXItY3ljbGUgb2Ygc2luZSB3YXZlIChkaWZmZXJlbnQgcGhhc2UpXG4gIFNpbmVFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbihwICogTWF0aC5QSSAqIDIpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIGhhbGYgc2luZSB3YXZlXG4gIFNpbmVFYXNlSW5PdXQ6IChwKS0+XG4gICAgcmV0dXJuIDAuNSAqICgxIC0gTWF0aC5jb3MocCAqIE1hdGguUEkpKVxuXG4gICMgTW9kZWxlZCBhZnRlciBzaGlmdGVkIHF1YWRyYW50IElWIG9mIHVuaXQgY2lyY2xlXG4gIENpcmN1bGFyRWFzZUluOiAocCktPlxuICAgIHJldHVybiAxIC0gTWF0aC5zcXJ0KDEgLSAocCAqIHApKVxuXG4gICMgTW9kZWxlZCBhZnRlciBzaGlmdGVkIHF1YWRyYW50IElJIG9mIHVuaXQgY2lyY2xlXG4gIENpcmN1bGFyRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KCgyIC0gcCkgKiBwKTtcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBjaXJjdWxhciBmdW5jdGlvblxuICAjIHkgPSAoMS8yKSgxIC0gc3FydCgxIC0gNHheMikpICAgICAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKHNxcnQoLSgyeCAtIDMpKigyeCAtIDEpKSArIDEpIDsgWzAuNSwgMV1cbiAgQ2lyY3VsYXJFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiAoMSAtIE1hdGguc3FydCgxIC0gNCAqIChwICogcCkpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KC0oKDIgKiBwKSAtIDMpICogKCgyICogcCkgLSAxKSkgKyAxKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgZXhwb25lbnRpYWwgZnVuY3Rpb24geSA9IDJeKDEwKHggLSAxKSlcbiAgRXhwb25lbnRpYWxFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIGlmIChwID09IDAuMCkgdGhlbiBwIGVsc2UgTWF0aC5wb3coMiwgMTAgKiAocCAtIDEpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgZXhwb25lbnRpYWwgZnVuY3Rpb24geSA9IC0yXigtMTB4KSArIDFcbiAgRXhwb25lbnRpYWxFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiBpZiAocCA9PSAxLjApIHRoZW4gcCBlbHNlIDEgLSBNYXRoLnBvdygyLCAtMTAgKiBwKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIGV4cG9uZW50aWFsXG4gICMgeSA9ICgxLzIpMl4oMTAoMnggLSAxKSkgICAgICAgICA7IFswLDAuNSlcbiAgIyB5ID0gLSgxLzIpKjJeKC0xMCgyeCAtIDEpKSkgKyAxIDsgWzAuNSwxXVxuICBFeHBvbmVudGlhbEVhc2VJbk91dDogKHApLT5cbiAgICBpZihwID09IDAuMCB8fCBwID09IDEuMClcbiAgICAgIHJldHVybiBwXG5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDAuNSAqIE1hdGgucG93KDIsICgyMCAqIHApIC0gMTApXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIC0wLjUgKiBNYXRoLnBvdygyLCAoLTIwICogcCkgKyAxMCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBkYW1wZWQgc2luZSB3YXZlIHkgPSBzaW4oMTNwaS8yKngpKnBvdygyLCAxMCAqICh4IC0gMSkpXG4gIEVsYXN0aWNFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc2luKDEzICogTWF0aC5QSSAqIDIgKiBwKSAqIE1hdGgucG93KDIsIDEwICogKHAgLSAxKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGRhbXBlZCBzaW5lIHdhdmUgeSA9IHNpbigtMTNwaS8yKih4ICsgMSkpKnBvdygyLCAtMTB4KSArIDFcbiAgRWxhc3RpY0Vhc2VPdXQ6IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc2luKC0xMyAqIE1hdGguUEkgKiAyICogKHAgKyAxKSkgKiBNYXRoLnBvdygyLCAtMTAgKiBwKSArIDFcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBleHBvbmVudGlhbGx5LWRhbXBlZCBzaW5lIHdhdmU6XG4gICMgeSA9ICgxLzIpKnNpbigxM3BpLzIqKDIqeCkpKnBvdygyLCAxMCAqICgoMip4KSAtIDEpKSAgICAgIDsgWzAsMC41KVxuICAjIHkgPSAoMS8yKSooc2luKC0xM3BpLzIqKCgyeC0xKSsxKSkqcG93KDIsLTEwKDIqeC0xKSkgKyAyKSA7IFswLjUsIDFdXG4gIEVsYXN0aWNFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiBNYXRoLnNpbigxMyAqIE1hdGguUEkgKiAyICogKDIgKiBwKSkgKiBNYXRoLnBvdygyLCAxMCAqICgoMiAqIHApIC0gMSkpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnNpbigtMTMgKiBNYXRoLlBJICogMiAqICgoMiAqIHAgLSAxKSArIDEpKSAqIE1hdGgucG93KDIsIC0xMCAqICgyICogcCAtIDEpKSArIDIpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBvdmVyc2hvb3RpbmcgY3ViaWMgeSA9IHheMy14KnNpbih4KnBpKVxuICBCYWNrRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHAgLSBwICogTWF0aC5zaW4ocCAqIE1hdGguUEkpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIG92ZXJzaG9vdGluZyBjdWJpYyB5ID0gMS0oKDEteCleMy0oMS14KSpzaW4oKDEteCkqcGkpKVxuICBCYWNrRWFzZU91dDogKHApLT5cbiAgICBmID0gKDEgLSBwKVxuICAgIHJldHVybiAxIC0gKGYgKiBmICogZiAtIGYgKiBNYXRoLnNpbihmICogTWF0aC5QSSkpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2Ugb3ZlcnNob290aW5nIGN1YmljIGZ1bmN0aW9uOlxuICAjIHkgPSAoMS8yKSooKDJ4KV4zLSgyeCkqc2luKDIqeCpwaSkpICAgICAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKigxLSgoMS14KV4zLSgxLXgpKnNpbigoMS14KSpwaSkpKzEpIDsgWzAuNSwgMV1cbiAgQmFja0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgZiA9IDIgKiBwXG4gICAgICByZXR1cm4gMC41ICogKGYgKiBmICogZiAtIGYgKiBNYXRoLnNpbihmICogTWF0aC5QSSkpXG4gICAgZWxzZVxuICAgICAgZiA9ICgxIC0gKDIqcCAtIDEpKVxuICAgICAgcmV0dXJuIDAuNSAqICgxIC0gKGYgKiBmICogZiAtIGYgKiBNYXRoLnNpbihmICogTWF0aC5QSSkpKSArIDAuNVxuXG4gIEJvdW5jZUVhc2VJbjogKHApLT5cbiAgICByZXR1cm4gMSAtIEBCb3VuY2VFYXNlT3V0KDEgLSBwKTtcblxuICBCb3VuY2VFYXNlT3V0OiAocCktPlxuICAgIGlmKHAgPCA0LzExLjApXG4gICAgICByZXR1cm4gKDEyMSAqIHAgKiBwKS8xNi4wXG4gICAgZWxzZSBpZihwIDwgOC8xMS4wKVxuICAgICAgcmV0dXJuICgzNjMvNDAuMCAqIHAgKiBwKSAtICg5OS8xMC4wICogcCkgKyAxNy81LjBcbiAgICBlbHNlIGlmKHAgPCA5LzEwLjApXG4gICAgICByZXR1cm4gKDQzNTYvMzYxLjAgKiBwICogcCkgLSAoMzU0NDIvMTgwNS4wICogcCkgKyAxNjA2MS8xODA1LjBcbiAgICBlbHNlXG4gICAgICByZXR1cm4gKDU0LzUuMCAqIHAgKiBwKSAtICg1MTMvMjUuMCAqIHApICsgMjY4LzI1LjBcblxuICBCb3VuY2VFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiBAQm91bmNlRWFzZUluKHAqMilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMC41ICogQEJvdW5jZUVhc2VPdXQocCAqIDIgLSAxKSArIDAuNVxuXG5cbmNsYXNzIFNQQUNFLlNjZW5lIGV4dGVuZHMgVEhSRUUuU2NlbmVcbiAgIyBwYXVzZWQ6IGZhbHNlXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcblxuICAgIEB0eXBlICAgICAgICAgICAgID0gJ1NjZW5lJ1xuICAgIEBmb2cgICAgICAgICAgICAgID0gbnVsbFxuICAgIEBvdmVycmlkZU1hdGVyaWFsID0gbnVsbFxuICAgIEBhdXRvVXBkYXRlICAgICAgID0gdHJ1ZVxuXG4gIHVwZGF0ZTogKGRlbHRhKS0+XG4gICAgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuICAgICAgQHVwZGF0ZU9iaihjaGlsZCwgZGVsdGEpXG5cbiAgdXBkYXRlT2JqOiAob2JqLCBkZWx0YSktPlxuICAgIG9iai51cGRhdGUoZGVsdGEpIGlmIHR5cGVvZiBvYmoudXBkYXRlID09ICdmdW5jdGlvbidcbiAgICBpZiBvYmouaGFzT3duUHJvcGVydHkoJ2NoaWxkcmVuJykgYW5kIG9iai5jaGlsZHJlbi5sZW5ndGggPiAwXG4gICAgICBmb3IgY2hpbGQgaW4gb2JqLmNoaWxkcmVuXG4gICAgICAgIEB1cGRhdGVPYmooY2hpbGQsIGRlbHRhKVxuXG4gIHJlc2l6ZTogPT5cbiAgICBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG4gICAgICBAcmVzaXplT2JqKGNoaWxkKVxuXG4gIHJlc2l6ZU9iajogKG9iaiktPlxuICAgIG9iai5yZXNpemUoKSBpZiB0eXBlb2Ygb2JqLnJlc2l6ZSA9PSAnZnVuY3Rpb24nXG4gICAgaWYgb2JqLmhhc093blByb3BlcnR5KCdjaGlsZHJlbicpIGFuZCBvYmouY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgICAgZm9yIGNoaWxkIGluIG9iai5jaGlsZHJlblxuICAgICAgICBAcmVzaXplT2JqKGNoaWxkKVxuXG4gIHJlc3VtZTogLT5cbiAgICBAcGF1c2VkID0gZmFsc2VcblxuICBwYXVzZTogLT5cbiAgICBAcGF1c2VkID0gdHJ1ZVxuXG4gIGlzUGF1c2VkOiAtPlxuICAgIHJldHVybiBAcGF1c2VkXG5cblxuY2xhc3MgU1BBQ0UuU2NlbmVNYW5hZ2VyXG5cbiAgY3VycmVudFNjZW5lOiBudWxsXG4gIF9zY2VuZXM6IG51bGxcbiAgX3N0YXRzOiBudWxsXG4gIF9jbG9jazogbnVsbFxuICBfdGljazogMFxuXG4gIHJlbmRlcmVyOiBudWxsXG4gIGNhbWVyYTogICBudWxsXG5cbiAgY29uc3RydWN0b3I6ICh3aWR0aCwgaGVpZ2h0KS0+XG4gICAgaWYgKEByZW5kZXJlcikgdGhlbiByZXR1cm4gQFxuXG4gICAgQF9jbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpXG5cbiAgICBAX3NjZW5lcyAgID0gW11cblxuICAgIEBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApXG4gICAgQGNhbWVyYS5wb3NpdGlvbi5zZXRaKDYwMClcbiAgICAjIEBjYW1lcmEucG9zaXRpb24uc2V0WSg1MDApXG4gICAgIyBAY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSlcblxuICAgIEByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHthbnRpYWxpYXM6IHRydWUsIGFscGhhOiBmYWxzZX0pXG4gICAgQHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pXG4gICAgIyBAcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg1OGIxZmYpKVxuICAgIEByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgIyBAcmVuZGVyZXIuc2hhZG93TWFwRW5hYmxlZCA9IHRydWVcbiAgICAjIEByZW5kZXJlci5zaGFkb3dNYXBTb2Z0ICAgID0gdHJ1ZVxuICAgICMgQHJlbmRlcmVyLnNoYWRvd01hcFR5cGUgICAgPSBUSFJFRS5QQ0ZTaGFkb3dNYXBcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpLmFwcGVuZENoaWxkKEByZW5kZXJlci5kb21FbGVtZW50KVxuXG4gICAgQF9zZXR1cFN0YXRzKCkgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcblxuICAgIEBfcmVuZGVyKClcbiAgICBAX3VwZGF0ZSgpXG5cbiAgICB3aW5kb3cub25yZXNpemUgPSA9PlxuICAgICAgQHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiAgICAgIEBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgIEBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG5cbiAgX3NldHVwU3RhdHM6IC0+XG4gICAgQF9zdGF0cyA9IG5ldyBTdGF0cygpXG4gICAgQF9zdGF0cy5zZXRNb2RlKDApXG4gICAgQF9zdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgIEBfc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCdcbiAgICBAX3N0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBAX3N0YXRzLmRvbUVsZW1lbnQgKVxuXG4gIF9yZW5kZXI6ID0+XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShAX3JlbmRlcilcblxuICAgIGlmICFAY3VycmVudFNjZW5lIG9yIEBjdXJyZW50U2NlbmUuaXNQYXVzZWQoKVxuICAgICAgICByZXR1cm5cblxuICAgICMgYyA9IERhdGUubm93KClcbiAgICBAY3VycmVudFNjZW5lLnVwZGF0ZShAX2Nsb2NrLmdldERlbHRhKCkgKiAxMDAwKVxuICAgICMgQGN1cnJlbnRTY2VuZS51cGRhdGUoYyAtIEBfdGljayk7XG4gICAgIyBAX3RpY2sgPSBjXG5cbiAgICBAcmVuZGVyZXIucmVuZGVyKCBAY3VycmVudFNjZW5lLCBAY2FtZXJhIClcblxuICAgIEBfc3RhdHMudXBkYXRlKCkgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcblxuICBfdXBkYXRlOiA9PlxuICAgICMgc2V0VGltZW91dChAX3VwZGF0ZSwgMTAwMCAvIFNQQUNFLkZQUylcblxuICAgICMgaWYgIUBjdXJyZW50U2NlbmUgb3IgQGN1cnJlbnRTY2VuZS5pc1BhdXNlZCgpXG4gICAgIyAgICAgcmV0dXJuXG5cbiAgICAjIGMgPSBEYXRlLm5vdygpXG4gICAgIyAjIEBjdXJyZW50U2NlbmUudXBkYXRlKEBfY2xvY2suZ2V0RGVsdGEoKSlcbiAgICAjIEBjdXJyZW50U2NlbmUudXBkYXRlKGMgLSBAX3RpY2spO1xuICAgICMgY29uc29sZS5sb2cgYyAtIEBfdGlja1xuICAgICMgQF90aWNrID0gY1xuXG4gIGNyZWF0ZVNjZW5lOiAoaWRlbnRpZmllciwgYVNjZW5lLCBpbnRlcmFjdGl2ZSktPlxuICAgIGlmIEBfc2NlbmVzW2lkZW50aWZpZXJdXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgIHNjZW5lID0gbmV3IGFTY2VuZSgpXG4gICAgQF9zY2VuZXNbaWRlbnRpZmllcl0gPSBzY2VuZVxuXG4gICAgcmV0dXJuIHNjZW5lXG5cbiAgZ29Ub1NjZW5lOiAoaWRlbnRpZmllciktPlxuICAgICQod2luZG93KS5vZmYoJ3Jlc2l6ZScsIEBjdXJyZW50U2NlbmUucmVzaXplKSBpZiBAY3VycmVudFNjZW5lXG4gICAgaWYgQF9zY2VuZXNbaWRlbnRpZmllcl1cbiAgICAgICAgQGN1cnJlbnRTY2VuZS5wYXVzZSgpIGlmIEBjdXJyZW50U2NlbmVcbiAgICAgICAgQGN1cnJlbnRTY2VuZSA9IEBfc2NlbmVzW2lkZW50aWZpZXJdXG4gICAgICAgIEBjdXJyZW50U2NlbmUucmVzdW1lKClcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBAY3VycmVudFNjZW5lLnJlc2l6ZSlcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgIHJldHVybiBmYWxzZVxuXG5cbmNsYXNzIFNQQUNFLk1haW5TY2VuZSBleHRlbmRzIFNQQUNFLlNjZW5lXG5cbiAgZXF1YWxpemVyOiBudWxsXG4gIGp1a2Vib3g6ICAgbnVsbFxuXG4gIGxvYWRpbmdNYW5hZ2VyOiBudWxsXG4gIGxvYWRlcjogICAgICAgICBudWxsXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcblxuICAgIEBfZXZlbnRzKClcbiAgICBAc2V0dXAoKVxuXG4gICAgIyAjIENyZWF0ZSBhIFNDIHNpbmdsZXRvblxuICAgICMgdW5sZXNzIFNQQUNFLmhhc093blByb3BlcnR5KCdTQycpXG4gICAgIyAgIFNQQUNFLlNDID0gbmV3IFNQQUNFLlNvdW5kQ2xvdWQoU1BBQ0UuU09VTkRDTE9VRC5pZCwgU1BBQ0UuU09VTkRDTE9VRC5yZWRpcmVjdF91cmkpXG4gICAgIyBAU0MgPSBTUEFDRS5TQ1xuXG4gICAgIyBAc2V0dXAoKSBpZiBAU0MuaXNDb25uZWN0ZWQoKVxuXG4gICAgQGVudiA9IG5ldyBTUEFDRS5ERUZBVUxULlNldHVwKClcbiAgICBAZW52Lm9uRW50ZXIoKVxuICAgIEBhZGQoQGVudilcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU291bmRDbG91ZC5JU19DT05ORUNURUQudHlwZSwgQHNldHVwKVxuXG4gIHNldHVwOiA9PlxuICAgIFNQQUNFLkp1a2Vib3ggICAgICAgICA9IG5ldyBTUEFDRS5KdWtlYm94KHRoaXMpXG4gICAgQGp1a2Vib3ggICAgICAgICAgICAgID0gU1BBQ0UuSnVrZWJveFxuICAgIEBqdWtlYm94LndoaWxlcGxheWluZyA9IEBfd2hpbGVwbGF5aW5nXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cbiAgICBzdXBlcihkZWx0YSlcbiAgICBAanVrZWJveC51cGRhdGUoZGVsdGEpIGlmIEBqdWtlYm94XG5cblxuY2xhc3MgU1BBQ0UuU291bmRDbG91ZFxuXG4gIGNsaWVudF9pZDogICAgbnVsbFxuICByZWRpcmVjdF91cmk6IG51bGxcbiAgdG9rZW46ICAgICAgICBudWxsXG5cbiAgY29uc3RydWN0b3I6IChpZCwgcmVkaXJlY3RfdXJpKS0+XG4gICAgU0MuaW5pdGlhbGl6ZSh7XG4gICAgICBjbGllbnRfaWQ6IGlkXG4gICAgICByZWRpcmVjdF91cmk6IHJlZGlyZWN0X3VyaVxuICAgIH0pXG5cbiAgICBAY2xpZW50X2lkICAgID0gaWRcbiAgICBAcmVkaXJlY3RfdXJpID0gcmVkaXJlY3RfdXJpXG5cbiAgICAjIHNvdW5kTWFuYWdlci5zZXR1cCh7XG4gICAgIyAgIHVybDpcbiAgICAjICAgYXV0b1BsYXk6IHRydWVcbiAgICAjICAgdXNlV2F2ZWZvcm1EYXRhOiB0cnVlXG4gICAgIyAgIHVzZUhUTUw1YXVkaW86IHRydWVcbiAgICAjICAgcHJlZmVyRmxhc2g6IGZhbHNlXG4gICAgIyAgIGZsYXNoOU9wdGlvbnM6XG4gICAgIyAgICAgdXNlV2F2ZWZvcm1EYXRhOiB0cnVlXG4gICAgIyB9KVxuXG4gIGlzQ29ubmVjdGVkOiAtPlxuICAgIGlmIChkb2N1bWVudC5jb29raWUucmVwbGFjZSgvKD86KD86XnwuKjtcXHMqKXNvdW5kY2xvdWRfY29ubmVjdGVkXFxzKlxcPVxccyooW147XSopLiokKXxeLiokLywgXCIkMVwiKSAhPSBcInRydWVcIilcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbicpLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ2luJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBAX2VDbGljaylcbiAgICBlbHNlXG4gICAgICBAdG9rZW4gPSBkb2N1bWVudC5jb29raWUucmVwbGFjZSgvKD86KD86XnwuKjtcXHMqKXNvdW5kY2xvdWRfdG9rZW5cXHMqXFw9XFxzKihbXjtdKikuKiQpfF4uKiQvLCBcIiQxXCIpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIF9lQ2xpY2s6ID0+XG4gICAgU0MuY29ubmVjdCg9PlxuICAgICAgQHRva2VuICAgICAgICAgID0gU0MuYWNjZXNzVG9rZW4oKVxuICAgICAgZG9jdW1lbnQuY29va2llID0gXCJzb3VuZGNsb3VkX3Rva2VuPVwiICsgQHRva2VuXG4gICAgICBkb2N1bWVudC5jb29raWUgPSBcInNvdW5kY2xvdWRfY29ubmVjdGVkPXRydWVcIlxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ2luJykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gICAgICBIRUxQRVIudHJpZ2dlcihFVkVOVC5Tb3VuZENsb3VkLklTX0NPTk5FQ1RFRClcbiAgICApXG5cbiAgcGF0aE9yVXJsOiAocGF0aCwgY2FsbGJhY2spLT5cbiAgICAjIFZlcmlmeSBpZiBpdCdzIGFuIElEIG9yIGFuIFVSTFxuICAgIGlmIC9eXFwvKHBsYXlsaXN0c3x0cmFja3N8dXNlcnMpXFwvWzAtOV0rJC8udGVzdChwYXRoKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKHBhdGgpXG5cbiAgICB1bmxlc3MgL14oaHR0cHxodHRwcykvLnRlc3QocGF0aClcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyBcIlxcXCJcIiArIHBhdGggKyBcIlxcXCIgaXMgbm90IGFuIHVybCBvciBhIHBhdGhcIlxuXG4gICAgU0MuZ2V0KCcvcmVzb2x2ZScsIHsgdXJsOiBwYXRoIH0sICh0cmFjaywgZXJyb3IpPT5cbiAgICAgIGlmIChlcnJvcilcbiAgICAgICAgY29uc29sZS5sb2cgZXJyb3IubWVzc2FnZVxuICAgICAgICBjYWxsYmFjayhlcnJvci5tZXNzYWdlLCBlcnJvcilcbiAgICAgIGVsc2VcbiAgICAgICAgdXJsID0gWycnLCB0cmFjay5raW5kKydzJywgdHJhY2suaWRdLmpvaW4oJy8nKVxuICAgICAgICBjYWxsYmFjayh1cmwpXG4gICAgKVxuXG4gIHN0cmVhbVNvdW5kOiAob2JqZWN0LCBvcHRpb25zPXt9LCBjYWxsYmFjayktPlxuICAgIGlmIG9iamVjdCBhbmQgb2JqZWN0Lmhhc093blByb3BlcnR5KCdraW5kJylcbiAgICAgIHBhdGggPSBvYmplY3QudXJpLnJlcGxhY2UoJ2h0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tJywgJycpXG5cbiAgICAgIGRlZmF1bHRzID1cbiAgICAgICAgYXV0b1BsYXk6IHRydWVcbiAgICAgICAgdXNlV2F2ZWZvcm1EYXRhOiB0cnVlXG4gICAgICAgIHVzZUhUTUw1YXVkaW86IHRydWVcbiAgICAgICAgcHJlZmVyRmxhc2g6IGZhbHNlXG5cbiAgICAgIG9wdGlvbnMgPSBfQ29mZmVlLm1lcmdlKGRlZmF1bHRzLCBvcHRpb25zKVxuICAgICAgU0Muc3RyZWFtKHBhdGgsIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgICAgIyBzb3VuZE1hbmFnZXIuZmxhc2g5T3B0aW9ucy51c2VXYXZlZm9ybURhdGEgPSB0cnVlXG5cbiAgICAgICMgQGdldFNvdW5kVXJsKHBhdGgsICh1cmwpLT5cbiAgICAgICMgICBvcHRpb25zLnVybCA9IHVybFxuICAgICAgIyAgIHNvdW5kID0gc291bmRNYW5hZ2VyLmNyZWF0ZVNvdW5kKG9wdGlvbnMpXG4gICAgICAjICAgY2FsbGJhY2soc291bmQpXG4gICAgICAjIClcblxuICBnZXRTb3VuZE9yUGxheWxpc3Q6IChwYXRoLCBjYWxsYmFjayktPlxuICAgIGlmIHR5cGVvZiBwYXRoID09ICdvYmplY3QnIGFuZCBwYXRoLmhhc093blByb3BlcnR5KCdraW5kJylcbiAgICAgIGNhbGxiYWNrKHBhdGgpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgQHBhdGhPclVybChwYXRoLCAocGF0aCwgZXJyb3IpPT5cbiAgICAgIGlmIGVycm9yXG4gICAgICAgIGNhbGxiYWNrKHBhdGgsIGVycm9yKVxuICAgICAgICByZXR1cm5cbiAgICAgIEBnZXQocGF0aCwgY2FsbGJhY2spXG4gICAgKVxuXG4gIGdldDogKHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgU0MuZ2V0KHBhdGgsIGNhbGxiYWNrKVxuXG4gIGdldFNvdW5kVXJsOiAocGF0aCwgY2FsbGJhY2spLT5cbiAgICBAZ2V0U291bmRPclBsYXlsaXN0KHBhdGgsIChzb3VuZCk9PlxuICAgICAgY2FsbGJhY2soc291bmQuc3RyZWFtX3VybCsnP29hdXRoX3Rva2VuPScrQHRva2VuKVxuICAgIClcblxuICBzZWFyY2g6IChzZWFyY2gsIHBhdGgsIGNhbGxiYWNrKS0+XG4gICAgaWYgdHlwZW9mIHBhdGggPT0gJ2Z1bmN0aW9uJ1xuICAgICAgY2FsbGJhY2sgPSBwYXRoXG4gICAgICBwYXRoICAgICA9ICd0cmFja3MnXG5cbiAgICBpZiBwYXRoID09ICd1c2VycydcbiAgICAgIEBwYXRoT3JVcmwoJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vJytzZWFyY2gsIChwYXRoLCBlcnJvcik9PlxuICAgICAgICBpZiBlcnJvclxuICAgICAgICAgIGNhbGxiYWNrKHBhdGgsIGVycm9yKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHBhdGggPSBwYXRoKycvZmF2b3JpdGVzP29hdXRoX3Rva2VuPScrQHRva2VuXG4gICAgICAgIFNDLmdldChwYXRoLCBjYWxsYmFjaylcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBwYXRoID0gJy8nK3BhdGgrJz9vYXV0aF90b2tlbj0nK0B0b2tlbisnJnE9JytzZWFyY2hcbiAgICAgIFNDLmdldChwYXRoLCBjYWxsYmFjaylcblxuXG5jbGFzcyBTUEFDRS5TZWFyY2hFbmdpbmVcbiAgU0M6IG51bGxcbiAganVrZWJveDogbnVsbFxuXG4gICMgSFRNTFxuICBpbnB1dDogICAgICAgICBudWxsXG4gIGxpc3Q6ICAgICAgICAgIG51bGxcbiAgbGlzdENvbnRhaW5lcjogbnVsbFxuICBlbDogICAgICAgICAgICBudWxsXG4gIGxpbmVIZWlnaHQ6ICAgIDBcbiAgcmVzdWx0c0hlaWdodDogMFxuICByZXN1bHRzOiAgICAgICBudWxsXG4gIGZvY3VzZWQ6ICAgICAgIG51bGxcblxuICBzY3JvbGxQb3M6ICAgICAwXG5cbiAgQHN0YXRlOiAgbnVsbFxuXG5cbiAgY29uc3RydWN0b3I6IChqdWtlYm94KS0+XG4gICAgQGp1a2Vib3ggICAgICAgPSBqdWtlYm94XG4gICAgQFNDICAgICAgICAgICAgPSBTUEFDRS5TQ1xuXG4gICAgQGVsICAgICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoJylcbiAgICBAaW5wdXQgICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2ggZm9ybSBpbnB1dCcpXG4gICAgQGxpc3QgICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoIC5saXN0JylcbiAgICBAbGlzdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2ggdWwnKVxuXG4gICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEKVxuICAgIEBfZXZlbnRzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2ggZm9ybScpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIEBfZUp1a2Vib3hJc1NlYXJjaGluZylcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIEBfZUtleXByZXNzKVxuXG4gIF9lSnVrZWJveElzU2VhcmNoaW5nOiAoZSk9PlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEBzZWFyY2goQGlucHV0LnZhbHVlKSBpZiBAaW5wdXQudmFsdWUubGVuZ3RoID4gMFxuXG4gIF9lS2V5cHJlc3M6IChlKT0+XG4gICAgc3dpdGNoKGUua2V5Q29kZSlcbiAgICAgIHdoZW4gRU5VTS5LZXlib2FyZC5FTlRFUlxuICAgICAgICBpZiBAaW5wdXQudmFsdWUubGVuZ3RoID09IDBcbiAgICAgICAgICBpZiBAc3RhdGUgPT0gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRURcbiAgICAgICAgICAgIEBzZXRTdGF0ZShFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLk9QRU5FRClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc2V0U3RhdGUoRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5DTE9TRUQpXG4gICAgICAgIGVsc2UgaWYgQHN0YXRlID09IEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIIGFuZCBAZm9jdXNlZFxuICAgICAgICAgIEBzZXRTdGF0ZShFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEXG4gICAgICAgICAgQGFkZCgpXG5cbiAgICAgIHdoZW4gRU5VTS5LZXlib2FyZC5VUFxuICAgICAgICBAdXAoKSBpZiBAc3RhdGUgPT0gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcblxuICAgICAgd2hlbiBFTlVNLktleWJvYXJkLkRPV05cbiAgICAgICAgQGRvd24oKSBpZiBAc3RhdGUgPT0gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcblxuICAgICAgd2hlbiBFTlVNLktleWJvYXJkLkVTQywgRU5VTS5LZXlib2FyZC5ERUxFVEVcbiAgICAgICAgaWYgQHN0YXRlID09IEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIXG4gICAgICAgICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuT1BFTkVEKVxuICAgICAgICBlbHNlIGlmIEBzdGF0ZSA9PSBFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlRSQUNLX1NFTEVDVEVEXG4gICAgICAgICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuQ0xPU0VEKVxuXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gIHNldFN0YXRlOiAoc3RhdGUpLT5cbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIHN3aXRjaCBAc3RhdGVcbiAgICAgIHdoZW4gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5PUEVORURcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIEBlbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWFyY2hfb3BlbicpXG5cbiAgICAgICAgQGlucHV0LnZhbHVlICAgID0gJydcbiAgICAgICAgQGlucHV0LmRpc2FibGVkID0gZmFsc2VcbiAgICAgICAgQGlucHV0LmZvY3VzKClcblxuICAgICAgICBAcmVzZXQoKVxuICAgICAgd2hlbiBFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLkNMT1NFRFxuICAgICAgICBAZWwuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICAgIHdoZW4gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5TRUFSQ0hcbiAgICAgICAgQGVsLmNsYXNzTGlzdC5hZGQoJ3NlYXJjaF9vcGVuJylcblxuICAgICAgICBAaW5wdXQuZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgIEBpbnB1dC5ibHVyKClcblxuICAgICAgICBAbGluZUhlaWdodCAgICA9IEBsaXN0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2xpJykub2Zmc2V0SGVpZ2h0XG4gICAgICAgIEByZXN1bHRzSGVpZ2h0ID0gQGxpbmVIZWlnaHQgKiAoQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGgtMSlcblxuICAgICAgICBAZm9jdXNlZC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpIGlmIEBmb2N1c2VkXG4gICAgICAgIEBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpdGVtX3NlbGVjdGVkJylcbiAgICAgIHdoZW4gRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5UUkFDS19TRUxFQ1RFRFxuICAgICAgICBAZm9jdXNlZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgICAgIEBlbC5jbGFzc0xpc3QuYWRkKCdpdGVtX3NlbGVjdGVkJylcblxuICB1cDogLT5cbiAgICBuZXh0ID0gQHNjcm9sbFBvcyArIEBsaW5lSGVpZ2h0XG4gICAgaWYgbmV4dCA8PSAwXG4gICAgICBAc2Nyb2xsUG9zID0gbmV4dFxuICAgICAgQGZvY3VzKClcblxuICBkb3duOiAtPlxuICAgIG5leHQgPSBAc2Nyb2xsUG9zIC0gQGxpbmVIZWlnaHRcbiAgICBpZiBNYXRoLmFicyhuZXh0KSA8PSBAcmVzdWx0c0hlaWdodFxuICAgICAgQHNjcm9sbFBvcyA9IG5leHRcbiAgICAgIEBmb2N1cygpXG5cbiAgZm9jdXM6ID0+XG4gICAgaWYgQGxpc3RDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGggPiAxXG4gICAgICAkKFtAbGlzdENvbnRhaW5lciwgQGlucHV0XSkuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsICcrQHNjcm9sbFBvcysncHgpJylcbiAgICAgIHBvcyA9IChAc2Nyb2xsUG9zKi0xKSAvIChAcmVzdWx0c0hlaWdodCAvIChAbGlzdENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdsaScpLmxlbmd0aC0xKSlcbiAgICAgIHBvcyA9IE1hdGguZmxvb3IocG9zKVxuICAgICAgZWxtID0gQGVsLnF1ZXJ5U2VsZWN0b3IoJ2xpOm50aC1jaGlsZCgnKyhwb3MrMSkrJyknKVxuXG4gICAgICBpZiBlbG0uZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JylcbiAgICAgICAgQGZvY3VzZWQuY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXNlZCcpIGlmIEBmb2N1c2VkXG4gICAgICAgIEBmb2N1c2VkID0gZWxtXG4gICAgICAgIEBmb2N1c2VkLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzZWQnKVxuICAgICAgZWxzZVxuICAgICAgICBAZm9jdXNlZCA9IG51bGxcbiAgICBlbHNlXG4gICAgICBAc2V0U3RhdGUoRU5VTS5TZWFyY2hFbmdpbmVTdGF0ZS5PUEVORUQpXG4gICAgICAjICQoW0BsaXN0Q29udGFpbmVyLCBAaW5wdXRdKS5jc3MoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKVxuXG4gIHJlc2V0OiAtPlxuICAgIEBmb2N1c2VkICAgPSBudWxsXG4gICAgQHNjcm9sbFBvcyA9IDBcbiAgICAkKFtAbGlzdENvbnRhaW5lciwgQGlucHV0XSkuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsICcrQHNjcm9sbFBvcysncHgpJylcbiAgICBAbGlzdENvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuXG4gIGFkZDogLT5cbiAgICBpbmRleCA9IEBmb2N1c2VkLmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpXG4gICAgdHJhY2sgPSBAcmVzdWx0c1tpbmRleF1cbiAgICBAanVrZWJveC5hZGQodHJhY2spIGlmIHRyYWNrXG5cbiAgICBAZm9jdXNlZC5jbGFzc0xpc3QuYWRkKCdhZGRlZCcpXG4gICAgJChAZm9jdXNlZCkuY3NzKHtcbiAgICAgICd0cmFuc2Zvcm0nOiAnc2NhbGUoLjc1KSB0cmFuc2xhdGVYKCcrd2luZG93LmlubmVyV2lkdGgrJ3B4KSdcbiAgICB9KVxuXG4gICAgc2V0VGltZW91dCg9PlxuICAgICAgQGZvY3VzZWQucmVtb3ZlKClcbiAgICAgIEBzZXRTdGF0ZShFTlVNLlNlYXJjaEVuZ2luZVN0YXRlLlNFQVJDSClcbiAgICAgIEB1cCgpIGlmIEBmb2N1c2VkLm5leHRTaWJsaW5nXG4gICAgICBAZm9jdXMoKVxuICAgICwgNTAwKVxuXG4gIHNlYXJjaDogKHZhbHVlKS0+XG4gICAgcGF0aCA9IHZhbHVlLnNwbGl0KC9cXHMvKVswXVxuICAgIGlmIC9eKHRyYWNrfHRyYWNrc3xwbGF5bGlzdHxwbGF5bGlzdHN8c2V0fHNldHN8dXNlcnx1c2VycykkLy50ZXN0KHBhdGgpXG4gICAgICBsYXN0Q2hhciA9IHBhdGguY2hhckF0KHBhdGgubGVuZ3RoLTEpXG4gICAgICB2YWx1ZSAgICA9IHZhbHVlLnJlcGxhY2UocGF0aCsnICcsICcnKVxuICAgICAgcGF0aCAgICAgKz0gJ3MnIGlmIGxhc3RDaGFyICE9ICdzJ1xuICAgICAgcGF0aCAgICAgPSAncGxheWxpc3RzJyBpZiAvc2V0cy8udGVzdChwYXRoKVxuICAgIGVsc2VcbiAgICAgIHBhdGggICAgID0gJ3RyYWNrcydcblxuICAgIHN0cmluZyA9ICcnJ1xuICAgICAgW1xuICAgICAgICB7XCJraW5kXCI6XCJ0cmFja1wiLFwiaWRcIjo2MzI1NjkwNixcImNyZWF0ZWRfYXRcIjpcIjIwMTIvMTAvMTMgMTA6NDc6MTYgKzAwMDBcIixcInVzZXJfaWRcIjo3ODgyMDUsXCJkdXJhdGlvblwiOjIzNzg0MCxcImNvbW1lbnRhYmxlXCI6dHJ1ZSxcInN0YXRlXCI6XCJmaW5pc2hlZFwiLFwib3JpZ2luYWxfY29udGVudF9zaXplXCI6OTU0MzE2OCxcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTIvMjIgMjE6MDE6MTcgKzAwMDBcIixcInNoYXJpbmdcIjpcInB1YmxpY1wiLFwidGFnX2xpc3RcIjpcIlwiLFwicGVybWFsaW5rXCI6XCJqYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcInN0cmVhbWFibGVcIjp0cnVlLFwiZW1iZWRkYWJsZV9ieVwiOlwiYWxsXCIsXCJkb3dubG9hZGFibGVcIjp0cnVlLFwicHVyY2hhc2VfdXJsXCI6XCJodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9pZFwiOm51bGwsXCJwdXJjaGFzZV90aXRsZVwiOlwiQWx0ZXJuYXRlIFZlcnNpb24gRExcIixcImdlbnJlXCI6XCJQb3Bsb2NraW4gTXVzaWNcIixcInRpdGxlXCI6XCJKYW5ldCBKYWNrc29uIC0gSWYgKEtheXRyYW5hZGEgUmVtaXgpXCIsXCJkZXNjcmlwdGlvblwiOlwiQWx0ZXJuYXRlIFZlcnNpb24sIGZvciBESnMsIHdlbGwsIHRoYXRzIHRoZSB2ZXJzaW9uIGkgdXNlIGZvciBteSBkaiBzZXRzOyBodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9uYW1lXCI6XCJcIixcInJlbGVhc2VcIjpcIlwiLFwidHJhY2tfdHlwZVwiOlwicmVtaXhcIixcImtleV9zaWduYXR1cmVcIjpcIlwiLFwiaXNyY1wiOlwiXCIsXCJ2aWRlb191cmxcIjpudWxsLFwiYnBtXCI6bnVsbCxcInJlbGVhc2VfeWVhclwiOm51bGwsXCJyZWxlYXNlX21vbnRoXCI6bnVsbCxcInJlbGVhc2VfZGF5XCI6bnVsbCxcIm9yaWdpbmFsX2Zvcm1hdFwiOlwibXAzXCIsXCJsaWNlbnNlXCI6XCJhbGwtcmlnaHRzLXJlc2VydmVkXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNlwiLFwidXNlclwiOntcImlkXCI6Nzg4MjA1LFwia2luZFwiOlwidXNlclwiLFwicGVybWFsaW5rXCI6XCJrYXl0cmFuYWRhXCIsXCJ1c2VybmFtZVwiOlwiS0FZVFJBTkFEQVwiLFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMS8wNyAwNDoxMTozNiArMDAwMFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS91c2Vycy83ODgyMDVcIixcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhXCIsXCJhdmF0YXJfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAwNzQ4MDM2OTQtcWlieHQ0LWxhcmdlLmpwZ1wifSxcInVzZXJfcGxheWJhY2tfY291bnRcIjoxLFwidXNlcl9mYXZvcml0ZVwiOnRydWUsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYS9qYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcImFydHdvcmtfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtMDAwMDMyMDk0NTk3LTU2dHM3bi1sYXJnZS5qcGdcIixcIndhdmVmb3JtX3VybFwiOlwiaHR0cHM6Ly93MS5zbmRjZG4uY29tL2FxUkdpNERtYkNXel9tLnBuZ1wiLFwic3RyZWFtX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L3N0cmVhbVwiLFwiZG93bmxvYWRfdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvZG93bmxvYWRcIixcInBsYXliYWNrX2NvdW50XCI6MzMzMTAzMyxcImRvd25sb2FkX2NvdW50XCI6OTYxMTIsXCJmYXZvcml0aW5nc19jb3VudFwiOjY2NjUzLFwiY29tbWVudF9jb3VudFwiOjE1OTQsXCJhdHRhY2htZW50c191cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9hdHRhY2htZW50c1wiLFwicG9saWN5XCI6XCJBTExPV1wifSxcbiAgICAgICAge1wia2luZFwiOlwidHJhY2tcIixcImlkXCI6NjMyNTY5MDYsXCJjcmVhdGVkX2F0XCI6XCIyMDEyLzEwLzEzIDEwOjQ3OjE2ICswMDAwXCIsXCJ1c2VyX2lkXCI6Nzg4MjA1LFwiZHVyYXRpb25cIjoyMzc4NDAsXCJjb21tZW50YWJsZVwiOnRydWUsXCJzdGF0ZVwiOlwiZmluaXNoZWRcIixcIm9yaWdpbmFsX2NvbnRlbnRfc2l6ZVwiOjk1NDMxNjgsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzEyLzIyIDIxOjAxOjE3ICswMDAwXCIsXCJzaGFyaW5nXCI6XCJwdWJsaWNcIixcInRhZ19saXN0XCI6XCJcIixcInBlcm1hbGlua1wiOlwiamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJzdHJlYW1hYmxlXCI6dHJ1ZSxcImVtYmVkZGFibGVfYnlcIjpcImFsbFwiLFwiZG93bmxvYWRhYmxlXCI6dHJ1ZSxcInB1cmNoYXNlX3VybFwiOlwiaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfaWRcIjpudWxsLFwicHVyY2hhc2VfdGl0bGVcIjpcIkFsdGVybmF0ZSBWZXJzaW9uIERMXCIsXCJnZW5yZVwiOlwiUG9wbG9ja2luIE11c2ljXCIsXCJ0aXRsZVwiOlwiSmFuZXQgSmFja3NvbiAtIElmIChLYXl0cmFuYWRhIFJlbWl4KVwiLFwiZGVzY3JpcHRpb25cIjpcIkFsdGVybmF0ZSBWZXJzaW9uLCBmb3IgREpzLCB3ZWxsLCB0aGF0cyB0aGUgdmVyc2lvbiBpIHVzZSBmb3IgbXkgZGogc2V0czsgaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy95dWExbGoxNnpzNDRyemwvSmFuZXQlMjBKYWNrc29uJTIwLSUyMElmJTIwS2F5dHJhbmFkYSUyMExpdmUlMjBTZXQlMjBWZXJzaW9uLm1wM1wiLFwibGFiZWxfbmFtZVwiOlwiXCIsXCJyZWxlYXNlXCI6XCJcIixcInRyYWNrX3R5cGVcIjpcInJlbWl4XCIsXCJrZXlfc2lnbmF0dXJlXCI6XCJcIixcImlzcmNcIjpcIlwiLFwidmlkZW9fdXJsXCI6bnVsbCxcImJwbVwiOm51bGwsXCJyZWxlYXNlX3llYXJcIjpudWxsLFwicmVsZWFzZV9tb250aFwiOm51bGwsXCJyZWxlYXNlX2RheVwiOm51bGwsXCJvcmlnaW5hbF9mb3JtYXRcIjpcIm1wM1wiLFwibGljZW5zZVwiOlwiYWxsLXJpZ2h0cy1yZXNlcnZlZFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDZcIixcInVzZXJcIjp7XCJpZFwiOjc4ODIwNSxcImtpbmRcIjpcInVzZXJcIixcInBlcm1hbGlua1wiOlwia2F5dHJhbmFkYVwiLFwidXNlcm5hbWVcIjpcIktBWVRSQU5BREFcIixcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTEvMDcgMDQ6MTE6MzYgKzAwMDBcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdXNlcnMvNzg4MjA1XCIsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYVwiLFwiYXZhdGFyX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2F2YXRhcnMtMDAwMDc0ODAzNjk0LXFpYnh0NC1sYXJnZS5qcGdcIn0sXCJ1c2VyX3BsYXliYWNrX2NvdW50XCI6MSxcInVzZXJfZmF2b3JpdGVcIjp0cnVlLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGEvamFuZXQtamFja3Nvbi1pZi1rYXl0cmFuYWRhXCIsXCJhcnR3b3JrX3VybFwiOlwiaHR0cHM6Ly9pMS5zbmRjZG4uY29tL2FydHdvcmtzLTAwMDAzMjA5NDU5Ny01NnRzN24tbGFyZ2UuanBnXCIsXCJ3YXZlZm9ybV91cmxcIjpcImh0dHBzOi8vdzEuc25kY2RuLmNvbS9hcVJHaTREbWJDV3pfbS5wbmdcIixcInN0cmVhbV91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9zdHJlYW1cIixcImRvd25sb2FkX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2Rvd25sb2FkXCIsXCJwbGF5YmFja19jb3VudFwiOjMzMzEwMzMsXCJkb3dubG9hZF9jb3VudFwiOjk2MTEyLFwiZmF2b3JpdGluZ3NfY291bnRcIjo2NjY1MyxcImNvbW1lbnRfY291bnRcIjoxNTk0LFwiYXR0YWNobWVudHNfdXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvYXR0YWNobWVudHNcIixcInBvbGljeVwiOlwiQUxMT1dcIn0sXG4gICAgICAgIHtcImtpbmRcIjpcInRyYWNrXCIsXCJpZFwiOjYzMjU2OTA2LFwiY3JlYXRlZF9hdFwiOlwiMjAxMi8xMC8xMyAxMDo0NzoxNiArMDAwMFwiLFwidXNlcl9pZFwiOjc4ODIwNSxcImR1cmF0aW9uXCI6MjM3ODQwLFwiY29tbWVudGFibGVcIjp0cnVlLFwic3RhdGVcIjpcImZpbmlzaGVkXCIsXCJvcmlnaW5hbF9jb250ZW50X3NpemVcIjo5NTQzMTY4LFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMi8yMiAyMTowMToxNyArMDAwMFwiLFwic2hhcmluZ1wiOlwicHVibGljXCIsXCJ0YWdfbGlzdFwiOlwiXCIsXCJwZXJtYWxpbmtcIjpcImphbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwic3RyZWFtYWJsZVwiOnRydWUsXCJlbWJlZGRhYmxlX2J5XCI6XCJhbGxcIixcImRvd25sb2FkYWJsZVwiOnRydWUsXCJwdXJjaGFzZV91cmxcIjpcImh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX2lkXCI6bnVsbCxcInB1cmNoYXNlX3RpdGxlXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiBETFwiLFwiZ2VucmVcIjpcIlBvcGxvY2tpbiBNdXNpY1wiLFwidGl0bGVcIjpcIkphbmV0IEphY2tzb24gLSBJZiAoS2F5dHJhbmFkYSBSZW1peClcIixcImRlc2NyaXB0aW9uXCI6XCJBbHRlcm5hdGUgVmVyc2lvbiwgZm9yIERKcywgd2VsbCwgdGhhdHMgdGhlIHZlcnNpb24gaSB1c2UgZm9yIG15IGRqIHNldHM7IGh0dHBzOi8vd3d3LmRyb3Bib3guY29tL3MveXVhMWxqMTZ6czQ0cnpsL0phbmV0JTIwSmFja3NvbiUyMC0lMjBJZiUyMEtheXRyYW5hZGElMjBMaXZlJTIwU2V0JTIwVmVyc2lvbi5tcDNcIixcImxhYmVsX25hbWVcIjpcIlwiLFwicmVsZWFzZVwiOlwiXCIsXCJ0cmFja190eXBlXCI6XCJyZW1peFwiLFwia2V5X3NpZ25hdHVyZVwiOlwiXCIsXCJpc3JjXCI6XCJcIixcInZpZGVvX3VybFwiOm51bGwsXCJicG1cIjpudWxsLFwicmVsZWFzZV95ZWFyXCI6bnVsbCxcInJlbGVhc2VfbW9udGhcIjpudWxsLFwicmVsZWFzZV9kYXlcIjpudWxsLFwib3JpZ2luYWxfZm9ybWF0XCI6XCJtcDNcIixcImxpY2Vuc2VcIjpcImFsbC1yaWdodHMtcmVzZXJ2ZWRcIixcInVyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2XCIsXCJ1c2VyXCI6e1wiaWRcIjo3ODgyMDUsXCJraW5kXCI6XCJ1c2VyXCIsXCJwZXJtYWxpbmtcIjpcImtheXRyYW5hZGFcIixcInVzZXJuYW1lXCI6XCJLQVlUUkFOQURBXCIsXCJsYXN0X21vZGlmaWVkXCI6XCIyMDE0LzExLzA3IDA0OjExOjM2ICswMDAwXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3VzZXJzLzc4ODIwNVwiLFwicGVybWFsaW5rX3VybFwiOlwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2theXRyYW5hZGFcIixcImF2YXRhcl91cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hdmF0YXJzLTAwMDA3NDgwMzY5NC1xaWJ4dDQtbGFyZ2UuanBnXCJ9LFwidXNlcl9wbGF5YmFja19jb3VudFwiOjEsXCJ1c2VyX2Zhdm9yaXRlXCI6dHJ1ZSxcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhL2phbmV0LWphY2tzb24taWYta2F5dHJhbmFkYVwiLFwiYXJ0d29ya191cmxcIjpcImh0dHBzOi8vaTEuc25kY2RuLmNvbS9hcnR3b3Jrcy0wMDAwMzIwOTQ1OTctNTZ0czduLWxhcmdlLmpwZ1wiLFwid2F2ZWZvcm1fdXJsXCI6XCJodHRwczovL3cxLnNuZGNkbi5jb20vYXFSR2k0RG1iQ1d6X20ucG5nXCIsXCJzdHJlYW1fdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvc3RyZWFtXCIsXCJkb3dubG9hZF91cmxcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9kb3dubG9hZFwiLFwicGxheWJhY2tfY291bnRcIjozMzMxMDMzLFwiZG93bmxvYWRfY291bnRcIjo5NjExMixcImZhdm9yaXRpbmdzX2NvdW50XCI6NjY2NTMsXCJjb21tZW50X2NvdW50XCI6MTU5NCxcImF0dGFjaG1lbnRzX3VyaVwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L2F0dGFjaG1lbnRzXCIsXCJwb2xpY3lcIjpcIkFMTE9XXCJ9LFxuICAgICAgICB7XCJraW5kXCI6XCJ0cmFja1wiLFwiaWRcIjo2MzI1NjkwNixcImNyZWF0ZWRfYXRcIjpcIjIwMTIvMTAvMTMgMTA6NDc6MTYgKzAwMDBcIixcInVzZXJfaWRcIjo3ODgyMDUsXCJkdXJhdGlvblwiOjIzNzg0MCxcImNvbW1lbnRhYmxlXCI6dHJ1ZSxcInN0YXRlXCI6XCJmaW5pc2hlZFwiLFwib3JpZ2luYWxfY29udGVudF9zaXplXCI6OTU0MzE2OCxcImxhc3RfbW9kaWZpZWRcIjpcIjIwMTQvMTIvMjIgMjE6MDE6MTcgKzAwMDBcIixcInNoYXJpbmdcIjpcInB1YmxpY1wiLFwidGFnX2xpc3RcIjpcIlwiLFwicGVybWFsaW5rXCI6XCJqYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcInN0cmVhbWFibGVcIjp0cnVlLFwiZW1iZWRkYWJsZV9ieVwiOlwiYWxsXCIsXCJkb3dubG9hZGFibGVcIjp0cnVlLFwicHVyY2hhc2VfdXJsXCI6XCJodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9pZFwiOm51bGwsXCJwdXJjaGFzZV90aXRsZVwiOlwiQWx0ZXJuYXRlIFZlcnNpb24gRExcIixcImdlbnJlXCI6XCJQb3Bsb2NraW4gTXVzaWNcIixcInRpdGxlXCI6XCJKYW5ldCBKYWNrc29uIC0gSWYgKEtheXRyYW5hZGEgUmVtaXgpXCIsXCJkZXNjcmlwdGlvblwiOlwiQWx0ZXJuYXRlIFZlcnNpb24sIGZvciBESnMsIHdlbGwsIHRoYXRzIHRoZSB2ZXJzaW9uIGkgdXNlIGZvciBteSBkaiBzZXRzOyBodHRwczovL3d3dy5kcm9wYm94LmNvbS9zL3l1YTFsajE2enM0NHJ6bC9KYW5ldCUyMEphY2tzb24lMjAtJTIwSWYlMjBLYXl0cmFuYWRhJTIwTGl2ZSUyMFNldCUyMFZlcnNpb24ubXAzXCIsXCJsYWJlbF9uYW1lXCI6XCJcIixcInJlbGVhc2VcIjpcIlwiLFwidHJhY2tfdHlwZVwiOlwicmVtaXhcIixcImtleV9zaWduYXR1cmVcIjpcIlwiLFwiaXNyY1wiOlwiXCIsXCJ2aWRlb191cmxcIjpudWxsLFwiYnBtXCI6bnVsbCxcInJlbGVhc2VfeWVhclwiOm51bGwsXCJyZWxlYXNlX21vbnRoXCI6bnVsbCxcInJlbGVhc2VfZGF5XCI6bnVsbCxcIm9yaWdpbmFsX2Zvcm1hdFwiOlwibXAzXCIsXCJsaWNlbnNlXCI6XCJhbGwtcmlnaHRzLXJlc2VydmVkXCIsXCJ1cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNlwiLFwidXNlclwiOntcImlkXCI6Nzg4MjA1LFwia2luZFwiOlwidXNlclwiLFwicGVybWFsaW5rXCI6XCJrYXl0cmFuYWRhXCIsXCJ1c2VybmFtZVwiOlwiS0FZVFJBTkFEQVwiLFwibGFzdF9tb2RpZmllZFwiOlwiMjAxNC8xMS8wNyAwNDoxMTozNiArMDAwMFwiLFwidXJpXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS91c2Vycy83ODgyMDVcIixcInBlcm1hbGlua191cmxcIjpcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9rYXl0cmFuYWRhXCIsXCJhdmF0YXJfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAwNzQ4MDM2OTQtcWlieHQ0LWxhcmdlLmpwZ1wifSxcInVzZXJfcGxheWJhY2tfY291bnRcIjoxLFwidXNlcl9mYXZvcml0ZVwiOnRydWUsXCJwZXJtYWxpbmtfdXJsXCI6XCJodHRwOi8vc291bmRjbG91ZC5jb20va2F5dHJhbmFkYS9qYW5ldC1qYWNrc29uLWlmLWtheXRyYW5hZGFcIixcImFydHdvcmtfdXJsXCI6XCJodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtMDAwMDMyMDk0NTk3LTU2dHM3bi1sYXJnZS5qcGdcIixcIndhdmVmb3JtX3VybFwiOlwiaHR0cHM6Ly93MS5zbmRjZG4uY29tL2FxUkdpNERtYkNXel9tLnBuZ1wiLFwic3RyZWFtX3VybFwiOlwiaHR0cHM6Ly9hcGkuc291bmRjbG91ZC5jb20vdHJhY2tzLzYzMjU2OTA2L3N0cmVhbVwiLFwiZG93bmxvYWRfdXJsXCI6XCJodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbS90cmFja3MvNjMyNTY5MDYvZG93bmxvYWRcIixcInBsYXliYWNrX2NvdW50XCI6MzMzMTAzMyxcImRvd25sb2FkX2NvdW50XCI6OTYxMTIsXCJmYXZvcml0aW5nc19jb3VudFwiOjY2NjUzLFwiY29tbWVudF9jb3VudFwiOjE1OTQsXCJhdHRhY2htZW50c191cmlcIjpcImh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3RyYWNrcy82MzI1NjkwNi9hdHRhY2htZW50c1wiLFwicG9saWN5XCI6XCJBTExPV1wifVxuICAgICAgXVxuICAgICcnJ1xuXG4gICAgcmVzdWx0cyA9IEpTT04ucGFyc2Uoc3RyaW5nKVxuXG4gICAgQGlucHV0LnZhbHVlID0gJ0xvb2tpbmcgZm9yIFwiJyt2YWx1ZSsnXCInXG4gICAgQFNDLnNlYXJjaCh2YWx1ZSwgcGF0aCwgKHJlc3VsdHMpPT5cbiAgICAgIGNvbnNvbGUubG9nIHJlc3VsdHNcbiAgICAgIGlmIHJlc3VsdHMubGVuZ3RoID09IDBcbiAgICAgICAgQGlucHV0LnZhbHVlID0gJ1wiJyt2YWx1ZSsnXCIgaGFzIG5vIHJlc3VsdCdcbiAgICAgICAgcmV0dXJuXG4gICAgICBlbHNlXG4gICAgICAgIEBpbnB1dC52YWx1ZSA9ICdSZXN1bHRzIGZvciBcIicrdmFsdWUrJ1wiJ1xuXG4gICAgICBAcmVzdWx0cyAgICAgPSBbXVxuICAgICAgQGxpc3RDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSlcbiAgICAgIGZvciB0cmFjaywgaSBpbiByZXN1bHRzXG4gICAgICAgIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgICAgICBsaS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBpKVxuXG4gICAgICAgIGFydHdvcmtfdXJsID0gdHJhY2suYXJ0d29ya191cmxcbiAgICAgICAgYXJ0d29ya191cmwgPSAnaW1hZ2VzL25vX2FydHdvcmsuZ2lmJyB1bmxlc3MgYXJ0d29ya191cmxcbiAgICAgICAgbGkuaW5uZXJIVE1MID0gXCJcIlwiXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiI3thcnR3b3JrX3VybH1cIiBhbHQ9XCJcIiBvbmVycm9yPVwidGhpcy5zcmM9J2ltYWdlcy9ub19hcnR3b3JrLmdpZidcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxwPiN7dHJhY2sudGl0bGV9PC9wPlxuICAgICAgICAgICAgICA8cD4je3RyYWNrLnVzZXIudXNlcm5hbWUudG9Mb3dlckNhc2UoKX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgXCJcIlwiXG4gICAgICAgIEByZXN1bHRzLnB1c2godHJhY2spXG4gICAgICAgIEBsaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKGxpKVxuICAgICAgQHNldFN0YXRlKEVOVU0uU2VhcmNoRW5naW5lU3RhdGUuU0VBUkNIKVxuICAgIClcblxuXG5jbGFzcyBTUEFDRS5KdWtlYm94XG5cbiAgIyMgRGF0YSBvYmplY3RzXG4gIFNDOiAgICAgICAgICAgbnVsbFxuICBjdXJyZW50OiAgICAgIG51bGxcbiAgYWlycG9ydDogICAgICBudWxsXG4gIHBsYXlsaXN0OiAgICAgbnVsbFxuICBzZWFyY2hFbmdpbmU6IG51bGxcbiAgd2F2ZWZvcm1EYXRhOiBudWxsXG5cbiAgIyMgVEhSRUVKUyBPYmplY3RzXG4gIHNjZW5lOiAgICAgICBudWxsXG4gIGVxdWFsaXplcjogICBudWxsXG4gIGdyb3VwOiAgICAgICBudWxsXG5cbiAgIyMgU1RBVEVTXG4gIHN0YXRlOiAgICAgICAgbnVsbFxuICBhaXJwb3J0U3RhdGU6IG51bGxcblxuICAjIyBPVEhFUlNcbiAgZGVsYXk6IDIwMDBcbiAgdGltZTogMFxuXG4gIGNvbnN0cnVjdG9yOiAoc2NlbmUpLT5cbiAgICBAc2NlbmUgPSBzY2VuZVxuICAgIEBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpXG4gICAgQHNjZW5lLmFkZChAZ3JvdXApXG5cbiAgICBAd2F2ZWZvcm1EYXRhID1cbiAgICAgIG1vbm86IG51bGxcbiAgICAgIHN0ZXJlbzogbnVsbFxuICAgIEBzZXRBaXJwb3J0U3RhdGUoRU5VTS5BaXJwb3J0U3RhdGUuSURMRSlcblxuICAgICMgSW5pdGlhbGl6ZSB0aGUgZXF1YWxpemVyXG4gICAgQGVxbHpyID0gbmV3IFNQQUNFLkVxdWFsaXplcih7XG4gICAgICBtaW5MZW5ndGg6IDBcbiAgICAgIG1heExlbmd0aDogMjAwXG4gICAgICByYWRpdXM6IDMwMFxuICAgICAgY29sb3I6IDB4RkZGRkZGXG4gICAgICBhYnNvbHV0ZTogZmFsc2VcbiAgICAgIGxpbmVGb3JjZURvd246IC41XG4gICAgICBsaW5lRm9yY2VVcDogMVxuICAgICAgaW50ZXJwb2xhdGlvblRpbWU6IDI1MFxuICAgIH0pXG4gICAgQGdyb3VwLmFkZChAZXFsenIpXG5cbiAgICBAZXF1YWxpemVyID0gbmV3IFNQQUNFLkVxdWFsaXplcih7XG4gICAgICBtaW5MZW5ndGg6IDBcbiAgICAgIG1heExlbmd0aDogNTBcbiAgICAgIHJhZGl1czogMzAwXG4gICAgICBjb2xvcjogMHhEMUQxRDFcbiAgICAgIGFic29sdXRlOiBmYWxzZVxuICAgICAgbGluZUZvcmNlRG93bjogLjVcbiAgICAgIGxpbmVGb3JjZVVwOiAxXG4gICAgICBpbnRlcnBvbGF0aW9uVGltZTogMjUwXG4gICAgfSlcbiAgICBAZ3JvdXAuYWRkKEBlcXVhbGl6ZXIpXG5cbiAgICBAU0MgICAgICAgICAgID0gU1BBQ0UuU0NcbiAgICBAYWlycG9ydCAgICAgID0gW11cbiAgICBAcGxheWxpc3QgICAgID0gW11cblxuICAgIEBfZXZlbnRzKClcbiAgICBAc2V0U3RhdGUoRU5VTS5KdWtlYm94U3RhdGUuSVNfU1RPUFBFRClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVHJhY2suSVNfUExBWUlORy50eXBlLCBAX2VUcmFja0lzUGxheWluZylcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX1NUT1BQRUQudHlwZSwgQF9lVHJhY2tJc1N0b3BwZWQpXG4gICAgIyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNvdmVyLlRSQU5TSVRJT05fRU5ERUQudHlwZSwgQF9lVHJhbnNpdGlvbkVuZGVkKVxuXG4gIF9lVHJhY2tJc1BsYXlpbmc6IChlKT0+XG4gICAgQHNldFN0YXRlKEVOVU0uSnVrZWJveFN0YXRlLklTX1BMQVlJTkcpXG5cbiAgX2VUcmFja0lzU3RvcHBlZDogKGUpPT5cbiAgICBIRUxQRVIudHJpZ2dlcihFVkVOVC5KdWtlYm94LldJTExfUExBWSlcbiAgICAjIHNldFRpbWVvdXQoPT5cbiAgICBpZiBAcGxheWxpc3QubGVuZ3RoID4gMFxuICAgICAgQHNldFN0YXRlKEVOVU0uSnVrZWJveFN0YXRlLlRSQUNLX1NUT1BQRUQpXG4gICAgZWxzZVxuICAgICAgQHNldFN0YXRlKEVOVU0uSnVrZWJveFN0YXRlLklTX1NUT1BQRUQpXG4gICAgIyAsIDUwKVxuXG4gICMgX2VUcmFuc2l0aW9uRW5kZWQ6IChlKT0+XG4gICMgICBpZiBAcGxheWxpc3QubGVuZ3RoID4gMCAmJiBAdGltZSA+IEBkZWxheVxuICAjICAgICBAbmV4dCgpIGlmIEBjdXJyZW50ID09IG51bGxcblxuICBfY3JlYXRlVHJhY2s6IChkYXRhKS0+XG4gICAgIyBzcGFjZXNoaXAgICAgICAgPSBuZXcgU1BBQ0UuU3BhY2VzaGlwKEBlcXVhbGl6ZXIuY2VudGVyLCBAZXF1YWxpemVyLnJhZGl1cylcbiAgICB0cmFjayAgICAgICAgICAgPSBuZXcgU1BBQ0UuVHJhY2soZGF0YSlcbiAgICAjIHRyYWNrLnNwYWNlc2hpcCA9IHNwYWNlc2hpcFxuICAgIHRyYWNrLnBlbmRpbmdEdXJhdGlvbiA9IEBfY2FsY1BlbmRpbmcoQHBsYXlsaXN0Lmxlbmd0aC0xKVxuXG4gICAgIyBAZ3JvdXAuYWRkKHNwYWNlc2hpcClcblxuICAgIEBwbGF5bGlzdC5wdXNoKHRyYWNrKVxuICAgICMgQGFpcnBvcnQucHVzaChzcGFjZXNoaXApXG5cbiAgICBIRUxQRVIudHJpZ2dlcihFVkVOVC5KdWtlYm94LlRSQUNLX0FEREVELCB7IHRyYWNrOiB0cmFjayB9KVxuICAgIFNQQUNFLkxPRygnU291bmQgYWRkZWQ6ICcgKyB0cmFjay5kYXRhLnRpdGxlKVxuXG4gIF9jYWxjUGVuZGluZzogKHBvc2l0aW9uKS0+XG4gICAgZHVyYXRpb24gPSAwXG4gICAgZm9yIHRyYWNrLCBpIGluIEBwbGF5bGlzdFxuICAgICAgZHVyYXRpb24gKz0gdHJhY2suZGF0YS5kdXJhdGlvblxuICAgICAgYnJlYWsgaWYgaSA9PSBwb3NpdGlvblxuICAgIHJldHVybiBkdXJhdGlvblxuXG4gIHByZWRlZmluZWRQbGF5bGlzdDogLT5cbiAgICBsaXN0ID0gW1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9jaG9uY2gtMi9jb3VydGUtZGFuc2UtbWFjYWJyZSdcbiAgICAgICMgJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vY2hvbmNoLTIvbW91YWlzJ1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9jaG9uY2gtMi9jYWNhY28tMidcbiAgICAgICMgJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vY2hvbmNoLTIvZHVvZGVudW0nXG4gICAgICAjICdodHRwczovL3NvdW5kY2xvdWQuY29tL2Nob25jaC0yL2xpdHRsZS1ncmVlbi1tb25rZXknXG4gICAgICAjICdodHRwczovL3NvdW5kY2xvdWQuY29tL2h1aHdoYXRhbmR3aGVyZS9zZXRzL3N1cHJlbWUtbGF6aW5lc3MtdGhlLWNlbGVzdGljcydcbiAgICAgICMgJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vdGFrdWdvdGJlYXRzL3NldHMvMjUtbmlnaHRzLWZvci1udWphYmVzJ1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS90b21taXNjaC9zZXRzL3RvbS1taXNjaC1zb3VsZWN0aW9uLXdoaXRlJ1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9wcm9mZXNzb3JrbGlxL3NldHMvdHJhY2ttYW5pYS12YWxsZXktb3N0J1xuICAgICAgIyAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9wcm9mZXNzb3JrbGlxL3NldHMvdHJhY2ttYW5pYS1zdGFkaXVtLW9zdCdcbiAgICBdXG5cbiAgICBsaXN0ID0gX0NvZmZlZS5zaHVmZmxlKGxpc3QpXG4gICAgZm9yIHVybCwgaSBpbiBsaXN0XG4gICAgICBAYWRkKGxpc3RbaV0pXG5cbiAgICAjIHNldFRpbWVvdXQoPT5cbiAgICAjICAgQGFkZCgnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9jaG9uY2gtMi9jYWNhY28tMicpXG4gICAgIyAsIDUwMDApXG5cbiAgc2V0U3RhdGU6IChzdGF0ZSktPlxuICAgIEBzdGF0ZSA9IHN0YXRlXG4gICAgc3dpdGNoKHN0YXRlKVxuICAgICAgd2hlbiBFTlVNLkp1a2Vib3hTdGF0ZS5JU19QTEFZSU5HXG4gICAgICAgIEBjdXJyZW50LndoaWxlcGxheWluZ0NhbGxiYWNrID0gQF93aGlsZXBsYXlpbmdcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgQGN1cnJlbnRcbiAgICAgICAgICBAY3VycmVudC5kZXN0cnVjdCgpXG4gICAgICAgIEBjdXJyZW50ID0gbnVsbFxuXG4gICAgICAgIGlmIEBzdGF0ZSA9PSBFTlVNLkp1a2Vib3hTdGF0ZS5JU19TVE9QUEVEXG4gICAgICAgICAgSEVMUEVSLnRyaWdnZXIoRVZFTlQuSnVrZWJveC5JU19TVE9QUEVEKVxuXG4gIHNldEFpcnBvcnRTdGF0ZTogKHN0YXRlKT0+XG4gICAgQGFpcnBvcnRTdGF0ZSA9IHN0YXRlXG4gICAgc3dpdGNoKHN0YXRlKVxuICAgICAgd2hlbiBFTlVNLkFpcnBvcnRTdGF0ZS5JRExFXG4gICAgICAgIFNQQUNFLkxPRygnV2FpdGluZyBmb3IgbmV3IHNwYWNlc2hpcCcpXG4gICAgICB3aGVuIEVOVU0uQWlycG9ydFN0YXRlLlNFTkRJTkdcbiAgICAgICAgc3BhY2VzaGlwID0gQGFpcnBvcnQuc2hpZnQoKVxuICAgICAgICBzcGFjZXNoaXAuc2V0U3RhdGUoU3BhY2VzaGlwU3RhdGUuTEFVTkNIRUQpXG4gICAgICAgIHNldFRpbWVvdXQoQHNldEFpcnBvcnRTdGF0ZSwgNjAgKiAxMDAwKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0QWlycG9ydFN0YXRlKEVOVU0uQWlycG9ydFN0YXRlLklETEUpXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cbiAgICBpZiBAY3VycmVudCA9PSBudWxsXG4gICAgICBAdGltZSArPSBkZWx0YVxuICAgIGVsc2VcbiAgICAgIEB0aW1lID0gMFxuICAgICMgZm9yIHRyYWNrLCBpIGluIEBwbGF5bGlzdFxuICAgICMgICB0cmFjay51cGRhdGUoZGVsdGEpXG4gICAgIyBAY3VycmVudC51cGRhdGUoZGVsdGEpIGlmIEBjdXJyZW50XG5cbiAgICBpZiBAcGxheWxpc3QubGVuZ3RoID4gMCAmJiBAdGltZSA+IEBkZWxheSMgJiYgQHN0YXRlID09IEVOVU0uSnVrZWJveFN0YXRlLklTX1NUT1BQRURcbiAgICAgIEBuZXh0KCkgaWYgQGN1cnJlbnQgPT0gbnVsbFxuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgSnVrZWJveCBwbGF5ZXIgbWV0aG9kcyAjXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gIGxpc3Q6IC0+XG4gICAgbGlzdCA9IFtdXG4gICAgZm9yIHRyYWNrIGluIEBwbGF5bGlzdFxuICAgICAgbGlzdC5wdXNoKHt0aXRsZTogdHJhY2suZGF0YS50aXRsZSwgcGVuZGluZ0R1cmF0aW9uOiB0cmFjay5wZW5kaW5nRHVyYXRpb259KVxuICAgIHJldHVybiBsaXN0XG5cbiAgYWRkOiAoc291bmRPclBsYXlsaXN0KS0+XG4gICAgQF9jcmVhdGVUcmFjayhzb3VuZE9yUGxheWxpc3QpXG4gICAgIyBAU0MuZ2V0U291bmRPclBsYXlsaXN0IHNvdW5kT3JQbGF5bGlzdCwgKG8sIGVycik9PlxuICAgICMgICBpZiBlcnJcbiAgICAjICAgICBfSC50cmlnZ2VyKFRSQUNLX09OX0FERF9FUlJPUiwge29iamVjdDogbywgZXJyb3I6IGVycn0pXG4gICAgIyAgICAgcmV0dXJuXG5cbiAgICAjICAgdHJhY2tzID0gbnVsbFxuICAgICMgICBpZiBvLmhhc093blByb3BlcnR5KCd0cmFja3MnKVxuICAgICMgICAgIHRyYWNrcyA9IF9Db2ZmZWUuc2h1ZmZsZShvLnRyYWNrcylcbiAgICAjICAgZWxzZVxuICAgICMgICAgIHRyYWNrcyA9IFtdXG4gICAgIyAgICAgdHJhY2tzLnB1c2gobylcblxuICAgICMgICBmb3IgZGF0YSBpbiB0cmFja3NcbiAgICAjICAgICBAX2NyZWF0ZVRyYWNrKGRhdGEpXG5cbiAgbmV4dDogKHRyYWNrKS0+XG4gICAgQGN1cnJlbnQuc3RvcCgpIGlmIEBjdXJyZW50XG4gICAgaWYgQHBsYXlsaXN0Lmxlbmd0aCA+IDBcbiAgICAgIEBjdXJyZW50ID0gQHBsYXlsaXN0LnNoaWZ0KClcbiAgICAgICMgQGN1cnJlbnQucmVtb3ZlU3BhY2VzaGlwKClcbiAgICAgIEBjdXJyZW50LnN0cmVhbSgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIF93aGlsZXBsYXlpbmc6ID0+XG4gICAgIyBjb25zb2xlLmxvZyAneW91cGknLCBAY3VycmVudC5zb3VuZFxuICAgIEB3YXZlZm9ybURhdGEgPSBAY3VycmVudC53YXZlZm9ybURhdGEgaWYgQGN1cnJlbnQjIGFuZCBAY3VycmVudC5zb3VuZFxuXG5cbmNsYXNzIFNQQUNFLlRyYWNrXG5cbiAgZGF0YTogICAgICAgICAgICAgICAgIG51bGxcbiAgc3BhY2VzaGlwOiAgICAgICAgICAgIG51bGxcbiAgc291bmQ6ICAgICAgICAgICAgICAgIG51bGxcblxuICB0aW1lOiAgICAgICAgICAgICAgICAgMFxuICBwZW5kaW5nRHVyYXRpb246ICAgICAgMFxuXG4gIGlzUGxheWluZzogICAgICAgICAgICBmYWxzZVxuICB3aGlsZXBsYXlpbmdDYWxsYmFjazogbnVsbFxuXG4gIHRpbWVkYXRhOiBudWxsXG5cbiAgY29uc3RydWN0b3I6IChkYXRhKS0+XG4gICAgQGRhdGEgICAgID0gZGF0YVxuICAgIEBTQyAgICAgICA9IFNQQUNFLlNDXG4gICAgQHRpbWVkYXRhID0gQXJyYXkoMjU2KVxuICAgIEBfZXZlbnRzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVHJhY2suSVNfUExBWUlORy50eXBlLCBAX2VUcmFja0lzUGxheWluZylcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX1NUT1BQRUQudHlwZSwgQF9lVHJhY2tJc1N0b3BwZWQpXG5cbiAgX2VUcmFja0lzUGxheWluZzogPT5cbiAgICBAaXNQbGF5aW5nID0gdHJ1ZVxuXG4gIF9lVHJhY2tJc1N0b3BwZWQ6ID0+XG4gICAgQGlzUGxheWluZyA9IGZhbHNlXG5cbiAgc3RyZWFtOiAtPlxuICAgIHVybCAgPSAncmVzb3VyY2VzL3NvdW5kcy8nK0BkYXRhLnVybFxuXG4gICAgYXV0b3BsYXkgPSB0cnVlXG4gICAgdW5sZXNzIHdpbmRvdy5XZWJBdWRpb0FQSVxuICAgICAgd2luZG93LldlYkF1ZGlvQVBJID0gd2luZG93LldlYkF1ZGlvQVBJIHx8IG5ldyBTUEFDRS5XZWJBdWRpb0FQSSgpXG4gICAgICBhdXRvcGxheSA9IGZhbHNlXG5cbiAgICBAYXBpID0gV2ViQXVkaW9BUElcbiAgICBAYXBpLm9ucGxheSAgICAgICAgID0gQF9vbnBsYXlcbiAgICBAYXBpLm9ucGF1c2UgICAgICAgID0gQF9vbnBhdXNlXG4gICAgQGFwaS5vbmF1ZGlvcHJvY2VzcyA9IEBfd2hpbGVwbGF5aW5nXG4gICAgQGFwaS5vbmVuZGVkICAgICAgICA9IEBfb25maW5pc2hcbiAgICBAYXBpLnNldFVybCh1cmwsIGF1dG9wbGF5LCBAX29ubG9hZClcblxuICBwbGF5OiAtPlxuICAgIEBhcGkucGxheSgpXG5cbiAgcGF1c2U6IC0+XG4gICAgQGFwaS5wYXVzZSgpXG5cbiAgc3RvcDogLT5cbiAgICBAYXBpLnN0b3AoKVxuICAgIEBfb25maW5pc2goKVxuXG4gIGRlc3RydWN0OiAtPlxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRVZFTlQuVHJhY2suSVNfUExBWUlORy50eXBlLCBAX2VUcmFja0lzUGxheWluZylcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX1NUT1BQRUQudHlwZSwgQF9lVHJhY2tJc1N0b3BwZWQpXG4gICAgQGFwaS5kZXN0cm95KClcblxuICBfb25sb2FkOiA9PlxuICAgIEhFTFBFUi50cmlnZ2VyKEVWRU5ULlRyYWNrLklTX0xPQURFRCwgeyB0cmFjazogdGhpcyB9KVxuXG4gIF9zdGFydGluZzogKHNvdW5kKT0+XG4gICAgQHNvdW5kID0gc291bmRcbiAgICBTUEFDRS5MT0coJ05leHQ6ICcgKyBAZGF0YS50aXRsZSlcblxuICBfb25wbGF5OiA9PlxuICAgIEhFTFBFUi50cmlnZ2VyKEVWRU5ULlRyYWNrLklTX1BMQVlJTkcsIHsgdHJhY2s6IHRoaXMgfSlcblxuICBfb25wYXVzZTogPT5cbiAgICBIRUxQRVIudHJpZ2dlcihFVkVOVC5UcmFjay5JU19QQVVTRUQsIHsgdHJhY2s6IHRoaXMgfSlcblxuICBfb25maW5pc2g6ID0+XG4gICAgSEVMUEVSLnRyaWdnZXIoRVZFTlQuVHJhY2suSVNfU1RPUFBFRCwgeyB0cmFjazogdGhpcyB9KVxuICAgIEBhcGkuc3RvcCgpXG4gICAgQF9yZXNldCgpXG5cbiAgX3doaWxlcGxheWluZzogKGUpPT5cbiAgICBhbmFseXNlciA9IEBhcGkuYW5hbHlzZXJcblxuICAgIHVubGVzcyBhbmFseXNlci5nZXRGbG9hdFRpbWVEb21haW5EYXRhXG4gICAgICBhcnJheSAgICA9ICBuZXcgVWludDhBcnJheShhbmFseXNlci5mZnRTaXplKVxuICAgICAgYW5hbHlzZXIuZ2V0Qnl0ZVRpbWVEb21haW5EYXRhKGFycmF5KVxuICAgICAgZm9yIGkgaW4gWzAuLjI1NV1cbiAgICAgICAgQHRpbWVkYXRhW2ldID0gKGFycmF5W2ldIC0gMTI4KSAvIDEyOFxuICAgIGVsc2VcbiAgICAgIGFycmF5ICAgID0gIG5ldyBGbG9hdDMyQXJyYXkoYW5hbHlzZXIuZmZ0U2l6ZSlcbiAgICAgIGFuYWx5c2VyLmdldEZsb2F0VGltZURvbWFpbkRhdGEoYXJyYXkpXG4gICAgICBmb3IgaSBpbiBbMC4uMjU1XVxuICAgICAgICBAdGltZWRhdGFbaV0gPSBhcnJheVtpXVxuXG4gICAgQHdhdmVmb3JtRGF0YSA9XG4gICAgICBtb25vOiBAdGltZWRhdGFcblxuICAgIEB3aGlsZXBsYXlpbmdDYWxsYmFjaygpIGlmIEB3aGlsZXBsYXlpbmdDYWxsYmFja1xuXG4gIF9yZXNldDogLT5cbiAgICBmb3IgZGF0YSwgaSBpbiBAd2F2ZWZvcm1EYXRhLm1vbm9cbiAgICAgIGRhdGEgPSBAdGltZWRhdGFbaV0gPSAwXG5cblxuXG5jbGFzcyBTUEFDRS5XZWJBdWRpb0FQSVxuXG4gIGlkZW50aWZpZXI6ICdXZWJBdWRpb0FQSSdcblxuICBjdHg6ICAgICAgIG51bGxcbiAgYW5hbHlzZXI6ICBudWxsXG4gIHByb2Nlc3NvcjogbnVsbFxuICBidWZmZXI6ICAgIG51bGxcbiAgc3JjOiAgICAgICBudWxsXG5cbiAgc3RhcnRUaW1lOiAwXG4gIHBvc2l0aW9uOiAgMFxuICBkdXJhdGlvbjogIDBcblxuICB0aW1lOiAwXG5cbiAgaXNMb2FkZWQ6IGZhbHNlXG4gIGlzUGxheWluZzogZmFsc2VcbiAgaXNQYXVzZWQ6IHRydWVcblxuICBzdGF0ZTogbnVsbFxuXG4gICMjIFNldHVwIFdlYiBBdWRpbyBBUElcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgdHJ5XG4gICAgICBpZiAod2luZG93LkF1ZGlvQ29udGV4dE9iamVjdCA9PSB1bmRlZmluZWQpXG4gICAgICAgIHdpbmRvdy5BdWRpb0NvbnRleHRPYmplY3QgPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHR8fHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKClcbiAgICBjYXRjaCBlXG4gICAgICBpZiAoQXBwLmVudiA9PSAnZGV2ZWxvcG1lbnQnKVxuICAgICAgICBjb25zb2xlLmxvZyhcIkhUTUw1IFdlYiBBdWRpbyBBUEkgbm90IHN1cHBvcnRlZC4gU3dpdGNoIHRvIFNvdW5kTWFuYWdlcjIuXCIpXG5cbiAgICBAc2V0U3RhdGUoRU5VTS5BdWRpb1N0YXRlLklTX0VOREVEKVxuXG4gIHNldFVybDogKHVybCwgYXV0b3BsYXk9ZmFsc2UsIGNhbGxiYWNrKS0+XG4gICAgQGN0eCA9IEF1ZGlvQ29udGV4dE9iamVjdFxuICAgIEBfb2xkQnJvd3NlcigpXG5cbiAgICByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSlcbiAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcidcbiAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICByZXF1ZXN0Lm9ubG9hZCA9ID0+XG4gICAgICBAY3R4LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCAoYnVmZmVyKT0+XG4gICAgICAgIEBpc0xvYWRlZCA9IHRydWVcbiAgICAgICAgQGJ1ZmZlciA9IGJ1ZmZlclxuICAgICAgICBAcGxheSgpIGlmIGF1dG9wbGF5XG4gICAgICAgIGNhbGxiYWNrKCkgaWYgY2FsbGJhY2tcbiAgICAgICwgQF9vbkVycm9yKVxuICAgIHJlcXVlc3Quc2VuZCgpXG5cbiAgc2V0U3RhdGU6IChzdGF0ZSktPlxuICAgIEBzdGF0ZSA9IHN0YXRlXG5cbiAgX29uRXJyb3I6IC0+XG4gICAgY29uc29sZS5sb2cgJ0VSUk9SJ1xuXG4gIHBhdXNlOiAtPlxuICAgIGlmIEBzcmNcbiAgICAgIEBzcmMuc3RvcCgwKVxuICAgICAgQHNyYyAgICAgICA9IG51bGxcbiAgICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBudWxsXG4gICAgICBAcG9zaXRpb24gID0gQGN0eC5jdXJyZW50VGltZSAtIEBzdGFydFRpbWVcbiAgICAgIEBzZXRTdGF0ZShFTlVNLkF1ZGlvU3RhdGUuSVNfUEFVU0VEKVxuICAgICAgQG9ucGF1c2UoKSBpZiBAb25wYXVzZVxuXG4gIHBsYXk6IChwb3NpdGlvbiktPlxuICAgIHJldHVybiB1bmxlc3MgQGlzTG9hZGVkXG4gICAgaWYgQHN0YXRlID09IEVOVU0uQXVkaW9TdGF0ZS5JU19QTEFZSU5HXG4gICAgICBAcGF1c2UoKVxuICAgICAgcmV0dXJuXG5cbiAgICBAX2Nvbm5lY3QoKVxuICAgIEBwb3NpdGlvbiAgPSBpZiB0eXBlb2YgcG9zaXRpb24gPT0gJ251bWJlcicgdGhlbiBwb3NpdGlvbiBlbHNlIEBwb3NpdGlvbiBvciAwXG4gICAgQHN0YXJ0VGltZSA9IEBjdHguY3VycmVudFRpbWUgLSAoQHBvc2l0aW9uIG9yIDApXG5cbiAgICBAc3JjLnN0YXJ0KEBjdHguY3VycmVudFRpbWUsIEBwb3NpdGlvbilcblxuICAgIEBzZXRTdGF0ZShFTlVNLkF1ZGlvU3RhdGUuSVNfUExBWUlORylcbiAgICBAb25wbGF5KCkgaWYgQG9ucGxheVxuXG4gIHN0b3A6IC0+XG4gICAgaWYgQHNyY1xuICAgICAgQHNyYy5zdG9wKDApXG4gICAgICBAc3JjICAgICAgID0gbnVsbFxuICAgICAgQHByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IG51bGxcbiAgICAgIEBwb3NpdGlvbiAgPSAwXG4gICAgICBAc3RhcnRUaW1lID0gMFxuICAgICAgQHNldFN0YXRlKEVOVU0uQXVkaW9TdGF0ZS5JU19TVE9QUEVEKVxuXG4gIHZvbHVtZTogKHZvbHVtZSktPlxuICAgIHZvbHVtZSA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIHZvbHVtZSkpXG4gICAgQGdhaW5Ob2RlLmdhaW4udmFsdWUgPSB2b2x1bWVcblxuICB1cGRhdGVQb3NpdGlvbjogLT5cbiAgICBpZiBAc3RhdGUgPT0gRU5VTS5BdWRpb1N0YXRlLklTX1BMQVlJTkdcbiAgICAgIEBwb3NpdGlvbiA9IEBjdHguY3VycmVudFRpbWUgLSBAc3RhcnRUaW1lXG5cbiAgICBpZiBAcG9zaXRpb24gPiBAYnVmZmVyLmR1cmF0aW9uXG4gICAgICBAcG9zaXRpb24gPSBAYnVmZmVyLmR1cmF0aW9uXG4gICAgICBAcGF1c2UoKVxuXG4gICAgcmV0dXJuIEBwb3NpdGlvblxuXG4gIHNlZWs6ICh0aW1lKS0+XG4gICAgaWYgQHN0YXRlID09IEVOVU0uQXVkaW9TdGF0ZS5JU19QTEFZSU5HXG4gICAgICBAcGxheSh0aW1lKVxuICAgIGVsc2VcbiAgICAgIEBwb3NpdGlvbiA9IHRpbWVcblxuICBkZXN0cm95OiAtPlxuICAgIEBzdG9wKClcbiAgICBAX2Rpc2Nvbm5lY3QoKVxuICAgIEBjdHggPSBudWxsXG5cbiAgX2Nvbm5lY3Q6IC0+XG4gICAgIyBTZXR1cCBidWZmZXIgc291cmNlXG4gICAgQHNyYyAgICAgICAgICAgICAgICAgPSBAY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpXG4gICAgQHNyYy5idWZmZXIgICAgICAgICAgPSBAYnVmZmVyXG4gICAgQHNyYy5vbmVuZGVkICAgICAgICAgPSBAX29uRW5kZWRcbiAgICBAZHVyYXRpb24gICAgICAgICAgICA9IEBidWZmZXIuZHVyYXRpb25cblxuICAgICMgU2V0dXAgYW5hbHlzZXJcbiAgICBAYW5hbHlzZXIgPSBAY3R4LmNyZWF0ZUFuYWx5c2VyKClcbiAgICBAYW5hbHlzZXIuc21vb3RoaW5nVGltZUNvbnN0YW50ID0gMC44XG4gICAgQGFuYWx5c2VyLm1pbkRlY2liZWxzICAgICAgICAgICA9IC0xNDBcbiAgICBAYW5hbHlzZXIubWF4RGVjaWJlbHMgICAgICAgICAgID0gMFxuICAgIEBhbmFseXNlci5mZnRTaXplICAgICAgICAgICAgICAgPSA1MTJcblxuICAgICMgU2V0dXAgU2NyaXB0UHJvY2Vzc29yXG4gICAgQHByb2Nlc3NvciA9IEBjdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yKDIwNDgsIDEsIDEpXG5cbiAgICAjIFNldHAgR2Fpbk5vZGVcbiAgICBAZ2Fpbk5vZGUgPSBAY3R4LmNyZWF0ZUdhaW4oKVxuXG4gICAgQHNyYy5jb25uZWN0KEBhbmFseXNlcilcbiAgICBAc3JjLmNvbm5lY3QoQGdhaW5Ob2RlKVxuICAgIEBhbmFseXNlci5jb25uZWN0KEBwcm9jZXNzb3IpXG4gICAgQHByb2Nlc3Nvci5jb25uZWN0KEBjdHguZGVzdGluYXRpb24pXG4gICAgQGdhaW5Ob2RlLmNvbm5lY3QoQGN0eC5kZXN0aW5hdGlvbilcblxuICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBAX29uQXVkaW9Qcm9jZXNzXG4gICAgQHByb2Nlc3Nvci5hcGkgPSBAXG5cbiAgICBAX29sZEJyb3dzZXIoKVxuXG4gIF9kaXNjb25uZWN0OiAtPlxuICAgIEBhbmFseXNlci5kaXNjb25uZWN0KDApICBpZiBAYW5hbHlzZXJcbiAgICBAcHJvY2Vzc29yLmRpc2Nvbm5lY3QoMCkgaWYgQHByb2Nlc3NvclxuXG4gIF9vbkF1ZGlvUHJvY2VzczogPT5cbiAgICBAb25hdWRpb3Byb2Nlc3MoKSBpZiBAb25hdWRpb3Byb2Nlc3NcblxuICBfb25FbmRlZDogKGUpPT5cbiAgICBpZiBAc3JjIGFuZCAoQHN0YXRlID09IEVOVU0uQXVkaW9TdGF0ZS5JU19TVE9QUEVEIHx8IEBzdGF0ZSA9PSBFTlVNLkF1ZGlvU3RhdGUuSVNfUExBWUlORylcbiAgICAgIEBzcmMuZGlzY29ubmVjdCgwKVxuICAgICAgQHNyYyAgICAgICAgICAgICAgICAgICAgICA9IG51bGxcbiAgICAgIEBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBudWxsXG4gICAgICBAc3RhdGUgPSBFTlVNLkF1ZGlvU3RhdGUuSVNfRU5ERURcbiAgICAgIEBvbmVuZGVkKCkgaWYgQG9uZW5kZWRcblxuICBfb2xkQnJvd3NlcjogLT5cbiAgICBpZiBAY3R4IGFuZCB0eXBlb2YgQGN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IgIT0gJ2Z1bmN0aW9uJ1xuICAgICAgQGN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IgPSBAY3R4LmNyZWF0ZUphdmFTY3JpcHROb2RlXG5cbiAgICBpZiBAc3JjIGFuZCB0eXBlb2YgQHNyYy5zdGFydCAhPSAnZnVuY3Rpb24nXG4gICAgICBAc3JjLnN0YXJ0ID0gQHNyYy5ub3RlT25cblxuICAgIGlmIEBzcmMgYW5kIHR5cGVvZiBAc3JjLnN0b3AgIT0gJ2Z1bmN0aW9uJ1xuICAgICAgQHNyYy5zdG9wID0gQHNyYy5ub3RlT2ZmXG5cblxuY2xhc3MgU1BBQ0UuRXF1YWxpemVyIGV4dGVuZHMgVEhSRUUuR3JvdXBcblxuICBjZW50ZXI6ICAgICBudWxsXG5cbiAgX3ZhbHVlczogICAgbnVsbFxuICBfbmV3VmFsdWVzOiBudWxsXG5cbiAgX3RpbWU6ICAgICAgMVxuXG4gICMgVEhSRUVcbiAgbWF0ZXJpYWw6ICAgbnVsbFxuICBsaW5lczogICAgICBudWxsXG5cbiAgIyBQYXJhbWV0ZXJzXG4gIG1heExlbmd0aDogICAgICAgICAwXG4gIG1pbkxlbmd0aDogICAgICAgICAwXG4gIHJhZGl1czogICAgICAgICAgICAwXG4gIGludGVycG9sYXRpb25UaW1lOiAwXG4gIGNvbG9yOiAgICAgICAgICAgICAweEZGRkZGRlxuICBsaW5lRm9yY2VVcDogICAgICAgLjVcbiAgbGluZUZvcmNlRG93bjogICAgIC41XG4gIGxpbmV3aWR0aDogICAgICAgICAwXG4gIGFic29sdXRlOiAgICAgICAgICBmYWxzZVxuICBuYlZhbHVlczogICAgICAgICAgMFxuICBtYXhOYlZhbHVlczogICAgICAgNTEyXG4gIG1pcnJvcjogICAgICAgICAgICB0cnVlXG5cbiAgY29uc3RydWN0b3I6IChvcHRzPXt9KS0+XG4gICAgc3VwZXJcblxuICAgICMgU2V0IHBhcmFtZXRlcnNcbiAgICBkZWZhdWx0cyA9XG4gICAgICBtYXhMZW5ndGg6ICAgICAgICAgMjAwXG4gICAgICBtaW5MZW5ndGg6ICAgICAgICAgNTBcbiAgICAgIHJhZGl1czogICAgICAgICAgICAyNTBcbiAgICAgIGludGVycG9sYXRpb25UaW1lOiAxNTBcbiAgICAgIGNvbG9yOiAgICAgICAgICAgICAweEZGRkZGRlxuICAgICAgbGluZUZvcmNlVXA6ICAgICAgIC41XG4gICAgICBsaW5lRm9yY2VEb3duOiAgICAgLjVcbiAgICAgIGFic29sdXRlOiAgICAgICAgICBmYWxzZVxuICAgICAgbmJWYWx1ZXM6ICAgICAgICAgIDI1NiAjIE1heGltdW0gNTEyIHZhbHVlc1xuICAgICAgbWlycm9yOiAgICAgICAgICAgIHRydWVcbiAgICAgIGxpbmV3aWR0aDogICAgICAgICAyXG5cbiAgICBvcHRzICAgICAgICAgICAgICAgPSBIRUxQRVIuQ29mZmVlLm1lcmdlKGRlZmF1bHRzLCBvcHRzKVxuICAgIEBtaW5MZW5ndGggICAgICAgICA9IG9wdHMubWluTGVuZ3RoXG4gICAgQG1heExlbmd0aCAgICAgICAgID0gb3B0cy5tYXhMZW5ndGhcbiAgICBAcmFkaXVzICAgICAgICAgICAgPSBvcHRzLnJhZGl1c1xuICAgIEBpbnRlcnBvbGF0aW9uVGltZSA9IG9wdHMuaW50ZXJwb2xhdGlvblRpbWVcbiAgICBAY29sb3IgICAgICAgICAgICAgPSBvcHRzLmNvbG9yXG4gICAgQGxpbmVGb3JjZVVwICAgICAgID0gb3B0cy5saW5lRm9yY2VVcFxuICAgIEBsaW5lRm9yY2VEb3duICAgICA9IG9wdHMubGluZUZvcmNlRG93blxuICAgIEBhYnNvbHV0ZSAgICAgICAgICA9IG9wdHMuYWJzb2x1dGVcbiAgICBAbmJWYWx1ZXMgICAgICAgICAgPSBvcHRzLm5iVmFsdWVzXG4gICAgQG1pcnJvciAgICAgICAgICAgID0gb3B0cy5taXJyb3JcbiAgICBAbGluZXdpZHRoICAgICAgICAgPSBvcHRzLmxpbmV3aWR0aFxuXG4gICAgIyBTZXQgdmFsdWVzXG4gICAgQGNlbnRlciAgICAgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgQF92YWx1ZXMgICAgPSBAbXV0ZShmYWxzZSlcbiAgICBAX25ld1ZhbHVlcyA9IEBtdXRlKGZhbHNlKVxuXG4gICAgQHNldFJhZGl1cyhAcmFkaXVzKVxuXG4gICAgQGdlbmVyYXRlKClcblxuICAgIEBfZXZlbnRzKClcbiAgICBAdXBkYXRlVmFsdWVzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVHJhY2suSVNfU1RPUFBFRC50eXBlLCBAX2VUcmFja0lzU3RvcHBlZClcblxuICBfZVRyYWNrSXNTdG9wcGVkOiA9PlxuICAgIEBtdXRlKClcblxuICBzZXROYlZhbHVlczogKG5iVmFsdWVzKS0+XG4gICAgQG5iVmFsdWVzID0gbmJWYWx1ZXNcbiAgICBAbXV0ZSgpXG5cbiAgc2V0VmFsdWVzOiAodmFsdWVzKS0+XG4gICAgaWYgQG1pcnJvclxuICAgICAgZGF0YXMgID0gQXJyYXkoQG5iVmFsdWVzKVxuICAgICAgZm9yIGkgaW4gWzAuLigoQG5iVmFsdWVzKi41KS0xKV1cbiAgICAgICAgZGF0YXNbaV0gPSBkYXRhc1tAbmJWYWx1ZXMtMS1pXSA9IHZhbHVlc1tpXVxuICAgICAgdmFsdWVzID0gZGF0YXNcblxuICAgIG5ld1ZhbHVlcyA9IEBtdXRlKGZhbHNlKVxuICAgIGZvciB2YWx1ZSwgaSBpbiB2YWx1ZXNcbiAgICAgIHZhbHVlID0gTWF0aC5hYnModmFsdWUpIGlmIEBhYnNvbHV0ZVxuICAgICAgdmFsdWUgPSAwIGlmIHR5cGVvZiB2YWx1ZSA9PSAndW5kZWZpbmVkJ1xuXG4gICAgICBsZW5ndGggPSBAbWluTGVuZ3RoICsgcGFyc2VGbG9hdCh2YWx1ZSkqKEBtYXhMZW5ndGggLSBAbWluTGVuZ3RoKVxuICAgICAgbmV3VmFsdWVzW2ldID0gTWF0aC5tYXgobGVuZ3RoLCAwKVxuICAgIEBfbmV3VmFsdWVzID0gbmV3VmFsdWVzXG4gICAgQHJlc2V0SW50ZXJwb2xhdGlvbigpXG5cbiAgZ2VuZXJhdGU6IC0+XG4gICAgQG11dGUoKVxuXG4gICAgQG1hdGVyaWFsICAgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQGNvbG9yLCBsaW5ld2lkdGg6IEBsaW5ld2lkdGggfSlcbiAgICBAbGluZXMgICAgICA9IFtdXG5cbiAgICBAcmVmcmVzaCgwKVxuICAgIEB1cGRhdGVHZW9tZXRyaWVzKHRydWUpXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cbiAgICBAcmVmcmVzaChkZWx0YSlcblxuICByZWZyZXNoOiAoZGVsdGEpLT5cbiAgICBAX3RpbWUgKz0gZGVsdGFcbiAgICB0ID0gQF90aW1lIC8gQGludGVycG9sYXRpb25UaW1lXG4gICAgcmV0dXJuIGlmIHQgPiAxXG5cbiAgICBmb3IgaSBpbiBbMC4uKEBtYXhOYlZhbHVlcy0xKV1cbiAgICAgIGRpZmYgICAgICAgID0gQF92YWx1ZXNbaV0gLSBAX25ld1ZhbHVlc1tpXVxuICAgICAgQF92YWx1ZXNbaV0gPSBAX3ZhbHVlc1tpXSAtIHQgKiBkaWZmXG4gICAgQHVwZGF0ZUdlb21ldHJpZXMoKVxuXG4gIHVwZGF0ZVZhbHVlczogPT5cbiAgICBpZiBTUEFDRS5KdWtlYm94LnN0YXRlID09IEVOVU0uSnVrZWJveFN0YXRlLklTX1BMQVlJTkcgYW5kIFNQQUNFLkp1a2Vib3gud2F2ZWZvcm1EYXRhLm1vbm9cbiAgICAgIEBzZXRWYWx1ZXMoU1BBQ0UuSnVrZWJveC53YXZlZm9ybURhdGEubW9ubylcbiAgICBzZXRUaW1lb3V0KEB1cGRhdGVWYWx1ZXMsIEBpbnRlcnBvbGF0aW9uVGltZSAqIDAuMjUpXG5cbiAgdXBkYXRlR2VvbWV0cmllczogKGNyZWF0ZT1mYWxzZSktPlxuICAgIGZvciBsZW5ndGgsIGkgaW4gQF92YWx1ZXNcbiAgICAgIGFuZ2xlICA9IE1hdGguUEkgKiAyICogaSAvIEBuYlZhbHVlc1xuXG4gICAgICBmcm9tID0gQGNvbXB1dGVQb3NpdGlvbihAY2VudGVyLCBhbmdsZSwgQHJhZGl1cy1sZW5ndGgqQGxpbmVGb3JjZURvd24pXG4gICAgICB0byAgID0gQGNvbXB1dGVQb3NpdGlvbihAY2VudGVyLCBhbmdsZSwgQHJhZGl1cytsZW5ndGgqQGxpbmVGb3JjZVVwKVxuXG4gICAgICBpZiB0eXBlb2YgQGxpbmVzW2ldID09ICd1bmRlZmluZWQnXG4gICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KClcbiAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChmcm9tLCB0bywgZnJvbSlcblxuICAgICAgICBsaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIEBtYXRlcmlhbClcbiAgICAgICAgQGxpbmVzLnB1c2gobGluZSlcbiAgICAgICAgQGFkZChsaW5lKVxuICAgICAgZWxzZVxuICAgICAgICBsaW5lID0gQGxpbmVzW2ldXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNbMF0gPSBmcm9tXG4gICAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNbMV0gPSB0b1xuICAgICAgICBsaW5lLmdlb21ldHJ5LnZlcnRpY2VzWzJdID0gZnJvbVxuICAgICAgICBsaW5lLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWVcblxuICByYW5kb206IChzZXRWYWx1ZXM9dHJ1ZSk9PlxuICAgIHZhbHVlcyA9IFtdXG4gICAgZm9yIGkgaW4gWzAuLihAbWF4TmJWYWx1ZXMtMSldXG4gICAgICB2YWx1ZXNbaV0gPSBNYXRoLnJhbmRvbSgpXG4gICAgQHNldFZhbHVlcyh2YWx1ZXMpIGlmIHNldFZhbHVlc1xuICAgIHJldHVybiB2YWx1ZXNcblxuICBtdXRlOiAoc2V0VmFsdWVzPXRydWUpLT5cbiAgICB2YWx1ZXMgPSBbXVxuICAgIGZvciBpIGluIFswLi4oQG1heE5iVmFsdWVzLTEpXVxuICAgICAgdmFsdWVzW2ldID0gMFxuICAgIEBzZXRWYWx1ZXModmFsdWVzKSBpZiBzZXRWYWx1ZXNcbiAgICByZXR1cm4gdmFsdWVzXG5cbiAgcmVzZXRJbnRlcnBvbGF0aW9uOiAtPlxuICAgIEBfdGltZSA9IDBcblxuICBjb21wdXRlUG9zaXRpb246IChwb2ludCwgYW5nbGUsIGxlbmd0aCktPlxuICAgIHggPSBwb2ludC54ICsgTWF0aC5zaW4oYW5nbGUpICogbGVuZ3RoXG4gICAgeSA9IHBvaW50LnkgKyBNYXRoLmNvcyhhbmdsZSkgKiBsZW5ndGhcbiAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoeCwgeSwgcG9pbnQueilcblxuICByZW1vdmVMaW5lRnJvbVBhcmVudDogKGluZGV4KS0+XG4gICAgcGFyZW50ID0gQGxpbmVzW2luZGV4XVxuICAgIHBhcmVudC5yZW1vdmUoQGxpbmVzW2luZGV4XSlcblxuICByZXNpemU6IC0+XG4gICAgQHNldFJhZGl1cyhAcmFkaXVzKVxuXG4gIHNldFJhZGl1czogKHJhZGl1cyktPlxuICAgIEByYWRpdXMgPSByYWRpdXNcbiAgICBAcmFkaXVzID0gd2luZG93LmlubmVyV2lkdGggKiAwLjYgaWYgd2luZG93LmlubmVyV2lkdGggLSAxMDAgPCByYWRpdXNcblxuXG5jbGFzcyBTUEFDRS5TcGFjZXNoaXAgZXh0ZW5kcyBUSFJFRS5Hcm91cFxuXG4gIHRpbWU6IDBcblxuICBzaGlwOiBudWxsXG4gIHBhdGg6IG51bGxcbiAgZHVyYXRpb246IDBcbiAgc29uZ0R1cmF0aW9uOiAwXG5cbiAgc3RhdGU6IG51bGxcblxuICBhbmdsZTogMFxuXG4gIF9jYWNoZWQ6IG51bGxcblxuICAjIFNUQVRFU1xuICBASURMRTogICAgICdJRExFJ1xuICBATEFVTkNIRUQ6ICdMQVVOQ0hFRCdcbiAgQElOX0xPT1A6ICAnSU5fTE9PUCdcbiAgQEFSUklWRUQ6ICAnQVJSSVZFRCdcblxuICBjb25zdHJ1Y3RvcjogKHRhcmdldCwgcmFkaXVzKS0+XG4gICAgc3VwZXJcblxuICAgIEB0YXJnZXQgPSBuZXcgVEhSRUUuVmVjdG9yMyh0YXJnZXQueCwgdGFyZ2V0LnksIDUpXG4gICAgQHJhZGl1cyA9IHJhZGl1c1xuICAgIEBhbmdsZSAgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDJcblxuICAgIEBzZXRTdGF0ZShTcGFjZXNoaXBTdGF0ZS5JRExFKVxuXG4gICAgQHNldHVwKClcblxuICBzZXRSYWRpdXM6IChyYWRpdXMpLT5cbiAgICBAcmFkaXVzID0gcmFkaXVzXG4gICAgQF9jYWNoZWQgPSBAX2NvbXB1dGVQYXRocygpXG5cbiAgc2V0dXA6IC0+XG4gICAgZyA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpXG4gICAgZy52ZXJ0aWNlcy5wdXNoKFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoICAwLCAtNTIuNSwgLTEwKVxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLTEwLCAtNjcuNSwgIDEwKVxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLTUwLCAtNDIuNSwgIDEwKVxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoICAwLCAgNjcuNSwgIDEwKVxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoKzUwLCAtNDIuNSwgIDEwKVxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoKzEwLCAtNjcuNSwgIDEwKVxuICAgIClcbiAgICBnLmZhY2VzLnB1c2goXG4gICAgICBuZXcgVEhSRUUuRmFjZTMoMCwgMywgMSksXG4gICAgICBuZXcgVEhSRUUuRmFjZTMoMSwgMiwgMyksXG4gICAgICBuZXcgVEhSRUUuRmFjZTMoMywgMCwgNSksXG4gICAgICBuZXcgVEhSRUUuRmFjZTMoNSwgNCwgMylcbiAgICApXG4gICAgZy5jb21wdXRlRmFjZU5vcm1hbHMoKVxuICAgIG1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KClcbiAgICBtYXRyaXgubWFrZVJvdGF0aW9uWChNYXRoLlBJKi41KVxuICAgIGcuYXBwbHlNYXRyaXgobWF0cml4KVxuICAgIG1hdHJpeC5tYWtlUm90YXRpb25aKE1hdGguUEkpXG4gICAgZy5hcHBseU1hdHJpeChtYXRyaXgpXG5cbiAgICBAc2hpcCA9IFRIUkVFLlNjZW5lVXRpbHMuY3JlYXRlTXVsdGlNYXRlcmlhbE9iamVjdChnLCBbXG4gICAgICBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweEZGRkZGRiwgc2lkZTogVEhSRUUuRG91YmxlU2lkZSB9KVxuICAgIF0pXG4gICAgQHNoaXAuY2FzdFNoYWRvdyA9IHRydWVcbiAgICBAc2hpcC5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgIEBzaGlwLnNjYWxlLnNldCguMTUsIC4xNSwgLjE1KVxuICAgIEBhZGQoQHNoaXApXG5cbiAgICBAX2NhY2hlZCA9IEBfY29tcHV0ZVBhdGhzKClcbiAgICB2ID0gQF9jYWNoZWQubGF1bmNoZWRQYXRoLmdldFBvaW50QXQoMClcbiAgICBAc2hpcC5wb3NpdGlvbi5zZXQodi54LCB2LnksIHYueilcblxuICBzZXRTdGF0ZTogKHN0YXRlKS0+XG4gICAgQHN0YXRlID0gc3RhdGVcbiAgICBzd2l0Y2ggc3RhdGVcbiAgICAgIHdoZW4gU3BhY2VzaGlwU3RhdGUuSURMRVxuICAgICAgICAjIFNQQUNFLkxPRygnSURMRScpXG4gICAgICAgIEBwYXRoID0gbnVsbFxuICAgICAgd2hlbiBTcGFjZXNoaXBTdGF0ZS5MQVVOQ0hFRFxuICAgICAgICAjIFNQQUNFLkxPRygnTEFVTkNIRUQnKVxuICAgICAgICBAX3Jlc2V0VGltZSgpXG4gICAgICAgIEBwYXRoID0gQF9jYWNoZWQubGF1bmNoZWRQYXRoXG4gICAgICAgIEBkdXJhdGlvbiA9IDEwICogMTAwMFxuXG4gICAgICAgIHYgPSBAcGF0aC5nZXRQb2ludCgwKVxuICAgICAgICBAc2hpcC5wb3NpdGlvbi5zZXQodi54LCB2LnksIHYueilcbiAgICAgIHdoZW4gU3BhY2VzaGlwU3RhdGUuSU5fTE9PUFxuICAgICAgICAjIFNQQUNFLkxPRygnSU5fTE9PUCcpXG4gICAgICAgIEBfcmVzZXRUaW1lKClcbiAgICAgICAgQHBhdGggPSBAdGVzdG5ld2xvb3AoKSAjQF9jYWNoZWQuaW5Mb29wUGF0aFxuICAgICAgICBAZHVyYXRpb24gPSA1ICogMTAwMCNAc29uZ0R1cmF0aW9uXG5cbiAgICAgICAgdiA9IEBwYXRoLmdldFBvaW50KDApXG4gICAgICAgIEBzaGlwLnBvc2l0aW9uLnNldCh2LngsIHYueSwgdi56KVxuXG4gICAgICAgICMgQHNoaXBSb3RhdGlvblogPSBAc2hpcC5yb3RhdGlvbi56XG4gICAgICAgICMgJChAc2hpcC5yb3RhdGlvbikuYW5pbWF0ZSh7XG4gICAgICAgICMgICB6OiAwXG4gICAgICAgICMgfSwge1xuICAgICAgICAjICAgZHVyYXRpb246IDUwMFxuICAgICAgICAjICAgcHJvZ3Jlc3M6IChvYmplY3QpPT5cbiAgICAgICAgIyAgICAgQHNoaXBSb3RhdGlvblogPSBvYmplY3QudHdlZW5zWzBdLm5vd1xuICAgICAgICAjIH0pXG4gICAgICB3aGVuIFNwYWNlc2hpcFN0YXRlLkFSUklWRURcbiAgICAgICAgIyBTUEFDRS5MT0coJ0FSUklWRUQnKVxuICAgICAgICBAcGF0aCA9IG51bGxcbiAgICAgICAgQHBhcmVudC5yZW1vdmUoQClcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldFN0YXRlKFNwYWNlc2hpcFN0YXRlLklETEUpXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cbiAgICBpZiBAc3RhdGUgIT0gU3BhY2VzaGlwU3RhdGUuSURMRSBhbmQgQHN0YXRlICE9IFNwYWNlc2hpcFN0YXRlLkFSUklWRURcblxuICAgICAgdCA9IE1hdGgubWluKEB0aW1lIC8gQGR1cmF0aW9uLCAxKVxuXG4gICAgICBpZiB0ID49IDFcbiAgICAgICAgQF9yZXNldFRpbWUoKVxuICAgICAgICBpZiBAc3RhdGUgPT0gU3BhY2VzaGlwU3RhdGUuTEFVTkNIRURcbiAgICAgICAgICBAc2V0U3RhdGUoU3BhY2VzaGlwU3RhdGUuSU5fTE9PUClcbiAgICAgICAgZWxzZSBpZiBAc3RhdGUgPT0gU3BhY2VzaGlwU3RhdGUuSU5fTE9PUFxuICAgICAgICAgICMgY29uc29sZS5sb2cgJ25leHQgbW92ZT8nXG4gICAgICAgICAgQHBhdGggPSBAdGVzdG5ld2xvb3AoKVxuICAgICAgICAgIEBkdXJhdGlvbiA9ICg1ICsgKE1hdGgucmFuZG9tKCkgKiAxMCkpICogMTAwMFxuICAgICAgICAgICMgQHNldFN0YXRlKFNwYWNlc2hpcFN0YXRlLkFSUklWRUQpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBpZiBAc3RhdGUgPT0gU3BhY2VzaGlwU3RhdGUuTEFVTkNIRURcbiAgICAgICAgQHRpbWUgKz0gZGVsdGFcbiAgICAgICAgdCA9IF9FYXNpbmcuUXVhZHJhdGljRWFzZU91dCh0KVxuXG4gICAgICAjIFRNUFxuICAgICAgaWYgQHN0YXRlID09IFNwYWNlc2hpcFN0YXRlLklOX0xPT1BcbiAgICAgICAgQHRpbWUgKz0gZGVsdGFcbiAgICAgICAgIyBjb25zb2xlLmxvZyBAdGltZVxuXG4gICAgICBAX3Byb2dyZXNzKHQpIGlmIHRcblxuICBfcmVzZXRUaW1lOiAtPlxuICAgIEB0aW1lID0gMFxuXG4gIF9wcm9ncmVzczogKHQpLT5cbiAgICB2ID0gQHBhdGguZ2V0UG9pbnRBdCh0KVxuICAgIEBzaGlwLnBvc2l0aW9uLnNldCh2LngsIHYueSwgdi56KVxuXG4gICAgYWhlYWQgPSAgTWF0aC5taW4odCArIDEwIC8gQHBhdGguZ2V0TGVuZ3RoKCksIDEpXG4gICAgdiA9IEBwYXRoLmdldFBvaW50QXQoYWhlYWQpLm11bHRpcGx5U2NhbGFyKCAxIClcbiAgICBAc2hpcC5sb29rQXQodilcblxuICAgIGlmIEBzdGF0ZSA9PSBTcGFjZXNoaXBTdGF0ZS5MQVVOQ0hFRFxuICAgICAgc2NhbGUgPSAuMjUgKyAoMSAtIHQpICogLjM1XG4gICAgICBAc2hpcC5zY2FsZS5zZXQoc2NhbGUsIHNjYWxlLCBzY2FsZSlcblxuICAgICMgaWYgQHN0YXRlID09IFNwYWNlc2hpcFN0YXRlLklOX0xPT1BcbiAgICAjICAgQHNoaXAucm90YXRpb24uc2V0KEBzaGlwLnJvdGF0aW9uLngsIEBzaGlwLnJvdGF0aW9uLnksIEBzaGlwUm90YXRpb25aKVxuXG4gIF9jb21wdXRlUGF0aHM6IC0+XG4gICAgZnJvbUEgICAgID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIGZyb21BLnggICA9IEB0YXJnZXQueCArIE1hdGguY29zKEBhbmdsZSkgKiA1MDBcbiAgICBmcm9tQS55ICAgPSBAdGFyZ2V0LnkgKyBNYXRoLnNpbihAYW5nbGUpICogNTAwXG4gICAgZnJvbUEueiAgID0gNjAwXG5cbiAgICBwYXRoICAgICAgICAgICA9IG5ldyBUSFJFRS5Jbkxvb3BDdXJ2ZShAdGFyZ2V0LCBAYW5nbGUsIEByYWRpdXMpXG4gICAgcGF0aC5pbnZlcnNlICAgPSB0cnVlXG4gICAgcGF0aC51c2VHb2xkZW4gPSB0cnVlXG5cbiAgICAjIyBDcmVhdGUgcGF0aCBsYXVuY2hlZFxuICAgIG1pZCAgICAgID0gcGF0aC5nZXRQb2ludCgwKVxuICAgIHJlZiAgICAgID0gcGF0aC5nZXRQb2ludCguMDI1KVxuICAgIGFuZ2xlICAgID0gX01hdGguYW5nbGVCZXR3ZWVuUG9pbnRzKG1pZCwgcmVmKSArIE1hdGguUElcbiAgICBkaXN0YW5jZSA9IG1pZC5kaXN0YW5jZVRvKHJlZilcblxuICAgIGN1cnZlUG9pbnQgICA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICBjdXJ2ZVBvaW50LnggPSBtaWQueCArIE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlXG4gICAgY3VydmVQb2ludC55ID0gbWlkLnkgKyBNYXRoLnNpbihhbmdsZSkgKiBkaXN0YW5jZVxuICAgIGN1cnZlUG9pbnQueiA9IG1pZC56XG5cbiAgICB0b0EgICAgPSBwYXRoLmdldFBvaW50KDApXG4gICAgY3VydmUgID0gbmV3IFRIUkVFLkxhdW5jaGVkQ3VydmUoZnJvbUEsIHRvQSlcbiAgICBwb2ludHMgPSBjdXJ2ZS5nZXRQb2ludHMoMTApXG4gICAgIyBwb2ludHMucHVzaCh0b0EpXG5cbiAgICBmb3IgcHQsIGkgaW4gcGF0aC5nZXRQb2ludHMoMTApXG4gICAgICBwb2ludHMucHVzaChwdCkgaWYgaSA+IDBcblxuICAgIGN1cnZlQSA9IF9USFJFRS5IZXJtaXRlQ3VydmUocG9pbnRzKVxuXG4gICAgIyMgQ3JlYXRlIHBhdGggaW4gdGhlIGxvb3BcbiAgICBjdXJ2ZUIgPSBwYXRoI19USFJFRS5IZXJtaXRlQ3VydmUocGF0aC5nZXRQb2ludHMoMTApKVxuXG4gICAgIyBAX2RlYnVnUGF0aChjdXJ2ZUEpXG4gICAgIyBAX2RlYnVnUGF0aChjdXJ2ZUIpXG5cbiAgICAjIEB0ZXN0bmV3bG9vcCgpXG5cbiAgICByZXR1cm4geyBsYXVuY2hlZFBhdGg6IGN1cnZlQSwgaW5Mb29wUGF0aDogY3VydmVCIH1cblxuICB0ZXN0bmV3bG9vcDogLT5cbiAgICBUSFJFRS5OZXdMb29wID0gVEhSRUUuQ3VydmUuY3JlYXRlKFxuICAgICAgKHYwLCByYWRpdXM9IDEwMCwgc3RhcnRBbmdsZT0wKS0+XG4gICAgICAgIEB2MCAgICAgICAgID0gdjBcbiAgICAgICAgQHJhZGl1cyAgICAgPSByYWRpdXNcbiAgICAgICAgQHN0YXJ0QW5nbGUgPSBzdGFydEFuZ2xlXG4gICAgICAgIEByYW5kQW5nbGUgID0gTWF0aC5yYW5kb20oKSAqIE1hdGguUEkgKiAyXG4gICAgICAgIEBkaXJlY3Rpb24gID0gaWYgTWF0aC5yYW5kb20oKSA+IC41IHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG4gICAgICAgIEB0ZXN0ICAgICAgID0gTWF0aC5yYW5kb20oKVxuICAgICAgICByZXR1cm5cbiAgICAgICwgKHQpLT5cbiAgICAgICAgdCAgICAgID0gMSAtIHQgaWYgQGRpcmVjdGlvblxuICAgICAgICBhbmdsZSAgPSAoTWF0aC5QSSAqIDIpICogdFxuICAgICAgICBhbmdsZSAgKz0gQHN0YXJ0QW5nbGVcblxuICAgICAgICB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgICAgIHZlY3Rvci54ID0gQHYwLnggKyBNYXRoLmNvcyhhbmdsZSkgKiBAcmFkaXVzXG4gICAgICAgIHZlY3Rvci55ID0gQHYwLnkgKyBNYXRoLmNvcyhhbmdsZSArIEByYW5kQW5nbGUpICogKEByYWRpdXMgKiAyICogQHRlc3QpXG4gICAgICAgIHZlY3Rvci56ID0gQHYwLnogKyBNYXRoLnNpbihhbmdsZSkgKiBAcmFkaXVzXG4gICAgICAgIHJldHVybiB2ZWN0b3JcblxuICAgICAgICAjIHQgICAgID0gMSAtIHQgaWYgQGludmVyc2VcbiAgICAgICAgIyBpZiBAdXNlR29sZGVuXG4gICAgICAgICMgICAgIHBoaSAgID0gKE1hdGguc3FydCg1KSsxKS8yIC0gMVxuICAgICAgICAjICAgICBnb2xkZW5fYW5nbGUgPSBwaGkgKiBNYXRoLlBJICogMlxuICAgICAgICAjICAgICBhbmdsZSA9IEBzdGFydEFuZ2xlICsgKGdvbGRlbl9hbmdsZSAqIHQpXG4gICAgICAgICMgICAgIGFuZ2xlICs9IE1hdGguUEkgKiAtMS4yMzVcbiAgICAgICAgIyBlbHNlXG4gICAgICAgICMgICAgIGFuZ2xlID0gQHN0YXJ0QW5nbGUgKyAoTWF0aC5QSSAqIDIgKiB0KVxuXG4gICAgICAgICMgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgICAgICAjIHZlY3Rvci54ID0gQHYwLnggKyBNYXRoLmNvcyhhbmdsZSkgKiAoQG1pblJhZGl1cyArIEByYWRpdXMgKiB0KVxuICAgICAgICAjIHZlY3Rvci55ID0gQHYwLnkgKyBNYXRoLnNpbihhbmdsZSkgKiAoQG1pblJhZGl1cyArIEByYWRpdXMgKiB0KVxuICAgICAgICAjIHZlY3Rvci56ID0gQHYwLnpcbiAgICAgICAgIyByZXR1cm4gdmVjdG9yXG4gICAgKVxuXG4gICAgbmV3bG9vcCA9IG5ldyBUSFJFRS5OZXdMb29wKEB0YXJnZXQsIDE1MCwgTWF0aC5QSSotLjUpXG4gICAgcmV0dXJuIG5ld2xvb3BcbiAgICAjIEBfZGVidWdQYXRoKG5ld2xvb3ApXG5cblxuICBfZGVidWdQYXRoOiAocGF0aCwgY29sb3I9MHhGRjAwMDApLT5cbiAgICBnICAgID0gbmV3IFRIUkVFLlR1YmVHZW9tZXRyeShwYXRoLCAyMDAsIC41LCAxMCwgdHJ1ZSlcbiAgICB0dWJlID0gVEhSRUUuU2NlbmVVdGlscy5jcmVhdGVNdWx0aU1hdGVyaWFsT2JqZWN0KCBnLCBbXG4gICAgICBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgICBvcGFjaXR5OiAwLjMsXG4gICAgICAgICAgd2lyZWZyYW1lOiB0cnVlLFxuICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlXG4gICAgICB9KSxcbiAgICAgIG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4RkY4OEZGLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlIH0pXG4gICAgXSlcbiAgICBAYWRkKHR1YmUpXG5cblxuY2xhc3MgU1BBQ0UuREVGQVVMVC5TZXR1cCBleHRlbmRzIFRIUkVFLkdyb3VwXG5cbiAganVrZWJveDogbnVsbFxuICBwbGF5bGlzdDogbnVsbFxuICBjdXJyZW50OiBudWxsXG4gIGNvdmVyOiBudWxsXG5cbiAgb25hZGQ6IGZhbHNlXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcbiAgICBAanVrZWJveCA9IFNQQUNFLkp1a2Vib3hcblxuICBvbkVudGVyOiAoY2FsbGJhY2spLT5cbiAgICBjYWxsYmFjaygpIGlmIGNhbGxiYWNrXG4gICAgQHNldHVwKClcblxuICBvbkV4aXQ6IChjYWxsYmFjayktPlxuICAgIGNhbGxiYWNrKCkgaWYgY2FsbGJhY2tcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSnVrZWJveC5JU19TVE9QUEVELnR5cGUsIEBfZUp1a2Vib3hJc1N0b3BwZWQpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5Db3Zlci5URVhUVVJFU19MT0FERUQudHlwZSwgQF9lQ292ZXJUZXh0dXJlc0xvYWRlZClcblxuICBfZUp1a2Vib3hJc1N0b3BwZWQ6IChlKT0+XG4gICAgQF9sYXVuY2goKVxuXG4gIF9lQ292ZXJUZXh0dXJlc0xvYWRlZDogKGUpPT5cbiAgICBAX2xhdW5jaCgpXG5cbiAgX2xhdW5jaDogLT5cbiAgICBmb3IgdHJhY2sgaW4gQHBsYXlsaXN0XG4gICAgICBAanVrZWJveC5hZGQodHJhY2spXG5cbiAgc2V0dXA6IC0+XG4gICAgQGZldGNoVHJhY2tzKClcbiAgICBAY292ZXIgPSBuZXcgU1BBQ0UuREVGQVVMVC5Db3ZlcigpXG4gICAgQGFkZChAY292ZXIpXG4gICAgQF9ldmVudHMoKVxuXG4gIGZldGNoVHJhY2tzOiAtPlxuICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmVxLm9wZW4oJ0dFVCcsICdyZXNvdXJjZXMvcGxheWxpc3QuanNvbicsIHRydWUpXG4gICAgcmVxLm9ubG9hZCA9IChlKT0+XG4gICAgICBAcGxheWxpc3QgPSBKU09OLnBhcnNlKGUudGFyZ2V0LnJlc3BvbnNlKVxuXG4gICAgICBAY292ZXIubG9hZChAcGxheWxpc3QpXG5cblxuXG4gICAgICAjIGZvciB0cmFjayBpbiBAcGxheWxpc3RcbiAgICAgICMgICBAanVrZWJveC5hZGQodHJhY2spXG5cblxuXG5cbiAgICAgICAgIyAkKCcjY292ZXIgdWwnKS5hcHBlbmQoJzxsaT48L2xpPicpXG4gICAgICAgICMgJCgnI2NvdmVyIHVsIGxpJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChyZXNvdXJjZXMvY292ZXJzLycrdHJhY2suY292ZXIrJyknKVxuICAgICAgIyAkKCcjY292ZXIgdWwgbGk6Zmlyc3QtY2hpbGQnKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICByZXEuc2VuZChudWxsKVxuXG4gICMgbmV4dDogLT5cbiAgIyAgIGlmIEBwbGF5bGlzdC5sZW5ndGggPiAwXG4gICMgICAgIEBjdXJyZW50ID0gQHBsYXlsaXN0LnNoaWZ0KClcbiAgIyAgIEBqdWtlYm94LmFkZChAY3VycmVudClcbiAgIyAgIEByZWZyZXNoQ292ZXIoKVxuICAjICAgQG9uYWRkID0gdHJ1ZVxuXG4gICMgdXBkYXRlOiAoZGVsdGEpLT5cbiAgIyAgIGlmIEBwbGF5bGlzdCBhbmQgQHBsYXlsaXN0Lmxlbmd0aCBhbmQgQGp1a2Vib3guc3RhdGUgPT0gSnVrZWJveFN0YXRlLklTX1NUT1BQRUQgYW5kIG5vdCBAb25hZGRcbiAgIyAgICAgQG5leHQoKVxuICAjICAgZWxzZSBpZiBAanVrZWJveC5zdGF0ZSA9PSBKdWtlYm94U3RhdGUuSVNfUExBWUlORyBhbmQgQG9uYWRkXG4gICMgICAgIEBvbmFkZCA9IGZhbHNlXG5cblxuY2xhc3MgU1BBQ0UuREVGQVVMVC5Db3ZlciBleHRlbmRzIFRIUkVFLkdyb3VwXG5cbiAgbG9hZGluZ01hbmFnZXI6IG51bGxcbiAgaW1hZ2VMb2FkZXI6IG51bGxcblxuICBwbGFuZTogbnVsbFxuXG4gIHBsYXlsaXN0OiBudWxsXG5cbiAgdGV4dHVyZTA6IG51bGxcbiAgdGV4dHVyZTE6IG51bGxcblxuICBmb3Y6IDBcbiAgYXNwZWN0OiAwXG4gIGRpc3RhbmNlOiAwXG5cbiAgdEZhZGU6IDFcbiAgdFNjYWxlOiAxXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcbiAgICBAX3NldHVwKClcbiAgICBAX2V2ZW50cygpXG5cbiAgX2V2ZW50czogLT5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX1BMQVlJTkcudHlwZSwgQF9lVHJhY2tJc1BsYXlpbmcpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5UcmFjay5JU19QQVVTRUQudHlwZSwgQF9lVHJhY2tJc1BhdXNlZClcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRyYWNrLklTX0xPQURFRC50eXBlLCBAX2VUcmFja0lzTG9hZGVkKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSnVrZWJveC5XSUxMX1BMQVkudHlwZSwgQF9lSnVrZWJveFdpbGxQbGF5KVxuXG4gICAgJCgnI2xvYWRpbmcsICNpbmZvcm1hdGlvbiBzcGFuJykub24gJ2NsaWNrJywgKGUpLT5cbiAgICAgIGlmICQoJyNsb2FkaW5nJykuaGFzQ2xhc3MoJ3JlYWR5JykgYW5kIHdpbmRvdy5XZWJBdWRpb0FQSVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgd2luZG93LldlYkF1ZGlvQVBJLnBsYXkoKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICBfZUp1a2Vib3hXaWxsUGxheTogKGUpPT5cbiAgICBAbmV4dCgpXG4gICAgJCgnI2luZm9ybWF0aW9uIGgxJykuYWRkQ2xhc3MoJ2hpZGRlbicpXG4gICAgJCgnI2luZm9ybWF0aW9uIGgyJykuYWRkQ2xhc3MoJ2hpZGRlbicpXG5cbiAgX2VUcmFuc2l0aW9uRW5kZWQ6IChlKT0+XG4gICAgSEVMUEVSLnRyaWdnZXIoRVZFTlQuQ292ZXIuVFJBTlNJVElPTl9FTkRFRClcblxuICBfZVRyYWNrSXNQbGF5aW5nOiAoZSk9PlxuICAgICQoJyNpbmZvcm1hdGlvbiBoMScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxuICAgICQoJyNpbmZvcm1hdGlvbiBoMicpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxuICAgICQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpXG5cbiAgX2VUcmFja0lzUGF1c2VkOiAoZSk9PlxuICAgICQoJyNsb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG4gICAgJCgnI2xvYWRpbmcgaS5pY24nKS5yZW1vdmVDbGFzcygncGxheScpXG4gICAgJCgnI2xvYWRpbmcgaS5pY24nKS5hZGRDbGFzcygncGF1c2UnKVxuXG4gIF9lVHJhY2tJc0xvYWRlZDogKGUpPT5cbiAgICB1bmxlc3MgJCgnI2xvYWRpbmcnKS5oYXNDbGFzcygncmVhZHknKVxuICAgICAgJCgnI2xvYWRpbmcnKS5hZGRDbGFzcygncmVhZHknKVxuICAgICAgJCgnI2xvYWRpbmcgcCcpLmh0bWwoJ1RhcCBpbiB0aGUgbWlkZGxlPGJyPnRvIHBsYXkgb3IgcGF1c2UnKVxuXG4gICAgdHJhY2sgICAgPSBlLm9iamVjdC50cmFja1xuICAgIHRpdGxlICAgID0gdHJhY2suZGF0YS50aXRsZVxuICAgIHVzZXJuYW1lID0gdHJhY2suZGF0YS5hdXRob3JcbiAgICB1c2VyX3VybCA9IHRyYWNrLmRhdGEuYXV0aG9yX3VybFxuXG4gICAgJCgnI2luZm9ybWF0aW9uIGgxJykuaHRtbCh0aXRsZSlcbiAgICAkKCcjaW5mb3JtYXRpb24gaDInKS5odG1sKCdieSA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyt1c2VyX3VybCsnXCI+Jyt1c2VybmFtZSsnPC9hPicpXG5cbiAgICBjc3MgPSBcIlwiXCJcbiAgICAgICAgYSB7IGNvbG9yOiBcIlwiXCIrdHJhY2suZGF0YS5jb2xvcjErXCJcIlwiICFpbXBvcnRhbnQ7IH1cbiAgICAgICAgYm9keSB7IGNvbG9yOiBcIlwiXCIrdHJhY2suZGF0YS5jb2xvcjIrXCJcIlwiICFpbXBvcnRhbnQ7IH1cbiAgICBcIlwiXCJcbiAgICAkKCcuY292ZXItc3R5bGUnKS5odG1sKGNzcylcblxuICAgIG5leHRUcmFjayA9IEBwbGF5bGlzdFswXVxuICAgIGZvciB0cmFja0RhdGEsIGkgaW4gQHBsYXlsaXN0XG4gICAgICBpZiB0cmFja0RhdGEuY292ZXIgPT0gdHJhY2suZGF0YS5jb3ZlclxuICAgICAgICBuZXh0VHJhY2sgPSBAcGxheWxpc3RbaSsxXSBpZiBpKzEgPCBAcGxheWxpc3QubGVuZ3RoXG4gICAgICAgIGJyZWFrXG5cbiAgICBAdGV4dHVyZUxvYWRlci5sb2FkICdyZXNvdXJjZXMvY292ZXJzLycrdHJhY2suZGF0YS5jb3ZlciwgKHRleHR1cmUpPT5cbiAgICAgIEB0ZXh0dXJlMCA9IHRleHR1cmVcbiAgICAgIEBfdGV4dHVyZUxvYWRlZCgpXG4gICAgQHRleHR1cmVMb2FkZXIubG9hZCAncmVzb3VyY2VzL2NvdmVycy8nK25leHRUcmFjay5jb3ZlciwgKHRleHR1cmUpPT5cbiAgICAgIEB0ZXh0dXJlMSA9IHRleHR1cmVcbiAgICAgIEBfdGV4dHVyZUxvYWRlZCgpXG5cbiAgICAkKCcuYmx1cnJpZWQgbGkgZGl2JykuY3NzKHsgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgfSlcbiAgICAkKCcuYmx1cnJpZWQgbGkgZGl2JykubGFzdCgpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwocmVzb3VyY2VzL2NvdmVycy8nK3RyYWNrLmRhdGEuY292ZXIrJyknKVxuICAgICQoJy5ibHVycmllZCBsaSBkaXYnKS5maXJzdCgpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwocmVzb3VyY2VzL2NvdmVycy8nK25leHRUcmFjay5jb3ZlcisnKScpXG5cbiAgX3NldHVwOiAtPlxuICAgIEBsb2FkaW5nTWFuYWdlciAgICAgICAgPSBuZXcgVEhSRUUuTG9hZGluZ01hbmFnZXIoKVxuICAgIEBsb2FkaW5nTWFuYWdlci5vbkxvYWQgPSBAX3NldHVwUGxhbmVcbiAgICBAaW1hZ2VMb2FkZXIgICAgICAgICAgID0gbmV3IFRIUkVFLkltYWdlTG9hZGVyKEBsb2FkaW5nTWFuYWdlcilcbiAgICBAdGV4dHVyZUxvYWRlciAgICAgICAgID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoQGxvYWRpbmdNYW5hZ2VyKVxuICAgIEBsb2FkZXIgICAgICAgICAgICAgICAgPSBuZXcgVEhSRUUuWEhSTG9hZGVyKEBsb2FkaW5nTWFuYWdlcilcblxuICBsb2FkOiAocGxheWxpc3QpLT5cbiAgICBAcGxheWxpc3QgPSBwbGF5bGlzdFxuXG4gICAgZm9yIHRyYWNrIGluIHBsYXlsaXN0XG4gICAgICBAaW1hZ2VMb2FkZXIubG9hZCAncmVzb3VyY2VzL2NvdmVycy8nK3RyYWNrLmNvdmVyLCAoaW1hZ2UpPT5cbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgIEBsb2FkZXIubG9hZCAnYXNzZXRzL3NoYWRlcnMvY292ZXIuZnJhZycsIChjb250ZW50KT0+XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIEBsb2FkZXIubG9hZCAnYXNzZXRzL3NoYWRlcnMvY292ZXIudmVydCcsIChjb250ZW50KT0+XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIEBsb2FkZXIubG9hZCAnYXNzZXRzL3NoYWRlcnMvZ2F1c3NpYW5fYmx1ci5mcmFnJywgKGNvbnRlbnQpPT5cbiAgICAgIHJldHVybiB0cnVlXG5cbiAgX3NldHVwUGxhbmU6ID0+XG4gICAgdmVydGV4U2hhZGVyICAgPSBAbG9hZGVyLmNhY2hlLmZpbGVzWydhc3NldHMvc2hhZGVycy9jb3Zlci52ZXJ0J11cbiAgICBmcmFnbWVudFNoYWRlciA9IEBsb2FkZXIuY2FjaGUuZmlsZXNbJ2Fzc2V0cy9zaGFkZXJzL2NvdmVyLmZyYWcnXVxuXG4gICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoXG4gICAgICB1bmlmb3JtczpcbiAgICAgICAgdGV4dHVyZTA6IHsgdHlwZTogJ3QnLCB2YWx1ZTogW10gfVxuICAgICAgICB0ZXh0dXJlMTogeyB0eXBlOiAndCcsIHZhbHVlOiBbXSB9XG4gICAgICAgIHJlc29sdXRpb246IHsgdHlwZTogJ3YyJywgdmFsdWU6IG5ldyBUSFJFRS5WZWN0b3IyKCkgfVxuICAgICAgICBhVGltZTogeyB0eXBlOiAnZicsIHZhbHVlOiAwIH1cbiAgICAgICAgdEZhZGU6IHsgdHlwZTogJ2YnLCB2YWx1ZTogMCB9XG4gICAgICAgIHRTY2FsZTogeyB0eXBlOiAnZicsIHZhbHVlOiAxIH1cbiAgICAgIHZlcnRleFNoYWRlcjogdmVydGV4U2hhZGVyXG4gICAgICBmcmFnbWVudFNoYWRlcjogZnJhZ21lbnRTaGFkZXJcbiAgICApXG5cblxuICAgIEBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KDEsIDEpLCBtYXRlcmlhbClcbiAgICBAcGxhbmUucG9zaXRpb24ueiA9IC0xXG4gICAgQGFkZChAcGxhbmUpXG5cbiAgICBIRUxQRVIudHJpZ2dlcihFVkVOVC5Db3Zlci5URVhUVVJFU19MT0FERUQpXG5cbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTAudmFsdWUgID0gbmV3IFRIUkVFLlRleHR1cmUoKVxuICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMS52YWx1ZSA9IG5ldyBUSFJFRS5UZXh0dXJlKClcblxuICAgIEBsb2FkaW5nTWFuYWdlci5vbkxvYWQgPSBAX3RleHR1cmVMb2FkZWRcblxuICBfdGV4dHVyZUxvYWRlZDogKGEsIGIsIGMpPT5cbiAgICBpZiBAdGV4dHVyZTAgJiYgQHRleHR1cmUxXG4gICAgICBAc2V0Q292ZXJzKEB0ZXh0dXJlMCwgQHRleHR1cmUxKVxuICAgICAgQHRleHR1cmUwID0gQHRleHR1cmUxID0gbnVsbFxuXG4gIHNldENvdmVyczogKGN1cnJlbnQsIG5leHQpLT5cbiAgICBAdEZhZGUgID0gMVxuICAgIEB0U2NhbGUgPSAxXG4gICAgQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRTY2FsZS52YWx1ZSA9IEB0U2NhbGVcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudEZhZGUudmFsdWUgID0gQHRGYWRlXG5cbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZTAudmFsdWUgID0gY3VycmVudFxuICAgIEBwbGFuZS5tYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlMS52YWx1ZSA9IG5leHRcblxuICAgIHRleHR1cmVXaWR0aCAgPSBjdXJyZW50LmltYWdlLndpZHRoXG4gICAgdGV4dHVyZUhlaWdodCA9IGN1cnJlbnQuaW1hZ2UuaGVpZ2h0XG5cbiAgICBAZm92ICAgICAgPSBtYW5hZ2VyLmNhbWVyYS5mb3YgLyAxODAgKiBNYXRoLlBJXG4gICAgQGFzcGVjdCAgID0gdGV4dHVyZVdpZHRoIC8gdGV4dHVyZUhlaWdodFxuICAgIEBkaXN0YW5jZSA9IG1hbmFnZXIuY2FtZXJhLnBvc2l0aW9uLnogKyAxO1xuICAgIHJhdGlvICAgICA9IE1hdGgubWF4KDEsIG1hbmFnZXIuY2FtZXJhLmFzcGVjdCAvIEBhc3BlY3QpXG5cbiAgICB3aWR0aCAgPSAyICogQGFzcGVjdCAqIE1hdGgudGFuKEBmb3YgLyAyKSAqIEBkaXN0YW5jZSAqIHJhdGlvXG4gICAgaGVpZ2h0ID0gMiAqIE1hdGgudGFuKEBmb3YgLyAyKSAqIEBkaXN0YW5jZSAqIHJhdGlvXG5cbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMucmVzb2x1dGlvbi52YWx1ZS54ID0gd2lkdGhcbiAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMucmVzb2x1dGlvbi52YWx1ZS55ID0gaGVpZ2h0XG4gICAgQHBsYW5lLnNjYWxlLnNldCh3aWR0aCwgaGVpZ2h0LCAxKVxuXG4gIHJlc2l6ZTogLT5cbiAgICB0ZXh0dXJlMCAgICAgID0gQHBsYW5lLm1hdGVyaWFsLnVuaWZvcm1zLnRleHR1cmUwLnZhbHVlXG4gICAgdGV4dHVyZVdpZHRoICA9IHRleHR1cmUwLmltYWdlLndpZHRoXG4gICAgdGV4dHVyZUhlaWdodCA9IHRleHR1cmUwLmltYWdlLmhlaWdodFxuXG4gICAgcmF0aW8gID0gTWF0aC5tYXgoMSwgbWFuYWdlci5jYW1lcmEuYXNwZWN0IC8gQGFzcGVjdClcblxuICAgIEBwbGFuZS5zY2FsZS5zZXQoMiAqIEBhc3BlY3QgKiBNYXRoLnRhbihAZm92IC8gMikgKiBAZGlzdGFuY2UgKiByYXRpbywgMiAqIE1hdGgudGFuKEBmb3YgLyAyKSAqIEBkaXN0YW5jZSAqIHJhdGlvLCAxKVxuXG4gIG5leHQ6IC0+XG4gICAgJChAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudFNjYWxlKS5hbmltYXRlKHsgdmFsdWU6IDAuOSB9LCAzNTApXG4gICAgJChAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMudEZhZGUpLmFuaW1hdGUoeyB2YWx1ZTogMC4wIH0sIDM1MClcbiAgICBzZXRUaW1lb3V0KEBfZVRyYW5zaXRpb25FbmRlZCwgMzUwKVxuXG4gIHVwZGF0ZTogKGRlbHRhKS0+XG4gICAgaWYgQHBsYW5lXG4gICAgICBAcGxhbmUubWF0ZXJpYWwudW5pZm9ybXMuYVRpbWUudmFsdWUgKz0gZGVsdGEgKiAwLjAwMVxuXG5cblxubWFuYWdlciA9IG5ldyBTUEFDRS5TY2VuZU1hbmFnZXIoKVxubWFuYWdlci5jcmVhdGVTY2VuZSgnbWFpbicsIFNQQUNFLk1haW5TY2VuZSlcbm1hbmFnZXIuZ29Ub1NjZW5lKCdtYWluJylcblxuXG4jIHNjZW5lID0gc2NlbmVSVFQgPSBzY2VuZVNjcmVlbiA9IHJlbmRlcmVyID0gcmVuZGVyZXJSVFQgPSByZW5kZXJlclNjcmVlbiA9IGNhbWVyYSA9IGNhbWVyYVJUVCA9IGNhbWVyYVNjcmVlbiA9IG51bGxcblxuIyBzY2VuZVJUVCAgICA9IG5ldyBUSFJFRS5TY2VuZSgpXG4jIHNjZW5lU2NyZWVuID0gbmV3IFRIUkVFLlNjZW5lKClcbiMgc2NlbmUgICAgICAgPSBuZXcgVEhSRUUuU2NlbmUoKVxuXG4jIHJlbmRlcmVyUlRUICAgID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKVxuIyByZW5kZXJlclNjcmVlbiA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKClcbiMgcmVuZGVyZXIgICAgICAgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpXG5cbiMgICAgIEByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHthbnRpYWxpYXM6IHRydWUsIGFscGhhOiBmYWxzZX0pXG4jICAgICAjIEByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKVxuIyAgICAgIyBAcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg1OGIxZmYpKVxuIyAgICAgQHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiMgICAgICMgQHJlbmRlcmVyLnNoYWRvd01hcEVuYWJsZWQgPSB0cnVlXG4jICAgICAjIEByZW5kZXJlci5zaGFkb3dNYXBTb2Z0ICAgID0gdHJ1ZVxuIyAgICAgIyBAcmVuZGVyZXIuc2hhZG93TWFwVHlwZSAgICA9IFRIUkVFLlBDRlNoYWRvd01hcFxuIyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyYXBwZXInKS5hcHBlbmRDaGlsZChAcmVuZGVyZXIuZG9tRWxlbWVudClcbiJdfQ==