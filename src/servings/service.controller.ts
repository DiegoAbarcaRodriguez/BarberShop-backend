import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UuidPipe } from 'src/common/pipes/uuid/uuid.pipe';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';

@UseGuards(AuthGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }


  @UseGuards(AuthAdminGuard)
  @Post('create')
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }


  @UseGuards(AuthAdminGuard)
  @Patch('update/:id')
  update(@Param('id', UuidPipe) id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }
  
  @UseGuards(AuthAdminGuard)
  @Delete('delete/:id')
  remove(@Param('id', UuidPipe) id: string) {
    return this.serviceService.remove(id);
  }
}
