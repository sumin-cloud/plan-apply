export const formatWon = (n: number) => `${n.toLocaleString("ko-KR")}원`;
export const formatRate = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;