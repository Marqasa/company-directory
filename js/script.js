// ===----------------------------------------------------------------------===
// GENERAL
// ===----------------------------------------------------------------------===

let employeeData;

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
      pagingType: "numbers",
      responsive: {
        details: false,
      },
      data: result.data.personnel,
      dom:
        "<'row d-flex align-items-center'<'#new-emp.col-sm-12 col-md-4 my-1'><'col-sm-12 col-md-4 my-1 text-center'l><'col-sm-12 col-md-4 my-1'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row d-flex align-items-center'<'col-sm-12 col-md-6 my-1'i><'col-sm-12 col-md-6 my-1'p>>",
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

    $("#new-emp").html(
      '<button id="new-employee" class="btn btn-outline-success btn-tbl w-50">New</button>'
    );

    $("#personnel-table tbody").on("click", ".btn-edit", function (e) {
      e.stopPropagation();
      //Button inside a cell
      var current_row = $(this).parents("tr"); //Get the current row
      if (current_row.hasClass("child")) {
        //Check if the current row is a child row
        current_row = current_row.prev(); //If it is, then point to the row before it (its 'parent')
      }

      employeeData = personnelTable.row(current_row).data(); //At this point, current_row refers to a valid row in the table, whether is a child row (collapsed by the DataTable's responsiveness) or a 'normal' row
      $("#editEmpFirst").val(employeeData.firstName);
      $("#editEmpLast").val(employeeData.lastName);
      $("#editEmpJob").val(employeeData.jobTitle);
      $("#editEmpEmail").val(employeeData.email);
      $("#editEmpDep").val(employeeData.departmentId);
      $("#editEmpModal").modal("show");
    });

    $(".btn-emp-edit").on("click", function () {
      $("#editEmpFirst").val(employeeData.firstName);
      $("#editEmpLast").val(employeeData.lastName);
      $("#editEmpJob").val(employeeData.jobTitle);
      $("#editEmpEmail").val(employeeData.email);
      $("#editEmpDep").val(employeeData.departmentId);
    });

    $("#personnel-table tbody").on("click", "tr", function () {
      employeeData = personnelTable.row($(this)).data();

      $("#empDetFirst").text(employeeData.firstName);
      $("#empDetLast").text(employeeData.lastName);
      $("#empDetJob").text(employeeData.jobTitle);
      $("#empDetEmail").text(employeeData.email);
      $("#empDetDep").text(employeeData.department);
      $("#empDetLoc").text(employeeData.location);
      $("#detailsModal").modal("show");
    });

    $("#personnel-table tbody").on("click", ".btn-delete", function () {
      employeeData = personnelTable.row($(this).parents("tr")).data();
    });

    $("#departments-table").DataTable({
      autoWidth: false,
      pagingType: "numbers",
      responsive: {
        details: false,
      },
      data: result.data.departments,
      dom:
        "<'row d-flex align-items-center'<'#new-dep.col-sm-12 col-md-4 my-1'><'col-sm-12 col-md-4 my-1 text-center'l><'col-sm-12 col-md-4 my-1'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row d-flex align-items-center'<'col-sm-12 col-md-6 my-1'i><'col-sm-12 col-md-6 my-1'p>>",
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

    $("#new-dep").html(
      '<button id="new-department" class="btn btn-outline-success btn-tbl w-50">New</button>'
    );

    $("#locations-table").DataTable({
      autoWidth: false,
      pagingType: "numbers",
      responsive: {
        details: false,
      },
      data: result.data.locations,
      dom:
        "<'row d-flex align-items-center'<'#new-loc.col-sm-12 col-md-4 my-1'><'col-sm-12 col-md-4 my-1 text-center'l><'col-sm-12 col-md-4 my-1'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row d-flex align-items-center'<'col-sm-12 col-md-6 my-1'i><'col-sm-12 col-md-6 my-1'p>>",
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

    $("#new-loc").html(
      '<button id="new-location" class="btn btn-outline-success btn-tbl w-50">New</button>'
    );

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
