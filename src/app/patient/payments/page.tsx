"use client";

import { useState, useEffect } from "react";
import { CreditCard, CheckCircle, RefreshCw, AlertCircle, FileText, ArrowRight } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  date: string;
  description: string;
  status: string;
}

export default function PatientPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paySuccessId, setPaySuccessId] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/patient/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error("Failed to load payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePay = async (paymentId: string) => {
    setPayingId(paymentId);
    try {
      const res = await fetch("/api/payments/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId })
      });
      if (res.ok) {
        setPaySuccessId(paymentId);
        setTimeout(() => {
          setPaySuccessId(null);
          fetchPayments();
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to pay invoice:", err);
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-400 font-medium space-x-2">
        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
        <span>Loading billing history...</span>
      </div>
    );
  }

  const outstandingList = payments.filter(p => p.status === "PENDING" || p.status === "OVERDUE");
  const paidList = payments.filter(p => p.status === "PAID");

  const totalOutstanding = outstandingList.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payment Portal</h1>
        <p className="text-sm text-slate-500 mt-1">Review invoices, co-pay balances, and transaction history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ledger & Paid Transactions (Left) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Outstanding Invoice Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Outstanding Invoices</h2>
            
            {outstandingList.length > 0 ? (
              <div className="space-y-3">
                {outstandingList.map((invoice) => (
                  <div key={invoice.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <strong className="block text-slate-900 text-sm">{invoice.description}</strong>
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-inset ring-amber-600/20 uppercase">
                          {invoice.status}
                        </span>
                      </div>
                      <span className="block text-xs text-slate-500 mt-1 font-semibold">Due Date: {invoice.date}</span>
                    </div>

                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-lg font-extrabold text-slate-950">${invoice.amount.toFixed(2)}</span>
                      
                      {paySuccessId === invoice.id ? (
                        <div className="rounded-lg bg-green-500 text-white font-bold px-4 py-2 text-xs">
                          Paid!
                        </div>
                      ) : (
                        <button
                          disabled={payingId === invoice.id}
                          onClick={() => handlePay(invoice.id)}
                          className="rounded-lg bg-blue-600 text-white font-bold px-4 py-2 text-xs hover:bg-blue-700 transition cursor-pointer shrink-0"
                        >
                          {payingId === invoice.id ? "Paying..." : "Pay Now"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
                No outstanding co-pays or pending invoices.
              </div>
            )}
          </div>

          {/* Paid History */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>
            
            {paidList.length > 0 ? (
              <div className="space-y-3">
                {paidList.map((tx) => (
                  <div key={tx.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-slate-400" />
                      <div>
                        <strong className="block text-slate-800 text-xs sm:text-sm">{tx.description}</strong>
                        <span className="block text-[10px] text-slate-500 font-semibold">Processed {tx.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-bold text-slate-800">${tx.amount.toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded uppercase">
                        Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-xs py-2">No historical payments processed.</p>
            )}
          </div>

        </div>

        {/* Ledger Summary (Right) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <CreditCard className="h-4.5 w-4.5 text-blue-600" />
              <span>Billing Summary</span>
            </h3>

            <div className="space-y-3 text-sm font-semibold">
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Unresolved Balances</span>
                <span className="text-slate-900">${totalOutstanding.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold">
                <span className="text-slate-700">Total Payable</span>
                <span className="text-blue-600">${totalOutstanding.toFixed(2)}</span>
              </div>
            </div>

            {totalOutstanding > 0 && (
              <div className="pt-2">
                <div className="rounded-xl border border-blue-200 bg-blue-50/20 p-4 flex items-start space-x-2.5">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-blue-800 leading-relaxed font-semibold">
                    Flexible payment plan installments (0% APR) can be split into 6 monthly cycles at checkout.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
