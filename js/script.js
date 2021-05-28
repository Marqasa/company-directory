// ===----------------------------------------------------------------------===
// GENERAL
// ===----------------------------------------------------------------------===
let personnelTable;
let departmentTable;
let locationTable;
let employeeData;
let departmentData;
let locationData;

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
        ajax: {
            url: "libs/php/getAllPersonnel.php",
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
        ajax: {
            url: "libs/php/getAllDepartments.php",
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
        ajax: {
            url: "libs/php/getAllLocations.php",
        },
        columns: [
            { data: "name" },
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

    // NEW EMPLOYEE BUTTON
    $("#newEmpDiv").html(
        '<button id="newEmpBtn" class="btn btn-tbl btn-outline-success">New</button>'
    );

    // NEW DEPARTMENT BUTTON
    $("#newDepDiv").html(
        '<button id="newDepBtn" class="btn btn-tbl btn-outline-success">New</button>'
    );

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
        // PERSONNEL TABLE
        $("#personnel-table").DataTable({
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

        // DEPARTMENTS TABLE
        $("#departments-table").DataTable({
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

        // LOCATIONS TABLE
        $("#locations-table").DataTable({
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
    };

    ajaxRequest(url, {}, success);
}
