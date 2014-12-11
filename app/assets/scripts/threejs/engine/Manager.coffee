class SPACE.SceneManager

  currentScene: null
  _scenes: null
  _stats: null
  _tick: 0

  _renderer: null
  _camera:   null

  constructor: (width, height)->
    if (@_renderer) then return @

    @_tick = Date.now()

    @_scenes   = []

    @_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    @_camera.position.setZ(500)

    @_renderer = new THREE.WebGLRenderer({antialias: true})
    @_renderer.setClearColor(new THREE.Color(0xe42a79))
    @_renderer.setSize(window.innerWidth, window.innerHeight)
    @_renderer.shadozMapEnabled = true
    @_renderer.shadozMapSoft    = true
    @_renderer.shadozMapType    = THREE.PCFShadowMap
    document.getElementById('wrapper').appendChild(@_renderer.domElement)

    @_setupStats() if SPACE.ENV == 'development'

    @_render()
    @_update()

    window.onresize = =>
      @_renderer.setSize(window.innerWidth, window.innerHeight)
      @_camera.aspect = window.innerWidth / window.innerHeight
      @_camera.updateProjectionMatrix()

  _setupStats: ->
    @_stats = new Stats()
    @_stats.setMode(0)
    @_stats.domElement.style.position = 'absolute'
    @_stats.domElement.style.left = '0px'
    @_stats.domElement.style.top = '0px'
    document.body.appendChild( @_stats.domElement )

  _render: =>
    SPACE.ASSERT(SPACE.ENV == 'development', @_stats.begin)
    window.requestAnimationFrame(@_render)

    if !@currentScene or @currentScene.isPaused()
        return

    @_renderer.render( @currentScene, @_camera )

    SPACE.ASSERT(SPACE.ENV == 'development', @_stats.end)


  _update: =>
    setTimeout(@_update, 1000 / SPACE.FPS)

    if !@currentScene or @currentScene.isPaused()
        return

    c = Date.now()
    @currentScene.update(c - @_tick)
    @_tick = c

  createScene: (identifier, aScene, interactive)->
    if @_scenes[identifier]
        return undefined

    scene = new aScene()
    @_scenes[identifier] = scene

    return scene

  goToScene: (identifier)->
    if @_scenes[identifier]
        @currentScene.pause() if @currentScene
        @currentScene = @_scenes[identifier]
        @currentScene.resume()
        @debug()
        return true

    return false

  debug: ->
    # # triangleShape = new THREE.Shape()
    # # triangleShape.moveTo(  80, 20 )
    # # triangleShape.lineTo(  40, 80 )
    # # triangleShape.lineTo( 120, 80 )
    # # triangleShape.lineTo(  80, 20 )
    
    # # console.log triangleShape
    
    # # geometry = new THREE.ShapeGeometry( triangleShape )
    # # mat      = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} )
    # # @tr       = new THREE.Mesh(geometry, mat)
    # # @currentScene.add(@tr)

    # # @_camera.lookAt(@currentScene.equalizer.center)

    # scene = new SPACE.Scene()

    # camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)#75, window.innerWidth / window.innerHeight, 0.1, 1000)
    # camera.position.setZ(500)

    # renderer = new THREE.WebGLRenderer({antialias: true})
    # # renderer.setClearColor(new THREE.Color(0x0088FF))
    # renderer.setSize(window.innerWidth, window.innerHeight)
    # # renderer.shadozMapEnabled = true
    # # renderer.shadozMapSoft    = true
    # # renderer.shadozMapType    = THREE.PCFShadowMap

    # cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
    # cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    # cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    # cube.position.x = 1
    # cube.position.y = 1
    # cube.position.z = 1

    # scene.add(cube)

    # document.getElementById('wrapper').appendChild(renderer.domElement)

    # render = ->
    #   cube.rotation.x += 0.02
    #   cube.rotation.y += 0.02
    #   cube.rotation.z += 0.02

    #   renderer.render(scene, camera)
    #   requestAnimationFrame(render)
    # render()
