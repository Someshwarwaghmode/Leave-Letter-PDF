import React, { useState, useRef } from 'react';
import axios from 'axios';

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    course: '',
    roomNumber: '',
    hostelName: '',
    leaveStart: '',
    leaveEnd: '',
    reason: '',
    homeAddress: '',
    returnDate: '',
    rollNumber: '',
    contactNumber: '',
  });

  const inputRefs = useRef([]);

  const courseOptions = [
    "BE/Computer Engineering",
    "BE/Artificial Intelligence & Data Science",
    "BE/Mechanical Engineering",
    "BE/Civil Engineering",
    "BE/Electronics & Telecommunication Engineering",
    "BE/Information Technology",
    "MBA/Marketing Management",
    "MBA/Financial Management",
    "MBA/Human Resource Management",
    "MBA/International Business",
    "MBA/Operations & Supply Chain Management",
    "MCA/Master of Computer Applications"
  ];

  const placeholders = {
    fullName: 'Enter your full name',
    roomNumber: 'Enter your hostel room number',
    hostelName: 'Enter your hostel Name',
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

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === 'leaveEnd') {
        updatedData.returnDate = value;
      }
      return updatedData;
    });
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
    <>
      {/* Scrolling Marquee at Top */}
      <div className="w-full bg-black text-white py-2">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-marquee text-center text-lg font-bold">
            Chanakay(Indira) Hostel Parandwaid & All Student like MCA , BE , MBA, Can Get the Leave Form from this site
          </div>
        </div>
      </div>

      {/* Tailwind Animation */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            animation: marquee 10s linear infinite;
          }
        `}
      </style>

      {/* Form */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-teal-400 p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 space-y-6 overflow-y-auto max-h-[90vh] relative pt-0">
          
          {/* Fixed Title */}
          <div className='sticky top-0 z-10 bg-white p-6'>
            <div className="sticky top-0 z-10 bg-white pb-2">
              <h2 className="text-2xl font-bold text-center text-blue-600">Hostel Leave Form</h2>
            </div>
          </div>

          {/* Form Fields */}
          {Object.keys(formData).map((field, index) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>

              {field === 'course' ? (
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="border-b-2 border-teal-400 focus:outline-none focus:border-blue-500 p-2 bg-transparent"
                  ref={(el) => (inputRefs.current[index] = el)}
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
                  className="border-b-2 border-teal-400 focus:outline-none focus:border-blue-500 p-2 bg-transparent"
                  ref={(el) => (inputRefs.current[index] = el)}
                  required
                />
              ) : (
                <input
                  type={field === 'contactNumber' ? 'tel' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={placeholders[field]}
                  className="border-b-2 border-teal-400 focus:outline-none focus:border-blue-500 p-2 bg-transparent"
                  ref={(el) => (inputRefs.current[index] = el)}
                  required
                  readOnly={field === 'returnDate'}
                />
              )}
            </div>
          ))}

          {/* Confirm Checkbox */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4" required />
            <label className="text-sm text-gray-700">Confirm</label>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-full hover:from-blue-600 hover:to-teal-500 transition"
            >
              Get Leave Letter
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LeaveForm;
