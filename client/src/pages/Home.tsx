// Street Cinema reminder: cobalt blue, Rollz saffron, asymmetric poster rhythm, Arabic-first clarity, and appetizing motion.
// Rollz style reminder: Egyptian street-poster cinema, cobalt/saffron contrast, bold Arabic hierarchy, and motion that feels playful but useful.
import { Button } from "@/components/ui/button";
import { menuCategories, menuSource, type MenuCategory, type MenuItem } from "@/lib/menu";
import { trpc } from "@/lib/trpc";
import { buildWhatsAppOrderMessage } from "@/lib/whatsappOrder";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDownLeft, ArrowUpLeft, Check, ChevronLeft, Clock3, Copy, ExternalLink, Gift, Instagram, MapPin, Menu, MessageCircle, Minus, Music2, Plus, QrCode, ShieldCheck, ShoppingBag, Star, StarOff, TicketPercent, Trash2, Truck, Trophy, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

const WHATSAPP_BASE = "https://wa.me/201098188418";
const WHATSAPP_URL = `${WHATSAPP_BASE}?text=${encodeURIComponent("السلام عليكم، عاوز أطلب من Rollz")}`;
const FACEBOOK_URL = "https://www.facebook.com/ROLLZ.shebin.elkom";
const INSTAGRAM_URL = "https://www.instagram.com/rollz.shebin.elkom";
const TIKTOK_URL = "https://www.tiktok.com/@__rollz__";
const QR_MENU_URL = "https://rollzqrmenu-jjayceny.manus.space/";
const ORDER_URL = "https://easycity.app/store?slug=rollz";
const ROLLZ_ADDRESS = "أمام ديجافو بجوار جيم النعماني، شارع الاتقان متفرع من الجلاء البحري، شبين الكوم، محافظة المنوفية";
const MAP_URL = "https://www.google.com/maps/place/ROLLZ/@30.5283284,31.0606819,13z/data=!4m6!3m5!1s0x14f7d75395c6fe33:0xd177a7bcb9340fa0!8m2!3d30.5693565!4d31.0075026!16s%2Fg%2F11k07p1ngv?entry=ttu&g_ep=EgoyMDI2MDgxNy4wIKXMDSoASAFQAw%3D%3D";
const MAP_GEOCODER_QUERY = "أمام ديجافو بجوار جيم النعماني، شارع الاتقان، شبين الكوم، المنوفية، مصر";
const HERO_VIDEO = "/manus-storage/rollz_hero_background_loop_0fb690f1.mp4";
const STORY_VIDEO = "/manus-storage/rollz-story_5324a9cf.mp4";
const HERO_IMAGE = "/manus-storage/rollz_website_hero_416eca4d.png";
const PREMIUM_IMAGE = "/manus-storage/rollz_premium_hero_01_grand_feast_f71a3b7e.png";
const THREE_D_IMAGE = "/manus-storage/rollz-3d-fries-alpha-final_6b66ecdf.png";
const ROLLZ_MARK = "/manus-storage/326371556_1258867544705718_3976620748615735002_n_e4c41ca6.jpg";
const INTRO_FOOD_ART = "/manus-storage/rollz-intro-food-art-v4_30de6371.webp";
const LOCATION_MAP_3D = "/manus-storage/rollz-3d-location-map_ee04ccf8.webp";
const LOCATION_MOTION_VIDEO = "/manus-storage/rollz-3d-location-motion_6a965463.mp4";
const CART_STORAGE_KEY = "rollz-cart-v1";
const REWARD_BROWSER_STORAGE_KEY = "rollz-reward-browser-v1";
const CAMPAIGN_END = "2026-09-21T00:00:00+02:00";
const REAL_BRANCH_ENTRANCE = "/manus-storage/rollz-real-branch-entrance_caaba6ea.webp";
const REAL_BRANCH_INTERIOR = "/manus-storage/rollz-real-branch-interior_d8726994.webp";
const REAL_BURGERS_AND_SANDWICHES = "/manus-storage/rollz-real-burgers-and-sandwiches_76b1145e.webp";
const REAL_LOADED_FRIES = "/manus-storage/rollz-real-loaded-fries_3f0ad79e.webp";
const REAL_LONG_SANDWICHES = "/manus-storage/rollz-real-long-sandwiches_7dc12bea.webp";
const REAL_SANDWICHES = "/manus-storage/rollz-real-real-sandwiches_6cab843f.webp";
const USER_INTERIOR_LOUNGE = "/manus-storage/rollz-interior-lounge_7b6edfbe.webp";
const USER_INTERIOR_DOOR = "/manus-storage/rollz-interior-door_e0018a8b.webp";
const REAL_CUSTOMER_NOTES = "/manus-storage/rollz-real-customer-notes_147f338a.png";
const DIRECTIONS_MAP = "/manus-storage/rollz-directions-map-2026_fc7fdef0.png";
const USER_BRANCH_VIDEO = "/manus-storage/rollz-branch-story_6be268c4.mp4";
const rollzMessageNotes = [
  { text: "كل ساندوتش بيتحضّر على مزاجك.", tone: "saffron" },
  { text: "بطاطس سخنة وصوصات تختارها بنفسك.", tone: "cream" },
  { text: "من شبين الكوم… لكل حد بيحب اللقمة المظبوطة.", tone: "blue" },
  { text: "استنّى طلبك وهو طالع فريش.", tone: "tomato" },
  { text: "لفّة رولز تخلي يومك ألذ.", tone: "cream" },
  { text: "أكتر من 200 ألف ساندوتش بكل حب.", tone: "saffron" },
  { text: "سبع سنين فرايز وساندوتشات على أصولها.", tone: "blue" },
  { text: "اختار، ظبّط، وابعت طلبك في رسالة واحدة.", tone: "tomato" },
] as const;
type GalleryPoster = {
  id: string;
  image: string;
  title: string;
  caption: string;
  sourceLabel: string;
  tone: "saffron" | "tomato" | "cream" | "cobalt";
};

const galleryEditorialPosters: GalleryPoster[] = [
  { id: "branch-entrance", image: REAL_BRANCH_ENTRANCE, title: "واجهة رولز", caption: "شارع الاتقان · شبين الكوم", sourceLabel: "لقطة حقيقية من المكان", tone: "saffron" },
  { id: "branch-interior", image: REAL_BRANCH_INTERIOR, title: "داخل رولز", caption: "مشهد قبل أول لقمة", sourceLabel: "لقطة حقيقية من المكان", tone: "tomato" },
  { id: "lounge", image: USER_INTERIOR_LOUNGE, title: "زاوية من الفرع", caption: "تفاصيل المكان على مزاجك", sourceLabel: "لقطة حقيقية من المكان", tone: "cream" },
  { id: "door", image: USER_INTERIOR_DOOR, title: "باب رولز", caption: "مستنيينك في شبين", sourceLabel: "لقطة حقيقية من المكان", tone: "cobalt" },
];

const galleryFoodPosters: GalleryPoster[] = menuCategories
  .flatMap((category) => category.items.map((item) => ({ item, categoryLabel: category.label })))
  .filter(({ item }, index, all) => all.findIndex((candidate) => candidate.item.image === item.image) === index)
  .map(({ item, categoryLabel }, index) => ({
    id: `food-${index}-${item.name}`,
    image: item.image,
    title: item.name,
    caption: categoryLabel,
    sourceLabel: item.imageSource === "rollz-category" ? "لقطة حقيقية للفئة" : "تكوين بصري للصنف",
    tone: item.accent,
  }));

const galleryPosters = [...galleryEditorialPosters, ...galleryFoodPosters];
const GALLERY_BATCH_SIZE = 5;
const seasonalOffers = [
  {
    id: "freeFries",
    ticket: "عرض الموقع · ٠١",
    title: "باكت بطاطس هدية",
    copy: "مع كل طلب يتبعت من الموقع خلال فترة الحملة. اختار طلبك وسجّل العرض في رسالة واتساب الجاهزة.",
    note: "طلب ويب فقط",
    tone: "saffron",
  },
  {
    id: "potatoTen",
    ticket: "ساندوتشات البطاطس · ٠٢",
    title: "خصم ١٠٪ على سندوتشات البطاطس",
    copy: "الخصم يظهر على الساندوتشات المؤهلة في السلة، ثم يُذكر بوضوح في رسالة الطلب قبل الإرسال.",
    note: "على فئة الساندوتشات",
    tone: "tomato",
  },
  {
    id: "fivePercent",
    ticket: "لقطة المكافأة · ٠٣",
    title: "خصم ٥٪ وكود مكافأة",
    copy: "خد خصم ٥٪ على طلبك، وبعد تأكيد المطعم للطلب يتحول الكود إلى نقطة. اجمع ٥ نقاط في نفس الشهر وخد برجر لحمة.",
    note: "كود موثّق",
    tone: "cream",
  },
] as const;

type OrderType = "pickup" | "delivery";
type OfferId = (typeof seasonalOffers)[number]["id"];
type CartLine = { id: string; item: MenuItem; sizeLabel: string; unitPrice: number; addons: Array<{ name: string; value: number }>; quantity: number };
type PersistedCart = { cart: CartLine[]; orderType: OrderType; orderNote: string };
type OrderConfirmation = { reference: string; itemCount: number; total: number; whatsappUrl: string };
type CartFeedback = { name: string; quantity: number };
type PriceFilter = "all" | "up-to-50" | "51-to-80" | "over-80";
type OfferCountdown = { days: string; hours: string; minutes: string; seconds: string };
type CartFlight = { id: number; image: string; name: string; startX: number; startY: number; deltaX: number; deltaY: number };
type RewardDialog = { kind: "fivePercent" | "burgerReward"; code: string; reference: string; whatsappUrl: string };

const priceFilters: Array<{ id: PriceFilter; label: string }> = [
  { id: "all", label: "كل الأسعار" },
  { id: "up-to-50", label: "لحد 50ج" },
  { id: "51-to-80", label: "من 51 إلى 80ج" },
  { id: "over-80", label: "أعلى من 80ج" },
];

function getCampaignCountdown(): OfferCountdown {
  const remaining = Math.max(0, new Date(CAMPAIGN_END).getTime() - Date.now());
  const seconds = Math.floor(remaining / 1000);
  return {
    days: String(Math.floor(seconds / 86400)).padStart(2, "0"),
    hours: String(Math.floor(seconds / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"),
    seconds: String(seconds % 60).padStart(2, "0"),
  };
}

function readRewardBrowserKey() {
  if (typeof window === "undefined") return "00000000-0000-4000-8000-000000000000";
  try {
    const saved = window.localStorage.getItem(REWARD_BROWSER_STORAGE_KEY);
    if (saved && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved)) return saved;
    const browserKey = crypto.randomUUID();
    window.localStorage.setItem(REWARD_BROWSER_STORAGE_KEY, browserKey);
    return browserKey;
  } catch {
    return crypto.randomUUID();
  }
}

function isPotatoSandwich(item: MenuItem) {
  return menuCategories.find((category) => category.id === "potato-sandwiches")?.items.some((candidate) => candidate.name === item.name) ?? false;
}

function matchesPriceFilter(item: MenuItem, filter: PriceFilter) {
  const startingPrice = Math.min(...item.prices.map((price) => price.value));
  if (filter === "up-to-50") return startingPrice <= 50;
  if (filter === "51-to-80") return startingPrice >= 51 && startingPrice <= 80;
  if (filter === "over-80") return startingPrice > 80;
  return true;
}

function isStoredCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const item = record.item as Record<string, unknown> | null;
  return typeof record.id === "string"
    && typeof record.sizeLabel === "string"
    && typeof record.unitPrice === "number"
    && Number.isFinite(record.unitPrice)
    && typeof record.quantity === "number"
    && Number.isInteger(record.quantity)
    && record.quantity > 0
    && Boolean(item && typeof item.name === "string" && typeof item.image === "string" && typeof item.note === "string")
    && Array.isArray(record.addons)
    && record.addons.every((addon) => {
      if (!addon || typeof addon !== "object") return false;
      const savedAddon = addon as Record<string, unknown>;
      return typeof savedAddon.name === "string" && typeof savedAddon.value === "number" && Number.isFinite(savedAddon.value);
    });
}

function readPersistedCart(): PersistedCart {
  const fallback: PersistedCart = { cart: [], orderType: "pickup", orderNote: "" };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return fallback;
    const stored = JSON.parse(raw) as Record<string, unknown>;
    return {
      cart: Array.isArray(stored.cart) ? stored.cart.filter(isStoredCartLine) : [],
      orderType: stored.orderType === "delivery" ? "delivery" : "pickup",
      orderNote: typeof stored.orderNote === "string" ? stored.orderNote.slice(0, 180) : "",
    };
  } catch {
    return fallback;
  }
}

function createOrderReference() {
  const day = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  return `RZ-${day}-${String(Date.now()).slice(-5)}`;
}

function itemOrderUrl(item: MenuItem) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(`السلام عليكم، عاوز أطلب ${item.name} من Rollz`)}`;
}

function handleCategoryKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const tabs = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
  if (!tabs.length) return;
  const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[nextIndex]?.focus();
  tabs[nextIndex]?.click();
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: "easeOut" } },
};

const stillReveal: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.01 } },
};

// Rollz Motion System: one visual rhythm for section reveals, navigation, cards, and feedback.
const rollzMotion = {
  easeOut: [0.23, 1, 0.32, 1] as const,
  easeInOut: [0.77, 0, 0.175, 1] as const,
  duration: { micro: 0.18, section: 0.62, drawer: 0.36, route: 0.48 },
  distance: { section: 24, card: 12 },
};

const motionNavItems: Array<{ id: MotionSectionId; label: string }> = [
  { id: "numbers", label: "أرقام" },
  { id: "story", label: "الحكاية" },
  { id: "offers", label: "العروض" },
  { id: "menu", label: "المنيو" },
  { id: "review", label: "التقييم" },
  { id: "location", label: "المكان" },
];

function getMotionSectionClass(active: boolean) {
  return `motion-section${active ? " is-active" : ""}`;
}

type MotionSectionId = "numbers" | "story" | "offers" | "menu" | "review" | "location";

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: rollzMotion.distance.section },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: rollzMotion.duration.section, ease: rollzMotion.easeOut },
  },
};

function SectionStamp({ number, children, light = false }: { number: string; children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`section-stamp ${light ? "section-stamp-light" : ""}`}>
      <span>{number}</span>
      <b>{children}</b>
    </div>
  );
}

function TicketStrip({ scene, light = false }: { scene: string; light?: boolean }) {
  return <div className={`ticket-strip ${light ? "ticket-strip-light" : ""}`}><span>رولز · شبين الكوم</span><b>{scene}</b><i>×</i></div>;
}

function PriceStrip({ prices }: { prices: MenuItem["prices"] }) {
  return (
    <div className="price-strip">
      {prices.map((price) => (
        <div className="price-block" key={`${price.label}-${price.value}`}>
          <span>{price.label}</span>
          <strong>{price.value}<small>ج</small></strong>
        </div>
      ))}
    </div>
  );
}

function MenuBubble({ item, index, onAdd }: { item: MenuItem; index: number; onAdd: (item: MenuItem) => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`menu-bubble cinema-frame bubble-${item.accent}`}
      style={{ "--tilt": `${index % 2 === 0 ? -1 : 1.15}deg` } as React.CSSProperties}
      variants={reduceMotion ? stillReveal : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      whileHover={reduceMotion ? undefined : { y: -8, rotate: 0, transition: { duration: 0.18 } }}
    >
      <div className="menu-bubble-media">
        <img src={item.image} alt={item.imageSource === "rollz-category" ? "لقطة طعام حقيقية من Rollz للفئة" : `صورة توضيحية لـ ${item.name}`} loading="lazy" decoding="async" />
        {item.imageSource === "rollz-category" && <span className="menu-bubble-real-source">لقطة حقيقية للفئة</span>}
        <span className="menu-bubble-ticket">اختيار رولز · {String(index + 1).padStart(2, "0")}</span>
        <span className="menu-bubble-scene">رولز · {String(index + 1).padStart(2, "0")}</span>
        <span className="menu-bubble-price"><b>{item.prices[0].value}</b><small>ج</small></span>
        <span className="menu-bubble-burst">لقمة<br />على مزاجك</span>
      </div>
      <div className="menu-bubble-copy">
        <div className="menu-bubble-heading">
          <h3>{item.name}</h3>
          <span className="rating-muted" title="لا يوجد تقييم منشور منفصل لهذا الصنف"><StarOff size={14} /> بلا تقييم منفصل</span>
        </div>
        <span className="menu-bubble-label">اختيار متظبط على طريقتك</span>
        <p>{item.note}</p>
        <PriceStrip prices={item.prices} />
        <div className="menu-bubble-actions">
          <motion.button className="menu-bubble-add" type="button" onClick={() => onAdd(item)} aria-label={`اختَر ${item.name} وأضفه إلى السلة`} whileTap={reduceMotion ? undefined : { scale: 0.96 }} whileHover={reduceMotion ? undefined : { y: -2 }} transition={{ duration: rollzMotion.duration.micro, ease: rollzMotion.easeOut }}><ShoppingBag size={14} /> ظبّطها وأضف</motion.button>
          <a className="menu-bubble-order" href={itemOrderUrl(item)} target="_blank" rel="noreferrer">اسأل على واتساب <MessageCircle size={14} /></a>
        </div>
      </div>
    </motion.article>
  );
}

function RollzMark({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`rollz-brand ${compact ? "rollz-brand-compact" : ""}`} href="#top" aria-label="Rollz — الصفحة الرئيسية">
      <img className="rollz-mark-image" src={ROLLZ_MARK} alt="شعار Rollz" />
    </a>
  );
}

function RollzLoadingScreen({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(onComplete, reduceMotion ? 280 : 980);
    return () => window.clearTimeout(timer);
  }, [onComplete, reduceMotion]);

  return (
    <motion.div className="rollz-loading-screen" role="status" aria-live="polite" aria-label="جارٍ تجهيز تجربة Rollz" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.01 : 0.32, ease: "easeOut" } }}>
      <div className="rollz-loading-mark-wrap">
        <motion.img className="rollz-loading-mark" src={ROLLZ_MARK} alt="شعار Rollz" initial={{ opacity: 0, scale: 0.86, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.55, ease: [0.23, 1, 0.32, 1] }} />
      </div>
      <p>بنجهّز لك أول لقمة</p>
      <span className="rollz-loading-line" aria-hidden="true"><i /></span>
    </motion.div>
  );
}

function RollzIntro({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(onComplete, reduceMotion ? 720 : 3400);
    return () => window.clearTimeout(timer);
  }, [onComplete, reduceMotion]);

  return (
    <motion.div className="rollz-intro" role="status" aria-live="polite" aria-label="مقدمة Rollz" initial={{ opacity: 1 }} exit={{ opacity: 0, y: "-8%", transition: { duration: 0.52, ease: "easeInOut" } }}>
      <div className="intro-ticket">رولز · شبين الكوم <span>×</span></div>
      <div className="intro-stage" aria-hidden="true">
        <div className="intro-sun" />
        <motion.figure className="intro-food-art" initial={{ opacity: 0, x: "-50%", y: 42, scale: .9, rotate: -3 }} animate={{ opacity: 1, x: "-50%", y: 0, scale: 1, rotate: 0 }} transition={{ duration: reduceMotion ? 0.01 : .92, delay: reduceMotion ? 0 : .18, ease: [0.23, 1, 0.32, 1] }}>
          <img src={INTRO_FOOD_ART} alt="" loading="eager" fetchPriority="high" decoding="sync" />
        </motion.figure>
        <motion.div className="intro-logo-reveal" initial={{ opacity: 0, scale: .84, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: reduceMotion ? 0.01 : .64, delay: reduceMotion ? 0 : .72, ease: [0.23, 1, 0.32, 1] }}>
          <img src={ROLLZ_MARK} alt="" />
        </motion.div>
        <motion.span className="intro-spark spark-a" animate={reduceMotion ? undefined : { y: [0, -18, 0], rotate: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}>×</motion.span>
        <motion.span className="intro-spark spark-b" animate={reduceMotion ? undefined : { y: [0, 15, 0], rotate: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4.1, ease: "easeInOut" }}>×</motion.span>
      </div>
      <motion.div className="intro-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 1.05, duration: .55 }}>
        <span>بطاطس · برجر · صوصات</span>
        <h1>هنا اللقمة<br /><em>بتلفّ صح.</em></h1>
        <p>اختارها على مزاجك، واستمتع بقرمشة تتعرف عليها من أول لقمة.</p>
      </motion.div>
      <div className="intro-progress" aria-hidden="true"><span /></div>
    </motion.div>
  );
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [savedCartState] = useState<PersistedCart>(() => readPersistedCart());
  const [rewardBrowserKey] = useState(() => readRewardBrowserKey());
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [introVisible, setIntroVisible] = useState(() => typeof window === "undefined" || window.sessionStorage.getItem("rollz-intro-seen") !== "1");
  const [activeCategory, setActiveCategory] = useState("burgers");
  const [activeSection, setActiveSection] = useState<MotionSectionId>("story");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [configureItem, setConfigureItem] = useState<MenuItem | null>(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedAddonNames, setSelectedAddonNames] = useState<string[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [orderType, setOrderType] = useState<OrderType>(savedCartState.orderType);
  const [orderNote, setOrderNote] = useState(savedCartState.orderNote);
  const [cart, setCart] = useState<CartLine[]>(savedCartState.cart);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [cartFeedback, setCartFeedback] = useState<CartFeedback | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [offerCountdown, setOfferCountdown] = useState<OfferCountdown>(() => getCampaignCountdown());
  const [cartFlight, setCartFlight] = useState<CartFlight | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<OfferId | null>(null);
  const [rewardDialog, setRewardDialog] = useState<RewardDialog | null>(null);
  const [rewardError, setRewardError] = useState<string | null>(null);
  const [galleryPage, setGalleryPage] = useState(0);
  const cartTriggerRef = useRef<HTMLButtonElement | null>(null);
  const gallerySectionRef = useRef<HTMLElement | null>(null);
  const campaignQuery = trpc.rewards.campaign.useQuery();
  const walletQuery = trpc.rewards.wallet.useQuery({ browserKey: rewardBrowserKey });
  const issueFivePercentMutation = trpc.rewards.issueFivePercent.useMutation({ onSuccess: () => walletQuery.refetch() });
  const redeemFiveMutation = trpc.rewards.redeemFive.useMutation({ onSuccess: () => walletQuery.refetch() });
  const activeMenu = useMemo<MenuCategory>(() => menuCategories.find((category) => category.id === activeCategory) ?? menuCategories[0], [activeCategory]);
  const addonItems = useMemo(() => menuCategories.find((category) => category.id === "extras")?.items ?? [], []);
  const filteredMenuItems = useMemo(() => activeMenu.items.filter((item) => matchesPriceFilter(item, priceFilter)), [activeMenu, priceFilter]);
  const revealVariants = reduceMotion ? stillReveal : fadeUp;
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const potatoSandwichSubtotal = cart.filter((line) => isPotatoSandwich(line.item)).reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const offerDiscount = selectedOffer === "potatoTen" ? Math.round(potatoSandwichSubtotal * 0.1) : selectedOffer === "fivePercent" ? Math.round(cartTotal * 0.05) : 0;
  const orderTotalAfterOffer = Math.max(0, cartTotal - offerDiscount);
  const selectedOfferDetails = seasonalOffers.find((offer) => offer.id === selectedOffer);
  const campaignIsActive = campaignQuery.data?.state === "active";
  const galleryPageCount = Math.ceil(galleryPosters.length / GALLERY_BATCH_SIZE);
  const visibleGalleryPosters = useMemo(() => {
    const start = galleryPage * GALLERY_BATCH_SIZE;
    return galleryPosters.slice(start, start + GALLERY_BATCH_SIZE);
  }, [galleryPage]);
  const verifiedMonthlyCodes = walletQuery.data?.codes.filter((code) => code.kind === "fivePercent" && code.status === "verified" && code.monthKey === walletQuery.data.monthKey) ?? [];
  const redeemableCodes = verifiedMonthlyCodes.slice(0, 5).map((code) => code.code);
  const configuredUnitPrice = useMemo(() => {
    if (!configureItem) return 0;
    const size = configureItem.prices[selectedSizeIndex] ?? configureItem.prices[0];
    const addonsTotal = addonItems
      .filter((addon) => selectedAddonNames.includes(addon.name))
      .reduce((sum, addon) => sum + addon.prices[0].value, 0);
    return size.value + addonsTotal;
  }, [addonItems, configureItem, selectedAddonNames, selectedSizeIndex]);
  const configuredTotal = configuredUnitPrice * selectedQuantity;
  const cartMessage = useMemo(() => {
    return buildWhatsAppOrderMessage({
      cart: cart.map((line) => ({ itemName: line.item.name, sizeLabel: line.sizeLabel, addons: line.addons, unitPrice: line.unitPrice, quantity: line.quantity })),
      cartTotal,
      offer: selectedOffer,
      offerDiscount,
      orderTotalAfterOffer,
      orderType,
      orderNote,
      reference: "__ORDER_REFERENCE__",
    }).replace("\nرقم متابعة الطلب: __ORDER_REFERENCE__", "");
  }, [cart, cartTotal, offerDiscount, orderNote, orderTotalAfterOffer, orderType, selectedOffer]);
  const completeIntro = useCallback(() => {
    window.sessionStorage.setItem("rollz-intro-seen", "1");
    setIntroVisible(false);
  }, []);

  const scrollToSection = useCallback((sectionId: MotionSectionId) => {
    setMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [reduceMotion]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-motion-section]"));
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const id = visible?.target.getAttribute("id") as MotionSectionId | null;
      if (id) setActiveSection(id);
    }, { rootMargin: "-22% 0px -55% 0px", threshold: [0.12, 0.35, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frameId = 0;
    const updateGalleryPage = () => {
      frameId = 0;
      const gallery = gallerySectionRef.current;
      if (!gallery) return;
      const rect = gallery.getBoundingClientRect();
      const scrollDistance = Math.max(1, gallery.offsetHeight - window.innerHeight);
      const progress = Math.min(0.999, Math.max(0, -rect.top / scrollDistance));
      const nextPage = Math.min(galleryPageCount - 1, Math.floor(progress * galleryPageCount));
      setGalleryPage((currentPage) => currentPage === nextPage ? currentPage : nextPage);
    };
    const handleScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateGalleryPage);
    };
    updateGalleryPage();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [galleryPageCount]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ cart, orderType, orderNote }));
    } catch {
      // Keeping the live cart usable matters even when browser storage is unavailable.
    }
  }, [cart, orderNote, orderType]);

  useEffect(() => {
    if (!cartFeedback) return;
    const timer = window.setTimeout(() => setCartFeedback(null), reduceMotion ? 900 : 2800);
    return () => window.clearTimeout(timer);
  }, [cartFeedback, reduceMotion]);

  useEffect(() => {
    const timer = window.setInterval(() => setOfferCountdown(getCampaignCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (rewardDialog) {
        setRewardDialog(null);
      } else if (orderConfirmation) {
        setOrderConfirmation(null);
      } else if (configureItem) {
        setConfigureItem(null);
      } else if (cartOpen) {
        setCartOpen(false);
      } else if (menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cartOpen, configureItem, menuOpen, orderConfirmation, rewardDialog]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (introVisible || cartOpen || orderConfirmation || rewardDialog) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [cartOpen, introVisible, orderConfirmation, rewardDialog]);

  const openConfigurator = (item: MenuItem) => {
    setConfigureItem(item);
    setSelectedSizeIndex(0);
    setSelectedAddonNames([]);
    setSelectedQuantity(1);
    setCartOpen(true);
  };

  const toggleAddon = (name: string) => setSelectedAddonNames((current) => current.includes(name) ? current.filter((value) => value !== name) : [...current, name]);

  const launchCartFlight = (item: MenuItem, source: HTMLButtonElement) => {
    if (reduceMotion || !cartTriggerRef.current) return;
    const sourceBox = source.getBoundingClientRect();
    const targetBox = cartTriggerRef.current.getBoundingClientRect();
    setCartFlight({
      id: Date.now(),
      image: item.image,
      name: item.name,
      startX: sourceBox.left + sourceBox.width / 2 - 24,
      startY: sourceBox.top + sourceBox.height / 2 - 24,
      deltaX: targetBox.left + targetBox.width / 2 - (sourceBox.left + sourceBox.width / 2),
      deltaY: targetBox.top + targetBox.height / 2 - (sourceBox.top + sourceBox.height / 2),
    });
  };

  const addConfiguredItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!configureItem) return;
    const size = configureItem.prices[selectedSizeIndex] ?? configureItem.prices[0];
    const addons = addonItems.filter((addon) => selectedAddonNames.includes(addon.name)).map((addon) => ({ name: addon.name, value: addon.prices[0].value }));
    const unitPrice = size.value + addons.reduce((sum, addon) => sum + addon.value, 0);
    const id = `${configureItem.name}-${size.label}-${addons.map((addon) => addon.name).join("-")}`;
    setCart((current) => {
      const existing = current.find((line) => line.id === id);
      if (existing) return current.map((line) => line.id === id ? { ...line, quantity: line.quantity + selectedQuantity } : line);
      return [...current, { id, item: configureItem, sizeLabel: size.label, unitPrice, addons, quantity: selectedQuantity }];
    });
    launchCartFlight(configureItem, event.currentTarget);
    setCartFeedback({ name: configureItem.name, quantity: selectedQuantity });
    setConfigureItem(null);
  };

  const updateLineQuantity = (id: string, delta: number) => setCart((current) => current.map((line) => line.id === id ? { ...line, quantity: Math.max(0, line.quantity + delta) } : line).filter((line) => line.quantity > 0));

  const selectOffer = (offerId: OfferId) => {
    setSelectedOffer(offerId);
    setRewardError(null);
    if (!cart.length) {
      scrollToMenu();
      return;
    }
    setCartOpen(true);
  };

  const prepareWhatsAppCheckout = async () => {
    if (!cart.length) return;
    const reference = createOrderReference();
    const message = buildWhatsAppOrderMessage({
      cart: cart.map((line) => ({ itemName: line.item.name, sizeLabel: line.sizeLabel, addons: line.addons, unitPrice: line.unitPrice, quantity: line.quantity })),
      cartTotal,
      offer: selectedOffer,
      offerDiscount,
      orderTotalAfterOffer,
      orderType,
      orderNote,
      reference,
    });
    if (selectedOffer === "fivePercent") {
      setRewardError(null);
      try {
        const issued = await issueFivePercentMutation.mutateAsync({ browserKey: rewardBrowserKey, orderReference: reference });
        const rewardMessage = buildWhatsAppOrderMessage({
          cart: cart.map((line) => ({ itemName: line.item.name, sizeLabel: line.sizeLabel, addons: line.addons, unitPrice: line.unitPrice, quantity: line.quantity })),
          cartTotal,
          offer: selectedOffer,
          offerDiscount,
          orderTotalAfterOffer,
          orderType,
          orderNote,
          reference,
          rewardCode: issued.code,
        });
        setCartOpen(false);
        setRewardDialog({ kind: "fivePercent", code: issued.code, reference, whatsappUrl: `${WHATSAPP_BASE}?text=${encodeURIComponent(rewardMessage)}` });
        return;
      } catch (error) {
        setRewardError(error instanceof Error ? error.message : "تعذر إصدار كود المكافأة الآن. حاول مرة أخرى.");
        return;
      }
    }
    setOrderConfirmation({
      reference,
      itemCount: cartCount,
      total: orderTotalAfterOffer,
      whatsappUrl: `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`,
    });
  };

  const redeemFiveCodes = async () => {
    if (redeemableCodes.length < 5) return;
    const reference = createOrderReference();
    setRewardError(null);
    try {
      const redemption = await redeemFiveMutation.mutateAsync({ browserKey: rewardBrowserKey, orderReference: reference, codes: redeemableCodes });
      const message = `السلام عليكم، عاوز أستبدل مكافأة ٥ أكواد Rollz بساندوتش برجر لحمة.\nكود الاستبدال: ${redemption.rewardCode}\nرقم متابعة الاستبدال: ${reference}`;
      setRewardDialog({ kind: "burgerReward", code: redemption.rewardCode, reference, whatsappUrl: `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}` });
    } catch (error) {
      setRewardError(error instanceof Error ? error.message : "تعذر استبدال الأكواد الآن. حاول مرة أخرى.");
    }
  };

  const scrollToMenu = () => {
    setMenuOpen(false);
    document.getElementById("menu")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  const openOrderDesk = () => {
    if (cartCount) {
      setCartOpen(true);
      return;
    }
    scrollToMenu();
  };

  const addMarker = async (map: google.maps.Map) => {
    let position: google.maps.LatLng | google.maps.LatLngLiteral = { lat: 30.5578, lng: 30.9964 };
    try {
      if (window.google?.maps?.importLibrary) {
        const geocodingLibrary = await window.google.maps.importLibrary("geocoding") as google.maps.GeocodingLibrary;
        const response = await new geocodingLibrary.Geocoder().geocode({ address: MAP_GEOCODER_QUERY });
        position = response.results[0]?.geometry.location ?? position;
      }
      map.setCenter(position);
      if (window.google?.maps?.importLibrary) {
        const markerLibrary = await window.google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        if (markerLibrary.AdvancedMarkerElement) {
          new markerLibrary.AdvancedMarkerElement({ map, position, title: "Rollz — شارع الاتقان، شبين الكوم" });
        }
      }
    } catch {
      map.setCenter(position);
      // The visual map pin label remains available as a designed fallback.
    }
  };

  const completeLoading = useCallback(() => setLoadingVisible(false), []);

  return (
    <>
      <AnimatePresence>{loadingVisible && <RollzLoadingScreen onComplete={completeLoading} />}</AnimatePresence>
      <AnimatePresence>{introVisible && !loadingVisible && <RollzIntro onComplete={completeIntro} />}</AnimatePresence>
      <div className={`site-shell${loadingVisible ? " is-loading" : " is-ready"}`} dir="rtl" id="top">
      <a className="skip-link" href="#menu">انتقل مباشرة للمنيو</a>
      <header className="nav-shell">
        <div className="nav-inner">
          <a className="nav-wordmark" href="#top" aria-label="Rollz Restaurants — الصفحة الرئيسية"><img className="nav-wordmark-seal" src={ROLLZ_MARK} alt="" /><span><b>ROLLZ</b><small>RESTAURANTS</small></span></a>
          <nav className="desktop-nav" aria-label="التنقل الرئيسي">
            {motionNavItems.map((item) => <a key={item.id} className={activeSection === item.id ? "is-active" : ""} href={`#${item.id}`} onClick={(event) => { event.preventDefault(); scrollToSection(item.id); }}>{item.label}</a>)}
          </nav>
          <div className="section-progress" aria-label="القسم الحالي"><span>أنت هنا</span><b>{motionNavItems.find((item) => item.id === activeSection)?.label ?? "رولز"}</b></div>
          <div className="nav-actions">
            <a className="nav-social nav-social-facebook" href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="Facebook"><span aria-hidden="true">f</span></a>
            <a className="nav-social" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a>
            <a className="nav-social" href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 size={17} /></a>
            <a className="nav-social nav-social-qr" href={QR_MENU_URL} target="_blank" rel="noreferrer" aria-label="افتح منيو Rollz QR"><QrCode size={16} /></a>
            <button ref={cartTriggerRef} className={`cart-trigger${cartFeedback ? " is-updated" : ""}`} type="button" onClick={() => setCartOpen(true)} aria-label={`فتح السلة، ${cartCount} أصناف`}><ShoppingBag size={17} /><span>طلباتك</span>{cartCount > 0 && <b aria-live="polite">{cartCount}</b>}</button>
            <button className="nav-order" type="button" onClick={openOrderDesk} aria-label={cartCount ? `مراجعة طلبك، ${cartCount} أصناف في السلة` : "انتقل إلى المنيو لاختيار طلبك"}><ShoppingBag size={17} /> {cartCount ? "راجع طلبك" : "اختار طلبك"}</button>
            <button className="mobile-menu-trigger" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-nav-panel" aria-label={menuOpen ? "غلق القائمة" : "فتح القائمة"}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div id="mobile-nav-panel" className="mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reduceMotion ? 0.01 : 0.22, ease: "easeOut" }}>
              {motionNavItems.map((item) => <a key={item.id} className={activeSection === item.id ? "is-active" : ""} href={`#${item.id}`} onClick={(event) => { event.preventDefault(); scrollToSection(item.id); }}>{item.label}</a>)}
              <div className="mobile-nav-socials" aria-label="تابع Rollz"><a href={FACEBOOK_URL} target="_blank" rel="noreferrer">Facebook</a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a><a href={TIKTOK_URL} target="_blank" rel="noreferrer">TikTok</a><a href={QR_MENU_URL} target="_blank" rel="noreferrer">منيو QR</a></div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="hero-section grain" aria-labelledby="hero-title">
          <div className="hero-video-layer" aria-hidden="true">
            <video autoPlay muted loop playsInline poster={HERO_IMAGE}>
              <source src={HERO_VIDEO} type="video/mp4" />
            </video>
          </div>
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-grid container">
            <motion.div className="hero-copy" initial="hidden" animate="visible" variants={fadeUp}>
              <div className="eyebrow"><span className="eyebrow-dot" /> Rollz Restaurants · فرايز وساندوتشات · شبين الكوم</div>
              <h1 id="hero-title">هنا اللقمة<br /><em>بتلفّ صح.</em></h1>
              <p className="hero-lede">بطاطس، ساندوتشات، وصوصات تختارها بطريقتك. ظبّطها من المنيو وخلي أول لقمة تقول الباقي.</p>
              <div className="hero-actions">
                <Button asChild className="cta-primary"><a href="#menu">اختار طلبك <ArrowDownLeft size={18} /></a></Button>
                <a className="cta-ghost" href={WHATSAPP_URL} target="_blank" rel="noreferrer">اسأل على واتساب <ChevronLeft size={17} /></a>
              </div>
              <div className="hero-proof">
                <span><b>22K</b> متابع على فيسبوك</span>
                <span className="proof-divider" />
                <span><b>13.2K</b> متابع على إنستجرام</span>
                <span className="proof-divider" />
                <a href={TIKTOK_URL} target="_blank" rel="noreferrer"><b>TikTok</b> تابع لقطات رولز</a>
              </div>
            </motion.div>

            <motion.div className="hero-stage" initial={{ opacity: 0, scale: 0.94, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.1, delay: 0.12 }}>
              <div className="hero-stage-backdrop"><img src={HERO_IMAGE} alt="ساندوتش وبرجر وبطاطس من Rollz" /></div>
              <div className="hero-stage-card">
                <span className="stage-label">اختيارك يستاهل</span>
                <strong>قرمشة.<br />صوص.<br /><i>رولز.</i></strong>
              </div>
              <img className="hero-3d-object" src={THREE_D_IMAGE} alt="مجسم برجر وبطاطس من Rollz" />
              <motion.div className="hero-chip chip-one" animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 5.6, ease: "easeInOut" }}>جبنة<br /><b>زيادة</b></motion.div>
              <motion.div className="hero-chip chip-two" animate={reduceMotion ? undefined : { y: [0, 10, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 6.2, ease: "easeInOut" }}>لفّها<br /><b>على مزاجك</b></motion.div>
            </motion.div>
          </div>
          <div className="hero-bottom-line container"><span>شارع الاتقان · متفرع من الجلاء البحري</span><span>كمّل المشهد <ArrowDownLeft size={15} /></span></div>
        </section>

        <div className="ticker-band" aria-hidden="true">
          <div className="ticker-track"><span>بطاطس <b>×</b> برجر <b>×</b> صوصات <b>×</b> لفّتك على مزاجك</span><span>بطاطس <b>×</b> برجر <b>×</b> صوصات <b>×</b> لفّتك على مزاجك</span></div>
        </div>

        <motion.section className="numbers-section section-cobalt grain" id="numbers" data-motion-section variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.14 }}>
          <div className="container numbers-layout">
            <TicketStrip scene="أرقام رولز" light />
            <div className="numbers-intro"><SectionStamp number="00" light>أرقام</SectionStamp><h2>200 ألف ساندوتش<br /><em>والحكاية لسه مكملة.</em></h2><p>سبع سنين بنحضر فرايز وساندوتشات على مزاج شبين الكوم. Rollz Restaurants مكملين بطعم واضح وطلبات أكتر كل يوم.</p></div>
            <div className="numbers-grid" aria-label="أرقام Rollz">
              <article><b>+200K</b><span>ساندوتش اتعمل بكل حب</span></article>
              <article><b>07</b><span>سنين خبرة في الفاست فود والفرايز</span></article>
              <article><b>22K</b><span>متابع على فيسبوك</span></article>
              <article><b>13.2K</b><span>متابع على إنستجرام</span></article>
              <article><b>8.1K</b><span>متابع على TikTok</span></article>
            </div>
            <div className="numbers-social-row"><a href={FACEBOOK_URL} target="_blank" rel="noreferrer"><span className="social-glyph">f</span> Facebook</a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={15} /> Instagram</a><a href={TIKTOK_URL} target="_blank" rel="noreferrer"><Music2 size={15} /> TikTok</a><a href={QR_MENU_URL} target="_blank" rel="noreferrer"><QrCode size={15} /> منيو QR</a></div>
          </div>
        </motion.section>

        <motion.section className={`${getMotionSectionClass(activeSection === "story")} story-section section-cream grain`} id="story" data-motion-section variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.14 }}>
          <div className="container story-grid">
            <TicketStrip scene="لقطة 01 · البداية" />
            <motion.div className="story-copy" variants={revealVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
              <SectionStamp number="01">الحكاية</SectionStamp>
              <h2>من شارع الاتقان،<br /><span>طعم رولز له بصمته.</span></h2>
              <p>اختار وجبتك، ظبّط الحجم والإضافات، وابعت طلبك في رسالة واحدة. كل التفاصيل قدامك، والسلة جاهزة عشان تختار براحتك وتوصل لطلبك من غير لفّ.</p>
              <div className="story-facts">
                <div><strong>01</strong><span>اختار الصنف<br />اللي جاي عشانه</span></div>
                <div><strong>02</strong><span>ظبّط الحجم<br />والإضافات</span></div>
                <div><strong>03</strong><span>ابعت الطلب<br />على واتساب</span></div>
              </div>
            </motion.div>
            <motion.div className="story-media" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, amount: 0.25 }}>
              <div className="story-media-frame cinema-frame"><img src={REAL_BRANCH_INTERIOR} alt="لقطة حقيقية من داخل مطعم Rollz" loading="lazy" /><span className="story-sticker">رولز<br />في<br /><b>شبين الكوم</b></span></div>
              <div className="story-caption"><span>رولز · شبين الكوم</span><span>لقطة حقيقية من المكان</span></div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section className={`${getMotionSectionClass(activeSection === "offers")} offers-section grain`} id="offers" data-motion-section aria-labelledby="offers-title" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.14 }}>
          <div className="container offers-layout">
            <TicketStrip scene="عروض الموسم" />
            <motion.div className="offers-heading" variants={revealVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
              <SectionStamp number="03">العروض</SectionStamp>
              <h2 id="offers-title">نفسك في العرض؟<br /><span>خد لقطة موثّقة.</span></h2>
              <p>من ٢٠ أغسطس إلى ٢٠ سبتمبر ٢٠٢٦، اختار عرضك من الموقع وخلي التوفير جزء من طلبك. كود خصم ٥٪ بيتفعّل بعد تأكيد المطعم لطلبك على واتساب.</p>
              <div className="offers-countdown" role="timer" aria-live="polite" aria-label={`باقي ${offerCountdown.days} يوم و${offerCountdown.hours} ساعة على نهاية العروض`}>
                <span>{campaignQuery.data?.state === "upcoming" ? "العروض تبدأ ٢٠ أغسطس" : campaignQuery.data?.state === "ended" ? "انتهت نافذة العروض" : "باقي على نهاية العروض"}</span>
                <div dir="ltr"><b>{offerCountdown.days}</b><i>:</i><b>{offerCountdown.hours}</b><i>:</i><b>{offerCountdown.minutes}</b><i>:</i><b>{offerCountdown.seconds}</b></div>
                <small>يوم : ساعة : دقيقة : ثانية</small>
              </div>
            </motion.div>
            <div className="offers-grid">
              {seasonalOffers.map((offer, index) => (
                <motion.article className={`offer-poster offer-${offer.tone}`} key={offer.id} initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24, rotate: index === 1 ? 2 : -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: reduceMotion ? 0.01 : 0.52, delay: reduceMotion ? 0 : index * 0.07 }}>
                  <div className="offer-poster-top"><span>{offer.ticket}</span><b>{String(index + 1).padStart(2, "0")}</b></div>
                  <div className="offer-poster-copy"><span className="offer-sticker">{offer.note}</span><h3>{offer.title}</h3><p>{offer.copy}</p></div>
                  <button type="button" className={`offer-poster-link${selectedOffer === offer.id ? " is-selected" : ""}`} disabled={!campaignIsActive} onClick={() => selectOffer(offer.id)}>{selectedOffer === offer.id ? "العرض مختار في سلتك" : campaignIsActive ? "اختار العرض" : "تبدأ ٢٠ أغسطس"} <TicketPercent size={16} /></button>
                </motion.article>
              ))}
            </div>
            <div className="reward-wallet" aria-live="polite">
              <div><span className="reward-wallet-kicker"><Trophy size={15} /> محفظة مكافآتك</span><h3>اجمع ٥ أكواد معتمدة.<br /><em>وخد برجر لحمة.</em></h3><p>الكود يظهر بعد اختيار عرض ٥٪ وإرسال طلبك. بعد أن يعتمد Rollz الطلب، يصبح نقطة في محفظتك على هذا الجهاز.</p></div>
              <div className="reward-progress"><span>{verifiedMonthlyCodes.length} / 5</span><div aria-label={`${verifiedMonthlyCodes.length} من 5 أكواد معتمدة`}>{[0, 1, 2, 3, 4].map((index) => <i key={index} className={verifiedMonthlyCodes[index] ? "is-filled" : ""}>{verifiedMonthlyCodes[index] ? <Check size={14} /> : index + 1}</i>)}</div><button type="button" disabled={redeemableCodes.length < 5 || redeemFiveMutation.isPending} onClick={redeemFiveCodes}>{redeemFiveMutation.isPending ? "جاري تجهيز المكافأة…" : "استبدل ٥ أكواد"} <Gift size={16} /></button></div>
            </div>
            {rewardError && <p className="reward-error" role="alert">{rewardError}</p>}
            <p className="offers-disclaimer"><ShieldCheck size={15} /> لا يُعتمد كود ٥٪ تلقائياً: أكّد طلبك على واتساب واحتفظ بالكود حتى يظهر في المحفظة كـ«تم اعتماد الطلب».</p>
          </div>
        </motion.section>

        <motion.section ref={gallerySectionRef} className="real-cuts-section section-cream motion-section" aria-labelledby="real-cuts-title" data-motion-section id="real-cuts">
          <div className="real-cuts-scroll-rail">
            <div className="real-cuts-stage">
              <div className="container real-cuts-layout">
                <TicketStrip scene="بوسترات من رولز" />
                <div className="real-cuts-heading"><SectionStamp number="04">ريل رولز</SectionStamp><h2 id="real-cuts-title">كل نزلة.<br /><span>لقطات جديدة.</span></h2><p>مش صور خام: كل لقطة متاخدة كأنها بوستر شارع. كمّل التمرير وشوف خمس مشاهد جديدة في كل فصل من الريل.</p></div>
                <div className="poster-gallery-status" aria-label={`الفصل ${galleryPage + 1} من ${galleryPageCount}`}><span>ريل متحرك</span><b>{String(galleryPage + 1).padStart(2, "0")} / {String(galleryPageCount).padStart(2, "0")}</b><i /></div>
                <div className="poster-gallery" aria-label="معرض بوسترات Rollz المتجدد أثناء التمرير">
                  <AnimatePresence mode="wait" initial={false}>
                    {visibleGalleryPosters.map((poster, index) => (
                      <motion.figure className={`poster-card poster-card-${poster.tone}`} key={`${galleryPage}-${poster.id}`} initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20, scale: .97, rotate: index % 2 ? 1.5 : -1.5 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -16, scale: 1.02 }} transition={{ duration: reduceMotion ? .01 : .42, delay: reduceMotion ? 0 : index * .055, ease: rollzMotion.easeOut }}>
                        <img src={poster.image} alt={poster.title} loading="lazy" decoding="async" />
                        <span className="poster-halftone" aria-hidden="true" />
                        <span className="poster-index">{String(galleryPage * GALLERY_BATCH_SIZE + index + 1).padStart(2, "0")}</span>
                        <span className="poster-source">{poster.sourceLabel}</span>
                        <figcaption><small>{poster.caption}</small><strong>{poster.title}</strong><i>ROLLZ / STREET CINEMA</i></figcaption>
                      </motion.figure>
                    ))}
                  </AnimatePresence>
                </div>
                <p className="poster-gallery-hint"><span>↓</span> كل ما تكمل تمرير، الريل يفتح مجموعة بوسترات جديدة.</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section className={`${getMotionSectionClass(activeSection === "menu")} menu-section section-cobalt grain`} id="menu" data-motion-section variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }}>
          <div className="container">
            <TicketStrip scene="اختياراتك تبدأ هنا" light />
            <motion.div className="section-heading section-heading-light" variants={revealVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
              <div className="menu-heading-lockup"><div><SectionStamp number="02" light>قائمة رولز</SectionStamp><h2>اختار اللي على مزاجك.<br /><em>ورولز يظبطهالك.</em></h2></div></div>
              <p>برجر، ساندوتشات بطاطس، أطباق، سناكس وإضافات. اختار حجمك، زوّد اللي بتحبه، وشوف السعر النهائي قبل ما تثبّت طلبك.</p>
            </motion.div>
            <div className="menu-tabs" role="tablist" aria-label="فئات المنيو">
              {menuCategories.map((category, index) => (
                <button key={category.id} id={`menu-tab-${category.id}`} role="tab" aria-selected={activeCategory === category.id} aria-controls="menu-panel" tabIndex={activeCategory === category.id ? 0 : -1} className={`menu-tab ${activeCategory === category.id ? "is-active" : ""}`} onClick={() => setActiveCategory(category.id)} onKeyDown={(event) => handleCategoryKeyDown(event, index)}>{category.label}<small>{String(category.items.length).padStart(2, "0")}</small></button>
              ))}
            </div>
            <div className="menu-price-filters" role="group" aria-label="تصفية المنيو حسب السعر">
              <span>فلتر السعر</span>
              <div>{priceFilters.map((filter) => <button type="button" key={filter.id} className={priceFilter === filter.id ? "is-active" : ""} aria-pressed={priceFilter === filter.id} onClick={() => setPriceFilter(filter.id)}>{filter.label}</button>)}</div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={`${activeMenu.id}-${priceFilter}`} id="menu-panel" role="tabpanel" aria-labelledby={`menu-tab-${activeMenu.id}`} aria-live="polite" className="menu-view" initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }} transition={{ duration: reduceMotion ? 0.01 : 0.32 }}>
                <div className="menu-view-intro"><span>{activeMenu.kicker}</span><p>{activeMenu.intro}</p><b>{String(filteredMenuItems.length).padStart(2, "0")} من {String(activeMenu.items.length).padStart(2, "0")} صنف</b></div>
                {filteredMenuItems.length ? <div className="menu-bubble-grid">{filteredMenuItems.map((item, index) => <MenuBubble item={item} index={index} key={item.name} onAdd={openConfigurator} />)}</div> : <div className="menu-filter-empty"><ShoppingBag size={22} /><h3>لسه ما لقيتش طلبك؟</h3><p>وسّع الاختيار وشوف كل الأصناف المتاحة من رولز.</p><button type="button" onClick={() => setPriceFilter("all")}>شوف كل الأسعار</button></div>}
              </motion.div>
            </AnimatePresence>
            <div className="menu-source-row"><span><ShieldCheck size={16} /> بيانات الأسعار من صورة المنيو الأصلية</span><a href={menuSource} target="_blank" rel="noreferrer">افتح صورة المنيو <ExternalLink size={15} /></a></div>
          </div>
        </motion.section>

        <motion.section className="three-d-section section-cream motion-section" id="3d" data-motion-section variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }}>
          <div className="container three-d-grid">
            <TicketStrip scene="شكل يفتح النفس" />
            <motion.div className="three-d-scene" initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} viewport={{ once: true, amount: 0.25 }}>
              <div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit-dot dot-a" /><div className="orbit-dot dot-b" /><img src={THREE_D_IMAGE} alt="مجسم برجر وبطاطس من Rollz" />
              <div className="three-d-tag"><span>مشهد من رولز</span><b>قرمشة<br />تتكرر</b></div>
            </motion.div>
            <motion.div className="three-d-copy" variants={revealVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
              <SectionStamp number="03">المجسم</SectionStamp>
              <h2>شكل يفتح النفس،<br /><span>وطعم يكمل الحكاية.</span></h2>
              <p>لقطة من عالم Rollz تجمع القرمشة والساندوتش في مشهد واحد. شوف المنيو واختار وجبتك بالطريقة اللي تحبها.</p>
              <a className="text-link" href="#menu">ادخل على المنيو <ArrowDownLeft size={16} /></a>
            </motion.div>
          </div>
        </motion.section>

        <motion.section className={`${getMotionSectionClass(activeSection === "review")} review-section section-cobalt`} id="review" data-motion-section variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.14 }}>
          <div className="container notes-review-layout">
            <TicketStrip scene="رسائل من رولز" light />
            <div className="notes-review-heading"><SectionStamp number="05" light>رسائل رولز</SectionStamp><h2>كلام من رولز.<br /><em>للي بيحبوا اللقمة المظبوطة.</em></h2><p>لوح رسائل من فريق Rollz Restaurants: تفاصيل صغيرة مننا ليك قبل ما تختار طلبك.</p></div>
            <motion.div className="rollz-whiteboard cinema-frame" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.72 }} viewport={{ once: true, amount: 0.22 }} aria-label="لوحة رسائل من فريق Rollz">
              <div className="whiteboard-header"><div><img src={ROLLZ_MARK} alt="شعار Rollz" /><span><b>لوحة Rollz</b><small>FRIES · SANDWICH · GOOD MOOD</small></span></div><em>مننا ليكم</em></div>
              <div className="whiteboard-notes">{rollzMessageNotes.map((note, index) => <article key={note.text} className={`whiteboard-note is-${note.tone}`} style={{ "--note-rotate": `${[-3, 2, -1, 3, 1, -2, 2, -3][index]}deg` } as React.CSSProperties}>{note.text}</article>)}</div>
              <div className="whiteboard-doodles" aria-hidden="true"><span>200K+</span><i>✦</i><b>ROLLZ<br />SHEBIN</b></div>
              <div className="whiteboard-footer"><span>رسائل من فريق Rollz Restaurants</span><b>سندوتشات تتعمل بحب</b></div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="moments-section section-cobalt motion-section" id="moments" data-motion-section variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.14 }}>
          <div className="container moments-grid">
            <TicketStrip scene="أجواء رولز" light />
            <div className="moments-copy"><SectionStamp number="06" light>أجواء رولز</SectionStamp><h2>لقطة تفتح النفس.<br /><em>وصوص يكملها.</em></h2><p>من أول رسالة واتساب إلى لحظة الاستلام، طلبك يمشي في خطوات واضحة. شوف لقطات حقيقية من الفرع، وتابع Rollz Restaurants على المنصات الرسمية.</p><div className="moments-links"><a className="text-link text-link-light" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">تابع رولز على إنستجرام <Instagram size={16} /></a><a className="text-link text-link-light" href={QR_MENU_URL} target="_blank" rel="noreferrer">افتح منيو QR <QrCode size={16} /></a></div></div>
            <div className="film-frame cinema-frame"><video autoPlay muted loop playsInline poster={USER_INTERIOR_LOUNGE}><source src={USER_BRANCH_VIDEO} type="video/mp4" /></video><span className="film-frame-label">لقطة حقيقية من Rollz</span></div>
          </div>
        </motion.section>

        <motion.section className={`${getMotionSectionClass(activeSection === "location")} location-section section-cream`} id="location" data-motion-section variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.14 }}>
          <div className="container location-grid">
            <TicketStrip scene="مستنيينك في شبين" />
            <motion.div className="location-copy" variants={revealVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
              <SectionStamp number="06">المكان</SectionStamp>
              <h2>لفّتك وصلت.<br /><span>ومكاننا أوضح.</span></h2>
              <p>هتلاقينا أمام ديجافو بجوار جيم النعماني، في شارع الاتقان المتفرع من الجلاء البحري. افتح الاتجاهات قبل ما تتحرك، أو ابعت طلبك في رسالة مباشرة.</p>
              <div className="address-card"><MapPin size={20} /><div><strong>رولز · شبين الكوم</strong><span>{ROLLZ_ADDRESS}</span></div></div>
              <div className="service-cards" aria-label="معلومات الزيارة والطلب"><div className="service-card"><Clock3 size={19} /><div><span>المواعيد</span><strong>مفتوح دائماً</strong><span>المواعيد المعلنة على صفحة المطعم</span></div></div><div className="service-card"><Truck size={19} /><div><span>التوصيل</span><strong>اسألنا على واتساب</strong><small>تأكيد التغطية حسب منطقتك</small></div></div></div>
              <div className="location-actions"><Button asChild className="cta-primary"><a href={MAP_URL} target="_blank" rel="noreferrer">افتح الاتجاهات <MapPin size={17} /></a></Button><a className="location-phone" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle size={17} /> راسلنا على واتساب</a></div>
            </motion.div>
            <div className="location-visual-stack">
              <motion.div className="location-motion-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.68 }} viewport={{ once: true, amount: 0.22 }} aria-label="موشن جرافيك لموقع Rollz">
                <video autoPlay={!reduceMotion} muted loop={!reduceMotion} playsInline preload="metadata" poster={LOCATION_MAP_3D} aria-hidden="true"><source src={LOCATION_MOTION_VIDEO} type="video/mp4" /></video>
                <span className="location-motion-shade" aria-hidden="true" />
                <span className="location-motion-grid" aria-hidden="true" />
                <div className="location-motion-caption"><span>ROLLZ · CITY MOTION</span><b>طريقك لرولز</b><small>خريطة مرئية — المعلومات الرسمية بالأسفل</small></div>
                <span className="location-motion-status"><i /> LIVE · SHEBIN EL KOM</span>
              </motion.div>
              <motion.a className="map-card cinema-frame rollz-map-visual rollz-3d-map" href={MAP_URL} target="_blank" rel="noreferrer" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.8, delay: reduceMotion ? 0 : 0.08 }} viewport={{ once: true, amount: 0.25 }} aria-label="افتح اتجاهات Rollz على Google Maps">
                <img src={LOCATION_MAP_3D} alt="خريطة ثلاثية الأبعاد توضح موقع Rollz في شارع الاتقان، شبين الكوم" loading="lazy" />
                <span className="map-grain" aria-hidden="true" />
                <span className="map-topography" aria-hidden="true" />
                <span className="map-scan-line" aria-hidden="true" />
                <div className="map-location-hud" aria-hidden="true"><span>ROLLZ CITY GUIDE</span><b>دليل الوصول</b><small>شارع الاتقان · شبين الكوم</small></div>
                <span className="map-compass" aria-hidden="true"><b>ش</b><i>↑</i></span>
                <svg className="map-route-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path className="map-route map-route-main" d="M 9 79 C 22 69, 33 66, 49 54" />
                  <path className="map-route map-route-east" d="M 91 34 C 74 39, 65 43, 51 54" />
                  <path className="map-route map-route-north" d="M 52 7 C 51 22, 50 36, 50 54" />
                  <circle className="map-node node-west" cx="18" cy="73" r="1.25" />
                  <circle className="map-node node-east" cx="82" cy="37" r="1.25" />
                  <circle className="map-node node-north" cx="52" cy="16" r="1.25" />
                </svg>
                <span className="map-route-label route-label-west">شارع الجلاء البحري</span>
                <span className="map-route-label route-label-east">مدخل شبين الكوم</span>
                <span className="map-route-label route-label-north">طريقك لرولز</span>
                <span className="map-landmark landmark-dejavu"><i>◆</i> ديجافو</span>
                <span className="map-landmark landmark-gym"><i>✦</i> جيم النعماني</span>
                <span className="rollz-location-pin" aria-hidden="true"><span className="pin-pulse" /><img src={ROLLZ_MARK} alt="" /><b>ROLLZ</b><small>شارع الاتقان</small></span>
                <div className="map-pin-label"><span /><b>وصلت لرولز</b><small>أمام ديجافو · جنب جيم النعماني</small></div>
                <span className="map-route-legend" aria-hidden="true"><i /> مسار وصول مباشر</span>
                <span className="map-directions-cta">افتح الاتجاهات <ArrowUpLeft size={16} /></span>
              </motion.a>
            </div>
          </div>
        </motion.section>

        <section className="order-section">
          <div className="container order-banner"><div><span className="eyebrow"><span className="eyebrow-dot" /> سلة واضحة · رسالة واحدة</span><h2>{cartCount ? "طلبك اتجمع؟" : "اختيارك جاهز؟"}<br /><span>{cartCount ? "راجعه قبل الإرسال." : "ثبّته مع Rollz."}</span></h2></div><button type="button" onClick={openOrderDesk} className="order-circle"><img className="order-seal" src={ROLLZ_MARK} alt="" /><span>{cartCount ? <>راجع<br />طلبك</> : <>ابدأ<br />طلبك</>}</span><ArrowUpLeft size={19} /></button></div>
        </section>
      </main>

      <AnimatePresence>
        {cartOpen && (
          <motion.div className="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.22 }} onClick={() => setCartOpen(false)}>
            <motion.aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" initial={{ x: "100%", opacity: 0.96 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0.96 }} transition={{ duration: reduceMotion ? 0.01 : 0.34, ease: [0.23, 1, 0.32, 1] }} onClick={(event) => event.stopPropagation()}>
              <div className="cart-drawer-header"><div><span>سلتك في مكانها</span><h2 id="cart-title">ظبّط طلبك على مزاجك</h2>{cart.length > 0 && <small className="cart-storage-note">السلة محفوظة تلقائياً على جهازك</small>}</div><button type="button" className="cart-close" onClick={() => setCartOpen(false)} aria-label="غلق السلة"><X size={20} /></button></div>
              {configureItem ? (
                <div className="cart-config">
                  <div className="cart-config-hero"><img src={configureItem.image} alt={`صورة توضيحية لـ ${configureItem.name}`} /><div><span>تفاصيل اختيارك</span><h3>{configureItem.name}</h3><p>{configureItem.note}</p></div></div>
                  <div className="cart-config-block"><h4>اختار الحجم</h4><div className="cart-option-grid">{configureItem.prices.map((price, index) => <button type="button" key={`${price.label}-${price.value}`} className={selectedSizeIndex === index ? "is-selected" : ""} aria-pressed={selectedSizeIndex === index} onClick={() => setSelectedSizeIndex(index)}><span>{price.label}</span><b>{price.value}ج</b></button>)}</div></div>
                  <div className="cart-config-block"><h4>كمّلها بإضافاتك</h4><div className="cart-addon-list">{addonItems.map((addon) => <button type="button" key={addon.name} className={selectedAddonNames.includes(addon.name) ? "is-selected" : ""} aria-pressed={selectedAddonNames.includes(addon.name)} onClick={() => toggleAddon(addon.name)}><span>{selectedAddonNames.includes(addon.name) ? <Check size={14} /> : <Plus size={14} />}{addon.name}</span><b>+{addon.prices[0].value}ج</b></button>)}</div></div>
                  <div className="cart-config-total" aria-live="polite"><span>إجمالي اختيارك</span><strong>{configuredTotal}ج</strong></div>
                  <div className="cart-config-footer"><div className="quantity-stepper"><button type="button" onClick={() => setSelectedQuantity((value) => Math.max(1, value - 1))} aria-label="تقليل الكمية"><Minus size={15} /></button><b>{selectedQuantity}</b><button type="button" onClick={() => setSelectedQuantity((value) => value + 1)} aria-label="زيادة الكمية"><Plus size={15} /></button></div><button type="button" className="cart-confirm" onClick={addConfiguredItem}><span>ثبّت في السلة</span><b>{configuredTotal}ج</b><ShoppingBag size={16} /></button></div>
                  <button type="button" className="cart-back" onClick={() => setConfigureItem(null)}>رجوع للطلب</button>
                </div>
              ) : cart.length === 0 ? (
                <div className="cart-empty"><ShoppingBag size={30} /><h3>لسه مفيش حاجة هنا</h3><p>اختار اللي نفسك فيه من المنيو، حدّد الحجم والإضافات، وخلي طلبك جاهز للمراجعة.</p><button type="button" onClick={() => { setCartOpen(false); scrollToMenu(); }}>ابدأ من المنيو <ArrowDownLeft size={15} /></button></div>
              ) : (
                <div className="cart-content">
                  <div className="cart-lines">{cart.map((line) => <div className="cart-line" key={line.id}><img src={line.item.image} alt="" /><div className="cart-line-info"><h3>{line.item.name}</h3><span>{line.sizeLabel}{line.addons.length ? ` · ${line.addons.map((addon) => addon.name).join("، ")}` : ""}</span><strong>{line.unitPrice * line.quantity}ج</strong></div><div className="cart-line-actions"><div><button type="button" onClick={() => updateLineQuantity(line.id, -1)} aria-label={`تقليل كمية ${line.item.name}`}><Minus size={13} /></button><b>{line.quantity}</b><button type="button" onClick={() => updateLineQuantity(line.id, 1)} aria-label={`زيادة كمية ${line.item.name}`}><Plus size={13} /></button></div><button type="button" onClick={() => setCart((current) => current.filter((value) => value.id !== line.id))} aria-label={`حذف ${line.item.name}`}><Trash2 size={14} /></button></div></div>)}</div>
                  <div className="cart-order-options" aria-label="طريقة الاستلام"><span>تحب تستلم طلبك إزاي؟</span><div><button type="button" aria-pressed={orderType === "pickup"} className={orderType === "pickup" ? "is-selected" : ""} onClick={() => setOrderType("pickup")}>استلام من المطعم</button><button type="button" aria-pressed={orderType === "delivery"} className={orderType === "delivery" ? "is-selected" : ""} onClick={() => setOrderType("delivery")}>توصيل <small>يُؤكَّد على واتساب</small></button></div>{orderType === "delivery" && <p className="cart-delivery-hint"><Truck size={14} /> اكتب منطقتك في الملاحظة لتأكيد التغطية قبل إرسال الرسالة.</p>}</div>
                  <div className="cart-note"><label htmlFor="order-note">ملاحظاتك للطلب <span>اختيارية</span></label><textarea id="order-note" value={orderNote} onChange={(event) => setOrderNote(event.target.value)} maxLength={180} rows={3} placeholder={orderType === "delivery" ? "اكتب منطقتك وأي ملاحظة للطلب…" : "مثلاً: بدون صوص أو إضافة جبنة…"} /></div>
                  {selectedOfferDetails && <div className="cart-active-offer"><TicketPercent size={16} /><div><b>{selectedOfferDetails.title}</b><span>{selectedOffer === "freeFries" ? "تُذكر الهدية في رسالة طلبك" : `توفير ظاهر: ${offerDiscount}ج`}</span></div><button type="button" onClick={() => setSelectedOffer(null)} aria-label="إزالة العرض"><X size={15} /></button></div>}
                  {rewardError && <p className="reward-error" role="alert">{rewardError}</p>}
                  <div className="cart-summary"><div><span>{selectedOffer ? "الإجمالي بعد العرض" : "إجمالي الطلب"}</span>{selectedOffer && <small>قبل العرض {cartTotal}ج</small>}<strong>{orderTotalAfterOffer}ج</strong></div><button type="button" className="cart-checkout" disabled={issueFivePercentMutation.isPending} onClick={prepareWhatsAppCheckout}>{issueFivePercentMutation.isPending ? "جاري تجهيز الكود…" : "راجع الطلب على واتساب"} <MessageCircle size={17} /></button><button type="button" className="cart-continue" onClick={() => { setCartOpen(false); scrollToMenu(); }}>ارجع اختار من المنيو</button></div>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartFeedback && (
          <motion.div className="cart-feedback" role="status" aria-live="polite" initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }} transition={{ duration: reduceMotion ? 0.01 : 0.24, ease: [0.23, 1, 0.32, 1] }}>
            <span className="cart-feedback-icon"><Check size={18} /></span>
            <span><b>اتثبت في السلة</b><small>{cartFeedback.quantity > 1 ? `${cartFeedback.quantity} × ` : ""}{cartFeedback.name}</small></span>
            <button type="button" onClick={() => { setCartOpen(true); setCartFeedback(null); }}>شوف السلة <ArrowUpLeft size={15} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartFlight && (
          <motion.img key={cartFlight.id} className="cart-flight" src={cartFlight.image} alt="" aria-hidden="true" style={{ left: cartFlight.startX, top: cartFlight.startY }} initial={{ opacity: 0, scale: 0.72, rotate: -8 }} animate={{ opacity: [0, 1, 1, 0], x: [0, cartFlight.deltaX * 0.32, cartFlight.deltaX], y: [0, cartFlight.deltaY * 0.16 - 62, cartFlight.deltaY], scale: [0.72, 1, 0.34], rotate: [-8, 12, 0] }} transition={{ duration: 0.64, times: [0, 0.16, 0.82, 1], ease: [0.23, 1, 0.32, 1] }} onAnimationComplete={() => setCartFlight(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {orderConfirmation && (
          <motion.div className="order-confirm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOrderConfirmation(null)}>
            <motion.section className="order-confirm-card" role="dialog" aria-modal="true" aria-labelledby="order-confirm-title" initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: reduceMotion ? 0.01 : 0.28 }} onClick={(event) => event.stopPropagation()}>
              <button type="button" className="order-confirm-close" onClick={() => setOrderConfirmation(null)} aria-label="غلق التأكيد"><X size={18} /></button>
              <span className="order-confirm-kicker"><Check size={16} /> طلبك جاهز للمراجعة</span>
              <h2 id="order-confirm-title">طلبك جاهز للمراجعة.</h2>
              <p>احتفظ برقم المتابعة. هتفتح دلوقتي رسالة الطلب الجاهزة في واتساب؛ أرسلها لتأكيد التفاصيل مع المطعم.</p>
              <strong className="order-reference">{orderConfirmation.reference}</strong>
              <div className="order-confirm-summary"><span>{orderConfirmation.itemCount} صنف</span><b>{orderConfirmation.total}ج</b></div>
              <a href={orderConfirmation.whatsappUrl} target="_blank" rel="noreferrer" className="order-confirm-whatsapp"><MessageCircle size={18} /> افتح واتساب وراجع الرسالة</a>
              <button type="button" className="order-confirm-back" onClick={() => setOrderConfirmation(null)}>ارجع وعدّل الطلب</button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rewardDialog && (
          <motion.div className="order-confirm-overlay reward-reveal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRewardDialog(null)}>
            <motion.section className="reward-reveal-card" role="dialog" aria-modal="true" aria-labelledby="reward-reveal-title" initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: reduceMotion ? .01 : .28 }} onClick={(event) => event.stopPropagation()}>
              <button type="button" className="order-confirm-close" onClick={() => setRewardDialog(null)} aria-label="غلق شاشة المكافأة"><X size={18} /></button>
              <span className="reward-reveal-icon">{rewardDialog.kind === "burgerReward" ? <Trophy size={31} /> : <Gift size={31} />}</span>
              <span className="order-confirm-kicker">{rewardDialog.kind === "burgerReward" ? "مكافأة برجر لحمة" : "كود خصم ٥٪"}</span>
              <h2 id="reward-reveal-title">{rewardDialog.kind === "burgerReward" ? "برجر لحمة في الطريق." : "كودك اتسجّل."}</h2>
              <p>{rewardDialog.kind === "burgerReward" ? "اعرض كود الاستبدال في رسالة واتساب. لا يتم استخدامه إلا بعد تأكيد Rollz." : "أرسل طلبك الآن بهذا الكود. بعد أن يؤكد Rollz الطلب، يتحول إلى نقطة معتمدة في محفظتك."}</p>
              <div className="reward-code" dir="ltr"><b>{rewardDialog.code}</b><button type="button" onClick={() => navigator.clipboard?.writeText(rewardDialog.code)} aria-label="نسخ الكود"><Copy size={16} /></button></div>
              <small className="reward-reference">رقم المتابعة: {rewardDialog.reference}</small>
              <a href={rewardDialog.whatsappUrl} target="_blank" rel="noreferrer" className="order-confirm-whatsapp"><MessageCircle size={18} /> افتح واتساب وأرسل الكود</a>
              <button type="button" className="order-confirm-back" onClick={() => setRewardDialog(null)}>احتفظت بالكود، رجوع للموقع</button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="site-footer">
        <div className="container footer-grid"><RollzMark /><div className="footer-contact"><span>رولز · شبين الكوم</span><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">+20 10 98188418</a><span>{ROLLZ_ADDRESS}</span></div><div className="footer-links"><a href={FACEBOOK_URL} target="_blank" rel="noreferrer">فيسبوك</a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">إنستجرام</a><a href={ORDER_URL} target="_blank" rel="noreferrer">اطلب أونلاين</a></div></div>
        <div className="container footer-bottom"><span>© 2026 رولز · شبين الكوم.</span><span>اختارها. ظبّطها. ابعتها.</span></div>
      </footer>
      <div className={`mobile-order-dock${cartCount ? " is-filled" : ""}`} aria-label="السلة والطلب">
        <span><ShoppingBag size={16} />{cartCount ? <><strong>{cartCount} {cartCount === 1 ? "صنف" : "أصناف"} · {orderTotalAfterOffer}ج</strong><small>طلبك محفوظ وجاهز للمراجعة</small></> : "ابدأ اختيارك"}</span>
        <button type="button" onClick={() => setCartOpen(true)} aria-label={cartCount ? `راجع السلة وبها ${cartCount} أصناف وإجمالي ${orderTotalAfterOffer} جنيه` : "افتح السلة وابدأ طلبك"}>{cartCount ? "راجع طلبك" : "ابدأ طلبك"}</button>
      </div>
      </div>
    </>
  );
}
