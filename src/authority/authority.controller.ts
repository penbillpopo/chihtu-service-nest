import { GetRoleDTO } from './dto/get-role.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { CreateRoleDTO } from './dto/create-role.dto';
import { IdDTO } from '../shared/dto/idDto.dto';
import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Delete,
  Put,
  Query,
  Request
} from '@nestjs/common';
import { AuthorityService } from 'src/authority/authority.service';
import { UserService } from 'src/user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('authority')
@Controller('authority')
export class AuthorityController {
  constructor(
    private readonly authorityService: AuthorityService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiOperation({summary:"",description:"新增權限設定"})
  @UseInterceptors(FileInterceptor('body'))
  @UsePipes(ValidationPipe)
  async createRole(@Body() createRoleDTO: CreateRoleDTO,@Request() req) {
    const currentRoleLevel = await this.authorityService.getRoleLevel(req)
    const Roles = await this.authorityService.createRole(createRoleDTO,currentRoleLevel + 1);
    if (Roles) {
      return { success: true, data: null, msg: '新增成功' };
    } else {
      return { success: false, data: null, msg: '新增失敗' };
    }
  }
  @Get()
  @ApiOperation({summary:"",description:"取得權限設定"})
  @UsePipes(ValidationPipe)
  async getRole(@Query() getRoleDTO:GetRoleDTO,@Request() req) {
    const currentRoleLevel = await this.authorityService.getRoleLevel(req)
    const Roles = await this.authorityService.getRole(getRoleDTO,currentRoleLevel);
    if (Roles) {
      return { success: true, data: Roles, msg: '查詢成功' };
    } else {
      return { success: false, data: null, msg: '查無資料' };
    }
  }
  @Put()
  @ApiOperation({summary:"",description:"修改權限設定"})
  @UseInterceptors(FileInterceptor('body'))
  @UsePipes(ValidationPipe)
  async updateRole(@Query() idDto:IdDTO,@Body() updateRoleDTO: UpdateRoleDTO,@Request() req) {
    const currentRoleLevel = await this.authorityService.getRoleLevel(req)
    const Roles = await this.authorityService.updateRole(idDto,updateRoleDTO,currentRoleLevel+1);
    if (Roles) {
      return { success: true, data: null, msg: '更新成功' };
    } else {
      return { success: false, data: null, msg: '更新失敗' };
    }
  }

  @Delete()
  @ApiOperation({summary:"",description:"刪除權限設定"})
  @UseInterceptors(FileInterceptor('body'))
  @UsePipes(ValidationPipe)
  async deleteRole(@Query() idDto:IdDTO) {
    const { id } = idDto;
    const user = await this.userService.findUser({ roleId: id });
    if (user) {
      return {
        success: false,
        data: null,
        msg: '尚有使用者使用此權限，刪除失敗',
      };
    } else {
      const Role = await this.authorityService.deleteRole(idDto);
      if (Role) return { success: true, data: null, msg: '刪除成功' };
      else return { success: false, data: null, msg: '刪除失敗' };
    }
  }

  @Get('/select')
  @ApiOperation({summary:"",description:"取得權限選項"})
  @UsePipes(ValidationPipe)
  async getRoleSelect(@Request() req) {
    const currentRoleLevel = await this.authorityService.getRoleLevel(req)
    const Roles = await this.authorityService.getRoleSelect(currentRoleLevel);
    if (Roles) {
      return { success: true, data: Roles, msg: '查詢成功' };
    } else {
      return { success: false, data: null, msg: '查無資料' };
    }
  }

}
