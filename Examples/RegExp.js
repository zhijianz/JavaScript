var re = null, i;
var testStr = 'catastrophe';

for (var i = 0; i < 10; i++) {
  re = /cat/g;
  console.log(re.test(testStr));
}

for (var i = 0; i < 10; i++) {
  re = new RegExp('cat', 'g');
  console.log(re.test(testStr));
}
