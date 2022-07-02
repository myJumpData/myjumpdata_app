import * as React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import FreestyleList, { FreestyleListType } from "../components/FreestyleList";
import SelectInput from "../components/Input";
import { StyledView } from "../components/StyledView";
import Wrapper from "../components/Wrapper";
import { Colors } from "../Constants";
import {
  getFreestyle,
  getUserFreestyle,
  saveFreestyleData,
} from "../services/freestyle.service";
import GroupsService from "../services/groups.service";
import fullname from "../utils/fullname";

export default function GroupFreestyleScreen({ route, navigation }) {
  const { id } = route.params;

  const freestyle = useSelector((state: any) => state.freestyle);

  const [freestyleData, setFreestyleData] = React.useState<any[]>([]);
  const [folderData, setFolderData] = React.useState<FreestyleListType[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [userSelect, setUserSelect] = React.useState([]);
  const [userSelected, setUserSelected] = React.useState("");
  const [club, setClub] = React.useState<any>();

  React.useEffect(() => {
    GroupsService.getGroup(id as string).then((response: any) => {
      navigation.setOptions({ title: response.data.name });
      const tmp = response.data?.athletes.map((e) => {
        return {
          name: fullname(e),
          value: e.id,
        };
      });
      setUserSelect(tmp);
      setUserSelected(tmp[0]?.value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  React.useEffect(() => {
    (async () => {
      await getUserData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelected]);

  React.useEffect(() => {
    getCurrentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freestyle]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    GroupsService.getGroup(id as string).then((response: any) => {
      const tmp = response.data?.athletes.map((e) => {
        return {
          name: fullname(e),
          value: e.id,
        };
      });
      setUserSelect(tmp);
      setRefreshing(false);
    });
    (async () => {
      await getUserData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getUserData() {
    GroupsService.getClub().then((response) => {
      setClub(response.data);
    });
    if (userSelected) {
      return getUserFreestyle(
        [userSelected],
        [...folderData.map((e) => e.id)]
      ).then((response: any) => {
        setFreestyleData(response.data);
        setRefreshing(false);
        return Promise.resolve();
      });
    }
    return Promise.resolve();
  }

  function getCurrentData() {
    getFreestyle(freestyle).then((response: any) => {
      setFolderData(response.data);
      setRefreshing(false);
    });
  }

  return (
    <Wrapper as={StyledView}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomColor: Colors.grey,
          borderWidth: 2,
        }}
      >
        <SelectInput
          data={userSelect}
          state={userSelected}
          setState={setUserSelected}
        />
      </View>
      <FreestyleList
        data={folderData}
        onSubmit={({ itemId, state }) => {
          return saveFreestyleData(
            userSelected,
            itemId,
            !state?.stateCoach
          ).then(() => {
            return getUserData();
          });
        }}
        refreshing={refreshing}
        setRefreshing={setRefreshing}
        onRefresh={onRefresh}
        state={freestyleData}
        club={club}
      />
    </Wrapper>
  );
}
