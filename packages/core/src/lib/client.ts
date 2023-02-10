import { Cookie } from 'tough-cookie';
import { createCredential } from './auth';
import { Context } from './context';
import { encodePassword } from './crypto';
import { UsernameOrPasswordError } from './error';

/**
 * Client manages the credential of the user.
 * @class Client
 * @property credential - The credential of the user.
 * @url - The url of the login page.
 * @username - The username of the user.
 * @password - The password of the user.
 * @method login - Login to the authentication server.
 * @method logined - Check if the user has logged in.
 * @method logout - Logout from the authentication server.
 */
export class Client {
  constructor(
    private readonly username: string,
    private readonly password: string,
    private context?: Context
  ) {}

  public async login(url: string): Promise<Cookie[] | undefined> {
    if (this.context) {
      return;
    }
    const { token, key, context } = await createCredential(url);
    this.context = context;
    const encodedPassword = encodePassword(this.password, key);

    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', encodedPassword);
    formData.append('captcha', token.captcha);
    formData.append('lt', token.lt);
    formData.append('cllt', token.cllt);
    formData.append('dllt', token.dllt);
    formData.append('execution', token.execution);
    formData.append('_eventId', token._eventId);

    await this.context.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      maxRedirects: 0,
      validateStatus: (status) => status === 302,
    });

    // console.log(response.headers['set-cookie']);

    if (
      (this.context.cookie() as Cookie[]).some(
        (cookie) =>
          cookie.key === 'CASTGC' || cookie.key === 'happyVoyagePersonal'
      )
    ) {
      return this.context.cookie();
    } else {
      throw UsernameOrPasswordError;
    }
  }

  public logined(): boolean {
    return this.context !== undefined;
  }

  public async logout(url: string): Promise<void> {
    if (!this.context) {
      return;
    }
    await this.context.get(url);
    this.context = undefined;
  }
}
