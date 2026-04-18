import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Printer, Download, MessageSquare, List
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function InvoiceModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const invNumber = order.orderId || order._id.slice(-6).toUpperCase();

  // THE ULTIMATE PRINT-PERFECT MARKUP GENERATED HERE
  const getInvoiceMarkup = () => {
    // Generate Table Rows
    let rows = "";
    (order.cartItems || []).forEach(item => {
      rows += `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #1a1a1a;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #666;">₹${item.price}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #666;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #1a1a1a;">₹${item.price * item.quantity}</td>
        </tr>
      `;
    });

    const logoUrl = window.location.origin + "/logo.png";
    const dateStr = new Date(order.createdAt).toLocaleDateString();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${invNumber}</title>
        <style>
          /* A4 PAGE SETUP */
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
            .no-print { display: none !important; }
          }
          
          /* RESET & FONT */
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            margin: 0; 
            padding: 20mm; 
            color: #333; 
            background: #fff;
            line-height: 1.4;
          }

          /* CONTAINER */
          #invoice {
            width: 170mm; /* A4 width (210mm) - 2x20mm padding */
            margin: 0 auto;
            position: relative;
          }

          /* HEADER - BLOCK LAYOUT (No Flex) */
          .header {
            width: 100%;
            margin-bottom: 40px;
            clear: both;
            display: block;
            overflow: hidden;
          }
          .header-left { float: left; width: 60%; }
          .header-right { float: right; width: 35%; text-align: right; }

          h1 { margin: 0; font-size: 28px; color: #1a1a1a; letter-spacing: -1px; }
          .tagline { margin: 0; color: #ff6b00; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }

          /* DETAILS SECTION - BLOCK LAYOUT */
          .details-grid {
            width: 100%;
            margin-bottom: 40px;
            clear: both;
            display: block;
            overflow: hidden;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            padding: 30px 0;
          }
          .bill-to { float: left; width: 55%; }
          .order-info { float: right; width: 40%; text-align: right; }

          /* TABLE STYLING */
          table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          thead { display: table-header-group; background: #f9f9f9; }
          th { 
            padding: 12px; 
            border-bottom: 2px solid #1a1a1a; 
            text-align: left; 
            font-size: 11px; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            color: #666;
          }
          tr { page-break-inside: avoid; }

          /* SUMMARY */
          .summary-box {
            float: right;
            width: 250px;
            margin-top: 20px;
          }
          .summary-row {
            display: block;
            width: 100%;
            overflow: hidden;
            margin-bottom: 10px;
          }
          .sum-label { float: left; font-size: 11px; color: #999; text-transform: uppercase; font-weight: bold; }
          .sum-value { float: right; font-weight: bold; font-size: 14px; }
          .grand-total { 
            border-top: 1px solid #eee; 
            padding-top: 15px; 
            margin-top: 10px; 
            color: #ff6b00;
          }
          .grand-total .sum-value { font-size: 22px; }

          /* FOOTER */
          .footer {
            margin-top: 80px;
            clear: both;
            border-top: 1px solid #eee;
            padding-top: 30px;
          }
          .footer-cols { width: 100%; overflow: hidden; }
          .terms { float: left; width: 60%; font-size: 10px; color: #999; }
          .signature { float: right; width: 35%; text-align: right; }
          .sig-box { 
            height: 60px; 
            border-bottom: 1px solid #ddd; 
            margin-bottom: 10px;
            display: block;
          }
          
          .clear { clear: both; }
        </style>
      </head>
      <body>
        <div id="invoice">
          
          <!-- Header -->
          <div class="header">
            <div class="header-left">
              <h1>Sathya Traders</h1>
              <p class="tagline">Since 2000</p>
              <div style="margin-top: 15px; font-size: 11px; color: #666;">
                <p style="margin: 2px 0; max-width: 250px; line-height: 1.3;">7a, muthukaruppa pillai lane, south street, anuppanadi, madurai, tamil nadu, 625009</p>
                <p style="margin: 2px 0;">Phone: +91 9659798598</p>
                <p style="margin: 2px 0;">Website: www.SathyaTraders.in</p>
              </div>
            </div>
            <div class="header-right">
              <p style="margin: 0; color: #f2f2f2; font-size: 44px; font-weight: 900; line-height: 1;">INVOICE</p>
              <div style="margin-top: 10px;">
                <p style="margin: 0; font-size: 9px; color: #aaa; text-transform: uppercase; font-weight: bold;">Invoice No</p>
                <p style="margin: 2px 0 15px 0; font-size: 16px; font-weight: bold; font-family: monospace;">#INV-${invNumber}</p>
                <p style="margin: 0; font-size: 9px; color: #aaa; text-transform: uppercase; font-weight: bold;">Date</p>
                <p style="margin: 2px 0; font-size: 14px; font-weight: bold;">${dateStr}</p>
              </div>
            </div>
          </div>

          <!-- Billing Details -->
          <div class="details-grid">
            <div class="bill-to">
              <p style="margin: 0 0 10px 0; font-size: 9px; color: #aaa; text-transform: uppercase; font-weight: bold;">Billed To:</p>
              <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold; color: #1a1a1a;">${order.userName}</p>
              <p style="margin: 0; font-size: 12px; color: #666;">Phone: ${order.phone}</p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666; max-width: 250px;">
                ${order.shippingAddress ? (
                  `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
                ) : (
                  order.address || 'N/A'
                )}
              </p>
            </div>
            <div class="order-info">
              <p style="margin: 0 0 10px 0; font-size: 9px; color: #aaa; text-transform: uppercase; font-weight: bold;">Order Summary:</p>
              <p style="margin: 0 0 5px 0; font-size: 11px; color: #aaa;">Status</p>
              <p style="margin: 0 0 15px 0; font-size: 13px; font-weight: bold; color: #10b981;">${order.paymentStatus || 'Paid'}</p>
              <p style="margin: 0 0 5px 0; font-size: 11px; color: #aaa;">Payment Method</p>
              <p style="margin: 0; font-size: 13px; font-weight: bold; text-transform: uppercase;">${order.paymentMethod}</p>
            </div>
            <div class="clear"></div>
          </div>

          <!-- Items Table -->
          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Description</th>
                <th style="text-align: center;">Price</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <!-- Totals Area -->
          <div class="summary-box">
            <div class="summary-row">
              <span class="sum-label">Subtotal</span>
              <span class="sum-value">₹${order.totalAmount}</span>
            </div>
            <div class="summary-row">
              <span class="sum-label">Shipping</span>
              <span class="sum-value" style="color: #10b981;">FREE</span>
            </div>
            <div class="summary-row grand-total">
              <span class="sum-label" style="color: #1a1a1a;">Grand Total</span>
              <span className="sum-value">₹${order.totalAmount}</span>
            </div>
            <div class="clear"></div>
          </div>
          <div class="clear"></div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-cols">
              <div class="terms">
                <p style="font-weight: bold; color: #333; margin-bottom: 5px;">Terms & Conditions</p>
                <p style="max-width: 300px;">
                  1. Goods once sold cannot be returned.<br>
                  2. Check items at the time of delivery.<br>
                  3. For any queries, please call +91 9659798598.
                </p>
              </div>
              <div class="signature">
                <div class="sig-box"></div>
                <p style="font-size: 10px; font-weight: bold; text-transform: uppercase;">For Sathya Traders</p>
              </div>
            </div>
            <div class="clear"></div>
            <p style="text-align: center; margin-top: 40px; font-size: 10px; color: #ccc; letter-spacing: 5px; text-transform: uppercase;">
              Thank you for shopping with us!
            </p>
          </div>

        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const markup = getInvoiceMarkup();
    const printWindow = window.open("", "_blank");
    printWindow.document.write(markup);
    printWindow.document.close();
    printWindow.focus();
    // Wait for everything to settle
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleDownloadPDF = () => {
    const markup = getInvoiceMarkup();
    
    // Create a temporary, hidden div for html2pdf
    const element = document.createElement('div');
    element.style.display = 'none';
    element.innerHTML = markup;
    document.body.appendChild(element);

    const opt = {
      margin: 0,
      filename: `Invoice_${invNumber}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        windowWidth: 794 // Exact px width for 210mm at 96DPI
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      toast.loading("Generating Perfect PDF...", { id: 'pdf-gen' });
      window.html2pdf().set(opt).from(element.querySelector('#invoice')).save().then(() => {
        toast.success("Invoice downloaded!", { id: 'pdf-gen' });
        document.body.removeChild(element);
      }).catch(err => {
        console.error("PDF Fail:", err);
        toast.error("Failed to generate PDF", { id: 'pdf-gen' });
        document.body.removeChild(element);
      });
    } else {
      toast.error("Library loading...");
    }
  };

  const handleSendWhatsApp = () => {
    const msg = `Hello ${order.userName}, your invoice #${invNumber} for ₹${order.totalAmount} is ready. Thank you for shopping with Sathya Traders!`;
    window.open(`https://wa.me/${order.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-secondary/70 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col no-print"
        >
          {/* Dashboard Header UI */}
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3 text-secondary">
               <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">B</div>
               <div>
                  <h3 className="font-extrabold text-xl tracking-tight">Invoice System</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Order #${invNumber}</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrint}
                className="bg-white text-secondary border border-gray-100 px-6 py-3 rounded-2xl text-xs font-extrabold hover:border-primary hover:text-primary transition-all flex items-center gap-2 active:scale-95"
              >
                <Printer size={16} /> Print
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="bg-secondary text-white px-6 py-3 rounded-2xl text-xs font-extrabold hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-secondary/20 active:scale-95"
              >
                <Download size={16} /> PDF
              </button>
              <div className="w-px h-8 bg-gray-100 mx-2" />
              <button onClick={onClose} className="bg-gray-50 p-3 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* User Preview Area */}
          <div className="flex-grow overflow-y-auto bg-gray-50/50 p-8 flex flex-col items-center gap-8 scrollbar-hide">
            
            {/* Action Card */}
            <div className="bg-white w-full p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-2xl text-green-600"><MessageSquare size={24} /></div>
                  <div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Ready</p>
                     <p className="text-sm font-bold text-secondary">{order.userName} • {order.phone}</p>
                  </div>
               </div>
               <button onClick={handleSendWhatsApp} className="bg-green-500 text-white px-6 py-3 rounded-xl text-xs font-extrabold hover:bg-green-600 transition-all active:scale-95">
                  Send to WhatsApp
               </button>
            </div>

            {/* Visual Preview (Not for printing, just for viewing in dashboard) */}
            <div className="bg-white shadow-xl rounded-lg p-12 w-full max-w-[210mm] min-h-[297mm] ring-1 ring-gray-100">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
                    <div>
                       <h2 className="text-2xl font-bold text-secondary">Sathya Traders</h2>
                       <p className="text-primary text-[10px] font-bold uppercase tracking-widest">Since 2000</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-5xl font-black text-gray-100">INVOICE</h1>
                    <p className="font-mono text-secondary font-bold">#INV-{invNumber}</p>
                  </div>
               </div>
               <div className="h-px bg-gray-100 my-8"></div>
               <div className="grid grid-cols-2 gap-12 text-sm">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Billed To</p>
                    <p className="font-extrabold text-secondary text-lg">{order.userName}</p>
                    <p className="text-gray-500 mt-2 leading-relaxed">
                      {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}` : order.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Order Info</p>
                    <p className="font-bold text-secondary">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="font-bold text-primary mt-1">Total: ₹{order.totalAmount}</p>
                  </div>
               </div>
               
               <div className="mt-12 bg-gray-50 rounded-2xl p-6 flex flex-col gap-4">
                 <div className="flex items-center gap-3 text-secondary font-bold border-b border-gray-200 pb-4">
                    <List size={18} /> Order Items
                 </div>
                 {(order.cartItems || []).map((item, i) => (
                   <div key={i} className="flex justify-between py-2 items-center">
                     <div>
                        <p className="font-bold text-secondary">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} x ₹{item.price}</p>
                     </div>
                     <p className="font-bold text-secondary">₹{item.price * item.quantity}</p>
                   </div>
                 ))}
               </div>

               <div className="mt-12 flex flex-col items-center gap-4 grayscale opacity-30">
                  <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Preview Mode Only</p>
               </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
