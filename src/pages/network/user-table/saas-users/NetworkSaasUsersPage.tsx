import { Fragment } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { NetworkSaasUsersContent } from '.';
import { useLayout } from '@/providers';

const NetworkSaasUsersPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-600">All Members:</span>
                  <span className="text-md text-gray-800 font-semibold me-2">49,053</span>
                  <span className="text-md text-gray-600">Pro Licenses</span>
                  <span className="text-md text-gray-800 font-semibold">1724</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            {/* ToolbarActions - Import CSV button commented out
            <ToolbarActions>
              <button 
                onClick={() => {
                  // Trigger file input click
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.accept = '.csv';
                  fileInput.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      try {
                        const text = await file.text();
                        // Parse CSV and show preview or import
                        console.log('CSV file selected:', file.name);
                        // You can implement actual CSV import logic here
                        alert(`CSV file "${file.name}" selected. Import functionality to be implemented.`);
                      } catch (error) {
                        console.error('Error reading file:', error);
                        alert('Error reading CSV file');
                      }
                    }
                  };
                  fileInput.click();
                }}
                className="btn btn-sm btn-light"
              >
                Import CSV
              </button>
            </ToolbarActions>
            */}
          </Toolbar>
        </Container>
      )}

      <Container>
        <NetworkSaasUsersContent />
      </Container>
    </Fragment>
  );
};

export { NetworkSaasUsersPage };
