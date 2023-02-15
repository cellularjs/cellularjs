import * as ts from 'typescript';
import { CellMetaProps } from './cell.const';
import { TS_FILE_REGEX_STR } from '../../const';

const factory = ts.factory;

export function providersPropTransformer(node: ts.CallExpression) {
  if (!isIncludeProvidersProp(node)) {
    return node;
  }

  const cellProvidersExpression = <ts.ObjectLiteralExpression>node.arguments[0];
  const providersPropExpression = <ts.PropertyAssignment>(
    cellProvidersExpression.properties.find(
      (property) =>
        (<ts.Identifier>property.name).escapedText === CellMetaProps.PROVIDERS,
    )
  );

  const providersElements = (<ts.ArrayLiteralExpression>(
    providersPropExpression.initializer
  )).elements;
  const [strExp, otherExp] = separateExpression(providersElements);

  const providersExpression = factory.createArrayLiteralExpression(
    strExp.map((exp) =>
      factory.createCallExpression(
        factory.createIdentifier('require.context'),
        undefined,
        [
          factory.createStringLiteral(exp.text),
          factory.createTrue(),
          factory.createRegularExpressionLiteral(TS_FILE_REGEX_STR),
        ],
      ),
    ),
  );

  const removedProvidersProperty = cellProvidersExpression.properties.filter(
    (property) =>
      (<ts.Identifier>property.name).escapedText !== CellMetaProps.PROVIDERS,
  );

  const newCellProvidersExpression = factory.updateObjectLiteralExpression(
    cellProvidersExpression,
    [
      ...removedProvidersProperty,
      factory.createPropertyAssignment(
        factory.createIdentifier(CellMetaProps.PROVIDERS),
        factory.createArrayLiteralExpression([
          ...otherExp,
          providersExpression,
        ]),
      ),
    ],
  );

  return factory.updateCallExpression(node, node.expression, undefined, [
    newCellProvidersExpression,
  ]);
}

const isIncludeProvidersProp = (node) => {
  return !!node.arguments[0].properties.find(
    (property) => property.name.escapedText === CellMetaProps.PROVIDERS,
  );
};

function separateExpression(
  dataElements: ts.NodeArray<any>,
): [ts.StringLiteral[], any[]] {
  const strLiteralList: ts.StringLiteral[] = [];
  const otherExpressionList = [];

  for (let i = 0; i < dataElements.length; i++) {
    if (ts.isStringLiteral(dataElements[i])) {
      strLiteralList.push(dataElements[i]);
      continue;
    }

    otherExpressionList.push(dataElements[i]);
  }

  return [strLiteralList, otherExpressionList];
}
