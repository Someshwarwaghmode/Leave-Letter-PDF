import React, { useState } from 'react';
import axios from 'axios';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

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
    'B.Tech AI-ML',
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

  const formItems = Object.keys(formData).map((field) => (
    <div key={field} className="px-4 py-6">
      <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md">
        <label className="text-gray-700 font-semibold">
          {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
        </label>

        {/* Course dropdown */}
        {field === 'course' ? (
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select your course</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        ) : field === 'leaveStart' || field === 'leaveEnd' ? (
          <input
            type="date"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        ) : (
          <input
            type={field === 'contactNumber' ? 'tel' : 'text'}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={placeholders[field]}
            className="border p-2 rounded"
            required
            readOnly={field === 'returnDate'}
          />
        )}
      </div>
    </div>
  ));

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AliceCarousel
          mouseTracking
          items={formItems}
          disableDotsControls={false}
          disableButtonsControls={false}
          responsive={{
            0: { items: 1 },
            768: { items: 2 },
            1024: { items: 3 },
          }}
        />

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
          >
            Get Leave Letter
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
