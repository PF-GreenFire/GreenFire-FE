// 멸종위기동물 9단계 등급 매핑.
// BE Tier enum과 동기화 — BE에서 받은 spark.tierCode를 그대로 키로 사용 가능.

export const TIERS = [
  { code: "BEE",             label: "꿀벌",       emoji: "🐝", threshold: 0,     blurb: "작은 발걸음이 모여 큰 변화가 됩니다." },
  { code: "SNAIL",           label: "달팽이",     emoji: "🐌", threshold: 100,   blurb: "느려도 꾸준한 보호자, 종 다양성의 한 축." },
  { code: "FIREFLY",         label: "반딧불이",   emoji: "✨", threshold: 300,   blurb: "빛공해 회복의 지표를 지키는 사람." },
  { code: "OTTER",           label: "수달",       emoji: "🦦", threshold: 700,   blurb: "한국 하천이 30년 만에 돌려준 이름." },
  { code: "CRANE",           label: "두루미",     emoji: "🕊", threshold: 1500,  blurb: "DMZ 월동지의 보존 상징." },
  { code: "WOLF",            label: "늑대",       emoji: "🐺", threshold: 3000,  blurb: "한반도 야생의 균형을 다시 그리는 보호자." },
  { code: "TIGER",           label: "호랑이",     emoji: "🐯", threshold: 6000,  blurb: "한반도 산은 100년 전 호랑이를 잃었어요." },
  { code: "EMPEROR_PENGUIN", label: "황제펭귄",   emoji: "🐧", threshold: 10000, blurb: "남극 빙하 위, 기후위기의 얼굴을 지키는 사람." },
  { code: "CORAL_REEF",      label: "산호초",     emoji: "🪸", threshold: 15000, blurb: "지구 해양 생물 4분의 1의 집을 지키는 수호자." },
];

export const TIER_BY_CODE = TIERS.reduce((acc, t) => {
  acc[t.code] = t;
  return acc;
}, {});

export const getTierByPoints = (totalSpark = 0) => {
  let current = TIERS[0];
  for (const t of TIERS) {
    if (totalSpark >= t.threshold) current = t;
  }
  return current;
};

export const getNextTier = (current) => {
  const idx = TIERS.findIndex((t) => t.code === current.code);
  if (idx < 0 || idx >= TIERS.length - 1) return null;
  return TIERS[idx + 1];
};

// 게이지 0~1
export const tierProgress = (totalSpark, current) => {
  const next = getNextTier(current);
  if (!next) return 1;
  const span = next.threshold - current.threshold;
  if (span <= 0) return 1;
  const gained = Math.max(0, totalSpark - current.threshold);
  return Math.min(1, gained / span);
};
