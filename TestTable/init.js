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
const schedule = {
  Monday: Array(41).fill(false),
  Tuesday: Array(41).fill(false),
  Wednesday: Array(41).fill(false),
  Thursday: Array(41).fill(false),
  Friday: Array(41).fill(false),
};

const timetableHead = document.querySelector(".timetable-head");
const timetableBody = document.querySelector(".timetable-body");
const timetableSide = document.querySelector(".timetable-side");

const courseFormContainer = document.querySelector(".course-form-container");
const courseForm = document.querySelector(".course-form");

const formObj = {
  classCode: courseForm.querySelector("#class-code"),
  className: courseForm.querySelector("#class-name"),
  classType: courseForm.querySelector("#class-type"),
  location: courseForm.querySelector("#location"),
  day: courseForm.querySelector("#weekday"),
  startTime: {
    hour: document.querySelector(".start-time #hour"),
    minute: document.querySelector(".start-time #minute"),
    meridiem: document.querySelector(".start-time #meridiem"),
  },
  endTime: {
    hour: document.querySelector(".end-time #hour"),
    minute: document.querySelector(".end-time #minute"),
    meridiem: document.querySelector(".end-time #meridiem"),
  },
};

const btnCloseCourseForm = courseFormContainer.querySelector(".btn--close");
const overlay = document.querySelector(".overlay");
const btnSaveCourseForm = courseFormContainer.querySelector(".save-course");

const currentCourse = {
  classCode: "",
  className: "",
  classType: "",
  location: "",
  day: "",
  startTime: {
    hour: 0,
    minute: 0,
    meridiem: "",
  },
  endTime: {
    hour: 0,
    minute: 0,
    meridiem: "",
  },
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
    formObj.day.appendChild(weekdayDropItem);
  }
}

// create timetable body cells
{
  for (let i = 1; i <= 40; i++) {
    const others = {
      gridRow: `${i} / ${i + 1}`,
      classList: [`cell-color--${(i + 1) % 2}`, "hover-animation--pressed"],
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
  formObj.startTime.hour.appendChild(startOptionEl);
  formObj.endTime.hour.appendChild(endOptionEl);
}

// Create minute droplist - 5 minute intervals
for (let i = 0; i < 60; i += 5) {
  const startOptionEl = createOptionElement(i, ("0" + i).slice(-2));
  const endOptionEl = createOptionElement(i, ("0" + i).slice(-2));
  formObj.startTime.minute.appendChild(startOptionEl);
  formObj.endTime.minute.appendChild(endOptionEl);
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
overlay.addEventListener("click", hideCourseForm);
btnSaveCourseForm.addEventListener("click", saveCourse);

formObj.day.addEventListener("change", updateCourseTime);
formObj.startTime.hour.addEventListener("change", updateCourseTime);
formObj.startTime.minute.addEventListener("change", updateCourseTime);

formObj.endTime.hour.addEventListener("change", updateCourseTime);
formObj.endTime.minute.addEventListener("change", updateCourseTime);

// formObj.startTime.hour.addEventListener("change", startHourChanged);

// timetable.

/* EVENT HANDLERS */

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
  formObj.day.value = el.classList[0];
  formObj.startTime.hour.value = index;
  formObj.startTime.minute.value = minute;
  formObj.startTime.meridiem.textContent = meridiem;

  courseFormContainer.classList.remove("hidden");
  courseFormContainer.classList.add("z-index--2");
  courseFormContainer.nextElementSibling.classList.remove("hidden");
  courseFormContainer.nextElementSibling.classList.add("z-index--1");
}

function hideCourseForm() {
  courseFormContainer.classList.add("hidden");
  courseFormContainer.classList.remove("z-index--2");
  courseFormContainer.nextElementSibling.classList.add("hidden");
  courseFormContainer.nextElementSibling.classList.remove("z-index--1");
  courseForm.reset();
}

function updateCourseTime() {
  currentCourse.classCode = formObj.classCode.value;
  currentCourse.className = formObj.className.value;
  currentCourse.classType = formObj.classType.value;
  currentCourse.location = formObj.location.value;
  currentCourse.day = formObj.day.value;

  currentCourse.startTime.hour = hourList[formObj.startTime.hour.value][0];
  currentCourse.startTime.meridiem = hourList[formObj.startTime.hour.value][1];
  currentCourse.startTime.minute = formObj.startTime.minute.value;

  currentCourse.endTime.hour = hourList[formObj.endTime.hour.value][0];
  currentCourse.endTime.meridiem = hourList[formObj.endTime.hour.value][1];
  currentCourse.endTime.minute = formObj.endTime.minute.value;

  formObj.startTime.meridiem.textContent = currentCourse.startTime.meridiem;
  formObj.endTime.meridiem.textContent = currentCourse.endTime.meridiem;
}

function saveCourse() {
  console.log(currentCourse.startTime);
  const indexStart = calendarTimeToIndex([currentCourse.startTime.hour, currentCourse.startTime.meridiem], timeOffSet);
  const indexEnd = calendarTimeToIndex([currentCourse.endTime.hour, currentCourse.endTime.meridiem], timeOffSet);

  const rowStart = indexStart * 4 + (Math.trunc(currentCourse.startTime.minute / 15) + 1);
  const rowEnd = indexEnd * 4 + (Math.ceil(currentCourse.endTime.minute / 15) + 1);

  const daySchedule = schedule[currentCourse.day];
  console.log(currentCourse.startTime, currentCourse.endTime);
  const cmp = compareTime(currentCourse.startTime, currentCourse.endTime);

  console.log(cmp);

  if (cmp >= 0) throw "invalid input!";

  for (let i = rowStart + 1; i <= rowEnd - 1; i++) {
    if (daySchedule[i] === true) throw "Time conflict!";
  }

  for (let i = rowStart; i <= rowEnd; i++) {
    daySchedule[i] = true;
  }

  const others = {
    gridRow: `${rowStart} / ${rowEnd}`,
    classList: [currentCourse.day, "course-block", "hover-animation--float", "font--golden-thin"],
  };
  const courseBlock = createTimetableCell(currentCourse.day, others);
  fillCourseBlock(courseBlock);
  courseBlock.addEventListener("click", updateCourseInformation);
  timetableBody.append(courseBlock);

  hideCourseForm();
}

function updateCourseInformation() {
  console.log(this);
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
  const divTag = document.createElement("div");
  divTag.classList.add(classAttribute);

  if (othersObj.gridRow !== undefined) {
    divTag.style.gridRow = othersObj.gridRow;
  }

  if (othersObj.gridColumn !== undefined) {
    divTag.style.gridColumn = othersObj.gridColumn;
  }

  if (othersObj.cellColor !== undefined) {
    divTag.style.backgroundColor = othersObj.cellColor;
  }

  if (othersObj.textContent !== undefined) {
    divTag.textContent = othersObj.textContent;
  }

  if (othersObj.classList !== undefined) {
    for (let i = 0; i < othersObj.classList.length; i++) {
      divTag.classList.add(othersObj.classList[i]);
    }
  }

  return divTag;
}

function indexToCalendarTime(index, offset) {
  const hour = index + offset + 1;
  return [hour <= 12 ? hour : hour - 12, hour < 12 ? "AM" : "PM"];
}

function calendarTimeToIndex(time, offset) {
  const hour = time[1] === "AM" || time[0] === 12 ? time[0] : time[0] + 12;
  const index = hour - offset - 1;
  return index;
}

function compareTime(startTime, endTime) {
  if (startTime.meridiem === "AM" && endTime.meridiem === "PM") return -1;
  if (startTime.meridiem === "PM" && endTime.meridiem === "AM") return 1;
  // console.log(startTime.hour === endTime.hour && startTime.minute === endTime.minute && startTime.meridiem === endTime.meridiem);
  if (startTime.hour === 12 && endTime.hour !== 12) return -1;
  if (startTime.hour < endTime.hour) return -1;
  if (startTime.hour > endTime.hour) return 1;
  if (startTime.minute < endTime.minute) return -1;
  if (startTime.minute > endTime.minute) return 1;

  // if (startTime.minute === endTime.minute && startTime.meridiem === endTime.meridiem) return 0;

  return 0;
}

function fillCourseBlock(el) {
  const classCodeEl = document.createElement("div");
  classCodeEl.textContent = currentCourse.classCode.toUpperCase();

  const classTypeEl = document.createElement("div");
  classTypeEl.textContent = currentCourse.classType;

  const classTimeEl = document.createElement("div");
  classTimeEl.textContent = `${currentCourse.startTime.hour}:${currentCourse.startTime.minute}${currentCourse.startTime.meridiem} - ${
    currentCourse.endTime.hour
  }:${("0" + currentCourse.endTime.minute).slice(-2)}${currentCourse.endTime.meridiem}`;

  const locationEl = document.createElement("div");
  locationEl.textContent = currentCourse.location.toUpperCase();

  el.append(classCodeEl);
  el.append(classTypeEl);
  el.append(classTimeEl);
  el.append(locationEl);
}

function toTitleCase(str) {
  let newStr = "";
  const strArr = str.split(" ");
  for (const word of strArr) {
    newStr += word.toLowerCase().charAt(0).toUpperCase();
  }
  return newStr;
}

// function createDivElementOnGrid(classAttribute, gridColumn) {}

// function createDivElementOnGrid(classAttribute, gridRow, gridColumn) {}
