import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {RefreshControl} from 'react-native';
import {useQuery, useQueryClient} from 'react-query';
import {StyledButton} from '../components/StyledButton';
import {StyledHeading, StyledText} from '../components/StyledText';
import {StyledTextInput} from '../components/StyledTextInput';
import {StyledView} from '../components/StyledView';
import Wrapper from '../components/Wrapper';
import {createGroup, getClub} from '../services/groups.service';
import {createTeam} from '../services/team.service';

export default function CreateScreen({navigation}) {
  const {t} = useTranslation();
  const queryClient = useQueryClient();

  const {
    isFetching: isFetchingClub,
    data: dataClub,
    isSuccess: isSuccessClub,
    refetch: refetchClub,
  } = useQuery(['club'], async () => {
    return await getClub();
  });

  const isFetching = isFetchingClub;
  const isSuccess = isSuccessClub;

  const onRefresh = React.useCallback(() => {
    refetchClub();
  }, []);

  const [groupname, setGroupname] = React.useState<string>('');
  const [teamName, setTeamName] = React.useState<string>('');

  function handleCreateGroup() {
    if (!isSuccess) {
      return;
    }
    createGroup(groupname.trim(), dataClub?.data?._id).then(() => {
      setGroupname('');
      queryClient.invalidateQueries('groups');
      navigation.navigate('groups');
    });
  }
  function handleCreateTeam() {
    if (!isSuccess) {
      return;
    }
    createTeam(teamName.trim(), dataClub?.data?._id).then(() => {
      setTeamName('');
      queryClient.invalidateQueries('teams');
      navigation.navigate('groups');
    });
  }

  return (
    <Wrapper
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
      }>
      <StyledHeading>{t('common:create_group')}</StyledHeading>
      <StyledView
        style={{
          paddingVertical: 10,
        }}>
        <StyledText>{t('common:group_name')}:</StyledText>
        <StyledTextInput
          onChangeText={setGroupname}
          value={groupname}
          autoFocus
        />
      </StyledView>
      <StyledView
        style={{
          paddingVertical: 10,
        }}>
        <StyledButton
          title={t('common:create_group')}
          onPress={handleCreateGroup}
        />
      </StyledView>
      <StyledHeading>{t('common:create_team')}</StyledHeading>
      <StyledView
        style={{
          paddingVertical: 10,
        }}>
        <StyledText>{t('common:team_name')}:</StyledText>
        <StyledTextInput
          onChangeText={setTeamName}
          value={teamName}
          autoFocus
        />
      </StyledView>
      <StyledView
        style={{
          paddingVertical: 10,
        }}>
        <StyledButton
          title={t('common:create_team')}
          onPress={handleCreateTeam}
        />
      </StyledView>
    </Wrapper>
  );
}
