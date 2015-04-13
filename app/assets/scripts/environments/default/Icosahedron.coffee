class Icosahedron extends THREE.Group

  constructor: ->
    super

  setup: ->
    g = new THREE.IcosahedronGeometry(100, 1)
    m = new THREE.MeshLambertMaterial({ color: 0x0088ff, shading: THREE.FlatShading })
    @sphere = new THREE.Mesh(g, m)
    # @sphere.scale.set(.5, .5, .5)
    @sphere.rotation.set(Math.random(), Math.random(), Math.random())
    @sphere.castShadow = true
    @sphere.receiveShadow = true
    @add(@sphere)

  update: ->
    @sphere.rotation.y -= .001
    @sphere.rotation.x += .001
    @sphere.rotation.z += .001
