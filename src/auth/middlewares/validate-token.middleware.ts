import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UUIDAdapter } from 'src/common/config';

@Injectable()
export class ValidateTokenMiddleware implements NestMiddleware {



  use(req: Request, res: Response, next: () => void) {
    const token = req.headers['x-token'] as string;
 

    if (!UUIDAdapter.validateUUID(token)) throw new BadRequestException('The token is not valid!');

    (req as any).token = token;
    next();
  }
}
