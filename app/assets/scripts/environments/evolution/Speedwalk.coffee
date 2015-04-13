class Speedwalk extends THREE.Group

  plane:         null
  planeGeometry: null

  width:     0
  height:    0
  wSegments: 0
  hSegments: 0
  start:     0
  length:    0

  verticies: null

  constructor: (options={})->
    super

    # Set parameters
    defaults =
      width:     500
      height:    200
      wSegments: 50
      hSegments: 50
      start:     Math.PI * 0
      length:    Math.PI * 2

    opts       = _Coffee.merge(defaults, opts)
    @width     = opts.width
    @height    = opts.height
    @wSegments = opts.wSegments
    @hSegments = opts.hSegments
    @start     = opts.start
    @length    = opts.length

    @createPlane()
    @createGrid()
    @square()

  attributes: ->
    attributes =
      displacement:
        type: 'f'
        value: []

  uniforms: ->
    uniforms =
      uTime:
        type: 'f'
        value: 0

  vertexShader: ->
    return '''
    #define M_PI 3.1415926535897932384626433832795
    uniform float uTime;

    // Shared variable
    varying vec3 vNormal;

    void main(){
      vNormal = normal;

      float intensity  = 0.0;

      vec3 newPosition = position;

      float ratio   = (newPosition.y + 250.0 * 0.5 - intensity) / (250.0 - intensity) - 0.15;
      ratio         = max(0.0, ratio);

      newPosition.x = newPosition.x + cos(uTime + ratio * M_PI) * 50.0 * ratio;
      newPosition.z = newPosition.z + cos(uTime + ratio * M_PI) * 250.0 * 0.5 * ratio;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
    '''

  fragmentShader: ->
    return '''
    varying vec3 vNormal;

    void main() {
      vec3 light       = vec3(0.5, 0.2, 1.0);
      light            = normalize(light);
      float dotProduct = max(0.0, dot(vNormal, light));

      vec3 color       = vec3(1.0, 1.0, 1.0) * dotProduct;
      gl_FragColor     = vec4(color, 1.0 - dotProduct);
    }
    '''

  square: ->
    g  = new THREE.BoxGeometry(25, 250, 25, 5, 10, 5)

    for i in [1..4]
      # g1 = new THREE.BoxGeometry(25, 250, 25, 50, 50, 50)
      g1 = g.clone()
      matrix = new THREE.Matrix4()
      matrix.makeTranslation(28*i, 0, 0)
      g1.applyMatrix(matrix)

      g.merge(g1)

    # g = new THREE.BufferGeometry().fromGeometry

    m = new THREE.ShaderMaterial({
      uniforms: @uniforms()
      vertexShader: @vertexShader()
      fragmentShader: @fragmentShader()
    })
    @box = new THREE.Mesh(g, m)
    @box.position.y = 250 * .5
    @add(@box)

    # # m = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading })

    # m = new THREE.ShaderMaterial({
    #   uniforms: @uniforms()
    #   # attributes: @attributes()
    #   vertexShader: @vertexShader()
    #   fragmentShader: @fragmentShader()
    # })

    # @box1 = new THREE.Mesh(g, m)
    # @box1.position.y = 250 * .5
    # @box1.position.x = 100
    # @add(@box1)


    # pts = [
    #   new THREE.Vector3(0, 0, 0)
    #   new THREE.Vector3(0, 100, 0)
    #   new THREE.Vector3(0, 150, 0)
    #   new THREE.Vector3(50, 200, 0)
    #   new THREE.Vector3(-50, 225, 0)
    #   new THREE.Vector3(0, 250, 0)
    # ]

    # spline = new THREE.SplineCurve3(pts)
    # pts = [
    #   new THREE.Vector2(-12.5, -12.5)
    #   new THREE.Vector2(12.5, -12.5)
    #   new THREE.Vector2(12.5, 12.5)
    #   new THREE.Vector2(-12.5, 12.5)
    # ]

    # shape = new THREE.Shape(pts)
    # o     = {
    #   steps: 250
    #   bevelEnabled: false
    #   extrudePath: spline
    # }
    # g     = new THREE.ExtrudeGeometry(shape, o)

    # m     = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading })
    # mesh  = new THREE.Mesh(g, m)
    # @add(mesh)

    # # time = 0
    # # mesh.update = ->
    # #   time += .01
    # #   pts = [
    # #     new THREE.Vector3(0, 0, 0)
    # #     new THREE.Vector3(0, 100, 0)
    # #     new THREE.Vector3(0, 150, 0)
    # #     new THREE.Vector3(Math.cos(time) * +50, 200, 0)
    # #     new THREE.Vector3(Math.cos(time) * -50, 225, 0)
    # #     new THREE.Vector3(0, 250, 0)
    # #   ]

    # #   spline.points      = pts
    # #   spline.needsUpdate = true
    # #   g = new THREE.ExtrudeGeometry(shape, o)

    # #   mesh.geometry.vertices = g.vertices
    # #   mesh.geometry.verticesNeedUpdate = true



  createPlane: ->
    g = new THREE.CylinderGeometry(@height*.5, @height*.5, @width, @hSegments, @wSegments)
    matrix = new THREE.Matrix4()
    matrix.makeRotationZ(Math.PI * .5)
    g.applyMatrix(matrix)
    g = new THREE.BufferGeometry().fromGeometry(g)
    m = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, side: THREE.DoubleSide })
    @plane = new THREE.Mesh(g, m)
    @plane.position.y = -100
    @plane.position.z = (manager.camera.position.z - 100)
    @add(@plane)

    # g = new THREE.BoxGeometry(1, 1, 1)
    # m = new THREE.MeshBasicMaterial({color: 0xFF0000 })
    # @cube = new THREE.Mesh(g, m)
    # @cube.position.set(0, -50, manager.camera.position.z - 25)
    # @add(@cube)

    # origin    = new THREE.Vector3(0, -50, manager.camera.position.z - 25)
    # dir       = new THREE.Vector3(0, 1, 0)
    # raycaster = new THREE.Raycaster(origin, dir)

    # arrowHelper = new THREE.ArrowHelper( dir, origin, 500, 0xFF0000 )
    # @add(arrowHelper)

    # # if (raycaster.intersectObject(plane, true)).length
    # #   console.log raycaster.intersectObject(plane, true).length

  createGrid: ->
    geometry = new THREE.Geometry()

    for y in [0..(@hSegments-1)]
      angle  = (y / (@hSegments-1)) * @length

      from   = new THREE.Vector3()
      from.x = @width*-.5
      to     = new THREE.Vector3()
      to.x   = @width*-.5 + @width

      from.y = to.y = Math.sin(@start + angle) * (@height * .5)
      from.z = to.z = Math.cos(@start + angle) * (@height * .5)

      g = new THREE.Geometry()
      g.vertices.push(from, to, from)
      geometry.merge(g)

    for x in [0..(@wSegments-1)]
      for y in [0..(@hSegments-2)]
        angleFrom  = ((y+0) / (@hSegments-1)) * @length
        angleTo    = ((y+1) / (@hSegments-1)) * @length

        from   = new THREE.Vector3()
        to     = new THREE.Vector3()

        from.x = to.x = @width*-.5 + (x / @wSegments) * @width
        from.y = Math.sin(@start + angleFrom) * (@height * .501)
        from.z = Math.cos(@start + angleFrom) * (@height * .501)
        to.y   = Math.sin(@start + angleTo)   * (@height * .501)
        to.z   = Math.cos(@start + angleTo)   * (@height * .501)

        g = new THREE.Geometry()
        g.vertices.push(from, to, from)
        geometry.merge(g)

    m    = new THREE.LineBasicMaterial({color: 0xD1D1D1, linewidth: 1 })
    line = new THREE.Line(geometry, m)

    @plane.add(line)

  time: 0
  update: (delta)->
    @time += delta
    @box.material.uniforms.uTime.value = @time
    # @box1.material.uniforms.uTime.value = @time
    @plane.rotation.x += .005
