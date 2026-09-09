import { useState, useMemo } from "react";
import {
  Armchair, Lightbulb, Truck, MapPin, Clock,
  Plus, Minus, X, ClipboardList, Phone, Mail, ChevronRight, Check,
  Frame, Layers, Package, LayoutGrid
} from "lucide-react";
import ITEMS from "./items.json";

const CATEGORIES = [
  { id: "furniture", label: "Furniture", icon: Armchair, tone: "plum" },
  { id: "lighting", label: "Lighting", icon: Lightbulb, tone: "kraft" },
  { id: "art", label: "Art", icon: Frame, tone: "plum" },
  { id: "pillows", label: "Pillows & Textiles", icon: Layers, tone: "sage" },
  { id: "small-props", label: "Small Props", icon: Package, tone: "kraft" },
  { id: "rugs", label: "Rugs", icon: LayoutGrid, tone: "mauve" },
];

const GALLERY = [
  { cat: "furniture", label: "The Living Room Edit", note: "Sofas, credenzas & seating" },
  { cat: "rugs", label: "Rugs & Textiles", note: "Layered rugs and soft goods" },
  { cat: "small-props", label: "Small Props", note: "Tabletop styling & finishing touches" },
];

const TONES = {
  kraft: "linear-gradient(135deg, #EFE1C9 0%, #C7A667 100%)",
  sage: "linear-gradient(135deg, #E1E6D2 0%, #8B9A6D 100%)",
  mauve: "linear-gradient(135deg, #E3D6D8 0%, #9C7E82 100%)",
  plum: "linear-gradient(135deg, #DCC9D2 0%, #7A4E63 100%)",
};

function catMeta(catId) {
  return CATEGORIES.find((c) => c.id === catId);
}

function PhotoPanel({ catId, image, imageAlt, className = "h-48", iconSize = 34 }) {
  const meta = catMeta(catId);
  const Icon = meta.icon;

  if (image) {
    return (
      <div className={`relative w-full ${className} overflow-hidden`} style={{ background: TONES[meta.tone] }}>
        <img
          src={image}
          alt={imageAlt || meta.label}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${className} overflow-hidden flex items-center justify-center`}
      style={{ background: TONES[meta.tone] }}
    >
      <Icon size={iconSize} strokeWidth={1.1} color="#FCF7F0" style={{ opacity: 0.9 }} />
    </div>
  );
}

function TagCard({ item, qty, onAdd, onRemove }) {
  return (
    <div className="border border-[color:var(--ink)] bg-[color:var(--paper)] rounded-lg overflow-hidden flex flex-col">
      <PhotoPanel catId={item.cat} image={item.image} imageAlt={item.name} className="aspect-square" />
      <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] tracking-wider text-[color:var(--mauve)] opacity-70">{item.id}</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--mauve)] opacity-60">{catMeta(item.cat).label}</span>
        </div>
        <div>
          <h3 className="text-[16px] font-medium leading-snug text-[color:var(--ink)]">
            {item.name}
          </h3>
          <p className="font-mono text-[11px] text-[color:var(--ink)] opacity-45 mt-1">{item.dims}</p>
        </div>
        <div className="flex items-end justify-between mt-1 pt-3 border-t border-[color:var(--ink)] opacity-90">
          <div>
            <span className="font-mono text-lg font-semibold text-[color:var(--plum)]">${item.rate}</span>
            <span className="font-mono text-[11px] text-[color:var(--ink)] opacity-50"> /day</span>
          </div>
          {qty > 0 ? (
            <div className="flex items-center gap-2 border border-[color:var(--ink)] rounded-full px-1">
              <button
                onClick={() => onRemove(item.id)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] transition-colors"
                aria-label={`Remove one ${item.name} from pull sheet`}
              >
                <Minus size={13} />
              </button>
              <span className="font-mono text-sm w-4 text-center">{qty}</span>
              <button
                onClick={() => onAdd(item.id)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] transition-colors"
                aria-label={`Add one more ${item.name} to pull sheet`}
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAdd(item.id)}
              className="font-mono text-[11px] uppercase tracking-wider border border-[color:var(--ink)] rounded-full px-3 py-2 hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] transition-colors"
            >
              Add to Pull Sheet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeCat, setActiveCat] = useState("all");
  const [cart, setCart] = useState({});
  const [rentalDays, setRentalDays] = useState(3);
  const [fulfillment, setFulfillment] = useState("pickup");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(
    () => (activeCat === "all" ? ITEMS : ITEMS.filter((i) => i.cat === activeCat)),
    [activeCat]
  );

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const cartLines = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...ITEMS.find((i) => i.id === id), qty }));

  const subtotal = cartLines.reduce((sum, l) => sum + l.rate * l.qty * rentalDays, 0);
  const deliveryFee = fulfillment === "delivery" && cartLines.length ? 85 : 0;
  const total = subtotal + deliveryFee;

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) =>
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) - 1) };
      return next;
    });

  const handleSubmit = () => setSubmitted(true);
  const resetQuote = () => {
    setCart({});
    setSubmitted(false);
    setDrawerOpen(false);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        "--ink": "#2E241F",
        "--page-bg": "#F8EFE6",
        "--paper": "#FCF7F0",
        "--concrete": "#C9BBB0",
        "--kraft": "#EAD9C8",
        "--sage": "#7C8862",
        "--mauve": "#8A6F72",
        "--plum": "#7A4E63",
        background: "var(--page-bg)",
        color: "var(--ink)",
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        * { box-sizing: border-box; }
        button:focus-visible, input:focus-visible, a:focus-visible { outline: 2px solid var(--plum); outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .transition-transform, .transition-colors, .transition-all { transition: none !important; }
        }
      `}</style>

      {/* Utility bar */}
      <div
        className="text-[11px] font-mono tracking-wide py-1.5 px-4 sm:px-8 flex flex-wrap justify-between gap-1"
        style={{ background: "var(--ink)", color: "var(--page-bg)" }}
      >
        <span>OAKLAND, CA &middot; MON&ndash;SAT 8:00&ndash;17:00</span>
        <span className="opacity-80">WAREHOUSE WILL-CALL &amp; DELIVERY</span>
      </div>

      {/* Header — clean sans-serif wordmark, no serif in the nav */}
      <header className="sticky top-0 z-30 border-b border-[color:var(--ink)]" style={{ background: "var(--page-bg)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <span className="text-[15px] sm:text-base font-semibold uppercase tracking-[0.14em]">
            East Bay Prop Co.
          </span>
          <nav className="hidden md:flex items-center gap-6 font-mono text-[12px] uppercase tracking-wider">
            <a href="#inventory" className="hover:text-[color:var(--plum)]">Inventory</a>
            <a href="#how-it-works" className="hover:text-[color:var(--plum)]">How It Works</a>
            <a href="#delivery" className="hover:text-[color:var(--plum)]">Delivery</a>
          </nav>
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative flex items-center gap-2 border border-[color:var(--ink)] rounded-full px-4 py-2 font-mono text-[12px] uppercase tracking-wider hover:bg-[color:var(--ink)] hover:text-[color:var(--page-bg)] transition-colors"
          >
            <ClipboardList size={16} />
            <span className="hidden sm:inline">Pull Sheet</span>
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold"
                style={{ background: "var(--plum)", color: "var(--paper)" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Full-bleed header image / hero */}
      <section className="relative w-full h-[440px] sm:h-[560px] overflow-hidden border-b border-[color:var(--ink)]">
        <PhotoPanel catId="furniture" image="/images/hero-dining-room.jpg" imageAlt="Styled dining room with East Bay Prop Co. furniture" className="h-full" iconSize={72} />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(46,36,31,0.82) 0%, rgba(46,36,31,0.35) 45%, rgba(46,36,31,0.05) 75%)" }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-10 sm:pb-14 w-full">
            <span
              className="inline-block font-mono text-[11px] uppercase tracking-widest px-3 py-1 rounded-full mb-5"
              style={{ background: "var(--paper)", color: "var(--ink)" }}
            >
              Oakland &amp; the East Bay
            </span>
            <h1
              className="font-display leading-[1.05] text-[44px] sm:text-[64px] tracking-tight"
              style={{ color: "#FCF7F0", fontWeight: 600 }}
            >
              Props, pulled
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 500 }}>and ready.</span>
            </h1>
            <p className="mt-4 text-[15px] sm:text-[17px] max-w-md leading-relaxed" style={{ color: "#FCF7F0", opacity: 0.9 }}>
              Browse the warehouse, build your pull sheet, and get a quote
              back same day. Will-call pickup or we load it onto the truck
              for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#inventory"
                className="font-mono text-[12px] uppercase tracking-wider px-5 py-3 rounded-full"
                style={{ background: "var(--paper)", color: "var(--ink)" }}
              >
                Browse Inventory
              </a>
              <a
                href="#how-it-works"
                className="font-mono text-[12px] uppercase tracking-wider px-5 py-3 rounded-full border"
                style={{ borderColor: "#FCF7F0", color: "#FCF7F0" }}
              >
                How Renting Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-[color:var(--ink)]" style={{ background: "var(--kraft)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-10" style={{ fontWeight: 600 }}>
            How Renting Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Build your pull sheet", body: "Browse the inventory and add what you need. Adjust quantities anytime before you send it." },
              { n: "02", title: "Send it for a quote", body: "Set your rental dates and pickup or delivery. We confirm availability and final pricing same day." },
              { n: "03", title: "Pick up or we deliver", body: "Will-call at the Oakland warehouse, or we load, deliver, and pick back up after wrap." },
            ].map((s) => (
              <div key={s.n}>
                <span className="font-mono text-[13px] text-[color:var(--plum)] font-semibold">{s.n}</span>
                <h3 className="text-[17px] font-semibold mt-2 mb-2">{s.title}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial gallery — more images, minimal text */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-14">
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-6" style={{ fontWeight: 600 }}>
          Shop by Collection
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {GALLERY.map((g) => (
            <div key={g.label} className="relative rounded-lg overflow-hidden border border-[color:var(--ink)]">
              <PhotoPanel catId={g.cat} className="aspect-square" iconSize={40} />
              <div
                className="absolute inset-x-0 bottom-0 px-4 py-3"
                style={{ background: "linear-gradient(to top, rgba(46,36,31,0.85), rgba(46,36,31,0))" }}
              >
                <p className="font-display text-[19px]" style={{ fontWeight: 600, color: "#FCF7F0" }}>
                  {g.label}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "#FCF7F0", opacity: 0.8 }}>
                  {g.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inventory */}
      <section id="inventory" className="max-w-6xl mx-auto px-4 sm:px-8 py-10 border-t border-[color:var(--ink)]">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight" style={{ fontWeight: 600 }}>
            Warehouse Inventory
          </h2>
          <span className="font-mono text-[11px] opacity-50">{filtered.length} ITEMS SHOWN</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-1 px-1">
          <button
            onClick={() => setActiveCat("all")}
            className="shrink-0 font-mono text-[11px] uppercase tracking-wider px-3 py-2 rounded-full border border-[color:var(--ink)]"
            style={activeCat === "all" ? { background: "var(--ink)", color: "var(--page-bg)" } : {}}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className="shrink-0 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-3 py-2 rounded-full border border-[color:var(--ink)]"
              style={activeCat === c.id ? { background: "var(--ink)", color: "var(--page-bg)" } : {}}
            >
              <c.icon size={13} />
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <TagCard key={item.id} item={item} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />
          ))}
        </div>
      </section>

      {/* Delivery */}
      <section id="delivery" className="max-w-6xl mx-auto px-4 sm:px-8 py-14 grid sm:grid-cols-2 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-[color:var(--mauve)]" />
            <h3 className="text-[18px] font-semibold">Will-Call Pickup</h3>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            No fee. Pull your items from our Oakland warehouse during business
            hours and return them the same way at the end of your rental period.
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Truck size={18} className="text-[color:var(--mauve)]" />
            <h3 className="text-[18px] font-semibold">Delivery &amp; Strike</h3>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Starting at $85 within the East Bay, based on distance and load
            size. We'll confirm your exact delivery fee with your quote.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[color:var(--ink)]" style={{ background: "var(--ink)", color: "var(--page-bg)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 grid sm:grid-cols-3 gap-8 text-sm">
          <div>
            <span className="text-[15px] font-semibold uppercase tracking-[0.12em]">East Bay Prop Co.</span>
            <p className="font-mono text-[11px] opacity-60 mt-2">2200 Dock Street, Oakland, CA</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[12px]">
            <Clock size={14} className="opacity-70" />
            Mon&ndash;Sat, 8:00&ndash;17:00
          </div>
          <div className="flex flex-col gap-2 font-mono text-[12px]">
            <span className="flex items-center gap-2"><Phone size={14} className="opacity-70" /> (510) 555-0142</span>
            <span className="flex items-center gap-2"><Mail size={14} className="opacity-70" /> rentals@eastbayprop.co</span>
          </div>
        </div>
      </footer>

      {/* Pull Sheet Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div
            className="relative w-full max-w-md h-full flex flex-col border-l border-[color:var(--ink)]"
            style={{ background: "var(--paper)" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--ink)]">
              <h3 className="font-display text-xl" style={{ fontWeight: 600 }}>Your Pull Sheet</h3>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close pull sheet">
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border border-[color:var(--plum)]">
                  <Check size={22} className="text-[color:var(--plum)]" />
                </div>
                <h4 className="font-display text-2xl" style={{ fontWeight: 600 }}>Quote request sent</h4>
                <p className="text-sm opacity-75 leading-relaxed">
                  We'll confirm availability, final pricing, and your {fulfillment === "delivery" ? "delivery window" : "will-call time"} by email within one business day.
                </p>
                <button
                  onClick={resetQuote}
                  className="mt-2 font-mono text-[11px] uppercase tracking-wider border border-[color:var(--ink)] rounded-full px-4 py-2 hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] transition-colors"
                >
                  Start a new pull sheet
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {cartLines.length === 0 ? (
                    <p className="font-mono text-[12px] opacity-50 mt-6 text-center">
                      Nothing pulled yet. Add items from the inventory to start your quote.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {cartLines.map((l) => (
                        <div key={l.id} className="flex items-start justify-between gap-3 pb-4 border-b border-[color:var(--ink)] opacity-90">
                          <div>
                            <p className="font-mono text-[10px] opacity-50">{l.id}</p>
                            <p className="text-[15px] font-medium">{l.name}</p>
                            <p className="font-mono text-[11px] opacity-60 mt-1">${l.rate}/day &times; {l.qty} &times; {rentalDays}d</p>
                          </div>
                          <div className="flex items-center gap-2 border border-[color:var(--ink)] rounded-full px-1 shrink-0">
                            <button onClick={() => remove(l.id)} className="w-6 h-6 flex items-center justify-center rounded-full" aria-label={`Remove one ${l.name}`}>
                              <Minus size={12} />
                            </button>
                            <span className="font-mono text-xs w-3 text-center">{l.qty}</span>
                            <button onClick={() => add(l.id)} className="w-6 h-6 flex items-center justify-center rounded-full" aria-label={`Add one more ${l.name}`}>
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cartLines.length > 0 && (
                  <div className="border-t border-[color:var(--ink)] px-5 py-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="rental-days" className="font-mono text-[11px] uppercase tracking-wider opacity-70">
                        Rental Days
                      </label>
                      <div className="flex items-center gap-2 border border-[color:var(--ink)] rounded-full px-1">
                        <button
                          onClick={() => setRentalDays((d) => Math.max(1, d - 1))}
                          className="w-7 h-7 flex items-center justify-center rounded-full"
                          aria-label="Decrease rental days"
                        >
                          <Minus size={13} />
                        </button>
                        <span id="rental-days" className="font-mono text-sm w-5 text-center">{rentalDays}</span>
                        <button
                          onClick={() => setRentalDays((d) => d + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full"
                          aria-label="Increase rental days"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFulfillment("pickup")}
                        className="font-mono text-[11px] uppercase tracking-wider py-2.5 rounded-full border border-[color:var(--ink)]"
                        style={fulfillment === "pickup" ? { background: "var(--ink)", color: "var(--paper)" } : {}}
                      >
                        Will-Call Pickup
                      </button>
                      <button
                        onClick={() => setFulfillment("delivery")}
                        className="font-mono text-[11px] uppercase tracking-wider py-2.5 rounded-full border border-[color:var(--ink)]"
                        style={fulfillment === "delivery" ? { background: "var(--ink)", color: "var(--paper)" } : {}}
                      >
                        Delivery
                      </button>
                    </div>

                    <div className="font-mono text-[12px] flex flex-col gap-1.5 pt-1">
                      <div className="flex justify-between opacity-70">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between opacity-70">
                        <span>Delivery fee{fulfillment === "delivery" ? " (est.)" : ""}</span>
                        <span>{fulfillment === "delivery" ? `$${deliveryFee.toFixed(2)}` : "\u2014"}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-[14px] pt-2 border-t border-[color:var(--ink)]">
                        <span>Estimated Total</span>
                        <span className="text-[color:var(--plum)]">${total.toFixed(2)}</span>
                      </div>
                      <p className="opacity-50 text-[10px] pt-1">Excludes tax &amp; damage deposit. Final quote confirmed by our team.</p>
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full flex items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-wider py-3 rounded-full"
                      style={{ background: "var(--plum)", color: "var(--paper)" }}
                    >
                      Request Quote <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
