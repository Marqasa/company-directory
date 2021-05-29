// GLOBALS
let personnelTable;
let departmentTable;
let locationTable;
let employeeData;
let departmentData;
let locationData;

// AJAX REQUEST
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

// ON READY
$(document).ready(function () {
    const dom =
        "<'row d-flex align-items-center'<'col-sm-12 col-md-4 my-1'l>" +
        "<'col-sm-12 col-md-4 my-1 d-flex justify-content-center'f>" +
        "<'new-div col-sm-12 col-md-4 my-1 d-flex justify-content-end'>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row d-flex align-items-center'<'col-sm-12 col-md-6 my-1'i><'col-sm-12 col-md-6 my-1'p>>";
    const actionWidth = "113px";
    const actionButtons =
        '<div class="d-flex flex-nowrap justify-content-center">' +
        '<button class="btn btn-edit btn-sm btn-tbl btn-outline-dark me-2">Edit</button>' +
        '<button class="btn btn-del btn-sm btn-tbl btn-outline-danger">Delete</button>' +
        "</div>";

    // PERSONNEL TABLE
    personnelTable = $("#personnel-table").DataTable({
        autoWidth: false,
        pagingType: "numbers",
        responsive: {
            details: false,
        },
        dom: dom,
        ajax: function (data, callback, settings) {
            const url = "libs/php/getAllPersonnel.php";
            const success = function (response) {
                callback(response);
            };

            ajaxRequest(url, data, success);
        },
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
                width: actionWidth,
                defaultContent: actionButtons,
            },
        ],
    });

    // DEPARTMENTS TABLE
    departmentTable = $("#department-table").DataTable({
        autoWidth: false,
        pagingType: "numbers",
        responsive: {
            details: false,
        },
        dom: dom,
        ajax: function (data, callback, settings) {
            const url = "libs/php/getAllDepartments.php";
            const success = function (response) {
                $("#newEmpDep").empty();
                $("#editEmpDep").empty();

                $.each(response.data, function (i, o) {
                    const option =
                        '<option value="' + o.id + '">' + o.name + "</option>";

                    $("#newEmpDep").append(option);
                    $("#editEmpDep").append(option);
                });

                callback(response);
            };

            ajaxRequest(url, data, success);
        },
        columns: [
            { data: "name" },
            { data: "location" },
            {
                data: null,
                orderable: false,
                width: actionWidth,
                defaultContent: actionButtons,
            },
        ],
    });

    // LOCATIONS TABLE
    locationTable = $("#location-table").DataTable({
        autoWidth: false,
        pagingType: "numbers",
        responsive: {
            details: false,
        },
        dom: dom,
        ajax: function (data, callback, settings) {
            const url = "libs/php/getAllLocations.php";
            const success = function (response) {
                $("#newDepLoc").empty();
                $("#editDepLoc").empty();

                $.each(response.data, function (i, o) {
                    const option =
                        '<option value="' + o.id + '">' + o.name + "</option>";

                    $("#newDepLoc").append(option);
                    $("#editDepLoc").append(option);
                });

                callback(response);
            };

            ajaxRequest(url, data, success);
        },
        columns: [
            { data: "name" },
            {
                data: null,
                orderable: false,
                width: actionWidth,
                defaultContent: actionButtons,
            },
        ],
    });

    // NEW BUTTONS
    $(".new-div").html(
        '<button class="btn btn-new btn-tbl btn-outline-success">New</button>'
    );

    // ===-------------------------------------------------------------------===
    // EMPLOYEE
    // ===-------------------------------------------------------------------===

    // NEW EMPLOYEE
    $("#personnel-table_wrapper").on("click", ".btn-new", function () {
        $("#newEmpFirst").val("");
        $("#newEmpLast").val("");
        $("#newEmpEmail").val("");
        $("#newEmpJob").val("");
        $("#newEmpDep").val("");
        $("#newEmpForm").removeClass("was-validated");
        $("#newEmpModal").modal("show");
    });

    // NEW EMPLOYEE SAVE
    $("#newEmpSave").on("click", function () {
        const form = document.getElementById("newEmpForm");

        if (form.checkValidity()) {
            $("#newEmpModal").modal("hide");

            const url = "libs/php/insertEmployee.php";
            const firstName = $("#newEmpFirst").val();
            const lastName = $("#newEmpLast").val();
            const email = $("#newEmpEmail").val();
            const jobTitle = $("#newEmpJob").val();
            const departmentId = $("#newEmpDep").val();
            const data = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                jobTitle: jobTitle,
                departmentId: departmentId,
            };

            const success = function (result) {
                if (result.status.code == 200) {
                    personnelTable.ajax.reload();

                    $("#successText").text("Employee added successfully.");
                    $("#successToast").toast("show");
                } else {
                    $("#errorText").text(
                        "There was an error adding the employee."
                    );
                    $("#errorToast").toast("show");
                }
            };

            ajaxRequest(url, data, success);
        } else {
            form.classList.add("was-validated");
        }
    });

    // EDIT EMPLOYEE
    function editEmployee() {
        $("#editEmpForm").removeClass("was-validated");
        $("#editEmpFirst").val(employeeData.firstName);
        $("#editEmpLast").val(employeeData.lastName);
        $("#editEmpEmail").val(employeeData.email);
        $("#editEmpJob").val(employeeData.jobTitle);
        $("#editEmpDep").val(employeeData.departmentId);
        $("#editEmpModal").modal("show");
    }

    // TABLE EDIT EMPLOYEE
    $("#personnel-table tbody").on("click", ".btn-edit", function (e) {
        e.stopPropagation();

        const row = $(this).parents("tr");
        employeeData = personnelTable.row(row).data();

        editEmployee();
    });

    // DETAILS EDIT DEPARTMENT
    $("#empDetailsEdit").on("click", function () {
        editEmployee();
    });

    // EDIT EMPLOYEE SAVE
    $("#editEmpSave").on("click", function () {
        const form = document.getElementById("editEmpForm");

        if (form.checkValidity()) {
            $("#editEmpModal").modal("hide");

            const url = "libs/php/updateEmployeeByID.php";
            const id = employeeData.id;
            const firstName = $("#editEmpFirst").val();
            const lastName = $("#editEmpLast").val();
            const email = $("#editEmpEmail").val();
            const jobTitle = $("#editEmpJob").val();
            const departmentId = $("#editEmpDep").val();
            const data = {
                id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                jobTitle: jobTitle,
                departmentId: departmentId,
            };

            const success = function (result) {
                if (result.status.code == 200) {
                    personnelTable.ajax.reload();

                    $("#successText").text("Employee updated successfully.");
                    $("#successToast").toast("show");
                } else {
                    $("#errorText").text(
                        "There was an error updating the employee."
                    );
                    $("#errorToast").toast("show");
                }
            };

            ajaxRequest(url, data, success);
        } else {
            form.classList.add("was-validated");
        }
    });

    // TABLE DELETE EMPLOYEE
    $("#personnel-table tbody").on("click", ".btn-del", function (e) {
        e.stopPropagation();

        const row = $(this).parents("tr");
        employeeData = personnelTable.row(row).data();

        $("#delEmpModal").modal("show");
    });

    // DETAILS DELETE DEPARTMENT
    $("#empDetailsDelete").on("click", function () {
        $("#delEmpModal").modal("show");
    });

    // DELETE EMPLOYEE CONFIRM
    $("#delEmpConfirm").on("click", function () {
        const url = "libs/php/deleteEmployeeByID.php";
        const data = { id: employeeData.id };

        const success = function (result) {
            if (result.status.code == 200) {
                personnelTable.ajax.reload();

                $("#successText").text("Employee deleted successfully.");
                $("#successToast").toast("show");
            } else {
                $("#errorText").text(
                    "There was an error deleting the employee."
                );
                $("#errorToast").toast("show");
            }
        };

        ajaxRequest(url, data, success);
    });

    // EMPLOYEE DETAILS
    $("#personnel-table tbody").on("click", "tr", function () {
        employeeData = personnelTable.row($(this)).data();

        const firstName = employeeData.firstName ? employeeData.firstName : "~";
        const lastName = employeeData.lastName ? employeeData.lastName : "~";
        const email = employeeData.email ? employeeData.email : "~";
        const jobTitle = employeeData.jobTitle ? employeeData.jobTitle : "~";
        const department = employeeData.department
            ? employeeData.department
            : "~";
        const location = employeeData.location ? employeeData.location : "~";

        $("#empDetailsFirst").text(firstName);
        $("#empDetailsLast").text(lastName);
        $("#empDetailsEmail").text(email);
        $("#empDetailsJob").text(jobTitle);
        $("#empDetailsDep").text(department);
        $("#empDetailsLoc").text(location);
        $("#empDetailsModal").modal("show");
    });

    // ===-------------------------------------------------------------------===
    // DEPARTMENT
    // ===-------------------------------------------------------------------===

    // NEW DEPARTMENT
    $("#department-table_wrapper").on("click", ".btn-new", function () {
        $("#newDepName").val("");
        $("#newDepLoc").val("");
        $("#newDepForm").removeClass("was-validated");
        $("#newDepModal").modal("show");
    });

    // NEW DEPARTMENT SAVE
    $("#newDepSave").on("click", function () {
        const form = document.getElementById("newDepForm");

        if (form.checkValidity()) {
            $("#newDepModal").modal("hide");

            const url = "libs/php/insertDepartment.php";
            const name = $("#newDepName").val();
            const locationId = $("#newDepLoc").val();
            const data = { name: name, locationId: locationId };

            const success = function (result) {
                if (result.status.code == 200) {
                    departmentTable.ajax.reload();

                    $("#successText").text("Department added successfully.");
                    $("#successToast").toast("show");
                } else {
                    $("#errorText").text(
                        "There was an error adding the department."
                    );
                    $("#errorToast").toast("show");
                }
            };

            ajaxRequest(url, data, success);
        } else {
            form.classList.add("was-validated");
        }
    });

    // EDIT DEPARTMENT
    function editDepartment() {
        $("#editDepForm").removeClass("was-validated");
        $("#editDepName").val(departmentData.name);
        $("#editDepLoc").val(departmentData.locationId);
        $("#editDepModal").modal("show");
    }

    // TABLE EDIT DEPARTMENT
    $("#department-table tbody").on("click", ".btn-edit", function (e) {
        e.stopPropagation();

        const row = $(this).parents("tr");
        departmentData = departmentTable.row(row).data();

        editDepartment();
    });

    // DETAILS EDIT DEPARTMENT
    $("#depDetailsEdit").on("click", function () {
        editDepartment();
    });

    // EDIT DEPARTMENT SAVE
    $("#editDepSave").on("click", function () {
        const form = document.getElementById("editDepForm");

        if (form.checkValidity()) {
            $("#editDepModal").modal("hide");

            const url = "libs/php/updateDepartmentByID.php";
            const id = departmentData.id;
            const name = $("#editDepName").val();
            const locationId = $("#editDepLoc").val();
            const data = { id: id, name: name, locationId: locationId };

            const success = function (result) {
                if (result.status.code == 200) {
                    personnelTable.ajax.reload();
                    departmentTable.ajax.reload();

                    $("#successText").text("Department updated successfully.");
                    $("#successToast").toast("show");
                } else {
                    $("#errorText").text(
                        "There was an error updating the department."
                    );
                    $("#errorToast").toast("show");
                }
            };

            ajaxRequest(url, data, success);
        } else {
            form.classList.add("was-validated");
        }
    });

    // DELETE DEPARTMENT
    function deleteDepartment() {
        const url = "libs/php/getPersonnelByDepartmentID.php";
        const data = { departmentId: departmentData.id };

        const success = function (result) {
            if (result.data.length > 0) {
                $("#warningText").text(
                    "Departments cannot be deleted while they have personnel."
                );
                $("#warningToast").toast("show");
            } else {
                $("#delDepModal").modal("show");
            }
        };

        ajaxRequest(url, data, success);
    }

    // TABLE DELETE DEPARTMENT
    $("#department-table tbody").on("click", ".btn-del", function (e) {
        e.stopPropagation();

        const row = $(this).parents("tr");
        departmentData = departmentTable.row(row).data();

        deleteDepartment();
    });

    // DETAILS DELETE DEPARTMENT
    $("#depDetailsDelete").on("click", function () {
        deleteDepartment();
    });

    // DELETE DEPARTMENT CONFIRM
    $("#delDepConfirm").on("click", function () {
        const url = "libs/php/deleteDepartmentByID.php";
        const data = { id: departmentData.id };

        const success = function (result) {
            if (result.status.code == 200) {
                departmentTable.ajax.reload();

                $("#successText").text("Department deleted successfully.");
                $("#successToast").toast("show");
            } else {
                $("#errorText").text(
                    "There was an error deleting the department."
                );
                $("#errorToast").toast("show");
            }
        };

        ajaxRequest(url, data, success);
    });

    // DEPARTMENT DETAILS
    $("#department-table tbody").on("click", "tr", function () {
        departmentData = departmentTable.row($(this)).data();

        $("#depDetailsName").text(departmentData.name);
        $("#depDetailsLoc").text(departmentData.location);
        $("#depDetailsModal").modal("show");
    });

    // ===-------------------------------------------------------------------===
    // LOCATION
    // ===-------------------------------------------------------------------===

    // NEW LOCATION
    $("#location-table_wrapper").on("click", ".btn-new", function () {
        $("#newLocName").val("");
        $("#newLocForm").removeClass("was-validated");
        $("#newLocModal").modal("show");
    });

    // NEW LOCATION SAVE
    $("#newLocSave").on("click", function () {
        const form = document.getElementById("newLocForm");

        if (form.checkValidity()) {
            $("#newLocModal").modal("hide");

            const url = "libs/php/insertLocation.php";
            const name = $("#newLocName").val();
            const data = { name: name };

            const success = function (result) {
                if (result.status.code == 200) {
                    locationTable.ajax.reload();

                    $("#successText").text("Location added successfully.");
                    $("#successToast").toast("show");
                } else {
                    $("#errorText").text(
                        "There was an error adding the location."
                    );
                    $("#errorToast").toast("show");
                }
            };

            ajaxRequest(url, data, success);
        } else {
            form.classList.add("was-validated");
        }
    });

    // EDIT LOCATION
    function editLocation() {
        $("#editLocForm").removeClass("was-validated");
        $("#editLocName").val(locationData.name);
        $("#editLocModal").modal("show");
    }

    // TABLE EDIT LOCATION
    $("#location-table tbody").on("click", ".btn-edit", function (e) {
        e.stopPropagation();

        const row = $(this).parents("tr");
        locationData = locationTable.row(row).data();

        editLocation();
    });

    // DETAILS EDIT LOCATION
    $("#locDetailsEdit").on("click", function () {
        editLocation();
    });

    // EDIT LOCATION SAVE
    $("#editLocSave").on("click", function () {
        const form = document.getElementById("editLocForm");

        if (form.checkValidity()) {
            $("#editLocModal").modal("hide");

            const url = "libs/php/updateLocationByID.php";
            const id = locationData.id;
            const name = $("#editLocName").val();
            const data = { id: id, name: name };

            const success = function (result) {
                if (result.status.code == 200) {
                    personnelTable.ajax.reload();
                    departmentTable.ajax.reload();
                    locationTable.ajax.reload();

                    $("#successText").text("Location updated successfully.");
                    $("#successToast").toast("show");
                } else {
                    $("#errorText").text(
                        "There was an error updating the location."
                    );
                    $("#errorToast").toast("show");
                }
            };

            ajaxRequest(url, data, success);
        } else {
            form.classList.add("was-validated");
        }
    });

    // DELETE LOCATION
    function deleteLocation() {
        const url = "libs/php/getDepartmentsByLocationID.php";
        const data = { locationId: locationData.id };

        const success = function (result) {
            if (result.data.length > 0) {
                $("#warningText").text(
                    "Locations cannot be deleted while they have departments."
                );
                $("#warningToast").toast("show");
            } else {
                $("#delLocModal").modal("show");
            }
        };

        ajaxRequest(url, data, success);
    }

    // TABLE DELETE LOCATION
    $("#location-table tbody").on("click", ".btn-del", function (e) {
        e.stopPropagation();

        const row = $(this).parents("tr");
        locationData = locationTable.row(row).data();

        deleteLocation();
    });

    // DETAILS DELETE LOCATION
    $("#locDetailsDelete").on("click", function () {
        deleteLocation();
    });

    // DELETE LOCATION CONFIRM
    $("#delLocConfirm").on("click", function () {
        const url = "libs/php/deleteLocationByID.php";
        const data = { id: locationData.id };

        const success = function (result) {
            if (result.status.code == 200) {
                locationTable.ajax.reload();

                $("#successText").text("Location deleted successfully.");
                $("#successToast").toast("show");
            } else {
                $("#errorText").text(
                    "There was an error deleting the location."
                );
                $("#errorToast").toast("show");
            }

            $("#delLocModal").modal("hide");
        };

        ajaxRequest(url, data, success);
    });

    // LOCATION DETAILS
    $("#location-table tbody").on("click", "tr", function () {
        locationData = locationTable.row($(this)).data();

        $("#locDetailsName").text(locationData.name);
        $("#locDetailsModal").modal("show");
    });
});
