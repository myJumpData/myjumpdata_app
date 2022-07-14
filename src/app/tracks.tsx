const TRACKS = [
  {
    id: '1',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRSS_-_30s.mp3',
    title: 'Single rope speed 30s',
    artist: 'DTB',
  },
  {
    id: '2',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRE_-_60s_1_min.mp3',
    title: 'Single rope speed 60s',
    artist: 'DTB',
  },
  {
    id: '3',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRE_-_120s_2_min.mp3',
    title: 'Single rope speed 120s',
    artist: 'DTB',
  },
  {
    id: '4',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRE_-_180s_3min.mp3',
    title: 'Single rope speed 180s',
    artist: 'DTB',
  },
  {
    id: '5',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRDU_30s.mp3',
    title: 'Single Rope Double Under 30s',
    artist: 'DTB',
  },
  {
    id: '6',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-SRSR_-_4x30s.mp3',
    title: 'Single Rope Speed Relay 4x30s',
    artist: 'DTB',
  },
  {
    id: '7',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/2016-DDSR_-_4x45s.mp3',
    title: 'Double Dutch Speed Relay 4x45s',
    artist: 'DTB',
  },
  {
    id: '8',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/Freestyle-Zeitansage__Time_Track__75_Sekunden.mp3',
    title: 'Freestyle Zeitansage 75s Time Track',
    artist: 'DTB',
  },
  {
    id: '9',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__SRSS.mp3',
    title: 'Single Rope Speed Sprint 30s',
    artist: 'IJRU',
  },
  {
    id: '10',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__SRTU.mp3',
    title: 'Single Rope Triple Unders',
    artist: 'IJRU',
  },
  {
    id: '11',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__SRDR.mp3',
    title: 'Single Rope Double Unders Relay 2x30s',
    artist: 'IJRU',
  },
  {
    id: '12',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__SRSE.mp3',
    title: 'Single Rope Speed Endurance 180s',
    artist: 'IJRU',
  },
  {
    id: '13',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__SRSR.mp3',
    title: 'Single Rope Speed Relay 4x30s',
    artist: 'IJRU',
  },
  {
    id: '14',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__DDSR.mp3',
    title: 'Double Dutch Speed Relay 4x30s',
    artist: 'IJRU',
  },
  {
    id: '15',
    url: 'https://www.dtb.de/fileadmin/user_upload/dtb.de/Sportarten/Rope_Skipping/Speed-Tracks/IJRU_Time_Tracks/_1.0.0__DDSS.mp3',
    title: 'Double Dutch Speed Sprint 60s',
    artist: 'IJRU',
  },
];

export const musicData = {
  '62d0478c5d0c851b4abee2ca': {tracks: ['1', '6', '9', '13']}, // 30s Speed
  '62d04c325d0c851b4abee2cb': {tracks: ['5', '11']}, // 30s DU
  '62d04c4a5d0c851b4abee2cc': {tracks: []}, // 30s Crosses
  '62d04d895d0c851b4abee2cd': {tracks: ['2']}, // 1m Speed
  '62d04db55d0c851b4abee2ce': {tracks: ['3']}, // 2m Speed
  '62d04ddb5d0c851b4abee2cf': {tracks: ['4', '12']}, // 3m Speed
  '62d04df05d0c851b4abee2d0': {tracks: ['10']}, // TU
  '62d050cf5d0c851b4abee2d3': {tracks: ['6', '13']}, // 4x30s Speed
  '62d051065d0c851b4abee2d4': {tracks: ['11']}, // 2x30s Double Under
  '62d051265d0c851b4abee2d5': {tracks: ['14']}, // 4x30s Double Dutch Speed
  '62d0514a5d0c851b4abee2d6': {tracks: ['15']}, // 1x1m Double Dutch Speed
};

export default TRACKS;
