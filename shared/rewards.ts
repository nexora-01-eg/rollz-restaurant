export const ROLLZ_OFFER_CAMPAIGN = "rollz-web-2026-08-20-to-09-20";
export const ROLLZ_OFFER_START = "2026-08-20T00:00:00+02:00";
export const ROLLZ_OFFER_END = "2026-09-21T00:00:00+02:00";

export const rewardKinds = ["fivePercent", "burgerReward"] as const;
export type RewardKind = (typeof rewardKinds)[number];

export const rewardStatuses = ["issued", "verified", "redeemed", "revoked"] as const;
export type RewardStatus = (typeof rewardStatuses)[number];

export type CampaignStatus = "upcoming" | "active" | "ended";

export type RewardRedemptionRecord = {
  code: string;
  browserKey: string;
  kind: RewardKind;
  status: RewardStatus;
  monthKey: string;
};

export function getCampaignStatus(now = new Date()): CampaignStatus {
  const current = now.getTime();
  if (current < new Date(ROLLZ_OFFER_START).getTime()) return "upcoming";
  if (current >= new Date(ROLLZ_OFFER_END).getTime()) return "ended";
  return "active";
}

export function egyptMonthKey(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  return `${year ?? "0000"}-${month ?? "00"}`;
}

export function campaignWindowLabel(): string {
  return "20 أغسطس – 20 سبتمبر 2026";
}

/** True only when all five entries are distinct, staff-verified 5% rewards for one browser and Egypt-local month. */
export function isEligibleForBurgerRedemption(
  codes: RewardRedemptionRecord[],
  browserKey: string,
  monthKey: string,
): boolean {
  return codes.length === 5
    && new Set(codes.map((code) => code.code)).size === 5
    && codes.every((code) => (
      code.browserKey === browserKey
      && code.kind === "fivePercent"
      && code.status === "verified"
      && code.monthKey === monthKey
    ));
}
