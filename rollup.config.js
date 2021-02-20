import {ResourceGenerator} from './scripts/resource-generator';
import copy from 'rollup-plugin-copy';

const resourceGenerator = new ResourceGenerator('resources');

const serverFiles = [];
const clientFiles = [];

resourceGenerator.availableResources.forEach(resource => {
  const pkg = resourceGenerator.readPackageJson(resource);

  if (pkg.isGameResource) {
    const hasServer = resourceGenerator.hasFolder(resource,
        pkg.serverFolder || 'server');
    const hasClient = resourceGenerator.hasFolder(resource,
        pkg.clientFolder || 'client');

    if (hasServer) {
      serverFiles.push(
          resourceGenerator.createServerConfig(
              `${resource}/server/index.ts`,
              resourceGenerator.createPathTo(`${pkg.name}/server.js`),
              [
                copy({
                  targets: [
                    {
                      src: `${resource}/assets/**/*`.replace(/\\/g, '/'),
                      dest: resourceGenerator.createPathTo(pkg.name),
                    },
                  ],
                  verbose: true,
                }),
              ],
              pkg.server && pkg.server.convertedModules || [],
              pkg.server && pkg.server.external || [],
          ),
      );
    }

    if (hasClient) {
      clientFiles.push(
          resourceGenerator.createClientConfig(
              `${resource}/client/index.ts`,
              resourceGenerator.createPathTo(`${pkg.name}/client.js`),
              pkg.client && pkg.client.externals || [],
          ),
      );
    }
  }
});

export default [
  ...serverFiles,
  ...clientFiles,
];
