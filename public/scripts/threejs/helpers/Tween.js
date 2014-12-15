var _Easing;

_Easing = _Easing || {
  linear: function(p) {
    return p;
  },
  QuadraticEaseIn: function(p) {
    return p * p;
  },
  QuadraticEaseOut: function(p) {
    return -(p * (p - 2));
  },
  QuadraticEaseInOut: function(p) {
    if (p < 0.5) {
      return 2 * p * p;
    } else {
      return (-2 * p * p) + (4 * p) - 1;
    }
  },
  CubicEaseIn: function(p) {
    return p * p * p;
  },
  CubicEaseOut: function(p) {
    var f;
    f = p - 1;
    return f * f * f + 1;
  },
  CubicEaseInOut: function(p) {
    var f;
    if (p < 0.5) {
      return 4 * p * p * p;
    } else {
      f = (2 * p) - 2;
      return 0.5 * f * f * f + 1;
    }
  },
  QuarticEaseIn: function(p) {
    return p * p * p * p;
  },
  QuarticEaseOut: function(p) {
    var f;
    f = p - 1;
    return f * f * f * (1 - p) + 1;
  },
  QuarticEaseInOut: function(p) {
    var f;
    if (p < 0.5) {
      return 8 * p * p * p * p;
    } else {
      f = p - 1;
      return -8 * f * f * f * f + 1;
    }
  },
  QuinticEaseIn: function(p) {
    return p * p * p * p * p;
  },
  QuinticEaseOut: function(p) {
    var f;
    f = p - 1;
    return f * f * f * f * f + 1;
  },
  QuinticEaseInOut: function(p) {
    var f;
    if (p < 0.5) {
      return 16 * p * p * p * p * p;
    } else {
      f = (2 * p) - 2;
      return 0.5 * f * f * f * f * f + 1;
    }
  },
  SineEaseIn: function(p) {
    return Math.sin((p - 1) * Math.PI * 2) + 1;
  },
  SineEaseOut: function(p) {
    return Math.sin(p * Math.PI * 2);
  },
  SineEaseInOut: function(p) {
    return 0.5 * (1 - Math.cos(p * Math.PI));
  },
  CircularEaseIn: function(p) {
    return 1 - Math.sqrt(1 - (p * p));
  },
  CircularEaseOut: function(p) {
    return Math.sqrt((2 - p) * p);
  },
  CircularEaseInOut: function(p) {
    if (p < 0.5) {
      return 0.5 * (1 - Math.sqrt(1 - 4 * (p * p)));
    } else {
      return 0.5 * (Math.sqrt(-((2 * p) - 3) * ((2 * p) - 1)) + 1);
    }
  },
  ExponentialEaseIn: function(p) {
    if (p === 0.0) {
      return p;
    } else {
      return Math.pow(2, 10 * (p - 1));
    }
  },
  ExponentialEaseOut: function(p) {
    if (p === 1.0) {
      return p;
    } else {
      return 1 - Math.pow(2, -10 * p);
    }
  },
  ExponentialEaseInOut: function(p) {
    if (p === 0.0 || p === 1.0) {
      return p;
    }
    if (p < 0.5) {
      return 0.5 * Math.pow(2, (20 * p) - 10);
    } else {
      return -0.5 * Math.pow(2, (-20 * p) + 10) + 1;
    }
  },
  ElasticEaseIn: function(p) {
    return Math.sin(13 * Math.PI * 2 * p) * Math.pow(2, 10 * (p - 1));
  },
  ElasticEaseOut: function(p) {
    return Math.sin(-13 * Math.PI * 2 * (p + 1)) * Math.pow(2, -10 * p) + 1;
  },
  ElasticEaseInOut: function(p) {
    if (p < 0.5) {
      return 0.5 * Math.sin(13 * Math.PI * 2 * (2 * p)) * Math.pow(2, 10 * ((2 * p) - 1));
    } else {
      return 0.5 * (Math.sin(-13 * Math.PI * 2 * ((2 * p - 1) + 1)) * Math.pow(2, -10 * (2 * p - 1)) + 2);
    }
  },
  BackEaseIn: function(p) {
    return p * p * p - p * Math.sin(p * Math.PI);
  },
  BackEaseOut: function(p) {
    var f;
    f = 1 - p;
    return 1 - (f * f * f - f * Math.sin(f * Math.PI));
  },
  BackEaseInOut: function(p) {
    var f;
    if (p < 0.5) {
      f = 2 * p;
      return 0.5 * (f * f * f - f * Math.sin(f * Math.PI));
    } else {
      f = 1 - (2 * p - 1);
      return 0.5 * (1 - (f * f * f - f * Math.sin(f * Math.PI))) + 0.5;
    }
  },
  BounceEaseIn: function(p) {
    return 1 - this.BounceEaseOut(1 - p);
  },
  BounceEaseOut: function(p) {
    if (p < 4 / 11.0) {
      return (121 * p * p) / 16.0;
    } else if (p < 8 / 11.0) {
      return (363 / 40.0 * p * p) - (99 / 10.0 * p) + 17 / 5.0;
    } else if (p < 9 / 10.0) {
      return (4356 / 361.0 * p * p) - (35442 / 1805.0 * p) + 16061 / 1805.0;
    } else {
      return (54 / 5.0 * p * p) - (513 / 25.0 * p) + 268 / 25.0;
    }
  },
  BounceEaseInOut: function(p) {
    if (p < 0.5) {
      return 0.5 * this.BounceEaseIn(p * 2);
    } else {
      return 0.5 * this.BounceEaseOut(p * 2 - 1) + 0.5;
    }
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRocmVlanMvaGVscGVycy9Ud2Vlbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxPQUFBOztBQUFBLE9BQUEsR0FBVSxPQUFBLElBQVc7QUFBQSxFQVFuQixNQUFBLEVBQVEsU0FBQyxDQUFELEdBQUE7QUFDTixXQUFPLENBQVAsQ0FETTtFQUFBLENBUlc7QUFBQSxFQVluQixlQUFBLEVBQWlCLFNBQUMsQ0FBRCxHQUFBO0FBQ2YsV0FBTyxDQUFBLEdBQUksQ0FBWCxDQURlO0VBQUEsQ0FaRTtBQUFBLEVBZ0JuQixnQkFBQSxFQUFrQixTQUFDLENBQUQsR0FBQTtBQUNoQixXQUFPLENBQUEsQ0FBRSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFMLENBQVIsQ0FEZ0I7RUFBQSxDQWhCQztBQUFBLEVBc0JuQixrQkFBQSxFQUFvQixTQUFDLENBQUQsR0FBQTtBQUNsQixJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBZixDQURGO0tBQUEsTUFBQTtBQUdFLGFBQU8sQ0FBQyxDQUFBLENBQUEsR0FBSyxDQUFMLEdBQVMsQ0FBVixDQUFBLEdBQWUsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFmLEdBQXlCLENBQWhDLENBSEY7S0FEa0I7RUFBQSxDQXRCRDtBQUFBLEVBNkJuQixXQUFBLEVBQWEsU0FBQyxDQUFELEdBQUE7QUFDWCxXQUFPLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBZixDQURXO0VBQUEsQ0E3Qk07QUFBQSxFQWlDbkIsWUFBQSxFQUFjLFNBQUMsQ0FBRCxHQUFBO0FBQ1osUUFBQSxDQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUssQ0FBQSxHQUFJLENBQVQsQ0FBQTtBQUNBLFdBQU8sQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFSLEdBQVksQ0FBbkIsQ0FGWTtFQUFBLENBakNLO0FBQUEsRUF3Q25CLGNBQUEsRUFBZ0IsU0FBQyxDQUFELEdBQUE7QUFDZCxRQUFBLENBQUE7QUFBQSxJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBUixHQUFZLENBQW5CLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxDQUFBLEdBQUssQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBZixDQUFBO0FBQ0EsYUFBTyxHQUFBLEdBQU0sQ0FBTixHQUFVLENBQVYsR0FBYyxDQUFkLEdBQWtCLENBQXpCLENBSkY7S0FEYztFQUFBLENBeENHO0FBQUEsRUFnRG5CLGFBQUEsRUFBZSxTQUFDLENBQUQsR0FBQTtBQUNiLFdBQU8sQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFSLEdBQVksQ0FBbkIsQ0FEYTtFQUFBLENBaERJO0FBQUEsRUFvRG5CLGNBQUEsRUFBZ0IsU0FBQyxDQUFELEdBQUE7QUFDZCxRQUFBLENBQUE7QUFBQSxJQUFBLENBQUEsR0FBSyxDQUFBLEdBQUksQ0FBVCxDQUFBO0FBQ0EsV0FBTyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQVosR0FBc0IsQ0FBN0IsQ0FGYztFQUFBLENBcERHO0FBQUEsRUEyRG5CLGdCQUFBLEVBQWtCLFNBQUMsQ0FBRCxHQUFBO0FBRWhCLFFBQUEsQ0FBQTtBQUFBLElBQUEsSUFBRyxDQUFBLEdBQUksR0FBUDtBQUNFLGFBQU8sQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFSLEdBQVksQ0FBWixHQUFnQixDQUF2QixDQURGO0tBQUEsTUFBQTtBQUdFLE1BQUEsQ0FBQSxHQUFLLENBQUEsR0FBSSxDQUFULENBQUE7QUFDQSxhQUFPLENBQUEsQ0FBQSxHQUFLLENBQUwsR0FBUyxDQUFULEdBQWEsQ0FBYixHQUFpQixDQUFqQixHQUFxQixDQUE1QixDQUpGO0tBRmdCO0VBQUEsQ0EzREM7QUFBQSxFQW9FbkIsYUFBQSxFQUFlLFNBQUMsQ0FBRCxHQUFBO0FBQ2IsV0FBTyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFaLEdBQWdCLENBQXZCLENBRGE7RUFBQSxDQXBFSTtBQUFBLEVBd0VuQixjQUFBLEVBQWdCLFNBQUMsQ0FBRCxHQUFBO0FBQ2QsUUFBQSxDQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUssQ0FBQSxHQUFJLENBQVQsQ0FBQTtBQUNBLFdBQU8sQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFSLEdBQVksQ0FBWixHQUFnQixDQUFoQixHQUFvQixDQUEzQixDQUZjO0VBQUEsQ0F4RUc7QUFBQSxFQStFbkIsZ0JBQUEsRUFBa0IsU0FBQyxDQUFELEdBQUE7QUFDaEIsUUFBQSxDQUFBO0FBQUEsSUFBQSxJQUFHLENBQUEsR0FBSSxHQUFQO0FBQ0UsYUFBTyxFQUFBLEdBQUssQ0FBTCxHQUFTLENBQVQsR0FBYSxDQUFiLEdBQWlCLENBQWpCLEdBQXFCLENBQTVCLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxDQUFBLEdBQUssQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBZixDQUFBO0FBQ0EsYUFBUSxHQUFBLEdBQU0sQ0FBTixHQUFVLENBQVYsR0FBYyxDQUFkLEdBQWtCLENBQWxCLEdBQXNCLENBQXRCLEdBQTBCLENBQWxDLENBSkY7S0FEZ0I7RUFBQSxDQS9FQztBQUFBLEVBdUZuQixVQUFBLEVBQVksU0FBQyxDQUFELEdBQUE7QUFDVixXQUFPLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsSUFBSSxDQUFDLEVBQWYsR0FBb0IsQ0FBN0IsQ0FBQSxHQUFrQyxDQUF6QyxDQURVO0VBQUEsQ0F2Rk87QUFBQSxFQTJGbkIsV0FBQSxFQUFhLFNBQUMsQ0FBRCxHQUFBO0FBQ1gsV0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsR0FBSSxJQUFJLENBQUMsRUFBVCxHQUFjLENBQXZCLENBQVAsQ0FEVztFQUFBLENBM0ZNO0FBQUEsRUErRm5CLGFBQUEsRUFBZSxTQUFDLENBQUQsR0FBQTtBQUNiLFdBQU8sR0FBQSxHQUFNLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQSxHQUFJLElBQUksQ0FBQyxFQUFsQixDQUFMLENBQWIsQ0FEYTtFQUFBLENBL0ZJO0FBQUEsRUFtR25CLGNBQUEsRUFBZ0IsU0FBQyxDQUFELEdBQUE7QUFDZCxXQUFPLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQWQsQ0FBWCxDQURjO0VBQUEsQ0FuR0c7QUFBQSxFQXVHbkIsZUFBQSxFQUFpQixTQUFDLENBQUQsR0FBQTtBQUNmLFdBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxDQUFwQixDQUFQLENBRGU7RUFBQSxDQXZHRTtBQUFBLEVBNkduQixpQkFBQSxFQUFtQixTQUFDLENBQUQsR0FBQTtBQUNqQixJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLEdBQUEsR0FBTSxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFsQixDQUFMLENBQWIsQ0FERjtLQUFBLE1BQUE7QUFHRSxhQUFPLEdBQUEsR0FBTSxDQUFDLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBQSxDQUFFLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVgsQ0FBRCxHQUFpQixDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVgsQ0FBM0IsQ0FBQSxHQUE0QyxDQUE3QyxDQUFiLENBSEY7S0FEaUI7RUFBQSxDQTdHQTtBQUFBLEVBcUhuQixpQkFBQSxFQUFtQixTQUFDLENBQUQsR0FBQTtBQUNWLElBQUEsSUFBSSxDQUFBLEtBQUssR0FBVDthQUFtQixFQUFuQjtLQUFBLE1BQUE7YUFBMEIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksRUFBQSxHQUFLLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBakIsRUFBMUI7S0FEVTtFQUFBLENBckhBO0FBQUEsRUF5SG5CLGtCQUFBLEVBQW9CLFNBQUMsQ0FBRCxHQUFBO0FBQ1gsSUFBQSxJQUFJLENBQUEsS0FBSyxHQUFUO2FBQW1CLEVBQW5CO0tBQUEsTUFBQTthQUEwQixDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBQSxFQUFBLEdBQU0sQ0FBbEIsRUFBOUI7S0FEVztFQUFBLENBekhEO0FBQUEsRUErSG5CLG9CQUFBLEVBQXNCLFNBQUMsQ0FBRCxHQUFBO0FBQ3BCLElBQUEsSUFBRyxDQUFBLEtBQUssR0FBTCxJQUFZLENBQUEsS0FBSyxHQUFwQjtBQUNFLGFBQU8sQ0FBUCxDQURGO0tBQUE7QUFHQSxJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLEdBQUEsR0FBTSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFDLEVBQUEsR0FBSyxDQUFOLENBQUEsR0FBVyxFQUF2QixDQUFiLENBREY7S0FBQSxNQUFBO0FBR0UsYUFBTyxDQUFBLEdBQUEsR0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFDLENBQUEsRUFBQSxHQUFNLENBQVAsQ0FBQSxHQUFZLEVBQXhCLENBQVAsR0FBcUMsQ0FBNUMsQ0FIRjtLQUpvQjtFQUFBLENBL0hIO0FBQUEsRUF5SW5CLGFBQUEsRUFBZSxTQUFDLENBQUQsR0FBQTtBQUNiLFdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFBLEdBQUssSUFBSSxDQUFDLEVBQVYsR0FBZSxDQUFmLEdBQW1CLENBQTVCLENBQUEsR0FBaUMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksRUFBQSxHQUFLLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBakIsQ0FBeEMsQ0FEYTtFQUFBLENBeklJO0FBQUEsRUE2SW5CLGNBQUEsRUFBZ0IsU0FBQyxDQUFELEdBQUE7QUFDZCxXQUFPLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQSxFQUFBLEdBQU0sSUFBSSxDQUFDLEVBQVgsR0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUE3QixDQUFBLEdBQXdDLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUEsRUFBQSxHQUFNLENBQWxCLENBQXhDLEdBQStELENBQXRFLENBRGM7RUFBQSxDQTdJRztBQUFBLEVBbUpuQixnQkFBQSxFQUFrQixTQUFDLENBQUQsR0FBQTtBQUNoQixJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLEdBQUEsR0FBTSxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQUEsR0FBSyxJQUFJLENBQUMsRUFBVixHQUFlLENBQWYsR0FBbUIsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUE1QixDQUFOLEdBQTZDLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLEVBQUEsR0FBSyxDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLENBQVgsQ0FBakIsQ0FBcEQsQ0FERjtLQUFBLE1BQUE7QUFHRSxhQUFPLEdBQUEsR0FBTSxDQUFDLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQSxFQUFBLEdBQU0sSUFBSSxDQUFDLEVBQVgsR0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFKLEdBQVEsQ0FBVCxDQUFBLEdBQWMsQ0FBZixDQUE3QixDQUFBLEdBQWtELElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUEsRUFBQSxHQUFNLENBQUMsQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFULENBQWxCLENBQWxELEdBQW1GLENBQXBGLENBQWIsQ0FIRjtLQURnQjtFQUFBLENBbkpDO0FBQUEsRUEwSm5CLFVBQUEsRUFBWSxTQUFDLENBQUQsR0FBQTtBQUNWLFdBQU8sQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFSLEdBQVksQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQSxHQUFJLElBQUksQ0FBQyxFQUFsQixDQUF2QixDQURVO0VBQUEsQ0ExSk87QUFBQSxFQThKbkIsV0FBQSxFQUFhLFNBQUMsQ0FBRCxHQUFBO0FBQ1gsUUFBQSxDQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUssQ0FBQSxHQUFJLENBQVQsQ0FBQTtBQUNBLFdBQU8sQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLENBQUosR0FBUSxDQUFSLEdBQVksQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQSxHQUFJLElBQUksQ0FBQyxFQUFsQixDQUFqQixDQUFYLENBRlc7RUFBQSxDQTlKTTtBQUFBLEVBcUtuQixhQUFBLEVBQWUsU0FBQyxDQUFELEdBQUE7QUFDYixRQUFBLENBQUE7QUFBQSxJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxNQUFBLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBUixDQUFBO0FBQ0EsYUFBTyxHQUFBLEdBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUksSUFBSSxDQUFDLEVBQWxCLENBQWpCLENBQWIsQ0FGRjtLQUFBLE1BQUE7QUFJRSxNQUFBLENBQUEsR0FBSyxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUUsQ0FBRixHQUFNLENBQVAsQ0FBVCxDQUFBO0FBQ0EsYUFBTyxHQUFBLEdBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFBLEdBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUksSUFBSSxDQUFDLEVBQWxCLENBQWpCLENBQUwsQ0FBTixHQUFzRCxHQUE3RCxDQUxGO0tBRGE7RUFBQSxDQXJLSTtBQUFBLEVBNktuQixZQUFBLEVBQWMsU0FBQyxDQUFELEdBQUE7QUFDWixXQUFPLENBQUEsR0FBSSxJQUFDLENBQUEsYUFBRCxDQUFlLENBQUEsR0FBSSxDQUFuQixDQUFYLENBRFk7RUFBQSxDQTdLSztBQUFBLEVBZ0xuQixhQUFBLEVBQWUsU0FBQyxDQUFELEdBQUE7QUFDYixJQUFBLElBQUcsQ0FBQSxHQUFJLENBQUEsR0FBRSxJQUFUO0FBQ0UsYUFBTyxDQUFDLEdBQUEsR0FBTSxDQUFOLEdBQVUsQ0FBWCxDQUFBLEdBQWMsSUFBckIsQ0FERjtLQUFBLE1BRUssSUFBRyxDQUFBLEdBQUksQ0FBQSxHQUFFLElBQVQ7QUFDSCxhQUFPLENBQUMsR0FBQSxHQUFJLElBQUosR0FBVyxDQUFYLEdBQWUsQ0FBaEIsQ0FBQSxHQUFxQixDQUFDLEVBQUEsR0FBRyxJQUFILEdBQVUsQ0FBWCxDQUFyQixHQUFxQyxFQUFBLEdBQUcsR0FBL0MsQ0FERztLQUFBLE1BRUEsSUFBRyxDQUFBLEdBQUksQ0FBQSxHQUFFLElBQVQ7QUFDSCxhQUFPLENBQUMsSUFBQSxHQUFLLEtBQUwsR0FBYSxDQUFiLEdBQWlCLENBQWxCLENBQUEsR0FBdUIsQ0FBQyxLQUFBLEdBQU0sTUFBTixHQUFlLENBQWhCLENBQXZCLEdBQTRDLEtBQUEsR0FBTSxNQUF6RCxDQURHO0tBQUEsTUFBQTtBQUdILGFBQU8sQ0FBQyxFQUFBLEdBQUcsR0FBSCxHQUFTLENBQVQsR0FBYSxDQUFkLENBQUEsR0FBbUIsQ0FBQyxHQUFBLEdBQUksSUFBSixHQUFXLENBQVosQ0FBbkIsR0FBb0MsR0FBQSxHQUFJLElBQS9DLENBSEc7S0FMUTtFQUFBLENBaExJO0FBQUEsRUEwTG5CLGVBQUEsRUFBaUIsU0FBQyxDQUFELEdBQUE7QUFDZixJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxhQUFPLEdBQUEsR0FBTSxJQUFDLENBQUEsWUFBRCxDQUFjLENBQUEsR0FBRSxDQUFoQixDQUFiLENBREY7S0FBQSxNQUFBO0FBR0UsYUFBTyxHQUFBLEdBQU0sSUFBQyxDQUFBLGFBQUQsQ0FBZSxDQUFBLEdBQUksQ0FBSixHQUFRLENBQXZCLENBQU4sR0FBa0MsR0FBekMsQ0FIRjtLQURlO0VBQUEsQ0ExTEU7Q0FBckIsQ0FBQSIsImZpbGUiOiJ0aHJlZWpzL2hlbHBlcnMvVHdlZW4uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJfRWFzaW5nID0gX0Vhc2luZyB8fCB7XG5cbiAgI1xuICAjICBFYXNpbmcgZnVuY3Rpb24gaW5zcGlyZWQgZnJvbSBBSEVhc2luZ1xuICAjICBodHRwczovL2dpdGh1Yi5jb20vd2FycmVubS9BSEVhc2luZ1xuICAjXG5cbiAgIyMgTW9kZWxlZCBhZnRlciB0aGUgbGluZSB5ID0geFxuICBsaW5lYXI6IChwKS0+XG4gICAgcmV0dXJuIHBcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBhcmFib2xhIHkgPSB4XjJcbiAgUXVhZHJhdGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcFxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGFyYWJvbGEgeSA9IC14XjIgKyAyeFxuICBRdWFkcmF0aWNFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiAtKHAgKiAocCAtIDIpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIHF1YWRyYXRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjIpICAgICAgICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gLSgxLzIpKCgyeC0xKSooMngtMykgLSAxKSA7IFswLjUsIDFdXG4gIFF1YWRyYXRpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDIgKiBwICogcFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoLTIgKiBwICogcCkgKyAoNCAqIHApIC0gMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgY3ViaWMgeSA9IHheM1xuICBDdWJpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBjdWJpYyB5ID0gKHggLSAxKV4zICsgMVxuICBDdWJpY0Vhc2VPdXQ6IChwKS0+XG4gICAgZiA9IChwIC0gMSlcbiAgICByZXR1cm4gZiAqIGYgKiBmICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIGN1YmljXG4gICMgeSA9ICgxLzIpKCgyeCleMykgICAgICAgOyBbMCwgMC41KVxuICAjIHkgPSAoMS8yKSgoMngtMileMyArIDIpIDsgWzAuNSwgMV1cbiAgQ3ViaWNFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiA0ICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9ICgoMiAqIHApIC0gMilcbiAgICAgIHJldHVybiAwLjUgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHheNFxuICBRdWFydGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHAgKiBwXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBxdWFydGljIHkgPSAxIC0gKHggLSAxKV40XG4gIFF1YXJ0aWNFYXNlT3V0OiAocCktPlxuICAgIGYgPSAocCAtIDEpXG4gICAgcmV0dXJuIGYgKiBmICogZiAqICgxIC0gcCkgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgcXVhcnRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjQpICAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9IC0oMS8yKSgoMngtMileNCAtIDIpIDsgWzAuNSwgMV1cbiAgUXVhcnRpY0Vhc2VJbk91dDogKHApLT5cblxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gOCAqIHAgKiBwICogcCAqIHBcbiAgICBlbHNlXG4gICAgICBmID0gKHAgLSAxKVxuICAgICAgcmV0dXJuIC04ICogZiAqIGYgKiBmICogZiArIDFcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHF1aW50aWMgeSA9IHheNVxuICBRdWludGljRWFzZUluOiAocCktPlxuICAgIHJldHVybiBwICogcCAqIHAgKiBwICogcFxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcXVpbnRpYyB5ID0gKHggLSAxKV41ICsgMVxuICBRdWludGljRWFzZU91dDogKHApLT5cbiAgICBmID0gKHAgLSAxKTtcbiAgICByZXR1cm4gZiAqIGYgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgcXVpbnRpY1xuICAjIHkgPSAoMS8yKSgoMngpXjUpICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gKDEvMikoKDJ4LTIpXjUgKyAyKSA7IFswLjUsIDFdXG4gIFF1aW50aWNFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAxNiAqIHAgKiBwICogcCAqIHAgKiBwXG4gICAgZWxzZVxuICAgICAgZiA9ICgoMiAqIHApIC0gMilcbiAgICAgIHJldHVybiAgMC41ICogZiAqIGYgKiBmICogZiAqIGYgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHF1YXJ0ZXItY3ljbGUgb2Ygc2luZSB3YXZlXG4gIFNpbmVFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIE1hdGguc2luKChwIC0gMSkgKiBNYXRoLlBJICogMikgKyAxXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHF1YXJ0ZXItY3ljbGUgb2Ygc2luZSB3YXZlIChkaWZmZXJlbnQgcGhhc2UpXG4gIFNpbmVFYXNlT3V0OiAocCktPlxuICAgIHJldHVybiBNYXRoLnNpbihwICogTWF0aC5QSSAqIDIpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIGhhbGYgc2luZSB3YXZlXG4gIFNpbmVFYXNlSW5PdXQ6IChwKS0+XG4gICAgcmV0dXJuIDAuNSAqICgxIC0gTWF0aC5jb3MocCAqIE1hdGguUEkpKVxuXG4gICMgTW9kZWxlZCBhZnRlciBzaGlmdGVkIHF1YWRyYW50IElWIG9mIHVuaXQgY2lyY2xlXG4gIENpcmN1bGFyRWFzZUluOiAocCktPlxuICAgIHJldHVybiAxIC0gTWF0aC5zcXJ0KDEgLSAocCAqIHApKVxuXG4gICMgTW9kZWxlZCBhZnRlciBzaGlmdGVkIHF1YWRyYW50IElJIG9mIHVuaXQgY2lyY2xlXG4gIENpcmN1bGFyRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KCgyIC0gcCkgKiBwKTtcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBjaXJjdWxhciBmdW5jdGlvblxuICAjIHkgPSAoMS8yKSgxIC0gc3FydCgxIC0gNHheMikpICAgICAgICAgICA7IFswLCAwLjUpXG4gICMgeSA9ICgxLzIpKHNxcnQoLSgyeCAtIDMpKigyeCAtIDEpKSArIDEpIDsgWzAuNSwgMV1cbiAgQ2lyY3VsYXJFYXNlSW5PdXQ6IChwKS0+XG4gICAgaWYocCA8IDAuNSlcbiAgICAgIHJldHVybiAwLjUgKiAoMSAtIE1hdGguc3FydCgxIC0gNCAqIChwICogcCkpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KC0oKDIgKiBwKSAtIDMpICogKCgyICogcCkgLSAxKSkgKyAxKVxuXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBleHBvbmVudGlhbCBmdW5jdGlvbiB5ID0gMl4oMTAoeCAtIDEpKVxuICBFeHBvbmVudGlhbEVhc2VJbjogKHApLT5cbiAgICByZXR1cm4gaWYgKHAgPT0gMC4wKSB0aGVuIHAgZWxzZSBNYXRoLnBvdygyLCAxMCAqIChwIC0gMSkpXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBleHBvbmVudGlhbCBmdW5jdGlvbiB5ID0gLTJeKC0xMHgpICsgMVxuICBFeHBvbmVudGlhbEVhc2VPdXQ6IChwKS0+XG4gICAgcmV0dXJuIGlmIChwID09IDEuMCkgdGhlbiBwIGVsc2UgMSAtIE1hdGgucG93KDIsIC0xMCAqIHApXG5cbiAgIyBNb2RlbGVkIGFmdGVyIHRoZSBwaWVjZXdpc2UgZXhwb25lbnRpYWxcbiAgIyB5ID0gKDEvMikyXigxMCgyeCAtIDEpKSAgICAgICAgIDsgWzAsMC41KVxuICAjIHkgPSAtKDEvMikqMl4oLTEwKDJ4IC0gMSkpKSArIDEgOyBbMC41LDFdXG4gIEV4cG9uZW50aWFsRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPT0gMC4wIHx8IHAgPT0gMS4wKVxuICAgICAgcmV0dXJuIHBcblxuICAgIGlmKHAgPCAwLjUpXG4gICAgICByZXR1cm4gMC41ICogTWF0aC5wb3coMiwgKDIwICogcCkgLSAxMClcbiAgICBlbHNlXG4gICAgICByZXR1cm4gLTAuNSAqIE1hdGgucG93KDIsICgtMjAgKiBwKSArIDEwKSArIDFcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIGRhbXBlZCBzaW5lIHdhdmUgeSA9IHNpbigxM3BpLzIqeCkqcG93KDIsIDEwICogKHggLSAxKSlcbiAgRWxhc3RpY0Vhc2VJbjogKHApLT5cbiAgICByZXR1cm4gTWF0aC5zaW4oMTMgKiBNYXRoLlBJICogMiAqIHApICogTWF0aC5wb3coMiwgMTAgKiAocCAtIDEpKVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgZGFtcGVkIHNpbmUgd2F2ZSB5ID0gc2luKC0xM3BpLzIqKHggKyAxKSkqcG93KDIsIC0xMHgpICsgMVxuICBFbGFzdGljRWFzZU91dDogKHApLT5cbiAgICByZXR1cm4gTWF0aC5zaW4oLTEzICogTWF0aC5QSSAqIDIgKiAocCArIDEpKSAqIE1hdGgucG93KDIsIC0xMCAqIHApICsgMVxuXG4gICMgTW9kZWxlZCBhZnRlciB0aGUgcGllY2V3aXNlIGV4cG9uZW50aWFsbHktZGFtcGVkIHNpbmUgd2F2ZTpcbiAgIyB5ID0gKDEvMikqc2luKDEzcGkvMiooMip4KSkqcG93KDIsIDEwICogKCgyKngpIC0gMSkpICAgICAgOyBbMCwwLjUpXG4gICMgeSA9ICgxLzIpKihzaW4oLTEzcGkvMiooKDJ4LTEpKzEpKSpwb3coMiwtMTAoMip4LTEpKSArIDIpIDsgWzAuNSwgMV1cbiAgRWxhc3RpY0Vhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDAuNSAqIE1hdGguc2luKDEzICogTWF0aC5QSSAqIDIgKiAoMiAqIHApKSAqIE1hdGgucG93KDIsIDEwICogKCgyICogcCkgLSAxKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMC41ICogKE1hdGguc2luKC0xMyAqIE1hdGguUEkgKiAyICogKCgyICogcCAtIDEpICsgMSkpICogTWF0aC5wb3coMiwgLTEwICogKDIgKiBwIC0gMSkpICsgMilcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIG92ZXJzaG9vdGluZyBjdWJpYyB5ID0geF4zLXgqc2luKHgqcGkpXG4gIEJhY2tFYXNlSW46IChwKS0+XG4gICAgcmV0dXJuIHAgKiBwICogcCAtIHAgKiBNYXRoLnNpbihwICogTWF0aC5QSSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgb3ZlcnNob290aW5nIGN1YmljIHkgPSAxLSgoMS14KV4zLSgxLXgpKnNpbigoMS14KSpwaSkpXG4gIEJhY2tFYXNlT3V0OiAocCktPlxuICAgIGYgPSAoMSAtIHApXG4gICAgcmV0dXJuIDEgLSAoZiAqIGYgKiBmIC0gZiAqIE1hdGguc2luKGYgKiBNYXRoLlBJKSlcblxuICAjIE1vZGVsZWQgYWZ0ZXIgdGhlIHBpZWNld2lzZSBvdmVyc2hvb3RpbmcgY3ViaWMgZnVuY3Rpb246XG4gICMgeSA9ICgxLzIpKigoMngpXjMtKDJ4KSpzaW4oMip4KnBpKSkgICAgICAgICAgIDsgWzAsIDAuNSlcbiAgIyB5ID0gKDEvMikqKDEtKCgxLXgpXjMtKDEteCkqc2luKCgxLXgpKnBpKSkrMSkgOyBbMC41LCAxXVxuICBCYWNrRWFzZUluT3V0OiAocCktPlxuICAgIGlmKHAgPCAwLjUpXG4gICAgICBmID0gMiAqIHBcbiAgICAgIHJldHVybiAwLjUgKiAoZiAqIGYgKiBmIC0gZiAqIE1hdGguc2luKGYgKiBNYXRoLlBJKSlcbiAgICBlbHNlXG4gICAgICBmID0gKDEgLSAoMipwIC0gMSkpXG4gICAgICByZXR1cm4gMC41ICogKDEgLSAoZiAqIGYgKiBmIC0gZiAqIE1hdGguc2luKGYgKiBNYXRoLlBJKSkpICsgMC41XG5cbiAgQm91bmNlRWFzZUluOiAocCktPlxuICAgIHJldHVybiAxIC0gQEJvdW5jZUVhc2VPdXQoMSAtIHApO1xuXG4gIEJvdW5jZUVhc2VPdXQ6IChwKS0+XG4gICAgaWYocCA8IDQvMTEuMClcbiAgICAgIHJldHVybiAoMTIxICogcCAqIHApLzE2LjBcbiAgICBlbHNlIGlmKHAgPCA4LzExLjApXG4gICAgICByZXR1cm4gKDM2My80MC4wICogcCAqIHApIC0gKDk5LzEwLjAgKiBwKSArIDE3LzUuMFxuICAgIGVsc2UgaWYocCA8IDkvMTAuMClcbiAgICAgIHJldHVybiAoNDM1Ni8zNjEuMCAqIHAgKiBwKSAtICgzNTQ0Mi8xODA1LjAgKiBwKSArIDE2MDYxLzE4MDUuMFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoNTQvNS4wICogcCAqIHApIC0gKDUxMy8yNS4wICogcCkgKyAyNjgvMjUuMFxuXG4gIEJvdW5jZUVhc2VJbk91dDogKHApLT5cbiAgICBpZihwIDwgMC41KVxuICAgICAgcmV0dXJuIDAuNSAqIEBCb3VuY2VFYXNlSW4ocCoyKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwLjUgKiBAQm91bmNlRWFzZU91dChwICogMiAtIDEpICsgMC41XG5cbn1cbiJdfQ==