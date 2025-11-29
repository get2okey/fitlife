// exercise.js
// Advanced logging, previous-set display, PB detection, and one-log-per-day behavior.

// --- Helpers ---
function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

//Mobile Haptic Feedback (vibration)
function vibrate(ms) {
  if (navigator.vibrate) {
    navigator.vibrate(ms);
  }
}


function parseJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch(e) { return fallback; }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Load selected exercise saved by workouts list ---
const exercise = JSON.parse(localStorage.getItem("selectedExercise") || "null");
if (!exercise) {
  console.error("No selectedExercise found in localStorage.");
  // optional: redirect back
  // window.location.href = "workouts.html";
}

// DOM references
const setsContainer = document.getElementById("sets-container");
const userNote = document.getElementById("user-note");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const completionStatus = document.getElementById("completion-status");
const completionText = document.getElementById("completion-text");
const historyContent = document.getElementById("history-content");
const historySummaryBox = document.getElementById("history-summary");

// keys
const historyKey = `history-${exercise.name}`;
const pbKey = `pb-${exercise.name}`;
const completedKey = `${exercise.name}-completed`;

// config
const TOTAL_SETS = 3; // if variable sets needed later, adapt

// --- Load previous history and personal best ---
let historyData = parseJSON(historyKey, []); // array of entries (most recent first)
let personalBest = parseJSON(pbKey, null);

// Helper to find most recent log (not today)
function getMostRecentLog() {
  if (!historyData || historyData.length === 0) return null;
  return historyData[0]; // we store newest first
}

// --- Build UI: sets rows with inputs, previous values, tick button ---
// ----------------- REPLACED buildSets() -----------------
function buildSets() {
  setsContainer.innerHTML = "";
  const previous = getMostRecentLog();
	  
	  // --- Rest timer block (1:30 default) ---
	// REST BLOCK UI
	const restBlock = document.createElement("div");
	restBlock.innerHTML = `
	  <div class="rest-card">
		  <div>
			  <h2>Rest</h2>
			   <p id="rest-timer-text">for 1:30 min</p>
		  </div>
		  <button id="rest-play" class="rest-play-btn">▶</button>
	  </div>
	  <p class="rest-sub">Rest between each set</p>
	`;
	setsContainer.appendChild(restBlock);

	
	
	// Attach play button after UI is inserted
	setTimeout(() => {
	  const playBtn = document.getElementById("rest-play");
	  playBtn.addEventListener("click", () => {
		if (!restInterval) startRest();
		else stopRest();
		vibrate(40);
	  });
	}, 20);


  

  for (let i = 1; i <= TOTAL_SETS; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "set-wrapper";

    const row = document.createElement("div");
    row.className = "set-row";

    const numLabel = document.createElement("div");
    numLabel.className = "set-num";
    numLabel.textContent = i;

    const inputsWrap = document.createElement("div");
    inputsWrap.className = "set-inputs";

    // Reps box
    const repsBox = document.createElement("div");
    repsBox.className = "reps-box empty";
    repsBox.contentEditable = "true";
    repsBox.dataset.type = "reps";
    repsBox.textContent = previous && previous.sets && previous.sets[i-1] ? previous.sets[i-1].reps : "";

    // Weight box
    const requiresWeight = exercise.name.toLowerCase() !== "chin up";
    const weightBox = document.createElement("div");
    weightBox.className = "weight-box empty";
    weightBox.contentEditable = "true";
    weightBox.dataset.type = "weight";
    weightBox.textContent = (requiresWeight && previous && previous.sets && previous.sets[i-1]) ? (previous.sets[i-1].weight || "") : "";
    if (!requiresWeight) weightBox.style.display = "none";

    inputsWrap.appendChild(repsBox);
    if (requiresWeight) inputsWrap.appendChild(weightBox);

    // Tick
    const tickBtn = document.createElement("button");
    tickBtn.type = "button";
    tickBtn.className = "set-check";
    tickBtn.setAttribute("aria-pressed", "false");
    tickBtn.innerHTML = "✔";

    // previous text
    const prevText = document.createElement("div");
    prevText.className = "prev-text";
    if (previous && previous.sets && previous.sets[i-1]) {
      const prev = previous.sets[i-1];
      prevText.textContent = (requiresWeight && prev.weight && prev.weight !== "0") ? `Previous ${prev.reps} R x ${prev.weight}kg` : `Previous ${prev.reps} R`;
    } else prevText.textContent = "";

    // assemble dom
    row.appendChild(numLabel);
    row.appendChild(inputsWrap);
    row.appendChild(tickBtn);
    wrapper.appendChild(row);
    wrapper.appendChild(prevText);
    setsContainer.appendChild(wrapper);

    // contenteditable placeholder behaviour
    [repsBox, weightBox].forEach(box => {
      box.addEventListener("focus", () => box.classList.remove("empty"));
      box.addEventListener("blur", () => {
        if (!box.textContent.trim()) box.classList.add("empty");
      });
    });

    // tick handler
    tickBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pressed = tickBtn.getAttribute("aria-pressed") === "true";
      if (!pressed) {
        tickBtn.setAttribute("aria-pressed", "true");
        tickBtn.classList.add("completed");
      } else {
        tickBtn.setAttribute("aria-pressed", "false");
        tickBtn.classList.remove("completed");
      }
      vibrate(40);
      updateFooterText();
	  
	  // AUTO START REST TIMER WHEN A SET IS COMPLETED (except final set)
		const setIndex = i;  
		if (!pressed && setIndex < TOTAL_SETS) {
			startRest();  
		}
	  
    });
  }

  updateFooterText();
}


let restInterval = null;
let restSeconds = 90; // 1:30

function formatRest(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function startRest() {
  const playBtn = document.getElementById("rest-play");
  const timeText = document.getElementById("rest-timer-text"); // <--- REQUIRED
  playBtn.textContent = "⏸";

  restInterval = setInterval(() => {
    restSeconds--;

    // ✅ Update visible countdown
    timeText.textContent = `for ${formatRest(restSeconds)} min`;

    if (restSeconds <= 0) {
      clearInterval(restInterval);
      restInterval = null;
      restSeconds = 90;

      timeText.textContent = "for 1:30 min";
      playBtn.textContent = "▶";
      vibrate(120);
      alert("Rest complete");
    }
  }, 1000);
}

function stopRest() {
  const playBtn = document.getElementById("rest-play");
  const timeText = document.getElementById("rest-timer-text");

  clearInterval(restInterval);
  restInterval = null;

  restSeconds = 90;
  timeText.textContent = "for 1:30 min"; // Reset text
  playBtn.textContent = "▶";
}




// --- Update footer message depending on ticks ---
function updateFooterText() {
  const tickButtons = Array.from(document.querySelectorAll(".set-check"));
  const marked = tickButtons.filter(b => b.getAttribute("aria-pressed") === "true").length;

  if (marked === 0) {
    completionStatus.style.display = "none";
    completionText.textContent = "No sets have been marked yet.";
  } else if (marked < TOTAL_SETS) {
    completionStatus.style.display = "none";
    completionText.textContent = `You have marked ${marked} out of ${TOTAL_SETS} sets.`;
  } else {
    completionStatus.style.display = "block";
    completionText.textContent = "You have marked all sets.";
  }
}

// --- Render history (keeps one entry per day; historyData is array newest-first) ---
function renderHistory() {
  if (!historyContent) return;
  const historyContainer = historyContent;

  if (!historyData || historyData.length === 0) {
    historyContainer.innerHTML = `<p>No previous history yet. Complete this exercise to start tracking!</p>`;
    if (historySummaryBox) historySummaryBox.innerHTML = "";
    return;
  }

  // ✅ Parse Australian date format (DD/MM/YYYY)
  function parseAusDate(dateStr) {
    // Example: "01/11/2025, 07:14:04"
    const [datePart] = dateStr.split(",");
    const [day, month, year] = datePart.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  // ✅ Collect valid parsed dates
  const validDates = historyData
    .map(h => {
      if (h.dateISO) return new Date(h.dateISO);
      if (h.date && h.date.includes("/")) return parseAusDate(h.date);
      return null;
    })
    .filter(d => d && !isNaN(d.getTime()));

  // ✅ Build summary text
  if (validDates.length > 0) {
    const firstDate = validDates[validDates.length - 1]; // oldest
    const month = firstDate.toLocaleString("default", { month: "short" });
    const year = firstDate.getFullYear();
    if (historySummaryBox) {
      historySummaryBox.innerHTML = `🏋️ You’ve completed this exercise <strong>${historyData.length} time${historyData.length > 1 ? "s" : ""}</strong> since <strong>${month} ${year}</strong>`;
    }
  } else {
    if (historySummaryBox) {
      historySummaryBox.innerHTML = `🏋️ You’ve completed this exercise <strong>${historyData.length} time${historyData.length > 1 ? "s" : ""}</strong>`;
    }
  }

  // ✅ Render entries
historyContainer.innerHTML = historyData.map(entry => {
  const setsHtml = entry.sets.map(s => {
    if (s.time) return `<li>Time: ${s.time} ${s.completed ? '✅' : ''}</li>`;
    return `<li>Set ${s.set}: ${s.reps} reps${s.weight ? ` @ ${s.weight}kg` : ''}</li>`;
  }).join("");
  return `
    <div class="history-card">
      <div class="history-meta">${entry.date || "Unknown Date"}</div>
      <ul>${setsHtml}</ul>
      ${entry.note ? `<p>${entry.note}</p>` : ""}
    </div>
  `;
}).join("");

}



// --- Show personal best modal (simple) ---
function showPersonalBestModal(weight) {
  // create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.background = "rgba(0,0,0,0.6)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 9999;

  const modal = document.createElement("div");
  modal.style.background = "#fff";
  modal.style.padding = "30px";
  modal.style.borderRadius = "12px";
  modal.style.width = "90%";
  modal.style.maxWidth = "420px";
  modal.style.textAlign = "center";
  modal.innerHTML = `
    <div style="font-size:52px;">🏆</div>
    <h2 style="margin:8px 0 0 0;">New Personal Best</h2>
    <div style="font-size:40px;margin:12px 0;font-weight:700;">${weight} kg</div>
    <p style="color:#555;padding:0 8px;">Congratulations, you have recorded a new personal best in ${exercise.name}.</p>
  `;

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next Exercise";
  nextBtn.style.marginTop = "18px";
  nextBtn.style.background = "#1e3a8a";
  nextBtn.style.color = "#fff";
  nextBtn.style.border = "none";
  nextBtn.style.padding = "12px 20px";
  nextBtn.style.borderRadius = "30px";
  nextBtn.style.fontWeight = "700";

nextBtn.addEventListener("click", () => {
  document.body.removeChild(overlay);

  const currentWeek = localStorage.getItem("currentWeek") || "week1";
  const currentDay = localStorage.getItem("currentDay") || "day1";

  if (!workoutsData[currentWeek] || !workoutsData[currentWeek][currentDay]) {
    alert("Workouts not found for current day.");
    window.location.href = "workouts.html";
    return;
  }

  const workouts = workoutsData[currentWeek][currentDay];
  const currentExercise = JSON.parse(localStorage.getItem("selectedExercise"));
  const index = workouts.findIndex(w => w.name === currentExercise.name);


  const next = workouts[index + 1];
  if (next) {
	localStorage.setItem("selectedExercise", JSON.stringify(next));
	localStorage.setItem("lastOpenedExercise", next.name);   // ⭐ NEW — for smooth scroll
	window.location.href = "exercise.html";
  } else {
    alert("🎉 All exercises completed for this day!");
    window.location.href = "workouts.html";
  }
});

  modal.appendChild(nextBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}


// --- Save log: ensures only one log per day; updates history, PB, completed flag ---
function saveLog() {
		
	
  const rows = Array.from(document.querySelectorAll(".set-row"));
  if (rows.length === 0) return;

  const sets = rows.map((r, idx) => {
    const repsInput = r.querySelector(".reps-input");
    const weightInput = r.querySelector(".weight-input");
    return {
      set: idx + 1,
      reps: repsInput ? (repsInput.value || "0") : "0",
      weight: weightInput ? (weightInput.value || "0") : null
    };
  });

  const note = userNote ? userNote.value.trim() : "";

  const entry = {
    dateISO: todayISO(),
    date: new Date().toLocaleString(),
    note,
    sets
  };

  // check existing entry for same day (match dateISO)
  const existingIndex = historyData.findIndex(h => h.dateISO === entry.dateISO);
  if (existingIndex >= 0) {
    // update that day's entry
    historyData[existingIndex] = entry;
  } else {
    // add newest-first
    historyData.unshift(entry);
  }

  // trim history length if you want (optional) - keep last 365 logs
  if (historyData.length > 365) historyData.length = 365;

  setJSON(historyKey, historyData);

  // update personal best if any weight is new highest
  const numericWeights = sets
    .map(s => parseFloat(s.weight || 0))
    .filter(w => !isNaN(w));

  if (numericWeights.length > 0) {
    const sessionMax = Math.max(...numericWeights);
    const prevPB = personalBest === null ? 0 : parseFloat(personalBest);
    if (sessionMax > prevPB) {
      personalBest = sessionMax;
      setJSON(pbKey, personalBest);
      // show PB modal
      setTimeout(() => showPersonalBestModal(sessionMax), 300);
    }
  }
  
  
	// At top of saveLog(), add this branch (or replace current cardio code)
	if (exercise.muscle && exercise.muscle.toLowerCase() === "cardio") {
	  const timerInput = document.getElementById("cardio-timer");
	  const tick = document.getElementById("cardio-check");
	  const timerValue = timerInput ? timerInput.value : (exercise.timer || "30:00");
	  const completed = tick && tick.classList.contains("completed");

	  const entry = {
		dateISO: todayISO(),
		date: new Date().toLocaleString("en-AU", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit", second:"2-digit" }),
		note: (document.getElementById("user-note") ? document.getElementById("user-note").value.trim() : ""),
		sets: [{ set:1, time: timerValue, completed: !!completed }]
	  };

	  const existingIndex = historyData.findIndex(h => h.dateISO === entry.dateISO);
	  if (existingIndex >= 0) historyData[existingIndex] = entry;
	  else historyData.unshift(entry);
	  setJSON(historyKey, historyData);

	  if (completed) localStorage.setItem(completedKey, "true");
	  renderHistory();
	  updateCardioFooter();
	  alert("✅ Cardio log saved!");
	  return;
	}	
  
}

// --- Cancel behavior ---
function cancelAction() {
  // if you want to discard unsaved changes and go back:
  window.location.href = "workouts.html";
}

// --- Initialize page ---
function init() {
  // populate header
  const nameEl = document.getElementById("exercise-name");
  const imageEl = document.getElementById("exercise-image");
  const repsEl = document.getElementById("exercise-reps");
  const tempoEl = document.getElementById("exercise-tempo");
  const typeEl = document.getElementById("exercise-type");
  const muscleEl = document.getElementById("exercise-muscle");

  if (exercise) {
    if (nameEl) nameEl.textContent = exercise.name;
    if (imageEl && exercise.image) imageEl.src = exercise.image;
    if (repsEl) repsEl.textContent = `Reps ${exercise.reps}`;
    if (tempoEl) tempoEl.textContent = `Tempo ${exercise.tempo}`;
    if (typeEl) typeEl.textContent = exercise.setType;
    if (muscleEl) muscleEl.textContent = `Muscles: ${exercise.muscle}`;
  }

  // ---- CARDIO DETECTION ----
  const isCardio =
    (exercise.muscle && exercise.muscle.toLowerCase() === "cardio") ||
    (exercise.name && exercise.name.toLowerCase().includes("cardio")) ||
    (exercise.tempo && exercise.tempo.toLowerCase().includes("min"));

  // ---- CARDIO MODE ----
  if (isCardio) {
    buildCardioUI();
    historyData = parseJSON(historyKey, []);
    renderHistory();
    personalBest = parseJSON(pbKey, personalBest);

    if (saveBtn) saveBtn.addEventListener("click", saveLog);
    if (cancelBtn) cancelBtn.addEventListener("click", cancelAction);

    const todayIndex = historyData.findIndex(h => h.dateISO === todayISO());
    if (todayIndex >= 0) {
      const entry = historyData[todayIndex];
      const timer = document.getElementById("cardio-timer");
      const tick = document.getElementById("cardio-check");
      const note = document.getElementById("user-note");

      if (timer && entry.sets[0]?.time) timer.value = entry.sets[0].time;
      if (tick && entry.sets[0]?.completed) tick.classList.add("completed");
      if (note && entry.note) note.value = entry.note;
    }

    return; // STOP strength mode
  }

  // ---- STRENGTH MODE ----
  buildSets();
  renderHistory();
  updateFooterText();

  personalBest = parseJSON(pbKey, personalBest);

  // FIX: define todayIndex before use
  const todayIndex = historyData.findIndex(h => h.dateISO === todayISO());
  if (todayIndex >= 0) {
    const todayEntry = historyData[todayIndex];
    const rows = Array.from(document.querySelectorAll(".set-wrapper"));

    rows.forEach((r, idx) => {
      const repsBox = r.querySelector(".reps-box");
      const weightBox = r.querySelector(".weight-box");

      if (todayEntry.sets[idx]) {
        if (repsBox) {
          repsBox.textContent = todayEntry.sets[idx].reps || "";
          if (repsBox.textContent) repsBox.classList.remove("empty");
        }
        if (weightBox) {
          weightBox.textContent = todayEntry.sets[idx].weight || "";
          if (weightBox.textContent) weightBox.classList.remove("empty");
        }

        const tick = r.querySelector(".set-check");
        if (tick) {
          if (todayEntry.sets[idx].reps && todayEntry.sets[idx].reps !== "0") {
            tick.classList.add("completed");
            tick.setAttribute("aria-pressed", "true");
          }
        }
      }
    });

    if (userNote && todayEntry.note) userNote.value = todayEntry.note;
    updateFooterText();
  }
}


init();


// --------------------------------------------
// FIXED + MATCHING CARDIO UI
// --------------------------------------------

// ----------------- Cardio UI & Timer -----------------
let cardioInterval = null;

function buildCardioUI() {
  setsContainer.innerHTML = "";

  // top card
  const top = document.createElement("div");
  top.className = "card-top cardio-top-card";
  top.innerHTML = `<div><h2>1 Set</h2><p>${exercise.tempo || "30 min"}</p></div>
                   <div></div>`;
  setsContainer.appendChild(top);

  // timer row
  const row = document.createElement("div");
  row.className = "cardio-row";
  row.innerHTML = `
    <div class="cardio-number">1</div>
    <input id="cardio-timer" class="timer-display" value="${exercise.timer || (exercise.tempo ? (exercise.tempo.includes("min") ? exercise.tempo.replace(" min","") + ":00" : "30:00") : "30:00")}" />
    <button id="cardio-play" class="timer-play">▶</button>
    <button id="cardio-reset" class="timer-reset">↺</button>
    <button id="cardio-check" class="timer-check" aria-pressed="false">✔</button>
  `;
  setsContainer.appendChild(row);

  // hint and note
  const hint = document.createElement("p");
  hint.className = "cardio-sub center";
  hint.textContent = "You can set the time here";
  setsContainer.appendChild(hint);

 // const note = document.createElement("textarea");
 // note.id = "user-note";
 // note.className = "note-box";
 // note.placeholder = "Add your note here...";
 // if (userNote && userNote.value) note.value = userNote.value;
 // setsContainer.appendChild(note);

  // restore today's saved cardio log if exists
  historyData = parseJSON(historyKey, []);
  const todayIdx = historyData.findIndex(h => h.dateISO === todayISO());
  if (todayIdx >= 0 && historyData[todayIdx].sets && historyData[todayIdx].sets[0]) {
    const s = historyData[todayIdx].sets[0];
    const timerInput = document.getElementById("cardio-timer");
    if (s.time) timerInput.value = s.time;
    if (s.completed) {
      const tick = document.getElementById("cardio-check");
      tick.setAttribute("aria-pressed", "true");
      tick.classList.add("completed");
    }
    if (historyData[todayIdx].note && note) note.value = historyData[todayIdx].note;
  }

  // handlers
  document.getElementById("cardio-play").addEventListener("click", () => {
    toggleCardioTimer();
  });
  document.getElementById("cardio-reset").addEventListener("click", () => {
    stopCardioTimer();
    const input = document.getElementById("cardio-timer");
    const defaultSecs = mmssToSeconds(input.value) || 1800;
    input.value = secondsToMMSS(defaultSecs);
  });
  document.getElementById("cardio-check").addEventListener("click", (e) => {
    e.stopPropagation();
    const tick = e.currentTarget;
    const pressed = tick.getAttribute("aria-pressed") === "true";
    if (!pressed) { tick.setAttribute("aria-pressed","true"); tick.classList.add("completed"); }
    else { tick.setAttribute("aria-pressed","false"); tick.classList.remove("completed"); }
    vibrate(40);
    updateCardioFooter();
  });

  updateCardioFooter();
}

function mmssToSeconds(mmss) {
  const p = String(mmss).split(":").map(n=>parseInt(n,10));
  if (p.length !== 2 || isNaN(p[0]) || isNaN(p[1])) return null;
  return p[0]*60 + p[1];
}
function secondsToMMSS(s) { const m=Math.floor(s/60), sec=s%60; return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`; }

function toggleCardioTimer() {
  const input = document.getElementById("cardio-timer");
  if (!input) return;
  if (cardioInterval) {
    // pause
    clearInterval(cardioInterval); cardioInterval = null;
    document.getElementById("cardio-play").textContent = "▶";
    vibrate(20);
    return;
  }
  // start
  let secs = mmssToSeconds(input.value);
  if (secs === null) return alert("Use mm:ss format");
  document.getElementById("cardio-play").textContent = "⏸";
  vibrate(40);
  cardioInterval = setInterval(() => {
    if (secs <= 0) {
      clearInterval(cardioInterval); cardioInterval = null;
      document.getElementById("cardio-play").textContent = "▶";
      vibrate(120);
      // mark tick
      const tick = document.getElementById("cardio-check");
      if (tick) { tick.setAttribute("aria-pressed","true"); tick.classList.add("completed"); }
      updateCardioFooter();
      setTimeout(()=> alert("⏱ Cardio complete!"), 250);
      return;
    }
    secs--;
    input.value = secondsToMMSS(secs);
  }, 1000);
}
function stopCardioTimer() { if (cardioInterval) { clearInterval(cardioInterval); cardioInterval = null; document.getElementById("cardio-play").textContent = "▶"; } }

function updateCardioFooter() {
  const tick = document.getElementById("cardio-check");
  const completed = tick && tick.classList.contains("completed");
  if (!completed) {
    completionStatus.style.display = "none";
    completionText.textContent = "No sets have been marked yet.";
  } else {
    completionStatus.style.display = "block";
    completionText.textContent = "You have marked all sets.";
  }
}

// Tab switching logic
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active state from all buttons
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    // Add active to this one
    btn.classList.add("active");

    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

    // Show selected tab
    const tabId = btn.dataset.tab;
    const selected = document.getElementById(tabId);
    if (selected) selected.classList.add("active");
  });
});

document.querySelector('.tab-btn[data-tab="log"]').click();