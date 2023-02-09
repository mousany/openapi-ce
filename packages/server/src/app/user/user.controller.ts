import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const cookie = await this.appService.login(username, password);
    for (const item of cookie) {
      response.cookie(item.key, item.value, {
        maxAge: item.maxAge as number,
        httpOnly: item.httpOnly,
        secure: item.secure,
        path: item.path,
      });
      response.status(200);
    }
  }

  @Get('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const cookie = request.cookies;
    await this.appService.logout(
      (() => {
        const result = [];
        for (const key in cookie) {
          const value = cookie[key];
          result.push(`${key}=${value}`);
        }
        return result;
      })()
    );

    response.status(200);
    response.clearCookie('CASTGC');
    response.clearCookie('happyVoyagePersonal');
  }
}
