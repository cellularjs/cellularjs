import { SourceName } from './type';

export enum TypeOrmErrorCode {
  NoDataSource = 'NO_DATA_SOURCE',
  DuplicateSourceName = 'DUPLICATE_SOURCE_NAE',
}

export class TypeOrmError extends Error {
  constructor(message: string, public code: TypeOrmErrorCode) {
    super(message);
  }
}

export const Errors = {
  NoDataSource: (source: SourceName) =>
    new TypeOrmError(
      `(${
        TypeOrmErrorCode.NoDataSource
      }) There is no DataSource(${source.toString()}):\n` +
        `- You need to initialize the data source before adding entities or using getDataSource function.\n` +
        `- This data source may be removed.`,
      TypeOrmErrorCode.NoDataSource,
    ),

  DuplicateSourceName: (source: SourceName) =>
    new TypeOrmError(
      `(${
        TypeOrmErrorCode.DuplicateSourceName
      }) DataSource(${source.toString()}) already exist`,
      TypeOrmErrorCode.DuplicateSourceName,
    ),
};
