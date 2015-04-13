class Earth extends THREE.Group

  constructor: ->
    super

  setup: ->
    # g = new THREE.IcosahedronGeometry(100, 2)
    g = new THREE.SphereGeometry(100, 20, 20)

    # m = new THREE.MeshLambertMaterial({ color: 0x0088ff, shading: THREE.FlatShading })
    @atts = @attributes()
    uniforms   = @uniforms()
    m = new THREE.ShaderMaterial({
      uniforms: uniforms
      attributes: @atts
      vertexShader: @vertexShader()
      fragmentShader: @fragmentShader()
      shading: THREE.FlatShading
      side: THREE.DoubleSide
    })

    @sphere = new THREE.Mesh(g, m)
    # @sphere.scale.set(.5, .5, .5)
    @sphere.rotation.set(Math.random(), Math.random(), Math.random())
    @sphere.castShadow = true
    @sphere.receiveShadow = true
    @add(@sphere)

    verts  = @sphere.geometry.vertices
    values = @atts.displacement.value
    colors = @atts.mycolor.value

    for vertex, i in verts
      values.push(1)
      colors.push(new THREE.Color(0x0088ff))

  test: =>
    max = 0
    for value in SPACE.Jukebox.waveformData.mono
      max = Math.max(max, value)
    @setValue(max)
    setTimeout(@test, 150)

  time: 0
  newValue: 0
  setValue: (value)->
    @newValue = value
    @reset()

  reset: ->
    @time = 0

  update: (delta)->
    @time += delta
    t = Math.min(@time / 5000, 1.0)

    @time = 0 if t >= 1.0

    @rotation.x += .005
    @rotation.y -= .005
    @rotation.z += .005

    values = @sphere.material.attributes.displacement.value
    length = values.length
    start  = Math.floor(length * t)

    for value, i in values
      if i >= start and i < 10+start
        tt = (i+start) / (9+start)
        values[i] = tt
      else
        values[i] = 0

    @sphere.material.attributes.displacement.needsUpdate = true

    # value = @sphere.material.uniforms.amplitude.value
    # @sphere.material.uniforms.amplitude.value = value - t * (value - @newValue)#(@oldValue - t * (@oldValue - @newValue))

  attributes: ->
    attributes =
      displacement:
        type: 'f'
        value: []
      mycolor:
        type: 'c'
        value: []

  uniforms: ->
    uniforms =
      amplitude:
        type: 'f'
        value: 0
      t:
        type: 'f'
        value: 0

  vertexShader: ->
    return '''
    attribute float displacement;
    attribute vec3 mycolor;
    uniform float amplitude;

    // Shared variable
    varying vec3 vNormal;
    varying vec3 vColor;

    void main(){
      vNormal = normal;
      vColor  = mycolor;

      vec3 newPosition = position + normal * displacement * 2.0;
      vec4 pos = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      gl_Position = pos;
    }
    '''

  fragmentShader: ->
    return '''
    varying vec3 vNormal;
    varying vec3 vColor;

    void main() {
      vec3 light       = vec3(0.5, 0.2, 1.0);
      light            = normalize(light);
      float dotProduct = max(0.0, dot(vNormal, light));

      vec3 color       = vColor * dotProduct;
      gl_FragColor     = vec4(color, 1.0);
    }
    '''
