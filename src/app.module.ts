import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';

import { ServiceModule } from './servings/service.module';
import { ServiceAppointmentModule } from './serving-appointment/service-appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
      extra: {
        options: '-c timezone=America/Mexico_City'
      }
    }),

    AuthModule,

    AppointmentsModule,

    ServiceModule,

    ServiceAppointmentModule
  ]
})
export class AppModule { }
