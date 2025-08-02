import DOM from "./dom.js";
import TimeUtils from "./time-utils.js";

class Pomodoro {
  constructor() {
    // DOM elements
    this.display = DOM.getElement("pomodoroDisplay");
    this.statusEl = DOM.getElement("pomodoroStatus");
    this.startButton = DOM.getElement("pomodoroStartBtn");
    this.pauseButton = DOM.getElement("pomodoroPauseBtn");
    this.resetButton = DOM.getElement("pomodoroResetBtn");
    // Input durations (in minutes)
    this.workInput = DOM.getElement("workDuration");
    this.shortBreakInput = DOM.getElement("shortBreakDuration");
    this.longBreakInput = DOM.getElement("longBreakDuration");
    // Internal state
    this.mode = "work"; // "work" | "short-break" | "long-break"
    this.remainingTime = 0; // seconds
    this.timer = null;
    this.sessionCount = 0; // số lần work hoàn thành
    this.audio = new Audio("assets/sound/alarm.mp3");
    this.audio.volume = 0.8;
  }

  /**
    * Khởi tạo sự kiện các nút
    */
  init() {
    this.audio.load();
    this.startButton.addEventListener("click", () => this.start());
    this.pauseButton.addEventListener("click", () => this.pause());
    this.resetButton.addEventListener("click", () => this.reset());
  }

  /**
   * Lấy thời gian từ input theo chế độ hiện tại
   */
  setInitialTime() {
    let timeNumber = "";
    if (this.mode === "work") timeNumber = Number(this.workInput.value);
    if (this.mode === "short-break") timeNumber = Number(this.shortBreakInput.value);
    if (this.mode === "long-break") timeNumber = Number(this.longBreakInput.value);

    return this.remainingTime = timeNumber * 60;
  }


  /**
   * Cập nhật trạng thái hiển thị ("Work", "Nghỉ ngắn", "Nghỉ dài")
   */
  updateStatus() {
    // Gán text content của this.status dựa theo this.mode
    // Ví dụ: "Work" nếu this.mode === "work"
    switch (this.mode) {
      case "work":
        return DOM.setText(this.statusEl, "Đang làm việc");
      case "short-break":
        console.log("nghỉ ngắn");
        return DOM.setText(this.statusEl, "Nghỉ ngắn");
      case "long-break":
        console.log("nghỉ dài");
        return DOM.setText(this.statusEl, "Nghỉ dài");
      default:
        return "Lỗi hệ thống";
    }
  }

  /**
   * Hiển thị thời gian đếm ngược lên this.display
   */
  updateDisplay() {
    const timeStr = TimeUtils.convertMinutesToHours(this.remainingTime);
    DOM.setText(this.display, timeStr);
  }

  /**
   * Bắt đầu hoặc tiếp tục bộ đếm Pomodoro
   */
  start() {
    if (this.timer) return;
    if (this.remainingTime === 0) this.setInitialTime();
    this.updateStatus();
    this.updateDisplay();
    this.timer = setInterval(() => {
      this.remainingTime--;
      this.updateDisplay();
      if (this.remainingTime === 0) {
        clearInterval(this.timer);
        this.timer = null;
        this.handleSessionEnd();
      }
    }, 1000);
  }

  /**
   * Tạm dừng đếm ngược
   */
  pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Đặt lại trạng thái ban đầu
   */
  reset() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.timer = null;
    this.mode = "work";
    this.sessionCount = 0;
    this.setInitialTime();
    this.updateStatus();
    this.updateDisplay();
  }

  /**
   * Khi 1 phiên kết thúc → xử lý chuyển mode
   */
  handleSessionEnd() {
    this.audio.play();
    if (this.mode === "work") {
      this.sessionCount++;
      this.mode = (this.sessionCount % 4 === 0) ? "long-break" : "short-break";
    } else {
      this.mode = "work";
    }
    this.setInitialTime();
    this.start();
  }
}
export default Pomodoro;
