var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SPACE.Scene = (function(_super) {
  __extends(Scene, _super);

  function Scene() {
    Scene.__super__.constructor.apply(this, arguments);
    this.type = 'Scene';
    this.fog = null;
    this.overrideMaterial = null;
    this.autoUpdate = true;
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
    if (obj.hasOwnProperty('children') && obj.children.length > 0) {
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

})(THREE.Scene);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRocmVlanMvZW5naW5lL1NjZW5lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBO2lTQUFBOztBQUFBLEtBQVcsQ0FBQztBQUdWLDBCQUFBLENBQUE7O0FBQWEsRUFBQSxlQUFBLEdBQUE7QUFDWCxJQUFBLHdDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsSUFBRCxHQUFvQixPQUZwQixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsR0FBRCxHQUFvQixJQUhwQixDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFKcEIsQ0FBQTtBQUFBLElBS0EsSUFBQyxDQUFBLFVBQUQsR0FBb0IsSUFMcEIsQ0FEVztFQUFBLENBQWI7O0FBQUEsa0JBUUEsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO0FBQ04sUUFBQSwrQkFBQTtBQUFBO0FBQUE7U0FBQSwyQ0FBQTt1QkFBQTtBQUNFLG9CQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsS0FBWCxFQUFrQixLQUFsQixFQUFBLENBREY7QUFBQTtvQkFETTtFQUFBLENBUlIsQ0FBQTs7QUFBQSxrQkFZQSxTQUFBLEdBQVcsU0FBQyxHQUFELEVBQU0sS0FBTixHQUFBO0FBQ1QsUUFBQSwrQkFBQTtBQUFBLElBQUEsSUFBcUIsTUFBQSxDQUFBLEdBQVUsQ0FBQyxNQUFYLEtBQXFCLFVBQTFDO0FBQUEsTUFBQSxHQUFHLENBQUMsTUFBSixDQUFXLEtBQVgsQ0FBQSxDQUFBO0tBQUE7QUFDQSxJQUFBLElBQUcsR0FBRyxDQUFDLGNBQUosQ0FBbUIsVUFBbkIsQ0FBQSxJQUFtQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQWIsR0FBc0IsQ0FBNUQ7QUFDRTtBQUFBO1dBQUEsMkNBQUE7eUJBQUE7QUFDRSxzQkFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEtBQVgsRUFBa0IsS0FBbEIsRUFBQSxDQURGO0FBQUE7c0JBREY7S0FGUztFQUFBLENBWlgsQ0FBQTs7QUFBQSxrQkFrQkEsTUFBQSxHQUFRLFNBQUEsR0FBQSxDQWxCUixDQUFBOztBQUFBLGtCQW9CQSxNQUFBLEdBQVEsU0FBQSxHQUFBO1dBQ04sSUFBQyxDQUFBLE1BQUQsR0FBVSxNQURKO0VBQUEsQ0FwQlIsQ0FBQTs7QUFBQSxrQkF1QkEsS0FBQSxHQUFPLFNBQUEsR0FBQTtXQUNMLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FETDtFQUFBLENBdkJQLENBQUE7O0FBQUEsa0JBMEJBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixXQUFPLElBQUMsQ0FBQSxNQUFSLENBRFE7RUFBQSxDQTFCVixDQUFBOztlQUFBOztHQUh3QixLQUFLLENBQUMsTUFBaEMsQ0FBQSIsImZpbGUiOiJ0aHJlZWpzL2VuZ2luZS9TY2VuZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNQQUNFLlNjZW5lIGV4dGVuZHMgVEhSRUUuU2NlbmVcbiAgIyBwYXVzZWQ6IGZhbHNlXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcblxuICAgIEB0eXBlICAgICAgICAgICAgID0gJ1NjZW5lJ1xuICAgIEBmb2cgICAgICAgICAgICAgID0gbnVsbFxuICAgIEBvdmVycmlkZU1hdGVyaWFsID0gbnVsbFxuICAgIEBhdXRvVXBkYXRlICAgICAgID0gdHJ1ZVxuXG4gIHVwZGF0ZTogKGRlbHRhKS0+XG4gICAgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuICAgICAgQHVwZGF0ZU9iaihjaGlsZCwgZGVsdGEpXG5cbiAgdXBkYXRlT2JqOiAob2JqLCBkZWx0YSktPlxuICAgIG9iai51cGRhdGUoZGVsdGEpIGlmIHR5cGVvZiBvYmoudXBkYXRlID09ICdmdW5jdGlvbidcbiAgICBpZiBvYmouaGFzT3duUHJvcGVydHkoJ2NoaWxkcmVuJykgYW5kIG9iai5jaGlsZHJlbi5sZW5ndGggPiAwXG4gICAgICBmb3IgY2hpbGQgaW4gb2JqLmNoaWxkcmVuXG4gICAgICAgIEB1cGRhdGVPYmooY2hpbGQsIGRlbHRhKVxuXG4gIHJlc2l6ZTogLT5cblxuICByZXN1bWU6IC0+XG4gICAgQHBhdXNlZCA9IGZhbHNlXG5cbiAgcGF1c2U6IC0+XG4gICAgQHBhdXNlZCA9IHRydWVcblxuICBpc1BhdXNlZDogLT5cbiAgICByZXR1cm4gQHBhdXNlZCJdfQ==