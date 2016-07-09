function createNewPerson() {
  var person = new Object();
  person.name = "name";
  person.age = 10;
  person.sayHi = function() {
    console.log(this.name + " say Hi!");
  }
  return person;
}

var person = createNewPerson();
person.sayHi();

console.log('person.constrator == Object(): ' , person.constructor == Object);
console.log('person instanceof Object: ' , person instanceof Object);
