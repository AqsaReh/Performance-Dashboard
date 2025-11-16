"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, X, Eye, TrendingUp, Target, ChevronDown, ChevronUp, } from "lucide-react";
import Link from "next/link";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactSelectComponent } from "@/components/ui/react-select";

interface EmpDetailPageViewProps {
  empCode: string;
}

interface Doctor {
  id: string;
  name: string;
  designation: string;
  category: string;
  brickCode: string;
  forecastingAmount: number;
  budgetAmount: number;
  roi: number;
}

interface SKUDetail {
  id: string;
  sku: string;
  qty: number;
  tp: number;
  dp: number;
  activityType: "Discount" | "Bonus";
  percentage: number;
  capping: number;
  salesValue: number;
  budgetAmount: number;
}

interface Activity {
  id: string;
  activityType: "Giveaways" | "Promotional" | "PFP";
  activityList: string;
  qty: number;
  budget: number;
}

interface Customer {
  id: string;
  custCode: string;
  custName: string;
  address: string;
  alreadyTagged: boolean;
  sharePercentage: number;
  sharePercentageText: string;
  taggedDoctorName?: string;
  taggedDoctorPercentage?: number;
  remainingPercentage?: number;
}

interface Distributor {
  id: string;
  name: string;
  code: string;
}

interface SelectedCustomer {
  id: string;
  customer: Customer;
  distributorId: string;
  distributorName: string;
  distributorCode: string;
}

// Mock data
const employeeData = {
  empCode: "EMP001",
  name: "John Smith",
  territory: "North Region",
  doctorsCount: 3,
  chemistsCount: 2,
  budget: 150000,
  sales: 125000
};

const bricks = [
  {
    id: "BRK001", name: "Brick A", doctors: [
      { id: "DOC001", name: "Dr. Sarah Johnson", designation: "Cardiologist", category: "Specialist", brickCode: "BRK001" },
      { id: "DOC002", name: "Dr. Michael Chen", designation: "Neurologist", category: "Specialist", brickCode: "BRK001" }
    ]
  },
  {
    id: "BRK002", name: "Brick B", doctors: [
      { id: "DOC003", name: "Dr. Emily Rodriguez", designation: "Pediatrician", category: "General", brickCode: "BRK002" }
    ]
  },
  {
    id: "BRK003", name: "Brick C", doctors: [
      { id: "DOC004", name: "Dr. James Wilson", designation: "Dermatologist", category: "Specialist", brickCode: "BRK003" },
      { id: "DOC005", name: "Dr. Lisa Thompson", designation: "Gynecologist", category: "Specialist", brickCode: "BRK003" }
    ]
  }
];

const skuOptions = [
  {
    value: "10001138 - Kestine Liquid 60ml",
    label: "10001138 - Kestine Liquid 60ml",
    tp: 180.00,
    dp: 145.00
  },
  {
    value: "10001140 - Nebix 5mg Tablet - 20's",
    label: "10001140 - Nebix 5mg Tablet - 20's",
    tp: 320.00,
    dp: 260.00
  },
  {
    value: "10000961 - Fildil 10mg Tablet - 10's",
    label: "10000961 - Fildil 10mg Tablet - 10's",
    tp: 150.00,
    dp: 120.00
  },
  {
    value: "10000960 - Fildil 10mg Tablet - 20's",
    label: "10000960 - Fildil 10mg Tablet - 20's",
    tp: 280.00,
    dp: 220.00
  },
  {
    value: "10000962 - Fildil 10mg Tablet - 30's",
    label: "10000962 - Fildil 10mg Tablet - 30's",
    tp: 400.00,
    dp: 320.00
  },
];

// Mock data for SKU and Chemist details
const skuDetailsData = [
  { skuName: "10001138 - Kestine Liquid 60ml", qty: 100, capping: 50, tp: 25.50, dp: 20.00, amount: 2000.00 },
  { skuName: "10001140 - Nebix 5mg Tablet - 20's", qty: 75, capping: 40, tp: 30.00, dp: 25.00, amount: 1875.00 },
  { skuName: "10000961 - Fildil 10mg Tablet - 10's", qty: 50, capping: 30, tp: 15.75, dp: 12.50, amount: 625.00 },
  { skuName: "10000960 - Fildil 10mg Tablet - 20's", qty: 50, capping: 30, tp: 15.75, dp: 12.50, amount: 625.00 },
  { skuName: "10000962 - Fildil 10mg Tablet - 30's", qty: 50, capping: 30, tp: 15.75, dp: 12.50, amount: 625.00 }
];

const chemistDetailsData = [
  { custCode: "10847207", custName: "M/S IMTIAZ PHARMACY", address: "123 Main St, City", distCode: "DIST001", distName: "Central District" },
  { custCode: "107741", custName: "FAZAL DIN S PHARMA PLUS PHARMACY", address: "456 Oak Ave, Town", distCode: "DIST002", distName: "North District" },
  { custCode: "C004", custName: "MEDI CARE CENTER", address: "789 Pine Rd, Village", distCode: "DIST003", distName: "South District" }
];

// Mock data for activity lists with budget amounts
const activityListsData = {
  Giveaways: [
    { name: "Free Sample Pack", budget: 50 },
    { name: "Gift Items", budget: 25 },
    { name: "Promotional Merchandise", budget: 15 },
    { name: "Branded Accessories", budget: 30 }
  ],
  Promotional: [
    { name: "Discount Campaign", budget: 100 },
    { name: "Buy One Get One", budget: 75 },
    { name: "Seasonal Offer", budget: 60 },
    { name: "Bulk Purchase Deal", budget: 80 }
  ],
  PFP: [
    { name: "Performance Bonus", budget: 200 },
    { name: "Achievement Reward", budget: 150 },
    { name: "Target Incentive", budget: 120 },
    { name: "Sales Commission", budget: 180 }
  ]
};

// Mock data for distributors
const distributorsData = [
  { id: "1100034", name: "Premier Sales (Pvt) Ltd. (LHE)", code: "1100034" },
  { id: "1100036", name: "Premier Sales (Pvt) Ltd. (ISB)", code: "1100036" },
  { id: "1100039", name: "Premier Sales (Pvt) Ltd. (RWP)", code: "1100039" }
];

// Mock data for customers
const customersData = [
  { id: "CUST001", custCode: "10847207", custName: "M/S IMTIAZ PHARMACY", address: "123 Main St, City", alreadyTagged: true, sharePercentage: 15, sharePercentageText: "15%", taggedDoctorName: "Dr. Adeel", taggedDoctorPercentage: 50, remainingPercentage: 50 },
  { id: "CUST002", custCode: "107741", custName: "FAZAL DIN S PHARMA PLUS PHARMACY", address: "456 Oak Ave, Town", alreadyTagged: false, sharePercentage: 0, sharePercentageText: "0%" },
  { id: "CUST003", custCode: "C003", custName: "Health Plus Pharmacy", address: "789 Pine Rd, Village", alreadyTagged: true, sharePercentage: 25, sharePercentageText: "25%", taggedDoctorName: "Dr. Sarah", taggedDoctorPercentage: 30, remainingPercentage: 70 },
  { id: "CUST004", custCode: "C004", custName: "MediCare Center", address: "321 Elm St, District", alreadyTagged: false, sharePercentage: 0, sharePercentageText: "0%" },
  { id: "CUST005", custCode: "C005", custName: "City Pharmacy", address: "654 Maple Ave, Metro", alreadyTagged: true, sharePercentage: 20, sharePercentageText: "20%", taggedDoctorName: "Dr. Michael", taggedDoctorPercentage: 40, remainingPercentage: 60 },
  { id: "CUST006", custCode: "C006", custName: "Family Health Store", address: "987 Cedar Blvd, Suburb", alreadyTagged: false, sharePercentage: 0, sharePercentageText: "0%" }
];

export default function EmpDetailPageView({ empCode }: EmpDetailPageViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBrick, setSelectedBrick] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showForecastingSheet, setShowForecastingSheet] = useState(false);
  const [showActivitiesSheet, setShowActivitiesSheet] = useState(false);
  const [showChemistSheet, setShowChemistSheet] = useState(false);
  const [selectedDoctorForSheet, setSelectedDoctorForSheet] = useState<Doctor | null>(null);
  const [skuDetails, setSkuDetails] = useState<SKUDetail[]>([
    { id: "1", sku: "", qty: 0, tp: 0, dp: 0, activityType: "Discount", percentage: 0, capping: 0, salesValue: 0, budgetAmount: 0 }
  ]);
  const [activities, setActivities] = useState<Activity[]>([
    { id: "1", activityType: "Giveaways", activityList: "", qty: 0, budget: 0 }
  ]);
  const [activeTabs, setActiveTabs] = useState<{ [doctorId: string]: string | null }>({});

  // Expanded sections state for each doctor
  const [expandedSections, setExpandedSections] = useState<{ [doctorId: string]: { [section: string]: boolean } }>({});

  // Chemist sheet states
  const [selectedDistributor, setSelectedDistributor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [addedCustomers, setAddedCustomers] = useState<SelectedCustomer[]>([]);

  const handleAddDoctor = () => {
    if (selectedBrick && selectedDoctor) {
      const brick = bricks.find(b => b.id === selectedBrick);
      const doctor = brick?.doctors.find(d => d.id === selectedDoctor);

      if (doctor) {
        const newDoctor: Doctor = {
          id: doctor.id,
          name: doctor.name,
          designation: doctor.designation,
          category: doctor.category,
          brickCode: doctor.brickCode,
          forecastingAmount: 0,
          budgetAmount: 0,
          roi: 0
        };
        setDoctors([...doctors, newDoctor]);
        setSelectedBrick("");
        setSelectedDoctor("");
        setShowAddForm(false);
      }
    }
  };

  const handleAddSKU = () => {
    setSkuDetails([...skuDetails, { id: Date.now().toString(), sku: "", qty: 0, tp: 0, dp: 0, activityType: "Discount", percentage: 0, capping: 0, salesValue: 0, budgetAmount: 0 }]);
  };

  const handleRemoveSKU = (id: string) => {
    setSkuDetails(skuDetails.filter(sku => sku.id !== id));
  };

  const handleAddActivity = () => {
    setActivities([...activities, { id: Date.now().toString(), activityType: "Giveaways", activityList: "", qty: 0, budget: 0 }]);
  };

  const handleRemoveActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  // Helper function to calculate capping
  const calculateCapping = (qty: number) => {
    return Math.round((qty / 12) * 1.2 * 100) / 100; // Round to 2 decimal places
  };

  // Helper function to calculate sales value (qty × dp)
  const calculateSalesValue = (qty: number, dp: number) => {
    return qty * dp;
  };

  // Helper function to calculate budget amount (percentage of sales value)
  const calculateBudgetAmount = (salesValue: number, percentage: number) => {
    return (salesValue * percentage) / 100;
  };

  // Helper function to update SKU details
  const updateSkuDetail = (index: number, field: keyof SKUDetail, value: any) => {
    const newSkuDetails = [...skuDetails];
    newSkuDetails[index] = { ...newSkuDetails[index], [field]: value };

    // Auto-calculate capping when qty changes
    if (field === 'qty') {
      newSkuDetails[index].capping = calculateCapping(value);
      // Recalculate sales value when qty changes
      newSkuDetails[index].salesValue = calculateSalesValue(value, newSkuDetails[index].dp);
      // Recalculate budget amount when qty changes
      newSkuDetails[index].budgetAmount = calculateBudgetAmount(newSkuDetails[index].salesValue, newSkuDetails[index].percentage);
    }

    // Auto-calculate sales value when dp changes
    if (field === 'dp') {
      newSkuDetails[index].salesValue = calculateSalesValue(newSkuDetails[index].qty, value);
      // Recalculate budget amount when dp changes
      newSkuDetails[index].budgetAmount = calculateBudgetAmount(newSkuDetails[index].salesValue, newSkuDetails[index].percentage);
    }

    // Auto-calculate budget amount when percentage changes
    if (field === 'percentage') {
      newSkuDetails[index].budgetAmount = calculateBudgetAmount(newSkuDetails[index].salesValue, value);
    }

    setSkuDetails(newSkuDetails);
  };

  // Helper function to get budget amount for activity list
  const getActivityBudget = (activityType: string, activityList: string) => {
    const activities = activityListsData[activityType as keyof typeof activityListsData];
    const activity = activities?.find(a => a.name === activityList);
    return activity?.budget || 0;
  };

  // Helper function to calculate total budget
  const calculateTotalBudget = (qty: number, budgetPerUnit: number) => {
    return qty * budgetPerUnit;
  };

  // Helper function to update activity details
  const updateActivityDetail = (index: number, field: keyof Activity, value: any) => {
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index], [field]: value };

    // Auto-calculate budget when qty, activityList, or activityType changes
    if (field === 'qty' || field === 'activityList' || field === 'activityType') {
      if (newActivities[index].activityList) {
        const costPerUnit = getActivityBudget(newActivities[index].activityType, newActivities[index].activityList);
        const qty = newActivities[index].qty || 0;
        newActivities[index].budget = costPerUnit * qty;
      } else if (field === 'activityType') {
        // Reset activityList and budget when activityType changes
        newActivities[index].activityList = "";
        newActivities[index].budget = 0;
      }
    }

    setActivities(newActivities);
  };

  // Chemist sheet helper functions
  const handleSearchCustomers = () => {
    if (!selectedDistributor || !searchQuery.trim()) {
      setCustomers([]);
      return;
    }

    // Filter customers based on search query (cust code or name)
    const filteredCustomers = customersData.filter(customer =>
      customer.custCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.custName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setCustomers(filteredCustomers);
  };

  const handleCustomerSelection = (customerId: string, checked: boolean) => {
    const newSelectedCustomers = new Set(selectedCustomers);
    if (checked) {
      newSelectedCustomers.add(customerId);
    } else {
      newSelectedCustomers.delete(customerId);
    }
    setSelectedCustomers(newSelectedCustomers);
  };

  const updateCustomerSharePercentage = (customerId: string, percentage: number) => {
    const newCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        // Validate percentage for already tagged customers
        if (customer.alreadyTagged && customer.remainingPercentage !== undefined) {
          // Ensure percentage doesn't exceed remaining percentage
          const validPercentage = Math.min(percentage, customer.remainingPercentage);
          return {
            ...customer,
            sharePercentage: validPercentage,
            sharePercentageText: `${validPercentage}%`
          };
        }
        // For non-tagged customers, allow up to 100%
        const validPercentage = Math.min(percentage, 100);
        return {
          ...customer,
          sharePercentage: validPercentage,
          sharePercentageText: `${validPercentage}%`
        };
      }
      return customer;
    });
    setCustomers(newCustomers);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allCustomerIds = new Set(customers.map(c => c.id));
      setSelectedCustomers(allCustomerIds);
    } else {
      setSelectedCustomers(new Set());
    }
  };

  const isAllSelected = customers.length > 0 && selectedCustomers.size === customers.length;
  const isIndeterminate = selectedCustomers.size > 0 && selectedCustomers.size < customers.length;

  const handleAddSelectedCustomers = () => {
    if (selectedCustomers.size === 0 || !selectedDistributor) return;

    const distributor = distributorsData.find(d => d.id === selectedDistributor);
    if (!distributor) return;

    // Get selected customer details
    const selectedCustomerData = customers.filter(c => selectedCustomers.has(c.id));

    // Create SelectedCustomer objects
    const newSelectedCustomers: SelectedCustomer[] = selectedCustomerData.map(customer => ({
      id: `${customer.id}_${Date.now()}`,
      customer: customer,
      distributorId: distributor.id,
      distributorName: distributor.name,
      distributorCode: distributor.code
    }));

    // Add to the added customers list
    setAddedCustomers([...addedCustomers, ...newSelectedCustomers]);

    // Clear selections
    setSelectedCustomers(new Set());

    // Optional: Clear customers list
    setCustomers([]);
    setSearchQuery("");
  };

  const handleRemoveAddedCustomer = (id: string) => {
    setAddedCustomers(addedCustomers.filter(c => c.id !== id));
  };

  const toggleTab = (doctorId: string, tabValue: string) => {
    setActiveTabs(prev => ({
      ...prev,
      [doctorId]: prev[doctorId] === tabValue ? null : tabValue
    }));
  };

  const toggleExpandedSection = (doctorId: string, section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [doctorId]: {
        ...prev[doctorId],
        [section]: !prev[doctorId]?.[section]
      }
    }));
  };

  const isSectionExpanded = (doctorId: string, section: string) => {
    return expandedSections[doctorId]?.[section] || false;
  };

  const selectedBrickData = bricks.find(b => b.id === selectedBrick);

  // Calculate employee totals
  const totalDoctors = doctors.length;
  const totalBudget = doctors.reduce((sum, doctor) => sum + doctor.budgetAmount, 0);
  const totalSales = doctors.reduce((sum, doctor) => sum + doctor.forecastingAmount, 0);

  return (
    <div className="space-y-6">
      {/* breadcrumb */}
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link href="/customer-profiling/employee-listing-allowed">Employee Listing Allowed</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/customer-profiling/employee-listing-allowed/${empCode}`}>{empCode}</Link>
        </BreadcrumbItem>
      </Breadcrumbs>

      {/* Summary Badges */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
          <span className="text-gray-600 dark:text-gray-400">Total Budget:</span>
          <span className="ml-2 font-bold text-green-600 dark:text-green-400">₨ {totalBudget.toLocaleString()}</span>
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
          <span className="text-gray-600 dark:text-gray-400">Total Sales:</span>
          <span className="ml-2 font-bold text-blue-600 dark:text-blue-400">₨ {totalSales.toLocaleString()}</span>
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
          <span className="text-gray-600 dark:text-gray-400">Total Share:</span>
          <span className="ml-2 font-bold text-purple-600 dark:text-purple-400">{addedCustomers.reduce((sum, item) => sum + item.customer.sharePercentage, 0)}%</span>
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
          <span className="text-gray-600 dark:text-gray-400">ROI:</span>
          <span className="ml-2 font-bold text-orange-600 dark:text-orange-400">{Math.round(((totalSales / totalBudget) * 100) || 0)}%</span>
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
          <span className="text-gray-600 dark:text-gray-400">Doctors:</span>
          <span className="ml-2 font-bold text-indigo-600 dark:text-indigo-400">{totalDoctors}</span>
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
          <span className="text-gray-600 dark:text-gray-400">Chemists:</span>
          <span className="ml-2 font-bold text-teal-600 dark:text-teal-400">{employeeData.chemistsCount}</span>
        </Badge>
      </div>

      {/* Employee Info Card */}
      <Card>
        <CardHeader className="border-b-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{employeeData.name}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {employeeData.empCode} • {employeeData.territory}
              </p>
            </div>
            <div className="flex space-x-6">


              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                color="primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Doctors Section */}
      <Card>
        {/* Add Form */}
        {showAddForm && (
          <CardContent className="border-t-0 pt-6 ">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brick">Select Brick</Label>
                  <Select value={selectedBrick} onValueChange={setSelectedBrick}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a brick" />
                    </SelectTrigger>
                    <SelectContent>
                      {bricks.map((brick) => (
                        <SelectItem key={brick.id} value={brick.id}>
                          {brick.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor">Select Doctor</Label>
                  <Select
                    value={selectedDoctor}
                    onValueChange={setSelectedDoctor}
                    disabled={!selectedBrick}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedBrickData?.doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDoctor} disabled={!selectedBrick || !selectedDoctor}>
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      {/* Doctors Grid */}
      <CardContent className="p-0">
        {doctors.length === 0 ? (
          <Card className="py-6">
            <div className="text-center py-8 text-gray-500">
              No doctors added yet. Click "Add Doctor" to get started.
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mt-1">
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        <Badge variant="outline">
                          {doctor.category}
                        </Badge>

                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doctor.designation} - Code: {doctor.id}
                      </p>

                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDoctorForSheet(doctor);
                          setShowForecastingSheet(true);
                        }}
                        className="flex-1 text-xs"
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Forecasting
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDoctorForSheet(doctor);
                          setShowActivitiesSheet(true);
                        }}
                        className="flex-1 text-xs"
                      >
                        <Target className="w-3 h-3 mr-1" />
                        Activities
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDoctorForSheet(doctor);
                          setShowChemistSheet(true);
                        }}
                        className="flex-1 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Chemists
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Forecasting Summary */}
                  <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20" onClick={() => toggleExpandedSection(doctor.id, 'forecasting')}>
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          Forecasting ({skuDetails.length})
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400"> Total Sales Value: <span className="font-semibold text-blue-800 dark:text-blue-200">₨ {skuDetails.reduce((sum, sku) => sum + sku.salesValue, 0).toLocaleString()}</span></span>
                        <span className="text-xs text-blue-600 dark:text-blue-400"> Total Budget: <span className="font-semibold text-blue-800 dark:text-blue-200">₨ {skuDetails.reduce((sum, sku) => sum + sku.budgetAmount, 0).toLocaleString()}</span></span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpandedSection(doctor.id, 'forecasting');
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {isSectionExpanded(doctor.id, 'forecasting') ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
              

                    {isSectionExpanded(doctor.id, 'forecasting') && (
                      <div className="mt-3 border-t pt-3">
                         <div className="max-h-48 overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Sr.</TableHead>
                                <TableHead className="text-xs">Prd Desc</TableHead>
                                <TableHead className="text-xs">Qty</TableHead>
                                <TableHead className="text-xs">TP</TableHead>
                                <TableHead className="text-xs">DP</TableHead>
                                <TableHead className="text-xs" style={{ textAlign: 'right' }}>Sales Value</TableHead>
                                <TableHead className="text-xs">Activity Type</TableHead>
                                <TableHead className="text-xs">Discount %</TableHead>
                                <TableHead className="text-xs">Capping</TableHead>
                                <TableHead className="text-xs" style={{ textAlign: 'right' }}>Budget</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {skuDetails.map((sku, index) => (
                                <TableRow key={sku.id}>
                                  <TableCell className="text-xs">{index + 1}</TableCell>
                                  <TableCell className="text-xs">{sku.sku || 'N/A'}</TableCell>
                                  <TableCell className="text-xs">{sku.qty}</TableCell>
                                  <TableCell className="text-xs">₨ {sku.tp}</TableCell>
                                  <TableCell className="text-xs">₨ {sku.dp}</TableCell>
                                  <TableCell className="text-xs text-right">₨ {sku.salesValue.toLocaleString()}</TableCell>
                                  <TableCell className="text-xs">{sku.activityType}</TableCell>
                                  <TableCell className="text-xs">{sku.percentage}%</TableCell>
                                  <TableCell className="text-xs">{sku.capping}</TableCell>
                                  <TableCell className="text-xs ">₨ {sku.budgetAmount.toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Activities Summary */}
                  <div className="border rounded-lg p-3 bg-purple-50 dark:bg-purple-900/20" onClick={() => toggleExpandedSection(doctor.id, 'activities')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                          Activities ({activities.length})
                        </span>
                        <span className="text-xs text-purple-600 dark:text-purple-400"> 
                          Total Budget: <span className="font-semibold text-purple-800 dark:text-purple-200">₨ {activities.reduce((sum, act) => sum + act.budget, 0).toLocaleString()}</span>
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpandedSection(doctor.id, 'activities');
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {isSectionExpanded(doctor.id, 'activities') ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                   

                    {isSectionExpanded(doctor.id, 'activities') && (
                      <div className="mt-3 border-t pt-3">
                        <div className="max-h-48 overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Sr.</TableHead>
                                <TableHead className="text-xs">Activity Type</TableHead>
                                <TableHead className="text-xs">Activity Desc</TableHead>
                                <TableHead className="text-xs">QTY</TableHead>
                                <TableHead className="text-xs">Activity Cost</TableHead>
                                <TableHead className="text-xs text-right" style={{ textAlign: 'right' }}>Budget</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {activities.map((activity, index) => (
                                <TableRow key={activity.id}>
                                  <TableCell className="text-xs">{index + 1}</TableCell>
                                  <TableCell className="text-xs">{activity.activityType}</TableCell>
                                  <TableCell className="text-xs">{activity.activityList || 'N/A'}</TableCell>
                                  <TableCell className="text-xs">{activity.qty}</TableCell>
                                  <TableCell className="text-xs">₨ {activity.budget.toLocaleString()}</TableCell>
                                  <TableCell className="text-xs text-right">₨ {activity.budget.toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Chemist Summary */}
                  <div className="border rounded-lg p-3 bg-green-50 dark:bg-green-900/20" onClick={() => toggleExpandedSection(doctor.id, 'chemist')}>
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                          Chemists ({addedCustomers.length})
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-400">
                          Total Share: <span className="font-semibold text-green-800 dark:text-green-200"> {addedCustomers.reduce((sum, item) => sum + item.customer.sharePercentage, 0)}%</span>
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpandedSection(doctor.id, 'chemist');
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {isSectionExpanded(doctor.id, 'chemist') ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {isSectionExpanded(doctor.id, 'chemist') && (
                      <div className="mt-3 border-t pt-3">
                        <div className="max-h-48 overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Sr.</TableHead>
                                <TableHead className="text-xs">Cust Code</TableHead>
                                <TableHead className="text-xs">Cust Name</TableHead>
                                <TableHead className="text-xs">Dist Code</TableHead>
                                <TableHead className="text-xs">Dist Name</TableHead>
                                <TableHead className="text-xs">Cust Address</TableHead>
                                <TableHead className="text-xs" style={{ textAlign: 'right' }}>Share %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {addedCustomers.length > 0 ? (
                                addedCustomers.map((item, index) => (
                                  <TableRow key={item.id}>
                                    <TableCell className="text-xs">{index + 1}</TableCell>
                                    <TableCell className="text-xs font-medium">{item.customer.custCode}</TableCell>
                                    <TableCell className="text-xs">{item.customer.custName}</TableCell>
                                    <TableCell className="text-xs">{item.distributorCode}</TableCell>
                                    <TableCell className="text-xs">{item.distributorName}</TableCell>
                                    <TableCell className="text-xs" style={{ textAlign: 'left' }}>{item.customer.address}</TableCell>
                                    <TableCell className="text-xs">
                                      <span className="font-semibold text-green-600 dark:text-green-400">
                                        {item.customer.sharePercentage}%
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center text-xs text-gray-500 py-4" style={{ textAlign: 'center' }} >
                                    No customers selected
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Forecasting Sheet */}
      <Sheet open={showForecastingSheet} onOpenChange={setShowForecastingSheet}>
        <SheetContent className="w-full sm:max-w-full p-0">
          <SheetHeader className="py-3 pl-4">
            <SheetTitle>
              Forecasting - {selectedDoctorForSheet?.name}
            </SheetTitle>
          </SheetHeader>
          <hr />
          <div className="px-3 py-6 h-[calc(100vh-120px)]">
            <ScrollArea className="h-full">
              <div className="space-y-4 py-4 px-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">SKU Details</h3>
                  <Button onClick={handleAddSKU} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Row
                  </Button>
                </div>

                <div className="border rounded-lg ">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>TP</TableHead>
                        <TableHead>DP</TableHead>
                        <TableHead style={{ textAlign: 'right' }}>Sales Value</TableHead>
                        <TableHead>Activity Type</TableHead>
                        <TableHead>Discount %</TableHead>
                        <TableHead>Capping</TableHead>
                        <TableHead style={{ textAlign: 'right' }}>Budget Amount</TableHead>
                        <TableHead className="w-[50px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {skuDetails.map((sku, index) => (
                        <TableRow key={sku.id}>
                          <TableCell>
                            <ReactSelectComponent
                              options={skuOptions}
                              value={sku.sku}
                              onChange={(value) => {
                                const selectedSku = skuOptions.find(option => option.value === value);
                                if (selectedSku) {
                                  updateSkuDetail(index, 'sku', value);
                                  updateSkuDetail(index, 'tp', selectedSku.tp);
                                  updateSkuDetail(index, 'dp', selectedSku.dp);
                                }
                              }}
                              placeholder="Select SKU"
                              className="w-[300px]"
                              isClearable={true}
                              isSearchable={true}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="0"
                              value={sku.qty}
                              onChange={(e) => updateSkuDetail(index, 'qty', Number(e.target.value))}
                          
                            />
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                               {sku.tp.toFixed(0)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                               {sku.dp.toFixed(0)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold w-[150px]">
                            ₨ {sku.salesValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={sku.activityType}
                              onValueChange={(value) => updateSkuDetail(index, 'activityType', value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Discount">Discount</SelectItem>
                                <SelectItem value="Bonus">Bonus</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="0"
                              value={sku.percentage}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0 && value <= 100) {
                                  updateSkuDetail(index, 'percentage', value);
                                }
                              }} 
                              min="0"
                              max="100"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={sku.capping}
                              readOnly
                              disabled
                              className=" w-[150px] font-semibold"
                            />
                          </TableCell>
                       
                          <TableCell className="text-right font-semibold">
                            ₨ {sku.budgetAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveSKU(sku.id)}
                                disabled={skuDetails.length <= 1}
                                className={skuDetails.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ScrollArea>
          </div>
          <SheetFooter className="gap-3 pt-4 border-t px-6 pb-6">
            <Button variant="outline" onClick={() => setShowForecastingSheet(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowForecastingSheet(false)}>
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Activities Sheet */}
      <Sheet open={showActivitiesSheet} onOpenChange={setShowActivitiesSheet}>
        <SheetContent className="max-w-[70vw] p-0">
          <SheetHeader className="py-3 pl-4">
            <SheetTitle>
              Activities - {selectedDoctorForSheet?.name}
            </SheetTitle>
          </SheetHeader>
          <hr />
          <div className="px-3 py-6 h-[calc(100vh-120px)]">
            <ScrollArea className="h-full">
              <div className="space-y-4 py-4 px-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Activity Details</h3>
                  <Button onClick={handleAddActivity} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Row
                  </Button>
                </div>

                <div className="border rounded-lg ">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity Type</TableHead>
                        <TableHead>Activity List</TableHead>
                        <TableHead>Activity Cost</TableHead>
                        <TableHead>QTY</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead className="w-[50px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity, index) => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <ReactSelectComponent
                              options={[
                                { value: "Giveaways", label: "Giveaways" },
                                { value: "Promotional", label: "Promotional" },
                                { value: "PFP", label: "PFP" }
                              ]}
                              value={activity.activityType}
                              onChange={(value) => {
                                updateActivityDetail(index, 'activityType', value);
                                // Clear activity list when activity type changes
                                updateActivityDetail(index, 'activityList', '');
                              }}
                              placeholder="Select Activity Type"
                              className="w-[200px]"
                              isClearable={true}
                              isSearchable={true}
                            />
                          </TableCell>
                          <TableCell>
                            <ReactSelectComponent
                              options={activity.activityType ? 
                                (activityListsData[activity.activityType as keyof typeof activityListsData] || []).map((item) => ({
                                  value: item.name,
                                  label: item.name
                                })) : []
                              }
                              value={activity.activityList}
                              onChange={(value) => updateActivityDetail(index, 'activityList', value)}
                              placeholder="Select Activity"
                              className="w-[300px]"
                              isClearable={true}
                              isSearchable={true}
                              disabled={!activity.activityType}
                            />
                          </TableCell>
                          <TableCell>
                           
                              <Input
                                type="number"
                                placeholder="0"
                                value={activity.activityList ? getActivityBudget(activity.activityType, activity.activityList).toLocaleString() : '0'}
                                readOnly
                                disabled
                                className="w-full font-semibold"
                              /> 
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="0"
                              value={activity.qty}
                              onChange={(e) => updateActivityDetail(index, 'qty', Number(e.target.value))}
                              className="w-full"
                              min="0"
                            />
                          </TableCell>
                          <TableCell>
                            
                              <Input
                                type="number"
                                value={activity.budget.toLocaleString()}
                                readOnly
                                disabled
                                className="w-full font-semibold"
                              /> 
                          </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveActivity(activity.id)}
                                disabled={activities.length <= 1}
                                className={activities.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Total Budget Summary */}
                {activities.length > 0 && (
                  <div className="flex justify-end items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
                    <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      Total Budget: <span className="text-blue-600 dark:text-blue-400">₨ {activities.reduce((sum, activity) => sum + activity.budget, 0).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <SheetFooter className="gap-3 pt-4 border-t px-6 pb-6">
            <Button variant="outline" onClick={() => setShowActivitiesSheet(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowActivitiesSheet(false)}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Chemist Sheet */}
      <Sheet open={showChemistSheet} onOpenChange={setShowChemistSheet}>
        <SheetContent className="w-full sm:max-w-full p-0">
          <SheetHeader className="py-3 pl-4">
            <SheetTitle>
              Chemist - {selectedDoctorForSheet?.name}
            </SheetTitle>
          </SheetHeader>
          <hr />
          <div className="px-3 py-6 h-[calc(100vh-120px)]">
            <ScrollArea className="h-full">
              <div className="space-y-4 py-4 px-2">
                <div className="grid grid-cols-2 gap-4">

                  {/* Distributor Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="distributor">Select Distributor</Label>
                    <ReactSelectComponent
                      options={distributorsData.map((distributor) => ({
                        value: distributor.id,
                        label: `${distributor.name} (${distributor.code})`
                      }))}
                      value={selectedDistributor}
                      onChange={setSelectedDistributor}
                      placeholder="Choose a distributor"
                      isClearable={true}
                      isSearchable={true}
                    />
                  </div>

                  {/* Search Section */}
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Customer (Code or Name)</Label>
                    <div className="flex space-x-2">
                      <Input
                        className="py-5 "
                        placeholder="Enter customer code or name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchCustomers()}
                      />
                      <Button onClick={handleSearchCustomers} disabled={!selectedDistributor || !searchQuery.trim()}>
                        Search
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Customer Table */}
                {customers.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Customer Results</h3>
                      <Button
                        onClick={handleAddSelectedCustomers}
                        disabled={selectedCustomers.size === 0}
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Selected ({selectedCustomers.size})
                      </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">
                              <input
                                type="checkbox"
                                checked={isAllSelected}
                                ref={(input) => {
                                  if (input) input.indeterminate = isIndeterminate;
                                }}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="rounded"
                              />
                            </TableHead>
                            <TableHead>Share %</TableHead>
                            <TableHead>Cust Code</TableHead>
                            <TableHead>Cust Name</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead style={{ textAlign: 'right' }}>Already Tagged</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customers.map((customer) => (
                            <TableRow key={customer.id}>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedCustomers.has(customer.id)}
                                  onChange={(e) => handleCustomerSelection(customer.id, e.target.checked)}
                                  className="rounded"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={customer.sharePercentage}
                                  onChange={(e) => updateCustomerSharePercentage(customer.id, Number(e.target.value))}
                                  className="w-[80px]"
                                  min="0"
                                  max={customer.alreadyTagged ? customer.remainingPercentage || 100 : 100}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{customer.custCode}</TableCell>
                              <TableCell>{customer.custName}</TableCell>
                              <TableCell>{customer.address}</TableCell>
                              <TableCell>
                                {customer.alreadyTagged ? (
                                  <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                                    {/* Support one or many doctors if available */}
                                    {(Array.isArray((customer as any).taggedDoctors) && (customer as any).taggedDoctors.length > 0) ? (
                                      (customer as any).taggedDoctors.map((doc: any, i: number) => (
                                        <div key={i}>{doc.name} - {doc.percentage}%</div>
                                      ))
                                    ) : (
                                      customer.taggedDoctorName ? (
                                        <div>{customer.taggedDoctorName} - {customer.taggedDoctorPercentage}%</div>
                                      ) : null
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">No</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Selected Customers Table */}
                {addedCustomers.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Selected Customers</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Distributor</TableHead>
                            <TableHead>Cust Code</TableHead>
                            <TableHead>Cust Name</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Already Tagged</TableHead>
                            <TableHead >Share %</TableHead>
                            <TableHead className="w-[50px]">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {addedCustomers.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.distributorCode} - {item.distributorName}</TableCell>
                              <TableCell>{item.customer.custCode}</TableCell>
                              <TableCell>{item.customer.custName}</TableCell>
                              <TableCell>{item.customer.address}</TableCell>
                              <TableCell>
                                {item.customer.alreadyTagged ? (
                                  <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                                    {(Array.isArray((item.customer as any).taggedDoctors) && (item.customer as any).taggedDoctors.length > 0) ? (
                                      (item.customer as any).taggedDoctors.map((doc: any, i: number) => (
                                        <div key={i}>{doc.name} - {doc.percentage}%</div>
                                      ))
                                    ) : (
                                      item.customer.taggedDoctorName ? (
                                        <div>{item.customer.taggedDoctorName} - {item.customer.taggedDoctorPercentage}%</div>
                                      ) : null
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">No</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={item.customer.sharePercentage}
                                  onChange={(e) => {
                                    const newValue = Number(e.target.value);
                                    const maxValue = item.customer.alreadyTagged ?
                                      (item.customer.remainingPercentage || 100) : 100;
                                    const validValue = Math.min(newValue, maxValue);

                                    const updatedCustomers = addedCustomers.map(ac =>
                                      ac.id === item.id
                                        ? {
                                          ...ac,
                                          customer: {
                                            ...ac.customer,
                                            sharePercentage: validValue,
                                            sharePercentageText: `${validValue}%`
                                          }
                                        }
                                        : ac
                                    );
                                    setAddedCustomers(updatedCustomers);
                                  }}
                                  className="w-[80px]"
                                  min="0"
                                  max={item.customer.alreadyTagged ? item.customer.remainingPercentage || 100 : 100}
                                />
                              </TableCell>

                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveAddedCustomer(item.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* No Results Message */}
                {selectedDistributor && searchQuery && customers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No customers found matching your search criteria.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <SheetFooter className="gap-3 pt-4 border-t px-6 pb-6">
            <Button variant="outline" onClick={() => setShowChemistSheet(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowChemistSheet(false)}>
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
