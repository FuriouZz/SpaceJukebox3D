class SPACE.Spaceship extends THREE.Group

  time: 0

  ship: null
  path: null
  duration: 0

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

    @target = target
    @radius = radius
    @angle  = Math.random() * Math.PI * 2

    @setState(SPACE.Spaceship.IDLE)

    @setup()

    setTimeout(=>
      @setState(SPACE.Spaceship.LAUNCHED)
    , 2000)

  setRadius: (radius)->
    @radius = radius
    @_cached =
      launchedPath: @_computeLaunchedPath()
      inLoopPath:   @_computeInLoopPath()

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

    @ship = THREE.SceneUtils.createMultiMaterialObject( g, [
      # new THREE.MeshBasicMaterial({
      #     color: 0x000000,
      #     opacity: 0.3,
      #     wireframe: true,
      #     transparent: true
      # }),
      new THREE.MeshLambertMaterial({ color: 0x0088ff, side: THREE.DoubleSide })
    ])
    @ship.castShadow = true
    @ship.receiveShadow = true
    @ship.scale.set(.15, .15, .15)
    @add(@ship)

    @_cached = @_computePaths()
    v = @_cached.launchedPath.getPointAt(0)
    @ship.position.set(v.x, v.y, v.z)


    # # Follow a spline
    # points = []
    # points.push(
    #   new THREE.Vector3(50, -50, 600),
    #   new THREE.Vector3(125, 125, 125),
    #   new THREE.Vector3(125, 0, 125),
    #   new THREE.Vector3(0, 0, 0)
    # )

    # pts       = []
    # start     = (Math.PI * 2) * Math.random()
    # radius    = 200
    # minrad    = 0
    # precision = 100
    # for i in [0..(precision-1)]
    #   t     = 1 - (i / (precision-1))
    #   angle = t * Math.PI * 2
    #   x = @target.x + Math.cos(angle) * (minrad + radius * t)
    #   y = @target.y + Math.sin(angle) * (minrad + radius * t)
    #   pts.push(new THREE.Vector3(x, y, 0))

    # curves = new THREE.CurvePath()
    # for i in [0..(pts.length-1)] by 2
    #   curves.add(new THREE.LineCurve3(pts[i], pts[i+1]))

    # ## Create Incoming Curve
    # incoming = new THREE.IncomingCurve(@target, 0, 200)
    # incoming.inverse   = true
    # incoming.useGolden = true
    # incomingLength = incoming.getLength()

    # ## Create Launched Curve
    # points[points.length-1] = incoming.getPointAt(0)
    # launched = _THREE.HermiteCurve(points)

    # glaunched = new THREE.TubeGeometry(launched, 200, .5, 10, true)
    # tube   = THREE.SceneUtils.createMultiMaterialObject( glaunched, [
    #   new THREE.MeshBasicMaterial({
    #       color: 0x000000,
    #       opacity: 0.3,
    #       wireframe: true,
    #       transparent: true
    #   }),
    #   new THREE.MeshLambertMaterial({ color: 0xFF88FF, side: THREE.DoubleSide })
    # ])
    # @add(tube)

    # gincoming = new THREE.TubeGeometry(incoming, 200, .5, 10, true)
    # tube   = THREE.SceneUtils.createMultiMaterialObject( gincoming, [
    #   new THREE.MeshBasicMaterial({
    #       color: 0x000000,
    #       opacity: 0.3,
    #       wireframe: true,
    #       transparent: true
    #   }),
    #   new THREE.MeshLambertMaterial({ color: 0xFF88FF, side: THREE.DoubleSide })
    # ])
    # @add(tube)

    # circ = new THREE.Mesh(new THREE.CircleGeometry(10, 100), new THREE.MeshLambertMaterial({ color: 0xFF0000, side: THREE.DoubleSide }))
    # circ.position.set(125, 125, 125)
    # @add(circ)

    # circ = new THREE.Mesh(new THREE.CircleGeometry(10, 100), new THREE.MeshLambertMaterial({ color: 0xFF0000, side: THREE.DoubleSide }))
    # circ.position.set(125, 0, 125)
    # @add(circ)

    # circ = new THREE.Mesh(new THREE.CircleGeometry(10, 100), new THREE.MeshLambertMaterial({ color: 0xFF0000, side: THREE.DoubleSide }))
    # circ.position.set(0, 0, 0)
    # @add(circ)



    # time      = 0

    # Launched State
    # looptime  = 5 * 1000
    # isLaunched = true
    # pos = launched.getPointAt(0)
    # ship.position.set(pos.x, pos.y, pos.z)
    # path      = launched

    # ship.update = (delta)=>
    #   time += delta
    #   t = time / looptime#( time % looptime ) / looptime
    #   # console.log t

    #   if t >= 1
    #     time = 0
    #     t = 0
    #     isLaunched = !isLaunched
    #     if isLaunched
    #       console.log 'isLaunched'
    #       looptime = 5 * 1000
    #       path     = launched
    #     else
    #       console.log 'isNotLaunched'
    #       looptime = 30 * 1000
    #       path     = incoming

    #   pos = path.getPointAt( t )
    #   pos.multiplyScalar( 1 )
    #   ship.position.set(pos.x, pos.y, pos.z)
    #   pos.multiplyScalar( 1 )

    #   pos = path.getPointAt( ( t + 10 / path.getLength() ) % 1 ).multiplyScalar( 1 )
    #   ship.lookAt(pos)

    # ## Turn around 3D (~need improvement)
    # @position.set(250, 0, 0)

    # point = @target
    # orbit = @position
    # distance = orbit.distanceTo(point)

    # time = 0
    # ship.update = (delta)=>
    #   time += delta
    #   @position.x = distance * Math.cos(time * .001)
    #   @position.z = distance * Math.sin(time * .001)
    #   @position.y = distance * Math.cos(time * .001)

    # ## Turn around (~need improvement)
    # # ship.rotation.set(Math.PI*.5, Math.PI, Math.PI*.5)
    # @position.set(250, 0, 250)

    # point = new THREE.Vector2(@target.x, @target.z)
    # orbit = new THREE.Vector2(@position.x, @position.z)
    # distance = orbit.distanceTo(point)

    # time = 0
    # ship.update = (delta)=>
    #   time += delta
    #   angle = time * .001
    #   p   = new THREE.Vector3(0, 0, 0)
    #   p.x = distance * Math.cos(angle)
    #   p.y = distance * Math.sin(angle)
    #   p.z = @position.z

    #   @position.set(p.x, 0, p.y)
    #   @lookAt(@target)

    ## Move to a direction

    # speed =
    #   x: Math.random() * 0.05
    #   y: 0.01
    #   z: Math.random() * 0.05

    # @position.set(250, -100, 250)

    # ray = new THREE.Ray(@target.clone(), @position.clone())
    # time     = 0

    # ship.update = (delta)=>
    #   # ship.rotation.y + = speed.y
    #   time += delta
    #   t = time / (5*1000)
    #   td = 1 - t
    #   return if t >= 1

    #   p = ray.at(td)
    #   @position.set(p.x, p.y, p.z)

  setState: (state)->
    @state = state
    switch state
      when SPACE.Spaceship.IDLE
        SPACE.LOG('IDLE')
        @path = null
      when SPACE.Spaceship.LAUNCHED
        SPACE.LOG('LAUNCHED')
        @_resetTime()
        @path = @_cached.launchedPath || @_computeLaunchedPath()
        @duration = 10 * 1000

        v = @path.getPoint(0)
        @ship.position.set(v.x, v.y, v.z)
      when SPACE.Spaceship.IN_LOOP
        SPACE.LOG('IN_LOOP')
        @_resetTime()
        @path = @_cached.inLoopPath || @_computeInLoopPath()
        @duration = 30 * 1000

        v = @path.getPoint(0)
        @ship.position.set(v.x, v.y, v.z)
      when SPACE.Spaceship.ARRIVED
        SPACE.LOG('ARRIVED')
        @path = null
        setTimeout(=>
          @setState(SPACE.Spaceship.LAUNCHED)
        , 5000)
      else
        @setState(SPACE.Spaceship.IDLE)

  update: (delta)->
    if @state != SPACE.Spaceship.IDLE and @state != SPACE.Spaceship.ARRIVED
      @time += delta
      t = Math.min(@time / @duration, 1)

      if t >= 1
        @_resetTime()
        if @state == SPACE.Spaceship.LAUNCHED
          @setState(SPACE.Spaceship.IN_LOOP)
        else if @state == SPACE.Spaceship.IN_LOOP
          @setState(SPACE.Spaceship.ARRIVED)
        return

      if @state == SPACE.Spaceship.LAUNCHED
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

  # _computeLaunchedPath: ->
  #   inLoopPath = @_computeInLoopPath()
  #
  #   a     = new THREE.Vector3()
  #   a.x   = @target.x + Math.cos(@angle) * 500
  #   a.y   = @target.y + Math.sin(@angle) * 500
  #   a.z   = 600
  #   b     = inLoopPath.getPointAt(0).add(new THREE.Vector3(50, 50, 50))
  #   curve = new THREE.TestCurve(a, b)
  #
  #   pts = []
  #   for p in curve.getPoints(10)
  #     pts.push(p)
  #   pts.push(inLoopPath.getPoint(0))
  #   path = _THREE.HermiteCurve(pts)
  #   return path
  #
  # _computeInLoopPath: ->
  #   path                = new THREE.IncomingCurve(@target, @angle, @radius)
  #   path.inverse        = true
  #   path.useGolden      = true
  #   curve               = _THREE.HermiteCurve(path.getPoints(10))
  #   @inLoopLength       = curve.getLength()
  #   return curve

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
