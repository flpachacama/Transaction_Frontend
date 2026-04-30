import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, next: NextFunction) {
    const status = error.httpCode || error.status || 500;
    const message = error.message || 'Internal Server Error';

    response.status(status).json({
      success: false,
      status,
      error: {
        message,
      },
    });
  }
}
