import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UUIDAdapter } from 'src/common/config';

@Injectable()
export class UuidPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!UUIDAdapter.validateUUID(value)) {
      throw new BadRequestException('The id is not valid!');
    }

    return value;

  }
}
