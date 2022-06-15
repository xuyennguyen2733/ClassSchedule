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
    hourIndex: document.querySelector(".start-time #hour"),
    minute: document.querySelector(".start-time #minute"),
    meridiem: document.querySelector(".start-time #meridiem"),
  },
  endTime: {
    hourIndex: document.querySelector(".end-time #hour"),
    minute: document.querySelector(".end-time #minute"),
    meridiem: document.querySelector(".end-time #meridiem"),
  },
};

const btnCloseCourseForm = courseFormContainer.querySelector(".btn--close");
const overlay = document.querySelector(".overlay");
const btnUpdateCourseForm = courseFormContainer.querySelector(".btn--update");
const btnSaveCourseForm = courseFormContainer.querySelector(".btn--save");

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
  const hour = Number(hourList[i - 1][0]);
  const meridiem = hourList[i - 1][1];
  const textContent = hour + meridiem;

  const others = {
    gridRow: `${i} / ${i + 1}`,
    classList: [`cell-color--${((i + 1) % 2) + 2}`, "flex-center-top"],
    textContent: textContent,
  };

  const timeBlock = createTimetableCell("sideLabel", others);

  timetableSide.appendChild(timeBlock);
}

// Create hour droplist
for (let i = 0; i < 10; i++) {
  const startOptionEl = createOptionElement(i, hourList[i][0]);
  const endOptionEl = createOptionElement(i, hourList[i][0]);
  formObj.startTime.hourIndex.appendChild(startOptionEl);
  formObj.endTime.hourIndex.appendChild(endOptionEl);
}

// Create minute droplist - 5 minute intervals
for (let i = 0; i < 60; i += 5) {
  const startOptionEl = createOptionElement(i, ("0" + i).slice(-2));
  const endOptionEl = createOptionElement(i, ("0" + i).slice(-2));
  formObj.startTime.minute.appendChild(startOptionEl);
  formObj.endTime.minute.appendChild(endOptionEl);
}

updateCurrentCourseObject();

/******************************************************
 * ----------------------------------------------------
 *******************************************************/

/****************************************************** 
EVENT SETUP
******************************************************/

// Event listeners
btnCloseCourseForm.addEventListener("click", hideCourseForm);
overlay.addEventListener("click", hideCourseForm);
btnUpdateCourseForm.addEventListener("click", updateCourse);
btnSaveCourseForm.addEventListener("click", saveCourse);

formObj.classCode.addEventListener("change", updateCurrentCourseObject);
formObj.className.addEventListener("change", updateCurrentCourseObject);
formObj.classType.addEventListener("change", updateCurrentCourseObject);
formObj.location.addEventListener("change", updateCurrentCourseObject);
formObj.day.addEventListener("change", updateCurrentCourseObject);
formObj.startTime.hourIndex.addEventListener("change", updateCurrentCourseObject);
formObj.startTime.minute.addEventListener("change", updateCurrentCourseObject);

formObj.endTime.hourIndex.addEventListener("change", updateCurrentCourseObject);
formObj.endTime.minute.addEventListener("change", updateCurrentCourseObject);

// formObj.startTime.hour.addEventListener("change", startHourChanged);

// timetable.

/* EVENT HANDLERS */

function showCourseForm() {
  const el = this;
  console.log(this);

  const classTimeStr = this?.querySelector(".class-time")?.textContent;
  let startTimeStr, endTimeStr, startHourIndex, startMinute, startMeridiem, endHourIndex, endMinute, endMeridiem;
  if (classTimeStr) {
    [startTimeStr, endTimeStr] = classTimeStr?.split(" - ");
    console.log(startTimeStr, endTimeStr);
  }
  // const row = el.style.gridRow;
  const rowStart = el.style.gridRowStart;
  const rowEnd = el.style.gridRowEnd;

  [startHourIndex, startMinute, startMeridiem] = timeStringToObject(startTimeStr) ?? rowToTime(rowStart);
  [endHourIndex, endMinute, endMeridiem] = timeStringToObject(endTimeStr) ?? rowToTime(rowEnd);
  console.log("hour indices are: ", startHourIndex, endHourIndex);

  // Log in any information that is available
  formObj.day.value = el.classList[0];

  formObj.startTime.hourIndex.value = startHourIndex;
  formObj.startTime.minute.value = startMinute;
  formObj.startTime.meridiem.textContent = startMeridiem;

  formObj.endTime.hourIndex.value = endHourIndex;
  formObj.endTime.minute.value = endMinute;
  formObj.endTime.meridiem.textContent = endMeridiem;

  formObj.classCode.value = el.querySelector(".class-code")?.textContent || "";
  formObj.className.value = el.querySelector(".class-name")?.textContent || "";
  formObj.classType.value = el.querySelector(".class-type")?.value || "Online";
  formObj.location.value = el.querySelector(".location")?.textContent || "";

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

function updateCurrentCourseObject() {
  currentCourse.classCode = formObj.classCode.value;
  currentCourse.className = formObj.className.value;
  currentCourse.classType = formObj.classType.value;
  currentCourse.location = formObj.location.value;
  currentCourse.day = formObj.day.value;

  currentCourse.startTime.hour = Number(hourList[formObj.startTime.hourIndex.value][0]);
  currentCourse.startTime.meridiem = hourList[formObj.startTime.hourIndex.value][1];
  currentCourse.startTime.minute = Number(formObj.startTime.minute.value);

  currentCourse.endTime.hour = Number(hourList[formObj.endTime.hourIndex.value][0]);
  currentCourse.endTime.meridiem = hourList[formObj.endTime.hourIndex.value][1];
  currentCourse.endTime.minute = Number(formObj.endTime.minute.value);

  formObj.startTime.meridiem.textContent = currentCourse.startTime.meridiem;
  formObj.endTime.meridiem.textContent = currentCourse.endTime.meridiem;
}

function saveCourse(element) {
  const [rowStart, rowEnd] = timeToRows(currentCourse.startTime, currentCourse.endTime);

  const daySchedule = schedule[currentCourse.day];
  const cmp = compareTime(currentCourse.startTime, currentCourse.endTime);

  if (cmp >= 0) throw "invalid input!";
  console.log(cmp);

  for (let i = rowStart + 1; i <= rowEnd - 1; i++) {
    if (daySchedule[i] === true) throw "Time conflict!";
  }

  for (let i = rowStart; i <= rowEnd; i++) {
    daySchedule[i] = true;
  }

  const others = {
    gridRow: `${rowStart} / ${rowEnd}`,
    id: currentCourse.classCode.replace(/(\s+)/g, "-"),
    classList: [currentCourse.day, "course-block", "hover-animation--float", "font--golden-thin"],
  };
  const courseBlock = createTimetableCell(currentCourse.day, others);
  fillCourseBlock(courseBlock);
  courseBlock.addEventListener("click", showCourseForm);
  courseBlock.addEventListener("click", updateCurrentCourseObject);
  courseBlock.addEventListener("click", showUpdateButton);
  timetableBody.append(courseBlock);

  hideCourseForm();
}

function updateCourse() {
  const el = timetableBody.querySelector(`#${this.id}`);
  let daySchedule;
  for (const elementClass of el.classList) {
    if (schedule[elementClass]) {
      daySchedule = schedule[elementClass];
      break;
    }
  }

  const rowStart = el.style.gridRowStart;
  const rowEnd = el.style.gridRowEnd;

  for (let i = rowStart; i <= rowEnd; i++) {
    daySchedule[i] = false;
  }

  // const backupEl = el.cloneNode(true);
  // backupEl.addEventListener("click", showCourseForm);
  // backupEl.addEventListener("click", updateCurrentCourseObject);
  // backupEl.addEventListener("click", showUpdateButton);
  // console.log(backupEl);
  // el.remove();

  try {
    saveCourse();
    el.remove();
  } catch {
    // timetableBody.append(backupEl);
    for (let i = rowStart; i <= rowEnd; i++) {
      daySchedule[i] = true;
    }
  } finally {
    btnSaveCourseForm.classList.remove("hidden");
    btnUpdateCourseForm.classList.add("hidden");
    btnUpdateCourseForm.removeAttribute("id");
    hideCourseForm();
  }

  // el.querySelector(".class-code").textContent = currentCourse.classCode;
  // el.querySelector(".class-name").textContent = currentCourse.className;
  // el.querySelector(".class-type").value = currentCourse.classType;
  // el.querySelector(".class-time").textContent = toTimeString(currentCourse.startTime, currentCourse.endTime);
  // el.querySelector(".location").textContent = currentCourse.location;
}

function showUpdateButton() {
  btnSaveCourseForm.classList.add("hidden");
  btnUpdateCourseForm.classList.remove("hidden");
  btnUpdateCourseForm.setAttribute("id", this.id);
}

// function updateCourseInformation() {
//   console.log(this);
//   // this.showCourseForm();
// }

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

  if (othersObj.cellColor) {
    divTag.style.backgroundColor = othersObj.cellColor;
  }

  if (othersObj.textContent) {
    divTag.textContent = othersObj.textContent;
  }

  if (othersObj.classList) {
    for (let i = 0; i < othersObj.classList.length; i++) {
      divTag.classList.add(othersObj.classList[i]);
    }
  }

  if (othersObj.id) {
    divTag.setAttribute("id", othersObj.id);
  }

  return divTag;
}

function indexToCalendarTime(index, offset) {
  const hour = Number(index + offset + 1);
  return [hour <= 12 ? hour : hour - 12, hour < 12 ? "AM" : "PM"];
}

function calendarTimeToIndex(time, offset) {
  const hour = time[1] === "AM" || Number(time[0]) === 12 ? Number(time[0]) : Number(time[0]) + 12;
  const index = hour - offset - 1;
  return index;
}

function compareTime(startTime, endTime) {
  if (startTime.meridiem === "AM" && endTime.meridiem === "PM") return -1;
  if (startTime.meridiem === "PM" && endTime.meridiem === "AM") return 1;
  if (startTime.hour === 12 && endTime.hour !== 12) return -1;
  if (startTime.hour < endTime.hour) return -1;
  if (startTime.hour > endTime.hour) return 1;
  if (startTime.minute < endTime.minute) return -1;
  if (startTime.minute > endTime.minute) return 1;

  return 0;
}

function fillCourseBlock(el) {
  const classCodeEl = document.createElement("div");
  classCodeEl.textContent = currentCourse.classCode.toUpperCase().replace(/(\s+)/g, " ");
  classCodeEl.classList += "class-code";

  const classNameEl = document.createElement("div");
  classNameEl.textContent = toTitleCase(currentCourse.className).replace(/(\s+)/g, " ");
  classNameEl.classList += "class-name hidden";

  const classTypeEl = document.createElement("div");
  classTypeEl.textContent = currentCourse.classType.replace(/(\s+)/g, " ");
  classTypeEl.classList += "class-type";

  const classTimeEl = document.createElement("div");
  classTimeEl.textContent = toTimeString(currentCourse.startTime, currentCourse.endTime);
  classTimeEl.classList += "class-time";

  const locationEl = document.createElement("div");
  locationEl.textContent = currentCourse.location.toUpperCase().replace(/(\s+)/g, " ");
  locationEl.classList += "location";

  el.append(classCodeEl);
  el.append(classNameEl);
  el.append(classTypeEl);
  el.append(classTimeEl);
  el.append(locationEl);
}

function toTitleCase(str) {
  let newStr = str.toLowerCase();
  const strArr = newStr.split(" ");
  for (let i = 0; i < strArr.length; i++) {
    strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
  }
  return strArr.join(" ");
}

function rowToTime(row) {
  const index = Math.trunc((row - 1) / 4);
  const minute = ((row - 1) % 4) * 15;
  const meridiem = hourList[index][1];

  return [index, minute, meridiem];
}

function toTimeString(startTime, endTime) {
  return `${startTime.hour}:${("0" + startTime.minute).slice(-2)}${startTime.meridiem} - ${endTime.hour}:${("0" + endTime.minute).slice(-2)}${
    endTime.meridiem
  }`;
}

function timeToRows(startTime, endTime) {
  const indexStart = calendarTimeToIndex([startTime.hour, startTime.meridiem], timeOffSet);
  const indexEnd = calendarTimeToIndex([endTime.hour, endTime.meridiem], timeOffSet);

  const rowStart = indexStart * 4 + (Math.trunc(startTime.minute / 15) + 1);
  const rowEnd = indexEnd * 4 + (Math.ceil(endTime.minute / 15) + 1);
  return [rowStart, rowEnd];
}

function timeStringToObject(timeStr) {
  if (!timeStr) return undefined;
  const timeTokens = timeStr.split(":");
  console.log(timeTokens[0]);
  console.log(timeTokens[1]);
  const minute = Number(timeTokens[1].slice(0, 2));
  const meridiem = timeTokens[1].slice(-2);
  const hourIndex = calendarTimeToIndex([timeTokens[0], meridiem], timeOffSet);
  return [hourIndex, minute, meridiem];
}
