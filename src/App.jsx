import React, { useEffect, useState } from "react";
import "./App.css";

/**
 * TBW AI PREMIUM – glavni React komponent
 *
 * MODE:
 *  - "trial"  -> besplatni demo, besplatni API-i, basic rute
 *  - "demo"   -> isto kao trial, ali bez odbrojavanja
 *  - "premium"-> full navigacija (Google + TBW copilot, glas, kamere…)
 *  - "founder"-> sve kao premium + dodatne admin opcije kasnije
 */

// gradovi s “bogatijim” demo podacima
const PRESET_CITIES = {
  zagreb: {
    ticker:
      "Noćni život u Zagrebu: klubovi rade produženo (provjeri lokalne propise).",
    weather: "3.6°C · vedro",
    traffic:
      "Pojačan promet u zoni ulaza u Zagreb. Manje gužve na obilaznici.",
    highlights: ["Trg bana Jelačića", "Gornji grad", "Maksimir"],
    nightlife: ["Bllazar", "Agava", "Didov San"],
    cafes: ["Cvjetni", "Dežman", "Botaničar"],
    clubs: ["Katran", "Opera"],
    shops: ["Konzum", "Spar", "Plodine"],
    malls: ["Arena Centar", "Avenue Mall"],
    gas: ["Tifon", "INA", "Crodux"],
  },
  split: {
    ticker: "Gužve prema trajektnom pristaništu. Preporuka: doći ranije.",
    weather: "11°C · sunčano",
    traffic:
      "Pojačan promet na prilazu centru i Rivi. Slobodna mjesta u garažama.",
    highlights: ["Dioklecijanova palača", "Riva", "Marjan"],
    nightlife: ["Fabrique", "Central", "Vanilla"],
    cafes: ["Žbirac", "Luxor", "Riva bar"],
    clubs: ["Central", "Academia Club Ghetto"],
    shops: ["Joker", "City Center One"],
    malls: ["Joker", "Mall of Split"],
    gas: ["INA", "Tifon"],
  },
  karlovac: {
    ticker:
      "Promet kroz Karlovac uredan, lokalno mokar kolnik. Oprez na rotoru.",
    weather: "2.1°C · magla",
    traffic: "Bez većih zastoja, povremeno pojačan promet kroz centar.",
    highlights: ["Stari grad Dubovac", "Četiri rijeke", "Aquatika"],
    nightlife: ["Papaya", "River Pub"],
    cafes: ["Tesla", "Aquarius"],
    clubs: ["Monaco"],
    shops: ["Kaufland", "Lidl"],
    malls: ["Supernova"],
    gas: ["INA", "Crodux"],
  },
  zadar: {
    ticker: "Morske orgulje i Pozdrav Suncu rade do kasno u noć.",
    weather: "9°C · vedro",
    traffic:
      "Lagane gužve oko Poluotoka. Parkiranje ograničeno u staroj jezgri.",
    highlights: ["Morske orgulje", "Pozdrav Suncu", "Kalelarga"],
    nightlife: ["Ledana", "Maraschino"],
    cafes: ["Cult", "Garden Lounge"],
    clubs: ["Maraschino", "Ledana"],
    shops: ["Supernova", "City Galleria"],
    malls: ["Supernova"],
    gas: ["INA", "Shell"],
  },
};

// generički fallback podaci za bilo koji drugi grad
const buildGenericCityData = (name) => ({
  ticker: `TBW AI: prikazujemo standardne informacije za područje – ${name}.`,
  weather: "— °C · podaci u obradi",
  traffic:
    "Još nemamo detaljnu sliku prometa za ovaj grad – koristi osnovne rute i lokalne izvore.",
  highlights: ["Centar grada", "Glavni trg", "Najpoznatija šetnica"],
  nightlife: ["Lokalni barovi", "Restorani u centru"],
  cafes: ["Najbliži kafići", "Šetnica uz rijeku/more"],
  clubs: ["Popularni klubovi u gradu"],
  shops: ["Trgovine mješovitom robom", "Manji trgovački centri"],
  malls: ["Glavni shopping centar"],
  gas: ["Najbliže benzinske postaje"],
});

const TRIAL_DURATION_DAYS = 3;

function detectInitialMode() {
  try {
    const stored = localStorage.getItem("tbw_mode_v1");
    const trialStart = localStorage.getItem("tbw_trial_start_v1");

    if (!stored) {
      // prvi ulazak – start trial
      const now = Date.now();
      localStorage.setItem("tbw_mode_v1", "trial");
      localStorage.setItem("tbw_trial_start_v1", String(now));
      return "trial";
    }

    if (stored === "trial" && trialStart) {
      const diffDays =
        (Date.now() - Number(trialStart)) / (1000 * 60 * 60 * 24);
      if (diffDays > TRIAL_DURATION_DAYS) {
        localStorage.setItem("tbw_mode_v1", "demo");
        return "demo";
      }
    }

    return stored;
  } catch {
    return "trial";
  }
}

function saveMode(mode) {
  try {
    localStorage.setItem("tbw_mode_v1", mode);
  } catch {
    // ignore
  }
}

const IntroOverlay = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 12000); // safety timeout 12 s
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro-overlay">
      <video
        className="intro-video"
        autoPlay
        muted={false}
        playsInline
        onEnded={onFinish}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      <button className="intro-skip" onClick={onFinish}>
        Skip intro
      </button>
    </div>
  );
};

function TBWApp() {
  const [mode, setMode] = useState(detectInitialMode);
  const [language, setLanguage] = useState("hr");
  const [city, setCity] = useState("Zagreb");
  const [cityData, setCityData] = useState(
    PRESET_CITIES["zagreb"] || buildGenericCityData("Zagreb")
  );
  const [searchValue, setSearchValue] = useState("Zagreb");
  const [tickerMessage, setTickerMessage] = useState(cityData.ticker);
  const [fullscreenPanel, setFullscreenPanel] = useState(null); // "navigation", "traffic", ...
  const [showIntro, setShowIntro] = useState(false);

  // intro – samo prvi put
  useEffect(() => {
    try {
      const seen = localStorage.getItem("tbw_intro_seen_v1");
      if (!seen) {
        setShowIntro(true);
      }
    } catch {
      setShowIntro(true);
    }
  }, []);

  const handleIntroFinish = () => {
    setShowIntro(false);
    try {
      localStorage.setItem("tbw_intro_seen_v1", "1");
    } catch {
      // ignore
    }
  };

  // kad se promijeni grad, učitaj pripremljene ili generičke podatke
  const updateCity = (newCityRaw) => {
    const newCity = newCityRaw.trim();
    if (!newCity) return;

    const key = newCity.toLowerCase();
    const preset = PRESET_CITIES[key];
    const data = preset || buildGenericCityData(newCity);

    setCity(newCity);
    setCityData(data);
    setTickerMessage(data.ticker);
  };

  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    updateCity(searchValue);
  };

  const handleQuickCityClick = (name) => {
    setSearchValue(name);
    updateCity(name);
  };

  const isPremium =
    mode === "premium" || mode === "founder" || mode === "founder-premium";

  const changeMode = (newMode) => {
    setMode(newMode);
    saveMode(newMode);
  };

  // helper za prikaz oznake moda
  const renderModeLabel = () => {
    switch (mode) {
      case "trial":
        return "Free trial · 3 dana";
      case "demo":
        return "Demo";
      case "premium":
        return "Premium";
      case "founder":
        return "Founder";
      default:
        return mode;
    }
  };

  // klik na “full screen” karticu
  const openPanel = (panel) => {
    setFullscreenPanel(panel);
  };

  const closePanel = () => {
    setFullscreenPanel(null);
  };

  return (
    <>
      {showIntro && <IntroOverlay onFinish={handleIntroFinish} />}

      <div className="tbw-app">
        {/* FIXNI GORNJI DIO */}
        <header className="tbw-header-fixed">
          {/* ticker */}
          <div className="tbw-ticker">
            <span
              className={
                isPremium ? "ticker-dot ticker-dot-premium" : "ticker-dot"
              }
            />
            <span className="ticker-label">
              {isPremium ? "LIVE (premium)" : "INFO (demo)"}
            </span>
            <span className="ticker-text">{tickerMessage}</span>
          </div>

          {/* gornja navigacija / logo / mode */}
          <div className="tbw-topbar">
            <div className="tbw-topbar-left">
              <img className="tbw-logo" src="/tbw-logo.png" alt="TBW AI" />
              <div>
                <div className="tbw-brand">TBW AI PREMIUM</div>
                <div className="tbw-subbrand">Navigator</div>
              </div>
            </div>

            <div className="tbw-topbar-right">
              <select
                className="tbw-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="hr">HR</option>
                <option value="en">EN</option>
                <option value="de">DE</option>
                <option value="it">IT</option>
                <option value="fr">FR</option>
                <option value="es">ES</option>
                <option value="pl">PL</option>
                <option value="cs">CZ</option>
                <option value="sl">SL</option>
                <option value="hu">HU</option>
                <option value="sr">SR</option>
                <option value="bs">BS</option>
                <option value="mk">MK</option>
                <option value="sq">SQ</option>
                <option value="ar">AR</option>
                <option value="nl">NL</option>
                <option value="uk">UKR</option>
                <option value="fi">FI</option>
              </select>

              <select
                className="tbw-mode-select"
                value={mode}
                onChange={(e) => changeMode(e.target.value)}
              >
                <option value="trial">Free trial</option>
                <option value="demo">Demo</option>
                <option value="premium">Premium</option>
                <option value="founder">Founder</option>
              </select>

              <span className="tbw-mode-badge">{renderModeLabel()}</span>
            </div>
          </div>

          {/* glavni hero + tražilica */}
          <div className="tbw-hero">
            <div className="hero-city-row">
              <button
                className="hero-city-chip"
                onClick={() => handleQuickCityClick("Zagreb")}
              >
                Zagreb
              </button>
              <button
                className="hero-city-chip"
                onClick={() => handleQuickCityClick("Split")}
              >
                Split
              </button>
              <button
                className="hero-city-chip"
                onClick={() => handleQuickCityClick("Karlovac")}
              >
                Karlovac
              </button>
              <button
                className="hero-city-chip"
                onClick={() => handleQuickCityClick("Zadar")}
              >
                Zadar
              </button>
            </div>

            <div className="hero-main">
              <div className="hero-city-label">{city}</div>
              <form
                className="hero-search"
                onSubmit={handleGlobalSearchSubmit}
              >
                <input
                  className="hero-search-input"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Npr. 'Nađi mi apartmane u Splitu za vikend'"
                />
                <button className="hero-search-btn" type="submit">
                  Traži
                </button>
                <button
                  type="button"
                  className="hero-search-mic"
                  onClick={() =>
                    alert(
                      "Glasovno pretraživanje će biti aktivno u premium verziji (TBW AI glas)."
                    )
                  }
                >
                  🎙
                </button>
              </form>
              <div className="hero-helper-text">
                Možeš pitati za promet, vrijeme, smještaj, rute, more, aerodrom
                ili prijaviti nesreću.
              </div>
            </div>
          </div>
        </header>

        {/* SCROLL DIO */}
        <main className="tbw-main-scroll">
          {/* prvi red: Navigacija + Smještaj + Vrijeme */}
          <section className="tbw-grid tbw-grid-first">
            <article
              className="tbw-card tbw-card-large"
              onClick={() => openPanel("navigation")}
            >
              <div className="card-title-row">
                <h3>Navigacija</h3>
                <span className="card-tag">
                  {isPremium ? "TBW Premium" : "Osnovna ruta"}
                </span>
              </div>
              <div className="card-body">
                <div className="card-label">Aktivna ruta</div>
                <div className="card-value">Nema aktivne rute.</div>
                <div className="card-small">
                  Klikni za full-screen kartu s rutama.
                </div>
                <div className="card-route-inputs">
                  <input
                    placeholder="Polazak"
                    className="card-input"
                    disabled
                  />
                  <input
                    placeholder="Odredište"
                    className="card-input"
                    disabled
                  />
                </div>
              </div>
            </article>

            <article
              className="tbw-card tbw-card-large"
              onClick={() => openPanel("accommodation")}
            >
              <div className="card-title-row">
                <h3>Rezervacija smještaja</h3>
                <span className="card-tag">Booking · Airbnb · Ostalo</span>
              </div>
              <div className="card-body">
                <div className="card-label">Lokacija</div>
                <div className="card-value">{city}</div>
                <div className="card-label">Datumi</div>
                <div className="card-value">Nije zadano</div>
                <div className="card-small">
                  Klikni za pregled ponuda (demo). Premium koristi tvoje API
                  ključeve.
                </div>
              </div>
            </article>

            <article
              className="tbw-card"
              onClick={() => openPanel("weather")}
            >
              <div className="card-title-row">
                <h3>Vrijeme</h3>
                <span className="card-tag">OpenWeather</span>
              </div>
              <div className="card-body">
                <div className="card-value">{cityData.weather}</div>
                <div className="card-small">
                  Podaci su informativni – uvijek provjeri službene izvore.
                </div>
              </div>
            </article>
          </section>

          {/* drugi red: promet, aerodromi, sigurnost */}
          <section className="tbw-grid">
            <article
              className="tbw-card"
              onClick={() => openPanel("traffic")}
            >
              <div className="card-title-row">
                <h3>Promet uživo</h3>
                <span className="card-tag">
                  {isPremium ? "Kamere · Radovi · Upozorenja" : "Osnovne info"}
                </span>
              </div>
              <div className="card-body">
                <div className="card-value">{cityData.traffic}</div>
                <div className="card-small">
                  Klikni za prošireni prikaz i TBW AI komentare.
                </div>
              </div>
            </article>

            <article
              className="tbw-card"
              onClick={() => openPanel("airports")}
            >
              <div className="card-title-row">
                <h3>Aerodromi</h3>
                <span className="card-tag">Letovi & kašnjenja</span>
              </div>
              <div className="card-body">
                <div className="card-value">
                  Prikaz najbliže zračne luke i osnovnih informacija.
                </div>
                <div className="card-small">
                  Premium koristi tvoj AviationStack / Flight API.
                </div>
              </div>
            </article>

            <article
              className="tbw-card"
              onClick={() => openPanel("safety")}
            >
              <div className="card-title-row">
                <h3>Sigurnost & SOS</h3>
                <span className="card-tag">112 · 192 · 193 · 194</span>
              </div>
              <div className="card-body">
                <div className="card-value">SOS profil još nije postavljen.</div>
                <div className="card-small">
                  Uredi svoj SOS profil i ICE kontakte (demo). Brojevi hitnih
                  službi: 112 / 192 / 193 / 194.
                </div>
              </div>
            </article>
          </section>

          {/* treći red: što posjetiti, hrana, trgovine */}
          <section className="tbw-grid">
            <article
              className="tbw-card"
              onClick={() => openPanel("highlights")}
            >
              <div className="card-title-row">
                <h3>Što posjetiti</h3>
                <span className="card-tag">OpenTripMap</span>
              </div>
              <div className="card-body">
                <ul className="card-list">
                  {cityData.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>

            <article
              className="tbw-card"
              onClick={() => openPanel("food")}
            >
              <div className="card-title-row">
                <h3>Hrana & Nightlife</h3>
                <span className="card-tag">Restorani · Kafići · Klubovi</span>
              </div>
              <div className="card-body card-body-columns">
                <div>
                  <div className="card-column-title">Restorani</div>
                  <ul className="card-list">
                    {cityData.nightlife.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="card-column-title">Kafići</div>
                  <ul className="card-list">
                    {cityData.cafes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="card-column-title">Klubovi</div>
                  <ul className="card-list">
                    {cityData.clubs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            <article
              className="tbw-card"
              onClick={() => openPanel("shopping")}
            >
              <div className="card-title-row">
                <h3>Trgovine & energija</h3>
                <span className="card-tag">Trgovine · Shopping centri</span>
              </div>
              <div className="card-body card-body-columns">
                <div>
                  <div className="card-column-title">Trgovine</div>
                  <ul className="card-list">
                    {cityData.shops.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="card-column-title">Shopping centri</div>
                  <ul className="card-list">
                    {cityData.malls.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="card-column-title">Benzinske / EV</div>
                  <ul className="card-list">
                    {cityData.gas.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </section>

          {/* četvrti red: truck & long-haul, javni prijevoz, trajekti */}
          <section className="tbw-grid">
            <article
              className="tbw-card"
              onClick={() => openPanel("truck")}
            >
              <div className="card-title-row">
                <h3>Truck & long-haul</h3>
                <span className="card-tag">TBW Truck mode</span>
              </div>
              <div className="card-body">
                <div className="card-value">
                  Zimski režim, obavezni lanci iznad 900 m.  
                  Zabranjen tranzit za 7.5 t kroz centre gradova.
                </div>
                <div className="card-small">
                  Premium: prilagođene rute za kamione, odmorišta, zabrane.
                </div>
              </div>
            </article>

            <article
              className="tbw-card"
              onClick={() => openPanel("transit")}
            >
              <div className="card-title-row">
                <h3>Javni prijevoz</h3>
                <span className="card-tag">Bus · Vlak · Taxi</span>
              </div>
              <div className="card-body">
                <div className="card-value">
                  Klikni za prikaz najbližih polazaka (demo raspon oko trenutnog
                  vremena).
                </div>
                <div className="card-small">
                  Premium: live kašnjenja, presjedanja i TBW prijedlozi rute.
                </div>
              </div>
            </article>

            <article
              className="tbw-card"
              onClick={() => openPanel("ferries")}
            >
              <div className="card-title-row">
                <h3>Trajekti</h3>
                <span className="card-tag">Lučke informacije</span>
              </div>
              <div className="card-body">
                <div className="card-value">
                  Info o najbližim trajektnim linijama (demo). Premium: live
                  kašnjenja i status ukrcaja.
                </div>
              </div>
            </article>
          </section>

          {/* footer – sigurnosne napomene */}
          <footer className="tbw-footer">
            <p>
              TBW AI PREMIUM je informativni alat. Za promet, vrijeme, more i
              sigurnost uvijek provjeri službene izvore (MUP, HAK, DHMZ,
              kapetanije, zračne luke).
            </p>
            <p>
              Aplikacija i osnivač ne mogu odgovarati za gubitak novca, statusa
              premium korisnika niti za štetu nastalu zbog tehničkih problema,
              napada, virusa ili pada sustava.
            </p>
            <p>
              Za podršku: <a href="mailto:ai.tbw.booking@gmail.com">
                ai.tbw.booking@gmail.com
              </a>
            </p>
            <p>© {new Date().getFullYear()} TBW AI PREMIUM – sva prava pridržana.</p>
          </footer>
        </main>

        {/* FULLSCREEN PANEL – otvara se preko svih prozora */}
        {fullscreenPanel && (
          <div className="tbw-fullscreen">
            <div className="tbw-fullscreen-inner">
              <button className="fs-close" onClick={closePanel}>
                ✕
              </button>

              {fullscreenPanel === "navigation" && (
                <NavigationPanel city={city} isPremium={isPremium} />
              )}
              {fullscreenPanel === "traffic" && (
                <TrafficPanel city={city} isPremium={isPremium} />
              )}
              {fullscreenPanel === "accommodation" && (
                <AccommodationPanel city={city} isPremium={isPremium} />
              )}
              {fullscreenPanel === "weather" && (
                <WeatherPanel city={city} />
              )}
              {fullscreenPanel === "airports" && (
                <AirportsPanel city={city} isPremium={isPremium} />
              )}
              {fullscreenPanel === "safety" && <SafetyPanel city={city} />}
              {fullscreenPanel === "highlights" && (
                <HighlightsPanel city={city} />
              )}
              {fullscreenPanel === "food" && (
                <FoodPanel city={city} data={cityData} />
              )}
              {fullscreenPanel === "shopping" && (
                <ShoppingPanel city={city} data={cityData} />
              )}
              {fullscreenPanel === "truck" && (
                <TruckPanel city={city} isPremium={isPremium} />
              )}
              {fullscreenPanel === "transit" && (
                <TransitPanel city={city} />
              )}
              {fullscreenPanel === "ferries" && (
                <FerriesPanel city={city} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ==== PANELS – FULL SCREEN KOMPONENTE ==== */

const NavigationPanel = ({ city, isPremium }) => {
  return (
    <div className="fs-panel">
      <h2>Navigacija – {city}</h2>
      <p className="fs-tagline">
        Trenutni engine:{" "}
        <strong>
          {isPremium
            ? "TBW Premium (Google Directions + TBW AI copilot)"
            : "Osnovni (besplatni OSRM / demo podaci)"}
        </strong>
      </p>
      <p>
        U ovoj verziji frontend je spreman, a pozivi na backend / API rute se
        spajaju preko tvojih Vercel env varijabli. 
      </p>
      <div className="fs-form">
        <input
          className="fs-input"
          placeholder="Polazak (adresa, grad...)"
        />
        <input
          className="fs-input"
          placeholder="Odredište (adresa, grad...)"
        />
        <button
          className="fs-btn-primary"
          onClick={() =>
            alert(
              "Ovdje će se pozivati backend ruta: /api/route-basic (OSRM) za demo, /api/route-premium (Google) za premium."
            )
          }
        >
          Izračunaj rutu
        </button>
      </div>
      <div className="fs-map-placeholder">
        Ovdje dolazi karta s nacrtanom rutom, kamerama, radovima i glasovnim
        TBW AI uputama.
      </div>
    </div>
  );
};

const TrafficPanel = ({ city, isPremium }) => (
  <div className="fs-panel">
    <h2>Promet uživo – {city}</h2>
    <p>
      U demo/trial modu koristi se kombinacija besplatnih izvora (OSM, HAK
      RSS, lokalne kamere gdje je dopušteno). U premium modu TBW AI spaja tvoje
      plaćene API-je (Google, TomTom…).
    </p>
    <div className="fs-map-placeholder">
      Prikaz prometa, radova, fiksnih kamera i TBW AI komentara (prioritetne
      opasnosti, prijedlozi obilaznica…)
    </div>
  </div>
);

const AccommodationPanel = ({ city, isPremium }) => (
  <div className="fs-panel">
    <h2>Smještaj – {city}</h2>
    <p>
      Ovdje se spajaju Booking.com, Airbnb i drugi partneri. Frontend je
      spreman za prikaz rezultata po najnižoj cijeni, ocjeni i lokaciji.
    </p>
    <p>
      <strong>
        Demo/trial: prikazat će se samo primjeri. Premium: rade tvoji pravi
        API ključevi.
      </strong>
    </p>
    <div className="fs-list-placeholder">
      Lista ponuda / kartice apartmana idu ovdje.
    </div>
  </div>
);

const WeatherPanel = ({ city }) => (
  <div className="fs-panel">
    <h2>Vrijeme – {city}</h2>
    <p>
      OpenWeather / DHMZ integracija – trenutno je ovo demo prikaz. Backend
      rutu možeš povezati na /api/weather.
    </p>
    <div className="fs-list-placeholder">
      Detaljna prognoza po satima / danima ide ovdje.
    </div>
  </div>
);

const AirportsPanel = ({ city, isPremium }) => (
  <div className="fs-panel">
    <h2>Aerodromi u blizini – {city}</h2>
    <p>
      Premium koristi AviationStack / Flight API za dolaske, odlaske i
      kašnjenja. Demo prikazuje statičke informacije.
    </p>
    <div className="fs-list-placeholder">
      Tablica letova (broj leta, destinacija, gate, status).
    </div>
  </div>
);

const SafetyPanel = ({ city }) => (
  <div className="fs-panel">
    <h2>Sigurnost &amp; SOS – {city}</h2>
    <p>
      Ovdje uređuješ svoj SOS profil, ICE kontakte i prečace za pozivanje
      službi. Podaci se spremaju lokalno na uređaj (localStorage) – bez slanja
      na server.
    </p>
    <div className="fs-list-placeholder">
      Forme za unos kontakata + velike tipke 112 / 192 / 193 / 194.
    </div>
  </div>
);

const HighlightsPanel = ({ city }) => (
  <div className="fs-panel">
    <h2>Što posjetiti – {city}</h2>
    <p>
      Integracija s OpenTripMap / Google Places: TBW AI filtrira najzanimljivija
      mjesta za tvoj stil putovanja.
    </p>
    <div className="fs-list-placeholder">
      Kartice atrakcija s opisom, ocjenama i kartom.
    </div>
  </div>
);

const FoodPanel = ({ city, data }) => (
  <div className="fs-panel">
    <h2>Hrana &amp; Nightlife – {city}</h2>
    <div className="fs-columns">
      <div>
        <h3>Restorani</h3>
        <ul>
          {data.nightlife.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Kafići</h3>
        <ul>
          {data.cafes.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Klubovi</h3>
        <ul>
          {data.clubs.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const ShoppingPanel = ({ city, data }) => (
  <div className="fs-panel">
    <h2>Trgovine &amp; energija – {city}</h2>
    <div className="fs-columns">
      <div>
        <h3>Trgovine</h3>
        <ul>
          {data.shops.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Shopping centri</h3>
        <ul>
          {data.malls.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Benzinske / EV</h3>
        <ul>
          {data.gas.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const TruckPanel = ({ city, isPremium }) => (
  <div className="fs-panel">
    <h2>Truck &amp; long-haul – {city}</h2>
    <p>
      TBW Truck Mode uzima u obzir visinu, masu i zabrane za kamione. U
      premium modu koristi tvoje rute na Google / TomTom API-ju, u demo modu
      generičke preporuke.
    </p>
    <div className="fs-list-placeholder">
      Plan odmorišta, benzinskih i ograničenja visine / mase.
    </div>
  </div>
);

const TransitPanel = ({ city }) => (
  <div className="fs-panel">
    <h2>Javni prijevoz – {city}</h2>
    <p>
      Prikaz autobusnih i željezničkih linija oko trenutnog vremena. Backend
      možeš spojiti na GTFS / open data izvore.
    </p>
    <div className="fs-list-placeholder">
      Tablica polazaka i kašnjenja.
    </div>
  </div>
);

const FerriesPanel = ({ city }) => (
  <div className="fs-panel">
    <h2>Trajekti – {city}</h2>
    <p>
      Informacije o trajektnim linijama i ukrcaju. Premium može imati live
      status ukrcaja s kamera i API-ja Jadrolinije/lučkih uprava.
    </p>
    <div className="fs-list-placeholder">
      Popis linija i vremena polaska/dolaska.
    </div>
  </div>
);

export default TBWApp;
