import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  History, 
  User, 
  Calendar,
  RotateCcw,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface VersionHistory {
  id: string;
  version: number;
  title: string;
  content: string;
  changes: string[];
  editedBy: string;
  editedAt: string;
  isCurrent: boolean;
}

const PromptHistoryContent: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<string>('3');

  // Mock version history data
  const versionHistory: VersionHistory[] = [
    {
      id: '3',
      version: 3,
      title: 'Verse Explanation Template',
      content: 'Please explain the following Bible verse in simple, easy-to-understand language. Include the historical context, key themes, and practical application for daily life. Focus on making the message accessible to readers of all backgrounds while maintaining theological accuracy.',
      changes: ['Enhanced accessibility focus', 'Added theological accuracy requirement'],
      editedBy: 'Admin User',
      editedAt: '2024-01-20T14:20:00Z',
      isCurrent: true
    },
    {
      id: '2',
      version: 2,
      title: 'Verse Explanation Template',
      content: 'Please explain the following Bible verse in simple, easy-to-understand language. Include the historical context, key themes, and practical application for daily life.',
      changes: ['Added practical application requirement', 'Improved clarity'],
      editedBy: 'Admin User',
      editedAt: '2024-01-18T11:30:00Z',
      isCurrent: false
    },
    {
      id: '1',
      version: 1,
      title: 'Verse Explanation Template',
      content: 'Please explain the following Bible verse in simple, easy-to-understand language.',
      changes: ['Initial version created'],
      editedBy: 'Admin User',
      editedAt: '2024-01-15T10:30:00Z',
      isCurrent: false
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRestore = (versionId: string) => {
    console.log('Restoring version:', versionId);
    // Add restore logic here
  };

  const handleViewDiff = (versionId: string) => {
    console.log('Viewing diff for version:', versionId);
    // Add diff view logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Version History</h2>
          <p className="text-gray-600 mt-1">Verse Explanation Template - Track changes and restore previous versions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-100 text-green-800">
            Current: v{versionHistory.find(v => v.isCurrent)?.version}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Version List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {versionHistory.map((version) => (
                <div
                  key={version.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedVersion === version.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedVersion(version.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={version.isCurrent ? "default" : "secondary"}>
                        v{version.version}
                      </Badge>
                      {version.isCurrent && (
                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {version.isCurrent ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{version.editedBy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{formatDate(version.editedAt)}</span>
                    </div>
                  </div>
                  {version.changes.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Changes:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {version.changes.map((change, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-amber-500">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Version Details */}
        <div className="lg:col-span-2">
          {(() => {
            const selectedVersionData = versionHistory.find(v => v.id === selectedVersion);
            if (!selectedVersionData) return null;

            return (
              <div className="space-y-6">
                {/* Version Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        Version {selectedVersionData.version}
                        {selectedVersionData.isCurrent && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Current
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {!selectedVersionData.isCurrent && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleViewDiff(selectedVersionData.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Diff
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleRestore(selectedVersionData.id)}>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Restore
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Edited By</p>
                        <p className="text-gray-600">{selectedVersionData.editedBy}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Edited On</p>
                        <p className="text-gray-600">{formatDate(selectedVersionData.editedAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Prompt Content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Prompt Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800">
                        {selectedVersionData.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Changes Made */}
                {selectedVersionData.changes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Changes Made</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedVersionData.changes.map((change, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            <span className="text-sm text-gray-700">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Comparison with Previous Version */}
                {!selectedVersionData.isCurrent && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparison with Previous Version</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          This feature would show a side-by-side comparison with the previous version, 
                          highlighting additions, deletions, and modifications.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export { PromptHistoryContent };
