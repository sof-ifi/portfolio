// ================= CONFIG =================
const CONFIG = {
  QUANTITIES: {
    MIN: 1,
    MAX: 10
  },
  PRICES: {
    people: 1,
    animals: 0.75,
    monsters: 1.75
  },
  BACKGROUND: {
    NAMES: ["Monochrome", "Simple", "Detailed"],
    PRICES: [0, 1, 5]
  },
  PATHS: {
    PREVIEW: "./static/images/preview/",
    COUNTERS: "./static/images/counters/"
  }
};

// ================= MODULE =================
const PriceCalculator = (function () {
  // ---------- private state ----------
  const counts = {
    people: 1,
    animals: 1,
    monsters: 1
  };

  // ---------- helpers ----------
  function isValidType(type) {
    return Object.keys(CONFIG.PRICES).includes(type);
  }

  function getCheckedCharactersTotal() {
    let total = 0;
    document.querySelectorAll(".character-type").forEach(cb => {
      if (cb.checked) {
        const type = cb.dataset.type;
        total += counts[type] * CONFIG.PRICES[type];
      }
    });
    return total;
  }

  function updateImage(id, src, show = true) {
    const img = document.getElementById(id);
    if (!img) return;
    img.src = src;
    img.style.display = show ? "block" : "none";
  }

  function hideImage(id) {
    const img = document.getElementById(id);
    if (img) img.style.display = "none";
  }

  // ---------- public API ----------
  return {
    /**
     * Updates quantity of selected character
     * @param {string} type
     * @param {number} delta
     */
    updateQty(type, delta) {
      if (!isValidType(type)) {
        console.error(`Invalid type: ${type}`);
        return;
      }

      const countSpan = document.getElementById(`${type}-count`);
      if (!countSpan) {
        console.error(`Element not found: ${type}-count`);
        return;
      }

      counts[type] = Math.min(
        CONFIG.QUANTITIES.MAX,
        Math.max(CONFIG.QUANTITIES.MIN, counts[type] + delta)
      );

      countSpan.innerText = counts[type];
      this.updateVisuals();
      this.calculate();
    },

    updateBackgroundLabel() {
      const bgInput = document.getElementById("background");
      const label = document.getElementById("background-label");

      const val = parseInt(bgInput.value);
      label.innerText = CONFIG.BACKGROUND.NAMES[val];

      this.updateVisuals();
    },

    calculate() {
      let total = getCheckedCharactersTotal();

      const bgVal = parseInt(document.getElementById("background").value);
      total += CONFIG.BACKGROUND.PRICES[bgVal];

      const speedVal = parseInt(
        document.querySelector('input[name="speed"]:checked').value
      );
      total += speedVal;

      document.getElementById("result").innerText =
        `Estimated Price: $${total.toFixed(2)}`;
    },

    updateVisuals() {
      const types = ["people", "animals", "monsters"];
      let anySelected = false;

      // background
      const bgVal = parseInt(document.getElementById("background").value);
      updateImage(
        "background-img",
        `${CONFIG.PATHS.PREVIEW}${CONFIG.BACKGROUND.NAMES[bgVal]}.png`
      );

      // characters + counters
      types.forEach(type => {
        const checkbox = document.querySelector(
          `.character-type[data-type="${type}"]`
        );

        if (checkbox?.checked) {
          anySelected = true;

          updateImage(
            `${type}-img`,
            `${CONFIG.PATHS.PREVIEW}${type}.png`
          );

          updateImage(
            `${type}-count-img`,
            `${CONFIG.PATHS.COUNTERS}${type}/${counts[type]}.png`
          );
        } else {
          hideImage(`${type}-img`);
          hideImage(`${type}-count-img`);
        }
      });

      updateImage("placeholder-img", "", !anySelected);
    },

    init() {
      document.querySelectorAll(".character-type").forEach(cb => {
        cb.addEventListener("change", () => {
          const type = cb.dataset.type;
          const qty = document.getElementById(`${type}-qty`);
          qty.style.display = cb.checked ? "inline-block" : "none";

          this.updateVisuals();
          this.calculate();
        });
      });
    }
  };
})();

// ================= MENU (оставлено как было) =================
function toggleMenu() {
  document.getElementById("nav").classList.toggle("active");
  document.querySelector(".burger").classList.toggle("active");
}

function closeMenu() {
  document.getElementById("nav").classList.remove("active");
  document.querySelector(".burger").classList.remove("active");
}

// ================= INIT =================
PriceCalculator.init();
