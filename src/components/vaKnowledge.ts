// ResQMeals Voice Assistant — Knowledge Base
// Full multilingual support: EN, HI, TA, TE, BN, MR, KN, ML, GU, PA, UR, FR, ES, DE
import { ANSWERS } from './vaAnswers';

export interface KBEntry {
  keywords: string[];
  en: string;
  hi: string;
  ta: string;
  // Additional languages stored in extras map
  extras?: Record<string, string>;
}

export const KB: KBEntry[] = [
  {
    keywords: [
      'what is resqmeals','about','explain','platform','purpose','resqmeals','food rescue','surplus','overview','introduction',
      'రెస్క్యూమీల్స్ అంటే','ఏమిటి','ఆహారం','రెస్క్యూ',
      'রেসকিউমিলস কি','খাদ্য','উদ্ধার',
      'रेस्क्युमील्स','बারे में','अन्न','बचाव',
      'ರೆಸ್ಕ್ಯೂಮೀಲ್ಸ್','ಆಹಾರ','ಬಗ್ಗೆ',
      'রেসকিউমিলস','খাবার','সম্পর্কে',
      'ResQMeals என்ன','ResQMeals பற்றி','விளக்கு',
      'रेस्क्युमील्स क्या','बारे','मंच','बचाव',
      'ശേഷ്ക്യൂമീൽസ്','ഭക്ഷണം','പ്ലാറ്റ്ഫോം',
      'रेस्क्यूमील्स क्या है','रेस्क्यूमील्स के बारे',
      'ResQMeals c\'est quoi','plateforme alimentaire','qu\'est-ce que ResQMeals',
      'qué es ResQMeals','plataforma de alimentos',
    ],
    en: 'ResQMeals is a food rescue platform that connects food donors like restaurants, canteens, and caterers with NGOs and volunteers to redistribute surplus food to people in need, reducing waste and hunger.',
    hi: 'ResQMeals एक खाद्य बचाव मंच है जो रेस्तरां, कैंटीन और केटरर्स जैसे खाद्य दाताओं को NGO और स्वयंसेवकों से जोड़ता है ताकि जरूरतमंद लोगों को अतिरिक्त खाना दिया जा सके और बर्बादी कम हो।',
    ta: 'ResQMeals என்பது ஒரு உணவு மீட்பு தளம் ஆகும், இது உணவு நன்கொடையாளர்களை NGO மற்றும் தன்னார்வலர்களுடன் இணைக்கிறது, மிகுதியான உணவை தேவையுள்ளவர்களுக்கு வழங்குகிறது.',
  },
  {
    keywords: [
      'claim','accept','how to claim','get donation','take food','reserve','claim donation','collect food','collect','get food','how get','food available',
      'దావా','దానం తీసుకోవడం','ఎలా తీసుకోవాలి','క్లెయిమ్',
      'দাবি করুন','খাবার নিন','কিভাবে নেবো','ক্লেইম',
      'दावा करा','अन्न घ्या','कसे क्लेम करावे',
      'ಕ್ಲೇಮ್','ಆಹಾರ ತೆಗೆದುಕೊಳ್ಳಿ','ಹೇಗೆ ಪಡೆಯುವುದು',
      'ക്ലെയിം','ഭക്ഷണം ലഭിക്കൽ','എങ്ങനെ ലഭിക്കും',
      'दावा','क्लेम','खाना कैसे लें','कैसे क्लेम','रिजर्व',
      'கிளைம்','பெறுவது','உணவு எடுக்க','கோரிக்கை',
      'comment réclamer','obtenir don','réclamer nourriture',
      'cómo reclamar','obtener donación',
    ],
    en: 'To claim a donation, go to the Available Donations page, browse the list or map view, and click the Claim button next to any available food item. A volunteer will then be assigned for pickup and delivery to your NGO.',
    hi: 'दान का दावा करने के लिए, Available Donations पेज पर जाएं, सूची या मानचित्र दृश्य में ब्राउज़ करें, और किसी भी उपलब्ध खाद्य आइटम के पास Claim बटन पर क्लिक करें। फिर एक स्वयंसेवक उठाने और आपके NGO को डिलीवरी के लिए सौंपा जाएगा।',
    ta: 'நன்கொடையை கோர, Available Donations பக்கத்திற்கு செல்லுங்கள், பட்டியல் அல்லது வரைபட காட்சியை உலாவுங்கள், மற்றும் கிடைக்கக்கூடிய உணவு பொருளுக்கு அடுத்துள்ள Claim பொத்தானை கிளிக் செய்யுங்கள். ஒரு தன்னார்வலர் ஒதுக்கப்படுவார்.',
  },
  {
    keywords: [
      'expiry','expire','expiry time','how long valid','food expire','time remaining','urgent','soon expire','near expiry','deadline','ends','when expire',
      'గడువు','ఎంత సమయం','అర్జెంట్','ఎక్స్పైరీ',
      'মেয়াদ','কতক্ষণ','জরুরি','শেষ হওয়া',
      'मुदत','किती वेळ','अर्जंट','एक्सपायरी',
      'ಅವಧಿ','ಎಷ್ಟು ಸಮಯ','ತುರ್ತು',
      'കാലാവധി','എത്ര സമയം','അടിയന്തിരം',
      'समाप्ति','कब तक','एक्सपायरी','जरूरी',
      'காலாவதி','எவ்வளவு நேரம்','அவசரம்',
    ],
    en: 'Each donation has an expiry time set by the donor. Donations marked URGENT have less than 2 hours remaining. Always prioritize urgent donations to minimize food waste.',
    hi: 'प्रत्येक दान के लिए दाता द्वारा एक समाप्ति समय निर्धारित किया जाता है। URGENT के रूप में चिह्नित दान में 2 घंटे से कम समय बचा है। खाद्य बर्बादी को कम करने के लिए हमेशा अर्जेंट दान को प्राथमिकता दें।',
    ta: 'ஒவ்வொரு நன்கொடைக்கும் நன்கொடையாளரால் காலாவதி நேரம் அமைக்கப்படுகிறது. URGENT என்று குறிக்கப்பட்ட உணவுகளில் 2 மணி நேரத்திற்கும் குறைவாக உள்ளது. உணவு வீணாவதை குறைக்க அவசர நன்கொடைகளுக்கு முன்னுரிமை அளிக்கவும்.',
  },
  {
    keywords: [
      // EN
      'food type','type of food','category','bakery','prepared','raw','packaged','beverage','drink','what food available',
      // HI
      'खाने का प्रकार','खाना किस प्रकार','श्रेणी','बेकरी','पका हुआ','कच्चा','क्या खाना मिलता है',
      // TA
      'உணவு வகை','என்ன உணவு','வகை','பேக்கரி','சமைத்த',
    ],
    en: 'ResQMeals supports multiple food categories including prepared meals, bakery items, raw ingredients, packaged food, and beverages. Each listing shows the type, quantity, and serving count.',
    hi: 'ResQMeals कई खाद्य श्रेणियों का समर्थन करता है जिसमें पका हुआ भोजन, बेकरी आइटम, कच्ची सामग्री, पैकेज्ड फूड और पेय पदार्थ शामिल हैं। प्रत्येक लिस्टिंग प्रकार, मात्रा और सर्विंग गिनती दिखाती है।',
    ta: 'ResQMeals சமைத்த உணவுகள், பேக்கரி பொருட்கள், மூல பொருட்கள், பதப்படுத்தப்பட்ட உணவு மற்றும் பானங்கள் உட்பட பல உணவு வகைகளை ஆதரிக்கிறது.',
  },
  {
    keywords: [
      'volunteer','who picks up','delivers','delivery','pickup','transport','who collects','driver','assigned','who comes','collect who',
      'వాలంటీర్','ఎవరు తీసుకుంటారు','డెలివరీ','పికప్',
      'স্বেচ্ছাসেবক','কে নয়','ডেলিভারি','পিকআপ',
      'स्वयंसेवक','कोण येतो','डिलिव्हरी','पिकअप',
      'ಸ್ವಯಂಸೇವಕ','ಯಾರು ಬರುತ್ತಾರೆ','ಡೆಲಿವರಿ',
      'സ്വയംസേവകൻ','ആര് വരും','ഡെലിവറി','പിക്കപ്പ്',
      'स्वयंसेवक','वॉलेंटियर','कौन उठाता','डिलीवरी',
      'தன்னார்வலர்','யார் எடுக்கிறார்','டெலிவரி',
      'bénévole','livraison','ramassage',
      'voluntario','entrega','recogida',
    ],
    en: 'Volunteers are assigned automatically after an NGO claims a donation. They handle pickup from the donor location and delivery to your NGO. You can track the pickup status in real time on your dashboard.',
    hi: 'NGO द्वारा दान का दावा करने के बाद स्वयंसेवकों को स्वचालित रूप से सौंपा जाता है। वे दाता स्थान से उठाने और आपके NGO को डिलीवरी संभालते हैं। आप अपने डैशबोर्ड पर रियल टाइम में पिकअप स्थिति को ट्रैक कर सकते हैं।',
    ta: 'NGO ஒரு நன்கொடையை கோரிய பிறகு தன்னார்வலர்கள் தானாகவே ஒதுக்கப்படுவார்கள். அவர்கள் நன்கொடையாளர் இடத்திலிருந்து எடுத்து உங்கள் NGO க்கு வழங்குவார்கள்.',
  },
  {
    keywords: [
      // EN
      'register ngo','ngo registration','how to register','sign up','create account','join','onboard',
      // HI
      'NGO रजिस्टर','पंजीकरण','कैसे जुड़ें','अकाउंट बनाएं','साइन अप','नया अकाउंट',
      // TA
      'பதிவு','NGO பதிவு','எப்படி சேர்வது','கணக்கு உருவாக்கு',
    ],
    en: 'NGOs can register on ResQMeals by visiting the Register page and selecting the NGO role. After submitting your details, your account will go through a verification process before being approved.',
    hi: 'NGO, ResQMeals पर Register पेज पर जाकर और NGO रोल चुनकर पंजीकरण कर सकते हैं। अपनी जानकारी जमा करने के बाद, आपका अकाउंट अनुमोदित होने से पहले सत्यापन प्रक्रिया से गुजरेगा।',
    ta: 'NGO கள் Register பக்கத்திற்கு சென்று NGO பாத்திரத்தை தேர்ந்தெடுப்பதன் மூலம் ResQMeals இல் பதிவு செய்யலாம். உங்கள் விவரங்களை சமர்ப்பித்த பிறகு, கணக்கு சரிபார்க்கப்படும்.',
  },
  {
    keywords: [
      // EN
      'verification','verified','pending','approval','approve','account status','waiting',
      // HI
      'सत्यापन','वेरिफिकेशन','पेंडिंग','अनुमोदन','प्रतीक्षा','कब अप्रूव','स्थिति',
      // TA
      'சரிபார்ப்பு','நிலுவை','அனுமதி','காத்திருக்கிறது',
    ],
    en: 'After registration, your NGO account enters a verification pending state. An admin reviews your details and approves the account, usually within 24 to 48 hours. You will be notified once approved.',
    hi: 'पंजीकरण के बाद, आपका NGO अकाउंट सत्यापन लंबित स्थिति में आ जाता है। एक व्यव्स्थापक आपकी जानकारी की समीक्षा करता है और आमतौर पर 24 से 48 घंटों में अकाउंट को अप्रूव करता है।',
    ta: 'பதிவுக்குப் பிறகு, உங்கள் NGO கணக்கு சரிபார்ப்பு நிலையில் நுழைகிறது. ஒரு நிர்வாகி உங்கள் விவரங்களை பரிசீலித்து பொதுவாக 24 முதல் 48 மணி நேரத்திற்குள் கணக்கை அங்கீகரிப்பார்.',
  },
  {
    keywords: [
      'donor','who donates','restaurant','canteen','caterer','hotel','office','kitchen','who gives food','who provides food','food source','where come',
      'దాతలు','ఎవరు ఇస్తారు','రెస్టారెంట్','క్యాంటీన్',
      'দাতা','কে দেয়','রেস্তোরাঁ','ক্যান্টিন',
      'दाता','कोण देतो','हॉटेल','कँटीन',
      'ದಾನಿ','ಯಾರು ಕೊಡುತ್ತಾರೆ','ರೆಸ್ಟಾರೆಂಟ್',
      'ദാതാവ്','ആര് നൽകുന്നു','ഹോട്ടൽ','കേന്ദ്രം',
      'दाता','कौन दान देता','रेस्तरां','कैंटीन',
      'நன்கொடையாளர்','யார் கொடுக்கிறார்','உணவகம்',
    ],
    en: 'Donors on ResQMeals include restaurants, corporate canteens, wedding caterers, temple kitchens, and individual households. They list surplus food with details like quantity, type, and pickup window.',
    hi: 'ResQMeals पर दाताओं में रेस्तरां, कॉर्पोरेट कैंटीन, शादी के केटरर्स, मंदिर की रसोई और व्यक्तिगत घर शामिल हैं। वे अतिरिक्त खाने को मात्रा, प्रकार और पिकअप विंडो के विवरण के साथ सूचीबद्ध करते हैं।',
    ta: 'ResQMeals இல் நன்கொடையாளர்களில் உணவகங்கள், கார்ப்பரேட் கேண்டீன்கள், திருமண கேட்டரர்கள், கோயில் சமையலறைகள் மற்றும் தனி வீடுகள் அடங்கும்.',
  },
  {
    keywords: [
      // EN
      'map','location','nearby','distance','find food','near me','around','available near',
      // HI
      'नक्शा','मैप','पास में','मेरे पास','आसपास','लोकेशन','कहां मिलेगा',
      // TA
      'வரைபடம்','அருகில்','இடம்','எங்கு கிடைக்கும்',
    ],
    en: 'The Available Donations page has a Map view showing all nearby donations on an interactive map. You can switch between Street, Satellite, Terrain, and Dark map layers, and view a 360-degree street view of any pickup location.',
    hi: 'Available Donations पेज में एक मानचित्र दृश्य है जो एक इंटरएक्टिव मानचित्र पर सभी पास के दान दिखाता है। आप Street, Satellite, Terrain और Dark मानचित्र परतों के बीच स्विच कर सकते हैं।',
    ta: 'Available Donations பக்கத்தில் ஒரு வரைபட காட்சி உள்ளது, இது அருகிலுள்ள அனைத்து நன்கொடைகளையும் காட்டுகிறது. Street, Satellite, Terrain மற்றும் Dark வரைபட அடுக்குகளுக்கு இடையே மாறலாம்.',
  },
  {
    keywords: [
      // EN
      'street view','360','panoramic','view location','see location','virtual tour',
      // HI
      'स्ट्रीट व्यू','360','जगह देखो','वर्चुअल टूर','लोकेशन देखें',
      // TA
      '360','இடம் பார்க்க','தெரு பார்வை',
    ],
    en: 'ResQMeals offers a 360-degree Street View for each donation pickup location. Click the 360 View button on any donation card to see a Google Street View of the exact location before sending a volunteer.',
    hi: 'ResQMeals प्रत्येक दान पिकअप स्थान के लिए 360-डिग्री Street View प्रदान करता है। किसी भी दान कार्ड पर 360 View बटन पर क्लिक करें।',
    ta: 'ResQMeals ஒவ்வொரு நன்கொடை எடுக்கும் இடத்திற்கும் 360 டிகிரி Street View வழங்குகிறது. எந்த நன்கொடை அட்டையிலும் 360 View பொத்தானை கிளிக் செய்யுங்கள்.',
  },
  {
    keywords: [
      // EN
      'food safety','safe food','quality','hygiene','safe to eat','checking','food check','quality issue','report issue',
      // HI
      'खाना सुरक्षित','सुरक्षा','गुणवत्ता','स्वच्छता','खाना खाने योग्य है','रिपोर्ट करें','समस्या',
      // TA
      'உணவு பாதுகாப்பு','தரம்','சுகாதாரம்','பாதுகாப்பான உணவு','புகார்',
    ],
    en: 'All donors follow food safety guidelines. You can report food quality issues after collection through the donation history page. The platform has a safety scoring system to flag repeated quality problems.',
    hi: 'सभी दाता खाद्य सुरक्षा दिशानिर्देशों का पालन करते हैं। आप संग्रह के बाद दान इतिहास पेज के माध्यम से खाद्य गुणवत्ता समस्याओं की रिपोर्ट कर सकते हैं।',
    ta: 'அனைத்து நன்கொடையாளர்களும் உணவு பாதுகாப்பு வழிகாட்டுதல்களை பின்பற்றுகிறார்கள். நன்கொடை வரலாறு பக்கத்தின் மூலம் உணவு தர சிக்கல்களை புகாரளிக்கலாம்.',
  },
  {
    keywords: [
      // EN
      'history','past collection','previous donation','collection history','past order','record',
      // HI
      'इतिहास','पिछला संग्रह','पिछले दान','हिस्ट्री','पुराना रिकॉर्ड',
      // TA
      'வரலாறு','கடந்த சேகரிப்பு','பழைய நன்கொடை','பதிவு',
    ],
    en: 'Your collection history is on the History page. It shows all past claimed donations, their status, donor details, and timestamps. You can also view your impact statistics there.',
    hi: 'आपका संग्रह इतिहास History पेज पर है। यह सभी पिछले दावा किए गए दानों, उनकी स्थिति, दाता विवरण और समय दिखाता है।',
    ta: 'உங்கள் சேகரிப்பு வரலாறு History பக்கத்தில் உள்ளது. இது அனைத்து கடந்த கோரிய நன்கொடைகள், அவற்றின் நிலை, நன்கொடையாளர் விவரங்கள் மற்றும் நேரங்களை காட்டுகிறது.',
  },
  {
    keywords: [
      // EN
      'impact','meals collected','people fed','co2','carbon','statistics','stats','achievement','report',
      // HI
      'प्रभाव','कितना खाना','कितने लोग','सांख्यिकी','आंकड़े','उपलब्धि','रिपोर्ट',
      // TA
      'தாக்கம்','எத்தனை உணவு','எத்தனை பேர்','புள்ளிவிவரம்','சாதனை',
    ],
    en: 'Your NGO dashboard shows real-time impact metrics including total meals collected, number of people fed, active claims, and CO2 saved by redistributing food instead of sending it to landfill.',
    hi: 'आपका NGO डैशबोर्ड रियल-टाइम प्रभाव मेट्रिक्स दिखाता है जिसमें कुल एकत्रित भोजन, खिलाए गए लोगों की संख्या, सक्रिय दावे और बचाया गया CO2 शामिल है।',
    ta: 'உங்கள் NGO டாஷ்போர்டு சேகரிக்கப்பட்ட மொத்த உணவுகள், ஊட்டப்பட்ட மக்களின் எண்ணிக்கை, செயலில் உள்ள கோரிக்கைகள் மற்றும் சேமிக்கப்பட்ட CO2 உட்பட நிகழ்நேர தாக்க அளவீடுகளை காட்டுகிறது.',
  },
  {
    keywords: [
      // EN
      'pickup window','pickup time','when collect','collection time','schedule','timing','when to pick',
      // HI
      'पिकअप समय','कब उठाएं','समय सारिणी','कब लेना है','शेड्यूल',
      // TA
      'எடுக்கும் நேரம்','எப்போது சேகரிக்க','அட்டவணை',
    ],
    en: 'Each donation has a pickup window — a start and end time during which it must be collected. Missing this window means the food may no longer be safe. Volunteers receive reminders to collect on time.',
    hi: 'प्रत्येक दान में एक पिकअप विंडो होती है — एक शुरुआत और समाप्ति समय जिसके दौरान इसे एकत्र किया जाना चाहिए। इस समय सीमा को चूकने का मतलब है कि खाना अब सुरक्षित नहीं हो सकता।',
    ta: 'ஒவ்வொரு நன்கொடைக்கும் ஒரு எடுக்கும் சாளரம் உள்ளது — அது சேகரிக்கப்பட வேண்டிய தொடக்க மற்றும் முடிவு நேரம். இந்த சாளரத்தை தவறவிட்டால் உணவு பாதுகாப்பற்றதாக இருக்கலாம்.',
  },
  {
    keywords: [
      // EN
      'contact donor','donor phone','reach donor','call donor','donor contact','phone number',
      // HI
      'दाता से संपर्क','फोन नंबर','दाता का नंबर','कॉल करें','संपर्क करें',
      // TA
      'நன்கொடையாளரை தொடர்புகொள்','தொலைபேசி எண்','தொடர்பு',
    ],
    en: 'You can find the donor contact information on the donation detail card. The phone number is listed so you can coordinate pickup timing directly with the donor if needed.',
    hi: 'आप दान विवरण कार्ड पर दाता संपर्क जानकारी पा सकते हैं। फोन नंबर सूचीबद्ध है ताकि आप जरूरत पड़ने पर सीधे दाता के साथ पिकअप समय समन्वय कर सकें।',
    ta: 'நன்கொடை விவர அட்டையில் நன்கொடையாளர் தொடர்பு தகவலை காணலாம். தொலைபேசி எண் பட்டியலிடப்பட்டுள்ளது.',
  },
  {
    keywords: [
      // EN
      'login','sign in','password','forgot password','reset password','access account','cant login',
      // HI
      'लॉगिन','साइन इन','पासवर्ड','पासवर्ड भूल गया','रीसेट','अकाउंट एक्सेस',
      // TA
      'உள்நுழை','கடவுச்சொல்','மறந்துவிட்டேன்','மீட்டமை',
    ],
    en: 'You can log in to ResQMeals using your registered email and password on the Login page. If you have forgotten your password, use the Forgot Password option to reset it via email.',
    hi: 'आप Login पेज पर अपने पंजीकृत ईमेल और पासवर्ड का उपयोग करके ResQMeals में लॉग इन कर सकते हैं। यदि आप अपना पासवर्ड भूल गए हैं, तो ईमेल के माध्यम से रीसेट करने के लिए Forgot Password विकल्प का उपयोग करें।',
    ta: 'Login பக்கத்தில் உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சல் மற்றும் கடவுச்சொல்லை பயன்படுத்தி ResQMeals இல் உள்நுழையலாம்.',
  },
  {
    keywords: [
      // EN
      'admin','administrator','who manages','platform team','resqmeals team','support team',
      // HI
      'व्यवस्थापक','एडमिन','प्लेटफॉर्म टीम','कौन चलाता है','प्रबंधन',
      // TA
      'நிர்வாகி','யார் நிர்வகிக்கிறார்','குழு',
    ],
    en: 'The ResQMeals admin team manages user verification, monitors donations, resolves disputes, and ensures platform integrity. Admins approve NGO and volunteer accounts after reviewing their details.',
    hi: 'ResQMeals एडमिन टीम उपयोगकर्ता सत्यापन का प्रबंधन करती है, दान की निगरानी करती है, विवादों को हल करती है और प्लेटफ़ॉर्म की अखंडता सुनिश्चित करती है।',
    ta: 'ResQMeals நிர்வாக குழு பயனர் சரிபார்ப்பை நிர்வகிக்கிறது, நன்கொடைகளை கண்காணிக்கிறது மற்றும் தகராறுகளை தீர்க்கிறது.',
  },
  {
    keywords: [
      // EN
      'help','guide','support','how do i','tutorial','assistance','how to use','getting started',
      // HI
      'मदद','सहायता','गाइड','कैसे करूं','ट्यूटोरियल','शुरू करें',
      // TA
      'உதவி','வழிகாட்டி','எப்படி பயன்படுத்துவது','ஆரம்பிக்க',
    ],
    en: 'I am here to help! You can ask me anything about food donations, NGO operations, volunteer coordination, or using the ResQMeals platform. Just speak your question clearly.',
    hi: 'मैं यहाँ मदद करने के लिए हूँ! आप मुझसे खाद्य दान, NGO संचालन, स्वयंसेवक समन्वय, या ResQMeals प्लेटफ़ॉर्म के उपयोग के बारे में कुछ भी पूछ सकते हैं।',
    ta: 'நான் உதவ இங்கே இருக்கிறேன்! உணவு நன்கொடைகள், NGO செயல்பாடுகள், தன்னார்வலர் ஒருங்கிணைப்பு அல்லது ResQMeals தளத்தை பயன்படுத்துவது பற்றி என்னிடம் எதையும் கேளுங்கள்.',
  },
];

// Off-topic responses per language
export const OFF_TOPIC: Record<string, string> = {
  'en-IN': 'That question is outside the ResQMeals domain. I can only assist with food donations, NGO operations, and the ResQMeals platform.',
  'en-US': 'That question is outside the ResQMeals domain. I can only assist with food donations, NGO operations, and the ResQMeals platform.',
  'hi-IN': 'यह प्रश्न ResQMeals के क्षेत्र से बाहर है। मैं केवल खाद्य दान, NGO संचालन और ResQMeals प्लेटफ़ॉर्म से संबंधित सहायता कर सकता हूँ।',
  'ta-IN': 'அந்த கேள்வி ResQMeals களத்திற்கு வெளியே உள்ளது. உணவு நன்கொடைகள், NGO செயல்பாடுகள் மற்றும் ResQMeals தளம் தொடர்பான உதவி மட்டுமே வழங்க முடியும்.',
  'te-IN': 'ఆ ప్రశ్న ResQMeals పరిధికి వెలుపల ఉంది. ఆహార విరాళాలు, NGO కార్యకలాపాలు మరియు ResQMeals గురించి మాత్రమే సహాయం చేయగలను.',
  'bn-IN': 'সেই প্রশ্নটি ResQMeals এর বাইরে। খাদ্য দান, NGO কার্যক্রম এবং ResQMeals প্ল্যাটফর্ম সম্পর্কেই সাহায্য করতে পারি।',
  'mr-IN': 'तो प्रश्न ResQMeals च्या बाहेर आहे. फक्त अन्न दान, NGO कार्यक्रम आणि ResQMeals बद्दलच मदत करू शकतो.',
  'kn-IN': 'ಆ ಪ್ರಶ್ನೆ ResQMeals ಕ್ಷೇತ್ರದ ಹೊರಗಿದೆ. ಆಹಾರ ದಾನ, NGO ಕಾರ್ಯಾಚರಣೆ ಮತ್ತು ResQMeals ಬಗ್ಗೆ ಮಾತ್ರ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.',
  'ml-IN': 'ആ ചോദ്യം ResQMeals ഡൊമൈനിന് പുറത്താണ്. ഭക്ഷ്യദാനം, NGO, ResQMeals എന്നിവയെ കുറിച്ച് മാത്രമേ സഹായിക്കാൻ കഴിയൂ.',
  'gu-IN': 'તે પ્રશ્ન ResQMeals ના ક્ષેત્રની બહાર છે. ફક્ત ખોરાક દાન, NGO કામગીરી અને ResQMeals પ્લેટફોર્મ વિશે જ સહાય કરી શકું છું.',
  'pa-IN': 'ਉਹ ਸਵਾਲ ResQMeals ਦੇ ਖੇਤਰ ਤੋਂ ਬਾਹਰ ਹੈ। ਮੈਂ ਸਿਰਫ਼ ਭੋਜਨ ਦਾਨ, NGO ਸੰਚਾਲਨ ਅਤੇ ResQMeals ਪਲੇਟਫਾਰਮ ਬਾਰੇ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ।',
  'ur-IN': 'وہ سوال ResQMeals کے دائرے سے باہر ہے۔ میں صرف کھانے کے عطیات، NGO آپریشنز اور ResQMeals پلیٹ فارم کے بارے میں مدد کر سکتا ہوں۔',
  'fr-FR': "Cette question est en dehors du domaine ResQMeals. Je peux uniquement aider avec les dons alimentaires, les opérations NGO et la plateforme ResQMeals.",
  'es-ES': 'Esa pregunta está fuera del dominio de ResQMeals. Solo puedo ayudar con donaciones de alimentos, operaciones de ONGs y la plataforma ResQMeals.',
  'de-DE': 'Diese Frage liegt außerhalb des ResQMeals-Bereichs. Ich kann nur bei Lebensmittelspenden, NGO-Betrieb und der ResQMeals-Plattform helfen.',
};



// Lookup translated answer by language code and KB entry index
export function getAnswer(entry: KBEntry, langCode: string, entryIndex: number): string {
  const prefix = langCode.split('-')[0];
  // 1. extras on entry
  if (entry.extras?.[langCode]) return entry.extras[langCode];
  if (entry.extras?.[prefix]) return entry.extras[prefix];
  // 2. central answers table
  const row = ANSWERS[entryIndex];
  if (row?.[langCode]) return row[langCode];
  if (row?.[prefix]) return row[prefix];
  // 3. named fields
  if (prefix === 'hi') return entry.hi;
  if (prefix === 'ta') return entry.ta;
  return entry.en;
}

// Word-level fuzzy match — tokenise both query and keywords, count word hits
export function findBestEntry(query: string): KBEntry | null {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 1);
  if (words.length === 0) return null;

  let best: { score: number; entry: KBEntry | null } = { score: 0, entry: null };

  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      if (q.includes(kwLower)) {
        // Exact phrase hit — strong signal
        score += kwLower.split(/\s+/).length * 4;
      } else {
        // Individual word overlap
        for (const w of words) {
          if (w.length > 1 && (kwLower === w || kwLower.includes(w) || w.includes(kwLower))) {
            score += 1;
          }
        }
      }
    }
    if (score > best.score) best = { score, entry };
  }

  // Threshold = 1: any single keyword overlap qualifies
  return best.score >= 1 ? best.entry : null;
}
