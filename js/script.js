// ===----------------------------------------------------------------------===
// GENERAL
// ===----------------------------------------------------------------------===

// ON LOAD
$(window).on("load", function () {
  getData();

  // Remove preloader
  if ($("#preloader").length) {
    $("#preloader")
      .delay(250)
      .fadeOut("fast", function () {
        $(this).remove();
      });
  }
});

// ===----------------------------------------------------------------------===
// AJAX
// ===----------------------------------------------------------------------===

// GENERIC REQUEST
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

// GET DATA
function getData() {
  const url = "libs/php/getAll.php";
  const success = function (result) {
    showPersonnel(result.data.personnel);
    showDepartments(result.data.departments);
    showLocations(result.data.locations);
  };

  ajaxRequest(url, {}, success);
}

// ===----------------------------------------------------------------------===
// MAIN
// ===----------------------------------------------------------------------===

// SHOW EMPLOYEES
function showPersonnel(data) {
  $("#personnel").empty();

  $.each(data, function (i, o) {
    const id = o.id;
    const first = "<td>" + o.firstName + "</td>";
    const last = "<td>" + o.lastName + "</td>";
    const email = "<td>" + o.email + "</td>";
    const job = "<td>" + o.jobTitle + "</td>";
    const department = "<td>" + o.department + "</td>";
    const location = "<td>" + o.location + "</td>";
    const row =
      '<tr data-id="' +
      id +
      '">' +
      first +
      last +
      email +
      job +
      department +
      location +
      "</tr>";

    $("#personnel").append(row);
  });
}

// SHOW DEPARTMENTS
function showDepartments(data) {
  $("#departments").empty();

  $.each(data, function (i, o) {
    const id = o.id;
    const name = "<td>" + o.name + "</td>";
    const location = "<td>" + o.location + "</td>";
    const row = '<tr data-id="' + id + '">' + name + location + "</tr>";

    $("#departments").append(row);
  });
}

// SHOW LOCATIONS
function showLocations(data) {
  $("#locations").empty();

  $.each(data, function (i, o) {
    const id = o.id;
    const name = "<td>" + o.name + "</td>";
    const row = '<tr data-id="' + id + '">' + name + "</tr>";

    $("#locations").append(row);
  });
}
