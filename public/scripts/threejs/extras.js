THREE.HermiteBezierCurve3 = THREE.Curve.create(function(v0, v1, v2, v3) {
  this.v0 = v0;
  this.v1 = v1;
  this.v2 = v2;
  this.v3 = v3;
}, function(t) {
  var vector;
  vector = new THREE.Vector3();
  vector.x = HELPERS.Hermite(this.v0.x, this.v1.x, this.v2.x, this.v3.x, t, 0, 0);
  vector.y = HELPERS.Hermite(this.v0.y, this.v1.y, this.v2.y, this.v3.y, t, 0, 0);
  vector.z = HELPERS.Hermite(this.v0.z, this.v1.z, this.v2.z, this.v3.z, t, 0, 0);
  return vector;
});

THREE.IncomingCurve = THREE.Curve.create(function(v0, maxRadius, minRadius, inverse) {
  if (maxRadius == null) {
    maxRadius = 100;
  }
  if (minRadius == null) {
    minRadius = 0;
  }
  if (inverse == null) {
    inverse = false;
  }
  this.v0 = v0;
  this.inverse = inverse;
  this.maxRadius = maxRadius;
  this.minRadius = minRadius;
  this.radius = this.maxRadius - this.minRadius;
}, function(t) {
  var angle, vector;
  if (this.inverse) {
    t = 1 - t;
  }
  angle = Math.PI * 2 * t;
  vector = new THREE.Vector3();
  vector.x = this.v0.x + Math.cos(angle) * (this.minRadius + this.radius * t);
  vector.y = this.v0.y + Math.sin(angle) * (this.minRadius + this.radius * t);
  vector.z = this.v0.z;
  return vector;
});

//# sourceMappingURL=data:application/json;base64,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LENBQUEsRUFBRSxDQUFDLENBQUosR0FBUSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixDQUFDLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLE1BQUQsR0FBVSxDQUF4QixDQUpyQyxDQUFBO0FBQUEsRUFLQSxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQSxFQUFFLENBQUMsQ0FBSixHQUFRLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFBLEdBQWtCLENBQUMsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsTUFBRCxHQUFVLENBQXhCLENBTHJDLENBQUE7QUFBQSxFQU1BLE1BQU0sQ0FBQyxDQUFQLEdBQVcsSUFBQyxDQUFBLEVBQUUsQ0FBQyxDQU5mLENBQUE7QUFPQSxTQUFPLE1BQVAsQ0FSQTtBQUFBLENBVmtCLENBZnRCLENBQUEiLCJmaWxlIjoidGhyZWVqcy9leHRyYXMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJUSFJFRS5IZXJtaXRlQmV6aWVyQ3VydmUzID0gVEhSRUUuQ3VydmUuY3JlYXRlKFxuICAodjAsIHYxLCB2MiwgdjMpLT5cbiAgICBAdjAgPSB2MFxuICAgIEB2MSA9IHYxXG4gICAgQHYyID0gdjJcbiAgICBAdjMgPSB2M1xuICAgIHJldHVyblxuICAsICh0KS0+XG4gICAgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIHZlY3Rvci54ID0gSEVMUEVSUy5IZXJtaXRlKHRoaXMudjAueCwgdGhpcy52MS54LCB0aGlzLnYyLngsIHRoaXMudjMueCwgdCwgMCwgMClcbiAgICB2ZWN0b3IueSA9IEhFTFBFUlMuSGVybWl0ZSh0aGlzLnYwLnksIHRoaXMudjEueSwgdGhpcy52Mi55LCB0aGlzLnYzLnksIHQsIDAsIDApXG4gICAgdmVjdG9yLnogPSBIRUxQRVJTLkhlcm1pdGUodGhpcy52MC56LCB0aGlzLnYxLnosIHRoaXMudjIueiwgdGhpcy52My56LCB0LCAwLCAwKVxuICAgIHJldHVybiB2ZWN0b3JcbilcblxuVEhSRUUuSW5jb21pbmdDdXJ2ZSA9IFRIUkVFLkN1cnZlLmNyZWF0ZShcbiAgKHYwLCBtYXhSYWRpdXM9MTAwLCBtaW5SYWRpdXM9MCwgaW52ZXJzZT1mYWxzZSktPlxuICAgIEB2MCAgICAgICAgPSB2MFxuICAgIEBpbnZlcnNlICAgPSBpbnZlcnNlXG5cbiAgICBAbWF4UmFkaXVzID0gbWF4UmFkaXVzXG4gICAgQG1pblJhZGl1cyA9IG1pblJhZGl1c1xuICAgIEByYWRpdXMgICAgPSBAbWF4UmFkaXVzIC0gQG1pblJhZGl1c1xuXG4gICAgcmV0dXJuXG4gICwgKHQpLT5cbiAgICB0ICAgICA9IDEgLSB0IGlmIEBpbnZlcnNlXG4gICAgYW5nbGUgPSBNYXRoLlBJICogMiAqIHRcblxuICAgIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICB2ZWN0b3IueCA9IEB2MC54ICsgTWF0aC5jb3MoYW5nbGUpICogKEBtaW5SYWRpdXMgKyBAcmFkaXVzICogdClcbiAgICB2ZWN0b3IueSA9IEB2MC55ICsgTWF0aC5zaW4oYW5nbGUpICogKEBtaW5SYWRpdXMgKyBAcmFkaXVzICogdClcbiAgICB2ZWN0b3IueiA9IEB2MC56XG4gICAgcmV0dXJuIHZlY3RvclxuKVxuIl19