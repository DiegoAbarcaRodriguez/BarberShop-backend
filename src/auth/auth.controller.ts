import { Controller, Post, Body, Patch, Param, Req, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UuidPipe } from 'src/common/pipes/uuid/uuid.pipe';
import { CreateUserDto, LoginDto, RecoverPasswordDto, UpdatePasswordDto } from './dto/auth';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Patch('validate/:id')
  validateAccount(
    @Param('id', UuidPipe) id: string,
    @Req() req: any
  ) {
    return this.authService.validateAccount(id, req.token);
  }

  @Post('recover-password')
  sendEmailToRecoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return this.authService.sendEmailToRecoverPassword(recoverPasswordDto.email);
  }

  @Patch('update-password/:id')
  update(
    @Param('id', UuidPipe) id: string,
    @Req() req: any,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    return this.authService.updatePassword(id, req.token, updatePasswordDto);
  }

}
