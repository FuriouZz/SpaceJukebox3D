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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9TY2VuZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTtpU0FBQTs7QUFBQSxLQUFXLENBQUM7QUFHViwwQkFBQSxDQUFBOztBQUFhLEVBQUEsZUFBQSxHQUFBO0FBQ1gsSUFBQSx3Q0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLElBQUQsR0FBb0IsT0FGcEIsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLEdBQUQsR0FBb0IsSUFIcEIsQ0FBQTtBQUFBLElBSUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBSnBCLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxVQUFELEdBQW9CLElBTHBCLENBRFc7RUFBQSxDQUFiOztBQUFBLGtCQVFBLE1BQUEsR0FBUSxTQUFDLEtBQUQsR0FBQTtBQUNOLFFBQUEsK0JBQUE7QUFBQTtBQUFBO1NBQUEsMkNBQUE7dUJBQUE7QUFDRSxvQkFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEtBQVgsRUFBa0IsS0FBbEIsRUFBQSxDQURGO0FBQUE7b0JBRE07RUFBQSxDQVJSLENBQUE7O0FBQUEsa0JBWUEsU0FBQSxHQUFXLFNBQUMsR0FBRCxFQUFNLEtBQU4sR0FBQTtBQUNULFFBQUEsK0JBQUE7QUFBQSxJQUFBLElBQXFCLE1BQUEsQ0FBQSxHQUFVLENBQUMsTUFBWCxLQUFxQixVQUExQztBQUFBLE1BQUEsR0FBRyxDQUFDLE1BQUosQ0FBVyxLQUFYLENBQUEsQ0FBQTtLQUFBO0FBQ0EsSUFBQSxJQUFHLEdBQUcsQ0FBQyxjQUFKLENBQW1CLFVBQW5CLENBQUEsSUFBbUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFiLEdBQXNCLENBQTVEO0FBQ0U7QUFBQTtXQUFBLDJDQUFBO3lCQUFBO0FBQ0Usc0JBQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxLQUFYLEVBQWtCLEtBQWxCLEVBQUEsQ0FERjtBQUFBO3NCQURGO0tBRlM7RUFBQSxDQVpYLENBQUE7O0FBQUEsa0JBa0JBLE1BQUEsR0FBUSxTQUFBLEdBQUEsQ0FsQlIsQ0FBQTs7QUFBQSxrQkFvQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtXQUNOLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFESjtFQUFBLENBcEJSLENBQUE7O0FBQUEsa0JBdUJBLEtBQUEsR0FBTyxTQUFBLEdBQUE7V0FDTCxJQUFDLENBQUEsTUFBRCxHQUFVLEtBREw7RUFBQSxDQXZCUCxDQUFBOztBQUFBLGtCQTBCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsV0FBTyxJQUFDLENBQUEsTUFBUixDQURRO0VBQUEsQ0ExQlYsQ0FBQTs7ZUFBQTs7R0FId0IsS0FBSyxDQUFDLE1BQWhDLENBQUEiLCJmaWxlIjoiZW5naW5lL1NjZW5lLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU1BBQ0UuU2NlbmUgZXh0ZW5kcyBUSFJFRS5TY2VuZVxuICAjIHBhdXNlZDogZmFsc2VcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlclxuXG4gICAgQHR5cGUgICAgICAgICAgICAgPSAnU2NlbmUnXG4gICAgQGZvZyAgICAgICAgICAgICAgPSBudWxsXG4gICAgQG92ZXJyaWRlTWF0ZXJpYWwgPSBudWxsXG4gICAgQGF1dG9VcGRhdGUgICAgICAgPSB0cnVlXG5cbiAgdXBkYXRlOiAoZGVsdGEpLT5cbiAgICBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG4gICAgICBAdXBkYXRlT2JqKGNoaWxkLCBkZWx0YSlcblxuICB1cGRhdGVPYmo6IChvYmosIGRlbHRhKS0+XG4gICAgb2JqLnVwZGF0ZShkZWx0YSkgaWYgdHlwZW9mIG9iai51cGRhdGUgPT0gJ2Z1bmN0aW9uJ1xuICAgIGlmIG9iai5oYXNPd25Qcm9wZXJ0eSgnY2hpbGRyZW4nKSBhbmQgb2JqLmNoaWxkcmVuLmxlbmd0aCA+IDBcbiAgICAgIGZvciBjaGlsZCBpbiBvYmouY2hpbGRyZW5cbiAgICAgICAgQHVwZGF0ZU9iaihjaGlsZCwgZGVsdGEpXG5cbiAgcmVzaXplOiAtPlxuXG4gIHJlc3VtZTogLT5cbiAgICBAcGF1c2VkID0gZmFsc2VcblxuICBwYXVzZTogLT5cbiAgICBAcGF1c2VkID0gdHJ1ZVxuXG4gIGlzUGF1c2VkOiAtPlxuICAgIHJldHVybiBAcGF1c2VkIl19