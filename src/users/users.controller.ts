import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers() {
    const user = await this.userService.getUsers();
    return user;
  }

  @Get('/:userId')
  async getUser(@Param('userId') userId: number) {
    const user = await this.userService.getUser(userId);
    return user;
  }

  @Post('/register')
  async registerUser(@Body() userData: UsersDto) {
    const user = await this.userService.createUser(userData);
    return user;
  }

  @Post('/auth')
  async authenticateUser(@Body() userData: UsersDto) {
    const user = await this.userService.authenticateUser(userData);
    return user;
  }
}
