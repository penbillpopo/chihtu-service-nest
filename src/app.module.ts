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
// import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI,{ useNewUrlParser: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    AuthorityModule,
    ProductModule,
    CommandModule,
    ScheduleModule.forRoot(),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'client'),
    //   serveRoot: '',
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
