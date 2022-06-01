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
const timetableHead = document.querySelector(".timetable-head");
const timetableBody = document.querySelector(".timetable-body");
const timetableSide = document.querySelector(".timetable-side");

const startTime = {
  startHour: 0,
  startMinute: 0,
  meridiem: "",
};

const startTimeSelectEls = {
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
  };
  const cornerCell = createTimetableCell("cornerLabel", others);
  cornerCell.classList.add("flex-center");
  timetableHead.appendChild(cornerCell);

  // 2. next cells are the labels of weekdays
  const classList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  for (let i = 0; i < 5; i++) {
    others = {
      cellColorClass: "cell-color--2",
      textContent: classList[i],
    };
    const weekdayBlock = createTimetableCell("weekday-label", others);
    weekdayBlock.classList.add("flex-center");
    timetableHead.appendChild(weekdayBlock);
  }
}

// create timetable body cells
for (let i = 1; i <= 40; i++) {
  const others = {
    gridRow: `${i} / ${i + 1}`,
    cellColorClass: `cell-color--${(i + 1) % 2}`,
  };
  const monBlock = createTimetableCell("monday", others);
  const tueBlock = createTimetableCell("tuesday", others);
  const wedBlock = createTimetableCell("wednesday", others);
  const thuBlock = createTimetableCell("thursday", others);
  const friBlock = createTimetableCell("friday", others);
  //   console.log(monBlock);
  timetableBody.appendChild(monBlock);
  timetableBody.appendChild(tueBlock);
  timetableBody.appendChild(wedBlock);
  timetableBody.appendChild(thuBlock);
  timetableBody.appendChild(friBlock);
}

// create timetable side cells - starting from 8AM
for (let i = 1; i <= 10; i++) {
  const offset = 7;
  const hour = i + offset <= 12 ? i + offset : i + offset - 12;
  const meridiem = i + offset < 12 ? "AM" : "PM";
  const textContent = hour + meridiem;

  const others = {
    gridRow: `${i} / ${i + 1}`,
    cellColorClass: `cell-color--${((i + 1) % 2) + 2}`,
    textContent: textContent,
  };

  // console.log(others.textContent);

  const timeBlock = createTimetableCell("sideLabel", others);
  timeBlock.classList.add("flex-center-top");

  timetableSide.appendChild(timeBlock);
}

// Create hour droplist
for (let i = 1; i <= 12; i++) {
  const startOptionEl = createOptionElement(i, i);
  const endOptionEl = createOptionElement(i, i);
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

/******************************************************
 * ----------------------------------------------------
 *******************************************************/

/****************************************************** 
EVENT SETUP
******************************************************/

// Event listeners

// startTimeSelectEls.hour.addEventListener("change", startHourChanged);

// timetable.

// Event handlers
function startHourChanged() {
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
  const properties = {
    gridRow: othersObj.gridRow,
    gridColumn: othersObj.gridColumn,
    cellColor: othersObj.cellColor,
    textContent: othersObj.textContent,
    cellColorClass: othersObj.cellColorClass,
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

  if (properties.cellColorClass !== undefined) {
    divTag.classList.add(properties.cellColorClass);
  }

  return divTag;
}

// function createDivElementOnGrid(classAttribute, gridColumn) {}

// function createDivElementOnGrid(classAttribute, gridRow, gridColumn) {}
