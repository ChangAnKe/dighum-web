// config.js
import yaml from 'js-yaml';

// 读取 YAML 文件
const env = process.env.NODE_ENV || 'development';
const configFile = `./${env}.yaml`;
const config = yaml.load(configFile);

export default config;