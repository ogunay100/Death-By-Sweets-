import { useState } from "react";
import { ShoppingBag, Phone, Mail, MapPin, Instagram, Facebook, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import heroImg from "@/assets/hero.png";
import cookiesImg from "@/assets/cookies.jpg";
import browniesImg from "@/assets/brownies.jpg";
import cupcakesImg from "@/assets/cupcakes.jpg";
import loafImg from "@/assets/loaf.jpg";

const FORMSPREE_ID = "YOUR_FORM_ID";

const MENU = [
  {
    id: "cookies",
    name: "Cookies",
    emoji: "🍪",
    price: "$3 each  ·  $30 / dozen",
    note: "Mix-ins are an additional $2–$4 per dozen",
    image: cookiesImg,
    items: ["Chocolate Chip", "Triple Chocolate", "M&M", "Stuffed", "Seasonal"],
  },
  {
    id: "brownies",
    name: "Brownies",
    emoji: "🍫",
    price: "$3 each  ·  $30 / box",
    image: browniesImg,
    items: ["Fudge", "Brookie", "Nutella Blondie", "Cinnamon Roll Blondie", "Seasonal"],
  },
  {
    id: "cupcakes",
    name: "Cupcakes & Cakes",
    emoji: "🧁",
    price: "Mini $3.50 each  ·  $35 / dozen",
    note: "Whole cake pricing — message us! · Frostings: Vanilla · Chocolate · Coffee · Strawberry",
    image: cupcakesImg,
    items: ["Vanilla", "Chocolate", "Red Velvet", "Seasonal"],
  },
  {
    id: "loaves",
    name: "Loaves",
    emoji: "🍞",
    price: "$2.50 / slice  ·  $20 / loaf",
    image: loafImg,
    items: ["Lemon Glazed", "Banana (Nuts or Choc Chips)", "Cinnamon Crumb Cake", "Seasonal"],
  },
];

type CartItem = { category: string; item: string; quantity: number };

export default function Home() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const addItem = (category: string, item: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.category === category && i.item === item);
      if (existing) {
        return prev.map((i) =>
          i.category === category && i.item === item ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { category, item, quantity: 1 }];
    });
    toast({ title: "Added! 💀", description: `${item} added to your order.` });
  };

  const updateQty = (category: string, item: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.category === category && i.item === item ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (category: string, item: string) => {
    setCart((prev) => prev.filter((i) => !(i.category === category && i.item === item)));
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast({ title: "Your order is empty!", description: "Add some items from the menu first.", variant: "destructive" });
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    const orderSummary = cart.map((i) => `${i.quantity}x ${i.item} (${i.category})`).join(", ");
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      date: data.get("date"),
      order: orderSummary,
      instructions: data.get("instructions") || "None",
    };
    setSubmitting(true);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast({ title: "Order sent! 🖤", description: "We'll reach out shortly to confirm your order." });
        setCart([]);
        form.reset();
      } else throw new Error();
    } catch {
      toast({ title: "Something went wrong", description: "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: data.get("contact_name"), email: data.get("contact_email"), message: data.get("contact_message") }),
      });
      if (res.ok) {
        toast({ title: "Message sent! 💌", description: "We'll get back to you soon." });
        form.reset();
      } else throw new Error();
    } catch {
      toast({ title: "Error", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl md:text-2xl font-brand text-primary glow-pink-sm cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            💀 Death By Sweets
          </div>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-heading font-semibold">
            {["menu", "order", "contact"].map((s) => (
              <a key={s} href={`#${s}`} className="text-muted-foreground hover:text-primary transition-colors">{s}</a>
            ))}
          </div>
          <button
            onClick={() => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 text-sm font-heading font-semibold hover:bg-primary hover:text-background transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Order ({cartCount})
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Death By Sweets" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        <div className="relative z-10 text-center px-6 mt-20 max-w-4xl mx-auto">
          <p className="font-heading text-primary text-lg md:text-xl tracking-widest uppercase mb-4 glow-pink-sm">
            ✦ Handcrafted with Dark Magic ✦
          </p>
          <h1 className="font-brand text-5xl md:text-7xl lg:text-8xl text-foreground glow-pink leading-tight mb-6">
            Death By<br /><span className="text-primary">Sweets</span>
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Sinfully rich cookies, brownies, cupcakes, cakes & loaves — handcrafted for those who crave something <em>dangerously</em> good.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-primary text-background px-10 py-4 font-heading font-bold text-lg uppercase tracking-widest hover:bg-primary/80 transition-all hover:-translate-y-1 shadow-lg shadow-primary/25"
            >See the Menu</button>
            <button
              onClick={() => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" })}
              className="border-2 border-primary text-primary px-10 py-4 font-heading font-bold text-lg uppercase tracking-widest hover:bg-primary hover:text-background transition-all hover:-translate-y-1"
            >Place an Order</button>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="font-heading text-primary tracking-widest uppercase text-sm mb-3">✦ Our Creations ✦</p>
            <h2 className="font-brand text-4xl md:text-5xl text-foreground glow-pink">The Menu</h2>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px bg-border flex-1 max-w-32" />
              <span className="text-primary text-2xl">💀</span>
              <div className="h-px bg-border flex-1 max-w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {MENU.map((cat) => (
              <div key={cat.id} className="bg-card border border-border card-glow transition-all duration-500 overflow-hidden group">
                <div className="relative h-56 overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <h3 className="font-heading text-3xl font-bold text-primary glow-pink-sm">{cat.emoji} {cat.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-heading text-primary font-semibold text-lg mb-4">{cat.price}</p>
                  <ul className="space-y-2 mb-4">
                    {cat.items.map((item) => {
                      const inCart = cart.find((c) => c.category === cat.name && c.item === item);
                      return (
                        <li key={item} className="flex items-center justify-between">
                          <span className="font-body text-foreground/80 flex items-center gap-2">
                            <span className="text-primary text-xs">♥</span> {item}
                          </span>
                          {inCart ? (
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => updateQty(cat.name, item, -1)} className="w-6 h-6 border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-heading text-primary font-bold w-4 text-center text-sm">{inCart.quantity}</span>
                              <button type="button" onClick={() => updateQty(cat.name, item, 1)} className="w-6 h-6 border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all">
                                <Plus className="w-3 h-3" />
                              </button>
                              <button type="button" onClick={() => removeItem(cat.name, item)} className="text-muted-foreground hover:text-destructive transition-colors ml-1">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => addItem(cat.name, item)} className="text-xs font-heading font-semibold border border-border text-muted-foreground px-3 py-1 hover:border-primary hover:text-primary transition-all">
                              + Add
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {cat.note && <p className="font-body text-xs text-muted-foreground italic border-t border-border pt-3">✦ {cat.note}</p>}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center font-body text-muted-foreground text-sm mt-12 italic">
            ✦ Mix-ins for cookies will be an additional $2–$4 per dozen ✦
          </p>
        </div>
      </section>

      {/* ORDER FORM */}
      <section id="order" className="py-28 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-heading text-primary tracking-widest uppercase text-sm mb-3">✦ Ready to Indulge? ✦</p>
            <h2 className="font-brand text-4xl md:text-5xl text-foreground glow-pink">Place Your Order</h2>
            <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
              Select your items from the menu above, fill in your details, and we'll reach out to confirm everything.
            </p>
          </div>
          <form onSubmit={handleOrderSubmit} className="space-y-8">
            <div className="bg-card border border-border p-6">
              <h3 className="font-heading text-primary text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Selection
              </h3>
              {cart.length === 0 ? (
                <p className="font-body text-muted-foreground italic text-sm">No items added yet — pick your treats from the menu above!</p>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <li key={`${item.category}-${item.item}`} className="flex items-center justify-between border-b border-border pb-2">
                      <span className="font-body text-sm">
                        <span className="text-primary font-semibold">{item.quantity}x</span> {item.item}
                        <span className="text-muted-foreground ml-2 text-xs">({item.category})</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => updateQty(item.category, item.item, -1)} className="w-5 h-5 border border-border text-muted-foreground flex items-center justify-center hover:border-primary hover:text-primary transition-all">
                          <Minus className="w-3 h-3" />
                        </button>
                        <button type="button" onClick={() => updateQty(item.category, item.item, 1)} className="w-5 h-5 border border-border text-muted-foreground flex items-center justify-center hover:border-primary hover:text-primary transition-all">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button type="button" onClick={() => removeItem(item.category, item.item)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-card border border-border p-6 space-y-5">
              <h3 className="font-heading text-primary text-xl font-semibold">Your Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Name *</label>
                  <Input name="name" required placeholder="Jane Doe" className="bg-background border-border focus-visible:ring-primary font-body" />
                </div>
                <div className="space-y-1">
                  <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Phone *</label>
                  <Input name="phone" required type="tel" placeholder="(555) 123-4567" className="bg-background border-border focus-visible:ring-primary font-body" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Email *</label>
                <Input name="email" required type="email" placeholder="jane@example.com" className="bg-background border-border focus-visible:ring-primary font-body" />
              </div>
              <div className="space-y-1">
                <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Preferred Pickup / Delivery Date</label>
                <Input name="date" type="date" className="bg-background border-border focus-visible:ring-primary font-body" />
              </div>
              <div className="space-y-1">
                <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Special Instructions</label>
                <Textarea name="instructions" placeholder="Frosting preferences, allergies, mix-in choices, special requests..." className="bg-background border-border focus-visible:ring-primary font-body min-h-[100px] resize-none" />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-primary text-background py-5 font-heading font-bold text-lg uppercase tracking-widest hover:bg-primary/80 transition-all disabled:opacity-60 shadow-lg shadow-primary/20">
              {submitting ? "Sending... 💀" : "Submit Order Request 💀"}
            </button>
            <p className="text-center font-body text-xs text-muted-foreground">We'll contact you to confirm your order and arrange payment.</p>
          </form>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-heading text-primary tracking-widest uppercase text-sm mb-3">✦ Get In Touch ✦</p>
            <h2 className="font-brand text-4xl md:text-5xl text-foreground glow-pink">Reach Out</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="font-body text-muted-foreground text-lg mb-10 leading-relaxed">
                Have a custom request? Planning a dark and decadent event? We're ready to bring your sweetest desires to life.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Call Us", value: "1-800-SWEET-DEATH" },
                  { icon: Mail, label: "Email Us", value: "souls@deathbysweets.com" },
                  { icon: MapPin, label: "Find Us", value: "666 Midnight Lane, Bakery District" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-card border border-border flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-heading text-foreground font-semibold">{label}</p>
                      <p className="font-body text-muted-foreground text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-10">
                {[Instagram, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            <form onSubmit={handleContactSubmit} className="bg-card border border-border p-8 space-y-5">
              <h3 className="font-heading text-primary text-xl font-semibold">Send a Message</h3>
              <div className="space-y-1">
                <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Your Name</label>
                <Input name="contact_name" required placeholder="Jane Doe" className="bg-background border-border focus-visible:ring-primary font-body" />
              </div>
              <div className="space-y-1">
                <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Your Email</label>
                <Input name="contact_email" required type="email" placeholder="jane@example.com" className="bg-background border-border focus-visible:ring-primary font-body" />
              </div>
              <div className="space-y-1">
                <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <Textarea name="contact_message" required placeholder="What's on your mind?" className="bg-background border-border focus-visible:ring-primary font-body min-h-[120px] resize-none" />
              </div>
              <button type="submit" disabled={submitting} className="w-full border-2 border-primary text-primary py-4 font-heading font-bold uppercase tracking-widest hover:bg-primary hover:text-background transition-all disabled:opacity-60">
                {submitting ? "Sending..." : "Send Message 🖤"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-14 text-center border-t border-border">
        <h2 className="font-brand text-2xl text-primary glow-pink-sm mb-3">💀 Death By Sweets 💀</h2>
        <p className="font-body text-muted-foreground text-xs uppercase tracking-widest mb-2">Handcrafted with dark magic & a lot of sugar</p>
        <p className="font-body text-muted-foreground text-xs">© {new Date().getFullYear()} Death By Sweets · All Rights Reserved</p>
      </footer>
    </div>
  );
}
