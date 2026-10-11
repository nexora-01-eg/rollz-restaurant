import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, CircleAlert, Loader2, LogIn, RotateCcw, ShieldCheck, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

const stateCopy = {
  issued: "بانتظار تأكيد واتساب",
  verified: "تم الاعتماد",
  redeemed: "استُبدل",
  revoked: "مُلغى",
} as const;

function readableDate(value: Date | string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Cairo",
  }).format(new Date(value));
}

export default function RewardsAdmin() {
  const { user, loading } = useAuth();
  const [lookupCode, setLookupCode] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const isOwner = user?.role === "admin";
  const utils = trpc.useUtils();
  const codesQuery = trpc.rewards.adminList.useQuery(undefined, { enabled: isOwner, retry: false });
  const verifyMutation = trpc.rewards.adminVerify.useMutation({
    onSuccess: async (result) => {
      setNotice(result.success ? (result.alreadyVerified ? "الكود معتمد بالفعل." : "تم اعتماد الكود وربطه بسجل المكافآت.") : result.reason);
      setLookupCode("");
      await utils.rewards.adminList.invalidate();
    },
    onError: () => setNotice("تعذر اعتماد الكود الآن. أعد المحاولة."),
  });
  const revokeMutation = trpc.rewards.adminRevoke.useMutation({
    onSuccess: async (result) => {
      setNotice(result.success ? "تم إلغاء الكود." : result.reason);
      await utils.rewards.adminList.invalidate();
    },
    onError: () => setNotice("تعذر إلغاء الكود الآن. أعد المحاولة."),
  });

  const issuedCodes = useMemo(() => codesQuery.data?.filter((code) => code.status === "issued") ?? [], [codesQuery.data]);
  const actionPending = verifyMutation.isPending || revokeMutation.isPending;

  const approveLookup = () => {
    const code = lookupCode.trim().toUpperCase();
    if (!code) {
      setNotice("ألصق كود العرض أولاً.");
      return;
    }
    verifyMutation.mutate({ code });
  };

  if (loading) {
    return <main className="staff-access-page"><Loader2 className="spin" size={30} /><p>جارٍ التحقق من صلاحية الدخول…</p></main>;
  }

  if (!user) {
    return (
      <main className="staff-access-page">
        <div className="staff-access-card">
          <ShieldCheck size={34} aria-hidden="true" />
          <p className="eyebrow">ROLLZ · STAFF ONLY</p>
          <h1>اعتماد أكواد العروض</h1>
          <p>هذه الشاشة داخلية. سجّل دخولك بحساب مالك الموقع أولاً لاعتماد كود العميل بعد تأكيد طلبه على واتساب.</p>
          <button type="button" className="staff-primary" onClick={startLogin}><LogIn size={18} /> تسجيل الدخول</button>
          <a href="/">العودة إلى الموقع</a>
        </div>
      </main>
    );
  }

  if (!isOwner) {
    return (
      <main className="staff-access-page">
        <div className="staff-access-card staff-denied">
          <CircleAlert size={34} aria-hidden="true" />
          <p className="eyebrow">ACCESS RESTRICTED</p>
          <h1>هذه الشاشة لمالك Rollz فقط</h1>
          <p>لا تُعرض بيانات الأكواد أو إجراءات الاعتماد إلا للحساب المعيّن كمسؤول عن هذا الموقع.</p>
          <a href="/">العودة إلى الموقع</a>
        </div>
      </main>
    );
  }

  return (
    <main className="staff-console" dir="rtl">
      <header className="staff-console-header">
        <a className="staff-back" href="/">← الموقع</a>
        <div><p className="eyebrow">ROLLZ · CODE CONTROL</p><h1>اعتماد مكافآت واتساب</h1></div>
        <span className="staff-owner"><ShieldCheck size={16} /> مالك الموقع</span>
      </header>

      <section className="staff-verify-card" aria-labelledby="verify-code-title">
        <div><p className="eyebrow">الخطوة بعد تأكيد الطلب</p><h2 id="verify-code-title">اعتمد كود العميل</h2><p>راجع الطلب على واتساب أولاً، ثم ألصق كود <b>RZ-5</b> لتتحول المكافأة إلى «معتمدة» ضمن تجميع العميل الشهري.</p></div>
        <div className="staff-verify-form">
          <label htmlFor="reward-code">كود العرض</label>
          <div><input id="reward-code" value={lookupCode} onChange={(event) => setLookupCode(event.target.value.toUpperCase())} placeholder="RZ-5-XXXX-XXXX-XXXX" autoCapitalize="characters" /><button type="button" className="staff-primary" disabled={actionPending} onClick={approveLookup}>{verifyMutation.isPending ? <Loader2 className="spin" size={17} /> : <CheckCircle2 size={17} />} اعتماد</button></div>
          {notice && <p className="staff-notice" role="status">{notice}</p>}
        </div>
      </section>

      <section className="staff-ledger" aria-labelledby="pending-title">
        <div className="staff-ledger-head"><div><p className="eyebrow">LIVE LEDGER</p><h2 id="pending-title">الأكواد الصادرة</h2></div><span>{issuedCodes.length} بانتظار الاعتماد</span></div>
        {codesQuery.isLoading ? <div className="staff-loading"><Loader2 className="spin" size={22} /> جارٍ تحميل السجل…</div> : codesQuery.error ? <div className="staff-loading">تعذر تحميل سجل الأكواد. حدّث الصفحة.</div> : !codesQuery.data?.length ? <div className="staff-loading">لا توجد أكواد صادرة حتى الآن.</div> : (
          <div className="staff-code-list">
            {codesQuery.data.map((code) => (
              <article className={`staff-code-row is-${code.status}`} key={code.code}>
                <div className="staff-code-main"><code>{code.code}</code><span>{code.kind === "burgerReward" ? "مكافأة برجر لحمة" : "مكافأة عرض ٥٪"}</span></div>
                <div className="staff-code-meta"><span>{stateCopy[code.status]}</span><small>طلب {code.orderReference} · {readableDate(code.issuedAt)}</small></div>
                <div className="staff-code-actions">
                  {code.status === "issued" && <button type="button" className="staff-icon-action approve" disabled={actionPending} onClick={() => verifyMutation.mutate({ code: code.code })} aria-label={`اعتماد ${code.code}`}><CheckCircle2 size={18} /></button>}
                  {(code.status === "issued" || code.status === "verified") && <button type="button" className="staff-icon-action revoke" disabled={actionPending} onClick={() => revokeMutation.mutate({ code: code.code })} aria-label={`إلغاء ${code.code}`}><XCircle size={18} /></button>}
                  {code.status !== "issued" && <RotateCcw size={17} aria-hidden="true" />}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
