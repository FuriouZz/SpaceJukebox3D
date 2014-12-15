class SPACE.Spaceship extends THREE.Group

  time: 0

  ship: null
  path: null
  duration: 0

  state: null

  angle: 0

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

    @generate()

    # setTimeout(=>
    #   @setState(SPACE.Spaceship.LAUNCHED)
    # , 5000)

  computePosition: (point, angle, length)->
    x = point.x + Math.sin(angle) * length
    y = point.y + Math.cos(angle) * length
    return new THREE.Vector3(x, y, point.z)

  generate: ->
    # Create spaceship geometry
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
      new THREE.MeshBasicMaterial({
          color: 0x000000,
          opacity: 0.3,
          wireframe: true,
          transparent: true
      }),
      new THREE.MeshLambertMaterial({ color: 0x0088ff, side: THREE.DoubleSide })
    ])
    @ship.castShadow = true
    @ship.receiveShadow = true
    @ship.scale.set(.1, .1, .1)
    @add(@ship)

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
        @path = @_generateLaunchedPath()
        @duration = 5 * 1000

        v = @path.getPoint(0)
        @ship.position.set(v.x, v.y, v.z)
      when SPACE.Spaceship.IN_LOOP
        SPACE.LOG('IN_LOOP')
        @path = @_generateInLoopPath()
        @duration = 30 * 1000

        v = @path.getPoint(0)
        @ship.position.set(v.x, v.y, v.z)
      when SPACE.Spaceship.ARRIVED
        SPACE.LOG('ARRIVED')
        @path = null
      else
        @setState(SPACE.Spaceship.IDLE)

  update: (delta)->
    if @state != SPACE.Spaceship.IDLE and @state != SPACE.Spaceship.ARRIVED
      @time += delta
      t = @time / @duration

      if t >= 1
        @time = 0
        if @state == SPACE.Spaceship.LAUNCHED
          @setState(SPACE.Spaceship.IN_LOOP)
        else if @state == SPACE.Spaceship.IN_LOOP
          @setState(SPACE.Spaceship.ARRIVED)
        return

      @_progress(t)

  _progress: (t)->
    v = @path.getPointAt(t)
    @ship.position.set(v.x, v.y, v.z)

    ahead =  ( t + 10 / @path.getLength() ) % 1
    v = @path.getPointAt(ahead).multiplyScalar( 1 )
    @ship.lookAt(v)

    if @state == SPACE.Spaceship.IN_LOOP
      @ship.rotation.set(@ship.rotation.x, @ship.rotation.y, 0)

  _generateLaunchedPath: ->
    inloopPath = @_generateInLoopPath()

    points = []
    points.push(
      new THREE.Vector3(50, -50, 600),
      new THREE.Vector3(125, 125, 125),
      new THREE.Vector3(125, 0, 125),
      inloopPath.getPointAt(0)
    )
    path = _THREE.HermiteCurve(points)
    return path

  _generateInLoopPath: ->
    path = new THREE.IncomingCurve(@target, @angle, 200)
    path.inverse   = true
    path.useGolden = true
    return path
