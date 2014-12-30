class Earth extends THREE.Group

  constructor: ->
    super

  setup: ->
    # g = new THREE.IcosahedronGeometry(100, 5)
    g = new THREE.SphereGeometry(100, 256, 256)

    # m = new THREE.MeshLambertMaterial({ color: 0x0088ff, shading: THREE.FlatShading })
    @atts = @attributes()
    uniforms   = @uniforms()
    m = new THREE.ShaderMaterial({
      uniforms: uniforms
      attributes: @atts
      vertexShader: @vertexShader()
      fragmentShader: @fragmentShader()
    })

    @sphere = new THREE.Mesh(g, m)
    # @sphere.scale.set(.5, .5, .5)
    # @sphere.rotation.set(Math.random(), Math.random(), Math.random())
    @sphere.castShadow = true
    @sphere.receiveShadow = true
    @add(@sphere)

    verts  = @sphere.geometry.vertices
    values = @atts.displacement.value

    setTimeout(=>
    #   console.log verts.length, SPACE.Jukebox.waveformData.mono.length
    #   console.log Math.floor(verts.length / SPACE.Jukebox.waveformData.mono.length)
      @random()
    , 5000)

    for vertex, i in verts
      values.push(1)

    @oldValues = @mute(@sphere.material.attributes.displacement.value.length)
    @newValues = @mute(@sphere.material.attributes.displacement.value.length)

  _time: 0
  oldValues: null
  newValues: null
  setValues: (values)->
    for i in [0..(@sphere.material.attributes.displacement.value.length-1)]
      @newValues[i] = Math.random() * .25

    @newValues = @mute(@sphere.material.attributes.displacement.value.length)

    start = @sphere.material.attributes.displacement.value.length * Math.random()
    start = Math.floor(start)
    length = @sphere.material.attributes.displacement.value.length
    i     = 0

    while i < values.length
      index = start+i
      if index > length
        index -= length
      @newValues[index] = values[i]
      @newValues[length - 1 - index] = values[i]
      i++

    @resetInterpolation()

  resetInterpolation: ->
    @_time = 0

    @oldValues = @sphere.material.attributes.displacement.value

    if @newValues.length > @oldValues.length
      for i in [(@oldValues.length)..(@newValues.length-1)]
        @oldValues[i] = 0


  random: (nb=256)=>
    values = []
    for i in [0..(nb*5)]
      values.push(1)
    @setValues(values)
    setTimeout(@random, 100)
    # console.log 'random'

  mute: (nb=256, setValues=false)=>
    values = []
    for i in [0..(nb-1)]
      values.push(0)
    @setValues(values) if setValues
    return values

  update: (delta)->
    @_time += delta
    t = Math.min(@_time / 150, 1)

    for value, i in @newValues
      diff = @newValues[i] - @oldValues[i]
      @sphere.material.attributes.displacement.value[i] = @oldValues[i] + t * diff
    @sphere.material.attributes.displacement.needsUpdate = true

    # @random()

  attributes: ->
    attributes =
      displacement:
        type: 'f'
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

    // Shared variable
    varying vec3 vNormal;

    void main(){
      vNormal = normal;

      vec3 test = vec3(.5, 0.2, 1.0);

      vec3 newPosition = position + normal * displacement * 100.0;
      vec4 pos = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      gl_Position = pos * max(0.0, dot(normal, test));
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
