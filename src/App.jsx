// src/App.jsx

import React, { useEffect, useMemo, useState } from "react";
import { LANGS, DEFAULT_LANG, t } from "./i18n";

const CITY_META = {
  zagreb: {
    key: "zagreb",
    hero: "/hero-zagreb.jpg",
    nameKey: "cityZagreb",
  },
  split: {
    key: "split",
    hero: "/hero-split.jpg",
    nameKey: "citySplit",
  },
  karlovac: {
    key: "karlovac",
    hero: "/hero-karlovac.jpg",
    nameKey: "cityKarlovac",
  },
  zadar: {
    key: "zadar",
    hero: "/hero-zadar.jpg",
    nameKey: "cityZadar",
  },
};

const MODES = ["trial", "demo", "premium"]; // free trial, demo, premium

const isSpeechSupported =
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

function createRecognition(lang) {
  if (!isSpeechSupported) return null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = lang === "hr" ? "hr-HR" : lang;
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  return rec;
}

export default function App() {
  const [lang, setLang] = useState(DEFAULT_LANG);
  const [mode, setMode] = useState("trial"); // trial / demo / premium
  const [cityKey, setCityKey] = useState("karlovac");
  const [query, setQuery] = useState("");
  const [introVisible, setIntroVisible] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // "nav","stay","traffic"...
  const [navFrom, setNavFrom] = useState("");
  const [navTo, setNavTo] = useState("");
  const [navProfile, setNavProfile] = useState("car"); // car / truck / moto
  const [isListeningMain, setIsListeningMain] = useState(false);
  const [isListeningNav, setIsListeningNav] = useState(false);

  const currentCity = useMemo(() => CITY_META[cityKey], [cityKey]);

  // Intro autoplay: prikaži jednom
  useEffect(() => {
    const already = localStorage.getItem("tbw_intro_seen");
    if (already === "1") {
      setIntroVisible(false);
    }
  }, []);

  function closeIntro() {
    setIntroVisible(false);
    localStorage.setItem("tbw_intro_seen", "1");
  }

  // -------------- JEZIK -----------------

  function handleLangChange(e) {
    const value = e.target.value;
    setLang(value);
  }

  // -------------- GLAVNA TRAŽILICA -----------------

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;

    // Za sada samo demo: otvori Google Search na jeziku
    const url = `https://www.google.com/search?q=${encodeURIComponent(
      `TBW AI ${query}`
    )}`;
    window.open(url, "_blank");
  }

  function handleMainMicClick() {
    if (!isSpeechSupported) {
      alert(t(lang, "voiceHint"));
      return;
    }
    if (isListeningMain) return;

    const rec = createRecognition(lang);
    if (!rec) return;

    setIsListeningMain(true);
    rec.start();

    rec.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setQuery(text);
    };
    rec.onerror = () => {
      setIsListeningMain(false);
    };
    rec.onend = () => {
      setIsListeningMain(false);
    };
  }

  // -------------- NAVIGACIJA -----------------

  function openNavModal() {
    setActiveModal("nav");
  }

  function handleVoiceNav() {
    if (!isSpeechSupported) {
      alert(t(lang, "voiceNavHint"));
      return;
    }
    if (isListeningNav) return;

    const rec = createRecognition(lang);
    if (!rec) return;

    setIsListeningNav(true);
    rec.start();

    rec.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();

      // Super jednostavan parser:
      // "ruta iz X do Y" ili "od X do Y"
      let from = navFrom;
      let to = navTo;

      const m1 = text.match(/iz\s+(.+)\s+do\s+(.+)/); // hr
      const m2 = text.match(/from\s+(.+)\s+to\s+(.+)/); // en
      const m3 = text.match(/od\s+(.+)\s+do\s+(.+)/);

      if (m1) {
        from = m1[1];
        to = m1[2];
      } else if (m2) {
        from = m2[1];
        to = m2[2];
      } else if (m3) {
        from = m3[1];
        to = m3[2];
      } else {
        // "odvedi me u Split"
        const m4 = text.match(/(u|to)\s+(.+)/);
        if (m4) {
          from = cityNameForNav();
          to = m4[2];
        }
      }

      if (from) setNavFrom(capitalize(from));
      if (to) setNavTo(capitalize(to));
    };

    rec.onerror = () => {
      setIsListeningNav(false);
    };
    rec.onend = () => {
      setIsListeningNav(false);
    };
  }

  function cityNameForNav() {
    const meta = CITY_META[cityKey];
    if (!meta) return "Karlovac";
    return t(lang, meta.nameKey);
  }

  function handleStartNavigation() {
    const from = navFrom.trim() || cityNameForNav();
    const to = navTo.trim();
    if (!to) {
      alert("Unesi odredište / destination.");
      return;
    }

    // FREE TRIAL + DEMO → običan Google Maps / OSM link
    // PREMIUM → za sada isto, ali u budućnosti ide tvoj motor / API.
    const base = "https://www.google.com/maps/dir/?api=1";
    const url =
      base +
      `&origin=${encodeURIComponent(from)}` +
      `&destination=${encodeURIComponent(to)}`;

    window.open(url, "_blank");
  }

  // -------------- MODALI ZA KARTICE -----------------

  function openModal(key) {
    setActiveModal(key);
  }

  function closeModal() {
    setActiveModal(null);
  }

  // -------------- LAYOUT -----------------

  return (
    <div className={`tbw-app mode-${mode}`}>
      {/* INTRO OVERLAY */}
      {introVisible && (
        <div className="intro-overlay">
          <video
            className="intro-video"
            autoPlay
            muted={false}
            playsInline
            onEnded={closeIntro}
          >
            <source src="/intro.mp4" type="video/mp4" />
          </video>
          <button className="intro-skip" onClick={closeIntro}>
            Skip
          </button>
        </div>
      )}

      {/* GORNJI TICKER + HEADER */}
      <header className="tbw-header">
        <div className="ticker">
          <span className="ticker-dot" />
          <span className="ticker-text">
            TBW AI te podsjeća: uvijek poštuj ograničenja brzine i provjeri
            službene izvore.
          </span>
        </div>

        <div className="top-bar">
          <div className="brand">
            <img src="/tbw-logo.png" alt="TBW logo" className="brand-logo" />
            <div className="brand-text">
              <div className="brand-title">{t(lang, "appTitle")}</div>
              <div className="brand-subtitle">
                {t(lang, "appSubtitle")}{" "}
                {mode === "premium" && (
                  <span className="premium-badge">
                    {t(lang, "featurePremiumBadge")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="top-controls">
            <div className="mode-toggle">
              {MODES.map((m) => (
                <button
                  key={m}
                  className={mode === m ? "mode-btn active" : "mode-btn"}
                  onClick={() => setMode(m)}
                >
                  {t(lang, m)}
                </button>
              ))}
            </div>

            <select
              className="lang-select"
              value={lang}
              onChange={handleLangChange}
            >
              {Object.entries(LANGS).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* HERO + GLAVNA TRAŽILICA */}
      <main className="tbw-main">
        <section className="hero-section">
          <div
            className="hero-image"
            style={{
              backgroundImage: `url(${currentCity.hero})`,
            }}
          >
            <div className="hero-top-row">
              <div className="hero-city-pill">
                {t(lang, currentCity.nameKey)}
              </div>

              <div className="hero-city-switch">
                {Object.keys(CITY_META).map((key) => (
                  <button
                    key={key}
                    onClick={() => setCityKey(key)}
                    className={
                      key === cityKey ? "city-switch-btn active" : "city-switch-btn"
                    }
                  >
                    {t(lang, CITY_META[key].nameKey)}
                  </button>
                ))}
              </div>
            </div>

            <form className="hero-search" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(lang, "mainPlaceholder")}
              />
              <button
                type="button"
                className={isListeningMain ? "mic-btn listening" : "mic-btn"}
                onClick={handleMainMicClick}
              >
                🎤
              </button>
              <button type="submit" className="search-btn">
                {t(lang, "mainButton")}
              </button>
            </form>
          </div>
        </section>

        {/* GRID KARTICA */}
        <section className="cards-section">
          <div className="cards-row">
            {/* NAVIGACIJA */}
            <article
              className="tbw-card nav-card"
              onClick={openNavModal}
              role="button"
            >
              <div className="card-header">
                <h3>{t(lang, "cardNavTitle")}</h3>
                {mode === "premium" && (
                  <span className="card-badge">
                    {t(lang, "featurePremiumBadge")}
                  </span>
                )}
              </div>
              <p>{t(lang, "cardNavDesc")}</p>
              <div className="nav-mini-inputs">
                <input
                  type="text"
                  placeholder={t(lang, "navFrom")}
                  value={navFrom}
                  onChange={(e) => setNavFrom(e.target.value)}
                />
                <input
                  type="text"
                  placeholder={t(lang, "navTo")}
                  value={navTo}
                  onChange={(e) => setNavTo(e.target.value)}
                />
              </div>
              <div className="nav-mini-footer">
                <button
                  type="button"
                  className={
                    isListeningNav ? "mic-btn small listening" : "mic-btn small"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVoiceNav();
                  }}
                >
                  🎤
                </button>
                <button
                  type="button"
                  className="start-btn small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartNavigation();
                  }}
                >
                  {t(lang, "navStart")}
                </button>
              </div>
            </article>

            {/* REZERVACIJA */}
            <article
              className="tbw-card"
              onClick={() => openModal("stay")}
              role="button"
            >
              <h3>{t(lang, "cardStayTitle")}</h3>
              <p>{t(lang, "cardStayDesc")}</p>
            </article>

            {/* VRIJEME */}
            <article
              className="tbw-card"
              onClick={() => openModal("weather")}
              role="button"
            >
              <h3>{t(lang, "cardWeatherTitle")}</h3>
              <p>{t(lang, "cardWeatherDesc")}</p>
            </article>

            {/* PROMET */}
            <article
              className="tbw-card"
              onClick={() => openModal("traffic")}
              role="button"
            >
              <h3>{t(lang, "cardTrafficTitle")}</h3>
              <p>{t(lang, "cardTrafficDesc")}</p>
            </article>
          </div>

          <div className="cards-row">
            {/* AERODROMI */}
            <article
              className="tbw-card"
              onClick={() => openModal("air")}
              role="button"
            >
              <h3>{t(lang, "cardAirTitle")}</h3>
              <p>{t(lang, "cardAirDesc")}</p>
            </article>

            {/* EVENTI */}
            <article
              className="tbw-card"
              onClick={() => openModal("events")}
              role="button"
            >
              <h3>{t(lang, "cardEventsTitle")}</h3>
              <p>{t(lang, "cardEventsDesc")}</p>
            </article>

            {/* TRGOVINE */}
            <article
              className="tbw-card"
              onClick={() => openModal("shops")}
              role="button"
            >
              <h3>{t(lang, "cardShopsTitle")}</h3>
              <p>{t(lang, "cardShopsDesc")}</p>
            </article>

            {/* SIGURNOST */}
            <article
              className="tbw-card"
              onClick={() => openModal("safety")}
              role="button"
            >
              <h3>{t(lang, "cardSafetyTitle")}</h3>
              <p>{t(lang, "cardSafetyDesc")}</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="tbw-footer">
        <p>{t(lang, "footerDisclaimer")}</p>
      </footer>

      {/* MODAL ZA SVE KARTICE */}
      {activeModal && (
        <ModalOverlay onClose={closeModal}>
          {renderModalContent(activeModal, lang)}
        </ModalOverlay>
      )}
    </div>
  );
}

// -------------- MODAL KOMPONENTE -----------------

function ModalOverlay({ children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-window"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

function renderModalContent(key, lang) {
  switch (key) {
    case "nav":
      return (
        <>
          <h2>{t(lang, "modalNavTitle")}</h2>
          <p>{t(lang, "modalNavBody")}</p>
        </>
      );
    case "stay":
      return (
        <>
          <h2>{t(lang, "modalStayTitle")}</h2>
          <p>{t(lang, "modalStayBody")}</p>
        </>
      );
    case "traffic":
      return (
        <>
          <h2>{t(lang, "modalTrafficTitle")}</h2>
          <p>{t(lang, "modalTrafficBody")}</p>
        </>
      );
    case "weather":
      return (
        <>
          <h2>{t(lang, "modalWeatherTitle")}</h2>
          <p>{t(lang, "modalWeatherBody")}</p>
        </>
      );
    case "air":
      return (
        <>
          <h2>{t(lang, "modalAirTitle")}</h2>
          <p>{t(lang, "modalAirBody")}</p>
        </>
      );
    case "events":
      return (
        <>
          <h2>{t(lang, "modalEventsTitle")}</h2>
          <p>{t(lang, "modalEventsBody")}</p>
        </>
      );
    case "shops":
      return (
        <>
          <h2>{t(lang, "modalShopsTitle")}</h2>
          <p>{t(lang, "modalShopsBody")}</p>
        </>
      );
    case "safety":
      return (
        <>
          <h2>{t(lang, "modalSafetyTitle")}</h2>
          <p>{t(lang, "modalSafetyBody")}</p>
        </>
      );
    default:
      return null;
  }
}

// -------------- POMOĆNE -----------------

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
