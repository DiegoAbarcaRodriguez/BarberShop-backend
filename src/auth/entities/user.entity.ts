import { Appointment } from "src/appointments/entities/appointment.entity";
import { Column, Entity, OneToMany } from "typeorm";


@Entity()
export class User {

    @Column('uuid', { generated: 'uuid', nullable: false, primary: true })
    id: string;

    @Column('varchar', { nullable: false })
    first_name: string;

    @Column('varchar', { nullable: false })
    last_name: string;


    @Column('varchar', { nullable: false, unique: true })
    email: string;

    @Column('varchar', { nullable: false })
    password: string;

    @Column('varchar', { nullable: false })
    phone: string;

    @Column('boolean', { default: false })
    isAdmin: boolean;

    @Column('boolean', { default: false })
    isConfirmed: boolean;

    @Column('varchar')
    token: string;

    @OneToMany(
        () => Appointment,
        (appointment) => appointment.user_fk,
        { eager: true }
    )
    appointments: Appointment[];


}
