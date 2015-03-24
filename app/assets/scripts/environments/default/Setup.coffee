class Setup extends THREE.Group

  jukebox: null
  playlist: null
  current: null
  cover: null

  constructor: ->
    super
    @jukebox = SPACE.Jukebox

  onEnter: (callback)->
    callback() if callback
    @setup()

  onExit: (callback)->
    callback() if callback

  _events: ->
    document.addEventListener(TRACK.IS_PLAYING.type, @_eTrackIsPlaying)

  _eTrackIsPlaying: (e)->
    track    = e.object.track
    title    = track.data.title
    username = track.data.user.username
    user_url = track.data.user.url

    $('#cover h1').html(title)
    $('#cover h2').html('by <a href="'+user_url+'">'+username+'</a>')

  setup: ->
    @fetchTracks()
    @cover = new SPACE.DEFAULT.Cover()
    @_events()

    $('#wrapper').css(
      'background-image': 'url(covers/blame_it_on_me.jpg)'
      'background-size': 'cover'
      'background-repeat': 'no-repeat'
      'background-position': 'center'
    )

    # @loadingManager            = new THREE.LoadingManager()
    # @loadingManager.onLoad     = @_onLoad
    # @loader                    = new THREE.XHRLoader(@loadingManager)

    # @loader.load 'shaders/cover.frag', (content)=>
    #   @fShader = content
    # @loader.load 'shaders/cover.vert', (content)=>
    #   @vShader = content

    # plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), sprite)
    # ratio = window.innerWidth / window.innerHeight
    # plane.scale.set(window.innerWidth * ratio, window.innerHeight * ratio, 1)
    # @add(plane)

  _onLoad: =>
    texture = THREE.ImageUtils.loadTexture('covers/blame_it_on_me_small.jpg', THREE.UVMapping, (e)=>
      texture = e

      material = new THREE.ShaderMaterial(
        uniforms:
          texture: { type: 't', value: texture }
        vertexShader: @vShader
        fragmentShader: @fShader
      )

      @plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
      @add(@plane)

      texture       = @plane.material.uniforms.texture.value
      textureWidth  = texture.image.width
      textureHeight = texture.image.height

      if textureWidth > textureHeight
        texWidth  = window.innerWidth
        texHeight = (textureHeight * window.innerWidth) / textureWidth
      else
        texHeight  = window.innerHeight
        texWidth = (textureWidth * window.innerHeight) / textureHeight

      @plane.scale.set(texWidth, texHeight, 1)
    )

  resize: ->
    texture       = @plane.material.uniforms.texture.value
    textureWidth  = texture.image.width
    textureHeight = texture.image.height

    if textureWidth > textureHeight
      texWidth  = window.innerWidth
      texHeight = (textureHeight * window.innerWidth) / textureWidth
    else
      texHeight  = window.innerHeight
      texWidth = (textureWidth * window.innerHeight) / textureHeight

    @plane.scale.set(texWidth + texWidth * (1/75 + 75/600), texHeight + texHeight * (1/75 + 75/600), 1)

  fetchTracks: ->
    req = new XMLHttpRequest()
    req.open('GET', '/playlist.json', true)
    req.onload = (e)=>
      @playlist = JSON.parse(e.target.response)
    req.send(null)

  next: ->
    if @playlist.length > 0
      @current = @playlist.shift()
    @jukebox.add(@current.url)
    @refreshCover()

  update: (delta)->
    if @playlist and @playlist.length and @jukebox.state == JukeboxState.IS_STOPPED
      @next()

  refreshCover: ->
    css = """
        a { color: """+@current.color1+""" !important; }
        body { color: """+@current.color2+""" !important; }
    """
    $('.cover-style').html(css)
