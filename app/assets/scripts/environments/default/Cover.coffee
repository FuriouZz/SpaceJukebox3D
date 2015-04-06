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

  tFade: 1
  tScale: 1

  constructor: ->
    super
    @_setup()
    @_events()

  _events: ->
    document.addEventListener(EVENT.Track.IS_PLAYING.type, @_eTrackIsPlaying)
    document.addEventListener(EVENT.Track.IS_PAUSED.type, @_eTrackIsPaused)
    document.addEventListener(EVENT.Track.IS_LOADED.type, @_eTrackIsLoaded)
    document.addEventListener(EVENT.Jukebox.WILL_PLAY.type, @_eJukeboxWillPlay)

    $('#loading, #information span').on 'click', (e)->
      if $('#loading').hasClass('ready') and window.WebAudioAPI
        e.preventDefault()
        window.WebAudioAPI.play()
        return false

  _eJukeboxWillPlay: (e)=>
    @next()
    $('#information h1').addClass('hidden')
    $('#information h2').addClass('hidden')

  _eTransitionEnded: (e)=>
    HELPER.trigger(EVENT.Cover.TRANSITION_ENDED)

  _eTrackIsPlaying: (e)=>
    $('#information h1').removeClass('hidden')
    $('#information h2').removeClass('hidden')
    $('#loading').addClass('hidden')

  _eTrackIsPaused: (e)=>
    $('#loading').removeClass('hidden')
    $('#loading i.icn').removeClass('play')
    $('#loading i.icn').addClass('pause')

  _eTrackIsLoaded: (e)=>
    unless $('#loading').hasClass('ready')
      $('#loading').addClass('ready')
      $('#loading p').html('Tap in the middle<br>to play or pause')

    track    = e.object.track
    title    = track.data.title
    username = track.data.author
    user_url = track.data.author_url

    $('#information h1').html(title)
    $('#information h2').html('by <a target="_blank" href="'+user_url+'">'+username+'</a>')

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

    $('.blurried li div').css({ height: window.innerHeight })
    $('.blurried li div').last().css('background-image', 'url(resources/covers/'+track.data.cover+')')
    $('.blurried li div').first().css('background-image', 'url(resources/covers/'+nextTrack.cover+')')

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
    @loader.load 'assets/shaders/gaussian_blur.frag', (content)=>
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
        tFade: { type: 'f', value: 0 }
        tScale: { type: 'f', value: 1 }
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
    @tFade  = 1
    @tScale = 1
    @plane.material.uniforms.tScale.value = @tScale
    @plane.material.uniforms.tFade.value  = @tFade

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
    texture0      = @plane.material.uniforms.texture0.value
    textureWidth  = texture0.image.width
    textureHeight = texture0.image.height

    ratio  = Math.max(1, manager.camera.aspect / @aspect)

    @plane.scale.set(2 * @aspect * Math.tan(@fov / 2) * @distance * ratio, 2 * Math.tan(@fov / 2) * @distance * ratio, 1)

  next: ->
    $(@plane.material.uniforms.tScale).animate({ value: 0.9 }, 350)
    $(@plane.material.uniforms.tFade).animate({ value: 0.0 }, 350)
    setTimeout(@_eTransitionEnded, 350)

  update: (delta)->
    if @plane
      @plane.material.uniforms.aTime.value += delta * 0.001
