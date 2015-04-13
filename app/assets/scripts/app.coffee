(->
  scenes = ['MainScene']

  SPACE.SceneManager = new SPACE.SceneManager()
  for scene in scenes
    SPACE.SceneManager.createScene(scene)

  SPACE.SceneManager.goToScene('MainScene')
)()
