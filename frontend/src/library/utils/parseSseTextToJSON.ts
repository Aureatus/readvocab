const parseSseTextToJSON = (SSEtext: string) => {
  const responseArray = SSEtext.trim()
    .split(/\n\n/)
    .filter((str: string) => str);

  const responseObjectArray = responseArray.map((data: string) => {
    const eventArray = data.split(/\n/);
    const eventObjects = eventArray.map((eventText) => {
      const splitArray = eventText.split(/(?<=^[^:]*):/); // Remove first :
      const key = splitArray[0]?.trim();
      const value = splitArray[1]?.trim();

      if (key === undefined) return;

      const eventObject = { [key]: value };
      return eventObject;
    });
    return eventObjects;
  });

  const usefulData = responseObjectArray
    .filter((eventArray) => {
      const retryCheck = eventArray.find((evObj) => evObj?.["retry"]);
      const endCheck = eventArray.find((evObj) => evObj?.["event"] === "end");
      if (retryCheck || endCheck) return false;
      else return true;
    })
    .flat();

  const obj1 = usefulData[usefulData.length - 1];
  const obj2 = usefulData[usefulData.length - 2];

  const formattedData = { ...obj1, ...obj2 };
  return formattedData;
};

export default parseSseTextToJSON;
