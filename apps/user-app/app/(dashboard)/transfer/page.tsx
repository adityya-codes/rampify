import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";

import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { OnRampTransactions } from "@/components/OnRampTransaction";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function TransferPage() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 md:px-10 py-10">
            
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-800">
                    Transfer Funds
                </h1>
                <p className="text-slate-500 mt-2">
                    Add money to your account and track recent transactions.
                </p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Add Money Section (Primary Focus) */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <AddMoney />
                    </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-8">
                    
                    {/* Balance Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <BalanceCard 
                            amount={balance.amount} 
                            locked={balance.locked} 
                        />
                    </div>

                    {/* Transactions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            Recent Transactions
                        </h2>
                        <OnRampTransactions transactions={transactions} />
                    </div>

                </div>
            </div>
        </div>
    );
}