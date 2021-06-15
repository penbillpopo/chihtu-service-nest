import { GetRoleDTO } from './dto/get-role.dto';
import { DeleteRoleDTO } from './dto/delete-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { CreateRoleDTO } from './dto/create-role.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthorityRoles,RolesName } from 'src/authority/authorityRoles.model';
import { AuthService } from 'src/auth/auth.service';
import {
  Request
} from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class AuthorityService {
  constructor(
    @InjectModel(RolesName)
    private readonly authorityRolesModel: Model<AuthorityRoles>,
    private readonly authService: AuthService,
  ) {}
  async createRole(createRoleDTO: CreateRoleDTO,roleLevel:number) {
    const {name,roles} = createRoleDTO
    const newAuthRolesModel = new this.authorityRolesModel({
      name,
      roles,
      roleLevel
    });
    const result = await newAuthRolesModel.save();
    return result.id as string;
  }
  async getRole(getRoleDTO:GetRoleDTO,roleLevel:number) {
    const {page,pageSize} = getRoleDTO
    const _pageSize = Number(pageSize)
    const _page = (Number(page) - 1) * Number(pageSize)
    const roles = await this.authorityRolesModel.find({"roleLevel" : { $gte: roleLevel}}).limit(_pageSize).skip(_page).sort({createdAt:1})
    const data = roles.map((role) => ({
      id: role.id,
      roles: role.roles,
      name: role.name,
      createdAt: moment(new Date(role.createdAt)).format(
        'YYYY/MM/DD hh:mm:ss',
      ),
      updatedAt: moment(new Date(role.updatedAt)).format(
        'YYYY/MM/DD hh:mm:ss',
      ),
    }));
    const total = await this.authorityRolesModel.count({})    
    return {content:data,total:total};
  }
  async getRoleSelect(roleLevel:number) {
    const roles = await this.authorityRolesModel.find({"roleLevel" : { $gte: roleLevel}})
    const data = roles.map((role) => ({
      id: role.id,
      name: role.name,
    }));
    return {content:data};
  }
  async updateRole(updateRoleDTO: UpdateRoleDTO,roleLevel:number) {
    const { id, name, roles } = updateRoleDTO;
    const role = await this.findRole(id);
    if (!role) throw new NotFoundException();
    else {
      if (name) {
        role.name = name;
      }
      if (roles) {
        role.roles = roles;
      }
      if (roleLevel) {
        role.roleLevel = roleLevel;
      }
      role.save();
      return true;
    }
  }
  async deleteRole(deleteRoleDTO: DeleteRoleDTO) {
    const { id } = deleteRoleDTO;
    const result = await this.authorityRolesModel.deleteOne({ _id: id }).exec();
    if (result.n === 0) {
      return false;
    } else {
      return true;
    }
  }
  async findRole(id: string): Promise<AuthorityRoles> {
    const role = await this.authorityRolesModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }
  async getRoleLevel(@Request() req){
    const validateUser:any = await this.authService.validateUser(req.cookies.AuthCookie)
    let currentLevel = -1
    if(validateUser !== null){
      const user = await this.authService.findUserById(validateUser.id)
      const role = await this.authService.findUserRole(user.roleId)
      currentLevel = role.roleLevel
    }
    return currentLevel
  }
}
