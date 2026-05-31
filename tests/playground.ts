//fix example errors
//Error 1
{
const retries: number = "five";  // What does VS Code show?
const user = { email: "john@test.com" };
console.log(user.password);      // What does VS Code show?
}

//Fix 1:
{
const retries: number = 5;  
const user = { email: "john@test.com" };
console.log(user.email); 
}

//Error 2
{

function getTimeout(seconds: number): string {
  return seconds * 1000;  // Hint: look at the return type
}
}

//Fix 2:
{
function getTimeout(seconds: number): number {
  return seconds * 1000;  // Hint: look at the return type
}
}

//Error 3
{
const config = { baseURL: "https://staging.example.com" };
console.log(config.baseUrl);  // Hint: case matters
}
//Fix 3:
{
const config = { baseURL: "https://staging.example.com" };
console.log(config.baseURL);  // Hint: case matters
}


//Error 4
{
function printName(name: string) {
  console.log(name);
}
const userName: string | undefined = undefined;
printName(userName);  // Hint: what if userName is undefined?
}

// Fix 4:
{
function printName(name: string) {
  console.log(name);
}
const userName: string | undefined = undefined;
if (userName) {
  printName(userName);
}
}

export {};




