import { DateTime } from "luxon";

export class DateAdapter {
    static get currentTimeStamp() {
        return DateTime.now().setZone('America/Mexico_City').toISO();
    }

    static normalizeDate(date: Date) {
        return DateTime.fromJSDate(date).setZone('America/Mexico_City').toJSDate();
    }
}