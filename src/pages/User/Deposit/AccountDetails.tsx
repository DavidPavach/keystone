import { useState } from "react";

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import { Copy, Check, Building, Globe } from "lucide-react";

export default function AccountDetails({ accountNumber }: { accountNumber: string }) {

    const [copiedField, setCopiedField] = useState<string | null>(null)

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    const domesticDetails = {
        bankName: "Keystone National Bank",
        routingNumber: "021000089",
        accountNumber: accountNumber,
        accountType: "Checking",
        bankAddress: "33 Cortlandt Aly New York, NY 10013, USA",
    }

    const internationalDetails = {
        swiftCode: "KeystoneUS33",
        iban: "US02 Keystone 0210 0008 9884 7562 910",
        correspondentBank: "JPMorgan Chase Bank, N.A.",
        correspondentSwift: "CHASUS33",
        bankAddress: "350 Park Avenue, New York, NY 10022, USA",
    }

    const CopyButton = ({ text, field }: { text: string; field: string }) => (
        <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={() => copyToClipboard(text, field)}>
            {copiedField === field ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
            <span className="sr-only">Copy {field}</span>
        </Button>
    )

    return (
        <section className="py-16">
            <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
                <div className="mb-12 text-center">
                    <h2 className="font-bold text-primaryYellow text-2xl md:text-3xl xl:text-4xl">Your Account Details</h2>
                    <p className="mx-auto mt-3 max-w-xl">
                        Use the following information to set up deposits, direct deposits, or wire transfers to your account.
                    </p>
                </div>

                <div className="mx-auto max-w-3xl">
                    <Tabs defaultValue="domestic" className="w-full">
                        <TabsList className="grid grid-cols-2 mb-8 w-full">
                            <TabsTrigger value="domestic" className="flex items-center gap-2">
                                <Building className="size-4" />
                                Domestic (US)
                            </TabsTrigger>
                            <TabsTrigger value="international" className="flex items-center gap-2">
                                <Globe className="size-4" />
                                International
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="domestic">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Domestic Wire & ACH Details</CardTitle>
                                    <CardDescription>For transfers originating within the United States</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
                                        <div>
                                            <p className="text-sm">Bank Name</p>
                                            <p className="font-medium text-primary">{domesticDetails.bankName}</p>
                                        </div>
                                        <CopyButton text={domesticDetails.bankName} field="bankName" />
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
                                        <div>
                                            <p className="text-sm">ABA Routing Number</p>
                                            <p className="font-mono font-semibold text-primary text-lg">{domesticDetails.routingNumber}</p>
                                        </div>
                                        <CopyButton text={domesticDetails.routingNumber} field="routing" />
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
                                        <div>
                                            <p className="text-sm">Account Number</p>
                                            <p className="font-mono font-semibold text-primary text-lg">{domesticDetails.accountNumber}</p>
                                        </div>
                                        <CopyButton text={domesticDetails.accountNumber} field="account" />
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
                                        <div>
                                            <p className="text-sm">Account Type</p>
                                            <p className="font-medium text-primary">{domesticDetails.accountType}</p>
                                        </div>
                                        <CopyButton text={domesticDetails.accountType} field="type" />
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
                                        <div>
                                            <p className="text-sm">Bank Address</p>
                                            <p className="font-medium text-primary">{domesticDetails.bankAddress}</p>
                                        </div>
                                        <CopyButton text={domesticDetails.bankAddress} field="address" />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="international">
                            <Card>
                                <CardHeader>
                                    <CardTitle>International Wire Details</CardTitle>
                                    <CardDescription>For transfers originating outside the United States</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
                                        <div>
                                            <p className="text-sm">SWIFT / BIC Code</p>
                                            <p className="font-mono font-semibold text-primary text-lg">
                                                {internationalDetails.swiftCode}
                                            </p>
                                        </div>
                                        <CopyButton text={internationalDetails.swiftCode} field="swift" />
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
                                        <div>
                                            <p className="text-sm">IBAN</p>
                                            <p className="font-mono font-semibold text-primary text-lg">{internationalDetails.iban}</p>
                                        </div>
                                        <CopyButton text={internationalDetails.iban} field="iban" />
                                    </div>

                                    <div className="bg-secondary p-4 border border-border rounded-lg">
                                        <p className="mb-3 font-medium text-primary text-sm">Intermediary / Correspondent Bank</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="">Bank Name:</span>
                                                <span className="font-medium text-primary">{internationalDetails.correspondentBank}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="">SWIFT Code:</span>
                                                <span className="font-mono font-medium text-primary">
                                                    {internationalDetails.correspondentSwift}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
                                        <div>
                                            <p className="text-sm">Beneficiary Bank Address</p>
                                            <p className="font-medium text-primary">{internationalDetails.bankAddress}</p>
                                        </div>
                                        <CopyButton text={internationalDetails.bankAddress} field="intlAddress" />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    )
}
