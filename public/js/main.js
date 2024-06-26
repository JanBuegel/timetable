document.addEventListener('DOMContentLoaded', () => {
    console.log('Timetable page loaded');
  
    const filterButton = document.querySelector('.filter-button');
    const searchButton = document.querySelector('.search-button');
    const modal = document.querySelector('.modal');
    const closeButton = document.querySelector('.close-button');
    const stageList = document.querySelector('.stage-list');
  
    filterButton.addEventListener('click', () => {
      fetch('/stages')
        .then(response => response.json())
        .then(stages => {
          stageList.innerHTML = '';
  
          // Add "alle Bühnen" option
          const allStagesLi = document.createElement('li');
          allStagesLi.textContent = 'Alle Bühnen';
          allStagesLi.addEventListener('click', () => {
            filterByStage('');
            modal.classList.add('hidden');
          });
          stageList.appendChild(allStagesLi);
  
          stages.forEach(stage => {
            const li = document.createElement('li');
            li.textContent = stage;
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
  
    searchButton.addEventListener('click', () => {
      const searchTerm = prompt('Enter search term:');
      if (searchTerm) {
        searchEvents(searchTerm);
      }
    });
  
    function filterByStage(stage) {
      const events = document.querySelectorAll('.event');
      events.forEach(event => {
        const eventStage = event.querySelector('.details p:nth-child(2)').textContent;
        if (!stage || eventStage.toLowerCase() === stage.toLowerCase()) {
          event.style.display = 'flex';
        } else {
          event.style.display = 'none';
        }
      });
    }
  
    function searchEvents(term) {
      const events = document.querySelectorAll('.event');
      events.forEach(event => {
        const eventName = event.querySelector('.details h2').textContent;
        if (eventName.toLowerCase().includes(term.toLowerCase())) {
          event.style.display = 'flex';
        } else {
          event.style.display = 'none';
        }
      });
    }
  });
  