import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { BcryptAdapter, UUIDAdapter } from 'src/common/config';
import { EmailService } from 'src/common/services/email.service';
import { CreateUserDto, LoginDto, UpdatePasswordDto } from './dto/auth';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
    private jwtService: JwtService
  ) { }

  private _handleErrors(error: any) {
    if (error.status === 404 || error.status === 400 || error.status === 401) throw error;

    throw new InternalServerErrorException(error.detail);
  }

  private async _findUser(id: string, token: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        id,
        token
      }
    });

    if (!existingUser) throw new NotFoundException('User not found!');
    return existingUser;
  }

  async create(createUserDto: CreateUserDto) {

    try {

      const userSchema = this.userRepository.create({
        ...createUserDto,
        isAdmin: false,
        isConfirmed: false,
        password: BcryptAdapter.generateHash(createUserDto.password),
        token: UUIDAdapter.v4()
      });

      const userCreated = await this.userRepository.save(userSchema);

      const { email, token, first_name, last_name, id } = userCreated;

      await this.emailService.generateEmailContent({ to: email, name: first_name + ' ' + last_name, token, id });

      return {
        ok: true
      }

    } catch (error) {

      if (error.code == 23505) {
        throw new BadRequestException('The email has already exist!');
      }

      throw new InternalServerErrorException(error.detail)

    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          email
        }
      });

      if (!existingUser || !existingUser.isConfirmed) throw new UnauthorizedException('User or password is incorrect!');

      const isValidPassword = BcryptAdapter.compareHashedData(existingUser.password, password);

      if (!isValidPassword) throw new UnauthorizedException('User or password is incorrect!');

      const token = this.jwtService.sign({ id: existingUser.id });

      if (!token) throw new InternalServerErrorException();

      return {
        ok: true,
        token,
        userName: existingUser.first_name + ' ' + existingUser.last_name
      }

    } catch (error) {
      console.log(error)
      this._handleErrors(error);
    }
  }

  async validateAccount(id: string, token: string) {

    try {


      const existingAccount = await this._findUser(id, token);

      if (existingAccount.isConfirmed) throw new BadRequestException('The user was already activated!');

      existingAccount.token = '';
      existingAccount.isConfirmed = true;

      await this.userRepository.save(existingAccount);

      return {
        ok: true,
        message: 'User activated successfully!'
      };

    } catch (error) {

      this._handleErrors(error);

    }
  }

  async sendEmailToRecoverPassword(email: string) {
    try {

      const existingUser = await this.userRepository.findOne({
        where: {
          email
        }
      });

      if (!existingUser) throw new NotFoundException('User not found!');

      existingUser.token = UUIDAdapter.v4();
      await this.userRepository.save(existingUser);

      const { email: to, token, first_name, last_name, id } = existingUser;

      await this.emailService.generateEmailContent({ to, name: first_name + ' ' + last_name, token, id, isActivatedAccount: false });


      return {
        ok: true,
        message: 'Email sent it successfully!'
      }
    } catch (error) {

      this._handleErrors(error);
    }
  }

  async updatePassword(id: string, token: string, updatePassworDto: UpdatePasswordDto) {
    try {

      const existingUser = await this._findUser(id, token);

      if (!existingUser.isConfirmed) throw new BadRequestException('The user is not activated!');

      existingUser.password = BcryptAdapter.generateHash(updatePassworDto.password);
      existingUser.token = '';

      await this.userRepository.save(existingUser);

      return {
        ok: true,
        message: 'Password updated correctly!'
      };


    } catch (error) {
      this._handleErrors(error);
    }
  }


  async getUserByEmail(email: string) {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email } });

      if (existingUser) throw new BadRequestException(`The user with email: ${email} has already exist!`);

      return { ok: true };
    } catch (error) {

      if (error.status === 400) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }


}
