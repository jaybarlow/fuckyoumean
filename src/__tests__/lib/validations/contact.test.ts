import { contactFormSchema } from '@/lib/validations/contact';

describe('Contact Form Schema Validation', () => {
  it('validates correct data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message with more than 10 characters.',
    };
    
    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
  
  it('rejects invalid name', () => {
    const invalidData = {
      name: 'J', // Too short
      email: 'john@example.com',
      message: 'This is a valid message with more than 10 characters.',
    };
    
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const formattedErrors = result.error.format();
      expect(formattedErrors.name?._errors).toContain('Name must be at least 2 characters.');
    }
  });
  
  it('rejects invalid email', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'not-an-email', // Invalid email format
      message: 'This is a valid message with more than 10 characters.',
    };
    
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const formattedErrors = result.error.format();
      expect(formattedErrors.email?._errors).toContain('Please enter a valid email address.');
    }
  });
  
  it('rejects short message', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Too short', // Less than 10 characters
    };
    
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const formattedErrors = result.error.format();
      expect(formattedErrors.message?._errors).toContain('Message must be at least 10 characters.');
    }
  });
  
  it('rejects long message', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'a'.repeat(501), // More than 500 characters
    };
    
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const formattedErrors = result.error.format();
      expect(formattedErrors.message?._errors).toContain('Message must not be longer than 500 characters.');
    }
  });
}); 