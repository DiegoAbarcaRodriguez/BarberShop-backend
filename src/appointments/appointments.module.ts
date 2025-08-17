import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { User } from 'src/auth/entities/user.entity';
import { ServiceAppointment } from 'src/serving-appointment/entities/service-appointment.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Appointment,
      User,
      ServiceAppointment
    ])
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule { }
