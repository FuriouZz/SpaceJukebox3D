window.ENUM =
  Keyboard:
    ENTER: 13
    UP: 38
    DOWN: 40
    ESC: 27
    DELETE: 46
  SpaceshipState:
    IDLE: 'spaceshipstate_idle'
    LAUNCHED: 'spaceshipstate_launched'
    IN_LOOP: 'spaceshipstate_inloop'
    ARRIVED: 'spaceshipstate_arrived'
  SearchEngineState:
    OPENED: 'searchenginestate_opened'
    CLOSED: 'searchenginestate_closed'
    SEARCH: 'searchenginestate_search'
    TRACK_SELECTED: 'searchenginestate_trackselected'
  JukeboxState:
    IS_PLAYING: 'jukeboxstate_isplaying'
    IS_STOPPED: 'jukeboxstate_isstopped'
    TRACK_STOPPED: 'jukeboxstate_trackstopped'
  AirportState:
    IDLE: 'airportstate_idle'
    SENDING: 'airportstate_sending'
  AudioState:
    IS_LOADING: 'audio_is_loading'
    IS_PLAYING: 'audio_is_playing'
    IS_PAUSED: 'audio_is_paused'
    IS_ENDED: 'audio_is_ended'
Object.freeze(ENUM)
