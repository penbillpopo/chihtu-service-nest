import { GetUserDTO } from './dto/get-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { IdDTO } from '../shared/dto/idDto.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User,UserName } from 'src/user/user.model';
import { AuthorityRoles,RolesName } from 'src/authority/authorityRoles.model';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserName) private readonly userModel: Model<User>,
    @InjectModel(RolesName)
    private readonly authorityRolesModel: Model<AuthorityRoles>,
    
  ) {}
  //status
  async createUser(createUserDTO: CreateUserDTO) {
    const { account, password,name, status, roleId } = createUserDTO;
    const user = await this.userModel.findOne({
      account: account,
    });
    //0:新增成功 1:新增失敗 2:帳號重複
    if (user) {
      return 2;
    } else {
      const newUser = new this.userModel({
        account,
        password,
        name,
        status,
        roleId,
      });
      const res = await newUser.save();
      return res ? 0 : 1;
    }
  }
  async getUsers(getUserDTO:GetUserDTO,roleLevel:number) {
    const {page,pageSize} = getUserDTO
    const _pageSize = Number(pageSize)
    const _page = (Number(page) - 1) * Number(pageSize)
    const users = await this.userModel.find({}).limit(_pageSize).skip(_page).sort({createdAt:1})
    const resArr = [];
    for (let i = 0; i < users.length; i++) {
      const role = await this.authorityRolesModel.findOne({
        _id: users[i].roleId,
      });
      if(role.roleLevel>=roleLevel){
        resArr.push({
          id: users[i]._id,
          account: users[i].account,
          password: users[i].password,
          name:users[i].name,
          roleId: role._id,
          roleName: role.name,
          roles: role.roles,
          status: users[i].status,
          createdAt: moment(new Date(users[i].createdAt)).format(
            'YYYY/MM/DD hh:mm:ss',
          ),
          updatedAt: moment(new Date(users[i].updatedAt)).format(
            'YYYY/MM/DD hh:mm:ss',
          ),
        });
      }
    }
    const total = await this.userModel.count({})
    return {content:resArr,total:total};
  }
  async updateUser(idDto:IdDTO,updateUserDTO: UpdateUserDTO) {
    const { id } = idDto;
    const { account,name, status, roleId } = updateUserDTO;
    const updateUser = await this.findUserById(id);
    if (updateUser) {
      updateUser.account = account;
      updateUser.name = name;
      updateUser.status = status;
      updateUser.roleId = roleId;
      updateUser.save();
      return true;
    } else {
      throw new NotFoundException();
    }
  }
  async deleteUser(idDTO: IdDTO) {
    const { id } = idDTO;
    const res = await this.userModel.deleteOne({ _id: id }).exec();
    if (res.n === 0) {
      return false;
    } else {
      return true;
    }
  }
  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  async findUser(data: any): Promise<User> {
    const user = await this.userModel.findOne(data).exec();
    return user;
  }
}
