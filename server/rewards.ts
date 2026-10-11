import { randomBytes } from "node:crypto";
import { and, desc, eq, inArray } from "drizzle-orm";
import { offerCodes } from "../drizzle/schema";
import {
  isEligibleForBurgerRedemption,
  ROLLZ_OFFER_CAMPAIGN,
  type RewardKind,
  type RewardStatus,
} from "../shared/rewards";
import { getDb } from "./db";

type CreateRewardCodeInput = {
  code: string;
  browserKey: string;
  orderReference: string;
  kind: RewardKind;
  monthKey: string;
};

export function createRewardCodeValue(kind: RewardKind): string {
  const prefix = kind === "burgerReward" ? "RZ-BGR" : "RZ-5";
  const random = randomBytes(6).toString("hex").toUpperCase();
  return `${prefix}-${random.slice(0, 4)}-${random.slice(4, 8)}-${random.slice(8, 12)}`;
}

export async function createRewardCode(input: CreateRewardCodeInput) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات المكافآت غير متاحة حالياً.");

  await db.insert(offerCodes).values({
    code: input.code,
    campaign: ROLLZ_OFFER_CAMPAIGN,
    browserKey: input.browserKey,
    orderReference: input.orderReference,
    kind: input.kind,
    status: "issued",
    monthKey: input.monthKey,
  });

  return getRewardCode(input.code);
}

export async function getRewardCode(code: string) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات المكافآت غير متاحة حالياً.");
  const [record] = await db.select().from(offerCodes).where(eq(offerCodes.code, code)).limit(1);
  return record;
}

export async function getPendingRewardCode(browserKey: string) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات المكافآت غير متاحة حالياً.");
  const [record] = await db
    .select()
    .from(offerCodes)
    .where(and(
      eq(offerCodes.campaign, ROLLZ_OFFER_CAMPAIGN),
      eq(offerCodes.browserKey, browserKey),
      eq(offerCodes.kind, "fivePercent"),
      eq(offerCodes.status, "issued"),
    ))
    .orderBy(desc(offerCodes.issuedAt))
    .limit(1);
  return record;
}

export async function getRewardCodesForBrowser(browserKey: string) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات المكافآت غير متاحة حالياً.");
  return db
    .select()
    .from(offerCodes)
    .where(and(eq(offerCodes.campaign, ROLLZ_OFFER_CAMPAIGN), eq(offerCodes.browserKey, browserKey)))
    .orderBy(desc(offerCodes.issuedAt));
}

export async function getAllRewardCodes() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات المكافآت غير متاحة حالياً.");
  return db
    .select()
    .from(offerCodes)
    .where(eq(offerCodes.campaign, ROLLZ_OFFER_CAMPAIGN))
    .orderBy(desc(offerCodes.issuedAt));
}

export async function verifyRewardCode(code: string) {
  const record = await getRewardCode(code);
  if (!record) return { success: false as const, reason: "الكود غير موجود." };
  if (record.status === "verified") return { success: true as const, record, alreadyVerified: true };
  if (record.status !== "issued") return { success: false as const, reason: "لا يمكن اعتماد هذا الكود في حالته الحالية." };

  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات المكافآت غير متاحة حالياً.");
  await db.update(offerCodes).set({ status: "verified", verifiedAt: new Date() }).where(eq(offerCodes.code, code));
  return { success: true as const, record: await getRewardCode(code), alreadyVerified: false };
}

export async function revokeRewardCode(code: string) {
  const record = await getRewardCode(code);
  if (!record) return { success: false as const, reason: "الكود غير موجود." };
  if (record.status === "redeemed") return { success: false as const, reason: "تم استبدال هذا الكود بالفعل." };

  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات المكافآت غير متاحة حالياً.");
  await db.update(offerCodes).set({ status: "revoked" }).where(eq(offerCodes.code, code));
  return { success: true as const };
}

export async function redeemVerifiedRewardCodes(input: {
  browserKey: string;
  codes: string[];
  monthKey: string;
  orderReference: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات المكافآت غير متاحة حالياً.");
  const uniqueCodes = Array.from(new Set(input.codes));
  if (uniqueCodes.length !== 5) throw new Error("اختَر خمسة أكواد مختلفة لاستبدال المكافأة.");

  return db.transaction(async (tx) => {
    const records = await tx
      .select()
      .from(offerCodes)
      .where(and(eq(offerCodes.campaign, ROLLZ_OFFER_CAMPAIGN), inArray(offerCodes.code, uniqueCodes)));

    const allEligible = isEligibleForBurgerRedemption(records, input.browserKey, input.monthKey);

    if (!allEligible) throw new Error("الأكواد المختارة تحتاج إلى خمسة مكافآت معتمدة من نفس الشهر وعلى هذا الجهاز.");

    const rewardCode = createRewardCodeValue("burgerReward");
    const now = new Date();
    await tx.update(offerCodes).set({ status: "redeemed", redeemedAt: now }).where(inArray(offerCodes.code, uniqueCodes));
    await tx.insert(offerCodes).values({
      code: rewardCode,
      campaign: ROLLZ_OFFER_CAMPAIGN,
      browserKey: input.browserKey,
      orderReference: input.orderReference,
      kind: "burgerReward",
      status: "issued",
      monthKey: input.monthKey,
    });

    return { rewardCode, redeemedCodes: uniqueCodes };
  });
}

export function rewardStatusLabel(status: RewardStatus): string {
  return ({ issued: "في انتظار اعتماد الطلب", verified: "تم اعتماد الطلب", redeemed: "تم استبداله", revoked: "ملغي" })[status];
}
