import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UUIDAdapter } from 'src/common/config';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {

  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>
  ) { }

  async create(createServiceDto: CreateServiceDto) {
    try {

      const schemaService = this.serviceRepository.create({ ...createServiceDto, id: UUIDAdapter.v4() });
      const createdService = await this.serviceRepository.save(schemaService);

      return {
        ok: true,
        service: createdService

      };

    } catch (error) {
      console.log(error)
      if (error.code == 23505) {
        throw new BadRequestException('The service has already exist!');
      }

      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const services = await this.serviceRepository.find();

      return {
        ok: true,
        services
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


  async update(id: string, updateServiceDto: UpdateServiceDto) {
    try {
      const existingService = await this.serviceRepository.findOne({
        where: { id }
      });

      if (!existingService) throw new NotFoundException('Service not found!');

      const updatedService = await this.serviceRepository.update(id, { ...updateServiceDto });

      return {
        ok: true,
        service: { id, ...updateServiceDto}
      };

    } catch (error) {
      if (error.status === 404) {
        throw error;
      }

      if (error.code == 23505) {
        throw new BadRequestException('A service with that name already exists!');
      }

      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {
      const existingService = await this.serviceRepository.findOne(
        {
          where: { id }
        });

      if (!existingService) throw new NotFoundException('Service not found!');

      await this.serviceRepository.remove(existingService);

      return {
        ok: true,
        service: existingService
      }

    } catch (error) {
      if (error.status === 404) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }
}
