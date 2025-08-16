import { IsBoolean, IsEmail, IsInt, IsString, Matches, MinLength } from "class-validator";


export class CreateUserDto {
    @IsString()
    @MinLength(1)
    first_name: string;

    @IsString()
    @MinLength(1)
    last_name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!?\[\]&%$#\-_])[A-Za-z\d@!?\[\]&%$#\-_]{8,}$/, { message: 'The password is not a valid expression!' })
    password: string;

    @IsString()
    @Matches(/^\d{10}$/, { message: 'The phone is not valid!' })
    phone: string;


}
