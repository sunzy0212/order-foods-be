function objectPlus(o, stuff){
    var n;
    function F(){}
    F.prototype = o;
    n = new F();
    n.uber = o;

    for(var key in stuff){
        n[key] = stuff[key];
    }
    return n;
}

var shape = {
    name : 'shape',
    toString : function(){
        return this.name;
    }
}

var triangle = objectPlus(shape,{
    height : 10,
    side : 5,
    getArea : function(){
        return this.height*this.side/2;
    }
});

var my = objectPlus(triangle,{
    name : 'myTriangle',
    height : 3,
    side : 4
});

var proto = {
    name : 'proto',
    toString : function(){
        return this.name;
    }
}

function Foo(){

}

Foo.prototype.name = 'proto';
Foo.prototype.toString = function(){
    return this.name;
};

Foo.prototype = proto;
Foo.prototype.constructor = Foo;

var foo1 = new Foo();
var foo2 = new foo1.constructor();

console.log(foo1.toString());
console.log(foo2.toString());
console.log(foo1.constructor);
console.log(Foo.prototype);
console.log(foo1.constructor.prototype.constructor)

