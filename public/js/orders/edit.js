$(document).ready(() => {
  const endAStation = $('select#endAStation').val();
  const agencyOption = $('select#agency');
  const reasonOption = $('select#reason');

  $.get(`/areas/api?${endAStation}`, (area) => {
    if (area && area[0].role && area[0].reason) {
      const agencies = area[0].role;
      const reasons = area[0].reason;

      agencies.forEach((agency) => {
        agencyOption.append(
          $('<option/>', {
            value: agency,
            text: agency,
          })
        );
      });

      reasons.forEach((reason) => {
        reasonOption.append(
          $('<option/>', {
            value: reason,
            text: reason,
          })
        );
      });
    }
  });
});
