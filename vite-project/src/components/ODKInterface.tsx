import React, { useState } from 'react';

interface ODKForm {
  id: string;
  title: string;
  lastSubmission?: Date;
  totalSubmissions: number;
  status: 'active' | 'draft' | 'closed';
}

interface ODKProject {
  id: string;
  name: string;
  forms: ODKForm[];
}

const ODKInterface: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  
  const mockProjects: ODKProject[] = [
    {
      id: '1',
      name: 'Crop Survey 2025',
      forms: [
        {
          id: 'form1',
          title: 'Field Assessment',
          lastSubmission: new Date('2025-05-23'),
          totalSubmissions: 145,
          status: 'active'
        },
        {
          id: 'form2',
          title: 'Soil Sample Collection',
          lastSubmission: new Date('2025-05-22'),
          totalSubmissions: 89,
          status: 'active'
        }
      ]
    },
    {
      id: '2',
      name: 'Livestock Monitoring',
      forms: [
        {
          id: 'form3',
          title: 'Health Check',
          lastSubmission: new Date('2025-05-24'),
          totalSubmissions: 67,
          status: 'active'
        }
      ]
    }
  ];

  const getStatusColor = (status: ODKForm['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">ODK Integration</h2>
        <button className="bg-[#2c5530] text-white px-4 py-2 rounded-md hover:bg-[#234225] transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          New Form
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map(project => (
          <div 
            key={project.id}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedProject(project.id === selectedProject ? null : project.id)}
          >
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-500">{project.forms.length} forms</p>
            </div>

            {selectedProject === project.id && (
              <div className="space-y-3 mt-4 border-t pt-4">
                {project.forms.map(form => (
                  <div key={form.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{form.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{form.totalSubmissions} submissions</span>
                        {form.lastSubmission && (
                          <span>• Last: {form.lastSubmission.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                      {form.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">ODK Integration Guide</h3>
        <div className="space-y-3">
          <p className="text-gray-600">To connect your ODK forms:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Configure your ODK Aggregate or Ona server</li>
            <li>Set up authentication credentials</li>
            <li>Create or import forms using the New Form button</li>
            <li>Monitor submissions and data collection progress</li>
          </ol>
          <div className="mt-4 flex gap-4">
            <a 
              href="https://docs.getodk.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2c5530] hover:underline text-sm flex items-center gap-1"
            >
              ODK Documentation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
            <a 
              href="https://ona.io/home/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2c5530] hover:underline text-sm flex items-center gap-1"
            >
              Ona API Reference
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ODKInterface;
