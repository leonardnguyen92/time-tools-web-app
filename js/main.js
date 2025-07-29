import Clock from "./clock.js";
import Calendar from "./calendar.js"
import DOM from "./dom.js";
import AlarmClock from "./alarm.js";
import WorldClock from "./world-clock.js";
import Stopwatch from "./stopwatch.js";

let clockDisplay = new Clock();
let alarmDisplay = new AlarmClock();
let worldClockDisplay = new WorldClock();
const stopwatch = new Stopwatch();
let currentMonth = Calendar.getCurrentMonthYear().month + 1;
let currentYear = Calendar.getCurrentMonthYear().year;
const sections = document.querySelectorAll("section");
const links = document.querySelectorAll("nav li a");

function initClockSection() {
    setInterval(() => clockDisplay.updateClockDisplay(), 1000);
    clockDisplay.updateCurrentDateText();
    const currentMonth = Calendar.getCurrentMonthYear().month + 1;
    const currentYear = Calendar.getCurrentMonthYear().year;
    Calendar.renderCalendar(currentMonth, currentYear);
}

function handlePrevMonth() {
    if (currentMonth === 1) {
        currentMonth = 12;
        currentYear--;
    } else {
        currentMonth--;
    }
    Calendar.renderCalendar(currentMonth, currentYear);
    attachCalendarNavigationEvents();
}

function handleNextMonth() {
    currentMonth++;
    if (currentMonth === 13) {
        currentYear++;
        currentMonth = 1;
    }
    Calendar.renderCalendar(currentMonth, currentYear);
    attachCalendarNavigationEvents();
}

function attachCalendarNavigationEvents() {
    const btnPrevMonth = DOM.getElement("btnPrevMonth");
    const btnNextMonth = DOM.getElement("btnNextMonth");
    if (btnPrevMonth) {
        btnPrevMonth.addEventListener("click", handlePrevMonth);
    }
    if (btnNextMonth) {
        btnNextMonth.addEventListener("click", handleNextMonth);
    }
}

function showSection(sectionId) {
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove("d-none");
        } else {
            section.classList.add("d-none");
        }
    });
    links.forEach(link => {
        const href = link.getAttribute("href");
        const targetId = href.substring(1);
        if (sectionId === targetId) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function attachNavEvents() {

    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const href = link.getAttribute("href");
            const sectionId = href.substring(1);
            showSection(sectionId);
        })
    })
}

function initSections() {
    sections.forEach(section => {
        if (section.id === "clock") {
            section.classList.remove("d-none");
        } else {
            section.classList.add("d-none");
        }
    })

}

alarmDisplay.initAlarmSection();


// Khởi chạy function initClockSection() ngay khi trang web vừa được load.
initClockSection();
attachCalendarNavigationEvents();
window.addEventListener("DOMContentLoaded", () => {
    initSections();
    attachNavEvents();
    worldClockDisplay.initWorldClock();
    stopwatch.initStopwatch();
});