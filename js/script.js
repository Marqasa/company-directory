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
    // PERSONNEL TABLE
    personnelTable = $("#personnel-table").DataTable({
        autoWidth: false,
        pagingType: "numbers",
        responsive: {
            details: false,
        },
        dom:
            "<'row d-flex align-items-center'<'col-sm-12 col-md-4 my-1'l>" +
            "<'col-sm-12 col-md-4 my-1 d-flex justify-content-center'f>" +
            "<'#newEmpDiv.col-sm-12 col-md-4 my-1 d-flex justify-content-end'>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row d-flex align-items-center'<'col-sm-12 col-md-6 my-1'i><'col-sm-12 col-md-6 my-1'p>>",
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
                width: "147px",
                defaultContent:
                    '<div class="d-flex flex-nowrap justify-content-center">' +
                    '<button class="btn btn-sm btn-edit btn-tbl btn-outline-dark  me-2">Edit</button>' +
                    '<button class="btn btn-sm btn-delete btn-tbl btn-outline-danger  ">Delete</button>' +
                    "</div>",
            },
        ],
    });

    // DEPARTMENTS TABLE
    departmentTable = $("#departments-table").DataTable({
        autoWidth: false,
        pagingType: "numbers",
        responsive: {
            details: false,
        },
        dom:
            "<'row d-flex align-items-center'<'col-sm-12 col-md-4 my-1'l>" +
            "<'col-sm-12 col-md-4 my-1 d-flex justify-content-center'f>" +
            "<'#newDepDiv.col-sm-12 col-md-4 my-1 d-flex justify-content-end'>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row d-flex align-items-center'<'col-sm-12 col-md-6 my-1'i><'col-sm-12 col-md-6 my-1'p>>",
        ajax: function (data, callback, settings) {
            const url = "libs/php/getAllDepartments.php";
            const success = function (response) {
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
                width: "147px",
                defaultContent:
                    '<div class="d-flex flex-nowrap justify-content-center">' +
                    '<button class="btn btn-sm btn-edit btn-tbl btn-outline-dark  me-2">Edit</button>' +
                    '<button class="btn btn-sm btn-delete btn-tbl btn-outline-danger  ">Delete</button>' +
                    "</div>",
            },
        ],
    });

    // LOCATIONS TABLE
    locationTable = $("#locations-table").DataTable({
        autoWidth: false,
        pagingType: "numbers",
        responsive: {
            details: false,
        },
        dom:
            "<'row d-flex align-items-center'<'col-sm-12 col-md-4 my-1'l>" +
            "<'col-sm-12 col-md-4 my-1 d-flex justify-content-center'f>" +
            "<'#newLocDiv.col-sm-12 col-md-4 my-1 d-flex justify-content-end'>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row d-flex align-items-center'<'col-sm-12 col-md-6 my-1'i><'col-sm-12 col-md-6 my-1'p>>",
        ajax: function (data, callback, settings) {
            const url = "libs/php/getAllLocations.php";
            const success = function (response) {
                $("#newDepLoc").empty();

                $.each(response.data, function (i, o) {
                    const option =
                        '<option value="' + o.id + '">' + o.name + "</option>";

                    $("#newDepLoc").append(option);
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
                width: "147px",
                defaultContent:
                    '<div class="d-flex flex-nowrap justify-content-center">' +
                    '<button class="btn btn-edit btn-sm btn-tbl btn-outline-dark me-2">Edit</button>' +
                    '<button class="btn btn-del btn-sm btn-tbl btn-outline-danger">Delete</button>' +
                    "</div>",
            },
        ],
    });

    // NEW EMPLOYEE BUTTON
    $("#newEmpDiv").html(
        '<button id="newEmpBtn" class="btn btn-tbl btn-outline-success">New</button>'
    );

    // NEW DEPARTMENT BUTTON
    $("#newDepDiv").html(
        '<button id="newDepBtn" class="btn btn-tbl btn-outline-success">New</button>'
    );

    $("#newDepBtn").on("click", function () {
        $("#newDepName").val("");
        $("#newDepLoc").val("");
        $("#newDepForm").removeClass("was-validated");
        $("#newDepModal").modal("show");
    });

    // NEW LOCATION BUTTON
    $("#newLocDiv").html(
        '<button id="newLocBtn" class="btn btn-tbl btn-outline-success">New</button>'
    );

    $("#newLocBtn").on("click", function () {
        $("#newLocName").val("");
        $("#newLocForm").removeClass("was-validated");
        $("#newLocModal").modal("show");
    });

    // NEW LOCATION SAVE
    $("#newLocSave").on("click", function () {
        const form = document.getElementById("newLocForm");

        if (form.checkValidity()) {
            const url = "libs/php/insertLocation.php";
            const name = $("#newLocName").val();
            const data = { name: name };

            const success = function (result) {
                if (result.status.code == 200) {
                    locationTable.ajax.reload();
                    $("#successText").text("Location added successfully.");
                    $("#successToast").toast("show");
                    $("#newLocModal").modal("hide");
                } else {
                    $("#errorText").text(
                        "There was an error adding the location."
                    );
                    $("#errorToast").toast("show");
                    $("#newLocModal").modal("hide");
                }
            };

            ajaxRequest(url, data, success);
        } else {
            form.classList.add("was-validated");
        }

        $("#newLocModal").modal("hide");
    });

    // EDIT LOCATION BUTTON
    $("#locations-table tbody").on("click", ".btn-edit", function (e) {
        const row = $(this).parents("tr");

        locationData = locationTable.row(row).data();

        $("#editLocForm").removeClass("was-validated");
        $("#editLocName").val(locationData.name);
        $("#editLocModal").modal("show");
    });

    // EDIT LOCATION SAVE
    $("#editLocSave").on("click", function () {
        const form = document.getElementById("editLocForm");

        if (form.checkValidity()) {
            const url = "libs/php/updateLocationByID.php";
            const id = locationData.id;
            const name = $("#editLocName").val();
            const data = { id: id, name: name };

            const success = function (result) {
                if (result.status.code == 200) {
                    locationTable.ajax.reload();
                    $("#successText").text("Location updated successfully.");
                    $("#successToast").toast("show");
                    $("#newLocModal").modal("hide");
                } else {
                    $("#errorText").text(
                        "There was an error updating the location."
                    );
                    $("#errorToast").toast("show");
                    $("#newLocModal").modal("hide");
                }
            };

            ajaxRequest(url, data, success);
        } else {
            form.classList.add("was-validated");
        }

        $("#editLocModal").modal("hide");
    });

    // DELETE LOCATION BUTTON
    $("#locations-table tbody").on("click", ".btn-del", function (e) {
        const row = $(this).parents("tr");
        locationData = locationTable.row(row).data();

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
});
