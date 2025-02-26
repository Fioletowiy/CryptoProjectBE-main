import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../users/users.model';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UsersModel)
    private userModel: typeof UsersModel,
    private jwtService: JwtService,
  ) {}

  async googleLogin(req) {
    if (!req.user) {
      return { message: 'No user from Google' };
    }

    const { email, firstName, lastName, picture } = req.user;

    const user = await this.userModel.findAll({
      where: { email },
    });

    if (user.length === 0) {
      const newUserId = uuidv4();
      const payload = { userId: newUserId, userRole: ['guest'] };
      const jwt = this.jwtService.sign(payload);

      await this.userModel.create({
        userId: newUserId,
        email,
        firstName,
        lastName,
        picture,
        accessToken: jwt,
        userRole: ['guest'],
      });

      const newUserData = await this.userModel.findOne({
        where: { email },
      });

      console.log(newUserData);
      return newUserData;
    } else {
      const currentUser = user[0];
      const payload = {
        userId: currentUser.userId,
        userRole: currentUser.userRole,
      };
      const jwt = this.jwtService.sign(payload);
      await this.userModel.update(
        {
          accessToken: jwt,
          firstName,
          lastName,
          picture,
        },
        {
          where: { email },
        },
      );
      const userData = await this.userModel.findOne({
        where: { email },
      });
      console.log(userData);
      return userData;
    }
    // Сохранение пользователя в базу данных
    // const [user] = await this.userModel.findOrCreate({
    //   where: { email },
    //   defaults: { userId, firstName, lastName, picture, accessToken: jwt },
    // });
  }
}
