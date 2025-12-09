import React, { useEffect, useState } from "react";

/**
 * DEMO PODACI ZA 4 GLAVNA GRADA
 */
const DEMO_CITIES = {
  zagreb: {
    name: "Zagreb",
    country: "Hrvatska",
    heroImage: "/hero-zagreb.jpg",
    ticker: [
      "Noćni život u Zagrebu: klubovi rade produženo (provjeri lokalne propise).",
      "Zimski režim: obavezne zimske gume iznad 800 m.",
      "Preporuka TBW AI: provjeri Advent & koncertne evente."
    ],
    weather: "3.5°C · vedro"
  },
  split: {
    name: "Split",
    country: "Hrvatska",
    heroImage: "/hero-split.jpg",
    ticker: [
      "Promet na Poljičkoj pojačan – računaj na gužve.",
      "Trajekti za otoke: provjeri zadnje polaske.",
      "Preporuka TBW AI: šetnja Riva + večera u centru."
    ],
    weather: "9.2°C · vedro"
  },
  zadar: {
    name: "Zadar",
    country: "Hrvatska",
    heroImage: "/hero-zadar.jpg",
    ticker: [
      "Pozdrav suncu & Morske orgulje: pojačan priljev turista.",
      "Radovi na Jadranskoj magistrali – moguća zadržavanja.",
      "Preporuka TBW AI: provjeri večerašnje evente u staroj jezgri."
    ],
    weather: "7.8°C · promjenjivo"
  },
  karlovac: {
    name: "Karlovac",
    country: "Hrvatska",
    heroImage: "/hero-karlovac.jpg",
    ticker: [
      "Mostovi preko Kupe i Korane prohodni, povremene gužve.",
      "Zimski uvjeti mogući na pravcu prema Slunju.",
      "Preporuka TBW AI: šetnja Zvijezdom i uz rijeke."
    ],
    weather: "1.9°C · hladno"
  }
};

/**
 * KARTICE / PROZORI
 */
const CARD_CONFIG = [
  {
    id: "navigation",
    title: "Navigacija",
    subtitle: "Aktivna ruta / profil",
    premium: true
  },
  {
    id: "booking",
    title: "Rezervacija smještaja",
    subtitle: "Apartmani, hoteli, vikend paketi",
    premium: false
  },
  {
    id: "weather",
    title: "Vrijeme",
    subtitle: "Trenutno vrijeme i prognoza",
    premium: false
  },
  {
    id: "traffic",
    title: "Promet uživo",
    subtitle: "Gužve, kamere, radovi",
    premium: false
  },
  {
    id: "airports",
    title: "Aerodromi",
    subtitle: "Dolazni i odlazni letovi",
    premium: false
  },
  {
    id: "events",
    title: "Eventi",
    subtitle: "Koncerti, festivali, događanja",
    premium: false
  },
  {
    id: "shopping",
    title: "Trgovine & energija",
    subtitle: "Shopping centri, benzinske, EV",
    premium: false
  },
  {
    id: "truck",
    title: "Truck & long-haul",
    subtitle: "Rute za kamione (premium)",
    premium: true
  },
  {
    id: "transit",
    title: "Javni prijevoz",
    subtitle: "Vlakovi, autobusi, trajekti",
    premium: false
  },
  {
    id: "sos",
    title: "Sigurnost & SOS",
    subtitle: "Hitne službe, ICE kontakti",
    premium: false
  }
];

/**
 * INTRO OVERLAY – pusti /public/intro.mp4 jednom
 */
const IntroOverlay = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 9000); // fallback ako video ne javi "ended"
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro-overlay">
      <video
        className="intro-video"
        src="/intro.mp4"
        autoPlay
        muted={false}
        onEnded={onFinish}
      />
      <div className="intro-logo">
        <img src="/tbw-logo.png" alt="TBW AI logo" />
        <span>TBW AI PREMIUM NAVIGATOR</span>
      </div>
    </div>
  );
};

/**
 * GLAVNA APLIKACIJA
 */
const App = () => {
  const [plan, setPlan] = useState("trial"); // trial | demo | premium
  const [cityKey, setCityKey] = useState("zagreb");
  const [cityName, setCityName] = useState("Zagreb");
  const [search, setSearch] = useState("Zagreb");
  const [fullCard, setFullCard] = useState(null); // id kartice
  const [tickerIndex, setTickerIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(false);

  const currentCity =
    DEMO_CITIES[cityKey] || {
      name: cityName,
      country: "",
      heroImage: "/tbw-logo.png",
      ticker: [
        `Demo podaci za grad ${cityName}.`,
        "Za pune podatke aktiviraj TBW AI PREMIUM.",
        "Neki sadržaji ovise o dostupnosti API-ja."
      ],
      weather: "—"
    };

  // Intro samo prvi put
  useEffect(() => {
    const seen = localStorage.getItem("tbw_intro_seen");
    if (!seen) {
      setShowIntro(true);
      localStorage.setItem("tbw_intro_seen", "1");
    }
  }, []);

  // Ticker automatska rotacija
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % currentCity.ticker.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [currentCity.ticker.length]);

  // Simulacija automatske promjene plana (trial -> demo nakon 3 dana)
  useEffect(() => {
    const stored = localStorage.getItem("tbw_plan");
    if (stored) {
      setPlan(stored);
      return;
    }
    setPlan("trial");
    const timer = setTimeout(() => {
      setPlan("demo");
      localStorage.setItem("tbw_plan", "demo");
    }, 3 * 24 * 60 * 60 * 1000); // 3 dana
    return () => clearTimeout(timer);
  }, []);

  const handlePlanChange = (next) => {
    setPlan(next);
    localStorage.setItem("tbw_plan", next);
  };

  const detectCityFromQuery = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("zagreb")) return { key: "zagreb", name: "Zagreb" };
    if (lower.includes("split")) return { key: "split", name: "Split" };
    if (lower.includes("zadar")) return { key: "zadar", name: "Zadar" };
    if (lower.includes("karlovac")) return { key: "karlovac", name: "Karlovac" };

    const cleaned =
      text.trim().length === 0
        ? "Zagreb"
        : text.trim().replace(/\s+/g, " ");

    // generički grad – nema posebne hero slike ali SVE kartice rade
    return {
      key: cleaned.toLowerCase().replace(/\s+/g, "-"),
      name: cleaned
    };
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const { key, name } = detectCityFromQuery(search);
    setCityKey(key);
    setCityName(name);
  };

  const handleMicClick = () => {
    alert(
      "Mikrofon demo: u finalnoj verziji ovdje ide pravi 'speech-to-text' (Web Speech API / mobilni SDK)."
    );
  };

  const isPremiumActive = plan === "premium";

  const openCard = (id) => setFullCard(id);
  const closeCard = () => setFullCard(null);

  const renderCardContent = (id) => {
    switch (id) {
      case "navigation":
        return (
          <>
            <h2>Navigacija – pametni suputnik</h2>
            {!isPremiumActive && (
              <p className="card-note">
                Ovo je <strong>demo prikaz</strong>. Za punu glasovnu navigaciju,
                kamere, radare i truck rute aktiviraj TBW AI PREMIUM.
              </p>
            )}
            <p>
              Planirano: full-screen karta, live promet, glasovne upute, upozorenja
              na radare i radove, truck profili, offline rute i još mnogo toga.
            </p>
          </>
        );
      case "booking":
        return (
          <>
            <h2>Rezervacija smještaja – {currentCity.name}</h2>
            <p>
              U premium modu ovdje će se spajati na Booking, Airbnb i druge
              partnere prema traženom terminu i budžetu.
            </p>
            <ul>
              <li>Filtriranje po cijeni, lokaciji, ocjeni.</li>
              <li>Brzi pregled dostupnosti za blagdane i vikende.</li>
            </ul>
          </>
        );
      case "weather":
        return (
          <>
            <h2>Vrijeme – {currentCity.name}</h2>
            <p>Trenutno: {currentCity.weather}</p>
            <p>
              U punoj verziji: satna i 7-dnevna prognoza, stanje mora, UV indeks,
              upozorenja DHMZ-a.
            </p>
          </>
        );
      case "traffic":
        return (
          <>
            <h2>Promet uživo – {currentCity.name}</h2>
            <p>
              Planirano: spajanje na Google / TomTom prometne podatke, radove,
              kamere, HAK i lokalne izvore.
            </p>
          </>
        );
      case "airports":
        return (
          <>
            <h2>Aerodromi – {currentCity.name}</h2>
            <p>
              U finalu: praćenje letova (dolazni/odlazni), kašnjenja i gate
              informacije preko aviation API-ja.
            </p>
          </>
        );
      case "events":
        return (
          <>
            <h2>Eventi – {currentCity.name}</h2>
            <p>
              Koncerti, festivali, sportska događanja i lokalne manifestacije za
              odabrani grad.
            </p>
          </>
        );
      case "shopping":
        return (
          <>
            <h2>Trgovine & energija – {currentCity.name}</h2>
            <p>
              Shopping centri, radno vrijeme trgovina, benzinske i EV punionice.
            </p>
          </>
        );
      case "truck":
        return (
          <>
            <h2>Truck & long-haul navigacija</h2>
            {!isPremiumActive && (
              <p className="card-note">
                Ovaj modul je <strong>isključivo za PREMIUM</strong> korisnike.
              </p>
            )}
            <p>
              Planirano: visine mostova, zabrane za kamione, preporučene rute,
              parkirališta i vremena vožnje.
            </p>
          </>
        );
      case "transit":
        return (
          <>
            <h2>Javni prijevoz – {currentCity.name}</h2>
            <p>
              U finalu: vlakovi, autobusi i trajekti za vrijeme kad si pritisnuo
              karticu (npr. polasci u sljedećih 90 min).
            </p>
          </>
        );
      case "sos":
        return (
          <>
            <h2>Sigurnost & SOS</h2>
            <p>
              Jedan dodir za pozive 112 / 192 / 193 / 194 i ICE kontakte koje
              spremiš u aplikaciji.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  const planLabel =
    plan === "trial"
      ? "Free trial (3 dana)"
      : plan === "demo"
      ? "Demo način"
      : "Premium";

  const planClass =
    plan === "trial" ? "pill-trial" : plan === "demo" ? "pill-demo" : "pill-premium";

  return (
    <>
      {showIntro && <IntroOverlay onFinish={() => setShowIntro(false)} />}

      <div className="app-root">
        {/* GORNJI FIKSNI DIO */}
        <header className="app-header">
          <div className="brand">
            <img src="/tbw-logo.png" alt="TBW AI logo" className="brand-logo" />
            <div className="brand-text">
              <span className="brand-title">TBW AI PREMIUM</span>
              <span className="brand-subtitle">Navigator</span>
            </div>
          </div>

          <div className="header-right">
            <div className="plan-switch">
              <button
                className={plan === "trial" ? "active" : ""}
                onClick={() => handlePlanChange("trial")}
              >
                Trial
              </button>
              <button
                className={plan === "demo" ? "active" : ""}
                onClick={() => handlePlanChange("demo")}
              >
                Demo
              </button>
              <button
                className={plan === "premium" ? "active" : ""}
                onClick={() => handlePlanChange("premium")}
              >
                Premium
              </button>
            </div>
            <span className={`plan-pill ${planClass}`}>{planLabel}</span>
          </div>
        </header>

        {/* TIKER */}
        <div className="ticker-bar">
          <span
            className={`ticker-dot ${
              plan === "premium" ? "dot-green" : plan === "demo" ? "dot-yellow" : "dot-blue"
            }`}
          />
          <span className="ticker-label">
            {plan === "premium" ? "LIVE" : plan === "demo" ? "DEMO" : "TRIAL"}
          </span>
          <div className="ticker-text">
            {currentCity.ticker[tickerIndex]}
          </div>
        </div>

        {/* HERO + GLAVNA TRAŽILICA */}
        <section className="hero-section">
          <div
            className="hero-image"
            style={{ backgroundImage: `url(${currentCity.heroImage})` }}
          >
            <div className="hero-gradient" />
            <div className="hero-caption">
              <span className="hero-city">{currentCity.name}</span>
              <span className="hero-country">{currentCity.country}</span>
            </div>
          </div>

          <form className="main-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Npr. “apartmani u Splitu za vikend” ili “promet u Karlovcu”"
            />
            <button
              type="button"
              className="mic-btn"
              onClick={handleMicClick}
              aria-label="Glasovno pretraživanje"
            >
              🎤
            </button>
            <button type="submit" className="search-btn">
              Traži
            </button>
          </form>

          <p className="search-hint">
            Glas: reci npr. <strong>“Hej TBW, nađi mi apartmane u Splitu za vikend”</strong>{" "}
            ili <strong>“Hej TBW, idem prema Zagrebu, kakav je promet ispred mene?”</strong>
          </p>
        </section>

        {/* GRID KARTICA */}
        <main className="cards-layout">
          {CARD_CONFIG.map((card) => (
            <button
              key={card.id}
              className="card"
              onClick={() => openCard(card.id)}
            >
              <div className="card-header">
                <h3>{card.title}</h3>
                {card.premium && <span className="badge-premium">PREMIUM</span>}
              </div>
              <p className="card-subtitle">{card.subtitle}</p>
              <p className="card-footnote">Grad: {currentCity.name}</p>
            </button>
          ))}
        </main>

        {/* FOOTER / ZAŠTITE */}
        <footer className="app-footer">
          <p>
            TBW AI PREMIUM je informativni alat. Za promet, vrijeme, more i
            sigurnost uvijek provjeri službene izvore (MUP, HAK, DHMZ, kapetanije,
            zračne luke).
          </p>
          <p>
            Aplikacija i autor ne mogu odgovarati za gubitak novca, statusa
            premium korisnika ili druge štete uzrokovane tehničkim problemima,
            napadima ili nedostupnošću API-ja.
          </p>
          <p>
            Sva prava pridržana. Kontakt:{" "}
            <a href="mailto:ai.tbw.booking@gmail.com">
              ai.tbw.booking@gmail.com
            </a>
          </p>
        </footer>

        {/* FULL-SCREEN PROZOR */}
        {fullCard && (
          <div className="fullscreen-overlay" onClick={closeCard}>
            <div
              className="fullscreen-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={closeCard}>
                ✕
              </button>
              {renderCardContent(fullCard)}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
