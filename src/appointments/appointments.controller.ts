import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { UuidPipe } from 'src/common/pipes/uuid/uuid.pipe';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @UseGuards(AuthGuard)
  @Post('create')
  create(
    @Req() req: any,
    @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user, createAppointmentDto);
  }

  @UseGuards(AuthAdminGuard)
  @Get()
  findAll(@Query('date') date?: Date) {
    return this.appointmentsService.findAll(date);
  }



  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  remove(@Param('id', UuidPipe) id: string) {
    return this.appointmentsService.remove(id);
  }
}
