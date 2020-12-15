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

// // Monitor value change in Select Tag
// $('select').on('change', function () {
//   var thisSelect = this;
//   var nextSelect = $(this).parentsUntil('#select-area').parent().next('#select-area').find('select');
//   var nextAll = $(this).parentsUntil('#select-area').parent().nextAll('#select-area').find('select');

//   // Get Sub Area for selected Area and Set to next Dropdown Liast
//   if (thisSelect.value) {
//     $.get('/areas/' + this.value + '/subarea', function (data) {
//       data.subarea.sort((a, b) => (a.area > b.area ? 1 : -1));
//       data.subarea.forEach(function (subarea) {
//         nextSelect.append(
//           $('<option/>', {
//             value: subarea._id,
//             text: subarea.area,
//           })
//         );
//       });
//     });
//   }

//   // Set Form formAction

//   if ($('select#area option:selected').val()) {
//     areaValue = $('select#area option:selected').val();
//     areaText = $('select#area option:selected').text();
//     buttonAction(areaValue);
//   } else if ($('select#city option:selected').val()) {
//     areaValue = $('select#city option:selected').val();
//     areaText = $('select#city option:selected').text();
//     buttonAction(areaValue);
//   } else if ($('select#district option:selected').val()) {
//     areaValue = $('select#district option:selected').val();
//     areaText = $('select#district option:selected').text();
//     buttonAction(areaValue);
//   } else if ($('select#state option:selected').val()) {
//     areaValue = $('select#state option:selected').val();
//     areaText = $('select#state option:selected').text();
//     buttonAction(areaValue);
//   } else {
//     areaValue = '';
//     areaText = '';
//     buttonAction(areaValue);
//   }
//   $('div#myAction').addClass('d-none');
// });
