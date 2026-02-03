console.log("Asynchronous Programming");

// --------------------synchronous code---------------

// console.log("Before");

// function fun(){
//     console.log("I am Fun");
// }
// fun();

// console.log("After");

//--------------------Asynchronous code---------------

// console.log("Before");

// function fun(){
//     console.log("I am Fun");
// }

// setTimeout(fun,0);

// console.log("After");

//-------------------aynchronous code--------

// console.log("Before");//1

// let flag = true;

// function fun() {
//   //2sec
//   console.log("loop break");
//   flag = false;
// }

// setTimeout(fun, 2000); // runs  somewhere ( browser) web API, after 2s added fun() to Callback queue

// console.log("After");//2
// console.log("next");//3

// while (flag) {} //Infinite loop

//----------------------quiz1----------------------
// console.log("Before");
// const fun2 = () => {
//   console.log("Set timeout 1");
//   let timeInFuture = Date.now() + 7000;

//   while (Date.now() < timeInFuture) {} // 7s loop
//   console.log("after while");
// };
// const fun1 = () => console.log("hello"); //
// setTimeout(fun1, 2000); //
// setTimeout(fun2, 1000); //

// console.log("After");

//----------------------quiz2----------------------
// console.log("Start"); //1, t=0

// setTimeout(() => {
//   console.log("First Timeout (1s)"); // 6, t=1

//   setTimeout(() => {
//     console.log("Inner Timeout (0.5s)"); // 7 , t=1.5
//   }, 500);//webApi-4, after t=1.5s added to cb Q
// }, 1000);//webAPi-1, after t=1 added to cb Q.

// setTimeout(() => {
//   console.log("Second Timeout (0s)"); // 4, t=0
// }, 0);//webAPi-2, after t=0 Added to CB queue

// function runTask() {
//   console.log("Inside runTask"); //2, t=0

//   setTimeout(() => {
//     console.log("Timeout inside runTask (300ms)"); //5, t=0.3
//   }, 300);//webAPi-3, added to cb Q after t=0.3,

//   function innerTask() {
//     console.log("Inside innerTask"); //3, t=0
//   }

//   innerTask();
// }

// runTask();

// // SetInterval -----
// let i = 0;

// let id = setInterval(() => {
//   console.log("I'm inside setInterval", ++i);
//   if (i === 10) {
//     clearInterval(id);
//   }
// }, 1000);

console.log("Before");
      setTimeout(() => {
        console.log("b/w");
      },0);
      console.log("After");

          const button = document.querySelector("button");
          console.log("Before");
        // Asynchronous
          button.addEventListener("click", () => {
            console.log("I was clicked");
          });
          console.log("After");

      API -> https://jsonplaceholder.typicode.com/todos/1
        Promises
        fetch("https://jsonplaceholder.typicode.com/todos/1").then(
          //After Promise has been responded to.
          function (response) {
            console.log(response);

            if (response.status == 200) {
              response.json().then(function(jsonData){
                  console.log(jsonData);
              })
            } else {
              alert("Data not found!!");
            }
          },
        );


      //Async/await

      console.log("Before");
      
      async function fn() {
        console.log("Inside function");
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos/1",
        );
        console.log(response);
        const jsonData = await response.json();
        console.log("Bottom of fn")

      }


      fn();
      console.log("After");
      