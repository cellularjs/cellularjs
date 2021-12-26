import { Configuration } from 'webpack';

export interface CellularConfig {
  entry: { [entryName: string]: string };
  webpack?: (config: Configuration) => Configuration;
}
