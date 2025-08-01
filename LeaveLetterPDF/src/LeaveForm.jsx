import React, { useState } from 'react';
import axios from 'axios';
import './LeaveForm.css';

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    course: '',
    roomNumber: '',
    hostelAddress: '',
    leaveStart: '',
    leaveEnd: '',
    reason: '',
    homeAddress: '',
    returnDate: '',
    rollNumber: '',
    contactNumber: '',
  });

  const courseOptions = [
    'B.Tech CSE',
    'B.Tech ECE',
    'B.Tech IT',
    'B.Tech ME',
    'B.Tech Civil',
    'B.Tech AI-ML'
  ];

  const placeholders = {
    fullName: 'Enter your full name',
    roomNumber: 'Enter your hostel room number',
    hostelAddress: 'Enter your hostel Name',
    leaveStart: 'Select leave start date',
    leaveEnd: 'Select leave end date',
    reason: 'Reason for leave',
    homeAddress: 'Enter your home address',
    returnDate: 'Auto-filled from Leave End',
    rollNumber: 'Enter your roll number',
    contactNumber: 'Enter your contact number',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-fill returnDate when leaveEnd changes
    if (name === 'leaveEnd') {
      setFormData({ ...formData, leaveEnd: value, returnDate: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/generate-leave-letter',
        formData,
        { responseType: 'blob' }
        );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Hostel_Leave_Letter.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to generate PDF');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="scroll-wrapper">
          {Object.keys(formData).map((field) => (
            <div key={field} className="form-group">
              <label>
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>

              {/* Course dropdown */}
              {field === 'course' ? (
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your course</option>
                  {courseOptions.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              ) :
              /* Date pickers */
              field === 'leaveStart' || field === 'leaveEnd' ? (
                <input
                  type="date"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              ) : (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={placeholders[field]}
                  required
                  readOnly={field === 'returnDate'} // Make returnDate read-only
                />
              )}
            </div>
          ))}
          <button type="submit">Get Leave Letter</button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
