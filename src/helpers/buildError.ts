import { Error } from '@/types';
import HttpStatus from 'http-status';

export const buildError = (message: string, status: number): Error => {
  return {
    message: message || 'An error occured',
    status: status || HttpStatus.INTERNAL_SERVER_ERROR,
  };
};
