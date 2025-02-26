import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('google')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log(req);
    // Инициирует процесс аутентификации через Google
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    // Обрабатывает перенаправление после аутентификации через Google
    const userData = await this.appService.googleLogin(req);
    if ('accessToken' in userData) {
      res.cookie('Authorization', userData.accessToken, {
        httpOnly: true,
      });
      res.cookie('userName', userData.firstName, {});
      res.cookie('userSurname', userData.lastName, {});
      res.cookie('userAvatar', userData.picture, {});
      res.cookie('isBlocked', 'false', {});
      res.cookie('id', userData.userId, {});
      res.cookie('Roles', JSON.stringify(userData.userRole), {});
      res.cookie('permissionsIsLoading', 'false', {});
    } else {
      // Handle the case where userData does not have accessToken
      res.status(400).send('Invalid user data');
    }
    res.redirect('http://localhost:5173');
    // res.redirect('https://ezpromo.app');
  }
}
