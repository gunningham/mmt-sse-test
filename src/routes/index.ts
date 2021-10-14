import * as ordersController from '@/controllers/orders';

import { Router } from 'express';

const router = Router();

router.post('/orders/latest', ordersController.getMostRecentOrder);

export default router;
