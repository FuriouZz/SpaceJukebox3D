class SPACE.Cover extends THREE.Group

  _imagesLoaded: null

  loadingManager: null

  plane: null

  imageData0: null
  imageData1: null

  tMove: 1
  tScale: 1

  constructor: ->
    super

  _events: ->
    document.addEventListener(SPACE.CoverController.NEXT, @_eNext)

  _eNext: =>
    @_transition()

  # _events: ->
  #   document.addEventListener(Track.IS_WAITING, @_eTrackIsWaiting)
  #   document.addEventListener(Track.WILL_PLAY, @_eTrackWillPlay)
  #   document.addEventListener(Jukebox.IS_QUEUING, @_eJukeboxIsQueuing)

  #   $('#loading, #information span').on 'click', (e)->
  #     if $('#loading').hasClass('ready') and window.WebAudioAPI
  #       e.preventDefault()
  #       window.WebAudioAPI.play()
  #       return false

  # _eTrackIsWaiting: (e)=>
  #   track = e.object.track

  #   for t, i in @playlist
  #     if t.url == track.data.url
  #       nextTrack = null
  #       if i+1 < @playlist.length
  #         nextTrack = @playlist[i+1]
        
  #       track.mergeData({
  #         title:       t.title
  #         cover_url:   t.cover_url
  #         author_name: t.author_name
  #         author_url:  t.author_url
  #         color1:      t.color1
  #         color2:      t.color2
  #         nextTrack:   nextTrack
  #       })
      
  #       break;

  # current: null

  # _eJukeboxIsQueuing: (e)=>
  #   c = e.object.jukebox.current

  #   isSame = false
  #   if c and c.data.playlist and @current and @current.data.playlist
  #     isSame = c.data.playlist.permalink == @current.data.playlist.permalink
  #   @current = e.object.jukebox.current

  #   return if isSame
  #   @_transition()
  #   $('#information h1').addClass('hidden')
  #   $('#information h2').addClass('hidden')

  # # _eTransitionEnded: (e)=>
  # #   HELPER.trigger(EVENT.Cover.TRANSITION_ENDED)

  # # _eTrackIsPlaying: (e)=>
  # #   $('#information h1').removeClass('hidden')
  # #   $('#information h2').removeClass('hidden')
  # #   $('#loading').addClass('hidden')

  # # _eTrackIsPaused: (e)=>
  # #   $('#loading').removeClass('hidden')
  # #   $('#loading i.icn').removeClass('play')
  # #   $('#loading i.icn').addClass('pause')

  # _eTrackWillPlay: (e)=>
  #   unless $('#loading').hasClass('ready')
  #     $('#loading').addClass('ready')
  #     $('#loading p').html('Tap in the middle<br>to play or pause')

  #   current = e.object.track.data
  #   next    = current.nextTrack

  #   title    = current.title
  #   username = current.author_name
  #   user_url = current.author_url
  #   color1   = current.color1
  #   color2   = current.color2

  #   $('#information h1').html(title)
  #   $('#information h2').html('by <a target="_blank" href="'+user_url+'">'+username+'</a>')

  #   css = """
  #       a { color: """+color1+""" !important; }
  #       body { color: """+color2+""" !important; }
  #   """
  #   $('.cover-style').html(css)

  #   return unless next

  #   image        = @imageLoader.cache.files[current.cover_url]
  #   image.onload = => 
  #     @texture0.image = image
  #     @texture0.repeat = 10
  #     @_textureLoaded()

  #   image        = @imageLoader.cache.files[next.cover_url]
  #   image.onload = => 
  #     @texture1.image = image
  #     @texture1.repeat = 10
  #     @_textureLoaded()

  setup: ->
    # Setup loaders
    @loadingManager        = new THREE.LoadingManager()
    @loadingManager.onLoad = @_setupPlane
    @textureLoader         = new THREE.TextureLoader()
    @loader                = new THREE.XHRLoader(@loadingManager)
    
    # Initialize events and load shaders
    @_events()
    @_loadShaders()

  _loadShaders: =>
    @loader.load('assets/shaders/cover.frag')
    @loader.load('assets/shaders/cover.vert')

  _setupPlane: =>
    # Create Material shaders
    vertexShader   = @loader.cache.files['assets/shaders/cover.vert']
    fragmentShader = @loader.cache.files['assets/shaders/cover.frag']

    material = new THREE.ShaderMaterial(
      uniforms: 
        texture0:   { type: 't', value: new THREE.Texture() }
        texture1:   { type: 't', value: new THREE.Texture() }
        blurried0:  { type: 't', value: new THREE.Texture() }
        blurried1:  { type: 't', value: new THREE.Texture() }
        tMove:      { type: 'f', value: 0 }
        tScale:     { type: 'f', value: 1 }
      attributes: 
        T0Coords:   { type: 'v2', value: [] }
        T1Coords:   { type: 'v2', value: [] }
      vertexShader: vertexShader
      fragmentShader: fragmentShader
    )

    array0 = material.attributes.T0Coords.value
    array1 = material.attributes.T1Coords.value
    for i in [0..3]
      array0[i] = new THREE.Vector2()
      array1[i] = new THREE.Vector2()

    @plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
    @plane.position.z = -1
    @add(@plane)

    # Remove onLoad callback and compute plane size
    @loadingManager.onLoad = null
    @_computePlaneSize()

  setCovers: (imageData0, imageData1)->
    # Create textures from image datas
    @texture0 = new THREE.ImageUtils.loadTexture(imageData0.src)
    @texture0.minFilter = THREE.NearestFilter
    @texture0.anisotropy = 1
    @plane.material.uniforms.texture0.value = @texture0

    @texture1 = new THREE.ImageUtils.loadTexture(imageData1.src)
    @texture1.minFilter = THREE.NearestFilter
    @texture1.anisotropy = 1
    @plane.material.uniforms.texture1.value = @texture1

    # Update textures image and coordinates with image data
    @updateCovers(imageData0, imageData1)

  updateCovers: (imageData0, imageData1)->
    @imageData0 = imageData0
    @imageData1 = imageData1

    texture0 = @plane.material.uniforms.texture0.value
    texture1 = @plane.material.uniforms.texture1.value

    # Compute image0 coordinates and set to both textures
    coords0 = @_computeCoordinatesFromData(imageData0)
    @_setCoordinatesToTexture(coords0, @plane.material.attributes.T0Coords)
    @_setCoordinatesToTexture(coords0, @plane.material.attributes.T1Coords)

    # I don't know exactly why but texture0.image is null at startup
    if texture0.image and texture1.image
      texture0.image.src = imageData0.src
      texture1.image.src = imageData0.src
    else
      texture0.image = imageData0.image
      texture1.image = imageData0.image

    # Use this fix to reset the transition positions and texture1 image
    setTimeout(=>
      coords1 = @_computeCoordinatesFromData(imageData1)
      @_setCoordinatesToTexture(coords1, @plane.material.attributes.T1Coords)

      texture1.image.src = imageData1.src
      @_resetTransition()
      @_renderBlur()
    , 100) 

  resize: ->
    @_computePlaneSize()
    @updateCovers(@imageData0, @imageData1)

  # Compute the plane size to fill the entire screen
  _computePlaneSize: ->
    manager  = SPACE.SceneManager
    fov      = manager.camera.fov / 180 * Math.PI
    distance = manager.camera.position.z + 1;

    width  = 2 * manager.camera.aspect * Math.tan(fov / 2) * distance
    height = 2 * Math.tan(fov / 2) * distance

    @plane.scale.set(width, height, 1)

  # Compute texture coordinates from image data
  # The texture must fill the entire plane/screen
  _computeCoordinatesFromData: (imageData)->
    manager  = SPACE.SceneManager
    fov      = manager.camera.fov / 180 * Math.PI
    aspect   = imageData.width / imageData.height
    distance = manager.camera.position.z + 1;
    ratio    = Math.max(1, manager.camera.aspect / aspect)

    width  = 2 * aspect * Math.tan(fov / 2) * distance * ratio
    height = 2 * Math.tan(fov / 2) * distance * ratio

    wSize = @plane.scale.x
    hSize = @plane.scale.y

    diff = new THREE.Vector2((1.0 - (wSize / width)) * 0.5, (1.0 - (hSize / height)) * 0.5)

    # v0 = new THREE.Vector2(0.0 + diff.x, 0.0 + diff.y)
    # v1 = new THREE.Vector2(0.0 + diff.x, 1.0 - diff.y)
    # v2 = new THREE.Vector2(1.0 - diff.x, 1.0 - diff.y)
    # v3 = new THREE.Vector2(1.0 - diff.x, 0.0 + diff.y)

    coords      = []
    coords[0] = new THREE.Vector2(0.0 + diff.x, 1.0 - diff.y)
    coords[1] = new THREE.Vector2(1.0 - diff.x, 1.0 - diff.y)    
    coords[2] = new THREE.Vector2(0.0 + diff.x, 0.0 + diff.y)    
    coords[3] = new THREE.Vector2(1.0 - diff.x, 0.0 + diff.y)

    return coords

  # Set coordinates value to the shader 
  _setCoordinatesToTexture: (coordinates, texturesCoords)->
    for i in [0..(texturesCoords.value.length-1)]
      texturesCoords.value[i].x = coordinates[i].x
      texturesCoords.value[i].y = coordinates[i].y
    texturesCoords.needsUpdate = true    

  # Make cover transition
  _transition: ->
    @_resetTransition()
    $(this).animate({ tScale: 0.6 },
      duration: 500
      easing: 'easeOutExpo'
      progress: ->
        value = @tScale
        @plane.material.uniforms.tScale.value = value
    ).animate({ tMove: 1 },
      duration: 750
      easing: 'easeOutExpo'
      progress: ->
        value = @tMove
        @plane.material.uniforms.tMove.value  = value
    ).animate({ tScale: 1 },
      duration: 500
      easing: 'easeOutExpo'
      progress: ->
        value = @tScale
        @plane.material.uniforms.tScale.value = value
    )

  # Reset transition values
  _resetTransition: ->
    @tScale                               = 1.0
    @tMove                                = 0.0
    @plane.material.uniforms.tScale.value = 1.0
    @plane.material.uniforms.tMove.value  = 0.0












  cameraRTT: null
  sceneRTT:  null
  rt1:        null
  rt2:        null

  composer:   null
  hBlur:      null
  vBlur:      null
  renderPass: null
  effectCopy: null

  # Create the blurried texture thanks to Render-To-Texture method
  _renderBlur: ->
    t0 = @plane.material.uniforms.texture0.value
    t1 = @plane.material.uniforms.texture1.value

    # RENDER TO TEXTURE
    @_prepareRTT()

    @plane.material.uniforms.blurried0.value = @rt0
    @plane.material.uniforms.blurried1.value = @rt1

    @_renderToTexture(t0.image.src, @rt0)
    @_renderToTexture(t1.image.src, @rt1)

  _prepareRTT: =>
    t0     = @plane.material.uniforms.texture0.value
    width  = @plane.scale.x
    height = @plane.scale.y

    @cameraRTT = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    @cameraRTT.position.setZ(600)

    @sceneRTT = new THREE.Scene()

    options = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat }
    @rt0    = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, options)
    @rt1    = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, options)

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

      @composer = new THREE.EffectComposer(manager.renderer, target)
      @composer.addPass(@renderPass)
      @composer.addPass(@hBlur)
      @composer.addPass(@vBlur)
      @composer.addPass(@effectCopy)
      @composer.render(0.01)
