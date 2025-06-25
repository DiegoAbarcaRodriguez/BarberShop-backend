import { IsString, Matches } from "class-validator";

export class UpdatePasswordDto {

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{10}$/, { message: 'The password is not a valid expression!' })
    password: string;

}