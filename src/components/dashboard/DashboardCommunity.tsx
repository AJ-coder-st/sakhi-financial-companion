import { motion } from "framer-motion";
import { Users, Calendar, IndianRupee, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const members = [
  { name: "Sunita Devi", role: "President", contribution: 500, status: "paid" },
  { name: "Rekha Yadav", role: "Secretary", contribution: 500, status: "paid" },
  { name: "Meena Kumari", role: "Member", contribution: 500, status: "paid" },
  { name: "Pushpa Singh", role: "Member", contribution: 500, status: "pending" },
  { name: "Geeta Devi", role: "Member", contribution: 500, status: "paid" },
];

const DashboardCommunity = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div>
      <h2 className="text-xl font-bold">Shakti Self-Help Group</h2>
      <p className="text-sm text-muted-foreground">Invite Code: <span className="font-mono font-bold text-primary">SHAKTI-2024</span></p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-4">
      {[
        { icon: Users, label: "Members", value: "5" },
        { icon: IndianRupee, label: "Group Corpus", value: "₹24,500" },
        { icon: Calendar, label: "Next Meeting", value: "8 Mar" },
      ].map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-2xl p-4 border border-border text-center"
        >
          <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold">{s.value}</p>
          <p className="text-xs text-muted-foreground">{s.label}</p>
        </motion.div>
      ))}
    </div>

    {/* Members */}
    <div>
      <h3 className="font-bold text-sm mb-3">Members</h3>
      <div className="space-y-2">
        {members.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl p-3 border border-border flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {m.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            </div>
            <Badge className={m.status === "paid" ? "bg-accent/10 text-accent" : "bg-saffron/20 text-saffron-deep"}>
              {m.status === "paid" ? "✓ Paid" : "Pending"}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Announcements */}
    <div className="bg-muted rounded-2xl p-4">
      <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
        <MessageCircle className="w-4 h-4" /> Recent Announcements
      </h3>
      <div className="space-y-2 text-sm">
        <p className="text-muted-foreground">📢 Next meeting on 8th March at Community Hall — bring your passbooks!</p>
        <p className="text-muted-foreground">🎉 Group completed 1 year! Total savings: ₹24,500</p>
      </div>
    </div>
  </div>
);

export default DashboardCommunity;
