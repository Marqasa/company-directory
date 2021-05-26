// ===----------------------------------------------------------------------===
// GENERAL
// ===----------------------------------------------------------------------===

// ON LOAD
$(window).on("load", function () {
  // Remove preloader
  if ($("#preloader").length) {
    $("#preloader")
      .delay(250)
      .fadeOut("fast", function () {
        $(this).remove();
      });
  }
});
