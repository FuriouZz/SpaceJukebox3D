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

  generate: ->
    p1 = new THREE.Vector3(-3, 0, 0)
    p2 = new THREE.Vector3(3, 0, 0)
    p3 = new THREE.Vector3(0, 8, 0)

    g = new THREE.Geometry()
    g.vertices.push(p1, p2, p3, p1)
    g.faces.push( new THREE.Face3(0, 1, 2) )

    m = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, shading: THREE.FlatShading })

    ship = new THREE.Mesh(g, m)
    @add(ship)

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