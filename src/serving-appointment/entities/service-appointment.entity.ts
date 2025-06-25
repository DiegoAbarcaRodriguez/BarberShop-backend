import { Appointment } from "src/appointments/entities/appointment.entity";
import { Service } from "src/servings/entities/service.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class ServiceAppointment {
    @Column('uuid', { generated: 'uuid', primary: true })
    id: string;

    @ManyToOne(
        () => Service,
        (service) => service.servicesAppointment,
        { eager: true, onDelete: 'CASCADE' }
    )
    service_fk: Service;

    @ManyToOne(
        () => Appointment,
        (appointment) => appointment.servicesAppointment,
        { eager: true, onDelete: 'CASCADE' }

    )
    appointment_fk: Appointment;

}
