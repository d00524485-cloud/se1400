/* Provenance - milestone 7 interactive features
   Plain JavaScript, no libraries. Each feature only runs if
   its elements exist on the current page. */

document.addEventListener("DOMContentLoaded", function () {

    /* ---------- 1. LIGHTBOX (Primers page) ----------
       Clicking a label photo opens it large in a <dialog>.
       Arrow keys / buttons move between photos, Esc closes. */
    var lightbox = document.querySelector(".lightbox");
    var zoomButtons = Array.from(document.querySelectorAll(".zoom"));

    if (lightbox && zoomButtons.length) {
        var bigImg = lightbox.querySelector("img");
        var caption = lightbox.querySelector(".lightbox-bar p");
        var current = 0;

        function visibleButtons() {
            return zoomButtons.filter(function (btn) {
                return !btn.closest("[hidden]");
            });
        }

        function show(index) {
            var list = visibleButtons();
            current = (index + list.length) % list.length;
            var img = list[current].querySelector("img");
            bigImg.src = img.src;
            bigImg.alt = img.alt;
            caption.textContent = list[current].dataset.caption;
        }

        zoomButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                show(visibleButtons().indexOf(btn));
                lightbox.showModal();
            });
        });

        lightbox.querySelector("[data-prev]").addEventListener("click", function () { show(current - 1); });
        lightbox.querySelector("[data-next]").addEventListener("click", function () { show(current + 1); });
        lightbox.querySelector("[data-close]").addEventListener("click", function () { lightbox.close(); });

        lightbox.addEventListener("keydown", function (e) {
            if (e.key === "ArrowLeft") show(current - 1);
            if (e.key === "ArrowRight") show(current + 1);
        });

        // Clicking the dark backdrop closes the lightbox
        lightbox.addEventListener("click", function (e) {
            if (e.target === lightbox) lightbox.close();
        });
    }

    /* ---------- 2. FILTER CHIPS (Primers page) ---------- */
    var chips = document.querySelectorAll(".chip");
    chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
            chips.forEach(function (c) {
                c.classList.remove("is-active");
                c.setAttribute("aria-pressed", "false");
            });
            chip.classList.add("is-active");
            chip.setAttribute("aria-pressed", "true");

            var group = chip.dataset.filter;
            document.querySelectorAll(".label-card").forEach(function (card) {
                card.hidden = group !== "all" && card.dataset.group !== group;
            });
        });
    });

    /* ---------- 3. SORTABLE + FILTERABLE TABLE (Price Watch page) ---------- */
    var table = document.querySelector(".price-table");
    if (table) {
        var tbody = table.querySelector("tbody");
        var headers = table.querySelectorAll("th[data-type]");

        headers.forEach(function (th, col) {
            th.querySelector("button").addEventListener("click", function () {
                var ascending = th.getAttribute("aria-sort") !== "ascending";
                headers.forEach(function (h) { h.removeAttribute("aria-sort"); });
                th.setAttribute("aria-sort", ascending ? "ascending" : "descending");

                var rows = Array.from(tbody.rows);
                rows.sort(function (a, b) {
                    var x = a.cells[col].dataset.value || a.cells[col].textContent;
                    var y = b.cells[col].dataset.value || b.cells[col].textContent;
                    if (th.dataset.type === "number") {
                        x = parseFloat(x);
                        y = parseFloat(y);
                        return ascending ? x - y : y - x;
                    }
                    return ascending ? x.localeCompare(y) : y.localeCompare(x);
                });
                rows.forEach(function (row) { tbody.appendChild(row); });
            });
        });

        var labelFilter = document.querySelector("#label-filter");
        if (labelFilter) {
            labelFilter.addEventListener("change", function () {
                Array.from(tbody.rows).forEach(function (row) {
                    row.hidden = labelFilter.value !== "all" && row.dataset.label !== labelFilter.value;
                });
            });
        }
    }

    /* ---------- 4. CHECKLIST PROGRESS (Authentication page) ---------- */
    var checklist = document.querySelector(".checklist");
    if (checklist) {
        var boxes = checklist.querySelectorAll("input[type='checkbox']");
        var bar = document.querySelector(".progress span");
        var count = document.querySelector(".progress-count");

        function update() {
            var done = checklist.querySelectorAll("input:checked").length;
            bar.style.width = (done / boxes.length * 100) + "%";
            count.textContent = done + " of " + boxes.length + " checks done";
        }

        boxes.forEach(function (box) { box.addEventListener("change", update); });
        update();
    }

    /* ---------- 5. FORMS ----------
       The site is static (no server), so forms show a
       confirmation message instead of sending data anywhere. */
    document.querySelectorAll("form[data-confirm]").forEach(function (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var message = form.querySelector(".form-message");
            message.textContent = form.dataset.confirm;
            message.hidden = false;
            form.reset();
        });
    });
});
