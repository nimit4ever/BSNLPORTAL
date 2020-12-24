$(document).ready(() => {
  $.get('/areas/api', (areas) => {
    const endAStation = $('select#endAStation');
    const endBStation = $('select#endBStation');

    areas.sort((a, b) => (a.name > b.name ? 1 : -1));
    areas.forEach((area) => {
      endAStation.append(
        $('<option/>', {
          value: area.name,
          text: area.name,
        })
      );
      endBStation.append(
        $('<option/>', {
          value: area.name,
          text: area.name,
        })
      );
    });

    $('select#endAStation').on('change', function () {
      const selectedArea = areas.find((area) => {
        if (area.name === this.value) return area.role;
      });
      const roles = selectedArea.role;
      const roleOption = $('select#role');
      roleOption.empty();
      roleOption.append(
        $('<option/>', {
          value: '',
          text: 'SELECT',
        })
      );

      roles.forEach((role) => {
        roleOption.append(
          $('<option/>', {
            value: role,
            text: role,
          })
        );
      });
    });
  });
});
