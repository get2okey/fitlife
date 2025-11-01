// Ensure workoutsData exists
if (typeof workoutsData === "undefined") {
  console.error("❌ workoutsData not found. Check if workouts-data.js loaded before workouts.js");
}

// Track current selection
let currentWeek = "week1";
let currentDay = "day1";

const exerciseList = document.getElementById("exercise-list");
const exerciseCount = document.getElementById("exercise-count");

// LocalStorage helpers
function getKey(week, day, index) {
  return `${week}-${day}-${index}`;
}
function isCompleted(week, day, index) {
  return localStorage.getItem(getKey(week, day, index)) === "completed";
}
function saveStatus(week, day, index, done) {
  const key = getKey(week, day, index);
  if (done) localStorage.setItem(key, "completed");
  else localStorage.removeItem(key);
}

// Render workouts
function renderWorkouts(week, day) {
  const workouts = workoutsData[week]?.[day] || [];
  exerciseList.innerHTML = "";

  if (workouts.length === 0) {
    exerciseList.innerHTML = `<p style="color:#fff;text-align:center;">No workouts found for ${week} ${day}</p>`;
    exerciseCount.textContent = "0 Exercises";
    return;
  }

  workouts.forEach((ex, index) => {
    const completed = isCompleted(week, day, index);

    const card = document.createElement("div");
    card.className = `exercise-card${completed ? " completed" : ""}`;
    card.innerHTML = `
      <div class="exercise-thumb">
        <img src="${ex.image}" alt="${ex.name}" onerror="this.src='assets/images/placeholder.jpg'">
        <button class="check-btn">${completed ? "✔" : ""}</button>
      </div>
      <div class="exercise-info">
        <h4>${ex.name}</h4>
        <p class="muscle">${ex.muscle}</p>
        <span class="set-type">${ex.setType}</span>
        <p class="details">Reps ${ex.reps} | Tempo ${ex.tempo}</p>
      </div>
    `;

    // Add event listener
    const check = card.querySelector(".check-btn");
    check.addEventListener("click", () => {
      const done = card.classList.toggle("completed");
      check.textContent = done ? "✔" : "";
      saveStatus(week, day, index, done);
	  checkDayCompletion(week, day); // ✅ update day & week state
    });

    //exerciseList.appendChild(card);
	card.addEventListener("click", () => {
	localStorage.setItem("selectedExercise", JSON.stringify(ex));
	window.location.href = "exercise.html";
});

	exerciseList.appendChild(card);

	
  });

  exerciseCount.textContent = `${workouts.length} Exercises`;
  checkDayCompletion(week, day); // ✅ ensure status refreshes on load
}

// Week tabs
document.querySelectorAll(".week-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".week-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentWeek = `week${btn.dataset.week}`;
    renderWorkouts(currentWeek, currentDay);
  });
});

// Day tabs
document.querySelectorAll(".day-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentDay = `day${btn.dataset.day}`;
    renderWorkouts(currentWeek, currentDay);
  });
});

// Initial load
renderWorkouts(currentWeek, currentDay);

function checkDayCompletion(week, day) {
  const dayWorkouts = workoutsData[week][day];
  const completed = dayWorkouts.every(w => localStorage.getItem(`${w.name}-completed`) === "true");

  if (completed) {
    const dayBtn = document.querySelector(`[data-day="${day.replace("day", "")}"]`);
    if (dayBtn) dayBtn.classList.add("completed-day");
    localStorage.setItem(`${week}-${day}-completed`, "true");
  }

  checkWeekCompletion(week);
}

function checkWeekCompletion(week) {
  const days = Object.keys(workoutsData[week]);
  const allDaysComplete = days.every(day => localStorage.getItem(`${week}-${day}-completed`) === "true");

  if (allDaysComplete) {
    const weekBtn = document.querySelector(`[data-week="${week.replace("week", "")}"]`);
    if (weekBtn) weekBtn.classList.add("completed-week");
    localStorage.setItem(`${week}-completed`, "true");
  }
}
