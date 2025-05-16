import { MongooseModuleOptions } from "@nestjs/mongoose";

export const mongooseOptions:MongooseModuleOptions = {
    connectionFactory:(connection)=>{
        console.log('[MongoDB] connected to: ',connection.name)
        return connection
    }
}