import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './SignupForm.css';

const SignupForm = ({ onSubmit, disabled, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      
      // Show preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    } else {
      setFileName('');
      setFilePreview(null);
    }
  };

  const handleFormSubmit = (data) => {
    // Create FormData to handle file upload
    const formData = new FormData();
    
    // Add all form fields
    Object.keys(data).forEach(key => {
      if (key === 'id_document' && data[key][0]) {
        formData.append(key, data[key][0]);
      } else if (key !== 'id_document') {
        formData.append(key, data[key]);
      }
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="signup-form" encType="multipart/form-data">
      <div className="form-section">
        <h4>Personal Information</h4>
        
        <div className="form-row name-row">
          <div className="form-group">
            <label htmlFor="contact_name">First Name:</label>
            <input
              type="text"
              id="contact_name"
              {...register('contact_name', { 
                required: 'First name is required',
                minLength: { value: 2, message: 'First name must be at least 2 characters' }
              })}
              className={errors.contact_name ? 'error' : ''}
            />
            {errors.contact_name && <span className="error-message">{errors.contact_name.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="contact_surname">Surname:</label>
            <input
              type="text"
              id="contact_surname"
              {...register('contact_surname', { 
                required: 'Surname is required',
                minLength: { value: 2, message: 'Surname must be at least 2 characters' }
              })}
              className={errors.contact_surname ? 'error' : ''}
            />
            {errors.contact_surname && <span className="error-message">{errors.contact_surname.message}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="contact_email">Email Address:</label>
          <input
            type="email"
            id="contact_email"
            {...register('contact_email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            className={errors.contact_email ? 'error' : ''}
          />
          {errors.contact_email && <span className="error-message">{errors.contact_email.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="contact_phone">Phone Number:</label>
          <input
            type="tel"
            id="contact_phone"
            {...register('contact_phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9+\-\s()]{10,15}$/,
                message: 'Please enter a valid phone number'
              }
            })}
            className={errors.contact_phone ? 'error' : ''}
          />
          {errors.contact_phone && <span className="error-message">{errors.contact_phone.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="id_number">ID Number:</label>
          <input
            type="text"
            id="id_number"
            maxLength="13"
            placeholder="13-digit SA ID number"
            {...register('id_number', { 
              required: 'ID number is required',
              pattern: {
                value: /^[0-9]{13}$/,
                message: 'Please enter a valid 13-digit South African ID number'
              }
            })}
            className={errors.id_number ? 'error' : ''}
          />
          {errors.id_number && <span className="error-message">{errors.id_number.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="id_document">ID Document:</label>
          <div className="id-upload-container">
            <input
              type="file"
              id="id_document"
              accept="image/*,.pdf"
              capture="environment"
              {...register('id_document', { 
                required: 'ID document is required',
                validate: {
                  fileSize: (files) => {
                    if (files[0] && files[0].size > 5242880) {
                      return 'File size must be less than 5MB';
                    }
                    return true;
                  },
                  fileType: (files) => {
                    if (files[0]) {
                      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                      if (!allowedTypes.includes(files[0].type)) {
                        return 'Only JPG, PNG, and PDF files are allowed';
                      }
                    }
                    return true;
                  }
                }
              })}
              onChange={handleFileChange}
              className={errors.id_document ? 'error' : ''}
            />
            
            {(filePreview || fileName) && (
              <div className="upload-preview">
                {filePreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={filePreview} 
                    alt="ID Preview" 
                    className="preview-image"
                  />
                )}
                {fileName && (
                  <span className="preview-filename">{fileName}</span>
                )}
              </div>
            )}
            
            <p className="upload-note">
              Take a photo or upload a copy of your ID (JPG, PNG, or PDF - Max 5MB)
            </p>
          </div>
          {errors.id_document && <span className="error-message">{errors.id_document.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="delivery_address">Delivery Address:</label>
          <input
            type="text"
            id="delivery_address"
            placeholder="Full street address including suburb and postal code"
            {...register('delivery_address', { 
              required: 'Delivery address is required',
              minLength: { value: 10, message: 'Please provide a complete address' }
            })}
            className={errors.delivery_address ? 'error' : ''}
          />
          {errors.delivery_address && <span className="error-message">{errors.delivery_address.message}</span>}
        </div>
      </div>
      
      <div className="terms-section">
        <label className="checkbox-container">
          <input
            type="checkbox"
            {...register('terms_accepted', { 
              required: 'You must accept the terms of service' 
            })}
            className={errors.terms_accepted ? 'error' : ''}
          />
          <span className="checkmark"></span>
          I agree to the <a href="/terms-of-service" className="link-terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and understand that an account will be created upon approval.
        </label>
        {errors.terms_accepted && <span className="error-message">{errors.terms_accepted.message}</span>}
      </div>
      
      <button
        type="submit"
        className="btn-submit"
        disabled={disabled || loading}
      >
        {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
      </button>
      
      <p className="terms-note">
        Your application will be reviewed for availability before activation. No charges will apply until your service is activated.
      </p>
    </form>
  );
};

export default SignupForm; 