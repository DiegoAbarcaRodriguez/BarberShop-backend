import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmailPipe implements PipeTransform {

  transform(value: string) {
    const email = value.toLocaleLowerCase().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw new BadRequestException('The email is not valid!');
    }

    return value;
  }
}
