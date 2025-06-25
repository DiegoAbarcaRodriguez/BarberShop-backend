import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { ServiceAppointmentService } from './service-appointment.service';
import { CreateServiceAppointmentDto } from './dto/create-service-appointment.dto';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';

@Controller('service-appointment')
export class ServiceAppointmentController {
  constructor(private readonly serviceAppointmentService: ServiceAppointmentService) { }


  @UseGuards(AuthAdminGuard)
  @Post()
  create(@Body() createServiceAppointmentDto: CreateServiceAppointmentDto) {
    return this.serviceAppointmentService.create(createServiceAppointmentDto);
  }



}
