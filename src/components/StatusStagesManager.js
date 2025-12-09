import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';

const StatusStagesManager = () => {
  const [statusStages, setStatusStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [expandedStatusId, setExpandedStatusId] = useState(null);
  const [editingStepId, setEditingStepId] = useState(null);
  const [newStep, setNewStep] = useState({ name: '', order: 1, isActive: true });

  // Load status stages configuration
  useEffect(() => {
    const fetchStatusStages = async () => {
      try {
        const response = await fetch('/api/admin/status-stages');
        if (response.ok) {
          const config = await response.json();
          setStatusStages(config.stages);
        } else {
          setError('Gagal memuat konfigurasi status stages');
        }
      } catch (err) {
        setError('Gagal menghubungi server: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusStages();
  }, []);

  const handleSave = async () => {
    if (saving) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/status-stages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stages: statusStages }),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan konfigurasi');
      }

      alert('Konfigurasi status stages berhasil disimpan');
    } catch (err) {
      setError('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addStepToStatus = (statusId) => {
    const statusIndex = statusStages.findIndex(s => s.id === statusId);
    if (statusIndex === -1) return;

    const status = statusStages[statusIndex];
    const newStepWithId = {
      id: `step_${Date.now()}`,
      name: newStep.name,
      order: Math.max(...status.steps.map(s => s.order), 0) + 1,
      isActive: newStep.isActive
    };

    const updatedStages = [...statusStages];
    updatedStages[statusIndex] = {
      ...status,
      steps: [...status.steps, newStepWithId]
    };

    setStatusStages(updatedStages);
    setNewStep({ name: '', order: 1, isActive: true });
  };

  const updateStep = (statusId, stepId, field, value) => {
    const updatedStages = statusStages.map(status => {
      if (status.id === statusId) {
        return {
          ...status,
          steps: status.steps.map(step => 
            step.id === stepId ? { ...step, [field]: value } : step
          )
        };
      }
      return status;
    });

    setStatusStages(updatedStages);
  };

  const deleteStep = (statusId, stepId) => {
    const updatedStages = statusStages.map(status => {
      if (status.id === statusId) {
        return {
          ...status,
          steps: status.steps.filter(step => step.id !== stepId)
        };
      }
      return status;
    });

    setStatusStages(updatedStages);
  };

  const addNewStatus = () => {
    const newStatus = {
      id: `status_${Date.now()}`,
      name: 'Status Baru',
      steps: [
        { id: `step_${Date.now()}_1`, name: 'Langkah Pertama', order: 1, isActive: true }
      ]
    };

    setStatusStages([...statusStages, newStatus]);
  };

  const updateStatus = (statusId, field, value) => {
    const updatedStages = statusStages.map(status => 
      status.id === statusId ? { ...status, [field]: value } : status
    );

    setStatusStages(updatedStages);
  };

  const deleteStatus = (statusId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus status ini dan semua langkahnya?')) {
      setStatusStages(statusStages.filter(status => status.id !== statusId));
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manajemen Tahapan Status</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Manajemen Tahapan Status</h2>
        <div className="flex gap-2">
          <button
            onClick={addNewStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={16} />
            Tambah Status
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {statusStages.map((status) => (
          <div key={status.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={status.name}
                  onChange={(e) => updateStatus(status.id, 'name', e.target.value)}
                  className="text-lg font-bold text-gray-900 border border-gray-300 rounded px-3 py-1"
                />
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {status.id}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setExpandedStatusId(expandedStatusId === status.id ? null : status.id)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  {expandedStatusId === status.id ? 'Tutup' : 'Lihat Langkah'}
                </button>
                <button
                  onClick={() => deleteStatus(status.id)}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {expandedStatusId === status.id && (
              <div className="mt-4 space-y-3">
                <h4 className="font-medium text-gray-700">Langkah dalam Status Ini</h4>
                
                <div className="space-y-2">
                  {status.steps
                    .sort((a, b) => a.order - b.order)
                    .map((step) => (
                      <div key={step.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">
                          {step.order}
                        </span>
                        
                        {editingStepId === step.id ? (
                          <input
                            type="text"
                            value={step.name}
                            onChange={(e) => updateStep(status.id, step.id, 'name', e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') setEditingStepId(null);
                              if (e.key === 'Escape') setEditingStepId(null);
                            }}
                            onBlur={() => setEditingStepId(null)}
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="flex-1 cursor-pointer"
                            onClick={() => setEditingStepId(step.id)}
                          >
                            {step.name}
                          </span>
                        )}
                        
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={step.isActive}
                            onChange={(e) => updateStep(status.id, step.id, 'isActive', e.target.checked)}
                          />
                          Aktif
                        </label>
                        
                        <button
                          onClick={() => deleteStep(status.id, step.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Tambah langkah baru..."
                    value={newStep.name}
                    onChange={(e) => setNewStep({...newStep, name: e.target.value})}
                    className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newStep.name.trim()) {
                        addStepToStatus(status.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => addStepToStatus(status.id)}
                    disabled={!newStep.name.trim()}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusStagesManager;