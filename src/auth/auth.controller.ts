import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service'; 
import { regiterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register')
    register(@Body() dto: regiterDto){
        return this.authService.register(dto);
    }
}

