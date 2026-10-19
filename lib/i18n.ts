// Duniya — all 22 official Indian languages (8th Schedule) + English.
// Widely-spoken languages are carefully translated; smaller-language strings are
// best-effort — native-speaker review recommended before public launch.
export type Lang =
  | 'en' | 'hi' | 'pa' | 'ta' | 'te' | 'bn' | 'gu' | 'mr' | 'kn' | 'ml'
  | 'or' | 'ur' | 'as' | 'ne' | 'sa' | 'kok' | 'mai' | 'doi' | 'ks' | 'sd'
  | 'mni' | 'brx' | 'sat';

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'ur', label: 'اردو' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'as', label: 'অসমীয়া' },
  { code: 'ne', label: 'नेपाली' },
  { code: 'sa', label: 'संस्कृतम्' },
  { code: 'kok', label: 'कोंकणी' },
  { code: 'mai', label: 'मैथिली' },
  { code: 'doi', label: 'डोगरी' },
  { code: 'ks', label: 'کٲشُر' },
  { code: 'sd', label: 'سنڌي' },
  { code: 'mni', label: 'মৈতৈলোন্' },
  { code: 'brx', label: "बर'" },
  { code: 'sat', label: 'ᱥᱟᱱᱛᱟᱲᱤ' },
];

type Dict = Record<string, Partial<Record<Lang, string>>>;
const S: Dict = {
  tagline: {
    en: 'One identity. Every generation. Your digital world.',
    hi: 'एक पहचान। हर पीढ़ी। आपकी डिजिटल दुनिया।',
    pa: 'ਇੱਕ ਪਛਾਣ। ਹਰ ਪੀੜ੍ਹੀ। ਤੁਹਾਡੀ ਡਿਜੀਟਲ ਦੁਨੀਆ।',
    ta: 'ஒரு அடையாளம். ஒவ்வொரு தலைமுறை. உங்கள் டிஜிட்டல் உலகம்.',
    te: 'ఒక గుర్తింపు. ప్రతి తరం. మీ డిజిటల్ ప్రపంచం.',
    bn: 'এক পরিচয়। প্রতিটি প্রজন্ম। আপনার ডিজিটাল জগৎ।',
    gu: 'એક ઓળખ. દરેક પેઢી. તમારી ડિજિટલ દુનિયા.',
    mr: 'एक ओळख. प्रत्येक पिढी. तुमची डिजिटल दुनिया.',
    kn: 'ಒಂದು ಗುರುತು. ಪ್ರತಿ ಪೀಳಿಗೆ. ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಲೋಕ.',
    ml: 'ഒരു തിരിച്ചറിയൽ. ഓരോ തലമുറ. നിങ്ങളുടെ ഡിജിറ്റൽ ലോകം.',
    or: 'ଗୋଟିଏ ପରିଚୟ. ପ୍ରତ୍ୟେକ ପିଢ଼ି. ତୁମର ଡିଜିଟାଲ ଦୁନିଆ.',
    ur: 'ایک پہچان۔ ہر نسل۔ آپ کی ڈیجیٹل دنیا۔',
    as: 'এক পৰিচয়। প্ৰতিটো প্ৰজন্ম। আপোনাৰ ডিজিটেল জগত।',
    ne: 'एक पहिचान। हरेक पुस्ता। तपाईंको डिजिटल संसार।',
    sa: 'एकं परिचयः। प्रत्येकं पीढी। भवतः डिजिटल लोकः।',
    kok: 'एक वळख. दर एक पिळगी. तुमचें डिजिटल जग.',
    mai: 'एक परिचय। प्रत्येक पीढ़ी। अहाँक डिजिटल दुनिया।',
    doi: 'इक पन्छाण। हर पीढ़ी। तुहाडी डिजिटल दुनिया।',
    ks: 'اکھ پہچان۔ ہر نسل۔ توہند ڈیجیٹل دنیا۔',
    sd: 'هڪ سڃاڻپ۔ هر نسل۔ توهان جي ڊجيٽل دنيا۔',
    mni: 'অমা মশক খঙবা। খুদিংগী মীরোল। নঙগী দিজিতেল মালেম।',
    brx: 'मोनसे मिथिना। हर जोलो। नोंथांनि डिजिटल संसार।',
    sat: 'ᱢᱤᱫ ᱩᱯᱨᱩᱢ᱾ ᱡᱷᱚᱛᱚ ᱯᱤᱲᱦᱤ᱾ ᱟᱢᱟᱜ ᱰᱤᱡᱤᱴᱟᱞ ᱫᱷᱟᱨᱛᱤ᱾',
  },
  createAccount: {
    en: 'Create Account', hi: 'खाता बनाएं', pa: 'ਖਾਤਾ ਬਣਾਓ',
    ta: 'கணக்கை உருவாக்கு', te: 'ఖాతా సృష్టించండి', bn: 'অ্যাকাউন্ট তৈরি করুন',
    gu: 'ખાતું બનાવો', mr: 'खाते तयार करा', kn: 'ಖಾತೆ ರಚಿಸಿ', ml: 'അക്കൗണ്ട് ഉണ്ടാക്കുക',
    or: 'ଖାତା ଖୋଲନ୍ତୁ', ur: 'اکاؤنٹ بنائیں', as: 'একাউণ্ট খোলক', ne: 'खाता खोल्नुहोस्',
    sa: 'खातं रचयतु', kok: 'खातें तयार करात', mai: 'खाता बनाउ', doi: 'खाता बनाओ',
    ks: 'اکاؤنٹ بناو', sd: 'کاتو ٺاهيو', mni: 'একাউন্ত শেমু', brx: 'एकाउन्ट बानाय',
    sat: 'ᱮᱠᱟᱶᱴ ᱵᱮᱱᱟᱣ',
  },
  login: {
    en: 'Log in', hi: 'लॉग इन', pa: 'ਲੌਗ ਇਨ', ta: 'உள்நுழை', te: 'లాగిన్', bn: 'লগ ইন',
    gu: 'લોગ ઇન', mr: 'लॉग इन', kn: 'ಲಾಗಿನ್', ml: 'ലോഗിൻ', or: 'ଲଗ୍ ଇନ୍',
    ur: 'لاگ ان', as: 'লগ ইন', ne: 'लग इन', sa: 'प्रविशतु', kok: 'लॉग इन',
    mai: 'लॉग इन', doi: 'लॉग इन', ks: 'لاگ اِن', sd: 'لاگ ان', mni: 'লগ ইন',
    brx: 'लग इन', sat: 'ᱵᱚᱞᱚ',
  },
  email: {
    en: 'Email', hi: 'ईमेल', pa: 'ਈਮੇਲ', ta: 'மின்னஞ்சல்', te: 'ఈమెయిల్', bn: 'ইমেইল',
    gu: 'ઈમેલ', mr: 'ईमेल', kn: 'ಇಮೇಲ್', ml: 'ഇമെയിൽ', or: 'ଇମେଲ',
    ur: 'ای میل', as: 'ইমেইল', ne: 'इमेल', sa: 'ईमेल', kok: 'ईमेल',
    mai: 'ईमेल', doi: 'ईमेल', ks: 'ای میل', sd: 'اي ميل', mni: 'ইমেইল',
    brx: 'इमेल', sat: 'ᱤᱢᱮᱞ',
  },
  phone: {
    en: 'Mobile number', hi: 'मोबाइल नंबर', pa: 'ਮੋਬਾਈਲ ਨੰਬਰ',
    ta: 'கைபேசி எண்', te: 'మొబైల్ నంబర్', bn: 'মোবাইল নম্বর',
    gu: 'મોબાઈલ નંબર', mr: 'मोबाईल नंबर', kn: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', ml: 'മൊബൈൽ നമ്പർ',
    or: 'ମୋବାଇଲ ନମ୍ବର', ur: 'موبائل نمبر', as: 'মʼবাইল নম্বৰ', ne: 'मोबाइल नम्बर',
    sa: 'दूरवाणी संख्या', kok: 'मोबायल नंबर', mai: 'मोबाइल नंबर', doi: 'मोबाइल नंबर',
    ks: 'موبائل نمبر', sd: 'موبائل نمبر', mni: 'মোবাইল নম্বর', brx: 'मोबाइल नम्बर',
    sat: 'ᱢᱚᱵᱟᱭᱤᱞ ᱱᱚᱢᱵᱚᱨ',
  },
  fullName: {
    en: 'Full name', hi: 'पूरा नाम', pa: 'ਪੂਰਾ ਨਾਮ',
    ta: 'முழு பெயர்', te: 'పూర్తి పేరు', bn: 'পুরো নাম',
    gu: 'પૂરું નામ', mr: 'पूर्ण नाव', kn: 'ಪೂರ್ಣ ಹೆಸರು', ml: 'മുഴുവൻ പേര്',
    or: 'ପୂରା ନାମ', ur: 'پورا نام', as: 'সম্পূৰ্ণ নাম', ne: 'पूरा नाम',
    sa: 'पूर्णं नाम', kok: 'पुराय नांव', mai: 'पूरा नाम', doi: 'पूरा नां',
    ks: 'پورٕ ناو', sd: 'پورو نالو', mni: 'মপুং ফাবা মিং', brx: 'आबुं मुआ',
    sat: 'ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ',
  },
  sendCode: {
    en: 'Send code', hi: 'कोड भेजें', pa: 'ਕੋਡ ਭੇਜੋ',
    ta: 'குறியீடு அனுப்பு', te: 'కోడ్ పంపండి', bn: 'কোড পাঠান',
    gu: 'કોડ મોકલો', mr: 'कोड पाठवा', kn: 'ಕೋಡ್ ಕಳುಹಿಸಿ', ml: 'കോഡ് അയയ്ക്കുക',
    or: 'କୋଡ୍ ପଠାନ୍ତୁ', ur: 'کوڈ بھیجیں', as: 'কʼড পঠাওক', ne: 'कोड पठाउनुहोस्',
    sa: 'संकेतं प्रेषयतु', kok: 'कोड धाडात', mai: 'कोड पठाउ', doi: 'कोड भेजो',
    ks: 'کوڈ سوزو', sd: 'ڪوڊ موڪليو', mni: 'কোদ থাবীয়ু', brx: 'कोड हर',
    sat: 'ᱠᱚᱰ ᱠᱩᱞ',
  },
  verify: {
    en: 'Verify & continue', hi: 'सत्यापित करें', pa: 'ਤਸਦੀਕ ਕਰੋ',
    ta: 'சரிபார்', te: 'ధృవీకరించండి', bn: 'যাচাই করুন',
    gu: 'ચકાસો', mr: 'पडताळा करा', kn: 'ಪರಿಶೀಲಿಸಿ', ml: 'പരിശോധിക്കുക',
    or: 'ଯାଞ୍ଚ କରନ୍ତୁ', ur: 'تصدیق کریں', as: 'পৰীক্ষা কৰক', ne: 'प्रमाणित गर्नुहोस्',
    sa: 'प्रमाणीकुरुत', kok: 'तपासात', mai: 'जाँच करू', doi: 'जांच करो',
    ks: 'تصدیٖق کرو', sd: 'تصديق ڪريو', mni: 'য়েংশিনবীয়ু', brx: 'नाय',
    sat: 'ᱯᱟᱹᱛᱭᱟᱹᱣ',
  },
  codeSent: {
    en: 'Code sent! Check your email.', hi: 'कोड भेज दिया! अपना ईमेल देखें।',
    pa: 'ਕੋਡ ਭੇਜ ਦਿੱਤਾ! ਆਪਣਾ ਈਮੇਲ ਵੇਖੋ।', ta: 'குறியீடு அனுப்பப்பட்டது! மின்னஞ்சலைப் பார்க்கவும்।',
    te: 'కోడ్ పంపబడింది! మీ ఈమెయిల్ చూడండి।', bn: 'কোড পাঠানো হয়েছে! ইমেইল দেখুন।',
    gu: 'કોડ મોકલાયો! તમારું ઈમેલ જુઓ.', mr: 'कोड पाठवला! तुमचा ईमेल पहा.',
    kn: 'ಕೋಡ್ ಕಳುಹಿಸಲಾಗಿದೆ! ನಿಮ್ಮ ಇಮೇಲ್ ನೋಡಿ.', ml: 'കോഡ് അയച്ചു! ഇമെയിൽ നോക്കൂ.',
    or: 'କୋଡ୍ ପଠାଗଲା! ଇମେଲ ଦେଖନ୍ତୁ.', ur: 'کوڈ بھیج دیا! اپنا ای میل دیکھیں۔',
    as: 'কʼড পঠিওৱা হʼল! ইমেইল চাওক।', ne: 'कोड पठाइयो! इमेल हेर्नुहोस्।',
    sa: 'संकेतः प्रेषितः! ईमेल पश्यतु।', kok: 'कोड धाडलो! ईमेल पळयात।',
    mai: 'कोड पठा देल! ईमेल देखू।', doi: 'कोड भेजेआ! ईमेल दिखो।',
    ks: 'کوڈ سوزنہٕ! ای میل وچھو۔', sd: 'ڪوڊ موڪليو ويو! اي ميل ڏسو۔',
    mni: 'কোদ থাবীয়রে! ইমেইল য়েংবীয়ু।', brx: 'कोड हरबाय! इमेल नाय।',
    sat: 'ᱠᱚᱰ ᱠᱩᱞ ᱮᱱᱟ! ᱤᱢᱮᱞ ᱧᱮᱞ᱾',
  },
  home: {
    en: 'Home', hi: 'होम', pa: 'ਹੋਮ', ta: 'முகப்பு', te: 'హోమ్', bn: 'হোম',
    gu: 'હોમ', mr: 'होम', kn: 'ಮುಖಪುಟ', ml: 'ഹോം', or: 'ହୋମ',
    ur: 'ہوم', as: 'হʼম', ne: 'होम', sa: 'मुखपृष्ठम्', kok: 'होम',
    mai: 'होम', doi: 'होम', ks: 'ہوم', sd: 'هوم', mni: 'হোম',
    brx: 'होम', sat: 'ᱚᱲᱟᱜ',
  },
  reels: {
    en: 'Clips', hi: 'क्लिप्स', pa: 'ਕਲਿੱਪਸ', ta: 'கிளிப்ஸ்', te: 'క్లిప్స్', bn: 'ক্লিপস',
    gu: 'ક્લિપ્સ', mr: 'क्लिप्स', kn: 'ಕ್ಲಿಪ್ಸ್', ml: 'ക്ലിപ്സ്', or: 'କ୍ଲିପ୍ସ',
    ur: 'کلپس', as: 'ক্লিপছ', ne: 'क्लिप्स', sa: 'क्लिप्स', kok: 'क्लिप्स',
    mai: 'क्लिप्स', doi: 'क्लिप्स', ks: 'کلپس', sd: 'ڪلپس', mni: 'ক্লিপ্স',
    brx: 'क्लिप्स', sat: 'ᱠᱞᱤᱯᱥ',
  },
  live: {
    en: 'Live', hi: 'लाइव', pa: 'ਲਾਈਵ', ta: 'நேரலை', te: 'లైవ్', bn: 'লাইভ',
    gu: 'લાઇવ', mr: 'लाइव्ह', kn: 'ಲೈವ್', ml: 'ലൈവ്', or: 'ଲାଇଭ୍',
    ur: 'لائیو', as: 'লাইভ', ne: 'लाइभ', sa: 'लाइव्ह', kok: 'लाइव्ह',
    mai: 'लाइव', doi: 'लाइव', ks: 'لائیو', sd: 'لائيو', mni: 'লাইভ',
    brx: 'लाइव', sat: 'ᱞᱟᱭᱤᱵᱷ',
  },
  create: {
    en: 'Create', hi: 'बनाएं', pa: 'ਬਣਾਓ', ta: 'உருவாக்கு', te: 'సృష్టించు', bn: 'তৈরি',
    gu: 'બનાવો', mr: 'तयार करा', kn: 'ರಚಿಸಿ', ml: 'സൃഷ്ടിക്കൂ', or: 'ତିଆରି',
    ur: 'بنائیں', as: 'সৃষ্টি', ne: 'सिर्जना', sa: 'रचयतु', kok: 'तयार करात',
    mai: 'बनाउ', doi: 'बनाओ', ks: 'بَناو', sd: 'ٺاهيو', mni: 'শেম্বা',
    brx: 'सोरजि', sat: 'ᱵᱮᱱᱟᱣ',
  },
  family: {
    en: 'Family', hi: 'परिवार', pa: 'ਪਰਿਵਾਰ', ta: 'குடும்பம்', te: 'కుటుంబం', bn: 'পরিবার',
    gu: 'પરિવાર', mr: 'कुटुंब', kn: 'ಕುಟುಂಬ', ml: 'കുടുംബം', or: 'ପରିବାର',
    ur: 'خاندان', as: 'পৰিয়াল', ne: 'परिवार', sa: 'परिवारः', kok: 'कुटुंब',
    mai: 'परिवार', doi: 'परिवार', ks: 'خاندان', sd: 'خاندان', mni: 'ইমুং',
    brx: 'नखर', sat: 'ᱜᱷᱟᱨᱚᱸᱡᱽ',
  },
  briefcase: {
    en: 'Briefcase', hi: 'ब्रीफ़केस', pa: 'ਬ੍ਰੀਫ਼ਕੇਸ',
    ta: 'பெட்டி', te: 'బ్రీఫ్‌కేస్', bn: 'ব্রিফকেস',
    gu: 'બ્રીફકેસ', mr: 'ब्रीफकेस', kn: 'ಬ್ರೀಫ್‌ಕೇಸ್', ml: 'ബ്രീഫ്കേസ്',
    or: 'ବ୍ରିଫକେସ', ur: 'بریف کیس', as: 'ব্ৰিফকেছ', ne: 'ब्रिफकेस',
    sa: 'ब्रीफकेस', kok: 'ब्रीफकेस', mai: 'ब्रीफकेस', doi: 'ब्रीफकेस',
    ks: 'بریف کیس', sd: 'بريفڪيس', mni: 'ব্রিফকেস', brx: 'ब्रिफकेस',
    sat: 'ᱵᱨᱤᱯᱷᱠᱮᱥ',
  },
  messages: {
    en: 'Messages', hi: 'संदेश', pa: 'ਸੁਨੇਹੇ',
    ta: 'செய்திகள்', te: 'సందేశాలు', bn: 'বার্তা',
    gu: 'સંદેશા', mr: 'संदेश', kn: 'ಸಂದೇಶಗಳು', ml: 'സന്ദേശങ്ങൾ',
    or: 'ବାର୍ତ୍ତା', ur: 'پیغامات', as: 'বাৰ্তা', ne: 'सन्देश',
    sa: 'सन्देशाः', kok: 'संदेश', mai: 'संदेश', doi: 'संदेश',
    ks: 'پیغام', sd: 'پيغام', mni: 'পাউজেল', brx: 'बाथ्रा',
    sat: 'ᱠᱟᱛᱷᱟ',
  },
  rewards: {
    en: 'Rewards', hi: 'रिवार्ड्स', pa: 'ਇਨਾਮ',
    ta: 'வெகுமதிகள்', te: 'బహుమతులు', bn: 'পুরস্কার',
    gu: 'ઈનામો', mr: 'बक्षिसे', kn: 'ಬಹುಮಾನಗಳು', ml: 'സമ്മാനങ്ങൾ',
    or: 'ପୁରସ୍କାର', ur: 'انعامات', as: 'পুৰস্কাৰ', ne: 'पुरस्कार',
    sa: 'पुरस्काराः', kok: 'इनामां', mai: 'पुरस्कार', doi: 'इनाम',
    ks: 'انعام', sd: 'انعام', mni: 'মানা', brx: 'बान्था',
    sat: 'ᱥᱤᱨᱯᱟᱹ',
  },
  profile: {
    en: 'Profile', hi: 'प्रोफ़ाइल', pa: 'ਪ੍ਰੋਫ਼ਾਈਲ',
    ta: 'சுயவிவரம்', te: 'ప్రొఫైల్', bn: 'প্রোফাইল',
    gu: 'પ્રોફાઈલ', mr: 'प्रोफाइल', kn: 'ಪ್ರೊಫೈಲ್', ml: 'പ്രൊഫൈൽ',
    or: 'ପ୍ରୋଫାଇଲ', ur: 'پروفائل', as: 'প্ৰʼফাইল', ne: 'प्रोफाइल',
    sa: 'परिचयपत्रम्', kok: 'प्रोफायल', mai: 'प्रोफाइल', doi: 'प्रोफाइल',
    ks: 'پروفائل', sd: 'پروفائل', mni: 'প্রোফাইল', brx: 'प्रोफाइल',
    sat: 'ᱯᱨᱚᱯᱷᱟᱭᱤᱞ',
  },
  business: {
    en: 'Business', hi: 'बिज़नेस', pa: 'ਕਾਰੋਬਾਰ',
    ta: 'வணிகம்', te: 'వ్యాపారం', bn: 'ব্যবসা',
    gu: 'બિઝનેસ', mr: 'व्यवसाय', kn: 'ವ್ಯಾಪಾರ', ml: 'ബിസിനസ്',
    or: 'ବ୍ୟବସାୟ', ur: 'کاروبار', as: 'ব্যৱসায়', ne: 'व्यवसाय',
    sa: 'व्यवसायः', kok: 'धंदो', mai: 'व्यवसाय', doi: 'कारोबार',
    ks: 'کاربار', sd: 'ڪاروبار', mni: 'ব্যাপার', brx: 'फालांगि',
    sat: 'ᱵᱮᱯᱟᱨ',
  },
  kyc: {
    en: 'Verify ID', hi: 'पहचान सत्यापित करें', pa: 'ਪਛਾਣ ਤਸਦੀਕ',
    ta: 'அடையாள சரிபார்ப்பு', te: 'గుర్తింపు ధృవీకరణ', bn: 'পরিচয় যাচাই',
    gu: 'ઓળખ ચકાસણી', mr: 'ओळख पडताळणी', kn: 'ಗುರುತು ಪರಿಶೀಲನೆ', ml: 'തിരിച്ചറിയൽ പരിശോധന',
    or: 'ପରିଚୟ ଯାଞ୍ଚ', ur: 'شناخت کی تصدیق', as: 'পৰিচয় পৰীক্ষা', ne: 'पहिचान प्रमाणीकरण',
    sa: 'परिचय प्रमाणीकरणम्', kok: 'वळख तपासणी', mai: 'परिचय जाँच', doi: 'पन्छाण जांच',
    ks: 'پہچان تصدیٖق', sd: 'سڃاڻپ جي تصديق', mni: 'মশক খঙদোকপা', brx: 'मिथिना नायनाय',
    sat: 'ᱩᱯᱨᱩᱢ ᱯᱟᱹᱛᱭᱟᱹᱣ',
  },
  post: {
    en: 'Post', hi: 'पोस्ट', pa: 'ਪੋਸਟ', ta: 'பதிவு', te: 'పోస్ట్', bn: 'পোস্ট',
    gu: 'પોસ્ટ', mr: 'पोस्ट', kn: 'ಪೋಸ್ಟ್', ml: 'പോസ്റ്റ്', or: 'ପୋଷ୍ଟ',
    ur: 'پوسٹ', as: 'পʼষ্ট', ne: 'पोस्ट', sa: 'पोस्ट', kok: 'पोस्ट',
    mai: 'पोस्ट', doi: 'पोस्ट', ks: 'پوسٹ', sd: 'پوسٽ', mni: 'পোস্ট',
    brx: 'पोस्ट', sat: 'ᱯᱚᱥᱴ',
  },
  whatsNew: {
    en: "What's happening in Bharat?", hi: 'भारत में क्या हो रहा है?',
    pa: 'ਭਾਰਤ ਵਿੱਚ ਕੀ ਹੋ ਰਿਹਾ ਹੈ?', ta: 'பாரதத்தில் என்ன நடக்கிறது?',
    te: 'భారత్‌లో ఏం జరుగుతోంది?', bn: 'ভারতে কী ঘটছে?',
    gu: 'ભારતમાં શું ચાલી રહ્યું છે?', mr: 'भारतात काय चालले आहे?',
    kn: 'ಭಾರತದಲ್ಲಿ ಏನು ನಡೆಯುತ್ತಿದೆ?', ml: 'ഭാരതത്തിൽ എന്താണ് നടക്കുന്നത്?',
    or: 'ଭାରତରେ କଣ ଚାଲିଛି?', ur: 'بھارت میں کیا ہو رہا ہے؟',
    as: 'ভাৰতত কি চলি আছে?', ne: 'भारतमा के भइरहेको छ?',
    sa: 'भारते किं प्रचलति?', kok: 'भारतात कितें चल्लां?',
    mai: 'भारत मे की भऽ रहल अछि?', doi: 'भारत च क्या होआ करदा?',
    ks: 'ہندوستانس مَنٛز کیا چھُ گژھان؟', sd: 'ڀارت ۾ ڇا هلي رهيو آهي؟',
    mni: 'ভারত্তা করি চৎলি?', brx: 'भारतआव मा माव दं?',
    sat: 'ᱵᱷᱟᱨᱚᱛ ᱨᱮ ᱪᱮᱫ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ?',
  },
  friends: {
    en: 'Friends', hi: 'दोस्त',
  },
  addFriend: {
    en: 'Add friend', hi: 'दोस्त बनाएं',
  },
  accept: {
    en: 'Accept', hi: 'स्वीकार करें',
  },
  decline: {
    en: 'Decline', hi: 'मना करें',
  },
  friendRequests: {
    en: 'Requests', hi: 'रिक्वेस्ट',
  },
  myFriends: {
    en: 'My friends', hi: 'मेरे दोस्त',
  },
  findPeople: {
    en: 'Find people', hi: 'लोग खोजें',
  },
  requestSent: {
    en: 'Request sent', hi: 'रिक्वेस्ट भेजी',
  },
  noRequests: {
    en: 'No friend requests right now.', hi: 'अभी कोई फ्रेंड रिक्वेस्ट नहीं है।',
  },
  noFriendsYet: {
    en: 'No friends yet — find people and send a request!', hi: 'अभी कोई दोस्त नहीं — लोगों को खोजकर रिक्वेस्ट भेजो!',
  },
  friendsOnly: {
    en: 'Visible to friends only', hi: 'सिर्फ दोस्तों को दिखेगा',
  },
  viewProfile: {
    en: 'View profile', hi: 'प्रोफाइल देखें',
  },
  address: {
    en: 'Address', hi: 'पता',
  },
  jobTitle: {
    en: 'Job title', hi: 'पद / काम',
  },
  company: {
    en: 'Company', hi: 'कंपनी',
  },
  changePassword: {
    en: 'Change password', hi: 'पासवर्ड बदलें',
  },
  newPassword: {
    en: 'New password', hi: 'नया पासवर्ड',
  },
  passwordChanged: {
    en: 'Password changed ✓', hi: 'पासवर्ड बदल गया ✓',
  },
  dateOfBirth: {
    en: 'Date of birth', hi: 'जन्म तिथि',
  },
  birthPlace: {
    en: 'Birth place', hi: 'जन्म स्थान',
  },
  school: {
    en: 'School', hi: 'स्कूल',
  },
  college: {
    en: 'College', hi: 'कॉलेज',
  },
  religion: {
    en: 'Religion', hi: 'धर्म',
  },
  ethnicity: {
    en: 'Ethnic group', hi: 'जातीय समूह',
  },
  marriageStatus: {
    en: 'Marriage status', hi: 'वैवाहिक स्थिति',
  },
  lifeStory: {
    en: 'Life story', hi: 'जीवन कहानी',
  },
  upcomingBirthdays: {
    en: 'Upcoming birthdays', hi: 'आने वाले जन्मदिन',
  },
  sendWish: {
    en: 'Send wish', hi: 'बधाई भेजो',
  },
  autoAlbums: {
    en: 'Auto-albums', hi: 'ऑटो-एल्बम',
  },
  photos: {
    en: 'photos', hi: 'फ़ोटो',
  },
  education: {
    en: 'Education', hi: 'शिक्षा',
  },
  tenth: {
    en: '10th', hi: '10वीं',
  },
  twelfth: {
    en: '12th', hi: '12वीं',
  },
  graduation: {
    en: 'Graduation', hi: 'ग्रेजुएशन',
  },
  masters: {
    en: 'Masters', hi: 'मास्टर्स',
  },
  jobHistory: {
    en: 'Job history', hi: 'नौकरी का इतिहास',
  },
  uploadPhoto: {
    en: 'Upload photo', hi: 'फोटो अपलोड करें',
  },
  profilePhoto: {
    en: 'Profile photo', hi: 'प्रोफाइल फोटो',
  },
  links: {
    en: 'Links', hi: 'लिंक्स',
  },
  comments: {
    en: 'Comments', hi: 'टिप्पणियाँ',
  },
  comment: {
    en: 'Comment', hi: 'टिप्पणी',
  },
  share: {
    en: 'Share', hi: 'शेयर',
  },
  loadMore: {
    en: 'Load more', hi: 'और लोड करें',
  },
  send: {
    en: 'Send', hi: 'भेजें',
  },
  refresh: {
    en: 'Refresh', hi: 'रिफ्रेश',
  },
  search: {
    en: 'Search', hi: 'खोजें',
  },
  more: {
    en: 'More', hi: 'और',
  },
  logout: {
    en: 'Log out', hi: 'लॉग आउट',
  },
  writeComment: {
    en: 'Write a comment…', hi: 'टिप्पणी लिखें…',
  },
  copyLink: {
    en: 'Copy link', hi: 'लिंक कॉपी करें',
  },
  linkCopied: {
    en: 'Link copied! 📋', hi: 'लिंक कॉपी हो गया! 📋',
  },
  demoAdSoon: {
    en: 'Demo ad — link coming soon 📢', hi: 'डेमो विज्ञापन — लिंक जल्द आएगा 📢',
  },
  conversations: {
    en: 'Conversations', hi: 'बातचीत',
  },
  typeMessage: {
    en: 'Type a message…', hi: 'संदेश लिखें…',
  },
  loading: {
    en: 'Loading…', hi: 'लोड हो रहा है…',
  },
  retry: {
    en: 'Try again', hi: 'पुनः प्रयास करें',
  },
  loadFailed: {
    en: 'Could not load. Check your connection and try again.', hi: 'लोड नहीं हो सका। कनेक्शन जाँचें और पुनः प्रयास करें।',
  },
  noPosts: {
    en: 'No posts yet — be the first! 🎉', hi: 'अभी कोई पोस्ट नहीं — सबसे पहले पोस्ट करें! 🎉',
  },
  allCaughtUp: {
    en: "You're all caught up! 🎉", hi: 'आप सब देख चुके! 🎉',
  },
  sayNamaste: {
    en: 'Say namaste! 🙏', hi: 'नमस्ते कहें! 🙏',
  },
  tapToChat: {
    en: 'Tap to chat', hi: 'चैट के लिए टैप करें',
  },
  message: {
    en: 'Message', hi: 'संदेश भेजें',
  },
  members: {
    en: 'Members', hi: 'सदस्य',
  },
  quickLinks: {
    en: 'Quick Links', hi: 'त्वरित लिंक्स',
  },
  mySocialLinks: {
    en: 'My Social Links', hi: 'मेरे सोशल लिंक्स',
  },
  noSocialLinks: {
    en: 'No social links yet — add them on your Profile page.', hi: 'अभी कोई सोशल लिंक नहीं — प्रोफ़ाइल पेज पर जोड़ें।',
  },
  back: {
    en: 'Back', hi: 'वापस',
  },
  unlike: {
    en: 'Unlike', hi: 'अनलाइक',
  },
  festivals: {
    en: 'Festivals', hi: 'त्योहार',
  },
  searchPeople: {
    en: 'Search people by name…', hi: 'नाम से लोग खोजें…',
  },
  peopleFound: {
    en: 'people found', hi: 'लोग मिले',
  },
  noPeopleFound: {
    en: 'No people found with that name yet.', hi: 'इस नाम से अभी कोई नहीं मिला।',
  },
  albums: {
    en: 'Albums', hi: 'एल्बम',
  },
  myPhotos: {
    en: 'My photos', hi: 'मेरी फ़ोटो',
  },
  addTodaysPhoto: {
    en: "Add today's photo", hi: 'आज की फ़ोटो जोड़ें',
  },
  noPhotosYet: {
    en: 'No photos yet — post your first photo from Home.', hi: 'अभी कोई फ़ोटो नहीं — Home से पहली फ़ोटो पोस्ट करें।',
  },
  upcomingFestivals: {
    en: 'Upcoming festivals', hi: 'आने वाले त्योहार',
  },
  holidayTomorrow: {
    en: 'Holiday tomorrow', hi: 'कल छुट्टी है',
  },
  nationalHoliday: {
    en: 'National holiday', hi: 'राष्ट्रीय अवकाश',
  },
  allStates: {
    en: 'All states', hi: 'सभी राज्य',
  },
  greetFriends: {
    en: 'Greet friends', hi: 'दोस्तों को बधाई दो',
  },
  indiaNow: {
    en: 'India now', hi: 'भारत अभी',
  },
  sports: {
    en: 'Sports', hi: 'खेल',
  },
  dateMayVary: {
    en: 'date may vary (lunar calendar)', hi: 'तिथि बदल सकती है',
  },
  next30days: {
    en: 'Next 30 days', hi: 'अगले 30 दिन',
  },
  duniyaAI: {
    en: 'Duniya AI', hi: 'दुनिया AI',
  },
  myWorld: {
    en: 'My world', hi: 'मेरी दुनिया',
  },
  chooseWorld: {
    en: 'Which is your world?', hi: 'आपकी दुनिया कौन सी है?',
  },
};

export type StrKey = keyof typeof S;
export const tr = (k: StrKey, lang: Lang): string => S[k][lang] ?? S[k].en ?? k;

const ALL: Lang[] = ['en','hi','pa','ta','te','bn','gu','mr','kn','ml','or','ur','as','ne','sa','kok','mai','doi','ks','sd','mni','brx','sat'];

export function getLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const l = localStorage.getItem('av_lang');
  return (ALL.includes(l as Lang) ? l : 'en') as Lang;
}
export function setLang(l: Lang) { try { localStorage.setItem('av_lang', l); } catch {} }
