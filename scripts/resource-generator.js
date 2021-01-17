import fs from 'fs-extra';
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

    if (process.env.BUILD_DIR) {
      outputPath = `${process.env.BUILD_DIR}/${outputPath}`;
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
        nodeResolve({
          moduleDirectories: ['local_modules', 'node_modules'],
        }),
        typescript(),
        convertNamedImports({
          modules: [
            ...Object.keys(pkg.dependencies),
            ...Object.keys(pkg.devDependencies),
            ...convertedModules,
          ],
        }),
        autoExternal({
          builtins: true,
          dependencies: true,
          packagePath: './package.json',
          peerDependencies: false,
        }),
    );

    external.push('alt-server');

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
        nodeResolve({
          moduleDirectories: ['local_modules', 'node_modules'],
        }),
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

}
