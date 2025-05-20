import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { regiterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable() //automating the getters and setters for this class (decorators)
export class AuthService {
  //User services dependency that we are injecting for authentication services
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  //Tight coupling ->in tight coupling you need to initialize or pass value then and there itself, its like hardcoding.

  //Comment this part above to try tight coupling: constructor(private...){}
  //private userService: UserService
  //private jwtService: JwtService
  //constructor(){
  //this.userService = new UserService({username: 'sam', email:'sam@gmail.com, password: 'hello'})
  //this.jwtService = new JwtService({secret: 'hardcode'})
  //}

  //loose coupling ->provides flexibility ->Always use loose coupling and dont use tight coupling

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
    return {
      message: 'User Created Successfully',
      user: { username: user.username, email: user.email },
    };
  }

  async login(loginDto: loginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      new UnauthorizedException('Invalid Credientials');
    }

    const isMatch = await bcrypt.compare(password, user!.password);

    if (!isMatch) {
      new UnauthorizedException('Invalid password');
    }
    const payload = { email: user?.email, role: user?.role };

    const token = this.jwtService.sign(payload);

    return {
      message: 'User logged in Successfully',
      user: {
        username: user!.username,
        email: user!.email,
        token: token,
      },
    };
  }
}
