var assert = require('chai').assert;

module.exports = function makeMock(object) {
  var args = [];
  var mockObj = function mockObj() {};

  for (prop in object.prototype) {
    mockObj.prototype[prop] = mockFunction(prop);
  }

  mockObj.prototype.reset = function reset() {
    for (prop in args) {
      if (args.hasOwnProperty(prop)) {
        args[prop] = [];
      }
    }
  }
  mockObj.prototype.getArgs = function getArgs() {
    return args;
  }
  return mockObj;

  function mockFunction(name) {
    var returns = undefined;
    var sideEffects = [];
    function _mockFunction() {
      applySideEffects.apply(this, arguments);
      args[name] = args[name] || [];
      args[name].push(Array.prototype.slice.call(arguments));
      return returns;
    }
    function applySideEffects() {
      for (var i = 0; i < sideEffects.length; i++) {
        sideEffects[i].apply(this, arguments);
      };
    }
    _mockFunction.assertCalledOnceWith = function assertCalledOnceWith(expectedArgs, message) {
      assert.deepEqual(args[name][0], expectedArgs, message);
    }
    _mockFunction.assertCalledWith = function assertCalledWith(expectedArgs, message) {
      // TODO: Implement Deep equal comparison
      actualArgs = args[name];
      for (var i = 0; i < actualArgs.length; i++) {
        for (var j = 0; j < actualArgs[i].length; j++) {
          if (expectedArgs[j] !== actualArgs[i][j]) {
            break;
          }
          if (j === actualArgs[i].length - 1) {
            return assert.deepEqual(actualArgs[i], expectedArgs);
          }
        };
      };
      assert.fail(actualArgs, expectedArgs, message);
    }
    _mockFunction.assertNotCalled = function assertNotCalled(message) {
      assert.equal(args[name].length, 0, message);
    }
    _mockFunction.assertNumTimesCalled = function assertNumTimesCalled(num, message) {
      assert.equal(args[name].length, num, message);
    }
    _mockFunction.returns = function returns(value) {
      returns = value;
    }
    _mockFunction.assertCalledOnceWithArgsIncluding = function assertCalledWithArgsIncluding(expectedArgs, message) {
      assert.includeMembers(args[name][0], expectedArgs, message);
    }
    _mockFunction.addSideEffect = function(sideEffectFunc) {
      sideEffects.push(sideEffectFunc);
    }
    return _mockFunction;
  }
}

