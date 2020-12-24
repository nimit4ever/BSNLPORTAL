$(document).ready(() => {
  const areaOption = $('select#area');
  const roleOption = $('select#role');
  $.get('/areas/api', (areas) => {
    areas.forEach((area) => {
      areaOption.append(
        $('<option/>', {
          value: area.name,
          text: area.name,
        })
      );
    });

    areas.sort((a, b) => (a.name > b.name ? 1 : -1));
    areaOption.on('change', function () {
      const selectedArea = areas.find((area) => {
        if (area.name === this.value) return area.role;
      });

      roleOption.empty();
      roleOption.append(
        $('<option/>', {
          value: '',
          text: 'Select User Role...',
        })
      );

      if (selectedArea && selectedArea.role) {
        selectedArea.role.forEach((role) => {
          roleOption.append(
            $('<option/>', {
              value: role,
              text: role,
            })
          );
        });
      }
    });
  });
});
