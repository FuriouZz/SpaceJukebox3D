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
      radius: 200
      absolute: false
      lineForceDown: .5
      lineForceUp: .5

    @equalizer = new SPACE.Equalizer(middlePoint, options)
    @add(@equalizer)

    @jukebox = new SPACE.Jukebox()
    @jukebox.whileplaying = @_whileplaying
    @jukebox.predefinedPlaylist()

    @spaceship = new SPACE.Spaceship(middlePoint, @equalizer.radius)
    @add(@spaceship)

    @setupSomething()

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
    # @cube.position.setZ(100)
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

  time: 0
  update: (delta)->
    super(delta)
    @jukebox.update(delta)

    @time += delta

    if @jukebox.state == SPACE.Jukebox.IS_PLAYING
      if @jukebox.current and @jukebox.current.sound.paused
        @equalizer.mute()
      else if @waveformData.hasOwnProperty('mono')
        @equalizer.setValues(@waveformData.mono)

      # if !@jukebox.current.sound.isPlaying()
      #   @equalizer.mute()
      # else
      #   tmp = []
      #   for v, i in @jukebox.current.sound.getWaveform()
      #     tmp.push(v) if i%8 == 0

      #   values = Array(tmp.length)
      #   for i in [0..((tmp.length*.5)-1)]
      #     values[i] = values[tmp.length-1-i] = tmp[i]

      #   @equalizer.setValues(values)

  _whileplaying: =>
    sound = @jukebox.current.sound

    datas = Array(256)
    for i in [0..127]
      value = Math.max(sound.waveformData.left[i], sound.waveformData.right[i])
      datas[i] = datas[255-i] = value * Math.max(sound.peakData.left, sound.peakData.left)

    @waveformData.mono   = datas
    @waveformData.stereo = sound.waveformData
