import { DateTime } from "luxon";

export class DateAdapter {
    static get currentTimeStamp() {
        return DateTime.now().setZone('America/Mexico_City').toISO();
    }
}