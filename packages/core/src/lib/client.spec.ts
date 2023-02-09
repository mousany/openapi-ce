import { Client } from './client';

describe('Client', () => {
  it('should login', async () => {
    const client = new Client(
      process.env['ONEAPI_LOGIN_URL'] as string,
      process.env['ONEAPI_USERNAME'] as string,
      process.env['ONEAPI_PASSWORD'] as string
    );
    await client.login();
    expect(client.logined()).toBeTruthy();
  });

  it('should logout', async () => {
    const client = new Client(
      process.env['ONEAPI_LOGIN_URL'] as string,
      process.env['ONEAPI_USERNAME'] as string,
      process.env['ONEAPI_PASSWORD'] as string
    );
    await client.login();
    expect(client.logined()).toBeTruthy();
    await client.logout(process.env['ONEAPI_LOGOUT_URL'] as string);
    expect(client.logined()).toBeFalsy();
  });
});
