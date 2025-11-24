# OTP King - Setup & Admin Guide

## Admin Access

### Admin Panel Login
- **URL:** `/admin` (accessible after login if user is admin)
- **Username:** `idledev`
- **Password:** `200715`

The admin panel provides full management of the platform:
- **Statistics:** View platform usage, user metrics
- **Numbers:** Manage virtual phone numbers and uploads
- **API Settings:** Configure external API credentials
- **Users:** View all users and manage bans
- **Notifications:** Send user notifications
- **Announcements:** Post system announcements
- **Wallet & Pricing:** Set credit prices (how much ₦ per credit)
- **Gift Codes:** Create and manage gift codes with limits and expiry dates

## Wallet System

### For Users
Users can access the wallet at `/wallet` (requires login). Features:

1. **Purchase Credits (Buy Tab)**
   - Buy 1000 Credits for ₦1000 (default)
   - Buy 5000 Credits for ₦5000 (default)
   - Buy 10000 Credits for ₦10000 (default)
   - Payment via Paystack integration
   - Credits automatically added after successful payment

2. **Redeem Gift Codes (Gift Code Tab)**
   - Enter a gift code to claim free credits
   - Codes have usage limits and expiry dates
   - Cannot claim expired or exhausted codes

3. **Transaction History**
   - View all wallet transactions
   - See purchase history and gift code claims
   - Track credit usage

### For Admins (Wallet Management)
Admin can:
1. **Update Credit Pricing** (`/admin/wallet`)
   - Set the price per credit in Naira (₦)
   - Affects all future credit packages
   - Default: 1 credit = ₦1

2. **Create Gift Codes** (`/admin/giftcodes`)
   - Set gift code (e.g., WELCOME100)
   - Set credits amount users receive
   - Set max claims (how many users can claim it)
   - Set expiry date
   - Can delete active gift codes

## Payment Integration

### Paystack Configuration
- **Public Key:** `pk_live_efa6b01e6086e21bda6762026dcaec02dd4f669a`
- **Backend Key:** Set as environment variable `PAYSTACK_KEY`
- Payment flow:
  1. User selects package and clicks "Buy Now"
  2. Redirects to Paystack payment page
  3. After successful payment, credits are added
  4. Transaction is recorded in database
  5. Admin receives deposit notification

### Testing Paystack Integration
- Use Paystack test cards or live account
- Verify payment in Paystack dashboard
- Check transaction history in wallet page
- Admin can view transaction stats in Wallet Management

## Database Schema

### New Tables
- **gift_codes**: Stores gift codes with claims tracking
- **wallet_transactions**: Records all wallet-related transactions

### Key Fields
```
Gift Codes:
- code: Unique code
- creditsAmount: Credits to award
- maxClaims: Max number of claims
- claimedCount: Current claims
- expiryDate: When code expires
- isActive: Whether code is usable

Wallet Transactions:
- userId: User who made transaction
- type: purchase, giftcode, referral, admin, usage
- amount: Credits amount
- description: Transaction details
- status: completed, pending, failed
- transactionId: Paystack reference (for purchases)
```

## Environment Variables

Required:
- `DATABASE_URL`: PostgreSQL connection
- `PAYSTACK_KEY`: Paystack secret key (backend)
- `VITE_PAYSTACK_KEY`: Paystack public key (frontend)
- `SESSION_SECRET`: Session encryption key

## Testing Checklist

### User Flow
- [ ] Sign up new account
- [ ] Login with credentials
- [ ] Access wallet page
- [ ] View credit balance in header
- [ ] See transaction history (empty on new account)

### Purchase Flow
- [ ] Click wallet icon or badge
- [ ] Navigate to Purchase tab
- [ ] Select a package
- [ ] Complete Paystack payment
- [ ] Verify credits added to account
- [ ] Verify transaction in history

### Gift Code Flow
- [ ] Create test gift code in admin panel
- [ ] Logout and create new user
- [ ] Login with new user
- [ ] Navigate to wallet Gift Code tab
- [ ] Enter gift code
- [ ] Verify credits claimed
- [ ] Verify transaction recorded
- [ ] Try claiming same code again (should fail if maxClaims reached)

### Admin Panel
- [ ] Login as admin
- [ ] View all admin pages
- [ ] Update credit pricing
- [ ] Create new gift code
- [ ] View gift code claims
- [ ] Delete gift code

## Feature Details

### Credit System
- 1 credit = ₦1 (configurable by admin)
- Users see balance in header
- Balance depletes when using virtual numbers
- Wallet transactions tracked with timestamps

### Gift Code System
- Codes are case-insensitive but displayed uppercase
- Max claims prevents unlimited redemptions
- Expiry dates prevent old codes from working
- Admin can toggle codes on/off without deleting
- Claims tracked automatically

### Paystack Integration
- All transactions secure via Paystack
- Transaction reference stored for verification
- Payment status tracked
- Automatic credit addition on successful payment
- Supports Naira currency

## Support & Troubleshooting

### Common Issues
1. **Paystack payment fails**: Check public key in VITE_PAYSTACK_KEY
2. **Gift code won't work**: Check if expired or max claims reached
3. **Credits not updating**: Verify payment was successful in Paystack

### Admin Features Not Visible
- User must have `isAdmin = true` in database
- Default admin: username `idledev`, password `200715`

## API Endpoints

### Public
- `GET /api/wallet/pricing` - Get current credit price

### Protected (User)
- `GET /api/wallet/transactions` - Get user's transactions
- `POST /api/wallet/verify-payment` - Verify Paystack payment
- `POST /api/wallet/claim-giftcode` - Claim gift code

### Protected (Admin)
- `GET /api/admin/wallet/stats` - Wallet statistics
- `POST /api/admin/wallet/pricing` - Update credit price
- `GET /api/admin/giftcodes` - List all gift codes
- `POST /api/admin/giftcodes` - Create gift code
- `PATCH /api/admin/giftcodes/:id/toggle` - Toggle gift code
- `DELETE /api/admin/giftcodes/:id` - Delete gift code
