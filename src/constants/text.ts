/**
 * Application text constants in Amharic
 */

export const AppText = {
  // Common
  Common: {
    LOADING: 'እባክዎ ይጠብቁ...',
    ERROR: 'ይቅርታ፣ ችግር ተፈጥሯል። እባክዎ ቆይተው እንደገና ይሞክሩ።',
    COPY: 'ቅዳ',
    COPIED: 'ተቀድቷል',
  },

  // Header
  Header: {
    TITLE: 'ባሻ',
    TOGGLE_SIDEBAR: 'ሳይድባር አሳይ/ደብቅ',
  },

  // Sidebar
  Sidebar: {
    CHAT_HISTORY: 'የውይይት ታሪክ',
    NEW_CHAT: 'አዲስ ውይይት ጀምር',
    DEFAULT_CHAT_NAME: 'አዲስ ውይይት',
    DATE_GROUPS: {
      TODAY: 'ዛሬ',
      YESTERDAY: 'ትላንት',
      OLDER: 'ሌላ ቀን',
    },
  },

  // Settings
  Settings: {
    TITLE: 'ቅንብሮች',
    BACK: 'ተመለስ',
    THEME: {
      LABEL: 'ጭብጥ',
      LIGHT: 'ብርሃን',
      DARK: 'ጨለማ',
    },
    FONT_SIZE: {
      LABEL: 'የፊደል መጠን',
      SMALL: 'ትንሽ',
      MEDIUM: 'መካከለኛ',
      LARGE: 'ትልቅ',
    },
    LANGUAGE: {
      LABEL: 'ቋንቋ',
      AMHARIC: 'አማርኛ',
      ENGLISH: 'English',
    },
  },

  // Chat
  Chat: {
    WELCOME_MESSAGE: 'እንኳን ደህና መጡ! ጥያቄዎን በአማርኛ ይጻፉ።',
    INPUT_PLACEHOLDER: 'በአማርኛ ይጻፉ...',
  },

  // Error Messages
  Errors: {
    API_RATE_LIMIT: 'ይቅርታ፣ በአሁኑ ጊዜ ብዙ ጥያቄዎች አሉ። እባክዎ ጥቂት ቆይተው ይሞክሩ።',
    INVALID_REQUEST: 'ይቅርታ፣ ጥያቄው ትክክል አይደለም። እባክዎ በተለየ መልኩ ይሞክሩ።',
    AUTH_ERROR: 'ይቅርታ፣ የተጠቃሚ ፈቃድ ችግር አለ። እባክዎ እንደገና ይሞክሩ።',
    API_KEY_ERROR: 'ይቅርታ፣ የAPI ቁልፍ ችግር አለ። እባክዎ አስተዳዳሪውን ያነጋግሩ።',
    UNKNOWN_MODEL: 'ይቅርታ፣ ያልታወቀ ሞዴል። እባክዎ ሌላ ሞዴል ይምረጡ።',
    NO_RESPONSE: 'ይቅርታ፣ ምላሽ ማግኘት አልቻልኩም።',
  },
} as const;