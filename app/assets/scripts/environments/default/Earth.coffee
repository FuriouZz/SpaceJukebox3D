class Earth extends THREE.Group

  constructor: ->
    super

  setup: ->
    g = new THREE.SphereGeometry(200, 20, 20)
    m = new THREE.MeshLambertMaterial({ color: 0x0088ff, shading: THREE.FlatShading })
    @cube = new THREE.Mesh(g, m)
    @cube.scale.set(.5, .5, .5)
    @cube.rotation.set(Math.random(), Math.random(), Math.random())
    @cube.castShadow = true
    @cube.receiveShadow = true
    @add(@cube)

  update: ->
    @rotation.x += .01
    @rotation.y -= .01
    @rotation.z += .01
