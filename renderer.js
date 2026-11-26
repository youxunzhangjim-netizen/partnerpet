const api = window.petRoomAPI ?? {
  setMousePassThrough: () => {},
  minimize: () => {},
  quit: () => {}
};

function readConfigString(config, key, maxLength = 300) {
  try {
    if (!config || typeof config !== 'object' || typeof config[key] === 'undefined') return '';
    return String(config[key]).replace(/[\u0000-\u001f\u007f-\u009f]/g, '').trim().slice(0, maxLength);
  } catch {
    return '';
  }
}

const rawPetRoomConfig = window.PET_ROOM_CONFIG && typeof window.PET_ROOM_CONFIG === 'object'
  ? window.PET_ROOM_CONFIG
  : {};

const appConfig = Object.freeze({
  defaultServerUrl: readConfigString(rawPetRoomConfig, 'defaultServerUrl'),
  defaultPairCode: readConfigString(rawPetRoomConfig, 'defaultPairCode', 64),
  defaultAccessToken: readConfigString(rawPetRoomConfig, 'defaultAccessToken', 256),
  appMode: readConfigString(rawPetRoomConfig, 'appMode', 40) || 'development'
});

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
    setupTitle: 'First setup',
    setupIntro: 'Use the same server URL and pair code to connect with another computer.',
    setupStepServer: 'Enter Server URL',
    setupStepPair: 'Generate or enter Pair Code',
    setupStepShare: 'Share Pair Code with your partner',
    setupStepAccess: 'Enter Access Key only if required',
    generatePairCode: 'Generate Pair Code',
    copyPairCode: 'Copy Pair Code',
    setupApplyConnect: 'Apply and Connect',
    setupLater: 'Set Up Later',
    localhostWarning: 'This server URL only works for local testing. Different Wi-Fi or countries need a public HTTPS server.',
    setupStatusReady: 'Press Apply and Connect when ready.',
    setupStatusConnecting: 'Connecting and looking for your partner.',
    setupStatusWaiting: 'Connected to the server. Waiting for your partner to use the same pair code.',
    setupStatusPaired: 'Paired successfully.',
    setupStatusAuthError: 'The server rejected the connection. Check the Access Key.',
    setupStatusRoomFull: 'Two people are already connected with this pair code. You are queued for the next open spot.',
    serverUrlEmpty: 'Enter a server URL. For real use, prefer a public HTTPS URL.',
    serverUrlLocalhost: 'Only suitable for testing on the same computer.',
    serverUrlLan: 'Usually only suitable on the same Wi-Fi.',
    serverUrlPublicHttps: 'Works across different Wi-Fi / different networks.',
    serverUrlPublicHttp: 'Can connect, but a public HTTPS server URL is recommended for real use.',
    serverUrlInvalid: 'The server URL does not look valid.',
    localhostRemoteWarning: 'Do not use localhost for different devices, different Wi-Fi, or another country.',
    pairCodeGenerated: 'New pair code generated.',
    pairCodeCopied: 'Pair code copied.',
    pairCodeCopyFailed: 'Could not copy. Select the pair code manually.',
    minimizeWindow: 'Minimize',
    maximizeRoom: 'Maximize room',
    restoreRoom: 'Restore room',
    closeWindow: 'Close',
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
    connectionAuthError: 'Access denied',
    connectionRoomFull: 'Room full',
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
    roomOpacityLabel: 'Room opacity',
    petScaleLabel: 'Pet scale',
    dayBackgroundLabel: 'Day background',
    nightBackgroundLabel: 'Night background',
    resetAppearance: 'Reset appearance',
    appearanceReset: 'Appearance settings reset.',
    backgroundSaved: 'Background image saved locally.',
    backgroundTooLarge: 'That image is too large. Choose a smaller file.',
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

Object.assign(dictionary.zh, {
  setupTitle: '第一次設定',
  setupIntro: '用同一個伺服器網址和配對碼，就能和另一台電腦連在一起。',
  setupStepServer: '輸入 Server URL',
  setupStepPair: '產生或輸入 Pair Code',
  setupStepShare: '把 Pair Code 分享給夥伴',
  setupStepAccess: '只有伺服器要求時才輸入 Access Key',
  generatePairCode: '產生配對碼',
  copyPairCode: '複製配對碼',
  setupApplyConnect: '套用並連線',
  setupLater: '稍後設定',
  localhostWarning: '目前的伺服器網址只適合本機測試。不同 Wi-Fi 或不同國家需要公開 HTTPS 伺服器。',
  setupStatusReady: '準備好後按下套用並連線。',
  setupStatusConnecting: '正在連線並尋找夥伴。',
  setupStatusWaiting: '已連上伺服器，正在等待夥伴輸入相同配對碼。',
  setupStatusPaired: '已配對成功。',
  setupStatusAuthError: '伺服器拒絕連線，請確認 Access Key。',
  setupStatusRoomFull: '這個配對碼已有兩人連線；你會排隊等待空位。',
  serverUrlEmpty: '請輸入伺服器網址。實際使用建議使用公開 HTTPS 網址。',
  serverUrlLocalhost: '只適合在同一台電腦測試。',
  serverUrlLan: '通常只適合同一個 Wi-Fi。',
  serverUrlPublicHttps: '可用於不同 Wi-Fi / 不同網路。',
  serverUrlPublicHttp: '可連線，但實際使用建議改用公開 HTTPS 伺服器網址。',
  serverUrlInvalid: '伺服器網址格式看起來不正確。',
  localhostRemoteWarning: '如果要和不同裝置、不同 Wi-Fi 或不同國家的夥伴連線，請不要使用 localhost。',
  pairCodeGenerated: '已產生新的配對碼。',
  pairCodeCopied: '配對碼已複製。',
  pairCodeCopyFailed: '無法複製，請手動選取配對碼。',
  connectionAuthError: '金鑰錯誤',
  connectionRoomFull: '房間已滿',
  connectionPaired: '已配對',
  connectionPartnerDisconnected: '夥伴離線',
  connectionInvalidUrl: '網址無效',
  setupStatusPartnerDisconnected: '夥伴暫時離線；他回來後會自動重連。',
  setupStatusInvalidUrl: '請檢查伺服器網址，或改用公開 HTTPS 網址。',
  rateLimited: '動作太密集了，稍等一下再試。',
  payloadRejected: '伺服器拒絕了一個不正確的同步資料。'
});

Object.assign(dictionary.en, {
  connectionPaired: 'Paired',
  connectionPartnerDisconnected: 'Partner offline',
  connectionInvalidUrl: 'Invalid URL',
  setupStatusPartnerDisconnected: 'Your partner is offline for now. This app will reconnect when they return.',
  setupStatusInvalidUrl: 'Check the server URL, or use a public HTTPS URL for real remote pairing.',
  rateLimited: 'That was a bit too fast. Try again in a moment.',
  payloadRejected: 'The server rejected one invalid sync payload.'
});

const room = document.getElementById('room');
const dragHandle = document.getElementById('dragHandle');
const settingsButton = document.getElementById('settingsButton');
const minimizeWindowButton = document.getElementById('minimizeWindowButton');
const maximizeRoomButton = document.getElementById('maximizeRoomButton');
const closeWindowButton = document.getElementById('closeWindowButton');
const setupPanel = document.getElementById('setupPanel');
const setupServerUrlInput = document.getElementById('setupServerUrlInput');
const setupServerUrlHelper = document.getElementById('setupServerUrlHelper');
const setupPairCodeInput = document.getElementById('setupPairCodeInput');
const setupAccessKeyInput = document.getElementById('setupAccessKeyInput');
const generatePairCodeButton = document.getElementById('generatePairCodeButton');
const copyPairCodeButton = document.getElementById('copyPairCodeButton');
const setupApplyButton = document.getElementById('setupApplyButton');
const setupLaterButton = document.getElementById('setupLaterButton');
const setupWarning = document.getElementById('setupWarning');
const setupStatus = document.getElementById('setupStatus');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsButton = document.getElementById('closeSettingsButton');
const resetRoomButton = document.getElementById('resetRoomButton');
const quitButton = document.getElementById('quitButton');
const applyConnectionButton = document.getElementById('applyConnectionButton');
const serverUrlInput = document.getElementById('serverUrlInput');
const serverUrlHelper = document.getElementById('serverUrlHelper');
const pairCodeInput = document.getElementById('pairCodeInput');
const accessKeyInput = document.getElementById('accessKeyInput');
const shockedTextZhInput = document.getElementById('shockedTextZhInput');
const shockedTextEnInput = document.getElementById('shockedTextEnInput');
const savePetTextButton = document.getElementById('savePetTextButton');
const roomOpacityInput = document.getElementById('roomOpacityInput');
const roomOpacityValue = document.getElementById('roomOpacityValue');
const petScaleInput = document.getElementById('petScaleInput');
const petScaleValue = document.getElementById('petScaleValue');
const dayBackgroundInput = document.getElementById('dayBackgroundInput');
const nightBackgroundInput = document.getElementById('nightBackgroundInput');
const resetAppearanceButton = document.getElementById('resetAppearanceButton');
const connectionStatus = document.getElementById('connectionStatus');
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
const SETUP_DISMISSED_STORAGE_KEY = 'transparent-pet-room:setup-dismissed';
const PET_POSITION_STORAGE_KEY = 'transparent-pet-room:pet-positions';
const SHOCKED_TEXT_ZH_STORAGE_KEY = 'transparent-pet-room:shocked-text-zh';
const SHOCKED_TEXT_EN_STORAGE_KEY = 'transparent-pet-room:shocked-text-en';
const APPEARANCE_STORAGE_KEY = 'transparent-pet-room:appearance';
const MIN_WIDTH = 380;
const MIN_HEIGHT = 340;
const SCREEN_MARGIN = 16;
const DEFAULT_SERVER_URL = appConfig.defaultServerUrl;
const DEFAULT_PAIR_CODE = sanitizePairCode(appConfig.defaultPairCode) || generatePairCode();
const DEFAULT_ACCESS_KEY = appConfig.defaultAccessToken;
const APP_MODE = appConfig.appMode;
const SHOCKED_DURATION_MS = 3000;
const BUBBLE_DEFAULT_DURATION_MS = 5000;
const MAX_DISPLAY_MESSAGE_LENGTH = 600;
const MAX_BUBBLE_TEXT_LENGTH = 260;
const MAX_ACTION_TEXT_LENGTH = 80;
const IDLE_AFTER_MS = 3 * 60 * 1000;
const ACTIVE_THEME_CHECK_MS = 5 * 60 * 1000;
const LOW_POWER_THEME_CHECK_MS = 30 * 60 * 1000;
const ACTIVITY_RESCHEDULE_THROTTLE_MS = 5000;
const MAX_BACKGROUND_DATA_URL_LENGTH = 2_750_000;

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
let setupDismissed = localStorage.getItem(SETUP_DISMISSED_STORAGE_KEY) === 'true';
let connectionState = 'disconnected';
let isPaired = false;
let authRetryBlocked = false;
let currentTimeTheme = 'day';
let powerMode = 'active';
let socket = null;
let lastPassThrough = true;
let action = null;
let box = loadBox();
let restoreBox = null;
let isRoomMaximized = false;
let petPositions = loadPetPositions();
let appearance = loadAppearance();
let lastThemeMessage = null;
let lastActivityAt = Date.now();
let lastActivityScheduleAt = 0;
let idleTimer = null;
let themeTimer = null;
let petPositionFrame = 0;
let passThroughFrame = 0;
let partnerPetMoveFrame = 0;
let shouldSavePetPositionsAfterFrame = false;
let pendingPassThroughPoint = null;
let pendingPartnerPetPosition = null;
let pointerInsideRoom = false;
let lastPointerPoint = { x: -99999, y: -99999 };
let forceInteractiveUntil = 0;
let suppressPartnerClick = false;
let lastReconnectCheckAt = 0;
const bubbleTimers = new Map();
const customShockedText = loadShockedTexts();

if (!localStorage.getItem(PAIR_CODE_STORAGE_KEY) && pairCode) {
  localStorage.setItem(PAIR_CODE_STORAGE_KEY, pairCode);
}
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
  return t(key).replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, token) => sanitizeDisplayText(values[token] ?? '', 160));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setInputValueIfChanged(input, value) {
  const nextValue = String(value ?? '');
  if (input && input.value !== nextValue) {
    input.value = nextValue;
  }
}

function sanitizeDisplayText(value, maxLength = MAX_DISPLAY_MESSAGE_LENGTH) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, '')
    .trim()
    .slice(0, maxLength);
}

function sanitizePairCode(value) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase()
    .slice(0, 64);
}

function normalizePairCodeInput(value) {
  return sanitizePairCode(value) || DEFAULT_PAIR_CODE || generatePairCode();
}

function sanitizeActionName(value) {
  return sanitizeDisplayText(value, MAX_ACTION_TEXT_LENGTH).replace(/[^a-zA-Z0-9_:-]/g, '');
}

function generatePairCode() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return `pet-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

function parseIPv4(hostname) {
  const parts = String(hostname || '').split('.');
  if (parts.length !== 4) return null;
  const numbers = parts.map((part) => Number(part));
  return numbers.every((part) => Number.isInteger(part) && part >= 0 && part <= 255) ? numbers : null;
}

function isLanIPv4(parts) {
  if (!parts) return false;
  if (parts[0] === 10) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  return parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31;
}

function getServerUrlKind(value) {
  const raw = String(value || '').trim();
  if (!raw) return 'empty';

  try {
    const url = new URL(raw);
    const hostname = url.hostname.toLowerCase();
    const ipv4 = parseIPv4(hostname);

    if (hostname === 'localhost' || hostname === '0.0.0.0' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')) {
      return 'localhost';
    }

    if (isLanIPv4(ipv4)) {
      return 'lan';
    }

    if (url.protocol === 'https:') {
      return 'public_https';
    }

    if (url.protocol === 'http:') {
      return 'public_http';
    }

    return 'invalid';
  } catch {
    return 'invalid';
  }
}

function serverUrlHelperKey(kind) {
  if (kind === 'empty') return 'serverUrlEmpty';
  if (kind === 'localhost') return 'serverUrlLocalhost';
  if (kind === 'lan') return 'serverUrlLan';
  if (kind === 'public_https') return 'serverUrlPublicHttps';
  if (kind === 'public_http') return 'serverUrlPublicHttp';
  return 'serverUrlInvalid';
}

function canAttemptServerConnection(kind) {
  return kind === 'localhost' || kind === 'lan' || kind === 'public_https' || kind === 'public_http';
}

function updateServerUrlHelpers() {
  const setupKind = getServerUrlKind(setupServerUrlInput.value || serverUrl);
  const settingsKind = getServerUrlKind(serverUrlInput.value || serverUrl);

  setupServerUrlHelper.textContent = t(serverUrlHelperKey(setupKind));
  serverUrlHelper.textContent = t(serverUrlHelperKey(settingsKind));

  const setupIsLocalhost = setupKind === 'empty' || setupKind === 'localhost';
  setupWarning.hidden = !setupIsLocalhost;
  setupWarning.textContent = setupKind === 'localhost' ? t('localhostRemoteWarning') : t('serverUrlEmpty');
}

function setupStatusKey() {
  if (connectionState === 'auth_error') return 'setupStatusAuthError';
  if (connectionState === 'room_full') return 'setupStatusRoomFull';
  if (connectionState === 'invalid_url') return 'setupStatusInvalidUrl';
  if (connectionState === 'partner_disconnected') return 'setupStatusPartnerDisconnected';
  if (connectionState === 'waiting') return 'setupStatusWaiting';
  if (connectionState === 'connecting' || connectionState === 'reconnecting') return 'setupStatusConnecting';
  if (isPaired) return 'setupStatusPaired';
  return 'setupStatusReady';
}

function updateSetupPanel() {
  setupPanel.hidden = setupDismissed || isPaired;
  setupStatus.textContent = t(setupStatusKey());
  updateServerUrlHelpers();
}

function applySetupInputs() {
  setInputValueIfChanged(setupServerUrlInput, serverUrl);
  setInputValueIfChanged(setupPairCodeInput, pairCode);
  setInputValueIfChanged(setupAccessKeyInput, accessKey);
  updateSetupPanel();
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

function loadAppearance() {
  const fallback = {
    roomOpacity: 100,
    petScale: 100,
    dayBackground: '',
    nightBackground: ''
  };

  try {
    const saved = JSON.parse(localStorage.getItem(APPEARANCE_STORAGE_KEY));
    return {
      roomOpacity: clamp(Number(saved?.roomOpacity ?? fallback.roomOpacity), 0, 100),
      petScale: clamp(Number(saved?.petScale ?? fallback.petScale), 70, 180),
      dayBackground: typeof saved?.dayBackground === 'string' ? saved.dayBackground : '',
      nightBackground: typeof saved?.nightBackground === 'string' ? saved.nightBackground : ''
    };
  } catch {
    return fallback;
  }
}

function saveAppearance() {
  localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(appearance));
}

function cssUrl(value) {
  return `url("${String(value).replace(/"/g, '\\"')}")`;
}

function applyAppearance() {
  const opacity = clamp(Number(appearance.roomOpacity), 0, 100);
  const scale = clamp(Number(appearance.petScale), 70, 180);

  room.style.setProperty('--room-shell-opacity', String(opacity / 100));
  room.style.setProperty('--pet-scale', String(scale / 100));
  room.dataset.shellHidden = opacity === 0 ? 'true' : 'false';

  if (appearance.dayBackground) {
    room.style.setProperty('--room-day-image', cssUrl(appearance.dayBackground));
  } else {
    room.style.removeProperty('--room-day-image');
  }

  if (appearance.nightBackground) {
    room.style.setProperty('--room-night-image', cssUrl(appearance.nightBackground));
  } else {
    room.style.removeProperty('--room-night-image');
  }

  const hasCustomImage = currentTimeTheme === 'night' ? Boolean(appearance.nightBackground) : Boolean(appearance.dayBackground);
  room.dataset.customBg = hasCustomImage ? 'true' : 'false';

  setInputValueIfChanged(roomOpacityInput, opacity);
  roomOpacityValue.textContent = `${opacity}%`;
  setInputValueIfChanged(petScaleInput, scale);
  petScaleValue.textContent = `${scale}%`;

  schedulePetPositionRefresh();
}

function readImageFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result || '')));
    reader.addEventListener('error', () => reject(reader.error || new Error('file_read_failed')));
    reader.readAsDataURL(file);
  });
}

async function handleBackgroundUpload(theme, input) {
  markActivity(`${theme}-background`, { force: true });
  const file = input.files?.[0];
  if (!file) return;

  try {
    const dataUrl = await readImageFileAsDataUrl(file);

    if (!dataUrl.startsWith('data:image/') || dataUrl.length > MAX_BACKGROUND_DATA_URL_LENGTH) {
      input.value = '';
      pushMessage('system', { key: 'backgroundTooLarge' });
      return;
    }

    if (theme === 'night') {
      appearance.nightBackground = dataUrl;
    } else {
      appearance.dayBackground = dataUrl;
    }

    applyAppearance();
    saveAppearance();
    pushMessage('system', { key: 'backgroundSaved' });
  } catch {
    input.value = '';
    pushMessage('system', { key: 'backgroundTooLarge' });
  }
}

function saveShockedTexts() {
  customShockedText.zh = sanitizeDisplayText(shockedTextZhInput.value, 80);
  customShockedText.en = sanitizeDisplayText(shockedTextEnInput.value, 80);
  localStorage.setItem(SHOCKED_TEXT_ZH_STORAGE_KEY, customShockedText.zh);
  localStorage.setItem(SHOCKED_TEXT_EN_STORAGE_KEY, customShockedText.en);
}

function applyPetTextInputs() {
  setInputValueIfChanged(shockedTextZhInput, customShockedText.zh);
  setInputValueIfChanged(shockedTextEnInput, customShockedText.en);
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

function schedulePetPositionRefresh({ save = false } = {}) {
  shouldSavePetPositionsAfterFrame = shouldSavePetPositionsAfterFrame || save;
  if (petPositionFrame) return;

  petPositionFrame = requestAnimationFrame(() => {
    petPositionFrame = 0;
    applyPetPositions();
    if (shouldSavePetPositionsAfterFrame) {
      shouldSavePetPositionsAfterFrame = false;
      savePetPositions();
    }
  });
}

function schedulePartnerPetPosition(position) {
  pendingPartnerPetPosition = position;
  if (partnerPetMoveFrame) return;

  partnerPetMoveFrame = requestAnimationFrame(() => {
    partnerPetMoveFrame = 0;
    if (!pendingPartnerPetPosition) return;
    setPetWalkThenIdle('partner', 900);
    petPositions.partner = positionPetElement(petPartner, pendingPartnerPetPosition);
    pendingPartnerPetPosition = null;
  });
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
  const cleanText = sanitizeDisplayText(text, MAX_BUBBLE_TEXT_LENGTH);
  if (!cleanText) return;

  bubble.textContent = cleanText;
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
  const cleanText = sanitizeDisplayText(text || t('shockedBubbleDefault'), 120);
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
  if (inside !== pointerInsideRoom) {
    pointerInsideRoom = inside;
    setMousePassThrough(!inside);
  }
}

function scheduleMousePassThroughForPoint(x, y) {
  pendingPassThroughPoint = { x, y };
  if (passThroughFrame) return;

  passThroughFrame = requestAnimationFrame(() => {
    passThroughFrame = 0;
    if (!pendingPassThroughPoint) return;
    const point = pendingPassThroughPoint;
    pendingPassThroughPoint = null;
    updateMousePassThroughForPoint(point.x, point.y);
  });
}

function resetBox() {
  isRoomMaximized = false;
  restoreBox = null;
  box = getDefaultBox();
  applyBox();
  saveBox();
  updateMaximizeButton();
}

function getMaximizedBox() {
  return {
    x: SCREEN_MARGIN,
    y: SCREEN_MARGIN,
    width: window.innerWidth - SCREEN_MARGIN * 2,
    height: window.innerHeight - SCREEN_MARGIN * 2
  };
}

function updateMaximizeButton() {
  const key = isRoomMaximized ? 'restoreRoom' : 'maximizeRoom';
  maximizeRoomButton.textContent = isRoomMaximized ? '❐' : '□';
  maximizeRoomButton.setAttribute('title', t(key));
  maximizeRoomButton.setAttribute('aria-label', t(key));
}

function toggleRoomMaximize() {
  markActivity('toggle-room-maximize', { force: true });

  if (isRoomMaximized) {
    box = restoreBox || getDefaultBox();
    restoreBox = null;
    isRoomMaximized = false;
  } else {
    restoreBox = { ...box };
    box = getMaximizedBox();
    isRoomMaximized = true;
  }

  applyBox();
  applyPetPositions();
  saveBox();
  updateMaximizeButton();
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
  applyAppearance();
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
  if (connectionState === 'auth_error') return 'connectionAuthError';
  if (connectionState === 'room_full') return 'connectionRoomFull';
  if (connectionState === 'invalid_url') return 'connectionInvalidUrl';
  if (connectionState === 'partner_disconnected') return 'connectionPartnerDisconnected';
  if (connectionState === 'connected') return 'connectionConnected';
  if (connectionState === 'paired') return 'connectionPaired';
  if (connectionState === 'waiting') return 'connectionWaiting';
  if (connectionState === 'connecting') return 'connectionConnecting';
  if (connectionState === 'reconnecting') return 'connectionReconnecting';
  return 'connectionDisconnected';
}

function setConnectionState(nextState) {
  connectionState = nextState;
  if (nextState === 'paired' || nextState === 'connected') {
    room.dataset.connection = 'connected';
  } else if (nextState === 'waiting' || nextState === 'connecting' || nextState === 'reconnecting' || nextState === 'room_full' || nextState === 'partner_disconnected') {
    room.dataset.connection = nextState;
  } else {
    room.dataset.connection = nextState === 'auth_error' || nextState === 'invalid_url' ? nextState : 'disconnected';
  }
  applyConnectionText();
  updateSetupPanel();
}

function applyConnectionText() {
  connectionText.textContent = t(connectionTextKey());
  const modeText = t(serverUrlHelperKey(getServerUrlKind(serverUrl)));
  const label = `${t('connectionTooltip')}: ${connectionText.textContent}. ${modeText}`;
  connectionStatus.setAttribute('title', label);
  connectionStatus.setAttribute('aria-label', label);
}

function applyConnectionInputs() {
  setInputValueIfChanged(serverUrlInput, serverUrl);
  setInputValueIfChanged(pairCodeInput, pairCode);
  setInputValueIfChanged(accessKeyInput, accessKey);
  applySetupInputs();
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
  updateMaximizeButton();
  updateSetupPanel();
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
  return sanitizeDisplayText(message.text || '');
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
  const safeMessage = { sender, ...message };
  if (typeof safeMessage.text !== 'undefined') {
    safeMessage.text = sanitizeDisplayText(safeMessage.text);
  }

  messages.push(safeMessage);

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

function isSocketConnecting() {
  return Boolean(socket && !socket.connected && socket.io?.engine?.readyState === 'opening');
}

function connectSocket({ announce = false } = {}) {
  if (authRetryBlocked) {
    setConnectionState('auth_error');
    return;
  }

  const urlKind = getServerUrlKind(serverUrl);
  if (!canAttemptServerConnection(urlKind)) {
    isPaired = false;
    setConnectionState(urlKind === 'invalid' ? 'invalid_url' : 'disconnected');
    if (announce) pushMessage('system', { key: serverUrlHelperKey(urlKind) });
    return;
  }

  if (socket?.connected || isSocketConnecting()) {
    return;
  }

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
      appMode: APP_MODE,
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
    isPaired = false;
    setConnectionState('connecting');
    pushMessage('system', { key: 'connectionConnectedMessage' });
  });

  socket.on('server_hello', () => {
    noteSocketActivity();
    // Reserved for future protocol negotiation.
  });

  socket.on('waiting_for_partner', () => {
    noteSocketActivity();
    isPaired = false;
    setConnectionState('waiting');
    pushMessage('system', { key: 'waitingForPartner' });
  });

  socket.on('paired', () => {
    noteSocketActivity();
    isPaired = true;
    setConnectionState('paired');
    pushMessage('system', { key: 'partnerJoined' });
    setTimeout(() => emitMyPetPosition({ quiet: true }), 120);
  });

  socket.on('partner_disconnected', (payload = {}) => {
    noteSocketActivity();
    isPaired = false;
    setConnectionState('partner_disconnected');
    pushMessage('system', {
      key: 'partnerLeft',
      values: { reason: payload.reason || 'disconnect' }
    });
  });

  socket.on('auth_error', () => {
    noteSocketActivity();
    authRetryBlocked = true;
    isPaired = false;
    setConnectionState('auth_error');
    pushMessage('system', { key: 'unauthorizedServer' });
    socket?.disconnect();
  });

  socket.on('room_full', () => {
    noteSocketActivity();
    isPaired = false;
    setConnectionState('room_full');
    pushMessage('system', { key: 'setupStatusRoomFull' });
  });

  socket.on('not_paired', () => {
    noteSocketActivity();
    pushMessage('system', { key: 'notPaired' });
  });

  socket.on('payload_error', (payload = {}) => {
    noteSocketActivity();
    pushMessage('system', { key: 'payloadRejected' });
  });

  socket.on('rate_limited', () => {
    noteSocketActivity();
    pushMessage('system', { key: 'rateLimited' });
  });

  socket.on('send_msg', (payload = {}) => {
    noteSocketActivity();
    const text = sanitizeDisplayText(payload.text, MAX_DISPLAY_MESSAGE_LENGTH);
    if (!text) return;
    pushMessage('partner', { text });
    showPetBubble('partner', text);
  });

  socket.on('pet_action', (payload = {}) => {
    noteSocketActivity();
    const incomingAction = sanitizeActionName(payload.action);
    const incomingTarget = sanitizeActionName(payload.target);
    const incomingPet = sanitizeActionName(payload.pet);

    if (incomingAction === 'poke' && (incomingTarget === 'pet_me' || incomingPet === 'pet_me' || !incomingTarget)) {
      pushMessage('partner', { key: 'pokeReceived' });
      triggerMyShockedReaction({ sendAck: true });
      return;
    }

    if (incomingAction === 'poke_reaction') {
      const meta = typeof payload.meta === 'object' && payload.meta !== null ? payload.meta : {};
      const rawDuration = Number(meta.duration);
      const duration = Number.isFinite(rawDuration) ? clamp(rawDuration, 1200, 6000) : SHOCKED_DURATION_MS;
      triggerPartnerShockedPreview(sanitizeDisplayText(meta.text, 120) || t('shockedBubbleDefault'), { duration });
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
    const x = clamp(Number(payload.x), 0, 100);
    const y = clamp(Number(payload.y), 0, 100);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    schedulePartnerPetPosition({ x, y });
  });

  socket.on('disconnect', (reason) => {
    noteSocketActivity();
    isPaired = false;
    if (connectionState !== 'auth_error') {
      setConnectionState('disconnected');
    } else {
      return;
    }
    pushMessage('system', {
      key: 'socketDisconnected',
      values: { reason }
    });
  });

  socket.on('connect_error', (error) => {
    noteSocketActivity();
    isPaired = false;
    const reason = error?.message || 'connect_error';
    const isAuthError = reason === 'auth_error' || reason === 'unauthorized';
    if (isAuthError) {
      authRetryBlocked = true;
      socket?.disconnect();
    }
    setConnectionState(isAuthError ? 'auth_error' : 'disconnected');
    pushMessage('system', {
      key: isAuthError ? 'unauthorizedServer' : 'socketError',
      values: { reason }
    });
  });

  socket.on('server_shutdown', () => {
    noteSocketActivity();
    isPaired = false;
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
    setConnectionState(isPaired ? 'paired' : 'connecting');
  });

  socket.io.on('reconnect_error', () => {
    setConnectionState('reconnecting');
  });
}

function reconnectIfNeeded(reason = 'resume') {
  const now = Date.now();
  if (now - lastReconnectCheckAt < 1500) return;
  lastReconnectCheckAt = now;

  if (authRetryBlocked || !String(serverUrl || '').trim()) {
    if (!String(serverUrl || '').trim()) setConnectionState('disconnected');
    return;
  }

  if (socket?.connected || isSocketConnecting()) {
    return;
  }

  setConnectionState('reconnecting');
  connectSocket({ announce: reason === 'manual' });
}

function saveConnectionSettings(nextServerUrl, nextPairCode, nextAccessKey) {
  serverUrl = nextServerUrl;
  pairCode = nextPairCode;
  accessKey = nextAccessKey;
  localStorage.setItem(SERVER_URL_STORAGE_KEY, serverUrl);
  localStorage.setItem(PAIR_CODE_STORAGE_KEY, pairCode);
  localStorage.setItem(ACCESS_KEY_STORAGE_KEY, accessKey);
  applyConnectionInputs();
}

function saveConnectionSettingsAndReconnect(source = 'settings') {
  const sourceServerUrlInput = source === 'setup' ? setupServerUrlInput : serverUrlInput;
  const sourcePairCodeInput = source === 'setup' ? setupPairCodeInput : pairCodeInput;
  const sourceAccessKeyInput = source === 'setup' ? setupAccessKeyInput : accessKeyInput;

  const nextServerUrl = sourceServerUrlInput.value.trim() || DEFAULT_SERVER_URL;
  const nextPairCode = normalizePairCodeInput(sourcePairCodeInput.value);
  const nextAccessKey = sourceAccessKeyInput.value.trim();

  saveConnectionSettings(nextServerUrl, nextPairCode, nextAccessKey);
  authRetryBlocked = false;
  isPaired = false;
  disconnectSocket();

  const urlKind = getServerUrlKind(nextServerUrl);
  if (urlKind === 'localhost') {
    pushMessage('system', { key: 'localhostRemoteWarning' });
  } else if (urlKind === 'public_http' || urlKind === 'empty') {
    pushMessage('system', { key: serverUrlHelperKey(urlKind) });
  }

  pushMessage('system', { key: 'connectionSettingsSaved' });
  connectSocket({ announce: true });
}


function startPetDrag(target, event) {
  if (event.button !== 0) return;
  markActivity('pet-drag-start', { force: true });

  const element = target === 'partner' ? petPartner : petMe;

  event.preventDefault();
  event.stopPropagation();
  setMousePassThrough(false);
  element.classList.add('is-dragging');
  setPetState(target, PET_STATES.WALK, { force: true });

  const stageRect = petStageRect();
  action = {
    type: 'pet-drag',
    petTarget: target,
    pointerId: event.pointerId,
    target: element,
    startX: event.clientX,
    startY: event.clientY,
    stageWidth: stageRect.width || 1,
    stageHeight: stageRect.height || 1,
    startPosition: { ...petPositions[target] },
    moved: false
  };

  element.setPointerCapture(event.pointerId);
}

function updatePetDrag(event) {
  const dxPercent = ((event.clientX - action.startX) / action.stageWidth) * 100;
  const dyPercent = ((event.clientY - action.startY) / action.stageHeight) * 100;

  if (Math.abs(event.clientX - action.startX) > 3 || Math.abs(event.clientY - action.startY) > 3) {
    action.moved = true;
  }

  const target = action.petTarget === 'partner' ? 'partner' : 'me';
  const element = target === 'partner' ? petPartner : petMe;

  petPositions[target] = positionPetElement(element, {
    x: action.startPosition.x + dxPercent,
    y: action.startPosition.y + dyPercent
  });
}

function finishPetDrag(finishedAction) {
  const target = finishedAction.petTarget === 'partner' ? 'partner' : 'me';
  const element = target === 'partner' ? petPartner : petMe;

  element.classList.remove('is-dragging');
  setPetState(target, PET_STATES.IDLE, { force: true });
  petPositions[target] = positionPetElement(element, petPositions[target]);
  savePetPositions();

  if (target === 'me') {
    emitMyPetPosition();
  }

  if (!finishedAction.moved) {
    if (target === 'partner') {
      suppressPartnerClick = true;
      pokePartnerPet();
    } else {
      popPet(petMe);
      showPetBubble('me', t('petMeClick'));
      pushMessage('pet_me', { key: 'petMeClick' });
    }
  } else if (target === 'partner') {
    suppressPartnerClick = true;
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
  scheduleMousePassThroughForPoint(event.clientX, event.clientY);
}

settingsButton.addEventListener('click', () => {
  markActivity('settings', { force: true });
  forceRoomInteractive(1200);
  settingsPanel.hidden = !settingsPanel.hidden;
  setMousePassThrough(false);
});

minimizeWindowButton.addEventListener('click', () => {
  markActivity('minimize-window', { force: true });
  api.minimize();
});

maximizeRoomButton.addEventListener('click', () => {
  toggleRoomMaximize();
});

closeWindowButton.addEventListener('click', () => {
  api.quit();
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

serverUrlInput.addEventListener('input', updateServerUrlHelpers);
setupServerUrlInput.addEventListener('input', updateSetupPanel);
setupPairCodeInput.addEventListener('input', updateSetupPanel);

setupPairCodeInput.addEventListener('blur', () => {
  setupPairCodeInput.value = normalizePairCodeInput(setupPairCodeInput.value);
});

generatePairCodeButton.addEventListener('click', () => {
  markActivity('generate-pair-code', { force: true });
  setupPairCodeInput.value = generatePairCode();
  pairCodeInput.value = setupPairCodeInput.value;
  pushMessage('system', { key: 'pairCodeGenerated' });
  updateSetupPanel();
});

copyPairCodeButton.addEventListener('click', async () => {
  markActivity('copy-pair-code', { force: true });
  const normalized = normalizePairCodeInput(setupPairCodeInput.value || pairCode);
  setupPairCodeInput.value = normalized;
  pairCodeInput.value = normalized;

  try {
    await navigator.clipboard.writeText(normalized);
    pushMessage('system', { key: 'pairCodeCopied' });
  } catch {
    setupPairCodeInput.select();
    pushMessage('system', { key: 'pairCodeCopyFailed' });
  }
});

setupApplyButton.addEventListener('click', () => {
  markActivity('setup-apply', { force: true });
  setupDismissed = false;
  localStorage.setItem(SETUP_DISMISSED_STORAGE_KEY, 'false');
  saveConnectionSettingsAndReconnect('setup');
});

setupLaterButton.addEventListener('click', () => {
  markActivity('setup-later', { force: true });
  setupDismissed = true;
  localStorage.setItem(SETUP_DISMISSED_STORAGE_KEY, 'true');
  updateSetupPanel();
});


savePetTextButton.addEventListener('click', () => {
  markActivity('save-pet-text', { force: true });
  saveShockedTexts();
  pushMessage('system', { key: 'petTextSaved' });
  messageInput.focus();
});

roomOpacityInput.addEventListener('input', () => {
  markActivity('room-opacity', { force: true });
  appearance.roomOpacity = clamp(Number(roomOpacityInput.value), 0, 100);
  applyAppearance();
  saveAppearance();
});

petScaleInput.addEventListener('input', () => {
  markActivity('pet-scale', { force: true });
  appearance.petScale = clamp(Number(petScaleInput.value), 70, 180);
  applyAppearance();
  saveAppearance();
});

dayBackgroundInput.addEventListener('change', () => {
  handleBackgroundUpload('day', dayBackgroundInput);
});

nightBackgroundInput.addEventListener('change', () => {
  handleBackgroundUpload('night', nightBackgroundInput);
});

resetAppearanceButton.addEventListener('click', () => {
  markActivity('reset-appearance', { force: true });
  appearance = {
    roomOpacity: 100,
    petScale: 100,
    dayBackground: '',
    nightBackground: ''
  };
  dayBackgroundInput.value = '';
  nightBackgroundInput.value = '';
  applyAppearance();
  saveAppearance();
  pushMessage('system', { key: 'appearanceReset' });
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
  const text = sanitizeDisplayText(messageInput.value, MAX_DISPLAY_MESSAGE_LENGTH);
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

petMe.addEventListener('pointerdown', (event) => startPetDrag('me', event));
petMe.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  popPet(petMe);
  showPetBubble('me', t('petMeClick'));
  pushMessage('pet_me', { key: 'petMeClick' });
});


petPartner.addEventListener('pointerdown', (event) => startPetDrag('partner', event));
petPartner.addEventListener('click', () => {
  if (suppressPartnerClick) {
    suppressPartnerClick = false;
    return;
  }

  pokePartnerPet();
});
petPartner.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  pokePartnerPet();
});

dragHandle.addEventListener('pointerdown', startDrag);
resizeHandles.forEach((handle) => handle.addEventListener('pointerdown', startResize));

window.addEventListener('pointermove', (event) => {
  if (!action) return;

  markActivity('pointer-move');
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
  box = isRoomMaximized ? getMaximizedBox() : clampBox(box);
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

window.addEventListener('focus', () => {
  markActivity('window-focus', { force: true });
  reconnectIfNeeded('focus');
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    markActivity('visibility', { force: true });
    reconnectIfNeeded('visibility');
  }
});

window.addEventListener('online', () => {
  markActivity('online', { force: true });
  reconnectIfNeeded('online');
});

window.addEventListener('offline', () => {
  isPaired = false;
  setConnectionState('disconnected');
});

applyBox();
schedulePetPositionRefresh({ save: true });
applyConnectionInputs();
applyPetTextInputs();
currentTimeTheme = getTimeTheme();
room.dataset.theme = currentTimeTheme;
document.body.dataset.theme = currentTimeTheme;
applyAppearance();
applyI18n();
setPetState('me', PET_STATES.IDLE, { force: true });
setPetState('partner', PET_STATES.IDLE, { force: true });
setPowerMode('active');
setMousePassThrough(true);
scheduleIdleCheck();
scheduleThemeUpdate();
connectSocket({ announce: true });
