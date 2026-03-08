import { useState } from "react";
import { Link } from "wouter";
import { ShoppingBag, ChevronRight, Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Import generated assets
import heroImg from "@/assets/hero.png";
import cookiesImg from "@/assets/cookies.jpg";
import browniesImg from "@/assets/brownies.jpg";
import cupcakesImg from "@/assets/cupcakes.jpg";
import cakeImg from "@/assets/cake.jpg";
import loafImg from "@/assets/loaf.jpg";

const PRODUCTS = [
  { id: 1, name: "Decadent Chocolate Chip Cookies", price: "$24/dozen", image: cookiesImg, category: "Cookies" },
  { id: 2, name: "Double Fudge Brownies", price: "$28/box", image: browniesImg, category: "Brownies" },
  { id: 3, name: "Velvet Cupcakes", price: "$32/dozen", image: cupcakesImg, category: "Cupcakes" },
  { id: 4, name: "Midnight Truffle Cake", price: "$55/whole", image: cakeImg, category: "Cakes" },
  { id: 5, name: "Spiced Pumpkin Loaf", price: "$18/loaf", image: loafImg, category: "Loaves" },
];

export default function Home() {
  const { toast } = useToast();
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([]);

  const addToOrder = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, quantity: 1 }];
    });
    toast({
      title: "Added to Order",
      description: "Item has been added to your sweet selection.",
    });
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please select some sweets before placing an order.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Order Request Sent",
      description: "We've received your request and will contact you shortly to confirm.",
    });
    setCart([]);
    (e.target as HTMLFormElement).reset();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "The team at Death by Sweets will get back to you soon.",
    });
    (e.target as HTMLFormElement).reset();
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-accent">Death by Sweets</div>
          <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-medium">
            <a href="#menu" className="hover:text-accent transition-colors">Menu</a>
            <a href="#order" className="hover:text-accent transition-colors">Order</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </div>
          <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-background rounded-none border-2 h-10 px-6 font-semibold" onClick={() => document.getElementById('order')?.scrollIntoView()}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            Cart ({cartTotalItems})
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Decadent chocolate desserts" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-6 mt-20">
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 text-white drop-shadow-lg">
            Indulge in <br/>
            <span className="text-primary italic">Darkness</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Sinfully rich cookies, brownies, cupcakes, cakes, and loaves. Handcrafted for those who demand the ultimate chocolate and sugar experience.
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white rounded-none px-10 py-6 text-lg uppercase tracking-widest shadow-xl transition-transform hover:-translate-y-1"
            onClick={() => document.getElementById('menu')?.scrollIntoView()}
          >
            Explore the Menu <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Menu / Products Section */}
      <section id="menu" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl mb-4 text-accent">Our Creations</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {PRODUCTS.map((product) => (
              <Card key={product.id} className="bg-card border-border overflow-hidden rounded-none group hover:border-accent transition-colors duration-500">
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur px-3 py-1 font-serif text-accent border border-accent/20">
                    {product.category}
                  </div>
                </div>
                <CardContent className="p-8 text-center bg-card">
                  <h3 className="text-2xl mb-2 min-h-[64px] flex items-center justify-center">{product.name}</h3>
                  <p className="text-primary font-semibold mb-6 text-lg">{product.price}</p>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-none border-border hover:bg-accent hover:text-background hover:border-accent transition-all"
                    onClick={() => addToOrder(product.id)}
                  >
                    Add to Request
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section id="order" className="py-32 px-6 bg-secondary/30 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Request an Order</h2>
            <p className="text-muted-foreground">Select your sweets from the menu and fill out your details below. We'll contact you to confirm pickup or delivery.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-2 bg-card p-6 border border-border">
              <h3 className="text-xl mb-6 font-serif border-b border-border pb-4">Your Selection</h3>
              {cart.length === 0 ? (
                <p className="text-muted-foreground italic text-sm">Your order is currently empty.</p>
              ) : (
                <ul className="space-y-4">
                  {cart.map(item => {
                    const product = PRODUCTS.find(p => p.id === item.id);
                    return product ? (
                      <li key={item.id} className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                        <span>{item.quantity}x {product.name}</span>
                      </li>
                    ) : null;
                  })}
                </ul>
              )}
            </div>
            
            <form onSubmit={handleOrderSubmit} className="md:col-span-3 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">First Name</label>
                  <Input required className="bg-background rounded-none border-border focus-visible:ring-accent" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Last Name</label>
                  <Input required className="bg-background rounded-none border-border focus-visible:ring-accent" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Email</label>
                <Input required type="email" className="bg-background rounded-none border-border focus-visible:ring-accent" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Phone</label>
                <Input required type="tel" className="bg-background rounded-none border-border focus-visible:ring-accent" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Special Instructions / Date Required</label>
                <Textarea className="bg-background rounded-none border-border focus-visible:ring-accent min-h-[100px]" placeholder="Any allergies or specific pickup date?" />
              </div>
              <Button type="submit" className="w-full bg-accent text-background hover:bg-accent/90 rounded-none py-6 text-lg">
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl mb-6">Reach Out to the Team</h2>
            <div className="w-16 h-1 bg-primary mb-8"></div>
            <p className="text-lg text-muted-foreground mb-10">
              Have a custom request? Planning a dark and decadent event? The team at Death by Sweets is ready to bring your darkest sugary desires to life.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-card border border-border flex items-center justify-center mr-4">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-serif text-lg">Call Us</h4>
                  <p className="text-muted-foreground">1-800-SWEET-DEATH</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-card border border-border flex items-center justify-center mr-4">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-serif text-lg">Email Us</h4>
                  <p className="text-muted-foreground">souls@deathbysweets.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-card border border-border flex items-center justify-center mr-4">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-serif text-lg">Find Us</h4>
                  <p className="text-muted-foreground">666 Midnight Lane, Bakery District</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-12">
              <a href="#" className="w-10 h-10 border border-border flex items-center justify-center hover:bg-accent hover:text-background transition-colors hover:border-accent">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 border border-border flex items-center justify-center hover:bg-accent hover:text-background transition-colors hover:border-accent">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="bg-card p-8 md:p-12 border border-border">
            <h3 className="text-2xl mb-8 font-serif">Send a Message</h3>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input required className="bg-background rounded-none border-border border-b-2 border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-accent px-0" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Input required type="email" className="bg-background rounded-none border-border border-b-2 border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-accent px-0" placeholder="Your Email" />
              </div>
              <div className="space-y-2">
                <Textarea required className="bg-background rounded-none border-border border-b-2 border-t-0 border-l-0 border-r-0 focus-visible:ring-0 focus-visible:border-accent px-0 min-h-[120px] resize-none" placeholder="Your Message" />
              </div>
              <Button type="submit" variant="outline" className="w-full rounded-none border-2 border-primary text-primary hover:bg-primary hover:text-white mt-8">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black py-12 text-center border-t border-border">
        <h2 className="text-2xl font-serif text-accent mb-4">Death by Sweets</h2>
        <p className="text-muted-foreground text-sm uppercase tracking-widest">© {new Date().getFullYear()} All Rights Reserved.</p>
      </footer>
    </div>
  );
}