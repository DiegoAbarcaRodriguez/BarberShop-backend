import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';


@Injectable()
export class AppointmentsService {

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>
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
        throw new BadRequestException('The date and time has been booked!');
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

  async findAll(date: Date) {
    try {
      const appointments = date ? await this.appointmentRepository.find({
        where: { date }
      })
        : await this.appointmentRepository.find({
          order: { date: 'DESC' }
        });

      return {
        ok: true,
        appointments
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {

      const existingAppointment = await this.appointmentRepository.findOne({ where: { id } });

      if (!existingAppointment) {
        throw new NotFoundException('Appointment was not found!');
      }

      await this.appointmentRepository.delete(existingAppointment);

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
}
