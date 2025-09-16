
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FinanceOverview from '@/components/finance/FinanceOverview';
import PaymentDetail from '@/components/finance/PaymentDetail';
import InvoiceDetail from '@/components/finance/InvoiceDetail';
import CreateInvoice from '@/components/finance/CreateInvoice';
import InvoicesList from '@/components/finance/InvoicesList';
import TouristInvoices from '@/components/finance/TouristInvoices';
import StudentInvoices from '@/components/finance/StudentInvoices';
import PaymentPlans from '@/components/finance/PaymentPlans';
import PendingPayments from '@/components/finance/PendingPayments';
import Expenses from '@/components/finance/Expenses';

const FinanceModule: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<FinanceOverview />} />
        <Route path="/payments" element={<FinanceOverview />} />
        <Route path="/invoices" element={<InvoicesList />} />
        <Route path="/invoices/new" element={<CreateInvoice />} />
        <Route path="/tourist-invoices" element={<TouristInvoices />} />
        <Route path="/tourist-invoices/new" element={<CreateInvoice />} />
        <Route path="/student-invoices" element={<StudentInvoices />} />
        <Route path="/student-invoices/new" element={<CreateInvoice />} />
        <Route path="/payment-plans" element={<PaymentPlans />} />
        <Route path="/pending-payments" element={<PendingPayments />} />
        <Route path="/payment/:id" element={<PaymentDetail />} />
        <Route path="/invoice/:id" element={<InvoiceDetail />} />
        <Route path="/create-invoice" element={<CreateInvoice />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<FinanceOverview />} />
      </Routes>
    </div>
  );
};

export default FinanceModule;
