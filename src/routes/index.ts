import { Router } from 'express';

import { userRouter } from './user.js';
import { groupRouter } from './group.js';

const router: Router = Router();

router.use(`/`, (req, res) => {
    return res?.status(200).send('Hi');
});
router.use(`/user`, userRouter);
router.use(`/group`, groupRouter);

export { router };