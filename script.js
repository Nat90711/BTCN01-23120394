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

  helper: function (e, item) {
    // Sao chép phần tử gốc
    var helper = item.clone();
    // Thêm class làm mờ
    helper.addClass("is-dragging");
    return helper;
  },
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

// Hàm lấy style hiện tại
function getStyle() {
  return {
    bold: $("#boldCheck").is(":checked"),
    italic: $("#italicCheck").is(":checked"),
    underline: $("#underlineCheck").is(":checked"),
    textColor: $("#textColor").val(),
    bgColor: $("#background-color").val(),
  };
}

// Hàm tạo style
function createStyle(style) {
  let styleStr = "";
  if (style.bold) styleStr += "font-weight: bold; ";
  if (style.italic) styleStr += "font-style: italic; ";
  if (style.underline) styleStr += "text-decoration: underline; ";
  styleStr += `color: ${style.textColor}; `;
  styleStr += `background-color: ${style.bgColor}; `;
  return styleStr;
}

let originalText = $("#text-content").text();

// Xử lý Highlight
function updateAllHighlights() {
  let style = getStyle();
  let styleStr = createStyle(style);

  $(".highlighted").attr("style", styleStr);
}

$("#highlight-btn").click(function () {
  let pattern = $("#input-text").val().trim();
  if (!pattern) {
    alert("Vui lòng nhập chuỗi mẫu!");
    return;
  }

  let content = $("#text-content").text();
  let style = getStyle();
  let styleStr = createStyle(style);

  let regex = new RegExp(pattern, "gi");

  content = content.replace(regex, function (match) {
    return `<span class = "highlighted" style="${styleStr}">${match}</span>`;
  });
  $("#text-content").html(content);
});

// Xử lý delete
$("#delete-btn").click(function () {
  let pattern = $("#input-text").val().trim();
  if (!pattern) {
    alert("Vui lòng nhập chuỗi mẫu!");
    return;
  }

  let content = $("#text-content").text();
  let regex = new RegExp(pattern, "gi");
  content = content.replace(regex, "");

  $("#text-content").html(content);
});

// Xử lý reset
$("#reset-btn").click(function () {
  $("#text-content").text(originalText);
  $("#input-text").val("");
});

// Xử lý Sample Text
function updateSampleText() {
  let style = getStyle();
  let styleStr = createStyle(style);
  $("#sampleText").attr("style", styleStr);
}

// Update sample khi thay đổi setting
$("#boldCheck, #italicCheck, #underlineCheck").change(function () {
  updateSampleText();
  updateAllHighlights(); // Cập nhật tất cả highlight
});

$("#textColor, #background-color").on("input change", function () {
  updateSampleText();
  updateAllHighlights(); // Cập nhật tất cả highlight
});

// Xử lý phần dropdown list
$(".select-area").click(function () {
  $(".select-area").toggleClass("show");
  $(".select-list").toggleClass("show");
});

// Xử lý phần chọn icon
$(".select-list").on("click", "li", function () {
  let clickedIcon = $(this);
  let newIcon = clickedIcon.find(".option-icon").html();

  $(".selected-value").html(newIcon);

  $(".select-list").find("li.selected").removeClass("selected");
  clickedIcon.addClass("selected");

  $(".select-area").removeClass("show");
  $(".select-list").removeClass("show");
});
