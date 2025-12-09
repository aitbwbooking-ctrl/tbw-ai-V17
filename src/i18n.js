// src/i18n.js

export const LANGS = {
  hr: "HR",
  en: "EN",
  de: "DE",
  it: "IT",
  sl: "SL",
};

export const DEFAULT_LANG = "hr";

const translations = {
  hr: {
    appTitle: "TBW AI PREMIUM",
    appSubtitle: "Navigator",
    mainPlaceholder: "Reci npr: \"Hej TBW, nađi mi apartmane u Splitu za vikend\"...",
    mainButton: "Traži",
    voiceHint:
      "Mikrofon demo: u finalnoj verziji ide pravi 'speech-to-text' (Web Speech API / mobilni SDK).",
    cityZagreb: "Zagreb",
    citySplit: "Split",
    cityKarlovac: "Karlovac",
    cityZadar: "Zadar",

    trial: "Trial",
    demo: "Demo",
    premium: "Premium",

    cardNavTitle: "Navigacija",
    cardNavDesc: "Aktivna ruta, smjer, ETA, truck profil (premium).",
    cardStayTitle: "Rezervacija smještaja",
    cardStayDesc: "Brza provjera apartmana i hotela.",
    cardWeatherTitle: "Vrijeme",
    cardWeatherDesc: "Trenutna prognoza i more.",
    cardTrafficTitle: "Promet uživo",
    cardTrafficDesc: "Gužve, radovi, kamere.",
    cardAirTitle: "Aerodromi",
    cardAirDesc: "Dolazni i odlazni letovi.",
    cardEventsTitle: "Eventi",
    cardEventsDesc: "Koncerti, festivali, događanja.",
    cardShopsTitle: "Trgovine & energija",
    cardShopsDesc: "Trgovine, shopping centri, benzinske / EV.",
    cardSafetyTitle: "Sigurnost & SOS",
    cardSafetyDesc: "ICE kontakti, 112 / 192, sigurnosni savjeti.",

    modalClose: "Zatvori",
    modalNavTitle: "Navigacija – premium suputnik",
    modalNavBody:
      "Planirano: full-screen karta, live promet, glasovne upute, upozorenja na radove i radare, truck profil, offline rute i još mnogo toga.",

    modalStayTitle: "Rezervacija smještaja",
    modalStayBody:
      "U premium modu ovdje se spajaš na Booking, Airbnb i druge partnere uz TBW filtere (cijena, ocjene, lokacija).",

    modalTrafficTitle: "Promet uživo",
    modalTrafficBody:
      "Live pregled gužvi, radova, kamera i zatvaranja cesta uz TBW upozorenja za tvoj profil vožnje.",

    modalWeatherTitle: "Vrijeme i more",
    modalWeatherBody:
      "Povezivanje na DHMZ, meteo i morske API-je s TBW komentarom (oprez vjetar, nevera, magla...).",

    modalAirTitle: "Aerodromi",
    modalAirBody:
      "Boarding, kašnjenja, gate, prognoza vremena i TBW savjeti za putnike.",

    modalEventsTitle: "Eventi i Nightlife",
    modalEventsBody:
      "Koncerti, festivali, kino, klubovi – personalizirani prijedlozi prema tvojim preferencama.",

    modalShopsTitle: "Trgovine & energija",
    modalShopsBody:
      "Shopping centri, trgovine, radno vrijeme, benzinske i EV punionice uz TBW filtere.",

    modalSafetyTitle: "Sigurnost & SOS",
    modalSafetyBody:
      "ICE kontakti, lokalni brojevi hitnih službi i TBW sigurnosni podsjetnik za cestu i putovanje.",

    navFrom: "Polazak",
    navTo: "Odredište",
    navStart: "Kreni",
    navProfile: "Profil",
    navProfileCar: "Osobni",
    navProfileTruck: "Kamion",
    navProfileMoto: "Motor",

    voiceNavHint:
      "Reci npr. \"Ruta iz Karlovca do Zadra\" ili \"Odvedi me u Split\".",
    featurePremiumBadge: "PREMIUM",

    footerDisclaimer:
      "TBW AI PREMIUM je informativni alat. Za promet, vrijeme, more i sigurnost uvijek provjeri službene izvore (MUP, HAK, DHMZ, kapetanije, zračne luke).",
  },

  en: {
    appTitle: "TBW AI PREMIUM",
    appSubtitle: "Navigator",
    mainPlaceholder:
      'Say e.g. "Hey TBW, find me apartments in Split for the weekend"...',
    mainButton: "Search",
    voiceHint:
      "Mic demo: in the final version this will use full speech-to-text (Web Speech API / mobile SDK).",
    cityZagreb: "Zagreb",
    citySplit: "Split",
    cityKarlovac: "Karlovac",
    cityZadar: "Zadar",

    trial: "Trial",
    demo: "Demo",
    premium: "Premium",

    cardNavTitle: "Navigation",
    cardNavDesc: "Active route, direction, ETA, truck profile (premium).",
    cardStayTitle: "Stay booking",
    cardStayDesc: "Quick check of apartments and hotels.",
    cardWeatherTitle: "Weather",
    cardWeatherDesc: "Current forecast and sea.",
    cardTrafficTitle: "Live traffic",
    cardTrafficDesc: "Jams, roadworks, cameras.",
    cardAirTitle: "Airports",
    cardAirDesc: "Arrivals & departures.",
    cardEventsTitle: "Events",
    cardEventsDesc: "Concerts, festivals, nightlife.",
    cardShopsTitle: "Shops & energy",
    cardShopsDesc: "Shops, malls, fuel / EV.",
    cardSafetyTitle: "Safety & SOS",
    cardSafetyDesc: "ICE contacts, 112 / 192, safety tips.",

    modalClose: "Close",
    modalNavTitle: "Navigation – premium co-driver",
    modalNavBody:
      "Planned: full-screen map, live traffic, voice guidance, roadwork & radar alerts, truck profile, offline routes and more.",

    modalStayTitle: "Stay booking",
    modalStayBody:
      "In premium mode this connects to Booking, Airbnb and partners with TBW filters (price, rating, location).",

    modalTrafficTitle: "Live traffic",
    modalTrafficBody:
      "Live overview of jams, works, cameras and road closures with TBW alerts for your driving profile.",

    modalWeatherTitle: "Weather & sea",
    modalWeatherBody:
      "Connects to meteo & marine APIs with TBW commentary (strong wind, storms, fog warnings...).",

    modalAirTitle: "Airports",
    modalAirBody:
      "Boarding, delays, gates and weather with TBW advice for passengers.",

    modalEventsTitle: "Events & nightlife",
    modalEventsBody:
      "Concerts, festivals, cinema, clubs – personalized suggestions for you.",

    modalShopsTitle: "Shops & energy",
    modalShopsBody:
      "Malls, shops, opening hours, fuel and EV chargers with TBW filters.",

    modalSafetyTitle: "Safety & SOS",
    modalSafetyBody:
      "ICE contacts, local emergency numbers and TBW safety reminders for travel.",

    navFrom: "From",
    navTo: "To",
    navStart: "Start",
    navProfile: "Profile",
    navProfileCar: "Car",
    navProfileTruck: "Truck",
    navProfileMoto: "Moto",

    voiceNavHint:
      'Say e.g. "Route from Karlovac to Zadar" or "Take me to Split".',
    featurePremiumBadge: "PREMIUM",

    footerDisclaimer:
      "TBW AI PREMIUM is an informational assistant. Always verify traffic, weather and safety with official sources.",
  },

  // Možeš kasnije proširiti ove jezike,
  // za sada ih držimo istima kao EN da sve radi.
  de: {},
  it: {},
  sl: {},
};

// fallback: ako prijevod ne postoji u jeziku, uzmi HR ili ključ
export function t(lang, key) {
  const langPack = translations[lang] || translations[DEFAULT_LANG];
  if (langPack && langPack[key]) return langPack[key];

  const hrPack = translations.hr || {};
  return hrPack[key] || key;
}
