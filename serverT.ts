// server.ts

// import { Application, Router } from "https://deno.land/x/oak@v6.5.0/mod.ts";
// import { superoak } from "https://deno.land/x/superoak@4.0.0/mod.ts";

// const router = new Router();
// router.get("/", (ctx) => {
//     // const req = ('Hello Deno!')
//   ctx.response.body =JSON.stringify( {"message":"Hello Deno!"});
// });

// const app = new Application();
// app.use(router.routes());
// app.use(router.allowedMethods());

// Deno.test("it should support the Oak framework", async () => {
//   const request = await superoak(app);
//   await request.get("/").expect("Hello Deno!");

// });
// Deno.test("it should return some JSON with status code 200", async () => {
//     const request = await superoak(app);
//     await request.get("/")
//       .expect(200)
//       .expect("Content-Type", "application/json")
//       .expect({"message":"Hello Deno!"});
//   });
//   export { app };






// import { Application, Router } from "https://deno.land/x/oak@v6.5.0/mod.ts";
// import { superdeno } from "https://deno.land/x/superdeno@4.0.0/mod.ts";

// const router = new Router();
// router.get("/", (ctx) => {
//   ctx.response.body = "Hello Deno!";
// });

// const app = new Application();
// app.use(router.routes());
// app.use(router.allowedMethods());

// Deno.test("it should support the Oak framework", async() => {
//   const controller = new AbortController();
//   const { signal } = controller;

//   app.addEventListener("listen", async ({ hostname, port, secure }) => {
//     const protocol = secure ? "https" : "http";
//     const url = `${protocol}://${hostname}:${port}`;

//     await superdeno(url)
//       .get("/")
//       .expect("Hello Deno!", () => {
//         controller.abort();
//       });
//   });

//    await app.listen({ port: 0, signal });
// });





  
// import { Application, Router } from "https://deno.land/x/oak@v6.5.0/mod.ts";

// const router = new Router();
// router.get("/", (ctx) => {
//   ctx.response.body = "Hello Deno!";
// });

// const app = new Application();
// app.use(router.routes());
// app.use(router.allowedMethods());

// app.addEventListener("listen", ({ port }) => {
//   console.log(`Listening at http://localhost:${port}`);
// });

// if (import.meta.main) {
//   await app.listen({ port: 3000 });
// }

// export { app };


import { Drash } from "https://deno.land/x/drash@v1.2.3/mod.ts";

/**
 * Setup our HomeResource for responding to requests
 * to the root path.
 */
class HomeResource extends Drash.Http.Resource {
  static paths = ["/"];
  public GET() {
    this.response.body = "Hello Deno!";

    return this.response;
  }
}

/**
 * Create our Drash HTTP Server.
 */
const server = new Drash.Http.Server({
  response_output: "text/html",
  resources: [HomeResource],
});

/**
 * Runs our Drash HTTP Server on http://localhost:3000
 */
export const runServer = async () => {
  await server.run({
    hostname: "localhost",
    port: 8000,
  });

  console.log("server listening at http://localhost:3000");
};

/**
 * Closes our Drash Server
 */
export const closeServer = () => {
  try {
    server.close();
  } catch (_) {}
};

// If we run this file directly then run the server.
if (import.meta.main) {
  runServer();
}