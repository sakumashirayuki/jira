export const isVoid = (value) => {
  return value === undefined || value === null || value === ""; // this change the type of value to Boolean
};

export const cleanObject = (object) => {
  const result = { ...object };
  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};
