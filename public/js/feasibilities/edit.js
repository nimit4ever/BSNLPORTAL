$(document).ready(() => {
  const endAStation = $('select#endAStation');
  const endBStation = $('select#endBStation');
  const roleOption = $('select#role');

  $.get('/areas/api', (areas) => {
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

    const myArea = areas.find((area) => {
      if (area.name === endAStation.val()) return area.role;
    });

    if (myArea && myArea.role) {
      myArea.role.forEach((role) => {
        roleOption.append(
          $('<option/>', {
            value: role,
            text: role,
          })
        );
      });
    }

    endAStation.on('change', function () {
      const selectedArea = areas.find((area) => {
        if (area.name === this.value) return area.role;
      });

      roleOption.empty();
      roleOption.append(
        $('<option/>', {
          value: '',
          text: 'SELECT',
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
