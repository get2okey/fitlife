// === Load Exercise Data ===
const exercise = JSON.parse(localStorage.getItem("selectedExercise"));

// Populate header info
if (exercise) {
  document.getElementById("exercise-name").textContent = exercise.name;
  document.getElementById("exercise-image").src = exercise.image;
  document.getElementById("exercise-reps").textContent = `Reps ${exercise.reps}`;
  document.getElementById("exercise-tempo").textContent = `Tempo ${exercise.tempo}`;
  document.getElementById("exercise-type").textContent = exercise.setType;
  document.getElementById("exercise-muscle").textContent = `Muscles: ${exercise.muscle}`;
}

// === Tabs ===
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
  });
});

// === Dynamic Log Builder ===
const setsContainer = document.getElementById("sets-container");
const weightHeader = document.getElementById("weight-header");
const completionStatus = document.getElementById("completion-status");
const completionText = document.getElementById("completion-text");

const requiresWeight = exercise.name.toLowerCase() !== "chin up";
if (!requiresWeight) weightHeader.style.display = "none";

const totalSets = 3;
for (let i = 1; i <= totalSets; i++) {
  const row = document.createElement("div");
  row.className = "set-row";

  const repsInput = document.createElement("input");
  repsInput.type = "number";
  repsInput.placeholder = "Reps";

  const weightInput = document.createElement("input");
  weightInput.type = "number";
  weightInput.placeholder = "Weight (kg)";

  const checkBtn = document.createElement("button");
  checkBtn.textContent = "✔";

  checkBtn.addEventListener("click", () => {
    checkBtn.classList.toggle("done");
    const allDone = [...document.querySelectorAll(".set-row button")].every(b => b.classList.contains("done"));
    if (allDone) {
      completionStatus.style.display = "block";
      completionText.textContent = "You have marked all sets.";
    } else {
      completionStatus.style.display = "none";
      completionText.textContent = "";
    }
  });

  row.appendChild(document.createTextNode(i));
  row.appendChild(repsInput);
  if (requiresWeight) row.appendChild(weightInput);
  row.appendChild(checkBtn);
  setsContainer.appendChild(row);
}

// === Load History on Page Load ===
const historyKey = `history-${exercise.name}`;
const historyPane = document.getElementById("tab-history");
let historyData = JSON.parse(localStorage.getItem(historyKey)) || [];

function renderHistory() {
  const historyContainer = document.getElementById("history-content");
  const summaryBox = document.getElementById("history-summary");

  if (historyData.length === 0) {
    historyContainer.innerHTML = `<p>No previous history yet. Complete this exercise to start tracking!</p>`;
    summaryBox.innerHTML = "";
    return;
  }

  // --- Create summary ---
  const totalSessions = historyData.length;
  const firstDate = new Date(historyData[historyData.length - 1].date);
  const month = firstDate.toLocaleString("default", { month: "short" });
  const year = firstDate.getFullYear();
  summaryBox.innerHTML = `🏋️ You’ve completed this exercise <strong>${totalSessions} time${totalSessions > 1 ? "s" : ""}</strong> since <strong>${month} ${year}</strong>`;

  // --- Display entries ---
  historyContainer.innerHTML = historyData.map(entry => `
    <div class="history-card">
      <h4>${entry.date}</h4>
      <ul>
        ${entry.sets.map(s => `
          <li>Set ${s.set}: ${s.reps} reps${s.weight ? ` @ ${s.weight}kg` : ""}</li>
        `).join("")}
      </ul>
      ${entry.note ? `<p><strong>Note:</strong> ${entry.note}</p>` : ""}
      <span class="completed-badge">✅ Completed</span>
    </div>
  `).join("");
}



// Initial render
renderHistory();

// === Save Log ===
document.getElementById("save-btn").addEventListener("click", () => {
  const data = {
    date: new Date().toLocaleString(),
    note: document.getElementById("user-note").value,
    sets: [...document.querySelectorAll(".set-row")].map((r, i) => {
      const inputs = r.querySelectorAll("input");
      return {
        set: i + 1,
        reps: inputs[0].value || "0",
        weight: requiresWeight ? (inputs[1]?.value || "0") : null
      };
    })
  };

  historyData.unshift(data); // Add new log at the top
  localStorage.setItem(historyKey, JSON.stringify(historyData));

  renderHistory();
  alert("✅ Workout log saved and added to history!");
});

// === Cancel Button ===
document.getElementById("cancel-btn").addEventListener("click", () => {
  window.location.href = "workouts.html";
});

// === Clear History Button ===
document.getElementById("clear-history-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all history for this exercise?")) {
    historyData = [];
    localStorage.removeItem(historyKey);
    renderHistory();
    alert("🗑️ History cleared for this exercise.");
  }
});

// After creating each workout card
if (localStorage.getItem(`${workout.name}-completed`) === "true") {
  card.classList.add("completed");
}

// When you finish a workout on its detail page
document.getElementById("save-log").addEventListener("click", () => {
  localStorage.setItem(`${currentWorkout.name}-completed`, "true");
});

// Get current exercise
const currentExercise = JSON.parse(localStorage.getItem("selectedExercise"));
const currentWeek = localStorage.getItem("currentWeek") || "week1";
const currentDay = localStorage.getItem("currentDay") || "day1";

const saveBtn = document.getElementById("save-log");

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    // Save the completion flag for this exercise
    localStorage.setItem(`${currentExercise.name}-completed`, "true");

    // Also update the day’s progress state
    localStorage.setItem(`${currentWeek}-${currentDay}-${currentExercise.name}`, "completed");

    // Let the user know it’s saved
    alert("✅ Workout logged and saved!");

    // Optionally redirect back to the workouts page
    window.location.href = "workouts.html";
  });
}
