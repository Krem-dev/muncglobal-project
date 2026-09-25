import express from 'express';
import { runQuery, getQuery, getAllQuery } from '../config/database.js';
import { sendRegistrationEmail, sendPaymentConfirmationEmail } from '../utils/helpers.js';

const router = express.Router();

/**
 * @route   POST /api/registration
 * @desc    Register a new delegate
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      surname,
      dateOfBirth,
      gender,
      phoneNumber,
      postalAddress,
      email,
      institution,
      programOfStudy,
      educationalLevel,
      nationality,
      city,
      committeePreference,
      emergencyContact,
      emergencyPhone,
      emergencyRelationship,
      specialNeeds,
      specialNeedsDetails,
      previousExperience,
      howHeard,
      howHeardOther,
      registrationCode
    } = req.body;

    // Validate required fields
    if (!firstName || !surname || !dateOfBirth || !gender || !phoneNumber || 
        !email || !institution || !educationalLevel || !nationality || !city || 
        !emergencyContact || !emergencyPhone || !emergencyRelationship || 
        !previousExperience || !howHeard || !registrationCode) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please provide all required fields' 
      });
    }

    // Check if registration code already exists
    const existingRegistration = await getQuery(
      'SELECT id FROM registrations WHERE registration_code = ?',
      [registrationCode]
    );

    if (existingRegistration) {
      return res.status(400).json({
        status: 'error',
        message: 'Registration code already exists'
      });
    }

    // Insert registration into database with pending payment status
    const registration = await runQuery(
      `INSERT INTO registrations (
        registration_code, first_name, middle_name, surname, date_of_birth, 
        gender, phone_number, postal_address, email, institution, 
        program_of_study, educational_level, nationality, city, committee_preference,
        emergency_contact_name, emergency_contact_number, emergency_contact_relationship, 
        special_needs, special_needs_details, previous_mun_experience, how_heard, how_heard_other,
        payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registrationCode, firstName, middleName || null, surname, dateOfBirth, 
        gender, phoneNumber, postalAddress || null, email, institution, 
        programOfStudy || null, educationalLevel, nationality, city, committeePreference,
        emergencyContact, emergencyPhone, emergencyRelationship, 
        specialNeeds, specialNeedsDetails || null, previousExperience, 
        howHeard, howHeard === 'Other' ? howHeardOther : null,
        'pending' // Set payment status to pending initially
      ]
    );

    // Send registration confirmation email (but note that registration is not complete until payment)
    await sendRegistrationEmail({
      email,
      name: `${firstName} ${surname}`,
      registrationCode
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        registrationCode,
        registrationId: registration.id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/registration/:registrationCode
 * @desc    Get registration details by registration code
 * @access  Public
 */
router.get('/:registrationCode', async (req, res) => {
  try {
    const { registrationCode } = req.params;
    
    // Get registration details
    const registration = await getQuery(
      `SELECT 
        r.*, 
        p.status as payment_status, 
        p.amount as payment_amount,
        p.payment_method,
        p.payment_date
      FROM registrations r
      LEFT JOIN payments p ON r.id = p.registration_id
      WHERE r.registration_code = ?`,
      [registrationCode]
    );
    
    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found'
      });
    }
    
    // Remove sensitive fields
    delete registration.id;
    
    res.status(200).json({
      status: 'success',
      data: registration
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching registration details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/registration/email/:email
 * @desc    Check if email already exists
 * @access  Public
 */
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Check if email exists
    const registration = await getQuery(
      'SELECT id FROM registrations WHERE email = ?',
      [email]
    );
    
    res.status(200).json({
      status: 'success',
      exists: registration ? true : false
    });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while checking email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/registration
 * @desc    Get all registrations
 * @access  Private (Admin only)
 */
router.get('/', async (req, res) => {
  try {
    // In a real application, this would be protected by authentication middleware
    // For now, we'll just include a simple API key check
    const apiKey = req.headers['x-api-key'];
    
    const expectedApiKey = process.env.ADMIN_API_KEY || 'muncglobal';
    
    console.log('Server received API key:', JSON.stringify(apiKey));
    console.log('Expected API key:', JSON.stringify(expectedApiKey));
    console.log('API key trimmed:', JSON.stringify(apiKey?.trim()));
    console.log('API key no spaces:', JSON.stringify(apiKey?.replace(/\s/g, '')));
    console.log('Keys match (original):', apiKey === expectedApiKey);
    console.log('Keys match (trimmed):', apiKey?.trim() === expectedApiKey);
    console.log('Keys match (no spaces):', apiKey?.replace(/\s/g, '') === expectedApiKey);
    
    if (!apiKey || apiKey.replace(/\s/g, '') !== expectedApiKey) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - Invalid API key'
      });
    }
    
    // Get all registrations with payment information
    const registrations = await getAllQuery(
      `SELECT 
        r.id, r.registration_code, r.first_name, r.surname, r.email, r.phone_number,
        r.institution, r.nationality, r.created_at, r.payment_status, r.payment_reference,
        p.transaction_id, p.amount, p.payment_date, p.payment_method
      FROM registrations r
      LEFT JOIN payments p ON r.id = p.registration_id
      ORDER BY r.created_at DESC`
    );
    
    // Calculate financial totals
    const registrationFee = parseFloat(process.env.REGISTRATION_FEE) || 970;
    const totalExpected = registrations.length * registrationFee;
    const totalPaid = registrations
      .filter(reg => reg.payment_status === 'paid')
      .reduce((sum, reg) => sum + (reg.amount || registrationFee), 0);
    const totalPending = totalExpected - totalPaid;
    
    res.status(200).json({
      status: 'success',
      results: registrations.length,
      data: registrations,
      financials: {
        registrationFee: registrationFee,
        totalRegistrations: registrations.length,
        totalExpected: totalExpected,
        totalPaid: totalPaid,
        totalPending: totalPending,
        paidCount: registrations.filter(reg => reg.payment_status === 'paid').length,
        pendingCount: registrations.filter(reg => reg.payment_status === 'pending').length
      }
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching registrations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Duplicate route removed - using the earlier implementation at line ~162

/**
 * @route   GET /api/registration/code/:registrationCode
 * @desc    Get registration data by registration code
 * @access  Public
 */
router.get('/code/:registrationCode', async (req, res) => {
  try {
    const { registrationCode } = req.params;
    
    if (!registrationCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Registration code is required'
      });
    }
    
    // Get registration by code
    const registration = await getQuery(
      'SELECT * FROM registrations WHERE registration_code = ?',
      [registrationCode]
    );
    
    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Registration found',
      data: registration
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/registration/complete
 * @desc    Complete registration after payment verification
 * @access  Public
 */
router.post('/complete', async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      surname,
      dateOfBirth,
      gender,
      phoneNumber,
      postalAddress,
      email,
      institution,
      programOfStudy,
      educationalLevel,
      nationality,
      city,
      committeePreference,
      emergencyContact,
      emergencyPhone,
      emergencyRelationship,
      specialNeeds,
      specialNeedsDetails,
      previousExperience,
      howHeard,
      howHeardOther,
      registrationCode,
      paymentReference,
      paymentVerified
    } = req.body;

    console.log('Registration completion request for:', registrationCode);

    // Validate required fields
    if (!firstName || !surname || !dateOfBirth || !gender || !phoneNumber || 
        !email || !institution || !educationalLevel || !nationality || !city || 
        !emergencyContact || !emergencyPhone || !emergencyRelationship || 
        !previousExperience || !howHeard || !registrationCode || !paymentReference || !paymentVerified) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please provide all required fields including payment verification' 
      });
    }

    // Check if registration code already exists
    const existingRegistration = await getQuery(
      'SELECT id FROM registrations WHERE registration_code = ?',
      [registrationCode]
    );

    if (existingRegistration) {
      return res.status(400).json({
        status: 'error',
        message: 'Registration already completed for this code'
      });
    }

    // Insert registration into database with paid status
    const registration = await runQuery(
      `INSERT INTO registrations (
        registration_code, first_name, middle_name, surname, date_of_birth, 
        gender, phone_number, postal_address, email, institution, 
        program_of_study, educational_level, nationality, city, committee_preference,
        emergency_contact_name, emergency_contact_number, emergency_contact_relationship, 
        special_needs, special_needs_details, previous_mun_experience, how_heard, how_heard_other,
        payment_status, payment_reference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registrationCode, firstName, middleName || null, surname, dateOfBirth, 
        gender, phoneNumber, postalAddress, email, institution, 
        programOfStudy, educationalLevel, nationality, city, committeePreference,
        emergencyContact, emergencyPhone, emergencyRelationship, 
        specialNeeds, specialNeedsDetails || null, previousExperience, 
        howHeard, howHeard === 'Other' ? howHeardOther : null,
        'paid', // Set payment status to paid since payment is verified
        paymentReference
      ]
    );

    console.log('Registration completed successfully for:', registrationCode);

    // Respond immediately to avoid frontend waiting on SMTP
    res.status(201).json({
      status: 'success',
      message: 'Registration completed successfully',
      data: {
        registrationCode,
        registrationId: registration.lastID || registration.insertId,
        paymentStatus: 'paid'
      }
    });

    // Send emails asynchronously (do not block response)
    setImmediate(async () => {
      try {
        await sendRegistrationEmail({
          email,
          name: `${firstName} ${surname}`,
          registrationCode
        });
        console.log('Registration completion email sent to:', email);

        await sendPaymentConfirmationEmail({
          first_name: firstName,
          surname,
          email,
          registration_code: registrationCode
        });
        console.log('Payment confirmation email sent to:', email);
      } catch (emailError) {
        console.error('Failed to send emails (async):', emailError);
        // Intentionally not throwing: response already sent
      }
    });
  } catch (error) {
    console.error('Registration completion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while completing registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/registration/export/excel
 * @desc    Export all registrations as Excel (.xlsx)
 * @access  Private (Admin only)
 */
router.get('/export/excel', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const expectedApiKey = process.env.ADMIN_API_KEY || 'muncglobal';

    if (!apiKey || apiKey.replace(/\s/g, '') !== expectedApiKey) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - Invalid API key'
      });
    }

    const XLSX = await import('xlsx');

    const registrations = await getAllQuery(
      `SELECT
        registration_code,
        first_name,
        middle_name,
        surname,
        date_of_birth,
        gender,
        phone_number,
        postal_address,
        email,
        institution,
        program_of_study,
        educational_level,
        nationality,
        city,
        committee_preference,
        emergency_contact_name,
        emergency_contact_number,
        emergency_contact_relationship,
        special_needs,
        special_needs_details,
        previous_mun_experience,
        how_heard,
        how_heard_other,
        payment_status,
        payment_reference,
        created_at
      FROM registrations
      ORDER BY created_at DESC`
    );

    const rows = registrations.map(reg => ({
      'Registration Code': reg.registration_code || '',
      'First Name': reg.first_name || '',
      'Middle Name': reg.middle_name || '',
      'Surname': reg.surname || '',
      'Date of Birth': reg.date_of_birth || '',
      'Gender': reg.gender || '',
      'Phone Number': reg.phone_number || '',
      'Postal Address': reg.postal_address || '',
      'Email': reg.email || '',
      'Institution': reg.institution || '',
      'Program of Study': reg.program_of_study || '',
      'Educational Level': reg.educational_level || '',
      'Nationality': reg.nationality || '',
      'City': reg.city || '',
      'Committee Preference': reg.committee_preference || '',
      'Emergency Contact Name': reg.emergency_contact_name || '',
      'Emergency Contact Number': reg.emergency_contact_number || '',
      'Emergency Contact Relationship': reg.emergency_contact_relationship || '',
      'Special Needs': reg.special_needs || '',
      'Special Needs Details': reg.special_needs_details || '',
      'Previous MUN Experience': reg.previous_mun_experience || '',
      'How Heard': reg.how_heard || '',
      'How Heard Other': reg.how_heard_other || '',
      'Payment Status': reg.payment_status || '',
      'Payment Reference': reg.payment_reference || '',
      'Registration Date': reg.created_at || ''
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const timestamp = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="MUNC-Registrations-${timestamp}.xlsx"`);
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during export',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/registration/export/json
 * @desc    Export all registrations as JSON
 * @access  Private (Admin only)
 */
router.get('/export/json', async (req, res) => {
  try {
    // API key authentication
    const apiKey = req.headers['x-api-key'];
    const expectedApiKey = process.env.ADMIN_API_KEY || 'muncglobal';
    
    if (!apiKey || apiKey.replace(/\s/g, '') !== expectedApiKey) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - Invalid API key'
      });
    }

    // Get all registrations
    const registrations = await getAllQuery(
      `SELECT 
        registration_code,
        first_name,
        middle_name,
        surname,
        date_of_birth,
        gender,
        phone_number,
        postal_address,
        email,
        institution,
        program_of_study,
        educational_level,
        nationality,
        city,
        committee_preference,
        emergency_contact_name,
        emergency_contact_number,
        emergency_contact_relationship,
        special_needs,
        special_needs_details,
        previous_mun_experience,
        how_heard,
        how_heard_other,
        payment_status,
        payment_reference,
        created_at
      FROM registrations 
      ORDER BY created_at DESC`
    );

    // Set headers for file download
    const timestamp = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="munc-registrations-${timestamp}.json"`);
    
    res.status(200).json({
      status: 'success',
      exportDate: new Date().toISOString(),
      totalRecords: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during export',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
