import { useEffect, useState } from "react";

import type { DefinitionWord } from "../../types/dataTypes";

const useDialogState = (wordData: DefinitionWord[]) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    if (wordData.length !== 0) {
      setDialogVisible(true);
    }
  }, [wordData]);

  return {
    dialogVisible,
    setDialogVisible,
  };
};

export default useDialogState;
