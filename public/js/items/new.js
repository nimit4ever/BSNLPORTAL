$(document).ready(() => {
  $.get('/units/api', (units) => {
    function groupBy(objectArray, property) {
      return objectArray.reduce((acc, obj) => {
        let key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    }

    const groupedUnits = groupBy(units, 'type');
    const uniqueUnits = Object.keys(groupedUnits);

    const typeOption = $('select#type');

    uniqueUnits.sort((a, b) => (a > b ? 1 : -1));
    uniqueUnits.forEach((uniqueUnit) => {
      typeOption.append(
        $('<option/>', {
          value: uniqueUnit,
          text: uniqueUnit,
        })
      );
    });

    $('select#type').on('change', function () {
      const typeNames = groupedUnits[this.value];
      const nameOption = $('select#name');
      nameOption.empty();
      nameOption.append(
        $('<option/>', {
          value: '',
          text: 'SELECT',
        })
      );

      typeNames.sort((a, b) => (a.name > b.name ? 1 : -1));
      typeNames.forEach((typeName) => {
        nameOption.append(
          $('<option/>', {
            value: typeName._id + ':' + typeName.name,
            text: typeName.name,
          })
        );
      });
    });

    $('select#name').on('change', function () {
      const value = this.value.split(':')[0];
      const selectName = units.find((unit) => {
        if (unit._id === value) {
          return unit;
        }
      });

      if (selectName) {
        $('input#unitRate').val(selectName.unitRate);
        $('input#measurement').val(selectName.measurement);
      } else {
        $('input#unitRate').val(0);
        $('input#measurement').val('');
      }
    });

    $('input#unitRate').on('change', function () {
      $('input#amt').val($('input#unitRate').val() * $('input#qty').val());
    });

    $('input#qty').on('change', function () {
      $('input#amt').val($('input#unitRate').val() * $('input#qty').val());
    });
  });
});
