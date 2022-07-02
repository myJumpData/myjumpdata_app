import BottomSheet from '@gorhom/bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import TrackPlayer from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DateInput} from '../components/Input';
import SpeedDataInput from '../components/SpeedData';
import StyledBottomSheet from '../components/StyledBottomSheet';
import {StyledText} from '../components/StyledText';
import {StyledTextInput} from '../components/StyledTextInput';
import {StyledView} from '../components/StyledView';
import Wrapper from '../components/Wrapper';
import {borderRadius, Colors} from '../Constants';
import api from '../services/api';
import PlayerService from '../services/player.service';
import TeamService from '../services/team.service';
import {musicData} from '../tracks';

export default function TeamSpeedScreen({route, navigation}) {
  const {id} = route.params;
  const isFocused = useIsFocused();

  const [date, setDate] = React.useState<Date>(new Date());

  const [refreshing, setRefreshing] = React.useState(false);

  const ResetBottomSheetRef = React.useRef<BottomSheet>(null);
  const ResetSnapPoints = React.useMemo(() => [400], []);

  const MusicBottomSheetRef = React.useRef<BottomSheet>(null);
  const MusicSnapPoints = React.useMemo(() => [500], []);

  const isDarkMode = useColorScheme() === 'dark';
  const [modal, setModal] = React.useState<any>(null);
  const [music, setMusic] = React.useState<any>(null);
  const ConfettiRef = React.useRef<any>(null);
  const [scoreDataRecords, setScoreDataRecords] = React.useState<any>([]);
  const [showResetDialog, setShowResetDialog] = React.useState<any>();
  const [teamName, setTeamName] = React.useState<any>(null);

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getData = () => {
    TeamService.getTeam(id).then((response: any) => {
      setTeamName(response.data.name);
      navigation.setOptions({title: response.data.name});
    });
    api.get('/scoredata/team/' + id).then((response: any) => {
      setScoreDataRecords(response.data);
    });
    setRefreshing(false);
  };

  React.useEffect(() => {
    if (isFocused) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {t} = useTranslation();

  return (
    <Wrapper
      outside={
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={!!modal}
            onRequestClose={() => {
              setModal(null);
            }}>
            <Pressable
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.25,
                backgroundColor: isDarkMode ? Colors.black : Colors.grey,
              }}
              onPress={() => {
                setModal(null);
              }}></Pressable>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                marginTop: 22,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}>
              <StyledView
                style={{
                  flex: 0,
                  padding: 10,
                  borderRadius: borderRadius,
                  borderWidth: 1,
                  borderColor: Colors.grey,
                  alignItems: 'center',
                }}>
                {modal ? (
                  <>
                    <StyledText style={{fontWeight: 'bold', fontSize: 24}}>
                      {modal.type}
                    </StyledText>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <StyledText style={{fontWeight: 'bold', fontSize: 24}}>
                        {modal.old}
                      </StyledText>
                      <Ionicons
                        name={
                          Number(modal.new) > Number(modal.old)
                            ? 'Ionicons/arrow-forward-outline'
                            : 'Ionicons/menu-outline'
                        }
                        size={24}
                        color={isDarkMode ? Colors.white : Colors.black}
                      />
                      <StyledText style={{fontWeight: 'bold', fontSize: 24}}>
                        {modal.new}
                      </StyledText>
                    </View>
                  </>
                ) : null}
              </StyledView>
            </View>
          </Modal>
          <ConfettiCannon
            ref={ConfettiRef}
            autoStart={false}
            count={200}
            origin={{x: -10, y: 0}}
            fadeOut={true}
          />
          <StyledBottomSheet
            ref={ResetBottomSheetRef}
            snapPoints={ResetSnapPoints}>
            {showResetDialog ? (
              <>
                <StyledText
                  style={{fontWeight: '900', fontSize: 24, marginBottom: 8}}>
                  {t('scoredata_reset_title')}
                </StyledText>
                <StyledText
                  style={{fontWeight: '900', fontSize: 24, marginBottom: 8}}>
                  {showResetDialog.type.name}
                </StyledText>
                <StyledText style={{marginBottom: 8}}>
                  {t('scoredata_reset_text')}
                </StyledText>
                <StyledText style={{fontWeight: '900', marginBottom: 16}}>
                  {t('scoredata_reset_warning')}
                </StyledText>
                <StyledTextInput
                  style={{marginBottom: 8}}
                  keyboardType="numeric"
                  onSubmitEditing={({nativeEvent, target}) => {
                    api
                      .post(`/scoredata/team/${id}/reset`, {
                        type: showResetDialog?.type._id,
                        score: Number(nativeEvent.text),
                      })
                      .then(() => {
                        target.clear();
                        getData();
                        ResetBottomSheetRef.current?.close();
                        setShowResetDialog(undefined);
                      });
                  }}
                />
              </>
            ) : null}
          </StyledBottomSheet>
          <StyledBottomSheet
            ref={MusicBottomSheetRef}
            snapPoints={MusicSnapPoints}>
            <StyledText
              style={{fontWeight: '900', fontSize: 24, marginBottom: 8}}>
              {scoreDataRecords.find((e: any) => e.value === music)?.type?.name}
            </StyledText>
            <View>
              {music
                ? PlayerService.getTracks(musicData[music].tracks).map(
                    trackData => {
                      return (
                        <Pressable
                          style={{paddingVertical: 10}}
                          key={trackData.id}
                          onPress={async () => {
                            await TrackPlayer.reset();
                            await TrackPlayer.add(trackData);
                            await TrackPlayer.play();
                            MusicBottomSheetRef.current?.close();
                          }}>
                          <StyledText style={{fontSize: 18, fontWeight: '500'}}>
                            {trackData.title}
                          </StyledText>
                          <StyledText
                            style={{fontSize: 14, color: Colors.grey}}>
                            {trackData.artist}
                          </StyledText>
                        </Pressable>
                      );
                    },
                  )
                : null}
            </View>
          </StyledBottomSheet>
        </>
      }>
      <DateInput setDate={setDate} date={date} />

      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {scoreDataRecords?.map((data: any) => {
          return (
            <SpeedDataInput
              key={data.type._id}
              name={data.type.name}
              score={data.score}
              music={
                musicData[data.type._id] &&
                musicData[data.type._id].tracks.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      setMusic(data.type._id);
                      MusicBottomSheetRef.current?.snapToIndex(0);
                    }}>
                    <Ionicons
                      color={isDarkMode ? Colors.white : Colors.black}
                      name="Ionicons/musical-notes"
                      size={24}
                    />
                  </TouchableOpacity>
                ) : null
              }
              onSubmit={({nativeEvent, target}) => {
                if (Number(nativeEvent.text) >= Number(data.score)) {
                  setModal({
                    old: data.score,
                    type: data.type.name,
                    new: Number(nativeEvent.text),
                  });
                  ConfettiRef.current?.start();
                }
                api
                  .post('/scoredata/team/' + id, {
                    score: Number(nativeEvent.text),
                    type: data.type._id,
                    date,
                  })
                  .then(() => {
                    getData();
                    target.clear();
                  });
                target.clear();
              }}
              onReset={() => {
                setShowResetDialog({
                  type: data.type,
                });
                ResetBottomSheetRef.current?.snapToIndex(0);
              }}
              counter={
                <TouchableOpacity
                  style={{marginHorizontal: 5}}
                  onPress={() => {
                    navigation.navigate('counter_popover', {
                      from: {
                        team: true,
                        type: data.type.name,
                        type_id: data.type._id,
                        name: teamName,
                        team_id: id,
                        high: data.score,
                      },
                    });
                  }}>
                  <Ionicons
                    color={isDarkMode ? Colors.white : Colors.black}
                    name="Ionicons/radio-button-on"
                    size={24}
                  />
                </TouchableOpacity>
              }
            />
          );
        })}
      </ScrollView>
    </Wrapper>
  );
}
