import { Injectable, signal, computed } from '@angular/core';

export type Language = 'hr' | 'en' | 'de';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    menu: string;
    reservation: string;
  };
  // Home page
  home: {
    season: string;
    heroTitle: string;
    ctaButton: string;
    philosophy: string;
    philosophyTitle: string;
    philosophyText: string;
    quote: string;
    joinUs: string;
    secureSpot: string;
    address: string;
    hours: string;
    copyright: string;
  };
  // Menu page
  menu: {
    title: string;
    menuTitle: string;
    menuSubtitle: string;
    deliveryAvailable: string;
    deliveryTagline: string;
    loading: string;
    error: string;
    retry: string;
    addToCart: string;
    cart: string;
    emptyCart: string;
    items: string;
    total: string;
    continueToOrder: string;
    yourOrder: string;
    orderDelivery: string;
    categories: {
      appetizer: string;
      soup: string;
      salad: string;
      pasta: string;
      fish: string;
      meat: string;
      dessert: string;
      beverage: string;
      special: string;
    };
  };
  // Reservation page
  reservation: {
    title: string;
    subtitle: string;
    selectDate: string;
    selectTime: string;
    guests: string;
    guest: string;
    guestsPlural: string;
    pricePerPerson: string;
    total: string;
    reserve: string;
    reserving: string;
    loading: string;
    error: string;
    retry: string;
    noSlots: string;
    closed: string;
    success: string;
    successMessage: string;
    loginRequired: string;
  };
  // Auth
  auth: {
    login: string;
    register: string;
    loginTitle: string;
    registerTitle: string;
    loginSubtitle: string;
    registerSubtitle: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    passwordHint: string;
    noAccount: string;
    hasAccount: string;
    loggingIn: string;
    registering: string;
    fillAllFields: string;
    passwordTooShort: string;
    loginError: string;
    registerError: string;
  };
  // Checkout
  checkout: {
    title: string;
    subtitle: string;
    firstName: string;
    lastName: string;
    deliveryAddress: string;
    street: string;
    city: string;
    phone: string;
    note: string;
    noteHint: string;
    noteOptional: string;
    order: string;
    ordering: string;
    sending: string;
    confirmOrder: string;
    thankYou: string;
    success: string;
    successMessage: string;
    fillRequired: string;
    orderError: string;
  };
  // Common
  common: {
    close: string;
    back: string;
    confirm: string;
    cancel: string;
    ok: string;
    eur: string;
  };
}

const translations: Record<Language, Translations> = {
  hr: {
    nav: {
      home: 'Početna',
      menu: 'Menu',
      reservation: 'Rezervacija'
    },
    home: {
      season: 'Zagreb — Sezona 2026',
      heroTitle: 'Okusi tišine.',
      ctaButton: 'Rezervirajte svoj stol',
      philosophy: 'Filozofija',
      philosophyTitle: 'Minimalizam na tanjuru,\nmaksimalizam u okusu.',
      philosophyText: 'Aura nije samo restoran, već putovanje kroz osjetila. Svaka namirnica u sezoni 2026. pažljivo je odabrana s lokalnih OPG-ova, tretirana s poštovanjem i pretvorena u umjetnost.',
      quote: '"Hrana koja priča priču o zemlji, moru i ljudima."',
      joinUs: 'Pridružite nam se',
      secureSpot: 'Osigurajte termin',
      address: 'Trg Kralja Tomislava 1, Zagreb',
      hours: 'Svaki dan, 12:00 - 21:00',
      copyright: '© 2026 Aura Fine Dining'
    },
    menu: {
      title: 'Menu',
      menuTitle: 'Degustacijski Menu',
      menuSubtitle: 'Sedam sljedova koji slave lokalnu zemlju, more i tradiciju.',
      deliveryAvailable: 'Dostava dostupna',
      deliveryTagline: 'Naručite svoja omiljena jela',
      loading: 'Učitavam menu...',
      error: 'Greška pri učitavanju',
      retry: 'Pokušaj ponovo',
      addToCart: 'Dodaj',
      cart: 'Košarica',
      emptyCart: 'Košarica je prazna',
      items: 'artikala',
      total: 'Ukupno',
      continueToOrder: 'Nastavi na narudžbu',
      yourOrder: 'Vaša narudžba',
      orderDelivery: 'Naruči dostavu',
      categories: {
        appetizer: 'Predjela',
        soup: 'Juhe',
        salad: 'Salate',
        pasta: 'Tjestenine',
        fish: 'Riba',
        meat: 'Meso',
        dessert: 'Deserti',
        beverage: 'Pića',
        special: 'Specijaliteti'
      }
    },
    reservation: {
      title: 'Rezervacija',
      subtitle: 'Fine Dining Iskustvo',
      selectDate: 'Odaberite datum',
      selectTime: 'Odaberite termin',
      guests: 'Broj gostiju',
      guest: 'gost',
      guestsPlural: 'gostiju',
      pricePerPerson: 'EUR po osobi',
      total: 'Ukupno',
      reserve: 'Rezerviraj',
      reserving: 'Rezerviram...',
      loading: 'Učitavam termine...',
      error: 'Greška pri učitavanju',
      retry: 'Pokušaj ponovo',
      noSlots: 'Nema dostupnih termina',
      closed: 'Zatvoreno',
      success: 'Rezervacija uspješna!',
      successMessage: 'Vaša rezervacija je potvrđena. Vidimo se!',
      loginRequired: 'Za rezervaciju je potrebna prijava'
    },
    auth: {
      login: 'Prijavi se',
      register: 'Registriraj se',
      loginTitle: 'Prijava',
      registerTitle: 'Registracija',
      loginSubtitle: 'Prijavite se za nastavak',
      registerSubtitle: 'Kreirajte račun za rezervacije',
      email: 'Email adresa',
      password: 'Lozinka',
      name: 'Ime i prezime',
      phone: 'Telefon',
      passwordHint: 'Lozinka (min 6 znakova)',
      noAccount: 'Nemate račun?',
      hasAccount: 'Imate račun?',
      loggingIn: 'Prijavljujem...',
      registering: 'Registriram...',
      fillAllFields: 'Molimo popunite sva polja',
      passwordTooShort: 'Lozinka mora imati najmanje 6 znakova',
      loginError: 'Greška pri prijavi',
      registerError: 'Greška pri registraciji'
    },
    checkout: {
      title: 'Dostava',
      subtitle: 'Unesite podatke za dostavu',
      firstName: 'Ime',
      lastName: 'Prezime',
      deliveryAddress: 'Adresa dostave',
      street: 'Ulica i kućni broj',
      city: 'Grad',
      phone: 'Telefon',
      note: 'Napomena',
      noteHint: 'Alergije, posebni zahtjevi...',
      noteOptional: 'Napomena (opcionalno)',
      order: 'Naruči',
      ordering: 'Naručujem...',
      sending: 'Šaljem...',
      confirmOrder: 'Potvrdi narudžbu',
      thankYou: 'Hvala vam!',
      success: 'Narudžba uspješna!',
      successMessage: 'Vaša narudžba je uspješno zaprimljena.\nUskoro ćemo vas kontaktirati.',
      fillRequired: 'Molimo popunite sva obavezna polja',
      orderError: 'Greška pri slanju narudžbe'
    },
    common: {
      close: 'Zatvori',
      back: 'Natrag',
      confirm: 'Potvrdi',
      cancel: 'Odustani',
      ok: 'U redu',
      eur: 'EUR'
    }
  },
  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      reservation: 'Reservation'
    },
    home: {
      season: 'Zagreb — Season 2026',
      heroTitle: 'Taste the silence.',
      ctaButton: 'Reserve your table',
      philosophy: 'Philosophy',
      philosophyTitle: 'Minimalism on the plate,\nmaximalism in taste.',
      philosophyText: 'Aura is not just a restaurant, but a journey through the senses. Every ingredient in the 2026 season is carefully selected from local farms, treated with respect and transformed into art.',
      quote: '"Food that tells a story of land, sea and people."',
      joinUs: 'Join us',
      secureSpot: 'Secure your spot',
      address: 'King Tomislav Square 1, Zagreb',
      hours: 'Every day, 12:00 PM - 9:00 PM',
      copyright: '© 2026 Aura Fine Dining'
    },
    menu: {
      title: 'Menu',
      menuTitle: 'Tasting Menu',
      menuSubtitle: 'Seven courses celebrating local land, sea and tradition.',
      deliveryAvailable: 'Delivery available',
      deliveryTagline: 'Order your favourite dishes',
      loading: 'Loading menu...',
      error: 'Error loading menu',
      retry: 'Try again',
      addToCart: 'Add',
      cart: 'Cart',
      emptyCart: 'Cart is empty',
      items: 'items',
      total: 'Total',
      continueToOrder: 'Continue to order',
      yourOrder: 'Your order',
      orderDelivery: 'Order delivery',
      categories: {
        appetizer: 'Starters',
        soup: 'Soups',
        salad: 'Salads',
        pasta: 'Pasta',
        fish: 'Fish',
        meat: 'Meat',
        dessert: 'Desserts',
        beverage: 'Beverages',
        special: 'Specials'
      }
    },
    reservation: {
      title: 'Reservation',
      subtitle: 'Fine Dining Experience',
      selectDate: 'Select date',
      selectTime: 'Select time',
      guests: 'Number of guests',
      guest: 'guest',
      guestsPlural: 'guests',
      pricePerPerson: 'EUR per person',
      total: 'Total',
      reserve: 'Reserve',
      reserving: 'Reserving...',
      loading: 'Loading available times...',
      error: 'Error loading times',
      retry: 'Try again',
      noSlots: 'No available times',
      closed: 'Closed',
      success: 'Reservation successful!',
      successMessage: 'Your reservation is confirmed. See you soon!',
      loginRequired: 'Login required for reservation'
    },
    auth: {
      login: 'Log in',
      register: 'Register',
      loginTitle: 'Login',
      registerTitle: 'Registration',
      loginSubtitle: 'Log in to continue',
      registerSubtitle: 'Create an account for reservations',
      email: 'Email address',
      password: 'Password',
      name: 'Full name',
      phone: 'Phone',
      passwordHint: 'Password (min 6 characters)',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      loggingIn: 'Logging in...',
      registering: 'Registering...',
      fillAllFields: 'Please fill in all fields',
      passwordTooShort: 'Password must be at least 6 characters',
      loginError: 'Login error',
      registerError: 'Registration error'
    },
    checkout: {
      title: 'Delivery',
      subtitle: 'Enter your delivery details',
      firstName: 'First name',
      lastName: 'Last name',
      deliveryAddress: 'Delivery address',
      street: 'Street and number',
      city: 'City',
      phone: 'Phone',
      note: 'Note',
      noteHint: 'Allergies, special requests...',
      noteOptional: 'Note (optional)',
      order: 'Order',
      ordering: 'Ordering...',
      sending: 'Sending...',
      confirmOrder: 'Confirm order',
      thankYou: 'Thank you!',
      success: 'Order successful!',
      successMessage: 'Your order has been received.\nWe will contact you shortly.',
      fillRequired: 'Please fill in all required fields',
      orderError: 'Error sending order'
    },
    common: {
      close: 'Close',
      back: 'Back',
      confirm: 'Confirm',
      cancel: 'Cancel',
      ok: 'OK',
      eur: 'EUR'
    }
  },
  de: {
    nav: {
      home: 'Startseite',
      menu: 'Speisekarte',
      reservation: 'Reservierung'
    },
    home: {
      season: 'Zagreb — Saison 2026',
      heroTitle: 'Schmecke die Stille.',
      ctaButton: 'Reservieren Sie Ihren Tisch',
      philosophy: 'Philosophie',
      philosophyTitle: 'Minimalismus auf dem Teller,\nMaximalismus im Geschmack.',
      philosophyText: 'Aura ist nicht nur ein Restaurant, sondern eine Reise durch die Sinne. Jede Zutat der Saison 2026 wird sorgfältig von lokalen Bauernhöfen ausgewählt, mit Respekt behandelt und in Kunst verwandelt.',
      quote: '"Essen, das eine Geschichte von Land, Meer und Menschen erzählt."',
      joinUs: 'Besuchen Sie uns',
      secureSpot: 'Sichern Sie sich Ihren Platz',
      address: 'König-Tomislav-Platz 1, Zagreb',
      hours: 'Jeden Tag, 12:00 - 21:00',
      copyright: '© 2026 Aura Fine Dining'
    },
    menu: {
      title: 'Speisekarte',
      menuTitle: 'Degustationsmenü',
      menuSubtitle: 'Sieben Gänge, die Land, Meer und Tradition feiern.',
      deliveryAvailable: 'Lieferung verfügbar',
      deliveryTagline: 'Bestellen Sie Ihre Lieblingsgerichte',
      loading: 'Speisekarte wird geladen...',
      error: 'Fehler beim Laden',
      retry: 'Erneut versuchen',
      addToCart: 'Hinzufügen',
      cart: 'Warenkorb',
      emptyCart: 'Warenkorb ist leer',
      items: 'Artikel',
      total: 'Gesamt',
      continueToOrder: 'Zur Bestellung',
      yourOrder: 'Ihre Bestellung',
      orderDelivery: 'Lieferung bestellen',
      categories: {
        appetizer: 'Vorspeisen',
        soup: 'Suppen',
        salad: 'Salate',
        pasta: 'Nudeln',
        fish: 'Fisch',
        meat: 'Fleisch',
        dessert: 'Desserts',
        beverage: 'Getränke',
        special: 'Spezialitäten'
      }
    },
    reservation: {
      title: 'Reservierung',
      subtitle: 'Fine Dining Erlebnis',
      selectDate: 'Datum wählen',
      selectTime: 'Zeit wählen',
      guests: 'Anzahl der Gäste',
      guest: 'Gast',
      guestsPlural: 'Gäste',
      pricePerPerson: 'EUR pro Person',
      total: 'Gesamt',
      reserve: 'Reservieren',
      reserving: 'Reserviere...',
      loading: 'Verfügbare Zeiten werden geladen...',
      error: 'Fehler beim Laden',
      retry: 'Erneut versuchen',
      noSlots: 'Keine verfügbaren Zeiten',
      closed: 'Geschlossen',
      success: 'Reservierung erfolgreich!',
      successMessage: 'Ihre Reservierung ist bestätigt. Wir freuen uns auf Sie!',
      loginRequired: 'Anmeldung für Reservierung erforderlich'
    },
    auth: {
      login: 'Anmelden',
      register: 'Registrieren',
      loginTitle: 'Anmeldung',
      registerTitle: 'Registrierung',
      loginSubtitle: 'Melden Sie sich an, um fortzufahren',
      registerSubtitle: 'Erstellen Sie ein Konto für Reservierungen',
      email: 'E-Mail-Adresse',
      password: 'Passwort',
      name: 'Vollständiger Name',
      phone: 'Telefon',
      passwordHint: 'Passwort (mind. 6 Zeichen)',
      noAccount: 'Noch kein Konto?',
      hasAccount: 'Bereits ein Konto?',
      loggingIn: 'Anmeldung...',
      registering: 'Registriere...',
      fillAllFields: 'Bitte füllen Sie alle Felder aus',
      passwordTooShort: 'Passwort muss mindestens 6 Zeichen haben',
      loginError: 'Anmeldefehler',
      registerError: 'Registrierungsfehler'
    },
    checkout: {
      title: 'Lieferung',
      subtitle: 'Geben Sie Ihre Lieferdetails ein',
      firstName: 'Vorname',
      lastName: 'Nachname',
      deliveryAddress: 'Lieferadresse',
      street: 'Straße und Hausnummer',
      city: 'Stadt',
      phone: 'Telefon',
      note: 'Anmerkung',
      noteHint: 'Allergien, besondere Wünsche...',
      noteOptional: 'Anmerkung (optional)',
      order: 'Bestellen',
      ordering: 'Bestelle...',
      sending: 'Sende...',
      confirmOrder: 'Bestellung bestätigen',
      thankYou: 'Vielen Dank!',
      success: 'Bestellung erfolgreich!',
      successMessage: 'Ihre Bestellung wurde empfangen.\nWir werden Sie in Kürze kontaktieren.',
      fillRequired: 'Bitte füllen Sie alle Pflichtfelder aus',
      orderError: 'Fehler beim Senden der Bestellung'
    },
    common: {
      close: 'Schließen',
      back: 'Zurück',
      confirm: 'Bestätigen',
      cancel: 'Abbrechen',
      ok: 'OK',
      eur: 'EUR'
    }
  }
};

interface MenuItemTranslation {
  name: string;
  description: string;
}

const menuItemTranslations: Record<Language, Record<number, MenuItemTranslation>> = {
  hr: {}, // Croatian is the API default, no overrides needed
  en: {
    33: { name: 'Tuna Carpaccio', description: 'Fresh tuna with arugula, capers and parmesan' },
    34: { name: 'Bruschetta', description: 'Crispy bread with cherry tomatoes, basil and balsamic cream' },
    35: { name: 'Prosciutto & Cheese', description: 'Dalmatian prosciutto with local cheese and olives' },
    36: { name: 'Salmon Tartare', description: 'Fresh salmon with avocado and sesame' },
    37: { name: 'Tomato Soup', description: 'Creamy roasted tomato soup with basil' },
    38: { name: 'Fish Soup', description: 'Traditional Dalmatian fish soup' },
    39: { name: 'Beef Soup', description: 'Homemade beef soup with noodles' },
    40: { name: 'Caesar Salad', description: 'Romaine lettuce, chicken, parmesan, croutons and Caesar dressing' },
    41: { name: 'Greek Salad', description: 'Tomatoes, cucumbers, peppers, onion, olives and feta cheese' },
    42: { name: 'Goat Cheese Salad', description: 'Mixed salad with warm goat cheese and walnuts' },
    43: { name: 'Spaghetti Carbonara', description: 'Spaghetti with guanciale, eggs and pecorino cheese' },
    44: { name: 'Penne Arrabbiata', description: 'Penne with spicy tomato sauce' },
    45: { name: 'Black Risotto', description: 'Risotto with cuttlefish ink and seafood' },
    46: { name: 'Tagliatelle with Truffles', description: 'Homemade pasta with black truffles' },
    47: { name: 'Grilled Sea Bass', description: 'Fresh sea bass with grilled vegetables and chard' },
    48: { name: 'Octopus Under the Bell', description: 'Octopus with potatoes under the bell' },
    49: { name: 'Scampi Buzara', description: 'Scampi in white wine and garlic sauce' },
    50: { name: 'Tuna Steak', description: 'Medium-rare tuna steak with wakame salad' },
    51: { name: 'Grilled Steak', description: '300g steak with roasted vegetables and wine sauce' },
    52: { name: 'Lamb Under the Bell', description: 'Lamb with potatoes under the bell' },
    53: { name: 'Turkey Schnitzel', description: 'Turkey schnitzel with mashed potatoes and mushroom sauce' },
    54: { name: 'Ćevapi', description: '10 ćevapi with flatbread, onion and kaymak' },
    55: { name: 'Tiramisu', description: 'Classic Italian dessert with espresso and mascarpone' },
    56: { name: 'Panna Cotta', description: 'Italian cream dessert with fruit sauce' },
    57: { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with liquid center' },
    58: { name: 'Fruit Salad', description: 'Fresh seasonal fruits with mint' },
    59: { name: 'Espresso', description: 'Italian coffee' },
    60: { name: 'Cappuccino', description: 'Espresso with milk and milk foam' },
    61: { name: 'Fresh Squeezed Juice', description: 'Orange, apple or grapefruit' },
    62: { name: 'Mineral Water', description: '0.75l' },
    63: { name: 'Homemade Lemonade', description: 'Fresh lemonade with mint' },
    64: { name: 'Daily Special', description: 'Ask your waiter about today\'s special' },
  },
  de: {
    33: { name: 'Thunfisch-Carpaccio', description: 'Frischer Thunfisch mit Rucola, Kapern und Parmesan' },
    34: { name: 'Bruschetta', description: 'Knuspriges Brot mit Kirschtomaten, Basilikum und Balsamico-Creme' },
    35: { name: 'Pršut und Käse', description: 'Dalmatinischer Pršut mit einheimischem Käse und Oliven' },
    36: { name: 'Lachs-Tartare', description: 'Frischer Lachs mit Avocado und Sesam' },
    37: { name: 'Tomatensuppe', description: 'Cremige geröstete Tomatensuppe mit Basilikum' },
    38: { name: 'Fischsuppe', description: 'Traditionelle dalmatinische Fischsuppe' },
    39: { name: 'Rindersuppe', description: 'Hausgemachte Rindersuppe mit Nudeln' },
    40: { name: 'Caesar Salat', description: 'Romana-Salat, Hähnchen, Parmesan, Croutons und Caesar-Dressing' },
    41: { name: 'Griechischer Salat', description: 'Tomaten, Gurken, Paprika, Zwiebeln, Oliven und Feta-Käse' },
    42: { name: 'Ziegenkäse-Salat', description: 'Gemischter Salat mit warmem Ziegenkäse und Walnüssen' },
    43: { name: 'Spaghetti Carbonara', description: 'Spaghetti mit Guanciale, Eiern und Pecorino-Käse' },
    44: { name: 'Penne Arrabbiata', description: 'Penne mit scharfer Tomatensauce' },
    45: { name: 'Schwarzes Risotto', description: 'Risotto mit Tintenfischtinte und Meeresfrüchten' },
    46: { name: 'Tagliatelle mit Trüffeln', description: 'Hausgemachte Pasta mit schwarzen Trüffeln' },
    47: { name: 'Gegrillter Wolfsbarsch', description: 'Frischer Wolfsbarsch mit gegrilltem Gemüse und Mangold' },
    48: { name: 'Oktopus unter der Glocke', description: 'Oktopus mit Kartoffeln unter der Glocke' },
    49: { name: 'Scampi Buzara', description: 'Scampi in Weißwein-Knoblauch-Sauce' },
    50: { name: 'Thunfischsteak', description: 'Medium-rare Thunfischsteak mit Wakame-Salat' },
    51: { name: 'Gegrilltes Steak', description: '300g Steak mit geröstetem Gemüse und Weinsauce' },
    52: { name: 'Lamm unter der Glocke', description: 'Lamm mit Kartoffeln unter der Glocke' },
    53: { name: 'Putenschnitzel', description: 'Putenschnitzel mit Kartoffelpüree und Pilzsauce' },
    54: { name: 'Ćevapi', description: '10 Ćevapi mit Fladenbrot, Zwiebeln und Kajmak' },
    55: { name: 'Tiramisu', description: 'Klassisches italienisches Dessert mit Espresso und Mascarpone' },
    56: { name: 'Panna Cotta', description: 'Italienisches Creme-Dessert mit Fruchtsauce' },
    57: { name: 'Schokoladen-Lavakuchen', description: 'Warmer Schokoladenkuchen mit flüssigem Kern' },
    58: { name: 'Obstsalat', description: 'Frisches saisonales Obst mit Minze' },
    59: { name: 'Espresso', description: 'Italienischer Kaffee' },
    60: { name: 'Cappuccino', description: 'Espresso mit Milch und Milchschaum' },
    61: { name: 'Frisch gepresster Saft', description: 'Orange, Apfel oder Grapefruit' },
    62: { name: 'Mineralwasser', description: '0,75l' },
    63: { name: 'Hausgemachte Limonade', description: 'Frische Limonade mit Minze' },
    64: { name: 'Tagesspezialität', description: 'Fragen Sie Ihren Kellner nach dem heutigen Spezial' },
  }
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly STORAGE_KEY = 'aura_language';

  // Signal for reactive language state
  private currentLang = signal<Language>(this.detectLanguage());

  // Computed translations
  readonly t = computed(() => translations[this.currentLang()]);
  readonly language = computed(() => this.currentLang());

  // Available languages
  readonly languages: { code: Language; name: string; flag: string }[] = [
    { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  constructor() {
    // Initialize language on service creation
    const savedLang = localStorage.getItem(this.STORAGE_KEY) as Language | null;
    if (savedLang && this.isValidLanguage(savedLang)) {
      this.currentLang.set(savedLang);
    }
  }

  private detectLanguage(): Language {
    // Check localStorage first
    const saved = localStorage.getItem(this.STORAGE_KEY) as Language | null;
    if (saved && this.isValidLanguage(saved)) {
      return saved;
    }

    // Detect from browser
    const browserLang = navigator.language.split('-')[0].toLowerCase();

    if (browserLang === 'hr' || browserLang === 'bs' || browserLang === 'sr') {
      return 'hr';
    }
    if (browserLang === 'de' || browserLang === 'at' || browserLang === 'ch') {
      return 'de';
    }

    // Default to English
    return 'en';
  }

  private isValidLanguage(lang: string): lang is Language {
    return ['hr', 'en', 'de'].includes(lang);
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  // Helper to get current translations (for non-signal contexts)
  get translations(): Translations {
    return translations[this.currentLang()];
  }

  getItemName(id: number, fallback: string): string {
    const lang = this.currentLang();
    return menuItemTranslations[lang][id]?.name || fallback;
  }

  getItemDescription(id: number, fallback: string): string {
    const lang = this.currentLang();
    return menuItemTranslations[lang][id]?.description || fallback;
  }
}
