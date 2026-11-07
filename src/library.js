/* ===== exercise library =====
 name | muscle group | equipment | sets | reps | starting kg | rest s | popular(1) */
const LIB_RAW=`Barbell Bench Press|Chest|Barbell|3|8|60|120|1
Incline Barbell Bench Press|Chest|Barbell|3|8|50|120|1
Decline Bench Press|Chest|Barbell|3|8|50|120|0
Dumbbell Bench Press|Chest|Dumbbell|3|10|24|90|1
Incline Dumbbell Press|Chest|Dumbbell|3|10|20|90|1
Chest Press Machine|Chest|Machine|3|10|45|75|1
Incline Chest Press Machine|Chest|Machine|3|10|40|75|0
Smith Machine Bench Press|Chest|Smith|3|8|50|90|0
Pec Deck|Chest|Machine|3|12|35|60|1
Cable Fly|Chest|Cable|3|12|15|60|1
Low to High Cable Fly|Chest|Cable|3|12|10|60|0
Dumbbell Fly|Chest|Dumbbell|3|12|12|60|0
Push Up|Chest|Bodyweight|3|15|0|60|1
Chest Dip|Chest|Bodyweight|3|10|0|90|0
Deadlift|Back|Barbell|3|5|100|180|1
Lat Pulldown|Back|Cable|3|10|50|90|1
Close Grip Lat Pulldown|Back|Cable|3|10|45|90|0
Pull Up|Back|Bodyweight|3|8|0|120|1
Chin Up|Back|Bodyweight|3|8|0|120|0
Assisted Pull Up Machine|Back|Machine|3|10|30|90|1
Seated Cable Row|Back|Cable|3|10|50|90|1
Barbell Row|Back|Barbell|3|8|60|120|1
Dumbbell Row|Back|Dumbbell|3|10|26|90|1
T-Bar Row|Back|Barbell|3|10|40|90|0
Chest Supported Row Machine|Back|Machine|3|10|45|90|1
Machine Row|Back|Machine|3|10|50|90|0
Straight Arm Pulldown|Back|Cable|3|12|25|60|0
Back Extension|Back|Bodyweight|3|12|0|60|0
Rack Pull|Back|Barbell|3|5|120|180|0
Overhead Press|Shoulders|Barbell|3|8|40|120|1
Dumbbell Shoulder Press|Shoulders|Dumbbell|3|10|18|90|1
Shoulder Press Machine|Shoulders|Machine|3|10|35|90|1
Arnold Press|Shoulders|Dumbbell|3|10|14|90|0
Lateral Raise|Shoulders|Dumbbell|3|15|8|45|1
Cable Lateral Raise|Shoulders|Cable|3|15|5|45|0
Machine Lateral Raise|Shoulders|Machine|3|15|20|45|0
Front Raise|Shoulders|Dumbbell|3|12|8|45|0
Rear Delt Fly|Shoulders|Dumbbell|3|15|6|45|0
Reverse Pec Deck|Shoulders|Machine|3|15|25|45|1
Face Pull|Shoulders|Cable|3|15|20|60|1
Upright Row|Shoulders|Barbell|3|12|25|60|0
Shrug|Shoulders|Dumbbell|3|12|30|60|0
Barbell Curl|Arms|Barbell|3|10|25|60|1
Dumbbell Curl|Arms|Dumbbell|3|10|12|60|1
Hammer Curl|Arms|Dumbbell|3|12|14|60|1
EZ Bar Curl|Arms|Barbell|3|10|25|60|0
Preacher Curl|Arms|Machine|3|10|25|60|1
Cable Curl|Arms|Cable|3|12|20|60|0
Incline Dumbbell Curl|Arms|Dumbbell|3|10|10|60|0
Concentration Curl|Arms|Dumbbell|3|12|10|45|0
Tricep Pushdown|Arms|Cable|3|12|25|60|1
Rope Pushdown|Arms|Cable|3|12|20|60|1
Overhead Tricep Extension|Arms|Cable|3|12|20|60|1
Skull Crusher|Arms|Barbell|3|10|25|60|0
Close Grip Bench Press|Arms|Barbell|3|8|50|90|0
Tricep Dip Machine|Arms|Machine|3|12|40|60|0
Wrist Curl|Arms|Dumbbell|3|15|8|45|0
Back Squat|Legs|Barbell|3|8|80|150|1
Front Squat|Legs|Barbell|3|8|60|150|0
Leg Press|Legs|Machine|3|12|120|90|1
Hack Squat|Legs|Machine|3|10|60|120|1
Smith Machine Squat|Legs|Smith|3|10|60|120|0
Pendulum Squat|Legs|Machine|3|10|40|120|0
Goblet Squat|Legs|Dumbbell|3|12|24|75|1
Bulgarian Split Squat|Legs|Dumbbell|3|10|14|90|1
Walking Lunge|Legs|Dumbbell|3|12|16|75|1
Step Up|Legs|Dumbbell|3|10|12|75|0
Leg Extension|Legs|Machine|3|12|40|60|1
Lying Leg Curl|Legs|Machine|3|12|35|60|1
Seated Leg Curl|Legs|Machine|3|12|40|60|1
Romanian Deadlift|Legs|Barbell|3|10|70|120|1
Standing Calf Raise|Legs|Machine|3|15|60|45|1
Seated Calf Raise|Legs|Machine|3|15|40|45|0
Hip Thrust|Glutes|Barbell|3|10|80|90|1
Glute Bridge|Glutes|Bodyweight|3|15|0|60|0
Hip Abduction Machine|Glutes|Machine|3|15|45|45|1
Hip Adduction Machine|Glutes|Machine|3|15|45|45|1
Cable Kickback|Glutes|Cable|3|12|10|45|0
Glute Kickback Machine|Glutes|Machine|3|12|30|45|0
Sumo Deadlift|Glutes|Barbell|3|5|90|150|0
Plank|Core|Bodyweight|3|1|0|45|1
Cable Crunch|Core|Cable|3|15|30|45|1
Hanging Leg Raise|Core|Bodyweight|3|12|0|60|1
Ab Crunch Machine|Core|Machine|3|15|35|45|1
Captain's Chair Knee Raise|Core|Machine|3|12|0|45|0
Russian Twist|Core|Bodyweight|3|20|0|45|0
Ab Wheel Rollout|Core|Bodyweight|3|10|0|60|0
Decline Sit Up|Core|Bodyweight|3|15|0|45|0
Pallof Press|Core|Cable|3|12|10|45|0
Treadmill|Cardio|Cardio|1|20|0|0|1
Stationary Bike|Cardio|Cardio|1|20|0|0|1
Rowing Machine|Cardio|Cardio|1|10|0|0|1
Elliptical|Cardio|Cardio|1|20|0|0|0
Stair Climber|Cardio|Cardio|1|15|0|0|1
Assault Bike|Cardio|Cardio|1|10|0|0|0
Sled Push|Cardio|Cardio|3|1|40|90|0
Jump Rope|Cardio|Bodyweight|3|1|0|60|0`;
const LIB=LIB_RAW.split('\n').map(l=>{const [name,group,equip,sets,reps,w,rest,pop]=l.split('|');return{name,group,equip,sets:+sets,reps:+reps,w:+w,rest:+rest,pop:pop==='1'}});
const LIBMAP=Object.fromEntries(LIB.map(x=>[x.name.toLowerCase(),x]));
const GROUPS=['Chest','Back','Shoulders','Arms','Legs','Glutes','Core','Cardio'];
const groupOf=name=>(LIBMAP[name.toLowerCase()]||{}).group||'Other';

