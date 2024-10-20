"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AHHHHBACKKKKK() {
    const router = useRouter();
    return (
        <Button variant="outline" onClick={() => router.back()} className="w-full px-4 mt-8 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
    );
}