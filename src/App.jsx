import React, { useEffect, useMemo, useState } from 'react'
import './App.css'

// --- KONFIG: GRADOVI / HERO SLIKE ---
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

// --- JEZICI ---
const LANGS = [
  { code: 'hr', label: 'HR' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'it', label: 'IT' },
  { code: 'fr', label: 'FR' },
  { code: 'hu', label: 'HU' },
  { code: 'pl', label: 'PL' },
  { code: 'es', label: 'ES' },
  { code: 'ru', label: 'RU' },
  { code: 'zh', label: 'ZH' },
  { code: 'ja', label: 'JA' },
  { code: 'cs', label: 'CS' },
  { code: 'sl', label: 'SL' },
  { code: 'tr', label: 'TR' },
  { code: 'ne', label: 'NE' },
  { code: 'hi', label: 'HI' },
  { code: 'bg', label: 'BG' },
  { code: 'ro', label: 'RO' },
  { code: 'ko', label: 'KO' },
  { code: 'sv', label: 'SV' },
  { code: 'no', label: 'NO' },
  { code: 'pt-BR', label: 'BR' },
  { code: 'sq', label: 'SQ' },
  { code: 'ar', label: 'AR' },
  { code: 'nl', label: 'NL' },
  { code: 'uk', label: 'UK' },
  { code: 'fi', label: 'FI' },
  { code: 'el', label: 'EL' }
]

// --- I18N HR / EN (ostali fallback EN) ---
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

const detectRegionEmergencyNumber = () => {
  const lang = (navigator.language || '').toLowerCase()
  if (lang.includes('-us') || lang.includes('-ca') || lang.includes('-mx')) {
    return '911'
  }
  return '112'
}

const TRIAL_DAYS = 3

const SUPPORT_QUESTIONS = [
  'Što dobivam s Premium verzijom?',
  'Kako radi trial i demo mod?',
  'Kako TBW AI koristi moje podatke?',
  'Radi li navigacija i bez interneta?'
]

const App = () => {
  const [city, setCity] = useState('Split')
  const [lang, setLang] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('tbw_lang') || 'hr'
      : 'hr'
  )
  const [legalAccepted, setLegalAccepted] = useState(
    typeof window !== 'undefined' && localStorage.getItem('tbw_legal') === '1'
  )
  const [legalChk1, setLegalChk1] = useState(false)
  const [legalChk2, setLegalChk2] = useState(false)

  const [introSeen, setIntroSeen] = useState(
    typeof window !== 'undefined' && localStorage.getItem('tbw_intro') === '1'
  )
  const [showMiniIntro, setShowMiniIntro] = useState(false)

  const [ticker, setTicker] = useState('')
  const [search, setSearch] = useState('')
  const [aiResponse, setAiResponse] = useState(
    'Slušam. Možeš pitati za promet, vrijeme, more, aerodrom, smještaj ili prijaviti nesreću.'
  )
  const [weather, setWeather] = useState({ temp: null, cond: 'Učitavanje...' })
  const [routeInfo, setRouteInfo] = useState(null)
  const [sosSummary, setSosSummary] = useState('Nije postavljen.')
  const [iceContacts, setIceContacts] = useState([])
  const [fullscreenCard, setFullscreenCard] = useState(null)
  const [micOn, setMicOn] = useState(false)
  const [pendingEmergency, setPendingEmergency] = useState(false)

  const [plan, setPlan] = useState('trial') // trial / demo / premium
  const [showPlanModal, setShowPlanModal] = useState(false)

  const [geoStatus, setGeoStatus] = useState('idle') // idle / ok / denied / error
  const [supportOpen, setSupportOpen] = useState(false)
  const [supportMessages, setSupportMessages] = useState([])
  const [founderMode, setFounderMode] = useState(
    typeof window !== 'undefined' && localStorage.getItem('tbw_founder') === '1'
  )
  const [maintenance, setMaintenance] = useState(
    typeof window !== 'undefined' &&
      localStorage.getItem('tbw_maintenance') === '1'
  )
  const [blocked, setBlocked] = useState(
    typeof window !== 'undefined' && localStorage.getItem('tbw_blocked') === '1'
  )

  const dict = useMemo(() => getDict(lang), [lang])
  const meta = useMemo(() => getCityMeta(city), [city])

  // ako je uređaj blokiran – samo ekran blokade
  if (blocked) {
    return (
      <div className="app-root">
        <h1>TBW AI PREMIUM</h1>
        <h2>{dict.blockedTitle}</h2>
        <p>{dict.blockedText}</p>
        <p className="small muted">
          Kontakt: ai.tbw.booking@gmail.com · Sva prava pridržana.
        </p>
      </div>
    )
  }

  // INTRO (video + mini badge)
  useEffect(() => {
    if (!introSeen) {
      const timer = setTimeout(() => {
        setIntroSeen(true)
        if (typeof window !== 'undefined') {
          localStorage.setItem('tbw_intro', '1')
        }
        setShowMiniIntro(true)
        const t2 = setTimeout(() => setShowMiniIntro(false), 2000)
        return () => clearTimeout(t2)
      }, 5500)
      return () => clearTimeout(timer)
    } else {
      setShowMiniIntro(true)
      const t = setTimeout(() => setShowMiniIntro(false), 2000)
      return () => clearTimeout(t)
    }
  }, [introSeen])

  // PLAN / TRIAL LOGIKA
  useEffect(() => {
    if (typeof window === 'undefined') return
    let storedPlan = localStorage.getItem('tbw_plan') || 'trial'
    let start = localStorage.getItem('tbw_trial_start')
    const now = Date.now()

    if (!start) {
      start = String(now)
      localStorage.setItem('tbw_trial_start', start)
    }
    const startNum = Number(start)
    const days = Math.floor((now - startNum) / (1000 * 60 * 60 * 24))

    if (storedPlan === 'trial' && days >= TRIAL_DAYS) {
      storedPlan = 'demo'
      localStorage.setItem('tbw_plan', 'demo')
    }
    setPlan(storedPlan)
  }, [])

  const premiumText = useMemo(() => {
    if (plan === 'premium') return 'Premium · 9.99 €/mj'
    if (plan === 'demo') return 'Demo mode'
    if (typeof window === 'undefined') return 'Free trial'
    const start = Number(localStorage.getItem('tbw_trial_start') || Date.now())
    const now = Date.now()
    const days = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    const left = Math.max(0, TRIAL_DAYS - days)
    return `Free trial · ${left} dana`
  }, [plan])

  const isDemo = plan === 'demo'
  const isPremium = plan === 'premium'

  // TICKER
  useEffect(() => {
    const update = () => {
      const base = meta.name
      const msgs = [
        `Nema posebnih upozorenja za ${base}. Vozi oprezno.`,
        `Popusti i shopping večeras u ${base}.`,
        `Eventi i koncerti večeras u ${base} – provjeri local events.`,
        `TBW AI te podsjeća: uvijek poštuj ograničenja brzine.`,
        `Nightlife u ${base}: klubovi rade produženo (provjeri lokalne propise).`
      ]
      const idx = new Date().getMinutes() % msgs.length
      setTicker(msgs[idx])
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [meta])

  // JEZIK → localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('tbw_lang', lang)
  }, [lang])

  // VRIJEME – Open-Meteo
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

  // GEOLOKACIJA
  useEffect(() => {
    if (!legalAccepted) return
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoStatus('error')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        let bestKey = 'split'
        let bestDist = Infinity
        Object.entries(CITY_META).forEach(([key, val]) => {
          const dLat = latitude - val.lat
          const dLon = longitude - val.lon
          const dist = dLat * dLat + dLon * dLon
          if (dist < bestDist) {
            bestDist = dist
            bestKey = key
          }
        })
        setCity(CITY_META[bestKey].name)
        setGeoStatus('ok')
      },
      () => setGeoStatus('denied')
    )
  }, [legalAccepted])

  // SAFETY / SOS
  useEffect(() => {
    if (typeof window === 'undefined') return
    const sosRaw = localStorage.getItem('tbw_sos')
    if (sosRaw) {
      try {
        const s = JSON.parse(sosRaw)
        const parts = []
        if (s.name) parts.push('Ime: ' + s.name)
        if (s.blood) parts.push('Krvna grupa: ' + s.blood)
        if (s.allergies) parts.push('Alergije: ' + s.allergies)
        if (s.meds) parts.push('Terapija: ' + s.meds)
        setSosSummary(parts.join(' • ') || 'SOS profil je nepotpun.')
      } catch {
        setSosSummary('Nije postavljen.')
      }
    }
    const iceRaw = localStorage.getItem('tbw_ice')
    if (iceRaw) {
      try {
        setIceContacts(JSON.parse(iceRaw) || [])
      } catch {
        setIceContacts([])
      }
    }
  }, [])

  const planInsuranceText =
    'TBW AI PREMIUM je informativni alat. Za promet, vrijeme, more i sigurnost uvijek provjeri službene izvore. ' +
    'Autor aplikacije ne preuzima odgovornost za štetu, gubitak novca ili gubitak statusa premium korisnika zbog tehničkih problema, pada sustava, virusa ili napada hakera. ' +
    'Preporučuje se dodatno osiguranje vozača i putnika kod ovlaštenih osiguravatelja.'

  const handleLegalAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tbw_legal', '1')
    }
    setLegalAccepted(true)
  }

  const handleRouteSubmit = (e) => {
    e.preventDefault()
    const from = e.target.from.value.trim() || city
    const to = e.target.to.value.trim() || city
    const mode = e.target.mode.value
    const distance = mode === 'truck' ? '230 km' : '200 km'
    const duration = mode === 'truck' ? '120 min' : '90 min'
    const info = {
      from,
      to,
      mode,
      distance,
      duration,
      profile: mode === 'truck' ? 'Kamion' : 'Osobni'
    }
    setRouteInfo(info)
  }

  const handleStartNavigation = () => {
    if (!isPremium) {
      setShowPlanModal(true)
      return
    }
    if (!routeInfo) {
      alert('Prvo postavi rutu (polazak i odredište).')
      return
    }
    alert(
      `TBW motor (DEMO): krećem voditi rutu ${routeInfo.from} → ${routeInfo.to}. ` +
        'U pravoj verziji ovdje TBW daje glasovne upute, upozorenja na kamere, radare, radove, vrijeme i promet ispred tebe.'
    )
  }

  const handleEditSos = () => {
    const name = window.prompt('Ime i prezime (SOS profil):', '')
    const blood = window.prompt('Krvna grupa (npr. 0-, A+):', '')
    const allergies = window.prompt("Alergije (ako nema, upiši 'nema')", '')
    const meds = window.prompt('Važna terapija / lijekovi:', '')
    const iceStr = window.prompt(
      "ICE kontakti npr. 'Ana 0911111111; Marko +38598123456'",
      ''
    )
    const sos = { name, blood, allergies, meds }
    localStorage.setItem('tbw_sos', JSON.stringify(sos))
    const parts = []
    if (name) parts.push('Ime: ' + name)
    if (blood) parts.push('Krvna grupa: ' + blood)
    if (allergies) parts.push('Alergije: ' + allergies)
    if (meds) parts.push('Terapija: ' + meds)
    setSosSummary(parts.join(' • '))
    if (iceStr && iceStr.trim()) {
      const arr = iceStr
        .split(';')
        .map((s) => {
          const p = s.trim().split(/\s+/)
          if (p.length < 2) return null
          const phone = p.pop()
          const nm = p.join(' ')
          return { name: nm, phone }
        })
        .filter(Boolean)
      localStorage.setItem('tbw_ice', JSON.stringify(arr))
      setIceContacts(arr)
    }
    window.alert('SOS profil i ICE kontakti su spremljeni u ovom uređaju.')
  }

  const stripWake = (text) =>
    text.replace(/^\s*(hey|hej)\s+(tbw|tebeve|t\.b\.w\.?)/i, '').trim()

  const parseCityFromQuery = (q) => {
    const reg = /\b(u|za|prema)\s+([A-ZČĆŠĐŽ][A-Za-zČĆŠĐŽčćšđž]+)/i
    const reg2 = /\b([A-ZČĆŠĐŽ][A-Za-zČĆŠĐŽčćšđž]+)\b$/i
    const m = q.match(reg) || q.match(reg2)
    if (m) return m[2] || m[1]
    return null
  }

  const detectIntents = (lower) => {
    const intents = []
    if (/apartman|smještaj|hotel|booking/.test(lower)) intents.push('booking')
    if (/promet|gužva|zastoj|traffic/.test(lower)) intents.push('traffic')
    if (/vrijeme|temperatur|prognoza/.test(lower)) intents.push('weather')
    if (/avion|let|aerodrom|zračna luka/.test(lower)) intents.push('airport')
    if (/ruta|navigiraj|idem prema|vozim/.test(lower)) intents.push('route')
    if (/truck|kamion/.test(lower)) intents.push('truck')
    if (/nesreć|sudar|accident/.test(lower)) intents.push('emergency')
    return intents
  }

  const handleAiQuery = (raw) => {
    if (!raw || !raw.trim()) return
    const text = stripWake(raw.trim())
    const lower = text.toLowerCase()

    if (pendingEmergency) {
      if (/^(da|može|naravno|zovi)/.test(lower)) {
        setPendingEmergency(false)
        const num = detectRegionEmergencyNumber()
        const msg = `Označio sam nesreću. Otvaram poziv prema ${num}.`
        setAiResponse(msg)
        window.location.href = 'tel:' + num
        return
      }
      if (/^(ne|nije potrebno|stigli su)/.test(lower)) {
        setPendingEmergency(false)
        setAiResponse('U redu, ne zovem hitne službe. Vozi oprezno.')
        return
      }
    }

    const newCity = parseCityFromQuery(text)
    if (newCity) setCity(newCity)

    const intents = detectIntents(lower)
    if (intents.includes('emergency')) {
      setPendingEmergency(true)
      setAiResponse(
        'Detektirao sam prijavu nesreće ispred tebe. Želiš li da pozovem hitne službe?'
      )
      return
    }

    const responses = []
    if (intents.includes('weather'))
      responses.push('Provjeravam vrijeme za ' + city + '.')
    if (intents.includes('traffic'))
      responses.push('Provjeravam promet prema tvojoj ruti.')
    if (intents.includes('booking'))
      responses.push('Sinkroniziram karticu smještaja za ' + city + '.')
    if (intents.includes('route'))
      responses.push('Postavimo rutu pa pokrećemo TBW navigaciju.')
    if (intents.length === 0)
      responses.push(
        'Možeš pitati za promet, vrijeme, smještaj, rutu, more, aerodrom ili prijaviti nesreću.'
      )

    setAiResponse(responses.join(' '))
  }

  const onSearchSubmit = (e) => {
    e.preventDefault()
    handleAiQuery(search)
  }

  // MIC – WebSpeech
  useEffect(() => {
    if (typeof window === 'undefined') return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognition.lang = 'hr-HR'
    recognition.continuous = true
    recognition.interimResults = false

    recognition.addEventListener('result', (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (!r.isFinal) continue
        const text = r[0].transcript || ''
        setSearch(text)
        handleAiQuery(text)
      }
    })

    recognition.addEventListener('end', () => {
      setMicOn((prev) => {
        if (prev) {
          try {
            recognition.start()
          } catch {
            return false
          }
        }
        return prev
      })
    })

    const btn = document.getElementById('tbw-mic-btn')
    const toggleMic = () => {
      setMicOn((prev) => {
        const next = !prev
        try {
          if (next) recognition.start()
          else recognition.stop()
        } catch {}
        return next
      })
    }

    if (btn) btn.addEventListener('click', toggleMic)
    return () => {
      if (btn) btn.removeEventListener('click', toggleMic)
      try {
        recognition.stop()
      } catch {}
    }
  }, [])

  const handleCall112 = () => {
    window.location.href = 'tel:112'
  }
  const handleCall911 = () => {
    window.location.href = 'tel:911'
  }

  const onLangChange = (e) => setLang(e.target.value)

  const heroTempIcon =
    weather.temp == null
      ? '…'
      : weather.temp <= 0
      ? '❄️'
      : weather.temp >= 25
      ? '☀️'
      : '⛅'

  const openCardFullscreen = (cardId, title, body) => {
    setFullscreenCard(
      <section>
        <h2>{title}</h2>
        {body || (
          <p>
            Fullscreen prikaz kartice: {cardId}. Ovdje kasnije možeš dodati
            grafove, mape ili dodatne podatke.
          </p>
        )}
      </section>
    )
  }

  const handlePlanPurchase = (type) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tbw_plan', 'premium')
    }
    setPlan('premium')
    setShowPlanModal(false)
    window.alert(
      type === 'month'
        ? 'Premium (9.99 €/mj) aktiviran (DEMO – nema stvarne naplate).'
        : 'Premium (99.9 €/god) aktiviran (DEMO – nema stvarne naplate).'
    )
  }

  const premiumClick = () => {
    if (plan === 'premium') return
    setShowPlanModal(true)
  }

  const demoOverlay = (cardName) =>
    isDemo ? (
      <div className="demo-overlay">
        <p>
          {cardName} nije dostupan u demo modu.
          <br />
          Kupi premium za puni pristup.
        </p>
        <button className="btn-main" onClick={() => setShowPlanModal(true)}>
          Kupi premium
        </button>
      </div>
    ) : null

  const legalOverlay = !legalAccepted

  // statički popisi
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

  const cafes =
    meta.name === 'Split'
      ? ['Viva', 'Ovčice']
      : meta.name === 'Zadar'
      ? ['Garden Lounge', 'Kornat bar']
      : ['Cvjetni', 'Dežman']

  const clubs =
    meta.name === 'Split'
      ? ['Vanilla', 'Central']
      : meta.name === 'Zadar'
      ? ['Ledana', 'Maraschino']
      : ['Katran', 'Opera']

  const shops =
    meta.name === 'Split'
      ? ['Tommy', 'Konzum', 'Ribola']
      : ['Konzum', 'Spar', 'Plodine']

  const malls =
    meta.name === 'Split'
      ? ['Mall of Split', 'City Center One']
      : ['Arena Centar', 'Avenue Mall']

  const fuel = meta.name === 'Split' ? ['INA', 'Crodux'] : ['INA', 'Tifon']

  const busLines = [
    'Bus 5: Centar → Žnjan (za 9 min)',
    'Bus 17: Lora → Trg (za 22 min)'
  ]
  const railLines = [`IC 521: ${meta.name} → Zagreb 14:40 (+3 min)`]
  const ferryLines =
    meta.name === 'Split'
      ? ['Split → Supetar 15:30 (+10 min)']
      : ['Zadar → Preko 16:15 (na vrijeme)']

  const truckRestrictions = [
    'Ograničenje 60 km/h na obilaznici.',
    'Obavezni odmor svakih 4.5 h vožnje.',
    'Provjeri zimske uvjete iznad 900 m n.v.'
  ]

  // SUPPORT CHAT
  const supportAsk = (text) => {
    const userMsg = { from: 'user', text }
    let aiText =
      'TBW support (demo): mogu odgovarati samo na pitanja o aplikaciji, pretplatama i sigurnosti podataka.'

    if (/premium/i.test(text)) {
      aiText =
        'Premium uključuje: punu TBW navigaciju (auto i truck), napredne API-je za vrijeme/promet, prioritetni razvoj i founder mod. Cijena: 9.99 €/mj ili 99.9 €/god.'
    } else if (/trial|demo/i.test(text)) {
      aiText =
        'Trial traje 3 dana i koristi besplatne izvore. Nakon toga prelaziš u demo mod s ograničenim funkcijama. Za punu navigaciju trebaš Premium.'
    } else if (/podaci|data|privacy|privatnost/i.test(text)) {
      aiText =
        'Aplikacija u ovoj demo verziji ne šalje osobne podatke na server bez tvoje potvrde. Preporuča se redovito čitanje uvjeta korištenja i politike privatnosti.'
    }

    const aiMsg = { from: 'ai', text: aiText }
    setSupportMessages((prev) => [...prev, userMsg, aiMsg])
  }

  // FOUNDER MOD
  const handleLogoDoubleClick = () => {
    const pin = window.prompt('Founder PIN:', '')
    if (pin === '1974') {
      setFounderMode(true)
      localStorage.setItem('tbw_founder', '1')
      alert('Founder mod uključen.')
    } else if (pin) {
      alert('Pogrešan PIN.')
    }
  }

  const handleFounderToggleMaintenance = () => {
    const next = !maintenance
    setMaintenance(next)
    localStorage.setItem('tbw_maintenance', next ? '1' : '0')
  }

  const handleFounderBlockDevice = () => {
    const ok = window.confirm(
      'Sigurno želiš trajno blokirati TBW na ovom uređaju?'
    )
    if (!ok) return
    setBlocked(true)
    localStorage.setItem('tbw_blocked', '1')
  }

  // ako je maintenance i nisi founder → samo maintenance ekran
  if (maintenance && !founderMode) {
    return (
      <div className="app-root">
        <h1>TBW AI PREMIUM</h1>
        <h2>Maintenance mod</h2>
        <p>
          Aplikacija se trenutno ažurira. Pokušaj ponovno kasnije. Sve
          pretplate i podaci ostaju sačuvani.
        </p>
      </div>
    )
  }

  // ticker LED boja
  const tickerDotStyle = {
    backgroundColor: isPremium ? '#22c55e' : isDemo ? '#facc15' : '#22d3ee'
  }

  const showIntroOverlay = !introSeen

  return (
    <>
      {/* INTRO VIDEO */}
      {showIntroOverlay && (
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
                setIntroSeen(true)
                if (typeof window !== 'undefined') {
                  localStorage.setItem('tbw_intro', '1')
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

      {/* LEGAL overlay */}
      {legalOverlay && (
        <div className="overlay">
          <div className="overlay-inner">
            <h2>{dict.legalTitle}</h2>
            <p>{dict.legal1}</p>
            <p>{planInsuranceText}</p>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={legalChk1}
                onChange={(e) => setLegalChk1(e.target.checked)}
              />
              <span>{dict.legalAccept}</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={legalChk2}
                onChange={(e) => setLegalChk2(e.target.checked)}
              />
              <span>{dict.legalRobot}</span>
            </label>
            <button
              className="btn-main"
              disabled={!(legalChk1 && legalChk2)}
              onClick={handleLegalAccept}
            >
              {dict.legalBtn}
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN CARD */}
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

      {/* PREMIUM MODAL */}
      {showPlanModal && (
        <div className="overlay" onClick={() => setShowPlanModal(false)}>
          <div
            className="overlay-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>TBW AI PREMIUM</h2>
            <p>Odaberi paket:</p>
            <ul>
              <li>{dict.planMonthly}</li>
              <li>{dict.planYearly}</li>
            </ul>
            <p
              style={{
                fontSize: '.8rem',
                color: '#93a3c4'
              }}
            >
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
                onClick={() => setShowPlanModal(false)}
              >
                {dict.planClose}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TICKER */}
      <div className="tbw-ticker">
        <div className="tbw-ticker-dot" style={tickerDotStyle} />
        <div className="tbw-ticker-text">
          <span>{ticker}</span>
          <span>{ticker}</span>
        </div>
      </div>

      <div className="app-root">
        {/* HEADER */}
        <header className="app-header">
          <div>
            <div
              className="logo-row"
              onDoubleClick={handleLogoDoubleClick}
              title="Dvostruki klik za Founder PIN"
            >
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
              onChange={onLangChange}
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
              onClick={premiumClick}
            >
              {premiumText}
            </button>
          </div>
        </header>

        {/* HERO + AI TRAŽILICA */}
        <div className="hero-search-shell">
          <section className="hero-card">
            <div className="hero-top-row">
              <div className="hero-tags">
                <button className="chip" type="button">
                  {meta.name}
                </button>
                <button className="chip" type="button">
                  {geoStatus === 'ok'
                    ? 'Lokacija uključena'
                    : geoStatus === 'denied'
                    ? 'Lokacija isključena'
                    : 'Lokacija (demo)'}
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

            <form className="search-strip" onSubmit={onSearchSubmit}>
              <input
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Upiši grad ili pitanje, npr. 'Split apartmani'..."
              />
              <button type="submit" className="btn-main">
                TBW AI
              </button>
              <button
                type="button"
                id="tbw-mic-btn"
                className={'btn-circle' + (micOn ? ' mic-on' : '')}
                aria-label="Glasovno pretraživanje"
              />
            </form>
            <div className="ai-response">{aiResponse}</div>
          </section>
        </div>

        {/* KARTICE */}
        <main className="cards-grid">
          {/* NAVIGACIJA */}
          <section className="card">
            <div className="card-header">
              <h2>{dict.navTitle}</h2>
              <button
                className="card-expand"
                onClick={() =>
                  openCardFullscreen(
                    'nav',
                    dict.navTitle,
                    <div>
                      <p>
                        Ovdje će kasnije biti full-screen navigacija s kartom,
                        prometom, kamerama, radovima i glasovnim uputama
                        (premium).
                      </p>
                    </div>
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
            {isDemo && demoOverlay('Navigacija')}
          </section>

          {/* BOOKING */}
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
            {demoOverlay('Booking')}
          </section>

          {/* VRIJEME */}
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
                      Ovdje kasnije možeš dodati graf temperature po satima,
                      prognozu po danima i upozorenja (vjetar, oluja, snijeg).
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
            {demoOverlay('Vrijeme')}
          </section>

          {/* PROMET */}
          <section className="card">
            <div className="card-header">
              <h2>{dict.trafficTitle}</h2>
              <button
                className="card-expand"
                onClick={() =>
                  openCardFullscreen(
                    'traffic',
                    dict.trafficTitle,
                    <p>
                      Full-screen promet: kasnije će ovdje TBW prikazivati mape,
                      radove, kamere, zastoje i upozorenja u realnom vremenu.
                    </p>
                  )
                }
              >
                ⤢
              </button>
            </div>
            <div className="card-body">
              <div className="value">
                Pojačan promet u zonama ulaza u {meta.name}. Povremeni zastoji.
              </div>
              <div className="small muted">Brzina: 32–45 km/h (demo)</div>
            </div>
            {demoOverlay('Promet')}
          </section>

          {/* AERODROMI */}
          <section className="card">
            <div className="card-header">
              <h2>{dict.airportTitle}</h2>
              <button
                className="card-expand"
                onClick={() =>
                  openCardFullscreen(
                    'airports',
                    dict.airportTitle,
                    <p>
                      Full-screen aerodromi: kasnije TBW dohvaća real-time
                      odlazne/dolazne letove i kašnjenja preko API-ja.
                    </p>
                  )
                }
              >
                ⤢
              </button>
            </div>
            <div className="card-body">
              <div className="label">{dict.airportNearest}</div>
              <div className="value">{meta.airport || '---'}</div>
              <div className="small muted mt">
                Letovi uglavnom na vrijeme, provjeri boarding na vrijeme.
              </div>
            </div>
            {demoOverlay('Aerodromi')}
          </section>

          {/* SIGURNOST & SOS */}
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
              <div className="value">{sosSummary}</div>
              <button
                className="btn-secondary small mt"
                onClick={handleEditSos}
              >
                {dict.sosEdit}
              </button>
              <div className="label mt">{dict.iceLabel}</div>
              <ul className="simple-list">
                {iceContacts.map((c, idx) => (
                  <li key={idx}>
                    {c.name} – {c.phone}
                  </li>
                ))}
                {!iceContacts.length && (
                  <li className="small muted">Nema unesenih kontakata.</li>
                )}
              </ul>
              <div className="mt">
                <button className="btn-danger" onClick={handleCall112}>
                  112
                </button>{' '}
              <button
                  className="btn-secondary small"
                  onClick={handleCall911}
                >
                  911
                </button>
              </div>
              <div className="small muted mt">{planInsuranceText}</div>
            </div>
          </section>

          {/* ŠTO POSJETITI */}
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

          {/* HRANA & NIGHTLIFE */}
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
              <div>
                <div className="label">{dict.foodCafe}</div>
                <ul className="simple-list">
                  {cafes.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <div className="label mt">{dict.foodClub}</div>
                <ul className="simple-list">
                  {clubs.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* TRGOVINE & ENERGIJA */}
          <section className="card">
            <div className="card-header">
              <h2>{dict.shopsTitle}</h2>
              <button
                className="card-expand"
                onClick={() => openCardFullscreen('shops', dict.shopsTitle)}
              >
                ⤢
              </button>
            </div>
            <div className="card-body two-col">
              <div>
                <div className="label">{dict.shopsGrocery}</div>
                <ul className="simple-list">
                  {shops.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <div className="label mt">{dict.shopsMalls}</div>
                <ul className="simple-list">
                  {malls.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="label">{dict.fuelEv}</div>
                <ul className="simple-list">
                  {fuel.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* TRUCK & LONG-HAUL */}
          <section className="card">
            <div className="card-header">
              <h2>{dict.truckTitle}</h2>
              <button
                className="card-expand"
                onClick={() => openCardFullscreen('truck', dict.truckTitle)}
              >
                ⤢
              </button>
            </div>
            <div className="card-body">
              <div className="value">
                Zimski režim, obavezni lanci iznad 900 m. Zabrana za &gt;7.5 t
                kroz centre gradova.
              </div>
              <ul className="simple-list mt">
                {truckRestrictions.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* JAVNI PRIJEVOZ */}
          <section className="card">
            <div className="card-header">
              <h2>{dict.transitTitle}</h2>
              <button
                className="card-expand"
                onClick={() => openCardFullscreen('transit', dict.transitTitle)}
              >
                ⤢
              </button>
            </div>
            <div className="card-body two-col">
              <div>
                <div className="label">Bus</div>
                <ul className="simple-list">
                  {busLines.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="label mt">Vlak</div>
                <ul className="simple-list">
                  {railLines.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="label">Trajekt</div>
                <ul className="simple-list">
                  {ferryLines.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="footer">
          <p>
            © {new Date().getFullYear()} TBW AI PREMIUM NAVIGATOR · Sva prava
            pridržana.
          </p>
          <p>
            {planInsuranceText} Kontakt: ai.tbw.booking@gmail.com.
          </p>
        </footer>
      </div>

      {/* SUPPORT CHAT BUTTON */}
      <button
        className="support-button"
        onClick={() => setSupportOpen((p) => !p)}
      >
        TBW support
      </button>
      {supportOpen && (
        <div className="support-panel">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <strong>{dict.supportTitle}</strong>
            <button
              className="btn-secondary small"
              onClick={() => setSupportOpen(false)}
            >
              ✕
            </button>
          </div>
          <p className="small muted">{dict.supportIntro}</p>
          <div className="support-messages">
            {supportMessages.map((m, i) => (
              <div
                key={i}
                className={
                  'support-msg ' + (m.from === 'user' ? 'user' : 'ai')
                }
              >
                {m.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SUPPORT_QUESTIONS.map((q) => (
              <button
                key={q}
                className="btn-secondary small"
                onClick={() => supportAsk(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FOUNDER BADGE */}
      {founderMode && (
        <div className="founder-badge">
          {dict.founderLabel}{' '}
          <button
            className="btn-secondary small"
            style={{ marginLeft: 6 }}
            onClick={handleFounderToggleMaintenance}
          >
            {dict.founderMaintenance}: {maintenance ? 'ON' : 'OFF'}
          </button>{' '}
          <button
            className="btn-secondary small"
            style={{ marginLeft: 4 }}
            onClick={handleFounderBlockDevice}
          >
            {dict.founderBlockDevice}
          </button>
        </div>
      )}
    </>
  )
}

export default App
