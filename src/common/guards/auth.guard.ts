import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {


    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing Token!');
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET
        }
      );

      if (!payload) {
        throw new UnauthorizedException('Token not valid');
      }

      const { id } = payload;

      const existingUser = await this.userRepository.findOne(
        {
          where: {
            id
          }
        });

      if (!existingUser) throw new UnauthorizedException('User not found!');

      request['user'] = existingUser;
      return true;
    } catch (error) {
      console.log(error)
      if (error.status == 401) {
        throw error;
      }

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('The session has expired!');
      }

      throw new InternalServerErrorException();
    }

  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
