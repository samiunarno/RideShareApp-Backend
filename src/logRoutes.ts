// logRoutes.ts
import { Application } from 'express';

export const logRoutes = (app: Application, baseUrl: string) => {
  console.log('\n📌 Available API Endpoints:');

  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      // Direct route (e.g. app.get(...))
      const methods = Object.keys(middleware.route.methods);
      methods.forEach((method) => {
        console.log(` ${method.toUpperCase()} ${baseUrl}${middleware.route.path}`);
      });
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      // Nested route (e.g. app.use('/api/auth', authRoutes))
      middleware.handle.stack.forEach((handler: any) => {
        const route = handler.route;
        if (route) {
          const methods = Object.keys(route.methods);
          methods.forEach((method) => {
            const pathMatch = middleware.regexp?.source.match(/\/api\/[a-z]+/);
            const basePath = pathMatch ? pathMatch[0] : '';
            console.log(` ${method.toUpperCase()} ${baseUrl}${basePath}${route.path}`);
          });
        }
      });
    }
  });
};
