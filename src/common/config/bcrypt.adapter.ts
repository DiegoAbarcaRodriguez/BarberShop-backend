import * as bcrypt from 'bcryptjs';

export class BcryptAdapter {
    static generateHash(data: string): string {
        return bcrypt.hashSync(data);

    }

    static compareHashedData(hashedData: string, data: string): boolean {
        return bcrypt.compareSync(data, hashedData);
    }
}