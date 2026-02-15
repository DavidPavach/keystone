// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { Building2, Smartphone, CreditCard, Banknote, Clock } from "lucide-react";

const depositMethods = [
  {
    icon: Banknote,
    title: "Wire Transfer",
    description: "Send funds directly from another bank account",
    timing: "Same day - 1 business day",
    fee: "Free for incoming",
    limit: "No limit",
    steps: [
      "Obtain your Keystone routing and account numbers above",
      "Log into your sending bank's online portal",
      "Initiate a wire transfer using Keystone details",
      "Funds typically arrive within hours",
    ],
  },
  {
    icon: Building2,
    title: "ACH / Direct Deposit",
    description: "Set up recurring deposits from employers or other banks",
    timing: "1-3 business days",
    fee: "Free",
    limit: "Up to $100,000/day",
    steps: [
      "Provide your employer with Keystone routing number",
      "Share your account number for deposit",
      "Specify deposit amount or percentage",
      "Deposits occur on your regular pay schedule",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile Check Deposit",
    description: "Deposit checks using the Keystone mobile app",
    timing: "1-2 business days",
    fee: "Free",
    limit: "Up to $50,000/day",
    steps: [
      "Download the Keystone Mobile app",
      "Sign the back of your check with 'For mobile deposit only'",
      "Take photos of the front and back",
      "Submit and funds are available within 1-2 days",
    ],
  },
  {
    icon: CreditCard,
    title: "Branch Deposit",
    description: "Deposit cash or checks at any Keystone branch",
    timing: "Immediate",
    fee: "Free",
    limit: "No limit",
    steps: [
      "Visit any Keystone branch location in New York",
      "Bring valid government-issued ID",
      "Complete a deposit slip or use the ATM",
      "Receive confirmation receipt immediately",
    ],
  },
]

export default function DepositMethods() {
  return (
    <section className="py-16">
      <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="font-bold text-primaryYellow text-2xl md:text-3xl xl:text-4xl">Ways to Deposit</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Choose the deposit method that best fits your needs. All methods are secure and FDIC insured.
          </p>
        </div>

        <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
          {depositMethods.map((method) => (
            <Card key={method.title} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 rounded-lg size-10">
                      <method.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm md:text-base xl:text-lg">{method.title}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {method.timing}
                  </Badge>
                  <Badge variant="outline">{method.fee}</Badge>
                  <Badge variant="outline">Limit: {method.limit}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <p className="mb-3 font-medium text-foreground text-sm">How it works:</p>
                <ol className="space-y-2">
                  {method.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="flex justify-center items-center bg-primary rounded-full size-5 font-medium text-neutral-100 text-xs shrink-0">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
