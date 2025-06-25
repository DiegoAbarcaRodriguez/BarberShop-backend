import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateServiceAppointmentDto } from './dto/create-service-appointment.dto';
import { Repository } from 'typeorm';
import { ServiceAppointment } from './entities/service-appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/servings/entities/service.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { UUIDAdapter } from 'src/common/config';

@Injectable()
export class ServiceAppointmentService {

  constructor(
    @InjectRepository(ServiceAppointment)
    private serviceAppointmentRepository: Repository<ServiceAppointment>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>
  ) { }

  private async getServicesById(array_id: string[]): Promise<Service[]> {
    let serviceArray = [];

    if (array_id.some(id => !UUIDAdapter.validateUUID(id))) {
      throw new BadRequestException('The service_fk array was not valid!');
    }

    for (let id of array_id) {
      let service = await this.serviceRepository.findOne({ where: { id } });
      serviceArray.push(service);
    }

    if (serviceArray.some(value => value === null || serviceArray.length === 0)) {
      throw new NotFoundException('Some of the services was not found!');
    }

    return serviceArray;


  }

  async create({ service_fk, appointment_fk }: CreateServiceAppointmentDto) {
    try {

      if (service_fk.length === 0) {
        throw new BadRequestException('The service_fk array is empty!');
      }

      const serviceArray = await this.getServicesById(service_fk);
      const appointment = await this.appointmentRepository.findOne({ where: { id: appointment_fk } });

      if (!appointment) throw new NotFoundException('Appointment not found');

      for (let service of serviceArray) {
        let schema = this.serviceAppointmentRepository.create({ service_fk: service, appointment_fk: appointment });
        await this.serviceAppointmentRepository.save(schema);
      }

      return {
        ok: true
      }

    } catch (error) {
      console.log(error);
      if (error.status === 400 || error.status === 404) {
        throw error;
      }

      throw new InternalServerErrorException();

    }
  }




}
