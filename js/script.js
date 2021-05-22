// ===----------------------------------------------------------------------===
// GENERAL
// ===----------------------------------------------------------------------===

// ON LOAD
$(window).on("load", function () {
  showMainPage();

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

// GET DEPARTMENTS
function getDepartments() {
  const url = "libs/php/getAllDepartments.php";
  const success = function (result) {
    // Save currently selected department on employee page
    const empDepID = $("#empDeps option:selected").val();

    // Clear departments
    $("#mainDeps").empty();
    $("#empDeps").empty();
    $("#delDepName").empty();

    // Set departments
    $("#mainDeps").append(
      '<option value="0" selected>All Departments</option>'
    );

    $.each(result.data, function (i, o) {
      $("#mainDeps").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
      $("#empDeps").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
      $("#delDepName").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
    });

    // Re-select department on employee page
    $("#empDeps").val(empDepID);
  };

  ajaxRequest(url, {}, success);
}

// GET LOCATIONS
function getLocations() {
  const url = "libs/php/getAllLocations.php";
  const success = function (result) {
    // Save currently selected location on employee page
    const empLocID = $("#empLocs option:selected").val();

    // Clear locations
    $("#mainLocs").empty();
    $("#empLocs").empty();
    $("#newDepLoc").empty();
    $("#delLocName").empty();

    // Set locations
    $("#mainLocs").append('<option value="0" selected>All Locations</option>');

    $.each(result.data, function (i, o) {
      $("#mainLocs").append(
        '<option value="' + o.id + '">' + o.name + "</option>"
      );
      $("#empLocs").append(
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
    $("#empLocs").val(empLocID);
  };

  ajaxRequest(url, {}, success);
}

// GET PERSONNEL
function getPersonnel() {
  const url = "libs/php/getAll.php";
  const success = function (result) {
    showEmployees(result.data);
  };

  ajaxRequest(url, {}, success);
}

// GET FILTERED PERSONNEL
function getFilteredPersonnel() {
  const url = "libs/php/getFilteredPersonnel.php";
  const data = {
    name: $("#search").val(),
    departmentId: $("#mainDeps option:selected").val(),
    locationId: $("#mainLocs option:selected").val(),
  };

  const success = function (result) {
    showEmployees(result.data);
  };

  ajaxRequest(url, data, success);
}

// ===----------------------------------------------------------------------===
// MAIN PAGE
// ===----------------------------------------------------------------------===

// SHOW MAIN PAGE
function showMainPage() {
  $("#mainPage").show();
  $("#empPage").hide();

  // Clear search term
  $("#search").val("");

  getDepartments();
  getLocations();
  getPersonnel();
}

// SHOW EMPLOYEES
function showEmployees(results) {
  $("#mainEmps").empty();

  $.each(results, function (i, o) {
    const first = "<td>" + o.firstName + "</td>";
    const last = "<td>" + o.lastName + "</td>";
    const department = "<td>" + o.department + "</td>";
    const location = "<td>" + o.location + "</td>";

    const row = "<tr>" + first + last + department + location + "</tr>";

    $("#mainEmps").append(
      $(row).on("click", function () {
        showEmployeePage();
        showEmployee(
          o.id,
          o.firstName,
          o.lastName,
          o.jobTitle,
          o.email,
          o.departmentId,
          o.locationId
        );
      })
    );
  });
}

// ON MAIN NEW
$("#mainNew").on("click", function () {
  showEmployeePage();
  newEmployee();
});

// ON SEARCH INPUT
let timer;
let delay = 250;

$("#search").on("keyup", function () {
  clearTimeout(timer);
  timer = setTimeout(getFilteredPersonnel, delay);
});

$("#search").on("keydown", function () {
  clearTimeout(timer);
});

// ON DEPARTMENTS CHANGE
$("#mainDeps").change(function () {
  getFilteredPersonnel();
});

// ON LOCATIONS CHANGE
$("#mainLocs").change(function () {
  getFilteredPersonnel();
});

// ===----------------------------------------------------------------------===
// EMPLOYEE PAGE
// ===----------------------------------------------------------------------===

// CURRENT EMPLOYEE FIELDS
let eId;
let eFirst;
let eLast;
let eJob;
let eEmail;
let eDepartment;
let eLocation;

// SHOW EMPLOYEE PAGE
function showEmployeePage() {
  $("#mainPage").hide();
  $("#empPage").show();
}

// NEW EMPLOYEE
function newEmployee() {
  $("#empNew").hide();
  $("#empEdit").hide();
  $("#empCancel").hide();
  $("#empSave").show();

  eId = 0;
  eFirst = "";
  eLast = "";
  eJob = "";
  eEmail = "";
  eDepartment = "";
  eLocation = "";

  setEmployeeFields();
  enableEditing();
}

// SHOW EMPLOYEE
function showEmployee(id, first, last, job, email, department, location) {
  $("#empCancel").hide();
  $("#empSave").hide();
  $("#empNew").show();
  $("#empEdit").show();

  eId = id;
  eFirst = first;
  eLast = last;
  eJob = job;
  eEmail = email;
  eDepartment = department;
  eLocation = location;

  setEmployeeFields();
  disableEditing();
}

// SET EMPLOYEE FIELDS
function setEmployeeFields() {
  $("#empFirst").val(eFirst);
  $("#empLast").val(eLast);
  $("#empJob").val(eJob);
  $("#empEmail").val(eEmail);
  $("#empDeps").val(eDepartment);
  $("#empLocs").val(eLocation);
}

// EDIT EMPLOYEE
function editEmployee() {
  $("#empNew").hide();
  $("#empEdit").hide();
  $("#empCancel").show();
  $("#empSave").show();

  enableEditing();
}

// ENABLE EDITING
function enableEditing() {
  $("#empFields").prop({ disabled: false });
  $("#newEmpForm").removeClass("was-validated");
}

// DISABLE EDITING
function disableEditing() {
  $("#empFields").prop({ disabled: true });
}

// ON EMP BACK
$("#empBack").on("click", function () {
  showMainPage();
});

// ON EMP NEW
$("#empNew").on("click", function () {
  newEmployee();
});

// ON EMP EDIT
$("#empEdit").on("click", function () {
  editEmployee();
});

// ON EMP CANCEL
$("#empCancel").on("click", function () {
  $("#empCancel").hide();
  $("#empSave").hide();
  $("#empNew").show();
  $("#empEdit").show();

  setEmployeeFields();
  disableEditing();
});

// ON EMP SAVE
$("#empSave").on("click", function () {
  const form = document.getElementById("newEmpForm");

  if (form.checkValidity()) {
    $("#saveEmpModal").modal("show");
  } else {
    form.classList.add("was-validated");
  }
});

// ON SAVE EMP CONFIRM
$("#saveEmpConfirm").on("click", function () {
  const url = "libs/php/getDepartmentAndLocationByID.php";
  eDepartment = $("#empDeps option:selected").val();
  eLocation = $("#empLocs option:selected").val();
  const data = { departmentId: eDepartment, locationId: eLocation };

  const success = function (result) {
    if (result.data.length == 0) {
      // Warn department and location don't match
      $("#warningText").text(
        "The selected department does not exist at the selected location."
      );
      $("#warningModal").modal("show");
      $("#saveEmpModal").modal("hide");
    } else {
      if (eId == 0) {
        const url = "libs/php/insertEmployee.php";
        eFirst = $("#empFirst").val();
        eLast = $("#empLast").val();
        eJob = $("#empJob").val();
        eEmail = $("#empEmail").val();

        const data = {
          firstName: eFirst,
          lastName: eLast,
          jobTitle: eJob,
          email: eEmail,
          departmentId: eDepartment,
        };

        const success = function (result) {
          eId = result.data[0].id;

          $("#empSave").hide();
          $("#empNew").show();
          $("#empEdit").show();

          $("#successText").text("Employee added successfully.");
          $("#successModal").modal("show");
          $("#saveEmpModal").modal("hide");

          disableEditing();
        };

        ajaxRequest(url, data, success);
      } else {
        // Update
      }
    }
  };

  ajaxRequest(url, data, success);
});

// ===----------------------------------------------------------------------===
// NEW DEPARTMENT MODAL
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
// DELETE DEPARTMENT MODAL
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
// NEW LOCATION MODAL
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
// DELETE LOCATION MODAL
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
