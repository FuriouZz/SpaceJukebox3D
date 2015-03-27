(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.SPACE = window.SPACE || {};

SPACE.DEFAULT = {};

require('./../environments/default/Setup');

require('./../environments/default/Cover');



},{"./../environments/default/Cover":8,"./../environments/default/Setup":9}],2:[function(require,module,exports){
window.SPACE = window.SPACE || {};

require('./../config');

require('./../events');

require('./../enums');

require('./../helpers/Helpers');

require('./../helpers/Coffee');

require('./../helpers/Maths');

require('./../helpers/Threejs');

require('./../helpers/Easing');

require('./../engine/Scene');

require('./../engine/Manager');

require('./../scenes/Main');

require('./../sounds/Soundcloud');

require('./../sounds/SearchEngine');

require('./../sounds/Jukebox');

require('./../sounds/Track');

require('./../sounds/WebAudioAPI');

require('./../graphics/Equalizer');

require('./../graphics/Spaceship');

require('./../app');



},{"./../app":3,"./../config":4,"./../engine/Manager":5,"./../engine/Scene":6,"./../enums":7,"./../events":10,"./../graphics/Equalizer":11,"./../graphics/Spaceship":12,"./../helpers/Coffee":13,"./../helpers/Easing":14,"./../helpers/Helpers":15,"./../helpers/Maths":16,"./../helpers/Threejs":17,"./../scenes/Main":18,"./../sounds/Jukebox":19,"./../sounds/SearchEngine":20,"./../sounds/Soundcloud":21,"./../sounds/Track":22,"./../sounds/WebAudioAPI":23}],3:[function(require,module,exports){
var manager;

manager = new SPACE.SceneManager();

manager.createScene('main', SPACE.MainScene);

manager.goToScene('main');



},{}],4:[function(require,module,exports){
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

SPACE.ASSERT = function(condition, action) {
  if (condition) {
    action();
  }
  return condition;
};



},{}],5:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
    this.renderer.render(this.currentScene, this.camera);
    if (SPACE.ENV === 'development') {
      return this._stats.update();
    }
  };

  SceneManager.prototype._update = function() {
    var c;
    setTimeout(this._update, 1000 / SPACE.FPS);
    if (!this.currentScene || this.currentScene.isPaused()) {
      return;
    }
    c = Date.now();
    this.currentScene.update(c - this._tick);
    return this._tick = c;
  };

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



},{}],6:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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
    var child, i, len, ref, results;
    ref = this.children;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      results.push(this.updateObj(child, delta));
    }
    return results;
  };

  Scene.prototype.updateObj = function(obj, delta) {
    var child, i, len, ref, results;
    if (typeof obj.update === 'function') {
      obj.update(delta);
    }
    if (obj.hasOwnProperty('children') && obj.children.length > 0) {
      ref = obj.children;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        results.push(this.updateObj(child, delta));
      }
      return results;
    }
  };

  Scene.prototype.resize = function() {
    var child, i, len, ref, results;
    ref = this.children;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      results.push(this.resizeObj(child));
    }
    return results;
  };

  Scene.prototype.resizeObj = function(obj) {
    var child, i, len, ref, results;
    if (typeof obj.resize === 'function') {
      obj.resize();
    }
    if (obj.hasOwnProperty('children') && obj.children.length > 0) {
      ref = obj.children;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        results.push(this.resizeObj(child));
      }
      return results;
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



},{}],7:[function(require,module,exports){
window.Keyboard = {
  ENTER: 13,
  UP: 38,
  DOWN: 40,
  ESC: 27,
  DELETE: 46
};

window.SpaceshipState = {
  IDLE: 'idle',
  LAUNCHED: 'launched',
  IN_LOOP: 'in_loop',
  ARRIVED: 'arrived'
};

window.SearchEngineState = {
  OPENED: 'opened',
  CLOSED: 'closed',
  SEARCH: 'search',
  TRACK_SELECTED: 'track_selected'
};

window.JukeboxState = {
  IS_PLAYING: 'is_playing',
  IS_STOPPED: 'is_stopped',
  TRACK_STOPPED: 'track_stopped'
};

window.AirportState = {
  IDLE: 'idle',
  SENDING: 'sending'
};

Object.freeze(Keyboard);

Object.freeze(SpaceshipState);

Object.freeze(SearchEngineState);

Object.freeze(JukeboxState);

Object.freeze(AirportState);



},{}],8:[function(require,module,exports){
SPACE.DEFAULT.Cover = (function() {
  function Cover() {
    this._events();
  }

  Cover.prototype._events = function() {
    return document.addEventListener(TRACK.IS_PLAYING.type, this._eTrackIsPlaying);
  };

  Cover.prototype._eTrackIsPlaying = function(e) {
    var css, title, track, user_url, username;
    track = e.object.track;
    title = track.data.title;
    username = track.data.author;
    user_url = track.data.author_url;
    $('#cover h1').html(title);
    $('#cover h2').html('by <a href="' + user_url + '">' + username + '</a>');
    css = "a { color: " + track.data.color1 + " !important; }\nbody { color: " + track.data.color2 + " !important; }";
    $('.cover-style').html(css);
    return $('#wrapper').css('background-image', 'url(resources/covers/' + track.data.cover + ')');
  };

  Cover.prototype.update = function() {};

  return Cover;

})();



},{}],9:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SPACE.DEFAULT.Setup = (function(superClass) {
  extend(Setup, superClass);

  Setup.prototype.jukebox = null;

  Setup.prototype.playlist = null;

  Setup.prototype.current = null;

  Setup.prototype.cover = null;

  Setup.prototype.onadd = false;

  function Setup() {
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
    return document.addEventListener(JUKEBOX.IS_STOPPED.type, this._eJukeboxIsStopped);
  };

  Setup.prototype._eJukeboxIsStopped = function(e) {
    var i, len, ref, results, track;
    ref = this.playlist;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      track = ref[i];
      results.push(this.jukebox.add(track));
    }
    return results;
  };

  Setup.prototype.setup = function() {
    this.fetchTracks();
    this.cover = new SPACE.DEFAULT.Cover();
    return this._events();
  };

  Setup.prototype.fetchTracks = function() {
    var req;
    req = new XMLHttpRequest();
    req.open('GET', 'resources/playlist.json', true);
    req.onload = (function(_this) {
      return function(e) {
        var i, len, ref, track;
        _this.playlist = JSON.parse(e.target.response);
        ref = _this.playlist;
        for (i = 0, len = ref.length; i < len; i++) {
          track = ref[i];
          _this.jukebox.add(track);
        }
        return $('#wrapper').css('background-image', 'url(resources/covers/' + _this.playlist[0].cover + ')');
      };
    })(this);
    return req.send(null);
  };

  return Setup;

})(THREE.Group);



},{}],10:[function(require,module,exports){
window.JUKEBOX = {
  TRACK_ON_ADD: new Event('jukebox_track_on_add'),
  TRACK_ON_ADD_ERROR: new Event('jukebox_track_on_add_error'),
  TRACK_ADDED: new Event('jukebox_track_added'),
  ON_PLAY: new Event('jukebox_on_play'),
  ON_STOP: new Event('jukebox_on_stop'),
  IS_PLAYING: new Event('jukebox_is_playing'),
  IS_STOPPED: new Event('jukebox_is_stopped'),
  IS_SEARCHING: new Event('jukebox_is_searching')
};

Object.freeze(JUKEBOX);

window.TRACK = {
  IS_PLAYING: new Event('track_is_playing'),
  IS_PAUSED: new Event('track_is_paused'),
  IS_STOPPED: new Event('track_is_stopped')
};

Object.freeze(TRACK);



},{}],11:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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
    if (SPACE.Jukebox.state === JukeboxState.IS_PLAYING && SPACE.Jukebox.waveformData.mono) {
      this.setValues(SPACE.Jukebox.waveformData.mono);
    }
    return setTimeout(this.updateValues, this.interpolationTime * .5);
  };

  Equalizer.prototype.updateGeometries = function(create) {
    var angle, from, geometry, i, j, len, length, line, ref, results, to;
    if (create == null) {
      create = false;
    }
    ref = this._values;
    results = [];
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
        results.push(this.add(line));
      } else {
        line = this.lines[i];
        line.geometry.vertices[0] = from;
        line.geometry.vertices[1] = to;
        line.geometry.vertices[2] = from;
        results.push(line.geometry.verticesNeedUpdate = true);
      }
    }
    return results;
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

  return Equalizer;

})(THREE.Group);



},{}],12:[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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



},{}],13:[function(require,module,exports){
window._Coffee = window._Coffee || {
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



},{}],14:[function(require,module,exports){
window._Easing = window._Easing || {
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



},{}],15:[function(require,module,exports){
window._H = window._H || {
  trigger: function(e, object) {
    e.object = object;
    return document.dispatchEvent(e);
  },
  retina: function(value) {
    var a, array, i, key, len, o, object;
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
      for (key = i = 0, len = array.length; i < len; key = ++i) {
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



},{}],16:[function(require,module,exports){
window._Math = window._Math || {
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



},{}],17:[function(require,module,exports){
window._THREE = window._THREE || {
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



},{}],18:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SPACE.MainScene = (function(superClass) {
  extend(MainScene, superClass);

  MainScene.prototype.equalizer = null;

  MainScene.prototype.jukebox = null;

  MainScene.prototype.loadingManager = null;

  MainScene.prototype.loader = null;

  function MainScene() {
    this.setup = bind(this.setup, this);
    var env;
    MainScene.__super__.constructor.apply(this, arguments);
    this._events();
    this.setup();
    env = new SPACE.DEFAULT.Setup();
    env.onEnter();
    this.add(env);
  }

  MainScene.prototype._events = function() {
    return document.addEventListener(SPACE.SoundCloud.IS_CONNECTED.type, this.setup);
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



},{}],19:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
    this.setAirportState(AirportState.IDLE);
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
    this.setState(JukeboxState.IS_STOPPED);
  }

  Jukebox.prototype._events = function() {
    document.addEventListener(TRACK.IS_PLAYING.type, this._eTrackIsPlaying);
    return document.addEventListener(TRACK.IS_STOPPED.type, this._eTrackIsStopped);
  };

  Jukebox.prototype._eTrackIsPlaying = function(e) {
    return this.setState(JukeboxState.IS_PLAYING);
  };

  Jukebox.prototype._eTrackIsStopped = function(e) {
    if (this.playlist.length > 0) {
      return this.setState(JukeboxState.TRACK_STOPPED);
    } else {
      return this.setState(JukeboxState.IS_STOPPED);
    }
  };

  Jukebox.prototype._createTrack = function(data) {
    var track;
    track = new SPACE.Track(data);
    track.pendingDuration = this._calcPending(this.playlist.length - 1);
    this.playlist.push(track);
    _H.trigger(JUKEBOX.TRACK_ADDED, {
      track: track
    });
    return SPACE.LOG('Sound added: ' + track.data.title);
  };

  Jukebox.prototype._calcPending = function(position) {
    var duration, i, j, len, ref, track;
    duration = 0;
    ref = this.playlist;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      track = ref[i];
      duration += track.data.duration;
      if (i === position) {
        break;
      }
    }
    return duration;
  };

  Jukebox.prototype.predefinedPlaylist = function() {
    var i, j, len, list, results, url;
    list = [];
    list = _Coffee.shuffle(list);
    results = [];
    for (i = j = 0, len = list.length; j < len; i = ++j) {
      url = list[i];
      results.push(this.add(list[i]));
    }
    return results;
  };

  Jukebox.prototype.setState = function(state) {
    this.state = state;
    switch (state) {
      case JukeboxState.IS_PLAYING:
        return this.current.whileplayingCallback = this._whileplaying;
      default:
        if (this.current) {
          this.current.destruct();
        }
        this.current = null;
        if (this.state === JukeboxState.IS_STOPPED) {
          console.log('STOPPED');
          return _H.trigger(JUKEBOX.IS_STOPPED);
        }
    }
  };

  Jukebox.prototype.setAirportState = function(state) {
    var spaceship;
    this.airportState = state;
    switch (state) {
      case AirportState.IDLE:
        return SPACE.LOG('Waiting for new spaceship');
      case AirportState.SENDING:
        spaceship = this.airport.shift();
        spaceship.setState(SpaceshipState.LAUNCHED);
        return setTimeout(this.setAirportState, 60 * 1000);
      default:
        return this.setAirportState(AirportState.IDLE);
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
    var j, len, list, ref, track;
    list = [];
    ref = this.playlist;
    for (j = 0, len = ref.length; j < len; j++) {
      track = ref[j];
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



},{}],20:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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



},{}],21:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SPACE.SoundCloud = (function() {
  SoundCloud.prototype.client_id = null;

  SoundCloud.prototype.redirect_uri = null;

  SoundCloud.prototype.token = null;

  SoundCloud.IS_CONNECTED = (function() {
    return new Event('soundcloud_connected');
  })();

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
        return _H.trigger(SPACE.SoundCloud.IS_CONNECTED);
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



},{}],22:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
    document.addEventListener(TRACK.IS_PLAYING.type, this._eTrackIsPlaying);
    return document.addEventListener(TRACK.IS_STOPPED.type, this._eTrackIsStopped);
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
    document.removeEventListener(TRACK.IS_PLAYING.type, this._eTrackIsPlaying);
    document.removeEventListener(TRACK.IS_STOPPED.type, this._eTrackIsStopped);
    return this.api.destroy();
  };

  Track.prototype._starting = function(sound) {
    this.sound = sound;
    return SPACE.LOG('Next: ' + this.data.title);
  };

  Track.prototype._onplay = function() {
    return _H.trigger(TRACK.IS_PLAYING, {
      track: this
    });
  };

  Track.prototype._onfinish = function() {
    _H.trigger(TRACK.IS_STOPPED, {
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



},{}],23:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
    console.log(this.src);
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



},{}]},{},[1,2]);

//# sourceMappingURL=main.js.map