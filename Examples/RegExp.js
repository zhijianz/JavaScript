var text = "mom and dad and baby adksdkfsjk";
var re = /mom( and dad( and baby)?)?/gi;

var matches = re.exec(text);

console.log(matches.index);
console.log(matches.input);
console.log(matches.length);
console.log(matches.toString());
