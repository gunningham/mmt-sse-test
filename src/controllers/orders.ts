import HttpStatus from 'http-status';
import { Request, Response } from 'express';

import * as ordersService from '@/services/orders';
import * as userService from '@/services/user';
import { formatRecentOrderData } from '@/helpers';

/**
 * Gets a users most recent order
 *
 * @param {Request} req
 * @param {Response} res
 */

export const getMostRecentOrder = async (req: Request, res: Response) => {
  const { order, error } = await ordersService.getMostRecentOrder(req);

  if (error) {
    return res.status(error.status).json(error);
  }

  const { userDetails, error: userError } = await userService.getUserDetails(
    req,
  );

  if (userError) {
    return res.status(userError.status).json(userError);
  }

  if (order && userDetails) {
    const response = formatRecentOrderData(order, userDetails);
    res.json(response);
  }
};
