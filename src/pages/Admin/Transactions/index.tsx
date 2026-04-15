import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

//Hooks
import { usePageParam } from "@/Hooks/PageParams";
import { GetTransactions } from "@/services/queries.service";

//Components
import { ColumnLoader } from "@/components/LoadingScreen";
import { ErrorScreen } from '@/components/ErrorComponents';
import Table from './Table';
import PaginationControls from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import Form from './Form';
import GenerateForm from './Generate';

//Icons
import { BadgePlus, CircleCheckBig } from 'lucide-react';

type ViewState = "table" | "new" | "generate";

function ActionButton({ active, loadingLabel, defaultLabel, onClick }: {
    active: boolean; loadingLabel: string; defaultLabel: string; onClick: () => void;
}) {
    return (
        <Button onClick={onClick} disabled={active} className="flex items-center bg-primary hover:bg-primary/90 py-3 text-white">
            {active ? (
                <CircleCheckBig className="mr-2 size-5" />
            ) : (
                <BadgePlus className="mr-2 size-5" />
            )}
            {active ? loadingLabel : defaultLabel}
        </Button>
    );
}

const Index = () => {

    const navigate = useNavigate();
    const { page, setPage } = usePageParam();

    const [view, setView] = useState<ViewState>("table");

    const { data, isLoading, isFetching, isError, refetch } =
        GetTransactions(String(page), "20");

    const transactions = data?.data?.data ?? [];
    const totalPages = data?.data?.pagination?.pages ?? 1;

    const goBack = () => navigate(-1);

    if (isLoading || isFetching) {
        return (
            <main className="flex flex-col gap-y-2">
                <ColumnLoader />
                <ColumnLoader />
            </main>
        );
    }

    if (isError) {
        return <ErrorScreen onRetry={refetch} onGoBack={goBack} size="sm" />;
    }

    return (
        <main>
            {/* Header */}
            <div className="flex sm:flex-row flex-col flex-wrap sm:justify-between sm:items-center gap-3 my-4">
                <h1 className="font-semibold text-white text-lg">
                    Transactions
                </h1>

                <div className="flex sm:flex-row flex-col gap-2 sm:gap-4">
                    <ActionButton active={view === "generate"} onClick={() => setView("generate")}
                        loadingLabel="Generating..." defaultLabel="Generate Transactions" />

                    <ActionButton active={view === "new"} onClick={() => setView("new")}
                        loadingLabel="Creating..." defaultLabel="New Transaction" />
                </div>
            </div>

            {/* Views */}
            {view === "generate" && (
                <GenerateForm onClose={() => setView("table")} />
            )}

            {view === "new" && (
                <Form onClose={() => setView("table")} />
            )}

            {view === "table" && (
                <>
                    <Table transactions={transactions} />

                    {totalPages > 1 && (
                        <div className="mt-4">
                            <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    )}
                </>
            )}
        </main>
    );
};

export default Index;