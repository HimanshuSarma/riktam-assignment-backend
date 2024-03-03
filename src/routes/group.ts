import { Router } from 'express';

import { createGroupController } from '../controllers/groupControllers/createGroup.js';
import { getAllGroupsAuthController } from '../controllers/groupControllers/getAllGroupsAuth.js';

import { verifyJWTToken } from '../utils/jwt/verifyToken.js';
import { extractDataAndCallVerifyToken } from '../utils/middlewareDataExtractorUtils.js';

const groupRouter: Router = Router();

// All POST routes here start...
// groupRouter.post(`/create`,
//     extractDataAndCallVerifyToken,
//     createGroupController.validation,
//     createGroupController.handler
// );
// All POST routes here end...

// All GET routes here start...
groupRouter.get(`/user-is-member`, 
    extractDataAndCallVerifyToken,
    getAllGroupsAuthController.handler
);
// All GET routes here end...

export { groupRouter };