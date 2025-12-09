import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { LANGUAGES, t } from "./i18n";

const CITY_PROFILES = {
  zadar: {
    key: "zadar",
    name: "Zadar",
    country: "Hrvatska",
    lat: 44.1194,
    lon: 15.2314,
    hero: "/assets/hero-zadar.jpg",
    liveCam: null // ovdje kasnije možeš ubaciti pravi <iframe> URL
  },
  split: {
    key: "split",
    name: "Split",
    country: "Hrvatska",
    lat: 43.5081,
    lon: 16.4402,
    hero: "/assets/hero-split.jpg",
    liveCam: null
  },
  zagreb: {
    key: "zagreb",
    name: "Zagreb",
    country: "Hrvatska",
    lat: 45.815,
    lon: 15.9819,
    hero: "/assets/hero-zagreb.jpg",
    liveCam: null
  },
  karlovac: {
    key: "karlovac",
    name: "Karlovac",
    country: "Hrvatska",
    lat: 45.4929,
    lon: 15.5553,
    hero: "/assets/hero-karlovac.jpg",
    liveCam: null
  }
};

function findCityKeyFromQuery(query) {
  if (!query) return null;
  const q = query.toLowerCase();
  const keys = Object.keys(CITY_PROFILES);
  for (const k of keys) {
    if (q.includes(CITY_PROFILES[k].name.toLowerCase())) return k;
  }
  return null;
}

function detectDeviceLang() {
  if (typeof navigator === "undefined") return "hr";
  const nav = navigator.language || navigator.userLanguage || "hr";
  const short = nav.toLowerCase().split("-")[0];
  if (LANGUAGES[short]) return short;
  // posebni slučaj za pt-BR
  if (nav.toLowerCase().startsWith("pt")) return "pt-BR";
  return "en";
}

function getInitialPlan() {
  if (typeof window === "undefined") return "trial";
  let plan = localStorage.getItem("tbw_plan") || "trial";
  let start = localStorage.getItem("tbw_trial_start");
  const now = Date.now();
  if (!start) {
    start = String(now);
    localStorage.setItem("tbw_trial_start", start);
  }
  const days = Math.floor((now - Number(start)) / (1000 * 60 * 60 * 24));
  if (plan === "trial" && days >= 3) {
    plan = "demo";
    localStorage.setItem("tbw_plan", "demo");
  }
  return plan;
}

function getTrialLeftDays() {
  if (typeof window === "undefined") return 0;
  const start = Number(localStorage.getItem("tbw_trial_start") || Date.now());
  const now = Date.now();
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.max(0, 3 - days);
}

const App = () => {
  const [introDone, setIntroDone] = useState(
    typeof window !== "undefined" && localStorage.getItem("tbw_intro_done") === "1"
  );
  const [plan, setPlan] = useState(getInitialPlan);
  const [lang, setLang] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("tbw_lang") || detectDeviceLang()
      : "hr"
  );
  const [cityKey, setCityKey] = useState("zadar");
  const [search, setSearch] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [ticker, setTicker] = useState("");
  const [weather, setWeather] = useState({ temp: null, desc: "…" });
  const [navFrom, setNavFrom] = useState("");
  const [navTo, setNavTo] = useState("");
  const [navActive, setNavActive] = useState(null);
  const [micListening, setMicListening] = useState(false);
  const [modal, setModal] = useState(null);
  const [legalAccepted, setLegalAccepted] = useState(
    typeof window !== "undefined" && localStorage.getItem("tbw_legal") === "1"
  );
  const [legalChk1, setLegalChk1] = useState(false);
  const [legalChk2, setLegalChk2] = useState(false);

  const profile = useMemo(() => CITY_PROFILES[cityKey] || CITY_PROFILES.zadar, [cityKey]);
  const isDemoOrTrial = plan === "demo" || plan === "trial";

  // Intro
  useEffect(() => {
    if (introDone) return;
    const timer = setTimeout(() => {
      setIntroDone(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("tbw_intro_done", "1");
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [introDone]);

  // Spremi jezik
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tbw_lang", lang);
    }
  }, [lang]);

  // Ticker
  useEffect(() => {
    function updateTicker() {
      const modeLabel =
        plan === "premium"
          ? "PREMIUM"
          : plan === "trial"
          ? "TRIAL"
          : "DEMO";
      const base = [
        `TBW AI ${modeLabel}: informativni podaci, uvijek prati službene znakove i propise.`,
        `Grad ${profile.name}: večeras eventi, sniženja i nightlife – provjeri u kartici Eventi.`,
        `Provjeri stanje na cestama i kamerama prije polaska.`,
        `TBW AI ne preuzima odgovornost za prometne prekršaje – vozi odgovorno.`
      ];
      const idx = new Date().getSeconds() % base.length;
      setTicker(base[idx]);
    }
    updateTicker();
    const id = setInterval(updateTicker, 20000);
    return () => clearInterval(id);
  }, [profile.name, plan]);

  // Vrijeme – free API (Open-Meteo)
  useEffect(() => {
    let cancelled = false;
    async function loadWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${profile.lat}&longitude=${profile.lon}&current=temperature_2m,weather_code`;
        const res = await fetch(url);
        const js = await res.json();
        const temp =
          js.current && typeof js.current.temperature_2m === "number"
            ? js.current.temperature_2m
            : null;
        const code = js.current ? js.current.weather_code : 0;
        let desc = "vedro";
        if ([1, 2, 3].includes(code)) desc = "promjenjivo oblačno";
        else if ([51, 61, 63].includes(code)) desc = "kiša";
        else if ([71, 73, 75].includes(code)) desc = "snijeg";
        if (!cancelled) setWeather({ temp, desc });
      } catch (e) {
        if (!cancelled) setWeather({ temp: null, desc: "N/A" });
      }
    }
    loadWeather();
    return () => {
      cancelled = true;
    };
  }, [profile.lat, profile.lon]);

  // Legal
  const handleLegalAccept = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tbw_legal", "1");
    }
    setLegalAccepted(true);
  };

  // Plan badge text
  const planLabel = useMemo(() => {
    if (plan === "premium") return "PREMIUM · 9.99 €/mj";
    if (plan === "demo") return "DEMO mod";
    const left = getTrialLeftDays();
    return `FREE TRIAL · ${left} dana`;
  }, [plan]);

  const handlePlanClick = () => {
    if (plan === "premium") return;
    // DEMO checkout
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "Ovo je DEMO kupnja – nema stvarne naplate. Uključiti PREMIUM mod?"
      );
      if (ok) {
        localStorage.setItem("tbw_plan", "premium");
        setPlan("premium");
      }
    } else {
      setPlan("premium");
    }
  };

  // AI search logika
  const handleQuery = (q) => {
    if (!q) return;
    const cityFound = findCityKeyFromQuery(q);
    if (cityFound) setCityKey(cityFound);

    const lower = q.toLowerCase();
    const parts = [];

    if (lower.includes("apartman") || lower.includes("smještaj") || lower.includes("apartment")) {
      parts.push(`Tražim smještaj u području grada ${profile.name}.`);
    }
    if (lower.includes("promet") || lower.includes("traffic") || lower.includes("gužv")) {
      parts.push("Provjeravam promet i radove na cestama ispred tebe.");
    }
    if (lower.includes("vrijeme") || lower.includes("prognoza") || lower.includes("weather")) {
      parts.push("Provjeravam trenutno vrijeme i prognozu.");
    }
    if (lower.includes("let") || lower.includes("avion") || lower.includes("aerodrom")) {
      parts.push("Provjeravam stanje letova i kašnjenja.");
    }
    if (parts.length === 0) {
      parts.push(
        "Možeš pitati za rutu, promet, vrijeme, smještaj, evente, SOS ili javni prijevoz."
      );
    }
    setAiMessage(parts.join(" "));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleQuery(search);
  };

  // Mic (speech) – ako postoji
  useEffect(() => {
    const SR =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) return;
    const rec = new SR();
    rec.lang = "hr-HR";
    rec.continuous = true;
    rec.interimResults = false;

    const onResult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (!r.isFinal) continue;
        const text = r[0].transcript || "";
        setSearch(text);
        handleQuery(text);
      }
    };

    const onEnd = () => {
      setMicListening((prev) => {
        if (prev) {
          try {
            rec.start();
          } catch {}
        }
        return prev;
      });
    };

    rec.addEventListener("result", onResult);
    rec.addEventListener("end", onEnd);

    function toggle() {
      setMicListening((prev) => {
        const next = !prev;
        try {
          if (next) rec.start();
          else rec.stop();
        } catch {}
        return next;
      });
    }

    const btn = document.getElementById("tbw-mic");
    if (btn) btn.addEventListener("click", toggle);

    return () => {
      if (btn) btn.removeEventListener("click", toggle);
      rec.removeEventListener("result", onResult);
      rec.removeEventListener("end", onEnd);
      try {
        rec.stop();
      } catch {}
    };
  }, []); // jednom

  // Navigacija
  const handleNavStart = () => {
    if (!navFrom || !navTo) {
      setAiMessage("Za pokretanje navigacije upiši polazak i odredište.");
      return;
    }
    const info = {
      from: navFrom,
      to: navTo,
      mode: "car",
      city: profile.name
    };
    setNavActive(info);
    setAiMessage(
      `TBW navigacija: polazak ${navFrom}, odredište ${navTo}. U premium modu ovdje ide glasovno navođenje i upozorenja.`
    );
  };

  const handleNavGoogleDemo = () => {
    const from = navFrom || profile.name;
    const to = navTo || profile.name;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      from
    )}&destination=${encodeURIComponent(to)}`;
    window.open(url, "_blank");
  };

  // Modal helper
  const openModal = (title, content) => setModal({ title, content });
  const closeModal = () => setModal(null);

  const planInsuranceText =
    "TBW AI PREMIUM je informativni alat. Za promet, vrijeme, more i sigurnost uvijek provjeri službene izvore. " +
    "Autor aplikacije ne preuzima odgovornost za prekršaje, gubitak novca ili statusa premium korisnika u slučaju pada sustava, virusa ili tehničkih problema.";

  // Render hero medija (live cam / slika)
  const heroStyle = profile.hero
    ? { backgroundImage: `url(${profile.hero})` }
    : { background: "#111" };

  const tempIcon =
    weather.temp == null
      ? "…"
      : weather.temp <= 0
      ? "❄️"
      : weather.temp >= 25
      ? "☀️"
      : "⛅";

  return (
    <>
      {/* INTRO */}
      {!introDone && (
        <div className="intro-overlay">
          <video
            className="intro-video"
            src="/intro.mp4"
            autoPlay
            muted
            playsInline
          />
          <button className="intro-skip" onClick={() => setIntroDone(true)}>
            Preskoči intro
          </button>
        </div>
      )}

      {/* LEGAL OVERLAY */}
      {!legalAccepted && (
        <div className="modal-backdrop">
          <div className="modal-window">
            <h2>Prije korištenja</h2>
            <p>
              Ovaj navigator ne zamjenjuje službene informacije (MUP, HAK,
              DHMZ, kapetanije, zračne luke). Podaci su informativni.
            </p>
            <p>{planInsuranceText}</p>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={legalChk1}
                onChange={(e) => setLegalChk1(e.target.checked)}
              />
              <span>Prihvaćam uvjete korištenja i politiku privatnosti.</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={legalChk2}
                onChange={(e) => setLegalChk2(e.target.checked)}
              />
              <span>
                Nisam robot i razumijem da je ovo AI alat koji može pogriješiti.
              </span>
            </label>
            <button
              className="btn-main"
              disabled={!(legalChk1 && legalChk2)}
              onClick={handleLegalAccept}
            >
              Prihvati i nastavi
            </button>
          </div>
        </div>
      )}

      {/* MODAL KARTICE */}
      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              Zatvori
            </button>
            <h2>{modal.title}</h2>
            <div style={{ marginTop: 12 }}>{modal.content}</div>
          </div>
        </div>
      )}

      {/* TIKER */}
      <div className="tbw-header">
        <div className="ticker">
          <div className="ticker-dot" />
          <div>{ticker}</div>
        </div>

        {/* GORNJI HEADER */}
        <div className="top-bar">
          <div className="brand">
            <img src="/tbw-logo.png" alt="TBW logo" className="brand-logo" />
            <div>
              <div className="brand-title">{t("app_title", lang)}</div>
              <div className="brand-subtitle">
                {t("header_subtitle", lang)}
              </div>
            </div>
          </div>
          <div className="top-controls">
            <select
              className="lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              {Object.entries(LANGUAGES).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <button
              className={
                "mode-btn" + (plan === "premium" ? " active" : "")
              }
              onClick={handlePlanClick}
            >
              {planLabel}
            </button>
          </div>
        </div>
      </div>

      {/* HERO + SEARCH */}
      <section className="hero-section">
        <div className="hero-image" style={heroStyle}>
          <div className="hero-top-row">
            <div className="hero-city-pill">
              {profile.name}, {profile.country}
              <br />
              {tempIcon}{" "}
              {weather.temp != null ? `${weather.temp.toFixed(1)}°C` : "--°C"} ·{" "}
              {weather.desc}
            </div>
            <div className="hero-city-switch">
              {Object.values(CITY_PROFILES).map((c) => (
                <button
                  key={c.key}
                  className={cityKey === c.key ? "active" : ""}
                  onClick={() => setCityKey(c.key)}
                  type="button"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <form className="hero-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_placeholder", lang)}
            />
            <button
              type="button"
              id="tbw-mic"
              className={"mic-btn" + (micListening ? " listening" : "")}
            >
              🎤
            </button>
            <button type="submit" className="search-btn">
              TBW AI
            </button>
          </form>
        </div>
      </section>

      {/* AI odgovor */}
      <div style={{ padding: "8px 16px", fontSize: 14, opacity: 0.8 }}>
        {aiMessage}
      </div>

      {/* KARTICE */}
      <section className="cards-section">
        {/* PRVI RED: Navigacija + Smještaj */}
        <div className="cards-row">
          {/* NAVIGACIJA */}
          <div
            className="tbw-card"
            onClick={() =>
              openModal(
                t("nav_title", lang),
                <>
                  <p>
                    TBW PREMIUM navigacija u planu uključuje glasovne upute,
                    upozorenja na radove, kamere, policiju i truck profil.
                  </p>
                  <p>
                    Ovdje ćeš kasnije dodati tvoj TBW engine i rute iz
                    backend-a.
                  </p>
                </>
              )
            }
          >
            <h3>
              {t("nav_title", lang)}{" "}
              {plan === "premium" && <span className="card-badge">PREMIUM</span>}
            </h3>
            <div className="nav-mini-inputs">
              <input
                placeholder="Polazak"
                value={navFrom}
                onChange={(e) => setNavFrom(e.target.value)}
              />
              <input
                placeholder="Odredište"
                value={navTo}
                onChange={(e) => setNavTo(e.target.value)}
              />
            </div>
            <div className="nav-mini-footer">
              <button
                type="button"
                className="start-btn small"
                onClick={handleNavStart}
              >
                Kreni TBW
              </button>
              <button
                type="button"
                className="mic-btn small"
                onClick={handleNavGoogleDemo}
              >
                ⤴︎
              </button>
            </div>
            {navActive && (
              <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                Aktivna ruta: {navActive.from} → {navActive.to}
              </div>
            )}
          </div>

          {/* BOOKING */}
          <div
            className="tbw-card"
            onClick={() =>
              openModal(
                t("booking_title", lang),
                <>
                  <p>
                    Ovdje će biti integracija s Booking / Airbnb / tvojim
                    partnerima (TBW backend).
                  </p>
                  <p>
                    Upit iz glavne tražilice sinkronizira se na ovu karticu
                    (grad: {profile.name}).
                  </p>
                </>
              )
            }
          >
            <h3>{t("booking_title", lang)}</h3>
            <p>Grad: {profile.name}</p>
            <p>Demo: prikaz okvirnih cijena i trendova po noćenju.</p>
          </div>
        </div>

        {/* DRUGI RED: Vrijeme / Promet / Eventi */}
        <div className="cards-row">
          <div
            className="tbw-card"
            onClick={() =>
              openModal(
                t("weather_title", lang),
                <>
                  <p>
                    Trenutno:{" "}
                    {weather.temp != null
                      ? `${weather.temp.toFixed(1)}°C, ${weather.desc}`
                      : "N/A"}
                  </p>
                  <p>
                    U punoj verziji ovdje možeš prikazati satnu i tjednu
                    prognozu, more, UV indeks itd.
                  </p>
                </>
              )
            }
          >
            <h3>{t("weather_title", lang)}</h3>
            <p>
              {tempIcon}{" "}
              {weather.temp != null
                ? `${weather.temp.toFixed(1)}°C – ${weather.desc}`
                : "N/A"}
            </p>
          </div>

          <div
            className="tbw-card"
            onClick={() =>
              openModal(
                t("traffic_title", lang),
                <>
                  <p>Promet oko grada {profile.name} – DEMO podaci.</p>
                  <p>
                    U punoj verziji ovdje ide integracija s prometnim API-ima,
                    kamerama i radovima.
                  </p>
                </>
              )
            }
          >
            <h3>{t("traffic_title", lang)}</h3>
            <p>Pojačan promet u špici, povremeni zastoji.</p>
          </div>

          <div
            className="tbw-card"
            onClick={() =>
              openModal(
                t("events_title", lang),
                <>
                  <p>Eventi i nightlife za {profile.name} – DEMO.</p>
                  <p>
                    U punom modu povlačiš event API-je, koncerte, klubove,
                    gastro događanja.
                  </p>
                </>
              )
            }
          >
            <h3>{t("events_title", lang)}</h3>
            <p>Koncert na otvorenom, happy hour, posebne ponude.</p>
          </div>
        </div>

        {/* TREĆI RED: Trgovine & energija / SOS / Ostalo */}
        <div className="cards-row">
          <div
            className="tbw-card"
            onClick={() =>
              openModal(
                t("shops_title", lang),
                <>
                  <p>Trgovine, shopping centri, benzinske i EV punionice.</p>
                  <p>Kasnije dodaješ svoje API-je za cijene goriva / radna vremena.</p>
                </>
              )
            }
          >
            <h3>{t("shops_title", lang)}</h3>
            <p>Najbliže trgovine i benzinske u okolici.</p>
          </div>

          <div
            className="tbw-card"
            onClick={() =>
              openModal(
                t("sos_title", lang),
                <>
                  <p>
                    SOS profil, ICE kontakti, brzi pozivi 112 / 911 i lokalne
                    hitne službe.
                  </p>
                  <p>
                    Ovdje ćeš dodati formu za unos svojih zdravstvenih podataka
                    i kontakata.
                  </p>
                </>
              )
            }
          >
            <h3>{t("sos_title", lang)}</h3>
            <p>Brzi pristup hitnim službama i sigurnosnim informacijama.</p>
          </div>

          <div
            className="tbw-card"
            onClick={() =>
              openModal(
                "Javni prijevoz",
                <>
                  <p>Autobusi, vlakovi, trajekti – DEMO prikaz.</p>
                  <p>
                    U punoj verziji ovdje ide integracija s rasporedima, kašnjenjima
                    i kupnjom karata.
                  </p>
                </>
              )
            }
          >
            <h3>Javni prijevoz</h3>
            <p>Prikaz linija i polazaka u blizini odabranog grada.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="tbw-footer">
        <p>{planInsuranceText}</p>
        <p>
          Za podršku i pitanja:{" "}
          <a href="mailto:ai.tbw.booking@gmail.com">
            ai.tbw.booking@gmail.com
          </a>
        </p>
        <p>© {new Date().getFullYear()} TBW AI PREMIUM NAVIGATOR · Sva prava pridržana.</p>
      </footer>
    </>
  );
};

export default App;
