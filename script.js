(function () {
  const STORAGE_KEY = "hashlabs_countdown_end";
  const DURATION_MS = 24 * 60 * 60 * 1000;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const menuBtn = document.querySelector(".menu-btn");
  const mobilePanel = document.getElementById("mobile-panel");

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, "0");
  }

  function getEndTime() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    const end = Date.now() + DURATION_MS;
    localStorage.setItem(STORAGE_KEY, String(end));
    return end;
  }

  const endTime = getEndTime();

  function update() {
    const remaining = Math.max(0, endTime - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);

    if (remaining <= 0) {
      document.body.classList.add("done");
      const eyebrow = document.querySelector(".eyebrow");
      if (eyebrow) {
        eyebrow.textContent = "The Next Gen Thing Is Almost Here";
      }
      clearInterval(timerId);
    }
  }

  update();
  const timerId = setInterval(update, 1000);

  if (menuBtn && mobilePanel) {
    menuBtn.addEventListener("click", function () {
      const open = mobilePanel.hasAttribute("hidden");
      if (open) {
        mobilePanel.removeAttribute("hidden");
        menuBtn.setAttribute("aria-expanded", "true");
      } else {
        mobilePanel.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });

    mobilePanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobilePanel.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
