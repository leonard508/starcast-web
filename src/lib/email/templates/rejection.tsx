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

interface RejectionEmailProps {
  customerName: string;
  packageName: string;
  applicationId: string;
  rejectionReason?: string;
  alternativeOptions?: string;
  contactPhone?: string;
}

export const RejectionEmail = ({
  customerName = 'Customer',
  packageName = 'Internet Package',
  applicationId = 'APP-001',
  rejectionReason = 'service not available in your area',
  alternativeOptions,
  contactPhone = '087 550 0000',
}: RejectionEmailProps) => {
  const previewText = `Unfortunately, ${packageName} service is not available in your area`;

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
          
          <Heading style={h1}>Service Availability Update</Heading>
          
          <Text style={heroText}>
            Thank you for your interest in Starcast internet services.
          </Text>
          
          <Section style={rejectionBox}>
            <Text style={rejectionText}>
              Application Reference
            </Text>
            <Text style={applicationText}>
              {applicationId}
            </Text>
            <Text style={packageText}>
              {packageName}
            </Text>
          </Section>
          
          <Text style={text}>
            Dear {customerName},
          </Text>
          
          <Text style={text}>
            Thank you for your interest in our <strong>{packageName}</strong> service. 
            After reviewing your application, we regret to inform you that we are currently 
            unable to provide service to your location.
          </Text>
          
          <Section style={reasonBox}>
            <Text style={reasonTitle}>Reason:</Text>
            <Text style={reasonText}>
              Unfortunately, {rejectionReason} at this time.
            </Text>
          </Section>
          
          <Text style={text}>
            <strong>What this means:</strong>
          </Text>
          
          <ul style={list}>
            <li>Our network infrastructure is not yet available in your specific area</li>
            <li>We are continuously expanding our coverage areas</li>
            <li>Your details will be kept on file for future service availability</li>
            <li>You will be notified as soon as service becomes available</li>
          </ul>
          
          {alternativeOptions && (
            <>
              <Text style={text}>
                <strong>Alternative Options:</strong>
              </Text>
              <Text style={text}>
                {alternativeOptions}
              </Text>
            </>
          )}
          
          <Section style={futureBox}>
            <Text style={futureTitle}>Future Service Availability</Text>
            <Text style={futureText}>
              We are actively working to expand our network coverage. Your contact details 
              have been added to our expansion database, and we will notify you as soon as 
              service becomes available in your area.
            </Text>
          </Section>
          
          <Text style={text}>
            In the meantime, please feel free to:
          </Text>
          
          <ul style={list}>
            <li>Check our website for coverage updates: www.starcast.co.za</li>
            <li>Follow us on social media for network expansion announcements</li>
            <li>Contact us if your address details have changed</li>
            <li>Recommend us to friends and family in areas we do serve</li>
          </ul>
          
          <Text style={text}>
            If you have any questions or need assistance with alternative solutions, 
            please don't hesitate to contact us:
          </Text>
          
          <ul style={list}>
            <li><strong>Email:</strong> info@starcast.co.za</li>
            <li><strong>Phone:</strong> {contactPhone}</li>
            <li><strong>Website:</strong> www.starcast.co.za</li>
          </ul>
          
          <Text style={text}>
            We sincerely apologize for any inconvenience and look forward to serving 
            you in the future as we continue to expand our network.
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

export default RejectionEmail;

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

const rejectionBox = {
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  borderRadius: '8px',
  margin: '16px auto 40px',
  padding: '24px',
  textAlign: 'center' as const,
};

const rejectionText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const applicationText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 8px',
};

const packageText = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  opacity: 0.9,
};

const reasonBox = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  margin: '24px auto',
  padding: '20px',
};

const reasonTitle = {
  color: '#dc2626',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const reasonText = {
  color: '#7f1d1d',
  fontSize: '14px',
  margin: '0',
  lineHeight: '20px',
};

const futureBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  margin: '24px auto',
  padding: '20px',
};

const futureTitle = {
  color: '#166534',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const futureText = {
  color: '#15803d',
  fontSize: '14px',
  margin: '0',
  lineHeight: '20px',
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