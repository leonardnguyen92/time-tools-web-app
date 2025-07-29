class TimeUtils {
    /**
     * Chuyển thứ từ số (0–6) sang chuỗi tiếng Việt
     * @param {number} dayIndex 
     * @returns {string} 
     */
    static getDayOfWeekVN(dayIndex) {
        let dayOfWeek;
        switch (dayIndex) {
            case 0:
                dayOfWeek = "Chủ Nhật";
                break;
            case 1:
                dayOfWeek = "Thứ Hai";
                break;
            case 2:
                dayOfWeek = "Thứ Ba";
                break;
            case 3:
                dayOfWeek = "Thứ Tư";
                break;
            case 4:
                dayOfWeek = "Thứ Năm";
                break;
            case 5:
                dayOfWeek = "Thứ Sáu";
                break;
            case 6:
                dayOfWeek = "Thứ Bảy";
                break;
        }
        return dayOfWeek;
    }

    /**
     * Trả về số ngày của một tháng bất kỳ
     * @param {number} month - Tháng (0 = Jan, 11 = Dec)
     * @param {number} year 
     * @returns {number}
     */
    static getDaysInMonth(month, year) {
        const dayInMonth = new Date(year, month + 1, 0).getDate();
        return dayInMonth;
    }

    /**
     * Thêm số 0 ở đầu nếu số chỉ có 1 chữ số (ví dụ: 9 ➝ "09")
     * @param {number} num
     * @returns {string}
     */
    static formatTwoDigits(number) {
        return number < 10 ? `0${number}` : number;
    }

    static formatTime(ms) {
        const hours = this.formatTwoDigits(Math.min(Math.floor(ms / 3600000), 99));
        const minutes = this.formatTwoDigits(Math.floor((ms % 3600000) / 60000));
        const seconds = this.formatTwoDigits(Math.floor((ms % 60000) / 1000));
        const milliseconds = this.formatTwoDigits(Math.floor((ms % 1000) / 10));
        return { hours, minutes, seconds, milliseconds };
    }

    static getCurrentDay() {
        return new Date().getDate();
    }

    static timeToString(ms) {
        const { hours, minutes, seconds, milliseconds } = this.formatTime(ms);
        const timeStr = `${hours}:${minutes}:${seconds}.${milliseconds}`;
        return timeStr;
    }
    /**
     * Lấy ngày Tết dương lịch gần nhất (1/1)
     * @returns {Date}
     */
    static getNextNewYear() {
        const now = new Date();
        let year = now.getFullYear();
        let newYearDate = new Date(`${year}-01-01T00:00:00`);

        if (now > newYearDate) {
            newYearDate = new Date(`${year + 1}-01-01T00:00:00`);
        }
        return newYearDate;
    }

    /**
     * Lấy ngày Giáng sinh gần nhất (25/12)
     * @returns {Date}
     */
    static getNextChristmas() {
        const now = new Date();
        let year = now.getFullYear();
        let christmasDate = new Date(`${year}-12-25T00:00:00`);

        if (now > christmasDate) {
            christmasDate = new Date(`${year + 1}-12-25T00:00:00`);
        }
        return christmasDate;
    }

    /**
     * Lấy ngày Quốc Khánh gần nhất (02/09)
     * @returns {Date}
     */
    static getNationalDay() {
        const now = new Date();
        let year = now.getFullYear();
        let nationalDay = new Date(`${year}-09-02T00:00:00`);
        if (now > nationalDay) {
            nationalDay = new Date(`${year + 1}-09-02T00:00:00`)
        }
        return nationalDay;
    }

    static getSouthernLiberationDay() {
        const now = new Date();
        let year = now.getFullYear();
        let southernLiberationDay = new Date(`${year}-04-30T00:00:00`);
        if (now > southernLiberationDay) {
            southernLiberationDay = new Date(`${year + 1}-04-30T00:00:00`)
        }
        return southernLiberationDay;
    }

    /**
     * Tính số ngày, giờ, phút, giây còn lại đến một thời điểm
     * @param {Date} targetDate
     * @returns {{days: number, hours: number, minutes: number, seconds: number, isOver: boolean}}
     */
    static calculateRemainingTime(targetDate) {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = this.formatTwoDigits(Math.floor((diff / (1000 * 60 * 60)) % 24));
        const minutes = this.formatTwoDigits(Math.floor((diff / (1000 * 60)) % 60));
        const seconds = this.formatTwoDigits(Math.floor((diff / 1000) % 60));

        return { days, hours, minutes, seconds, isOver: false };
    }

}

export default TimeUtils;
