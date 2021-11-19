import { ClassType, GenericProvider } from './';

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