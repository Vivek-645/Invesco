import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useApiClient } from '../hooks/useApiClient';
import type { UpsertUserPayload } from '../types/user';

/**
 * Component that automatically syncs Clerk user data to backend
 * This runs once when user signs in and upserts their data
 */
export function SyncUserToBackend() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { upsertUser } = useApiClient();
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  // Reset synced state when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      setSynced(false);
      setIsSyncing(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    async function syncUser() {
      // Only sync once per session when user is loaded and signed in
      if (!isLoaded || !isSignedIn || !user || isSyncing || synced) {
        return;
      }

      try {
        setIsSyncing(true);

        console.log('🔄 Syncing user to backend:', user.primaryEmailAddress?.emailAddress);

        const payload: UpsertUserPayload = {
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          imageUrl: user.imageUrl,
          phone: user.primaryPhoneNumber?.phoneNumber,
          metadata: {
            username: user.username,
          },
        };

        console.log('📤 Payload:', payload);

        const response = await upsertUser(payload);
        
        console.log('✅ Backend response:', response);

        if (response.data.isNewUser) {
          console.log('✓ New user created in backend');
        } else {
          console.log('✓ Existing user data synced to backend');
        }
        
        setSynced(true);
      } catch (err) {
        console.error('❌ Failed to sync user:', err);
        // Don't retry - just mark as synced to prevent infinite loop
        setSynced(true);
      } finally {
        setIsSyncing(false);
      }
    }

    syncUser();
    // Only depend on user ID changes, not the entire user object or functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user?.id]);

  // Silent sync - no UI needed
  return null;
}
