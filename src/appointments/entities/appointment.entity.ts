import { User } from "src/auth/entities/user.entity";
import { DateAdapter } from "src/common/config";
import { ServiceAppointment } from "src/serving-appointment/entities/service-appointment.entity";
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from "typeorm";


@Entity()
export class Appointment {
    @Column('uuid', {
        primary: true,
        generated: 'uuid'
    })
    id: string;

    @Column('varchar', { nullable: false })
    date: string;

    @Column('time', { nullable: false })
    time: string;

    @ManyToOne(
        () => User,
        (user) => user.appointments,
        { eager: true }
    )
    user_fk: User;

    @OneToMany(
        () => ServiceAppointment,
        (serviceAppointment) => serviceAppointment.appointment_fk
    )
    servicesAppointment: ServiceAppointment[];

    // @BeforeInsert()
    // normalizeDate() {
    //     this.date = DateAdapter.normalizeDate(this.date);
    //     this.date = this.date.toString().split('T').at(0);
    //     console.log('date normalized =>',  this.date.toString().split('T').at(0))
    // }
}
