import { describe, expect, it } from "vitest";
import { egyptMonthKey, getCampaignStatus, isEligibleForBurgerRedemption, type RewardRedemptionRecord } from "../shared/rewards";
import { createRewardCodeValue } from "./rewards";

describe("Rollz reward campaign rules", () => {
  it("opens only during the declared 20 August to 20 September campaign window", () => {
    expect(getCampaignStatus(new Date("2026-08-19T23:59:59+02:00"))).toBe("upcoming");
    expect(getCampaignStatus(new Date("2026-08-20T00:00:00+02:00"))).toBe("active");
    expect(getCampaignStatus(new Date("2026-09-20T23:59:59+02:00"))).toBe("active");
    expect(getCampaignStatus(new Date("2026-09-21T00:00:00+02:00"))).toBe("ended");
  });

  it("uses an Egypt-local month key for the five-code threshold", () => {
    expect(egyptMonthKey(new Date("2026-08-31T22:30:00Z"))).toBe("2026-09");
  });

  it("creates opaque, typed codes rather than predictable client-side rewards", () => {
    const first = createRewardCodeValue("fivePercent");
    const second = createRewardCodeValue("fivePercent");
    expect(first).toMatch(/^RZ-5-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/);
    expect(second).not.toBe(first);
    expect(createRewardCodeValue("burgerReward")).toMatch(/^RZ-BGR-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/);
  });

  it("requires five different verified 5% codes from the same local month", () => {
    const browserKey = "00000000-0000-4000-8000-000000000001";
    const codes: RewardRedemptionRecord[] = Array.from({ length: 5 }, (_, index) => ({
      code: `RZ-5-ABCD-EF${index}0-123${index}`,
      browserKey,
      kind: "fivePercent",
      status: "verified",
      monthKey: "2026-08",
    }));

    expect(isEligibleForBurgerRedemption(codes, browserKey, "2026-08")).toBe(true);
    expect(isEligibleForBurgerRedemption([...codes.slice(0, 4), { ...codes[4], code: codes[0].code }], browserKey, "2026-08")).toBe(false);
    expect(isEligibleForBurgerRedemption(codes.map((code, index) => index === 4 ? { ...code, status: "issued" } : code), browserKey, "2026-08")).toBe(false);
    expect(isEligibleForBurgerRedemption(codes.map((code, index) => index === 4 ? { ...code, monthKey: "2026-09" } : code), browserKey, "2026-08")).toBe(false);
  });
});
