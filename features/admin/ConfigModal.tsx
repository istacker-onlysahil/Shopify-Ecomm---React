import React from 'react';
import { Settings, AlertTriangle, X } from 'lucide-react';
import { ApiConfig } from '../../types/index';

interface ConfigModalProps {
  config: ApiConfig;
  setConfig: (config: ApiConfig) => void;
  onClose: () => void;
  onSave: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ config, setConfig, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative z-10 shadow-2xl animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors">
          <X size={20} />
        </button>
        
        <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
          <Settings size={20} />
          API Configuration
        </h3>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Config:</strong> Use a Storefront API Token for the best experience. Admin tokens may be blocked by browser security (CORS).
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Shop Domain</label>
            <input 
              type="text" 
              value={config.domain}
              onChange={e => setConfig({...config, domain: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-accent focus:border-accent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Access Token</label>
            <input 
              type="text" 
              value={config.accessToken}
              onChange={e => setConfig({...config, accessToken: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-accent focus:border-accent font-mono text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="isStorefront"
              checked={config.isStorefrontToken}
              onChange={e => setConfig({...config, isStorefrontToken: e.target.checked})}
              className="rounded text-accent focus:ring-accent"
            />
            <label htmlFor="isStorefront" className="text-sm text-gray-700">Is this a Storefront API Token?</label>
          </div>
          
          <div className="pt-4 flex justify-end">
             <button type="submit" className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-gray-800 transition-all active:scale-95">
               Save & Reload
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigModal;
