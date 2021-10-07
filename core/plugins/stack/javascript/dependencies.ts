import { Context } from "../../../types.ts";

const denoDepRegex = /\/\/.*\/(?<DependencyName>.+?)(?=\/|@)/gm;

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

const readDependencyFile = async (context: Context) => {
  const dependencies: string[] = [];

  for await (const file of context.files.each("**/package.json")) {
    const packageJson = await context.files.readJSON(file.path);

    const nodeDeps = packageJson?.dependencies;
    if (nodeDeps) {
      dependencies.push(...Object.keys(nodeDeps));
    }

    const nodeDepsDev = packageJson?.devDependencies;
    if (nodeDepsDev) {
      dependencies.push(...Object.keys(nodeDepsDev));
    }
  }

  for await (const file of context.files.each("**/deps.ts")) {
    const denoDepsText = await context.files.readText(file.path);

    const depsDeno: string[] = Array.from(
      denoDepsText.matchAll(denoDepRegex),
      (match) => !match.groups ? null : match.groups.DependencyName,
    ).filter(notEmpty);

    if (depsDeno) {
      dependencies.push(...depsDeno);
    }
  }
  return dependencies;
};

export const hasNodeDependency = async (
  context: Context,
  dependencyName: string,
): Promise<boolean> => {
  const dependencies = await readDependencyFile(context);
  return dependencies.some((dep) => dep === dependencyName);
};

export const hasNodeDependencyAny = async (
  context: Context,
  dependencyList: string[],
): Promise<boolean> => {
  const dependencies = await readDependencyFile(context);
  return dependencies.some((dep) => dependencyList.includes(dep));
};
