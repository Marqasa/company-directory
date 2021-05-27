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
    var personnelTable = $("#personnel-table").DataTable({
      autoWidth: false,
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
          width: "147px",
          defaultContent:
            '<div class="text-center">' +
            '<button class="btn btn-sm btn-edit btn-tbl btn-outline-dark  me-2">Edit</button>' +
            '<button class="btn btn-sm btn-delete btn-tbl btn-outline-danger  ">Delete</button>' +
            "</div>",
        },
      ],
    });

    $("#personnel-table tbody").on("click", ".btn-edit", function () {
      var data = personnelTable.row($(this).parents("tr")).data();

      $("#editEmpFirst").val(data.firstName);
      $("#editEmpLast").val(data.lastName);
      $("#editEmpJob").val(data.jobTitle);
      $("#editEmpEmail").val(data.email);
      $("#editEmpDep").val(data.departmentId);
      $("#editEmpModal").modal("show");
    });

    $("#personnel-table tbody").on("click", ".btn-delete", function () {
      var data = personnelTable.row($(this).parents("tr")).data();
      console.log("DELETE");
    });

    $("#departments-table").DataTable({
      autoWidth: false,
      data: result.data.departments,
      columns: [
        { data: "name" },
        { data: "location" },
        {
          data: null,
          orderable: false,
          width: "147px",
          defaultContent:
            '<div class="text-center">' +
            '<button class="btn btn-sm btn-edit btn-tbl btn-outline-dark  me-2">Edit</button>' +
            '<button class="btn btn-sm btn-delete btn-tbl btn-outline-danger  ">Delete</button>' +
            "</div>",
        },
      ],
    });

    $("#locations-table").DataTable({
      autoWidth: false,
      data: result.data.locations,
      columns: [
        { data: "name" },
        {
          data: null,
          orderable: false,
          width: "147px",
          defaultContent:
            '<div class="text-center">' +
            '<button class="btn btn-sm btn-edit btn-tbl btn-outline-dark  me-2">Edit</button>' +
            '<button class="btn btn-sm btn-delete btn-tbl btn-outline-danger  ">Delete</button>' +
            "</div>",
        },
      ],
    });

    // Clear departments
    $("#newEmpDep").empty();
    $("#editEmpDep").empty();

    $.each(result.data.departments, function (i, o) {
      const option =
        '<option value="' +
        o.id +
        '" data-loc="' +
        o.locationId +
        '">' +
        o.name +
        "</option>";

      $("#newEmpDep").append(option);
      $("#editEmpDep").append(option);
    });
  };

  ajaxRequest(url, {}, success);
}

// ON EMP NEW
$("#new-employee").on("click", function () {
  $("#newEmpModal").modal("show");
});
