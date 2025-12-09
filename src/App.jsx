import React, { useEffect, useMemo, useState } from 'react'
import './App.css'

const CITY_META = {
  split: {
    name: 'Split',
    lat: 43.5081,
    lon: 16.4402,
    airport: 'SPU',
    hero: '/assets/hero-split.jpg'
  },
  zagreb: {
    name: 'Zagreb',
    lat: 45.815,
    lon: 15.9819,
    airport: 'ZAG',
    hero: '/assets/hero-zagreb.jpg'
  },
  karlovac: {
    name: 'Karlovac',
    lat: 45.4929,
    lon: 15.5553,
    airport: 'ZAG',
    hero: '/assets/hero-karlovac.jpg'
  },
  zadar: {
    name: 'Zadar',
    lat: 44.1194,
    lon: 15.2314,
    airport: 'ZAD',
    hero: '/assets/hero-zadar.jpg'
  }
}

const TRIAL_DAYS = 3

const LANGS = [
  { code: 'hr', label: 'HR' },
  { code: 'en', label: 'EN' }
]

const I18N = {
  hr: {
    subtitle: 'Prometna upozorenja · Vrijeme · Stanje mora · Nesreće · Alert!',
    heroCaption:
      'Glas: reci npr. "Hej TBW, nađi mi apartmane u Splitu za vikend" ili "Hej TBW, idem prema Zagrebu, kakav je promet ispred mene?".',
    navTitle: 'Navigacija',
    navActive: 'Aktivna ruta',
    navNoRoute: 'Nema aktivne rute.',
    navDir: 'Smjer',
    navProfile: 'Profil',
    btnCalc: 'Izračunaj',
    btnStartNav: 'Kreni (TBW navigacija)',
    bookingTitle: 'Rezervacija smještaja',
    bookingLoc: 'Lokacija',
    bookingDates: 'Datumi',
    bookingNotSet: 'Nije zadano',
    bookingPrice: 'Okvirna cijena',
    bookingStatus:
      'Za više opcija otvorit ćeš Booking, Airbnb ili druge servise.',
    bookingOpen: 'Otvori ponude',
    weatherTitle: 'Vrijeme',
    trafficTitle: 'Promet uživo',
    airportTitle: 'Aerodromi',
    airportNearest: 'Najbliža zračna luka',
    safetyTitle: 'Sigurnost & SOS',
    sosProfile: 'SOS profil',
    sosEmpty: 'Nije postavljen.',
    sosEdit: 'Uredi SOS profil',
    iceLabel: 'ICE kontakti',
    landmarksTitle: 'Što posjetiti',
    foodTitle: 'Hrana & Nightlife',
    foodRest: 'Restorani',
    foodCafe: 'Kafići',
    foodClub: 'Klubovi',
    shopsTitle: 'Trgovine & energija',
    shopsGrocery: 'Trgovine',
    shopsMalls: 'Shopping centri',
    fuelEv: 'Benzinske / EV',
    truckTitle: 'Truck & long-haul',
    transitTitle: 'Javni prijevoz',
    legalTitle: 'Prije korištenja',
    legal1:
      'Ovaj navigator ne zamjenjuje službene informacije (MUP, HAK, DHMZ, kapetanije, zračne luke).',
    legalAccept:
      'Prihvaćam uvjete korištenja i politiku privatnosti (AI može pogriješiti).',
    legalRobot:
      'Nisam robot – razumijem da TBW AI daje informativne podatke i da sam sam odgovoran za svoje odluke.',
    legalBtn: 'Prihvati i nastavi',
    sosNotice:
      'U slučaju sumnje uvijek prvo zovi hitne službe i slijedi njihove upute.',
    planMonthly: 'Mjesečno: 9.99 €',
    planYearly: 'Godišnje: 99.9 €',
    planDemoNote:
      'Ovo je DEMO kupnja – nema stvarne naplate, služi samo za testiranje logike.',
    planActivateMonthly: 'Aktiviraj mjesečno',
    planActivateYearly: 'Aktiviraj godišnje',
    planClose: 'Zatvori',
    supportTitle: 'TBW AI podrška (demo)',
    supportIntro:
      'Odaberi jedno od ponuđenih pitanja ili postavi kratko pitanje o aplikaciji.',
    founderLabel: 'Founder mod',
    founderMaintenance: 'Maintenance mod',
    founderBlockDevice: 'Blokiraj ovaj uređaj',
    founderAdminOnly: 'Samo za vlasnika aplikacije.',
    blockedTitle: 'TBW AI NAVIGATOR je privremeno nedostupan',
    blockedText:
      'Ovaj uređaj je blokiran od strane vlasnika aplikacije (Founder mod). Pokušaj kasnije ili nas kontaktiraj.'
  },
  en: {
    subtitle: 'Traffic alerts · Weather · Sea state · Incidents · Alert!',
    heroCaption:
      'Voice: say e.g. "Hey TBW, find me apartments in Split for the weekend" or "Hey TBW, I am driving towards Zagreb, how is the traffic ahead of me?".',
    navTitle: 'Navigation',
    navActive: 'Active route',
    navNoRoute: 'No active route.',
    navDir: 'Direction',
    navProfile: 'Profile',
    btnCalc: 'Calculate',
    btnStartNav: 'Start TBW navigation',
    bookingTitle: 'Accommodation booking',
    bookingLoc: 'Location',
    bookingDates: 'Dates',
    bookingNotSet: 'Not set',
    bookingPrice: 'Approx. price',
    bookingStatus:
      "For more options you'll open Booking, Airbnb or other services.",
    bookingOpen: 'Open offers',
    weatherTitle: 'Weather',
    trafficTitle: 'Live traffic',
    airportTitle: 'Airports',
    airportNearest: 'Nearest airport',
    safetyTitle: 'Safety & SOS',
    sosProfile: 'SOS profile',
    sosEmpty: 'Not set.',
    sosEdit: 'Edit SOS profile',
    iceLabel: 'ICE contacts',
    landmarksTitle: 'Places to visit',
    foodTitle: 'Food & Nightlife',
    foodRest: 'Restaurants',
    foodCafe: 'Cafés',
    foodClub: 'Clubs',
    shopsTitle: 'Shops & energy',
    shopsGrocery: 'Grocery',
    shopsMalls: 'Shopping malls',
    fuelEv: 'Fuel / EV',
    truckTitle: 'Truck & long-haul',
    transitTitle: 'Public transport',
    legalTitle: 'Before you start',
    legal1:
      'This navigator does not replace official information (police, road authorities, weather services, coast guard, airports).',
    legalAccept:
      'I accept the terms of use and privacy policy (AI may be wrong).',
    legalRobot:
      "I am not a robot – I understand TBW AI is informational only and I am responsible for my own decisions.",
    legalBtn: 'Accept and continue',
    sosNotice:
      'In case of doubt always call emergency services first and follow their instructions.',
    planMonthly: 'Monthly: 9.99 €',
    planYearly: 'Yearly: 99.9 €',
    planDemoNote:
      'This is a DEMO purchase – no real payment, only logic testing.',
    planActivateMonthly: 'Activate monthly',
    planActivateYearly: 'Activate yearly',
    planClose: 'Close',
    supportTitle: 'TBW AI support (demo)',
    supportIntro:
      'Choose one of the suggested questions or ask a short question about the app.',
    founderLabel: 'Founder mode',
    founderMaintenance: 'Maintenance mode',
    founderBlockDevice: 'Block this device',
    founderAdminOnly: 'For app owner only.',
    blockedTitle: 'TBW AI NAVIGATOR is temporarily unavailable',
    blockedText:
      'This device has been blocked by the app owner (Founder mode). Try again later or contact us.'
  }
}

const getDict = (lang) => I18N[lang] || I18N.en

const getCityMeta = (name) => {
  if (!name) return CITY_META.split
  const key = name.toLowerCase()
  return CITY_META[key] || CITY_META.split
}

const App = () => {
  const [city, setCity] = useState('Split')
  const [lang, setLang] = useState(
    typeof window !== 'undefined'
      ? window.localStorage.getItem('tbw_lang') || 'hr'
      : 'hr'
  )
  const [plan, setPlan] = useState('trial')
  const [ticker, setTicker] = useState('')
  const [weather, setWeather] = useState({ temp: null, cond: 'Učitavanje...' })
  const [routeInfo, setRouteInfo] = useState(null)
  const [legalAccepted, setLegalAccepted] = useState(
    typeof window !== 'undefined' &&
      window.localStorage.getItem('tbw_legal') === '1'
  )
  const [showPlanModal, setShowPlanModal] = useState(False)
  const [introSeen, setIntroSeen] = useState(
    typeof window !== 'undefined' &&
      window.localStorage.getItem('tbw_intro') === '1'
  )
  const [showMiniIntro, setShowMiniIntro] = useState(false)
  const [fullscreenCard, setFullscreenCard] = useState(null)

  const dict = useMemo(() => getDict(lang), [lang])
  const meta = useMemo(() => getCityMeta(city), [city])

  // intro
  useEffect(() => {
    if (introSeen) return
    const t = setTimeout(() => {
      setIntroSeen(True)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('tbw_intro', '1')
      }
      setShowMiniIntro(True)
      setTimeout(() => setShowMiniIntro(False), 2000)
    }, 5000)
    return () => clearTimeout(t)
  }, [introSeen])

  // plan / trial
  useEffect(() => {
    if (typeof window === 'undefined') return
    let storedPlan = window.localStorage.getItem('tbw_plan') || 'trial'
    let start = window.localStorage.getItem('tbw_trial_start')
    const now = Date.now()
    if (!start) {
      start = now
      window.localStorage.setItem('tbw_trial_start', String(start))
    } else {
      start = Number(start)
    }
    const days = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    if (storedPlan == 'trial' and days >= TRIAL_DAYS) {
      storedPlan = 'demo'
      window.localStorage.setItem('tbw_plan', 'demo')
    }
    setPlan(storedPlan)
  }, [])

  // ticker
  useEffect(() => {
    const update = () => {
      const base = meta.name
      const msgs = [
        `Nema posebnih upozorenja za ${base}. Vozi oprezno.`,
        `TBW AI podsjetnik: poštuj ograničenja brzine u zoni ${base}.`,
        `Nightlife u ${base}: provjeri lokale prije polaska.`
      ]
      const idx = new Date().getMinutes() % msgs.length
      setTicker(msgs[idx])
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [meta])

  // weather
  useEffect(() => {
    if (!legalAccepted) return
    const load = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${meta.lat}&longitude=${meta.lon}&current=temperature_2m,weather_code`
        const res = await fetch(url)
        const js = await res.json()
        const temp =
          js.current && typeof js.current.temperature_2m === 'number'
            ? js.current.temperature_2m
            : null
        const code = js.current ? js.current.weather_code : 0
        let cond = 'vedro'
        if ([1, 2, 3].includes(code)) cond = 'promjenjivo oblačno'
        else if ([51, 61, 63].includes(code)) cond = 'kiša'
        else if ([71, 73, 75].includes(code)) cond = 'snijeg'
        setWeather({ temp, cond })
      } catch (e) {
        setWeather({ temp: null, cond: 'Greška pri dohvaćanju vremena.' })
      }
    }
    load()
  }, [meta, legalAccepted])

  const handleRouteSubmit = (e) => {
    e.preventDefault()
    const from = e.target.from.value.trim() || city
    const to = e.target.to.value.trim() || city
    const mode = e.target.mode.value
    const distance = mode === 'truck' ? '230 km' : '200 km'
    const duration = mode === 'truck' ? '120 min' : '90 min'
    setRouteInfo({
      from,
      to,
      mode,
      distance,
      duration,
      profile: mode === 'truck' ? 'Kamion' : 'Osobni'
    })
  }

  const handleStartNavigation = () => {
    if (plan !== 'premium') {
      setShowPlanModal(True)
      return
    }
    if (!routeInfo) {
      alert('Prvo postavi rutu (polazak i odredište).')
      return
    }
    alert(
      `TBW demo: krećem voditi rutu ${routeInfo.from} → ${routeInfo.to}. U punoj verziji ovdje ide prava navigacija.`
    )
  }

  const handleLangChange = (e) => {
    const v = e.target.value
    setLang(v)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tbw_lang', v)
    }
  }

  const handleLegalAccept = () => {
    setLegalAccepted(True)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tbw_legal', '1')
    }
  }

  const handlePlanPurchase = (type) => {
    setPlan('premium')
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tbw_plan', 'premium')
    }
    setShowPlanModal(False)
    alert(
      type === 'month'
        ? 'Premium (9.99 €/mj) aktiviran (DEMO).'
        : 'Premium (99.9 €/god) aktiviran (DEMO).'
    )
  }

  const premiumText = useMemo(() => {
    if (plan === 'premium') return 'Premium · 9.99 €/mj'
    if (plan === 'demo') return 'Demo mode'
    if (typeof window === 'undefined') return 'Free trial'
    const start = Number(
      window.localStorage.getItem('tbw_trial_start') || Date.now()
    )
    const now = Date.now()
    const days = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    const left = Math.max(0, TRIAL_DAYS - days)
    return `Free trial · ${left} dana`
  }, [plan])

  const isDemo = plan === 'demo'
  const isPremium = plan === 'premium'

  const planInsuranceText =
    'TBW AI PREMIUM je informativni alat. Za promet, vrijeme, more i sigurnost uvijek provjeri službene izvore.'

  const heroTempIcon =
    weather.temp == null
      ? '…'
      : weather.temp <= 0
      ? '❄️'
      : weather.temp >= 25
      ? '☀️'
      : '⛅'

  const tickerDotStyle = {
    backgroundColor: isPremium ? '#22c55e' : isDemo ? '#facc15' : '#22d3ee'
  }

  const landmarks =
    meta.name === 'Split'
      ? ['Dioklecijanova palača', 'Riva', 'Marjan', 'Bačvice']
      : meta.name === 'Karlovac'
      ? ['Stari grad Dubovac', 'Aquatika', 'Korana šetnica']
      : meta.name === 'Zadar'
      ? ['Pozdrav suncu', 'Morske orgulje', 'Kalelarga']
      : ['Trg Bana Jelačića', 'Gornji grad', 'Maksimir']

  const rest =
    meta.name === 'Split'
      ? ['Zrno Soli', 'Bokeria', 'Fife']
      : meta.name === 'Zadar'
      ? ['Foša', 'Pet Bunara', 'Proto']
      : ['Baltazar', 'Agava', 'Didov San']

  const legalOverlay = !legalAccepted

  const demoOverlay = (cardName) =>
    isDemo ? (
      <div className="demo-overlay">
        <p>
          {cardName} nije dostupan u demo modu.
          <br />
          Kupi premium za puni pristup.
        </p>
        <button className="btn-main" onClick={() => setShowPlanModal(True)}>
          Kupi premium
        </button>
      </div>
    ) : null

  const openCardFullscreen = (id, title, body) => {
    setFullscreenCard(
      <section>
        <h2>{title}</h2>
        {body || (
          <p>
            Fullscreen prikaz kartice: {id}. Ovdje kasnije možeš dodati mape,
            grafove i dodatne podatke.
          </p>
        )}
      </section>
    )
  }

  return (
    <>
      {!introSeen && (
        <div className="intro-full">
          <div className="intro-full-inner">
            <h1>TBW AI PREMIUM</h1>
            <p>{dict.subtitle}</p>
            <div className="intro-video-wrap">
              <video
                src="/intro.mp4"
                autoPlay
                muted={false}
                playsInline
                style={{ width: '100%', display: 'block' }}
              />
            </div>
            <button
              className="btn-secondary"
              style={{ marginTop: 12 }}
              onClick={() => {
                setIntroSeen(True)
                if (typeof window !== 'undefined') {
                  window.localStorage.setItem('tbw_intro', '1')
                }
              }}
            >
              Preskoči
            </button>
          </div>
        </div>
      )}

      {showMiniIntro && (
        <div className="intro-mini">
          <span>TBW AI PREMIUM je spreman ✅</span>
        </div>
      )}

      {legalOverlay && (
        <div className="overlay">
          <div className="overlay-inner">
            <h2>{dict.legalTitle}</h2>
            <p>{dict.legal1}</p>
            <p>{planInsuranceText}</p>
            <label className="checkbox-row">
              <input type="checkbox" onChange={() => {}} />
              <span>{dict.legalAccept}</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" onChange={() => {}} />
              <span>{dict.legalRobot}</span>
            </label>
            <button className="btn-main" onClick={handleLegalAccept}>
              {dict.legalBtn}
            </button>
          </div>
        </div>
      )}

      {fullscreenCard && (
        <div className="overlay" onClick={() => setFullscreenCard(null)}>
          <div
            className="overlay-inner fullscreen-inner"
            onClick={(e) => e.stopPropagation()}
          >
            {fullscreenCard}
          </div>
        </div>
      )}

      {showPlanModal && (
        <div className="overlay" onClick={() => setShowPlanModal(False)}>
          <div className="overlay-inner" onClick={(e) => e.stopPropagation()}>
            <h2>TBW AI PREMIUM</h2>
            <p>Odaberi paket:</p>
            <ul>
              <li>{dict.planMonthly}</li>
              <li>{dict.planYearly}</li>
            </ul>
            <p style={{ fontSize: '.8rem', color: '#93a3c4' }}>
              {dict.planDemoNote}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px',
                flexWrap: 'wrap'
              }}
            >
              <button
                className="btn-main"
                onClick={() => handlePlanPurchase('month')}
              >
                {dict.planActivateMonthly}
              </button>
              <button
                className="btn-secondary"
                onClick={() => handlePlanPurchase('year')}
              >
                {dict.planActivateYearly}
              </button>
              <button
                className="btn-secondary small"
                onClick={() => setShowPlanModal(False)}
              >
                {dict.planClose}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="tbw-ticker">
        <div className="tbw-ticker-dot" style={tickerDotStyle} />
        <div className="tbw-ticker-text">
          <span>{ticker}</span>
          <span>{ticker}</span>
        </div>
      </div>

      <div className="app-root">
        <header className="app-header">
          <div>
            <div className="logo-row">
              <div className="logo-image">
                <img src="/tbw-logo.png" alt="TBW AI logo" />
              </div>
              <span className="logo-text">TBW AI PREMIUM</span>
            </div>
            <div className="header-sub">{dict.subtitle}</div>
          </div>
          <div className="header-right">
            <select
              className="lang-switch"
              value={lang}
              onChange={handleLangChange}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <button
              className={
                'premium-badge' + (plan === 'premium' ? ' premium-on' : '')
              }
              onClick={() => plan !== 'premium' && setShowPlanModal(True)}
            >
              {premiumText}
            </button>
          </div>
        </header>

        <div className="hero-search-shell">
          <section className="hero-card">
            <div className="hero-top-row">
              <div className="hero-tags">
                <button className="chip" type="button">
                  {meta.name}
                </button>
              </div>
              <button
                className="chip"
                type="button"
                onClick={() =>
                  setCity((prev) =>
                    prev === 'Split'
                      ? 'Zagreb'
                      : prev === 'Zagreb'
                      ? 'Karlovac'
                      : prev === 'Karlovac'
                      ? 'Zadar'
                      : 'Split'
                  )
                }
              >
                Promijeni grad
              </button>
            </div>
            <div className="hero-img-wrap">
              <img src={meta.hero} alt="TBW hero" className="hero-img" />
              <div className="hero-weather-pill">
                {heroTempIcon}{' '}
                {weather.temp != null
                  ? `${weather.temp.toFixed(1)}°C`
                  : '--°C'}{' '}
                · {weather.cond}
              </div>
            </div>
            <div className="hero-caption">{dict.heroCaption}</div>
          </section>
        </div>

        <main className="cards-grid">
          <section className="card">
            <div className="card-header">
              <h2>{dict.navTitle}</h2>
              <button
                className="card-expand"
                onClick={() =>
                  openCardFullscreen(
                    'nav',
                    dict.navTitle,
                    <p>
                      Ovdje će kasnije biti full-screen navigacija s kartom i
                      prometom (premium).
                    </p>
                  )
                }
              >
                ⤢
              </button>
            </div>
            <div className="card-body">
              <div className="nav-row">
                <div>
                  <div className="label">{dict.navActive}</div>
                  <div className="value">
                    {routeInfo
                      ? `${routeInfo.from} → ${routeInfo.to}`
                      : dict.navNoRoute}
                  </div>
                </div>
                <div className="nav-meta">
                  <div>
                    <span className="label">{dict.navDir}</span>{' '}
                    <span className="value">
                      {routeInfo ? routeInfo.to : '–'}
                    </span>
                  </div>
                  <div>
                    <span className="label">ETA</span>{' '}
                    <span className="value">
                      {routeInfo ? routeInfo.duration : '–'}
                    </span>
                  </div>
                  <div>
                    <span className="label">{dict.navProfile}</span>{' '}
                    <span className="value">
                      {routeInfo ? routeInfo.profile : 'Osobni'}
                    </span>
                  </div>
                </div>
              </div>
              <form className="route-form" onSubmit={handleRouteSubmit}>
                <input
                  name="from"
                  className="route-input"
                  placeholder="Polazak"
                  autoComplete="off"
                />
                <input
                  name="to"
                  className="route-input"
                  placeholder="Odredište"
                  autoComplete="off"
                />
                <select
                  name="mode"
                  className="route-select"
                  defaultValue="car"
                >
                  <option value="car">Auto</option>
                  <option value="truck">Kamion</option>
                </select>
                <button type="submit" className="btn-main">
                  {dict.btnCalc}
                </button>
              </form>
              <div className="small muted mt">
                {routeInfo &&
                  `${routeInfo.distance} / ${routeInfo.duration} (${routeInfo.profile})`}
              </div>
              <div className="mt">
                <button
                  className="btn-secondary small"
                  onClick={handleStartNavigation}
                >
                  {dict.btnStartNav}
                </button>
              </div>
            </div>
            {demoOverlay('Navigacija')}
          </section>

          <section className="card">
            <div className="card-header">
              <h2>{dict.bookingTitle}</h2>
              <button
                className="card-expand"
                onClick={() =>
                  openCardFullscreen(
                    'booking',
                    dict.bookingTitle,
                    <p>
                      Full-screen booking: ovdje kasnije TBW backend spaja
                      Booking, Airbnb i lokalne agencije.
                    </p>
                  )
                }
              >
                ⤢
              </button>
            </div>
            <div className="card-body">
              <div className="booking-row">
                <div>
                  <div className="label">{dict.bookingLoc}</div>
                  <div className="value">{meta.name}</div>
                </div>
                <div>
                  <div className="label">{dict.bookingDates}</div>
                  <div className="value">{dict.bookingNotSet}</div>
                </div>
              </div>
              <div className="booking-price-row">
                <div className="label">{dict.bookingPrice}</div>
                <div className="value">Varijabilno</div>
              </div>
              <div className="small muted mt">{dict.bookingStatus}</div>
              <div className="mt">
                <a
                  href={
                    'https://www.booking.com/searchresults.html?ss=' +
                    encodeURIComponent(meta.name)
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '.85rem', color: '#0ea5e9' }}
                >
                  {dict.bookingOpen}
                </a>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2>{dict.weatherTitle}</h2>
              <button
                className="card-expand"
                onClick={() =>
                  openCardFullscreen(
                    'weather',
                    dict.weatherTitle,
                    <p>
                      Ovdje kasnije možeš dodati graf temperature po satima i
                      upozorenja (vjetar, oluja, snijeg).
                    </p>
                  )
                }
              >
                ⤢
              </button>
            </div>
            <div className="card-body">
              <div className="big-number">
                {weather.temp != null ? `${weather.temp.toFixed(1)}°C` : '--°C'}
              </div>
              <div className="value">{weather.cond}</div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2>{dict.safetyTitle}</h2>
              <button
                className="card-expand"
                onClick={() =>
                  openCardFullscreen(
                    'safety',
                    dict.safetyTitle,
                    <p>{dict.sosNotice}</p>
                  )
                }
              >
                ⤢
              </button>
            </div>
            <div className="card-body">
              <div className="label">{dict.sosProfile}</div>
              <div className="value">{dict.sosEmpty}</div>
              <div className="small muted mt">{planInsuranceText}</div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2>{dict.landmarksTitle}</h2>
              <button
                className="card-expand"
                onClick={() =>
                  openCardFullscreen('landmarks', dict.landmarksTitle)
                }
              >
                ⤢
              </button>
            </div>
            <div className="card-body">
              <ul className="simple-list">
                {landmarks.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2>{dict.foodTitle}</h2>
              <button
                className="card-expand"
                onClick={() => openCardFullscreen('food', dict.foodTitle)}
              >
                ⤢
              </button>
            </div>
            <div className="card-body two-col">
              <div>
                <div className="label">{dict.foodRest}</div>
                <ul className="simple-list">
                  {rest.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} TBW AI PREMIUM NAVIGATOR.</p>
          <p>{planInsuranceText}</p>
        </footer>
      </div>
    </>
  )
}

export default App
