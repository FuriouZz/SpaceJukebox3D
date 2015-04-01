class SPACE.DEFAULT.Cover extends THREE.Group

  loadingManager: null
  imageLoader: null

  plane: null

  playlist: null

  texture0: null
  texture1: null

  fov: 0
  aspect: 0
  distance: 0

  constructor: ->
    super
    @_setup()
    @_events()

  _events: ->
    document.addEventListener(EVENT.Track.IS_PLAYING.type, @_eTrackIsPlaying)

  _eTrackIsPlaying: (e)=>
    track    = e.object.track
    title    = track.data.title
    username = track.data.author
    user_url = track.data.author_url

    $('#information h1').html(title)
    $('#information h2').html('by <a href="'+user_url+'">'+username+'</a>')

    css = """
        a { color: """+track.data.color1+""" !important; }
        body { color: """+track.data.color2+""" !important; }
    """
    $('.cover-style').html(css)

    nextTrack = @playlist[0]
    for trackData, i in @playlist
      if trackData.cover == track.data.cover
        nextTrack = @playlist[i+1] if i+1 < @playlist.length
        break

    @textureLoader.load 'resources/covers/'+track.data.cover, (texture)=>
      @texture0 = texture
      @_textureLoaded()
    @textureLoader.load 'resources/covers/'+nextTrack.cover, (texture)=>
      @texture1 = texture
      @_textureLoaded()

    # @setCovers(track.data, nextTrack)

  _setup: ->
    @loadingManager        = new THREE.LoadingManager()
    @loadingManager.onLoad = @_setupPlane
    @imageLoader           = new THREE.ImageLoader(@loadingManager)
    @textureLoader         = new THREE.TextureLoader(@loadingManager)
    @loader                = new THREE.XHRLoader(@loadingManager)

  load: (playlist)->
    @playlist = playlist

    for track in playlist
      @imageLoader.load 'resources/covers/'+track.cover, (image)=>
        return true

    @loader.load 'assets/shaders/cover.frag', (content)=>
      return true
    @loader.load 'assets/shaders/cover.vert', (content)=>
      return true

  _setupPlane: =>
    vertexShader   = @loader.cache.files['assets/shaders/cover.vert']
    fragmentShader = @loader.cache.files['assets/shaders/cover.frag']

    material = new THREE.ShaderMaterial(
      uniforms:
        texture0: { type: 't', value: [] }
        texture1: { type: 't', value: [] }
        resolution: { type: 'v2', value: new THREE.Vector2() }
        aTime: { type: 'f', value: 0 }
        tMove: { type: 'f', value: 0 }
        tScale: { type: 'f', value: 0 }
      vertexShader: vertexShader
      fragmentShader: fragmentShader
    )

    @plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), material)
    @plane.position.z = -1
    @add(@plane)

    HELPER.trigger(EVENT.Cover.TEXTURES_LOADED)

    @plane.material.uniforms.texture0.value  = new THREE.Texture()
    @plane.material.uniforms.texture1.value = new THREE.Texture()

    @loadingManager.onLoad = @_textureLoaded

  _textureLoaded: (a, b, c)=>
    if @texture0 && @texture1
      @setCovers(@texture0, @texture1)
      @texture0 = @texture1 = null

  setCovers: (current, next)->
    @plane.material.uniforms.texture0.value  = current
    @plane.material.uniforms.texture1.value = next

    textureWidth  = current.image.width
    textureHeight = current.image.height

    @fov      = manager.camera.fov / 180 * Math.PI
    @aspect   = textureWidth / textureHeight
    @distance = manager.camera.position.z + 1;
    ratio     = Math.max(1, manager.camera.aspect / @aspect)

    width  = 2 * @aspect * Math.tan(@fov / 2) * @distance * ratio
    height = 2 * Math.tan(@fov / 2) * @distance * ratio

    @plane.material.uniforms.resolution.value.x = width
    @plane.material.uniforms.resolution.value.y = height
    @plane.scale.set(width, height, 1)

  resize: ->
    texture0      = @plane.material.uniforms.texture0
    textureWidth  = texture0.image.width
    textureHeight = texture0.image.height

    ratio  = Math.max(1, manager.camera.aspect / @aspect)

    @plane.scale.set(2 * @aspect * Math.tan(@fov / 2) * @distance * ratio, 2 * Math.tan(@fov / 2) * @distance * ratio, 1)

  tMove: 0
  tScale: 0
  next: ->
    $(this).animate({ tScale: 1 },
      duration: 500
      progress: =>
        @plane.material.uniforms.tScale.value = HELPER.Easing.ExponentialEaseOut(@tScale)
    ).animate({ tMove: 1 },
      duration: 750
      progress: =>
        @plane.material.uniforms.tMove.value = HELPER.Easing.ExponentialEaseOut(@tMove)
    ).animate({ tScale: 0 },
      duration: 500
      progress: =>
        @plane.material.uniforms.tScale.value = HELPER.Easing.ExponentialEaseOut(@tScale)
    )

  update: (delta)->
    if @plane
      @plane.material.uniforms.aTime.value += delta * 0.001
