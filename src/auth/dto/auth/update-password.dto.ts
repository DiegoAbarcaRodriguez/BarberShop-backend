import { IsString, Matches } from "class-validator";

export class UpdatePasswordDto {

    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!?\[\]&%$#\-_])[A-Za-z\d@!?\[\]&%$#\-_]{8,}$/, { message: 'The password is not a valid expression!' })
    password: string;

}