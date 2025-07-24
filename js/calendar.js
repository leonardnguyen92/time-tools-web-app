import TimeUtils from "./time-utils.js"
import DOM from "./dom.js"

class Calendar {

    /**
     * Vẽ bảng lịch tháng cụ thể(số ngày, ô trống, highlight hôm nay nếu có)
     * @param {number} month 
     * @param {number} year 
     */
    static renderCalendar(month, year) {
        const tbody = DOM.getElement("bodyTableMonth");
        DOM.clearElementContent(tbody);
        this.updateCalendarHeader(month, year);
        const today = new Date();
        let firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        if (firstDayOfMonth === 0) {
            firstDayOfMonth = 6;
        } else {
            firstDayOfMonth = firstDayOfMonth - 1;
        }
        const totalDays = TimeUtils.getDaysInMonth(month, year);

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = DOM.createElement("tr");
            for (let j = 0; j < 7; j++) {
                const cell = DOM.createElement("td");
                if (i === 0 && j < firstDayOfMonth) {
                    DOM.setText(cell, "");
                } else if (date > totalDays) {
                    break;
                } else {
                    DOM.setText(cell, date);
                    if (date === TimeUtils.getCurrentDay() && month === (today.getMonth() + 1) && year === today.getFullYear()) {
                        cell.classList.add("calendar-today");
                    }

                    date++;
                }
                DOM.appendChildren(row, [cell]);
            }
            DOM.appendChildren(tbody, [row]);
            if (date > totalDays) break;
        }

    }

    static updateCalendarHeader(month, year) {
        const titleCalendar = DOM.getElement("currentMonth");
        DOM.clearElementContent(titleCalendar);
        const stringTitleCalendar = `<button id="btnPrevMonth" class="btn btn-mini-calendar"><i class="fas fa-fast-backward"></i></button> Tháng ${month} Năm ${year} <button id="btnNextMonth" class="btn btn-mini-calendar"><i class="fas fa-fast-forward"></i></button>`;
        DOM.setHTML(titleCalendar, stringTitleCalendar);
    }

    /**
     * Trả về tháng và năm hiện tại để khởi tạo lịch
     * @returns { month, year } 
     */
    static getCurrentMonthYear() {
        const now = new Date();
        return {
            month: now.getMonth(),
            year: now.getFullYear()
        };
    }
}

export default Calendar;