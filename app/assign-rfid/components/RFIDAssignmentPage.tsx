"use client";

import React, { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const supabase = createClient();

type NFCData = {
  serialNumber: string;
  standard: string;
  type: string;
  sak: string;
  atqa: string;
};

type NDEFReadingEvent = {
  serialNumber: string;
  message: {
    records: Array<{
      recordType: string;
      data: ArrayBuffer;
    }>;
  };
};

type UserDetails = {
  full_name: string | null;
  email: string | null;
};

declare global {
  interface Window {
    NDEFReader: {
      new(): NDEFReader;
    };
  }
}

interface NDEFReader {
  scan: () => Promise<void>;
  addEventListener: (event: string, callback: (event: NDEFReadingEvent) => void) => void;
  removeEventListener: (event: string, callback: (event: NDEFReadingEvent) => void) => void;
}

const NFCAssignmentPage: React.FC = () => {
  const [prn, setPrn] = useState('');
  const [nfcData, setNfcData] = useState<NFCData | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReadNFC = async () => {
    setIsReading(true);
    setError(null);

    try {
      if ('NDEFReader' in window) {
        const ndef = new window.NDEFReader();
        await ndef.scan();

        ndef.addEventListener("reading", ({ serialNumber }: NDEFReadingEvent) => {
          setNfcData({
            serialNumber,
            standard: "NFC",
            type: "NDEF",
            sak: "N/A",
            atqa: "N/A"
          });
          setIsReading(false);
        });
      } else {
        throw new Error("NFC is not supported on this device");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to read NFC: " + (error instanceof Error ? error.message : String(error)));
      setIsReading(false);
    }
  };

  const fetchUserDetails = async (prn: string) => {
    setError(null);
    setUserDetails(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, id')
        .eq('prn', prn)
        .single();

      if (error) throw error;

      if (data) {
        // Fetch the email from auth.users table
        const { data: userData, error: userError } = await supabase
          .from('auth.users')
          .select('email')
          .eq('id', data.id)
          .single();

        if (userError) throw userError;

        setUserDetails({
          full_name: data.full_name,
          email: userData?.email || null
        });
      } else {
        throw new Error("No user found with the given PRN");
      }
    } catch (error) {
      setError("Error fetching user details: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!nfcData) {
        throw new Error("No NFC data available. Please scan an NFC card first.");
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ nfc_tag: nfcData.serialNumber })
        .eq('prn', prn)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        toast({
          title: "Success",
          description: `NFC tag assigned to user with PRN: ${prn}`,
        });
        setPrn('');
        setNfcData(null);
        setUserDetails(null);
      } else {
        throw new Error("No user found with the given PRN");
      }
    } catch (error) {
      setError("Error: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle>NFC Assignment</CardTitle>
          <CardDescription>Assign NFC tags to users by PRN</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prn" className="text-sm font-medium">PRN</label>
              <Input
                id="prn"
                value={prn}
                onChange={(e) => {
                  setPrn(e.target.value);
                  if (e.target.value.length >= 8) { // Assuming PRN is at least 8 characters
                    fetchUserDetails(e.target.value);
                  } else {
                    setUserDetails(null);
                  }
                }}
                placeholder="Enter PRN"
                required
              />
            </div>
            {userDetails && (
              <Alert>
                <AlertDescription>
                  Full Name: {userDetails.full_name}<br />
                  Email: {userDetails.email}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Button 
                type="button" 
                onClick={handleReadNFC} 
                disabled={isReading}
                className="w-full"
              >
                {isReading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reading NFC...
                  </>
                ) : (
                  'Read NFC Tag'
                )}
              </Button>
            </div>
            {nfcData && (
              <Alert>
                <AlertDescription>
                  NFC Tag Read: {nfcData.serialNumber}
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !nfcData || !userDetails}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign NFC Tag'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFCAssignmentPage;