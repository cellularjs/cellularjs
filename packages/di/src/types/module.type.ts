import { ClassType, GenericProvider } from './';
import { OnInit } from './life-cycle.type';

export type ImportableCnf = ClassType | ExtModuleMeta;

export type ExportableCnf = ClassType | ExtModuleMeta;

export interface ModuleMeta {
  providers?: GenericProvider[];
  imports?: ImportableCnf[];
  exports?: ExportableCnf[];
}

export interface ExtModuleMeta extends ModuleMeta {
  /**
   * Module class that you want to extend
   */
  extModule: ClassType;
}

export type ModuleWithListener = Partial<OnInit>;
