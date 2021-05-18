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

// Show main page
function showMain() {
  $("#main").show();
  $("#employee").hide();

  // Clear search term
  $("#search").val("");

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

  // Get all locations
  const url2 = "libs/php/getAllLocations.php";
  const success2 = function (result) {
    // Clear locations
    $("#locations").empty();
    $("#empLoc").empty();
    $("#newDepLoc").empty();

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
    });
  };

  ajaxRequest(url2, {}, success2);

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
  $("#save").hide();

  // Disable form editing
  $("#empFields").prop({
    disabled: true,
  });
}

// Enable editing
function enableEditing() {
  // Display save button
  $("#edit").hide();
  $("#save").show();

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

// On save button click
$("#confirm").on("click", function () {
  disableEditing();
});

// On save button click
$("#newLocForm").on("submit", function (e) {
  e.preventDefault();

  if (e.target.checkValidity()) {
    const name = $("#newLocName").val();
    $("#newLocModal").modal("hide");
    $("#newLocName").val("");
    e.target.classList.remove("was-validated");
  } else {
    e.target.classList.add("was-validated");
  }
});
