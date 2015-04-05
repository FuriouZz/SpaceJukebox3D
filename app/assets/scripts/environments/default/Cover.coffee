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
    document.addEventListener(EVENT.Jukebox.WILL_PLAY.type, @_eJukeboxWillPlay)

  _eJukeboxWillPlay: (e)=>
    @next()

  _eTransitionEnded: (e)=>
    HELPER.trigger(EVENT.Cover.TRANSITION_ENDED)

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

    $('.blurried li div').css({ height: window.innerHeight })
    $('.blurried li div').last().css('background-image', 'url(resources/covers/'+track.data.cover+')')
    $('.blurried li div').first().css('background-image', 'url(resources/covers/'+nextTrack.cover+')')
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

  #   @test(current)

  # test: (current)->
  #   imageWidth  = current.image.width
  #   imageHeight = current.image.height

  #   # Initialize renderer
  #   unless @cameraRTT and @sceneRTT and @rtTexture# and @cameraRTT1 and @sceneRTT1 and @rtTexture1
  #     @cameraRTT = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  #     # @cameraRTT = new THREE.OrthographicCamera( imageWidth / - 2, imageWidth / 2, imageHeight / 2, imageHeight / - 2, -10000, 10000 )
  #     @cameraRTT.position.setZ(600)
  #     # @cameraRTT1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  #     # @cameraRTT1 = new THREE.OrthographicCamera( imageWidth / - 2, imageWidth / 2, imageHeight / 2, imageHeight / - 2, -10000, 10000 )
  #     # @cameraRTT1.position.setZ(600)

  #     @sceneRTT = new THREE.Scene()
  #     # @sceneRTT1 = new THREE.Scene()

  #     @rtTexture  = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat })
  #     # @rtTexture1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat })


  #     @hBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
  #     @hBlur.enabled = true;
  #     @hBlur.uniforms.h.value = 1 / window.innerHeight;

  #     @vBlur = new THREE.ShaderPass(THREE.VerticalBlurShader);
  #     @vBlur.enabled = true;
  #     @vBlur.uniforms.v.value = 1 / window.innerWidth;

  #     @renderPass = new THREE.RenderPass(@sceneRTT, @cameraRTT)

  #     @effectCopy = new THREE.ShaderPass(THREE.CopyShader)

  #     @composer   = new THREE.EffectComposer(manager.renderer)
  #     @composer.addPass(@renderPass)
  #     @composer.addPass(@hBlur)
  #     @composer.addPass(@vBlur)
  #     @composer.addPass(@effectCopy)

  #     console.log @composer

  #   vertexShader   = @loader.cache.files['assets/shaders/cover.vert']
  #   fragmentShader = @loader.cache.files['assets/shaders/gaussian_blur.frag']

  #   material = new THREE.ShaderMaterial(
  #     uniforms:
  #       u_radius: { type: 'f', value: 10.0 }
  #       u_texture0: { type: 't', value: [] }
  #       u_direction: { type: 'v2', value: new THREE.Vector2() }
  #       u_resolution: { type: 'v2', value: new THREE.Vector2() }
  #     vertexShader: vertexShader
  #     fragmentShader: fragmentShader
  #   )

  #   # material1 = new THREE.ShaderMaterial(
  #   #   uniforms:
  #   #     u_radius: { type: 'f', value: 10.0 }
  #   #     u_texture0: { type: 't', value: [] }
  #   #     u_direction: { type: 'v2', value: new THREE.Vector2() }
  #   #     u_resolution: { type: 'v2', value: new THREE.Vector2() }
  #   #   vertexShader: vertexShader
  #   #   fragmentShader: fragmentShader
  #   # )

  #   plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.0, 1.0), material)
  #   plane.position.z = -1
  #   plane.scale.set(@plane.scale.x, @plane.scale.y, 1.0)
  #   @sceneRTT.add(plane)

  #   # plane1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.0, 1.0), material1)
  #   # plane1.position.z = -1
  #   # plane1.scale.set(@plane.scale.x, @plane.scale.y, 1.0)
  #   # @sceneRTT1.add(plane1)

  #   @textureLoader.load 'resources/covers/all_day.jpg', (texture)=>
  #     plane.material.uniforms.u_texture0.value   = texture
  #     plane.material.uniforms.u_direction.value  = new THREE.Vector2(0, 1)
  #     plane.material.uniforms.u_resolution.value = @plane.material.uniforms.resolution.value

  #     # plane1.material.uniforms.u_texture0.value   = @rtTexture
  #     # plane1.material.uniforms.u_direction.value  = new THREE.Vector2(1, 0)
  #     # plane1.material.uniforms.u_resolution.value = @plane.material.uniforms.resolution.value

  #     # p = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), new THREE.MeshBasicMaterial( { color: 0xffffff, map: @rtTexture1 } ))
  #     # p.position.z = 0
  #     # p.scale.set(@plane.scale.x, @plane.scale.y, 1.0)
  #     # @add(p)
  #     # console.log p.material

  #     setTimeout(=>
  #       # @add(plane1)
  #       @plane.material.uniforms.texture0.value = @rtTexture
  #     , 3000)


  #   # @rendererRTT.render(@sceneRTT, @cameraRTT, @rtTexture)

  #   # console.log @plane.material.uniforms.texture0.value
  #   # @plane.material.uniforms.texture0.value = new THREE.Texture(@rtTexture.image, @rtTexture.mapping)
  #   # console.log @plane.material.uniforms.texture0.value

  #   # setTimeout(=>
  #   #   @plane.material.uniforms.texture0.value.__webglTexture = rtTexture.__webglTexture
  #   #   # console.log @plane.material.uniforms.texture0.value
  #   #   # console.log rtTexture
  #   #   plane.position.z = -100
  #   # , 5000)

  resize: ->
    texture0      = @plane.material.uniforms.texture0
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

    # if @cameraRTT and @sceneRTT and @rtTexture# and @cameraRTT1 and @sceneRTT1 and @rtTexture1
    #   @composer.render(0.01)
      # manager.renderer.render(@sceneRTT, @cameraRTT, @rtTexture)
      #manager.renderer.render(@sceneRTT1, @cameraRTT1, @rtTexture1)
