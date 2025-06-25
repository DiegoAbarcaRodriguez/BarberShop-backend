import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthAdminGuard implements CanActivate {

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

      if (!existingUser || !existingUser.isConfirmed) throw new UnauthorizedException('User not found!');
      if (!existingUser.isAdmin) throw new ForbiddenException('This user does not possess the privilige to see this information!');

      request['user'] = existingUser;
      return true;
    } catch (error) {
      if (error.status == 401 || error.status == 403 || error.status == 400) {
        throw error;
      }

      throw new InternalServerErrorException();
    }

  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
