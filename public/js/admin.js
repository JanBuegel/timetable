$(document).ready(function() {
  // Activate tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Select/Deselect checkboxes
  var checkbox = $('table tbody input[type="checkbox"]');
  $("#selectAll").click(function() {
    if (this.checked) {
      checkbox.each(function() {
        this.checked = true;
      });
    } else {
      checkbox.each(function() {
        this.checked = false;
      });
    }
  });
  checkbox.click(function() {
    if (!this.checked) {
      $("#selectAll").prop("checked", false);
    }
  });

  // Show modal for editing
  $('.edit-button').on('click', function() {
    var eventId = $(this).data('id');
    // Load event data into the modal
    axios.get(`/admin/events/${eventId}`)
      .then(function(response) {
        var event = response.data;
        $('#editEventForm [name="name"]').val(event.name);
        $('#editEventForm [name="date"]').val(event.date);
        $('#editEventForm [name="time"]').val(event.time);
        $('#editEventForm [name="stage"]').val(event.stage);

        // Remove display: none to show modal
        $('#editModal').css('display', 'block');
        $('#editModal').modal('show'); // Show the modal with Bootstrap's modal method
      })
      .catch(function(error) {
        console.error('Error loading event data:', error);
      });
      $(this).css('display', 'show');
  });

  // Hide modal after closing
  $('#editModal').on('hidden.bs.modal', function () {
    // Set display: none to hide modal again
    $(this).css('display', 'none');
  });
});
