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

interface WelcomeEmailProps {
  customerName: string;
  packageName: string;
  applicationId: string;
  contactPhone?: string;
}

export const WelcomeEmail = ({
  customerName = 'Customer',
  packageName = 'Internet Package',
  applicationId = 'APP-001',
  contactPhone = '087 550 0000',
}: WelcomeEmailProps) => {
  const previewText = `Thank you for your ${packageName} application - We'll contact you within 24 hours`;

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
          
          <Heading style={h1}>Application Received - Thank You!</Heading>
          
          <Text style={heroText}>
            Your internet service application has been successfully submitted.
          </Text>
          
          <Section style={codeBox}>
            <Text style={confirmationCodeText}>
              Application Reference
            </Text>
            <Text style={codeText}>
              {applicationId}
            </Text>
            <Text style={packageCodeText}>
              {packageName}
            </Text>
          </Section>
          
          <Text style={text}>
            Dear {customerName},
          </Text>
          
          <Text style={text}>
            Thank you for choosing Starcast as your internet service provider. We have successfully 
            received your application for the <strong>{packageName}</strong> package.
          </Text>
          
          <Section style={highlightBox}>
            <Text style={highlightTitle}>What happens next?</Text>
            <Text style={highlightText}>
              A Starcast support agent will contact you within <strong>24 hours</strong> to review 
              your application and discuss installation details.
            </Text>
          </Section>
          
          <Text style={text}>
            <strong>Our team will:</strong>
          </Text>
          
          <ul style={list}>
            <li>Verify service availability in your area</li>
            <li>Confirm your package selection and pricing</li>
            <li>Schedule your installation appointment</li>
            <li>Provide you with account login details (if approved)</li>
            <li>Explain the payment and activation process</li>
          </ul>
          
          <Text style={text}>
            <strong>Expected call from:</strong> {contactPhone}
          </Text>
          
          <Text style={text}>
            <strong>Package Information:</strong>
          </Text>
          
          <ul style={list}>
            <li><strong>Service:</strong> {packageName}</li>
            <li><strong>Technology:</strong> Fibre/LTE connectivity</li>
            <li><strong>Installation:</strong> Professional setup included</li>
            <li><strong>Support:</strong> 24/7 technical assistance</li>
          </ul>
          
          <Text style={text}>
            If you have any urgent questions before we contact you, please feel free to reach out:
          </Text>
          
          <ul style={list}>
            <li><strong>Email:</strong> info@starcast.co.za</li>
            <li><strong>Phone:</strong> {contactPhone}</li>
            <li><strong>Website:</strong> www.starcast.co.za</li>
          </ul>
          
          <Text style={text}>
            We look forward to providing you with reliable, high-speed internet connectivity.
          </Text>
          
          <Text style={text}>
            Best regards,<br />
            The Starcast Team<br />
            <em>Premium Internet Service Provider</em>
          </Text>
          
          <Section style={footer}>
            <Text style={footerText}>
              Starcast (Pty) Ltd - Premium Internet Service Provider
            </Text>
            <Text style={footerText}>
              📞 {contactPhone} | 📧 info@starcast.co.za
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

export default WelcomeEmail;

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

const codeBox = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '8px',
  margin: '16px auto 40px',
  padding: '24px',
  textAlign: 'center' as const,
};

const confirmationCodeText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const codeText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
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

const packageCodeText = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '8px 0 0 0',
  opacity: 0.9,
};

const highlightBox = {
  backgroundColor: '#f0f9ff',
  border: '1px solid #0ea5e9',
  borderRadius: '8px',
  margin: '24px auto',
  padding: '20px',
};

const highlightTitle = {
  color: '#0c4a6e',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const highlightText = {
  color: '#0369a1',
  fontSize: '14px',
  margin: '0',
  lineHeight: '20px',
};