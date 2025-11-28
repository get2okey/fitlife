// Ensure workoutsData exists
if (typeof workoutsData === "undefined") {
  console.error("❌ workoutsData not found. Check if workouts-data.js loaded before workouts.js");
}

// Track current selection
// let currentWeek = "week1";
// let currentDay = "day1";

let currentWeek = localStorage.getItem("currentWeek") || "week1";
let currentDay = localStorage.getItem("currentDay") || "day1";


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

// ✅ Restore saved week/day tab if available
currentWeek = localStorage.getItem("currentWeek") || "week1";
currentDay = localStorage.getItem("currentDay") || "day1";

// Initial load
renderWorkouts(currentWeek, currentDay);


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
	  vibrate(40); // ⭐ short vibration feedback
      const done = card.classList.toggle("completed");
      check.textContent = done ? "✔" : "";
		// ⭐ Add/remove green highlight
		if (done) {
		  check.classList.add("completed");
		} else {
		  check.classList.remove("completed");
		}
      saveStatus(week, day, index, done);
	  checkDayCompletion(week, day); // ✅ update day & week state
    });

    //exerciseList.appendChild(card);
	card.addEventListener("click", () => {
	localStorage.setItem("selectedExercise", JSON.stringify(ex));
	window.location.href = "exercise.html";
});

	exerciseList.appendChild(card);
	
	// --- Smooth scroll to last opened exercise ---
	setTimeout(() => {
	  const last = localStorage.getItem("lastOpenedExercise");
	  if (!last) return;

	  const target = [...document.querySelectorAll(".exercise-card")]
		.find(card => card.querySelector("h4").textContent === last);

	  if (target) {
	target.scrollIntoView({ behavior: "smooth", block: "center" });

	// ⭐ Add temporary highlight
	target.classList.add("highlight-glow");
	setTimeout(() => target.classList.remove("highlight-glow"), 1500);
	  }
	}, 300);
	
	
		// --- Auto Jump to Next Incomplete Exercise ---
	setTimeout(() => {
	  // Don't auto-jump if returning from selecting an exercise intentionally
	  const last = localStorage.getItem("lastOpenedExercise");

	  const cards = [...document.querySelectorAll(".exercise-card")];
	  
	  // Find the first exercise without the "completed" class
	  const firstIncomplete = cards.find(card => !card.classList.contains("completed"));

	  if (firstIncomplete && !last) {
		firstIncomplete.scrollIntoView({ behavior: "smooth", block: "center" });
	  }
	}, 400);


	
  });

  exerciseCount.textContent = `${workouts.length} Exercises`;
  checkDayCompletion(week, day); // ✅ ensure status refreshes on load
}

// Week tabs
document.querySelectorAll(".week-btn").forEach(btn => {
  btn.addEventListener("click", () => {
	//localStorage.removeItem("lastOpenedExercise");  // reset scroll history
    document.querySelectorAll(".week-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentWeek = `week${btn.dataset.week}`;

    // ✅ Save to localStorage
    localStorage.setItem("currentWeek", currentWeek);

    renderWorkouts(currentWeek, currentDay);
  });
});

// Day tabs
document.querySelectorAll(".day-btn").forEach(btn => {
  btn.addEventListener("click", () => {
	//localStorage.removeItem("lastOpenedExercise");  // reset scroll history
    document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentDay = `day${btn.dataset.day}`;

    // ✅ Save to localStorage
    localStorage.setItem("currentDay", currentDay);

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

function vibrate(ms) {
  if (navigator.vibrate) {
    navigator.vibrate(ms);
  }
}


document.querySelector('.tab-btn[data-tab="log"]').click();
