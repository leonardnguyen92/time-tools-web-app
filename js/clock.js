import DOM from "./dom.js";
import TimeUtils from "./time-utils.js";
class Clock {
    currentClock;
    /**
     * Cập nhật đồng hồ thời gian thực(giờ, phút, giây)
     * 1. Lấy thời gian hiện tại bằng Date()
     * 2. Tách giờ, phút, giây thành từng số riêng lẻ
     * 3. Gán vào các thẻ span/p có id: #hoursDigitDisplay, #minuteDigitDisplay, #secondDigitDisplay
     * 4. Gọi hàm này mỗi giây bằng setInterval
     */
    updateClockDisplay() {
        this.currentClock = new Date();
        let hoursDigit = this.currentClock.getHours();
        let minuteDigit = this.currentClock.getMinutes();
        let secondDigit = this.currentClock.getSeconds();
        this.checkAndPlayReminderSound(minuteDigit, secondDigit);
        DOM.setText("hoursDigitDisplay", TimeUtils.formatTwoDigits(hoursDigit));
        DOM.setText("minuteDigitDisplay", TimeUtils.formatTwoDigits(minuteDigit));
        DOM.setText("secondDigitDisplay", TimeUtils.formatTwoDigits(secondDigit));

    }

    /**
     * Cập nhật dòng hiển thị ngày tháng năm dưới đồng hồ(ví dụ: "Thứ hai, Ngày 26, Tháng 07, Năm 2025")
     * 1. Lấy thời gian hiện tại bằng Date()
     * 2. Tách thứ, ngày, tháng, năm
     * 3. Chuyển thứ sang tiếng Việt: 0 => Chủ Nhật, 1 => Thứ hai,...
     * 4. Format chuỗi thành: "Thứ ..., Ngày ..., Tháng ..., Năm ..."
     * 5. Gán nội dung chuỗi vào thẻ có id="currentDateDisplay"
     */
    updateCurrentDateText() {
        this.currentClock = new Date();
        let dayValue = TimeUtils.getDayOfWeekVN(this.currentClock.getDay());
        let dateValue = this.currentClock.getDate();
        let monthValue = this.currentClock.getMonth() + 1;
        let yearValue = this.currentClock.getFullYear();
        const currentDate = `${dayValue}, Ngày ${dateValue}, Tháng ${monthValue}, Năm ${yearValue}`;
        DOM.setText("today", currentDate);
    }

    /**
     * Phát âm thanh khi đồng hồ hiển thị số phút là 00.
     * @param {number} minute 
     * @param {number} second 
     */
    checkAndPlayReminderSound(minute, second) {
        if (minute === 0 && second === 0) {
            new Audio("/assets/sound/clockonhours.mp3").play();
        }
    }
}
export default Clock;
