document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-button');
    const deleteButtons = document.querySelectorAll('.delete-button');
    const editModal = document.getElementById('edit-modal');
    const closeButton = document.querySelector('#edit-modal .close-button');
    const editForm = document.getElementById('edit-form');
    const tableHeaders = document.querySelectorAll('th[data-sort]');
  
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const eventId = button.getAttribute('data-id');
        axios.get(`/admin/events/${eventId}`).then(response => {
          const event = response.data;
          editForm.action = `/admin/events/${eventId}?_method=PUT`;
          editForm.querySelector('[name="name"]').value = event.name;
          editForm.querySelector('[name="date"]').value = event.date;
          editForm.querySelector('[name="time"]').value = event.time;
          editForm.querySelector('[name="stage"]').value = event.stage;
          editModal.classList.remove('hidden');
        });
      });
    });
  
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const eventId = button.getAttribute('data-id');
        if (confirm('Sind Sie sicher, dass Sie dieses Event löschen möchten?')) {
          axios.delete(`/admin/events/${eventId}`).then(() => {
            location.reload();
          });
        }
      });
    });
  
    closeButton.addEventListener('click', () => {
      editModal.classList.add('hidden');
    });
  
    window.addEventListener('click', (event) => {
      if (event.target === editModal) {
        editModal.classList.add('hidden');
      }
    });
  
    tableHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const table = header.closest('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const index = Array.from(header.parentNode.children).indexOf(header);
        const order = header.dataset.order = -(header.dataset.order || -1);
  
        rows.sort((a, b) => {
          const cellA = a.children[index].textContent.trim();
          const cellB = b.children[index].textContent.trim();
  
          if (!isNaN(Date.parse(cellA)) && !isNaN(Date.parse(cellB))) {
            return order * (new Date(cellA) - new Date(cellB));
          } else if (!isNaN(cellA) && !isNaN(cellB)) {
            return order * (cellA - cellB);
          } else {
            return order * cellA.localeCompare(cellB);
          }
        });
  
        rows.forEach(row => tbody.appendChild(row));
      });
    });
  });
  