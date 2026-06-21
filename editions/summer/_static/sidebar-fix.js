/**
 * sidebar-fix.js
 * Bridges SBT 1.0.1 / PST 0.15.4 id mismatch:
 * label[for="__primary"] has no matching input, so the toggle does nothing.
 * We intercept the click and toggle a CSS class directly.
 */
(function () {
  function init() {
    const label = document.querySelector("label.primary-toggle");
    const sidebar = document.querySelector(".bd-sidebar-primary");
    if (!label || !sidebar) return;

    label.addEventListener("click", function (e) {
      e.preventDefault();
      sidebar.classList.toggle("sbt-sidebar-collapsed");
      // persist state across page loads
      try {
        const collapsed = sidebar.classList.contains("sbt-sidebar-collapsed");
        localStorage.setItem("sbt-sidebar-collapsed", collapsed ? "1" : "0");
      } catch (_) {}
    });

    // restore state on page load
    try {
      if (localStorage.getItem("sbt-sidebar-collapsed") === "1") {
        sidebar.classList.add("sbt-sidebar-collapsed");
      }
    } catch (_) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
