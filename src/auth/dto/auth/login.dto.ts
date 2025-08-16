import { IsEmail, Matches } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!?\[\]&%$#\-_])[A-Za-z\d@!?\[\]&%$#\-_]{8,}$/, { message: 'The password is not a valid expression!' })
    password: string;
}