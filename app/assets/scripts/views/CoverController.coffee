class SPACE.CoverController

  @PLAYLIST_LOADED: 'cover_playlist_loaded'
  @TEXTURES_LOADED: 'cover_textures_loaded'
  @NEXT:            'cover_next'

  playlist:        null
  current:         null

  view:            null
  playlistView:    null

  _loadingManager: null
  _imageLoader:    null

  _imageData:    null

  constructor: ->
    req = new XMLHttpRequest()
    req.open('GET', 'resources/playlist.json', true)
    req.onload = (e)=>
      @playlist = JSON.parse(e.target.response)
      @_load()
    req.send()

    @_setup()
    @_events()

  _setup: ->
    @_imageData = {}

    @_loadingManager        = new THREE.LoadingManager()
    @_loadingManager.onLoad = @_onLoad
    @_imageLoader           = new THREE.ImageLoader(@_loadingManager)
    @_textureLoader         = new THREE.TextureLoader()

    @view = new SPACE.Cover()
    @view.setup()

    @playlistView = new Playlist()

  _load: ->
    for cover in @playlist
      cover.url += '?' + @_guid()
      @_imageLoader.load cover.cover_url, (image)=>

        src = image.src.replace(window.location.origin+'/', '')

        @_imageData[src]             = {}
        @_imageData[src].src         = src 
        @_imageData[src].image       = image 
        @_imageData[src].width       = image.width 
        @_imageData[src].height      = image.height 

        return true

    @playlistView.setList(@playlist)

  _guid: ->
    s4 = ->
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) 
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()

  _events: ->
    document.addEventListener(Track.IS_WAITING,   @_eTrackIsWaiting)
    document.addEventListener(Track.WILL_PLAY,    @_eTrackWillPlay)
    document.addEventListener(Jukebox.IS_QUEUING, @_eJukeboxIsQueuing)

  _onLoad: =>
    HELPER.trigger(SPACE.CoverController.PLAYLIST_LOADED)

    @_loadingManager.onLoad = @_textureLoaded

    # @view.imagesLoaded = @_imageLoader.cache.files
    # @view.setCovers(@playlist[1].cover_url, @playlist[0].cover_url)
    url0 = @playlist[1].cover_url
    url1 = @playlist[0].cover_url
    @view.setCovers(@_imageData[url0], @_imageData[url1])

  _eTrackIsWaiting: (e)=>
    track = e.object.track

    for t, i in @playlist
      if t.url == track.data.source_url
        nextTrack = null
        if i+1 < @playlist.length
          nextTrack = @playlist[i+1]
        
        track.mergeData({
          title:       t.title
          cover_url:   t.cover_url
          author_name: t.author_name
          author_url:  t.author_url
          color1:      t.color1
          color2:      t.color2
          nextTrack:   nextTrack
        })

        break;

  _eJukeboxIsQueuing: (e)=>
    c = e.object.jukebox.current

    isPlaylist = @current and @current.data.is_playlist
    isPlaylist = isPlaylist and c.data.is_playlist
    
    sameCover = false
    if isPlaylist
      sameCover = c.data.playlist.permalink == @current.data.playlist.permalink
    @current    = e.object.jukebox.current

    if not sameCover
      @playlistView.setActive(@current.data.source_url)
      HELPER.trigger(SPACE.CoverController.NEXT) 
      @_hide()

  _eTrackWillPlay: (e)=>
    current  = e.object.track.data
    next     = current.nextTrack
    @_updateInfo(current, next)

  _hide: ->
    $('#information h1').addClass('hidden')
    $('#information h2').addClass('hidden')

  _updateInfo: (current, next)=>
    title    = current.title
    username = current.author_name
    user_url = current.author_url
    color1   = current.color1
    color2   = current.color2

    $('#information h1').html(title)
    $('#information h2').html('by <a target="_blank" href="'+user_url+'">'+username+'</a>')

    css = """
        a { color: """+color1+""" !important; }
        body { color: """+color2+""" !important; }
    """
    $('.cover-style').html(css)

    if next
      url0 = current.cover_url
      url1 = next.cover_url
      @view.updateCovers(@_imageData[url0], @_imageData[url1])















  # _coordinates: (imageData)->
  #   manager  = SPACE.SceneManager
  #   fov      = manager.camera.fov / 180 * Math.PI
  #   aspect   = imageData.width / imageData.height
  #   distance = manager.camera.position.z + 1;
  #   ratio    = Math.max(1, manager.camera.aspect / aspect)

  #   width  = 2 * aspect * Math.tan(fov / 2) * distance * ratio
  #   height = 2 * Math.tan(fov / 2) * distance * ratio

  #   wSize = @view.plane.material.uniforms.resolution.value.x
  #   hSize = @view.plane.material.uniforms.resolution.value.y

  #   diff = new THREE.Vector2((1.0 - (wSize / width)) * 0.5, (1.0 - (hSize / height)) * 0.5)

  #   # v0 = new THREE.Vector2(0.0 + diff.x, 0.0 + diff.y)
  #   # v1 = new THREE.Vector2(0.0 + diff.x, 1.0 - diff.y)
  #   # v2 = new THREE.Vector2(1.0 - diff.x, 1.0 - diff.y)
  #   # v3 = new THREE.Vector2(1.0 - diff.x, 0.0 + diff.y)

  #   coords      = []
  #   coords[0] = new THREE.Vector2(0.0 + diff.x, 1.0 - diff.y)
  #   coords[1] = new THREE.Vector2(1.0 - diff.x, 1.0 - diff.y)    
  #   coords[2] = new THREE.Vector2(0.0 + diff.x, 0.0 + diff.y)    
  #   coords[3] = new THREE.Vector2(1.0 - diff.x, 0.0 + diff.y)

  #   return coords
