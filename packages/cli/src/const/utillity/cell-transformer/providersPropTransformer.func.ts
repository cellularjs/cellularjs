import * as path from 'path';
import * as ts from 'typescript'
import { scanRelTsFiles } from './scanRelTsFiles.func'
import { CellMetaProps } from './cell.const'

const factory = ts.factory;

export function providersPropTransformer(node: ts.CallExpression, pathOfCurrentFile) {
  if (!isIncludeProvidersProp(node)) {
    return node;
  }

  const cellProvidersExpression = <ts.ObjectLiteralExpression>node.arguments[0];
  const providersPropExpression = <ts.PropertyAssignment>cellProvidersExpression.properties.find(property => (<ts.Identifier>property.name).escapedText === CellMetaProps.PROVIDERS);

  const providersElements = (<ts.ArrayLiteralExpression>providersPropExpression.initializer).elements;
  const [strExp, otherExp] = separateExpression(providersElements)

  let relTsFiles = [];
  strExp.map(str => str.text).forEach(folder => {
    const targetFolder = path.join(pathOfCurrentFile, folder);
    relTsFiles = relTsFiles.concat(scanRelTsFiles(targetFolder, folder))
  })

  const providersExpression = factory.createArrayLiteralExpression(relTsFiles.map(file => {
    return factory.createCallExpression(
      factory.createIdentifier('require'),
      undefined,
      [factory.createStringLiteral(file)]
    )
  }));

  const removedProvidersProperty = cellProvidersExpression.properties.filter(
    property => (<ts.Identifier>property.name).escapedText !== CellMetaProps.PROVIDERS
  );

  const newCellProvidersExpression = factory.updateObjectLiteralExpression(cellProvidersExpression, [
    ...removedProvidersProperty,
    factory.createPropertyAssignment(
      factory.createIdentifier(CellMetaProps.PROVIDERS),
      factory.createArrayLiteralExpression([...otherExp, providersExpression])
    ),
  ]);

  return factory.updateCallExpression(node, node.expression, undefined, [newCellProvidersExpression]);
}

const isIncludeProvidersProp = node => {
  return !!node.arguments[0].properties.find(property =>
    property.name.escapedText === CellMetaProps.PROVIDERS
  );
};

function separateExpression(dataElements: ts.NodeArray<any>): [ts.StringLiteral[], any[]] {
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
