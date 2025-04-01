import { Platform } from 'react-native';
import { useHospitalStore } from '@/store/hospital-store';

// Function to handle printing of a specific element by ID (for web only)
export const handlePrint = (elementId: string) => {
  if (Platform.OS !== 'web') {
    console.log('Printing is only available on web platform');
    return {
      success: false,
      message: 'Printing is only available on web platform',
    };
  }

  const content = document.getElementById(elementId);
  if (!content) {
    console.error(`Element with ID "${elementId}" not found`);
    return {
      success: false,
      message: `Element with ID "${elementId}" not found`,
    };
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print');
    return {
      success: false,
      message: 'Pop-up blocked. Please allow pop-ups to print.',
    };
  }

  // Get the HTML content of the element
  const htmlContent = content.innerHTML;

  // Create a new document with proper styling
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-content">
        ${htmlContent}
      </div>
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()">Print</button>
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  return {
    success: true,
    message: 'Print window opened',
  };
};

// Function to generate a printable report
export const generateReport = (reportData: any) => {
  const { details } = useHospitalStore.getState();
  
  // Create a new window for printing
  if (Platform.OS === 'web') {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print reports');
      return;
    }
    
    // Get current date and time for the report footer
    const now = new Date();
    const dateTimeString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    
    // Generate HTML content for the report
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${details.name} - Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .report-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
          }
          .header {
            display: flex;
            align-items: center;
            border-bottom: 2px solid #4A6FA5;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .logo-container {
            width: 100px;
            margin-right: 20px;
          }
          .logo {
            max-width: 100%;
            height: auto;
          }
          .hospital-info {
            flex: 1;
          }
          .hospital-name {
            font-size: 22px;
            font-weight: bold;
            color: #4A6FA5;
            margin-bottom: 5px;
          }
          .hospital-address, .hospital-contact {
            font-size: 14px;
            margin-bottom: 3px;
          }
          .hospital-reg {
            font-size: 12px;
            color: #666;
          }
          .report-title {
            font-size: 24px;
            color: #4A6FA5;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            background-color: #f5f5f5;
            padding: 8px;
            border-radius: 4px;
          }
          .patient-info {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 20px;
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 5px;
          }
          .patient-field {
            font-size: 14px;
          }
          .patient-label {
            font-weight: bold;
            margin-right: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
            font-weight: 600;
          }
          .status-normal {
            color: #065f46;
            font-weight: 600;
          }
          .status-abnormal {
            color: #dc2626;
            font-weight: 600;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            text-align: center;
          }
          .footer-text {
            margin-bottom: 5px;
          }
          .print-date {
            font-style: italic;
          }
          @media print {
            body {
              padding: 0;
            }
            .report-container {
              border: none;
            }
            .no-print {
              display: none;
            }
            @page {
              size: auto;
              margin: 10mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            ${details.logo ? `
              <div class="logo-container">
                <img src="${details.logo}" class="logo" alt="${details.name} Logo">
              </div>
            ` : ''}
            <div class="hospital-info">
              <div class="hospital-name">${details.name}</div>
              <div class="hospital-address">${details.address}</div>
              <div class="hospital-contact">
                Phone: ${details.phone}
                ${details.email ? ` | Email: ${details.email}` : ''}
                ${details.website ? ` | Website: ${details.website}` : ''}
              </div>
              ${details.registrationNumber || details.taxId ? `
                <div class="hospital-reg">
                  ${details.registrationNumber ? `Reg. No: ${details.registrationNumber}` : ''}
                  ${details.taxId ? ` | ${details.taxId}` : ''}
                </div>
              ` : ''}
            </div>
          </div>
          
          <h1 class="report-title">LABORATORY REPORT</h1>
          
          <!-- Patient Information -->
          <div class="section">
            <div class="section-title">Patient Information</div>
            <div class="patient-info">
              <div class="patient-field">
                <span class="patient-label">Name:</span>
                <span>${reportData.patientName}</span>
              </div>
              <div class="patient-field">
                <span class="patient-label">ID:</span>
                <span>${reportData.patientId}</span>
              </div>
              <div class="patient-field">
                <span class="patient-label">Age:</span>
                <span>${reportData.patientAge}</span>
              </div>
              <div class="patient-field">
                <span class="patient-label">Gender:</span>
                <span>${reportData.patientGender}</span>
              </div>
              <div class="patient-field">
                <span class="patient-label">Report Date:</span>
                <span>${new Date(reportData.date).toLocaleDateString()}</span>
              </div>
              <div class="patient-field">
                <span class="patient-label">Report ID:</span>
                <span>${reportData.id}</span>
              </div>
            </div>
          </div>
          
          <!-- Test Results -->
          <div class="section">
            <div class="section-title">Test Results: ${reportData.testName}</div>
            <table>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Result</th>
                  <th>Normal Range</th>
                  <th>Units</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.results.map((result: any) => `
                  <tr>
                    <td>${result.parameterName}</td>
                    <td>${result.value}</td>
                    <td>${result.normalRange}</td>
                    <td>${result.unit}</td>
                    <td class="${result.isNormal ? 'status-normal' : 'status-abnormal'}">${result.isNormal ? 'Normal' : 'Abnormal'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <!-- Notes -->
          ${reportData.notes ? `
            <div class="section">
              <div class="section-title">Notes</div>
              <p>${reportData.notes}</p>
            </div>
          ` : ''}
          
          <!-- Footer -->
          <div class="footer">
            ${details.footer ? `<div class="footer-text">${details.footer}</div>` : ''}
            <div class="footer-text">This is a computer-generated report and does not require signature.</div>
            <div class="print-date">Printed on: ${dateTimeString}</div>
          </div>
          
          <!-- Print Button (only visible in preview) -->
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()">Print Report</button>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Write the HTML content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // For mobile, show an alert that printing is only available on web
    console.log('Printing is only available on web platform');
    return {
      success: false,
      message: 'Printing is only available on web platform',
    };
  }
  
  return {
    success: true,
    message: 'Report generated successfully',
  };
};

// Function to generate a printable invoice
export const generateInvoice = (invoiceData: any) => {
  const { details } = useHospitalStore.getState();
  
  // Create a new window for printing
  if (Platform.OS === 'web') {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print invoices');
      return;
    }
    
    // Get current date and time for the invoice footer
    const now = new Date();
    const dateTimeString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    
    // Calculate totals
    const subtotal = invoiceData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotal * (invoiceData.taxRate || 0) / 100;
    const discountAmount = subtotal * (invoiceData.discountRate || 0) / 100;
    const total = subtotal + taxAmount - discountAmount;
    
    // Generate HTML content for the invoice
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${details.name} - Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            display: flex;
            justify-content: space-between;
            padding-bottom: 20px;
            border-bottom: 2px solid #4A6FA5;
          }
          .invoice-info {
            margin-bottom: 10px;
          }
          .invoice-id {
            font-size: 18px;
            font-weight: bold;
            color: #4A6FA5;
          }
          .logo-container {
            width: 100px;
            height: auto;
          }
          .logo {
            max-width: 100%;
            height: auto;
          }
          .hospital-info {
            text-align: right;
          }
          .hospital-name {
            font-size: 24px;
            font-weight: bold;
            color: #4A6FA5;
            margin-bottom: 5px;
          }
          .hospital-address, .hospital-contact {
            font-size: 14px;
            margin-bottom: 3px;
          }
          .hospital-reg {
            font-size: 12px;
            color: #666;
          }
          .invoice-title {
            font-size: 28px;
            color: #4A6FA5;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
          }
          .patient-info {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 5px;
          }
          .patient-info h3 {
            margin-top: 0;
            color: #4A6FA5;
          }
          .payment-status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
          }
          .status-paid {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status-due {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          .invoice-items {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .invoice-items th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 12px;
            font-weight: 600;
          }
          .invoice-items td {
            border-bottom: 1px solid #e5e7eb;
            padding: 12px;
          }
          .invoice-total {
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
          }
          .total-table {
            width: 300px;
          }
          .total-table td {
            padding: 8px;
          }
          .total-table .total-row {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #4A6FA5;
            padding-top: 8px;
          }
          .payment-info {
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            text-align: center;
          }
          .footer-text {
            margin-bottom: 5px;
          }
          .print-date {
            font-style: italic;
          }
          @media print {
            body {
              padding: 0;
            }
            .invoice-container {
              border: none;
              box-shadow: none;
            }
            .no-print {
              display: none;
            }
            @page {
              size: auto;
              margin: 10mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="invoice-info">
              <div class="invoice-id">Invoice #${invoiceData.id.replace('i', '')}</div>
              <div>Date: ${new Date(invoiceData.date).toLocaleDateString()}</div>
            </div>
            <div class="hospital-info">
              <div class="hospital-name">${details.name}</div>
              <div class="hospital-address">${details.address}</div>
              <div class="hospital-contact">
                Phone: ${details.phone}
                ${details.email ? ` | Email: ${details.email}` : ''}
              </div>
              ${details.registrationNumber || details.taxId ? `
                <div class="hospital-reg">
                  ${details.registrationNumber ? `Reg. No: ${details.registrationNumber}` : ''}
                  ${details.taxId ? ` | ${details.taxId}` : ''}
                </div>
              ` : ''}
            </div>
          </div>
          
          <h1 class="invoice-title">INVOICE</h1>
          
          <div class="patient-info">
            <h3>Patient Information</h3>
            <div><strong>Name:</strong> ${invoiceData.patientName}</div>
            <div><strong>Patient ID:</strong> ${invoiceData.patientId}</div>
            <div><strong>Status:</strong> <span class="payment-status status-${invoiceData.status.toLowerCase()}">${invoiceData.status}</span></div>
          </div>
          
          <table class="invoice-items">
            <thead>
              <tr>
                <th>Test Description</th>
                <th>Code</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map((item: any) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.code || '-'}</td>
                  <td>₹${item.price.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="invoice-total">
            <table class="total-table">
              <tr>
                <td>Subtotal:</td>
                <td>₹${subtotal.toFixed(2)}</td>
              </tr>
              ${invoiceData.taxRate ? `
                <tr>
                  <td>Tax (${invoiceData.taxRate}%):</td>
                  <td>₹${taxAmount.toFixed(2)}</td>
                </tr>
              ` : ''}
              ${invoiceData.discountRate ? `
                <tr>
                  <td>Discount (${invoiceData.discountRate}%):</td>
                  <td>-₹${discountAmount.toFixed(2)}</td>
                </tr>
              ` : ''}
              <tr class="total-row">
                <td>Total:</td>
                <td>₹${total.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          
          <div class="payment-info">
            <h3>Payment Information</h3>
            <div><strong>Payment Method:</strong> ${invoiceData.paymentMethod || 'Not paid yet'}</div>
            <div><strong>Payment Terms:</strong> ${invoiceData.paymentTerms || 'Due on receipt'}</div>
          </div>
          
          <div class="footer">
            ${details.footer ? `<div class="footer-text">${details.footer}</div>` : ''}
            <div class="footer-text">This is a computer-generated invoice and does not require signature.</div>
            <div class="print-date">Printed on: ${dateTimeString}</div>
          </div>
          
          <!-- Print Button (only visible in preview) -->
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()">Print Invoice</button>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Write the HTML content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // For mobile, show an alert that printing is only available on web
    console.log('Printing is only available on web platform');
    return {
      success: false,
      message: 'Printing is only available on web platform',
    };
  }
  
  return {
    success: true,
    message: 'Invoice generated successfully',
  };
};