/**
 * Peregrino Landing — i18n
 * 10 idiomas, mesma estrutura do app.
 * Detecção: 1) ?lang=xx na URL  2) localStorage  3) navigator.language  4) pt-BR
 */

import React, { createContext, useContext, useState } from 'react';

export type LangCode = 'pt-BR' | 'pt-PT' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'ko' | 'zh-CN';

export const AVAILABLE_LANGS: { code: LangCode; flag: string; label: string; name: string }[] = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'PT-BR', name: 'Português (Brasil)'   },
  { code: 'pt-PT', flag: '🇵🇹', label: 'PT-PT', name: 'Português (Portugal)' },
  { code: 'es',    flag: '🇪🇸', label: 'ES',    name: 'Español'              },
  { code: 'en',    flag: '🇬🇧', label: 'EN',    name: 'English'              },
  { code: 'de',    flag: '🇩🇪', label: 'DE',    name: 'Deutsch'              },
  { code: 'it',    flag: '🇮🇹', label: 'IT',    name: 'Italiano'             },
  { code: 'fr',    flag: '🇫🇷', label: 'FR',    name: 'Français'             },
  { code: 'ja',    flag: '🇯🇵', label: '日本語', name: '日本語'               },
  { code: 'ko',    flag: '🇰🇷', label: '한국어', name: '한국어'               },
  { code: 'zh-CN', flag: '🇨🇳', label: '中文',  name: '中文 (简体)'          },
];

const CJK: LangCode[] = ['ja', 'ko', 'zh-CN'];
const LS_KEY = 'wp_locale';

type Dict = Record<string, string>;

const translations: Record<LangCode, Dict> = {
  'pt-BR': {
    'hero.title':   'Sua jornada merece\nser eterna.',
    'hero.cta':     'Comece o Caminho',

    'modal.tagline': 'Peregrino App',
    'modal.title':   'Sua jornada começa aqui.',
    'modal.ios':     'Baixe para iOS',
    'modal.android': 'Baixe para Android',
    'modal.qr':      'Aponte a câmera para baixar direto no seu celular.',

    'features.eyebrow':       'Experiência Completa',
    'features.title':         'Tudo o que você precisa para o seu Caminho.',
    'features.sos.title':     'Segurança em Tempo Real',
    'features.sos.desc':      'Sinta a proteção de uma comunidade conectada. Com o SOS inteligente, você sinaliza sua urgência e mobiliza peregrinos ao seu redor instantaneamente.',
    'features.weather.title': 'Clima da Trilha',
    'features.weather.desc':  'Alertas meteorológicos precisos para sua localização exata. Saiba quando se proteger antes da primeira gota cair.',
    'features.terrain.title': 'Domine o Terreno',
    'features.terrain.desc':  'Gráficos de elevação e progresso da etapa para você gerenciar sua energia como um veterano.',
    'features.legacy.title':  'Sua Jornada Eternizada',
    'features.legacy.desc':   'Colecione selos digitais em cada etapa e, ao chegar em Santiago, transforme suas memórias em um álbum físico exclusivo de colecionador.',
    'features.stamps.title':  'Selos e Conquistas',
    'features.stamps.desc':   'Registre sua evolução oficial no Caminho. Escaneie os QR Codes em cada etapa para validar sua passagem e completar sua Credencial Digital.',
    'features.guide.title':   'Guia de Essenciais',
    'features.guide.desc':    'Localize fontes, pontos de descanso e albergues abertos conforme você caminha. O essencial, sempre à mão.',
    'features.camera.title':  'Câmera da Trilha',
    'features.camera.desc':   'Capture a essência da jornada. Use a nossa câmera integrada para organizar suas fotos automaticamente por etapa e localização.',

    'journey.title':          'Escolha o seu destino.',
    'journey.label.start':    'Início',
    'journey.label.dist':     'Distância',
    'journey.label.stages':   'Etapas',
    'journey.tag.frances':           'O Clássico dos Pirineus',
    'journey.tag.portugues.central': 'A Herança de Santiago',
    'journey.tag.portugues.lisboa':  'A Grande Peregrinação',
    'journey.tag.portugues.costa':   'O Som do Atlântico',
    'journey.tag.interior':          'A Rota das Aldeias',
    'journey.tag.primitivo':         'A Primeira Rota',
    'journey.tag.norte':             'O Caminho do Mar',
    'journey.tag.ingles':            'A Rota Marítima',
    'journey.tag.aragones':          'Pelos Passos de Aragão',
    'journey.tag.plata':             'O Gigante do Sul',
    'journey.tag.sanabres':          'Conexão Galega',
    'journey.tag.inverno':           'A Rota do Fogo e Neve',

    'book.title':   'Eternize suas memórias.',
    'book.phrase1': 'Cada passo, cada silêncio, cada conquista.',
    'book.phrase2': 'Do primeiro km ao último carimbo.',
    'book.phrase3': 'Suas fotos. Sua história. Seu livro.',
    'book.phrase4': 'Um objeto que dura mais que a memória.',
    'book.phrase5': 'Arte feita do seu Caminho.',
    'book.cta':     'Encomendar meu Livro de Recordações',
  },

  'pt-PT': {
    'hero.title':   'A tua jornada merece\nser eterna.',
    'hero.cta':     'Começa o Caminho',

    'modal.tagline': 'Peregrino App',
    'modal.title':   'A tua jornada começa aqui.',
    'modal.ios':     'Descarregar para iOS',
    'modal.android': 'Descarregar para Android',
    'modal.qr':      'Aponta a câmara para descarregar diretamente no teu telemóvel.',

    'features.eyebrow':       'Experiência Completa',
    'features.title':         'Tudo o que precisas para o teu Caminho.',
    'features.sos.title':     'Segurança em Tempo Real',
    'features.sos.desc':      'Sente a proteção de uma comunidade conectada. Com o SOS inteligente, sinalizas a tua urgência e mobilizas peregrinos à tua volta instantaneamente.',
    'features.weather.title': 'Clima da Trilha',
    'features.weather.desc':  'Alertas meteorológicos precisos para a tua localização exata. Sabe quando te proteger antes da primeira gota cair.',
    'features.terrain.title': 'Domina o Terreno',
    'features.terrain.desc':  'Gráficos de elevação e progresso da etapa para gerires a tua energia como um veterano.',
    'features.legacy.title':  'A Tua Jornada Eternizada',
    'features.legacy.desc':   'Coleciona selos digitais em cada etapa e, ao chegar a Santiago, transforma as tuas memórias num álbum físico exclusivo de colecionador.',
    'features.stamps.title':  'Selos e Conquistas',
    'features.stamps.desc':   'Regista a tua evolução oficial no Caminho. Digitaliza os QR Codes em cada etapa para validares a tua passagem e completares a tua Credencial Digital.',
    'features.guide.title':   'Guia de Essenciais',
    'features.guide.desc':    'Localiza fontes, pontos de descanso e albergues abertos conforme caminhas. O essencial, sempre à mão.',
    'features.camera.title':  'Câmara da Trilha',
    'features.camera.desc':   'Captura a essência da jornada. Usa a nossa câmara integrada para organizar as tuas fotos automaticamente por etapa e localização.',

    'journey.title':          'Escolhe o teu destino.',
    'journey.label.start':    'Início',
    'journey.label.dist':     'Distância',
    'journey.label.stages':   'Etapas',
    'journey.tag.frances':           'O Clássico dos Pirenéus',
    'journey.tag.portugues.central': 'A Herança de Santiago',
    'journey.tag.portugues.lisboa':  'A Grande Peregrinação',
    'journey.tag.portugues.costa':   'O Som do Atlântico',
    'journey.tag.interior':          'A Rota das Aldeias',
    'journey.tag.primitivo':         'A Primeira Rota',
    'journey.tag.norte':             'O Caminho do Mar',
    'journey.tag.ingles':            'A Rota Marítima',
    'journey.tag.aragones':          'Pelos Passos de Aragão',
    'journey.tag.plata':             'O Gigante do Sul',
    'journey.tag.sanabres':          'Ligação Galega',
    'journey.tag.inverno':           'A Rota do Fogo e Neve',

    'book.title':   'Eterniza as tuas memórias.',
    'book.phrase1': 'Cada passo, cada silêncio, cada conquista.',
    'book.phrase2': 'Do primeiro km ao último carimbo.',
    'book.phrase3': 'As tuas fotos. A tua história. O teu livro.',
    'book.phrase4': 'Um objeto que dura mais que a memória.',
    'book.phrase5': 'Arte feita do teu Caminho.',
    'book.cta':     'Encomendar o Meu Livro de Recordações',
  },

  'en': {
    'hero.title':   'Your journey deserves\nto be eternal.',
    'hero.cta':     'Start the Camino',

    'modal.tagline': 'Peregrino App',
    'modal.title':   'Your journey starts here.',
    'modal.ios':     'Download for iOS',
    'modal.android': 'Download for Android',
    'modal.qr':      'Point your camera to download directly on your phone.',

    'features.eyebrow':       'Complete Experience',
    'features.title':         'Everything you need for your Camino.',
    'features.sos.title':     'Real-Time Safety',
    'features.sos.desc':      'Feel the protection of a connected community. With smart SOS, you signal your emergency and mobilize nearby pilgrims instantly.',
    'features.weather.title': 'Trail Weather',
    'features.weather.desc':  'Precise weather alerts for your exact location. Know when to take shelter before the first drop falls.',
    'features.terrain.title': 'Master the Terrain',
    'features.terrain.desc':  'Elevation charts and stage progress to manage your energy like a veteran.',
    'features.legacy.title':  'Your Journey Preserved',
    'features.legacy.desc':   'Collect digital stamps at each stage and, upon arriving in Santiago, transform your memories into an exclusive collector\'s photo book.',
    'features.stamps.title':  'Stamps & Achievements',
    'features.stamps.desc':   'Record your official progress on the Camino. Scan QR Codes at each stage to validate your passage and complete your Digital Credential.',
    'features.guide.title':   'Essentials Guide',
    'features.guide.desc':    'Find fountains, rest points and open hostels as you walk. The essentials, always at hand.',
    'features.camera.title':  'Trail Camera',
    'features.camera.desc':   'Capture the essence of the journey. Use our integrated camera to automatically organize your photos by stage and location.',

    'journey.title':          'Choose your destination.',
    'journey.label.start':    'Start',
    'journey.label.dist':     'Distance',
    'journey.label.stages':   'Stages',
    'journey.tag.frances':           'The Pyrenees Classic',
    'journey.tag.portugues.central': 'The Heritage of Santiago',
    'journey.tag.portugues.lisboa':  'The Great Pilgrimage',
    'journey.tag.portugues.costa':   'The Sound of the Atlantic',
    'journey.tag.interior':          'The Villages Route',
    'journey.tag.primitivo':         'The Original Route',
    'journey.tag.norte':             'The Way of the Sea',
    'journey.tag.ingles':            'The Maritime Route',
    'journey.tag.aragones':          'Through the Steps of Aragon',
    'journey.tag.plata':             'The Giant of the South',
    'journey.tag.sanabres':          'The Galician Connection',
    'journey.tag.inverno':           'The Fire and Snow Route',

    'book.title':   'Preserve your memories.',
    'book.phrase1': 'Every step, every silence, every victory.',
    'book.phrase2': 'From the first km to the last stamp.',
    'book.phrase3': 'Your photos. Your story. Your book.',
    'book.phrase4': 'An object that outlasts memory.',
    'book.phrase5': 'Art made from your Camino.',
    'book.cta':     'Order My Memory Book',
  },

  'es': {
    'hero.title':   'Tu camino merece\nser eterno.',
    'hero.cta':     'Empieza el Camino',

    'modal.tagline': 'Peregrino App',
    'modal.title':   'Tu camino empieza aquí.',
    'modal.ios':     'Descargar para iOS',
    'modal.android': 'Descargar para Android',
    'modal.qr':      'Apunta la cámara para descargar directamente en tu móvil.',

    'features.eyebrow':       'Experiencia Completa',
    'features.title':         'Todo lo que necesitas para tu Camino.',
    'features.sos.title':     'Seguridad en Tiempo Real',
    'features.sos.desc':      'Siente la protección de una comunidad conectada. Con el SOS inteligente, señalas tu urgencia y movilizas peregrinos cercanos al instante.',
    'features.weather.title': 'Clima del Camino',
    'features.weather.desc':  'Alertas meteorológicas precisas para tu ubicación exacta. Sabe cuándo protegerte antes de que caiga la primera gota.',
    'features.terrain.title': 'Domina el Terreno',
    'features.terrain.desc':  'Gráficos de elevación y progreso de etapa para gestionar tu energía como un veterano.',
    'features.legacy.title':  'Tu Jornada Eternizada',
    'features.legacy.desc':   'Colecciona sellos digitales en cada etapa y, al llegar a Santiago, transforma tus recuerdos en un álbum físico exclusivo de coleccionista.',
    'features.stamps.title':  'Sellos y Logros',
    'features.stamps.desc':   'Registra tu evolución oficial en el Camino. Escanea los QR Codes en cada etapa para validar tu paso y completar tu Credencial Digital.',
    'features.guide.title':   'Guía de Esenciales',
    'features.guide.desc':    'Localiza fuentes, puntos de descanso y albergues abiertos mientras caminas. Lo esencial, siempre a mano.',
    'features.camera.title':  'Cámara del Camino',
    'features.camera.desc':   'Captura la esencia del viaje. Usa nuestra cámara integrada para organizar tus fotos automáticamente por etapa y ubicación.',

    'journey.title':          'Elige tu destino.',
    'journey.label.start':    'Inicio',
    'journey.label.dist':     'Distancia',
    'journey.label.stages':   'Etapas',
    'journey.tag.frances':           'El Clásico de los Pirineos',
    'journey.tag.portugues.central': 'La Herencia de Santiago',
    'journey.tag.portugues.lisboa':  'La Gran Peregrinación',
    'journey.tag.portugues.costa':   'El Son del Atlántico',
    'journey.tag.interior':          'La Ruta de los Pueblos',
    'journey.tag.primitivo':         'La Primera Ruta',
    'journey.tag.norte':             'El Camino del Mar',
    'journey.tag.ingles':            'La Ruta Marítima',
    'journey.tag.aragones':          'Por los Pasos de Aragón',
    'journey.tag.plata':             'El Gigante del Sur',
    'journey.tag.sanabres':          'Conexión Gallega',
    'journey.tag.inverno':           'La Ruta del Fuego y la Nieve',

    'book.title':   'Eterniza tus recuerdos.',
    'book.phrase1': 'Cada paso, cada silencio, cada logro.',
    'book.phrase2': 'Del primer km al último sello.',
    'book.phrase3': 'Tus fotos. Tu historia. Tu libro.',
    'book.phrase4': 'Un objeto que dura más que la memoria.',
    'book.phrase5': 'Arte hecho de tu Camino.',
    'book.cta':     'Pedir Mi Libro de Recuerdos',
  },

  'fr': {
    'hero.title':   "Votre chemin mérite\nd'être éternel.",
    'hero.cta':     'Commencer le Chemin',

    'modal.tagline': 'Peregrino App',
    'modal.title':   'Votre chemin commence ici.',
    'modal.ios':     'Télécharger pour iOS',
    'modal.android': 'Télécharger pour Android',
    'modal.qr':      "Pointez l'appareil photo pour télécharger directement sur votre téléphone.",

    'features.eyebrow':       'Expérience Complète',
    'features.title':         'Tout ce dont vous avez besoin pour votre Chemin.',
    'features.sos.title':     'Sécurité en Temps Réel',
    'features.sos.desc':      "Ressentez la protection d'une communauté connectée. Avec le SOS intelligent, vous signalez votre urgence et mobilisez les pèlerins à proximité instantanément.",
    'features.weather.title': 'Météo du Sentier',
    'features.weather.desc':  "Alertes météorologiques précises pour votre localisation exacte. Sachez quand vous abriter avant que la première goutte tombe.",
    'features.terrain.title': 'Maîtrisez le Terrain',
    'features.terrain.desc':  "Graphiques d'élévation et progression d'étape pour gérer votre énergie comme un vétéran.",
    'features.legacy.title':  'Votre Voyage Éternisé',
    'features.legacy.desc':   "Collectionnez des tampons numériques à chaque étape et, en arrivant à Santiago, transformez vos souvenirs en un album photo exclusif de collection.",
    'features.stamps.title':  'Tampons et Réussites',
    'features.stamps.desc':   "Enregistrez votre progression officielle sur le Chemin. Scannez les QR Codes à chaque étape pour valider votre passage et compléter votre Accréditation Numérique.",
    'features.guide.title':   'Guide des Essentiels',
    'features.guide.desc':    "Localisez les fontaines, points de repos et auberges ouverts au fil de votre marche. L'essentiel, toujours à portée de main.",
    'features.camera.title':  'Appareil du Sentier',
    'features.camera.desc':   "Capturez l'essence du voyage. Utilisez notre appareil photo intégré pour organiser automatiquement vos photos par étape et localisation.",

    'journey.title':          'Choisissez votre destination.',
    'journey.label.start':    'Départ',
    'journey.label.dist':     'Distance',
    'journey.label.stages':   'Étapes',
    'journey.tag.frances':           'Le Classique des Pyrénées',
    'journey.tag.portugues.central': "L'Héritage de Santiago",
    'journey.tag.portugues.lisboa':  'Le Grand Pèlerinage',
    'journey.tag.portugues.costa':   "Le Son de l'Atlantique",
    'journey.tag.interior':          'La Route des Villages',
    'journey.tag.primitivo':         'La Route Originale',
    'journey.tag.norte':             'Le Chemin de la Mer',
    'journey.tag.ingles':            'La Route Maritime',
    'journey.tag.aragones':          "Sur les Pas d'Aragon",
    'journey.tag.plata':             'Le Géant du Sud',
    'journey.tag.sanabres':          'Connexion Galicienne',
    'journey.tag.inverno':           'La Route du Feu et de la Neige',

    'book.title':   'Éternisez vos souvenirs.',
    'book.phrase1': 'Chaque pas, chaque silence, chaque victoire.',
    'book.phrase2': 'Du premier km au dernier tampon.',
    'book.phrase3': 'Vos photos. Votre histoire. Votre livre.',
    'book.phrase4': 'Un objet qui dure plus que la mémoire.',
    'book.phrase5': 'Art fait de votre Chemin.',
    'book.cta':     'Commander Mon Livre de Souvenirs',
  },

  'de': {
    'hero.title':   'Deine Reise verdient es,\newig zu sein.',
    'hero.cta':     'Den Camino beginnen',

    'modal.tagline': 'Peregrino App',
    'modal.title':   'Deine Reise beginnt hier.',
    'modal.ios':     'Für iOS herunterladen',
    'modal.android': 'Für Android herunterladen',
    'modal.qr':      'Kamera darauf richten, um direkt auf dein Handy herunterzuladen.',

    'features.eyebrow':       'Vollständiges Erlebnis',
    'features.title':         'Alles, was du für deinen Camino brauchst.',
    'features.sos.title':     'Sicherheit in Echtzeit',
    'features.sos.desc':      'Spüre den Schutz einer vernetzten Gemeinschaft. Mit dem intelligenten SOS signalisierst du deinen Notfall und mobilisierst sofort Pilger in deiner Nähe.',
    'features.weather.title': 'Wegwetter',
    'features.weather.desc':  'Präzise Wetterwarnungen für deinen genauen Standort. Wisse, wann du Schutz suchen musst, bevor der erste Tropfen fällt.',
    'features.terrain.title': 'Das Gelände beherrschen',
    'features.terrain.desc':  'Höhenprofile und Etappenfortschritt, um deine Energie wie ein Veteran zu verwalten.',
    'features.legacy.title':  'Deine Reise verewigt',
    'features.legacy.desc':   'Sammle digitale Stempel an jeder Etappe und verwandle bei der Ankunft in Santiago deine Erinnerungen in ein exklusives Sammlerfotoalbum.',
    'features.stamps.title':  'Stempel & Errungenschaften',
    'features.stamps.desc':   'Dokumentiere deinen offiziellen Fortschritt auf dem Camino. Scanne die QR-Codes an jeder Etappe, um deinen Durchgang zu bestätigen und deinen Digitalen Pilgerausweis zu vervollständigen.',
    'features.guide.title':   'Essentials-Leitfaden',
    'features.guide.desc':    'Finde Brunnen, Rastplätze und geöffnete Herbergen während du gehst. Das Wesentliche, immer zur Hand.',
    'features.camera.title':  'Weg-Kamera',
    'features.camera.desc':   'Halte die Essenz der Reise fest. Nutze unsere integrierte Kamera, um deine Fotos automatisch nach Etappe und Standort zu organisieren.',

    'journey.title':          'Wähle dein Ziel.',
    'journey.label.start':    'Start',
    'journey.label.dist':     'Entfernung',
    'journey.label.stages':   'Etappen',
    'journey.tag.frances':           'Der Klassiker der Pyrenäen',
    'journey.tag.portugues.central': 'Das Erbe von Santiago',
    'journey.tag.portugues.lisboa':  'Die Große Pilgerfahrt',
    'journey.tag.portugues.costa':   'Der Klang des Atlantiks',
    'journey.tag.interior':          'Die Dörferroute',
    'journey.tag.primitivo':         'Die Originalroute',
    'journey.tag.norte':             'Der Weg des Meeres',
    'journey.tag.ingles':            'Die Seeroute',
    'journey.tag.aragones':          'Auf den Spuren Aragóns',
    'journey.tag.plata':             'Der Riese des Südens',
    'journey.tag.sanabres':          'Galicische Verbindung',
    'journey.tag.inverno':           'Die Route des Feuers und Schnees',

    'book.title':   'Verewige deine Erinnerungen.',
    'book.phrase1': 'Jeder Schritt, jede Stille, jeder Sieg.',
    'book.phrase2': 'Vom ersten km bis zum letzten Stempel.',
    'book.phrase3': 'Deine Fotos. Deine Geschichte. Dein Buch.',
    'book.phrase4': 'Ein Objekt, das länger hält als die Erinnerung.',
    'book.phrase5': 'Kunst aus deinem Camino.',
    'book.cta':     'Mein Erinnerungsbuch bestellen',
  },

  'it': {
    'hero.title':   'Il tuo cammino merita\ndi essere eterno.',
    'hero.cta':     'Inizia il Cammino',

    'modal.tagline': 'Peregrino App',
    'modal.title':   'Il tuo cammino inizia qui.',
    'modal.ios':     'Scarica per iOS',
    'modal.android': 'Scarica per Android',
    'modal.qr':      'Punta la fotocamera per scaricare direttamente sul tuo telefono.',

    'features.eyebrow':       'Esperienza Completa',
    'features.title':         'Tutto ciò di cui hai bisogno per il tuo Cammino.',
    'features.sos.title':     'Sicurezza in Tempo Reale',
    'features.sos.desc':      "Senti la protezione di una comunità connessa. Con l'SOS intelligente, segnali la tua emergenza e mobiliti i pellegrini vicini all'istante.",
    'features.weather.title': 'Meteo del Sentiero',
    'features.weather.desc':  'Avvisi meteorologici precisi per la tua posizione esatta. Sai quando ripararti prima che cada la prima goccia.',
    'features.terrain.title': 'Padroneggia il Terreno',
    'features.terrain.desc':  'Grafici di elevazione e progresso tappa per gestire la tua energia come un veterano.',
    'features.legacy.title':  'Il Tuo Viaggio Eternato',
    'features.legacy.desc':   "Colleziona timbri digitali a ogni tappa e, all'arrivo a Santiago, trasforma i tuoi ricordi in un album fotografico esclusivo da collezione.",
    'features.stamps.title':  'Timbri e Traguardi',
    'features.stamps.desc':   'Registra la tua evoluzione ufficiale sul Cammino. Scansiona i QR Code a ogni tappa per convalidare il tuo passaggio e completare la tua Credenziale Digitale.',
    'features.guide.title':   'Guida agli Essenziali',
    'features.guide.desc':    "Trova fonti, punti di sosta e ostelli aperti mentre cammini. L'essenziale, sempre a portata di mano.",
    'features.camera.title':  'Fotocamera del Sentiero',
    'features.camera.desc':   'Cattura l\'essenza del viaggio. Usa la nostra fotocamera integrata per organizzare automaticamente le tue foto per tappa e posizione.',

    'journey.title':          'Scegli la tua destinazione.',
    'journey.label.start':    'Partenza',
    'journey.label.dist':     'Distanza',
    'journey.label.stages':   'Tappe',
    'journey.tag.frances':           'Il Classico dei Pirenei',
    "journey.tag.portugues.central": "L'Eredità di Santiago",
    'journey.tag.portugues.lisboa':  'Il Grande Pellegrinaggio',
    "journey.tag.portugues.costa":   "Il Suono dell'Atlantico",
    'journey.tag.interior':          'La Rotta dei Villaggi',
    'journey.tag.primitivo':         'La Rotta Originale',
    'journey.tag.norte':             'Il Cammino del Mare',
    'journey.tag.ingles':            'La Rotta Marittima',
    "journey.tag.aragones":          "Sui Passi dell'Aragona",
    'journey.tag.plata':             'Il Gigante del Sud',
    'journey.tag.sanabres':          'Connessione Galiziana',
    'journey.tag.inverno':           'La Rotta del Fuoco e della Neve',

    'book.title':   'Etternate i tuoi ricordi.',
    'book.phrase1': 'Ogni passo, ogni silenzio, ogni conquista.',
    'book.phrase2': "Dal primo km all'ultimo timbro.",
    'book.phrase3': 'Le tue foto. La tua storia. Il tuo libro.',
    'book.phrase4': 'Un oggetto che dura più della memoria.',
    'book.phrase5': 'Arte fatta del tuo Cammino.',
    'book.cta':     'Ordina il Mio Libro dei Ricordi',
  },

  'ja': {
    'hero.title':   'あなたの旅は、\n永遠に残る価値がある。',
    'hero.cta':     'カミーノを始める',

    'modal.tagline': 'Peregrino App',
    'modal.title':   'あなたの旅はここから始まる。',
    'modal.ios':     'iOSでダウンロード',
    'modal.android': 'Androidでダウンロード',
    'modal.qr':      'カメラを向けてスマートフォンに直接ダウンロード。',

    'features.eyebrow':       '完全な体験',
    'features.title':         'カミーノに必要なすべて。',
    'features.sos.title':     'リアルタイムの安全',
    'features.sos.desc':      'つながったコミュニティの保護を感じてください。スマートSOSで緊急事態を知らせ、近くの巡礼者を即座に動員できます。',
    'features.weather.title': '道の天気',
    'features.weather.desc':  '正確な位置の気象警報。最初の雨粒が落ちる前に身を守るタイミングを知りましょう。',
    'features.terrain.title': '地形を制覇',
    'features.terrain.desc':  '高度グラフとステージの進捗でベテランのようにエネルギーを管理。',
    'features.legacy.title':  '旅を永遠に',
    'features.legacy.desc':   '各ステージでデジタルスタンプを集め、サンティアゴに到着したら思い出をコレクターズフォトブックに変えましょう。',
    'features.stamps.title':  'スタンプと達成',
    'features.stamps.desc':   'カミーノでの公式な進歩を記録。各ステージのQRコードをスキャンして通過を確認し、デジタル巡礼手帳を完成させましょう。',
    'features.guide.title':   '必需品ガイド',
    'features.guide.desc':    '歩きながら泉、休憩ポイント、オープン中の宿を見つけましょう。必需品は常に手元に。',
    'features.camera.title':  '道のカメラ',
    'features.camera.desc':   '旅の本質を捉えましょう。統合カメラで写真をステージと場所ごとに自動整理。',

    'journey.title':          '目的地を選ぼう。',
    'journey.label.start':    '出発地',
    'journey.label.dist':     '距離',
    'journey.label.stages':   'ステージ',
    'journey.tag.frances':           'ピレネーの王道',
    'journey.tag.portugues.central': 'サンティアゴの遺産',
    'journey.tag.portugues.lisboa':  '大いなる巡礼',
    'journey.tag.portugues.costa':   '大西洋の音',
    'journey.tag.interior':          '村の道',
    'journey.tag.primitivo':         '原初のルート',
    'journey.tag.norte':             '海の道',
    'journey.tag.ingles':            '海上ルート',
    'journey.tag.aragones':          'アラゴンの足跡をたどって',
    'journey.tag.plata':             '南の巨人',
    'journey.tag.sanabres':          'ガリシアへの接続',
    'journey.tag.inverno':           '火と雪のルート',

    'book.title':   '思い出を永遠に。',
    'book.phrase1': 'すべての一歩、すべての沈黙、すべての勝利。',
    'book.phrase2': '最初のkmから最後のスタンプまで。',
    'book.phrase3': 'あなたの写真。あなたの物語。あなたの本。',
    'book.phrase4': '記憶より長く残るもの。',
    'book.phrase5': 'あなたのカミーノから生まれたアート。',
    'book.cta':     '思い出の本を注文する',
  },

  'ko': {
    'hero.title':   '당신의 여정은\n영원히 기억될 자격이 있습니다.',
    'hero.cta':     '카미노 시작하기',

    'modal.tagline': 'Peregrino App',
    'modal.title':   '당신의 여정은 여기서 시작됩니다.',
    'modal.ios':     'iOS로 다운로드',
    'modal.android': 'Android로 다운로드',
    'modal.qr':      '카메라를 향해 스마트폰으로 직접 다운로드하세요.',

    'features.eyebrow':       '완전한 경험',
    'features.title':         '카미노에 필요한 모든 것.',
    'features.sos.title':     '실시간 안전',
    'features.sos.desc':      '연결된 커뮤니티의 보호를 느껴보세요. 스마트 SOS로 긴급 상황을 알리고 주변 순례자를 즉시 동원할 수 있습니다.',
    'features.weather.title': '길의 날씨',
    'features.weather.desc':  '정확한 위치의 기상 경보. 첫 빗방울이 떨어지기 전에 보호할 때를 알 수 있습니다.',
    'features.terrain.title': '지형 정복',
    'features.terrain.desc':  '고도 차트와 구간 진행 상황으로 베테랑처럼 에너지를 관리하세요.',
    'features.legacy.title':  '여정을 영원히',
    'features.legacy.desc':   '각 구간에서 디지털 스탬프를 모으고 산티아고에 도착하면 추억을 수집가용 사진집으로 만들어보세요.',
    'features.stamps.title':  '스탬프와 성취',
    'features.stamps.desc':   '카미노에서 공식 진행 상황을 기록하세요. 각 구간의 QR 코드를 스캔해 통과를 확인하고 디지털 순례자 여권을 완성하세요.',
    'features.guide.title':   '필수품 가이드',
    'features.guide.desc':    '걷는 동안 샘, 휴식 지점, 열린 숙소를 찾아보세요. 필수품은 항상 손 가까이에.',
    'features.camera.title':  '길의 카메라',
    'features.camera.desc':   '여정의 본질을 포착하세요. 통합 카메라로 사진을 구간과 위치별로 자동 정리합니다.',

    'journey.title':          '목적지를 선택하세요.',
    'journey.label.start':    '출발지',
    'journey.label.dist':     '거리',
    'journey.label.stages':   '구간',
    'journey.tag.frances':           '피레네의 클래식',
    'journey.tag.portugues.central': '산티아고의 유산',
    'journey.tag.portugues.lisboa':  '위대한 순례',
    'journey.tag.portugues.costa':   '대서양의 소리',
    'journey.tag.interior':          '마을의 길',
    'journey.tag.primitivo':         '원래의 루트',
    'journey.tag.norte':             '바다의 길',
    'journey.tag.ingles':            '해양 루트',
    'journey.tag.aragones':          '아라곤의 발자취를 따라',
    'journey.tag.plata':             '남쪽의 거인',
    'journey.tag.sanabres':          '갈리시아 연결',
    'journey.tag.inverno':           '불과 눈의 루트',

    'book.title':   '추억을 영원히.',
    'book.phrase1': '모든 발걸음, 모든 침묵, 모든 승리.',
    'book.phrase2': '첫 km부터 마지막 스탬프까지.',
    'book.phrase3': '당신의 사진. 당신의 이야기. 당신의 책.',
    'book.phrase4': '기억보다 오래 남는 물건.',
    'book.phrase5': '당신의 카미노로 만든 예술.',
    'book.cta':     '추억 책 주문하기',
  },

  'zh-CN': {
    'hero.title':   '您的朝圣之旅，\n值得永恒留存。',
    'hero.cta':     '开始卡米诺',

    'modal.tagline': 'Peregrino App',
    'modal.title':   '您的旅程从这里开始。',
    'modal.ios':     '下载 iOS 版',
    'modal.android': '下载 Android 版',
    'modal.qr':      '将相机对准即可直接下载到手机。',

    'features.eyebrow':       '完整体验',
    'features.title':         '您的卡米诺之旅所需的一切。',
    'features.sos.title':     '实时安全保障',
    'features.sos.desc':      '感受联网社区的保护。智能SOS让您发出紧急信号，立即调动周围的朝圣者。',
    'features.weather.title': '路径天气',
    'features.weather.desc':  '您所在位置的精确天气预警。在第一滴雨落下之前，知道何时寻求庇护。',
    'features.terrain.title': '征服地形',
    'features.terrain.desc':  '海拔图表和阶段进度，像老手一样管理体力。',
    'features.legacy.title':  '永存您的旅程',
    'features.legacy.desc':   '在每个阶段收集数字印章，抵达圣地亚哥后，将您的回忆转化为专属收藏级照片书。',
    'features.stamps.title':  '印章与成就',
    'features.stamps.desc':   '记录您在卡米诺上的官方进度。扫描每个阶段的二维码验证通过，完成您的数字朝圣者证书。',
    'features.guide.title':   '必需品指南',
    'features.guide.desc':    '边走边找泉水、休息点和开放的旅舍。必需品随时触手可及。',
    'features.camera.title':  '路径相机',
    'features.camera.desc':   '捕捉旅程的精髓。使用我们的集成相机，按阶段和位置自动整理您的照片。',

    'journey.title':          '选择您的目的地。',
    'journey.label.start':    '出发地',
    'journey.label.dist':     '距离',
    'journey.label.stages':   '阶段',
    'journey.tag.frances':           '比利牛斯经典之路',
    'journey.tag.portugues.central': '圣地亚哥的传承',
    'journey.tag.portugues.lisboa':  '伟大的朝圣',
    'journey.tag.portugues.costa':   '大西洋之声',
    'journey.tag.interior':          '村庄之路',
    'journey.tag.primitivo':         '原始路线',
    'journey.tag.norte':             '海洋之路',
    'journey.tag.ingles':            '海上路线',
    'journey.tag.aragones':          '追寻阿拉贡的足迹',
    'journey.tag.plata':             '南方的巨人',
    'journey.tag.sanabres':          '加利西亚连线',
    'journey.tag.inverno':           '火与雪之路',

    'book.title':   '让回忆永存。',
    'book.phrase1': '每一步，每一刻沉默，每一份成就。',
    'book.phrase2': '从第一公里到最后一枚印章。',
    'book.phrase3': '您的照片。您的故事。您的书。',
    'book.phrase4': '比记忆更持久的物品。',
    'book.phrase5': '用您的卡米诺创作的艺术。',
    'book.cta':     '订购我的回忆录',
  },
};

// ─── Detecção de idioma ───────────────────────────────────────────────────────

function detectLang(): LangCode {
  // 1) URL param: ?lang=es
  try {
    const p = new URLSearchParams(window.location.search).get('lang') as LangCode | null;
    if (p && translations[p]) return p;
  } catch { /* SSR guard */ }

  // 2) localStorage (mesma chave do app)
  try {
    const s = localStorage.getItem(LS_KEY) as LangCode | null;
    if (s && translations[s]) return s;
  } catch { /* private mode */ }

  // 3) navigator.language
  const preferred = (typeof navigator !== 'undefined')
    ? (navigator.languages?.length ? [...navigator.languages] : [navigator.language])
    : ['pt-BR'];

  for (const lang of preferred) {
    const c = lang.toLowerCase();
    if (c.startsWith('pt-br')) return 'pt-BR';
    if (c.startsWith('pt'))    return 'pt-PT';
    if (c.startsWith('es'))    return 'es';
    if (c.startsWith('de'))    return 'de';
    if (c.startsWith('it'))    return 'it';
    if (c.startsWith('fr'))    return 'fr';
    if (c.startsWith('ja'))    return 'ja';
    if (c.startsWith('ko'))    return 'ko';
    if (c.startsWith('zh'))    return 'zh-CN';
    if (c.startsWith('en'))    return 'en';
  }

  return 'pt-BR';
}

function loadCJKFont() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('cjk-font')) return;
  const link = document.createElement('link');
  link.id   = 'cjk-font';
  link.rel  = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Sans+KR:wght@400;700&family=Noto+Sans+SC:wght@400;700&display=swap';
  document.head.appendChild(link);
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface I18nCtx {
  t: (key: string) => string;
  lang: LangCode;
  setLang: (l: LangCode) => void;
  isCJK: boolean;
}

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(detectLang);

  const setLang = (newLang: LangCode) => {
    setLangState(newLang);
    try { localStorage.setItem(LS_KEY, newLang); } catch { /**/ }
    if (CJK.includes(newLang)) loadCJKFont();
  };

  const t = (key: string): string =>
    translations[lang]?.[key] ?? translations['pt-BR'][key] ?? key;

  const isCJK = CJK.includes(lang);

  if (isCJK) loadCJKFont();

  return React.createElement(I18nContext.Provider, { value: { t, lang, setLang, isCJK } }, children);
}

export function useT(): I18nCtx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be inside I18nProvider');
  return ctx;
}
