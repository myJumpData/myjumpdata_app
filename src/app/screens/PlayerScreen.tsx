import * as React from "react";
import { FlatList, Image, Pressable, View } from "react-native";
import TrackPlayer from "react-native-track-player";
import PlaceholderMusic from "../assets/music_placeholder.png";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { borderRadius, Colors } from "../Constants";
import PlayerService from "../services/player.service";
import Wrapper from "../components/Wrapper";
import { useSelector } from "react-redux";
import getApi from "../utils/getApi";
import api from "../services/api";
import fullname from "../utils/fullname";
import { capitalize } from "../utils/capitalize";

export default function PlayerScreen() {
  const [freestyleTracks, setFreestyleTracks] = React.useState([]);
  const user = useSelector((state: any) => state.user);
  const [refreshing, setRefreshing] = React.useState(false);

  const getFreestyleTracks = () => {
    api.get("/track/freestyle").then((res) => {
      setRefreshing(false);
      setFreestyleTracks(
        res.data.freestyleTracks.map(({ id, name }) => {
          return {
            id,
            url: `${getApi()}/upload/${id}`,
            title: name,
            artist: capitalize(fullname(user)),
          };
        })
      );
    });
  };

  React.useEffect(() => {
    getFreestyleTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({ item }: any) => {
    if (item.heading) {
      return (
        <View>
          <StyledText style={{ fontWeight: "bold", fontSize: 18 }}>
            {item.heading}
          </StyledText>
        </View>
      );
    }
    return (
      <Pressable
        onPress={async () => {
          await TrackPlayer.reset();
          await TrackPlayer.add(item);
          await TrackPlayer.play();
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: borderRadius / 1.5,
              marginRight: 7.5,
            }}
            source={PlaceholderMusic}
          />
          <View style={{ flexDirection: "column" }}>
            <StyledText style={{ fontSize: 18, fontWeight: "500" }}>
              {item.title}
            </StyledText>
            <StyledText style={{ fontSize: 14, color: Colors.grey }}>
              {item.artist}
            </StyledText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <Wrapper as={StyledView}>
      <FlatList
        renderItem={renderItem}
        data={React.useMemo(() => {
          return [
            {
              heading: "Freestyle-Track",
            },
            ...freestyleTracks,
            {
              heading: "Speed-Track",
            },
            ...PlayerService.getLibrary(),
          ];
        }, [freestyleTracks])}
        keyExtractor={(item, index) => String(index)}
        refreshing={refreshing}
        onRefresh={getFreestyleTracks}
        ItemSeparatorComponent={() => <StyledView style={{ height: 16 }} />}
      />
    </Wrapper>
  );
}
