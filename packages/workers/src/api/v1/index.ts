import { Router } from 'itty-router';
import { userRouter } from './user';

export const apiRouter = Router({
  base: '/api/v1',
});

apiRouter.all('/user/*', userRouter.handle);
