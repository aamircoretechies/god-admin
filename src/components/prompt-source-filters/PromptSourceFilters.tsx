import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  X,
  Plus,
  Save,
  Loader2,
  Shield,
  ShieldOff,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchSourceFilters,
  fetchSourceOptions,
  upsertSourceFilter,
  deleteSourceFilter,
  type SourceFilter,
  type SourceOption
} from '@/services/promptsApi';

interface PromptSourceFiltersProps {
  templateId: string;
  readOnly?: boolean;
}

const PromptSourceFilters: React.FC<PromptSourceFiltersProps> = ({
  templateId,
  readOnly = false
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sourceOptions, setSourceOptions] = useState<SourceOption[]>([]);
  const [whitelist, setWhitelist] = useState<SourceFilter | null>(null);
  const [blacklist, setBlacklist] = useState<SourceFilter | null>(null);
  
  // Whitelist state
  const [whitelistSources, setWhitelistSources] = useState<string[]>([]);
  const [whitelistCustomSources, setWhitelistCustomSources] = useState<string[]>([]);
  const [whitelistNotes, setWhitelistNotes] = useState('');
  const [newWhitelistCustomSource, setNewWhitelistCustomSource] = useState('');
  
  // Blacklist state
  const [blacklistSources, setBlacklistSources] = useState<string[]>([]);
  const [blacklistCustomSources, setBlacklistCustomSources] = useState<string[]>([]);
  const [blacklistNotes, setBlacklistNotes] = useState('');
  const [newBlacklistCustomSource, setNewBlacklistCustomSource] = useState('');
  
  // Selected values for dropdowns (to reset after selection)
  const [selectedWhitelistSource, setSelectedWhitelistSource] = useState<string>('');
  const [selectedBlacklistSource, setSelectedBlacklistSource] = useState<string>('');

  // Load source filters and options
  useEffect(() => {
    const loadData = async () => {
      if (!templateId) return;
      
      try {
        setLoading(true);
        const [filtersResponse, optionsResponse] = await Promise.all([
          fetchSourceFilters(templateId),
          fetchSourceOptions()
        ]);

        if (filtersResponse.status === 1 && filtersResponse.data) {
          if (filtersResponse.data.whitelist) {
            setWhitelist(filtersResponse.data.whitelist);
            setWhitelistSources(filtersResponse.data.whitelist.sources || []);
            setWhitelistCustomSources(filtersResponse.data.whitelist.custom_sources || []);
            setWhitelistNotes(filtersResponse.data.whitelist.notes || '');
          }
          if (filtersResponse.data.blacklist) {
            setBlacklist(filtersResponse.data.blacklist);
            setBlacklistSources(filtersResponse.data.blacklist.sources || []);
            setBlacklistCustomSources(filtersResponse.data.blacklist.custom_sources || []);
            setBlacklistNotes(filtersResponse.data.blacklist.notes || '');
          }
        }

        if (optionsResponse.status === 1 && optionsResponse.data) {
          setSourceOptions(optionsResponse.data);
        }
      } catch (error: any) {
        console.error('Error loading source filters:', error);
        toast.error('Failed to load source filters');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [templateId]);

  const handleSaveFilter = async (filterType: 'whitelist' | 'blacklist') => {
    if (!templateId) return;

    try {
      setSaving(true);
      const sources = filterType === 'whitelist' ? whitelistSources : blacklistSources;
      const customSources = filterType === 'whitelist' ? whitelistCustomSources : blacklistCustomSources;
      const notes = filterType === 'whitelist' ? whitelistNotes : blacklistNotes;

      if (sources.length === 0 && customSources.length === 0) {
        toast.error('Please add at least one source');
        return;
      }

      const response = await upsertSourceFilter(templateId, {
        filter_type: filterType,
        sources,
        custom_sources: customSources,
        notes: notes || undefined
      });

      if (response.status === 1) {
        toast.success(`${filterType === 'whitelist' ? 'Whitelist' : 'Blacklist'} saved successfully`);
        // Reload filters
        const filtersResponse = await fetchSourceFilters(templateId);
        if (filtersResponse.status === 1 && filtersResponse.data) {
          if (filterType === 'whitelist' && filtersResponse.data.whitelist) {
            setWhitelist(filtersResponse.data.whitelist);
          } else if (filterType === 'blacklist' && filtersResponse.data.blacklist) {
            setBlacklist(filtersResponse.data.blacklist);
          }
        }
      } else {
        toast.error(response.message || 'Failed to save source filter');
      }
    } catch (error: any) {
      console.error('Error saving source filter:', error);
      toast.error(error?.response?.data?.message || 'Failed to save source filter');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFilter = async (filterType: 'whitelist' | 'blacklist') => {
    if (!templateId) return;

    if (!window.confirm(`Are you sure you want to remove the ${filterType}? This will allow all sources to be used.`)) {
      return;
    }

    try {
      setSaving(true);
      const response = await deleteSourceFilter(templateId, filterType);

      if (response.status === 1) {
        toast.success(`${filterType === 'whitelist' ? 'Whitelist' : 'Blacklist'} removed successfully`);
        if (filterType === 'whitelist') {
          setWhitelist(null);
          setWhitelistSources([]);
          setWhitelistCustomSources([]);
          setWhitelistNotes('');
        } else {
          setBlacklist(null);
          setBlacklistSources([]);
          setBlacklistCustomSources([]);
          setBlacklistNotes('');
        }
      } else {
        toast.error(response.message || 'Failed to delete source filter');
      }
    } catch (error: any) {
      console.error('Error deleting source filter:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete source filter');
    } finally {
      setSaving(false);
    }
  };

  const addSource = (filterType: 'whitelist' | 'blacklist', source: string) => {
    if (!source) return;
    
    if (filterType === 'whitelist') {
      if (!whitelistSources.includes(source)) {
        setWhitelistSources([...whitelistSources, source]);
        setSelectedWhitelistSource(''); // Reset dropdown
      }
    } else {
      if (!blacklistSources.includes(source)) {
        setBlacklistSources([...blacklistSources, source]);
        setSelectedBlacklistSource(''); // Reset dropdown
      }
    }
  };

  const removeSource = (filterType: 'whitelist' | 'blacklist', source: string) => {
    if (filterType === 'whitelist') {
      setWhitelistSources(whitelistSources.filter(s => s !== source));
    } else {
      setBlacklistSources(blacklistSources.filter(s => s !== source));
    }
  };

  const addCustomSource = (filterType: 'whitelist' | 'blacklist') => {
    const newSource = filterType === 'whitelist' ? newWhitelistCustomSource : newBlacklistCustomSource;
    if (!newSource.trim()) return;

    if (filterType === 'whitelist') {
      if (!whitelistCustomSources.includes(newSource.trim())) {
        setWhitelistCustomSources([...whitelistCustomSources, newSource.trim()]);
        setNewWhitelistCustomSource('');
      }
    } else {
      if (!blacklistCustomSources.includes(newSource.trim())) {
        setBlacklistCustomSources([...blacklistCustomSources, newSource.trim()]);
        setNewBlacklistCustomSource('');
      }
    }
  };

  const removeCustomSource = (filterType: 'whitelist' | 'blacklist', source: string) => {
    if (filterType === 'whitelist') {
      setWhitelistCustomSources(whitelistCustomSources.filter(s => s !== source));
    } else {
      setBlacklistCustomSources(blacklistCustomSources.filter(s => s !== source));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-600">Loading source filters...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Source Filtering</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Whitelist:</strong> Only the specified sources will be used when generating explanations.
                <br />
                <strong>Blacklist:</strong> The specified sources will be excluded from explanations.
                <br />
                <strong>Note:</strong> If both are set, whitelist takes precedence. When generating explanations, the AI will receive instructions to use or avoid these sources accordingly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Whitelist Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Source Whitelist
            </CardTitle>
            {whitelist && !readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteFilter('whitelist')}
                disabled={saving}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {whitelist ? (
            <div className="space-y-4">
              <div>
                <Label>Selected Sources</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {whitelistSources.map((source) => {
                    const option = sourceOptions.find(opt => opt.value === source);
                    return (
                      <Badge key={source} variant="secondary" className="flex items-center gap-1">
                        {option?.label || source}
                        {!readOnly && (
                          <button
                            onClick={() => removeSource('whitelist', source)}
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    );
                  })}
                  {whitelistCustomSources.map((source) => (
                    <Badge key={source} variant="secondary" className="flex items-center gap-1">
                      {source}
                      {!readOnly && (
                        <button
                          onClick={() => removeCustomSource('whitelist', source)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
              {whitelistNotes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{whitelistNotes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Add Sources</Label>
                <Select
                  value={selectedWhitelistSource}
                  onValueChange={(value) => {
                    addSource('whitelist', value);
                  }}
                  disabled={readOnly}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a source to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions
                      .filter(opt => !whitelistSources.includes(opt.value))
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Custom Sources</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter custom source name"
                    value={newWhitelistCustomSource}
                    onChange={(e) => setNewWhitelistCustomSource(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSource('whitelist');
                      }
                    }}
                    disabled={readOnly}
                  />
                  <Button
                    onClick={() => addCustomSource('whitelist')}
                    disabled={readOnly || !newWhitelistCustomSource.trim()}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {whitelistCustomSources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {whitelistCustomSources.map((source) => (
                      <Badge key={source} variant="secondary" className="flex items-center gap-1">
                        {source}
                        {!readOnly && (
                          <button
                            onClick={() => removeCustomSource('whitelist', source)}
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add notes about why these sources are whitelisted..."
                  value={whitelistNotes}
                  onChange={(e) => setWhitelistNotes(e.target.value)}
                  rows={3}
                  disabled={readOnly}
                />
              </div>

              {!readOnly && (
                <Button
                  onClick={() => handleSaveFilter('whitelist')}
                  disabled={saving || (whitelistSources.length === 0 && whitelistCustomSources.length === 0)}
                  className="w-full"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Whitelist
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {whitelist && !readOnly && (
            <div className="pt-4 border-t space-y-4">
              <div>
                <Label>Add More Sources</Label>
                <Select
                  value={selectedWhitelistSource}
                  onValueChange={(value) => {
                    addSource('whitelist', value);
                    handleSaveFilter('whitelist');
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a source to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions
                      .filter(opt => !whitelistSources.includes(opt.value))
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blacklist Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShieldOff className="w-5 h-5 text-red-600" />
              Source Blacklist
            </CardTitle>
            {blacklist && !readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteFilter('blacklist')}
                disabled={saving}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {blacklist ? (
            <div className="space-y-4">
              <div>
                <Label>Excluded Sources</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {blacklistSources.map((source) => {
                    const option = sourceOptions.find(opt => opt.value === source);
                    return (
                      <Badge key={source} variant="secondary" className="flex items-center gap-1">
                        {option?.label || source}
                        {!readOnly && (
                          <button
                            onClick={() => removeSource('blacklist', source)}
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    );
                  })}
                  {blacklistCustomSources.map((source) => (
                    <Badge key={source} variant="secondary" className="flex items-center gap-1">
                      {source}
                      {!readOnly && (
                        <button
                          onClick={() => removeCustomSource('blacklist', source)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
              {blacklistNotes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{blacklistNotes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Add Sources to Exclude</Label>
                <Select
                  value={selectedBlacklistSource}
                  onValueChange={(value) => {
                    addSource('blacklist', value);
                  }}
                  disabled={readOnly}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a source to exclude" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions
                      .filter(opt => !blacklistSources.includes(opt.value))
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Custom Sources</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter custom source name"
                    value={newBlacklistCustomSource}
                    onChange={(e) => setNewBlacklistCustomSource(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSource('blacklist');
                      }
                    }}
                    disabled={readOnly}
                  />
                  <Button
                    onClick={() => addCustomSource('blacklist')}
                    disabled={readOnly || !newBlacklistCustomSource.trim()}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {blacklistCustomSources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {blacklistCustomSources.map((source) => (
                      <Badge key={source} variant="secondary" className="flex items-center gap-1">
                        {source}
                        {!readOnly && (
                          <button
                            onClick={() => removeCustomSource('blacklist', source)}
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add notes about why these sources are blacklisted..."
                  value={blacklistNotes}
                  onChange={(e) => setBlacklistNotes(e.target.value)}
                  rows={3}
                  disabled={readOnly}
                />
              </div>

              {!readOnly && (
                <Button
                  onClick={() => handleSaveFilter('blacklist')}
                  disabled={saving || (blacklistSources.length === 0 && blacklistCustomSources.length === 0)}
                  className="w-full"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Blacklist
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {blacklist && !readOnly && (
            <div className="pt-4 border-t space-y-4">
              <div>
                <Label>Add More Sources</Label>
                <Select
                  value={selectedBlacklistSource}
                  onValueChange={(value) => {
                    addSource('blacklist', value);
                    handleSaveFilter('blacklist');
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a source to exclude" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions
                      .filter(opt => !blacklistSources.includes(opt.value))
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { PromptSourceFilters };
