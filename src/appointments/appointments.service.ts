import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ServiceAppointment } from 'src/serving-appointment/entities/service-appointment.entity';


@Injectable()
export class AppointmentsService {

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(ServiceAppointment)
    private servingAppointmentRepository: Repository<ServiceAppointment>
  ) { }

  async create(user: User, createAppointmentDto: CreateAppointmentDto) {
    try {

      const existingAppointmet = await this.appointmentRepository.findOne({
        where: {
          date: createAppointmentDto.date,
          time: createAppointmentDto.time
        }
      });

      if (existingAppointmet) {
        throw new BadRequestException('The date and time has been already booked!');
      }

      const schemaAppointment = await this.appointmentRepository.create(
        {
          ...createAppointmentDto,
          user_fk: user
        });

      const createdAppointment = await this.appointmentRepository.save(schemaAppointment);

      return {
        ok: true,
        appointment: createdAppointment
      }




    } catch (error) {
      console.log(error);
      if (error.code == 23505) {
        throw new BadRequestException('The email has already exist!');
      }

      if (error.status == 400) {
        throw error;
      }

      throw new InternalServerErrorException(error.detail)
    }
  }

  async findAll(date: string) {
    try {


      const appointments = date ? await this.servingAppointmentRepository.find({
        where: {
          appointment_fk: {
            date
          }
        },
        relations: {
          appointment_fk: true,
          service_fk: true
        }
      })
        : await this.servingAppointmentRepository.find({
          relations: {
            appointment_fk: true,
            service_fk: true
          },
          order: {
            appointment_fk: {
              date: 'DESC'
            }
          }
        });

      const appointmentsMap = this._mapperServicesAppointmentRecords(appointments);


      return {
        ok: true,
        appointments: appointmentsMap
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException();
    }
  }

  async findExistingAppointment(date: string, time: string) {
    try {

      const exitingAppointment = await this.appointmentRepository.findOne(
        {
          where: {
            date,
            time
          }
        });

      if (exitingAppointment) {
        throw new BadRequestException('There is an appointment already reserved!');
      }

      return { ok: true };
    } catch (error) {
      console.log(error);
      if (error.status === 400) throw error;

      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {

      const existingAppointment = await this.appointmentRepository.findOne({ where: { id } });

      if (!existingAppointment) {
        throw new NotFoundException('Appointment was not found!');
      }

      await this.appointmentRepository.delete(existingAppointment as any);

      return {
        ok: true
      };



    } catch (error) {
      console.log(error);

      if (error.status === 404) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  private _mapperServicesAppointmentRecords(appointments: ServiceAppointment[]) {
    const appointmentsMap = new Map();

    appointments.forEach(({ appointment_fk, service_fk }, index) => {
      const { id } = appointment_fk;

      if (appointmentsMap.has(id)) {
        appointmentsMap.set(id, {
          ...appointmentsMap.get(id),
          services: [...appointmentsMap.get(id).services, service_fk]
        });

      } else {
        appointmentsMap.set(id, {
          appointment: appointment_fk,
          services: [service_fk]
        });
      }

    });

    return [...appointmentsMap.values()];
  }
}
