import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthorityModule } from './authority/authority.module';
import { ProductModule } from './product/product.module';
import { CommandModule } from 'nestjs-command';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb+srv://penbillpopo:075717169@billcluster.jrgs2.mongodb.net/ps2_service?retryWrites=true&w=majority',{ useNewUrlParser: true }),
    // MongooseModule.forRoot('mongodb+srv://develop:1qaz@WSX@sandbox.gywtz.mongodb.net/sandbox?retryWrites=true&w=majority',{ useNewUrlParser: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGO_DB_HOST'),
        useUnifiedTopology: true,
        poolSize: 10,
        autoCreate: true,
        autoIndex: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      }),
    }),
    UserModule,
    AuthModule,
    AuthorityModule,
    ProductModule,
    CommandModule,
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveRoot: '',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
