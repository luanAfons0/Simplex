const routeMatch = ({
  value,
  valueToCompare,
  method,
}: {
  value: string;
  valueToCompare: string;
  method: string;
}): boolean => {
  if (value == valueToCompare) {
    return true;
  }

  if (!valueToCompare.toUpperCase().startsWith(method.toUpperCase())) {
    return false;
  }

  const regex = /\/[^\/]+/g;
  const valuePathSplited = value.match(regex);
  const valueToCompareSplited = valueToCompare.match(regex);

  if (!valueToCompareSplited || !valuePathSplited) {
    return false;
  }

  if (valuePathSplited.length != valueToCompareSplited.length) {
    return false;
  }

  for (let index: number = 0; index < valueToCompareSplited.length; index++) {
    const key = valueToCompareSplited[index];

    if (!key || key.startsWith("/:")) {
      continue;
    }

    const keyInPath = valuePathSplited[index];

    if (key != keyInPath) {
      return false;
    }
  }

  return true;
};

const generatePathParams = ({
  value,
  valueToCompare,
}: {
  value: string;
  valueToCompare: string;
}): Record<string, any> => {
  const regex = /\/[^\/]+/g;
  const valuePathSplited = value.match(regex);
  const valueToCompareSplited = valueToCompare.match(regex);

  if (!valueToCompareSplited || !valuePathSplited) {
    return {};
  }

  let result: Record<string, any> = {};

  for (let index: number = 0; index < valueToCompareSplited.length; index++) {
    const key = valueToCompareSplited[index];

    if (!key) {
      continue;
    }

    if (key.startsWith("/:")) {
      const formatedKey = key.replace(/(\/|:)/g, "");
      const value = (valuePathSplited[index] ?? "").replace(/(\/|:)/g, "");
      result[formatedKey] = value;
    }
  }

  return result;
};

export { routeMatch, generatePathParams };
