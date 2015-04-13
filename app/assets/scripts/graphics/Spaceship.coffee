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

    @setState(SpaceshipState.IDLE)

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
      new THREE.MeshLambertMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide })
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
      when SpaceshipState.IDLE
        # SPACE.LOG('IDLE')
        @path = null
      when SpaceshipState.LAUNCHED
        # SPACE.LOG('LAUNCHED')
        @_resetTime()
        @path = @_cached.launchedPath
        @duration = 10 * 1000

        v = @path.getPoint(0)
        @ship.position.set(v.x, v.y, v.z)
      when SpaceshipState.IN_LOOP
        # SPACE.LOG('IN_LOOP')
        @_resetTime()
        @path = @testnewloop() #@_cached.inLoopPath
        @duration = 5 * 1000#@songDuration

        v = @path.getPoint(0)
        @ship.position.set(v.x, v.y, v.z)

        # @shipRotationZ = @ship.rotation.z
        # $(@ship.rotation).animate({
        #   z: 0
        # }, {
        #   duration: 500
        #   progress: (object)=>
        #     @shipRotationZ = object.tweens[0].now
        # })
      when SpaceshipState.ARRIVED
        # SPACE.LOG('ARRIVED')
        @path = null
        @parent.remove(@)
      else
        @setState(SpaceshipState.IDLE)

  update: (delta)->
    if @state != SpaceshipState.IDLE and @state != SpaceshipState.ARRIVED

      t = Math.min(@time / @duration, 1)

      if t >= 1
        @_resetTime()
        if @state == SpaceshipState.LAUNCHED
          @setState(SpaceshipState.IN_LOOP)
        else if @state == SpaceshipState.IN_LOOP
          # console.log 'next move?'
          @path = @testnewloop()
          @duration = (5 + (Math.random() * 10)) * 1000
          # @setState(SpaceshipState.ARRIVED)
        return

      if @state == SpaceshipState.LAUNCHED
        @time += delta
        t = _Easing.QuadraticEaseOut(t)

      # TMP
      if @state == SpaceshipState.IN_LOOP
        @time += delta
        # console.log @time

      @_progress(t) if t

  _resetTime: ->
    @time = 0

  _progress: (t)->
    v = @path.getPointAt(t)
    @ship.position.set(v.x, v.y, v.z)

    ahead =  Math.min(t + 10 / @path.getLength(), 1)
    v = @path.getPointAt(ahead).multiplyScalar( 1 )
    @ship.lookAt(v)

    if @state == SpaceshipState.LAUNCHED
      scale = .25 + (1 - t) * .35
      @ship.scale.set(scale, scale, scale)

    # if @state == SpaceshipState.IN_LOOP
    #   @ship.rotation.set(@ship.rotation.x, @ship.rotation.y, @shipRotationZ)

  _computePaths: ->
    fromA     = new THREE.Vector3()
    fromA.x   = @target.x + Math.cos(@angle) * 500
    fromA.y   = @target.y + Math.sin(@angle) * 500
    fromA.z   = 600

    path           = new THREE.InLoopCurve(@target, @angle, @radius)
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
    curve  = new THREE.LaunchedCurve(fromA, toA)
    points = curve.getPoints(10)
    # points.push(toA)

    for pt, i in path.getPoints(10)
      points.push(pt) if i > 0

    curveA = _THREE.HermiteCurve(points)

    ## Create path in the loop
    curveB = path#_THREE.HermiteCurve(path.getPoints(10))

    # @_debugPath(curveA)
    # @_debugPath(curveB)

    # @testnewloop()

    return { launchedPath: curveA, inLoopPath: curveB }

  testnewloop: ->
    THREE.NewLoop = THREE.Curve.create(
      (v0, radius= 100, startAngle=0)->
        @v0         = v0
        @radius     = radius
        @startAngle = startAngle
        @randAngle  = Math.random() * Math.PI * 2
        @direction  = if Math.random() > .5 then true else false
        @test       = Math.random()
        return
      , (t)->
        t      = 1 - t if @direction
        angle  = (Math.PI * 2) * t
        angle  += @startAngle

        vector = new THREE.Vector3()
        vector.x = @v0.x + Math.cos(angle) * @radius
        vector.y = @v0.y + Math.cos(angle + @randAngle) * (@radius * 2 * @test)
        vector.z = @v0.z + Math.sin(angle) * @radius
        return vector

        # t     = 1 - t if @inverse
        # if @useGolden
        #     phi   = (Math.sqrt(5)+1)/2 - 1
        #     golden_angle = phi * Math.PI * 2
        #     angle = @startAngle + (golden_angle * t)
        #     angle += Math.PI * -1.235
        # else
        #     angle = @startAngle + (Math.PI * 2 * t)

        # vector = new THREE.Vector3()
        # vector.x = @v0.x + Math.cos(angle) * (@minRadius + @radius * t)
        # vector.y = @v0.y + Math.sin(angle) * (@minRadius + @radius * t)
        # vector.z = @v0.z
        # return vector
    )

    newloop = new THREE.NewLoop(@target, 150, Math.PI*-.5)
    return newloop
    # @_debugPath(newloop)


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
