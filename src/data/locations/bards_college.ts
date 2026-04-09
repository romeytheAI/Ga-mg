/**
 * Bard's College Location Module
 * 
 * Region: Solitude
 * 
 * The prestigious Bard's College of Solitude trains the finest musicians,
 * poets, and historians in all of Tamriel.
 */

export interface LocationEvent {
  name: string;
  description: string;
  requirements?: string[];
  rewards: string[];
  risks?: string[];
  effects?: string[];
  outcomes?: string[];
  dialogue?: {
    option: string;
    response: string;
    stat_deltas?: Record<string, number>;
  }[];
}

export interface LocationData {
  id: string;
  name: string;
  region: string;
  description: string;
  activities: string[];
  npcs: string[];
  events: LocationEvent[];
}

export const bards_collegeData: LocationData = {
  id: "bards_college",
  name: "Bard's College",
  region: "Solitude",
  description: "Perched above Solitude's market district, the Bard's College is a center of learning for musicians, poets, and historians. Students practice lute melodies, recite ancient verses, and study the oral traditions of the Elder Scrolls. The Archivist maintains records dating back to the First Era.",
  activities: [
    "Apply for admission",
    "Learn a new song",
    "Study ancient history",
    "Request historical records",
    "Commission a tribute song",
    "Practice performance",
    "Purchase rare sheet music",
    "Attend a concert"
  ],
  npcs: ["archivist", "theodan", "viranne"],
  events: [
    {
      name: "Admission Application",
      description: "Apply to become a student of the college",
      requirements: ["intelligence > 25", "gold > 200"],
      rewards: ["student_status", "college_access"],
      outcomes: ["Accepted as student", "Waitlist", "Rejected - insufficient skill"]
    },
    {
      name: "Song Learning",
      description: "Learn a new song from the college's repertoire",
      requirements: ["gold > 50"],
      rewards: ["new_song", "performance_skill"],
      dialogue: [
        {
          option: "Learn 'The Tale of Symmachus'",
          response: "A classic. You must feel the sorrow of the betrayed king in your voice.",
          stat_deltas: { gold: 50, performance: 10 }
        },
        {
          option: "Learn 'Catherine's Ballad'",
          response: "A romantic favorite. Many a bard has won hearts with this one.",
          stat_deltas: { gold: 50, performance: 10 }
        },
        {
          option: "Request advanced piece",
          response: "Ambitious. This requires great skill. Shall we try?",
          stat_deltas: { gold: 100, performance: 20 }
        }
      ],
      outcomes: ["Mastered the song", "Need more practice", "Teacher impressed"]
    },
    {
      name: "Historical Research",
      description: "Study ancient records in the college archives",
      requirements: [],
      rewards: ["intelligence", "historical_knowledge"],
      dialogue: [
        {
          option: "Research the Deep Ones",
          response: "We have fragmentary accounts... they predate even the Dwemer.",
          stat_deltas: { intelligence: 5 }
        },
        {
          option: "Search Nord ancestry records",
          response: "Your lineage is recorded here. You have strong bloodlines.",
          stat_deltas: { intelligence: 3 }
        },
        {
          option: "Find legend of Dragon Cult",
          response: "The dragons were not always our enemies. This speaks of the time before...",
          stat_deltas: { intelligence: 4 }
        }
      ],
      outcomes: ["Valuable knowledge gained", "Records are incomplete", "Access denied - restricted"]
    },
    {
      name: "Tribute Commission",
      description: "Commission a song celebrating your exploits",
      requirements: ["gold > 200", "fame > 10"],
      rewards: ["reputation", "custom_song"],
      dialogue: [
        {
          option: "Epic ballad of valor",
          response: "We shall compose a saga worthy of your deeds!",
          stat_deltas: { gold: 200, fame: 10 }
        },
        {
          option: "Romantic serenade",
          response: "For a lover? How delightfully dramatic.",
          stat_deltas: { gold: 150, relationship: 10 }
        },
        {
          option: "Satirical take on enemies",
          response: "SpITEful yet entertaining. The nobles will love it.",
          stat_deltas: { gold: 100, fame: 5 }
        }
      ],
      outcomes: ["Song becomes popular", "Adequate composition", "Fails to capture essence"]
    },
    {
      name: "Performance Practice",
      description: "Practice your performance skills at the college",
      requirements: [],
      rewards: ["performance_skill", "confidence"],
      dialogue: [
        {
          option: "Practice in main hall",
          response: "The acoustics here are magnificent. Let your voice resonate!",
          stat_deltas: { performance: 5 }
        },
        {
          option: "Request critique",
          response: "Your technique shows promise, but emotion is lacking.",
          stat_deltas: { performance: 3, willpower: 1 }
        },
        {
          option: "Improvise freely",
          response: "Interesting. The melody takes unexpected turns. Captivating.",
          stat_deltas: { performance: 8 }
        }
      ],
      outcomes: ["Significant improvement", "Modest progress", "Distracted by critique"]
    },
    {
      name: "Sheet Music Purchase",
      description: "Purchase rare or古代sheet music from the college shop",
      requirements: ["gold > 25"],
      rewards: ["rare_sheet_music"],
      dialogue: [
        {
          option: "Dunmer death songs",
          response: "Haunting melodies from Morrowind. Not for the faint of heart.",
          stat_deltas: { gold: 25 }
        },
        {
          option: "Yokudan war chants",
          response: "Powerful rhythms from the deserts. Very rare find.",
          stat_deltas: { gold: 40 }
        },
        {
          option: "Ancient Atmoran hymns",
          response: "These date to the Merethic Era. Invaluable historically.",
          stat_deltas: { gold: 100 }
        }
      ],
      outcomes: ["Excellent purchase", "Satisfied with buy", "Overpriced"]
    },
    {
      name: "Concert Attendance",
      description: "Attend a formal concert at the college",
      requirements: ["gold > 10"],
      rewards: ["mood_boost", "culture"],
      dialogue: [
        {
          option: "Front row seating",
          response: "You'll experience every note up close.",
          stat_deltas: { gold: 20, mood: 15 }
        },
        {
          option: "General admission",
          response: "A fine view and even finer music.",
          stat_deltas: { gold: 10, mood: 10 }
        },
        {
          option: "VIP reception after",
          response: "Meet the performers. They love flattery.",
          stat_deltas: { gold: 35, fame: 2, mood: 20 }
        }
      ],
      outcomes: ["Enchanting performance", "Entertained", "Bored by academic pieces"]
    }
  ],
};

export default bards_collegeData;