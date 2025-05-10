const InfoTab = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Informasi Kampus</h3>
        
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <h4 className="font-medium text-indigo-800 mb-2">Tentang UIN Syarif Hidayatullah</h4>
          <p className="text-sm text-gray-700">
            UIN Syarif Hidayatullah Jakarta adalah salah satu perguruan tinggi Islam negeri terkemuka di Indonesia. 
            Terletak di Ciputat, Tangerang Selatan, kampus ini memiliki berbagai fasilitas modern dan program studi unggulan.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">Jam Operasional</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Senin - Jumat</span>
              <span className="font-medium">07:30 - 16:00</span>
            </div>
            <div className="flex justify-between">
              <span>Sabtu</span>
              <span className="font-medium">08:00 - 15:00</span>
            </div>
            <div className="flex justify-between">
              <span>Minggu</span>
              <span className="font-medium">Tutup</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">Kontak Penting</h4>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-gray-500">Rektorat</p>
              <p className="font-medium">(021) 7401925</p>
            </div>
            <div>
              <p className="text-gray-500">Bagian Akademik</p>
              <p className="font-medium">(021) 7401926</p>
            </div>
            <div>
              <p className="text-gray-500">Keamanan Kampus</p>
              <p className="font-medium">(021) 7401927</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">Transportasi Umum</h4>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-sm">Transjakarta</p>
              <p className="text-sm text-gray-600">Koridor 8 (Harmoni - Lebak Bulus) - Turun di Terminal Pondok Ranji</p>
            </div>
            <div>
              <p className="font-medium text-sm">KRL Commuter Line</p>
              <p className="text-sm text-gray-600">Stasiun Pondok Ranji (5 menit jalan kaki dari kampus)</p>
            </div>
            <div>
              <p className="font-medium text-sm">Angkot</p>
              <p className="text-sm text-gray-600">T01 (Terminal Pondok Ranji - Ciputat)</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default InfoTab;