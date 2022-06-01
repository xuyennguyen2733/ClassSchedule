"use strict";

createTimeDropList("#start-time", 1, 12);
createTimeDropList("#end-time", 1, 12);

const saveCourseBtn = document.querySelector(".save-course");
const courseBlocks = document.querySelectorAll(".course-block");
const courseTimeEls = {
  startTimeEl: document.querySelector("#start-time"),
  startTailEl: document.querySelector("#start-time").nextElementSibling,
  endTimeEl: document.querySelector("#end-time"),
  endTailEl: document.querySelector("#end-time").nextElementSibling,
};

console.log(courseTimeEls.startTimeEl);
console.log(courseTimeEls.endTimeEl);
console.log(courseTimeEls.startTailEl);
console.log(courseTimeEls.endTailEl);

const timetable = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
};

saveCourseBtn.addEventListener("click", saveCourse);
for (let i = 0; i < courseBlocks.length; i++) {
  console.log(courseBlocks[i]);
  courseBlocks[i].addEventListener("click", showSaveWindow);
}
courseTimeEls.startTimeEl.addEventListener("change", updateTime);
courseTimeEls.endTimeEl.addEventListener("change", updateTime);
courseTimeEls.startTailEl.addEventListener("change", updateTime);
courseTimeEls.endTailEl.addEventListener("change", updateTime);

function saveCourse() {
  let isValid = true;

  const courseContent = document.querySelector(".monday");

  const inputContent = {
    courseName: document.getElementById("course-name").value || (isValid = false),
    courseType: document.getElementById("course-type").value || (isValid = false),
    startTime:
      `${Number(document.getElementById("start-time").value)}${document.getElementById("start-time").nextElementSibling.value}` || (isValid = false),
    endTime:
      `${Number(document.getElementById("end-time").value)}${document.getElementById("end-time").nextElementSibling.value}` || (isValid = false),
    location: document.getElementById("location").value || (isValid = false),
  };
  if (isValid) {
    for (const property in inputContent) {
      courseContent.querySelector(`.${property}`).textContent = inputContent[property];
    }

    timetable.monday += inputContent;
  }
}

function updateTime() {
  console.log(this.value);
}

function showSaveWindow() {
  console.log(this);
}
