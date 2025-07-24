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

    static getCurrentDay() {
        return new Date().getDate();
    }
}

export default TimeUtils;
