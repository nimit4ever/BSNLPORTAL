jQuery(document).ready(function () {
  jQuery('#loading').fadeOut(800);
});

$('#myForm').on('submit', function () {
  $('#loading').fadeIn();
});
