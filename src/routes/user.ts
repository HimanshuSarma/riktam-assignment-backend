import { Router } from 'express';


import { signupController } from '../controllers/userControllers/signup.js';
import { loginController } from '../controllers/userControllers/login.js';
import { getAllUsersController } from '../controllers/userControllers/getAllUsers.js';
import { getAllUsersInGivenChatRoomController } from '../controllers/userControllers/getAllUsersInGivenChatroom.js';

import { extractDataAndCallVerifyToken } from '../utils/middlewareDataExtractorUtils.js';

const userRouter: Router = Router();

// All POST routes here start...
userRouter.post(`/signup`,
    signupController.validation,
    signupController.handler
);

userRouter.post(`/login`,
    loginController.validation,
    loginController.handler
);
// All POST routes here end...

// All GET routes here start...
userRouter.get('/test', (req, res) => {
    res.status(200).send('test');
})

userRouter.get(`/all`, 
    getAllUsersController.handler
);

userRouter.get(`/all-in-given-chatroom`, 
    extractDataAndCallVerifyToken,
    getAllUsersInGivenChatRoomController.validation,
    getAllUsersInGivenChatRoomController.handler
);
// All GET routes here end...

export { userRouter };