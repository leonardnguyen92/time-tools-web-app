import TimeUtils from "./time-utils.js";
import DOM from "./dom.js";
import Fireworks from "./fireworks.js";
class CountdownManager {
    constructor(options = {}) {
        // Mảng sự kiện (bao gồm mặc định và user thêm)
        this.events = [];
        this.defaultEvents = [
            {
                id: "EVENT_D4100",
                name: "Quốc Khánh",
                date: TimeUtils.getNationalDay(), // Lấy ngày Tết gần nhất
                audio: "assets/sound/HappyNewYear.mp3",
                msg: "Happy Việt Nam National Day",
                isUserEvent: false // Không cho xóa
            }
            ,
            {
                id: "EVENT_X6896",
                name: "Giải Phóng Miền Nam",
                date: TimeUtils.getSouthernLiberationDay(), // Lấy ngày Tết gần nhất
                audio: "assets/sound/HappyNewYear.mp3",
                msg: "Happy Southern Liberation Day",
                isUserEvent: false // Không cho xóa
            },
            {
                id: "EVENT_L2952",
                name: "Năm mới",
                date: TimeUtils.getNextNewYear(), // Lấy ngày Tết gần nhất
                audio: "assets/sound/HappyNewYear.mp3",
                msg: "Happy New Year",
                isUserEvent: false // Không cho xóa
            },
            {
                id: "EVENT_P4114",
                name: "Giáng sinh",
                date: TimeUtils.getNextChristmas(), // Lấy Giáng Sinh gần nhất
                audio: "assets/sound/JingleBells.mp3",
                msg: "Merry Christmas",
                isUserEvent: false
            },
            {
                id: "EVENT_Q4815",
                name: "Tết âm lịch Việt Nam",
                date: TimeUtils.getLunarNewYearDay(),
                audio: "assets/sound/HappyNewYear.mp3",
                msg: "Happy Việt Nam Lunar New Year Day",
                isUserEvent: false
            },
            {
                id: "EVENT_L0125",
                name: "Tết trung thu Việt Nam",
                date: TimeUtils.getLunarNewYearDay(),
                audio: "assets/sound/HappyNewYear.mp3",
                msg: "Happy Mid-Autumn Festival",
                isUserEvent: false
            }
        ];
        this.sounds = [
            {
                soundName: "Happy New Year",
                soundSrc: "assets/sound/HappyNewYear.mp3"
            },
            {
                soundName: "Tiếng chuông báo thức",
                soundSrc: "assets/sound/alarm.mp3"
            },
            {
                soundName: "Jingle Bells",
                soundSrc: "assets/sound/JingleBells.mp3"
            },
            {
                soundName: "Tiếng chuông hết giờ",
                soundSrc: "assets/sound/timeout.mp3"
            },
            {
                soundName: "Happy Birthday",
                soundSrc: "assets/sound/HappyBirthday.mp3"
            },
            {
                soundName: "Clock On Hours",
                soundSrc: "assets/sound/clockonhours.mp3"
            },
            {
                soundName: "Edm Tiktok",
                soundSrc: "assets/sound/EdmTiktok.mp3"
            },
            {
                soundName: "Minion",
                soundSrc: "assets/sound/MissionImpossibleMinion.mp3"
            },
            {
                soundName: "Ringtone",
                soundSrc: "assets/sound/Ringtone.mp3"
            },
            {
                soundName: "Toothless Dancing",
                soundSrc: "assets/sound/ToothlessDancing.mp3"
            }
        ];
        this.userEvents = [];

        // Lưu các phần tử DOM
        this.daysId = DOM.getElement("cdDays");
        this.hoursId = DOM.getElement("cdHours");
        this.minutesId = DOM.getElement("cdMinutes");
        this.secondsId = DOM.getElement("cdSeconds");
        this.messageId = DOM.getElement("msgDisplay");
        this.titleId = DOM.getElement("titleEvents");
        this.tableBodyId = DOM.getElement("eventTableBody");
        this.addForm = DOM.getElement("addEventForm");
        this.editForm = DOM.getElement("editEventForm");
        this.deleteForm = DOM.getElement("deleteEventForm");
        this.addButton = DOM.getElement("addEventBtn");
        this.editButton = DOM.getElement("editEventBtn");
        this.deleteButton = DOM.getElement("deleteEventBtn");

        // Hiệu ứng và âm nhạc
        this.audioSrc = options.audioSrc;

        // Biến điều khiển
        this.interval = null;          // ID của setInterval
        this.currentEvent = null;      // Sự kiện hiện tại để countdown

        this.fireworks = new Fireworks("canvas");
        this.USER_EVENTS_KEY = "USER_EVENTS";
    }

    /**
      * Khởi tạo:
      * - Render bảng sự kiện
      * - Tìm sự kiện gần nhất
      * - Đặt sự kiện hiện tại
      * - Gắn sự kiện cho nút Thêm sự kiện
      */
    init() {
        this.renderEventTable()
        const nextEvent = this.findNextEvent();
        this.setCurrentEvent(nextEvent);
        this.bindAddEvent();
        this.bindEventTableActions();
        this.bindEditFormEvents();
    }

    /**
     * Tạo một id ngẫu nhiên
     * @returns Trả về string id với định dạng "EVENT_*****"
     */
    generateRandomEventID() {
        const prefix = "EVENT_";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let id;
        do {
            const randomCharacters = characters[Math.floor(Math.random() * characters.length)];
            const strNUmber = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
            id = prefix + randomCharacters + strNUmber;
        } while (this.getAllEvents().some(eventEL => eventEL.id === id));
        return id;
    }

    /**
     * Lấy toàn bộ sự kiện (cả default và user event)
     * @returns Array chứa toàn bộ sự kiện
     */
    getAllEvents() {
        this.userEvents = this.loadUserEvents();
        return [...this.defaultEvents, ...this.userEvents];
    }

    /**
     * Thêm sự kiện mới vào mảng
     * @param {object} eventObj - {id, name, date, isDelete: true}
     */
    addEvent(eventObj) {
        // Thêm sự kiện vào mảng events
        this.userEvents.push(eventObj);
        this.saveUserEvents(this.userEvents);
        // Gọi renderEventTable() để cập nhật UI
        this.renderEventTable();
        // Kiểm tra nếu event mới gần nhất => setCurrentEvent(eventObj)
        const nextEvent = this.findNextEvent();
        this.setCurrentEvent(nextEvent);
    }

    /**
     * Tìm sự kiện gần nhất so với hiện tại
     * @returns {object|null}
     */
    findNextEvent() {
        const allEvents = this.getAllEvents();
        const furtureEvent = allEvents.filter(eventEl => eventEl.date.getTime() > Date.now()).sort((a, b) => a.date - b.date);
        // Trả về sự kiện đầu tiên hoặc null nếu không có
        const nextEvent = furtureEvent.length > 0 ? furtureEvent[0] : null
        return nextEvent;
    }

    /**
     * Đặt sự kiện hiện tại để countdown
     * @param {object} eventObj
     */
    setCurrentEvent(eventObj) {
        this.stopCountdown();
        // Cập nhật this.currentEvent = eventObj
        this.currentEvent = eventObj;
        // Hiển thị tên sự kiện trong titleId
        DOM.setText(this.titleId, `Đếm ngược tới ${this.currentEvent.name}`);
        DOM.setText(this.messageId, eventObj.msg);
        // Gọi startCountdown()
        this.startCountdown();
    }

    /**
     * Bắt đầu countdown cho sự kiện hiện tại
     */
    startCountdown() {
        // Nếu đã có interval => clearInterval
        if (this.interval) clearInterval(this.interval);
        // Tạo interval mới => gọi updateCountdown() mỗi giây
        this.interval = setInterval(() => this.updateCountdown(), 1000);
    }

    /**
     * Dừng countdown hiện tại
     */
    stopCountdown() {
        // Clear interval nếu tồn tại
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    /**
     * Cập nhật countdown (gọi mỗi giây)
     */
    updateCountdown() {
        // Tính thời gian còn lại bằng TimeUtils.calculateRemainingTime()
        const timeRemaining = TimeUtils.calculateRemainingTime(this.currentEvent.date.getTime());
        // Nếu isOver === true => gọi handleEventReached()
        if (timeRemaining.isOver) {
            this.handleEventReached();
        } else {
            this.updateCountdownUI(timeRemaining);
        }
    }

    /**
     * Cập nhật UI countdown
     * @param {object} timeObj - {days, hours, minutes, seconds}
     */
    updateCountdownUI(timeObj) {
        // Cập nhật DOM: cdDays, cdHours, cdMinutes, cdSeconds, {days, hours, minutes, seconds}
        DOM.setText(this.daysId, timeObj.days);
        DOM.setText(this.hoursId, timeObj.hours);
        DOM.setText(this.minutesId, timeObj.minutes);
        DOM.setText(this.secondsId, timeObj.seconds);
    }

    /**
     * Xử lý khi sự kiện đến:
     * - Dừng countdown
     * - Hiển thị thông báo trong messageId
     * - Gọi playMusic()
     * - Gọi startFireworks()
     */
    handleEventReached() {
        // stopCountdown()
        this.stopCountdown();
        const audio = this.playMusic();

        // Bắt đầu pháo hoa
        this.fireworks.start(this.currentEvent.msg);

        // Đợi khi nhạc kết thúc hoặc click → kết thúc sự kiện
        const cleanupAndProceed = () => {
            this.fireworks.stop();
            document.removeEventListener("click", cleanupAndProceed);
            audio.removeEventListener("ended", cleanupAndProceed);

            const nextEvent = this.findNextEvent();
            if (nextEvent) {
                this.setCurrentEvent(nextEvent); // ⬅ nhảy tới sự kiện tiếp theo
            }
        };

        document.addEventListener("click", cleanupAndProceed);
        audio.addEventListener("ended", cleanupAndProceed);
    }

    /**
     * Gắn sự kiện cho nút Thêm sự kiện trong form
     */
    bindAddEvent() {
        DOM.getElement("addEvent").addEventListener("click", () => {
            this.bindEventForm(this.addForm, "show")
        });

        const cancleAddEvent = DOM.getElement("cancelAddEvent");
        cancleAddEvent.addEventListener("click", () => {
            this.bindEventForm(this.addForm, "hide")
        });

        this.addButton.addEventListener("click", () => {
            const eventObj = this.getEventFromAddForm();
            this.addEvent(eventObj);
            this.addForm.reset();
        })
    }

    /**
     * Lấy dữ liệu khi người dùng nhập từ form thêm sự kiện
     * @returns Object
     */
    getEventFromAddForm() {
        const evName = DOM.getElement("evName").value;
        const evHours = TimeUtils.formatTwoDigits(DOM.getElement("evHours").value);
        const evMinutes = TimeUtils.formatTwoDigits(DOM.getElement("evMinutes").value);
        const evSeconds = TimeUtils.formatTwoDigits(DOM.getElement("evSeconds").value);
        const evDays = TimeUtils.formatTwoDigits(DOM.getElement("evDays").value);
        const evMonths = TimeUtils.formatTwoDigits(DOM.getElement("evMonths").value);
        const evYears = DOM.getElement("evYears").value;
        const evMusic = DOM.getElement("evMusic").value;
        const evMsg = DOM.getElement("evMsg").value;
        console.log(`${evYears}-${evMonths}-${evDays}T${evHours}:${evMinutes}:${evSeconds}`);
        const evTimes = new Date(`${evYears}-${evMonths}-${evDays}T${evHours}:${evMinutes}:${evSeconds}`);
        return {
            id: this.generateRandomEventID(),
            name: evName,
            date: evTimes,
            audio: evMusic,
            msg: evMsg,
            isUserEvent: true
        };
    }

    /**
    * Tải danh sách sự kiện do người dùng nhập từ localStorage
    * @returns {Array} Danh sách sự kiện
    */
    loadUserEvents() {
        try {
            const strJson = localStorage.getItem(this.USER_EVENTS_KEY);
            const parsed = strJson ? JSON.parse(strJson) : [];
            // Convert lại string -> Date object
            return parsed.map(ev => ({ ...ev, date: new Date(ev.date) }));
        } catch (e) {
            console.error("Lỗi khi parse dữ liệu USER_EVENTS:", e);
            return [];
        }
    }

    /**
     * Lưu danh sách sự kiện người dùng nhập vào localStorage
     * @param {Array|Object} userEvents - Dữ liệu sự kiện người dùng
     */
    saveUserEvents(userEvents) {
        try {
            if (typeof userEvents === "object") {
                const strJson = JSON.stringify(userEvents);
                localStorage.setItem(this.USER_EVENTS_KEY, strJson);
            } else {
                console.warn("Dữ liệu truyền vào saveUserEvents không hợp lệ:", userEvents);
            }
        } catch (e) {
            console.error("Lỗi khi stringify USER_EVENTS:", e);
        }
    }

    /**
     * Render bảng danh sách sự kiện
     */
    renderEventTable() {
        const allEvents = this.getAllEvents();
        DOM.clearElementContent(this.tableBodyId);
        // Xóa tbody cũ
        allEvents.forEach((eventEl, index) => {
            const tRow = DOM.createElement("tr");
            const buttonEvents = this.showButtonInEvents(eventEl);
            const rowStr = `
                <td>${index + 1}</td>
                <td>${eventEl.id}</td>
                <td>${eventEl.name}</td>
                <td>${eventEl.date}</td>
                <td>${buttonEvents}</td>
            `;
            DOM.setHTML(tRow, rowStr);
            DOM.appendChildren(this.tableBodyId, [tRow]);
        });
        this.renderSelectMusic();
    }

    /**
     * Render danh sách âm thanh thông báo
     */
    renderSelectMusic() {
        const evMusicElement = document.querySelectorAll(".eventSounds");
        let strSelect = "";
        this.sounds.forEach(sound => {
            strSelect += `
                <option value="${sound.soundSrc}">${sound.soundName}</option>
            `;
        });
        evMusicElement.forEach(element => {
            DOM.setHTML(element, strSelect);
        })
    }

    /**
    * Gắn event listener cho bảng (nút chọn, xóa, sửa)
    */
    bindEventTableActions() {
        // Lắng nghe click trong tbody
        this.tableBodyId.addEventListener("click", (e) => {
            const btnSelect = e.target.closest(".btn-select");
            // Nếu click vào nút "Chọn" -> gọi selectEvent(id)
            if (btnSelect) {
                const id = btnSelect.dataset.id;
                this.selectEvent(id);
            }
            // Nếu click vào nút "Sửa" -> gọi editEvent(id)
            const btnEdit = e.target.closest(".btn-edit");
            if (btnEdit) {
                const id = btnEdit.dataset.id;
                console.log("Delete: " + id);
                this.showEditForm(id);
            }
            // Nếu click vào nút "Xóa" -> gọi removeEvent(id)
            const btnDelete = e.target.closest(".btn-delete");
            if (btnDelete) {
                const id = btnDelete.dataset.id;
                console.log("Delete: " + id);
                this.showDeleteForm(id);
            }
        });
    }

    /**
     * Chọn sự kiện để countdown
     * @param {string} id - ID sự kiện
     */
    selectEvent(id) {
        const allEvents = this.getAllEvents();
        const eventObj = allEvents.find(eventEl => eventEl.id === id);
        if (eventObj) {
            this.setCurrentEvent(eventObj);
        }
    }

    /**
     * Xử lý khi ấn các button trong form edit
     */
    bindEditFormEvents() {
        this.editButton.addEventListener("click", () => {
            this.confirmEditEvent();
            this.bindEventForm(this.editForm, "hide");
        });

        const cancleEditEvenet = DOM.getElement("cancelEditEvent");
        cancleEditEvenet.addEventListener("click", () => {
            this.bindEventForm(this.editForm, "hide");
        })
    }

    /**
     * Hiển thị form edit khi người dùng ấn button edit trong bảng
     * @param {id} eventId 
     * @returns 
     */
    showEditForm(eventId) {
        this.bindEventForm(this.editForm, "show");
        const eventObj = this.userEvents.find(eventEl => eventEl.id === eventId);
        if (!eventObj) return;
        if (eventObj) {
            DOM.getElement("editId").value = eventObj.id;
            DOM.getElement("editEventName").value = eventObj.name;
            const timeEvent = eventObj.date;
            DOM.getElement("editHours").value = TimeUtils.formatTwoDigits(timeEvent.getHours());
            DOM.getElement("editMinutes").value = TimeUtils.formatTwoDigits(timeEvent.getMinutes());
            DOM.getElement("editSeconds").value = TimeUtils.formatTwoDigits(timeEvent.getSeconds());
            DOM.getElement("editDays").value = TimeUtils.formatTwoDigits(timeEvent.getDate());
            DOM.getElement("editMonths").value = TimeUtils.formatTwoDigits(timeEvent.getMonth() + 1);
            DOM.getElement("editYears").value = timeEvent.getFullYear();
            DOM.getElement("editMusic").value = eventObj.audio;
            DOM.getElement("editMsg").value = eventObj.msg;
        }
        this.currentEventId = eventId;
    }

    /**
     * Lấy thông tin sự kiện khi người dùng nhập dữ liệu vào trong form edit
     */
    getEventFromEditForm() {
        const eventId = DOM.getElement("editId").value;
        const eventName = DOM.getElement("editEventName").value;
        const eventHours = DOM.getElement("editHours").value;
        const eventMinutes = DOM.getElement("editMinutes").value;
        const eventSeconds = DOM.getElement("editSeconds").value;
        const eventDays = DOM.getElement("editDays").value;
        const eventMonths = DOM.getElement("editMonths").value;
        const eventYears = DOM.getElement("editYears").value;
        //2025-07-29T15:05:00
        const dateStr = `${eventYears}-${eventMonths}-${eventDays}T${eventHours}:${eventMinutes}:${eventSeconds}`;
        const eventDate = new Date(dateStr);
        console.log(eventName, eventYears, eventMonths, eventDays, eventHours, eventMinutes, eventSeconds);
        const eventAudio = DOM.getElement("editMusic").value;
        const eventMsg = DOM.getElement("editMsg").value;

        return {
            id: eventId,
            name: eventName,
            date: eventDate,
            audio: eventAudio,
            msg: eventMsg
        }
    }

    /**
     * Xử lý khi ấn button xác nhận trong edit form
     */
    confirmEditEvent() {
        const updateEvent = this.getEventFromEditForm();
        const index = this.userEvents.findIndex(elementEl => elementEl.id === this.currentEventId);
        if (index !== -1) {
            this.userEvents[index] = {
                ...this.userEvents[index],
                ...updateEvent
            };
            this.saveUserEvents(this.userEvents);
            this.renderEventTable();
            this.bindEventForm(this.editForm, "hide");
            this.currentEventId = null;
        }
    }

    /**
    * Hiển thị form xoá sự kiện với thông tin cụ thể
    * @param {string|number} eventId - ID của sự kiện cần xoá
    */
    showDeleteForm(eventId) {
        this.bindEventForm(this.deleteForm, "show");
        console.log(this.userEvents);
        const eventObj = this.userEvents.find(ev => ev.id === eventId);
        console.log(eventObj);
        if (!eventObj) return;
        DOM.getElement("deleteEventName").value = eventObj.name;
        DOM.getElement("deleteEventTime").value = eventObj.date;
        this.eventToDeleteId = eventId;
        this.deleteButton.onclick = () => this.confirmDeleteEvent();
        DOM.getElement("cancelDeleteEvent").addEventListener("click", () => {
            this.bindEventForm(this.deleteForm, "hide");
            return;
        })
    }

    /**
     * Xác nhận xoá sự kiện sau khi người dùng nhấn nút "Xoá" trong form
     */
    confirmDeleteEvent() {
        console.log("confirmDeleteEvent");
        if (!this.eventToDeleteId) return;

        const index = this.userEvents.findIndex(ev => ev.id === this.eventToDeleteId);
        if (index !== -1) {
            this.userEvents.splice(index, 1);
            this.saveUserEvents(this.userEvents);
            this.renderEventTable();
            const nextEvent = this.findNextEvent();
            this.setCurrentEvent(nextEvent);
            this.bindEventForm(this.deleteForm, "hide");
        }
        this.eventToDeleteId = null;
    }

    /**
     * Phát nhạc khi sự kiện đến
     */
    playMusic() {
        if (this.currentEvent && this.currentEvent.audio) {
            const audio = new Audio(this.currentEvent.audio);
            audio.play();
            return audio;
        }
        return null;
    }

    /**
     * Hiển thị button trong bảng
     * @param {object} eventObj 
     * @returns 
     */
    showButtonInEvents(eventObj) {
        const disableAtt = eventObj.isUserEvent ? "" : "disabled";
        const btnEventObj = `
            <button type="button" class="btn btn-select" data-id="${eventObj.id}">
                <i class="fas fa-check"></i>
            </button>
            <button type="button" class="btn btn-edit" data-id="${eventObj.id}" ${disableAtt} aria-disabled="${!eventObj.isUserEvent}">
                <i class="fas fa-pen"></i>
            </button>
            <button type="button" class="btn btn-delete" data-id="${eventObj.id}" ${disableAtt} aria-disabled="${!eventObj.isUserEvent}">
                <i class="fas fa-trash"></i>
            </button>`

        return btnEventObj;
    }

    /**
     * Ẩn hiện form theo trạng thái.
     * @param {form id} formId 
     * @param {hide, show} state 
     */
    bindEventForm(formId, state) {
        if (state === "show") {
            formId.classList.remove("d-none");
            formId.reset();
        }
        if (state === "hide") {
            formId.reset();
            formId.classList.add("d-none");
        }
    }
}
export default CountdownManager;
