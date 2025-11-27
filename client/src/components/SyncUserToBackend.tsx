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

        const response = await upsertUser(payload);
        
        if (response.data.isNewUser) {
          console.log('✓ New user created in backend');
        } else {
          console.log('✓ Existing user data synced to backend');
        }
        
        setSynced(true);
      } catch (err) {
        console.error('Failed to sync user:', err);
        // Don't show error to user, just log it
      } finally {
        setIsSyncing(false);
      }
    }

    syncUser();
  }, [isLoaded, isSignedIn, user?.id, synced]);

  // Silent sync - no UI needed
  return null;
}
