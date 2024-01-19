import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/signup.dto';
import { LoginUserDto } from './dto/login.dto';
import { User } from './schemas/user.schema';
// import { AuthGuard } from '@nestjs/passport';
import { Roles } from './role.decorator';
import { RolesGuard } from './roles.guard';
import { AuthGuard } from './auth.guard';
import { MultiplePermissions } from './permissions.decorators';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { CustomExceptionFilter } from 'src/customException.filter';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: CreateUserDto): Promise<{ token: string }> {
    return this.userService.signUp(signUpDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    return this.userService.login(loginUserDto);
  }

  @Get('/get-users')
  @Roles('superadmin')
  @MultiplePermissions({
    role: 'superadmin',
    permissions: ['GET'],
  })
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(LoggingInterceptor)
  @UseFilters(CustomExceptionFilter)
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
