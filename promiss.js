assert = (cond, message) => { if (cond) { console.log("Test passed"); } else { console.log(message); } };
assert_eq = (actual, expected) => { assert((actual == expected), ("Test failed; expected " + expected + ", got " + actual)) };
notreached = () => { assert(false, "Test failed; reached unreachable code"); };

function Promiss(callback) {
  var then = [];
  var state = 0; // pending. 1 = resolved, 2 = rejected
  var resolved_val; // set when resolved or rejected
  this.resolve = (val) => {
    if (state == 0) {
      resolved_val = val;
      state = 1;
      for(let i = 0; i < then.length; ++i) {
        if (then[i][0]) {
          try {
            let result = then[i][0](val);
            then[i][2].resolve(result);
          } catch (err) {
            then[i][2].reject(err);
          }
        } else {
          then[i][2].resolve(val);
        }
      }
    }
  };
  this.reject = (val) => {
    if (state == 0) {
      resolved_val = val;
      state = 2;
      for(let i = 0; i < then.length; ++i) {
       if (then[i][1]) {
          try {
            let result = then[i][1](val);
            then[i][2].resolve(result);
          } catch (err) {
            then[i][2].reject(err);
          }
        } else {
          then[i][2].reject(val)
        }
      }
    }
  };
  this.then = (onresolve, onreject) => { let thenPromiss = new Promiss((res,rej) => {
      // what goes here?
    });
    if (state == 0) {
      then.push([onresolve, onreject, thenPromiss]);
    } else if (state == 1) {
      if (onresolve)
        onresolve(resolved_val);
      thenPromiss.resolve(resolved_val);
    } else if (state == 2) {
      if (onreject)
        onreject(resolved_val);
      thenPromiss.reject(resolved_val);
    }
    return thenPromiss;
  };
  this.catch = (onreject) => this.then(undefined, onreject);
  callback(this.resolve, this.reject);
}
