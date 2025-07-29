import React, { useState, useEffect } from 'react';
import { Building, MapPin, Globe, Users, Mail, Phone, Camera, Edit, Save, X, Plus, Trash2 } from 'lucide-react';

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    basic: {
      name: 'TechCorp Solutions',
      logo: '/api/placeholder/120/120',
      tagline: 'Innovation through Technology',
      description: 'We are a leading technology company focused on creating innovative solutions that transform businesses and improve lives. Our team of experts works tirelessly to deliver cutting-edge products and services.',
      industry: 'Technology',
      companySize: '100-500 employees',
      founded: '2015',
      website: 'https://techcorp.com',
      headquarters: 'San Francisco, CA'
    },
    contact: {
      email: 'contact@techcorp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, San Francisco, CA 94105',
      socialMedia: {
        linkedin: 'https://linkedin.com/company/techcorp',
        twitter: 'https://twitter.com/techcorp',
        facebook: 'https://facebook.com/techcorp'
      }
    },
    culture: {
      mission: 'To empower businesses through innovative technology solutions.',
      vision: 'To be the leading technology partner for businesses worldwide.',
      values: ['Innovation', 'Integrity', 'Collaboration', 'Excellence'],
      benefits: [
        'Health, Dental & Vision Insurance',
        'Flexible Work Hours',
        'Remote Work Options',
        'Professional Development Budget',
        'Unlimited PTO',
        'Stock Options',
        'Gym Membership',
        'Free Meals'
      ]
    },
    team: [
      {
        id: 1,
        name: 'John Smith',
        position: 'CEO & Founder',
        image: '/api/placeholder/80/80',
        bio: 'Experienced technology leader with 15+ years in the industry.'
      },
      {
        id: 2,
        name: 'Jane Doe',
        position: 'CTO',
        image: '/api/placeholder/80/80',
        bio: 'Technical visionary driving our product development and innovation.'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        position: 'Head of HR',
        image: '/api/placeholder/80/80',
        bio: 'People-focused leader building our amazing company culture.'
      }
    ]
  });

  const [editData, setEditData] = useState(companyData);

  const handleSave = () => {
    setCompanyData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(companyData);
    setIsEditing(false);
  };

  const handleAddValue = () => {
    setEditData({
      ...editData,
      culture: {
        ...editData.culture,
        values: [...editData.culture.values, '']
      }
    });
  };

  const handleRemoveValue = (index) => {
    setEditData({
      ...editData,
      culture: {
        ...editData.culture,
        values: editData.culture.values.filter((_, i) => i !== index)
      }
    });
  };

  const handleAddBenefit = () => {
    setEditData({
      ...editData,
      culture: {
        ...editData.culture,
        benefits: [...editData.culture.benefits, '']
      }
    });
  };

  const handleRemoveBenefit = (index) => {
    setEditData({
      ...editData,
      culture: {
        ...editData.culture,
        benefits: editData.culture.benefits.filter((_, i) => i !== index)
      }
    });
  };

  const BasicInfoTab = () => (
    <div className="space-y-6">
      {/* Company Logo and Basic Info */}
      <div className="flex items-start space-x-6">
        <div className="relative">
          <img
            src={isEditing ? editData.basic.logo : companyData.basic.logo}
            alt="Company Logo"
            className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
          />
          {isEditing && (
            <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg text-white hover:bg-opacity-70 transition-colors">
              <Camera className="w-6 h-6" />
            </button>
          )}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editData.basic.name}
                onChange={(e) => setEditData({
                  ...editData,
                  basic: { ...editData.basic, name: e.target.value }
                })}
                className="text-2xl font-bold bg-transparent border-b-2 border-green-500 focus:outline-none dark:text-white"
              />
              <input
                type="text"
                value={editData.basic.tagline}
                onChange={(e) => setEditData({
                  ...editData,
                  basic: { ...editData.basic, tagline: e.target.value }
                })}
                className="text-lg text-gray-600 dark:text-gray-300 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500"
                placeholder="Company tagline"
              />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{companyData.basic.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{companyData.basic.tagline}</p>
            </div>
          )}
        </div>
      </div>

      {/* Company Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About Us</h3>
        {isEditing ? (
          <textarea
            value={editData.basic.description}
            onChange={(e) => setEditData({
              ...editData,
              basic: { ...editData.basic, description: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows="4"
          />
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{companyData.basic.description}</p>
        )}
      </div>

      {/* Company Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.basic.industry}
                onChange={(e) => setEditData({
                  ...editData,
                  basic: { ...editData.basic, industry: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{companyData.basic.industry}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Size</label>
            {isEditing ? (
              <select
                value={editData.basic.companySize}
                onChange={(e) => setEditData({
                  ...editData,
                  basic: { ...editData.basic, companySize: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="1-10 employees">1-10 employees</option>
                <option value="11-50 employees">11-50 employees</option>
                <option value="51-100 employees">51-100 employees</option>
                <option value="100-500 employees">100-500 employees</option>
                <option value="500+ employees">500+ employees</option>
              </select>
            ) : (
              <p className="text-gray-900 dark:text-white">{companyData.basic.companySize}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Founded</label>
            {isEditing ? (
              <input
                type="number"
                value={editData.basic.founded}
                onChange={(e) => setEditData({
                  ...editData,
                  basic: { ...editData.basic, founded: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{companyData.basic.founded}</p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
            {isEditing ? (
              <input
                type="url"
                value={editData.basic.website}
                onChange={(e) => setEditData({
                  ...editData,
                  basic: { ...editData.basic, website: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <a href={companyData.basic.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 dark:text-green-400">
                {companyData.basic.website}
              </a>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headquarters</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.basic.headquarters}
                onChange={(e) => setEditData({
                  ...editData,
                  basic: { ...editData.basic, headquarters: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{companyData.basic.headquarters}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ContactTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          {isEditing ? (
            <input
              type="email"
              value={editData.contact.email}
              onChange={(e) => setEditData({
                ...editData,
                contact: { ...editData.contact, email: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          ) : (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-900 dark:text-white">{companyData.contact.email}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
          {isEditing ? (
            <input
              type="tel"
              value={editData.contact.phone}
              onChange={(e) => setEditData({
                ...editData,
                contact: { ...editData.contact, phone: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          ) : (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-900 dark:text-white">{companyData.contact.phone}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
        {isEditing ? (
          <textarea
            value={editData.contact.address}
            onChange={(e) => setEditData({
              ...editData,
              contact: { ...editData.contact, address: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows="2"
          />
        ) : (
          <div className="flex items-start">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-1" />
            <span className="text-gray-900 dark:text-white">{companyData.contact.address}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Social Media</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
            {isEditing ? (
              <input
                type="url"
                value={editData.contact.socialMedia.linkedin}
                onChange={(e) => setEditData({
                  ...editData,
                  contact: {
                    ...editData.contact,
                    socialMedia: { ...editData.contact.socialMedia, linkedin: e.target.value }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <a href={companyData.contact.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 dark:text-green-400">
                {companyData.contact.socialMedia.linkedin}
              </a>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter</label>
            {isEditing ? (
              <input
                type="url"
                value={editData.contact.socialMedia.twitter}
                onChange={(e) => setEditData({
                  ...editData,
                  contact: {
                    ...editData.contact,
                    socialMedia: { ...editData.contact.socialMedia, twitter: e.target.value }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <a href={companyData.contact.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 dark:text-green-400">
                {companyData.contact.socialMedia.twitter}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const CultureTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Mission</h3>
        {isEditing ? (
          <textarea
            value={editData.culture.mission}
            onChange={(e) => setEditData({
              ...editData,
              culture: { ...editData.culture, mission: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows="2"
          />
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{companyData.culture.mission}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Vision</h3>
        {isEditing ? (
          <textarea
            value={editData.culture.vision}
            onChange={(e) => setEditData({
              ...editData,
              culture: { ...editData.culture, vision: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows="2"
          />
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{companyData.culture.vision}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Core Values</h3>
          {isEditing && (
            <button
              onClick={handleAddValue}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Value
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(isEditing ? editData.culture.values : companyData.culture.values).map((value, index) => (
            <div key={index} className="flex items-center">
              {isEditing ? (
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      const newValues = [...editData.culture.values];
                      newValues[index] = e.target.value;
                      setEditData({
                        ...editData,
                        culture: { ...editData.culture, values: newValues }
                      });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => handleRemoveValue(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                  {value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Benefits & Perks</h3>
          {isEditing && (
            <button
              onClick={handleAddBenefit}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Benefit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(isEditing ? editData.culture.benefits : companyData.culture.benefits).map((benefit, index) => (
            <div key={index} className="flex items-center">
              {isEditing ? (
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => {
                      const newBenefits = [...editData.culture.benefits];
                      newBenefits[index] = e.target.value;
                      setEditData({
                        ...editData,
                        culture: { ...editData.culture, benefits: newBenefits }
                      });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => handleRemoveBenefit(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  {benefit}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TeamTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leadership Team</h3>
        {isEditing && (
          <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4 mr-1" />
            Add Member
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companyData.team.map((member) => (
          <div key={member.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
            <img
              src={member.image}
              alt={member.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <h4 className="font-semibold text-gray-900 dark:text-white">{member.name}</h4>
            <p className="text-green-600 dark:text-green-400 text-sm mb-2">{member.position}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Building className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile</h2>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'basic'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'contact'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => setActiveTab('culture')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'culture'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Culture
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'team'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Team
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {activeTab === 'basic' && <BasicInfoTab />}
        {activeTab === 'contact' && <ContactTab />}
        {activeTab === 'culture' && <CultureTab />}
        {activeTab === 'team' && <TeamTab />}
      </div>
    </div>
  );
};

export default CompanyProfile;
