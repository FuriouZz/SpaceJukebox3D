var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SPACE.Equalizer = (function(_super) {
  __extends(Equalizer, _super);

  Equalizer.prototype.center = null;

  Equalizer.prototype._values = null;

  Equalizer.prototype._newValues = null;

  Equalizer.prototype._oldValues = null;

  Equalizer.prototype._time = 1;

  Equalizer.prototype.material = null;

  Equalizer.prototype.lines = null;

  Equalizer.prototype.isGenerated = false;

  Equalizer.prototype.maxLength = 0;

  Equalizer.prototype.minLength = 0;

  Equalizer.prototype.radius = 0;

  Equalizer.prototype.interpolationTime = 0;

  Equalizer.prototype.color = 0xFFFFFF;

  Equalizer.prototype.lineForceUp = .5;

  Equalizer.prototype.lineForceDown = .5;

  Equalizer.prototype.absolute = false;

  function Equalizer(point, opts) {
    var defaults;
    if (opts == null) {
      opts = {};
    }
    this.random = __bind(this.random, this);
    Equalizer.__super__.constructor.apply(this, arguments);
    defaults = {
      maxLength: 200,
      minLength: 50,
      radius: 250,
      interpolationTime: 150,
      color: 0xDE548E,
      lineForceUp: .5,
      lineForceDown: .5,
      absolute: false
    };
    opts = HELPERS.merge(defaults, opts);
    this.minLength = opts.minLength;
    this.maxLength = opts.maxLength;
    this.radius = opts.radius;
    this.interpolationTime = opts.interpolationTime;
    this.color = opts.color;
    this.lineForceUp = opts.lineForceUp;
    this.lineForceDown = opts.lineForceDown;
    this.absolute = opts.absolute;
    this.center = point;
    this._values = [];
    this._oldValues = [];
    this._newValues = [];
    this.generate();
  }

  Equalizer.prototype.setValues = function(values) {
    var length, newValues, value, _i, _len;
    newValues = [];
    for (_i = 0, _len = values.length; _i < _len; _i++) {
      value = values[_i];
      if (this.absolute) {
        value = Math.abs(value);
      }
      length = this.minLength + parseFloat(value) * (this.maxLength - this.minLength);
      newValues.push(Math.max(length, 0));
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
    var diff, i, t, _i, _ref;
    this._time += delta;
    t = this._time / this.interpolationTime;
    if (t > 1) {
      return;
    }
    for (i = _i = 0, _ref = this._newValues.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      diff = this._oldValues[i] - this._newValues[i];
      this._values[i] = this._oldValues[i] - t * diff;
    }
    return this.updateGeometries();
  };

  Equalizer.prototype.updateGeometries = function(create) {
    var angle, from, geometry, i, length, line, radius, to, _i, _ref, _results;
    if (create == null) {
      create = false;
    }
    _results = [];
    for (i = _i = 0, _ref = this._values.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      angle = Math.PI * 2 * i / this._values.length;
      length = this._values[i];
      radius = this.radius;
      from = this.computePosition(this.center, angle, radius - length * this.lineForceDown);
      to = this.computePosition(this.center, angle, radius + length * this.lineForceUp);
      if (typeof this.lines[i] === 'undefined') {
        geometry = new THREE.Geometry();
        geometry.vertices.push(from, to, from);
        line = new THREE.Line(geometry, this.material);
        this.lines.push(line);
        _results.push(this.add(line));
      } else {
        line = this.lines[i];
        line.geometry.vertices[0] = from;
        line.geometry.vertices[1] = to;
        line.geometry.vertices[2] = from;
        _results.push(line.geometry.verticesNeedUpdate = true);
      }
    }
    return _results;
  };

  Equalizer.prototype.random = function(setValues) {
    var i, values, _i;
    if (setValues == null) {
      setValues = true;
    }
    values = [];
    for (i = _i = 0; _i <= 63; i = ++_i) {
      values[i] = Math.random();
    }
    if (setValues) {
      this.setValues(values);
    }
    return values;
  };

  Equalizer.prototype.mute = function(setValues) {
    var i, values, _i;
    if (setValues == null) {
      setValues = true;
    }
    values = [];
    for (i = _i = 0; _i <= 63; i = ++_i) {
      values[i] = 0;
    }
    if (setValues) {
      return this.setValues(values);
    }
  };

  Equalizer.prototype.resetInterpolation = function() {
    var i, _i, _ref, _ref1, _results;
    this._time = 0;
    this._oldValues = this._values;
    if (this._newValues.length > this._oldValues.length) {
      _results = [];
      for (i = _i = _ref = this._oldValues.length, _ref1 = this._newValues.length - 1; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
        _results.push(this._oldValues[i] = 0);
      }
      return _results;
    }
  };

  Equalizer.prototype.computePosition = function(point, angle, length) {
    var x, y;
    x = point.x + Math.sin(angle) * length;
    y = point.y + Math.cos(angle) * length;
    return new THREE.Vector3(x, y, point.z);
  };

  return Equalizer;

})(THREE.Group);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRocmVlanMvZ3JhcGhpY3MvRXF1YWxpemVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztpU0FBQTs7QUFBQSxLQUFXLENBQUM7QUFFViw4QkFBQSxDQUFBOztBQUFBLHNCQUFBLE1BQUEsR0FBWSxJQUFaLENBQUE7O0FBQUEsc0JBRUEsT0FBQSxHQUFZLElBRlosQ0FBQTs7QUFBQSxzQkFHQSxVQUFBLEdBQVksSUFIWixDQUFBOztBQUFBLHNCQUlBLFVBQUEsR0FBWSxJQUpaLENBQUE7O0FBQUEsc0JBTUEsS0FBQSxHQUFZLENBTlosQ0FBQTs7QUFBQSxzQkFTQSxRQUFBLEdBQVksSUFUWixDQUFBOztBQUFBLHNCQVVBLEtBQUEsR0FBWSxJQVZaLENBQUE7O0FBQUEsc0JBV0EsV0FBQSxHQUFhLEtBWGIsQ0FBQTs7QUFBQSxzQkFjQSxTQUFBLEdBQW1CLENBZG5CLENBQUE7O0FBQUEsc0JBZUEsU0FBQSxHQUFtQixDQWZuQixDQUFBOztBQUFBLHNCQWdCQSxNQUFBLEdBQW1CLENBaEJuQixDQUFBOztBQUFBLHNCQWlCQSxpQkFBQSxHQUFtQixDQWpCbkIsQ0FBQTs7QUFBQSxzQkFrQkEsS0FBQSxHQUFtQixRQWxCbkIsQ0FBQTs7QUFBQSxzQkFtQkEsV0FBQSxHQUFtQixFQW5CbkIsQ0FBQTs7QUFBQSxzQkFvQkEsYUFBQSxHQUFtQixFQXBCbkIsQ0FBQTs7QUFBQSxzQkFxQkEsUUFBQSxHQUFtQixLQXJCbkIsQ0FBQTs7QUF1QmEsRUFBQSxtQkFBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ1gsUUFBQSxRQUFBOztNQURtQixPQUFLO0tBQ3hCO0FBQUEsMkNBQUEsQ0FBQTtBQUFBLElBQUEsNENBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxJQUdBLFFBQUEsR0FDRTtBQUFBLE1BQUEsU0FBQSxFQUFtQixHQUFuQjtBQUFBLE1BQ0EsU0FBQSxFQUFtQixFQURuQjtBQUFBLE1BRUEsTUFBQSxFQUFtQixHQUZuQjtBQUFBLE1B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QUNBLENBQUEsR0FBSSxLQUFLLENBQUMsQ0FBTixHQUFVLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFBLEdBQWtCLE1BRGhDLENBQUE7QUFFQSxXQUFXLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLEtBQUssQ0FBQyxDQUExQixDQUFYLENBSGU7RUFBQSxDQWhJakIsQ0FBQTs7bUJBQUE7O0dBRjRCLEtBQUssQ0FBQyxNQUFwQyxDQUFBIiwiZmlsZSI6InRocmVlanMvZ3JhcGhpY3MvRXF1YWxpemVyLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU1BBQ0UuRXF1YWxpemVyIGV4dGVuZHMgVEhSRUUuR3JvdXBcblxuICBjZW50ZXI6ICAgICBudWxsXG5cbiAgX3ZhbHVlczogICAgbnVsbFxuICBfbmV3VmFsdWVzOiBudWxsXG4gIF9vbGRWYWx1ZXM6IG51bGxcblxuICBfdGltZTogICAgICAxXG5cbiAgIyBUSFJFRVxuICBtYXRlcmlhbDogICBudWxsXG4gIGxpbmVzOiAgICAgIG51bGxcbiAgaXNHZW5lcmF0ZWQ6IGZhbHNlXG5cbiAgIyBQYXJhbWV0ZXJzXG4gIG1heExlbmd0aDogICAgICAgICAwXG4gIG1pbkxlbmd0aDogICAgICAgICAwXG4gIHJhZGl1czogICAgICAgICAgICAwXG4gIGludGVycG9sYXRpb25UaW1lOiAwXG4gIGNvbG9yOiAgICAgICAgICAgICAweEZGRkZGRlxuICBsaW5lRm9yY2VVcDogICAgICAgLjVcbiAgbGluZUZvcmNlRG93bjogICAgIC41XG4gIGFic29sdXRlOiAgICAgICAgICBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yOiAocG9pbnQsIG9wdHM9e30pLT5cbiAgICBzdXBlclxuXG4gICAgIyBTZXQgcGFyYW1ldGVyc1xuICAgIGRlZmF1bHRzID1cbiAgICAgIG1heExlbmd0aDogICAgICAgICAyMDBcbiAgICAgIG1pbkxlbmd0aDogICAgICAgICA1MFxuICAgICAgcmFkaXVzOiAgICAgICAgICAgIDI1MFxuICAgICAgaW50ZXJwb2xhdGlvblRpbWU6IDE1MFxuICAgICAgY29sb3I6ICAgICAgICAgICAgIDB4REU1NDhFXG4gICAgICBsaW5lRm9yY2VVcDogICAgICAgLjVcbiAgICAgIGxpbmVGb3JjZURvd246ICAgICAuNVxuICAgICAgYWJzb2x1dGU6ICAgICAgICAgIGZhbHNlXG5cbiAgICBvcHRzICAgICAgICAgICAgICAgPSBIRUxQRVJTLm1lcmdlKGRlZmF1bHRzLCBvcHRzKVxuICAgIEBtaW5MZW5ndGggICAgICAgICA9IG9wdHMubWluTGVuZ3RoXG4gICAgQG1heExlbmd0aCAgICAgICAgID0gb3B0cy5tYXhMZW5ndGhcbiAgICBAcmFkaXVzICAgICAgICAgICAgPSBvcHRzLnJhZGl1c1xuICAgIEBpbnRlcnBvbGF0aW9uVGltZSA9IG9wdHMuaW50ZXJwb2xhdGlvblRpbWVcbiAgICBAY29sb3IgICAgICAgICAgICAgPSBvcHRzLmNvbG9yXG4gICAgQGxpbmVGb3JjZVVwICAgICAgID0gb3B0cy5saW5lRm9yY2VVcFxuICAgIEBsaW5lRm9yY2VEb3duICAgICA9IG9wdHMubGluZUZvcmNlRG93blxuICAgIEBhYnNvbHV0ZSAgICAgICAgICA9IG9wdHMuYWJzb2x1dGVcblxuICAgICMgU2V0IHZhbHVlc1xuICAgIEBjZW50ZXIgICAgID0gcG9pbnRcbiAgICBAX3ZhbHVlcyAgICA9IFtdXG4gICAgQF9vbGRWYWx1ZXMgPSBbXVxuICAgIEBfbmV3VmFsdWVzID0gW11cblxuICAgIEBnZW5lcmF0ZSgpXG5cbiAgc2V0VmFsdWVzOiAodmFsdWVzKS0+XG4gICAgbmV3VmFsdWVzID0gW11cbiAgICBmb3IgdmFsdWUgaW4gdmFsdWVzXG4gICAgICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKSBpZiBAYWJzb2x1dGVcbiAgICAgIGxlbmd0aCA9IEBtaW5MZW5ndGggKyBwYXJzZUZsb2F0KHZhbHVlKSooQG1heExlbmd0aCAtIEBtaW5MZW5ndGgpXG4gICAgICBuZXdWYWx1ZXMucHVzaChNYXRoLm1heChsZW5ndGgsIDApKVxuICAgIEBfbmV3VmFsdWVzID0gbmV3VmFsdWVzXG4gICAgQHJlc2V0SW50ZXJwb2xhdGlvbigpXG5cbiAgZ2VuZXJhdGU6IC0+XG4gICAgQG11dGUoKVxuXG4gICAgQG1hdGVyaWFsICAgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQGNvbG9yLCBsaW5ld2lkdGg6IDQgfSlcbiAgICBAbGluZXMgICAgICA9IFtdXG5cbiAgICBAdXBkYXRlKDApXG4gICAgQHVwZGF0ZUdlb21ldHJpZXModHJ1ZSlcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIEBfdGltZSArPSBkZWx0YVxuICAgIHQgPSBAX3RpbWUgLyBAaW50ZXJwb2xhdGlvblRpbWVcbiAgICByZXR1cm4gaWYgdCA+IDFcblxuICAgIGZvciBpIGluIFswLi4oQF9uZXdWYWx1ZXMubGVuZ3RoLTEpXVxuICAgICAgZGlmZiAgICAgICAgPSBAX29sZFZhbHVlc1tpXSAtIEBfbmV3VmFsdWVzW2ldXG4gICAgICBAX3ZhbHVlc1tpXSA9IEBfb2xkVmFsdWVzW2ldIC0gdCAqIGRpZmZcbiAgICBAdXBkYXRlR2VvbWV0cmllcygpIyBpZiBAaXNHZW5lcmF0ZWRcblxuICB1cGRhdGVHZW9tZXRyaWVzOiAoY3JlYXRlPWZhbHNlKS0+XG4gICAgZm9yIGkgaW4gWzAuLihAX3ZhbHVlcy5sZW5ndGgtMSldXG4gICAgICBhbmdsZSAgPSBNYXRoLlBJICogMiAqIGkgLyAoQF92YWx1ZXMubGVuZ3RoKVxuXG4gICAgICBsZW5ndGggPSBAX3ZhbHVlc1tpXVxuICAgICAgcmFkaXVzID0gQHJhZGl1c1xuXG4gICAgICBmcm9tID0gQGNvbXB1dGVQb3NpdGlvbihAY2VudGVyLCBhbmdsZSwgcmFkaXVzLWxlbmd0aCpAbGluZUZvcmNlRG93bilcbiAgICAgIHRvICAgPSBAY29tcHV0ZVBvc2l0aW9uKEBjZW50ZXIsIGFuZ2xlLCByYWRpdXMrbGVuZ3RoKkBsaW5lRm9yY2VVcClcblxuICAgICAgaWYgdHlwZW9mIEBsaW5lc1tpXSA9PSAndW5kZWZpbmVkJ1xuICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpXG4gICAgICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2goZnJvbSwgdG8sIGZyb20pXG5cbiAgICAgICAgbGluZSA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBAbWF0ZXJpYWwpXG4gICAgICAgIEBsaW5lcy5wdXNoKGxpbmUpXG4gICAgICAgIEBhZGQobGluZSlcbiAgICAgIGVsc2VcbiAgICAgICAgbGluZSA9IEBsaW5lc1tpXVxuICAgICAgICBsaW5lLmdlb21ldHJ5LnZlcnRpY2VzWzBdID0gZnJvbVxuICAgICAgICBsaW5lLmdlb21ldHJ5LnZlcnRpY2VzWzFdID0gdG9cbiAgICAgICAgbGluZS5nZW9tZXRyeS52ZXJ0aWNlc1syXSA9IGZyb21cbiAgICAgICAgbGluZS5nZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlXG5cbiAgcmFuZG9tOiAoc2V0VmFsdWVzPXRydWUpPT5cbiAgICB2YWx1ZXMgPSBbXVxuICAgIGZvciBpIGluIFswLi42M11cbiAgICAgIHZhbHVlc1tpXSA9IE1hdGgucmFuZG9tKClcbiAgICBAc2V0VmFsdWVzKHZhbHVlcykgaWYgc2V0VmFsdWVzXG4gICAgcmV0dXJuIHZhbHVlc1xuXG4gIG11dGU6IChzZXRWYWx1ZXM9dHJ1ZSktPlxuICAgIHZhbHVlcyA9IFtdXG4gICAgZm9yIGkgaW4gWzAuLjYzXVxuICAgICAgdmFsdWVzW2ldID0gMFxuICAgIEBzZXRWYWx1ZXModmFsdWVzKSBpZiBzZXRWYWx1ZXNcblxuICByZXNldEludGVycG9sYXRpb246IC0+XG4gICAgQF90aW1lID0gMFxuICAgIEBfb2xkVmFsdWVzID0gQF92YWx1ZXNcblxuICAgIGlmIEBfbmV3VmFsdWVzLmxlbmd0aCA+IEBfb2xkVmFsdWVzLmxlbmd0aFxuICAgICAgZm9yIGkgaW4gWyhAX29sZFZhbHVlcy5sZW5ndGgpLi4oQF9uZXdWYWx1ZXMubGVuZ3RoLTEpXVxuICAgICAgICBAX29sZFZhbHVlc1tpXSA9IDBcblxuICBjb21wdXRlUG9zaXRpb246IChwb2ludCwgYW5nbGUsIGxlbmd0aCktPlxuICAgIHggPSBwb2ludC54ICsgTWF0aC5zaW4oYW5nbGUpICogbGVuZ3RoXG4gICAgeSA9IHBvaW50LnkgKyBNYXRoLmNvcyhhbmdsZSkgKiBsZW5ndGhcbiAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoeCwgeSwgcG9pbnQueilcblxuIl19