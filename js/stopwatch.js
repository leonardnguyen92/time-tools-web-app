import DOM from "./dom.js";
import TimeUtils from "./time-utils.js";

class Stopwatch {
    constructor() {
        this.intervalId = null;
        this.elapsedTime = 0;
        this.startTime = null;
        this.isRunning = false;
        this.lapList = [];
        // DOM element
        this.hoursDisplay = DOM.getElement("hoursStopwatch");
        this.minutesDisplay = DOM.getElement("minutesStopwatch");
        this.secondsDisplay = DOM.getElement("secondsStopwatch");
        this.millisecondsDisplay = DOM.getElement("millisecondsStopwatch");
        this.startBtn = DOM.getElement("startBtn");
        this.pauseBtn = DOM.getElement("pauseBtn");
        this.resetBtn = DOM.getElement("resetBtn");
        this.lapBtn = DOM.getElement("lapBtn");
        this.lapDiv = DOM.getElement("lapDiv");
        this.lapTable = DOM.getElement("lapTable");
        this.tBody = DOM.getElement("bodyTableLap");
        this.deleteBtn = DOM.getElement("deleteLapTableBtn");
    }

    initStopwatch() {
        this.updateButtons("initial");
        this.startBtn.addEventListener("click", () => this.startStopwatch());
        this.pauseBtn.addEventListener("click", () => this.pauseStopwatch());
        this.resetBtn.addEventListener("click", () => this.resetStopwatch());
        this.lapBtn.addEventListener("click", () => this.recordLap());
        this.deleteBtn.addEventListener("click", () => this.deleteLapData());
    }

    startStopwatch() {
        if (this.isRunning) return;
        this.updateButtons("running");
        if (this.elapsedTime > 0) {
            this.startTime = Date.now() - this.elapsedTime;
        } else {
            this.startTime = Date.now();
        }
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay(this.elapsedTime);
        }, 10);
        this.isRunning = true;
    }

    pauseStopwatch() {
        this.updateButtons("paused");
        if (this.intervalId) clearInterval(this.intervalId);
        this.elapsedTime = Date.now() - this.startTime;
        this.isRunning = false;
    }

    resetStopwatch() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.elapsedTime = 0;
        this.startTime = null;
        this.updateDisplay(0);
        this.updateButtons("initial");
    }

    updateDisplay(ms) {
        const { hours, minutes, seconds, milliseconds } = TimeUtils.formatTime(ms);
        DOM.setText(this.hoursDisplay, `${hours}`);
        DOM.setText(this.minutesDisplay, `${minutes}`);
        DOM.setText(this.secondsDisplay, `${seconds}`);
        DOM.setText(this.millisecondsDisplay, `${milliseconds}`);
    }

    recordLap() {
        if (!this.isRunning) return;
        let currentTotalTime = this.elapsedTime;
        let lapTime = 0;
        if (this.lapList.length === 0) {
            lapTime = currentTotalTime;
        } else {
            let lastLap = this.lapList[this.lapList.length - 1];
            lapTime = currentTotalTime - lastLap.totalTime;
        }
        const lapObj = {
            index: (this.lapList.length + 1),
            lapTime: lapTime,
            totalTime: currentTotalTime
        };
        this.lapList.push(lapObj);
        if (this.lapTable.classList.contains("d-none")) {
            this.lapTable.classList.remove("d-none");
        }
        this.renderLapTable();
    }

    renderLapTable() {
        if (this.lapList.length > 0) {
            DOM.clearElementContent(this.tBody);
            this.lapList.forEach(lap => {
                const tRow = DOM.createElement("tr", { class: "text-start" });
                const tdStr = `<td>${lap.index}</td>
                <td>${TimeUtils.timeToString(lap.lapTime)}</td>
                <td>${TimeUtils.timeToString(lap.totalTime)}</td>`
                DOM.setHTML(tRow, tdStr);
                DOM.appendChildren(this.tBody, [tRow]);
            });
        } else {
            DOM.clearElementContent(this.tBody);
            this.lapTable.classList.add("d-none");
        }
    }

    deleteLapData() {
        this.lapList = [];
        this.renderLapTable();
    }

    updateButtons(state) {
        DOM.toggleVisibility(this.startBtn, state === "initial" || state === "paused");
        DOM.toggleVisibility(this.pauseBtn, state === "running");
        DOM.toggleVisibility(this.resetBtn, state === "paused");
        DOM.toggleVisibility(this.lapBtn, state === "running");
    }

}
export default Stopwatch;
const stopwatch = new Stopwatch();
stopwatch.initStopwatch();
