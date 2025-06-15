const colors = [
  "#FF9AA2",
  "#FFB7B2",
  "#FFDAC1",
  "#E2F0CB",
  "#B5EAD7",
  "#C7CEEA",
  "#9FB3DF",
  "#B8B3E9",
  "#D4A5A5",
  "#9CADCE",
];

export const getProfileColor = (username: string): string => {
  // username의 각 문자를 숫자로 변환하여 합산
  const hash = username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // 합산된 값을 colors 배열의 길이로 나눈 나머지를 인덱스로 사용
  return colors[hash % colors.length];
};
