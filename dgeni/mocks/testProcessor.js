/**
 * @dgProcessor testProcessor
 */
module.exports = function testProcessor() {
  return {
    $runAfter: ['a', 'b'],
    $runBefore: ['c','d'],
    $validate: {
      requiredProp: { presence: true }
    },
    $process: function(docs) {}
  };
};