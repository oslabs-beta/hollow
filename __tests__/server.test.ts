import { superoak } from "https://deno.land/x/superoak@4.0.0/mod.ts";

import app from "./server.ts";

Deno.test('it should return some JSON with status code 200', async () => {
  const request = await superoak(app);
  await request.get('/')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect('{"message":"Hello Deno!"}');
});