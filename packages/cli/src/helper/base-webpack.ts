import * as path from 'path';
import { Configuration } from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import WebpackBar from 'webpackbar';
import DotenvFlow from 'dotenv-flow-webpack';
import { cellTransformer } from './cell-transformer';

const bundleFile = 'index.js';

export function getBaseWebpackConfig(entryName: string) {
  const baseWebpackConfig: Configuration = {
    context: path.resolve(process.cwd()),
    target: 'node',
    devtool: 'source-map',
    output: {
      path: path.resolve(process.cwd(), 'dist', entryName),
      filename: bundleFile,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                getCustomTransformers: () => {
                  return {
                    after: [cellTransformer],
                  };
                },
              },
            },
          ],
        },
      ],
    },
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    plugins: [new WebpackBar(), new DotenvFlow()],
    resolve: {
      extensions: ['.ts'],
      plugins: [new TsconfigPathsPlugin()],
    },
    stats: 'verbose',
  };

  return baseWebpackConfig;
}
