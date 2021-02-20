import fs, {readJSONSync} from 'fs-extra';
import path from 'path';
import {config} from 'dotenv';
import {terser} from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';
import pkg from '../package.json';
import {convertNamedImports} from './convertNamedImports';

config();

export class ResourceGenerator {

  /**
   * Load resource folders from given path
   *
   * @param resourcePath
   */
  constructor(resourcePath) {
    this.resourceFolders = fs.readdirSync(
        path.resolve(__dirname, resourcePath))
        .map(resource => path.resolve(__dirname, resourcePath, resource));

    this.availableResources = this.filterAvailableResources(
        this.resourceFolders,
    );
  }

  /**
   * Return all resource with package.json
   *
   * @param resourceFolders
   * @returns {*}
   */
  filterAvailableResources(resourceFolders) {
    return resourceFolders.filter(
        folder => fs.existsSync(`${folder}/package.json`),
    );
  }

  /**
   * Check if a given folder exists
   *
   * @param resource
   * @param folderName
   * @returns {boolean}
   */
  hasFolder(resource, folderName) {
    return fs.existsSync(`${resource}/${folderName}`);
  }

  /**
   * Read the package json
   *
   * @param resource
   */
  readPackageJson(resource) {
    return require(`${resource}/package.json`);
  }

  /**
   * Create output path
   *
   * @param filePath
   * @returns {string}
   */
  createPathTo(filePath) {
    let outputPath = filePath;

    if (process.env.BUILD_DIR_RESOURCE) {
      outputPath = `${process.env.BUILD_DIR_RESOURCE}/${outputPath}`;
    }

    return outputPath;
  }

  /**
   * Create the object for rollup config
   *
   * @param inputFile
   * @param outputFile
   * @param external
   * @param plugins
   * @returns {{output: [{file: *, format: string}], input: *, external: *[], watch: {chokidar: boolean, clearScreen: boolean}, plugins: *[], preserveModules: boolean}}
   */
  createRollupConfig(inputFile, outputFile, external = [], plugins = []) {
    if (this.isProduction()) {
      let terserPlugin = terser({
        keep_classnames: true,
        keep_fnames: true,
        output: {
          comments: false,
        },
      });
      plugins.push(terserPlugin);
    }

    return {
      input: inputFile,
      output: [
        {
          file: outputFile,
          format: 'esm',
        },
      ],
      preserveModules: false,
      external,
      plugins,
      watch: {
        chokidar: true,
        clearScreen: true,
      },
    };
  }

  /**
   * Create server rollup config
   * @param input
   * @param output
   * @param convertedModules
   * @param plugins
   * @param external
   * @returns {{output: [{file: *, format: string}], input: *, external: *[], watch: {chokidar: boolean, clearScreen: boolean}, plugins: *[], preserveModules: boolean}}
   */
  createServerConfig(
      input,
      output,
      plugins = [],
      convertedModules = [],
      external = [],
  ) {
    plugins.push(
        nodeResolve(),
        typescript(),
        convertNamedImports({
          modules: [
            ...Object.keys(pkg.dependencies),
            ...Object.keys(pkg.devDependencies),
            ...this.getDepsFromModule('atlas-server').dependencies,
            ...convertedModules,
          ].filter(m => !m.startsWith('@abstractflo')),
        }),
        autoExternal({
          builtins: true,
          dependencies: true,
          packagePath: './package.json',
          peerDependencies: false,
        }),
    );

    external.push(
        'alt-server',
        ...Object.keys(pkg.devDependencies)
            .filter(m => !m.startsWith('@abstractflo')),
        ...this.getDepsFromModule('atlas-server')
            .dependencies
            .filter(m => !m.startsWith('@abstractflo')),
    );

    return this.createRollupConfig(input, output, external, plugins);
  }

  /**
   * Create server rollup config
   *
   * @param input
   * @param output
   * @param external
   * @param plugins
   * @returns {{output: [{file: *, format: string}], input: *, external: *[], watch: {chokidar: boolean, clearScreen: boolean}, plugins: *[], preserveModules: boolean}}
   */
  createClientConfig(
      input,
      output,
      external = [],
      plugins = [],
  ) {
    plugins.push(
        nodeResolve(),
        typescript(),
    );

    external.push('alt-client', 'natives');

    return this.createRollupConfig(input, output, external, plugins);
  }

  /**
   * Check if is production
   *
   * @returns {boolean}
   */
  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  /**
   * Return the deps from framework specific module
   *
   * @param name
   * @return {{devDependencies: [], dependencies: []}}
   */
  getDepsFromModule(name) {
    const out = {
      dependencies: [],
      devDependencies: [],
    };

    try {
      const file = readJSONSync(
          path.resolve(process.cwd(), 'node_modules', '@abstractflo', name,
              'package.json'));

      out.dependencies = Object.keys(file.dependencies);
      out.devDependencies = Object.keys(file.devDependencies);
    } catch {
    }

    return out;
  }

}
