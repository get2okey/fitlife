// --- Helper: Calculate Progress by Week ---
function calculateWeekProgress(week) {
  const keys = Object.keys(localStorage).filter(key => key.startsWith(`${week}-`));
  const total = keys.length;
  const completed = keys.filter(k => localStorage.getItem(k) === "completed").length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percent };
}

// --- Render Weekly and Total Progress ---
function renderProgress() {
  let totalDays = 0;
  let totalCompleted = 0;

  for (let week = 1; week <= 4; week++) {
    const { total, completed, percent } = calculateWeekProgress(`week${week}`);
    const bar = document.getElementById(`bar-week${week}`);
    const text = document.getElementById(`text-week${week}`);

    if (bar && text) {
      bar.style.width = `${percent}%`;
      text.textContent = `${percent}% Complete (${completed} of ${total} exercises)`;
    }

    totalDays += total;
    totalCompleted += completed;
  }

  const totalPercent = totalDays > 0 ? Math.round((totalCompleted / totalDays) * 100) : 0;
  document.getElementById("bar-total").style.width = `${totalPercent}%`;
  document.getElementById("text-total").textContent =
    `${totalPercent}% Complete (${totalCompleted} of ${totalDays} exercises)`;
}

// --- Reset All Progress ---
document.getElementById("reset-progress").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
    Object.keys(localStorage).forEach(key => {
      if (key.match(/^week\d-day\d-\d+$/)) localStorage.removeItem(key);
    });
    renderProgress();
    alert("Progress has been reset!");
  }
});

// --- Initialize ---
renderProgress();
