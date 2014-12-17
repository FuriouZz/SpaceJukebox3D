_THREE = _THREE || {
  HermiteCurve: (pts)->
    path = new THREE.CurvePath()
    path.add(new THREE.HermiteBezierCurve3(pts[0], pts[0], pts[1], pts[2]))
    for i in [0..(pts.length-4)]
      path.add(new THREE.HermiteBezierCurve3(pts[i], pts[i+1], pts[i+2], pts[i+3]))
    path.add(new THREE.HermiteBezierCurve3(pts[pts.length-3], pts[pts.length-2], pts[pts.length-1], pts[pts.length-1]))
    return path
}

THREE.Curve.Utils.tangentHermiteBezier = ( y0, y1, y2, y3, mu, tension, bias )->
    mu2 = mu * mu
    mu3 = mu2 * mu

    m0  = (y1-y0)*(1+bias)*(1-tension)/2
    m0  += (y2-y1)*(1-bias)*(1-tension)/2

    m1  = (y2-y1)*(1+bias)*(1-tension)/2
    m1  += (y3-y2)*(1-bias)*(1-tension)/2

    a0  =  2*mu3 - 3*mu2 + 1
    a1  =    mu3 - 2*mu2 + mu
    a2  =    mu3 -   mu2
    a3  = -2*mu3 + 3*mu2

    return(a0*y1+a1*m0+a2*m1+a3*y2)

THREE.HermiteBezierCurve3 = THREE.Curve.create(
  (v0, v1, v2, v3)->
    @v0 = v0
    @v1 = v1
    @v2 = v2
    @v3 = v3
    return
  , (t)->
    vector = new THREE.Vector3()
    vector.x = THREE.Curve.Utils.tangentHermiteBezier(@v0.x, @v1.x, @v2.x, @v3.x, t, 0, 0)
    vector.y = THREE.Curve.Utils.tangentHermiteBezier(@v0.y, @v1.y, @v2.y, @v3.y, t, 0, 0)
    vector.z = THREE.Curve.Utils.tangentHermiteBezier(@v0.z, @v1.z, @v2.z, @v3.z, t, 0, 0)
    return vector
)

THREE.IncomingCurve = THREE.Curve.create(
  (v0, startAngle=0, maxRadius=100, minRadius=0, inverse=false, useGolden=false)->
    @v0         = v0
    @inverse    = inverse
    @startAngle = startAngle

    @maxRadius  = maxRadius
    @minRadius  = minRadius
    @radius     = @maxRadius - @minRadius

    @useGolden  = useGolden

    return
  , (t)->
    t     = 1 - t if @inverse
    if @useGolden
        phi   = (Math.sqrt(5)+1)/2 - 1
        golden_angle = phi * Math.PI * 2
        angle = @startAngle + (golden_angle * t)
        angle += Math.PI * -1.235
    else
        angle = @startAngle + (Math.PI * 2 * t)

    vector = new THREE.Vector3()
    vector.x = @v0.x + Math.cos(angle) * (@minRadius + @radius * t)
    vector.y = @v0.y + Math.sin(angle) * (@minRadius + @radius * t)
    vector.z = @v0.z
    return vector
)

THREE.TestCurve = THREE.Curve.create(
  (v0, v1, nbLoop=2)->
    @v0   = v0
    @v1   = v1
    @nbLoop = nbLoop
    return
  , (t)->
    angle = Math.PI * 2 * t * @nbLoop

    d = @v1.z - @v0.z

    dist = @v1.clone().sub(@v0)

    vector = new THREE.Vector3()
    vector.x = @v0.x + dist.x * t
    vector.y = @v0.y + dist.y * t
    vector.z = @v0.z + dist.z * t

    t = Math.min(t, 1 - t) / .5

    vector.x += Math.cos(angle) * (50 * t)
    vector.y += Math.sin(angle) * (50 * t)

    return vector
)
