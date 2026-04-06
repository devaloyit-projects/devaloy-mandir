
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // --- 1. MULTI-LANGUAGE CONFIGURATION ---
    const translations = {
        'en': {
            'nav-home': 'Home',
            'nav-about': 'About Us',
            'nav-activities': 'Activities',
            'nav-aims': 'Aims & Objective',
            'nav-gallery': 'Gallery',
            'nav-donate': 'Donate',
            'nav-logo': 'Devaloy Mandir',
            'skip-link': 'Skip to main content',
            'flyer-fallback': 'Add your flyer image at media/img_5506.png to show this popup.',
            'hero-badge': 'Community Spiritual Center',
            'hero-title': 'Welcome to Devaloy Mandir',
            'hero-subtitle': 'A sacred space for spiritual growth, community connection, and inner peace',
            'hero-donate': 'Donate Now',
            'hero-find': 'Find Us',
            'stat-days-val': '7',
            'stat-days-label': 'Days Open',
            'stat-activities-val': '20+',
            'stat-activities-label': 'Monthly Activities',
            'stat-ages-val': 'All Ages',
            'stat-ages-label': 'Welcomed',
            'about-title': 'About Our Temple',
            'mission-title': 'Our Mission',
            'mission-p1': 'Devaloy Mandir is dedicated to providing a welcoming sanctuary for individuals seeking spiritual development and community support. We believe in fostering compassion, wisdom, and inner peace.',
            'mission-p2': 'Our community gatherings, meditation sessions, and educational programs are designed to help members of all backgrounds discover their spiritual path and connect with like-minded individuals.',
            'activities-title': 'Our Activities',
            'activity1-title': 'Meditation & Prayer',
            'activity1-desc': 'Daily guided meditation sessions and prayer circles to foster inner peace and spiritual connection.',
            'activity2-title': 'Spiritual Education',
            'activity2-desc': 'Classes and workshops on ancient wisdom traditions, philosophy, and personal growth.',
            'activity3-title': 'Community Programs',
            'activity3-desc': 'Outreach initiatives, charity events, and community service opportunities for all members.',
            'activity4-title': 'Celebrations & Events',
            'activity4-desc': 'Special ceremonies, festivals, and gatherings throughout the year celebrating spiritual milestones.',
            'aims-title': 'Aims & Objectives',
            'aim1-title': 'Spiritual Growth',
            'aim1-desc': 'Foster individual spiritual development through meditation, prayer, and self-discovery practices accessible to all members.',
            'aim2-title': 'Preserve Traditions',
            'aim2-desc': 'Maintain and celebrate sacred cultural and spiritual traditions while adapting to modern community needs.',
            'aim3-title': 'Community Service',
            'aim3-desc': 'Serve the wider community through charitable programs, outreach initiatives, and support for those in need.',
            'aim4-title': 'Unity & Harmony',
            'aim4-desc': 'Create an inclusive, welcoming space where people of all backgrounds can come together in peace and mutual respect.',
            'aim5-title': 'Education & Wisdom',
            'aim5-desc': 'Provide educational programs and workshops that deepen understanding of spiritual philosophy and personal growth.',
            'aim6-title': 'Transform Lives',
            'aim6-desc': 'Empower individuals to discover their purpose, achieve inner peace, and contribute positively to society.',
            'learn-more': 'Click to learn more →',
            'events-title': 'Upcoming Events',
            'events-subtitle': 'Join us for spiritual gatherings and community celebrations',
            'gallery-title': 'Gallery',
            'gallery-subtitle': 'Explore moments from our temple, events, and community gatherings',
            'gallery1-title': 'Main Prayer Hall',
            'gallery2-title': 'Cultural Festivities',
            'gallery3-title': 'Community Gathering',
            'gallery4-title': 'Durga Puja Celebration',
            'gallery5-title': 'Temple Premises',
            'gallery6-title': 'Charitable Service',
            'location-title': 'Visit Us',
            'location-subtitle': 'We welcome you to join our community and find peace',
            'loc-card-title': 'Devaloy Mandir',
            'loc-card-sub': 'A Sacred Sanctuary for All',
            'loc-addr-label': 'Address',
            'loc-addr-val': '8529 Commonwealth Blvd, Bellerose, NY 11426',
            'loc-hours-label': 'Opening Hours',
            'loc-hours-val': 'Mon - Fri: 6:00 AM - 9:00 PM, Sat - Sun: 8:00 AM - 8:00 PM',
            'loc-contact-label': 'Contact',
            'loc-email-label': 'Email',
            'loc-get-dirs': 'Get Directions',
            'loc-park-label': 'Parking:',
            'loc-park-val': 'Free street parking is available along Commonwealth Blvd and surrounding side streets.',
            'loc-bus-label': 'Public Transport:',
            'loc-bus-val': 'Q1 and Q27 bus stops are within a 5-minute walking distance.',
            'map-overlay': 'Located in the heart of Bellerose, Queens.',
            'donate-title': 'Support Our Mission',
            'donate-subtitle': 'Your generous contribution helps us maintain our temple and serve our community.',
            'card-donate-title': 'Donate with Card',
            'donate-quick-label': 'Quick Selection',
            'donate-custom-label': 'Custom Amount ($)',
            'donate-freq-label': 'Frequency',
            'freq-once': 'One-Time Gift',
            'freq-monthly': 'Monthly Support (Recommended)',
            'donate-submit': 'Continue to Secure Payment',
            'donate-secure': 'Secured by',
            'zelle-badge': 'Most Efficient',
            'zelle-title': 'Donate via Zelle',
            'zelle-desc': 'No processing fees. 100% of your gift goes directly to the temple\'s programs.',
            'zelle-rec-label': 'Recipient:',
            'zelle-hint': 'Use your banking app to send your gift.',
            'foot-about-title': 'About',
            'foot-mission': 'Our Mission',
            'foot-services': 'Services',
            'foot-location': 'Location',
            'foot-involved-title': 'Get Involved',
            'foot-donate': 'Donate',
            'foot-volunteer': 'Volunteer',
            'foot-join': 'Join Events',
            'foot-contact-title': 'Contact',
            'foot-news-title': 'Newsletter',
            'foot-news-desc': 'Subscribe for updates and spiritual wisdom.',
            'foot-news-btn': 'Join',
            'foot-copy': '© 2026 Devaloy Mandir. All rights reserved. Built with compassion and care.'
        },
        'bn': {
            'nav-home': 'হোম',
            'nav-about': 'আমাদের সম্পর্কে',
            'nav-activities': 'কার্যক্রম',
            'nav-aims': 'লক্ষ্য ও উদ্দেশ্য',
            'nav-gallery': 'গ্যালারি',
            'nav-donate': 'দান করুন',
            'nav-logo': 'দেবালয় মন্দির',
            'skip-link': 'মূল কন্টেন্টে যান',
            'flyer-fallback': 'এই পপআপটি দেখাতে media/img_5506.png এ আপনার ফ্লায়ার ইমেজ যোগ করুন।',
            'hero-badge': 'কমিউনিটি আধ্যাত্মিক কেন্দ্র',
            'hero-title': 'দেবালয় মন্দিরে আপনাকে স্বাগতম',
            'hero-subtitle': 'আধ্যাত্মিক বৃদ্ধি, সামাজিক সংযোগ এবং মানসিক শান্তির জন্য একটি পবিত্র স্থান',
            'hero-donate': 'এখনই দান করুন',
            'hero-find': 'আমাদের অবস্থান',
            'stat-days-val': '৭',
            'stat-days-label': 'দিন খোলা',
            'stat-activities-val': '২০+',
            'stat-activities-label': 'মাসিক কার্যক্রম',
            'stat-ages-val': 'সব বয়স',
            'stat-ages-label': 'স্বাগত',
            'about-title': 'আমাদের মন্দির সম্পর্কে',
            'mission-title': 'আমাদের লক্ষ্য',
            'mission-p1': 'দেবালয় মন্দির আধ্যাত্মিক বিকাশ এবং সামাজিক সহায়তার সন্ধানকারী ব্যক্তিদের জন্য একটি স্বাগত অভয়ারণ্য প্রদানের জন্য নিবেদিত। আমরা করুণা, প্রজ্ঞা এবং মানসিক শান্তি বৃদ্ধিতে বিশ্বাস করি।',
            'mission-p2': 'আমাদের সামাজিক সমাবেশ, ধ্যান সেশন এবং শিক্ষামূলক প্রোগ্রামগুলি সকল স্তরের সদস্যদের তাদের আধ্যাত্মিক পথ আবিষ্কার করতে এবং সমমনা ব্যক্তিদের সাথে সংযোগ স্থাপনে সহায়তা করার জন্য ডিজাইন করা হয়েছে।',
            'activities-title': 'আমাদের কার্যক্রম',
            'activity1-title': 'ধ্যান ও প্রার্থনা',
            'activity1-desc': 'মানসিক শান্তি এবং আধ্যাত্মিক সংযোগ বৃদ্ধির জন্য প্রতিদিনের নির্দেশিত ধ্যান সেশন এবং প্রার্থনা সভা।',
            'activity2-title': 'আধ্যাত্মিক শিক্ষা',
            'activity2-desc': 'প্রাচীন প্রজ্ঞা ঐতিহ্য, দর্শন এবং ব্যক্তিগত বৃদ্ধির উপর ক্লাস এবং কর্মশালা।',
            'activity3-title': 'সামাজিক কর্মসূচি',
            'activity3-desc': 'সকল সদস্যদের জন্য আউটরিচ উদ্যোগ, দাতব্য অনুষ্ঠান এবং সমাজসেবার সুযোগ।',
            'activity4-title': 'উৎসব ও অনুষ্ঠান',
            'activity4-desc': 'আধ্যাত্মিক মাইলফলক উদযাপন করে সারা বছর জুড়ে বিশেষ অনুষ্ঠান, উৎসব এবং সমাবেশ।',
            'aims-title': 'লক্ষ্য ও উদ্দেশ্য',
            'aim1-title': 'আধ্যাত্মিক বৃদ্ধি',
            'aim1-desc': 'ধ্যান, প্রার্থনা এবং আত্ম-আবিষ্কার অনুশীলনের মাধ্যমে ব্যক্তিগত আধ্যাত্মিক বিকাশ উৎসাহিত করা।',
            'aim2-title': 'ঐতিহ্য রক্ষা',
            'aim2-desc': 'আধুনিক সামাজিক প্রয়োজনের সাথে খাপ খাইয়ে নেওয়ার পাশাপাশি পবিত্র সাংস্কৃতিক ও আধ্যাত্মিক ঐতিহ্য বজায় রাখা এবং উদযাপন করা।',
            'aim3-title': 'সমাজসেবা',
            'aim3-desc': 'দাতব্য প্রোগ্রাম, আউটরিচ উদ্যোগ এবং অভাবীদের সহায়তার মাধ্যমে বৃহত্তর সমাজের সেবা করা।',
            'aim4-title': 'একতা ও সম্প্রীতি',
            'aim4-desc': 'একটি অন্তর্ভুক্তিমূলক, স্বাগত জানানোর জায়গা তৈরি করা যেখানে সমস্ত পটভূমির মানুষ শান্তি ও পারস্পরিক শ্রদ্ধার সাথে একত্রিত হতে পারে।',
            'aim5-title': 'শিক্ষা ও প্রজ্ঞা',
            'aim5-desc': 'আধ্যাত্মিক দর্শন এবং ব্যক্তিগত বৃদ্ধির বোধগম্যতা গভীর করার জন্য শিক্ষামূলক প্রোগ্রাম এবং কর্মশালা প্রদান করা।',
            'aim6-title': 'জীবন পরিবর্তন',
            'aim6-desc': 'ব্যক্তিদের তাদের উদ্দেশ্য আবিষ্কার করতে, মানসিক শান্তি অর্জন করতে এবং সমাজে ইতিবাচক অবদান রাখতে সক্ষম করা।',
            'learn-more': 'আরও জানতে ক্লিক করুন →',
            'events-title': 'আসন্ন অনুষ্ঠান',
            'events-subtitle': 'আধ্যাত্মিক সমাবেশ এবং সামাজিক উদযাপনের জন্য আমাদের সাথে যোগ দিন',
            'gallery-title': 'গ্যালারি',
            'gallery-subtitle': 'আমাদের মন্দির, অনুষ্ঠান এবং সামাজিক সমাবেশের মুহূর্তগুলো অন্বেষণ করুন',
            'gallery1-title': 'প্রধান প্রার্থনা হল',
            'gallery2-title': 'সাংস্কৃতিক উৎসব',
            'gallery3-title': 'সামাজিক সমাবেশ',
            'gallery4-title': 'দুর্গাপূজা উদযাপন',
            'gallery5-title': 'মন্দির প্রাঙ্গণ',
            'gallery6-title': 'দাতব্য সেবা',
            'location-title': 'আমাদের অবস্থান',
            'location-subtitle': 'আমরা আপনাকে আমাদের সম্প্রদায়ে যোগ দিতে এবং শান্তি খুঁজে পেতে স্বাগত জানাই',
            'loc-card-title': 'দেবালয় মন্দির',
            'loc-card-sub': 'সকলের জন্য একটি পবিত্র অভয়ারণ্য',
            'loc-addr-label': 'ঠিকানা',
            'loc-addr-val': '৮৫২৯ কমনওয়েলথ ব্লভিডি, বেলেরোজ, এনওয়াই ১১৪২৬',
            'loc-hours-label': 'খোলার সময়',
            'loc-hours-val': 'সোম - শুক্র: সকাল ৬:০০ - রাত ৯:০০, শনি - রবি: সকাল ৮:০০ - রাত ৮:০০',
            'loc-contact-label': 'যোগাযোগ',
            'loc-email-label': 'ইমেল',
            'loc-get-dirs': 'দিকনির্দেশ পান',
            'loc-park-label': 'পার্কিং:',
            'loc-park-val': 'কমনওয়েলথ ব্লভিডি এবং আশেপাশের রাস্তায় বিনামূল্যে পার্কিং পাওয়া যায়।',
            'loc-bus-label': 'গণপরিবহন:',
            'loc-bus-val': 'Q1 এবং Q27 বাস স্টপেজ ৫ মিনিটের হাঁটার দূরত্বের মধ্যে।',
            'map-overlay': 'বেলেরোজ, কুইন্সের প্রাণকেন্দ্রে অবস্থিত।',
            'donate-title': 'আমাদের লক্ষ্য সমর্থন করুন',
            'donate-subtitle': 'আপনার উদার অবদান আমাদের মন্দির রক্ষণাবেক্ষণ এবং আমাদের সেবা করতে সাহায্য করে।',
            'card-donate-title': 'কার্ডের মাধ্যমে দান করুন',
            'donate-quick-label': 'দ্রুত নির্বাচন',
            'donate-custom-label': 'কাস্টম পরিমাণ ($)',
            'donate-freq-label': 'ফ্রিকোয়েন্সি',
            'freq-once': 'এককালীন উপহার',
            'freq-monthly': 'মাসিক সহায়তা (প্রস্তাবিত)',
            'donate-submit': 'নিরাপদ পেমেন্টে এগিয়ে যান',
            'donate-secure': 'সুরক্ষিত',
            'zelle-badge': 'সবচেয়ে দক্ষ',
            'zelle-title': 'জেল (Zelle) এর মাধ্যমে দান করুন',
            'zelle-desc': 'কোনো প্রসেসিং ফি নেই। আপনার উপহারের ১০০% সরাসরি মন্দিরের কর্মসূচিতে যায়।',
            'zelle-rec-label': 'প্রাপক:',
            'zelle-hint': 'আপনার ব্যাংকিং অ্যাপ ব্যবহার করে দান পাঠান।',
            'foot-about-title': 'সম্পর্কে',
            'foot-mission': 'আমাদের লক্ষ্য',
            'foot-services': 'সেবা',
            'foot-location': 'অবস্থান',
            'foot-involved-title': 'যুক্ত হন',
            'foot-donate': 'দান করুন',
            'foot-volunteer': 'স্বেচ্ছাসেবী',
            'foot-join': 'অনুষ্ঠানে যোগ দিন',
            'foot-contact-title': 'যোগাযোগ',
            'foot-news-title': 'নিউজলেটার',
            'foot-news-desc': 'আপডেট এবং আধ্যাত্মিক প্রজ্ঞার জন্য সদস্যতা নিন।',
            'foot-news-btn': 'যোগ দিন',
            'foot-copy': '© ২০২৬ দেবালয় মন্দির। সর্বস্বত্ব সংরক্ষিত। মমতা এবং যত্ন দিয়ে তৈরি।'
        },
        'hi': {
            'nav-home': 'होम',
            'nav-about': 'हमारे बारे में',
            'nav-activities': 'गतिविधियाँ',
            'nav-aims': 'लक्ष्य और उद्देश्य',
            'nav-gallery': 'गैलरी',
            'nav-donate': 'दान दें',
            'nav-logo': 'देवालय मंदिर',
            'skip-link': 'मुख्य सामग्री पर जाएं',
            'flyer-fallback': 'इस पॉपअप को दिखाने के लिए media/img_5506.png पर अपनी फ़्लायर छवि जोड़ें।',
            'hero-badge': 'सामुदायिक आध्यात्मिक केंद्र',
            'hero-title': 'देवालय मंदिर में आपका स्वागत है',
            'hero-subtitle': 'आध्यात्मिक विकास, सामुदायिक जुड़ाव और आंतरिक शांति के लिए एक पवित्र स्थान',
            'hero-donate': 'अभी दान दें',
            'hero-find': 'हमें खोजें',
            'stat-days-val': '7',
            'stat-days-label': 'दिन खुला',
            'stat-activities-val': '20+',
            'stat-activities-label': 'मासिक गतिविधियाँ',
            'stat-ages-val': 'सभी आयु',
            'stat-ages-label': 'स्वागत है',
            'about-title': 'हमारे मंदिर के बारे में',
            'mission-title': 'हमारा मिशन',
            'mission-p1': 'देवालय मंदिर आध्यात्मिक विकास और सामुदायिक समर्थन चाहने वाले व्यक्तियों के लिए एक स्वागत योग्य अभयारण्य प्रदान करने के लिए समर्पित है। हम करुणा, ज्ञान और आंतरिक शांति को बढ़ावा देने में विश्वास करते हैं।',
            'mission-p2': 'हमारी सामुदायिक सभाएँ, ध्यान सत्र और शैक्षिक कार्यक्रम सभी पृष्ठभूमि के सदस्यों को उनके आध्यात्मिक पथ की खोज करने और समान विचारधारा वाले व्यक्तियों से जुड़ने में मदद करने के लिए डिज़ाइन किए गए हैं।',
            'activities-title': 'हमारी गतिविधियाँ',
            'activity1-title': 'ध्यान और प्रार्थना',
            'activity1-desc': 'आंतरिक शांति और आध्यात्मिक जुड़ाव को बढ़ावा देने के लिए दैनिक निर्देशित ध्यान सत्र और प्रार्थना सभाएँ।',
            'activity2-title': 'आध्यात्मिक शिक्षा',
            'activity2-desc': 'प्राचीन ज्ञान परंपराओं, दर्शन और व्यक्तिगत विकास पर कक्षाएं और कार्यशालाएं।',
            'activity3-title': 'सामुदायिक कार्यक्रम',
            'activity3-desc': 'सभी सदस्यों के लिए आउटरीच पहल, धर्मार्थ कार्यक्रम और सामुदायिक सेवा के अवसर।',
            'activity4-title': 'उत्सव और कार्यक्रम',
            'activity4-desc': 'आध्यात्मिक मील के पत्थर का जश्न मनाते हुए पूरे वर्ष विशेष समारोह, त्योहार और सभाएं।',
            'aims-title': 'लक्ष्य और उद्देश्य',
            'aim1-title': 'आध्यात्मिक विकास',
            'aim1-desc': 'सभी सदस्यों के लिए सुलभ ध्यान, प्रार्थना और आत्म-खोज प्रथाओं के माध्यम से व्यक्तिगत आध्यात्मिक विकास को बढ़ावा देना।',
            'aim2-title': 'परंपराओं का संरक्षण',
            'aim2-desc': 'आधुनिक सामुदायिक आवश्यकताओं के अनुरूप ढलते हुए पवित्र सांस्कृतिक और आध्यात्मिक परंपराओं को बनाए रखना और मनाना।',
            'aim3-title': 'सामुदायिक सेवा',
            'aim3-desc': 'धर्मार्थ कार्यक्रमों, आउटरीच पहलों और जरूरतमंदों की सहायता के माध्यम से व्यापक समुदाय की सेवा करना।',
            'aim4-title': 'एकता और सद्भाव',
            'aim4-desc': 'एक समावेशी, स्वागत योग्य स्थान बनाना जहाँ सभी पृष्ठभूमि के लोग शांति और पारस्परिक सम्मान के साथ एक साथ आ सकें।',
            'aim5-title': 'शिक्षा और ज्ञान',
            'aim5-desc': 'शैक्षिक कार्यक्रम और कार्यशालाएं प्रदान करना जो आध्यात्मिक दर्शन और व्यक्तिगत विकास की समझ को गहरा करते हैं।',
            'aim6-title': 'जीवन परिवर्तन',
            'aim6-desc': 'व्यक्तियों को उनके उद्देश्य की खोज करने, आंतरिक शांति प्राप्त करने और समाज में सकारात्मक योगदान देने के लिए सशक्त बनाना।',
            'learn-more': 'अधिक जानने के लिए क्लिक करें →',
            'events-title': 'आगामी कार्यक्रम',
            'events-subtitle': 'आध्यात्मिक सभाओं और सामुदायिक उत्सवों के लिए हमसे जुड़ें',
            'gallery-title': 'गैलरी',
            'gallery-subtitle': 'हमारे मंदिर, कार्यक्रमों और सामुदायिक सभाओं के क्षणों को देखें',
            'gallery1-title': 'मुख्य प्रार्थना हॉल',
            'gallery2-title': 'सांस्कृतिक उत्सव',
            'gallery3-title': 'सामुदायिक सभा',
            'gallery4-title': 'दुर्गा पूजा उत्सव',
            'gallery5-title': 'मंदिर परिसर',
            'gallery6-title': 'धर्मार्थ सेवा',
            'location-title': 'हमसे मिलें',
            'location-subtitle': 'हम हमारे समुदाय में शामिल होने और शांति पाने के लिए आपका स्वागत करते हैं',
            'loc-card-title': 'देवालय मंदिर',
            'loc-card-sub': 'सभी के लिए एक पवित्र अभयारण्य',
            'loc-addr-label': 'पता',
            'loc-addr-val': '8529 कॉमनवेल्थ बुलेवार्ड, बेलरोस, एनवाई 11426',
            'loc-hours-label': 'खुलने का समय',
            'loc-hours-val': 'सोम - शुक्र: सुबह 6:00 - रात 9:00, शनि - रवि: सुबह 8:00 - रात 8:00',
            'loc-contact-label': 'संपर्क',
            'loc-email-label': 'ईमेल',
            'loc-get-dirs': 'दिशा-निर्देश प्राप्त करें',
            'loc-park-label': 'पार्किंग:',
            'loc-park-val': 'कॉमनवेल्थ बुलेवार्ड और आसपास की गलियों में मुफ्त सड़क पार्किंग उपलब्ध है।',
            'loc-bus-label': 'सार्वजनिक परिवहन:',
            'loc-bus-val': 'Q1 और Q27 बस स्टॉप 5 मिनट की पैदल दूरी के भीतर हैं।',
            'map-overlay': 'बेलरोस, क्वींस के मध्य में स्थित।',
            'donate-title': 'हमारे मिशन का समर्थन करें',
            'donate-subtitle': 'आपका उदार योगदान हमारे मंदिर के रखरखाव और हमारे समुदाय की सेवा करने में मदद करता है।',
            'card-donate-title': 'कार्ड से दान दें',
            'donate-quick-label': 'त्वरित चयन',
            'donate-custom-label': 'कस्टम राशि ($)',
            'donate-freq-label': 'आवृत्ति',
            'freq-once': 'एकमुश्त उपहार',
            'freq-monthly': 'मासिक सहायता (अनुशंसित)',
            'donate-submit': 'सुरक्षित भुगतान के लिए आगे बढ़ें',
            'donate-secure': 'द्वारा सुरक्षित',
            'zelle-badge': 'सबसे कुशल',
            'zelle-title': 'ज़ेल (Zelle) के माध्यम से दान करें',
            'zelle-desc': 'कोई प्रोसेसिंग शुल्क नहीं। आपके उपहार का 100% सीधे मंदिर के कार्यक्रमों में जाता है।',
            'zelle-rec-label': 'प्राप्तकर्ता:',
            'zelle-hint': 'दान भेजने के लिए अपने बैंकिंग ऐप का उपयोग करें।',
            'foot-about-title': 'विवरण',
            'foot-mission': 'हमारा मिशन',
            'foot-services': 'सेवाएं',
            'foot-location': 'स्थान',
            'foot-involved-title': 'शामिल हों',
            'foot-donate': 'दान दें',
            'foot-volunteer': 'स्वयंसेवक',
            'foot-join': 'कार्यक्रमों में शामिल हों',
            'foot-contact-title': 'संपर्क',
            'foot-news-title': 'न्यूज़लैटर',
            'foot-news-desc': 'अपडेट और आध्यात्मिक ज्ञान के लिए सदस्यता लें।',
            'foot-news-btn': 'जुड़ें',
            'foot-copy': '© 2026 देवालय मंदिर। सर्वाधिकार सुरक्षित। करुणा और देखभाल के साथ निर्मित।'
        }
    };

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key]; // innerHTML to support links/br
            }
        });
        localStorage.setItem('preferredLang', lang);
        loadEvents();
    }

    const langSwitcher = document.getElementById('langSwitcher');
    langSwitcher?.addEventListener('change', (e) => updateLanguage(e.target.value));

    // Load saved language
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    if (langSwitcher) langSwitcher.value = savedLang;
    updateLanguage(savedLang);

    // --- 2. CORE UI ELEMENTS ---
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    // --- 3. DARK MODE ---
    const darkModeBtn = document.createElement('button');
    darkModeBtn.className = 'dark-mode-toggle';
    darkModeBtn.innerHTML = '🌙';
    darkModeBtn.setAttribute('aria-label', 'Toggle Dark Mode');
    const navCont = document.querySelector('.nav-container');
    if (navCont) navCont.appendChild(darkModeBtn);

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '☀️';
    }

    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        darkModeBtn.innerHTML = isDark ? '☀️' : '🌙';
    });

    // --- 4. SCROLL EFFECTS & NAV ---
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress.style.width = (scrollTop / scrollHeight) * 100 + '%';

        backToTop.classList.toggle('visible', scrollTop > 500);
        document.querySelector('nav')?.classList.toggle('scrolled', scrollTop > 50);
    }, { passive: true });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    function toggleMenu() {
        hamburger?.classList.toggle('active');
        navMenu?.classList.toggle('active');
        document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
    }

    hamburger?.addEventListener('click', toggleMenu);
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu?.classList.contains('active')) toggleMenu();
        });
    });

    // --- 5. HERO BUTTONS ---
    const heroDonateBtn = document.getElementById('heroDonateBtn');
    const heroFindBtn = document.getElementById('heroFindBtn');
    const mapUrl = 'https://www.google.com/maps/dir/?api=1&destination=85-29+Commonwealth+Blvd,+Bellerose,+NY+11426';

    heroDonateBtn?.addEventListener('click', () => {
        document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' });
    });

    heroFindBtn?.addEventListener('click', () => {
        window.open(mapUrl, '_blank');
    });

    // --- 6. FLYER POPUP ---
    const flyerPopup = document.getElementById('flyerPopup');
    if (flyerPopup) {
        const lastShown = localStorage.getItem('flyerLastShown');
        const now = new Date().getTime();
        if (!lastShown || (now - parseInt(lastShown)) > 24 * 60 * 60 * 1000) {
            setTimeout(() => {
                flyerPopup.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                localStorage.setItem('flyerLastShown', now.toString());
            }, 1500);
        }

        document.getElementById('flyerCloseBtn')?.addEventListener('click', () => {
            flyerPopup.classList.remove('is-open');
            document.body.style.overflow = '';
        });
    }

    // --- 7. REVEAL ANIMATIONS ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    function initReveal() {
        const targets = [
            '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
            'h2', '.section-subtitle', '.about-text', '.about-image', 
            '.feature-card', '.aim-card', '.location-info', '.map-embed', 
            '.donation-form', '.zelle-box', '.footer-section', '.footer-bottom',
            '.location-card-modern', '.map-wrapper-modern'
        ];
        document.querySelectorAll(targets.join(',')).forEach(el => {
            revealObserver.observe(el);
        });
    }
    initReveal();

    // --- 8. MODAL SYSTEM ---
    const detailModal = document.createElement('div');
    detailModal.className = 'detail-modal';
    detailModal.innerHTML = `
        <div class="detail-modal-content">
            <button class="detail-modal-close" aria-label="Close details">&times;</button>
            <div class="aim-icon"></div>
            <h3></h3>
            <p></p>
        </div>
    `;
    document.body.appendChild(detailModal);

    const mIcon = detailModal.querySelector('.aim-icon');
    const mTitle = detailModal.querySelector('h3');
    const mDesc = detailModal.querySelector('p');

    function openModal(iconHtml, title, desc) {
        if (!mIcon || !mTitle || !mDesc) return;
        mIcon.innerHTML = iconHtml;
        mTitle.innerHTML = title;
        mDesc.innerHTML = desc;
        detailModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    detailModal.querySelector('.detail-modal-close')?.addEventListener('click', () => {
        detailModal.classList.remove('is-open');
        document.body.style.overflow = '';
    });

    // --- 9. AIM CARDS ---
    document.querySelectorAll('.aim-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateX(${-y * 15}deg) rotateY(${x * 15}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = '');
        card.addEventListener('click', () => {
            const currentLang = localStorage.getItem('preferredLang') || 'en';
            const title = card.querySelector('h3')?.innerHTML || '';
            const descText = card.querySelector('p')?.innerHTML || '';
            const icon = card.querySelector('.aim-icon')?.innerHTML || '';
            
            openModal(icon, title, descText + "<br><br>" + (currentLang === 'bn' ? 'এই লক্ষ্যের প্রতি আমাদের প্রতিশ্রুতি অটল।' : currentLang === 'hi' ? 'इस उद्देश्य के प्रति हमारी प्रतिबद्धता अटूट है।' : 'Our commitment to this objective is unwavering.'));
        });
    });

    // --- 10. GALLERY ---
    const track = document.getElementById('galleryTrack');
    const slides = Array.from(track?.querySelectorAll('.gallery-slide') || []);
    const dotsContainer = document.getElementById('galleryDots');
    let currentSlide = 0;

    if (track && slides.length > 0 && dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `gallery-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateGallery();
            });
            dotsContainer.appendChild(dot);
        });

        function updateGallery() {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            document.querySelectorAll('.gallery-dot').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });
        }

        document.getElementById('galleryPrev')?.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateGallery();
        });
        document.getElementById('galleryNext')?.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateGallery();
        });
    }

    // --- 11. GOOGLE SHEETS EVENTS ---
    const grid = document.getElementById('eventsGrid');
    const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQTKh0_gIOWVQT33inL_MrUSZX8dzmGBylCN-wtFY8eUHnB9haiz4ubbIxsLT1oRBcTICxtgeicimk-/pub?output=csv';
    window._allEventsData = [];

    async function loadEvents() {
        if (!grid) return;
        try {
            const response = await fetch(SHEETS_URL);
            const csvData = await response.text();
            window._allEventsData = parseCSV(csvData);
            renderEvents(window._allEventsData);
        } catch (e) {
            console.error('Sheet failed');
        }
    }

    function parseCSV(csv) {
        if (!csv) return [];
        const result = [];
        let row = [], col = "", inQuotes = false;
        for (let i = 0; i < csv.length; i++) {
            const char = csv[i], next = csv[i+1];
            if (char === '"' && inQuotes && next === '"') { col += '"'; i++; }
            else if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) { row.push(col.trim()); col = ""; }
            else if ((char === '\r' || char === '\n') && !inQuotes) {
                if (col !== "" || row.length > 0) { row.push(col.trim()); result.push(row); }
                row = []; col = ""; if (char === '\r' && next === '\n') i++;
            } else col += char;
        }
        if (col !== "" || row.length > 0) { row.push(col.trim()); result.push(row); }
        if (result.length < 2) return [];
        const headers = result[0].map(h => h.toLowerCase().replace(/[*"']/g, '').trim());
        return result.slice(1).map(r => {
            const ev = {};
            headers.forEach((h, i) => ev[h] = r[i] ? r[i].replace(/^"|"$/g, '').trim() : '');
            return ev;
        });
    }

    function renderEvents(events) {
        const currentLang = localStorage.getItem('preferredLang') || 'en';
        
        // Sorting
        events.sort((a, b) => {
            const parseDate = (d) => {
                if (d.includes('/')) {
                    const [m, day, y] = d.split('/');
                    return new Date(y, m-1, day);
                }
                return new Date(2026, 0, 1);
            };
            return parseDate(a.date) - parseDate(b.date);
        });

        grid.innerHTML = events.map((ev, i) => {
            const title = ev[`title_${currentLang}`] || ev['title'];
            const desc = ev[`description_${currentLang}`] || ev['description'];
            
            return `
            <div class="event-card reveal">
                ${ev.imageurl ? `<img src="${ev.imageurl}" class="event-image" style="width:100%; height:200px; object-fit:cover; border-radius:8px; margin-bottom:1rem;">` : ''}
                <div class="event-date">${ev.date}</div>
                <h3>${title}</h3>
                <div class="event-meta"><span>🕒 ${ev.time}</span> • <span>${ev.day}</span></div>
                <p class="event-desc">${desc}</p>
                <div class="event-actions"><button class="event-btn" onclick="showEv(${i})">${currentLang === 'bn' ? 'বিস্তারিত' : currentLang === 'hi' ? 'विवरण' : 'Details'}</button></div>
            </div>
        `;}).join('');
        
        document.querySelectorAll('.event-card').forEach(card => revealObserver.observe(card));
    }

    window.showEv = (i) => {
        const ev = window._allEventsData[i];
        if (!ev) return;
        const currentLang = localStorage.getItem('preferredLang') || 'en';
        const title = ev[`title_${currentLang}`] || ev['title'];
        const descText = ev[`description_${currentLang}`] || ev['description'];
        
        const iconHtml = ev.imageurl ? `<img src="${ev.imageurl}" style="width:80px; height:80px; border-radius:50%; object-fit:cover;">` : '📅';
        const modalDesc = `<div style="text-align:left; margin-top:1rem;">
            <div style="background:#f8f1e3; padding:1rem; border-radius:10px; margin-bottom:1rem; display:flex; gap:1rem; flex-wrap:wrap; justify-content:center;">
                <span>📅 <strong>${ev.date}</strong></span>
                <span>🕒 <strong>${ev.time}</strong></span>
            </div>
            ${descText}
        </div>`;
        openModal(iconHtml, title, modalDesc);
    };

    loadEvents();

    // --- 12. DONATIONS ---
    const donationForm = document.getElementById('donationForm');
    donationForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = document.getElementById('customAmount')?.value;
        const type = document.getElementById('donationType')?.value || 'one-time';
        if (!amount || amount <= 0) return alert('Please enter an amount');

        const STRIPE_LINKS = {
            'one-time': 'https://donate.stripe.com/your_one_time_link',
            'monthly': 'https://donate.stripe.com/your_monthly_link'
        };

        let link = STRIPE_LINKS[type] || STRIPE_LINKS['one-time'];
        const cents = Math.round(parseFloat(amount) * 100);
        window.location.href = `${link}${link.includes('?') ? '&' : '?'}prefilled_amount=${cents}`;
    });

    document.getElementById('copyZelleBtn')?.addEventListener('click', () => {
        const id = document.getElementById('zelleId')?.textContent;
        if (id) {
            navigator.clipboard.writeText(id).then(() => {
                const btn = document.getElementById('copyZelleBtn');
                const icon = btn.querySelector('span');
                icon.textContent = 'check';
                setTimeout(() => icon.textContent = 'content_copy', 2000);
            });
        }
    });

    // Ripple effect
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn, .event-btn, .submit-btn, .amount-btn');
        if (btn) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `width:${size}px; height:${size}px; left:${e.clientX - rect.left - size/2}px; top:${e.clientY - rect.top - size/2}px;`;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    });
});
