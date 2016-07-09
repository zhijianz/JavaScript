// var person = {
//   _age:10
// };
// Object.defineProperty(person, "age",
//   {get:function(){
//     return this._age + "岁";
//   },
//   set:function(newValue) {
//     if (newValue < 0) {
//       newValue = 0;
//     }else if (newValue > 100) {
//       newValue = 100;
//     }
//     this._age = newValue;
//   }});
//
// person.age = 101;

// 构造函数的使用

function Person(name, age) {
  this.name = name;
  this.age = age;
  this.sayHi = function() {
    var temp = 'name: ' + this.name + " age: " + age + " say Hi!";
    console.log(temp);
  }
}

var person1 = new Person("name1", 12);
var person2 = new Person("name2", 13);

person1.sayHi();
person2.sayHi();

console.log('person1.constructor is Person : ' + person1.constructor == Person);
console.log('person2.constructor is Person : ' + person2.constructor == Person);
console.log('person1.constructor: ' + person1.constructor);
