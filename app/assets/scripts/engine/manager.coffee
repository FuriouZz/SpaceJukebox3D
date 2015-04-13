class SPACE.SceneManager

  currentScene: null
  _scenes: null
  _stats: null
  _clock: null

  renderer: null
  camera:   null

  constructor: ->
    @_setup()
    @_events()

    # if (@renderer) then return @

    # @_clock = new THREE.Clock()

    # @_scenes   = []

    # @camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    # # @camera.position.setZ(600)
    # # @camera.position.setY(500)
    # # @camera.lookAt(new THREE.Vector3(0, 0, 0))

    # @renderer = new THREE.WebGLRenderer({antialias: true})
    # # @renderer.setClearColor(new THREE.Color(0x58b1ff))
    # @renderer.setSize(window.innerWidth, window.innerHeight)
    # # @renderer.shadowMapEnabled = true
    # # @renderer.shadowMapSoft    = true
    # # @renderer.shadowMapType    = THREE.PCFShadowMap
    # document.getElementById('wrapper').appendChild(@renderer.domElement)

    # @_setupStats() if SPACE.ENV == 'development'

    # @_render()
    # # @_update()

    # # window.onresize = =>
    # #   @renderer.setSize(window.innerWidth, window.innerHeight)
    # #   @camera.aspect = window.innerWidth / window.innerHeight
    # #   @camera.updateProjectionMatrix()

  _setup: ->
    @_clock  = new THREE.Clock()
    @_scenes = []
    @camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    @renderer = new THREE.WebGLRenderer({ antialias: true })
    @renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById('wrapper').appendChild(@renderer.domElement)

    @_setupStats() if SPACE.ENV == 'development'
    @_render()

  _events: ->
    window.onresize = @_eOnResize

  _eOnResize: =>
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

    @currentScene.update(@_clock.getDelta() * 1000)
    @renderer.render( @currentScene, @camera )

    @_stats.update() if SPACE.ENV == 'development'

  createScene: (identifier)->
    if @_scenes[identifier]
        return @_scenes[identifier]

    try
      scene = new (eval("SPACE."+identifier))()
      @_scenes[identifier] = scene
    catch e
      return false

    return scene

  goToScene: (identifier)->
    if @_scenes[identifier]
        @currentScene.pause() if @currentScene
        @currentScene = @_scenes[identifier]
        @currentScene.resume()
        return true
    alert("Scene '"+identifier+"' doesn't exist")
    return false
