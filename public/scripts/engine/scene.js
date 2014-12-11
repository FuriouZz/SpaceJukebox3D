var Scene,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Scene = (function(_super) {
  __extends(Scene, _super);

  Scene.prototype.paused = false;

  function Scene(bg) {
    this.update = __bind(this.update, this);
    Scene.__super__.constructor.call(this, bg);
  }

  Scene.prototype.update = function(delta) {
    var child, _i, _len, _ref, _results;
    _ref = this.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push(this.updateObj(child, delta));
    }
    return _results;
  };

  Scene.prototype.updateObj = function(obj, delta) {
    var child, _i, _len, _ref, _results;
    if (typeof obj.update === 'function') {
      obj.update(delta);
    }
    if (obj.children && obj.children.length > 0) {
      _ref = obj.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(this.updateObj(child, delta));
      }
      return _results;
    }
  };

  Scene.prototype.resize = function() {};

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

})(PIXI.Stage);

SPACE.Scene = Scene;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9zY2VuZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxLQUFBO0VBQUE7O2lTQUFBOztBQUFBO0FBQ0UsMEJBQUEsQ0FBQTs7QUFBQSxrQkFBQSxNQUFBLEdBQVEsS0FBUixDQUFBOztBQUVhLEVBQUEsZUFBQyxFQUFELEdBQUE7QUFDWCwyQ0FBQSxDQUFBO0FBQUEsSUFBQSx1Q0FBTSxFQUFOLENBQUEsQ0FEVztFQUFBLENBRmI7O0FBQUEsa0JBS0EsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO0FBQ04sUUFBQSwrQkFBQTtBQUFBO0FBQUE7U0FBQSwyQ0FBQTt1QkFBQTtBQUNFLG9CQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsS0FBWCxFQUFrQixLQUFsQixFQUFBLENBREY7QUFBQTtvQkFETTtFQUFBLENBTFIsQ0FBQTs7QUFBQSxrQkFTQSxTQUFBLEdBQVcsU0FBQyxHQUFELEVBQU0sS0FBTixHQUFBO0FBQ1QsUUFBQSwrQkFBQTtBQUFBLElBQUEsSUFBcUIsTUFBQSxDQUFBLEdBQVUsQ0FBQyxNQUFYLEtBQXFCLFVBQTFDO0FBQUEsTUFBQSxHQUFHLENBQUMsTUFBSixDQUFXLEtBQVgsQ0FBQSxDQUFBO0tBQUE7QUFDQSxJQUFBLElBQUcsR0FBRyxDQUFDLFFBQUosSUFBZ0IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFiLEdBQXNCLENBQXpDO0FBQ0U7QUFBQTtXQUFBLDJDQUFBO3lCQUFBO0FBQ0Usc0JBQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxLQUFYLEVBQWtCLEtBQWxCLEVBQUEsQ0FERjtBQUFBO3NCQURGO0tBRlM7RUFBQSxDQVRYLENBQUE7O0FBQUEsa0JBZUEsTUFBQSxHQUFRLFNBQUEsR0FBQSxDQWZSLENBQUE7O0FBQUEsa0JBaUJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7V0FDTixJQUFDLENBQUEsTUFBRCxHQUFVLE1BREo7RUFBQSxDQWpCUixDQUFBOztBQUFBLGtCQW9CQSxLQUFBLEdBQU8sU0FBQSxHQUFBO1dBQ0wsSUFBQyxDQUFBLE1BQUQsR0FBVSxLQURMO0VBQUEsQ0FwQlAsQ0FBQTs7QUFBQSxrQkF1QkEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFdBQU8sSUFBQyxDQUFBLE1BQVIsQ0FEUTtFQUFBLENBdkJWLENBQUE7O2VBQUE7O0dBRGtCLElBQUksQ0FBQyxNQUF6QixDQUFBOztBQUFBLEtBMkJLLENBQUMsS0FBTixHQUFjLEtBM0JkLENBQUEiLCJmaWxlIjoiZW5naW5lL3NjZW5lLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2NlbmUgZXh0ZW5kcyBQSVhJLlN0YWdlXG4gIHBhdXNlZDogZmFsc2VcblxuICBjb25zdHJ1Y3RvcjogKGJnKS0+XG4gICAgc3VwZXIoYmcpXG5cbiAgdXBkYXRlOiAoZGVsdGEpPT5cbiAgICBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG4gICAgICBAdXBkYXRlT2JqKGNoaWxkLCBkZWx0YSlcblxuICB1cGRhdGVPYmo6IChvYmosIGRlbHRhKS0+XG4gICAgb2JqLnVwZGF0ZShkZWx0YSkgaWYgdHlwZW9mIG9iai51cGRhdGUgPT0gJ2Z1bmN0aW9uJ1xuICAgIGlmIG9iai5jaGlsZHJlbiAmJiBvYmouY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgICAgZm9yIGNoaWxkIGluIG9iai5jaGlsZHJlblxuICAgICAgICBAdXBkYXRlT2JqKGNoaWxkLCBkZWx0YSlcblxuICByZXNpemU6IC0+XG5cbiAgcmVzdW1lOiAtPlxuICAgIEBwYXVzZWQgPSBmYWxzZVxuXG4gIHBhdXNlOiAtPlxuICAgIEBwYXVzZWQgPSB0cnVlXG5cbiAgaXNQYXVzZWQ6IC0+XG4gICAgcmV0dXJuIEBwYXVzZWRcblxuU1BBQ0UuU2NlbmUgPSBTY2VuZVxuIl19