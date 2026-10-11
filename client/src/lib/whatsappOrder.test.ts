import { describe, expect, it } from "vitest";
import { buildWhatsAppOrderMessage } from "./whatsappOrder";

describe("Rollz WhatsApp order handoff", () => {
  it("carries the selected 5% offer, amounts, order reference, and staff-verifiable reward code", () => {
    const message = buildWhatsAppOrderMessage({
      cart: [{ itemName: "ويتش بطاطس", sizeLabel: "L", addons: [{ name: "جبنة" }], unitPrice: 60, quantity: 2 }],
      cartTotal: 120,
      offer: "fivePercent",
      offerDiscount: 6,
      orderTotalAfterOffer: 114,
      orderType: "delivery",
      orderNote: "من غير شطة",
      reference: "RZ-260816-12345",
      rewardCode: "RZ-5-ABCD-EF12-3456",
    });

    expect(message).toContain("عرض الويب: خصم 5% على الطلب = -6ج");
    expect(message).toContain("الإجمالي بعد العرض: 114ج");
    expect(message).toContain("رقم متابعة الطلب: RZ-260816-12345");
    expect(message).toContain("كود عرض Rollz ٥٪: RZ-5-ABCD-EF12-3456");
    expect(message).toContain("برجاء اعتماد الكود بعد تأكيد الطلب");
  });

  it("keeps a free-fries offer explicit without inventing a monetary discount", () => {
    const message = buildWhatsAppOrderMessage({
      cart: [{ itemName: "برجر فراخ", sizeLabel: "سنجل", addons: [], unitPrice: 45, quantity: 1 }],
      cartTotal: 45,
      offer: "freeFries",
      offerDiscount: 0,
      orderTotalAfterOffer: 45,
      orderType: "pickup",
      orderNote: "",
      reference: "RZ-260816-54321",
    });

    expect(message).toContain("عرض الويب: باكت بطاطس هدية مع الطلب");
    expect(message).toContain("الإجمالي بعد العرض: 45ج");
    expect(message).not.toContain("خصم 5%");
  });
});
