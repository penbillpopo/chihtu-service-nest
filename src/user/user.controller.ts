import { GetUserDTO } from './dto/get-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { IdDTO } from '../shared/dto/idDto.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Delete,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthorityService } from 'src/authority/authority.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation, 
  ApiTags,
} from '@nestjs/swagger'


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly authorityService: AuthorityService,
  ) {}
  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('body'))
  @ApiOperation({description:"新增使用者"})
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    const res = await this.userService.createUser(createUserDTO);
    switch (res) {
      case 0:
        return { success: true, data: null, msg: '新增成功' };
      case 1:
        return { success: false, data: null, msg: '新增失敗' };
      case 2:
        return { success: false, data: null, msg: '新增失敗,帳號重複' };
      default:
      // error handler
    }
  }
  @Get()
  @ApiOperation({description:"取得使用者"})
  async getUsers(@Query() getUserDTO:GetUserDTO,@Request() req) {
    const currentRoleLevel = await this.authorityService.getRoleLevel(req)
    const users = await this.userService.getUsers(getUserDTO,currentRoleLevel);
    // fix coding style
    if (users) {
      return { success: true, data: users, msg: '搜尋成功' };
    } else {
      return { success: false, data: null, msg: '查無資料' };
    }
  }
  @Put()
  @UseInterceptors(FileInterceptor('body'))
  @UsePipes(ValidationPipe)
  @ApiOperation({description:"修改使用者"})
  async updateUser(@Query() idDto:IdDTO, @Body() updateUserDTO: UpdateUserDTO) {
    const users = await this.userService.updateUser(idDto,updateUserDTO);
    if (users) {
      return { success: true, data: null, msg: '更新成功' };
    } else {
      return { success: false, data: null, msg: '更新失敗' };
    }
  }

  @Delete()
  @UseInterceptors(FileInterceptor('body'))
  @UsePipes(ValidationPipe)
  @ApiOperation({description:"刪除使用者"})
  async deleteUser(@Query() idDto:IdDTO) {
    const users = await this.userService.deleteUser(idDto);
    if (users) {
      return { success: true, data: null, msg: '刪除成功' };
    } else {
      return { success: false, data: null, msg: '刪除失敗' };
    }
  }

  @Get('/info')
  @ApiOperation({description:"取得使用者資訊"})
  async getinfo(@Request() req){
    const validateUser:any = await this.authService.validateUser(req.cookies.AuthCookie)
    if(validateUser !== null){
        const user = await this.authService.findUserById(validateUser.id)
        const role = await this.authService.findUserRole(user.roleId)
        if(user.status)
          return {
              success:true,
              data:{
                name:role.name,
                roles:role.roles
              },
              msg:"查詢成功"
            }
    }
    return {success:false,data:null,msg:"無登入權限"}
  }
 
}
