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
} from '@react-email/components';
import * as React from 'react';

interface ApprovalEmailProps {
  customerName: string;
  packageName: string;
  activationDate: string;
  installationContact?: string;
  accountNumber?: string;
}

export const ApprovalEmail = ({
  customerName = 'Customer',
  packageName = 'Internet Package',
  activationDate = 'within 1-2 business days',
  installationContact,
  accountNumber,
}: ApprovalEmailProps) => {
  const previewText = `Your ${packageName} service has been approved - Installation scheduled`;

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
          
          <Heading style={h1}>Service Approved! 🎉</Heading>
          
          <Text style={heroText}>
            Great news! Your internet service application has been approved.
          </Text>
          
          <Section style={approvalBox}>
            <Text style={approvalText}>
              Service Approved
            </Text>
            <Text style={packageText}>
              {packageName}
            </Text>
            <Text style={activationText}>
              Activation: {activationDate}
            </Text>
          </Section>
          
          <Text style={text}>
            Dear {customerName},
          </Text>
          
          <Text style={text}>
            Congratulations! Your application for the <strong>{packageName}</strong> has been approved 
            and is ready for installation.
          </Text>
          
          {accountNumber && (
            <Text style={text}>
              Your account number is: <strong>{accountNumber}</strong>
            </Text>
          )}
          
          <Text style={text}>
            <strong>Next Steps:</strong>
          </Text>
          
          <ul style={list}>
            <li>Our installation team will contact you within 24 hours to schedule installation</li>
            <li>Installation typically takes 2-4 hours</li>
            <li>You'll receive your router and setup instructions</li>
            <li>Your first invoice will be sent after activation</li>
          </ul>
          
          {installationContact && (
            <Text style={text}>
              Installation Contact: <strong>{installationContact}</strong>
            </Text>
          )}
          
          <Text style={text}>
            <strong>What to expect:</strong>
          </Text>
          
          <ul style={list}>
            <li>High-speed, reliable internet connectivity</li>
            <li>Professional installation and setup</li>
            <li>24/7 technical support</li>
            <li>Monthly billing with convenient payment options</li>
          </ul>
          
          <Text style={text}>
            If you have any questions, please contact our support team at support@starcast.co.za 
            or call us at 087 550 0000.
          </Text>
          
          <Text style={text}>
            Welcome to the Starcast family!<br />
            The Starcast Team
          </Text>
          
          <Section style={footer}>
            <Text style={footerText}>
              Starcast (Pty) Ltd - Premium Internet Service Provider
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

export default ApprovalEmail;

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

const approvalBox = {
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '8px',
  margin: '16px auto 40px',
  padding: '24px',
  textAlign: 'center' as const,
};

const approvalText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const packageText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 8px',
};

const activationText = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  opacity: 0.9,
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
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
};

const footerLink = {
  color: '#4f46e5',
  fontSize: '14px',
  textDecoration: 'underline',
};