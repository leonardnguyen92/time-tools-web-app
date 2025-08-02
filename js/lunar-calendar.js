class LunarCalendar {

    static INT(d) {
        return Math.floor(d);
    }

    // Chuyển từ ngày dương sang JD (Julian Day)
    static jdFromDate(dd, mm, yy) {
        const a = this.INT((14 - mm) / 12);
        const y = yy + 4800 - a;
        const m = mm + 12 * a - 3;
        let jd = dd + this.INT((153 * m + 2) / 5) + 365 * y + this.INT(y / 4);
        jd -= this.INT(y / 100);
        jd += this.INT(y / 400);
        return jd - 32045;
    }

    // Chuyển từ JD sang ngày dương
    static jdToDate(jd) {
        let a = jd + 32044;
        let b = this.INT((4 * a + 3) / 146097);
        let c = a - this.INT((b * 146097) / 4);
        let d = this.INT((4 * c + 3) / 1461);
        let e = c - this.INT((1461 * d) / 4);
        let m = this.INT((5 * e + 2) / 153);
        let day = e - this.INT((153 * m + 2) / 5) + 1;
        let month = m + 3 - 12 * this.INT(m / 10);
        let year = b * 100 + d - 4800 + this.INT(m / 10);
        return [day, month, year];
    }

    // Tính thời điểm trăng mới (New Moon) theo k
    static NewMoon(k) {
        const T = k / 1236.85;
        const T2 = T * T;
        const T3 = T2 * T;
        const dr = Math.PI / 180;
        let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
        Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
        const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
        const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
        const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
        let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr)
            + 0.0021 * Math.sin(2 * dr * M)
            - 0.4068 * Math.sin(Mpr * dr)
            + 0.0161 * Math.sin(dr * 2 * Mpr)
            - 0.0004 * Math.sin(dr * 3 * Mpr)
            + 0.0104 * Math.sin(dr * 2 * F)
            - 0.0051 * Math.sin(dr * (M + Mpr))
            - 0.0074 * Math.sin(dr * (M - Mpr))
            + 0.0004 * Math.sin(dr * (2 * F + M))
            - 0.0004 * Math.sin(dr * (2 * F - M))
            - 0.0006 * Math.sin(dr * (2 * F + Mpr))
            + 0.0010 * Math.sin(dr * (2 * F - Mpr))
            + 0.0005 * Math.sin(dr * (2 * Mpr + M));
        let deltaT = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
        return Jd1 + C1 - deltaT;
    }

    // Lấy ngày JD của trăng mới lần thứ k theo múi giờ
    static getNewMoonDay(k, timeZone) {
        return this.INT(this.NewMoon(k) + 0.5 + timeZone / 24);
    }

    // Tính kinh độ mặt trời tại ngày JD (đơn vị: 30 độ/12 cung)
    static getSunLongitude(jdn, timeZone) {
        const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
        const T2 = T * T;
        const dr = Math.PI / 180;
        const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
        const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
        const DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M)
            + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M)
            + 0.000290 * Math.sin(dr * 3 * M);
        const L = L0 + DL;
        return this.INT((L * dr / Math.PI * 6) % 12);
    }

    // Lấy ngày bắt đầu tháng 11 âm lịch của năm âm lịch (theo múi giờ)
    static getLunarMonth11(yy, timeZone) {
        const off = this.jdFromDate(31, 12, yy) - 2415021;
        const k = this.INT(off / 29.530588853);
        let nm = this.getNewMoonDay(k, timeZone);
        const sunLong = this.getSunLongitude(nm, timeZone);
        return sunLong >= 9 ? this.getNewMoonDay(k - 1, timeZone) : nm;
    }

    // Tính offset tháng nhuận dựa trên ngày bắt đầu tháng 11 âm lịch
    static getLeapMonthOffset(a11, timeZone) {
        const k = this.INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
        let last = 0;
        let i = 1;
        let arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
        do {
            last = arc;
            i++;
            arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
        } while (arc !== last && i < 14);
        return i - 1;
    }

    /**
     * Chuyển từ ngày dương sang ngày âm lịch
     * @param {number} dd - ngày dương
     * @param {number} mm - tháng dương (1-12)
     * @param {number} yy - năm dương
     * @param {number} timeZone - múi giờ (mặc định 7)
     * @returns {[number, number, number, number]} - [ngày âm, tháng âm, năm âm, tháng nhuận (0 hoặc 1)]
     */
    static convertSolarToLunar(dd, mm, yy, timeZone = 7) {
        const dayNumber = this.jdFromDate(dd, mm, yy);
        const k = this.INT((dayNumber - 2415021.076998695) / 29.530588853);
        const monthStart = this.getNewMoonDay(k + 1, timeZone);
        let a11 = this.getLunarMonth11(yy, timeZone);
        let b11 = a11;
        let lunarYear = yy;

        if (a11 >= monthStart) {
            a11 = this.getLunarMonth11(yy - 1, timeZone);
            lunarYear = yy;
        } else {
            b11 = this.getLunarMonth11(yy + 1, timeZone);
            lunarYear = yy;
        }

        const lunarDay = dayNumber - monthStart + 1;
        const diff = this.INT((monthStart - a11) / 29);
        let lunarMonth = diff + 11;
        let lunarLeap = 0;

        if (b11 - a11 > 365) {
            const leapMonthDiff = this.getLeapMonthOffset(a11, timeZone);
            if (diff >= leapMonthDiff) {
                lunarMonth = diff + 10;
                if (diff === leapMonthDiff) lunarLeap = 1;
            }
        }

        if (lunarMonth > 12) lunarMonth -= 12;
        if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

        return [lunarDay, lunarMonth, lunarYear, lunarLeap];
    }

    /**
     * Chuyển từ ngày âm sang ngày dương
     * @param {number} lunarDay - ngày âm
     * @param {number} lunarMonth - tháng âm
     * @param {number} lunarYear - năm âm
     * @param {boolean} isLeapMonth - có phải tháng nhuận không, mặc định false
     * @param {number} timeZone - múi giờ (mặc định 7)
     * @returns {[number, number, number]} - [ngày dương, tháng dương, năm dương]
     */
    static convertLunarToSolar(lunarDay, lunarMonth, lunarYear, isLeapMonth = false, timeZone = 7) {
        let a11, b11, k, off, leapOff, leapMonth, monthStart;

        if (lunarMonth < 11) {
            a11 = this.getLunarMonth11(lunarYear - 1, timeZone);
            b11 = this.getLunarMonth11(lunarYear, timeZone);
        } else {
            a11 = this.getLunarMonth11(lunarYear, timeZone);
            b11 = this.getLunarMonth11(lunarYear + 1, timeZone);
        }

        k = this.INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
        off = lunarMonth - 11;
        if (off < 0) off += 12;

        if (b11 - a11 > 365) {
            leapOff = this.getLeapMonthOffset(a11, timeZone);
            leapMonth = leapOff - 2;
            if (leapMonth < 0) leapMonth += 12;
            if (isLeapMonth && lunarMonth !== leapMonth) {
                // Tháng nhập không hợp lệ
                return [0, 0, 0];
            } else if (isLeapMonth || off >= leapOff) {
                off++;
            }
        }

        monthStart = this.getNewMoonDay(k + off, timeZone);
        return this.jdToDate(monthStart + lunarDay - 1);
    }

    /**
     * Lấy tháng nhuận trong năm âm lịch (nếu không có trả về -1)
     * @param {number} lunarYear - năm âm lịch
     * @param {number} timeZone - múi giờ (mặc định 7)
     * @returns {number} - tháng nhuận (1-12) hoặc -1 nếu không có
     */
    static getLeapMonth(lunarYear, timeZone = 7) {
        const a11 = this.getLunarMonth11(lunarYear, timeZone);
        const b11 = this.getLunarMonth11(lunarYear + 1, timeZone);
        if (b11 - a11 <= 365) return -1; // Không có tháng nhuận

        const leapOff = this.getLeapMonthOffset(a11, timeZone);
        let leapMonth = leapOff - 2;
        if (leapMonth < 0) leapMonth += 12;
        return leapMonth;
    }
}
export default LunarCalendar;
