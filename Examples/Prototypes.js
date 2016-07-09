function Person() {};
console.log(Person.prototype);
console.log(Person.prototype.constructor);

var person1 = new Person();
console.log(Object.getPrototypeOf(person1));
