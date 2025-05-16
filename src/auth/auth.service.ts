import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { regiterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

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
}
