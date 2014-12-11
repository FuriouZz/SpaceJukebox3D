var HELPERS;

HELPERS = HELPERS || {
  trigger: function(e, object) {
    e.object = object;
    return document.dispatchEvent(e);
  },
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
  },
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
  retina: function(value) {
    var a, array, key, o, object, _i, _len;
    if (typeof value === 'object') {
      object = value;
      o = {};
      for (key in object) {
        value = object[key];
        if (typeof value === 'number') {
          o[key] = value * SPACE.pixelRatio;
        }
      }
      return this.merge(object, o);
    } else if (typeof value === 'array') {
      array = value;
      a = [];
      for (key = _i = 0, _len = array.length; _i < _len; key = ++_i) {
        value = array[key];
        if (typeof value === 'number') {
          a.push(value * SPACE.pixelRatio);
        } else {
          a.push(value);
        }
      }
      return a;
    } else if (typeof value === 'number') {
      return value * SPACE.pixelRatio;
    }
    return false;
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRocmVlanMvSGVscGVycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBQSxPQUFBOztBQUFBLE9BQUEsR0FBVSxPQUFBLElBQVc7QUFBQSxFQUduQixPQUFBLEVBQVMsU0FBQyxDQUFELEVBQUksTUFBSixHQUFBO0FBQ1AsSUFBQSxDQUFDLENBQUMsTUFBRixHQUFXLE1BQVgsQ0FBQTtXQUNBLFFBQVEsQ0FBQyxhQUFULENBQXVCLENBQXZCLEVBRk87RUFBQSxDQUhVO0FBQUEsRUFRbkIsT0FBQSxFQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsSUFBQSxHQUFBLENBQUE7QUFBQSxRQUFBLGVBQUE7QUFBQSxJQUNBLElBQUEsR0FBTyxLQUFLLENBQUMsTUFEYixDQUFBO0FBRUEsV0FBTSxDQUFBLEtBQUssSUFBWCxHQUFBO0FBQ0UsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsSUFBM0IsQ0FBUCxDQUFBO0FBQUEsTUFDQSxJQUFBLElBQVEsQ0FEUixDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQWMsS0FBTSxDQUFBLElBQUEsQ0FGcEIsQ0FBQTtBQUFBLE1BR0EsS0FBTSxDQUFBLElBQUEsQ0FBTixHQUFjLEtBQU0sQ0FBQSxJQUFBLENBSHBCLENBQUE7QUFBQSxNQUlBLEtBQU0sQ0FBQSxJQUFBLENBQU4sR0FBYyxHQUpkLENBREY7SUFBQSxDQUZBO0FBUUEsV0FBTyxLQUFQLENBVE87RUFBQSxDQVJVO0FBQUEsRUFvQm5CLEtBQUEsRUFBTyxTQUFDLE9BQUQsRUFBVSxTQUFWLEdBQUE7V0FDTCxJQUFDLENBQUEsTUFBRCxDQUFTLElBQUMsQ0FBQSxNQUFELENBQVEsRUFBUixFQUFZLE9BQVosQ0FBVCxFQUErQixTQUEvQixFQURLO0VBQUEsQ0FwQlk7QUFBQSxFQXVCbkIsTUFBQSxFQUFRLFNBQUMsTUFBRCxFQUFTLFVBQVQsR0FBQTtBQUNOLFFBQUEsUUFBQTtB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QWdCLFFBQW5CO0FBQ0UsVUFBQSxDQUFDLENBQUMsSUFBRixDQUFPLEtBQUEsR0FBUSxLQUFLLENBQUMsVUFBckIsQ0FBQSxDQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFQLENBQUEsQ0FIRjtTQURGO0FBQUEsT0FGQTtBQU9BLGFBQU8sQ0FBUCxDQVJHO0tBQUEsTUFTQSxJQUFHLE1BQUEsQ0FBQSxLQUFBLEtBQWdCLFFBQW5CO0FBQ0gsYUFBTyxLQUFBLEdBQVEsS0FBSyxDQUFDLFVBQXJCLENBREc7S0FqQkw7QUFtQkEsV0FBTyxLQUFQLENBcEJNO0VBQUEsQ0FsRFc7Q0FBckIsQ0FBQSIsImZpbGUiOiJ0aHJlZWpzL0hlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJcblxuSEVMUEVSUyA9IEhFTFBFUlMgfHwge1xuXG4gICMgRXZlbnRcbiAgdHJpZ2dlcjogKGUsIG9iamVjdCktPlxuICAgIGUub2JqZWN0ID0gb2JqZWN0XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChlKVxuXG4gICMgQXJyYXlcbiAgc2h1ZmZsZTogKGFycmF5KS0+XG4gICAgdG1wXG4gICAgY3VyciA9IGFycmF5Lmxlbmd0aFxuICAgIHdoaWxlIDAgIT0gY3VyclxuICAgICAgcmFuZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnIpXG4gICAgICBjdXJyIC09IDFcbiAgICAgIHRtcCAgICAgICAgID0gYXJyYXlbY3Vycl1cbiAgICAgIGFycmF5W2N1cnJdID0gYXJyYXlbcmFuZF1cbiAgICAgIGFycmF5W3JhbmRdID0gdG1wXG4gICAgcmV0dXJuIGFycmF5XG5cbiAgIyBPYmplY3RcbiAgbWVyZ2U6IChvcHRpb25zLCBvdmVycmlkZXMpIC0+XG4gICAgQGV4dGVuZCAoQGV4dGVuZCB7fSwgb3B0aW9ucyksIG92ZXJyaWRlc1xuXG4gIGV4dGVuZDogKG9iamVjdCwgcHJvcGVydGllcykgLT5cbiAgICBmb3Iga2V5LCB2YWwgb2YgcHJvcGVydGllc1xuICAgICAgb2JqZWN0W2tleV0gPSB2YWxcbiAgICBvYmplY3RcblxuICAjIE1hdGhcbiAgYW5nbGVCZXR3ZWVuUG9pbnRzOiAoZmlyc3QsIHNlY29uZCkgLT5cbiAgICBoZWlnaHQgPSBzZWNvbmQueSAtIGZpcnN0LnlcbiAgICB3aWR0aCAgPSBzZWNvbmQueCAtIGZpcnN0LnhcbiAgICByZXR1cm4gTWF0aC5hdGFuMihoZWlnaHQsIHdpZHRoKVxuXG4gIGRpc3RhbmNlOiAocG9pbnQxLCBwb2ludDIpIC0+XG4gICAgeCA9IHBvaW50MS54IC0gcG9pbnQyLnhcbiAgICB5ID0gcG9pbnQxLnkgLSBwb2ludDIueVxuICAgIGQgPSB4ICogeCArIHkgKiB5XG4gICAgcmV0dXJuIE1hdGguc3FydChkKVxuXG4gIGNvbGxpc2lvbjogKGRvdDEsIGRvdDIpLT5cbiAgICByMSA9IGlmIGRvdDEucmFkaXVzIHRoZW4gZG90MS5yYWRpdXMgZWxzZSAwXG4gICAgcjIgPSBpZiBkb3QyLnJhZGl1cyB0aGVuIGRvdDIucmFkaXVzIGVsc2UgMFxuICAgIGRpc3QgPSByMSArIHIyXG5cbiAgICByZXR1cm4gQGRpc3RhbmNlKGRvdDEucG9zaXRpb24sIGRvdDIucG9zaXRpb24pIDw9IE1hdGguc3FydChkaXN0ICogZGlzdClcblxuICBtYXA6ICh2YWx1ZSwgbG93MSwgaGlnaDEsIGxvdzIsIGhpZ2gyKSAtPlxuICAgIHJldHVybiBsb3cyICsgKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSAvIChoaWdoMSAtIGxvdzEpXG5cbiAgcmV0aW5hOiAodmFsdWUpLT5cbiAgICBpZiB0eXBlb2YgdmFsdWUgaXMgJ29iamVjdCdcbiAgICAgIG9iamVjdCA9IHZhbHVlXG4gICAgICBvID0ge31cbiAgICAgIGZvciBrZXkgb2Ygb2JqZWN0XG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV1cbiAgICAgICAgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICAgICAgb1trZXldID0gdmFsdWUgKiBTUEFDRS5waXhlbFJhdGlvXG4gICAgICByZXR1cm4gQG1lcmdlKG9iamVjdCwgbylcbiAgICBlbHNlIGlmIHR5cGVvZiB2YWx1ZSBpcyAnYXJyYXknXG4gICAgICBhcnJheSA9IHZhbHVlXG4gICAgICBhID0gW11cbiAgICAgIGZvciB2YWx1ZSwga2V5IGluIGFycmF5XG4gICAgICAgIGlmIHR5cGVvZiB2YWx1ZSBpcyAnbnVtYmVyJ1xuICAgICAgICAgIGEucHVzaCh2YWx1ZSAqIFNQQUNFLnBpeGVsUmF0aW8pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhLnB1c2godmFsdWUpXG4gICAgICByZXR1cm4gYVxuICAgIGVsc2UgaWYgdHlwZW9mIHZhbHVlIGlzICdudW1iZXInXG4gICAgICByZXR1cm4gdmFsdWUgKiBTUEFDRS5waXhlbFJhdGlvXG4gICAgcmV0dXJuIGZhbHNlXG4gICAgXG59XG4iXX0=