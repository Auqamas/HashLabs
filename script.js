(function () {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const menuBtn = document.querySelector(".menu-btn");
  const mobilePanel = document.getElementById("mobile-panel");

  let timerId = null;

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, "0");
  }

  function render(endTime) {
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
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    }
  }

  function startCountdown(endTime) {
    render(endTime);
    timerId = setInterval(function () {
      render(endTime);
    }, 1000);
  }

  fetch("countdown.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) {
        throw new Error("Failed to load countdown");
      }
      return res.json();
    })
    .then(function (data) {
      const endTime = Date.parse(data.endTime);
      if (Number.isNaN(endTime)) {
        throw new Error("Invalid endTime in countdown.json");
      }
      startCountdown(endTime);
    })
    .catch(function () {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
    });

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
