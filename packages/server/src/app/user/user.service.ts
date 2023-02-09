import { Injectable } from '@nestjs/common';
import { Client, Context } from '@oneapi/core';
import process from 'process';
import { Cookie } from 'tough-cookie';

@Injectable()
export class UserService {
  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  async login(username: string, password: string) {
    const client = new Client(
      process.env['ONEAPI_LOGIN_URL'],
      username,
      password
    );
    const cookie = await client.login();
    return cookie;
  }

  async logout(cookie: string[]) {
    const context = new Context({
      url: process.env['ONEAPI_LOGIN_URL'],
      cookie: cookie.map((cookie: string) => Cookie.parse(cookie)),
    });
    await context.get(process.env['ONEAPI_LOGOUT_URL']);
  }
}
