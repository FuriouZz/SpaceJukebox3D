var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SPACE.DottedLine = (function(_super) {
  __extends(DottedLine, _super);

  DottedLine.prototype.time = 0;

  function DottedLine(track) {
    DottedLine.__super__.constructor.apply(this, arguments);
    this.from = new PIXI.Point(0, 0);
    this.to = new PIXI.Point(600, 600);
    this.track = track;
    this.spaceship = this.track.spaceship;
    this.lineStyle(SPACE.pixelRatio, 0xFFFFFF, 1);
    this.isWaiting = false;
  }

  DottedLine.prototype.update = function(delta) {
    var d;
    if (this.track.spaceship.state === SPACESHIP.IN_LOOP) {
      this.time += delta;
      d = this.track.spaceship.duration / 100;
      if (this.time >= d * .75 && !this.isWaiting) {
        this.from = new PIXI.Point(this.spaceship.position.x, this.spaceship.position.y);
        this.isWaiting = true;
      }
      if (this.time >= d) {
        this.time = 0;
        this.to = new PIXI.Point(this.spaceship.position.x, this.spaceship.position.y);
        this.draw();
        return this.isWaiting = false;
      }
    }
  };

  DottedLine.prototype.draw = function() {
    this.beginFill(0xFFFFFF, .25);
    this.moveTo(this.from.x, this.from.y);
    return this.lineTo(this.to.x, this.to.y);
  };

  return DottedLine;

})(PIXI.Graphics);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzZXMvZG90dGVkbGluZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTtpU0FBQTs7QUFBQSxLQUFXLENBQUM7QUFDViwrQkFBQSxDQUFBOztBQUFBLHVCQUFBLElBQUEsR0FBTSxDQUFOLENBQUE7O0FBRWEsRUFBQSxvQkFBQyxLQUFELEdBQUE7QUFDWCxJQUFBLDZDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsSUFBRCxHQUFpQixJQUFBLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWCxFQUFjLENBQWQsQ0FGakIsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLEVBQUQsR0FBaUIsSUFBQSxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsRUFBZ0IsR0FBaEIsQ0FIakIsQ0FBQTtBQUFBLElBSUEsSUFBQyxDQUFBLEtBQUQsR0FBYSxLQUpiLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUxwQixDQUFBO0FBQUEsSUFPQSxJQUFDLENBQUEsU0FBRCxDQUFXLEtBQUssQ0FBQyxVQUFqQixFQUE2QixRQUE3QixFQUF1QyxDQUF2QyxDQVBBLENBQUE7QUFBQSxJQVNBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FUYixDQURXO0VBQUEsQ0FGYjs7QUFBQSx1QkFjQSxNQUFBLEdBQVEsU0FBQyxLQUFELEdBQUE7QUFDTixRQUFBLENBQUE7QUFBQSxJQUFBLElBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBakIsS0FBMEIsU0FBUyxDQUFDLE9BQXZDO0FBQ0UsTUFBQSxJQUFDLENBQUEsSUFBRCxJQUFTLEtBQVQsQ0FBQTtBQUFBLE1BQ0EsQ0FBQSxHQUFJLElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQWpCLEdBQTRCLEdBRGhDLENBQUE7QUFHQSxNQUFBLElBQUcsSUFBQyxDQUFBLElBQUQsSUFBUyxDQUFBLEdBQUUsR0FBWCxJQUFtQixDQUFBLElBQUUsQ0FBQSxTQUF4QjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBL0IsRUFBa0MsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBdEQsQ0FBWixDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBRGIsQ0FERjtPQUhBO0FBTUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxJQUFELElBQVMsQ0FBWjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxDQUFSLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxFQUFELEdBQVUsSUFBQSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQS9CLEVBQWtDLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQXRELENBRFYsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUZBLENBQUE7ZUFHQSxJQUFDLENBQUEsU0FBRCxHQUFhLE1BSmY7T0FQRjtLQURNO0VBQUEsQ0FkUixDQUFBOztBQUFBLHVCQTRCQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osSUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLFFBQVgsRUFBcUIsR0FBckIsQ0FBQSxDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsTUFBRCxDQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsQ0FBZCxFQUFpQixJQUFDLENBQUEsSUFBSSxDQUFDLENBQXZCLENBREEsQ0FBQTtXQUVBLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUFaLEVBQWUsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQUFuQixFQUhJO0VBQUEsQ0E1Qk4sQ0FBQTs7b0JBQUE7O0dBRDZCLElBQUksQ0FBQyxTQUFwQyxDQUFBIiwiZmlsZSI6ImNsYXNzZXMvZG90dGVkbGluZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNQQUNFLkRvdHRlZExpbmUgZXh0ZW5kcyBQSVhJLkdyYXBoaWNzXG4gIHRpbWU6IDBcblxuICBjb25zdHJ1Y3RvcjogKHRyYWNrKS0+XG4gICAgc3VwZXJcblxuICAgIEBmcm9tICAgICAgPSBuZXcgUElYSS5Qb2ludCgwLCAwKVxuICAgIEB0byAgICAgICAgPSBuZXcgUElYSS5Qb2ludCg2MDAsIDYwMClcbiAgICBAdHJhY2sgICAgID0gdHJhY2tcbiAgICBAc3BhY2VzaGlwID0gQHRyYWNrLnNwYWNlc2hpcFxuICAgIFxuICAgIEBsaW5lU3R5bGUoU1BBQ0UucGl4ZWxSYXRpbywgMHhGRkZGRkYsIDEpXG5cbiAgICBAaXNXYWl0aW5nID0gZmFsc2VcblxuICB1cGRhdGU6IChkZWx0YSktPlxuICAgIGlmIEB0cmFjay5zcGFjZXNoaXAuc3RhdGUgPT0gU1BBQ0VTSElQLklOX0xPT1AgICAgXG4gICAgICBAdGltZSArPSBkZWx0YVxuICAgICAgZCA9IEB0cmFjay5zcGFjZXNoaXAuZHVyYXRpb24gLyAxMDBcbiAgICAgIFxuICAgICAgaWYgQHRpbWUgPj0gZCouNzUgYW5kICFAaXNXYWl0aW5nXG4gICAgICAgIEBmcm9tID0gbmV3IFBJWEkuUG9pbnQoQHNwYWNlc2hpcC5wb3NpdGlvbi54LCBAc3BhY2VzaGlwLnBvc2l0aW9uLnkpXG4gICAgICAgIEBpc1dhaXRpbmcgPSB0cnVlXG4gICAgICBpZiBAdGltZSA+PSBkXG4gICAgICAgIEB0aW1lID0gMFxuICAgICAgICBAdG8gPSBuZXcgUElYSS5Qb2ludChAc3BhY2VzaGlwLnBvc2l0aW9uLngsIEBzcGFjZXNoaXAucG9zaXRpb24ueSlcbiAgICAgICAgQGRyYXcoKVxuICAgICAgICBAaXNXYWl0aW5nID0gZmFsc2VcblxuICBkcmF3OiAtPlxuICAgIEBiZWdpbkZpbGwoMHhGRkZGRkYsIC4yNSlcbiAgICBAbW92ZVRvKEBmcm9tLngsIEBmcm9tLnkpXG4gICAgQGxpbmVUbyhAdG8ueCwgQHRvLnkpIl19