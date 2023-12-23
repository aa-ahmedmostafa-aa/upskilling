const transformRawArrayData = (data) => {
  const transformedData = data.map((item) => {
    return transformRawObjectData(item)
  });
  return transformedData;
};

const transformRawObjectData = (item) => {
  const transformedItem = Object.keys(item).reduce((acc, key) => {
    const splittedKey = key.split(".");
    if (splittedKey.length > 1) {
      const [firstKey, secondKey] = splittedKey;
      return {
        ...acc,
        [firstKey]: {
          ...acc[firstKey],
          [secondKey]: item[key],
        },
      };
    }
    return {
      ...acc,
      [key]: item[key],
    };
  }, {});
  return transformedItem;
};

module.exports = { transformRawArrayData, transformRawObjectData };
