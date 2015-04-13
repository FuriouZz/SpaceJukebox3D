class Setup extends THREE.Group

  jukebox: null

  constructor: ->
    super
    @jukebox = SPACE.Jukebox

  onEnter: (callback)->
    callback() if callback
    @setup()

  onExit: (callback)->
    callback() if callback

  setup: ->
    @lights()

    @speedwalk = new SPACE.EVOLUTION.Speedwalk()
    @add(@speedwalk)

    # size  = 50
    # start = Math.PI * .25
    # g     = new THREE.PlaneGeometry(1000, 1000, size, size)
    # j     = -1
    # for vertex, i in g.vertices
    #   j++ if i%(size+1) == 0
    #   angle    = Math.PI * .5 * (j / size)
    #   vertex.z = Math.cos(start + angle) * 100
    #   vertex.y = Math.sin(start + angle) * 100
    # g.verticesNeedUpdate = true
    # g.computeFaceNormals()

    # m = new THREE.MeshLambertMaterial({
    #   color: 0xffffff
    #   shading: THREE.FlatShading
    #   side: THREE.DoubleSide
    #   wireframe: false
    # })
    # plane = new THREE.SceneUtils.createMultiMaterialObject(g, [
    #     new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, side: THREE.DoubleSide })
    #     new THREE.MeshBasicMaterial({color: 0xD1D1D1, wireframe: true })
    # ])

    # plane.position.y = -100
    # plane.position.z = manager.camera.position.z - 100
    # @add(plane)

    # origin = manager.camera.position.clone()
    # to     = new THREE.Vector3(0, -150, 400)
    # dir    = new THREE.Vector3(0, -.5, -1 ).normalize()
    # # dir.y  * -1
    # # dir.z  * -1
    # # console.log origin, new THREE.Vector3(0, 150 - origin.y, 100 - origin.z), dir
    # raycaster = new THREE.Raycaster(origin, dir)

    # arrowHelper = new THREE.ArrowHelper( dir, origin, 500, 0xFF0000 )
    # @add(arrowHelper)
    # # # to       = plane.position
    # # geometry = new THREE.Geometry()
    # # geometry.vertices.push(origin, to, origin)
    # # material = new THREE.LineBasicMaterial({ color: 0xFF0000, linewidth: 4 })

    # # line = new THREE.Line(geometry, material)
    # # @add(line)

    # # manager.camera.position.z = 800
    # # manager.camera.position.y = 400
    # # manager.camera.lookAt(plane.position)

    # time = 0
    # plane.update = (delta)->
    #     time += delta
    #     t = time / 500
    #     time = 0 if t >= 1

    #     for mesh in plane.children
    #         j = -1
    #         for vertex, i in mesh.geometry.vertices
    #             j++ if i%(size+1) == 0
    #             angle = Math.PI * .5 * (j / size)

    #             mvangle = (2 / 50) * Math.PI * .5
    #             mvangle *= t

    #             vertex.z = Math.cos(start + angle - mvangle) * 100
    #             vertex.y = Math.sin(start + angle - mvangle) * 100
    #         mesh.geometry.verticesNeedUpdate = true

    #     # @rotation.x += .005

    # setTimeout(=>
    #     console.log('test')

    #     intersections = raycaster.intersectObject(plane, true)
    #     object1 = intersections[0]
    #     object2 = intersections[1]

    #     console.log object1, object2

    #     a = object1.object.geometry.vertices[object1.face.a]
    #     b = object1.object.geometry.vertices[object1.face.b]
    #     c = object1.object.geometry.vertices[object1.face.c]

    #     # d = object2.object.geometry.vertices[object1.face.a]
    #     # e = object2.object.geometry.vertices[object1.face.b]
    #     # f = object1.object.geometry.vertices[object1.face.c]

    #     shapes = (new THREE.Path([a, b, c])).toShapes()
    #     console.log shapes
    #     extrude = new THREE.ExtrudeGeometry(shapes ,{
    #       curveSegments: 0
    #       steps: 1
    #       amount: 1
    #     })

    #     m = new THREE.MeshLambertMaterial({
    #       color: 0xffaa22
    #       shading: THREE.FlatShading
    #       side: THREE.DoubleSide
    #       # wireframe: true
    #     })
    #     mesh = new THREE.Mesh(extrude, m)
    #     # mesh.scale.multiplyScalar(1/100)
    #     # mesh.rotation.x = -Math.PI * .15
    #     # mesh.position.y = -100
    #     plane.add(mesh)

    # , 2000)

  lights: ->
    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.2 )
    light.position.set( 500, 500, 500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.6 )
    light.position.set( -500, 500, 500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.2 )
    light.position.set( 500, -500, 500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.2 )
    light.position.set( -500, -500, 500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.1 )
    light.position.set( 500, 500, -500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.1 )
    light.position.set( -500, 500, -500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.1 )
    light.position.set( 500, -500, -500 )
    @add( light )

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.8*.1 )
    light.position.set( -500, -500, -500 )
    @add( light )
