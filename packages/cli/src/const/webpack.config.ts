import * as path from 'path';
import { Configuration } from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import WebpackBar from 'webpackbar';
import NodemonPlugin from 'nodemon-webpack-plugin';
import DotenvFlow from 'dotenv-flow-webpack';
import { cellTransformer } from './utillity/cell-transformer';

const bundleFile = 'index.js';

export function getBaseConfig(entryName: string) {
  const baseWebpackConfig: Configuration = {
    context: path.resolve(process.cwd()),
    target: 'node',
    mode: 'production',
    devtool: 'source-map',
    watch: true,
    output: {
      path: path.resolve(process.cwd(), 'dist', entryName),
      filename: bundleFile,
    },
    optimization: {
      minimize: false,
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
    plugins: [new WebpackBar(), new DotenvFlow(), new NodemonPlugin()],
    resolve: {
      extensions: ['.ts'],
      plugins: [new TsconfigPathsPlugin()],
    },
    stats: 'verbose',
  };

  return baseWebpackConfig;
}
