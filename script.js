// ------------- Price calculator module (Module Pattern for encapsulation)

const PriceCalculator = (function() {
  'use strict'; 
 
  // Privat spase, inaccessible from outside

  
  // Current quantities for each character type (private) 
  const quantities = {
    people: 1,
    animals: 1,
    monsters: 1
  };
  
  // Cache for DOM elements to avoid repeated queries, efficiency, better performance (@private)
  const domCache = {};
  
  // Privat utility fuctions 

  
  // Caches and returns DOM-elements by ID, reduces repetitive "getElementById" calls (private)   
  function getElement(id) {
    if (!domCache[id]) {
      domCache[id] = document.getElementById(id);
    }
    return domCache[id];
  }
  
  /** Update of an images' source and visibility ( private )
   * as an input function recieves:
   * elementId - Image element ID (string)
   * src - Image source path (string)
   * show - Whether to display the image (boolean)
   */
  function updateImage(elementId, src, show = true) {
    const img = getElement(elementId);
    if (img) {
      img.src = src;
      img.style.display = show ? "block" : "none";
    } else {
      console.warn(`Image element not found: ${elementId}`);
    }
  }
  
  // Hides an image element 
  function hideImage(elementId) {
    const img = getElement(elementId);
    if (img) {
      img.style.display = "none";
    }
  }
  
  // Toggles image visibility   
  function toggleImage(elementId, show) {
    const img = getElement(elementId);
    if (img) {
      img.style.display = show ? "block" : "none";
    }
  }
  
  /** Calculates total price for selected characters
   * Iterates through all character checkboxes and sums their costs
   */
  function calculateCharacterTotal() {
    let total = 0;
    
    // Query all character type checkboxes
    const checkboxes = document.querySelectorAll('.character-type');
    
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const type = checkbox.dataset.type;
        
        // Validate type exists in configuration
        if (CONFIG.PRICES[type] !== undefined) {
          // Formula: quantity × price_per_unit
          total += quantities[type] * CONFIG.PRICES[type];
        }
      }
    });
    
    return total;
  }
  
  // Fetches current background price based on a slider position   
  function getBackgroundPrice() {
    const bgSlider = getElement('background');
    
    if (!bgSlider) {
      console.error('Background slider not found');
      return 0;
    }
    
    // Parse slider value [0, 1, 2]
    const bgValue = parseInt(bgSlider.value, 10);
    
    // Map to background name and get price
    const bgName = CONFIG.BACKGROUND_NAMES[bgValue];
    const price = CONFIG.BACKGROUND_PRICES[bgName.toUpperCase()];
    
    return price || 0;
  }
  
  // Retrieves selected speed delivery price       
  function getSpeedPrice() {
    const speedRadio = document.querySelector('input[name="speed"]:checked');
    
    if (!speedRadio) {
      console.error('No speed option selected');
      return CONFIG.SPEED_PRICES.NORMAL; // Default fallback
    }
    
    return parseInt(speedRadio.value, 10);
  }
  
 
  // Public API (exposed methods), 

  
  return {
    
      // Updates quantity for a specific character type (public)
     // as an input function recieves:
      // type - Character type ('people', 'animals', 'monsters') (string )
      // delta - Change amount (+1 or -1) (number/integer)
    updateQuantity: function(type, delta) {
      try {
        
        // Get the count display element
        const countSpan = getElement(`${type}-count`);
        if (!countSpan) {
          throw new Error(`Count element not found: ${type}-count`);
        }
        
        // Calculate new quantity within valid range [MIN, MAX]
        const currentQty = quantities[type];
        // Enforces min/max bounds via nested functions
        const newQty = Math.min(
          CONFIG.QUANTITIES.MAX, 
          Math.max(CONFIG.QUANTITIES.MIN, currentQty + delta)
        );
        
        // Update internal 
        quantities[type] = newQty;
        
        // Update UI display
        countSpan.innerText = newQty;
        
        // Refresh preview 
        this.updateVisuals();
        
      } catch (error) {
        console.error('Error updating quantity:', error.message);
      }
    },
    
    // Calculates and displays total artwork price ( public )
 
    calculate: function() {
      try {
        // Sum all pricing components
        const characterTotal = calculateCharacterTotal();
        const backgroundPrice = getBackgroundPrice();
        const speedPrice = getSpeedPrice();
        
        const grandTotal = characterTotal + backgroundPrice + speedPrice;
        
        // Display formatted result with 2 decimal places
        const resultElement = getElement('result');
        if (resultElement) {
          resultElement.innerText = `Estimated Price: $${grandTotal.toFixed(2)}`;
        }
        
        // Log calculation breakdown for debugging
        console.log('Price Breakdown:', {
          characters: characterTotal,
          background: backgroundPrice,
          speed: speedPrice,
          total: grandTotal
        });
        
      } catch (error) {
        console.error('Error calculating total:', error.message);
        
        // Display user-friendly error message
        const resultElement = getElement('result');
        if (resultElement) {
          resultElement.innerText = 'Error calculating price. Please try again.';
        }
      }
    },
    
    // Updates all visual preview elements based on current selections
    // Handles background image, character images, and counters

    updateVisuals: function() {
      try {
        let anyCharacterSelected = false;
        
        // Update background image based on slider value
        const bgSlider = getElement('background');
        if (bgSlider) {
          const bgValue = parseInt(bgSlider.value, 10);
          const bgName = CONFIG.BACKGROUND_NAMES[bgValue];
          updateImage('background-img', `${CONFIG.PATHS.PREVIEW}${bgName}.png`, true);
        }
        
        // Update each character type's preview and counter
        CONFIG.VALID_TYPES.forEach(type => {
          const checkbox = document.querySelector(`.character-type[data-type="${type}"]`);
          const isChecked = checkbox?.checked || false;
          
          if (isChecked) {
            anyCharacterSelected = true;
            
            // Show character preview image
            updateImage(
              `${type}-img`, 
              `${CONFIG.PATHS.PREVIEW}${type}.png`, 
              true
            );
            
            // Show quantity counter image
            const count = quantities[type];
            updateImage(
              `${type}-count-img`, 
              `${CONFIG.PATHS.COUNTERS}${type}/${count}.png`, 
              true
            );
          } else {
            // Hide images when character not selected
            hideImage(`${type}-img`);
            hideImage(`${type}-count-img`);
          }
        });
        
        // Show placeholder if no characters selected
        toggleImage('placeholder-img', !anyCharacterSelected);
        
      } catch (error) {
        console.error('Error updating visuals:', error.message);
      }
    },
    
    // Updates background label text based on slider position

    updateBackgroundLabel: function() {
      try {
        const bgSlider = getElement('background');
        const label = getElement('background-label');
        
        if (!bgSlider || !label) {
          throw new Error('Background slider or label not found');
        }
        
        const bgValue = parseInt(bgSlider.value, 10);
        const bgName = CONFIG.BACKGROUND_NAMES[bgValue];
        
        label.innerText = bgName;
        
        // Update preview immediately
        this.updateVisuals();
        
      } catch (error) {
        console.error('Error updating background label:', error.message);
      }
    },
    
    // Sets up all event listeners for interactive elements, e.g. sliders, buttons, checkboxes (Called once during initialization)

    setupEventListeners: function() {
      try {
        // Character checkbox change handlers
        document.querySelectorAll('.character-type').forEach(checkbox => {
          checkbox.addEventListener('change', () => {
            const type = checkbox.dataset.type;
            const qtyDiv = getElement(`${type}-qty`);
            
            if (qtyDiv) {
              // Show/hide quantity controls based on checkbox state
              qtyDiv.style.display = checkbox.checked ? 'inline-block' : 'none';
            }
            
            // Refresh visuals when selection changes
            this.updateVisuals();
          });
        });
        
        // Background slider change handler
        const bgSlider = getElement('background');
        if (bgSlider) {
          bgSlider.addEventListener('input', () => {
            this.updateBackgroundLabel();
          });
        }
        
        console.log('Event listeners successfully initialized');
        
      } catch (error) {
        console.error('Error setting up event listeners:', error.message);
      }
    },
    
    //Initializes the calculator
    // sets up event listeners and initial state
    // called when DOM is ready
    init: function() {
      console.log('Initializing Price Calculator...');
      
      try {
        // Set up all interactive behaviors
        this.setupEventListeners();
        
        // Set initial visual state
        this.updateVisuals();
        this.updateBackgroundLabel();
        
        console.log('Price Calculator initialized successfully');
        
      } catch (error) {
        console.error('Failed to initialize calculator:', error.message);
      }
    }
  };
})();


// - - Navigation Module, handles menu toggle 


// Toggles mobile navigation menu visibility
 // Adds/removes 'active' class to trigger CSS animations

function toggleMenu() {
  const nav = document.getElementById('nav');
  const burger = document.querySelector('.burger');
  
  if (nav && burger) {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
  }
}

// Closes mobile navigation menu
 // Used when user clicks a navigation link

function closeMenu() {
  const nav = document.getElementById('nav');
  const burger = document.querySelector('.burger');
  
  if (nav && burger) {
    nav.classList.remove('active');
    burger.classList.remove('active');
  }
}


// Global functions wrappers (for inline HTML onclick handlers)


// Global wrapper for quantity updates
function updateQty(type, delta) {
  PriceCalculator.updateQuantity(type, delta);
}
