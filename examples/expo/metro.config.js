// gradflow-expo is linked from ../../packages/expo, outside this project,
// so Metro has to watch it and resolve its peers from this app's node_modules
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname
const packageRoot = path.resolve(projectRoot, '../../packages/expo')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [packageRoot]
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')]
config.resolver.disableHierarchicalLookup = true

module.exports = config
