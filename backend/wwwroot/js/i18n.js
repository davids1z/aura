// Aura Fine Dining - Internationalization (i18n)
const translations = {
  hr: {
    // Navigation
    home: 'Početna',
    menu: 'Menu',
    reservation: 'Rezervacija',
    contact: 'Kontakt',
    back: 'Povratak',
    backHome: '← Natrag',

    // Home
    season: 'Zagreb — Sezona 2026',
    season2026: 'Sezona 2026.',
    heroTitle: 'Okusi tišine.',
    ctaButton: 'Rezervirajte svoj stol',
    philosophy: 'Filozofija',
    philosophyTitle: 'Minimalizam na tanjuru, <br>maksimalizam u okusu.',
    philosophyText: 'Aura nije samo restoran, već putovanje kroz osjetila. Svaka namirnica u sezoni 2026. pažljivo je odabrana s lokalnih OPG-ova, tretirana s poštovanjem i pretvorena u umjetnost.',
    exploreStory: 'Istražite našu priču',
    quote: '"Hrana koja priča priču o zemlji, moru i ljudima."',
    joinUs: 'Pridružite nam se',
    secureSpot: 'Osigurajte termin',
    address: 'Trg Kralja Tomislava 1, Zagreb',
    hours: 'Svaki dan, 12:00 - 21:00',
    copyright: '© 2026 Aura Fine Dining',

    // Additional index.html translations
    fineDiningZagreb: 'Fine Dining Zagreb',
    est2026: 'Est. 2026',
    scroll: 'Scroll',
    marqueeFineDining: 'Fine Dining',
    marqueeSeason: 'Sezona 2026',
    marqueeMenu: 'Degustacijski Menu',
    marqueeLocal: 'Lokalne Namirnice',
    localIngredients: 'Lokalni sastojci',
    coursesInSeason: 'Sljedova u sezoni',
    testimonialShort: '"Jedinstven gustativan doživljaj koji se ne zaboravlja."',
    statCourses: 'Sljedova',
    statFarms: 'Lokalnih OPG-ova',
    statPrice: '€ po osobi',
    statSeason: 'Sezona',
    experience: 'Iskustvo',
    experienceTitle: 'Svaki detalj<br>priča priču.',
    experienceSubtitle: 'Od prvog koraka u prostor do zadnjeg zalogaja, svaki trenutak osmišljen je da bude nezaboravan.',
    seasonalIngredients: 'Sezonske namirnice',
    seasonalDesc: 'Svaki sastojak dolazi iz provjerenih lokalnih izvora, pažljivo odabran u skladu sa sezonom.',
    artOfPresentation: 'Umjetnost prezentacije',
    artDesc: 'Svaki tanjur je platno na kojem se spajaju boje, teksture i okusi u harmoničnu kompoziciju.',
    atmosphereIntimacy: 'Atmosfera & Intimnost',
    atmosphereDesc: 'Prostor dizajniran za opuštenu eleganciju, gdje svaki gost doživljava personaliziranu uslugu.',
    gallery: 'Galerija',
    yearsExperience: '15+ godina',
    europeanExperience: 'Europska iskustva',
    traditionMeetsInnovation: 'Tradicija susreće inovaciju.',
    chefDescription: 'Naš kuhar donosi desetljeća iskustva iz najboljih europskih kuhinja. Svaki tanjur je fuzija dalmatinske tradicije i suvremenih tehnika, stvarajući jedinstven gastronomski potpis.',
    chefQuote: '"Kuhanje je razgovor između zemlje i onoga tko sluša."',
    menuItem1: 'Amuse-bouche — Tartare od tune',
    menuItem2: 'Carpaccio od hobotnice',
    menuItem3: 'Crni rižot s jadranskim sipama',
    menuItem4: 'Brancin u solnoj kori',
    menuItem5: 'Dry-aged biftek s tartufom',
    viewFullMenu: 'Pogledajte cijeli menu',
    priceWithWine: '95 € / po osobi s vinskom pratnjom',
    testimonialQuote: 'Aura redefinište pojam fine dininga u Zagrebu. Svaki posjet je novo iskustvo koje pamtite zauvijek.',
    testimonialSource: '— Gourmet Hrvatska Magazine',
    yourTableAwaits: 'Vaš stol čeka.',
    ctaSubtitle: 'Rezervirajte svoje mjesto i prepustite se nezaboravnom gastronomskom putovanju.',
    contactUs: 'Kontaktirajte nas',
    footerTagline: 'Ekskluzivno gastronomsko iskustvo u srcu Zagreba.',
    navigation: 'Navigacija',
    footerAddress: 'Trg Kralja Tomislava 1, Zagreb',

    // Menu page
    menuTitle: 'Degustacijski Menu',
    menuSubtitle: 'Sedam sljedova koji slave lokalnu zemlju, more i tradiciju. Svaki tanjur priča svoju priču kroz pažljivo odabrane namirnice.',
    deliveryAvailable: 'Dostava dostupna',
    orderFavorites: 'Naručite svoja omiljena jela',
    starters: 'Predjela',
    mainCourses: 'Glavna jela',
    desserts: 'Deserti',
    drinks: 'Pića',
    addToCart: 'Dodaj',
    added: 'Dodano',
    cart: 'Košarica',
    yourOrder: 'Vaša narudžba',
    emptyCart: 'Košarica je prazna',
    items: 'artikala',
    total: 'Ukupno',
    continueToOrder: 'Nastavi na narudžbu',
    orderDelivery: 'Naruči dostavu',
    loading: 'Učitavanje...',
    loadingMenu: 'Učitavanje menija...',
    menuLoadError: 'Greška pri učitavanju menija',
    addItemsFirst: 'Prvo dodajte artikle u košaricu',

    // Checkout/Delivery
    checkoutTitle: 'Dostava',
    deliveryData: 'Unesite podatke za dostavu',
    firstName: 'Ime',
    lastName: 'Prezime',
    deliveryAddress: 'Adresa dostave',
    noteOptional: 'Napomena (opcionalno)',
    confirmOrder: 'Potvrdi narudžbu',
    orderSuccess: 'Hvala vam!',
    orderSuccessMsg: 'Vaša narudžba je uspješno zaprimljena.<br>Uskoro ćemo vas kontaktirati.',
    ok: 'U redu',
    connectionError: 'Greška pri povezivanju',

    // Reservation page
    reservationTitle: 'Rezervacija',
    selectDate: 'Odaberite datum',
    availableSlots: 'Dostupni termini',
    loadingSlots: 'Učitavam termine...',
    noSlots: 'Nema dostupnih termina',
    guests: 'Broj gostiju',
    specialRequests: 'Posebni zahtjevi (opcionalno)',
    specialRequestsHint: 'Alergije, posebne prigode...',
    pricePerPerson: 'Cijena po osobi',
    totalPrice: 'Ukupno',
    selectSlot: 'Odaberite termin',
    confirmReservation: 'Potvrdi rezervaciju',
    sending: 'Šaljem...',
    available: 'Dostupno',
    limited: 'Ograničeno',
    full: 'Popunjeno',
    closed: 'Zatvoreno',
    free: 'Slobodno',
    workingHours: 'Radno vrijeme',
    closedReason: 'Restoran ne radi ovaj dan',
    reservationSuccess: 'Uspješno',
    backToHome: 'Natrag na početnu',
    confirmationSent: 'Potvrda je poslana na',
    person: 'osobu',
    persons234: 'osobe',
    persons5plus: 'osoba',
    date: 'Datum',
    time: 'Termin',

    // Auth
    login: 'Prijava',
    register: 'Registracija',
    loginSubtitle: 'Prijavite se za nastavak',
    registerSubtitle: 'Kreirajte račun za rezervacije',
    email: 'Email adresa',
    password: 'Lozinka',
    fullName: 'Ime i prezime',
    phone: 'Telefon',
    passwordHint: 'Lozinka (min 6 znakova)',
    registerBtn: 'Registriraj se',
    loginBtn: 'Prijavi se',
    noAccount: 'Nemate račun?',
    hasAccount: 'Imate račun?',
    registerLink: 'Registrirajte se',
    loginLink: 'Prijavite se',
    loginError: 'Greška pri prijavi',
    registerError: 'Greška pri registraciji',
    serverError: 'Greška pri povezivanju sa serverom',

    // Contact page
    contactTitle: 'Stupimo u kontakt.',
    contactSubtitle: 'Bilo da se radi o privatnom događaju, posebnim prehrambenim zahtjevima ili medijskim upitima, naš tim vam stoji na raspolaganju.',
    addressLabel: 'Adresa',
    contactLabel: 'Kontakt',
    workingHoursLabel: 'Radno vrijeme',
    wednesdaySunday: 'Srijeda — Nedjelja',
    everyDay: 'Svaki dan',
    sendMessage: 'Pošalji poruku',
    message: 'Poruka',
    howCanWeHelp: 'Kako vam možemo pomoći?',

    // Categories
    catAppetizer: 'Predjela', catSoup: 'Juhe', catSalad: 'Salate', catPasta: 'Tjestenine',
    catFish: 'Riba', catMeat: 'Meso', catDessert: 'Deserti', catBeverage: 'Pića', catSpecial: 'Specijalitet',

    // Days
    mon: 'Pon', tue: 'Uto', wed: 'Sri', thu: 'Čet', fri: 'Pet', sat: 'Sub', sun: 'Ned',

    // Months
    january: 'Siječanj', february: 'Veljača', march: 'Ožujak', april: 'Travanj',
    may: 'Svibanj', june: 'Lipanj', july: 'Srpanj', august: 'Kolovoz',
    september: 'Rujan', october: 'Listopad', november: 'Studeni', december: 'Prosinac'
  },
  en: {
    // Navigation
    home: 'Home',
    menu: 'Menu',
    reservation: 'Reservation',
    contact: 'Contact',
    back: 'Back',
    backHome: '← Back',

    // Home
    season: 'Zagreb — Season 2026',
    season2026: 'Season 2026',
    heroTitle: 'Taste the silence.',
    ctaButton: 'Reserve your table',
    philosophy: 'Philosophy',
    philosophyTitle: 'Minimalism on the plate, <br>maximalism in taste.',
    philosophyText: 'Aura is not just a restaurant, but a journey through the senses. Every ingredient in the 2026 season is carefully selected from local farms, treated with respect and transformed into art.',
    exploreStory: 'Explore our story',
    quote: '"Food that tells a story of land, sea and people."',
    joinUs: 'Join us',
    secureSpot: 'Secure your spot',
    address: 'King Tomislav Square 1, Zagreb',
    hours: 'Every day, 12:00 PM - 9:00 PM',
    copyright: '© 2026 Aura Fine Dining',

    // Additional index.html translations
    fineDiningZagreb: 'Fine Dining Zagreb',
    est2026: 'Est. 2026',
    scroll: 'Scroll',
    marqueeFineDining: 'Fine Dining',
    marqueeSeason: 'Season 2026',
    marqueeMenu: 'Tasting Menu',
    marqueeLocal: 'Local Ingredients',
    localIngredients: 'Local ingredients',
    coursesInSeason: 'Courses this season',
    testimonialShort: '"A unique culinary experience that you will never forget."',
    statCourses: 'Courses',
    statFarms: 'Local farms',
    statPrice: '€ per person',
    statSeason: 'Season',
    experience: 'Experience',
    experienceTitle: 'Every detail<br>tells a story.',
    experienceSubtitle: 'From the first step into our space to the last bite, every moment is designed to be unforgettable.',
    seasonalIngredients: 'Seasonal ingredients',
    seasonalDesc: 'Every ingredient comes from trusted local sources, carefully selected in accordance with the season.',
    artOfPresentation: 'Art of presentation',
    artDesc: 'Every plate is a canvas where colors, textures and flavors come together in harmonious composition.',
    atmosphereIntimacy: 'Atmosphere & Intimacy',
    atmosphereDesc: 'A space designed for relaxed elegance, where every guest experiences personalized service.',
    gallery: 'Gallery',
    yearsExperience: '15+ years',
    europeanExperience: 'European experience',
    traditionMeetsInnovation: 'Tradition meets innovation.',
    chefDescription: 'Our chef brings decades of experience from the best European kitchens. Every plate is a fusion of Dalmatian tradition and modern techniques, creating a unique gastronomic signature.',
    chefQuote: '"Cooking is a conversation between the earth and those who listen."',
    menuItem1: 'Amuse-bouche — Tuna tartare',
    menuItem2: 'Octopus carpaccio',
    menuItem3: 'Black risotto with Adriatic cuttlefish',
    menuItem4: 'Sea bass in salt crust',
    menuItem5: 'Dry-aged steak with truffle',
    viewFullMenu: 'View full menu',
    priceWithWine: '95 € / per person with wine pairing',
    testimonialQuote: 'Aura redefines fine dining in Zagreb. Every visit is a new experience you will remember forever.',
    testimonialSource: '— Gourmet Croatia Magazine',
    yourTableAwaits: 'Your table awaits.',
    ctaSubtitle: 'Reserve your spot and surrender to an unforgettable gastronomic journey.',
    contactUs: 'Contact us',
    footerTagline: 'Exclusive gastronomic experience in the heart of Zagreb.',
    navigation: 'Navigation',
    footerAddress: 'King Tomislav Square 1, Zagreb',

    // Menu page
    menuTitle: 'Tasting Menu',
    menuSubtitle: 'Seven courses celebrating local land, sea and tradition. Each plate tells its story through carefully selected ingredients.',
    deliveryAvailable: 'Delivery available',
    orderFavorites: 'Order your favorite dishes',
    starters: 'Starters',
    mainCourses: 'Main courses',
    desserts: 'Desserts',
    drinks: 'Drinks',
    addToCart: 'Add',
    added: 'Added',
    cart: 'Cart',
    yourOrder: 'Your order',
    emptyCart: 'Cart is empty',
    items: 'items',
    total: 'Total',
    continueToOrder: 'Continue to order',
    orderDelivery: 'Order delivery',
    loading: 'Loading...',
    loadingMenu: 'Loading menu...',
    menuLoadError: 'Error loading menu',
    addItemsFirst: 'Add items to cart first',

    // Checkout/Delivery
    checkoutTitle: 'Delivery',
    deliveryData: 'Enter delivery details',
    firstName: 'First name',
    lastName: 'Last name',
    deliveryAddress: 'Delivery address',
    noteOptional: 'Note (optional)',
    confirmOrder: 'Confirm order',
    orderSuccess: 'Thank you!',
    orderSuccessMsg: 'Your order has been successfully received.<br>We will contact you soon.',
    ok: 'OK',
    connectionError: 'Connection error',

    // Reservation page
    reservationTitle: 'Reservation',
    selectDate: 'Select date',
    availableSlots: 'Available time slots',
    loadingSlots: 'Loading time slots...',
    noSlots: 'No available time slots',
    guests: 'Number of guests',
    specialRequests: 'Special requests (optional)',
    specialRequestsHint: 'Allergies, special occasions...',
    pricePerPerson: 'Price per person',
    totalPrice: 'Total',
    selectSlot: 'Select time slot',
    confirmReservation: 'Confirm reservation',
    sending: 'Sending...',
    available: 'Available',
    limited: 'Limited',
    full: 'Full',
    closed: 'Closed',
    free: 'Free',
    workingHours: 'Working hours',
    closedReason: 'Restaurant is closed this day',
    reservationSuccess: 'Success',
    backToHome: 'Back to home',
    confirmationSent: 'Confirmation sent to',
    person: 'person',
    persons234: 'persons',
    persons5plus: 'persons',
    date: 'Date',
    time: 'Time',

    // Auth
    login: 'Login',
    register: 'Register',
    loginSubtitle: 'Log in to continue',
    registerSubtitle: 'Create an account for reservations',
    email: 'Email address',
    password: 'Password',
    fullName: 'Full name',
    phone: 'Phone',
    passwordHint: 'Password (min 6 characters)',
    registerBtn: 'Register',
    loginBtn: 'Log in',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    registerLink: 'Register',
    loginLink: 'Log in',
    loginError: 'Login error',
    registerError: 'Registration error',
    serverError: 'Server connection error',

    // Contact page
    contactTitle: 'Get in touch.',
    contactSubtitle: 'Whether it\'s a private event, special dietary requirements or media inquiries, our team is at your service.',
    addressLabel: 'Address',
    contactLabel: 'Contact',
    workingHoursLabel: 'Working hours',
    wednesdaySunday: 'Wednesday — Sunday',
    everyDay: 'Every day',
    sendMessage: 'Send message',
    message: 'Message',
    howCanWeHelp: 'How can we help you?',

    // Categories
    catAppetizer: 'Starters', catSoup: 'Soups', catSalad: 'Salads', catPasta: 'Pasta',
    catFish: 'Fish', catMeat: 'Meat', catDessert: 'Desserts', catBeverage: 'Beverages', catSpecial: 'Specials',

    // Days
    mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',

    // Months
    january: 'January', february: 'February', march: 'March', april: 'April',
    may: 'May', june: 'June', july: 'July', august: 'August',
    september: 'September', october: 'October', november: 'November', december: 'December'
  },
  de: {
    // Navigation
    home: 'Startseite',
    menu: 'Speisekarte',
    reservation: 'Reservierung',
    contact: 'Kontakt',
    back: 'Zurück',
    backHome: '← Zurück',

    // Home
    season: 'Zagreb — Saison 2026',
    season2026: 'Saison 2026',
    heroTitle: 'Schmecke die Stille.',
    ctaButton: 'Reservieren Sie Ihren Tisch',
    philosophy: 'Philosophie',
    philosophyTitle: 'Minimalismus auf dem Teller, <br>Maximalismus im Geschmack.',
    philosophyText: 'Aura ist nicht nur ein Restaurant, sondern eine Reise durch die Sinne. Jede Zutat der Saison 2026 wird sorgfältig von lokalen Bauernhöfen ausgewählt, mit Respekt behandelt und in Kunst verwandelt.',
    exploreStory: 'Entdecken Sie unsere Geschichte',
    quote: '"Essen, das eine Geschichte von Land, Meer und Menschen erzählt."',
    joinUs: 'Besuchen Sie uns',
    secureSpot: 'Sichern Sie sich Ihren Platz',
    address: 'König-Tomislav-Platz 1, Zagreb',
    hours: 'Jeden Tag, 12:00 - 21:00',
    copyright: '© 2026 Aura Fine Dining',

    // Additional index.html translations
    fineDiningZagreb: 'Fine Dining Zagreb',
    est2026: 'Est. 2026',
    scroll: 'Scrollen',
    marqueeFineDining: 'Fine Dining',
    marqueeSeason: 'Saison 2026',
    marqueeMenu: 'Degustationsmenü',
    marqueeLocal: 'Lokale Zutaten',
    localIngredients: 'Lokale Zutaten',
    coursesInSeason: 'Gänge in der Saison',
    testimonialShort: '"Ein einzigartiges kulinarisches Erlebnis, das man nicht vergisst."',
    statCourses: 'Gänge',
    statFarms: 'Lokale Bauernhöfe',
    statPrice: '€ pro Person',
    statSeason: 'Saison',
    experience: 'Erlebnis',
    experienceTitle: 'Jedes Detail<br>erzählt eine Geschichte.',
    experienceSubtitle: 'Vom ersten Schritt in unseren Raum bis zum letzten Bissen ist jeder Moment darauf ausgelegt, unvergesslich zu sein.',
    seasonalIngredients: 'Saisonale Zutaten',
    seasonalDesc: 'Jede Zutat stammt aus vertrauenswürdigen lokalen Quellen, sorgfältig ausgewählt im Einklang mit der Saison.',
    artOfPresentation: 'Kunst der Präsentation',
    artDesc: 'Jeder Teller ist eine Leinwand, auf der Farben, Texturen und Aromen zu einer harmonischen Komposition verschmelzen.',
    atmosphereIntimacy: 'Atmosphäre & Intimität',
    atmosphereDesc: 'Ein Raum für entspannte Eleganz, in dem jeder Gast einen personalisierten Service erlebt.',
    gallery: 'Galerie',
    yearsExperience: '15+ Jahre',
    europeanExperience: 'Europäische Erfahrung',
    traditionMeetsInnovation: 'Tradition trifft Innovation.',
    chefDescription: 'Unser Küchenchef bringt jahrzehntelange Erfahrung aus den besten europäischen Küchen mit. Jeder Teller ist eine Fusion aus dalmatinischer Tradition und modernen Techniken, die eine einzigartige gastronomische Signatur schaffen.',
    chefQuote: '"Kochen ist ein Gespräch zwischen der Erde und denen, die zuhören."',
    menuItem1: 'Amuse-bouche — Thunfisch-Tatar',
    menuItem2: 'Oktopus-Carpaccio',
    menuItem3: 'Schwarzes Risotto mit adriatischem Tintenfisch',
    menuItem4: 'Wolfsbarsch in Salzkruste',
    menuItem5: 'Dry-aged Steak mit Trüffel',
    viewFullMenu: 'Vollständige Speisekarte ansehen',
    priceWithWine: '95 € / pro Person mit Weinbegleitung',
    testimonialQuote: 'Aura definiert Fine Dining in Zagreb neu. Jeder Besuch ist ein neues Erlebnis, das Sie für immer in Erinnerung behalten werden.',
    testimonialSource: '— Gourmet Kroatien Magazin',
    yourTableAwaits: 'Ihr Tisch wartet.',
    ctaSubtitle: 'Reservieren Sie Ihren Platz und geben Sie sich einer unvergesslichen gastronomischen Reise hin.',
    contactUs: 'Kontaktieren Sie uns',
    footerTagline: 'Exklusives gastronomisches Erlebnis im Herzen von Zagreb.',
    navigation: 'Navigation',
    footerAddress: 'König-Tomislav-Platz 1, Zagreb',

    // Menu page
    menuTitle: 'Degustationsmenü',
    menuSubtitle: 'Sieben Gänge, die Land, Meer und Tradition feiern. Jeder Teller erzählt seine Geschichte durch sorgfältig ausgewählte Zutaten.',
    deliveryAvailable: 'Lieferung verfügbar',
    orderFavorites: 'Bestellen Sie Ihre Lieblingsgerichte',
    starters: 'Vorspeisen',
    mainCourses: 'Hauptgerichte',
    desserts: 'Desserts',
    drinks: 'Getränke',
    addToCart: 'Hinzufügen',
    added: 'Hinzugefügt',
    cart: 'Warenkorb',
    yourOrder: 'Ihre Bestellung',
    emptyCart: 'Warenkorb ist leer',
    items: 'Artikel',
    total: 'Gesamt',
    continueToOrder: 'Weiter zur Bestellung',
    orderDelivery: 'Lieferung bestellen',
    loading: 'Wird geladen...',
    loadingMenu: 'Speisekarte wird geladen...',
    menuLoadError: 'Fehler beim Laden der Speisekarte',
    addItemsFirst: 'Fügen Sie zuerst Artikel zum Warenkorb hinzu',

    // Checkout/Delivery
    checkoutTitle: 'Lieferung',
    deliveryData: 'Lieferdaten eingeben',
    firstName: 'Vorname',
    lastName: 'Nachname',
    deliveryAddress: 'Lieferadresse',
    noteOptional: 'Anmerkung (optional)',
    confirmOrder: 'Bestellung bestätigen',
    orderSuccess: 'Vielen Dank!',
    orderSuccessMsg: 'Ihre Bestellung wurde erfolgreich aufgenommen.<br>Wir werden uns bald bei Ihnen melden.',
    ok: 'OK',
    connectionError: 'Verbindungsfehler',

    // Reservation page
    reservationTitle: 'Reservierung',
    selectDate: 'Datum wählen',
    availableSlots: 'Verfügbare Termine',
    loadingSlots: 'Termine werden geladen...',
    noSlots: 'Keine verfügbaren Termine',
    guests: 'Anzahl der Gäste',
    specialRequests: 'Besondere Wünsche (optional)',
    specialRequestsHint: 'Allergien, besondere Anlässe...',
    pricePerPerson: 'Preis pro Person',
    totalPrice: 'Gesamt',
    selectSlot: 'Termin wählen',
    confirmReservation: 'Reservierung bestätigen',
    sending: 'Wird gesendet...',
    available: 'Verfügbar',
    limited: 'Begrenzt',
    full: 'Voll',
    closed: 'Geschlossen',
    free: 'Frei',
    workingHours: 'Öffnungszeiten',
    closedReason: 'Restaurant ist an diesem Tag geschlossen',
    reservationSuccess: 'Erfolgreich',
    backToHome: 'Zurück zur Startseite',
    confirmationSent: 'Bestätigung gesendet an',
    person: 'Person',
    persons234: 'Personen',
    persons5plus: 'Personen',
    date: 'Datum',
    time: 'Uhrzeit',

    // Auth
    login: 'Anmelden',
    register: 'Registrieren',
    loginSubtitle: 'Melden Sie sich an, um fortzufahren',
    registerSubtitle: 'Erstellen Sie ein Konto für Reservierungen',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    fullName: 'Vollständiger Name',
    phone: 'Telefon',
    passwordHint: 'Passwort (mind. 6 Zeichen)',
    registerBtn: 'Registrieren',
    loginBtn: 'Anmelden',
    noAccount: 'Noch kein Konto?',
    hasAccount: 'Bereits ein Konto?',
    registerLink: 'Registrieren',
    loginLink: 'Anmelden',
    loginError: 'Anmeldefehler',
    registerError: 'Registrierungsfehler',
    serverError: 'Serververbindungsfehler',

    // Contact page
    contactTitle: 'Kontaktieren Sie uns.',
    contactSubtitle: 'Ob private Veranstaltung, besondere Ernährungsanforderungen oder Medienanfragen – unser Team steht Ihnen zur Verfügung.',
    addressLabel: 'Adresse',
    contactLabel: 'Kontakt',
    workingHoursLabel: 'Öffnungszeiten',
    wednesdaySunday: 'Mittwoch — Sonntag',
    everyDay: 'Jeden Tag',
    sendMessage: 'Nachricht senden',
    message: 'Nachricht',
    howCanWeHelp: 'Wie können wir Ihnen helfen?',

    // Categories
    catAppetizer: 'Vorspeisen', catSoup: 'Suppen', catSalad: 'Salate', catPasta: 'Pasta',
    catFish: 'Fisch', catMeat: 'Fleisch', catDessert: 'Desserts', catBeverage: 'Getränke', catSpecial: 'Spezialitäten',

    // Days
    mon: 'Mo', tue: 'Di', wed: 'Mi', thu: 'Do', fri: 'Fr', sat: 'Sa', sun: 'So',

    // Months
    january: 'Januar', february: 'Februar', march: 'März', april: 'April',
    may: 'Mai', june: 'Juni', july: 'Juli', august: 'August',
    september: 'September', october: 'Oktober', november: 'November', december: 'Dezember'
  }
};

// Menu item translations (name and description)
const menuTranslations = {
  en: {
    'Carpaccio od tune': { name: 'Tuna Carpaccio', desc: 'Thinly sliced fresh tuna with arugula and lemon dressing' },
    'Bruschetta': { name: 'Bruschetta', desc: 'Toasted bread with tomatoes, garlic and fresh basil' },
    'Pršut i sir': { name: 'Prosciutto & Cheese', desc: 'Dalmatian prosciutto with local cheeses' },
    'Tartar od lososa': { name: 'Salmon Tartare', desc: 'Fresh salmon tartare with avocado and sesame' },
    'Juha od rajčice': { name: 'Tomato Soup', desc: 'Creamy tomato soup with basil' },
    'Riblja juha': { name: 'Fish Soup', desc: 'Traditional Adriatic fish soup' },
    'Goveđa juha': { name: 'Beef Soup', desc: 'Clear beef broth with vegetables and noodles' },
    'Cezar salata': { name: 'Caesar Salad', desc: 'Classic Caesar with crispy croutons and parmesan' },
    'Grčka salata': { name: 'Greek Salad', desc: 'Fresh vegetables with feta cheese and olives' },
    'Salata s kozjim sirom': { name: 'Goat Cheese Salad', desc: 'Mixed greens with warm goat cheese and honey' },
    'Spaghetti Carbonara': { name: 'Spaghetti Carbonara', desc: 'Classic carbonara with pancetta and pecorino' },
    'Penne Arrabiata': { name: 'Penne Arrabiata', desc: 'Penne in spicy tomato sauce' },
    'Crni rižot': { name: 'Black Risotto', desc: 'Squid ink risotto with fresh seafood' },
    'Tagliatelle s tartufima': { name: 'Truffle Tagliatelle', desc: 'Fresh tagliatelle with black truffle' },
    'Brancin na žaru': { name: 'Grilled Sea Bass', desc: 'Whole sea bass grilled with herbs and olive oil' },
    'Hobotnica ispod peke': { name: 'Octopus Under the Bell', desc: 'Slow-cooked octopus with potatoes, traditional style' },
    'Škampi na buzaru': { name: 'Scampi Buzara', desc: 'Adriatic scampi in wine and garlic sauce' },
    'Tuna steak': { name: 'Tuna Steak', desc: 'Seared tuna steak with sesame crust' },
    'Biftek na žaru': { name: 'Grilled Steak', desc: 'Premium beef steak grilled to perfection' },
    'Janjetina ispod peke': { name: 'Lamb Under the Bell', desc: 'Slow-roasted lamb with vegetables, traditional style' },
    'Pureći odrezak': { name: 'Turkey Cutlet', desc: 'Breaded turkey cutlet with side salad' },
    'Ćevapi': { name: 'Cevapi', desc: 'Traditional grilled meat sausages with flatbread' },
    'Tiramisu': { name: 'Tiramisu', desc: 'Classic Italian coffee-flavored dessert' },
    'Panna cotta': { name: 'Panna Cotta', desc: 'Italian cream dessert with berry coulis' },
    'Čokoladni lava cake': { name: 'Chocolate Lava Cake', desc: 'Warm chocolate cake with molten center' },
    'Voćna salata': { name: 'Fruit Salad', desc: 'Fresh seasonal fruit selection' },
    'Espresso': { name: 'Espresso', desc: 'Italian espresso coffee' },
    'Cappuccino': { name: 'Cappuccino', desc: 'Espresso with steamed milk foam' },
    'Svježe cijeđeni sok': { name: 'Fresh Squeezed Juice', desc: 'Freshly squeezed seasonal juice' },
    'Mineralna voda': { name: 'Mineral Water', desc: 'Sparkling or still mineral water' },
    'Domaća limunada': { name: 'Homemade Lemonade', desc: 'Fresh homemade lemonade with mint' },
    'Specijalitet dana': { name: 'Daily Special', desc: "Chef's daily special creation" }
  },
  de: {
    'Carpaccio od tune': { name: 'Thunfisch-Carpaccio', desc: 'Dünn geschnittener frischer Thunfisch mit Rucola und Zitronendressing' },
    'Bruschetta': { name: 'Bruschetta', desc: 'Geröstetes Brot mit Tomaten, Knoblauch und frischem Basilikum' },
    'Pršut i sir': { name: 'Schinken & Käse', desc: 'Dalmatinischer Schinken mit lokalen Käsesorten' },
    'Tartar od lososa': { name: 'Lachstartar', desc: 'Frisches Lachstartar mit Avocado und Sesam' },
    'Juha od rajčice': { name: 'Tomatensuppe', desc: 'Cremige Tomatensuppe mit Basilikum' },
    'Riblja juha': { name: 'Fischsuppe', desc: 'Traditionelle adriatische Fischsuppe' },
    'Goveđa juha': { name: 'Rinderbrühe', desc: 'Klare Rinderbrühe mit Gemüse und Nudeln' },
    'Cezar salata': { name: 'Caesar-Salat', desc: 'Klassischer Caesar mit knusprigen Croutons und Parmesan' },
    'Grčka salata': { name: 'Griechischer Salat', desc: 'Frisches Gemüse mit Feta und Oliven' },
    'Salata s kozjim sirom': { name: 'Ziegenkäse-Salat', desc: 'Gemischte Blätter mit warmem Ziegenkäse und Honig' },
    'Spaghetti Carbonara': { name: 'Spaghetti Carbonara', desc: 'Klassische Carbonara mit Pancetta und Pecorino' },
    'Penne Arrabiata': { name: 'Penne Arrabiata', desc: 'Penne in scharfer Tomatensauce' },
    'Crni rižot': { name: 'Schwarzes Risotto', desc: 'Risotto mit Tintenfischtinte und frischen Meeresfrüchten' },
    'Tagliatelle s tartufima': { name: 'Trüffel-Tagliatelle', desc: 'Frische Tagliatelle mit schwarzem Trüffel' },
    'Brancin na žaru': { name: 'Gegrillter Wolfsbarsch', desc: 'Ganzer Wolfsbarsch gegrillt mit Kräutern und Olivenöl' },
    'Hobotnica ispod peke': { name: 'Oktopus unter der Glocke', desc: 'Langsam gegarter Oktopus mit Kartoffeln' },
    'Škampi na buzaru': { name: 'Scampi Buzara', desc: 'Adriatische Scampi in Wein-Knoblauch-Sauce' },
    'Tuna steak': { name: 'Thunfischsteak', desc: 'Gegrilltes Thunfischsteak mit Sesamkruste' },
    'Biftek na žaru': { name: 'Gegrilltes Steak', desc: 'Premium-Rindersteak perfekt gegrillt' },
    'Janjetina ispod peke': { name: 'Lamm unter der Glocke', desc: 'Langsam gebratenes Lamm mit Gemüse' },
    'Pureći odrezak': { name: 'Putenschnitzel', desc: 'Paniertes Putenschnitzel mit Beilagensalat' },
    'Ćevapi': { name: 'Cevapcici', desc: 'Traditionelle gegrillte Fleischröllchen mit Fladenbrot' },
    'Tiramisu': { name: 'Tiramisu', desc: 'Klassisches italienisches Kaffee-Dessert' },
    'Panna cotta': { name: 'Panna Cotta', desc: 'Italienisches Sahnedessert mit Beerensauce' },
    'Čokoladni lava cake': { name: 'Schokoladen-Lavakuchen', desc: 'Warmer Schokoladenkuchen mit flüssigem Kern' },
    'Voćna salata': { name: 'Obstsalat', desc: 'Frische saisonale Obstauswahl' },
    'Espresso': { name: 'Espresso', desc: 'Italienischer Espresso' },
    'Cappuccino': { name: 'Cappuccino', desc: 'Espresso mit aufgeschäumter Milch' },
    'Svježe cijeđeni sok': { name: 'Frisch gepresster Saft', desc: 'Frisch gepresster saisonaler Saft' },
    'Mineralna voda': { name: 'Mineralwasser', desc: 'Mineral- oder stilles Wasser' },
    'Domaća limunada': { name: 'Hausgemachte Limonade', desc: 'Frische hausgemachte Limonade mit Minze' },
    'Specijalitet dana': { name: 'Tagesspezialität', desc: 'Tägliche Spezialkreation des Küchenchefs' }
  }
};

// i18n Manager
const i18n = {
  currentLang: 'hr',

  init() {
    // Check localStorage first
    const saved = localStorage.getItem('aura_language');
    if (saved && translations[saved]) {
      this.currentLang = saved;
    } else {
      // Detect from browser
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      if (browserLang === 'hr' || browserLang === 'bs' || browserLang === 'sr') {
        this.currentLang = 'hr';
      } else if (browserLang === 'de' || browserLang === 'at' || browserLang === 'ch') {
        this.currentLang = 'de';
      } else {
        this.currentLang = 'en';
      }
    }

    this.createLanguageSelector();
    this.updatePage();
  },

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('aura_language', lang);
      this.updatePage();
      // Notify dynamic content to re-render
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  },

  t(key) {
    return translations[this.currentLang][key] || translations['hr'][key] || key;
  },

  // Translate menu item name
  tName(originalName) {
    if (this.currentLang === 'hr') return originalName;
    const mt = menuTranslations[this.currentLang];
    return (mt && mt[originalName] && mt[originalName].name) || originalName;
  },

  // Translate menu item description
  tDesc(originalName, originalDesc) {
    if (this.currentLang === 'hr') return originalDesc;
    const mt = menuTranslations[this.currentLang];
    return (mt && mt[originalName] && mt[originalName].desc) || originalDesc;
  },

  updatePage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.innerHTML = translation;
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLang;

    // Update language selector visual state
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.dataset.lang === this.currentLang;
      btn.classList.toggle('bg-stone-900', isActive);
      btn.classList.toggle('scale-110', isActive);
    });
  },

  createLanguageSelector() {
    // Find or create language selector container
    let selector = document.getElementById('language-selector');
    if (!selector) {
      selector = document.createElement('div');
      selector.id = 'language-selector';
      selector.className = 'fixed bottom-6 right-6 z-[100] flex gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-lg';
      document.body.appendChild(selector);
    }

    selector.innerHTML = `
      <button class="lang-btn w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all" data-lang="hr" onclick="i18n.setLanguage('hr')">🇭🇷</button>
      <button class="lang-btn w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all" data-lang="en" onclick="i18n.setLanguage('en')">🇬🇧</button>
      <button class="lang-btn w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all" data-lang="de" onclick="i18n.setLanguage('de')">🇩🇪</button>
    `;
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => i18n.init());
