import React, { useState, useRef } from 'react';
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

  const fieldKeys = Object.keys(formData);
  const inputRefs = useRef([]);

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

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === 'leaveEnd') {
      setFormData({ ...formData, leaveEnd: value, returnDate: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (
      value.length >= 4 &&
      index < inputRefs.current.length - 1 &&
      name !== 'returnDate'
    ) {
      inputRefs.current[index + 1]?.focus();
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

  const groupedFields = [];
  for (let i = 0; i < fieldKeys.length; i += 3) {
    groupedFields.push(fieldKeys.slice(i, i + 3));
  }

  const formItems = groupedFields.map((group, groupIndex) => (
    <div key={groupIndex} className="px-4 py-6">
      <div className="flex flex-col gap-6">
        {group.map((field, index) => {
          const inputIndex = groupIndex * 3 + index;
          return (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>

              {field === 'course' ? (
                <select
                  name="course"
                  value={formData.course}
                  onChange={(e) => handleChange(e, inputIndex)}
                  className="border-b-2 border-teal-400 focus:outline-none focus:border-blue-500 p-2 bg-transparent"
                  ref={(el) => (inputRefs.current[inputIndex] = el)}
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
                  onChange={(e) => handleChange(e, inputIndex)}
                  className="border-b-2 border-teal-400 focus:outline-none focus:border-blue-500 p-2 bg-transparent"
                  ref={(el) => (inputRefs.current[inputIndex] = el)}
                  required
                />
              ) : (
                <input
                  type={field === 'contactNumber' ? 'tel' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={(e) => handleChange(e, inputIndex)}
                  placeholder={placeholders[field]}
                  className="border-b-2 border-teal-400 focus:outline-none focus:border-blue-500 p-2 bg-transparent"
                  ref={(el) => (inputRefs.current[inputIndex] = el)}
                  required
                  readOnly={field === 'returnDate'}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  ));

  return (
    <>
      {/* Scrolling Marquee at Top */}
      <div className="w-full bg-black text-white py-2">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-marquee text-center text-lg font-bold">
            Chanakay(Indira) Hostel Parandwaid & All Student like MCA , BE , MBA, Can Get the Leave Form from this side
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

      {/* Existing Form */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-teal-400 p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600">Hostel Leave Form</h2>

          <AliceCarousel
            mouseTracking
            items={formItems}
            disableDotsControls={false}
            disableButtonsControls={false}
            responsive={{
              0: { items: 1 },
              768: { items: 1 },
              1024: { items: 1 },
            }}
          />

          <div className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4" required />
            <label className="text-sm text-gray-700">Conform </label>
          </div>

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
