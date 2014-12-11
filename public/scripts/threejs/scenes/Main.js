var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SPACE.MainScene = (function(_super) {
  __extends(MainScene, _super);

  MainScene.prototype.equalizer = null;

  MainScene.prototype.jukebox = null;

  MainScene.prototype.waveformData = null;

  function MainScene() {
    this._whileplaying = __bind(this._whileplaying, this);
    this._eTrackOnAdd = __bind(this._eTrackOnAdd, this);
    var middlePoint, options;
    MainScene.__super__.constructor.apply(this, arguments);
    middlePoint = new THREE.Vector3(0, 0, 0);
    options = {
      minLength: 0,
      maxLength: 100,
      radius: 250
    };
    this.equalizer = new SPACE.Equalizer(middlePoint, options);
    this.add(this.equalizer);
    this.jukebox = new SPACE.Jukebox();
    this.jukebox.whileplaying = this._whileplaying;
    this.spaceship = new SPACE.Spaceship(middlePoint, this.equalizer.radius);
    this.add(this.spaceship);
    this.waveformData = {};
    this._events();
  }

  MainScene.prototype._events = function() {
    return document.addEventListener(JUKEBOX.TRACK_ON_ADD.type, this._eTrackOnAdd);
  };

  MainScene.prototype._eTrackOnAdd = function(e) {
    var track;
    track = e.object.track;
    track.spaceship = null;
    return HELPERS.trigger(JUKEBOX.TRACK_ADDED, {
      track: track
    });
  };

  MainScene.prototype.setupSomething = function() {
    var g, light, m, speed;
    g = new THREE.BoxGeometry(100, 100, 100);
    m = new THREE.MeshLambertMaterial({
      color: 0x0088ff,
      shading: THREE.FlatShading
    });
    this.cube = new THREE.Mesh(g, m);
    this.cube.rotation.set(Math.random(), Math.random(), Math.random());
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.add(this.cube);
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
    this.add(light);
    speed = {
      x: Math.random() * 0.005,
      y: Math.random() * 0.005,
      z: Math.random() * 0.005
    };
    return this.cube.update = function() {
      this.rotation.x += speed.x;
      this.rotation.y += speed.y;
      return this.rotation.z += speed.z;
    };
  };

  MainScene.prototype.update = function(delta) {
    MainScene.__super__.update.call(this, delta);
    this.jukebox.update(delta);
    if (this.jukebox.state === SPACE.Jukebox.IS_PLAYING) {
      if (this.jukebox.current.sound.paused) {
        return this.equalizer.mute();
      } else if (this.waveformData.hasOwnProperty('mono')) {
        return this.equalizer.setValues(this.waveformData.mono);
      }
    }
  };

  MainScene.prototype._whileplaying = function() {
    var datas, i, sound, _i;
    sound = this.jukebox.current.sound;
    datas = Array(256);
    for (i = _i = 0; _i <= 127; i = ++_i) {
      datas[i] = Math.max(sound.waveformData.left[i], sound.waveformData.right[i]);
      datas[255 - i] = Math.max(sound.waveformData.left[i], sound.waveformData.right[i]);
    }
    this.waveformData.mono = datas;
    return this.waveformData.stereo = sound.waveformData;
  };

  return MainScene;

})(SPACE.Scene);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRocmVlanMvc2NlbmVzL01haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O2lTQUFBOztBQUFBLEtBQVcsQ0FBQztBQUVWLDhCQUFBLENBQUE7O0FBQUEsc0JBQUEsU0FBQSxHQUFXLElBQVgsQ0FBQTs7QUFBQSxzQkFDQSxPQUFBLEdBQVcsSUFEWCxDQUFBOztBQUFBLHNCQUdBLFlBQUEsR0FBYyxJQUhkLENBQUE7O0FBS2EsRUFBQSxtQkFBQSxHQUFBO0FBQ1gseURBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSxRQUFBLG9CQUFBO0FBQUEsSUFBQSw0Q0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLElBRUEsV0FBQSxHQUFrQixJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixDQUZsQixDQUFBO0FBQUEsSUFHQSxPQUFBLEdBQ0U7QUFBQSxNQUFBLFNBQUEsRUFBVyxDQUFYO0FBQUEsTUFDQSxTQUFBLEVBQVcsR0FEWDtBQUFBLE1BRUEsTUFBQSxFQUFRLEdBRlI7S0FKRixDQUFBO0FBQUEsSUFPQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLEtBQUssQ0FBQyxTQUFOLENBQWdCLFdBQWhCLEVBQTZCLE9BQTdCLENBUGpCLENBQUE7QUFBQSxJQVFBLElBQUMsQ0FBQSxHQUFELENBQUssSUFBQyxDQUFBLFNBQU4sQ0FSQSxDQUFBO0FBQUEsSUFVQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQVZmLENBQUE7QUFBQSxJQVdBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxHQUF3QixJQUFDLENBQUEsYUFYekIsQ0FBQTtBQUFBLElBY0EsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxLQUFLLENBQUMsU0FBTixDQUFnQixXQUFoQixFQUE2QixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQXhDLENBZGpCLENBQUE7QUFBQSxJQWVBLElB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QUFBIiwiZmlsZSI6InRocmVlanMvc2NlbmVzL01haW4uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTUEFDRS5NYWluU2NlbmUgZXh0ZW5kcyBTUEFDRS5TY2VuZVxuXG4gIGVxdWFsaXplcjogbnVsbFxuICBqdWtlYm94OiAgIG51bGxcblxuICB3YXZlZm9ybURhdGE6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlclxuICAgIFxuICAgIG1pZGRsZVBvaW50ID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMClcbiAgICBvcHRpb25zICAgICA9XG4gICAgICBtaW5MZW5ndGg6IDBcbiAgICAgIG1heExlbmd0aDogMTAwXG4gICAgICByYWRpdXM6IDI1MFxuICAgIEBlcXVhbGl6ZXIgPSBuZXcgU1BBQ0UuRXF1YWxpemVyKG1pZGRsZVBvaW50LCBvcHRpb25zKVxuICAgIEBhZGQoQGVxdWFsaXplcilcblxuICAgIEBqdWtlYm94ID0gbmV3IFNQQUNFLkp1a2Vib3goKVxuICAgIEBqdWtlYm94LndoaWxlcGxheWluZyA9IEBfd2hpbGVwbGF5aW5nXG4gICAgIyBAanVrZWJveC5wcmVkZWZpbmVkUGxheWxpc3QoKVxuICAgIFxuICAgIEBzcGFjZXNoaXAgPSBuZXcgU1BBQ0UuU3BhY2VzaGlwKG1pZGRsZVBvaW50LCBAZXF1YWxpemVyLnJhZGl1cylcbiAgICBAYWRkKEBzcGFjZXNoaXApXG5cbiAgICAjIEBzZXR1cFNvbWV0aGluZygpXG5cbiAgICBAd2F2ZWZvcm1EYXRhID0ge31cblxuICAgIEBfZXZlbnRzKClcblxuICBfZXZlbnRzOiAtPlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoSlVLRUJPWC5UUkFDS19PTl9BREQudHlwZSwgQF9lVHJhY2tPbkFkZClcblxuICBfZVRyYWNrT25BZGQ6IChlKT0+XG4gICAgIyBzcGFjZXNoaXAgPSBuZXcgU1BBQ0UuU3BhY2VzaGlwKEBlcXVhbGl6ZXIuY2VudGVyLCBAZXF1YWxpemVyLnJhZGl1cylcbiAgICAjIEBhZGRDaGlsZChzcGFjZXNoaXApXG5cbiAgICB0cmFjayA9IGUub2JqZWN0LnRyYWNrXG4gICAgdHJhY2suc3BhY2VzaGlwID0gbnVsbCNzcGFjZXNoaXBcbiAgICBIRUxQRVJTLnRyaWdnZXIoSlVLRUJPWC5UUkFDS19BRERFRCwgeyB0cmFjazogdHJhY2sgfSlcblxuICAgICMgQGRvdHRlZCA9IG5ldyBTUEFDRS5Eb3R0ZWRMaW5lKHRyYWNrKVxuICAgICMgQGFkZENoaWxkKEBkb3R0ZWQpXG5cbiAgc2V0dXBTb21ldGhpbmc6IC0+XG4gICAgIyBDdWJlXG4gICAgZyA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgxMDAsIDEwMCwgMTAwKVxuICAgIG0gPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweDAwODhmZiwgc2hhZGluZzogVEhSRUUuRmxhdFNoYWRpbmcgfSlcbiAgICBAY3ViZSA9IG5ldyBUSFJFRS5NZXNoKGcsIG0pXG4gICAgQGN1YmUucm90YXRpb24uc2V0KE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkpXG4gICAgQGN1YmUuY2FzdFNoYWRvdyA9IHRydWVcbiAgICBAY3ViZS5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgIEBhZGQoQGN1YmUpXG5cbiAgICBsaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCAweEZGRkZGRiwgMS44Ki4yIClcbiAgICBsaWdodC5wb3NpdGlvbi5zZXQoIDUwMCwgNTAwLCA1MDAgKVxuICAgIEBhZGQoIGxpZ2h0IClcblxuICAgIGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoIDB4RkZGRkZGLCAxLjgqLjYgKVxuICAgIGxpZ2h0LnBvc2l0aW9uLnNldCggLTUwMCwgNTAwLCA1MDAgKVxuICAgIEBhZGQoIGxpZ2h0IClcblxuICAgIGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoIDB4RkZGRkZGLCAxLjgqLjIgKVxuICAgIGxpZ2h0LnBvc2l0aW9uLnNldCggNTAwLCAtNTAwLCA1MDAgKVxuICAgIEBhZGQoIGxpZ2h0IClcblxuICAgIGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoIDB4RkZGRkZGLCAxLjgqLjIgKVxuICAgIGxpZ2h0LnBvc2l0aW9uLnNldCggLTUwMCwgLTUwMCwgNTAwIClcbiAgICBAYWRkKCBsaWdodCApXG5cbiAgICBsaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCAweEZGRkZGRiwgMS44Ki4xIClcbiAgICBsaWdodC5wb3NpdGlvbi5zZXQoIDUwMCwgNTAwLCAtNTAwIClcbiAgICBAYWRkKCBsaWdodCApXG5cbiAgICBsaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCAweEZGRkZGRiwgMS44Ki4xIClcbiAgICBsaWdodC5wb3NpdGlvbi5zZXQoIC01MDAsIDUwMCwgLTUwMCApXG4gICAgQGFkZCggbGlnaHQgKVxuXG4gICAgbGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCggMHhGRkZGRkYsIDEuOCouMSApXG4gICAgbGlnaHQucG9zaXRpb24uc2V0KCA1MDAsIC01MDAsIC01MDAgKVxuICAgIEBhZGQoIGxpZ2h0IClcblxuICAgIGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoIDB4RkZGRkZGLCAxLjgqLjEgKVxuICAgIGxpZ2h0LnBvc2l0aW9uLnNldCggLTUwMCwgLTUwMCwgLTUwMCApXG4gICAgQGFkZCggbGlnaHQgKVxuXG4gICAgIyBsaWdodC5jYXN0U2hhZG93ID0gdHJ1ZVxuXG4gICAgIyBsaWdodC5zaGFkb3dDYW1lcmFOZWFyICAgID0gNzAwXG4gICAgIyBsaWdodC5zaGFkb3dDYW1lcmFGYXIgICAgID0gbWFuYWdlci5fY2FtZXJhLmZhclxuICAgICMgbGlnaHQuc2hhZG93Q2FtZXJhRm92ICAgICA9IDUwXG5cbiAgICAjIGxpZ2h0LnNoYWRvd0Nhc2NhZGUgPSB0cnVlXG5cbiAgICAjIGxpZ2h0LnNoYWRvd0JpYXMgICAgICAgICAgPSAwLjAwMDFcbiAgICAjIGxpZ2h0LnNoYWRvd0RhcmtuZXNzICAgICAgPSAwLjVcblxuICAgICMgbGlnaHQuc2hhZG93Q2FtZXJhUmlnaHQgICAgPSAgNVxuICAgICMgbGlnaHQuc2hhZG93Q2FtZXJhTGVmdCAgICAgPSAtNVxuICAgICMgbGlnaHQuc2hhZG93Q2FtZXJhVG9wICAgICAgPSAgNVxuICAgICMgbGlnaHQuc2hhZG93Q2FtZXJhQm90dG9tICAgPSAtNVxuXG4gICAgIyBsaWdodC5zaGFkb3dNYXBXaWR0aCAgICAgID0gMjA0OFxuICAgICMgbGlnaHQuc2hhZG93TWFwSGVpZ2h0ICAgICA9IDIwNDhcblxuXG4gICAgIyBoZWxwZXIgPSBuZXcgVEhSRUUuU3BvdExpZ2h0SGVscGVyKGxpZ2h0LCAxKVxuICAgICMgQGFkZChoZWxwZXIpXG5cbiAgICBzcGVlZCA9XG4gICAgICB4OiBNYXRoLnJhbmRvbSgpICogMC4wMDVcbiAgICAgIHk6IE1hdGgucmFuZG9tKCkgKiAwLjAwNVxuICAgICAgejogTWF0aC5yYW5kb20oKSAqIDAuMDA1ICAgICAgXG5cbiAgICBAY3ViZS51cGRhdGUgPSAtPlxuICAgICAgQHJvdGF0aW9uLnggKz0gc3BlZWQueFxuICAgICAgQHJvdGF0aW9uLnkgKz0gc3BlZWQueVxuICAgICAgQHJvdGF0aW9uLnogKz0gc3BlZWQuelxuXG4gIHVwZGF0ZTogKGRlbHRhKS0+XG4gICAgc3VwZXIoZGVsdGEpXG4gICAgQGp1a2Vib3gudXBkYXRlKGRlbHRhKVxuXG4gICAgaWYgQGp1a2Vib3guc3RhdGUgPT0gU1BBQ0UuSnVrZWJveC5JU19QTEFZSU5HXG4gICAgICBpZiBAanVrZWJveC5jdXJyZW50LnNvdW5kLnBhdXNlZFxuICAgICAgICBAZXF1YWxpemVyLm11dGUoKVxuICAgICAgZWxzZSBpZiBAd2F2ZWZvcm1EYXRhLmhhc093blByb3BlcnR5KCdtb25vJylcbiAgICAgICAgQGVxdWFsaXplci5zZXRWYWx1ZXMoQHdhdmVmb3JtRGF0YS5tb25vKSAgICAgIFxuXG4gIF93aGlsZXBsYXlpbmc6ID0+XG4gICAgc291bmQgPSBAanVrZWJveC5jdXJyZW50LnNvdW5kXG5cbiAgICBkYXRhcyA9IEFycmF5KDI1NilcbiAgICBmb3IgaSBpbiBbMC4uMTI3XVxuICAgICAgZGF0YXNbaV0gICAgID0gTWF0aC5tYXgoc291bmQud2F2ZWZvcm1EYXRhLmxlZnRbaV0sIHNvdW5kLndhdmVmb3JtRGF0YS5yaWdodFtpXSlcbiAgICAgIGRhdGFzWzI1NS1pXSA9IE1hdGgubWF4KHNvdW5kLndhdmVmb3JtRGF0YS5sZWZ0W2ldLCBzb3VuZC53YXZlZm9ybURhdGEucmlnaHRbaV0pXG5cbiAgICBAd2F2ZWZvcm1EYXRhLm1vbm8gICA9IGRhdGFzXG4gICAgQHdhdmVmb3JtRGF0YS5zdGVyZW8gPSBzb3VuZC53YXZlZm9ybURhdGEiXX0=