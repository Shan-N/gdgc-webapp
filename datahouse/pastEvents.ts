export interface PastEvent {
    id: string;
    title: string;
    date: string;
    recordingUrl?: string;
  }
  
  export const pastEvents: PastEvent[] = [
    {
      id: "101",
      title: "Gen AI Workshop",
      date: "Oct 16 & 23, 2024",
      recordingUrl: "#"
    },
    {
      id: "102",
      title: "AR/VR Workshop",
      date: "Oct 03, 2024",
      recordingUrl: "#"
    },
    {
      id: "103",
      title: "Induction",
      date: "Sept 30, 2024",
      recordingUrl: "#"
    }
  ];