import DOM from "./dom.js";

class AlarmClock {

    alarms = [];
    alarmTime = DOM.getElement("alarmTime");
    alarmLabel = DOM.getElement("alarmLabel");
    btnAddAlarm = DOM.getElement("btnAddAlarm");

    // - Lấy input giờ, phút, âm thanh
    // - Lấy nút "Thêm báo thức", "Xóa báo thức"
    // - Gắn event listener cho nút thêm để gọi addAlarm()
    // - Hiển thị danh sách báo thức hiện tại bằng renderAlarms()
    initAlarmSection() {
        this.loadAlarmsFromStorage();         // 1. Load các alarm từ localStorage
        this.renderAlarm();                   // 2. Hiển thị danh sách alarm lên giao diện

        // 3. Bắt sự kiện submit form để thêm alarm
        const form = document.getElementById("alarmForm");
        form.addEventListener("submit", e => {
            e.preventDefault();               // Ngăn reload trang
            this.addAlarm();

            // 4. Sau lần submit đầu tiên -> bắt đầu checkAlarm định kỳ mỗi 60 giây
            if (!this.checkInterval) {
                this.checkInterval = setInterval(() => this.checkAlarm(), 60000); // check mỗi phút
            }
        });

        // 5. (Tuỳ chọn) Nếu bạn muốn bắt đầu check ngay nếu có alarm sẵn trong localStorage:
        if (this.alarms.length > 0 && !this.checkInterval) {
            this.checkInterval = setInterval(() => this.checkAlarm(), 1000); // check mỗi phút
        }
    }

    // - Lấy giá trị giờ, phút, âm thanh từ form
    // - Tạo đối tượng alarm: { hour, minute, sound, id }
    // - Thêm vào mảng alarms[]
    // - Lưu vào localStorage (đảm bảo giữ lại sau reload)
    // - Gọi renderAlarms() để cập nhật UI
    addAlarm() {
        const alarmValue = this.alarmTime.value;
        const label = this.alarmLabel.value.trim();
        if (!alarmValue) {
            alert("Vui lòng chọn giờ báo thức!!!");
            return;
        }
        const [hourStr, minuteStr] = alarmValue.split(":");
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        const id = Date.now();
        const alarm = {
            id,
            hour,
            minute,
            label,
            triggered: false
        }
        this.alarms.push(alarm);
        localStorage.setItem("alarm", JSON.stringify(this.alarms));
        this.renderAlarm();
        DOM.getElement("alarmForm").reset();
    }

    // - Lặp qua mảng alarms[]
    // - Tạo HTML cho từng báo thức (giờ, phút, nút xóa)
    // - Hiển thị lên DOM (table hoặc list)
    // - Gắn sự kiện xóa → gọi deleteAlarm(id)
    renderAlarm() {
        const list = DOM.getElement("alarmList");
        DOM.clearElementContent(list);
        this.alarms.forEach(alarm => {
            const li = DOM.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            const liString = `<div>
            <strong>${alarm.hour.toString().padStart(2, "0")}:${alarm.minute.toString().padStart(2, "0")}</strong>
            <span class="ms-2">${alarm.label}</span>
            </div>`
            DOM.setHTML(li, liString);
            const deleteBtn = DOM.createElement("button");
            deleteBtn.className = "btn btn-sm btn-danger";
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => this.deleteAlarm(alarm.id));
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    }

    // - Tìm index alarm trong mảng theo id
    // - Xóa khỏi mảng alarms[]
    // - Cập nhật lại localStorage
    // - Gọi renderAlarms() để cập nhật UI
    deleteAlarm(id) {
        this.alarms = this.alarms.filter(alarm => alarm.id !== id);
        localStorage.setItem("alarm", JSON.stringify(this.alarms));
        this.renderAlarm();
    }

    // - Lấy giờ và phút hiện tại
    // - Lặp qua alarms[]
    // - Nếu giờ + phút trùng với giờ báo thức
    //   - Phát âm thanh báo thức
    //   - Hiển thị alert hoặc popup
    //   - (Tùy: xóa báo thức nếu chỉ kêu 1 lần)
    checkAlarm() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        this.alarms.forEach(alarm => {
            // Nếu đúng giờ phút và chưa kêu trong lần này
            const isTimeMatched = alarm.hour === currentHour && alarm.minute === currentMinute;
            const isAlreadyTriggered = alarm.triggered;

            if (isTimeMatched && !isAlreadyTriggered) {
                // Gán flag tránh kêu lại trong cùng phút
                alarm.triggered = true;

                // Hiển thị thông báo nếu muốn (gợi ý: DOM chứ không alert)
                const popup = DOM.getElement("alarmPopup");
                const label = DOM.getElement("alarmLabelPopup");
                popup.classList.remove("d-none");
                const labelStr = `⏰ ${alarm.label || "Báo thức!"}`;
                DOM.setText(label, labelStr);

                // Phát âm thanh
                // Tạo âm thanh lặp lại
                this.alarmSound = new Audio("/assets/sound/alarm.mp3");
                this.alarmSound.loop = true;
                this.alarmSound.play();

                const stopBtn = DOM.getElement("stopAlarmBtn");
                stopBtn.onclick = () => {
                    if (this.alarmSound) {
                        this.alarmSound.pause();
                        this.alarmSound.currentTime = 0;
                    }
                    popup.classList.add("d-none");
                }
            }
            // Reset flag khi thời gian không khớp nữa
            if (!isTimeMatched && alarm.triggered) {
                alarm.triggered = false;
            }
        });
    }

    // - Lấy dữ liệu từ localStorage key "alarms"
    // - Nếu có, parse JSON → gán vào mảng alarms[]
    loadAlarmsFromStorage() {
        const ALARM = localStorage.getItem("alarm");
        this.alarms = ALARM ? JSON.parse(ALARM) : [];

        // Đảm bảo mỗi alarm có trường triggered
        this.alarms.forEach(alarm => {
            alarm.triggered = false;
        });
    }
}
export default AlarmClock;