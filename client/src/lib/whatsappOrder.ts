export type WhatsAppCartLine = {
  itemName: string;
  sizeLabel: string;
  addons: Array<{ name: string }>;
  unitPrice: number;
  quantity: number;
};

export type WhatsAppOffer = "freeFries" | "potatoTen" | "fivePercent" | null;

export function buildWhatsAppOrderMessage(input: {
  cart: WhatsAppCartLine[];
  cartTotal: number;
  offer: WhatsAppOffer;
  offerDiscount: number;
  orderTotalAfterOffer: number;
  orderType: "pickup" | "delivery";
  orderNote: string;
  reference: string;
  rewardCode?: string;
}): string {
  if (!input.cart.length) return "السلام عليكم، عاوز أطلب من Rollz";

  const lines = input.cart.map((line) => (
    `${line.quantity}× ${line.itemName} (${line.sizeLabel}${line.addons.length ? ` + ${line.addons.map((addon) => addon.name).join("، ")}` : ""}) = ${line.unitPrice * line.quantity}ج`
  ));
  const serviceLine = input.orderType === "delivery" ? "طريقة الاستلام: توصيل (تأكيد التغطية على واتساب)" : "طريقة الاستلام: استلام من المطعم";
  const offerLine = input.offer === "freeFries"
    ? "عرض الويب: باكت بطاطس هدية مع الطلب"
    : input.offer === "potatoTen"
      ? `عرض الويب: خصم 10% على سندوتشات البطاطس = -${input.offerDiscount}ج`
      : input.offer === "fivePercent"
        ? `عرض الويب: خصم 5% على الطلب = -${input.offerDiscount}ج`
        : "";
  const noteLine = input.orderNote.trim() ? `ملاحظات: ${input.orderNote.trim()}` : "";
  const rewardLine = input.rewardCode
    ? `كود عرض Rollz ٥٪: ${input.rewardCode}\nبرجاء اعتماد الكود بعد تأكيد الطلب؛ بجمع ٥ أكواد معتمدة في نفس الشهر أحصل على برجر لحمة.`
    : "";

  return [
    "السلام عليكم، عاوز أطلب من Rollz:",
    lines.join("\n"),
    `الإجمالي قبل العرض: ${input.cartTotal}ج${offerLine ? `\n${offerLine}\nالإجمالي بعد العرض: ${input.orderTotalAfterOffer}ج` : ""}`,
    serviceLine,
    noteLine,
    `رقم متابعة الطلب: ${input.reference}`,
    rewardLine,
  ].filter(Boolean).join("\n");
}
