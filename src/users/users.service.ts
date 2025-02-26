import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from './users.model';
import { UsersDto } from './dto/users.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel) private UsersRepository: typeof UsersModel,
  ) {}

  async getUsers() {
    const users = await this.UsersRepository.findAll({
      include: { all: true },
    });
    return users;
  }

  async getUser(userId: number) {
    const users = await this.UsersRepository.findOne({
      where: { id: userId },
    });
    return users;
  }

  async createUser(userData: UsersDto) {
    const newUserData = userData;
    newUserData['userId'] = uuidv4();
    const newUser = await this.UsersRepository.create(newUserData);
    return newUser;
  }

  async authenticateUser(userData: UsersDto) {
    console.log(userData);
    return 'User authenticate';
  }
}
