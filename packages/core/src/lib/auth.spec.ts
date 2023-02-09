import { createCredential } from './auth';
import * as process from 'process';

describe('createCredential', () => {
  it('should create a credential', async () => {
    const credential = await createCredential(
      process.env['ONEAPI_LOGIN_URL'] as string
    );
    expect(credential.key).toBeDefined();
  });
});
