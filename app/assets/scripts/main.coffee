#= require config.coffee
#= require events.coffee
#= require enums.coffee

#= require helpers/Helpers.coffee
#= require helpers/Coffee.coffee
#= require helpers/Maths.coffee
#= require helpers/Threejs.coffee
#= require helpers/Easing.coffee

#= require engine/Scene.coffee
#= require engine/Manager.coffee

#= require scenes/Main.coffee

#= require sounds/Soundcloud.coffee
#= require sounds/SearchEngine.coffee
#= require sounds/Jukebox.coffee
#= require sounds/Track.coffee
#= require sounds/WebAudioAPI.coffee

#= require graphics/Equalizer.coffee
#= require graphics/Spaceship.coffee

#= require environments/default/Setup.coffee
#= require environments/default/Cover.coffee

manager = new SPACE.SceneManager()
manager.createScene('main', SPACE.MainScene)
manager.goToScene('main')


# scene = sceneRTT = sceneScreen = renderer = rendererRTT = rendererScreen = camera = cameraRTT = cameraScreen = null

# sceneRTT    = new THREE.Scene()
# sceneScreen = new THREE.Scene()
# scene       = new THREE.Scene()

# rendererRTT    = new THREE.WebGLRenderer()
# rendererScreen = new THREE.WebGLRenderer()
# renderer       = new THREE.WebGLRenderer()

#     @renderer = new THREE.WebGLRenderer({antialias: true, alpha: false})
#     # @renderer.setPixelRatio(window.devicePixelRatio)
#     # @renderer.setClearColor(new THREE.Color(0x58b1ff))
#     @renderer.setSize(window.innerWidth, window.innerHeight)
#     # @renderer.shadowMapEnabled = true
#     # @renderer.shadowMapSoft    = true
#     # @renderer.shadowMapType    = THREE.PCFShadowMap
#     document.getElementById('wrapper').appendChild(@renderer.domElement)
