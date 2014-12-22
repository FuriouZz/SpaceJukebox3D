class SPACE.Spaceship extends THREE.Group

  time: 0

  ship: null
  path: null
  duration: 0
  songDuration: 0

  state: null

  angle: 0

  _cached: null

  # STATES
  @IDLE:     'IDLE'
  @LAUNCHED: 'LAUNCHED'
  @IN_LOOP:  'IN_LOOP'
  @ARRIVED:  'ARRIVED'

  constructor: (target, radius)->
    super

    @target = new THREE.Vector3(target.x, target.y, 5)
    @radius = radius
    @angle  = Math.random() * Math.PI * 2

    @setState(SPACE.Spaceship.IDLE)

    @setup()

  setRadius: (radius)->
    @radius = radius
    @_cached = @_computePaths()

  setup: ->
    g = new THREE.Geometry()
    g.vertices.push(
      new THREE.Vector3(  0, -52.5, -10)
      new THREE.Vector3(-10, -67.5,  10)
      new THREE.Vector3(-50, -42.5,  10)
      new THREE.Vector3(  0,  67.5,  10)
      new THREE.Vector3(+50, -42.5,  10)
      new THREE.Vector3(+10, -67.5,  10)
    )
    g.faces.push(
      new THREE.Face3(0, 3, 1),
      new THREE.Face3(1, 2, 3),
      new THREE.Face3(3, 0, 5),
      new THREE.Face3(5, 4, 3)
    )
    g.computeFaceNormals()
    matrix = new THREE.Matrix4()
    matrix.makeRotationX(Math.PI*.5)
    g.applyMatrix(matrix)
    matrix.makeRotationZ(Math.PI)
    g.applyMatrix(matrix)

    @ship = THREE.SceneUtils.createMultiMaterialObject(g, [
      new THREE.MeshLambertMaterial({ color: 0x0088ff, side: THREE.DoubleSide })
    ])
    @ship.castShadow = true
    @ship.receiveShadow = true
    @ship.scale.set(.15, .15, .15)
    @add(@ship)

    @_cached = @_computePaths()
    v = @_cached.launchedPath.getPointAt(0)
    @ship.position.set(v.x, v.y, v.z)

  setState: (state)->
    @state = state
    switch state
      when SPACE.Spaceship.IDLE
        # SPACE.LOG('IDLE')
        @path = null
      when SPACE.Spaceship.LAUNCHED
        # SPACE.LOG('LAUNCHED')
        @_resetTime()
        @path = @_cached.launchedPath
        @duration = 10 * 1000

        v = @path.getPoint(0)
        @ship.position.set(v.x, v.y, v.z)
      when SPACE.Spaceship.IN_LOOP
        # SPACE.LOG('IN_LOOP')
        @_resetTime()
        @path = @_cached.inLoopPath
        @duration = @songDuration

        v = @path.getPoint(0)
        @ship.position.set(v.x, v.y, v.z)
      when SPACE.Spaceship.ARRIVED
        # SPACE.LOG('ARRIVED')
        @path = null
        @parent.remove(@)
      else
        @setState(SPACE.Spaceship.IDLE)

  update: (delta)->
    if @state != SPACE.Spaceship.IDLE and @state != SPACE.Spaceship.ARRIVED

      t = Math.min(@time / @duration, 1)

      if t >= 1
        @_resetTime()
        if @state == SPACE.Spaceship.LAUNCHED
          @setState(SPACE.Spaceship.IN_LOOP)
        else if @state == SPACE.Spaceship.IN_LOOP
          @setState(SPACE.Spaceship.ARRIVED)
        return

      if @state == SPACE.Spaceship.LAUNCHED
        @time += delta
        t = _Easing.QuadraticEaseOut(t)

      @_progress(t)

  _resetTime: ->
    @time = 0

  _progress: (t)->
    v = @path.getPointAt(t)
    @ship.position.set(v.x, v.y, v.z)

    ahead =  Math.min(t + 10 / @path.getLength(), 1)
    v = @path.getPointAt(ahead).multiplyScalar( 1 )
    @ship.lookAt(v)

    if @state == SPACE.Spaceship.IN_LOOP
      @ship.rotation.set(@ship.rotation.x, @ship.rotation.y, 0)

  _computePaths: ->
    fromA     = new THREE.Vector3()
    fromA.x   = @target.x + Math.cos(@angle) * 500
    fromA.y   = @target.y + Math.sin(@angle) * 500
    fromA.z   = 600

    path           = new THREE.IncomingCurve(@target, @angle, @radius)
    path.inverse   = true
    path.useGolden = true

    ## Create path launched
    mid      = path.getPoint(0)
    ref      = path.getPoint(.025)
    angle    = _Math.angleBetweenPoints(mid, ref) + Math.PI
    distance = mid.distanceTo(ref)

    curvePoint   = new THREE.Vector3()
    curvePoint.x = mid.x + Math.cos(angle) * distance
    curvePoint.y = mid.y + Math.sin(angle) * distance
    curvePoint.z = mid.z

    toA    = path.getPoint(0)
    curve  = new THREE.TestCurve(fromA, curvePoint)
    points = curve.getPoints(10)
    points.push(toA)

    curveA = _THREE.HermiteCurve(points)

    ## Create path in the loop
    curveB = _THREE.HermiteCurve(path.getPoints(10))
    return { launchedPath: curveA, inLoopPath: curveB }

  _debugPath: (path, color=0xFF0000)->
    g    = new THREE.TubeGeometry(path, 200, .5, 10, true)
    tube = THREE.SceneUtils.createMultiMaterialObject( g, [
      new THREE.MeshBasicMaterial({
          color: color,
          opacity: 0.3,
          wireframe: true,
          transparent: true
      }),
      new THREE.MeshLambertMaterial({ color: 0xFF88FF, side: THREE.DoubleSide })
    ])
    @add(tube)
