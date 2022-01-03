import * as path from 'path';
import * as ts from 'typescript';
import { listenPropTransformer } from './listenPropTransformer.func';
import { providersPropTransformer } from './providersPropTransformer.func';

export const cellTransformer: ts.TransformerFactory<ts.SourceFile> = (
  context: ts.TransformationContext,
) => {
  let pathOfCurrentFile: string;

  const transformCellDecorator = (node: ts.CallExpression) => {
    let transformedNode = listenPropTransformer(node, pathOfCurrentFile);
    transformedNode = providersPropTransformer(
      transformedNode,
      pathOfCurrentFile,
    );
    return transformedNode;
  };

  const visit = (node: ts.Node) => {
    const isCellDecoratorExpression =
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.escapedText === 'Cell';

    if (isCellDecoratorExpression) {
      return transformCellDecorator(node);
    }

    return ts.visitEachChild(node, (child) => visit(child), context);
  };

  return (node: ts.SourceFile) => {
    pathOfCurrentFile = path.dirname(node.fileName);

    return ts.visitNode(node, visit);
  };
};
