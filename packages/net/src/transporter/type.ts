export interface RequestOptions {
  /**
   * By default, driver type is 'local'.
   */
  driver?: string;

  /**
   * By default, all exception will be treated as error response.
   * This flag is helpfull for quick debugging.
   */
  throwOriginalError?: boolean;
}
