import AsyncStorage from '@react-native-async-storage/async-storage';

const SCRAPS_KEY = 'SCRAPS';

export const saveScrap = async (scrap) => {
  try {
    const existingScraps = await AsyncStorage.getItem(SCRAPS_KEY);
    let scraps = existingScraps ? JSON.parse(existingScraps) : [];
    scraps.push({ ...scrap, date: new Date().toISOString() });
    await AsyncStorage.setItem(SCRAPS_KEY, JSON.stringify(scraps));
  } catch (error) {
    console.error('스크랩 저장 에러: ', error);
  }
};

export const getScraps = async () => {
  try {
    const existingScraps = await AsyncStorage.getItem(SCRAPS_KEY);
    return existingScraps ? JSON.parse(existingScraps) : [];
  } catch (error) {
    console.error('스크랩 읽기 에러: ', error);
    return [];
  }
};
