import { COOKIE_NAME } from "@shared/const";
import {
  campaignWindowLabel,
  egyptMonthKey,
  getCampaignStatus,
  ROLLZ_OFFER_CAMPAIGN,
} from "../shared/rewards";
import {
  createRewardCode,
  createRewardCodeValue,
  getAllRewardCodes,
  getPendingRewardCode,
  getRewardCodesForBrowser,
  redeemVerifiedRewardCodes,
  revokeRewardCode,
  verifyRewardCode,
} from "./rewards";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const publicBrowserKeySchema = z.string().uuid();
const orderReferenceSchema = z.string().trim().min(5).max(72);

function ensureCampaignIsActive() {
  const state = getCampaignStatus();
  if (state !== "active") {
    throw new Error(state === "upcoming" ? `تبدأ عروض Rollz في ${campaignWindowLabel()}.` : "انتهت نافذة عروض Rollz الحالية.");
  }
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  rewards: router({
    campaign: publicProcedure.query(() => ({
      campaign: ROLLZ_OFFER_CAMPAIGN,
      state: getCampaignStatus(),
      windowLabel: campaignWindowLabel(),
    })),
    wallet: publicProcedure.input(z.object({ browserKey: publicBrowserKeySchema })).query(async ({ input }) => {
      const codes = await getRewardCodesForBrowser(input.browserKey);
      return { codes, monthKey: egyptMonthKey() };
    }),
    issueFivePercent: publicProcedure.input(z.object({
      browserKey: publicBrowserKeySchema,
      orderReference: orderReferenceSchema,
    })).mutation(async ({ input }) => {
      ensureCampaignIsActive();
      const pending = await getPendingRewardCode(input.browserKey);
      if (pending) return { code: pending.code, status: pending.status, reusedPending: true };

      const created = await createRewardCode({
        code: createRewardCodeValue("fivePercent"),
        browserKey: input.browserKey,
        orderReference: input.orderReference,
        kind: "fivePercent",
        monthKey: egyptMonthKey(),
      });
      if (!created) throw new Error("تعذر إصدار كود المكافأة. حاول مرة أخرى.");
      return { code: created.code, status: created.status, reusedPending: false };
    }),
    redeemFive: publicProcedure.input(z.object({
      browserKey: publicBrowserKeySchema,
      orderReference: orderReferenceSchema,
      codes: z.array(z.string().regex(/^RZ-5-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/)).length(5),
    })).mutation(async ({ input }) => {
      ensureCampaignIsActive();
      return redeemVerifiedRewardCodes({
        browserKey: input.browserKey,
        orderReference: input.orderReference,
        codes: input.codes,
        monthKey: egyptMonthKey(),
      });
    }),
    adminList: adminProcedure.query(async () => getAllRewardCodes()),
    adminVerify: adminProcedure.input(z.object({ code: z.string().trim().min(8).max(32) })).mutation(async ({ input }) => verifyRewardCode(input.code)),
    adminRevoke: adminProcedure.input(z.object({ code: z.string().trim().min(8).max(32) })).mutation(async ({ input }) => revokeRewardCode(input.code)),
  }),
});

export type AppRouter = typeof appRouter;
