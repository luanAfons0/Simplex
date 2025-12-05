function getRecordFromString({
  value,
  contentSplitSymbol,
  keyValueSplitSymbol,
}: {
  value: string;
  contentSplitSymbol: string;
  keyValueSplitSymbol: string;
}): Record<string, any> {
  let result: Record<string, any> = {};

  const hasMultipleContents = value.indexOf(contentSplitSymbol);

  if (hasMultipleContents == -1) {
    const contentValues = value.split(keyValueSplitSymbol);
    const contentKey = contentValues[0];
    const contentValue = contentValues[1];

    result = {
      [String(contentKey)]: contentValue,
    };
    return result;
  }

  value.split(contentSplitSymbol).forEach((fullContentValue: string) => {
    const contentValues = fullContentValue.split(keyValueSplitSymbol);
    const contentKey = contentValues[0];
    const contentValue = contentValues[1];

    result[String(contentKey)] = contentValue;
  });

  return result;
}

export { getRecordFromString };
