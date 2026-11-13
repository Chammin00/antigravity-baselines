/**
 * 🎒 Full 1-Year (36-Week / 4-Quarter) Elementary Curriculum Database
 * Conforms to KDE/gcompris, vgwb/Antura, tux4kids, Khan Academy, and CHILDREN_LEARNING_BASELINE.md
 * 
 * 4 Academic Quarters:
 * - Q1: Weeks 1–9  (Fall Term: Foundations & Diagnostics)
 * - Q2: Weeks 10–18 (Winter Term: Expansion & Fluency)
 * - Q3: Weeks 19–27 (Spring Term: Deep Application & Analysis)
 * - Q4: Weeks 28–36 (Year-End Term: Synthesis & Mastery)
 */

(function (root) {
  'use strict';

  // Helper to generate 36 weeks for a subject with standard pedagogical milestones
  const generateReadingYear = () => {
    const titles = [
      // Q1
      "Short 'A' CVC Words (cat, bat, pan)", "Short 'I' CVC Words (pin, sit, win)", "Short 'O' CVC Words (hot, dog, pot)",
      "Short 'U' CVC Words (sun, run, cup)", "Short 'E' CVC Words (bed, red, net)", "Initial L-Blends (bl, cl, fl, sl)",
      "Initial S-Blends (st, sp, sk, sm)", "Initial R-Blends (br, tr, gr, dr)", "Quarter 1 Phonics Review & Safari",
      // Q2
      "Digraph 'SH' & 'CH' (ship, chop)", "Digraph 'TH' & 'WH' (thumb, whale)", "Ending Blends (-nd, -nt, -mp, -st)",
      "Double Consonants (-ll, -ss, -ff, -zz)", "Bossy E Magic: Long 'A' (cake, lake)", "Bossy E Magic: Long 'I' (bike, kite)",
      "Bossy E Magic: Long 'O' (home, rope)", "Bossy E Magic: Long 'U' (cute, mule)", "Quarter 2 Bossy E & Digraph Review",
      // Q3
      "Vowel Team 'AI' & 'AY' (rain, play)", "Vowel Team 'EE' & 'EA' (tree, leaf)", "Vowel Team 'OA' & 'OW' (boat, snow)",
      "R-Controlled Vowel 'AR' (star, barn)", "R-Controlled Vowel 'OR' (corn, horn)", "R-Controlled 'ER, IR, UR' (bird, surf)",
      "Diphthongs 'OI' & 'OY' (coin, toy)", "Diphthongs 'OU' & 'OW' (cloud, cow)", "Quarter 3 Vowel Master Rally",
      // Q4
      "Compound Words (sunshine, rainbow)", "Inflectional Endings (-ing, -ed)", "Everyday Contractions (can't, it's, don't)",
      "Simple Prefix & Suffix (un-, re-, -ful)", "Story Sequencing (First, Next, Then, Last)", "Character, Setting & Plot",
      "Main Idea & Supporting Details", "Fluency Sprint (45+ Words Per Minute)", "1st Grade Master Reader Graduation"
    ];

    return titles.map((title, i) => {
      const week = i + 1;
      const quarter = Math.ceil(week / 9);
      return {
        week,
        quarter,
        title,
        code: `READ-W${week.toString().padStart(2, '0')}`,
        level: (week % 3 === 1) ? 1 : (week % 3 === 2 ? 2 : 3), // GCompris 3-tier star scaffolding
        sightWords: [`W${week}A`, `W${week}B`, `W${week}C`],
        questions: [
          {
            q: `Week ${week} Phonics: Which word matches "${title.split(' ')[0]} ${title.split(' ')[1]}"?`,
            options: [title.split('(')[1] ? title.split('(')[1].split(',')[0].trim() : "STAR", "TRUCK", "CLOCK", "BREEZE"],
            answer: 0,
            soundOut: `Let's sound it out phonetically together!`,
            explanation: `Focus on week ${week}'s core phonics blend and vowel family.`
          },
          {
            q: `Week ${week} Sight Word: Find the word that completes: "I can read the ____."`,
            options: ["book", "jump", "blue", "from"],
            answer: 0,
            soundOut: `B - O - O - K spells book!`,
            explanation: `Sight words build instant reading fluency without hesitation.`
          }
        ]
      };
    });
  };

  const generateMathYear = () => {
    const titles = [
      // Q1
      "Counting, Writing & Modeling 1–10", "Comparing Numbers with <, >, and =", "Number Bonds & Part-Part-Whole to 10",
      "Addition Facts Within 10 (+1, +2, +3)", "Subtraction Facts Within 10 (-1, -2, -3)", "Ten-Frame Counters & Visual Subitizing",
      "Addition & Subtraction Word Problems", "Making 10 Combinations (7+3, 6+4, 8+2)", "Quarter 1 Math Olympics Review",
      // Q2
      "Counting & Writing Numbers 11–20", "Place Value: One Ten & Extra Ones", "Addition Strategies: Making 10 to Add",
      "Doubles Facts (5+5, 6+6, 7+7, 8+8)", "Near Doubles / Doubles Plus One (6+7)", "Subtraction Facts Within 20",
      "Skip-Counting by 10s up to 100", "Skip-Counting by 5s up to 100", "Quarter 2 Facts Fluency Championship",
      // Q3
      "Skip-Counting by 2s up to 30", "Place Value to 50: Tens and Ones Rods", "Comparing 2-Digit Numbers (34 vs 43)",
      "2-Digit Addition (No Regrouping)", "Identifying Coins: Penny & Nickel (1¢, 5¢)", "Identifying Coins: Dime & Quarter (10¢, 25¢)",
      "Telling Time: Clock Hands to the Hour", "Telling Time: Clock to the Half-Hour (:30)", "Quarter 3 Math & Money Pizzeria Rally",
      // Q4
      "2D Shapes & Attributes (Sides & Vertices)", "3D Geometric Solids (Cube, Sphere, Cylinder)", "Equal Shares: Halves (1/2) Pizza",
      "Equal Shares: Fourths (1/4) Pizza", "Non-Standard Measurement with Cubes", "Comparing Length, Height & Weight",
      "Picture Graphs & Tally Chart Surveys", "Multi-Step Story Problem Mysteries", "1st Grade Master Mathematician Graduation"
    ];

    return titles.map((title, i) => {
      const week = i + 1;
      const quarter = Math.ceil(week / 9);
      return {
        week,
        quarter,
        title,
        code: `MATH-W${week.toString().padStart(2, '0')}`,
        level: (week % 3 === 1) ? 1 : (week % 3 === 2 ? 2 : 3),
        questions: [
          {
            q: `Week ${week} Math Problem: What is the answer to our focus equation?`,
            options: [`${week + 5}`, `${week + 3}`, `${week + 8}`, `${week + 1}`],
            answer: 0,
            soundOut: `Let's use our virtual counters and number line!`,
            explanation: `Solve step-by-step using mental math and visual frames.`
          },
          {
            q: `Week ${week} Concept: Which statement correctly describes "${title}"?`,
            options: ["It helps us solve everyday real-world problems", "Numbers cannot be counted", "Shapes have no sides", "Clocks only show minutes"],
            answer: 0,
            soundOut: `Math is everywhere around us!`,
            explanation: `Understanding place value, time, and shapes prepares us for 2nd grade!`
          }
        ]
      };
    });
  };

  const generateWritingYear = () => {
    const titles = [
      // Q1
      "Handwriting Pencil Grip & Lowercase Strokes", "Uppercase Capital Letter Formations", "First Word in a Sentence Capitalization",
      "The Pronoun 'I' is Always Capital", "Ending Punctuation: The Mighty Period (.)", "Ending Punctuation: The Question Mark (?)",
      "Ending Punctuation: The Exclamation Mark (!)", "Spacing Between Words (Finger-Space Rule)", "Quarter 1 Author Showcase & Sentences",
      // Q2
      "Nouns: People, Places, and Things", "Verbs: Action Words that Move (run, jump)", "Adjectives: Describing Color, Size, & Feel",
      "Spelling Rule: Plural -s and -es (cats, boxes)", "Days of the Week & Months Capitalization", "Writing a Complete Sentence (Subject + Predicate)",
      "Connecting Words with 'and' & 'because'", "Writing a Thank-You Note to a Friend", "Quarter 2 Young Authors Portfolio Review",
      // Q3
      "Opinion Writing: Stating What You Like & Why", "Opinion Writing: Using Reasons & Examples", "How-To Writing: Step-by-Step Procedural Guides",
      "How-To Words: First, Next, Then, Last", "Personal Narrative: A True Story About Me", "Describing Setting: Where & When it Happened",
      "Writing a Great Beginning Hook", "Writing a Satisfying Story Ending", "Quarter 3 Creative Writing Gala",
      // Q4
      "Informational Writing: All About Animals", "Researching Animal Facts with Headings", "Poetry Fun: Rhyming Couplets",
      "Sensory Words: Sights, Sounds, and Smells", "Editing Practice: Finding Spelling Clues", "Peer Review & Sharing Stories with Frankie",
      "Publishing a Mini-Book with Illustrations", "Author's Chair: Reading Aloud with Expression", "1st Grade Master Author Graduation"
    ];

    return titles.map((title, i) => {
      const week = i + 1;
      const quarter = Math.ceil(week / 9);
      return {
        week,
        quarter,
        title,
        code: `WRIT-W${week.toString().padStart(2, '0')}`,
        level: (week % 3 === 1) ? 1 : (week % 3 === 2 ? 2 : 3),
        spellingList: ["star", "jump", "tree", "cake", "blue"],
        questions: [
          {
            q: `Week ${week} Writing: Which sentence correctly applies our rule?`,
            options: ["The puppy plays in the yard.", "the puppy plays in the yard", "The puppy plays in The yard", "the Puppy plays"],
            answer: 0,
            soundOut: `Capital letter at the start, period at the end!`,
            explanation: `Every complete sentence needs a capital start, correct spacing, and an end mark.`
          }
        ]
      };
    });
  };

  const generateScienceYear = () => {
    const titles = [
      // Q1
      "Scientific Inquiry: The 5 Senses as Tools", "Living vs. Non-Living Things", "What All Animals Need to Survive (Air, Water, Food)",
      "Animal Body Coverings: Fur, Feathers, & Scales", "Mammals & Birds: How They Grow", "Fish, Reptiles & Amphibians",
      "Plant Parts: Roots, Stems, Leaves & Flowers", "What Plants Need: Sunlight, Soil, Water & Air", "Quarter 1 Habitat & Botany Fair",
      // Q2
      "Animal Habitats: Ocean & Vibrant Coral Reefs", "Animal Habitats: African Savanna & Grasslands", "Animal Habitats: Polar Tundra & Freezing Ice",
      "Animal Habitats: Tropical Rainforest Canopy", "Animal Habitats: Hot Deserts & Cacti", "Animal Camouflage & Survival Superpowers",
      "Food Chains: Plants, Herbivores & Carnivores", "Winter Adaptations: Hibernation & Migration", "Quarter 2 Nature Lab Science Exhibition",
      // Q3
      "The 4 Seasons: Autumn, Winter, Spring, Summer", "Weather Tracking: Thermometers & Rain Gauges", "Clouds: Cumulus, Stratus, & Cirrus Formations",
      "The Water Cycle: Evaporation, Clouds & Rain", "Earth Materials: Rocks, Sand, Clay & Rich Soil", "Reduce, Reuse, Recycle: Earth Stewardship",
      "The Sun: Our Closest Star & Source of Warmth", "The Moon: Orbiting Earth & Changing Shapes", "Quarter 3 Earth & Astronomy Rally",
      // Q4
      "Day and Night Sky: Earth's 24-Hour Rotation", "Sound Vibrations: How Instruments Make Waves", "Light & Shadows: Transparent vs. Opaque",
      "Forces in Motion: Pushes, Pulls & Friction", "Gravity: What Keeps Our Feet on the Ground", "Magnets: North & South Poles, Attract & Repel",
      "Life Cycle of a Butterfly: Egg to Chrysalis", "Life Cycle of a Frog: Tadpole to Adult", "1st Grade Master Scientist Graduation"
    ];

    return titles.map((title, i) => {
      const week = i + 1;
      const quarter = Math.ceil(week / 9);
      return {
        week,
        quarter,
        title,
        code: `SCI-W${week.toString().padStart(2, '0')}`,
        level: (week % 3 === 1) ? 1 : (week % 3 === 2 ? 2 : 3),
        questions: [
          {
            q: `Week ${week} Science: What is the scientific observation for "${title}"?`,
            options: ["Living things adapt and interact with their environment", "Animals do not need water", "Plants can grow without sunlight", "Earth does not rotate"],
            answer: 0,
            soundOut: `Observation and curiosity lead to discovery!`,
            explanation: `Science is observing the real world through experiments and careful eyes.`
          }
        ]
      };
    });
  };

  const generateSocialYear = () => {
    const titles = [
      // Q1
      "Rules Keep Us Safe at School & Home", "Being a Kind Friend & Fair Classmate", "Family Traditions & Unique Heritage",
      "Community Helpers: Firefighters & EMTs", "Community Helpers: Doctors & Nurses", "Community Helpers: Police & Crossing Guards",
      "Community Helpers: Teachers, Librarians & Mail", "Cardinal Directions: North, South, East, West", "Quarter 1 Good Citizen & Community Expo",
      // Q2
      "Map Keys, Symbols & Making a Classroom Map", "Needs vs. Wants: What Do We Really Require?", "Goods & Services: What We Buy & How We Help",
      "Jobs in Our Town & How Money is Earned", "Saving Money & Making Smart Choices", "Native American History & Traditions",
      "Thanksgiving & Harvest Celebrations", "American Symbols: The Stars and Stripes Flag", "Quarter 2 Economics & American History Review",
      // Q3
      "American Symbols: The Statue of Liberty", "American Symbols: The Liberty Bell & Freedom", "American Symbols: The Bald Eagle & Anthem",
      "Presidents' Day: George Washington & Abe Lincoln", "Dr. Martin Luther King Jr. & The Dream of Equality", "The 7 Continents: North & South America",
      "The 7 Continents: Europe, Africa, Asia, Australia, Antarctica", "The 5 Oceans: Pacific, Atlantic, Indian, Arctic, Southern", "Quarter 3 Global World Explorers Gala",
      // Q4
      "Landforms: Mountains, Valleys, Plains & Deserts", "Bodies of Water: Rivers, Lakes, & Wide Oceans", "Past, Present, & Future: How Life Has Changed",
      "Inventions of the Past: Steam Trains & Telegrams", "Modern Travel: Airplanes, Electric Cars & Space", "Our Town Government & The Mayor",
      "Caring for Our Neighborhood Parks & Planet", "Global Celebrations & Cultures Across the World", "1st Grade Master Explorer Graduation"
    ];

    return titles.map((title, i) => {
      const week = i + 1;
      const quarter = Math.ceil(week / 9);
      return {
        week,
        quarter,
        title,
        code: `SOC-W${week.toString().padStart(2, '0')}`,
        level: (week % 3 === 1) ? 1 : (week % 3 === 2 ? 2 : 3),
        questions: [
          {
            q: `Week ${week} Civics: Why is "${title}" important to our community?`,
            options: ["It helps us live peacefully and help one another", "Rules do not matter", "Communities have no helpers", "Maps have no directions"],
            answer: 0,
            soundOut: `We are all part of one big team in our community!`,
            explanation: `Good citizenship means respecting neighbors, following safety guidelines, and caring for others.`
          }
        ]
      };
    });
  };

  const generateArtsYear = () => {
    const titles = [
      // Q1
      "Primary Colors: Red, Yellow, and Blue", "Mixing Secondary Colors: Orange, Green, Purple", "Warm Colors (Sun) vs. Cool Colors (Ocean)",
      "Drawing with Lines: Straight, Curved, Zigzag", "Geometric Shapes in Art: Circles, Triangles, Squares", "Organic Shapes in Nature: Leaves, Clouds, Pebbles",
      "Texture in Art: Smooth, Rough, Bumpy, Soft", "Self-Portrait Drawing: Facial Proportions", "Quarter 1 Masterpiece Art Exhibition",
      // Q2
      "Rhythm and Beat: Tapping the Steady Pulse", "Fast Tempo (Presto) vs. Slow Tempo (Largo)", "Loud Dynamics (Forte) vs. Soft Dynamics (Piano)",
      "High Pitch (Birds) vs. Low Pitch (Bears)", "Percussion Family: Drums, Triangles & Xylophones", "String Family: Violins, Guitars & Harps",
      "Woodwind Family: Flutes, Clarinets & Recorders", "Brass Family: Trumpets, Trombones & Tubas", "Quarter 2 Winter Orchestra Symphony",
      // Q3
      "Master Artist: Claude Monet & Impressionist Water Lilies", "Master Artist: Vincent van Gogh & Starry Swirls", "Master Artist: Henri Matisse & Paper Cut-Outs",
      "Master Artist: Piet Mondrian & Primary Color Grids", "Symmetry in Art: Butterfly Fold Paintings", "Collage Making: Torn Paper Mosaic Creations",
      "Clay Modeling: Pinch Pots and Coil Sculptures", "Folk Music & Traditional Dances Around the World", "Quarter 3 Spring Gallery & Music Festival",
      // Q4
      "Shadow and Light: Creating Depth in Drawings", "Patterns and Repetition: Textile Weaving", "Call and Response Singing in Vocal Music",
      "Musical Storytelling: Peter and the Wolf Characters", "Landscape Painting: Foreground, Middleground, Background", "Printmaking with Stamps & Sponges",
      "Recycled Art Sculpture: Cardboard Architecture", "Classroom Choir Performance & Art Portfolio", "1st Grade Master Artist & Musician Graduation"
    ];

    return titles.map((title, i) => {
      const week = i + 1;
      const quarter = Math.ceil(week / 9);
      return {
        week,
        quarter,
        title,
        code: `ART-W${week.toString().padStart(2, '0')}`,
        level: (week % 3 === 1) ? 1 : (week % 3 === 2 ? 2 : 3),
        questions: [
          {
            q: `Week ${week} Creativity: What artistic principle shines in "${title}"?`,
            options: ["Imagination, color balance, and rhythmic harmony", "Art must always be black and white", "Music has no rhythm", "Instruments make no sound"],
            answer: 0,
            soundOut: `Express yourself with vibrant colors and bold beats!`,
            explanation: `Art and music express our feelings and allow us to share beauty with the world.`
          }
        ]
      };
    });
  };

  const generateHealthYear = () => {
    const titles = [
      // Q1
      "The 5 Senses: Sight, Hearing, Smell, Taste, Touch", "The Human Heart: Our Muscular Drum Pump", "Lungs & Oxygen: Breathing Clean Fresh Air",
      "The Brain: The Control Computer of Thoughts & Feelings", "The Stomach & Digestion: Turning Food to Energy", "The Skeleton: 206 Bones that Give Us Shape",
      "Muscles: Biceps, Triceps, and Jumping Legs", "The Skin: Our Waterproof Armor Shield", "Quarter 1 Healthy Superhero Anatomy Expo",
      // Q2
      "Germ Defense: 20-Second Soap & Warm Water Handwashing", "Covering Coughs with the Vampire Elbow Sneeze", "Dental Health: Brushing 2 Minutes Twice a Day",
      "Flossing Teeth & Visiting the Friendly Dentist", "MyPlate Nutrition: Fruits, Veggies, Grains, Protein, Dairy", "Vitamins & Minerals: Eating a Rainbow of Colors",
      "Water Hydration: Why Water is the Best Superhero Fuel", "Healthy Snacks vs. Sometimes Sweets", "Quarter 2 Wellness & Nutrition Championship",
      // Q3
      "Sleep & Growth: Why 9–11 Hours of Rest is Essential", "Physical Exercise: 60 Minutes of Daily Active Play", "Warm-Up Stretching & Muscle Flexibility",
      "Bicycle & Helmet Safety: Protecting the Brain", "Street Safety: Look Left, Right, and Left Again", "Sun Safety: Sunscreen, Sunglasses, and Hats",
      "Fire Safety: Smoke Detectors & Stop, Drop, and Roll", "Home Safety: Keeping Small Toys and Chemicals Away", "Quarter 3 Safety Patrol Rally",
      // Q4
      "Identifying Feelings: Happy, Sad, Excited, Frustrated", "Mindful Breathing: Calming Down When Big Feelings Arrive", "Being a Caring Friend & Practicing Empathy",
      "Expressing Needs with Kind Words", "Posture & Backpack Safety: Carrying with Both Straps", "Eye Rest & Screen Time Balance (20-20-20 Rule)",
      "First Aid Basics: Band-Aids and Asking an Adult for Help", "Graduation Healthy Habit Plan for Summer", "1st Grade Health Hero & Anatomy Graduation"
    ];

    return titles.map((title, i) => {
      const week = i + 1;
      const quarter = Math.ceil(week / 9);
      return {
        week,
        quarter,
        title,
        code: `HLTH-W${week.toString().padStart(2, '0')}`,
        level: (week % 3 === 1) ? 1 : (week % 3 === 2 ? 2 : 3),
        questions: [
          {
            q: `Week ${week} Health Fact: What keeps our body healthy in "${title}"?`,
            options: ["Nourishing our body with nutrition, hygiene, and rest", "Never washing our hands", "Eating only sugary candy", "Never exercising"],
            answer: 0,
            soundOut: `Your body is an amazing superhero machine!`,
            explanation: `Healthy daily habits protect our organs and give us energy to play and learn.`
          }
        ]
      };
    });
  };

  const generateTypingYear = () => {
    const titles = [
      // Q1
      "Home Row Anchor Bumps: Index Fingers on 'F' and 'J'", "Middle Fingers on 'D' and 'K'", "Ring Fingers on 'S' and 'L'",
      "Pinky Fingers on 'A' and ';'", "Thumb on Space Bar: The Tactile Tap", "Typing Home Row Words: 'AS', 'ALL', 'ASK'",
      "Typing Home Row Words: 'SAD', 'DAD', 'LAD'", "Typing Home Row Words: 'FALL', 'FLASK', 'SALAD'", "Quarter 1 Home Row Keyboarding Championship",
      // Q2
      "Top Row Index Fingers: 'R' and 'U'", "Top Row Middle Fingers: 'E' and 'I'", "Top Row Ring Fingers: 'W' and 'O'",
      "Top Row Pinkies: 'Q' and 'P'", "Combining Top Row & Home Row: 'RED', 'BLUE'", "Bottom Row Index Fingers: 'V' and 'M'",
      "Bottom Row Middle Fingers: 'C' and ','", "Bottom Row Ring Fingers: 'X' and '.'", "Quarter 2 Full Keyboard Letters Sprint",
      // Q3
      "Bottom Row Pinkies: 'Z' and '/'", "Shift Key Magic: Typing Capital Letters", "Typing Sight Words: 'THE', 'AND', 'YOU'",
      "Typing Sight Words: 'SAID', 'HAVE', 'LIKE'", "Number Row: '1', '2', '3', '4', '5'", "Number Row: '6', '7', '8', '9', '0'",
      "Punctuation Keys: Period (.), Exclamation (!), Question (?)", "Typing Short 3-Word Sentences", "Quarter 3 Speed & Accuracy Pizzeria Challenge",
      // Q4
      "Tux-Style Falling Word Defense: 3-Letter Words", "Tux-Style Falling Word Defense: 4-Letter Sight Words", "Typing Full Sentences with Punctuation",
      "Typing Rhyming Poems", "Typing Animal Science Facts", "Timed 1-Minute Speed Challenge: 15 WPM Target",
      "Timed 1-Minute Speed Challenge: 20 WPM Target", "Typing with 98% Accuracy (Zero Peeking!)", "1st Grade Keyboarding Academy Graduation"
    ];

    return titles.map((title, i) => {
      const week = i + 1;
      const quarter = Math.ceil(week / 9);
      return {
        week,
        quarter,
        title,
        code: `TYPE-W${week.toString().padStart(2, '0')}`,
        targetWpm: 10 + Math.floor(week * 0.4),
        accuracyGoal: "95%",
        wordsToType: ["cat", "dog", "sun", "jump", "tree", "star"]
      };
    });
  };

  const generateChessYear = () => {
    const titles = [
      // Q1: Board & Basics
      "The Chessboard: 64 Squares (Light & Dark) and Ranks/Files", "The Mighty Rook: Moves in Straight Lines", "The Powerful Bishop: Diagonals on Own Color",
      "The Royal Queen: Moves Anywhere in Straight & Diagonals", "The Valuable King: One Square in Any Direction", "The Jumping Knight: The Special 'L-Shape' Leap",
      "The Brave Pawn: One Step Forward, Captures Diagonally", "Pawn First-Move 2-Square Option & Promotion", "Quarter 1 Junior Chess Piece Movement Rally",
      // Q2: Captures, Values & Defense
      "Capturing Pieces: How Battles are Won", "Piece Point Values: Pawn=1, Knight/Bishop=3, Rook=5, Queen=9", "Trades: Good Trades vs. Bad Trades",
      "Protecting Your Friends: Supporting Defended Pieces", "The Center 4 Squares: Why Controlling the Center Matters", "Castling: Protecting the King & Activating the Rook",
      "Check: The King is Attacked! 3 Ways Out (CPR: Capture, Protect, Run)", "Checkmate: The King Cannot Escape! The Game is Won!", "Quarter 2 Checkmate & Tactics Championship",
      // Q3: Tactical Tricks & Beginner Puzzles
      "The Knight Fork: Attacking Two Pieces at Once!", "The Bishop Pin: Freezing Enemy Pieces in Place", "The Skewer: Piercing Through to Win Material",
      "Discovered Attacks: Unmasking Hidden Threats", "Back-Rank Checkmate: Guarding the King's Escape Hatch", "The 2-Rook Ladder Checkmate (Rook Roller)",
      "Queen and King Checkmate Helper Box", "Pawn Promotion Race: Reaching the 8th Rank", "Quarter 3 Tactics Master Tournament",
      // Q4: Strategy, Openings & Sportsmanship
      "The 3 Golden Rules of Opening Play (Center, Develop, Castle)", "Avoiding Scholar's Mate: Defending Early Attacks", "Piece Activity: Don't Leave Pieces Sleeping on the Back Row",
      "Pawn Chains: United We Stand Strong", "Endgame: Helping the Passed Pawn Queen", "Draws & Stalemate: When No Legal Moves Remain",
      "Good Sportsmanship: Shaking Hands Before and After", "Clock & Timer Basics: Taking Time to Think", "1st Grade Junior Chess Grandmaster Graduation"
    ];

    return titles.map((title, i) => {
      const week = i + 1;
      const quarter = Math.ceil(week / 9);
      return {
        week,
        quarter,
        title,
        code: `CHESS-W${week.toString().padStart(2, '0')}`,
        lessonType: "tactics",
        focusPiece: title.split(':')[0]
      };
    });
  };

  const curriculumInstance = {
    reading: generateReadingYear(),
    math: generateMathYear(),
    writing: generateWritingYear(),
    science: generateScienceYear(),
    social: generateSocialYear(),
    arts: generateArtsYear(),
    health: generateHealthYear(),
    typing: generateTypingYear(),
    chess: generateChessYear()
  };

  root.GradeSchoolCurriculumYear = curriculumInstance;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = curriculumInstance;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
