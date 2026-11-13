/**
 * 🎒 Grade School Learning Hall: Comprehensive Multi-Subject Curriculum & Games Data Model
 * Conforms to CHILDREN_LEARNING_BASELINE.md, HOW_I_LEARN_BASELINE.md,
 * and integrates directly with G:\My Drive\Antigravity\Projects\1st grade learning\index.html
 */

window.GradeSchoolData = (function () {
  'use strict';

  // 1. Grade Levels Registry
  const gradeLevels = [
    { id: 'k', name: 'Kindergarten', code: 'GR-K', icon: '🌱', description: 'Early letter sounds, counting 1-10, primary shapes' },
    { id: '1st', name: '1st Grade (Flagship)', code: 'GR-1', icon: '🎒', description: 'Phonics blends, addition/subtraction 1-20, animal habitats, typing & junior chess' },
    { id: '2nd', name: '2nd Grade', code: 'GR-2', icon: '🚀', description: 'Reading fluency, 2-digit math, simple machines, community geography' },
    { id: '3rd', name: '3rd Grade', code: 'GR-3', icon: '⭐', description: 'Multiplication intro, chapter books, ecosystems, solar system' },
    { id: '4th', name: '4th Grade', code: 'GR-4', icon: '🏆', description: 'Long division, fractions, state history, electricity' },
    { id: '5th', name: '5th Grade', code: 'GR-5', icon: '🎓', description: 'Decimals, volume, world geography, cells & human biology' }
  ];

  // 2. Core Exhibits (7 Academic Exhibits in Academic Hall + 4 Stations in Gaming Hall)
  const exhibits = [
    // -------------------------------------------------------------
    // SUBJECT 1: Reading & Phonics Safari
    // -------------------------------------------------------------
    {
      id: 1,
      type: 'subject',
      category: 'academic',
      code: 'READ-101',
      roman: 'I',
      title: 'Reading & Phonics Safari',
      subtitle: 'Letter Blends, CVC Words, Sight Words & Story Reader',
      icon: '📖',
      themeColor: '#e11d48',
      accentHex: 0xe11d48,
      wall: 'left',
      position: { x: -3.55, y: 2.15, z: 12.0 },
      standPos: { x: -1.35, y: 1.35, z: 12.0 },
      lookPos: { x: -3.55, y: 2.15, z: 12.0 },
      readinessPct: 92,
      gradeStatus: 'A+ (SUPER READER)',
      focusTopic: 'CVC Rhyming, Sight Words & Silent E',
      frankieQuote: "Woof! Traverse through my magic picture into the Phonics Safari!",
      subHub: {
        id: 'reading',
        name: 'Reading and Phonics Hub',
        desc: 'Alphabet sounds, sight words sprint, and Little Red Hen story reader',
        modes: [
          { id: 'phonics-az', name: 'Alphabet & Phonics Sounds', icon: '🔤', desc: 'Sound out all 26 letters (A is for Apple, B is for Ball)' },
          { id: 'sight-words', name: 'Sight Words Sprint', icon: '🌟', desc: '25 Essential 1st grade sight words with audio sentences' },
          { id: 'story-reader', name: 'Story Reader: The Little Red Hen', icon: '📚', desc: 'Interactive sentence reader with character dialogue' },
          { id: 'syllabus-36', name: '36-Week Reading Syllabus', icon: '📅', desc: 'All 4 Quarters: CVC -> Blends -> Bossy E -> Vowel Teams' }
        ]
      },
      questions: [
        {
          q: "Which word rhymes with 'CAT' and purrs on the mat?",
          options: ["HAT", "DOG", "SUN", "PIG"],
          answer: 0,
          soundOut: "H - A - T spells Hat!",
          explanation: "Hat and Cat both end with the '-at' sound family!"
        },
        {
          q: "What sound does the blend 'SH' make in 'SHIP'?",
          options: ["/sh/ like quiet", "/ch/ like train", "/th/ like thumb", "/wh/ like whale"],
          answer: 0,
          soundOut: "Shhhhh! Like in ship, shell, and shine!",
          explanation: "'S' and 'H' join hands to make the soft quiet /sh/ sound."
        }
      ],
      quickFacts: [
        { label: "Sight Words Mastered", value: "48 / 50" },
        { label: "Phonics Rule", value: "Bossy 'E' makes vowels say their name" },
        { label: "Reading Speed", value: "45 WPM (Grade 1 Target)" }
      ]
    },

    // -------------------------------------------------------------
    // SUBJECT 2: Math & Numbers Pizzeria
    // -------------------------------------------------------------
    {
      id: 2,
      type: 'subject',
      category: 'academic',
      code: 'MATH-102',
      roman: 'II',
      title: 'Math & Numbers Pizzeria',
      subtitle: 'Addition, Subtraction 1-20, Pizza Fractions & Coin Counting',
      icon: '🔢',
      themeColor: '#2563eb',
      accentHex: 0x2563eb,
      wall: 'right',
      position: { x: 3.55, y: 2.15, z: 12.0 },
      standPos: { x: 1.35, y: 1.35, z: 12.0 },
      lookPos: { x: 3.55, y: 2.15, z: 12.0 },
      readinessPct: 88,
      gradeStatus: 'A (MATH WIZARD)',
      focusTopic: 'Making 10, Fractions & Telling Time',
      frankieQuote: "Step through the picture to bake fractions pizza and count coins!",
      subHub: {
        id: 'math',
        name: 'Math & Numbers Pizzeria Hub',
        desc: 'Number line counting, addition facts, fractions pizza, and clocks',
        modes: [
          { id: 'counting', name: 'Counting & Ten-Frames (1–120)', icon: '🔢', desc: 'Visual subitizing and skip counting by 2s, 5s, 10s' },
          { id: 'addition-facts', name: 'Addition & Subtraction (1–20)', icon: '➕', desc: 'Interactive number bond counters and fact families' },
          { id: 'fractions-pizza', name: 'Visual Fractions Pizzeria', icon: '🍕', desc: 'Slice pizzas into halves (1/2) and fourths (1/4)' },
          { id: 'telling-time', name: 'Telling Time Analog Clock', icon: '⏰', desc: 'Interactive hour and minute hand practice (:00 and :30)' },
          { id: 'syllabus-36', name: '36-Week Math Syllabus', icon: '📅', desc: 'All 4 Quarters: Bonds -> Facts to 20 -> Money -> Geometry' }
        ]
      },
      questions: [
        {
          q: "If Frankie has 7 bones and finds 5 more, how many bones does he have in all?",
          options: ["12 bones", "11 bones", "13 bones", "10 bones"],
          answer: 0,
          soundOut: "7 plus 5 equals 12!",
          explanation: "Count on from 7: 8, 9, 10, 11, 12! 7 + 5 = 12."
        },
        {
          q: "A pizza is cut into 2 equal pieces. What do we call one piece?",
          options: ["One Half (1/2)", "One Third (1/3)", "One Quarter (1/4)", "A Whole"],
          answer: 0,
          soundOut: "One out of two equal pieces is one half!",
          explanation: "When you divide anything into 2 equal halves, each part is 1/2!"
        }
      ],
      quickFacts: [
        { label: "Addition Mastery", value: "96% accuracy" },
        { label: "Coins Mastered", value: "Penny, Nickel, Dime, Quarter" },
        { label: "Number Line", value: "Counts forwards and backwards to 120" }
      ]
    },

    // -------------------------------------------------------------
    // SUBJECT 3: Writing & Spelling Workshop
    // -------------------------------------------------------------
    {
      id: 3,
      type: 'subject',
      category: 'academic',
      code: 'WRIT-103',
      roman: 'III',
      title: 'Writing & Spelling Workshop',
      subtitle: 'Sentence Capitalization, Punctuation & 1st Grade Spelling Bee',
      icon: '✏️',
      themeColor: '#059669',
      accentHex: 0x059669,
      wall: 'left',
      position: { x: -3.55, y: 2.15, z: 4.0 },
      standPos: { x: -1.35, y: 1.35, z: 4.0 },
      lookPos: { x: -3.55, y: 2.15, z: 4.0 },
      readinessPct: 90,
      gradeStatus: 'A (STAR AUTHOR)',
      focusTopic: 'Ending Punctuation & Uppercase Rules',
      frankieQuote: "Step inside to write stories with big capital letters and tidy periods!",
      subHub: {
        id: 'writing',
        name: 'Writing & Spelling Workshop Hub',
        desc: 'Letter tracing, sentence building, and weekly spelling bees',
        modes: [
          { id: 'spelling-bee', name: '1st Grade Spelling Bee', icon: '🐝', desc: 'Hear words sounded out and assemble letter tiles' },
          { id: 'sentence-builder', name: 'Sentence Builder Studio', icon: '📝', desc: 'Arrange words into complete sentences with capital start and period' },
          { id: 'handwriting-trace', name: 'Handwriting Letter Tracing', icon: '✏️', desc: 'Stroke orders for uppercase and lowercase letters' },
          { id: 'syllabus-36', name: '36-Week Writing Syllabus', icon: '📅', desc: 'All 4 Quarters: Punctuation -> Nouns/Verbs -> Opinion -> Narrative' }
        ]
      },
      questions: [
        {
          q: "Which sentence is written with correct capitalization and a period?",
          options: [
            "The sunshine is warm.",
            "the sunshine is warm.",
            "The Sunshine is Warm",
            "the Sunshine is warm"
          ],
          answer: 0,
          soundOut: "Capital T at the start and a period at the end!",
          explanation: "Sentences must always begin with an uppercase capital letter and end with a punctuation mark!"
        }
      ],
      quickFacts: [
        { label: "Spelling Accuracy", value: "92%" },
        { label: "Punctuation Rules", value: "Period, Question, Exclamation" },
        { label: "Handwriting Posture", value: "Three-finger tripod grip" }
      ]
    },

    // -------------------------------------------------------------
    // SUBJECT 4: Curious Science & Habitats
    // -------------------------------------------------------------
    {
      id: 4,
      type: 'subject',
      category: 'academic',
      code: 'SCI-104',
      roman: 'IV',
      title: 'Curious Science & Habitats',
      subtitle: 'Animal Adaptations, Plant Growth, Four Seasons & Day/Night Sky',
      icon: '🔬',
      themeColor: '#d97706',
      accentHex: 0xd97706,
      wall: 'right',
      position: { x: 3.55, y: 2.15, z: 4.0 },
      standPos: { x: 1.35, y: 1.35, z: 4.0 },
      lookPos: { x: 3.55, y: 2.15, z: 4.0 },
      readinessPct: 95,
      gradeStatus: 'A+ (JUNIOR SCIENTIST)',
      focusTopic: 'Plant Photosynthesis & Animal Habitats',
      frankieQuote: "Traverse into the Nature Lab! Discover arctic snow, oceans, and monarch butterflies!",
      subHub: {
        id: 'science',
        name: 'Curious Science & Nature Lab Hub',
        desc: 'Animal habitat explorer, plant seed germination, and weather seasons',
        modes: [
          { id: 'habitats', name: 'Animal Habitats Explorer', icon: '🦁', desc: 'Sort animals into Ocean, Savanna, Arctic, and Rainforest' },
          { id: 'plants', name: 'Plant Needs & Life Cycle', icon: '🌱', desc: 'Provide sunlight, soil, and water to grow seedlings' },
          { id: 'weather-sky', name: 'Weather Station & Sky Astronomy', icon: '⛅', desc: 'Track clouds, 4 seasons, and Earth rotation for day & night' },
          { id: 'syllabus-36', name: '36-Week Science Syllabus', icon: '📅', desc: 'All 4 Quarters: Inquiry -> Habitats -> Earth/Seasons -> Forces' }
        ]
      },
      questions: [
        {
          q: "What three things does a green plant need to grow healthy and strong?",
          options: [
            "Sunlight, Water, and Soil",
            "Candy, Juice, and Shade",
            "Rocks, Ice, and Wind",
            "Darkness, Sand, and Salt"
          ],
          answer: 0,
          soundOut: "Plants love the warm sun, rich soil, and fresh water!",
          explanation: "Plants use sunlight, water, and nutrients from soil to make food!"
        }
      ],
      quickFacts: [
        { label: "Habitats Studied", value: "Ocean, Forest, Desert, Arctic" },
        { label: "Life Cycle Focus", value: "Caterpillar to Butterfly Metamorphosis" },
        { label: "Earth Science", value: "4 Seasons: Spring, Summer, Fall, Winter" }
      ]
    },

    // -------------------------------------------------------------
    // SUBJECT 5: Community & World Explorers
    // -------------------------------------------------------------
    {
      id: 5,
      type: 'subject',
      category: 'academic',
      code: 'SOC-105',
      roman: 'V',
      title: 'Community & World Explorers',
      subtitle: 'Neighborhood Helpers, Seven Continents, Maps & American Symbols',
      icon: '🌍',
      themeColor: '#7c3aed',
      accentHex: 0x7c3aed,
      wall: 'left',
      position: { x: -3.55, y: 2.15, z: -4.0 },
      standPos: { x: -1.35, y: 1.35, z: -4.0 },
      lookPos: { x: -3.55, y: 2.15, z: -4.0 },
      readinessPct: 89,
      gradeStatus: 'A (EXPLORER)',
      focusTopic: 'Cardinal Directions (N, S, E, W) & Helpers',
      frankieQuote: "Grab your backpack! Step inside to explore the 7 continents and American heroes!",
      subHub: {
        id: 'social',
        name: 'Community & World Explorers Hub',
        desc: 'Neighborhood helpers, compass rose maps, and national landmarks',
        modes: [
          { id: 'helpers', name: 'Community Helpers Parade', icon: '🚒', desc: 'Firefighters, doctors, police, and mail carriers' },
          { id: 'continents', name: '7 Continents & 5 Oceans Map', icon: '🗺️', desc: 'Interactive world map with animal residents' },
          { id: 'symbols', name: 'American Symbols & Liberty', icon: '🗽', desc: 'Bald Eagle, Liberty Bell, Flag, and White House' },
          { id: 'syllabus-36', name: '36-Week Social Studies Syllabus', icon: '📅', desc: 'All 4 Quarters: Citizenship -> Economics -> Geography -> History' }
        ]
      },
      questions: [
        {
          q: "Which community helper drives a big red truck and helps keep our homes safe from fires?",
          options: ["Firefighter", "Chef", "Pilot", "Gardener"],
          answer: 0,
          soundOut: "Sirens sound! Firefighters are brave community heroes!",
          explanation: "Firefighters extinguish fires, rescue pets and people, and teach us fire safety!"
        }
      ],
      quickFacts: [
        { label: "Continents", value: "7 Continents (North America, Africa, etc.)" },
        { label: "Map Skills", value: "Compass Rose & Map Key Symbols" },
        { label: "Civics", value: "Rules, Sharing & Being a Good Citizen" }
      ]
    },

    // -------------------------------------------------------------
    // SUBJECT 6: Art, Colors & Music Studio
    // -------------------------------------------------------------
    {
      id: 6,
      type: 'subject',
      category: 'academic',
      code: 'ART-106',
      roman: 'VI',
      title: 'Art, Colors & Music Studio',
      subtitle: 'Primary & Secondary Colors, Instrument Families & Rhythm Beats',
      icon: '🎨',
      themeColor: '#db2777',
      accentHex: 0xdb2777,
      wall: 'right',
      position: { x: 3.55, y: 2.15, z: -4.0 },
      standPos: { x: 1.35, y: 1.35, z: -4.0 },
      lookPos: { x: 3.55, y: 2.15, z: -4.0 },
      readinessPct: 94,
      gradeStatus: 'A+ (CREATIVE GENIUS)',
      focusTopic: 'Color Mixing & Musical Families',
      frankieQuote: "Step into the Art Studio! Paint with colors and play the xylophone!",
      subHub: {
        id: 'arts',
        name: 'Art, Colors & Music Studio Hub',
        desc: 'Color wheel alchemy, orchestra instrument families, and master painters',
        modes: [
          { id: 'color-wheel', name: 'Color Wheel Alchemy', icon: '🎨', desc: 'Mix primary colors (Red, Yellow, Blue) to create secondary magic' },
          { id: 'orchestra', name: 'Instrument Families Orchestra', icon: '🎻', desc: 'Hear strings, percussion, brass, and woodwinds' },
          { id: 'master-artists', name: 'Master Artist Gallery', icon: '🖼️', desc: 'Van Gogh Starry Night and Monet Water Lilies' },
          { id: 'syllabus-36', name: '36-Week Arts & Music Syllabus', icon: '📅', desc: 'All 4 Quarters: Elements of Art -> Tempo/Beat -> Masters -> Portfolio' }
        ]
      },
      questions: [
        {
          q: "What color do you get when you mix RED paint with BLUE paint?",
          options: ["PURPLE", "GREEN", "ORANGE", "YELLOW"],
          answer: 0,
          soundOut: "Red and Blue swirl together into gorgeous Purple!",
          explanation: "Red and Blue are primary colors; mixing them creates Purple!"
        }
      ],
      quickFacts: [
        { label: "Primary Colors", value: "Red, Yellow, Blue" },
        { label: "Instrument Families", value: "Strings, Woodwinds, Brass, Percussion" },
        { label: "Creative Projects", value: "Symmetry, Warm/Cool Tones, Clay" }
      ]
    },

    // -------------------------------------------------------------
    // SUBJECT 7: Human Body & Healthy Habits
    // -------------------------------------------------------------
    {
      id: 7,
      type: 'subject',
      category: 'academic',
      code: 'HLTH-107',
      roman: 'VII',
      title: 'Human Body & Healthy Habits',
      subtitle: 'The 5 Senses, Vital Organs, Nutrition Plate & Germ Defense',
      icon: '🫀',
      themeColor: '#0891b2',
      accentHex: 0x0891b2,
      wall: 'left',
      position: { x: -3.55, y: 2.15, z: -12.0 },
      standPos: { x: -1.35, y: 1.35, z: -12.0 },
      lookPos: { x: -3.55, y: 2.15, z: -12.0 },
      readinessPct: 91,
      gradeStatus: 'A (HEALTH HERO)',
      focusTopic: 'The 5 Senses & Heart Pumping',
      frankieQuote: "Traverse into Healthy Hero HQ! Learn how our heart beats and wash those paws!",
      subHub: {
        id: 'health',
        name: 'Human Body & Healthy Heroes Hub',
        desc: 'Interactive 5 senses, heart pumping anatomy, and 20s hygiene scrub',
        modes: [
          { id: 'organs', name: 'Human Body Organs & Skeleton', icon: '🫀', desc: 'Discover how heart, brain, lungs, and 206 bones work' },
          { id: 'senses', name: 'The 5 Senses Exploration', icon: '👂', desc: 'Sight, Hearing, Smell, Taste, and Touch' },
          { id: 'nutrition', name: 'MyPlate Nutrition & Hygiene', icon: '🥗', desc: '20-second handwashing and colorful fruits & vegetables' },
          { id: 'syllabus-36', name: '36-Week Health & Anatomy Syllabus', icon: '📅', desc: 'All 4 Quarters: Organs -> Hygiene/Food -> Safety -> Mindfulness' }
        ]
      },
      questions: [
        {
          q: "Which amazing organ in your chest pumps blood all through your body like a steady drum?",
          options: ["Heart", "Brain", "Lungs", "Stomach"],
          answer: 0,
          soundOut: "Thump-thump! The heart beats around 90 times every minute!",
          explanation: "The heart is a muscular pump that sends oxygen and blood to every toe and fingertip!"
        }
      ],
      quickFacts: [
        { label: "Bones in Body", value: "206 bones in adult skeleton" },
        { label: "The 5 Senses", value: "Sight, Hearing, Smell, Taste, Touch" },
        { label: "Sleep Target", value: "9-11 hours of rest per night" }
      ]
    },

    // =============================================================
    // 🕹️ GAMING HALL: ARCADE & RECREATION WING STATIONS
    // =============================================================
    {
      id: 8,
      type: 'game',
      gameKey: 'typing',
      category: 'gaming-hall',
      code: 'GAME-TYPE',
      roman: 'VIII',
      title: '1st Grade Typing Academy',
      subtitle: 'Home Row Mastery, Sight Word Sprints & Tux-Style Falling Words',
      icon: '⌨️',
      themeColor: '#10b981',
      accentHex: 0x10b981,
      wall: 'left',
      position: { x: -3.55, y: 2.15, z: -25.0 },
      standPos: { x: -1.35, y: 1.35, z: -25.0 },
      lookPos: { x: -3.55, y: 2.15, z: -25.0 },
      readinessPct: 86,
      gradeStatus: 'B+ (RAPID TYPIST)',
      focusTopic: 'Home Row (ASDF JKL;) & Sight Words',
      frankieQuote: "Welcome to the Gaming Hall! Press keys to hear real mechanical clatter!",
      gameDetails: {
        gameType: 'typing',
        currentWPM: 24,
        accuracy: '94%',
        highScore: 1850,
        sampleWords: ["CAT", "DOG", "SUN", "RUN", "JUMP", "STAR", "MILK", "BLUE"]
      },
      quickFacts: [
        { label: "Home Row Anchor", value: "F & J bumps for index fingers" },
        { label: "Grade 1 Speed Goal", value: "15-25 Words Per Minute" },
        { label: "Keypress SFX", value: "Procedural mechanical switch chime" }
      ]
    },

    {
      id: 9,
      type: 'game',
      gameKey: 'chanceinvaders',
      category: 'gaming-hall',
      code: 'GAME-CHANCE',
      roman: 'IX',
      title: 'ChanceInvaders 1978 Arcade',
      subtitle: 'Papa Brad 1978 Space Invaders Replica, Discrete SFX & CRT Glow',
      icon: '👾',
      themeColor: '#8b5cf6',
      accentHex: 0x8b5cf6,
      wall: 'left',
      position: { x: -3.55, y: 2.15, z: -32.0 },
      standPos: { x: -1.35, y: 1.35, z: -32.0 },
      lookPos: { x: -3.55, y: 2.15, z: -32.0 },
      readinessPct: 98,
      gradeStatus: 'S (ARCADE MASTER)',
      focusTopic: 'Reflexes, Angle Trajectory & Bunker Defense',
      frankieQuote: "Insert Coin! Watch the Pepper's Ghost lunar mirror reflect the invaders!",
      gameDetails: {
        gameType: 'arcade',
        cabinetStyle: '1978 Taito Space Invaders Classic',
        highScore: 9940,
        shieldsRemaining: 3
      },
      quickFacts: [
        { label: "Original Year", value: "1978 Taito Masterpiece" },
        { label: "Backdrop Tech", value: "Pepper's Ghost Lunar Reflection" },
        { label: "Audio", value: "4-Tone Marching Bass & Laser Pings" }
      ]
    },

    {
      id: 10,
      type: 'game',
      gameKey: 'chess',
      category: 'gaming-hall',
      code: 'GAME-CHESS',
      roman: 'X',
      title: 'Junior Chess & ChessVault',
      subtitle: 'Knight L-Moves, Pawn Advances & Beginner Strategy Trainer',
      icon: '♟️',
      themeColor: '#eab308',
      accentHex: 0xeab308,
      wall: 'right',
      position: { x: 3.55, y: 2.15, z: -25.0 },
      standPos: { x: 1.35, y: 1.35, z: -25.0 },
      lookPos: { x: 3.55, y: 2.15, z: -25.0 },
      readinessPct: 84,
      gradeStatus: 'B+ (CHESS CADET)',
      focusTopic: 'Knight Hopping & Center Board Control',
      frankieQuote: "Knights can jump right over other pieces! Think two moves ahead, partner!",
      gameDetails: {
        gameType: 'chess',
        rating: 850,
        puzzlesSolved: 14,
        favoritePiece: 'Knight (🐴)'
      },
      quickFacts: [
        { label: "Board Size", value: "64 Squares (8x8 Light & Dark)" },
        { label: "Knight Move", value: "2 squares forward, 1 square turn ('L')" },
        { label: "Pawn Promotion", value: "Reaching 8th rank turns into a Queen!" }
      ]
    },

    {
      id: 11,
      type: 'game',
      gameKey: 'trophy',
      category: 'gaming-hall',
      code: 'GAME-TROPHY',
      roman: 'XI',
      title: 'Frankie Milk Cap Vault & Podium',
      subtitle: '100 Collectible 3D POG Tokens, Star Achievements & Rewards',
      icon: '🏆',
      themeColor: '#f59e0b',
      accentHex: 0xf59e0b,
      wall: 'right',
      position: { x: 3.55, y: 2.15, z: -32.0 },
      standPos: { x: 1.35, y: 1.35, z: -32.0 },
      lookPos: { x: 3.55, y: 2.15, z: -32.0 },
      readinessPct: 100,
      gradeStatus: 'GOLD TROPHY',
      focusTopic: 'Reward Loops & Star Milestones',
      frankieQuote: "Inspect your shiny Milk Caps! Completed subjects earn golden collectible caps!",
      gameDetails: {
        gameType: 'trophy',
        totalCaps: 100,
        unlockedCount: 5
      },
      quickFacts: [
        { label: "Total Milk Caps", value: "100 Unique 3D Collectibles" },
        { label: "Rarity Tiers", value: "Common, Rare, Legendary" },
        { label: "Stars Required", value: "Earned from weekly drills and games" }
      ]
    },

    {
      id: 12,
      type: 'game',
      gameKey: 'wobbly',
      category: 'gaming-hall',
      code: 'GAME-WOBBLY',
      roman: 'XII',
      title: 'Wobbly Life Playroom & Physics Sandbox',
      subtitle: 'Ragdoll Flopping, Super Bouncy Trampoline, Ball Pit & Toy Courier',
      icon: '🎪',
      themeColor: '#f97316',
      accentHex: 0xf97316,
      wall: 'left',
      position: { x: -3.55, y: 2.15, z: -36.0 },
      standPos: { x: -1.35, y: 1.35, z: -36.0 },
      lookPos: { x: -3.55, y: 2.15, z: -36.0 },
      readinessPct: 100,
      gradeStatus: 'S (SANDBOX CHAMPION)',
      focusTopic: 'Forces, Gravity, Ballistic Trajectories & Bounce Physics',
      frankieQuote: "Jump on the super bouncy trampoline and grab delivery pizzas! Physics in action!",
      gameDetails: {
        gameType: 'wobbly',
        playroomUrl: '../wobbly-playroom/index.html',
        trampolineBounceForce: 18.5,
        totalToys: 12,
        activeMiniJobs: ['Pizza Delivery', 'Toy Bowling', 'Go-Kart Racing']
      },
      quickFacts: [
        { label: "Gravity & Bounce", value: "Elastic collisions + spring velocity boosts" },
        { label: "Interactive Toys", value: "Grab [G], Throw [F], Ragdoll Flop [R]" },
        { label: "Direct Playroom Portal", value: "Step onto launch pad or click exhibit to enter" }
      ]
    }
  ];

  // 3. JumpStart Frankie Milk Cap Vault (100 Collectibles Registry)
  const milkCaps = [
    { id: 'cap-01', number: 1, name: 'Frankie the Hero Pup', rarity: 'Legendary', icon: '🐶', stars: 3, quote: "Good dog! You've learned your ABCs and 123s!" },
    { id: 'cap-02', number: 2, name: 'Hooty the Wise Owl', rarity: 'Rare', icon: '🦉', stars: 2, quote: "Reading books gives you wings to fly anywhere!" },
    { id: 'cap-03', number: 3, name: 'Pizza Fractions Chef', rarity: 'Common', icon: '🍕', stars: 1, quote: "Two halves make a whole delicious pie!" },
    { id: 'cap-04', number: 4, name: 'Space Invader Saucer', rarity: 'Rare', icon: '🛸', stars: 2, quote: "Zoom across the starry galaxy with 100 points!" },
    { id: 'cap-05', number: 5, name: 'Golden Chess Knight', rarity: 'Legendary', icon: '♞', stars: 3, quote: "Leaping over obstacles in a clever L-shape!" },
    { id: 'cap-06', number: 6, name: 'Key Whiz Mechanical', rarity: 'Common', icon: '⌨️', stars: 1, quote: "Typing like lightning with fast home row fingers!" },
    { id: 'cap-07', number: 7, name: 'Curious Caterpillar', rarity: 'Common', icon: '🐛', stars: 1, quote: "Spin a chrysalis and emerge as a monarch butterfly!" },
    { id: 'cap-08', number: 8, name: 'Brave Fire Engine', rarity: 'Rare', icon: '🚒', stars: 2, quote: "Always ready to help our community stay safe!" }
  ];

  return {
    gradeLevels,
    exhibits,
    milkCaps
  };
})();
