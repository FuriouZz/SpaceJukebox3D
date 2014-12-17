var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SPACE.SceneManager = (function() {
  SceneManager.prototype.currentScene = null;

  SceneManager.prototype._scenes = null;

  SceneManager.prototype._stats = null;

  SceneManager.prototype._tick = 0;

  SceneManager.prototype._renderer = null;

  SceneManager.prototype._camera = null;

  function SceneManager(width, height) {
    this._update = __bind(this._update, this);
    this._render = __bind(this._render, this);
    if (this._renderer) {
      return this;
    }
    this._tick = Date.now();
    this._scenes = [];
    this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this._camera.position.setZ(600);
    this._renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this._renderer.setClearColor(new THREE.Color(0xFFF0DB));
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.shadozMapEnabled = true;
    this._renderer.shadozMapSoft = true;
    this._renderer.shadozMapType = THREE.PCFShadowMap;
    document.getElementById('wrapper').appendChild(this._renderer.domElement);
    if (SPACE.ENV === 'development') {
      this._setupStats();
    }
    this._render();
    this._update();
    window.onresize = (function(_this) {
      return function() {
        _this._renderer.setSize(window.innerWidth, window.innerHeight);
        _this._camera.aspect = window.innerWidth / window.innerHeight;
        return _this._camera.updateProjectionMatrix();
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
    this._renderer.render(this.currentScene, this._camera);
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
    if (this._scenes[identifier]) {
      if (this.currentScene) {
        this.currentScene.pause();
      }
      this.currentScene = this._scenes[identifier];
      this.currentScene.resume();
      this.debug();
      return true;
    }
    return false;
  };

  SceneManager.prototype.debug = function() {};

  return SceneManager;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9NYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLGtGQUFBOztBQUFBLEtBQVcsQ0FBQztBQUVWLHlCQUFBLFlBQUEsR0FBYyxJQUFkLENBQUE7O0FBQUEseUJBQ0EsT0FBQSxHQUFTLElBRFQsQ0FBQTs7QUFBQSx5QkFFQSxNQUFBLEdBQVEsSUFGUixDQUFBOztBQUFBLHlCQUdBLEtBQUEsR0FBTyxDQUhQLENBQUE7O0FBQUEseUJBS0EsU0FBQSxHQUFXLElBTFgsQ0FBQTs7QUFBQSx5QkFNQSxPQUFBLEdBQVcsSUFOWCxDQUFBOztBQVFhLEVBQUEsc0JBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUNYLDZDQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsSUFBQSxJQUFJLElBQUMsQ0FBQSxTQUFMO0FBQXFCLGFBQU8sSUFBUCxDQUFyQjtLQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxHQUFMLENBQUEsQ0FGVCxDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsT0FBRCxHQUFhLEVBSmIsQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLEtBQUssQ0FBQyxpQkFBTixDQUF3QixFQUF4QixFQUE0QixNQUFNLENBQUMsVUFBUCxHQUFvQixNQUFNLENBQUMsV0FBdkQsRUFBb0UsR0FBcEUsRUFBeUUsSUFBekUsQ0FOZixDQUFBO0FBQUEsSUFPQSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFsQixDQUF1QixHQUF2QixDQVBBLENBQUE7QUFBQSxJQVdBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsS0FBSyxDQUFDLGFBQU4sQ0FBb0I7QUFBQSxNQUFDLFNBQUEsRUFBVyxJQUFaO0tBQXBCLENBWGpCLENBQUE7QUFBQSxJQVlBLElBQUMsQ0FBQSxTQUFTLENBQUMsYUFBWCxDQUE2QixJQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksUUFBWixDQUE3QixDQVpBLENBQUE7QUFBQSxJQWFBLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBWCxDQUFtQixNQUFNLENBQUMsVUFBMUIsRUFBc0MsTUFBTSxDQUFDLFdBQTdDLENBYkEsQ0FBQTtBQUFBLElBY0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxnQkFBWCxHQUE4QixJQWQ5QixDQUFBO0FBQUEsSUFlQSxJQUFDLENBQUEsU0FBUyxDQUFDLGFBQVgsR0FBOEIsSUFmOUIsQ0FBQTtBQUFBLElBZ0JBLElBQUMsQ0FBQSxTQUFTLENBQUMsYUFBWCxHQUE4QixLQUFLLENBQUMsWUFoQnBDLENBQUE7QUFBQSxJQWlCQSxRQUFRLENBQUMsY0FBVCxDQUF3QixTQUF4QixDQUFrQyxDQUFDLFdBQW5DLENBQStDLElBQUMsQ0FBQSxTQUFTLENBQUMsVUFBMUQsQ0FqQkEsQ0FBQTtBQW1CQSxJQUFBLElBQWtCLEtBQUssQ0FBQyxHQUFOLEtBQWEsYUFBL0I7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBQSxDQUFBO0tBbkJBO0FBQUEsSUFxQkEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQXJCQSxDQUFBO0FBQUEsSUFzQkEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQXRCQSxDQUFBO0FBQUEsSUF3QkEsTUFBTSxDQUFDLFFBQVAsR0FBa0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUEsR0FBQTtBQUNoQixRQUFBLEtBQUMsQ0FBQSxTQUFTLENBQUMsT0FBWCxDQUFtQixNQUFNLENBQUMsVUFBMUIsRUFBc0MsTUFBTSxDQUFDLFdBQTdDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEdBQWtCLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLE1BQU0sQ0FBQyxXQUQ3QyxDQUFBO2VBRUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxzQkFBVCxDQUFBLEVBSGdCO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0F4QmxCLENBRFc7RUFBQSxDQVJiOztBQUFBLHlCQXNDQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsS0FBQSxDQUFBLENBQWQsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQWdCLENBQWhCLENBREEsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQXpCLEdBQW9DLFVBRnBDLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUF6QixHQUFnQyxLQUhoQyxDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBekIsR0FBK0IsS0FKL0IsQ0FBQTtXQUtBLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEyQixJQUFDLENBQUEsTUFBTSxDQUFDLFVBQW5DLEVBTlc7RUFBQSxDQXRDYixDQUFBOztBQUFBLHlCQThDQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsSUFBQSxNQUFNLENBQUMscUJBQVAsQ0FBNkIsSUFBQyxDQUFBLE9BQTlCLENBQUEsQ0FBQTtBQUVBLElBQUEsSUFBRyxDQUFBLElBQUUsQ0FBQSxZQUFGLElBQWtCLElBQUMsQ0FBQSxZQUFZLENBQUMsUUFBZCxDQUFBLENBQXJCO0FBQ0ksWUFBQSxDQURKO0tBRkE7QUFBQSxJQUtBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFtQixJQUFDLENBQUEsWUFBcEIsRUFBa0MsSUFBQyxDQUFBLE9BQW5DLENBTEEsQ0FBQTtBQU9BLElBQUEsSUFBb0IsS0FBSyxDQUFDLEdBQU4sS0FBYSxhQUFqQzthQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFBLEVBQUE7S0FSTztFQUFBLENBOUNULENBQUE7O0FBQUEseUJBd0RBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxRQUFBLENBQUE7QUFBQSxJQUFBLFVBQUEsQ0FBVyxJQUFDLENBQUEsT0FBWixFQUFxQixJQUFBLEdBQU8sS0FBSyxDQUFDLEdBQWxDLENBQUEsQ0FBQTtBQUVBLElBQUEsSUFBRyxDQUFBLElBQUUsQ0FBQSxZQUFGLElBQWtCLElBQUMsQ0FBQSxZQUFZLENBQUMsUUFBZCxDQUFBLENBQXJCO0FBQ0ksWUFBQSxDQURKO0tBRkE7QUFBQSxJQUtBLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFBLENBTEosQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLENBQXFCLENBQUEsR0FBSSxJQUFDLENBQUEsS0FBMUIsQ0FOQSxDQUFBO1dBT0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQVJGO0VBQUEsQ0F4RFQsQ0FBQTs7QUFBQSx5QkFrRUEsV0FBQSxHQUFhLFNBQUMsVUFBRCxFQUFhLE1BQWIsRUFBcUIsV0FBckIsR0FBQTtBQUNYLFFBQUEsS0FBQTtBQUFBLElBQUEsSUFBRyxJQUFDLENBQUEsT0FBUSxDQUFBLFVBQUEsQ0FBWjtBQUNJLGFBQU8sTUFBUCxDQURKO0tBQUE7QUFBQSxJQUdBLEtBQUEsR0FBWSxJQUFBLE1BQUEsQ0FBQSxDQUhaLENBQUE7QUFBQSxJQUlBLElBQUMsQ0FBQSxPQUFRLENBQUEsVUFBQSxDQUFULEdBQXVCLEtBSnZCLENBQUE7QUFNQSxXQUFPLEtBQVAsQ0FQVztFQUFBLENBbEViLENBQUE7O0FBQUEseUJBMkVBLFNBQUEsR0FBVyxTQUFDLFVBQUQsR0FBQTtBQUNULElBQUEsSUFBRyxJQUFDLENBQUEsT0FBUSxDQUFBLFVBQUEsQ0FBWjtBQUNJLE1BQUEsSUFBeUIsSUFBQyxDQUFBLFlBQTFCO0FBQUEsUUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLEtBQWQsQ0FBQSxDQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLE9BQVEsQ0FBQSxVQUFBLENBRHpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxDQUFBLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUhBLENBQUE7QUFJQSxhQUFPLElBQVAsQ0FMSjtLQUFBO0FBT0EsV0FBTyxLQUFQLENBUlM7RUFBQSxDQTNFWCxDQUFBOztBQUFBLHlCQXFGQSxLQUFBLEdBQU8sU0FBQSxHQUFBLENBckZQLENBQUE7O3NCQUFBOztJQUZGLENBQUEiLCJmaWxlIjoiZW5naW5lL01hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTUEFDRS5TY2VuZU1hbmFnZXJcblxuICBjdXJyZW50U2NlbmU6IG51bGxcbiAgX3NjZW5lczogbnVsbFxuICBfc3RhdHM6IG51bGxcbiAgX3RpY2s6IDBcblxuICBfcmVuZGVyZXI6IG51bGxcbiAgX2NhbWVyYTogICBudWxsXG5cbiAgY29uc3RydWN0b3I6ICh3aWR0aCwgaGVpZ2h0KS0+XG4gICAgaWYgKEBfcmVuZGVyZXIpIHRoZW4gcmV0dXJuIEBcblxuICAgIEBfdGljayA9IERhdGUubm93KClcblxuICAgIEBfc2NlbmVzICAgPSBbXVxuXG4gICAgQF9jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApXG4gICAgQF9jYW1lcmEucG9zaXRpb24uc2V0Wig2MDApXG4gICAgIyBAX2NhbWVyYS5wb3NpdGlvbi5zZXRZKDUwMClcbiAgICAjIEBfY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSlcblxuICAgIEBfcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7YW50aWFsaWFzOiB0cnVlfSlcbiAgICBAX3JlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4RkZGMERCKSlcbiAgICBAX3JlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiAgICBAX3JlbmRlcmVyLnNoYWRvek1hcEVuYWJsZWQgPSB0cnVlXG4gICAgQF9yZW5kZXJlci5zaGFkb3pNYXBTb2Z0ICAgID0gdHJ1ZVxuICAgIEBfcmVuZGVyZXIuc2hhZG96TWFwVHlwZSAgICA9IFRIUkVFLlBDRlNoYWRvd01hcFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJykuYXBwZW5kQ2hpbGQoQF9yZW5kZXJlci5kb21FbGVtZW50KVxuXG4gICAgQF9zZXR1cFN0YXRzKCkgaWYgU1BBQ0UuRU5WID09ICdkZXZlbG9wbWVudCdcblxuICAgIEBfcmVuZGVyKClcbiAgICBAX3VwZGF0ZSgpXG5cbiAgICB3aW5kb3cub25yZXNpemUgPSA9PlxuICAgICAgQF9yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgICBAX2NhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgQF9jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG5cbiAgX3NldHVwU3RhdHM6IC0+XG4gICAgQF9zdGF0cyA9IG5ldyBTdGF0cygpXG4gICAgQF9zdGF0cy5zZXRNb2RlKDApXG4gICAgQF9zdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgIEBfc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCdcbiAgICBAX3N0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBAX3N0YXRzLmRvbUVsZW1lbnQgKVxuXG4gIF9yZW5kZXI6ID0+XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShAX3JlbmRlcilcblxuICAgIGlmICFAY3VycmVudFNjZW5lIG9yIEBjdXJyZW50U2NlbmUuaXNQYXVzZWQoKVxuICAgICAgICByZXR1cm5cblxuICAgIEBfcmVuZGVyZXIucmVuZGVyKCBAY3VycmVudFNjZW5lLCBAX2NhbWVyYSApXG5cbiAgICBAX3N0YXRzLnVwZGF0ZSgpIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG5cbiAgX3VwZGF0ZTogPT5cbiAgICBzZXRUaW1lb3V0KEBfdXBkYXRlLCAxMDAwIC8gU1BBQ0UuRlBTKVxuXG4gICAgaWYgIUBjdXJyZW50U2NlbmUgb3IgQGN1cnJlbnRTY2VuZS5pc1BhdXNlZCgpXG4gICAgICAgIHJldHVyblxuXG4gICAgYyA9IERhdGUubm93KClcbiAgICBAY3VycmVudFNjZW5lLnVwZGF0ZShjIC0gQF90aWNrKVxuICAgIEBfdGljayA9IGNcblxuICBjcmVhdGVTY2VuZTogKGlkZW50aWZpZXIsIGFTY2VuZSwgaW50ZXJhY3RpdmUpLT5cbiAgICBpZiBAX3NjZW5lc1tpZGVudGlmaWVyXVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICBzY2VuZSA9IG5ldyBhU2NlbmUoKVxuICAgIEBfc2NlbmVzW2lkZW50aWZpZXJdID0gc2NlbmVcblxuICAgIHJldHVybiBzY2VuZVxuXG4gIGdvVG9TY2VuZTogKGlkZW50aWZpZXIpLT5cbiAgICBpZiBAX3NjZW5lc1tpZGVudGlmaWVyXVxuICAgICAgICBAY3VycmVudFNjZW5lLnBhdXNlKCkgaWYgQGN1cnJlbnRTY2VuZVxuICAgICAgICBAY3VycmVudFNjZW5lID0gQF9zY2VuZXNbaWRlbnRpZmllcl1cbiAgICAgICAgQGN1cnJlbnRTY2VuZS5yZXN1bWUoKVxuICAgICAgICBAZGVidWcoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgZGVidWc6IC0+XG4gICAgIyAjIHRyaWFuZ2xlU2hhcGUgPSBuZXcgVEhSRUUuU2hhcGUoKVxuICAgICMgIyB0cmlhbmdsZVNoYXBlLm1vdmVUbyggIDgwLCAyMCApXG4gICAgIyAjIHRyaWFuZ2xlU2hhcGUubGluZVRvKCAgNDAsIDgwIClcbiAgICAjICMgdHJpYW5nbGVTaGFwZS5saW5lVG8oIDEyMCwgODAgKVxuICAgICMgIyB0cmlhbmdsZVNoYXBlLmxpbmVUbyggIDgwLCAyMCApXG5cbiAgICAjICMgY29uc29sZS5sb2cgdHJpYW5nbGVTaGFwZVxuXG4gICAgIyAjIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkoIHRyaWFuZ2xlU2hhcGUgKVxuICAgICMgIyBtYXQgICAgICA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge2NvbG9yOiAweDAwZmYwMCwgc2lkZTogVEhSRUUuRG91YmxlU2lkZX0gKVxuICAgICMgIyBAdHIgICAgICAgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0KVxuICAgICMgIyBAY3VycmVudFNjZW5lLmFkZChAdHIpXG5cbiAgICAjICMgQF9jYW1lcmEubG9va0F0KEBjdXJyZW50U2NlbmUuZXF1YWxpemVyLmNlbnRlcilcblxuICAgICMgc2NlbmUgPSBuZXcgU1BBQ0UuU2NlbmUoKVxuXG4gICAgIyBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNDUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApIzc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKVxuICAgICMgY2FtZXJhLnBvc2l0aW9uLnNldFooNTAwKVxuXG4gICAgIyByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHthbnRpYWxpYXM6IHRydWV9KVxuICAgICMgIyByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDAwODhGRikpXG4gICAgIyByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgIyAjIHJlbmRlcmVyLnNoYWRvek1hcEVuYWJsZWQgPSB0cnVlXG4gICAgIyAjIHJlbmRlcmVyLnNoYWRvek1hcFNvZnQgICAgPSB0cnVlXG4gICAgIyAjIHJlbmRlcmVyLnNoYWRvek1hcFR5cGUgICAgPSBUSFJFRS5QQ0ZTaGFkb3dNYXBcblxuICAgICMgY3ViZUdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDEwMCwgMTAwLCAxMDApO1xuICAgICMgY3ViZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjogMHhmZjAwMDB9KTtcbiAgICAjIGN1YmUgPSBuZXcgVEhSRUUuTWVzaChjdWJlR2VvbWV0cnksIGN1YmVNYXRlcmlhbCk7XG5cbiAgICAjIGN1YmUucG9zaXRpb24ueCA9IDFcbiAgICAjIGN1YmUucG9zaXRpb24ueSA9IDFcbiAgICAjIGN1YmUucG9zaXRpb24ueiA9IDFcblxuICAgICMgc2NlbmUuYWRkKGN1YmUpXG5cbiAgICAjIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJykuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudClcblxuICAgICMgcmVuZGVyID0gLT5cbiAgICAjICAgY3ViZS5yb3RhdGlvbi54ICs9IDAuMDJcbiAgICAjICAgY3ViZS5yb3RhdGlvbi55ICs9IDAuMDJcbiAgICAjICAgY3ViZS5yb3RhdGlvbi56ICs9IDAuMDJcblxuICAgICMgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSlcbiAgICAjICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcilcbiAgICAjIHJlbmRlcigpXG4iXX0=