import { useState } from "react";
import { toast } from "react-fox-toast";

// Components
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserSelect from "./UserSelect";

// Icons
import { Loader, Wand2 } from "lucide-react";

// Hook
import { useGenerateTransactions } from "@/services/mutations.service";

const GenerateForm = ({ onClose }: { onClose: () => void }) => {
    // Added startDate and endDate to the state
    const [formData, setFormData] = useState({
        user: "",
        totalInflow: 0,
        totalOutflow: 0,
        startDate: "",
        endDate: "",
    });

    const generateHistory = useGenerateTransactions();
    const calculatedBalance = formData.totalInflow - formData.totalOutflow;

    const handleChange = (key: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleGenerate = () => {
        if (!formData.user.trim()) {
            return toast.error("Kindly select a user to continue.");
        }
        if (formData.totalInflow === 0 && formData.totalOutflow === 0) {
            return toast.error("Please enter an amount for inflow or outflow.");
        }
        if (!formData.startDate || !formData.endDate) {
            return toast.error("Please select a valid start and end date.");
        }
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            return toast.error("Start date cannot be after the end date.");
        }

        toast.info("Generating mock transactions...");

        generateHistory.mutate(
            {
                userId: formData.user,
                totalInflow: Number(formData.totalInflow),
                totalOutflow: Number(formData.totalOutflow),
                startDate: formData.startDate,
                endDate: formData.endDate,
            },
            {
                onSuccess: () => {
                    toast.success("Random history generated successfully!");
                    setFormData({ user: "", totalInflow: 0, totalOutflow: 0, startDate: "", endDate: "" });
                    onClose();
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    const message = error?.response?.data?.message || "Failed to generate history.";
                    toast.error(message);
                },
            }
        );
    };

    return (
        <main>
            <Badge onClick={onClose} variant="destructive" className="cursor-pointer">
                Close
            </Badge>
            <Card className="shadow-sm mx-auto mt-10 border-neutral-200 max-w-2xl">
                <CardHeader className="bg-neutral-100/50 mb-4 border-neutral-200 border-b font-semibold text-base md:text-lg xl:text-xl">
                    Generate Mock Transaction History
                </CardHeader>
                <CardContent className="flex flex-col gap-y-6">

                    {/* Select User */}
                    <UserSelect isUser={!!formData.user.trim()} handleChange={(_, val) => handleChange("user", val as string)} />

                    {/* Date Period Selection */}
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="startDate" className="font-medium text-sm">
                                Period Start <span className="text-red-600">*</span>
                            </label>
                            <Input type="date" id="startDate" className="bg-inherit px-4 py-2 border border-neutral-200 rounded-lg focus:outline-primary"
                                value={formData.startDate} onChange={(e) => handleChange("startDate", e.target.value)} />
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="endDate" className="font-medium text-sm">
                                Period End <span className="text-red-600">*</span>
                            </label>
                            <Input type="date" id="endDate" className="bg-inherit px-4 py-2 border border-neutral-200 rounded-lg focus:outline-primary"
                                value={formData.endDate} onChange={(e) => handleChange("endDate", e.target.value)} />
                        </div>
                    </div>

                    {/* Inflow & Outflow Amounts */}
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="totalInflow" className="font-medium text-sm">
                                Total Inflow (Received) <span className="text-red-600">*</span>
                            </label>
                            <Input type="number" min={0} id="totalInflow"
                                className="bg-inherit px-4 py-2 border border-neutral-200 rounded-lg focus:outline-primary"
                                value={formData.totalInflow || ""} onChange={(e) => handleChange("totalInflow", Number(e.target.value))} placeholder="$0.00" />
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="totalOutflow" className="font-medium text-sm">
                                Total Outflow (Sent) <span className="text-red-600">*</span>
                            </label>
                            <Input type="number" min={0} id="totalOutflow" className="bg-inherit px-4 py-2 border border-neutral-200 rounded-lg focus:outline-primary"
                                value={formData.totalOutflow || ""} onChange={(e) => handleChange("totalOutflow", Number(e.target.value))} placeholder="$0.00" />
                        </div>
                    </div>

                    {/* Expected Balance Display */}
                    <div className="flex justify-between items-center bg-blue-50 p-4 border border-blue-200 rounded-lg">
                        <span className="font-medium text-blue-900">Resulting Balance:</span>
                        <span className={`text-xl font-bold ${calculatedBalance < 0 ? "text-red-600" : "text-emerald-600"}`}>
                            ${calculatedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <Button onClick={handleGenerate} disabled={generateHistory.isPending}
                        className="bg-primary hover:bg-primary/90 py-3 w-full text-white">
                        {generateHistory.isPending ? (
                            <Loader className="mr-2 size-5 animate-spin" />
                        ) : (
                            <Wand2 className="mr-2 size-5" />
                        )}
                        {generateHistory.isPending ? "Generating Magic..." : "Generate History"}
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
};

export default GenerateForm;