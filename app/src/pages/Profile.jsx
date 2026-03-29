import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { defaultPets } from '../data/products';
import { useState } from 'react';

export default function Profile() {
  const { user, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  // If no user, user will be redirected or we show a simple message
  if (!user) {
    return (
      <div className="mesh-gradient min-h-screen flex items-center justify-center p-6">
        <div className="glass-panel p-10 rounded-3xl text-center max-w-md">
           <span className="material-symbols-outlined text-sage-dark text-6xl mb-4">lock</span>
           <h2 className="text-2xl font-black text-forest mb-2">Access Denied</h2>
           <p className="text-surface-variant font-medium">Please login to view your ethereal profile.</p>
        </div>
      </div>
    );
  }

  const memberPoints = profile?.points || 1250; // Mock points if not in DB
  const membershipLevel = memberPoints > 2000 ? 'Platinum Paws' : memberPoints > 1000 ? 'Gold Whisker' : 'Silver Tail';

  return (
    <div className="mesh-gradient min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel-strong p-8 sm:p-12 rounded-[2rem] antigravity-shadow mb-12 flex flex-col md:flex-row items-center gap-10"
        >
          <div className="relative">
            <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white/50 shadow-2xl shrink-0">
              <img 
                src={profile?.avatar_url || user.user_metadata?.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-2 -right-2 bg-sage-dark text-white p-3 rounded-full shadow-xl cursor-pointer border-2 border-white"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </motion.div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl font-black text-forest tracking-tight">
                {profile?.full_name || user.user_metadata?.full_name}
              </h1>
              <span className="inline-flex px-4 py-1.5 bg-sage/20 text-sage-dark text-xs font-black uppercase tracking-widest rounded-full border border-sage/30 mx-auto md:mx-0">
                {membershipLevel}
              </span>
            </div>
            <p className="text-surface-variant font-medium text-lg mb-6">{user.email}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white/30 p-4 rounded-2xl border border-white/40">
                <p className="text-[10px] uppercase font-bold text-surface-variant mb-1">Total Points</p>
                <p className="text-2xl font-black text-sage-dark">{memberPoints.toLocaleString()}</p>
              </div>
              <div className="bg-white/30 p-4 rounded-2xl border border-white/40">
                <p className="text-[10px] uppercase font-bold text-surface-variant mb-1">Pets Managed</p>
                <p className="text-2xl font-black text-sage-dark">{defaultPets.length}</p>
              </div>
              <div className="bg-white/30 p-4 rounded-2xl border border-white/40 hidden sm:block">
                <p className="text-[10px] uppercase font-bold text-surface-variant mb-1">Member Since</p>
                <p className="text-2xl font-black text-sage-dark">Mar 2026</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Navigation Tabs */}
          <div className="lg:col-span-3 space-y-4">
             <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-sage-dark text-white shadow-xl shadow-sage-dark/20' : 'glass-panel text-forest/70 hover:bg-white/50'}`}
             >
                <span className="material-symbols-outlined">account_circle</span>
                Information
             </button>
             <button 
              onClick={() => setActiveTab('pets')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'pets' ? 'bg-sage-dark text-white shadow-xl shadow-sage-dark/20' : 'glass-panel text-forest/70 hover:bg-white/50'}`}
             >
                <span className="material-symbols-outlined">pets</span>
                My Pets
             </button>
             <button 
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold glass-panel text-forest/70 hover:bg-white/50"
             >
                <span className="material-symbols-outlined">settings</span>
                Settings
             </button>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-9">
            {activeTab === 'profile' ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel p-8 sm:p-10 rounded-3xl space-y-8"
              >
                <h3 className="text-2xl font-black text-forest">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-surface-variant tracking-wider">Full Name</label>
                    <div className="px-6 py-4 bg-white/20 rounded-xl border border-white/40 font-bold text-forest">
                      {profile?.full_name || user.user_metadata?.full_name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-surface-variant tracking-wider">Email Address</label>
                    <div className="px-6 py-4 bg-white/20 rounded-xl border border-white/40 font-bold text-forest opacity-70">
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-surface-variant tracking-wider">Phone Number</label>
                    <div className="px-6 py-4 bg-white/20 rounded-xl border border-white/40 font-bold text-forest">
                      {profile?.phone || '+84 901 234 567'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-surface-variant tracking-wider">Location</label>
                    <div className="px-6 py-4 bg-white/20 rounded-xl border border-white/40 font-bold text-forest">
                      Vinhomes Grand Park, Ho Chi Minh City
                    </div>
                  </div>
                </div>
                <button className="btn-primary px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-sage-dark/20">
                  Update Information
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-forest">My Pet Sanctuary</h3>
                  <button className="bg-sage-dark text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-sage-dark/20 hover:scale-105 transition-transform">
                    Add New Pet
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {defaultPets.map(pet => (
                    <div key={pet.id} className="glass-panel p-6 rounded-3xl flex items-center gap-6 hover:shadow-xl transition-all border border-white/40">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white/50">
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-forest">{pet.name}</h4>
                        <p className="text-xs text-surface-variant font-medium mb-3">{pet.breed} • {pet.age}</p>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-sage/20 text-sage-dark text-[10px] font-bold rounded-full border border-sage/10">HEALTHY</span>
                          <span className="px-3 py-1 bg-sage/20 text-sage-dark text-[10px] font-bold rounded-full border border-sage/10">VACCINATED</span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white/30 rounded-full text-surface-variant hover:text-sage-dark transition-colors">
                        <span className="material-symbols-outlined text-sm">settings</span>
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
