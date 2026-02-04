// Task ID: S2T1
// Babel 설정 - ES6 모듈을 CommonJS로 변환

module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      }
    }]
  ]
};
