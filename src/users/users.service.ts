import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {User, UserDocument} from './schema/user.schema'
import {Model} from 'mongoose' 

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async findByEmail(email:string): Promise<User | null>{
        return this.userModel.findOne({email})
    }
    async create(data: Partial<User>): Promise<User>{
        const newUser = new this.userModel(data)

        return newUser.save()
    }
}