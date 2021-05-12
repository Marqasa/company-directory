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

$(window).on("load", function () {
  const url = "libs/php/getAll.php";
  const success = function (result) {
    $.each(result.data, function (i, o) {
      const first = "<td>" + o.firstName + "</td>";
      const last = "<td>" + o.lastName + "</td>";
      const department = "<td>" + o.department + "</td>";
      const location = "<td>" + o.location + "</td>";
      const row = "<tr>" + first + last + department + location + "</tr>";
      $("#employees").append(row);
    });

    console.log(result);
  };
  ajaxRequest(url, {}, success);
});
