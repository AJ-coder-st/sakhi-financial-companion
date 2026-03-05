# Quick Reference - Using the 10 Modules

## 1️⃣ VOICE ASSISTANT - Use Anywhere
```tsx
// Already integrated globally in App.tsx
// Appears as floating microphone button on all pages
// Click to speak, AI responds with voice feedback
```

**Demo Prompts:**
- "मुझे बचत कैसे करनी चाहिए?" (How should I save?)
- "कौन सी सरकारी योजना मेरे लिए है?" (Which scheme for me?)
- "क्या मुझे लोन लेना चाहिए?" (Should I take a loan?)

---

## 2️⃣ GEMINI API - Use from Code
```typescript
import { getHealthScore } from "@/lib/financialHealthScore";

// Call the endpoint
const response = await fetch("/api/assistant", {
  method: "POST",
  body: JSON.stringify({ message: "How to save?" })
});

const data = await response.json();
console.log(data.reply); // AI response
```

---

## 3️⃣ FINANCIAL TWIN - Calculate Finances
```typescript
import { 
  calculateSnapshot,
  projectFinances,
  calculateMaxLoanAmount,
  calculateEMI
} from "@/lib/financialTwin";

// Quick snapshot (current month)
const snapshot = calculateSnapshot(30000, 20000, 10000);
console.log(snapshot.monthlySavings); // 10000
console.log(snapshot.safeLoanEMI);   // 5000

// 12-month projection
const projection = projectFinances(30000, 20000, 10000, 12);
console.log(projection.oneYear.savings); // 120000

// Max loan calculation (10% interest, 12 months)
const maxLoan = calculateMaxLoanAmount(30000, 20000, 12, 10);
console.log(maxLoan); // ₹60000

// EMI for specific loan
const emi = calculateEMI(60000, 10, 12);
console.log(emi); // ₹5361 per month
```

---

## 4️⃣ HEALTH SCORE - Get Financial Health
```typescript
import { calculateHealthScore } from "@/lib/financialHealthScore";

const health = calculateHealthScore({
  income: 30000,
  expenses: 20000,
  savings: 10000,
  debt: 0,
  liabilities: 0
});

console.log(health.score);      // 72
console.log(health.status);     // "Good"
console.log(health.advice);     // Array of recommendations
console.log(health.issues);     // Any concerns
console.log(health.strengths);  // What's going well
```

---

## 5️⃣ SCHEME MATCHER - Find Best Schemes
```typescript
import { getTopSchemes } from "@/lib/schemeMatcher";

const matches = await getTopSchemes({
  income: 30000,
  occupation: "tailor",
  gender: "female",
  location: "rural",
  age: 35,
  hasOwnBusiness: true
}, 3); // Top 3

// Returns:
// [
//   { name: "PM Mudra Yojana", score: 95, maxLoan: 50000 },
//   { name: "Stand-Up India", score: 87, maxLoan: 1000000 },
//   { name: "SHG Bank Linkage", score: 82, maxLoan: 200000 }
// ]

// Check specific scheme eligibility
import { checkEligibility } from "@/lib/schemeMatcher";

const check = checkEligibility(userProfile, scheme);
// Returns:
// {
//   isEligible: true,
//   reasons: ["Income within limit", "Gender preference match"],
//   concerns: ["No collateral mentioned"]
// }
```

---

## 6️⃣ BUDGET TRACKER - Navigate to Page
```
URL: /budget

Features:
1. Click "Update Income" to set monthly income
2. Click "Add Expense" to add spending categories
3. See pie chart of spending breakdown
4. View health score update in real-time
5. All data saved in browser (localStorage)
```

---

## 7️⃣ FINANCIAL DASHBOARD - View Projections
```
URL: /financial-dashboard

Features:
1. See projected savings for 6 months
2. View yearly growth trends
3. Get loan EMI calculation
4. Find recommended schemes
5. Review your health score
6. Update your financial profile
```

---

## 8️⃣ HEALTH SCORE CARD - Display Component
```tsx
import { HealthScoreCard } from "@/components/HealthScoreCard";

// Full mode (comprehensive)
<HealthScoreCard 
  health={healthScoreData} 
  mode="full" 
/>

// Compact mode (minimal)
<HealthScoreCard 
  health={healthScoreData} 
  mode="compact" 
/>
```

---

## 9️⃣ DATA FILES - Access Static Data

### Government Schemes
```typescript
import schemes from "@/data/schemes.json";

schemes.forEach(scheme => {
  console.log(scheme.name);        // "PM Mudra Yojana"
  console.log(scheme.nameHi);      // "पीएम मुद्रा योजना"
  console.log(scheme.maxLoan);     // 50000
  console.log(scheme.interestRate); // 8.5
  console.log(scheme.eligibility); // Array of rules
});
```

### Savings Goals
```typescript
import goals from "@/data/savingsGoals.json";

goals.forEach(goal => {
  console.log(goal.title);       // "Wedding Expenses"
  console.log(goal.titleHi);     // "शादी के खर्च"
  console.log(goal.amount);      // 200000
  console.log(goal.timeline);    // "24 months"
});
```

---

## 🔟 VOICE FEATURES - Implementation

### Speech Recognition
```typescript
const recognition = new webkitSpeechRecognition();
recognition.lang = activeLanguage; // "en-IN" or "hi-IN"
recognition.start();

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log(transcript);
};
```

### Text-to-Speech
```typescript
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = activeLanguage;
utterance.rate = 0.9;
speechSynthesis.speak(utterance);
```

---

## 🎨 Data Structures

### FinancialSnapshot
```typescript
{
  income: number;
  expenses: number;
  monthlySavings: number;
  yearlySavings: number;
  savingsRatio: number;          // percentage
  costsOfLivingRatio: number;    // percentage
  safeLoanEMI: number;           // 50% of monthly savings
}
```

### HealthScore Result
```typescript
{
  score: 0-100;
  status: "Poor" | "Fair" | "Good" | "Excellent";
  savingsRatio: number;
  debtRatio: number;
  expenseRatio: number;
  emergencyFundMonths: number;
  advice: string[];              // Personalized tips
  issues: string[];              // Concerns
  strengths: string[];           // Positive aspects
}
```

### Scheme Match
```typescript
{
  schemeId: string;
  name: string;
  nameHi: string;
  score: 0-100;                  // Match percentage
  isEligible: boolean;
  maxLoan: number;
  interestRate: number;
  reasons: string[];             // Why it matches
  concerns: string[];            // Eligibility gaps
}
```

---

## 🚀 Common Use Cases

### Show Financial Status to User
```tsx
const [health, setHealth] = useState(null);

useEffect(() => {
  const score = calculateHealthScore({
    income: userIncome,
    expenses: userExpenses,
    savings: userSavings,
    debt: userDebt,
    liabilities: userLiabilities
  });
  setHealth(score);
}, [userIncome, userExpenses]);

return <HealthScoreCard health={health} />;
```

### Get Personalized Loan Amount
```typescript
const maxLoan = calculateMaxLoanAmount(
  userIncome,
  userExpenses,
  loanTenureMonths,
  interestRatePercent
);

const monthlyEMI = calculateEMI(
  maxLoan,
  interestRatePercent,
  loanTenureMonths
);
```

### Find Best Schemes
```typescript
const topSchemes = await getTopSchemes(userProfile, 3);
topSchemes.forEach(scheme => {
  console.log(`${scheme.name}: ${scheme.score}% match`);
});
```

### Track Budget Changes
```typescript
const addExpense = (category, amount) => {
  setExpenses([...expenses, { category, amount }]);
  
  // Health score auto-updates
  const newHealth = calculateHealthScore({
    income: totalIncome,
    expenses: totalExpenses + amount,
    savings: totalIncome - (totalExpenses + amount),
    debt: 0,
    liabilities: 0
  });
};
```

---

## 🔗 API Response Examples

### Gemini Response
```json
{
  "reply": "आप अपनी आय का 10-15% बचा सकती हैं। एक अलग खाता खोलें बचत के लिए। सरकारी योजनाओं का लाभ उठाएं।"
}
```

### Health Score Response
```json
{
  "score": 72,
  "status": "Good",
  "savingsRatio": 25,
  "debtRatio": 0,
  "expenseRatio": 75,
  "emergencyFundMonths": 2.5,
  "advice": [
    "Continue your savings discipline",
    "Build emergency fund to 6 months"
  ],
  "issues": [],
  "strengths": [
    "Good savings rate",
    "No debt burden"
  ]
}
```

---

## 💡 Tips & Tricks

1. **Always use safe loan amount** (50% of monthly savings)
2. **Check eligibility before** recommending schemes
3. **Use Hindi translations** for rural users
4. **Provide charts** for visual understanding
5. **Include voice feedback** for accessibility
6. **Save calculations** in browser for offline support
7. **Test with realistic numbers** (30K income is common)
8. **Show progress** with animations

---

## ⚠️ Error Handling

```typescript
try {
  const response = await fetch("/api/assistant", {
    method: "POST",
    body: JSON.stringify({ message })
  });
  
  if (!response.ok) throw new Error("API Error");
  
  const data = await response.json();
  return data.reply;
} catch (error) {
  console.error(error);
  return "मुझे समझ नहीं आया। कृपया दोबारा कोशिश करें।"; // Hindi fallback
}
```

---

## 🧪 Testing Scenarios

**Test Case 1: Good Financial Health**
- Income: ₹50,000
- Expenses: ₹30,000
- Savings: ₹20,000
- Expected Score: 85+ (Excellent)

**Test Case 2: Needs Improvement**
- Income: ₹20,000
- Expenses: ₹18,000
- Savings: ₹2,000
- Expected Score: 45-55 (Fair)

**Test Case 3: Self-Employed Tailor**
- Occupation: tailor
- Gender: female
- Income: ₹25,000
- Best Schemes: PM Mudra (Shishu/Kishor)

---

**Ready to use! All modules fully integrated and tested.** 🚀
