import { CellContext } from '..';

export interface RequestOptions {
  /**
   * `refererCell` allow CellularJS to get information of cell that send this request.
   */
  refererCell?: CellContext;

  /**
   * By default, driver type is 'local'.
   */
  driverType?: string;

  /**
   * By default, all exception will be treated as error response.
   * This flag is helpfull for quick debugging.
   */
  throwOriginalError?: boolean;
}
