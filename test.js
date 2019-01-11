let octoDB = require('./octoDB');

let octo1 = new octoDB('test.txt');

octo1.set('a', 1);
// return 1
console.log(octo1.get('a'));
// return null
console.log(octo1.get('b'));
octo1.del('a');
// return null
console.log(octo1.get('a'));
octo1.del('b');

octo1.set('c', 1);
octo1.set('d', 1);
octo1.set('e', 1);

octo1.rpush('rpush', 1);
console.log(octo1.get('rpush'));
octo1.rpush('rpush', 2);
console.log(octo1.get('rpush'));
octo1.lpush('rpush', 3);
console.log(octo1.get('rpush'));
octo1.lpush('lpush', 1);
console.log(octo1.get('lpush'));

console.log(octo1.llen('rpush'));

octo1.rpush('mylist', 1);
octo1.rpush('mylist', 2);
octo1.lpush('mylist', 3);
octo1.lpush('mylist', 4);
console.log(octo1.lrange('mylist', 0, 2));
console.log(octo1.lrange('mylist', 1, 3));
console.log(octo1.lrange('mylist', 0));
console.log(octo1.lrange('mylist', 2));
console.log(octo1.lrange('mylist', 2, 100));

console.log(octo1.rpop('mylist'));
console.log(octo1.lpop('mylist'));

octo1.set('timed', 1);
octo1.expire('timed', 1);
//setTimeout(function(){console.log(octo1.get('timed'))}, 1000);

octo1.set('timed2', 1);
octo1.expire('timed2', 5);
//setTimeout(function(){console.log(octo1.get('timed2'))}, 4000);
//setTimeout(function(){console.log(octo1.get('timed2'))}, 6000);

console.log(octo1.get('foo'));
octo1.set('foo', 'bar');
octo1.expire('foo', 1);

octo1.delete('foo');
octo1.set('foo', 'new');
console.log(octo1.get('foo'));
setTimeout(function(){console.log(octo1.get('foo'))}, 4000);
