import { Introspector } from "../deps.ts";
import { introspect as introspectVersion } from "./version.ts";
import {
  introspect as introspectPackageManager,
  PackageManager,
} from "./package_manager.ts";
import {
  introspect as instrospectBlack,
  Black,
} from "./black.ts"
import {
  introspect as instrospectIsort,
  Isort,
} from "./isort.ts"
import {
  introspect as instrospectPytest,
  Pytest,
} from "./pytest.ts"
import {
  introspect as instrospectFlake8,
  Flake8,
} from "./flake8.ts"


// Available package managers
type PythonPackageManager = PackageManager | null
// Available code formatters
type BlackFormatter = Black | null
type IsortFormatter = Isort | null
// Available code tester
type PytestTester = Pytest | null
// Available Linter
type Flake8Linter = Flake8 | null

/**
 * Introspected information about a project with Python
 */
export default interface PythonProject {
  /**
   * Python version
   */
  version?: string;
}

export const introspector: Introspector<PythonProject | undefined> = {
  detect: async (context) => {
    return await context.files.includes("**/*.py");
  },
  introspect: async (context) => {
    const logger = context.getLogger("python");

    // Version
    logger.debug("detecting version");
    const version = await introspectVersion(context);
    if (version === undefined) {
      logger.debug("didn't detect the version");
      return undefined;
    }
    logger.debug(`detected version ${version}`);
    // Package Manager
    logger.debug("detecting package manager");
    const packageManager = await introspectPackageManager(context)
    // Formatter
    logger.debug("detecting formatter");
    const black = await instrospectBlack(context)
    const isort = await instrospectIsort(context)
    // Tester
    logger.debug("detecting tester");
    const pytest = await instrospectPytest(context)
    // Linter
    logger.debug("detecting linter");
    const flake8 = await instrospectFlake8(context)
    return {
      version: version,
      pythonPackageManager: packageManager,
      blackFormatter: black,
      isortFormatter: isort,
      pytestTester: pytest,
      flake8Linter: flake8,
    };
  },
};
