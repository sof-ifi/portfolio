const CONFIG = {
  // Price configuration for different character types (in $)
  PRICES: {
    people: 1.00,
    animals: 0.75,
    monsters: 1.75
  },
  
  // Quantity limits for characters
  QUANTITIES: {
    MIN: 1,
    MAX: 10
  },
  
  // Background complexity pricing
  BACKGROUND_PRICES: {
    MONOCHROME: 0,
    SIMPLE: 1,
    DETAILED: 5
  },
  
  // Background names mapped to slider values [0, 1, 2]
  BACKGROUND_NAMES: ["Monochrome", "Simple", "Detailed"],
  
  // Speed delivery pricing
  SPEED_PRICES: {
    NORMAL: 1,
    FAST: 5
  },
  
  // Valid character types
  VALID_TYPES: ['people', 'animals', 'monsters'],
  
  // Image paths
  PATHS: {
    PREVIEW: './static/images/preview/',
    COUNTERS: './static/images/counters/',
    PLACEHOLDER: './static/images/preview/add-characters.png'
  }
};

