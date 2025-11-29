const workoutsData = {
  week1: {
    day1: [
      { name: "Chin Up", muscle: "Back", setType: "Normal Set", reps: "10/10/10", tempo: "3010", image: "assets/images/chinup.jpg" },
      { name: "Incline Press (Smith Machine)", muscle: "Chest", setType: "Normal Set", reps: "12/10/8", tempo: "3010", image: "assets/images/incline-press.jpg" },
      { name: "Machine Iso Row", muscle: "Back", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/machine-row.jpg" },
      { name: "Barbell Shoulder Press", muscle: "Shoulders", setType: "Normal Set", reps: "12/10/8", tempo: "3010", image: "assets/images/shoulder-press.jpg" },
      { name: "Cable Flys", muscle: "Chest", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/cable-flys.jpg" },
      { name: "Seated Lateral Raise", muscle: "Shoulders", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/lateral-raise.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ],
    day2: [
      { name: "Seated Calf Raise", muscle: "Calves", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/calf-raise.jpg" },
      { name: "Seated Leg Curl", muscle: "Hamstrings", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/leg-curl.jpg" },
      { name: "Leg Press", muscle: "Quadriceps, Legs", setType: "Normal Set", reps: "20/15/12", tempo: "3010", image: "assets/images/leg-press.jpg" },
      { name: "Romanian Deadlift", muscle: "Back, Hamstrings, Glutes", setType: "Normal Set", reps: "15/15", tempo: "3010", image: "assets/images/deadlift.jpg" },
      { name: "Leg Extension", muscle: "Quadriceps, Legs", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/leg-extension.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ],
    day3: [
      { name: "Preacher Curls", muscle: "Biceps", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/preacher-curl.jpg" },
      { name: "Tricep Push Down", muscle: "Triceps", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/tricep-pushdown.jpg" },
      { name: "Incline Hammer Curls", muscle: "Biceps", setType: "Normal Set", reps: "12/10/10", tempo: "3010", image: "assets/images/hammer-curl.jpg" },
      { name: "Face Pull", muscle: "Back, Shoulders", setType: "Normal Set", reps: "15/15/15", tempo: "3010", image: "assets/images/face-pull.jpg" },
      { name: "Alternating Heel Touches", muscle: "Core", setType: "Normal Set", reps: "15/15/15", tempo: "3010", image: "assets/images/heel-touches.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ]
  },
  // Week 2–4 reuse Week 1 workouts for now (you can edit later)
  week2: {
    day1: [
      { name: "Chin Up", muscle: "Back", setType: "Normal Set", reps: "10/10/10", tempo: "3010", image: "assets/images/chinup.jpg" },
      { name: "Incline Press (Smith Machine)", muscle: "Chest", setType: "Normal Set", reps: "12/10/8", tempo: "3010", image: "assets/images/incline-press.jpg" },
      { name: "Machine Iso Row", muscle: "Back", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/machine-row.jpg" },
      { name: "Barbell Shoulder Press", muscle: "Shoulders", setType: "Normal Set", reps: "12/10/8", tempo: "3010", image: "assets/images/shoulder-press.jpg" },
      { name: "Cable Flys", muscle: "Chest", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/cable-flys.jpg" },
      { name: "Seated Lateral Raise", muscle: "Shoulders", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/lateral-raise.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ],
    day2: [
      { name: "Seated Calf Raise", muscle: "Calves", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/calf-raise.jpg" },
      { name: "Seated Leg Curl", muscle: "Hamstrings", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/leg-curl.jpg" },
      { name: "Leg Press", muscle: "Quadriceps, Legs", setType: "Normal Set", reps: "20/15/12", tempo: "3010", image: "assets/images/leg-press.jpg" },
      { name: "Romanian Deadlift", muscle: "Back, Hamstrings, Glutes", setType: "Normal Set", reps: "15/15", tempo: "3010", image: "assets/images/deadlift.jpg" },
      { name: "Leg Extension", muscle: "Quadriceps, Legs", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/leg-extension.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ],
    day3: [
      { name: "Preacher Curls", muscle: "Biceps", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/preacher-curl.jpg" },
      { name: "Tricep Push Down", muscle: "Triceps", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/tricep-pushdown.jpg" },
      { name: "Incline Hammer Curls", muscle: "Biceps", setType: "Normal Set", reps: "12/10/10", tempo: "3010", image: "assets/images/hammer-curl.jpg" },
      { name: "Face Pull", muscle: "Back, Shoulders", setType: "Normal Set", reps: "15/15/15", tempo: "3010", image: "assets/images/face-pull.jpg" },
      { name: "Alternating Heel Touches", muscle: "Core", setType: "Normal Set", reps: "15/15/15", tempo: "3010", image: "assets/images/heel-touches.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ]
  },
  week3: {
    day1: [
      { name: "Chin Up", muscle: "Back", setType: "Normal Set", reps: "10/10/10", tempo: "3010", image: "assets/images/chinup.jpg" },
      { name: "Incline Press (Smith Machine)", muscle: "Chest", setType: "Normal Set", reps: "12/10/8", tempo: "3010", image: "assets/images/incline-press.jpg" },
      { name: "Machine Iso Row", muscle: "Back", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/machine-row.jpg" },
      { name: "Barbell Shoulder Press", muscle: "Shoulders", setType: "Normal Set", reps: "12/10/8", tempo: "3010", image: "assets/images/shoulder-press.jpg" },
      { name: "Cable Flys", muscle: "Chest", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/cable-flys.jpg" },
      { name: "Seated Lateral Raise", muscle: "Shoulders", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/lateral-raise.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ],
    day2: [
      { name: "Seated Calf Raise", muscle: "Calves", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/calf-raise.jpg" },
      { name: "Seated Leg Curl", muscle: "Hamstrings", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/leg-curl.jpg" },
      { name: "Leg Press", muscle: "Quadriceps, Legs", setType: "Normal Set", reps: "20/15/12", tempo: "3010", image: "assets/images/leg-press.jpg" },
      { name: "Romanian Deadlift", muscle: "Back, Hamstrings, Glutes", setType: "Normal Set", reps: "15/15", tempo: "3010", image: "assets/images/deadlift.jpg" },
      { name: "Leg Extension", muscle: "Quadriceps, Legs", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/leg-extension.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ],
    day3: [
      { name: "Preacher Curls", muscle: "Biceps", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/preacher-curl.jpg" },
      { name: "Tricep Push Down", muscle: "Triceps", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/tricep-pushdown.jpg" },
      { name: "Incline Hammer Curls", muscle: "Biceps", setType: "Normal Set", reps: "12/10/10", tempo: "3010", image: "assets/images/hammer-curl.jpg" },
      { name: "Face Pull", muscle: "Back, Shoulders", setType: "Normal Set", reps: "15/15/15", tempo: "3010", image: "assets/images/face-pull.jpg" },
      { name: "Alternating Heel Touches", muscle: "Core", setType: "Normal Set", reps: "15/15/15", tempo: "3010", image: "assets/images/heel-touches.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ]
  },
  week4: {
    day1: [
      { name: "Chin Up", muscle: "Back", setType: "Normal Set", reps: "10/10/10", tempo: "3010", image: "assets/images/chinup.jpg" },
      { name: "Incline Press (Smith Machine)", muscle: "Chest", setType: "Normal Set", reps: "12/10/8", tempo: "3010", image: "assets/images/incline-press.jpg" },
      { name: "Machine Iso Row", muscle: "Back", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/machine-row.jpg" },
      { name: "Barbell Shoulder Press", muscle: "Shoulders", setType: "Normal Set", reps: "12/10/8", tempo: "3010", image: "assets/images/shoulder-press.jpg" },
      { name: "Cable Flys", muscle: "Chest", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/cable-flys.jpg" },
      { name: "Seated Lateral Raise", muscle: "Shoulders", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/lateral-raise.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ],
    day2: [
      { name: "Seated Calf Raise", muscle: "Calves", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/calf-raise.jpg" },
      { name: "Seated Leg Curl", muscle: "Hamstrings", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/leg-curl.jpg" },
      { name: "Leg Press", muscle: "Quadriceps, Legs", setType: "Normal Set", reps: "20/15/12", tempo: "3010", image: "assets/images/leg-press.jpg" },
      { name: "Romanian Deadlift", muscle: "Back, Hamstrings, Glutes", setType: "Normal Set", reps: "15/15", tempo: "3010", image: "assets/images/deadlift.jpg" },
      { name: "Leg Extension", muscle: "Quadriceps, Legs", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/leg-extension.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ],
    day3: [
      { name: "Preacher Curls", muscle: "Biceps", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/preacher-curl.jpg" },
      { name: "Tricep Push Down", muscle: "Triceps", setType: "Normal Set", reps: "15/12/10", tempo: "3010", image: "assets/images/tricep-pushdown.jpg" },
      { name: "Incline Hammer Curls", muscle: "Biceps", setType: "Normal Set", reps: "12/10/10", tempo: "3010", image: "assets/images/hammer-curl.jpg" },
      { name: "Face Pull", muscle: "Back, Shoulders", setType: "Normal Set", reps: "15/15/15", tempo: "3010", image: "assets/images/face-pull.jpg" },
      { name: "Alternating Heel Touches", muscle: "Core", setType: "Normal Set", reps: "15/15/15", tempo: "3010", image: "assets/images/heel-touches.jpg" },
      { name: "Cardio Session", muscle: "Cardio", setType: "Normal Set", reps: "1 set", tempo: "30 min", image: "assets/images/cardio.jpg" }
    ]
  }
};

// Clone week1 workouts into week2–4
//["week2", "week3", "week4"].forEach(week => {
//  workoutsData[week].day1 = JSON.parse(JSON.stringify(workoutsData.week1.day1));
//  workoutsData[week].day2 = JSON.parse(JSON.stringify(workoutsData.week1.day2));
//  workoutsData[week].day3 = JSON.parse(JSON.stringify(workoutsData.week1.day3));
//});
