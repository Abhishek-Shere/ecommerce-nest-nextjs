import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/signup.dto';
import { LoginUserDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDato: CreateUserDto): Promise<{ token: string }> {
    try {
      const { name, email, password, roles } = signUpDato;
      const hashedPassword = await bcrypt.hash(password, 12);

      const exist_user = await this.userModel.findOne({
        email: email,
      });
      if (exist_user) {
        throw new BadRequestException('User already registered');
      }

      const user = await this.userModel.create({
        name,
        email,
        roles,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({ id: user._id });

      return { token };
    } catch (error) {
      console.log('error in signup', error);
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userModel.findOne({
        email: email,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.jwtService.sign({ id: user._id });

      return {
        token,
      };
    } catch (error) {
      console.log('error in login', error);
      throw error;
    }
  }

  async getuser(id: string): Promise<User> {
    try {
      const user = await this.userModel
        .findById({ _id: id })
        .select('-password');
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteuser(id: string) {
    try {
      const user = await this.userModel.findByIdAndDelete({ _id: id }).exec();
      if (user) {
        return {
          success: true,
          message: 'User deleted successfully',
        };
      }
      return {
        success: false,
        message: 'User already deleted',
      };
    } catch (error) {
      throw new Error('Unable to delete user');
    }
  }

  async updateUser(id: string, updateUser: UpdateUserDto): Promise<User> {
    try {
      const { email, name } = updateUser;
      const user = await this.userModel
        .findById({ _id: id })
        .select('-password');
      if (user) {
        user.email = email;
        user.name = name;

        await user.save();

        return user;
      }
    } catch (error) {
      throw new Error('Unable to update users');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find({});
      return users;
    } catch (error) {
      throw new Error('Unable to fetch users');
    }
  }
}
