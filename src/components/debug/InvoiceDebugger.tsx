import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApiService } from '@/services/api';
import { useAcademicYear } from '@/contexts/AcademicYearContext';

const InvoiceDebugger = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { selectedAcademicYear } = useAcademicYear();

  const runDebug = async () => {
    setLoading(true);
    try {
      console.log('🔍 DEBUG: Starting invoice debugging...');
      
      // Get all students
      const students = await ApiService.getStudents(selectedAcademicYear);
      console.log('🔍 DEBUG: Found students:', students);
      
      // Get all invoices
      const allInvoices = await ApiService.getInvoices(selectedAcademicYear);
      console.log('🔍 DEBUG: Found all invoices:', allInvoices);
      
      // Check each student's invoices
      const studentInvoiceData = await Promise.all(
        students.map(async (student) => {
          try {
            const studentInvoices = await ApiService.getInvoicesByStudentId(student.id, selectedAcademicYear);
            return {
              student: {
                id: student.id,
                name: `${student.first_name} ${student.last_name}`,
                email: student.email,
                academic_year: student.academic_year
              },
              invoices: studentInvoices,
              invoiceCount: studentInvoices.length
            };
          } catch (error) {
            return {
              student: {
                id: student.id,
                name: `${student.first_name} ${student.last_name}`,
                email: student.email,
                academic_year: student.academic_year
              },
              invoices: [],
              invoiceCount: 0,
              error: error.message
            };
          }
        })
      );
      
      const debugData = {
        selectedAcademicYear,
        totalStudents: students.length,
        totalInvoices: allInvoices.length,
        studentInvoiceData,
        allStudents: students.map(s => ({
          id: s.id,
          name: `${s.first_name} ${s.last_name}`,
          email: s.email,
          academic_year: s.academic_year
        })),
        allInvoices: allInvoices.map(i => ({
          id: i.id,
          invoice_number: i.invoice_number,
          student_id: i.student_id,
          type: i.type,
          total_amount: i.total_amount,
          academic_year: i.academic_year
        }))
      };
      
      setDebugInfo(debugData);
      console.log('🔍 DEBUG: Complete debug data:', debugData);
      
    } catch (error) {
      console.error('❌ DEBUG: Error during debugging:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Invoice Debugger</CardTitle>
        <Button onClick={runDebug} disabled={loading}>
          {loading ? 'Running Debug...' : 'Run Debug Check'}
        </Button>
      </CardHeader>
      <CardContent>
        {debugInfo && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Current Academic Year: {selectedAcademicYear}</h3>
            </div>
            
            <div>
              <h3 className="font-semibold">Summary:</h3>
              <p>Total Students: {debugInfo.totalStudents}</p>
              <p>Total Invoices: {debugInfo.totalInvoices}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Student Invoice Status:</h3>
              {debugInfo.studentInvoiceData?.map((data: any, index: number) => (
                <div key={index} className="border p-2 rounded mb-2">
                  <p><strong>{data.student.name}</strong> ({data.student.email})</p>
                  <p>Student Academic Year: {data.student.academic_year}</p>
                  <p>Invoice Count: {data.invoiceCount}</p>
                  {data.error && <p className="text-red-500">Error: {data.error}</p>}
                  {data.invoices?.length > 0 && (
                    <div>
                      <p>Invoices:</p>
                      <ul className="ml-4">
                        {data.invoices.map((inv: any, i: number) => (
                          <li key={i}>
                            {inv.invoice_number} - {inv.type} - £{inv.total_amount} - Academic Year: {inv.academic_year}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="font-semibold">All Students:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.allStudents, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold">All Invoices:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.allInvoices, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceDebugger;
