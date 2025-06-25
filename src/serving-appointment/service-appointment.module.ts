import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ServiceAppointmentController } from './service-appointment.controller';
import { ServiceAppointmentService } from './service-appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/servings/entities/service.entity';
import { ServiceAppointment } from './entities/service-appointment.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Service, ServiceAppointment, Appointment, User])
  ],
  controllers: [ServiceAppointmentController],
  providers: [ServiceAppointmentService],
})
export class ServiceAppointmentModule { }
