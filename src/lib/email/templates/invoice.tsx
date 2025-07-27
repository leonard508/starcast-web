import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface InvoiceEmailProps {
  customerName: string;
  invoiceNumber: string;
  dueDate: string;
  amount: number;
  packageName: string;
  billingPeriod: string;
  paymentUrl?: string;
}

export const InvoiceEmail = ({
  customerName = 'Customer',
  invoiceNumber = 'INV-001',
  dueDate = '1st of next month',
  amount = 0,
  packageName = 'Internet Package',
  billingPeriod = 'Current month',
  paymentUrl,
}: InvoiceEmailProps) => {
  const previewText = `Invoice ${invoiceNumber} - R${amount.toFixed(2)} due ${dueDate}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={`https://starcast.co.za/wp-content/uploads/2024/01/starcast-logo.png`}
              width="120"
              height="36"
              alt="Starcast"
              style={logo}
            />
          </Section>
          
          <Heading style={h1}>Monthly Invoice</Heading>
          
          <Text style={heroText}>
            Your monthly internet service invoice is ready.
          </Text>
          
          <Section style={invoiceBox}>
            <Text style={invoiceText}>
              Invoice #{invoiceNumber}
            </Text>
            <Text style={amountText}>
              R{amount.toFixed(2)}
            </Text>
            <Text style={dueDateText}>
              Due: {dueDate}
            </Text>
          </Section>
          
          <Text style={text}>
            Dear {customerName},
          </Text>
          
          <Text style={text}>
            Your monthly invoice for <strong>{packageName}</strong> is now available.
          </Text>
          
          <Section style={invoiceDetails}>
            <Text style={detailsHeader}>Invoice Details</Text>
            <Hr style={hr} />
            
            <div style={invoiceRow}>
              <Text style={invoiceLabel}>Service Period:</Text>
              <Text style={invoiceValue}>{billingPeriod}</Text>
            </div>
            
            <div style={invoiceRow}>
              <Text style={invoiceLabel}>Package:</Text>
              <Text style={invoiceValue}>{packageName}</Text>
            </div>
            
            <div style={invoiceRow}>
              <Text style={invoiceLabel}>Amount (excl. VAT):</Text>
              <Text style={invoiceValue}>R{(amount / 1.15).toFixed(2)}</Text>
            </div>
            
            <div style={invoiceRow}>
              <Text style={invoiceLabel}>VAT (15%):</Text>
              <Text style={invoiceValue}>R{(amount - amount / 1.15).toFixed(2)}</Text>
            </div>
            
            <Hr style={hr} />
            
            <div style={invoiceRowTotal}>
              <Text style={invoiceLabelTotal}>Total Amount Due:</Text>
              <Text style={invoiceValueTotal}>R{amount.toFixed(2)}</Text>
            </div>
          </Section>
          
          {paymentUrl && (
            <Section style={paymentSection}>
              <Link href={paymentUrl} style={paymentButton}>
                Pay Invoice Now
              </Link>
            </Section>
          )}
          
          <Text style={text}>
            <strong>Payment Options:</strong>
          </Text>
          
          <ul style={list}>
            <li>Online payment via secure payment gateway</li>
            <li>Bank transfer (details on attached PDF invoice)</li>
            <li>Debit order (contact us to set up)</li>
          </ul>
          
          <Text style={text}>
            Please ensure payment is made by the due date to avoid service interruption. 
            A PDF copy of your invoice is attached to this email.
          </Text>
          
          <Text style={text}>
            For any billing queries, please contact our accounts team at accounts@starcast.co.za 
            or call us at 087 550 0000.
          </Text>
          
          <Text style={text}>
            Thank you for choosing Starcast.<br />
            The Starcast Team
          </Text>
          
          <Section style={footer}>
            <Text style={footerText}>
              Starcast (Pty) Ltd - Premium Internet Service Provider
            </Text>
            <Text style={footerText}>
              VAT Registration: 4123456789 | Registration: 2023/123456/07
            </Text>
            <Link href="https://starcast.co.za" style={footerLink}>
              www.starcast.co.za
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default InvoiceEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logoContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const heroText = {
  color: '#6b7280',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 32px',
  textAlign: 'center' as const,
};

const invoiceBox = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  borderRadius: '8px',
  margin: '16px auto 40px',
  padding: '24px',
  textAlign: 'center' as const,
};

const invoiceText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const amountText = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 8px',
};

const dueDateText = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  opacity: 0.9,
};

const invoiceDetails = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  margin: '16px auto 32px',
  padding: '24px',
};

const detailsHeader = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const invoiceRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '8px 0',
};

const invoiceRowTotal = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '16px 0 0',
};

const invoiceLabel = {
  color: '#6b7280',
  fontSize: '14px',
  margin: 0,
};

const invoiceValue = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: '500',
  margin: 0,
};

const invoiceLabelTotal = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: 0,
};

const invoiceValueTotal = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '700',
  margin: 0,
};

const paymentSection = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const paymentButton = {
  backgroundColor: '#10b981',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  padding: '0 32px',
};

const list = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  padding: '0 32px',
};

const footer = {
  margin: '32px 0 0',
  padding: '0 32px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 4px',
};

const footerLink = {
  color: '#4f46e5',
  fontSize: '14px',
  textDecoration: 'underline',
};