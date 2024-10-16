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
      setError("Failed to read NFC: " + (error instanceof Error ? error.message : String(error)) + ". Please try again or ensure your device supports NFC.");
      setIsReading(false);
    }
  };

  const fetchUserDetails = async () => {
    setError(null);
    setUserDetails(null);
    setLoading(true);

    try {
      if (!prn || prn.length < 8) {
        throw new Error("Invalid PRN entered. Please ensure PRN is at least 8 characters long.");
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, id')
        .eq('prn', prn)
        .single();

      if (error) throw error;

      if (data) {
        setUserDetails({
          full_name: data.full_name,
        });
      } else {
        throw new Error("No user found with the given PRN. Please check and try again.");
      }
    } catch (error) {
      setError((error instanceof Error ? error.message : String(error)) + ". The user does not exist in the database.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails || !nfcData) {
      setError("Please ensure a valid user is found and NFC tag is scanned before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ rfid_tag: nfcData.serialNumber })
        .eq('prn', prn)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // Show the success toast
        toast({
          title: "Success",
          description: `RFID tag (${nfcData.serialNumber}) assigned to user ${userDetails.full_name} with PRN: ${prn}`,
        });

        // Delay clearing the form fields after showing the toast
        setTimeout(() => {
          setPrn('');
          setNfcData(null);
          setUserDetails(null);
        }, 1000);  // Adjust the delay if necessary
      } else {
        throw new Error("No user found with the given PRN. Please try again.");
      }
    } catch (error) {
      setError("Error assigning NFC tag: " + (error instanceof Error ? error.message : String(error)) + ". Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen p-6">
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
                onChange={(e) => setPrn(e.target.value)}
                placeholder="Enter PRN"
                required
              />
            </div>
            <Button 
              type="button" 
              onClick={fetchUserDetails} 
              disabled={loading || prn.length < 8}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search User'
              )}
            </Button>
            {userDetails && (
              <Alert>
                <AlertDescription>
                  Full Name: {userDetails.full_name}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Button 
                type="button" 
                onClick={handleReadNFC} 
                disabled={isReading || !userDetails}
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
