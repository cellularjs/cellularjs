import * as path from 'path';
import * as ts from 'typescript';
import { scanRelTsFiles } from './scanRelTsFiles.func';
import { CellMetaProps } from './cell.const';

const factory = ts.factory;

export const listenPropTransformer = (node, pathOfCurrentFile: string) => {
  if (!isDefinedListenProperty(node)) {
    return node;
  }

  const cellMetaExpression = <ts.ObjectLiteralExpression>node.arguments[0];
  const cellListenAssignment = <ts.PropertyAssignment>(
    cellMetaExpression.properties.find(
      (property) =>
        (<ts.Identifier>property.name).escapedText === CellMetaProps.LISTEN,
    )
  );

  const listenInitializer = cellListenAssignment.initializer;
  if (!ts.isStringLiteral(listenInitializer)) {
    return node;
  }

  const listenValue = listenInitializer.text;
  const serviceDir = path.join(pathOfCurrentFile, listenValue);
  const relTsFiles = scanRelTsFiles(serviceDir, listenValue);
  const newListenExpressions = relTsFiles.map((filePath) =>
    factory.createCallExpression(
      factory.createIdentifier('require'),
      undefined,
      [factory.createStringLiteral(filePath)],
    ),
  );

  // remove previous listen property and assign new value for it.
  const removedOldListen = cellMetaExpression.properties.filter(
    (property) =>
      (<ts.Identifier>property.name).escapedText !== CellMetaProps.LISTEN,
  );
  const newCellMetaExpression = factory.updateObjectLiteralExpression(
    factory.createObjectLiteralExpression(),
    [
      ...removedOldListen,
      factory.createPropertyAssignment(
        factory.createIdentifier(CellMetaProps.LISTEN),
        factory.createArrayLiteralExpression(newListenExpressions),
      ),
    ],
  );

  return factory.updateCallExpression(node, node.expression, undefined, [
    newCellMetaExpression,
  ]);
};

const isDefinedListenProperty = (node: ts.CallExpression) => {
  const cellMetaExpression = <ts.ObjectLiteralExpression>node.arguments[0];

  return !!cellMetaExpression.properties.find(
    (property: ts.PropertyAssignment) => {
      return (
        (<ts.Identifier>property.name).escapedText === CellMetaProps.LISTEN
      );
    },
  );
};
