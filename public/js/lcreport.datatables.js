// Call the dataTables jQuery plugin

$(document).ready(function () {
  const table = $('#dataTable').DataTable({
    lengthChange: false,
    lengthMenu: [
      [10, 25, 50, -1],
      ['10 rows', '25 rows', '50 rows', 'Show all'],
    ],
    buttons: ['excel', 'colvis', 'pageLength'],
    order: [[0, 'desc']],
    colReorder: true,
    stateSave: true,
    responsive: true,
    searchBuilder: true,
  });
  new $.fn.dataTable.FixedHeader(table);
  table.buttons().container().appendTo('#dataTable_wrapper .col-md-6:eq(0)');
  table.searchBuilder.container().prependTo(table.table().container());
});
