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
    const actionWidth = "147px";
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

    // NEW EMPLOYEE BUTTON
    $("#newEmpDiv").html(
        '<button id="newEmpBtn" class="btn btn-tbl btn-outline-success">New</button>'
    );

    // ===-------------------------------------------------------------------===
    // DEPARTMENT
    // ===-------------------------------------------------------------------===

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

    // DEPARTMENT DETAILS
    $("#department-table tbody").on("click", "tr", function () {
        departmentData = departmentTable.row($(this)).data();

        $("#depDetailsName").text(departmentData.name);
        $("#depDetailsLoc").text(departmentData.location);
        $("#depDetailsModal").modal("show");
    });

    // DEPARTMENT DETAILS EDIT BUTTON
    $("#depDetailsEdit").on("click", function () {
        $("#editDepForm").removeClass("was-validated");
        $("#editDepName").val(departmentData.name);
        $("#editDepLoc").val(departmentData.locationId);
        $("#editDepModal").modal("show");
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

    // ===-------------------------------------------------------------------===
    // LOCATION
    // ===-------------------------------------------------------------------===

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

    // LOCATION DETAILS
    $("#location-table tbody").on("click", "tr", function () {
        locationData = locationTable.row($(this)).data();

        $("#locDetailsName").text(locationData.name);
        $("#locDetailsModal").modal("show");
    });

    // LOCATION DETAILS EDIT
    $("#locDetailsEdit").on("click", function () {
        $("#editLocForm").removeClass("was-validated");
        $("#editLocName").val(locationData.name);
        $("#locDetailsModal").modal("hide");
        $("#editLocModal").modal("show");
    });

    // EDIT LOCATION BUTTON
    $("#location-table tbody").on("click", ".btn-edit", function (e) {
        e.stopPropagation();

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
            $("#editLocModal").modal("hide");

            const url = "libs/php/updateLocationByID.php";
            const id = locationData.id;
            const name = $("#editLocName").val();
            const data = { id: id, name: name };

            const success = function (result) {
                if (result.status.code == 200) {
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

    // CHECK DELETE LOCATION
    function checkDeleteLocation() {
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

    // LOCATION DETAILS DELETE
    $("#locDetailsDelete").on("click", function () {
        $("#locDetailsModal").modal("hide");

        checkDeleteLocation();
    });

    // DELETE LOCATION BUTTON
    $("#location-table tbody").on("click", ".btn-del", function (e) {
        e.stopPropagation();

        const row = $(this).parents("tr");
        locationData = locationTable.row(row).data();

        checkDeleteLocation();
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
