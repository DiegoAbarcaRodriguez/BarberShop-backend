import { IsEmail, Matches } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;

    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{10}$/, { message: 'The password is not a valid expression!' })
    password: string;
}