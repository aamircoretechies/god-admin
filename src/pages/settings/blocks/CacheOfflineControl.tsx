import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Download, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

const CacheOfflineControl = () => {
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  const handleClearCache = () => {
    setIsClearingCache(true);
    // Simulate cache clearing
    setTimeout(() => {
      setIsClearingCache(false);
      // Show success message
    }, 2000);
  };

  const handlePreloadTranslations = () => {
    setIsPreloading(true);
    // Simulate preloading
    setTimeout(() => {
      setIsPreloading(false);
      // Show success message
    }, 3000);
  };

  return (
    <Card id="cache_offline_control">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Cache & Offline Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phase 1 Cache & Offline Control - Simple confirmation dialogs */}
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Cache Management</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Manage system cache and offline content. These actions may take a few moments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Cache Management</h4>
              <Button 
                onClick={handleClearCache}
                disabled={isClearingCache}
                className="w-full justify-start"
                variant="outline"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isClearingCache ? 'Clearing Cache...' : 'Clear Cache'}
              </Button>
              <p className="text-xs text-gray-500">
                Remove all cached data to free up space and resolve issues
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Offline Content</h4>
              <Button 
                onClick={handlePreloadTranslations}
                disabled={isPreloading}
                className="w-full justify-start"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                {isPreloading ? 'Preloading...' : 'Preload Translations'}
              </Button>
              <p className="text-xs text-gray-500">
                Download translations for offline access
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { CacheOfflineControl };

