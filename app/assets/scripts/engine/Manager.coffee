class SPACE.SceneManager

  currentScene: null
  _scenes: null
  _stats: null
  _clock: null
  _tick: 0

  renderer: null
  camera:   null

  constructor: (width, height)->
    if (@renderer) then return @

    @_clock = new THREE.Clock()

    @_scenes   = []

    @camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    @camera.position.setZ(600)
    # @camera.position.setY(500)
    # @camera.lookAt(new THREE.Vector3(0, 0, 0))

    @renderer = new THREE.WebGLRenderer({antialias: true, alpha: false})
    # @renderer.setPixelRatio(window.devicePixelRatio)
    # @renderer.setClearColor(new THREE.Color(0x58b1ff))
    @renderer.setSize(window.innerWidth, window.innerHeight)
    # @renderer.shadowMapEnabled = true
    # @renderer.shadowMapSoft    = true
    # @renderer.shadowMapType    = THREE.PCFShadowMap
    document.getElementById('wrapper').appendChild(@renderer.domElement)

    @_setupStats() if SPACE.ENV == 'development'

    @_render()
    @_update()

    window.onresize = =>
      @renderer.setSize(window.innerWidth, window.innerHeight)
      @camera.aspect = window.innerWidth / window.innerHeight
      @camera.updateProjectionMatrix()

  _setupStats: ->
    @_stats = new Stats()
    @_stats.setMode(0)
    @_stats.domElement.style.position = 'absolute'
    @_stats.domElement.style.left = '0px'
    @_stats.domElement.style.top = '0px'
    document.body.appendChild( @_stats.domElement )

  _render: =>
    window.requestAnimationFrame(@_render)

    if !@currentScene or @currentScene.isPaused()
        return

    # c = Date.now()
    @currentScene.update(@_clock.getDelta() * 1000)
    # @currentScene.update(c - @_tick);
    # @_tick = c

    @renderer.render( @currentScene, @camera )

    @_stats.update() if SPACE.ENV == 'development'

  _update: =>
    # setTimeout(@_update, 1000 / SPACE.FPS)

    # if !@currentScene or @currentScene.isPaused()
    #     return

    # c = Date.now()
    # # @currentScene.update(@_clock.getDelta())
    # @currentScene.update(c - @_tick);
    # console.log c - @_tick
    # @_tick = c

  createScene: (identifier, aScene, interactive)->
    if @_scenes[identifier]
        return undefined

    scene = new aScene()
    @_scenes[identifier] = scene

    return scene

  goToScene: (identifier)->
    $(window).off('resize', @currentScene.resize) if @currentScene
    if @_scenes[identifier]
        @currentScene.pause() if @currentScene
        @currentScene = @_scenes[identifier]
        @currentScene.resume()
        $(window).on('resize', @currentScene.resize)
        return true

    return false
