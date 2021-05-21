// Show main page
function showMain() {
  $("#main").show();
  $("#employee").hide();

  // Clear search term
  $("#search").val("");

  getDepartments();
  getLocations();

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
  $("#empEdit").show();
  $("#empSave").hide();

  // Disable form editing
  $("#empFields").prop({
    disabled: true,
  });
}

// Enable editing
function enableEditing() {
  // Display save button
  $("#empEdit").hide();
  $("#empSave").show();

  // Enable form editing
  $("#empFields").prop({
    disabled: false,
  });

  $("#newEmpForm").removeClass("was-validated");
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

        // Show new employee button
        $("#empNew").show();

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

// Get departments
function getDepartments() {
  const url = "libs/php/getAllDepartments.php";
  const success = function (result) {
    // Save currently selected department on employee page
    const empDepID = $("#empDep option:selected").val();

    // Clear departments
    $("#departments").empty();
    $("#empDep").empty();
    $("#delDepName").empty();

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
      $("#delDepName").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
    });

    // Re-select department on employee page
    $("#empDep").val(empDepID);
  };

  ajaxRequest(url, {}, success);
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

// On main new button click
$("#mainNew").on("click", function () {
  showEmployee();
  enableEditing();

  // Hide new employee button
  $("#empNew").hide();

  // Clear employee fields
  $("#empFirst").val("");
  $("#empLast").val("");
  $("#empJob").val("");
  $("#empEmail").val("");
  $("#empDep").val("");
  $("#empLoc").val("");
});

// On emp new button click
$("#empNew").on("click", function () {
  // Hide employee new button
  $("#empNew").hide();

  // Clear employee fields
  $("#empFirst").val("");
  $("#empLast").val("");
  $("#empJob").val("");
  $("#empEmail").val("");
  $("#empDep").val("");
  $("#empLoc").val("");

  enableEditing();
});

// On back button click
$("#back").on("click", function () {
  showMain();
});

// On edit button click
$("#empEdit").on("click", function () {
  enableEditing();
});

// On new employee save
$("#empSave").on("click", function () {
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

// ===----------------------------------------------------------------------===
// NEW DEPARTMENT
// ===----------------------------------------------------------------------===

// On new department
$("#newDep").on("click", function () {
  $("#newDepName").val("");
  $("#newDepLoc").val("");
  $("#newDepForm").removeClass("was-validated");
  $("#newDepModal").modal("show");
});

// Save new department
function saveNewDepartment() {
  const form = document.getElementById("newDepForm");

  if (form.checkValidity()) {
    const url = "libs/php/insertDepartment.php";
    const name = $("#newDepName").val();
    const locationID = $("#newDepLoc option:selected").val();
    const data = { name: name, locationID: locationID };

    const success = function (result) {
      if (result.status.code == 200) {
        getDepartments();

        $("#successText").text("Department added successfully.");
        $("#successModal").modal("show");
        $("#newDepModal").modal("hide");
      } else {
        $("#errorText").text("There was an error adding the department.");
        $("#errorModal").modal("show");
        $("#newDepModal").modal("hide");
      }
    };

    ajaxRequest(url, data, success);
  } else {
    form.classList.add("was-validated");
  }
}

// On new department save
$("#newDepSave").on("click", function () {
  saveNewDepartment();
});

// On new department submit
$("#newDepForm").on("submit", function (e) {
  e.preventDefault();
  saveNewDepartment();
});

// ===----------------------------------------------------------------------===
// DELETE DEPARTMENT
// ===----------------------------------------------------------------------===

// On delete department
$("#delDep").on("click", function () {
  $("#delDepName").val("");
  $("#delDepForm").removeClass("was-validated");
  $("#delDepModal").modal("show");
});

// Delete department
function deleteDepartment() {
  const form = document.getElementById("delDepForm");

  if (form.checkValidity()) {
    // Check department can be deleted
    const url = "libs/php/getPersonnelByDepartmentID.php";
    const departmentId = $("#delDepName option:selected").val();
    const data = { departmentId: departmentId };

    const success = function (result) {
      if (result.data.length > 0) {
        // Warn department cannot be deleted
        $("#warningText").text(
          "Cannot delete departments while they have personnel assigned."
        );
        $("#warningModal").modal("show");
        $("#delDepModal").modal("hide");
      } else {
        // Delete department
        const url = "libs/php/deleteDepartmentByID.php";
        const data = { id: departmentId };

        const success = function (result) {
          if (result.status.code == 200) {
            getDepartments();

            $("#successText").text("Department deleted successfully.");
            $("#successModal").modal("show");
            $("#delDepModal").modal("hide");
          } else {
            $("#errorText").text("There was an error deleting the department.");
            $("#errorModal").modal("show");
            $("#delDepModal").modal("hide");
          }
        };

        ajaxRequest(url, data, success);
      }
    };

    ajaxRequest(url, data, success);
  } else {
    form.classList.add("was-validated");
  }
}

// Submit delete department
$("#delDepForm").on("submit", function (e) {
  e.preventDefault();
  deleteDepartment();
});

// Confirm delete department
$("#conDelDep").on("click", function () {
  deleteDepartment();
});

// ===----------------------------------------------------------------------===
// NEW LOCATION
// ===----------------------------------------------------------------------===

// On new location
$("#newLoc").on("click", function () {
  $("#newLocName").val("");
  $("#newLocForm").removeClass("was-validated");
  $("#newLocModal").modal("show");
});

// Save new location
function saveNewLocation() {
  const form = document.getElementById("newLocForm");

  if (form.checkValidity()) {
    const url = "libs/php/insertLocation.php";
    const name = $("#newLocName").val();
    const data = { name: name };

    const success = function (result) {
      if (result.status.code == 200) {
        getLocations();

        $("#successText").text("Location added successfully.");
        $("#successModal").modal("show");
        $("#newLocModal").modal("hide");
      } else {
        $("#errorText").text("There was an error adding the location.");
        $("#errorModal").modal("show");
        $("#newLocModal").modal("hide");
      }
    };

    ajaxRequest(url, data, success);
  } else {
    form.classList.add("was-validated");
  }
}

// On new location save click
$("#newLocSave").on("click", function () {
  saveNewLocation();
});

// On new location form submit
$("#newLocForm").on("submit", function (e) {
  e.preventDefault();
  saveNewLocation();
});

// ===----------------------------------------------------------------------===
// DELETE LOCATION
// ===----------------------------------------------------------------------===

// On delete location
$("#delLoc").on("click", function () {
  $("#delLocName").val("");
  $("#delLocForm").removeClass("was-validated");
  $("#delLocModal").modal("show");
});

// Delete location
function deleteLocation() {
  const form = document.getElementById("delLocForm");

  if (form.checkValidity()) {
    // Check location can be deleted
    const url = "libs/php/getDepartmentsByLocationID.php";
    const locationID = $("#delLocName option:selected").val();
    const data = { locationID: locationID };

    const success = function (result) {
      if (result.data.length > 0) {
        // Warn location cannot be deleted
        $("#delLocModal").modal("hide");
        $("#warningText").text(
          "Cannot delete locations while departments are assigned to them."
        );
        $("#warningModal").modal("show");
      } else {
        // Delete location
        const url = "libs/php/deleteLocationByID.php";
        const data = { id: locationID };

        const success = function (result) {
          if (result.status.code == 200) {
            getLocations();
            $("#successText").text("Location deleted successfully.");
            $("#successModal").modal("show");
            $("#delLocModal").modal("hide");
          } else {
            $("#errorText").text("There was an error deleting the location.");
            $("#errorModal").modal("show");
            $("#delLocModal").modal("hide");
          }
        };

        ajaxRequest(url, data, success);
      }
    };

    ajaxRequest(url, data, success);
  } else {
    form.classList.add("was-validated");
  }
}

// On delete location click
$("#conDelLoc").on("click", function () {
  deleteLocation();
});

// On delete location form submit
$("#delLocForm").on("submit", function (e) {
  e.preventDefault();
  deleteLocation();
});
