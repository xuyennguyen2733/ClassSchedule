"use strict";

// .hour > div:nth-of-type(odd) {
//   background-color: #321547;
// }

// .hour > div:nth-of-type(even) {
//   background-color: #240f33;
// }

// background-color: #3e1b59;
// background-color: #57267c;

/****************************************************** 
 GLOBAL VERIABLES
 ******************************************************/
const weekdayList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const hourList = [];
const timeOffSet = 7;
for (let i = 0; i < 10; i++) {
  const time = indexToCalendarTime(i, timeOffSet);
  hourList.push(time);
}

const timetableHead = document.querySelector(".timetable-head");
const timetableBody = document.querySelector(".timetable-body");
const timetableSide = document.querySelector(".timetable-side");

const courseForm = document.querySelector(".course-form-container");
const btnCloseCourseForm = courseForm.querySelector(".btn--close");
const btnSaveCourseForm = courseForm.querySelector(".save-course");

const startTime = {
  day: "",
  hour: 0,
  minute: 0,
  meridiem: "",
};

const endTime = {
  hour: 0,
  minute: 0,
  meridiem: "",
};

const startTimeSelectEls = {
  day: document.querySelector(".weekday #weekday"),
  hour: document.querySelector(".start-time #hour"),
  minute: document.querySelector(".start-time #minute"),
  meridiem: document.querySelector(".start-time #meridiem"),
};
const endTimeSelectEls = {
  hour: document.querySelector(".end-time #hour"),
  minute: document.querySelector(".end-time #minute"),
  meridiem: document.querySelector(".end-time #meridiem"),
};

/******************************************************
 * ----------------------------------------------------
 *******************************************************/

/****************************************************** 
INITIAL SETUP
******************************************************/
// create timetable head cells
{
  // 1. first cell is the corner cell
  let others = {
    cellColor: "#c00000",
    textContent: "Time",
    classList: ["flex-center", "timetable-corner"],
  };
  const cornerCell = createTimetableCell("cornerLabel", others);
  timetableHead.appendChild(cornerCell);

  // 2. next cells are the labels of weekdays
  // 3. also populate the weekday droplist
  for (let i = 0; i < 5; i++) {
    others = {
      classList: ["cell-color--2", "flex-center"],
      textContent: weekdayList[i],
    };

    // add label items to table head
    const weekdayBlock = createTimetableCell("weekday-label", others);
    timetableHead.appendChild(weekdayBlock);

    // populate weekday droplist
    const weekdayDropItem = createOptionElement(weekdayList[i], weekdayList[i]);
    startTimeSelectEls.day.appendChild(weekdayDropItem);
  }
}

// create timetable body cells
{
  for (let i = 1; i <= 40; i++) {
    const others = {
      gridRow: `${i} / ${i + 1}`,
      classList: [`cell-color--${(i + 1) % 2}`, "hover-animation"],
    };

    for (let j = 0; j < 5; j++) {
      // 1. create the cell
      const cell = createTimetableCell(weekdayList[j % 5], others);

      // 2. add event listener to each cell
      cell.addEventListener("click", showCourseForm);

      // 3. add cell to body
      timetableBody.appendChild(cell);
    }
    //   const tueBlock = createTimetableCell("tuesday", others);
    //   const wedBlock = createTimetableCell("wednesday", others);
    //   const thuBlock = createTimetableCell("thursday", others);
    // const friBlock = createTimetableCell("friday", others);

    // timetableBody.appendChild(monBlock);
    // timetableBody.appendChild(tueBlock);
    // timetableBody.appendChild(wedBlock);
    // timetableBody.appendChild(thuBlock);
    // timetableBody.appendChild(friBlock);
  }
}

// create timetable side cells - starting from 8AM
for (let i = 1; i <= 10; i++) {
  const hour = hourList[i - 1][0];
  const meridiem = hourList[i - 1][1];
  const textContent = hour + meridiem;

  const others = {
    gridRow: `${i} / ${i + 1}`,
    classList: [`cell-color--${((i + 1) % 2) + 2}`, "flex-center-top"],
    textContent: textContent,
  };

  // console.log(others.textContent);

  const timeBlock = createTimetableCell("sideLabel", others);

  timetableSide.appendChild(timeBlock);
}

// Create hour droplist
for (let i = 0; i < 10; i++) {
  const startOptionEl = createOptionElement(i, hourList[i][0]);
  const endOptionEl = createOptionElement(i, hourList[i][0]);
  startTimeSelectEls.hour.appendChild(startOptionEl);
  endTimeSelectEls.hour.appendChild(endOptionEl);
}

// Create minute droplist - 5 minute intervals
for (let i = 0; i <= 60; i += 5) {
  const startOptionEl = createOptionElement(i, i);
  const endOptionEl = createOptionElement(i, i);
  startTimeSelectEls.minute.appendChild(startOptionEl);
  endTimeSelectEls.minute.appendChild(endOptionEl);
}

updateCourseTime();

/******************************************************
 * ----------------------------------------------------
 *******************************************************/

/****************************************************** 
EVENT SETUP
******************************************************/

// Event listeners
btnCloseCourseForm.addEventListener("click", hideCourseForm);
btnSaveCourseForm.addEventListener("click", logCourse);

startTimeSelectEls.day.addEventListener("change", updateCourseTime);
startTimeSelectEls.hour.addEventListener("change", updateCourseTime);
startTimeSelectEls.minute.addEventListener("change", updateCourseTime);

endTimeSelectEls.hour.addEventListener("change", updateCourseTime);
endTimeSelectEls.minute.addEventListener("change", updateCourseTime);

// startTimeSelectEls.hour.addEventListener("change", startHourChanged);

// timetable.

// Event handlers

function showCourseForm() {
  const el = this;
  const row = el.style.gridRow;
  const rowStart = row.split(" / ")[0];
  // console.log(this.classList);

  const index = Math.trunc((rowStart - 1) / 4);
  const minute = ((rowStart - 1) % 4) * 15;
  const meridiem = hourList[index][1];
  // console.log(index, hour, minute, meridiem);

  // Pre-select droplist values based on cell clicked
  startTimeSelectEls.day.value = el.classList[0];
  startTimeSelectEls.hour.value = index;
  startTimeSelectEls.minute.value = minute;
  startTimeSelectEls.meridiem.textContent = meridiem;

  courseForm.classList.remove("hidden");
}

function hideCourseForm() {
  courseForm.classList.add("hidden");
}

function logCourse() {
  const cmp = compareTime(startTime, endTime);

  if (cmp >= 0) console.log("invalid input");
  else {
    const indexStart = calendarTimeToIndex([startTime.hour, startTime.meridiem], timeOffSet);
    const indexEnd = calendarTimeToIndex([endTime.hour, endTime.meridiem], timeOffSet);

    const rowStart = indexStart * 4 + (Math.trunc(startTime.minute / 15) + 1);
    const rowEnd = indexEnd * 4 + (Math.trunc(endTime.minute / 15) + 1);

    const others = {
      gridRow: `${rowStart} / ${rowEnd}`,
      classList: [startTime.day, "course-block"],
    };
    const courseBlock = createTimetableCell(startTime.day, others);
    timetableBody.append(courseBlock);
  }
}

function updateCourseTime() {
  startTime.day = startTimeSelectEls.day.value;
  startTime.hour = hourList[startTimeSelectEls.hour.value][0];
  startTime.meridiem = hourList[startTimeSelectEls.hour.value][1];
  startTime.minute = startTimeSelectEls.minute.value;

  endTime.hour = hourList[endTimeSelectEls.hour.value][0];
  endTime.meridiem = hourList[endTimeSelectEls.hour.value][1];
  endTime.minute = endTimeSelectEls.minute.value;

  startTimeSelectEls.meridiem.textContent = startTime.meridiem;
  endTimeSelectEls.meridiem.textContent = endTime.meridiem;
}

/******************************************************
 * ----------------------------------------------------
 *******************************************************/

/*
FUNCTIONS
*/

function createOptionElement(valueAttribute, textNode) {
  const optionTag = document.createElement("option");
  const optionText = document.createTextNode(textNode);

  optionTag.setAttribute("value", valueAttribute);
  optionTag.appendChild(optionText);

  return optionTag;
}

function createTimetableCell(classAttribute, othersObj) {
  const properties = {
    gridRow: othersObj.gridRow,
    gridColumn: othersObj.gridColumn,
    cellColor: othersObj.cellColor,
    textContent: othersObj.textContent,
    classList: othersObj.classList,
  };

  const divTag = document.createElement("div");
  divTag.classList.add(classAttribute);

  if (properties.gridRow !== undefined) {
    divTag.style.gridRow = properties.gridRow;
  }

  if (properties.gridColumn !== undefined) {
    divTag.style.gridColumn = properties.gridColumn;
  }

  if (properties.cellColor !== undefined) {
    divTag.style.backgroundColor = properties.cellColor;
  }

  if (properties.textContent !== undefined) {
    divTag.textContent = properties.textContent;
  }

  if (properties.classList !== undefined) {
    for (let i = 0; i < properties.classList.length; i++) {
      divTag.classList.add(properties.classList[i]);
    }
  }

  return divTag;
}

function indexToCalendarTime(index, offset) {
  const hour = index + offset + 1;
  return [hour <= 12 ? hour : hour - 12, hour < 12 ? "AM" : "PM"];
}

function calendarTimeToIndex(time, offset) {
  const hour = time[1] === "AM" ? time[0] : time[0] + 12;
  const index = hour - offset - 1;
  return index;
}

function compareTime(startTime, endTime) {
  if (startTime.meridiem === "AM" && endTime.meridiem === "PM") return -1;
  // console.log(startTime.hour === endTime.hour && startTime.minute === endTime.minute && startTime.meridiem === endTime.meridiem);
  if (startTime.hour === 12 && endTime.meridiem === "PM") return -1;
  if (startTime.hour < endTime.hour) return -1;
  if (startTime.minute < endTime.minute) return -1;

  if (startTime.hour === endTime.hour && startTime.minute === endTime.minute && startTime.meridiem === endTime.meridiem) return 0;

  return 1;
}

// function createDivElementOnGrid(classAttribute, gridColumn) {}

// function createDivElementOnGrid(classAttribute, gridRow, gridColumn) {}
