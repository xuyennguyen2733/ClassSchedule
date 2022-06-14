"use strict";

function createTimeDropList(selector, startValue, endValue) {
  if (startValue >= endValue) throw "startValue must be less than endValue!";
  const timeSelectorInputEl = document.querySelector(`input${selector}`);
  if (!timeSelectorInputEl) throw "Cannot find the element!";
  const parentEl = timeSelectorInputEl.parentElement;
  const timeSelectorAttributes = {
    elementName: timeSelectorInputEl.getAttribute("name") || undefined,
    elementID: timeSelectorInputEl.getAttribute("id") || undefined,
    dataFormat: timeSelectorInputEl.getAttribute("data-format") || "HH:MM",
    dataTemplate: timeSelectorInputEl.getAttribute("data-template") || "HH : MM",
  };

  if (!timeSelectorAttributes.elementName && !timeSelectorAttributes.elementID) throw "Element must have at least an id or a name!";

  const [hour, minute, ending] = parseTimeFormat(timeSelectorAttributes.dataFormat);

  const timeSelectorSelectEl = document.createElement("select");
  if (timeSelectorAttributes.elementID) timeSelectorSelectEl.setAttribute("id", timeSelectorAttributes.elementID);
  if (timeSelectorAttributes.elementName) timeSelectorSelectEl.setAttribute("name", timeSelectorAttributes.elementName);
  for (let i = startValue; i < endValue + 1; i++) {
    const optionTag = document.createElement("option");
    const optionText = document.createTextNode(i);
    optionTag.setAttribute("value", i);
    optionTag.appendChild(optionText);
    timeSelectorSelectEl.appendChild(optionTag);
  }
  parentEl.replaceChild(timeSelectorSelectEl, timeSelectorInputEl);

  if (ending) {
    if (startValue < 1 || endValue > 12) throw "Invalid time values!";
    const endingSelectEl = document.createElement("select");

    const endingSet = ending === "a" ? { am: "am", pm: "pm" } : { am: "AM", pm: "PM" };

    const am = document.createElement("option");
    am.setAttribute("value", endingSet.am);
    const amText = document.createTextNode(endingSet.am);
    am.appendChild(amText);

    const pm = document.createElement("option");
    pm.setAttribute("value", endingSet.pm);
    const pmText = document.createTextNode(endingSet.pm);
    pm.appendChild(pmText);

    endingSelectEl.appendChild(am);
    endingSelectEl.appendChild(pm);

    parentEl.appendChild(endingSelectEl);
  } else {
    if (startValue < 0 || endValue > 23) throw "Invalid time values!";
  }
}

function parseTimeFormat(timeString) {
  return timeString.split(/[\s\:]+/);
}
