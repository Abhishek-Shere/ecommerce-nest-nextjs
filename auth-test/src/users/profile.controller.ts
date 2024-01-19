import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Roles } from './role.decorator';
import { MultiplePermissions } from './permissions.decorators';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Controller('profile')
@Roles('customer', 'admin', 'superadmin')
@MultiplePermissions(
  {
    role: 'customer',
    permissions: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  {
    role: 'admin',
    permissions: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  {
    role: 'superadmin',
    permissions: ['GET', 'POST', 'PUT', 'DELETE'],
  },
)
export class ProfileController {
  constructor(private userService: UsersService) {}

  @Get('')
  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    {
      role: 'admin',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    {
      role: 'superadmin',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  )
  @UseGuards(AuthGuard, RolesGuard)
  async getUserProfile(@Request() req): Promise<User> {
    // req.user
    console.log('========> req===>', req.user.id);
    const userId = req.user.id;
    return this.userService.getuser(userId);
  }

  @Delete('/:id')
  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    {
      role: 'admin',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    {
      role: 'superadmin',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  )
  async deleteUserProfile(@Param('id') userId: string) {
    return this.userService.deleteuser(userId);
  }

  @Put('/:id')
  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    {
      role: 'admin',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    {
      role: 'superadmin',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  )
  async updateUserProfile(
    @Param('id') userId: string,
    @Body() updateUser: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUser);
  }
}
