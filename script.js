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

$(document).ready(function () {
  const MAX_ITEMS = 15;
  // Xử lý nút Add New
  $(".add-item-btn").click(function () {
    const currentCount = $(".item-container .box").length;
    if (currentCount >= MAX_ITEMS) {
      return;
    }
    const selectedIcon = $(".selected-value").text();
    const newBox = $("<div></div>");
    newBox.addClass("box");
    newBox.text(selectedIcon);
    $(".item-container").append(newBox);
    initDragAndDrop(newBox);
  });
});

function initDragAndDrop(element) {
  $(element).on("mousedown", function (e) {
    e.preventDefault();

    const $el = $(this);
    const rect = this.getBoundingClientRect();
    const shift = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const orig = {
      parent: $el.parent(),
      next: $el.next(),
      left: rect.left,
      top: rect.top,
    };

    let isDragging = false,
      currentPos = null;

    const $shadow = $el.clone().css({
      position: "fixed",
      zIndex: 1000,
      left: rect.left,
      top: rect.top,
      width: $el.outerWidth(),
      height: $el.outerHeight(),
      opacity: 0.9,
      pointerEvents: "none",
      boxShadow: "0 12px 24px rgba(0,0,0,.3)",
      borderRadius: "12px",
      transition: "box-shadow .2s ease",
    });

    const $placeholder = $("<div class='placeholder box'></div>").css({
      background: "transparent",
      width: $el.outerWidth(),
      height: $el.outerHeight(),
      border: "2px dashed #667eea",
      borderRadius: "12px",
      opacity: 0,
      transform: "scale(.95)",
      transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
    });

    const moveAt = (x, y) =>
      $shadow.css({ left: x - shift.x, top: y - shift.y });

    const savePositions = () => {
      const map = new Map();
      $(".item-container .box:not(.placeholder)").each(function () {
        const r = this.getBoundingClientRect();
        map.set(this, { left: r.left, top: r.top });
      });
      return map;
    };

    const animateItems = (oldPos) => {
      const $items = $(".item-container .box:not(.placeholder)");
      const newRects = new Map();

      $items.each(function () {
        newRects.set(this, this.getBoundingClientRect());
      });
      document.body.offsetHeight; // force reflow

      $items.each(function () {
        const old = oldPos.get(this),
          now = newRects.get(this);
        if (!old || !now) return;
        const dx = old.left - now.left,
          dy = old.top - now.top;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

        $(this).css({
          transition: "none",
          transform: `translate(${dx}px,${dy}px)`,
        });
        this.offsetHeight;
        $(this).css({
          transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
          transform: "translate(0,0)",
        });
      });

      setTimeout(() => $items.css({ transition: "", transform: "" }), 400);
    };

    function onMouseMove(ev) {
      moveAt(ev.clientX, ev.clientY);

      if (!isDragging) {
        isDragging = true;
        $("body").append($shadow);
        const old = savePositions();
        $el.after($placeholder).detach();
        requestAnimationFrame(() => {
          animateItems(old);
          $placeholder.css({ opacity: 1, transform: "scale(1)" });
        });
      }

      const $targets = $(".item-container .box:not(.placeholder)");
      if (!$targets.length) return;

      const cursorY = ev.clientY,
        cursorX = ev.clientX;

      let rowTop = null,
        rowItems = [],
        minYDiff = Infinity;

      $targets.each(function () {
        const rect = this.getBoundingClientRect();
        const dy = Math.abs(cursorY - rect.top);
        if (dy < minYDiff - 5) {
          minYDiff = dy;
          rowTop = rect.top;
          rowItems = [{ el: this, rect }];
        } else if (Math.abs(rect.top - rowTop) < 10) {
          rowItems.push({ el: this, rect });
        }
      });

      if (!rowItems.length) return $(".item-container").append($placeholder);

      let closest = null,
        minXDiff = Infinity;

      rowItems.forEach(({ el, rect }) => {
        const centerX = rect.left + rect.width / 2;
        const dx = Math.abs(cursorX - centerX);
        if (dx < minXDiff) {
          minXDiff = dx;
          closest = $(el);
        }
      });
      if (!closest) return;

      const rect = closest[0].getBoundingClientRect();

      const THRESHOLD = rect.width / 3;
      let newPos = currentPos;

      if (cursorX < rect.left + rect.width / 2 - THRESHOLD) {
        newPos = "before-" + rect.left;
      } else if (cursorX > rect.left + rect.width / 2 + THRESHOLD) {
        newPos = "after-" + rect.left;
      } else {
        return;
      }
      if (newPos !== currentPos) {
        const oldPositions = savePositions();
        currentPos = newPos;

        if (newPos.startsWith("before")) {
          closest.before($placeholder);
        } else {
          closest.after($placeholder);
        }

        requestAnimationFrame(() => animateItems(oldPositions));
      }
    }

    function onMouseUp() {
      $(document).off(".drag");
      if (!isDragging) return $shadow.remove(), $placeholder.remove();

      const phRect = $placeholder[0].getBoundingClientRect();
      $shadow.css({
        transition: "all .35s cubic-bezier(.4,0,.2,1)",
        left: phRect.left,
        top: phRect.top,
      });

      setTimeout(() => {
        $placeholder.replaceWith($el);
        $shadow.remove();
        $el.css({ transition: "", transform: "", opacity: "" });
      }, 350);
    }

    $(document).on("mousemove.drag", onMouseMove);
    $(document).on("mouseup.drag", onMouseUp);
  });
}

// Xử lý đồng bộ trạng thái menu
$(".nav-item").click(function (e) {
  e.preventDefault();
  var target = $(this).data("target");
  $(".nav-item").removeClass("active");
  $('[data-target="' + target + '"]').addClass("active");
});
