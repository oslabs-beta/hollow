const hollow: any = {};

hollow.registerRoutes = (routes: any) => {
  const router = new Router();

  routes.forEach((route: any) => {
    router[route.method].call(router, router.route, route.middleware);
  });
}

export default hollow;