import * as ts from 'typescript';
import { CellMetaProps } from './cell.const';
import { TS_FILE_REGEX_STR } from '../../const';

const factory = ts.factory;

export const listenPropTransformer = (node: ts.CallExpression) => {
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

  const newListenExpressions = [
    factory.createCallExpression(
      factory.createIdentifier('require.context'),
      undefined,
      [
        factory.createStringLiteral(listenInitializer.text),
        factory.createTrue(),
        factory.createRegularExpressionLiteral(TS_FILE_REGEX_STR),
      ],
    ),
  ];

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
