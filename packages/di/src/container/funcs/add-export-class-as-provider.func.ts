import { Container } from '../..';
import { ClassType } from '../../types';

export async function addExportClassAsProvider(
  this: Container,
  exportCnf: ClassType,
) {
  if (this.has(exportCnf)) {
    return;
  }

  await this.addProvider(exportCnf);
}
