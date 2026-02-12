import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Portfolio Backend API',
      status: 'running',
      version: '1.0.0',
      endpoints: {
        health: 'GET /',
        feedback: {
          create: 'POST /feedback',
          getAll: 'GET /feedback',
          getOne: 'GET /feedback/:id',
          delete: 'DELETE /feedback/:id',
        },
      },
    };
  }
}
