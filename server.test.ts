// // server.test.ts
// import { superoak } from "https://deno.land/x/superoak@2.1.0/mod.ts";
// import app from "./serverT.ts";

// /**
//  * Test that the server returns the "Hello Deno!" JSON object when make a
//  * GET request to "/".
//  */
// Deno.test("it should return some JSON with status code 200", async () => {
//   const request = await superoak(app);
//   await request.get("/")
//     .expect(200)
//     .expect("Content-Type", /json/)
//     .expect('{"message":"Hello Deno!"}');
// });


import { runServer, closeServer } from "./serverT.ts";
import { Rhum } from "https://deno.land/x/rhum@v1.1.2/mod.ts";
import {
  superdeno,
  Test,
} from "https://x.nest.land/superdeno@2.1.1/mod.ts";

Rhum.testPlan("server.ts", () => {
  Rhum.beforeAll(async () => {
    await runServer();
  });

  Rhum.afterAll(() => {
    closeServer();
  });

  Rhum.testSuite("when making a GET request to the root '/' path", () => {
    let result: Test;

    Rhum.beforeAll(() => {
      result = superdeno("http://localhost:3000").get("/");
    });

    Rhum.testCase(
      "it should respond with a HTTP 200 (OK) status code",
      async () => {
        await result.expect(200);
      },
    );

    Rhum.testCase(
      "it should respond with a 'html' like Content-Type",
      async () => {
        await result.expect("Content-Type", /html/);
      },
    );

    Rhum.testCase(
      "it should respond with 'Hello Deno!' as the body",
      async () => {
        await result.expect("Hello Deno!");
      },
    );
  });

  Rhum.testSuite(
    "when making a GET request to a path that hasn't been configured",
    () => {
      let result: Test;

      Rhum.beforeAll(() => {
        result = superdeno("http://localhost:3000").get("/does-not-exist");
      });

      Rhum.testCase(
        "it should respond with a HTTP 404 (Not Found) status code",
        async () => {
          await result.expect(404);
        },
      );

      Rhum.testCase(
        "it should respond with a 'html' like Content-Type",
        async () => {
          await result.expect("Content-Type", /html/);
        },
      );

      Rhum.testCase(
        "it should respond with 'Not Found' as the body",
        async () => {
          await result.expect("Not Found");
        },
      );
    },
  );
});

Rhum.run();