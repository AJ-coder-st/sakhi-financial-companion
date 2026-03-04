import { Mic, Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-forest-dark text-primary-foreground/60 py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-saffron-gradient flex items-center justify-center">
              <Mic className="w-4 h-4 text-saffron-foreground" />
            </div>
            <span className="text-lg font-bold text-primary-foreground">SAKHI</span>
          </div>
          <p className="text-sm">Smart AI for Kisan & Household Inclusion. Empowering rural women through voice-first financial technology.</p>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-3">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li>AI Assistant</li>
            <li>Scheme Matching</li>
            <li>Financial Literacy</li>
            <li>Micro-Savings</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Privacy Policy</li>
            <li>DPDP Compliance</li>
            <li>Open Source</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-3">Contact</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> 1800-SAKHI-01</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@sakhi.org</div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 pt-6 text-center text-sm">
        © 2026 SAKHI — Made with ❤️ for Bharat
      </div>
    </div>
  </footer>
);

export default Footer;
