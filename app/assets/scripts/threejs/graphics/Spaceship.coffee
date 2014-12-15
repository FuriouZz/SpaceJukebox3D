class SPACE.Spaceship extends THREE.Group

  state: null

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

  computePosition: (point, angle, length)->
    x = point.x + Math.sin(angle) * length
    y = point.y + Math.cos(angle) * length
    return new THREE.Vector3(x, y, point.z)

  generate: ->


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

    m = new THREE.MeshLambertMaterial({ color: 0x0088ff, side: THREE.DoubleSide })

    ship = new THREE.Mesh(g, m)
    matrix = new THREE.Matrix4()
    matrix.makeRotationX(Math.PI*.5)
    ship.geometry.applyMatrix(matrix)
    matrix.makeRotationZ(Math.PI)
    ship.geometry.applyMatrix(matrix)
    ship.castShadow = true
    ship.receiveShadow = true
    @add(ship)

    # Follow a spline
    `
    THREE.Curves = {};


     THREE.Curves.GrannyKnot = THREE.Curve.create( function(){},

       function(t) {
          t = 2 * Math.PI * t;

          var x = -0.22 * Math.cos(t) - 1.28 * Math.sin(t) - 0.44 * Math.cos(3 * t) - 0.78 * Math.sin(3 * t);
          var y = -0.1 * Math.cos(2 * t) - 0.27 * Math.sin(2 * t) + 0.38 * Math.cos(4 * t) + 0.46 * Math.sin(4 * t);
          var z = 0.7 * Math.cos(3 * t) - 0.4 * Math.sin(3 * t);
          return new THREE.Vector3(x, y, z).multiplyScalar(20);
      }
    );
    `
    spline = new THREE.Curves.GrannyKnot()
    g = new THREE.TubeGeometry(spline, 200, .25, 10, true)

    # tubeMesh = THREE.SceneUtils.createMultiMaterialObject( g, [
    #   new THREE.MeshLambertMaterial({
    #     color: 0x00FF88
    #   }),
    #   new THREE.MeshBasicMaterial({
    #     color: 0x000000,
    #     opacity: 0.3,
    #     wireframe: true,
    #     transparent: true
    # })])
    # tubeMesh.scale.set( 10, 10, 10 )
    # @add(tubeMesh)

    ship.scale.set(.5, .5, .5)

    ship.update = =>
      time = Date.now()
      looptime = 20 * 1000
      t = ( time % looptime ) / looptime

      pos = g.parameters.path.getPointAt( t )
      pos.multiplyScalar( 10 )
      ship.position.set(pos.x, pos.y, pos.z)
      pos.multiplyScalar( 2 )

      pos = g.parameters.path.getPointAt( ( t + 10 / g.parameters.path.getLength() ) % 1 ).multiplyScalar( 10 )
      ship.lookAt(pos)

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
      when SPACE.Spaceship.LAUNCHED
        SPACE.LOG('LAUNCHED')
      when SPACE.Spaceship.IN_LOOP
        SPACE.LOG('IN_LOOP')
      when SPACE.Spaceship.ARRIVED
        SPACE.LOG('ARRIVED')
      else
        @setState(SPACE.Spaceship.IDLE)

  forward: ->

  backward: ->

  move: ->

  update: ->

  _updateInLoop: ->

  _updateInLaunched: ->
