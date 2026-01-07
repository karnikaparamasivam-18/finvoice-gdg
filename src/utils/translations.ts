import { Language } from '@/store/appStore';

type TranslationKeys = {
  // Welcome
  welcome: string;
  selectLanguage: string;
  continue: string;

  // Setup
  groupSetup: string;
  groupName: string;
  numberOfMembers: string;
  meetingFrequency: string;
  weekly: string;
  monthly: string;
  firstMeetingDate: string;
  contributionAmount: string;
  next: string;
  back: string;

  // Member Registration
  memberRegistration: string;
  memberName: string;
  memberAddress: string;
  addMember: string;
  membersAdded: string;
  finishSetup: string;

  // Home
  home: string;
  totalBalance: string;
  contribution: string;
  tapToSpeak: string;
  recording: string;
  speakCommand: string;
  exampleCommands: string;
  updated: string;
  added: string;
  loanTaken: string;
  repayment: string;

  // Loans
  loans: string;
  loanDetails: string;
  memberNameLabel: string;
  loanAmount: string;
  interestRate: string;
  repaymentHistory: string;
  noLoans: string;
  totalOutstanding: string;

  // Summary
  summary: string;
  overallSummary: string;
  balance: string;
  loan: string;
  noMembers: string;

  // Meetings
  meetings: string;
  upcomingMeetings: string;
  nextMeeting: string;
  meetingSchedule: string;

  // Navigation
  dashboard: string;
  settings: string;
  logout: string;

  // Common
  rupees: string;
  members: string;
  of: string;

  // Manual Entry
  manualEntry: string;
  addBalance: string;
  issueLoan: string;
  recordRepayment: string;
  selectMember: string;
  amount: string;
  chooseMember: string;
  enterAmount: string;
  loanAmountLabel: string;
  interestRateLabel: string;
  repaymentAmount: string;
  adding: string;
  processing: string;
  recordingButton: string;

  // Transaction History
  transactionHistory: string;
  balanceAdded: string;
  loanIssued: string;
  edit: string;
  delete: string;
  deleteTransaction: string;
  editTransaction: string;
  saveChanges: string;
  cancel: string;
};

const translations: Record<Language, TranslationKeys> = {
  en: {
    welcome: 'Welcome to',
    selectLanguage: 'Select your preferred language',
    continue: 'Continue',

    groupSetup: 'Group Setup',
    groupName: 'Self Help Group Name',
    numberOfMembers: 'Number of Members',
    meetingFrequency: 'Meeting Frequency',
    weekly: 'Weekly',
    monthly: 'Monthly',
    firstMeetingDate: 'First Meeting Date',
    contributionAmount: 'Contribution Amount (₹)',
    next: 'Next',
    back: 'Back',

    memberRegistration: 'Member Registration',
    memberName: 'Member Name',
    memberAddress: 'Address',
    addMember: 'Add Member',
    membersAdded: 'Members Added',
    finishSetup: 'Finish Setup',

    home: 'Home',
    totalBalance: 'Total Balance',
    contribution: 'Contribution',
    tapToSpeak: 'Tap to speak',
    recording: 'Recording...',
    speakCommand: 'Speak your command',
    exampleCommands: 'Examples: "Latha add 500" or "Loan taken by Rani 5000" or "Rani repayment 1000"',
    updated: 'Updated',
    added: 'added',
    loanTaken: 'Loan taken by',
    repayment: 'Repayment by',

    loans: 'Loans',
    loanDetails: 'Loan Details',
    memberNameLabel: 'Member',
    loanAmount: 'Loan Amount',
    interestRate: 'Interest Rate',
    repaymentHistory: 'Repayment History',
    noLoans: 'No active loans',
    totalOutstanding: 'Total Outstanding',

    summary: 'Summary',
    overallSummary: 'Overall Summary',
    balance: 'Balance',
    loan: 'Loan',
    noMembers: 'No members yet',

    meetings: 'Meetings',
    upcomingMeetings: 'Upcoming Meetings',
    nextMeeting: 'Next Meeting',
    meetingSchedule: 'Meeting Schedule',

    dashboard: 'Dashboard',
    settings: 'Settings',
    logout: 'Reset App',

    rupees: '₹',
    members: 'members',
    of: 'of',

    manualEntry: 'Manual Entry',
    addBalance: 'Add Balance',
    issueLoan: 'Issue Loan',
    recordRepayment: 'Record Repayment',
    selectMember: 'Select Member',
    amount: 'Amount',
    chooseMember: 'Choose a member',
    enterAmount: 'Enter amount',
    loanAmountLabel: 'Loan Amount',
    interestRateLabel: 'Interest Rate',
    repaymentAmount: 'Repayment Amount',
    adding: 'Adding...',
    processing: 'Processing...',
    recordingButton: 'Recording...',

    transactionHistory: 'Transaction History',
    balanceAdded: 'Balance Added',
    loanIssued: 'Loan Issued',
    edit: 'Edit',
    delete: 'Delete',
    deleteTransaction: 'Delete Transaction?',
    editTransaction: 'Edit Transaction',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
  },

  ta: {
    welcome: 'வரவேற்கிறோம்',
    selectLanguage: 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
    continue: 'தொடரவும்',

    groupSetup: 'குழு அமைப்பு',
    groupName: 'சுய உதவி குழு பெயர்',
    numberOfMembers: 'உறுப்பினர்களின் எண்ணிக்கை',
    meetingFrequency: 'கூட்ட அதிர்வெண்',
    weekly: 'வாராந்திர',
    monthly: 'மாதாந்திர',
    firstMeetingDate: 'முதல் கூட்ட தேதி',
    contributionAmount: 'பங்களிப்பு தொகை (₹)',
    next: 'அடுத்து',
    back: 'பின்',

    memberRegistration: 'உறுப்பினர் பதிவு',
    memberName: 'உறுப்பினர் பெயர்',
    memberAddress: 'முகவரி',
    addMember: 'உறுப்பினரைச் சேர்',
    membersAdded: 'உறுப்பினர்கள் சேர்க்கப்பட்டனர்',
    finishSetup: 'அமைப்பை முடிக்கவும்',

    home: 'முகப்பு',
    totalBalance: 'மொத்த இருப்பு',
    contribution: 'பங்களிப்பு',
    tapToSpeak: 'பேச தட்டவும்',
    recording: 'பதிவு செய்கிறது...',
    speakCommand: 'உங்கள் கட்டளையைப் பேசுங்கள்',
    exampleCommands: 'எடுத்துக்காட்டுகள்: "லதா 500 சேர்" அல்லது "ராணி கடன் 5000" அல்லது "ராணி திருப்பி 1000"',
    updated: 'புதுப்பிக்கப்பட்டது',
    added: 'சேர்க்கப்பட்டது',
    loanTaken: 'கடன் எடுத்தார்',
    repayment: 'திருப்பிச் செலுத்தல்',

    loans: 'கடன்கள்',
    loanDetails: 'கடன் விவரங்கள்',
    memberNameLabel: 'உறுப்பினர்',
    loanAmount: 'கடன் தொகை',
    interestRate: 'வட்டி விகிதம்',
    repaymentHistory: 'திருப்பிச் செலுத்தல் வரலாறு',
    noLoans: 'செயலில் கடன்கள் இல்லை',
    totalOutstanding: 'மொத்த நிலுவை',

    summary: 'சுருக்கம்',
    overallSummary: 'ஒட்டுமொத்த சுருக்கம்',
    balance: 'இருப்பு',
    loan: 'கடன்',
    noMembers: 'இன்னும் உறுப்பினர்கள் இல்லை',

    meetings: 'கூட்டங்கள்',
    upcomingMeetings: 'வரவிருக்கும் கூட்டங்கள்',
    nextMeeting: 'அடுத்த கூட்டம்',
    meetingSchedule: 'கூட்ட அட்டவணை',

    dashboard: 'டாஷ்போர்டு',
    settings: 'அமைப்புகள்',
    logout: 'ஆப்பை மீட்டமை',

    rupees: '₹',
    members: 'உறுப்பினர்கள்',
    of: 'இல்',

    manualEntry: 'கைமுறை உள்ளீடு',
    addBalance: 'இருப்பு சேர்',
    issueLoan: 'கடன் வழங்கு',
    recordRepayment: 'திருப்பிச் செலுத்தல் பதிவு',
    selectMember: 'உறுப்பினரைத் தேர்ந்தெடு',
    amount: 'தொகை',
    chooseMember: 'உறுப்பினரைத் தேர்வு செய்க',
    enterAmount: 'தொகையை உள்ளிடவும்',
    loanAmountLabel: 'கடன் தொகை',
    interestRateLabel: 'வட்டி விகிதம்',
    repaymentAmount: 'திருப்பிச் செலுத்தும் தொகை',
    adding: 'சேர்க்கிறது...',
    processing: 'செயலாக்குகிறது...',
    recordingButton: 'பதிவு செய்கிறது...',

    transactionHistory: 'பரிவர்த்தனை வரலாறு',
    balanceAdded: 'இருப்பு சேர்க்கப்பட்டது',
    loanIssued: 'கடன் வழங்கப்பட்டது',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    deleteTransaction: 'பரிவர்த்தனையை நீக்கவா?',
    editTransaction: 'பரிவர்த்தனையைத் திருத்து',
    saveChanges: 'மாற்றங்களைச் சேமி',
    cancel: 'ரத்து செய்',
  },

  hi: {
    welcome: 'स्वागत है',
    selectLanguage: 'अपनी पसंदीदा भाषा चुनें',
    continue: 'जारी रखें',

    groupSetup: 'समूह सेटअप',
    groupName: 'स्वयं सहायता समूह का नाम',
    numberOfMembers: 'सदस्यों की संख्या',
    meetingFrequency: 'बैठक की आवृत्ति',
    weekly: 'साप्ताहिक',
    monthly: 'मासिक',
    firstMeetingDate: 'पहली बैठक की तारीख',
    contributionAmount: 'योगदान राशि (₹)',
    next: 'अगला',
    back: 'पीछे',

    memberRegistration: 'सदस्य पंजीकरण',
    memberName: 'सदस्य का नाम',
    memberAddress: 'पता',
    addMember: 'सदस्य जोड़ें',
    membersAdded: 'सदस्य जोड़े गए',
    finishSetup: 'सेटअप समाप्त करें',

    home: 'होम',
    totalBalance: 'कुल शेष',
    contribution: 'योगदान',
    tapToSpeak: 'बोलने के लिए टैप करें',
    recording: 'रिकॉर्डिंग...',
    speakCommand: 'अपना आदेश बोलें',
    exampleCommands: 'उदाहरण: "लता 500 जोड़ो" या "रानी ने 5000 का कर्ज लिया" या "रानी ने 1000 चुकाया"',
    updated: 'अपडेट किया गया',
    added: 'जोड़ा गया',
    loanTaken: 'ने कर्ज लिया',
    repayment: 'द्वारा भुगतान',

    loans: 'कर्ज',
    loanDetails: 'कर्ज विवरण',
    memberNameLabel: 'सदस्य',
    loanAmount: 'कर्ज राशि',
    interestRate: 'ब्याज दर',
    repaymentHistory: 'भुगतान इतिहास',
    noLoans: 'कोई सक्रिय कर्ज नहीं',
    totalOutstanding: 'कुल बकाया',

    summary: 'सारांश',
    overallSummary: 'समग्र सारांश',
    balance: 'शेष',
    loan: 'कर्ज',
    noMembers: 'अभी तक कोई सदस्य नहीं',

    meetings: 'बैठकें',
    upcomingMeetings: 'आगामी बैठकें',
    nextMeeting: 'अगली बैठक',
    meetingSchedule: 'बैठक अनुसूची',

    dashboard: 'डैशबोर्ड',
    settings: 'सेटिंग्स',
    logout: 'ऐप रीसेट करें',

    rupees: '₹',
    members: 'सदस्य',
    of: 'में से',

    manualEntry: 'मैनुअल एंट्री',
    addBalance: 'शेष जोड़ें',
    issueLoan: 'कर्ज जारी करें',
    recordRepayment: 'भुगतान रिकॉर्ड करें',
    selectMember: 'सदस्य चुनें',
    amount: 'राशि',
    chooseMember: 'एक सदस्य चुनें',
    enterAmount: 'राशि दर्ज करें',
    loanAmountLabel: 'कर्ज राशि',
    interestRateLabel: 'ब्याज दर',
    repaymentAmount: 'भुगतान राशि',
    adding: 'जोड़ा जा रहा है...',
    processing: 'प्रोसेस हो रहा है...',
    recordingButton: 'रिकॉर्डिंग...',

    transactionHistory: 'लेन-देन इतिहास',
    balanceAdded: 'शेष जोड़ा गया',
    loanIssued: 'कर्ज जारी किया गया',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    deleteTransaction: 'लेन-देन हटाएं?',
    editTransaction: 'लेन-देन संपादित करें',
    saveChanges: 'परिवर्तन सहेजें',
    cancel: 'रद्द करें',
  },

  ml: {
    welcome: 'സ്വാഗതം',
    selectLanguage: 'നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട ഭാഷ തിരഞ്ഞെടുക്കുക',
    continue: 'തുടരുക',

    groupSetup: 'ഗ്രൂപ്പ് സെറ്റപ്പ്',
    groupName: 'സ്വയം സഹായ ഗ്രൂപ്പ് പേര്',
    numberOfMembers: 'അംഗങ്ങളുടെ എണ്ണം',
    meetingFrequency: 'മീറ്റിംഗ് ആവൃത്തി',
    weekly: 'ആഴ്ചയിൽ',
    monthly: 'മാസത്തിൽ',
    firstMeetingDate: 'ആദ്യ മീറ്റിംഗ് തീയതി',
    contributionAmount: 'സംഭാവന തുക (₹)',
    next: 'അടുത്തത്',
    back: 'പിന്നിലേക്ക്',

    memberRegistration: 'അംഗ രജിസ്ട്രേഷൻ',
    memberName: 'അംഗത്തിന്റെ പേര്',
    memberAddress: 'വിലാസം',
    addMember: 'അംഗത്തെ ചേർക്കുക',
    membersAdded: 'അംഗങ്ങളെ ചേർത്തു',
    finishSetup: 'സെറ്റപ്പ് പൂർത്തിയാക്കുക',

    home: 'ഹോം',
    totalBalance: 'മൊത്തം ബാലൻസ്',
    contribution: 'സംഭാവന',
    tapToSpeak: 'സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക',
    recording: 'റെക്കോർഡിംഗ്...',
    speakCommand: 'നിങ്ങളുടെ കമാൻഡ് പറയുക',
    exampleCommands: 'ഉദാഹരണങ്ങൾ: "ലത 500 ചേർക്കുക" അല്ലെങ്കിൽ "റാണി 5000 വായ്പ" അല്ലെങ്കിൽ "റാണി 1000 തിരിച്ചടച്ചു"',
    updated: 'അപ്ഡേറ്റ് ചെയ്തു',
    added: 'ചേർത്തു',
    loanTaken: 'വായ്പ എടുത്തു',
    repayment: 'തിരിച്ചടവ്',

    loans: 'വായ്പകൾ',
    loanDetails: 'വായ്പ വിശദാംശങ്ങൾ',
    memberNameLabel: 'അംഗം',
    loanAmount: 'വായ്പ തുക',
    interestRate: 'പലിശ നിരക്ക്',
    repaymentHistory: 'തിരിച്ചടവ് ചരിത്രം',
    noLoans: 'സജീവ വായ്പകളില്ല',
    totalOutstanding: 'മൊത്തം കുടിശ്ശിക',

    summary: 'സംഗ്രഹം',
    overallSummary: 'മൊത്തത്തിലുള്ള സംഗ്രഹം',
    balance: 'ബാലൻസ്',
    loan: 'വായ്പ',
    noMembers: 'ഇതുവരെ അംഗങ്ങളില്ല',

    meetings: 'മീറ്റിംഗുകൾ',
    upcomingMeetings: 'വരാനിരിക്കുന്ന മീറ്റിംഗുകൾ',
    nextMeeting: 'അടുത്ത മീറ്റിംഗ്',
    meetingSchedule: 'മീറ്റിംഗ് ഷെഡ്യൂൾ',

    dashboard: 'ഡാഷ്‌ബോർഡ്',
    settings: 'ക്രമീകരണങ്ങൾ',
    logout: 'ആപ്പ് റീസെറ്റ് ചെയ്യുക',

    rupees: '₹',
    members: 'അംഗങ്ങൾ',
    of: 'ൽ',

    manualEntry: 'മാനുവൽ എൻട്രി',
    addBalance: 'ബാലൻസ് ചേർക്കുക',
    issueLoan: 'വായ്പ നൽകുക',
    recordRepayment: 'തിരിച്ചടവ് രേഖപ്പെടുത്തുക',
    selectMember: 'അംഗത്തെ തിരഞ്ഞെടുക്കുക',
    amount: 'തുക',
    chooseMember: 'ഒരു അംഗത്തെ തിരഞ്ഞെടുക്കുക',
    enterAmount: 'തുക നൽകുക',
    loanAmountLabel: 'വായ്പ തുക',
    interestRateLabel: 'പലിശ നിരക്ക്',
    repaymentAmount: 'തിരിച്ചടവ് തുക',
    adding: 'ചേർക്കുന്നു...',
    processing: 'പ്രോസസ്സ് ചെയ്യുന്നു...',
    recordingButton: 'റെക്കോർഡിംഗ്...',

    transactionHistory: 'ഇടപാട് ചരിത്രം',
    balanceAdded: 'ബാലൻസ് ചേർത്തു',
    loanIssued: 'വായ്പ നൽകി',
    edit: 'എഡിറ്റ് ചെയ്യുക',
    delete: 'ഇല്ലാതാക്കുക',
    deleteTransaction: 'ഇടപാട് ഇല്ലാതാക്കണോ?',
    editTransaction: 'ഇടപാട് എഡിറ്റ് ചെയ്യുക',
    saveChanges: 'മാറ്റങ്ങൾ സേവ് ചെയ്യുക',
    cancel: 'റദ്ദാക്കുക',
  },
};

export const getTranslation = (lang: Language | null, key: keyof TranslationKeys): string => {
  if (!lang) return translations.en[key];
  return translations[lang][key] || translations.en[key];
};

export const t = getTranslation;
