> 关于`JavaScript`的面向对象编程设计

# 对象

> 无序的属性集合，其属性可以是基本值、对象或者函数。

上述是`ECMA-262`对于对象的定义，在对象中放置了`JavaScript`支持的所有类型的属性，通过每个属性对应的名字使用`.`操作符进行访问。下面的实例代码是`JavaScript`中创建对象的两种方式。

```javascript
  // 使用构造函数
  var person = new Object();
  person.name = "name";
  person.age = 12;
  person.job = "Software Engineer";
  person.sayName = function() {
    console.log(this.name);
  };

  // 使用字面量
  var person = {
    name:'name',
    age:12,
    job:'Software Engineer',
    sayName:function() {
      console.log(this.name);
    }
  };
```

## 属性特征

对象的属性本身具备有一些控制特征，这些特征会影响该属性在使用过程的中的访问和操纵流程，下面针对这些特征一个个进行介绍：

- `configurable`

  控制该属性是否可以使用`Object.defineProperty()`函数进行属性的配置，或者是使用`delete`标识符进行属性删除

- `writable`

  控制该属性是否可写可改，如果将这个特征置为`false`可以将其理解为`java`中的`final`

- `enumerable`

  表示该属性是否可以出现在`for-in`语句中

- `value`

  会在这个特征位上置入当前属性对应的属性值

- `setter/getter`

  控制对该属性的访问写入操作，后面直接用代码解释其作用即可

上面的这些特征都会影响到对象属性的使用方式，而这些对象的特征都是通过`Object.defineProperty`或者是`Object.defineProperties`函数进行定义。在创建对象的属性是，前面的三个属性都是默认为`true`，可以通过`Object.getOwnPropertyDescriptor`函数

```javascript
  // 缩进
  var person = new Object();
  person.name = "name";
  console.log(person.name);   // output: name
  var descriptor = Object.getOwnPropertyDescriptor(person, "name");
  console.log(descriptor);  // output:{ value: 'name', writable: true, enumerable: true, configurable: true }

  Object.defineProperty(person, "name", {writable:false});
  person.name = "name2";
  console.log(person.name);  // output:name
  Object.defineProperty(person, "name", {writable: true});
  person.name = "name2";
  console.log(person.name);   // output:name2

  delete person.name  // output:true
  console.log(person.name)  // output:undefined
  person.name = "name"
  Object.defineProperty(person, "name", {configurable:false});
  delete person.name
  Object.defineProperty(person, "name", {configurable:true});   // TypeError: Cannot redefine property:name

  person._age = 10;
  descriptor = Object.getOwnPropertyDescriptor(person, "_age");
  console.log(descriptor);  // output:{ value: 10, writable: true, enumerable: true, configurable: true }
  Object.defineProperty(person, "age", {
    get:function() {
      return this._age;
    },
    set:function(newValue) {
      if (newValue < 0) {
        newValue = 0;
      }else if (newValue > 100) {
        newValue = 100;
      }
      this._age = newValue;
    }
  })
  console.log(person.age);  // output:10
  person.age = -1;
  console.log(person.age);  // output:0
  person.age = 101;
  console.log(person.age);  // output:100
  descriptor = Object.getOwnPropertyDescriptor(person, "age");
  console.log(descriptor);  // output:{ get: [Function], set: [Function], enumerable: false, configurable: false }

  // 同时定义多个属性
  Object.defineProperties(person, {
    height:{
      configurable:true,
      writable:true,
      value:170
    },
    weight:{
      configurable:true,
      writable:true,
      value:50
    }
  })
  console.log(person.height);   // output:170
  console.log(person.weight);   // output:50
```

上面的示例代码除了展示几个属性特征的作用之外，同时要关注的还有三个比较关键的`API`函数的使用

```javascript
// 同时为对象定义多个属性
Object.defineProperties(obj: ?, props: ?)

// 为对象定义某个对象
Object.defineProperty(obj: ?, prop: string, desc: ?)

// 获取某个对象特征的描述
Object.getOwnPropertyDescriptor(obj: ?, prop: string)
```

## 创建方式

### 工厂模式

粗糙，只是代码的封装

### 构造函数模式

创建多余的函数对象，拥有一个`constructor`属性来进行类型判断

### 原型模式

利用构造函数的原型对象解决构造函数模式中的重复定义问题

![原型关系图](/images/oop_prototype.png)

上面的图片描述的是构造函数，对象实例以及构造函数的原型对象之间的关系。这其中蕴含的各种规则下面会一条条进行描述

1. 每个函数定义之后都会有一个`prototype`属性指向其对应的原型对象，这个原型对象用于放置该函数构造出来的实例对象所共享的内容，继承自`Object`
2. 函数的原型对象默认会持有一个`constructor`属性指向定义的函数
3. 实例对象默认会有个`__proto__`属性指向对应构造函数的原型对象，但是这个属性不能够直接访问，只能够通过`Object.getPrototypeOf`接口访问
4. 在原型对象中放置的属性会被对应的实例对象共享，所以可以直接通过实例对象进行属性的访问；在访问某个实例对象的属性时，首先会查找该实例对象是否定义了这个属性，如果没有再找其原型对象中是否存在；虽然实例对象可以访问原型对象的属性，但是不能够直接对其进行修改，如果使用赋值操作就会变成在实例对象中定义一个相同名称的属性并且会将原型对象中的属性覆盖掉，导致以后访问该实例对象的这个属性时得到的都是实例对象本身的属性而不是原型对象中共享的内容。即使后来将这个属性设置为`Null`也不能改变这种情况，只能通过`delete`操作删除属性后才可以访问到原型对象中的内容。
5. 关于属性的操作，可以通过`Object.hasOwnProperty`来判断实例对象是否有这个接口，也可以通过`in`操作符判断在能否通过该对象访问到对应的实例，不管是在实例对象中还是在原型对象中，此外，之前提及到的`Object.getOwnPropertyDescriptor`接口只能够获取到实例对象包含属性的描述而不包括原型对象，如果希望获取到原型对象的属性描述，需要直接调用原型对象的引用

```javascript
function Person() {};

//构造函数、原型对象、实例对象之间的关系
console.log(Person.prototype);  // output:Person{}
console.log(Person.prototype.constructor);  // output:[Function:Person]
var person1 = new Person();
console.log(Object.getPrototypeOf(person1));  // output:Person{}
console.log(Person.prototype.isPrototypeOf(person1));   // output:true

// 属性的检索方式和覆盖
console.log(person1.name);   // output:undefined
Person.prototype.name = 'prototype';
console.log(person1.name);  // output:prototype
person1.name = 'person1';
console.log(person1.name);  // output:person1
person1.name = null;
console.log(person1.name);  // output:null
delete person1.name;
console.log(person1.name);  // output:prototype

// 属性位置判断
person1.age = 10;
console.log(person1.hasOwnProperty('name'));  // output:false
console.log(person1.hasOwnProperty('age'));   // output:true
console.log('name' in person1);   // output:true
console.log('age' in person1);  // output:true
```

上面基本已经介绍完了所有和原型相关的东西，但是最后再提及到的一点是当我们希望去改写某个原型对象的时候，如果仅仅添加或者修改属性是没有问题的，但是如果通过其他的方法重新创建了一个原型对象，那么这个时候就要注意在创建这个新的原型对象之前所创建的实例对象所指向的原型还是之前的旧版本的原型对象，所以此后所有的原型更新都不会在实例上体现出来。

### 动态原型模式

动态原型模式利用构造函数创建对象本身的独有属性，在通过判断公共属性是否已经存在从而决定需不需要使用原型对象创建公有属性

```javascript
function Person() {
  this.name = '';
  this.age = 0;
  this.job = '';
  if (typeof this.sayName != function) {
    Person.prototype.sayName = function(){
      console.log(this.name);
    }
  }
}
```

## 继承

为了实现集成，最基本的思想是使用原型链。将父类的实例作为自类型的原型对象，这样子类型中可以拥有所有的父类的属性和方法。

```javascript
function SuperType() {
  this.label = 'label';
}
SuperType.prototype.sayLabel = function(){
  console.log(this.label);
}

var superType = new SuperType();
superType.sayLabel();   // output:label

function SubType(){
  this.name = 'SubType';
}
SubType.prototype = super;
SubType.prototype.sayName = function(){
  console.log(this.name);
}

var sub = new SubType();
sub.sayName();  // output:SubType
sub.sayLabel();   // output:label
```
