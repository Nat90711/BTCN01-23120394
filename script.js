// Ẩn, hiện nội dung của news
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

// Kéo thả các news box
$("aside").sortable({
  handle: ".drag-icon",
  axis: "y",
});

// Hiện phần text setting options
$(".setting-text-btn").click(function (e) {
  e.stopPropagation();
  $(".text-options").toggleClass("show");
});

// Ấn ra ngoài để tắt text setting options
$(document).click(function () {
  $(".text-options").removeClass("show");
});
$(".text-options").click(function (e) {
  e.stopPropagation();
});
