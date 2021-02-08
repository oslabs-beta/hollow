// import { Rhum } from "https://deno.land/x/rhum@v1.1.7/mod.ts";

// let value = false;

// function run() {
//     return true;
// }

// async function close() {
//   value = true;
//   return value;
// }

// Rhum.testPlan("", () => {
//   Rhum.testSuite("run()", () => {
//     Rhum.testCase("Returns true", () => {
//       const result = run();
//       Rhum.asserts.assertEquals(true, result);
//     });
//   });
//   Rhum.testSuite("close", () => {
//     Rhum.testCase("Returns true", async () => {
//       const result = await close();
//       Rhum.asserts.assertEquals(true, result);
//     });
//   });
// });

// Rhum.run();


// Deno.test("async deno emit", async () => {
  
//   try {
//     console.log('hi');
//     // @ts-ignore
//     const { files } = await Deno.emit('./client/index.tsx', {
//       check: false,
//       bundle: 'esm',
//       importMap: {
//         imports: {
//           "React": "https://cdn.pika.dev/react@16.13.1",
//         },
//       },
//     });
//     console.log('files: ', files);
//   } catch (err) {
//     console.log(err);
//   }
  

// }) 