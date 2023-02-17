import Toast from "react-native-root-toast";

import type { MD3Colors } from "react-native-paper/lib/typescript/types";

const useErrorModal = (colors: MD3Colors, error: Error) => {
  Toast.show(error?.message, {
    position: Toast.positions.TOP,
    containerStyle: {
      borderColor: colors.error,
      borderWidth: 2,
      backgroundColor: colors.errorContainer,
      paddingHorizontal: 20,
    },
    textColor: colors.inverseSurface,
  });
};

export default useErrorModal;
