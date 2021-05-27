// ===----------------------------------------------------------------------===
// GENERAL
// ===----------------------------------------------------------------------===

// ON LOAD
$(window).on("load", function () {
  //   $("#personnel-table").DataTable();
  //   $("#departments-table").DataTable();
  //   $("#locations-table").DataTable();

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
    $("#personnel-table").DataTable({
      data: result.data.personnel,
      columns: [
        { data: "firstName" },
        { data: "lastName" },
        { data: "email" },
        { data: "jobTitle" },
        { data: "department" },
        { data: "location" },
        {
          data: null,
          orderable: false,
          render: function (data, type, row) {
            return (
              '<div class="text-center">' +
              '<button data-id="' +
              data.id +
              '" class="btn btn-sm btn-outline-success me-2">Edit</button>' +
              '<button data-id="' +
              data.id +
              '" class="btn btn-sm btn-outline-danger">Delete</button>' +
              "</div>"
            );
          },
        },
      ],
    });

    $("#departments-table").DataTable({
      data: result.data.departments,
      columns: [
        { data: "name" },
        { data: "location" },
        {
          data: null,
          orderable: false,
          render: function (data, type, row) {
            return (
              '<div class="text-center">' +
              '<button data-id="' +
              data.id +
              '" class="btn btn-sm btn-outline-success me-2">Edit</button>' +
              '<button data-id="' +
              data.id +
              '" class="btn btn-sm btn-outline-danger">Delete</button>' +
              "</div>"
            );
          },
        },
      ],
    });

    $("#locations-table").DataTable({
      data: result.data.locations,
      columns: [
        { data: "name" },
        {
          data: null,
          width: "90%",
          orderable: false,
          render: function (data, type, row) {
            return (
              '<div class="text-center">' +
              '<button data-id="' +
              data.id +
              '" class="btn btn-sm btn-outline-success me-2">Edit</button>' +
              '<button data-id="' +
              data.id +
              '" class="btn btn-sm btn-outline-danger">Delete</button>' +
              "</div>"
            );
          },
        },
      ],
    });
  };

  ajaxRequest(url, {}, success);
}

// ===----------------------------------------------------------------------===
// MAIN
// ===----------------------------------------------------------------------===

// SHOW EMPLOYEES
function showPersonnel(data) {
  // $('#personnel-table').DataTable( {
  //     data: data,
  //     columns: [
  //         { title: "Name" },
  //         { title: "Position" },
  //         { title: "Office" },
  //         { title: "Extn." },
  //         { title: "Start date" },
  //         { title: "Salary" }
  //     ]
  // } );
  //   $("#personnel").empty();
  //   $.each(data, function (i, o) {
  //     const id = o.id;
  //     const first = "<td>" + o.firstName + "</td>";
  //     const last = "<td>" + o.lastName + "</td>";
  //     const email = "<td>" + o.email + "</td>";
  //     const job = "<td>" + o.jobTitle + "</td>";
  //     const department = "<td>" + o.department + "</td>";
  //     const location = "<td>" + o.location + "</td>";
  //     const row =
  //       '<tr data-id="' +
  //       id +
  //       '">' +
  //       first +
  //       last +
  //       email +
  //       job +
  //       department +
  //       location +
  //       "</tr>";
  //     $("#personnel").append(row);
  //   });
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
