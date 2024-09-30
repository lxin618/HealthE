import express from 'express';
import { GetCustomerById, GetCustomerProfile, CustomerAccountSetup } from '../controllers';
import { Auth } from '../middleware/Auth';

const router = express.Router();

// router.post('/refreshtoken, TokenRefresh')
router.get('/profile', GetCustomerProfile);
router.get('/:id', GetCustomerById);
router.patch('/profile', Auth, CustomerAccountSetup);

export { router as CustomerRoute };
