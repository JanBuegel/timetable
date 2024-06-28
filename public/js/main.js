document.addEventListener('DOMContentLoaded', () => {
  console.log('Timetable page loaded');

  const filterButton = document.querySelector('.filter-button');
  const resetButton = document.querySelector('.reset-button');
  const favoriteToggleButton = document.querySelector('.favorite-toggle');
  const filterModal = document.getElementById('filter-modal');
  const closeButton = document.querySelector('#filter-modal .close-button');
  const stageList = document.querySelector('.stage-list');
  const dayButtons = document.querySelectorAll('.day-button');
  const searchInput = document.querySelector('#searchInput');
  const favoriteButtons = document.querySelectorAll('.favorite-button');
  const welcomeModal = document.getElementById('welcome-modal');

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let showFavorites = false;
  let filtersActive = false;

  function updateResetButton() {
    if (filtersActive || searchInput.value) {
      resetButton.classList.remove('hidden');
    } else {
      resetButton.classList.add('hidden');
    }
  }

  if (!localStorage.getItem('welcomeModalSeen')) {
    welcomeModal.style.display = 'flex';
  }

  window.closeWelcomeModal = function() {
    welcomeModal.style.display = 'none';
    localStorage.setItem('welcomeModalSeen', 'true');
  };

  document.querySelector('#welcome-modal button').addEventListener('click', closeWelcomeModal);

  filterButton.addEventListener('click', () => {
    fetch('/stages')
      .then(response => response.json())
      .then(stages => {
        stageList.innerHTML = '';

        const allStagesLi = document.createElement('li');
        allStagesLi.className = 'stage-item';
        allStagesLi.textContent = 'Alle Bühnen';
        allStagesLi.addEventListener('click', () => {
          filterByStage('');
          filterModal.style.display = 'none';
        });
        stageList.appendChild(allStagesLi);

        stages.forEach(stage => {
          const li = document.createElement('li');
          li.className = 'stage-item';
          li.textContent = stage;
          li.addEventListener('click', () => {
            filterByStage(stage);
            filterModal.style.display = 'none';
          });
          stageList.appendChild(li);
        });
        filterModal.style.display = 'flex';
      });
  });

  closeButton.addEventListener('click', () => {
    filterModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === filterModal) {
      filterModal.style.display = 'none';
    }
  });

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      searchEvents(searchTerm);
      filtersActive = true;
    } else {
      resetSearch();
      filtersActive = false;
    }
    updateResetButton();
  });

  resetButton.addEventListener('click', () => {
    resetSearch();
    filtersActive = false;
    updateResetButton();
    searchInput.value = '';
  });

  favoriteToggleButton.addEventListener('click', () => {
    showFavorites = !showFavorites;
    if (showFavorites) {
      displayFavorites();
      favoriteToggleButton.classList.add('active');
    } else {
      resetSearch();
      favoriteToggleButton.classList.remove('active');
    }
    updateResetButton();
  });

  favoriteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const eventId = button.closest('.event').dataset.id;
      toggleFavorite(eventId, button);
    });
  });

  dayButtons.forEach(button => {
    button.addEventListener('click', () => {
      const day = button.getAttribute('data-day');
      filterByDay(day);
      filtersActive = true;
      updateResetButton();
    });
  });

  function filterByStage(stage) {
    const events = document.querySelectorAll('.event');
    let found = false;
    events.forEach(event => {
      const eventStage = event.querySelector('.event-info p:nth-child(3)').textContent.trim();
      if (!stage || stage.toLowerCase() === 'alle bühnen' || eventStage.toLowerCase() === stage.toLowerCase()) {
        event.style.display = 'flex';
        found = true;
      } else {
        event.style.display = 'none';
      }
    });
    filtersActive = found;
    updateResetButton();
  }

  function searchEvents(term) {
    const events = document.querySelectorAll('.event');
    let found = false;
    events.forEach(event => {
      const eventName = event.querySelector('.event-info h2').textContent.toLowerCase();
      if (eventName.includes(term)) {
        event.style.display = 'flex';
        found = true;
      } else {
        event.style.display = 'none';
      }
    });
    filtersActive = found;
    updateResetButton();
  }

  function filterByDay(day) {
    const eventGroups = document.querySelectorAll('.event-group');
    eventGroups.forEach(group => {
      const groupDay = group.getAttribute('data-day');
      if (groupDay === day) {
        group.style.display = 'block';
      } else {
        group.style.display = 'none';
      }
    });
    filtersActive = true;
    updateResetButton();
  }

  function resetSearch() {
    const events = document.querySelectorAll('.event');
    events.forEach(event => {
      event.style.display = 'flex';
    });
    const eventGroups = document.querySelectorAll('.event-group');
    eventGroups.forEach(group => {
      group.style.display = 'block';
    });
    filtersActive = false;
    updateResetButton();
  }

  function toggleFavorite(eventId, button) {
    if (favorites.includes(eventId)) {
      favorites = favorites.filter(id => id !== eventId);
      button.querySelector('span').textContent = 'favorite_border';
      button.classList.remove('active');
    } else {
      favorites.push(eventId);
      button.querySelector('span').textContent = 'favorite';
      button.classList.add('active');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  function displayFavorites() {
    const events = document.querySelectorAll('.event');
    events.forEach(event => {
      const eventId = event.dataset.id;
      if (favorites.includes(eventId)) {
        event.style.display = 'flex';
      } else {
        event.style.display = 'none';
      }
    });
  }

  function initializeFavorites() {
    favorites.forEach(eventId => {
      const event = document.querySelector(`.event[data-id="${eventId}"]`);
      if (event) {
        event.querySelector('.favorite-button span').textContent = 'favorite';
        event.querySelector('.favorite-button').classList.add('active');
      }
    });
  }

  initializeFavorites();
  updateResetButton();
});
