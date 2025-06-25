import * as uuid from 'uuid';

export class UUIDAdapter {
    static v4(): string {
        return uuid.v4();
    }

    static validateUUID(value: string) {
        return uuid.validate(value);
    }
}