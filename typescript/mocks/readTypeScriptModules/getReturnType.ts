export class Parent {
  someProp = {
    foo: 'bar',
  };
}

export class Child extends Parent {
  someProp = Object.assign(this.someProp, {
    bar: 'baz'
  });
}