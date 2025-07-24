import Clock from "./clock.js";
import Calendar from "./calendar.js"
import DOM from "./dom.js";
import AlarmClock from "./alarm.js";
import WorldClock from "./world-clock.js";

let clockDisplay = new Clock();
let alarmDisplay = new AlarmClock();
let worldClockDisplay = new WorldClock();
let currentMonth = Calendar.getCurrentMonthYear().month + 1;
let currentYear = Calendar.getCurrentMonthYear().year;
const sections = document.querySelectorAll("section");
const links = document.querySelectorAll("nav li a");
// let calendarDisplay = new Calendar();
// function initClockSection()
// Khởi tạo toàn bộ phần đồng hồ + ngày + mini calendar khi trang load

// 1. Gọi updateClockDisplay() + setInterval mỗi 1000ms
// 2. Gọi updateCurrentDateText()
// 3. Gọi getCurrentMonthYear() để lấy tháng/năm hiện tại
// 4. Gọi renderCalendar(month, year)
function initClockSection() {
    setInterval(() => clockDisplay.updateClockDisplay(), 1000);
    clockDisplay.updateCurrentDateText();
    const currentMonth = Calendar.getCurrentMonthYear().month + 1;
    const currentYear = Calendar.getCurrentMonthYear().year;
    Calendar.renderCalendar(currentMonth, currentYear);
}

/**
 * 1. Nếu tháng hiện tại là 1 (tháng 1) → quay về tháng 12 của năm trước
 * 2. Ngược lại, giảm tháng đi 1
 * 3. Gọi lại Calendar.renderCalendar(newMonth, newYear)
 */
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

/**
 * 1. Nếu tháng hiện tại là 12 (tháng Chạp) → sang tháng 1 của năm kế tiếp
 * 2. Ngược lại, tăng tháng lên 1
 * 3. Gọi lại Calendar.renderCalendar(newMonth, newYear)
 */
function handleNextMonth() {
    currentMonth++;
    if (currentMonth === 13) {
        currentYear++;
        currentMonth = 1;
    }
    Calendar.renderCalendar(currentMonth, currentYear);
    attachCalendarNavigationEvents();
}

/**
 * 1. Lấy 2 nút theo id: #btnPrevMonth, #btnNextMonth
 * 2. Gắn sự kiện click tương ứng → gọi handlePrevMonth(), handleNextMonth()
 * 3. Hàm này phải được gọi sau mỗi lần renderCalendar vì HTML nút sẽ bị thay đổi
 */
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
});