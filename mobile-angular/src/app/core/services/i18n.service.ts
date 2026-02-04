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
      predjelo: string;
      glavnoJelo: string;
      desert: string;
      pice: string;
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
      hours: 'Utorak - Subota, 18:00 - 00:00',
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
        predjelo: 'Predjela',
        glavnoJelo: 'Glavna jela',
        desert: 'Deserti',
        pice: 'Pića'
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
      hours: 'Tuesday - Saturday, 6:00 PM - 12:00 AM',
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
        predjelo: 'Starters',
        glavnoJelo: 'Main courses',
        desert: 'Desserts',
        pice: 'Drinks'
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
      hours: 'Dienstag - Samstag, 18:00 - 00:00',
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
        predjelo: 'Vorspeisen',
        glavnoJelo: 'Hauptgerichte',
        desert: 'Desserts',
        pice: 'Getränke'
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
}
