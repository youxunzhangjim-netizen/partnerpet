const api = window.petRoomAPI ?? {
  setMousePassThrough: () => {},
  quit: () => {}
};

const dictionary = {
  zh: {
    roomTitle: '暖暖小房間',
    roomSubtitle: '兩隻桌寵生活的小角落',
    settingsTooltip: '開啟設定',
    settingsTitle: '設定',
    languageHint: '切換介面語言，訊息會立即更新。',
    close: '關閉',
    resetRoom: '重置位置',
    quit: '離開',
    dragHint: '拖曳這裡移動房間；拖曳邊角調整大小',
    petTooltip: '輕點桌寵互動',
    petMeName: '我的桌寵',
    petPartnerName: '夥伴桌寵',
    petMeDragTooltip: '拖曳我的桌寵同步位置；輕點可互動',
    petPartnerTooltip: '夥伴桌寵的位置與訊息會自動同步',
    petA: '毛球',
    petB: '星星',
    partner: '夥伴',
    system: '系統',
    you: '你',
    messageLog: '訊息',
    clickThroughHint: '房間外點擊會穿透到桌面',
    messagePlaceholder: '輸入訊息給桌寵…',
    send: '送出',
    systemReady: '房間已準備好。拖曳上方可移動，拖曳邊角可調整大小。',
    systemClickThrough: '透明畫布不會擋住桌面；游標進入房間時才會啟用互動。',
    petGreetingA: '今天也想待在這個小房間裡陪你。',
    petGreetingB: '我會在角落安靜發光。',
    petMeGreeting: '拖曳我，就能把位置同步給另一台電腦。',
    petPartnerGreeting: '夥伴的桌寵會出現在這裡。',
    replyA: '收到，我會記在小小腦袋裡。',
    replyB: '嗯嗯，我在聽。',
    petClickA: '毛球蹦了一下。',
    petClickB: '星星眨了眨眼。',
    petMeClick: '我的桌寵開心地點點頭。',
    petPartnerClick: '夥伴桌寵回應了你。',
    serverUrlLabel: '伺服器網址',
    pairCodeLabel: '配對代碼',
    accessKeyLabel: '伺服器通行金鑰（選填）',
    accessKeyPlaceholder: '伺服器有設定 SERVER_ACCESS_KEY 時才需要',
    connectionHint: '兩台電腦使用相同伺服器網址、配對代碼與通行金鑰，就會進入同一個私人房間。',
    applyConnection: '套用並重新連線',
    connectionTooltip: '即時連線狀態',
    connectionConnecting: '連線中…',
    connectionConnected: '已連線',
    connectionWaiting: '等待夥伴',
    connectionDisconnected: '未連線',
    connectionReconnecting: '重新連線中…',
    socketClientMissing: '找不到 socket.io-client。請先在專案根目錄執行 npm install。',
    connectingToServer: '正在連線到同步伺服器。',
    connectionConnectedMessage: '已連上伺服器，正在尋找配對。',
    waitingForPartner: '正在等待另一台電腦加入相同配對代碼。',
    partnerJoined: '夥伴已加入私人房間。',
    partnerLeft: '夥伴已離線，原因：{reason}',
    socketDisconnected: '連線中斷，原因：{reason}',
    socketError: '連線失敗：{reason}',
    unauthorizedServer: '連線被伺服器拒絕：請確認通行金鑰是否正確。',
    reconnectAttempt: '嘗試重新連線中：第 {attempt} 次',
    notConnected: '目前未連線，訊息只會顯示在本機。',
    notPaired: '尚未配對，事件暫時不會送出。',
    connectionSettingsSaved: '連線設定已更新。',
    partnerAction: '夥伴互動：{action}',
    actionPoke: '輕碰',
    shockedBubbleDefault: '別戳我！',
    pokePartnerHint: '點擊夥伴桌寵可以輕戳對方。',
    pokeSent: '你輕戳了夥伴桌寵。',
    pokeSentBubble: '戳一下！',
    pokeReceived: '夥伴輕戳了你的桌寵。',
    petTextSaved: '桌寵泡泡文字已儲存。',
    shockedTextZhLabel: '被戳時顯示（繁中）',
    shockedTextEnLabel: '被戳時顯示（English）',
    shockedTextHint: '你的桌寵被輕戳時會用這段文字回應；留空會使用預設雙語文字。',
    savePetText: '儲存泡泡文字',
    powerModeTooltip: '背景省電模式狀態',
    powerModeActive: '正常',
    powerModeLow: '省電',
    lowPowerEnabled: '已進入省電模式：暫停不必要動畫並降低背景更新頻率。',
    lowPowerDisabled: '已恢復正常互動模式。',
    petStateIdle: '待機',
    petStateWalk: '走動',
    petStateShocked: '嚇到',
    timeThemeTooltip: '依照本機時間自動切換白天 / 夜晚外觀',
    timeThemeDay: '白天',
    timeThemeNight: '夜晚',
    themeChangedDay: '已依照現在時間切換為白天外觀。',
    themeChangedNight: '已依照現在時間切換為夜晚外觀。'
  },
  en: {
    roomTitle: 'Cozy Pet Room',
    roomSubtitle: 'A tiny corner for two desktop pets',
    settingsTooltip: 'Open settings',
    settingsTitle: 'Settings',
    languageHint: 'Switch the interface language. Messages update immediately.',
    close: 'Close',
    resetRoom: 'Reset room',
    quit: 'Quit',
    dragHint: 'Drag here to move the room; drag edges or corners to resize',
    petTooltip: 'Tap a pet to interact',
    petMeName: 'My Pet',
    petPartnerName: "Partner's Pet",
    petMeDragTooltip: 'Drag My Pet to sync its position; tap to interact',
    petPartnerTooltip: "Your partner's pet position and messages sync automatically",
    petA: 'Mochi',
    petB: 'Nova',
    partner: 'Partner',
    system: 'System',
    you: 'You',
    messageLog: 'Messages',
    clickThroughHint: 'Clicks outside the room pass through to the desktop',
    messagePlaceholder: 'Send a message to your pets…',
    send: 'Send',
    systemReady: 'Room is ready. Drag the top bar to move it, and drag the edges or corners to resize it.',
    systemClickThrough: 'The transparent canvas will not block your desktop; interaction turns on when the cursor enters the room.',
    petGreetingA: 'I want to stay in this little room with you today.',
    petGreetingB: 'I will glow quietly in the corner.',
    petMeGreeting: 'Drag me to sync my position to the other computer.',
    petPartnerGreeting: "Your partner's pet will appear here.",
    replyA: 'Got it. I will keep that in my tiny head.',
    replyB: 'Mhm, I am listening.',
    petClickA: 'Mochi hops once.',
    petClickB: 'Nova blinks softly.',
    petMeClick: 'My Pet nods happily.',
    petPartnerClick: "Partner's Pet responded.",
    serverUrlLabel: 'Server URL',
    pairCodeLabel: 'Pair code',
    accessKeyLabel: 'Server access key (optional)',
    accessKeyPlaceholder: 'Only needed when the server uses SERVER_ACCESS_KEY',
    connectionHint: 'Use the same server URL, pair code, and access key on both computers to enter one private room.',
    applyConnection: 'Apply and reconnect',
    connectionTooltip: 'Realtime connection status',
    connectionConnecting: 'Connecting…',
    connectionConnected: 'Connected',
    connectionWaiting: 'Waiting',
    connectionDisconnected: 'Offline',
    connectionReconnecting: 'Reconnecting…',
    socketClientMissing: 'socket.io-client was not found. Run npm install in the project root first.',
    connectingToServer: 'Connecting to the sync server.',
    connectionConnectedMessage: 'Connected to the server. Looking for a pair.',
    waitingForPartner: 'Waiting for another computer with the same pair code.',
    partnerJoined: 'Your partner joined the private room.',
    partnerLeft: 'Your partner went offline. Reason: {reason}',
    socketDisconnected: 'Connection lost. Reason: {reason}',
    socketError: 'Connection failed: {reason}',
    unauthorizedServer: 'The server rejected the connection. Check the access key.',
    reconnectAttempt: 'Trying to reconnect: attempt {attempt}',
    notConnected: 'You are offline. This message is shown locally only.',
    notPaired: 'Not paired yet. The event was not sent.',
    connectionSettingsSaved: 'Connection settings updated.',
    partnerAction: 'Partner action: {action}',
    actionPoke: 'poke',
    shockedBubbleDefault: "Don't touch me!",
    pokePartnerHint: "Click your partner's pet to poke it.",
    pokeSent: "You poked your partner's pet.",
    pokeSentBubble: 'Poke!',
    pokeReceived: 'Your partner poked your pet.',
    petTextSaved: 'Pet bubble text saved.',
    shockedTextZhLabel: 'Shocked bubble (Traditional Chinese)',
    shockedTextEnLabel: 'Shocked bubble (English)',
    shockedTextHint: 'Your pet uses this text when poked. Leave it empty to use the bilingual default.',
    savePetText: 'Save bubble text',
    powerModeTooltip: 'Background power-saving status',
    powerModeActive: 'Normal',
    powerModeLow: 'Eco',
    lowPowerEnabled: 'Power-saving mode enabled: unnecessary animations are paused and background update frequency is reduced.',
    lowPowerDisabled: 'Normal interaction mode restored.',
    petStateIdle: 'Idle',
    petStateWalk: 'Walk',
    petStateShocked: 'Shocked',
    timeThemeTooltip: 'Automatically switches day / night appearance using your local time',
    timeThemeDay: 'Day',
    timeThemeNight: 'Night',
    themeChangedDay: 'Switched to the day appearance based on the current time.',
    themeChangedNight: 'Switched to the night appearance based on the current time.'
  }
};

const room = document.getElementById('room');
const dragHandle = document.getElementById('dragHandle');
const settingsButton = document.getElementById('settingsButton');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsButton = document.getElementById('closeSettingsButton');
const resetRoomButton = document.getElementById('resetRoomButton');
const quitButton = document.getElementById('quitButton');
const applyConnectionButton = document.getElementById('applyConnectionButton');
const serverUrlInput = document.getElementById('serverUrlInput');
const pairCodeInput = document.getElementById('pairCodeInput');
const accessKeyInput = document.getElementById('accessKeyInput');
const shockedTextZhInput = document.getElementById('shockedTextZhInput');
const shockedTextEnInput = document.getElementById('shockedTextEnInput');
const savePetTextButton = document.getElementById('savePetTextButton');
const connectionText = document.getElementById('connectionText');
const timeThemeText = document.getElementById('timeThemeText');
const powerModeText = document.getElementById('powerModeText');
const petStage = document.getElementById('petStage');
const petMe = document.getElementById('petMe');
const petPartner = document.getElementById('petPartner');
const petMeImg = document.getElementById('petMeImg');
const petPartnerImg = document.getElementById('petPartnerImg');
const petMeBubble = document.getElementById('petMeBubble');
const petPartnerBubble = document.getElementById('petPartnerBubble');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messageLog = document.getElementById('messageLog');
const langButtons = Array.from(document.querySelectorAll('[data-lang]'));
const resizeHandles = Array.from(document.querySelectorAll('.resize-handle'));

const BOX_STORAGE_KEY = 'transparent-pet-room:box';
const LANG_STORAGE_KEY = 'transparent-pet-room:lang';
const SERVER_URL_STORAGE_KEY = 'transparent-pet-room:server-url';
const PAIR_CODE_STORAGE_KEY = 'transparent-pet-room:pair-code';
const ACCESS_KEY_STORAGE_KEY = 'transparent-pet-room:bridge-access-key';
const PET_POSITION_STORAGE_KEY = 'transparent-pet-room:pet-positions';
const SHOCKED_TEXT_ZH_STORAGE_KEY = 'transparent-pet-room:shocked-text-zh';
const SHOCKED_TEXT_EN_STORAGE_KEY = 'transparent-pet-room:shocked-text-en';
const MIN_WIDTH = 380;
const MIN_HEIGHT = 340;
const SCREEN_MARGIN = 16;
const DEFAULT_SERVER_URL = 'http://localhost:3000';
const DEFAULT_PAIR_CODE = 'default';
const DEFAULT_ACCESS_KEY = '';
const SHOCKED_DURATION_MS = 3000;
const BUBBLE_DEFAULT_DURATION_MS = 5000;
const IDLE_AFTER_MS = 3 * 60 * 1000;
const ACTIVE_THEME_CHECK_MS = 60 * 1000;
const LOW_POWER_THEME_CHECK_MS = 5 * 60 * 1000;
const ACTIVITY_RESCHEDULE_THROTTLE_MS = 5000;

const PET_STATES = Object.freeze({
  IDLE: 'Idle',
  WALK: 'Walk',
  SHOCKED: 'Shocked'
});

const PET_STATE_IMAGES = Object.freeze({
  me: {
    Idle: './assets/pet-me-idle.svg',
    Walk: './assets/pet-me-walk.svg',
    Shocked: './assets/pet-me-shocked.svg'
  },
  partner: {
    Idle: './assets/pet-partner-idle.svg',
    Walk: './assets/pet-partner-walk.svg',
    Shocked: './assets/pet-partner-shocked.svg'
  }
});

let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'zh';
let serverUrl = localStorage.getItem(SERVER_URL_STORAGE_KEY) || DEFAULT_SERVER_URL;
let pairCode = localStorage.getItem(PAIR_CODE_STORAGE_KEY) || DEFAULT_PAIR_CODE;
let accessKey = localStorage.getItem(ACCESS_KEY_STORAGE_KEY) || DEFAULT_ACCESS_KEY;
let connectionState = 'disconnected';
let currentTimeTheme = 'day';
let powerMode = 'active';
let socket = null;
let lastPassThrough = null;
let action = null;
let box = loadBox();
let petPositions = loadPetPositions();
let lastThemeMessage = null;
let lastActivityAt = Date.now();
let lastActivityScheduleAt = 0;
let idleTimer = null;
let themeTimer = null;
let pointerInsideRoom = false;
let lastPointerPoint = { x: -99999, y: -99999 };
let forceInteractiveUntil = 0;
const bubbleTimers = new Map();
const customShockedText = loadShockedTexts();
const petState = {
  me: { current: PET_STATES.IDLE, timer: null },
  partner: { current: PET_STATES.IDLE, timer: null }
};

const messages = [
  { sender: 'system', key: 'systemReady' },
  { sender: 'system', key: 'systemClickThrough' },
  { sender: 'pet_me', key: 'petMeGreeting' },
  { sender: 'pet_partner', key: 'petPartnerGreeting' }
];

function t(key) {
  return dictionary[currentLang]?.[key] ?? dictionary.en[key] ?? key;
}

function format(key, values = {}) {
  return t(key).replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, token) => values[token] ?? '');
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getDefaultBox() {
  const width = Math.min(560, Math.max(MIN_WIDTH, window.innerWidth - SCREEN_MARGIN * 2));
  const height = Math.min(480, Math.max(MIN_HEIGHT, window.innerHeight - SCREEN_MARGIN * 2));

  return {
    x: Math.max(SCREEN_MARGIN, window.innerWidth - width - 48),
    y: Math.max(SCREEN_MARGIN, 72),
    width,
    height
  };
}

function loadBox() {
  try {
    const saved = JSON.parse(localStorage.getItem(BOX_STORAGE_KEY));
    if (
      saved &&
      Number.isFinite(saved.x) &&
      Number.isFinite(saved.y) &&
      Number.isFinite(saved.width) &&
      Number.isFinite(saved.height)
    ) {
      return saved;
    }
  } catch {
    // Ignore corrupted localStorage and fall back to the default box.
  }

  return getDefaultBox();
}


function loadPetPositions() {
  const fallback = {
    me: { x: 36, y: 58 },
    partner: { x: 64, y: 58 }
  };

  try {
    const saved = JSON.parse(localStorage.getItem(PET_POSITION_STORAGE_KEY));
    const meX = clamp(Number(saved?.me?.x), 0, 100);
    const meY = clamp(Number(saved?.me?.y), 0, 100);
    const partnerX = clamp(Number(saved?.partner?.x), 0, 100);
    const partnerY = clamp(Number(saved?.partner?.y), 0, 100);

    if ([meX, meY, partnerX, partnerY].every(Number.isFinite)) {
      return {
        me: { x: meX, y: meY },
        partner: { x: partnerX, y: partnerY }
      };
    }
  } catch {
    // Ignore corrupted localStorage and fall back to the default pet positions.
  }

  return fallback;
}

function loadShockedTexts() {
  return {
    zh: localStorage.getItem(SHOCKED_TEXT_ZH_STORAGE_KEY) || '',
    en: localStorage.getItem(SHOCKED_TEXT_EN_STORAGE_KEY) || ''
  };
}

function saveShockedTexts() {
  customShockedText.zh = shockedTextZhInput.value.trim().slice(0, 80);
  customShockedText.en = shockedTextEnInput.value.trim().slice(0, 80);
  localStorage.setItem(SHOCKED_TEXT_ZH_STORAGE_KEY, customShockedText.zh);
  localStorage.setItem(SHOCKED_TEXT_EN_STORAGE_KEY, customShockedText.en);
}

function applyPetTextInputs() {
  shockedTextZhInput.value = customShockedText.zh;
  shockedTextEnInput.value = customShockedText.en;
  shockedTextZhInput.placeholder = dictionary.zh.shockedBubbleDefault;
  shockedTextEnInput.placeholder = dictionary.en.shockedBubbleDefault;
}

function getMyShockedText() {
  const customText = currentLang === 'zh' ? customShockedText.zh : customShockedText.en;
  return customText || t('shockedBubbleDefault');
}

function savePetPositions() {
  localStorage.setItem(PET_POSITION_STORAGE_KEY, JSON.stringify(petPositions));
}

function saveBox() {
  localStorage.setItem(BOX_STORAGE_KEY, JSON.stringify(box));
}

function clampBox(nextBox) {
  const maxWidth = Math.max(240, window.innerWidth - SCREEN_MARGIN * 2);
  const maxHeight = Math.max(220, window.innerHeight - SCREEN_MARGIN * 2);
  const minWidth = Math.min(MIN_WIDTH, maxWidth);
  const minHeight = Math.min(MIN_HEIGHT, maxHeight);

  const width = clamp(nextBox.width, minWidth, maxWidth);
  const height = clamp(nextBox.height, minHeight, maxHeight);

  return {
    width,
    height,
    x: clamp(nextBox.x, SCREEN_MARGIN, Math.max(SCREEN_MARGIN, window.innerWidth - width - SCREEN_MARGIN)),
    y: clamp(nextBox.y, SCREEN_MARGIN, Math.max(SCREEN_MARGIN, window.innerHeight - height - SCREEN_MARGIN))
  };
}

function applyBox() {
  box = clampBox(box);
  room.style.left = `${box.x}px`;
  room.style.top = `${box.y}px`;
  room.style.width = `${box.width}px`;
  room.style.height = `${box.height}px`;
}

function petStageRect() {
  return petStage.getBoundingClientRect();
}

function getPetSize(element) {
  return {
    width: element.offsetWidth || 96,
    height: element.offsetHeight || 118
  };
}

function clampPetPosition(position, element) {
  const rect = petStageRect();
  const size = getPetSize(element);

  const minX = rect.width > size.width ? (size.width / 2 / rect.width) * 100 : 50;
  const maxX = rect.width > size.width ? 100 - minX : 50;
  const minY = rect.height > size.height ? (size.height / 2 / rect.height) * 100 : 50;
  const maxY = rect.height > size.height ? 100 - minY : 50;

  return {
    x: clamp(Number(position.x), minX, maxX),
    y: clamp(Number(position.y), minY, maxY)
  };
}

function updateBubblePlacement(element, position) {
  const x = Number(position.x);
  const y = Number(position.y);
  element.dataset.bubbleEdge = x < 24 ? 'left' : x > 76 ? 'right' : 'center';
  element.dataset.bubbleVertical = y < 26 ? 'below' : 'above';
}

function positionPetElement(element, position) {
  const clamped = clampPetPosition(position, element);
  element.style.left = `${clamped.x}%`;
  element.style.top = `${clamped.y}%`;
  updateBubblePlacement(element, clamped);
  return clamped;
}

function applyPetPositions() {
  petPositions.me = positionPetElement(petMe, petPositions.me);
  petPositions.partner = positionPetElement(petPartner, petPositions.partner);
}

function emitMyPetPosition({ quiet = false } = {}) {
  const payload = {
    x: Number(petPositions.me.x.toFixed(3)),
    y: Number(petPositions.me.y.toFixed(3))
  };

  if (quiet) {
    if (socket?.connected) socket.emit('pet_move', payload);
    return;
  }

  emitSocket('pet_move', payload);
}

function showPetBubble(target, text, { duration = BUBBLE_DEFAULT_DURATION_MS } = {}) {
  const element = target === 'partner' ? petPartner : petMe;
  const bubble = target === 'partner' ? petPartnerBubble : petMeBubble;
  const cleanText = String(text || '').replace(/[\u0000-\u001f\u007f]/g, '').trim();
  if (!cleanText) return;

  bubble.textContent = cleanText.slice(0, 260);
  updateBubblePlacement(element, target === 'partner' ? petPositions.partner : petPositions.me);
  bubble.classList.add('is-visible');

  const timerKey = target === 'partner' ? 'partner' : 'me';
  clearTimeout(bubbleTimers.get(timerKey));
  bubbleTimers.set(timerKey, setTimeout(() => {
    bubble.classList.remove('is-visible');
  }, duration));
}

function popPet(element) {
  element.classList.remove('is-popping');
  void element.offsetWidth;
  element.classList.add('is-popping');
  setTimeout(() => element.classList.remove('is-popping'), 450);
}



function petRefs(target) {
  return target === 'partner'
    ? { element: petPartner, image: petPartnerImg, state: petState.partner }
    : { element: petMe, image: petMeImg, state: petState.me };
}

function petStateLabelKey(state) {
  if (state === PET_STATES.WALK) return 'petStateWalk';
  if (state === PET_STATES.SHOCKED) return 'petStateShocked';
  return 'petStateIdle';
}

function setPetState(target, nextState, { duration = 0, force = false } = {}) {
  const { element, image, state } = petRefs(target);
  const normalizedState = Object.values(PET_STATES).includes(nextState) ? nextState : PET_STATES.IDLE;

  if (!force && state.current === PET_STATES.SHOCKED && normalizedState !== PET_STATES.IDLE) {
    return;
  }

  clearTimeout(state.timer);
  state.timer = null;
  state.current = normalizedState;
  element.dataset.state = normalizedState;
  element.setAttribute('aria-label', `${target === 'partner' ? t('petPartnerName') : t('petMeName')} - ${t(petStateLabelKey(normalizedState))}`);

  const nextSrc = PET_STATE_IMAGES[target]?.[normalizedState];
  if (nextSrc && image.getAttribute('src') !== nextSrc) {
    image.setAttribute('src', nextSrc);
  }

  if (duration > 0) {
    state.timer = setTimeout(() => {
      setPetState(target, PET_STATES.IDLE, { force: true });
    }, duration);
  }
}


function refreshPetStateLabels() {
  for (const target of ['me', 'partner']) {
    const { element, state } = petRefs(target);
    element.setAttribute('aria-label', `${target === 'partner' ? t('petPartnerName') : t('petMeName')} - ${t(petStateLabelKey(state.current))}`);
  }
}

function setPetWalkThenIdle(target, duration = 850) {
  setPetState(target, PET_STATES.WALK, { duration, force: true });
}

function triggerMyShockedReaction({ sendAck = true } = {}) {
  const text = getMyShockedText();
  setPetState('me', PET_STATES.SHOCKED, { duration: SHOCKED_DURATION_MS, force: true });
  popPet(petMe);
  showPetBubble('me', text, { duration: SHOCKED_DURATION_MS });
  pushMessage('pet_me', { text });

  if (sendAck && socket?.connected) {
    socket.emit('pet_action', {
      action: 'poke_reaction',
      target: 'pet_partner',
      meta: {
        text,
        duration: SHOCKED_DURATION_MS
      }
    });
  }
}

function triggerPartnerShockedPreview(text, { duration = SHOCKED_DURATION_MS } = {}) {
  const cleanText = String(text || t('shockedBubbleDefault')).trim().slice(0, 120);
  setPetState('partner', PET_STATES.SHOCKED, { duration, force: true });
  popPet(petPartner);
  showPetBubble('partner', cleanText, { duration });
}

function pokePartnerPet() {
  markActivity('poke-partner', { force: true });
  popPet(petPartner);
  setPetState('partner', PET_STATES.SHOCKED, { duration: 800, force: true });
  showPetBubble('partner', t('pokeSentBubble'), { duration: 1000 });
  pushMessage('pet_partner', { key: 'pokeSent' });
  emitSocket('pet_action', { action: 'poke', target: 'pet_me' });
}

function setPowerMode(nextMode, { announce = false } = {}) {
  const normalizedMode = nextMode === 'low' ? 'low' : 'active';
  if (powerMode === normalizedMode && room.dataset.power === normalizedMode) return;

  powerMode = normalizedMode;
  room.dataset.power = powerMode;
  document.body.dataset.power = powerMode;
  updatePowerModeText();
  scheduleThemeUpdate();

  if (announce) {
    pushMessage('system', { key: powerMode === 'low' ? 'lowPowerEnabled' : 'lowPowerDisabled' });
  }
}

function updatePowerModeText() {
  if (!powerModeText) return;
  powerModeText.textContent = powerMode === 'low' ? t('powerModeLow') : t('powerModeActive');
}

function isEditableFocusedInsideRoom() {
  const active = document.activeElement;
  return Boolean(active && room.contains(active) && active.matches('input, textarea, select, [contenteditable="true"]'));
}

function scheduleIdleCheck() {
  clearTimeout(idleTimer);
  lastActivityScheduleAt = Date.now();

  const remaining = Math.max(1000, IDLE_AFTER_MS - (Date.now() - lastActivityAt));
  idleTimer = setTimeout(() => {
    const idleFor = Date.now() - lastActivityAt;
    if (idleFor >= IDLE_AFTER_MS && !action && !isEditableFocusedInsideRoom()) {
      setPowerMode('low', { announce: true });
    } else {
      scheduleIdleCheck();
    }
  }, remaining + 250);
}

function markActivity(_reason = 'activity', { force = false } = {}) {
  const now = Date.now();
  lastActivityAt = now;

  if (powerMode === 'low') {
    setPowerMode('active', { announce: true });
  }

  if (force || now - lastActivityScheduleAt > ACTIVITY_RESCHEDULE_THROTTLE_MS) {
    scheduleIdleCheck();
  }
}

function noteSocketActivity() {
  markActivity('socket', { force: true });
}

function scheduleThemeUpdate() {
  clearTimeout(themeTimer);
  const interval = powerMode === 'low' ? LOW_POWER_THEME_CHECK_MS : ACTIVE_THEME_CHECK_MS;
  themeTimer = setTimeout(() => {
    updateTimeTheme({ announce: true });
    scheduleThemeUpdate();
  }, interval);
}

function forceRoomInteractive(duration = 900) {
  forceInteractiveUntil = Math.max(forceInteractiveUntil, Date.now() + duration);
  setMousePassThrough(false);
}

function updateMousePassThroughForPoint(x, y) {
  lastPointerPoint = { x, y };

  if (action || isEditableFocusedInsideRoom() || Date.now() < forceInteractiveUntil) {
    pointerInsideRoom = true;
    setMousePassThrough(false);
    return;
  }

  const inside = isPointInsideRoom(x, y);
  if (inside !== pointerInsideRoom || lastPassThrough === null) {
    pointerInsideRoom = inside;
    setMousePassThrough(!inside);
  }
}

function resetBox() {
  box = getDefaultBox();
  applyBox();
  saveBox();
}

function isPointInsideRoom(x, y) {
  const rect = room.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function setMousePassThrough(shouldPassThrough) {
  if (lastPassThrough === shouldPassThrough) return;
  lastPassThrough = shouldPassThrough;
  api.setMousePassThrough(shouldPassThrough);
}

function getTimeTheme(date = new Date()) {
  const hour = date.getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
}

function updateTimeTheme({ announce = false } = {}) {
  const nextTheme = getTimeTheme();
  if (nextTheme === currentTimeTheme && room.dataset.theme === nextTheme) {
    updateTimeThemeText();
    return;
  }

  currentTimeTheme = nextTheme;
  room.dataset.theme = currentTimeTheme;
  document.body.dataset.theme = currentTimeTheme;
  updateTimeThemeText();

  if (announce) {
    const key = currentTimeTheme === 'day' ? 'themeChangedDay' : 'themeChangedNight';
    if (lastThemeMessage !== key) {
      lastThemeMessage = key;
      pushMessage('system', { key });
    }
  }
}

function updateTimeThemeText() {
  timeThemeText.textContent = currentTimeTheme === 'day' ? t('timeThemeDay') : t('timeThemeNight');
}

function connectionTextKey() {
  if (connectionState === 'connected') return 'connectionConnected';
  if (connectionState === 'waiting') return 'connectionWaiting';
  if (connectionState === 'connecting') return 'connectionConnecting';
  if (connectionState === 'reconnecting') return 'connectionReconnecting';
  return 'connectionDisconnected';
}

function setConnectionState(nextState) {
  connectionState = nextState;
  room.dataset.connection = ['connected', 'waiting', 'connecting', 'reconnecting', 'disconnected'].includes(nextState)
    ? nextState
    : 'disconnected';
  applyConnectionText();
}

function applyConnectionText() {
  connectionText.textContent = t(connectionTextKey());
}

function applyConnectionInputs() {
  serverUrlInput.value = serverUrl;
  pairCodeInput.value = pairCode;
  accessKeyInput.value = accessKey;
}

function applyI18n() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh-Hant' : 'en';

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll('[data-i18n-title]').forEach((element) => {
    element.setAttribute('title', t(element.dataset.i18nTitle));
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLang;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  updateTimeThemeText();
  updatePowerModeText();
  applyConnectionText();
  refreshPetStateLabels();
  renderMessages();
}

function senderName(sender) {
  if (sender === 'user') return t('you');
  if (sender === 'system') return t('system');
  if (sender === 'partner') return t('partner');
  if (sender === 'pet_me') return t('petMeName');
  if (sender === 'pet_partner') return t('petPartnerName');
  return t(sender);
}

function messageText(message) {
  if (message.key) return format(message.key, message.values || {});
  return message.text || '';
}

function renderMessages() {
  const shouldStickToBottom = messageLog.scrollTop + messageLog.clientHeight >= messageLog.scrollHeight - 12;
  messageLog.replaceChildren();

  for (const message of messages) {
    const line = document.createElement('div');
    line.className = `message message-${message.sender}`;

    const name = document.createElement('strong');
    name.textContent = `${senderName(message.sender)}: `;

    const content = document.createElement('span');
    content.textContent = messageText(message);

    line.append(name, content);
    messageLog.append(line);
  }

  if (shouldStickToBottom) {
    messageLog.scrollTop = messageLog.scrollHeight;
  }
}

function pushMessage(sender, message) {
  messages.push({ sender, ...message });

  // Keep the message log lightweight over long sessions.
  if (messages.length > 120) {
    messages.splice(0, messages.length - 120);
  }

  renderMessages();
  messageLog.scrollTop = messageLog.scrollHeight;
}

function emitSocket(eventName, payload) {
  if (!socket || !socket.connected) {
    pushMessage('system', { key: 'notConnected' });
    return false;
  }

  socket.emit(eventName, payload);
  return true;
}

function disconnectSocket() {
  if (!socket) return;

  socket.removeAllListeners();
  socket.io?.removeAllListeners?.();
  socket.disconnect();
  socket = null;
}

function connectSocket({ announce = false } = {}) {
  disconnectSocket();

  if (typeof window.io !== 'function') {
    setConnectionState('disconnected');
    pushMessage('system', { key: 'socketClientMissing' });
    return;
  }

  setConnectionState('connecting');
  if (announce) pushMessage('system', { key: 'connectingToServer' });

  socket = window.io(serverUrl, {
    auth: {
      pairCode,
      accessKey,
      clientKind: 'electron-desktop-pet',
      uiLanguage: currentLang
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    randomizationFactor: 0.5,
    timeout: 10000
  });

  socket.on('connect', () => {
    noteSocketActivity();
    setConnectionState('connected');
    pushMessage('system', { key: 'connectionConnectedMessage' });
  });

  socket.on('server_hello', () => {
    noteSocketActivity();
    // Reserved for future protocol negotiation.
  });

  socket.on('waiting_for_partner', () => {
    noteSocketActivity();
    setConnectionState('waiting');
    pushMessage('system', { key: 'waitingForPartner' });
  });

  socket.on('paired', () => {
    noteSocketActivity();
    setConnectionState('connected');
    pushMessage('system', { key: 'partnerJoined' });
    setTimeout(() => emitMyPetPosition({ quiet: true }), 120);
  });

  socket.on('partner_disconnected', (payload = {}) => {
    noteSocketActivity();
    setConnectionState('waiting');
    pushMessage('system', {
      key: 'partnerLeft',
      values: { reason: payload.reason || 'disconnect' }
    });
  });

  socket.on('not_paired', () => {
    noteSocketActivity();
    pushMessage('system', { key: 'notPaired' });
  });

  socket.on('payload_error', (payload = {}) => {
    noteSocketActivity();
    pushMessage('system', {
      text: `${payload.event || 'event'}: ${payload.error || 'payload_error'}`
    });
  });

  socket.on('send_msg', (payload = {}) => {
    noteSocketActivity();
    const text = typeof payload.text === 'string' ? payload.text.trim() : '';
    if (!text) return;
    pushMessage('partner', { text });
    showPetBubble('partner', text);
  });

  socket.on('pet_action', (payload = {}) => {
    noteSocketActivity();
    const incomingAction = String(payload.action || '').trim();

    if (incomingAction === 'poke' && (payload.target === 'pet_me' || payload.pet === 'pet_me' || !payload.target)) {
      pushMessage('partner', { key: 'pokeReceived' });
      triggerMyShockedReaction({ sendAck: true });
      return;
    }

    if (incomingAction === 'poke_reaction') {
      const meta = typeof payload.meta === 'object' && payload.meta !== null ? payload.meta : {};
      const rawDuration = Number(meta.duration);
      const duration = Number.isFinite(rawDuration) ? clamp(rawDuration, 1200, 6000) : SHOCKED_DURATION_MS;
      triggerPartnerShockedPreview(meta.text || t('shockedBubbleDefault'), { duration });
      return;
    }

    const actionName = incomingAction === 'poke' ? t('actionPoke') : incomingAction || 'action';
    popPet(petPartner);
    pushMessage('partner', {
      key: 'partnerAction',
      values: { action: actionName }
    });
  });

  socket.on('pet_move', (payload = {}) => {
    noteSocketActivity();
    const x = Number(payload.x);
    const y = Number(payload.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    setPetWalkThenIdle('partner', 900);
    petPositions.partner = positionPetElement(petPartner, { x, y });
  });

  socket.on('disconnect', (reason) => {
    noteSocketActivity();
    setConnectionState('disconnected');
    pushMessage('system', {
      key: 'socketDisconnected',
      values: { reason }
    });
  });

  socket.on('connect_error', (error) => {
    noteSocketActivity();
    setConnectionState('disconnected');
    const reason = error?.message || 'connect_error';
    pushMessage('system', {
      key: reason === 'unauthorized' ? 'unauthorizedServer' : 'socketError',
      values: { reason }
    });
  });

  socket.on('server_shutdown', () => {
    noteSocketActivity();
    setConnectionState('disconnected');
  });

  socket.io.on('reconnect_attempt', (attempt) => {
    setConnectionState('reconnecting');
    if (attempt === 1 || attempt % 5 === 0) {
      pushMessage('system', {
        key: 'reconnectAttempt',
        values: { attempt }
      });
    }
  });

  socket.io.on('reconnect', () => {
    noteSocketActivity();
    setConnectionState('connected');
  });

  socket.io.on('reconnect_error', () => {
    setConnectionState('reconnecting');
  });
}

function saveConnectionSettingsAndReconnect() {
  const nextServerUrl = serverUrlInput.value.trim() || DEFAULT_SERVER_URL;
  const nextPairCode = pairCodeInput.value.trim() || DEFAULT_PAIR_CODE;
  const nextAccessKey = accessKeyInput.value.trim();

  serverUrl = nextServerUrl;
  pairCode = nextPairCode;
  accessKey = nextAccessKey;
  localStorage.setItem(SERVER_URL_STORAGE_KEY, serverUrl);
  localStorage.setItem(PAIR_CODE_STORAGE_KEY, pairCode);
  localStorage.setItem(ACCESS_KEY_STORAGE_KEY, accessKey);

  pushMessage('system', { key: 'connectionSettingsSaved' });
  connectSocket({ announce: true });
}


function startPetDrag(event) {
  if (event.button !== 0) return;
  markActivity('pet-drag-start', { force: true });

  event.preventDefault();
  event.stopPropagation();
  setMousePassThrough(false);
  petMe.classList.add('is-dragging');
  setPetState('me', PET_STATES.WALK, { force: true });

  const stageRect = petStageRect();
  action = {
    type: 'pet-drag',
    pointerId: event.pointerId,
    target: petMe,
    startX: event.clientX,
    startY: event.clientY,
    stageWidth: stageRect.width || 1,
    stageHeight: stageRect.height || 1,
    startPosition: { ...petPositions.me },
    moved: false
  };

  petMe.setPointerCapture(event.pointerId);
}

function updatePetDrag(event) {
  const dxPercent = ((event.clientX - action.startX) / action.stageWidth) * 100;
  const dyPercent = ((event.clientY - action.startY) / action.stageHeight) * 100;

  if (Math.abs(event.clientX - action.startX) > 3 || Math.abs(event.clientY - action.startY) > 3) {
    action.moved = true;
  }

  petPositions.me = positionPetElement(petMe, {
    x: action.startPosition.x + dxPercent,
    y: action.startPosition.y + dyPercent
  });
}

function finishPetDrag(finishedAction) {
  petMe.classList.remove('is-dragging');
  setPetState('me', PET_STATES.IDLE, { force: true });
  petPositions.me = positionPetElement(petMe, petPositions.me);
  savePetPositions();
  emitMyPetPosition();

  if (!finishedAction.moved) {
    popPet(petMe);
    showPetBubble('me', t('petMeClick'));
    pushMessage('pet_me', { key: 'petMeClick' });
  }
}

function startDrag(event) {
  if (event.button !== 0) return;
  markActivity('room-drag-start', { force: true });
  if (event.target.closest('button, input, textarea, select, a')) return;

  event.preventDefault();
  setMousePassThrough(false);
  room.classList.add('is-moving');

  action = {
    type: 'drag',
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startBox: { ...box }
  };

  dragHandle.setPointerCapture(event.pointerId);
}

function startResize(event) {
  if (event.button !== 0) return;
  markActivity('resize-start', { force: true });

  event.preventDefault();
  event.stopPropagation();
  setMousePassThrough(false);
  room.classList.add('is-resizing');

  action = {
    type: 'resize',
    direction: event.currentTarget.dataset.dir,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startBox: { ...box },
    target: event.currentTarget
  };

  event.currentTarget.setPointerCapture(event.pointerId);
}

function updateDrag(event) {
  const dx = event.clientX - action.startX;
  const dy = event.clientY - action.startY;

  box = clampBox({
    ...action.startBox,
    x: action.startBox.x + dx,
    y: action.startBox.y + dy
  });

  applyBox();
}

function updateResize(event) {
  const dx = event.clientX - action.startX;
  const dy = event.clientY - action.startY;
  const direction = action.direction;
  const start = action.startBox;

  let next = { ...start };

  if (direction.includes('e')) {
    next.width = start.width + dx;
  }

  if (direction.includes('s')) {
    next.height = start.height + dy;
  }

  if (direction.includes('w')) {
    next.x = start.x + dx;
    next.width = start.width - dx;

    if (next.width < MIN_WIDTH) {
      next.x = start.x + start.width - MIN_WIDTH;
      next.width = MIN_WIDTH;
    }
  }

  if (direction.includes('n')) {
    next.y = start.y + dy;
    next.height = start.height - dy;

    if (next.height < MIN_HEIGHT) {
      next.y = start.y + start.height - MIN_HEIGHT;
      next.height = MIN_HEIGHT;
    }
  }

  box = clampBox(next);
  applyBox();
}

function stopAction(event) {
  if (!action) return;

  const finishedAction = action;

  try {
    const captureTarget = finishedAction.target || dragHandle;
    if (captureTarget.hasPointerCapture?.(finishedAction.pointerId)) {
      captureTarget.releasePointerCapture(finishedAction.pointerId);
    }
  } catch {
    // Some platforms may release capture automatically.
  }

  if (finishedAction.type === 'pet-drag') {
    finishPetDrag(finishedAction);
  } else {
    room.classList.remove('is-moving', 'is-resizing');
    saveBox();
  }

  action = null;
  updateMousePassThroughForPoint(event.clientX, event.clientY);
}

function handleMouseMove(event) {
  markActivity('mouse');
  updateMousePassThroughForPoint(event.clientX, event.clientY);
}

settingsButton.addEventListener('click', () => {
  markActivity('settings', { force: true });
  forceRoomInteractive(1200);
  settingsPanel.hidden = !settingsPanel.hidden;
  setMousePassThrough(false);
});

closeSettingsButton.addEventListener('click', () => {
  markActivity('settings-close', { force: true });
  settingsPanel.hidden = true;
});

resetRoomButton.addEventListener('click', () => {
  markActivity('reset-room', { force: true });
  resetBox();
});

quitButton.addEventListener('click', () => {
  api.quit();
});

applyConnectionButton.addEventListener('click', () => {
  markActivity('connection-settings', { force: true });
  saveConnectionSettingsAndReconnect();
});


savePetTextButton.addEventListener('click', () => {
  markActivity('save-pet-text', { force: true });
  saveShockedTexts();
  pushMessage('system', { key: 'petTextSaved' });
  messageInput.focus();
});

room.addEventListener('focusin', () => {
  markActivity('focus-in', { force: true });
  forceRoomInteractive(1600);
});

room.addEventListener('focusout', () => {
  setTimeout(() => updateMousePassThroughForPoint(lastPointerPoint.x, lastPointerPoint.y), 80);
});

langButtons.forEach((button) => {
  button.addEventListener('click', () => {
    markActivity('language', { force: true });
    currentLang = button.dataset.lang;
    localStorage.setItem(LANG_STORAGE_KEY, currentLang);
    applyI18n();

    if (socket) {
      socket.auth = {
        ...socket.auth,
        uiLanguage: currentLang
      };
    }

    messageInput.focus();
  });
});

messageForm.addEventListener('submit', (event) => {
  markActivity('message-submit', { force: true });
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  pushMessage('user', { text });
  showPetBubble('me', text);
  emitSocket('send_msg', { text, lang: currentLang });

  if (!socket || !socket.connected) {
    pushMessage('pet_me', { key: Math.random() > 0.5 ? 'replyA' : 'replyB' });
  }

  messageInput.value = '';
  messageInput.focus();
});

petMe.addEventListener('pointerdown', startPetDrag);
petMe.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  popPet(petMe);
  showPetBubble('me', t('petMeClick'));
  pushMessage('pet_me', { key: 'petMeClick' });
});


petPartner.addEventListener('click', pokePartnerPet);
petPartner.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  pokePartnerPet();
});

dragHandle.addEventListener('pointerdown', startDrag);
resizeHandles.forEach((handle) => handle.addEventListener('pointerdown', startResize));

window.addEventListener('pointermove', (event) => {
  markActivity('pointer-move');
  if (!action) return;

  if (action.type === 'drag') updateDrag(event);
  if (action.type === 'resize') updateResize(event);
  if (action.type === 'pet-drag') updatePetDrag(event);
});

window.addEventListener('pointerup', (event) => {
  markActivity('pointer-up', { force: true });
  stopAction(event);
});
window.addEventListener('pointercancel', (event) => {
  markActivity('pointer-cancel', { force: true });
  stopAction(event);
});
window.addEventListener('mousemove', handleMouseMove);

room.addEventListener('mouseenter', () => {
  markActivity('room-enter', { force: true });
  forceRoomInteractive(700);
});

room.addEventListener('mouseleave', (event) => {
  if (!action) updateMousePassThroughForPoint(event.clientX, event.clientY);
});

window.addEventListener('resize', () => {
  box = clampBox(box);
  applyBox();
  applyPetPositions();
  saveBox();
  savePetPositions();
});

window.addEventListener('keydown', (event) => {
  markActivity('keydown', { force: true });
  if (event.key === 'Escape') {
    settingsPanel.hidden = true;
  }
});

applyBox();
requestAnimationFrame(() => {
  applyPetPositions();
  savePetPositions();
});
applyConnectionInputs();
applyPetTextInputs();
currentTimeTheme = getTimeTheme();
room.dataset.theme = currentTimeTheme;
document.body.dataset.theme = currentTimeTheme;
applyI18n();
setPetState('me', PET_STATES.IDLE, { force: true });
setPetState('partner', PET_STATES.IDLE, { force: true });
setPowerMode('active');
setMousePassThrough(true);
scheduleIdleCheck();
scheduleThemeUpdate();
connectSocket({ announce: true });
