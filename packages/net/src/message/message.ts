export interface Message {
  withHeader(newHeader?: { [key: string]: any });
  withHeaderItem(key: string, value);
  withBody(newBody?: any);
}