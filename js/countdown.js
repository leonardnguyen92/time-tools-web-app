import TimeUtils from "./time-utils.js";
import DOM from "./dom.js";
import Fireworks from "./fireworks.js";
class CountdownManager {
    constructor(options = {}) {
        // Mảng sự kiện (bao gồm mặc định và user thêm)
        this.events = [
            {
                id: 1,
                name: "Quốc Khánh",
                date: TimeUtils.getNationalDay(), // Lấy ngày Tết gần nhất
                audio: "assets/sound/HappyNewYear.mp3",
                msg: "Happy Việt Nam National Day",
                isDelete: false // Không cho xóa
            }
            ,
            {
                id: 2,
                name: "Giải Phóng Miền Nam",
                date: TimeUtils.getSouthernLiberationDay(), // Lấy ngày Tết gần nhất
                audio: "assets/sound/HappyNewYear.mp3",
                msg: "Happy Southern Liberation Day",
                isDelete: false // Không cho xóa
            },
            {
                id: 3,
                name: "Năm mới",
                date: TimeUtils.getNextNewYear(), // Lấy ngày Tết gần nhất
                audio: "assets/sound/HappyNewYear.mp3",
                msg: "Happy New Year",
                isDelete: false // Không cho xóa
            },
            {
                id: 4,
                name: "Giáng sinh",
                date: TimeUtils.getNextChristmas(), // Lấy Giáng Sinh gần nhất
                audio: "assets/sound/JingleBells.mp3",
                msg: "Merry Christmas",
                isDelete: false
            },
            {
                id: 5,
                name: "Sự kiện test",
                date: new Date("2025-07-29T12:25:00"),
                audio: "assets/sound/HappyNewYear.mp3",
                msg: "Happy Test Event",
                isDelete: true
            }
        ];

        // Lưu các phần tử DOM
        this.daysId = DOM.getElement("cdDays");
        this.hoursId = DOM.getElement("cdHours");
        this.minutesId = DOM.getElement("cdMinutes");
        this.secondsId = DOM.getElement("cdSeconds");
        this.messageId = DOM.getElement("msgDisplay");
        this.titleId = DOM.getElement("titleEvents");
        this.tableBodyId = DOM.getElement("eventTableBody");

        // Hiệu ứng và âm nhạc
        this.audioSrc = options.audioSrc;

        // Biến điều khiển
        this.interval = null;          // ID của setInterval
        this.currentEvent = null;      // Sự kiện hiện tại để countdown

        this.fireworks = new Fireworks("canvas");
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
        this.bindEventTableActions();
        // Gọi renderEventTable() để hiển thị danh sách
        // Gọi findNextEvent() để tìm sự kiện gần nhất
        // Gọi setCurrentEvent(nextEvent) để bắt đầu đếm ngược
        // Gọi bindAddEvent() để xử lý thêm sự kiện từ modal
    }

    /**
     * Thêm sự kiện mới vào mảng
     * @param {object} eventObj - {id, name, date, isDelete: true}
     */
    addEvent(eventObj) {
        // Thêm sự kiện vào mảng events
        // Gọi renderEventTable() để cập nhật UI
        // Kiểm tra nếu event mới gần nhất => setCurrentEvent(eventObj)
    }

    /**
     * Xóa sự kiện theo id
     */
    removeEvent(id) {
        // Tìm sự kiện theo id
        // Nếu event.isDelete === false => không xóa
        // Nếu được xóa => remove khỏi mảng và renderEventTable()
    }

    /**
     * Tìm sự kiện gần nhất so với hiện tại
     * @returns {object|null}
     */
    findNextEvent() {
        // Lọc danh sách sự kiện còn ở tương lai
        // Sắp xếp theo thời gian tăng dần
        const furtureEvent = this.events.filter(eventEl => eventEl.date.getTime() > Date.now()).sort((a, b) => a.date - b.date);
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
        console.log(this.currentEvent.name);
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
        // Ngược lại => gọi updateCountdownUI(timeObj)
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
        // Cập nhật messageId: "Chúc mừng sự kiện..."
        const canvasDisplay = DOM.getElement("canvas");
        // Gọi playMusic()
        this.playMusic();
        // Gọi startFireworks()
        this.startFireworks();
        console.log("Event is Over");
    }

    /**
     * Gắn sự kiện cho nút Thêm sự kiện trong modal
     */
    bindAddEvent() {
        // Lấy input từ modal
        // Validate dữ liệu
        // Tạo đối tượng eventObj và gọi addEvent(eventObj)
    }

    /**
     * Render bảng danh sách sự kiện
     */
    renderEventTable() {
        DOM.clearElementContent(this.tableBodyId);
        // Xóa tbody cũ
        this.events.forEach((eventEl, index) => {
            const tRow = DOM.createElement("tr");
            const buttonEvents = this.showButtonInEvents(eventEl);
            const rowStr = `
                <td>${index + 1}</td>
                <td>${eventEl.name}</td>
                <td>${eventEl.date}</td>
                <td>${buttonEvents}</td>
            `;
            DOM.setHTML(tRow, rowStr);
            DOM.appendChildren(this.tableBodyId, [tRow]);
        })
        // Duyệt this.events => tạo <tr> cho mỗi sự kiện
        // Nút "Xóa" chỉ bật nếu isDelete === true
        // Nút "Chọn làm countdown"
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
                this.editEvent(id);
            }
            // Nếu click vào nút "Xóa" -> gọi removeEvent(id)
            const btnDelete = e.target.closest(".btn-delete");
            if (btnDelete) {
                const id = btnDelete.dataset.id;
                this.deleteEvent(id);
            }
        });



    }

    /**
     * Chọn sự kiện để countdown
     * @param {number} id - ID sự kiện
     */
    selectEvent(id) {
        // Tìm event theo id trong this.events
        const eventObj = this.events.find(eventEl => eventEl.id === Number(id));
        if (eventObj) {
            this.setCurrentEvent(eventObj);
        }
        // Gọi setCurrentEvent(event)
        // Hiển thị thông báo đổi sự kiện hiện tại (optional)
    }

    /**
     * Chỉnh sửa sự kiện (optional)
     * @param {number} id
     */
    editEvent(id) {
        // Lấy event
        // Đổ dữ liệu vào modal
        // Lưu lại khi user nhấn "Cập nhật"
    }

    /**
     * Xoá sự kiện
     * @param {number} id 
     */
    deleteEvent(id) {

    }

    /**
     * Phát nhạc khi sự kiện đến
     */
    playMusic() {
        if (this.currentEvent && this.currentEvent.audio) {
            const audio = new Audio(this.currentEvent.audio);
            audio.play();

            // Hàm dừng nhạc và gỡ listener
            const stopMusic = () => {
                audio.pause();
                audio.currentTime = 0;
                this.fireworks.stop()
                document.removeEventListener("click", stopMusic); // gỡ để tránh gọi lại
            };

            // Khi người dùng click vào trang → dừng nhạc
            document.addEventListener("click", stopMusic);

            // Khi nhạc kết thúc → dừng nhạc
            audio.addEventListener("ended", stopMusic);

            return audio;
        }
    }

    /**
     * Hiệu ứng pháo hoa
     */
    startFireworks() {
        const sound = this.playMusic();
        this.fireworks.start(this.currentEvent.msg, this.currentEvent.audio, 0);
    }
    showButtonInEvents(eventObj) {
        let btnEventObj = "";
        if (eventObj.isDelete) {
            btnEventObj = `<button type="button" class="btn btn-select" data-id="${eventObj.id}"><i class="fas fa-check"></i></button>
            <button type="button" class="btn btn-edit" data-id="${eventObj.id}"><i class="fas fa-pen"></i></button>
            <button type="button" class="btn btn-delete" data-id="${eventObj.id}" ><i class="fas fa-trash"></i></button>`
        } else {
            btnEventObj = `<button type="button" class="btn btn-select" data-id="${eventObj.id}"><i class="fas fa-check"></i></button>
            <button type="button" class="btn btn-edit" disabled><i class="fas fa-pen"></i></button>
            <button type="button" class="btn btn-delete" disabled><i class="fas fa-trash"></i></button>`
        }
        return btnEventObj;
    }
}
export default CountdownManager;
const cm = new CountdownManager();
cm.init();