class SPACE.Cover extends THREE.Group

  @TEXTURES_LOADED: 'cover_textures_loaded'

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
    document.addEventListener(SPACE.Track.IS_PLAYING.type, @_eTrackIsPlaying)
    document.addEventListener(SPACE.Track.IS_PAUSED.type, @_eTrackIsPaused)
    # document.addEventListener(SPACE.Track.IS_LOADED.type, @_eTrackIsLoaded)
    document.addEventListener(SPACE.Track.WILL_PLAY.type, @_eJukeboxWillPlay)

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
        texture0: { type: 't', value: new THREE.Texture() }
        texture1: { type: 't', value: new THREE.Texture() }
        texture2: { type: 't', value: new THREE.Texture() }
        texture3: { type: 't', value: new THREE.Texture() }
        resolution: { type: 'v2', value: new THREE.Vector2() }
        aTime: { type: 'f', value: 0 }
        tFade: { type: 'f', value: 0 }
        tScale: { type: 'f', value: 1 }
        ratio: { type: 'v2', value: new THREE.Vector2() }
      attributes: 
        T1Coords: { type: 'v2', value: [] }
      vertexShader: vertexShader
      fragmentShader: fragmentShader
    )

    @plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
    @plane.position.z = -1
    @add(@plane)

    HELPER.trigger(SPACE.Cover.TEXTURES_LOADED)

    @loadingManager.onLoad = @_textureLoaded

    @textureLoader.load 'resources/covers/'+@playlist[0].cover, (texture)=>
      @texture0 = texture
    @textureLoader.load 'resources/covers/'+@playlist[1].cover, (texture)=>
      @texture1 = texture

  _textureLoaded: (a, b, c)=>
    if @texture0 && @texture1
      @setCovers(@texture0, @texture1)
      @texture0 = @texture1 = null

  setCovers: (current, next)->
    @tFade  = 1
    @tScale = 0.75
    @plane.material.uniforms.tScale.value = @tScale
    @plane.material.uniforms.tFade.value  = @tFade

    @plane.material.uniforms.texture0.value = current
    @plane.material.uniforms.texture1.value = next
    
    @_setSizeFromTextures(current, next)
    @_otherCompute(current, next)

  resize: ->
    t0 = @plane.material.uniforms.texture0.value
    t1 = @plane.material.uniforms.texture1.value
    @_setSizeFromTextures(t0, t1)

  _setSizeFromTextures: (texture0, texture1)->

    # Plane fill all the screen
    texture0Width  = texture0.image.width
    texture0Height = texture0.image.height

    manager  = SPACE.SceneManager
    fov      = manager.camera.fov / 180 * Math.PI
    aspect   = texture0Width / texture0Height
    distance = manager.camera.position.z + 1;
    ratio    = Math.max(1, manager.camera.aspect / aspect)

    width  = 2 * aspect * Math.tan(fov / 2) * distance * ratio
    height = 2 * Math.tan(fov / 2) * distance * ratio

    @plane.material.uniforms.resolution.value.x = width
    @plane.material.uniforms.resolution.value.y = height
    @plane.scale.set(width, height, 1)

  _otherCompute: (texture0, texture1)->
    # Set texture1 coordinates
    texture0Width  = texture0.image.width
    texture0Height = texture0.image.height
    texture1Width  = texture1.image.width
    texture1Height = texture1.image.height

    texture1Height = (texture1Height * texture0Width) / texture1Width
    texture1Width  = texture0Width

    ratio = (1.0 - (texture1Height / texture0Height)) * 0.5

    v0 = new THREE.Vector2(0, 0.0 - ratio)
    v1 = new THREE.Vector2(0, 1.0 + ratio)
    v2 = new THREE.Vector2(1.0, 1.0 + ratio)
    v3 = new THREE.Vector2(1.0, 0.0 - ratio)

    coords                                          = @plane.material.attributes.T1Coords.value
    coords[0]                                       = v1
    coords[1]                                       = v2
    coords[2]                                       = v0
    coords[3]                                       = v3
    @plane.material.attributes.T1Coords.value       = coords
    @plane.material.attributes.T1Coords.needsUpdate = true

    # RENDER TO TEXTURE
    @_prepareRTT()

    @plane.material.uniforms.texture2.value = @rt0
    @plane.material.uniforms.texture3.value = @rt1

    @_renderToTexture(texture0.image.src, @rt0)
    @_renderToTexture(texture1.image.src, @rt1)

  next: ->
    $(@plane.material.uniforms.tScale).animate({ value: 0.9 }, 350)
    $(@plane.material.uniforms.tFade).animate({ value: 0.0 }, 350)
    setTimeout(@_eTransitionEnded, 350)

  update: (delta)->
    if @plane
      @plane.material.uniforms.aTime.value += delta * 0.001












  cameraRTT: null
  sceneRTT:  null
  rt1:        null
  rt2:        null

  composer:   null
  hBlur:      null
  vBlur:      null
  renderPass: null
  effectCopy: null

  _prepareRTT: =>
    t0     = @plane.material.uniforms.texture0.value
    width  = @plane.material.uniforms.resolution.value.x
    height = @plane.material.uniforms.resolution.value.y

    @cameraRTT = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    @cameraRTT.position.setZ(600)

    @sceneRTT = new THREE.Scene()

    @rt0  = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat })
    @rt1  = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat })

    @hBlur                  = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    @hBlur.enabled          = true;
    @hBlur.uniforms.h.value = 1 / window.innerWidth;

    @vBlur                  = new THREE.ShaderPass(THREE.VerticalBlurShader);
    @vBlur.enabled          = true;
    @vBlur.uniforms.v.value = 1 / window.innerHeight;

    @renderPass = new THREE.RenderPass(@sceneRTT, @cameraRTT)

    @effectCopy = new THREE.ShaderPass(THREE.CopyShader)

    material = new THREE.MeshBasicMaterial()

    @planeRTT            = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.0, 1.0), material)
    @planeRTT.position.z = -1
    @planeRTT.scale.set(@plane.scale.x, @plane.scale.y, 1.0)
    @sceneRTT.add(@planeRTT)

  _renderToTexture: (textureUrl, target)->
    @textureLoader.load textureUrl, (texture)=>
      @planeRTT.material.map = texture
      manager                = SPACE.SceneManager

      delete @composer

      @composer   = new THREE.EffectComposer(manager.renderer, target)
      @composer.addPass(@renderPass)
      @composer.addPass(@hBlur)
      @composer.addPass(@vBlur)
      @composer.addPass(@effectCopy)
      @composer.render(0.01)
