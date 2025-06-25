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
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{10}$/, { message: 'The password is not a valid expression!' })
    password: string;

    @IsString()
    @Matches(/^\d{10}$/, { message: 'The phone is not valid!' })
    phone: string;

    @IsBoolean()
    isAdmin: boolean;

    @IsBoolean()
    isConfirmed: boolean;

    @IsString()
    @MinLength(36)
    token: string;

}
