window._Math = window._Math || {
  angleBetweenPoints: (first, second) ->
    height = second.y - first.y
    width  = second.x - first.x
    return Math.atan2(height, width)

  distance: (point1, point2) ->
    x = point1.x - point2.x
    y = point1.y - point2.y
    d = x * x + y * y
    return Math.sqrt(d)

  collision: (dot1, dot2)->
    r1 = if dot1.radius then dot1.radius else 0
    r2 = if dot2.radius then dot2.radius else 0
    dist = r1 + r2

    return @distance(dot1.position, dot2.position) <= Math.sqrt(dist * dist)

  map: (value, low1, high1, low2, high2) ->
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1)

  # Hermite Curve
  hermite: (y0, y1, y2, y3, mu, tension, bias)->
    `
    var m0,m1,mu2,mu3;
    var a0,a1,a2,a3;

    mu2 = mu * mu;
    mu3 = mu2 * mu;
    m0  = (y1-y0)*(1+bias)*(1-tension)/2;
    m0 += (y2-y1)*(1-bias)*(1-tension)/2;
    m1  = (y2-y1)*(1+bias)*(1-tension)/2;
    m1 += (y3-y2)*(1-bias)*(1-tension)/2;
    a0 =  2*mu3 - 3*mu2 + 1;
    a1 =    mu3 - 2*mu2 + mu;
    a2 =    mu3 -   mu2;
    a3 = -2*mu3 + 3*mu2;
    `
    return(a0*y1+a1*m0+a2*m1+a3*y2)
}
