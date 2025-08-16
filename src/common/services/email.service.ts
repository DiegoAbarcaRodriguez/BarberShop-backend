import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';


interface EmailOptions {
    to: string,
    name: string,
    token: string,
    id: string,
    isActivatedAccount?: boolean
}

@Injectable()
export class EmailService {

    private transporter = nodemailer.createTransport({
        service: this.configService.get('MAILER_SERVICE'),
        auth: {
            user: this.configService.get('MAILER_EMAIL'),
            pass: this.configService.get('MAILER_SECRET_KEY')
        },
    });

    constructor(private configService: ConfigService) { }

    async generateEmailContent({ to, name, token, id, isActivatedAccount = true }: EmailOptions) {
        const html = isActivatedAccount ?
            `
        <html>
            <p><strong>Hi "${name}"</strong> you've created your account on BarShop App,
                 now you just have to confirm it by clicking on the following link</p>
            <p>Click on here: <a href='http://localhost:4200/confirm-account?token=${token}&id=${id}'>Confirm account</a></p>
            <p>If you do not require it, you can ignore the message.</p>
        </html>
        `
            :
            `
        <html>
            <p><strong>Hi "${name}"</strong> you've requested a new password for BarShop App,
                 now you just have to confirm it by clicking on the following link</p>
            <p>Click on here: <a href='http://localhost:4200/recover-password?token=${token}&id=${id}'>Confirm account</a></p>
            <p>If you do not require it, you can ignore the message.</p>
        </html>
        `;

        await this.sendMail(to, html, isActivatedAccount ? 'Confirm your account!' : 'Retrieve your access!');

        return true;
    }




    private async sendMail(to: string, html: string, subject: string) {
        try {
            await this.transporter.sendMail({
                to,
                subject,
                html
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('The email could not be sent it');
        }

    }

}
