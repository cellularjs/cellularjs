import { Container, ClassType } from "@cellularjs/di";
import { CellContext } from "./index";
import { CLL_CELL_OPTS } from "./key";
import { NetworkConfig, CellConfig, ResolvedCell, ResolvedDriver, CellOptions } from "./type";

export class ControlPlane {
  private static _Entry_Sep = "#";

  private static _Resolved_Cells = new Map<string, ResolvedCell>();

  public static getResolvedCell(cellName: string): ResolvedCell | undefined {
    return this._Resolved_Cells.get(cellName);
  }

  public static async registerNetwork(networkConfig: NetworkConfig): Promise<void> {
    networkConfig.forEach(cellConfig => this._resolveCell(cellConfig));
  }

  private static _resolveCell(cellConfig: CellConfig): void {
    const resoledCell: ResolvedCell = {
      cellConfig,
      resolvedDriver: { local: null }
    };

    this._bindDriverInstance(resoledCell, cellConfig);

    this._Resolved_Cells.set(cellConfig.name, resoledCell);
  }

  private static _bindDriverInstance(resoledCell: ResolvedCell, cellConfig: CellConfig) {
    if (typeof cellConfig.driver === 'string') {
      const driverClass = this._getDriverClass(cellConfig.driver);
      resoledCell.resolvedDriver['local'] = this._resolveDriver(cellConfig, driverClass);
      return;
    }

    Object.keys(cellConfig.driver).forEach(driverType => {
      const driverClass = this._getDriverClass(cellConfig.driver[driverType])
      resoledCell.resolvedDriver[driverType] = this._resolveDriver(cellConfig, driverClass);
    });
  }

  private static _getDriverClass(entry: string): { new(...args: any[]): CellContext } {
    const [jsPath, className] = entry.split(ControlPlane._Entry_Sep);
    try { require.resolve(jsPath); } catch (e) {
      throw new Error(`${jsPath} is not existed, please correct network driver for '${entry}'`);
    }

    const module = require(jsPath);
    if (!module[className]) {
      throw new Error(`${className} is not existed in ${jsPath}, please correct network driver for '${entry}'`);
    }

    return module[className];
  }

  private static _resolveDriver(
    cellConfig: CellConfig,
    driverClass: ClassType<CellContext>,
  ): ResolvedDriver {
    const cellOptions: CellOptions = Reflect.getMetadata(CLL_CELL_OPTS, driverClass);
    if (!cellOptions) {
      throw new Error(`${cellConfig.name} is not a cell, check if you decorated cell with @Cell() annotation`);
    }

    const cellContextInstance = new (cellOptions.context || CellContext);

    Object.defineProperty(cellContextInstance, "cellName", {
      value: cellConfig.name,
      configurable: false,
      writable: false,
    });

    const cellContainer = new Container();

    const listEvents = Object.keys(cellOptions.listen).map(key => cellOptions.listen[key]);
    cellContainer.addProviders(listEvents);

    cellContainer.addProviders(cellOptions.providers);
    cellContainer.addModules(cellOptions.imports);

    Object.defineProperty(cellContextInstance, "container", {
      value: cellContainer,
      configurable: false,
      writable: false,
    });

    return {
      listen: cellOptions.listen,
      context: cellContextInstance,
    };
  }
}
