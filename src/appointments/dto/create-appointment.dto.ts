import { Matches } from "class-validator";

export class CreateAppointmentDto {
    @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, { message: 'The date is not valid!' })
    date: string;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'The time is not valid!' })
    time: string;

}