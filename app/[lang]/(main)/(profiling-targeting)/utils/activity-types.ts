// Activity types and interfaces
export type ActivityType = "giveaways" | "promotional" | "pfp";

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  cost: number;
  createdAt: Date;
}

export const ACTIVITY_TYPES: { value: ActivityType; label: string; color: string }[] = [
  { value: "giveaways", label: "Giveaways", color: "bg-green-100 text-green-800" },
  { value: "promotional", label: "Promotional", color: "bg-blue-100 text-blue-800" },
  { value: "pfp", label: "PFP", color: "bg-primary-100 text-primary" },
];

// Sample data for demonstration
export const SAMPLE_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "giveaways",
    description: "Free product samples distribution to customers",
    cost: 5000,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2", 
    type: "promotional",
    description: "Social media campaign for new product launch",
    cost: 15000,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    type: "pfp",
    description: "Pay for performance marketing campaign",
    cost: 25000,
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "4",
    type: "giveaways",
    description: "Customer loyalty rewards program",
    cost: 8000,
    createdAt: new Date("2024-02-01"),
  }
];
