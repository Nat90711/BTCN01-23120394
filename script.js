$(".toggle-icon").click(function () {
  var $icon = $(this);
  var $header = $icon.closest(".new-header");
  var $content = $header.next(".new-content");

  // Đổi icon của news được click
  if ($icon.text() === "▶") {
    $icon.text("🠧");
  } else {
    $icon.text("▶");
  }

  // Chỉ toggle news được click
  $content.toggle();
  $header.toggleClass("active");
});
