import React from 'react';

interface ODKForm {
  id: string;  title: string;
  lastSubmission?: Date;
  status: 'active' | 'draft' | 'closed';
  formUrl?: string;
}

interface ODKProject {
  id: string;
  name: string;
  forms: ODKForm[];
}

// Export mock projects so they can be accessed by other components
export const mockProjects: ODKProject[] = [
  {
    id: '1',
    name: 'Agriculture Survey 2025',
    forms: [
      {        id: 'form1',
        title: 'Field Assessment',
        status: 'active',
        formUrl: 'https://enketo.ona.io/x/yQgZ6JLC'
      }
    ]
  }
];

const ODKInterface: React.FC = () => {
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
    <div className="space-y-4">
      {mockProjects.flatMap(project => 
        project.forms.map(form => (
          <div key={form.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{form.title}</h4>              <div className="flex items-center gap-2 text-sm text-gray-500">
                {form.lastSubmission && (
                  <span>Last submission: {form.lastSubmission.toLocaleDateString()}</span>
                )}
              </div>
              {form.formUrl && (
                <a
                  href={form.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2c5530] hover:underline text-sm mt-1 inline-block"
                >
                  Open Form
                </a>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
              {form.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default ODKInterface;
