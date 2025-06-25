import { IsArray, IsString, IsUUID } from "class-validator";

export class CreateServiceAppointmentDto {
    @IsArray()
    @IsString({ each: true })
    service_fk: string[];

    @IsUUID()
    appointment_fk: string;
}
