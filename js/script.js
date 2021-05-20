// Show main page
function showMain() {
  $("#main").show();
  $("#employee").hide();

  // Clear search term
  $("#search").val("");

  getLocations();

  // Get all departments
  const depUrl = "libs/php/getAllDepartments.php";
  const depSuccess = function (result) {
    // Clear departments
    $("#departments").empty();
    $("#empDep").empty();

    // Set departments
    $("#departments").append(
      '<option value="0" selected>All Departments</option>'
    );

    $.each(result.data, function (i, o) {
      $("#departments").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
      $("#empDep").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
    });
  };

  ajaxRequest(depUrl, {}, depSuccess);

  // Get all employees
  const url3 = "libs/php/getAll.php";
  const success3 = function (result) {
    displayEmployees(result.data);
  };

  ajaxRequest(url3, {}, success3);
}

// Show employee page
function showEmployee() {
  $("#main").hide();
  $("#employee").show();
}

// Disable editing
function disableEditing() {
  // Display edit button
  $("#edit").show();
  $("#newEmpSave").hide();

  // Disable form editing
  $("#empFields").prop({
    disabled: true,
  });
}

// Enable editing
function enableEditing() {
  // Display save button
  $("#edit").hide();
  $("#newEmpSave").show();

  // Enable form editing
  $("#empFields").prop({
    disabled: false,
  });
}

// Display employees
function displayEmployees(results) {
  $("#employees").empty();
  $.each(results, function (i, o) {
    const first = "<td>" + o.firstName + "</td>";
    const last = "<td>" + o.lastName + "</td>";
    const department = "<td>" + o.department + "</td>";
    const location = "<td>" + o.location + "</td>";

    const row = {};
    row.id = o.id;
    row.html = "<tr>" + first + last + department + location + "</tr>";

    $("#employees").append(
      $(row.html).on("click", function () {
        showEmployee();
        disableEditing();

        // Set employee fields
        $("#empFirst").val(o.firstName);
        $("#empLast").val(o.lastName);
        $("#empJob").val(o.jobTitle);
        $("#empEmail").val(o.email);
        $("#empDep").val(o.departmentId);
        $("#empLoc").val(o.locationId);
      })
    );
  });
}

// Filter results
function getFilteredResults() {
  const url = "libs/php/filter.php";
  const data = {
    name: $("#search").val(),
    departmentId: $("#departments option:selected").val(),
    locationId: $("#locations option:selected").val(),
  };

  const success = function (result) {
    displayEmployees(result.data);
  };

  ajaxRequest(url, data, success);
}

// Validate forms
function validateForms() {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
}
// ===----------------------------------------------------------------------===
// AJAX
// ===----------------------------------------------------------------------===

// Generic
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

// Get locations
function getLocations() {
  const url = "libs/php/getAllLocations.php";
  const success = function (result) {
    // Save currently selected location on employee page
    const empLocID = $("#empLoc option:selected").val();

    // Clear locations
    $("#locations").empty();
    $("#empLoc").empty();
    $("#newDepLoc").empty();
    $("#delLocName").empty();

    // Set locations
    $("#locations").append('<option value="0" selected>All Locations</option>');

    $.each(result.data, function (i, o) {
      $("#locations").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
      $("#empLoc").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
      $("#newDepLoc").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
      $("#delLocName").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
    });

    // Re-select location on employee page
    $("#empLoc").val(empLocID);
  };

  ajaxRequest(url, {}, success);
}

// ===----------------------------------------------------------------------===
// EVENTS
// ===----------------------------------------------------------------------===

// On load
$(window).on("load", function () {
  showMain();

  // Remove preloader
  if ($("#preloader").length) {
    $("#preloader")
      .delay(250)
      .fadeOut("fast", function () {
        $(this).remove();
      });
  }
});

// On search input
var timer;
var delay = 250;

$("#search").on("keyup", function () {
  clearTimeout(timer);
  timer = setTimeout(getFilteredResults, delay);
});

$("#search").on("keydown", function () {
  clearTimeout(timer);
});

// On departments change
$("#departments").change(function () {
  getFilteredResults();
});

// On locations change
$("#locations").change(function () {
  getFilteredResults();
});

// On new button click
$("#new").on("click", function () {
  showEmployee();
  enableEditing();

  // Clear employee fields
  $("#empFirst").val("");
  $("#empLast").val("");
  $("#empJob").val("");
  $("#empEmail").val("");
  $("#empDep").val("");
  $("#empLoc").val("");
});

// On back button click
$("#back").on("click", function () {
  showMain();
});

// On edit button click
$("#edit").on("click", function () {
  enableEditing();
});

// On new employee save
$("#newEmpSave").on("click", function () {
  const form = document.getElementById("newEmpForm");

  if (form.checkValidity()) {
    $("#newEmpModal").modal("show");
  } else {
    form.classList.add("was-validated");
  }
});

// On confirm save
$("#confirm").on("click", function () {
  disableEditing();
});

// On new department
$("#newDep").on("click", function () {
  $("#newDepName").val("");
  $("#newDepLoc").val("");
  $("#newDepForm").removeClass("was-validated");
  $("#newDepModal").modal("show");
});

// On new department save
$("#newDepSave").on("click", function () {
  const form = document.getElementById("newDepForm");

  if (form.checkValidity()) {
    const name = $("#newDepName").val();
    $("#newDepModal").modal("hide");
  } else {
    form.classList.add("was-validated");
  }
});

// On new location
$("#newLoc").on("click", function () {
  $("#newLocName").val("");
  $("#newLocForm").removeClass("was-validated");
  $("#newLocModal").modal("show");
});

// On new location save
$("#newLocSave").on("click", function () {
  const form = document.getElementById("newLocForm");

  if (form.checkValidity()) {
    const url = "libs/php/insertLocation.php";
    const name = $("#newLocName").val();
    const data = { name: name };

    const success = function (result) {
      if (result.status.code == 200) {
        alert("Location added successfully.");
        getLocations();
        $("#newLocModal").modal("hide");
      } else {
        alert("There was an error adding the location.");
      }
    };

    ajaxRequest(url, data, success);
  } else {
    form.classList.add("was-validated");
  }
});

// On delete location
$("#delLoc").on("click", function () {
  $("#delLocName").val("");
  $("#delLocForm").removeClass("was-validated");
  $("#delLocModal").modal("show");
});

// On confirm delete location
$("#conDelLoc").on("click", function () {
  const form = document.getElementById("delLocForm");

  if (form.checkValidity()) {
    // Check location can be deleted
    const url = "libs/php/getDepartmentsByLocationID.php";
    const locationID = $("#delLocName option:selected").val();
    const data = { locationID: locationID };

    const success = function (result) {
      if (result.data.length > 0) {
        // Warn location cannot be deleted
        alert(
          "Cannot delete locations while departments are assigned to them."
        );
      } else {
        // Delete location
        const url = "libs/php/deleteLocationByID.php";
        const data = { id: locationID };

        const success = function (result) {
          if (result.status.code == 200) {
            alert("Location deleted successfully.");
            getLocations();
            $("#delLocModal").modal("hide");
          } else {
            alert("There was an error deleting the location.");
          }
        };

        ajaxRequest(url, data, success);
      }
    };

    ajaxRequest(url, data, success);
  } else {
    form.classList.add("was-validated");
  }
});
