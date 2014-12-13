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
    ship.rotation.set(Math.PI*.5, Math.PI, Math.PI*.5)
    ship.castShadow = true
    ship.receiveShadow = true
    @add(ship)

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

    ## Turn around
    @position.set(250, 0, 250)

    point = new THREE.Vector2(@target.x, @target.z)
    orbit = new THREE.Vector2(@position.x, @position.z)
    distance = orbit.distanceTo(point)

    time = 0
    ship.update = (delta)=>
      time += delta
      angle = time * .001
      p   = new THREE.Vector3(0, 0, 0)
      p.x = distance * Math.cos(angle)
      p.y = distance * Math.sin(angle)
      p.z = @position.z

      @position.set(p.x, 0, p.y)
      @lookAt(@target)

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
