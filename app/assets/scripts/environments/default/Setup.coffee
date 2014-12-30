class Setup extends THREE.Group

  jukebox: null

  constructor: ->
    super
    @jukebox = SPACE.Jukebox

  onEnter: (callback)->
    callback() if callback
    @setup()

  onExit: (callback)->
    callback() if callback

  update: (delta)->

  setup: ->
    earth = new SPACE.DEFAULT.Earth()
    earth.setup()
    @add(earth)

    # g = new THREE.SphereGeometry()
    # m = new THREE.MeshLambertMaterial({ color: 0xFFAA22 })
    # circle = new THREE.Mesh(g, m)
    # circle.castShadow = true
    # circle.receiveShadow = true
    # @add(circle)

    # circle.update = ->
    #   @rotation.x += .01
    #   @rotation.y -= .01
    #   @rotation.z += .01

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.2 )
    light.position.set( 500, 500, 500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.6 )
    light.position.set( -500, 500, 500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.2 )
    light.position.set( 500, -500, 500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.2 )
    light.position.set( -500, -500, 500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.1 )
    light.position.set( 500, 500, -500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.1 )
    light.position.set( -500, 500, -500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.1 )
    light.position.set( 500, -500, -500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.1 )
    light.position.set( -500, -500, -500 )
    @add( light )

    # light.castShadow = true

    # light.shadowCameraNear    = 700
    # light.shadowCameraFar     = manager._camera.far
    # light.shadowCameraFov     = 50

    # light.shadowCascade = true

    # light.shadowBias          = 0.0001
    # light.shadowDarkness      = 0.5

    # light.shadowCameraRight    =  5
    # light.shadowCameraLeft     = -5
    # light.shadowCameraTop      =  5
    # light.shadowCameraBottom   = -5

    # light.shadowMapWidth      = 2048
    # light.shadowMapHeight     = 2048


    # helper = new THREE.SpotLightHelper(light, 1)
    # @add(helper)

    # speed =
    #   x: Math.random() * 0.005
    #   y: Math.random() * 0.005
    #   z: Math.random() * 0.005

    # @cube.update = ->
    #   @rotation.x += speed.x
    #   @rotation.y += speed.y
    #   @rotation.z += speed.z
