import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [UsersModule, JwtModule.registerAsync({
        imports:[ConfigModule],
        inject: [ConfigService],
        useFactory: async (ConfigService:ConfigService)=>{return{secret: ConfigService.get<string>('JWT_SECRET'),
            signOptions:{
                expiresIn: '1d',
            }
        }}
    })],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
