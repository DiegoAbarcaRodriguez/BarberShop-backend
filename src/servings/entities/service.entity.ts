import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ServiceAppointment } from '../../serving-appointment/entities/service-appointment.entity';

@Entity()
export class Service {
    @Column('uuid', { primary: true })
    id: string;

    @Column('varchar', { unique: true, nullable: false })
    name: string;

    @Column('numeric', { nullable: false })
    price: number;

    @OneToMany(
        () => ServiceAppointment,
        (serviceAppointment) => serviceAppointment.service_fk
    )
    servicesAppointment: ServiceAppointment[];


}
