const fs = require('fs');
const path = require('path');
const moment = require('moment');
const constants = require('../utils/constants');

const fetchTemplates = (userDetails, bookingDetails, paymentDetails) => {
  const customerName = userDetails.name;
  const services = bookingDetails.services;
  const packages = bookingDetails.packages;
  const bookingDate = `${moment(bookingDetails.bookingDate).format('DD MMM YYYY')} at ${bookingDetails.timeSlot}`;
  const bookingOrderId = bookingDetails.bookingOrderId;
  let totalDiscount = '0';
  const paymentMethod = paymentDetails.paymentMethod;
  const paymentStatus = paymentDetails.paymentStatus;
  const BusinessLogo = constants.BUSINESS_LOGO_WHITE;
  const filePath = path.join(__dirname, '..', 'public', 'templates', 'appointment-confirm.html');
  let totalAmount = 0;
  let serviceString = '';

  if (services && services.length) {
        serviceString = services.reduce((acc, serviceData) => {
          acc += `
          <tr>
            <td>
              <div class="t-row" style="display: flex; align-items: center">
                <span>${serviceData.name}</span>
                <span class="service-counter"> x ${serviceData.quantity || 1}</span>
              </div>
            </td>
            <td class="text-right">₹${serviceData.price || 0}</td>
          </tr>`;
          return acc;
        }, '');

        totalAmount = services.reduce((acc, v) => {
          return acc + (+v.price * +v.quantity);
        }, 0);
  }

  if (packages && packages.length) {
    serviceString = serviceString + packages.reduce((acc, packageData) => {
      acc += `
          <tr>
            <td>
              <div class="t-row" style="display: flex; align-items: center">
                <span>${packageData.name}</span>
                <span class="service-counter"> x ${packageData.quantity || 1}</span>
              </div>
            </td>
            <td class="text-right">₹${packageData.finalAmount || 0}</td>
          </tr>`;
      return acc;
    }, '');
    totalAmount = totalAmount + packages.reduce((acc, v) => {
      return acc + (+v.finalAmount * +v.quantity);
    }, 0);

    totalDiscount = packages.reduce((acc, v) => {
      return acc + (+v.discount * +v.quantity);
    }, 0);


  }

  if (bookingDetails.couponId) {

  }

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, htmlContent) => {
      if (error) {
        reject(error);
      } else {

        let updatedHtmlContent = htmlContent.replace('{{CustomerName}}', customerName.toString());
        updatedHtmlContent = updatedHtmlContent.replace(/{{BookingTime}}/g, bookingDate);
        updatedHtmlContent = updatedHtmlContent.replace('{{PaymentMethod}}', capitalize(paymentMethod));
        updatedHtmlContent = updatedHtmlContent.replace('{{PaymentStatus}}', capitalize(paymentStatus));
        updatedHtmlContent = updatedHtmlContent.replace('{{BookingOrderId}}', bookingOrderId);
        updatedHtmlContent = updatedHtmlContent.replace('{{TotalDiscount}}', totalDiscount);
        updatedHtmlContent = updatedHtmlContent.replace('{{TotalAmount}}', totalAmount.toString());
        updatedHtmlContent = updatedHtmlContent.replace('{{BusinessLogo}}', BusinessLogo);
        updatedHtmlContent = updatedHtmlContent.replace('{{Services}}', serviceString);
        return resolve(updatedHtmlContent);
      }
    });
  });
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  fetchTemplates
};
