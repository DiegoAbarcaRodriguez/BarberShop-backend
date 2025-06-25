import { User } from "src/auth/entities/user.entity";
import { ServiceAppointment } from "src/serving-appointment/entities/service-appointment.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";


@Entity()
export class Appointment {
    @Column('uuid', {
        primary: true,
        generated: 'uuid'
    })
    id: string;

    @Column('date', { nullable: false })
    date: Date;

    @Column('time', { nullable: false })
    time: string;

    @ManyToOne(
        () => User,
        (user) => user.appointments
    )
    user_fk: User;

    @OneToMany(
        () => ServiceAppointment,
        (serviceAppointment) => serviceAppointment.appointment_fk
    )
    servicesAppointment: ServiceAppointment[];
}
