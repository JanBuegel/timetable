document.addEventListener('DOMContentLoaded', () => {
  console.log('Timetable page loaded');

  const filterButton = document.querySelector('.filter-button');
  const resetButton = document.querySelector('.reset-button');
  const favoriteToggleButton = document.querySelector('.favorite-toggle');
  const modal = document.querySelector('.modal');
  const closeButton = document.querySelector('.close-button');
  const stageList = document.querySelector('.stage-list');
  const dayButtons = document.querySelectorAll('.day-button');
  const searchInput = document.querySelector('#searchInput');
  const favoriteButtons = document.querySelectorAll('.favorite-button');
  
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let showFavorites = false;

  filterButton.addEventListener('click', () => {
    fetch('/stages')
      .then(response => response.json())
      .then(stages => {
        stageList.innerHTML = '';

        // Add "alle Bühnen" option
        const allStagesLi = document.createElement('li');
        allStagesLi.textContent = 'Alle Bühnen';
        allStagesLi.classList.add('stage-item');
        allStagesLi.addEventListener('click', () => {
          filterByStage('');
          modal.classList.add('hidden');
        });
        stageList.appendChild(allStagesLi);

        stages.forEach(stage => {
          const li = document.createElement('li');
          li.textContent = stage;
          li.classList.add('stage-item');
          li.addEventListener('click', () => {
            filterByStage(stage);
            modal.classList.add('hidden');
          });
          stageList.appendChild(li);
        });
        modal.classList.remove('hidden');
      });
  });

  closeButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  });

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      searchEvents(searchTerm);
      resetButton.classList.remove('hidden');
    } else {
      resetSearch();
      resetButton.classList.add('hidden');
    }
  });

  resetButton.addEventListener('click', () => {
    resetSearch();
    resetButton.classList.add('hidden');
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
      resetButton.classList.remove('hidden');
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
    if (found) resetButton.classList.remove('hidden');
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
    if (found) resetButton.classList.remove('hidden');
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
});
