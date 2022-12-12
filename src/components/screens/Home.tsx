import { useContext } from "react";
import { Button, View, Text } from "react-native";
import WordDataContext from "../../library/context/WordDataContext";
import getFile from "../../library/helpers/getFile";
import getRareWords from "../../library/helpers/getRareWords";
import type { HomeProps } from "../../types/navigationTypes";

const Home = ({ navigation: { navigate } }: HomeProps) => {
  const context = useContext(WordDataContext);
  if (context === null)
    return (
      <View>
        <Text>Error</Text>
      </View>
    );
  const { setWordData, setWordDataLoading, setWordDataError } = context;

  return (
    <View>
      <Button
        title="Upload PDF"
        onPress={() => {
          (async () => {
            try {
              const fileUri = await getFile();
              if (fileUri === undefined) return;

              setWordDataLoading(true);

              const rareWords = await getRareWords(fileUri);
              setWordData(rareWords);
              setWordDataError(undefined);
            } catch (err) {
              if (err instanceof Error) setWordDataError(err);
            } finally {
              setWordDataLoading(false);
            }
          })();
        }}
      />
      <Button
        title="Go to placeholder 2"
        onPress={() => navigate("Placeholder2")}
      />
    </View>
  );
};

export default Home;
