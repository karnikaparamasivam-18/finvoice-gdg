# Quick Reference - Firestore Sync Implementation

## What Changed?

Your app now **syncs all data to Firestore** instead of just storing in localStorage. When members update their balance, take loans, or make repayments, changes are immediately saved to Firestore.

---

## How It Works

### **On App Start:**
- Hook loads groupId from localStorage
- Fetches group data from Firestore
- Fetches all members from Firestore
- Updates local Zustand store

### **During Operations:**
1. User action (voice command, manual input)
2. Update Zustand store (instant local update)
3. Call Firestore service function (persistent save)
4. Show success/error notification

### **Data Locations:**
- **Zustand Store** = Local state (instant, in-memory)
- **localStorage** = Backup for groupId
- **Firestore** = Source of truth (persistent, backed up)

---

## New Files & Functions

### New Hook
```typescript
// src/hooks/useLoadFromFirestore.ts
useLoadFromFirestore() // Called in App.tsx to load data on startup
```

### New Backend Functions
```typescript
// src/backend/groups/group.service.ts
getGroup(groupId) // Fetch group from Firestore

// src/backend/members/members.service.ts
getMembersFromGroup(groupId) // Fetch all members
updateMemberBalanceInFirestore(groupId, memberId, newBalance)
updateMemberLoanInFirestore(groupId, memberId, newLoan, interestRate)
recordLoanRepaymentInFirestore(groupId, memberId, repaymentAmount, newLoan, repayments)
```

### New Zustand Store Functions
```typescript
setMembers(members) // Load members from Firestore
setTotalBalance(balance) // Set total balance
setTotalLoanBalance(balance) // Set total loan balance
updateMemberBalanceByName(name, amount) // For voice commands
addLoanByName(name, amount, interestRate) // For voice commands
addLoanRepaymentByName(name, amount) // For voice commands
```

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/App.tsx` | Added useLoadFromFirestore hook call |
| `src/store/appStore.ts` | Added new setter functions, refactored actions |
| `src/backend/groups/group.service.ts` | Added getGroup() function |
| `src/backend/members/members.service.ts` | Added 4 new sync functions |
| `src/components/Dashboard.tsx` | Added Firestore sync to voice commands |
| `src/components/GroupSetupPage.tsx` | Save groupId to localStorage |
| `src/hooks/useLoadFromFirestore.ts` | **NEW** - Data loading hook |

---

## Testing Your Changes

### 1. Create a New Group
- App saves groupId to localStorage
- Check Firestore Console: `/groups/{groupId}` should exist

### 2. Add Members
- App creates members with unique IDs
- Check Firestore: `/groups/{groupId}/members/{memberId}` should exist

### 3. Use Voice Commands
```
"Priya add 500" 
  → Updates balance in Firestore
  
"Priya loan 1000"
  → Saves loan amount in Firestore

"Priya repay 500"
  → Updates loan repayments array in Firestore
```

### 4. Refresh Page
- Data should load from Firestore (not localStorage)
- All member balances/loans should be correct

---

## Firestore Database Check

Open [Firebase Console](https://console.firebase.google.com/) → Firestore Database

**Expected Structure:**
```
groups/
  └─ {groupId}
     ├─ name: "Group Name"
     ├─ memberCount: 5
     ├─ meetingFrequency: "weekly"
     ├─ firstMeetingDate: "2024-01-15"
     ├─ contributionAmount: 500
     ├─ createdBy: "user-uid"
     ├─ createdAt: timestamp
     ├─ updatedAt: timestamp (added when syncing)
     └─ members/ (subcollection)
        └─ {memberId}
           ├─ name: "Priya"
           ├─ address: "123 Main St"
           ├─ balance: 2500 ✅ (synced from app)
           ├─ loan: 1000 ✅ (synced from app)
           ├─ loanInterestRate: 12 ✅ (synced from app)
           ├─ loanRepayments: [...] ✅ (synced from app)
           ├─ createdAt: timestamp
           └─ updatedAt: timestamp (added when syncing)
```

---

## Troubleshooting

### Problem: Changes not appearing in Firestore
**Solution:**
1. Check browser console for errors
2. Verify Firebase credentials in `src/firebase/firebase.ts`
3. Check Firebase project rules allow writes from authenticated users
4. Ensure user is logged in (navigate to /auth first)

### Problem: Data not loading on app start
**Solution:**
1. Verify groupId is saved to localStorage
2. Open DevTools → Application → LocalStorage → Check for 'groupId'
3. Check if group exists in Firestore with correct ID
4. Look for errors in browser console

### Problem: Voice commands not syncing
**Solution:**
1. Check that group and members exist in Firestore
2. Check browser console for async errors
3. Verify memberId is being found correctly
4. Check Firestore security rules allow updates

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    APP INITIALIZATION                       │
├─────────────────────────────────────────────────────────────┤
│  1. useAuth() → Check authentication                        │
│  2. useLoadFromFirestore() → Load group & members           │
│  3. Update Zustand store with Firestore data                │
│  4. Render UI with fresh data                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  USER PERFORMS ACTION                       │
├─────────────────────────────────────────────────────────────┤
│  Voice Command: "Priya add 500"                             │
│         ↓                                                    │
│  1. Parse input → Find member → Extract amount              │
│  2. updateMemberBalanceByName() → Update Zustand            │
│  3. updateMemberBalanceInFirestore() → Sync to Firestore    │
│  4. Show toast notification                                 │
│  5. UI updates instantly from Zustand                       │
│  6. Firestore persists change                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE                         │
├─────────────────────────────────────────────────────────────┤
│  ✅ Zustand (in-memory) - Instant UI updates               │
│  ✅ localStorage - Backup for groupId                       │
│  ✅ Firestore - Source of truth, cloud backed               │
│  ✅ Browser refresh - Reloads from Firestore               │
└─────────────────────────────────────────────────────────────┘
```

---

## Important Notes

1. **Zustand + Firestore = Best of Both Worlds**
   - Zustand for instant UI updates (no lag)
   - Firestore for persistent storage (cloud backup)

2. **Offline Mode**
   - If internet disconnects, Zustand state persists locally
   - Changes sync to Firestore when reconnected

3. **Voice Commands Work as Before**
   - Same voice input parsing
   - Now also saves to Firestore
   - User sees instant UI update + persistent storage

4. **Refresh Page = Fresh Load from Firestore**
   - Verify data persistence
   - Check that calculations are correct

---

## Next Steps (Optional Improvements)

- [ ] Add real-time listeners with `onSnapshot()` for live sync across devices
- [ ] Implement Firestore transactions for multi-step operations
- [ ] Add data validation before Firestore writes
- [ ] Create audit logs for financial transparency
- [ ] Add offline sync queue for better offline support
