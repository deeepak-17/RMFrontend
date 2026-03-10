// ResQMeals Voice Assistant — All-Language Answer Translations
// Maps KB entry index → language code → translated answer (1-2 sentences)
// Entry indices match the order in KB array in vaKnowledge.ts

export const ANSWERS: Record<number, Record<string, string>> = {
  // 0: What is ResQMeals
  0: {
    'te': 'ResQMeals అనేది రెస్టారెంట్లు మరియు క్యాంటీన్ల నుండి మిగిలిన ఆహారాన్ని అవసరమైన వారికి చేరవేసే ప్లాట్‌ఫారం.',
    'bn': 'ResQMeals একটি খাদ্য উদ্ধার প্ল্যাটফর্ম যা রেস্টুরেন্ট থেকে উদ্বৃত্ত খাবার সংগ্রহ করে NGO-র মাধ্যমে প্রয়োজনীয়দের কাছে পৌঁছে দেয়।',
    'mr': 'ResQMeals हे एक अन्न बचाव व्यासपीठ आहे जे जास्तीचे अन्न NGO आणि स्वयंसेवकांद्वारे गरजूंपर्यंत पोहोचवते.',
    'kn': 'ResQMeals ಎಂಬುದು ರೆಸ್ಟೊರೆಂಟ್‌ಗಳಿಂದ ಉಳಿದ ಆಹಾರವನ್ನು NGO ಮತ್ತು ಸ್ವಯಂಸೇವಕರ ಮೂಲಕ ಅಗತ್ಯವಿರುವವರಿಗೆ ತಲುಪಿಸುವ ವೇದಿಕೆ.',
    'ml': 'ResQMeals ഒരു ഭക്ഷ്യ രക്ഷാ പ്ലാറ്റ്ഫോം ആണ്, ഇത് ഹോട്ടലുകളിൽ നിന്ന് മിച്ചം വരുന്ന ഭക്ഷണം NGO-കൾ വഴി ആവശ്യക്കാർക്ക് എത്തിക്കുന്നു.',
    'gu': 'ResQMeals એ ખોરાક બચાવ મંચ છે જે રેસ્ટ્રોંટ્સ અને કેન્ટીનમાંથી વધારાનો ખોરાક NGO દ્વારા જરૂરિયાતમંદ લોકો સુધી પહોંચાડે છે.',
    'pa': 'ResQMeals ਇੱਕ ਭੋਜਨ ਬਚਾਅ ਪਲੇਟਫਾਰਮ ਹੈ ਜੋ ਰੈਸਟੋਰੈਂਟਾਂ ਤੋਂ ਬਚਿਆ ਖਾਣਾ NGO ਰਾਹੀਂ ਲੋੜਵੰਦਾਂ ਤੱਕ ਪਹੁੰਚਾਉਂਦਾ ਹੈ।',
    'ur': 'ResQMeals ایک فوڈ ریسکیو پلیٹ فارم ہے جو ریستورانوں سے بچا ہوا کھانا NGO کے ذریعے ضرورتمندوں تک پہنچاتا ہے۔',
    'fr': "ResQMeals est une plateforme de récupération alimentaire qui redistribue les surplus de nourriture des restaurants et cantines aux ONG et aux personnes dans le besoin.",
    'es': 'ResQMeals es una plataforma de rescate de alimentos que redistribuye el excedente de comida de restaurantes y cantinas a ONG y personas necesitadas.',
    'de': 'ResQMeals ist eine Lebensmittelrettungsplattform, die überschüssiges Essen von Restaurants über NGOs und Freiwillige an Bedürftige verteilt.',
  },
  // 1: How to claim
  1: {
    'te': 'Available Donations పేజీకి వెళ్ళి, ఏదైనా ఆహారం ప్రక్కన Claim బటన్ నొక్కండి. వాలంటీర్ మీ NGO కి అందించడానికి ఏర్పాటు అవుతాడు.',
    'bn': 'Available Donations পেজে গিয়ে Claim বাটনে ক্লিক করুন। একজন স্বেচ্ছাসেবক খাবার তুলে আপনার NGO-তে পৌঁছে দেবেন।',
    'mr': 'Available Donations पेजवर जाऊन Claim बटण दाबा. एक स्वयंसेवक दान उचलून तुमच्या NGO ला पोहोचवेल.',
    'kn': 'Available Donations ಪೇಜ್‌ಗೆ ಹೋಗಿ Claim ಬಟನ್ ಒತ್ತಿ. ಒಬ್ಬ ಸ್ವಯಂಸೇವಕ ಆಹಾರ ತೆಗೆದು ನಿಮ್ಮ NGO ಗೆ ತಲುಪಿಸುತ್ತಾರೆ.',
    'ml': 'Available Donations പേജിൽ ചെന്ന് Claim ബട്ടൺ അമർത്തുക. ഒരു സ്വയംസേവകൻ ഭക്ഷണം ശേഖരിച്ച് NGO-ലേക്ക് എത്തിക്കും.',
    'gu': 'Available Donations પેજ પર જઈ Claim બટન દબાવો. એક સ્વયંસેવક ભોજન ઉઠાવી તમારા NGO સુધી પહોંચાડશે.',
    'pa': 'Available Donations ਪੇਜ ਤੇ ਜਾ ਕੇ Claim ਬਟਨ ਦਬਾਓ। ਇੱਕ ਵਾਲੰਟੀਅਰ ਖਾਣਾ ਚੁੱਕ ਕੇ ਤੁਹਾਡੇ NGO ਤੱਕ ਪਹੁੰਚਾਵੇਗਾ।',
    'ur': 'Available Donations صفحے پر جائیں اور Claim بٹن دبائیں۔ ایک رضاکار کھانا اٹھا کر آپ کے NGO تک پہنچائے گا۔',
    'fr': "Allez sur la page Available Donations et cliquez sur Claim. Un bénévole récupérera la nourriture et la livrera à votre ONG.",
    'es': 'Ve a la página Available Donations y haz clic en Claim. Un voluntario recogerá la comida y la entregará en tu ONG.',
    'de': 'Gehen Sie zur Seite Available Donations und klicken Sie auf Claim. Ein Freiwilliger holt das Essen ab und liefert es an Ihre NGO.',
  },
  // 2: Expiry/Urgent
  2: {
    'te': 'ప్రతి దానానికి గడువు సమయం ఉంది. URGENT అంటే 2 గంటల కంటే తక్కువ సమయం మిగిలింది. అవసరమైన దానాలకు ముందస్తు ప్రాధాన్యత ఇవ్వండి.',
    'bn': 'প্রতিটি দানের মেয়াদ আছে। URGENT মানে মাত্র ২ ঘন্টা বাকি। জরুরি দান সংগ্রহে অগ্রাধিকার দিন।',
    'mr': 'प्रत्येक दानाची मर्यादा आहे. URGENT म्हणजे फक्त 2 तास शिल्लक. अर्जंट दानांना प्राधान्य द्या.',
    'kn': 'ಪ್ರತಿ ದಾನಕ್ಕೂ ಮೀಯಾದಿ ಇದೆ. URGENT ಅಂದರೆ ಕೇವಲ 2 ಗಂಟೆ ಉಳಿದಿದೆ. ತುರ್ತು ದಾನಗಳಿಗೆ ಮೊದಲ ಆದ್ಯತೆ ನೀಡಿ.',
    'ml': 'ഓരോ ദാനത്തിനും കാലാവധിയുണ്ട്. URGENT എന്നാൽ 2 മണിക്കൂർ മാത്രം ബാക്കിയുണ്ട്. അടിയന്തിര ദാനങ്ങൾക്ക് മുൻഗണന നൽകുക.',
    'gu': 'દરેક દાનની સમય મર્યાદા હોય છે. URGENT એટલે ફક્ત 2 કલાક બાકી. તાકીદી દાન પ્રથમ લો.',
    'pa': 'ਹਰ ਦਾਨ ਦੀ ਸਮਾਂ ਸੀਮਾ ਹੈ। URGENT ਦਾ ਮਤਲਬ ਸਿਰਫ਼ 2 ਘੰਟੇ ਬਚੇ ਹਨ। ਜ਼ਰੂਰੀ ਦਾਨ ਪਹਿਲਾਂ ਲਓ।',
    'ur': 'ہر عطیے کی وقت کی حد ہے۔ URGENT کا مطلب صرف 2 گھنٹے باقی ہیں۔ فوری عطیات کو ترجیح دیں۔',
    'fr': "Chaque don a une date d'expiration. URGENT signifie moins de 2 heures restantes. Priorisez les dons urgents.",
    'es': 'Cada donación tiene una fecha de vencimiento. URGENT significa menos de 2 horas restantes. Prioriza las donaciones urgentes.',
    'de': 'Jede Spende hat ein Ablaufdatum. URGENT bedeutet weniger als 2 Stunden verbleibend. Priorisieren Sie dringende Spenden.',
  },
  // 4: Volunteer
  4: {
    'te': 'NGO దానం క్లెయిమ్ చేసిన తర్వాత వాలంటీర్ స్వయంచాలకంగా కేటాయించబడతాడు. వారు ఆహారం తీసుకుని మీ NGO కి అందిస్తారు.',
    'bn': 'NGO দাবি করার পরে স্বেচ্ছাসেবক স্বয়ংক্রিয়ভাবে নিযুক্ত হন। তারা দাতার কাছ থেকে খাবার তুলে NGO-তে পৌঁছে দেন।',
    'mr': 'NGO ने दावा केल्यानंतर स्वयंसेवक स्वयंचलितपणे नियुक्त केला जातो. ते दात्याकडून अन्न उचलून NGO ला पोहोचवतात.',
    'kn': 'NGO ಕ್ಲೈಮ್ ಮಾಡಿದ ನಂತರ ಸ್ವಯಂಸೇವಕ ತಾನಾಗಿ ನಿಯೋಜಿಸಲ್ಪಡುತ್ತಾರೆ. ಅವರು ದಾನಿಯಿಂದ ಆಹಾರ ತೆಗೆದು NGO ಗೆ ತಲುಪಿಸುತ್ತಾರೆ.',
    'ml': 'NGO ക്ലെയിം ചെയ്ത ശേഷം സ്വയംസേവകൻ സ്വയം നിക്ഷേപിക്കപ്പെടും. അവർ ദാതാവിൽ നിന്ന് ഭക്ഷണം ശേഖരിച്ച് NGO-ലേക്ക് എത്തിക്കും.',
    'gu': 'NGO e claim ker -ya baad volunteer apomelic nayukt thai jay chhe. Te dataa pasethe khorak uthavi NGO sudhi pohonchade chhe.',
    'pa': 'NGO ਵੱਲੋਂ ਕਲੇਮ ਕਰਨ ਤੋਂ ਬਾਅਦ ਵਾਲੰਟੀਅਰ ਆਪਣੇ ਆਪ ਨਿਯੁਕਤ ਹੋ ਜਾਂਦਾ ਹੈ। ਉਹ ਦਾਨੀ ਤੋਂ ਖਾਣਾ ਚੁੱਕ ਕੇ NGO ਦੇ ਦਿੰਦਾ ਹੈ।',
    'ur': 'NGO کے دعوی کرنے کے بعد رضاکار خود بخود مقرر ہو جاتا ہے۔ وہ عطیہ دہندہ سے کھانا اٹھا کر NGO تک پہنچاتا ہے۔',
    'fr': "Après réclamation par l'ONG, un bénévole est assigné automatiquement. Il récupère la nourriture et la livre à votre ONG.",
    'es': 'Después de reclamar por la ONG, un voluntario es asignado automáticamente. Recoge la comida y la lleva a su ONG.',
    'de': 'Nach der Anforderung durch die NGO wird automatisch ein Freiwilliger zugewiesen. Er holt das Essen ab und liefert es zur NGO.',
  },
  // 14: Help
  16: {
    'te': 'నేను సహాయం చేయడానికి ఇక్కడ ఉన్నాను! ఆహారం, NGO, వాలంటీర్ లేదా ResQMeals గురించి ఏదైనా అడగండి.',
    'bn': 'আমি সাহায্য করতে এখানে আছি! খাদ্য দান, NGO, স্বেচ্ছাসেবক বা ResQMeals সম্পর্কে যেকোনো প্রশ্ন করুন।',
    'mr': 'मी मदत करण्यासाठी येथे आहे! अन्न दान, NGO, स्वयंसेवक किंवा ResQMeals बद्दल काहीही विचारा.',
    'kn': 'ನಾನು ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ! ಆಹಾರ ದಾನ, NGO, ಸ್ವಯಂಸೇವಕ ಅಥವಾ ResQMeals ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ.',
    'ml': 'ഞാൻ സഹായിക്കാൻ ഇവിടെ ഉണ്ട്! ഭക്ഷ്യ ദാനം, NGO, സ്വയംസേവകർ അല്ലെങ്കിൽ ResQMeals ഏതിനെ കുറിച്ചും ചോദിക്കൂ.',
    'gu': 'હું સહાય કરવા અહીં છું! ખોરાક દાન, NGO, સ્વયંસેવક અથવા ResQMeals વિશે કંઈ પૂછો.',
    'pa': 'ਮੈਂ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ! ਭੋਜਨ ਦਾਨ, NGO, ਵਾਲੰਟੀਅਰ ਜਾਂ ResQMeals ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।',
    'ur': 'میں مدد کے لیے حاضر ہوں! کھانے کے عطیات، NGO، رضاکار یا ResQMeals کے بارے میں کچھ بھی پوچھیں۔',
    'fr': "Je suis là pour vous aider! Posez-moi des questions sur les dons alimentaires, les ONG, les bénévoles ou la plateforme ResQMeals.",
    'es': '¡Estoy aquí para ayudar! Pregúntame sobre donaciones de alimentos, ONG, voluntarios o la plataforma ResQMeals.',
    'de': 'Ich bin hier um zu helfen! Fragen Sie mich über Lebensmittelspenden, NGOs, Freiwillige oder die ResQMeals-Plattform.',
  },
};
