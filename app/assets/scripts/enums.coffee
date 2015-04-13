Keyboard =
  ENTER:  13
  UP:     38
  DOWN:   40
  ESC:    27
  DELETE: 46

SpaceshipState =
  IDLE:     'idle'
  LAUNCHED: 'launched'
  IN_LOOP:  'in_loop'
  ARRIVED:  'arrived'

SearchEngineState =
  OPENED: 'opened'
  CLOSED: 'closed'
  SEARCH: 'search'
  TRACK_SELECTED: 'track_selected'

JukeboxState =
  IS_PLAYING: 'is_playing'
  IS_STOPPED: 'is_stopped'

AirportState =
  IDLE: 'idle'
  SENDING: 'sending'

Object.freeze(Keyboard)
Object.freeze(SpaceshipState)
Object.freeze(SearchEngineState)
Object.freeze(JukeboxState)
Object.freeze(AirportState)
