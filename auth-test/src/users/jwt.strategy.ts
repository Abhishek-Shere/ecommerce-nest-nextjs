import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
// import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    try {
      const { id } = payload;
      const user = await this.userModel.findById(id);
      if (!user) throw new UnauthorizedException('Invalid user');
      return user;
    } catch (error) {
      console.log('error occured in jwt ', error);
      throw error;
    }
  }
}
