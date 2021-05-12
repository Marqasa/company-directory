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
    console.log(result);
  };
  ajaxRequest(url, {}, success);
});
