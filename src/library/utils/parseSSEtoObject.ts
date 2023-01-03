const parseSSEtoObject = (SSEtext: string) => {
  const responseArray = SSEtext.trim()
    .split(/\n\n/)
    .filter((str: string) => str);

  const responseObjectArray = responseArray.map((data: string) => {
    return data.split(/\n/).map((a) => {
      const splitArray = a.split(/(?<=^[^:]*):/); // Remove first :
      const key = splitArray[0]?.trim();
      const value = splitArray[1]?.trim();

      if (key === undefined) return;

      const object = { [key]: value };
      return object;
    });
  });

  const usefulData = responseObjectArray.filter((b) => {
    // eslint-disable-next-line dot-notation
    const retryCheck = b.find((obj) => !obj?.["retry"]); // Eslint disabled as currently there is an ESlint typescript config regarding array accessing.
    const endCheck = !b.find((obj) =>
      obj ? Object.values(obj).includes("end") : false
    );
    if (retryCheck && endCheck) return true;
    else return false;
  });

  const flattenedData = usefulData.flat();
  const arrayLength = flattenedData.length;
  const obj1 = flattenedData[arrayLength - 1];
  const obj2 = flattenedData[arrayLength - 2];
  const formattedData = { ...obj1, ...obj2 };
  return formattedData;
};

export default parseSSEtoObject;
