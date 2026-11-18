const {test,expect} =require('@playwright/test') //statement is passing here (what you want&what you expeact)

test("my first test",async function({page}){

expect(12).toBe(12)

})
test("my second  test",async function({page}){

   expect(12).toBe(12)

})
test("my thrid test",async function({page}){

  expect(12).toBe(12)

})
test("my Fourth test",async function({page}){

 expect("Playwright").toContain("");

})
test.skip ("my fifth test",async function({page}){

 expect("Playwright").toContain("hello");

})
test("my sixth test",async function({page}){

  expect ("hemanth kumar".includes("kumar")).toBeTruthy(); 

})
test("my seven test",async function({page}){

  expect ("hemanth kumar".includes("reddy")).toBeFalsy(); 

})