import React, { useEffect, useState, useMemo } from "react";

/* ------------------ POMOĆNE KONSTANTE ------------------ */

const MODES = {
  TRIAL: "trial",
  DEMO: "demo",
  PREMIUM: "premium",
};

const LANGS = [
  { code: "hr", label: "HR" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "it", label: "IT" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
  { code: "ru", label: "RU" },
  { code: "pl", label: "PL" },
  { code: "cs", label: "CZ" },
  { code: "hu", label: "HU" },
  { code: "sr", label: "SRB" },
  { code: "sl", label: "SLO" },
  { code: "sq", label: "SQ" }, // albanski
  { code: "ar", label: "AR" }, // arapski
  { code: "nl", label: "NL" }, // nizozemski
  { code: "uk", label: "UA" }, // ukrajinski
  { code: "fi", label: "FI" }, // finski
];

const TRANSLATIONS = {
  hr: {
    searchPlaceholder:
      "Pitaj TBW npr. 'Hej TBW, nađi mi apartmane u Splitu za vikend'",
    navigation: "Navigacija",
    booking: "Rezervacija smještaja",
    weather: "Vrijeme",
    liveTraffic: "Promet uživo",
    airports: "Aerodromi",
    events: "Eventi",
    shopping: "Trgovine & shopping",
    fuel: "Benzinske / EV",
    sos: "Sigurnost & SOS",
    trucks: "Truck & long-haul",
    publicTransit: "Javni prijevoz",
    ferries: "Trajekti",
    premiumOnly: "Dostupno samo u PREMIUM modu.",
    setRoute: "Postavi rutu",
    from: "Polazak",
    to: "Odredište",
    startNav: "Kreni",
    tbwAi: "TBW AI suputnik",
    modeTrial: "Free trial",
    modeDemo: "Demo",
    modePremium: "Premium",
    alerts: "Prometna upozorenja",
  },
  en: {
    searchPlaceholder:
      "Ask TBW e.g. 'Hey TBW, find me apartments in Split for the weekend'",
    navigation: "Navigation",
    booking: "Accommodation",
    weather: "Weather",
    liveTraffic: "Live traffic",
    airports: "Airports",
    events: "Events",
    shopping: "Shopping",
    fuel: "Fuel / EV",
    sos: "Safety & SOS",
    trucks: "Trucks & long-haul",
    publicTransit: "Public transport",
    ferries: "Ferries",
    premiumOnly: "Available in PREMIUM mode only.",
    setRoute: "Set route",
    from: "From",
    to: "To",
    startNav: "Start",
    tbwAi: "TBW AI co-driver",
    modeTrial: "Free trial",
    modeDemo: "Demo",
    modePremium: "Premium",
    alerts: "Alerts",
  },
};

function t(lang, key) {
  const base = TRANSLATIONS[lang] || TRANSLATIONS.hr;
  return base[key] || TRANSLATIONS.hr[key] || key;
}

/* ------------ DEMO PODACI ZA GRADOVE / PROZORE ---------- */

const CITY_DATA = {
  zagreb: {
    name: "Zagreb",
    headerTag: "Zagreb",
    weather: { temp: 3.6, desc: "vedro" },
    ticker: [
      "Noćni život u Zagrebu: klubovi rade produženo (provjeri lokalne propise).",
      "Zimski režim: obvezne zimske gume iznad 900 m.",
    ],
    bestSpots: ["Trg Bana Jelačića", "Gornji grad", "Maksimir"],
    nightlife: {
      rest: ["Balthazar", "Agava", "Didov San"],
      cafes: ["Cvjetni", "Dežman", "Program"],
      clubs: ["Katran", "Opera"],
    },
    shopping: {
      stores: ["Konzum", "Spar", "Plodine"],
      malls: ["Arena Centar", "Avenue Mall"],
      fuel: ["INA", "Tifon", "Crodux"],
    },
  },
  split: {
    name: "Split",
    headerTag: "Split",
    weather: { temp: 11, desc: "sunčano" },
    ticker: [
      "Radovi na Jadranskoj magistrali kod Omiša – moguće zastoje.",
      "Trajekti iz Splita za otoke voze po zimskom redu plovidbe.",
    ],
  },
  karlovac: {
    name: "Karlovac",
    headerTag: "Karlovac",
    weather: { temp: 2, desc: "oblačno" },
    ticker: [
      "Poledica moguća na mostovima preko Korane i Kupe.",
      "Promet pojačan na izlazu s autoceste Karlovac.",
    ],
  },
  zadar: {
    name: "Zadar",
    headerTag: "Zadar",
    weather: { temp: 9, desc: "bura" },
    ticker: [
      "Zatvorene pojedine dionice zbog jake bure (provjeri HAK).",
      "Morske orgulje i Pozdrav Suncu rade do 23:00.",
    ],
  },
  default: {
    name: "",
    headerTag: "",
    weather: { temp: 8, desc: "promjenjivo" },
    ticker: [
      "Nema posebnih upozorenja za odabrani grad.",
      "Uvijek provjeri lokalne prometne i sigurnosne informacije.",
    ],
  },
};

function getCityKey(raw) {
  if (!raw) return "zagreb";
  const s = raw.trim().toLowerCase();
  if (s.startsWith("zagreb")) return "zagreb";
  if (s.startsWith("split")) return "split";
  if (s.startsWith("karlovac")) return "karlovac";
  if (s.startsWith("zadar")) return "zadar";
  return "default";
}

/* ---------------------- GLAVNA APP ---------------------- */

function App() {
  const [mode, setMode] = useState(MODES.TRIAL); // za sada ručno, kasnije vezati na plaćanje
  const [language, setLanguage] = useState("hr");
  const [query, setQuery] = useState("Zagreb");
  const [cityKey, setCityKey] = useState("zagreb");
  const [fullscreenPanel, setFullscreenPanel] = useState(null); // 'nav','traffic','sos',...
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);

  const isPremium = mode === MODES.PREMIUM;
  const city = useMemo(() => CITY_DATA[cityKey] || CITY_DATA.default, [cityKey]);

  /* --------- INTRO – pusti jednom, zapamti u localStorage ---- */

  useEffect(() => {
    try {
      const seen = localStorage.getItem("tbw_intro_seen");
      if (!seen) {
        const video = document.getElementById("tbwIntro");
        if (video) {
          video.style.display = "block";
          video.play().catch(() => {
            // ako browser blokira auto-play, sakrij video
            video.style.display = "none";
          });
          video.onended = () => {
            video.style.display = "none";
            localStorage.setItem("tbw_intro_seen", "1");
          };
        }
      }
    } catch (e) {
      // nema veze, samo ne prikazujemo intro
    }
  }, []);

  /* ------------- HANDLERI ---------------- */

  function handleSearchSubmit(e) {
    e.preventDefault();
    const key = getCityKey(query);
    setCityKey(key);
    setRouteInfo(null);
  }

  function handleQuickCity(name) {
    setQuery(name);
    setCityKey(getCityKey(name));
    setRouteInfo(null);
  }

  function handleModeChange(e) {
    setMode(e.target.value);
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value);
  }

  function openPanel(id) {
    setFullscreenPanel(id);
  }

  function closePanel() {
    setFullscreenPanel(null);
  }

  function startNavigation() {
    if (!isPremium) {
      alert(t(language, "premiumOnly"));
      return;
    }
    if (!from || !to) {
      alert("Unesi polazak i odredište.");
      return;
    }

    // Ovdje kasnije zoveš pravi backend / API za rutu.
    setRouteInfo({
      from,
      to,
      distance: "348 km",
      duration: "3 h 20 min",
      tolls: "cestarina A1",
      info: "Premium TBW ruta uz promet, kamere i radove (placeholder demo).",
    });
  }

  const tickerText = (city.ticker || CITY_DATA.default.ticker).join(" • ");

  /* ----------------- RENDER ----------------- */

  return (
    <div className="app">
      {/* Gornji live tiker */}
      <div className="ticker">
        <div
          className={`ticker-status ${
            mode === MODES.PREMIUM
              ? "status-premium"
              : mode === MODES.DEMO
              ? "status-demo"
              : "status-trial"
          }`}
        />
        <span className="ticker-label">{t(language, "alerts")}:</span>
        <div className="ticker-text">
          <span>{tickerText}</span>
        </div>
      </div>

      {/* Fiksni header + search */}
      <header className="header">
        <div className="header-top">
          <div className="brand">
            <img src="/public/tbw-logo.png" alt="TBW logo" className="brand-logo" />
            <div className="brand-text">
              <div className="brand-title">TBW AI PREMIUM</div>
              <div className="brand-subtitle">Navigator</div>
            </div>
          </div>

          <div className="header-controls">
            <select
              className="select small"
              value={language}
              onChange={handleLanguageChange}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>

            <select className="select small" value={mode} onChange={handleModeChange}>
              <option value={MODES.TRIAL}>{t(language, "modeTrial")}</option>
              <option value={MODES.DEMO}>{t(language, "modeDemo")}</option>
              <option value={MODES.PREMIUM}>{t(language, "modePremium")}</option>
            </select>
          </div>
        </div>

        {/* Slika grada – trenutno Zadar stil, kasnije možeš staviti realne grad slike */}
        <div className="hero">
          <div className="hero-tag">
            {cityKey === "default" ? query || "TBW AI" : city.headerTag}
          </div>
          <div className={`hero-image hero-${cityKey}`} />
        </div>

        {/* Glavna AI tražilica */}
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(language, "searchPlaceholder")}
          />
          <button type="button" className="mic-button" title="Glasovni unos (demo)">
            🎤
          </button>
          <button type="submit" className="search-button">
            TBW AI
          </button>
        </form>
      </header>

      {/* SKROL DIO – sve ispod glavne tražilice */}
      <main className="main">
        {/* Prvi red: Navigacija + smještaj */}
        <section className="row two-cols">
          {/* Navigacija kartica */}
          <article
            className="card large"
            onClick={() => openPanel("nav")}
          >
            <header className="card-header">
              <h2>{t(language, "navigation")}</h2>
              <span className="card-sub">
                {city.name || query || "Odaberi grad"}
              </span>
            </header>
            <div className="card-body">
              <div className="nav-mini-route">
                <div className="nav-row">
                  <span className="label">{t(language, "from")}:</span>
                  <span className="value">{from || "Nije zadano"}</span>
                </div>
                <div className="nav-row">
                  <span className="label">{t(language, "to")}:</span>
                  <span className="value">{to || "Nije zadano"}</span>
                </div>
                <div className="nav-hint">
                  {t(language, "tbwAi")} – premium glasovni suputnik.
                </div>
              </div>
            </div>
          </article>

          {/* Rezervacija smještaja */}
          <article
            className="card large"
            onClick={() => openPanel("booking")}
          >
            <header className="card-header">
              <h2>{t(language, "booking")}</h2>
              <span className="card-sub">
                {city.name || query || "Odaberi grad"}
              </span>
            </header>
            <div className="card-body">
              <p>
                Demo prikaz ponuda za grad <strong>{city.name || query}</strong>.
                U premium modu spajaš Booking, Airbnb i lokalne agencije.
              </p>
              <button className="pill">Otvori ponude (demo)</button>
            </div>
          </article>
        </section>

        {/* Ostale linije po 3 kartice */}
        <section className="row three-cols">
          <CardWeather
            language={language}
            cityName={city.name || query}
            weather={city.weather}
            onOpen={() => openPanel("weather")}
          />
          <CardTraffic
            language={language}
            cityName={city.name || query}
            onOpen={() => openPanel("traffic")}
          />
          <CardAirports
            language={language}
            cityName={city.name || query}
            onOpen={() => openPanel("airports")}
          />
        </section>

        <section className="row three-cols">
          <CardEvents
            language={language}
            city={city}
            query={query}
            onOpen={() => openPanel("events")}
          />
          <CardShopping
            language={language}
            city={city}
            onOpen={() => openPanel("shopping")}
          />
          <CardTrucks
            language={language}
            onOpen={() => openPanel("trucks")}
          />
        </section>

        <section className="row three-cols">
          <CardPublicTransit
            language={language}
            cityName={city.name || query}
            onOpen={() => openPanel("transit")}
          />
          <CardFerries
            language={language}
            cityName={city.name || query}
            onOpen={() => openPanel("ferries")}
          />
          <CardSOS language={language} onOpen={() => openPanel("sos")} />
        </section>

        {/* Footer – zaštite i kontakt */}
        <footer className="footer">
          <p>
            TBW AI PREMIUM je informativni alat. Za promet, vrijeme, more i
            sigurnost uvijek provjeri službene izvore (MUP, HAK, DHMZ,
            kapetanije, zračne luke).
          </p>
          <p>
            TBW AI i autor aplikacije ne odgovaraju za gubitak novca ili statusa
            premium korisnika zbog tehničkih problema, pada sustava ili
            zlonamjernih napada.
          </p>
          <p>
            Sva prava pridržana. Kontakt:{" "}
            <a href="mailto:ai.tbw.booking@gmail.com">
              ai.tbw.booking@gmail.com
            </a>
          </p>
        </footer>
      </main>

      {/* FULLSCREEN PANELI */}
      {fullscreenPanel && (
        <FullscreenOverlay onClose={closePanel}>
          {fullscreenPanel === "nav" && (
            <FullscreenNav
              language={language}
              isPremium={isPremium}
              from={from}
              to={to}
              setFrom={setFrom}
              setTo={setTo}
              startNavigation={startNavigation}
              routeInfo={routeInfo}
            />
          )}
          {fullscreenPanel === "traffic" && (
            <div className="panel">
              <h2>{t(language, "liveTraffic")}</h2>
              <p>
                Ovdje će kasnije biti full-screen karta s prometom, kamerama,
                radovima i glasovnim upozorenjima (premium).
              </p>
            </div>
          )}
          {fullscreenPanel === "sos" && (
            <div className="panel">
              <h2>{t(language, "sos")}</h2>
              <p>
                Postavi svoj SOS profil, ICE kontakte i direktne tipke za 112 /
                911. Podaci se čuvaju samo na tvom uređaju.
              </p>
            </div>
          )}
          {/* Ostale panele možeš proširiti po potrebi */}
        </FullscreenOverlay>
      )}

      {/* BRZI GRADOVI (demo) */}
      <div className="quick-cities">
        {["Zagreb", "Split", "Karlovac", "Zadar"].map((c) => (
          <button key={c} onClick={() => handleQuickCity(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------- POMOĆNE KOMPONENTE KARTICA -------------- */

function CardWeather({ language, cityName, weather, onOpen }) {
  return (
    <article className="card" onClick={onOpen}>
      <header className="card-header">
        <h2>{t(language, "weather")}</h2>
      </header>
      <div className="card-body">
        <div className="weather-main">
          <div className="weather-icon">☁️</div>
          <div>
            <div className="weather-temp">
              {weather?.temp ?? "-"}°C
            </div>
            <div className="weather-desc">
              {weather?.desc ?? "—"}
            </div>
          </div>
        </div>
        <div className="weather-city">{cityName}</div>
      </div>
    </article>
  );
}

function CardTraffic({ language, cityName, onOpen }) {
  return (
    <article className="card" onClick={onOpen}>
      <header className="card-header">
        <h2>{t(language, "liveTraffic")}</h2>
      </header>
      <div className="card-body">
        <p>
          Kratki pregled prometa za <strong>{cityName}</strong> (demo podaci).
        </p>
        <ul className="bullets">
          <li>Glavne gradske prometnice – umjeren promet.</li>
          <li>Moguća zadržavanja u špici.</li>
        </ul>
      </div>
    </article>
  );
}

function CardAirports({ language, cityName, onOpen }) {
  return (
    <article className="card" onClick={onOpen}>
      <header className="card-header">
        <h2>{t(language, "airports")}</h2>
      </header>
      <div className="card-body">
        <p>
          Pregled najbližih aerodroma i status letova za područje{" "}
          <strong>{cityName}</strong>.
        </p>
      </div>
    </article>
  );
}

function CardEvents({ language, city, query, onOpen }) {
  const name = city.name || query;
  return (
    <article className="card" onClick={onOpen}>
      <header className="card-header">
        <h2>{t(language, "events")}</h2>
      </header>
      <div className="card-body">
        <p>
          Glavni događaji za <strong>{name}</strong> (demo): koncerti, festivali,
          izložbe.
        </p>
      </div>
    </article>
  );
}

function CardShopping({ language, city, onOpen }) {
  return (
    <article className="card" onClick={onOpen}>
      <header className="card-header">
        <h2>{t(language, "shopping")}</h2>
      </header>
      <div className="card-body">
        <p>
          Trgovine, shopping centri i <strong>{t(language, "fuel")}</strong>.
        </p>
        {city.shopping && (
          <>
            <div className="pill-row">
              {city.shopping.malls?.map((m) => (
                <span key={m} className="pill">
                  {m}
                </span>
              ))}
            </div>
            <div className="pill-row">
              {city.shopping.fuel?.map((f) => (
                <span key={f} className="pill">
                  {f}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function CardTrucks({ language, onOpen }) {
  return (
    <article className="card" onClick={onOpen}>
      <header className="card-header">
        <h2>{t(language, "trucks")}</h2>
      </header>
      <div className="card-body">
        <p>
          Poseban TBW profil za kamione: ograničenja, ADR, mostovi, odmorišta.
        </p>
      </div>
    </article>
  );
}

function CardPublicTransit({ language, cityName, onOpen }) {
  return (
    <article className="card" onClick={onOpen}>
      <header className="card-header">
        <h2>{t(language, "publicTransit")}</h2>
      </header>
      <div className="card-body">
        <p>
          Vlakovi i autobusi za <strong>{cityName}</strong> oko trenutnog vremena
          (demo raspored).
        </p>
      </div>
    </article>
  );
}

function CardFerries({ language, cityName, onOpen }) {
  return (
    <article className="card" onClick={onOpen}>
      <header className="card-header">
        <h2>{t(language, "ferries")}</h2>
      </header>
      <div className="card-body">
        <p>
          Trajekti i brodske linije za područje <strong>{cityName}</strong>.
        </p>
      </div>
    </article>
  );
}

function CardSOS({ language, onOpen }) {
  return (
    <article className="card" onClick={onOpen}>
      <header className="card-header">
        <h2>{t(language, "sos")}</h2>
      </header>
      <div className="card-body">
        <p>SOS profil, ICE kontakti, brzo biranje 112 / 911.</p>
      </div>
    </article>
  );
}

/* ---------------- FULLSCREEN OVERLAY ---------------- */

function FullscreenOverlay({ children, onClose }) {
  return (
    <div className="overlay">
      <div className="overlay-inner">
        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

function FullscreenNav({
  language,
  isPremium,
  from,
  to,
  setFrom,
  setTo,
  startNavigation,
  routeInfo,
}) {
  return (
    <div className="panel">
      <h2>{t(language, "navigation")} – TBW AI</h2>
      {!isPremium && (
        <p className="premium-note">
          {t(language, "premiumOnly")} (trial / demo koristi samo osnovne
          rute).
        </p>
      )}
      <div className="nav-form">
        <label>
          {t(language, "from")}
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="npr. Karlovac"
          />
        </label>
        <label>
          {t(language, "to")}
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="npr. Zagreb aerodrom"
          />
        </label>
        <button onClick={startNavigation} className="primary">
          {t(language, "startNav")}
        </button>
      </div>

      {routeInfo && (
        <div className="route-info">
          <h3>Ruta</h3>
          <p>
            {routeInfo.from} → {routeInfo.to}
          </p>
          <ul className="bullets">
            <li>Udaljenost: {routeInfo.distance}</li>
            <li>Vrijeme: {routeInfo.duration}</li>
            <li>Info: {routeInfo.info}</li>
          </ul>
        </div>
      )}

      <div className="nav-map-placeholder">
        Ovdje će biti interaktivna karta (Leaflet / Google Maps) s TBW
        premium slojevima (radovi, kamere, kamionske rute…).
      </div>
    </div>
  );
}

export default App;
