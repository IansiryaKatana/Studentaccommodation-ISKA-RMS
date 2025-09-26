# Campaign Deletion Fix - Complete Solution

## Issue
Campaign deletion fails with foreign key constraint error:
```
Key is still referenced from table "email_deliveries"
```

## Solutions

### Solution 1: Browser Cache Issue (Most Likely)
The updated API service code might not be loaded in the browser due to caching.

**Steps:**
1. **Hard Refresh**: Press `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
2. **Clear Cache**: Open DevTools > Application > Storage > Clear storage
3. **Restart Dev Server**: The development server is already restarting

### Solution 2: Manual Deletion (Immediate Fix)
If the cache issue persists, use this manual solution:

1. **Open Browser Console** (F12)
2. **Copy and paste this script**:

```javascript
async function deleteCampaignWithDeliveries(campaignId) {
  try {
    console.log('🗑️ Manually deleting campaign:', campaignId);
    
    // First, delete all related email deliveries
    console.log('🗑️ Deleting related email deliveries...');
    const { error: deliveriesError } = await window.supabase
      .from('email_deliveries')
      .delete()
      .eq('campaign_id', campaignId);

    if (deliveriesError) {
      console.error('❌ Error deleting email deliveries:', deliveriesError);
      return;
    }

    console.log('✅ Email deliveries deleted successfully');

    // Then delete the campaign
    console.log('🗑️ Deleting email campaign...');
    const { error: campaignError } = await window.supabase
      .from('email_campaigns')
      .delete()
      .eq('id', campaignId);

    if (campaignError) {
      console.error('❌ Error deleting email campaign:', campaignError);
      return;
    }

    console.log('✅ Email campaign deleted successfully');
    
    // Refresh the page to update the UI
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Error in deleteCampaignWithDeliveries:', error);
  }
}
```

3. **Use the function**:
```javascript
deleteCampaignWithDeliveries('b379e970-35df-4973-97f2-aaf2116ddd9c');
```

### Solution 3: Database Direct Fix
If both above solutions fail, use direct database access:

1. **Go to Supabase Dashboard**
2. **Navigate to Table Editor**
3. **Find the campaign ID** in `email_campaigns` table
4. **Delete related records** in `email_deliveries` table first
5. **Then delete** the campaign record

## Updated API Service Code

The API service has been updated with proper foreign key handling:

```typescript
static async deleteEmailCampaign(id: string): Promise<void> {
  try {
    // First, delete all related email deliveries
    console.log('🗑️ Deleting related email deliveries for campaign:', id);
    const { error: deliveriesError } = await supabase
      .from('email_deliveries')
      .delete()
      .eq('campaign_id', id);

    if (deliveriesError) {
      console.error('Error deleting email deliveries:', deliveriesError);
      throw deliveriesError;
    }

    console.log('✅ Email deliveries deleted successfully');

    // Then delete the campaign
    console.log('🗑️ Deleting email campaign:', id);
    const { error: campaignError } = await supabase
      .from('email_campaigns')
      .delete()
      .eq('id', id);

    if (campaignError) {
      console.error('Error deleting email campaign:', campaignError);
      throw campaignError;
    }

    console.log('✅ Email campaign deleted successfully');
  } catch (error) {
    console.error('Error in deleteEmailCampaign:', error);
    throw error;
  }
}
```

## Verification Steps

After applying any solution:

1. **Check Console Logs**: Look for the deletion success messages
2. **Verify UI Update**: Campaign should disappear from the list
3. **Test New Deletion**: Try deleting another campaign to confirm the fix

## Prevention

The fix ensures that:
- ✅ Related email deliveries are deleted first
- ✅ Foreign key constraints are respected
- ✅ Proper error handling and logging
- ✅ UI updates after successful deletion

## Status
- 🔧 **API Service**: Updated with proper foreign key handling
- 🔄 **Dev Server**: Restarting to load new code
- 📝 **Manual Solution**: Available for immediate use
- ✅ **Long-term Fix**: Implemented in the codebase

