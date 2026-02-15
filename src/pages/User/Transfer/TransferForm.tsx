import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-fox-toast";

// Stores, Hooks and Types
import { useTransactionStore } from "@/stores/transactionStore";
import { useUserStore } from "@/stores/userStore";
import { GetAccountDetails } from "@/services/queries.service";

// Components
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Pin from "./Pin";
import CountrySelector from "./CountrySelect";

// Icons
import { Bank, Send2 } from "iconsax-react";
import { Loader } from "lucide-react";

const sectionVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
};

const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (

    <motion.section layout variants={sectionVariants} initial="hidden" animate="visible"
        exit="exit" transition={{ duration: 0.2, ease: "easeOut" }} className="flex flex-col gap-y-3">
        <h2 className="font-medium text-neutral-700 text-sm md:text-base">
            {title}
        </h2>
        {children}
    </motion.section>
);

const TransferForm = () => {

    const { user, refetchUserData, balance } = useUserStore();
    const { transaction, updateTransaction, updateDetails, isTransactionValid, } = useTransactionStore();

    const [manualEntry, setManualEntry] = useState<boolean>(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<boolean>(false);
    const [transferPinPage, setTransferPinPage] = useState<boolean>(false);

    const { data, isFetching, isError, isLoading } = GetAccountDetails(manualEntry, transaction.details.accountNumber);

    useEffect(() => {
        if (!user) refetchUserData();
    }, [user, refetchUserData]);

    const handleClick = (beneficiary: Beneficiary) => {
        updateDetails(beneficiary);
        updateDetails({ recipient: beneficiary._id });
        setSelectedSuggestion(true);
    };

    const handleTransfer = () => {
        if (!isTransactionValid())
            return toast.error("Kindly fill all the required fields");
        setTransferPinPage(true);
    };

    return (
        <>
            {transferPinPage && (<Pin onClose={() => setTransferPinPage(false)} />)}

            <main className="text-neutral-900">
                <h1 className="font-semibold text-base md:text-lg xl:text-xl">
                    Transfer Details
                </h1>

                <motion.div layout className="flex flex-col gap-y-6 mt-6">
                    <FormSection title="Recipient Information">
                        <Input type="text" placeholder="GB29 NWBK 6016 1331 9268 19" label="Account Number / IBAN" id="accountNumber" value={transaction.details.accountNumber}
                            required
                            onChange={(e) => {
                                updateDetails({ accountNumber: e.target.value });
                                setManualEntry(true);
                            }} />

                        {(isFetching || isLoading) && (
                            <Loader className="mx-auto my-2 text-blue-600 animate-spin" />
                        )}

                        <AnimatePresence>
                            {data?.data && !selectedSuggestion && (
                                <motion.div layout variants={sectionVariants} initial="hidden" animate="visible"
                                    exit="exit" className="flex items-center gap-x-2 bg-neutral-100 hover:bg-primary/10 p-4 border rounded-xl cursor-pointer" onClick={() => handleClick(data.data)}>
                                    <div className="bg-neutral-300 p-2 rounded-full">
                                        <Bank className="size-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{data.data.fullName}</p>
                                        <p className="text-sm">{data.data.bankName}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {((isError && transaction.details.accountNumber.length >= 8) ||
                            transaction.details.fullName) && (
                                <>
                                    <Input type="text" placeholder="John Doe" label="Full Name" value={transaction.details.fullName}
                                        required onChange={(e) => updateDetails({ fullName: e.target.value })} />
                                    <Input type="text" placeholder="JPMorgan Chase" label="Bank Name" value={transaction.details.bankName} required
                                        onChange={(e) => updateDetails({ bankName: e.target.value })} />
                                </>
                            )}
                    </FormSection>

                    <FormSection title="Transfer Amount">
                        <Input type="number" placeholder="$0.00" label="Amount" min={0} value={transaction.amount.toString()} required onChange={(e) =>
                            updateTransaction({ amount: Number(e.target.value) })
                        } />

                        <Label className="flex gap-3 p-3 border rounded-lg">
                            <Checkbox checked={transaction.isInternational}
                                onCheckedChange={(checked) =>
                                    updateTransaction({ isInternational: checked === true })
                                } />
                            <div>
                                <p className="font-medium">International Transaction?</p>
                                <p className="text-neutral-500 text-sm">
                                    Check if recipient is outside your country
                                </p>
                            </div>
                        </Label>
                    </FormSection>

                    <AnimatePresence>
                        {transaction.isInternational && (
                            <FormSection title="International Details">
                                <Input type="text" label="Bank Address (Optional)" value={transaction.bankAddress} onChange={(e) =>
                                    updateTransaction({ bankAddress: e.target.value })} />
                                <Input type="text" label="Recipient Address (Optional)" value={transaction.recipientAddress} onChange={(e) =>
                                    updateTransaction({ recipientAddress: e.target.value })} />
                                <Input type="text" label="Swift Code / BIC (Optional)" value={transaction.swiftCode} onChange={(e) =>
                                    updateTransaction({ swiftCode: e.target.value })} />
                                <Input type="text" label="Routing Number (Optional)" value={transaction.routingNumber} onChange={(e) => updateTransaction({ routingNumber: e.target.value })} />
                                <CountrySelector />
                            </FormSection>
                        )}
                    </AnimatePresence>

                    <FormSection title="Notes & Preferences">
                        <Textarea placeholder="Description (Optional)" value={transaction.description} maxLength={140} onChange={(e) => updateTransaction({ description: e.target.value })} />

                        <div className="flex items-center gap-3">
                            <Checkbox checked={transaction.beneficiary} onCheckedChange={(checked) => updateTransaction({ beneficiary: checked === true })} />
                            <Label className="font-medium">Make Beneficiary</Label>
                        </div>

                        <AnimatePresence>
                            {transaction.beneficiary && (
                                <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
                                    <Textarea
                                        placeholder="Beneficiary Note (Optional)"
                                        onChange={(e) =>
                                            updateTransaction({ note: e.target.value })
                                        }
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </FormSection>

                    <Button loading={false} onClick={handleTransfer} text="Transfer" disabled={balance !== null && transaction.amount > balance} icon={<Send2 />} />
                </motion.div>
            </main>
        </>
    );
};

export default TransferForm;