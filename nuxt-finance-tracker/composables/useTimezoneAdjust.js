export const useTimezoneAdjust = () => {
  // toISOString은 UTC를 기준으로 하므로 한국과 9시간 차이가 나기 때문에 날짜만 사용하더라도 문제가 생길 수 있음. 이를 보정해주기 위한 offset 계산
  // 로컬 -> UTC
  const toUTC = (date) => {
    if (!date) return null;
    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  };

  // UTC -> 로컬
  const toLocal = (date) => {
    if (!date) return null;
    const utcDate = typeof date === "string" ? new Date(date) : date;
    return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
  };

  return { toUTC, toLocal };
};
