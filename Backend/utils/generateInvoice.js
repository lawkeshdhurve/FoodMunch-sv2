import PDFDocument from 'pdfkit';

/**
 * Generates a PDF invoice buffer for a given order.
 * @param {Object} order The order document from the database.
 * @param {Object} user The user document from the database.
 * @returns {Promise<Buffer>} The generated PDF as a buffer.
 */
export const generateInvoice = (order, user) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            // Listen to data events and push them to the buffers array
            doc.on('data', buffers.push.bind(buffers));

            // Resolve the promise when the PDF is finished generating
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // ── Header ───────────────────────────────────────────
            doc.fontSize(28)
               .font('Helvetica-Bold')
               .fillColor('#ff6b35')
               .text('Food Munch', { align: 'right' });

            doc.fontSize(10)
               .fillColor('#888888')
               .text('Delicious food, delivered fast.', { align: 'right' })
               .moveDown(2);

            // ── Invoice Title ────────────────────────────────────
            doc.fontSize(20)
               .fillColor('#1a1a1a')
               .text('INVOICE', { align: 'left' })
               .moveDown();

            // ── Order Details & Address ──────────────────────────
            const topOfInfo = doc.y;

            // Order Info (Left side)
            doc.fontSize(10)
               .font('Helvetica-Bold')
               .fillColor('#555555')
               .text(`Order ID: `, 50, topOfInfo)
               .font('Helvetica')
               .fillColor('#1a1a1a')
               .text(`${order._id}`, 110, topOfInfo);
            
            doc.font('Helvetica-Bold')
               .fillColor('#555555')
               .text(`Date: `, 50, topOfInfo + 15)
               .font('Helvetica')
               .fillColor('#1a1a1a')
               .text(`${new Date(order.date).toLocaleString()}`, 110, topOfInfo + 15);

            // Billed To (Right side)
            doc.font('Helvetica-Bold')
               .fillColor('#555555')
               .text('Billed To:', 300, topOfInfo);

            doc.font('Helvetica')
               .fillColor('#1a1a1a')
               .text(`${order.address.firstName} ${order.address.lastName}`, 300, topOfInfo + 15)
               .text(`${order.address.street}`, 300, topOfInfo + 30)
               .text(`${order.address.city}, ${order.address.state} ${order.address.zipcode}`, 300, topOfInfo + 45)
               .text(`${order.address.country}`, 300, topOfInfo + 60)
               .text(`Phone: ${order.address.phone}`, 300, topOfInfo + 75);

            doc.moveDown(5);

            // ── Table Header ─────────────────────────────────────
            const tableTop = doc.y;
            const itemX = 50;
            const priceX = 300;
            const qtyX = 400;
            const totalX = 480;

            doc.font('Helvetica-Bold')
               .fontSize(10)
               .fillColor('#ffffff')
               .rect(50, tableTop, 500, 20)
               .fill('#ff6b35');

            doc.fillColor('#ffffff')
               .text('Item', itemX + 10, tableTop + 5)
               .text('Price', priceX, tableTop + 5, { width: 90, align: 'right' })
               .text('Quantity', qtyX, tableTop + 5, { width: 70, align: 'right' })
               .text('Total', totalX, tableTop + 5, { width: 60, align: 'right' });

            doc.moveDown(1);

            // ── Table Items ──────────────────────────────────────
            let y = tableTop + 25;
            doc.font('Helvetica').fillColor('#1a1a1a');

            let subtotal = 0;

            order.items.forEach((item, i) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                // Alternate row background
                if (i % 2 === 1) {
                    doc.rect(50, y - 5, 500, 20).fill('#f9f9f9');
                }

                doc.fillColor('#1a1a1a')
                   .text(item.name, itemX + 10, y, { width: 230 })
                   .text(`₹${item.price.toFixed(2)}`, priceX, y, { width: 90, align: 'right' })
                   .text(`${item.quantity}`, qtyX, y, { width: 70, align: 'right' })
                   .text(`₹${itemTotal.toFixed(2)}`, totalX, y, { width: 60, align: 'right' });

                y += 20;
            });

            // ── Totals ───────────────────────────────────────────
            const deliveryFee = 2; // Matches frontend hardcoded logic
            const grandTotal = order.amount; // Use the total amount from order

            // Line separator
            doc.moveTo(350, y).lineTo(550, y).lineWidth(1).stroke('#dddddd');
            y += 10;

            doc.font('Helvetica-Bold')
               .fillColor('#555555')
               .text('Subtotal:', 350, y, { width: 100, align: 'right' })
               .font('Helvetica')
               .fillColor('#1a1a1a')
               .text(`₹${subtotal.toFixed(2)}`, 450, y, { width: 90, align: 'right' });
            y += 20;

            doc.font('Helvetica-Bold')
               .fillColor('#555555')
               .text('Delivery Fee:', 350, y, { width: 100, align: 'right' })
               .font('Helvetica')
               .fillColor('#1a1a1a')
               .text(`₹${deliveryFee.toFixed(2)}`, 450, y, { width: 90, align: 'right' });
            y += 20;

            doc.font('Helvetica-Bold')
               .fillColor('#1a1a1a')
               .fontSize(12)
               .text('Total Paid:', 350, y, { width: 100, align: 'right' })
               .fillColor('#ff6b35')
               .text(`₹${grandTotal.toFixed(2)}`, 450, y, { width: 90, align: 'right' });

            // ── Footer ───────────────────────────────────────────
            doc.fontSize(10)
               .fillColor('#888888')
               .text('Thank you for ordering with Food Munch!', 50, 700, { align: 'center' });

            // Finalize PDF
            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};
