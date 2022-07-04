import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  useColorScheme,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {BottomSheetNavList} from '../components/BottomSheetNav';
import StyledBottomSheet from '../components/StyledBottomSheet';
import {StyledButton} from '../components/StyledButton';
import StyledLink from '../components/StyledLink';
import {
  StyledShyText,
  StyledShyTextStyle,
  StyledText,
} from '../components/StyledText';
import {StyledView} from '../components/StyledView';
import Wrapper from '../components/Wrapper';
import {Colors} from '../Constants';
import useRefreshOnFocus from '../hooks/useRefreshOnFocus';
import GroupsService, {getClub, getGroups} from '../services/groups.service';
import TeamService, {getTeams} from '../services/team.service';

export default function GroupsScreen({navigation}) {
  const user = useSelector((state: any) => state.user);
  const {t} = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';

  const [current, setCurrent] = React.useState<any>();

  const {
    isFetching: isFetchingClub,
    data: dataClub,
    isSuccess: isSuccessClub,
    refetch: refetchClub,
  } = useQuery(['club'], async () => {
    return await getClub();
  });
  const {
    isFetching: isFetchingGroups,
    data: dataGroups,
    isSuccess: isSuccessGroups,
    refetch: refetchGroups,
  } = useQuery(['groups'], async () => {
    return await getGroups();
  });
  const {
    isFetching: isFetchingTeams,
    data: dataTeams,
    isSuccess: isSuccessTeams,
    refetch: refetchTeams,
  } = useQuery(['teams'], async () => {
    return await getTeams();
  });

  const isFetching = isFetchingClub || isFetchingGroups || isFetchingTeams;
  const isSuccess = isSuccessClub && isSuccessGroups && isSuccessTeams;

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => {
    if (current?.group) {
      return dataClub?.data &&
        [...dataClub?.data.coaches, ...dataClub?.data.admins].some(
          (i: any) => i._id === user.id,
        ) &&
        current?.coaches.some((i: any) => i._id === user.id)
        ? [380]
        : [200];
    }
    return [200];
  }, [dataClub, current?.coaches, current?.group, user.id]);
  const bottomSheetRefLeave = React.useRef<BottomSheet>(null);
  const snapPointsLeave = React.useMemo(() => {
    return [200];
  }, []);

  const onRefresh = React.useCallback(() => {
    return Promise.all([refetchClub(), refetchGroups(), refetchTeams()]);
  }, []);

  useRefreshOnFocus(onRefresh);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (
          dataClub?.data &&
          [...dataClub?.data.coaches, ...dataClub?.data.admins].some(
            (i: any) => i._id === user.id,
          )
        ) {
          return (
            <Ionicons
              name="add-outline"
              size={30}
              color={isDarkMode ? Colors.white : Colors.black}
              style={{paddingRight: 10}}
              onPress={() => navigation.navigate('create')}
            />
          );
        }
        return;
      },
    });
  }, [dataClub, isDarkMode, navigation, user.id]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={{
        paddingVertical: 10,
      }}
      onPress={() => {
        setCurrent(item);
        bottomSheetRef.current?.snapToIndex(0);
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <StyledText style={{fontSize: 24, fontWeight: '600'}}>
            {item.name}
          </StyledText>
          <StyledShyText>
            {item.team
              ? t('common:nav_team')
              : item.group
              ? t('common:nav_group')
              : ''}
          </StyledShyText>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons
            name="ellipsis-vertical"
            style={{
              color: isDarkMode ? Colors.white : Colors.black,
              padding: 5,
            }}
            size={25}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Wrapper
      as={StyledView}
      outside={
        <>
          <StyledBottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
            {current ? (
              <>
                <StyledText
                  style={{fontWeight: '900', fontSize: 24, marginBottom: 15}}>
                  <Ionicons
                    name="people"
                    size={24}
                    color={isDarkMode ? Colors.white : Colors.black}
                  />
                  {' ' + current.name}
                </StyledText>

                <BottomSheetNavList
                  bsRef={bottomSheetRef}
                  data={
                    current.group
                      ? [
                          {
                            text: 'Scores',
                            icon: 'filter-outline',
                            onPress: () => {
                              navigation.navigate('group_score', {
                                id: current._id,
                              });
                            },
                          },
                          ...(current.coaches.some(
                            (i: any) => i._id === user.id,
                          )
                            ? [
                                {
                                  text: t('common:nav_player'),
                                  icon: 'musical-notes-outline',
                                  onPress: () => {
                                    navigation.navigate('group_player', {
                                      id: current._id,
                                    });
                                  },
                                },
                                {
                                  text: t('common:nav_freestyle'),
                                  icon: 'list-outline',
                                  onPress: () => {
                                    navigation.navigate('group_freestyle', {
                                      id: current._id,
                                    });
                                  },
                                },
                                {
                                  text: t('common:nav_speeddata'),
                                  icon: 'timer-outline',
                                  onPress: () => {
                                    navigation.navigate('group_speed', {
                                      id: current._id,
                                    });
                                  },
                                },
                                {
                                  text: 'Mitglieder bearbeiten',
                                  icon: 'people-outline',
                                  onPress: () => {
                                    navigation.navigate(
                                      'group_settings_users',
                                      {
                                        id: current._id,
                                      },
                                    );
                                  },
                                },
                                {
                                  text: 'Daten bearbeiten',
                                  icon: 'create-outline',
                                  onPress: () => {
                                    navigation.navigate('group_settings_data', {
                                      id: current._id,
                                    });
                                  },
                                },
                                {
                                  text: 'Verlassen',
                                  icon: 'log-out-outline',
                                  onPress: () => {
                                    GroupsService.leaveGroup(current._id).then(
                                      () => {
                                        onRefresh();
                                        bottomSheetRef.current?.close();
                                      },
                                    );
                                  },
                                },
                              ]
                            : []),
                        ]
                      : [
                          ...(current.coaches.some(
                            (i: any) => i._id === user.id,
                          )
                            ? [
                                {
                                  text: t('common:nav_player'),
                                  icon: 'musical-notes-outline',
                                  onPress: () => {
                                    navigation.navigate('team_player', {
                                      id: current._id,
                                    });
                                  },
                                },
                                {
                                  text: t('common:nav_speeddata'),
                                  icon: 'timer-outline',
                                  onPress: () => {
                                    navigation.navigate('team_speed', {
                                      id: current._id,
                                    });
                                  },
                                },
                                {
                                  text: 'Mitglieder bearbeiten',
                                  icon: 'people-outline',
                                  onPress: () => {
                                    navigation.navigate('team_settings_users', {
                                      id: current._id,
                                    });
                                  },
                                },
                                {
                                  text: 'Daten bearbeiten',
                                  icon: 'create-outline',
                                  onPress: () => {
                                    navigation.navigate('team_settings_data', {
                                      id: current._id,
                                    });
                                  },
                                },
                                {
                                  text: 'Verlassen',
                                  icon: 'log-out-outline',
                                  onPress: () => {
                                    TeamService.leaveTeam(current._id).then(
                                      () => {
                                        onRefresh();
                                        bottomSheetRef.current?.close();
                                      },
                                    );
                                  },
                                },
                              ]
                            : []),
                        ]
                  }
                />
              </>
            ) : null}
          </StyledBottomSheet>
          <StyledBottomSheet
            ref={bottomSheetRefLeave}
            snapPoints={snapPointsLeave}>
            {dataClub?.data ? (
              <>
                <StyledText
                  style={{fontWeight: '900', fontSize: 24, marginBottom: 15}}>
                  Are you sure you want to leave this Club?
                </StyledText>
                <StyledButton
                  title={'Leave'}
                  onPress={() => {
                    GroupsService.leaveClub().then(() => {
                      bottomSheetRefLeave.current?.close();
                      getGroups();
                    });
                  }}
                />
              </>
            ) : null}
          </StyledBottomSheet>
        </>
      }>
      {isSuccess ? (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('club', {id: dataClub?.data?._id});
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  marginRight: 10,
                }}
                source={{uri: dataClub?.data?.logo}}
              />
              <View>
                <StyledText>{dataClub?.data?.name}</StyledText>
                <StyledShyText>
                  {(() => {
                    let tmp: string[] = [];
                    if (
                      dataClub?.data?.coaches?.some(
                        (e: any) => e._id === user.id,
                      )
                    ) {
                      tmp = [...tmp, 'Coach'];
                    }
                    if (
                      dataClub?.data?.athletes?.some(
                        (e: any) => e._id === user.id,
                      )
                    ) {
                      tmp = [...tmp, 'Athlete'];
                    }
                    if (
                      dataClub?.data?.admins?.some(
                        (e: any) => e._id === user.id,
                      )
                    ) {
                      tmp = [...tmp, 'Admin'];
                    }
                    return tmp;
                  })().join(' | ')}
                </StyledShyText>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{paddingLeft: 10}}
            onPress={() => {
              bottomSheetRefLeave.current?.snapToIndex(0);
            }}>
            <Ionicons
              size={30}
              name="ios-log-out-outline"
              color={isDarkMode ? Colors.white : Colors.black}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      {isSuccess ? (
        <FlatList
          renderItem={renderItem}
          data={[
            ...dataGroups?.data.map((e: any[]) => ({...e, group: true})),
            ...dataTeams?.data.map((e: any[]) => ({...e, team: true})),
          ]}
          refreshing={isFetching}
          onRefresh={onRefresh}
          ItemSeparatorComponent={() => (
            <StyledView
              style={{borderBottomWidth: 2, borderColor: Colors.grey}}
            />
          )}
        />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }>
          <StyledShyText style={{marginBottom: 5, fontSize: 20}}>
            {t('club_notfound')}
          </StyledShyText>
          <StyledShyText style={{marginBottom: 5, fontSize: 20}}>
            {t('club_notfound_apply')}
          </StyledShyText>
          <StyledLink
            Style={StyledShyTextStyle}
            url="mailto:myjumpdata@gmail.com">
            myjumpdata@gmail.com
          </StyledLink>
        </ScrollView>
      )}
    </Wrapper>
  );
}
