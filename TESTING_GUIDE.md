# Testing & Validation Guide - 10 Modules

## ✅ Pre-Launch Checklist

### Environment Setup
- [ ] Node.js/Bun installed
- [ ] GOOGLE_API_KEY environment variable set
- [ ] Dependencies installed (`bun install`)
- [ ] No TypeScript errors
- [ ] No build warnings

### Initial Setup
```bash
# Install dependencies
bun install

# Set up environment variable
setx GOOGLE_API_KEY "your-gemini-api-key"

# Start dev server
bun run dev

# Expected: Server runs on http://localhost:5173
```

---

## 🧪 MODULE 1: VOICE ASSISTANT TESTING

### Test 1.1: Component Loads
1. Navigate to http://localhost:5173/dashboard
2. **Expected:** Floating microphone button visible (bottom-right)
3. **Color:** Orange/saffron gradient
4. **Size:** ~60px button

### Test 1.2: Chat Opens
1. Click floating microphone button
2. **Expected:** Chat window opens (right side)
3. **Dimensions:** ~400px × 600px
4. **Contains:** Chat history, input area, microphone icon

### Test 1.3: Speech Recognition (English)
1. Open chat
2. Click microphone icon
3. Say: "How can I save money?"
4. **Expected:**
   - Microphone animates
   - Text appears in message
   - Sends to API automatically
   - AI response appears in chat

### Test 1.4: Speech Recognition (Hindi)
1. Change language to Hindi (LanguageSelector)
2. Click microphone
3. Say: "मुझे बचत कैसे करनी चाहिए?"
4. **Expected:**
   - Hindi recognized
   - Hindi response from Gemini
   - TTS speaks in Hindi accent

### Test 1.5: Demo Prompts
1. Open chat
2. **Expected:** 6 blue buttons with quick prompts
3. Click "How to save?"
4. **Expected:**
   - Prompt sends
   - AI responds
   - Response has voice playback option

### Test 1.6: Text-to-Speech
1. Get AI response in chat
2. **Expected:** Speaker icon on message
3. Click speaker
4. **Expected:**
   - Message plays aloud
   - Rate=0.9 (natural pace)
   - Language matches user selection

### Test 1.7: Error Handling
1. Disconnect internet
2. Try to send message
3. **Expected:**
   - Error message in Hindi: "मुझसे जुड़ने में समस्या है"
   - Retry button appears
   - Chat still functional for demo mode

### Test 1.8: Mobile Responsiveness
1. Open DevTools (F12)
2. Toggle device toolbar (mobile view)
3. Test on iPhone SE, Android Medium, Tablet
4. **Expected:**
   - Chat window sizes appropriately
   - Buttons remain clickable
   - Text readable without zoom

---

## 🧪 MODULE 2: GEMINI API TESTING

### Test 2.1: API Endpoint Exists
```bash
curl -X POST http://localhost:5173/api/assistant \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Hello\"}"
```
**Expected Response:**
```json
{
  "reply": "नमस्ते! मैं SAKHI हूँ..."
}
```

### Test 2.2: Multiple Languages
1. Send: "How can I become rich?"
2. Expected: English response about building wealth
3. Send: "मैं कर्ज में हूँ क्या करूँ?"
4. Expected: Hindi response about debt management

### Test 2.3: Financial Advice Quality
1. Send: "मेरी आय ₹30,000 है और खर्च ₹20,000। क्या मुझे लोन लेना चाहिए?"
2. **Expected:**
   - Specific advice based on numbers
   - Mentions safe loan amount (₹5,000-₹10,000)
   - Explains EMI concept
   - References government schemes

### Test 2.4: Error Response
1. Temporarily disable internet
2. Send message
3. **Expected:**
   - Error caught gracefully
   - Fallback message provided
   - No hang/timeout

---

## 🧪 MODULE 3: FINANCIAL TWIN TESTING

### Test 3.1: Snapshot Calculation
```typescript
// In browser console or test file
import { calculateSnapshot } from "@/lib/financialTwin";

// Test Case: Income 30K, Expenses 20K, Savings 10K
const result = calculateSnapshot(30000, 20000, 10000);

// Expected:
// {
//   income: 30000,
//   expenses: 20000,
//   monthlySavings: 10000,
//   yearlySavings: 120000,
//   savingsRatio: 33,
//   costsOfLivingRatio: 67,
//   safeLoanEMI: 5000
// }
```
✅ **Verify:** All values calculated correctly

### Test 3.2: 12-Month Projection
```typescript
const projection = projectFinances(30000, 20000, 10000, 12);

// Expected:
// {
//   currentMonth: { month: 0, savings: 10000 },
//   sixMonths: { month: 6, savings: 60000 },
//   oneYear: { month: 12, savings: 120000 },
//   trend: "positive"
// }
```
✅ **Verify:** Month-by-month growth linear

### Test 3.3: Max Loan Calculation
```typescript
// Loan for 12 months at 10% interest
const maxLoan = calculateMaxLoanAmount(30000, 20000, 12, 10);

// Expected: ~60000 (50% of monthly savings)
console.log(maxLoan); // 59400 (calculation: 500K at 10% for 12mo)
```
✅ **Verify:** Result safe (safe EMI ≤ 50% savings)

### Test 3.4: EMI Calculation
```typescript
const emi = calculateEMI(60000, 10, 12);

// Expected: ~5361
console.log(emi); // Should be around 5361
```
✅ **Verify:** Matches online EMI calculator

### Test 3.5: Edge Cases
```typescript
// Zero savings
const result1 = calculateSnapshot(30000, 30000, 0);
console.log(result1.safeLoanEMI); // Should be 0

// Very high expenses
const result2 = calculateSnapshot(30000, 28000, 2000);
console.log(result2.savingsRatio); // Should be 6-7%

// No expenses
const result3 = calculateSnapshot(30000, 0, 30000);
console.log(result3.savingsRatio); // Should be 100%
```
✅ **Verify:** All return valid numbers (no NaN/Infinity)

---

## 🧪 MODULE 4: HEALTH SCORE TESTING

### Test 4.1: Score Calculation
```typescript
import { getHealthScore } from "@/lib/financialHealthScore";

const health = getHealthScore({
  income: 30000,
  expenses: 20000,
  savings: 10000,
  debt: 0,
  liabilities: 0
});

console.log(health);
// Expected:
// {
//   score: ~72,
//   status: "Good",
//   savingsRatio: 33,
//   debtRatio: 0,
//   expenseRatio: 67,
//   emergencyFundMonths: 3.3,
//   advice: [...],
//   issues: [],
//   strengths: [...]
// }
```
✅ **Verify:** Score between 0-100, status is valid

### Test 4.2: Status Thresholds
```typescript
// Test different score ranges
const excellent = getHealthScore({ income: 100000, expenses: 50000, savings: 40000, debt: 0, liabilities: 0 });
console.log(excellent.status); // Should be "Excellent" (score > 85)

const poor = getHealthScore({ income: 30000, expenses: 29000, savings: 1000, debt: 50000, liabilities: 20000 });
console.log(poor.status); // Should be "Poor" (score < 40)
```
✅ **Verify:** Threshold boundaries correct

### Test 4.3: Advice Generation
```typescript
const health = getHealthScore({...});

// Expected: advice array has 3-5 items
console.log(health.advice.length); // 3-5
console.log(health.advice[0]); // "Save more consistently" or similar

// Expected: practical, actionable tips
health.advice.forEach(tip => {
  console.log(tip); // Each tip should be Hindi or English
});
```
✅ **Verify:** Advice is relevant and actionable

---

## 🧪 MODULE 5: SCHEME MATCHER TESTING

### Test 5.1: Load Schemes
```typescript
import schemes from "@/data/schemes.json";

console.log(schemes.length); // Should be 8
console.log(schemes[0].name); // "PM Mudra Yojana Shishu" or similar
console.log(schemes[0].maxLoan); // 50000
```
✅ **Verify:** All 8 schemes loaded correctly

### Test 5.2: Scheme Data Structure
```typescript
const scheme = schemes[0];

// Required fields
console.log(scheme.id);                 // ✅
console.log(scheme.name);               // ✅
console.log(scheme.nameHi);             // ✅ Hindi translation
console.log(scheme.maxLoan);            // ✅ 50000
console.log(scheme.interestRate);       // ✅ 8-10%
console.log(scheme.eligibility);        // ✅ Array of rules
console.log(scheme.benefits);           // ✅ Array of benefits
console.log(scheme.locations);          // ✅ Array of areas
```
✅ **Verify:** All required fields present

### Test 5.3: Matching Algorithm
```typescript
import { getTopSchemes } from "@/lib/schemeMatcher";

// Test Profile: Rural Female Tailor
const profile = {
  income: 25000,
  occupation: "tailor",
  gender: "female",
  location: "rural",
  age: 35,
  hasOwnBusiness: true,
  businessType: "tailoring",
  isGroupMember: false
};

const matches = await getTopSchemes(profile, 3);

// Expected:
// [
//   { name: "PM Mudra Yojana Shishu", score: 90-100 },
//   { name: "PM Mudra Yojana Kishor", score: 85-95 },
//   { name: "Stand-Up India", score: 80-90 }
// ]
```
✅ **Verify:** Top schemes match user profile well

### Test 5.4: Eligibility Check
```typescript
import { checkEligibility } from "@/lib/schemeMatcher";

const check = checkEligibility(profile, schemes[0]); // Mudra Shishu

console.log(check);
// Expected:
// {
//   isEligible: true,
//   reasons: ["Income within limit", "Occupation match"],
//   concerns: []
// }
```
✅ **Verify:** Eligibility logic correct

### Test 5.5: Scheme Recommendations Page
```
Navigate to: /financial-dashboard
Scroll to: "Recommended Schemes" section
Expected:
- Show 3 schemes
- Display match score percentage
- Show max loan amount
- Show interest rate
- Include scheme name in Hindi/English
```
✅ **Verify:** Display matches algorithm results

---

## 🧪 MODULE 6: BUDGET TRACKER PAGE TESTING

### Test 6.1: Navigate to Page
```
URL: http://localhost:5173/budget
Expected:
- Page loads without errors
- No console errors in DevTools
- Shows income section
- Shows expenses area
- Shows charts area
```
✅ **Verify:** Page structure complete

### Test 6.2: Income Input
1. Click "Update Income" button
2. Dialog opens with input field
3. Enter: `30000`
4. Click "Save"
5. **Expected:**
   - Dialog closes
   - Income shows as "₹30,000"
   - Green indicator
   - Card shows monthly amount

✅ **Verify:** Income saved and displayed

### Test 6.3: Add Expenses
1. Click "Add Expense" button
2. Dialog opens
3. Select category: "🍜 Food"
4. Enter amount: `5000`
5. Enter description: "Groceries"
6. Click "Add"
7. **Expected:**
   - Expense appears in list
   - Total expenses updated
   - Savings recalculated
   - Chart updates

✅ **Verify:** Expense added correctly

### Test 6.4: Multiple Expenses
1. Add 5 different expenses:
   - Food: 5000
   - Housing: 8000
   - Transport: 2000
   - Utilities: 1500
   - Healthcare: 1000
2. **Expected:**
   - All appear in list
   - Total = 17500
   - Savings updated correctly
   - Pie chart updated with all categories

✅ **Verify:** All expenses tracked

### Test 6.5: Delete Expense
1. Hover over any expense in list
2. Click delete/trash icon
3. **Expected:**
   - Expense removed
   - Total recalculated
   - Chart updates
   - No confirm dialog (auto-delete)

✅ **Verify:** Delete works smoothly

### Test 6.6: Pie Chart
1. Add multiple expenses
2. **Expected:**
   - Chart updates in real-time
   - Categories color-coded
   - Percentages show correctly
   - Legend visible
   - Responsive sizing

✅ **Verify:** Chart displays correctly

### Test 6.7: Health Score Integration
1. Add income: ₹30,000
2. Add expenses: ₹20,000 total
3. **Expected:**
   - Health score card appears
   - Score = 72 (Good)
   - Shows savings ratio (33%)
   - Shows metrics
   - Color is blue

✅ **Verify:** Health score integrated

### Test 6.8: Real-time Updates
1. Change income
2. **Expected:** Components update instantly
3. Add/remove expense
4. **Expected:** Health score recalculates immediately

✅ **Verify:** No delays or lag

### Test 6.9: Mobile View
1. Open DevTools → Mobile view
2. Test on iPhone SE, Pixel 4
3. **Expected:**
   - All buttons clickable
   - Text readable
   - Chart responsive
   - Dialogs fit screen
   - No horizontal scrolling

✅ **Verify:** Mobile-responsive

---

## 🧪 MODULE 7: FINANCIAL DASHBOARD PAGE TESTING

### Test 7.1: Navigate to Dashboard
```
URL: http://localhost:5173/financial-dashboard
Expected:
- Page loads completely
- Shows 4 KPI cards
- Charts render
- Scheme list visible
- No console errors
```
✅ **Verify:** Full page loads

### Test 7.2: KPI Cards
1. **Expected cards:**
   - Monthly Income
   - Monthly Savings
   - Safe Loan Amount
   - Yearly Projection
2. **Each shows:**
   - Amount with ₹ symbol
   - Previous value (trend)
   - Color indicator

✅ **Verify:** All KPIs display correctly

### Test 7.3: Income Setup
1. Click "Update Profile" button
2. Dialog opens
3. Enter income: `50000`
4. Enter expenses: `30000`
5. Click "Calculate"
6. **Expected:**
   - Dialog closes
   - KPI cards update
   - Charts refresh
   - New values displayed

✅ **Verify:** Profile update works

### Test 7.4: 6-Month Projection Chart
1. Set income and expenses
2. **Expected:**
   - AreaChart renders
   - Shows 7 data points (current + 6 months)
   - X-axis: Month numbers
   - Y-axis: Savings amount
   - Area filled with gradient
   - Tooltip on hover

✅ **Verify:** Chart displays correctly

### Test 7.5: Yearly Growth Chart
1. Set financial data
2. **Expected:**
   - LineChart renders
   - Blue line (savings)
   - Red line (with interest)
   - 3 data points (now, 6mo, 1yr)
   - Legend visible
   - Both lines visible

✅ **Verify:** Comparison works

### Test 7.6: Health Score Sidebar
1. Look at right sidebar
2. **Expected:**
   - HealthScoreCard component
   - Full mode display
   - Score circle
   - Metrics cards
   - Strengths/issues
   - Recommendations

✅ **Verify:** Health display complete

### Test 7.7: Recommended Schemes
1. Look at "Recommended Schemes" section
2. **Expected:**
   - Shows 3 schemes
   - Each has:
     - Scheme name
     - Match score percentage
     - Max loan amount
     - Interest rate
     - Brief description
   - Ranked by score

✅ **Verify:** Scheme recommendations correct

### Test 7.8: EMI Calculator
1. Look at "Loan EMI Calculator" section
2. **Expected:**
   - Shows sample scenarios
   - Calculates EMI for max loan
   - Shows monthly payment
   - Shows total interest
   - Shows repayment schedule hint
   - All values realistic

✅ **Verify:** Calculator works

### Test 7.9: Safe Borrowing Guide
1. Look at info section
2. **Expected:**
   - Explains 50% rule
   - Shows example calculation
   - Gives safe practices
   - Mentions risk level

✅ **Verify:** Educational content present

---

## 🧪 MODULE 8: HEALTH SCORE CARD COMPONENT TESTING

### Test 8.1: Compact Mode
```tsx
<HealthScoreCard 
  health={healthData} 
  mode="compact" 
/>
```
**Expected:**
- Small circular score display
- Status indicator
- Minimal space usage
- No detailed metrics

✅ **Verify:** Compact mode works

### Test 8.2: Full Mode
```tsx
<HealthScoreCard 
  health={healthData} 
  mode="full" 
/>
```
**Expected:**
- Large score circle
- 4 metric cards
- Strengths section
- Issues section
- Recommendations
- All text visible

✅ **Verify:** Full mode complete

### Test 8.3: Color Coding
1. Test with score = 90
2. **Expected:** Green color (Excellent)
3. Test with score = 50
4. **Expected:** Yellow color (Fair)
5. Test with score = 30
6. **Expected:** Red color (Poor)

✅ **Verify:** Color scheme correct

### Test 8.4: Animations
1. Component mounts
2. **Expected:** Score animates from 0 to final
3. Progress bar animates
4. Cards fade in
5. No janky animations

✅ **Verify:** Smooth animations

### Test 8.5: Text Content
1. Check all text displays
2. **Expected:**
   - Hindi translations correct
   - Advice specific to user
   - Issues realistic
   - Strengths positive

✅ **Verify:** Content accurate

---

## 🧪 MODULE 9: VOICE-FIRST DESIGN TESTING

### Test 9.1: Button Sizes
1. Open Budget Tracker
2. Measure button height
3. **Expected:** ≥ 44px
4. Measure touch target
5. **Expected:** ≥ 44×44px

✅ **Verify:** Touch-friendly

### Test 9.2: Font Sizes
1. Check body text
2. **Expected:** ≥ 16px (readable on feature phones)
3. Check headings
4. **Expected:** ≥ 24px (clear hierarchy)

✅ **Verify:** Readable

### Test 9.3: Color Contrast
1. Open DevTools → Lighthouse
2. Run Accessibility audit
3. **Expected:** WCAG AA pass
4. Contrast ratio ≥ 4.5:1 for text

✅ **Verify:** Accessible

### Test 9.4: Microphone Access
1. Click voice assistant mic button
2. **Expected:** Browser asks "Allow microphone?"
3. Grant permission
4. **Expected:** Ready to speak

✅ **Verify:** Permissions work

### Test 9.5: Keyboard Navigation
1. Press Tab key
2. **Expected:** Focus visible on buttons
3. Press Enter
4. **Expected:** Button activates
5. Tab through all interactive elements

✅ **Verify:** Keyboard accessible

### Test 9.6: Language Switching
1. Open LanguageSelector
2. Select "हिन्दी"
3. **Expected:**
   - All UI text in Hindi
   - Voice assistant speaks Hindi
   - Scheme names in Hindi
4. Switch back to English
5. **Expected:** English restored

✅ **Verify:** I18n works

### Test 9.7: Error Messages (Hindi)
1. Disconnect internet
2. Try to send message in Voice Assistant
3. **Expected:** Error in Hindi: "मुझसे जुड़ने में समस्या है"
4. Try to load scheme with error
5. **Expected:** All errors in selected language

✅ **Verify:** Error localization

---

## 🧪 MODULE 10: COMPLETE INTEGRATION TESTING

### Test 10.1: Full User Journey
```
Scenario: New rural woman exploring finances
1. Lands on homepage (http://localhost:5173)
2. Clicks "Dashboard" → /dashboard
3. Notices floating voice button (VO1)
4. Clicks voice button open
5. Clicks demo prompt: "How to save?"
6. Gets AI response
7. Clicks "Budget Tracker" in nav
8. Sets income: ₹30,000
9. Adds expenses: ₹20,000
10. Sees health score: Good (72)
11. Clicks "Dashboard" link
12. Sees financial projection
13. Sees recommended schemes
14. Sees PM Mudra Yojana recommended
15. Reads scheme details
16. Gets EMI calculation
17. Feels confident about savings plan
```
✅ **Verify:** Complete journey smooth

### Test 10.2: Data Persistence
1. Add income and expenses on Budget page
2. Navigate to Dashboard
3. **Expected:** Data still there
4. Refresh page (F5)
5. **Expected:** Data persists (localStorage)
6. Close and reopen browser
7. **Expected:** Data still there

✅ **Verify:** Local storage working

### Test 10.3: All Pages Accessible
- [ ] Home page: http://localhost:5173/
- [ ] Dashboard: http://localhost:5173/dashboard
- [ ] Budget: http://localhost:5173/budget
- [ ] Financial: http://localhost:5173/financial-dashboard
- [ ] All pages load without errors

✅ **Verify:** All routes work

### Test 10.4: Voice Assistant Available Everywhere
1. Go to home page
2. **Expected:** Floating voice button visible
3. Go to dashboard
4. **Expected:** Floating voice button visible
5. Go to budget
6. **Expected:** Floating voice button visible
7. Go to financial dashboard
8. **Expected:** Floating voice button visible

✅ **Verify:** Global component works

### Test 10.5: No Console Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Navigate through all pages
4. **Expected:** No red errors
5. Click all interactive elements
6. **Expected:** Only logged messages (no errors)

✅ **Verify:** Clean code

### Test 10.6: Performance
```bash
# Lighthouse audit
1. Open DevTools → Lighthouse
2. Run audit
3. Expected scores:
   - Performance: ≥ 80
   - Accessibility: ≥ 90
   - Best Practices: ≥ 90
   - SEO: ≥ 80
```
✅ **Verify:** Good performance

### Test 10.7: Mobile Performance
1. Open DevTools
2. Set throttling to "Slow 4G"
3. Navigate pages
4. **Expected:** Still functional, slight lag acceptable
5. Charts load within 2 seconds
6. Voice responds within 5 seconds

✅ **Verify:** Works on slow networks

---

## 🐛 Troubleshooting

### Issue: No voice button visible
**Solution:**
- Check VoiceAssistant imported in App.tsx
- Verify it's rendered outside Routes
- Check z-index in CSS (should be high)

### Issue: API returns error
**Solution:**
- Verify GOOGLE_API_KEY set in environment
- Check API key is valid (visit Google Cloud console)
- Verify network accessible from your location
- Check API quotas not exceeded

### Issue: Microphone not working
**Solution:**
- Grant microphone permission in browser
- Check no other app using microphone
- Verify browser supports Web Speech API
- Check language is supported (en-IN, hi-IN)

### Issue: Charts not showing
**Solution:**
- Verify data is being set
- Check console for Recharts errors
- Verify window size (charts need space)
- Try hard refresh (Ctrl+Shift+R)

### Issue: Health score incorrect
**Solution:**
- Verify income > expenses
- Check calculations match manual math
- Clear localStorage: `localStorage.clear()`
- Recalculate all values

---

## ✅ Final Sign-Off Checklist

Before deploying to production:

- [ ] All 10 modules tested
- [ ] No console errors
- [ ] All pages responsive
- [ ] Voice working on both languages
- [ ] Financial calculations verified
- [ ] Scheme data complete
- [ ] API responding correctly
- [ ] Health score accurate
- [ ] No broken links
- [ ] All animations smooth
- [ ] Mobile tested
- [ ] Data persists
- [ ] Error handling works
- [ ] Accessibility audit passes
- [ ] Performance audit passes

---

**System ready for production deployment! 🚀**
