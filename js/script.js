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
      '<option value="0" data-loc="0" selected>All Departments</option>'
    );

    $.each(result.data, function (i, o) {
      const option =
        '<option value="' +
        o.id +
        '" data-loc="' +
        o.locationID +
        '">' +
        o.name +
        "</option>";

      $("#mainDeps").append(option);
      $("#empDeps").append(option);
      $("#delDepName").append(option);
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
    const first = "<td class='col-1'>" + o.firstName + "</td>";
    const last = "<td class='col-2'>" + o.lastName + "</td>";
    const email = "<td class='col-3'>" + o.email + "</td>";
    const job = "<td class='col-4'>" + o.jobTitle + "</td>";
    const department = "<td class='col-5'>" + o.department + "</td>";
    const location = "<td class='col-6'>" + o.location + "</td>";

    const row =
      "<tr>" + first + last + email + job + department + location + "</tr>";

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
  const locationId = $("#mainDeps option:selected").data("loc");

  if (locationId > 0) {
    $("#mainLocs").val(locationId);
  }

  getFilteredPersonnel();
});

// ON LOCATIONS CHANGE
$("#mainLocs").change(function () {
  getFilteredPersonnel();
});

// ===----------------------------------------------------------------------===
// EMPLOYEE PAGE
// ===----------------------------------------------------------------------===

// EMPLOYEE DATA
let empId;
let empFirstName;
let empLastName;
let empJobTitle;
let empEmail;
let empDepartmentId;
let empLocationId;

// SHOW EMPLOYEE PAGE
function showEmployeePage() {
  $("#mainPage").hide();
  $("#empPage").show();
}

// NEW EMPLOYEE
function newEmployee() {
  empId = 0;
  empFirstName = "";
  empLastName = "";
  empJobTitle = "";
  empEmail = "";
  empDepartmentId = "";
  empLocationId = "";

  $("#empNew").hide();
  $("#empEdit").hide();
  $("#empCancel").hide();
  $("#empDel").hide();
  $("#empSave").show();

  setEmployeeFields();
  enableEditing();
}

// SHOW EMPLOYEE
function showEmployee(id, first, last, job, email, department, location) {
  empId = id;
  empFirstName = first;
  empLastName = last;
  empJobTitle = job;
  empEmail = email;
  empDepartmentId = department;
  empLocationId = location;

  $("#empCancel").hide();
  $("#empSave").hide();
  $("#empDel").hide();
  $("#empNew").show();
  $("#empEdit").show();

  setEmployeeFields();
  disableEditing();
}

// SET EMPLOYEE FIELDS
function setEmployeeFields() {
  $("#empFirst").val(empFirstName);
  $("#empLast").val(empLastName);
  $("#empJob").val(empJobTitle);
  $("#empEmail").val(empEmail);
  $("#empDeps").val(empDepartmentId);
  $("#empLocs").val(empLocationId);
}

// EDIT EMPLOYEE
function editEmployee() {
  $("#empNew").hide();
  $("#empEdit").hide();
  $("#empCancel").show();
  $("#empSave").show();
  $("#empDel").show();

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
  $("#empDel").hide();
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
  const departmentId = $("#empDeps option:selected").val();
  const locationId = $("#empLocs option:selected").val();
  const data = { departmentId: departmentId, locationId: locationId };

  const success = function (result) {
    if (result.data.length == 0) {
      // Warn department and location don't match
      $("#warningText").text(
        "The selected department does not exist at that location."
      );
      $("#warningModal").modal("show");
      $("#saveEmpModal").modal("hide");
    } else {
      const firstName = $("#empFirst").val();
      const lastName = $("#empLast").val();
      const jobTitle = $("#empJob").val();
      const email = $("#empEmail").val();

      if (empId == 0) {
        const url = "libs/php/insertEmployee.php";

        const data = {
          firstName: firstName,
          lastName: lastName,
          jobTitle: jobTitle,
          email: email,
          departmentId: departmentId,
        };

        const success = function (result) {
          if (result.status.code == 200) {
            const e = result.data[0];

            showEmployee(
              e.id,
              e.firstName,
              e.lastName,
              e.jobTitle,
              e.email,
              e.departmentId,
              e.locationId
            );

            $("#saveEmpModal").modal("hide");

            $("#successText").text("Employee added successfully.");
            $("#successModal").modal("show");
          } else {
            $("#saveEmpModal").modal("hide");

            $("#errorText").text("There was an error adding the employee.");
            $("#errorModal").modal("show");
          }
        };

        ajaxRequest(url, data, success);
      } else {
        const url = "libs/php/updateEmployeeByID.php";

        const data = {
          id: empId,
          firstName: firstName,
          lastName: lastName,
          jobTitle: jobTitle,
          email: email,
          departmentId: departmentId,
        };

        const success = function (result) {
          if (result.status.code == 200) {
            const e = result.data[0];

            showEmployee(
              e.id,
              e.firstName,
              e.lastName,
              e.jobTitle,
              e.email,
              e.departmentId,
              e.locationId
            );

            $("#saveEmpModal").modal("hide");

            $("#successText").text("Employee updated successfully.");
            $("#successModal").modal("show");
          } else {
            $("#saveEmpModal").modal("hide");

            $("#errorText").text("There was an error updating the employee.");
            $("#errorModal").modal("show");
          }
        };

        ajaxRequest(url, data, success);
      }
    }
  };

  ajaxRequest(url, data, success);
});

// ON DELETE EMPLOYEE
$("#empDel").on("click", function () {
  $("#empDelModal").modal("show");
});

// ON CONFIRM DELETE EMPLOYEE
$("#empDelConfirm").on("click", function () {
  const url = "libs/php/deleteEmployeeByID.php";
  const data = { id: empId };

  const success = function (result) {
    if (result.status.code == 200) {
      newEmployee();

      $("#empDelModal").modal("hide");

      $("#successText").text("Employee deleted successfully.");
      $("#successModal").modal("show");
    } else {
      $("#empDelModal").modal("hide");

      $("#errorText").text("There was an error deleting the employee.");
      $("#errorModal").modal("show");
    }
  };

  ajaxRequest(url, data, success);
});

// ON EMPLOYEE DEPARTMENT CHANGE
$("#empDeps").change(function () {
  const locationId = $("#empDeps option:selected").data("loc");

  $("#empLocs").val(locationId);
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
function deletempDepartmentId() {
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
  deletempDepartmentId();
});

// Confirm delete department
$("#conDelDep").on("click", function () {
  deletempDepartmentId();
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
function deletempLocationId() {
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
  deletempLocationId();
});

// On delete location form submit
$("#delLocForm").on("submit", function (e) {
  e.preventDefault();
  deletempLocationId();
});
