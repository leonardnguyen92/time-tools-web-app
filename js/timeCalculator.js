import DOM from "./dom.js"
import TimeUtils from "./time-utils.js";

class TimeCalculator {
    constructor() {
        this.timeForm = DOM.getElement("timeCalcForm");
        this.firstTime = DOM.getElement("time1");
        this.operation = DOM.getElement("timeOperator");
        this.secondTime = DOM.getElement("time2");
        this.resultDisplay = DOM.getElement("calcResult");
        this.resultButton = DOM.getElement("resultButton");
    }

    getDataFromForm() {
        return {
            first: this.firstTime.value,
            oper: this.operation.value,
            second: this.secondTime.value
        }
    }

    getResult() {
        const { first, oper, second } = this.getDataFromForm();
        const firstTimeValue = TimeUtils.convertTimesToMinutes(first);
        const secondTimeValue = TimeUtils.convertTimesToMinutes(second);
        let result;
        switch (oper) {
            case "addition":
                result = TimeUtils.convertMinutesToHours(firstTimeValue + secondTimeValue);
                break;
            case "subtraction":
                result = TimeUtils.convertMinutesToHours(firstTimeValue - secondTimeValue);
                break;
            default:
                console.log("Error Time");
                break;
        }
        return result;
    }

    showResultDisplay() {
        this.resultButton.addEventListener("click", () => {
            DOM.clearElementContent(this.resultDisplay);
            this.resultDisplay.classList.remove("d-none");
            const result = this.getResult();
            const pResult = DOM.createElement("p");
            DOM.setText(pResult, result);
            DOM.appendChildren(this.resultDisplay, [pResult]);
        })
    }

    init() {

        this.showResultDisplay();
    }
}
export default TimeCalculator;