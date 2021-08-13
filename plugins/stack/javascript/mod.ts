import { Introspector } from "../deps.ts";
import { introspect as introspectRuntime, Runtime } from "./runtime.ts";
import {
  introspect as introspectPackageManager,
  PackageManager,
} from "./package_manager.ts";

/**
 * Introspected information about a project with JavaScript
 */
export default interface JavaScriptProject {
  /**
   * Which package manager is used in the project
   *
   * A package manager may not exist in a JavaScript project.
   * For example, a project that uses Deno doesn't need to use
   * npm, yarn or any other package manager.
   */
  packageManager: PackageManager | null;
  /**
   * Which runtime the project uses
   */
  runtime: Runtime;
}

export const introspector: Introspector<JavaScriptProject> = {
  detect: async (context) => {
    return await context.files.includes("**/*.[j|t]s");
  },
  introspect: async (context) => {
    const logger = context.getLogger("javascript");

    // Runtime
    logger.debug("detecting runtime");
    const runtime = await introspectRuntime(context);
    logger.debug(`detected runtime "${runtime.name}"`);

    // Package manager
    let packageManager: PackageManager | null;
    if (runtime.name === "deno") {
      logger.debug(
        "skipping package manager detection, unapplicable for the detected runtime",
      );
      packageManager = null;
    } else {
      logger.debug("detecting package manager");
      packageManager = await introspectPackageManager(context);
      logger.debug(`detected package manager "${packageManager.name}"`);
    }

    return {
      runtime,
      packageManager,
    };
  },
};