import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { regiterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async register(registerDto: regiterDto) {
    const { username, email, password } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      new ConflictException('Email Already Registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      username,
      email,
      password: hashedPassword,
    });
    return {message: 'User Created Successfully', user: {username : user.username, email:user.email}}
  }  

  async login(loginDto: loginDto){
    const {email, password} = loginDto

    const user = await this.userService.findByEmail(email);

    if(!user){
        new UnauthorizedException('Invalid Credientials')
    }

    const isMatch = await bcrypt.compare(password, user!.password)

    if(!isMatch){
        new UnauthorizedException('Invalid password')
    }
    const payload = {email : user?.email, role: user?.role,}

    const token = this.jwtService.sign(payload);

    return{
        message: "User logged in Successfully",
        user:{
            username: user!.username,
            email: user!.email,
            token: token
        }
    }
  }
}

