import { Module } from '@nestjs/common';
import { AuthorityController } from './authority.controller';
import { AuthorityService } from './authority.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuthorityRolesSchema,
  RolesName,
} from 'src/authority/authorityRoles.model';
import { UserSchema } from 'src/user/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: RolesName, schema: AuthorityRolesSchema },
    ]),
  ],
  controllers: [AuthorityController],
  providers: [AuthorityService, UserService,AuthService],
})
export class AuthorityModule {}
