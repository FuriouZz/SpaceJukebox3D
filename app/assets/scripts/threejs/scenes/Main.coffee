class SPACE.MainScene extends SPACE.Scene

  equalizer: null
  jukebox:   null

  waveformData: null

  constructor: ->
    super
    
    middlePoint = new THREE.Vector3(0, 0, 0)
    options     =
      minLength: 0
      maxLength: 100
      radius: 250
    @equalizer = new SPACE.Equalizer(middlePoint, options)
    @add(@equalizer)

    @jukebox = new SPACE.Jukebox()
    @jukebox.whileplaying = @_whileplaying
    # @jukebox.predefinedPlaylist()
    
    @spaceship = new SPACE.Spaceship(middlePoint, @equalizer.radius)
    @add(@spaceship)

    # @setupSomething()

    @waveformData = {}

    @_events()

  _events: ->
    document.addEventListener(JUKEBOX.TRACK_ON_ADD.type, @_eTrackOnAdd)

  _eTrackOnAdd: (e)=>
    # spaceship = new SPACE.Spaceship(@equalizer.center, @equalizer.radius)
    # @addChild(spaceship)

    track = e.object.track
    track.spaceship = null#spaceship
    HELPERS.trigger(JUKEBOX.TRACK_ADDED, { track: track })

    # @dotted = new SPACE.DottedLine(track)
    # @addChild(@dotted)

  setupSomething: ->
    # Cube
    g = new THREE.BoxGeometry(100, 100, 100)
    m = new THREE.MeshLambertMaterial({ color: 0x0088ff, shading: THREE.FlatShading })
    @cube = new THREE.Mesh(g, m)
    @cube.rotation.set(Math.random(), Math.random(), Math.random())
    @cube.castShadow = true
    @cube.receiveShadow = true
    @add(@cube)

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

    speed =
      x: Math.random() * 0.005
      y: Math.random() * 0.005
      z: Math.random() * 0.005      

    @cube.update = ->
      @rotation.x += speed.x
      @rotation.y += speed.y
      @rotation.z += speed.z

  update: (delta)->
    super(delta)
    @jukebox.update(delta)

    if @jukebox.state == SPACE.Jukebox.IS_PLAYING
      if @jukebox.current.sound.paused
        @equalizer.mute()
      else if @waveformData.hasOwnProperty('mono')
        @equalizer.setValues(@waveformData.mono)      

  _whileplaying: =>
    sound = @jukebox.current.sound

    datas = Array(256)
    for i in [0..127]
      datas[i]     = Math.max(sound.waveformData.left[i], sound.waveformData.right[i])
      datas[255-i] = Math.max(sound.waveformData.left[i], sound.waveformData.right[i])

    @waveformData.mono   = datas
    @waveformData.stereo = sound.waveformData