module.exports = {
  root: true, // 此项是用来告诉eslint找当前配置文件不能往父级查找
  env: {
    // 环配置 如 "browser": true, node: true,
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: 0,
    'space-before-function-paren': 0,
    'no-unused-vars': 'off',
    'vue/no-unused-vars': 'off',
    'no-useless-return': 0,
    indent: ['off', 2],
    'prefer-const': 'off'
  }
}
