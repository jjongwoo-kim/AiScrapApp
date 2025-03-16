const SCRAPS_KEY = 'SCRAPS';

export const saveScrap = (scrap) => {
  try {
    const existingScraps = localStorage.getItem(SCRAPS_KEY);
    let scraps = existingScraps ? JSON.parse(existingScraps) : [];
    scraps.push({ ...scrap, date: new Date().toISOString() });
    localStorage.setItem(SCRAPS_KEY, JSON.stringify(scraps));
  } catch (error) {
    console.error('스크랩 저장 에러: ', error);
  }
};

export const getScraps = () => {
  try {
    const existingScraps = localStorage.getItem(SCRAPS_KEY);
    return existingScraps ? JSON.parse(existingScraps) : [];
  } catch (error) {
    console.error('스크랩 읽기 에러: ', error);
    return [];
  }
};
