import { Cookie } from 'tough-cookie';
import { createCredential, Credential } from './auth';
import { encodePassword } from './crypto';
import { UsernameOrPasswordError } from './error';

export class Client {
  private credential?: Credential;

  constructor(
    private readonly url: string,
    private readonly username: string,
    private readonly password: string
  ) {}

  public async login(url?: string): Promise<void> {
    if (this.credential) {
      return;
    }
    this.credential = await createCredential(url || this.url);
    const encodedPassword = encodePassword(this.password, this.credential.key);

    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', encodedPassword);
    formData.append('captcha', this.credential.token.captcha);
    formData.append('lt', this.credential.token.lt);
    formData.append('cllt', this.credential.token.cllt);
    formData.append('dllt', this.credential.token.dllt);
    formData.append('execution', this.credential.token.execution);
    formData.append('_eventId', this.credential.token._eventId);

    await this.credential.context.post(this.url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      maxRedirects: 0,
      validateStatus: (status) => status === 302,
    });

    // console.log(response.headers['set-cookie']);

    if (
      ((this.credential as Credential).context.cookie() as Cookie[]).some(
        (cookie) =>
          cookie.key === 'CASTGC' || cookie.key === 'happyVoyagePersonal'
      )
    ) {
      return;
    } else {
      throw UsernameOrPasswordError;
    }
  }

  public logined(): boolean {
    return this.credential !== undefined;
  }

  public async logout(url?: string): Promise<void> {
    if (!this.credential) {
      return;
    }
    await this.credential.context.get(url || this.url);
    this.credential = undefined;
  }
}
