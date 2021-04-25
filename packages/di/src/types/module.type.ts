import { ClassType, GenericProvider } from './';

export type ImportableCnf = ClassType<any> | ExtModuleMeta;

export type ExportableCnf = ClassType<any> | ExtModuleMeta;

export interface ModuleMeta {
  providers?: GenericProvider<any>[];
  imports?: ImportableCnf[];
  exports?: ExportableCnf[];
}

export interface ExtModuleMeta extends ModuleMeta {
  /**
   * Module class that you want to extend
   */ 
  extModule: ClassType<any>;
}