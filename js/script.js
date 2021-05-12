// Generic AJAX request
function ajaxRequest(url, data, success) {
  $.ajax({
    url: url,
    type: "POST",
    dataType: "json",
    data: data,
    success: success,
    error: function (request, status, error) {
      console.log(error);
    },
  });
}

$(window).on("load", function () {
  // Get all departments
  const url1 = "libs/php/getAllDepartments.php";
  const success1 = function (result) {
    console.log(result);

    $.each(result.data, function (i, o) {
      $("#departments").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
    });
  };

  ajaxRequest(url1, {}, success1);

  // Get all locations
  const url2 = "libs/php/getAllLocations.php";
  const success2 = function (result) {
    console.log(result);

    $.each(result.data, function (i, o) {
      $("#locations").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
    });
  };

  ajaxRequest(url2, {}, success2);

  // Get all employees
  const url3 = "libs/php/getAll.php";
  const success3 = function (result) {
    console.log(result);

    $.each(result.data, function (i, o) {
      const first = "<td>" + o.firstName + "</td>";
      const last = "<td>" + o.lastName + "</td>";
      const department = "<td>" + o.department + "</td>";
      const location = "<td>" + o.location + "</td>";
      const row = "<tr>" + first + last + department + location + "</tr>";
      $("#employees").append(row);
    });
  };
  ajaxRequest(url3, {}, success3);
});
