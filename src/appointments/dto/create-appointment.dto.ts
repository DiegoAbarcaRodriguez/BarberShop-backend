import { IsDate, Matches } from "class-validator";

export class CreateAppointmentDto {
    @IsDate()
    date: Date;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message:'The time is not valid!'})
    time: string;

}