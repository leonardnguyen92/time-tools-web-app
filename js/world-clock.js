import DOM from "./dom.js";
import TimeUtils from "./time-utils.js";

class WorldClock {
    cities = [
        { name: "Baker Island", id: "baker-island", flag: "🇺🇸", offset: -12 },
        { name: "Pago Pago", id: "pago-pago", flag: "🇦🇸", offset: -11 },
        { name: "Honolulu", id: "honolulu", flag: "🇺🇸", offset: -10 },
        { name: "Anchorage", id: "anchorage", flag: "🇺🇸", offset: -9 },
        { name: "Los Angeles", id: "los-angeles", flag: "🇺🇸", offset: -8 },
        { name: "Denver", id: "denver", flag: "🇺🇸", offset: -7 },
        { name: "Mexico City", id: "mexico-city", flag: "🇲🇽", offset: -6 },
        { name: "New York", id: "new-york", flag: "🇺🇸", offset: -5 },
        { name: "Santiago", id: "santiago", flag: "🇨🇱", offset: -4 },
        { name: "Buenos Aires", id: "buenos-aires", flag: "🇦🇷", offset: -3 },
        { name: "South Georgia", id: "south-georgia", flag: "🇬🇸", offset: -2 },
        { name: "Praia", id: "praia", flag: "🇨🇻", offset: -1 },
        { name: "London", id: "london", flag: "🇬🇧", offset: 0 },
        { name: "Paris", id: "paris", flag: "🇫🇷", offset: 1 },
        { name: "Athens", id: "athens", flag: "🇬🇷", offset: 2 },
        { name: "Moscow", id: "moscow", flag: "🇷🇺", offset: 3 },
        { name: "Dubai", id: "dubai", flag: "🇦🇪", offset: 4 },
        { name: "Karachi", id: "karachi", flag: "🇵🇰", offset: 5 },
        { name: "Dhaka", id: "dhaka", flag: "🇧🇩", offset: 6 },
        { name: "Hà Nội", id: "hà-nội", flag: "🇻🇳", offset: 7 },
        { name: "Beijing", id: "beijing", flag: "🇨🇳", offset: 8 },
        { name: "Tokyo", id: "tokyo", flag: "🇯🇵", offset: 9 },
        { name: "Sydney", id: "sydney", flag: "🇦🇺", offset: 10 },
        { name: "Nouméa", id: "noumea", flag: "🇳🇨", offset: 11 },
        { name: "Auckland", id: "auckland", flag: "🇳🇿", offset: 12 },
        { name: "Apia", id: "apia", flag: "🇼🇸", offset: 13 },
        { name: "Kiritimati", id: "kiritimati", flag: "🇰🇮", offset: 14 }
    ];
    currentCity = null;
    currentOffset = 0;
    interval = null;
    getLocalTimezoneOffset() {
        const now = new Date();
        const offset = - now.getTimezoneOffset() / 60;
        return offset;
    }
    getTimeInUTCOffset(offset) {
        //B1: Lấy giờ hiện tại bằng new Date()
        const now = new Date();
        //B2: Lấy UTC time bằng cách cộng thêm getTimezoneOffset()
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        //B3: Cộng thêm offset giờ cần chuyển
        const targetTime = utc + offset * 3600000;
        //B4: Trả về đối tượng Date mới
        return new Date(targetTime);
    }
    formatTimeString(date) {
        const time = this.getLocalTime(date);
        const day = time.dayShort;
        const hour = time.hour;
        const minute = time.minute;
        const second = time.second;
        const iconSun = `<i class="fas fa-sun icon-yellow"></i>`;
        const iconNight = `<i class="fas fa-moon icon-yellow"></i>`;
        const isDayTime = date.getHours() >= 7 && date.getHours() < 18;
        const icon = isDayTime ? iconSun : iconNight;
        return `${day} - ${hour}:${minute}:${second}  ${icon}`;
    }
    renderLocalTime(offset, cityName) {
        const localTimeDiv = DOM.getElement("localTime");
        DOM.clearElementContent(localTimeDiv);
        const localDate = this.getTimeInUTCOffset(offset);
        const times = this.getLocalTime(localDate);
        const pDate = DOM.createElement("p", { class: "fs-3 fw-bold fw-italic text-center" });
        const pDateStr = `${times.dayLength}, ${times.date} tháng ${times.month} năm ${times.year}`
        DOM.setText(pDate, pDateStr);
        const pTime = DOM.createElement("p", { class: "fw-bold fw-italic text-center digit-digital" });
        const pTimeStr = `${times.hour}:${times.minute}:${times.second}`
        DOM.setHTML(pTime, pTimeStr);

        let pCity = "";
        if (cityName) {
            pCity = cityName ? DOM.createElement("p", { class: "fw-bold fw-italic text-center" }) : "";
            const pCityStr = cityName ? cityName : "";
            DOM.setText(pCity, pCityStr);
        }
        const elements = [pDate, pTime];
        if (pCity) elements.push(pCity);
        DOM.appendChildren(localTimeDiv, elements);
    }
    getLocalTime(date) {
        const getDayShortName = (date) => {
            const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            return days[date.getDay()];
        };
        return {
            dayShort: getDayShortName(date),
            dayLength: TimeUtils.getDayOfWeekVN(date.getDay()),
            date: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            hour: TimeUtils.formatTwoDigits(date.getHours()),
            minute: TimeUtils.formatTwoDigits(date.getMinutes()),
            second: TimeUtils.formatTwoDigits(date.getSeconds()),
        };
    }
    createWorldClockCard(city) {
        const col = DOM.createElement("div", { class: "col-6 col-md-4 col-lg-3 col-xl-2 mb-3" });

        col.innerHTML = `
        <div class="d-flex align-items-center p-1 rounded bg-light shadow-sm">
            <div class="fw-semibold me-3 text-center" style="min-width: 40px">${city.flag}</div>
            <div class="d-flex flex-column">
            <a href="#" data-city="${city.name}" data-offset="${city.offset}" class="city">
                <div class="fw-semibold cityName">${city.name}</div>
                <div id="${city.id}" class="text-secondary small">Đang load dữ liệu</div>
                </a>
            </div>
        </div>`
        return col;
    }
    renderWorldClocks() {
        const worldClockList = DOM.getElement("worldClockList");
        this.cities.forEach(city => {
            DOM.appendChildren(worldClockList, [this.createWorldClockCard(city)]);
        });
    }
    updateLocalTime(offset) {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(() => this.renderLocalTime(offset, this.currentCity), 1000);
        this.renderLocalTime(offset, this.currentCity);
    }
    updateWorldClocks() {
        this.cities.forEach(city => {
            const stringId = city.id;
            const cityId = DOM.getElement(stringId);
            DOM.clearElementContent(cityId);
            const stringLocalTime = this.formatTimeString(this.getTimeInUTCOffset(city.offset));
            DOM.setHTML(cityId, stringLocalTime);
        });
    }
    attachCityClickEvents() {
        const cityElements = document.querySelectorAll(".city");
        cityElements.forEach(cityEl => {
            cityEl.addEventListener("click", e => {
                const cityName = cityEl.dataset.city;
                const offset = cityEl.dataset.offset;
                this.currentCity = cityName;
                this.currentOffset = offset;
                this.updateLocalTime(offset);
            });
        })
    }
    initLocalTimeClock() {
        const localOffset = this.getLocalTimezoneOffset();
        this.renderLocalTime(localOffset);
        this.updateLocalTime(localOffset);
    }
    initWorldClock() {
        this.renderWorldClocks();
        this.attachCityClickEvents();
        this.initLocalTimeClock();
        this.updateWorldClocks();
        setInterval(() => this.updateWorldClocks(), 1000);
    }
}
export default WorldClock;