// --- WEEK TAB SWITCHING ---
const weekButtons = document.querySelectorAll(".week-btn");
const weekContents = document.querySelectorAll(".week-content");

weekButtons.forEach(button => {
  button.addEventListener("click", () => {
    const weekId = button.dataset.week;
    weekButtons.forEach(btn => btn.classList.remove("active"));
    weekContents.forEach(content => content.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(weekId).classList.add("active");
  });
});

// --- PROGRESS TRACKING ---
document.querySelectorAll(".day").forEach(day => {
  const key = day.dataset.day;
  const btn = day.querySelector(".complete-btn");
  const status = day.querySelector(".status-text");

  // Load from localStorage
  const saved = localStorage.getItem(key);
  if (saved === "completed") markCompleted(day, status, btn);
  else markIncomplete(day, status, btn);

  btn.addEventListener("click", () => {
    const isCompleted = localStorage.getItem(key) === "completed";
    if (isCompleted) {
      localStorage.removeItem(key);
      markIncomplete(day, status, btn);
    } else {
      localStorage.setItem(key, "completed");
      markCompleted(day, status, btn);
    }
    updateAllProgressBars();
  });
});

function markCompleted(day, status, btn) {
  day.classList.add("completed");
  status.textContent = "✅ Completed";
  status.style.color = "#27ae60";
  btn.textContent = "❌ Unmark";
}

function markIncomplete(day, status, btn) {
  day.classList.remove("completed");
  status.textContent = "Not completed";
  status.style.color = "#c0392b";
  btn.textContent = "✅ Mark as Completed";
}

// --- WEEKLY PROGRESS BARS ---
function updateAllProgressBars() {
  for (let week = 1; week <= 4; week++) {
    const days = document.querySelectorAll(`.day[data-day^="${week}-"]`);
    if (days.length === 0) continue;

    let completed = 0;
    days.forEach(day => {
      if (localStorage.getItem(day.dataset.day) === "completed") completed++;
    });

    const percentage = Math.round((completed / days.length) * 100);
    const bar = document.getElementById(`bar-week${week}`);
    const text = document.getElementById(`text-week${week}`);

    if (bar && text) {
      bar.style.width = `${percentage}%`;
      text.textContent = `${percentage}% Complete (${completed} of ${days.length} days)`;
    }
  }
}

// Initialize on page load
updateAllProgressBars();


// === FitLife Notification Setup ===
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Your browser does not support notifications.");
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("✅ Notification permission granted.");
      scheduleWorkoutReminder();
    } else {
      console.log("❌ Notification permission denied.");
    }
  });
}

// === Schedule a Reminder (Example: 24 hours later) ===
function scheduleWorkoutReminder() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      const title = "🏋️ Time to train!";
      const options = {
        body: "Stay consistent — complete today’s workout in FitLife 💪",
        icon: "assets/icons/icon-192.png",
        badge: "assets/icons/icon-192.png",
        vibrate: [100, 50, 100],
      };

      // Trigger notification immediately (for testing)
      registration.showNotification(title, options);

      // Example: Repeat after 24 hours
      setTimeout(() => registration.showNotification(title, options), 24 * 60 * 60 * 1000);
    });
  }
}

// === Auto-request permission on first load ===
window.addEventListener("load", () => {
  requestNotificationPermission();
});

document.getElementById("notifications-toggle").addEventListener("change", (e) => {
  if (e.target.checked) requestNotificationPermission();
});


// === FitLife Notification Setup ===
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Your browser does not support notifications.");
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("✅ Notification permission granted.");
      scheduleDailyReminder();
    } else {
      console.log("❌ Notification permission denied.");
    }
  });
}

// === Save Custom Reminder Time ===
const reminderInput = document.getElementById("reminder-time");
const saveBtn = document.getElementById("save-reminder-btn");

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    const time = reminderInput.value;
    localStorage.setItem("fitlife-reminder-time", time);
    alert(`⏰ Daily reminder set for ${time}`);
    scheduleDailyReminder();
  });
}

// === Schedule Reminder Notification ===
function scheduleDailyReminder() {
  if (!("serviceWorker" in navigator)) return;

  const savedTime = localStorage.getItem("fitlife-reminder-time") || "07:00";

  navigator.serviceWorker.ready.then(registration => {
    const [hour, minute] = savedTime.split(":").map(Number);
    const now = new Date();
    const reminder = new Date();

    reminder.setHours(hour, minute, 0, 0);
    if (reminder <= now) {
      // If time already passed today, schedule for tomorrow
      reminder.setDate(reminder.getDate() + 1);
    }

    const delay = reminder - now;
    console.log(`Next reminder in ${Math.round(delay / 60000)} minutes`);

    setTimeout(() => {
      const title = "💪 Time for your workout!";
      const options = {
        body: "Consistency is key. Open FitLife and crush today’s session!",
        icon: "assets/icons/icon-192.png",
        badge: "assets/icons/icon-192.png"
      };

      registration.showNotification(title, options);
      // Schedule again in 24 hours
      setInterval(() => registration.showNotification(title, options), 24 * 60 * 60 * 1000);
    }, delay);
  });
}

// === Auto-start on page load ===
window.addEventListener("load", () => {
  requestNotificationPermission();
  if (localStorage.getItem("fitlife-reminder-time")) {
    scheduleDailyReminder();
  }
});


// === Pause Reminders Feature ===
const pauseBtn = document.getElementById("pause-reminders-btn");
const pauseSelect = document.getElementById("pause-duration");
const pauseStatus = document.getElementById("pause-status");

function checkPauseStatus() {
  const pausedUntil = localStorage.getItem("fitlife-paused-until");
  if (pausedUntil) {
    const now = new Date();
    const resumeDate = new Date(pausedUntil);
    if (resumeDate > now) {
      const daysLeft = Math.ceil((resumeDate - now) / (1000 * 60 * 60 * 24));
      pauseStatus.textContent = `🔕 Reminders paused. Resumes in ${daysLeft} day${daysLeft > 1 ? "s" : ""}.`;
      return true;
    } else {
      localStorage.removeItem("fitlife-paused-until");
      pauseStatus.textContent = "";
    }
  }
  return false;
}

if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    const days = parseInt(pauseSelect.value);
    const resumeDate = new Date();
    resumeDate.setDate(resumeDate.getDate() + days);
    localStorage.setItem("fitlife-paused-until", resumeDate.toISOString());
    pauseStatus.textContent = `🔕 Reminders paused for ${days} day${days > 1 ? "s" : ""}.`;
    alert(`Notifications paused for ${days} day${days > 1 ? "s" : ""}.`);
  });
}

// Modify the schedule function to respect pause mode
function scheduleDailyReminder() {
  if (!("serviceWorker" in navigator)) return;
  if (checkPauseStatus()) return; // Skip scheduling if paused

  const savedTime = localStorage.getItem("fitlife-reminder-time") || "07:00";

  navigator.serviceWorker.ready.then(registration => {
    const [hour, minute] = savedTime.split(":").map(Number);
    const now = new Date();
    const reminder = new Date();

    reminder.setHours(hour, minute, 0, 0);
    if (reminder <= now) reminder.setDate(reminder.getDate() + 1);

    const delay = reminder - now;
    console.log(`Next reminder in ${Math.round(delay / 60000)} minutes`);

    setTimeout(() => {
      const title = "💪 Time for your workout!";
      const options = {
        body: "Consistency is key. Open FitLife and crush today’s session!",
        icon: "assets/icons/icon-192.png",
        badge: "assets/icons/icon-192.png"
      };

      registration.showNotification(title, options);
      // Repeat daily unless paused
      const repeat = setInterval(() => {
        if (!checkPauseStatus()) registration.showNotification(title, options);
      }, 24 * 60 * 60 * 1000);
    }, delay);
  });
}
