
  const prices = {
    people: 1,
    animals: 0.75,
    monsters: 1.75
  };

  const counts = {
    people: 1,
    animals: 1,
    monsters: 1
  };

  document.querySelectorAll('.character-type').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const type = this.dataset.type;
      const qtyDiv = document.getElementById(`${type}-qty`);
      qtyDiv.style.display = this.checked ? 'inline-block' : 'none';

      updateVisuals();
      updateCounter();
    });
  });


  function updateQty(type, delta) {
    const countSpan = document.getElementById(`${type}-count`);
    let count = counts[type];
    count = Math.min(10, Math.max(1, count + delta));
    counts[type] = count;
    countSpan.innerText = count;

    updateVisuals();
    updateCounter();
  }

  function updateBackgroundLabel() {
    const label = document.getElementById('background-label');
    const val = parseInt(document.getElementById('background').value);
    label.innerText = val === 0 ? 'Monochrome' : val === 1 ? 'Simple' : 'Detailed';

    updateVisuals();
  }

  function calculateTotal() {
    let total = 0;
    document.querySelectorAll('.character-type').forEach(cb => {
      if (cb.checked) {
        const type = cb.dataset.type;
        total += counts[type] * prices[type];
      }
    });

    const bgVal = parseInt(document.getElementById('background').value);
    const backgroundPrice = [0, 1, 5][bgVal];

    const speedVal = parseInt(document.querySelector('input[name="speed"]:checked').value);

    total += backgroundPrice + speedVal;

    document.getElementById('result').innerText = `Estimated Price: $${total.toFixed(2)}`;
  }

  function updateVisuals() {
    const types = ["people", "animals", "monsters"];
    let anyCharacterSelected = false;

    // Фон
    const bgVal = parseInt(document.getElementById('background').value);
    const bgNames = ["Monochrome", "Simple", "Detailed"];
    document.getElementById("background-img").src = `./static/images/preview/${bgNames[bgVal]}.png`;

    types.forEach(type => {
      const checkbox = document.querySelector(`.character-type[data-type="${type}"]`);
      const img = document.getElementById(`${type}-img`);

      if (checkbox.checked) {
        anyCharacterSelected = true;
        img.src = `./static/images/preview/${type}.png`;
        img.style.display = "block";
      } else {
        img.style.display = "none";
      }
    });

    // Заглушка (если ни одного персонажа не выбрано)
    document.getElementById("placeholder-img").style.display = anyCharacterSelected ? "none" : "block";
  }

  function updateCounter() {
    const types = ["people", "animals", "monsters"];

    types.forEach(type => {
      const checkbox = document.querySelector(`.character-type[data-type="${type}"]`);
      const counterImg = document.getElementById(`${type}-count-img`);

      if (checkbox.checked) {
        const count = counts[type];
        counterImg.src = `./static/images/counters/${type}/${count}.png`;
        counterImg.style.display = "block";
      } else {
        counterImg.style.display = "none";
      }
    });
  }
