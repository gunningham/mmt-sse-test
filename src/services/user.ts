const fetch = require('node-fetch');
import HttpStatus from 'http-status';
import { body, check, validationResult } from 'express-validator';
import { Request } from 'express';

import { CUSTOMER_ACCOUNT_DETAILS_API_KEY } from '@/constants';
import { buildError } from '@/helpers';
import { User, Error } from '@/types';

/**
 * Get user details by email
 *
 * @returns {User}
 */

type ReturnResult = {
  userDetails?: User;
  error?: Error;
};

export const getUserDetails = async (req: Request): Promise<ReturnResult> => {
  // Validate email
  await check('user', 'Email is not valid').isEmail().run(req);
  await body('user').normalizeEmail({ gmail_remove_dots: false }).run(req);

  const validationErrors = validationResult(req).array();

  if (validationErrors.length) {
    return {
      error: buildError(validationErrors[0].msg, HttpStatus.BAD_REQUEST),
    };
  }

  // Make request to api
  try {
    const baseUrl = 'https://customer-account-details.azurewebsites.net/api';
    const response = await fetch(
      `${baseUrl}/GetUserDetails?code=${CUSTOMER_ACCOUNT_DETAILS_API_KEY}&email=${req.body.user}`,
    );

    // Return error if user doesnt exist
    if (!response.ok) {
      return {
        error: buildError(response.statusText, response.status),
      };
    }

    // Get user details
    const userDetails: User = await response.json();

    // Return error if customerId does not match ID in the request body
    if (userDetails.customerId !== req.body.customerId) {
      return {
        error: buildError('Customer ID does not match', HttpStatus.BAD_REQUEST),
      };
    }

    return { userDetails };
  } catch (error) {
    return {
      error: buildError(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
    };
  }
};
