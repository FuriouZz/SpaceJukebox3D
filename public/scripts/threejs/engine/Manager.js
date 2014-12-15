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
    this._camera.position.setZ(500);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRocmVlanMvZW5naW5lL01hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsa0ZBQUE7O0FBQUEsS0FBVyxDQUFDO0FBRVYseUJBQUEsWUFBQSxHQUFjLElBQWQsQ0FBQTs7QUFBQSx5QkFDQSxPQUFBLEdBQVMsSUFEVCxDQUFBOztBQUFBLHlCQUVBLE1BQUEsR0FBUSxJQUZSLENBQUE7O0FBQUEseUJBR0EsS0FBQSxHQUFPLENBSFAsQ0FBQTs7QUFBQSx5QkFLQSxTQUFBLEdBQVcsSUFMWCxDQUFBOztBQUFBLHlCQU1BLE9BQUEsR0FBVyxJQU5YLENBQUE7O0FBUWEsRUFBQSxzQkFBQyxLQUFELEVBQVEsTUFBUixHQUFBO0FBQ1gsNkNBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSxJQUFBLElBQUksSUFBQyxDQUFBLFNBQUw7QUFBcUIsYUFBTyxJQUFQLENBQXJCO0tBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBQSxDQUZULENBQUE7QUFBQSxJQUlBLElBQUMsQ0FBQSxPQUFELEdBQWEsRUFKYixDQUFBO0FBQUEsSUFNQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsS0FBSyxDQUFDLGlCQUFOLENBQXdCLEVBQXhCLEVBQTRCLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLE1BQU0sQ0FBQyxXQUF2RCxFQUFvRSxHQUFwRSxFQUF5RSxJQUF6RSxDQU5mLENBQUE7QUFBQSxJQU9BLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQWxCLENBQXVCLEdBQXZCLENBUEEsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxLQUFLLENBQUMsYUFBTixDQUFvQjtBQUFBLE1BQUMsU0FBQSxFQUFXLElBQVo7S0FBcEIsQ0FUakIsQ0FBQTtBQUFBLElBVUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxhQUFYLENBQTZCLElBQUEsS0FBSyxDQUFDLEtBQU4sQ0FB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QUFELENBQUEsQ0FIQSxDQUFBO0FBSUEsYUFBTyxJQUFQLENBTEo7S0FBQTtBQU9BLFdBQU8sS0FBUCxDQVJTO0VBQUEsQ0F6RVgsQ0FBQTs7QUFBQSx5QkFtRkEsS0FBQSxHQUFPLFNBQUEsR0FBQSxDQW5GUCxDQUFBOztzQkFBQTs7SUFGRixDQUFBIiwiZmlsZSI6InRocmVlanMvZW5naW5lL01hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTUEFDRS5TY2VuZU1hbmFnZXJcblxuICBjdXJyZW50U2NlbmU6IG51bGxcbiAgX3NjZW5lczogbnVsbFxuICBfc3RhdHM6IG51bGxcbiAgX3RpY2s6IDBcblxuICBfcmVuZGVyZXI6IG51bGxcbiAgX2NhbWVyYTogICBudWxsXG5cbiAgY29uc3RydWN0b3I6ICh3aWR0aCwgaGVpZ2h0KS0+XG4gICAgaWYgKEBfcmVuZGVyZXIpIHRoZW4gcmV0dXJuIEBcblxuICAgIEBfdGljayA9IERhdGUubm93KClcblxuICAgIEBfc2NlbmVzICAgPSBbXVxuXG4gICAgQF9jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApXG4gICAgQF9jYW1lcmEucG9zaXRpb24uc2V0Wig1MDApXG5cbiAgICBAX3JlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe2FudGlhbGlhczogdHJ1ZX0pXG4gICAgQF9yZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweEZGRjBEQikpXG4gICAgQF9yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgQF9yZW5kZXJlci5zaGFkb3pNYXBFbmFibGVkID0gdHJ1ZVxuICAgIEBfcmVuZGVyZXIuc2hhZG96TWFwU29mdCAgICA9IHRydWVcbiAgICBAX3JlbmRlcmVyLnNoYWRvek1hcFR5cGUgICAgPSBUSFJFRS5QQ0ZTaGFkb3dNYXBcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpLmFwcGVuZENoaWxkKEBfcmVuZGVyZXIuZG9tRWxlbWVudClcblxuICAgIEBfc2V0dXBTdGF0cygpIGlmIFNQQUNFLkVOViA9PSAnZGV2ZWxvcG1lbnQnXG5cbiAgICBAX3JlbmRlcigpXG4gICAgQF91cGRhdGUoKVxuXG4gICAgd2luZG93Lm9ucmVzaXplID0gPT5cbiAgICAgIEBfcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KVxuICAgICAgQF9jYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgIEBfY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuXG4gIF9zZXR1cFN0YXRzOiAtPlxuICAgIEBfc3RhdHMgPSBuZXcgU3RhdHMoKVxuICAgIEBfc3RhdHMuc2V0TW9kZSgwKVxuICAgIEBfc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgICBAX3N0YXRzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnXG4gICAgQF9zdGF0cy5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggQF9zdGF0cy5kb21FbGVtZW50IClcblxuICBfcmVuZGVyOiA9PlxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoQF9yZW5kZXIpXG5cbiAgICBpZiAhQGN1cnJlbnRTY2VuZSBvciBAY3VycmVudFNjZW5lLmlzUGF1c2VkKClcbiAgICAgICAgcmV0dXJuXG5cbiAgICBAX3JlbmRlcmVyLnJlbmRlciggQGN1cnJlbnRTY2VuZSwgQF9jYW1lcmEgKVxuXG4gICAgQF9zdGF0cy51cGRhdGUoKSBpZiBTUEFDRS5FTlYgPT0gJ2RldmVsb3BtZW50J1xuXG4gIF91cGRhdGU6ID0+XG4gICAgc2V0VGltZW91dChAX3VwZGF0ZSwgMTAwMCAvIFNQQUNFLkZQUylcblxuICAgIGlmICFAY3VycmVudFNjZW5lIG9yIEBjdXJyZW50U2NlbmUuaXNQYXVzZWQoKVxuICAgICAgICByZXR1cm5cblxuICAgIGMgPSBEYXRlLm5vdygpXG4gICAgQGN1cnJlbnRTY2VuZS51cGRhdGUoYyAtIEBfdGljaylcbiAgICBAX3RpY2sgPSBjXG5cbiAgY3JlYXRlU2NlbmU6IChpZGVudGlmaWVyLCBhU2NlbmUsIGludGVyYWN0aXZlKS0+XG4gICAgaWYgQF9zY2VuZXNbaWRlbnRpZmllcl1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgc2NlbmUgPSBuZXcgYVNjZW5lKClcbiAgICBAX3NjZW5lc1tpZGVudGlmaWVyXSA9IHNjZW5lXG5cbiAgICByZXR1cm4gc2NlbmVcblxuICBnb1RvU2NlbmU6IChpZGVudGlmaWVyKS0+XG4gICAgaWYgQF9zY2VuZXNbaWRlbnRpZmllcl1cbiAgICAgICAgQGN1cnJlbnRTY2VuZS5wYXVzZSgpIGlmIEBjdXJyZW50U2NlbmVcbiAgICAgICAgQGN1cnJlbnRTY2VuZSA9IEBfc2NlbmVzW2lkZW50aWZpZXJdXG4gICAgICAgIEBjdXJyZW50U2NlbmUucmVzdW1lKClcbiAgICAgICAgQGRlYnVnKClcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgIHJldHVybiBmYWxzZVxuXG4gIGRlYnVnOiAtPlxuICAgICMgIyB0cmlhbmdsZVNoYXBlID0gbmV3IFRIUkVFLlNoYXBlKClcbiAgICAjICMgdHJpYW5nbGVTaGFwZS5tb3ZlVG8oICA4MCwgMjAgKVxuICAgICMgIyB0cmlhbmdsZVNoYXBlLmxpbmVUbyggIDQwLCA4MCApXG4gICAgIyAjIHRyaWFuZ2xlU2hhcGUubGluZVRvKCAxMjAsIDgwIClcbiAgICAjICMgdHJpYW5nbGVTaGFwZS5saW5lVG8oICA4MCwgMjAgKVxuXG4gICAgIyAjIGNvbnNvbGUubG9nIHRyaWFuZ2xlU2hhcGVcblxuICAgICMgIyBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TaGFwZUdlb21ldHJ5KCB0cmlhbmdsZVNoYXBlIClcbiAgICAjICMgbWF0ICAgICAgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHtjb2xvcjogMHgwMGZmMDAsIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGV9IClcbiAgICAjICMgQHRyICAgICAgID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdClcbiAgICAjICMgQGN1cnJlbnRTY2VuZS5hZGQoQHRyKVxuXG4gICAgIyAjIEBfY2FtZXJhLmxvb2tBdChAY3VycmVudFNjZW5lLmVxdWFsaXplci5jZW50ZXIpXG5cbiAgICAjIHNjZW5lID0gbmV3IFNQQUNFLlNjZW5lKClcblxuICAgICMgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDQ1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKSM3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMClcbiAgICAjIGNhbWVyYS5wb3NpdGlvbi5zZXRaKDUwMClcblxuICAgICMgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7YW50aWFsaWFzOiB0cnVlfSlcbiAgICAjICMgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHgwMDg4RkYpKVxuICAgICMgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KVxuICAgICMgIyByZW5kZXJlci5zaGFkb3pNYXBFbmFibGVkID0gdHJ1ZVxuICAgICMgIyByZW5kZXJlci5zaGFkb3pNYXBTb2Z0ICAgID0gdHJ1ZVxuICAgICMgIyByZW5kZXJlci5zaGFkb3pNYXBUeXBlICAgID0gVEhSRUUuUENGU2hhZG93TWFwXG5cbiAgICAjIGN1YmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgxMDAsIDEwMCwgMTAwKTtcbiAgICAjIGN1YmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6IDB4ZmYwMDAwfSk7XG4gICAgIyBjdWJlID0gbmV3IFRIUkVFLk1lc2goY3ViZUdlb21ldHJ5LCBjdWJlTWF0ZXJpYWwpO1xuXG4gICAgIyBjdWJlLnBvc2l0aW9uLnggPSAxXG4gICAgIyBjdWJlLnBvc2l0aW9uLnkgPSAxXG4gICAgIyBjdWJlLnBvc2l0aW9uLnogPSAxXG5cbiAgICAjIHNjZW5lLmFkZChjdWJlKVxuXG4gICAgIyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpLmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpXG5cbiAgICAjIHJlbmRlciA9IC0+XG4gICAgIyAgIGN1YmUucm90YXRpb24ueCArPSAwLjAyXG4gICAgIyAgIGN1YmUucm90YXRpb24ueSArPSAwLjAyXG4gICAgIyAgIGN1YmUucm90YXRpb24ueiArPSAwLjAyXG5cbiAgICAjICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpXG4gICAgIyAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpXG4gICAgIyByZW5kZXIoKVxuIl19